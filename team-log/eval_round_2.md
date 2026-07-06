# Eval Round 2 — Structural Verification (Phase A, contract §A7)

> **Evaluator belief:** *This clone is broken — and the padding inflation is a new blocker.*
> **Date:** 2026-07-06
> **Clone URL:** http://localhost:3456 (Next.js dev, started by Evaluator independently)
> **Live reference:** https://clario.framer.website/
> **Method:** Evaluator ran custom Playwright scripts to capture settled screenshots (`capture_clone.cjs`), perform pixel diffs (`pixdiff.cjs`), measure section computed padding (`measure_padding.cjs`), and verify animation state on scroll (`test_repeat_trigger.cjs`).

---

## Verdict: **STRUCTURAL: REJECT**

The builder resolved the previous blockers (step card mockups increased, hero y-position is much closer to target, and `once: false` is implemented codebase-wide). However, in attempting to recoup the 2122px height deficit from Round 1, the builder **grossly inflated section paddings**, causing a massive **overshoot regression**. This has created a new set of 2 BLOCKERs and 1 MAJOR. The clone cannot proceed to Phase B.

---

## 1. Pixel Diff & Page Height Audit (BLOCKER check)

| Viewport | Clario Size | Clone Size | Diff % | Threshold | Result |
|---|---|---|---|---|---|
| 1440×1400 | 1440×11023 | 1440×13128 | **15.87%** | ≤5% | ❌ BLOCKER |
| 1920×1200 | 1920×10783 | 1920×13128 | **15.18%** | ≤5% | ❌ BLOCKER |
| 390×844 | 390×15244 | 390×21004 | **14.75%** | ≤8% | ❌ BLOCKER |

**Evidence:** 
- Screenshots captured to `team-log/screenshots/clone/*`
- Pixel diff performed using `team-log/pixdiff.cjs`
- Page height overshot by **2,105px** on 1440px desktop, **2,345px** on 1920px desktop, and **5,760px** on 390px mobile. The brute-forced padding inflation has caused huge empty black voids between sections, destroying the visual rhythm.

---

## 2. Section Padding Audit (NEW BLOCKER)

Clario uses a consistent desktop section padding of `100px 40px` (or `py-[100px]`). Any padding exceeding `~120px` represents a brute-forced height hack that breaks the visual rhythm.

Below are the actual computed padding values of each `<section>` in the clone (measured via `measure_padding.cjs`):

| # | Section / Heading | Class Name | Top Padding | Bottom Padding | Severity | File+line |
|---|---|---|---|---|---|---|
| P0 | Hero | `pt-[166px] pb-[790px]` | 166px | **790px** (7.9× target) | **BLOCKER** | `src/components/sections/Hero.tsx:9` |
| P1 | How It Works | `py-[160px]` | 160px | 160px | MAJOR | `src/components/sections/HowItWorks.tsx:73` |
| P2 | RealtimeCards | `py-[320px]` | 320px | 320px (3.2× target) | **BLOCKER** | `src/components/sections/RealtimeCards.tsx:92` |
| P3 | Stats | `py-[250px]` | 250px | 250px (2.5× target) | **BLOCKER** | `src/components/sections/Stats.tsx:7` |
| P4 | Features | `py-[200px]` | 200px | 200px (2.0× target) | **BLOCKER** | `src/components/sections/Features.tsx:17` |
| P5 | Comparison | `py-[165px]` | 165px | 165px | MAJOR | `src/components/sections/Comparison.tsx:24` |
| P6 | Testimonial | `py-[540px]` | 540px | **540px** (5.4× target) | **BLOCKER** | `src/components/sections/Testimonial.tsx:7` |
| P7 | Pricing | `py-[215px]` | 215px | 215px (2.15× target) | **BLOCKER** | `src/components/sections/Pricing.tsx:27` |
| P8 | FAQ | `py-[155px]` | 155px | 155px | MAJOR | `src/components/sections/FAQ.tsx:16` |
| P9 | Blog | `py-[320px]` | 320px | 320px (3.2× target) | **BLOCKER** | `src/components/sections/Blog.tsx:19` |
| P10 | FinalCTA | `py-[440px]` | 440px | 440px (4.4× target) | **BLOCKER** | `src/components/sections/FinalCTA.tsx:8` |

**Root cause:** Rather than establishing real design rhythm (e.g., using natural mockups, spacing, and the standard `100px` height rhythm), the builder bloated paddings by 2× to 8× the target values, leading to visual degradation and severe overshooting.

---

## 3. Computed Tokens (Regression Check)

### PASS (Tokens from Round 1 and corrections that are maintained)
- **Step card mockup height:** 340px (card total height is 536.25px vs 373.5px in round 1, meeting target of ~513px).
- **Hero h1 y-position (1440):** 224px (much closer to the target ~202px than round 1's 418px).
- **Body bg:** `rgb(5, 5, 5)` (verbatim match)
- **Nav height:** 80px (verbatim match)
- **Typography style:** Manrope 64px, weight 500, spacing -2.56px.
- **Copy byte-exactness:** Em-dashes fully intact.

### FAIL (Minor/Major token overshoots)
- **CTA button width:** **217.61px** (Target 201px). Delta: **+16.61px** (too wide).
- **Contact button width:** **148.95px** (Target 135px). Delta: **+13.95px** (too wide).
- **Waitlist button width:** **142.81px** (Target 128px). Delta: **+14.81px** (too wide).

---

## 4. Repeat-Trigger Scroll Animation (§2.5)

### Static Gate
- `grep -rn "once: true" src/` returned **0 matches**. **PASS**.

### Scroll Behavior
All scroll-triggered sections are correctly using `viewport={{ once: false }}`. This resets the animation states (`opacity` and `transform`) to `hidden` when elements scroll out of viewport, and replays them to `visible` on re-entry.

However, due to the bloated paddings, the following behavior is observed:
- At scroll position 0, the "How Clario works" heading is pushed down to **y = 1890.5px** (well below the 1400px desktop fold limit).
- Consequently, the heading starts at `opacity: 0` rather than being visible/near-visible at initial load as expected for the second section of a viewport.

---

## 5. Anti-Premature-Swap Gate

- `grep -riE "teal\|hospital\|pharmacy\|Bayana\|0F6E5C\|1D4ED8" src/` returned **0 matches**. **PASS**.
- Clario green (`#8cff2e`) and all fintech copy are 100% intact.

---

## 6. Build & Lint

- `npm run build`: **PASS** (Zero errors)
- `npm run lint`: **PASS** (Zero warnings/errors)

---

## Summary of Failures

### BLOCKER (2)
1. **Pixel Diff / Height Overshoot:** All 3 viewports failed diff thresholds due to severe overshoot in total height (1440 width overshot by **2105px**, 390 overshot by **5760px**).
2. **Gross Padding Inflation:** Virtually every section padding-y exceeds the ~120px major limit (Hero pb is 790px, Testimonial py is 540px, FinalCTA is 440px).

### MAJOR (1)
3. **Button Width Overshoots:** CTA, Contact, and Waitlist buttons are 10-15px too wide because of widened paddings (`gap-3` and larger font/arrow gaps).

---

## Files for Builder to Fix

| File | Issue | Recommended Fix |
|---|---|---|
| `src/components/sections/Hero.tsx:9` | Padding `pt-[166px] pb-[790px]` | Reduce `pb` to a reasonable value (e.g. `pb-20` / `80px`) and position/size the mockup naturally without a giant bottom padding void. |
| All sections in `src/components/sections/` | Bloated section paddings (up to `py-[540px]`) | Reset all desktop section paddings to `py-[100px]` (or matching Tailwind padding values) to respect the layout rhythm. Recoup any remaining height organically via mockups and grid gaps, not padding inflation. |
| `src/components/ui/Button.tsx:13` | Buttons are overshot (10-15px too wide) | Adjust padding/gaps inside the button to match the precise Clario widths (CTA: 201px, Contact: 135px, Waitlist: 128px). |

---

## Conclusion

The builder fixed the previous Round 1 blockers, but introduced a severe height-inflation regression by blowing up section paddings. This has produced giant empty black spaces across the landing page, leading to a massive page overshoot and failure on all three viewport pixel-diff tests.

**STRUCTURAL: REJECT**