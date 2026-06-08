-- Add products list per stall (JSON array)
alter table stalls
  add column if not exists products jsonb not null default '[]'::jsonb;
