<?php
declare(strict_types=1);
header('Content-Type: text/calendar; charset=utf-8');
$body=json_decode(file_get_contents('php://input') ?: '{}', true);
$url=trim((string)($body['url'] ?? ''));
if (!$url || !str_starts_with(strtolower($url),'https://')) { http_response_code(400); exit('URL non valida'); }
$ch=curl_init($url); curl_setopt_array($ch,[CURLOPT_RETURNTRANSFER=>true,CURLOPT_FOLLOWLOCATION=>true,CURLOPT_MAXREDIRS=>4,CURLOPT_CONNECTTIMEOUT=>5,CURLOPT_TIMEOUT=>15,CURLOPT_USERAGENT=>'Istante/4.0']);
$data=curl_exec($ch); $status=(int)curl_getinfo($ch,CURLINFO_HTTP_CODE); curl_close($ch);
if ($data===false || $status>=400) { http_response_code(502); exit('Calendario non disponibile'); } echo $data;
