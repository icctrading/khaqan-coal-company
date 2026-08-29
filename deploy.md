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

### Password reset by email (CRM sign-in)

The CRM's **Forgot password?** link sends a Supabase recovery email. For the link to return the administrator to the CRM:

1. Open **Authentication → URL Configuration**.
2. Set **Site URL** to the public CRM address, e.g. `https://YOUR-VERCEL-DOMAIN.vercel.app/crm.html` (or `/crm` with the Vercel clean route).
3. Add the same address to **Redirect URLs** (include both the local preview, e.g. `http://localhost:8000/crm.html`, and every deployed domain).
4. The emailed link opens the CRM with a recovery token; the CRM then shows a **Set a new password** form. Both Supabase auth flow types are handled automatically (implicit `#access_token` links and PKCE `?code` links).

Without the redirect allow-list entry, Supabase blocks the redirect and the reset link cannot return to the CRM. Email delivery is handled by Supabase's built-in mail service (or a custom SMTP provider under **Authentication → Emails** for production).

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

   The same rule applies to media that a script **re-derives in place** - the
   `logo-mark*` renditions and `media/icons/*` carry `?v=1`, in the markup, in
   `site.webmanifest`, and in `SHELL` (a shell entry that is not byte-identical to the
   requested URL precaches nothing). Photographs need no token: replacing one means a new
   filename, which is already a new key.
3. **Service worker (`sw.js`).** Precaches the shell, serves pages network-first with
   an offline fallback, serves assets stale-while-revalidate and media cache-first, and
   evicts the oldest half of its entries past 180 so the origin's quota cannot grow
   without bound. Bump `VERSION` (`khaqan-coal-vN`) whenever the HTML set changes; the
   activate step deletes every older cache.

Each page also carries one `<link rel="preload" as="image">` for the first frame of its
coal backdrop, and the hero photograph deliberately reuses a file the page already loads:
**day** names the preloaded frame, **night** names one of the backdrop frames (V24) -
one download feeds the hero, the canvas and the preload together (measured on this repo:
home LCP 573ms → 425ms, About 628ms → 354ms on a 4×-throttled phone, and 1.06MB of
exclusive night-mode hero bytes removed across five inner pages). A theme-specific hero
file that nothing else needs lands on the LCP critical path for that theme alone, so if
you introduce one, add it to the preload list instead of leaving it to CSS discovery.

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

### Fonts

Both families are requested as **variable ranges**, not as a list of static weights:

```
family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Inter:ital,wght@0,300..900;1,300..900
```

The stylesheets set weights the old static request could not serve (`font-weight: 850` on
69 elements on the home page, plus 750/650, and Inter italics) - those were silently
rounding to the nearest supplied face and synthesising obliques. One variable file per
style covers every weight the CSS asks for, and it is fewer requests and fewer service
worker cache entries than five static ones. Keep `&display=swap` and the
`preconnect` to `fonts.gstatic.com` together with it.

### Image renditions

Figure walls (`<picture>` inside `.cine-wall`, `.media-grid`, `.media-tile`,
`.distribution-card`) declare a `srcset` of `X-768.webp 768w, X.webp <master>w` plus a
`sizes` list built from the measured box of that grid at 1000px and up. The `sizes` value
must never *under*-state the rendered box, or a 2x display is handed the small file and
goes soft; over-stating only costs bytes. See `media/credits.md` for how the pairs are
generated and which files are deliberately single-rendition (`.cine-src` backdrop frames
and each page's preload target - the canvas reads the raw `src` attribute, and the preload
must name the file the hero paints).

### Logos, posters and the shell image budget

The brand mark is CSS-sized (58px in the header, 119px in the footer and the CRM media
cell), so it carries `logo-mark-128.webp 128w, logo-mark-260.webp 260w, logo-mark.webp
286w` with `sizes` matching *that slot* - `(min-width: 1024px) 58px, 46px` in the header,
`(min-width: 1024px) 120px, 88px` below the fold. The PNG stays as the `<img>` fallback
only; no browser that understands `<picture>` pays for it. Only the two `-128` files are
in the service worker's precached shell: the header mark is above the fold on every page,
the larger tiers are runtime-cached (`/media/` is cache-first), so a first-time visitor
installs 25KB of logo instead of 81KB.

Two rules to keep:

- Adding or re-sizing a logo slot means re-measuring the box and re-checking the pick at
  **both** densities (`currentSrc`, never `naturalWidth`, which reports the `sizes`
  declaration). Both slots must resolve to a tier at least as wide as `box × DPR`, or the
  mark goes soft on a retina screen. Where the maths is not enough — the CRM page paints
  the mark at 78px, whose 2x box (156px) sits between two tiers — narrow that slot's
  `srcset` to the tiers that satisfy it instead of widening `sizes`, so a 1x visitor is
  not made to pay for a retina file either.
- `<video poster>` always points at a `.webp`. The JPEG posters cost 2-5x the same
  picture (142KB vs 89KB on `excavator-poster`) and are painted on every load, poster or
  no poster.
- CSS background textures point at a `.webp` too. Five older `.coal-page-bg` rules were
  still naming `media/coal-texture-bg.jpg` (208KB vs 132KB for the same 1376x768 image,
  mean channel difference 2.2/255); they lost the cascade everywhere except day mode on the
  obsidian skin, which was quietly paying for the JPEG. After the swap no rule references
  the `.jpg`, so a future cascade reshuffle cannot resurrect it.

### Install metadata (theme-color, manifest, icons)

`site.webmanifest` and the `theme-color` meta must agree with what the page actually
paints, because Chrome tints the browser chrome with the meta and paints
`background_color` behind the splash screen:

- `script.js#updateThemeColorMeta()` reads `getComputedStyle(body).backgroundColor` after
  the `.theming` transition class is applied and writes that. It does **not** consult the
  `THEME_COLORS` table for the normal case (the table is only a fallback when nothing is
  painted): a hand-kept table here disagreed with `--coal` on four of six theme/skin pairs.
  The read must suppress the transition with an **inline `!important`** - the cross-fade
  rule in `themes.css` ends in `!important`, and a plain inline override loses to it, so
  the value read is the colour the transition is coming *from* (a stale-looking meta is
  the symptom). Verify by toggling and reading the meta after ~250ms, mid-fade: it must
  already be the target colour.
- The manifest's `background_color`/`theme_color` are the *default* (night signature) body
  colour `#07100d`, and the icons in `media/icons/` are filled with exactly that, so
  splash -> icon -> first frame are one colour. Icon corner pixels are asserted against
  the manifest value by `/home/user/.tools/manifest.js` (kept outside the repo).
- Icons are honest about their own bytes: `sizes` must equal the real pixel size,
  `purpose: "any"` and `"maskable"` are separate entries (never `"any maskable"`), and
  maskable art keeps the mark inside the central 80% safe zone on an opaque background.
  They live under `media/` so the service worker caches them on demand - they are *not*
  in `SHELL`, which is for the first paint, not for an install flow that may never happen.
- `profile.html` is a `<meta http-equiv="refresh">` stub and deliberately carries no
  install metadata: it is thrown away 0ms later.

## 6. Going live (GitHub Pages, and Vercel)

`deploy.yml` publishes **the repository root as-is** to GitHub Pages on every push to
`main`, so the site lands at `https://<owner>.github.io/<repo>/` - a *subpath*. Two things
follow, and both are easy to get wrong:

- **`.nojekyll` must exist at the root.** Without it Pages runs the tree through Jekyll,
  which rewrites and drops files it does not understand.
- **Nothing may be origin-rooted.** `site.webmanifest` uses `id`/`start_url`/`scope` of
  `./`, the speculation-rules block uses `href_matches: "*.html"` (resolved against the
  document, not the origin), the service worker registers `sw.js` with `scope: './'`, and
  every asset, link and `url()` in CSS is relative. Introduce a leading `/` anywhere and
  it works on Vercel and silently breaks on Pages - so test both, e.g. serve the repo from
  a parent directory (`python3 -m http.server --directory ..`) and load `/khaqan-coal-company/index.html`.

A custom domain changes nothing in the tree: all of it is host-agnostic by design. If one
is added, `vercel.json`'s clean-URL rewrites still only exist on Vercel - Pages serves
`about.html` and 404s on `/about`, which is why every internal link names the `.html` file.

### Social cards (`media/og/`)

Each public page carries an `og:` + `twitter:` block and its own 1200x630 card, built from
that page's hero photograph with its real `<h1>` and `<meta name="description">`, under the
same bottom-heavy veil the site uses. They are never fetched by a browser - only by
crawlers - so they cost a page nothing, but they are re-derived in place, so they carry
`?v=1` like the other generated media (`deploy.md` section 5). Rebuild them with:

```sh
convert media/mine-3d-underground.webp -resize 1200x630^ -gravity center -extent 1200x630 -modulate 100,106,99 base.png
convert -size 1200x630 gradient:'rgba(6,11,9,0.20)-rgba(4,8,6,0.88)' veil.png
convert base.png veil.png -compose over -composite \
  \( media/logo-mark.png -resize 190x -background none \) -gravity NorthWest -geometry +64+52 -compose over -composite \
  -fill '#e8b93f' -draw 'rectangle 64,216 120,219' \
  \( -size 1040x160 -background none -font DejaVuSerif-Bold -pointsize 58 -fill '#ffffff' -gravity West \
     caption:"Moving coal with precision." \) -gravity SouthWest -geometry +64+186 -compose over -composite \
  -strip -interlace Plane -quality 82 media/og/operations.jpg
```

Then bump `?v=1` to `?v=2` in that page's `og:image`/`twitter:image` so crawlers re-fetch.

## 7. Scrolling performance conventions

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
  sliding out from under an open control is the classic way a header feels broken.- The cinematic backdrop pays attention to how much it costs: under
  `prefers-reduced-motion: reduce`, or on a `saveData` / 2g connection, it loads **one**
  frame instead of the whole crossfade set (home page 8 frames -> 3, -911KB; inner pages
  5 -> 1, -811KB) and still paints that frame. If you add frames to a page, the budget
  logic follows automatically because it slices the same `img.cine-src` list.

- Anchored targets get `scroll-padding-top: calc(var(--header-h) + 18px)` on `html`, so a
  deep link lands below the bar instead of under it (checked with `#ticker`, which lands
  17px clear). `#main` measures -74px by the same test and that is not a bug: it is the
  first element in the document, so no scroll position can put it below the bar.
- Keyboard behaviour in the bar: the skip link targets `#main`, which carries
  `tabindex="-1"` so focus actually lands in the content instead of bouncing off `<body>`
  (and `#main:focus { outline: none }` stops it drawing a ring around the page). Activating
  the skip link closes the drawer first, because an inert container cannot take focus.
  It also scrolls by hand: `#main` runs the whole length of the document, so the browser
  counts it as already on screen and the fragment jump moves the focus but not the
  viewport. The offset it applies is the page's own resolved `scroll-padding-top`, and
  only when `.site-header` is `position: fixed` - the CRM's header scrolls with the page,
  where padding would just open a gap. That scroller deliberately lives in its own IIFE
  rather than inside the header block, because `crm.html` has no `.site-header` and would
  otherwise get none of it.
- Opening the drawer focuses the active link, traps Tab inside the bar (the rest of the page is `inert`,
  with a focus-ring fallback where `inert` is unsupported) and restores focus to the
  toggle on `Esc`; the theme popup is a `role="menu"` with `aria-activedescendant`, so
  ArrowUp/Down/Home/End move the selection and Enter/`Esc` return focus to the toggle.
  Keep exactly one `#skin-menu` per page - the toggle references it by id.
