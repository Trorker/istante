import { defineStore } from 'pinia'
import { reactive, watch } from 'vue'
import { dbGet, dbPut } from '../services/storage/db'
export interface SettingsData { theme:'auto'|'light'|'dark'; clock24:boolean; showSeconds:boolean; typewriter:boolean; background:'gradient'|'photo'; photoSeed:string; weatherEnabled:boolean; latitude?:number; longitude?:number; followSun:boolean; uiScale:number }
const defaults:SettingsData={theme:'auto',clock24:true,showSeconds:false,typewriter:true,background:'gradient',photoSeed:'daily',weatherEnabled:false,followSun:true,uiScale:1}
export const useSettingsStore=defineStore('settings',()=>{const data=reactive<SettingsData>({...defaults});let ready=false;async function init(){const saved=await dbGet<{id:string;value:SettingsData}>('settings','main');if(saved?.value)Object.assign(data,defaults,saved.value);ready=true;watch(data,()=>{if(ready)dbPut('settings',{id:'main',value:{...data}})},{deep:true})}function reset(){Object.assign(data,defaults)}return{data,init,reset}})
