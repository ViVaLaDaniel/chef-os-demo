## 2026-06-04 - Large component architecture issue
**Learning:** Monolithic files like `src/main.jsx` (~1800 lines) slow down feature additions and lead to state fatigue.
**Action:** When adding big UI elements next time, modularize early and push for splitting components into separate files instead of maintaining the monolith.
## 2026-06-04 - Memoizing derived lists involving string manipulations
**Learning:** `App` frequently recalculates state such as `filteredRecipes` directly during its render cycle, causing expensive string processing (`.toLowerCase()`, concatenations) on large lists, significantly slowing down interaction performance when states like `query` or `activeTab` update, or due to periodic `useNow` triggers across components.
**Action:** Always utilize `React.useMemo` to memoize derived lists that perform filtering, mapping, or string manipulations to bypass recalculation on every unassociated state update. Also consider utilizing early-returns (like empty query bypass) for added performance.
