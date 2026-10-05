// GL Risk Auto no site (0 crédito): loops de 8 s que emendam sem corte e duas histórias que tocam uma vez
// e param no último quadro, no padrão do kit do site (specs-r4.js). Sem legenda: só o selo de replay, o chip
// e caixas com rótulo curto. O site escreve o texto ao lado. Coordenadas e tampas em risk-prints.js.
const { hides, R } = require('./risk-prints.js');

const L = { w: 1920, h: 1080, ay: 540, noGrad: true };
const Q = { w: 1080, h: 1080, ay: 540, noGrad: true };
const GREEN = '#4fe3a8', RED = '#ff6b6b';
const EMB = px => `<img src="emblem.png" style="width:${px}px;height:${px}px">`;
const LEFT = 'left:60px;right:auto;text-align:left;padding:0';
const RIGHT = 'left:auto;right:60px;text-align:right;padding:0';
const chip = (txt, style = LEFT, top = 56) => ({ t0: -1, t1: 99, top, rise: 0, style, html: `<div class="chiptag">${EMB(36)}${txt}</div>` });
// loop sem corte: a câmera vai de A até B e volta a A; a poeira tem período igual à duração
const loop8 = (A, B) => [{ t: 0, ...A }, { t: 4, ...B }, { t: 8, ...A }];
const box = (rect, t0, t1, label, o = {}) => ({ rect, t0, t1, ...(label ? { label } : {}), ...o });
// o alvo em dólar no gráfico do print 25 (o "4,32R" fica)
const ALVO25 = { rect: [491, 509, 55, 13], color: '#000000', until: 999 };
const cena = (img, o) => ({ img, ...o, hides: [...hides(img), ...(o.hides || [])] });
// selo de replay dentro do círculo (o selo padrão fica no canto e seria cortado pelo recorte redondo)
const SELO_CIRCULO = { t0: -1, t1: 99, top: 950, rise: 0, html: '<div style="display:inline-block;font:600 20px/1 Inter,sans-serif;letter-spacing:.12em;text-transform:uppercase;color:rgba(255,255,255,.72);border:1px solid rgba(216,174,85,.55);border-radius:999px;padding:10px 16px;background:rgba(5,5,5,.6)"><i style="display:inline-block;width:10px;height:10px;border-radius:50%;background:#e3705f;margin-right:10px;box-shadow:0 0 10px #e3705f"></i>Replay · exemplo educacional</div>' };

const loops = [
  // o sistema GL completo, com o painel à esquerda; a câmera vai até o painel e volta
  { id: 'site-risk-loop-sistema', ...L, dur: 8, hideWm: true, dust: { n: 60, period: 8, alpha: .6 },
    scenes: [{ t0: 0, t1: 9, last: true, ...cena('34.png', { cam: loop8({ cx: 531, cy: 284, z: 1.9 }, { cx: 470, cy: 280, z: 2.15 }),
      boxes: [box(R.p34Box, 2.0, 5.8, 'Sinal verde', { color: GREEN, below: true, dx: 150 })] }) }],
    texts: [chip('GL Risk Auto', RIGHT)], stills: [0, 4, 7.95] },
  // o plano pronto: painel e gráfico com stop, entrada e a escada de R
  { id: 'site-risk-loop-plano', ...L, dur: 8, hideWm: true, dust: { n: 60, period: 8, alpha: .6 },
    scenes: [{ t0: 0, t1: 9, last: true, ...cena('25.png', { hides: [ALVO25], cam: loop8({ cx: 457, cy: 270, z: 2.1 }, { cx: 440, cy: 255, z: 2.25 }),
      boxes: [box(R.p25Box, 1.6, 6.2, 'Plano pronto', { color: GREEN, below: true, dx: 230 }), box(R.p25Total, 2.4, 5.8, 'Dentro do teto', { color: GREEN, below: true, dx: 230 })] }) }],
    texts: [chip('GL Risk Auto', RIGHT)], stills: [0, 4, 7.95] },
  // o plano acima do teto, barrado (caixa do plano visual, centralizada sobre o fundo escuro)
  { id: 'site-risk-loop-bloqueio', ...L, dur: 8, hideWm: true, dust: { n: 60, period: 8, alpha: .6 },
    scenes: [{ t0: 0, t1: 9, last: true, ...cena('26.png', { cam: loop8({ cx: 176, cy: 1398, z: 3.2 }, { cx: 176, cy: 1394, z: 3.45 }),
      boxes: [box(R.p26Teto, 2.0, 5.8, 'Acima do teto: bloqueado', { color: RED, below: true })] }) }],
    texts: [chip('GL Risk Auto')], stills: [0, 4, 7.95] },
  // o sinal verde no painel (print estreito, centralizado como a galeria do site)
  { id: 'site-risk-loop-sinal', ...L, dur: 8, hideWm: true, dust: { n: 60, period: 8, alpha: .6 },
    scenes: [{ t0: 0, t1: 9, last: true, ...cena('31.png', { cam: loop8({ cx: 122, cy: 247, z: 2.0 }, { cx: 122, cy: 205, z: 2.4 }),
      boxes: [box(R.p31Box, 2.0, 5.8, 'Sinal verde', { color: GREEN, below: true })] }) }],
    texts: [chip('GL Risk Auto')], stills: [0, 4, 7.95] },
  // círculo (recorte redondo no site): o painel inteiro e o zoom no sinal verde
  { id: 'site-risk-circulo', ...Q, dur: 8, replay: false, hideWm: true, dust: { n: 50, period: 8, alpha: .6 },
    scenes: [{ t0: 0, t1: 9, last: true, ...cena('31.png', { cam: loop8({ cx: 122, cy: 247, z: 1.8 }, { cx: 122, cy: 175, z: 2.5 }),
      boxes: [box(R.p31Box, 2.2, 5.8, null, { color: GREEN })] }) }],
    texts: [SELO_CIRCULO], stills: [0, 4, 7.95] }
];

// Histórias: tocam uma vez e param no último quadro (as caixas do fim ficam até o fim)
const historias = [
  // acima do teto não passa; dentro do teto, plano pronto
  { id: 'historia-risk-bloqueio', ...L, dur: 10, hideWm: true,
    scenes: [
      { t0: 0, t1: 5.8, ...cena('26.png', { cam: [{ t: 0, cx: 176, cy: 1398, z: 3.2 }, { t: 5.8, cx: 176, cy: 1396, z: 3.4 }],
        boxes: [box(R.p26Teto, 0.8, 5.6, 'Acima do teto: bloqueado', { color: RED, below: true })] }) },
      { t0: 5.0, t1: 10, last: true, ...cena('25.png', { hides: [ALVO25], cam: [{ t: 5.0, cx: 457, cy: 270, z: 2.1 }, { t: 10, cx: 445, cy: 262, z: 2.18 }],
        boxes: [box(R.p25Box, 6.0, 99, 'Plano pronto', { color: GREEN, below: true, dx: 230 }), box(R.p25Total, 6.6, 99, 'Dentro do teto', { color: GREEN, below: true, dx: 230 })] }) }],
    stills: [0.1, 3, 6.4, 9.95] },
  // do contexto ao plano medido em R e à entrada com stop e alvo na plataforma, dentro do teto
  { id: 'historia-risk-trade', ...L, dur: 12, hideWm: true,
    scenes: [
      { t0: 0, t1: 4.4, ...cena('28.png', { cam: [{ t: 0, cx: 508, cy: 640, z: 1.9 }, { t: 4.4, cx: 508, cy: 625, z: 2.0 }],
        boxes: [box(R.p28Vah, 0.6, 4.2, 'VAH D e bloco vermelho', { color: RED, dx: -40 }), box(R.p28Bolha, 1.6, 4.2, 'Compra na resistência', { below: true, dx: -60 })] }) },
      { t0: 3.6, t1: 8.4, ...cena('29.png', { cam: [{ t: 3.6, cx: 469, cy: 665, z: 1.95 }, { t: 8.4, cx: 469, cy: 662, z: 2.0 }],
        boxes: [box(R.p29Stop, 4.4, 8.2, 'Stop: US$250', { color: RED, below: true, dx: -40 }), box(R.p29Entrada, 5.0, 8.2, 'Entrada', { below: true, dx: -40 }),
          box(R.p29Alvo, 5.8, 8.2, 'Alvo 5R', { color: GREEN, dx: -20 })] }) },
      { t0: 7.6, t1: 12, last: true, ...cena('30.png', { cam: [{ t: 7.6, cx: 620, cy: 545, z: 1.55 }, { t: 12, cx: 620, cy: 545, z: 1.57 }],
        boxes: [box(R.p30Risco, 8.4, 99, 'Dentro do teto', { color: GREEN, below: true, dx: 60 }), box(R.p30Stp, 9.2, 99, 'Stop na plataforma', { color: RED }),
          box(R.p30Lmt, 9.8, 99, 'Alvo na plataforma', { color: GREEN })] }) }],
    stills: [0.1, 2.8, 6.5, 10.5, 11.95] }
];

module.exports = [...loops, ...historias];
