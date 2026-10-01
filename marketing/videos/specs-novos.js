// Novos setups e variações de gancho. Coordenadas em pixels de cada print original.
const V = { w: 1080, h: 1920, ay: 1120 };
const GREEN = '#4fe3a8', RED = '#ff6b6b';
const base = require('./specs.js');
const byId = id => JSON.parse(JSON.stringify(base.find(s => s.id === id)));

// N1. Nem toda queda é venda (print 1, tela da direita)
const n1Scene = withBoxes => ({ t0: 0, t1: 12.1, img: '1.png', last: true,
  cam: [{ t: 0, cx: 1070, cy: 240, z: 2.3 }, { t: 2.6, cx: 1180, cy: 250, z: 2.0 }, { t: 4.2, cx: 1250, cy: 420, z: 1.8 },
    { t: 6.2, cx: 1330, cy: 600, z: 1.8 }, { t: 8.2, cx: 1460, cy: 650, z: 1.8 }, { t: 9.4, cx: 1650, cy: 735, z: 2.5 }],
  reveal: { x0: 1160, x1: 1560, y0: 60, y1: 845, t0: 2.6, t1: 8.2, pad: 4, sample: [1700, 300] },
  hides: [{ rect: [1622, 716, 118, 38], until: 9.4 }, { rect: [1555, 724, 26, 26], until: 9.4 }, { rect: [700, 0, 1116, 40], until: 999, color: '#0b0b0b' }],
  boxes: withBoxes ? [
    { rect: [980, 108, 170, 122], t0: 0.5, t1: 2.5, label: 'Acumulação no topo', below: true },
    { rect: [1218, 145, 36, 290], t0: 3.6, t1: 5.4, color: RED, label: 'Perde a acumulação', dx: 90 },
    { rect: [1300, 698, 60, 26], t0: 6.0, t1: 8.0, color: RED, label: 'Marca D -0,3%', below: true },
    { rect: [1628, 721, 108, 30], t0: 9.6, t1: 12.0, color: RED, label: 'Correção contra W/M', below: true, dx: -60 }] : [] });

// N2. Defesa na VWAP 3M (print 1, tela da esquerda)
const n2Scene = withBoxes => ({ t0: 0, t1: 10.9, img: '1.png', last: true,
  cam: [{ t: 0, cx: 260, cy: 560, z: 1.7 }, { t: 3.2, cx: 300, cy: 300, z: 1.7 }, { t: 5.6, cx: 420, cy: 330, z: 1.8 },
    { t: 7.4, cx: 500, cy: 380, z: 2.4 }, { t: 8.8, cx: 520, cy: 240, z: 2.3 }, { t: 10.9, cx: 380, cy: 420, z: 1.15 }],
  reveal: { x0: 180, x1: 530, y0: 60, y1: 845, t0: 0.4, t1: 8.4, pad: 4, sample: [150, 100] },
  hides: [{ rect: [538, 198, 26, 26], until: 8.6 }, { rect: [528, 198, 36, 12], until: 8.4 }, { rect: [0, 0, 1816, 40], until: 999, color: '#0b0b0b' }],
  boxes: withBoxes ? [
    { rect: [232, 190, 32, 300], t0: 1.0, t1: 2.9, color: GREEN, label: 'Rompimento com força', dx: 110 },
    { rect: [237, 276, 64, 22], t0: 3.3, t1: 5.0, label: 'Marca Y +8%', below: true },
    { rect: [490, 376, 28, 28], t0: 6.9, t1: 8.3, color: GREEN, label: 'Defesa na VWAP 3M', below: true, dx: -40 },
    { rect: [497, 188, 66, 22], t0: 8.6, t1: 10.6, label: 'Retomada até Y +8%', below: true, dx: -40 }] : [] });

// N3. Queda no NinjaTrader (print 3)
const n3Scene = withBoxes => ({ t0: 0, t1: 10.4, img: '3.png', last: true,
  cam: [{ t: 0, cx: 1080, cy: 470, z: 2.0 }, { t: 2.6, cx: 1170, cy: 520, z: 1.9 }, { t: 4.6, cx: 1230, cy: 700, z: 1.9 },
    { t: 6.8, cx: 1380, cy: 690, z: 1.9 }, { t: 8.4, cx: 1460, cy: 690, z: 2.6 }],
  reveal: { x0: 1140, x1: 1518, y0: 60, y1: 830, t0: 2.4, t1: 7.6, pad: 2 },
  boxes: withBoxes ? [
    { rect: [1000, 452, 135, 42], t0: 0.6, t1: 2.6, label: 'Zonas GL', below: true },
    { rect: [1150, 445, 80, 360], t0: 2.8, t1: 4.6, color: RED, label: 'Rompimento para baixo', dx: 110 },
    { rect: [1180, 744, 335, 16], t0: 4.8, t1: 6.6, color: GREEN, label: 'Zona de defesa', below: true },
    { rect: [1405, 640, 115, 95], t0: 7.8, t1: 10.2, label: 'Valor do dia', dx: -40 }] : [] });

// N4. Escada de valor (print 4), revelação de baixo para cima
const n4Scene = withBoxes => ({ t0: 0, t1: 11.5, img: '4.png', last: true,
  cam: [{ t: 0, cx: 150, cy: 790, z: 2.1 }, { t: 3.6, cx: 150, cy: 600, z: 2.1 }, { t: 5.6, cx: 150, cy: 430, z: 2.1 },
    { t: 7.4, cx: 170, cy: 280, z: 2.1 }, { t: 9.0, cx: 230, cy: 170, z: 2.3 }, { t: 11.2, cx: 300, cy: 420, z: 1.35 }],
  reveal: { dir: 'up', x0: 0, x1: 330, from: 889, to: 20, t0: 0.4, t1: 9.6, pad: 2, sample: [225, 120] },
  boxes: withBoxes ? [
    { rect: [115, 820, 100, 18], t0: 1.1, t1: 3.2, label: 'VAL M · 29.438', below: true },
    { rect: [112, 549, 100, 18], t0: 3.9, t1: 5.3, label: 'VAH M · 29.946', below: true },
    { rect: [115, 359, 98, 18], t0: 5.9, t1: 7.2, label: 'VAH Q · 30.304', below: true },
    { rect: [8, 231, 206, 18], t0: 7.25, t1: 8.0, label: 'VAH W · VAH D', below: true },
    { rect: [228, 172, 95, 28], t0: 8.0, t1: 9.8, color: GREEN, label: 'Alvo D/W +1%', below: true }] : [] });

const novos = [
  { id: 'v08-nem-toda-queda-e-venda', ...V, dur: 14.5, scenes: [n1Scene(true)],
    captions: [
      { t0: 0.2, t1: 2.5, kick: 'Replay · ES', text: 'O preço lateraliza no topo…' },
      { t0: 2.7, t1: 5.6, text: '…perde a acumulação e <em class="red">despenca</em>' },
      { t0: 5.8, t1: 9.3, text: 'Parece convite para vender?' },
      { t0: 9.5, t1: 12.0, kick: 'GL Model · contexto', text: 'O modelo avisa: <em class="red">correção contra W/M</em>. Calor 4%.' }],
    end: { t0: 12.1, tag: 'Nem toda queda é venda. Contexto primeiro.' }, stills: [1.5, 4.5, 7, 10.5] },
  { id: 'v09-defesa-na-vwap-3m', ...V, dur: 13.4, scenes: [n2Scene(true)],
    captions: [
      { t0: 0.2, t1: 3.0, kick: 'Replay · ES', text: 'O preço rompe a <em>VWAP W</em> com força' },
      { t0: 3.2, t1: 5.4, text: 'Atinge a marca <em>Y +8%</em>…' },
      { t0: 5.6, t1: 8.4, text: '…corrige até a <em>VWAP 3M</em> e é defendido nela' },
      { t0: 8.6, t1: 10.8, text: 'Retomada até a <em>Y +8%</em> de novo' }],
    end: { t0: 10.9, tag: 'VWAPs D, W, M e 3M no mapa GL.' }, stills: [2, 4, 7.6, 9.5] },
  { id: 'v10-queda-no-ninjatrader', ...V, dur: 12.8, scenes: [n3Scene(true)],
    captions: [
      { t0: 0.2, t1: 2.6, kick: 'NinjaTrader · replay', text: 'O mapa GL marca as <em>zonas</em> no gráfico' },
      { t0: 2.8, t1: 4.7, text: 'O preço perde a zona e <em class="red">acelera</em>' },
      { t0: 4.8, t1: 7.6, text: 'Para na <em>zona de defesa</em> de baixo' },
      { t0: 7.8, t1: 10.3, text: 'E o novo <em>valor do dia</em> se forma' }],
    end: { t0: 10.4, tag: 'O mesmo mapa no TradingView e no NinjaTrader.' }, stills: [1.5, 3.7, 5.7, 9] },
  { id: 'v11-escada-de-valor', ...V, dur: 14, scenes: [n4Scene(true)],
    captions: [
      { t0: 0.2, t1: 3.6, kick: 'Replay', text: 'A <em>escada de valor</em> do GL Model' },
      { t0: 3.8, t1: 5.8, text: 'Do valor mensal…' },
      { t0: 5.9, t1: 7.2, text: '…ao trimestral…' },
      { t0: 7.3, t1: 9.8, text: '…ao semanal, até o <em>alvo D/W</em>' },
      { t0: 9.9, t1: 11.4, text: 'Cada degrau marcado no gráfico' }],
    end: { t0: 11.5, tag: 'VAL, VAH e POC em todos os tempos gráficos.' }, stills: [2, 4.5, 6.5, 8.8] },
  // coringas limpos dos novos setups
  { id: 'c07-queda-contexto-limpo', ...V, dur: 11, scenes: [{ ...n1Scene(false), t1: 11 }] },
  { id: 'c08-vwap-3m-limpo', ...V, dur: 10.9, scenes: [{ ...n2Scene(false), t1: 10.9 }] },
  { id: 'c09-queda-ninjatrader-limpo', ...V, dur: 10.4, scenes: [{ ...n3Scene(false), t1: 10.4 }] },
  { id: 'c10-escada-de-valor-limpo', ...V, dur: 11.2, scenes: [{ ...n4Scene(false), t1: 11.2 }] }
];

// Variações de gancho para anúncios (mesmo vídeo, primeira frase diferente)
function gancho(id, novoId, primeira) {
  const s = byId(id); s.id = novoId;
  if (id === 'v07-tres-perguntas') {
    s.captions = [{ t0: 0.2, t1: 2.3, text: primeira }, { t0: 2.4, t1: 4.6, kick: 'Pergunta 1', text: 'Qual é a <em>direção</em>?' }, ...s.captions.slice(1)];
  } else {
    s.captions[0] = { ...s.captions[0], text: primeira };
  }
  s.stills = [1.5];
  return s;
}
novos.push(
  gancho('v02-setup-acontecendo', 'v02b-gancho-voce-compraria', 'Você teria comprado <em>aqui</em>?'),
  gancho('v02-setup-acontecendo', 'v02c-gancho-3-sinais', '3 sinais antes do <em>rompimento</em>'),
  gancho('v01-a-favor-ou-contra', 'v01b-gancho-pare-de-operar-contra', 'Pare de operar <em>contra</em> o mercado'),
  gancho('v01-a-favor-ou-contra', 'v01c-gancho-erro-mais-caro', 'Operar contra o contexto é o erro mais <em>caro</em>'),
  gancho('v07-tres-perguntas', 'v07b-gancho-nao-entre', 'Se você não responde essas 3, <em>não entre</em>'),
  gancho('v07-tres-perguntas', 'v07c-gancho-antes-de-clicar', 'Trader profissional responde isso <em>antes</em> de clicar')
);

module.exports = novos;
