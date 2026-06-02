# Supabase And Auth

## Current Status

Supabase client wiring exists, but no production env vars are configured in this repo.

Files:

- `src/lib/supabase.js`
- `.env.example`
- `supabase/migrations/20260602191759_chef_os_core_schema.sql`

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

## Google Login Notes

The frontend uses `supabase.auth.signInWithOAuth({ provider: "google" })`.

Google provider setup still requires:

- Google Cloud OAuth client;
- Supabase Auth provider configuration;
- redirect URL alignment;
- Vercel env vars.

## Local Docker Warning

Do not run `supabase start` automatically. Docker Desktop may contain local resources for other projects.

If local Supabase is required:

1. Ask Daniel first.
2. Check Docker containers.
3. Confirm no DSGVO Scanner local stack will be affected.
4. Use `supabase stop` after verification.

The previous local attempt timed out and was stopped; no remote database migration was applied.
