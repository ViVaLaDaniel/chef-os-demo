## 2026-06-04 - Large component architecture issue
**Learning:** Monolithic files like `src/main.jsx` (~1800 lines) slow down feature additions and lead to state fatigue.
**Action:** When adding big UI elements next time, modularize early and push for splitting components into separate files instead of maintaining the monolith.
## 2026-06-04 - React.useMemo for string-heavy filtering loops
**Learning:** In a monolithic app component with frequent re-renders (like ticking shift timers via `useNow()` or typing in chat), performing continuous array mapping, filtering, and string concatenations/case conversions on every render is a major bottleneck, especially when no search query is active.
**Action:** Always wrap list filtering logic in `React.useMemo` if the parent component manages rapidly changing state. Further, implement fast-path early returns (e.g. `if (!query) return baseList`) to entirely skip expensive array iterations when the user isn't actively searching.
