# SubsTrack

A full-stack SaaS subscription optimizer that helps users track subscriptions, free trials, renewal dates, and recurring expenses to save money and avoid surprise charges.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 8080)
- `pnpm --filter @workspace/substrack run dev` — run the frontend (port 19318)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React + Vite + Tailwind CSS + shadcn/ui + Recharts + Framer Motion + Wouter
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod, drizzle-zod
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `lib/api-spec/openapi.yaml` — OpenAPI contract (source of truth)
- `lib/api-client-react/src/generated/` — generated React Query hooks (do not edit)
- `lib/api-zod/src/generated/` — generated Zod schemas (do not edit)
- `lib/db/src/schema/subscriptions.ts` — Drizzle DB schema
- `artifacts/api-server/src/routes/subscriptions.ts` — all API routes
- `artifacts/substrack/src/` — React frontend
  - `pages/` — Landing, Dashboard, Subscriptions, Trials, Analytics, Settings
  - `components/subscription-form-modal.tsx` — Add/Edit modal
  - `lib/constants.ts` — Form schema + category/currency/billing cycle constants

## Architecture decisions

- Contract-first: OpenAPI spec gates codegen which gates the frontend; spec renamed body schemas to `SubscriptionCreate`/`SubscriptionUpdate` to avoid Orval naming conflicts.
- All subscription math (monthly normalization) is done server-side in route handlers to keep frontend purely presentational.
- `zod` (not `zod/v4`) used in api-server because esbuild can't resolve the `/v4` subpath export.
- Seed data seeded directly via `executeSql` at build time (13 realistic subscriptions).
- No authentication in MVP — all subscriptions are global; auth can be layered on later.

## Product

- **Landing page**: Hero, features, pricing preview, CTA
- **Dashboard**: Monthly spend, active count, trials ending soon, upcoming renewals, savings banner
- **Subscriptions**: Full list with search/filter by status and category, add/edit/delete
- **Trials**: Active, ending-soon, expired trials with countdown progress bars and urgency coloring
- **Analytics**: Spend by category (pie chart), spending over time (bar chart), top subscriptions
- **Settings**: Theme (light/dark/system), notifications, currency, export, delete account

## Gotchas

- Run codegen before touching generated files: `pnpm --filter @workspace/api-spec run codegen`
- Never import `zod/v4` in api-server — use plain `zod` (esbuild limitation)
- Do not add leaf workspace packages to root `tsconfig.json` references

## Pointers

- See `pnpm-workspace` skill for workspace structure and TypeScript setup
- See `react-vite` skill for frontend conventions
