# Tasks

## Immediate

- Keep `docs/INTERACTION_LOGIC.md` aligned with UI behavior.
- Keep `docs/PRODUCT_COMPLETION_CHECKLIST.md` updated after every product iteration.

## Product Enhancements & Costing (Active)

- [x] Implement ingredient price and waste editing ("Base" tab). Completed on 2026-06-04.
- [x] Implement dynamic food cost calculation from recipe ingredients. Completed on 2026-06-04.
- [x] Create recipe ingredients editor in detailed cards. Completed on 2026-06-04.
- [x] Add high Food Cost warnings (>30% of sales price). Completed on 2026-06-04.

## Banquet & Event Menus (Proposed)

- [ ] Design database migrations for `events` and `event_recipes` tables.
- [ ] Implement data loaders and mapping functions in `chefOsRemote.js` for banquet event events.
- [ ] Build Banquet sheet/screen UI to configure menus, scale portion sizes, and calculate gross profit margins.
- [ ] Build consolidated purchasing calculator (aggregate weights with waste factor adjustment) and automated station prep tasks distributor.

## Frontend Integration & Mobile

- [x] Persist general and station checklist completion to Supabase. Completed on 2026-06-04.
- [x] Replace remaining local seed data with Supabase reads. Completed on 2026-06-04.
- [ ] Add loading, empty, error, and backend-sync states for every screen.
- [x] Verify inventory reports persist to `inventory_reports` in production. Completed on 2026-06-03.
- [x] Verify shift task completion persists to `shift_tasks` in production. Completed on 2026-06-03.
- [x] Verify chat messages persist to `channel_messages` in production. Completed on 2026-06-03.
- [x] Load station process guides from `stations` and `station_processes`. Completed on 2026-06-04.
- [x] Load operational cook profile and role from Supabase membership instead of the fixed demo cook. Completed on 2026-06-04.

## Roles

- Chef: all operational actions.
- Sous-chef: shift execution, reports confirmation, process updates.
- Cook: read recipes/processes, complete own tasks, create stock signals.
- Purchaser: supplier and order-related actions.
- Admin: workspace/member settings.

## Mobile And Web

- Add install prompt flow on top of the prepared PWA manifest.
- Add Supabase sync queue for locally cached inventory signals and task completion.
- Evaluate Capacitor for Android/iOS packaging.
- Add camera/gallery flow for inventory report photos.
