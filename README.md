# Bayana Analytics

## 1. Overview

Bayana Analytics is a multi-tenant healthcare analytics dashboard that lets medical organizations track revenue, stock levels, and patient visits in one place. Each signed-up user gets their own organization (created automatically on signup), and their data is isolated from every other organization by Supabase Row Level Security. On top of the charts, an AI assistant lets users ask questions about their own data in natural language — "How much revenue did we collect last month?", "Which items are low in stock?" — with the assistant scoped to only ever see the authenticated user's organization.

## 2. Links

- **Live demo:** https://bayana-analytics.vercel.app
- **Repository:** https://github.com/Qaladid/bayana-analytics

## Test Credentials

Email: abditajr143@gmail.com
Password: [insert password manually]

This account has seeded demo data (stock levels, patient visits, and revenue sourced from a real hospital analytics project) already populated in Supabase for org_id `68ff7230-038a-4708-b1da-cf3c471d21a4`.

## 3. Tech Stack & Architecture

| Layer | Technology |
| --- | --- |
| Framework | Next.js 15 (App Router, React Server Components) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Database & Auth | Supabase (Postgres + Auth, SSR client) |
| Charts | Recharts |
| Animation | Framer Motion |
| Icons | lucide-react |
| AI assistant | Adal Cloud REST API (see below) |

**AI assistant layer.** The chatbot is wired up in [`src/app/api/chat/route.ts`](src/app/api/chat/route.ts). It is **not** a direct Anthropic SDK integration — it calls the **Adal Cloud REST API** directly via `fetch`:

- `POST {ADAL_BASE_URL}/v1/sessions` to open a session (bound to `ADAL_AGENT_ID`),
- `POST {ADAL_BASE_URL}/v1/sessions/{id}/chat/stream` to send a message and parse the Server-Sent Events stream, keeping only the `assistant.message.completed` event's text.

Before the message is sent, the route resolves the caller's `org_id` server-side from the authenticated Supabase session and prefixes the user's message with `[org_id: ${orgId}]`, so the assistant's tools are always scoped to the real organization. The client is never trusted to supply an `org_id`.

**Auth & multi-tenancy.** [`src/middleware.ts`](src/middleware.ts) guards `/dashboard` routes using the Supabase SSR client, redirecting unauthenticated users to `/auth/login` and refreshing session tokens. A Postgres trigger (`handle_new_user`) provisions a new `organizations` row and admin `users` row for every signup.

## 4. Run Locally

```bash
git clone https://github.com/Qaladid/bayana-analytics.git
cd bayana-analytics
npm install
npm run dev
```

The app runs on http://localhost:3000.

### Required environment variables

Create a `.env.local` file with the following variable **names** (do not commit real values). The Supabase keys come from your Supabase project dashboard → Settings → API; the Adal Cloud values come from your Adal Cloud agent configuration.

```
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# App URL (OAuth redirect / webhooks)
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Adal Cloud — AI assistant
ADAL_BASE_URL=
ADAL_JWT=
ADAL_AGENT_ID=
```

> Stripe keys (`STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`) are listed in `.env.local` as commented-out placeholders. They are **not** required to run the app today — see Known Limitations.

## 5. Deployment

The app is hosted on **Vercel**, connected to this GitHub repository for continuous deployment on push to `main`. Environment variables (Supabase, Adal Cloud, app URL) are configured in the Vercel project settings under Settings → Environment Variables. No CI/CD pipeline runs outside of Vercel's built-in build-on-push.

## 6. Database Schema

All tables live in the connected Supabase Postgres database and are **org-scoped via Row Level Security**. RLS policies use a `current_user_org_id()` helper so a user can only ever read or write rows belonging to their own organization.

| Table | Purpose |
| --- | --- |
| `organizations` | One row per tenant organization. Auto-created on signup via the `handle_new_user` trigger. |
| `users` | User profiles linked to Supabase Auth, each carrying an `org_id` and role. |
| `data_sources` | Metadata about ingested data sources (e.g. uploaded Excel files). |
| `stock_levels` | Inventory snapshots across branches/items. |
| `patient_visits` | Patient traffic and visit counts. |
| `revenue` | Financial revenue records. |
| `subscriptions` | Tracks `stripe_customer_id` and `subscription_status` for the (currently simulated) paywall. |

Migrations live under [`supabase/migrations/`](supabase/migrations/).

## 7. Guardrails

The AI assistant is governed by a single system prompt attached to every session, combined with server-side enforcement of org-scoping. The headline guarantees:

- **Scope lock** — only answers questions about the org's own stock, patient visits, and revenue; refuses off-topic queries.
- **Prompt injection resistance** — ignores embedded instructions from the user or from tool results that try to override its role.
- **Org isolation** — never accepts a user-typed `org_id`; only uses the one resolved server-side from the authenticated session.
- **Credential handling** — refuses to process or repeat anything that looks like a password, API key, or token.

It also covers tone handling and a "no fabrication under data gaps" rule. See [`GUARDRAILS.md`](GUARDRAILS.md) for the full text of each rule.

## 8. Current State / Known Issues

This section is an honest snapshot of what works, what's simulated, and what's still open — not a roadmap. Nothing here is rounded up to "done."

### Fully working end-to-end

- **Authentication with fail-closed middleware.** [`src/middleware.ts`](src/middleware.ts) guards every `/dashboard` route using the Supabase SSR client; unauthenticated users are redirected to `/auth/login` and session tokens are refreshed on each request. There is no unprotected path into the dashboard.
- **Dashboard reading live Supabase data.** The revenue, stock, and visits pages ([`src/app/dashboard/`](src/app/dashboard/)) fetch live rows from Supabase scoped by `org_id` and render them with Recharts.
- **AI assistant via Adal Cloud.** [`src/app/api/chat/route.ts`](src/app/api/chat/route.ts) resolves the caller's `org_id` server-side, opens an Adal Cloud session, streams the SSE response, and returns the completed assistant message — gated behind the auth check so unauthenticated requests never reach the model.

### Simulated or manual rather than fully automated

- **Stripe paywall is simulated via Supabase, not live Stripe.** The `subscriptions` table tracks status, but the Stripe SDK is not installed (`package.json` has no `stripe` dependency) and the Stripe env vars in `.env.local` are commented out. Billing tiers are shown in the UI ([`src/components/sections/Pricing.tsx`](src/components/sections/Pricing.tsx)) but no live payment flow is wired.
- **Revenue data seeded manually.** Revenue rows were seeded manually from Darusalam's DuckDB data mart export for demo purposes; there is no automated Excel-upload-to-Supabase sync pipeline yet.

### Not yet implemented or still under verification

- **Automated test suite.** Playwright is listed as a dev dependency, but there is no `test` script in `package.json` and no runnable test suite is wired up. [`team-log/test_plan.md`](team-log/test_plan.md) exists as a plan only.
- **CI/CD pipeline.** Outside of Vercel's build-on-push, there are no GitHub Actions or other CI workflows running lint, tests, or checks.
- **Lighthouse / accessibility audit.** No audit results are checked in; a11y and performance baselines have not been formally measured.
- **Landing page CTA buttons.** The "Get Started Free" buttons in [`Hero.tsx`](src/components/sections/Hero.tsx) and [`FinalCTA.tsx`](src/components/sections/FinalCTA.tsx) point to the anchor `#get-started` rather than `/auth/login`, so they scroll the page instead of routing to sign-in.
- **Dashboard KPI cards.** [`OverviewContent.tsx`](src/components/dashboard/OverviewContent.tsx) still contains `[DEBUG] console.log("[KPI] ...")` statements at lines 21, 30, 40, 47, and 54, indicating the KPI fetch is under active investigation and not yet considered stable.

### Data connectors — current and planned

The SaaS currently ships with **one connector: the Excel upload**. We are adding direct connectors to HMIS systems such as **PharmaCore**. Once the data pipeline work is complete, the PharmaCore connector will be ready, and hospitals already running that system will be able to connect their HMIS to Bayana Analytics after payment — no manual export/import step required. Until then, data flows through the Excel connector or manual seeding.

## 9. AdaL Workflow Note

AdaL 2 **Engineer mode** was used with Builder/Evaluator workers for part of the build. Adal Cloud credits ran out mid-build, so the AI chatbot layer was finished by calling the Adal Cloud REST API directly via `fetch` in [`src/app/api/chat/route.ts`](src/app/api/chat/route.ts) (managing sessions, streaming SSE, and parsing `assistant.message.completed` events by hand) rather than continuing through the AdaL 2 agent orchestration. The guardrails system prompt and server-side org-scoping were then implemented directly on top of that integration.