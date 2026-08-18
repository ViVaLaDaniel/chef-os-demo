## 2026-06-04 - Large component architecture issue
**Learning:** Monolithic files like `src/main.jsx` (~1800 lines) slow down feature additions and lead to state fatigue.
**Action:** When adding big UI elements next time, modularize early and push for splitting components into separate files instead of maintaining the monolith.
## 2024-03-24 - Avoid string manipulation in empty list filters
**Learning:** React re-renders on global state changes trigger expensive `.toLowerCase()` calls and string interpolations in list filters even when the search query is empty.
**Action:** Always wrap derived lists in `React.useMemo` and include an early return (`if (!query) return baseList;`) to skip loop processing.
