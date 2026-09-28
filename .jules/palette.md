
## 2024-05-18 - Accessible Focus Indicators on Composite Inputs
**Learning:** When creating composite input components (like a search box with an icon) where the inner `<input>` uses `outline-none` to reset browser defaults, the component loses its visual focus indicator during keyboard navigation, harming accessibility.
**Action:** Always apply `focus-within:ring-2 focus-within:ring-amber-500` (or the appropriate theme color) to the outer wrapper container (like the `label` or `div`). This ensures the entire composite component visually highlights when the inner input receives focus. Additionally, ensure the `<input>` element itself has an explicit `aria-label` if it relies solely on `placeholder` text or lacks a visually associated text `<label>`.
