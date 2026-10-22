## 2026-06-04 - Large component architecture issue
**Learning:** Monolithic files like `src/main.jsx` (~1800 lines) slow down feature additions and lead to state fatigue.
**Action:** When adding big UI elements next time, modularize early and push for splitting components into separate files instead of maintaining the monolith.

## 2026-06-04 - Unnecessary rendering work
**Learning:** In the `App` component within `src/main.jsx`, `filteredRecipes` was re-calculating on every single render. Since the monolith has a lot of state triggering renders (like inputs), array operations with string manipulations on each item can cause slowdowns.
**Action:** When working in monoliths like `src/main.jsx`, proactively memoize heavy list filtering operations that rely on `.toLowerCase()` or concatenation to prevent main thread blocking during unrelated state updates.
