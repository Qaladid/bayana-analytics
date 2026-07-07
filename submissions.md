# Bayana Analytics

Bayana Analytics is a data-pipeline SaaS for Nairobi hospital/pharmacy 
SMEs. Staff upload their existing monthly Excel exports (stock, patient 
visits, revenue) and get a normalized live dashboard, plus an AI chatbot 
that answers natural-language questions about their own data.

## What's built
- Landing page (Next.js + TypeScript + Tailwind), cloned and fully 
  recolored/recopied for Bayana
- Supabase backend: schema (organizations, users, stock_levels, 
  patient_visits, revenue, subscriptions), RLS policies, Google OAuth + 
  email/password auth, auto-org-creation on signup
- Dashboard reading live Supabase data (Overview, Stock Levels, Patient 
  Visits, Revenue)
- Paywall gate: Supabase was configured to simulate the paywall/
  authentication check required to reach the dashboard (subscription 
  status flag on the org), rather than a live Stripe integration — a 
  deliberate scope cut given the time constraint, noted here 
  transparently rather than left unstated
- AI chat assistant pattern proven against a real Postgres DB (FastAPI + 
  LLM tool-calling), answering questions like "which branch made more 
  profit this month" against real financial data — built for a prior 
  hospital analytics project and being adapted into Bayana

## AdaL Workflow
This project was built using AdaL 2 in Engineer mode (`adal --mode engineer`).

1. **Setup**: an engineering context `.md` file was provided to the AdaL 
   Engineer, describing the project scope, stack, and build order.
2. **Delegation**: the Engineer spun up two workers — a **Builder** 
   (implementation) and an **Evaluator** (review/verification) — working 
   the task with an adversarial check built into the loop rather than a 
   single agent self-grading its own output.
3. **Conflict surfaced**: the Builder and Evaluator reached a disagreement 
   over contract terms (interface/shape expectations between components), 
   which had to be manually reviewed and resolved rather than auto-merged — 
   demonstrating that the review step meaningfully caught a real 
   inconsistency rather than rubber-stamping the Builder's output.
4. Once Adal Cloud credits were exhausted mid-build, the AI chatbot layer 
   was continued manually (see below) — so this submission reflects both 
   the AdaL-orchestrated portion of the build and the manually-completed 
   portion, transparently.

## Note on AI chatbot integration
Originally planned around Adal Cloud (hosted agent + custom tools calling 
Supabase directly). Adal Cloud credits were exhausted during the build 
window. The chatbot's guardrails, system prompt, and schema-aware tool 
calling were designed for that layer and proven working in an adjacent 
project (FastAPI + LLM tool-calling against a real Postgres DB). Final 
wiring into Bayana's own Supabase instance was completed manually rather 
than through Adal Cloud.

## Stack
Next.js 14, TypeScript, Tailwind, Supabase (Postgres + Auth), Stripe 
(paywall simulated via Supabase for demo purposes), FastAPI + LLM 
tool-calling for the assistant layer.