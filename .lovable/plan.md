

# Fix Reviews Section: Unified Jelly Pill + Scroll-Aware Design

## Problems Identified

1. **Jelly pill breaks on horizontal scroll** -- The pill position is calculated using `getBoundingClientRect()` which gives viewport-relative coordinates, but the artist row scrolls horizontally. When you scroll, the pill stays in place while the avatars move, causing a visual disconnect.

2. **Two-part design breaks on small screens** -- The jelly pill (absolute-positioned in the artist row) and the reviews container (separate div with `marginTop: -32` hack) are two disconnected elements trying to look like one. This fragile approach breaks on narrow viewports.

3. **Artist images getting clipped** -- Avatar sizes and container min-widths are too tight on small screens.

---

## Solution: Unified Single-Container Approach

Instead of an absolute-positioned pill that tries to connect to a separate reviews box via negative margins, we will restructure the layout so that:

- The **selected artist indicator** and the **reviews container** are a single unified element with one continuous outline/border.
- The jelly pill no longer needs absolute positioning relative to the scrollable row. Instead, the entire reviews section below the artist row gets a unified container with a border.
- The selected artist avatar gets a visual highlight (border/ring) directly on the avatar itself, rather than a floating background pill.

---

## Technical Changes

### File: `src/components/ReviewsSection.tsx`

1. **Remove the floating jelly pill** -- Delete the absolute-positioned `tabStyle`-based div, and all the `updateTabPosition`, `tabStyle` state, `artistRowRef` measurement logic, and scroll-based position recalculation. This eliminates the root cause of the scroll breakage.

2. **Add direct selection indicator on avatars** -- The selected artist avatar will have a visible border/ring and slightly larger size (already partially done). Add a small indicator dot or accent border to show selection clearly.

3. **Unify the reviews container** -- The reviews container (`mx-3` div) will no longer use `marginTop: -32` hack. Instead, it will have a full outline border (`1px solid PILL_BORDER`) with rounded corners, making it a clean standalone card.

4. **Add outline to the entire reviews section** -- Apply a consistent `border: 1px solid ${PILL_BORDER}` and `borderRadius` to the reviews container so it reads as one cohesive card, not two fragile pieces.

5. **Fix avatar sizing for small screens** -- Slightly reduce unselected avatar sizes and increase gap to prevent clipping. Use `w-9 h-9` for unselected and `w-11 h-11` for selected on the smallest screens.

6. **Recalculate on scroll** -- Add an `onScroll` listener to the artist row to update pill position when scrolling (as a fallback if we keep any positional indicator).

### File: `src/index.css`

No changes needed -- existing keyframes are fine.

---

## Summary of Visual Result

- Artist avatars row scrolls freely without any pill trying to track position
- Selected artist has a clear ring/border highlight directly on the avatar
- Below the avatars, a single bordered card contains the artist info + reviews
- The card has a subtle outline matching the design language (`PILL_BORDER` color)
- Everything is one cohesive visual unit -- no fragile negative-margin connections
- Fully responsive on small screens with no clipping

