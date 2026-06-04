-- Fun Day Planner — Supabase schema
-- Run in Supabase SQL Editor or via CLI: supabase db push

create extension if not exists "pgcrypto";

-- Events (one fun day per row; extend for multi-event later)
create table if not exists events (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  event_date date,
  attendance_estimate integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Stalls
create table if not exists stalls (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references events(id) on delete cascade,
  name text not null,
  item_cost numeric(10, 2) not null default 0,
  selling_price numeric(10, 2) not null default 0,
  quantity integer not null default 0,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- General event expenses (venue, licences, etc.)
create table if not exists expenses (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references events(id) on delete cascade,
  category text not null default 'General',
  description text not null,
  budgeted numeric(10, 2) not null default 0,
  actual numeric(10, 2) not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Suppliers
create table if not exists suppliers (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references events(id) on delete cascade,
  name text not null,
  contact text not null default '',
  notes text,
  created_at timestamptz not null default now()
);

-- Procurement / shopping list
create table if not exists purchases (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references events(id) on delete cascade,
  supplier_id uuid references suppliers(id) on delete set null,
  item_name text not null,
  budgeted numeric(10, 2) not null default 0,
  actual numeric(10, 2) not null default 0,
  quantity integer not null default 0,
  stock_on_hand integer not null default 0,
  purchased boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Ticket & donation totals (one row per event)
create table if not exists ticket_sales (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null unique references events(id) on delete cascade,
  adult_count integer not null default 0,
  adult_price numeric(10, 2) not null default 0,
  family_count integer not null default 0,
  family_price numeric(10, 2) not null default 0,
  child_count integer not null default 0,
  child_price numeric(10, 2) not null default 0,
  raffle_count integer not null default 0,
  raffle_price numeric(10, 2) not null default 0,
  donations numeric(10, 2) not null default 0,
  updated_at timestamptz not null default now()
);

-- Volunteers
create table if not exists volunteers (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references events(id) on delete cascade,
  name text not null,
  email text not null default '',
  phone text not null default '',
  role text not null default '',
  notes text,
  created_at timestamptz not null default now()
);

-- Volunteer shifts
create table if not exists volunteer_shifts (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references events(id) on delete cascade,
  volunteer_id uuid not null references volunteers(id) on delete cascade,
  stall_or_area text not null,
  shift_start text not null,
  shift_end text not null,
  notes text,
  created_at timestamptz not null default now()
);

-- Indexes
create index if not exists idx_stalls_event on stalls(event_id);
create index if not exists idx_expenses_event on expenses(event_id);
create index if not exists idx_purchases_event on purchases(event_id);
create index if not exists idx_volunteers_event on volunteers(event_id);
create index if not exists idx_shifts_event on volunteer_shifts(event_id);

-- Updated_at trigger
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger events_updated before update on events
  for each row execute function set_updated_at();
create trigger stalls_updated before update on stalls
  for each row execute function set_updated_at();
create trigger expenses_updated before update on expenses
  for each row execute function set_updated_at();
create trigger purchases_updated before update on purchases
  for each row execute function set_updated_at();
create trigger ticket_sales_updated before update on ticket_sales
  for each row execute function set_updated_at();

-- Row Level Security (enable when using Supabase Auth)
alter table events enable row level security;
alter table stalls enable row level security;
alter table expenses enable row level security;
alter table suppliers enable row level security;
alter table purchases enable row level security;
alter table ticket_sales enable row level security;
alter table volunteers enable row level security;
alter table volunteer_shifts enable row level security;

-- Permissive policies for authenticated users (customise for your org)
create policy "events_all" on events for all using (true) with check (true);
create policy "stalls_all" on stalls for all using (true) with check (true);
create policy "expenses_all" on expenses for all using (true) with check (true);
create policy "suppliers_all" on suppliers for all using (true) with check (true);
create policy "purchases_all" on purchases for all using (true) with check (true);
create policy "ticket_sales_all" on ticket_sales for all using (true) with check (true);
create policy "volunteers_all" on volunteers for all using (true) with check (true);
create policy "shifts_all" on volunteer_shifts for all using (true) with check (true);
