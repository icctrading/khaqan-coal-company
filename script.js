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
  clientCount: '12 leading organizations'
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
  const next = { ...DEFAULT_CMS_DATA, ...nextData };
  try { window.localStorage.setItem(CMS_KEY, JSON.stringify(next)); } catch (error) { /* storage can be unavailable in private previews */ }
  applyCmsData();
  return next;
}

window.KhaqanCMS = {
  defaults: { ...DEFAULT_CMS_DATA },
  get: getCmsData,
  save: saveCmsData,
  readLeads: () => readJSON(LEADS_KEY, []),
  saveLeads: (leads) => {
    try { window.localStorage.setItem(LEADS_KEY, JSON.stringify(leads)); } catch (error) { /* no-op */ }
  }
};

/* Managed media library — images & videos added or removed from the Control Room.
   Each item is tagged to a website part (`section`) so the public pages render
   exactly the media meant for them. */
const MEDIA_KEY = 'khaqanMedia';
const mediaRead = () => readJSON(MEDIA_KEY, []);
const mediaWrite = (items) => {
  try { window.localStorage.setItem(MEDIA_KEY, JSON.stringify(items)); } catch (error) { /* no-op */ }
  try { window.dispatchEvent(new CustomEvent('khaqan:media-change')); } catch (error) { /* no-op */ }
};
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
  remove: (id) => mediaWrite(mediaRead().filter((m) => m.id !== id)),
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
  /* Replace the whole library — used when a JSON backup is imported or when
     the shared Supabase catalogue is hydrated. */
  setAll: (items) => {
    const cleaned = (Array.isArray(items) ? items : [])
      .filter((m) => m && typeof m === 'object' && m.url)
      .map((m, i) => normalizeMediaItem(m, i));
    mediaWrite(cleaned);
    return cleaned;
  },
  bySection: (section) => mediaRead().filter((m) => m.section === section)
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
  return match ? match.label : value;
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

function applyCmsData() {
  const data = getCmsData();
  document.querySelectorAll('[data-cms]').forEach((node) => {
    const key = node.dataset.cms;
    if (key === 'phoneDisplay') {
      const methods = [data.phone, data.whatsapp].filter(Boolean);
      node.textContent = methods.length ? methods.join(' · ') : 'Send your number or preferred contact method in the form.';
      return;
    }
    if (Object.prototype.hasOwnProperty.call(data, key)) node.textContent = data[key];
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
  if (!window.KhaqanCloud?.enabled) return;
  try {
    const remoteData = await window.KhaqanCloud.getSettings();
    if (remoteData) saveCmsData({ ...getCmsData(), ...remoteData });
  } catch (error) {
    // Keep the local preview available if Supabase is not yet configured or reachable.
  }
  try {
    const remoteMedia = await window.KhaqanCloud.listMedia();
    if (Array.isArray(remoteMedia) && window.KhaqanMedia) window.KhaqanMedia.setAll(remoteMedia);
  } catch (error) {
    // Keep the browser media library if Storage is not yet configured or reachable.
  }
}
hydrateCloudContent();

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
        // The local lead is retained if the cloud endpoint is not ready yet.
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
   facts) count from zero as they scroll into view. Handles comma-grouped
   numbers, currency prefixes, decimals and trailing units; skips year
   ranges and labels that only carry an ordinal like "01". */
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
  const original = el.textContent.trim();
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
    if (p < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
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
  const interval = Number(reel.dataset.reelInterval) || 7200;
  let index = 0;
  let timer = null;
  let onScreen = true;

  if (!slides.length) return;
  reel.style.setProperty('--reel-duration', `${interval}ms`);

  if (dotsWrap) {
    dotsWrap.innerHTML = slides.map((_, i) => `<button class="reel-dot${i === 0 ? ' active' : ''}" data-reel-dot="${i}" type="button" aria-label="Show mining reel item ${i + 1}"></button>`).join('');
    dotsWrap.addEventListener('click', (event) => {
      const dot = event.target.closest('[data-reel-dot]');
      if (!dot) return;
      activate(Number(dot.dataset.reelDot));
      restart();
    });
  }

  // Chapter rail: pre-authored buttons beside the stage jump the reel to a slide,
  // and behave as a real tablist (arrow keys move focus and advance the cut).
  chapterButtons.forEach((button, i) => {
    button.addEventListener('click', () => {
      activate(Number(button.dataset.reelJump));
      restart();
    });
    button.addEventListener('keydown', (event) => {
      const step = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[event.key];
      if (step === undefined && event.key !== 'Home' && event.key !== 'End') return;
      event.preventDefault();
      const target = event.key === 'Home' ? 0 : event.key === 'End' ? chapterButtons.length - 1 : (i + step + chapterButtons.length) % chapterButtons.length;
      chapterButtons[target].focus();
      activate(Number(chapterButtons[target].dataset.reelJump));
      restart();
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
        if (active && onScreen) {
          video.currentTime = 0;
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
  function stop() {
    if (timer) window.clearInterval(timer);
    timer = null;
    if (progress) progress.classList.add('paused');
    const video = activeVideo();
    if (video && !video.paused) { video.pause(); video.dataset.reelResume = '1'; }
  }
  function restart() {
    if (!onScreen) return;
    stop();
    if (progress) progress.classList.remove('paused');
    timer = window.setInterval(() => activate(index + 1), interval);
    const video = activeVideo();
    if (video && video.dataset.reelResume === '1') {
      delete video.dataset.reelResume;
      video.play().catch(() => {});
    }
  }

  nextButton?.addEventListener('click', () => { activate(index + 1); restart(); });
  // Hover/focus pauses the whole deck — rail included — so a reader can study a frame.
  const pauseZone = band && band.matches('.reel-deck, .reel-band, section') ? band : reel;
  pauseZone.addEventListener('mouseenter', stop);
  pauseZone.addEventListener('mouseleave', restart);
  pauseZone.addEventListener('focusin', stop);
  pauseZone.addEventListener('focusout', (event) => { if (!pauseZone.contains(event.relatedTarget)) restart(); });
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
  const interval = Number(hero.dataset.teamInterval) || 6000;
  let index = 0;
  let timer = null;
  if (!slides.length) return;
  hero.style.setProperty('--team-duration', `${interval}ms`);

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

  activate(0);
  restart();
});

/* =====================================================================
   Managed media + team photos — render Control Room media on the public
   pages and drop uploaded member portraits into the leadership sections.
   ===================================================================== */
(function () {
  const escapeMediaHtml = (value = '') => String(value).replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));

  function videoMarkup(m) {
    // Uploads may be .webm/.mov/.mp4 — let the browser pick; also pass the
    // data-URL directly to <video src> as a fallback for data URLs with
    // mime types a <source type="video/mp4"> would otherwise reject.
    const source = /^data:video\//.test(m.url)
      ? `<source src="${escapeMediaHtml(m.url)}">`
      : `<source src="${escapeMediaHtml(m.url)}" type="video/mp4"><source src="${escapeMediaHtml(m.url)}" type="video/webm">`;
    return `<video controls muted loop playsinline preload="metadata">${source}</video>`;
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
    });
  }

  function applyTeamPhotos() {
    const media = window.KhaqanMedia ? window.KhaqanMedia.get() : [];
    document.querySelectorAll('[data-member]').forEach((el) => {
      const member = el.dataset.member;
      // The most recently added portrait for a member wins, so re-uploading a
      // portrait from the Control Room swaps it everywhere automatically.
      const photo = media.find((m) => m.type === 'image' && m.section === `team-${member}`);
      const portrait = el.querySelector('.team-portrait');
      const mini = el.querySelector('.team-portrait-mini');
      if (portrait) {
        let img = portrait.querySelector('.team-photo');
        if (photo && photo.url) {
          if (!img) {
            img = document.createElement('img');
            img.className = 'team-photo';
            img.loading = 'lazy';
            img.decoding = 'async';
            portrait.insertBefore(img, portrait.firstChild);
          }
          if (img.src !== photo.url) img.src = photo.url;
          img.alt = photo.title || `Portrait of ${member}`;
        } else if (img) {
          img.remove(); // portrait removed in the CRM → monogram placeholder returns
        }
      }
      if (mini) {
        let img = mini.querySelector('img');
        if (photo && photo.url) {
          if (!img) {
            img = document.createElement('img');
            img.loading = 'lazy';
            mini.appendChild(img);
          }
          if (img.src !== photo.url) img.src = photo.url;
          img.alt = photo.title || `Portrait of ${member}`;
        } else if (img) {
          img.remove();
        }
      }
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

  renderManagedMedia();
  applyTeamPhotos();
  applyMediaSlots();

  // Live-update when the Control Room adds/removes media in another tab,
  // or when the shared Supabase catalogue hydrates in this tab.
  const refreshPublicMedia = () => { renderManagedMedia(); applyTeamPhotos(); applyMediaSlots(); };
  window.addEventListener('storage', (event) => {
    if (event.key === MEDIA_KEY) refreshPublicMedia();
  });
  window.addEventListener('khaqan:media-change', refreshPublicMedia);
})();
