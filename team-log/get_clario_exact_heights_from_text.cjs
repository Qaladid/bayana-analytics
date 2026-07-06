const { chromium } = require('playwright');

(async () => {
  const b = await chromium.launch({ headless: true });
  const ctx = await b.newContext({ viewport: { width: 1440, height: 1400 } });
  const p = await ctx.newPage();
  await p.goto('https://clario.framer.website/', { waitUntil: 'networkidle', timeout: 60000 });
  await p.waitForTimeout(5000); // let animations settle

  const results = await p.evaluate(() => {
    const targets = [
      { name: 'Hero', query: 'Take control of your finances' },
      { name: 'How It Works', query: 'How Clario works' },
      { name: 'RealtimeCards', query: 'See your money in real time' },
      { name: 'Stats', query: 'Trusted by 3k+' },
      { name: 'Features', query: 'Designed for clarity' },
      { name: 'Comparison', query: 'smarter way to manage' },
      { name: 'Testimonial', query: 'Loved by individuals' },
      { name: 'Pricing', query: 'Simple plans.' },
      { name: 'FAQ', query: 'Got questions?' },
      { name: 'Blog', query: 'Explore the blog' },
      { name: 'FinalCTA', query: 'Ready to manage your money' },
    ];

    const allElements = Array.from(document.querySelectorAll('*'));
    const sectionInfo = [];

    targets.forEach(t => {
      // Find element containing query text
      const textEl = allElements.find(el => {
        const text = el.textContent || '';
        return text.includes(t.query) && el.children.length === 0; // leaf node preferred
      }) || allElements.find(el => {
        const text = el.textContent || '';
        return text.includes(t.query);
      });

      if (textEl) {
        // Walk up to find the section container (width > 1200, height > 100)
        let curr = textEl;
        let bestContainer = null;
        
        while (curr) {
          const rect = curr.getBoundingClientRect();
          if (rect.width > 1100 && rect.height > 100 && rect.height < 5000) {
            bestContainer = curr;
            break; // take the deepest full-width container
          }
          curr = curr.parentElement;
        }

        if (bestContainer) {
          const rect = bestContainer.getBoundingClientRect();
          sectionInfo.push({
            name: t.name,
            tagName: bestContainer.tagName,
            className: bestContainer.className.substring(0, 50),
            height: rect.height,
            top: rect.top + window.scrollY,
            bottom: rect.bottom + window.scrollY,
          });
        }
      }
    });

    // Also get the footer container
    const footerEl = document.querySelector('footer') || allElements.find(el => (el.textContent || '').includes('Quick Menu') && el.getBoundingClientRect().width > 1100);
    if (footerEl) {
      const rect = footerEl.getBoundingClientRect();
      sectionInfo.push({
        name: 'Footer',
        tagName: footerEl.tagName,
        className: footerEl.className.substring(0, 50),
        height: rect.height,
        top: rect.top + window.scrollY,
        bottom: rect.bottom + window.scrollY,
      });
    }

    return sectionInfo;
  });

  console.log(JSON.stringify(results, null, 2));
  await ctx.close();
  await b.close();
})().catch(e => { console.error(e); process.exit(1); });