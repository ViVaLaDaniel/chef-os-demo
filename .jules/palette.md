## 2024-08-31 - Focus States on Composite Inputs
**Learning:** When using `outline-none` on nested input elements (like search boxes or chat fields) to integrate them cleanly into styled wrapper containers, they lose native keyboard focus visibility.
**Action:** Always apply `focus-within:ring-2 focus-within:ring-amber-500` (or appropriate primary color) to the parent container (`div`, `label`, etc.) to visually indicate focus when the internal input is active, ensuring clear keyboard accessibility.
