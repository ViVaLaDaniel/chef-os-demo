## 2025-02-12 - Focus visibility with outline-none
**Learning:** When using `outline-none` on inputs for seamless styling within a visual container, the default focus ring is lost, reducing keyboard accessibility.
**Action:** Always apply `focus-within:ring-2` (using app's primary color, e.g. `amber-500`) to the parent wrapper container to restore clear focus indication for keyboard users while maintaining the designed aesthetic.
