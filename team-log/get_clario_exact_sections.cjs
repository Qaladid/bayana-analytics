const { chromium } = require('playwright');

(async () => {
  const b = await chromium.launch({ headless: true });
  const ctx = await b.newContext({ viewport: { width: 1440, height: 1400 } });
  const p = await ctx.newPage();
  await p.goto('https://clario.framer.website/', { waitUntil: 'networkidle', timeout: 60000 });
  await p.waitForTimeout(5000); // let animations settle

  const sections = await p.evaluate(() => {
    // On Framer sites, the main container is usually a div with id="main" or the first major full-width child of body.
    // Let's find the outermost container that has a high height.
    const outermost = Array.from(document.querySelectorAll('body > div')).find(el => el.getBoundingClientRect().height > 8000);
    if (!outermost) return { error: 'Outer container not found' };

    // Let's find the direct children of this outermost container, or walk down to find the list of sections
    let container = outermost;
    // Walk down to find the first level that has multiple vertical sibling containers making up the page
    while (container) {
      const children = Array.from(container.children).filter(el => {
        const r = el.getBoundingClientRect();
        return r.width > 1000 && r.height > 100;
      });
      if (children.length >= 8) {
        // This is the list of sections!
        return children.map((c, idx) => {
          const rect = c.getBoundingClientRect();
          // Find text content inside this section
          const text = c.innerText || '';
          const headings = Array.from(c.querySelectorAll('h1, h2, h3, h4, p, span'))
            .map(el => el.textContent.trim())
            .filter(t => t.length > 5 && t.length < 100)
            .slice(0, 3);

          return {
            index: idx,
            tagName: c.tagName,
            className: c.className,
            height: rect.height,
            top: rect.top + window.scrollY,
            bottom: rect.bottom + window.scrollY,
            headings
          };
        });
      }
      // Otherwise, walk into the largest child
      const nextContainer = Array.from(container.children).find(el => el.getBoundingClientRect().height > 8000);
      if (!nextContainer || nextContainer === container) break;
      container = nextContainer;
    }

    return { error: 'Could not find section children list' };
  });

  console.log(JSON.stringify(sections, null, 2));
  await ctx.close();
  await b.close();
})().catch(e => { console.error(e); process.exit(1); });