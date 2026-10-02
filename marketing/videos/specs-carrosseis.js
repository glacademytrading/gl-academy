// Carrosséis 4:5 (1080x1350) e capas de Reels (1080x1920): imagens estáticas.
// Coordenadas em pixels de cada print original.
const F = { w: 1080, h: 1350 };
const GREEN = '#4fe3a8';
const TOOLBAR1 = { rect: [0, 0, 1816, 40], until: 999, color: '#0b0b0b' };
const ARROWS2 = [{ rect: [645, 18, 100, 38], until: 999 }, { rect: [586, 334, 60, 60], until: 999 }];
const DISC = 'Conteúdo educacional. Trading envolve risco financeiro real.';
const EMB = px => `<img src="emblem.png" style="width:${px}px;height:${px}px">`;
// faixa do gráfico entre o título (em cima) e o texto (embaixo)
const SHADE = 'linear-gradient(180deg, #050505 0%, #050505 29%, rgba(5,5,5,0) 37%, rgba(5,5,5,0) 72%, #050505 81%, #050505 100%)';

function slide(group, n, total, { kick, title, size = 70, body, img, cam, dim = 0, boxes = [], spots = [], hides = [], cover, cta }) {
  const foot = { t0: -1, t1: 99, top: 1278, rise: 0, style: 'left:60px;right:60px;padding:0;text-align:left',
    html: `<div style="display:flex;justify-content:space-between;font:700 26px/1 Inter,sans-serif;letter-spacing:.08em;color:rgba(255,255,255,.72)"><span>@glacademytrading</span><span><b style="color:#d8ae55">${n}</b> / ${total}${n < total ? ' &nbsp;→' : ''}</span></div>` };
  const texts = [foot];
  if (cta) {
    texts.push({ t0: -1, t1: 99, top: 300, rise: 0, html: `${EMB(240)}<div class="head2" style="font-size:84px;margin-top:20px">${title}</div><div class="body2" style="font-size:40px">${body}</div><div class="pill">CALL 1X1 GRATUITA · LINK NA BIO</div><div class="disc">${DISC}</div>` });
  } else {
    texts.push({ t0: -1, t1: 99, top: cover ? 150 : 84, rise: 0, html: `<div class="kick2">${kick}</div><div class="head2" style="font-size:${size}px;margin-top:22px">${title}</div>` });
    texts.push({ t0: -1, t1: 99, top: cover ? 1110 : 1080, rise: 0, html: `<div class="body2" style="font-size:38px">${body}</div>` });
  }
  return { id: `${group}-${String(n).padStart(2, '0')}`, group, ...F, dur: 3, at: 2, replay: false, hideWm: true, shade: cta ? undefined : SHADE, texts,
    scenes: [{ t0: 0, t1: 9, last: true, img, dim: cta ? .84 : dim, ay: 720, cam: [{ t: 0, ...cam }], boxes: boxes.map(b => ({ t0: 0, t1: 99, ...b })),
      spots: spots.map(r => ({ rect: r, t0: 0, t1: 99 })), hides }] };
}

const vwap = 'carrossel-vwap', va = 'carrossel-value-area', q3 = 'carrossel-3-perguntas';
const carrosseis = [
  slide(vwap, 1, 6, { cover: true, kick: 'AULA RÁPIDA', title: 'O QUE É A VWAP?', size: 116, body: 'Em 6 slides, no gráfico real.', img: '1.png', hides: [TOOLBAR1], dim: .3, cam: { cx: 372, cy: 430, z: 1.45 } }),
  slide(vwap, 2, 6, { kick: 'AULA RÁPIDA · VWAP', title: 'O preço médio do período, ponderado pelo volume', body: 'Cada negócio pesa conforme o volume. O resultado é uma linha de preço justo do período.', img: '1.png', hides: [TOOLBAR1], cam: { cx: 400, cy: 430, z: 1.9 }, spots: [[225, 380, 305, 100]] }),
  slide(vwap, 3, 6, { kick: 'AULA RÁPIDA · VWAP', title: 'Acima da VWAP, o mercado paga mais que a média', body: 'Abaixo dela, paga menos. Por isso a VWAP vira referência de valor.', img: '1.png', hides: [TOOLBAR1], cam: { cx: 470, cy: 290, z: 2.1 }, spots: [[445, 185, 90, 120]] }),
  slide(vwap, 4, 6, { kick: 'AULA RÁPIDA · VWAP', title: 'A VWAP da semana (W) e a do trimestre (3M)', body: 'O GL Model traça as duas no mesmo gráfico, com rótulo.', img: '1.png', hides: [TOOLBAR1], cam: { cx: 470, cy: 340, z: 2.0 },
    boxes: [{ rect: [552, 283, 40, 15], label: 'VWAP W' }, { rect: [552, 382, 40, 15], label: 'VWAP 3M', below: true }] }),
  slide(vwap, 5, 6, { kick: 'EXEMPLO · REPLAY', title: 'O preço voltou à VWAP 3M e foi defendido', body: 'Exemplo educacional. Resultado passado não garante resultado futuro.', img: '1.png', hides: [TOOLBAR1], cam: { cx: 500, cy: 360, z: 2.4 },
    boxes: [{ rect: [490, 376, 28, 28], color: GREEN, label: 'Defesa na VWAP 3M', below: true, dx: -40 }] }),
  slide(vwap, 6, 6, { cta: true, title: 'Salve para estudar', body: 'Quer ver as VWAPs no seu gráfico?', img: '1.png', hides: [TOOLBAR1], cam: { cx: 400, cy: 430, z: 1.6 } }),

  slide(va, 1, 6, { cover: true, kick: 'AULA RÁPIDA', title: 'O QUE É VALUE AREA?', size: 108, body: 'VAH, VAL e POC em 6 slides.', img: '3.png', dim: .3, cam: { cx: 1210, cy: 470, z: 1.25 } }),
  slide(va, 2, 6, { kick: 'AULA RÁPIDA · VALUE AREA', title: 'A faixa onde ocorreu cerca de 70% do volume', body: 'É a região onde o mercado mais negociou: o valor do período.', img: '3.png', cam: { cx: 1440, cy: 690, z: 2.4 }, spots: [[1414, 645, 100, 80]] }),
  slide(va, 3, 6, { kick: 'AULA RÁPIDA · VALUE AREA', title: 'VAH é o topo do valor. VAL é o fundo.', body: 'Fora dessa faixa, o preço está longe do valor aceito pelo mercado.', img: '3.png', cam: { cx: 1440, cy: 690, z: 2.4 },
    boxes: [{ rect: [1448, 643, 32, 13], label: 'VAH D', dx: -60 }, { rect: [1448, 716, 32, 13], label: 'VAL D', below: true, dx: -60 }] }),
  slide(va, 4, 6, { kick: 'AULA RÁPIDA · VALUE AREA', title: 'POC: o preço com mais volume', body: 'É o ponto de maior aceitação do período.', img: '3.png', cam: { cx: 1440, cy: 690, z: 2.4 },
    boxes: [{ rect: [1448, 698, 32, 13], color: GREEN, label: 'POC D', below: true, dx: -60 }] }),
  slide(va, 5, 6, { kick: 'EXEMPLO · REPLAY', title: 'Dia, semana e mês no mesmo gráfico', body: 'O GL Model marca VAH, VAL e POC em cada período. Exemplo educacional.', img: '3.png', cam: { cx: 1380, cy: 500, z: 1.7 },
    boxes: [{ rect: [1448, 414, 32, 13], label: 'POC M', dx: -60 }, { rect: [1448, 530, 30, 13], label: 'VAL W', below: true, dx: -60 }] }),
  slide(va, 6, 6, { cta: true, title: 'Salve para estudar', body: 'Quer ver o valor do dia, da semana e do mês no seu gráfico?', img: '3.png', cam: { cx: 1210, cy: 470, z: 1.25 } }),

  slide(q3, 1, 5, { cover: true, kick: 'ANTES DE CLICAR', title: '3 PERGUNTAS ANTES DE QUALQUER TRADE', size: 92, body: 'Se você não responde as três, espere.', img: '5.png', dim: .3, cam: { cx: 560, cy: 380, z: 1.35 } }),
  slide(q3, 2, 5, { kick: 'PERGUNTA 1', title: 'Qual é a direção?', size: 84, body: 'O GL Model mostra o contexto do dia, da semana e do mês: a favor ou contra.', img: '5.png', cam: { cx: 800, cy: 170, z: 2.4 },
    boxes: [{ rect: [830, 86, 110, 32], color: GREEN, label: 'Direção', below: true, dx: -40 }] }),
  slide(q3, 3, 5, { kick: 'PERGUNTA 2', title: 'Onde é a entrada?', size: 84, body: 'Num nível marcado no gráfico, não num palpite.', img: '2.png', hides: ARROWS2, cam: { cx: 575, cy: 320, z: 2.4 },
    boxes: [{ rect: [540, 308, 100, 36], color: GREEN, label: 'Entrada no nível', below: true }] }),
  slide(q3, 4, 5, { kick: 'PERGUNTA 3', title: 'Onde estão os alvos?', size: 84, body: 'Alvos D, W, M e 3M aparecem antes do preço chegar. São projeções, não promessa.', img: '4.png', cam: { cx: 272, cy: 150, z: 2.6 },
    boxes: [{ rect: [228, 24, 95, 176], label: 'Alvos', below: true }] }),
  slide(q3, 5, 5, { cta: true, title: 'Salve e use antes do próximo trade', body: 'Quer ver as três respostas no seu gráfico?', img: '5.png', cam: { cx: 560, cy: 380, z: 1.35 } })
];

const qd = 'carrossel-nem-toda-queda', gg = 'carrossel-gl-gamma';
carrosseis.push(
  slide(qd, 1, 6, { cover: true, kick: 'CONTEXTO', title: 'NEM TODA QUEDA É VENDA', size: 100, body: 'Um replay em 6 slides.', img: '1.png', hides: [TOOLBAR1], dim: .3, cam: { cx: 1270, cy: 430, z: 1.45 } }),
  slide(qd, 2, 6, { kick: 'REPLAY · ES', title: 'O preço lateraliza no topo', size: 80, body: 'Acumulação depois de uma alta forte.', img: '1.png', hides: [TOOLBAR1], cam: { cx: 1070, cy: 200, z: 2.3 },
    boxes: [{ rect: [980, 108, 170, 122], label: 'Acumulação no topo', below: true }] }),
  slide(qd, 3, 6, { kick: 'REPLAY · ES', title: 'Perde a acumulação e despenca', size: 80, body: 'O movimento que costuma parecer convite para vender.', img: '1.png', hides: [TOOLBAR1], cam: { cx: 1240, cy: 300, z: 1.9 },
    boxes: [{ rect: [1218, 145, 36, 290], color: '#ff6b6b', label: 'Perde a acumulação', dx: 120 }] }),
  slide(qd, 4, 6, { kick: 'REPLAY · ES', title: 'Parece convite para vender?', size: 80, body: 'Antes de clicar, o contexto.', img: '1.png', hides: [TOOLBAR1], cam: { cx: 1330, cy: 640, z: 2.0 },
    boxes: [{ rect: [1300, 698, 60, 26], color: '#ff6b6b', label: 'Marca D -0,3%' }] }),
  slide(qd, 5, 6, { kick: 'GL MODEL · CONTEXTO', title: 'O modelo avisa: correção contra W/M', size: 76, body: 'Calor 4%. Contexto contra a semana e o mês: hora de esperar. Exemplo educacional.', img: '1.png', hides: [TOOLBAR1], cam: { cx: 1570, cy: 650, z: 2.2 },
    boxes: [{ rect: [1628, 721, 108, 30], color: '#ff6b6b', label: 'Correção contra W/M', dx: -60 }] }),
  slide(qd, 6, 6, { cta: true, title: 'Contexto primeiro', body: 'Quer ver o contexto D/W/M no seu gráfico?', img: '1.png', hides: [TOOLBAR1], cam: { cx: 1270, cy: 430, z: 1.45 } }),
  slide(gg, 1, 6, { cover: true, kick: 'GL GAMMA', title: 'OS NÍVEIS DAS OPÇÕES NO SEU GRÁFICO', size: 84, body: 'Assinatura à parte. Em 6 slides.', img: '4.png', dim: .3, cam: { cx: 420, cy: 450, z: 1.53 } }),
  slide(gg, 2, 6, { kick: 'GL GAMMA', title: 'Zero Gamma', size: 92, body: 'Onde o regime de volatilidade costuma virar.', img: '4.png', cam: { cx: 470, cy: 330, z: 2.4 },
    boxes: [{ rect: [487, 300, 114, 30], label: 'Zero Gamma', below: true, dx: -20 }] }),
  slide(gg, 3, 6, { kick: 'GL GAMMA', title: 'Call Wall', size: 92, body: 'A parede que costuma segurar o preço.', img: '4.png', cam: { cx: 470, cy: 530, z: 2.4 },
    boxes: [{ rect: [487, 527, 114, 20], label: 'Call Wall', below: true, dx: -20 }] }),
  slide(gg, 4, 6, { kick: 'GL GAMMA', title: 'HVL e Gamma Flip', size: 92, body: 'Níveis de virada da volatilidade.', img: '4.png', cam: { cx: 470, cy: 700, z: 2.4 },
    boxes: [{ rect: [487, 725, 114, 22], label: 'HVL · Gamma Flip', dx: -40 }] }),
  slide(gg, 5, 6, { kick: 'GL GAMMA', title: 'Você opera futuros', size: 88, body: 'Não precisa operar opções: os níveis aparecem no seu gráfico de futuros.', img: '4.png', cam: { cx: 400, cy: 450, z: 1.7 },
    boxes: [{ rect: [487, 388, 114, 440], label: 'Níveis GL', dx: -30 }] }),
  slide(gg, 6, 6, { cta: true, title: 'GL Gamma: assinatura à parte', body: 'Planos Essential, Plus e Premium. Quer entender qual faz sentido?', img: '4.png', cam: { cx: 420, cy: 450, z: 1.53 } })
);

// Capas de Reels: título no centro, dentro da área que o perfil mostra em 4:5
const capas = [
  ['capa-v01-a-favor-ou-contra', 'c06-contra-limpo', 4, 'A FAVOR OU CONTRA?'],
  ['capa-v02-setup-acontecendo', 'c01-setup-acontecendo-limpo', 9, 'SETUP ACONTECENDO'],
  ['capa-v03-alvos-claros', 'c02-alvos-limpo', 8, 'O ALVO ANTES DO PREÇO'],
  ['capa-v04-gamma-exposure', 'c03-gamma-limpo', 5, 'GAMMA NO GRÁFICO'],
  ['capa-v07-tres-perguntas', 'c04-nivel-limpo', 6, '3 PERGUNTAS ANTES DO TRADE'],
  ['capa-v08-nem-toda-queda-e-venda', 'c07-queda-contexto-limpo', 9, 'NEM TODA QUEDA É VENDA'],
  ['capa-v11-escada-de-valor', 'c10-escada-de-valor-limpo', 9, 'ESCADA DE VALOR'],
  ['capa-aula-vwap', 'c08-vwap-3m-limpo', 7, 'O QUE É VWAP?'],
  ['capa-aula-value-area', 'c09-queda-ninjatrader-limpo', 8, 'O QUE É VALUE AREA?'],
  ['capa-objecao-mais-um-indicador', 'c02-alvos-limpo', 4, 'SÓ MAIS UM INDICADOR?'],
  ['capa-v12-estado-de-mercado', 'c11-estado-de-mercado-limpo', 9.2, 'O OPERACIONAL POR DENTRO'],
  ['capa-v13-chao-das-puts', 'c12-gamma-1-minuto-limpo', 7.6, 'CALLS EM CIMA, PUTS EMBAIXO'],
  ['capa-v14-perdeu-o-zero-gamma', 'c13-zero-gamma-limpo', 7.0, 'PERDEU O ZERO GAMMA'],
  ['capa-v15-volatilidade-volume-gamma', 'c14-volatilidade-volume-gamma-limpo', 26.5, 'TRÊS LEITURAS, UM GRÁFICO'],
  ['capa-v16-rompimento-gamma', 'c15-rompimento-gamma-limpo', 6.8, 'BASE, ROMPIMENTO E ALVO']
].map(([id, src, t, title]) => ({ id, group: 'capas-reels', folder: 'capas', src, srcT: t, w: 1080, h: 1920, dur: 3, at: 2, replay: false, hideWm: true,
  shade: 'linear-gradient(180deg, rgba(5,5,5,.15) 0%, rgba(5,5,5,.62) 34%, rgba(5,5,5,.66) 50%, rgba(5,5,5,.62) 66%, rgba(5,5,5,.15) 100%)', noGrad: true,
  scenes: [{ t0: 0, t1: 9, last: true, img: `out/frames/${id}.jpg`, ay: 960, cam: [{ t: 0, cx: 540, cy: 960, z: 1 }] }],
  texts: [{ t0: -1, t1: 99, top: 600, rise: 0, html: `<img src="emblem.png" style="width:170px;height:170px"><div class="kick2" style="margin-top:10px">GL ACADEMY</div><div class="head2" style="font-size:112px;margin-top:26px">${title}</div>` }] }));

module.exports = [...carrosseis, ...capas];
