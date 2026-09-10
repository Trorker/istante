<?php
declare(strict_types=1);

/*
 * Istante 3.14.1 - read-only ICS relay.
 *
 * Why this exists:
 * browsers cannot read many Google / Outlook / iCloud / custom ICS feeds
 * directly because those endpoints do not expose permissive CORS headers.
 * The private feed URL is sent in the POST body so it is not normally written
 * into web-server access logs as part of the request URL.
 */

const ISTANTE_MAX_ICS_BYTES = 1048576; // 1 MiB
const ISTANTE_MAX_REDIRECTS = 4;
const ISTANTE_CONNECT_TIMEOUT = 5;
const ISTANTE_TOTAL_TIMEOUT = 12;

header('X-Istante-ICS-Proxy: 1');
header('X-Content-Type-Options: nosniff');
header('Referrer-Policy: no-referrer');
header('X-Robots-Tag: noindex, nofollow, noarchive');
header('Cache-Control: private, no-store, max-age=0');

function fail(int $status, string $message): never
{
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode(['error' => $message], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

function isPublicIp(string $ip): bool
{
    return filter_var(
        $ip,
        FILTER_VALIDATE_IP,
        FILTER_FLAG_NO_PRIV_RANGE | FILTER_FLAG_NO_RES_RANGE
    ) !== false;
}

/** @return array{host:string,port:int,pinned:string} */
function validateTarget(string $url): array
{
    if (strlen($url) > 4096) {
        fail(400, 'Il link ICS è troppo lungo.');
    }

    $parts = parse_url($url);
    if (!is_array($parts) || strtolower((string)($parts['scheme'] ?? '')) !== 'https') {
        fail(400, 'Sono accettati solo link ICS HTTPS.');
    }
    if (isset($parts['user']) || isset($parts['pass'])) {
        fail(400, 'Il link non può contenere credenziali user/password.');
    }

    $host = trim((string)($parts['host'] ?? ''), '[]');
    if ($host === '' || strlen($host) > 253) {
        fail(400, 'Host del calendario non valido.');
    }

    $port = (int)($parts['port'] ?? 443);
    if ($port !== 443) {
        fail(400, 'Per sicurezza il calendario deve usare la porta HTTPS 443.');
    }

    // IP literals are allowed only when globally routable.
    if (filter_var($host, FILTER_VALIDATE_IP)) {
        if (!isPublicIp($host)) {
            fail(403, 'Gli indirizzi locali, privati o riservati non sono consentiti.');
        }
        return ['host' => $host, 'port' => $port, 'pinned' => $host];
    }

    $records = @dns_get_record($host, DNS_A | DNS_AAAA);
    $ips = [];
    if (is_array($records)) {
        foreach ($records as $record) {
            if (!empty($record['ip'])) {
                $ips[] = (string)$record['ip'];
            } elseif (!empty($record['ipv6'])) {
                $ips[] = (string)$record['ipv6'];
            }
        }
    }
    if (!$ips) {
        $v4 = @gethostbynamel($host);
        if (is_array($v4)) {
            $ips = array_values($v4);
        }
    }
    $ips = array_values(array_unique($ips));
    if (!$ips) {
        fail(502, 'Impossibile risolvere il server del calendario.');
    }

    // Reject the entire host if DNS exposes even one private/reserved address.
    foreach ($ips as $ip) {
        if (!isPublicIp($ip)) {
            fail(403, 'Il server del calendario risolve verso una rete non consentita.');
        }
    }

    // Prefer IPv4 where available. CURLOPT_RESOLVE pins cURL to the address we
    // just validated, avoiding a second DNS lookup to a different/private IP.
    $pinned = $ips[0];
    foreach ($ips as $ip) {
        if (filter_var($ip, FILTER_VALIDATE_IP, FILTER_FLAG_IPV4)) {
            $pinned = $ip;
            break;
        }
    }
    return ['host' => $host, 'port' => $port, 'pinned' => $pinned];
}

function normalizePath(string $path): string
{
    $segments = [];
    foreach (explode('/', $path) as $segment) {
        if ($segment === '' || $segment === '.') {
            continue;
        }
        if ($segment === '..') {
            array_pop($segments);
            continue;
        }
        $segments[] = $segment;
    }
    return '/' . implode('/', $segments);
}

function redirectUrl(string $base, string $location): string
{
    $location = trim($location);
    if ($location === '') {
        fail(502, 'Redirect del calendario senza destinazione.');
    }
    if (preg_match('~^https://~i', $location)) {
        return $location;
    }
    if (preg_match('~^[a-z][a-z0-9+.-]*:~i', $location)) {
        fail(502, 'Il calendario ha rediretto verso un protocollo non consentito.');
    }

    $baseParts = parse_url($base);
    if (!is_array($baseParts) || empty($baseParts['host'])) {
        fail(502, 'Redirect ICS non valido.');
    }
    $authority = 'https://' . $baseParts['host'];
    if (isset($baseParts['port']) && (int)$baseParts['port'] !== 443) {
        $authority .= ':' . (int)$baseParts['port'];
    }
    if (str_starts_with($location, '//')) {
        return 'https:' . $location;
    }
    if (str_starts_with($location, '?')) {
        return $authority . ($baseParts['path'] ?? '/') . $location;
    }

    $hash = strpos($location, '#');
    if ($hash !== false) {
        $location = substr($location, 0, $hash);
    }
    $query = '';
    $q = strpos($location, '?');
    if ($q !== false) {
        $query = substr($location, $q);
        $location = substr($location, 0, $q);
    }

    if (str_starts_with($location, '/')) {
        return $authority . normalizePath($location) . $query;
    }
    $basePath = (string)($baseParts['path'] ?? '/');
    $dir = str_ends_with($basePath, '/') ? $basePath : substr($basePath, 0, (int)strrpos($basePath, '/') + 1);
    return $authority . normalizePath($dir . $location) . $query;
}

/** @return array{status:int,body:string,location:?string} */
function fetchOne(string $url): array
{
    $target = validateTarget($url);

    if (!function_exists('curl_init')) {
        fail(500, 'Sul server PHP manca l’estensione cURL, necessaria per i calendari ICS.');
    }
    $body = '';
    $tooLarge = false;
    $location = null;

    $ch = curl_init($url);
    if ($ch === false) {
        fail(500, 'Impossibile inizializzare la connessione al calendario.');
    }

    $pin = filter_var($target['pinned'], FILTER_VALIDATE_IP, FILTER_FLAG_IPV6)
        ? '[' . $target['pinned'] . ']'
        : $target['pinned'];

    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => false,
        CURLOPT_FOLLOWLOCATION => false,
        CURLOPT_CONNECTTIMEOUT => ISTANTE_CONNECT_TIMEOUT,
        CURLOPT_TIMEOUT => ISTANTE_TOTAL_TIMEOUT,
        CURLOPT_USERAGENT => 'Istante/3.14.1 ICS relay',
        CURLOPT_HTTPHEADER => [
            'Accept: text/calendar, text/plain;q=0.9, */*;q=0.1',
            'Cache-Control: no-cache',
            'Pragma: no-cache',
        ],
        CURLOPT_ENCODING => '',
        CURLOPT_PROTOCOLS => CURLPROTO_HTTPS,
        CURLOPT_SSL_VERIFYPEER => true,
        CURLOPT_SSL_VERIFYHOST => 2,
        CURLOPT_RESOLVE => [$target['host'] . ':' . $target['port'] . ':' . $pin],
        CURLOPT_HEADERFUNCTION => static function ($handle, string $line) use (&$location): int {
            if (stripos($line, 'Location:') === 0) {
                $location = trim(substr($line, 9));
            }
            return strlen($line);
        },
        CURLOPT_WRITEFUNCTION => static function ($handle, string $chunk) use (&$body, &$tooLarge): int {
            if (strlen($body) + strlen($chunk) > ISTANTE_MAX_ICS_BYTES) {
                $tooLarge = true;
                return 0;
            }
            $body .= $chunk;
            return strlen($chunk);
        },
    ]);

    $ok = curl_exec($ch);
    $status = (int)curl_getinfo($ch, CURLINFO_RESPONSE_CODE);
    $error = curl_error($ch);
    $errno = curl_errno($ch);
    curl_close($ch);

    if ($tooLarge) {
        fail(413, 'Il feed ICS supera il limite di 1 MB.');
    }
    if ($ok === false) {
        $message = $errno === CURLE_OPERATION_TIMEDOUT
            ? 'Il server del calendario non ha risposto in tempo.'
            : 'Impossibile leggere il calendario remoto.';
        // Do not expose remote URLs or lower-level TLS/DNS details to clients.
        if ($error === '') {
            $message = 'Impossibile leggere il calendario remoto.';
        }
        fail(502, $message);
    }

    return ['status' => $status, 'body' => $body, 'location' => $location];
}

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    header('Allow: POST');
    fail(405, 'Usa una richiesta POST dalla pagina Istante.');
}

if (strtolower((string)($_SERVER['HTTP_SEC_FETCH_SITE'] ?? '')) === 'cross-site') {
    fail(403, 'Richiesta cross-site non consentita.');
}

$contentType = strtolower(trim(explode(';', (string)($_SERVER['CONTENT_TYPE'] ?? ''))[0]));
if ($contentType !== 'application/json') {
    fail(415, 'Formato richiesta non supportato.');
}

$raw = file_get_contents('php://input');
if ($raw === false || strlen($raw) > 8192) {
    fail(400, 'Richiesta non valida.');
}
$data = json_decode($raw, true);
if (!is_array($data) || !isset($data['url']) || !is_string($data['url'])) {
    fail(400, 'Manca il link ICS.');
}

$url = trim($data['url']);
for ($redirects = 0; $redirects <= ISTANTE_MAX_REDIRECTS; $redirects++) {
    $result = fetchOne($url);
    $status = $result['status'];

    if ($status >= 300 && $status < 400) {
        if ($redirects >= ISTANTE_MAX_REDIRECTS) {
            fail(502, 'Troppi redirect durante la lettura del calendario.');
        }
        if (!$result['location']) {
            fail(502, 'Redirect del calendario non valido.');
        }
        $url = redirectUrl($url, $result['location']);
        continue;
    }

    if ($status < 200 || $status >= 300) {
        fail(502, 'Il fornitore del calendario ha risposto HTTP ' . $status . '.');
    }

    $body = $result['body'];
    $head = strtoupper(substr(ltrim($body, "\xEF\xBB\xBF\x00\x09\x0A\x0D\x20"), 0, 4096));
    if ($body === '' || strpos($head, 'BEGIN:VCALENDAR') === false) {
        fail(502, 'La risposta del fornitore non è un calendario ICS valido.');
    }

    header('Content-Type: text/calendar; charset=utf-8');
    header('Content-Length: ' . strlen($body));
    echo $body;
    exit;
}

fail(502, 'Impossibile completare la lettura del calendario.');
