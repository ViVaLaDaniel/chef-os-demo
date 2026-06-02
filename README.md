# Chef OS Demo

Mobile-first React demo for a professional kitchen operations app. The current prototype focuses on the real shift workflow: live shift overview, mise en place tasks, inventory signals, station process guides, recipe cards, staff calls, chat, and activity history.

## Stack

- React
- Vite
- Tailwind CSS
- lucide-react

## Run

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Product Roadmap

### Phase 1: Frontend MVP

- Shift command screen with critical alerts, stop-list, mise en place, and staff list.
- Inventory signals for cooks: low stock, one unit left, finished ingredient.
- Station process guide for cold, hot, prep, pass, sushi, and other kitchen zones.
- Recipe cards with steps, allergens, yield, food cost, and reference images.
- Activity history for key actions.

### Phase 2: Shared Backend

- Add Supabase project with one shared database for web, Android, and iOS.
- Add Google sign-in via Supabase Auth.
- Create roles: chef, sous-chef, cook, purchaser, admin.
- Add row-level security so each restaurant/team sees only its own data.
- Store shift assignments, inventory reports, recipes, station guides, suppliers, and activity log.

### Phase 3: Account Sync

- When a user logs in, load their restaurant, role, current shift, recipes, inventory, and station tasks.
- Cache critical data locally on the phone for bad kitchen Wi-Fi.
- Sync offline actions after connection returns.
- Keep activity history server-side for auditability.

### Phase 4: App Surfaces

- Web app for desktop/laptop management.
- PWA for browser install on phones.
- Android and iOS apps via Capacitor using the same React codebase.
- Add camera/gallery flows for inventory photos and issue reports.
- Use `tel:` for quick staff/supplier calls; add native contact permissions only in the mobile app phase.

## Supabase Setup

The app is prepared for Supabase Auth and a shared database, but production credentials are not committed.

1. Create or choose a Supabase project for Chef OS.
2. Apply the migration in `supabase/migrations`.
3. Enable Google as an Auth provider in Supabase Dashboard.
4. Add the deployed Vercel URL to Supabase Auth redirect URLs.
5. Set these Vercel environment variables:

```bash
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-publishable-or-anon-key
```

The database model is tenant-based: every operational table is connected to `restaurants`, and access is controlled through `restaurant_members` roles and RLS.
