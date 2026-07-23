## 2024-07-23 - Focus states on `outline-none` elements
**Learning:** Elements styled with `outline-none` require custom focus styling to remain keyboard accessible. When applied to inputs inside wrapping containers, focus rings should be placed on the container itself using `focus-within` rather than the input to encompass icons and buttons visually connected to the field.
**Action:** When removing default focus outlines from form inputs in this app's design system, always add `focus-within:ring-2 focus-within:ring-amber-500` to their wrapper element to maintain a11y.
