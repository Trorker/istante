/// <reference types="vite/client" />

declare global {
  interface Window {
    ISTANTE_CONFIG?: {
      calendarProxy?: string
      calendarSyncMinutes?: number
      deviceProfile?: 'auto' | 'phone' | 'tablet' | 'desktop' | 'display'
      weatherProvider?: string
      projectUrl?: string
      debug?: boolean
    }
  }
}
export {}
