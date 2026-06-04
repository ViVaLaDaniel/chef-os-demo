-- Migration: Onboarding, Workspace Invitation Codes and Profile Sync trigger

-- 1. Helper function to generate alphanumeric invite codes (CHEF-XXXX-XXXX)
create or replace function public.generate_invite_code()
returns text
language plpgsql
as $$
declare
  chars text := 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  result text := 'CHEF-';
  i integer;
begin
  for i in 1..4 loop
    result := result || substr(chars, floor(random() * length(chars) + 1)::integer, 1);
  end loop;
  result := result || '-';
  for i in 1..4 loop
    result := result || substr(chars, floor(random() * length(chars) + 1)::integer, 1);
  end loop;
  return result;
end;
$$;

-- 2. Add invite_code to public.restaurants
alter table public.restaurants add column if not exists invite_code text unique;

-- 3. Trigger to auto-generate invite_code on restaurant insert
create or replace function public.restaurants_set_invite_code()
returns trigger
language plpgsql
security definer
as $$
begin
  if new.invite_code is null then
    new.invite_code := public.generate_invite_code();
  end if;
  return new;
end;
$$;

drop trigger if exists trigger_restaurants_invite_code on public.restaurants;
create trigger trigger_restaurants_invite_code
  before insert on public.restaurants
  for each row
  execute function public.restaurants_set_invite_code();

-- 4. Backfill existing restaurants
update public.restaurants
set invite_code = public.generate_invite_code()
where invite_code is null;

-- 5. Auto-sync trigger from restaurant_members to staff_contacts
create or replace function public.sync_member_to_staff_contacts()
returns trigger
language plpgsql
security definer
as $$
declare
  member_name text;
  mapped_role text;
begin
  -- Get user name from profiles if exists, or use email/placeholder
  select coalesce(full_name, split_part(new.email, '@', 1), 'Сотрудник')
  into member_name
  from public.profiles
  where id = new.user_id;

  if member_name is null or member_name = '' then
    member_name := coalesce(split_part(new.email, '@', 1), 'Сотрудник');
  end if;

  -- Map database enum public.app_role to Russian label
  mapped_role := case new.role
    when 'owner' then 'Шеф/Владелец'
    when 'chef' then 'Шеф-повар'
    when 'sous_chef' then 'Су-шеф'
    when 'cook' then 'Повар'
    when 'purchaser' then 'Закупщик'
    when 'admin' then 'Администратор'
    else 'Повар'
  end;

  if new.status = 'active' and new.user_id is not null then
    -- Check if contact already exists
    if not exists (
      select 1 from public.staff_contacts
      where restaurant_id = new.restaurant_id
        and app_user_id = new.user_id
    ) then
      insert into public.staff_contacts (
        restaurant_id,
        app_user_id,
        full_name,
        role_label,
        is_active
      ) values (
        new.restaurant_id,
        new.user_id,
        member_name,
        mapped_role,
        true
      );
    else
      -- Update existing contact's role and name
      update public.staff_contacts
      set
        full_name = member_name,
        role_label = mapped_role,
        is_active = true
      where restaurant_id = new.restaurant_id
        and app_user_id = new.user_id;
    end if;
  elsif new.status = 'disabled' and new.user_id is not null then
    -- Deactivate contact
    update public.staff_contacts
    set is_active = false
    where restaurant_id = new.restaurant_id
      and app_user_id = new.user_id;
  end if;

  return new;
end;
$$;

drop trigger if exists trigger_sync_member_to_staff_contacts on public.restaurant_members;
create trigger trigger_sync_member_to_staff_contacts
  after insert or update on public.restaurant_members
  for each row
  execute function public.sync_member_to_staff_contacts();

-- 6. Trigger to sync profiles updates to staff_contacts
create or replace function public.sync_profile_to_staff_contacts()
returns trigger
language plpgsql
security definer
as $$
begin
  update public.staff_contacts
  set full_name = coalesce(new.full_name, full_name)
  where app_user_id = new.id;
  return new;
end;
$$;

drop trigger if exists trigger_sync_profile_to_staff_contacts on public.profiles;
create trigger trigger_sync_profile_to_staff_contacts
  after update on public.profiles
  for each row
  execute function public.sync_profile_to_staff_contacts();

-- 7. Helper function to seed workspace defaults
create or replace function public.seed_workspace_defaults(workspace_id uuid, shift_id uuid)
returns void
language plpgsql
security definer
as $$
declare
  cold_station_id uuid;
  hot_station_id uuid;
  prep_station_id uuid;
  pass_station_id uuid;
  sushi_station_id uuid;
  
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
  select id into cold_station_id from public.stations where restaurant_id = workspace_id and name = 'Холодный цех';
  select id into hot_station_id from public.stations where restaurant_id = workspace_id and name = 'Горячий цех';
  select id into prep_station_id from public.stations where restaurant_id = workspace_id and name = 'Заготовочный';
  select id into pass_station_id from public.stations where restaurant_id = workspace_id and name = 'Pass / выдача';
  select id into sushi_station_id from public.stations where restaurant_id = workspace_id and name = 'Суши';

  -- Seed default station_processes
  insert into public.station_processes (station_id, title, body, process_type, sort_order)
  values
    -- Cold station
    (cold_station_id, 'Проверить зелень и соусы', '', 'duty', 10),
    (cold_station_id, 'Поддерживать чистую доску', '', 'duty', 20),
    (cold_station_id, 'Обновлять фото эталона подачи', '', 'duty', 30),
    (cold_station_id, 'Не смешивать аллергенные соусы', '', 'mistake', 10),
    (cold_station_id, 'Не держать рыбу вне холода дольше 10 минут', '', 'mistake', 20),
    -- Hot station
    (hot_station_id, 'Включить вытяжку и проверить сковороды', '', 'duty', 10),
    (hot_station_id, 'Держать термощуп откалиброванным', '', 'duty', 20),
    (hot_station_id, 'Подача горячих блюд строго от 65°C', '', 'duty', 30),
    (hot_station_id, 'Не отдавать блюда без проверки прожарки', '', 'mistake', 10),
    (hot_station_id, 'Не ставить соусники близко к тепловому мосту', '', 'mistake', 20),
    -- Prep station
    (prep_station_id, 'Маркировать заготовки: дата, время, имя', '', 'duty', 10),
    (prep_station_id, 'Соблюдать FIFO при ротации сырья', '', 'duty', 20),
    (prep_station_id, 'Взвешивать порции на весах', '', 'duty', 30),
    (prep_station_id, 'Не использовать сырье без маркировки', '', 'mistake', 10),
    (prep_station_id, 'Не оставлять рабочее место грязным', '', 'mistake', 20),
    -- Pass station
    (pass_station_id, 'Контролировать время выдачи чеков', '', 'duty', 10),
    (pass_station_id, 'Согласовывать курсы с официантами', '', 'duty', 20),
    (pass_station_id, 'Вести стоп-лист в реальном времени', '', 'duty', 30),
    (pass_station_id, 'Не пропускать блюда с дефектами подачи', '', 'mistake', 10),
    (pass_station_id, 'Не кричать на поваров во время сервиса', '', 'mistake', 20),
    -- Sushi station
    (sushi_station_id, 'Контролировать температуру риса', '', 'duty', 10),
    (sushi_station_id, 'Мыть рисоварку после каждой варки', '', 'duty', 20),
    (sushi_station_id, 'Работать в чистых перчатках', '', 'duty', 30),
    (sushi_station_id, 'Не использовать заветренную рыбу', '', 'mistake', 10),
    (sushi_station_id, 'Не резать теплые роллы тупым ножом', '', 'mistake', 20);

  -- Seed default checklist templates
  -- General
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

  -- Cold Setup / Service / Close
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

  -- Hot Setup / Service / Close
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

  -- Prep Setup / Service / Close
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
    (prep_service_tpl_id, 'Маркировать контейнеры сразу после фасовки', 10),
    (prep_service_tpl_id, 'Сигналить остатки ниже нормы в Склад', 20),
    (prep_service_tpl_id, 'Не оставлять сырье без указания даты и веса', 30);

  insert into public.checklist_templates (restaurant_id, station_id, title, phase)
  values (workspace_id, prep_station_id, 'Заготовочный', 'close')
  returning id into prep_close_tpl_id;
  insert into public.checklist_items (template_id, title, sort_order)
  values
    (prep_close_tpl_id, 'Проверить температуру в ларях', 10),
    (prep_close_tpl_id, 'Вымыть слайсер и вакууматор', 20),
    (prep_close_tpl_id, 'Оформить сменные листы заготовки', 30);

  -- Pass Setup / Service / Close
  insert into public.checklist_templates (restaurant_id, station_id, title, phase)
  values (workspace_id, pass_station_id, 'Pass / выдача', 'setup')
  returning id into pass_setup_tpl_id;
  insert into public.checklist_items (template_id, title, sort_order)
  values
    (pass_setup_tpl_id, 'Сверить бриф и расписание по цехам', 10),
    (pass_setup_tpl_id, 'Запустить тепловые мосты', 20),
    (pass_setup_tpl_id, 'Подготовить стоп-лист в системе', 30);

  insert into public.checklist_templates (restaurant_id, station_id, title, phase)
  values (workspace_id, pass_station_id, 'Pass / выдача', 'service')
  returning id into pass_service_tpl_id;
  insert into public.checklist_items (template_id, title, sort_order)
  values
    (pass_service_tpl_id, 'Контролировать отдачу курсов блюд', 10),
    (pass_service_tpl_id, 'Снимать блокеры и помогать цехам', 20),
    (pass_service_tpl_id, 'Корректировать стоп-лист при выбытии', 30);

  insert into public.checklist_templates (restaurant_id, station_id, title, phase)
  values (workspace_id, pass_station_id, 'Pass / выдача', 'close')
  returning id into pass_close_tpl_id;
  insert into public.checklist_items (template_id, title, sort_order)
  values
    (pass_close_tpl_id, 'Зафиксировать критичные сбои и отзывы', 10),
    (pass_close_tpl_id, 'Проверить чистоту линии выдачи', 20),
    (pass_close_tpl_id, 'Сдать смену в чат и составить отчет', 30);

  -- Sushi Setup / Service / Close
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
    where restaurant_id = workspace_id;

    -- Create Checklist Item Results for Current Shift (first item checked in demo)
    insert into public.shift_checklist_item_results (run_id, item_id, is_completed)
    select run.id, item.id, (item.sort_order = 10)
    from public.shift_checklist_runs run
    join public.checklist_items item on item.template_id = run.template_id
    where run.shift_id = shift_id;
  end if;
end;
$$;

-- 8. RPC: Create a new Restaurant
create or replace function public.create_new_restaurant(restaurant_name text)
returns table (restaurant_id uuid)
language plpgsql
security definer
set search_path = public
as $$
declare
  current_user_id uuid := auth.uid();
  auth_user_email text;
  new_workspace_id uuid;
  cold_station_id uuid;
  hot_station_id uuid;
  prep_station_id uuid;
  pass_station_id uuid;
  sushi_station_id uuid;
  shift_id uuid;
begin
  if current_user_id is null then
    raise exception 'Not authenticated';
  end if;

  -- Ensure profile exists
  perform public.ensure_user_profile();

  select email into auth_user_email
  from auth.users
  where id = current_user_id;

  -- Insert restaurant (invite code will be auto-generated by trigger)
  insert into public.restaurants (name, owner_user_id, timezone)
  values (coalesce(nullif(restaurant_name, ''), 'Моя кухня'), current_user_id, 'Europe/Warsaw')
  returning id into new_workspace_id;

  -- Add membership as owner
  insert into public.restaurant_members (restaurant_id, user_id, email, role, status)
  values (new_workspace_id, current_user_id, auth_user_email, 'owner', 'active');

  -- Seed default stations
  insert into public.stations (restaurant_id, name, description, owner_label, sort_order)
  values
    (new_workspace_id, 'Холодный цех', 'Салаты, тартары, холодные закуски, заготовки для подачи без горячей линии.', null, 10),
    (new_workspace_id, 'Горячий цех', 'Основные блюда, термообработка, гарниры, контроль температуры подачи.', null, 20),
    (new_workspace_id, 'Заготовочный', 'Mise en place, нарезки, маринады, полуфабрикаты и маркировка сроков.', null, 30),
    (new_workspace_id, 'Pass / выдача', 'Контроль финальной подачи, стоп-лист, коммуникация зала и кухни.', null, 40),
    (new_workspace_id, 'Суши', 'Рис, нори, рыба, роллы, сашими, соусы и контроль чистого холодного процесса.', null, 50);

  select id into cold_station_id from public.stations where restaurant_id = new_workspace_id and name = 'Холодный цех';
  select id into hot_station_id from public.stations where restaurant_id = new_workspace_id and name = 'Горячий цех';
  select id into prep_station_id from public.stations where restaurant_id = new_workspace_id and name = 'Заготовочный';
  select id into pass_station_id from public.stations where restaurant_id = new_workspace_id and name = 'Pass / выдача';
  select id into sushi_station_id from public.stations where restaurant_id = new_workspace_id and name = 'Суши';

  -- Create first shift
  insert into public.shifts (restaurant_id, shift_date, title, peak_window, status)
  values (new_workspace_id, current_date, 'Дневная смена', '12:00-15:00', 'active')
  returning id into shift_id;

  -- Create default checklists
  perform public.seed_workspace_defaults(new_workspace_id, shift_id);

  -- Log action
  insert into public.activity_log (restaurant_id, actor_user_id, actor_label, action, entity_type, metadata)
  values (
    new_workspace_id,
    current_user_id,
    coalesce((select full_name from public.profiles where id = current_user_id), 'Шеф'),
    'Создано новое рабочее пространство: ' || restaurant_name,
    'restaurant',
    jsonb_build_object('tone', 'green', 'entity', 'Onboarding')
  );

  return query select new_workspace_id;
end;
$$;

-- 9. RPC: Join an existing Restaurant by invite code
create or replace function public.join_restaurant_by_invite_code(code text)
returns table (restaurant_id uuid)
language plpgsql
security definer
set search_path = public
as $$
declare
  current_user_id uuid := auth.uid();
  auth_user_email text;
  target_restaurant_id uuid;
begin
  if current_user_id is null then
    raise exception 'Not authenticated';
  end if;

  -- Ensure profile exists
  perform public.ensure_user_profile();

  select email into auth_user_email
  from auth.users
  where id = current_user_id;

  -- Find restaurant by upper-case invite code
  select id into target_restaurant_id
  from public.restaurants
  where upper(invite_code) = upper(trim(code));

  if target_restaurant_id is null then
    raise exception 'Неверный код приглашения';
  end if;

  -- Insert membership if not exists
  insert into public.restaurant_members (restaurant_id, user_id, email, role, status)
  values (target_restaurant_id, current_user_id, auth_user_email, 'cook', 'active')
  on conflict (restaurant_id, user_id) do update
  set status = 'active', updated_at = now();

  -- Log action
  insert into public.activity_log (restaurant_id, actor_user_id, actor_label, action, entity_type, metadata)
  values (
    target_restaurant_id,
    current_user_id,
    coalesce((select full_name from public.profiles where id = current_user_id), 'Сотрудник'),
    'Присоединился к рабочему пространству по коду приглашения',
    'restaurant',
    jsonb_build_object('tone', 'blue', 'entity', 'Onboarding')
  );

  return query select target_restaurant_id;
end;
$$;

-- 10. Security grants
revoke all on function public.create_new_restaurant(text) from public;
revoke all on function public.join_restaurant_by_invite_code(text) from public;
revoke all on function public.seed_workspace_defaults(uuid, uuid) from public;

grant execute on function public.create_new_restaurant(text) to authenticated;
grant execute on function public.join_restaurant_by_invite_code(text) to authenticated;
grant execute on function public.seed_workspace_defaults(uuid, uuid) to authenticated;

-- 11. Add foreign key constraint for profile sync joining
alter table public.staff_contacts
  drop constraint if exists staff_contacts_app_user_id_profiles_fk,
  add constraint staff_contacts_app_user_id_profiles_fk
    foreign key (app_user_id) references public.profiles(id)
    on delete set null;

