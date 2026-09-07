/* A deterministic, testable typewriter plan. Never edits the stored phrase. */
(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory();else root.IstanteTyping=factory();})(typeof globalThis!=='undefined'?globalThis:this,function(){'use strict';
function plan(characters,settings,rng=Math.random,eraseFirst=false){
 const steps=[],base=Number(settings.typingSpeed)||35,natural=settings.typingRhythm!=='steady';
 const delay=(c,wordStart)=>Math.round(base*(natural?.58+rng()*1.5:1)+(natural&&wordStart?45+rng()*110:0)+(/[.,;:!?]/u.test(c)?160+(natural?rng()*280:0):0));
 if(eraseFirst){for(let i=characters.length-1;i>=0;i--)steps.push({index:i,kind:'erase',wait:Math.max(12,Math.round(base*(.25+rng()*.22)))});steps.push({index:-1,kind:'pause',wait:450});}
 const candidates=characters.map((c,i)=>({c,i})).filter(({c,i})=>i>4&&i<characters.length-4&&/^[a-z]$/i.test(c.char));
 const mistakes=new Set();if(settings.typingMistakes!=='off'&&candidates.length){const chance=settings.typingMistakes==='often'?.95:.5;if(rng()<chance){mistakes.add(candidates[Math.floor(rng()*candidates.length)].i);if(settings.typingMistakes==='often'&&characters.length>60)mistakes.add(candidates[Math.floor(rng()*candidates.length)].i);}}
 const adjacent={a:'s',b:'v',c:'x',d:'s',e:'r',f:'g',g:'h',h:'g',i:'o',j:'h',k:'l',l:'k',m:'n',n:'m',o:'i',p:'o',q:'w',r:'t',s:'a',t:'r',u:'y',v:'b',w:'q',x:'c',y:'u',z:'x'};
 characters.forEach((c,i)=>{if(mistakes.has(i)){let wrong=adjacent[c.char.toLowerCase()]||'e';if(c.char!==c.char.toLowerCase())wrong=wrong.toUpperCase();steps.push({index:i,kind:'mistake',glyph:wrong,wait:380+rng()*330});steps.push({index:i,kind:'erase',wait:100+rng()*120});}steps.push({index:i,kind:'type',glyph:c.char,wait:delay(c.char,c.wordStart)});});
 return steps;
}
return{plan};});
