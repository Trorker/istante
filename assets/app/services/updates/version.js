export function versionParts(v) { return String(v || '0').split('.').map(x => parseInt(x, 10) || 0); }
export function newer(a, b) { const x = versionParts(a), y = versionParts(b); for (let i = 0; i < Math.max(x.length, y.length); i++) {
    if ((x[i] || 0) !== (y[i] || 0))
        return (x[i] || 0) > (y[i] || 0);
} return false; }
