## 2026-06-08 - Restoring focus states on inputs with outline-none
**Learning:** Using Tailwind's `outline-none` removes native browser focus rings entirely, severely impacting keyboard accessibility. When wrapping an input in a visual container, the focus style needs to be explicitly re-applied to the container.
**Action:** When creating custom styled inputs or using `outline-none`, always add `focus-within:ring-2` (or equivalent focus indicators) to the parent container to restore accessible keyboard focus indication.
