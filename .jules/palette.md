## 2024-07-12 - Missing Focus Indicators on `outline-none` Inputs
**Learning:** In `src/main.jsx`, `input` elements styled with `outline-none` commonly strip default browser focus rings, degrading keyboard accessibility, especially inside unified wrappers (like search or chat bars).
**Action:** Always wrap `outline-none` inputs in a container and apply `focus-within:ring-2 focus-within:ring-amber-500` to the wrapper to restore visible focus states without breaking the intended UI design.
