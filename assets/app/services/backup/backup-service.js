import { namespaceSnapshot, restoreSnapshotAtomic, writeJSON } from '../storage/storage.js';
import { APP_VERSION, STORAGE_SCHEMA } from '../../app/version.js';
const MAX_BYTES = 4 * 1024 * 1024;
const RUNTIME_KEYS = new Set([
    'istante.v4.photo',
    'istante.v4.photo-name',
    'istante.v4.weather-cache',
    'istante.v4.phrase-slot',
    'istante.v4.restore-marker',
    'istante.original1.photo',
    'istante.original1.forecast'
]);
function parse(raw, fallback = null) {
    try {
        return JSON.parse(raw);
    }
    catch {
        return fallback;
    }
}
function portableSources(input) {
    return (Array.isArray(input) ? input : []).map(source => {
        if (!source || typeof source !== 'object')
            return source;
        if (!source.url)
            return { ...source };
        return {
            id: source.id,
            name: source.name,
            url: source.url,
            enabled: source.enabled !== false,
            color: Number.isInteger(source.color) ? source.color : 0,
            updatedAt: 0,
            error: ''
        };
    });
}
function portableSettings(input) {
    if (!input || typeof input !== 'object' || Array.isArray(input))
        return input;
    return input.background === 'photo' ? { ...input, background: 'ambient' } : { ...input };
}
function sanitizeSnapshot(snapshot) {
    const out = { ...snapshot };
    for (const key of RUNTIME_KEYS)
        delete out[key];
    if (out['istante.v4.settings']) {
        const value = portableSettings(parse(out['istante.v4.settings'], {}));
        out['istante.v4.settings'] = JSON.stringify(value);
    }
    if (out['istante.original1.settings']) {
        const value = portableSettings(parse(out['istante.original1.settings'], {}));
        out['istante.original1.settings'] = JSON.stringify(value);
    }
    if (out['istante.v4.calendar']) {
        const calendar = parse(out['istante.v4.calendar'], null);
        if (calendar && typeof calendar === 'object') {
            calendar.sources = portableSources(calendar.sources);
            out['istante.v4.calendar'] = JSON.stringify(calendar);
        }
    }
    if (out['istante.original1.calendars.v1']) {
        out['istante.original1.calendars.v1'] = JSON.stringify(portableSources(parse(out['istante.original1.calendars.v1'], [])));
    }
    return out;
}
function legacyPayloadToSnapshot(payload) {
    const data = payload?.data;
    if (!data || typeof data !== 'object' || Array.isArray(data))
        throw new Error('Backup Istante 3.x non valido.');
    const entries = {};
    const put = (key, value) => { if (value !== undefined)
        entries[`istante.original1.${key}`] = JSON.stringify(value); };
    put('settings', portableSettings(data.settings || {}));
    put('favorites', Array.isArray(data.favorites) ? data.favorites : []);
    if (data.radioLibrary)
        put('radioLibrary', data.radioLibrary);
    if (data.radioUrls)
        put('radioUrls', data.radioUrls);
    if (Object.hasOwn(data, 'collection'))
        put('collection', data.collection);
    if (Object.hasOwn(data, 'phraseHistory'))
        put('phrase-history.v1', data.phraseHistory);
    if (Object.hasOwn(data, 'phraseCollections'))
        put('phrase-collections.v1', data.phraseCollections);
    if (Object.hasOwn(data, 'calendars'))
        put('calendars.v1', portableSources(data.calendars));
    if (Object.hasOwn(data, 'place'))
        put('place', data.place);
    return entries;
}
export function createBackup() {
    const storage = sanitizeSnapshot(namespaceSnapshot());
    return {
        product: 'Istante',
        format: 4,
        schema: STORAGE_SCHEMA,
        appVersion: APP_VERSION,
        createdAt: new Date().toISOString(),
        portability: {
            personalPhotoIncluded: false,
            weatherCacheIncluded: false,
            linkedCalendarsStoredAsUrl: true
        },
        storage
    };
}
export function restoreBackup(payload) {
    let storage;
    let sourceVersion = 'sconosciuta';
    if (payload?.product === 'Istante' && payload?.format === 4 && payload.storage && typeof payload.storage === 'object') {
        storage = sanitizeSnapshot(payload.storage);
        sourceVersion = payload.appVersion || '4.x';
    }
    else if (payload?.format === 'istante-backup' && [1, 2].includes(payload?.schemaVersion)) {
        storage = legacyPayloadToSnapshot(payload);
        sourceVersion = payload.appVersion || '3.x';
    }
    else {
        throw new Error('Backup Istante non valido o non compatibile.');
    }
    restoreSnapshotAtomic(storage);
    writeJSON('restore-marker', { at: Date.now(), from: sourceVersion });
    return true;
}
export function downloadBackup() {
    const text = JSON.stringify(createBackup(), null, 2) + '\n';
    const blob = new Blob([text], { type: 'application/json;charset=utf-8' });
    if (blob.size > MAX_BYTES)
        throw new Error('Il backup supera 4 MB. Esporta separatamente le raccolte più grandi.');
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `istante-backup-${new Date().toISOString().slice(0, 19).replace(/[T:]/g, '-')}.json`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}
export { MAX_BYTES, portableSources, sanitizeSnapshot };
