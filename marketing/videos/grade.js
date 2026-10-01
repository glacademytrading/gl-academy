// Grade de coordenadas sobre um print, para escrever as cenas dos vídeos.
//   node grade.js 6.png                    -> grade-6.png (linhas a cada 50 px)
//   node grade.js 6.png 900 60 1816 860 1.6 -> grade-6-zoom.png (recorte ampliado, linhas a cada 25 px)
const fs = require('fs');
const path = require('path');
const { chromium } = require('./ambiente.js');
const [file, ...crop] = process.argv.slice(2);
if (!file) { console.error('uso: node grade.js <print.png> [x0 y0 x1 y1 zoom]'); process.exit(1); }
(async () => {
  const b = await chromium().launch();
  const src = 'data:image/png;base64,' + fs.readFileSync(file).toString('base64');
  const p = await b.newPage();
  await p.setContent(`<img id="im" src="${src}">`);
  const { w: W, h: H } = await p.evaluate(async () => { const im = document.getElementById('im'); await im.decode(); return { w: im.naturalWidth, h: im.naturalHeight }; });
  const [x0, y0, x1, y1, z] = crop.length ? crop.map(Number) : [0, 0, W, H, 1];
  const step = crop.length ? 25 : 50, w = Math.round((x1 - x0) * z), h = Math.round((y1 - y0) * z);
  let lines = '';
  for (let x = Math.ceil(x0 / step) * step; x < x1; x += step) { const sx = (x - x0) * z; lines += `<div style="position:absolute;left:${sx}px;top:0;width:1px;height:${h}px;background:${x % 100 ? 'rgba(255,0,255,.22)' : 'rgba(255,0,255,.7)'}"></div>` + (x % 100 ? '' : `<div style="position:absolute;left:${sx + 2}px;top:2px;color:#f0f;font:bold 12px monospace;background:#000">${x}</div>`); }
  for (let y = Math.ceil(y0 / step) * step; y < y1; y += step) { const sy = (y - y0) * z; lines += `<div style="position:absolute;top:${sy}px;left:0;height:1px;width:${w}px;background:${y % 100 ? 'rgba(0,255,255,.22)' : 'rgba(0,255,255,.7)'}"></div>` + (y % 100 ? '' : `<div style="position:absolute;top:${sy + 2}px;left:2px;color:#0ff;font:bold 12px monospace;background:#000">${y}</div>`); }
  await p.setViewportSize({ width: w, height: h });
  await p.setContent(`<body style="margin:0;overflow:hidden"><div style="position:relative;width:${w}px;height:${h}px;overflow:hidden"><img src="${src}" style="position:absolute;left:${-x0 * z}px;top:${-y0 * z}px;width:${W}px;transform-origin:0 0;transform:scale(${z})">${lines}</div></body>`);
  const out = 'grade-' + path.basename(file, '.png') + (crop.length ? '-zoom' : '') + '.png';
  await p.screenshot({ path: out }); console.log(out);
  await b.close();
})();
