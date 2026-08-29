/* Optional Supabase bridge. The site works in local-only mode until supabase-config.js is filled. */
(() => {
  const config = window.KHAQAN_SUPABASE || {};
  const url = String(config.url || '').replace(/\/$/, '');
  const anonKey = String(config.anonKey || '');
  const sessionKey = 'khaqanSupabaseSession';
  const pkceKey = 'khaqanSupabasePkceVerifier';
  const enabled = Boolean(url && anonKey);

  const readSession = () => {
    try { return JSON.parse(localStorage.getItem(sessionKey) || 'null'); } catch (error) { return null; }
  };
  const randomVerifier = () => {
    const bytes = new Uint8Array(64);
    (window.crypto || window.msCrypto).getRandomValues(bytes);
    return btoa(String.fromCharCode(...bytes)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  };
  async function pkceChallenge(verifier) {
    const digest = await window.crypto.subtle.digest('SHA-256', new TextEncoder().encode(verifier));
    return btoa(String.fromCharCode(...new Uint8Array(digest))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  }
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

  /* Step 1 of a password reset: Supabase emails the administrator a link.
     The link's redirect target must be this CRM page — add the CRM's public
     URL under Supabase → Authentication → URL Configuration → Redirect URLs.
     We generate a PKCE pair and keep the verifier so the code step works when
     the project's Auth flow type is PKCE; implicit-flow projects ignore it. */
  async function requestPasswordReset(email) {
    if (!enabled) throw new Error('Add the Supabase URL and anon key first.');
    const redirectTo = `${window.location.origin}${window.location.pathname}`;
    let verifier = '';
    let challengeParams = {};
    try {
      verifier = randomVerifier();
      const challenge = await pkceChallenge(verifier);
      challengeParams = { code_challenge: challenge, code_challenge_method: 's256' };
      try { window.localStorage.setItem(pkceKey, verifier); } catch (error) { /* private mode */ }
    } catch (error) { /* fall back to implicit/hash recovery */ }
    const response = await fetch(`${url}/auth/v1/recover`, {
      method: 'POST',
      headers: { apikey: anonKey, 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, redirect_to: redirectTo, ...challengeParams })
    });
    const payload = await response.text();
    let parsed = null;
    try { parsed = payload ? JSON.parse(payload) : null; } catch (error) { parsed = payload; }
    if (!response.ok) throw new Error((parsed && (parsed.error_description || parsed.msg || parsed.message)) || 'Could not start the password reset.');
    return parsed || true;
  }

  /* Implicit-flow recovery: the email link lands with #access_token=… */
  function saveSessionFromHash(hash) {
    const params = new URLSearchParams((hash || '').replace(/^#/, ''));
    const accessToken = params.get('access_token');
    const refreshToken = params.get('refresh_token');
    const expiresIn = Number(params.get('expires_in') || 3600);
    if (!accessToken) return null;
    const payload = {
      access_token: accessToken,
      refresh_token: refreshToken || '',
      token_type: params.get('token_type') || 'bearer',
      expires_in: expiresIn,
      expires_at: Math.floor(Date.now() / 1000) + expiresIn,
      user: { id: params.get('user_id') || '', email: '' }
    };
    saveSession(payload);
    return payload;
  }

  /* PKCE-flow recovery: the email link lands with ?code=… — exchange it
     using the verifier saved when the reset was requested. */
  async function exchangeRecoveryCode(code) {
    const verifier = (() => { try { return window.localStorage.getItem(pkceKey) || ''; } catch (error) { return ''; } })();
    try { window.localStorage.removeItem(pkceKey); } catch (error) { /* no-op */ }
    const response = await fetch(`${url}/auth/v1/token?grant_type=pkce`, {
      method: 'POST',
      headers: { apikey: anonKey, 'Content-Type': 'application/json' },
      body: JSON.stringify({ auth_code: code, code_verifier: verifier })
    });
    const payload = await response.json();
    if (!response.ok) throw new Error(payload.error_description || payload.msg || 'The reset link is invalid or has expired.');
    saveSession(payload);
    return payload;
  }

  async function resetPassword(newPassword) {
    const session = readSession();
    if (!session || !session.access_token) throw new Error('This reset link has expired. Request a new one and use it straight away.');
    const response = await fetch(`${url}/auth/v1/user`, {
      method: 'PUT',
      headers: { apikey: anonKey, Authorization: `Bearer ${session.access_token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: newPassword })
    });
    const payload = await response.json();
    if (!response.ok) throw new Error(payload.error_description || payload.msg || 'The new password could not be saved.');
    // The recovery session stays valid as a normal CRM login.
    return payload;
  }

  /* Fetch the signed-in administrator's profile (used after a recovery-link
     login so the CRM can show the account email). */
  async function getCurrentUser() {
    const response = await fetch(`${url}/auth/v1/user`, {
      headers: { apikey: anonKey, Authorization: `Bearer ${accessToken()}` }
    });
    const payload = await response.json();
    if (!response.ok) throw new Error(payload.error_description || payload.msg || 'Could not read the account.');
    const session = readSession();
    if (session) { session.user = payload; saveSession(session); }
    return payload;
  }

  window.KhaqanCloud = {
    enabled, getSettings, saveSettings, createEnquiry, listEnquiries, updateEnquiry, deleteEnquiry,
    signIn, requestPasswordReset, exchangeRecoveryCode, saveSessionFromHash, resetPassword, getCurrentUser,
    signOut: () => saveSession(null), session: readSession,
    configured: () => enabled,
    getAccessToken: accessToken
  };
})();
