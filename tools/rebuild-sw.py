#!/usr/bin/env python3
"""Rebuild Istante's verified offline shell from the current project tree."""
from __future__ import annotations

import base64
import hashlib
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
VERSION = json.loads((ROOT / "version.json").read_text(encoding="utf-8"))["version"]

ROOT_FILES = {
    "CHANGELOG.md",
    "CNAME",
    "README.md",
    "index.html",
    "leggi.html",
    "manifest.webmanifest",
    "version.json",
}
RUNTIME_DIRS = ("assets", "data", "docs")
OPTIONAL_VENDOR_FILES = (
    "assets/vendor/fonts/libre-baskerville/LibreBaskerville-VariableFont_wght.ttf",
    "assets/vendor/fonts/libre-baskerville/LibreBaskerville-Italic-VariableFont_wght.ttf",
    "assets/vendor/fonts/excalifont/Excalifont-Regular.woff2",
)
EXCLUDED_NAMES = {".DS_Store", "Thumbs.db"}
EXCLUDED_SUFFIXES = {".zip", ".bak", ".tmp"}


def wanted(path: Path) -> bool:
    rel = path.relative_to(ROOT).as_posix()
    if not path.is_file() or path.name in EXCLUDED_NAMES:
        return False
    if path.suffix.lower() in EXCLUDED_SUFFIXES:
        return False
    if rel == "sw.js" or rel.startswith("tools/"):
        return False
    if "/." in rel or rel.startswith("."):
        return False
    if "/__pycache__/" in f"/{rel}/":
        return False
    return rel in ROOT_FILES or rel.startswith(RUNTIME_DIRS)


def cache_url(path: Path) -> str:
    rel = path.relative_to(ROOT).as_posix()
    suffix = path.suffix.lower()
    query = f"?v={VERSION}" if suffix in {".css", ".js"} else ""
    return f"./{rel}{query}"


def integrity(path: Path) -> str:
    digest = hashlib.sha256(path.read_bytes()).digest()
    return "sha256-" + base64.b64encode(digest).decode("ascii")


files = sorted((p for p in ROOT.rglob("*") if wanted(p)), key=lambda p: p.relative_to(ROOT).as_posix())
entries = [{"url": cache_url(path), "integrity": integrity(path)} for path in files]
entries_json = json.dumps(entries, ensure_ascii=False, separators=(",", ":"))
optional_json = json.dumps([f"./{path}" for path in OPTIONAL_VENDOR_FILES], ensure_ascii=False, separators=(",", ":"))

source = f'''/* Istante {VERSION} - verified offline shell; updates wait for consent. */
const PREFIX="istante-";
const VERSION={json.dumps(VERSION)};
const CACHE=PREFIX+VERSION;
const FILES={entries_json};
const OPTIONAL_FILES={optional_json};
const ABS=FILES.map(f=>({{...f,url:new URL(f.url,self.registration.scope).href}}));
const OPTIONAL_ABS=OPTIONAL_FILES.map(rel=>new URL(rel,self.registration.scope).href);
const URLS=new Set([...ABS.map(f=>f.url),...OPTIONAL_ABS]);
self.addEventListener('install',event=>event.waitUntil((async()=>{{
 try{{const cache=await caches.open(CACHE);await cache.addAll(ABS.map(f=>new Request(f.url,{{cache:'reload',integrity:f.integrity}})));
  await Promise.all(OPTIONAL_ABS.map(async url=>{{try{{const response=await fetch(new Request(url,{{cache:'reload'}}));if(response.ok)await cache.put(url,response.clone());}}catch(_){{}}}}));}}
 catch(error){{await caches.delete(CACHE);throw error;}}
}})()));
self.addEventListener('activate',event=>event.waitUntil((async()=>{{
 const previous=(await caches.keys()).filter(k=>k.startsWith(PREFIX)&&k!==CACHE);
 for(const key of previous.slice(0,-1))await caches.delete(key);
 await self.clients.claim();
}})()));
self.addEventListener('message',event=>{{
 if(event.data?.type==='SKIP_WAITING')event.waitUntil(self.skipWaiting());
 if(event.data?.type==='GET_VERSION')event.waitUntil((async()=>{{
  const cache=await caches.open(CACHE);const complete=(await Promise.all(ABS.map(f=>cache.match(f.url)))).every(Boolean);
  event.ports[0]?.postMessage({{version:VERSION,complete,files:ABS.length}});
 }})());
}});
self.addEventListener('fetch',event=>{{
 const request=event.request;if(request.method!=='GET')return;
 const url=new URL(request.url),root=new URL(self.registration.scope);
 if(url.origin!==root.origin)return;
 const isIndex=request.mode==='navigate'&&(url.pathname===root.pathname||url.pathname===root.pathname+'index.html');
 const isReader=request.mode==='navigate'&&url.pathname===root.pathname+'leggi.html';
 if(!isIndex&&!isReader&&!URLS.has(url.href))return;
 event.respondWith((async()=>{{
  const cache=await caches.open(CACHE);
  const key=isIndex?new URL('index.html',root).href:isReader?new URL('leggi.html',root).href:request.url;
  const hit=await cache.match(key);if(hit)return hit;
  const spec=ABS.find(f=>f.url===key);
  try{{
   const response=await fetch(new Request(key,{{cache:'reload',integrity:spec?.integrity||''}}));
   if(response.ok)await cache.put(key,response.clone());
   return response;
  }}catch(_){{
   return new Response('Risorsa non disponibile offline. Riapri Istante con una connessione.',{{status:503,headers:{{'Content-Type':'text/plain; charset=utf-8'}}}});
  }}
 }})());
}});
'''

(ROOT / "sw.js").write_text(source, encoding="utf-8")
print(f"sw.js rigenerato: {VERSION}, {len(entries)} risorse")
