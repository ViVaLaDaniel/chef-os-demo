## 2026-06-04 - Large component architecture issue
**Learning:** Monolithic files like `src/main.jsx` (~1800 lines) slow down feature additions and lead to state fatigue.
**Action:** When adding big UI elements next time, modularize early and push for splitting components into separate files instead of maintaining the monolith.
>> ## 2026-07-10 - Expensive string manipulations in monolithic renders
**Learning:** In a heavily monolithic file like `src/main.jsx`, derived states that execute heavy string manipulations (e.g. concatenating and  for search queries in loops) become significant performance bottlenecks because the component re-renders frequently due to unrelated state changes (like switching active tabs).
**Action:** Always wrap derived list computations in `React.useMemo` and introduce fast-path early returns to bypass expensive loop operations when the search query is empty.
## 2026-06-04 - Expensive string manipulations in monolithic renders
**Learning:** In a heavily monolithic file like `src/main.jsx`, derived states that execute heavy string manipulations (e.g. concatenating and `.toLowerCase()` for search queries in loops) become significant performance bottlenecks because the component re-renders frequently due to unrelated state changes (like switching active tabs).
**Action:** Always wrap derived list computations in `React.useMemo` and introduce fast-path early returns to bypass expensive loop operations when the search query is empty.
