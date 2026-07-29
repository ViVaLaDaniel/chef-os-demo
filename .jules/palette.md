## 2024-07-29 - Missing Focus Rings on Inputs with `outline-none`
**Learning:** When using `outline-none` on standard `<input>` elements inside styled wrappers (like rounded white containers with icons), the default keyboard focus indicator is removed. If the wrapper doesn't use `focus-within`, keyboard navigation becomes invisible to users, severely breaking accessibility.
**Action:** Always add `focus-within:ring-2 focus-within:ring-amber-500` (or the primary brand color) to the container element when stripping default input outlines inside custom search bars or chat inputs.
