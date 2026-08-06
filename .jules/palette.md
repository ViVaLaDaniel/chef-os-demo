## 2024-05-19 - Restoring Focus States with outline-none
**Learning:** When using Tailwind's `outline-none` on inputs inside styled wrapper elements (like `div` or `label`), keyboard navigation becomes completely invisible for those fields, heavily reducing accessibility.
**Action:** When stripping native outlines from inputs, always ensure the parent wrapper implements an alternative visual indicator (such as `focus-within:ring-2`) to restore clear visual feedback for keyboard users navigating to that input.
