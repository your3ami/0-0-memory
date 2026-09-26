alter table public."0+0"
  add column if not exists weather text;

alter table public."0+0"
  add column if not exists thought text;

alter table public."0+0"
  add column if not exists song_line text;

notify pgrst, 'reload schema';
