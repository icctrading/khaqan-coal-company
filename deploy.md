# Khaqan Coal Company deployment checklist

The current preview is an ephemeral sandbox. It can expire, which is why old preview URLs may show “Sandbox Not Found”. Vercel gives the public website a stable URL.

## 1. Create the GitHub repository

Create a private or public repository in the GitHub account that uses the company email, then run from this folder:

```bash
git init
git add .
git commit -m "Initial Khaqan Coal Company website and CRM"
git branch -M main
git remote add origin https://github.com/YOUR-GITHUB-USERNAME/YOUR-REPOSITORY.git
git push -u origin main
```

Do not commit passwords, service-role keys, or `.env` files.

## 2. Create the Supabase project

1. Create a Supabase project using the desired company email.
2. Open **SQL Editor**.
3. Run `supabase/schema.sql`.
4. Open **Authentication → Users** and create the CRM administrator with the company email.
5. Copy that user UUID and run the final `insert into public.admin_users` statement shown in the SQL file.
6. Open **Project Settings → API** and copy the Project URL and the public anon/publishable key into `supabase-config.js`.
7. Never use the `service_role` key in the browser or GitHub.

The website can read public site settings and create contact enquiries. Only the allow-listed authenticated CRM user can edit content or view/manage enquiries because of Row Level Security.

## 3. Deploy to Vercel

1. Open Vercel and choose **Add New → Project**.
2. Import the GitHub repository.
3. Keep the project root as `/`.
4. No build command is required; this is a static site.
5. Deploy.
6. The `vercel.json` file provides clean page routes such as `/about`, `/operations`, `/contact`, and `/crm` plus caching/security headers.

After deployment:

- Public website: `https://YOUR-VERCEL-DOMAIN.vercel.app/`
- CRM: `https://YOUR-VERCEL-DOMAIN.vercel.app/crm`

## 4. Connect future custom domain

In Vercel, open **Project → Settings → Domains**, add the company domain, and follow the DNS records Vercel provides.

## Important security note

The browser only needs the public Supabase anon/publishable key. The database policies in `supabase/schema.sql` are the security boundary. Never expose the Supabase service-role key, GitHub token, Vercel token, or an email password in the website code.

## 5. Caching — how the site is stored on a visitor's device

Three layers, all of them safe to deploy without any build step:

1. **HTTP cache (Vercel only).** `vercel.json` sets `max-age=31536000, immutable` on
   `*.css` / `*.js` and everything under `media/`, `max-age=0, must-revalidate` with a
   `stale-while-revalidate=3600` window on HTML, and `no-store` on `sw.js`. A deploy
   on any other host (GitHub Pages, for example) cannot set headers — the next two
   layers still work there.
2. **Version tokens.** Every stylesheet and script is linked as `file.css?v=N`.
   The token *is* the cache key, so an asset may be `immutable` and still update
   instantly. **When you edit `styles.css`, `themes.css`, `script.js`, `crm.css`,
   `crm.js`, `cloud.js` or `supabase-config.js`, raise that file's `?v=` number in
   all nine HTML pages and in the `SHELL` list at the top of `sw.js`.** Forgetting
   this is the only way to ship a change nobody can see.
3. **Service worker (`sw.js`).** Precaches the shell, serves pages network-first with
   an offline fallback, serves assets stale-while-revalidate and media cache-first, and
   evicts the oldest half of its entries past 180 so the origin's quota cannot grow
   without bound. Bump `VERSION` (`khaqan-coal-vN`) whenever the HTML set changes; the
   activate step deletes every older cache.

Each page also carries one `<link rel="preload" as="image">` for the first frame of its
coal backdrop, and the day-mode hero photograph deliberately uses **that same file** —
one download feeds both the hero and the canvas (measured on this repo: home LCP
573ms → 425ms, About 628ms → 354ms on a 4×-throttled phone). If you give a page a new
hero image, change its preload to match.

Diagnostics, from the browser console:

```js
KhaqanCache.clear()   // drop every cached response and reload — use after a bad deploy
caches.keys()         // what is on disk right now
```

Speculative loading is on too: a `<script type="speculationrules">` block in each page
prerenders the sibling page as soon as a visitor hovers a menu link (whole document,
images included), so the next page appears instantly. Browsers that cannot parse it get
a plain `<link rel="prefetch">` from `script.js` instead. Both are skipped when the
device reports `saveData` or a 2g connection.

## 6. Scrolling performance conventions

Things that are deliberately true about this codebase, and worth keeping:

- The cinematic backdrop (`script.js`) **stops requesting animation frames while the
  page is being scrolled** and resumes on a `khaqan:scroll-end` event. Do not move that
  canvas back onto a per-frame CSS `filter:` — a filtered fixed layer repaints on every
  frame of the scroll.
- `html.is-scrolling` is set for the duration of a scroll gesture; `themes.css` uses it
  to pause ~14 decorative animations and to drop the one remaining `backdrop-filter`.
- Long sections use `content-visibility: auto` with `contain-intrinsic-size: auto 720px`
  so off-screen work is skipped. Anything *inside* a section therefore needs no special
  reveal handling; the menu bar and hero do not use it, on purpose.
- Scroll reveals start ~200px before a block enters the viewport, so text is already in
  place when the reader arrives instead of animating in under the scrollbar.
- Measured on the last pass: cumulative layout shift across a whole-page scroll is
  0.0001 or zero on all seven content pages, so the fixed bar, the drawer and
  `content-visibility` together stay geometrically still. If a change makes that number
  move, it is a scroll regression, not a cosmetic one.
- Header tuck hides the bar on a *deliberate* downward gesture (>= 120px past the hero,
  >= 80px net) and reveals it on upward scroll, on keyboard focus entering the header,
  and at `y < 240`. It must never tuck while the drawer is open, while the theme popup
  is open, while a field in it has focus, or while a scroll animation is running - a bar
  sliding out from under an open control is the classic way a header feels broken.
- Anchored targets get `scroll-padding-top: var(--bar-total)`, so a deep link lands below
  the bar instead of under it (checked with `#ticker`, which lands ~30px clear).
- Keyboard behaviour in the bar: a skip link jumps past the header; opening the drawer
  focuses the active link, traps Tab inside the bar (the rest of the page is `inert`,
  with a focus-ring fallback where `inert` is unsupported) and restores focus to the
  toggle on `Esc`; the theme popup is a `role="menu"` with `aria-activedescendant`, so
  ArrowUp/Down/Home/End move the selection and Enter/`Esc` return focus to the toggle.
  Keep exactly one `#skin-menu` per page - the toggle references it by id.
