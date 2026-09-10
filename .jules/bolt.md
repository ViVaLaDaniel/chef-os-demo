## 2026-06-04 - Large component architecture issue
**Learning:** Monolithic files like `src/main.jsx` (~1800 lines) slow down feature additions and lead to state fatigue.
**Action:** When adding big UI elements next time, modularize early and push for splitting components into separate files instead of maintaining the monolith.
## 2026-06-04 - Heavy String Operations in Render Cycle
**Learning:** In a monolithic architecture like `src/main.jsx`, placing string operations like `.toLowerCase()` and `.includes()` directly inside render loops (such as filtering an array on every state change) causes measurable performance degradation, especially when the query is empty.
**Action:** When filtering lists, always memoize the derived list. More importantly, implement an early return to skip expensive operations entirely when the filter criteria (like an empty search query) are not active.
