## 2024-07-19 - Restoring Focus States for Custom Inputs
**Learning:** When creating custom styled inputs that strip native outlines (e.g., using Tailwind's `outline-none` on an `<input>` element inside a stylised container like `div` or `label`), keyboard accessibility is completely broken unless alternative focus states are explicitly restored.
**Action:** Always add `focus-within:ring-2 focus-within:ring-[primary-color]` to the wrapper container of any input using `outline-none` to ensure interactive elements remain perceivable and accessible to keyboard users.
