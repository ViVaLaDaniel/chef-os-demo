## 2024-07-18 - Missing focus indicators for keyboard navigation
**Learning:** Inputs currently use `outline-none` but lack a focus state (`focus-within:ring-2`, `focus-within:ring-amber-500`, etc.), making keyboard navigation difficult as users cannot see which field is currently active.
**Action:** Add `focus-within:ring-2 focus-within:ring-amber-500` or similar focus rings when using `outline-none` on container elements around inputs to restore keyboard accessibility.
