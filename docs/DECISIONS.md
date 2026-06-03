# Decisions

## 2026-06-02: Tenant Model

Decision: use `restaurants` as the tenant root and scope operational tables by `restaurant_id`.

Reason: the same app must support many restaurants/teams without mixing data.

## 2026-06-02: Cooks Signal, Leads Confirm

Decision: cooks create inventory reports instead of directly changing final stock.

Reason: this reduces chaos during service and preserves chef/sous-chef control.

## 2026-06-02: Supabase Prepared But Not Applied

Decision: prepare migration and client wiring, but do not apply to an existing remote project.

Reason: available Supabase projects include unrelated projects, and Chef OS needs a dedicated project.

## 2026-06-02: No Automatic Local Supabase Docker

Decision: do not run local Supabase automatically.

Reason: Docker Desktop may host DSGVO Scanner or other local resources. A previous `supabase start` attempt timed out and was stopped.

## 2026-06-02: Web First, Mobile Later Through Shared React

Decision: keep Vite React as the shared codebase and later add PWA/Capacitor.

Reason: this allows one product surface for desktop web, phone install, Android, and iOS while sharing the same backend.

## 2026-06-03: Dedicated Cloud Demo Stack

Decision: run the Chef OS demo on its own Google Cloud project and Supabase project.

Reason: auth, billing, database, and OAuth settings must be isolated from DSGVO Scanner and other Daniel workspace projects.

Current resources:

- Google Cloud project: `chef-os-demo-20260603`
- Supabase project ref: `zqkwfflhjuckjmxqqheh`
- Production Vercel URL: `https://chef-os-demo.vercel.app`
