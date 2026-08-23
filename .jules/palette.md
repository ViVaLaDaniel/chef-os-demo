## 2025-02-12 - Apply focus styles to wrapper containers for inputs with outline-none
**Learning:** When using composite components where an inner `<input>` has `outline-none`, keyboard users lose their focus indicator. Applying `focus-within:ring-2 focus-within:ring-amber-500` to the outer wrapper correctly highlights the entire component structure during keyboard navigation.
**Action:** Always check the outer container of an `<input className="outline-none">` element to ensure it has `focus-within` styles applied for accessibility.
