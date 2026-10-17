## 2024-02-12 - Accessible Composite Inputs
**Learning:** When inputs use `outline-none` and rely on a parent wrapper (`div` or `label`) for styling to look like a complete form element, standard keyboard focus states are lost. These inputs also often lack labels if they are visually obvious or rely on placeholder text.
**Action:** Apply `focus-within:ring-2 focus-within:ring-amber-500` to the parent wrapper of any such input, and always add an explicit `aria-label` to the `input` tag itself so screen readers know its purpose.
