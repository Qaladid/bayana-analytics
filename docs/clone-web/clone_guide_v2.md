# Bayana Analytics Clone Guide v2

> **TL;DR:** Two-worker setup (Builder + Evaluator, both MiniMax M3, browser-use mode), discover Clario before you build, reverse-engineer everything pixel-level, write a plan, implement in one sprint, then swap copy + palette to Bayana Analytics.
> **Deep reference:** `clone_landing_page_101.md` — consult this whenever you're stuck on exact structure/tokens.
> **Target:** Clario (Framer SaaS & Fintech Dashboard Template) — `https://www.framer.com/marketplace/templates/clario/`
> **Output:** Bayana Analytics landing page — a data-pipeline SaaS for Nairobi hospital/pharmacy SMEs.
> **Project path:** `~/projects/bayana-analytics` (WSL, native filesystem — never `/mnt/c/...`)

---

## 0. The One Rule That Matters Most

Clone Clario **exactly** — animation, layout, spacing, typography hierarchy, effects, pixel level — first.
Only AFTER the structural clone is verified correct do you swap:
- **Copy** → Bayana Analytics content (see Section 3 of `clone_landing_page_101.md` for the full copy map)
- **Color palette** → calm teal/blue healthcare palette instead of Clario's dark/green fintech palette
- **Icons/mockups** → hospital dashboard + AI chatbot visuals instead of bank/spending mockups

Do not mix these steps. A builder that starts "healthcare-izing" copy while still trying to match pixel positions will get both wrong. Structure first, brand second.

---

## 1. Worker Setup

Two **browser-use workers**, both on **MiniMax M3**, orchestrated by the Engineer (adal's supervisor, currently GLM-5.2). They are NEVER the same worker — the Builder cannot evaluate its own output.

### Worker 1 — Builder (Browser-Use, MiniMax M3): Discovery + Coding

```
adal_worker_start(
  work_dir="~/projects/bayana-analytics",
  command=["adal", "--yolo", "--model", "minimax-m3", "--agent-mode", "browser-use"],
  launch_mode="attach",
  alias="builder"
)
```

**Mandatory setup gate:** confirm the Builder is in `browser-use` mode on `minimax-m3` before delegating any discovery, design, or build work.

**Role:** Navigates to Clario's live preview, screenshots the matrix, extracts CSS/fonts/assets via `javascript_tool`, analyzes entrance/scroll animations, scaffolds and builds the Bayana clone. Sees and writes code.

### Worker 2 — Evaluator (Browser-Use, MiniMax M3): Adversarial Visual Verification

```
adal_worker_start(
  work_dir="~/projects/bayana-analytics",
  command=["adal", "--yolo", "--model", "minimax-m3", "--agent-mode", "browser-use"],
  launch_mode="attach",
  alias="evaluator"
)
```

**Mandatory setup gate:** the Evaluator is a DIFFERENT session from the Builder, adversarial prompt. It never builds; it only proves the clone correct or broken.

**Role:** After the Builder reports "done," opens Clario live + the Bayana clone in separate tabs, screenshots both at every required viewport, compares positions/colors/fonts/animation timing/content verbatim, reports every failure with severity + file/line. Belief: "this clone is broken — prove it." Never rubber-stamps.

### Critical iteration rule

**This is too slow if you babysit every step.** Allow the Builder to iterate as much as it can, on its own, to reach the terms agreed in `team-log/contract.md`. The Evaluator only steps in **after** the Builder has declared its own work "perfect" / done. Do not interrupt the Builder mid-loop with manual review. Run in auto mode, time-boxed (recommend 15–20 min per sprint), and only intervene if it stalls past 5 rounds without reaching ACCEPT.

---

## 2. Planning Contract (before any clone code)

1. **Builder** investigates Clario + discovery findings, writes `team-log/builder_plan.md` (implementation approach, files to touch, component breakdown, font/animation strategy, build validation, questions).
2. **Evaluator** studies Clario + discovery, writes `team-log/test_plan.md` (visual fidelity matrix, animation verification, content-exactness-during-structure-phase, design-token assertions, responsive edge cases).
3. **Engineer** mediates — sends each plan to the other worker for critique, adjudicates disagreements, writes the final `team-log/contract.md` with status `Approved to Build`.
4. **Builder** may start coding only once the contract is accepted. The Evaluator evaluates only after the Builder reports done.

Canonical files live in `team-log/`: `builder_plan.md`, `test_plan.md`, `contract.md`, `eval_round_N.md`. Do not invent other variants.

---

## 3. The Process — 5 Phases

### Phase 1: Visual Discovery on Clario (10 min)

1. **Find the live preview URL.** The marketplace listing page (`framer.com/marketplace/templates/clario/`) is NOT the live template — it's a static screenshot gallery. Find and click the expand/preview icon on the listing to open Clario's actual live interactive site. Use that URL for everything below.

2. **Screenshot Matrix**

   | Viewport | Purpose | Required? |
   |---|---|---|
   | `1440×1400` | Primary desktop comparison | Always |
   | `1920×1200` | Detects centering/max-width issues | Always |
   | `390×844` | Mobile hero/nav behavior | Always |
   | Initial-load capture | Entrance animation (appear effects) | Always — Clario has "Appear Effects" and "Scroll Effects" per its listing |
   | Settled screenshot, 8–12s later | Final resting layout | Always |

3. **Extract Design Tokens** via targeted `javascript_tool` calls — never dump full `getComputedStyle`. Cover: nav (bg, height, padding, link styles), hero headline/subheadline typography, buttons (bg, text, radius, padding, box-shadow verbatim), the 3-step "How it works" cards (card bg, radius, shadow, step-pill styling, mockup image treatment), pricing cards, footer.

4. **Extract Assets** — logo mark, mockup card images/illustrations in hero and step cards, icon set, any background gradients/glows.

5. **Animation Detection** — run the full animation scanner (CSS animations, canvas, video, SVG, Lottie, GSAP, Framer appear elements) documented in `clone_landing_page_101.md` Section 4. Clario is Framer-native, so expect `data-framer-appear-id` entrance animations and CSS scroll-triggered fades — confirm before assuming.

### Phase 2: Write the Clone Plan (5 min)

Create `docs/clone_plan.md`:

```markdown
# Clone Plan: Clario → Bayana Analytics

## Target
- Live URL: [found in step 1]
- Scope: full landing page (nav, hero, "how it works" 3-step, features, pricing, footer)
- Viewports: 1440×1400, 1920×1200, mobile 390×844

## Tech Stack Discovery
- Framework: Framer (confirmed)
- Animation: Appear Effects + Scroll Effects (confirmed via listing metadata)
- Fonts: [extracted]

## Design Tokens (structural clone — Clario's actual values)
- Colors: [Clario's dark bg + green accent, list hex]
- Typography: [nav, h1, body specs]
- Layout: [container width, section heights, gaps]

## Brand Swap Plan (applied AFTER structural clone passes)
- Palette: Clario dark/green → Bayana teal/blue (see clone_landing_page_101.md Section 3)
- Copy: Clario fintech copy → Bayana Analytics copy (see clone_landing_page_101.md Section 3)
- Mockups: bank/spending card UIs → hospital dashboard + AI chatbot mockups

## Implementation Plan
1. Scaffold Next.js + TypeScript + Tailwind
2. Build Navbar
3. Build Hero (headline, subheadline, CTA, dashboard mockup)
4. Build "How it works" 3-step section
5. Build Features grid
6. Build Pricing
7. Build Footer
8. Integrate entrance/scroll animations (Framer Motion)
9. Structural comparison against Clario (Evaluator)
10. Brand swap pass (palette + copy)
11. Final comparison against Bayana spec
```

### Phase 3: Build — Structural Clone (15–20 min)

1. **Scaffold** — Next.js 16 + TypeScript, Tailwind CSS
2. **Build Components** — Navbar, Hero, HowItWorks (3-step cards), Features, Pricing, Footer, using Clario's exact extracted tokens
3. **Integrate Animation** — Framer Motion entrance stagger + scroll-triggered fades matching Clario's Appear/Scroll Effects
4. **Center Layout** — always `max-w-[Xpx] mx-auto`, never fixed margins

### Phase 4: Structural Compare & Polish — EVALUATOR'S JOB

The Builder does NOT self-evaluate. After the Builder reports "done" (build + lint pass, files listed), the Evaluator owns this phase.

1. Side-by-side comparison — Clario live vs. local Bayana clone (still using Clario's palette/copy at this stage — brand swap comes after)
2. Compare all required viewports
3. Measure pixel differences via `javascript_tool`
4. Report failures in `team-log/eval_round_N.md` — pass/fail per criterion, severity, evidence, file+line
5. Iterate: Engineer sends failures to Builder → Builder fixes → Evaluator re-verifies → repeat until ACCEPT

**Builder rule:** "Do NOT self-evaluate, do NOT write eval reports, do NOT judge visual fidelity. Run build + lint, report files changed. Evaluation is the Evaluator's job."

### Phase 5: Brand Swap Pass (after structural ACCEPT only)

1. Builder applies the palette swap (Section 3 of the deep reference doc) — teal/blue instead of Clario's dark/green
2. Builder applies the full copy swap (nav labels, hero headline/subheadline, 3-step content, features, pricing, footer) per the copy map
3. Builder swaps mockup imagery — hospital dashboard + chatbot bubble instead of bank cards/spending charts
4. Evaluator re-checks: does the brand swap preserve the exact structural fidelity from Phase 4? (positions, spacing, animation timing must be unchanged — only colors/copy/images differ)
5. Evaluator writes final `team-log/eval_round_FINAL.md` with ACCEPT/REJECT

---

## 4. Key Gotchas (Framer-specific, apply to Clario)

- **Text styles are deeply nested** — use TreeWalker to find the real styled node, not the outer element
- **Logos/icons are often CSS `background-image` data-URIs**, not `<img>` tags
- **Buttons may render text twice** for hover swap animations — dedupe in your clone
- **`getComputedStyle` on outer elements shows browser defaults**, not the real style
- **Never use fixed margins** — use `max-w-[Xpx] mx-auto` for centering
- **The step-card mockup images** (card UI, chart UI, progress-bar UI in Clario's "How it works" section) are illustrative product mockups — recreate as simple styled divs/SVG, don't try to rip them as complex assets

---

## 5. Deployment Checklist

- [ ] Structural clone matches Clario at 1440×1400, 1920×1200, 390×844
- [ ] Brand swap applied (teal/blue palette, Bayana copy, hospital/AI mockups)
- [ ] `npm run build` passes, zero type errors
- [ ] Committed and pushed to `github.com/Qaladid/bayana-analytics`
- [ ] No lorem ipsum / TODO placeholders anywhere
- [ ] `BUILD-LOG.md` summarizing what was built + checklist pass/fail

---

## 6. Quality Checklist (Evaluator-owned)

**Structural (Phase 4)**
- [ ] Nav structure matches (links, logo position, button styles)
- [ ] Hero layout, headline/subheadline hierarchy, CTA position match
- [ ] "How it works" 3-step card layout, step-pill styling, spacing match
- [ ] Entrance/scroll animations play and match timing
- [ ] Mobile layout matches or is explicitly reasoned about

**Brand Swap (Phase 5)**
- [ ] Palette is teal/blue throughout — no leftover Clario green/dark
- [ ] All copy is Bayana Analytics content — no leftover fintech language
- [ ] Mockups show hospital dashboard / AI chatbot, not bank cards
- [ ] Structural fidelity (positions, spacing, animation) unchanged from Phase 4 ACCEPT
