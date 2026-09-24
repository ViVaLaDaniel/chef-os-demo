## 2023-10-27 - Accessible Composite Inputs
**Learning:** When using `outline-none` on an inner `<input>` element within a composite component (like a SearchBox or Chat input with an icon or button), the focus state is lost for keyboard users.
**Action:** Apply `focus-within:ring-2 focus-within:ring-amber-500` (or appropriate primary color) to the outer wrapper container so the entire component visibly indicates focus. Additionally, ensure the inner `<input>` always has an `aria-label` if it lacks a visually associated `<label>` tag.
