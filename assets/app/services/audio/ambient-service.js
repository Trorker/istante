import { generateNoise, generateMelody } from './sound-generators.js';
let context = null;
let activeSource = null;
let activeGain = null;
let activeKind = '';
let activeFamily = '';
const cache = new Map();
function getContext() {
    const AudioContextClass = globalThis.AudioContext || globalThis.webkitAudioContext;
    if (!AudioContextClass)
        throw new Error('Web Audio non disponibile su questo dispositivo.');
    return context ||= new AudioContextClass();
}
function clamp(value) { return Math.max(0, Math.min(100, Number(value) || 0)); }
function ambientLevel(volume) { return Math.pow(clamp(volume) / 100, 1.6) * 0.9; }
function melodyLevel(volume) { return Math.pow(clamp(volume) / 100, 1.35) * 1.08; }
function stopCurrent() {
    if (activeSource) {
        try {
            activeSource.stop();
        }
        catch { }
        try {
            activeSource.disconnect();
        }
        catch { }
    }
    if (activeGain) {
        try {
            activeGain.disconnect();
        }
        catch { }
    }
    activeSource = null;
    activeGain = null;
    activeKind = '';
    activeFamily = '';
}
function noiseAudioBuffer(c, kind) {
    const key = `noise:${kind}:${c.sampleRate}`;
    if (cache.has(key))
        return cache.get(key);
    const count = Math.round(c.sampleRate * 6);
    const samples = generateNoise(kind, c.sampleRate, count);
    const buffer = c.createBuffer(1, count, c.sampleRate);
    buffer.copyToChannel(samples, 0);
    cache.set(key, buffer);
    return buffer;
}
function melodyAudioBuffer(c, kind) {
    const key = `melody:${kind}:${c.sampleRate}`;
    if (cache.has(key))
        return cache.get(key);
    const count = Math.round(c.sampleRate * 28);
    const [left, right] = generateMelody(kind, c.sampleRate, count);
    const buffer = c.createBuffer(2, count, c.sampleRate);
    buffer.copyToChannel(left, 0);
    buffer.copyToChannel(right, 1);
    cache.set(key, buffer);
    return buffer;
}
async function playBuffer(buffer, family, kind, level) {
    const c = getContext();
    await c.resume();
    stopCurrent();
    const gain = c.createGain();
    gain.gain.value = level;
    gain.connect(c.destination);
    const source = c.createBufferSource();
    source.buffer = buffer;
    source.loop = true;
    source.connect(gain);
    source.start();
    activeSource = source;
    activeGain = gain;
    activeKind = kind;
    activeFamily = family;
}
export async function playAmbient(kind = 'brown', volume = 35) {
    const c = getContext();
    await playBuffer(noiseAudioBuffer(c, kind), 'ambient', kind, ambientLevel(volume));
}
export function stopAmbient() {
    if (activeFamily === 'ambient')
        stopCurrent();
}
export function setAmbientVolume(volume) {
    if (!activeGain || activeFamily !== 'ambient')
        return;
    const c = getContext();
    activeGain.gain.setTargetAtTime(ambientLevel(volume), c.currentTime, 0.06);
}
export async function playMelody(kind = 'notturno', volume = 32) {
    const c = getContext();
    await playBuffer(melodyAudioBuffer(c, kind), 'melody', kind, melodyLevel(volume));
}
export function stopMelody() {
    if (activeFamily === 'melody')
        stopCurrent();
}
export function setMelodyVolume(volume) {
    if (!activeGain || activeFamily !== 'melody')
        return;
    const c = getContext();
    activeGain.gain.setTargetAtTime(melodyLevel(volume), c.currentTime, 0.06);
}
export function getGeneratedAudioState() {
    return { family: activeFamily, kind: activeKind, playing: Boolean(activeSource) };
}
