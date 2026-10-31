const CACHE_NAME='ccm-motocrafts-shell-v20261031-merged';
const SHELL=['/','/manifest.json','/app-icon-192.png','/app-icon-512.png'];
self.addEventListener('install',event=>{
  event.waitUntil(caches.open(CACHE_NAME).then(cache=>cache.addAll(SHELL)).then(()=>self.skipWaiting()));
});
self.addEventListener('activate',event=>{
  event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key.startsWith('ccm-motocrafts-shell-')&&key!==CACHE_NAME).map(key=>caches.delete(key)))).then(()=>self.clients.claim()));
});
self.addEventListener('fetch',event=>{
  const req=event.request;
  if(req.method!=='GET') return;
  const url=new URL(req.url);
  if(url.origin!==self.location.origin) return;
  // Always ask the network for HTML navigation first so customers see current website code.
  if(req.mode==='navigate'){
    event.respondWith(fetch(req).then(response=>{
      if(response && response.ok){const copy=response.clone();caches.open(CACHE_NAME).then(cache=>cache.put('/',copy));}
      return response;
    }).catch(()=>caches.match(req).then(cached=>cached||caches.match('/'))));
  }
});
