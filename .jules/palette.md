## 2023-10-24 - Restore focus states when using outline-none
**Learning:** Using `outline-none` on inputs removes default browser focus rings, harming keyboard accessibility.
**Action:** When using `outline-none` on an input, add `focus-within:ring-2 focus-within:ring-amber-500` (or the project's primary color) to its wrapper container to restore visible focus states for keyboard users.
