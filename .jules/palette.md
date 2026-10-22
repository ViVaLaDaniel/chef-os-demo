## 2024-10-24 - Accessible Input Focus States
**Learning:** When using `outline-none` on an `<input>` nested inside a container (like a `<label>` or `<div>`), keyboard focus visibility is lost. Additionally, inputs relying solely on `placeholder` attributes lack semantic context for screen readers.
**Action:** Apply `focus-within:ring-2 focus-within:ring-[primary-color]` to the outer container so the focus ring is visible when the inner input is active. Always add an explicit `aria-label` to inputs that don't have a visually associated `<label>`.
