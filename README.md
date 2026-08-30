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
- **Admin workspace**: after sign-in you can edit website identity/director/ownership/location/hero text/contact channels, manage enquiries (status, search, delete, clear, export/import JSON backups), and manage the media library and leadership portraits. Destructive actions ask through an **in-page confirmation** (never `window.confirm`, which browsers suppress inside embedded frames — a suppressed dialog silently cancelled deletes), and every one of them names exactly what is removed, including the bucket file. Only an admin session triggers `listEnquiries` / `listMedia` / CRM `getSettings`; public pages stay public and the Contact form still creates enquiries.
- **Media library**: upload images/videos and tag them with a **page** and **page area** (Home · Field notes, About · Valley story, Gallery · Motion from the field, and so on). Named slots replace the stock photograph already on that part of the public page; gallery areas feed “Fresh from the field”. Each card shows the page + area reference and a link to open that page. **Edit** retitles or moves an item, **Replace** swaps the file, **Remove** takes it off the website (kept in Library only, stock image returns), **Delete** removes it for good — the catalogue row, the browser copy **and the file in the Supabase `media` bucket**. With an admin session files go to the shared bucket; if a cloud request fails, the change is kept in this browser **and queued** (`KhaqanSync`, metadata in localStorage, raw files in IndexedDB) — it is retried on page load, on sign-in, when the network returns and on a background timer, so nothing is lost on sign-out or refresh. Deleting an item also **drops its queued upload**, so a delete can never be resurrected by a retry, and a delete that Supabase's RLS refuses is reported instead of looking successful.
- **All media (tab 04)**: every file the site serves in one table — cloud rows and browser-only uploads, where each one appears, its size and its exact object path in the bucket — with search, page/type/storage filters, multi-select bulk delete, a **Supabase storage** panel that lists orphaned bucket files (files no catalogue row points at) for a one-click purge, and a read-only inventory of the stock media shipped in `media/` (those files live in Git and cannot be deleted from a browser — the panel says so and shows which pages reference each one).
- **Headings, captions & tiles**: every section head, frame caption and reel chapter tile can be re-worded without touching HTML. Pick a page + area (and optionally a frame) and set the eyebrow / heading / intro, or the caption / heading / **tile label** shown on the tile beside the home reel — stock frames included, and no upload needed. The tile's thumbnail follows an uploaded file automatically and returns to the stock image when it is deleted. Overrides are stored in `site_settings.slot_copy` (one jsonb map keyed `home:reel` / `home:reel:4`), so they save, queue and sync with the rest of the site content; leaving a box blank (or clearing the spot) hands the page back the wording that ships in the HTML.
- **Leadership portraits**: upload/replace/remove the Director, CEO, MD and CFO photographs shown in the rotating leadership hero (Home) and team cards (About).
- **Browser storage**: the media list is kept in memory and written through to `localStorage`. If the origin's quota is full (large data-URL uploads), writes no longer fail silently — the Control Room keeps the change for the session and the **All media** tab shows a warning strip explaining that originals belong in Supabase storage. Videos/images over 12 MB are only accepted with an admin session (up to 50 MB in the bucket), so the quota is rarely reached in normal use.

Existing projects only need `supabase/migrate-slot-copy-and-media.sql` (adds `site_settings.slot_copy`, the media placement indexes and re-states the media/bucket **delete** policies); new ones get everything from `supabase/schema.sql`.

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
