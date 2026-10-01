// Renderiza vídeos a partir dos prints reais: SPECS=./specs-r3.js node render.js [id ...]
// Roteiros com alpha: true saem em WebM com transparência (para o OBS).
const { FF, chromium, LAUNCH } = require('./ambiente.js');
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const OUT = path.join(__dirname, 'out');
fs.mkdirSync(OUT, { recursive: true });
const SPECS = require(process.env.SPECS || './specs.js');

async function renderOne(browser, spec) {
  const page = await browser.newPage({ viewport: { width: spec.w, height: spec.h } });
  await page.goto('file://' + path.join(__dirname, 'stage.html'));
  await page.evaluate(s => init(s), spec);
  const fps = spec.fps || 30, n = Math.round(spec.dur * fps);
  const file = path.join(OUT, spec.id + (spec.alpha ? '.webm' : '.mp4'));
  const enc = spec.alpha
    ? ['-c:v', 'libvpx-vp9', '-pix_fmt', 'yuva420p', '-b:v', '0', '-crf', '30', '-row-mt', '1', '-deadline', 'good', '-cpu-used', '2', '-auto-alt-ref', '0']
    : ['-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', String(spec.crf || 18), '-preset', 'medium', '-movflags', '+faststart'];
  const ff = spawn(FF, ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(fps), '-i', '-', ...enc, file]);
  ff.stderr.on('data', d => process.stderr.write(d));
  const done = new Promise(r => ff.on('close', r));
  for (let f = 0; f < n; f++) {
    await page.evaluate(async t => await render(t), f / fps);
    const buf = await page.screenshot(spec.alpha ? { type: 'png', omitBackground: true } : { type: 'jpeg', quality: 93 });
    if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
  }
  ff.stdin.end(); await done; await page.close();
  if (spec.stills) for (const t of spec.stills) {
    const p2 = await browser.newPage({ viewport: { width: spec.w, height: spec.h } });
    await p2.goto('file://' + path.join(__dirname, 'stage.html'));
    await p2.evaluate(s => init(s), spec); await p2.evaluate(async t => await render(t), t);
    if (spec.alpha) await p2.evaluate(() => document.documentElement.classList.add('qa'));
    await p2.screenshot({ path: path.join(OUT, 'check', `${spec.id}-${t}.jpg`), type: 'jpeg', quality: 70 }); await p2.close();
  }
  console.log('ok', spec.id, n + ' frames');
}

(async () => {
  fs.mkdirSync(path.join(OUT, 'check'), { recursive: true });
  const want = process.argv.slice(2);
  const list = SPECS.filter(s => !want.length || want.includes(s.id));
  const browser = await chromium().launch(LAUNCH);
  for (const s of list) await renderOne(browser, s);
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
