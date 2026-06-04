-- Database Migration: Add Checklists Schema, Policies, triggers and update bootstrap/reset

create table public.checklist_templates (
  id uuid primary key default gen_random_uuid(),
  restaurant_id uuid not null references public.restaurants(id) on delete cascade,
  station_id uuid references public.stations(id) on delete cascade,
  title text not null,
  phase text not null, -- 'general', 'setup', 'service', 'close'
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.checklist_items (
  id uuid primary key default gen_random_uuid(),
  template_id uuid not null references public.checklist_templates(id) on delete cascade,
  title text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.shift_checklist_runs (
  id uuid primary key default gen_random_uuid(),
  shift_id uuid not null references public.shifts(id) on delete cascade,
  template_id uuid not null references public.checklist_templates(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (shift_id, template_id)
);

create table public.shift_checklist_item_results (
  id uuid primary key default gen_random_uuid(),
  run_id uuid not null references public.shift_checklist_runs(id) on delete cascade,
  item_id uuid not null references public.checklist_items(id) on delete cascade,
  is_completed boolean not null default false,
  completed_by uuid references auth.users(id) on delete set null,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (run_id, item_id)
);

-- Triggers for updated_at
create trigger checklist_templates_set_updated_at before update on public.checklist_templates for each row execute function public.set_updated_at();
create trigger checklist_items_set_updated_at before update on public.checklist_items for each row execute function public.set_updated_at();
create trigger shift_checklist_runs_set_updated_at before update on public.shift_checklist_runs for each row execute function public.set_updated_at();
create trigger shift_checklist_item_results_set_updated_at before update on public.shift_checklist_item_results for each row execute function public.set_updated_at();

-- Indexes
create index checklist_templates_restaurant_idx on public.checklist_templates (restaurant_id);
create index checklist_items_template_idx on public.checklist_items (template_id);
create index shift_checklist_runs_shift_idx on public.shift_checklist_runs (shift_id);
create index shift_checklist_item_results_run_idx on public.shift_checklist_item_results (run_id);

-- RLS
alter table public.checklist_templates enable row level security;
alter table public.checklist_items enable row level security;
alter table public.shift_checklist_runs enable row level security;
alter table public.shift_checklist_item_results enable row level security;

create policy "templates_select_members" on public.checklist_templates for select to authenticated
  using (app_private.is_restaurant_member(restaurant_id));

create policy "templates_write_leadership" on public.checklist_templates for all to authenticated
  using (app_private.has_restaurant_role(restaurant_id, array['owner','chef','sous_chef','admin']::public.app_role[]))
  with check (app_private.has_restaurant_role(restaurant_id, array['owner','chef','sous_chef','admin']::public.app_role[]));

create policy "items_select_members" on public.checklist_items for select to authenticated
  using (exists (
    select 1 from public.checklist_templates t
    where t.id = template_id and app_private.is_restaurant_member(t.restaurant_id)
  ));

create policy "items_write_leadership" on public.checklist_items for all to authenticated
  using (exists (
    select 1 from public.checklist_templates t
    where t.id = template_id and app_private.has_restaurant_role(t.restaurant_id, array['owner','chef','sous_chef','admin']::public.app_role[])
  ))
  with check (exists (
    select 1 from public.checklist_templates t
    where t.id = template_id and app_private.has_restaurant_role(t.restaurant_id, array['owner','chef','sous_chef','admin']::public.app_role[])
  ));

create policy "runs_select_members" on public.shift_checklist_runs for select to authenticated
  using (exists (
    select 1 from public.shifts s
    where s.id = shift_id and app_private.is_restaurant_member(s.restaurant_id)
  ));

create policy "runs_write_members" on public.shift_checklist_runs for all to authenticated
  using (exists (
    select 1 from public.shifts s
    where s.id = shift_id and app_private.is_restaurant_member(s.restaurant_id)
  ))
  with check (exists (
    select 1 from public.shifts s
    where s.id = shift_id and app_private.is_restaurant_member(s.restaurant_id)
  ));

create policy "results_select_members" on public.shift_checklist_item_results for select to authenticated
  using (exists (
    select 1 from public.shift_checklist_runs run
    join public.shifts s on s.id = run.shift_id
    where run.id = run_id and app_private.is_restaurant_member(s.restaurant_id)
  ));

create policy "results_write_members" on public.shift_checklist_item_results for all to authenticated
  using (exists (
    select 1 from public.shift_checklist_runs run
    join public.shifts s on s.id = run.shift_id
    where run.id = run_id and app_private.is_restaurant_member(s.restaurant_id)
  ))
  with check (exists (
    select 1 from public.shift_checklist_runs run
    join public.shifts s on s.id = run.shift_id
    where run.id = run_id and app_private.is_restaurant_member(s.restaurant_id)
  ));

grant select, insert, update, delete on public.checklist_templates to authenticated;
grant select, insert, update, delete on public.checklist_items to authenticated;
grant select, insert, update, delete on public.shift_checklist_runs to authenticated;
grant select, insert, update, delete on public.shift_checklist_item_results to authenticated;

-- Redefine bootstrap_demo_workspace to seed templates and items, runs, and results
create or replace function public.bootstrap_demo_workspace()
returns table (restaurant_id uuid)
language plpgsql
security definer
set search_path = public
as $$
declare
  current_user_id uuid := auth.uid();
  auth_user_email text;
  workspace_id uuid;
  cold_station_id uuid;
  hot_station_id uuid;
  prep_station_id uuid;
  pass_station_id uuid;
  sushi_station_id uuid;
  shift_id uuid;
  nord_fish_id uuid;
  prime_market_id uuid;
  asian_pro_id uuid;
  bio_herbs_id uuid;
  tuna_recipe_id uuid;
  soup_recipe_id uuid;
  duck_recipe_id uuid;
  -- Checklist Template IDs
  general_tpl_id uuid;
  cold_setup_tpl_id uuid;
  cold_service_tpl_id uuid;
  cold_close_tpl_id uuid;
  hot_setup_tpl_id uuid;
  hot_service_tpl_id uuid;
  hot_close_tpl_id uuid;
  prep_setup_tpl_id uuid;
  prep_service_tpl_id uuid;
  prep_close_tpl_id uuid;
  pass_setup_tpl_id uuid;
  pass_service_tpl_id uuid;
  pass_close_tpl_id uuid;
  sushi_setup_tpl_id uuid;
  sushi_service_tpl_id uuid;
  sushi_close_tpl_id uuid;
begin
  if current_user_id is null then
    raise exception 'Not authenticated';
  end if;

  perform public.ensure_user_profile();

  select email into auth_user_email
  from auth.users
  where id = current_user_id;

  select rm.restaurant_id into workspace_id
  from public.restaurant_members rm
  where rm.user_id = current_user_id
    and rm.status = 'active'
  order by rm.created_at
  limit 1;

  if workspace_id is not null then
    if not exists (select 1 from public.checklist_templates where restaurant_id = workspace_id) then
      select s.id into cold_station_id from public.stations s where s.restaurant_id = workspace_id and s.name = 'Холодный цех';
      select s.id into hot_station_id from public.stations s where s.restaurant_id = workspace_id and s.name = 'Горячий цех';
      select s.id into prep_station_id from public.stations s where s.restaurant_id = workspace_id and s.name = 'Заготовочный';
      select s.id into pass_station_id from public.stations s where s.restaurant_id = workspace_id and s.name = 'Pass / выдача';
      select s.id into sushi_station_id from public.stations s where s.restaurant_id = workspace_id and s.name = 'Суши';
      select s.id into shift_id from public.shifts s where s.restaurant_id = workspace_id order by s.created_at desc limit 1;

      -- Seed Checklist Templates & Items
      -- General Checklist
      insert into public.checklist_templates (restaurant_id, station_id, title, phase)
      values (workspace_id, null, 'Общий чек-лист смены', 'general')
      returning id into general_tpl_id;
      insert into public.checklist_items (template_id, title, sort_order)
      values
        (general_tpl_id, 'Короткий бриф смены проведен', 10),
        (general_tpl_id, 'Стоп-лист подтвержден у pass', 20),
        (general_tpl_id, 'VIP и аллергены сверены', 30),
        (general_tpl_id, 'Критичные остатки проверены', 40),
        (general_tpl_id, 'Гигиена и маркировка проверены', 50);

      -- Cold Station Checklists
      insert into public.checklist_templates (restaurant_id, station_id, title, phase)
      values (workspace_id, cold_station_id, 'Холодный цех', 'setup')
      returning id into cold_setup_tpl_id;
      insert into public.checklist_items (template_id, title, sort_order)
      values
        (cold_setup_tpl_id, 'Проверить температуру холодильника', 10),
        (cold_setup_tpl_id, 'Разложить ножи, доски, перчатки', 20),
        (cold_setup_tpl_id, 'Сверить стоп-лист по рыбе', 30);

      insert into public.checklist_templates (restaurant_id, station_id, title, phase)
      values (workspace_id, cold_station_id, 'Холодный цех', 'service')
      returning id into cold_service_tpl_id;
      insert into public.checklist_items (template_id, title, sort_order)
      values
        (cold_service_tpl_id, 'Готовить тартар только перед отдачей', 10),
        (cold_service_tpl_id, 'Проверить фото эталона', 20),
        (cold_service_tpl_id, 'Сигналить pass при нехватке продукта', 30);

      insert into public.checklist_templates (restaurant_id, station_id, title, phase)
      values (workspace_id, cold_station_id, 'Холодный цех', 'close')
      returning id into cold_close_tpl_id;
      insert into public.checklist_items (template_id, title, sort_order)
      values
        (cold_close_tpl_id, 'Промаркировать остатки', 10),
        (cold_close_tpl_id, 'Списать спорный продукт', 20),
        (cold_close_tpl_id, 'Передать заметки су-шефу', 30);

      -- Hot Station Checklists
      insert into public.checklist_templates (restaurant_id, station_id, title, phase)
      values (workspace_id, hot_station_id, 'Горячий цех', 'setup')
      returning id into hot_setup_tpl_id;
      insert into public.checklist_items (template_id, title, sort_order)
      values
        (hot_setup_tpl_id, 'Включить линию и проверить сковороды', 10),
        (hot_setup_tpl_id, 'Проверить термощуп', 20),
        (hot_setup_tpl_id, 'Разложить гарнины по порциям', 30);

      insert into public.checklist_templates (restaurant_id, station_id, title, phase)
      values (workspace_id, hot_station_id, 'Горячий цех', 'service')
      returning id into hot_service_tpl_id;
      insert into public.checklist_items (template_id, title, sort_order)
      values
        (hot_service_tpl_id, 'Работать партиями, не забивать плиту', 10),
        (hot_service_tpl_id, 'Температуру спорного блюда проверять до pass', 20),
        (hot_service_tpl_id, 'Срочные задержки сообщать сразу', 30);

      insert into public.checklist_templates (restaurant_id, station_id, title, phase)
      values (workspace_id, hot_station_id, 'Горячий цех', 'close')
      returning id into hot_close_tpl_id;
      insert into public.checklist_items (template_id, title, sort_order)
      values
        (hot_close_tpl_id, 'Охладить заготовки по правилу кухни', 10),
        (hot_close_tpl_id, 'Закрыть газ/индукцию', 20),
        (hot_close_tpl_id, 'Отметить остатки масла и гарниров', 30);

      -- Prep Station Checklists
      insert into public.checklist_templates (restaurant_id, station_id, title, phase)
      values (workspace_id, prep_station_id, 'Заготовочный', 'setup')
      returning id into prep_setup_tpl_id;
      insert into public.checklist_items (template_id, title, sort_order)
      values
        (prep_setup_tpl_id, 'Сверить план заготовок', 10),
        (prep_setup_tpl_id, 'Подготовить чистые контейнеры и этикетки', 20),
        (prep_setup_tpl_id, 'Проверить сырье на приемке', 30);

      insert into public.checklist_templates (restaurant_id, station_id, title, phase)
      values (workspace_id, prep_station_id, 'Заготовочный', 'service')
      returning id into prep_service_tpl_id;
      insert into public.checklist_items (template_id, title, sort_order)
      values
        (prep_service_tpl_id, 'Пополнять линии без хаоса', 10),
        (prep_service_tpl_id, 'Держать FIFO', 20),
        (prep_service_tpl_id, 'Сигналить низкие остатки до нуля', 30);

      insert into public.checklist_templates (restaurant_id, station_id, title, phase)
      values (workspace_id, prep_station_id, 'Заготовочный', 'close')
      returning id into prep_close_tpl_id;
      insert into public.checklist_items (template_id, title, sort_order)
      values
        (prep_close_tpl_id, 'Пересчитать критичные остатки', 10),
        (prep_close_tpl_id, 'Закрыть маркировку', 20),
        (prep_close_tpl_id, 'Передать список на закупку', 30);

      -- Pass Station Checklists
      insert into public.checklist_templates (restaurant_id, station_id, title, phase)
      values (workspace_id, pass_station_id, 'Pass / выдача', 'setup')
      returning id into pass_setup_tpl_id;
      insert into public.checklist_items (template_id, title, sort_order)
      values
        (pass_setup_tpl_id, 'Сверить VIP и аллергены', 10),
        (pass_setup_tpl_id, 'Обновить стоп-лист', 20),
        (pass_setup_tpl_id, 'Провести короткий бриф', 30);

      insert into public.checklist_templates (restaurant_id, station_id, title, phase)
      values (workspace_id, pass_station_id, 'Pass / выдача', 'service')
      returning id into pass_service_tpl_id;
      insert into public.checklist_items (template_id, title, sort_order)
      values
        (pass_service_tpl_id, 'Принимать сигналы цехов', 10),
        (pass_service_tpl_id, 'Решать очередность отдачи', 20),
        (pass_service_tpl_id, 'Не выпускавать спорную тарелку', 30);

      insert into public.checklist_templates (restaurant_id, station_id, title, phase)
      values (workspace_id, pass_station_id, 'Pass / выдача', 'close')
      returning id into pass_close_tpl_id;
      insert into public.checklist_items (template_id, title, sort_order)
      values
        (pass_close_tpl_id, 'Закрыть журнал проблем', 10),
        (pass_close_tpl_id, 'Собрать handover', 20),
        (pass_close_tpl_id, 'Подтвердить закупочные заявки', 30);

      -- Sushi Station Checklists
      insert into public.checklist_templates (restaurant_id, station_id, title, phase)
      values (workspace_id, sushi_station_id, 'Суши', 'setup')
      returning id into sushi_setup_tpl_id;
      insert into public.checklist_items (template_id, title, sort_order)
      values
        (sushi_setup_tpl_id, 'Проверить рис и уксус', 10),
        (sushi_setup_tpl_id, 'Подготовить чистый нож', 20),
        (sushi_setup_tpl_id, 'Сверить рыбу со стоп-листом', 30);

      insert into public.checklist_templates (restaurant_id, station_id, title, phase)
      values (workspace_id, sushi_station_id, 'Суши', 'service')
      returning id into sushi_service_tpl_id;
      insert into public.checklist_items (template_id, title, sort_order)
      values
        (sushi_service_tpl_id, 'Держать порции ровно', 10),
        (sushi_service_tpl_id, 'Сразу убирать сырой продукт', 20),
        (sushi_service_tpl_id, 'Любой запах/цвет сообщать pass', 30);

      insert into public.checklist_templates (restaurant_id, station_id, title, phase)
      values (workspace_id, sushi_station_id, 'Суши', 'close')
      returning id into sushi_close_tpl_id;
      insert into public.checklist_items (template_id, title, sort_order)
      values
        (sushi_close_tpl_id, 'Списать остатки по правилам', 10),
        (sushi_close_tpl_id, 'Промыть и высушить коврики', 20),
        (sushi_close_tpl_id, 'Отметить соусы и нори', 30);

      -- Create Checklist Runs for Current Shift
      if shift_id is not null then
        insert into public.shift_checklist_runs (shift_id, template_id)
        select shift_id, id
        from public.checklist_templates
        where restaurant_id = workspace_id
        on conflict do nothing;

        insert into public.shift_checklist_item_results (run_id, item_id, is_completed)
        select run.id, item.id, (item.sort_order = 10)
        from public.shift_checklist_runs run
        join public.checklist_items item on item.template_id = run.template_id
        where run.shift_id = shift_id
        on conflict do nothing;
      end if;
    end if;

    return query select workspace_id;
    return;
  end if;

  insert into public.restaurants (name, owner_user_id, timezone)
  values ('Chef OS Demo', current_user_id, 'Europe/Warsaw')
  returning id into workspace_id;

  insert into public.restaurant_members (restaurant_id, user_id, email, role, status)
  values (workspace_id, current_user_id, auth_user_email, 'owner', 'active');

  insert into public.stations (restaurant_id, name, description, owner_label, sort_order)
  values
    (workspace_id, 'Холодный цех', 'Салаты, тартары, холодные закуски, заготовки для подачи без горячей линии.', 'Ирина', 10),
    (workspace_id, 'Горячий цех', 'Основные блюда, термообработка, гарниры, контроль температуры подачи.', 'Матеуш', 20),
    (workspace_id, 'Заготовочный', 'Mise en place, нарезки, маринады, полуфабрикаты и маркировка сроков.', 'Саша', 30),
    (workspace_id, 'Pass / выдача', 'Контроль финальной подачи, стоп-лист, коммуникация зала и кухни.', 'Олег', 40),
    (workspace_id, 'Суши', 'Рис, нори, рыба, роллы, сашими, соусы и контроль чистого холодного процесса.', 'Ника', 50);

  select s.id into cold_station_id from public.stations s where s.restaurant_id = workspace_id and s.name = 'Холодный цех';
  select s.id into hot_station_id from public.stations s where s.restaurant_id = workspace_id and s.name = 'Горячий цех';
  select s.id into prep_station_id from public.stations s where s.restaurant_id = workspace_id and s.name = 'Заготовочный';
  select s.id into pass_station_id from public.stations s where s.restaurant_id = workspace_id and s.name = 'Pass / выдача';
  select s.id into sushi_station_id from public.stations s where s.restaurant_id = workspace_id and s.name = 'Суши';

  insert into public.staff_contacts (restaurant_id, station_id, app_user_id, full_name, role_label, phone)
  values
    (workspace_id, pass_station_id, null, 'Олег', 'Су-шеф', '+48123123123'),
    (workspace_id, cold_station_id, null, 'Ирина', 'Повар', '+48123123124'),
    (workspace_id, hot_station_id, null, 'Матеуш', 'Повар', '+48123123125'),
    (workspace_id, prep_station_id, null, 'Саша', 'Повар', '+48123123126'),
    (workspace_id, sushi_station_id, null, 'Ника', 'Повар', '+48123123127');

  insert into public.shifts (restaurant_id, shift_date, title, peak_window, status)
  values (workspace_id, current_date, 'Вечерняя смена', '18:30-21:00', 'active')
  returning id into shift_id;

  insert into public.shift_tasks (shift_id, station_id, title, priority, status)
  values
    (shift_id, null, 'Принять рыбу и температуру', 'critical', 'todo'),
    (shift_id, hot_station_id, 'Бер блан 2 литра', 'normal', 'todo'),
    (shift_id, pass_station_id, 'Обновить стоп-лист по тунцу', 'critical', 'todo'),
    (shift_id, cold_station_id, 'Фото эталона тартара', 'normal', 'done');

  insert into public.suppliers (restaurant_id, name, category, phone, minimum_order)
  values
    (workspace_id, 'Nord Fish', 'Рыба', null, 'по заявке') returning id into nord_fish_id;
  insert into public.suppliers (restaurant_id, name, category, phone, minimum_order)
  values
    (workspace_id, 'Prime Market', 'Молочные продукты', null, 'от 50 EUR') returning id into prime_market_id;
  insert into public.suppliers (restaurant_id, name, category, phone, minimum_order)
  values
    (workspace_id, 'Asian Pro', 'Азиатская бакалея', null, 'от 80 EUR') returning id into asian_pro_id;
  insert into public.suppliers (restaurant_id, name, category, phone, minimum_order)
  values
    (workspace_id, 'Bio Herbs', 'Зелень', null, 'по заявке') returning id into bio_herbs_id;

  insert into public.inventory_items (restaurant_id, station_id, supplier_id, name, unit_label, par_level, current_note)
  values
    (workspace_id, cold_station_id, nord_fish_id, 'Тунец', 'лоток', 4, '1 лоток'),
    (workspace_id, hot_station_id, prime_market_id, 'Сливочное масло', 'пачка', 8, '2 пачки'),
    (workspace_id, sushi_station_id, asian_pro_id, 'Соевый соус', 'банка', 6, '1 банка'),
    (workspace_id, cold_station_id, bio_herbs_id, 'Микс зелени', 'бокс', 3, 'норма');

  insert into public.recipes (restaurant_id, title, category, yield_label, prep_time_minutes, food_cost, allergens, image_url)
  values
    (workspace_id, 'Тартар из тунца', 'Закуски', '180 г', 12, 4.80, 'рыба, кунжут', 'https://images.unsplash.com/photo-1600891964599-f61ba0e24092?auto=format&fit=crop&w=240&q=80')
  returning id into tuna_recipe_id;
  insert into public.recipe_steps (recipe_id, body, sort_order)
  values
    (tuna_recipe_id, 'Охладить миску и нож', 10),
    (tuna_recipe_id, 'Нарезать кубик 6 мм', 20),
    (tuna_recipe_id, 'Смешать с соусом перед отдачей', 30),
    (tuna_recipe_id, 'Проверить фото эталона', 40);

  insert into public.recipes (restaurant_id, title, category, yield_label, prep_time_minutes, food_cost, allergens, image_url)
  values
    (workspace_id, 'Крем-суп из тыквы', 'Супы', '320 г', 28, 2.10, 'сливки', 'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=240&q=80')
  returning id into soup_recipe_id;
  insert into public.recipe_steps (recipe_id, body, sort_order)
  values
    (soup_recipe_id, 'Прогреть основу', 10),
    (soup_recipe_id, 'Пробить до гладкости', 20),
    (soup_recipe_id, 'Проверить соль', 30),
    (soup_recipe_id, 'Подать с семечками', 40);

  insert into public.recipes (restaurant_id, title, category, yield_label, prep_time_minutes, food_cost, allergens, image_url)
  values
    (workspace_id, 'Утиная грудка', 'Горячее', '260 г', 34, 7.40, 'нет', 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=240&q=80')
  returning id into duck_recipe_id;
  insert into public.recipe_steps (recipe_id, body, sort_order)
  values
    (duck_recipe_id, 'Надсечь кожу', 10),
    (duck_recipe_id, 'Старт на холодной сковороде', 20),
    (duck_recipe_id, 'Довести до 56 C', 30),
    (duck_recipe_id, 'Отдых 6 минут', 40);

  insert into public.activity_log (restaurant_id, actor_user_id, actor_label, action, entity_type, metadata)
  values
    (workspace_id, current_user_id, 'Chef OS', 'Создан demo workspace после Google входа', 'restaurant', jsonb_build_object('tone', 'green', 'entity', 'Auth'));

  insert into public.channel_messages (restaurant_id, sender_user_id, sender_label, body)
  values
    (workspace_id, current_user_id, 'Chef', 'Chef OS подключен к Supabase workspace.');

  -- 1. Seed Checklist Templates & Items
  -- General Checklist
  insert into public.checklist_templates (restaurant_id, station_id, title, phase)
  values (workspace_id, null, 'Общий чек-лист смены', 'general')
  returning id into general_tpl_id;
  insert into public.checklist_items (template_id, title, sort_order)
  values
    (general_tpl_id, 'Короткий бриф смены проведен', 10),
    (general_tpl_id, 'Стоп-лист подтвержден у pass', 20),
    (general_tpl_id, 'VIP и аллергены сверены', 30),
    (general_tpl_id, 'Критичные остатки проверены', 40),
    (general_tpl_id, 'Гигиена и маркировка проверены', 50);

  -- Cold Station Checklists
  insert into public.checklist_templates (restaurant_id, station_id, title, phase)
  values (workspace_id, cold_station_id, 'Холодный цех', 'setup')
  returning id into cold_setup_tpl_id;
  insert into public.checklist_items (template_id, title, sort_order)
  values
    (cold_setup_tpl_id, 'Проверить температуру холодильника', 10),
    (cold_setup_tpl_id, 'Разложить ножи, доски, перчатки', 20),
    (cold_setup_tpl_id, 'Сверить стоп-лист по рыбе', 30);

  insert into public.checklist_templates (restaurant_id, station_id, title, phase)
  values (workspace_id, cold_station_id, 'Холодный цех', 'service')
  returning id into cold_service_tpl_id;
  insert into public.checklist_items (template_id, title, sort_order)
  values
    (cold_service_tpl_id, 'Готовить тартар только перед отдачей', 10),
    (cold_service_tpl_id, 'Проверять фото эталона', 20),
    (cold_service_tpl_id, 'Сигналить pass при нехватке продукта', 30);

  insert into public.checklist_templates (restaurant_id, station_id, title, phase)
  values (workspace_id, cold_station_id, 'Холодный цех', 'close')
  returning id into cold_close_tpl_id;
  insert into public.checklist_items (template_id, title, sort_order)
  values
    (cold_close_tpl_id, 'Промаркировать остатки', 10),
    (cold_close_tpl_id, 'Списать спорный продукт', 20),
    (cold_close_tpl_id, 'Передать заметки су-шефу', 30);

  -- Hot Station Checklists
  insert into public.checklist_templates (restaurant_id, station_id, title, phase)
  values (workspace_id, hot_station_id, 'Горячий цех', 'setup')
  returning id into hot_setup_tpl_id;
  insert into public.checklist_items (template_id, title, sort_order)
  values
    (hot_setup_tpl_id, 'Включить линию и проверить сковороды', 10),
    (hot_setup_tpl_id, 'Проверить термощуп', 20),
    (hot_setup_tpl_id, 'Разложить гарниры по порциям', 30);

  insert into public.checklist_templates (restaurant_id, station_id, title, phase)
  values (workspace_id, hot_station_id, 'Горячий цех', 'service')
  returning id into hot_service_tpl_id;
  insert into public.checklist_items (template_id, title, sort_order)
  values
    (hot_service_tpl_id, 'Работать партиями, не забивать плиту', 10),
    (hot_service_tpl_id, 'Температуру спорного блюда проверять до pass', 20),
    (hot_service_tpl_id, 'Срочные задержки сообщать сразу', 30);

  insert into public.checklist_templates (restaurant_id, station_id, title, phase)
  values (workspace_id, hot_station_id, 'Горячий цех', 'close')
  returning id into hot_close_tpl_id;
  insert into public.checklist_items (template_id, title, sort_order)
  values
    (hot_close_tpl_id, 'Охладить заготовки по правилу кухни', 10),
    (hot_close_tpl_id, 'Закрыть газ/индукцию', 20),
    (hot_close_tpl_id, 'Отметить остатки масла и гарниров', 30);

  -- Prep Station Checklists
  insert into public.checklist_templates (restaurant_id, station_id, title, phase)
  values (workspace_id, prep_station_id, 'Заготовочный', 'setup')
  returning id into prep_setup_tpl_id;
  insert into public.checklist_items (template_id, title, sort_order)
  values
    (prep_setup_tpl_id, 'Сверить план заготовок', 10),
    (prep_setup_tpl_id, 'Подготовить чистые контейнеры и этикетки', 20),
    (prep_setup_tpl_id, 'Проверить сырье на приемке', 30);

  insert into public.checklist_templates (restaurant_id, station_id, title, phase)
  values (workspace_id, prep_station_id, 'Заготовочный', 'service')
  returning id into prep_service_tpl_id;
  insert into public.checklist_items (template_id, title, sort_order)
  values
    (prep_service_tpl_id, 'Пополнять линии без хаоса', 10),
    (prep_service_tpl_id, 'Держать FIFO', 20),
    (prep_service_tpl_id, 'Сигналить низкие остатки до нуля', 30);

  insert into public.checklist_templates (restaurant_id, station_id, title, phase)
  values (workspace_id, prep_station_id, 'Заготовочный', 'close')
  returning id into prep_close_tpl_id;
  insert into public.checklist_items (template_id, title, sort_order)
  values
    (prep_close_tpl_id, 'Пересчитать критичные остатки', 10),
    (prep_close_tpl_id, 'Закрыть маркировку', 20),
    (prep_close_tpl_id, 'Передать список на закупку', 30);

  -- Pass Station Checklists
  insert into public.checklist_templates (restaurant_id, station_id, title, phase)
  values (workspace_id, pass_station_id, 'Pass / выдача', 'setup')
  returning id into pass_setup_tpl_id;
  insert into public.checklist_items (template_id, title, sort_order)
  values
    (pass_setup_tpl_id, 'Сверить VIP и аллергены', 10),
    (pass_setup_tpl_id, 'Обновить стоп-лист', 20),
    (pass_setup_tpl_id, 'Провести короткий бриф', 30);

  insert into public.checklist_templates (restaurant_id, station_id, title, phase)
  values (workspace_id, pass_station_id, 'Pass / выдача', 'service')
  returning id into pass_service_tpl_id;
  insert into public.checklist_items (template_id, title, sort_order)
  values
    (pass_service_tpl_id, 'Принимать сигналы цехов', 10),
    (pass_service_tpl_id, 'Решать очередность отдачи', 20),
    (pass_service_tpl_id, 'Не выпускавать спорную тарелку', 30);

  insert into public.checklist_templates (restaurant_id, station_id, title, phase)
  values (workspace_id, pass_station_id, 'Pass / выдача', 'close')
  returning id into pass_close_tpl_id;
  insert into public.checklist_items (template_id, title, sort_order)
  values
    (pass_close_tpl_id, 'Закрыть журнал проблем', 10),
    (pass_close_tpl_id, 'Собрать handover', 20),
    (pass_close_tpl_id, 'Подтвердить закупочные заявки', 30);

  -- Sushi Station Checklists
  insert into public.checklist_templates (restaurant_id, station_id, title, phase)
  values (workspace_id, sushi_station_id, 'Суши', 'setup')
  returning id into sushi_setup_tpl_id;
  insert into public.checklist_items (template_id, title, sort_order)
  values
    (sushi_setup_tpl_id, 'Проверить рис и уксус', 10),
    (sushi_setup_tpl_id, 'Подготовить чистый нож', 20),
    (sushi_setup_tpl_id, 'Сверить рыбу со стоп-листом', 30);

  insert into public.checklist_templates (restaurant_id, station_id, title, phase)
  values (workspace_id, sushi_station_id, 'Суши', 'service')
  returning id into sushi_service_tpl_id;
  insert into public.checklist_items (template_id, title, sort_order)
  values
    (sushi_service_tpl_id, 'Держать порции ровно', 10),
    (sushi_service_tpl_id, 'Сразу убирать сырой продукт', 20),
    (sushi_service_tpl_id, 'Любой запах/цвет сообщать pass', 30);

  insert into public.checklist_templates (restaurant_id, station_id, title, phase)
  values (workspace_id, sushi_station_id, 'Суши', 'close')
  returning id into sushi_close_tpl_id;
  insert into public.checklist_items (template_id, title, sort_order)
  values
    (sushi_close_tpl_id, 'Списать остатки по правилам', 10),
    (sushi_close_tpl_id, 'Промыть и высушить коврики', 20),
    (sushi_close_tpl_id, 'Отметить соусы и нори', 30);

  -- 2. Create Checklist Runs for Current Shift
  insert into public.shift_checklist_runs (shift_id, template_id)
  select shift_id, id
  from public.checklist_templates
  where restaurant_id = workspace_id;

  -- 3. Create Checklist Item Results for Current Shift (first item checked in demo)
  insert into public.shift_checklist_item_results (run_id, item_id, is_completed)
  select run.id, item.id, (item.sort_order = 10)
  from public.shift_checklist_runs run
  join public.checklist_items item on item.template_id = run.template_id
  where run.shift_id = shift_id;

  return query select workspace_id;
end;
$$;

-- Redefine reset_demo_workspace to reset checklists as well
create or replace function public.reset_demo_workspace(actor_label text default null)
returns table (
  restaurant_id uuid,
  deleted_inventory_reports integer,
  deleted_channel_messages integer,
  deleted_activity_rows integer,
  reset_shift_tasks integer
)
language plpgsql
security definer
set search_path = public
as $$
declare
  current_user_id uuid := auth.uid();
  workspace_id uuid;
  account_label text := coalesce(nullif(actor_label, ''), 'Chef OS');
begin
  if current_user_id is null then
    raise exception 'Not authenticated';
  end if;

  select rm.restaurant_id into workspace_id
  from public.restaurant_members rm
  where rm.user_id = current_user_id
    and rm.status = 'active'
    and rm.role = any (array['owner','chef','admin']::public.app_role[])
  order by rm.created_at
  limit 1;

  if workspace_id is null then
    raise exception 'Demo reset requires owner, chef, or admin role';
  end if;

  with deleted as (
    delete from public.inventory_reports ir
    where ir.restaurant_id = workspace_id
    returning 1
  )
  select count(*)::integer into deleted_inventory_reports from deleted;

  with deleted as (
    delete from public.channel_messages cm
    where cm.restaurant_id = workspace_id
    returning 1
  )
  select count(*)::integer into deleted_channel_messages from deleted;

  with deleted as (
    delete from public.activity_log al
    where al.restaurant_id = workspace_id
    returning 1
  )
  select count(*)::integer into deleted_activity_rows from deleted;

  with updated as (
    update public.shift_tasks st
    set
      status = case when st.title = 'Фото эталона тартара' then 'done'::public.task_status else 'todo'::public.task_status end,
      completed_by = null,
      completed_at = null
    from public.shifts s
    where s.id = st.shift_id
      and s.restaurant_id = workspace_id
    returning 1
  )
  select count(*)::integer into reset_shift_tasks from updated;

  -- Reset all checklist item results in this workspace (first item stays checked)
  update public.shift_checklist_item_results r
  set
    is_completed = (
      select (ci.sort_order = 10)
      from public.checklist_items ci
      where ci.id = r.item_id
    ),
    completed_by = null,
    completed_at = null
  where r.run_id in (
    select run.id
    from public.shift_checklist_runs run
    join public.shifts s on s.id = run.shift_id
    where s.restaurant_id = workspace_id
  );

  insert into public.activity_log (restaurant_id, actor_user_id, actor_label, action, entity_type, metadata)
  values (
    workspace_id,
    current_user_id,
    account_label,
    'Demo workspace очищен для показа',
    'restaurant',
    jsonb_build_object('tone', 'green', 'entity', 'Reset')
  );

  insert into public.channel_messages (restaurant_id, sender_user_id, sender_label, body)
  values (workspace_id, current_user_id, account_label, 'Demo workspace очищен и готов к показу.');

  return query select workspace_id, deleted_inventory_reports, deleted_channel_messages, deleted_activity_rows, reset_shift_tasks;
end;
$$;

grant execute on function public.reset_demo_workspace(text) to authenticated;
