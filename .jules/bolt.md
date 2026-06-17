## 2026-06-04 - Large component architecture issue
**Learning:** Monolithic files like `src/main.jsx` (~1800 lines) slow down feature additions and lead to state fatigue.
**Action:** When adding big UI elements next time, modularize early and push for splitting components into separate files instead of maintaining the monolith.

## 2026-06-17 - Memoize Derived Data in Monolithic Apps
**Learning:** In highly monolithic React components (like the root App component here) with frequent state updates (e.g., timer hooks like `useNow`), recalculating derived data (like filtering lists) on every render is a significant performance bottleneck.
**Action:** Proactively wrap derived array calculations (maps, filters) in `React.useMemo` to prevent expensive recalculations during unrelated state updates.
