## 2026-06-04 - Large component architecture issue
**Learning:** Monolithic files like `src/main.jsx` (~1800 lines) slow down feature additions and lead to state fatigue.
**Action:** When adding big UI elements next time, modularize early and push for splitting components into separate files instead of maintaining the monolith.

## 2026-06-04 - Cost of string methods inside rendering
**Learning:** In highly monolithic files (`src/main.jsx`) where state updates frequently due to timers (`useNow`), combining multiple string properties, making them lowercase, and performing `.includes()` arrays filtering inside the main render loop causes notable performance strain (~85ms for high volume).
**Action:** When filtering objects using string comparison, always wrap the transformation in `React.useMemo`, pulling only the minimally required dependencies, to avoid redundant computation.
