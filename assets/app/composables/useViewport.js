import { ref, onMounted } from '../app/vue.js';
import { readViewport, applyViewportAttributes } from '../app/device-profile.js';

const viewport = ref(readViewport());
let frame = 0;
let installed = false;

function updateViewport() {
  cancelAnimationFrame(frame);
  frame = requestAnimationFrame(() => {
    viewport.value = readViewport();
    const root = document.querySelector('#app-root');
    if (root) applyViewportAttributes(root, viewport.value);
  });
}

function installViewportObserver() {
  if (installed) {
    updateViewport();
    return;
  }
  installed = true;
  updateViewport();
  addEventListener('resize', updateViewport, { passive: true });
  addEventListener('orientationchange', updateViewport, { passive: true });
}

/**
 * Shared reactive viewport profile for the whole application.
 * The resize/orientation listeners are installed once per page lifetime.
 */
export function useViewport() {
  onMounted(installViewportObserver);
  return viewport;
}
