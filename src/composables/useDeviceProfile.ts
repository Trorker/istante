import { computed, onMounted, ref } from 'vue'
import type { DeviceProfile } from '../types/models'
import { runtime } from '../config/runtime'
import { classifyFamily, classifyOrientation, classifyShape } from '../utils/device'

const width=ref(0),height=ref(0),tick=ref(0)
let bound=false
function read(){const v=window.visualViewport;width.value=Math.round(v?.width||window.innerWidth);height.value=Math.round(v?.height||window.innerHeight);tick.value++}
export function useDeviceProfile(){
  onMounted(()=>{read();if(bound)return;bound=true;window.addEventListener('resize',read,{passive:true});window.addEventListener('orientationchange',read,{passive:true});window.visualViewport?.addEventListener('resize',read,{passive:true})})
  const profile=computed<DeviceProfile>(()=>{void tick.value;const w=width.value||window.innerWidth,h=height.value||window.innerHeight,short=Math.min(w,h),long=Math.max(w,h),ratio=w/Math.max(h,1),family=classifyFamily(w,h,runtime.deviceProfile),orientation=classifyOrientation(w,h);const base=family==='phone'?390:family==='tablet'?820:family==='display'?2160:1080;const sizeIndex=Math.sqrt(w*h)/Math.sqrt(base*base);const touch=matchMedia('(pointer: coarse)').matches||navigator.maxTouchPoints>0;return{family,orientation,shape:classifyShape(ratio),width:w,height:h,shortSide:short,longSide:long,aspectRatio:ratio,area:w*h,sizeIndex,uiScale:Math.max(.88,Math.min(1.22,sizeIndex)),fontScale:Math.max(.9,Math.min(1.28,sizeIndex)),touchScale:touch?1.08:1,isTouchPreferred:touch,isCompactHeight:h<700,isWide:ratio>=1.55,isUltraWide:ratio>=2.15}})
  return{profile}
}
