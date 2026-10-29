// Limpa os prints da plataforma antes de qualquer uso: cobre valores em dólar e o nome da conta.
// Uso: node limpar.js <pasta dos prints> <pasta de saída>
const { chromium, LAUNCH } = require('../ambiente.js');
const fs = require('fs'), path = require('path');
const [, , ENTRA, SAI] = process.argv;
// x, y, w, h em pixels do print original; texto opcional no lugar
const MASCARAS = {
  '34.webp': [
    { x: 16, y: 483, w: 300, h: 16, bg: '#0a0a0c', txt: 'Risco do plano: dentro do limite', cor: '#4fe38a', bold: true },
    { x: 16, y: 532, w: 120, h: 16, bg: '#0a0a0c', txt: 'Simulador · ES 12-26', cor: '#b9b9c0' },
    { x: 262, y: 532, w: 84, h: 16, bg: '#0a0a0c' },
  ],
};
(async () => {
  fs.mkdirSync(SAI, { recursive: true });
  const b = await chromium().launch(LAUNCH);
  for (const f of fs.readdirSync(ENTRA).filter(n => /^(3[4-9]|[4-9]\d)\.(png|webp|jpg)$/.test(n))) {
    const src = path.join(ENTRA, f);
    const p = await b.newPage();
    const data = 'data:image/' + (f.endsWith('webp') ? 'webp' : 'png') + ';base64,' + fs.readFileSync(src).toString('base64');
    await p.setContent(`<body style="margin:0;background:#000"><img id=i src="${data}" style="display:block"></body>`);
    const { w, h } = await p.evaluate(() => new Promise(r => { const i = document.getElementById('i'); const ok = () => r({ w: i.naturalWidth, h: i.naturalHeight }); i.complete ? ok() : i.onload = ok; }));
    await p.setViewportSize({ width: w, height: h });
    await p.evaluate(ms => {
      for (const m of ms) {
        const d = document.createElement('div');
        Object.assign(d.style, { position: 'absolute', left: m.x + 'px', top: m.y + 'px', width: m.w + 'px', height: m.h + 'px', background: m.bg,
          color: m.cor || '#fff', font: (m.bold ? '700 ' : '500 ') + '11px ui-monospace, "DejaVu Sans Mono", monospace', lineHeight: m.h + 'px', padding: '0 4px', boxSizing: 'border-box', whiteSpace: 'nowrap' });
        d.textContent = m.txt || '';
        document.body.appendChild(d);
      }
    }, MASCARAS[f] || []);
    const out = path.join(SAI, f.replace(/\.\w+$/, '.png'));
    await p.screenshot({ path: out });
    console.log(f, w + 'x' + h, (MASCARAS[f] || []).length, 'máscaras ->', out);
    await p.close();
  }
  await b.close();
})();
