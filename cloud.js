/* Optional Supabase bridge. The site works in local-only mode until supabase-config.js is filled. */
(() => {
  const config = window.KHAQAN_SUPABASE || {};
  const url = String(config.url || '').replace(/\/$/, '');
  const anonKey = String(config.anonKey || '');
  const sessionKey = 'khaqanSupabaseSession';
  const enabled = Boolean(url && anonKey);

  const readSession = () => {
    try { return JSON.parse(localStorage.getItem(sessionKey) || 'null'); } catch (error) { return null; }
  };
  const saveSession = (session) => {
    try {
      if (session) localStorage.setItem(sessionKey, JSON.stringify(session));
      else localStorage.removeItem(sessionKey);
    } catch (error) { /* storage may be unavailable */ }
  };
  const accessToken = () => readSession()?.access_token || anonKey;

  async function request(path, options = {}) {
    if (!enabled) throw new Error('Supabase is not configured.');
    const response = await fetch(`${url}/rest/v1/${path}`, {
      ...options,
      headers: {
        apikey: anonKey,
        Authorization: `Bearer ${accessToken()}`,
        'Content-Type': 'application/json',
        ...(options.headers || {})
      }
    });
    const text = await response.text();
    let payload = null;
    try { payload = text ? JSON.parse(text) : null; } catch (error) { payload = text; }
    if (!response.ok) throw new Error(payload?.message || payload?.error_description || `Supabase request failed (${response.status}).`);
    return payload;
  }

  const toCms = (row) => row ? ({
    brandName: row.brand_name,
    companyName: row.company_name,
    legalName: row.legal_name,
    incorporationDate: row.incorporation_date,
    totalQuantity: row.total_quantity,
    totalTurnover: row.total_turnover,
    clientCount: row.client_count,
    directorName: row.director_name,
    ownershipLine: row.ownership_line,
    location: row.location,
    heroEyebrow: row.hero_eyebrow,
    heroDescription: row.hero_description,
    exportHeading: row.export_heading,
    exportMessage: row.export_message,
    phone: row.phone || '',
    whatsapp: row.whatsapp || '',
    email: row.email || ''
  }) : null;

  const fromCms = (data) => ({
    id: 'default',
    brand_name: data.brandName,
    company_name: data.companyName,
    director_name: data.directorName,
    ownership_line: data.ownershipLine,
    location: data.location,
    hero_eyebrow: data.heroEyebrow,
    hero_description: data.heroDescription,
    export_heading: data.exportHeading,
    export_message: data.exportMessage,
    phone: data.phone || '',
    whatsapp: data.whatsapp || '',
    email: data.email || '',
    updated_at: new Date().toISOString()
  });

  async function getSettings() {
    const rows = await request('site_settings?id=eq.default&select=*');
    return toCms(rows?.[0]);
  }

  async function saveSettings(data) {
    await request('site_settings?id=eq.default', {
      method: 'PATCH',
      headers: { Prefer: 'return=minimal' },
      body: JSON.stringify(fromCms(data))
    });
    return data;
  }

  async function createEnquiry(lead) {
    return request('enquiries', {
      method: 'POST',
      headers: { Prefer: 'return=minimal' },
      body: JSON.stringify({
        name: lead.name || '', company: lead.company || '', contact: lead.contact || '',
        interest: lead.interest || 'General enquiry', message: lead.message || '', status: 'New'
      })
    });
  }

  const normalizeLead = (lead) => ({
    ...lead,
    createdAt: lead.created_at || lead.createdAt,
    created_at: undefined
  });

  async function listEnquiries() {
    const rows = await request('enquiries?select=*&order=created_at.desc');
    return (rows || []).map(normalizeLead);
  }

  async function updateEnquiry(id, status) {
    return request(`enquiries?id=eq.${encodeURIComponent(id)}`, {
      method: 'PATCH', headers: { Prefer: 'return=minimal' }, body: JSON.stringify({ status })
    });
  }

  async function deleteEnquiry(id) {
    return request(`enquiries?id=eq.${encodeURIComponent(id)}`, { method: 'DELETE', headers: { Prefer: 'return=minimal' } });
  }

  async function signIn(email, password) {
    if (!enabled) throw new Error('Add the Supabase URL and anon key first.');
    const response = await fetch(`${url}/auth/v1/token?grant_type=password`, {
      method: 'POST', headers: { apikey: anonKey, 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password })
    });
    const payload = await response.json();
    if (!response.ok) throw new Error(payload.error_description || payload.msg || 'Sign in failed.');
    saveSession(payload);
    return payload;
  }

  window.KhaqanCloud = {
    enabled, getSettings, saveSettings, createEnquiry, listEnquiries, updateEnquiry, deleteEnquiry,
    signIn, signOut: () => saveSession(null), session: readSession,
    configured: () => enabled,
    getAccessToken: accessToken
  };
})();
