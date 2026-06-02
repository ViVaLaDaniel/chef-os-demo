# Chef OS Agent Instructions

Canonical project path:

- `C:\Users\wiwal\GIT\chef-os-demo`

Production:

- GitHub: https://github.com/ViVaLaDaniel/chef-os-demo
- Vercel: https://chef-os-demo.vercel.app

## Current Project State

Chef OS is a React/Vite/Tailwind prototype for a professional kitchen operations system.

The current app is frontend-first with a prepared Supabase/Auth layer. Supabase schema migration exists locally, but it has not been applied to a remote Chef OS Supabase project yet.

## Hard Rules

- Do not use the `dsgvo-scanner` Supabase project for Chef OS.
- Do not apply migrations to any remote Supabase project unless Daniel explicitly confirms the target project.
- Do not run `supabase start` automatically. Docker Desktop may contain other local project resources, including DSGVO Scanner work.
- Do not commit secrets. Use `.env.example` only.
- Keep generated folders out of git: `node_modules`, `dist`, `.vercel`, `.agents`, `skills-lock.json`, Supabase `.temp`.

## Verification Defaults

Run before commit/deploy:

```bash
npm run build
git status --short
```

Use Vercel deploy only after a successful build:

```bash
vercel deploy --prod --yes
```

## Documentation Map

- `docs/PROJECT_CONTEXT.md`
- `docs/ARCHITECTURE.md`
- `docs/DATA_MODEL.md`
- `docs/SUPABASE_AUTH.md`
- `docs/INTERACTION_LOGIC.md`
- `docs/PROFESSIONAL_KITCHEN_NOTES.md`
- `docs/RUNBOOK.md`
- `docs/TASKS.md`
- `docs/DECISIONS.md`
- `docs/SESSION_REPORT_2026-06-02.md`
