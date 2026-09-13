let context = null;
let last = 0;
function audioContext() {
    const Ctx = globalThis.AudioContext || globalThis.webkitAudioContext;
    if (!Ctx)
        return null;
    if (!context)
        context = new Ctx();
    if (context.state === 'suspended')
        context.resume().catch(() => { });
    return context;
}
export function playTouch(type = 'soft', volume = 28) {
    const c = audioContext();
    if (!c)
        return;
    const now = c.currentTime;
    const level = Math.max(.0001, Math.min(1, volume / 100)) * .52;
    const gain = c.createGain();
    gain.connect(c.destination);
    gain.gain.setValueAtTime(.0001, now);
    gain.gain.exponentialRampToValueAtTime(level, now + .003);
    if (type === 'paper') {
        gain.gain.exponentialRampToValueAtTime(.0001, now + .075);
        const buffer = c.createBuffer(1, Math.floor(c.sampleRate * .06), c.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < data.length; i++)
            data[i] = (Math.random() * 2 - 1) * (1 - i / data.length);
        const source = c.createBufferSource();
        const filter = c.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.value = 1750;
        filter.Q.value = .8;
        source.buffer = buffer;
        source.connect(filter);
        filter.connect(gain);
        source.start(now);
        source.stop(now + .065);
        return;
    }
    gain.gain.exponentialRampToValueAtTime(.0001, now + .11);
    const oscillator = c.createOscillator();
    oscillator.type = type === 'wood' ? 'triangle' : 'sine';
    oscillator.frequency.setValueAtTime(type === 'glass' ? 980 : type === 'wood' ? 205 : 420, now);
    oscillator.frequency.exponentialRampToValueAtTime(type === 'glass' ? 620 : type === 'wood' ? 118 : 330, now + .08);
    oscillator.connect(gain);
    oscillator.start(now);
    oscillator.stop(now + .12);
}
export function installTouchFeedback(getSettings) {
    const selector = 'button,a,summary,input,select,textarea,[role="button"],[role="switch"],label.file-button';
    const handler = event => {
        if (event.button != null && event.button !== 0)
            return;
        if (!event.target?.closest?.(selector))
            return;
        const settings = getSettings();
        if (!settings.touchSoundEnabled || Date.now() - last < 38)
            return;
        last = Date.now();
        playTouch(settings.touchSoundType, settings.touchSoundVolume);
    };
    document.addEventListener('pointerdown', handler, { capture: true, passive: true });
    return () => document.removeEventListener('pointerdown', handler, true);
}
