// Só os quadros de conferência (sem vídeo): SPECS=./specs-r3.js node stills.js [id ...]
const { chromium, LAUNCH } = require('./ambiente.js');
const path = require('path');
const fs = require('fs');
const SPECS = require(process.env.SPECS || './specs.js');
(async () => {
  const dir = path.join(__dirname, 'out', 'check'); fs.mkdirSync(dir, { recursive: true });
  const want = process.argv.slice(2);
  const browser = await chromium().launch(LAUNCH);
  for (const spec of SPECS.filter(s => !want.length || want.includes(s.id))) {
    for (const t of spec.stills || []) {
      const p = await browser.newPage({ viewport: { width: spec.w, height: spec.h } });
      await p.goto('file://' + path.join(__dirname, 'stage.html'));
      await p.evaluate(s => init(s), spec); await p.evaluate(async t => await render(t), t);
      if (spec.alpha) await p.evaluate(() => document.documentElement.classList.add('qa'));
      await p.screenshot({ path: path.join(dir, `${spec.id}-${t}.jpg`), type: 'jpeg', quality: 70 }); await p.close();
    }
    console.log('stills', spec.id);
  }
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
