// Rodada 3 (0 crédito): logo premium, vinheta, aulas de 15 s e respostas a objeções.
// Coordenadas em pixels de cada print original.
const V = { w: 1080, h: 1920, ay: 1120 };
const L = { w: 1920, h: 1080, ay: 540 };
const GREEN = '#4fe3a8', RED = '#ff6b6b';

// Emblema: área visível do emblem.png (800 px) vai de x 151–637 e y 159–654
const EMB = { x0: 151 / 800, x1: 637 / 800, y0: 159 / 800, y1: 654 / 800, topX: 394 / 800 };
const embPoint = (W, size, cy, fx, fy) => [W / 2 - size / 2 + fx * size, cy - size / 2 + fy * size];

function logoSpec({ id, W, H, size, cy, step, word, track, wordTop, tagTop, short }) {
  const T = short
    ? { p0: .1, p1: 1.9, streak: .034, shine: [2.0, 2.75], push: [1.7, 4.0, 1.03], word: 2.05, win: .75, dur: 4.0 }
    : { p0: .25, p1: 4.2, streak: .026, shine: [4.35, 5.35], push: [3.9, 8.0, 1.04], word: 4.75, win: 1.1, tag: 5.45, dur: 8.0 };
  const [fx, fy] = embPoint(W, size, cy, EMB.topX, EMB.y0);
  const [rx, ry] = embPoint(W, size, cy, EMB.x1, (EMB.y0 + EMB.y1) / 2);
  const texts = [{ t0: T.word, t1: 99, top: wordTop, in: T.win, rise: 18, track, html: `<div class="word trk" style="font-size:${word}px">GL ACADEMY</div>` }];
  if (!short) texts.push({ t0: T.tag, t1: 99, top: tagTop, in: .9, rise: 10, html: '<div class="rule"></div><div class="tagl">MODELO DE NEGOCIAÇÃO</div>' });
  const sparks = [{ t: T.p1 - .05, x: fx, y: fy + 6, s: W > H ? 230 : 260 }];
  if (!short) sparks.push({ t: 6.6, x: rx - 4, y: ry, s: 150, d: .9 });
  return {
    id, w: W, h: H, dur: T.dur, replay: false, hideWm: true, dust: { n: 110, period: 16, alpha: .75 },
    scenes: [{ t0: 0, t1: T.dur + 1, last: true, push: T.push,
      particles: { size, cy, t0: T.p0, t1: T.p1, step, streak: T.streak, swirl: 1.5, alpha: .8, add: true, glow: true, rays: true, shine: T.shine } }],
    texts, sparks,
    stills: short ? [.8, 1.4, 1.85, 2.4, 3.9] : [2.0, 2.8, 3.5, 4.15, 4.85, 7.9]
  };
}

const logos = [
  logoSpec({ id: 'logo-gl-8s-16x9', W: 1920, H: 1080, size: 620, cy: 400, step: 3, word: 128, track: [.55, .16], wordTop: 660, tagTop: 812 }),
  logoSpec({ id: 'logo-gl-8s-9x16', W: 1080, H: 1920, size: 900, cy: 773, step: 4, word: 96, track: [.3, .12], wordTop: 1150, tagTop: 1290 }),
  logoSpec({ id: 'vinheta-gl-4s-16x9', W: 1920, H: 1080, size: 620, cy: 430, step: 3, word: 128, track: [.45, .16], wordTop: 700, short: true }),
  logoSpec({ id: 'vinheta-gl-4s-9x16', W: 1080, H: 1920, size: 900, cy: 800, step: 4, word: 96, track: [.3, .12], wordTop: 1180, short: true })
];

// Aulas rápidas (conteúdo) ------------------------------------------------
const TOOLBAR1 = { rect: [0, 0, 1816, 40], until: 999, color: '#0b0b0b' };
const aulas = [
  { id: 'aula-vwap', ...V, dur: 17.3,
    scenes: [{ t0: 0, t1: 14.3, img: '1.png', last: true, hides: [TOOLBAR1],
      cam: [{ t: 0, cx: 360, cy: 470, z: 1.55 }, { t: 2.6, cx: 380, cy: 440, z: 1.65 }, { t: 4.0, cx: 430, cy: 420, z: 2.0 },
        { t: 6.4, cx: 470, cy: 340, z: 2.1 }, { t: 9.4, cx: 440, cy: 330, z: 1.9 }, { t: 12.2, cx: 500, cy: 380, z: 2.5 }],
      spots: [{ rect: [225, 380, 305, 100], t0: 3.0, t1: 5.7 }, { rect: [445, 185, 90, 120], t0: 9.3, t1: 11.7 }],
      boxes: [
        { rect: [552, 283, 40, 15], t0: 6.0, t1: 7.4, label: 'VWAP W' },
        { rect: [552, 382, 40, 15], t0: 7.4, t1: 8.8, label: 'VWAP 3M', below: true },
        { rect: [490, 376, 28, 28], t0: 12.0, t1: 14.1, color: GREEN, label: 'Defesa na VWAP 3M', below: true, dx: -40 }] }],
    captions: [
      { t0: 0.2, t1: 2.7, kick: 'Aula rápida', text: 'O que é a <em>VWAP</em>?' },
      { t0: 2.8, t1: 5.8, text: 'O preço médio do período, <em>ponderado pelo volume</em>' },
      { t0: 5.9, t1: 8.8, text: 'A da <em>semana</em> e a do <em>trimestre</em> no mesmo gráfico' },
      { t0: 8.9, t1: 11.8, text: 'Preço acima da VWAP: o mercado paga <em>mais que a média</em>' },
      { t0: 11.9, t1: 14.2, text: 'Aqui o preço voltou à <em>VWAP 3M</em> e foi <em class="green">defendido</em>' }],
    end: { t0: 14.3, tag: 'A VWAP é uma das camadas do GL Model.' }, stills: [1.5, 4.3, 6.6, 8.2, 10.5, 13] },
  { id: 'aula-value-area', ...V, dur: 16.9,
    scenes: [{ t0: 0, t1: 13.9, img: '3.png', last: true,
      cam: [{ t: 0, cx: 1255, cy: 380, z: 1.3 }, { t: 2.6, cx: 1300, cy: 420, z: 1.45 }, { t: 3.6, cx: 1440, cy: 610, z: 2.4 },
        { t: 10.8, cx: 1440, cy: 610, z: 2.4 }, { t: 11.6, cx: 1360, cy: 430, z: 1.7 }],
      spots: [{ rect: [1414, 645, 100, 80], t0: 3.2, t1: 5.8 }],
      boxes: [
        { rect: [1448, 643, 32, 13], t0: 6.0, t1: 7.2, label: 'VAH D', dx: -60 },
        { rect: [1448, 716, 32, 13], t0: 7.2, t1: 8.4, label: 'VAL D', below: true, dx: -60 },
        { rect: [1448, 698, 32, 13], t0: 8.6, t1: 10.8, color: GREEN, label: 'POC D', below: true, dx: -60 },
        { rect: [1448, 414, 32, 13], t0: 11.3, t1: 12.5, label: 'POC M', below: true, dx: -60 },
        { rect: [1448, 530, 30, 13], t0: 12.5, t1: 13.8, label: 'VAL W', below: true, dx: -60 }] }],
    captions: [
      { t0: 0.2, t1: 2.7, kick: 'Aula rápida', text: 'O que é <em>Value Area</em>?' },
      { t0: 2.8, t1: 5.8, text: 'A faixa de preço onde ocorreu <em>cerca de 70%</em> do volume' },
      { t0: 5.9, t1: 8.4, text: '<em>VAH</em> é o topo do valor. <em>VAL</em> é o fundo.' },
      { t0: 8.5, t1: 10.9, text: '<em>POC</em>: o preço com <em>mais volume</em>' },
      { t0: 11.0, t1: 13.8, text: 'O GL Model marca isso no <em>dia</em>, na <em>semana</em> e no <em>mês</em>' }],
    end: { t0: 13.9, tag: 'Valor do dia, da semana e do mês no mesmo mapa.' }, stills: [1.5, 4.5, 6.6, 7.8, 9.7, 11.9, 13.2] }
];

// Respostas a objeções (vendas e remarketing) -----------------------------
const P4W = { cx: 353, cy: 445, z: 1.53 }; // print 4 inteiro na largura
const objecoes = [
  { id: 'objecao-plataforma', ...V, dur: 14.4,
    scenes: [
      { t0: 0, t1: 5.8, img: '5.png',
        cam: [{ t: 0, cx: 520, cy: 420, z: 1.15 }, { t: 2.8, cx: 560, cy: 380, z: 1.3 }, { t: 5.6, cx: 820, cy: 140, z: 2.2 }],
        boxes: [{ rect: [832, 86, 105, 30], t0: 3.3, t1: 5.7, label: 'GL Model · TradingView', below: true, dx: -150 }] },
      { t0: 5.8, t1: 11.4, img: '3.png', last: true,
        cam: [{ t: 5.8, cx: 420, cy: 300, z: 1.25 }, { t: 8.3, cx: 430, cy: 320, z: 1.25 }, { t: 9.5, cx: 1380, cy: 640, z: 1.9 }],
        boxes: [{ rect: [8, 36, 365, 16], t0: 6.2, t1: 8.2, label: 'GL Academy no NinjaTrader', below: true, dx: 200 },
          { rect: [1414, 645, 100, 80], t0: 9.6, t1: 11.3, label: 'Mesmo mapa de valor', below: true, dx: -80 }] }],
    captions: [
      { t0: 0.2, t1: 2.8, kick: 'Dúvida comum', text: '“Funciona na <em>minha</em> plataforma?”' },
      { t0: 2.9, t1: 5.7, text: 'No <em>TradingView</em>: contexto, alvos e VWAPs' },
      { t0: 5.9, t1: 8.4, text: 'No <em>NinjaTrader</em>: o mesmo mapa' },
      { t0: 8.5, t1: 11.3, text: 'Os planos NinjaTrader já <em>incluem o TradingView</em>' }],
    end: { t0: 11.4, tag: 'TradingView e NinjaTrader. Tire suas dúvidas na call.' }, stills: [1.5, 4.6, 7.2, 10.4] },
  { id: 'objecao-mais-um-indicador', ...V, dur: 18,
    scenes: [
      { t0: 0, t1: 3.0, img: '4.png', cam: [{ t: 0, ...P4W }, { t: 3.0, cx: 353, cy: 420, z: 1.6 }] },
      { t0: 3.0, t1: 5.6, img: '5.png', cam: [{ t: 3.0, cx: 700, cy: 200, z: 1.6 }, { t: 5.6, cx: 840, cy: 120, z: 2.3 }],
        boxes: [{ rect: [832, 86, 105, 30], t0: 3.6, t1: 5.5, label: 'Contexto D/W/M', below: true, dx: -120 }] },
      { t0: 5.6, t1: 8.0, img: '4.png', cam: [{ t: 5.6, cx: 245, cy: 330, z: 2.2 }, { t: 8.0, cx: 245, cy: 300, z: 2.3 }],
        boxes: [{ rect: [8, 231, 206, 18], t0: 5.9, t1: 6.9, label: 'VAH W · VAH D', below: true }, { rect: [115, 359, 98, 18], t0: 6.9, t1: 7.9, label: 'VAH Q', below: true }] },
      { t0: 8.0, t1: 10.4, img: '4.png', cam: [{ t: 8.0, cx: 270, cy: 130, z: 2.2 }, { t: 10.4, cx: 270, cy: 110, z: 2.3 }],
        boxes: [{ rect: [228, 24, 95, 176], t0: 8.2, t1: 10.3, label: 'Alvos D, W, M e 3M', below: true }] },
      { t0: 10.4, t1: 12.8, img: '4.png', cam: [{ t: 10.4, cx: 440, cy: 430, z: 1.9 }, { t: 12.8, cx: 440, cy: 470, z: 2.0 }],
        boxes: [{ rect: [487, 300, 114, 30], t0: 10.6, t1: 11.6, label: 'Zero Gamma', below: true, dx: -20 }, { rect: [487, 527, 114, 20], t0: 11.6, t1: 12.7, label: 'Call Wall', below: true, dx: -20 }] },
      { t0: 12.8, t1: 15.0, img: '4.png', last: true, cam: [{ t: 12.8, ...P4W }, { t: 15.0, cx: 353, cy: 445, z: 1.6 }] }],
    captions: [
      { t0: 0.2, t1: 2.9, kick: 'Dúvida comum', text: '“É só mais um <em>indicador</em>?”' },
      { t0: 3.1, t1: 5.5, kick: '1 · Contexto', text: 'O mercado está <em>a favor</em> ou contra?' },
      { t0: 5.7, t1: 7.9, kick: '2 · Valor', text: 'Onde está o <em>preço justo</em> do dia, semana e mês' },
      { t0: 8.1, t1: 10.3, kick: '3 · Alvos', text: '<em>Alvos</em> marcados antes do preço chegar' },
      { t0: 10.5, t1: 12.7, kick: '4 · GL Gamma, à parte', text: 'O <em>mapa das opções</em> no seu gráfico' },
      { t0: 12.9, t1: 14.9, text: 'Tudo no <em>mesmo gráfico</em>' }],
    end: { t0: 15.0, tag: 'Um mapa completo, não um sinal solto.', disc: 'Alvos são projeções do modelo, não promessa de resultado. GL Gamma: assinatura à parte. Trading envolve risco financeiro real.' },
    stills: [1.5, 4.6, 6.4, 9.3, 11.2, 13.9] },
  { id: 'objecao-opcoes', ...V, dur: 15,
    scenes: [
      { t0: 0, t1: 6.0, img: '4.png',
        cam: [{ t: 0, cx: 410, cy: 330, z: 1.7 }, { t: 3.0, cx: 420, cy: 420, z: 1.9 }, { t: 6.0, cx: 420, cy: 470, z: 1.9 }],
        boxes: [{ rect: [487, 300, 114, 30], t0: 3.2, t1: 4.5, label: 'Zero Gamma', below: true, dx: -20 }, { rect: [487, 527, 114, 20], t0: 4.5, t1: 5.9, label: 'Call Wall', below: true, dx: -20 }] },
      { t0: 6.0, t1: 9.0, img: '2.png',
        cam: [{ t: 6.0, cx: 560, cy: 300, z: 1.5 }, { t: 9.0, cx: 640, cy: 320, z: 1.8 }],
        hides: [{ rect: [645, 18, 100, 38], until: 999 }, { rect: [586, 334, 60, 60], until: 999 }],
        boxes: [{ rect: [781, 268, 82, 16], t0: 6.5, t1: 8.9, label: 'Zero Gamma no futuro', below: true, dx: -120 }] },
      { t0: 9.0, t1: 12.0, img: '4.png', last: true,
        cam: [{ t: 9.0, cx: 420, cy: 680, z: 1.9 }, { t: 12.0, cx: 420, cy: 700, z: 2.0 }],
        boxes: [{ rect: [487, 725, 114, 22], t0: 9.3, t1: 11.9, label: 'HVL · Gamma Flip', below: true, dx: -40 }] }],
    captions: [
      { t0: 0.2, t1: 2.9, kick: 'Dúvida comum', text: '“Preciso entender de <em>opções</em>?”' },
      { t0: 3.0, t1: 5.9, text: 'Não precisa operar opções: os níveis já vêm <em>no seu gráfico</em>' },
      { t0: 6.1, t1: 8.9, text: 'Você opera <em>futuros</em>, com o mapa das opções ao lado' },
      { t0: 9.1, t1: 11.9, text: '<em>HVL</em> e <em>Zero Gamma</em>: onde o regime de volatilidade vira' }],
    end: { t0: 12.0, brand: 'GL GAMMA', tag: 'O mapa das opções no seu gráfico.' }, stills: [1.5, 4.0, 7.5, 10.5] },
  { id: 'objecao-por-onde-comecar', ...V, dur: 13.4,
    scenes: [
      { t0: 0, t1: 3.4, img: '1.png', dim: .3, hides: [{ rect: [700, 0, 1116, 40], until: 999, color: '#0b0b0b' }],
        cam: [{ t: 0, cx: 1250, cy: 440, z: 1.0 }, { t: 3.4, cx: 1300, cy: 460, z: 1.1 }] },
      { t0: 3.4, t1: 7.0, img: '5.png', dim: .55, cam: [{ t: 3.4, cx: 500, cy: 420, z: 1.2 }, { t: 7.0, cx: 560, cy: 380, z: 1.35 }] },
      { t0: 7.0, t1: 10.4, img: '4.png', last: true, cam: [{ t: 7.0, cx: 300, cy: 300, z: 1.8 }, { t: 10.4, cx: 380, cy: 380, z: 1.7 }],
        boxes: [{ rect: [228, 24, 95, 176], t0: 7.3, t1: 8.8, label: 'Alvos', below: true }, { rect: [487, 300, 114, 30], t0: 8.8, t1: 10.3, label: 'Gamma', below: true, dx: -20 }] }],
    texts: [{ t0: 3.7, t1: 6.9, top: 1020, html: '<div class="pill">30 MIN · 1 A 1 · GRATUITA</div>' }],
    captions: [
      { t0: 0.2, t1: 3.3, kick: 'Dúvida comum', text: '“Não sei <em>por onde começar</em>”' },
      { t0: 3.5, t1: 6.9, text: 'Comece pela <em>call 1x1 gratuita</em>' },
      { t0: 7.1, t1: 10.3, text: 'Conte seu momento no mercado. A equipe GL mostra o <em>próximo passo</em>.' }],
    end: { t0: 10.4, brand: 'GL ACADEMY', tag: 'Comece pela call 1x1 gratuita.' }, stills: [1.5, 5, 8.2, 9.6] }
];

module.exports = [...logos, ...aulas, ...objecoes];
