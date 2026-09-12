export type DeviceFamily = 'phone' | 'tablet' | 'desktop' | 'display'
export type Orientation = 'portrait' | 'landscape'
export type ViewportShape = 'tall' | 'standard' | 'wide' | 'ultrawide'
export interface DeviceProfile { family:DeviceFamily; orientation:Orientation; shape:ViewportShape; width:number; height:number; shortSide:number; longSide:number; aspectRatio:number; area:number; sizeIndex:number; uiScale:number; fontScale:number; touchScale:number; isTouchPreferred:boolean; isCompactHeight:boolean; isWide:boolean; isUltraWide:boolean }
export interface Phrase { id:string; text:string; author?:string; tags?:string[]; periods?:Array<'morning'|'day'|'evening'|'night'>; favorite?:boolean; collectionIds?:string[]; enabled:boolean }
export interface CalendarSource { id:string; name:string; url:string; color?:string; enabled:boolean; lastSyncAt?:string; lastError?:string }
export interface CalendarEvent { id:string; calendarId:string; title:string; start:string; end?:string; allDay:boolean; location?:string; description?:string; status?:string }
export interface RadioStream { url:string; label?:string; mime?:string }
export interface RadioStation { id:string; name:string; provider?:string; streamUrl:string; streams?:RadioStream[]; website?:string; favorite:boolean; enabled:boolean; note?:string }
export type TimerStatus='idle'|'running'|'paused'|'completed'
export interface TimerSnapshot { status:TimerStatus; totalSeconds:number; remainingSeconds:number; startedAt?:number; expectedEndAt?:number; pausedAt?:number; radioMode:'keep'|'play'|'stop'|'silence'; endSoundEnabled:boolean; endSoundId?:string }

export interface RadioSchedule { id:string; stationId:string; start:string; end:string; days:number[]; enabled:boolean }
