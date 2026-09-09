## 2026-06-04 - Large component architecture issue
**Learning:** Monolithic files like `src/main.jsx` (~1800 lines) slow down feature additions and lead to state fatigue.
**Action:** When adding big UI elements next time, modularize early and push for splitting components into separate files instead of maintaining the monolith.

## 2024-11-20 - Expensive string operations in render path
**Learning:** In a monolithic structure with frequent state updates (like shift timers), running string interpolations and `.toLowerCase()` inside standard array `.filter()` loops during render is a major bottleneck, especially when the input state hasn't changed.
**Action:** Always wrap heavy data filtering in `React.useMemo` and implement early return fast-paths (e.g., skip filtering entirely if the search query is empty) to prevent redundant O(n) string manipulation tasks.
