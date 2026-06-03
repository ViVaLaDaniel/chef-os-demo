# Tasks

## Immediate

- Keep `docs/INTERACTION_LOGIC.md` aligned with UI behavior.
- Keep `docs/PRODUCT_COMPLETION_CHECKLIST.md` updated after every product iteration.
- Confirm target: create dedicated Supabase project `chef-os-demo` or explicitly choose another non-DSGVO project.
- Configure Google OAuth in Supabase and Google Cloud.
- Add Supabase env vars to Vercel.
- Apply and verify the migration on the confirmed Chef OS project.
- Verify first Google login creates the restaurant workspace and owner membership through `bootstrap_demo_workspace()`.

## Frontend Integration

- Persist general and station checklist completion to Supabase.
- Replace remaining local seed data with Supabase reads.
- Add loading, empty, error, and backend-sync states for every screen.
- Verify inventory reports persist to `inventory_reports` after remote project setup.
- Verify shift task completion persists to `shift_tasks` after remote project setup.
- Verify chat messages persist to `channel_messages` after remote project setup.
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
