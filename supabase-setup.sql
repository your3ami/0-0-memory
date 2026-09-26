-- 0+0 memory player: shared database setup
-- Run this once in Supabase SQL Editor.

alter table public."0+0"
  add column if not exists memory_id text;

create unique index if not exists "0+0_memory_id_key"
  on public."0+0"(memory_id);

-- Refresh the Data API schema cache after adding the column.
notify pgrst, 'reload schema';
