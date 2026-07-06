const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const CLARIO = path.resolve(__dirname, 'screenshots/clario');
const CLONE = path.resolve(__dirname, 'screenshots/clone');
const vps = ['1440x1400_settled', '1920x1200_settled', '390x844_settled'];
(async () => {
  const b = await chromium.launch({ headless: true, executablePath: '/home/qaladid/.cache/ms-playwright/chromium-1228/chrome-linux64/chrome' });
  for (const vp of vps) {
    const [w, h] = vp.includes('1440') ? [1440,1400] : vp.includes('1920') ? [1920,1200] : [390,844];
    const ctx = await b.newContext({ viewport: { width: w, height: h } });
    const p = await ctx.newPage();
    const clarioImg = fs.readFileSync(path.join(CLARIO, vp + '.png')).toString('base64');
    const cloneImg = fs.readFileSync(path.join(CLONE, vp + '.png')).toString('base64');
    const result = await p.evaluate(async (imgs) => {
      const loadImg = (b64) => new Promise((res) => { const img = new Image(); img.onload = () => res(img); img.src = 'data:image/png;base64,' + b64; });
      const a = await loadImg(imgs[0]); const b = await loadImg(imgs[1]);
      const cw = Math.max(a.width, b.width); const ch = Math.max(a.height, b.height);
      const c1 = document.createElement('canvas'); c1.width=cw; c1.height=ch; c1.getContext('2d').drawImage(a,0,0);
      const d1 = c1.getContext('2d').getImageData(0,0,cw,ch).data;
      const c2 = document.createElement('canvas'); c2.width=cw; c2.height=ch; c2.getContext('2d').drawImage(b,0,0);
      const d2 = c2.getContext('2d').getImageData(0,0,cw,ch).data;
      let diff = 0, total = 0;
      for (let i = 0; i < d1.length; i += 4) { total++; if (Math.abs(d1[i]-d2[i])+Math.abs(d1[i+1]-d2[i+1])+Math.abs(d1[i+2]-d2[i+2]) > 30) diff++; }
      return { clario: `${a.width}x${a.height}`, clone: `${b.width}x${b.height}`, diffPct: ((diff/total)*100).toFixed(2) };
    }, [clarioImg, cloneImg]);
    console.log(`${vp}: clario=${result.clario} clone=${result.clone} diff=${result.diffPct}%`);
    await ctx.close();
  }
  await b.close();
})().catch(e => { console.error(e.message); process.exit(1); });
