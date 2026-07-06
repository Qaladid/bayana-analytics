# Eval Round 3 — Structural Verification (Phase A, contract §A7)

> **Evaluator belief:** *Adversarial, rigorous, and exact verification — if the numbers fail, the verdict is REJECT.*
> **Date:** 2026-07-06
> **Clone URL:** http://localhost:3456 (Next.js dev, started by Evaluator independently)
> **Live reference:** https://clario.framer.website/
> **Method:** Evaluator ran custom Playwright scripts to capture settled screenshots (`capture_clone.cjs`), perform pixel diffs (`pixdiff.cjs`), measure section computed padding (`measure_padding.cjs`), and verify animation state on scroll (`test_repeat_trigger.cjs`).

---

## Verdict: **STRUCTURAL: REJECT**

While the builder has resolved the previous Round 2 padding-y inflation (all sections reset to standard `100px` paddings) and dialed back the overshooting button widths, **the page-height deficit has returned**. The page height is **8888px** (19% shorter than Clario's **11023px**), which fails the hard pixel-diff threshold on all three viewports. 

This shortfall is **not** an asset recreation difference; it is a **structural layout issue inside the section internals** (undersized mockups, missing content fields, and tight internal gaps). 

The clone **cannot** proceed to Phase B and is **REJECTED** until the internal section heights are resolved organically.

---

## 1. Pixel Diff & Page Height Audit (BLOCKER check)

| Viewport | Clario Size | Clone Size | Diff % | Threshold | Result |
|---|---|---|---|---|---|
| 1440×1400 | 1440×11023 | 1440×8888 | **10.45%** | ≤5% | ❌ BLOCKER |
| 1920×1200 | 1920×10783 | 1920×8888 | **11.40%** | ≤5% | ❌ BLOCKER |
| 390×844 | 390×15244 | 390×16764 | **14.42%** | ≤8% | ❌ BLOCKER |

- **Desktop (1440) Deficit:** **-2,135px (-19.37%)** short.
- **Mobile (390) Overshoot:** **+1,520px (+9.97%)** tall (due to excessive responsive stacking height).

---

## 2. Per-Section Height Diagnostic (engineer-requested)

To guide the builder on where to grow section heights organically without reverting to padding inflation, we traced the exact bounding boxes of full-width containers live on **https://clario.framer.website/** and compared them directly to the clone:

| Section | Clario px | Clone px | Delta px | Delta % | Status / Highlight (|delta| > 100px) |
|---|---|---|---|---|---|
| **Hero** | 1680.0px | 964.5px | **-715.5px** | **-42.59%** | ❌ **BLOCKER (|delta| > 100px)** |
| **How It Works** | 852.8px | 892.25px | +39.45px | +4.63% | ✅ PASS |
| **RealtimeCards** | 972.8px | 824.0px | **-148.8px** | **-15.30%** | ❌ **BLOCKER (|delta| > 100px)** |
| **Stats** | 276.0px | 276.0px | 0px | 0.00% | ✅ PASS |
| **Features** | 974.6px | 859.0px | **-115.6px** | **-11.86%** | ❌ **BLOCKER (|delta| > 100px)** |
| **Comparison** | 725.6px | 648.0px | -77.6px | -10.69% | ✅ PASS |
| **Testimonial** | 1341.2px | 704.0px | **-637.2px** | **-47.51%** | ❌ **BLOCKER (|delta| > 100px)** |
| **Pricing** | 1261.0px | 1006.0px | **-255.0px** | **-20.22%** | ❌ **BLOCKER (|delta| > 100px)** |
| **FAQ** | 861.4px | 1165.0px | **+303.6px** | **+35.25%** | ❌ **BLOCKER (|delta| > 100px)** *(Taller)* |
| **Blog** | 1220.2px | 782.0px | **-438.2px** | **-35.91%** | ❌ **BLOCKER (|delta| > 100px)** |
| **FinalCTA** | 546.2px | 434.5px | **-111.7px** | **-20.45%** | ❌ **BLOCKER (|delta| > 100px)** |
| **Footer** | 311.4px | 331.0px | +19.6px | +6.29% | ✅ PASS |
| **TOTAL** | **11023.2px** | **8886.25px** | **-2137.0px** | **-19.39%** | ❌ **BLOCKER** |

---

## 3. Structural Root Cause Analysis

### A. Hero Section (-715.5px) — BLOCKER
- **Undersized Mockup:** On Clario, the Hero dashboard mockup height is **578px**. On the clone, `HeroMockup` has no defined height/scaling and renders around ~250px tall (a **-328px** shortfall).
- **Tight Gaps:** Spacing between navbar and hero h1, h1 and subhead, subhead and CTA, and CTA and mockup are too tight.

### B. Testimonial Section (-637.2px) — BLOCKER
- **Missing Vertical Margins/Rhythm:** Clario spaces out the testimonial quote, avatar, and background container with massive internal gaps and a larger line height (`lineHeight: "40px"`), creating an spacious layout. The clone's elements are tightly packed.

### C. Blog Section (-438.2px) — BLOCKER
- **Missing Content Fields:** In `src/components/sections/Blog.tsx`, **3 of the 4 blog posts are completely missing description strings (`desc` key)**. This causes those 3 cards to collapse and render significantly shorter than Clario's cards (which all carry descriptions).

### D. Pricing Section (-255px) — BLOCKER
- **Tight Layout:** The team-friendly plan strip ("Trusted by teams worldwide") and Monthly/Yearly toggle are tightly packed.

### E. RealtimeCards (-148.8px) — BLOCKER
- **Mockup Sizes:** The 4 realtime mockups/cards have smaller vertical dimensions and tighter grid-template gap configurations.

### F. Features (-115.6px) — BLOCKER
- **Internal Gaps:** The 6-card container grid is too tight.

---

## 4. Section Padding Audit (Regressed)

While the builder reverted bloated padding to the standard `py-[100px] px-10`, they failed to grow section heights organically. 
- **Hero padding bottom** is now correctly set to `80px` (removing the 790px bottom void).
- **All other sections** are set to exactly `py-[100px]`, which is correct per the design system tokens, but exposes the severe content-height deficits underneath.

---

## 5. Button Widths Audit

Buttons are much closer to targets but still slightly overshooting:

| Button | Target Width | Measured Width | Delta | Status |
|---|---|---|---|---|
| **CTA (Get Started Free)** | 201px | 208.81px | +7.81px | MAJOR |
| **Contact** | 135px | 145.11px | +10.11px | MAJOR |
| **Waitlist** | 128px | 138.41px | +10.41px | MAJOR |

*Fix:* Adjust `px-7` to `px-6` (24px padding-x) to subtract exactly 8px from each, aligning them almost perfectly with targets.

---

## 6. Repeat-Trigger Scroll Animation (§2.5)

- `grep -rn "once: true" src/` returned **0 matches**. **PASS**.
- Repeat-trigger scroll animations correctly reset and replay.
- With Hero `pb` reduced to `80px`, the "How Clario works" heading starts visible at `opacity: 1` on page load (fully resolved).

---

## Summary of Failures

### BLOCKER (1)
1. **Pixel Diff & Section Internals height deficit:** Desktop viewport diff is **10.45%** (failing ≤5% threshold) due to an aggregate page shortfall of **2135px**. The height shortfall is caused by undersized mockups, missing blog post description texts, and compressed spacing inside the sections.

### MAJOR (1)
2. **Button Widths:** CTA, Contact, and Waitlist buttons are 8px to 10px too wide.

---

## Detailed Action Plan for Builder

1. **Grow Hero Mockup:** Scale up `HeroMockup.tsx` elements or add a minimum container height of **578px** to match Clario's mockup dimensions. Add larger vertical margins (`my-12` or `my-16`) between the h1, subhead, CTA, and mockup.
2. **Add Blog Descriptions:** Add the missing `desc` text fields for the 3 incomplete blog cards inside `Blog.tsx` so all 4 cards have descriptions.
3. **Expand Testimonial Spacing:** Add generous vertical gaps (margins/paddings) between testimonial elements (badge → header → subtext → quote).
4. **Grow Pricing and RealtimeCards:** Increase card heights/mockups and add larger grid gaps inside these grids.
5. **Adjust Button Padding:** Change button padding from `px-7` to `px-6` to hit exact target widths.

**STRUCTURAL: REJECT**