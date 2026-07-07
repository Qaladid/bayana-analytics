# Frontend Guide — Bayana Analytics

> **Mode: vibe coding.** Single worker, direct build, no builder/evaluator split, no adversarial visual verification loop. Ship working over perfect. If a past session's docs mention "Engineer / Builder / Evaluator" or a 5-phase clone process — that was the OLD approach. Ignore it unless explicitly asked to resume it.

## What this project is

Bayana Analytics — a data-pipeline SaaS for Nairobi hospital/pharmacy SMEs. Staff upload messy Excel exports (stock levels, patient visits, revenue), get a normalized dashboard, and can ask an AI chatbot natural-language questions about their own data.

## Current frontend state

- Next.js (App Router) + TypeScript + Tailwind CSS
- Landing page is a **structural clone of the Framer "Clario" template**, already built and visually matching (nav, hero, "how it works" 3-step, features grid, pricing, testimonial, FAQ, footer)
- Animation: Framer Motion, entrance stagger + scroll-triggered fades (matches Clario's original Appear/Scroll Effects)
- Folder layout:
  ```
  src/
    components/
      layout/     # Navbar.tsx, Footer.tsx
      sections/   # Hero.tsx, HowItWorks.tsx, Features.tsx, Pricing.tsx
      ui/         # Button.tsx, StepCard.tsx, PricingCard.tsx
    assets/media/
    styles/globals.css
  ```

## Brand palette (updated — blue is now primary, do not re-litigate)

Primary accent is **blue**. Superseded the earlier teal palette.

| Role | Value |
|---|---|
| Primary accent / CTA buttons / step-pills / highlights | `#1D4ED8` |
| Data-viz lines (charts, graphs) | `#38BDF8` (lighter, distinct from CTA blue) |
| Dark hero/section backgrounds | `#0B1220` (navy-black, not pure neutral black) |
| Secondary links (sparingly) | `#60A5FA` |
| Card backgrounds | Keep original dark gray `#1A1A1A` — don't tint these |

Rule: hex values only when doing palette work. Never touch border-radius, padding, shadow spread, spacing, or animation timing while recoloring — those are structural properties, not brand properties.

## Copy voice

Hospital/pharmacy ops, not personal finance. Examples already decided:
- Headline: "Stop losing hours to Excel."
- Subheadline: "Connect your hospital or pharmacy systems and get real-time dashboards — or just ask our AI assistant."
- 3-step: Connect your systems → Track your operations → Ask your AI assistant

Don't invent new positioning without checking — reuse this voice for any new copy (pricing tiers, feature cards, etc.), swapping in KES pricing and hospital-specific feature names (connector library, real-time dashboards, AI chatbot, data security).

## What still needs building (frontend side)

1. Auth pages (login/signup) — Supabase Google OAuth + email/password fallback
2. Excel upload UI — file picker, upload progress, a preview/confirm step before data hits the normalized tables
3. Dashboard page — stock levels, patient visits, revenue by branch, simple charts/tables reading from Supabase
4. Paywall gate — Stripe Checkout entry point, dashboard locked behind `subscription_status` flag
5. Chatbot widget — chat bubble UI that streams from the Next.js API route (see `integrating-ai-guide`), NOT built directly against AdaL from the browser

## Hard rules for this vibe-coding phase

- No lorem ipsum / TODO placeholders in anything you ship
- No adversarial evaluator worker, no `team-log/eval_round_N.md` style reports — just build, run `npm run build`, fix errors, move on
- If something is fragile but functional, ship it and flag it in a one-line comment — don't gold-plate
- Stay on whatever model was explicitly set for the session (currently GLM-5.2) — do not self-select a different model mid-session
