<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

---

# Fit Tracker — project guidance

Read this before adding screens, components, or architecture changes.
See `README.md` for how to run it.

## What this is

A single-user gym progression tracker + bulk nutrition reference. Real data, not
localStorage: Postgres via Prisma, deployed on Vercel + Neon, reachable from any
device. No authentication — accepted trade-off for a single-user personal app.

## Non-negotiables

1. **No hardcoded hex or px in a component.** Tokens live in the `@theme` block in
   `src/app/globals.css`. If a value is not a token, add the token first.

2. **Accent colors are assigned by meaning, not decoration.** `accent-primary` for
   primary actions, `accent-pr` only for PR celebrations, `accent-complete` only for
   the session-complete moment, `accent-secondary` sparingly. Don't introduce a new
   accent without a reason tied to what it signals.

3. **The weekly workout split and nutrition principles in
   `src/features/gym/lib/day-templates.ts` and
   `src/features/nutrition/lib/meal-structure.ts` reflect real, deliberated
   constraints (no deadlifts, no flat bench, chest-supported row over seated cable
   row, hypertrophy rep ranges).** Don't alter this content when touching UI —
   flag it instead if something looks wrong.

4. **Only three moments get real animation effort**: day-view load, hitting a PR,
   and finishing a full session (`components/motion/`). Everything else (saving a
   set, checking off warm-up) gets simple, fast feedback — it happens too often to
   be precious about.

5. **Every animation respects `prefers-reduced-motion`**, handled once inside
   `components/motion/` primitives — pages never re-implement it. See
   `use-reduced-motion.ts`.

6. **Server Components by default.** Add `"use client"` only for interactivity.

7. **Forms are React Hook Form + Zod.** Use RHF's `subscribe()` for live derived
   state instead of `watch()` — `watch()` trips the React Compiler lint (see
   `stats-form.tsx` for the pattern).

8. **`lint`, `typecheck` and `build` must all pass** before work is done.

## Where things go

- Generic and reusable — `components/ui`, `components/layout`, `components/motion`
- Domain views, schemas, config — `features/<name>/`
- One Prisma client instance — `lib/prisma.ts`. Route handlers are the only place
  that should import it directly; page components can import it for server-side reads.

## Conventions

- Imports use the `@/` alias. Components `PascalCase`, files `kebab-case`.
- Dates are ISO strings (`yyyy-MM-dd`) end-to-end, not `Date` objects, to avoid
  timezone drift between server and the phone in your hand at the gym.
- PR detection (`features/gym/lib/pr-check.ts`) compares against all *other*
  sessions for that exercise, never against sibling sets in the same save — don't
  change that without understanding why (see the comment in that file).

## Commits

Write commit messages as if authored solely by the human developer. Never add a
`Co-Authored-By` trailer and never mention AI assistance.
