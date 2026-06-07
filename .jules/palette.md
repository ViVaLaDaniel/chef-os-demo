
## 2024-06-07 - Custom Inputs with `outline-none` lack focus indicators
**Learning:** Custom styled inputs using Tailwind's `outline-none` class often lack visual focus indicators and accessible names, impacting keyboard accessibility and screen reader support.
**Action:** Always add `focus-within:ring-2 focus-within:ring-[color]` to the container wrapping the input to provide visual focus indication, and add an `aria-label` to the input element if it lacks a visible label.
