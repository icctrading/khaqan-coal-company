-- ============================================================
-- Khaqan Coal Company — run this in Supabase → SQL Editor
-- Safe to re-run: every statement is "if not exists".
--
-- Adds the `team_config` jsonb column that holds the leadership
-- team (members list) and the home highlights reel rotation order.
-- The list is edited from the Control Room (add / re-order / remove
-- members, set the reel sequence) and drives the rotating team hero
-- and the About team cards without touching HTML.
-- ============================================================

-- 1) The team / reel-sequence configuration column
alter table public.site_settings
  add column if not exists team_config jsonb not null default '{}'::jsonb;

-- 2) Make sure the single settings row exists
insert into public.site_settings (id) values ('default')
  on conflict (id) do nothing;

-- 3) Verify — should return an object (or {} for a fresh install)
select team_config
from public.site_settings
where id = 'default';
