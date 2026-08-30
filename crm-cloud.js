/* CRM authentication gate.

   crm.html ships the full Control Room inside a <template>; it is cloned into
   the document (and crm.js is allowed to render leads / media / site content)
   only after a signed-in account passes public.is_admin(). Until then this
   module owns the page and shows exactly one of:
     - the sign-in / sign-up / reset screen (no session), or
     - the "account created — wait for an administrator" screen (session that
       is not allow-listed in admin_users).
   No listEnquiries / listMedia / getSettings call for the CRM happens before
   that admin check succeeds. */
(async () => {
  const cloud = window.KhaqanCloud;
  if (!cloud) return;

  const authScreen = document.querySelector('#crm-auth-screen');
  const pendingScreen = document.querySelector('#crm-pending-screen');
  const bootStatus = document.querySelector('#crm-boot-status');
  const logoutButton = document.querySelector('#cloud-logout');
  const logoutPendingButton = document.querySelector('#cloud-logout-pending');
  const message = document.querySelector('#cloud-auth-message');
  const workspaceTemplate = document.querySelector('#crm-workspace-template');
  const main = document.getElementById('main');

  const loginForm = document.querySelector('#cloud-login-form');
  const signupForm = document.querySelector('#cloud-signup-form');
  const resetForm = document.querySelector('#cloud-reset-form');
  const newPasswordForm = document.querySelector('#cloud-newpassword-form');
  const signupSwitch = document.querySelector('#cloud-signup-switch');
  const resetSwitch = document.querySelector('#cloud-reset-switch');
  const newPasswordSwitch = document.querySelector('#cloud-newpassword-switch');

  const loginEmail = document.querySelector('#cloud-email');
  const loginPassword = document.querySelector('#cloud-password');
  const signupEmail = document.querySelector('#cloud-signup-email');
  const signupPassword = document.querySelector('#cloud-signup-password');
  const signupPasswordConfirm = document.querySelector('#cloud-signup-password-confirm');
  const resetEmail = document.querySelector('#cloud-reset-email');
  const newPasswordInput = document.querySelector('#cloud-new-password');
  const confirmPasswordInput = document.querySelector('#cloud-new-password-confirm');

  let workspaceMounted = false;

  function hideBootStatus() {
    if (bootStatus) bootStatus.hidden = true;
  }

  function showMessage(text, ok = true) {
    if (!message) return;
    message.hidden = false;
    message.textContent = text;
    message.classList.toggle('is-error', !ok);
  }
  function hideMessage() {
    if (!message) return;
    message.hidden = true;
    message.textContent = '';
  }

  /* Switch which auth sub-form is visible; everything else stays hidden. */
  function showForm(next) {
    if (loginForm) loginForm.hidden = next !== loginForm;
    if (signupForm) signupForm.hidden = next !== signupForm;
    if (resetForm) resetForm.hidden = next !== resetForm;
    if (newPasswordForm) newPasswordForm.hidden = next !== newPasswordForm;
    if (signupSwitch) signupSwitch.hidden = next !== signupForm;
    if (resetSwitch) resetSwitch.hidden = next !== resetForm;
    if (newPasswordSwitch) newPasswordSwitch.hidden = next !== newPasswordForm;
    hideMessage();
  }
  const showSignIn = () => { showForm(loginForm); };
  const showSignUp = () => { showForm(signupForm); };
  const showResetRequest = () => {
    showForm(resetForm);
    if (resetEmail && !resetEmail.value && loginEmail) resetEmail.value = loginEmail.value;
    resetEmail?.focus?.();
  };
  const showNewPassword = () => {
    showForm(newPasswordForm);
    newPasswordInput?.focus?.();
  };

  function showAuthScreen() {
    hideBootStatus();
    if (authScreen) authScreen.hidden = false;
    if (pendingScreen) pendingScreen.hidden = true;
    if (logoutButton) logoutButton.hidden = true;
    showSignIn();
  }

  function showPendingScreen() {
    hideBootStatus();
    if (authScreen) authScreen.hidden = true;
    if (pendingScreen) pendingScreen.hidden = false;
    if (logoutButton) logoutButton.hidden = true;
  }

  function mountWorkspace() {
    if (workspaceMounted || !workspaceTemplate || !main) return;
    workspaceMounted = true;
    main.appendChild(workspaceTemplate.content.cloneNode(true));
  }

  /* Only called after is_admin() passes — this is the first point any CRM
     data is read from Supabase. */
  async function syncRemote() {
    const settings = await cloud.getSettings();
    if (settings && window.KhaqanCMS) window.KhaqanCMS.hydrate(settings);
    const leads = await cloud.listEnquiries();
    if (window.KhaqanCMS) window.KhaqanCMS.saveLeads(leads);
    try {
      const media = await cloud.listMedia();
      if (Array.isArray(media) && window.KhaqanMedia) window.KhaqanMedia.setAll(media);
    } catch (error) { /* keep the local media library if Storage is not ready */ }
  }

  async function enterAdminWorkspace() {
    hideBootStatus();
    if (authScreen) authScreen.hidden = true;
    if (pendingScreen) pendingScreen.hidden = true;
    mountWorkspace();
    await syncRemote().catch(() => {});
    if (typeof window.KhaqanCRMInit === 'function') window.KhaqanCRMInit();
    if (logoutButton) logoutButton.hidden = false;
  }

  async function afterSignIn(session) {
    let email = session?.user?.email || '';
    try {
      const user = await cloud.getCurrentUser();
      email = user?.email || email;
    } catch (error) {
      /* An expired / revoked token (401) must not strand the visitor on the
         "waiting for approval" screen — clear it and offer sign in again. */
      if (error && error.status === 401) {
        cloud.signOut();
        showAuthScreen();
        showMessage('Your sign-in session has expired. Sign in again.', false);
        return;
      }
      /* otherwise the session is still valid without the profile read */
    }
    const admin = await cloud.isAdmin().catch(() => false);
    if (admin) await enterAdminWorkspace();
    else {
      if (pendingScreen) {
        const note = pendingScreen.querySelector('.crm-pending-email');
        if (note && email) note.textContent = `Signed in as ${email}.`;
      }
      showPendingScreen();
    }
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
    hideBootStatus();
    try {
      if (isRecoveryHash) cloud.saveSessionFromHash(hash);
      else await cloud.exchangeRecoveryCode(code);
      window.history.replaceState({}, document.title, window.location.pathname);
      if (authScreen) authScreen.hidden = false;
      if (pendingScreen) pendingScreen.hidden = true;
      showNewPassword();
      return true;
    } catch (error) {
      if (authScreen) authScreen.hidden = false;
      showSignIn();
      showMessage(error.message || 'This reset link is invalid or has expired. Request a new one.', false);
      window.history.replaceState({}, document.title, window.location.pathname);
      return true;
    }
  }

  /* ---- Boot: decide which screen owns the page ------------------------- */
  /* The auth screen ships hidden so a signed-in refresh never flashes the
     sign-in card; this status line is the only thing painted while the
     session check runs. */
  if (bootStatus) bootStatus.hidden = false;
  if (!cloud.enabled) {
    showAuthScreen();
    showMessage('Supabase is not configured — add the project URL and anon key to supabase-config.js to enable sign-in.', false);
  } else if (await consumeRecoveryLink()) {
    // Recovery flow owns the screen; the new-password form is showing.
  } else if (cloud.session()) {
    await afterSignIn(cloud.session());
  } else {
    showAuthScreen();
  }

  /* ---- Auth form handlers --------------------------------------------- */
  loginForm?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const email = loginEmail.value.trim();
    const password = loginPassword.value;
    const button = loginForm.querySelector('button[type="submit"]');
    button.disabled = true;
    const original = button.textContent;
    button.textContent = 'Signing in…';
    hideMessage();
    try {
      const session = await cloud.signIn(email, password);
      await afterSignIn(session);
    } catch (error) {
      showMessage(error.message || 'Check the administrator credentials and try again.', false);
      button.disabled = false;
      button.textContent = original;
    }
  });

  signupForm?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const email = signupEmail.value.trim();
    const password = signupPassword.value;
    const confirm = signupPasswordConfirm.value;
    if (password.length < 8) { showMessage('Use at least 8 characters for the password.', false); return; }
    if (password !== confirm) { showMessage('The two passwords do not match.', false); return; }
    const button = signupForm.querySelector('button[type="submit"]');
    button.disabled = true;
    const original = button.textContent;
    button.textContent = 'Creating account…';
    hideMessage();
    try {
      const result = await cloud.signUp(email, password);
      if (result && result.access_token) {
        // Email confirmation is off — a session was returned. The new account
        // still has no CRM access until it is allow-listed in admin_users.
        await afterSignIn(result);
      } else {
        // Email confirmation is on — no session yet. Ask them to confirm.
        showSignIn();
        showMessage(`Account created for ${email}. Confirm your email — check your inbox (and spam) for the confirmation link, then sign in here. An administrator must still allow-list you before any CRM data is shown.`);
      }
    } catch (error) {
      showMessage(error.message || 'That account could not be created. Try a different email.', false);
      button.disabled = false;
      button.textContent = original;
    }
  });

  document.querySelector('#cloud-show-signup')?.addEventListener('click', showSignUp);
  document.querySelector('#cloud-forgot')?.addEventListener('click', () => {
    if (!cloud.enabled) { showMessage('Connect Supabase first — password reset emails are sent through it.', false); return; }
    showResetRequest();
  });
  document.querySelector('#cloud-signup-cancel')?.addEventListener('click', showSignIn);
  document.querySelector('#cloud-reset-cancel')?.addEventListener('click', showSignIn);
  document.querySelector('#cloud-newpassword-cancel')?.addEventListener('click', showSignIn);

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
      showMessage('Password updated. Checking your access…');
      await afterSignIn(cloud.session());
    } catch (error) {
      showMessage(error.message || 'The new password could not be saved. Request a fresh reset link.', false);
      button.disabled = false;
      button.textContent = original;
    }
  });

  logoutButton?.addEventListener('click', () => { cloud.signOut(); window.location.reload(); });
  logoutPendingButton?.addEventListener('click', () => { cloud.signOut(); window.location.reload(); });

  /* ---- Mirror local CRM actions to Supabase once an admin session exists.
     Delegated on `document` because the workspace mounts after login. ----- */
  document.addEventListener('submit', (event) => {
    if (!event.target || (event.target.id !== 'site-form' && event.target.id !== 'leadership-form' && event.target.id !== 'rotation-form')) return;
    if (!cloud.session()) return;
    window.setTimeout(async () => {
      const data = {};
      document.querySelectorAll('[data-field]').forEach((field) => { data[field.dataset.field] = field.value.trim(); });
      try { await cloud.saveSettings({ ...window.KhaqanCMS.get(), ...data }); }
      catch (error) { /* saved locally; cloud sync needs attention */ }
    }, 0);
  }, true);

  document.addEventListener('change', (event) => {
    if (!cloud.session() || !event.target.matches('.lead-status')) return;
    cloud.updateEnquiry(event.target.dataset.id, event.target.value).catch(() => {});
  }, true);

  document.addEventListener('click', (event) => {
    if (!cloud.session() || !event.target.matches('.lead-delete')) return;
    cloud.deleteEnquiry(event.target.dataset.id).catch(() => {});
  }, true);
})();
