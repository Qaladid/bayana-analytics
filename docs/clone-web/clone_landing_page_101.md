# Clone Landing Page 101: Clario → Bayana Analytics Deep Reference

> **Use this when stuck.** The operational guide (`clone_guide_v2.md`) tells you the process; this doc tells you the exact structure, tokens, and swap map.
> **Target:** Clario — Framer SaaS & Fintech Dashboard Template
> **Output:** Bayana Analytics — data pipeline SaaS for Nairobi hospital/pharmacy SMEs

---

## 1. Philosophy

Trust your eyes (screenshots) first. When an effect looks too complex to be pure CSS, switch to Deep DOM Interrogation to steal the exact structure — never guess the math. Clario is Framer-native, so expect deeply nested "div soup" — distill it into clean semantic React, don't copy the DOM verbatim.

**80/20 split:** 80% of the time = layout, structure, spacing, basic tokens (fast). 20% = exact shadows, gradients, animation timing, pixel-perfect polish.

**Two-pass rule:** Pass 1 = structural clone using Clario's own colors/copy. Pass 2 = brand swap to Bayana's palette/copy. Never do both at once (see `clone_guide_v2.md` Section 0).

---

## 2. Tech Stack Setup

| Layer | Choice |
|-------|--------|
| Framework | Next.js 16 (App Router) + TypeScript |
| Styling | Tailwind CSS — arbitrary values map 1:1 to extracted tokens |
| Animation | Framer Motion — matches Clario's native Appear/Scroll Effects |
| Icons | lucide-react or inline SVG, stored locally |

### Folder Structure
```
src/
  components/
    layout/        # Navbar.tsx, Footer.tsx
    sections/       # Hero.tsx, HowItWorks.tsx, Features.tsx, Pricing.tsx
    ui/              # Button.tsx, StepCard.tsx, PricingCard.tsx
  assets/
    media/           # extracted/recreated mockup icons, logo
  styles/
    globals.css      # font-face, CSS variables
```

### Font Loading
Identify Clario's actual font family before measuring anything (check for the Framer `"... Placeholder"` fallback shim — ignore it, load the real font family it's a placeholder for).

```css
/* globals.css — adjust family name once identified via Sniper Script 1 */
@import url('https://fonts.googleapis.com/css2?family=<DETECTED_FAMILY>:wght@400;500;600;700&display=swap');

:root {
  --font-sans: '<DETECTED_FAMILY>', sans-serif;
}
```

---

## 3. Section-by-Section Structure + Brand Swap Map

This is Clario's known structure from the marketplace preview. Confirm exact tokens live before building — this is a structural map, not final pixel values.

### 3.1 Navbar
**Clario structure:** Logo mark + wordmark (left) → nav links "How it works / Features / Pricing / Blog" (center) → "Waitlist" outline button + "Contact" filled green button (right).

**Swap for Bayana:**
- Logo: "Bayana Analytics" wordmark
- Nav links: "How it Works / Features / Pricing / Contact" (drop Blog unless you want it)
- Right buttons: keep the two-button pattern — e.g. "Login" (outline) + "Get Early Access" (filled)
- Color: filled button green → Bayana teal/blue

### 3.2 Hero
**Clario structure:** Small pill badge above headline ("All-in-One Finance Toolkit") → large bold headline ("Take control of your finances — with clarity") → subheadline → filled CTA button ("Get Started Free") → below, a dashboard mockup card (dark UI showing "Danielle M.", balance, top-up/transfer icons, a "Daily Limit" card with progress bar).

**Swap for Bayana:**
- Badge: "All-in-One Hospital Data Toolkit" or similar
- Headline: "Stop losing hours to Excel."
- Subheadline: "Connect your hospital or pharmacy systems and get real-time dashboards — or just ask our AI assistant."
- CTA: "Get Early Access"
- Mockup: replace bank dashboard with a hospital ops dashboard mockup — stock levels, patient visits, revenue by branch, plus a small chat bubble element hinting at the AI assistant

**Structural note:** keep the exact card shape, shadow, corner radius, and icon-row layout of the original mockup — only swap the icon meanings and numbers/labels.

### 3.3 "See your data in real time" section (Clario: "See your money in real time, clearly")
**Clario structure:** Two-column mockup cards below a headline: Card 1 "Smart Dashboard" (all accounts in one view), Card 2 "Cashflow Overview" (income/expense line chart, "Last 7 Days" dropdown).

**Swap for Bayana:**
- Headline: "See your operations in real time, clearly."
- Card 1: "Unified Dashboard" — "See stock, patient visits, and revenue across all branches in one view."
- Card 2: "Trend Overview" — line chart showing patient visits or stock movement over time, same dropdown pattern ("Last 7 Days")

### 3.4 "How Clario works" — 3-Step Section
**Clario structure (confirmed from screenshots):**
- Small "▶ Watch video" link + headline "How Clario works"
- Three white rounded cards on the dark background, each containing:
  - A small mockup image (Step 1: card UI showing "$430,000 Credit" with a toggle; Step 2: line chart UI "Balance / Last 8 Months"; Step 3: progress bar UI "Daily Limit $2,500.00")
  - A green pill-shaped step label ("• Step 1", "• Step 2", "• Step 3")
  - Bold headline per card
  - Short gray description paragraph

**Extracted copy (Clario, verbatim for structural reference):**
| Step | Headline | Description |
|---|---|---|
| 1 | Connect your accounts | Sync all your bank accounts, credit cards, and wallets — securely and instantly. |
| 2 | Track your money | See where your money goes with real-time spending insights and clear breakdowns. |
| 3 | Set goals & stay on track | Plan your savings, set monthly budgets, and let Clario keep you in control. |

**Swap for Bayana:**
| Step | Headline | Description |
|---|---|---|
| 1 | Connect your systems | Link your HMIS (PharmaCore, Ilara, etc.) or upload your Excel sheets — securely and in minutes, no IT team required. |
| 2 | Track your operations | Get a live dashboard of stock levels, patient visits, and revenue by branch — no more waiting on manual Excel reports. |
| 3 | Ask your AI assistant | Just ask — "How many stockouts this month?" or "Which branch is underperforming?" — and get instant answers, no spreadsheet digging. |

**Mockup swap:** Step 1 card → connector/HMIS icon tile (small logo chips for PharmaCore/Ilara-style connectors); Step 2 card → keep the line-chart UI style, relabel axis to "Stock Levels" or "Patient Visits"; Step 3 card → replace progress bar with a small chat-bubble UI showing a sample Q&A exchange.

**Structural note:** keep the exact card size, corner radius, shadow, step-pill shape/color-position, and text hierarchy. Only change: pill color (teal instead of green), mockup image content, headline/description text.

### 3.5 Features Grid
**Clario likely structure:** icon + short headline + description, 3–4 cards in a grid (standard Framer SaaS pattern — confirm exact count/layout live).

**Swap for Bayana:** Connector library / Real-time dashboards / AI chatbot / Data security — 4 cards matching whatever grid count Clario actually uses.

### 3.6 Pricing
**Clario likely structure:** 3-tier pricing cards, one highlighted as "most popular," feature checklist per tier.

**Swap for Bayana:** Starter / Growth / Multi-branch tiers, KES pricing, marked "Early access pricing."

### 3.7 Footer
**Clario structure:** logo, nav links repeated, social icons, copyright line.

**Swap for Bayana:** "Bayana Analytics" logo, same nav pattern, social placeholders, "© Bayana Analytics 2026."

---

## 4. Animation Detection (Clario is Framer-native — confirmed via listing metadata: "Appear Effects" + "Scroll Effects")

Run this scanner on the live Clario preview to confirm exact mechanism before rebuilding:

```javascript
(() => {
  const results = { animations: [], tech: {} };
  const allEls = document.querySelectorAll('*');
  const cssAnimated = [];
  allEls.forEach(el => {
    const s = getComputedStyle(el);
    if (s.animationName && s.animationName !== 'none') {
      cssAnimated.push({ tag: el.tagName, animation: s.animationName, duration: s.animationDuration });
    }
  });
  results.animations = cssAnimated.slice(0, 10);
  const framerAppear = document.querySelectorAll('[data-framer-appear-id]');
  results.tech.framerAppearElements = framerAppear.length;
  if (framerAppear.length > 0) {
    results.tech.framerAppearSample = Array.from(framerAppear).slice(0, 5).map(el => ({
      id: el.getAttribute('data-framer-appear-id'),
      style: { opacity: el.style.opacity, transform: el.style.transform }
    }));
  }
  return JSON.stringify(results, null, 2);
})()
```

**Expected result:** `framerAppearElements > 0` with CSS transitions — a standard Framer entrance-animation pattern (fade + slide-up, staggered per section). Map to Framer Motion:

```jsx
const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } }
};
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] } }
};
```

Apply this stagger pattern to: hero badge → headline → subheadline → CTA, and again per-card in the "How it works" 3-step section as each scrolls into view (Scroll Effects).

---

## 5. Sniper CSS Script Library (run these live on Clario)

### Typography (nav, headline, step-card text)
```javascript
(() => {
  const h1 = document.querySelector('h1');
  const s = getComputedStyle(h1);
  return JSON.stringify({ fontFamily: s.fontFamily, fontSize: s.fontSize, fontWeight: s.fontWeight,
    letterSpacing: s.letterSpacing, lineHeight: s.lineHeight, color: s.color }, null, 2);
})()
```

### Step-card structure (the 3-card "How it works" block)
```javascript
(() => {
  const cards = Array.from(document.querySelectorAll('[class*="step"], section div'))
    .filter(el => (el.textContent || '').match(/Step \d/));
  return JSON.stringify(cards.slice(0, 3).map(c => {
    const s = getComputedStyle(c);
    const r = c.getBoundingClientRect();
    return { width: r.width, height: r.height, borderRadius: s.borderRadius,
      background: s.background, padding: s.padding, boxShadow: s.boxShadow };
  }), null, 2);
})()
```
*(Adjust selector once you've inspected the live DOM — Framer's actual class names are hashed/obfuscated, so confirm the real container via DevTools/`javascript_tool` first.)*

### Button styles (CTA + nav buttons)
```javascript
(label = 'Get Started') => {
  const btn = Array.from(document.querySelectorAll('a, button')).find(l => (l.textContent||'').includes(label));
  if (!btn) return "Not found";
  const r = btn.getBoundingClientRect(); const s = getComputedStyle(btn);
  return JSON.stringify({ width: r.width, height: r.height, padding: s.padding,
    borderRadius: s.borderRadius, background: s.background, boxShadow: s.boxShadow, color: s.color }, null, 2);
}
```

### Step-pill badge ("• Step 1")
```javascript
(() => {
  const pill = Array.from(document.querySelectorAll('span, div')).find(e => (e.textContent||'').trim().match(/Step \d/));
  if (!pill) return "Not found";
  const s = getComputedStyle(pill);
  return JSON.stringify({ background: s.background, color: s.color, borderRadius: s.borderRadius,
    padding: s.padding, border: s.border, fontSize: s.fontSize }, null, 2);
})()
```

---

## 6. Color Palette Swap (apply only in Phase 5, after structural ACCEPT)

| Role | Clario (structural reference) | Bayana (final) |
|---|---|---|
| Background | Dark navy/black | Keep dark hero OR switch to white/light — decide once structural clone is confirmed, but default to a calmer light background outside the hero |
| Accent / CTA | Bright green | Teal (`#0F6E5C`) or trust blue (`#1D4ED8`) |
| Step-pill | Green pill on dark chip | Teal pill, same shape |
| Text | White on dark | Keep contrast ratio equivalent — white on dark hero, near-black on light sections |
| Card backgrounds | White rounded cards on dark bg | Keep pattern — white cards, adjust shadow tone to cooler gray if needed |

**Rule:** swap hex values only. Do not change border-radius, padding, shadow spread, or any structural property while doing the palette pass.

---

## 7. Quality Checklist (Structural Pass)

- [ ] Nav layout, link order, button count/style match
- [ ] Hero: badge → headline → subheadline → CTA → mockup, same vertical rhythm
- [ ] "How it works": 3 cards, same size/radius/shadow, step-pill same shape
- [ ] Entrance animation stagger timing matches (±0.1s tolerance)
- [ ] Scroll-triggered fade-in on "How it works" cards as they enter viewport
- [ ] Mobile (390px): nav collapses appropriately, hero stacks, cards stack vertically
- [ ] No console errors, fonts load without flash of fallback

## 8. Quality Checklist (Brand Swap Pass)

- [ ] All Clario green replaced with Bayana teal/blue — zero leftover green anywhere
- [ ] All fintech copy replaced with Bayana Analytics copy per Section 3 map
- [ ] Mockup imagery shows hospital dashboard + AI chatbot concepts, not bank/spending UI
- [ ] Structural properties (sizes, spacing, animation timing) unchanged from Structural Pass ACCEPT
- [ ] No lorem ipsum / TODO / placeholder text anywhere in final output
