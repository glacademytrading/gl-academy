// Abertura, encerramento e loop de live, comercial das tecnologias GL.
const L = { w: 1920, h: 1080, ay: 540 };
const V = { w: 1080, h: 1920, ay: 1120 };
const GREEN = '#4fe3a8', RED = '#ff6b6b';
const LIVE = '<div class="live"><i></i>AO VIVO</div>';

// Cenas de produto em 16:9 (coordenadas dos prints originais)
const alta16 = (t0, t1) => ({ t0, t1, img: '5.png', dim: .15,
  cam: [{ t: t0, cx: 470, cy: 430, z: 1.25 }, { t: t1, cx: 640, cy: 330, z: 1.6 }],
  reveal: { x0: 430, x1: 790, y0: 40, y1: 800, t0: t0 + .2, t1: t1 - .6, pad: 6 },
  hides: [{ rect: [826, 82, 116, 40], until: t1 - .5 }, { rect: [780, 78, 24, 24], until: t1 - .5 }] });
const alvos16 = (t0, t1) => ({ t0, t1, img: '4.png', dim: .1,
  cam: [{ t: t0, cx: 300, cy: 420, z: 1.3 }, { t: t1, cx: 290, cy: 260, z: 1.9 }],
  reveal: { x0: 60, x1: 219, y0: 150, y1: 889, t0: t0 + .2, t1: t1 - .5, pad: 1 } });
const gamma16 = (t0, t1) => ({ t0, t1, img: '4.png', dim: .1,
  cam: [{ t: t0, cx: 470, cy: 330, z: 1.6 }, { t: t1, cx: 470, cy: 620, z: 1.9 }] });
const ninja16 = (t0, t1) => ({ t0, t1, img: '3.png', dim: .15,
  cam: [{ t: t0, cx: 760, cy: 440, z: 1.2 }, { t: t1, cx: 1300, cy: 600, z: 1.6 }],
  reveal: { x0: 600, x1: 1518, y0: 60, y1: 830, t0: t0 + .2, t1: t1 - .4, pad: 2 } });
const nivel16 = (t0, t1) => ({ t0, t1, img: '2.png', dim: .1,
  cam: [{ t: t0, cx: 420, cy: 320, z: 1.75 }, { t: t1, cx: 560, cy: 160, z: 2.3 }],
  reveal: { x0: 250, x1: 618, y0: 0, y1: 635, t0: t0 + .2, t1: t1 - .5, pad: 4 },
  hides: [{ rect: [645, 18, 100, 38], until: t1 - .4 }, { rect: [586, 334, 60, 60], until: t1 - .8 }] });
const contra16 = (t0, t1) => ({ t0, t1, img: '1.png', dim: .1,
  cam: [{ t: t0, cx: 1240, cy: 440, z: 1.15 }, { t: t1, cx: 1560, cy: 640, z: 2.0 }] });

// Loop de espera: 60 s, quadro final igual ao inicial
function loopSpec(id, title, sub) {
  const T = 60, seg = 12;
  const mk = (img, t0, cam, dim = .45) => ({ t0, t1: t0 + seg + .4, img, dim, cam: [{ t: t0, ...cam[0] }, { t: t0 + seg + .4, ...cam[1] }] });
  const cams = [
    ['5.png', [{ cx: 500, cy: 420, z: 1.35 }, { cx: 640, cy: 330, z: 1.6 }]],
    ['4.png', [{ cx: 330, cy: 460, z: 1.45 }, { cx: 380, cy: 300, z: 1.75 }]],
    ['3.png', [{ cx: 760, cy: 440, z: 1.2 }, { cx: 1100, cy: 520, z: 1.4 }]],
    ['2.png', [{ cx: 400, cy: 320, z: 1.9 }, { cx: 520, cy: 220, z: 2.2 }]],
    ['1.png', [{ cx: 1100, cy: 440, z: 1.2 }, { cx: 1450, cy: 560, z: 1.6 }]]
  ];
  const scenes = cams.map(([img, c], i) => mk(img, i * seg, c));
  scenes[0].t0 = 0;
  scenes.push({ t0: T - .6, t1: T + 1, last: true, img: '5.png', dim: .45, cam: [{ t: 0, cx: 500, cy: 420, z: 1.35 }] });
  const msgs = ['Agende sua call 1x1 gratuita · link na descrição', 'Comunidade gratuita da GL no WhatsApp', 'GL Model · TradingView e NinjaTrader', 'Contexto, entrada e alvos no mesmo mapa', 'Gamma Exposure dentro do seu gráfico'];
  const texts = [{ t0: -1, t1: T + 2, top: 300, html: `${LIVE}<div class="big">${title}</div><div class="mid">${sub}</div>` }];
  msgs.forEach((m, i) => texts.push({ t0: i * seg + .6, t1: i * seg + seg - .2, top: 850, html: `<div class="small">${m}</div>` }));
  // a primeira mensagem também aparece no fim para o corte ser invisível
  texts[1].t0 = -1;
  texts.push({ ...texts[1], t0: T - .65, t1: T + 2 });
  return { id, ...L, dur: T, replay: false, dust: { n: 160, period: 20, alpha: .9 }, scenes, texts };
}

module.exports = [
  {
    id: 'live-abertura-16x9', ...L, dur: 18, replay: false, hideWm: true, dust: { n: 140, period: 18 },
    scenes: [
      { t0: 0, t1: 6.2, particles: { size: 520, t0: .2, t1: 4.6, step: 4 } },
      { ...alta16(6.2, 8.8) }, { ...alvos16(8.8, 11.2) }, { ...ninja16(11.2, 13.6) },
      { t0: 13.6, t1: 18.5, last: true, particles: { size: 300, cy: 260, t0: 13.6, t1: 13.7, step: 4 } }
    ],
    texts: [
      { t0: 4.8, t1: 6.1, top: 860, html: '<div class="small">LEITURA INSTITUCIONAL · FLUXO · RISCO</div>' },
      { t0: 6.4, t1: 8.7, top: 860, html: '<div class="mid">Contexto <em>D/W/M</em></div>' },
      { t0: 9.0, t1: 11.1, top: 860, html: '<div class="mid">Alvos e <em>Gamma Exposure</em></div>' },
      { t0: 11.4, t1: 13.5, top: 860, html: '<div class="mid"><em>TradingView</em> e <em>NinjaTrader</em></div>' },
      { t0: 14.0, t1: 18.6, top: 470, html: `${LIVE}<div class="big">A LIVE VAI COMEÇAR</div><div class="small">MERCADO AO VIVO COM O GL MODEL</div>` }
    ],
    stills: [3, 5.5, 7.5, 16]
  },
  {
    id: 'live-encerramento-16x9', ...L, dur: 17, replay: false, hideWm: true, dust: { n: 140, period: 18 },
    scenes: [
      { ...alta16(0, 3.2) }, { ...gamma16(3.2, 6.4) },
      { t0: 6.4, t1: 13, img: '4.png', dim: .82, cam: [{ t: 6.4, cx: 353, cy: 445, z: 2.2 }, { t: 13, cx: 353, cy: 400, z: 2.4 }] },
      { t0: 13, t1: 17.5, last: true, particles: { size: 460, t0: 13.3, t1: 16.6, step: 4, reverse: true } }
    ],
    texts: [
      { t0: .3, t1: 6.3, top: 380, html: '<div class="big" style="font-size:96px">OBRIGADO POR ESTAR AQUI</div><div class="mid">Até a próxima live da <em>GL Academy</em></div>' },
      { t0: 6.6, t1: 12.9, top: 250, html: '<div class="mid">Quer ver o GL Model no <em>seu</em> gráfico?</div><div class="pill">AGENDE SUA CALL 1X1 GRATUITA</div><div class="small">LINK NA DESCRIÇÃO · COMUNIDADE GRATUITA NO WHATSAPP</div><div class="small" style="font-size:24px;color:rgba(255,255,255,.55)">Trading envolve risco financeiro real. Conteúdo educacional; não é recomendação de investimento.</div>' }
    ],
    stills: [2, 9, 13.5]
  },
  loopSpec('live-loop-comecando-16x9', 'A LIVE JÁ VAI COMEÇAR', 'Enquanto isso, veja o <em>GL Model</em> em ação'),
  loopSpec('live-loop-pausa-16x9', 'VOLTAMOS JÁ', 'Fique por aqui: o <em>GL Model</em> segue no gráfico'),
  // Comercial das tecnologias GL (16:9)
  {
    id: 'comercial-tecnologias-gl-16x9', ...L, dur: 44, replayFrom: 4.2, replayUntil: 37, dust: { n: 90, period: 16, alpha: .6 },
    scenes: [
      { t0: 0, t1: 4.2, particles: { size: 440, t0: .1, t1: 3.2, step: 4 } },
      { ...contra16(4.2, 9.2) },
      { ...alta16(9.2, 15.4) },
      { ...nivel16(15.4, 21.2) },
      { ...alvos16(21.2, 26.8) },
      { ...gamma16(26.8, 32) },
      { ...ninja16(32, 37) },
      { t0: 37, t1: 44.5, last: true, img: '5.png', dim: .86, cam: [{ t: 37, cx: 500, cy: 420, z: 1.6 }, { t: 44.5, cx: 520, cy: 400, z: 1.7 }] }
    ],
    captions: [
      { t0: 4.4, t1: 9.0, kick: 'Antes de entrar', text: 'O mercado está <em>a favor</em> ou <em>contra</em> você?' },
      { t0: 9.4, t1: 15.2, kick: 'GL Model', text: 'Contexto D/W/M e o setup <em>acontecendo</em> na tela' },
      { t0: 15.6, t1: 21.0, kick: 'Níveis institucionais', text: 'VAH, VAL e POC: o preço <em>respeita</em> o mapa' },
      { t0: 21.4, t1: 26.6, kick: 'Alvos', text: 'Alvos D, W e M marcados <em>antes</em> do preço chegar' },
      { t0: 27.0, t1: 31.8, kick: 'GL Gamma', text: '<em>Gamma Exposure</em>: Zero Gamma, Call Wall e Put Wall' },
      { t0: 32.2, t1: 36.8, kick: 'NinjaTrader', text: 'O mesmo mapa no <em>TradingView</em> e no <em>NinjaTrader</em>' }
    ],
    texts: [
      { t0: 2.6, t1: 4.1, top: 880, html: '<div class="small">TECNOLOGIAS PARA TRADERS</div>' },
      { t0: 37.3, t1: 40.6, top: 250, html: '<div class="mid">As tecnologias da <em>GL Academy</em></div><div class="small">GL MODEL · MULTI FRACTAL · GL GAMMA<br>ORDER FLOW · GL RISK AUTO · GAMEPAD TRADER PRO</div>' }
    ],
    end: { t0: 40.6, tag: 'Método, tecnologia e risco em primeiro lugar.' },
    stills: [2, 7, 12, 30, 39, 42]
  },
  // Comercial vertical (Reels, Shorts, TikTok, anúncios)
  {
    id: 'comercial-tecnologias-gl-9x16', ...V, dur: 40, replayFrom: 3.8,
    scenes: [
      { t0: 0, t1: 3.8, particles: { size: 520, cy: 900, t0: .1, t1: 3, step: 4 }, ay: 900 },
      { t0: 3.8, t1: 8.6, img: '1.png', cam: [{ t: 3.8, cx: 1500, cy: 620, z: 1.8 }, { t: 8.6, cx: 1640, cy: 715, z: 2.5 }] },
      { t0: 8.6, t1: 14.6, img: '5.png', cam: [{ t: 8.6, cx: 470, cy: 520, z: 1.9 }, { t: 13.6, cx: 700, cy: 260, z: 1.9 }, { t: 14.6, cx: 862, cy: 108, z: 2.3 }],
        reveal: { x0: 430, x1: 790, y0: 40, y1: 800, t0: 8.8, t1: 13.6, pad: 6 }, hides: [{ rect: [826, 82, 116, 40], until: 13.8 }, { rect: [780, 78, 24, 24], until: 13.8 }],
        boxes: [{ rect: [830, 86, 110, 32], t0: 13.9, t1: 14.5, color: GREEN, label: 'Alta alinhada', below: true, dx: -40 }] },
      { t0: 14.6, t1: 20.4, img: '2.png', cam: [{ t: 14.6, cx: 300, cy: 380, z: 1.7 }, { t: 19.2, cx: 560, cy: 260, z: 2.3 }, { t: 20.4, cx: 585, cy: 100, z: 2.5 }],
        reveal: { x0: 150, x1: 618, y0: 0, y1: 635, t0: 14.8, t1: 19.4, pad: 4 }, hides: [{ rect: [645, 18, 100, 38], until: 19.6 }, { rect: [586, 334, 60, 60], until: 19.0 }],
        boxes: [{ rect: [548, 22, 72, 30], t0: 19.7, t1: 20.3, label: 'VAH D', below: true }] },
      { t0: 20.4, t1: 26, img: '4.png', cam: [{ t: 20.4, cx: 260, cy: 470, z: 1.55 }, { t: 25, cx: 260, cy: 300, z: 2.1 }, { t: 26, cx: 272, cy: 200, z: 2.5 }],
        reveal: { x0: 60, x1: 219, y0: 150, y1: 889, t0: 20.6, t1: 25, pad: 1 },
        boxes: [{ rect: [228, 24, 95, 176], t0: 25.1, t1: 25.9, label: 'Alvos', below: true }] },
      { t0: 26, t1: 31, img: '4.png', cam: [{ t: 26, cx: 470, cy: 320, z: 2.5 }, { t: 31, cx: 470, cy: 560, z: 2.5 }],
        boxes: [{ rect: [487, 300, 114, 30], t0: 26.6, t1: 28.4, label: 'Zero Gamma', below: true, dx: -20 }, { rect: [487, 527, 114, 20], t0: 28.8, t1: 30.9, label: 'Call Wall', below: true, dx: -20 }] },
      { t0: 31, t1: 35.4, img: '3.png', cam: [{ t: 31, cx: 1250, cy: 520, z: 1.3 }, { t: 35.4, cx: 1455, cy: 690, z: 2.4 }],
        reveal: { x0: 1000, x1: 1518, y0: 60, y1: 830, t0: 31.2, t1: 34.6, pad: 2 } }
    ],
    captions: [
      { t0: 2.6, t1: 3.7, text: 'Tecnologias <em>GL Academy</em>' },
      { t0: 4.0, t1: 8.5, kick: 'Antes de entrar', text: 'O mercado está <em>a favor</em> ou <em>contra</em> você?' },
      { t0: 8.8, t1: 14.5, kick: 'GL Model', text: 'O setup <em>acontecendo</em> com contexto D/W/M' },
      { t0: 14.8, t1: 20.3, kick: 'Níveis', text: 'O preço <em>respeita</em> o mapa' },
      { t0: 20.6, t1: 25.9, kick: 'Alvos', text: 'Alvos marcados <em>antes</em> do preço chegar' },
      { t0: 26.2, t1: 30.9, kick: 'GL Gamma', text: '<em>Gamma Exposure</em> no seu gráfico' },
      { t0: 31.2, t1: 35.3, kick: 'NinjaTrader', text: 'TradingView e <em>NinjaTrader</em>' }
    ],
    end: { t0: 35.4, tag: 'GL Model · GL Gamma<br>Order Flow · GL Risk Auto' },
    stills: [2, 12, 28, 37]
  }
];
