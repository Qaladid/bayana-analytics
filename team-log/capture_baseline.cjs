#!/usr/bin/env node
/**
 * Phase A1 — Live baseline capture for Clario.
 * Outputs:
 *   team-log/screenshots/clario/{viewport}_{initial|settled}.png
 *   team-log/tokens/clario_baseline.json
 *   team-log/tokens/animation_scan.json
 * Usage: node team-log/capture_baseline.cjs
 */
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const URL = 'https://clario.framer.website/';
const ROOT = path.resolve(__dirname);
const SHOT_DIR = path.join(ROOT, 'screenshots', 'clario');
const TOK_DIR = path.join(ROOT, 'tokens');
fs.mkdirSync(SHOT_DIR, { recursive: true });
fs.mkdirSync(TOK_DIR, { recursive: true });

const VIEWPORTS = [
  { name: '1440x1400', width: 1440, height: 1400, full: true },
  { name: '1920x1200', width: 1920, height: 1200, full: true },
  { name: '390x844', width: 390, height: 844, full: true },
];

const sniper = async (page) => {
  // Hero h1 typography
  const heroH1 = await page.evaluate(() => {
    const h1 = document.querySelector('h1');
    if (!h1) return null;
    const s = getComputedStyle(h1);
    const r = h1.getBoundingClientRect();
    return {
      text: (h1.textContent || '').trim(),
      fontFamily: s.fontFamily,
      fontSize: s.fontSize,
      fontWeight: s.fontWeight,
      letterSpacing: s.letterSpacing,
      lineHeight: s.lineHeight,
      color: s.color,
      width: r.width,
      x: r.x,
      y: r.y,
    };
  });

  // Nav metrics
  const nav = await page.evaluate(() => {
    const navEl = document.querySelector('nav') || document.querySelector('[data-framer-name="Navigation"]') || document.querySelector('header');
    if (!navEl) return null;
    const s = getComputedStyle(navEl);
    const r = navEl.getBoundingClientRect();
    const links = Array.from(navEl.querySelectorAll('a, [data-styles-preset]')).slice(0, 8).map(a => {
      const cs = getComputedStyle(a);
      return { text: (a.textContent || '').trim().slice(0, 30), fontSize: cs.fontSize, fontWeight: cs.fontWeight, color: cs.color };
    });
    return { height: r.height, width: r.width, x: r.x, y: r.y, bg: s.backgroundColor, paddingX: s.paddingLeft, links };
  });

  // CTA buttons
  const ctaButtons = await page.evaluate(() => {
    const labels = ['Get Started Free', 'Get Started', 'Contact', 'Contact us', 'Waitlist'];
    const out = {};
    for (const label of labels) {
      const btn = Array.from(document.querySelectorAll('a, button')).find(l => (l.textContent || '').includes(label));
      if (!btn) { out[label] = null; continue; }
      const s = getComputedStyle(btn);
      const r = btn.getBoundingClientRect();
      out[label] = {
        width: r.width, height: r.height, padding: s.padding, borderRadius: s.borderRadius,
        background: s.backgroundColor, color: s.color, boxShadow: s.boxShadow,
        fontSize: s.fontSize, fontWeight: s.fontWeight,
      };
    }
    return out;
  });

  // Step cards
  const stepCards = await page.evaluate(() => {
    const cards = Array.from(document.querySelectorAll('[data-framer-name]')).filter(el => /Step \d/.test(el.getAttribute('data-framer-name') || ''));
    return cards.slice(0, 3).map(c => {
      const s = getComputedStyle(c);
      const r = c.getBoundingClientRect();
      return {
        name: c.getAttribute('data-framer-name'),
        width: r.width, height: r.height, borderRadius: s.borderRadius,
        background: s.backgroundColor, boxShadow: s.boxShadow, padding: s.padding,
      };
    });
  });

  // Step pill
  const stepPill = await page.evaluate(() => {
    const pill = Array.from(document.querySelectorAll('span, div, p')).find(e => /^\s*Step\s*\d\s*$/.test((e.textContent || '').trim()));
    if (!pill) return null;
    const s = getComputedStyle(pill);
    return {
      text: (pill.textContent || '').trim(),
      background: s.backgroundColor, color: s.color, borderRadius: s.borderRadius,
      padding: s.padding, border: s.border, fontSize: s.fontSize, fontWeight: s.fontWeight,
      letterSpacing: s.letterSpacing,
    };
  });

  // Grid template columns for realtime, features, pricing
  const grids = await page.evaluate(() => {
    const find = (kw) => {
      const all = Array.from(document.querySelectorAll('*'));
      // find section heading containing kw, then nearest grid container after it
      const heading = all.find(el => (el.tagName === 'H2' || el.tagName === 'H1') && (el.textContent || '').toLowerCase().includes(kw.toLowerCase()));
      if (!heading) return null;
      let el = heading.parentElement;
      for (let i = 0; i < 8 && el; i++) {
        const s = getComputedStyle(el);
        if (s.display === 'grid' || s.display === 'flex') {
          const r = el.getBoundingClientRect();
          return { display: s.display, gridTemplateColumns: s.gridTemplateColumns, gap: s.gap, childCount: el.children.length, width: r.width };
        }
        el = el.parentElement;
      }
      return null;
    };
    return {
      realtime: find('real time'),
      features: find('Designed for clarity'),
      pricing: find('Simple plans'),
    };
  });

  // Hero element y-offsets (badge → h1 → subhead → CTA → mockup)
  const heroOffsets = await page.evaluate(() => {
    const find = (sel) => {
      const el = document.querySelector(sel);
      if (!el) return null;
      const r = el.getBoundingClientRect();
      return { y: r.y, height: r.height, x: r.x, width: r.width };
    };
    // Badge: small pill with "All-in-One"
    const badge = Array.from(document.querySelectorAll('span, div, p')).find(e => /All-in-One/i.test((e.textContent || '').trim()) && (e.textContent || '').trim().length < 40);
    const h1 = document.querySelector('h1');
    // subhead: first p after h1 with > 40 chars
    const subhead = h1 ? Array.from(h1.parentElement.querySelectorAll('p')).find(p => (p.textContent || '').length > 40 && p !== h1) : null;
    const cta = Array.from(document.querySelectorAll('a, button')).find(l => (l.textContent || '').includes('Get Started'));
    // mockup: first img after CTA
    const mockup = cta ? Array.from(cta.parentElement.parentElement.querySelectorAll('img')).find(img => img.getBoundingClientRect().height > 100) : null;
    return {
      badge: badge ? { y: badge.getBoundingClientRect().y, height: badge.getBoundingClientRect().height } : null,
      h1: h1 ? { y: h1.getBoundingClientRect().y, height: h1.getBoundingClientRect().height } : null,
      subhead: subhead ? { y: subhead.getBoundingClientRect().y, height: subhead.getBoundingClientRect().height } : null,
      cta: cta ? { y: cta.getBoundingClientRect().y, height: cta.getBoundingClientRect().height } : null,
      mockup: mockup ? { y: mockup.getBoundingClientRect().y, height: mockup.getBoundingClientRect().height } : null,
    };
  });

  return { heroH1, nav, ctaButtons, stepCards, stepPill, grids, heroOffsets };
};

const animationScan = async (page) => {
  return await page.evaluate(() => {
    const results = { animations: [], tech: {} };
    const allEls = document.querySelectorAll('*');
    const cssAnimated = [];
    let count = 0;
    allEls.forEach(el => {
      if (count > 200) return;
      const s = getComputedStyle(el);
      if (s.animationName && s.animationName !== 'none') {
        cssAnimated.push({ tag: el.tagName, cls: (el.className || '').toString().slice(0, 40), animation: s.animationName, duration: s.animationDuration, delay: s.animationDelay, timing: s.animationTimingFunction });
        count++;
      }
    });
    results.animations = cssAnimated.slice(0, 15);
    const framerAppear = document.querySelectorAll('[data-framer-appear-id]');
    results.tech.framerAppearElements = framerAppear.length;
    results.tech.framerAppearSample = Array.from(framerAppear).slice(0, 12).map(el => ({
      id: el.getAttribute('data-framer-appear-id'),
      tag: el.tagName,
      name: el.getAttribute('data-framer-name') || '',
      style: { opacity: el.style.opacity, transform: el.style.transform, transition: el.style.transition }
    }));
    // scroll effects: elements with data-scroll or framer scroll variants
    results.tech.scrollEffectElements = document.querySelectorAll('[data-scroll], [data-framer-scroll]').length;
    return results;
  });
};

const pricingBehavior = async (page) => {
  // Check if monthly/yearly toggle exists and switches values
  const info = await page.evaluate(() => {
    const monthly = Array.from(document.querySelectorAll('*')).find(e => (e.textContent || '').trim() === 'Monthly');
    const yearly = Array.from(document.querySelectorAll('*')).find(e => (e.textContent || '').trim() === 'Yearly');
    // capture starter price text
    const starter = Array.from(document.querySelectorAll('h2, h3, p, div')).find(e => /\$\d+/.test((e.textContent || '').trim()) && (e.textContent || '').trim().length < 20);
    return {
      hasMonthly: !!monthly, hasYearly: !!yearly,
      starterPriceText: starter ? (starter.textContent || '').trim() : null,
      monthlyClickable: monthly ? monthly.tagName + ' ' + (monthly.getAttribute('role') || '') : null,
    };
  });
  // Try clicking yearly and see if price changes
  let yearPrice = null;
  try {
    const yearlyBtn = await page.evaluate(() => {
      const e = Array.from(document.querySelectorAll('*')).find(e => (e.textContent || '').trim() === 'Yearly');
      if (e) { e.click(); return true; }
      return false;
    });
    if (yearlyBtn) {
      await page.waitForTimeout(500);
      yearPrice = await page.evaluate(() => {
        const starter = Array.from(document.querySelectorAll('h2, h3, p, div')).find(e => /\$\d+/.test((e.textContent || '').trim()) && (e.textContent || '').trim().length < 20);
        return starter ? (starter.textContent || '').trim() : null;
      });
    }
  } catch (e) {}
  return { ...info, yearPriceAfterClick: yearPrice, toggleFunctional: yearPrice !== null && yearPrice !== info.starterPriceText };
};

const faqModel = async (page) => {
  return await page.evaluate(() => {
    // Check if FAQ items are expandable (details/summary, or buttons with aria-expanded)
    const faqHeading = Array.from(document.querySelectorAll('h2, h1')).find(e => /question|faq/i.test((e.textContent || '').trim()));
    const details = document.querySelectorAll('details, summary');
    const expandable = document.querySelectorAll('[aria-expanded], button[aria-controls]');
    const numberedItems = Array.from(document.querySelectorAll('*')).filter(e => /^0[1-6]$/.test((e.textContent || '').trim())).length;
    return {
      hasFaqHeading: !!faqHeading,
      detailsCount: details.length,
      expandableCount: expandable.length,
      numberedItemCount: numberedItems,
      isAccordion: expandable.length > 0 || details.length > 0,
    };
  });
};

const blogLinks = async (page) => {
  return await page.evaluate(() => {
    const posts = Array.from(document.querySelectorAll('a[href*="/blog"]')).slice(0, 6).map(a => ({
      href: a.getAttribute('href'),
      text: (a.textContent || '').trim().slice(0, 60),
    }));
    return { count: posts.length, sample: posts };
  });
};

(async () => {
  const browser = await chromium.launch({ headless: true });
  const baseline = { url: URL, capturedAt: new Date().toISOString(), viewports: {} };

  for (const vp of VIEWPORTS) {
    const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height }, deviceScaleFactor: 1 });
    const page = await ctx.newPage();
    console.log(`\n=== ${vp.name} ===`);

    // Initial load capture — capture asap after navigation, animation mid-play
    await page.goto(URL, { waitUntil: 'domcontentloaded', timeout: 45000 });
    await page.waitForTimeout(400); // let entrance start but not finish
    const initialPath = path.join(SHOT_DIR, `${vp.name}_initial.png`);
    await page.screenshot({ path: initialPath, fullPage: vp.full });
    console.log(`  initial: ${path.basename(initialPath)}`);

    // Settled — wait 10s
    await page.waitForTimeout(10000);
    const settledPath = path.join(SHOT_DIR, `${vp.name}_settled.png`);
    await page.screenshot({ path: settledPath, fullPage: vp.full });
    console.log(`  settled: ${path.basename(settledPath)}`);

    // Run sniper only on the two desktop viewports (mobile may collapse layouts)
    if (vp.width >= 1440) {
      const tokens = await sniper(page);
      baseline.viewports[vp.name] = tokens;
      console.log(`  sniper: hero h1 = ${tokens.heroH1 ? tokens.heroH1.fontSize + ' ' + tokens.heroH1.fontWeight : 'null'}`);
    }

    // Animation scan only on primary desktop
    if (vp.name === '1440x1400') {
      baseline.animationScan = await animationScan(page);
      console.log(`  anim: appear elements = ${baseline.animationScan.tech.framerAppearElements}`);
      baseline.pricingBehavior = await pricingBehavior(page);
      console.log(`  pricing: toggle functional = ${baseline.pricingBehavior.toggleFunctional}`);
      baseline.faqModel = await faqModel(page);
      console.log(`  faq: accordion = ${baseline.faqModel.isAccordion} (expandable=${baseline.faqModel.expandableCount})`);
      baseline.blogLinks = await blogLinks(page);
      console.log(`  blog: ${baseline.blogLinks.count} links, sample=${baseline.blogLinks.sample[0] && baseline.blogLinks.sample[0].href}`);
    }

    await ctx.close();
  }

  // Write baseline JSON
  const baselinePath = path.join(TOK_DIR, 'clario_baseline.json');
  fs.writeFileSync(baselinePath, JSON.stringify(baseline, null, 2));
  console.log(`\n=== BASELINE WRITTEN: ${baselinePath} ===`);

  // Summary
  const v1440 = baseline.viewports['1440x1400'] || {};
  const v1920 = baseline.viewports['1920x1200'] || {};
  console.log('\n=== KEY TOKEN SUMMARY ===');
  console.log(`Hero h1 @1440: ${v1440.heroH1 ? v1440.heroH1.fontSize + ' / ' + v1440.heroH1.fontWeight + ' / ' + v1440.heroH1.letterSpacing : 'null'}`);
  console.log(`Hero h1 @1920: ${v1920.heroH1 ? v1920.heroH1.fontSize + ' / ' + v1920.heroH1.fontWeight + ' / ' + v1920.heroH1.letterSpacing : 'null'}`);
  console.log(`Fluid h1: ${v1440.heroH1 && v1920.heroH1 && v1440.heroH1.fontSize !== v1920.heroH1.fontSize ? 'YES (sizes differ)' : 'NO (same size)'}`);
  console.log(`Nav height: ${v1440.nav ? v1440.nav.height : 'null'}`);
  console.log(`Step cards: ${(v1440.stepCards || []).length}`);
  console.log(`Step pill bg: ${v1440.stepPill ? v1440.stepPill.background : 'null'}`);
  console.log(`Realtime grid: ${JSON.stringify(v1440.grids && v1440.grids.realtime)}`);
  console.log(`Features grid: ${JSON.stringify(v1440.grids && v1440.grids.features)}`);
  console.log(`Pricing grid: ${JSON.stringify(v1440.grids && v1440.grids.pricing)}`);
  console.log(`Appear elements: ${baseline.animationScan ? baseline.animationScan.tech.framerAppearElements : 'null'}`);
  console.log(`Pricing toggle functional: ${baseline.pricingBehavior ? baseline.pricingBehavior.toggleFunctional : 'null'}`);
  console.log(`FAQ accordion: ${baseline.faqModel ? baseline.faqModel.isAccordion : 'null'}`);

  await browser.close();
})().catch(e => { console.error('FATAL:', e.message); console.error(e.stack); process.exit(1); });
