const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const URL = 'http://localhost:3456';
(async () => {
  const b = await chromium.launch({ headless: true, executablePath: '/home/qaladid/.cache/ms-playwright/chromium-1228/chrome-linux64/chrome' });
  const ctx = await b.newContext({ viewport: { width: 1440, height: 1400 } });
  const p = await ctx.newPage();

  // Capture animation: record opacity of key elements at 50ms intervals during load
  const timings = [];
  const start = Date.now();
  p.on('load', async () => {
    for (let t = 0; t < 3000; t += 100) {
      await p.waitForTimeout(100);
      const state = await p.evaluate(() => {
        const h1 = document.querySelector('h1');
        const badge = document.querySelector('[class*="rounded-full"]');
        const cta = Array.from(document.querySelectorAll('a')).find(a => (a.textContent||'').includes('Get Started'));
        const step1 = Array.from(document.querySelectorAll('p')).find(e => (e.textContent||'').trim() === 'Step 1');
        return {
          h1Opacity: h1 ? getComputedStyle(h1).opacity : null,
          ctaOpacity: cta ? getComputedStyle(cta).opacity : null,
          step1Visible: step1 ? step1.getBoundingClientRect().top < 1400 : false,
        };
      });
      timings.push({ t: Date.now() - start, ...state });
    }
  });

  await p.goto(URL, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await p.waitForTimeout(4000);

  // Now measure CTA inner span + step card mockup heights
  const deep = await p.evaluate(() => {
    const ctaLink = Array.from(document.querySelectorAll('a')).find(a => (a.textContent||'').includes('Get Started'));
    const ctaSpan = ctaLink ? ctaLink.querySelector('span') : null;
    const ctaS = ctaSpan ? getComputedStyle(ctaSpan) : null;
    const ctaR = ctaSpan ? ctaSpan.getBoundingClientRect() : null;

    const contactLink = Array.from(document.querySelectorAll('a')).find(a => (a.textContent||'').trim() === 'Contact');
    const contactSpan = contactLink ? contactLink.querySelector('span') : null;
    const contactS = contactSpan ? getComputedStyle(contactSpan) : null;
    const contactR = contactSpan ? contactSpan.getBoundingClientRect() : null;

    const waitlistLink = Array.from(document.querySelectorAll('a')).find(a => (a.textContent||'').includes('Waitlist'));
    const waitlistSpan = waitlistLink ? waitlistLink.querySelector('span') : null;
    const waitlistS = waitlistSpan ? getComputedStyle(waitlistSpan) : null;
    const waitlistR = waitlistSpan ? waitlistSpan.getBoundingClientRect() : null;

    // Step card mockup height
    const stepMockup = document.querySelector('[class*="h-[200px]"]');
    const stepMockupR = stepMockup ? stepMockup.getBoundingClientRect() : null;

    // Section heights
    const sections = Array.from(document.querySelectorAll('section'));
    const sectionHeights = sections.map(s => ({ id: s.id || 'none', height: s.getBoundingClientRect().height }));

    // Check for horizontal overflow
    const scrollWidth = document.documentElement.scrollWidth;

    return {
      ctaSpan: ctaS ? { width: ctaR.width, height: ctaR.height, padding: ctaS.padding, borderRadius: ctaS.borderRadius, background: ctaS.background, color: ctaS.color, boxShadow: ctaS.boxShadow, fontSize: ctaS.fontSize } : null,
      contactSpan: contactS ? { width: contactR.width, height: contactR.height, padding: contactS.padding, borderRadius: contactS.borderRadius, background: contactS.background, color: contactS.color, boxShadow: contactS.boxShadow } : null,
      waitlistSpan: waitlistS ? { width: waitlistR.width, height: waitlistR.height, padding: waitlistS.padding, borderRadius: waitlistS.borderRadius, background: waitlistS.background, color: waitlistS.color } : null,
      stepMockupHeight: stepMockupR ? stepMockupR.height : null,
      sectionHeights,
      scrollWidth,
      viewportWidth: window.innerWidth,
    };
  });

  // Find when h1 first reached opacity 1
  const h1Settled = timings.find(t => t.h1Opacity === '1');
  const ctaSettled = timings.find(t => t.ctaOpacity === '1');

  console.log(JSON.stringify({
    animation: {
      h1SettledAt: h1Settled ? h1Settled.t + 'ms' : 'not settled',
      ctaSettledAt: ctaSettled ? ctaSettled.t + 'ms' : 'not settled',
      sampleTimings: timings.filter((_, i) => i % 5 === 0).map(t => ({ t: t.t, h1: t.h1Opacity, cta: t.ctaOpacity })),
    },
    deep,
  }, null, 2));
  await b.close();
})().catch(e => { console.error(e.message); process.exit(1); });
