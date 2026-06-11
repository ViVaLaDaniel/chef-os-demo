## 2026-06-04 - Large component architecture issue
**Learning:** Monolithic files like `src/main.jsx` (~1800 lines) slow down feature additions and lead to state fatigue.
**Action:** When adding big UI elements next time, modularize early and push for splitting components into separate files instead of maintaining the monolith.
## 2024-10-24 - Monolithic App Re-renders and Derived Data
**Learning:** The frontend uses a highly monolithic architecture where the root `App` component holds almost all global state (timers, activity, inventory, chat, etc.). Because of this, seemingly unrelated events (like receiving a chat message or completing a task) cause the entire `App` component to re-render. We found unmemoized derived data (filtering the list of recipes with string manipulations) that was running on every single app state update, even when the recipes tab was not active.
**Action:** Always wrap expensive derived data calculations in this codebase (especially filtering/sorting of lists based on search queries) in `React.useMemo` to prevent them from becoming performance bottlenecks during frequent, unrelated state updates.
