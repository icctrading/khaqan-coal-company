(() => {
  const cloud = window.KhaqanCloud;
  const authCard = document.querySelector('#cloud-auth-card');
  const loginForm = document.querySelector('#cloud-login-form');
  const logoutButton = document.querySelector('#cloud-logout');
  const status = document.querySelector('#cloud-status');
  const description = document.querySelector('#cloud-description');
  if (!authCard || !loginForm || !cloud) return;

  const setConnected = (email) => {
    status.textContent = 'Supabase CRM connected';
    description.textContent = email ? `Signed in as ${email}. Public content and enquiries can sync through the secured database.` : 'Authenticated cloud connection is active.';
    loginForm.hidden = true;
    logoutButton.hidden = false;
    authCard.classList.add('cloud-connected');
  };

  const setLocal = () => {
    status.textContent = 'Local-only preview';
    description.textContent = 'The public website and CRM are running on browser storage until Supabase is configured.';
    loginForm.hidden = true;
    logoutButton.hidden = true;
  };

  const setNeedsLogin = () => {
    status.textContent = 'Supabase ready — sign in';
    description.textContent = 'Enter the CRM administrator credentials created in Supabase Authentication.';
    loginForm.hidden = false;
    logoutButton.hidden = true;
  };

  async function syncRemote() {
    const settings = await cloud.getSettings();
    if (settings && window.KhaqanCMS) window.KhaqanCMS.save(settings);
    const leads = await cloud.listEnquiries();
    if (window.KhaqanCMS) window.KhaqanCMS.saveLeads(leads);
  }

  if (!cloud.enabled) {
    setLocal();
  } else if (cloud.session()) {
    setConnected(cloud.session().user?.email || 'CRM administrator');
  } else {
    setNeedsLogin();
  }

  loginForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const email = document.querySelector('#cloud-email').value.trim();
    const password = document.querySelector('#cloud-password').value;
    const button = loginForm.querySelector('button');
    button.disabled = true;
    button.textContent = 'Connecting…';
    try {
      const session = await cloud.signIn(email, password);
      await syncRemote();
      setConnected(session.user?.email || email);
      window.sessionStorage.setItem('khaqanCloudJustSynced', '1');
      window.setTimeout(() => window.location.reload(), 350);
    } catch (error) {
      status.textContent = 'Connection failed';
      description.textContent = error.message || 'Check the Supabase configuration and administrator credentials.';
      button.disabled = false;
      button.textContent = 'Connect CRM';
    }
  });

  logoutButton?.addEventListener('click', () => {
    cloud.signOut();
    window.location.reload();
  });

  // Mirror local CRM actions to Supabase when an authenticated cloud session exists.
  document.querySelector('#site-form')?.addEventListener('submit', () => {
    if (!cloud.session()) return;
    window.setTimeout(async () => {
      const data = {};
      document.querySelectorAll('[data-field]').forEach((field) => { data[field.dataset.field] = field.value.trim(); });
      try {
        await cloud.saveSettings({ ...window.KhaqanCMS.get(), ...data });
        description.textContent = 'Saved locally and synced to Supabase.';
      } catch (error) {
        description.textContent = 'Saved locally. Supabase sync needs attention.';
      }
    }, 0);
  }, true);

  document.querySelector('#leads-table-body')?.addEventListener('change', (event) => {
    if (!cloud.session() || !event.target.matches('.lead-status')) return;
    cloud.updateEnquiry(event.target.dataset.id, event.target.value).catch(() => {});
  }, true);
  document.querySelector('#leads-table-body')?.addEventListener('click', (event) => {
    if (!cloud.session() || !event.target.matches('.lead-delete')) return;
    cloud.deleteEnquiry(event.target.dataset.id).catch(() => {});
  }, true);
})();
