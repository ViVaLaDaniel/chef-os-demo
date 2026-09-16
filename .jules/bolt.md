## 2026-06-04 - Large component architecture issue
**Learning:** Monolithic files like `src/main.jsx` (~1800 lines) slow down feature additions and lead to state fatigue.
**Action:** When adding big UI elements next time, modularize early and push for splitting components into separate files instead of maintaining the monolith.
## 2025-02-12 - App Monolith Memoization
**Learning:** `src/main.jsx` contains the `App` component that renders almost all screens. It recalculates the `filteredRecipes` array on every single render (even when typing in chat or completing tasks), which involves looping through arrays and heavy string concatenations/lowercasing.
**Action:** When working in a monolith like `main.jsx`, heavily utilize `React.useMemo` for any derived array/object computations, especially those involving string manipulations inside a `.filter` or `.map`, because unrelated state changes (like global `useNow` timers) will force frequent re-renders.
