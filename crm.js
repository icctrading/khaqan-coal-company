(() => {
  const cms = window.KhaqanCMS;
  if (!cms) return;

  const query = (selector) => document.querySelector(selector);
  const queryAll = (selector) => Array.from(document.querySelectorAll(selector));
  const form = query('#site-form');
  const saveStatus = query('#site-save-status');
  const escapeHtml = (value = '') => String(value).replace(/[&<>'"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[char]));

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
    saveStatus.textContent = 'Saved. Open the main website in a new tab to see the update.';
    window.setTimeout(() => { saveStatus.textContent = ''; }, 5000);
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
    const bundle = { site: cms.get(), leads: cms.readLeads(), exportedAt: new Date().toISOString() };
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
        loadSiteForm();
        renderLeads();
        if (saveStatus) saveStatus.textContent = 'Backup imported successfully.';
      } catch (error) {
        if (saveStatus) saveStatus.textContent = 'That backup could not be read.';
      }
    };
    reader.readAsText(file);
    event.target.value = '';
  });

  query('#reset-data')?.addEventListener('click', () => {
    if (window.confirm('Reset editable content to the original Khaqan defaults?')) {
      cms.save(cms.defaults);
      loadSiteForm();
      if (saveStatus) saveStatus.textContent = 'Defaults restored.';
    }
  });

  loadSiteForm();
  renderLeads();
})();
