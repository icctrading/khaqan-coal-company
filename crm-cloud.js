(async () => {
  const cloud = window.KhaqanCloud;
  const authCard = document.querySelector('#cloud-auth-card');
  const loginForm = document.querySelector('#cloud-login-form');
  const resetForm = document.querySelector('#cloud-reset-form');
  const newPasswordForm = document.querySelector('#cloud-newpassword-form');
  const logoutButton = document.querySelector('#cloud-logout');
  const status = document.querySelector('#cloud-status');
  const description = document.querySelector('#cloud-description');
  const message = document.querySelector('#cloud-auth-message');
  if (!authCard || !loginForm || !cloud) return;

  const resetEmail = document.querySelector('#cloud-reset-email');
  const newPasswordInput = document.querySelector('#cloud-new-password');
  const confirmPasswordInput = document.querySelector('#cloud-new-password-confirm');

  function showMessage(text, ok = true) {
    if (!message) return;
    message.hidden = false;
    message.textContent = text;
    message.classList.toggle('is-error', !ok);
  }
  function hideMessage() { if (message) { message.hidden = true; message.textContent = ''; } }

  function setButton(form, text) {
    const button = form && form.querySelector('button[type="submit"]');
    if (button) button.textContent = text;
  }

  const setConnected = (email) => {
    status.textContent = 'Supabase CRM connected';
    description.textContent = email ? `Signed in as ${email}. Public content and enquiries can sync through the secured database.` : 'Authenticated cloud connection is active.';
    loginForm.hidden = true;
    if (resetForm) resetForm.hidden = true;
    if (newPasswordForm) newPasswordForm.hidden = true;
    logoutButton.hidden = false;
    authCard.classList.add('cloud-connected');
    hideMessage();
  };

  const setLocal = () => {
    status.textContent = 'Local-only preview';
    description.textContent = 'The public website and CRM are running on browser storage until Supabase is configured. Add the Supabase URL and anon key to enable sign-in and email password reset.';
    loginForm.hidden = true;
    if (resetForm) resetForm.hidden = true;
    if (newPasswordForm) newPasswordForm.hidden = true;
    logoutButton.hidden = true;
  };

  const setNeedsLogin = () => {
    status.textContent = 'Supabase ready — sign in';
    description.textContent = 'Enter the CRM administrator credentials created in Supabase Authentication.';
    loginForm.hidden = false;
    if (resetForm) resetForm.hidden = true;
    if (newPasswordForm) newPasswordForm.hidden = true;
    logoutButton.hidden = true;
    hideMessage();
  };

  function showResetRequest() {
    status.textContent = 'Reset CRM password';
    description.textContent = 'Enter the administrator email and Supabase will send a reset link. The link must point back to this CRM page — add its URL to Supabase → Authentication → URL Configuration → Redirect URLs.';
    loginForm.hidden = true;
    if (newPasswordForm) newPasswordForm.hidden = true;
    if (resetForm) {
      resetForm.hidden = false;
      (resetEmail || document.querySelector('#cloud-email')).focus?.();
      if (resetEmail && !resetEmail.value) {
        const loginEmail = document.querySelector('#cloud-email');
        if (loginEmail) resetEmail.value = loginEmail.value;
      }
    }
    hideMessage();
  }

  function showNewPassword() {
    status.textContent = 'Set a new password';
    description.textContent = 'The reset link was accepted. Choose a new password for the CRM administrator account.';
    loginForm.hidden = true;
    if (resetForm) resetForm.hidden = true;
    if (newPasswordForm) {
      newPasswordForm.hidden = false;
      newPasswordInput?.focus();
    }
    hideMessage();
  }

  async function syncRemote() {
    const settings = await cloud.getSettings();
    if (settings && window.KhaqanCMS) window.KhaqanCMS.save(settings);
    const leads = await cloud.listEnquiries();
    if (window.KhaqanCMS) window.KhaqanCMS.saveLeads(leads);
  }

  async function finishSignedIn(session) {
    let email = session?.user?.email || '';
    try {
      const user = await cloud.getCurrentUser();
      email = user?.email || email;
    } catch (error) { /* session still valid without the profile read */ }
    await syncRemote().catch(() => {});
    setConnected(email || 'CRM administrator');
    window.sessionStorage.setItem('khaqanCloudJustSynced', '1');
    window.setTimeout(() => window.location.reload(), 500);
  }

  /* ---- Recovery link: handle both Supabase auth flow types -------------
     Implicit flow lands with #access_token=…&type=recovery
     PKCE flow lands with ?code=…                                           */
  async function consumeRecoveryLink() {
    const hash = window.location.hash || '';
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    const isRecoveryHash = /access_token=/.test(hash) && /type=recovery/.test(hash);
    if (!code && !isRecoveryHash) return false;
    try {
      if (isRecoveryHash) cloud.saveSessionFromHash(hash);
      else await cloud.exchangeRecoveryCode(code);
      // Clean the URL so a refresh/back-button doesn't replay the token.
      window.history.replaceState({}, document.title, window.location.pathname);
      showNewPassword();
      return true;
    } catch (error) {
      setNeedsLogin();
      showMessage(error.message || 'This reset link is invalid or has expired. Request a new one.', false);
      window.history.replaceState({}, document.title, window.location.pathname);
      return true;
    }
  }

  if (!cloud.enabled) {
    setLocal();
  } else if (await consumeRecoveryLink()) {
    // Recovery flow owns the card; the new-password form is now showing.
  } else if (cloud.session()) {
    setConnected(cloud.session().user?.email || 'CRM administrator');
  } else {
    setNeedsLogin();
  }

  loginForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const email = document.querySelector('#cloud-email').value.trim();
    const password = document.querySelector('#cloud-password').value;
    const button = loginForm.querySelector('button[type="submit"]');
    button.disabled = true;
    const original = button.textContent;
    button.textContent = 'Connecting…';
    hideMessage();
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
      button.textContent = original;
    }
  });

  document.querySelector('#cloud-forgot')?.addEventListener('click', () => {
    if (!cloud.enabled) { showMessage('Connect Supabase first — password reset emails are sent through it.', false); return; }
    showResetRequest();
  });
  document.querySelector('#cloud-reset-cancel')?.addEventListener('click', setNeedsLogin);
  document.querySelector('#cloud-newpassword-cancel')?.addEventListener('click', setNeedsLogin);

  resetForm?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const email = resetEmail.value.trim();
    const button = resetForm.querySelector('button[type="submit"]');
    button.disabled = true;
    const original = button.textContent;
    button.textContent = 'Sending…';
    hideMessage();
    try {
      await cloud.requestPasswordReset(email);
      showMessage(`If ${email} is a CRM administrator, a password reset link is on its way. Check the inbox and spam folder, then open the link to set a new password.`);
      button.textContent = 'Resend reset link';
    } catch (error) {
      showMessage(error.message || 'The reset email could not be sent. Try again in a moment.', false);
      button.textContent = original;
    } finally {
      button.disabled = false;
    }
  });

  newPasswordForm?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const password = newPasswordInput.value;
    const confirm = confirmPasswordInput.value;
    if (password.length < 8) { showMessage('Use at least 8 characters for the new password.', false); return; }
    if (password !== confirm) { showMessage('The two passwords do not match.', false); return; }
    const button = newPasswordForm.querySelector('button[type="submit"]');
    button.disabled = true;
    const original = button.textContent;
    button.textContent = 'Saving…';
    hideMessage();
    try {
      await cloud.resetPassword(password);
      showMessage('Password updated. Signing you in…');
      await finishSignedIn(cloud.session());
    } catch (error) {
      showMessage(error.message || 'The new password could not be saved. Request a fresh reset link.', false);
      button.disabled = false;
      button.textContent = original;
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
