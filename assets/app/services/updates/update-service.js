import { APP_VERSION, UPDATE_GRACE_MS } from '../../app/version.js';
import { newer } from './version.js';
import { useAppStore } from '../../stores/app-store.js';
let registration = null;
let autoTimer = 0;
function seenKey(version) { return `istante:update:first-seen:${version}`; }
function getFirstSeen(version) { let value = Number(localStorage.getItem(seenKey(version))); if (!value) {
    value = Date.now();
    localStorage.setItem(seenKey(version), String(value));
} return value; }
function waitForWorker(reg) { return reg?.waiting || reg?.installing || null; }
async function activateWaiting() {
    const app = useAppStore();
    const update = app.state.update;
    update.installing = true;
    update.error = '';
    try {
        registration ||= await navigator.serviceWorker.getRegistration();
        if (!registration)
            throw new Error('Service worker non disponibile.');
        await registration.update().catch(() => { });
        let worker = registration.waiting;
        if (!worker && registration.installing) {
            worker = registration.installing;
            await new Promise(resolve => { const done = () => { if (worker.state === 'installed' || worker.state === 'activated' || worker.state === 'redundant')
                resolve(); }; worker.addEventListener('statechange', done); setTimeout(resolve, 8000); });
            worker = registration.waiting || worker;
        }
        if (!worker)
            throw new Error('La nuova copia non è ancora pronta. Riprovo automaticamente.');
        worker.postMessage({ type: 'ACTIVATE_UPDATE' });
        setTimeout(() => location.reload(), 1300);
    }
    catch (e) {
        update.error = e.message;
        update.installing = false;
        throw e;
    }
}
function scheduleAuto() { clearTimeout(autoTimer); const u = useAppStore().state.update; if (!u.available || !u.autoAt)
    return; const delay = u.autoAt - Date.now(); if (delay <= 0) {
    activateWaiting().catch(() => { });
    return;
} autoTimer = setTimeout(() => activateWaiting().catch(() => { }), Math.min(delay, 2147483647)); }
export async function checkForUpdate() {
    if (!('serviceWorker' in navigator))
        return null;
    const app = useAppStore();
    try {
        const response = await fetch(`/version.json?_=${Date.now()}`, { cache: 'no-store' });
        if (!response.ok)
            return null;
        const info = await response.json();
        if (!newer(info.version, APP_VERSION)) {
            app.state.update.available = false;
            return info;
        }
        const firstSeenAt = getFirstSeen(info.version), autoAt = firstSeenAt + UPDATE_GRACE_MS;
        Object.assign(app.state.update, { available: true, version: info.version, firstSeenAt, autoAt, error: '' });
        registration ||= await navigator.serviceWorker.getRegistration();
        await registration?.update().catch(() => { });
        app.state.update.ready = !!registration?.waiting;
        scheduleAuto();
        return info;
    }
    catch (e) {
        return null;
    }
}
export async function initUpdates() {
    if (!('serviceWorker' in navigator))
        return;
    registration = await navigator.serviceWorker.register('/sw.js', { scope: '/' });
    navigator.serviceWorker.addEventListener('controllerchange', () => location.reload());
    registration.addEventListener('updatefound', () => { const worker = registration.installing; if (!worker)
        return; worker.addEventListener('statechange', () => { if (worker.state === 'installed' && navigator.serviceWorker.controller) {
        useAppStore().state.update.ready = true;
    } }); });
    await checkForUpdate();
    addEventListener('online', checkForUpdate);
    document.addEventListener('visibilitychange', () => { if (!document.hidden)
        checkForUpdate(); });
    setInterval(checkForUpdate, 15 * 60 * 1000);
}
export async function updateNow() { return activateWaiting(); }
