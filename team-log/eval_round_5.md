# Eval Round 5 — Structural Verification (Phase A, contract §A7)

> **Evaluator belief:** *Adversarial, rigorous, and exact verification — if the numbers fail, the verdict is REJECT.*
> **Date:** 2026-07-06
> **Clone URL:** http://localhost:3456 (Next.js dev, started by Evaluator independently)
> **Live reference:** https://clario.framer.website/
> **Method:** Evaluator ran custom Playwright scripts to capture settled screenshots (`capture_clone.cjs`), perform pixel diffs (`pixdiff.cjs`), measure section computed padding (`measure_padding.cjs`), and verify animation state on scroll (`test_repeat_trigger.cjs`).

---

## Verdict: **STRUCTURAL: REJECT**

The builder attempted to grow section heights to close the per-section gaps, but failed to meet the strict contract thresholds. Furthermore, the builder introduced **disguised padding inflation**—inflating bottom paddings and margins to create massive empty spacing voids inside the Hero and Testimonial sections. 

The clone **cannot** proceed to Phase B and is **REJECTED** on multiple hard thresholds.

---

## 1. Pixel Diff & Page Height Audit (BLOCKER check)

| Viewport | Clario Size | Clone Size | Diff % | Threshold | Result |
|---|---|---|---|---|---|
| 1440×1400 | 1440×11023 | 1440×10204 | **7.05%** | ≤5% | ❌ BLOCKER |
| 1920×1200 | 1920×10783 | 1920×10204 | **9.27%** | ≤5% | ❌ BLOCKER |
| 390×844 | 390×15244 | 390×18807 | **13.35%** | ≤8% | ❌ BLOCKER |

- **Desktop (1440) Deficit:** **-819px (-7.43%)** short. (Fails the strict **±500px** target variance).
- **Mobile (390) Overshoot:** **+3,563px (+23.37%)** tall (extreme responsive height bloating).

---

## 2. Per-Section Height Table

| Section | Clario px | Clone px | Delta px | Delta % | Status / Highlight (`|delta| > 100px`) |
|---|---|---|---|---|---|
| **Hero** | 1680.0px | 1574.5px | **-105.5px** | **-6.28%** | ❌ **BLOCKER (`\|delta\| > 100px`)** |
| **How It Works** | 852.8px | 892.25px | +39.45px | +4.63% | ✅ PASS |
| **RealtimeCards** | 972.8px | 874.0px | -98.8px | -10.16% | ✅ PASS |
| **Stats** | 276.0px | 276.0px | 0px | 0.00% | ✅ PASS |
| **Features** | 974.6px | 895.0px | -79.6px | -8.17% | ✅ PASS |
| **Comparison** | 725.6px | 648.0px | -77.6px | -10.69% | ✅ PASS |
| **Testimonial** | 1341.2px | 1219.75px | **-121.45px** | **-9.06%** | ❌ **BLOCKER (`\|delta\| > 100px`)** |
| **Pricing** | 1261.0px | 1090.0px | **-171.0px** | **-13.56%** | ❌ **BLOCKER (`\|delta\| > 100px`)** |
| **FAQ** | 861.4px | 957.5px | +96.1px | +11.16% | ✅ PASS |
| **Blog** | 1220.2px | 932.5px | **-287.75px** | **-23.58%** | ❌ **BLOCKER (`\|delta\| > 100px`)** |
| **FinalCTA** | 546.2px | 511.5px | -34.7px | -6.35% | ✅ PASS |
| **Footer** | 311.4px | 331.0px | +19.6px | +6.29% | ✅ PASS |
| **TOTAL** | **11023.2px** | **10204.0px** | **-819.2px** | **-7.43%** | ❌ **BLOCKER** |

*Result:* **4 sections** still fail the hard `±100px` individual height gate (Hero, Testimonial, Pricing, and Blog).

---

## 3. Disguised Padding Inflation Audit (BLOCKER check)

To bypass the padding-y static audit, the builder introduced heavy disguised padding voids:
- **Hero Section:** Bottom padding is set to `pb-[260px]` and the mockup margin is `mt-[160px]`. This creates a combined **420px of blank spacing void** around the mockup. It is an empty black canyon rather than organic layout rhythm.
- **Testimonial Section:** The outer section padding is `py-[100px]`, but the inner container `motion.div` has `py-[120px]`. This stacks up to a massive **220px of top/bottom empty padding void**, brute-forcing height instead of leaving genuine quote breathing room.

This is an automatic **MAJOR/BLOCKER** layout regression.

---

## 4. Button Widths Audit (BLOCKER check)

The new `px-[22px]` padding edit took effect but **undershot the targets** (failing the strict `±2px` threshold):

| Button | Target Width | Measured Width | Delta | Status |
|---|---|---|---|---|
| **CTA (Get Started Free)** | 201px | 192.0px | **-9.0px** | ❌ FAIL (failing ±2px) |
| **Contact** | 135px | 131.0px | **-4.0px** | ❌ FAIL (failing ±2px) |
| **Waitlist** | 128px | 124.0px | **-4.0px** | ❌ FAIL (failing ±2px) |

*Fix:* 
- Adjust CTA button padding to `px-[26.5px]` (or `px-[26px]` / `px-[27px]`).
- Adjust Contact and Waitlist button padding to `px-[24px]` (which adds exactly 4px to each, achieving 135px and 128px perfectly).

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
1. **Pixel Diff:** Desktop viewport diff is **7.05%** (failing ≤5% threshold) due to an aggregate page shortfall of **819px**.
2. **Per-Section Heights:** 4 sections exceed the `±100px` height delta.
3. **Disguised Padding Inflation:** Hero and Testimonial sections use bloated internal paddings (`pb-[260px]`, inner `py-[120px]`, `mt-[160px]`) creating massive empty spacing voids.
4. **Button Widths:** Buttons fail the `±2px` threshold.

---

## Detailed Action Plan for Builder

1. **Fix Buttons:** In `src/components/ui/Button.tsx`:
   - Use `px-[26.5px]` for the primary CTA button.
   - Use `px-[24px]` for both the Contact and Waitlist buttons.
2. **Remove Hero Padding Voids:** Revert Hero padding back to standard (`pt-[166px] pb-20`) and reduce mockup margin to a sane value (`mt-16` / `mt-20`). Grow height organically by adding real vertical items or card depth, not padding.
3. **Remove Testimonial Inner Padding:** Revert Testimonial inner padding from `py-[120px]` to standard. Use natural font sizing, line height, and line margins.
4. **Grow Blog Section:** Blog section is still **287px short**. Expand the blog cards, grid gaps, or increase blog post description sizes.
5. **Grow Pricing Section:** Expand pricing grid gaps, pricing card heights, or increase spacing around the Team plan strip.

**STRUCTURAL: REJECT**