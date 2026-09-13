const VueRuntime = globalThis.Vue;
if (!VueRuntime)
    throw new Error('Vue runtime non disponibile.');
export const { createApp, ref, reactive, computed, watch, watchEffect, onMounted, onBeforeUnmount, nextTick, provide, inject, readonly, shallowRef, toRaw } = VueRuntime;
