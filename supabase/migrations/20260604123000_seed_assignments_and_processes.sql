-- Database Migration: Seed Shift Assignments & Station Processes, and link Owner user to Oleg contact

-- Redefine bootstrap_demo_workspace to include new seeding logic
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
    -- 1. Check if checklists are seeded for this workspace. If not, seed them!
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

    -- 2. Check if shift_assignments exist, if not seed them
    select s.id into shift_id from public.shifts s where s.restaurant_id = workspace_id order by s.created_at desc limit 1;
    if shift_id is not null and not exists (select 1 from public.shift_assignments where shift_id = shift_id) then
      insert into public.shift_assignments (shift_id, staff_contact_id, station_id, starts_at, ends_at, status)
      select 
        shift_id,
        sc.id,
        sc.station_id,
        case 
          when sc.full_name = 'Олег' then '09:00:00'::time
          when sc.full_name = 'Ирина' then '11:00:00'::time
          when sc.full_name = 'Матеуш' then '12:00:00'::time
          when sc.full_name = 'Саша' then '08:00:00'::time
          else '14:00:00'::time
        end,
        case 
          when sc.full_name = 'Олег' then '18:00:00'::time
          when sc.full_name = 'Ирина' then '22:00:00'::time
          when sc.full_name = 'Матеуш' then '23:00:00'::time
          when sc.full_name = 'Саша' then '16:00:00'::time
          else '23:00:00'::time
        end,
        case 
          when sc.full_name in ('Матеуш', 'Ника') then 'expected'
          else 'active'
        end
      from public.staff_contacts sc
      where sc.restaurant_id = workspace_id;
    end if;

    -- 3. Check if station_processes exist, if not seed them
    select s.id into cold_station_id from public.stations s where s.restaurant_id = workspace_id and s.name = 'Холодный цех';
    select s.id into hot_station_id from public.stations s where s.restaurant_id = workspace_id and s.name = 'Горячий цех';
    select s.id into prep_station_id from public.stations s where s.restaurant_id = workspace_id and s.name = 'Заготовочный';
    select s.id into pass_station_id from public.stations s where s.restaurant_id = workspace_id and s.name = 'Pass / выдача';
    select s.id into sushi_station_id from public.stations s where s.restaurant_id = workspace_id and s.name = 'Суши';

    if cold_station_id is not null and not exists (select 1 from public.station_processes where station_id = cold_station_id) then
      insert into public.station_processes (station_id, title, body, process_type, sort_order)
      values
        (cold_station_id, 'Проверить зелень и соусы', '', 'duty', 10),
        (cold_station_id, 'Поддерживать чистую доску', '', 'duty', 20),
        (cold_station_id, 'Обновлять фото эталона подачи', '', 'duty', 30),
        (cold_station_id, 'Не смешивать аллергенные соусы', '', 'mistake', 10),
        (cold_station_id, 'Не держать рыбу вне холода дольше 10 минут', '', 'mistake', 20),

        (hot_station_id, 'Разогреть линию к 17:30', '', 'duty', 10),
        (hot_station_id, 'Проверить термощуп', '', 'duty', 20),
        (hot_station_id, 'Подготовить гарниры на пик', '', 'duty', 30),
        (hot_station_id, 'Не отдавать блюдо без проверки pass', '', 'mistake', 10),
        (hot_station_id, 'Не смешивать щипцы сырого и готового продукта', '', 'mistake', 20),

        (prep_station_id, 'Промаркировать контейнеры', '', 'duty', 10),
        (prep_station_id, 'Сверить план заготовок', '', 'duty', 20),
        (prep_station_id, 'Отметить остатки ниже нормы', '', 'duty', 30),
        (prep_station_id, 'Не оставлять контейнеры без даты', '', 'mistake', 10),
        (prep_station_id, 'Не принимать продукт без температуры', '', 'mistake', 20),

        (pass_station_id, 'Подтвердить стоп-лист', '', 'duty', 10),
        (pass_station_id, 'Сверить VIP-заметки', '', 'duty', 20),
        (pass_station_id, 'Ускорять конфликтные заказы', '', 'duty', 30),
        (pass_station_id, 'Не менять ТТК устно', '', 'mistake', 10),
        (pass_station_id, 'Не отдавать блюдо без финального контроля', '', 'mistake', 20),

        (sushi_station_id, 'Проверить рис и нори', '', 'duty', 10),
        (sushi_station_id, 'Держать отдельный нож', '', 'duty', 20),
        (sushi_station_id, 'Сигналить остатки соевого соуса', '', 'duty', 30),
        (sushi_station_id, 'Не использовать спорную рыбу', '', 'mistake', 10),
        (sushi_station_id, 'Не смешивать доски после сырого продукта', '', 'mistake', 20);
    end if;

    -- 4. Associate Oleg with logged in owner user
    update public.staff_contacts
    set app_user_id = current_user_id
    where restaurant_id = workspace_id and full_name = 'Олег' and app_user_id is null;

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

  -- Seed Shift Assignments
  insert into public.shift_assignments (shift_id, staff_contact_id, station_id, starts_at, ends_at, status)
  select 
    shift_id,
    sc.id,
    sc.station_id,
    case 
      when sc.full_name = 'Олег' then '09:00:00'::time
      when sc.full_name = 'Ирина' then '11:00:00'::time
      when sc.full_name = 'Матеуш' then '12:00:00'::time
      when sc.full_name = 'Саша' then '08:00:00'::time
      else '14:00:00'::time
    end,
    case 
      when sc.full_name = 'Олег' then '18:00:00'::time
      when sc.full_name = 'Ирина' then '22:00:00'::time
      when sc.full_name = 'Матеуш' then '23:00:00'::time
      when sc.full_name = 'Саша' then '16:00:00'::time
      else '23:00:00'::time
    end,
    case 
      when sc.full_name in ('Матеуш', 'Ника') then 'expected'
      else 'active'
    end
  from public.staff_contacts sc
  where sc.restaurant_id = workspace_id;

  -- Seed Station Processes
  insert into public.station_processes (station_id, title, body, process_type, sort_order)
  values
    (cold_station_id, 'Проверить зелень и соусы', '', 'duty', 10),
    (cold_station_id, 'Поддерживать чистую доску', '', 'duty', 20),
    (cold_station_id, 'Обновлять фото эталона подачи', '', 'duty', 30),
    (cold_station_id, 'Не смешивать аллергенные соусы', '', 'mistake', 10),
    (cold_station_id, 'Не держать рыбу вне холода дольше 10 минут', '', 'mistake', 20),

    (hot_station_id, 'Разогреть линию к 17:30', '', 'duty', 10),
    (hot_station_id, 'Проверить термощуп', '', 'duty', 20),
    (hot_station_id, 'Подготовить гарниры на пик', '', 'duty', 30),
    (hot_station_id, 'Не отдавать блюдо без проверки pass', '', 'mistake', 10),
    (hot_station_id, 'Не смешивать щипцы сырого и готового продукта', '', 'mistake', 20),

    (prep_station_id, 'Промаркировать контейнеры', '', 'duty', 10),
    (prep_station_id, 'Сверить план заготовок', '', 'duty', 20),
    (prep_station_id, 'Отметить остатки ниже нормы', '', 'duty', 30),
    (prep_station_id, 'Не оставлять контейнеры без даты', '', 'mistake', 10),
    (prep_station_id, 'Не принимать продукт без температуры', '', 'mistake', 20),

    (pass_station_id, 'Подтвердить стоп-лист', '', 'duty', 10),
    (pass_station_id, 'Сверить VIP-заметки', '', 'duty', 20),
    (pass_station_id, 'Ускорять конфликтные заказы', '', 'duty', 30),
    (pass_station_id, 'Не менять ТТК устно', '', 'mistake', 10),
    (pass_station_id, 'Не отдавать блюдо без финального контроля', '', 'mistake', 20),

    (sushi_station_id, 'Проверить рис и нори', '', 'duty', 10),
    (sushi_station_id, 'Держать отдельный нож', '', 'duty', 20),
    (sushi_station_id, 'Сигналить остатки соевого соуса', '', 'duty', 30),
    (sushi_station_id, 'Не использовать спорную рыбу', '', 'mistake', 10),
    (sushi_station_id, 'Не смешивать доски после сырого продукта', '', 'mistake', 20);

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
