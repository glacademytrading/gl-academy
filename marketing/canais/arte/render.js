// Arte do plano: tira um PNG de cada pôster de arte.html e junta os 3 num PDF (A3 deitado).
// Uso: node render.js [pasta de saída]   (padrão: esta pasta)
const path = require('path');
const { chromium, LAUNCH } = require('../../videos/ambiente.js');

const AQUI = __dirname;
const SAIDA = path.resolve(process.argv[2] || AQUI);
const POSTERES = [['mapa', '1-mapa-do-plano.png'], ['semana', '2-semana-tipo.png'], ['semanas', '3-linha-do-tempo.png']];

(async () => {
  const browser = await chromium().launch(LAUNCH);
  const page = await browser.newPage({ viewport: { width: 1587, height: 1123 }, deviceScaleFactor: 2 });
  await page.goto('file://' + path.join(AQUI, 'arte.html'));
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(300);
  // nada pode vazar da área do pôster
  const vazou = await page.evaluate(() => [...document.querySelectorAll('.poster *')].filter(e => {
    const p = e.closest('.poster').getBoundingClientRect(), r = e.getBoundingClientRect();
    return r.width && (r.right > p.right + 0.5 || r.bottom > p.bottom + 0.5 || r.left < p.left - 0.5);
  }).map(e => e.closest('.poster').id + ': ' + (e.className || e.tagName) + ' ' + (e.textContent || '').trim().slice(0, 40)));
  if (vazou.length) console.log('Atenção, fora da área:\n  ' + vazou.slice(0, 12).join('\n  '));
  for (const [id, nome] of POSTERES) {
    await page.locator('#' + id).screenshot({ path: path.join(SAIDA, nome) });
    console.log('PNG', nome);
  }
  await page.pdf({ path: path.join(SAIDA, 'plano-de-marketing-gl-arte.pdf'), preferCSSPageSize: true, printBackground: true });
  console.log('PDF plano-de-marketing-gl-arte.pdf');
  await browser.close();
})();
