import { dbPut } from './storage/db'
const FLAG='istante:v4:migrated'
export async function migrateLegacyOnce(){
  if(localStorage.getItem(FLAG)==='1') return
  const candidates=['istante.settings','istante_settings','settings']
  for(const key of candidates){
    const raw=localStorage.getItem(key); if(!raw) continue
    try{const value=JSON.parse(raw); await dbPut('metadata',{id:'legacy-settings',value,source:key,migratedAt:new Date().toISOString()})}catch{}
  }
  localStorage.setItem(FLAG,'1')
}
