## 2024-07-14 - Focus states with outline-none
**Learning:** Using `outline-none` on inputs removes critical keyboard navigation accessibility unless a custom focus state is applied to the wrapper element.
**Action:** Always add `focus-within:ring-2 focus-within:ring-amber-500` to the parent wrapper when an input uses `outline-none`.
