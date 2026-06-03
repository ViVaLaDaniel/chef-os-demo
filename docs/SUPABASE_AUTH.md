# Supabase And Auth

## Current Status

Supabase client wiring exists, and the frontend has a prepared remote data bridge.

Production cloud resources are configured for the Chef OS demo:

- Google Cloud project: `chef-os-demo-20260603`
- Supabase project: `chef-os-demo`
- Supabase ref: `zqkwfflhjuckjmxqqheh`
- Supabase URL: `https://zqkwfflhjuckjmxqqheh.supabase.co`
- Production URL: `https://chef-os-demo.vercel.app`

Files:

- `src/lib/supabase.js`
- `src/lib/chefOsRemote.js`
- `.env.example`
- `supabase/migrations/20260602191759_chef_os_core_schema.sql`
- `supabase/migrations/20260603093000_chef_os_auth_bootstrap.sql`
- `supabase/migrations/20260603100000_fix_bootstrap_demo_workspace.sql`

The bootstrap migration adds:

- `public.ensure_user_profile()`
- `public.bootstrap_demo_workspace()`

After Google login, the frontend calls `bootstrap_demo_workspace()` to create or reuse:

- profile;
- restaurant;
- active owner membership;
- demo stations, staff, shift tasks, suppliers, inventory items, recipes, activity, and chat.

## Completed Setup

1. Created a dedicated Supabase project for Chef OS.
2. Confirmed `dsgvo-scanner` was not reused.
3. Applied migrations to `zqkwfflhjuckjmxqqheh`.
4. Created a Google Cloud OAuth web client in project `chef-os-demo-20260603`.
5. Enabled Google provider in Supabase Auth.
6. Added Supabase Auth redirect URL:
   - `https://zqkwfflhjuckjmxqqheh.supabase.co/auth/v1/callback`
7. Added Vercel URL to Supabase Auth redirect URLs:
   - `https://chef-os-demo.vercel.app`
8. Added Vercel environment variables for Production, Preview, and Development:

```bash
VITE_SUPABASE_URL=https://zqkwfflhjuckjmxqqheh.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=<stored in Vercel>
```

Current inspection on 2026-06-03 after cloud setup and login verification:

- Supabase CLI is authenticated.
- Dedicated Supabase project `chef-os-demo` exists and is linked locally.
- Migrations `20260602191759`, `20260603093000`, and `20260603100000` are applied remotely.
- Vercel project `chef-os-demo` has Supabase env vars in Production, Preview, and Development.
- Google login was verified in production with `zamyatin.daniel@gmail.com`.
- First login created profile, restaurant, owner membership, demo stations, shift tasks, inventory items, activity, and chat rows.

## Google Login Notes

The frontend uses `supabase.auth.signInWithOAuth({ provider: "google" })`.

Google provider is configured through `supabase/config.toml`:

- `client_id = "env(SUPABASE_AUTH_EXTERNAL_GOOGLE_CLIENT_ID)"`
- `secret = "env(SUPABASE_AUTH_EXTERNAL_GOOGLE_SECRET)"`
- `redirect_uri = "https://zqkwfflhjuckjmxqqheh.supabase.co/auth/v1/callback"`

Do not commit Google OAuth client secrets. Keep them in Google Cloud, Supabase Auth settings, and Vercel environment variables only.

The Google OAuth app is in testing/external mode. The verified test account is `zamyatin.daniel@gmail.com`.

## Local Docker Warning

Do not run `supabase start` automatically. Docker Desktop may contain local resources for other projects.

If local Supabase is required:

1. Ask Daniel first.
2. Check Docker containers.
3. Confirm no DSGVO Scanner local stack will be affected.
4. Use `supabase stop` after verification.

The previous local attempt timed out and was stopped; no remote database migration was applied.
