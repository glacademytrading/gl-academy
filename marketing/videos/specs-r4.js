// Rodada 4 (0 crédito): sequência da call, comunidade, parceiros, kit de live 2.0,
// YouTube e kit do site. Coordenadas em pixels de cada print original.
const V = { w: 1080, h: 1920, ay: 1120 };
const L = { w: 1920, h: 1080, ay: 540 };
const Q = { w: 1080, h: 1080, ay: 540 };
const GREEN = '#4fe3a8';
const TOOLBAR1 = { rect: [0, 0, 1816, 40], until: 999, color: '#0b0b0b' };
const EMB = px => `<img src="emblem.png" style="width:${px}px;height:${px}px">`;
const DISC = 'Conteúdo educacional. Trading envolve risco financeiro real.';
const LEFT = 'left:60px;right:auto;text-align:left;padding:0';

// Fundo de prints escurecidos passando devagar; loop=true emenda o fim no começo
const CAMS = {
  V: { '5.png': [{ cx: 400, cy: 411, z: 2.35 }, { cx: 580, cy: 411, z: 2.45 }], '4.png': [{ cx: 300, cy: 444, z: 2.16 }, { cx: 400, cy: 444, z: 2.26 }],
    '3.png': [{ cx: 1100, cy: 444, z: 2.16 }, { cx: 1300, cy: 444, z: 2.26 }], '1.png': [{ cx: 1250, cy: 436, z: 2.2 }, { cx: 1450, cy: 436, z: 2.3 }] },
  L: { '5.png': [{ cx: 490, cy: 420, z: 2.0 }, { cx: 490, cy: 380, z: 2.15 }], '4.png': [{ cx: 353, cy: 460, z: 2.75 }, { cx: 353, cy: 380, z: 2.9 }],
    '3.png': [{ cx: 836, cy: 444, z: 1.25 }, { cx: 900, cy: 470, z: 1.35 }], '1.png': [{ cx: 908, cy: 436, z: 1.25 }, { cx: 960, cy: 450, z: 1.35 }] }
};
function fundo(fmt, dur, imgs, dim = .7, loop = false) {
  const seg = dur / imgs.length, C = CAMS[fmt], ay = fmt === 'V' ? 960 : undefined;
  const mk = (img, t0, t1, cam) => ({ t0, t1, img, dim, ay, cam, hides: img === '1.png' ? [TOOLBAR1] : [] });
  const sc = imgs.map((img, i) => mk(img, i * seg, (i + 1) * seg + .4, [{ t: i * seg, ...C[img][0] }, { t: (i + 1) * seg + .4, ...C[img][1] }]));
  if (loop) sc.push({ ...mk(imgs[0], dur - .6, dur + 1, [{ t: 0, ...C[imgs[0]][0] }]), last: true });
  else sc[sc.length - 1].last = true;
  return sc;
}
const topoEmblema = { t0: .2, t1: 99, top: 230, rise: 0, html: EMB(210) };

// Vendas: sequência da call no WhatsApp ----------------------------------
function textoV(id, dur, texts, stills) {
  return { id, ...V, dur, replay: false, hideWm: true, dust: { n: 90, period: 16, alpha: .8 },
    scenes: fundo('V', dur + .5, ['5.png', '4.png', '3.png']), texts: [topoEmblema, ...texts], stills };
}
const STEPS = items => `<div class="steps2">${items.map((t, i) => `<div class="it"><b>${i + 1}</b><span>${t}</span></div>`).join('')}</div>`;
const vendas = [
  textoV('call-confirmada', 17.4, [
    { t0: .6, t1: 5.6, top: 690, html: '<div class="kick2">GL ACADEMY</div><div class="head2">SUA CALL ESTÁ CONFIRMADA</div>' },
    { t0: 5.8, t1: 10.4, top: 730, html: '<div class="body2">Como vai ser</div><div class="pill">1 A 1 · GRATUITA</div><div class="body2" style="font-size:40px">Uma conversa com a equipe GL sobre o seu momento no mercado</div>' },
    { t0: 10.6, t1: 15.0, top: 630, html: '<div class="body2">Para aproveitar melhor</div>' + STEPS(['Esteja num lugar tranquilo', 'Pense no seu maior desafio no mercado', 'Se puder, use o computador']) },
    { t0: 15.2, t1: 99, top: 830, html: '<div class="head2" style="font-size:80px">Precisa remarcar?</div><div class="body2">Responda esta mensagem.</div>' }
  ], [3, 8, 13, 16.6]),
  textoV('call-lembrete', 9.2, [
    { t0: .5, t1: 5.0, top: 730, html: '<div class="kick2">LEMBRETE</div><div class="head2">SUA CALL COMEÇA EM 1 HORA</div>' },
    { t0: 5.2, t1: 99, top: 770, html: '<div class="body2">Separe um tempo sem interrupções.</div><div class="body2" style="color:#f6d991">No horário marcado, a equipe GL chama você.</div>' }
  ], [3, 8]),
  textoV('call-remarcar', 11.2, [
    { t0: .5, t1: 4.4, top: 730, html: '<div class="head2" style="font-size:88px">NÃO CONSEGUIMOS FALAR COM VOCÊ</div>' },
    { t0: 4.6, t1: 99, top: 750, html: '<div class="body2">Acontece. Sem problema.</div><div class="pill">ESCOLHA UM NOVO HORÁRIO</div><div class="body2" style="font-size:40px">Responda esta mensagem e a gente remarca.</div>' }
  ], [2.5, 9])
];

// Comunidade e parceiros -------------------------------------------------
const comunidade = [
  textoV('comunidade-boas-vindas', 16.4, [
    { t0: .5, t1: 4.6, top: 730, html: '<div class="kick2">COMUNIDADE GL</div><div class="head2" style="font-size:124px">BEM-VINDO</div><div class="body2">Que bom ter você aqui.</div>' },
    { t0: 4.8, t1: 10.6, top: 690, html: '<div class="body2">Por aqui você acompanha</div>' + STEPS(['Lives com o mercado ao vivo', 'Setups em replay', 'Aulas rápidas']) },
    { t0: 10.8, t1: 14.0, top: 810, html: '<div class="head2" style="font-size:80px">Ative as notificações</div><div class="body2">para não perder as lives</div>' },
    { t0: 14.2, t1: 99, top: 750, html: `<div class="body2">Quer ir além?</div><div class="pill">CALL 1X1 GRATUITA</div><div class="disc">${DISC}</div>` }
  ], [3, 8, 12.5, 15.8])
];
// Cartela de parceiro: troque o @ e gere uma por parceiro (o link do parceiro já leva o ?ref=)
function parceiro(id, arroba) {
  return textoV(id, 6.5, [
    { t0: .3, t1: 99, top: 520, html: `<div class="kick2">PUBLICIDADE</div><div class="body2">Parceiro oficial</div><div class="word" style="font-size:96px">GL ACADEMY</div><div class="code">${arroba}</div><div class="body2">Agende sua call 1x1 gratuita pelo meu link</div><div class="pill">LINK NA BIO</div><div class="disc">${DISC}</div>` }
  ], [3]);
}
const parceiros = [parceiro('parceiro-exemplo', '@seuperfil')];

// Kit de live 2.0: sobreposições transparentes para o OBS -----------------
const alpha = { ...L, alpha: true, replay: false, hideWm: true, scenes: [] };
const live2 = [
  { id: 'live-faixa-nome', ...alpha, dur: 8, stills: [2],
    texts: [{ t0: .3, t1: 7.4, top: 820, in: .7, rise: 0, dx: -90, style: 'left:80px;right:auto;text-align:left;padding:0',
      html: `<div class="lt"><i></i>${EMB(92)}<div><b>Giovane Lázaro</b><span>GL ACADEMY · ANÁLISE AO VIVO</span></div></div>` }] },
  { id: 'live-faixa-call', ...alpha, dur: 10, stills: [2],
    texts: [{ t0: .3, t1: 9.6, top: 900, in: .6, rise: 40, html: `<div class="ctabar">${EMB(64)}<div style="text-align:left">AGENDE SUA CALL 1X1 GRATUITA<br><small>LINK NA DESCRIÇÃO</small></div></div>` }] },
  // selo em loop de 4 s: o ponto pulsa com período de 2 s
  { id: 'live-selo-ao-vivo', ...alpha, dur: 4, stills: [0, 1],
    texts: [{ t0: -1, t1: 99, top: 60, rise: 0, style: 'left:70px;right:auto;text-align:left;padding:0', html: '<div class="badge-live"><i class="pulse" data-period="2"></i>AO VIVO</div>' }] },
  // transição (stinger): a tela fica coberta entre 0,62 s e 0,86 s; no OBS, ponto de transição em 700 ms
  { id: 'live-transicao', ...alpha, dur: 1.5, stills: [.3, .72, 1.1],
    tweens: [
      { html: '<div class="wipe"></div>', style: 'top:-110px', keys: [{ t: 0, x: -2700 }, { t: .62, x: -340 }, { t: .86, x: -340 }, { t: 1.45, x: 2000 }] },
      { html: EMB(520), style: 'left:700px;top:280px', keys: [{ t: .45, s: .6, o: 0 }, { t: .66, s: 1, o: 1 }, { t: .84, s: 1.04, o: 1 }, { t: 1.0, s: 1.1, o: 0 }] }] }
];

// Contagem regressiva de 5 min para antes da live --------------------------
const cdImgs = []; for (let i = 0; i < 20; i++) cdImgs.push(['5.png', '4.png', '3.png', '1.png'][i % 4]);
const contagem = { id: 'live-contagem-5min', ...L, dur: 302, fps: 24, crf: 28, replay: false, dust: { n: 140, period: 20, alpha: .9 },
  scenes: fundo('L', 302, cdImgs, .55),
  texts: [
    { t0: -1, t1: 299.7, top: 210, rise: 0, html: '<div class="badge-live" style="background:rgba(10,9,6,.78);border:1px solid rgba(216,174,85,.55);color:#f6d991"><i class="pulse" data-period="2" style="background:#e3705f"></i>MERCADO AO VIVO COM A GL</div><div class="small" style="margin-top:40px">A LIVE COMEÇA EM</div><div class="cdnum"><span class="cd" data-from="300"></span></div><div class="small">ENQUANTO ISSO, AGENDE SUA CALL 1X1 GRATUITA · LINK NA DESCRIÇÃO</div>' },
    { t0: 299.8, t1: 303, top: 380, html: '<div class="live"><i></i>AO VIVO</div><div class="big">COMEÇANDO AGORA</div>' }],
  stills: [0.5, 61, 299.2, 301] };

// YouTube: tela final (20 s) e trailer do canal --------------------------
const youtube = [
  { id: 'youtube-tela-final', ...L, dur: 20, replay: false, hideWm: true, dust: { n: 120, period: 20, alpha: .8 },
    scenes: fundo('L', 20.5, ['5.png', '3.png'], .74),
    texts: [
      { t0: .3, t1: 99, top: 92, html: '<div class="kick2">CONTINUE ASSISTINDO</div>' },
      { t0: .5, t1: 99, top: 170, rise: 20, html: '<div class="ytrow"><div class="ytbox">VÍDEO 1</div><div class="ytbox">VÍDEO 2</div></div>' },
      { t0: .7, t1: 99, top: 640, html: `<div class="ytcirc">${EMB(190)}</div><div class="kick2" style="margin-top:22px">INSCREVA-SE</div>` }],
    stills: [2, 19] },
  { id: 'youtube-trailer', ...L, dur: 33, hideWm: true, replayFrom: 4.3, replayUntil: 27.4, dust: { n: 100, period: 16, alpha: .7 },
    scenes: [
      { t0: 0, t1: 4.3, particles: { size: 560, cy: 420, t0: .1, t1: 1.9, step: 3, streak: .034, swirl: 1.5, alpha: .8, add: true, glow: true, rays: true, shine: [2.0, 2.75] } },
      { t0: 4.3, t1: 10.2, img: '5.png', cam: [{ t: 4.3, cx: 470, cy: 470, z: 2.0 }, { t: 10.2, cx: 540, cy: 300, z: 2.2 }],
        reveal: { x0: 250, x1: 790, y0: 40, y1: 800, t0: 4.6, t1: 9.2, pad: 6 },
        hides: [{ rect: [826, 82, 116, 40], until: 9.4 }, { rect: [780, 78, 24, 24], until: 9.4 }] },
      { t0: 10.2, t1: 16.1, img: '1.png', hides: [TOOLBAR1], cam: [{ t: 10.2, cx: 1200, cy: 340, z: 1.6 }, { t: 16.1, cx: 1310, cy: 585, z: 1.9 }],
        boxes: [{ rect: [1628, 721, 108, 30], t0: 14.0, t1: 16.0, color: '#ff6b6b', label: 'Correção contra W/M', below: true, dx: -80 }] },
      { t0: 16.1, t1: 22, img: '1.png', hides: [TOOLBAR1], cam: [{ t: 16.1, cx: 600, cy: 420, z: 1.6 }, { t: 22, cx: 480, cy: 380, z: 2.0 }],
        spots: [{ rect: [225, 380, 305, 100], t0: 17.4, t1: 21.8 }] },
      { t0: 22, t1: 27.5, img: '4.png', cam: [{ t: 22, cx: 353, cy: 330, z: 2.75 }, { t: 27.5, cx: 375, cy: 560, z: 2.9 }],
        boxes: [{ rect: [487, 300, 114, 30], t0: 22.6, t1: 24.6, label: 'Zero Gamma', below: true, dx: -20 }, { rect: [487, 527, 114, 20], t0: 25.2, t1: 27.3, label: 'Call Wall', below: true, dx: -20 }] },
      { t0: 27.5, t1: 34, last: true, img: '5.png', dim: .84, cam: [{ t: 27.5, cx: 490, cy: 420, z: 2.0 }, { t: 34, cx: 490, cy: 380, z: 2.1 }] }],
    texts: [
      { t0: 2.05, t1: 4.1, top: 760, in: .75, rise: 18, track: [.45, .16], html: '<div class="word trk">GL ACADEMY</div>' },
      { t0: 27.8, t1: 99, top: 250, html: `${EMB(230)}<div class="head2" style="font-size:88px;margin-top:20px">INSCREVA-SE</div><div class="body2">Lives, setups em replay e aulas rápidas</div><div class="pill">ATIVE O SININHO</div><div class="disc">${DISC} GL Gamma: assinatura à parte.</div>` }],
    captions: [
      { t0: 4.5, t1: 10.0, kick: 'Lives', text: 'O mercado <em>ao vivo</em>, com o operacional GL na tela' },
      { t0: 10.4, t1: 15.9, kick: 'Setups em replay', text: 'Do <em>contexto</em> à entrada, passo a passo' },
      { t0: 16.3, t1: 21.8, kick: 'Aulas rápidas', text: '<em>VWAP</em>, Value Area e Gamma no gráfico real' },
      { t0: 22.2, t1: 27.3, kick: 'GL Gamma', text: '<em>Gamma Exposure</em> dentro do seu gráfico' }],
    stills: [1.2, 3.2, 7.5, 15, 19.5, 24, 30] }
];

// Kit do site ------------------------------------------------------------
// Loops sem corte: a câmera volta ao ponto de partida (A → B → A) e a poeira tem período igual à duração
const chip = (txt, top = 56, style = LEFT) => ({ t0: -1, t1: 99, top, rise: 0, style, html: `<div class="chiptag">${EMB(36)}${txt}</div>` });
const loop8 = (A, B) => [{ t: 0, ...A }, { t: 4, ...B }, { t: 8, ...A }];
const site = [
  // círculos da página Escolha (recorte redondo no site): emblema vivo e gráfico vivo
  { id: 'site-circulo-pacote', ...Q, dur: 8, replay: false, hideWm: true, dust: { n: 70, period: 8, alpha: .8 },
    scenes: [{ t0: 0, t1: 9, last: true, particles: { size: 860, t0: -2, t1: -1, step: 6, glow: true, rays: true, raysSpeed: 3, glowPeriod: 4, shine: [3.0, 4.3] } }],
    sparks: [{ t: 5.2, x: 534, y: 540 - 860 * (0.5 - 159 / 800) + 6, s: 200, d: .9 }], stills: [0, 3.6, 5.6, 7.95] },
  { id: 'site-circulo-tecnologias', ...Q, dur: 8, replay: false, hideWm: true, dust: { n: 50, period: 8, alpha: .6 },
    scenes: [{ t0: 0, t1: 9, last: true, img: '5.png', cam: loop8({ cx: 600, cy: 380, z: 1.6 }, { cx: 680, cy: 300, z: 1.9 }) }], stills: [0, 4, 7.95] },
  // cards de plataforma e galeria "Veja os sistemas em uso"
  { id: 'site-loop-tradingview', ...L, dur: 8, hideWm: true, dust: { n: 60, period: 8, alpha: .6 },
    scenes: [{ t0: 0, t1: 9, last: true, img: '5.png', cam: loop8({ cx: 500, cy: 420, z: 2.0 }, { cx: 540, cy: 245, z: 2.2 }),
      boxes: [{ rect: [832, 86, 105, 30], t0: 2.6, t1: 5.4, color: GREEN, label: 'Alta alinhada D/W/M', below: true, dx: -60 }] }],
    texts: [chip('TradingView')], stills: [0, 4, 7.95] },
  { id: 'site-loop-ninjatrader', ...L, dur: 8, hideWm: true, dust: { n: 60, period: 8, alpha: .6 },
    scenes: [{ t0: 0, t1: 9, last: true, img: '3.png', cam: loop8({ cx: 1000, cy: 500, z: 1.5 }, { cx: 1190, cy: 620, z: 2.0 }),
      boxes: [{ rect: [1414, 645, 100, 80], t0: 2.6, t1: 5.4, label: 'Valor do dia', below: true, dx: -40 }] }],
    texts: [chip('NinjaTrader')], stills: [0, 4, 7.95] },
  // print 4 é estreito: fica centralizado sobre o fundo escuro, como as imagens da galeria do site
  { id: 'site-loop-gamma', ...L, dur: 8, hideWm: true, dust: { n: 60, period: 8, alpha: .6 },
    scenes: [{ t0: 0, t1: 9, last: true, img: '4.png', cam: loop8({ cx: 420, cy: 430, z: 1.25 }, { cx: 470, cy: 500, z: 1.55 }),
      boxes: [{ rect: [487, 300, 114, 30], t0: 1.2, t1: 3.4, label: 'Zero Gamma', below: true, dx: -20 }, { rect: [487, 527, 114, 20], t0: 4.2, t1: 6.6, label: 'Call Wall', below: true, dx: -20 }] }],
    texts: [chip('GL Gamma · assinatura à parte')], stills: [0, 2.3, 5.4, 7.95] },
  { id: 'site-loop-alvos', ...L, dur: 8, hideWm: true, dust: { n: 60, period: 8, alpha: .6 },
    scenes: [{ t0: 0, t1: 9, last: true, img: '4.png', cam: loop8({ cx: 300, cy: 400, z: 1.25 }, { cx: 280, cy: 230, z: 1.6 }),
      boxes: [{ rect: [228, 24, 95, 176], t0: 2.4, t1: 5.6, label: 'Alvos D, W, M e 3M', below: true }] }],
    texts: [chip('Alvos no gráfico')], stills: [0, 4, 7.95] },
  // explicação do Gamma em 16:9: gráfico à direita, legendas à esquerda
  { id: 'site-gamma-explicacao-16x9', ...L, dur: 13.5, hideWm: true,
    shade: 'linear-gradient(90deg, rgba(5,5,5,.97) 0%, rgba(5,5,5,.94) 40%, rgba(5,5,5,0) 50%)',
    capBox: { left: '90px', width: '760px', top: '330px' },
    scenes: [{ t0: 0, t1: 11.2, img: '4.png', last: true,
      cam: [{ t: 0, cx: 50, cy: 445, z: 1.45 }, { t: 1.8, cx: 301, cy: 320, z: 2.6 }, { t: 4.1, cx: 301, cy: 537, z: 2.6 }, { t: 6.5, cx: 301, cy: 700, z: 2.6 }, { t: 9.0, cx: 107, cy: 460, z: 1.5 }],
      boxes: [
        { rect: [487, 300, 114, 30], t0: 2.0, t1: 4.0, label: 'Zero Gamma', below: true, dx: -20 },
        { rect: [487, 527, 114, 20], t0: 4.3, t1: 6.4, label: 'Call Wall', below: true, dx: -20 },
        { rect: [487, 725, 114, 22], t0: 6.7, t1: 8.9, label: 'HVL · Gamma Flip', below: true, dx: -40 },
        { rect: [487, 388, 114, 440], t0: 9.2, t1: 11.1, label: 'Níveis GL', dx: -30 }] }],
    captions: [
      { t0: 0.2, t1: 1.9, kick: 'GL Gamma', text: 'O mapa das <em>opções</em> dentro do seu gráfico' },
      { t0: 2.0, t1: 4.1, text: '<em>Zero Gamma</em>: onde o regime de volatilidade vira' },
      { t0: 4.3, t1: 6.5, text: '<em>Call Wall</em>: a parede que costuma segurar o preço' },
      { t0: 6.7, t1: 9.0, text: '<em>HVL e Gamma Flip</em>: níveis de virada da volatilidade' },
      { t0: 9.2, t1: 11.1, text: 'Tudo isso lido junto com o <em>operacional GL</em>' }],
    end: { t0: 11.2, brand: 'GL GAMMA', tag: 'Assinatura independente, contratada à parte.', cta: 'Conheça os planos do GL Gamma', sub: '' },
    stills: [1, 3, 5.4, 7.8, 10, 12.5] },
  // visão geral do Pacote Completo (Operacional Completo + APP; Gamma e mentoria à parte)
  { id: 'site-pacote-completo-16x9', ...L, dur: 23, hideWm: true, replayFrom: 0, replayUntil: 10.6,
    scenes: [
      { t0: 0, t1: 5.6, img: '5.png', cam: [{ t: 0, cx: 470, cy: 470, z: 2.0 }, { t: 5.6, cx: 540, cy: 300, z: 2.2 }],
        reveal: { x0: 250, x1: 790, y0: 40, y1: 800, t0: .3, t1: 4.6, pad: 6 }, hides: [{ rect: [826, 82, 116, 40], until: 4.8 }, { rect: [780, 78, 24, 24], until: 4.8 }] },
      { t0: 5.6, t1: 10.6, img: '3.png', cam: [{ t: 5.6, cx: 836, cy: 360, z: 1.25 }, { t: 10.6, cx: 1190, cy: 560, z: 2.0 }],
        boxes: [{ rect: [1414, 645, 100, 80], t0: 8.8, t1: 10.5, label: 'Mesmo mapa', below: true, dx: -40 }] },
      { t0: 10.6, t1: 15.6, img: '1.png', dim: .82, hides: [TOOLBAR1], cam: [{ t: 10.6, cx: 908, cy: 436, z: 1.25 }, { t: 15.6, cx: 960, cy: 450, z: 1.35 }] },
      { t0: 15.6, t1: 20, img: '4.png', cam: [{ t: 15.6, cx: 420, cy: 430, z: 1.25 }, { t: 20, cx: 470, cy: 500, z: 1.5 }],
        boxes: [{ rect: [487, 300, 114, 30], t0: 16.4, t1: 19.8, label: 'GL Gamma', below: true, dx: -20 }] }],
    texts: [{ t0: 10.9, t1: 15.4, top: 300, html: '<div class="kick2">02 · FORMAÇÃO</div><div class="head2" style="font-size:84px">APP GL MODEL ACADEMY</div><div class="body2">Uma trilha guiada para estudar, praticar e revisar no seu ritmo</div>' }],
    captions: [
      { t0: .2, t1: 5.5, kick: 'Pacote Completo', text: 'A leitura, as ferramentas e o <em>caminho para aplicar</em>' },
      { t0: 5.8, t1: 10.4, kick: '01 · Operacional Completo', text: 'Estrutura e Estado de Mercado no <em>TradingView</em> e no <em>NinjaTrader</em>' },
      { t0: 15.8, t1: 19.9, kick: 'À parte', text: '<em>GL Gamma</em> e a mentoria 1:1 são contratados separadamente' }],
    end: { t0: 20, brand: 'PACOTE COMPLETO', tag: 'Formação e ferramentas conectadas.', cta: 'Agende uma conversa gratuita', sub: '', disc: 'GL Gamma: assinatura à parte. Trading envolve risco financeiro real. Conteúdo educacional; não é recomendação de investimento.' },
    stills: [2.5, 8, 13, 18, 21.5] }
];

module.exports = [...vendas, ...comunidade, ...parceiros, ...live2, contagem, ...youtube, ...site];
module.exports.parceiro = parceiro;
