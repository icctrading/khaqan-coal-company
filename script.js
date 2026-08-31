const DEFAULT_CMS_DATA = {
  brandName: 'Khaqan',
  companyName: 'Khaqan Coal Company Pvt. Ltd.',
  directorName: 'Adnan Khan',
  ownershipLine: 'Proudly owned by the Akkhurwal Qom',
  location: 'Darra Adam Khel, Khyber Pakhtunkhwa, Pakistan',
  heroEyebrow: 'Akkhurwal Qom · Darra Adam Khel · KPK, Pakistan',
  heroDescription: 'Best-quality coal at good prices — mined and moved with pride from Darra Adam Khel to customers across Pakistan.',
  phone: '',
  whatsapp: '',
  email: '',
  exportHeading: 'Leading from Darra Adam Khel. Preparing for the world.',
  exportMessage: 'Khaqan Coal Company is proud to be a leading coal supplier in Pakistan and is now preparing the relationships, standards, and distribution routes needed for export.',
  legalName: 'Khaqan Coal Company (Private) Limited',
  incorporationDate: '03 March 2021',
  totalQuantity: '535,121.35 MT',
  totalTurnover: 'PKR 21,011,459,921',
  clientCount: '12 leading organizations',
  /* Rotation timing — seconds a frame stays on screen before the next one
     fades in. The Control Room's "Rotation timing" card can override both:
     the home page highlights reel and the leadership hero (Home + About). */
  reelIntervalSec: 5,
  teamHeroIntervalSec: 5,
  /* Per-spot wording overrides edited in the Control Room ("Headings, captions
     & tiles"). Keyed by the same reference a media slot uses — `home:reel` for
     a section head, `home:reel:4` for one frame — with `eyebrow`, `heading`,
     `text` (section head) and `caption`, `heading`, `tile` (single frame).
     An absent key or blank field keeps the copy that ships in the HTML. */
  slotCopy: {},
  /* Leadership descriptions — edited from the Control Room. The opening
     phrase may be wrapped in <strong>…</strong> to keep the bold lead-in;
     everything else is rendered as plain text. */
  directorBio: '<strong>The Director who made everything digital</strong> and took Khaqan Coal Company to new heights — a forward-thinking leader who pairs modern systems with old-fashioned values. He brings warmth, honesty and reliability to every supply relationship, and helps Darra Adam Khel keep moving forward with quiet confidence and unmistakable pride.',
  ceoBio: '<strong>The person behind the vision of the company</strong> and all of its success — a wise and steady presence whose guidance carried Khaqan from a single local mine into a nationwide supplier of choice. His far-sighted judgement, gentle authority and deep-rooted integrity keep the company true to its origins while it grows.',
  mdBio: '<strong>The man with the courage</strong> — a calm, resourceful problem-solver who keeps the work moving when the ground gets tough and the schedule gets tight. He untangles logistics, protects standards and keeps every promise the company makes, leading with strength, patience and a generous spirit.',
  cfoBio: '<strong>The finance officer on whom the company relies a great deal</strong> — a meticulous and trustworthy steward who keeps the numbers clear, the books honest and the foundation solid. With an eye on every rupee and a steady hand on the future, he gives Khaqan the confidence to mine deeper, move further and grow with grace.',
  directorCard1: 'Adnan Khan is the Director who made everything digital and took Khaqan Coal Company to new heights. A forward-thinking and approachable leader, he pairs modern systems with old-fashioned values — bringing warmth, honesty and reliability to every supply relationship while helping Darra Adam Khel continue to move forward.',
  directorCard2: 'Under his direction, Khaqan Coal Company keeps its values close: honesty in dealing, respect for people, and pride in the place where it all began.',
  ceoCard1: 'Haji Ilyas Khan is the person behind the vision of the company — and the quiet, wise force behind all of its success. From the earliest days he saw what Khaqan could become: a local name with the discipline, standards and relationships to supply the country\'s leading industries.',
  ceoCard2: 'His leadership keeps the company grounded in its roots while its ambitions grow — mining with pride in Darra Adam Khel, treating every partner with courtesy, and preparing the next chapter beyond Pakistan\'s borders.',
  mdCard1: 'Abdur Rauf Khan is the man with the courage — the calm, resourceful problem-solver the company turns to when the ground gets tough and the schedule gets tight. He runs the day-to-day with quiet authority, untangling logistics, protecting standards, and keeping every load moving on time.',
  mdCard2: 'A straight talker who leads by example and treats everyone with respect, he makes sure that what Khaqan promises is exactly what Khaqan delivers — every single day.',
  cfoCard1: 'Jibran Khan is the finance officer on whom the company relies a great deal — a meticulous, trustworthy steward of every rupee. He keeps Khaqan\'s numbers clear, disciplined and honest, turning the company\'s growth into a solid financial foundation the whole team can build on.',
  cfoCard2: 'With an eye on every detail and a steady hand on the books, he gives Khaqan the confidence to mine deeper, move further, and grow without ever losing sight of the bottom line.',
  /* Leadership team — the rotating hero (Home + About) and the About team
     cards are built from this list, so members can be added or removed and
     re-ordered from the Control Room without touching a line of HTML. The
     array order IS the rotation / presentation order (member 1 first, member 2
     second, and so on). */
  teamMembers: [
    { key: 'director', role: 'Director', name: 'Adnan Khan', monogram: 'AK', kicker: 'The digital pioneer', accent: 'emerald',
      bio: '<strong>The Director who made everything digital</strong> and took Khaqan Coal Company to new heights — a forward-thinking leader who pairs modern systems with old-fashioned values. He brings warmth, honesty and reliability to every supply relationship, and helps Darra Adam Khel keep moving forward with quiet confidence and unmistakable pride.',
      card1: 'Adnan Khan is the Director who made everything digital and took Khaqan Coal Company to new heights. A forward-thinking and approachable leader, he pairs modern systems with old-fashioned values — bringing warmth, honesty and reliability to every supply relationship while helping Darra Adam Khel continue to move forward.',
      card2: 'Under his direction, Khaqan Coal Company keeps its values close: honesty in dealing, respect for people, and pride in the place where it all began.' },
    { key: 'ceo', role: 'Chief Executive Officer', name: 'Haji Ilyas Khan', monogram: 'IK', kicker: 'The vision', accent: 'gold',
      bio: '<strong>The person behind the vision of the company</strong> and all of its success — a wise and steady presence whose guidance carried Khaqan from a single local mine into a nationwide supplier of choice. His far-sighted judgement, gentle authority and deep-rooted integrity keep the company true to its origins while it grows.',
      card1: 'Haji Ilyas Khan is the person behind the vision of the company — and the quiet, wise force behind all of its success. From the earliest days he saw what Khaqan could become: a local name with the discipline, standards and relationships to supply the country\'s leading industries.',
      card2: 'His leadership keeps the company grounded in its roots while its ambitions grow — mining with pride in Darra Adam Khel, treating every partner with courtesy, and preparing the next chapter beyond Pakistan\'s borders.' },
    { key: 'md', role: 'Managing Director', name: 'Abdur Rauf Khan', monogram: 'AR', kicker: 'The problem-solver', accent: 'ember',
      bio: '<strong>The man with the courage</strong> — a calm, resourceful problem-solver who keeps the work moving when the ground gets tough and the schedule gets tight. He untangles logistics, protects standards and keeps every promise the company makes, leading with strength, patience and a generous spirit.',
      card1: 'Abdur Rauf Khan is the man with the courage — the calm, resourceful problem-solver the company turns to when the ground gets tough and the schedule gets tight. He runs the day-to-day with quiet authority, untangling logistics, protecting standards, and keeping every load moving on time.',
      card2: 'A straight talker who leads by example and treats everyone with respect, he makes sure that what Khaqan promises is exactly what Khaqan delivers — every single day.' },
    { key: 'cfo', role: 'Chief Financial Officer', name: 'Jibran Khan', monogram: 'JK', kicker: 'The steady hand', accent: 'steel',
      bio: '<strong>The finance officer on whom the company relies a great deal</strong> — a meticulous and trustworthy steward who keeps the numbers clear, the books honest and the foundation solid. With an eye on every rupee and a steady hand on the future, he gives Khaqan the confidence to mine deeper, move further and grow with grace.',
      card1: 'Jibran Khan is the finance officer on whom the company relies a great deal — a meticulous, trustworthy steward of every rupee. He keeps Khaqan\'s numbers clear, disciplined and honest, turning the company\'s growth into a solid financial foundation the whole team can build on.',
      card2: 'With an eye on every detail and a steady hand on the books, he gives Khaqan the confidence to mine deeper, move further, and grow without ever losing sight of the bottom line.' }
  ],
  /* Home-page highlights reel rotation order — the order the frames appear in
     the reel stage (and the chapter rail beside it). Each entry is the frame's
     `data-media-slot` reference; leave the default to keep the shipping order. */
  reelSequence: ['home:reel:1', 'home:reel:2', 'home:reel:3', 'home:reel:4', 'home:reel:5', 'home:reel:6', 'home:reel:7', 'home:reel:8', 'home:reel:9']
};

const CMS_KEY = 'khaqanSiteData';
const LEADS_KEY = 'khaqanLeads';
const THEME_KEY = 'khaqanTheme';
const SKIN_KEY = 'khaqanSkin';
const SKINS = ['signature', 'marble', 'obsidian'];
const THEME_COLORS = {
  signature: { day: '#f4f7f2', night: '#07100d' },
  marble: { day: '#f7f3e8', night: '#141824' },
  obsidian: { day: '#eef0f3', night: '#0a0b0d' }
};

function readJSON(key, fallback) {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (error) {
    return fallback;
  }
}

function getCmsData() {
  return { ...DEFAULT_CMS_DATA, ...(readJSON(CMS_KEY, {}) || {}) };
}

function saveCmsData(nextData) {
  // Undefined values mean "the source has no value" (e.g. remote columns that
  // don't exist yet) — they never enter the merge, so a cloud hydration that
  // is missing a column cannot wipe a setting the Control Room already saved
  // (this is what made rotation timing revert to 5s after a refresh).
  const stored = readJSON(CMS_KEY, {});
  const incoming = {};
  Object.entries(nextData || {}).forEach(([key, value]) => {
    if (value !== undefined) incoming[key] = value;
  });
  const merged = { ...DEFAULT_CMS_DATA, ...(stored || {}), ...incoming };
  const next = {};
  Object.entries(merged).forEach(([key, value]) => {
    if (value !== undefined) next[key] = value;
  });
  try { window.localStorage.setItem(CMS_KEY, JSON.stringify(next)); } catch (error) { /* storage can be unavailable in private previews */ }
  applyCmsData();
  /* Live hooks (rotation timing) listen for this so a save or a cloud
     hydration re-paces the reels without a page reload. */
  try { window.dispatchEvent(new CustomEvent('khaqan:cms-change')); } catch (error) { /* no-op */ }
  return next;
}

window.KhaqanCMS = {
  defaults: { ...DEFAULT_CMS_DATA },
  get: getCmsData,
  save: saveCmsData,
  /* Cloud → browser hydration with these rules:
     - undefined (a column missing from the DB) never overwrites local;
     - an EMPTY remote bio/leadership field never blanks the non-empty local
       (or default) version until the Control Room actually saves the texts
       to the cloud — right after the SQL migration the DB returns '' and
       must not wipe the content already on screen. */
  hydrate: (remote, base) => saveCmsData(mergeCmsSources(base || getCmsData(), remote)),
  readLeads: () => readJSON(LEADS_KEY, []),
  saveLeads: (leads) => {
    try { window.localStorage.setItem(LEADS_KEY, JSON.stringify(leads)); } catch (error) { /* no-op */ }
  }
};

function mergeCmsSources(base, remote) {
  const next = { ...(base || {}) };
  Object.entries(remote || {}).forEach(([key, value]) => {
    if (value === undefined) return;
    /* Empty remote leadership text = the cloud row has no bio content yet
       (fresh column default); keep the local/default version until then. */
    if (BIO_FIELDS.has(key) && value === '' && next[key]) return;
    next[key] = value;
  });
  return next;
}

/* Managed media library — images & videos added or removed from the Control Room.
   Each item is tagged to a website part (`section`) so the public pages render
   exactly the media meant for them. */
const MEDIA_KEY = 'khaqanMedia';

/* The media catalogue is held in memory first and written through to
   localStorage. That matters for deletes: a library of data-URL uploads can
   pass the ~5 MB origin quota, and once `setItem` throws EVERY write used to
   be lost silently — the row stayed in localStorage, so a deleted photo or
   reel clip simply reappeared as if Delete had never been pressed. With the
   mirror, the change always lands for this tab, the persistence failure is
   reported instead of swallowed, and the Control Room can say so. */
let mediaMirror = null;
let mediaPersistError = null;

const mediaRead = () => {
  if (!mediaMirror) {
    const stored = readJSON(MEDIA_KEY, []);
    mediaMirror = Array.isArray(stored) ? stored : [];
  }
  /* A copy: callers may sort or splice what they are handed (the cloud adopt
     path does), and that must never rewrite the catalogue behind its back. */
  return mediaMirror.slice();
};

function mediaWrite(items) {
  mediaMirror = (Array.isArray(items) ? items : []).slice();
  mediaPersistError = null;
  try {
    window.localStorage.setItem(MEDIA_KEY, JSON.stringify(mediaMirror));
    /* `mediaMirror` is now exactly what the origin holds, so a later read in a
       different tab can rebuild from storage and agree with this one. */
  } catch (error) {
    const quota = /quota/i.test(String((error && error.name) || '')) ||
      Number(error && error.code) === 22 || Number(error && error.code) === 1014;
    mediaPersistError = {
      quota,
      message: quota
        ? 'This browser\'s storage is full, so the media list is only saved for this tab. Sign in to Supabase storage (or remove a large upload) to keep changes between visits.'
        : 'The media list could not be saved in this browser.'
    };
    try { window.dispatchEvent(new CustomEvent('khaqan:media-error', { detail: mediaPersistError })); } catch (ignored) { /* no-op */ }
  }
  try { window.dispatchEvent(new CustomEvent('khaqan:media-change')); } catch (error) { /* no-op */ }
}

/* Media rows created in Supabase are keyed by a server UUID; anything else
   (`media-1699…`) only exists in this browser until it is queued or uploaded. */
const isRemoteMediaId = (id) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(String(id || ''));

/* Another tab saved the library (a Control Room delete, an upload): drop the
   mirror so the next read picks up the new catalogue. */
window.addEventListener('storage', (event) => {
  if (event.key !== MEDIA_KEY) return;
  mediaMirror = null;
  try { window.dispatchEvent(new CustomEvent('khaqan:media-change')); } catch (error) { /* no-op */ }
});
const normalizeMediaItem = (item, i = 0) => {
  const section = (item && item.section) || 'general';
  const isTeam = /^team-/.test(section);
  return {
    id: (item && item.id) || `media-${Date.now()}-${i}-${Math.floor(Math.random() * 1e6)}`,
    type: item && item.type === 'video' ? 'video' : 'image',
    title: (item && item.title) || 'Untitled',
    section,
    /* Page area + slot: together with `section` they say exactly where on
       the public site this file appears. Legacy items without an area land
       in that page's "Fresh from the field" gallery. */
    area: (item && item.area) || (isTeam ? 'portrait' : 'gallery'),
    slot: (item && item.slot) || '',
    /* Playback ceiling in seconds for uploaded videos shown in the hero and
       leadership portrait frames — the clip stops after this many seconds.
       0 means "let it loop as it always has". */
    duration: Number((item && item.duration) || 0) || 0,
    url: (item && item.url) || '',
    storagePath: (item && item.storagePath) || '',
    addedAt: (item && item.addedAt) || new Date().toISOString()
  };
};
window.KhaqanMedia = {
  get: mediaRead,
  add: (item) => {
    const entry = normalizeMediaItem({
      ...(item || {}),
      id: (item && item.id) || `media-${Date.now()}-${Math.floor(Math.random() * 1e6)}`,
      section: (item && item.section) || 'home',
      addedAt: (item && item.addedAt) || new Date().toISOString()
    });
    mediaWrite([entry, ...mediaRead()]);
    return entry;
  },
  /* Delete a row for good. Removal also settles the sync queue, otherwise a
     queued upload for the same item would resurrect it on the next flush (this
     is how a deleted reel clip could come back after signing in). When the row
     is cloud-backed, the pending delete is recorded here so Storage and the
     catalogue row are cleaned up even if the network is down right now. */
  remove: (id) => {
    const removed = mediaRead().find((m) => m.id === id) || null;
    mediaWrite(mediaRead().filter((m) => m.id !== id));
    const sync = window.KhaqanSync;
    if (sync && id) {
      if (sync.forgetMedia) sync.forgetMedia(id);
      if (removed && (removed.storagePath || isRemoteMediaId(id)) && sync.queueDelete) {
        sync.queueDelete(id, removed.storagePath || '');
      }
    }
    return removed;
  },
  /* True when the last write could not be persisted (quota reached). */
  persistError: () => mediaPersistError,
  /* Edit an existing item in place — used by the Control Room "Manage" button
     for retitling, re-tagging to another website part, or swapping the file. */
  update: (id, patch) => {
    let updated = null;
    const items = mediaRead().map((m) => {
      if (m.id !== id) return m;
      updated = normalizeMediaItem({ ...m, ...(patch || {}), id: m.id, addedAt: m.addedAt });
      return updated;
    });
    mediaWrite(items);
    return updated;
  },
  /* Replace the whole library — used when a JSON backup is imported (an
     explicit, deliberate restore, not a background refresh). */
  setAll: (items) => {
    const cleaned = (Array.isArray(items) ? items : [])
      .filter((m) => m && typeof m === 'object' && m.url)
      .map((m, i) => normalizeMediaItem(m, i));
    mediaWrite(cleaned);
    return cleaned;
  },
  /* Cloud → browser merge. The cloud catalogue is the shared source of truth,
     but it must NEVER wipe browser-held files or newer edits that are still
     waiting to reach Supabase (a failed upload, an offline save, a change made
     right before sign-out). Local-only items are kept; rows that are pending
     an update retain the browser's newer copy; pending deletions stay deleted
     even if the remote row has not vanished yet. */
  mergeRemote: (remoteItems) => {
    const sync = window.KhaqanSync;
    const state = sync ? sync.pendingState() : { upserts: [], deletes: [] };
    const deleteIds = new Set((state.deletes || []).map((d) => d.id));
    const updateIds = new Set((state.upserts || []).filter((u) => u.storagePath).map((u) => u.id));
    const localById = new Map();
    /* First occurrence wins: the list is newest-first, so a transient duplicate
       id never lets a stale copy beat the freshest one. */
    mediaRead().forEach((m) => { if (!localById.has(m.id)) localById.set(m.id, m); });
    const merged = [];
    const seen = new Set();
    (Array.isArray(remoteItems) ? remoteItems : []).forEach((m) => {
      if (!m || typeof m !== 'object' || !m.url) return;
      if (deleteIds.has(m.id)) return;
      const localVersion = localById.get(m.id);
      // A newer edit is queued for the cloud — keep the browser's copy until
      // the write lands, otherwise the stale catalogue row wins and the change
      // looks "lost" on the next load.
      if (updateIds.has(m.id) && localVersion) merged.push(normalizeMediaItem(localVersion));
      else merged.push(normalizeMediaItem(m));
      seen.add(m.id);
    });
    mediaRead().forEach((m) => {
      if (seen.has(m.id) || deleteIds.has(m.id)) return;
      merged.push(normalizeMediaItem(m));
    });
    mediaWrite(merged);
    return merged;
  },
  bySection: (section) => mediaRead().filter((m) => m.section === section),
  /* Shared with the Control Room: does this id belong to a Supabase row? */
  isRemoteId: isRemoteMediaId
};

/* =====================================================================
   Durable cloud-sync queue (KhaqanSync)
   ---------------------------------------------------------------------
   The Control Room is local-first: every edit and upload lands in this
   browser's localStorage immediately, and Supabase is the shared store
   for the live site and other browsers. Previously a failed cloud write
   was silently dropped AND any later fetch of the cloud catalogue
   replaced the browser library with it — so changes made while the cloud
   call failed (or made right before sign-out) vanished on the next load,
   and re-signing into the CRM "forgot" them too.

   KhaqanSync keeps an explicit durable queue: metadata in localStorage,
   raw file blobs in IndexedDB. Anything queued is retried on page load,
   on CRM sign-in, when the network comes back and on a slow background
   timer until it reaches Supabase. Signing out never discards it, and
   cloud hydration merges instead of replacing.
   ===================================================================== */
const SYNC_STATE_KEY = 'khaqanCloudPending';
const SYNC_DB_NAME = 'khaqan-cloud-sync';
const SYNC_DB_STORE = 'pending-files';
const SYNC_DB_VERSION = 1;

const emptySyncState = () => ({
  settingsPending: false,
  settingsDirtyAt: 0,
  lastSettingsSyncAt: 0,
  upserts: [],      // media create/update entries waiting for the cloud
  deletes: [],      // media rows waiting to be removed from the cloud
  leadOps: {},      // lead id → { status } waiting for the cloud
  leadDeletes: [],  // lead ids waiting to be removed from the cloud
  leadCreates: []   // contact-form leads waiting to be created in the cloud
});

const readSyncState = () => ({ ...emptySyncState(), ...(readJSON(SYNC_STATE_KEY, {})) });

function writeSyncState(state) {
  try { window.localStorage.setItem(SYNC_STATE_KEY, JSON.stringify(state)); } catch (error) { /* metadata only */ }
}

function notifySyncState() {
  const state = readSyncState();
  const mediaPending = state.upserts.length + state.deletes.length;
  const leadPending = state.leadCreates.length + state.leadDeletes.length + Object.keys(state.leadOps).length;
  const detail = {
    settingsPending: !!state.settingsPending,
    mediaPending,
    leadPending,
    totalPending: mediaPending + leadPending + (state.settingsPending ? 1 : 0),
    lastSyncAt: state.lastSettingsSyncAt || 0
  };
  try { window.dispatchEvent(new CustomEvent('khaqan:sync-state', { detail })); } catch (error) { /* no-op */ }
  return detail;
}

/* Raw files (up to 50 MB) live in IndexedDB — localStorage only holds metadata. */
function openSyncDb() {
  return new Promise((resolve, reject) => {
    const request = window.indexedDB.open(SYNC_DB_NAME, SYNC_DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(SYNC_DB_STORE)) db.createObjectStore(SYNC_DB_STORE);
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}
function withSyncStore(mode, fn) {
  return openSyncDb().then((db) => new Promise((resolve, reject) => {
    const tx = db.transaction(SYNC_DB_STORE, mode);
    const store = tx.objectStore(SYNC_DB_STORE);
    const request = fn(store);
    tx.oncomplete = () => { db.close(); resolve(); };
    tx.onerror = () => { db.close(); reject(tx.error); };
    request.onerror = () => reject(request.error);
  }));
}
const putPendingFile = (key, file) => withSyncStore('readwrite', (store) => store.put(file, key));
const getPendingFile = (key) => openSyncDb().then((db) => new Promise((resolve, reject) => {
  const request = db.transaction(SYNC_DB_STORE, 'readonly').objectStore(SYNC_DB_STORE).get(key);
  request.onsuccess = () => { db.close(); resolve(request.result || null); };
  request.onerror = () => { db.close(); reject(request.error); };
}));
const removePendingFile = (key) => withSyncStore('readwrite', (store) => store.delete(key)).catch(() => {});

const dataUrlToBlob = (dataUrl) => {
  try {
    const comma = String(dataUrl).indexOf(',');
    if (comma < 0) return null;
    const mime = (/^data:([^;]+)/.exec(String(dataUrl).slice(0, comma)) || [])[1] || 'application/octet-stream';
    const bytes = window.atob(String(dataUrl).slice(comma + 1));
    const buffer = new Uint8Array(bytes.length);
    for (let i = 0; i < bytes.length; i += 1) buffer[i] = bytes.charCodeAt(i);
    return new Blob([buffer], { type: mime });
  } catch (error) { return null; }
};

function pendingCount() {
  const state = readSyncState();
  return state.upserts.length + state.deletes.length + state.leadCreates.length + state.leadDeletes.length +
    Object.keys(state.leadOps).length + (state.settingsPending ? 1 : 0);
}

/* Replace a browser-side placeholder with the item the cloud returned. */
function adoptRemoteItem(localId, remote) {
  if (!remote || !window.KhaqanMedia) return;
  const items = window.KhaqanMedia.get();
  const index = items.findIndex((m) => m.id === localId || m.id === remote.id);
  if (index > -1) {
    const next = normalizeMediaItem({
      ...items[index],
      ...remote,
      id: remote.id,
      url: remote.url,
      storagePath: remote.storagePath,
      mimeType: remote.mimeType || items[index].mimeType,
      byteSize: remote.byteSize || items[index].byteSize,
      addedAt: items[index].addedAt || remote.addedAt
    });
    items[index] = next;
    window.KhaqanMedia.setAll(items);
  } else {
    window.KhaqanMedia.add(remote);
  }
}

window.KhaqanSync = {
  pendingState: readSyncState,
  pendingCount,

  markSettingsPending() {
    const state = readSyncState();
    state.settingsPending = true;
    state.settingsDirtyAt = Date.now();
    writeSyncState(state);
    notifySyncState();
  },
  clearSettingsPending() {
    const state = readSyncState();
    state.settingsPending = false;
    state.settingsDirtyAt = 0;
    state.lastSettingsSyncAt = Date.now();
    writeSyncState(state);
    notifySyncState();
  },
  isSettingsPending: () => !!readSyncState().settingsPending,

  /* Queue a media item for the cloud. `file` is optional — editing metadata
     only (title / placement / playback time) needs no new file. */
  async queueMedia(id, file) {
    const item = (window.KhaqanMedia ? window.KhaqanMedia.get() : []).find((m) => m.id === id);
    if (!item) return false;
    const state = readSyncState();
    const previous = state.upserts.find((u) => u.localId === id || u.id === id);
    const entry = {
      id: item.id,
      localId: item.id,
      storagePath: item.storagePath || '',
      title: item.title || 'Untitled',
      section: item.section || 'general',
      area: item.area || 'gallery',
      slot: item.slot || '',
      type: item.type || 'image',
      duration: Number(item.duration) || 0,
      mime: item.mimeType || (file && file.type) || '',
      url: item.url || '',
      fileName: (file && file.name) || (item.fileName || ''),
      queuedAt: Date.now(),
      fileKey: (previous && previous.fileKey) || ''
    };
    if (file) {
      const key = `file-${item.id}`;
      try {
        await putPendingFile(key, file);
        entry.fileKey = key;
        entry.mime = file.type || entry.mime;
        entry.fileName = file.name || entry.fileName;
      } catch (error) {
        /* IndexedDB unavailable — keep the entry anyway. Data-URL items are
           still recoverable from the queue; raw big files simply retry when
           storage is available again. */
      }
    }
    state.upserts = state.upserts.filter((u) => u.localId !== id && u.id !== id);
    state.upserts.push(entry);
    writeSyncState(state);
    notifySyncState();
    return true;
  },

  queueDelete(id, storagePath) {
    const state = readSyncState();
    state.upserts = state.upserts.filter((u) => u.localId !== id && u.id !== id);
    if (!state.deletes.some((d) => d.id === id)) {
      state.deletes.push({ id, storagePath: storagePath || '', queuedAt: Date.now() });
    }
    writeSyncState(state);
    notifySyncState();
  },

  /* An item that never reached Supabase was deleted: forget its queued upload
     (and the raw file held for it in IndexedDB) so the retry can't re-create a
     row the administrator just removed. */
  forgetMedia(id) {
    if (!id) return 0;
    const state = readSyncState();
    const doomed = (state.upserts || []).filter((u) => u.localId === id || u.id === id);
    if (doomed.length) {
      state.upserts = state.upserts.filter((u) => u.localId !== id && u.id !== id);
      writeSyncState(state);
      notifySyncState();
    }
    doomed.forEach((entry) => { if (entry.fileKey) removePendingFile(entry.fileKey); });
    return doomed.length;
  },

  /* Scan the browser library for files that never reached the cloud and queue
     them (a raw file may already be waiting in IndexedDB; otherwise a data-URL
     fallback is converted back into a File). Never rewrites cloud-backed rows. */
  async enqueueLocalOnlyMedia(ids) {
    const cloud = window.KhaqanCloud;
    if (!cloud || !cloud.enabled || !cloud.session()) return { queued: 0 };
    const wanted = ids ? new Set(ids) : null;
    const items = (window.KhaqanMedia ? window.KhaqanMedia.get() : []).filter((m) => {
      if (wanted && !wanted.has(m.id)) return false;
      if (m.storagePath) return false;
      return !/^https?:/i.test(m.url || '');
    });
    let queued = 0;
    for (const item of items) {
      if (readSyncState().upserts.some((u) => u.localId === item.id)) { queued += 1; continue; }
      let file = null;
      try { file = await getPendingFile(`file-${item.id}`); } catch (error) { file = null; }
      if (!file && item.url && item.url.startsWith('data:')) {
        const blob = dataUrlToBlob(item.url);
        if (blob) {
          const ext = (blob.type.split('/')[1] || 'bin').replace(/[^a-z0-9]/gi, '');
          file = new File([blob], item.fileName || `${item.title || 'upload'}.${ext}`, { type: blob.type });
        }
      }
      if (await this.queueMedia(item.id, file)) queued += 1;
    }
    return { queued };
  },

  markLeadStatus(id, status) {
    const state = readSyncState();
    state.leadOps[id] = { status, queuedAt: Date.now() };
    state.leadDeletes = state.leadDeletes.filter((d) => d !== id);
    writeSyncState(state);
    notifySyncState();
  },
  clearLeadStatus(id) {
    const state = readSyncState();
    delete state.leadOps[id];
    writeSyncState(state);
    notifySyncState();
  },
  markLeadDelete(id) {
    const state = readSyncState();
    delete state.leadOps[id];
    if (state.leadDeletes.indexOf(id) === -1) state.leadDeletes.push(id);
    writeSyncState(state);
    notifySyncState();
  },
  clearLeadDelete(id) {
    const state = readSyncState();
    state.leadDeletes = state.leadDeletes.filter((d) => d !== id);
    writeSyncState(state);
    notifySyncState();
  },
  markLeadCreate(lead) {
    if (!lead || !lead.id) return;
    const state = readSyncState();
    if (!state.leadCreates.some((l) => l.id === lead.id)) state.leadCreates.push({ ...lead, queuedAt: Date.now() });
    writeSyncState(state);
    notifySyncState();
  },
  resolveLeadCreate(id) {
    const state = readSyncState();
    state.leadCreates = state.leadCreates.filter((l) => l.id !== id);
    writeSyncState(state);
    notifySyncState();
  },
  /* A status change on a lead that has NOT reached the cloud yet: update the
     queued copy instead of queueing a pointless remote update for a row that
     does not exist. */
  patchLeadCreate(id, status) {
    const state = readSyncState();
    state.leadCreates = state.leadCreates.map((l) => (l.id === id ? { ...l, status, queuedAt: Date.now() } : l));
    writeSyncState(state);
    notifySyncState();
  },
  isPendingLeadCreate(id) {
    return readSyncState().leadCreates.some((l) => l.id === id);
  },

  /* Push everything waiting to Supabase. Only runs with a session (the anon
     key cannot write), so a signed-out browser keeps the queue untouched. */
  async flush() {
    const cloud = window.KhaqanCloud;
    if (!cloud || !cloud.enabled || !cloud.session() || !cloud.session().access_token) {
      return { attempted: false, pending: pendingCount() };
    }
    const state = readSyncState();
    let synced = false;

    if (state.settingsPending && window.KhaqanCMS) {
      try {
        await cloud.saveSettings(window.KhaqanCMS.get());
        state.settingsPending = false;
        state.settingsDirtyAt = 0;
        state.lastSettingsSyncAt = Date.now();
        synced = true;
      } catch (error) { /* stays queued; retried later */ }
    }

    const remainingDeletes = [];
    for (const item of state.deletes || []) {
      /* A browser-side id was never sent to Supabase, so there is no remote row
         to remove — dropping it here keeps the queue from retrying a delete
         against a UUID column forever (which left "1 change waiting" on screen). */
      if (!item.id || !isRemoteMediaId(item.id)) {
        if (item.storagePath) {
          try { await cloud.removeMediaObject(item.storagePath); synced = true; } catch (error) { remainingDeletes.push(item); }
        }
        continue;
      }
      try {
        await cloud.deleteMedia(item.id, item.storagePath);
        synced = true;
      } catch (error) { remainingDeletes.push(item); }
    }
    state.deletes = remainingDeletes;

    const remainingUpserts = [];
    for (const entry of state.upserts || []) {
      try {
        let file = null;
        if (entry.fileKey) {
          try { file = await getPendingFile(entry.fileKey); } catch (error) { file = null; }
        }
        let saved = null;
        if (entry.storagePath) {
          saved = await cloud.updateMedia(entry.id, {
            title: entry.title, section: entry.section, area: entry.area, slot: entry.slot,
            duration: entry.duration, type: entry.type,
            file: file || undefined,
            storagePath: entry.storagePath
          });
        } else {
          let uploadFile = file;
          if (!uploadFile && entry.url && entry.url.startsWith('data:')) {
            const blob = dataUrlToBlob(entry.url);
            if (blob) {
              const ext = (blob.type.split('/')[1] || 'bin').replace(/[^a-z0-9]/gi, '');
              uploadFile = new File([blob], entry.fileName || `${entry.title || 'upload'}.${ext}`, { type: entry.mime || blob.type });
            }
          }
          if (!uploadFile) { remainingUpserts.push(entry); continue; }
          saved = await cloud.uploadMedia({
            file: uploadFile, title: entry.title, section: entry.section, area: entry.area,
            slot: entry.slot, type: entry.type, duration: entry.duration
          });
        }
        if (saved && window.KhaqanMedia) adoptRemoteItem(entry.localId || entry.id, saved);
        if (entry.fileKey) await removePendingFile(entry.fileKey);
        synced = true;
      } catch (error) {
        remainingUpserts.push(entry);
      }
    }
    state.upserts = remainingUpserts;

    const remainingLeadDeletes = [];
    for (const id of state.leadDeletes || []) {
      try {
        await cloud.deleteEnquiry(id);
        synced = true;
      } catch (error) { remainingLeadDeletes.push(id); }
    }
    state.leadDeletes = remainingLeadDeletes;

    const remainingLeadOps = {};
    for (const [id, op] of Object.entries(state.leadOps || {})) {
      try {
        await cloud.updateEnquiry(id, op.status);
        synced = true;
      } catch (error) { remainingLeadOps[id] = op; }
    }
    state.leadOps = remainingLeadOps;

    const remainingCreates = [];
    for (const lead of state.leadCreates || []) {
      try {
        await cloud.createEnquiry(lead);
        synced = true;
        /* leave resolution to mergeLeads — the row now exists remotely with a
           new UUID and the local copy is dropped when it matches */
      } catch (error) { remainingCreates.push(lead); }
    }
    state.leadCreates = remainingCreates;

    writeSyncState(state);
    notifySyncState();
    return { attempted: true, synced, pending: pendingCount() };
  }
};

/* Friendly labels for the website part a media item is tagged to. */
window.KHAQAN_MEDIA_SECTIONS = [
  { value: 'home', label: 'Home' },
  { value: 'about', label: 'About us' },
  { value: 'operations', label: 'Operations' },
  { value: 'supply', label: 'Supply' },
  { value: 'gallery', label: 'Gallery' },
  { value: 'community', label: 'Community' },
  { value: 'contact', label: 'Contact' },
  { value: 'team-director', label: 'Team — Director' },
  { value: 'team-ceo', label: 'Team — CEO' },
  { value: 'team-md', label: 'Team — MD' },
  { value: 'team-cfo', label: 'Team — CFO' },
  { value: 'general', label: 'General' }
];
window.KHAQAN_MEDIA_SECTION_LABEL = (value) => {
  const match = window.KHAQAN_MEDIA_SECTIONS.find((s) => s.value === value);
  if (match) return match.label;
  /* Added leadership members get a section like `team-<key>`; label it with the
     member's name so the media list reads "Team — <name>" instead of a raw key. */
  if (/^team-/.test(String(value || '')) && window.KhaqanCMS) {
    const key = String(value || '').replace(/^team-/, '');
    const member = (window.KhaqanCMS.get().teamMembers || []).find((m) => m.key === key);
    if (member) return `Team — ${member.name || key}`;
  }
  return value;
};

/* Page + page-area map. Every public visual slot the Control Room can
   replace is listed here so CRM cards can show "Home · Field notes · 01"
   and the public pages can swap the matching `[data-media-slot]`. */
const MEDIA_SLOT = (id, label, defaultSrc) => ({ id, label, defaultSrc });
window.KHAQAN_PAGES = [
  { id: 'home', label: 'Home', href: 'index.html' },
  { id: 'about', label: 'About us', href: 'about.html' },
  { id: 'operations', label: 'Operations', href: 'operations.html' },
  { id: 'supply', label: 'Supply', href: 'supply.html' },
  { id: 'gallery', label: 'Gallery', href: 'gallery.html' },
  { id: 'community', label: 'Community', href: 'community.html' },
  { id: 'contact', label: 'Contact', href: 'contact.html' },
  { id: 'general', label: 'Library only', href: '' }
];
window.KHAQAN_PAGE_AREAS = {
  home: [
    { id: 'gallery', label: 'Fresh from the field', kind: 'gallery' },
    { id: 'reel', label: 'Highlights reel', kind: 'slots', slots: [
      MEDIA_SLOT('1', '01 · Open pit', 'media/coal-mining-poster.webp'),
      MEDIA_SLOT('2', '02 · Cutting face', 'media/cine/reel-bucketwheel.webp'),
      MEDIA_SLOT('3', '03 · Terraces', 'media/cine/reel-aerial.webp'),
      MEDIA_SLOT('4', '04 · Coal on the move', 'media/excavator-poster.webp'),
      MEDIA_SLOT('5', '05 · Longwall', 'media/cine/reel-underground.webp'),
      MEDIA_SLOT('6', '06 · Hauler', 'media/hauler-poster.webp'),
      MEDIA_SLOT('7', '07 · Haul road', 'media/cine/reel-haulroad.webp'),
      MEDIA_SLOT('8', '08 · Our valley', 'media/darra-photo-2.webp'),
      MEDIA_SLOT('9', '09 · Railhead', 'media/cine/reel-rail.webp')
    ] },
    { id: 'journey', label: 'From seam to site', kind: 'slots', slots: [
      MEDIA_SLOT('1', '01 / Origin', 'media/mine-3d-underground.webp'),
      MEDIA_SLOT('2', '02 / Align', 'media/mine-3d-stockpile.webp'),
      MEDIA_SLOT('3', '03 / Destination', 'media/coal-haul-truck.webp')
    ] },
    { id: 'field-notes', label: 'Field notes', kind: 'slots', slots: [
      MEDIA_SLOT('1', '01 · Field reference', 'media/mine-3d-terraces.webp'),
      MEDIA_SLOT('2', '02 · Heavy equipment', 'media/mine-3d-underground.webp'),
      MEDIA_SLOT('3', '03 · Motion study', 'media/excavator-poster.webp')
    ] },
    { id: 'distribution', label: 'Mine · move · market', kind: 'slots', slots: [
      MEDIA_SLOT('1', '01 · Mine to road', 'media/coal-haul-truck.webp'),
      MEDIA_SLOT('2', '02 · Rail movement', 'media/coal-rail-transport.webp'),
      MEDIA_SLOT('3', '03 · Site logistics', 'media/coal-mine-transport.webp')
    ] }
  ],
  about: [
    { id: 'gallery', label: 'Fresh from the field', kind: 'gallery' },
    { id: 'legacy', label: 'Valley story', kind: 'slots', slots: [
      MEDIA_SLOT('1', 'Where the valley meets the work', 'media/cine/valley-dawn.webp')
    ] },
    { id: 'field', label: 'Company in the field', kind: 'slots', slots: [
      MEDIA_SLOT('1', 'Mining context', 'media/mine-3d-terraces.webp'),
      MEDIA_SLOT('2', 'Distribution', 'media/coal-haul-truck.webp'),
      MEDIA_SLOT('3', 'Home ground', 'media/darra-photo-4.webp'),
      MEDIA_SLOT('4', 'Field footage', 'media/coal-mining-poster.webp')
    ] }
  ],
  operations: [
    { id: 'gallery', label: 'Fresh from the field', kind: 'gallery' },
    { id: 'machinery', label: 'Heavy machinery', kind: 'slots', slots: [
      MEDIA_SLOT('1', 'Conveyor system', 'media/mining-conveyor.webp'),
      MEDIA_SLOT('2', 'Bucket-wheel excavation', 'media/welzow-bucket-poster.webp')
    ] },
    { id: 'field', label: 'Real field references', kind: 'slots', slots: [
      MEDIA_SLOT('1', 'Aerial view', 'media/mining-site.webp'),
      MEDIA_SLOT('2', 'Conveyor system', 'media/mining-conveyor.webp'),
      MEDIA_SLOT('3', 'Open footage', 'media/hauler-poster.webp'),
      MEDIA_SLOT('4', 'Coal transport', 'media/coal-haul-truck.webp'),
      MEDIA_SLOT('5', 'Mine layout', 'media/mining-aerial.webp'),
      MEDIA_SLOT('6', 'Haul road', 'media/coal-mine-transport.webp')
    ] }
  ],
  supply: [
    { id: 'gallery', label: 'Fresh from the field', kind: 'gallery' },
    { id: 'transport', label: 'Distribution & export', kind: 'slots', slots: [
      MEDIA_SLOT('1', 'Mine to road', 'media/coal-haul-truck.webp'),
      MEDIA_SLOT('2', 'Coal by truck', 'media/coal-mine-transport.webp'),
      MEDIA_SLOT('3', 'Coal by rail', 'media/cine/reel-rail.webp')
    ] }
  ],
  gallery: [
    { id: 'gallery', label: 'Fresh from the field', kind: 'gallery' },
    { id: 'stills', label: 'Place · process · pride', kind: 'slots', slots: [
      MEDIA_SLOT('1', '01 · The source', 'media/cine/hero-01.webp'),
      MEDIA_SLOT('2', '02 · Stockpile operations', 'media/cine/hero-04.webp'),
      MEDIA_SLOT('3', '03 · The material', 'media/cine/coal-rock.webp'),
      MEDIA_SLOT('4', '04 · Material flow', 'media/cine/gallery-conveyor.webp'),
      MEDIA_SLOT('5', '05 · Terraced benches', 'media/mine-3d-terraces.webp'),
      MEDIA_SLOT('6', '06 · Underground', 'media/mine-3d-underground.webp'),
      MEDIA_SLOT('7', '07 · Haul road', 'media/mine-3d-trucks.webp'),
      MEDIA_SLOT('8', '08 · The full pit', 'media/cine/hero-05.webp')
    ] },
    { id: 'film', label: 'Motion from the field', kind: 'slots', slots: [
      MEDIA_SLOT('1', 'Excavation', 'media/excavator-poster.webp'),
      MEDIA_SLOT('2', 'Surface mining', 'media/welzow-bucket-poster.webp'),
      MEDIA_SLOT('3', 'Haul road', 'media/hauler-poster.webp'),
      MEDIA_SLOT('4', 'Rail movement', 'media/cine/reel-rail.webp')
    ] },
    { id: 'hometown', label: 'Darra Adam Khel · our home', kind: 'slots', slots: [
      MEDIA_SLOT('1', 'The valley', 'media/darra-photo-1.webp'),
      MEDIA_SLOT('2', 'Mine country', 'media/darra-photo-2.webp'),
      MEDIA_SLOT('3', 'The ground that moves the coal', 'media/darra-photo-3.webp'),
      MEDIA_SLOT('4', 'Local ground', 'media/darra-photo-4.webp')
    ] }
  ],
  community: [
    { id: 'gallery', label: 'Fresh from the field', kind: 'gallery' },
    { id: 'field', label: 'Work and landscape', kind: 'slots', slots: [
      MEDIA_SLOT('1', 'Home ground', 'media/darra-photo-1.webp'),
      MEDIA_SLOT('2', 'Mine country', 'media/darra-photo-2.webp'),
      MEDIA_SLOT('3', 'Movement', 'media/darra-photo-3.webp'),
      MEDIA_SLOT('4', 'Our people', 'media/darra-photo-4.webp')
    ] }
  ],
  contact: [
    { id: 'gallery', label: 'Fresh from the field', kind: 'gallery' }
  ],
  general: [
    { id: 'library', label: 'Unplaced library', kind: 'gallery' }
  ]
};

window.KHAQAN_MEDIA_PLACEMENT = (() => {
  const pages = () => window.KHAQAN_PAGES || [];
  const areasOf = (pageId) => (window.KHAQAN_PAGE_AREAS && window.KHAQAN_PAGE_AREAS[pageId]) || [];
  const isTeam = (item) => !!(item && /^team-/.test(item.section));
  const pageOf = (item) => {
    if (!item) return 'general';
    if (isTeam(item)) return 'about';
    return item.section || 'general';
  };
  const areaOf = (item) => {
    if (!item) return 'gallery';
    if (isTeam(item)) return 'portrait';
    return item.area || 'gallery';
  };
  const slotOf = (item) => (item && item.slot) || '';
  const isGallery = (item) => {
    if (!item || isTeam(item)) return false;
    const area = areaOf(item);
    return area === 'gallery' || area === 'library' || area === '';
  };
  const pageMeta = (pageId) => pages().find((p) => p.id === pageId) || { id: pageId, label: pageId, href: '' };
  const areaMeta = (pageId, areaId) => areasOf(pageId).find((a) => a.id === areaId) || null;
  const slotMeta = (pageId, areaId, slotId) => {
    const area = areaMeta(pageId, areaId);
    if (!area || !area.slots) return null;
    return area.slots.find((s) => s.id === String(slotId)) || null;
  };
  const label = (item) => {
    if (isTeam(item)) {
      return {
        page: 'Home & About',
        area: window.KHAQAN_MEDIA_SECTION_LABEL ? window.KHAQAN_MEDIA_SECTION_LABEL(item.section) : item.section,
        slot: '',
        href: 'about.html',
        text: `Home & About · ${window.KHAQAN_MEDIA_SECTION_LABEL ? window.KHAQAN_MEDIA_SECTION_LABEL(item.section) : item.section}`
      };
    }
    const pageId = pageOf(item);
    const areaId = areaOf(item);
    const slotId = slotOf(item);
    const page = pageMeta(pageId);
    const area = areaMeta(pageId, areaId);
    const slot = slotId ? slotMeta(pageId, areaId, slotId) : null;
    const areaName = area ? area.label : (areaId || 'Fresh from the field');
    const slotName = slot ? slot.label : '';
    const parts = [page.label, areaName].concat(slotName ? [slotName] : []);
    return { page: page.label, area: areaName, slot: slotName, href: page.href || '', text: parts.join(' · ') };
  };
  const occupant = (items, pageId, areaId, slotId) => {
    const list = Array.isArray(items) ? items : [];
    const wantSlot = String(slotId || '1');
    return list.find((m) => pageOf(m) === pageId && areaOf(m) === areaId && (slotOf(m) || '1') === wantSlot && !isGallery(m)) || null;
  };
  return {
    pages, areasOf, pageOf, areaOf, slotOf, isGallery, isTeam,
    pageMeta, areaMeta, slotMeta, label, occupant
  };
})();

/* =====================================================================
   Page copy & tile labels (KhaqanSlotCopy)
   ---------------------------------------------------------------------
   Every heading, caption line and reel chapter tile on the public pages can
   be re-worded from the Control Room without touching a line of HTML. Two
   kinds of key are supported, using the same reference as a media slot:

     'home:reel'      → the section head above the area (eyebrow / heading / intro)
     'home:reel:4'    → one frame: its caption line, its heading, and the label
                        on the chapter tile beside the reel stage

   The map lives inside the site-settings payload (`slotCopy`), so it saves,
   syncs, queues and hydrates exactly like every other piece of site copy —
   no extra column groups to deploy, and a public page re-applies it on the
   `khaqan:cms-change` event. Blank values fall back to the wording shipped in
   the HTML, so clearing an override is always safe.
   ===================================================================== */
const SLOT_COPY_FIELDS = { eyebrow: 60, heading: 120, text: 260, caption: 90, tile: 40 };

window.KhaqanSlotCopy = {
  fields: SLOT_COPY_FIELDS,
  all() {
    const map = getCmsData().slotCopy;
    return map && typeof map === 'object' && !Array.isArray(map) ? map : {};
  },
  get(key) {
    const entry = window.KhaqanSlotCopy.all()[key];
    return entry && typeof entry === 'object' ? entry : null;
  },
  /* Write (or blank) one field of one spot. Returns the stored entry. */
  set(key, patch) {
    const map = { ...window.KhaqanSlotCopy.all() };
    const next = { ...(map[key] || {}) };
    Object.entries(patch || {}).forEach(([field, value]) => {
      if (!Object.prototype.hasOwnProperty.call(SLOT_COPY_FIELDS, field)) return;
      const text = String(value == null ? '' : value).replace(/\s+/g, ' ').trim().slice(0, SLOT_COPY_FIELDS[field]);
      if (text) next[field] = text;
      else delete next[field];
    });
    if (Object.keys(next).length) map[key] = next;
    else delete map[key];
    saveCmsData({ ...getCmsData(), slotCopy: map });
    return Object.keys(next).length ? next : null;
  },
  clear(key) { return window.KhaqanSlotCopy.set(key, { eyebrow: '', heading: '', text: '', caption: '', tile: '' }); },
  /* How many spots currently carry custom wording (shown in the Control Room). */
  count() { return Object.keys(window.KhaqanSlotCopy.all()).length; },
  /* The copy shipped in the page, used as the placeholder of every field so
     the administrator can see what a blank box will fall back to. */
  defaults(key) {
    const parts = String(key || '').split(':');
    const [pageId, areaId, slotId] = parts;
    const areas = (window.KHAQAN_PAGE_AREAS && window.KHAQAN_PAGE_AREAS[pageId]) || [];
    const area = areas.find((item) => item.id === areaId);
    if (!slotId || !area || !area.slots) return { area: area ? area.label : areaId || '' };
    const slot = area.slots.find((item) => String(item.id) === String(slotId)) || {};
    return { area: area.label, slot: slot.label || '', file: slot.defaultSrc || '' };
  }
};

/* Leadership bio fields are edited from the Control Room. They may keep a
   <strong> lead-in (rendered bold); all other HTML is stripped for safety. */
const BIO_FIELDS = new Set([
  'directorBio', 'ceoBio', 'mdBio', 'cfoBio',
  'directorCard1', 'directorCard2', 'ceoCard1', 'ceoCard2',
  'mdCard1', 'mdCard2', 'cfoCard1', 'cfoCard2'
]);

function sanitizeInlineHtml(value) {
  const holder = document.createElement('div');
  holder.innerHTML = String(value ?? '');
  holder.querySelectorAll('*').forEach((el) => {
    if (!/^(STRONG|B|EM|I|BR)$/.test(el.tagName)) {
      el.replaceWith(document.createTextNode(el.textContent));
      return;
    }
    for (const attr of Array.from(el.attributes)) el.removeAttribute(attr.name);
  });
  return holder.innerHTML;
}

/* =====================================================================
   Leadership team + reel sequence rendering
   ---------------------------------------------------------------------
   The rotating team hero (Home + About) and the About team cards are built
   from the `teamMembers` list in the site settings, so the Control Room can
   add, edit, re-order and remove members with no HTML changes. The home
   highlights reel is re-ordered from `reelSequence`. Both run once, early
   (before the rotation timers and writing-animation blocks below capture
   their node lists), so a freshly-built DOM is wired like the shipped one.
   ===================================================================== */
let teamSequenceRendered = false;

function escapeAttr(value) {
  return String(value == null ? '' : value).replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
}

function normalizeTeamMembers(list) {
  const members = Array.isArray(list) ? list : [];
  return members.filter((m) => m && typeof m === 'object' && (m.key || m.name)).map((m) => ({
    key: String(m.key || (m.name || '').toLowerCase().replace(/[^a-z0-9]+/gi, '-')),
    role: m.role || 'Leader',
    name: m.name || String(m.key || 'Member'),
    monogram: m.monogram || '',
    kicker: m.kicker || '',
    accent: m.accent || 'emerald',
    bio: m.bio == null ? '' : String(m.bio),
    card1: m.card1 == null ? '' : String(m.card1),
    card2: m.card2 == null ? '' : String(m.card2)
  }));
}

function teamMemberMonogram(member) {
  if (member.monogram) return String(member.monogram).toUpperCase().slice(0, 3);
  const parts = String(member.name || '').trim().split(/\s+/);
  return ((parts[0] ? parts[0][0] : '') + (parts[parts.length - 1] ? parts[parts.length - 1][0] : '')).toUpperCase();
}

function splitName(name) {
  const parts = String(name || '').trim().split(/\s+/);
  return { first: parts[0] || '', last: parts.slice(1).join(' ') };
}

function teamHeroSlideHtml(member, index) {
  const { first, last } = splitName(member.name);
  const role = member.key === 'director' ? `${member.role || 'Director'} · Khaqan Coal Company` : (member.role || 'Leader');
  return `<article class="team-slide${index === 0 ? ' active' : ''}" data-team-accent="${escapeAttr(member.accent || 'emerald')}" data-member="${escapeAttr(member.key)}">
    <div class="team-portrait" role="img" aria-label="Portrait of ${escapeAttr(member.name)}" data-monogram="${escapeAttr(teamMemberMonogram(member))}"><div class="team-halo"></div></div>
    <div class="team-copy"><span class="team-kicker">${escapeAttr(member.kicker || '')}</span><span class="team-role">${escapeAttr(role)}</span><h2>${escapeAttr(first)} <span>${escapeAttr(last)}</span></h2><p>${sanitizeInlineHtml(member.bio)}</p></div>
  </article>`;
}

function teamCardHtml(member) {
  const role = member.key === 'director' ? `${member.role || 'Director'} · Khaqan Coal Company` : (member.role || '');
  return `<article class="team-card" data-team-accent="${escapeAttr(member.accent || 'emerald')}" data-member="${escapeAttr(member.key)}"><span class="team-role">${escapeAttr(role)}</span><div class="team-portrait-mini" role="img" aria-label="Portrait of ${escapeAttr(member.name)}"></div><h3>${escapeAttr(member.name)}</h3><p>${sanitizeInlineHtml(member.card1 || '')}</p><p>${sanitizeInlineHtml(member.card2 || '')}</p></article>`;
}

function renderTeamHeroes() {
  const members = normalizeTeamMembers(getCmsData().teamMembers);
  if (!members.length) return;
  document.querySelectorAll('[data-team-hero]').forEach((hero) => {
    const wrap = hero.querySelector('.team-slides');
    if (!wrap) return;
    wrap.innerHTML = members.map((member, i) => teamHeroSlideHtml(member, i)).join('');
    const count = hero.querySelector('[data-team-count]');
    if (count) count.textContent = `${String(1).padStart(2, '0')} / ${String(members.length).padStart(2, '0')}`;
  });
}

function renderTeamCards() {
  const members = normalizeTeamMembers(getCmsData().teamMembers);
  if (!members.length) return;
  document.querySelectorAll('.team-grid').forEach((grid) => {
    grid.innerHTML = members.map((member) => teamCardHtml(member)).join('');
  });
}

function applyReelSequence() {
  const seq = getCmsData().reelSequence;
  if (!Array.isArray(seq) || !seq.length) return;
  document.querySelectorAll('[data-reel]').forEach((reel) => {
    if (reel.dataset.khaqanSequenceApplied) return;
    const band = reel.closest('section') || reel.parentElement;
    if (!band) return;
    const slides = Array.from(reel.querySelectorAll('.reel-slide'));
    const tiles = Array.from(band.querySelectorAll('[data-reel-jump]'));
    if (!slides.length) return;
    const bySlot = new Map();
    slides.forEach((slide) => { if (slide.dataset.mediaSlot) bySlot.set(slide.dataset.mediaSlot, slide); });
    const ordered = [];
    seq.forEach((slotKey) => {
      const slide = bySlot.get(slotKey);
      if (slide && ordered.indexOf(slide) === -1) ordered.push(slide);
    });
    slides.forEach((slide) => { if (ordered.indexOf(slide) === -1) ordered.push(slide); });
    const slidesWrap = reel.querySelector('.reel-slides') || reel;
    ordered.forEach((slide) => slidesWrap.appendChild(slide));
    /* The chapter rail matches the stage position: re-order the buttons to the
       same sequence and renumber their `data-reel-jump` so a click still jumps
       to the slide beside the same slot. */
    const tagToTile = new Map();
    tiles.forEach((tile) => {
      const span = tile.querySelector('span');
      const label = span ? span.textContent.trim() : (tile.textContent || '').trim();
      if (label) tagToTile.set(label, tile);
    });
    const rail = tiles[0] ? tiles[0].parentElement : null;
    if (rail) {
      ordered.forEach((slide, i) => {
        const tag = slide.dataset.reelTag || '';
        const tile = tagToTile.get(tag);
        if (tile) {
          tile.dataset.reelJump = String(i);
          tile.setAttribute('aria-selected', 'false');
          rail.appendChild(tile);
        }
      });
    }
    reel.dataset.khaqanSequenceApplied = '1';
  });
}

/* Build the leadership hero/cards and re-order the reel once, before the
   rotation and writing-animation blocks capture their node lists. A later
   re-order of an already-open page takes effect on the next load. */
function ensureTeamAndSequenceRendered() {
  if (teamSequenceRendered) return;
  teamSequenceRendered = true;
  renderTeamHeroes();
  renderTeamCards();
  applyReelSequence();
}

function applyCmsData() {
  const data = getCmsData();
  ensureTeamAndSequenceRendered();
  document.querySelectorAll('[data-cms]').forEach((node) => {
    const key = node.dataset.cms;
    if (key === 'phoneDisplay') {
      const methods = [data.phone, data.whatsapp].filter(Boolean);
      node.textContent = methods.length ? methods.join(' · ') : 'Send your number or preferred contact method in the form.';
      return;
    }
    if (Object.prototype.hasOwnProperty.call(data, key)) {
      if (BIO_FIELDS.has(key)) node.innerHTML = sanitizeInlineHtml(data[key]);
      else node.textContent = data[key];
      // If a leadership paragraph is being typed, re-run its writing animation.
      if (node.matches && node.matches('.team-copy p, .team-card p')) refreshTeamCopyFromCms(node);
    }
  });
}

function currentTheme() {
  return window.localStorage.getItem(THEME_KEY) || 'night';
}

function currentSkin() {
  const skin = window.localStorage.getItem(SKIN_KEY);
  return SKINS.indexOf(skin) > -1 ? skin : 'signature';
}

/* Keep the selected skin between the shared and refinement sheets so the original
   cascade order survives while visitors download only one skin block. */
function syncSkinStylesheet(skin) {
  document.querySelectorAll('link[data-skin-stylesheet]').forEach((link) => {
    link.media = link.dataset.skinStylesheet === skin ? 'all' : 'not all';
  });
}

function updateThemeButtons() {
  const day = document.documentElement.dataset.theme === 'day';
  document.querySelectorAll('.theme-toggle').forEach((button) => {
    button.setAttribute('aria-pressed', String(day));
    button.setAttribute('aria-label', day ? 'Switch to night mode' : 'Switch to day mode');
    const icon = button.querySelector('.theme-toggle-icon');
    const label = button.querySelector('.theme-toggle-label');
    if (icon) icon.textContent = day ? '☾' : '☼';
    if (label) label.textContent = day ? 'Night' : 'Day';
  });
}

function updateSkinButtons() {
  const skin = currentSkin();
  document.querySelectorAll('.skin-option').forEach((button) => {
    const active = button.dataset.skin === skin;
    button.classList.toggle('active', active);
    button.setAttribute('aria-checked', String(active));
  });
}

function updateThemeColorMeta() {
  const meta = document.querySelector('meta[name="theme-color"]');
  if (!meta) return;
  // Follow the colour actually painted behind the content, not a table someone has to
  // remember to update: THEME_COLORS used to disagree with the CSS on four of six
  // theme/skin pairs. Transitions are suppressed for the read so a skin cross-fade
  // cannot report an interpolated mid-frame, and the painted value is converted to hex
  // because theme-color only accepts colour keywords / hex / rgb().
  const mode = document.documentElement.dataset.theme === 'day' ? 'day' : 'night';
  const fallback = (THEME_COLORS[currentSkin()] || THEME_COLORS.signature)[mode];
  const body = document.body;
  const prevTransition = body.style.transition;
  // Important, and inline: the .theming cross-fade rule in themes.css ends in
  // !important, so a plain override loses to it and the read hands back the colour the
  // transition is coming *from*. Inline-important is the only thing that outranks it.
  body.style.setProperty('transition', 'none', 'important');
  let painted = getComputedStyle(body).backgroundColor;
  if (/rgba\(\s*[^)]+,\s*0\s*\)$/.test(painted) || painted === 'transparent') {
    painted = getComputedStyle(document.documentElement).backgroundColor;
  }
  if (prevTransition) body.style.transition = prevTransition; else body.style.removeProperty('transition');
  const nums = (painted.match(/\d+(\.\d+)?/g) || []).slice(0, 3).map((n) => Math.round(+n));
  const color = nums.length === 3
    ? '#' + nums.map((n) => Math.max(0, Math.min(255, n)).toString(16).padStart(2, '0')).join('')
    : fallback;
  if (color) meta.setAttribute('content', color);
}

/* Brief global transition class so skin / day-night changes cross-fade smoothly. */
function withThemeTransition(apply) {
  const root = document.documentElement;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced) { apply(); return; }
  root.classList.add('theming');
  apply();
  window.setTimeout(() => root.classList.remove('theming'), 700);
}

function setTheme(theme) {
  const nextTheme = theme === 'day' ? 'day' : 'night';
  withThemeTransition(() => {
    document.documentElement.dataset.theme = nextTheme;
    try { window.localStorage.setItem(THEME_KEY, nextTheme); } catch (error) { /* no-op */ }
  });
  updateThemeButtons();
  updateThemeColorMeta();
}

function setSkin(skin) {
  const nextSkin = SKINS.indexOf(skin) > -1 ? skin : 'signature';
  withThemeTransition(() => {
    document.documentElement.dataset.skin = nextSkin;
    syncSkinStylesheet(nextSkin);
    try { window.localStorage.setItem(SKIN_KEY, nextSkin); } catch (error) { /* no-op */ }
  });
  updateSkinButtons();
  updateThemeColorMeta();
  closeSkinMenus();
}

/* Skin picker menu behaviour. */
function closeSkinMenus(options) {
  const openMenu = document.querySelector('.skin-menu[data-open]');
  const hadFocus = openMenu && (document.activeElement === document.body || openMenu.contains(document.activeElement));
  document.querySelectorAll('.skin-menu').forEach((menu) => {
    menu.removeAttribute('data-open');
    menu.hidden = true;
  });
  document.querySelectorAll('.skin-toggle').forEach((button) => {
    button.setAttribute('aria-expanded', 'false');
  });
  // Escaping or picking a theme should leave the caret where the reader left it,
  // not at the top of the document.
  if (openMenu && hadFocus && !(options && options.keepFocus)) {
    const button = openMenu.closest('.skin-switch') && openMenu.closest('.skin-switch').querySelector('.skin-toggle');
    if (button) button.focus({ preventScroll: true });
  }
}

function toggleSkinMenu(switchEl) {
  const menu = switchEl.querySelector('.skin-menu');
  if (!menu) return;
  const willOpen = menu.hidden;
  closeSkinMenus();
  if (willOpen) {
    menu.hidden = false;
    menu.setAttribute('data-open', '');
    const button = switchEl.querySelector('.skin-toggle');
    if (button) button.setAttribute('aria-expanded', 'true');
    const first = menu.querySelector('.skin-option');
    if (first) first.focus({ preventScroll: true });
  }
}

document.documentElement.dataset.theme = currentTheme();
document.documentElement.dataset.skin = currentSkin();
syncSkinStylesheet(document.documentElement.dataset.skin);
const skinStyleObserver = new MutationObserver(() => {
  syncSkinStylesheet(document.documentElement.dataset.skin);
});
skinStyleObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-skin'] });

const path = window.location.pathname.split('/').pop() || 'index.html';

document.querySelectorAll('[data-nav]').forEach((link) => {
  const target = link.getAttribute('href').split('/').pop() || 'index.html';
  if ((path === '' && target === 'index.html') || path === target) {
    link.classList.add('active');
    link.setAttribute('aria-current', 'page');
  }
});

const header = document.querySelector('.site-header');

const themeButtons = document.querySelectorAll('.theme-toggle');
themeButtons.forEach((button) => {
  button.addEventListener('click', () => setTheme(document.documentElement.dataset.theme === 'day' ? 'night' : 'day'));
});

document.querySelectorAll('.skin-switch').forEach((switchEl) => {
  const toggle = switchEl.querySelector('.skin-toggle');
  if (toggle) toggle.addEventListener('click', (event) => { event.stopPropagation(); toggleSkinMenu(switchEl); });
  const menuEl = switchEl.querySelector('.skin-menu');
  if (menuEl) {
    /* `role=menu` means arrow keys, Home and End move the selection; Escape
       hands focus back to the button that opened it. */
    menuEl.addEventListener('keydown', (event) => {
      const options = Array.from(menuEl.querySelectorAll('.skin-option'));
      if (!options.length) return;
      const at = options.indexOf(document.activeElement);
      if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
        event.preventDefault();
        const step = event.key === 'ArrowDown' ? 1 : -1;
        options[(at + step + options.length) % options.length].focus({ preventScroll: true });
      } else if (event.key === 'Home') {
        event.preventDefault();
        options[0].focus({ preventScroll: true });
      } else if (event.key === 'End') {
        event.preventDefault();
        options[options.length - 1].focus({ preventScroll: true });
      } else if (event.key === 'Escape') {
        event.preventDefault();
        event.stopPropagation();
        closeSkinMenus();
      }
    });
  }
  switchEl.querySelectorAll('.skin-option').forEach((option) => {
    option.addEventListener('click', () => setSkin(option.dataset.skin));
  });
});
document.addEventListener('click', (event) => {
  if (!event.target.closest('.skin-switch')) closeSkinMenus();
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeSkinMenus();
});
updateThemeButtons();
updateSkinButtons();
updateThemeColorMeta();
applyCmsData();

async function hydrateCloudContent() {
  const cloud = window.KhaqanCloud;
  if (!cloud || !cloud.enabled) return;
  const sync = window.KhaqanSync;
  /* First push anything still waiting from an earlier session. A not-yet-expired
     session token lets any page finish the sync; otherwise the CRM retries
     after the next sign-in. Sign-out never deletes the queue. */
  if (sync && cloud.session()) await sync.flush().catch(() => {});
  try {
    const remoteData = await cloud.getSettings();
    if (remoteData && !(sync && sync.isSettingsPending())) window.KhaqanCMS.hydrate(remoteData);
  } catch (error) {
    // Keep the local preview available if Supabase is not yet configured or reachable.
  }
  try {
    const remoteMedia = await cloud.listMedia();
    if (Array.isArray(remoteMedia) && window.KhaqanMedia) {
      /* Merge — never replace. Browser-held files and newer edits stay. */
      window.KhaqanMedia.mergeRemote(remoteMedia);
      if (sync && cloud.session()) {
        await sync.enqueueLocalOnlyMedia().catch(() => {});
        await sync.flush().catch(() => {});
      }
    }
  } catch (error) {
    // Keep the browser media library if Storage is not yet configured or reachable.
  }
}
hydrateCloudContent();

/* Keep working through a queue: retry when the network returns, when the tab
   becomes visible again, and on a slow background timer while anything is
   pending. All of it is harmless on pages without a session (no-op). */
const syncRetryTimer = window.setInterval(() => {
  const sync = window.KhaqanSync;
  const cloud = window.KhaqanCloud;
  if (sync && cloud && cloud.enabled && cloud.session() && sync.pendingCount() > 0) {
    sync.flush().catch(() => {});
  }
}, 30000);
window.addEventListener('online', () => {
  const sync = window.KhaqanSync;
  if (sync && window.KhaqanCloud && window.KhaqanCloud.enabled) sync.flush().catch(() => {});
});
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState !== 'visible') return;
  const sync = window.KhaqanSync;
  if (sync && window.KhaqanCloud && window.KhaqanCloud.enabled && window.KhaqanCloud.session()) {
    sync.flush().catch(() => {});
  }
});

/* Drawer control lives in the Header 2.0 module below (`.is-open`). */

const revealItems = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window && revealItems.length) {
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        obs.unobserve(entry.target);
      }
    });
    /* Fire ~200px before a block enters instead of 13% into it: the fade has
       usually finished by the time the reader arrives, so the page reads as
       already-there rather than catching up with the scrollbar. */
  }, { threshold: 0.02, rootMargin: '0px 0px 200px 0px' });
  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add('visible'));
}

const contactForm = document.querySelector('#contact-form');
const formStatus = document.querySelector('.form-status');
if (contactForm && formStatus) {
  contactForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const payload = Object.fromEntries(new FormData(contactForm).entries());
    const lead = {
      ...payload,
      id: `lead-${Date.now()}`,
      status: 'New',
      createdAt: new Date().toISOString()
    };
    const leads = readJSON(LEADS_KEY, []);
    leads.unshift(lead);
    try { window.localStorage.setItem(LEADS_KEY, JSON.stringify(leads)); } catch (error) { /* no-op */ }
    if (window.KhaqanCloud?.enabled) {
      window.KhaqanCloud.createEnquiry(lead).catch(() => {
        // The local lead is retained if the cloud endpoint is not ready yet —
        // and it is queued so the CRM's sync retries it instead of losing it.
        if (window.KhaqanSync) {
          window.KhaqanSync.markLeadCreate(lead);
          window.KhaqanSync.flush().catch(() => {});
        }
      });
    }
    const name = payload.name?.trim() || 'there';
    formStatus.textContent = `Thank you, ${name}. Your enquiry is ready for the Khaqan team.`;
    contactForm.reset();
  });
}

document.querySelectorAll('[data-year]').forEach((node) => {
  node.textContent = new Date().getFullYear();
});

const tiltScenes = document.querySelectorAll('.interactive-tilt');
if (tiltScenes.length && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  tiltScenes.forEach((scene) => {
    scene.addEventListener('pointermove', (event) => {
      if (event.pointerType && event.pointerType !== 'mouse') return;
      const rect = scene.getBoundingClientRect();
      const x = (event.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
      const y = (event.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);
      scene.style.setProperty('--tilt-x', `${Math.max(-1, Math.min(1, x)) * 3.2}deg`);
      scene.style.setProperty('--tilt-y', `${Math.max(-1, Math.min(1, -y)) * 2.4}deg`);
    });
    scene.addEventListener('pointerleave', () => {
      scene.style.setProperty('--tilt-x', '0deg');
      scene.style.setProperty('--tilt-y', '0deg');
    });
  });
}

/* Premium 3D tilt: cards lean gently toward the pointer. */
const TILT_CARDS = '.path-card, .spec-card, .journey-card, .community-card, .qom-card, .media-tile, .media-card, .distribution-card, .transport-card';
const canTilt = !window.matchMedia('(prefers-reduced-motion: reduce)').matches
  && window.matchMedia('(pointer: fine)').matches;
if (canTilt) {
  document.querySelectorAll(TILT_CARDS).forEach((card) => {
    card.addEventListener('pointermove', (event) => {
      if (event.pointerType && event.pointerType !== 'mouse') return;
      const rect = card.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      card.style.setProperty('--tilt-x', `${(x * 4.6).toFixed(2)}deg`);
      card.style.setProperty('--tilt-y', `${(y * -4.6).toFixed(2)}deg`);
    });
    card.addEventListener('pointerleave', () => {
      card.style.setProperty('--tilt-x', '0deg');
      card.style.setProperty('--tilt-y', '0deg');
    });
  });
}

/* Number count-up — the big figures (turnover, quantity, clients, qom
   facts) count from zero as they scroll into view, and replay from zero
   whenever the reader clicks them. Handles comma-grouped numbers, currency
   prefixes, decimals and trailing units; skips year ranges and labels that
   only carry an ordinal like "01". */
const countEls = document.querySelectorAll('.qom-facts strong, .proof-strip strong');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function isOrdinalLabel(value) {
  // "01", "02", "03"… step counters are labels, not metrics to animate.
  return /^0\d$/.test(value);
}
function isYearRange(value) {
  return /[\u2013\u2014-]\s*\d/.test(value); // 2022–2026 style ranges stay still
}

function animateNumber(el) {
  // Cancel any run already in flight, then restart cleanly from the original.
  if (el._countRaf) cancelAnimationFrame(el._countRaf);
  el._countRaf = null;
  const original = el.dataset.countOriginal || el.textContent.trim();
  el.dataset.countOriginal = original;
  el.textContent = original;
  if (isOrdinalLabel(original) || isYearRange(original)) return;
  const match = original.match(/^([^0-9]*?)([\d][\d,]*(?:\.\d+)?)([\s\S]*)$/);
  if (!match) return;
  const [, prefix, numText, suffix] = match;
  const raw = numText.replace(/,/g, '');
  const target = parseFloat(raw);
  if (!Number.isFinite(target) || target === 0) return;
  const decimals = (raw.split('.')[1] || '').length;
  const grouped = numText.indexOf(',') > -1;
  const duration = 1900;
  const start = performance.now();
  const format = (value) => {
    let fixed = value.toFixed(decimals);
    if (grouped) {
      const [intPart, decPart] = fixed.split('.');
      fixed = Number(intPart).toLocaleString('en-US') + (decPart ? '.' + decPart : '');
    }
    return prefix + fixed + suffix;
  };
  const tick = (now) => {
    const p = Math.min(1, (now - start) / duration);
    const eased = 1 - Math.pow(1 - p, 3);
    el.textContent = format(target * eased);
    if (p < 1) {
      el._countRaf = requestAnimationFrame(tick);
    } else {
      el._countRaf = null;
      el.classList.remove('count-running');
    }
  };
  el.classList.add('count-running');
  el._countRaf = requestAnimationFrame(tick);
}

if ('IntersectionObserver' in window && countEls.length && !reducedMotion) {
  const countObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      obs.unobserve(entry.target);
      animateNumber(entry.target);
    });
  }, { threshold: 0.4 });
  countEls.forEach((el) => countObserver.observe(el));
}

// Clicking a key figure replays its moving-number animation on demand.
countEls.forEach((el) => {
  el.classList.add('count-replay');
  el.title = 'Click to replay the count';
  el.addEventListener('click', () => {
    if (reducedMotion) return;
    animateNumber(el);
  });
});

window.addEventListener('storage', (event) => {
  if (event.key === CMS_KEY) applyCmsData();
  if (event.key === THEME_KEY) {
    document.documentElement.dataset.theme = event.newValue === 'day' ? 'day' : 'night';
    updateThemeButtons();
    updateThemeColorMeta();
  }
  if (event.key === SKIN_KEY && SKINS.indexOf(event.newValue) > -1) {
    document.documentElement.dataset.skin = event.newValue;
    syncSkinStylesheet(event.newValue);
    updateSkinButtons();
    updateThemeColorMeta();
  }
});

/* Rotation timing — how long one frame stays on screen before the next fades
   in. The Control Room's "Rotation timing" card (reelIntervalSec /
   teamHeroIntervalSec) overrides each deck's data-*-interval attribute; values
   are clamped to 3–30 seconds so a bad entry can never freeze a deck, and an
   empty / out-of-range value falls back to the attribute, then the default. */
const ROTATION_MIN_MS = 2000;
const ROTATION_MAX_MS = 30000;
function rotationIntervalMs(cmsSeconds, attributeMs, fallbackMs) {
  const fromCms = Number(cmsSeconds);
  const fromAttr = Number(attributeMs);
  const ms = (Number.isFinite(fromCms) && fromCms > 0)
    ? fromCms * 1000
    : (Number.isFinite(fromAttr) && fromAttr > 0 ? fromAttr : fallbackMs);
  return Math.min(ROTATION_MAX_MS, Math.max(ROTATION_MIN_MS, Math.round(ms)));
}

// Home-page reel: cycle through compact mining clips without loading all videos at once.
document.querySelectorAll('[data-reel]').forEach((reel) => {
  const slides = Array.from(reel.querySelectorAll('.reel-slide'));
  const dotsWrap = reel.querySelector('[data-reel-dots]');
  const count = reel.querySelector('[data-reel-count]');
  const nextButton = reel.querySelector('[data-reel-skip]');
  const progress = reel.querySelector('.reel-progress');
  const band = reel.closest('section') || reel.parentElement;
  const chapterButtons = Array.from((band || document).querySelectorAll('[data-reel-jump]'));
  const tagOut = reel.querySelector('[data-reel-tag-out]');
  const DEFAULT_REEL_MS = 5000;
  const intervalFromSettings = () =>
    rotationIntervalMs(getCmsData().reelIntervalSec, reel.dataset.reelInterval, DEFAULT_REEL_MS);
  let interval = intervalFromSettings();
  let index = 0;
  let timer = null;
  let onScreen = true;
  let running = false;
  let busy = false;      // a cut is waiting on the next clip's first frame
  let primeTimer = null;

  if (!slides.length) return;

  function applyTiming() {
    interval = intervalFromSettings();
    reel.style.setProperty('--reel-duration', `${interval}ms`);
  }
  applyTiming();

  if (dotsWrap) {
    dotsWrap.innerHTML = slides.map((_, i) => `<button class="reel-dot${i === 0 ? ' active' : ''}" data-reel-dot="${i}" type="button" aria-label="Show mining reel item ${i + 1}"></button>`).join('');
    dotsWrap.addEventListener('click', (event) => {
      const dot = event.target.closest('[data-reel-dot]');
      if (!dot) return;
      goTo(Number(dot.dataset.reelDot));
    });
  }

  // Chapter rail: pre-authored buttons beside the stage jump the reel to a slide,
  // and behave as a real tablist (arrow keys move focus and advance the cut).
  chapterButtons.forEach((button, i) => {
    button.addEventListener('click', () => goTo(Number(button.dataset.reelJump)));
    button.addEventListener('keydown', (event) => {
      const step = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[event.key];
      if (step === undefined && event.key !== 'Home' && event.key !== 'End') return;
      event.preventDefault();
      const target = event.key === 'Home' ? 0 : event.key === 'End' ? chapterButtons.length - 1 : (i + step + chapterButtons.length) % chapterButtons.length;
      chapterButtons[target].focus();
      goTo(Number(chapterButtons[target].dataset.reelJump));
    });
  });

  function activate(nextIndex) {
    index = (nextIndex + slides.length) % slides.length;
    slides.forEach((slide, i) => {
      const active = i === index;
      slide.classList.toggle('active', active);
      slide.setAttribute('aria-hidden', String(!active));
      const video = slide.querySelector('video');
      if (video) {
        if (active && running) {
          try { video.currentTime = 0; } catch (error) { /* not seekable yet — it replays from the top */ }
          delete video.dataset.reelResume;
          video.play().catch(() => {});
        } else {
          video.pause();
          if (active) video.dataset.reelResume = '1';
        }
      }
    });
    if (count) count.textContent = `${String(index + 1).padStart(2, '0')} / ${String(slides.length).padStart(2, '0')}`;
    if (tagOut) tagOut.textContent = slides[index].dataset.reelTag || '';
    dotsWrap?.querySelectorAll('.reel-dot').forEach((dot, i) => dot.classList.toggle('active', i === index));
    chapterButtons.forEach((button, i) => {
      const on = i === index;
      button.classList.toggle('active', on);
      button.setAttribute('aria-selected', String(on));
    });
    if (progress) {
      progress.classList.remove('run');
      void progress.offsetWidth; /* restart the timeline */
      progress.classList.add('run');
    }
  }

  const activeVideo = () => (slides[index] ? slides[index].querySelector('video') : null);

  /* Cut guard: a clip whose first frame has not decoded yet would fade in as
     a frozen poster — that is what made the reel look stuck. Before cutting to
     such a slide we nudge the video into loading and hold the current frame
     until the first real frame is ready (or ~1s passes; the crossfade then
     hides the cut). Ready clips switch over immediately. */
  function goTo(nextIndex, { auto = false } = {}) {
    const target = ((nextIndex % slides.length) + slides.length) % slides.length;
    if (busy) return;
    const video = slides[target].querySelector('video');
    if (target !== index && video && video.readyState < 2 && onScreen) {
      busy = true;
      let settled = false;
      const finish = () => {
        if (settled) return;
        settled = true;
        if (primeTimer) { window.clearTimeout(primeTimer); primeTimer = null; }
        video.removeEventListener('canplay', onReady);
        video.removeEventListener('error', onFail);
        busy = false;
        if (!onScreen) return;
        activate(target);
        /* Auto cuts only keep the clock ticking while the deck is unpaused;
           a deliberate jump (dot / chapter click) always restarts it. */
        if (running || !auto) restart();
      };
      const onReady = () => { if (video.readyState >= 2) finish(); };
      const onFail = () => finish();
      video.addEventListener('canplay', onReady);
      video.addEventListener('error', onFail);
      primeTimer = window.setTimeout(finish, 1000);
      video.play().catch(() => {});
      return;
    }
    activate(target);
    if (running || !auto) restart();
  }

  function stop() {
    if (timer) window.clearInterval(timer);
    timer = null;
    running = false;
    if (progress) progress.classList.add('paused');
    const video = activeVideo();
    if (video && !video.paused) { video.pause(); video.dataset.reelResume = '1'; }
  }
  function restart() {
    if (!onScreen) return;
    stop();
    running = true;
    if (progress) progress.classList.remove('paused');
    timer = window.setInterval(() => goTo(index + 1, { auto: true }), interval);
    const video = activeVideo();
    if (video && video.dataset.reelResume === '1') {
      delete video.dataset.reelResume;
      video.play().catch(() => {});
    }
  }

  nextButton?.addEventListener('click', () => goTo(index + 1));
  // Pause on pointer movement only inside the visible picture area. Listening
  // on the stage/deck made their larger layout boxes count as part of the
  // screen in some responsive layouts, so merely moving across the page could
  // freeze the reel. Keyboard focus still pauses the deck for accessibility.
  const deck = reel.closest('.reel-deck') || band || reel;
  const reelScreen = reel.querySelector('.reel-slides') || reel;
  reelScreen.addEventListener('pointerenter', stop);
  reelScreen.addEventListener('pointerleave', restart);
  deck.addEventListener('focusin', stop);
  deck.addEventListener('focusout', (event) => { if (!deck.contains(event.relatedTarget)) restart(); });
  document.addEventListener('visibilitychange', () => { if (document.hidden) stop(); else restart(); });

  /* Decode budget: a 30fps clip should not keep decoding while the reader is
     three sections away, or while the tab is in the background. */
  if ('IntersectionObserver' in window) {
    new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        onScreen = entry.isIntersecting;
        if (onScreen) restart(); else stop();
      });
    }, { rootMargin: '160px 0px' }).observe(reel);
  }

  /* The Control Room can change the pace while the page is open: a save in
     another tab arrives as a `storage` event, and cloud hydration or a
     same-tab save arrives as `khaqan:cms-change`. */
  const refreshTiming = () => {
    const next = intervalFromSettings();
    if (next === interval) return;
    applyTiming();
    if (running) restart();
  };
  window.addEventListener('khaqan:cms-change', refreshTiming);
  window.addEventListener('storage', (event) => { if (event.key === CMS_KEY) refreshTiming(); });

  activate(0);
  restart();
});

/* =====================================================================
   Cinematic 3D backdrop — every page carries a fixed, live layer of
   high-quality coal renders that slowly crossfade with a camera drift
   (a "video" that needs no video download).
   ===================================================================== */
(function () {
  const host = document.querySelector('.coal-page-bg');
  if (!host) return;
  const canvas = host.querySelector('canvas.cine-canvas');
  const imgs = Array.from(host.querySelectorAll('img.cine-src'));
  if (!canvas || !imgs.length) return;
  const ctx = canvas.getContext('2d');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;


  const SEG = 8200;    // ms a frame stays in view
  const FADE = 2800;   // crossfade window inside the segment
  // per-frame camera drift: [scaleFrom, scaleTo, xFrom, xTo, yFrom, yTo]
  const drift = [
    [1.04, 1.13, -0.012, 0.016, 0.000, -0.006],
    [1.13, 1.04, 0.016, -0.010, -0.004, 0.002],
    [1.05, 1.15, -0.020, 0.006, 0.004, -0.006],
    [1.15, 1.05, 0.008, -0.018, -0.004, 0.003],
    [1.05, 1.12, 0.000, 0.014, 0.003, 0.006]
  ];

  let W = 0, H = 0, dpr = 1, raf = 0, segStart = 0, idx = 0, live = 0, started = false, lastPaint = 0, paused = 0;

  /* The markup keeps the frames as hidden <img> tags so the HTML stays
     declarative — but a `display:none` lazy image is never fetched, so
     the engine loads its own copies and starts the moment frame 0 is
     painted (later frames join as they arrive). */
  /* A rotating sequence is a luxury, not the point of the layer. Under
     `prefers-reduced-motion: reduce` we paint exactly one still frame, and on a
     saveData / 2g connection we do the same - so in both cases only the first
     frame is ever fetched. On the home page that is ~1.4MB of decorative imagery
     that would otherwise download at idle and never be seen. */
  const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  const lean = reduced || !!(conn && (conn.saveData || /(^|\b)2g$/.test(conn.effectiveType || '')));
  const frames = framesFrom(lean ? imgs.slice(0, 1) : imgs);

  function framesFrom(nodes) {
    const sources = nodes
      .map((node) => node.getAttribute('src'))
      .filter(Boolean);
    const images = sources.map((src, i) => {
      const image = new Image();
      image.decoding = 'async';
      image.dataset.cineIndex = String(i);
      /* Only the opening frame is urgent — the rest of the sequence is
         fetched once the page itself has settled, so the reel, the hero
         and the copy all win the first race. */
      if (i < 2) { image.fetchPriority = 'high'; image.src = src; }
      return image;
    });
    const rest = images.filter((image) => !image.getAttribute('src'));
    const queue = () => rest.forEach((image, i) => {
      const go = () => { image.src = sources[Number(image.dataset.cineIndex)]; };
      if (window.requestIdleCallback) window.requestIdleCallback(go, { timeout: 2600 });
      else window.setTimeout(go, 700 + i * 320);
    });
    if (document.readyState === 'complete') queue();
    else window.addEventListener('load', queue, { once: true });
    return images;
  }

  function size() {
    dpr = Math.min(window.devicePixelRatio || 1, 1.25);
    W = host.clientWidth; H = host.clientHeight;
    canvas.width = Math.max(1, Math.round(W * dpr));
    canvas.height = Math.max(1, Math.round(H * dpr));
  }

  function draw(img, d, p) {
    if (!img || !img.naturalWidth) return false;
    const s = d[0] + (d[1] - d[0]) * p;
    const x = d[2] + (d[3] - d[2]) * p;
    const y = d[4] + (d[5] - d[4]) * p;
    const iw = img.naturalWidth, ih = img.naturalHeight;
    const scale = Math.max(W / iw, H / ih) * s;
    const dw = iw * scale, dh = ih * scale;
    const dx = (W - dw) / 2 + x * W;
    const dy = (H - dh) / 2 + y * H;
    ctx.drawImage(img, dx * dpr, dy * dpr, dw * dpr, dh * dpr);
    return true;
  }

  function paint(driftP, fadeP) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const d = drift[idx % drift.length];
    if (!draw(frames[idx], d, driftP)) {
      for (let i = 0; i < frames.length; i++) if (draw(frames[i], drift[i % drift.length], .5)) break;
    }
    if (fadeP > 0) {
      const nextIdx = (idx + 1) % frames.length;
      ctx.globalAlpha = Math.min(1, fadeP);
      draw(frames[nextIdx], drift[nextIdx % drift.length], 0);
      ctx.globalAlpha = 1;
    }
  }

  function repaint() {
    const el = window.performance.now() - segStart;
    paint(Math.min(1, el / SEG), fadeOf(el));
  }

  function fadeOf(el) {
    return Math.max(0, Math.min(1, (el - (SEG - FADE)) / FADE));
  }

  function frame(now) {
    /* The backdrop is fixed, so scrolling never changes what it shows:
       stop requesting frames entirely while the reader moves and pick the
       sequence back up when they stop. While idle, ~32fps is plenty for a
       slow crossfade and halves the paint cost. */
    if (khaqanScroll.moving) {
      paused = now - segStart;   /* freeze the sequence, don't skip ahead */
      raf = 0;
      return;
    }
    if (now - lastPaint < 31) { raf = window.requestAnimationFrame(frame); return; }
    lastPaint = now;
    const el = now - segStart;
    paint(Math.min(1, el / SEG), fadeOf(el));
    if (el >= SEG) { idx = (idx + 1) % frames.length; segStart = now; }
    raf = window.requestAnimationFrame(frame);
  }

  function resume() {
    if (!started || reduced || raf || document.hidden) return;
    segStart = window.performance.now() - paused;
    raf = window.requestAnimationFrame(frame);
  }
  document.addEventListener('khaqan:scroll-end', resume);

  function start() {
    if (started || !live) return;
    started = true;
    size();
    if (reduced || frames.length < 2) { segStart = window.performance.now(); paint(.5, 0); return; }
    segStart = window.performance.now();
    window.cancelAnimationFrame(raf);
    raf = window.requestAnimationFrame(frame);
  }

  frames.forEach((image) => {
    const done = () => { live++; start(); };
    if (image.complete && image.naturalWidth) done();
    else { image.addEventListener('load', done, { once: true }); image.addEventListener('error', done, { once: true }); }
  });

  let rt = 0;
  window.addEventListener('resize', () => {
    window.clearTimeout(rt);
    rt = window.setTimeout(() => {
      size();
      if (started) repaint();
    }, 160);
  }, { passive: true });

  document.addEventListener('visibilitychange', () => {
    if (reduced || !started) return;
    if (document.hidden) window.cancelAnimationFrame(raf);
    else { segStart = window.performance.now(); window.cancelAnimationFrame(raf); raf = window.requestAnimationFrame(frame); }
  });
})();

/* =====================================================================
   Scroll signal — one passive listener publishes "the reader is moving".
   Decorative loops (the backdrop canvas, the ambient animations) pause on
   it, so scroll budget goes to scroll.
   ===================================================================== */
const khaqanScroll = (function () {
  const root = document.documentElement;
  let timer = 0;
  let moving = false;
  function stop() {
    if (!moving) return;
    moving = false;
    root.classList.remove('is-scrolling');
    document.dispatchEvent(new CustomEvent('khaqan:scroll-end'));
  }
  window.addEventListener('scroll', () => {
    if (!moving) {
      moving = true;
      root.classList.add('is-scrolling');
      document.dispatchEvent(new CustomEvent('khaqan:scroll-start'));
    }
    window.clearTimeout(timer);
    timer = window.setTimeout(stop, 180);
  }, { passive: true });
  window.addEventListener('wheel', stop, { passive: true });
  return { get moving() { return moving; } };
})();

/* =====================================================================
   Header 2.0 — one rAF-batched listener drives the condensing bar, the
   hide-on-scroll-down reveal, the scroll-progress hairline, the gliding
   nav pill and the mobile drawer. Nothing here reads layout during
   scroll: geometry is measured once per resize/fonts-load and cached.
   ===================================================================== */
(function () {
  const bar = document.querySelector('.site-header');
  if (!bar) return;

  const nav = bar.querySelector('.main-nav');
  const links = nav ? Array.from(nav.querySelectorAll('a[data-nav]')) : [];
  const glide = nav ? nav.querySelector('.nav-glide') : null;
  const burger = bar.querySelector('.menu-toggle');
  const scrim = document.querySelector('.nav-scrim');
  const progress = bar.querySelector('.nav-progress span');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const drawerMode = window.matchMedia('(max-width: 1023px)');

  let navMetrics = [];
  let open = false;
  let lastY = Math.max(0, window.scrollY);
  let ticking = false;
  let docHeight = 1;

  /* ---------- geometry (measured, never during scroll) ---------- */
  function measure() {
    docHeight = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    if (!glide || !nav || drawerMode.matches) { navMetrics = []; return; }
    const base = nav.getBoundingClientRect();
    const ox = nav.clientLeft || 0;
    navMetrics = links.map((link) => {
      const r = link.getBoundingClientRect();
      return { x: Math.max(0, Math.round(r.left - base.left - ox)), w: Math.round(r.width) };
    });
    const active = links.findIndex((l) => l.classList.contains('active'));
    moveGlide(active >= 0 ? active : -1);
  }

  function moveGlide(i) {
    if (!glide) return;
    if (i < 0 || !navMetrics[i]) { nav.classList.remove('has-glide'); return; }
    const m = navMetrics[i];
    glide.style.transform = `translate3d(${m.x}px, 0, 0)`;
    glide.style.width = `${m.w}px`;
    nav.classList.add('has-glide');
  }

  const activeIndex = () => links.findIndex((l) => l.classList.contains('active'));
  links.forEach((link, i) => {
    link.addEventListener('mouseenter', () => { if (!drawerMode.matches) moveGlide(i); });
    link.addEventListener('focus', () => { if (!drawerMode.matches) moveGlide(i); });
    link.addEventListener('mouseleave', () => { if (!drawerMode.matches) moveGlide(activeIndex()); });
    link.addEventListener('blur', () => { if (!drawerMode.matches) moveGlide(activeIndex()); });
  });
  if (nav) {
    nav.addEventListener('mouseleave', () => moveGlide(activeIndex()));
  }

  let resizeTimer = 0;
  const remeasure = () => { window.clearTimeout(resizeTimer); resizeTimer = window.setTimeout(measure, 140); };
  window.addEventListener('resize', remeasure, { passive: true });
  window.addEventListener('orientationchange', remeasure);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(measure).catch(() => {});

  /* ---------- the single scroll pass ---------- */
  function apply() {
    ticking = false;
    const y = Math.max(0, window.scrollY);
    const goingDown = y > lastY + 4;
    const goingUp = y < lastY - 4;

    bar.classList.toggle('is-scrolled', y > 18);
    /* Tuck the bar away on the way down, bring it back the moment the
       reader looks up — but never while the drawer or a menu is open. */
    const menuOpen = open || bar.querySelector('.skin-menu:not([hidden])');
    const tuck = !menuOpen && !reduceMotion.matches && goingDown && y > 460 && !drawerMode.matches;
    bar.classList.toggle('is-hidden', tuck);
    if (goingUp || y < 240) bar.classList.remove('is-hidden');
    lastY = y;

    if (progress) progress.style.setProperty('--progress', Math.min(1, y / docHeight).toFixed(4));
  }
  function onScroll() {
    if (!ticking) { ticking = true; window.requestAnimationFrame(apply); }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  /* A tucked bar must never hide the thing the keyboard is on. */
  bar.addEventListener('focusin', () => bar.classList.remove('is-hidden'));

  /* ---------- drawer ---------- */
  const supportsInert = 'inert' in HTMLElement.prototype;
  const background = () => [document.getElementById('main'), document.querySelector('.footer')].filter(Boolean);

  function focusables() {
    return Array.from(bar.querySelectorAll('a[href], button')).filter((el) => el.offsetParent !== null);
  }
  function trapTab(event) {
    if (event.key !== 'Tab' || !open) return;
    const items = focusables();
    if (!items.length) return;
    const first = items[0];
    const last = items[items.length - 1];
    const active = document.activeElement;
    if (event.shiftKey && (active === first || !bar.contains(active))) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && (active === last || !bar.contains(active))) { event.preventDefault(); first.focus(); }
    else if (!bar.contains(active)) { event.preventDefault(); first.focus(); }
  }
  /* While the drawer is up, the page behind it is not interactive: `inert`
     keeps Tab out of it for free, and engines without `inert` get a trap. */
  function setModal(next) {
    if (supportsInert) background().forEach((el) => { if (next) el.setAttribute('inert', ''); else el.removeAttribute('inert'); });
    // The Tab ring is owned by the bar in every engine: `inert` covers the page
    // body but not the skip link above the header, which is still a tab stop.
    if (next) document.addEventListener('keydown', trapTab, true);
    else document.removeEventListener('keydown', trapTab, true);
  }

  function setOpen(next) {
    open = next;
    setModal(next);
    if (nav) nav.classList.toggle('is-open', open);
    if (scrim) scrim.classList.toggle('is-open', open);
    if (burger) {
      burger.setAttribute('aria-expanded', String(open));
      burger.setAttribute('aria-label', open ? 'Close navigation menu' : 'Open navigation menu');
    }
    document.body.classList.toggle('nav-locked', open);
    if (open) {
      const first = nav && nav.querySelector('a');
      if (first) window.setTimeout(() => first.focus({ preventScroll: true }), 260);
    } else if (burger) {
      burger.focus({ preventScroll: true });
    }
  }
  if (burger && nav) {
    burger.addEventListener('click', () => setOpen(!open));
    if (scrim) scrim.addEventListener('click', () => setOpen(false));
    nav.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => { if (open) setOpen(false); }));
    /* The skip link lives outside the bar, so it never gets that close-on-click - and
       while the drawer is open #main is inert, so the focus it tries to move there
       lands nowhere. Closing first makes the link behave the same in every state. */
    /* A skip-link click while the drawer is open has to close it first: #main is inert
       then, so focus would land nowhere. The scroll itself is handled by its own block. */
    const skipLink = document.querySelector('.skip-link');
    if (skipLink) skipLink.addEventListener('click', () => { if (open) setOpen(false); });
        document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && open) { event.preventDefault(); setOpen(false); }
    });
    drawerMode.addEventListener('change', (event) => { if (!event.matches) { if (open) setOpen(false); else setModal(false); } measure(); });
  }

  measure();
  apply();
  if (reduceMotion.matches) bar.classList.remove('is-hidden');
})();

/* --------------------------------------------------------------------------
   Cache layer — one service worker for the whole origin.

   * Registered on idle so it never competes with the first paint.
   * `saveData` (or 2g) opts the tab out of speculative work entirely: the
     prerender rules are removed and the hover prefetch stays switched off.
   * `KhaqanCache.clear()` is the escape hatch — it drops every entry the
     worker owns and reloads, which is what you want after a bad deploy.
   -------------------------------------------------------------------------- */
(function () {
  var nav = navigator;
  var conn = nav.connection || nav.mozConnection || nav.webkitConnection;
  var lean = !!(conn && (conn.saveData || /(^|\b)2g$/.test(conn.effectiveType || '')));

  if (lean) {
    document.querySelectorAll('script[type="speculationrules"]').forEach(function (s) { s.remove(); });
  }

  /* Firefox and older Safari have no speculation rules yet, so those engines
     get a plain <link rel=prefetch> the moment a pointer settles on a nav
     link. Browsers that parse the rules are left alone — they already
     prerender the whole document, subresources included. */
  var specRules = !!(window.HTMLScriptElement && HTMLScriptElement.supports
    && HTMLScriptElement.supports('speculationrules'));
  if (!specRules && !lean) {
    var warmed = new Set();
    var warm = function (link) {
      var href = link && link.getAttribute('href');
      if (!href || !/^[^:]*\.html$/i.test(href) || warmed.has(href)) return;
      if (href === location.pathname.replace(/^\//, '')) return;
      warmed.add(href);
      var l = document.createElement('link');
      l.rel = 'prefetch';
      l.href = href;
      document.head.appendChild(l);
    };
    var bind = function (e) {
      var link = e.target.closest && e.target.closest('a[data-nav]');
      if (link) warm(link);
    };
    document.addEventListener('pointerenter', bind, true);
    document.addEventListener('focusin', bind, true);
  }

  if (!('serviceWorker' in nav) || (!location.protocol.startsWith('http') && location.hostname !== 'localhost')) return;
  window.addEventListener('load', function () {
    var go = function () {
      nav.serviceWorker.register('sw.js', { scope: './' }).then(function (reg) {
        window.KhaqanCache = {
          offline: function () { return !!reg.sync; },
          clear: function () {
            if (reg.active) reg.active.postMessage({ type: 'khaqan-cache-clear' });
            return caches.keys().then(function (keys) {
              return Promise.all(keys.map(function (k) { return caches.delete(k); })).then(function () { location.reload(); });
            });
          }
        };
        nav.serviceWorker.addEventListener('message', function (e) {
          if (e.data && e.data.type === 'khaqan-cache-cleared' && e.source) e.source.postMessage({ type: 'khaqan-cache-reload' });
        });
      }).catch(function () { /* caching is an upgrade, never a dependency */ });
    };
    if ('requestIdleCallback' in window) requestIdleCallback(go, { timeout: 3000 });
    else setTimeout(go, 1200);
  }, { once: true });
})();

/* Skip link: focus AND viewport. #main runs the length of the document, so the browser
   decides the fragment target is already on screen and jumps nowhere - the caret moves,
   the page does not. Scroll it ourselves, clearing the bar only when the bar is fixed
   (the CRM's header scrolls with the page, so padding there would just open a gap).
   Deliberately separate from the header block: it must also work on pages with no
   .site-header at all. */
(function () {
  const link = document.querySelector('.skip-link');
  const main = document.getElementById('main');
  if (!link || !main) return;
  link.addEventListener('click', () => {
    const bar = document.querySelector('.site-header');
    const fixed = !!bar && getComputedStyle(bar).position === 'fixed';
    const pad = fixed ? parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0 : 0;
    const top = Math.max(0, Math.round(main.getBoundingClientRect().top + window.scrollY - pad));
    main.focus({ preventScroll: true });
    if (Math.abs(window.scrollY - top) > 2) window.scrollTo(0, top);
  });
})();

/* =====================================================================
   Rotating team hero — cycles the key company members with individual
   accents, transitions and animations; pauses on hover/focus.
   ===================================================================== */
document.querySelectorAll('[data-team-hero]').forEach((hero) => {
  const slides = Array.from(hero.querySelectorAll('.team-slide'));
  const dotsWrap = hero.querySelector('[data-team-dots]');
  const countEl = hero.querySelector('[data-team-count]');
  const progress = hero.querySelector('.team-hero-progress');
  const DEFAULT_TEAM_MS = 5000;
  const intervalFromSettings = () =>
    rotationIntervalMs(getCmsData().teamHeroIntervalSec, hero.dataset.teamInterval, DEFAULT_TEAM_MS);
  let interval = intervalFromSettings();
  let index = 0;
  let timer = null;
  if (!slides.length) return;

  function applyTiming() {
    interval = intervalFromSettings();
    hero.style.setProperty('--team-duration', `${interval}ms`);
  }
  applyTiming();

  if (dotsWrap) {
    dotsWrap.innerHTML = slides.map((_, i) => `<button class="team-dot${i === 0 ? ' active' : ''}" type="button" data-team-dot="${i}" aria-label="Show team member ${i + 1}"></button>`).join('');
    dotsWrap.addEventListener('click', (event) => {
      const dot = event.target.closest('[data-team-dot]');
      if (!dot) return;
      activate(Number(dot.dataset.teamDot));
      restart();
    });
  }

  function activate(nextIndex) {
    index = (nextIndex + slides.length) % slides.length;
    slides.forEach((slide, i) => {
      const on = i === index;
      slide.classList.toggle('active', on);
      slide.setAttribute('aria-hidden', String(!on));
      // The description paragraph "writes itself" word by word when its
      // slide appears; hidden slides pause mid-write.
      const para = slide.querySelector('.team-copy p');
      if (para) {
        if (on) revealTeamCopy(para, { delay: 340 });
        else stopTeamCopy(para);
      }
    });
    if (countEl) countEl.textContent = `${String(index + 1).padStart(2, '0')} / ${String(slides.length).padStart(2, '0')}`;
    dotsWrap?.querySelectorAll('.team-dot').forEach((dot, i) => dot.classList.toggle('active', i === index));
    if (progress) { progress.classList.remove('run'); void progress.offsetWidth; progress.classList.add('run'); }
  }

  function stop() {
    if (timer) { window.clearInterval(timer); timer = null; }
    if (progress) progress.classList.add('paused');
  }
  function restart() {
    stop();
    if (progress) progress.classList.remove('paused');
    timer = window.setInterval(() => activate(index + 1), interval);
  }

  hero.addEventListener('mouseenter', stop);
  hero.addEventListener('mouseleave', restart);
  hero.addEventListener('focusin', stop);
  hero.addEventListener('focusout', (event) => { if (!hero.contains(event.relatedTarget)) restart(); });
  document.addEventListener('visibilitychange', () => { if (document.hidden) stop(); else restart(); });

  /* Control Room "Rotation timing" — same live refresh wiring as the reel. */
  const refreshTiming = () => {
    const next = intervalFromSettings();
    if (next === interval) return;
    applyTiming();
    if (timer) restart();
  };
  window.addEventListener('khaqan:cms-change', refreshTiming);
  window.addEventListener('storage', (event) => { if (event.key === CMS_KEY) refreshTiming(); });

  activate(0);
  restart();
});

/* =====================================================================
   "Writing" description animation — the leadership paragraphs reveal
   word by word (with a blinking caret) as if being written, whenever a
   slide becomes active or a card scrolls into view. Clicking any
   animated paragraph rewinds and replays the writing from the start.
   ===================================================================== */

// Split a paragraph into word tokens while remembering which words sit
// inside <strong> so the bold lead-in survives the rebuild.
function buildTeamCopyTokens(p) {
  if (!p.dataset.typeOriginal) p.dataset.typeOriginal = p.innerHTML;
  const holder = document.createElement('div');
  holder.innerHTML = p.dataset.typeOriginal;
  const tokens = [];
  const collect = (node, strong) => {
    node.childNodes.forEach((child) => {
      if (child.nodeType === Node.TEXT_NODE) {
        child.textContent.split(/(\s+)/).forEach((word) => {
          if (word) tokens.push({ text: word, strong });
        });
      } else if (child.nodeType === Node.ELEMENT_NODE) {
        const keepStrong = strong || child.tagName === 'STRONG' || child.tagName === 'B';
        collect(child, keepStrong);
      }
    });
  };
  collect(holder, false);
  return tokens;
}

function revealTeamCopy(p, { delay = 0, onDone } = {}) {
  if (reducedMotion) return; // keep the static, fully-readable text
  if (p._revealTimer) { window.clearInterval(p._revealTimer); p._revealTimer = null; }
  if (p._revealDelay) { window.clearTimeout(p._revealDelay); p._revealDelay = null; }
  const tokens = p._revealTokens || (p._revealTokens = buildTeamCopyTokens(p));
  if (!tokens.length) return;
  const frag = document.createDocumentFragment();
  const wordEls = [];
  let strongEl = null;
  tokens.forEach((token) => {
    if (token.strong && !strongEl) { strongEl = document.createElement('strong'); frag.appendChild(strongEl); }
    if (!token.strong) strongEl = null;
    const span = document.createElement('span');
    span.className = 'team-type-word';
    span.textContent = token.text;
    (strongEl || frag).appendChild(span);
    // Whitespace spans stay in the DOM for correct spacing but don't animate.
    if (/\S/.test(token.text)) wordEls.push(span);
  });
  const caret = document.createElement('span');
  caret.className = 'team-type-caret';
  caret.setAttribute('aria-hidden', 'true');
  frag.appendChild(caret);
  p.innerHTML = '';
  p.appendChild(frag);
  p.classList.add('team-typing');
  let i = 0;
  const start = () => {
    p._revealTimer = window.setInterval(() => {
      if (i >= wordEls.length) {
        window.clearInterval(p._revealTimer);
        p._revealTimer = null;
        caret.classList.add('done');
        if (onDone) onDone();
        return;
      }
      wordEls[i].classList.add('in');
      i += 1;
    }, 42);
  };
  if (delay > 0) p._revealDelay = window.setTimeout(start, delay);
  else start();
}

function stopTeamCopy(p) {
  if (p._revealTimer) { window.clearInterval(p._revealTimer); p._revealTimer = null; }
  if (p._revealDelay) { window.clearTimeout(p._revealDelay); p._revealDelay = null; }
  const caret = p.querySelector('.team-type-caret');
  if (caret) caret.classList.add('done');
}

// Drop all typing state for a paragraph (used when CMS text is refreshed).
function resetTeamCopyState(p) {
  if (p._revealTimer) { window.clearInterval(p._revealTimer); p._revealTimer = null; }
  if (p._revealDelay) { window.clearTimeout(p._revealDelay); p._revealDelay = null; }
  delete p.dataset.typeOriginal;
  delete p._revealTokens;
  p.classList.remove('team-typing');
}

// Called after the Control Room updates a leadership description: the new
// text is written out again for the visible hero slide / team card.
function refreshTeamCopyFromCms(p) {
  const hadReveal = !!(p._revealTimer || p._revealDelay || p._revealTokens || p.dataset.typeOriginal !== undefined);
  resetTeamCopyState(p);
  if (!hadReveal) return;
  if (p.closest('.team-slide')) {
    if (p.closest('.team-slide').classList.contains('active')) revealTeamCopy(p, { delay: 240 });
  } else if (p.closest('.team-card')) {
    revealTeamCopy(p);
  }
}

// Rotating hero: clicking the paragraph replays its writing animation.
document.querySelectorAll('[data-team-hero] .team-copy p').forEach((para) => {
  para.classList.add('team-type-target');
  para.title = 'Click to replay the description';
  para.addEventListener('click', () => revealTeamCopy(para));
});

// About page team cards: the description writes itself when the card
// scrolls into view, then the next paragraph follows — and either
// paragraph can be clicked to replay.
document.querySelectorAll('.team-card').forEach((card) => {
  const paras = Array.from(card.querySelectorAll('p'));
  if (!paras.length) return;
  paras.forEach((para) => {
    para.classList.add('team-type-target');
    para.title = 'Click to replay the description';
    para.addEventListener('click', () => revealTeamCopy(para));
  });
  if (reducedMotion) return;
  const revealCard = () => {
    let pi = 0;
    const step = () => {
      if (pi >= paras.length) return;
      const para = paras[pi];
      pi += 1;
      revealTeamCopy(para, { onDone: step });
    };
    step();
  };
  if ('IntersectionObserver' in window) {
    const cardObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        obs.unobserve(entry.target);
        revealCard();
      });
    }, { threshold: 0.25 });
    cardObserver.observe(card);
  } else {
    revealCard();
  }
});

/* =====================================================================
   Managed media + team photos — render Control Room media on the public
   pages and drop uploaded member portraits into the leadership sections.
   ===================================================================== */
(function () {
  const escapeMediaHtml = (value = '') => String(value).replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));

  /* Playback ceiling floor — matches the Control Room minimum (2s). A stored
     value below it (legacy data, a direct write) is raised so a clip can never
     be cut off in under 2 seconds. */
  const PLAYBACK_MIN_SECONDS = 2;

  /* If an admin set a playback ceiling on an uploaded video (hero / leadership
     portrait frames), stop the clip after that many seconds. Leaving it empty
     keeps the video looping as it always has. The clip is reset to the top on
     stop so a replay starts cleanly. */
  function applyAutoplayCeiling(video, seconds) {
    if (!video || typeof seconds !== 'number' || !(seconds > 0)) return;
    const ceiling = Math.max(PLAYBACK_MIN_SECONDS, Math.round(seconds));
    let timer = null;
    const clear = () => { if (timer) { window.clearTimeout(timer); timer = null; } };
    const onPlay = () => {
      clear();
      timer = window.setTimeout(() => {
        timer = null;
        try { video.pause(); video.currentTime = 0; } catch (error) { try { video.pause(); } catch (ignored) { /* already stopped */ } }
      }, ceiling * 1000);
    };
    video.addEventListener('play', onPlay);
    video.addEventListener('pause', clear);
    video.addEventListener('ended', clear);
  }

  function videoMarkup(m) {
    // Uploads may be .webm/.mov/.mp4 — let the browser pick; also pass the
    // data-URL directly to <video src> as a fallback for data URLs with
    // mime types a <source type="video/mp4"> would otherwise reject.
    const source = /^data:video\//.test(m.url)
      ? `<source src="${escapeMediaHtml(m.url)}">`
      : `<source src="${escapeMediaHtml(m.url)}" type="video/mp4"><source src="${escapeMediaHtml(m.url)}" type="video/webm">`;
    /* The playback ceiling (set in the Control Room on any video tile) is
       carried on the element and wired after render — gallery clips stop
       after that many seconds just like hero and portrait videos. */
    const playback = Math.max(0, Number(m.duration) || 0);
    return `<video controls muted loop playsinline preload="metadata" data-media-playback="${playback}">${source}</video>`;
  }

  function isGalleryPlacement(item) {
    const place = window.KHAQAN_MEDIA_PLACEMENT;
    if (place) return place.isGallery(item);
    return item && !/^team-/.test(item.section || '') && (!item.area || item.area === 'gallery' || item.area === 'library');
  }

  function renderManagedMedia() {
    const media = window.KhaqanMedia ? window.KhaqanMedia.get() : [];
    document.querySelectorAll('[data-managed-media]').forEach((wrap) => {
      const section = wrap.dataset.managedMedia;
      // Team portraits and page-area slot replacements are never part of the
      // "Fresh from the field" gallery — they live in their named slots.
      const items = media.filter((m) => m.section === section && isGalleryPlacement(m));
      const existing = wrap.querySelector('.managed-media-grid');
      const empty = wrap.querySelector('.managed-media-empty');
      if (!items.length) {
        if (existing) existing.remove();
        if (empty) empty.hidden = false;
        return;
      }
      if (empty) empty.hidden = true;
      let grid = existing;
      if (!grid) {
        grid = document.createElement('div');
        grid.className = 'managed-media-grid';
        wrap.appendChild(grid);
      }
      // Rebuild every time so edits (retitle / re-tag / replace file) and
      // removals never leave a stale or duplicated tile.
      grid.innerHTML = items.slice(0, 12).map((m) => {
        const mediaEl = m.type === 'video'
          ? videoMarkup(m)
          : `<img src="${escapeMediaHtml(m.url)}" alt="${escapeMediaHtml(m.title)}" loading="lazy" decoding="async">`;
        return `<figure class="managed-item">${mediaEl}<figcaption><span>${escapeMediaHtml(m.title)}</span><b>${escapeMediaHtml((window.KHAQAN_MEDIA_SECTION_LABEL ? window.KHAQAN_MEDIA_SECTION_LABEL(m.section) : m.section))}</b></figcaption></figure>`;
      }).join('');
      // Playback ceiling: stop each gallery clip after its Control Room time.
      grid.querySelectorAll('video[data-media-playback]').forEach((video) => {
        applyAutoplayCeiling(video, Number(video.dataset.mediaPlayback) || 0);
      });
    });
  }

  function teamMediaNode(item) {
    // Videos fill the portrait frame too — muted, looping and inline so they
    // play smoothly in place; images lazy-load with async decoding.
    if (item.type === 'video') {
      const video = document.createElement('video');
      video.muted = true;
      video.loop = true;
      video.playsInline = true;
      video.autoplay = true;
      video.setAttribute('preload', 'metadata');
      video.setAttribute('controls', '');
      video.src = item.url;
      applyAutoplayCeiling(video, item.duration);
      return video;
    }
    const img = document.createElement('img');
    img.loading = 'lazy';
    img.decoding = 'async';
    img.src = item.url;
    return img;
  }

  function applyTeamPhotos() {
    const media = window.KhaqanMedia ? window.KhaqanMedia.get() : [];
    document.querySelectorAll('[data-member]').forEach((el) => {
      const member = el.dataset.member;
      // The most recently added portrait for a member wins, so re-uploading a
      // portrait from the Control Room swaps it everywhere automatically.
      // Photos and short videos are both accepted.
      const item = media.find((m) => m.section === `team-${member}` && (m.type === 'image' || m.type === 'video'));
      ['.team-portrait', '.team-portrait-mini'].forEach((selector) => {
        const frame = el.querySelector(selector);
        if (!frame) return;
        let node = frame.querySelector('.team-photo');
        if (item && item.url) {
          if (!node || node.tagName.toLowerCase() !== item.type) {
            if (node) node.remove();
            node = teamMediaNode(item);
            node.className = 'team-photo';
            frame.insertBefore(node, frame.firstChild);
          }
          if (node.src !== item.url) node.src = item.url;
          if (item.type === 'image') node.alt = item.title || `Portrait of ${member}`;
        } else if (node) {
          node.remove(); // portrait removed in the CRM → monogram placeholder returns
        }
      });
    });
  }

  /* Replace a named page-area figure (`data-media-slot="home:field-notes:1"`)
     with a Control Room upload. Removing the upload restores the original
     markup that shipped with the page. */
  const slotOriginals = new WeakMap();
  function isSlotMediaNode(node) {
    if (!node || node.nodeType !== 1) return false;
    const tag = node.tagName;
    if (tag === 'PICTURE' || tag === 'IMG' || tag === 'VIDEO') return true;
    return node.classList && node.classList.contains('cine-scene');
  }
  function captureSlotDefault(el) {
    if (slotOriginals.has(el)) return;
    const snapshot = Array.from(el.children).filter(isSlotMediaNode).map((node) => node.cloneNode(true));
    slotOriginals.set(el, snapshot);
  }
  function insertSlotNode(el, node) {
    const shade = el.querySelector('.reel-slide-shade, .journey-tag, .journey-glint, .journey-process-dots, .journey-route-line, figcaption');
    if (shade) el.insertBefore(node, shade);
    else el.insertBefore(node, el.firstChild);
  }
  function restoreSlotDefault(el) {
    const saved = slotOriginals.get(el);
    if (!saved) return;
    Array.from(el.children).filter(isSlotMediaNode).forEach((node) => node.remove());
    saved.forEach((node) => insertSlotNode(el, node.cloneNode(true)));
    el.classList.remove('has-media-override');
  }
  function paintSlotOverride(el, item) {
    captureSlotDefault(el);
    Array.from(el.children).filter(isSlotMediaNode).forEach((node) => node.remove());
    let node;
    if (item.type === 'video') {
      node = document.createElement('video');
      node.setAttribute('controls', '');
      node.muted = true;
      node.loop = true;
      node.playsInline = true;
      node.setAttribute('preload', 'metadata');
      node.setAttribute('aria-label', item.title || 'Field video');
      const source = document.createElement('source');
      source.src = item.url;
      node.appendChild(source);
      try { node.src = item.url; } catch (error) { /* source tag is enough */ }
      /* Reel slides follow the reel's own rotation timing, not a playback
         ceiling — the reel's cut logic owns play/pause in the stage. */
      if (!el.closest('[data-reel]')) applyAutoplayCeiling(node, item.duration);
    } else {
      node = document.createElement('img');
      node.src = item.url;
      node.alt = item.title || '';
      node.loading = 'lazy';
      node.decoding = 'async';
    }
    insertSlotNode(el, node);
    el.classList.add('has-media-override');
  }
  function applyMediaSlots() {
    const media = window.KhaqanMedia ? window.KhaqanMedia.get() : [];
    const place = window.KHAQAN_MEDIA_PLACEMENT;
    document.querySelectorAll('[data-media-slot]').forEach((el) => {
      const key = el.dataset.mediaSlot || '';
      const parts = key.split(':');
      if (parts.length < 2) return;
      const pageId = parts[0];
      const areaId = parts[1];
      const slotId = parts[2] || '1';
      const item = place
        ? place.occupant(media, pageId, areaId, slotId)
        : media.find((m) => m.section === pageId && (m.area || '') === areaId && (m.slot || '1') === slotId);
      if (item && item.url) paintSlotOverride(el, item);
      else restoreSlotDefault(el);
    });
  }

  /* ---------------------------------------------------------------------
     Page copy & tile labels — apply the Control Room's wording overrides.
     `page:area` restyles the section head above the media; `page:area:slot`
     rewrites one frame (caption line, heading, and the reel chapter tile,
     whose thumbnail follows the uploaded file). Blank fields keep the copy
     that ships in the HTML, so clearing an override is always safe.
     --------------------------------------------------------------------- */
  const copyValue = (entry, field) => (entry && entry[field] ? String(entry[field]).trim() : '');
  const slotCopyMap = () => (window.KhaqanSlotCopy ? window.KhaqanSlotCopy.all() : {});

  /* Clearing an override in the Control Room must give the page back the words
     it shipped with — so the text that was there before the first override is
     remembered per element and restored when the override disappears. */
  const captionOriginals = new WeakMap();
  /* Reel slides and their chapter tiles also keep the label they shipped with,
     so clearing an override reverts the tag under the stage too. */
  const slideTagOriginals = new WeakMap();
  const tileLabelOriginals = new WeakMap();
  function rememberCaption(el, captionNode) {
    if (!captionNode || captionOriginals.has(el)) return;
    const strong = captionNode.querySelector('strong');
    const span = captionNode.querySelector('span');
    captionOriginals.set(el, {
      text: captionNode.textContent,
      span: span ? span.textContent : null,
      strong: strong ? strong.textContent : null
    });
  }
  function restoreCaption(el) {
    const saved = captionOriginals.get(el);
    if (!saved) return;
    const captionNode = el.querySelector('figcaption');
    if (!captionNode) return;
    const strong = captionNode.querySelector('strong');
    const span = captionNode.querySelector('span');
    if (strong && span && saved.span !== null && saved.strong !== null) {
      span.textContent = saved.span;
      strong.textContent = saved.strong;
    } else {
      captionNode.textContent = saved.text;
    }
  }

  const headOriginals = new WeakMap();

  function applySectionCopy() {
    const copy = slotCopyMap();
    document.querySelectorAll('[data-section-copy]').forEach((head) => {
      const eyebrowNode = head.querySelector('.eyebrow');
      const headingNode = head.querySelector('h1, h2, h3');
      const textNode = head.querySelector('p');
      /* Captured once, before anything is overwritten: [eyebrow, heading, intro]
         exactly as they were written in the HTML. Clearing an override in the
         Control Room hands those words back to the page. */
      if (!headOriginals.has(head)) {
        headOriginals.set(head, [
          eyebrowNode ? eyebrowNode.textContent : '',
          headingNode ? headingNode.textContent : '',
          textNode ? textNode.textContent : ''
        ]);
      }
      const saved = headOriginals.get(head);
      const entry = copy[head.dataset.sectionCopy];
      const write = (node, index, value) => {
        if (!node) return;
        const next = value || saved[index];
        if (next != null) node.textContent = next;
      };
      write(eyebrowNode, 0, entry ? copyValue(entry, 'eyebrow') : '');
      write(headingNode, 1, entry ? copyValue(entry, 'heading') : '');
      write(textNode, 2, entry ? copyValue(entry, 'text') : '');
    });
  }


  /* The chapter rail beside the reel stage: one tile per slide, matched by the
     slide's position, so a re-worded frame and its tile never drift apart. */
  function reelTileFor(slide) {
    const reel = slide.closest('[data-reel]');
    if (!reel) return null;
    const slides = Array.from(reel.querySelectorAll('.reel-slide'));
    const index = slides.indexOf(slide);
    if (index < 0) return null;
    const band = reel.closest('section') || reel.parentElement || document;
    return band.querySelector(`[data-reel-jump="${index}"]`) || null;
  }

  const tileOriginals = new WeakMap();
  function tileMediaNode(url, type) {
    const node = type === 'video' ? document.createElement('video') : document.createElement('img');
    node.setAttribute('aria-hidden', 'true');
    if (type === 'video') {
      node.muted = true;
      node.loop = true;
      node.playsInline = true;
      node.setAttribute('preload', 'metadata');
      node.src = url;
    } else {
      node.loading = 'lazy';
      node.decoding = 'async';
      node.alt = '';
      node.src = url;
    }
    return node;
  }
  /* A tile shows exactly one thumbnail: the stock frame, or the uploaded file
     that currently occupies the slot. The stock node is remembered once so
     removing the upload puts the page back the way it shipped. */
  function paintTileThumb(tile, url, type) {
    if (!tileOriginals.has(tile)) {
      const first = tile.querySelector('img, video');
      tileOriginals.set(tile, first ? first.cloneNode(true) : null);
    }
    const already = tile.querySelector('img, video');
    if (tile.dataset.khaqanThumb === 'override' && already && already.tagName === (type === 'video' ? 'VIDEO' : 'IMG') && already.getAttribute('src') === url) return;
    const label = tile.querySelector('span');
    tile.querySelectorAll('img, video').forEach((node) => node.remove());
    const next = tileMediaNode(url, type);
    if (label) tile.insertBefore(next, label);
    else tile.appendChild(next);
    tile.dataset.khaqanThumb = 'override';
    tile.classList.add('has-media-override');
  }
  function restoreTileThumb(tile) {
    if (tile.dataset.khaqanThumb !== 'override') return;
    const original = tileOriginals.get(tile);
    tile.querySelectorAll('img, video').forEach((node) => node.remove());
    if (original) {
      const label = tile.querySelector('span');
      if (label) tile.insertBefore(original.cloneNode(true), label);
      else tile.appendChild(original.cloneNode(true));
    }
    delete tile.dataset.khaqanThumb;
    tile.classList.remove('has-media-override');
  }

  function applySlotCopy() {
    const copy = slotCopyMap();
    const media = window.KhaqanMedia ? window.KhaqanMedia.get() : [];
    const place = window.KHAQAN_MEDIA_PLACEMENT;
    document.querySelectorAll('[data-media-slot]').forEach((el) => {
      const key = el.dataset.mediaSlot || '';
      const parts = key.split(':');
      if (parts.length < 2) return;
      const entry = copy[key] || null;
      const caption = copyValue(entry, 'caption');
      const heading = copyValue(entry, 'heading');
      const tile = copyValue(entry, 'tile');
      const captionNode = el.querySelector('figcaption');
      if (entry) {
        rememberCaption(el, captionNode);
        if (captionNode) {
          const strong = captionNode.querySelector('strong');
          const span = captionNode.querySelector('span');
          if (strong && span) {
            if (caption) span.textContent = caption;
            if (heading) strong.textContent = heading;
          } else if (heading || caption) {
            captionNode.textContent = heading || caption;
          }
        } else if (heading || caption) {
          el.insertAdjacentHTML('beforeend', `<figcaption>${escapeMediaHtml(heading || caption)}</figcaption>`);
        }
      } else {
        restoreCaption(el);
      }
      /* The reel keeps its own labels: the live tag under the stage and the
         chapter tile on the side (its text and, once a file is uploaded, its
         thumbnail — a tile must never show a picture the frame no longer uses). */
      if (!el.classList.contains('reel-slide')) return;
      const override = place
        ? place.occupant(media, parts[0], parts[1], parts[2] || '1')
        : media.find((m) => m.section === parts[0] && (m.area || '') === parts[1] && (m.slot || '1') === (parts[2] || '1'));
      if (!slideTagOriginals.has(el)) slideTagOriginals.set(el, el.dataset.reelTag || '');
      const tag = tile || caption || heading || slideTagOriginals.get(el);
      if (tag) {
        el.dataset.reelTag = tag;
        if (el.classList.contains('active')) {
          const band = el.closest('section') || document;
          const live = band.querySelector('[data-reel-tag-out]');
          if (live) live.textContent = tag;
        }
      }
      const tileButton = reelTileFor(el);
      if (!tileButton) return;
      const labelNode = tileButton.querySelector('span');
      if (labelNode) {
        if (!tileLabelOriginals.has(tileButton)) tileLabelOriginals.set(tileButton, labelNode.textContent);
        labelNode.textContent = tag || tileLabelOriginals.get(tileButton);
      }
      if (override && override.url) paintTileThumb(tileButton, override.url, override.type);
      else restoreTileThumb(tileButton);
    });
  }

  renderManagedMedia();
  applyTeamPhotos();
  applyMediaSlots();
  applySectionCopy();
  applySlotCopy();

  // Live-update when the Control Room adds/removes media in another tab,
  // or when the shared Supabase catalogue hydrates in this tab.
  const refreshPublicMedia = () => {
    renderManagedMedia();
    applyTeamPhotos();
    applyMediaSlots();
    applySectionCopy();
    applySlotCopy();
  };
  window.addEventListener('storage', (event) => {
    if (event.key === MEDIA_KEY) refreshPublicMedia();
  });
  window.addEventListener('khaqan:media-change', refreshPublicMedia);
  /* Re-wording saved in the Control Room lands in the same site-settings
     payload, so the copy refreshes without a reload. */
  window.addEventListener('khaqan:cms-change', () => { applySectionCopy(); applySlotCopy(); });

})();
