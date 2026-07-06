const { chromium } = require('playwright');
const URL = 'http://localhost:3456';

(async () => {
  const b = await chromium.launch({ headless: true });
  const ctx = await b.newContext({ viewport: { width: 1440, height: 1400 } });
  const p = await ctx.newPage();
  await p.goto(URL, { waitUntil: 'load', timeout: 60000 });
  await p.waitForTimeout(2000);

  const sections = await p.evaluate(() => {
    return Array.from(document.querySelectorAll('section')).map((sec, idx) => {
      const rect = sec.getBoundingClientRect();
      const heading = sec.querySelector('h1, h2, h3')?.textContent?.trim() || 'none';
      return {
        index: idx,
        id: sec.id || 'none',
        heading: heading.substring(0, 30),
        height: rect.height,
        top: rect.top,
        bottom: rect.bottom,
      };
    });
  });

  console.log(JSON.stringify(sections, null, 2));
  await ctx.close();
  await b.close();
})().catch(e => { console.error(e); process.exit(1); });