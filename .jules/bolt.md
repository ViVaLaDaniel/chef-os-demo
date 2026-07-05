## 2026-06-04 - Large component architecture issue
**Learning:** Monolithic files like `src/main.jsx` (~1800 lines) slow down feature additions and lead to state fatigue.
**Action:** When adding big UI elements next time, modularize early and push for splitting components into separate files instead of maintaining the monolith.
## 2026-06-04 - Unnecessary String Operations on Render
**Learning:** In a heavily stateful root component (`src/main.jsx`), derived data derived from string matching (like filtering lists using `.toLowerCase().includes()`) causes severe performance degradation on every state update, even when no search query is active.
**Action:** Always wrap heavy string-based derived data calculations in `React.useMemo` and implement early returns for empty cases (e.g. `!query.trim()`) to bypass the string operations entirely.
