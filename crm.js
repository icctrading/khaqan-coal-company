(() => {
  const cms = window.KhaqanCMS;
  if (!cms) return;

  /* The CRM workspace is only mounted (from crm.html's <template>) after an
     authenticated admin session exists, so nothing here runs — and no leads,
     media or site-content fields are rendered — until crm-cloud.js calls
     window.KhaqanCRMInit() following a successful admin check. */
  let crmStarted = false;
  window.KhaqanCRMInit = function initCRM() {
    if (crmStarted || !document.querySelector('#site-form')) return;
    crmStarted = true;

  const query = (selector) => document.querySelector(selector);
  const queryAll = (selector) => Array.from(document.querySelectorAll(selector));
  const form = query('#site-form');
  const saveStatus = query('#site-save-status');
  const escapeHtml = (value = '') => String(value).replace(/[&<>'"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[char]));

  function cloudAdmin() {
    const cloud = window.KhaqanCloud;
    return cloud && cloud.enabled && cloud.session() ? cloud : null;
  }

  async function refreshMediaFromCloud() {
    const cloud = cloudAdmin();
    if (!cloud || !cloud.listMedia) return false;
    const items = await cloud.listMedia();
    if (Array.isArray(items) && window.KhaqanMedia) {
      /* Merge — never replace: browser-held files and newer edits survive a
         failed upload, so nothing disappears on refresh or sign-out. */
      window.KhaqanMedia.mergeRemote(items);
      if (window.KhaqanSync) {
        await window.KhaqanSync.enqueueLocalOnlyMedia().catch(() => {});
        await window.KhaqanSync.flush().catch(() => {});
      }
    }
    return true;
  }

  /* Push a media change to the durable queue + try the cloud right away. The
     queue is retried on sign-in, page load, network-return and a timer, so a
     failed call can never leave the change silently in limbo. */
  function queueMediaFor(id, file) {
    const sync = window.KhaqanSync;
    if (!sync || !id) return;
    sync.queueMedia(id, file).then(() => sync.flush().catch(() => {})).catch(() => {});
  }
  function queueDeleteFor(id, storagePath) {
    const sync = window.KhaqanSync;
    if (!sync || !id) return;
    sync.queueDelete(id, storagePath);
    sync.flush().catch(() => {});
  }

  /* Site settings (page copy, tile labels) go through the same durable queue as
     every other setting: marked first so a failed request is retried on the next
     sign-in or page load instead of reverting to the cloud copy on refresh. */
  function queueSettingsForCloud() {
    const sync = window.KhaqanSync;
    if (!sync) return;
    sync.markSettingsPending();
    sync.flush().catch(() => {});
  }

  /* In-page confirmation instead of window.confirm(). A blocked or suppressed
     native dialog returns `false` with no message at all — which is what made
     Delete and Remove look dead inside an embedded preview. The card states
     precisely what goes away, including the Storage object. */
  const confirmRoot = query('#crm-confirm');
  let confirmResolve = null;

  function closeConfirm(result) {
    if (!confirmRoot || confirmRoot.hidden) { if (confirmResolve) confirmResolve(false); return; }
    confirmRoot.hidden = true;
    const ok = query('#crm-confirm-ok');
    if (ok && ok._restoreFocus) { try { ok._restoreFocus.focus(); } catch (error) { /* focus is cosmetic */ } ok._restoreFocus = null; }
    if (confirmResolve) confirmResolve(result);
    confirmResolve = null;
  }

  function askConfirm({ title = 'Are you sure?', body = '', confirm = 'Yes, continue', cancel = 'Cancel', danger = true } = {}) {
    if (!confirmRoot) {
      // No modal mounted (older cache) — fall back to the native dialog.
      return Promise.resolve(window.confirm(`${title}\n\n${body}`));
    }
    query('#crm-confirm-title').textContent = title;
    const bodyNode = query('#crm-confirm-body');
    bodyNode.innerHTML = '';
    String(body || '').split('\n').filter(Boolean).forEach((line) => {
      const p = document.createElement('p');
      p.textContent = line;
      bodyNode.appendChild(p);
    });
    const okButton = query('#crm-confirm-ok');
    const cancelButton = query('#crm-confirm-cancel');
    okButton.textContent = confirm;
    cancelButton.textContent = cancel;
    okButton.className = `btn ${danger ? 'crm-danger btn-primary' : 'btn-primary'}`;
    okButton._restoreFocus = document.activeElement;
    confirmRoot.hidden = false;
    confirmRoot.dataset.open = '1';
    okButton.focus();
    return new Promise((resolve) => { confirmResolve = resolve; });
  }

  confirmRoot?.addEventListener('click', (event) => {
    if (event.target === confirmRoot || event.target.closest('[data-confirm-close]')) closeConfirm(false);
  });
  query('#crm-confirm-ok')?.addEventListener('click', () => closeConfirm(true));
  query('#crm-confirm-cancel')?.addEventListener('click', () => closeConfirm(false));
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && confirmRoot && !confirmRoot.hidden) { event.stopPropagation(); closeConfirm(false); }
  });

  /* Human-readable size for the media inventory. */
  function formatBytes(bytes) {
    const size = Number(bytes) || 0;
    if (!size) return '—';
    const units = ['B', 'KB', 'MB', 'GB'];
    let value = size;
    let unit = 0;
    while (value >= 1024 && unit < units.length - 1) { value /= 1024; unit += 1; }
    return `${value >= 10 || unit === 0 ? Math.round(value) : value.toFixed(1)} ${units[unit]}`;
  }

  function flashStatus(message, ok = true) {
    const targets = [saveStatus, query('#leadership-save-status'), query('#rotation-save-status'), query('#media-save-status'), query('#copy-save-status'), query('#allmedia-save-status')].filter(Boolean);
    targets.forEach((el) => {
      el.textContent = message;
      el.style.color = ok ? '' : '#ffae80';
    });
    window.setTimeout(() => {
      targets.forEach((el) => {
        if (!el.textContent.startsWith('Cloud sync:')) { el.textContent = ''; el.style.color = ''; }
      });
    }, 6000);
  }

  function loadSiteForm() {
    const data = cms.get();
    queryAll('[data-field]').forEach((field) => {
      field.value = data[field.dataset.field] || '';
    });
  }

  function saveSiteForm(event) {
    event.preventDefault();
    const data = { ...cms.get() };
    queryAll('[data-field]').forEach((field) => { data[field.dataset.field] = field.value.trim(); });
    cms.save(data);
    flashStatus('Saved. Open the main website in a new tab to see the update.');
  }

  function readLeads() {
    return cms.readLeads().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  function formatDate(value) {
    if (!value) return '—';
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? '—' : date.toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' });
  }

  function renderLeads() {
    const allLeads = readLeads();
    const search = (query('#lead-search')?.value || '').toLowerCase().trim();
    const leads = allLeads.filter((lead) => [lead.name, lead.company, lead.interest, lead.contact, lead.message].join(' ').toLowerCase().includes(search));
    const tbody = query('#leads-table-body');
    const empty = query('#empty-leads');
    if (!tbody || !empty) return;
    query('#metric-open').textContent = allLeads.filter((lead) => lead.status !== 'Archived').length;
    query('#sidebar-leads').textContent = allLeads.filter((lead) => lead.status !== 'Archived').length;
    tbody.innerHTML = leads.map((lead) => `<tr data-lead-row="${escapeHtml(lead.id)}"><td><strong>${escapeHtml(lead.name || 'Unknown')}</strong><small>${escapeHtml(lead.contact || '')}</small></td><td>${escapeHtml(lead.company || '—')}</td><td><span>${escapeHtml(lead.interest || 'General enquiry')}</span><small>${escapeHtml(lead.message || '')}</small></td><td>${formatDate(lead.createdAt)}</td><td><select class="lead-status" data-id="${escapeHtml(lead.id)}"><option ${lead.status === 'New' ? 'selected' : ''}>New</option><option ${lead.status === 'Contacted' ? 'selected' : ''}>Contacted</option><option ${lead.status === 'Won' ? 'selected' : ''}>Won</option><option ${lead.status === 'Archived' ? 'selected' : ''}>Archived</option></select></td><td><button class="lead-delete" data-id="${escapeHtml(lead.id)}" type="button" aria-label="Delete enquiry">×</button></td></tr>`).join('');
    empty.style.display = leads.length ? 'none' : 'block';
  }

  function updateLeadStatus(id, status) {
    const leads = cms.readLeads().map((lead) => lead.id === id ? { ...lead, status } : lead);
    cms.saveLeads(leads);
    renderLeads();
  }

  function deleteLead(id) {
    cms.saveLeads(cms.readLeads().filter((lead) => lead.id !== id));
    renderLeads();
  }

  queryAll('[data-crm-tab]').forEach((tab) => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.crmTab;
      queryAll('[data-crm-tab]').forEach((item) => item.classList.toggle('active', item === tab));
      queryAll('[data-crm-view]').forEach((view) => view.classList.toggle('active', view.dataset.crmView === target));
      if (target === 'leads') renderLeads();
      if (target === 'media') { renderPortraits(); renderMedia(); }
    });
  });

  form?.addEventListener('submit', saveSiteForm);
  query('#leadership-form')?.addEventListener('submit', saveSiteForm);
  query('#rotation-form')?.addEventListener('submit', saveSiteForm);

  // Keep the "Content fields" metric honest as the editable set grows.
  const metricFields = query('#metric-fields');
  if (metricFields) metricFields.textContent = String(queryAll('[data-field]').length);
  query('#lead-search')?.addEventListener('input', renderLeads);
  query('#leads-table-body')?.addEventListener('change', (event) => {
    if (event.target.matches('.lead-status')) updateLeadStatus(event.target.dataset.id, event.target.value);
  });
  query('#leads-table-body')?.addEventListener('click', (event) => {
    if (event.target.matches('.lead-delete')) deleteLead(event.target.dataset.id);
  });
  query('#clear-leads')?.addEventListener('click', async () => {
    if (!cms.readLeads().length) return;
    const ok = await askConfirm({
      title: 'Clear every saved enquiry?',
      body: 'This removes the enquiries held in this browser.\nEnquiries already stored in Supabase are deleted from the database too.',
      confirm: 'Clear all'
    });
    if (ok) {
      try { window.dispatchEvent(new CustomEvent('khaqan:leads-clear')); } catch (error) { /* no-op */ }
      cms.saveLeads([]);
      renderLeads();
      flashStatus('Saved enquiries cleared.');
    }
  });

  query('#export-data')?.addEventListener('click', () => {
    const bundle = { site: cms.get(), leads: cms.readLeads(), media: (window.KhaqanMedia ? window.KhaqanMedia.get() : []), exportedAt: new Date().toISOString() };
    const blob = new Blob([JSON.stringify(bundle, null, 2)], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'khaqan-control-room-backup.json';
    link.click();
    URL.revokeObjectURL(link.href);
  });

  query('#import-data')?.addEventListener('change', (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const bundle = JSON.parse(reader.result);
        if (bundle.site) cms.save(bundle.site);
        if (Array.isArray(bundle.leads)) cms.saveLeads(bundle.leads);
        if (Array.isArray(bundle.media) && window.KhaqanMedia) window.KhaqanMedia.setAll(bundle.media);
        loadSiteForm();
        renderLeads();
        renderPortraits();
        renderMedia();
        flashStatus('Backup imported successfully — content, enquiries and media restored.');
        /* Imported content is browser-local; queue it so it also reaches the
           shared cloud store instead of living only on this browser. */
        if (window.KhaqanSync) {
          window.KhaqanSync.markSettingsPending();
          window.KhaqanSync.enqueueLocalOnlyMedia().then(() => window.KhaqanSync.flush().catch(() => {})).catch(() => {});
        }
      } catch (error) {
        flashStatus('That backup could not be read.', false);
      }
    };
    reader.readAsText(file);
    event.target.value = '';
  });

  query('#reset-data')?.addEventListener('click', async () => {
    const ok = await askConfirm({
      title: 'Reset editable content to the defaults?',
      body: 'Site text, leadership descriptions, rotation timing, page copy and every custom heading or tile label go back to what ships in the code.\nUploaded media and enquiries are not touched.',
      confirm: 'Reset defaults'
    });
    if (!ok) return;
    cms.save(cms.defaults);
    loadSiteForm();
    renderCopyForm();
    flashStatus('Defaults restored.');
    /* Push the reset to the shared store too — otherwise the live site keeps
       the old text and "restores" it on the next refresh. */
    queueSettingsForCloud();
  });

  /* =====================================================================
     Leadership portraits — the rotating hero (Home) and team cards
     (About) show these photographs for Director, CEO, MD and CFO.
     ===================================================================== */
  const PORTRAIT_MEMBERS = [
    { key: 'director', role: 'Director', name: 'Adnan Khan', monogram: 'AK', caption: 'The digital pioneer' },
    { key: 'ceo', role: 'Chief Executive Officer', name: 'Haji Ilyas Khan', monogram: 'IK', caption: 'The vision' },
    { key: 'md', role: 'Managing Director', name: 'Abdur Rauf Khan', monogram: 'AR', caption: 'The problem-solver' },
    { key: 'cfo', role: 'Chief Financial Officer', name: 'Jibran Khan', monogram: 'JK', caption: 'The steady hand' }
  ];
  const portraitGrid = query('#leadership-portrait-grid');

  function portraitFor(key) {
    const items = window.KhaqanMedia ? window.KhaqanMedia.get() : [];
    return items.find((m) => m.section === `team-${key}` && (m.type === 'image' || m.type === 'video')) || null;
  }

  function renderPortraits() {
    if (!portraitGrid) return;
    portraitGrid.innerHTML = PORTRAIT_MEMBERS.map((member) => {
      const photo = portraitFor(member.key);
      const isVideo = !!(photo && photo.type === 'video');
      const visual = photo
        ? mediaVisual(photo.url, photo.title, photo.type)
        : `<span class="crm-portrait-monogram" aria-hidden="true">${escapeHtml(member.monogram)}</span>`;
      const fileId = `portrait-file-${member.key}`;
      const durationId = `portrait-duration-${member.key}`;
      return `<article class="crm-portrait-slot${photo ? ' has-photo' : ''}" data-member="${member.key}">
        <div class="crm-portrait-frame">${visual}
          <span class="crm-portrait-badge">${photo ? (isVideo ? 'Video live on site' : 'Photo live on site') : 'No media yet'}</span>
        </div>
        <div class="crm-portrait-meta"><strong>${escapeHtml(member.name)}</strong><span>${escapeHtml(member.role)} · ${escapeHtml(member.caption)}</span><small>${photo ? escapeHtml(photo.title || (isVideo ? 'Portrait video' : 'Portrait')) : 'Initials placeholder shown on the site'}</small></div>
        <div class="crm-portrait-actions">
          <label class="file-label" for="${fileId}">${photo ? 'Replace' : 'Add photo / video'}<input id="${fileId}" type="file" accept="image/*,video/*" data-portrait-upload="${member.key}" hidden></label>
          <label class="crm-portrait-duration-field" title="Set how long the video plays before it stops (2 s minimum)">
            <span>Playback time</span>
            <input id="${durationId}" type="text" inputmode="numeric" placeholder="e.g. 0:15" value="${isVideo ? formatDuration(photo.duration) : ''}" data-portrait-duration="${member.key}" aria-label="Video playback time for ${escapeHtml(member.name)}">
          </label>
          ${photo ? `<button class="btn btn-quiet crm-danger" type="button" data-portrait-remove="${member.key}">Remove</button>` : ''}
        </div>
      </article>`;
    }).join('');
  }

  function readFileAsDataURL(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject(new Error('read-failed'));
      reader.readAsDataURL(file);
    });
  }

  async function retireStalePortraits(section, keepId, cloud) {
    const stale = window.KhaqanMedia.get().filter((m) => (m.type === 'image' || m.type === 'video') && m.section === section && m.id !== keepId);
    for (const item of stale) {
      try {
        if (cloud) await cloud.deleteMedia(item.id, item.storagePath);
        else window.KhaqanMedia.remove(item.id);
      } catch (error) {
        window.KhaqanMedia.remove(item.id);
        if (item.storagePath) queueDeleteFor(item.id, item.storagePath);
      }
    }
  }

  function portraitDurationInput(key) {
    return document.getElementById(`portrait-duration-${key}`);
  }

  // Playback time for a hero/leadership video — read from the card's field.
  function readPortraitDuration(key) {
    const input = portraitDurationInput(key);
    return input ? parseDuration(input.value) : 0;
  }

  async function handlePortraitUpload(input, key) {
    const file = input.files && input.files[0];
    if (!file || !window.KhaqanMedia) return;
    const member = PORTRAIT_MEMBERS.find((m) => m.key === key);
    const section = `team-${key}`;
    const title = `Portrait — ${member.name}`;
    const type = fileKind(file);
    const durationNum = type === 'video' ? readPortraitDuration(key) : 0;
    const cloud = cloudAdmin();
    try {
      if (cloud) {
        const existing = portraitFor(key);
        if (existing && existing.storagePath) {
          await cloud.updateMedia(existing.id, { file, title, section, type, duration: durationNum, storagePath: existing.storagePath });
        } else {
          await cloud.uploadMedia({ file, title, section, type, duration: durationNum });
          if (existing) {
            try { await cloud.deleteMedia(existing.id, existing.storagePath); } catch (error) { window.KhaqanMedia.remove(existing.id); }
          }
        }
        await refreshMediaFromCloud();
        const keep = portraitFor(key);
        await retireStalePortraits(section, keep && keep.id, cloud);
        await refreshMediaFromCloud();
      } else {
        const url = await readFileAsDataURL(file);
        const stale = window.KhaqanMedia.get()
          .filter((m) => (m.type === 'image' || m.type === 'video') && m.section === section && m.id !== (portraitFor(key) || {}).id)
          .map((m) => m.id);
        const existing = portraitFor(key);
        if (existing) {
          window.KhaqanMedia.update(existing.id, { url, title, section, type, duration: durationNum });
        } else {
          window.KhaqanMedia.add({ type, title, section, url, duration: durationNum });
        }
        stale.forEach((id) => window.KhaqanMedia.remove(id));
      }
      renderPortraits();
      renderMedia();
      updateMediaMetric();
      flashStatus(`${member.name}'s ${type === 'video' ? 'video' : 'portrait'} is now live in the leadership hero.`);
    } catch (error) {
      try {
        const url = await readFileAsDataURL(file);
        const existing = portraitFor(key);
        let savedItem = null;
        if (existing) savedItem = window.KhaqanMedia.update(existing.id, { url, title, section, type, duration: durationNum });
        else savedItem = window.KhaqanMedia.add({ type, title, section, url, duration: durationNum });
        renderPortraits();
        renderMedia();
        updateMediaMetric();
        if (savedItem) queueMediaFor(savedItem.id, file);
        flashStatus(`${member.name}'s ${type === 'video' ? 'video' : 'portrait'} saved in this browser and queued for the live site — it will sync automatically.`, false);
      } catch (localError) {
        flashStatus(error.message || 'That portrait file could not be saved.', false);
      }
    } finally {
      input.value = '';
    }
  }

  async function handlePortraitRemove(key) {
    const member = PORTRAIT_MEMBERS.find((m) => m.key === key);
    if (!window.KhaqanMedia) return;
    const section = `team-${key}`;
    const portraits = window.KhaqanMedia.get().filter((m) => (m.type === 'image' || m.type === 'video') && m.section === section);
    if (!portraits.length) return;
    const ok = await askConfirm({
      title: `Remove ${member.name}'s portrait?`,
      body: `The initials placeholder returns on the Home hero and the About team card.\n${cloudAdmin() ? 'The file is deleted from Supabase Storage as well.' : 'The upload is removed from this browser.'}`,
      confirm: 'Remove portrait'
    });
    if (!ok) return;
    const cloud = cloudAdmin();
    try {
      if (cloud) {
        for (const item of portraits) {
          try { await cloud.deleteMedia(item.id, item.storagePath); } catch (error) { window.KhaqanMedia.remove(item.id); queueDeleteFor(item.id, item.storagePath); }
        }
        await refreshMediaFromCloud();
      } else {
        portraits.forEach((m) => window.KhaqanMedia.remove(m.id));
      }
    } catch (error) {
      portraits.forEach((m) => { window.KhaqanMedia.remove(m.id); queueDeleteFor(m.id, m.storagePath); });
    }
    renderPortraits();
    renderMedia();
    updateMediaMetric();
    flashStatus(`${member.name}'s portrait removed.`);
  }

  // Persist a video's playback time to local + cloud storage (used by the
  // leadership portraits and by every media-library video tile).
  async function updateMediaDuration(item, durationNum, label, input) {
    if (!item || item.type !== 'video') { if (input) input.value = ''; return; }
    const cloud = cloudAdmin();
    const patch = { duration: durationNum };
    try {
      if (cloud) {
        await cloud.updateMedia(item.id, { title: item.title, section: item.section, area: item.area || '', slot: item.slot || '', type: item.type, duration: durationNum, storagePath: item.storagePath });
        await refreshMediaFromCloud();
      } else {
        window.KhaqanMedia.update(item.id, patch);
      }
    } catch (error) {
      window.KhaqanMedia.update(item.id, patch);
      queueMediaFor(item.id);
    }
    renderPortraits();
    renderMedia();
    updateMediaMetric();
    const who = label ? ` for ${label}` : '';
    const message = durationNum > 0
      ? `Playback time set to ${formatDuration(durationNum)}${who}.`
      : `Playback time cleared${who} — video loops as normal.`;
    flashStatus(message);
    if (input) input.value = formatDuration(durationNum);
  }

  portraitGrid?.addEventListener('change', (event) => {
    const input = event.target.closest('[data-portrait-upload]');
    if (input) handlePortraitUpload(input, input.dataset.portraitUpload);
  });
  portraitGrid?.addEventListener('click', (event) => {
    const button = event.target.closest('[data-portrait-remove]');
    if (button) handlePortraitRemove(button.dataset.portraitRemove);
  });
  // Saves a portrait video's playback time on blur (or Enter) without re-uploading.
  portraitGrid?.addEventListener('change', (event) => {
    const input = event.target.closest('[data-portrait-duration]');
    if (!input) return;
    const key = input.dataset.portraitDuration;
    const item = window.KhaqanMedia ? window.KhaqanMedia.get().find((m) => m.section === `team-${key}` && (m.type === 'image' || m.type === 'video')) : null;
    if (!item) return;
    const member = PORTRAIT_MEMBERS.find((m) => m.key === key);
    const durationNum = parseDuration(input.value);
    updateMediaDuration(item, durationNum, member && member.name, input);
  });

  /* =====================================================================
     Media library manager — add, edit, replace, remove (unplace) or delete
     pictures & videos, tagged with a public page and page-area reference.
     ===================================================================== */
  const mediaBoard = query('#managed-media-board');
  const mediaGrid = query('#managed-media-grid');
  const mediaEmpty = query('#managed-media-empty');
  const mediaMetric = query('#metric-media');
  const mediaForm = query('#media-form');
  const mediaTitle = query('#media-title');
  const mediaPage = query('#media-page');
  const mediaArea = query('#media-area');
  const mediaSlot = query('#media-slot');
  const imageFileInput = query('#media-image-file');
  const videoFileInput = query('#media-video-file');
  const mediaDurationField = query('#media-duration-field');
  const videoDurationInput = query('#media-video-duration');
  const mediaSubmit = query('#media-submit');
  const mediaEditCancel = query('#media-edit-cancel');
  const mediaFormEyebrow = query('#media-form-eyebrow');
  const mediaFormTitle = query('#media-form-title');
  const mediaFilters = query('#media-page-filters');
  const mediaSearch = query('#media-search');
  /* On-page wording for the slot being edited — the frame's caption line, its
     heading, and the label on the reel's chapter tile. */
  const mediaCopyRow = query('#media-copy-fields');
  const mediaCaption = query('#media-caption');
  const mediaHeading = query('#media-heading');
  const mediaTile = query('#media-tile');
  const MAX_MEDIA_BYTES = 12 * 1024 * 1024; // keep localStorage within browser quota
  const MAX_CLOUD_BYTES = 50 * 1024 * 1024; // matches the media bucket file_size_limit

  let editingMediaId = null;
  let stagedFile = null; // { type: 'image'|'video', url: dataURL, name: fileName, file }
  let pageFilter = 'all';

  const place = () => window.KHAQAN_MEDIA_PLACEMENT;

  function updateMediaMetric() {
    const items = window.KhaqanMedia ? window.KhaqanMedia.get() : [];
    if (mediaMetric) mediaMetric.textContent = String(items.length);
  }

  function fileKind(file) {
    if (!file) return 'image';
    if ((file.type || '').startsWith('video/')) return 'video';
    if (/\.(mp4|webm|mov|m4v|ogv)$/i.test(file.name || '')) return 'video';
    return 'image';
  }

  /* Playback ceiling floor: 2 seconds is the fastest a clip can be set to
     stop. Any positive value typed below it ("1", "0:01") is raised to 2 so
     the setting always lands on a working pace — 0 still means "no limit,
     loop as normal", and blank still clears the ceiling. */
  const MIN_PLAYBACK_SECONDS = 2;

  /* Duration for a video upload. Accepts plain seconds ("15", "90") or a
     mm:ss shorthand ("1:30"); anything invalid or empty becomes 0 (no limit),
     and any positive value below MIN_PLAYBACK_SECONDS is raised to it. */
  function parseDuration(value) {
    const text = String(value || '').trim();
    if (!text) return 0;
    let seconds;
    const mmss = text.match(/^(\d{1,3}):(\d{1,2})$/);
    if (mmss) {
      const mins = Number(mmss[1]);
      const secs = Number(mmss[2]);
      if (secs > 59) return 0;
      seconds = mins * 60 + secs;
    } else {
      const sec = Number(text);
      seconds = (Number.isFinite(sec) && sec >= 0) ? Math.round(sec) : 0;
    }
    if (seconds > 0 && seconds < MIN_PLAYBACK_SECONDS) seconds = MIN_PLAYBACK_SECONDS;
    return seconds;
  }

  function formatDuration(seconds) {
    const s = Number(seconds) || 0;
    if (s <= 0) return '';
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return mins > 0 ? `${mins}:${String(secs).padStart(2, '0')}` : String(secs);
  }

  // Small badge shown on a video card when a playback ceiling is set.
  function durationBadge(duration) {
    const label = formatDuration(duration);
    return label ? `<span class="media-duration-badge" title="Video stops after ${label}">${label}</span>` : '';
  }

  /* Inline playback-time field on EVERY media-library video tile — same rule
     as the leadership portraits: seconds ("15") or mm:ss ("1:30"), blank
     clears the ceiling so the clip loops as normal. */
  function playbackTimeField(id, duration) {
    return `<label class="crm-media-duration-tile" title="Set how long the video plays before it stops (2 s minimum)">
      <span>Playback time</span>
      <input type="text" inputmode="numeric" placeholder="e.g. 0:15" value="${escapeHtml(formatDuration(duration))}" data-media-duration="${escapeHtml(id)}" aria-label="Video playback time">
    </label>`;
  }

  // Show the duration field only when a video is being added or edited.
  function refreshDurationField() {
    if (!mediaDurationField) return;
    const isVideo = stagedFile
      ? stagedFile.type === 'video'
      : !!(editingMediaId && ((window.KhaqanMedia.get().find((m) => m.id === editingMediaId) || {}).type === 'video'));
    mediaDurationField.hidden = !isVideo;
    refreshCopyFields();
  }

  const slotKeyOf = (section, area, slot) => (section && area && slot ? `${section}:${area}:${slot}` : '');

  /* The wording fields only make sense for a named slot (the reel frame, a
     gallery still, a portrait tile…) — a gallery holds many files and has no
     fixed text of its own, so the row hides itself there. */
  function refreshCopyFields(selectedSlot) {
    if (!mediaCopyRow) return;
    const { section, area } = readPlacementFromForm();
    const slot = selectedSlot !== undefined ? selectedSlot : (mediaSlot && !mediaSlot.hidden ? mediaSlot.value : '');
    const visible = !!(mediaSlot && !mediaSlot.hidden && slot);
    mediaCopyRow.hidden = !visible;
    if (!visible) return;
    const key = slotKeyOf(section, area, slot);
    const entry = window.KhaqanSlotCopy ? window.KhaqanSlotCopy.get(key) : null;
    const defaults = (window.KhaqanSlotCopy && window.KhaqanSlotCopy.defaults(key)) || {};
    if (mediaCaption) {
      mediaCaption.value = entry && entry.caption ? entry.caption : '';
      mediaCaption.placeholder = defaults.slot ? `Current on site: ${defaults.slot}` : 'Caption line (optional)';
    }
    if (mediaHeading) mediaHeading.value = entry && entry.heading ? entry.heading : '';
    if (mediaTile) mediaTile.value = entry && entry.tile ? entry.tile : '';
  }

  // Persist the wording typed in the upload form for the chosen slot.
  function writeFormSlotCopy(section, area, slot) {
    const key = slotKeyOf(section, area, slot);
    if (!key || !mediaCopyRow || mediaCopyRow.hidden || !window.KhaqanSlotCopy) return '';
    const values = {
      caption: mediaCaption ? mediaCaption.value : '',
      heading: mediaHeading ? mediaHeading.value : '',
      tile: mediaTile ? mediaTile.value : ''
    };
    const blank = Object.keys(values).every((field) => !String(values[field] || '').trim());
    if (blank && !window.KhaqanSlotCopy.get(key)) return key;
    window.KhaqanSlotCopy.set(key, values);
    queueSettingsForCloud();
    renderCopyForm();
    return key;
  }

  function isGalleryArea(area) {
    return !area || area.kind === 'gallery' || area.id === 'gallery' || area.id === 'library';
  }

  function fillPageSelect(selected) {
    if (!mediaPage) return;
    const pages = (place() && place().pages()) || [];
    mediaPage.innerHTML = pages.map((p) => `<option value="${escapeHtml(p.id)}">${escapeHtml(p.label)}</option>`).join('');
    mediaPage.value = selected || 'home';
    if (!mediaPage.value) mediaPage.value = pages[0] ? pages[0].id : 'home';
  }

  function fillAreaSelect(pageId, selected) {
    if (!mediaArea) return;
    const areas = (place() && place().areasOf(pageId)) || [];
    mediaArea.innerHTML = areas.map((a) => `<option value="${escapeHtml(a.id)}">${escapeHtml(a.label)}</option>`).join('');
    mediaArea.value = selected || (areas[0] && areas[0].id) || 'gallery';
    if (!mediaArea.value && areas[0]) mediaArea.value = areas[0].id;
  }

  function fillSlotSelect(pageId, areaId, selected) {
    if (!mediaSlot) return;
    const area = place() && place().areaMeta(pageId, areaId);
    const slots = (area && area.slots) || [];
    if (!slots.length) {
      mediaSlot.hidden = true;
      mediaSlot.innerHTML = '';
      mediaSlot.value = '';
      refreshCopyFields('');
      return;
    }
    mediaSlot.hidden = false;
    mediaSlot.innerHTML = slots.map((s) => `<option value="${escapeHtml(s.id)}">${escapeHtml(s.label)}</option>`).join('');
    mediaSlot.value = selected || slots[0].id;
    if (!mediaSlot.value) mediaSlot.value = slots[0].id;
    refreshCopyFields(mediaSlot.value);
  }

  function syncPlacementSelects(pageId, areaId, slotId) {
    fillPageSelect(pageId);
    fillAreaSelect(mediaPage.value, areaId);
    fillSlotSelect(mediaPage.value, mediaArea.value, slotId);
  }

  function readPlacementFromForm() {
    const section = (mediaPage && mediaPage.value) || 'home';
    const area = (mediaArea && mediaArea.value) || 'gallery';
    const slot = mediaSlot && !mediaSlot.hidden ? (mediaSlot.value || '') : '';
    return { section, area, slot };
  }

  function placementLabel(item) {
    return place() ? place().label(item) : { page: item.section || '', area: item.area || '', slot: item.slot || '', href: '', text: item.section || '' };
  }

  function renderFilters() {
    if (!mediaFilters) return;
    const pages = (place() && place().pages()) || [];
    const chips = [{ id: 'all', label: 'All pages' }].concat(pages);
    mediaFilters.innerHTML = chips.map((p) => `<button class="crm-media-filter${pageFilter === p.id ? ' active' : ''}" type="button" data-page-filter="${escapeHtml(p.id)}" role="tab" aria-selected="${pageFilter === p.id ? 'true' : 'false'}">${escapeHtml(p.label)}</button>`).join('');
  }

  function mediaVisual(url, title, type) {
    if (type === 'video') return `<video controls muted preload="metadata"><source src="${escapeHtml(url)}"></video>`;
    return `<img src="${escapeHtml(url)}" alt="${escapeHtml(title || '')}" loading="lazy">`;
  }

  function cardActions({ id, replaceKey, canEdit, canRemove, canDelete, replaceLabel }) {
    const rid = id ? escapeHtml(id) : '';
    const key = replaceKey ? escapeHtml(replaceKey) : '';
    const fileId = `media-replace-${rid || key.replace(/[^a-z0-9]+/gi, '-')}`;
    return `<div class="media-item-actions">
      ${canEdit && id ? `<button class="media-edit" type="button" data-media-edit="${rid}">Edit</button>` : ''}
      <label class="media-replace" for="${fileId}">${escapeHtml(replaceLabel || 'Replace')}<input id="${fileId}" type="file" accept="image/*,video/*" ${id ? `data-media-replace="${rid}"` : ''} ${key ? `data-slot-replace="${key}"` : ''} hidden></label>
      ${canRemove && id ? `<button class="media-unplace" type="button" data-media-unplace="${rid}">Remove</button>` : ''}
      ${canDelete && id ? `<button class="media-remove" type="button" data-media-delete="${rid}" aria-label="Delete media">Delete</button>` : ''}
    </div>`;
  }

  function placeMetaHtml(ref, customised) {
    const slot = ref.slot ? `<em>${escapeHtml(ref.slot)}</em>` : '';
    /* A frame can carry wording edited in the Control Room even when nobody
       uploaded a file for it — the badge says the text is not the default. */
    const flag = customised ? '<i class="media-copy-flag" title="This spot has custom wording (Headings, captions & tiles)">custom wording</i>' : '';
    const link = ref.href
      ? `<a class="media-page-link" href="${escapeHtml(ref.href)}" target="_blank" rel="noreferrer">Open ${escapeHtml(ref.page)}</a>`
      : '';
    return `<span class="media-place"><b>${escapeHtml(ref.page)}</b><span>${escapeHtml(ref.area)}</span>${slot}${flag}</span>${link}`;
  }

  function galleryCards(items) {
    return items.map((m) => {
      const ref = placementLabel(m);
      return `<article data-media-id="${escapeHtml(m.id)}" class="has-override">
        ${mediaVisual(m.url, m.title, m.type)}
        <div><span class="media-kind">${m.type === 'video' ? 'Video' : 'Image'}</span>${durationBadge(m.duration)}<strong>${escapeHtml(m.title)}</strong>${placeMetaHtml(ref)}${m.type === 'video' ? playbackTimeField(m.id, m.duration) : ''}</div>
        ${cardActions({ id: m.id, canEdit: true, canRemove: m.section !== 'general', canDelete: true, replaceLabel: 'Replace' })}
      </article>`;
    }).join('');
  }

  function slotCards(pageId, area, items) {
    return (area.slots || []).map((slot) => {
      const override = place() ? place().occupant(items, pageId, area.id, slot.id) : null;
      const key = `${pageId}:${area.id}:${slot.id}`;
      const customised = hasCopy(key);
      const url = override ? override.url : slot.defaultSrc;
      const type = override ? override.type : (/\.(webm|mp4|mov)$/i.test(slot.defaultSrc || '') ? 'video' : 'image');
      const ref = {
        page: (place() && place().pageMeta(pageId).label) || pageId,
        area: area.label,
        slot: slot.label,
        href: (place() && place().pageMeta(pageId).href) || ''
      };
      return `<article class="${override ? 'has-override' : 'is-default'}" ${override ? `data-media-id="${escapeHtml(override.id)}"` : ''} data-slot-key="${escapeHtml(key)}">
        ${mediaVisual(url, slot.label, type)}
        <div><span class="media-kind">${override ? 'Live on page' : 'Stock on page'}</span>${durationBadge(override && override.duration)}<strong>${escapeHtml(override ? (override.title || slot.label) : slot.label)}</strong>${placeMetaHtml(ref, customised)}${override && override.type === 'video' ? playbackTimeField(override.id, override.duration) : ''}</div>
        ${cardActions({
          id: override && override.id,
          replaceKey: key,
          canEdit: !!override,
          canRemove: !!override,
          canDelete: !!override,
          replaceLabel: override ? 'Replace' : 'Replace stock'
        })}
      </article>`;
    }).join('');
  }

  function renderMedia() {
    const allItems = window.KhaqanMedia ? window.KhaqanMedia.get() : [];
    updateMediaMetric();
    renderFilters();
    if (!mediaBoard) return;
    const search = (mediaSearch?.value || '').toLowerCase().trim();
    const pages = (place() && place().pages()) || [];
    const visiblePages = pageFilter === 'all' ? pages : pages.filter((p) => p.id === pageFilter);
    const matchesSearch = (text) => !search || String(text || '').toLowerCase().includes(search);

    const blocks = [];
    visiblePages.forEach((page) => {
      const areas = (place() && place().areasOf(page.id)) || [];
      const pageItems = allItems.filter((m) => {
        if (place() && place().isTeam(m)) return false;
        return place() ? place().pageOf(m) === page.id : m.section === page.id;
      });
      const areaBlocks = [];
      areas.forEach((area) => {
        if (isGalleryArea(area)) {
          const items = pageItems.filter((m) => {
            const areaId = place() ? place().areaOf(m) : (m.area || 'gallery');
            if (page.id === 'general') {
              if (m.section !== 'general' && areaId !== 'library') return false;
            } else if (areaId !== 'gallery' && areaId !== '') {
              return false;
            }
            const ref = placementLabel(m);
            return matchesSearch([m.title, ref.text, ref.page, ref.area].join(' '));
          });
          if (!items.length && search) return;
          areaBlocks.push(`<div class="crm-media-area"><div class="crm-media-area-head"><h4>${escapeHtml(area.label)}</h4><small>Gallery · ${items.length} file${items.length === 1 ? '' : 's'}</small></div><div class="crm-media-grid managed">${items.length ? galleryCards(items) : '<p class="crm-media-area-empty">Nothing in this gallery yet.</p>'}</div></div>`);
        } else {
          const slots = area.slots || [];
          const filteredSlots = slots.filter((slot) => {
            if (!search) return true;
            const override = place() && place().occupant(pageItems, page.id, area.id, slot.id);
            return matchesSearch([slot.label, area.label, page.label, override && override.title].join(' '));
          });
          if (!filteredSlots.length) return;
          const areaForCards = { ...area, slots: filteredSlots };
          areaBlocks.push(`<div class="crm-media-area"><div class="crm-media-area-head"><h4>${escapeHtml(area.label)}</h4><small>Page area · ${slots.length} slot${slots.length === 1 ? '' : 's'}</small></div><div class="crm-media-grid managed">${slotCards(page.id, areaForCards, pageItems)}</div></div>`);
        }
      });
      if (!areaBlocks.length) return;
      const href = page.href ? `<a class="text-link" href="${escapeHtml(page.href)}" target="_blank" rel="noreferrer">Open page</a>` : '';
      blocks.push(`<section class="crm-media-page" data-media-page="${escapeHtml(page.id)}"><div class="crm-media-page-head"><div><span class="eyebrow">${escapeHtml(page.id)}</span><h3>${escapeHtml(page.label)}</h3></div>${href}</div>${areaBlocks.join('')}</section>`);
    });

    mediaBoard.innerHTML = blocks.join('');
    const hasCards = !!mediaBoard.querySelector('article');
    if (mediaEmpty) mediaEmpty.style.display = hasCards ? 'none' : 'block';
  }

  function resetMediaForm() {
    editingMediaId = null;
    stagedFile = null;
    if (mediaForm) mediaForm.reset();
    syncPlacementSelects(pageFilter !== 'all' ? pageFilter : 'home', 'gallery', '');
    if (mediaSubmit) mediaSubmit.textContent = 'Add to library';
    if (mediaEditCancel) mediaEditCancel.hidden = true;
    if (mediaFormEyebrow) mediaFormEyebrow.textContent = 'Add media';
    if (mediaFormTitle) mediaFormTitle.textContent = 'Upload an image or video';
    if (imageFileInput) imageFileInput.closest('.file-label')?.classList.remove('has-file');
    if (videoFileInput) videoFileInput.closest('.file-label')?.classList.remove('has-file');
    if (videoDurationInput) videoDurationInput.value = '';
    if (mediaDurationField) mediaDurationField.hidden = true;
  }

  function validateFileSize(file) {
    const remote = cloudAdmin();
    if (!remote && file.size > MAX_MEDIA_BYTES) {
      flashStatus('That file is over 12 MB — compress it or sign in to Supabase storage for large originals.', false);
      return false;
    }
    if (remote && file.size > MAX_CLOUD_BYTES) {
      flashStatus('That file is over 50 MB — compress it before uploading to storage.', false);
      return false;
    }
    return true;
  }

  async function stageFile(input, type) {
    const file = input.files && input.files[0];
    if (!file) return;
    if (!validateFileSize(file)) { input.value = ''; return; }
    try {
      const remote = cloudAdmin();
      let url = '';
      if (!remote || file.size <= MAX_MEDIA_BYTES) url = await readFileAsDataURL(file);
      else url = URL.createObjectURL(file); // preview only; the original file is queued at save time
      stagedFile = { type, url, name: file.name, file };
      const label = input.closest('.file-label');
      if (label) label.classList.add('has-file');
      const other = type === 'video' ? imageFileInput : videoFileInput;
      if (other && other.files && other.files.length) { other.value = ''; other.closest('.file-label')?.classList.remove('has-file'); }
      if (!editingMediaId && mediaTitle && !mediaTitle.value.trim()) {
        mediaTitle.value = file.name.replace(/\.[^.]+$/, '').replace(/[-_]+/g, ' ');
      }
      if (type === 'image' && videoDurationInput) videoDurationInput.value = '';
      refreshDurationField();
    } catch (error) {
      flashStatus('That file could not be read.', false);
    }
  }

  async function retireOccupants(section, area, slot, keepId, cloud) {
    if (!area || area === 'gallery' || area === 'library') return;
    const wantSlot = String(slot || '1');
    const stale = window.KhaqanMedia.get().filter((m) => {
      if (m.id === keepId) return false;
      if (m.section !== section) return false;
      if ((m.area || 'gallery') !== area) return false;
      return (m.slot || '1') === wantSlot;
    });
    for (const item of stale) {
      try {
        if (cloud) await cloud.deleteMedia(item.id, item.storagePath);
        else window.KhaqanMedia.remove(item.id);
      } catch (error) {
        window.KhaqanMedia.remove(item.id);
      }
    }
  }

  function applyLocalMediaChange(title, section, area, slot, existingId, duration, localId) {
    const id = existingId || editingMediaId || localId;
    const patch = { title, section, area, slot };
    const durationNum = parseDuration(duration != null ? duration : (videoDurationInput && videoDurationInput.value));
    if (durationNum > 0) patch.duration = durationNum;
    else if (id) patch.duration = 0;
    if (stagedFile) { patch.url = stagedFile.url; patch.type = stagedFile.type; }
    if (id) return window.KhaqanMedia.update(id, patch);
    const entry = window.KhaqanMedia.add({ id: localId, type: stagedFile ? stagedFile.type : 'image', title, section, area, slot, duration: durationNum, url: stagedFile ? stagedFile.url : '' });
    return entry;
  }

  async function persistMedia({ title, section, area, slot, file, type, existing, duration, localId }) {
    const cloud = cloudAdmin();
    const id = existing && existing.id;
    const durationNum = parseDuration(duration != null ? duration : (videoDurationInput && videoDurationInput.value));
    if (cloud) {
      if (id) {
        await cloud.updateMedia(id, {
          title, section, area, slot, duration: durationNum,
          file: file || undefined,
          type: type || undefined,
          storagePath: existing.storagePath
        });
      } else {
        if (!file) throw new Error('Choose an image or video file first.');
        await cloud.uploadMedia({ file, title, section, area, slot, type, duration: durationNum });
      }
      await refreshMediaFromCloud();
      const keep = (window.KhaqanMedia.get() || []).find((m) => m.section === section && (m.area || 'gallery') === area && (m.slot || '') === (slot || '') && (area === 'gallery' || area === 'library' ? m.title === title : true));
      const keepId = (area !== 'gallery' && area !== 'library')
        ? ((place() && place().occupant(window.KhaqanMedia.get(), section, area, slot || '1')) || {}).id
        : (keep && keep.id);
      await retireOccupants(section, area, slot, keepId || id, cloud);
      await refreshMediaFromCloud();
      return;
    }
    if (id) {
      const patch = { title, section, area, slot, duration: durationNum };
      if (file && stagedFile && stagedFile.url) { patch.url = stagedFile.url; patch.type = stagedFile.type || type; }
      else if (file) {
        const url = await readFileAsDataURL(file);
        patch.url = url;
        patch.type = type || fileKind(file);
      }
      window.KhaqanMedia.update(id, patch);
    } else {
      const url = (stagedFile && stagedFile.url) || (file ? await readFileAsDataURL(file) : '');
      if (!url) throw new Error('Choose an image or video file first.');
      window.KhaqanMedia.add({ type: type || (stagedFile && stagedFile.type) || 'image', title, section, area, slot, duration: durationNum, url });
    }
    const keep = place() && area !== 'gallery' && area !== 'library'
      ? place().occupant(window.KhaqanMedia.get(), section, area, slot || '1')
      : null;
    await retireOccupants(section, area, slot, keep && keep.id, null);
  }

  async function submitMedia(event) {
    event.preventDefault();
    if (!window.KhaqanMedia) return;
    const { section, area, slot } = readPlacementFromForm();
    const title = (mediaTitle?.value.trim()) || stagedFile?.name?.replace(/\.[^.]+$/, '') || 'Untitled';
    if (!editingMediaId && !stagedFile) {
      /* No file chosen: if the wording boxes were used, that IS the edit — a
         heading or tile label can be published on a slot on its own, which is
         what the stock frames were missing. */
      const wantsCopy = mediaCopyRow && !mediaCopyRow.hidden &&
        [mediaCaption, mediaHeading, mediaTile].some((input) => input && input.value.trim());
      if (wantsCopy) {
        writeFormSlotCopy(section, area, slot);
        resetMediaForm();
        renderMedia();
        flashStatus('Wording saved for that frame — no new file was needed.');
        return;
      }
      flashStatus('Choose an image or video file first.', false);
      return;
    }
    const existing = editingMediaId ? window.KhaqanMedia.get().find((m) => m.id === editingMediaId) : null;
    const duration = videoDurationInput ? videoDurationInput.value : '';
    /* The browser-side id is fixed before the cloud call so a failed upload can
       be queued under the SAME id the local copy is written with — nothing is
       orphaned or duplicated when the queue retries. */
    const localId = (existing && existing.id) || `media-${Date.now()}-${Math.floor(Math.random() * 1e6)}`;
    try {
      await persistMedia({
        title, section, area, slot, duration, localId,
        file: stagedFile && stagedFile.file,
        type: stagedFile ? stagedFile.type : undefined,
        existing
      });
      flashStatus(editingMediaId
        ? 'Media updated — the website reflects the page and area immediately.'
        : 'Media published to the selected page and page area.');
    } catch (error) {
      if ((stagedFile && stagedFile.url) || (editingMediaId && !stagedFile)) {
        const savedId = applyLocalMediaChange(title, section, area, slot, null, duration, localId);
        if (savedId) queueMediaFor(savedId, stagedFile && stagedFile.file);
        flashStatus('Saved in this browser and queued for the live site — it will sync automatically.', false);
      } else {
        flashStatus(error.message || 'That media could not be saved.', false);
        return;
      }
    }
    /* The wording typed beside the upload lands in the same slot's copy entry,
       so a file and its heading can be published in one action. */
    writeFormSlotCopy(section, area, slot);
    resetMediaForm();
    renderMedia();
    renderPortraits();
    updateMediaMetric();
    renderAllMedia();
  }

  function startEditMedia(id) {
    const item = (window.KhaqanMedia ? window.KhaqanMedia.get() : []).find((m) => m.id === id);
    if (!item) return;
    editingMediaId = id;
    stagedFile = null;
    if (mediaTitle) mediaTitle.value = item.title || '';
    const pageId = place() ? place().pageOf(item) : (item.section || 'home');
    const areaId = place() ? place().areaOf(item) : (item.area || 'gallery');
    const slotId = place() ? place().slotOf(item) : (item.slot || '');
    syncPlacementSelects(pageId, areaId, slotId);
    if (imageFileInput) { imageFileInput.value = ''; imageFileInput.closest('.file-label')?.classList.remove('has-file'); }
    if (videoFileInput) { videoFileInput.value = ''; videoFileInput.closest('.file-label')?.classList.remove('has-file'); }
    if (videoDurationInput) videoDurationInput.value = item.type === 'video' ? formatDuration(item.duration) : '';
    refreshDurationField();
    if (mediaSubmit) mediaSubmit.textContent = 'Save changes';
    if (mediaEditCancel) mediaEditCancel.hidden = false;
    if (mediaFormEyebrow) mediaFormEyebrow.textContent = 'Edit media';
    if (mediaFormTitle) mediaFormTitle.textContent = 'Edit title, page, page area or replace file';
    mediaForm?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    mediaTitle?.focus({ preventScroll: false });
  }

  /* Take an item off the website but keep it in the library. Only a row that
     really exists in Supabase is patched there — a browser-only upload has no
     remote row, and PATCHing its `media-…` id used to throw on the UUID column
     before falling back to a local write. */
  async function unplaceMedia(id) {
    if (!window.KhaqanMedia) return false;
    const item = window.KhaqanMedia.get().find((m) => m.id === id);
    if (!item) return false;
    if (editingMediaId === id) resetMediaForm();
    const ref = placementLabel(item);
    const ok = await askConfirm({
      title: 'Remove this from the website?',
      body: `${item.title} — currently on ${ref.text || 'the website'}.\nThe file stays in the library and the stock photograph in that slot returns.`,
      confirm: 'Remove from website',
      danger: false
    });
    if (!ok) return false;
    const cloud = cloudAdmin();
    const patch = { section: 'general', area: 'library', slot: '' };
    try {
      if (cloud && window.KhaqanMedia.isRemoteId(id)) {
        await cloud.updateMedia(id, { title: item.title, ...patch, storagePath: item.storagePath });
        await refreshMediaFromCloud();
      } else {
        window.KhaqanMedia.update(id, patch);
        queueMediaFor(id);
      }
    } catch (error) {
      window.KhaqanMedia.update(id, patch);
      queueMediaFor(id);
      flashStatus('Removed in this browser and queued for the live site — it will sync automatically.', false);
      renderMedia(); renderPortraits(); updateMediaMetric(); renderAllMedia();
      return true;
    }
    renderMedia(); renderPortraits(); updateMediaMetric(); renderAllMedia();
    flashStatus('Media removed from the website. It is still in Library only.');
    return true;
  }

  /* Permanent delete: the catalogue row, the file in the Supabase `media`
     bucket, the browser copy and anything still queued for the item. The order
     matters — the cloud is asked first so a refusal is reported instead of a
     card that quietly comes back on the next refresh. */
  async function deleteMediaItem(id, { confirm: withConfirm = true } = {}) {
    if (!window.KhaqanMedia) return false;
    const item = window.KhaqanMedia.get().find((m) => m.id === id);
    if (!item) return false;
    if (editingMediaId === id) resetMediaForm();
    const ref = placementLabel(item);
    const storageLine = item.storagePath
      ? `The file is also removed from the Supabase \`media\` bucket: ${item.storagePath}`
      : 'This upload is held in this browser only, so there is no file in cloud storage to remove.';
    if (withConfirm) {
      const ok = await askConfirm({
        title: 'Permanently delete this media?',
        body: `${item.title} — on ${ref.text || 'the website'}.\n${storageLine}\nAny stock photograph that was in that slot returns to the page.`,
        confirm: 'Delete for good'
      });
      if (!ok) return false;
    }
    const cloud = cloudAdmin();
    let storageWarning = '';
    let cloudError = '';
    if (cloud) {
      try {
        const result = await cloud.deleteMedia(id, item.storagePath);
        if (result && result.storageAttempted && !result.storageRemoved) {
          storageWarning = ` The website copy is gone, but the file stayed in storage (${result.storageError || 'Storage refused the delete'}) — “Purge orphaned files” in All media removes it.`;
        }
      } catch (error) {
        cloudError = error.message || 'Supabase refused the delete.';
      }
    }
    /* Removes the local row and settles the queue: a pending upload for this id
       is dropped (so it cannot resurrect the item) and, when the row is cloud
       backed, the delete is queued for retry if we are offline. */
    window.KhaqanMedia.remove(id);
    renderMedia();
    renderPortraits();
    updateMediaMetric();
    renderAllMedia();
    /* A library that has outgrown the browser's storage quota cannot be
       written at all — say so here instead of letting the card reappear later. */
    const persist = window.KhaqanMedia.persistError && window.KhaqanMedia.persistError();
    const note = persist ? ` Warning: ${persist.message}` : '';
    if (cloudError) {
      flashStatus(`Deleted in this browser and queued for the live site — ${cloudError}${note}`, false);
    } else if (cloud) {
      flashStatus(`Media deleted — the library row, the bucket file and the website were all cleared.${storageWarning}${note}`, !storageWarning && !persist);
    } else {
      flashStatus(`Media deleted from this browser${item.storagePath ? ' and queued for the live site' : ' (there is no cloud copy to remove — sign in to delete files from storage)'}.${note}`, !persist);
    }
    return true;
  }

  async function replaceFromCard(file, mediaId, slotKey) {
    if (!file || !window.KhaqanMedia) return;
    if (!validateFileSize(file)) return;
    const type = fileKind(file);
    const titleFromFile = file.name.replace(/\.[^.]+$/, '').replace(/[-_]+/g, ' ');
    let existing = mediaId ? window.KhaqanMedia.get().find((m) => m.id === mediaId) : null;
    let section = 'home';
    let area = 'gallery';
    let slot = '';
    let title = titleFromFile;
    if (existing) {
      section = existing.section || 'home';
      area = existing.area || 'gallery';
      slot = existing.slot || '';
      title = existing.title || titleFromFile;
    } else if (slotKey) {
      const parts = String(slotKey).split(':');
      section = parts[0] || 'home';
      area = parts[1] || 'gallery';
      slot = parts[2] || '1';
      const meta = place() && place().slotMeta(section, area, slot);
      title = (meta && meta.label) || titleFromFile;
      existing = place() && place().occupant(window.KhaqanMedia.get(), section, area, slot);
    }
    try {
      const remote = cloudAdmin();
      let url = '';
      if (!remote || file.size <= MAX_MEDIA_BYTES) url = await readFileAsDataURL(file);
      else url = URL.createObjectURL(file); // preview only; the real file is queued
      stagedFile = { type, url, name: file.name, file };
      await persistMedia({ title, section, area, slot, file, type, duration: existing ? existing.duration : 0, existing: existing || null });
      stagedFile = null;
      flashStatus('Media replaced on the selected page area.');
    } catch (error) {
      try {
        const url = file.size <= MAX_MEDIA_BYTES ? await readFileAsDataURL(file) : URL.createObjectURL(file);
        const localId = (existing && existing.id) || `media-${Date.now()}-${Math.floor(Math.random() * 1e6)}`;
        stagedFile = { type, url, name: file.name, file };
        const savedId = applyLocalMediaChange(title, section, area, slot, existing && existing.id, existing ? existing.duration : 0, localId);
        stagedFile = null;
        if (savedId) queueMediaFor(savedId, file);
        flashStatus('Replaced in this browser and queued for the live site — it will sync automatically.', false);
      } catch (localError) {
        flashStatus(error.message || 'That file could not be saved.', false);
        stagedFile = null;
        return;
      }
    }
    renderMedia();
    renderPortraits();
    updateMediaMetric();
  }

  imageFileInput?.addEventListener('change', () => stageFile(imageFileInput, 'image'));
  videoFileInput?.addEventListener('change', () => stageFile(videoFileInput, 'video'));
  mediaForm?.addEventListener('submit', submitMedia);
  mediaEditCancel?.addEventListener('click', resetMediaForm);
  mediaPage?.addEventListener('change', () => {
    fillAreaSelect(mediaPage.value);
    fillSlotSelect(mediaPage.value, mediaArea.value);
  });
  mediaArea?.addEventListener('change', () => fillSlotSelect(mediaPage.value, mediaArea.value));
  mediaSlot?.addEventListener('change', () => refreshCopyFields());
  mediaFilters?.addEventListener('click', (event) => {
    const button = event.target.closest('[data-page-filter]');
    if (!button) return;
    pageFilter = button.dataset.pageFilter || 'all';
    renderMedia();
  });
  mediaSearch?.addEventListener('input', renderMedia);

  mediaBoard?.addEventListener('click', (event) => {
    const editButton = event.target.closest('[data-media-edit]');
    if (editButton) { startEditMedia(editButton.dataset.mediaEdit); return; }
    const unplaceButton = event.target.closest('[data-media-unplace]');
    if (unplaceButton) { unplaceMedia(unplaceButton.dataset.mediaUnplace); return; }
    const deleteButton = event.target.closest('[data-media-delete]');
    if (deleteButton) { deleteMediaItem(deleteButton.dataset.mediaDelete); }
  });
  mediaBoard?.addEventListener('change', (event) => {
    // Playback time typed on a video tile — saved without re-uploading.
    const durationInput = event.target.closest('[data-media-duration]');
    if (durationInput) {
      const id = durationInput.dataset.mediaDuration;
      const item = window.KhaqanMedia ? window.KhaqanMedia.get().find((m) => m.id === id) : null;
      if (item) updateMediaDuration(item, parseDuration(durationInput.value), item.title || 'Media', durationInput);
      return;
    }
    const input = event.target.closest('[data-media-replace], [data-slot-replace]');
    if (!input || !input.files || !input.files[0]) return;
    replaceFromCard(input.files[0], input.dataset.mediaReplace, input.dataset.slotReplace);
    input.value = '';
  });

  /* =====================================================================
     Headings, captions & tile labels — re-word any part of a public page
     (or one named frame inside it) without touching HTML. Stored in the
     `slotCopy` map of the site settings, so it saves, queues and syncs with
     everything else the Control Room owns.
     ===================================================================== */
  const copyPage = query('#copy-page');
  const copyArea = query('#copy-area');
  const copySlot = query('#copy-slot');
  const copyEyebrow = query('#copy-eyebrow');
  const copyHeading = query('#copy-heading');
  const copyText = query('#copy-text');
  const copyCaption = query('#copy-caption');
  const copyFrameHeading = query('#copy-frame-heading');
  const copyTile = query('#copy-tile');
  const copyLabel = query('#copy-key-label');
  const copyHeadFields = query('#copy-head-fields');
  const copyFrameFields = query('#copy-frame-fields');
  const copyCount = query('#copy-active-count');
  const copyForm = query('#slot-copy-form');
  const copyClear = query('#copy-clear');
  const copyLink = query('#copy-open-link');

  const hasCopy = (key) => !!(window.KhaqanSlotCopy && window.KhaqanSlotCopy.get(key));
  const copyTick = (key) => (hasCopy(key) ? '• ' : '');

  function fillCopyPageSelect(selected) {
    if (!copyPage) return;
    const pages = ((place() && place().pages()) || []).filter((p) => p.id !== 'general');
    copyPage.innerHTML = pages.map((p) => `<option value="${escapeHtml(p.id)}">${escapeHtml(p.label)}</option>`).join('');
    copyPage.value = selected || 'home';
    if (!copyPage.value) copyPage.value = pages[0].id;
  }

  function fillCopyAreaSelect(pageId, selected) {
    if (!copyArea) return;
    const areas = (place() && place().areasOf(pageId)) || [];
    copyArea.innerHTML = areas.map((area) => {
      const key = `${pageId}:${area.id}`;
      return `<option value="${escapeHtml(area.id)}">${escapeHtml(copyTick(key) + area.label)}</option>`;
    }).join('');
    copyArea.value = selected || (areas[0] && areas[0].id) || 'gallery';
  }

  function fillCopySlotSelect(pageId, areaId, selected) {
    if (!copySlot) return;
    const area = (place() && place().areaMeta(pageId, areaId)) || null;
    const slots = (area && area.slots) || [];
    const headLabel = area && area.kind === 'gallery' ? 'Section head (gallery intro)' : 'Section head (heading & intro)';
    const options = [`<option value="">${escapeHtml(headLabel)}</option>`].concat(slots.map((slot) => {
      const key = `${pageId}:${areaId}:${slot.id}`;
      return `<option value="${escapeHtml(slot.id)}">${escapeHtml(copyTick(key) + slot.label)}</option>`;
    }));
    copySlot.innerHTML = options.join('');
    copySlot.value = selected || '';
  }

  function copyKey() {
    if (!copyPage || !copyArea) return '';
    const slot = copySlot ? copySlot.value : '';
    return slot ? `${copyPage.value}:${copyArea.value}:${slot}` : `${copyPage.value}:${copyArea.value}`;
  }

  function renderCopyForm() {
    if (!copyPage || !copyArea || !copySlot) return;
    fillCopyPageSelect(copyPage.value);
    fillCopyAreaSelect(copyPage.value, copyArea.value);
    fillCopySlotSelect(copyPage.value, copyArea.value, copySlot.value);
    const key = copyKey();
    const entry = window.KhaqanSlotCopy ? window.KhaqanSlotCopy.get(key) : null;
    const isFrame = !!copySlot.value;
    const defaults = (window.KhaqanSlotCopy && window.KhaqanSlotCopy.defaults(key)) || {};
    if (copyHeadFields) copyHeadFields.hidden = isFrame;
    if (copyFrameFields) copyFrameFields.hidden = !isFrame;
    if (copyEyebrow) { copyEyebrow.value = entry ? entry.eyebrow || '' : ''; copyEyebrow.placeholder = 'Leave blank to keep the wording on the page'; }
    if (copyHeading) { copyHeading.value = entry ? entry.heading || '' : ''; copyHeading.placeholder = 'Leave blank to keep the wording on the page'; }
    if (copyText) { copyText.value = entry ? entry.text || '' : ''; copyText.placeholder = 'Leave blank to keep the wording on the page'; }
    if (copyCaption) { copyCaption.value = entry ? entry.caption || '' : ''; copyCaption.placeholder = defaults.slot ? `On the site now: ${defaults.slot}` : 'Small line above the heading'; }
    if (copyFrameHeading) { copyFrameHeading.value = entry ? entry.heading || '' : ''; copyFrameHeading.placeholder = 'Leave blank to keep the wording on the page'; }
    if (copyTile) { copyTile.value = entry ? entry.tile || '' : ''; copyTile.placeholder = defaults.slot ? `On the tile now: ${defaults.slot}` : 'Label on the tile beside the reel'; }
    const page = place() ? place().pageMeta(copyPage.value) : {};
    const area = (place() && place().areaMeta(copyPage.value, copyArea.value)) || {};
    const slot = copySlot.value ? ((place() && place().slotMeta(copyPage.value, copyArea.value, copySlot.value)) || {}) : null;
    if (copyLabel) {
      copyLabel.textContent = [page.label, area.label, slot ? slot.label : ''].filter(Boolean).join(' · ');
    }
    if (copyLink) {
      copyLink.href = page.href || '#';
      copyLink.hidden = !page.href;
    }
    if (copyCount) {
      const total = window.KhaqanSlotCopy ? window.KhaqanSlotCopy.count() : 0;
      copyCount.textContent = total ? `${total} spot${total === 1 ? '' : 's'} customised` : 'All default wording';
    }
  }

  function saveCopyForm(event) {
    event.preventDefault();
    if (!window.KhaqanSlotCopy) return;
    const key = copyKey();
    if (!key) return;
    const isFrame = !!copySlot.value;
    const values = isFrame
      ? { caption: copyCaption.value, heading: copyFrameHeading.value, tile: copyTile.value }
      : { eyebrow: copyEyebrow.value, heading: copyHeading.value, text: copyText.value };
    window.KhaqanSlotCopy.set(key, values);
    const saved = window.KhaqanSlotCopy.get(key);
    queueSettingsForCloud();
    renderCopyForm();
    renderMedia();
    flashStatus(saved
      ? 'Wording saved — the public page shows it immediately, and other visitors on their next load.'
      : 'Wording cleared: that part of the page uses the text that ships with the site again.');
  }

  async function clearCopySpot() {
    if (!window.KhaqanSlotCopy) return;
    const key = copyKey();
    if (!key || !hasCopy(key)) { flashStatus('That spot already uses the wording that ships with the site.'); return; }
    const ok = await askConfirm({
      title: 'Restore the original wording?',
      body: `The heading, caption and tile label for ${key} go back to what ships in the page.\nYour uploaded photo or film stays where it is.`,
      confirm: 'Restore wording',
      danger: false
    });
    if (!ok) return;
    window.KhaqanSlotCopy.clear(key);
    queueSettingsForCloud();
    renderCopyForm();
    renderMedia();
    flashStatus('Original wording restored.');
  }

  copyForm?.addEventListener('submit', saveCopyForm);
  copyClear?.addEventListener('click', clearCopySpot);
  copyPage?.addEventListener('change', () => { fillCopyAreaSelect(copyPage.value); fillCopySlotSelect(copyPage.value, copyArea.value, ''); renderCopyForm(); });
  copyArea?.addEventListener('change', () => { fillCopySlotSelect(copyPage.value, copyArea.value, ''); renderCopyForm(); });
  copySlot?.addEventListener('change', renderCopyForm);

  /* =====================================================================
     All media — every file the site knows about in one list: the shared
     catalogue, what is in the Supabase bucket, and the stock media that
     ships in the repository. Deleting here clears the row, the browser copy
     AND the file in the bucket.
     ===================================================================== */
  const allMediaBody = query('#all-media-rows');
  const allMediaStatus = query('#allmedia-save-status');
  const allMediaSearch = query('#allmedia-search');
  const allMediaKind = query('#allmedia-kind');
  const allMediaSource = query('#allmedia-source');
  const allMediaSort = query('#allmedia-sort');
  const allMediaPages = query('#allmedia-pages');
  const allMediaCount = query('#allmedia-count');
  const allMediaSelected = query('#allmedia-selected');
  const allMediaStorage = query('#all-media-storage');
  const allMediaStock = query('#all-media-stock');
  const SITE_PAGES = ['index.html', 'about.html', 'operations.html', 'supply.html', 'gallery.html', 'community.html', 'contact.html'];
  const allMedia = { page: 'all', sort: 'newest', selected: new Set(), storage: null, storageError: '', stock: null, loading: false };

  function mediaRowStats(item) {
    const bytes = Number(item.byteSize) || 0;
    if (bytes) return bytes;
    const url = String(item.url || '');
    // A data URL holds ~4/3 of the original bytes; good enough to warn about.
    if (url.startsWith('data:')) return Math.max(0, Math.round((url.length - url.indexOf(',') - 1) * 0.75));
    return 0;
  }

  function mediaSourceLabel(item) {
    if (item.storagePath) return '<b class="am-src am-src-cloud">Supabase bucket</b>';
    if (window.KhaqanMedia.isRemoteId(item.id)) return '<b class="am-src am-src-pending">Cloud row, no file</b>';
    return '<b class="am-src am-src-local">This browser only</b>';
  }

  function allMediaItems() {
    const items = (window.KhaqanMedia ? window.KhaqanMedia.get() : []).slice();
    const search = (allMediaSearch?.value || '').toLowerCase().trim();
    const kind = allMediaKind ? allMediaKind.value : 'all';
    const source = allMediaSource ? allMediaSource.value : 'all';
    const page = (allMediaPages && allMediaPages.value) || allMedia.page;
    const filtered = items.filter((item) => {
      if (kind !== 'all' && item.type !== kind) return false;
      if (source === 'cloud' && !item.storagePath) return false;
      if (source === 'local' && item.storagePath) return false;
      if (source === 'orphan' && item.url && /^https?:/i.test(item.url)) return false;
      if (page !== 'all') {
        const pageId = place() ? place().pageOf(item) : (item.section || 'general');
        if (pageId !== page) return false;
      }
      if (!search) return true;
      const ref = placementLabel(item);
      return [item.title, ref.text, item.storagePath, item.type, item.id].join(' ').toLowerCase().includes(search);
    });
    const sorters = {
      newest: (a, b) => new Date(b.addedAt || 0) - new Date(a.addedAt || 0),
      oldest: (a, b) => new Date(a.addedAt || 0) - new Date(b.addedAt || 0),
      largest: (a, b) => mediaRowStats(b) - mediaRowStats(a),
      name: (a, b) => String(a.title || '').localeCompare(String(b.title || '')),
      page: (a, b) => placementLabel(a).text.localeCompare(placementLabel(b).text)
    };
    return filtered.sort(sorters[allMedia.sort] || sorters.newest);
  }

  function renderAllMedia() {
    if (!allMediaBody) return;
    const items = allMediaItems();
    const total = window.KhaqanMedia ? window.KhaqanMedia.get().length : 0;
    const viewBytes = items.reduce((sum, item) => sum + mediaRowStats(item), 0);
    if (allMediaCount) {
      allMediaCount.textContent = total
        ? `${items.length} of ${total} file${total === 1 ? '' : 's'} · ${formatBytes(viewBytes)} in view`
        : 'Nothing uploaded yet';
    }
    if (allMediaBody) {
      if (!total) {
        allMediaBody.innerHTML = '<tr><td class="crm-allmedia-empty" colspan="7"><span>◎</span><h3>No media uploaded yet</h3><p>Photos, reel clips and portraits added in the Control Room are listed here — with the file they came from and the page they sit on.</p></td></tr>';
      } else if (!items.length) {
        allMediaBody.innerHTML = '<tr><td class="crm-allmedia-empty" colspan="7"><span>◎</span><h3>Nothing matches these filters</h3><p>Clear the search box or pick “All pages”.</p></td></tr>';
      } else {
        allMediaBody.innerHTML = items.map((item) => {
          const ref = placementLabel(item);
          const bytes = mediaRowStats(item);
          const big = !item.storagePath && bytes > 1.5 * 1024 * 1024;
          const link = ref.href ? `<a class="media-page-link" href="${escapeHtml(ref.href)}" target="_blank" rel="noreferrer">Open page</a>` : '';
          const visual = item.url
            ? (item.type === 'video'
              ? `<video muted preload="metadata"><source src="${escapeHtml(item.url)}"></video>`
              : `<img src="${escapeHtml(item.url)}" alt="" loading="lazy" decoding="async">`)
            : '<span class="am-missing">no file</span>';
          return `<tr data-allmedia-row="${escapeHtml(item.id)}">
            <td class="am-check"><input type="checkbox" data-allmedia-pick="${escapeHtml(item.id)}" ${allMedia.selected.has(item.id) ? 'checked' : ''} aria-label="Select ${escapeHtml(item.title)}"></td>
            <td class="am-thumb">${visual}</td>
            <td class="am-title"><strong>${escapeHtml(item.title)}</strong><small>${item.type === 'video' ? 'Video' : 'Image'} · ${escapeHtml(ref.area || '—')}${item.slot ? ' · ' + escapeHtml(item.slot) : ''}${item.duration ? ` · plays ${escapeHtml(formatDuration(item.duration))}` : ''}</small>${big ? '<small class="am-warn">Large in-browser copy — sign in to Supabase storage instead.</small>' : ''}</td>
            <td class="am-where">${escapeHtml(ref.page)}${link}</td>
            <td class="am-src-cell">${mediaSourceLabel(item)}${item.storagePath ? `<small>${escapeHtml(item.storagePath)}</small>` : `<small>${escapeHtml(item.id)}</small>`}</td>
            <td class="am-meta"><span>${formatBytes(bytes)}</span><small>${escapeHtml(formatDate(item.addedAt))}</small></td>
            <td class="am-actions"><button class="btn btn-quiet crm-danger" type="button" data-allmedia-delete="${escapeHtml(item.id)}">Delete</button></td>
          </tr>`;
        }).join('');
      }
    }
    renderSelectedCount();
    renderStoragePanel();
  }

  function renderSelectedCount() {
    if (!allMediaSelected) return;
    const count = allMedia.selected.size;
    allMediaSelected.textContent = count ? `${count} selected` : '';
    const button = query('#allmedia-delete-selected');
    if (button) button.hidden = !count;
  }

  function renderStoragePanel() {
    if (!allMediaStorage) return;
    const cloud = cloudAdmin();
    if (!cloud || !cloud.listMediaObjects) {
      allMediaStorage.innerHTML = '<p class="crm-media-area-empty">Sign in with an administrator account to inspect the Supabase <code>media</code> bucket — files uploaded while signed out live only in this browser, and deleting them here removes them from this browser.</p>';
      return;
    }
    if (allMedia.storage === null) {
      allMediaStorage.innerHTML = '<p class="crm-media-area-empty">Reading the storage bucket…</p>';
      return;
    }
    if (allMedia.storageError) {
      allMediaStorage.innerHTML = `<p class="crm-media-area-empty">${escapeHtml(allMedia.storageError)}</p>`;
      return;
    }
    const tracked = new Set(window.KhaqanMedia.get().map((m) => m.storagePath).filter(Boolean));
    const rows = allMedia.storage.map((file) => ({ ...file, orphan: !tracked.has(file.path) }));
    const orphans = rows.filter((row) => row.orphan);
    const totalBytes = rows.reduce((sum, row) => sum + (row.size || 0), 0);
    const head = `<div class="am-storage-head"><span>${rows.length} file${rows.length === 1 ? '' : 's'} in the bucket · ${formatBytes(totalBytes)}${orphans.length ? ` · <b>${orphans.length} orphaned</b>` : ''}</span>${orphans.length ? '<button class="btn btn-quiet crm-danger" type="button" id="allmedia-purge-orphans">Purge orphaned files</button>' : ''}</div>`;
    if (!rows.length) {
      allMediaStorage.innerHTML = `${head}<p class="crm-media-area-empty">The bucket is empty — every upload you have made is stored in this browser only.</p>`;
      return;
    }
    allMediaStorage.innerHTML = `${head}<div class="crm-table-wrap"><table class="crm-table am-table"><thead><tr><th>File in storage</th><th>Size</th><th>Updated</th><th>Status</th><th></th></tr></thead><tbody>${rows.map((row) => `<tr>
      <td class="am-path">${escapeHtml(row.path)}</td>
      <td>${formatBytes(row.size)}</td>
      <td>${escapeHtml(formatDate(row.updatedAt))}</td>
      <td>${row.orphan ? '<b class="am-src am-src-pending">Orphan — no catalogue row</b>' : '<b class="am-src am-src-cloud">In use</b>'}</td>
      <td class="am-actions">${row.orphan ? `<button class="btn btn-quiet crm-danger" type="button" data-storage-delete="${escapeHtml(row.path)}">Delete file</button>` : '<span class="am-meta">used by the site</span>'}</td>
    </tr>`).join('')}</tbody></table></div>`;
  }

  async function loadStorageInventory() {
    const cloud = cloudAdmin();
    if (!cloud || !cloud.listMediaObjects || allMedia.loading) return;
    allMedia.loading = true;
    try {
      allMedia.storage = await cloud.listMediaObjects();
      allMedia.storageError = '';
    } catch (error) {
      allMedia.storageError = `The bucket could not be listed (${error.message || 'storage request failed'}). Check that the media bucket policies from supabase/schema.sql are in place.`;
    }
    allMedia.loading = false;
    renderStoragePanel();
  }

  async function removeStorageFile(path) {
    const cloud = cloudAdmin();
    if (!cloud || !path) return false;
    const ok = await askConfirm({
      title: 'Delete this file from storage?',
      body: `${path}\nNothing in the media library points at it, so no page changes — the file simply stops occupying the bucket.`,
      confirm: 'Delete file'
    });
    if (!ok) return false;
    try {
      await cloud.removeMediaObject(path);
      allMedia.storage = (allMedia.storage || []).filter((row) => row.path !== path);
      renderStoragePanel();
      flashStatus('Orphaned file removed from the bucket.');
      return true;
    } catch (error) {
      flashStatus(error.message || 'Storage refused that delete.', false);
      return false;
    }
  }

  async function purgeOrphans() {
    const cloud = cloudAdmin();
    if (!cloud || !allMedia.storage) return;
    const tracked = new Set(window.KhaqanMedia.get().map((m) => m.storagePath).filter(Boolean));
    const orphans = allMedia.storage.filter((row) => !tracked.has(row.path));
    if (!orphans.length) { flashStatus('No orphaned files — every file in the bucket is in use.'); return; }
    const bytes = orphans.reduce((sum, row) => sum + (row.size || 0), 0);
    const ok = await askConfirm({
      title: `Delete ${orphans.length} orphaned file${orphans.length === 1 ? '' : 's'}?`,
      body: `That frees ${formatBytes(bytes)} in the media bucket.\nFiles still used by a page are never included.`,
      confirm: 'Purge orphans'
    });
    if (!ok) return;
    let removed = 0;
    let failed = 0;
    for (const row of orphans) {
      try { await cloud.removeMediaObject(row.path); removed += 1; } catch (error) { failed += 1; }
    }
    await loadStorageInventory();
    flashStatus(failed
      ? `${removed} file${removed === 1 ? '' : 's'} removed, ${failed} refused by storage.`
      : `${removed} orphaned file${removed === 1 ? '' : 's'} removed from the bucket.`, !failed);
  }

  /* Stock media inventory: which files the site ships with, and where they are
     referenced. Built by reading the pages themselves, so it can never drift
     out of date — and it is read-only on purpose: these files live in Git. */
  async function loadStockInventory() {
    if (!allMediaStock || allMedia.stock) return;
    allMediaStock.innerHTML = '<p class="crm-media-area-empty">Scanning the site for shipped media…</p>';
    const refs = new Map();
    const add = (path, page) => {
      const clean = String(path || '').replace(/^\.?\//, '').split('?')[0].split('#')[0];
      if (!/^media\/[A-Za-z0-9._\-/]+$/.test(clean)) return;
      if (!/\.(webp|avif|jpe?g|png|svg|gif|webm|mp4|mov)$/i.test(clean)) return;
      const entry = refs.get(clean) || { path: clean, pages: new Set() };
      entry.pages.add(page);
      refs.set(clean, entry);
    };
    await Promise.all(SITE_PAGES.map(async (page) => {
      try {
        const response = await fetch(page, { cache: 'no-store' });
        if (!response.ok) return;
        const html = await response.text();
        const pattern = /(?:src|poster|href|srcset|content)\s*=\s*["']([^"']*media\/[^"']+)["']/gi;
        const background = /url\(['"]?([^'")]*media\/[^'")]+)/gi;
        let match;
        while ((match = pattern.exec(html))) String(match[1]).split(',').forEach((candidate) => add(candidate.trim(), page));
        while ((match = background.exec(html))) add(match[1].trim(), page);
      } catch (error) { /* a page that will not load simply contributes no refs */ }
    }));
    const list = Array.from(refs.values()).sort((a, b) => a.path.localeCompare(b.path));
    // Best-effort sizes; static hosts answer HEAD with Content-Length.
    const queue = list.slice(0, 160);
    const sizeOf = async (path) => {
      try {
        const response = await fetch(path, { method: 'HEAD', cache: 'no-store' });
        if (!response.ok) return 0;
        return Number(response.headers.get('content-length')) || 0;
      } catch (error) { return 0; }
    };
    let cursor = 0;
    const workers = Array.from({ length: 8 }, async () => {
      while (cursor < queue.length) {
        const row = queue[cursor];
        cursor += 1;
        row.size = await sizeOf(row.path);
      }
    });
    await Promise.all(workers);
    allMedia.stock = list;
    renderStockPanel();
  }

  function renderStockPanel() {
    if (!allMediaStock) return;
    const list = allMedia.stock || [];
    const bytes = list.reduce((sum, row) => sum + (row.size || 0), 0);
    const groups = new Map();
    list.forEach((row) => {
      const folder = row.path.includes('/') ? row.path.split('/').slice(0, -1).join('/') : 'media';
      const entry = groups.get(folder) || [];
      entry.push(row);
      groups.set(folder, entry);
    });
    allMediaStock.innerHTML = `<div class="am-storage-head"><span>${list.length} file${list.length === 1 ? '' : 's'} shipped in <code>media/</code> · ${formatBytes(bytes)}</span></div>
      <p class="crm-media-hint">These are the stock photographs and clips that come with the code, including the default image of every named slot. A browser cannot delete files from the repository — remove them in Git (and update <code>media/credits.md</code>) if they should no longer be served. Anything you uploaded from the Control Room is listed above and can be deleted there.</p>
      ${Array.from(groups.entries()).map(([folder, rows]) => `<div class="am-group"><h5>${escapeHtml(folder)} <small>${rows.length}</small></h5><div class="am-chips">${rows.map((row) => `<span class="am-chip" title="Used by: ${escapeHtml(Array.from(row.pages).join(', '))}"><a href="${escapeHtml(row.path)}" target="_blank" rel="noreferrer">${escapeHtml(row.path.split('/').pop())}</a><em>${formatBytes(row.size)}</em></span>`).join('')}</div></div>`).join('')}`;
  }

  query('#allmedia-refresh')?.addEventListener('click', async () => {
    if (allMediaSearch) allMediaSearch.value = '';
    flashStatus('Reading the media catalogue from Supabase…');
    await refreshMediaFromCloud().catch(() => {});
    renderAllMedia();
    renderMedia();
    loadStorageInventory();
  });
  allMediaSearch?.addEventListener('input', renderAllMedia);
  [allMediaKind, allMediaSource, allMediaSort].forEach((select) => select?.addEventListener('change', (event) => {
    if (event.target === allMediaSort) allMedia.sort = allMediaSort.value;
    renderAllMedia();
  }));
  allMediaPages?.addEventListener('change', () => { allMedia.page = allMediaPages.value; renderAllMedia(); });
  query('#allmedia-clear-filters')?.addEventListener('click', () => {
    if (allMediaSearch) allMediaSearch.value = '';
    [allMediaKind, allMediaSource, allMediaPages].forEach((select) => { if (select) select.value = 'all'; });
    allMedia.page = 'all';
    allMedia.selected.clear();
    renderAllMedia();
  });
  query('#allmedia-select-all')?.addEventListener('change', (event) => {
    const ids = allMediaItems().map((item) => item.id);
    if (event.target.checked) ids.forEach((id) => allMedia.selected.add(id));
    else ids.forEach((id) => allMedia.selected.delete(id));
    renderAllMedia();
  });
  allMediaBody?.addEventListener('change', (event) => {
    const pick = event.target.closest('[data-allmedia-pick]');
    if (!pick) return;
    if (pick.checked) allMedia.selected.add(pick.dataset.allmediaPick);
    else allMedia.selected.delete(pick.dataset.allmediaPick);
    renderSelectedCount();
  });
  allMediaBody?.addEventListener('click', (event) => {
    const button = event.target.closest('[data-allmedia-delete]');
    if (button) deleteMediaItem(button.dataset.allmediaDelete);
  });
  allMediaStorage?.addEventListener('click', (event) => {
    if (event.target.closest('#allmedia-purge-orphans')) { purgeOrphans(); return; }
    const button = event.target.closest('[data-storage-delete]');
    if (button) removeStorageFile(button.dataset.storageDelete);
  });
  query('#allmedia-delete-selected')?.addEventListener('click', async () => {
    const ids = Array.from(allMedia.selected);
    if (!ids.length) return;
    const items = window.KhaqanMedia.get().filter((item) => ids.includes(item.id));
    const files = items.filter((item) => item.storagePath).length;
    const ok = await askConfirm({
      title: `Delete ${ids.length} media file${ids.length === 1 ? '' : 's'}?`,
      body: `${items.map((item) => `${item.title} — ${placementLabel(item).text || 'library only'}`).join('\n')}`,
      confirm: `Delete ${ids.length} file${ids.length === 1 ? '' : 's'}`
    });
    if (!ok) return;
    let done = 0;
    for (const id of ids) {
      /* The per-item cloud delete already ran inside deleteMediaItem, which
         removes the catalogue row and the file in the bucket together. */
      if (await deleteMediaItem(id, { confirm: false })) done += 1;
    }
    allMedia.selected.clear();
    renderAllMedia();
    const persist = window.KhaqanMedia.persistError && window.KhaqanMedia.persistError();
    flashStatus(`${done} media file${done === 1 ? '' : 's'} deleted${files ? ` — including ${files} file${files === 1 ? '' : 's'} from the Supabase bucket` : ''}.${persist ? ` Warning: ${persist.message}` : ''}`, !persist);
  });

  queryAll('[data-crm-tab]').forEach((tab) => {
    tab.addEventListener('click', () => {
      if (tab.dataset.crmTab !== 'allmedia') return;
      renderAllMedia();
      loadStorageInventory();
      loadStockInventory();
    });
  });

  /* Browser-quota problems are surfaced here as well as in the status line,
     because a full localStorage silently used to turn every delete into a
     no-op that looked like a broken button. */
  function renderMediaHealth() {
    const strip = query('#allmedia-health');
    if (!strip) return;
    const persist = (window.KhaqanMedia.persistError && window.KhaqanMedia.persistError()) || null;
    const items = window.KhaqanMedia ? window.KhaqanMedia.get() : [];
    const heavy = items.filter((item) => !item.storagePath && mediaRowStats(item) > 1.5 * 1024 * 1024);
    const messages = [];
    if (persist) messages.push(persist.message);
    if (heavy.length) messages.push(`${heavy.length} upload${heavy.length === 1 ? '' : 's'} ${heavy.length === 1 ? 'is' : 'are'} held as a copy inside this browser. Sign in with an administrator account so originals go to Supabase storage instead — large in-browser copies are what fill the quota that blocks saves and deletes.`);
    strip.hidden = !messages.length;
    strip.innerHTML = messages.map((message) => `<p>${escapeHtml(message)}</p>`).join('');
  }

  window.addEventListener('khaqan:media-change', () => {
    renderPortraits();
    renderMedia();
    renderAllMedia();
    renderCopyForm();
    renderMediaHealth();
    updateMediaMetric();
  });
  window.addEventListener('khaqan:media-error', renderMediaHealth);
  window.addEventListener('khaqan:cms-change', renderCopyForm);

  loadSiteForm();
  renderLeads();
  renderPortraits();
  resetMediaForm();
  renderMedia();
  renderCopyForm();
  renderAllMedia();
  renderMediaHealth();
  updateMediaMetric();
  }
})();
