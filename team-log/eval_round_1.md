# Eval Round 1 — Structural Verification (Phase A, contract §A7)

> **Evaluator belief:** *This clone is broken — prove it.*
> **Date:** 2026-07-06
> **Clone URL:** http://localhost:3456 (Next.js dev, started by Evaluator independently)
> **Live reference:** https://clario.framer.website/
> **Method:** Evaluator ran own Playwright sniper (`sniper_clone.cjs`) + screenshot capture (`capture_clone.cjs`) + pixel diff (`pixdiff.cjs`) + deep CTA/animation measurement (`deep_clone.cjs`). Did NOT trust builder screenshots.

---

## Verdict: **STRUCTURAL: REJECT**

3 BLOCKERs, 5 MAJORs, 1 MINOR. Clone cannot proceed to Phase B.

---

## 1. Pixel Diff vs Evaluator's own Clario screenshots

| Viewport | Clario size | Clone size | Diff % | Threshold | Result |
|---|---|---|---|---|---|
| 1440×1400 | 1440×11023 | 1440×8901 | **8.36%** | ≤5% | ❌ BLOCKER |
| 1920×1200 | 1920×10783 | 1920×8701 | **11.47%** | ≤5% | ❌ BLOCKER |
| 390×844 | 390×15244 | 390×15523 | **8.76%** | ≤8% | ❌ BLOCKER (barely) |

**Evidence:** `team-log/screenshots/clario/` vs `team-log/screenshots/clone/`, diff via `team-log/pixdiff.cjs`.
**Root cause:** Clone page is **2122px shorter** than Clario at 1440 width (8901 vs 11023). Sections are undersized — primarily step cards (140px short each) and hero spacing. At 390px the clone is 279px taller (worse — mobile layout bloated).

---

## 2. Computed Tokens

### PASS (tokens that match Clario live baseline exactly)
| Token | Clario live | Clone | Match |
|---|---|---|---|
| Hero h1 font-family | Manrope | Manrope | ✅ |
| Hero h1 font-size | 64px | 64px | ✅ |
| Hero h1 font-weight | 500 | 500 | ✅ |
| Hero h1 letter-spacing | -2.56px | -2.56px | ✅ |
| Hero h1 line-height | 64px | 64px | ✅ |
| Hero h1 color | rgb(255,255,255) | rgb(255,255,255) | ✅ |
| Body bg | rgb(5,5,5) | rgb(5,5,5) | ✅ |
| Nav height | 80px | 80px | ✅ |
| Nav bg | rgba(5,5,5,0.5) | rgba(5,5,5,0.5) | ✅ |
| Step card radius | 30px | 30px | ✅ |
| Step card bg | rgb(13,13,13) | rgb(13,13,13) | ✅ |
| Step card shadow (7-layer) | rgba(23,23,23,*) stack | identical string | ✅ |
| Step card padding | 10px 10px 30px | 10px 10px 30px | ✅ |
| Step pill color | rgb(140,255,46) | rgb(140,255,46) | ✅ |
| Step pill font-size | 16px | 16px | ✅ |
| Step pill letter-spacing | -0.32px | -0.32px | ✅ |
| CTA radius | 23px | 23px | ✅ |
| CTA padding | 12px 20px | 12px 20px | ✅ |
| CTA bg | rgb(140,255,46) | rgb(140,255,46) | ✅ |
| CTA color | rgb(13,13,13) | rgb(13,13,13) | ✅ |
| CTA box-shadow | rgba(132,255,31,0.32) 0px 8px 20px 0px | identical | ✅ |

> **Note:** Builder corrected contract's wrong values (Inter→Manrope, 48px→64px, white cards→dark #0d0d0d, 20px→30px radius) to match live truth. This is correct per contract §Engineer Decisions #2 ("live truth wins").

### FAIL (structural discrepancies)
| # | Token | Clario live | Clone | Delta | Severity | File+line |
|---|---|---|---|---|---|---|
| T1 | Step card height | 513px | 373.5px | **-139.5px (27% short)** | BLOCKER | HowItWorks.tsx:109 (card) + :30-68 (mockup only 200px h-[200px], Clario mockup is ~300px) |
| T2 | Hero h1 y-position (1440) | 202px | 418.75px | **+216px (too low)** | MAJOR | Hero.tsx:9 (pt-32=128px top padding + badge + mb-8 gaps push h1 down) |
| T3 | CTA button width | 201px | 179.8px | -21px | MAJOR | Button.tsx:13 (text-[15px] vs Clario 12px — wait, Clario sniper says 12px font but deep says 15px; the inner span is correct but total width differs due to arrow icon spacing) |
| T4 | Contact button width | 135px | 121px | -14px | MAJOR | Button.tsx:13 |
| T5 | Waitlist button width | 128px | 117px | -11px | MINOR | Button.tsx:13 |
| T6 | Page total height (1440) | 11023px | 8901px | -2122px (19% short) | BLOCKER | Compound effect of T1 + section padding differences across all sections |

---

## 3. Animation Timing

| Check | Result | Evidence |
|---|---|---|
| Mechanism present | ✅ Framer Motion (initial/animate/whileInView) | `src/lib/tokens.ts:75-98` |
| `data-framer-appear-id` count | Clone: 0 / Clario: 11 | Expected — clone uses Framer Motion lib, not Framer-builder attrs |
| Animation settles | ✅ All content visible in settled screenshot | `screenshots/clone/1440x1400_settled.png` |
| Timing ±0.1s vs Clario | ⚠️ UNVERIFIED | Could not capture Clario's real ms timings (settled snapshot shows transition:"" — Framer clears after anim). Clone uses doc defaults 0.6s/0.12 stagger. |

**MINOR — timing unverified but not broken.** The clone animates and settles. If Clario's real timings differ >0.1s from doc defaults, this becomes a MAJOR. Evaluator could not record frame-by-frame this round (script attached load listener too late). Round 2 should capture via video recording.

---

## 4. Copy Byte-Exactness (golden truth §0)

| String | Present | Em-dash U+2014 | Result |
|---|---|---|---|
| `All-in-One Finance Toolkit` | ✅ | n/a | PASS |
| `Take control of your finances — with clarity` | ✅ | ✅ U+2014 | PASS |
| `All your money insights, finally in one place — track income, spending, and reach your goals with ease.` | ✅ | ✅ | PASS |
| `Get Started Free` | ✅ | n/a | PASS |
| `How Clario works` | ✅ | n/a | PASS |
| Step 1/2/3 headlines + descs | ✅ all verbatim | ✅ em-dashes | PASS |
| `See your money in real time, clearly.` | ✅ | ✅ | PASS |
| 4 realtime card titles | ✅ | n/a | PASS |
| `Trusted by 3k+ Freelancers` / `$1.2M+ Saved` | ✅ | n/a | PASS |
| Features h2 + 6 items | ✅ | n/a | PASS |
| Comparison h2 + 5+5 rows | ✅ | ✅ (There's → There&rsquo;s) | PASS |
| Testimonial quote | ✅ | ✅ | PASS |
| Pricing h2 + copy + toggle + tiers | ✅ | n/a | PASS |
| FAQ 6 items 01-06 | ✅ | n/a | PASS |
| Blog 4 posts + `Explore the blog` | ✅ | n/a | PASS |
| Final CTA | ✅ | ✅ | PASS |
| Footer | ✅ | n/a | PASS |

**Copy: PASS** — all golden-truth strings byte-exact including em-dashes.

---

## 5. Anti-Premature-Swap Gate

| Grep | Pattern | Matches | Result |
|---|---|---|---|
| `teal\|hospital\|pharmacy\|Bayana\|0F6E5C\|1D4ED8` | src/ | **0** | ✅ PASS |
| `bank\|financ\|spending\|savings\|Clario` | src/ | 91 (all legitimate Clario copy) | ✅ PASS (Clario copy present as required) |

**Anti-premature-swap: PASS** — no teal/hospital/Bayana leaks. Clario fintech copy and green palette intact.

---

## 6. Responsive

| # | Case | Viewport | Result | Evidence |
|---|---|---|---|---|
| R1 | Nav collapse | 390×844 | ✅ PASS | Navbar.tsx:26 `hidden md:flex` hides links; :45 mobile hamburger shows |
| R2 | Hero stack | 390×844 | ⚠️ PARTIAL | h1 width=310 (wraps), but hero uses `items-center text-center` — stacks vertically but h1 at 64px may overflow on 390px (Clario likely scales down). Needs visual check. |
| R3 | Card stack | 390×844 | ✅ PASS | `grid-cols-1 md:grid-cols-3` — stacks at mobile |
| R4 | Max-width centering | 1920×1200 | ✅ PASS | h1 x=600 (centered: (1920-720)/2=600). Clario also x=600. |
| R5 | No horizontal scroll | all | ✅ PASS | scrollWidth=1440 at 1440vp, =390 at 390vp |
| R6 | Touch targets | 390×844 | ✅ PASS | CTA height 46.5px > 44px |

**Responsive: PASS** (R2 minor concern — hero h1 may not scale at 390 like Clario does).

---

## 7. Section Completeness

All 13 sections present and rendered:
nav ✅ | hero ✅ | realtime(4 cards) ✅ | howitworks(3) ✅ | stats ✅ | features(6) ✅ | comparison ✅ | testimonial ✅ | pricing(2+team strip) ✅ | faq(6) ✅ | blog(4) ✅ | finalcta ✅ | footer ✅

**Section completeness: PASS**

---

## 8. Button Dedupe / Console / Font Flash

| Check | Result | Evidence |
|---|---|---|
| Button dedupe | ✅ PASS | `Get Started Free` textCount=1 (single text node, CSS hover arrow) |
| Console errors | ✅ PASS | 0 errors captured in sniper |
| Font flash (FOUT) | ⚠️ MINOR | Manrope loaded via Google Fonts `@import` in globals.css:1 — may flash fallback on slow connections. Clario preloads. Not a blocker but should use `next/font` for Phase B. |

---

## Summary of Failures

### BLOCKER (3) — must fix before re-eval
1. **Pixel diff 1440: 8.36%** (threshold 5%) — `pixdiff.cjs` output
2. **Pixel diff 1920: 11.47%** (threshold 5%) — `pixdiff.cjs` output
3. **Step cards 27% too short** (373.5px vs 513px) — mockup area 200px vs Clario ~300px. `HowItWorks.tsx:30-68` `h-[200px]` must increase to ~300px to match Clario card height.

### MAJOR (5) — should fix before re-eval
4. **Pixel diff 390: 8.76%** (threshold 8%, barely fails)
5. **Page height 19% short** (8901 vs 11023 at 1440) — compound of #3 + section padding
6. **Hero h1 216px too low** (y=418 vs 202) — `Hero.tsx:9` pt-32 too much top padding
7. **CTA button 21px too narrow** (180 vs 201) — `Button.tsx:13`
8. **Contact button 14px too narrow** (121 vs 135) — `Button.tsx:13`

### MINOR (2)
9. Animation timing unverified (could not capture Clario ms this round)
10. Font flash risk (Google Fonts @import vs next/font preload)

---

## Files for Builder to Fix
| File | Issue |
|---|---|
| `src/components/sections/HowItWorks.tsx:30,42,60` | Step mockup `h-[200px]` → increase to match Clario ~300px (step card total must be ~513px) |
| `src/components/sections/Hero.tsx:9` | `pt-32` (128px) top padding too large — reduce to position h1 at y≈202 |
| `src/components/ui/Button.tsx:13` | Button width 21px short — investigate padding/font-size/arrow spacing vs Clario's 201px |
| All sections | Section padding may be too tight — verify `py-24` (96px) vs Clario's `100px 40px` |
| `src/components/sections/RealtimeCards.tsx` | Verify card mockup heights match Clario (may be short like step cards) |

---

## What Proved This Clone Broken
The clone is structurally close — tokens, copy, sections, anti-swap gate all pass. But it is **visually broken at the pixel level**: step cards are 27% too short, the hero is pushed 216px too low, buttons are 10-15% too narrow, and the overall page is 19% shorter than Clario. The pixel diff exceeds threshold on all 3 viewports. This is a **REJECT** — the builder must fix the 3 BLOCKERs and 5 MAJORs before re-evaluation.

**STRUCTURAL: REJECT**
