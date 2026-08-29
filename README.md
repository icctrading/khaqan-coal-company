# Khaqan Coal Company website

## Run locally

```bash
python3 -m http.server 8000 --bind 0.0.0.0
```

Open the live preview for port 8000. The public site is `index.html`, the business portfolio is `profile.html`, and the browser CRM is `crm.html`.

## Browser CRM

The CRM is locked behind a real login. Opening `crm.html` without an authenticated admin session shows only a **sign-in / sign-up / forgot-password** screen — no metrics, enquiries, media, site-content fields, sidebar tabs, or JSON export/import are rendered or reachable until you pass the gate.

- **Sign in**: an Auth user whose UUID is allow-listed in `public.admin_users` (checked via `public.is_admin()`) gets the full Control Room.
- **Sign up**: `cloud.js` exposes `signUp(email, password)` via `POST /auth/v1/signup`. Signing up creates an account but grants **no** CRM access — the new user sees “account created — wait for an administrator to allow-list your user in `admin_users`”. If Supabase email confirmation is on, the sign-up flow asks them to confirm their email first.
- **Password reset**: the **Forgot password?** link emails a recovery link that returns to `crm.html` and opens the **Set a new password** form (both implicit `#access_token` and PKCE `?code` links are handled). Recovery lands on the auth screen, never the CRM.
- **Admin workspace**: after sign-in you can edit website identity/director/ownership/location/hero text/contact channels, manage enquiries (status, search, delete, clear, export/import JSON backups), and manage the media library and leadership portraits. Only an admin session triggers `listEnquiries` / `listMedia` / CRM `getSettings`; public pages stay public and the Contact form still creates enquiries.
- **Media library**: upload images/videos and *manage* items — retitle, move to another part of the site, swap the file, or remove it. With an admin session files go to the shared Supabase `media` bucket; if a cloud request fails, the same UI falls back to `localStorage` (12 MB/file) — but only after admin login.
- **Leadership portraits**: upload/replace/remove the Director, CEO, MD and CFO photographs shown in the rotating leadership hero (Home) and team cards (About).

Connect the UI to Supabase with `supabase/schema.sql` and `supabase-config.js`. The schema creates the `media` table and the public `media` Storage bucket (anon read, `is_admin()` write/delete) and the `is_admin()` gate. The **first user still needs an explicit `insert into public.admin_users (user_id)`** — signing up or creating the Auth user alone does not grant access (see `deploy.md`).

## Hosting

The project is Vercel-ready. See `deploy.md` for the GitHub → Supabase → Vercel sequence, RLS setup, environment/security notes, and stable public URL steps. The old Arena preview URLs are temporary and can expire.

## Media

Reference mining photos and open-licensed short videos are in `/media`. Attribution and license notes are in `/media/credits.md`. Replace them with original Khaqan Coal Company photographs and footage before public commercial launch.

## Brand themes

The site ships with three premium brand skins — **Signature** (forest coal & gold, the original look), **Marble Gold** (white marble by day / black marble by night) and **Obsidian** (metallic black & gold by night / platinum by day). Use the **◈ Theme** button in the header (and in the CRM) to switch; the ☼/☾ toggle keeps day/night mode inside every theme. Choices persist per browser and sync across open tabs.

Official logo artwork lives in `media/brand/`; production versions (`media/logo-mark.png`, `favicon.png`) are derived from it.

## Caching, service worker and scroll performance

See `deploy.md` → “Caching” and “Scrolling performance conventions”. In short: assets are
`immutable` and keyed by their `?v=` token, `sw.js` handles offline and repeat visits, and
decorative work (canvas, animations, filters) pauses while the page is being scrolled.
When you edit a CSS or JS file, raise its `?v=` number in every HTML page and in `sw.js`.
