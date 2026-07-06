const { chromium } = require('playwright');

(async () => {
  const b = await chromium.launch({ headless: true });
  const ctx = await b.newContext({ viewport: { width: 1440, height: 1400 } });
  const p = await ctx.newPage();
  await p.goto('https://clario.framer.website/', { waitUntil: 'networkidle', timeout: 60000 });
  await p.waitForTimeout(5000); // let animations settle

  const sections = await p.evaluate(() => {
    // Clario might not use semantic <section> tags, let's find the main elements by testing their text or layout
    const elements = Array.from(document.querySelectorAll('body > div > div > div, body > div > div > section, section, footer, [style*="background"]'));
    
    // Let's find sections specifically based on key content
    const targets = [
      { name: 'Hero', test: h => h.includes('Take control of your finances') },
      { name: 'How It Works', test: h => h.includes('How Clario works') },
      { name: 'RealtimeCards', test: h => h.includes('See your money in real time') },
      { name: 'Stats', test: h => h.includes('Trusted by 3k+') },
      { name: 'Features', test: h => h.includes('Designed for clarity') },
      { name: 'Comparison', test: h => h.includes('smarter way to manage') },
      { name: 'Testimonial', test: h => h.includes('Loved by individuals') },
      { name: 'Pricing', test: h => h.includes('Simple plans.') },
      { name: 'FAQ', test: h => h.includes('Got questions?') },
      { name: 'Blog', test: h => h.includes('Explore the blog') },
      { name: 'FinalCTA', test: h => h.includes('Ready to manage your money') },
    ];

    const results = [];
    const allDivs = Array.from(document.querySelectorAll('*'));
    
    // Find containers of these sections
    targets.forEach(t => {
      const match = allDivs.find(el => {
        const text = el.innerText || '';
        const rect = el.getBoundingClientRect();
        return t.test(text) && rect.width > 1000 && rect.height > 100;
      });
      if (match) {
        // Find the top-most wrapper container that is a direct child or near child of main layout
        let container = match;
        while (container.parentElement && container.parentElement.tagName !== 'BODY' && container.parentElement.getBoundingClientRect().height === container.getBoundingClientRect().height) {
          container = container.parentElement;
        }
        const rect = container.getBoundingClientRect();
        results.push({
          name: t.name,
          tag: container.tagName,
          height: rect.height,
          top: rect.top + window.scrollY,
          bottom: rect.bottom + window.scrollY,
          textSample: match.innerText.substring(0, 50).replace(/\n/g, ' ')
        });
      }
    });

    // Also get the footer
    const footer = document.querySelector('footer') || allDivs.find(el => (el.innerText || '').includes('Quick Menu') && el.getBoundingClientRect().width > 1000);
    if (footer) {
      const rect = footer.getBoundingClientRect();
      results.push({
        name: 'Footer',
        tag: footer.tagName,
        height: rect.height,
        top: rect.top + window.scrollY,
        bottom: rect.bottom + window.scrollY,
        textSample: 'Footer'
      });
    }

    return results;
  });

  console.log(JSON.stringify(sections, null, 2));
  await ctx.close();
  await b.close();
})().catch(e => { console.error(e); process.exit(1); });