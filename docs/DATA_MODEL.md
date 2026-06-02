# Data Model

Migration:

- `supabase/migrations/20260602191759_chef_os_core_schema.sql`

## Tenant Model

`restaurants` is the tenant root.

`restaurant_members` connects authenticated users to restaurants and roles:

- `owner`
- `chef`
- `sous_chef`
- `cook`
- `purchaser`
- `admin`

## Main Tables

- `profiles`: user-facing profile fields.
- `restaurants`: restaurant/team workspace.
- `restaurant_members`: role and membership.
- `stations`: kitchen stations such as cold, hot, prep, pass, sushi.
- `station_processes`: process instructions, duties, mistakes, checklists.
- `staff_contacts`: staff list and quick call data.
- `shifts`: shift header.
- `shift_assignments`: who works where and when.
- `shift_tasks`: mise en place and operational tasks.
- `suppliers`: supplier directory.
- `inventory_items`: tracked ingredients/items.
- `inventory_reports`: cook-submitted low stock signals.
- `recipes`: TTK/recipe cards.
- `recipe_steps`: ordered recipe instructions.
- `activity_log`: audit trail.
- `channel_messages`: kitchen chat messages.

## Stock Signal Rule

Cooks should not directly mutate final inventory truth.

Cooks create `inventory_reports`:

- `low`
- `one_left`
- `empty`

Sous-chef/chef/purchaser confirms and changes status:

- `new`
- `confirmed`
- `ordered`
- `delivered`
- `rejected`

## RLS Strategy

RLS is enabled on all public tables.

Policies use restaurant membership checks through private helper functions:

- `app_private.is_restaurant_member`
- `app_private.has_restaurant_role`

Important: do not authorize via user-editable Google/user metadata.
