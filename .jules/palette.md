## 2023-10-06 - Accessible Composite Inputs
**Learning:** When using custom container `div` or `label` wrappers around native `<input className="outline-none">` fields, keyboard users lose visible focus indication, and screen readers lack context if `placeholder` is the only descriptor.
**Action:** Always apply `focus-within:ring-2 focus-within:ring-amber-500` to the wrapper element and ensure the inner `<input>` has an explicit `aria-label` attribute.
