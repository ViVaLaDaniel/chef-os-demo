# ECC Trial — Chef OS

## Goal

Validate whether an ECC-style engineering loop improves reliability and reduces founder attention on a real Chef OS task.

## Why Chef OS

Chef OS is the best test repository because it is a real product, has tests, Supabase integration, documentation, and known technical debt, while still being small enough to inspect safely.

## Safety boundary

- Trial branch only: `experiment/ecc-chef-os-trial`
- No production deployment
- No remote Supabase migrations or data writes
- No secrets
- No merge to `main` until the trial is reviewed

## Benchmark task 1

**Problem:** establish a trustworthy baseline and let the verification loop find the first concrete failure.

**Definition of Done:**

- CI installs dependencies.
- Tests run.
- Production build runs.
- Any failure is diagnosed from evidence, not guessed.
- The smallest safe fix is made.
- CI is rerun until green.
- Diff is reviewed and findings are recorded here.

## Cycle

1. PLAN — establish automated verification.
2. TEST — run the current code without changing product behavior.
3. IMPLEMENT — fix only the first verified failure.
4. REVIEW — inspect the resulting diff for scope creep.
5. VERIFY — tests + build must pass.
6. REMEMBER — record the finding and reusable rule.
7. IMPROVE — choose the next highest-value bounded task.

## Current status

Trial infrastructure added. Awaiting the first CI result.
