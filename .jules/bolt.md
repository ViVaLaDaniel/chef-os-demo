## 2026-06-04 - Large component architecture issue
**Learning:** Monolithic files like `src/main.jsx` (~1800 lines) slow down feature additions and lead to state fatigue.
**Action:** When adding big UI elements next time, modularize early and push for splitting components into separate files instead of maintaining the monolith.
## 2026-06-04 - Memoizing string manipulations in the monolithic App component
**Learning:** Due to the App component's monolithic state and architecture in `src/main.jsx`, it re-renders very frequently (e.g. from typing, timers, activity log updates). Data transformations, like string manipulations inside array filtering, become noticeable performance bottlenecks because they run on every unrelated state change.
**Action:** Always wrap heavy list filtering/string manipulating logic with `React.useMemo` inside the monolithic App to ensure it only recalculates when the dependencies actually change.
