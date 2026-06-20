## 2026-06-04 - Large component architecture issue
**Learning:** Monolithic files like `src/main.jsx` (~1800 lines) slow down feature additions and lead to state fatigue.
**Action:** When adding big UI elements next time, modularize early and push for splitting components into separate files instead of maintaining the monolith.
## 2026-06-20 - Memoized Recipe Filtering in Monolithic App
**Learning:** In a monolithic React architecture like this where a single `App` component handles many state updates (active tabs, toasts, panels, chats, etc.), any inline computation (like array filtering and string mapping) executes on *every* interaction across the app.
**Action:** Use `React.useMemo` aggressively for derived data computations (like filtering lists) in monolithic root components to isolate expensive calculations from unrelated state updates.
