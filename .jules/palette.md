## 2024-06-15 - Input Focus Indicators Missing (Accessibility)
**Learning:** Text inputs (`<input>`) in this app using `outline-none` lack visual feedback for keyboard navigation. Replacing the outline with `focus-within:ring-2` on parent wrappers solves this while fitting the custom design pattern.
**Action:** Always verify keyboard focus works on custom styled inputs, especially when removing browser outlines. Add `aria-label` to input fields if a direct text `<label>` is missing.
