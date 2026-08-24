# HealthBridge — Premium Site

Built with Next.js (App Router), Tailwind CSS, and the Motion library, following
the premium-agency guidelines in CLAUDE.md: dark editorial theme, one accent
color, subtle scroll-triggered motion, single CTA in the hero.

## Run it locally

1. Install Node.js 18+ if you don't have it (nodejs.org).
2. Open this folder in a terminal.
3. Install dependencies (downloads the packages the project needs):
   ```
   npm install
   ```
4. Start the local preview server:
   ```
   npm run dev
   ```
5. Open http://localhost:3000 in your browser.

## What's inside

- `app/` — the page shell, global styles, and font loading (Fraunces for
  display headings, Inter for body text — an editorial pairing).
- `components/` — one file per section (hero, about, services, hospitals,
  testimonials, faq, contact, footer, nav).
- `tailwind.config.ts` — the color tokens: `bg`, `surface`, `ink`, `accent`
  (#22E06B), `blue` (#1C6FD1 family), and `alert` (#FF3B3B, used only for the
  urgent-contact note).

## Notes

- The hero uses an animated gradient instead of a video — swap in a real
  video by dropping an `.mp4` into `public/` and following the video-hero
  pattern from CLAUDE.md.
- All motion respects `prefers-reduced-motion` and only animates once per
  scroll (`viewport={{ once: true }}`).
- Deploy with `vercel` (free tier) once you're happy with it locally.
