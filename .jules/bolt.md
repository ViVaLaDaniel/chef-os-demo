## 2026-06-04 - Large component architecture issue
**Learning:** Monolithic files like `src/main.jsx` (~1800 lines) slow down feature additions and lead to state fatigue.
**Action:** When adding big UI elements next time, modularize early and push for splitting components into separate files instead of maintaining the monolith.
## 2026-06-04 - Unnecessary re-renders on expensive string operations
**Learning:** In the large monolithic `src/main.jsx` file, state updates from text inputs (like typing a search query) trigger frequent re-renders. Derived state that loops over lists and performs string manipulation (like `.toLowerCase()` and template literals) becomes a performance bottleneck.
**Action:** Always wrap heavy list derivations in `React.useMemo` and implement fast-path early returns (e.g., skip filtering if search query is empty) when dealing with search inputs in monolithic components.
