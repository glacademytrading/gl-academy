// Roteiros dos vídeos. Coordenadas em pixels de cada print original.
const V = { w: 1080, h: 1920, ay: 1120 };
const L = { w: 1920, h: 1080, ay: 560 };
const GREEN = '#4fe3a8', RED = '#ff6b6b', GOLD = '#f6d991';

const END = (t0, tag, disc) => ({ t0, tag, disc });

// Cenas reutilizáveis ------------------------------------------------------
const sceneAlta = (t0, t1, extra = {}) => ({
  t0, t1, img: '5.png',
  cam: extra.cam || [
    { t: t0, cx: 300, cy: 470, z: 2.0 }, { t: t0 + 4, cx: 470, cy: 590, z: 2.0 },
    { t: t0 + 6.2, cx: 600, cy: 400, z: 1.8 }, { t: t0 + 8.4, cx: 700, cy: 260, z: 1.8 },
    { t: t0 + 9.4, cx: 862, cy: 108, z: 2.4 }],
  reveal: { x0: 250, x1: 790, y0: 40, y1: 800, t0: t0 + 0.3, t1: t0 + 8.4, pad: 6 },
  hides: [{ rect: [826, 82, 116, 40], until: t0 + (extra.labelAt || 9.2) }, { rect: [780, 78, 24, 24], until: t0 + (extra.labelAt || 9.2) }],
  boxes: extra.boxes || [],
  last: extra.last
});

module.exports = [
  // 1. A favor ou contra (antes e depois)
  {
    id: 'v01-a-favor-ou-contra', ...V, dur: 15,
    scenes: [
      { t0: 0, t1: 6.3, img: '1.png',
        cam: [{ t: 0, cx: 1245, cy: 440, z: 1.02 }, { t: 1.4, cx: 1245, cy: 440, z: 1.02 }, { t: 3.4, cx: 1640, cy: 710, z: 2.5 }],
        boxes: [{ rect: [1628, 721, 110, 30], t0: 3.3, t1: 6.2, color: RED, label: 'Contexto contra', below: true }] },
      { t0: 6.3, t1: 12.6, img: '5.png',
        cam: [{ t: 6.3, cx: 490, cy: 430, z: 1.1 }, { t: 9.6, cx: 560, cy: 380, z: 1.25 }, { t: 10.7, cx: 862, cy: 108, z: 2.4 }],
        reveal: { x0: 470, x1: 790, y0: 40, y1: 800, t0: 6.6, t1: 9.6, pad: 6 },
        hides: [{ rect: [826, 82, 116, 40], until: 9.8 }, { rect: [780, 78, 24, 24], until: 9.8 }],
        boxes: [{ rect: [830, 86, 110, 32], t0: 10.0, t1: 12.5, color: GREEN, label: 'Contexto a favor', below: true, dx: -40 }] }
    ],
    captions: [
      { t0: 0.2, t1: 3.1, kick: 'Antes de entrar', text: 'O mercado está <em>a favor</em> ou <em>contra</em> você?' },
      { t0: 3.3, t1: 6.2, kick: 'GL Model · contexto', text: 'Correção contra W/M. <em class="red">Calor 4%.</em> O modelo diz: espere.' },
      { t0: 6.5, t1: 9.7, kick: 'Depois', text: 'Quando diário, semanal e mensal se alinham…' },
      { t0: 9.9, t1: 12.5, kick: 'GL Model · contexto', text: 'Alta alinhada D/W/M. <em class="green">Calor 19%.</em> Contexto a favor.' }
    ],
    end: END(12.6, 'Direção clara antes da entrada.'),
    stills: [4.5, 11]
  },
  // 2. Setup acontecendo
  {
    id: 'v02-setup-acontecendo', ...V, dur: 14.5,
    scenes: [sceneAlta(0, 12.2, { last: true, boxes: [
      { rect: [22, 354, 362, 245], t0: 1.0, t1: 3.3, label: 'Zona de valor' },
      { rect: [455, 690, 75, 75], t0: 4.3, t1: 6.1, color: RED, label: 'Varredura na mínima', below: true },
      { rect: [572, 262, 34, 245], t0: 6.4, t1: 8.5, color: GREEN, label: 'Rompimento com fluxo', dx: 60 },
      { rect: [830, 86, 110, 32], t0: 9.5, t1: 12.1, color: GREEN, label: 'Alinhamento D/W/M', below: true, dx: -40 }] })],
    captions: [
      { t0: 0.2, t1: 3.2, kick: 'Setup GL Model · replay', text: 'Veja o setup <em>acontecendo</em>' },
      { t0: 3.4, t1: 6.1, text: 'O preço varre a mínima e volta para o valor' },
      { t0: 6.3, t1: 9.2, text: 'Rompimento acima das <em>VWAPs D e W</em>' },
      { t0: 9.4, t1: 12.1, text: 'O modelo confirma: <em class="green">alta alinhada D/W/M</em>' }
    ],
    end: END(12.2, 'O setup fica visível enquanto acontece.'),
    stills: [5, 7.5, 10.5]
  },
  // 3. Alvos claros
  {
    id: 'v03-alvos-claros', ...V, dur: 14.5,
    scenes: [{ t0: 0, t1: 12.2, img: '4.png', last: true,
      cam: [{ t: 0, cx: 260, cy: 470, z: 1.55 }, { t: 7.6, cx: 250, cy: 330, z: 1.9 }, { t: 8.6, cx: 272, cy: 230, z: 2.6 }, { t: 9.8, cx: 272, cy: 230, z: 2.6 }, { t: 10.8, cx: 272, cy: 150, z: 2.6 }],
      reveal: { x0: 0, x1: 219, y0: 150, y1: 889, t0: 0.4, t1: 7.6, pad: 1 },
      boxes: [
        { rect: [228, 172, 95, 28], t0: 0.8, t1: 3.6, label: 'Alvo já marcado', below: true },
        { rect: [196, 196, 30, 30], t0: 7.8, t1: 9.8, color: GREEN, label: 'Preço buscando o alvo', below: true, dx: 60 },
        { rect: [228, 24, 90, 76], t0: 10.0, t1: 12.1, label: 'Próximos alvos', below: true }] }],
    captions: [
      { t0: 0.2, t1: 3.6, kick: 'Alvos GL Model', text: 'O alvo aparece <em>antes</em> do preço chegar' },
      { t0: 3.8, t1: 7.6, text: 'VAH, VAL e estrutura no mesmo gráfico' },
      { t0: 7.8, t1: 9.8, text: 'Preço buscando o <em>alvo D/W +1%</em>' },
      { t0: 10.0, t1: 12.1, text: 'Próximos alvos já mapeados: <em>M +4%</em> e <em>3M +4,5%</em>' }
    ],
    end: END(12.2, 'Entrada, invalidação e alvo no mesmo mapa.', 'Alvos são projeções do modelo, não promessa de resultado. Trading envolve risco financeiro real.'),
    stills: [2, 9, 11]
  },
  // 4. Gamma Exposure
  {
    id: 'v04-gamma-exposure', ...V, dur: 13.5,
    scenes: [{ t0: 0, t1: 11.2, img: '4.png', last: true,
      cam: [{ t: 0, cx: 353, cy: 445, z: 1.45 }, { t: 1.8, cx: 470, cy: 320, z: 2.6 }, { t: 4.1, cx: 470, cy: 537, z: 2.6 }, { t: 6.5, cx: 470, cy: 725, z: 2.6 }, { t: 9.0, cx: 400, cy: 460, z: 1.5 }],
      boxes: [
        { rect: [487, 300, 114, 30], t0: 2.0, t1: 4.0, label: 'Zero Gamma', below: true, dx: -20 },
        { rect: [487, 527, 114, 20], t0: 4.3, t1: 6.4, label: 'Call Wall', below: true, dx: -20 },
        { rect: [487, 725, 114, 22], t0: 6.7, t1: 8.9, label: 'HVL · Gamma Flip', below: true, dx: -40 },
        { rect: [487, 388, 114, 440], t0: 9.2, t1: 11.1, label: 'Níveis GL', dx: -30 }] }],
    captions: [
      { t0: 0.2, t1: 1.9, kick: 'Gamma Exposure', text: 'O mapa das <em>opções</em> dentro do seu gráfico' },
      { t0: 2.0, t1: 4.1, text: '<em>Zero Gamma</em>: onde o regime de volatilidade vira' },
      { t0: 4.3, t1: 6.5, text: '<em>Call Wall</em>: a parede que costuma segurar o preço' },
      { t0: 6.7, t1: 9.0, text: '<em>HVL e Gamma Flip</em>: níveis de virada da volatilidade' },
      { t0: 9.2, t1: 11.1, text: 'Tudo isso lido junto com o <em>GL Model</em>' }
    ],
    end: END(11.2, 'Gamma Exposure no mesmo mapa do GL Model.'),
    stills: [3, 7.5]
  },
  // 5. Nível respeitado
  {
    id: 'v05-nivel-respeitado', ...V, dur: 13.5,
    scenes: [{ t0: 0, t1: 11, img: '2.png', last: true,
      cam: [{ t: 0, cx: 250, cy: 380, z: 1.7 }, { t: 6.3, cx: 560, cy: 300, z: 2.3 }, { t: 7.6, cx: 585, cy: 90, z: 2.5 }, { t: 9.2, cx: 585, cy: 90, z: 2.5 }, { t: 10.6, cx: 470, cy: 300, z: 1.45 }],
      reveal: { x0: 0, x1: 618, y0: 0, y1: 635, t0: 0.4, t1: 7.2, pad: 4 },
      hides: [{ rect: [645, 18, 100, 38], until: 7.6 }, { rect: [586, 334, 60, 60], until: 6.4 }],
      boxes: [
        { rect: [540, 308, 100, 36], t0: 6.5, t1: 7.7, color: GREEN, label: 'Defesa no nível', below: true },
        { rect: [548, 22, 72, 30], t0: 7.9, t1: 10.4, label: 'VAH D 7.776', below: true }] }],
    captions: [
      { t0: 0.2, t1: 3.3, kick: 'Replay · MES', text: 'O mapa marca o nível. <em>O preço respeita.</em>' },
      { t0: 3.5, t1: 6.4, text: 'Construção de valor dentro do plano' },
      { t0: 6.5, t1: 7.8, text: 'Defesa na região marcada' },
      { t0: 7.9, t1: 10.4, text: 'E o preço vai buscar o <em>VAH D 7.776</em>' }
    ],
    end: END(11, 'Níveis institucionais no seu gráfico.', 'Exemplo educacional. Resultado passado não garante resultado futuro. Trading envolve risco.'),
    stills: [7, 8.5]
  },
  // 6. Também no NinjaTrader
  {
    id: 'v06-ninjatrader', ...V, dur: 12.5,
    scenes: [{ t0: 0, t1: 10.2, img: '3.png', last: true,
      cam: [{ t: 0, cx: 190, cy: 44, z: 2.7 }, { t: 2.2, cx: 190, cy: 44, z: 2.7 }, { t: 3.2, cx: 420, cy: 330, z: 1.25 }, { t: 7.6, cx: 1250, cy: 520, z: 1.25 }, { t: 8.8, cx: 1455, cy: 690, z: 2.6 }],
      reveal: { x0: 180, x1: 1518, y0: 60, y1: 830, t0: 2.4, t1: 7.6, pad: 2 },
      boxes: [
        { rect: [8, 36, 366, 16], t0: 0.3, t1: 2.3, label: 'Indicador GL no NinjaTrader', below: true, dx: 120 },
        { rect: [1405, 628, 112, 132], t0: 8.8, t1: 10.1, label: 'VAH D · POC D', dx: -60 }] }],
    captions: [
      { t0: 0.2, t1: 2.3, kick: 'NinjaTrader', text: 'O mapa GL agora no <em>NinjaTrader</em>' },
      { t0: 2.5, t1: 5.4, text: 'Estrutura com POC e VAL <em>semanais e mensais</em>' },
      { t0: 5.6, t1: 8.6, text: 'Níveis da semana e do mês marcados no gráfico' },
      { t0: 8.8, t1: 10.1, text: 'E o valor do dia para executar' }
    ],
    end: END(10.2, 'TradingView e NinjaTrader.'),
    stills: [1, 6, 9.4]
  },
  // 7. As 3 perguntas antes do trade
  {
    id: 'v07-tres-perguntas', ...V, dur: 16.5,
    scenes: [
      { t0: 0, t1: 4.7, img: '5.png', cam: [{ t: 0, cx: 560, cy: 380, z: 1.2 }, { t: 2.4, cx: 862, cy: 108, z: 2.5 }],
        boxes: [{ rect: [830, 86, 110, 32], t0: 2.5, t1: 4.6, color: GREEN, label: 'Direção', below: true, dx: -40 }] },
      { t0: 4.7, t1: 9.4, img: '2.png', cam: [{ t: 4.7, cx: 420, cy: 300, z: 1.5 }, { t: 6.6, cx: 575, cy: 310, z: 2.5 }],
        boxes: [{ rect: [540, 308, 100, 36], t0: 6.8, t1: 9.3, color: GREEN, label: 'Entrada no nível', below: true }] },
      { t0: 9.4, t1: 14.2, img: '4.png', cam: [{ t: 9.4, cx: 300, cy: 420, z: 1.6 }, { t: 11.3, cx: 272, cy: 120, z: 2.6 }],
        boxes: [{ rect: [228, 24, 95, 176], t0: 11.5, t1: 14.1, label: 'Alvos', below: true }] }
    ],
    captions: [
      { t0: 0.2, t1: 4.6, kick: 'Pergunta 1', text: 'Qual é a <em>direção</em>?' },
      { t0: 4.9, t1: 9.3, kick: 'Pergunta 2', text: 'Onde é a <em>entrada</em>?' },
      { t0: 9.6, t1: 14.1, kick: 'Pergunta 3', text: 'Onde estão os <em>alvos</em>?' }
    ],
    end: END(14.2, 'O GL Model responde as três antes do trade.'),
    stills: [3, 8, 12.5]
  },

  // Coringas limpos (sem legenda e sem cartela) --------------------------------
  { id: 'c01-setup-acontecendo-limpo', ...V, dur: 11, scenes: [sceneAlta(0, 11, { last: true })] },
  { id: 'c02-alvos-limpo', ...V, dur: 10.5, scenes: [{ t0: 0, t1: 10.5, img: '4.png', last: true,
      cam: [{ t: 0, cx: 260, cy: 470, z: 1.55 }, { t: 7.6, cx: 250, cy: 330, z: 1.9 }, { t: 9.5, cx: 272, cy: 180, z: 2.5 }],
      reveal: { x0: 0, x1: 219, y0: 150, y1: 889, t0: 0.4, t1: 7.6, pad: 1 } }] },
  { id: 'c03-gamma-limpo', ...V, dur: 10, scenes: [{ t0: 0, t1: 10, img: '4.png', last: true,
      cam: [{ t: 0, cx: 353, cy: 445, z: 1.45 }, { t: 3, cx: 470, cy: 320, z: 2.4 }, { t: 6, cx: 470, cy: 600, z: 2.4 }, { t: 10, cx: 400, cy: 460, z: 1.5 }] }] },
  { id: 'c04-nivel-limpo', ...V, dur: 10, scenes: [{ t0: 0, t1: 10, img: '2.png', last: true,
      cam: [{ t: 0, cx: 250, cy: 380, z: 1.7 }, { t: 7.2, cx: 560, cy: 250, z: 2.2 }, { t: 10, cx: 585, cy: 110, z: 2.5 }],
      reveal: { x0: 0, x1: 618, y0: 0, y1: 635, t0: 0.4, t1: 7.2, pad: 4 },
      hides: [{ rect: [645, 18, 100, 38], until: 7.6 }, { rect: [586, 334, 60, 60], until: 6.6 }] }] },
  { id: 'c05-ninjatrader-limpo', ...V, dur: 10, scenes: [{ t0: 0, t1: 10, img: '3.png', last: true,
      cam: [{ t: 0, cx: 380, cy: 330, z: 1.25 }, { t: 7.5, cx: 1250, cy: 520, z: 1.25 }, { t: 10, cx: 1455, cy: 690, z: 2.2 }],
      reveal: { x0: 180, x1: 1518, y0: 60, y1: 830, t0: 0.3, t1: 7.5, pad: 2 } }] },
  { id: 'c06-contra-limpo', ...V, dur: 8, scenes: [{ t0: 0, t1: 8, img: '1.png', last: true,
      cam: [{ t: 0, cx: 1245, cy: 440, z: 1.02 }, { t: 2, cx: 1245, cy: 440, z: 1.02 }, { t: 6, cx: 1640, cy: 710, z: 2.4 }] }] },

  // Coringas horizontais (YouTube, lives, VSL) --------------------------------
  { id: 'h01-duas-telas-limpo', ...L, dur: 12, replayText: 'Replay · exemplo educacional', scenes: [{ t0: 0, t1: 12, img: '1.png', last: true,
      cam: [{ t: 0, cx: 908, cy: 436, z: 1.12 }, { t: 5, cx: 1100, cy: 440, z: 1.35 }, { t: 12, cx: 1500, cy: 600, z: 1.8 }],
      reveal: { x0: 1000, x1: 1560, y0: 60, y1: 840, t0: 1, t1: 9, pad: 2, sample: [1600, 300] } }] },
  { id: 'h02-alta-alinhada-limpo', ...L, dur: 12, scenes: [{ t0: 0, t1: 12, img: '5.png', last: true,
      cam: [{ t: 0, cx: 420, cy: 430, z: 1.3 }, { t: 9, cx: 560, cy: 360, z: 1.3 }, { t: 12, cx: 760, cy: 200, z: 2.0 }],
      reveal: { x0: 300, x1: 790, y0: 40, y1: 800, t0: 0.5, t1: 9, pad: 6 },
      hides: [{ rect: [826, 82, 116, 40], until: 9.2 }, { rect: [780, 78, 24, 24], until: 9.2 }] }] },
  { id: 'h03-ninjatrader-limpo', ...L, dur: 12, scenes: [{ t0: 0, t1: 12, img: '3.png', last: true,
      cam: [{ t: 0, cx: 836, cy: 444, z: 1.18 }, { t: 9, cx: 900, cy: 444, z: 1.25 }, { t: 12, cx: 1400, cy: 660, z: 2.0 }],
      reveal: { x0: 60, x1: 1518, y0: 60, y1: 830, t0: 0.5, t1: 9, pad: 2 } }] }
];
