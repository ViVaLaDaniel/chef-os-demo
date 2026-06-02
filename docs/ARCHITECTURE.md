# Architecture

## Current Stack

- React
- Vite
- Tailwind CSS
- lucide-react
- Supabase JS client prepared for Auth/API
- Vercel hosting

## Current Runtime Shape

The app currently renders mostly from local seed data in `src/main.jsx`.

Supabase integration is prepared in:

- `src/lib/supabase.js`
- `.env.example`
- `supabase/migrations/20260602191759_chef_os_core_schema.sql`

Without env vars, the app stays in demo mode and does not create a Supabase client.

## Intended Production Shape

One shared backend should serve:

- website for desktop/laptop management;
- installable PWA for phones;
- Android/iOS apps later through Capacitor using the same React codebase.

Data must sync by authenticated account:

- user signs in with Google;
- app loads restaurant membership and role;
- app loads current shift, recipes, stations, staff, inventory, reports, messages, and activity log;
- mobile clients cache critical data locally and sync queued actions when online.

## Interaction Model

The canonical interaction model is documented in:

- `docs/INTERACTION_LOGIC.md`

Future UI work should start there before changing screens. The app must preserve the station-based kitchen workflow: cook profile, personal instruction, universal instructions, station process, quick signals, and activity history.

## Auth Boundary

Supabase Auth is the intended identity provider. Google OAuth must be configured in Supabase Dashboard and Google Cloud.

Authorization must be based on `restaurant_members`, not Google profile metadata.

## Data Boundary

Every operational table is tenant-scoped through `restaurant_id` either directly or through a parent table.

Do not create global kitchen data without a restaurant boundary.
