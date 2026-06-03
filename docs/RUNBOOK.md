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

This is not a remote sync queue yet. Supabase online writes are configured for selected actions, but offline replay still needs a dedicated sync queue.

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

Dedicated project:

```text
chef-os-demo
ref: zqkwfflhjuckjmxqqheh
url: https://zqkwfflhjuckjmxqqheh.supabase.co
```

Remote migrations have been applied to this project.

Applied migrations:

- `20260602191759`
- `20260603093000`
- `20260603100000`

Safe inspection:

```bash
supabase migration list --local
supabase migration list --linked
```

Avoid by default:

```bash
supabase start
supabase db reset --local
```

Reason: Docker Desktop may be used by other projects.

Auth config:

```bash
$env:SUPABASE_AUTH_EXTERNAL_GOOGLE_CLIENT_ID = "<Google OAuth client id>"
$env:SUPABASE_AUTH_EXTERNAL_GOOGLE_SECRET = "<Google OAuth client secret>"
supabase config push --project-ref zqkwfflhjuckjmxqqheh --yes
```

Do not print or commit the Google OAuth secret.

Production smoke test:

1. Open `https://chef-os-demo.vercel.app`.
2. Click `Google`.
3. Sign in with the configured Google test account.
4. Confirm the auth/status card shows `Supabase подключен`.
5. Confirm the activity log contains `Создан demo workspace после Google входа` for a first login.
