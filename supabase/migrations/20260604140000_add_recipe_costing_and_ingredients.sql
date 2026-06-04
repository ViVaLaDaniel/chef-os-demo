-- Database Migration: Add Recipe Costing and Ingredient Relations

-- 1. Alter inventory_items to add cost and loss parameters
alter table public.inventory_items 
  add column if not exists cost_per_unit numeric(10, 2) not null default 0.00,
  add column if not exists loss_percent numeric not null default 0.00;

-- 2. Alter recipes to add sales price and margin settings
alter table public.recipes
  add column if not exists sales_price numeric(10, 2) not null default 0.00,
  add column if not exists target_margin_percent numeric not null default 70.00;

-- 3. Create recipe_ingredients table to link recipes with inventory_items
create table if not exists public.recipe_ingredients (
  id uuid primary key default gen_random_uuid(),
  recipe_id uuid not null references public.recipes(id) on delete cascade,
  inventory_item_id uuid not null references public.inventory_items(id) on delete cascade,
  quantity_gross numeric(10, 3) not null default 0.000,
  quantity_net numeric(10, 3) not null default 0.000,
  created_at timestamptz not null default now(),
  unique(recipe_id, inventory_item_id)
);

-- 4. Enable RLS and add policies
alter table public.recipe_ingredients enable row level security;

create policy "recipe_ingredients_read_members" 
  on public.recipe_ingredients 
  for select 
  to authenticated 
  using (exists (select 1 from public.recipes r where r.id = recipe_id and app_private.is_restaurant_member(r.restaurant_id)));

create policy "recipe_ingredients_write_leadership" 
  on public.recipe_ingredients 
  for all 
  to authenticated 
  using (exists (select 1 from public.recipes r where r.id = recipe_id and app_private.has_restaurant_role(r.restaurant_id, array['owner','chef','sous_chef','admin']::public.app_role[]))) 
  with check (exists (select 1 from public.recipes r where r.id = recipe_id and app_private.has_restaurant_role(r.restaurant_id, array['owner','chef','sous_chef','admin']::public.app_role[])));

-- 5. Add index
create index if not exists recipe_ingredients_recipe_idx on public.recipe_ingredients (recipe_id);

-- 6. Redefine bootstrap_demo_workspace to seed costing and recipe ingredients
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
  -- Inventory Item IDs
  item_tuna_id uuid;
  item_butter_id uuid;
  item_sauce_id uuid;
  item_herbs_id uuid;
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
    -- Seed checklists if missing
    if not exists (select 1 from public.checklist_templates where restaurant_id = workspace_id) then
      select s.id into cold_station_id from public.stations s where s.restaurant_id = workspace_id and s.name = 'Холодный цех';
      select s.id into hot_station_id from public.stations s where s.restaurant_id = workspace_id and s.name = 'Горячий цех';
      select s.id into prep_station_id from public.stations s where s.restaurant_id = workspace_id and s.name = 'Заготовочный';
      select s.id into pass_station_id from public.stations s where s.restaurant_id = workspace_id and s.name = 'Pass / выдача';
      select s.id into sushi_station_id from public.stations s where s.restaurant_id = workspace_id and s.name = 'Суши';
      select s.id into shift_id from public.shifts s where s.restaurant_id = workspace_id order by s.created_at desc limit 1;

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

    -- Update inventory item prices if they exist
    update public.inventory_items
    set cost_per_unit = case 
      when name = 'Тунец' then 22.00
      when name = 'Сливочное масло' then 4.50
      when name = 'Соевый соус' then 6.20
      when name = 'Микс зелени' then 2.40
      else 0.00
    end,
    loss_percent = case 
      when name = 'Тунец' then 0.10
      when name = 'Сливочное масло' then 0.02
      when name = 'Микс зелени' then 0.15
      else 0.00
    end
    where restaurant_id = workspace_id;

    -- Update recipes pricing
    update public.recipes
    set sales_price = case 
      when title = 'Тартар из тунца' then 16.50
      when title = 'Крем-суп из тыквы' then 8.50
      when title = 'Утиная грудка' then 24.50
      else 0.00
    end,
    target_margin_percent = 70.00
    where restaurant_id = workspace_id;

    -- Seed recipe_ingredients
    select id into tuna_recipe_id from public.recipes where restaurant_id = workspace_id and title = 'Тартар из тунца';
    select id into soup_recipe_id from public.recipes where restaurant_id = workspace_id and title = 'Крем-суп из тыквы';
    select id into duck_recipe_id from public.recipes where restaurant_id = workspace_id and title = 'Утиная грудка';

    if tuna_recipe_id is not null then
      select id into item_tuna_id from public.inventory_items where restaurant_id = workspace_id and name = 'Тунец';
      select id into item_herbs_id from public.inventory_items where restaurant_id = workspace_id and name = 'Микс зелени';
      select id into item_sauce_id from public.inventory_items where restaurant_id = workspace_id and name = 'Соевый соус';

      if item_tuna_id is not null then
        insert into public.recipe_ingredients (recipe_id, inventory_item_id, quantity_gross, quantity_net)
        values (tuna_recipe_id, item_tuna_id, 0.180, 0.160) on conflict do nothing;
      end if;
      if item_herbs_id is not null then
        insert into public.recipe_ingredients (recipe_id, inventory_item_id, quantity_gross, quantity_net)
        values (tuna_recipe_id, item_herbs_id, 0.020, 0.015) on conflict do nothing;
      end if;
      if item_sauce_id is not null then
        insert into public.recipe_ingredients (recipe_id, inventory_item_id, quantity_gross, quantity_net)
        values (tuna_recipe_id, item_sauce_id, 0.010, 0.010) on conflict do nothing;
      end if;
    end if;

    if soup_recipe_id is not null then
      select id into item_butter_id from public.inventory_items where restaurant_id = workspace_id and name = 'Сливочное масло';
      if item_butter_id is not null then
        insert into public.recipe_ingredients (recipe_id, inventory_item_id, quantity_gross, quantity_net)
        values (soup_recipe_id, item_butter_id, 0.050, 0.050) on conflict do nothing;
      end if;
    end if;

    if duck_recipe_id is not null then
      select id into item_butter_id from public.inventory_items where restaurant_id = workspace_id and name = 'Сливочное масло';
      if item_butter_id is not null then
        insert into public.recipe_ingredients (recipe_id, inventory_item_id, quantity_gross, quantity_net)
        values (duck_recipe_id, item_butter_id, 0.030, 0.030) on conflict do nothing;
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

  -- Oleg linked to owner user (current_user_id)
  insert into public.staff_contacts (restaurant_id, station_id, app_user_id, full_name, role_label, phone)
  values
    (workspace_id, pass_station_id, current_user_id, 'Олег', 'Су-шеф', '+48123123123'),
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

  insert into public.inventory_items (restaurant_id, station_id, supplier_id, name, unit_label, par_level, current_note, cost_per_unit, loss_percent)
  values
    (workspace_id, cold_station_id, nord_fish_id, 'Тунец', 'лоток', 4, '1 лоток', 22.00, 0.10),
    (workspace_id, hot_station_id, prime_market_id, 'Сливочное масло', 'пачка', 8, '2 пачки', 4.50, 0.02),
    (workspace_id, sushi_station_id, asian_pro_id, 'Соевый соус', 'банка', 6, '1 банка', 6.20, 0.00),
    (workspace_id, cold_station_id, bio_herbs_id, 'Микс зелени', 'бокс', 3, 'норма', 2.40, 0.15);

  -- Get seeded inventory item IDs
  select id into item_tuna_id from public.inventory_items where restaurant_id = workspace_id and name = 'Тунец';
  select id into item_butter_id from public.inventory_items where restaurant_id = workspace_id and name = 'Сливочное масло';
  select id into item_sauce_id from public.inventory_items where restaurant_id = workspace_id and name = 'Соевый соус';
  select id into item_herbs_id from public.inventory_items where restaurant_id = workspace_id and name = 'Микс зелени';

  insert into public.recipes (restaurant_id, title, category, yield_label, prep_time_minutes, food_cost, allergens, image_url, sales_price, target_margin_percent)
  values
    (workspace_id, 'Тартар из тунца', 'Закуски', '180 г', 12, 4.80, 'рыба, кунжут', 'https://images.unsplash.com/photo-1600891964599-f61ba0e24092?auto=format&fit=crop&w=240&q=80', 16.50, 70.00)
  returning id into tuna_recipe_id;
  insert into public.recipe_steps (recipe_id, body, sort_order)
  values
    (tuna_recipe_id, 'Охладить миску и нож', 10),
    (tuna_recipe_id, 'Нарезать кубик 6 мм', 20),
    (tuna_recipe_id, 'Смешать с соусом перед отдачей', 30),
    (tuna_recipe_id, 'Проверить фото эталона', 40);

  if tuna_recipe_id is not null then
    if item_tuna_id is not null then
      insert into public.recipe_ingredients (recipe_id, inventory_item_id, quantity_gross, quantity_net)
      values (tuna_recipe_id, item_tuna_id, 0.180, 0.160);
    end if;
    if item_herbs_id is not null then
      insert into public.recipe_ingredients (recipe_id, inventory_item_id, quantity_gross, quantity_net)
      values (tuna_recipe_id, item_herbs_id, 0.020, 0.015);
    end if;
    if item_sauce_id is not null then
      insert into public.recipe_ingredients (recipe_id, inventory_item_id, quantity_gross, quantity_net)
      values (tuna_recipe_id, item_sauce_id, 0.010, 0.010);
    end if;
  end if;

  insert into public.recipes (restaurant_id, title, category, yield_label, prep_time_minutes, food_cost, allergens, image_url, sales_price, target_margin_percent)
  values
    (workspace_id, 'Крем-суп из тыквы', 'Супы', '320 г', 28, 2.10, 'сливки', 'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=240&q=80', 8.50, 70.00)
  returning id into soup_recipe_id;
  insert into public.recipe_steps (recipe_id, body, sort_order)
  values
    (soup_recipe_id, 'Прогреть основу', 10),
    (soup_recipe_id, 'Пробить до гладкости', 20),
    (soup_recipe_id, 'Проверить соль', 30),
    (soup_recipe_id, 'Подать с семечками', 40);

  if soup_recipe_id is not null and item_butter_id is not null then
    insert into public.recipe_ingredients (recipe_id, inventory_item_id, quantity_gross, quantity_net)
    values (soup_recipe_id, item_butter_id, 0.050, 0.050);
  end if;

  insert into public.recipes (restaurant_id, title, category, yield_label, prep_time_minutes, food_cost, allergens, image_url, sales_price, target_margin_percent)
  values
    (workspace_id, 'Утиная грудка', 'Горячее', '260 г', 34, 7.40, 'нет', 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=240&q=80', 24.50, 70.00)
  returning id into duck_recipe_id;
  insert into public.recipe_steps (recipe_id, body, sort_order)
  values
    (duck_recipe_id, 'Надсечь кожу', 10),
    (duck_recipe_id, 'Старт на холодной сковороде', 20),
    (duck_recipe_id, 'Довести до 56 C', 30),
    (duck_recipe_id, 'Отдых 6 минут', 40);

  if duck_recipe_id is not null and item_butter_id is not null then
    insert into public.recipe_ingredients (recipe_id, inventory_item_id, quantity_gross, quantity_net)
    values (duck_recipe_id, item_butter_id, 0.030, 0.030);
  end if;

  insert into public.activity_log (restaurant_id, actor_user_id, actor_label, action, entity_type, metadata)
  values
    (workspace_id, current_user_id, 'Chef OS', 'Создан demo workspace после Google входа', 'restaurant', jsonb_build_object('tone', 'green', 'entity', 'Auth'));

  insert into public.channel_messages (restaurant_id, sender_user_id, sender_label, body)
  values
    (workspace_id, current_user_id, 'Chef', 'Chef OS подключен к Supabase workspace.');

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

  -- Create Checklist Runs for Current Shift
  insert into public.shift_checklist_runs (shift_id, template_id)
  select shift_id, id
  from public.checklist_templates
  where restaurant_id = workspace_id;

  -- Create Checklist Item Results for Current Shift (first item checked in demo)
  insert into public.shift_checklist_item_results (run_id, item_id, is_completed)
  select run.id, item.id, (item.sort_order = 10)
  from public.shift_checklist_runs run
  join public.checklist_items item on item.template_id = run.template_id
  where run.shift_id = shift_id;

  return query select workspace_id;
end;
$$;

-- 7. Backfill existing restaurants
do $$
declare
  r record;
  v_tuna_recipe_id uuid;
  v_soup_recipe_id uuid;
  v_duck_recipe_id uuid;
  v_item_tuna_id uuid;
  v_item_butter_id uuid;
  v_item_sauce_id uuid;
  v_item_herbs_id uuid;
begin
  for r in select id as workspace_id from public.restaurants loop
    -- Update existing items costing
    update public.inventory_items
    set cost_per_unit = case 
      when name = 'Тунец' then 22.00
      when name = 'Сливочное масло' then 4.50
      when name = 'Соевый соус' then 6.20
      when name = 'Микс зелени' then 2.40
      else 0.00
    end,
    loss_percent = case 
      when name = 'Тунец' then 0.10
      when name = 'Сливочное масло' then 0.02
      when name = 'Микс зелени' then 0.15
      else 0.00
    end
    where restaurant_id = r.workspace_id;

    -- Update existing recipes pricing
    update public.recipes
    set sales_price = case 
      when title = 'Тартар из тунца' then 16.50
      when title = 'Крем-суп из тыквы' then 8.50
      when title = 'Утиная грудка' then 24.50
      else 0.00
    end,
    target_margin_percent = 70.00
    where restaurant_id = r.workspace_id;

    -- Link recipe ingredients
    select id into v_tuna_recipe_id from public.recipes where restaurant_id = r.workspace_id and title = 'Тартар из тунца';
    select id into v_soup_recipe_id from public.recipes where restaurant_id = r.workspace_id and title = 'Крем-суп из тыквы';
    select id into v_duck_recipe_id from public.recipes where restaurant_id = r.workspace_id and title = 'Утиная грудка';

    if v_tuna_recipe_id is not null then
      select id into v_item_tuna_id from public.inventory_items where restaurant_id = r.workspace_id and name = 'Тунец';
      select id into v_item_herbs_id from public.inventory_items where restaurant_id = r.workspace_id and name = 'Микс зелени';
      select id into v_item_sauce_id from public.inventory_items where restaurant_id = r.workspace_id and name = 'Соевый соус';

      if v_item_tuna_id is not null then
        insert into public.recipe_ingredients (recipe_id, inventory_item_id, quantity_gross, quantity_net)
        values (v_tuna_recipe_id, v_item_tuna_id, 0.180, 0.160) on conflict do nothing;
      end if;
      if v_item_herbs_id is not null then
        insert into public.recipe_ingredients (recipe_id, inventory_item_id, quantity_gross, quantity_net)
        values (v_tuna_recipe_id, v_item_herbs_id, 0.020, 0.015) on conflict do nothing;
      end if;
      if v_item_sauce_id is not null then
        insert into public.recipe_ingredients (recipe_id, inventory_item_id, quantity_gross, quantity_net)
        values (v_tuna_recipe_id, v_item_sauce_id, 0.010, 0.010) on conflict do nothing;
      end if;
    end if;

    if v_soup_recipe_id is not null then
      select id into v_item_butter_id from public.inventory_items where restaurant_id = r.workspace_id and name = 'Сливочное масло';
      if v_item_butter_id is not null then
        insert into public.recipe_ingredients (recipe_id, inventory_item_id, quantity_gross, quantity_net)
        values (v_soup_recipe_id, v_item_butter_id, 0.050, 0.050) on conflict do nothing;
      end if;
    end if;

    if v_duck_recipe_id is not null then
      select id into v_item_butter_id from public.inventory_items where restaurant_id = r.workspace_id and name = 'Сливочное масло';
      if v_item_butter_id is not null then
        insert into public.recipe_ingredients (recipe_id, inventory_item_id, quantity_gross, quantity_net)
        values (v_duck_recipe_id, v_item_butter_id, 0.030, 0.030) on conflict do nothing;
      end if;
    end if;

  end loop;
end $$;
