const DB_NAME='istante'
const DB_VERSION=4
const STORES=['settings','calendars','calendarEvents','phrases','collections','radioStations','radioSchedules','timerPresets','history','metadata'] as const
export type StoreName=typeof STORES[number]
let dbPromise:Promise<IDBDatabase>|null=null
function openDb(){
  if(dbPromise) return dbPromise
  dbPromise=new Promise((resolve,reject)=>{
    const req=indexedDB.open(DB_NAME,DB_VERSION)
    req.onupgradeneeded=()=>{const db=req.result; for(const s of STORES) if(!db.objectStoreNames.contains(s)) db.createObjectStore(s,{keyPath:'id'})}
    req.onsuccess=()=>resolve(req.result); req.onerror=()=>reject(req.error)
  })
  return dbPromise
}
export async function dbGet<T>(store:StoreName,id:string):Promise<T|undefined>{const db=await openDb();return new Promise((res,rej)=>{const r=db.transaction(store,'readonly').objectStore(store).get(id);r.onsuccess=()=>res(r.result as T|undefined);r.onerror=()=>rej(r.error)})}
export async function dbGetAll<T>(store:StoreName):Promise<T[]>{const db=await openDb();return new Promise((res,rej)=>{const r=db.transaction(store,'readonly').objectStore(store).getAll();r.onsuccess=()=>res(r.result as T[]);r.onerror=()=>rej(r.error)})}
export async function dbPut<T extends {id:string}>(store:StoreName,value:T){const db=await openDb();return new Promise<void>((res,rej)=>{const r=db.transaction(store,'readwrite').objectStore(store).put(value);r.onsuccess=()=>res();r.onerror=()=>rej(r.error)})}
export async function dbDelete(store:StoreName,id:string){const db=await openDb();return new Promise<void>((res,rej)=>{const r=db.transaction(store,'readwrite').objectStore(store).delete(id);r.onsuccess=()=>res();r.onerror=()=>rej(r.error)})}
export async function dbClear(store:StoreName){const db=await openDb();return new Promise<void>((res,rej)=>{const r=db.transaction(store,'readwrite').objectStore(store).clear();r.onsuccess=()=>res();r.onerror=()=>rej(r.error)})}
export async function requestPersistentStorage(){return navigator.storage?.persist ? navigator.storage.persist() : false}
