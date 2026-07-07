# Backend Guide — Bayana Analytics

> **Mode: vibe coding.** Single worker, direct build, no evaluator loop. Fragile-but-working beats perfect. Ship end-to-end, don't gold-plate any one layer before the others exist.

## Stack

- **Database/Auth**: Supabase (Postgres + Auth + Storage)
- **Payments**: Stripe Checkout + webhook
- **Hosting for API routes**: Next.js API routes (server-side only — this is also where secrets like the AdaL JWT and Stripe keys live, never client-side)

## Core schema (normalized tables — build these first)

```
organizations (id, name, created_at)
users (id, org_id, role, email)
data_sources (id, org_id, source_type, original_filename, uploaded_at)
stock_levels (id, org_id, source_id, item_name, quantity, branch, recorded_at)
patient_visits (id, org_id, source_id, branch, visit_date, count)
revenue (id, org_id, source_id, branch, period, amount)
subscriptions (id, org_id, stripe_customer_id, subscription_status, updated_at)
```

Keep it this simple for the hackathon. No granular permission tiers, no multi-tenant complexity beyond `org_id` scoping. A boolean-ish `subscription_status` check is enough for the paywall gate.

## Excel upload + schema normalization — THIS IS NOT THE AI CHATBOT'S JOB

This is the single most important architectural boundary in this project. Keep it exactly this way:

- **Ingestion-time problem**: every hospital names their Excel columns differently ("Stock_Qty" vs "Quantity" vs "Available Units"). This has to be resolved **before** data ever reaches `stock_levels` / `patient_visits` / `revenue`.
- **Approach**: a lightweight normalization step at upload time — start with simple fuzzy/heuristic column-name matching (e.g. Levenshtein distance or a keyword map against known synonyms). Only reach for a one-time LLM-assisted mapping step if heuristics genuinely fail on a new hospital's format, and even then it runs once at configuration time, not per-query.
- **Do NOT** build a custom AI tool that guesses column mappings live during chat — that's slow, expensive per request, and conceptually wrong. The chatbot only ever queries already-clean, already-normalized tables.
- Flow: upload → parse (SheetJS/similar) → match columns against known schema → user confirms/corrects mapping if low-confidence → insert into normalized tables.

## Auth

- Supabase Google OAuth as primary, email/password as fallback if OAuth setup stalls
- Org + role stored on the `users` table, checked server-side on every API route that touches org-scoped data

## Paywall

- Stripe Checkout for subscription signup
- Webhook flips `subscription_status` in Supabase
- Dashboard route checks that flag server-side before rendering — simple boolean gate, nothing more granular for this hackathon

## Secrets handling

- Supabase service role key, Stripe secret key, AdaL JWT — all server-side only, in `.env.local` (gitignored — recreate manually on any new machine/clone, it will NOT come over via git)
- Never pass any of these into a custom_tool function body as a hardcoded string. See `integrating-ai-guide` for how tool functions should access them.

## Build order (don't skip ahead)

1. Auth
2. Core schema + Supabase tables
3. Excel upload + normalization
4. Dashboard reading normalized data
5. Stripe paywall gate
6. AdaL chatbot (see `integrating-ai-guide`) — this comes LAST, after everything it depends on already works
