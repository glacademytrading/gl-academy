// node amostra.js 7.png x,y x,y ...  -> cor de cada ponto
const fs = require('fs');
const { chromium } = require('./ambiente.js');
const [file, ...pts] = process.argv.slice(2);
(async () => {
  const b = await chromium().launch(); const p = await b.newPage();
  const src = 'data:image/png;base64,' + fs.readFileSync(file).toString('base64');
  await p.setContent(`<img id="im" src="${src}">`);
  const out = await p.evaluate(async (pts) => {
    const im = document.getElementById('im'); await im.decode();
    const c = document.createElement('canvas'); c.width = im.naturalWidth; c.height = im.naturalHeight;
    const g = c.getContext('2d'); g.drawImage(im, 0, 0);
    return pts.map(s => { const [x, y] = s.split(',').map(Number); const d = g.getImageData(x, y, 1, 1).data; return `${s}: rgb(${d[0]},${d[1]},${d[2]})`; });
  }, pts);
  console.log(out.join('\n')); await b.close();
})();
