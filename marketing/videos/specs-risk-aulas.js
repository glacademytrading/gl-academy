// Mentoria GL, Módulo 8 · Gestão de risco (aulas 20 e 21) e os tutoriais do GL Risk Auto (1 a 4), em 16:9 para o
// YouTube e o GL OS e em 9:16 para Reels e Shorts. As aulas usam o formato da Mentoria GL (specs-mentoria.js): o gráfico
// à esquerda, a explicação no painel à direita e a pausa para o aluno decidir. A versão vertical põe a explicação no meio
// da tela, como a série "Operacional na prática". Roteiro proposto a partir dos prints: o Giovane valida antes de liberar.
const { aula, PAUSA } = require('./specs-mentoria.js');
const { HIDES, R, DISC, DISC2, DISC_MESA } = require('./risk-prints.js');

const GREEN = '#4fe3a8', RED = '#ff6b6b';
const IMGS = Object.fromEntries(Object.entries(HIDES).map(([k, v]) => [k, { hides: v }]));
const b = (rect, label, o = {}) => ({ rect, ...(label ? { label } : {}), ...o });

const MOD = 'Módulo 8 · Gestão de risco', TUT = 'GL Risk Auto · Tutoriais';

const RAW = [
  ({
    id: 'm20-risco-do-contexto-ao-verde', tipo: 'mentoria', modulo: MOD, aula: 'Aula 20', curto: 'Do contexto ao sinal verde',
    titulo: 'Do contexto ao sinal verde', gancho: 'Um trade do começo ao fim, com o risco medido',
    objetivo: 'Uma venda no ES, passo a passo: contexto, região, fluxo, risco medido, autorização e saída.',
    proxima: 'Teto de risco e tamanho de posição', img: '27.png', imgs: IMGS, disc: DISC2,
    passos: [
      { d: 6, tag: '1 · Contexto', titulo: 'Topos mais baixos no <em>30 minutos</em>', img: '27.png', cam: [660, 520, 1.3],
        texto: 'Topos em 7.810, 7.780 e 7.768, e o preço de volta à região de valor do dia e da semana. O macro pede cuidado com compras.',
        boxes: [b(R.p27Topos[0], '7.810', { color: RED, below: false }), b(R.p27Topos[1], '7.780', { color: RED, below: false }),
          b(R.p27Topos[2], '7.768', { color: RED }), b(R.p27Valor, 'Região de valor', { at: 2.4 })] },
      { d: 6, tag: '2 · Região', titulo: 'VAH D e <em>bloco vermelho</em>', img: '28.png', cam: [700, 700, 1.6],
        texto: 'No 5 minutos, o preço sobe até a VAH D, onde há um bloco vermelho: um topo de leilão marcado pela Estrutura de Mercado.',
        boxes: [b(R.p28Vah, 'VAH D e bloco vermelho', { color: RED, below: false })] },
      { d: 6, tag: '3 · Fluxo', titulo: 'Comprados comprando <em>na resistência</em>', cam: [790, 630, 2.4],
        texto: 'As bolhas do Order Flow mostram compras agressivas bem na VAH D. Quem compra na resistência pode virar combustível da venda.',
        boxes: [b(R.p28Bolha, 'Compra na resistência')] },
      PAUSA('Você venderia aqui?', 'Onde ficaria o stop? E quanto você aceita perder se ele for atingido?'),
      { d: 7, tag: '4 · Plano', titulo: 'O risco medido <em>antes do clique</em>', img: '29.png', cam: [600, 650, 1.35],
        texto: 'Stop acima da VAH D: 5 pontos, US$250 em 1 contrato. O GL Risk Auto desenha a escada de 1R a 5R, e o alvo de 5R cai na VAL D.',
        boxes: [b(R.p29Stop, 'Stop: US$250', { color: RED, below: false }), b(R.p29Entrada, 'Entrada', { at: 1.2 }),
          b(R.p29Alvo, 'Alvo 5R', { color: GREEN, at: 2.6 })] },
      { d: 6, tag: '5 · Autorização', cls: 'green', titulo: 'Cabe no teto: <em>entrada autorizada</em>', img: '30.png', cam: [120, 250, 3.0],
        texto: 'Risco vivo de US$250 para um teto de US$285,71 na conta. O painel autoriza a entrada.',
        boxes: [b(R.p30Risco, 'Dentro do teto', { color: GREEN })] },
      { d: 5, tag: '6 · Ordens', titulo: 'Stop e alvo <em>na plataforma</em>', cam: [900, 780, 1.9],
        texto: 'A venda entra com a compra STP no stop e a compra LMT no alvo, juntas. Nada de ordem esquecida.',
        boxes: [b(R.p30Stp, 'Stop', { color: RED, below: false }), b(R.p30Lmt, 'Alvo', { color: GREEN, at: 1.0 })] },
      { ...PAUSA('Realiza, segura ou protege?', 'O preço andou 19,25 pontos a favor, perto da VAL D. O que você faria agora?'), img: '33.png', cam: [560, 470, 1.3],
        boxes: [b(R.p33Pos, '+19,25 pontos', { color: GREEN, below: false })] },
      { d: 7, tag: '7 · Saída', cls: 'green', titulo: 'O sinal verde: <em>avalie realizar</em>', img: '31.png', cam: [122, 230, 2.0],
        texto: 'Com o RR favorável, o painel acende em verde: 3,37R do risco orientado. Ele não fecha o trade sozinho. Avisa, e a decisão é sua.',
        boxes: [b(R.p31Box, 'Sinal verde', { color: GREEN })] },
      { d: 7, tag: 'Resumo', titulo: 'O processo em <em>5 passos</em>', img: '34.png', cam: [531, 299, 1.2],
        lista: ['Contexto no 30 minutos', 'Região: VAH D e bloco vermelho', 'Fluxo: comprados na resistência', 'Risco medido e dentro do teto', 'Saída com o sinal verde'] }
    ]
  }),
  ({
    id: 'm21-teto-e-tamanho-de-posicao', tipo: 'mentoria', modulo: MOD, aula: 'Aula 21', curto: 'Teto de risco e tamanho de posição',
    titulo: 'Teto de risco e tamanho de posição', gancho: '1 contrato ou 2? Quem decide é o stop',
    objetivo: 'De onde vem o teto por trade, quantos contratos cabem no stop e por que a mão não cresce no impulso.',
    proxima: 'Tutoriais do GL Risk Auto', img: '23.png', imgs: IMGS, disc: DISC_MESA,
    passos: [
      { d: 7, tag: '1 · O teto', titulo: 'O teto vem do <em>plano de risco</em>', cam: [165, 290, 2.4],
        texto: 'Na aba Dados, o plano de risco mostra o teto por trade: US$285,71 com o preset de conta de mesa de 50 mil, com referência em ticks no ES.',
        boxes: [b(R.dTeto, 'Teto por trade', { color: GREEN })] },
      { d: 6, tag: '2 · Auto risco', titulo: 'Auto risco <em>ligado</em>', cam: [165, 300, 2.4],
        texto: 'O auto risco aplica depois de cada trade fechado, com a mesma referência de ticks.',
        boxes: [b(R.dAuto, 'Auto risco', { color: GREEN })] },
      { ...PAUSA('Esse plano cabe na conta?', 'Stop a US$387,50 de distância num teto de US$285,71. Entra ou não entra?'), img: '26.png', cam: [500, 700, 1.0],
        boxes: [b(R.p26Stop, 'Stop: US$387,50', { color: RED, below: false }), b(R.p26Entrada, 'Entrada')] },
      { d: 6, tag: '3 · Bloqueado', cls: 'red', titulo: 'Acima do teto: <em>não passa</em>', cam: [176, 1398, 3.4],
        texto: '"Max. nova entrada 0": com o stop tão longe, nem 1 contrato cabe, e o painel barra a entrada.',
        boxes: [b(R.p26Max, null, { color: RED }), b(R.p26Teto, 'Acima do teto', { color: RED, at: 1.4 })] },
      { d: 6, tag: '4 · Cabe', cls: 'green', titulo: 'Stop menor: <em>cabe 1 contrato</em>', img: '25.png', cam: [68, 175, 4.0],
        texto: 'Com US$225 de risco, o total fica dentro do teto. "Cabem 1 novos": o tamanho da mão vem do stop.',
        boxes: [b(R.p25Total, 'Dentro do teto', { color: GREEN, below: false }), b(R.p25Cabem, 'Cabe 1', { color: GREEN, at: 1.6 })] },
      { d: 6, tag: '5 · Em posição', titulo: 'Sem capacidade <em>para aumentar</em>', img: '30.png', cam: [120, 300, 3.0],
        texto: 'Com US$250 de risco vivo, não sobra espaço no teto para mais um contrato. A mão não cresce no impulso.',
        boxes: [b(R.p30Cap, 'Sem capacidade')] },
      { d: 7, tag: 'Resumo', titulo: 'Tamanho de posição <em>em 3 regras</em>', img: '26.png', cam: [500, 740, 0.85],
        lista: ['O teto vem do plano de risco da conta', 'O stop define quantos contratos cabem', 'Acima do teto, não tem entrada'] }
    ]
  }),
  ({
    id: 't01-primeiros-passos', tipo: 'tutorial', modulo: TUT, aula: 'Tutorial 1', curto: 'Primeiros passos',
    titulo: 'Primeiros passos: conta, ativo e preset', gancho: 'GL Risk Auto: configure em 5 passos',
    objetivo: 'Do aviso "Configure a conta" ao painel em planejamento: conta, ativo, modo, plano de risco e preset.',
    proxima: 'Planejar, conferir e confirmar', img: '24.png', imgs: IMGS, disc: DISC,
    passos: [
      { d: 6, tag: '1 · O aviso', titulo: 'Comece pelo <em>"Configure a conta"</em>', cam: [165, 120, 2.6],
        texto: 'Ao abrir, o painel pede conta e ativo na aba Dados. Até lá, nenhum plano aparece no gráfico.',
        boxes: [b(R.cfgBox, 'Configure a conta')] },
      { d: 6, tag: '2 · Dados', titulo: 'Conta e <em>ativo</em>', img: '23.png', cam: [165, 110, 2.6],
        texto: 'Na aba Dados, escolha a conta (aqui, a simulada Sim101) e o ativo que você vai operar.',
        boxes: [b(R.dConta, 'Conta', { below: false }), b(R.dAtivo, 'Ativo', { at: 1.4 })] },
      { d: 6, tag: '3 · Modo', titulo: 'Modo <em>GLBracket</em>', cam: [165, 220, 2.6],
        texto: 'O modo GLBracket envia a entrada com stop e alvo juntos (OCO). A estratégia ATM do NinjaTrader fica em Nenhum.',
        boxes: [b(R.dModo, 'Modo', { below: false }), b(R.dProt, 'Proteções', { at: 1.4 })] },
      { d: 6, tag: '4 · Plano de risco', titulo: 'Teto e <em>auto risco</em>', cam: [165, 320, 2.6],
        texto: 'O plano de risco mostra o teto por trade e a referência em ticks. O auto risco aplica depois de cada trade fechado.',
        boxes: [b(R.dTeto, 'Teto', { color: GREEN, below: false }), b(R.dAuto, 'Auto risco', { color: GREEN, at: 1.4 })] },
      { d: 6, tag: '5 · Preset', titulo: 'Escolha o <em>preset GL</em>', img: '24.png', cam: [165, 215, 2.6],
        texto: 'Os presets trazem as regras de cada tipo de conta, como as de mesa proprietária. Os botões de 1R a 5R definem o alvo do plano.',
        boxes: [b(R.cfgPreset, 'Preset', { below: false }), b(R.cfgRR, '1R a 5R', { at: 1.4 })] },
      { d: 6, tag: 'Pronto', cls: 'green', titulo: 'Painel em <em>planejamento</em>', img: '27.png', cam: [122, 200, 2.4],
        texto: 'Com conta e ativo escolhidos, o painel mostra o dia, o limite diário e o teto. A planeja compra; Y planeja venda.',
        boxes: [b(R.p27Box, 'Planejamento', { color: GREEN }), b(R.p27Ori, 'Orientação', { at: 1.8 })] }
    ]
  }),
  ({
    id: 't02-planejar-conferir-confirmar', tipo: 'tutorial', modulo: TUT, aula: 'Tutorial 2', curto: 'Planejar, conferir e confirmar',
    titulo: 'Planejar, conferir e confirmar', gancho: 'Do plano ao trade em 3 botões',
    objetivo: 'Como desenhar o plano no gráfico, conferir o risco em R, ajustar stop e alvo e confirmar.',
    proxima: 'O controle e o teclado', img: '27.png', imgs: IMGS, disc: DISC,
    passos: [
      { d: 6, tag: '1 · Planejar', titulo: '<em>A</em> compra, <em>Y</em> venda', cam: [122, 280, 2.4],
        texto: 'Com o painel em planejamento, o A desenha um plano de compra e o Y um plano de venda, direto no gráfico.',
        boxes: [b(R.p27Ori, 'A compra · Y venda')] },
      { d: 7, tag: '2 · Conferir', titulo: 'O plano <em>no gráfico</em>', img: '29.png', cam: [600, 650, 1.35],
        texto: 'Entrada, stop e a escada de 1R a 5R aparecem no gráfico, com o risco em dólar no stop. Confira antes de confirmar.',
        boxes: [b(R.p29Stop, 'Stop: US$250', { color: RED, below: false }), b(R.p29Entrada, 'Entrada', { at: 1.2 }), b(R.p29Escada, '1R a 5R', { at: 2.4 })] },
      { d: 6, tag: '3 · Ajustar', titulo: 'Ajuste fino <em>pelo controle</em>', img: '22.png', cam: [160, 420, 2.2],
        texto: 'LB e LT movem o stop 1 tick; RB e RT movem o alvo; BAIXO e CIMA trocam o R:R de 5R a 1R.',
        boxes: [b(R.bStop, 'Stop', { below: false }), b(R.bAlvo, 'Alvo', { at: 1.2 }), b(R.bRR, 'R:R', { at: 2.4 })] },
      { d: 6, tag: '4 · Confirmar', cls: 'green', titulo: '<em>Plano pronto</em>: START confirma', img: '25.png', cam: [68, 120, 3.6],
        texto: 'Dentro do teto, o painel mostra "plano pronto". START confirma; SELECT cancela o desenho.',
        boxes: [b(R.p25Box, 'Plano pronto', { color: GREEN }), b(R.p25Ori, 'START confirma', { at: 1.6 })] },
      { d: 6, tag: 'Acima do teto', cls: 'red', titulo: 'Passou do teto: <em>entrada barrada</em>', img: '26.png', cam: [176, 1398, 3.4],
        texto: 'Se o risco do plano passa do teto, o painel avisa "acima do teto" e mostra que cabem 0 contratos.',
        boxes: [b(R.p26Teto, 'Acima do teto', { color: RED })] },
      { d: 6, tag: '5 · Em posição', titulo: 'Stop e alvo <em>na plataforma</em>', img: '30.png', cam: [900, 780, 1.9],
        texto: 'Confirmado, a entrada sai com a compra STP no stop e a compra LMT no alvo, e o painel passa a medir o trade em R.',
        boxes: [b(R.p30Stp, 'Stop', { color: RED, below: false }), b(R.p30Pos, 'Posição', { at: 1.0 }), b(R.p30Lmt, 'Alvo', { color: GREEN, at: 1.6 })] }
    ]
  }),
  ({
    id: 't03-controle-e-teclado', tipo: 'tutorial', modulo: TUT, aula: 'Tutorial 3', curto: 'O controle e o teclado',
    titulo: 'O controle e o teclado', gancho: 'O mapa do controle, botão por botão',
    objetivo: 'Os botões do controle no GL Risk Auto: planejar, confirmar, mover stop e alvo, cancelar, contratos e R:R.',
    proxima: 'Os estados do painel', img: '22.png', imgs: IMGS, disc: DISC,
    passos: [
      { d: 6, tag: '1 · Treino', titulo: 'Teste <em>sem enviar ordens</em>', cam: [160, 120, 2.6],
        texto: 'Marque "Testar botões (sem ordens)" para aprender o mapa do controle sem mexer na conta.',
        boxes: [b(R.testar, 'Testar botões')] },
      { d: 6, tag: '2 · Planejar', titulo: 'A, Y e <em>START</em>', cam: [160, 320, 2.4],
        texto: 'A planeja compra, Y planeja venda e START confirma o plano ou a ação pendente.',
        boxes: [b(R.bAY, 'A · Y', { below: false }), b(R.bStart, 'START', { at: 1.4 })] },
      { d: 6, tag: '3 · Stop e alvo', titulo: 'Um tick <em>por toque</em>', cam: [160, 390, 2.4],
        texto: 'LB/L1 e LT/L2 sobem e descem o stop. RB/R1 e RT/R2 fazem o mesmo com o alvo.',
        boxes: [b(R.bStop, 'Stop', { below: false }), b(R.bAlvo, 'Alvo', { at: 1.4 })] },
      { d: 6, tag: '4 · Cancelar', cls: 'red', titulo: 'SELECT <em>cancela</em>', cam: [160, 470, 2.4],
        texto: 'Com plano, o SELECT cancela o desenho. Sem plano, ele fecha a posição: atenção a esse botão.',
        boxes: [b(R.bSelect, 'SELECT', { color: RED })] },
      { d: 6, tag: '5 · Mão e R:R', titulo: 'Contratos e <em>R:R</em>', cam: [160, 550, 2.4],
        texto: 'R3 e L3 somam ou tiram 1 contrato da nova entrada. BAIXO e CIMA trocam o R:R entre 1R e 5R.',
        boxes: [b(R.bContr, 'Contratos', { below: false }), b(R.bRR, 'R:R', { at: 1.4 })] },
      { d: 5, tag: '6 · Teclado', titulo: 'Sem controle? <em>Teclado</em>', cam: [160, 640, 2.4],
        texto: 'Pelo teclado, os atalhos usam CTRL + SHIFT.',
        boxes: [b(R.bTeclado, 'CTRL + SHIFT')] },
      { d: 6, tag: 'Resumo', titulo: 'O mapa <em>do controle</em>', cam: [160, 360, 1.5],
        lista: ['A e Y planejam, START confirma', 'LB e LT no stop, RB e RT no alvo', 'SELECT cancela; sem plano, fecha', 'R3 e L3 contratos, BAIXO e CIMA R:R'] }
    ]
  }),
  ({
    id: 't04-estados-do-painel', tipo: 'tutorial', modulo: TUT, aula: 'Tutorial 4', curto: 'Os estados do painel',
    titulo: 'Os estados do painel', gancho: 'O que o painel está te dizendo',
    objetivo: 'Os seis estados do GL Risk Auto, do "Configure a conta" ao sinal verde, e o que fazer em cada um.',
    proxima: null, img: '24.png', imgs: IMGS, disc: DISC2,
    passos: [
      { d: 5, tag: '1 · Configure a conta', titulo: 'Falta <em>conta e ativo</em>', cam: [165, 120, 2.6],
        texto: 'Escolha a conta e o ativo na aba Dados.', boxes: [b(R.cfgBox, 'Configure a conta')] },
      { d: 5, tag: '2 · Planejamento', titulo: 'Pronto para <em>planejar</em>', img: '27.png', cam: [122, 150, 2.6],
        texto: 'Mostra o dia e o limite diário da conta. A planeja compra; Y planeja venda.', boxes: [b(R.p27Box, 'Planejamento')] },
      { d: 5, tag: '3 · Plano pronto', cls: 'green', titulo: 'Cabe no <em>teto</em>', img: '25.png', cam: [68, 100, 3.6],
        texto: 'O plano está dentro do teto: START confirma, SELECT cancela.', boxes: [b(R.p25Box, 'Plano pronto', { color: GREEN })] },
      { d: 5, tag: '4 · Acima do teto', cls: 'red', titulo: 'Entrada <em>barrada</em>', img: '26.png', cam: [176, 1398, 3.4],
        texto: 'O risco do plano passa do teto da conta, e cabem 0 contratos.', boxes: [b(R.p26Teto, 'Acima do teto', { color: RED })] },
      { d: 5, tag: '5 · Em posição', titulo: 'O trade <em>em R, ao vivo</em>', img: '30.png', cam: [122, 150, 2.6],
        texto: 'Mede o trade em R do risco orientado e mostra o próximo marco, como "buscando 2R".', boxes: [b(R.p30Box, 'Em posição')] },
      { d: 6, tag: '6 · Sinal verde', cls: 'green', titulo: '<em>Avalie realizar</em>', img: '31.png', cam: [122, 200, 2.4],
        texto: 'RR favorável: "3R alcançado, avalie realizar". O painel avisa; a decisão continua sua.', boxes: [b(R.p31Box, 'Sinal verde', { color: GREEN })] },
      { d: 6, tag: 'Resumo', titulo: 'Seis estados, <em>uma leitura</em>', cam: [122, 240, 1.9],
        lista: ['Configure a conta', 'Planejamento', 'Plano pronto ou acima do teto', 'Em posição', 'Sinal verde'] }
    ]
  })
];

// 16:9: o formato da Mentoria GL; nos tutoriais, a cartela final chama a prática na conta simulada
function horizontal(o) {
  const s = aula(o);
  s.id = o.id;
  s.end.brand = o.tipo === 'tutorial' ? 'GL RISK AUTO' : 'MENTORIA GL';
  if (o.tipo === 'tutorial') {
    s.end.tag = o.proxima ? `Próximo tutorial: ${o.proxima}` : 'Fim dos tutoriais: pratique no Sim101 ou no replay.';
    s.end.cta = 'Pratique na conta simulada ou no replay';
    // a cartela de abertura diz "GL Risk Auto · Tutorial N", não "Mentoria GL"
    s.texts[0].html = s.texts[0].html.replace(`MENTORIA GL · ${o.modulo.toUpperCase()}`, `GL RISK AUTO · ${o.aula.toUpperCase()}`);
  }
  s.end.disc = o.disc;
  s.meta = { ...s.meta, tipo: o.tipo, gancho: o.gancho };
  return s;
}

// 9:16: a explicação no meio da tela, fora dos botões e da legenda do Reels e do Shorts (como specs-social.js)
const V = { w: 1080, h: 1920, ay: 575 }, K = 0.8, GANCHO = 2.6, FIM = 3.4;
const PAINEL = 'left:84px;right:170px;text-align:left;padding:0';
const fv = (t, [x, y, z]) => ({ t, cx: x, cy: y, z: +(z * K).toFixed(3) });
function vertical(o) {
  const cab = o.tipo === 'tutorial' ? `GL Risk Auto · ${o.aula}` : `Mentoria GL · ${o.aula}`;
  const texts = [
    { t0: -1, t1: 999, top: 0, rise: 0, in: 0.01, style: 'left:0;right:0;padding:0', html: '<div class="vs-bg"></div>' },
    { t0: -1, t1: GANCHO, top: 1030, rise: 0, in: 0.01, style: PAINEL, html: `<div class="vs-k">${cab}</div><div class="vs-hook">${o.gancho}</div><div class="vs-sub">${o.objetivo}</div>` }
  ];
  const cenas = [];
  let t = GANCHO, atual = null, ultimo = null;
  for (const p of o.passos) {
    const img = p.img || (atual ? atual.img : o.img);
    if (!atual || atual.img !== img) {
      atual = { img, t0: cenas.length ? t - 0.2 : 0, cam: [], boxes: [], hides: (HIDES[img] || []).map(h => ({ until: 999, ...h })) };
      if (cenas.length) cenas[cenas.length - 1].t1 = t + 0.2;
      cenas.push(atual);
    }
    const cam = p.cam || atual.ultimo || ultimo; ultimo = cam;
    if (!atual.cam.length) atual.cam.push(fv(atual.t0, cam)); else { atual.cam.push(fv(t, atual.ultimo)); atual.cam.push(fv(t + 0.6, cam)); }
    atual.ultimo = cam;
    (p.boxes || []).forEach(x => atual.boxes.push({ below: true, ...x, t0: t + (x.at == null ? 0.6 : x.at), t1: t + (x.ate == null ? p.d - 0.1 : x.ate) }));
    const tag = p.tag === 'Pause o vídeo' ? 'Responda nos comentários' : p.tag;
    texts.push({ t0: t + 0.1, t1: t + p.d - 0.05, top: 1066, rise: 18, style: PAINEL,
      html: `<div class="vs"><div class="ms-step ${p.cls || ''}">${tag}</div><div class="ms-title">${p.titulo}</div>` +
        (p.texto ? `<div class="ms-body">${p.texto}</div>` : '') + (p.lista ? `<ul class="ms-list">${p.lista.map(i => `<li>${i}</li>`).join('')}</ul>` : '') + '</div>' });
    t += p.d;
  }
  texts.splice(2, 0, { t0: GANCHO - 0.3, t1: t + 0.2, top: 1020, rise: 0, style: PAINEL, html: `<div class="vs"><div class="ms-head">${cab}</div></div>` });
  texts[0].t1 = t + 0.2;
  const dur = +(t + FIM).toFixed(2);
  cenas[cenas.length - 1].t1 = dur; cenas[cenas.length - 1].last = true;
  const passosT = []; let u = GANCHO; o.passos.forEach(p => { passosT.push(+(u + p.d / 2).toFixed(1)); u += p.d; });
  const tut = o.tipo === 'tutorial';
  return {
    id: o.id + '-9x16', ...V, dur, noGrad: true, texts,
    scenes: cenas.map(C => ({ t0: C.t0, t1: C.t1, img: C.img, cam: C.cam, boxes: C.boxes, hides: C.hides, ...(C.last ? { last: true } : {}) })),
    end: { t0: t, brand: tut ? 'GL RISK AUTO' : 'MENTORIA GL', tag: o.proxima ? `Próximo: ${o.proxima}` : 'Salve para consultar quando operar',
      cta: tut ? 'Pratique na conta simulada ou no replay' : 'Call 1x1 gratuita no link da bio', sub: tut ? 'Salve para consultar' : 'Salve para estudar', disc: o.disc },
    meta: { tipo: o.tipo, aula: o.aula, curto: o.curto, gancho: o.gancho, objetivo: o.objetivo },
    stills: [0.4, ...passosT, +(t + 1.5).toFixed(1)]
  };
}

module.exports = [...RAW.map(horizontal), ...RAW.map(vertical)];
module.exports.RAW = RAW;
