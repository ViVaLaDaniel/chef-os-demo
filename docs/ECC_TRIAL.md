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

**Problem:** start reducing the known `src/main.jsx` monolith without changing product behavior.

**Bounded change:** extract `ChecklistRow` into `src/components/ChecklistRow.jsx` and protect its current behavior with focused tests.

**Definition of Done:**

- CI installs dependencies.
- Existing test suite is green before the change.
- A focused test is added before implementation and fails for the expected reason.
- The smallest implementation makes the focused test pass.
- Production build passes.
- No deployment, Supabase write, or unrelated product change occurs.

## Evidence

### 1. Baseline

GitHub Actions run `37121706559` completed successfully before the product refactor:

- `npm ci`: success
- `npm test`: success
- `npm run build`: success

### 2. TEST — intentional red state

Commit `20d1abc898fc8fbeba032b8b1994cd484e437ba9` added focused `ChecklistRow` tests before the component existed.

GitHub Actions run `37121778202` failed exactly as expected:

`Failed to resolve import "./ChecklistRow" from "src/components/ChecklistRow.test.jsx". Does the file exist?`

The pre-existing App test still passed.

### 3. IMPLEMENT

- Added `src/components/ChecklistRow.jsx`.
- Updated `src/main.jsx` to import the extracted component.
- Removed the duplicated local `ChecklistRow` implementation.
- Preserved the existing UI markup, classes, callback behavior, and completed-state styling.

### 4. VERIFY — green state

GitHub Actions run `37121878208` completed successfully:

- dependency install: success
- tests: success
- production build: success

## Review notes

The change is intentionally small. It proves that the repository can support a test-first extraction loop before attempting a larger refactor of the ~1800-line `src/main.jsx`.

No production deploy was triggered and no remote Supabase mutation was performed.

## Side finding

The CI install currently reports 14 npm audit findings:

- 2 low
- 3 moderate
- 9 high

This was not changed during the refactor. It should be handled as a separate bounded security/dependency task rather than with a blind `npm audit fix --force`.

## Reusable rule

For the Chef OS monolith, refactor one behavior-preserving component at a time:

`focused test -> intentional red -> extraction -> green tests/build -> diff review`

Do not combine structural refactors with new product behavior in the same step.

## Next benchmark candidate

Extract one richer checklist block with tests, or add explicit loading/error state handling for one Supabase-backed screen. Choose only one bounded task for the next cycle.
