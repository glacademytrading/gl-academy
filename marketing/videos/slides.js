// Imagens estáticas (carrosséis e capas): SPECS=./specs-carrosseis.js node slides.js [grupo ...]
// Cada roteiro vira um JPG em out/<pasta>/<grupo>/<id>.jpg, no instante "at" (padrão 2 s).
const { chromium, LAUNCH } = require('./ambiente.js');
const path = require('path');
const fs = require('fs');
const SPECS = require(process.env.SPECS || './specs-carrosseis.js');
(async () => {
  const want = process.argv.slice(2);
  const browser = await chromium().launch(LAUNCH);
  for (const spec of SPECS.filter(s => !want.length || want.includes(s.group))) {
    const dir = path.join(__dirname, 'out', spec.folder || 'carrosseis', spec.group); fs.mkdirSync(dir, { recursive: true });
    const p = await browser.newPage({ viewport: { width: spec.w, height: spec.h } });
    await p.goto('file://' + path.join(__dirname, 'stage.html'));
    await p.evaluate(s => init(s), spec); await p.evaluate(async t => await render(t), spec.at || 2);
    await p.screenshot({ path: path.join(dir, spec.id + '.jpg'), type: 'jpeg', quality: 92 }); await p.close();
  }
  console.log('ok', SPECS.length, 'imagens');
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
