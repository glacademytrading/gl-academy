// Carrosséis (4:5) e stories (9:16) da série "Operacional na prática" e as peças de conversão (dúvidas e call 1x1).
// Os slides dos episódios saem das aulas da Mentoria GL (specs-mentoria.js): o mesmo print e o mesmo estado do gráfico
// no fim de cada passo (até onde o preço apareceu, as marcações e o que fica escondido), com os mesmos textos.
// Por episódio: um carrossel e um par de stories, a enquete (a pergunta no ponto de decisão, no dia do episódio) e a
// resposta (no dia seguinte). As respostas seguem os roteiros das aulas, que o Giovane valida.
// Render: SPECS=./specs-posts.js node posts.js [grupo ...]; o posts.js enquadra o gráfico entre os textos.
const { RAW } = require('./specs-mentoria.js');
const SOCIAL = require('./specs-social.js');

const GREEN = '#4fe3a8';
const K = 0.8;   // zoom inicial em relação à aula 16:9; o posts.js reduz quando as marcações não cabem
const AVISO = 'Exemplo educacional em replay, não é recomendação de investimento. Trading envolve risco financeiro real.';
const GAMMA = 'GL Gamma: assinatura à parte.';
const EMB = px => `<img src="emblem.png" style="width:${px}px;height:${px}px">`;
const semTag = s => s.replace(/<[^>]+>/g, '');
const ponto = s => (/[.?!]$/.test(s) ? s : s + '.');
const porId = Object.fromEntries(RAW.map(o => [o.id.slice(0, 3), o]));
const EPS = SOCIAL.filter(s => /^op\d\d-/.test(s.id)).map(s => ({ vid: s.id, ...s.meta }));
const F = { w: 1080, h: 1350 }, SV = { w: 1080, h: 1920 };

// As perguntas dos stories (enquete) e as respostas (dia seguinte), na linguagem das aulas.
// q: a pergunta na imagem (sem q, a da pausa da aula); opcoes: o que digitar na figurinha de enquete;
// enquete / resposta: o passo da aula cujo gráfico aparece (sem eles, o ponto de decisão e o passo seguinte).
const HIST = {
  m01: { q: 'O painel diz <em>pausa local</em>. Você opera o meio?', opcoes: ['Opero o meio', 'Espero os extremos'], enquete: 3, resposta: 0,
    titulo: 'Espere <em>os extremos</em>', texto: 'Pausa local dentro da primeira banda é equilíbrio: o preço gira e o meio não paga. O estado define o tipo de trade.' },
  m02: { opcoes: ['Venderia', 'Esperaria'],
    titulo: 'Correção <em>contra</em> W/M: espere', texto: 'O modelo marcava correção contra o semanal e o mensal, calor 4%. Contra o contexto, ficar de fora também é decisão.' },
  m03: { opcoes: ['Vendendo o fundo', 'Comprando na volta'],
    titulo: 'Comprando <em>na volta</em> para a faixa', texto: 'Os alvos de baixa foram cumpridos e o preço voltou para dentro da faixa: região de compra. O gatilho veio com a força acima das VWAPs D e W.' },
  m04: { opcoes: ['Comprar na base', 'Esperar o rompimento'],
    titulo: 'As duas, <em>com stops diferentes</em>', texto: 'Na base, com puts, VAL D e cluster juntos: stop abaixo de 7.752. No rompimento do VAH W: stop se o preço voltar abaixo dele.' },
  m05: { q: 'Expansão de alta acelerada. <em>Vender contra?</em>', opcoes: ['Vender contra', 'Realizar nos alvos'], enquete: 0, resposta: 1,
    titulo: 'Não venda contra: <em>realize nos alvos</em>', texto: 'Na expansão confirmada, realize em partes nos alvos D, W e M e mire o alvo de volume, com o stop protegendo o lucro.' },
  m06: { opcoes: ['Vender', 'Comprar'],
    titulo: 'Vender, <em>com gatilho</em>', texto: 'Abaixo do POC W, o viés é de baixa. O repique na zona é a região de venda e o gatilho é a perda do POC M.' },
  m07: { opcoes: ['Comprar', 'Vender'],
    titulo: 'Vender <em>na rejeição</em> do VAH D', texto: 'O topo travou no VAH D. O gatilho é o fechamento abaixo do Zero Gamma, onde o movimento tende a acelerar.' },
  m08: { opcoes: ['Comprar o rompimento', 'Vender o teto'],
    titulo: 'Vender <em>o teto de calls</em>', texto: 'Calls fortes acima funcionam como teto. O gatilho é a perda do cluster de 7.716 e o alvo é o maior nível de puts.' },
  m09: { opcoes: ['Comprar', 'Vender', 'Nenhum dos dois'],
    titulo: 'Nenhum: <em>espere o extremo</em>', texto: 'O meio da banda não paga. Com o macro comprador, a compra fica no extremo de baixo, com reação na faixa de volume.' },
  m10: { opcoes: ['Comprar mais', 'Realizar'],
    titulo: '<em>Realizar</em> no alvo de liquidez', texto: 'Acima, calls fracas. Abaixo, a maior barra de puts do mapa. A perda do Zero Gamma levou o preço de volta à confluência das puts.' },
  m11: { opcoes: ['Comprar', 'Vender'],
    titulo: 'Comprar <em>a defesa</em> do nível', texto: 'O nível de puts em 7.759,50 segurou o teste com pavio. Stop abaixo de 7.757 e alvo no VAH D, em 7.776.' },
  m12: { opcoes: ['No recuo', 'Só acima do VAH M'],
    titulo: 'No recuo, <em>com o gatilho</em>', texto: 'O recuo parou dentro do valor mensal, sem perder a estrutura: região de compra. O gatilho foi o rompimento do VAH M, o primeiro degrau.' },
  m13: { opcoes: ['Vender', 'Comprar'],
    titulo: 'Vender o repique <em>na região</em>', texto: 'Topos cada vez mais baixos são estado de baixa. O repique parou abaixo do topo anterior, na região de atuação; o gatilho é a perda da base do repique.' },
  m14: { opcoes: ['Vender', 'Comprar'],
    titulo: 'Vender o repique <em>na banda</em>', texto: 'Com as bandas apontando para baixo, o repique é região de venda. O gatilho é a perda da linha branca pontilhada.' },
  m15: { opcoes: ['Comprar já', 'Esperar'],
    titulo: 'Esperar o <em>fundo mais alto</em>', texto: 'O recuo segurou a região de 7.656: o primeiro fundo mais alto. O gatilho foi o rompimento da lateral de 7.672.' },
  m16: { opcoes: ['Comprar na caixa', 'Esperar o gatilho'],
    titulo: 'Na caixa, <em>com o gatilho</em>', texto: 'A caixa tinha piso embaixo: Zero Gamma e puts. O gatilho foi o rompimento com força dos VAH; o stop, voltar para dentro da caixa.' },
  m17: { opcoes: ['Compraria', 'Não dá para saber'], resposta: 3,
    titulo: 'Ligado, o estado <em>responde</em>', texto: 'Às 06:30 as velas ficam amarelas e rompem o topo da caixa, com os pontos brancos embaixo: estado de alta, a favor da compra.' },
  m18: { opcoes: ['Comprar', 'Vender'],
    titulo: 'Vender: o Zero Gamma <em>virou teto</em>', texto: 'O que era piso de manhã virou teto. O gatilho é o fechamento de novo abaixo dele; os alvos, o MAJOR- e as barras negativas.' },
  m19: { opcoes: ['Comprar', 'Vender', 'Depende do nível'],
    titulo: 'Depende <em>do nível</em> que aceitar', texto: 'Aceitou acima do VAH M: alvo VAH W 7.767. Perdeu o VAL W: alvos Zero Gamma e VAL M. No meio, só nos extremos.' }
};

// ---------------------------------------------------------------------------------------------------------------
// O estado do gráfico no fim de cada passo da aula: imagem, até onde o preço apareceu, o que já foi mostrado,
// a câmera e as marcações que estão na tela no fim do passo.
function estados(o) {
  const out = []; let atual = null, ultimoCam = null;
  for (const p of o.passos) {
    const img = p.img || (atual ? atual.img : o.img);
    if (!atual || atual.img !== img) {
      const cfg = o.imgs[img] || {};
      atual = { img, cfg, x: cfg.reveal ? cfg.reveal.x0 : null, mostrados: new Set(), cam: null };
    }
    const cam = p.cam || atual.cam || ultimoCam; atual.cam = cam; ultimoCam = cam;
    if (p.revela != null && atual.cfg.reveal) atual.x = p.revela;
    (p.mostra || []).forEach(i => atual.mostrados.add(i));
    const fim = p.d - 0.1;
    let boxes = (p.boxes || []).filter(b => (b.ate == null || b.ate >= fim) && (b.at == null || b.at < p.d));
    if (!boxes.length && p.boxes && p.boxes.length) boxes = [p.boxes[p.boxes.length - 1]];
    out.push({ p, img, cfg: atual.cfg, x: atual.x, mostrados: new Set(atual.mostrados), cam,
      boxes: boxes.map(b => ({ below: true, ...b })), spots: p.spots || [] });
  }
  return out;
}

// o que sempre fica escondido nos posts, além do que cada aula já esconde: a barra do TradingView no print 1
// e o rótulo interno do NinjaTrader no print 3
const SEMPRE = { '1.png': [{ rect: [0, 0, 1816, 40], color: '#0b0b0b' }], '3.png': [{ rect: [8, 36, 372, 14], color: '#060606' }],
  '16.png': [{ rect: [0, 0, 1871, 76], color: '#000000' }], '17.png': [{ rect: [0, 0, 1816, 45], color: '#000000' }], '18.png': [{ rect: [0, 0, 1823, 45], color: '#000000' }] };

// a cena de uma imagem parada: o gráfico como estava no fim do passo (inteiro, com revela: false).
// Sem marcações e com holofote, a câmera chega perto do que está iluminado (o painel fica legível).
// Rótulos de nível que ainda estão embaixo da revelação (ex.: POC W no eixo da direita) aparecem por um furo na máscara.
function cena(e, { boxes = e.boxes, spots = e.spots, dim = 0, enquadrar = true, revela = true, cam = e.cam } = {}) {
  let [cx, cy, z] = cam; z *= K;
  if (spots.length && !boxes.length) {
    const x0 = Math.min(...spots.map(r => r[0])), y0 = Math.min(...spots.map(r => r[1]));
    const x1 = Math.max(...spots.map(r => r[0] + r[2])), y1 = Math.max(...spots.map(r => r[1] + r[3]));
    cx = (x0 + x1) / 2; cy = (y0 + y1) / 2; z = Math.min(3.2, 0.86 * 1080 / (x1 - x0), 460 / (y1 - y0));
  }
  const s = { t0: 0, t1: 9, last: true, img: e.img, dim, enquadrar,
    cam: [{ t: 0, cx, cy, z: +z.toFixed(3) }],
    boxes: boxes.map(b => ({ ...b, t0: 0, t1: 99 })), spots: spots.map(r => ({ rect: r, t0: 0, t1: 99, pad: 12 })),
    hides: [...(e.cfg.hides || []).map((h, i) => ({ ...h, until: e.mostrados.has(i) ? -1 : 999 })), ...(SEMPRE[e.img] || []).map(h => ({ ...h, until: 999 }))] };
  if (e.cfg.reveal && revela) {
    const r = e.cfg.reveal;
    const furos = boxes.map(b => b.rect).filter(([x, y, w, h]) => w <= 140 && x >= e.x && x + w <= r.x1 + (r.pad || 0) && y >= r.y0 && y + h <= r.y1);
    s.reveal = { ...r, keys: [{ t: 0, x: e.x }], ...(furos.length ? { furos } : {}) };
  }
  return s;
}
// o enquadramento mais aberto da aula na mesma imagem (capa do carrossel)
const camAberta = (E, img) => E.filter(e => e.img === img).map(e => e.cam).reduce((a, b) => (b[2] < a[2] ? b : a));

// cena livre (peças de conversão): print, foco [x, y, z], marcações e o que esconder
const livre = (img, [x, y, z], boxes = [], o = {}) => ({ t0: 0, t1: 9, last: true, img, dim: o.dim || 0, enquadrar: o.enquadrar !== false,
  cam: [{ t: 0, cx: x, cy: y, z }], boxes: boxes.map(b => ({ below: true, t0: 0, t1: 99, ...b })), spots: [],
  hides: [...(o.hides || []), ...(SEMPRE[img] || [])].map(h => ({ until: 999, ...h })) });

// ---------------------------------------------------------------------------------------------------------------
// Peças do carrossel 4:5: gráfico em cima, painel do passo embaixo, rodapé com @ e o número do slide
const rodape = (n, total) => ({ t0: -1, t1: 99, top: 1286, rise: 0, style: 'left:60px;right:60px;padding:0;text-align:left',
  html: `<div style="display:flex;justify-content:space-between;font:700 26px/1 Inter,sans-serif;letter-spacing:.08em;color:rgba(255,255,255,.72)"><span>@glacademytrading</span><span><b style="color:#d8ae55">${n}</b> / ${total}${n < total ? ' &nbsp;→' : ''}</span></div>` });
const painel = (html, max) => ({ t0: -1, t1: 99, top: 0, rise: 0, style: 'left:40px;right:40px;top:auto;bottom:100px;padding:0',
  html: `<div class="cp" data-lim="baixo" data-fit="${max}">${html}</div>` });
const fimHtml = (titulo, corpo, disc) => `${EMB(210)}<div class="head2" style="font-size:86px;margin-top:22px">${titulo}</div><div class="body2" style="font-size:40px">${corpo}</div>` +
  `<div class="pill">CALL 1X1 GRATUITA · LINK NA BIO</div><div class="disc">${disc}</div>`;

// itens: [{ cena, html, max } | { fim: { cena, titulo, corpo, disc } }] -> specs numerados
function montarCarrossel(group, itens) {
  const total = itens.length;
  return itens.map((it, k) => {
    const n = k + 1, id = `${group}-${String(n).padStart(2, '0')}`;
    if (it.fim) {
      return { id, group, folder: 'posts', ...F, dur: 3, at: 2, hideWm: true, noGrad: true, replay: false, scenes: [{ ...it.fim.cena, enquadrar: false, dim: .84, boxes: [], spots: [] }],
        texts: [{ t0: -1, t1: 99, top: 236, rise: 0, html: fimHtml(it.fim.titulo, it.fim.corpo, it.fim.disc) }, rodape(n, total)] };
    }
    return { id, group, folder: 'posts', ...F, dur: 3, at: 2, hideWm: true, noGrad: true, areaTop: 104,
      shade: 'linear-gradient(180deg, rgba(5,5,5,0) 0%, rgba(5,5,5,0) 91.5%, #050505 93%, #050505 100%)',
      scenes: [it.cena], texts: [painel(it.html, it.max || 560), rodape(n, total)] };
  });
}

function carrosselEpisodio(ep) {
  const o = porId[ep.mentoria.slice(0, 3)], E = estados(o), g = 'car-' + ep.vid.slice(0, 4);
  const iP = o.passos.findIndex(p => p.tag === 'Pause o vídeo');
  const head = `<div class="h">Operacional na prática · Ep. ${ep.ep}</div>`;
  const eCapa = E[iP > 0 ? iP : 0];
  const itens = [{ cena: cena(eCapa, { boxes: [], spots: [], cam: camAberta(E, eCapa.img) }), max: 640,
    html: `${head}<div class="hook">${ep.gancho}</div><div class="sub">${ponto(ep.objetivo)}</div><div class="swipe">Arraste para ver o passo a passo →</div>` }];
  E.forEach(e => {
    const p = e.p, pausa = p.tag === 'Pause o vídeo';
    const corpo = pausa ? `<div class="b">${p.texto} Comente antes de arrastar.</div>`
      : (p.texto ? `<div class="b">${p.texto}</div>` : '') + (p.lista ? `<ul>${p.lista.map(x => `<li>${x}</li>`).join('')}</ul>` : '');
    itens.push({ cena: cena(e, pausa ? { boxes: [], spots: [] } : {}), max: p.lista ? 760 : 580,
      html: `${head}<div class="st ${pausa ? 'ask' : p.cls || ''}">${pausa ? 'Responda nos comentários' : p.tag}</div><div class="t">${p.titulo}</div>${corpo}` });
  });
  itens.push({ fim: { cena: cena(eCapa, { enquadrar: false, revela: false, boxes: [], spots: [], cam: camAberta(E, eCapa.img) }), titulo: 'Salve para estudar', corpo: 'O episódio em vídeo está no perfil. Comente qual seria a sua entrada.',
    disc: AVISO + (ep.gamma ? ' ' + GAMMA : '') } });
  return { group: g, specs: montarCarrossel(g, itens) };
}

// ---------------------------------------------------------------------------------------------------------------
// Stories 9:16: texto em cima, gráfico no meio, figurinha e aviso embaixo; tudo entre 270 e 1540 px
// (fora da barra de perfil e da caixa de mensagem do Instagram)
const topo = (kick, titulo, max = 360) => ({ t0: -1, t1: 99, top: 270, rise: 0, style: 'left:70px;right:70px;padding:0',
  html: `<div class="sqw" data-lim="cima" data-fit="${max}"><div class="kick2">${kick}</div><div class="sq">${titulo}</div></div>` });
const base = (html, max = 460) => ({ t0: -1, t1: 99, top: 0, rise: 0, style: 'left:70px;right:70px;top:auto;bottom:380px;padding:0',
  html: `<div class="sbx" data-lim="baixo" data-fit="${max}">${html}</div>` });
const story = (id, group, scene, texts) => ({ id, group, folder: 'posts', ...SV, dur: 3, at: 2, hideWm: true, noGrad: true, replay: false, recorte: !scene.dim,
  dust: scene.dim ? { n: 70, period: 16, alpha: .6 } : undefined, scenes: [scene], texts });

function storiesEpisodio(ep) {
  const k = ep.mentoria.slice(0, 3), o = porId[k], E = estados(o), h = HIST[k];
  const iP = o.passos.findIndex(p => p.tag === 'Pause o vídeo');
  const eQ = h.enquete != null ? E[h.enquete] : E[iP];
  const ant = h.enquete != null ? E[h.enquete] : E[iP - 1];
  const eR = E[h.resposta != null ? h.resposta : iP + 1];
  const q = h.q || o.passos[iP].titulo;
  const g = ep.gamma ? ' · ' + GAMMA : '';
  const enquete = story(`st-${ep.vid.slice(0, 4)}-enquete`, 'st-serie', cena(eQ, { boxes: ant.boxes, spots: ant.spots }), [
    topo(`Operacional na prática · Ep. ${ep.ep}`, q),
    base(`<div class="dash" style="height:190px">ENQUETE</div><div class="note">A resposta sai amanhã, às 12h · Replay, exemplo educacional${g}</div>`)
  ]);
  const resposta = story(`st-${ep.vid.slice(0, 4)}-resposta`, 'st-serie', cena(eR), [
    topo(`A resposta · Ep. ${ep.ep}`, h.titulo, 300),
    base(`<div class="sb">${h.texto}</div><div class="dash" style="height:110px">LINK DO EPISÓDIO</div><div class="note">Replay · exemplo educacional. Trading envolve risco${g}</div>`)
  ]);
  return { enquete, resposta, dados: { q: semTag(q), opcoes: h.opcoes, titulo: semTag(h.titulo), texto: h.texto } };
}

// ---------------------------------------------------------------------------------------------------------------
// Lançamento da série (stories), dúvidas antes da call (carrossel e stories) e como funciona a call (carrossel)
const e02 = estados(porId.m02);
// fundo dos stories de lançamento: o gráfico inteiro da primeira aula da série
const fundo = (dim = .62) => ({ ...cena(e02[3], { boxes: [], spots: [], enquadrar: !dim, revela: false }), cam: [{ t: 0, cx: 1180, cy: 430, z: 0.75 }], dim });
const lancamento = [
  story('st-serie-amanha', 'st-extras', fundo(0), [
    topo('Série nova', 'Operacional <em>na prática</em>', 330),
    base('<div class="sb"><b>Amanhã, 19h: episódio 1.</b> Um por dia útil no Reels e no Shorts: o gráfico para no ponto de decisão e você responde antes de ver a resposta.</div>' +
      '<div class="dash" style="height:150px">LEMBRETE</div><div class="note">Replay · exemplo educacional</div>')]),
  story('st-serie-hoje', 'st-extras', fundo(0), [
    topo('Hoje, 19h', 'Episódio novo <em>da série</em>', 330),
    base('<div class="sb"><b>Operacional na prática</b>, no Reels e no Shorts. Ative o lembrete e responda a pergunta do episódio nos comentários.</div>' +
      '<div class="dash" style="height:150px">LEMBRETE</div><div class="note">Replay · exemplo educacional</div>')])
];

const DUVIDAS = [
  { q: 'Funciona na <em>minha</em> plataforma?', curta: 'Funciona na minha plataforma?',
    r: 'Funciona no <b>TradingView</b> e no <b>NinjaTrader</b>, com o mesmo mapa nas duas. Os planos NinjaTrader já incluem o TradingView.',
    cena: livre('3.png', [1420, 640, 1.5], [{ rect: [1414, 645, 100, 80], label: 'Valor do dia no NinjaTrader', dx: -90 }]) },
  { q: 'É só mais um <em>indicador</em>?', curta: 'É só mais um indicador?',
    r: 'É um mapa: o contexto (a favor ou contra), o valor do dia, da semana e do mês e os alvos marcados antes do preço chegar. Alvos são projeções, não promessa.',
    cena: livre('4.png', [270, 130, 1.8], [{ rect: [228, 24, 95, 176], label: 'Alvos D, W, M e 3M' }]) },
  { q: 'Preciso entender de <em>opções</em>?', curta: 'Preciso entender de opções?',
    r: 'Não precisa operar opções. O GL Gamma, uma assinatura à parte, traz os níveis das opções para o seu gráfico de futuros.',
    cena: livre('4.png', [470, 330, 1.9], [{ rect: [487, 300, 114, 30], label: 'Zero Gamma', dx: -20 }]) },
  { q: 'Não sei <em>por onde começar</em>', curta: 'Não sei por onde começar',
    r: 'Comece pela call 1x1 gratuita: conte o seu momento no mercado e a equipe GL mostra o próximo passo.',
    cena: livre('5.png', [490, 411, 1.05], [], { dim: .35, enquadrar: false }) }
];
const AVISO_CONV = 'Conteúdo educacional. Trading envolve risco financeiro real. Alvos são projeções, não promessa de resultado. GL Gamma: assinatura à parte.';
const carDuvidas = montarCarrossel('car-duvidas', [
  { cena: livre('5.png', [490, 411, 1.05], [], { dim: .25, enquadrar: false }), max: 640,
    html: '<div class="h">Antes da call 1x1</div><div class="hook">4 dúvidas que a gente <em>mais ouve</em></div><div class="sub">Respostas curtas, com o gráfico real.</div><div class="swipe">Arraste →</div>' },
  ...DUVIDAS.map((d, i) => ({ cena: d.cena, max: 580,
    html: `<div class="h">Antes da call 1x1</div><div class="st">Dúvida ${i + 1}</div><div class="t">“${d.q}”</div><div class="b">${d.r}</div>` })),
  { fim: { cena: livre('5.png', [490, 411, 1.05], []), titulo: 'Ficou outra dúvida?', corpo: 'Pergunte nos comentários ou na call.', disc: AVISO_CONV } }
]);
const stDuvidas = DUVIDAS.map((d, i) => story(`st-duvida-${i + 1}`, 'st-duvidas', { ...d.cena, dim: 0, enquadrar: true }, [
  topo('Dúvida comum', `“${d.q}”`, 330),
  base(`<div class="sb">${d.r}</div><div class="dash" style="height:110px">LINK DA CALL</div><div class="note">${i === 2 ? 'GL Gamma: assinatura à parte. ' : ''}Trading envolve risco financeiro real.</div>`)
]));

const carCall = montarCarrossel('car-call', [
  { cena: livre('5.png', [490, 411, 1.05], [], { dim: .25, enquadrar: false }), max: 640,
    html: '<div class="h">Call 1x1 gratuita</div><div class="hook">Como funciona <em>a call</em></div><div class="sub">O que acontece depois que você agenda.</div><div class="swipe">Arraste →</div>' },
  { cena: livre('5.png', [600, 300, 1.3], [], { dim: .5, enquadrar: false }), max: 580,
    html: '<div class="h">Call 1x1 gratuita</div><div class="st">1 · Você agenda</div><div class="t">Pelo <em>link da bio</em></div><div class="b">A confirmação chega no WhatsApp, com o horário de Brasília e o link da reunião.</div>' },
  { cena: livre('3.png', [1100, 450, 0.9], [], { dim: .5, enquadrar: false }), max: 580,
    html: '<div class="h">Call 1x1 gratuita</div><div class="st">2 · A conversa</div><div class="t">Um a um, <em>sobre o seu momento</em></div><div class="b">Uma conversa com a equipe GL: o que você opera, como opera hoje e qual é o seu maior desafio no mercado.</div>' },
  { cena: livre('5.png', [744, 170, 1.9], [{ rect: [828, 84, 113, 30], color: GREEN, label: 'Contexto D/W/M', dx: -60 }]), max: 580,
    html: '<div class="h">Call 1x1 gratuita</div><div class="st">3 · O mapa</div><div class="t">O GL Model <em>no seu ativo</em></div><div class="b">Você vê o mapa no gráfico que você opera: o contexto, o valor do dia, da semana e do mês e os alvos.</div>' },
  { cena: livre('4.png', [353, 445, 1.2], [], { dim: .5, enquadrar: false }), max: 580,
    html: '<div class="h">Call 1x1 gratuita</div><div class="st">4 · O próximo passo</div><div class="t">A equipe indica <em>o caminho</em></div><div class="b">Com base no seu momento, a equipe mostra o que faz sentido para você. A decisão é sua.</div>' },
  { cena: livre('1.png', [1270, 430, 1.1], [], { dim: .55, enquadrar: false }), max: 760,
    html: '<div class="h">Call 1x1 gratuita</div><div class="st green">Para aproveitar melhor</div><div class="t">Antes da call</div><ul><li>Esteja num lugar tranquilo</li><li>Pense no seu maior desafio no mercado</li><li>Se puder, use o computador</li></ul>' },
  { fim: { cena: livre('5.png', [490, 411, 1.05], []), titulo: 'Agende a sua', corpo: 'É gratuita e é um a um.', disc: 'Conteúdo educacional. Trading envolve risco financeiro real.' } }
]);

// GL Risk Auto (prints 22, 25 e 26): o plano medido em R, o trade acima do teto barrado e o que cabe liberado.
// Escondidos: as setas do Giovane no print 26, o alvo em dólar, saldo e P/L e a barra do Windows (print 25).
const P26 = [{ rect: [858, 452, 95, 55], color: '#000000' }, { rect: [862, 580, 105, 65], color: '#000000' },
  { rect: [878, 888, 118, 66], color: '#000000' }, { rect: [378, 1300, 95, 62], color: '#000000' }, { rect: [784, 943, 72, 22] }];
const P25 = [{ rect: [4, 216, 126, 32], color: '#0b0b0b' }, { rect: [58, 162, 72, 9], color: '#0b0b0b' }, { rect: [0, 574, 1034, 27], color: '#0b0b0b' }];
const RED = '#ff6b6b';
const AVISO_RISK = 'Risco estimado no stop; custos e slippage não incluídos. Conteúdo educacional: trading envolve risco financeiro real.';
const hR = '<div class="h">GL Risk Auto</div>';
const carRisk = montarCarrossel('car-risk', [
  { cena: livre('26.png', [560, 760, 0.9], [], { hides: P26, dim: .2, enquadrar: false }), max: 640,
    html: `${hR}<div class="hook">O trade que <em>não cabe</em> no seu teto não passa</div><div class="sub">O GL Risk Auto mede o risco antes do clique.</div><div class="swipe">Arraste →</div>` },
  { cena: livre('26.png', [690, 730, 1.05], [{ rect: [583, 643, 262, 16], label: 'Entrada' }, { rect: [583, 507, 268, 20], color: RED, label: 'Stop', below: false }, { rect: [583, 940, 160, 26], color: GREEN, label: 'Alvo em 2,26R' }], { hides: P26 }), max: 580,
    html: `${hR}<div class="st">1 · O plano</div><div class="t">Entrada, stop e alvo <em>em R</em></div><div class="b">Você desenha o plano e o painel mede na hora: aqui, uma venda com alvo em 2,26R.</div>` },
  { cena: livre('26.png', [176, 1398, 2.6], [{ rect: [3, 1413, 346, 20], color: RED, label: 'Acima do teto: bloqueado' }], { hides: P26 }), max: 580,
    html: `${hR}<div class="st red">2 · O teto</div><div class="t">Acima do teto, <em>o trade não passa</em></div><div class="b">Risco de US$387,50 com teto de US$285,71 na conta: o GL Risk Auto barra a entrada antes da ordem.</div>` },
  { cena: livre('25.png', [70, 130, 3.2], [{ rect: [8, 33, 118, 24], color: GREEN, label: 'Plano pronto' }], { hides: P25 }), max: 580,
    html: `${hR}<div class="st green">3 · Dentro da gestão</div><div class="t">Coube no teto: <em>plano pronto</em></div><div class="b">Com o risco dentro do limite, o painel mostra quantos contratos cabem e o START confirma.</div>` },
  { cena: livre('22.png', [160, 300, 3.0], [{ rect: [20, 286, 282, 30], label: 'A compra · Y vende' }]), max: 580,
    html: `${hR}<div class="st">4 · Pelo controle</div><div class="t">A compra, Y vende, <em>START confirma</em></div><div class="b">Stop e alvo sobem e descem um tick nos gatilhos. Sem planilha e sem conta de cabeça.</div>` },
  { fim: { cena: livre('26.png', [560, 760, 0.9], [], { hides: P26 }), titulo: 'Gestão antes do clique', corpo: 'Quer ver o GL Risk Auto na sua conta?', disc: AVISO_RISK } }
]);
const stRisk = [story('st-risk', 'st-extras', livre('26.png', [176, 1398, 2.6], [{ rect: [3, 1413, 346, 20], color: RED, label: 'Bloqueado' }], { hides: P26 }), [
  topo('GL Risk Auto', 'Você sabe quanto arrisca <em>antes</em> de clicar?', 330),
  base('<div class="sb">Acima do teto da conta, o GL Risk Auto barra o trade antes da ordem.</div><div class="dash" style="height:110px">LINK DA CALL</div><div class="note">Risco estimado no stop; custos e slippage não incluídos.</div>')])];

// ---------------------------------------------------------------------------------------------------------------
const CARROSSEIS = EPS.map(carrosselEpisodio), STORIES = EPS.map(storiesEpisodio);
module.exports = [
  ...CARROSSEIS.flatMap(c => c.specs),
  ...STORIES.flatMap(s => [s.enquete, s.resposta]),
  ...lancamento, ...carDuvidas, ...stDuvidas, ...carCall, ...carRisk, ...stRisk
];
// o que o kit_posts.py precisa: slides de cada carrossel, a enquete e a resposta de cada episódio e as peças extras
module.exports.META = {
  episodios: EPS.map((ep, i) => ({ vid: ep.vid, ep: ep.ep, mentoria: ep.mentoria, carrossel: CARROSSEIS[i].group,
    slides: CARROSSEIS[i].specs.map(s => s.id), enquete: STORIES[i].enquete.id, resposta: STORIES[i].resposta.id, stories: STORIES[i].dados })),
  duvidas: DUVIDAS.map((d, i) => ({ id: `st-duvida-${i + 1}`, pergunta: d.curta, resposta: semTag(d.r) })),
  extras: { lancamento: lancamento.map(s => s.id), duvidas: carDuvidas.map(s => s.id), call: carCall.map(s => s.id), risk: carRisk.map(s => s.id), stRisk: stRisk.map(s => s.id) }
};
