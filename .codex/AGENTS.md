# Chef OS — ECC Trial Instructions

Read the root `AGENTS.md` first. These instructions are additive and apply to Codex/ECC-style work in this repository.

## Operating loop

For every bounded engineering task, use:

`plan -> test -> implement -> review -> verify -> remember -> improve`

## Scope for this trial

- Work only on `experiment/ecc-chef-os-trial`.
- Do not deploy to Vercel.
- Do not modify remote Supabase data or run remote migrations.
- Do not introduce secrets.
- Prefer the smallest change that proves or disproves the task hypothesis.
- Preserve existing UI behavior unless the task explicitly requires a behavior change.

## Verification gate

Before considering a code task complete:

1. `npm ci`
2. `npm test`
3. `npm run build`
4. Review the diff for unrelated changes.
5. Record evidence and the next action in `docs/ECC_TRIAL.md`.

If a gate fails, do not continue to deployment. Diagnose, fix, and rerun the gate.
