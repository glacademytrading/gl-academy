// GL Risk Auto (prints 22 a 26): o plano é medido em R antes do clique, o trade acima do teto de risco é barrado
// e o que cabe na gestão sai pelo controle. Coordenadas em pixels de cada print.
// Fica escondido: as setas que o Giovane desenhou no print 26, o alvo em dólar, saldo e P/L da conta e a barra do Windows.
const V = { w: 1080, h: 1920, ay: 1120 };
const GREEN = '#4fe3a8', RED = '#ff6b6b';
const END = (t0, tag, disc) => ({ t0, tag, disc });
const DISC = 'Risco estimado no stop; custos e slippage não incluídos. Conteúdo educacional: trading envolve risco financeiro real.';

// print 26: plano visual de venda no ES (1003x1479)
const P26 = [
  { rect: [858, 452, 95, 55], color: '#000000' }, { rect: [862, 580, 105, 65], color: '#000000' },   // setas
  { rect: [878, 888, 118, 66], color: '#000000' }, { rect: [378, 1300, 95, 62], color: '#000000' },
  { rect: [784, 943, 72, 22] }                                                                       // "+US$875,00"
];
// print 25: tela inteira com o painel à esquerda (1034x601)
const P25 = [
  { rect: [4, 216, 126, 32], color: '#0b0b0b' },          // saldo, dia e P/L
  { rect: [58, 162, 72, 9], color: '#0b0b0b' },           // alvo em dólar
  { rect: [0, 574, 1034, 27], color: '#0b0b0b' }          // barra do Windows
];

module.exports = [
  {
    id: 'v18-risk-auto-teto', ...V, dur: 24,
    scenes: [
      { t0: 0, t1: 7.4, img: '26.png', hides: P26,
        cam: [{ t: 0, cx: 520, cy: 760, z: 1.08 }, { t: 3.2, cx: 560, cy: 760, z: 1.12 }, { t: 7.2, cx: 640, cy: 760, z: 1.3 }],
        boxes: [
          { rect: [583, 643, 262, 16], t0: 1.0, t1: 3.6, label: 'Entrada', below: true, dx: -40 },
          { rect: [583, 507, 268, 20], t0: 1.6, t1: 3.6, color: RED, label: 'Stop', dx: -60 },
          { rect: [583, 940, 160, 26], t0: 3.9, t1: 7.2, color: GREEN, label: 'Alvo em 2,26R', below: true, dx: -20 }] },
      { t0: 7.4, t1: 12.6, img: '26.png', hides: P26,
        cam: [{ t: 7.4, cx: 176, cy: 1398, z: 2.2 }, { t: 9.2, cx: 176, cy: 1400, z: 2.9 }],
        boxes: [{ rect: [3, 1413, 346, 20], t0: 9.4, t1: 12.5, color: RED, label: 'Acima do teto: bloqueado', below: true, dx: 0 }] },
      { t0: 12.6, t1: 17.6, img: '25.png', hides: P25,
        cam: [{ t: 12.6, cx: 150, cy: 140, z: 2.6 }, { t: 15, cx: 150, cy: 150, z: 3.0 }],
        boxes: [
          { rect: [8, 33, 118, 24], t0: 13.0, t1: 15.0, color: GREEN, label: 'Plano pronto', below: true, dx: 170 },
          { rect: [6, 171, 112, 10], t0: 15.0, t1: 17.5, color: GREEN, label: 'Dentro do teto', below: true, dx: 170 }] },
      { t0: 17.6, t1: 24, img: '22.png', last: true,
        cam: [{ t: 17.6, cx: 160, cy: 170, z: 3.1 }, { t: 20, cx: 160, cy: 300, z: 3.1 }],
        boxes: [{ rect: [20, 286, 282, 30], t0: 20.2, t1: 22.8, label: 'A compra · Y vende', below: true }] }],
    captions: [
      { t0: 0.2, t1: 3.7, kick: 'GL Risk Auto', text: 'O risco medido <em>antes</em> do clique' },
      { t0: 3.9, t1: 7.2, text: 'Venda planejada: alvo em <em>2,26R</em>, desenhado no gráfico' },
      { t0: 7.6, t1: 12.4, text: 'Risco de US$387,50 com teto de US$285,71: <em>o trade não passa</em>' },
      { t0: 12.8, t1: 17.4, text: 'Dentro da gestão: <em>plano pronto</em>, o START confirma' },
      { t0: 17.8, t1: 22.8, text: 'Tudo pelo controle, <em>sem planilha</em> e sem conta de cabeça' }],
    end: END(22.8, 'Gestão de risco automática no NinjaTrader.', DISC),
    stills: [2.5, 6, 11, 15.5, 21]
  }
];
