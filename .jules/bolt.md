## 2026-06-04 - Large component architecture issue
**Learning:** Monolithic files like `src/main.jsx` (~1800 lines) slow down feature additions and lead to state fatigue.
**Action:** When adding big UI elements next time, modularize early and push for splitting components into separate files instead of maintaining the monolith.
## 2024-05-18 - Memoizing derived state in monolithic components
**Learning:** Monolithic components like `App` in `src/main.jsx` re-render frequently due to diverse state updates (e.g., checking off a task, changing tabs). Any un-memoized array filtering with string operations inside the render body will needlessly block the main thread and degrade performance on unrelated interactions.
**Action:** Always wrap derived list states—especially those invoking string manipulations like `.toLowerCase()` on complex data—with `React.useMemo` to skip recalculations when dependencies haven't changed.
