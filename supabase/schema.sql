-- Khaqan Coal Company: Supabase starter schema
-- Run this in Supabase Dashboard → SQL Editor.
-- After creating the first Auth user, insert that user's UUID into admin_users.

create extension if not exists pgcrypto;

create table if not exists public.site_settings (
  id text primary key default 'default',
  brand_name text not null default 'Khaqan',
  company_name text not null default 'Khaqan Coal Company',
  legal_name text not null default 'Khaqan Coal Company (Private) Limited',
  incorporation_date text not null default '03 March 2021',
  total_quantity text not null default '535,121.35 MT',
  total_turnover text not null default 'PKR 21,011,459,921',
  client_count text not null default '12 leading organizations',
  director_name text not null default 'Adnan Khan',
  ownership_line text not null default 'Proudly owned by the Akkhurwal Qom',
  location text not null default 'Darra Adam Khel, Khyber Pakhtunkhwa, Pakistan',
  hero_eyebrow text not null default 'Darra Adam Khel · KPK · Pakistan',
  hero_description text not null default 'Coal is black gold — and Khaqan Coal Company Pvt. Ltd. supplies the best-quality coal at competitive rates, with dependable logistics for customers across Pakistan and an export future ahead.',
  export_heading text not null default 'Leading from Darra Adam Khel. Preparing for the world.',
  export_message text not null default 'Khaqan Coal Company is proud to be a leading coal supplier in Pakistan and is now preparing the relationships, standards, and distribution routes needed for export.',
  phone text not null default '',
  whatsapp text not null default '',
  email text not null default '',
  director_bio text not null default '',
  ceo_bio text not null default '',
  md_bio text not null default '',
  cfo_bio text not null default '',
  director_card1 text not null default '',
  director_card2 text not null default '',
  ceo_card1 text not null default '',
  ceo_card2 text not null default '',
  md_card1 text not null default '',
  md_card2 text not null default '',
  cfo_card1 text not null default '',
  cfo_card2 text not null default '',
  reel_interval_sec integer not null default 5,
  team_hero_interval_sec integer not null default 5,
  -- Page copy overrides edited in the Control Room (headings, frame captions,
  -- reel tile labels), keyed 'home:reel' / 'home:reel:4'. See script.js.
  slot_copy jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

-- Safe migrations for an existing Khaqan Supabase project.
alter table public.site_settings add column if not exists legal_name text not null default 'Khaqan Coal Company (Private) Limited';
alter table public.site_settings add column if not exists incorporation_date text not null default '03 March 2021';
alter table public.site_settings add column if not exists total_quantity text not null default '535,121.35 MT';
alter table public.site_settings add column if not exists total_turnover text not null default 'PKR 21,011,459,921';
alter table public.site_settings add column if not exists client_count text not null default '12 leading organizations';
alter table public.site_settings add column if not exists director_bio text not null default '';
alter table public.site_settings add column if not exists ceo_bio text not null default '';
alter table public.site_settings add column if not exists md_bio text not null default '';
alter table public.site_settings add column if not exists cfo_bio text not null default '';
alter table public.site_settings add column if not exists director_card1 text not null default '';
alter table public.site_settings add column if not exists director_card2 text not null default '';
alter table public.site_settings add column if not exists ceo_card1 text not null default '';
alter table public.site_settings add column if not exists ceo_card2 text not null default '';
alter table public.site_settings add column if not exists md_card1 text not null default '';
alter table public.site_settings add column if not exists md_card2 text not null default '';
alter table public.site_settings add column if not exists cfo_card1 text not null default '';
alter table public.site_settings add column if not exists cfo_card2 text not null default '';
-- Rotation timing (seconds per frame) for the home reel and the leadership hero.
alter table public.site_settings add column if not exists reel_interval_sec integer not null default 5;
alter table public.site_settings add column if not exists team_hero_interval_sec integer not null default 5;
-- Page copy overrides (headings · captions · tile labels) as one jsonb map.
alter table public.site_settings add column if not exists slot_copy jsonb not null default '{}'::jsonb;

insert into public.site_settings (id) values ('default') on conflict (id) do nothing;

create table if not exists public.enquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  company text not null default '',
  contact text not null,
  interest text not null default 'General enquiry',
  message text not null default '',
  status text not null default 'New' check (status in ('New', 'Contacted', 'Won', 'Archived')),
  created_at timestamptz not null default now()
);

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

alter table public.site_settings enable row level security;
alter table public.enquiries enable row level security;
alter table public.admin_users enable row level security;

-- The public website can read only the single published settings row.
drop policy if exists "Public can read default settings" on public.site_settings;
create policy "Public can read default settings"
  on public.site_settings for select
  to anon, authenticated
  using (id = 'default');

-- Only an explicitly allow-listed Auth user can change public site content.
drop policy if exists "Admins can update settings" on public.site_settings;
create policy "Admins can update settings"
  on public.site_settings for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "Admins can insert settings" on public.site_settings;
create policy "Admins can insert settings"
  on public.site_settings for insert
  to authenticated
  with check (public.is_admin());

-- The public Contact form can create an enquiry; only admins can read or manage them.
drop policy if exists "Public can create enquiries" on public.enquiries;
create policy "Public can create enquiries"
  on public.enquiries for insert
  to anon, authenticated
  with check (char_length(trim(name)) between 1 and 120 and char_length(trim(contact)) between 1 and 160);

drop policy if exists "Admins can read enquiries" on public.enquiries;
create policy "Admins can read enquiries"
  on public.enquiries for select
  to authenticated
  using (public.is_admin());

drop policy if exists "Admins can update enquiries" on public.enquiries;
create policy "Admins can update enquiries"
  on public.enquiries for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "Admins can delete enquiries" on public.enquiries;
create policy "Admins can delete enquiries"
  on public.enquiries for delete
  to authenticated
  using (public.is_admin());

-- Admin allow-list is intentionally not readable from the browser.
-- Add the first administrator after signing up in Authentication → Users:
-- insert into public.admin_users (user_id) values ('PASTE_AUTH_USER_UUID_HERE');

-- Shared CRM media library (leadership portraits + page galleries).
-- Files live in the public `media` Storage bucket; this table is the catalogue.
create table if not exists public.media (
  id uuid primary key default gen_random_uuid(),
  title text not null default 'Untitled',
  section text not null default 'general',
  area text not null default 'gallery',
  slot text not null default '',
  kind text not null default 'image' check (kind in ('image', 'video')),
  duration integer not null default 0,
  storage_path text not null unique,
  public_url text not null,
  mime_type text not null default '',
  byte_size bigint not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.media add column if not exists area text not null default 'gallery';
alter table public.media add column if not exists slot text not null default '';
alter table public.media add column if not exists duration integer not null default 0;
-- Index for the All-media inventory (everything on one page, ordered by placement).
create index if not exists media_placement_idx on public.media (section, area, slot);
create index if not exists media_created_idx on public.media (created_at desc);

alter table public.media enable row level security;

drop policy if exists "Public can read media" on public.media;
create policy "Public can read media"
  on public.media for select
  to anon, authenticated
  using (true);

drop policy if exists "Admins can insert media" on public.media;
create policy "Admins can insert media"
  on public.media for insert
  to authenticated
  with check (public.is_admin());

drop policy if exists "Admins can update media" on public.media;
create policy "Admins can update media"
  on public.media for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "Admins can delete media" on public.media;
create policy "Admins can delete media"
  on public.media for delete
  to authenticated
  using (public.is_admin());

insert into storage.buckets (id, name, public, file_size_limit)
values ('media', 'media', true, 52428800)
on conflict (id) do update set public = excluded.public, file_size_limit = excluded.file_size_limit;

drop policy if exists "Public can read media objects" on storage.objects;
create policy "Public can read media objects"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'media');

drop policy if exists "Admins can upload media objects" on storage.objects;
create policy "Admins can upload media objects"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'media' and public.is_admin());

drop policy if exists "Admins can update media objects" on storage.objects;
create policy "Admins can update media objects"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'media' and public.is_admin())
  with check (bucket_id = 'media' and public.is_admin());

drop policy if exists "Admins can delete media objects" on storage.objects;
create policy "Admins can delete media objects"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'media' and public.is_admin());
