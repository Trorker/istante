/* Italian national holidays, offline. Rules documented in docs/VISIONE-E-DESIGN.md. */
'use strict';
function easter(y) { const a = y % 19, b = Math.floor(y / 100), c = y % 100, d = Math.floor(b / 4), e = b % 4, f = Math.floor((b + 8) / 25), g = Math.floor((b - f + 1) / 3), h = (19 * a + b - d - g + 15) % 30, i = Math.floor(c / 4), k = c % 4, l = (32 + 2 * e + 2 * i - h - k) % 7, m = Math.floor((a + 11 * h + 22 * l) / 451), n = h + l - 7 * m + 114; return new Date(y, Math.floor(n / 31) - 1, n % 31 + 1, 12); }
const date = d => d.getFullYear() + String(d.getMonth() + 1).padStart(2, '0') + String(d.getDate()).padStart(2, '0');
function source(first, last) {
    const lines = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Istante//Festivita IT//IT', 'X-WR-CALNAME:Festivita italiane'];
    for (let y = first; y <= last; y++) {
        const fixed = [[1, 1, 'Capodanno'], [1, 6, 'Epifania'], [4, 25, 'Festa della Liberazione'], [5, 1, 'Festa del Lavoro'], [6, 2, 'Festa della Repubblica'], [8, 15, 'Ferragosto'], [11, 1, 'Ognissanti'], [12, 8, 'Immacolata Concezione'], [12, 25, 'Natale'], [12, 26, 'Santo Stefano']];
        if (y >= 2026)
            fixed.push([10, 4, 'San Francesco d\u2019Assisi']);
        const p = easter(y), m = new Date(+p);
        m.setDate(m.getDate() + 1);
        const entries = fixed.map(([mo, d, title]) => ({ day: new Date(y, mo - 1, d, 12), title }));
        entries.push({ day: p, title: 'Pasqua' }, { day: m, title: 'Luned\u00ec dell\u2019Angelo' });
        for (const { day, title } of entries) {
            const end = new Date(+day);
            end.setDate(end.getDate() + 1);
            lines.push('BEGIN:VEVENT', 'UID:it-' + date(day) + '@istante', 'DTSTART;VALUE=DATE:' + date(day), 'DTEND;VALUE=DATE:' + date(end), 'SUMMARY:' + title, 'END:VEVENT');
        }
    }
    lines.push('END:VCALENDAR');
    return { id: 'cal-festivita-it', name: 'Festivit\u00e0 italiane', color: 4, ics: lines.join('\r\n'), enabled: true, url: '', updatedAt: 0 };
}
export { easter, source };
