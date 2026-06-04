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
- `inventory_items`: tracked ingredients/items (extended with `cost_per_unit` and `loss_percent`).
- `inventory_reports`: cook-submitted low stock signals.
- `recipes`: TTK/recipe cards (extended with `sales_price` and `target_margin_percent`).
- `recipe_steps`: ordered recipe instructions.
- `recipe_ingredients`: junction table connecting recipes and inventory items (gross and net weights).
- `checklist_templates`: template definitions for checklists.
- `checklist_items`: checklist template items.
- `shift_checklist_runs`: checklist runs tracked per shift.
- `shift_checklist_item_results`: checked items for each shift checklist run.
- `activity_log`: audit trail.
- `channel_messages`: kitchen chat messages.

## Applied Schema Extensions

### Recipe Costing & Ingredients (2026-06-04)
- **`inventory_items` additions**:
  - `cost_per_unit` (numeric) — price per unit (e.g. per kg).
  - `loss_percent` (numeric) — waste factor (e.g. 0.15 for 15% waste during cleaning).
- **`recipes` additions**:
  - `sales_price` (numeric) — price guest pays.
  - `target_margin_percent` (numeric) — target gross profit margin.
- **`recipe_ingredients` table**:
  - `recipe_id` references `recipes(id)`
  - `inventory_item_id` references `inventory_items(id)`
  - `quantity_gross` (numeric) — amount used before prep losses (triggers food cost).
  - `quantity_net` (numeric) — net amount on plate.

## Proposed Extensions: Banquet & Event Menus

To support banquet and catering menus, we plan to add:
- **`events`**: Event information (name, date, guest count, status, restaurant_id).
- **`event_recipes`**: Junction table connecting events to recipes with custom portion scaling factors.
- **`event_purchasing_lists`**: Computed material requirements dynamically generated from recipe ingredients and events guest counts.

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
