# Fit Tracker

A gym progression tracker and bulk-nutrition reference. Replaces a static workout
checklist with real logged history: weight × reps per exercise per date, trend
charts, and a nutrition calculator built on your actual stats instead of placeholder
numbers.

See `AGENTS.md` for architecture and coding conventions.

## What's here

- **Gym** (`/gym`) — today's session by default, with a 7-day switcher. Warm-up
  checklist, skill practice (rotates by day), per-exercise set logging with automatic
  PR detection, a core finisher, and a per-exercise progress chart
  (`/gym/progress/[exerciseId]`).
- **Nutrition** (`/nutrition`) — a live calorie/protein/carb/fat calculator
  (Mifflin-St Jeor + activity + bulk surplus) driven by editable stats, a meal
  structure reference, and a weekly bodyweight trend. Reference only — no food
  logging.

No authentication — this is a single-user app; anyone with the URL can view/edit
the data.

## Stack

Next.js 16 (App Router) · TypeScript · Tailwind v4 · Prisma + Postgres ·
Framer Motion · React Hook Form + Zod · Recharts

## Local development

Requires a local Postgres instance (or point `DATABASE_URL` at any Postgres,
including a Neon branch).

```bash
createdb fit_tracker   # once, if the database doesn't exist yet
cp .env.example .env   # then edit DATABASE_URL if needed
npm install
npx prisma migrate dev
npm run db:seed        # loads the weekly split + default stats
npm run dev
```

Open http://localhost:3000 (auto-redirects to `/gym`).

## Commands

```bash
npm run dev        # local dev server
npm run build      # production build (must pass before deploying)
npm run lint       # ESLint — must be clean
npm run typecheck  # tsc --noEmit — must be clean
npm run db:seed    # (re)load the weekly split + default UserStats
```

## Deploying (Vercel + Neon)

1. Create a Neon Postgres project, copy its connection string.
2. In Vercel, import this repo and set `DATABASE_URL` to the Neon connection string.
3. After the first deploy, run once against the Neon database:
   ```bash
   DATABASE_URL="<neon connection string>" npx prisma migrate deploy
   DATABASE_URL="<neon connection string>" npm run db:seed
   ```
4. Every push to `main` redeploys automatically.
