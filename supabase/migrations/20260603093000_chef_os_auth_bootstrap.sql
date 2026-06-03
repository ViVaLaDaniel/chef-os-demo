create or replace function public.ensure_user_profile()
returns public.profiles
language plpgsql
security definer
set search_path = public
as $$
declare
  current_user_id uuid := auth.uid();
  auth_user record;
  profile_row public.profiles;
begin
  if current_user_id is null then
    raise exception 'Not authenticated';
  end if;

  select
    email,
    raw_user_meta_data
  into auth_user
  from auth.users
  where id = current_user_id;

  insert into public.profiles (id, full_name, avatar_url)
  values (
    current_user_id,
    coalesce(auth_user.raw_user_meta_data->>'full_name', auth_user.raw_user_meta_data->>'name', auth_user.email),
    auth_user.raw_user_meta_data->>'avatar_url'
  )
  on conflict (id) do update
  set
    full_name = excluded.full_name,
    avatar_url = excluded.avatar_url,
    updated_at = now()
  returning * into profile_row;

  return profile_row;
end;
$$;

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

  select id into cold_station_id from public.stations where restaurant_id = workspace_id and name = 'Холодный цех';
  select id into hot_station_id from public.stations where restaurant_id = workspace_id and name = 'Горячий цех';
  select id into prep_station_id from public.stations where restaurant_id = workspace_id and name = 'Заготовочный';
  select id into pass_station_id from public.stations where restaurant_id = workspace_id and name = 'Pass / выдача';
  select id into sushi_station_id from public.stations where restaurant_id = workspace_id and name = 'Суши';

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

  return query select workspace_id;
end;
$$;

revoke all on function public.ensure_user_profile() from public;
revoke all on function public.bootstrap_demo_workspace() from public;
grant execute on function public.ensure_user_profile() to authenticated;
grant execute on function public.bootstrap_demo_workspace() to authenticated;
