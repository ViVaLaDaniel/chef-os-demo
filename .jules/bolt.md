## 2026-06-04 - Large component architecture issue
**Learning:** Monolithic files like `src/main.jsx` (~1800 lines) slow down feature additions and lead to state fatigue.
**Action:** When adding big UI elements next time, modularize early and push for splitting components into separate files instead of maintaining the monolith.
>> ## 2023-10-02 - String allocations in monolithic components
>> **Learning:** Derived state calculating complex strings using `.toLowerCase()` inside monolithic files like `src/main.jsx` runs synchronously on every render (e.g. typing or simple state updates) causing frame drops.
>> **Action:** Wrap string-heavy derived filtering inside `React.useMemo` and implement fast-path early returns (e.g., `if (!query)`) to bypass calculations when the search field is empty.
