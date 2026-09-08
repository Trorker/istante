/* Shared weather interpretation for the real-time sky and exported artwork.
 * Current observations expire after 45 minutes. Missing data is not labelled clear.
 * Coordinates / temperature are deliberately not included in the share snapshot.
 */
(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory();else root.IstanteWeatherScene=factory();})(typeof globalThis!=='undefined'?globalThis:this,function(){
 'use strict';
 const CODES=new Set([0,1,2,3,45,48,51,53,55,56,57,61,63,65,66,67,71,73,75,77,80,81,82,85,86,95,96,99]);
 function fresh(w,now=Date.now()){
  if(!w||!CODES.has(w.weather_code)||!Number.isFinite(w.time))return null;
  const age=now-w.time*1000;if(age< -60000||age>45*60000)return null;
  return{weather_code:w.weather_code,time:w.time,is_day:w.is_day};
 }
 function kind(code,isDay){
  if([95,96,99].includes(code))return'storm';if([71,73,75,77,85,86].includes(code))return'snow';
  if([51,53,55,56,57,61,63,65,66,67,80,81,82].includes(code))return'rain';
  if([45,48].includes(code))return'fog';if(code===3)return'clouds';if(code===2)return'partly';
  if(code===0||code===1)return isDay?'sun':'clear-night';return'neutral';
 }
 const look={
  neutral:{orb:1,stars:1,clouds:0,label:''},sun:{orb:1,stars:0,clouds:0,label:'Sereno'},
  'clear-night':{orb:1,stars:1,clouds:0,label:'Sereno'},partly:{orb:.58,stars:.38,clouds:.40,label:'Parzialmente nuvoloso'},
  clouds:{orb:.14,stars:.035,clouds:.78,label:'Nuvoloso'},rain:{orb:.08,stars:0,clouds:.85,label:'Pioggia'},
  snow:{orb:.14,stars:.025,clouds:.68,label:'Neve'},fog:{orb:.05,stars:0,clouds:.75,label:'Nebbia'},
  storm:{orb:0,stars:0,clouds:1,label:'Temporale'}
 };
 function resolve(s={},observation,isDay=true,now=Date.now()){
  const w=fresh(observation,now),manual=s.effectsEnabled&&s.weatherFX&& !['auto','off'].includes(s.weatherFX);
  let k=manual?s.weatherFX:kind(w?.weather_code,isDay);if(k==='sun'&&!isDay)k='clear-night';
  if(!look[k])k='neutral';const spec=look[k];
  return {...spec,kind:k,source:manual?'manual':w?'weather':'none',label:spec.label,
   code:manual?null:w?.weather_code??null,time:w?.time??null,
   precipitation:s.effectsEnabled||w?['rain','snow','storm'].includes(k):false};
 }
 return{fresh,kind,resolve};
});
