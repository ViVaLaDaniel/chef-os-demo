create extension if not exists pgcrypto;

create type public.app_role as enum ('owner', 'chef', 'sous_chef', 'cook', 'purchaser', 'admin');
create type public.member_status as enum ('invited', 'active', 'disabled');
create type public.shift_status as enum ('planned', 'active', 'closed');
create type public.task_status as enum ('todo', 'in_progress', 'done', 'blocked');
create type public.inventory_report_status as enum ('new', 'confirmed', 'ordered', 'delivered', 'rejected');
create type public.stock_signal_level as enum ('low', 'one_left', 'empty');

create schema if not exists app_private;

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  avatar_url text,
  phone text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.restaurants (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  owner_user_id uuid not null references auth.users(id) on delete restrict,
  timezone text not null default 'Europe/Warsaw',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.restaurant_members (
  id uuid primary key default gen_random_uuid(),
  restaurant_id uuid not null references public.restaurants(id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade,
  email text,
  role public.app_role not null default 'cook',
  status public.member_status not null default 'invited',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint restaurant_members_user_or_email check (user_id is not null or email is not null),
  unique (restaurant_id, user_id),
  unique (restaurant_id, email)
);

create table public.stations (
  id uuid primary key default gen_random_uuid(),
  restaurant_id uuid not null references public.restaurants(id) on delete cascade,
  name text not null,
  description text not null default '',
  owner_label text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.station_processes (
  id uuid primary key default gen_random_uuid(),
  station_id uuid not null references public.stations(id) on delete cascade,
  title text not null,
  body text not null,
  process_type text not null default 'duty',
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.staff_contacts (
  id uuid primary key default gen_random_uuid(),
  restaurant_id uuid not null references public.restaurants(id) on delete cascade,
  station_id uuid references public.stations(id) on delete set null,
  app_user_id uuid references auth.users(id) on delete set null,
  full_name text not null,
  role_label text not null,
  phone text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.shifts (
  id uuid primary key default gen_random_uuid(),
  restaurant_id uuid not null references public.restaurants(id) on delete cascade,
  shift_date date not null,
  title text not null default 'Смена',
  peak_window text,
  status public.shift_status not null default 'planned',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.shift_assignments (
  id uuid primary key default gen_random_uuid(),
  shift_id uuid not null references public.shifts(id) on delete cascade,
  staff_contact_id uuid not null references public.staff_contacts(id) on delete cascade,
  station_id uuid references public.stations(id) on delete set null,
  starts_at time not null,
  ends_at time not null,
  status text not null default 'expected',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.shift_tasks (
  id uuid primary key default gen_random_uuid(),
  shift_id uuid not null references public.shifts(id) on delete cascade,
  station_id uuid references public.stations(id) on delete set null,
  title text not null,
  due_at timestamptz,
  priority text not null default 'normal',
  status public.task_status not null default 'todo',
  assigned_staff_contact_id uuid references public.staff_contacts(id) on delete set null,
  created_by uuid references auth.users(id) on delete set null,
  completed_by uuid references auth.users(id) on delete set null,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.suppliers (
  id uuid primary key default gen_random_uuid(),
  restaurant_id uuid not null references public.restaurants(id) on delete cascade,
  name text not null,
  category text not null,
  phone text,
  minimum_order text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.inventory_items (
  id uuid primary key default gen_random_uuid(),
  restaurant_id uuid not null references public.restaurants(id) on delete cascade,
  station_id uuid references public.stations(id) on delete set null,
  supplier_id uuid references public.suppliers(id) on delete set null,
  name text not null,
  unit_label text not null,
  par_level numeric,
  current_note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.inventory_reports (
  id uuid primary key default gen_random_uuid(),
  restaurant_id uuid not null references public.restaurants(id) on delete cascade,
  inventory_item_id uuid not null references public.inventory_items(id) on delete cascade,
  station_id uuid references public.stations(id) on delete set null,
  reported_by uuid references auth.users(id) on delete set null,
  level public.stock_signal_level not null,
  note text,
  photo_url text,
  status public.inventory_report_status not null default 'new',
  confirmed_by uuid references auth.users(id) on delete set null,
  confirmed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.recipes (
  id uuid primary key default gen_random_uuid(),
  restaurant_id uuid not null references public.restaurants(id) on delete cascade,
  title text not null,
  category text not null,
  yield_label text,
  prep_time_minutes integer,
  food_cost numeric(10, 2),
  allergens text,
  image_url text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.recipe_steps (
  id uuid primary key default gen_random_uuid(),
  recipe_id uuid not null references public.recipes(id) on delete cascade,
  body text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table public.activity_log (
  id uuid primary key default gen_random_uuid(),
  restaurant_id uuid not null references public.restaurants(id) on delete cascade,
  actor_user_id uuid references auth.users(id) on delete set null,
  actor_label text,
  action text not null,
  entity_type text,
  entity_id uuid,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table public.channel_messages (
  id uuid primary key default gen_random_uuid(),
  restaurant_id uuid not null references public.restaurants(id) on delete cascade,
  channel text not null default 'general-kitchen',
  sender_user_id uuid references auth.users(id) on delete set null,
  sender_label text,
  body text not null,
  created_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function app_private.is_restaurant_member(target_restaurant_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.restaurant_members rm
    where rm.restaurant_id = target_restaurant_id
      and rm.user_id = (select auth.uid())
      and rm.status = 'active'
  );
$$;

create or replace function app_private.has_restaurant_role(target_restaurant_id uuid, allowed_roles public.app_role[])
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.restaurant_members rm
    where rm.restaurant_id = target_restaurant_id
      and rm.user_id = (select auth.uid())
      and rm.status = 'active'
      and rm.role = any(allowed_roles)
  );
$$;

revoke all on function app_private.is_restaurant_member(uuid) from public;
revoke all on function app_private.has_restaurant_role(uuid, public.app_role[]) from public;
grant execute on function app_private.is_restaurant_member(uuid) to authenticated;
grant execute on function app_private.has_restaurant_role(uuid, public.app_role[]) to authenticated;

create trigger profiles_set_updated_at before update on public.profiles for each row execute function public.set_updated_at();
create trigger restaurants_set_updated_at before update on public.restaurants for each row execute function public.set_updated_at();
create trigger restaurant_members_set_updated_at before update on public.restaurant_members for each row execute function public.set_updated_at();
create trigger stations_set_updated_at before update on public.stations for each row execute function public.set_updated_at();
create trigger station_processes_set_updated_at before update on public.station_processes for each row execute function public.set_updated_at();
create trigger staff_contacts_set_updated_at before update on public.staff_contacts for each row execute function public.set_updated_at();
create trigger shifts_set_updated_at before update on public.shifts for each row execute function public.set_updated_at();
create trigger shift_assignments_set_updated_at before update on public.shift_assignments for each row execute function public.set_updated_at();
create trigger shift_tasks_set_updated_at before update on public.shift_tasks for each row execute function public.set_updated_at();
create trigger suppliers_set_updated_at before update on public.suppliers for each row execute function public.set_updated_at();
create trigger inventory_items_set_updated_at before update on public.inventory_items for each row execute function public.set_updated_at();
create trigger inventory_reports_set_updated_at before update on public.inventory_reports for each row execute function public.set_updated_at();
create trigger recipes_set_updated_at before update on public.recipes for each row execute function public.set_updated_at();

create index restaurant_members_restaurant_user_idx on public.restaurant_members (restaurant_id, user_id);
create index stations_restaurant_idx on public.stations (restaurant_id);
create index staff_contacts_restaurant_idx on public.staff_contacts (restaurant_id);
create index shifts_restaurant_date_idx on public.shifts (restaurant_id, shift_date);
create index shift_assignments_shift_idx on public.shift_assignments (shift_id);
create index shift_tasks_shift_status_idx on public.shift_tasks (shift_id, status);
create index suppliers_restaurant_idx on public.suppliers (restaurant_id);
create index inventory_items_restaurant_station_idx on public.inventory_items (restaurant_id, station_id);
create index inventory_reports_restaurant_status_idx on public.inventory_reports (restaurant_id, status, created_at desc);
create index recipes_restaurant_category_idx on public.recipes (restaurant_id, category);
create index activity_log_restaurant_created_idx on public.activity_log (restaurant_id, created_at desc);
create index channel_messages_restaurant_created_idx on public.channel_messages (restaurant_id, created_at desc);

alter table public.profiles enable row level security;
alter table public.restaurants enable row level security;
alter table public.restaurant_members enable row level security;
alter table public.stations enable row level security;
alter table public.station_processes enable row level security;
alter table public.staff_contacts enable row level security;
alter table public.shifts enable row level security;
alter table public.shift_assignments enable row level security;
alter table public.shift_tasks enable row level security;
alter table public.suppliers enable row level security;
alter table public.inventory_items enable row level security;
alter table public.inventory_reports enable row level security;
alter table public.recipes enable row level security;
alter table public.recipe_steps enable row level security;
alter table public.activity_log enable row level security;
alter table public.channel_messages enable row level security;

create policy "profiles_select_self" on public.profiles for select to authenticated using ((select auth.uid()) = id);
create policy "profiles_insert_self" on public.profiles for insert to authenticated with check ((select auth.uid()) = id);
create policy "profiles_update_self" on public.profiles for update to authenticated using ((select auth.uid()) = id) with check ((select auth.uid()) = id);

create policy "restaurants_select_members" on public.restaurants for select to authenticated using (app_private.is_restaurant_member(id) or owner_user_id = (select auth.uid()));
create policy "restaurants_insert_owner" on public.restaurants for insert to authenticated with check (owner_user_id = (select auth.uid()));
create policy "restaurants_update_leadership" on public.restaurants for update to authenticated using (owner_user_id = (select auth.uid()) or app_private.has_restaurant_role(id, array['owner','chef','admin']::public.app_role[])) with check (owner_user_id = (select auth.uid()) or app_private.has_restaurant_role(id, array['owner','chef','admin']::public.app_role[]));

create policy "members_select_restaurant" on public.restaurant_members for select to authenticated using (user_id = (select auth.uid()) or app_private.is_restaurant_member(restaurant_id));
create policy "members_insert_leadership" on public.restaurant_members for insert to authenticated with check (
  app_private.has_restaurant_role(restaurant_id, array['owner','chef','admin']::public.app_role[])
  or exists (select 1 from public.restaurants r where r.id = restaurant_id and r.owner_user_id = (select auth.uid()))
);
create policy "members_update_leadership" on public.restaurant_members for update to authenticated using (app_private.has_restaurant_role(restaurant_id, array['owner','chef','admin']::public.app_role[])) with check (app_private.has_restaurant_role(restaurant_id, array['owner','chef','admin']::public.app_role[]));

create policy "stations_read_members" on public.stations for select to authenticated using (app_private.is_restaurant_member(restaurant_id));
create policy "stations_write_leadership" on public.stations for all to authenticated using (app_private.has_restaurant_role(restaurant_id, array['owner','chef','sous_chef','admin']::public.app_role[])) with check (app_private.has_restaurant_role(restaurant_id, array['owner','chef','sous_chef','admin']::public.app_role[]));

create policy "station_processes_read_members" on public.station_processes for select to authenticated using (exists (select 1 from public.stations s where s.id = station_id and app_private.is_restaurant_member(s.restaurant_id)));
create policy "station_processes_write_leadership" on public.station_processes for all to authenticated using (exists (select 1 from public.stations s where s.id = station_id and app_private.has_restaurant_role(s.restaurant_id, array['owner','chef','sous_chef','admin']::public.app_role[]))) with check (exists (select 1 from public.stations s where s.id = station_id and app_private.has_restaurant_role(s.restaurant_id, array['owner','chef','sous_chef','admin']::public.app_role[])));

create policy "staff_contacts_read_members" on public.staff_contacts for select to authenticated using (app_private.is_restaurant_member(restaurant_id));
create policy "staff_contacts_write_leadership" on public.staff_contacts for all to authenticated using (app_private.has_restaurant_role(restaurant_id, array['owner','chef','sous_chef','admin']::public.app_role[])) with check (app_private.has_restaurant_role(restaurant_id, array['owner','chef','sous_chef','admin']::public.app_role[]));

create policy "shifts_read_members" on public.shifts for select to authenticated using (app_private.is_restaurant_member(restaurant_id));
create policy "shifts_write_leadership" on public.shifts for all to authenticated using (app_private.has_restaurant_role(restaurant_id, array['owner','chef','sous_chef','admin']::public.app_role[])) with check (app_private.has_restaurant_role(restaurant_id, array['owner','chef','sous_chef','admin']::public.app_role[]));

create policy "shift_assignments_read_members" on public.shift_assignments for select to authenticated using (exists (select 1 from public.shifts s where s.id = shift_id and app_private.is_restaurant_member(s.restaurant_id)));
create policy "shift_assignments_write_leadership" on public.shift_assignments for all to authenticated using (exists (select 1 from public.shifts s where s.id = shift_id and app_private.has_restaurant_role(s.restaurant_id, array['owner','chef','sous_chef','admin']::public.app_role[]))) with check (exists (select 1 from public.shifts s where s.id = shift_id and app_private.has_restaurant_role(s.restaurant_id, array['owner','chef','sous_chef','admin']::public.app_role[])));

create policy "shift_tasks_read_members" on public.shift_tasks for select to authenticated using (exists (select 1 from public.shifts s where s.id = shift_id and app_private.is_restaurant_member(s.restaurant_id)));
create policy "shift_tasks_write_members" on public.shift_tasks for all to authenticated using (exists (select 1 from public.shifts s where s.id = shift_id and app_private.is_restaurant_member(s.restaurant_id))) with check (exists (select 1 from public.shifts s where s.id = shift_id and app_private.is_restaurant_member(s.restaurant_id)));

create policy "suppliers_read_members" on public.suppliers for select to authenticated using (app_private.is_restaurant_member(restaurant_id));
create policy "suppliers_write_leadership" on public.suppliers for all to authenticated using (app_private.has_restaurant_role(restaurant_id, array['owner','chef','sous_chef','purchaser','admin']::public.app_role[])) with check (app_private.has_restaurant_role(restaurant_id, array['owner','chef','sous_chef','purchaser','admin']::public.app_role[]));

create policy "inventory_items_read_members" on public.inventory_items for select to authenticated using (app_private.is_restaurant_member(restaurant_id));
create policy "inventory_items_write_leadership" on public.inventory_items for all to authenticated using (app_private.has_restaurant_role(restaurant_id, array['owner','chef','sous_chef','purchaser','admin']::public.app_role[])) with check (app_private.has_restaurant_role(restaurant_id, array['owner','chef','sous_chef','purchaser','admin']::public.app_role[]));

create policy "inventory_reports_read_members" on public.inventory_reports for select to authenticated using (app_private.is_restaurant_member(restaurant_id));
create policy "inventory_reports_insert_members" on public.inventory_reports for insert to authenticated with check (app_private.is_restaurant_member(restaurant_id) and (reported_by = auth.uid() or reported_by is null));
create policy "inventory_reports_update_leadership" on public.inventory_reports for update to authenticated using (app_private.has_restaurant_role(restaurant_id, array['owner','chef','sous_chef','purchaser','admin']::public.app_role[])) with check (app_private.has_restaurant_role(restaurant_id, array['owner','chef','sous_chef','purchaser','admin']::public.app_role[]));

create policy "recipes_read_members" on public.recipes for select to authenticated using (app_private.is_restaurant_member(restaurant_id));
create policy "recipes_write_leadership" on public.recipes for all to authenticated using (app_private.has_restaurant_role(restaurant_id, array['owner','chef','sous_chef','admin']::public.app_role[])) with check (app_private.has_restaurant_role(restaurant_id, array['owner','chef','sous_chef','admin']::public.app_role[]));

create policy "recipe_steps_read_members" on public.recipe_steps for select to authenticated using (exists (select 1 from public.recipes r where r.id = recipe_id and app_private.is_restaurant_member(r.restaurant_id)));
create policy "recipe_steps_write_leadership" on public.recipe_steps for all to authenticated using (exists (select 1 from public.recipes r where r.id = recipe_id and app_private.has_restaurant_role(r.restaurant_id, array['owner','chef','sous_chef','admin']::public.app_role[]))) with check (exists (select 1 from public.recipes r where r.id = recipe_id and app_private.has_restaurant_role(r.restaurant_id, array['owner','chef','sous_chef','admin']::public.app_role[])));

create policy "activity_log_read_members" on public.activity_log for select to authenticated using (app_private.is_restaurant_member(restaurant_id));
create policy "activity_log_insert_members" on public.activity_log for insert to authenticated with check (app_private.is_restaurant_member(restaurant_id) and (actor_user_id = auth.uid() or actor_user_id is null));

create policy "channel_messages_read_members" on public.channel_messages for select to authenticated using (app_private.is_restaurant_member(restaurant_id));
create policy "channel_messages_insert_members" on public.channel_messages for insert to authenticated with check (app_private.is_restaurant_member(restaurant_id));

grant usage on schema public to authenticated;
grant select, insert, update, delete on all tables in schema public to authenticated;
