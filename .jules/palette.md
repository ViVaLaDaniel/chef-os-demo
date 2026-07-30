## 2024-12-16 - Add focus-within states for text inputs
**Learning:** Text inputs that use Tailwind's `outline-none` class become inaccessible via keyboard as they lose their focus indicators.
**Action:** When a text input is placed inside a decorative container and uses `outline-none`, restore the visual focus indicator by adding `focus-within:ring-2 focus-within:ring-amber-500 transition-shadow` to the parent container.
