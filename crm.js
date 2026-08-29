(() => {
  const cms = window.KhaqanCMS;
  if (!cms) return;

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
     Media library manager — add, manage (retitle / re-tag / swap file)
     and remove pictures & videos for every part of the website.
     ===================================================================== */
  const mediaGrid = query('#managed-media-grid');
  const mediaEmpty = query('#managed-media-empty');
  const mediaMetric = query('#metric-media');
  const mediaForm = query('#media-form');
  const mediaTitle = query('#media-title');
  const mediaSection = query('#media-section');
  const imageFileInput = query('#media-image-file');
  const videoFileInput = query('#media-video-file');
  const mediaSubmit = query('#media-submit');
  const mediaEditCancel = query('#media-edit-cancel');
  const mediaFormEyebrow = query('#media-form-eyebrow');
  const mediaFormTitle = query('#media-form-title');
  const MAX_MEDIA_BYTES = 12 * 1024 * 1024; // keep localStorage within browser quota
  const MAX_CLOUD_BYTES = 50 * 1024 * 1024; // matches the media bucket file_size_limit

  let editingMediaId = null;
  let stagedFile = null; // { type: 'image'|'video', url: dataURL, name: fileName, file }

  function updateMediaMetric() {
    const items = window.KhaqanMedia ? window.KhaqanMedia.get() : [];
    if (mediaMetric) mediaMetric.textContent = String(items.length);
  }

  function sectionLabel(value) {
    return window.KHAQAN_MEDIA_SECTION_LABEL ? window.KHAQAN_MEDIA_SECTION_LABEL(value) : value;
  }

  function renderMedia() {
    const items = window.KhaqanMedia ? window.KhaqanMedia.get() : [];
    updateMediaMetric();
    if (!mediaGrid) return;
    mediaGrid.innerHTML = items.map((m) => {
      const mediaEl = m.type === 'video'
        ? `<video controls muted preload="metadata"><source src="${escapeHtml(m.url)}"></video>`
        : `<img src="${escapeHtml(m.url)}" alt="${escapeHtml(m.title)}" loading="lazy">`;
      return `<article data-media-id="${escapeHtml(m.id)}">
        <div class="media-item-actions">
          <button class="media-edit" type="button" data-media-edit="${escapeHtml(m.id)}" aria-label="Manage media">Manage</button>
          <button class="media-remove" type="button" data-media-remove="${escapeHtml(m.id)}" aria-label="Remove media">×</button>
        </div>
        ${mediaEl}
        <div><span class="media-kind">${m.type === 'video' ? 'Video' : 'Image'}</span><strong>${escapeHtml(m.title)}</strong><span class="media-tag">${escapeHtml(sectionLabel(m.section))}</span></div>
      </article>`;
    }).join('');
    if (mediaEmpty) mediaEmpty.style.display = items.length ? 'none' : 'block';
  }

  function resetMediaForm() {
    editingMediaId = null;
    stagedFile = null;
    if (mediaForm) mediaForm.reset();
    if (mediaSubmit) mediaSubmit.textContent = 'Add to library';
    if (mediaEditCancel) mediaEditCancel.hidden = true;
    if (mediaFormEyebrow) mediaFormEyebrow.textContent = 'Add media';
    if (mediaFormTitle) mediaFormTitle.textContent = 'Upload an image or video';
    if (imageFileInput) imageFileInput.closest('.file-label').classList.remove('has-file');
    if (videoFileInput) videoFileInput.closest('.file-label').classList.remove('has-file');
  }

  async function stageFile(input, type) {
    const file = input.files && input.files[0];
    if (!file) return;
    const remote = cloudAdmin();
    if (!remote && file.size > MAX_MEDIA_BYTES) {
      flashStatus('That file is over 12 MB — compress it or sign in to Supabase storage for large originals.', false);
      input.value = '';
      return;
    }
    if (remote && file.size > MAX_CLOUD_BYTES) {
      flashStatus('That file is over 50 MB — compress it before uploading to storage.', false);
      input.value = '';
      return;
    }
    try {
      let url = '';
      if (!remote || file.size <= MAX_MEDIA_BYTES) url = await readFileAsDataURL(file);
      stagedFile = { type, url, name: file.name, file };
      const label = input.closest('.file-label');
      if (label) label.classList.add('has-file');
      // Picking a video clears a staged image and vice-versa.
      const other = type === 'video' ? imageFileInput : videoFileInput;
      if (other && other.files && other.files.length) { other.value = ''; other.closest('.file-label')?.classList.remove('has-file'); }
      // Auto-fill the caption from the filename when adding new and the box is empty.
      if (!editingMediaId && mediaTitle && !mediaTitle.value.trim()) {
        mediaTitle.value = file.name.replace(/\.[^.]+$/, '').replace(/[-_]+/g, ' ');
      }
    } catch (error) {
      flashStatus('That file could not be read.', false);
    }
  }

  function applyLocalMediaChange(title, section) {
    if (editingMediaId) {
      const patch = { title, section };
      if (stagedFile) { patch.url = stagedFile.url; patch.type = stagedFile.type; }
      window.KhaqanMedia.update(editingMediaId, patch);
    } else {
      window.KhaqanMedia.add({ type: stagedFile.type, title, section, url: stagedFile.url });
    }
  }

  async function submitMedia(event) {
    event.preventDefault();
    if (!window.KhaqanMedia) return;
    const title = (mediaTitle?.value.trim()) || stagedFile?.name?.replace(/\.[^.]+$/, '') || 'Untitled';
    const section = mediaSection?.value || 'general';
    const cloud = cloudAdmin();

    if (!editingMediaId && !stagedFile) {
      flashStatus('Choose an image or video file first.', false);
      return;
    }

    try {
      if (cloud) {
        if (editingMediaId) {
          const existing = window.KhaqanMedia.get().find((m) => m.id === editingMediaId);
          await cloud.updateMedia(editingMediaId, {
            title,
            section,
            file: stagedFile && stagedFile.file,
            type: stagedFile ? stagedFile.type : undefined,
            storagePath: existing && existing.storagePath
          });
        } else {
          if (!stagedFile.file) {
            flashStatus('Choose an image or video file first.', false);
            return;
          }
          await cloud.uploadMedia({ file: stagedFile.file, title, section, type: stagedFile.type });
        }
        await refreshMediaFromCloud();
        flashStatus(editingMediaId
          ? 'Media updated in Supabase — the website reflects the change immediately.'
          : 'Media uploaded to Supabase and published to the matching page.');
      } else {
        if (!editingMediaId && !stagedFile.url) {
          flashStatus('Choose an image or video file first.', false);
          return;
        }
        applyLocalMediaChange(title, section);
        flashStatus(editingMediaId
          ? 'Media updated — the website reflects the change immediately.'
          : 'Media added to the library and published to the matching page.');
      }
    } catch (error) {
      if ((stagedFile && stagedFile.url) || (editingMediaId && !stagedFile)) {
        applyLocalMediaChange(title, section);
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
    if (mediaSection) mediaSection.value = item.section || 'general';
    if (imageFileInput) { imageFileInput.value = ''; imageFileInput.closest('.file-label')?.classList.remove('has-file'); }
    if (videoFileInput) { videoFileInput.value = ''; videoFileInput.closest('.file-label')?.classList.remove('has-file'); }
    if (mediaSubmit) mediaSubmit.textContent = 'Save changes';
    if (mediaEditCancel) mediaEditCancel.hidden = false;
    if (mediaFormEyebrow) mediaFormEyebrow.textContent = 'Manage media';
    if (mediaFormTitle) mediaFormTitle.textContent = 'Edit title, website part or replace file';
    mediaForm?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    mediaTitle?.focus({ preventScroll: false });
  }

  async function removeMedia(id) {
    if (!window.KhaqanMedia) return;
    if (editingMediaId === id) resetMediaForm();
    if (!window.confirm('Remove this media from the library and the website?')) return;
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
    flashStatus('Media removed.');
  }

  imageFileInput?.addEventListener('change', () => stageFile(imageFileInput, 'image'));
  videoFileInput?.addEventListener('change', () => stageFile(videoFileInput, 'video'));
  mediaForm?.addEventListener('submit', submitMedia);
  mediaEditCancel?.addEventListener('click', resetMediaForm);

  mediaGrid?.addEventListener('click', (event) => {
    const editButton = event.target.closest('[data-media-edit]');
    if (editButton) { startEditMedia(editButton.dataset.mediaEdit); return; }
    const removeButton = event.target.closest('[data-media-remove]');
    if (removeButton) removeMedia(removeButton.dataset.mediaRemove);
  });

  window.addEventListener('khaqan:media-change', () => {
    renderPortraits();
    renderMedia();
    updateMediaMetric();
  });

  loadSiteForm();
  renderLeads();
  renderPortraits();
  renderMedia();
  updateMediaMetric();
})();
