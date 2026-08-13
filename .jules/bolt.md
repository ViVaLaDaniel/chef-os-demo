## 2026-06-04 - Large component architecture issue
**Learning:** Monolithic files like `src/main.jsx` (~1800 lines) slow down feature additions and lead to state fatigue.
**Action:** When adding big UI elements next time, modularize early and push for splitting components into separate files instead of maintaining the monolith.
## 2026-06-04 - React.useMemo vs frequent re-renders in large files
**Learning:** In a monolithic architecture like `src/main.jsx`, where a hook like `useNow()` triggers a re-render every minute, expensive array methods chained with string interpolations like `.filter()` and `.toLowerCase()` cause silent UI lagging during these updates.
**Action:** When filtering or aggregating large lists (e.g., recipes, tasks) that depend on inputs but also live inside high-frequency re-rendering parent components, defensively wrap the filter execution in `React.useMemo` and use fast paths (like early return for empty queries).
