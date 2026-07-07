-- Bayana Analytics — initial schema
-- Run in Supabase dashboard → SQL Editor (or apply via `supabase db push` once CLI is added).

-- ─────────────────────────────────────────────────────────────────────────────
-- Extensions
-- ─────────────────────────────────────────────────────────────────────────────
create extension if not exists "uuid-ossp";

-- ─────────────────────────────────────────────────────────────────────────────
-- Tables
-- ─────────────────────────────────────────────────────────────────────────────
create table public.organizations (
  id          uuid        primary key default uuid_generate_v4(),
  name        text        not null,
  created_at  timestamptz not null default now()
);

-- Profile table — id mirrors auth.users.id (no separate sequence)
create table public.users (
  id      uuid  primary key references auth.users(id) on delete cascade,
  org_id  uuid  not null references public.organizations(id) on delete cascade,
  role    text  not null default 'admin',   -- first user of an org is admin; future: invite system adds 'member'
  email   text  not null
);

create table public.data_sources (
  id                 uuid        primary key default uuid_generate_v4(),
  org_id             uuid        not null references public.organizations(id) on delete cascade,
  source_type        text        not null,
  original_filename  text        not null,
  uploaded_at        timestamptz not null default now()
);

create table public.stock_levels (
  id           uuid     primary key default uuid_generate_v4(),
  org_id       uuid     not null references public.organizations(id) on delete cascade,
  source_id    uuid     not null references public.data_sources(id) on delete cascade,
  item_name    text     not null,
  quantity     numeric  not null,
  branch       text,
  recorded_at  timestamptz not null default now()
);

create table public.patient_visits (
  id          uuid     primary key default uuid_generate_v4(),
  org_id      uuid     not null references public.organizations(id) on delete cascade,
  source_id   uuid     not null references public.data_sources(id) on delete cascade,
  branch      text,
  visit_date  date     not null,
  count       integer  not null
);

create table public.revenue (
  id         uuid     primary key default uuid_generate_v4(),
  org_id     uuid     not null references public.organizations(id) on delete cascade,
  source_id  uuid     not null references public.data_sources(id) on delete cascade,
  branch     text,
  period     text,
  amount     numeric  not null
);

create table public.subscriptions (
  id                   uuid        primary key default uuid_generate_v4(),
  org_id               uuid        not null references public.organizations(id) on delete cascade,
  stripe_customer_id   text,
  subscription_status  text        not null default 'free',
  updated_at           timestamptz not null default now()
);

-- ─────────────────────────────────────────────────────────────────────────────
-- RLS
-- ─────────────────────────────────────────────────────────────────────────────
alter table public.organizations  enable row level security;
alter table public.users          enable row level security;
alter table public.data_sources   enable row level security;
alter table public.stock_levels   enable row level security;
alter table public.patient_visits enable row level security;
alter table public.revenue        enable row level security;
alter table public.subscriptions  enable row level security;

-- Helper: stable SECURITY DEFINER function avoids per-row subquery in every policy.
create or replace function public.current_user_org_id()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select org_id from public.users where id = auth.uid()
$$;

-- users: read/update own row only (inserts handled by trigger, never by client)
create policy "users_select_own" on public.users
  for select using (id = auth.uid());

create policy "users_update_own" on public.users
  for update using (id = auth.uid());

-- organizations
create policy "orgs_select_own" on public.organizations
  for select using (id = public.current_user_org_id());

create policy "orgs_update_own" on public.organizations
  for update using (id = public.current_user_org_id());

-- data_sources
create policy "data_sources_select" on public.data_sources
  for select using (org_id = public.current_user_org_id());

create policy "data_sources_insert" on public.data_sources
  for insert with check (org_id = public.current_user_org_id());

create policy "data_sources_delete" on public.data_sources
  for delete using (org_id = public.current_user_org_id());

-- stock_levels
create policy "stock_levels_select" on public.stock_levels
  for select using (org_id = public.current_user_org_id());

create policy "stock_levels_insert" on public.stock_levels
  for insert with check (org_id = public.current_user_org_id());

create policy "stock_levels_delete" on public.stock_levels
  for delete using (org_id = public.current_user_org_id());

-- patient_visits
create policy "patient_visits_select" on public.patient_visits
  for select using (org_id = public.current_user_org_id());

create policy "patient_visits_insert" on public.patient_visits
  for insert with check (org_id = public.current_user_org_id());

create policy "patient_visits_delete" on public.patient_visits
  for delete using (org_id = public.current_user_org_id());

-- revenue
create policy "revenue_select" on public.revenue
  for select using (org_id = public.current_user_org_id());

create policy "revenue_insert" on public.revenue
  for insert with check (org_id = public.current_user_org_id());

create policy "revenue_delete" on public.revenue
  for delete using (org_id = public.current_user_org_id());

-- subscriptions: users can read their org's subscription; writes only via Stripe webhook (service role)
create policy "subscriptions_select" on public.subscriptions
  for select using (org_id = public.current_user_org_id());

-- ─────────────────────────────────────────────────────────────────────────────
-- Trigger: auto-create org + user profile on every new auth.users row.
-- Fires for ALL providers (Google OAuth, email/password, magic link) — atomic.
-- Future invite flow: skip this trigger for invited users and link them to
-- the existing org from the invite record instead.
-- ─────────────────────────────────────────────────────────────────────────────
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  new_org_id uuid;
begin
  insert into public.organizations (name)
  values (coalesce(
    split_part(new.email, '@', 1),  -- e.g. "john.doe" — update in onboarding to real hospital name
    'My Organization'
  ))
  returning id into new_org_id;

  insert into public.users (id, org_id, role, email)
  values (new.id, new_org_id, 'admin', coalesce(new.email, ''));

  insert into public.subscriptions (org_id, subscription_status)
  values (new_org_id, 'free');

  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
