-- ===========================================
-- komo Database Schema
-- Run this in the Supabase SQL Editor
-- ===========================================

-- 1. Users (nur Max und Anna)
create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  created_at timestamptz default now()
);

insert into users (name) values ('Max'), ('Anna')
on conflict (name) do nothing;

-- 2. Tags (Kategorien)
create table if not exists tags (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  bg_color text not null,
  text_color text not null,
  created_by uuid references users(id),
  created_at timestamptz default now()
);

-- Vordefinierte Tags einfügen
insert into tags (name, bg_color, text_color) values
  ('Reiseplanung', '#E0EAF2', '#5B7B9A'),
  ('Alltag', '#F5EED4', '#C4A24E'),
  ('Zukunft', '#E7DCF0', '#8B6BAE'),
  ('Finanzen', '#DCE9DD', '#5E8B62'),
  ('Familie', '#F5E1EA', '#C88EA7'),
  ('Haushalt', '#F0E6D0', '#A08050')
on conflict do nothing;

-- 3. Themen
create table if not exists topics (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  notes text,
  tag_id uuid references tags(id),
  is_urgent boolean default false,
  proposed_date timestamptz,
  status text default 'open' check (status in ('open', 'done', 'follow_up')),
  created_by uuid references users(id),
  assigned_to uuid references users(id),
  parent_id uuid references topics(id),
  created_at timestamptz default now(),
  completed_at timestamptz
);

-- 4. Aufgaben
create table if not exists tasks (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  notes text,
  tag_id uuid references tags(id),
  is_urgent boolean default false,
  status text default 'open' check (status in ('open', 'done', 'follow_up')),
  created_by uuid references users(id),
  assigned_to uuid references users(id),
  parent_id uuid references tasks(id),
  created_at timestamptz default now(),
  completed_at timestamptz
);

-- 5. Row Level Security — offen für alle (nur 2 User, kein Auth)
alter table users enable row level security;
alter table tags enable row level security;
alter table topics enable row level security;
alter table tasks enable row level security;

create policy "Allow all on users" on users for all using (true) with check (true);
create policy "Allow all on tags" on tags for all using (true) with check (true);
create policy "Allow all on topics" on topics for all using (true) with check (true);
create policy "Allow all on tasks" on tasks for all using (true) with check (true);

-- 6. Realtime aktivieren
alter publication supabase_realtime add table topics;
alter publication supabase_realtime add table tasks;
alter publication supabase_realtime add table tags;

-- 7. Indizes für Performance
create index if not exists idx_topics_status on topics(status);
create index if not exists idx_topics_parent on topics(parent_id);
create index if not exists idx_tasks_status on tasks(status);
create index if not exists idx_tasks_parent on tasks(parent_id);
