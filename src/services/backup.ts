import { dbClear, dbGetAll, dbPut, type StoreName } from './storage/db'
export async function createBackup(appVersion='4.0.0-alpha.2'){
  const [settings,calendars,collections,radioStations,radioSchedules,timerPresets]=await Promise.all([
    dbGetAll('settings'),dbGetAll('calendars'),dbGetAll('collections'),dbGetAll('radioStations'),dbGetAll('radioSchedules'),dbGetAll('timerPresets')
  ])
  return {format:'istante-backup',schemaVersion:4,appVersion,createdAt:new Date().toISOString(),data:{settings,calendars,collections,radioStations,radioSchedules,timerPresets}}
}
export function downloadBackup(data:unknown){const blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=`istante-backup-${new Date().toISOString().slice(0,10)}.json`;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000)}

export async function restoreBackup(input:unknown){
  if(!input||typeof input!=='object')throw new Error('Backup non valido')
  const b=input as {format?:string;schemaVersion?:number;data?:Record<string,unknown[]>}
  if(b.format!=='istante-backup'||b.schemaVersion!==4||!b.data)throw new Error('Il file non è un backup Istante schema 4')
  const map:Record<string,StoreName>={settings:'settings',calendars:'calendars',collections:'collections',radioStations:'radioStations',radioSchedules:'radioSchedules',timerPresets:'timerPresets'}
  for(const [key,store] of Object.entries(map)){const rows=b.data[key];if(!Array.isArray(rows))continue;await dbClear(store);for(const row of rows){if(row&&typeof row==='object'&&typeof (row as {id?:unknown}).id==='string')await dbPut(store,row as {id:string})}}
}
