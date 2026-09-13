const BASE = 'https://istante.ruslan-dzyuba.it/';
export function makeShareLink(phrase) { if (typeof phrase !== 'string' || !phrase.trim() || phrase.length > 1000)
    throw new Error('Frase non valida per la condivisione.'); const data = JSON.stringify({ v: 1, p: phrase }), bytes = new TextEncoder().encode(data); let binary = ''; bytes.forEach(b => binary += String.fromCharCode(b)); return BASE + '#p=' + btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, ''); }
export function parseShareLink(hash = location.hash) { if (!hash.startsWith('#p='))
    return null; const token = hash.slice(3); if (token.length > 6000 || !/^[A-Za-z0-9_-]+$/.test(token))
    throw new Error('Link condiviso non valido.'); try {
    const padded = token.replace(/-/g, '+').replace(/_/g, '/').padEnd(Math.ceil(token.length / 4) * 4, '=');
    const bytes = Uint8Array.from(atob(padded), ch => ch.charCodeAt(0));
    const d = JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(bytes));
    if (d.v !== 1 || typeof d.p !== 'string' || !d.p.trim() || d.p.length > 1000)
        throw new Error();
    return d.p;
}
catch {
    throw new Error('Questo pensiero non può essere letto: link incompleto o non valido.');
} }
