/* Small safe Markdown reader. Text nodes only; embedded HTML and executable URLs are never evaluated. */
(function(){'use strict';
 const documents={
  progetto:{path:'README.md',label:'Il progetto'},novita:{path:'CHANGELOG.md',label:'Tutte le novit\u00e0'},release:{path:'docs/release/v3.12.9.md',label:'Release 3.12.9'},visione:{path:'docs/VISIONE-E-DESIGN.md',label:'Visione e design'},
  'fonti-citazioni':{path:'docs/FONTI-CITAZIONI.md',label:'Fonti delle citazioni'},'licenza-unicode':{path:'docs/licenses/UNICODE-LICENSE.txt',label:'Licenza Unicode',plain:true},
  licenza:{path:'docs/LICENZA.md',label:'Licenza'},'terze-parti':{path:'docs/TERZE-PARTI.md',label:'Terze parti'},
  'licenza-material':{path:'docs/licenses/MATERIAL-ICONS-LICENSE.txt',label:'Licenza Material Icons',plain:true},
  'licenza-suncalc':{path:'docs/licenses/SUNCALC-LICENSE.txt',label:'Licenza SunCalc',plain:true},
  'licenza-qr':{path:'docs/licenses/PYTHON-QRCODE-LICENSE.txt',label:'Licenza QR',plain:true},
  'licenza-social':{path:'docs/licenses/BOOTSTRAP-ICONS-LICENSE.txt',label:'Licenza icone social',plain:true}
 };
 let sourcePath='README.md';
 const node=(tag,text)=>{const n=document.createElement(tag);if(text!==undefined)n.textContent=text;return n;};
 function linkURL(raw){
  try{const u=new URL(raw,new URL(sourcePath,location.href));if(!['https:','http:'].includes(u.protocol))return null;
   for(const [key,entry] of Object.entries(documents))if(u.href===new URL(entry.path,new URL('.',location.href)).href)return 'leggi.html?doc='+key;
   return u.href;
  }catch(_){return null;}
 }
 function inline(parent,text,depth=0){
  if(depth>5){parent.append(document.createTextNode(text));return;}
  const pattern=/(\[[^\]\n]+\]\([^\s)]+\)|`[^`\n]+`|\*\*[^*\n]+\*\*|\*[^*\n]+\*)/g;let at=0,match;
  while((match=pattern.exec(text))){parent.append(document.createTextNode(text.slice(at,match.index)));const token=match[0];
   if(token[0]==='['){const m=token.match(/^\[([^\]]+)\]\((.+)\)$/),href=linkURL(m[2]);if(href){const a=node('a');a.href=href;if(new URL(href,location.href).origin!==location.origin){a.target='_blank';a.rel='noopener noreferrer';}inline(a,m[1],depth+1);parent.append(a);}else parent.append(document.createTextNode(m[1]));}
   else {const count=token.startsWith('**')?2:1,n=node(token[0]==='`'?'code':count===2?'strong':'em');if(token[0]==='`')n.textContent=token.slice(1,-1);else inline(n,token.slice(count,-count),depth+1);parent.append(n);}
   at=pattern.lastIndex;
  }parent.append(document.createTextNode(text.slice(at)));
 }
 function render(text){
  const fragment=document.createDocumentFragment(),lines=String(text).replace(/\r/g,'').split('\n');let i=0;
  while(i<lines.length){let line=lines[i];if(!line.trim()){i++;continue;}
   if(/^```/.test(line)){const code=[];i++;while(i<lines.length&&!/^```/.test(lines[i]))code.push(lines[i++]);if(i<lines.length)i++;const pre=node('pre');pre.append(node('code',code.join('\n')));fragment.append(pre);continue;}
   const heading=line.match(/^(#{1,6})\s+(.+)$/);if(heading){const h=node('h'+heading[1].length);inline(h,heading[2]);fragment.append(h);i++;continue;}
   if(/^\s*([-*_])\1\1+\s*$/.test(line)){fragment.append(node('hr'));i++;continue;}
   if(/^\s*(?:[-*+] |\d+\. )/.test(line)){const ordered=/^\s*\d+\./.test(line),list=node(ordered?'ol':'ul');while(i<lines.length&&/^\s*(?:[-*+] |\d+\. )/.test(lines[i])){const li=node('li');inline(li,lines[i++].replace(/^\s*(?:[-*+] |\d+\. )/,''));list.append(li);}fragment.append(list);continue;}
   if(/^>\s?/.test(line)){const q=node('blockquote');inline(q,line.replace(/^>\s?/,''));fragment.append(q);i++;continue;}
   const paragraph=[line];i++;while(i<lines.length&&lines[i].trim()&&!/^(#{1,6}\s|```|>\s|\s*(?:[-*+] |\d+\. ))/.test(lines[i]))paragraph.push(lines[i++]);const p=node('p');inline(p,paragraph.join(' '));fragment.append(p);
  }return fragment;
 }
 async function load(){
  const key=new URLSearchParams(location.search).get('doc')||'progetto',entry=Object.prototype.hasOwnProperty.call(documents,key)?documents[key]:null,content=document.getElementById('document-content');
  document.querySelectorAll('[data-doc]').forEach(a=>{if(a.dataset.doc===key)a.setAttribute('aria-current','page');});
  if(!entry){content.replaceChildren(node('h1','Pagina non trovata.'),node('p','Scegli una pagina dal menu. Nessun file esterno viene caricato.'));content.setAttribute('aria-busy','false');return;}
  sourcePath=entry.path;document.title=entry.label+' | Istante';document.getElementById('document-label').textContent=entry.label;
  const raw=document.getElementById('document-source');raw.href=entry.path;raw.hidden=false;raw.textContent=entry.plain?'Apri il file originale':'Apri il Markdown originale';
  const controller=new AbortController(),timeout=setTimeout(()=>controller.abort(),6500);
  try{const r=await fetch(entry.path,{signal:controller.signal,credentials:'same-origin'});if(!r.ok)throw Error('HTTP '+r.status);const text=await r.text();if(text.length>500000)throw Error('File troppo grande');
   if(entry.plain){const pre=node('pre',text);content.replaceChildren(node('h1',entry.label),pre);}else content.replaceChildren(render(text));
  }catch(_){content.replaceChildren(node('h1','Il testo non e\u0300 disponibile.'),node('p',location.protocol==='file:'?'Apri Istante da un server locale o pubblicalo su HTTPS per leggere i Markdown nella pagina. Il file originale resta disponibile dal collegamento qui sotto.':'Riprova con una connessione oppure apri il file originale. Dopo il salvataggio della copia offline, queste pagine funzionano anche senza Internet.'));}
  finally{clearTimeout(timeout);content.setAttribute('aria-busy','false');}
 }
 document.addEventListener('selectstart',e=>e.preventDefault());document.addEventListener('dragstart',e=>e.preventDefault());document.addEventListener('keydown',e=>{if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='a')e.preventDefault();});
 window.IstanteMarkdown={render,linkURL};void load();
})();
