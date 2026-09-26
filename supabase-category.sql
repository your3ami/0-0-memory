-- 0+0 memory category migration
-- Run this once in Supabase SQL Editor after the album BGM update.

alter table public."0+0"
  add column if not exists category text default '일상';

update public."0+0"
set category = '일상'
where category is null;

alter table public."0+0"
  alter column category set default '일상';

notify pgrst, 'reload schema';
