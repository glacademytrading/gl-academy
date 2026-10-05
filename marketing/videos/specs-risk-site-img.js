// GL Risk Auto no site: as duas imagens do "antes e depois" com arrasto (mesmo enquadramento: o print 29 é o
// print 28 com o plano desenhado, deslocado em -132, -200) e a imagem do link compartilhado (1200x630).
const { hides } = require('./risk-prints.js');

const STARS_BG = 'radial-gradient(ellipse at 50% 38%, #0e1020 0%, #05060c 62%, #030308 100%)';
const base = (id, group, w, h, o) => ({ id, group, folder: 'imagens', w, h, dur: 3, at: 2, replay: false, hideWm: true, ...o });
const T = (top, html, style) => ({ t0: -1, t1: 99, top, rise: 0, html, ...(style ? { style } : {}) });

// enquadramento comum aos dois prints: o print 29 de x = 0 a 768. Depois disso o 28 mostra o eixo de preço e o 29 não
// (a janela tinha outra largura). As velas e o plano batem; só os rótulos presos à borda direita mudam um pouco.
const Z = 2.5, C29 = { cx: 384, cy: 575 };
const quadro = (id, img, c) => base(id, 'site-risk-antes-depois', 1920, 1080, { replay: true,
  scenes: [{ t0: 0, t1: 9, last: true, img, ay: 540, cam: [{ t: 0, ...c, z: Z }], hides: hides(img) }] });

const og = base('og-gl-risk-auto', 'site-risk-og', 1200, 630, { bg: STARS_BG, stars: { n: 300 },
  scenes: [{ t0: 0, t1: 9, last: true, particles: { size: 400, cx: 270, cy: 315, t0: -2, t1: -1, step: 8, glow: true, rays: true } }],
  texts: [T(165, '<div class="s-kick">GL ACADEMY</div><div class="s-title" style="font-size:62px;margin-top:22px">GL RISK AUTO</div>' +
    '<div class="s-it" style="margin-top:12px">Se não cabe no teto, não entra.</div>' +
    '<div class="s-body" style="font-size:28px;margin-top:14px">Gestão de risco no NinjaTrader, no Operacional Completo.</div>',
    'left:520px;right:60px;text-align:left;padding:0')] });

module.exports = [
  quadro('risk-antes', '28.png', { cx: C29.cx + 132, cy: C29.cy + 200 }),
  quadro('risk-depois', '29.png', C29),
  og
];
