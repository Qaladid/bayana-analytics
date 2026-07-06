#!/usr/bin/env node
/**
 * Deep-DOM sniper pass — corrects the outer-element issue from capture_baseline.cjs.
 * Framer nests real styled nodes inside data-framer-name wrappers.
 * This script walks DOWN to find the actual styled card/pill/button/grid.
 */
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const URL = 'https://clario.framer.website/';
const TOK_DIR = path.resolve(__dirname, 'tokens');

// Find the deepest descendant with a non-transparent bg + non-zero radius
const findStyledDescendant = (root, opts = {}) => {
  const { minRadius = 1, minBg = true } = opts;
  let best = null;
  const walk = (el) => {
    if (!el || el.nodeType !== 1) return;
    const s = getComputedStyle(el);
    const hasBg = s.backgroundColor && s.backgroundColor !== 'rgba(0, 0, 0, 0)' && s.backgroundColor !== 'transparent';
    const radius = parseFloat(s.borderRadius) || 0;
    if (radius >= minRadius && (!minBg || hasBg)) {
      if (!best || radius >= best.radius) {
        const r = el.getBoundingClientRect();
        best = {
          tag: el.tagName, cls: (el.className || '').toString().slice(0, 30),
          width: r.width, height: r.height, x: r.x, y: r.y,
          borderRadius: s.borderRadius, background: s.backgroundColor,
          boxShadow: s.boxShadow, padding: s.padding,
        };
        best.radius = radius;
      }
    }
    for (const child of el.children) walk(child);
  };
  walk(root);
  return best;
};

(async () => {
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 1400 }, deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  await page.goto(URL, { waitUntil: 'networkidle', timeout: 60000 });
  await page.waitForTimeout(8000); // fully settled

  const result = {};

  // 1. Deep step card — find inner styled card inside [data-framer-name="Step N"]
  result.stepCardsDeep = await page.evaluate(() => {
    const findStyled = (root) => {
      let best = null;
      const walk = (el) => {
        if (!el || el.nodeType !== 1) return;
        const s = getComputedStyle(el);
        const radius = parseFloat(s.borderRadius) || 0;
        const hasBg = s.backgroundColor && s.backgroundColor !== 'rgba(0, 0, 0, 0)' && s.backgroundColor !== 'transparent';
        const r = el.getBoundingClientRect();
        // look for white-ish card with radius and decent size
        if (radius >= 10 && r.width > 200 && r.height > 300) {
          if (!best || radius >= best._radius) {
            best = {
              tag: el.tagName, width: Math.round(r.width), height: Math.round(r.height),
              borderRadius: s.borderRadius, background: s.backgroundColor,
              boxShadow: s.boxShadow.slice(0, 200), padding: s.padding,
              _radius: radius,
            };
          }
        }
        for (const child of el.children) walk(child);
      };
      walk(root);
      return best;
    };
    const cards = Array.from(document.querySelectorAll('[data-framer-name]')).filter(el => /^Step \d$/.test(el.getAttribute('data-framer-name') || ''));
    return cards.slice(0, 3).map(c => ({ name: c.getAttribute('data-framer-name'), inner: findStyled(c) }));
  });

  // 2. Deep step pill — find the green pill inside step card
  result.stepPillDeep = await page.evaluate(() => {
    const step1 = document.querySelector('[data-framer-name="Step 1"]');
    if (!step1) return null;
    let best = null;
    const walk = (el) => {
      if (!el || el.nodeType !== 1) return;
      const txt = (el.textContent || '').trim();
      if (/^Step\s*\d$/.test(txt) && el.children.length <= 2) {
        const s = getComputedStyle(el);
        const r = el.getBoundingClientRect();
        const hasGreen = s.backgroundColor.includes('140') || s.backgroundColor.includes('255, 46') || s.color.includes('140');
        if (r.width > 40 && r.width < 120) {
          if (!best || hasGreen) {
            best = {
              text: txt, tag: el.tagName,
              width: Math.round(r.width), height: Math.round(r.height),
              background: s.backgroundColor, color: s.color,
              borderRadius: s.borderRadius, padding: s.padding,
              fontSize: s.fontSize, fontWeight: s.fontWeight, letterSpacing: s.letterSpacing,
            };
          }
        }
      }
      for (const child of el.children) walk(child);
    };
    walk(step1);
    // Also check the actual visible pill — look for small rounded element with green bg or green text
    if (!best) {
      const all = Array.from(step1.querySelectorAll('*'));
      for (const el of all) {
        const s = getComputedStyle(el);
        const r = el.getBoundingClientRect();
        const txt = (el.textContent || '').trim();
        if (/step/i.test(txt) && r.width > 30 && r.width < 150 && r.height < 40) {
          best = {
            text: txt, tag: el.tagName,
            width: Math.round(r.width), height: Math.round(r.height),
            background: s.backgroundColor, color: s.color,
            borderRadius: s.borderRadius, padding: s.padding,
            fontSize: s.fontSize, fontWeight: s.fontWeight, letterSpacing: s.letterSpacing,
            boxShadow: s.boxShadow.slice(0, 100),
          };
          break;
        }
      }
    }
    return best;
  });

  // 3. Real grid containers — search for elements with multiple card-like children
  result.gridsDeep = await page.evaluate(() => {
    const findGrid = (headingText) => {
      const all = Array.from(document.querySelectorAll('*'));
      const heading = all.find(el => (el.tagName === 'H2' || el.tagName === 'H1') && (el.textContent || '').toLowerCase().includes(headingText.toLowerCase()));
      if (!heading) return null;
      // walk up to find a container with 3+ children that are wide enough to be cards
      let el = heading;
      for (let i = 0; i < 15 && el; i++) {
        el = el.parentElement;
        if (!el) break;
        const s = getComputedStyle(el);
        const r = el.getBoundingClientRect();
        const kids = Array.from(el.children).filter(c => {
          const cr = c.getBoundingClientRect();
          return cr.width > 100 && cr.height > 100;
        });
        if (kids.length >= 3 && r.width > 600) {
          return {
            display: s.display, gridTemplateColumns: s.gridTemplateColumns,
            gridTemplateRows: s.gridTemplateRows, gap: s.gap, flexDirection: s.flexDirection,
            flexWrap: s.flexWrap, justifyContent: s.justifyContent,
            childCount: kids.length, width: Math.round(r.width),
            childWidths: kids.map(k => Math.round(k.getBoundingClientRect().width)),
            childHeights: kids.map(k => Math.round(k.getBoundingClientRect().height)),
            maxWidth: s.maxWidth, padding: s.padding,
          };
        }
      }
      return null;
    };
    return {
      realtime: findGrid('real time'),
      features: findGrid('Designed for clarity'),
      pricing: findGrid('Simple plans'),
      howitworks: findGrid('How Clario works'),
    };
  });

  // 4. Pricing — real prices + POPULAR badge
  result.pricingDeep = await page.evaluate(() => {
    // find all $-amount elements
    const prices = Array.from(document.querySelectorAll('h1, h2, h3, h4, p, div')).filter(el => {
      const t = (el.textContent || '').trim();
      return /^\$\d+/.test(t) && t.length < 25;
    }).map(el => {
      const s = getComputedStyle(el);
      const r = el.getBoundingClientRect();
      return { text: (el.textContent || '').trim(), fontSize: s.fontSize, fontWeight: s.fontWeight, color: s.color, y: Math.round(r.y) };
    });
    // find POPULAR badge
    const popular = Array.from(document.querySelectorAll('*')).find(e => (e.textContent || '').trim() === 'POPULAR');
    let popularStyle = null;
    if (popular) {
      const s = getComputedStyle(popular);
      const r = popular.getBoundingClientRect();
      popularStyle = { text: 'POPULAR', background: s.backgroundColor, color: s.color, borderRadius: s.borderRadius, fontSize: s.fontSize, padding: s.padding, width: Math.round(r.width), height: Math.round(r.height) };
    }
    // tier names
    const tiers = Array.from(document.querySelectorAll('h3, h4, p')).filter(el => /^(Starter|Pro|Team|Trusted)/.test((el.textContent || '').trim())).map(el => (el.textContent || '').trim().slice(0, 40));
    return { prices, popularBadge: popularStyle, tierNames: [...new Set(tiers)] };
  });

  // 5. Button REAL text color — check inner text node
  result.buttonTextColors = await page.evaluate(() => {
    const probe = (label) => {
      const btn = Array.from(document.querySelectorAll('a, button')).find(l => (l.textContent || '').includes(label));
      if (!btn) return null;
      // find the innermost text element
      let textEl = btn;
      const walk = (el) => {
        for (const c of el.children) {
          if ((c.textContent || '').includes(label) || (c.textContent || '').length > 0) {
            textEl = c;
            walk(c);
          }
        }
      };
      walk(btn);
      const s = getComputedStyle(textEl);
      return { label, innerTag: textEl.tagName, color: s.color, fontSize: s.fontSize, fontWeight: s.fontWeight, text: (textEl.textContent || '').trim().slice(0, 30) };
    };
    return {
      getStarted: probe('Get Started'),
      contact: probe('Contact'),
      waitlist: probe('Waitlist'),
    };
  });

  // 6. Hero badge + subhead + mockup — better selectors
  result.heroDeep = await page.evaluate(() => {
    const h1 = document.querySelector('h1');
    // badge: element with "All-in-One" that's small
    const badge = Array.from(document.querySelectorAll('div, span, p')).find(e => {
      const t = (e.textContent || '').trim();
      return t.includes('All-in-One') && t.length < 40 && e !== h1;
    });
    // subhead: p with > 60 chars near h1
    const allP = Array.from(document.querySelectorAll('p'));
    const subhead = allP.find(p => {
      const t = (p.textContent || '').trim();
      return t.includes('money insights') && t.length > 60;
    });
    // mockup: largest img in hero area
    const heroImgs = Array.from(document.querySelectorAll('img')).filter(img => {
      const r = img.getBoundingClientRect();
      return r.y < 900 && r.width > 300;
    });
    const mockup = heroImgs.sort((a, b) => b.getBoundingClientRect().width - a.getBoundingClientRect().width)[0];

    const out = {};
    if (badge) {
      const s = getComputedStyle(badge); const r = badge.getBoundingClientRect();
      out.badge = { text: (badge.textContent || '').trim(), y: Math.round(r.y), height: Math.round(r.height), x: Math.round(r.x), width: Math.round(r.width), background: s.backgroundColor, color: s.color, borderRadius: s.borderRadius, padding: s.padding, fontSize: s.fontSize };
    }
    if (subhead) {
      const s = getComputedStyle(subhead); const r = subhead.getBoundingClientRect();
      out.subhead = { text: (subhead.textContent || '').trim().slice(0, 50) + '...', y: Math.round(r.y), height: Math.round(r.height), width: Math.round(r.width), fontSize: s.fontSize, fontWeight: s.fontWeight, color: s.color, lineHeight: s.lineHeight };
    }
    if (mockup) {
      const r = mockup.getBoundingClientRect();
      out.mockup = { y: Math.round(r.y), height: Math.round(r.height), x: Math.round(r.x), width: Math.round(r.width), src: (mockup.src || '').slice(0, 60) };
    }
    return out;
  });

  // 7. Section backgrounds — detect where dark→light transitions happen
  result.sectionBgs = await page.evaluate(() => {
    const headings = Array.from(document.querySelectorAll('h1, h2'));
    return headings.slice(0, 15).map(h => {
      const r = h.getBoundingClientRect();
      // find nearest ancestor with opaque bg
      let el = h; let bg = 'transparent';
      for (let i = 0; i < 10 && el; i++) {
        const s = getComputedStyle(el);
        if (s.backgroundColor && s.backgroundColor !== 'rgba(0, 0, 0, 0)' && s.backgroundColor !== 'transparent') {
          bg = s.backgroundColor;
          break;
        }
        el = el.parentElement;
      }
      return { text: (h.textContent || '').trim().slice(0, 50), y: Math.round(r.y), bg };
    });
  });

  // 8. Footer
  result.footer = await page.evaluate(() => {
    const footer = document.querySelector('footer') || Array.from(document.querySelectorAll('[data-framer-name]')).find(e => /footer/i.test(e.getAttribute('data-framer-name') || ''));
    if (!footer) return null;
    const s = getComputedStyle(footer);
    const r = footer.getBoundingClientRect();
    return { text: (footer.textContent || '').trim().slice(0, 200), bg: s.backgroundColor, height: Math.round(r.height), y: Math.round(r.y) };
  });

  // Write
  const outPath = path.join(TOK_DIR, 'clario_deep.json');
  fs.writeFileSync(outPath, JSON.stringify(result, null, 2));
  console.log('=== DEEP SNIPER WRITTEN: ' + outPath + ' ===');

  // Summary
  console.log('\n--- Step cards (inner) ---');
  (result.stepCardsDeep || []).forEach(c => console.log(`  ${c.name}: ${c.inner ? c.inner.width + 'x' + c.inner.height + ' r=' + c.inner.borderRadius + ' bg=' + c.inner.background.slice(0, 30) : 'null'}`));
  console.log('\n--- Step pill (deep) ---');
  console.log('  ', result.stepPillDeep);
  console.log('\n--- Grids (deep) ---');
  console.log('  realtime:', JSON.stringify(result.gridsDeep && result.gridsDeep.realtime));
  console.log('  features:', JSON.stringify(result.gridsDeep && result.gridsDeep.features));
  console.log('  pricing:', JSON.stringify(result.gridsDeep && result.gridsDeep.pricing));
  console.log('  howitworks:', JSON.stringify(result.gridsDeep && result.gridsDeep.howitworks));
  console.log('\n--- Pricing (deep) ---');
  console.log('  prices:', JSON.stringify(result.pricingDeep && result.pricingDeep.prices));
  console.log('  popular:', JSON.stringify(result.pricingDeep && result.pricingDeep.popularBadge));
  console.log('  tiers:', result.pricingDeep && result.pricingDeep.tierNames);
  console.log('\n--- Button text colors (deep) ---');
  console.log('  ', JSON.stringify(result.buttonTextColors));
  console.log('\n--- Hero (deep) ---');
  console.log('  ', JSON.stringify(result.heroDeep));
  console.log('\n--- Section backgrounds ---');
  (result.sectionBgs || []).forEach(s => console.log(`  y=${s.y} bg=${s.bg.slice(0,25)} | ${s.text}`));
  console.log('\n--- Footer ---');
  console.log('  ', JSON.stringify(result.footer));

  await browser.close();
})().catch(e => { console.error('FATAL:', e.message); console.error(e.stack); process.exit(1); });
