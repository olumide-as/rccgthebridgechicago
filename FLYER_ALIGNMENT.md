# DWELL 2026 Flyer Alignment

## Verified canvas
The PNG header was inspected programmatically. The official artwork at `public/event/dwell-2026-share-template.png` is **1024 × 1536** pixels. The canvas and downloaded PNG use the same dimensions.

## Final coordinates
- Photo frame: `x=300`, `y=607`, `width=430`, `height=528`
- Corner radius: `54`
- Attendee name: `x=512`, `y=584`, `maxWidth=700`
- Font: Inter / Arial fallback, weight `800`, preferred `46px`, minimum `24px`
- Fill: `#fff7df`; stroke: `rgba(45,24,4,0.9)` at `5px`; shadow: `rgba(0,0,0,0.55)` blur `10`

## How coordinates were determined
The artwork was visually inspected in the repository. The inner grey silhouette area begins just inside the white/silver rounded rectangle so the uploaded photo covers the placeholder while preserving the decorative border and golden glow. The name sits in the clear gap below “I’M ATTENDING” and above the photo frame.

## Coordinate system
Canvas coordinates start at the top-left corner. All values in `config/flyer.ts` are in original artwork pixels, not CSS preview pixels.

## Photo scaling and clipping
The renderer computes cover scale with `max(frame.width / image.width, frame.height / image.height)`. Zoom multiplies that cover scale. Offsets are clamped to half of the overflow in each axis so no empty gaps can appear. A rounded rectangle path is applied with `save()`, `clip()` and `restore()` before drawing the visitor image.

## Name fitting
Text starts at the preferred font size and is measured with `CanvasRenderingContext2D.measureText`. The size decreases until the text fits within `maxWidth`; if still too long at the minimum, it truncates with an ellipsis.

## Manual verification checklist
Test portrait, landscape and square images; names “Tobi”, “Olumide Adigun” and “Christopher Alexander Johnson”; minimum and maximum zoom; horizontal and vertical repositioning; Reset Photo; mobile and desktop viewports; PNG download dimensions; native share detection; WhatsApp fallback; Copy Link; invalid and oversized files; and artwork load failure handling. Confirm no grey placeholder edge remains, border and glow remain visible, the photo is not distorted, the image does not spill outside rounded corners, and the downloaded PNG matches the preview.
