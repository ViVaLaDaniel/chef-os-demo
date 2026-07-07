## 2024-03-20 - Focus Management for Custom Inputs
**Learning:** When using `outline-none` on inputs inside custom styled containers (like Chat and SearchBox), keyboard accessibility and visual focus feedback are completely lost, violating a11y guidelines.
**Action:** Always add `focus-within:ring-2 focus-within:ring-amber-500` (or the project's active state color) to the parent container wrapping the input to restore focus visibility without breaking the custom design.
