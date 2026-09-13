const ADJACENT = Object.freeze({ a: 's', b: 'v', c: 'x', d: 's', e: 'r', f: 'g', g: 'h', h: 'g', i: 'o', j: 'h', k: 'l', l: 'k', m: 'n', n: 'm', o: 'i', p: 'o', q: 'w', r: 't', s: 'a', t: 'r', u: 'y', v: 'b', w: 'q', x: 'c', y: 'u', z: 'x' });
function characters(text) {
    return [...String(text || '')].map((char, index, all) => ({ char, wordStart: index === 0 || /\s/u.test(all[index - 1]) }));
}
export function typingPlan(text, settings = {}, rng = Math.random) {
    const chars = characters(text);
    const steps = [];
    const base = Number(settings.typingSpeed) || 35;
    const natural = settings.typingRhythm !== 'steady';
    const delay = (char, wordStart) => Math.round(base * (natural ? 0.58 + rng() * 1.5 : 1)
        + (natural && wordStart ? 45 + rng() * 110 : 0)
        + (/[.,;:!?]/u.test(char) ? 160 + (natural ? rng() * 280 : 0) : 0));
    const candidates = chars.map((entry, index) => ({ ...entry, index }))
        .filter(({ char, index }) => index > 4 && index < chars.length - 4 && /^[a-z]$/i.test(char));
    const mistakes = new Set();
    if (settings.typingMistakes !== 'off' && candidates.length) {
        const chance = settings.typingMistakes === 'often' ? 0.95 : 0.5;
        if (rng() < chance) {
            mistakes.add(candidates[Math.floor(rng() * candidates.length)].index);
            if (settings.typingMistakes === 'often' && chars.length > 60)
                mistakes.add(candidates[Math.floor(rng() * candidates.length)].index);
        }
    }
    chars.forEach(({ char, wordStart }, index) => {
        if (mistakes.has(index)) {
            let wrong = ADJACENT[char.toLowerCase()] || 'e';
            if (char !== char.toLowerCase())
                wrong = wrong.toUpperCase();
            steps.push({ kind: 'mistake', glyph: wrong, wait: 380 + rng() * 330 });
            steps.push({ kind: 'erase', wait: 100 + rng() * 120 });
        }
        steps.push({ kind: 'type', glyph: char, wait: delay(char, wordStart) });
    });
    return steps;
}
export function erasePlan(text, speed = 35, rng = Math.random) {
    const length = [...String(text || '')].length;
    return Array.from({ length }, () => ({ kind: 'erase', wait: Math.max(12, Math.round(speed * (0.25 + rng() * 0.22))) }));
}
