# Architecture

## Current Stack

- React
- Vite
- Tailwind CSS
- lucide-react
- Supabase JS client prepared for Auth/API
- Vercel hosting

## Current Runtime Shape

The app is connected to the live Supabase project `zqkwfflhjuckjmxqqheh` in production. It features:
- **Real-time database integration**: Reads and writes task status, checklists, inventory signals, chat messages, and costing updates dynamically from Supabase.
- **Offline cache shell**: Uses standard Service Worker PWA manifest to cache application assets and caches the operational state inside `localStorage`.
- **Demo fallback**: Fallback mock logic is triggered if the Supabase environment is unavailable.

## Production Shape & Sync Strategy

The app runs on Vercel as a single-page React app and integrates with Supabase via client-side operations:
- **OAuth authentication**: Google Sign-In populates session details and maps current user memberships.
- **Role-based views**: Layout elements and actions adapt depending on user roles (Chef/Sous-chef vs. Cook).
- **Mise en Place & Costing**: Recipe ingredients and costs recalculate dynamically from inventory changes.
- **Offline states**: Local actions are saved to cache for persistency across reloads. A background sync queue for offline action replay is in development.

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
