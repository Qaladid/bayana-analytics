const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const URL = 'http://localhost:3456';
const SHOT = path.resolve(__dirname, 'screenshots', 'clone');
fs.mkdirSync(SHOT, { recursive: true });
const VPS = [
  { name: '1440x1400', w: 1440, h: 1400 },
  { name: '1920x1200', w: 1920, h: 1200 },
  { name: '390x844', w: 390, h: 844 },
];
(async () => {
  const b = await chromium.launch({ headless: true });
  for (const vp of VPS) {
    const ctx = await b.newContext({ viewport: { width: vp.w, height: vp.h } });
    const p = await ctx.newPage();
    await p.goto(URL, { waitUntil: 'networkidle', timeout: 30000 });
    await p.waitForTimeout(3000);
    const f = path.join(SHOT, `${vp.name}_settled.png`);
    await p.screenshot({ path: f, fullPage: true });
    console.log(`saved ${path.basename(f)}`);
    await ctx.close();
  }
  await b.close();
})().catch(e => { console.error(e.message); process.exit(1); });
