## 2026-06-04 - Large component architecture issue
**Learning:** Monolithic files like `src/main.jsx` (~1800 lines) slow down feature additions and lead to state fatigue.
**Action:** When adding big UI elements next time, modularize early and push for splitting components into separate files instead of maintaining the monolith.
>>
>> ## 2024-11-06 - Monolith re-render optimizations
>> **Learning:** Because `src/main.jsx` contains almost the entire app state, components re-render extremely frequently (driven by global `useNow` timers and fast user typing). Unmemoized derived data operations, specifically array iterations with string concatenations and `.toLowerCase()` inside render methods, become major performance bottlenecks.
>> **Action:** Always wrap heavy list filtering operations in `React.useMemo`, pre-calculate filters where possible, and add fast-path early returns (e.g., returning un-filtered lists if the search query is empty) to skip expensive text processing during unrelated state updates.
>> EOF

## 2024-11-06 - Monolith re-render optimizations
**Learning:** Because `src/main.jsx` contains almost the entire app state, components re-render extremely frequently (driven by global `useNow` timers and fast user typing). Unmemoized derived data operations, specifically array iterations with string concatenations and `.toLowerCase()` inside render methods, become major performance bottlenecks.
**Action:** Always wrap heavy list filtering operations in `React.useMemo`, pre-calculate filters where possible, and add fast-path early returns (e.g., returning un-filtered lists if the search query is empty) to skip expensive text processing during unrelated state updates.
