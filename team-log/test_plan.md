# Evaluator Test Plan — Clario → Bayana Analytics Clone

> **Phase:** Planning (clone_guide_v2.md Section 2). No clone exists yet — this document defines how the clone will be *proved* broken or correct.
> **Evaluator belief:** *This clone is broken — my job is to prove it.* Never rubber-stamps.
> **Live reference URL:** https://clario.framer.website/ (interactive site; the marketplace listing is a static gallery — do NOT use it for comparison).
> **Canonical screenshots:** captured by Evaluator at 1440×1400, 1920×1200, 390×844, initial-load (entrance anim) + settled (8–12s). Stored under `team-log/screenshots/clario/`.

---

## 0. Golden Truth — Clario's Verbatim Live Content (captured 2026-07-06)

Structural-phase copy MUST match this byte-for-byte. These strings are the acceptance bar before any brand swap.

| Section | Verbatim copy |
|---|---|
| Nav links | How it works / Features / Pricing / Blog |
| Nav buttons | Waitlist (outline) / Contact (filled green) |
| Hero badge | `All-in-One Finance Toolkit` |
| Hero h1 | `Take control of your finances — with clarity` |
| Hero subhead | `All your money insights, finally in one place — track income, spending, and reach your goals with ease.` |
| Hero CTA | `Get Started Free` |
| How-it-works header | `How Clario works` (with `Watch video` link) |
| Step 1 | `Connect your accounts` / `Sync all your bank accounts, credit cards, and wallets — securely and instantly.` |
| Step 2 | `Track your money` / `See where your money goes with real-time spending insights and clear breakdowns.` |
| Step 3 | `Set goals & stay on track` / `Plan your savings, set monthly budgets, and let Clario keep you in control.` |
| Step pills | `Step 1`, `Step 2`, `Step 3` (green pill) |
| Real-time section h2 | `See your money in real time, clearly.` |
| Real-time cards | `Smart Dashboard` / `Cashflow Overview` / `Spending Breakdown` / `Savings Goal` (4 cards, not 2 — deep-ref doc was wrong) |
| Social proof | `Trusted by 3k+ Freelancers` / `$1.2M+ Saved` / `Clario helps users save more — and spend smarter.` |
| Features h2 | `Designed for clarity, built for better money decisions` |
| Features (6) | Multi-account sync / Goal tracking / Custom categories / Weekly reports / Spending limits / Secure & private |
| Comparison h2 | `There's a smarter way to manage money` (Other Tools vs Clario, 5 rows each) |
| Testimonial | `Loved by individuals and small teams` + Danielle M. quote |
| Pricing h2 | `Simple plans.` |
| Pricing copy | `Straightforward pricing with no hidden costs. Everything you need to manage your money better.` |
| Pricing toggle | Monthly / Yearly |
| Starter | `$29/month` — Track income & expenses; Connect up to 2 accounts; Monthly reports; Smart alerts |
| Pro | `$49/month` — Unlimited accounts; AI spending insights; Custom alerts; Advanced reporting (POPULAR) |
| Team plan | `Trusted by teams worldwide` — Invite your team, sync accounts in real time, and track shared goals with ease. |
| FAQ | 6 items, Q01–Q06 (see live capture) |
| Blog | `Explore the blog` + 4 posts |
| Final CTA | `Ready to manage your money smarter?` / `Start your journey to smarter spending and better saving — it only takes 2 minutes.` |

> ⚠️ **Deep-ref doc discrepancy (log this):** `clone_landing_page_101.md` §3.3 says two-column cards. Live Clario has **4 cards** (Smart Dashboard, Cashflow Overview, Spending Breakdown, Savings Goal). The live capture is canonical; the deep-ref doc is advisory. Builder must match live = 4 cards.

---

## 1. Visual Fidelity Matrix

### 1.1 Viewports & capture protocol
- **1440×1400** — primary desktop comparison (full-page, not just viewport).
- **1920×1200** — detects max-width centering + extra horizontal bleed.
- **390×844** — mobile: nav collapse, hero stack, card stack.
- **Two captures per viewport:** (a) initial-load frame (entrance animation mid-flight), (b) settled state 10s after load.
- Both Clario live and the local clone captured at identical viewport + devicePixelRatio. Same machine, same Chrome version, no browser extensions, default font rendering.

### 1.2 Per-section criteria (structural phase — Clario palette/copy still in place)

| # | Section | Criterion | Measurement method | Pass threshold | Fail severity |
|---|---|---|---|---|---|
| V1 | Nav | Logo position (left), link order, 2-button pattern (outline + filled) | DOM query + screenshot diff | Order exact; button count exact | High |
| V2 | Nav | Nav height, padding-x, link font-size/weight | `getComputedStyle` on Clario vs clone | ≤2px / ≤0.1px font | Med |
| V3 | Hero | Vertical rhythm: badge→h1→subhead→CTA→mockup, gaps between | `getBoundingClientRect` y-offsets, compare delta | gap delta ≤4px per pair | High |
| V4 | Hero | h1 typography (family, size, weight, letter-spacing, line-height) | computed style on real styled node (TreeWalker, not outer div) | exact equality on family/weight; size ±1px; letter-spacing ±0.01em | High |
| V5 | Hero | CTA button bg, color, radius, padding, box-shadow | computed style + pixel rect | radius/padding/shadow string-equal; size ±2px | High |
| V6 | Hero | Mockup card: width, height, radius, shadow, position-center | rect + computed | width/height ±4px; radius exact; shadow string-equal | Med |
| V7 | How-it-works | 3 cards, equal size, equal gap, equal radius, equal shadow | rect per card; compare deltas | size delta ≤2px between cards; gap equal | High |
| V8 | How-it-works | Step pill: bg color, shape (radius), padding, font-size | computed style on pill node | exact on radius/padding; color hex-equal | High |
| V9 | How-it-works | Step mockup image: aspect ratio, corner radius, position in card | rect + computed | ratio ±2%; radius exact | Med |
| V10 | Real-time | **4 cards** (not 2), grid layout matches Clario | count via DOM query; grid-template-columns computed | count exact; columns string-equal | High |
| V11 | Features | Grid count (6), icon→headline→desc hierarchy per card | count + computed font-sizes | count exact; sizes ±1px | High |
| V12 | Pricing | 3 cards (Starter / Pro-POPULAR / Team), toggle Monthly/Yearly present | count + text content | count + labels exact | High |
| V13 | Pricing | Pro card "POPULAR" badge present and styled | DOM + computed | present + visible | Med |
| V14 | Footer | logo, repeated nav, social icons, copyright | DOM structure + text | all present | Med |
| V15 | Full-page | Overall pixel diff vs Clario settled screenshot | perceptual diff (e.g. pixelmatch) at matched viewport | ≤5% diff on desktop (1440), ≤8% mobile — excludes intentionally different assets | High |

### 1.3 Pass/Fail gate (structural ACCEPT)
- **ACCEPT** = zero High-severity fails, ≤2 Med-severity fails with documented justification.
- **REJECT** = any High-severity fail, OR ≥3 Med fails, OR any premature brand swap detected (see §3).

---

## 2. Animation Verification

### 2.1 Mechanism (confirmed via scanner on live Clario)
- Expected: `data-framer-appear-id` elements > 0 (Framer Appear Effects) + CSS scroll-triggered transitions (Scroll Effects per listing metadata).
- Evaluator will re-run the animation scanner from `clone_landing_page_101.md` §4 on **both** Clario live and the clone; the clone must exhibit an equivalent entrance + scroll mechanism (Framer Motion `whileInView` / stagger is acceptable).

### 2.2 Entrance stagger timing (±0.1s tolerance)
| Element | Expected Clario behavior | Acceptable clone delta |
|---|---|---|
| Hero badge | fade+slide-up, first to appear | start time ±0.1s |
| Hero h1 | fade+slide-up, after badge | stagger delta vs badge ±0.1s |
| Hero subhead | after h1 | ±0.1s |
| Hero CTA | after subhead | ±0.1s |
| Hero mockup | last in hero | ±0.1s |
| How-it-works cards | scroll-triggered, staggered per card as section enters viewport | per-card stagger ±0.1s; scroll trigger fires when section ≥ visible-threshold |

**Capture method:**
1. Hard reload (cache cleared) at each viewport; screen-record the first 12s at 30fps.
2. Extract frame timestamps for each element's opacity crossing 0.5 (half-faded-in) — use the recording frame analysis.
3. Compare clone timestamps to Clario timestamps; ±0.1s is pass.

### 2.3 Scroll-triggered fades
- Slow-scroll the How-it-works section into view; record.
- Each of the 3 cards must begin fading in as it crosses ~80% viewport-from-bottom, staggered, not all-at-once.
- **Fail:** cards appear instantly (no fade), cards all fade simultaneously (no stagger), cards fade before triggered (premature), or cards never animate (stuck at opacity 0).

### 2.4 Settled-state check
- After 10s, every animated element must be at final state (opacity 1, transform none). Stuck mid-animation = fail.

---

## 3. Content-Exactness-During-Structure-Phase

> Rule: during Phase 3/4 the clone carries **Clario's verbatim fintech copy** (see §0 golden truth). Brand swap is Phase 5 only.

### 3.1 Anti-premature-healthcare-izing checks (run during structural eval)
| Check | Method | Fail condition |
|---|---|---|
| No Bayana copy leaks early | `grep -riE "hospital\|pharmacy\|HMIS\|stockout\|Bayana\|Nairobi\|branch" src/` | any match before structural ACCEPT |
| No teal/blue palette early | `grep -riE "#0F6E5C\|#1D4ED8\|teal" src/` (Clario uses green) | any match before brand-swap phase |
| Clario copy present verbatim | string-match each golden-truth row against rendered DOM | any mismatch |
| Clario green accent present | computed style on CTA + step-pill = Clario green hex | green absent = fail (proves premature swap) |
| No hospital mockups early | screenshot diff of mockup region vs Clario | imagery differs before Phase 5 = fail |

### 3.2 Verbatim copy assertion
For each golden-truth string in §0, run a DOM text-content query on the clone and assert byte-equality (case + punctuation + em-dash vs hyphen). Em-dash `—` is common; assert it is U+2014, not `-`.

---

## 4. Design-Token Assertions

Tokens to assert via `getComputedStyle` on the **real styled node** (TreeWalker to skip Framer placeholder shims). Clario live = source of truth; clone must match within tolerance.

| Token group | Specific tokens | Tolerance |
|---|---|---|
| Colors | body bg, hero bg, card bg, CTA bg, CTA text, step-pill bg, h1 color, body text, nav link color, nav button outline color | hex-equal (structural phase) |
| Type scale | h1, h2, h3, body, nav-link, step-pill, button font-size; h1/h2/h3 font-weight; h1 letter-spacing; h1/h2 line-height | size ±1px; weight exact; letter-spacing ±0.01em; line-height ±0.05 |
| Font family | root `--font-sans` resolved family (not the Framer "Placeholder" shim) | exact-equal family name |
| Spacing | section padding-y, section padding-x, container max-width, card gap, hero element gaps, nav padding-x | ±4px; container max-width exact |
| Radii | CTA radius, step-pill radius, card radius, mockup radius, nav-button radius | exact (string-equal) |
| Shadows | CTA box-shadow, card box-shadow, mockup box-shadow, nav shadow (if any) | exact string-equal (Framer shadows are multi-layer; clone must match all layers) |
| Layout | hero max-width, section max-width, grid-template-columns (features, real-time, pricing) | exact string-equal |

**Method:** run sniper scripts from `clone_landing_page_101.md` §5 on Clario live → store as `team-log/tokens/clario_baseline.json` → run same scripts on clone → diff. Any token outside tolerance = fail with file+line.

---

## 5. Responsive Edge Cases

| # | Case | Viewport | Pass criterion |
|---|---|---|---|
| R1 | Nav collapse | 390×844 | Desktop nav links hidden; hamburger/mobile menu present OR links stack; no horizontal overflow |
| R2 | Hero stack | 390×844 | Badge→h1→subhead→CTA stack vertically (single column); mockup below, full-width-ish; no clipping |
| R3 | Card stack | 390×844 | How-it-works 3 cards stack 1-col; real-time 4 cards stack; features stack; pricing stacks |
| R4 | Max-width centering | 1920×1200 | Content centered with equal left/right gutter; no left-bleed; gutter matches Clario's (computed margin auto) |
| R5 | No horizontal scroll | all | `document.documentElement.scrollWidth ≤ viewport width` |
| R6 | Pricing toggle functional | 390 + 1440 | Monthly/Yearly toggle switches values (if Clario does; verify live) |
| R7 | Touch target sizes | 390×844 | CTAs ≥44×44px |

---

## 6. Brand-Swap-Phase Checks (Phase 5 — after structural ACCEPT)

Run only after structural ACCEPT. Compare against structural-ACCEPT snapshot.

| # | Check | Method | Fail |
|---|---|---|---|
| B1 | Zero leftover Clario green | `grep -riE "green\|#(0+[0-9a-fA-F]*[gG]|22C55E\|16A34A\|15803D\|4ADE80)" src/` + computed style scan | any green hex outside intentional retention (none expected) |
| B2 | Teal/blue everywhere accent was green | computed style on CTA, step-pill, any accent = teal `#0F6E5C` or blue `#1D4ED8` | wrong hex |
| B3 | All copy is Bayana's | string-match Bayana copy map (`clone_landing_page_101.md` §3) against rendered DOM; no fintech residue | any "finance/bank/account/spending/savings/Danielle/$29/$49" leftover |
| B4 | Mockups = hospital/AI | screenshot diff of hero mockup + step-card mockups; assert hospital dashboard, connector chips, chat bubble — not bank card/spending chart/progress bar | bank imagery present |
| B5 | Structural unchanged from ACCEPT | re-run §1.2 V1–V14 token + rect comparisons; deltas must be 0 (only color/copy/image differ) | any rect/radius/shadow/padding changed |
| B6 | Animation timing unchanged | re-run §2.2 timing capture; ±0.1s from structural-ACCEPT capture | drift >0.1s |
| B7 | No lorem/TODO/placeholder | `grep -riE "lorem\|TODO\|FIXME\|placeholder\|xxx" src/` | any match |
| B8 | Build passes | `npm run build` | any error |

---

## 7. Code-Review Risks (what would prove the plan broken)

| Risk | How detected | Why it matters |
|---|---|---|
| Builder hardcodes pixel margins instead of `max-w mx-auto` | `grep -nE "margin-left:\s*[0-9]|margin-right:\s*[0-9]" src/` ; inspect Tailwind classes for `ml-[0-9]`/`mr-[0-9]` without `mx-auto` | Breaks centering at 1920px (R4) |
| Builder self-evaluates / writes eval reports | check `team-log/` for eval_round_N.md authored by builder | Violates role separation; evals unreliable |
| Builder healthcare-izes early | §3.1 grep hits | Violates two-pass rule; both passes end up wrong |
| Builder uses Framer placeholder font family | computed `font-family` contains "Placeholder" | Wrong font renders; V4 fails |
| Builder copies Framer's hashed div-soup DOM verbatim | code review of components/ | Unmaintainable; likely brittle; guide §1 forbids |
| Builder rips mockup images as complex assets instead of recreating as styled divs/SVG | check `src/assets/media/` for ripped PNGs of step mockups | Guide §4 gotcha; brittle + heavy |
| Builder omits the 2 extra real-time cards (Spending Breakdown, Savings Goal) | DOM count query | Deep-ref doc was wrong (said 2); live has 4 — V10 catches |
| Builder skips animation (static) | §2 scanner shows 0 appear elements | Violates "video level" fidelity |
| Builder changes structural props during brand swap | B5 delta | Violates Phase 5 rule (only color/copy/image change) |
| Pricing toggle non-functional or values don't switch | R6 manual test | Broken UX |
| Evaluator rubber-stamps without screenshots | audit eval_round_N.md for screenshot evidence | Defeats adversarial role |

### What would prove *this test plan* broken
- A section exists on live Clario not covered in §1.2 matrix (e.g. blog index, FAQ accordion) → matrix incomplete → revise.
- A token Clario uses that isn't in §4 (e.g. gradient stops on a glow) → add it.
- The ±0.1s animation tolerance proves unmeasurable with available capture tooling → fall back to frame-count comparison at 30fps (3-frame tolerance).

---

## 8. Evaluation Workflow (per round)

1. Builder reports done → Engineer hands to Evaluator.
2. Evaluator captures Clario live + clone at all 3 viewports (initial + settled).
3. Evaluator runs §1.2 matrix, §2 animation, §3 anti-premature-swap, §4 token diff, §5 responsive.
4. Write `team-log/eval_round_N.md` with: pass/fail per criterion, severity, evidence (screenshot path + token diff + grep output), file+line for each fail.
5. Engineer sends fails to Builder; Builder fixes; Evaluator re-verifies → repeat until ACCEPT.
6. On structural ACCEPT → Builder does Phase 5 brand swap → Evaluator runs §6 → `team-log/eval_round_FINAL.md`.

---

## 9. Response to Builder (mediation round)

> Engineer: this section confirms the Builder's token list is covered by Evaluator assertions, notes tokens I will verify live independently, and flags risks in the Builder's animation-defaults approach. No clone evaluated yet.

### 9.1 Token coverage — Builder §3 vs Evaluator §4
Every token the Builder extracted is asserted by my §4 matrix. Cross-map:

| Builder token | Builder value | Evaluator assertion | Covered? |
|---|---|---|---|
| Page bg `#050505` | near-black | §4 Colors → body bg, hex-equal | ✅ |
| Alt dark `#0d0d0d` | card-dark bg | §4 Colors → card bg (dark variant) | ✅ |
| Green accent `#8cff2e` | CTA/pill/highlight | §4 Colors → CTA bg, step-pill bg; §3.1 anti-premature-swap (green must be present structurally) | ✅ |
| White `#ffffff` / off-white `#f8f8fa` / light `#f5f5f2` | surfaces | §4 Colors → card bg, body text | ✅ |
| Muted `#2f2f2f` / `#c8c8c0` | text/divider | §4 Colors → muted text | ✅ |
| Dark border `#171717` | ring | §4 Colors → nav button outline | ✅ |
| Secondary `#ffffffa6` | 65% white | §4 Colors → body text (add: assert rgba string-equal, not just hex) | ✅ (adding rgba assertion) |
| Inter font family | the real family behind the shim | §4 Font family → exact-equal, no "Placeholder" substring | ✅ |
| Hero h1 48px/700/-0.04em | type | §4 Type scale → size ±1px, weight exact, letter-spacing ±0.01em | ✅ |
| Full type scale (10–48px) | §3.2 table | §4 Type scale → all roles | ✅ |
| Container 1199px | max-width | §4 Spacing → container max-width exact | ✅ |
| Card radius 20px | radius | §4 Radii → exact string-equal | ✅ |
| CTA padding 12px 20px | padding | §4 (V5) → radius/padding exact | ✅ |
| Card shadow (7-layer rgba(23,23,23,*)) | verbatim stack | §4 Shadows → exact string-equal, all layers | ✅ |
| Green-glow shadow stacks | §3.4 | §4 Shadows → assert green-tinted stack on accent elements | ✅ (adding: separate assertion for green-shadow elements) |
| `data-framer-appear-id` (11+) | mechanism | §2.1 → scanner re-run, count + initial-transform match | ✅ |

**No gaps.** I am adding two refinements to §4: (a) assert the `#ffffffa6` secondary-text token as an rgba string (not hex-truncated), (b) add a dedicated assertion for the green-tinted shadow stack on accent elements so the Builder's §3.4 green-glow values are pinned.

### 9.2 Tokens I will verify live independently (do NOT trust static HTML)
The Builder extracted from SSR HTML — correct for structure, but Framer computes some values client-side. I will re-capture these on live Clario with my own sniper pass and treat the Builder's values as *claimed* until confirmed:

| Token | Why live-only | Method |
|---|---|---|
| Hero h1 font-size | Builder flags possible responsive/fluid type (§9 Q3) | sniper at 1440 AND 1920; assert both |
| Animation durations (ms) | Framer JS-computed, absent from HTML | run animation scanner (§2.1) on live Clario; capture `transition-duration` + `animation-duration` per appear element |
| Stagger timing | JS-computed | frame-capture method §2.2 — opacity-crossing-0.5 timestamps per element |
| Hover states (button arrow swap, link color) | not in SSR | manual hover + screenshot |
| Scroll-trigger thresholds | JS (Scroll Effects) | slow-scroll recording, note viewport-crossing % per card |
| Computed `grid-template-columns` for realtime/features/pricing | may differ from static if JS adjusts | live `getComputedStyle` on grid container |
| Box-shadow resolved value | Framer may merge/override layers at runtime | live `getComputedStyle().boxShadow` string vs Builder's §3.4 |

### 9.3 Risk in the Builder's animation-defaults approach
The Builder will use the 101-doc defaults (0.6s duration, 0.12 stagger, ease [0.25,0.46,0.45,0.94]) because Framer computes real timings in JS. This is a reasonable placeholder, but it carries a real risk I will enforce against:

| Risk | Impact | My mitigation |
|---|---|---|
| Defaults ≠ Clario's actual ms | Clone animates at wrong speed; "video level" fidelity claim fails | I capture Clario's real timings live (§2.2) and compare to the clone. If the clone's 0.6s/0.12 differs from Clario's captured value by >0.1s, that's a High fail — the Builder must retune to the captured value, not the doc default. **The doc default is a starting guess, not the acceptance bar.** |
| Initial transforms mismatched | Builder uses `y:30` (doc) but observed Clario uses `translateY(20/12/10/40px)` per tier (Builder §4) | Assert clone's initial y per element matches the Builder's *observed* values (20/12/10/40), not the doc's `y:30`. If Builder uses `y:30` everywhere, that's a Med fail. |
| Scroll-trigger threshold differs | Cards may fire too early/late vs Clario | Slow-scroll capture on both; compare trigger viewport-position. ±5% tolerance. |
| Easing curve assumption | Doc ease may not match Framer's actual cubic-bezier | Capture Clario's resolved `transition-timing-function`; assert string-equal. |
| Animation skipped on mobile | Builder may gate `whileInView` off at 390px | Assert §2 animation runs at all 3 viewports. |

**Bottom line for the contract:** the Builder may ship with doc defaults, but the acceptance bar is *my live-captured Clario timings*, not the doc. The Builder must be prepared to retune duration/stagger/initial-y if my round-1 eval shows drift >0.1s. I treat the doc defaults as unverified until my live scanner confirms them — if Clario's real values happen to equal the defaults, great; if not, the clone must match Clario, not the doc.

### 9.4 Other notes for the contract
- **4 realtime cards** — Builder confirms (§1 scope). My V10 already enforces count=4. ✅ aligned.
- **2 pricing tiers** (Starter $29 / Pro $49), not 3 — Builder matches live (§9 Q6). I will update V12 to assert 2 cards + the team-plan strip (Clario's "Trusted by teams worldwide" block is a 3rd pricing-area card, not a price tier). Builder: confirm you render the team strip as a 3rd block in the pricing section, structurally.
- **Full-page scope (13 sections)** — Builder will clone all. My §1.2 matrix covers nav/hero/realtime/how-it-works/features/pricing/footer at High severity; I will add Medium-severity criteria for Stats, Comparison, Testimonial, FAQ, Blog, FinalCTA in round 1 (structure + copy-exact, lighter token checks) so the full page is covered.
- **Button double-text dedup** — Builder aware (§9 Q4). I'll assert each button renders its label exactly once in the DOM (text-content count = 1) to catch a missed dedup.
- **Capability gap** — Builder session lacks browser-use (§9 Q1). That does not block my plan: I capture my own live references independently. The Builder's static tokens are a useful pre-flight, but my live sniper pass is the source of truth.

---

## 10. Summary of Key Verification Thresholds

- **Pixel diff:** ≤5% desktop (1440), ≤8% mobile (390) vs Clario settled screenshot.
- **Computed tokens:** radius/shadow/font-family exact; sizes ±1px; spacing ±4px; letter-spacing ±0.01em.
- **Animation timing:** ±0.1s per element start + stagger.
- **Copy:** byte-exact (incl. em-dash U+2014) to golden truth §0 during structural phase.
- **Anti-premature-swap:** zero matches on hospital/pharmacy/teal/Bayana grep before ACCEPT.
- **Brand-swap phase:** zero Clario green, zero fintech copy, structural delta = 0 from ACCEPT snapshot.
