## 2025-06-16 - Handling input fields with outline-none
**Learning:** When using `outline-none` on inputs within decorative wrappers (like icons in flex layouts), keyboard users lose focus visibility. Additionally, icon-only input fields often lack semantic meaning for screen readers.
**Action:** Always add `focus-within:ring-2` to the parent wrapper, and use `<label className="sr-only">` or `aria-label` directly on the input to ensure it is both visually accessible during keyboard navigation and meaningful to screen readers, while preserving the intended UI design.
