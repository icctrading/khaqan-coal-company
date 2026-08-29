# Khaqan Coal Company website

## Run locally

```bash
python3 -m http.server 8000 --bind 0.0.0.0
```

Open the live preview for port 8000. The public site is `index.html`, the business portfolio is `profile.html`, and the browser CRM is `crm.html`.

## Browser CRM

The CRM is a working local prototype:

- Edit website identity, director, ownership, location, hero text, and contact channels.
- Save changes to `localStorage`; the public pages read the same data automatically.
- Public enquiries submitted from `contact.html` are saved to the local CRM.
- Update enquiry status, search, delete, clear, export, and import JSON backups (backups include the media library too).
- **Media library**: upload images and videos, and *manage* anything already added — retitle, move it to another part of the site, swap the file, or remove it. With a signed-in admin session the files go to the shared Supabase `media` bucket; otherwise they stay in this browser (`localStorage`, 12 MB/file).
- **Leadership portraits**: a dedicated panel uploads/replaces/removes the Director, CEO, MD and CFO photographs that appear in the rotating leadership hero (Home) and the team cards (About). Initials are shown until a portrait is set. Portraits use the same shared storage when the cloud CRM is connected.
- **Password reset**: once Supabase is connected, the cloud sign-in card offers **Forgot password?** — a reset link is emailed and opens the CRM to set a new password (see `deploy.md` for the Supabase redirect-URL setup).
- Use the **Open main website** button in the CRM to launch the public site in a new tab.

For a real team CRM, connect the same UI to Supabase using `supabase/schema.sql` and `supabase-config.js`. That schema creates the `media` table and the public `media` Storage bucket (anon read, `is_admin()` write/delete). The browser bridge in `cloud.js` keeps the public site and CRM local-first until those values are filled. Use the cloud login in the CRM after adding an Auth user and allow-listing its UUID in `admin_users`.

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
