## 2026-06-04 - Large component architecture issue
**Learning:** Monolithic files like `src/main.jsx` (~1800 lines) slow down feature additions and lead to state fatigue.
**Action:** When adding big UI elements next time, modularize early and push for splitting components into separate files instead of maintaining the monolith.
## 2026-06-05 - Heavy string manipulations in React loops
**Learning:** In a monolithic architecture like `src/main.jsx`, placing `.filter()` with heavy string methods like `.toLowerCase().includes()` at the root level of the component causes significant main thread blocking on every keystroke or re-render, especially with frequent global timer updates (e.g. `useNow()`).
**Action:** When filtering lists by string matching, always wrap the derived state calculation in `React.useMemo`, and include an early return for empty queries to skip unnecessary map/filter loops.
