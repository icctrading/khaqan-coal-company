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
    if (Array.isArray(items) && window.KhaqanMedia) window.KhaqanMedia.setAll(items);
    return true;
  }

  function flashStatus(message, ok = true) {
    const targets = [saveStatus, query('#media-save-status')].filter(Boolean);
    targets.forEach((el) => {
      el.textContent = message;
      el.style.color = ok ? '' : '#ffae80';
    });
    window.setTimeout(() => {
      targets.forEach((el) => { el.textContent = ''; el.style.color = ''; });
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
  query('#lead-search')?.addEventListener('input', renderLeads);
  query('#leads-table-body')?.addEventListener('change', (event) => {
    if (event.target.matches('.lead-status')) updateLeadStatus(event.target.dataset.id, event.target.value);
  });
  query('#leads-table-body')?.addEventListener('click', (event) => {
    if (event.target.matches('.lead-delete')) deleteLead(event.target.dataset.id);
  });
  query('#clear-leads')?.addEventListener('click', () => {
    if (!cms.readLeads().length) return;
    if (window.confirm('Clear all saved enquiries from this browser?')) {
      cms.saveLeads([]);
      renderLeads();
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
      } catch (error) {
        flashStatus('That backup could not be read.', false);
      }
    };
    reader.readAsText(file);
    event.target.value = '';
  });

  query('#reset-data')?.addEventListener('click', () => {
    if (window.confirm('Reset editable content to the original Khaqan defaults?')) {
      cms.save(cms.defaults);
      loadSiteForm();
      flashStatus('Defaults restored.');
    }
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
    return items.find((m) => m.type === 'image' && m.section === `team-${key}`) || null;
  }

  function renderPortraits() {
    if (!portraitGrid) return;
    portraitGrid.innerHTML = PORTRAIT_MEMBERS.map((member) => {
      const photo = portraitFor(member.key);
      const visual = photo
        ? `<img src="${escapeHtml(photo.url)}" alt="Portrait of ${escapeHtml(member.name)}" loading="lazy">`
        : `<span class="crm-portrait-monogram" aria-hidden="true">${escapeHtml(member.monogram)}</span>`;
      const fileId = `portrait-file-${member.key}`;
      return `<article class="crm-portrait-slot${photo ? ' has-photo' : ''}" data-member="${member.key}">
        <div class="crm-portrait-frame">${visual}
          <span class="crm-portrait-badge">${photo ? 'Photo live on site' : 'No photo yet'}</span>
        </div>
        <div class="crm-portrait-meta"><strong>${escapeHtml(member.name)}</strong><span>${escapeHtml(member.role)} · ${escapeHtml(member.caption)}</span><small>${photo ? escapeHtml(photo.title || 'Portrait') : 'Initials placeholder shown on the site'}</small></div>
        <div class="crm-portrait-actions">
          <label class="file-label" for="${fileId}">${photo ? 'Replace photo' : 'Upload photo'}<input id="${fileId}" type="file" accept="image/*" data-portrait-upload="${member.key}" hidden></label>
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
    const stale = window.KhaqanMedia.get().filter((m) => m.type === 'image' && m.section === section && m.id !== keepId);
    for (const item of stale) {
      try {
        if (cloud) await cloud.deleteMedia(item.id, item.storagePath);
        else window.KhaqanMedia.remove(item.id);
      } catch (error) {
        window.KhaqanMedia.remove(item.id);
      }
    }
  }

  async function handlePortraitUpload(input, key) {
    const file = input.files && input.files[0];
    if (!file || !window.KhaqanMedia) return;
    const member = PORTRAIT_MEMBERS.find((m) => m.key === key);
    const section = `team-${key}`;
    const title = `Portrait — ${member.name}`;
    const cloud = cloudAdmin();
    try {
      if (cloud) {
        const existing = portraitFor(key);
        if (existing && existing.storagePath) {
          await cloud.updateMedia(existing.id, { file, title, section, type: 'image', storagePath: existing.storagePath });
        } else {
          await cloud.uploadMedia({ file, title, section, type: 'image' });
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
          .filter((m) => m.type === 'image' && m.section === section && m.id !== (portraitFor(key) || {}).id)
          .map((m) => m.id);
        const existing = portraitFor(key);
        if (existing) {
          window.KhaqanMedia.update(existing.id, { url, title, section, type: 'image' });
        } else {
          window.KhaqanMedia.add({ type: 'image', title, section, url });
        }
        stale.forEach((id) => window.KhaqanMedia.remove(id));
      }
      renderPortraits();
      renderMedia();
      updateMediaMetric();
      flashStatus(`${member.name}'s portrait is now live in the leadership hero.`);
    } catch (error) {
      try {
        const url = await readFileAsDataURL(file);
        const existing = portraitFor(key);
        if (existing) window.KhaqanMedia.update(existing.id, { url, title, section, type: 'image' });
        else window.KhaqanMedia.add({ type: 'image', title, section, url });
        renderPortraits();
        renderMedia();
        updateMediaMetric();
        flashStatus(`${member.name}'s portrait saved in this browser. Cloud sync needs attention.`, false);
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
    const portraits = window.KhaqanMedia.get().filter((m) => m.type === 'image' && m.section === section);
    if (!portraits.length) return;
    if (!window.confirm(`Remove ${member.name}'s portrait? The initials placeholder will return on the website.`)) return;
    const cloud = cloudAdmin();
    try {
      if (cloud) {
        for (const item of portraits) {
          try { await cloud.deleteMedia(item.id, item.storagePath); } catch (error) { window.KhaqanMedia.remove(item.id); }
        }
        await refreshMediaFromCloud();
      } else {
        portraits.forEach((m) => window.KhaqanMedia.remove(m.id));
      }
    } catch (error) {
      portraits.forEach((m) => window.KhaqanMedia.remove(m.id));
    }
    renderPortraits();
    renderMedia();
    updateMediaMetric();
    flashStatus(`${member.name}'s portrait removed.`);
  }

  portraitGrid?.addEventListener('change', (event) => {
    const input = event.target.closest('[data-portrait-upload]');
    if (input) handlePortraitUpload(input, input.dataset.portraitUpload);
  });
  portraitGrid?.addEventListener('click', (event) => {
    const button = event.target.closest('[data-portrait-remove]');
    if (button) handlePortraitRemove(button.dataset.portraitRemove);
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
  const mediaSubmit = query('#media-submit');
  const mediaEditCancel = query('#media-edit-cancel');
  const mediaFormEyebrow = query('#media-form-eyebrow');
  const mediaFormTitle = query('#media-form-title');
  const mediaFilters = query('#media-page-filters');
  const mediaSearch = query('#media-search');
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
      return;
    }
    mediaSlot.hidden = false;
    mediaSlot.innerHTML = slots.map((s) => `<option value="${escapeHtml(s.id)}">${escapeHtml(s.label)}</option>`).join('');
    mediaSlot.value = selected || slots[0].id;
    if (!mediaSlot.value) mediaSlot.value = slots[0].id;
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

  function placeMetaHtml(ref) {
    const slot = ref.slot ? `<em>${escapeHtml(ref.slot)}</em>` : '';
    const link = ref.href
      ? `<a class="media-page-link" href="${escapeHtml(ref.href)}" target="_blank" rel="noreferrer">Open ${escapeHtml(ref.page)}</a>`
      : '';
    return `<span class="media-place"><b>${escapeHtml(ref.page)}</b><span>${escapeHtml(ref.area)}</span>${slot}</span>${link}`;
  }

  function galleryCards(items) {
    return items.map((m) => {
      const ref = placementLabel(m);
      return `<article data-media-id="${escapeHtml(m.id)}" class="has-override">
        ${mediaVisual(m.url, m.title, m.type)}
        <div><span class="media-kind">${m.type === 'video' ? 'Video' : 'Image'}</span><strong>${escapeHtml(m.title)}</strong>${placeMetaHtml(ref)}</div>
        ${cardActions({ id: m.id, canEdit: true, canRemove: m.section !== 'general', canDelete: true, replaceLabel: 'Replace' })}
      </article>`;
    }).join('');
  }

  function slotCards(pageId, area, items) {
    return (area.slots || []).map((slot) => {
      const override = place() ? place().occupant(items, pageId, area.id, slot.id) : null;
      const key = `${pageId}:${area.id}:${slot.id}`;
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
        <div><span class="media-kind">${override ? 'Live on page' : 'Stock on page'}</span><strong>${escapeHtml(override ? (override.title || slot.label) : slot.label)}</strong>${placeMetaHtml(ref)}</div>
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
      stagedFile = { type, url, name: file.name, file };
      const label = input.closest('.file-label');
      if (label) label.classList.add('has-file');
      const other = type === 'video' ? imageFileInput : videoFileInput;
      if (other && other.files && other.files.length) { other.value = ''; other.closest('.file-label')?.classList.remove('has-file'); }
      if (!editingMediaId && mediaTitle && !mediaTitle.value.trim()) {
        mediaTitle.value = file.name.replace(/\.[^.]+$/, '').replace(/[-_]+/g, ' ');
      }
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

  function applyLocalMediaChange(title, section, area, slot, existingId) {
    const id = existingId || editingMediaId;
    const patch = { title, section, area, slot };
    if (stagedFile) { patch.url = stagedFile.url; patch.type = stagedFile.type; }
    if (id) window.KhaqanMedia.update(id, patch);
    else window.KhaqanMedia.add({ type: stagedFile.type, title, section, area, slot, url: stagedFile.url });
  }

  async function persistMedia({ title, section, area, slot, file, type, existing }) {
    const cloud = cloudAdmin();
    const id = existing && existing.id;
    if (cloud) {
      if (id) {
        await cloud.updateMedia(id, {
          title, section, area, slot,
          file: file || undefined,
          type: type || undefined,
          storagePath: existing.storagePath
        });
      } else {
        if (!file) throw new Error('Choose an image or video file first.');
        await cloud.uploadMedia({ file, title, section, area, slot, type });
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
      const patch = { title, section, area, slot };
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
      window.KhaqanMedia.add({ type: type || (stagedFile && stagedFile.type) || 'image', title, section, area, slot, url });
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
      flashStatus('Choose an image or video file first.', false);
      return;
    }
    const existing = editingMediaId ? window.KhaqanMedia.get().find((m) => m.id === editingMediaId) : null;
    try {
      await persistMedia({
        title, section, area, slot,
        file: stagedFile && stagedFile.file,
        type: stagedFile ? stagedFile.type : undefined,
        existing
      });
      flashStatus(editingMediaId
        ? 'Media updated — the website reflects the page and area immediately.'
        : 'Media published to the selected page and page area.');
    } catch (error) {
      if ((stagedFile && stagedFile.url) || (editingMediaId && !stagedFile)) {
        applyLocalMediaChange(title, section, area, slot);
        flashStatus('Saved in this browser. Cloud sync needs attention.', false);
      } else {
        flashStatus(error.message || 'That media could not be saved.', false);
        return;
      }
    }
    resetMediaForm();
    renderMedia();
    renderPortraits();
    updateMediaMetric();
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
    if (mediaSubmit) mediaSubmit.textContent = 'Save changes';
    if (mediaEditCancel) mediaEditCancel.hidden = false;
    if (mediaFormEyebrow) mediaFormEyebrow.textContent = 'Edit media';
    if (mediaFormTitle) mediaFormTitle.textContent = 'Edit title, page, page area or replace file';
    mediaForm?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    mediaTitle?.focus({ preventScroll: false });
  }

  async function unplaceMedia(id) {
    if (!window.KhaqanMedia) return;
    const item = window.KhaqanMedia.get().find((m) => m.id === id);
    if (!item) return;
    if (editingMediaId === id) resetMediaForm();
    const ref = placementLabel(item);
    if (!window.confirm(`Remove this media from ${ref.text || 'the website'}? It will stay in Library only, and any stock photograph in that slot will return.`)) return;
    const cloud = cloudAdmin();
    try {
      if (cloud) {
        await cloud.updateMedia(id, { title: item.title, section: 'general', area: 'library', slot: '', storagePath: item.storagePath });
        await refreshMediaFromCloud();
      } else {
        window.KhaqanMedia.update(id, { section: 'general', area: 'library', slot: '' });
      }
    } catch (error) {
      window.KhaqanMedia.update(id, { section: 'general', area: 'library', slot: '' });
    }
    renderMedia();
    renderPortraits();
    updateMediaMetric();
    flashStatus('Media removed from the website. It is still in Library only.');
  }

  async function deleteMedia(id) {
    if (!window.KhaqanMedia) return;
    if (editingMediaId === id) resetMediaForm();
    if (!window.confirm('Permanently delete this media from the library and the website?')) return;
    const item = window.KhaqanMedia.get().find((m) => m.id === id);
    const cloud = cloudAdmin();
    try {
      if (cloud) {
        await cloud.deleteMedia(id, item && item.storagePath);
        await refreshMediaFromCloud();
      } else {
        window.KhaqanMedia.remove(id);
      }
    } catch (error) {
      window.KhaqanMedia.remove(id);
    }
    renderMedia();
    renderPortraits();
    updateMediaMetric();
    flashStatus('Media deleted.');
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
      stagedFile = { type, url, name: file.name, file };
      await persistMedia({ title, section, area, slot, file, type, existing: existing || null });
      stagedFile = null;
      flashStatus('Media replaced on the selected page area.');
    } catch (error) {
      try {
        const url = await readFileAsDataURL(file);
        stagedFile = { type, url, name: file.name, file };
        applyLocalMediaChange(title, section, area, slot, existing && existing.id);
        stagedFile = null;
        flashStatus('Replaced in this browser. Cloud sync needs attention.', false);
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
    if (deleteButton) { deleteMedia(deleteButton.dataset.mediaDelete); }
  });
  mediaBoard?.addEventListener('change', (event) => {
    const input = event.target.closest('[data-media-replace], [data-slot-replace]');
    if (!input || !input.files || !input.files[0]) return;
    replaceFromCard(input.files[0], input.dataset.mediaReplace, input.dataset.slotReplace);
    input.value = '';
  });

  window.addEventListener('khaqan:media-change', () => {
    renderPortraits();
    renderMedia();
    updateMediaMetric();
  });

  loadSiteForm();
  renderLeads();
  renderPortraits();
  resetMediaForm();
  renderMedia();
  updateMediaMetric();
  };
})();
