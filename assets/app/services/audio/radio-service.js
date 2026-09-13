import { loadJSON } from '../data-loader.js';
let stationsPromise = null;
export function loadStations() {
    stationsPromise ||= loadJSON('/data/stations.json');
    return stationsPromise;
}
export async function resolveStation(station) {
    const direct = station?.streams?.find(s => /^https?:/i.test(s.url));
    if (direct)
        return direct;
    const query = station?.lookup?.query || station?.name;
    if (!query)
        throw new Error('Questa stazione non ha un flusso riproducibile.');
    const endpoint = `https://de1.api.radio-browser.info/json/stations/search?name=${encodeURIComponent(query)}&hidebroken=true&limit=20&order=clickcount&reverse=true`;
    const response = await fetch(endpoint, { cache: 'no-store', headers: { Accept: 'application/json' } });
    if (!response.ok)
        throw new Error('Ricerca radio non disponibile.');
    const rows = await response.json();
    const allowedHosts = station.lookup?.hosts || [];
    const names = (station.lookup?.names || [station.name]).map(x => String(x).toLowerCase());
    const score = row => {
        const n = String(row.name || '').toLowerCase();
        const url = String(row.url_resolved || row.url || '');
        let value = names.some(name => n.includes(name) || name.includes(n)) ? 4 : 0;
        if (allowedHosts.some(host => url.includes(host)))
            value += 5;
        if (String(row.codec).toLowerCase().includes('mp3'))
            value += 1;
        return value;
    };
    const best = rows.filter(r => /^https?:/i.test(r.url_resolved || r.url || '')).sort((a, b) => score(b) - score(a))[0];
    if (!best)
        throw new Error('Nessun flusso disponibile per questa stazione.');
    return { url: best.url_resolved || best.url, label: best.codec || 'Stream', mime: '' };
}
