// Rodada 5: o operacional por dentro, com os prints 6 a 10 (ES, 1 e 2 de outubro de 2026).
// Cada vídeo monta o gráfico na tela e depois destaca, uma por uma, as partes do operacional:
// painel, alvos, cores, VWAPs, Gamma e o painel de risco. Coordenadas em pixels de cada print.
const V = { w: 1080, h: 1920, ay: 1120 };
const L = { w: 1920, h: 1080, ay: 560 };
const GREEN = '#4fe3a8', RED = '#ff6b6b';
const GAMMA = 'GL Gamma: assinatura à parte. Trading envolve risco financeiro real. Conteúdo educacional; não é recomendação de investimento.';
const ALVOS = 'Alvos são projeções do modelo, não promessa de resultado. Trading envolve risco financeiro real. Conteúdo educacional.';

// 6.png · ES 30 min · GL Estado de Mercado ------------------------------------
const estado = (extra = {}) => ({
  t0: 0, t1: extra.t1 || 21.1, img: '6.png', last: true,
  cam: [
    { t: 0, cx: 112, cy: 44, z: 3.0 }, { t: 1.6, cx: 112, cy: 44, z: 3.0 },
    { t: 2.4, cx: 470, cy: 470, z: 1.15 }, { t: 7.4, cx: 1436, cy: 470, z: 1.15 },
    { t: 7.9, cx: 870, cy: 300, z: 1.0 }, { t: 10.1, cx: 870, cy: 300, z: 1.0 },
    { t: 10.6, cx: 1350, cy: 330, z: 1.15 }, { t: 12.5, cx: 1350, cy: 330, z: 1.15 },
    { t: 13.0, cx: 1640, cy: 420, z: 2.0 }, { t: 14.9, cx: 1640, cy: 420, z: 2.0 },
    { t: 15.4, cx: 1712, cy: 205, z: 3.0 }, { t: 17.4, cx: 1712, cy: 205, z: 3.0 },
    { t: 18.0, cx: 178, cy: 821, z: 3.0 }],
  reveal: { x0: 10, x1: 1690, y0: 40, y1: 900, t0: 1.9, t1: 7.4, pad: 2 },
  hides: [
    { rect: [12, 757, 332, 128], until: 17.6 },                                // painel Market State
    { rect: [1684, 84, 82, 238], until: 15.2 },                                // alvos D, W, M e 3M
    { rect: [1688, 376, 56, 36], until: 12.8 }, { rect: [1688, 446, 56, 28], until: 12.8 }], // VWAP D, W e M
  boxes: extra.boxes || [],
  spots: extra.spots || []
});

// 7.png · ES 1 min · GL Gamma e painel de risco ---------------------------------
const gamma1m = (extra = {}) => ({
  t0: 0, t1: extra.t1 || 21.2, img: '7.png', last: true,
  cam: [
    { t: 0, cx: 538, cy: 958, z: 1.0 }, { t: 1.2, cx: 420, cy: 600, z: 1.25 },
    { t: 4.6, cx: 420, cy: 1250, z: 1.25 }, { t: 7.5, cx: 560, cy: 1150, z: 1.25 },
    { t: 8.0, cx: 760, cy: 330, z: 1.7 }, { t: 9.6, cx: 760, cy: 330, z: 1.7 },
    { t: 10.1, cx: 640, cy: 1420, z: 1.5 }, { t: 12.6, cx: 640, cy: 1420, z: 1.5 },
    { t: 13.1, cx: 840, cy: 990, z: 1.7 }, { t: 14.9, cx: 840, cy: 990, z: 1.7 },
    { t: 15.5, cx: 232, cy: 1690, z: 2.4 }, { t: 17.0, cx: 232, cy: 1690, z: 2.4 },
    { t: 17.4, cx: 565, cy: 1707, z: 3.5 }, { t: 18.7, cx: 565, cy: 1707, z: 3.5 },
    { t: 19.4, cx: 538, cy: 958, z: 1.0 }],
  reveal: { x0: 8, x1: 815, y0: 82, y1: 1842, t0: 0.5, t1: 7.5, pad: 2, color: '#040404' },
  hides: [
    { rect: [8, 29, 168, 18], until: 999, color: '#040404' },                  // nome interno dos indicadores
    { rect: [468, 29, 506, 18], until: 999, color: '#040404' },
    { rect: [812, 1665, 182, 18], until: 15.2, color: '#061412' }],            // "Spot ... 12:03" do painel
  boxes: extra.boxes || [],
  spots: extra.spots || []
});

// 8.png · ES · perda do Zero Gamma ------------------------------------------------
const zeroGamma = (extra = {}) => ({
  t0: 0, t1: extra.t1 || 15.8, img: '8.png', last: true,
  cam: [
    { t: 0, cx: 390, cy: 420, z: 1.3 }, { t: 4.6, cx: 430, cy: 470, z: 1.3 },
    { t: 7.0, cx: 560, cy: 700, z: 1.3 },
    { t: 7.5, cx: 720, cy: 540, z: 1.8 }, { t: 8.8, cx: 720, cy: 540, z: 1.8 },
    { t: 9.3, cx: 700, cy: 640, z: 1.8 }, { t: 10.8, cx: 700, cy: 640, z: 1.8 },
    { t: 11.3, cx: 560, cy: 990, z: 1.35 }, { t: 13.4, cx: 560, cy: 990, z: 1.35 },
    { t: 14.0, cx: 505, cy: 560, z: 1.07 }],
  reveal: { x0: 10, x1: 772, y0: 20, y1: 1085, t0: 0.4, t1: 7.0, pad: 2 },
  boxes: extra.boxes || []
});

// 9.png, 11.png e 12.png · ES · antes e depois da expansão de alta, somando o GL Gamma ------------------------
// Antes (9.png, 7.798,50): o preço passa pelos alvos de volatilidade (D, W e M) e o painel diz
// "expansão de alta acelerada". Depois (11.png, 7.804,25): ele chega no alvo estrutural de volume
// (a linha de liquidez em ~7.806) e o painel sobe para "expansão de alta muito forte".
const expansaoAntes = (extra = {}) => ({
  t0: 0, t1: 12.4, img: '9.png',
  cam: [
    { t: 0, cx: 357, cy: 470, z: 1.5 }, { t: 4.0, cx: 357, cy: 470, z: 1.5 },
    { t: 6.6, cx: 300, cy: 300, z: 1.7 },
    { t: 7.1, cx: 355, cy: 135, z: 3.0 }, { t: 8.9, cx: 355, cy: 135, z: 3.0 },
    { t: 9.4, cx: 240, cy: 140, z: 2.0 }, { t: 10.6, cx: 240, cy: 140, z: 2.0 },
    { t: 11.1, cx: 496, cy: 631, z: 3.0 }],
  reveal: { x0: 0, x1: 360, y0: 0, y1: 773, t0: 0.4, t1: 6.6, pad: 2 },
  hides: [
    { rect: [330, 568, 332, 128], until: 10.8 },                               // painel Market State
    { rect: [655, 63, 60, 24], until: 6.4 }],                                  // preço atual no eixo
  boxes: extra.boxes || [],
  spots: extra.spots || []
});
const expansaoDepois = (extra = {}) => ({
  t0: 12.0, t1: 17.6, img: '11.png',
  cam: [
    { t: 12.0, cx: 543, cy: 643, z: 3.0 }, { t: 14.2, cx: 543, cy: 643, z: 3.0 },
    { t: 14.8, cx: 300, cy: 110, z: 2.4 }],
  boxes: extra.boxes || [],
  spots: extra.spots || []
});
// 12.png · o mesmo gráfico somando o GL Gamma (GEX do SPX e do SPY sobre o ES), preço em 7.807
const expansaoGamma = (extra = {}) => ({
  t0: 17.2, t1: extra.t1 || 27.6, img: '12.png', last: true,
  cam: [
    { t: 17.2, cx: 313, cy: 330, z: 1.7 }, { t: 19.6, cx: 313, cy: 330, z: 1.7 },
    { t: 20.1, cx: 430, cy: 260, z: 2.2 }, { t: 21.4, cx: 430, cy: 260, z: 2.2 },
    { t: 21.9, cx: 280, cy: 140, z: 2.6 }, { t: 23.6, cx: 280, cy: 140, z: 2.6 },
    { t: 24.1, cx: 330, cy: 394, z: 2.2 }, { t: 25.4, cx: 330, cy: 394, z: 2.2 },
    { t: 25.9, cx: 313, cy: 330, z: 1.6 }],
  boxes: extra.boxes || []
});

// 10.png · ES · base, rompimento e alvo com o mapa de Gamma ------------------------
const rompimento = (extra = {}) => ({
  t0: 0, t1: extra.t1 || 17.0, img: '10.png', last: true,
  cam: [
    { t: 0, cx: 420, cy: 850, z: 1.3 }, { t: 5.2, cx: 520, cy: 830, z: 1.3 },
    { t: 6.8, cx: 640, cy: 640, z: 1.2 },
    { t: 7.3, cx: 650, cy: 800, z: 1.2 }, { t: 9.6, cx: 650, cy: 800, z: 1.2 },
    { t: 10.1, cx: 700, cy: 700, z: 1.4 }, { t: 12.0, cx: 700, cy: 700, z: 1.4 },
    { t: 12.5, cx: 740, cy: 400, z: 1.8 }, { t: 14.4, cx: 740, cy: 400, z: 1.8 },
    { t: 14.9, cx: 880, cy: 200, z: 2.0 }],
  reveal: { x0: 5, x1: 820, y0: 0, y1: 1211, t0: 0.4, t1: 6.8, pad: 2 },
  hides: [{ rect: [1004, 406, 70, 24], until: 6.6 }],                          // preço atual no eixo
  boxes: extra.boxes || []
});

const principais = [
  // 12. Estado de Mercado: o gráfico e o painel, parte por parte
  {
    id: 'v12-estado-de-mercado', ...V, dur: 23.6,
    scenes: [estado({ boxes: [
      { rect: [4, 30, 216, 30], t0: 0.3, t1: 1.6, label: 'GL Estado de Mercado', below: true, dx: 160 },
      { rect: [672, 48, 122, 470], t0: 7.9, t1: 9.0, color: GREEN, label: 'Expansão de alta', below: true },
      { rect: [962, 110, 100, 370], t0: 9.0, t1: 10.1, color: RED, label: 'Expansão de baixa', below: true },
      { rect: [1228, 222, 460, 22], t0: 10.7, t1: 12.5, color: GREEN, label: 'Alvo de volume', below: true },
      { rect: [1690, 376, 52, 98], t0: 13.1, t1: 14.9, label: 'VWAP D · W · M', below: true, dx: -40 },
      { rect: [1684, 84, 82, 238], t0: 15.5, t1: 17.4, label: 'Alvos de volatilidade', below: true, dx: -60 }],
      spots: [{ rect: [12, 757, 332, 128], t0: 18.1, t1: 21.0, pad: 10 }] })],
    captions: [
      { t0: 0.2, t1: 1.7, kick: 'Replay · ES · 30 min', text: 'O operacional por dentro' },
      { t0: 1.9, t1: 4.6, text: 'Três semanas de mercado <em>se construindo</em> no gráfico' },
      { t0: 4.8, t1: 7.5, text: 'Candles, regiões, bandas e alvos no <em>mesmo gráfico</em>' },
      { t0: 7.8, t1: 10.1, text: 'As cores mostram o <em>estado</em> do mercado' },
      { t0: 10.4, t1: 12.6, text: 'Faixas verdes: alvos <em>estruturais de volume</em>, onde está a liquidez' },
      { t0: 12.9, t1: 15.0, text: 'VWAPs do <em>dia</em>, da <em>semana</em> e do <em>mês</em>' },
      { t0: 15.3, t1: 17.5, text: 'Alvos de <em>volatilidade</em>: D +0,3%, W +0,5%, M +1% e 3M +1,5%' },
      { t0: 17.8, t1: 19.4, kick: 'GL · Market State', text: 'O painel diz: <em>equilíbrio na banda</em>' },
      { t0: 19.5, t1: 21.0, kick: 'GL · Market State', text: 'Macro comprador. Pausa dentro da <em>primeira banda</em>.' }
    ],
    end: { t0: 21.1, tag: 'O estado do mercado, em português, no seu gráfico.', disc: ALVOS },
    stills: [1, 6, 8.5, 9.6, 11.5, 14, 16.5, 19.5, 22.5]
  },
  // 13. Gamma no 1 minuto: calls em cima, puts embaixo, Zero Gamma e o painel de risco
  {
    id: 'v13-chao-das-puts', ...V, dur: 23.7,
    scenes: [gamma1m({ boxes: [
      { rect: [478, 134, 528, 22], t0: 8.0, t1: 9.7, label: 'Calls · 26,33K', below: true },
      { rect: [478, 1404, 528, 22], t0: 10.1, t1: 11.4, color: RED, label: 'Puts · 28,9K', below: true },
      { rect: [488, 1265, 45, 240], t0: 11.4, t1: 12.6, color: GREEN, label: 'Parou nas puts', below: true, dx: 120 },
      { rect: [844, 968, 142, 22], t0: 13.1, t1: 14.9, label: 'Zero Gamma', below: true, dx: -60 }],
      spots: [{ rect: [30, 1683, 402, 15], t0: 15.6, t1: 17.1, pad: 10 }, { rect: [428, 1700, 272, 15], t0: 17.4, t1: 18.8, pad: 10 }] })],
    captions: [
      { t0: 0.2, t1: 2.5, kick: 'Replay · ES · 1 min', text: 'O mapa de <em>Gamma</em> se construindo, candle a candle' },
      { t0: 2.7, t1: 5.2, text: 'O preço cai mais de <em class="red">50 pontos</em>…' },
      { t0: 5.4, t1: 7.6, text: '…e o mapa mostra onde estão as <em>opções</em>' },
      { t0: 7.9, t1: 9.7, kick: 'GL Gamma', text: 'Em cima, a maior barra de <em>calls</em>' },
      { t0: 10.0, t1: 11.3, kick: 'GL Gamma', text: 'Embaixo, a maior barra de <em>puts</em>' },
      { t0: 11.4, t1: 12.7, kick: 'GL Gamma', text: 'O preço desceu até lá e <em class="green">parou</em>' },
      { t0: 13.0, t1: 15.0, kick: 'GL Gamma', text: 'E voltou para o <em>Zero Gamma</em>' },
      { t0: 15.4, t1: 17.1, kick: 'Painel de risco', text: '<em class="green">Ofensivo forte</em>: 5 de 5 janelas positivas' },
      { t0: 17.2, t1: 18.8, kick: 'Painel de risco', text: 'Calls e demanda de alta <em>dominantes</em>' },
      { t0: 19.1, t1: 21.1, text: 'Calls, puts, Zero Gamma e risco no <em>mesmo gráfico</em>' }
    ],
    end: { t0: 21.2, brand: 'GL GAMMA', tag: 'O mapa das opções no seu gráfico de futuros.', disc: GAMMA },
    stills: [1, 3, 6.5, 9, 10.8, 12, 14, 16, 18, 20, 22.5]
  },
  // 14. Perdeu o Zero Gamma: do VAH D até a região das puts
  {
    id: 'v14-perdeu-o-zero-gamma', ...V, dur: 18.3,
    scenes: [zeroGamma({ boxes: [
      { rect: [450, 262, 195, 80], t0: 5.0, t1: 6.8, label: 'VAH D 7.744,75', below: true },
      { rect: [700, 504, 222, 26], t0: 7.5, t1: 8.9, label: 'Zero Gamma', below: true, dx: -40 },
      { rect: [698, 598, 72, 42], t0: 9.3, t1: 10.8, color: RED, label: 'VAL D · VAL NY', below: true, dx: -80 },
      { rect: [590, 958, 182, 92], t0: 11.3, t1: 13.4, color: GREEN, label: 'Região das puts', below: true, dx: -60 },
      { rect: [595, 154, 122, 16], t0: 14.0, t1: 15.7, label: 'Calls', below: true },
      { rect: [595, 1018, 122, 16], t0: 14.0, t1: 15.7, color: RED, label: 'Puts', below: true }] })],
    captions: [
      { t0: 0.2, t1: 2.8, kick: 'Replay · ES', text: 'O que acontece quando o preço perde o <em>Zero Gamma</em>?' },
      { t0: 3.0, t1: 4.9, text: 'Primeiro, ele sobe…' },
      { t0: 5.0, t1: 6.9, text: '…e trava no <em>VAH D</em>' },
      { t0: 7.4, t1: 9.0, kick: 'GL Gamma', text: 'Perde o <em>Zero Gamma</em>…' },
      { t0: 9.2, t1: 10.9, text: '…atravessa o <em>VAL D</em> e o <em>VAL NY</em> e <em class="red">acelera</em>' },
      { t0: 11.2, t1: 13.5, kick: 'GL Gamma', text: 'Até a região das <em>puts</em>, onde <em class="green">reage</em>' },
      { t0: 13.8, t1: 15.7, text: 'Calls em cima, puts embaixo, <em>Zero Gamma</em> no meio' }
    ],
    end: { t0: 15.8, brand: 'GL GAMMA', tag: 'Calls, puts e Zero Gamma no seu gráfico.', disc: GAMMA },
    stills: [1, 4, 6, 8.2, 10, 12.4, 14.8, 17]
  },
  // 15. Antes e depois: alvos de volatilidade, alvo estrutural de volume e, somando, o GL Gamma
  {
    id: 'v15-volatilidade-volume-gamma', ...V, dur: 30.1,
    scenes: [
      expansaoAntes({ boxes: [
        { rect: [72, 688, 48, 22], t0: 2.3, t1: 4.2, color: RED, label: 'Marca D -0,5%', below: true, dx: 160 },
        { rect: [336, 74, 44, 28], t0: 7.1, t1: 8.9, color: GREEN, label: 'M +1% · D +0,5%', below: false },
        { rect: [336, 170, 44, 22], t0: 7.1, t1: 8.9, color: GREEN, label: 'D +0,3% · W +0,5%', below: true },
        { rect: [0, 25, 358, 16], t0: 9.4, t1: 10.6, label: 'Alvo estrutural de volume', below: true }],
        spots: [{ rect: [331, 569, 330, 125], t0: 11.1, t1: 12.2, pad: 10 }] }),
      expansaoDepois({ boxes: [
        { rect: [250, 35, 125, 20], t0: 14.8, t1: 16.9, color: GREEN, label: 'Alvo de liquidez atingido', below: true }],
        spots: [{ rect: [378, 580, 330, 126], t0: 12.4, t1: 14.2, pad: 10 }] }),
      expansaoGamma({ boxes: [
        { rect: [240, 10, 324, 22], t0: 17.8, t1: 19.6, label: 'GEX · SPX · SPY · ES', below: true },
        { rect: [402, 238, 140, 18], t0: 20.1, t1: 21.4, label: 'Zero Gamma', below: true },
        { rect: [214, 97, 128, 18], t0: 21.9, t1: 23.6, label: 'C+ 23,51K · Alvo W +1%', below: true, dx: 40 },
        { rect: [214, 386, 310, 16], t0: 24.1, t1: 25.4, color: RED, label: 'Puts · P+ 9,42K', below: true },
        { rect: [0, 163, 264, 12], t0: 25.9, t1: 27.5, color: GREEN, label: 'Volume', below: true },
        { rect: [245, 200, 36, 100], t0: 25.9, t1: 27.5, label: 'Volatilidade', below: true },
        { rect: [400, 95, 145, 305], t0: 25.9, t1: 27.5, label: 'Gamma', below: true }] })
    ],
    captions: [
      { t0: 0.2, t1: 2.2, kick: 'Replay · ES · antes', text: 'Veja a <em>virada</em> acontecendo' },
      { t0: 2.3, t1: 4.2, text: 'O preço passa da marca <em class="red">D -0,5%</em>, faz fundo e vira' },
      { t0: 4.4, t1: 6.7, text: 'Atravessa as bandas e <em class="green">acelera</em>' },
      { t0: 6.9, t1: 9.0, text: 'Passa pelos alvos de <em>volatilidade</em>: D, W e M' },
      { t0: 9.2, t1: 10.7, text: 'Mas o alvo <em>estrutural de volume</em> ainda está acima' },
      { t0: 10.9, t1: 12.2, kick: 'GL · Market State', text: '<em>Expansão de alta acelerada</em> · extensão 39%' },
      { t0: 12.5, t1: 14.2, kick: 'Depois', text: '<em class="green">Expansão de alta muito forte</em> · extensão 48%' },
      { t0: 14.5, t1: 16.9, kick: 'Depois', text: 'E o preço chega no alvo <em>estrutural de volume</em>' },
      { t0: 17.6, t1: 19.6, kick: '+ GL Gamma', text: 'Somando o <em>GL Gamma</em>: as opções do SPX e do SPY no gráfico do ES' },
      { t0: 19.9, t1: 21.5, kick: '+ GL Gamma', text: 'O preço está acima do <em>Zero Gamma</em>' },
      { t0: 21.8, t1: 23.7, kick: '+ GL Gamma', text: 'Logo acima, calls (<em>C+ 23,51K</em>) no mesmo nível do alvo <em>W +1%</em>' },
      { t0: 24.0, t1: 25.5, kick: '+ GL Gamma', text: 'E as puts (<em>P+ 9,42K</em>) lá embaixo, na base' },
      { t0: 25.8, t1: 27.5, text: 'Volatilidade, volume e Gamma: <em>três leituras, um gráfico</em>' }
    ],
    end: { t0: 27.6, tag: 'Volatilidade, volume e Gamma no mesmo mapa.', disc: 'Alvos são projeções do modelo, não promessa de resultado. GL Gamma: assinatura à parte. Trading envolve risco financeiro real.' },
    stills: [1, 3.2, 5.5, 8, 10, 11.7, 13.3, 15.6, 18.6, 20.7, 22.7, 24.7, 26.6, 29]
  },
  // 16. Base, rompimento e alvo com o mapa de Gamma
  {
    id: 'v16-rompimento-gamma', ...V, dur: 19.5,
    scenes: [rompimento({ boxes: [
      { rect: [228, 944, 745, 30], t0: 7.3, t1: 9.6, color: GREEN, label: 'VAL D · P+ · Cluster', below: true },
      { rect: [646, 668, 176, 125], t0: 10.1, t1: 12.0, color: GREEN, label: 'Rompe o VAH W', below: true },
      { rect: [843, 535, 140, 20], t0: 10.9, t1: 12.0, label: 'Zero Gamma', below: true, dx: -30 },
      { rect: [648, 290, 175, 62], t0: 12.5, t1: 14.4, label: 'VAH D · Cluster 7.805', below: true, dx: -40 },
      { rect: [812, 138, 186, 22], t0: 14.9, t1: 16.9, label: 'Alvo W +1%', below: true }] })],
    captions: [
      { t0: 0.2, t1: 2.6, kick: 'Replay · ES', text: 'A base, o rompimento e o <em>alvo</em>' },
      { t0: 2.8, t1: 5.3, text: 'O preço segura na <em>base</em>…' },
      { t0: 5.4, t1: 7.0, text: '…e <em class="green">rompe com força</em>' },
      { t0: 7.2, t1: 9.7, text: 'A base: <em>VAL D</em>, nível de puts (P+) e cluster na mesma região' },
      { t0: 10.0, t1: 12.1, text: 'Rompe o <em>VAH W</em> e passa o <em>Zero Gamma</em>' },
      { t0: 12.4, t1: 14.5, text: 'Para no <em>VAH D</em> e no cluster de 7.805' },
      { t0: 14.8, t1: 16.9, text: 'Próximo alvo no mapa: <em>W +1%</em>' }
    ],
    end: { t0: 17.0, tag: 'Base, rompimento e alvo no mesmo mapa.', disc: 'Alvos são projeções do modelo, não promessa de resultado. GL Gamma: assinatura à parte. Trading envolve risco financeiro real.' },
    stills: [1, 4, 6.2, 8.4, 11.3, 13.4, 15.8, 18]
  }
];

// Coringas limpos: o mesmo movimento, sem legenda, sem caixas e sem cartela
const limpo = (id, scene, dur) => ({ id, ...V, dur, scenes: [scene], stills: [2, dur / 2, dur - 1] });
const limpos = [
  // sem a abertura no nome do indicador: o gráfico já começa a se construir
  limpo('c11-estado-de-mercado-limpo', (() => { const e = estado({ t1: 21 }); e.cam.splice(0, 2, { t: 0, cx: 470, cy: 470, z: 1.15 }); e.reveal.t0 = 0.3; return e; })(), 21),
  limpo('c12-gamma-1-minuto-limpo', gamma1m({ t1: 21 }), 21),
  limpo('c13-zero-gamma-limpo', zeroGamma({ t1: 15.5 }), 15.5),
  { id: 'c14-volatilidade-volume-gamma-limpo', ...V, dur: 27.5, scenes: [expansaoAntes(), expansaoDepois(), expansaoGamma({ t1: 27.5 })], stills: [3, 9, 13, 16, 19, 23, 26] },
  limpo('c15-rompimento-gamma-limpo', rompimento({ t1: 16.8 }), 16.8)
];

// Horizontal 16:9: o print de 30 minutos inteiro, depois os alvos e o painel
const horizontais = [
  { id: 'h04-estado-de-mercado-limpo', ...L, dur: 15, scenes: [{ t0: 0, t1: 15, img: '6.png', last: true,
      cam: [{ t: 0, cx: 953, cy: 470, z: 1.0 }, { t: 8.6, cx: 953, cy: 470, z: 1.0 }, { t: 10.2, cx: 1640, cy: 230, z: 2.0 },
            { t: 12.2, cx: 1640, cy: 230, z: 2.0 }, { t: 13.6, cx: 200, cy: 815, z: 2.6 }],
      reveal: { x0: 10, x1: 1690, y0: 40, y1: 900, t0: 0.6, t1: 8.4, pad: 2 },
      hides: [{ rect: [12, 757, 332, 128], until: 13.2 }, { rect: [1684, 84, 82, 238], until: 9.6 },
              { rect: [1688, 376, 56, 36], until: 9.6 }, { rect: [1688, 446, 56, 28], until: 9.6 }] }],
    stills: [4, 8.5, 11, 14.5] }
];

// Versões 4:5 (1080x1350) para o feed: a mesma câmera, quadro mais baixo
function feed(spec, fix = () => {}) {
  const s = JSON.parse(JSON.stringify(spec));
  s.id = spec.id + '-4x5'; s.h = 1350; s.ay = 870;
  fix(s);
  s.stills = (s.captions || []).map(c => +((c.t0 + c.t1) / 2).toFixed(1)).concat([+(s.end.t0 + 1.5).toFixed(1)]);
  return s;
}
const feeds = principais.map(s => feed(s));

module.exports = [...principais, ...limpos, ...horizontais, ...feeds];
