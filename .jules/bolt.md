## 2026-06-04 - Large component architecture issue
**Learning:** Monolithic files like `src/main.jsx` (~1800 lines) slow down feature additions and lead to state fatigue.
**Action:** When adding big UI elements next time, modularize early and push for splitting components into separate files instead of maintaining the monolith.
## 2026-06-04 - Unnecessary recalculation of derived state in monolithic App component
**Learning:** Due to the monolithic nature of `src/main.jsx`, the root `App` component re-renders frequently (e.g., from the `useNow()` global clock hook updating every minute, or from frequent typing). Heavy derivations like array mapping, filtering, and repeated `.toLowerCase()` string manipulations computed directly in the render body create a performance bottleneck.
**Action:** When adding or managing lists in monolithic components, always wrap derived data processing (especially involving string manipulations like `.toLowerCase()`) in `React.useMemo` to prevent expensive recalculations on unrelated state updates.
