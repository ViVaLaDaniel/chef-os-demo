## 2026-06-04 - Large component architecture issue
**Learning:** Monolithic files like `src/main.jsx` (~1800 lines) slow down feature additions and lead to state fatigue.
**Action:** When adding big UI elements next time, modularize early and push for splitting components into separate files instead of maintaining the monolith.
## 2026-06-04 - Unmemoized String Parsing in Main App Component
**Learning:** Monolithic architectures (like App inside src/main.jsx) cause global state changes to aggressively re-render unrelated UI sections. Computations like `.toLowerCase().includes()` inside array mappings that run synchronously in render bodies become major performance sinks during frequent state updates (like typing in a search bar or real-time chat updates).
**Action:** Next time when encountering large un-split React component files, immediately check for expensive array operations (e.g., mapping, filtering, string manipulations) that are not wrapped in `React.useMemo` and aggressively memoize them based on their direct dependencies.
