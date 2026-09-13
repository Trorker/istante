export const AMBIENT_NAMES = Object.freeze({
    pink: 'Rumore rosa',
    brown: 'Rumore marrone',
    rain: 'Pioggia',
    wind: 'Vento'
});
export const MELODY_NAMES = Object.freeze({
    aurora: 'Respiro lento',
    vetro: 'Meditazione',
    notturno: 'Notturno',
    orizzonte: 'Onde lente'
});
const MELODY_PATTERNS = Object.freeze({
    aurora: { root: 45, fifth: 52, air: 57, cycle: 14, tone: 0.64 },
    vetro: { bells: [48, 52, 50, 55, 47], drone: [29, 36], tone: 0.62 },
    notturno: { chords: [[45, 52, 57], [43, 50, 55], [40, 47, 52], [38, 45, 50]], top: [64, 62, 59, 57], tone: 0.72 },
    orizzonte: { roots: [38, 45, 40, 47], fifths: [57, 64, 59, 66], tone: 0.58 }
});
const midi = note => 440 * Math.pow(2, (note - 69) / 12);
function assertShape(kind, names, sampleRate, count, label) {
    if (!names[kind] || !Number.isFinite(sampleRate) || sampleRate < 8000 || !Number.isSafeInteger(count) || count < 1 || count > sampleRate * 30) {
        throw new Error(`Parametri ${label} non validi.`);
    }
}
export function generateNoise(kind, sampleRate, count, rng = Math.random) {
    assertShape(kind, AMBIENT_NAMES, sampleRate, count, 'audio');
    const seam = Math.min(Math.round(sampleRate * 0.15), Math.floor(count / 4));
    const raw = new Float32Array(count + seam);
    const bands = new Float64Array(9);
    const coefficients = Array.from({ length: 9 }, (_, i) => Math.exp(-2 * Math.PI * (25 * 2 ** i) / sampleRate));
    let brown = 0;
    let mean = 0;
    for (let i = 0; i < raw.length; i++) {
        const white = rng() * 2 - 1;
        let pink = 0;
        for (let j = 0; j < bands.length; j++) {
            bands[j] = coefficients[j] * bands[j] + (1 - coefficients[j]) * white;
            pink += bands[j] / Math.sqrt(1 - coefficients[j]);
        }
        pink /= 14;
        brown = 0.998 * brown + 0.018 * white;
        const value = kind === 'brown' ? brown : kind === 'pink' ? pink : kind === 'wind' ? brown * 0.85 + pink * 0.10 : pink * 0.32 + white * 0.18;
        raw[i] = value;
        mean += value;
    }
    mean /= raw.length;
    const out = new Float32Array(count);
    let sum = 0;
    let peak = 0;
    for (let i = 0; i < count; i++) {
        let value = raw[i] - mean;
        if (i < seam) {
            const t = (i + 0.5) / seam * Math.PI / 2;
            value = (raw[i] - mean) * Math.sin(t) + (raw[count + i] - mean) * Math.cos(t);
        }
        out[i] = value;
        sum += value * value;
        peak = Math.max(peak, Math.abs(value));
    }
    const gain = Math.min(0.16 / Math.max(0.00001, Math.sqrt(sum / count)), 0.80 / Math.max(0.00001, peak));
    for (let i = 0; i < count; i++)
        out[i] *= gain;
    return out;
}
export function generateMelody(kind, sampleRate, count) {
    assertShape(kind, MELODY_NAMES, sampleRate, count, 'melodia');
    const pattern = MELODY_PATTERNS[kind];
    const left = new Float32Array(count);
    const right = new Float32Array(count);
    const tau = Math.PI * 2;
    let peak = 0.001;
    const softBell = (phase, decay = 5.4) => phase < 0.035 ? phase / 0.035 : Math.exp(-(phase - 0.035) * decay);
    const smooth01 = value => value * value * (3 - 2 * value);
    for (let i = 0; i < count; i++) {
        const t = i / sampleRate;
        let l = 0;
        let r = 0;
        if (kind === 'aurora') {
            const phase = t % pattern.cycle;
            let breathe;
            if (phase < 4)
                breathe = 0.07 + 0.93 * smooth01(phase / 4);
            else if (phase < 8) {
                const hold = (phase - 4) / 4;
                breathe = 0.985 + 0.015 * Math.sin(Math.PI * hold);
            }
            else
                breathe = 0.07 + 0.93 * (1 - smooth01((phase - 8) / 6));
            const root = midi(pattern.root), fifth = midi(pattern.fifth), air = midi(pattern.air);
            const body = (Math.sin(tau * root * t) * 0.37 + Math.sin(tau * fifth * t) * 0.18) * breathe;
            const halo = Math.sin(tau * air * t) * 0.042 * Math.pow(breathe, 1.55);
            l = (body + halo * 0.70) * pattern.tone;
            r = ((Math.sin(tau * root * 1.001 * t) * 0.36 + Math.sin(tau * fifth * 0.999 * t) * 0.19) * breathe + halo) * pattern.tone;
        }
        else if (kind === 'vetro') {
            const bellStep = 5;
            const bellIndex = Math.floor(t / bellStep);
            const phase = (t % bellStep) / bellStep;
            const root = midi(pattern.drone[Math.floor(t / 10) % pattern.drone.length]);
            const bedSwell = 0.34 + 0.66 * Math.pow(Math.sin(Math.PI * ((t % 10) / 10)), 0.72);
            const bed = (Math.sin(tau * root * t) * 0.24 + Math.sin(tau * root * 1.5 * t) * 0.045) * bedSwell;
            const note = midi(pattern.bells[bellIndex % pattern.bells.length]);
            const env = softBell(phase, 5.7);
            const bowl = (Math.sin(tau * note * t) + 0.13 * Math.sin(tau * note * 1.5 * t) + 0.035 * Math.sin(tau * note * 2.01 * t)) * env * 0.17;
            const side = bellIndex % 2 === 0;
            l = (bed + bowl * (side ? 0.74 : 1)) * pattern.tone;
            r = (bed * 0.98 + bowl * (side ? 1 : 0.74)) * pattern.tone;
        }
        else if (kind === 'notturno') {
            const chordSeconds = 5;
            const index = Math.floor(t / chordSeconds) % pattern.chords.length;
            const local = (t % chordSeconds) / chordSeconds;
            const chord = pattern.chords[index];
            const breathe = Math.pow(Math.sin(Math.PI * local), 0.72);
            const f0 = midi(chord[0]), f1 = midi(chord[1]), f2 = midi(chord[2]);
            const chordL = (Math.sin(tau * f0 * t) * 0.46 + Math.sin(tau * f1 * t) * 0.33 + Math.sin(tau * f2 * t) * 0.24) * breathe * 0.20;
            const chordR = (Math.sin(tau * f0 * 1.001 * t) * 0.44 + Math.sin(tau * f1 * 0.999 * t) * 0.34 + Math.sin(tau * f2 * 1.002 * t) * 0.25) * breathe * 0.20;
            const topStep = 2.5;
            const topPhase = (t % topStep) / topStep;
            const topIndex = Math.floor(t / topStep) % pattern.top.length;
            const tf = midi(pattern.top[topIndex]);
            const topEnv = Math.pow(Math.sin(Math.PI * topPhase), 1.4);
            const top = Math.sin(tau * tf * t) * topEnv * 0.055;
            l = (chordL + top * 0.72) * pattern.tone;
            r = (chordR + top) * pattern.tone;
        }
        else {
            const waveSeconds = 5;
            const section = Math.floor(t / waveSeconds) % pattern.roots.length;
            const phase = (t % waveSeconds) / waveSeconds;
            const eased = smooth01(phase < 0.5 ? phase * 2 : (1 - phase) * 2);
            const root = midi(pattern.roots[section]);
            const fifth = midi(pattern.fifths[section]);
            const next = midi(pattern.roots[(section + 1) % pattern.roots.length]);
            const current = (Math.sin(tau * root * t) * 0.30 + Math.sin(tau * fifth * t) * 0.15) * eased;
            const cross = 0.5 - 0.5 * Math.cos(Math.PI * phase);
            const wash = Math.sin(tau * next * 0.5 * t) * 0.08 * cross;
            const shimmer = Math.sin(tau * fifth * 2.002 * t) * 0.025 * (0.35 + 0.65 * eased);
            l = (current + wash + shimmer * 0.7) * pattern.tone;
            r = ((Math.sin(tau * root * 1.001 * t) * 0.29 + Math.sin(tau * fifth * 0.999 * t) * 0.16) * eased + wash * 0.94 + shimmer) * pattern.tone;
        }
        left[i] = l;
        right[i] = r;
        peak = Math.max(peak, Math.abs(l), Math.abs(r));
    }
    const seam = Math.min(Math.round(sampleRate * 0.24), Math.floor(count / 5));
    const makeUp = { aurora: 1.72, vetro: 1.86, notturno: 1.32, orizzonte: 1.42 }[kind] || 1;
    const normalizer = Math.min(makeUp, 0.74 / peak);
    for (let i = 0; i < count; i++) {
        let fade = 1;
        if (i < seam)
            fade = Math.sin((i / seam) * Math.PI / 2);
        else if (i > count - seam)
            fade = Math.sin(((count - i) / seam) * Math.PI / 2);
        left[i] *= normalizer * fade;
        right[i] *= normalizer * fade;
    }
    return [left, right];
}
