// Imagens estáticas (0 crédito) com os 5 prints: posts, frases, stories, destaques,
// thumbnails do YouTube, galeria do site e imagens de compartilhamento (Open Graph).
// Coordenadas em pixels de cada print original.
const GREEN = '#4fe3a8', RED = '#ff6b6b';
const TOOLBAR1 = { rect: [0, 0, 1816, 40], until: 999, color: '#0b0b0b' };
const ARROWS2 = [{ rect: [645, 18, 100, 38], until: 999 }, { rect: [586, 334, 60, 60], until: 999 }];
const LABEL5 = [{ rect: [826, 82, 116, 40], until: -1 }]; // rótulo do print 5 sempre visível (até = -1 não esconde)
const DISC = 'Conteúdo educacional. Trading envolve risco financeiro real.';
const EMB = px => `<img src="emblem.png" style="width:${px}px;height:${px}px">`;
const STARS_BG = 'radial-gradient(ellipse at 50% 38%, #0e1020 0%, #05060c 62%, #030308 100%)';
const box = (rect, label, o = {}) => ({ rect, label, t0: 0, t1: 99, ...o });
const base = (id, group, w, h, o) => ({ id, group, folder: 'imagens', w, h, dur: 3, at: 2, replay: false, hideWm: true, ...o });
const T = (top, html, style) => ({ t0: -1, t1: 99, top, rise: 0, html, ...(style ? { style } : {}) });
const handle = (top, w) => T(top, `<div style="display:flex;justify-content:space-between;font:700 26px/1 Inter,sans-serif;letter-spacing:.08em;color:rgba(255,255,255,.72)"><span>@glacademytrading</span><span style="color:#d8ae55">GL ACADEMY</span></div>`, 'left:60px;right:60px;padding:0;text-align:left');

// A. Posts 4:5 com gráfico anotado ------------------------------------------
const SHADE45 = 'linear-gradient(180deg, #050505 0%, #050505 29%, rgba(5,5,5,0) 37%, rgba(5,5,5,0) 72%, #050505 81%, #050505 100%)';
function post(id, { kick, title, body, img, cam, boxes = [], spots = [], hides = [], size = 72 }) {
  return base(id, 'posts-4x5', 1080, 1350, { shade: SHADE45,
    scenes: [{ t0: 0, t1: 9, last: true, img, ay: 720, cam: [{ t: 0, ...cam }], boxes, spots: spots.map(r => ({ rect: r, t0: 0, t1: 99 })), hides }],
    texts: [T(84, `<div class="kick2">${kick}</div><div class="head2" style="font-size:${size}px;margin-top:22px">${title}</div>`), T(1080, `<div class="body2" style="font-size:38px">${body}</div>`), handle(1278)] });
}
const posts = [
  post('post-alta-alinhada', { kick: 'CONTEXTO', title: 'Quando dia, semana e mês concordam', body: 'O GL Model mostra o contexto antes da entrada. Replay · exemplo educacional.',
    img: '5.png', cam: { cx: 744, cy: 170, z: 2.3 }, boxes: [box([830, 86, 110, 32], 'Alta alinhada D/W/M', { color: GREEN, below: true, dx: -60 })] }),
  post('post-correcao-contra', { kick: 'CONTEXTO', title: 'Nem toda queda é venda', size: 84, body: 'O modelo classificou o movimento: correção contra a semana e o mês. Replay · exemplo educacional.',
    img: '1.png', hides: [TOOLBAR1], cam: { cx: 1570, cy: 650, z: 2.2 }, boxes: [box([1628, 721, 108, 30], 'Correção contra W/M', { color: RED, dx: -60 })] }),
  post('post-defesa-vwap-3m', { kick: 'VWAP', title: 'A VWAP 3M segurou o preço', size: 80, body: 'Correção até a VWAP do trimestre e retomada. Replay · exemplo educacional.',
    img: '1.png', hides: [TOOLBAR1], cam: { cx: 480, cy: 360, z: 2.3 }, boxes: [box([490, 376, 28, 28], 'Defesa na VWAP 3M', { color: GREEN, below: true, dx: -40 })] }),
  post('post-alvo-antes-do-preco', { kick: 'ALVOS', title: 'O alvo aparece antes do preço chegar', body: 'Alvos D, W, M e 3M marcados no gráfico. São projeções do modelo, não promessa de resultado.',
    img: '4.png', cam: { cx: 272, cy: 112, z: 2.2 }, boxes: [box([228, 24, 95, 176])] }),
  post('post-escada-de-valor', { kick: 'ESCADA DE VALOR', title: 'Degrau por degrau', size: 84, body: 'Valor do mês, do trimestre e da semana marcados no gráfico. Replay · exemplo educacional.',
    img: '4.png', cam: { cx: 353, cy: 390, z: 1.4 }, boxes: [box([8, 231, 206, 18], 'VAH W · VAH D', { below: true }), box([115, 359, 98, 18], 'VAH Q'), box([115, 549, 100, 18], 'VAH M')] }),
  post('post-zero-gamma', { kick: 'GL GAMMA', title: 'Onde o regime de volatilidade vira', body: 'Zero Gamma no gráfico de futuros. GL Gamma: assinatura à parte.',
    img: '4.png', cam: { cx: 470, cy: 330, z: 2.4 }, boxes: [box([487, 300, 114, 30], 'Zero Gamma', { below: true, dx: -20 })] }),
  post('post-valor-do-dia-ninjatrader', { kick: 'NINJATRADER', title: 'O valor do dia desenhado no gráfico', body: 'VAH, POC e VAL do dia pela Estrutura de Mercado, no NinjaTrader.',
    img: '3.png', cam: { cx: 1440, cy: 680, z: 2.4 }, boxes: [box([1448, 643, 32, 13], 'VAH D', { dx: -60 }), box([1448, 698, 32, 13], null, { color: GREEN }), box([1448, 716, 32, 13], 'VAL D', { below: true, dx: -60 })] }),
  post('post-nivel-respeitado', { kick: 'NÍVEL', title: 'O preço foi buscar o VAH D', size: 80, body: 'O nível estava marcado antes. Replay · exemplo educacional.',
    img: '2.png', hides: ARROWS2, cam: { cx: 560, cy: 60, z: 2.3 }, boxes: [box([548, 22, 70, 20], 'VAH D', { below: true, dx: -30 })] }),
  post('post-varredura-na-minima', { kick: 'SETUP', title: 'Varreu a mínima e voltou para o valor', body: 'O primeiro sinal do setup de alta. Replay · exemplo educacional.',
    img: '5.png', cam: { cx: 500, cy: 680, z: 2.2 }, boxes: [box([455, 690, 75, 75], 'Varredura na mínima', { color: RED })] }),
  // duas plataformas na mesma arte: TradingView em cima, NinjaTrader embaixo
  base('post-tradingview-e-ninjatrader', 'posts-4x5', 1080, 1350, {
    scenes: [
      { t0: 0, t1: 9, img: '5.png', ay: 535, clip: 'inset(28% 0 49% 0)', cam: [{ t: 0, cx: 500, cy: 400, z: 1.3 }] },
      { t0: 0, t1: 9, last: true, img: '3.png', ay: 845, clip: 'inset(51% 0 26% 0)', cam: [{ t: 0, cx: 1130, cy: 560, z: 1.0 }] }],
    texts: [T(84, '<div class="kick2">OPERACIONAL COMPLETO</div><div class="head2" style="font-size:72px;margin-top:22px">O mesmo mapa nas duas plataformas</div>'),
      T(396, '<div class="chiptag">TradingView</div>', 'left:40px;right:auto;text-align:left;padding:0'),
      T(706, '<div class="chiptag">NinjaTrader</div>', 'left:40px;right:auto;text-align:left;padding:0'),
      T(687, '<div style="height:3px;background:linear-gradient(90deg,transparent,#d8ae55 20%,#d8ae55 80%,transparent)"></div>', 'left:0;right:0;padding:0'),
      T(1080, '<div class="body2" style="font-size:38px">Estrutura de Mercado e Estado de Mercado no TradingView e no NinjaTrader.</div>'), handle(1278)] })
];

// B. Frases 1:1 -----------------------------------------------------------
const frase = (id, txt, img, cam) => base(id, 'frases-1x1', 1080, 1080, {
  scenes: [{ t0: 0, t1: 9, last: true, img, dim: .76, ay: 540, cam: [{ t: 0, ...cam }], hides: img === '1.png' ? [TOOLBAR1] : img === '2.png' ? ARROWS2 : [] }],
  texts: [T(120, EMB(150)), T(390, `<div class="head2" style="font-size:88px">${txt}</div>`), T(900, '<div class="kick2">GL ACADEMY</div>'), T(990, '<div style="font:700 26px/1 Inter,sans-serif;letter-spacing:.08em;color:rgba(255,255,255,.6)">@glacademytrading</div>')] });
const frases = [
  frase('frase-contexto-primeiro', 'Contexto primeiro. Entrada depois.', '5.png', { cx: 560, cy: 400, z: 1.6 }),
  frase('frase-tres-perguntas', 'Não respondeu as 3 perguntas? Espere.', '4.png', { cx: 353, cy: 445, z: 1.6 }),
  frase('frase-o-mercado-nao-deve', 'O mercado não te deve um trade.', '3.png', { cx: 1100, cy: 450, z: 1.3 }),
  frase('frase-risco-antes-do-clique', 'Risco definido antes do clique.', '1.png', { cx: 1300, cy: 436, z: 1.3 }),
  frase('frase-nem-toda-queda', 'Nem toda queda é venda.', '2.png', { cx: 465, cy: 317, z: 1.7 })
];

// C. Stories 9:16 ---------------------------------------------------------
const story = (id, texts, img = '5.png', cam = { cx: 490, cy: 411, z: 2.35 }, extra = {}) => base(id, 'stories-9x16', 1080, 1920, {
  dust: { n: 80, period: 16, alpha: .7 },
  scenes: [{ t0: 0, t1: 9, last: true, img, dim: extra.dim == null ? .72 : extra.dim, ay: 960, cam: [{ t: 0, ...cam }], hides: extra.hides || [], boxes: extra.boxes || [] }],
  texts: [T(200, EMB(190)), ...texts] });
const DASH = (h, txt) => `<div style="margin:40px auto 0;width:620px;height:${h}px;border:3px dashed rgba(246,217,145,.5);border-radius:28px;display:grid;place-items:center;font:700 28px/1 Montserrat,sans-serif;letter-spacing:.2em;color:rgba(246,217,145,.6)">${txt}</div>`;
const stories = [
  story('story-call', [T(560, '<div class="head2" style="font-size:92px">Quer ver o GL Model no seu gráfico?</div><div class="pill" style="margin-top:40px">CALL 1X1 GRATUITA</div>' + DASH(160, 'LINK AQUI'))]),
  story('story-live-hoje', [T(540, '<div class="live"><i></i>AO VIVO</div><div class="head2" style="font-size:128px;margin-top:30px">LIVE HOJE</div><div class="body2">Mercado ao vivo com a GL</div>' + DASH(220, 'LEMBRETE'))], '1.png', { cx: 1350, cy: 436, z: 2.2 }, { hides: [TOOLBAR1] }),
  story('story-enquete', [T(420, '<div class="kick2">E VOCÊ?</div><div class="head2" style="font-size:96px">Você venderia aqui?</div>'), T(1500, DASH(200, 'ENQUETE'))],
    '1.png', { cx: 1290, cy: 420, z: 2.0 }, { dim: .25, hides: [TOOLBAR1] }),
  story('story-enquete-resposta', [T(420, '<div class="kick2">A RESPOSTA</div><div class="head2" style="font-size:96px">O modelo dizia: espere.</div>'), T(1560, '<div class="body2">Correção contra W/M. Contexto primeiro.</div><div class="disc">Replay · exemplo educacional.</div>')],
    '1.png', { cx: 1500, cy: 600, z: 2.0 }, { dim: .25, hides: [TOOLBAR1], boxes: [box([1628, 721, 108, 30], 'Correção contra W/M', { color: RED, below: true, dx: -60 })] }),
  story('story-comunidade', [T(560, '<div class="kick2">GRATUITA</div><div class="head2" style="font-size:96px">Comunidade GL no WhatsApp</div><div class="body2">Lives, setups em replay e aulas rápidas</div>' + DASH(160, 'LINK AQUI'))], '3.png', { cx: 1250, cy: 444, z: 2.2 })
];

// D. Thumbnails do YouTube 1280x720 --------------------------------------
// gráfico à direita (foco em x≈935 da tela), texto grande à esquerda
const thumb = (id, title, img, focus, z, extra = {}) => base(id, 'youtube-thumbs', 1280, 720, {
  shade: 'linear-gradient(90deg, #050505 0%, #050505 40%, rgba(5,5,5,.2) 58%, rgba(5,5,5,0) 70%)',
  scenes: [{ t0: 0, t1: 9, last: true, img, ay: 360, cam: [{ t: 0, cx: focus[0] - (935 - 640) / z, cy: focus[1], z }], hides: extra.hides || [], boxes: extra.boxes || [] }],
  texts: [T(40, `<div style="display:flex;align-items:center;gap:14px">${EMB(64)}<span style="font:800 22px/1 Montserrat,sans-serif;letter-spacing:.18em;color:#d8ae55">GL ACADEMY</span></div>`, 'left:44px;right:auto;text-align:left;padding:0'),
    T(extra.live ? 210 : 170, `${extra.live ? '<div class="live" style="font-size:30px;padding:12px 22px"><i></i>AO VIVO</div>' : ''}<div class="head2" style="font-size:${extra.size || 92}px;text-align:left;margin-top:${extra.live ? 18 : 0}px">${title}</div>`, 'left:44px;right:auto;width:640px;text-align:left;padding:0')] });
const thumbs = [
  thumb('thumb-mercado-ao-vivo', 'MERCADO AO VIVO', '5.png', [700, 300], 1.6, { live: true, size: 96 }),
  thumb('thumb-o-que-e-vwap', 'O QUE É VWAP?', '1.png', [480, 330], 2.0, { hides: [TOOLBAR1], boxes: [box([490, 376, 28, 28], 'Defesa', { color: GREEN, below: true })] }),
  thumb('thumb-value-area', 'VAH, VAL E POC', '3.png', [1440, 680], 2.2, { boxes: [box([1414, 645, 100, 80], 'Valor do dia', { below: true, dx: -30 })] }),
  thumb('thumb-gamma-exposure', 'GAMMA NO GRÁFICO', '4.png', [500, 400], 1.9, { boxes: [box([487, 300, 114, 30], 'Zero Gamma', { below: true })] }),
  thumb('thumb-nem-toda-queda', 'NEM TODA QUEDA É VENDA', '1.png', [1560, 600], 1.7, { size: 80, hides: [TOOLBAR1], boxes: [box([1628, 721, 108, 30], 'Correção', { color: RED })] }),
  thumb('thumb-3-perguntas', '3 PERGUNTAS ANTES DO TRADE', '5.png', [814, 180], 2.2, { size: 76, boxes: [box([830, 86, 110, 32], 'Direção', { color: GREEN, below: true })] })
];

// E. Capas de destaques (Instagram mostra o círculo central) ---------------
const ICONS = {
  setups: '<path d="M30 20v16M30 64v16M70 30v12M70 70v12" /><rect x="22" y="36" width="16" height="28" rx="2"/><rect x="62" y="42" width="16" height="28" rx="2"/><path d="M50 14v12M50 74v12"/><rect x="42" y="26" width="16" height="48" rx="2"/>',
  aulas: '<path d="M10 38 50 20l40 18-40 18z"/><path d="M26 46v20c8 8 40 8 48 0V46"/><path d="M90 38v24"/>',
  lives: '<circle cx="50" cy="50" r="9"/><path d="M33 33a24 24 0 0 0 0 34M67 33a24 24 0 0 1 0 34M22 22a40 40 0 0 0 0 56M78 22a40 40 0 0 1 0 56"/>',
  call: '<rect x="16" y="22" width="68" height="62" rx="8"/><path d="M16 40h68M34 14v16M66 14v16"/><path d="m38 62 8 8 16-18"/>',
  gamma: '<path d="M30 20h44M38 20v62M28 82h20"/>',
  alunos: '<path d="m50 14 10 22 24 3-18 16 5 24-21-12-21 12 5-24-18-16 24-3z"/>',
  serie: '<rect x="12" y="20" width="76" height="56" rx="10"/><path d="M43 36v24l21-12z"/><path d="M30 86h40"/>',
  duvidas: '<path d="M22 20h56a10 10 0 0 1 10 10v30a10 10 0 0 1-10 10H48L30 84V70h-8a10 10 0 0 1-10-10V30a10 10 0 0 1 10-10z"/><path d="M41 38a9 9 0 1 1 13 8c-3 1.5-4 3.5-4 6v2"/><path d="M50 62v.5"/>'
};
const destaque = (id, key) => base(id, 'destaques', 1080, 1920, { bg: STARS_BG, stars: { n: 520 },
  scenes: [], texts: [T(660, `<div style="width:600px;height:600px;margin:0 auto;border-radius:50%;border:4px solid #d8ae55;box-shadow:0 0 60px rgba(216,174,85,.35), inset 0 0 60px rgba(216,174,85,.15);display:grid;place-items:center;background:radial-gradient(circle, #15110a 0%, #050505 70%)"><svg viewBox="0 0 100 100" width="300" height="300" fill="none" stroke="#f1d9a6" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round">${ICONS[key]}</svg></div>`)] });
const destaques = Object.keys(ICONS).map(k => destaque('destaque-' + k, k));

// F. Galeria do site 16:9 (sem título; o site já tem a legenda) -------------
const chip = (txt) => T(48, `<div class="chiptag">${EMB(36)}${txt}</div>`, 'left:48px;right:auto;text-align:left;padding:0');
const galeria = (id, txt, img, cam, boxes, hides = [], clip) => base(id, 'site-galeria', 1920, 1080, {
  scenes: [{ t0: 0, t1: 9, last: true, img, ay: 540, clip, cam: [{ t: 0, ...cam }], boxes, hides }], texts: [chip(txt)], replay: true, replayText: 'Replay · exemplo educacional', noGrad: true });
const galerias = [
  galeria('site-galeria-tradingview-contexto', 'TradingView', '5.png', { cx: 490, cy: 430, z: 1.31 },
    [box([22, 354, 362, 245], 'Zona de valor'), box([572, 262, 34, 245], 'Rompimento', { color: GREEN, dx: 70 }), box([830, 86, 110, 32], 'Alta alinhada D/W/M', { color: GREEN, below: true, dx: -40 })]),
  galeria('site-galeria-tradingview-vwap', 'TradingView', '1.png', { cx: 365, cy: 450, z: 1.45 },
    [box([552, 283, 40, 15], 'VWAP W'), box([552, 382, 40, 15], 'VWAP 3M', { below: true }), box([490, 376, 28, 28], null, { color: GREEN })], [TOOLBAR1], 'inset(0 431px 0 431px)'),
  galeria('site-galeria-tradingview-correcao', 'TradingView', '1.png', { cx: 1216, cy: 432, z: 1.6 },
    [box([980, 108, 170, 122], 'Acumulação', { below: true }), box([1218, 145, 36, 290], 'Perde a acumulação', { color: RED, dx: 120 }), box([1628, 721, 108, 30], 'Correção contra W/M', { color: RED, dx: -80 })], [TOOLBAR1], 'inset(0 0 0 182px)'),
  galeria('site-galeria-ninjatrader-estrutura', 'NinjaTrader · Estrutura de Mercado', '3.png', { cx: 836, cy: 470, z: 1.15 },
    [box([1414, 645, 100, 80], 'Valor do dia', { dx: -60 }), box([1448, 414, 32, 13], 'POC M', { dx: -40 })]),
  galeria('site-galeria-ninjatrader-nivel', 'NinjaTrader', '2.png', { cx: 465, cy: 330, z: 1.7 },
    [box([548, 22, 70, 20], 'VAH D', { below: true, dx: -40 }), box([540, 308, 100, 36], 'Nível', { color: GREEN, below: true })], ARROWS2),
  galeria('site-galeria-gl-gamma', 'GL Gamma · assinatura à parte', '4.png', { cx: 380, cy: 470, z: 1.2 },
    [box([487, 300, 114, 30], 'Zero Gamma', { dx: 150 }), box([487, 527, 114, 20], 'Call Wall', { dx: 140 }), box([487, 725, 114, 22], 'HVL · Gamma Flip', { below: true, dx: 150 })])
];

// G. Imagens de compartilhamento do site (Open Graph, 1200x630), no estilo serifado do site
const og = (id, title, it, body) => base(id, 'site-compartilhamento', 1200, 630, { bg: STARS_BG, stars: { n: 300 },
  scenes: [{ t0: 0, t1: 9, last: true, particles: { size: 400, cx: 270, cy: 315, t0: -2, t1: -1, step: 8, glow: true, rays: true } }],
  texts: [T(175, `<div class="s-kick">GL ACADEMY</div><div class="s-title" style="font-size:${title.length > 15 ? 52 : title.length > 9 ? 62 : 74}px;margin-top:22px">${title}</div><div class="s-it" style="margin-top:12px">${it}</div>${body ? `<div class="s-body" style="font-size:28px;margin-top:14px">${body}</div>` : ''}`, 'left:520px;right:60px;text-align:left;padding:0')] });
const ogs = [
  og('og-escolha', 'ESCOLHA DE ACORDO COM SUA NECESSIDADE', 'Mentorias, tecnologias ou o pacote completo.'),
  og('og-tecnologias', 'TECNOLOGIAS', 'para ler além do preço.', 'TradingView e NinjaTrader.'),
  og('og-mentorias', 'MENTORIAS', 'Aprenda, pratique e revise.', 'APP GL Model Academy e mentoria 1:1.'),
  og('og-pacote-completo', 'PACOTE COMPLETO', 'Formação e ferramentas conectadas.', 'Operacional Completo + APP GL Model Academy.'),
  og('og-gl-gamma', 'GL GAMMA', 'O mapa das opções no seu gráfico.', 'Assinatura independente.')
];

module.exports = [...posts, ...frases, ...stories, ...thumbs, ...destaques, ...galerias, ...ogs];
