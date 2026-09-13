import { matrix } from './qr.js';
function rounded(ctx, x, y, w, h, r) { ctx.beginPath(); ctx.roundRect(x, y, w, h, r); ctx.fill(); }
function wrap(ctx, text, maxWidth) { const words = String(text || '').split(/\s+/), lines = []; let line = ''; for (const word of words) {
    const test = line ? `${line} ${word}` : word;
    if (ctx.measureText(test).width > maxWidth && line) {
        lines.push(line);
        line = word;
    }
    else
        line = test;
} if (line)
    lines.push(line); return lines; }
function drawQr(ctx, url, x, y, size, ink, paper) { const qr = matrix(url), n = qr.length, quiet = 4, cell = size / (n + quiet * 2); ctx.fillStyle = paper; ctx.fillRect(x, y, size, size); ctx.fillStyle = ink; for (let r = 0; r < n; r++)
    for (let c = 0; c < n; c++)
        if (qr[r][c])
            ctx.fillRect(x + (c + quiet) * cell, y + (r + quiet) * cell, Math.ceil(cell), Math.ceil(cell)); }
export function renderShareCard(canvas, snapshot) { const w = 1080, h = 1350, dpr = Math.max(1, Math.min(2, devicePixelRatio || 1)); canvas.width = w * dpr; canvas.height = h * dpr; canvas.style.aspectRatio = `${w}/${h}`; const ctx = canvas.getContext('2d'); ctx.scale(dpr, dpr); const light = snapshot.theme === 'light', paper = light ? '#f1eee7' : '#131615', surface = light ? '#e8e3da' : '#1b1f1d', ink = light ? '#232521' : '#efeee8', muted = light ? '#666b63' : '#9ca59d', accent = light ? '#7c896d' : '#bac9a8'; ctx.fillStyle = paper; ctx.fillRect(0, 0, w, h); ctx.fillStyle = surface; rounded(ctx, 56, 56, w - 112, h - 112, 38); ctx.fillStyle = ink; ctx.font = '500 42px Arial, sans-serif'; ctx.fillText('Istante', 92, 126); ctx.fillStyle = accent; ctx.beginPath(); ctx.arc(237, 118, 5, 0, Math.PI * 2); ctx.fill(); if (snapshot.time) {
    ctx.fillStyle = ink;
    ctx.font = '300 118px Arial, sans-serif';
    ctx.fillText(snapshot.time, 92, 290);
    ctx.fillStyle = muted;
    ctx.font = '22px Arial, sans-serif';
    ctx.fillText(snapshot.date || '', 96, 336);
} ctx.fillStyle = accent; ctx.font = '600 16px Arial, sans-serif'; ctx.fillText('UN PENSIERO PER TE', 94, 470); ctx.fillStyle = ink; ctx.font = '400 50px Georgia, serif'; const lines = wrap(ctx, snapshot.phrase, w - 220).slice(0, 9); let y = 535; for (const line of lines) {
    ctx.fillText(line, 94, y);
    y += 68;
} const details = []; if (snapshot.weather)
    details.push(snapshot.weather); if (snapshot.goal)
    details.push(snapshot.goal); if (snapshot.station)
    details.push(snapshot.station); if (details.length) {
    ctx.strokeStyle = light ? '#d3cdc2' : '#343a36';
    ctx.beginPath();
    ctx.moveTo(94, 970);
    ctx.lineTo(986, 970);
    ctx.stroke();
    ctx.fillStyle = muted;
    ctx.font = '20px Arial, sans-serif';
    details.forEach((t, i) => ctx.fillText(t, 94, 1020 + i * 34));
} const qrSize = 182; drawQr(ctx, snapshot.link, 94, 1090, qrSize, ink, paper); ctx.fillStyle = muted; ctx.font = '16px Arial, sans-serif'; ctx.fillText('Scansiona per aprire questo pensiero', 300, 1160); ctx.fillStyle = ink; ctx.font = '500 18px Arial, sans-serif'; ctx.fillText('istante.ruslan-dzyuba.it', 300, 1196); ctx.save(); ctx.translate(1020, 1250); ctx.rotate(-Math.PI / 2); ctx.fillStyle = muted; ctx.font = '14px Arial, sans-serif'; ctx.fillText('by ♥ Ruslan Dzyuba · Istante', 0, 0); ctx.restore(); return canvas; }
export function canvasBlob(canvas) { return new Promise((resolve, reject) => canvas.toBlob(blob => blob ? resolve(blob) : reject(new Error('Immagine non disponibile.')), 'image/png', .95)); }
export async function downloadShareCard(canvas) { const blob = await canvasBlob(canvas), url = URL.createObjectURL(blob), a = document.createElement('a'); a.href = url; a.download = 'istante.png'; a.click(); setTimeout(() => URL.revokeObjectURL(url), 1000); return blob; }
