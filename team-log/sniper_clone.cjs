const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const URL = 'http://localhost:3456';
const OUT = path.resolve(__dirname, 'tokens', 'clone_baseline.json');

(async () => {
  const b = await chromium.launch({ headless: true });
  const result = { url: URL, capturedAt: new Date().toISOString(), viewports: {} };

  for (const [name, w, h] of [['1440x1400',1440,1400],['1920x1200',1920,1200],['390x844',390,844]]) {
    const ctx = await b.newContext({ viewport: { width: w, height: h } });
    const p = await ctx.newPage();
    const errors = [];
    p.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
    await p.goto(URL, { waitUntil: 'networkidle', timeout: 30000 });
    await p.waitForTimeout(4000);

    const data = await p.evaluate(() => {
      const cs = (el) => el ? getComputedStyle(el) : null;
      const rect = (el) => el ? el.getBoundingClientRect() : null;
      const h1 = document.querySelector('h1');
      const h1s = cs(h1);
      const nav = document.querySelector('nav');
      const navs = cs(nav);
      const navRect = rect(nav);
      const ctaBtn = Array.from(document.querySelectorAll('a')).find(a => (a.textContent||'').includes('Get Started'));
      const ctaS = cs(ctaBtn);
      const ctaR = rect(ctaBtn);
      const contactBtn = Array.from(document.querySelectorAll('a')).find(a => (a.textContent||'').trim() === 'Contact');
      const waitlistBtn = Array.from(document.querySelectorAll('a')).find(a => (a.textContent||'').includes('Waitlist'));
      const stepPill = Array.from(document.querySelectorAll('p,span')).find(e => (e.textContent||'').trim().match(/^Step \d$/));
      const stepPillS = cs(stepPill);
      const stepPillR = rect(stepPill);
      const stepCards = Array.from(document.querySelectorAll('[class*="rounded"]')).filter(el => {
        const t = el.textContent || '';
        return t.match(/Step [123]/) && t.match(/Connect your|Track your|Set goals/);
      }).slice(0,3);
      const realtimeCards = Array.from(document.querySelectorAll('h3')).filter(h => ['Smart Dashboard','Cashflow Overview','Spending Breakdown','Savings Goal'].includes(h.textContent.trim()));
      const featureCards = Array.from(document.querySelectorAll('h3')).filter(h => ['Multi-account sync','Goal tracking','Custom categories','Weekly reports','Spending limits','Secure & private'].includes(h.textContent.trim()));
      const priceCards = Array.from(document.querySelectorAll('span,div')).filter(e => (e.textContent||'').trim().match(/^\$29$/) || (e.textContent||'').trim().match(/^\$49$/));
      const popularBadge = Array.from(document.querySelectorAll('span')).find(e => (e.textContent||'').trim() === 'POPULAR');

      // Section presence
      const bodyText = document.body.innerText;
      const sections = {
        nav: !!nav,
        hero: bodyText.includes('Take control of your finances'),
        realtime: bodyText.includes('See your money in real time'),
        howitworks: bodyText.includes('How Clario works'),
        stats: bodyText.includes('Trusted by 3k+'),
        features: bodyText.includes('Designed for clarity'),
        comparison: bodyText.includes('smarter way to manage'),
        testimonial: bodyText.includes('Loved by individuals'),
        pricing: bodyText.includes('Simple plans.'),
        faq: bodyText.includes('Got questions?'),
        blog: bodyText.includes('Explore the blog'),
        finalcta: bodyText.includes('Ready to manage your money'),
        footer: !!document.querySelector('footer'),
      };

      // Animation
      const framerMotion = document.querySelectorAll('[data-framer-appear-id]').length;
      const motionDivs = document.querySelectorAll('[style*="opacity"]').length;
      const bodyStyle = cs(document.body);

      // Em-dash check
      const h1Text = h1 ? h1.textContent : '';
      const hasEmDash = h1Text.includes('\u2014');

      // Button dedupe
      const ctaTextCount = ctaBtn ? (ctaBtn.textContent.match(/Get Started Free/g)||[]).length : -1;

      return {
        heroH1: h1 ? {
          text: h1Text,
          fontFamily: h1s.fontFamily,
          fontSize: h1s.fontSize,
          fontWeight: h1s.fontWeight,
          letterSpacing: h1s.letterSpacing,
          lineHeight: h1s.lineHeight,
          color: h1s.color,
          width: rect(h1).width,
          x: rect(h1).x,
          y: rect(h1).y,
          hasEmDash,
        } : null,
        nav: nav ? {
          height: navRect.height,
          width: navRect.width,
          bg: navs.background,
          paddingX: navs.paddingLeft,
        } : null,
        ctaButton: ctaBtn ? {
          width: ctaR.width,
          height: ctaR.height,
          padding: ctaS.padding,
          borderRadius: ctaS.borderRadius,
          background: ctaS.background,
          color: ctaS.color,
          boxShadow: ctaS.boxShadow,
          fontSize: ctaS.fontSize,
          textContent: ctaBtn.textContent.trim(),
          textCount: ctaTextCount,
        } : null,
        stepPill: stepPill ? {
          text: stepPill.textContent.trim(),
          background: stepPillS.background,
          color: stepPillS.color,
          borderRadius: stepPillS.borderRadius,
          padding: stepPillS.padding,
          fontSize: stepPillS.fontSize,
          fontWeight: stepPillS.fontWeight,
          letterSpacing: stepPillS.letterSpacing,
          width: stepPillR.width,
          height: stepPillR.height,
        } : null,
        stepCards: stepCards.map(c => {
          const s = cs(c);
          const r = rect(c);
          return { width: r.width, height: r.height, borderRadius: s.borderRadius, background: s.backgroundColor, boxShadow: s.boxShadow, padding: s.padding };
        }),
        realtimeCardCount: realtimeCards.length,
        featureCardCount: featureCards.length,
        priceCardCount: priceCards.length,
        popularBadge: popularBadge ? { text: popularBadge.textContent.trim(), visible: popularBadge.offsetParent !== null } : null,
        sections,
        animation: { framerAppearElements: framerMotion, opacityStyledDivs: motionDivs },
        consoleErrors: [],
        bodyBg: bodyStyle.backgroundColor,
        bodyFont: bodyStyle.fontFamily,
      };
    });
    data.consoleErrors = errors;
    result.viewports[name] = data;
    await ctx.close();
  }

  fs.writeFileSync(OUT, JSON.stringify(result, null, 2));
  console.log('saved ' + OUT);
  await b.close();
})().catch(e => { console.error(e.message); process.exit(1); });
