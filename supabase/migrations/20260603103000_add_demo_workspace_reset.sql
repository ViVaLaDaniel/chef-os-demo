create or replace function public.reset_demo_workspace()
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

  insert into public.activity_log (restaurant_id, actor_user_id, actor_label, action, entity_type, metadata)
  values (
    workspace_id,
    current_user_id,
    'Chef OS',
    'Demo workspace очищен для показа',
    'restaurant',
    jsonb_build_object('tone', 'green', 'entity', 'Reset')
  );

  insert into public.channel_messages (restaurant_id, sender_user_id, sender_label, body)
  values (workspace_id, current_user_id, 'Chef', 'Demo workspace очищен и готов к показу.');

  return query select workspace_id, deleted_inventory_reports, deleted_channel_messages, deleted_activity_rows, reset_shift_tasks;
end;
$$;

revoke all on function public.reset_demo_workspace() from public;
grant execute on function public.reset_demo_workspace() to authenticated;
