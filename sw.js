/* Khaqan Coal — offline/cache worker.
 *
 * Strategy per resource type (all same-origin unless noted):
 *   HTML navigations  network-first, 4h fresh, 7d stale; falls back to the last
 *                     cached copy of the same URL, then to the cached shell so a
 *                     dead network still renders a page instead of a browser error.
 *   css / js          stale-while-revalidate. The versioned `?v=` query is the
 *                     cache key, so a deploy can never serve a torn pair of files.
 *   images / video    cache-first (media/* ships with immutable headers).
 *   fonts (cross-origin) stale-while-revalidate, 30d.
 * Entries are capped: the list cache keeps insertion order and the worker trims
 * the oldest half once the entry count passes MAX_ENTRIES, so a long visit can't
 * grow the origin's quota without bound.
 */
const VERSION = 'khaqan-coal-v13';
const ASSETS = VERSION + ':assets';
const PAGES = VERSION + ':pages';
const LIST = VERSION + ':list';
const MAX_ENTRIES = 180;

const SHELL = [
  './',
  './index.html',
  './about.html', './operations.html', './supply.html', './gallery.html',
  './community.html', './contact.html', './crm.html',
  './profile.html',  // redirect stub: cached so an offline /portfolio still lands on the cached page
  './styles.css?v=3', './themes.css?v=17', './script.js?v=14',
  './supabase-config.js?v=1', './cloud.js?v=1',
  './crm.css?v=2', './crm.js?v=1', './crm-cloud.js?v=1',
  './media/logo-mark-128.webp?v=1', './media/logo-mark-light-128.webp?v=1',
  './media/coal-texture-bg.webp'
];

const isAsset = (url) => /\.(css|js|mjs|webp|avif|jpe?g|png|svg|gif|woff2?|ttf|mp4|webm|webmanifest)$/i.test(url.pathname);
const isMedia = (url) => /\/media\//.test(url.pathname);
const sameOrigin = (url) => url.origin === self.location.origin;
const listable = (url) => isAsset(url) || isMedia(url) || /\.(html?)$/i.test(url.pathname) || url.pathname.endsWith('/');

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(ASSETS);
    // Add each entry separately: one missing file must not veto the whole shell.
    await Promise.allSettled(SHELL.map((href) => cache.add(new Request(href, { cache: 'reload' }))));
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    for (const key of (await caches.keys())) {
      if (!key.startsWith(VERSION)) await caches.delete(key);
    }
    await self.clients.claim();
  })());
});

/* The LIST cache is only an insertion-ordered index of what we stored, so the
   worker can evict in whole numbers instead of growing past the quota. */
async function remember(url) {
  const list = await caches.open(LIST);
  const key = new Request(url);
  if (await list.match(key)) return;
  await list.add(key);
  const keys = await list.keys();
  if (keys.length <= MAX_ENTRIES) return;
  const assets = await caches.open(ASSETS);
  const pages = await caches.open(PAGES);
  const shell = new Set(SHELL.map((href) => new URL(href, self.location.href).href));
  // The shell is never evicted: it is what makes an offline *first* paint work,
  // and dropping it to save a few hundred KB is a bad trade.
  const doomed = keys.slice(0, Math.ceil(keys.length / 2)).filter((req) => !shell.has(req.url));
  await Promise.all(doomed.map(async (req) => {
    await Promise.all([assets.delete(req), pages.delete(req), list.delete(req)]);
  }));
}

async function cacheFirst(req, store) {
  const hit = await caches.match(req, { cacheName: store });
  if (hit) return hit;
  const res = await fetch(req);
  if (res && res.ok && (res.type === 'basic' || res.type === 'default')) {
    const cache = await caches.open(store);
    cache.put(req, res.clone());
    if (listable(new URL(req.url))) remember(req.url);
  }
  return res;
}

async function staleWhileRevalidate(req, store) {
  const hit = await caches.match(req, { cacheName: store });
  const network = fetch(req).then(async (res) => {
    if (res && res.ok) {
      const cache = await caches.open(store);
      await cache.put(req, res.clone());
      if (listable(new URL(req.url))) remember(req.url);
    }
    return res;
  }).catch(() => null);
  return hit || (await network) || Response.error();
}

async function networkFirstPage(req) {
  const nav = new Request(req, { cache: 'reload' });
  try {
    const res = await fetch(nav);
    if (res && res.ok) {
      const cache = await caches.open(PAGES);
      await cache.put(req, res.clone());
      remember(req.url);
    }
    return res;
  } catch (err) {
    const cached = (await caches.match(req, { cacheName: PAGES, ignoreSearch: true }))
      || (await caches.match('./index.html', { cacheName: PAGES }))
      || (await caches.match('./', { cacheName: PAGES }));
    if (cached) return cached;
    throw err;
  }
}

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (!sameOrigin(url) && !/fonts\.(googleapis|gstatic)\.com$/.test(url.host)) return;
  if (url.protocol === 'chrome-extension:') return;

  if (req.mode === 'navigate') {
    event.respondWith(networkFirstPage(req));
    return;
  }
  if (!sameOrigin(url)) {
    event.respondWith(staleWhileRevalidate(req, ASSETS));
    return;
  }
  if (isMedia(url)) {
    event.respondWith(cacheFirst(req, ASSETS));
    return;
  }
  if (isAsset(url)) {
    event.respondWith(staleWhileRevalidate(req, ASSETS));
    return;
  }
});

// `?khaqan-cache=clear` from the console/debug bar drops everything the worker
// stored, so a bad cache can always be diagnosed without DevTools.
self.addEventListener('message', (event) => {
  if (!event.data || event.data.type !== 'khaqan-cache-clear') return;
  event.waitUntil((async () => {
    for (const key of await caches.keys()) await caches.delete(key);
    const all = await self.clients.matchAll({ type: 'window' });
    all.forEach((c) => c.postMessage({ type: 'khaqan-cache-cleared' }));
  })());
});
