import { defineStore } from 'pinia'
import { ref } from 'vue'
export const useUiStore=defineStore('ui',()=>{const timerOpen=ref(false),radioOpen=ref(false),settingsOpen=ref(false),calendarDrawerOpen=ref(false),phrasesOpen=ref(false),phraseFavoritesOnly=ref(false);return{timerOpen,radioOpen,settingsOpen,calendarDrawerOpen,phrasesOpen,phraseFavoritesOnly}})
