# Builder Plan: Clario → Bayana Analytics

> **Phase:** Planning (clone_guide_v2.md §2, Phase 1–2). No clone code yet.
> **Live URL discovered:** `https://clario.framer.website/`
> **Source:** listing `https://www.framer.com/marketplace/templates/clario/` → "Open Preview" → `clario.framer.website`
> **Method note:** This session (GLM-5.2, Engineer role, no `browser-use`/`javascript_tool`) performed discovery via static HTML/CSS extraction of the live site's source (`clario_raw.html`, 862 KB, saved in `team-log/`). Framer renders client-side, but its SSR HTML ships full content + inline `<style>` blocks + `data-framer-appear-id` attributes, so structural and token fidelity is high. **Gaps** (noted in §Risks) are exact runtime-computed values that a live `javascript_tool` sniper pass should re-confirm before/after build.

---

## 1. Target & Scope
- **Live URL:** `https://clario.framer.website/`
- **Scope (full landing page):** Navbar, Hero (badge→headline→subhead→CTA→dashboard mockup), "See your money in real time" 2-card row, "How Clario works" 3-step cards, Trusted-by/stats strip, Features grid (6 cards), "Smarter way to manage money" comparison (Other Tools vs Clario), Testimonial, Pricing (Starter/Pro), FAQ (6), Blog grid (4), final CTA, Footer.
- **Viewports:** 1440×1400 (primary), 1920×1200 (centering/max-width), 390×844 (mobile hero/nav).

## 2. Tech Stack Discovery (confirmed from source)
- **Framework:** Framer (SSR HTML + client hydration).
- **Animation:** `data-framer-appear-id` entrance animations (11+ elements confirmed) + Framer `startOptimizedAppearAnimation`. Scroll Effects per listing metadata.
- **Font:** `Inter` (the `Inter Placeholder` string in `font-family` is the Framer font-shim — per clone_landing_page_101.md §2, ignore the shim, load **Inter**).
- **Render:** static-first; mockups are `framerusercontent.com` PNGs (recreate as styled divs/SVG, do not hotlink per guide §4).

## 3. Design Tokens (structural — Clario's actual values)

### 3.1 Color palette (CSS custom props from `<style>`)
| Token var | Hex | Role |
|---|---|---|
| `--token-0bd9300c-…` | `#050505` | Page background (near-black) |
| `--token-142de566-…` | `#0d0d0d` | Alternate/card-dark bg |
| `--token-2d3de992-…` | `#8cff2e` | **Green accent** (CTA, pills, highlights, selection bg) |
| `--token-743cf692-…` | `#ffffff` | Pure white (text on dark, card bg) |
| `--token-a5f375a3-…` | `#f8f8fa` | Off-white surface |
| `--token-cd9f772c-…` | `#f5f5f2` | Light card surface |
| `--token-a5fc4ef8-…` | `#2f2f2f` | Muted text / divider |
| `--token-b0e81180-…` | `#171717` | Dark border / ring |
| `--token-609eade5-…` | `#c8c8c0` | Muted gray text |
| (inline) | `#ffffffa6` | White at 65% opacity (secondary text) |
| `#8cff2e26` | green @ 15% | Selection/hover tint |

### 3.2 Typography (Inter)
| Role | Size | Weight | Letter-spacing | Line-height |
|---|---|---|---|---|
| Hero h1 | 48px | 700 | -0.04em | 1.1–1.2 |
| Section h2 | 42 / 36px | 700 | -0.04em | 1.2 |
| Card headline (h4) | 22 / 20px | 600 | -0.02em | 1.3 |
| Body / subhead | 15 / 16px | 400 | 0em | 1.5 |
| Eyebrow / pill label | 10 / 12px | 600 | **0.2em** (UPPERCASE) | 1.4 |
| Nav link | 14px | 500 | 0em | 1.4 |
| Price figure | 48px | 700 | -0.04em | 1 |

*(Font-size scale observed: 10,12,13,14,15,16,18,19,20,22,28,30,36,42,48px. Confirm hero h1 live — may scale responsively.)*

### 3.3 Layout / spacing
| Token | Value |
|---|---|
| Main container max-width | **1199px** (dominant), alt 1200px |
| Narrow text block | 809px |
| Medium | 1000px |
| Section padding | `100px 40px` (hero/feature), `80px 30px`, `60px 20px` |
| Primary gaps | 10px (tight), 20px (default), 40px (section-level) |
| Card gap (3-step row) | 20px |
| Card border-radius | **20px** |
| Button padding | `12px 20px` (CTA), `8px 16px` / `10px 15px` (nav) |
| Pricing card padding | `30px 20px` |

### 3.4 Box-shadows (verbatim — copy exact rgba stacks)
- **Card shadow (dark bg)** — most common, 38 occurrences:
  `inset 0px 1px 0px 0px rgba(23,23,23,0.15), inset 0px -1px 0px 0px rgba(23,23,23,0.15), 0px 1px 2px 0px rgba(23,23,23,0.4), 0px 3px 8px 0px rgba(23,23,23,0.19), 0px 6px 4px 0px rgba(23,23,23,0.05), 0px 11px 4px 0px rgba(23,23,23,0.01), 0px 16px 5px 0px rgba(23,23,23,0)`
- **Green-accent element shadow** (18 occurrences, green tinted):
  same stack with `rgba(140,255,47,*)` instead of `rgba(23,23,23,*)`.
- **Green CTA glow:** `0px 8px 20px 0px rgba(132,255,31,0.32)`
- **Green soft glow (pill/badge):** `0px 0.72px 0.36px -0.67px rgba(140,255,47,0.08), 0px 2.75px 1.37px -1.33px rgba(140,255,47,0.09), 0px 12px 6px -2px rgba(140,255,47,0.12)`
- **Focus ring:** `0px 0px 0px 4px rgb(23,23,23)` + inset stack.
- **Section divider glow:** `0px 140px 120px -80px rgba(99,106,125,0.04)`

### 3.5 Buttons
- **"Get Started Free"** — filled, bg `#050505` (or `#ffffff` on dark sections), text white, radius 20px, padding 12px 20px, has a **suffix arrow icon rotated -45deg** (`data-framer-name="Icon Normal"`, `transform:rotate(-45deg)`). Text renders twice (hover-swap pattern — guide §4 warns: dedupe).
- **"Contact" / "Contact us"** — filled green (`#8cff2e`), dark text, same radius/shape, arrow suffix.
- **"Waitlist"** — outline variant, `data-styles-preset="XIZNBvjnr"`.
- Nav links use preset `taovA_1_T` (14px, white).

### 3.6 Navigation structure (confirmed from DOM)
- `data-framer-name="Logo Square"` + `Logo Text` (left).
- `Navigation` → `Links`: **How it works / Features / Pricing / Blog** (preset `taovA_1_T`).
- Right: **Waitlist** (outline) + **Contact** (filled green).

### 3.7 "How it works" 3-step cards (confirmed)
- Container `data-framer-name="Cards"`; each card `data-framer-name="Step N"`.
- **Initial appear state:** `opacity:0; transform:translateY(40px)` (cards) → settled `opacity:1; transform:none`.
- Each card: mockup PNG (`framerusercontent.com`) → **green pill "Step N"** → h4 headline → gray description.
- Cards on `#050505` bg, white card surface, radius 20px, the dark card-shadow stack above.

## 4. Animation Strategy (confirmed `data-framer-appear-id`)
- **Mechanism:** Framer `startOptimizedAppearAnimation` driven by `data-framer-appear-id` (11+ ids: `7s1f6r`, `177gwxk`, `bk2w7e`, `1revpca`, `t14pul`, `d2trik`, …).
- **Initial states observed:** `opacity:0.001; transform:translateY(20px)` (hero stack), `translateY(12px)` / `translateY(10px)` (stagger), `translateY(40px)` (step cards), `perspective(1200px)` (one element).
- **Settled:** `opacity:1; transform:none`.
- **Easing:** Framer default appear uses `[0.25,0.46,0.45,0.94]`-style cubic-bezier (clone_landing_page_101.md §4 default).
- **Mapping to Framer Motion (rebuild):**
  - Hero: `staggerChildren:0.12, delayChildren:0.1`, `fadeUp = {hidden:{opacity:0,y:30}, visible:{opacity:1,y:0, transition:{duration:0.6, ease:[0.25,0.46,0.45,0.94]}}}`. Use `y:20`/`y:12`/`y:10` to match the three stagger tiers observed.
  - Step cards: `whileInView`, `y:40 → 0`, duration 0.6, stagger 0.12.
  - Scroll-triggered fades on lower sections (Features, Pricing, FAQ) — `whileInView` with `viewport={{once:true}}`.

## 5. Component Breakdown & Files to Scaffold
```
src/
  app/
    layout.tsx          # font import (Inter), globals
    page.tsx            # section composition
  components/
    layout/Navbar.tsx   # logo + links + 2 buttons, sticky, appear stagger
    layout/Footer.tsx
    sections/Hero.tsx          # badge→h1→subhead→CTA→dashboard mockup (SVG)
    sections/RealtimeCards.tsx # "See your data in real time" 2-card row
    sections/HowItWorks.tsx    # 3 StepCards, whileInView stagger
    sections/Stats.tsx         # Trusted-by + $1.2M figure
    sections/Features.tsx      # 6-card grid
    sections/Comparison.tsx    # Other Tools vs Clario two-column
    sections/Testimonial.tsx
    sections/Pricing.tsx       # Starter/Pro, monthly/yearly toggle
    sections/FAQ.tsx           # 6 items, numbered 01–06
    sections/Blog.tsx          # 4 post cards
    sections/FinalCTA.tsx
    ui/Button.tsx       # filled/outline/green variants, arrow suffix
    ui/StepCard.tsx
    ui/PricingCard.tsx
    ui/Mockup.tsx       # SVG dashboard/chart/progress mockups (hospital-themed in Phase 5)
  styles/globals.css    # CSS vars (Clario tokens for Phase 3, swapped in Phase 5)
  lib/tokens.ts         # exported token constants
```
- **Scaffold:** `npx create-next-app@latest` → TypeScript + Tailwind + App Router + Framer Motion + lucide-react.
- **No asset hotlinking** — recreate mockups as inline SVG/styled divs (guide §4).

## 6. Brand Swap Plan (Phase 5 — applied ONLY after structural ACCEPT)
| Role | Clario | Bayana |
|---|---|---|
| Page bg | `#050505` | keep dark hero, light (`#f8f8fa`) elsewhere — decide post-accept |
| Accent / CTA | `#8cff2e` green | **teal `#0F6E5C`** (primary) / **blue `#1D4ED8`** (secondary) |
| Step pill | green pill | teal pill, same shape/radius |
| Text | white on dark | equivalent contrast |
| Card bg | white on dark | white, cooler-gray shadow tint |
| Copy | fintech (per §3 of 101 doc) | Bayana Analytics (per copy map) |
| Mockups | bank/spending PNGs | hospital dashboard + AI chatbot SVGs |

**Rule:** swap hex values + copy + mockup SVG only. Do not touch radius, padding, shadow spread, gap, or animation timing.

## 7. Build Validation (Builder's responsibility — NOT evaluation)
1. `npm run build` — zero type errors, zero ESLint errors.
2. `npm run lint` — clean.
3. All section files exist and render at `/` without console errors.
4. Mobile (390px): nav collapses, hero stacks, 3-step cards stack vertically.
5. Report files changed + build status. **Do not self-evaluate visual fidelity** — that is the Evaluator's job.

## 8. Screenshot Matrix Status
**Not captured this turn** — `browser-use`/screenshot capability is not available in this session (see §9). The raw HTML (`team-log/clario_raw.html`) and extracted tokens substitute structurally. **Action for Engineer:** delegate the screenshot matrix (1440×1400, 1920×1200, 390×844; initial + settled) to a `browser-use` worker per clone_guide_v2.md §1, saving to `team-log/screenshots/clario/`. Reference images already sourced: hero dashboard, 3 step-card mockups, 2 realtime cards, 4 feature mockups, testimonial photo, final-CTA photo — all `framerusercontent.com` URLs logged in `a37a3031.md` (DOC_DIR).

## 9. Risks & Questions for the Engineer
1. **Capability gap (blocking for full Phase 1):** clone_guide_v2.md §1 specifies the Builder as a `browser-use` MiniMax-M3 worker with `javascript_tool`. This session is GLM-5.2 with no `browser-use`/`javascript_tool`/screenshot tool. I completed discovery via static HTML parsing (high fidelity for structure/tokens, since Framer SSR ships inline CSS + appear-ids), but **cannot**: (a) capture the screenshot matrix, (b) run live sniper scripts to confirm runtime-computed values (responsive font-size, hover states, exact animation durations/timings which Framer computes in JS). **Recommend:** either start the Builder worker per §1 for the live sniper + screenshot pass, or accept static-extracted tokens and have the Evaluator's first round validate them live.
2. **Exact animation timing** (durations/stagger in ms) is computed by Framer's JS runtime, not in the HTML. The `data-framer-appear-id` initial transforms are confirmed, but `transition-duration` values were not in the static source. **Plan:** use the clone_landing_page_101.md §4 defaults (0.6s, stagger 0.12) and let the Evaluator verify ±0.1s tolerance.
3. **Hero h1 font-size** may be responsive (Framer uses fluid type). Static showed 48px; confirm at 1440 vs 1920 live.
4. **Button double-text** (hover swap) — guide §4 warns; clone will render single text node + CSS hover for arrow, dedup verified in source (`Get Started Free` appears 2× per button).
5. **Blog section** — clone_guide_v2.md §3 scope lists nav/hero/how-it-works/features/pricing/footer; the live page also has RealtimeCards, Stats, Comparison, Testimonial, FAQ, Blog, FinalCTA. **Question:** clone the full page (recommended for pixel fidelity) or only the 6 sections in the guide's scope? Default: clone full page.
6. **Pricing** — live shows Starter $29 + Pro $49 (2 tiers, not 3). The 101 doc assumed 3 tiers. **Will match live (2 tiers).**

## 10. References
- Live site: `https://clario.framer.website/`
- Raw HTML dump: `team-log/clario_raw.html` (862 KB)
- Fetched content doc: `a37a3031.md` (DOC_DIR) — full text + all `framerusercontent.com` image URLs
- Listing: `b90bbcb8.md` (DOC_DIR)
- Screenshots dir: `team-log/screenshots/clario/` (created, empty — pending browser-use worker)

---

## Response to Evaluator

Read `team-log/test_plan.md` in full. Acknowledging findings + binding engineer decisions; updating this plan accordingly. **No clone code written.**

### Confirmed corrections

1. **Realtime section = 4 cards, not 2.** Live Clario "See your money in real time, clearly." has **4 cards**: `Smart Dashboard` / `Cashflow Overview` / `Spending Breakdown` / `Savings Goal`. The deep-ref doc (clone_landing_page_101.md §3.3) was wrong; live truth wins.
   - **Plan §1 updated:** RealtimeCards = 4 cards, not "2-card row."
   - **Plan §5 updated:** `RealtimeCards.tsx` renders a 4-card grid; will extract live `grid-template-columns` via sniper to match Clario's exact grid.
   - V10 (count + grid-template-columns string-equal) is the acceptance bar.

2. **Full-page scope (all 13 sections).** Engineer decision: clone every section, not just the 6 in clone_guide_v2.md §3. Confirmed sections: Navbar, Hero, RealtimeCards (4), HowItWorks (3 steps), Stats (Trusted-by / $1.2M+), Features (6), Comparison (Other Tools vs Clario, 5 rows each), Testimonial (Danielle M.), Pricing (Starter / Pro-POPULAR / Team), FAQ (6, Q01–Q06), Blog (4 posts), FinalCTA, Footer.

3. **Pricing = 3 cards, 2 priced tiers.** Starter `$29/month` + Pro `$49/month` (POPULAR badge) + Team card (`Trusted by teams worldwide` — invite-team copy, no price figure). My earlier "2 tiers" wording was imprecise; corrected to **3 cards, 2 priced**. V12 (count + labels exact) is the bar. Pricing toggle Monthly/Yearly present; R6 requires it functional — will verify live whether Clario actually switches values (sniper step).

4. **Golden-truth copy = byte-exact.** Structural phase renders Clario's verbatim fintech copy from test_plan §0, including the em-dash **U+2014** in:
   - `Take control of your finances — with clarity` (hero h1)
   - `All your money insights, finally in one place — track income, spending, and reach your goals with ease.` (subhead)
   - `Sync all your bank accounts, credit cards, and wallets — securely and instantly.` (step 1 desc)
   - `Clario helps users save more — and spend smarter.` (stats)
   Will use the actual U+2014 character in source (not `-` or `&mdash;`-encoded entities that may render differently). §3.2 em-dash assertion noted.

5. **Anti-premature-swap gate (§3.1).** Before structural ACCEPT, `src/` must contain **zero** matches on: `hospital|pharmacy|HMIS|stockout|Bayana|Nairobi|branch` and `#0F6E5C|#1D4ED8|teal`. Clario green (`#8cff2e`) must be present in computed styles on CTA + step-pill during Phase 3/4. No hospital mockups until Phase 5.

### Token corrections from re-reading test_plan.md

| Token/area | My plan §3 said | test_plan §4 asserts | Correction |
|---|---|---|---|
| Hero h1 size | 48px (static) | ±1px, but responsive at 1440 vs 1920 unconfirmed | **Will confirm live via sniper at both viewports** — may be fluid type. Static 48px is starting point only. |
| Realtime grid | (not specified) | `grid-template-columns` string-equal (V10) | **New token to extract:** live `grid-template-columns` on the 4-card container. |
| Features grid | (not specified) | `grid-template-columns` string-equal (V11) | **New token to extract:** live features grid columns. |
| Pricing layout | (not specified) | `grid-template-columns` string-equal | **New token to extract:** live pricing grid columns (3 cards). |
| Card gap (3-step) | 20px | gap equal across cards (V7) ±4px | 20px stands as starting point; confirm live. |
| Animation duration | 0.6s (101-doc default) | ±0.1s, 30fps frame-count fallback | **Must capture live ms timings** — Framer computes in JS runtime; static HTML had none. Will record first-12s at 30fps and extract opacity-cross-0.5 timestamps per element. |
| Shadow string-equality | verbatim stacks listed | exact string-equal incl. all layers (§4) | My §3.4 stacks stand; will re-confirm no layers dropped. |
| Focus ring | `0px 0px 0px 4px rgb(23,23,23)` | (not explicitly in test_plan §4) | Keep; low risk. |
| Nav height/padding-x | (not extracted) | ±2px (V2) | **New token to extract:** live nav height + padding-x. |
| Hero element gaps | (not extracted) | ±4px per pair (V3) | **New token to extract:** live y-offsets between badge→h1→subhead→CTA→mockup. |

### Build-phase first step (per engineer decision)

Per the capability-gap resolution: I am a browser-use worker. **Before any clone code**, as the first build-phase step I will:
1. **Screenshot matrix** → `team-log/screenshots/clario/`:
   - `1440x1400_initial.png`, `1440x1400_settled.png`
   - `1920x1200_initial.png`, `1920x1200_settled.png`
   - `390x844_initial.png`, `390x844_settled.png`
   - Initial = entrance animation mid-flight (capture ASAP after load); settled = 10s after load.
2. **Live sniper pass** (clone_landing_page_101.md §5 scripts) on `https://clario.framer.website/`:
   - Hero h1 computed style (family/size/weight/letter-spacing/line-height) — at 1440 AND 1920 to detect fluid type.
   - CTA button (bg/color/radius/padding/box-shadow) + nav buttons (Waitlist outline / Contact filled).
   - 3-step cards (rect + computed: radius/shadow/padding/gap) + step-pill (bg/radius/padding/font-size).
   - Realtime 4-card container `grid-template-columns` + per-card rect.
   - Features grid `grid-template-columns`.
   - Pricing grid `grid-template-columns` + Pro "POPULAR" badge computed style.
   - Nav height + padding-x + link font-size/weight.
   - Hero element y-offsets (badge→h1→subhead→CTA→mockup) via `getBoundingClientRect`.
   - Footer structure.
3. **Animation scanner** (§4) + **timing capture**: run the `data-framer-appear-id` scanner; screen-record first 12s at 30fps at 1440×1400; extract per-element opacity-cross-0.5 timestamps. Also scroll-trigger test on HowItWorks (record card fade-in as section crosses ~80% viewport).
4. Store all live-extracted tokens as `team-log/tokens/clario_baseline.json` (matches test_plan §4 method) for the Evaluator's diff.
5. **Then** scaffold + build structural clone using the live-confirmed tokens (correcting any static-extracted value that disagrees).

### Questions for engineer (pre-contract)

- **Pricing toggle behavior:** test_plan R6 requires the Monthly/Yearly toggle to be functional, but notes "if Clario does; verify live." I'll verify during the sniper pass. If Clario's toggle is non-functional/decorative, should the clone match (decorative) or implement working toggle? **Default:** match Clario's actual behavior (verify first, mirror it).
- **FAQ accordion:** test_plan §7 flags FAQ/blog/sections not in §1.2 matrix as a plan risk. Live Clario FAQ appears as a numbered list (Q01–Q06), not necessarily an accordion. I'll confirm structure during sniper and build to match. If it's a static list (no expand/collapse), clone = static list.
- **Blog post links:** live blog cards link to `/blog/...#post`. Structural clone — should links be live (to Clario's blog) or `#` placeholders? **Default:** `#` (no external navigation from the clone); confirm.
