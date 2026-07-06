# Eval Round 6 — Structural Verification (Phase A, contract §A7)

> **Evaluator belief:** *Adversarial, rigorous, and exact verification — if the numbers fail, the verdict is REJECT.*
> **Date:** 2026-07-06
> **Clone URL:** http://localhost:3456 (Next.js dev, started by Evaluator independently)
> **Live reference:** https://clario.framer.website/
> **Method:** Evaluator ran custom Playwright scripts to capture settled screenshots (`capture_clone.cjs`), perform pixel diffs (`pixdiff.cjs`), measure section computed padding (`measure_padding.cjs`), and verify animation state on scroll (`test_repeat_trigger.cjs`).

---

## Verdict: **STRUCTURAL: REJECT**

The builder successfully resolved the padding-inflation issues from Round 5 (removing the Hero and Testimonial empty voids) and implemented per-variant button padding (achieving a perfect match on CTA and Waitlist button widths!). The builder also grew Blog, Pricing, and Testimonial organically.

However, because the disguised padding voids were removed, **the overall page height dropped back down**, leaving the page **1,090px short** of Clario's 11,023px (exceeding the strict **±500px** target variance). Several section heights and all three viewports still exceed the strict contract gates. 

The clone **cannot** proceed to Phase B and is **REJECTED** until the remaining internal heights are grown organically.

---

## 1. Pixel Diff & Page Height Audit (BLOCKER check)

| Viewport | Clario Size | Clone Size | Diff % | Threshold | Result |
|---|---|---|---|---|---|
| 1440×1400 | 1440×11023 | 1440×9933 | **6.70%** | ≤5% | ❌ BLOCKER |
| 1920×1200 | 1920×10783 | 1920×9933 | **9.83%** | ≤5% | ❌ BLOCKER |
| 390×844 | 390×15244 | 390×18895 | **13.28%** | ≤8% | ❌ BLOCKER |

- **Desktop (1440) Deficit:** **-1,090px (-9.89%)** short. (Fails the strict **±500px** target variance).
- **Mobile (390) Overshoot:** **+3,651px (+23.95%)** tall.

---

## 2. Per-Section Height Table

| Section | Clario px | Clone px | Delta px | Delta % | Status / Highlight (`|delta| > 100px`) |
|---|---|---|---|---|---|
| **Hero** | 1680.0px | 1306.5px | **-373.5px** | **-22.23%** | ❌ **BLOCKER (`\|delta\| > 100px`)** |
| **How It Works** | 852.8px | 892.25px | +39.45px | +4.63% | ✅ PASS |
| **RealtimeCards** | 972.8px | 874.0px | -98.8px | -10.16% | ✅ PASS |
| **Stats** | 276.0px | 276.0px | 0px | 0.00% | ✅ PASS |
| **Features** | 974.6px | 895.0px | -79.6px | -8.17% | ✅ PASS |
| **Comparison** | 725.6px | 648.0px | -77.6px | -10.69% | ✅ PASS |
| **Testimonial** | 1341.2px | 1093.5px | **-247.7px** | **-18.47%** | ❌ **BLOCKER (`\|delta\| > 100px`)** |
| **Pricing** | 1261.0px | 1130.0px | **-131.0px** | **-10.39%** | ❌ **BLOCKER (`\|delta\| > 100px`)** |
| **FAQ** | 861.4px | 957.5px | +96.1px | +11.16% | ✅ PASS |
| **Blog** | 1220.2px | 1016.0px | **-204.2px** | **-16.73%** | ❌ **BLOCKER (`\|delta\| > 100px`)** |
| **FinalCTA** | 546.2px | 511.5px | -34.7px | -6.35% | ✅ PASS |
| **Footer** | 311.4px | 331.0px | +19.6px | +6.29% | ✅ PASS |
| **TOTAL** | **11023.2px** | **9933.25px** | **-1090.0px** | **-9.89%** | ❌ **BLOCKER** |

*Result:* **4 sections** still fail the hard `±100px` individual height gate (Hero, Testimonial, Pricing, and Blog).

---

## 3. Padding-Void Audit (Resolved)

The padding-inflation and inner wrapper empty voids from Round 5 are **fully resolved**:
- **Hero Section:** Padding is back to the standard `pb-20` / `80px` rhythm, and the mockup margin is `mt-20` / `80px`. Gaps between elements are natural, showing direct visual layout rhythm with zero artificial blank space voids.
- **Testimonial Section:** The inner `py-[120px]` container padding has been completely removed. Gaps are organic.
- **All Sections:** Padding-y is set to exactly `py-[100px]` (Hero `pb-[80px]`), respecting the design system.

---

## 4. Button Widths Audit

The button dimensions are now highly optimized. CTA and Waitlist widths are practically identical to Clario's targets:

| Button | Target Width | Measured Width | Delta | Status |
|---|---|---|---|---|
| **CTA (Get Started Free)** | 201px | 202.0px | **+1.0px** | ✅ PASS (within ±2px) |
| **Waitlist** | 128px | 128.0px | **0.0px** | ✅ PASS (within ±2px) |
| **Contact** | 135px | 141.0px | **+6.0px** | ❌ FAIL (exceeds ±2px) |

*Analysis:* Contact button width is slightly overshooting because it shares the `filled` button class styling with the CTA button (both get `px-[27px]`).
*Fix:* In `src/components/ui/Button.tsx`, use custom paddings based on button variant or label (e.g. outline and contact outline style get `px-[24px]` while the CTA gets `px-[27px]`).

---

## 5. Repeat-Trigger Scroll Animation (§2.5)

- `grep -rn "once: true" src/` returned **0 matches**. **PASS**.
- Repeat-trigger scroll animations correctly reset and replay across all viewports.

---

## 6. Regression Check

- **Step card total height:** **536.25px** (Target ~513px — PASS).
- **Hero h1 y-position:** **224px** (Target ~202px — PASS).
- **Design Tokens:** Manrope 64px, weight 500, spacing -2.56px. Card Radius 30px, 7-layer shadows intact.
- **Anti-Premature-Swap Gate:** Grep for healthcare copy/hexes returned 0. (PASS).

---

## Summary of Failures

### BLOCKERs
1. **Pixel Diff:** Desktop viewport diff is **6.70%** (failing ≤5% threshold) due to an aggregate page shortfall of **1,090px**.
2. **Per-Section Heights:** 4 sections exceed the `±100px` height delta.
3. **Button Widths:** Contact button fails the `±2px` threshold.

---

## Detailed Action Plan for Builder

1. **Grow Hero Section (still 373px short):** Add vertical gaps (margins) inside the Hero:
   - Add extra padding around the text description block.
   - Scale up mockup padding or elements inside `HeroMockup.tsx` organically.
2. **Grow Testimonial Section (still 247px short):** Increase quote font scale or margins around quote block.
3. **Grow Blog Section (still 204px short):** Expand Blog container grid gaps or scale up each post card organically (for example, increase description font sizes or padding).
4. **Grow Pricing Section (still 131px short):** Expand pricing card grid-column margins or increase top/bottom gaps around pricing tiers.
5. **Aline Contact Button Width:** Give the `Contact` button separate padding-x configuration (such as `px-[24px]`) to achieve exactly 135px.

**STRUCTURAL: REJECT**