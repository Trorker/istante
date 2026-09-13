import { expand, cleanSources, parse } from './ics-core.js';
import { source as holidaySource } from './holidays.js';
const DIRECT_TIMEOUT = 6000;
const PROXY_URL = 'https://api.istante.ruslan-dzyuba.it/calendar.php';
function timeoutSignal(ms) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), ms);
    return { signal: controller.signal, done: () => clearTimeout(timer) };
}
async function fetchText(url, timeout = DIRECT_TIMEOUT) {
    const guard = timeoutSignal(timeout);
    try {
        const response = await fetch(url, { cache: 'no-store', signal: guard.signal, headers: { Accept: 'text/calendar,text/plain,*/*' } });
        if (!response.ok)
            throw new Error(`HTTP ${response.status}`);
        return await response.text();
    }
    finally {
        guard.done();
    }
}
export async function fetchCalendarUrl(url) {
    let directError = null;
    try {
        const text = await fetchText(url);
        parse(text);
        return { text, via: 'direct' };
    }
    catch (error) {
        directError = error;
    }
    try {
        const target = `${PROXY_URL}?url=${encodeURIComponent(url)}&_=${Date.now()}`;
        const text = await fetchText(target, 10000);
        parse(text);
        return { text, via: 'proxy' };
    }
    catch (proxyError) {
        throw new Error(`Impossibile caricare il calendario. Diretto: ${directError?.message || 'errore'}; proxy: ${proxyError.message}`);
    }
}
export async function refreshSources(sources) {
    const output = [];
    const warnings = [];
    for (const source of sources) {
        const item = { ...source };
        if (item.url && item.enabled !== false) {
            try {
                const result = await fetchCalendarUrl(item.url);
                item.ics = result.text;
                item.updatedAt = Date.now();
                item.lastVia = result.via;
                item.error = '';
            }
            catch (error) {
                item.error = error.message;
                warnings.push(`${item.name}: ${error.message}`);
            }
        }
        output.push(item);
    }
    return { sources: output, warnings };
}
export function expandRange(sources, from, to, includeHolidays = false) {
    const active = [...sources];
    if (includeHolidays) {
        const startYear = new Date(from).getFullYear() - 1;
        const endYear = new Date(to).getFullYear() + 1;
        active.push(holidaySource(startYear, endYear));
    }
    return expand(active, from, to);
}
export function validateSources(sources) {
    return cleanSources(sources);
}
