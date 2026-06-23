## 2026-06-04 - Restoring Keyboard Focus on `outline-none` Forms
**Learning:** Using `outline-none` on standard `<input>` fields hides default focus indicators, making keyboard navigation difficult. Wrapper elements (like rounded divs serving as input containers) need explicit focus styles to maintain accessibility.
**Action:** When an input has `outline-none`, apply `focus-within:ring-2` to its container element, and use `focus-visible:ring-2` on adjacent interactive elements (like submit buttons) to ensure clear keyboard navigation states.
