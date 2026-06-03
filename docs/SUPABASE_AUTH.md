# Supabase And Auth

## Current Status

Supabase client wiring exists, and the frontend has a prepared remote data bridge.

No production Vercel env vars are configured yet.

Files:

- `src/lib/supabase.js`
- `src/lib/chefOsRemote.js`
- `.env.example`
- `supabase/migrations/20260602191759_chef_os_core_schema.sql`
- `supabase/migrations/20260603093000_chef_os_auth_bootstrap.sql`

The bootstrap migration adds:

- `public.ensure_user_profile()`
- `public.bootstrap_demo_workspace()`

After Google login, the frontend calls `bootstrap_demo_workspace()` to create or reuse:

- profile;
- restaurant;
- active owner membership;
- demo stations, staff, shift tasks, suppliers, inventory items, recipes, activity, and chat.

## Required Setup

1. Create a dedicated Supabase project for Chef OS.
2. Do not reuse `dsgvo-scanner`.
3. Apply the migration only after confirming the target project.
4. Enable Google provider in Supabase Auth.
5. Add Vercel URL to Auth redirect URLs:
   - `https://chef-os-demo.vercel.app`
6. Add Vercel environment variables:

```bash
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-publishable-or-anon-key
```

Current inspection on 2026-06-03:

- Supabase CLI is authenticated.
- Existing Supabase projects are `ViVaLaDaniel's SD2`, `dsgvo-scanner`, and `Agent-Workspace-DB`.
- No dedicated `chef-os-demo` Supabase project was found.
- Vercel project `chef-os-demo` exists.
- Vercel project `chef-os-demo` currently has no environment variables.

## Google Login Notes

The frontend uses `supabase.auth.signInWithOAuth({ provider: "google" })`.

Google provider setup still requires:

- Google Cloud OAuth client;
- Supabase Auth provider configuration;
- redirect URL alignment;
- Vercel env vars.

Do not commit Google OAuth client secrets. Keep them in Google Cloud, Supabase Auth settings, and Vercel environment variables only.

## Local Docker Warning

Do not run `supabase start` automatically. Docker Desktop may contain local resources for other projects.

If local Supabase is required:

1. Ask Daniel first.
2. Check Docker containers.
3. Confirm no DSGVO Scanner local stack will be affected.
4. Use `supabase stop` after verification.

The previous local attempt timed out and was stopped; no remote database migration was applied.
