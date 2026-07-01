## 2025-03-09 - Inputs without focus rings
**Learning:** Using `outline-none` on inputs removes native focus rings, causing accessibility issues for keyboard navigation.
**Action:** When using `outline-none` on an input within a styled container, apply `focus-within:ring-2` (and an appropriate ring color like `amber-500`) to the parent container so that the focus state is clearly visible when the inner input is focused. Also, always add `aria-label` or `sr-only` text to inputs when their label is visual-only (like an icon).
