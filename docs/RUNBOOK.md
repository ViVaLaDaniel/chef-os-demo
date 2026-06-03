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

## PWA Verification

The production build copies these static PWA assets from `public/`:

- `manifest.webmanifest`
- `service-worker.js`
- `offline.html`
- `pwa-icon.svg`

After running the app through `npm run dev` or a production preview, check:

- the app renders an online/offline indicator in the auth/status card;
- the service worker registers in a supported browser;
- a previously loaded app shell can reopen when network is unavailable.

## Local Offline State

The frontend stores the demo operational snapshot in localStorage under:

```text
chef-os-demo:operational-cache
```

The snapshot is versioned and includes current shift reference data plus mutable local state:

- shift tasks;
- general and station checklists;
- inventory reports;
- activity log;
- chat messages;
- staff, recipes, and station guides for offline reference.

Manual check:

1. Open the app.
2. Create an inventory signal or complete a task.
3. Reload the page.
4. Confirm the local action is still visible.

This is not a remote sync queue yet. Supabase writes still need a dedicated Chef OS Supabase project and explicit sync logic.

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
