# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — start dev server (Turbopack)
- `npm run build` — production build (also runs TypeScript checks)
- `npm run lint` — ESLint
- No test framework is configured

## Tech Stack

- Next.js 16 (App Router) + React 19 + TypeScript
- Tailwind CSS v4 (no `tailwind.config.js` — custom theme lives in `src/app/globals.css` via `@theme` blocks)
- Framer Motion for interactive card hover effects
- lucide-react for icons

## Architecture

Personal portfolio site with three routes:

- `/` — homepage: full-screen centered title + particle canvas animation
- `/projects` — project listing with featured card layout; data from static array in `src/app/projects/data.ts`
- `/contact` — GitHub + Email contact cards

### Key patterns

- **Fonts**: Inter (Google) + CalSans (local, `public/fonts/CalSans-SemiBold.ttf`). CSS variables `--font-inter` / `--font-calsans` injected on `<html>` in `layout.tsx`, consumed via `@theme { --font-display; --font-sans; }` in globals.css.
- **Background**: Full-page fixed background image (`public/bg.jpg`) set in `globals.css` body styles.
- **Client components**: Files using browser APIs or Framer Motion must have `"use client"` directive — this includes `particles.tsx`, `card.tsx`, `nav.tsx`, `contact/page.tsx`.
- **Path alias**: `@/*` maps to `./src/*` (tsconfig paths).
- **No external services**: No database, no CMS, no analytics. All content is static.

### Tailwind v4 notes

Tailwind v4 uses CSS-native configuration instead of `tailwind.config.js`. Custom animations, fonts, and design tokens are defined in `globals.css` under `@theme { }` and `@keyframes` blocks. Utility classes like `animate-fade-in` and `font-display` are auto-generated from these theme values.
