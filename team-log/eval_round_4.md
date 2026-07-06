# Eval Round 4 — Structural Verification (Phase A, contract §A7)

> **Evaluator belief:** *Adversarial, rigorous, and exact verification — if the numbers fail, the verdict is REJECT.*
> **Date:** 2026-07-06
> **Clone URL:** http://localhost:3456 (Next.js dev, started by Evaluator independently)
> **Live reference:** https://clario.framer.website/
> **Method:** Evaluator ran custom Playwright scripts to capture settled screenshots (`capture_clone.cjs`), perform pixel diffs (`pixdiff.cjs`), measure section computed padding (`measure_padding.cjs`), and verify animation state on scroll (`test_repeat_trigger.cjs`).

---

## Verdict: **STRUCTURAL: REJECT**

While the builder has made noticeable improvements—recovering **523px** of content height organically (growing Hero, Testimonial, and Pricing, and adding the missing Blog descriptions)—**the page-height deficit is still a blocker**. The page height is **9411px** (Clario is **11023px**), leaving a **-1,612px** shortfall (14.6% short), which fails the hard pixel-diff and height thresholds on all viewports. 

Furthermore, 5 of the 13 sections still exceed the strict `±100px` height delta. 

The clone **cannot** proceed to Phase B and is **REJECTED**.

---

## 1. Pixel Diff & Page Height Audit (BLOCKER check)

| Viewport | Clario Size | Clone Size | Diff % | Threshold | Result |
|---|---|---|---|---|---|
| 1440×1400 | 1440×11023 | 1440×9411 | **6.02%** | ≤5% | ❌ BLOCKER |
| 1920×1200 | 1920×10783 | 1920×9411 | **10.26%** | ≤5% | ❌ BLOCKER |
| 390×844 | 390×15244 | 390×17615 | **14.18%** | ≤8% | ❌ BLOCKER |

- **Desktop (1440) Deficit:** **-1,612px (-14.62%)** short. (Target is within ±500px).
- **Mobile (390) Overshoot:** **+2,371px (+15.55%)** tall.

---

## 2. Per-Section Height Diagnostic

To guide the builder on where to grow section heights organically, we measured full-width container heights live on the clone and compared them directly to the Clario targets:

| Section | Clario px | Clone px | Delta px | Delta % | Status / Highlight (`|delta| > 100px`) |
|---|---|---|---|---|---|
| **Hero** | 1680.0px | 1234.5px | **-445.5px** | **-26.52%** | ❌ **BLOCKER (`\|delta\| > 100px`)** |
| **How It Works** | 852.8px | 892.25px | +39.45px | +4.63% | ✅ PASS |
| **RealtimeCards** | 972.8px | 844.0px | **-128.8px** | **-13.24%** | ❌ **BLOCKER (`\|delta\| > 100px`)** |
| **Stats** | 276.0px | 276.0px | 0px | 0.00% | ✅ PASS |
| **Features** | 974.6px | 895.0px | -79.6px | -8.17% | ✅ PASS |
| **Comparison** | 725.6px | 648.0px | -77.6px | -10.69% | ✅ PASS |
| **Testimonial** | 1341.2px | 947.75px | **-393.45px** | **-29.34%** | ❌ **BLOCKER (`\|delta\| > 100px`)** |
| **Pricing** | 1261.0px | 1054.0px | **-207.0px** | **-16.42%** | ❌ **BLOCKER (`\|delta\| > 100px`)** |
| **FAQ** | 861.4px | 957.5px | +96.1px | +11.16% | ✅ PASS |
| **Blog** | 1220.2px | 817.75px | **-402.45px** | **-32.98%** | ❌ **BLOCKER (`\|delta\| > 100px`)** |
| **FinalCTA** | 546.2px | 511.5px | -34.7px | -6.35% | ✅ PASS |
| **Footer** | 311.4px | 331.0px | +19.6px | +6.29% | ✅ PASS |
| **TOTAL** | **11023.2px** | **9411.25px** | **-1612.0px** | **-14.62%** | ❌ **BLOCKER** |

---

## 3. Structural Root Cause Analysis

### A. Hero Section (-445.5px) — BLOCKER
- While the dashboard mockup grew to the correct 578px layout size, the overall section height is still short. Gaps above and below the h1, subhead, and CTA buttons are too tight compared to Clario.

### B. Testimonial Section (-393.45px) — BLOCKER
- Even with quote line-height and margin increases, Clario uses extremely spacious layout containers with large padding buffers above/below the avatar and text blocks.

### C. Blog Section (-402.45px) — BLOCKER
- Although descriptions were successfully added, the blog card grid renders shorter. Clario's blog cards use wider aspect-ratio layout grids or have larger vertical padding-y on each post.

### D. Pricing Section (-207px) — BLOCKER
- The team plan strip has smaller heights and paddings, and the Monthly/Yearly toggle spacing is tightly packed.

### E. RealtimeCards Section (-128.8px) — BLOCKER
- The 4 realtime mockups/cards have smaller vertical dimensions and tighter grid margins.

---

## 4. Section Padding Audit

- **All section padding** is set to `py-[100px] px-10` (Hero `pb-[80px]`), which is correct per the design system tokens. No padding-y inflation was used to cheat the height.

---

## 5. Button Widths Audit (BLOCKER check)

Buttons remain wider than Clario's targets (failing the `±2px` threshold):

| Button | Target Width | Measured Width | Delta | Status |
|---|---|---|---|---|
| **CTA (Get Started Free)** | 201px | 208.81px | +7.81px | ❌ FAIL (failing ±2px) |
| **Contact** | 135px | 145.11px | +10.11px | ❌ FAIL (failing ±2px) |
| **Waitlist** | 128px | 138.41px | +10.41px | ❌ FAIL (failing ±2px) |

*Fix:* Change padding from `px-7` to `px-6` (24px padding-x) inside `Button.tsx`.

---

## 6. Repeat-Trigger Scroll Animation (§2.5)

- `grep -rn "once: true" src/` returned **0 matches**. **PASS**.
- Repeat-trigger scroll animations correctly reset and replay across all viewports.

---

## Summary of Failures

### BLOCKERs
1. **Pixel Diff:** Desktop viewport diff is **6.02%** (failing ≤5% threshold) due to an aggregate page shortfall of **1,612px**.
2. **Per-Section Heights:** 5 sections (Hero, RealtimeCards, Testimonial, Pricing, Blog) exceed the `±100px` height delta.
3. **Button Widths:** Buttons fail the `±2px` threshold.

---

## Detailed Action Plan for Builder

1. **Fix Buttons:** In `src/components/ui/Button.tsx`, change `px-7` to `px-6` (24px) to shave off exactly 8px from each button width.
2. **Expand Spacing on Hero:** Increase spacing around the Hero elements: increase `mt-16` on the mockup to `mt-24` and add larger vertical margins on the badge and h1.
3. **Expand Testimonial Gaps:** Add generous vertical gaps (using `my-10` / `my-12` or container padding) to the testimonial wrapper.
4. **Grow Pricing and RealtimeCards:** Increase card heights/mockups and add larger grid gaps inside these sections.
5. **Grow Blog Section:** Increase spacing above and below cards in the blog wrapper or expand the individual card padding.

**STRUCTURAL: REJECT**