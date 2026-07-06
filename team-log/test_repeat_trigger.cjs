const { chromium } = require('playwright');
const URL = 'http://localhost:3456';

(async () => {
  const b = await chromium.launch({ headless: true });
  const ctx = await b.newContext({ viewport: { width: 1440, height: 1400 } });
  const p = await ctx.newPage();
  await p.goto(URL, { waitUntil: 'load', timeout: 60000 });
  await p.waitForTimeout(2000);

  // Function to get computed styles of various elements
  const getOpacities = async () => {
    return await p.evaluate(() => {
      const headings = Array.from(document.querySelectorAll('section h2, section h3'));
      return headings.map(h => {
        const style = getComputedStyle(h);
        return {
          text: h.textContent.trim().substring(0, 30),
          opacity: style.opacity,
          transform: style.transform
        };
      });
    });
  };

  console.log("Initial state (top of page):");
  console.log(await getOpacities());

  // Scroll down
  console.log("\nScrolling to bottom...");
  await p.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 300) {
      window.scrollTo(0, y);
      await new Promise(r => setTimeout(r, 50));
    }
    window.scrollTo(0, document.body.scrollHeight);
  });
  await p.waitForTimeout(2000);

  console.log("\nState at bottom of page:");
  console.log(await getOpacities());

  // Scroll back to top
  console.log("\nScrolling back to top...");
  await p.evaluate(async () => {
    for (let y = document.body.scrollHeight; y > 0; y -= 300) {
      window.scrollTo(0, y);
      await new Promise(r => setTimeout(r, 50));
    }
    window.scrollTo(0, 0);
  });
  await p.waitForTimeout(2000);

  console.log("\nState back at top of page:");
  console.log(await getOpacities());

  await ctx.close();
  await b.close();
  console.log("\nAnimation repeat trigger test completed.");
})().catch(e => { console.error(e); process.exit(1); });