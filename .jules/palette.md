## 2026-08-24 - Restore Keyboard Focus for Composite Input Components
**Learning:** When using `outline-none` on an inner `<input>` element inside a composite container (like a search box wrapper or a chat input div), keyboard users lose the visual focus indicator, making navigation difficult and violating accessibility standards.
**Action:** Apply `focus-within` utility classes (e.g., `focus-within:ring-2 focus-within:ring-amber-500`) to the outer wrapper container so the focus ring is properly visible when the inner input is active.
