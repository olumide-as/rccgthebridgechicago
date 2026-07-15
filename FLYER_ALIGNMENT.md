# DWELL 2026 Flyer Alignment

## Verified canvas

The official artwork at `public/event/dwell-2026-share-template.png` has verified dimensions of **1024 × 1536** pixels.

The application canvas matches these dimensions exactly, ensuring the downloaded PNG is a pixel-perfect representation of the approved artwork.

---

## Final coordinates

### Photo frame

- `x = 300`
- `y = 607`
- `width = 430`
- `height = 528`
- Corner radius: `54`

### Attendee name

- `x = 512`
- `y = 1200`
- `maxWidth = 650`
- Preferred font size: `50px`
- Minimum font size: `28px`
- Font: **Bebas Neue** (fallback: Arial Narrow → Impact → Sans Serif)
- Font weight: `400`
- Text transform: Uppercase
- Alignment: Center
- Fill colour: `#fcd34d` (Amber 300)
- Stroke: None
- Shadow: None

---

## How the coordinates were determined

The approved artwork was visually inspected to identify the usable photo area and surrounding typography.

The uploaded photo is positioned entirely inside the existing rounded rectangle frame while preserving the original white border and gold glow.

The attendee name is positioned beneath the photograph, centred horizontally, creating a clearer visual hierarchy while maintaining adequate spacing from the event information below.

---

## Coordinate system

Canvas coordinates begin at the top-left corner of the artwork.

All values stored in `config/flyer.ts` use the original artwork resolution rather than the responsive browser preview.

---

## Photo scaling and clipping

The renderer calculates a cover scale using:

```text
max(frame.width / image.width, frame.height / image.height)
```

Zoom is applied relative to this minimum cover scale.

Photo offsets are clamped automatically so empty edges can never appear inside the frame.

A rounded clipping path is applied before rendering the uploaded image, ensuring the photograph always respects the artwork's rounded corners.

---

## Name rendering

The attendee name is automatically converted to uppercase.

The renderer begins at the preferred font size and measures the rendered width using the Canvas API.

If necessary, the font size is reduced until the name fits within the configured maximum width.

If the minimum size is reached and the name is still too long, it is truncated with an ellipsis.

The font family is resolved from the loaded browser font before rendering to ensure the canvas uses the same typography as the page.

---

## Automatic flyer generation

The flyer preview updates live as the attendee:

- enters their name
- uploads a photo
- adjusts zoom
- repositions the image

A fresh PNG is generated automatically in the background whenever changes are made.

The Share and Download actions become available only after the latest PNG has been successfully prepared, ensuring users always receive the most recent version of their flyer.

---

## Privacy

Visitor photos are processed entirely within the browser.

Images are never uploaded, stored or transmitted to a server.

---

## Manual verification checklist

Verify:

- Portrait, landscape and square photos
- Very short names
- Average length names
- Long names requiring font reduction
- Automatic uppercase rendering
- Photo drag positioning
- Minimum and maximum zoom
- Reset Photo
- Mobile browsers
- Desktop browsers
- PNG export quality
- Native device sharing
- Download behaviour
- WhatsApp sharing
- Copy Link
- Invalid file handling
- Oversized image handling
- Artwork load failure

Confirm that:

- The photo completely covers the placeholder.
- No grey placeholder remains visible.
- The artwork border and glow remain intact.
- Rounded corners clip correctly.
- The attendee name appears directly beneath the photograph.
- The typography matches the overall flyer design.
- The downloaded PNG matches the on-screen preview exactly.
