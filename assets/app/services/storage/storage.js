const PREFIX = 'istante.v4.';
export function readJSON(key, fallback) {
    try {
        const raw = localStorage.getItem(PREFIX + key);
        return raw == null ? fallback : JSON.parse(raw);
    }
    catch {
        return fallback;
    }
}
export function writeJSON(key, value) {
    try {
        localStorage.setItem(PREFIX + key, JSON.stringify(value));
        return true;
    }
    catch {
        return false;
    }
}
export function remove(key) {
    try {
        localStorage.removeItem(PREFIX + key);
    }
    catch { }
}
export function readLegacyJSON(key, fallback = null) {
    try {
        const raw = localStorage.getItem('istante.original1.' + key);
        return raw == null ? fallback : JSON.parse(raw);
    }
    catch {
        return fallback;
    }
}
export function namespaceSnapshot() {
    const out = {};
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (!key || (!key.startsWith(PREFIX) && !key.startsWith('istante.original1.')))
            continue;
        out[key] = localStorage.getItem(key);
    }
    return out;
}
export function restoreSnapshot(entries = {}) {
    for (const [key, value] of Object.entries(entries)) {
        if (!key.startsWith('istante.'))
            continue;
        if (typeof value === 'string')
            localStorage.setItem(key, value);
    }
}
export function restoreSnapshotAtomic(entries = {}) {
    const rows = Object.entries(entries).filter(([key, value]) => key.startsWith('istante.') && typeof value === 'string');
    const previous = new Map();
    try {
        for (const [key, value] of rows) {
            previous.set(key, localStorage.getItem(key));
            localStorage.setItem(key, value);
        }
    }
    catch (error) {
        let rollbackOk = true;
        for (const [key, value] of previous) {
            try {
                if (value == null)
                    localStorage.removeItem(key);
                else
                    localStorage.setItem(key, value);
            }
            catch {
                rollbackOk = false;
            }
        }
        throw new Error(rollbackOk
            ? 'Memoria non disponibile o piena. Nessun dato è stato modificato.'
            : 'Ripristino incompleto. Mantieni il backup e ricarica la pagina prima di riprovare.', { cause: error });
    }
}
export { PREFIX };
