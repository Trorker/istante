/* Local QR encoder, adapted from python-qrcode (BSD-3-Clause). */
'use strict';
const BLOCKS = [[1, 26, 16], [1, 44, 28], [1, 70, 44], [2, 50, 32], [2, 67, 43], [4, 43, 27], [4, 49, 31], [2, 60, 38, 2, 61, 39], [3, 58, 36, 2, 59, 37], [4, 69, 43, 1, 70, 44], [1, 80, 50, 4, 81, 51], [6, 58, 36, 2, 59, 37], [8, 59, 37, 1, 60, 38], [4, 64, 40, 5, 65, 41], [5, 65, 41, 5, 66, 42], [7, 73, 45, 3, 74, 46], [10, 74, 46, 1, 75, 47], [9, 69, 43, 4, 70, 44], [3, 70, 44, 11, 71, 45], [3, 67, 41, 13, 68, 42], [17, 68, 42], [17, 74, 46], [4, 75, 47, 14, 76, 48], [6, 73, 45, 14, 74, 46], [8, 75, 47, 13, 76, 48], [19, 74, 46, 4, 75, 47], [22, 73, 45, 3, 74, 46], [3, 73, 45, 23, 74, 46], [21, 73, 45, 7, 74, 46], [19, 75, 47, 10, 76, 48], [2, 74, 46, 29, 75, 47], [10, 74, 46, 23, 75, 47], [14, 74, 46, 21, 75, 47], [14, 74, 46, 23, 75, 47], [12, 75, 47, 26, 76, 48], [6, 75, 47, 34, 76, 48], [29, 74, 46, 14, 75, 47], [13, 74, 46, 32, 75, 47], [40, 75, 47, 7, 76, 48], [18, 75, 47, 31, 76, 48]], POSITIONS = [[], [6, 18], [6, 22], [6, 26], [6, 30], [6, 34], [6, 22, 38], [6, 24, 42], [6, 26, 46], [6, 28, 50], [6, 30, 54], [6, 32, 58], [6, 34, 62], [6, 26, 46, 66], [6, 26, 48, 70], [6, 26, 50, 74], [6, 30, 54, 78], [6, 30, 56, 82], [6, 30, 58, 86], [6, 34, 62, 90], [6, 28, 50, 72, 94], [6, 26, 50, 74, 98], [6, 30, 54, 78, 102], [6, 28, 54, 80, 106], [6, 32, 58, 84, 110], [6, 30, 58, 86, 114], [6, 34, 62, 90, 118], [6, 26, 50, 74, 98, 122], [6, 30, 54, 78, 102, 126], [6, 26, 52, 78, 104, 130], [6, 30, 56, 82, 108, 134], [6, 34, 60, 86, 112, 138], [6, 30, 58, 86, 114, 142], [6, 34, 62, 90, 118, 146], [6, 30, 54, 78, 102, 126, 150], [6, 24, 50, 76, 102, 128, 154], [6, 28, 54, 80, 106, 132, 158], [6, 32, 58, 84, 110, 136, 162], [6, 26, 54, 82, 110, 138, 166], [6, 30, 58, 86, 114, 142, 170]];
const exp = new Uint8Array(512), log = new Uint8Array(256);
let value = 1;
for (let i = 0; i < 255; i++) {
    exp[i] = value;
    log[value] = i;
    value <<= 1;
    if (value & 256)
        value ^= 285;
}
for (let i = 255; i < 512; i++)
    exp[i] = exp[i - 255];
const mul = (a, b) => a && b ? exp[log[a] + log[b]] : 0;
function ecc(data, n) { let gen = [1]; for (let i = 0; i < n; i++) {
    const next = Array(gen.length + 1).fill(0);
    gen.forEach((x, j) => { next[j] ^= x; next[j + 1] ^= mul(x, exp[i]); });
    gen = next;
} const work = data.concat(Array(n).fill(0)); for (let i = 0; i < data.length; i++) {
    const lead = work[i];
    if (lead)
        for (let j = 0; j < gen.length; j++)
            work[i + j] ^= mul(gen[j], lead);
} return work.slice(-n); }
function blockList(v) { const raw = BLOCKS[v - 1], a = []; for (let i = 0; i < raw.length; i += 3)
    for (let j = 0; j < raw[i]; j++)
        a.push({ total: raw[i + 1], data: raw[i + 2] }); return a; }
function encode(text) {
    const bytes = Array.from(text, ch => ch.charCodeAt(0));
    if (bytes.some(x => x > 127))
        throw Error('Il QR richiede un URL ASCII.');
    let v = 1, blocks, cap;
    for (; v <= 40; v++) {
        blocks = blockList(v);
        cap = blocks.reduce((n, b) => n + b.data, 0) * 8;
        if (4 + (v < 10 ? 8 : 16) + bytes.length * 8 <= cap)
            break;
    }
    if (v > 40)
        throw Error('La frase condivisa supera la capacità del QR.');
    const bits = [];
    function put(n, len) { for (let i = len - 1; i >= 0; i--)
        bits.push((n >>> i) & 1); }
    put(4, 4);
    put(bytes.length, v < 10 ? 8 : 16);
    bytes.forEach(b => put(b, 8));
    put(0, Math.min(4, cap - bits.length));
    while (bits.length % 8)
        bits.push(0);
    const data = [];
    for (let i = 0; i < bits.length; i += 8)
        data.push(bits.slice(i, i + 8).reduce((n, b) => (n << 1) | b, 0));
    while (data.length < cap / 8)
        data.push(data.length % 2 === Math.ceil(bits.length / 8) % 2 ? 236 : 17);
    let offset = 0;
    const ds = [], es = [];
    for (const b of blocks) {
        const d = data.slice(offset, offset + b.data);
        offset += b.data;
        ds.push(d);
        es.push(ecc(d, b.total - b.data));
    }
    const out = [];
    for (let i = 0; i < Math.max(...ds.map(d => d.length)); i++)
        for (const d of ds)
            if (i < d.length)
                out.push(d[i]);
    for (let i = 0; i < Math.max(...es.map(d => d.length)); i++)
        for (const d of es)
            if (i < d.length)
                out.push(d[i]);
    return { v, data: out };
}
function bch(x, poly, shift) { let d = x << shift; const degree = n => 32 - Math.clz32(n); while (degree(d) >= degree(poly))
    d ^= poly << (degree(d) - degree(poly)); return (x << shift) | d; }
function matrix(text, forcedMask) {
    const { v, data } = encode(text), n = v * 4 + 17;
    const mask = (m, r, c) => [() => ((r + c) % 2 === 0), () => r % 2 === 0, () => c % 3 === 0, () => (r + c) % 3 === 0, () => (Math.floor(r / 2) + Math.floor(c / 3)) % 2 === 0, () => r * c % 2 + r * c % 3 === 0, () => (r * c % 2 + r * c % 3) % 2 === 0, () => (r * c % 3 + (r + c) % 2) % 2 === 0][m]();
    function make(m) {
        const a = Array.from({ length: n }, () => Array(n).fill(null));
        function finder(row, col) { for (let r = -1; r <= 7; r++)
            for (let c = -1; c <= 7; c++) {
                if (row + r < 0 || row + r >= n || col + c < 0 || col + c >= n)
                    continue;
                a[row + r][col + c] = r >= 0 && r <= 6 && (c === 0 || c === 6) || c >= 0 && c <= 6 && (r === 0 || r === 6) || r >= 2 && r <= 4 && c >= 2 && c <= 4;
            } }
        finder(0, 0);
        finder(n - 7, 0);
        finder(0, n - 7);
        for (const r of POSITIONS[v - 1])
            for (const c of POSITIONS[v - 1]) {
                if (a[r][c] !== null)
                    continue;
                for (let dr = -2; dr <= 2; dr++)
                    for (let dc = -2; dc <= 2; dc++)
                        a[r + dr][c + dc] = Math.abs(dr) === 2 || Math.abs(dc) === 2 || dr === 0 && dc === 0;
            }
        for (let i = 8; i < n - 8; i++) {
            if (a[i][6] === null)
                a[i][6] = i % 2 === 0;
            if (a[6][i] === null)
                a[6][i] = i % 2 === 0;
        }
        const info = bch(m, 0x537, 10) ^ 0x5412;
        for (let i = 0; i < 15; i++) {
            const bit = !!((info >> i) & 1);
            a[i < 6 ? i : i < 8 ? i + 1 : n - 15 + i][8] = bit;
            a[8][i < 8 ? n - i - 1 : i === 8 ? 7 : 14 - i] = bit;
        }
        a[n - 8][8] = true;
        if (v >= 7) {
            const version = bch(v, 0x1f25, 12);
            for (let i = 0; i < 18; i++) {
                const bit = !!((version >> i) & 1);
                a[Math.floor(i / 3)][i % 3 + n - 11] = bit;
                a[i % 3 + n - 11][Math.floor(i / 3)] = bit;
            }
        }
        let row = n - 1, inc = -1, bit = 7, byte = 0;
        for (let col = n - 1; col > 0; col -= 2) {
            if (col === 6)
                col--;
            while (true) {
                for (let k = 0; k < 2; k++) {
                    const c = col - k;
                    if (a[row][c] !== null)
                        continue;
                    let dark = byte < data.length ? !!((data[byte] >> bit) & 1) : false;
                    if (mask(m, row, c))
                        dark = !dark;
                    a[row][c] = dark;
                    if (--bit < 0) {
                        byte++;
                        bit = 7;
                    }
                }
                row += inc;
                if (row < 0 || row >= n) {
                    row -= inc;
                    inc = -inc;
                    break;
                }
            }
        }
        return a;
    }
    function score(a) { let score = 0, dark = 0; for (let r = 0; r < n; r++)
        for (let c = 0; c < n; c++) {
            if (a[r][c])
                dark++;
            if (r && c && a[r][c] === a[r - 1][c] && a[r][c] === a[r][c - 1] && a[r][c] === a[r - 1][c - 1])
                score += 3;
        } for (let dir = 0; dir < 2; dir++)
        for (let r = 0; r < n; r++) {
            const line = Array.from({ length: n }, (_, c) => dir ? a[c][r] : a[r][c]);
            let run = 1;
            for (let c = 1; c < n; c++) {
                if (line[c] === line[c - 1])
                    run++;
                else {
                    if (run >= 5)
                        score += run - 2;
                    run = 1;
                }
            }
            if (run >= 5)
                score += run - 2;
            const str = line.map(x => x ? '1' : '0').join('');
            for (let c = 0; c < n - 10; c++)
                if (['00001011101', '10111010000'].includes(str.slice(c, c + 11)))
                    score += 40;
        } return score + Math.floor(Math.abs(dark * 100 / n / n - 50) / 5) * 10; }
    if (Number.isInteger(forcedMask))
        return make(forcedMask);
    let best = null, low = Infinity;
    for (let m = 0; m < 8; m++) {
        const a = make(m), s = score(a);
        if (s < low) {
            best = a;
            low = s;
        }
    }
    return best;
}
export { matrix };
