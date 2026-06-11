## 2023-10-27 - Custom tablist implementation

**Learning:** When implementing a custom bottom navigation bar (`BottomNav`), it's common to miss native accessibility patterns. In this app, the `BottomNav` was built using generic `button`s without `role="tab"` or `role="tablist"` on the container. Additionally, standard focus states are absent, which heavily impairs keyboard navigation.

**Action:** Whenever reviewing or creating custom navigation components (like a bottom tab bar), explicitly ensure `role="tablist"` wraps the items, and each item has `role="tab"` and `aria-selected` synced to state. Always add Tailwind `focus-visible` styles to interactive elements for immediate keyboard accessibility improvements.
