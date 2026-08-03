## 2024-03-24 - Interactive Element Focus States
**Learning:** Found elements using `outline-none` without explicit `focus-visible` styles, leading to poor keyboard accessibility for interactive elements like input fields.
**Action:** When using `outline-none` on inputs, explicitly add focus indicators, such as `focus-visible:ring-2 focus-visible:ring-amber-500` or similar, tailored to the project's design system, to ensure keyboard accessibility.
## 2024-03-24 - SearchBox focus accessibility
**Learning:** Adding `focus-within:ring-2 focus-within:ring-amber-500` to a wrapper label is an effective pattern for maintaining `outline-none` on the actual input element while providing robust keyboard focus indicators.
**Action:** Use `focus-within` on the container for composite input fields (like an input with an icon) instead of applying focus rings directly to the `input` to keep styling clean.
