// Imagens do GL Risk Auto: carrosséis 4:5, stories 9:16 (enquete e resposta), capas de Reels, thumbnails do YouTube,
// frases e a capa de destaque. Mesmo visual das peças da série (specs-posts.js); prints e o que fica escondido em
// risk-prints.js. Render: SPECS=./specs-risk-posts.js node posts.js [grupo ...] (sai em out/posts-risk/<grupo>/).
const { H } = require('./specs-posts.js');
const { HIDES, R, DISC, DISC2, DISC_MESA } = require('./risk-prints.js');
const { montarCarrossel, livre, story, topo, base, EMB } = H;

const GREEN = '#4fe3a8', RED = '#ff6b6b';
const P = (img, cam, boxes = [], o = {}) => livre(img, cam, boxes, { ...o, hides: [...(HIDES[img] || []), ...(o.hides || [])] });
const b = (rect, label, o = {}) => ({ rect, ...(label ? { label } : {}), ...o });
const pasta = specs => specs.map(s => ({ ...s, folder: 'posts-risk' }));
const slide = (h, st, t, corpo, cls = '') => `<div class="h">${h}</div><div class="st ${cls}">${st}</div><div class="t">${t}</div><div class="b">${corpo}</div>`;
const capaC = (h, hook, sub) => `<div class="h">${h}</div><div class="hook">${hook}</div><div class="sub">${sub}</div><div class="swipe">Arraste →</div>`;
const HR = 'GL Risk Auto';

// --------------------------------------------------------------------------------------------- carrosséis 4:5
const CARROSSEIS = {
  'car-ra-trade': { titulo: 'Um trade do começo ao fim', itens: [
    { cena: P('34.png', [531, 299, 1.0], [], { dim: .2, enquadrar: false }), max: 640,
      html: capaC(HR, 'Um trade do começo ao fim, <em>com o risco medido</em>', 'Contexto, região, fluxo, risco e saída: os 5 passos de uma venda no ES.') },
    { cena: P('27.png', [800, 450, 1.0], [b(R.p27Topos[0], '7.810', { color: RED, below: false }), b(R.p27Topos[1], '7.780', { color: RED, below: false }),
      b(R.p27Topos[2], '7.768', { color: RED }), b(R.p27Valor, 'Região de valor')]),
      html: slide(HR, '1 · Contexto', 'Topos mais baixos no <em>30 minutos</em>', 'Topos em 7.810, 7.780 e 7.768, e o preço de volta à região de valor do dia e da semana. O macro pede cuidado com compras.') },
    { cena: P('28.png', [700, 650, 1.6], [b(R.p28Vah, 'VAH D e bloco vermelho', { color: RED, below: false })]),
      html: slide(HR, '2 · Região', 'VAH D e <em>bloco vermelho</em>', 'No 5 minutos, o preço sobe até a VAH D, onde há um bloco vermelho: um topo de leilão marcado pela Estrutura de Mercado.') },
    { cena: P('28.png', [790, 630, 2.2], [b(R.p28Bolha, 'Compra na resistência')]),
      html: slide(HR, '3 · Fluxo', 'Comprados <em>na resistência</em>', 'As bolhas do Order Flow mostram compras agressivas bem na VAH D. Quem compra na resistência pode virar combustível da venda.') },
    { cena: P('28.png', [720, 680, 1.5]),
      html: slide(HR, 'Responda nos comentários', 'Você venderia aqui? <em>Onde fica o stop?</em>', 'Comente antes de arrastar.', 'ask') },
    { cena: P('29.png', [660, 660, 1.1], [b(R.p29Stop, 'Stop: US$250', { color: RED, below: false }), b(R.p29Entrada, 'Entrada'), b(R.p29Alvo, 'Alvo 5R', { color: GREEN })]),
      html: slide(HR, '4 · Risco medido', 'O risco <em>antes do clique</em>', 'Stop acima da VAH D: 5 pontos, US$250 em 1 contrato. O GL Risk Auto desenha a escada de 1R a 5R, e o alvo de 5R cai na VAL D.') },
    { cena: P('30.png', [120, 250, 2.6], [b(R.p30Risco, 'Dentro do teto', { color: GREEN })]),
      html: slide(HR, '4 · Risco autorizado', 'Cabe no teto: <em>entrada autorizada</em>', 'Risco vivo de US$250 para um teto de US$285,71. Stop e alvo vão para a plataforma junto com a entrada.', 'green') },
    { cena: P('33.png', [560, 500, 1.1], [b(R.p33Pos, '+19,25 pontos', { color: GREEN, below: false }), b(R.p33Lmt, 'Alvo 5R', { color: GREEN })]),
      html: slide(HR, 'Em posição', 'O preço vai até <em>perto da VAL D</em>', '+19,25 pontos, com o stop e o alvo na plataforma.') },
    { cena: P('31.png', [122, 140, 2.4], [b(R.p31Box, 'Sinal verde', { color: GREEN })]),
      html: slide(HR, '5 · Saída', 'O sinal verde: <em>avalie realizar</em>', '3,37R do risco orientado. O painel avisa; a decisão é sua.', 'green') },
    { fim: { cena: P('34.png', [531, 299, 1.0]), titulo: 'Salve para estudar', corpo: 'O trade completo em vídeo está no perfil.', disc: DISC2 } }
  ] },
  'car-ra-dores': { titulo: '6 problemas de risco', itens: [
    { cena: P('26.png', [560, 760, 0.9], [], { dim: .2, enquadrar: false }), max: 640,
      html: capaC(HR, '6 problemas de risco que <em>custam a conta</em>', 'E o que o GL Risk Auto faz com cada um.') },
    { cena: P('29.png', [660, 470, 1.6], [b(R.p29Stop, 'Stop: US$250', { color: RED, below: false })]),
      html: slide(HR, '1 · Não saber quanto perde', 'O risco <em>antes do clique</em>', 'O painel mostra o risco no stop, em dólar e em R, no próprio gráfico.') },
    { cena: P('26.png', [176, 1398, 2.6], [b(R.p26Teto, 'Bloqueado', { color: RED })]),
      html: slide(HR, '2 · Stop longe demais', 'Acima do teto, <em>não passa</em>', 'Risco de US$387,50 para um teto de US$285,71: o plano é barrado antes da ordem.', 'red') },
    { cena: P('25.png', [68, 175, 3.6], [b(R.p25Cabem, 'Cabe 1 contrato', { color: GREEN })]),
      html: slide(HR, '3 · Mão maior do que cabe', 'Quantos contratos <em>cabem no stop</em>', 'O painel calcula: aqui, "cabem 1 novos". O tamanho da mão vem do stop, não da vontade.') },
    { cena: P('32.png', [560, 1040, 0.7], [b(R.p32Stp, 'Stop', { color: RED, below: false }), b(R.p32Lmt, 'Alvo', { color: GREEN })]),
      html: slide(HR, '4 · Sem stop e alvo', 'Stop e alvo <em>junto com a entrada</em>', 'A venda entra com a compra STP no stop e a compra LMT no alvo. Nada de ordem esquecida.') },
    { cena: P('27.png', [122, 140, 3.0], [b(R.p27Dia, 'Limite do dia')]),
      html: slide(HR, '5 · Querer recuperar', 'O limite do dia <em>na tela</em>', 'O dia e o limite diário aparecem antes do primeiro trade, e o teto vale para todo plano.') },
    { cena: P('31.png', [122, 140, 2.4], [b(R.p31Box, 'Sinal verde', { color: GREEN })]),
      html: slide(HR, '6 · Sair por medo ou ganância', 'O verde <em>avisa</em>', 'Com o RR favorável, o painel acende em verde: avalie realizar. A decisão continua sua.', 'green') },
    { fim: { cena: P('26.png', [560, 760, 0.9]), titulo: 'Gestão antes do clique', corpo: 'Quer ver o GL Risk Auto na sua conta?', disc: DISC2 } }
  ] },
  'car-ra-mesa': { titulo: 'Mesa proprietária: as regras na tela', itens: [
    { cena: P('27.png', [620, 510, 0.95], [], { dim: .25, enquadrar: false }), max: 640,
      html: capaC(HR + ' · Mesa proprietária', 'Na mesa, <em>quebrar a regra</em> custa a conta', 'Como o GL Risk Auto põe as regras da conta na tela.') },
    { cena: P('27.png', [122, 90, 3.2], [b(R.p27Dia, 'Limite do dia')]),
      html: slide(HR, '1 · Limite do dia', 'O limite <em>antes do primeiro trade</em>', 'O painel mostra o dia e o limite diário da conta: aqui, limite de -US$600.') },
    { cena: P('27.png', [122, 175, 3.0], [b(R.p27Preset, 'Preset de mesa')]),
      html: slide(HR, '2 · Preset de mesa', 'As regras <em>da conta</em>', 'O preset traz as regras do tipo de conta: aqui, GL Prop Firm Auto 50K.') },
    { cena: P('23.png', [165, 300, 2.6], [b(R.dTeto, 'Teto por trade', { color: GREEN })]),
      html: slide(HR, '3 · Teto por trade', 'O teto <em>calculado</em>', 'O plano de risco calcula o teto por trade: US$285,71, com referência em ticks no ES. O auto risco aplica depois de cada trade fechado.') },
    { cena: P('26.png', [176, 1398, 2.6], [b(R.p26Teto, 'Bloqueado', { color: RED })]),
      html: slide(HR, '4 · Acima do teto', 'O plano <em>não passa</em>', 'Nem quando a vontade de recuperar fala mais alto.', 'red') },
    { cena: P('25.png', [68, 110, 3.6], [b(R.p25Box, 'Plano pronto', { color: GREEN })]),
      html: slide(HR, '5 · Dentro da regra', '<em>Plano pronto</em>', 'Dentro do teto, o START confirma a entrada, com stop e alvo.', 'green') },
    { fim: { cena: P('27.png', [620, 510, 0.95]), titulo: 'As regras na tela', corpo: 'Aprovação em mesa depende de você e das regras de cada mesa.', disc: DISC_MESA } }
  ] },
  'car-ra-r': { titulo: 'O que é R', itens: [
    { cena: P('29.png', [640, 660, 1.0], [], { dim: .25, enquadrar: false }), max: 640,
      html: capaC(HR + ' · Aula rápida', 'O que é <em>R</em>?', 'A unidade de risco que deixa todo trade comparável.') },
    { cena: P('29.png', [660, 450, 1.8], [b(R.p29R1, '1R', { color: RED })]),
      html: slide(HR, '1R', 'O risco <em>até o stop</em>', 'R é quanto você perde se o stop for atingido. Aqui, 5 pontos: US$250 em 1 contrato.') },
    { cena: P('29.png', [660, 700, 1.1], [b(R.p29Escada, '1R a 5R')]),
      html: slide(HR, 'A escada', 'Cada degrau <em>é 1R</em>', '1R, 2R, 3R, 4R e 5R: 5, 10, 15, 20 e 25 pontos a partir da entrada.') },
    { cena: P('29.png', [660, 820, 1.4], [b(R.p29Alvo, 'Alvo 5R', { color: GREEN })]),
      html: slide(HR, 'O alvo', 'Alvo em <em>5R</em>', 'O alvo de 5R fica a 25 pontos, 5 vezes o risco, e cai na VAL D.', 'green') },
    { cena: P('25.png', [68, 160, 3.6], [b(R.p25Venda, 'Plano em R', { color: GREEN })]),
      html: slide(HR, 'No painel', 'O R <em>antes do clique</em>', 'O GL Risk Auto mostra o plano em R: "VENDA 1 ct, 4,61R".') },
    { fim: { cena: P('29.png', [640, 660, 1.0]), titulo: 'Pense em R', corpo: 'antes de pensar em dinheiro.', disc: DISC } }
  ] },
  'car-ra-estados': { titulo: 'Os 6 estados do painel', itens: [
    { cena: P('31.png', [122, 248, 2.2], [], { dim: .3, enquadrar: false }), max: 640,
      html: capaC(HR + ' · Tutorial', 'O que o painel <em>está te dizendo</em>', 'Os 6 estados do GL Risk Auto, em ordem.') },
    { cena: P('24.png', [165, 86, 2.8], [b(R.cfgBox, 'Configure a conta')]),
      html: slide(HR, '1 · Configure a conta', 'Falta <em>conta e ativo</em>', 'Escolha a conta e o ativo na aba Dados.') },
    { cena: P('27.png', [122, 80, 3.2], [b(R.p27Box, 'Planejamento')]),
      html: slide(HR, '2 · Planejamento', 'Pronto para <em>planejar</em>', 'Mostra o dia e o limite diário. A planeja compra; Y planeja venda.') },
    { cena: P('25.png', [68, 60, 3.6], [b(R.p25Box, 'Plano pronto', { color: GREEN })]),
      html: slide(HR, '3 · Plano pronto', 'Cabe <em>no teto</em>', 'START confirma, SELECT cancela.', 'green') },
    { cena: P('26.png', [176, 1398, 2.6], [b(R.p26Teto, 'Acima do teto', { color: RED })]),
      html: slide(HR, '4 · Acima do teto', 'Entrada <em>barrada</em>', 'O risco do plano passa do teto e cabem 0 contratos.', 'red') },
    { cena: P('30.png', [122, 80, 3.2], [b(R.p30Box, 'Em posição')]),
      html: slide(HR, '5 · Em posição', 'O trade <em>em R</em>', 'Mede o trade ao vivo e mostra o próximo marco, como "buscando 2R".') },
    { cena: P('31.png', [122, 90, 3.0], [b(R.p31Box, 'Sinal verde', { color: GREEN })]),
      html: slide(HR, '6 · Sinal verde', '<em>Avalie realizar</em>', 'RR favorável: o painel avisa; a decisão continua sua.', 'green') },
    { fim: { cena: P('31.png', [122, 248, 2.2]), titulo: 'Salve para consultar', corpo: 'Os tutoriais completos estão no YouTube.', disc: DISC } }
  ] },
  'car-ra-controle': { titulo: 'O controle, botão por botão', itens: [
    { cena: P('22.png', [160, 160, 2.6], [], { dim: .25, enquadrar: false }), max: 640,
      html: capaC(HR + ' · Tutorial', 'O controle, <em>botão por botão</em>', 'Cada botão faz uma coisa, sempre dentro do teto.') },
    { cena: P('22.png', [160, 320, 2.6], [b(R.bAY, 'A · Y', { below: false }), b(R.bStart, 'START')]),
      html: slide(HR, '1 · Planejar e confirmar', 'A e Y planejam, <em>START confirma</em>', 'A desenha a compra, Y a venda. START confirma o plano ou a ação pendente.') },
    { cena: P('22.png', [160, 392, 2.6], [b(R.bStop, 'Stop', { below: false }), b(R.bAlvo, 'Alvo')]),
      html: slide(HR, '2 · Ajuste fino', 'Stop e alvo, <em>1 tick por toque</em>', 'LB e LT movem o stop; RB e RT movem o alvo.') },
    { cena: P('22.png', [160, 467, 2.8], [b(R.bSelect, 'SELECT', { color: RED })]),
      html: slide(HR, '3 · Cancelar', 'SELECT <em>cancela</em>', 'Com plano, cancela o desenho. Sem plano, fecha a posição: atenção a esse botão.', 'red') },
    { cena: P('22.png', [160, 550, 2.4], [b(R.bContr, 'Contratos', { below: false }), b(R.bRR, 'R:R')]),
      html: slide(HR, '4 · Mão e R:R', 'Contratos e <em>R:R</em>', 'R3 e L3 somam ou tiram 1 contrato; BAIXO e CIMA trocam o R:R entre 1R e 5R.') },
    { cena: P('22.png', [160, 60, 2.6], [b(R.testar, 'Treino sem ordens', { color: GREEN })]),
      html: slide(HR, '5 · Treino', 'Teste <em>sem enviar ordens</em>', 'Marque "Testar botões" para aprender sem mexer na conta. Sem controle? Os atalhos usam CTRL + SHIFT no teclado.', 'green') },
    { fim: { cena: P('22.png', [160, 160, 2.6]), titulo: 'Salve para consultar', corpo: 'O tutorial completo está no YouTube.', disc: DISC } }
  ] },
  'car-ra-faq': { titulo: 'Perguntas sobre o GL Risk Auto', itens: [
    { cena: P('34.png', [531, 299, 1.0], [], { dim: .25, enquadrar: false }), max: 640,
      html: capaC(HR, 'As perguntas que a gente <em>mais ouve</em>', 'Respostas curtas, com o painel real.') },
    { cena: P('25.png', [68, 110, 3.6], [b(R.p25Ori, 'START confirma')]),
      html: slide(HR, 'Pergunta 1', '"Ele opera <em>por mim</em>?"', 'Não. Você planeja, confere e confirma. O painel mede o risco, barra o que passa do teto e avisa no verde.') },
    { cena: P('22.png', [160, 650, 2.4], [b(R.bTeclado, 'CTRL + SHIFT')]),
      html: slide(HR, 'Pergunta 2', '"Preciso de <em>um controle</em>?"', 'Não. Os atalhos também funcionam no teclado, com CTRL + SHIFT.') },
    { cena: P('27.png', [122, 175, 3.0], [b(R.p27Preset, 'Preset de mesa')]),
      html: slide(HR, 'Pergunta 3', '"Funciona em <em>conta de mesa</em>?"', 'Tem presets para conta de mesa proprietária, com teto por trade e limite do dia. Confira sempre as regras da sua mesa.') },
    { cena: P('22.png', [160, 60, 2.6], [b(R.testar, 'Testar botões', { color: GREEN })]),
      html: slide(HR, 'Pergunta 4', '"Dá para treinar <em>sem risco</em>?"', 'Sim: o modo "Testar botões" não envia ordens, e o painel funciona na conta simulada e no replay.') },
    { cena: P('30.png', [122, 360, 3.0], [b(R.p30Ori, 'Custos à parte')]),
      html: slide(HR, 'Pergunta 5', '"Os custos <em>entram na conta</em>?"', 'Não: o próprio painel avisa que o risco é estimado no stop, sem custos e slippage.') },
    { cena: P('34.png', [400, 299, 1.4], [b(R.p34Painel, 'GL Risk Auto')]),
      html: slide(HR, 'Pergunta 6', '"Onde está <em>o GL Risk Auto</em>?"', 'No Operacional Completo, para NinjaTrader. Tire as suas dúvidas na call 1x1 gratuita.') },
    { fim: { cena: P('34.png', [531, 299, 1.0]), titulo: 'Ficou outra dúvida?', corpo: 'Pergunte nos comentários ou na call.', disc: DISC } }
  ] }
};
const carrosseis = Object.entries(CARROSSEIS).map(([g, c]) => ({ group: g, titulo: c.titulo, specs: pasta(montarCarrossel(g, c.itens)) }));

// --------------------------------------------------------------------------------------------- stories 9:16
const ENQ = nota => `<div class="dash" style="height:190px">ENQUETE</div><div class="note">${nota}</div>`;
const LINK = (txt, nota) => `<div class="dash" style="height:110px">${txt}</div><div class="note">${nota}</div>`;
const NOTA_Q = 'A resposta sai amanhã, às 12h · Replay, exemplo educacional';
const NOTA_R = 'Replay · exemplo educacional. Risco estimado no stop; custos e slippage não incluídos.';
const PARES = [
  { k: 'teto', opcoes: ['Cabe', 'Não cabe'],
    q: [P('26.png', [700, 600, 1.2], [b(R.p26Stop, 'Stop: US$387,50', { color: RED, below: false })]), 'Esse plano <em>cabe no teto</em>?',
      `<div class="sb">Risco de <b>US$387,50</b> no stop. Teto da conta: <b>US$285,71</b>.</div>${ENQ(NOTA_Q)}`],
    r: [P('26.png', [176, 1398, 2.6], [b(R.p26Teto, 'Bloqueado', { color: RED })]), 'Não cabe: <em>bloqueado</em>',
      `<div class="sb">Acima do teto, o GL Risk Auto barra o plano antes da ordem: cabem 0 contratos.</div>${LINK('LINK DO REELS', NOTA_R)}`] },
  { k: 'venda', opcoes: ['Venderia', 'Esperaria'],
    q: [P('28.png', [760, 640, 1.8], [b(R.p28Vah, 'VAH D', { color: RED, below: false }), b(R.p28Bolha)]), 'Comprados na VAH D. <em>Você venderia?</em>',
      `<div class="sb">O preço testa a VAH D e o bloco vermelho, com compras agressivas na resistência.</div>${ENQ(NOTA_Q)}`],
    r: [P('29.png', [660, 660, 1.2], [b(R.p29Stop, 'Stop', { color: RED, below: false }), b(R.p29Alvo, 'Alvo 5R', { color: GREEN })]), 'Venda com <em>risco medido</em>',
      `<div class="sb">Stop acima da VAH D: US$250 de risco, dentro do teto. Alvo de 5R na VAL D.</div>${LINK('LINK DO REELS', NOTA_R)}`] },
  { k: 'realiza', opcoes: ['Realizo', 'Seguro', 'Protejo o stop'],
    q: [P('33.png', [560, 500, 1.2], [b(R.p33Pos, '+19,25 pontos', { color: GREEN, below: false })]), '+19,25 pontos. <em>Realiza ou segura?</em>',
      `<div class="sb">Venda em posição, com o preço perto da VAL D e o alvo de 5R logo abaixo.</div>${ENQ(NOTA_Q)}`],
    r: [P('31.png', [122, 140, 2.4], [b(R.p31Box, 'Sinal verde', { color: GREEN })]), 'O painel <em>avisa</em>; você decide',
      `<div class="sb">3R alcançado: o RR já está a favor. Realizar, segurar ou proteger é decisão sua, com critério.</div>${LINK('LINK DO REELS', 'Replay · exemplo educacional. Resultado passado não garante resultado futuro.')}`] },
  { k: 'contratos', opcoes: ['1', '2', 'Nenhum'],
    q: [P('29.png', [660, 450, 1.8], [b(R.p29R1, 'US$250 por contrato', { color: RED })]), 'Teto de US$285,71. <em>Quantos contratos cabem?</em>',
      `<div class="sb">Stop de 5 pontos: US$250 de risco por contrato.</div>${ENQ(NOTA_Q)}`],
    r: [P('30.png', [122, 310, 3.0], [b(R.p30Cap, 'Sem capacidade')]), 'Cabe <em>1</em>',
      `<div class="sb">1 contrato usa US$250 do teto. O segundo passaria de US$285,71: o painel avisa "sem capacidade".</div>${LINK('LINK DO REELS', NOTA_R)}`] },
  { k: 'botao', opcoes: ['A', 'START', 'SELECT'],
    q: [P('22.png', [160, 157, 3.2]), 'Qual botão <em>confirma</em> o plano?',
      `<div class="sb">No controle do GL Risk Auto, cada botão faz uma coisa.</div>${ENQ('A resposta sai amanhã, às 12h')}`],
    r: [P('22.png', [160, 330, 2.8], [b(R.bStart, 'START')]), '<em>START</em> confirma',
      `<div class="sb">A e Y planejam, START confirma e SELECT cancela o desenho.</div>${LINK('LINK DO TUTORIAL', 'Treine com "Testar botões": sem enviar ordens.')}`] }
];
const st = (id, [cena, titulo, html], kick, max) => ({ ...story(id, 'st-ra', cena, [topo(kick, titulo, max), base(html)]), folder: 'posts-risk' });
const storiesPares = PARES.flatMap(p => [st(`st-ra-${p.k}-enquete`, p.q, HR), st(`st-ra-${p.k}-resposta`, p.r, 'A resposta', 300)]);
const storiesSoltos = [
  st('st-ra-caixinha', [P('34.png', [531, 299, 1.0], [], { dim: .55, enquadrar: false }), 'Qual é a sua maior dificuldade <em>com risco</em>?',
    '<div class="dash" style="height:240px">CAIXINHA DE PERGUNTAS</div><div class="note">As respostas viram conteúdo.</div>'], HR),
  st('st-ra-reels', [P('31.png', [122, 140, 2.4], [b(R.p31Box, null, { color: GREEN })]), 'GL Risk Auto <em>na prática</em>',
    `<div class="sb">Fins de semana, 19h: gestão de risco com o painel real.</div>${LINK('LINK DO REELS', 'Replay · exemplo educacional.')}`], 'Novo no perfil'),
  st('st-ra-youtube', [P('22.png', [160, 157, 3.2]), 'GL Risk Auto <em>no YouTube</em>',
    `<div class="sb">Primeiros passos, planejar e confirmar, o controle e os estados do painel.</div>${LINK('LINK DO VÍDEO', 'Tutoriais em conta simulada e replay.')}`], 'Tutorial novo')
];

// --------------------------------------------------------------------------------------------- capas, thumbnails, frases e destaque
const T = (top, html, style) => ({ t0: -1, t1: 99, top, rise: 0, html, ...(style ? { style } : {}) });
const img1 = (id, group, w, h, o) => ({ id, group, folder: 'posts-risk', w, h, dur: 3, at: 2, replay: false, hideWm: true, ...o });
const cena1 = (img, [cx, cy, z], ay, boxes = [], dim = 0) => ({ t0: 0, t1: 9, last: true, img, ay, dim, cam: [{ t: 0, cx, cy, z }],
  hides: (HIDES[img] || []).map(h => ({ until: 999, ...h })), boxes: boxes.map(x => ({ below: true, t0: 0, t1: 99, ...x })) });

// capas de Reels (1080x1920): o título no centro, dentro do recorte 4:5 da grade do perfil
const CAPAS = [
  ['v18-risk-auto-teto', 'GL RISK AUTO', 'O risco antes do clique', '26.png', [176, 1398, 2.8], [b(R.p26Teto, null, { color: RED })]],
  ['v19-risk-auto-trade', 'GL RISK AUTO', 'Um trade do começo ao fim', '34.png', [531, 299, 1.6]],
  ['ra01-bloqueado', 'GL RISK AUTO', 'Este trade não passou', '26.png', [176, 1398, 2.8], [b(R.p26Teto, null, { color: RED })]],
  ['ra02-quanto-perde', 'GL RISK AUTO', 'Quanto você perde?', '29.png', [660, 560, 1.9], [b(R.p29Stop, null, { color: RED })]],
  ['ra03-controle', 'GL RISK AUTO', 'Sim, é um controle', '22.png', [160, 157, 4.2]],
  ['ra04-quantos-contratos', 'GESTÃO DE RISCO', '1 contrato ou 2?', '25.png', [68, 175, 5.0], [b(R.p25Cabem, null, { color: GREEN })]],
  ['ra05-sinal-verde', 'GL RISK AUTO', 'Quando realizar?', '31.png', [122, 140, 4.2], [b(R.p31Box, null, { color: GREEN })]],
  ['ra06-mesa-proprietaria', 'MESA PROPRIETÁRIA', 'Quebrar a regra custa a conta', '27.png', [122, 140, 4.0], [b(R.p27Dia)]],
  ['ra07-5-erros', 'GL RISK AUTO', '5 erros de risco', '26.png', [640, 760, 1.6]],
  ['ra08-antes-e-depois', 'GL RISK AUTO', 'Antes e depois', '33.png', [560, 480, 1.8]],
  ['ra09-o-que-e-r', 'AULA DE 20 SEGUNDOS', 'O que é R?', '29.png', [660, 660, 1.6]],
  ['ra10-sistema-completo', 'GL ACADEMY', 'O sistema completo', '34.png', [531, 299, 1.6]],
  ['m20-risco-do-contexto-ao-verde-9x16', 'MENTORIA GL · AULA 20', 'Do contexto ao sinal verde', '31.png', [122, 140, 4.2], [b(R.p31Box, null, { color: GREEN })]],
  ['m21-teto-e-tamanho-de-posicao-9x16', 'MENTORIA GL · AULA 21', 'Quantos contratos cabem?', '26.png', [176, 1398, 2.8], [b(R.p26Max, null, { color: RED })]],
  ['t01-primeiros-passos-9x16', 'TUTORIAL 1', 'Primeiros passos', '24.png', [165, 86, 3.6], [b(R.cfgBox)]],
  ['t02-planejar-conferir-confirmar-9x16', 'TUTORIAL 2', 'Planejar e confirmar', '29.png', [660, 560, 1.9]],
  ['t03-controle-e-teclado-9x16', 'TUTORIAL 3', 'O controle e o teclado', '22.png', [160, 157, 4.2]],
  ['t04-estados-do-painel-9x16', 'TUTORIAL 4', 'Os estados do painel', '31.png', [122, 140, 4.2]]
];
// o título fica em cima, sobre o escuro; o print aparece embaixo, com as marcações livres
const SHADE_CAPA = 'linear-gradient(180deg, rgba(5,5,5,.96) 0%, rgba(5,5,5,.92) 38%, rgba(5,5,5,.4) 49%, rgba(5,5,5,0) 57%, rgba(5,5,5,0) 88%, rgba(5,5,5,.6) 100%)';
const capas = CAPAS.map(([vid, kick, titulo, img, cam, boxes]) => img1('capa-' + vid, 'capas-ra', 1080, 1920, { noGrad: true, shade: SHADE_CAPA,
  scenes: [cena1(img, cam, 1330, boxes || [])],
  texts: [T(300, `${EMB(150)}<div class="kick2" style="margin-top:10px">${kick}</div><div class="head2" style="font-size:${titulo.length > 22 ? 96 : 108}px;margin-top:24px">${titulo}</div>`)] }));

// thumbnails do YouTube (1280x720): o print à direita (foco em x≈935), o título à esquerda
const thumb = (id, titulo, img, [x, y, z], boxes = []) => img1(id, 'thumbs-ra', 1280, 720, {
  shade: 'linear-gradient(90deg, #050505 0%, #050505 40%, rgba(5,5,5,.2) 58%, rgba(5,5,5,0) 70%)', noGrad: true,
  scenes: [cena1(img, [x - (935 - 640) / z, y, z], 360, boxes)],
  texts: [T(40, `<div style="display:flex;align-items:center;gap:14px">${EMB(64)}<span style="font:800 22px/1 Montserrat,sans-serif;letter-spacing:.18em;color:#d8ae55">GL RISK AUTO</span></div>`, 'left:44px;right:auto;text-align:left;padding:0'),
    T(170, `<div class="head2" style="font-size:${titulo.length > 24 || Math.max(...titulo.split(' ').map(w => w.length)) > 8 ? 78 : 88}px;text-align:left">${titulo}</div>`, 'left:44px;right:auto;width:640px;text-align:left;padding:0')] });
const thumbs = [
  thumb('thumb-ra-trade-completo', 'UM TRADE COMPLETO COM GESTÃO DE RISCO', '34.png', [300, 299, 1.1]),
  thumb('thumb-ra-bloqueado', 'O TRADE QUE NÃO PASSOU', '26.png', [176, 1398, 1.7], [b(R.p26Teto, 'Bloqueado', { color: RED })]),
  thumb('thumb-ra-m20', 'DO CONTEXTO AO SINAL VERDE', '31.png', [122, 150, 2.0], [b(R.p31Box, null, { color: GREEN })]),
  thumb('thumb-ra-m21', 'QUANTOS CONTRATOS CABEM?', '26.png', [176, 1398, 1.7], [b(R.p26Max, 'Cabem 0', { color: RED })]),
  thumb('thumb-ra-t01', 'PRIMEIROS PASSOS', '24.png', [165, 100, 1.9], [b(R.cfgBox)]),
  thumb('thumb-ra-t02', 'PLANEJAR, CONFERIR E CONFIRMAR', '29.png', [672, 470, 1.3], [b(R.p29Stop, 'Stop', { color: RED })]),
  thumb('thumb-ra-t03', 'O CONTROLE BOTÃO POR BOTÃO', '22.png', [160, 170, 2.0]),
  thumb('thumb-ra-t04', 'O QUE O PAINEL ESTÁ DIZENDO', '31.png', [122, 200, 1.6])
];

// frases 1:1
const frase = (id, txt, img, cam) => img1(id, 'frases-ra', 1080, 1080, { scenes: [cena1(img, cam, 540, [], .76)],
  texts: [T(120, EMB(150)), T(390, `<div class="head2" style="font-size:88px">${txt}</div>`), T(900, '<div class="kick2">GL RISK AUTO</div>'),
    T(990, '<div style="font:700 26px/1 Inter,sans-serif;letter-spacing:.08em;color:rgba(255,255,255,.6)">@glacademytrading</div>')] });
const frases = [
  frase('frase-ra-teto', 'Se não cabe no teto, não entra.', '26.png', [176, 1398, 2.6]),
  frase('frase-ra-verde', 'O verde não manda sair. Ele avisa.', '31.png', [122, 200, 2.6]),
  frase('frase-ra-plano', 'Plano primeiro. Botão depois.', '22.png', [160, 157, 3.2]),
  frase('frase-ra-r', 'Pense em R antes de pensar em dinheiro.', '29.png', [660, 660, 1.2])
];

// capa de destaque (o Instagram mostra o círculo central): um escudo com o visto
const destaque = img1('destaque-risk', 'destaques-ra', 1080, 1920, { bg: 'radial-gradient(ellipse at 50% 38%, #0e1020 0%, #05060c 62%, #030308 100%)', stars: { n: 520 },
  scenes: [], texts: [T(660, '<div style="width:600px;height:600px;margin:0 auto;border-radius:50%;border:4px solid #d8ae55;box-shadow:0 0 60px rgba(216,174,85,.35), inset 0 0 60px rgba(216,174,85,.15);display:grid;place-items:center;background:radial-gradient(circle, #15110a 0%, #050505 70%)"><svg viewBox="0 0 100 100" width="300" height="300" fill="none" stroke="#f1d9a6" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"><path d="M50 12 82 24v24c0 20-14 34-32 40C32 82 18 68 18 48V24z"/><path d="m36 50 10 10 20-22"/></svg></div>')] });

module.exports = [...carrosseis.flatMap(c => c.specs), ...storiesPares, ...storiesSoltos, ...capas, ...thumbs, ...frases, destaque];
// o que o kit_risk.py precisa para montar a página
module.exports.META = {
  carrosseis: carrosseis.map(c => ({ group: c.group, titulo: c.titulo, slides: c.specs.map(s => s.id) })),
  stories: PARES.map(p => ({ k: p.k, opcoes: p.opcoes, enquete: `st-ra-${p.k}-enquete`, resposta: `st-ra-${p.k}-resposta`,
    q: p.q[1].replace(/<[^>]+>/g, ''), r: p.r[1].replace(/<[^>]+>/g, '') })),
  soltos: storiesSoltos.map(s => s.id), capas: capas.map(s => s.id), thumbs: thumbs.map(s => s.id), frases: frases.map(s => s.id), destaque: destaque.id
};
