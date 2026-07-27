## 2026-06-04 - Large component architecture issue
**Learning:** Monolithic files like `src/main.jsx` (~1800 lines) slow down feature additions and lead to state fatigue.
**Action:** When adding big UI elements next time, modularize early and push for splitting components into separate files instead of maintaining the monolith.

## 2026-06-05 - Recipe Search Memoization
**Learning:** In a monolithic architecture like `src/main.jsx`, placing heavy filtering and string manipulation functions inside the render loop is highly detrimental. Specifically, the recipe search feature allocated multiple strings and ran `.toLowerCase()` on a concatenation of multiple recipe fields for *every* render cycle, including those triggered by entirely unrelated state changes (like the shift clock ticking every minute).
**Action:** Always wrap derived data, especially data involving string processing or list filtering, in `React.useMemo`. When filtering lists, consider adding early returns (e.g., if the search query is empty) to bypass the processing loop entirely.
