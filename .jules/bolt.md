## 2026-06-04 - Large component architecture issue
**Learning:** Monolithic files like `src/main.jsx` (~1800 lines) slow down feature additions and lead to state fatigue.
**Action:** When adding big UI elements next time, modularize early and push for splitting components into separate files instead of maintaining the monolith.

## 2024-06-25 - React.useMemo missing in main.jsx
**Learning:** React state variables updated via setInterval (e.g. `useNow` hook firing every minute) trigger re-renders of the root application component, `App`, in `src/main.jsx`. Because `App` handles state for all screens, rendering without `React.useMemo` for computationally expensive filtering operations results in significant lag.
**Action:** When filtering logic operates on relatively static datasets (like a recipe list) but is located inside a root app component where frequent global state updates occur, always memoize the derived state.
