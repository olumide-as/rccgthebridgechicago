diff --git a/README.md b/README.md
index ad22dbdef889e25bf920d6ba9c48460d1f875e7e..80dda4f6eeaf9142dffca074bd8f3da33fbf4610 100644
--- a/README.md
+++ b/README.md
@@ -1,2 +1,37 @@
-# rccgthebridgechicago
-RCCG The Bridge Chicago
+# RCCG The Bridge Chicago DWELL 2026 Flyer Generator
+
+A standalone Next.js App Router application for creating personalised “I’m Attending” PNG flyers for **DWELL 2026: ELOHIM** by RCCG The Bridge Chicago.
+
+## Event
+- Date: Friday, August 28, 2026
+- Time: 6:00 PM CST
+- Venue: RCCG Jesus House Chicago, 5224 N. Kedzie Avenue, Chicago, IL 60625
+- Registration: https://thebridgechicago.org
+
+## Stack
+Next.js, TypeScript, React, Tailwind CSS and the browser Canvas API. There is no database, authentication, Supabase, cloud storage, server-side upload or server-side photo processing.
+
+## Artwork
+The approved artwork is `public/event/dwell-2026-share-template.png`. It must not be modified, recompressed, duplicated or replaced without rechecking alignment. Its verified dimensions are 1024 × 1536 pixels, and the generated PNG keeps that resolution.
+
+## Local development
+```bash
+npm install
+npm run dev
+npm run lint
+npm run type-check
+npm run test
+npm run build
+```
+
+## Browser-only privacy
+Visitors choose a photo using a browser file input. The app uses `URL.createObjectURL`, draws the decoded image to a canvas, and revokes object URLs when replaced or unmounted. Photos are not uploaded, stored, sent to analytics or persisted in localStorage/IndexedDB.
+
+## Download and sharing
+Generation exports the canvas with `canvas.toBlob` as `image/png`. Native sharing uses the Web Share API and shares the PNG file when `navigator.canShare` supports it; otherwise it falls back to title/text/URL sharing. WhatsApp uses an encoded `wa.me` text link, so users may need to download and attach the PNG manually. Copy Link uses `navigator.clipboard` with a textarea fallback.
+
+## Deployment
+Deploy to Vercel as a standard Next.js app. Set `NEXT_PUBLIC_SITE_URL` to the deployed public URL. When unset, metadata and sharing fall back to `http://localhost:3000` or the current browser URL.
+
+## Updating the event later
+Edit `config/flyer.ts` for event text, output filenames, share copy and all placement values. If artwork changes, keep it in `public/event/`, verify its dimensions programmatically, inspect the photo frame visually, update `config/flyer.ts`, and document the new coordinates in `FLYER_ALIGNMENT.md`.
