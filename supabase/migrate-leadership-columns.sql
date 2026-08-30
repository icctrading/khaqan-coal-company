-- ============================================================
-- Khaqan Coal Company — run this in Supabase → SQL Editor
-- Safe to re-run: every statement is "if not exists".
-- ============================================================

-- 1) Leadership bio columns (the ones your project is missing)
alter table public.site_settings
  add column if not exists director_bio text not null default '',
  add column if not exists ceo_bio text not null default '',
  add column if not exists md_bio text not null default '',
  add column if not exists cfo_bio text not null default '',
  add column if not exists director_card1 text not null default '',
  add column if not exists director_card2 text not null default '',
  add column if not exists ceo_card1 text not null default '',
  add column if not exists ceo_card2 text not null default '',
  add column if not exists md_card1 text not null default '',
  add column if not exists md_card2 text not null default '',
  add column if not exists cfo_card1 text not null default '',
  add column if not exists cfo_card2 text not null default '';

-- 2) Rotation timing columns (you already have these — kept here so a
--    fresh database gets them too; harmless on yours)
alter table public.site_settings
  add column if not exists reel_interval_sec integer not null default 5,
  add column if not exists team_hero_interval_sec integer not null default 5;

-- 3) Make sure the single settings row exists
insert into public.site_settings (id) values ('default')
  on conflict (id) do nothing;

-- 4) Verify — should return 12 bio columns (empty strings for now)
--    plus reel_interval_sec = 5 and team_hero_interval_sec = 5
select
  director_bio, ceo_bio, md_bio, cfo_bio,
  director_card1, director_card2,
  ceo_card1, ceo_card2,
  md_card1, md_card2,
  cfo_card1, cfo_card2,
  reel_interval_sec, team_hero_interval_sec
from public.site_settings
where id = 'default';
