-- ============================================================
-- Khaqan Coal Company — run this in Supabase → SQL Editor
-- Safe to re-run: every statement is conditional.
--
-- Adds what the Control Room's newer media and copy tools need:
--   * `site_settings.slot_copy`  — page headings, frame captions and reel
--                                  tile labels edited in the Control Room
--   * a lookup index on `public.media` for the All-media list
--   * the Storage delete policy again, so a media delete really removes the
--     file from the `media` bucket (without it the row is deleted and the
--     object is silently left behind as an orphan)
--
-- Starting from scratch instead? Run supabase/schema.sql — it already contains
-- everything in this file.
-- ============================================================

-- 0) The policies below call public.is_admin(). An older project may predate
--    that helper (or the allow-list table it reads), so make sure both exist.
create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.admin_users where user_id = auth.uid()
  );
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated;

-- 1) Page copy overrides (one jsonb map keyed by page:area and page:area:slot)
alter table public.site_settings
  add column if not exists slot_copy jsonb not null default '{}'::jsonb;

-- 2) Faster placement lookups for the All-media inventory
create index if not exists media_placement_idx on public.media (section, area, slot);
create index if not exists media_created_idx  on public.media (created_at desc);

-- 3) Media rows and bucket objects must both be removable by an admin.
--    These are the same policies as supabase/schema.sql, restated so an older
--    project that was created before them gets them too.
alter table public.media enable row level security;

drop policy if exists "Admins can delete media" on public.media;
create policy "Admins can delete media"
  on public.media for delete
  to authenticated
  using (public.is_admin());

drop policy if exists "Admins can delete media objects" on storage.objects;
create policy "Admins can delete media objects"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'media' and public.is_admin());

-- 4) Make sure the single settings row and the public bucket exist
insert into public.site_settings (id) values ('default')
  on conflict (id) do nothing;

insert into storage.buckets (id, name, public) values ('media', 'media', true)
  on conflict (id) do nothing;

-- 5) Verify — run it and read the three results in the panel below:
--      · slot_copy            → {} (empty map, nobody has re-worded anything yet)
--      · indexname            → media_placement_idx and media_created_idx listed
--      · polname              → "Admins can delete media", "Admins can delete media objects"
select slot_copy from public.site_settings where id = 'default';

select indexname from pg_indexes
  where tablename = 'media' and schemaname = 'public';

select polname from pg_policy
  where polrelid in ('public.media'::regclass, 'storage.objects'::regclass)
    and polcmd = 'd';

-- 6) Your signed-in account must be allow-listed, or every admin write is
--    refused by RLS. Look up your Auth uid under Authentication → Users →
--    (copy the "UID"), then:
-- insert into public.admin_users (user_id) values ('PASTE_AUTH_USER_UUID_HERE')
--   on conflict (user_id) do nothing;
