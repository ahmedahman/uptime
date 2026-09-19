# Fit Tracker

A gym progression tracker and bulk-nutrition reference. Replaces a static workout
checklist with real logged history: weight × reps per exercise per date, trend
charts, and a nutrition calculator built on your actual stats instead of placeholder
numbers.

See `AGENTS.md` for architecture and coding conventions.

## What's here

- **Gym** (`/gym`) — today's session by default, with a 7-day switcher. Warm-up
  checklist, skill practice (rotates by day), per-exercise set logging (showing last
  session's weight and a plain time estimate) with automatic PR detection, a core
  finisher, and a per-exercise progress chart (`/gym/progress/[exerciseId]`).
- **Nutrition** (`/nutrition`) — a live calorie/protein/carb/fat calculator
  (Mifflin-St Jeor + activity + bulk surplus) driven by editable stats, a
  calorie-checkpoint tracker (breakfast/lunch/dinner targets with a running
  shortfall you close with a self-picked snack), and a weekly bodyweight trend.

## Data — phone only, no backend

All data lives in the browser's `localStorage` (see `src/lib/local-store.ts`) —
there is no server, no database, and no account. This is a deliberate choice: the
app is used from one phone, and every attempt to add server-side persistence (a
Postgres database via Prisma, hosted on Neon/Vercel) turned out to be solving a
sync problem that didn't actually exist, while adding real deployment friction.

The tradeoff: data doesn't sync across devices, and browser storage isn't
bulletproof — iOS Safari in particular can clear site data after long inactivity.
If cross-device sync is ever needed, that's a deliberate architecture change, not
a small tweak (see git history around the localStorage migration for the reasoning).

## Stack

Next.js 16 (App Router) · TypeScript · Tailwind v4 · Framer Motion ·
React Hook Form + Zod · Recharts

## Local development

```bash
npm install
npm run dev
```

Open http://localhost:3000 (auto-redirects to `/gym`).

## Commands

```bash
npm run dev        # local dev server
npm run build      # production build (must pass before deploying)
npm run lint       # ESLint — must be clean
npm run typecheck  # tsc --noEmit — must be clean
```

## Deploying

No database, no environment variables — this is a static/client Next.js app.
Import the repo on Vercel (or any static host) and deploy; there's no setup step
beyond that.
