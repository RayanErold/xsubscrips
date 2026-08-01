# Xsubscrips — Coming Soon Feature Playbook

This file is a **build queue for an AI coding agent**. Each section below is a **self‑contained prompt**: hand the agent one `### PROMPT` block at a time, top to bottom, and it should be able to implement and tier‑gate that feature without further context.

Every feature is gated by user **tier** (`free` · `pro` · `business`). Gating is centralized in one entitlements module (**F0**), so no feature invents its own plan checks.

---

## How to use this file

- Implement **F0 (Entitlements) and F1 (Notification infra) first** — every user‑facing feature depends on them.
- Give the agent exactly one `### PROMPT` block, let it finish, run the **Acceptance criteria**, then move to the next.
- Anything marked **SOON** on `/pricing` maps 1:1 to a feature here.

### Stack facts the agent must respect (do not re‑discover)

- **Monorepo / pnpm workspaces.** Backend: `apps/backend` (Express 5 + TypeScript). Frontend: `apps/frontend` (React + Vite + wouter + TanStack Query + shadcn/ui + Tailwind).
- **DB:** Postgres via **Drizzle ORM** over a direct `DATABASE_URL` connection (`lib/db/src/index.ts`). Schema lives in `lib/db/src/schema/*.ts`. **RLS is NOT used** — isolation is enforced in app code by filtering on `userId`. Every new query MUST filter by `userId` (or org id).
- **Migrations:** currently `drizzle-kit push` only, no migration history. **Add a `lib/db/migrations` folder and switch to `drizzle-kit generate` + `migrate`** as part of F0 so schema changes are reviewable/rollback‑able.
- **Auth:** Supabase (anon key). `apps/backend/src/middleware/auth.ts` exposes `requireAuth`; it attaches `req.user` (`{ id, email }`). Routes are mounted in `apps/backend/src/routes/index.ts`.
- **API contract is OpenAPI‑first:** edit `lib/api-spec/openapi.yaml`, then regenerate the typed client (`lib/api-client-react`) and zod (`lib/api-zod`) via orval. Never hand‑write client types.
- **Cron:** `apps/backend/src/lib/cron.ts` (node‑cron, in‑process). **Email:** Resend (`apps/backend/src/lib/notifications.ts`, `email.ts`). **AI:** Google Gemini `gemini-2.5-flash` (`apps/backend/src/routes/ai.ts`).
- **Every feature must ship with:** (a) schema + migration, (b) OpenAPI + regenerated client, (c) entitlement enforcement on the backend, (d) frontend gating (hide/upsell for lower tiers), (e) at least one unit/integration test, (f) env vars documented in `.env.example`.

### Tier capability matrix (source of truth — implement in F0)

| Capability key | Free | Pro | Business |
|---|:--:|:--:|:--:|
| `maxSubscriptions` | 10 | ∞ | ∞ |
| `emailRenewalReminders` | ✅ | ✅ | ✅ |
| `inAppTrialPriceAlerts` | ✅ | ✅ | ✅ |
| `csvExport` | ✅ | ✅ | ✅ |
| `aiReceiptParsing` | — | ✅ | ✅ |
| `advancedAnalytics` | — | ✅ | ✅ |
| `multiChannelAlerts` (email+SMS+push, price‑hike) | — | ✅ | ✅ |
| `aiOptimization` (duplicates/unused) | — | ✅ | ✅ |
| `bankSync` (Plaid) | — | ✅ | ✅ |
| `pdfReports` | — | — | ✅ |
| `teamWorkspaces` + `seats` | — | — | ✅ (10) |
| `rbac` | — | — | ✅ |
| `shadowItAudit` | — | — | ✅ |

> The agent must treat this table as the **single authority**. Backend enforcement (F0) and frontend gating must both read from the same generated map.

---

## F0 — Billing & Entitlements Foundation *(prerequisite for everything)*

### PROMPT: F0 — Add Stripe billing and a central tier‑entitlement system

**Goal:** Give every user a `plan` (`free|pro|business`) driven by Stripe, and a single reusable way to enforce capabilities and numeric limits on both backend and frontend. No feature may check the plan string directly — they call the entitlement helpers built here.

**Data model** (`lib/db/src/schema/users.ts`):
- Add columns to `users`: `plan text not null default 'free'`, `plan_status text not null default 'active'` (`active|past_due|canceled|trialing`), `stripe_customer_id text`, `stripe_subscription_id text`, `plan_period_end timestamptz`, `plan_updated_at timestamptz`.
- Add a check/enum guard so `plan` ∈ {free,pro,business}. Prefer a real Postgres enum (`pgEnum`) over free text.
- Add index on `stripe_customer_id`.
- Introduce `lib/db/migrations/` and generate the first migration; wire a `migrate` script and run it in deploy (`render.yaml`).

**Entitlements module** (`lib/entitlements/` — new shared package, or `apps/backend/src/lib/entitlements.ts` + a mirror exported to frontend):
- Encode the **Tier capability matrix** above as a typed constant `PLAN_CAPABILITIES: Record<Plan, { limits: {...}; features: Set<Capability> }>`.
- Export `can(plan, capability): boolean` and `limitOf(plan, key): number`.
- Export a `Capability` string‑literal union and a `PLANS` list with display metadata (name, price) so `/pricing` and the app read the same source.

**Backend enforcement** (`apps/backend/src/middleware/`):
- Add `requireEntitlement(capability: Capability)` middleware: loads the user's `plan` (join to `users`), returns **402 Payment Required** with `{ error: 'upgrade_required', capability, requiredPlans }` if not entitled.
- Add `enforceLimit(key, countFn)` helper for numeric caps (e.g. `maxSubscriptions`) — returns 402 when exceeded. Apply it in `POST /subscriptions` (`apps/backend/src/routes/subscriptions.ts`) so Free is capped at 10.
- Expose `GET /me/entitlements` returning `{ plan, planStatus, capabilities: Capability[], limits, usage: { subscriptions: n } }`.

**Stripe** (`apps/backend/src/routes/billing.ts` — new):
- `POST /billing/checkout` → create a Stripe Checkout Session for a given price id (map `pro`/`business` × `monthly`/`yearly` → Stripe price ids from env). Return the URL.
- `POST /billing/portal` → Stripe Billing Portal session.
- `POST /billing/webhook` → **raw body**, verify signature, handle `checkout.session.completed`, `customer.subscription.updated|deleted`; upsert `plan`, `plan_status`, `stripe_*`, `plan_period_end`. Mount this route with `express.raw` **before** the JSON body parser and **before** `requireAuth`.
- Idempotency: store processed Stripe `event.id`s (small `stripe_events` table) and no‑op on replays.

**Frontend** (`apps/frontend`):
- Add a `useEntitlements()` hook (TanStack Query on `GET /me/entitlements`).
- Add a `<Gate capability="...">` component + `<UpgradeCta requiredPlan="pro" />` that renders a locked/blurred state with a "Coming soon" or "Upgrade" affordance.
- Wire `/pricing` CTAs and Settings → Billing to `POST /billing/checkout` / `/billing/portal` instead of `/login?mode=signup`.

**Env** (`.env.example`): `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `STRIPE_PRICE_PRO_MONTHLY`, `STRIPE_PRICE_PRO_YEARLY`, `STRIPE_PRICE_BUSINESS_MONTHLY`, `STRIPE_PRICE_BUSINESS_YEARLY`, `APP_URL`.

**Acceptance criteria:**
- A Free user creating an 11th subscription gets **402 upgrade_required**; a Pro user does not.
- Completing Stripe test checkout flips `users.plan` to `pro` via webhook; canceling flips it back to `free` at period end.
- `GET /me/entitlements` reflects the plan and blocks `aiReceiptParsing` for Free.
- Webhook is idempotent (replaying the same event changes nothing).
- Unit tests cover `can()`/`limitOf()` for all three tiers.

---

## F1 — Notification Infrastructure *(prerequisite for all alert features)*

### PROMPT: F1 — Build an idempotent, multi‑channel notification pipeline

**Goal:** One reliable dispatcher that every alert feature reuses, so no alert is sent twice or silently dropped.

**Data model** (`lib/db/src/schema/notifications.ts` — new):
- `notification_log`: `id`, `user_id`, `subscription_id nullable`, `type` (`renewal_upcoming|renewal_charged|trial_ending|price_hike|optimization|weekly_summary`), `channel` (`email|sms|push|inapp`), `dedupe_key text not null`, `status` (`pending|sent|failed`), `attempts int default 0`, `payload jsonb`, `created_at`, `sent_at`. **Unique index on `(dedupe_key)`.**
- `dedupe_key` convention: `${type}:${subscriptionId ?? 'acct'}:${channel}:${yyyy-mm-dd of the event}`.

**Backend** (`apps/backend/src/lib/notify.ts` — new):
- `dispatch({ userId, type, channel, dedupeKey, payload })`: insert‑if‑absent into `notification_log` (relying on the unique index for idempotency); if newly inserted, send via the channel provider; on success set `sent`, on failure increment `attempts` and set `failed`.
- Channel providers: `email` (existing Resend), `sms` (stub → Twilio in Feature‑MultiChannel), `push` (stub → web push / FCM later), `inapp` (row the app reads).
- Retry: a cron pass re‑attempts `failed` rows with `attempts < 5` using exponential backoff.
- **Fix the sender**: use `support@xsubscrips.com` consistently (not the Resend sandbox `onboarding@resend.dev`).

**Refactor existing cron** (`apps/backend/src/lib/notifications.ts`, `cron.ts`):
- Route the current renewal reminder through `dispatch()` so it becomes idempotent (removes the double‑send risk).
- Replace exact‑day `isSameDay` matching with a **catch‑up window** (any due item since last successful run).
- **Protect** `POST /admin/trigger-reminders` behind an admin key (it is currently unauthenticated).

**Respect user settings**: honor `users.trialReminders / renewalReminders / weeklySummary / emailDigest` before dispatching. Add a per‑user `timezone` column and compute "today"/"due" in the user's tz, not server UTC.

**Acceptance criteria:**
- Calling the daily job twice on the same day sends **each notification once** (dedupe holds).
- A simulated email failure is retried and eventually marked `sent`/`failed` with `attempts` recorded.
- Trigger endpoint returns 401 without the admin key.

---

## Feature 1 — Price‑hike & multi‑channel alerts *(Pro, Business — capability `multiChannelAlerts`)*

### PROMPT: Feature 1 — Detect price hikes and deliver alerts over email + SMS + push

**Depends on:** F0, F1. **Gate:** `requireEntitlement('multiChannelAlerts')` on config endpoints; dispatch only for entitled users.

**Detection:**
- When a subscription's `price` changes (on update, on AI parse, or future bank sync), write a `price_change` history row (`old_price`, `new_price`, `detected_at`) in `billing_history` or a new `price_changes` table.
- Nightly job compares latest known price vs previous; if increased beyond a threshold (default > 0, configurable per user), enqueue a `price_hike` notification via `dispatch()`.

**Channels:**
- Email (reuse F1). **SMS** via Twilio: add `apps/backend/src/lib/sms.ts`, env `TWILIO_*`; users add + verify a phone number in Settings. **Push**: web‑push (VAPID) or FCM; store subscription tokens.
- User picks channels per alert type in Settings (`renewal`, `trial_ending`, `price_hike`), gated so Free only sees email/in‑app; Pro/Business see SMS/push.

**Backend:** `PUT /me/alert-preferences` (entitlement‑gated for SMS/push), `POST /me/phone` + `/me/phone/verify`, `POST /me/push-tokens`.

**Frontend:** Settings → Alerts panel; multi‑channel toggles wrapped in `<Gate capability="multiChannelAlerts">` (locked + "Upgrade to Pro" for Free).

**Acceptance criteria:** A Pro user with a verified phone receives an SMS + email when a tracked sub's price rises; a Free user sees the SMS toggle locked and only gets in‑app/email. Duplicate hikes on the same day don't double‑send.

---

## Feature 2 — AI duplicate & optimization alerts *(Pro, Business — capability `aiOptimization`)*

### PROMPT: Feature 2 — Surface duplicate/unused/overlapping subscriptions with AI

**Depends on:** F0, F1, existing Gemini setup (`routes/ai.ts`). **Gate:** `requireEntitlement('aiOptimization')`.

**Logic:**
- Add `POST /ai/optimize` (entitlement‑gated): loads the user's active subscriptions (userId‑scoped), sends a compact structured list to Gemini with a prompt to identify: (a) duplicate categories (e.g. two music services), (b) likely‑unused (no recent usage signal / long time since added with high price), (c) cheaper‑tier suggestions. **Validate the model's JSON against a zod schema** before returning (current `/ai/scan-receipt` does not validate — apply the same fix).
- Persist findings to an `optimizations` table (`user_id`, `kind`, `subscription_ids jsonb`, `est_monthly_savings`, `rationale`, `dismissed_at`), so results are cached and dismissible.
- Weekly, dispatch an `optimization` summary notification ("You could save $X — 2 suggestions").

**Frontend:** A "Savings suggestions" card on the dashboard, gated; Free sees a blurred teaser with an upgrade CTA.

**Acceptance criteria:** For a user with Spotify + Apple Music + an untouched $30 tool, `/ai/optimize` returns ≥1 duplicate and ≥1 unused finding with an estimated saving; response fails closed (500 + logged) on malformed model output; Free is 402'd.

---

## Feature 3 — Automatic bank sync (Plaid) *(Pro, Business — capability `bankSync`)*

### PROMPT: Feature 3 — Detect recurring charges automatically via Plaid

**Depends on:** F0, F1. **Gate:** `requireEntitlement('bankSync')`. **Privacy:** opt‑in only; never store bank credentials (Plaid handles auth). Keep this consistent with the marketing promise "no bank login required" by making it strictly optional.

**Backend** (`apps/backend/src/routes/plaid.ts` — new, using `plaid` SDK):
- `POST /plaid/link-token` → create link token. `POST /plaid/exchange` → exchange public token, store encrypted `access_token` + `item_id` in a `plaid_items` table (`user_id`, encrypted token, institution, status).
- Sync job: pull transactions (or use Plaid `/transactions/recurring`), detect recurring streams, and **propose** subscriptions to the user (a `subscription_candidates` table) rather than auto‑creating — user confirms/merges to avoid duplicates with manual/AI entries.
- Webhook endpoint for Plaid `TRANSACTIONS` updates; reconcile detected price changes into Feature 1's price‑hike pipeline.

**Security:** encrypt Plaid access tokens at rest (env `PLAID_TOKEN_ENC_KEY`); scope every query by `userId`; add `PLAID_CLIENT_ID`, `PLAID_SECRET`, `PLAID_ENV` to env.

**Frontend:** Settings → Connections → "Connect a bank (optional)" via Plaid Link, gated; a review queue to accept detected subscriptions.

**Acceptance criteria:** A Pro user completes Plaid sandbox link; recurring charges appear as **candidates** to confirm (not silently added); confirming creates userId‑scoped subscriptions with correct `nextBillingDate`; Free is 402'd; tokens are stored encrypted.

---

## Feature 4 — Team workspaces & seats *(Business — capability `teamWorkspaces`, limit `seats: 10`)*

### PROMPT: Feature 4 — Multi‑user organizations with shared subscriptions

**Depends on:** F0. **Gate:** `requireEntitlement('teamWorkspaces')`; billing tied to the org, not the individual.

**Data model** (`lib/db/src/schema/orgs.ts` — new):
- `organizations` (`id`, `name`, `owner_user_id`, `stripe_customer_id`, `plan`, `seats int`), `org_members` (`org_id`, `user_id`, `role`, `status`, `invited_email`).
- **Add `org_id nullable` to `subscriptions`** (and `billing_history`): a subscription belongs to either a user (personal) or an org (shared). Every subscription query must scope by `userId OR membership(org_id)`.
- Move the Stripe subscription/plan from `users` → `organizations` for org‑billed accounts; `plan` resolution becomes "personal plan OR the plan of any org you're an active member of."

**Backend** (`routes/orgs.ts`): CRUD orgs; `POST /orgs/:id/invites` (email invite via F1), accept/decline; `enforceLimit('seats', memberCount)` on invite; list/move subscriptions between personal and org scope.

**Frontend:** Workspace switcher (personal ↔ org); shared dashboard; member management; invite flow. Gate the whole area behind `teamWorkspaces`.

**Acceptance criteria:** A Business owner invites 3 members (blocked at seat 11); members see shared org subscriptions but not each other's personal ones; leaving an org revokes access; personal‑tier users can't create orgs (402).

---

## Feature 5 — Role‑based permissions *(Business — capability `rbac`)*

### PROMPT: Feature 5 — Roles (owner / admin / member / viewer) inside organizations

**Depends on:** F4. **Gate:** `requireEntitlement('rbac')` (org‑level).

**Model:** `org_members.role ∈ {owner, admin, member, viewer}`. Define a permission map: `viewer` = read only; `member` = add/edit subscriptions; `admin` = manage members + billing; `owner` = everything incl. delete org.

**Backend:** `requireOrgRole(minRole)` middleware layered after membership check; apply to org subscription writes, member management, and billing endpoints. All checks server‑side (never trust client role).

**Frontend:** Role badges, a member‑roles editor (admin+), and hide/disable actions the current role can't perform.

**Acceptance criteria:** A `viewer` gets 403 on any write; a `member` can edit subscriptions but not invite; only `admin/owner` can change billing; role changes take effect immediately.

---

## Feature 6 — PDF savings reports *(Business — capability `pdfReports`)*

### PROMPT: Feature 6 — Generate branded PDF spend & savings reports

**Depends on:** F0 (+ F2 numbers if available). **Gate:** `requireEntitlement('pdfReports')`.

**Backend:** `GET /reports/savings.pdf?period=...` (userId/org‑scoped) → render a PDF (e.g. `@react-pdf/renderer` or Puppeteer) covering: total monthly/annual spend, spend by category, price changes detected, optimization savings, and renewals ahead. Build the report **from real `billing_history`**, not the current fabricated `spend-over-time` (`subscriptions.ts:397`) — fix that aggregation to read history.

**Frontend:** "Export PDF report" button on analytics, gated; monthly auto‑email of the report via F1 for orgs that opt in.

**Acceptance criteria:** A Business user downloads a correctly‑scoped PDF with real numbers; Free/Pro see the button locked (402 on direct call); numbers reconcile with the dashboard.

---

## Feature 7 — Shadow‑IT & duplicate app audit *(Business — capability `shadowItAudit`)*

### PROMPT: Feature 7 — Org‑wide duplicate/overlap and shadow‑IT audit

**Depends on:** F2, F4. **Gate:** `requireEntitlement('shadowItAudit')`.

**Logic:** Run the Feature‑2 optimization pass across **all org subscriptions** to flag: same tool paid for by multiple members, overlapping categories across the team, and unused seats. Produce an org audit report + optimization notifications to admins.

**Acceptance criteria:** In an org where two members each expense Notion, the audit flags the duplicate with combined cost and a consolidation suggestion; only org admins/owners can view it.

---

## Global acceptance checklist (run after each feature)

- [ ] Backend enforces the capability (**402** for lower tiers) — verified by test, not just UI hiding.
- [ ] Frontend hides/locks the feature for lower tiers and shows an upgrade/"coming soon" CTA.
- [ ] Every new query is scoped by `userId` (or org membership) — no cross‑tenant leakage.
- [ ] Schema change shipped as a **migration** (not just `push`).
- [ ] OpenAPI updated and typed client regenerated.
- [ ] Notifications go through `dispatch()` (idempotent) — never ad‑hoc sends.
- [ ] New env vars added to `.env.example` and to `render.yaml`.
- [ ] At least one unit/integration test added; existing tests pass.
- [ ] `/pricing` `SOON` chip removed for the shipped feature (it should now be live for its tiers).

## Suggested build order

**F0 → F1 → Feature 1 → Feature 2 → Feature 3 → Feature 4 → Feature 5 → Feature 6 → Feature 7.**
(Entitlements and the notification pipeline unblock everything; individual‑tier value ships before team features.)
