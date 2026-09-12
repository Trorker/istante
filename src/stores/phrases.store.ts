import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import type { Phrase } from '../types/models'
import { dbGetAll,dbPut } from '../services/storage/db'
export const usePhrasesStore=defineStore('phrases',()=>{
  const phrases=ref<Phrase[]>([]),currentIndex=ref(0),loading=ref(false)
  const current=computed(()=>phrases.value[currentIndex.value]??null)
  async function init(){if(phrases.value.length)return;loading.value=true;try{const [j,saved]=await Promise.all([fetch('/data/phrases.json').then(r=>r.json()),dbGetAll<{id:string;favorite?:boolean}>('phrases')]);const fav=new Map(saved.map(x=>[x.id,!!x.favorite]));phrases.value=(j.phrases??[]).map((p:Phrase)=>({...p,favorite:fav.get(p.id)??false}));const key=new Date().toISOString().slice(0,10);let hash=0;for(const c of key)hash=(hash*31+c.charCodeAt(0))>>>0;currentIndex.value=phrases.value.length?hash%phrases.value.length:0}finally{loading.value=false}}
  function next(){if(phrases.value.length)currentIndex.value=(currentIndex.value+1)%phrases.value.length}
  function random(){if(phrases.value.length)currentIndex.value=Math.floor(Math.random()*phrases.value.length)}
  function select(id:string){const i=phrases.value.findIndex(p=>p.id===id);if(i>=0)currentIndex.value=i}
  async function toggleFavorite(p:Phrase){p.favorite=!p.favorite;await dbPut('phrases',{id:p.id,favorite:!!p.favorite})}
  return{phrases,current,currentIndex,loading,init,next,random,select,toggleFavorite}
})
