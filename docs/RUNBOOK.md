# Runbook

## Local Development

```bash
npm install
npm run dev
```

Open:

```text
http://127.0.0.1:5173
```

## Build Verification

```bash
npm run build
```

## Git

```bash
git status --short
git add <relevant-files>
git commit -m "feat: ..."
git push
```

## Vercel

Production deploy:

```bash
vercel deploy --prod --yes
```

Public URL:

```text
https://chef-os-demo.vercel.app
```

Health check:

```bash
curl.exe -I https://chef-os-demo.vercel.app
```

## Supabase

Supabase migration exists locally, but do not apply it remotely until the target project is confirmed.

Safe inspection:

```bash
supabase migration list --local
```

Avoid by default:

```bash
supabase start
supabase db reset --local
```

Reason: Docker Desktop may be used by other projects.
