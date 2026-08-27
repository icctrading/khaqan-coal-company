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
  marble: { day: '#f7f4ec', night: '#121218' },
  obsidian: { day: '#f2f1ef', night: '#0b0b0e' }
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
  const skin = currentSkin();
  const mode = document.documentElement.dataset.theme === 'day' ? 'day' : 'night';
  const color = (THEME_COLORS[skin] || THEME_COLORS.signature)[mode];
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta && color) meta.setAttribute('content', color);
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
    try { window.localStorage.setItem(SKIN_KEY, nextSkin); } catch (error) { /* no-op */ }
  });
  updateSkinButtons();
  updateThemeColorMeta();
  closeSkinMenus();
}

/* Skin picker menu behaviour. */
function closeSkinMenus() {
  document.querySelectorAll('.skin-menu').forEach((menu) => {
    menu.removeAttribute('data-open');
    menu.hidden = true;
  });
  document.querySelectorAll('.skin-toggle').forEach((button) => {
    button.setAttribute('aria-expanded', 'false');
  });
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

const path = window.location.pathname.split('/').pop() || 'index.html';

document.querySelectorAll('[data-nav]').forEach((link) => {
  const target = link.getAttribute('href').split('/').pop() || 'index.html';
  if ((path === '' && target === 'index.html') || path === target) {
    link.classList.add('active');
    link.setAttribute('aria-current', 'page');
  }
});

const header = document.querySelector('.site-header');
const onScroll = () => {
  if (header) header.classList.toggle('scrolled', window.scrollY > 22);
};
onScroll();
window.addEventListener('scroll', onScroll, { passive: true });

const themeButtons = document.querySelectorAll('.theme-toggle');
themeButtons.forEach((button) => {
  button.addEventListener('click', () => setTheme(document.documentElement.dataset.theme === 'day' ? 'night' : 'day'));
});

document.querySelectorAll('.skin-switch').forEach((switchEl) => {
  const toggle = switchEl.querySelector('.skin-toggle');
  if (toggle) toggle.addEventListener('click', (event) => { event.stopPropagation(); toggleSkinMenu(switchEl); });
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
}
hydrateCloudContent();

const toggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.main-nav');
if (toggle && nav) {
  toggle.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
    toggle.textContent = open ? '×' : '☰';
  });
  nav.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
    nav.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.textContent = '☰';
  }));
}

const revealItems = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window && revealItems.length) {
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.13 });
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

/* Number count-up when the qom facts scroll into view. */
const countEls = document.querySelectorAll('.qom-facts strong');
if ('IntersectionObserver' in window && countEls.length
    && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const countObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      obs.unobserve(entry.target);
      const el = entry.target;
      const match = el.textContent.match(/^([^0-9]*)(\d+(?:\.\d+)?)([\s\S]*)$/);
      if (!match) return;
      const [, prefix, numText, suffix] = match;
      const target = parseFloat(numText);
      const decimals = (numText.split('.')[1] || '').length;
      const duration = 1700;
      const start = performance.now();
      const tick = (now) => {
        const p = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = prefix + (target * eased).toFixed(decimals) + suffix;
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
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
  const interval = Number(reel.dataset.reelInterval) || 7200;
  let index = 0;
  let timer = null;

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

  function activate(nextIndex) {
    index = (nextIndex + slides.length) % slides.length;
    slides.forEach((slide, i) => {
      const active = i === index;
      slide.classList.toggle('active', active);
      slide.setAttribute('aria-hidden', String(!active));
      const video = slide.querySelector('video');
      if (video) {
        if (active) {
          video.currentTime = 0;
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      }
    });
    if (count) count.textContent = `${String(index + 1).padStart(2, '0')} / ${String(slides.length).padStart(2, '0')}`;
    dotsWrap?.querySelectorAll('.reel-dot').forEach((dot, i) => dot.classList.toggle('active', i === index));
    if (progress) {
      progress.classList.remove('run');
      void progress.offsetWidth; /* restart the timeline */
      progress.classList.add('run');
    }
  }

  function stop() {
    if (timer) window.clearInterval(timer);
    timer = null;
    if (progress) progress.classList.add('paused');
  }
  function restart() {
    stop();
    if (progress) progress.classList.remove('paused');
    timer = window.setInterval(() => activate(index + 1), interval);
  }

  nextButton?.addEventListener('click', () => { activate(index + 1); restart(); });
  reel.addEventListener('mouseenter', stop);
  reel.addEventListener('mouseleave', restart);
  reel.addEventListener('focusin', stop);
  reel.addEventListener('focusout', (event) => { if (!reel.contains(event.relatedTarget)) restart(); });
  document.addEventListener('visibilitychange', () => { if (document.hidden) stop(); else restart(); });

  activate(0);
  restart();
});

/* =====================================================================
   Cinematic 3D backdrop — the landing page background is a live
   crossfading sequence of high-quality 3D renders with a slow camera
   drift (a "video" that needs no video download).
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

  let W = 0, H = 0, dpr = 1, raf = 0, segStart = 0, idx = 0, settled = 0;

  function size() {
    dpr = Math.min(window.devicePixelRatio || 1, 1.75);
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

  function frame(now) {
    const el = now - segStart;
    const p = Math.min(1, el / SEG);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const d = drift[idx % drift.length];
    if (!draw(imgs[idx], d, p)) draw(imgs[0], drift[0], 0.5);
    const fp = (el - (SEG - FADE)) / FADE;
    if (fp > 0) {
      const nextIdx = (idx + 1) % imgs.length;
      ctx.globalAlpha = Math.min(1, fp);
      draw(imgs[nextIdx], drift[nextIdx % drift.length], 0);
      ctx.globalAlpha = 1;
    }
    if (p >= 1) { idx = (idx + 1) % imgs.length; segStart = now; }
    raf = window.requestAnimationFrame(frame);
  }

  function still() {
    size();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    draw(imgs[0], drift[0], 0.5);
  }

  function ready() {
    if (settled < imgs.length) return;
    size();
    if (reduced) { still(); return; }
    segStart = window.performance.now();
    window.cancelAnimationFrame(raf);
    raf = window.requestAnimationFrame(frame);
  }

  imgs.forEach((im, i) => {
    const done = () => { settled++; ready(); };
    if (im.complete && im.naturalWidth) done();
    else { im.addEventListener('load', done, { once: true }); im.addEventListener('error', done, { once: true }); }
  });

  let rt = 0;
  window.addEventListener('resize', () => {
    window.clearTimeout(rt);
    rt = window.setTimeout(() => {
      size();
      if (reduced) { ctx.clearRect(0, 0, canvas.width, canvas.height); draw(imgs[0], drift[0], 0.5); }
    }, 160);
  }, { passive: true });

  document.addEventListener('visibilitychange', () => {
    if (reduced) return;
    if (document.hidden) window.cancelAnimationFrame(raf);
    else { segStart = window.performance.now(); window.cancelAnimationFrame(raf); raf = window.requestAnimationFrame(frame); }
  });
})();
