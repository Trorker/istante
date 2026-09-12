import type { DeviceFamily, Orientation, ViewportShape } from '../types/models'

export function classifyFamily(w:number,h:number,override='auto'):DeviceFamily{
  if(['phone','tablet','desktop','display'].includes(override)) return override as DeviceFamily
  const short=Math.min(w,h), long=Math.max(w,h)
  if(short<600) return 'phone'
  if(short<1050&&long<1500) return 'tablet'
  if(w>=2560&&h>=1350) return 'display'
  return 'desktop'
}
export function classifyOrientation(w:number,h:number):Orientation{return w>=h?'landscape':'portrait'}
export function classifyShape(r:number):ViewportShape{return r<0.78?'tall':r<1.55?'standard':r<2.15?'wide':'ultrawide'}
