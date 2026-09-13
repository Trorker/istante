export const DEVICE = Object.freeze({ PHONE: 'phone', TABLET: 'tablet', DESKTOP: 'desktop', TV: 'tv' });
export function classifyDevice(width = innerWidth) {
    if (width <= 740)
        return DEVICE.PHONE;
    if (width <= 1180)
        return DEVICE.TABLET;
    if (width <= 1799)
        return DEVICE.DESKTOP;
    return DEVICE.TV;
}
export function readViewport() {
    const width = Math.max(1, innerWidth || document.documentElement.clientWidth || 1);
    const height = Math.max(1, innerHeight || document.documentElement.clientHeight || 1);
    return {
        width,
        height,
        device: classifyDevice(width),
        orientation: width >= height ? 'landscape' : 'portrait',
        heightClass: height <= 620 ? 'compact' : height >= 980 ? 'tall' : 'regular',
        touch: matchMedia('(pointer: coarse)').matches || navigator.maxTouchPoints > 0
    };
}
export function applyViewportAttributes(target, viewport) {
    target.dataset.device = viewport.device;
    target.dataset.orientation = viewport.orientation;
    target.dataset.height = viewport.heightClass;
    target.dataset.touch = String(viewport.touch);
}
