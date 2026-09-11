## 2026-06-04 - Large component architecture issue
**Learning:** Monolithic files like `src/main.jsx` (~1800 lines) slow down feature additions and lead to state fatigue.
**Action:** When adding big UI elements next time, modularize early and push for splitting components into separate files instead of maintaining the monolith.
## 2026-06-04 - React state fatigue and expensive inline operations
**Learning:** In a heavily monolithic file like `src/main.jsx`, global timers (`useNow`) or active typing states trigger frequent re-renders across multiple UI sections. Inline array filtering and string manipulations (like `.toLowerCase()`) on every render can significantly degrade performance during text entry.
**Action:** Always wrap expensive derived data calculations in `React.useMemo` (especially when manipulating strings in loops) and implement early returns for empty states (e.g., skip filtering if the search query is empty) to short-circuit operations.
