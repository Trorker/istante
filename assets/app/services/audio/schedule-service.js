const DAY_LABELS = ['Dom', 'Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab'];
export function toMinute(value) { if (!/^\d\d:\d\d$/.test(String(value)))
    return null; const [h, m] = value.split(':').map(Number); return h < 24 && m < 60 ? h * 60 + m : null; }
export function normalizeSchedule(row, index = 0) { const days = [...new Set(String(row?.days ?? '0,1,2,3,4,5,6').split(',').filter(d => /^[0-6]$/.test(d)))].sort().join(','); return { id: /^[a-z0-9-]{1,80}$/i.test(row?.id || '') ? row.id : `slot-${index}`, name: String(row?.name || `Fascia ${index + 1}`).slice(0, 48), enabled: row?.enabled !== false, start: toMinute(row?.start) != null ? row.start : '09:00', stop: toMinute(row?.stop) != null ? row.stop : '18:00', days }; }
function activeForDate(slot, date) { if (!slot.enabled || !slot.days)
    return false; const now = date.getHours() * 60 + date.getMinutes(), start = toMinute(slot.start), stop = toMinute(slot.stop); if (start == null || stop == null || start === stop)
    return false; const day = String(date.getDay()), prev = String((date.getDay() + 6) % 7); if (start < stop)
    return slot.days.split(',').includes(day) && now >= start && now < stop; return (slot.days.split(',').includes(day) && now >= start) || (slot.days.split(',').includes(prev) && now < stop); }
export function activeSchedule(rows, date = new Date()) { return (rows || []).map(normalizeSchedule).find(slot => activeForDate(slot, date)) || null; }
export function nextSchedule(rows, date = new Date()) { const slots = (rows || []).map(normalizeSchedule).filter(x => x.enabled && x.days && x.start !== x.stop); let best = null; for (let delta = 0; delta < 8; delta++) {
    const d = new Date(date.getFullYear(), date.getMonth(), date.getDate() + delta);
    for (const slot of slots) {
        if (!slot.days.split(',').includes(String(d.getDay())))
            continue;
        const start = toMinute(slot.start), candidate = new Date(d.getFullYear(), d.getMonth(), d.getDate(), Math.floor(start / 60), start % 60);
        if (candidate <= date)
            continue;
        if (!best || candidate < best.at)
            best = { slot, at: candidate };
    }
} return best; }
export function scheduleSummary(rows, date = new Date()) { const active = activeSchedule(rows, date); if (active)
    return `Attiva · ${active.name} fino alle ${active.stop}`; const next = nextSchedule(rows, date); if (!next)
    return 'Nessuna fascia programmata'; const day = next.at.toDateString() === date.toDateString() ? 'oggi' : DAY_LABELS[next.at.getDay()]; return `Prossimo avvio ${day} alle ${next.slot.start}`; }
