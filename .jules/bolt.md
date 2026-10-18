## 2026-06-04 - Large component architecture issue
**Learning:** Monolithic files like `src/main.jsx` (~1800 lines) slow down feature additions and lead to state fatigue.
**Action:** When adding big UI elements next time, modularize early and push for splitting components into separate files instead of maintaining the monolith.

## 2026-06-04 - React.useMemo early returns
**Learning:** In a monolithic structure with a global ticking state (like `useNow` updating every minute or frequent typing), rendering expensive O(N) array filtering without memoization or early returns creates a significant performance bottleneck.
**Action:** When working with list filtering in large React components, always pair `React.useMemo` with an early fast-path return (e.g., `if (!query) return defaultList;`) to skip expensive iterations entirely when not needed.
