# Contract — Clario → Bayana Analytics Landing Page Clone

> **Status:** Approved to Build
> **Synthesizes:** user goal (verbatim) + builder_plan.md + test_plan.md + engineer decisions.
> **Graded artifact:** this contract, not the original spec.

## User Goal (verbatim — never downgrade fidelity)
Clone the Clario landing page EXACTLY — animation, content, font, styling, every effect — pixel level AND video level. Everything identical EXCEPT color: a calm teal/blue healthcare palette instead of Clario's original colors. Then swap the copy to Bayana Analytics (data-pipeline SaaS for Nairobi hospital/pharmacy SMEs). Structure first, brand second.

## Engineer Decisions (binding)
1. **Scope = FULL PAGE.** All 13 sections the builder discovered: Navbar, Hero, RealtimeCards (4 cards), HowItWorks (3 steps), Stats, Features (6), Comparison, Testimonial, Pricing, FAQ, Blog (4), FinalCTA, Footer.
2. **Live truth wins over docs.** Where clone_guide_v2.md / clone_landing_page_101.md disagree with the live site, the live site is correct (e.g., 4 realtime cards, 2 priced tiers + team strip).
3. **Open questions resolved as "mirror live":** pricing toggle behavior, FAQ (accordion vs static), blog link targets — builder verifies live and replicates Clario's actual behavior exactly. No invented interactions.
4. **Two-phase, never mixed:** Phase A = structural clone using Clario's own colors/copy (fintech, green). Phase B = brand swap (teal/blue + Bayana copy + hospital/AI mockups) ONLY after structural ACCEPT.
5. **Builder is browser-use** — must use the real browser tool (not fetch_url/bash) for the live screenshot + sniper + animation pass.

## Live Reference
- **URL:** https://clario.framer.website/ (interactive; the marketplace listing is a static gallery — never use it for comparison).
- **Raw HTML dump:** `team-log/clario_raw.html` (builder's static extraction).
- **Screenshots:** `team-log/screenshots/clario/` (both workers capture independently).

## Phase A — Structural Clone (Clario's own colors + copy)

### A1. Build step 0 — live baseline capture (builder, before any code)
- [ ] Capture screenshot matrix: 1440×1400, 1920×1200, 390×844 — each with initial-load (animation mid-play) AND settled (8–12s) captures. Saved to `team-log/screenshots/clario/`.
- [ ] Run sniper scripts (clone_landing_page_101.md §5): hero h1 at 1440 AND 1920, CTA buttons, step cards, step pills, nav metrics, all grid-template-columns.
- [ ] Run animation scanner (§4): capture real `data-framer-appear-id` element timings in ms (durations, staggers, easing) — NOT the doc defaults.
- [ ] Persist baseline to `team-log/tokens/clario_baseline.json` for evaluator diff.
- [ ] Confirm: hero h1 font-size at 1440 vs 1920 (fluid?), pricing toggle behavior, FAQ interaction model, blog link targets.

### A2. Scaffold
- [ ] Next.js (App Router) + TypeScript + Tailwind + Framer Motion + lucide-react.
- [ ] `npm run build` passes, zero type errors. `npm run lint` clean.
- [ ] Folder structure per builder_plan.md §5.

### A3. Design tokens (Clario's actual values — applied in Phase A)
- [ ] Colors: page bg `#050505`, alt dark `#0d0d0d`, green accent `#8cff2e`, white `#ffffff`, off-white `#f8f8fa`, light surface `#f5f5f2`, muted `#2f2f2f`/`#c8c8c0`, dark border `#171717`, secondary text `#ffffffa6`, green tint `#8cff2e26`.
- [ ] Font: **Inter** (ignore the Framer `Placeholder` shim), loaded via `@import` with weights 400/500/600/700.
- [ ] Type scale: hero h1 48px/700/-0.04em/lh1.1–1.2 (confirm fluid live); section h2 42/36px; card h4 22/20px/600/-0.02em; body 15/16px; eyebrow/pill 10/12px/600/0.2em UPPERCASE; nav link 14px/500; price 48px/700/-0.04em.
- [ ] Layout: container max-width 1199px (centered `mx-auto`, never fixed margins); narrow 809px; medium 1000px; section padding 100px 40px / 80px 30px / 60px 20px; card radius 20px; CTA padding 12px 20px; pricing card padding 30px 20px.
- [ ] Shadows verbatim: 7-layer dark card stack `rgba(23,23,23,*)`; green-accent stack `rgba(140,255,47,*)`; CTA glow `0px 8px 20px 0px rgba(132,255,31,0.32)`; pill soft glow; focus ring `0 0 0 4px rgb(23,23,23)`.

### A4. Sections (structure + Clario copy verbatim)
- [ ] **Navbar:** logo square + wordmark (left) → links `How it works / Features / Pricing / Blog` (center) → `Waitlist` outline + `Contact` filled green (right). Sticky. Appear stagger.
- [ ] **Hero:** badge `All-in-One Finance Toolkit` → h1 `Take control of your finances — with clarity` (em-dash U+2014 literal) → subhead `All your money insights, finally in one place — track income, spending, and reach your goals with ease.` → CTA `Get Started Free` (dedupe double-text hover-swap) → dashboard mockup (recreate as SVG/styled divs, no hotlinking).
- [ ] **RealtimeCards:** h2 `See your money in real time, clearly.` → **4 cards**: Smart Dashboard / Cashflow Overview / Spending Breakdown / Savings Goal.
- [ ] **HowItWorks:** `Watch video` link + `How Clario works` → 3 white cards, each: mockup PNG→green pill `Step N`→h4 headline→gray desc. Copy byte-exact per test_plan.md §0 (Connect your accounts / Track your money / Set goals & stay on track).
- [ ] **Stats:** `Trusted by 3k+ Freelancers` / `$1.2M+ Saved` / `Clario helps users save more — and spend smarter.`
- [ ] **Features:** 6-card grid, h2 `Designed for clarity, built for better money decisions`.
- [ ] **Comparison:** Other Tools vs Clario two-column.
- [ ] **Testimonial:** photo + quote (recreate photo as placeholder SVG, no hotlink).
- [ ] **Pricing:** Starter $29 / Pro $49 (POPULAR) + team strip. Monthly/yearly toggle mirrors Clario's live behavior.
- [ ] **FAQ:** 6 items numbered 01–06; interaction model mirrors Clario live (accordion if Clario accordions).
- [ ] **Blog:** 4 post cards; link targets mirror Clario live.
- [ ] **FinalCTA:** full-bleed CTA section.
- [ ] **Footer:** logo, repeated nav, social icons, copyright.

### A5. Animation
- [ ] Entrance: Framer Motion stagger (hero badge→h1→subhead→CTA), `data-framer-appear-id`-equivalent initial transforms y:20/12/10→0.
- [ ] Step cards: `whileInView`, y:40→0, stagger 0.12, `viewport={{once:false}}` — **re-triggers on every viewport entry, NOT only the first.**
- [ ] Scroll-triggered fades on Features/Pricing/FAQ/Blog — all `viewport={{once:false}}` so the fade-in replays every time a section re-enters the viewport on scroll up OR down. Live Clario replays the fade on every re-entry; the clone MUST match this. Do NOT use `once:true` anywhere on scroll-triggered animations.
- [ ] **Repeat-trigger verification (binding):** scrolling a section out of view and back in MUST replay the fade-in animation. This is a permanent acceptance criterion, not first-load-only timing.
- [ ] **Timing retune:** if evaluator round-1 shows >0.1s drift from Clario's real ms timings (captured in A1), builder retunes to match live, not the doc defaults.
- [ ] **No `once:true` anywhere** in scroll-triggered motion components — `grep -rn "once: true" src/` must return 0 matches before ACCEPT.

### A6. Anti-premature-swap gate (structural phase)
- [ ] Before structural ACCEPT: zero grep matches for `teal|hospital|pharmacy|Bayana|Bayana Analytics|0F6E5C|1D4ED8` anywhere in `src/`.
- [ ] All copy is Clario's fintech verbatim (byte-exact incl. em-dash U+2014).

### A7. Structural acceptance (evaluator-owned — `team-log/eval_round_N.md`)
- [ ] Pixel diff ≤5% desktop (1440), ≤8% mobile (390) vs Clario settled screenshot.
- [ ] Computed tokens: radius/shadow/font-family exact; sizes ±1px; spacing ±4px; letter-spacing ±0.01em.
- [ ] Animation timing ±0.1s per element start + stagger vs evaluator's own live capture.
- [ ] Copy byte-exact to golden truth (test_plan.md §0).
- [ ] Responsive: nav collapses at 390px, hero stacks, cards stack vertically, max-width centering correct at 1920px.
- [ ] No console errors; fonts load without flash of fallback.
- [ ] Button dedupe verified (single text node, CSS hover for arrow).

## Phase B — Brand Swap (ONLY after Phase A ACCEPT)

### B1. Palette swap (hex values only — no structural changes)
- [ ] Green accent `#8cff2e` → teal `#0F6E5C` (primary) everywhere.
- [ ] Trust blue `#1D4ED8` as secondary where Clario uses a secondary accent.
- [ ] Green tints/glow shadows re-tinted to teal equivalents (same rgba alpha structure).
- [ ] **Zero leftover Clario green** anywhere (evaluator greps `8cff2e|140,255,47|132,255,31`).
- [ ] Page bg / card surfaces: keep dark hero, light sections elsewhere — confirm contrast ratios equivalent to Clario's.

### B2. Copy swap (per clone_landing_page_101.md §3 map)
- [ ] Nav: `How it Works / Features / Pricing / Contact`; buttons `Login` (outline) + `Get Early Access` (filled teal).
- [ ] Hero badge `All-in-One Hospital Data Toolkit`; h1 `Stop losing hours to Excel.`; subhead `Connect your hospital or pharmacy systems and get real-time dashboards — or just ask our AI assistant.`; CTA `Get Early Access`.
- [ ] RealtimeCards h2 `See your operations in real time, clearly.`; cards Unified Dashboard / Trend Overview / (stock/patient/revenue themed).
- [ ] HowItWorks steps: Connect your systems / Track your operations / Ask your AI assistant (copy per 101 doc §3.4).
- [ ] Stats, Features, Comparison, Testimonial, Pricing (KES, Starter/Growth/Multi-branch, "Early access pricing"), FAQ, Blog, FinalCTA, Footer all Bayana-ized.
- [ ] **Zero leftover fintech copy** (evaluator greps `bank|financ|spending|savings|Clario`).

### B3. Mockup swap
- [ ] Hero mockup: hospital ops dashboard (stock levels, patient visits, revenue by branch) + AI chat bubble.
- [ ] Step 1 card: connector/HMIS tile (PharmaCore/Ilara-style chips).
- [ ] Step 2 card: line chart relabeled Stock Levels / Patient Visits.
- [ ] Step 3 card: chat-bubble Q&A exchange.
- [ ] Realtime + Features mockups themed hospital/AI.
- [ ] No bank/spending/spending-chart imagery anywhere.

### B4. Structural preservation
- [ ] All sizes, spacing, radii, shadows (structure), gaps, animation timing UNCHANGED from Phase A ACCEPT snapshot.
- [ ] Evaluator: structural delta = 0 from ACCEPT snapshot (only color/copy/image diffs).

### B5. Final acceptance (`team-log/eval_round_FINAL.md`)
- [ ] Palette teal/blue throughout, zero green.
- [ ] All copy Bayana Analytics, zero fintech.
- [ ] Mockups hospital/AI, zero bank.
- [ ] Structural fidelity unchanged.
- [ ] `npm run build` + `npm run lint` clean. No lorem ipsum / TODO / placeholder.
- [ ] `BUILD-LOG.md` written summarizing build + checklist pass/fail.
- [ ] Committed and pushed to `github.com/Qaladid/bayana-analytics`.

## Rules (binding on both workers)
- **Builder:** surgical edits; self-test aggressively (build, lint, visual self-check, fix, repeat); do NOT self-evaluate or write eval reports; iterate until YOU believe it's perfect, then report done. Leave changes uncommitted unless commit is assigned.
- **Evaluator:** adversarial — "this clone is broken, prove it"; never rubber-stamps; measurable evidence only (pixel-diff %, computed-style equality, ms timings); different worker, different session from builder; writes `eval_round_N.md` per round.
- **Both:** build ON existing infra; do not hotlink Clario assets; recreate mockups as SVG/styled divs. Canonical files only in `team-log/`.
