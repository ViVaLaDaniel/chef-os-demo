## 2026-06-04 - Large component architecture issue
**Learning:** Monolithic files like `src/main.jsx` (~1800 lines) slow down feature additions and lead to state fatigue.
**Action:** When adding big UI elements next time, modularize early and push for splitting components into separate files instead of maintaining the monolith.
## 2026-06-05 - Monolithic State and Re-renders in main.jsx
**Learning:** `src/main.jsx` contains the root `App` component handling many pieces of global state (chat, checklists, active tabs). Since all this state lives together, any small change (like typing a chat message) triggers a full re-render, forcing expensive recalculations (like array `.filter()` strings).
**Action:** Always wrap heavy list transformations and derived state inside `React.useMemo` to prevent O(n) or string manipulation bottlenecks from bogging down the main thread on every unrelated state update.
