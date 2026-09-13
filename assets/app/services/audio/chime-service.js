let context = null;
function ctx() { const Ctx = globalThis.AudioContext || globalThis.webkitAudioContext; if (!Ctx)
    return null; if (!context)
    context = new Ctx(); return context; }
function minute(value) { if (!/^\d\d:\d\d$/.test(String(value)))
    return null; const [h, m] = value.split(':').map(Number); return h < 24 && m < 60 ? h * 60 + m : null; }
function inQuiet(now, settings) { if (!settings.chimeQuiet)
    return false; const start = minute(settings.chimeQuietStart), end = minute(settings.chimeQuietEnd); if (start == null || end == null || start === end)
    return false; const n = now.getHours() * 60 + now.getMinutes(); return start < end ? n >= start && n < end : n >= start || n < end; }
export function playChime(type = 'bowl', volume = 40) { const c = ctx(); if (!c)
    return; const now = c.currentTime, g = c.createGain(); g.connect(c.destination); g.gain.setValueAtTime(.0001, now); g.gain.exponentialRampToValueAtTime(Math.max(.008, volume / 100 * .18), now + .02); g.gain.exponentialRampToValueAtTime(.0001, now + 1.7); const frequencies = type === 'fork' ? [440, 880] : [392, 523.25, 783.99]; for (const [i, f] of frequencies.entries()) {
    const o = c.createOscillator();
    o.type = i ? 'sine' : 'triangle';
    o.frequency.value = f;
    const og = c.createGain();
    og.gain.value = 1 / (i + 1);
    o.connect(og).connect(g);
    o.start(now + i * .025);
    o.stop(now + 1.8);
} }
export function installHourlyChime(getSettings) { let lastKey = ''; const tick = () => { const s = getSettings(), now = new Date(), key = `${now.getFullYear()}-${now.getMonth()}-${now.getDate()}-${now.getHours()}`; if (!s.chimeEnabled || now.getMinutes() !== 0 || key === lastKey || inQuiet(now, s))
    return; lastKey = key; playChime(s.chimeType, s.chimeVolume); }; const timer = setInterval(tick, 15000); tick(); return () => clearInterval(timer); }
