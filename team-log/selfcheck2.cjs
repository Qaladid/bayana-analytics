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

  // Token measurement at 1440
  const ctx = await b.newContext({ viewport: { width: 1440, height: 1400 } });
  const p = await ctx.newPage();
  await p.goto(URL, { waitUntil: 'networkidle', timeout: 30000 });
  await p.waitForTimeout(3000);

  const m = await p.evaluate(() => {
    const h1 = document.querySelector('h1');
    const h1r = h1 ? h1.getBoundingClientRect() : null;
    const getStarted = Array.from(document.querySelectorAll('a')).find(a => (a.textContent||'').includes('Get Started'));
    const gsr = getStarted ? getStarted.getBoundingClientRect() : null;
    const contact = Array.from(document.querySelectorAll('a')).find(a => (a.textContent||'').trim() === 'Contact');
    const cr = contact ? contact.getBoundingClientRect() : null;
    const waitlist = Array.from(document.querySelectorAll('a')).find(a => (a.textContent||'').includes('Waitlist'));
    const wr = waitlist ? waitlist.getBoundingClientRect() : null;
    // step cards — find elements with rounded-[30px] inside how-it-works
    const howSection = document.getElementById('how-it-works');
    const stepCards = howSection ? Array.from(howSection.querySelectorAll('[class*="rounded"]')).filter(el => {
      const r = el.getBoundingClientRect();
      return r.height > 300 && r.width > 200;
    }) : [];
    const stepCardR = stepCards[0] ? stepCards[0].getBoundingClientRect() : null;
    const pageHeight = document.documentElement.scrollHeight;
    return {
      h1_y: h1r ? Math.round(h1r.y) : null,
      h1_height: h1r ? Math.round(h1r.height) : null,
      cta_width: gsr ? Math.round(gsr.width) : null,
      cta_height: gsr ? Math.round(gsr.height) : null,
      contact_width: cr ? Math.round(cr.width) : null,
      waitlist_width: wr ? Math.round(wr.width) : null,
      stepCard_height: stepCardR ? Math.round(stepCardR.height) : null,
      stepCard_count: stepCards.length,
      pageHeight: pageHeight,
    };
  });

  console.log('=== MEASUREMENTS @1440 ===');
  console.log(JSON.stringify(m, null, 2));
  console.log('\n=== TARGETS ===');
  console.log(`h1 y:         ${m.h1_y} (target ~202) ${Math.abs(m.h1_y - 202) <= 20 ? '✓' : '✗'}`);
  console.log(`CTA width:    ${m.cta_width} (target ~201) ${Math.abs(m.cta_width - 201) <= 10 ? '✓' : '✗'}`);
  console.log(`Contact width:${m.contact_width} (target ~135) ${Math.abs(m.contact_width - 135) <= 10 ? '✓' : '✗'}`);
  console.log(`Waitlist width:${m.waitlist_width} (target ~128)`);
  console.log(`Step card h:  ${m.stepCard_height} (target ~513) ${m.stepCard_height && Math.abs(m.stepCard_height - 513) <= 20 ? '✓' : '✗'}`);
  const phDelta = m.pageHeight ? m.pageHeight - 11023 : 0;
  const phOk = Math.abs(phDelta) <= 500;
  console.log("Page height:  " + m.pageHeight + " (target ~11023) " + (phOk ? "OK" : "FAIL (" + phDelta + "px)"));

  // Screenshot all viewports
  await ctx.close();
  for (const vp of VPS) {
    const ctx2 = await b.newContext({ viewport: { width: vp.w, height: vp.h } });
    const p2 = await ctx2.newPage();
    await p2.goto(URL, { waitUntil: 'networkidle', timeout: 30000 });
    await p2.waitForTimeout(3000);
    const f = path.join(SHOT, `${vp.name}_settled.png`);
    await p2.screenshot({ path: f, fullPage: true });
    console.log(`screenshot: ${path.basename(f)}`);
    await ctx2.close();
  }

  // Pixel diff
  const CLARIO = path.resolve(__dirname, 'screenshots', 'clario');
  for (const vp of ['1440x1400_settled', '1920x1200_settled', '390x844_settled']) {
    const [w, h] = vp.includes('1440') ? [1440,1400] : vp.includes('1920') ? [1920,1200] : [390,844];
    const ctx3 = await b.newContext({ viewport: { width: w, height: h } });
    const p3 = await ctx3.newPage();
    const clarioImg = fs.readFileSync(path.join(CLARIO, vp + '.png')).toString('base64');
    const cloneImg = fs.readFileSync(path.join(SHOT, vp + '.png')).toString('base64');
    const result = await p3.evaluate(async (imgs) => {
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
    const thresh = vp.includes('390') ? 8 : 5;
    console.log(`pixdiff ${vp}: clario=${result.clario} clone=${result.clone} diff=${result.diffPct}% (thresh ${thresh}%) ${parseFloat(result.diffPct) <= thresh ? '✓' : '✗'}`);
    await ctx3.close();
  }

  await b.close();
})().catch(e => { console.error(e.message); process.exit(1); });
