const { chromium } = require('playwright');
const URL = 'http://localhost:3456';
const CLARIO_URL = 'https://clario.framer.website/';

(async () => {
  const b = await chromium.launch({ headless: true });

  // Capture clone tokens
  const ctx = await b.newContext({ viewport: { width: 1440, height: 1400 } });
  const p = await ctx.newPage();
  await p.goto(URL, { waitUntil: 'networkidle', timeout: 30000 });
  await p.waitForTimeout(3000);

  const clone = await p.evaluate(() => {
    const h1 = document.querySelector('h1');
    const h1s = h1 ? getComputedStyle(h1) : null;
    const nav = document.querySelector('nav');
    const navs = nav ? getComputedStyle(nav) : null;
    const btn = Array.from(document.querySelectorAll('a')).find(a => (a.textContent||'').includes('Get Started'));
    const btns = btn ? getComputedStyle(btn) : null;
    const stepCard = document.querySelector('[class*="rounded-[30px]"]');
    const stepCardS = stepCard ? getComputedStyle(stepCard) : null;
    const subhead = Array.from(document.querySelectorAll('p')).find(p => (p.textContent||'').includes('money insights'));
    const subheadS = subhead ? getComputedStyle(subhead) : null;
    return {
      h1: h1s ? { font: h1s.fontFamily, size: h1s.fontSize, weight: h1s.fontWeight, ls: h1s.letterSpacing, lh: h1s.lineHeight, color: h1s.color, text: (h1.textContent||'').trim() } : null,
      nav: navs ? { height: nav.getBoundingClientRect().height, bg: navs.backgroundColor, px: navs.paddingLeft } : null,
      btn: btns ? { bg: btns.backgroundColor, radius: btns.borderRadius, padding: btns.padding, shadow: btns.boxShadow.slice(0,60) } : null,
      stepCard: stepCardS ? { radius: stepCardS.borderRadius, bg: stepCardS.backgroundColor, shadow: stepCardS.boxShadow.slice(0,60) } : null,
      subhead: subheadS ? { size: subheadS.fontSize, weight: subheadS.fontWeight, color: subheadS.color, lh: subheadS.lineHeight } : null,
      sectionCount: document.querySelectorAll('section').length,
      stepCards: document.querySelectorAll('[class*="rounded-\\[30px\\]"]').length,
    };
  });

  console.log('=== CLONE TOKENS ===');
  console.log(JSON.stringify(clone, null, 2));

  // Compare against baseline
  const baseline = require('./tokens/clario_baseline.json');
  const v1440 = baseline.viewports['1440x1400'];
  console.log('\n=== DIFF vs CLARIO BASELINE ===');
  console.log('h1 font:    clone=' + (clone.h1 && clone.h1.font ? clone.h1.font.slice(0,20) : '?') + ' | clario=' + (v1440.heroH1 ? v1440.heroH1.fontFamily.slice(0,20) : '?'));
  console.log('h1 size:    clone=' + (clone.h1 && clone.h1.size) + ' | clario=' + (v1440.heroH1 && v1440.heroH1.fontSize));
  console.log('h1 weight:  clone=' + (clone.h1 && clone.h1.weight) + ' | clario=' + (v1440.heroH1 && v1440.heroH1.fontWeight));
  console.log('h1 ls:      clone=' + (clone.h1 && clone.h1.ls) + ' | clario=' + (v1440.heroH1 && v1440.heroH1.letterSpacing));
  console.log('h1 text:    clone=' + (clone.h1 && clone.h1.text) + ' | clario=' + (v1440.heroH1 && v1440.heroH1.text));
  console.log('nav height: clone=' + (clone.nav && clone.nav.height) + ' | clario=' + (v1440.nav && v1440.nav.height));
  console.log('btn bg:     clone=' + (clone.btn && clone.btn.bg) + ' | clario=rgb(140, 255, 46)');
  console.log('btn radius: clone=' + (clone.btn && clone.btn.radius) + ' | clario=23px');
  console.log('subhead:    clone=' + JSON.stringify(clone.subhead) + ' | clario size=18px weight=400');
  console.log('sections:   clone=' + clone.sectionCount + ' | expected 11');
  console.log('stepCards:  clone=' + clone.stepCards);

  await b.close();
})().catch(e => { console.error(e.message); process.exit(1); });
