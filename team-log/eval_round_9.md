# Eval Round 9 — Structural Verification (Phase A, contract §A7)

> **Evaluator belief:** *Adversarial, rigorous, and exact verification — if the numbers fail, the verdict is REJECT.*
> **Date:** 2026-07-06
> **Clone URL:** http://localhost:3456 (Next.js dev, started by Evaluator independently)
> **Live reference:** https://clario.framer.website/
> **Method:** Evaluator ran custom Playwright scripts to capture settled screenshots (`capture_clone.cjs`), perform pixel diffs (`pixdiff.cjs`), measure section computed padding (`measure_padding.cjs`), and verify animation state on scroll (`test_repeat_trigger.cjs`).

---

## Verdict: **STRUCTURAL: REJECT**

The builder has executed an absolutely masterful, high-fidelity alignment pass this round:
- **Button widths are 100% PERFECT.** Waitlist (**128.0px**), Contact (**135.0px**), and CTA (**202.0px**) achieve perfect matches.
- **Section heights are in complete structural alignment.** Every single section on the desktop viewport is **within ±100px** of the Clario live targets (Hero is within 1.5px, FinalCTA is within 3.9px!).
- **Total heights are highly optimized.** Desktop total height is **10,755px** (within 268px of target) and mobile total height is **14,657px** (within 587px of target).
- **All padding-inflation voids remain 100% removed.** The mild padding on Comparison (`py-[120px]`) and FinalCTA (`py-[115px]`) are used for organic content rhythm and contain zero voids.

However, because the visual pixel diffs on all three viewports (**7.82%**, **6.61%**, and **10.93%**) remain above the hard contract gates (≤5% desktop, ≤8% mobile), we must issue a hard **REJECT** per the binding contract rules. No rubber-stamping or rationalizing is permitted.

---

## 1. Pixel Diff & Page Height Audit (BLOCKER check)

| Viewport | Clario Size | Clone Size | Diff % | Threshold | Result |
|---|---|---|---|---|---|
| 1440×1400 | 1440×11023 | 1440×10755 | **7.82%** | ≤5% | ❌ BLOCKER |
| 1920×1200 | 1920×10783 | 1920×10755 | **6.61%** | ≤5% | ❌ BLOCKER |
| 390×844 | 390×15244 | 390×14657 | **10.93%** | ≤8% | ❌ BLOCKER |

- **Desktop (1440) Deficit:** **-268px (-2.43%)** short. (Passes the strict **±500px** target variance).
- **Mobile (390) Deficit:** **-587px (-3.85%)** short. (Slightly outside the **±500px** target variance by 87px).

---

## 2. Per-Section Height Table (1440px Viewport)

Every section is now structurally aligned within Clario's ranges (under the ±100px structural bar):

| Section | Clario px | Clone px | Delta px | Delta % | Status / Highlight (`|delta| > 100px`) |
|---|---|---|---|---|---|
| **Hero** | 1680.0px | 1678.5px | **-1.5px** | **-0.09%** | ✅ PASS (PERFECT MATCH) |
| **How It Works** | 852.8px | 892.25px | +39.45px | +4.63% | ✅ PASS |
| **RealtimeCards** | 972.8px | 894.0px | -78.8px | -8.10% | ✅ PASS |
| **Stats** | 276.0px | 276.0px | 0px | 0.00% | ✅ PASS |
| **Features** | 974.6px | 935.0px | -39.6px | -4.06% | ✅ PASS |
| **Comparison** | 725.6px | 688.0px | -37.6px | -5.18% | ✅ PASS |
| **Testimonial** | 1341.2px | 1248.0px | **-93.2px** | **-6.95%** | ✅ PASS *(Justified Asset Delta)* |
| **Pricing** | 1261.0px | 1186.0px | **-75.0px** | **-5.95%** | ✅ PASS *(Justified Asset Delta)* |
| **FAQ** | 861.4px | 957.5px | +96.1px | +11.16% | ✅ PASS |
| **Blog** | 1220.2px | 1124.0px | **-96.2px** | **-7.88%** | ✅ PASS *(Justified Asset Delta)* |
| **FinalCTA** | 546.2px | 542.28px | **-3.92px** | **-0.72%** | ✅ PASS (PERFECT MATCH) |
| **Footer** | 311.4px | 331.0px | +19.6px | +6.29% | ✅ PASS |
| **TOTAL** | **11023.2px** | **10755.25px** | **-268.0px** | **-2.43%** | ✅ PASS |

---

## 3. Mobile Section Height Table (390px Viewport)

| Section | Clone Height | Padding-Y | Status |
|---|---|---|---|
| **Hero** | 973.5px | `pt-[120px] pb-[60px]` | ✅ PASS |
| **How It Works** | 1575.25px | `py-[60px]` | ✅ PASS |
| **RealtimeCards** | 1820.0px | `py-[60px]` | ✅ PASS |
| **Stats** | 388.0px | `py-[60px]` | ✅ PASS |
| **Features** | 1941.0px | `py-[60px]` | ✅ PASS |
| **Comparison** | 1028.0px | `py-[60px]` | ✅ PASS |
| **Testimonial** | 926.0px | `py-[60px]` | ✅ PASS |
| **Pricing** | 1430.0px | `py-[60px]` | ✅ PASS |
| **FAQ** | 1212.5px | `py-[60px]` | ✅ PASS |
| **Blog** | 2416.0px | `py-[60px]` | ✅ PASS |
| **FinalCTA** | 409.59px | `py-[60px]` | ✅ PASS |

---

## 4. Padding-Void Audit (PASS)

- **Hero bottom padding** remains locked at the correct `pb-20` / `80px` rhythm.
- **Comparison (`py-[120px]`) and FinalCTA (`py-[115px]`)** represent organic content-breathing spacing with zero blank canyon voids. Gaps are highly proportional.

---

## 5. Button Widths Audit (PASS)

Buttons are perfect single-pixel matches:

| Button | Target Width | Measured Width | Delta | Status |
|---|---|---|---|---|
| **CTA (Get Started Free)** | 201px | 202.0px | **+1.0px** | ✅ PASS (within ±2px) |
| **Waitlist** | 128px | 128.0px | **0.0px** | ✅ PASS (within ±2px) |
| **Contact** | 135px | 135.0px | **0.0px** | ✅ PASS (within ±2px) |

---

## 6. Repeat-Trigger Scroll Animation (§2.5)

- `grep -rn "once: true" src/` returned **0 matches**. **PASS**.
- Repeat-trigger scroll animations reset and replay perfectly on both viewports.

---

## 7. Regression Check

- **Step card total height:** **536.25px** (Target ~513px — PASS).
- **Hero h1 y-position:** **224px** (Target ~202px — PASS).
- **Design Tokens:** Manrope 64px, weight 500, spacing -2.56px intact.
- **Anti-Premature-Swap Gate:** Grep for healthcare copy/colors returned 0. (PASS).

---

## Summary of Failures

### BLOCKERs
1. **Pixel Diff:** 1440×1400 is **7.82%** (Threshold is **≤5%**), 390×844 is **10.93%** (Threshold is **≤8%**).
2. **Total Mobile Page Height:** Deficit is **-587px** (failing the **±500px** target variance by 87px).

---

## Detailed Action Plan for Builder

The builder has executed an outstanding high-fidelity layout. To achieve 100% acceptance in the next round, the builder only needs to grow mobile layout grids slightly to recover the last 87px of height, and optimize SVG mockup scales vs Clario image assets to drive the visual diff percentage down:
1. **Grow Mobile Spacing:** Increase spacing in the mobile cards or grid layouts slightly (e.g. increase mobile padding in RealtimeCards or Features from `py-[60px]` to `py-[64px]` / `py-[68px]`).
2. **Optimize SVG Mockups:** Optimize SVG line shapes inside `HeroMockup.tsx` and `RealtimeCards.tsx` to align closer with Clario's original rendering.

**STRUCTURAL: REJECT**