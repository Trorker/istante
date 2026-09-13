export const WEEKDAYS = ['L', 'M', 'M', 'G', 'V', 'S', 'D'];
export const WEEKDAY_LONG = ['lunedì', 'martedì', 'mercoledì', 'giovedì', 'venerdì', 'sabato', 'domenica'];
export const MONTHS = ['gennaio', 'febbraio', 'marzo', 'aprile', 'maggio', 'giugno', 'luglio', 'agosto', 'settembre', 'ottobre', 'novembre', 'dicembre'];
export function iso(d) { return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; }
export function monday(date) { const d = new Date(date.getFullYear(), date.getMonth(), date.getDate()); d.setDate(d.getDate() - ((d.getDay() + 6) % 7)); return d; }
export function addDays(date, n) { const d = new Date(date); d.setDate(d.getDate() + n); return d; }
export function monthCells(year, month) { const first = new Date(year, month, 1), start = monday(first), cells = []; for (let i = 0; i < 42; i++)
    cells.push(addDays(start, i)); const last = new Date(year, month + 1, 0), weeks = Math.ceil((((first.getDay() + 6) % 7) + last.getDate()) / 7); return { cells: cells.slice(0, weeks * 7), weeks }; }
export function sameDay(a, b) { return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate(); }
export function formatTime(ms) { return new Intl.DateTimeFormat('it-IT', { hour: '2-digit', minute: '2-digit' }).format(new Date(ms)); }
