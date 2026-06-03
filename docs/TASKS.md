# Tasks

## Immediate

- Keep `docs/INTERACTION_LOGIC.md` aligned with UI behavior.
- Keep `docs/PRODUCT_COMPLETION_CHECKLIST.md` updated after every product iteration.
- Verify remote writes for inventory reports and chat against the production Supabase project.

## Frontend Integration

- Persist general and station checklist completion to Supabase.
- Replace remaining local seed data with Supabase reads.
- Add loading, empty, error, and backend-sync states for every screen.
- Verify inventory reports persist to `inventory_reports` in production.
- Verify shift task completion persists to `shift_tasks` in production. Completed on 2026-06-03 for `Принять рыбу и температуру`.
- Verify chat messages persist to `channel_messages` in production.
- Load station process guides from `stations` and `station_processes`.

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

## Product Enhancements

- Supplier order workflow.
- Recipe version history.
- Stop-list confirmation workflow.
- Push notifications.
- Staff invite flow.
- Restaurant onboarding flow.
