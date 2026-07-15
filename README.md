# RCCG The Bridge Chicago DWELL 2026 Flyer Generator

A standalone Next.js application that allows attendees to generate a personalised **"I'm Attending"** flyer for **DWELL 2026: ELOHIM** by RCCG The Bridge Chicago.

Visitors simply enter their name, upload a photo, adjust the positioning if needed, and instantly receive a high-quality flyer ready to download or share.

---

## Features

- Personalised attendee flyer generation
- Live canvas preview
- Photo upload with drag repositioning
- Zoom controls
- Automatic PNG generation
- Native device sharing (where supported)
- Download as PNG
- WhatsApp sharing
- Registration link
- Browser-only image processing (no uploads)

---

## Event Details

**Event:** DWELL 2026: ELOHIM

**Date:** Friday, August 28, 2026

**Time:** 6:00 PM CST

**Venue:** RCCG Jesus House Chicago  
5224 N. Kedzie Avenue  
Chicago, IL 60625

**Registration:** https://thebridgechicago.org

---

## Technology Stack

- Next.js (App Router)
- React
- TypeScript
- Tailwind CSS
- HTML Canvas API

The application is completely client-side and does not require a database or backend services.

---

## Project Structure

```
app/
components/
config/
lib/
public/
tests/
```

The flyer artwork is stored in:

```
public/event/dwell-2026-share-template.png
```

All event configuration, flyer positioning, colours and sharing settings are managed from:

```
config/flyer.ts
```

---

## Local Development

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Create a production build:

```bash
npm run build
```

Run the linter:

```bash
npm run lint
```

Run the TypeScript type check:

```bash
npm run type-check
```

Run tests:

```bash
npm run test
```

---

## Privacy

Visitor photos never leave the browser.

Images are processed locally using the HTML Canvas API and are never uploaded, stored or transmitted to any server.

---

## Deployment

The project is designed for deployment on Vercel.

Set the following environment variable:

```
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

This ensures sharing links and metadata point to the correct production website.

---

## Updating for a Future Event

Most future events only require updating:

- `config/flyer.ts`
- `public/event/` artwork

If the flyer artwork changes, verify the new dimensions and adjust the photo frame and text positioning accordingly.

---

## Attribution

Powered by **Velra**

https://velra.co.uk
