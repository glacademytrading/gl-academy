// Mentoria GL: o operacional na prática. Aulas curtas em 16:9 feitas com os prints reais.
// Cada aula segue o mesmo processo: contexto, pausa para o aluno decidir, região de atuação, gatilho,
// invalidação (stop), alvos, resultado e resumo. O gráfico se constrói até o ponto de decisão, para,
// e só continua depois da explicação. Coordenadas em pixels de cada print.
// Roteiro proposto a partir dos prints: o Giovane valida as regras antes de liberar para os alunos.
const L = { w: 1920, h: 1080, ay: 560 };
const GREEN = '#4fe3a8', RED = '#ff6b6b';
const INTRO = 3.6, FIM = 3.2;
const PAINEL = 'left:1330px;right:62px;text-align:left;padding:0';
const DISC = 'Exemplo educacional em replay, não é recomendação de investimento. Trading envolve risco financeiro real: defina o risco antes de cada operação.';

// o ponto (x, y) do print fica no centro da área do gráfico (640, 560); o painel ocupa a direita
const foco = (t, [x, y, z]) => ({ t, cx: x + 320 / z, cy: y, z });

function aula(o) {
  const texts = [
    { t0: -1, t1: INTRO, top: 0, rise: 0, in: 0.01, style: 'left:0;right:0;padding:0',
      html: `<div class="ms-intro"><img src="emblem.png"><div class="k">MENTORIA GL · ${o.modulo.toUpperCase()}</div><div class="t">${o.titulo}</div><div class="o">${o.objetivo}</div></div>` }
  ];
  const cenas = [], porImg = {};
  let t = INTRO, atual = null, ultimoCam = null;
  for (const p of o.passos) {
    const img = p.img || (atual ? atual.img : o.img);
    if (!atual || atual.img !== img) {
      // nova cena: entra cruzando com a anterior
      atual = { img, t0: cenas.length ? t - 0.2 : 0, cam: [], keys: [], boxes: [], spots: [], hides: [], cfg: o.imgs[img] || {} };
      if (cenas.length) cenas[cenas.length - 1].t1 = t + 0.2;
      cenas.push(atual);
      atual.x = atual.cfg.reveal ? atual.cfg.reveal.x0 : null;
      if (atual.cfg.reveal) atual.keys.push({ t: Math.max(INTRO - 0.2, atual.t0), x: atual.x });
      (atual.cfg.hides || []).forEach(h => atual.hides.push(h));
    }
    const C = atual;
    // câmera: chega no foco do passo em 0.6 s (o primeiro passo da cena já começa no foco)
    const cam = p.cam || C.ultimo || ultimoCam;
    ultimoCam = cam;
    if (!C.cam.length) C.cam.push(foco(C.t0, cam));
    else { C.cam.push(foco(t, C.ultimo)); C.cam.push(foco(t + 0.6, cam)); }
    C.ultimo = cam;
    // revelação até o x do passo, em linha reta
    if (p.revela != null && C.cfg.reveal) {
      const r0 = t + (p.revelaEm == null ? 0.3 : p.revelaEm), r1 = r0 + (p.rd || 2);
      C.keys.push({ t: r0, x: C.x }); C.keys.push({ t: r1, x: p.revela }); C.x = p.revela;
    }
    (p.boxes || []).forEach(b => C.boxes.push({ below: true, ...b, t0: t + (b.at == null ? 0.6 : b.at), t1: t + (b.ate == null ? p.d - 0.1 : b.ate) }));
    (p.spots || []).forEach(r => C.spots.push({ rect: r, t0: t + 0.5, t1: t + p.d - 0.1, pad: 12 }));
    (p.mostra || []).forEach(i => { C.hides[i] = { ...C.hides[i], until: t + (p.mostraEm || 0.4) }; });
    texts.push({ t0: t + 0.1, t1: t + p.d - 0.05, top: 312, rise: 18, style: PAINEL,
      html: `<div class="ms-step ${p.cls || ''}">${p.tag}</div><div class="ms-title">${p.titulo}</div>` +
        (p.texto ? `<div class="ms-body">${p.texto}</div>` : '') +
        (p.lista ? `<ul class="ms-list">${p.lista.map(i => `<li>${i}</li>`).join('')}</ul>` : '') });
    t += p.d;
  }
  const dur = +(t + FIM).toFixed(2);
  cenas[cenas.length - 1].t1 = dur; cenas[cenas.length - 1].last = true;
  texts.splice(1, 0,
    { t0: 3.2, t1: t + 0.2, top: 0, rise: 0, style: 'left:0;right:0;padding:0', html: '<div class="ms-bg"></div>' },
    { t0: 3.2, t1: t + 0.2, top: 168, rise: 0, style: PAINEL, html: `<div class="ms-head">${o.modulo}</div><div class="ms-aula">${o.aula} · ${o.curto}</div><div class="ms-rule"></div>` });
  const scenes = cenas.map(C => {
    const s = { t0: C.t0, t1: C.t1, img: C.img, cam: C.cam, boxes: C.boxes, spots: C.spots, hides: C.hides.map(h => ({ until: 999, ...h })) };
    if (C.last) s.last = true;
    if (C.cfg.reveal) s.reveal = { ...C.cfg.reveal, keys: C.keys };
    return s;
  });
  const passosT = []; let u = INTRO; o.passos.forEach(p => { passosT.push(+(u + p.d / 2).toFixed(1)); u += p.d; });
  // dados da aula para o plano, os roteiros e o ZIP da mentoria (mentoria_pacote.py); não mudam o vídeo
  const prints = []; let pi = o.img;
  o.passos.forEach(p => { pi = p.img || pi; const n = parseInt(pi, 10); if (!prints.includes(n)) prints.push(n); });
  const meta = { modulo: o.modulo, aula: o.aula, curto: o.curto, titulo: o.titulo, objetivo: o.objetivo, proxima: o.proxima, gamma: !!o.gamma, prints,
    passos: o.passos.map(p => ({ tag: p.tag, cls: p.cls || '', titulo: p.titulo, texto: p.texto || '', lista: p.lista || [] })) };
  return {
    id: o.id, ...L, dur, noGrad: true, scenes, texts, meta,
    end: { t0: t, brand: 'MENTORIA GL', tag: o.proxima ? `Próxima aula: ${o.proxima}` : 'Fim da mentoria: revise cada aula no replay.',
      cta: 'Pratique no replay antes de operar', sub: '', disc: DISC + (o.gamma ? ' GL Gamma: assinatura à parte.' : '') },
    stills: [1.5, ...passosT, +(t + 1.5).toFixed(1)]
  };
}

const PAUSA = (titulo, texto) => ({ tag: 'Pause o vídeo', cls: 'ask', titulo, texto, d: 4 });

module.exports = [
  // ---------------------------------------------------------------- Módulo 1 · Leitura do estado
  aula({
    id: 'm01-painel-market-state', modulo: 'Módulo 1 · Leitura do estado', aula: 'Aula 1', curto: 'O painel Market State',
    titulo: 'O painel Market State', objetivo: 'Como ler Agora, Contexto e Leitura, e o que muda no tipo de trade.',
    proxima: 'Contexto a favor ou contra', img: '6.png',
    imgs: { '6.png': {}, '9.png': {}, '11.png': {} },
    passos: [
      { d: 6, tag: '1 · Onde fica', titulo: 'O painel lê o mercado <em>em português</em>', texto: 'No canto do gráfico, o GL Estado de Mercado resume o momento em três linhas: <b>Agora</b>, <b>Contexto</b> e <b>Leitura</b>.',
        cam: [953, 470, 0.67], boxes: [{ rect: [12, 757, 332, 128], label: 'GL · Market State', at: 2.0, below: false, dx: 80 }] },
      { d: 6, tag: '2 · Agora', titulo: '<em>Agora</em>: o que o preço faz no dia', texto: '"D: dentro da primeira banda." O D é o diário: o preço está dentro da primeira banda, sem esticar.',
        cam: [178, 821, 3.0], boxes: [{ rect: [16, 804, 232, 16] }] },
      { d: 6, tag: '3 · Contexto', titulo: '<em>Contexto</em>: o macro e a extensão', texto: '"Macro: comprador · extensão 0%." O pano de fundo é comprador, mas o movimento do dia ainda não esticou.',
        boxes: [{ rect: [16, 822, 232, 16] }] },
      { d: 6, tag: '4 · Leitura', titulo: '<em>Leitura</em>: a síntese', texto: '"Pausa local dentro da primeira banda." É equilíbrio: o preço gira dentro da banda. Espere os extremos ou a saída dela.',
        boxes: [{ rect: [16, 840, 232, 16] }] },
      { img: '9.png', d: 7, tag: '5 · Quando muda', cls: 'green', titulo: 'Expansão de alta <em>acelerada</em>', texto: 'Agora: expansão acima confirmada. Contexto: macro comprador, extensão 39%. O preço saiu da banda e anda a favor do macro.',
        cam: [496, 631, 3.0], boxes: [{ rect: [335, 595, 215, 18], color: GREEN, label: 'Estado', below: false }] },
      { img: '11.png', d: 7, tag: '6 · Mais forte', cls: 'green', titulo: 'Expansão de alta <em>muito forte</em>', texto: 'A extensão sobe para 48%. O painel não manda comprar: ele diz se o movimento está a favor e o quanto já esticou.',
        cam: [543, 643, 3.0], boxes: [{ rect: [382, 604, 205, 18], color: GREEN, label: 'Estado', below: false }] },
      { d: 7, tag: 'Como usar', titulo: 'O estado define <em>o tipo</em> de trade', cam: [382, 392, 1.4],
        lista: ['Equilíbrio: extremos da banda e volta à média', 'Expansão: a favor, nos retestes', 'Extensão alta: não persiga, proteja o lucro'] }
    ]
  }),
  aula({
    id: 'm02-contexto-a-favor-ou-contra', modulo: 'Módulo 1 · Leitura do estado', aula: 'Aula 2', curto: 'Contexto a favor ou contra',
    titulo: 'Contexto a favor ou contra', objetivo: 'Por que uma queda forte nem sempre é venda, e quando o contexto está do seu lado.',
    proxima: 'Setup de alta', img: '1.png',
    imgs: { '1.png': { reveal: { x0: 740, x1: 1555, y0: 60, y1: 840, pad: 4 }, hides: [{ rect: [1560, 715, 185, 45] }] }, '5.png': {} },
    passos: [
      { d: 7, tag: '1 · O cenário', titulo: 'Uma queda forte. <em>Vender?</em>', texto: 'O preço acumula no topo, perde a acumulação e cai rápido. A tentação é vender o fundo do candle.',
        cam: [1242, 440, 1.25], revela: 1300, rd: 5.5,
        boxes: [{ rect: [980, 108, 170, 122], label: 'Acumulação', at: 2.6, ate: 4.4 }, { rect: [1218, 145, 36, 290], color: RED, label: 'Perde a acumulação', at: 4.6 }] },
      PAUSA('Você venderia <em>aqui</em>?', 'Antes de continuar, responda: qual é o contexto maior?'),
      { d: 7, tag: '2 · O contexto', cls: 'red', titulo: 'Correção <em>contra</em> W/M', texto: 'O modelo marca correção contra o semanal e o mensal, calor 4%: a queda do dia vai contra o contexto maior.',
        revela: 1555, rd: 3.5, mostra: [0], mostraEm: 4.0, boxes: [{ rect: [1626, 720, 112, 34], color: RED, label: 'Contra W/M · calor 4%', at: 4.4, below: false, dx: -60 }] },
      { d: 6, tag: '3 · A decisão', titulo: 'Contra o contexto, <em>espere</em>', texto: 'Sem alinhamento não há trade de qualidade: nem vender o fundo, nem comprar cedo. Ficar de fora também é decisão.',
        cam: [1560, 700, 2.0], spots: [[1300, 640, 260, 150]], boxes: [{ rect: [1626, 720, 112, 34], color: RED, label: 'Contra W/M', at: 0.6, below: false, dx: -60 }] },
      { img: '5.png', d: 7, tag: '4 · Quando alinha', cls: 'green', titulo: 'Alta <em>alinhada</em> D/W/M', texto: 'Em outro dia, dia, semana e mês apontam juntos para cima, calor 19%. Aqui o contexto está a favor.',
        cam: [600, 300, 1.4], boxes: [{ rect: [828, 84, 113, 30], color: GREEN, label: 'Alta alinhada · calor 19%', dx: -40 }] },
      { d: 6, tag: 'A regra', titulo: 'Contexto <em>primeiro</em>', cam: [490, 411, 1.3],
        lista: ['Alinhado (D, W e M juntos): procure o trade a favor', 'Correção contra W/M: espere ou reduza', 'O rótulo está no gráfico: leia antes de entrar'] }
    ]
  }),
  // ---------------------------------------------------------------- Módulo 2 · Estado de alta
  aula({
    id: 'm03-setup-de-alta', modulo: 'Módulo 2 · Estado de alta', aula: 'Aula 3', curto: 'Setup de alta',
    titulo: 'Setup de alta: varredura, valor e rompimento', objetivo: 'Onde atuar depois da varredura, o gatilho, o stop e os alvos.',
    proxima: 'Base, rompimento e alvo com Gamma', img: '5.png',
    imgs: { '5.png': { reveal: { x0: 20, x1: 790, y0: 40, y1: 800, pad: 6 }, hides: [{ rect: [826, 82, 116, 40] }, { rect: [780, 78, 24, 24] }] } },
    passos: [
      { d: 7, tag: '1 · Contexto', titulo: 'A queda cumpre os <em>alvos de baixa</em>', texto: 'O preço desce, varre a mínima e marca W -0,3% e D -0,3%: os alvos de baixa da semana e do dia foram cumpridos.',
        cam: [490, 411, 1.3], revela: 575, rd: 6, boxes: [{ rect: [455, 712, 55, 52], color: RED, label: 'W -0,3% · D -0,3%', at: 5.0 }] },
      PAUSA('Onde você <em>atuaria</em>?', 'Qual seria a região, o gatilho e o stop?'),
      { d: 5, tag: '2 · Região de atuação', titulo: 'A volta para <em>dentro da faixa</em>', texto: 'Depois da varredura, o preço volta para a faixa anterior. Aqui se procura compra, não venda do fundo.',
        cam: [530, 620, 2.0], boxes: [{ rect: [492, 575, 86, 100], label: 'Região de atuação' }] },
      { d: 5, tag: '3 · Gatilho', cls: 'green', titulo: 'Força acima das <em>VWAPs D e W</em>', texto: 'O gatilho é o candle que rompe as VWAPs D e W com força. Entrada no fechamento dele ou no reteste.',
        cam: [590, 380, 1.6], revela: 600, rd: 1.2, boxes: [{ rect: [574, 182, 24, 320], color: GREEN, label: 'Gatilho', at: 1.6 }] },
      { d: 5, tag: '4 · Invalidação', cls: 'red', titulo: 'Stop <em>abaixo da varredura</em>', texto: 'Se o preço voltar abaixo da mínima varrida, a ideia acabou. O stop é definido antes da entrada.',
        cam: [560, 560, 1.4], boxes: [{ rect: [455, 735, 60, 16], color: RED, label: 'Invalidação' }] },
      { d: 5, tag: '5 · Alvos', titulo: 'Os alvos <em>já estavam</em> no gráfico', texto: 'Marcas D +0,3%, W +0,3% e 3M +1,5% logo acima, e o alvo W +0,5% no topo.',
        cam: [650, 300, 1.25], boxes: [{ rect: [560, 198, 48, 105], label: 'D · W · 3M' }, { rect: [900, 16, 56, 16], label: 'Alvo W +0,5%', at: 1.6 }] },
      { d: 6, tag: '6 · Resultado', titulo: 'Reteste, segunda perna e <em>alta alinhada</em>', texto: 'O recuo respeita a faixa de volume, o preço volta às máximas e o modelo confirma: alta alinhada D/W/M, calor 19%.',
        cam: [490, 411, 1.3], revela: 790, rd: 3.5, mostra: [0, 1], mostraEm: 3.9,
        boxes: [{ rect: [645, 385, 42, 44], color: GREEN, label: 'Reteste', at: 1.8, ate: 3.8 }, { rect: [828, 84, 113, 30], color: GREEN, label: 'Alta alinhada D/W/M', at: 4.0, dx: -40 }] },
      { d: 6, tag: 'Resumo', titulo: 'O setup em <em>4 passos</em>',
        lista: ['Alvos de baixa cumpridos e volta ao valor: região', 'Força acima das VWAPs D e W: gatilho', 'Stop abaixo da varredura', 'Alvos D, W e 3M já marcados'] }
    ]
  }),
  aula({
    id: 'm04-base-rompimento-alvo', modulo: 'Módulo 2 · Estado de alta', aula: 'Aula 4', curto: 'Base, rompimento e alvo',
    titulo: 'Base, rompimento e alvo com Gamma', objetivo: 'Comprar na base com confluência ou no rompimento, com stop e alvos do mapa.',
    proxima: 'Expansão: até onde deixar correr', img: '10.png', gamma: true,
    imgs: { '10.png': { reveal: { x0: 20, x1: 820, y0: 0, y1: 1211, pad: 2 }, hides: [{ rect: [1004, 406, 70, 24] }] } },
    passos: [
      { d: 7, tag: '1 · Contexto', titulo: 'Uma base em cima do <em>VAL D</em>', texto: 'O preço lateraliza entre 7.753 e 7.765. Embaixo: VAL D 7.754,50, puts (P+ 2,78K) e um cluster no mesmo preço.',
        cam: [537, 760, 1.19], revela: 640, rd: 6, boxes: [{ rect: [228, 944, 745, 30], label: 'VAL D · P+ · cluster', at: 4.6 }] },
      PAUSA('Comprar <em>na base</em> ou esperar?', 'Onde fica o stop se você comprar aqui?'),
      { d: 5, tag: '2 · Região de atuação', titulo: 'A base com <em>confluência</em>', texto: 'Puts, VAL D e cluster juntos formam o piso. A região de compra é perto de 7.755, com o stop logo abaixo.',
        cam: [600, 950, 1.4], boxes: [{ rect: [228, 944, 745, 30], label: 'Região de atuação' }] },
      { d: 5, tag: '3 · Gatilho', cls: 'green', titulo: 'Rompe o <em>VAH W</em> com força', texto: 'O candle de força atravessa o VAH W 7.768,75 e a faixa de 7.773 a 7.778. É o gatilho de quem esperou.',
        cam: [700, 700, 1.3], revela: 700, rd: 1.5, mostra: [0], boxes: [{ rect: [648, 660, 24, 180], color: GREEN, label: 'Gatilho', at: 1.8 }] },
      { d: 6, tag: '4 · Invalidação', cls: 'red', titulo: 'Stop <em>abaixo da base</em>', texto: 'Comprou na base: stop abaixo de 7.752. Entrou no rompimento: stop se o preço voltar abaixo do VAH W.',
        cam: [600, 880, 1.3], boxes: [{ rect: [228, 996, 560, 12], color: RED, label: 'Abaixo da base', ate: 3.0 }, { rect: [646, 780, 170, 12], color: RED, label: 'Abaixo do VAH W', at: 3.1 }] },
      { d: 6, tag: '5 · Alvos', titulo: 'VAH D, cluster e <em>alvo W +1%</em>', texto: 'Primeiro alvo: VAH D 7.802,75 com o cluster de 7.805. Depois, o alvo W +1% em 7.818.',
        cam: [800, 330, 1.5], revela: 820, rd: 2.0, boxes: [{ rect: [648, 290, 175, 62], label: 'VAH D · cluster 7.805', at: 2.0 }, { rect: [812, 138, 186, 22], label: 'Alvo W +1%', at: 3.4 }] },
      { d: 5, tag: '6 · Resultado', titulo: 'O preço trava no <em>VAH D</em>', texto: 'O preço chega a 7.803, no VAH D e no cluster, e trava ali. O alvo W +1% segue como o próximo do mapa.',
        cam: [740, 420, 1.6] },
      { d: 6, tag: 'Resumo', titulo: 'Base e <em>rompimento</em>',
        lista: ['Base com confluência: região', 'Rompimento do VAH W: gatilho', 'Stop abaixo da base ou do VAH W', 'Alvos: VAH D e W +1%'] }
    ]
  }),
  aula({
    id: 'm05-expansao-ate-onde', modulo: 'Módulo 2 · Estado de alta', aula: 'Aula 5', curto: 'Expansão: até onde correr',
    titulo: 'Expansão: até onde deixar correr', objetivo: 'Realizar nos alvos de volatilidade, mirar o alvo de volume e ler as calls acima.',
    proxima: 'A queda pela estrutura', img: '9.png', gamma: true,
    imgs: { '9.png': { reveal: { x0: 0, x1: 360, y0: 0, y1: 773, pad: 2 }, hides: [{ rect: [330, 568, 332, 128] }, { rect: [655, 63, 60, 24] }] }, '11.png': {}, '12.png': {} },
    passos: [
      { d: 7, tag: '1 · Contexto', cls: 'green', titulo: 'Expansão de alta <em>acelerada</em>', texto: 'O preço sai da banda e o painel confirma a expansão, extensão de 39%. A pergunta agora é onde realizar.',
        cam: [357, 386, 1.4], revela: 360, rd: 5.0, mostra: [0, 1], mostraEm: 5.3, boxes: [{ rect: [331, 569, 330, 125], color: GREEN, label: 'Expansão acelerada · 39%', at: 5.6, below: false }] },
      { d: 6, tag: '2 · Alvos de volatilidade', titulo: 'Primeiro, os alvos <em>D, W e M</em>', texto: 'D +0,3% e W +0,5%, depois D +0,5% e M +1%. São as primeiras regiões para realizar parte da posição.',
        cam: [355, 135, 3.0], boxes: [{ rect: [336, 74, 44, 28], color: GREEN, label: 'M +1% · D +0,5%', below: false }, { rect: [336, 170, 44, 22], color: GREEN, label: 'D +0,3% · W +0,5%' }] },
      { d: 6, tag: '3 · Alvo de volume', titulo: 'Acima, o alvo <em>estrutural de volume</em>', texto: 'A faixa verde em 7.806 é onde está a liquidez. Na expansão forte, é o próximo alvo.',
        cam: [240, 140, 2.0], boxes: [{ rect: [0, 25, 358, 16], label: 'Alvo de volume' }] },
      { img: '11.png', d: 6, tag: '4 · Depois', cls: 'green', titulo: 'O preço <em>chega</em> na liquidez', texto: 'Expansão de alta muito forte, extensão 48%, e o alvo de volume é atingido.',
        cam: [300, 110, 2.4], boxes: [{ rect: [250, 35, 125, 20], color: GREEN, label: 'Alvo de liquidez atingido' }] },
      { img: '12.png', d: 7, tag: '5 · + GL Gamma', titulo: 'Calls no alvo <em>W +1%</em>', texto: 'O GL Gamma mostra calls (C+ 23,51K) em 7.820, no nível do alvo W +1%: a próxima resistência. Embaixo, puts (P+ 9,42K) na base.',
        cam: [313, 260, 1.7], boxes: [{ rect: [214, 97, 128, 18], label: 'C+ 23,51K · W +1%' }, { rect: [214, 386, 310, 16], color: RED, label: 'P+ 9,42K', at: 3.4 }] },
      { d: 6, tag: '6 · Gestão', titulo: 'Realize <em>em partes</em>', texto: 'Parte nos alvos de volatilidade, parte no alvo de volume. O resto só com o stop protegendo o lucro, porque acima há calls fortes.' },
      { d: 6, tag: 'Resumo', titulo: 'Deixar correr <em>com plano</em>',
        lista: ['Expansão confirmada: não venda contra', 'Alvos D, W e M: realizações parciais', 'Alvo de volume: o alvo principal', 'Calls fortes acima: próxima resistência'] }
    ]
  }),
  // ---------------------------------------------------------------- Módulo 3 · Estado de baixa
  aula({
    id: 'm06-queda-pela-estrutura', modulo: 'Módulo 3 · Estado de baixa', aula: 'Aula 6', curto: 'A queda pela estrutura',
    titulo: 'A queda pela estrutura', objetivo: 'Vender o repique na zona, o gatilho no POC M e os alvos nos níveis de baixo.',
    proxima: 'Perdeu o Zero Gamma', img: '3.png',
    imgs: { '3.png': { reveal: { x0: 15, x1: 1515, y0: 60, y1: 860, pad: 2 }, hides: [{ rect: [8, 36, 372, 14], until: 999, color: '#060606' }] } },
    passos: [
      { d: 7, tag: '1 · Contexto', cls: 'red', titulo: 'Abaixo do <em>POC W</em>', texto: 'No MES, desde o início o preço está abaixo do POC W (7.698): o viés da semana é de baixa. A queda leva o preço até 7.638.',
        cam: [755, 450, 0.85], revela: 1030, rd: 6, boxes: [{ rect: [1440, 104, 50, 16], color: RED, label: 'POC W', at: 4.4 }] },
      PAUSA('O repique chegou na zona. <em>Vender?</em>', 'Onde entra, onde fica o stop e qual é o alvo?'),
      { d: 6, tag: '2 · Região de atuação', titulo: 'Repique até a <em>zona</em>', texto: 'O preço sobe até a faixa de 7.660 a 7.664, uma região de atuação da Estrutura de Mercado. É a região de venda.',
        cam: [1000, 340, 2.0], boxes: [{ rect: [930, 318, 160, 32], label: 'Região de atuação' }] },
      { d: 5, tag: '3 · Gatilho', cls: 'red', titulo: 'Perde o <em>POC M</em>', texto: 'O gatilho de venda é a perda do POC M (7.648) depois do repique.',
        cam: [1200, 420, 1.3], revela: 1160, rd: 2.0, boxes: [{ rect: [1095, 395, 60, 50], color: RED, label: 'Gatilho', at: 2.2 }, { rect: [1440, 413, 50, 16], label: 'POC M', at: 0.6 }] },
      { d: 5, tag: '4 · Invalidação', cls: 'red', titulo: 'Stop <em>acima da zona</em>', texto: 'Se o preço voltar acima de 7.665, a venda perde o sentido.',
        cam: [1000, 360, 1.6], boxes: [{ rect: [930, 304, 160, 10], color: RED, label: 'Invalidação' }] },
      { d: 6, tag: '5 · Alvos', titulo: 'VAL M, VAL W e <em>a zona de baixo</em>', texto: 'Os alvos são os níveis abaixo: VAL M 7.635, VAL W 7.629 e a zona de 7.612.',
        cam: [1100, 450, 1.0], revela: 1515, rd: 3.0, boxes: [{ rect: [1440, 494, 50, 16], label: 'VAL M', at: 1.4 }, { rect: [1440, 529, 50, 16], label: 'VAL W', at: 2.4, below: true, dx: -40 }, { rect: [1180, 628, 330, 16], label: 'Zona 7.612', at: 3.6 }] },
      { d: 6, tag: '6 · Resultado', titulo: 'O preço vai a 7.587 e forma o <em>valor do dia</em>', texto: 'No fundo aparece o novo valor do dia (VAH D, POC D e VAL D): a queda perde força e o mercado volta a girar.',
        cam: [1360, 700, 1.6], boxes: [{ rect: [1180, 640, 330, 100], label: 'Valor do dia' }] },
      { d: 6, tag: 'Resumo', titulo: 'Vender <em>a favor</em> da estrutura',
        lista: ['Abaixo do POC W: viés de baixa', 'Repique na zona: região de venda', 'Perda do POC M: gatilho', 'Alvos: VAL M, VAL W e zonas abaixo'] }
    ]
  }),
  aula({
    id: 'm07-perdeu-o-zero-gamma', modulo: 'Módulo 3 · Estado de baixa', aula: 'Aula 7', curto: 'Perdeu o Zero Gamma',
    titulo: 'Perdeu o Zero Gamma', objetivo: 'Vender na rejeição do VAH D, o gatilho no Zero Gamma e o alvo nas puts.',
    proxima: 'Do teto de calls ao piso de puts', img: '8.png', gamma: true,
    imgs: { '8.png': { reveal: { x0: 10, x1: 772, y0: 20, y1: 1085, pad: 2 } } },
    passos: [
      { d: 7, tag: '1 · Contexto', titulo: 'O preço volta até o <em>VAH D</em>', texto: 'Depois de cair até 7.705, o preço sobe e trava no VAH D 7.744,75, sem força para passar.',
        cam: [505, 543, 1.0], revela: 645, rd: 6, boxes: [{ rect: [450, 262, 320, 50], label: 'VAH D 7.744,75', at: 4.8 }] },
      PAUSA('Comprar ou vender <em>aqui</em>?', 'O que muda se o preço perder o Zero Gamma?'),
      { d: 5, tag: '2 · Região de atuação', titulo: 'Venda na <em>rejeição do VAH D</em>', texto: 'O topo travado no VAH D é a região de venda. O Zero Gamma, logo abaixo, decide se a queda acelera.',
        cam: [600, 400, 1.6], boxes: [{ rect: [450, 262, 195, 80], label: 'Região de atuação' }, { rect: [783, 508, 140, 18], label: 'Zero Gamma', at: 2.2 }] },
      { d: 5, tag: '3 · Gatilho', cls: 'red', titulo: 'Perde o <em>Zero Gamma</em>', texto: 'O candle que fecha abaixo do Zero Gamma (7.725) é o gatilho. Abaixo dele, o movimento tende a acelerar.',
        cam: [720, 540, 1.8], revela: 735, rd: 2.0, boxes: [{ rect: [700, 504, 222, 26], color: RED, label: 'Gatilho', at: 2.2 }] },
      { d: 5, tag: '4 · Invalidação', cls: 'red', titulo: 'Stop <em>acima do VAH D</em>', texto: 'Se o preço voltar acima de 7.745, a leitura de venda acabou.',
        cam: [600, 400, 1.4], boxes: [{ rect: [450, 300, 320, 10], color: RED, label: 'Invalidação' }] },
      { d: 6, tag: '5 · Alvos', titulo: 'VAL D, VAL NY e <em>as puts</em>', texto: 'Alvos: VAL D 7.716 e VAL NY 7.714, depois a região das puts (P+ 13,87K), com absorção em 7.678.',
        cam: [600, 720, 1.1], revela: 772, rd: 1.5, boxes: [{ rect: [698, 598, 72, 42], label: 'VAL D · VAL NY', dx: -70 }, { rect: [590, 958, 182, 92], label: 'Região das puts', at: 2.6 }] },
      { d: 5, tag: '6 · Resultado', cls: 'green', titulo: 'Toca as puts e <em>reage</em>', texto: 'O preço chega a 7.682, perto da absorção de 7.678, e volta a 7.699. Hora de realizar.',
        cam: [600, 760, 1.2], boxes: [{ rect: [742, 940, 36, 110], color: GREEN, label: 'Reação', dx: -60 }] },
      { d: 6, tag: 'Resumo', titulo: 'A venda <em>com Gamma</em>',
        lista: ['Topo travado no VAH D: região', 'Perda do Zero Gamma: gatilho', 'Stop acima do VAH D', 'Alvos: VAL D, VAL NY e puts'] }
    ]
  }),
  aula({
    id: 'm08-teto-de-calls-piso-de-puts', modulo: 'Módulo 3 · Estado de baixa', aula: 'Aula 8', curto: 'Do teto de calls ao piso de puts',
    titulo: 'Do teto de calls ao piso de puts', objetivo: 'No 1 minuto: vender no teto, o gatilho no cluster, o alvo nas puts e quando parar.',
    proxima: 'Equilíbrio na banda', img: '7.png', gamma: true,
    imgs: { '7.png': { hides: [{ rect: [8, 29, 168, 18], until: 999, color: '#040404' }, { rect: [468, 29, 506, 18], until: 999, color: '#040404' }, { rect: [812, 1665, 182, 18], color: '#061412' }] } },
    passos: [
      { d: 7, tag: '1 · Contexto', titulo: 'Abertura embaixo das <em>calls</em>', texto: 'O preço abre perto de 7.725, na absorção de 7.726 e no maior nível de calls (C+ 26,33K). Calls fortes acima funcionam como teto.',
        cam: [330, 330, 1.25], boxes: [{ rect: [230, 134, 305, 22], label: 'Absorção · C+ 26,33K', at: 2.0 }, { rect: [12, 140, 90, 120], color: RED, label: 'Abertura', at: 3.8 }] },
      PAUSA('Comprar o rompimento ou <em>vender o teto</em>?', 'Decida antes de continuar.'),
      { d: 5, tag: '2 · Região de atuação', titulo: 'Venda no <em>teto de calls</em>', texto: 'A região de venda é a absorção de 7.726 com o C+ 26,33K. O alvo é o maior nível de puts, lá embaixo.',
        boxes: [{ rect: [8, 128, 527, 34], label: 'Região de atuação' }] },
      { d: 6, tag: '3 · Gatilho', cls: 'red', titulo: 'Perde o <em>cluster de 7.716</em>', texto: 'O preço não sustenta o teto e perde o cluster de 7.716: é o gatilho. Depois, perde também o de 7.706.',
        cam: [330, 520, 0.95], boxes: [{ rect: [230, 389, 190, 14], color: RED, label: 'Cluster 7.716', at: 0.8 }, { rect: [230, 643, 190, 14], color: RED, label: 'Cluster 7.706', at: 3.0 }] },
      { d: 5, tag: '4 · Invalidação', cls: 'red', titulo: 'Stop <em>acima do teto</em>', texto: 'Acima de 7.728, as calls foram rompidas e a venda perde o sentido.',
        cam: [330, 330, 1.25], boxes: [{ rect: [8, 118, 527, 8], color: RED, label: 'Invalidação', below: false }] },
      { d: 6, tag: '5 · Alvo', titulo: 'Alvo nas <em>puts</em>: P+ 28,9K', texto: 'O preço cai mais de 50 pontos até 7.672, no maior nível de puts e no VAL D 7.674,50. Aqui se realiza a venda.',
        cam: [430, 1330, 1.15], boxes: [{ rect: [470, 1404, 340, 22], label: 'Puts · 28,9K' }, { rect: [490, 1380, 40, 125], color: GREEN, label: 'Fundo 7.672', at: 2.6, below: false, dx: -60 }] },
      { d: 6, tag: '6 · Quando parar', cls: 'green', titulo: 'Depois do fundo, o painel <em>vira</em>', texto: 'Às 12:03, o painel de risco marca ofensivo forte, 5 de 5 janelas positivas, e o preço volta ao Zero Gamma. Não insista na venda.',
        cam: [420, 1700, 1.6], mostra: [2], spots: [[30, 1683, 402, 15]] },
      { d: 6, tag: 'Resumo', titulo: 'Teto, gatilho e <em>piso</em>', cam: [540, 930, 0.56],
        lista: ['Calls fortes acima: teto', 'Perda do cluster: gatilho de venda', 'Puts fortes abaixo: alvo', 'Painel virou: realize e não insista'] }
    ]
  }),
  // ---------------------------------------------------------------- Módulo 4 · Equilíbrio
  aula({
    id: 'm09-equilibrio-na-banda', modulo: 'Módulo 4 · Equilíbrio', aula: 'Aula 9', curto: 'Equilíbrio na banda',
    titulo: 'Equilíbrio na banda: operar os extremos', objetivo: 'Onde comprar no equilíbrio, o gatilho, o stop e o alvo na média.',
    proxima: 'Retorno à média com Gamma', img: '6.png',
    imgs: { '6.png': { reveal: { x0: 10, x1: 1690, y0: 40, y1: 900, pad: 2 }, hides: [{ rect: [12, 757, 332, 128] }, { rect: [1684, 84, 82, 238], color: '#040404' }, { rect: [1688, 376, 56, 36], color: '#040404' }, { rect: [1688, 446, 56, 28], color: '#040404' }] } },
    passos: [
      { d: 7, tag: '1 · Contexto', titulo: 'Expansão e depois <em>equilíbrio</em>', texto: 'Três semanas no 30 minutos: alta forte até 7.845, queda e, desde 24/09, o preço gira entre 7.675 e 7.810.',
        cam: [953, 470, 0.67], revela: 1690, rd: 6.4 },
      { d: 6, tag: '2 · O painel', titulo: 'O painel: <em>equilíbrio na banda</em>', texto: 'Dentro da primeira banda, macro comprador, extensão 0%, pausa local. O preço está no meio, sem vantagem.',
        cam: [178, 821, 3.0], mostra: [0], spots: [[12, 757, 332, 128]] },
      PAUSA('No meio da banda: <em>comprar ou vender?</em>', 'Onde estão os extremos que valem um trade?'),
      { d: 6, tag: '3 · Região de atuação', titulo: 'Compra no extremo <em>de baixo</em>', texto: 'Com o macro comprador, a compra fica no extremo de baixo: perto da faixa de volume de 7.670.',
        cam: [1560, 470, 1.6], mostra: [2, 3], boxes: [{ rect: [1490, 588, 196, 18], label: 'Região de compra' }] },
      { d: 5, tag: '4 · Gatilho', cls: 'green', titulo: 'Reação <em>na região</em>', texto: 'O gatilho é a reação: em 01/10 o preço testa a região, deixa pavio e volta para dentro da banda.',
        boxes: [{ rect: [1598, 500, 44, 100], color: GREEN, label: 'Reação', dx: -40 }] },
      { d: 5, tag: '5 · Invalidação', cls: 'red', titulo: 'Stop <em>abaixo da faixa</em>', texto: 'Se o preço fechar abaixo da faixa de volume, o equilíbrio virou queda e a compra acaba.',
        boxes: [{ rect: [1490, 610, 196, 10], color: RED, label: 'Invalidação' }] },
      { d: 6, tag: '6 · Alvos', titulo: 'A <em>média</em> e o alvo D', texto: 'Primeiro alvo: as VWAPs D e W, a média do equilíbrio, perto de 7.740. Depois, o alvo D +0,3% em 7.761.',
        cam: [1600, 400, 1.6], mostra: [1], boxes: [{ rect: [1688, 376, 56, 36], label: 'VWAP D · W', dx: -40 }, { rect: [1684, 302, 82, 16], label: 'Alvo D +0,3%', at: 2.6, below: false, dx: -60 }] },
      { d: 6, tag: 'Resumo', titulo: 'Equilíbrio: <em>os extremos</em>',
        lista: ['O meio da banda não paga', 'Compra no extremo de baixo, com reação', 'Stop abaixo da faixa de volume', 'Alvos: a média e o alvo D'] }
    ]
  }),
  aula({
    id: 'm10-retorno-a-media-gamma', modulo: 'Módulo 4 · Equilíbrio', aula: 'Aula 10', curto: 'Retorno à média com Gamma',
    titulo: 'Retorno à média com Gamma', objetivo: 'Realizar no alvo de liquidez e operar a volta até a confluência das puts.',
    proxima: 'Nível respeitado', img: '13.png', gamma: true,
    imgs: { '13.png': { reveal: { x0: 0, x1: 296, y0: 0, y1: 790, pad: 2 }, hides: [{ rect: [800, 218, 65, 22] }, { rect: [462, 485, 336, 130] }] } },
    passos: [
      { d: 7, tag: '1 · Contexto', titulo: 'A alta chega no <em>alvo de liquidez</em>', texto: 'O preço sobe até a faixa de volume de 7.805, onde também há absorção em 7.804.',
        cam: [430, 330, 1.45], revela: 268, rd: 5.5, boxes: [{ rect: [45, 40, 250, 22], label: 'Liquidez · absorção 7.804', at: 4.6 }] },
      PAUSA('Comprar mais ou <em>realizar</em>?', 'O que o GL Gamma mostra acima e abaixo do preço?'),
      { d: 6, tag: '2 · Região de atuação', titulo: 'Pouca call acima, <em>muita put</em> abaixo', texto: 'Calls fracas (C+ 1,92K e C+ 423) e a maior barra do mapa embaixo, P+ 41,96K em 7.755. O topo na liquidez é região de realizar.',
        cam: [520, 200, 1.4], boxes: [{ rect: [284, 92, 80, 38], label: 'Calls fracas' }, { rect: [284, 280, 476, 16], color: RED, label: 'P+ 41,96K', at: 2.6 }] },
      { d: 5, tag: '3 · Gatilho', cls: 'red', titulo: 'Perde o <em>Zero Gamma</em>', texto: 'O candle de força que perde o Zero Gamma (7.789) tira o preço da expansão. É o gatilho do retorno à média.',
        cam: [200, 160, 2.0], revela: 296, rd: 1.5, mostra: [0], boxes: [{ rect: [45, 116, 250, 16], color: RED, label: 'Zero Gamma 7.789', at: 1.8 }] },
      { d: 5, tag: '4 · Invalidação', cls: 'red', titulo: 'Stop <em>acima da liquidez</em>', texto: 'Acima de 7.810, a liquidez foi rompida e a leitura de volta à média acaba.',
        boxes: [{ rect: [45, 22, 250, 10], color: RED, label: 'Invalidação' }] },
      { d: 6, tag: '5 · Alvo', titulo: 'Alvo na <em>confluência</em>', texto: 'P+ 41,96K, alvo D -0,3% e absorção de 7.754 no mesmo preço. O preço toca a confluência.',
        cam: [300, 300, 1.6], boxes: [{ rect: [45, 276, 412, 22], label: 'Confluência 7.754 · 7.755' }, { rect: [280, 186, 20, 116], color: GREEN, label: 'Toca', at: 2.8, below: false, dx: 60 }] },
      { d: 5, tag: '6 · O painel', titulo: 'O painel volta para <em>equilíbrio</em>', texto: 'Equilíbrio na banda, macro comprador: o retorno à média terminou. Realize na confluência.',
        cam: [630, 549, 3.0], mostra: [1], spots: [[464, 487, 331, 125]] },
      { d: 6, tag: 'Resumo', titulo: 'Volta à média <em>com Gamma</em>', cam: [430, 330, 1.45],
        lista: ['Alvo de liquidez com absorção: realize', 'Calls fracas e puts fortes: o mapa puxa para baixo', 'Perda do Zero Gamma: gatilho', 'Alvo: a confluência das puts'] }
    ]
  }),
  // ---------------------------------------------------------------- Módulo 5 · Níveis e alvos
  aula({
    id: 'm11-nivel-respeitado', modulo: 'Módulo 5 · Níveis e alvos', aula: 'Aula 11', curto: 'Nível respeitado',
    titulo: 'Nível respeitado: defesa e alvo no VAH D', objetivo: 'Comprar a defesa de um nível de puts, com gatilho, stop e alvo no topo do valor.',
    proxima: 'Escada de valor', img: '2.png', gamma: true,
    imgs: { '2.png': { reveal: { x0: 0, x1: 618, y0: 0, y1: 635, pad: 4 }, hides: [{ rect: [645, 18, 100, 38], color: '#040404' }, { rect: [586, 334, 19, 60], color: '#232424' }, { rect: [605, 334, 41, 60], color: '#040404' }] } },
    passos: [
      { d: 7, tag: '1 · Contexto', titulo: 'Valor sendo construído <em>acima do nível</em>', texto: 'No MES, o preço constrói valor entre 7.756 e 7.768, acima do nível de puts P- 858 L3, em 7.759,50.',
        cam: [465, 318, 1.37], revela: 560, rd: 6, boxes: [{ rect: [520, 308, 120, 18], label: 'P- 858 L3 · 7.759,50', at: 4.6 }] },
      PAUSA('O preço volta ao nível. <em>E agora?</em>', 'Onde fica a compra, o stop e o alvo?'),
      { d: 5, tag: '2 · Região de atuação', titulo: 'Compra na <em>defesa do nível</em>', texto: 'O nível de puts em 7.759,50 é a região: o preço testa e deixa pavio embaixo.',
        cam: [560, 320, 2.2], revela: 578, rd: 1.5, boxes: [{ rect: [540, 300, 100, 60], label: 'Região de atuação', at: 1.8 }] },
      { d: 5, tag: '3 · Gatilho', cls: 'green', titulo: 'Força para fora <em>do valor</em>', texto: 'O gatilho é o candle de força que sai do teste e rompe a máxima do valor, em 7.768.',
        cam: [580, 250, 1.8], revela: 592, rd: 1.5, boxes: [{ rect: [584, 150, 22, 170], color: GREEN, label: 'Gatilho', at: 1.8 }] },
      { d: 5, tag: '4 · Invalidação', cls: 'red', titulo: 'Stop <em>abaixo do nível</em>', texto: 'Perder 7.757 significa que a defesa falhou.',
        cam: [560, 320, 2.2], boxes: [{ rect: [520, 356, 130, 10], color: RED, label: 'Invalidação' }] },
      { d: 5, tag: '5 · Alvo', titulo: 'Alvo no <em>VAH D 7.776</em>', texto: 'O VAH D, com o VAH W em 7.775 junto, é o alvo: o topo do valor do dia.',
        cam: [560, 120, 2.0], revela: 618, rd: 2.0, boxes: [{ rect: [548, 22, 72, 30], label: 'VAH D 7.776' }] },
      { d: 6, tag: '6 · Resultado', cls: 'green', titulo: 'O preço vai <em>buscar</em> o VAH D', texto: 'Do teste em 7.758 até 7.775: o nível foi respeitado e o alvo do mapa foi atingido. As setas são a marcação do Giovane.',
        cam: [465, 318, 1.37], mostra: [0, 1, 2] },
      { d: 6, tag: 'Resumo', titulo: 'Defesa <em>de nível</em>',
        lista: ['Valor acima de um nível de puts', 'Teste com pavio: região', 'Força para fora do valor: gatilho', 'Alvo: VAH D, o topo do valor'] }
    ]
  }),
  aula({
    id: 'm12-escada-de-valor', modulo: 'Módulo 5 · Níveis e alvos', aula: 'Aula 12', curto: 'Escada de valor',
    titulo: 'Escada de valor e alvos M e 3M', objetivo: 'Usar os níveis de valor como degraus: região, gatilho, stop e os alvos maiores.',
    proxima: 'Topos descendentes pela estrutura', img: '4.png', gamma: true,
    imgs: { '4.png': { reveal: { x0: 0, x1: 219, y0: 150, y1: 889, pad: 1 } } },
    passos: [
      { d: 7, tag: '1 · Contexto', titulo: 'Do <em>VAL M</em> ao VAH M', texto: 'O preço parte do fundo do valor mensal (VAL M 29.438) e sobe até o topo dele (VAH M 29.946).',
        cam: [353, 445, 1.12], revela: 135, rd: 5.5, boxes: [{ rect: [115, 820, 100, 18], label: 'VAL M', at: 0.8, ate: 3.2 }, { rect: [112, 549, 100, 18], label: 'VAH M', at: 3.6 }] },
      { ...PAUSA('Recuou do VAH M. <em>Onde comprar?</em>', 'Qual é o degrau e qual é o gatilho?'), revela: 152, rd: 1.5 },
      { d: 5, tag: '2 · Região de atuação', titulo: 'O recuo dentro do <em>valor mensal</em>', texto: 'O recuo para no meio do valor do mês, perto de 29.700, sem perder a estrutura. É a região para procurar compra.',
        cam: [130, 640, 2.4], boxes: [{ rect: [95, 660, 60, 50], label: 'Região de atuação', dx: 60 }] },
      { d: 5, tag: '3 · Gatilho', cls: 'green', titulo: 'Rompe o <em>VAH M</em>', texto: 'O gatilho é o rompimento do topo do valor mensal (29.946): o primeiro degrau da escada.',
        cam: [160, 560, 2.4], revela: 168, rd: 1.5, boxes: [{ rect: [150, 535, 30, 45], color: GREEN, label: 'Gatilho', at: 1.8, dx: 60 }] },
      { d: 5, tag: '4 · Invalidação', cls: 'red', titulo: 'Stop <em>abaixo do recuo</em>', texto: 'Se o preço perder a mínima do recuo, a escada não começou.',
        cam: [130, 640, 2.4], boxes: [{ rect: [95, 705, 70, 10], color: RED, label: 'Invalidação', dx: 60 }] },
      { d: 7, tag: '5 · A escada', titulo: 'Cada nível vira <em>degrau</em>', texto: 'VAL W e VAL D (30.170 a 30.195), VAH Q (30.304), VAH W e VAH D (30.548): cada nível rompido vira apoio para o próximo.',
        cam: [180, 420, 1.6], revela: 219, rd: 3.5, boxes: [{ rect: [17, 415, 195, 16], label: 'VAL W · VAL D', at: 1.0, ate: 2.6 }, { rect: [117, 360, 123, 16], label: 'VAH Q', at: 2.7, ate: 4.4 }, { rect: [8, 230, 232, 16], label: 'VAH W · VAH D', at: 4.5 }] },
      { d: 6, tag: '6 · Alvos', titulo: 'Alvos D/W +1%, <em>M +4% e 3M +4,5%</em>', texto: 'O preço chega perto do alvo D/W +1%. Os alvos M +4% e 3M +4,5% ficam no mapa para os próximos dias.',
        cam: [270, 200, 2.0], boxes: [{ rect: [228, 172, 95, 28], label: 'Alvo D/W +1%' }, { rect: [228, 24, 90, 76], label: 'M +4% · 3M +4,5%', at: 2.6 }] },
      { d: 6, tag: 'Resumo', titulo: 'A escada <em>de valor</em>', cam: [353, 445, 1.12],
        lista: ['Valor mensal: do VAL ao VAH', 'Recuo no valor: região', 'Rompimento do VAH M: gatilho', 'Cada nível rompido: novo degrau'] }
    ]
}),
  // ---------------------------------------------------------------- Módulo 6 · Mais estados de alta e baixa (prints 15, 16, 19 e 21)
  aula({
    id: 'm13-topos-descendentes', modulo: 'Módulo 6 · Mais alta e baixa', aula: 'Aula 13', curto: 'Topos descendentes',
    titulo: 'Topos descendentes pela estrutura', objetivo: 'Reconhecer o estado de baixa pelos topos e vender o repique na região de atuação.',
    proxima: 'Queda no 1 minuto: as bandas', img: '16.png',
    imgs: { '16.png': { reveal: { x0: 60, x1: 1655, y0: 85, y1: 962, pad: 2, color: '#000000', gaps: [[128, 151], [270, 294], [306, 317], [330, 334], [358, 365], [431, 442], [491, 505], [604, 633]] } } },
    passos: [
      { d: 7, tag: '1 · Contexto', cls: 'red', titulo: 'Topos cada vez <em>mais baixos</em>', texto: 'De 8 a 10 de setembro no 5 minutos: 7.725, 7.718, 7.692. Cada topo fica abaixo do anterior e o preço respeita as regiões da Estrutura de Mercado.',
        cam: [860, 520, 0.8], revela: 1000, rd: 5.5,
        boxes: [{ rect: [212, 140, 44, 26], color: RED, label: '7.725', at: 1.2, below: false }, { rect: [398, 185, 44, 26], color: RED, label: '7.718', at: 2.5, below: false }, { rect: [768, 328, 50, 26], color: RED, label: '7.692', at: 4.6, below: false }] },
      { d: 6, tag: '2 · O repique', titulo: 'Repique lento até <em>7.661</em>', texto: 'Do fundo de 7.630, o preço sobe devagar até a região de 7.661: a mesma que segurou o preço no dia 9 e foi perdida.',
        cam: [1120, 480, 1.3], revela: 1290, rd: 4, boxes: [{ rect: [1180, 488, 150, 20], label: 'Região 7.661', at: 4.3 }] },
      PAUSA('Topo mais baixo na região. <em>Vender?</em>', 'Onde entra, onde fica o stop e qual é o alvo?'),
      { d: 5, tag: '3 · Região de atuação', titulo: 'Venda no repique, <em>na região</em>', texto: 'O repique para em 7.666, abaixo do topo anterior (7.692), em cima da região de atuação. É a região de venda.',
        cam: [1220, 480, 1.7], boxes: [{ rect: [1238, 462, 95, 46], label: 'Região de atuação' }] },
      { d: 5, tag: '4 · Gatilho', cls: 'red', titulo: 'Perde a <em>base do repique</em>', texto: 'O gatilho é o candle de força que perde a base do repique, perto de 7.645.',
        cam: [1300, 560, 1.4], revela: 1405, rd: 1.5, boxes: [{ rect: [1368, 555, 40, 90], color: RED, label: 'Gatilho', at: 1.8 }] },
      { d: 5, tag: '5 · Invalidação', cls: 'red', titulo: 'Stop <em>acima do repique</em>', texto: 'Acima de 7.667, o topo do repique, a leitura de topos mais baixos acaba.',
        cam: [1220, 480, 1.7], boxes: [{ rect: [1238, 452, 95, 8], color: RED, label: 'Invalidação', below: false }] },
      { d: 6, tag: '6 · Alvos', titulo: 'As regiões <em>de baixo</em>', texto: 'Abaixo: as regiões de 7.641 e 7.637 e depois um vazio até 7.610. O preço atravessa tudo e chega a 7.586.',
        cam: [1250, 620, 1.0], revela: 1655, rd: 3, boxes: [{ rect: [1260, 602, 380, 34], label: 'Regiões 7.641 · 7.637', at: 0.4 }, { rect: [1428, 860, 34, 50], color: GREEN, label: 'Fundo 7.586', at: 3.2, below: false, dx: -70 }] },
      { d: 6, tag: '7 · Resultado', cls: 'green', titulo: 'Nasce uma <em>região nova</em>', texto: 'No fundo, o preço gira entre 7.595 e 7.613: uma região nova. A queda perdeu força: realize e espere o próximo estado.',
        cam: [1480, 780, 1.6], boxes: [{ rect: [1408, 750, 248, 115], label: 'Região nova' }] },
      { d: 6, tag: 'Resumo', titulo: 'Baixa <em>pela estrutura</em>', cam: [860, 520, 0.8],
        lista: ['Topos mais baixos: estado de baixa', 'Repique na região de atuação: venda', 'Perda da base do repique: gatilho', 'Stop acima do repique; alvos nas regiões de baixo'] }
    ]
  }),
  aula({
    id: 'm14-queda-no-1-minuto', modulo: 'Módulo 6 · Mais alta e baixa', aula: 'Aula 14', curto: 'Queda no 1 minuto',
    titulo: 'Queda no 1 minuto: as bandas apontam para baixo', objetivo: 'Vender o repique na banda, com gatilho, stop, alvos e a hora de parar.',
    proxima: 'Do fundo ao alvo', img: '15.png',
    imgs: { '15.png': { reveal: { x0: 0, x1: 752, y0: 78, y1: 1842, pad: 2, color: '#040404', gaps: [[109, 147], [432, 494], [780, 786], [916, 938], [1180, 1202], [1357, 1363], [1448, 1612], [1655, 1667]] },
      hides: [{ rect: [450, 36, 300, 14], until: 999, color: '#1e0d10' }, { rect: [750, 36, 200, 14], until: 999, color: '#040404' }] } },
    passos: [
      { d: 7, tag: '1 · Contexto', cls: 'red', titulo: 'Perdeu o VAH D, <em>bandas para baixo</em>', texto: 'Abertura em 7.727, no VAH D e no VAL W. O preço perde os dois e cai rápido. As bandas pontilhadas vermelhas viram para baixo.',
        cam: [300, 760, 0.8], revela: 330, rd: 5.5, boxes: [{ rect: [0, 105, 750, 45], label: 'VAH D · VAL W', at: 0.4, ate: 3.0 }] },
      PAUSA('O repique chegou na banda. <em>Vender?</em>', 'Onde fica a região, o gatilho e o stop?'),
      { d: 5, tag: '2 · Região de atuação', titulo: 'Repique <em>na banda</em>', texto: 'O repique das 10:40 para em 7.706, encostado na banda pontilhada de baixo. Abaixo das bandas, o repique é região de venda.',
        cam: [300, 700, 1.6], boxes: [{ rect: [238, 608, 90, 72], label: 'Região de atuação' }] },
      { d: 5, tag: '3 · Gatilho', cls: 'red', titulo: 'Perde a <em>linha branca</em>', texto: 'O gatilho é o candle de força que sai do repique e perde a linha branca pontilhada.',
        cam: [330, 880, 1.3], revela: 365, rd: 1.5, boxes: [{ rect: [316, 850, 34, 180], color: RED, label: 'Gatilho', at: 1.8 }] },
      { d: 5, tag: '4 · Invalidação', cls: 'red', titulo: 'Stop <em>acima do repique</em>', texto: 'Acima de 7.708, o topo do repique, a venda perde o sentido.',
        cam: [300, 700, 1.6], boxes: [{ rect: [238, 598, 100, 8], color: RED, label: 'Invalidação', below: false }] },
      { d: 6, tag: '5 · Alvos', titulo: 'VAL NY e <em>VAL D</em>', texto: 'Os alvos são os níveis de baixo: VAL NY 7.678,25 e VAL D 7.674,50, em cima da faixa cinza de volume.',
        cam: [420, 1280, 0.95], revela: 475, rd: 3, boxes: [{ rect: [600, 1352, 150, 16], label: 'VAL NY', at: 0.6, below: false }, { rect: [600, 1446, 150, 16], label: 'VAL D', at: 1.6 }, { rect: [425, 1410, 50, 95], color: GREEN, label: 'Fundo 7.673', at: 3.4, below: false, dx: -80 }] },
      { d: 7, tag: '6 · Quando parar', cls: 'green', titulo: 'O preço volta <em>acima das bandas</em>', texto: 'O preço reage no VAL D e, perto do meio-dia, volta para cima das bandas: o estado de baixa terminou. Realize e não insista.',
        cam: [380, 960, 0.57], revela: 752, rd: 3.2, boxes: [{ rect: [700, 950, 52, 110], color: GREEN, label: 'Volta acima', at: 3.6, dx: -60 }] },
      { d: 6, tag: 'Resumo', titulo: 'Baixa <em>no 1 minuto</em>',
        lista: ['Bandas apontando para baixo: estado de baixa', 'Repique na banda: região de venda', 'Perda da linha branca: gatilho', 'Alvos: VAL NY e VAL D', 'Voltou acima das bandas: pare'] }
    ]
  }),
  aula({
    id: 'm15-do-fundo-ao-alvo', modulo: 'Módulo 6 · Mais alta e baixa', aula: 'Aula 15', curto: 'Do fundo ao alvo',
    titulo: 'Do fundo ao alvo: fundos mais altos', objetivo: 'Comprar o primeiro fundo mais alto depois da varredura e conduzir até o nível de cima.',
    proxima: 'Rompimento do valor no NQ', img: '19.png',
    imgs: { '19.png': { reveal: { x0: 98, x1: 1190, y0: 0, y1: 899, pad: 2, color: '#040404', gaps: [[24, 36]] }, hides: [{ rect: [1196, 10, 160, 30], color: '#040404' }] } },
    passos: [
      { d: 7, tag: '1 · Contexto', titulo: 'Varredura e <em>volta imediata</em>', texto: 'Uma queda forte até 7.576 e a volta rápida para cima de 7.624. Quem vendeu o fundo ficou preso.',
        cam: [300, 560, 1.3], revela: 240, rd: 5, boxes: [{ rect: [62, 770, 42, 95], color: RED, label: 'Fundo 7.576', at: 0.6, ate: 3.2 }, { rect: [110, 642, 140, 14], label: 'Volta acima de 7.624', at: 3.4 }] },
      PAUSA('Comprar <em>já</em>?', 'Onde fica a região de compra e o stop?'),
      { d: 5, tag: '2 · Região de atuação', titulo: 'O primeiro <em>fundo mais alto</em>', texto: 'O recuo para na região de 7.656 e não perde. É o primeiro fundo mais alto: região de compra.',
        cam: [260, 500, 1.8], revela: 256, rd: 1, boxes: [{ rect: [224, 492, 62, 38], label: 'Região de atuação', at: 1.2 }] },
      { d: 5, tag: '3 · Gatilho', cls: 'green', titulo: 'Rompe a <em>lateral</em>', texto: 'O gatilho é o candle de força que rompe a lateral de 7.672 para cima.',
        cam: [290, 450, 1.6], revela: 292, rd: 1.5, boxes: [{ rect: [256, 378, 36, 82], color: GREEN, label: 'Gatilho', at: 1.8 }] },
      { d: 5, tag: '4 · Invalidação', cls: 'red', titulo: 'Stop <em>abaixo da região</em>', texto: 'Perder 7.654, abaixo da região, invalida a compra.',
        cam: [260, 500, 1.8], boxes: [{ rect: [224, 524, 100, 8], color: RED, label: 'Invalidação' }] },
      { d: 7, tag: '5 · A escada', cls: 'green', titulo: 'Fundos <em>mais altos</em>', texto: 'Cada nível rompido vira apoio. No recuo até 7.678, o preço faz outro fundo mais alto: é estado de alta.',
        cam: [719, 450, 0.89], revela: 905, rd: 5, boxes: [{ rect: [640, 165, 62, 30], label: 'Topo 7.738', at: 2.6, below: false }, { rect: [808, 398, 52, 46], color: GREEN, label: 'Fundo mais alto · 7.678', at: 4.4 }] },
      { d: 6, tag: '6 · Alvo', titulo: 'O alvo é <em>o nível de cima</em>', texto: 'O alvo é a linha cinza do topo, perto de 7.772: o nível marcado acima do preço.',
        cam: [1000, 260, 1.3], revela: 1190, rd: 3, boxes: [{ rect: [880, 22, 310, 16], label: 'Alvo · 7.772', at: 0.4 }] },
      { d: 6, tag: '7 · Resultado', cls: 'green', titulo: 'Alvo <em>atingido</em>', texto: 'O preço chega a 7.771, a um tick do nível. A seta é a marcação do Giovane: alvo cumprido, hora de realizar.',
        cam: [1100, 160, 1.6], mostra: [0], boxes: [{ rect: [1118, 30, 74, 50], color: GREEN, label: 'Alvo atingido', at: 1.2 }] },
      { d: 6, tag: 'Resumo', titulo: 'Do fundo <em>ao alvo</em>', cam: [719, 450, 0.89],
        lista: ['Varredura e volta acima do nível: atenção', 'Recuo que segura a região: compra', 'Rompimento da lateral: gatilho', 'Fundos mais altos: estado de alta', 'Alvo: o nível de cima'] }
    ]
  }),
  aula({
    id: 'm16-rompimento-do-valor-nq', modulo: 'Módulo 6 · Mais alta e baixa', aula: 'Aula 16', curto: 'Rompimento do valor no NQ',
    titulo: 'Rompimento do valor no NQ', objetivo: 'A caixa sob os VAH, o piso de puts, o gatilho do rompimento e os alvos de calls, W e M.',
    proxima: 'Com e sem o Estado de Mercado', img: '21.png', gamma: true,
    imgs: { '21.png': { reveal: { x0: 0, x1: 484, y0: 0, y1: 521, pad: 1, color: '#040404', gaps: [[44, 56], [76, 90], [143, 153], [205, 240], [254, 262], [326, 335], [405, 420]] }, hides: [{ rect: [592, 145, 64, 18], color: '#040404' }] } },
    passos: [
      { d: 7, tag: '1 · Contexto', titulo: 'Uma <em>caixa</em> embaixo dos VAH', texto: 'No NQ, o preço sai do valor da semana (VAL W 30.086), sobe e lateraliza numa caixa estreita, logo abaixo do VAH W 30.303 e do VAH D 30.328.',
        cam: [337, 260, 1.9], revela: 466, rd: 5.5, boxes: [{ rect: [338, 205, 142, 36], label: 'VAH W · VAH Q · VAH D', at: 1.0, ate: 3.4 }, { rect: [314, 272, 152, 36], label: 'Caixa', at: 4.8 }] },
      PAUSA('Comprar na caixa ou <em>esperar</em>?', 'O que o GL Gamma mostra acima e abaixo do preço?'),
      { d: 7, tag: '2 · Região de atuação', titulo: 'Piso embaixo, <em>calls</em> em cima', texto: 'Embaixo da caixa: Zero Gamma, GL 9 e puts (P+ 236). Acima: calls (C+ 1,29K) e o MAJOR+. A região é a caixa, com o piso logo abaixo.',
        cam: [380, 250, 2.4], boxes: [{ rect: [504, 300, 86, 18], label: 'Zero Gamma', at: 0.5 }, { rect: [244, 325, 122, 14], label: 'P+ 236', at: 1.8 }, { rect: [244, 142, 122, 14], label: 'C+ 1,29K', at: 3.2, below: false }] },
      { d: 5, tag: '3 · Gatilho', cls: 'green', titulo: 'Rompe a caixa <em>e os VAH</em>', texto: 'O candle de força rompe a caixa e atravessa VAH W, VAH Q e VAH D de uma vez.',
        cam: [380, 250, 2.0], revela: 484, rd: 1.2, boxes: [{ rect: [466, 148, 20, 164], color: GREEN, label: 'Gatilho', at: 1.6, dx: -70 }] },
      { d: 5, tag: '4 · Invalidação', cls: 'red', titulo: 'De volta <em>para a caixa</em>', texto: 'Se o preço voltar para dentro da caixa, abaixo de 30.225, o rompimento falhou.',
        boxes: [{ rect: [314, 306, 168, 8], color: RED, label: 'Invalidação' }] },
      { d: 6, tag: '5 · Alvos', titulo: 'Calls, depois <em>W e M</em>', texto: 'Primeiro alvo: calls e MAJOR+, perto de 30.410. Depois, +1% W (cerca de 30.495) e o alvo M +3% (cerca de 30.530).',
        cam: [420, 150, 2.0], boxes: [{ rect: [468, 140, 84, 20], label: 'Calls · MAJOR+' }, { rect: [478, 74, 92, 22], label: '+1% W', at: 2.0, below: false, dx: 70 }, { rect: [500, 44, 100, 16], label: 'Alvo M +3%', at: 3.4, below: false, dx: -60 }] },
      { d: 5, tag: '6 · Resultado', cls: 'green', titulo: 'Para <em>nas calls</em>', texto: 'O preço chega a 30.404, colado nas calls. Realize uma parte: os alvos W e M continuam no mapa.',
        cam: [337, 260, 1.9], mostra: [0] },
      { d: 6, tag: 'Resumo', titulo: 'Rompimento <em>do valor</em>',
        lista: ['Valor estreito sob os VAH: a caixa', 'Puts e Zero Gamma embaixo: piso', 'Rompimento com força: gatilho', 'Stop: de volta para a caixa', 'Alvos: calls, depois W e M'] }
    ]
  }),
  // ---------------------------------------------------------------- Módulo 7 · Ferramentas e revisão (prints 14, 17, 18 e 20)
  aula({
    id: 'm17-com-e-sem-estado-de-mercado', modulo: 'Módulo 7 · Ferramentas', aula: 'Aula 17', curto: 'Com e sem o Estado de Mercado',
    titulo: 'Com e sem o Estado de Mercado', objetivo: 'O mesmo dia com o indicador desligado e ligado: o que muda na leitura.',
    proxima: 'Abaixo do Zero Gamma', img: '18.png',
    imgs: { '18.png': {}, '17.png': {} },
    passos: [
      { d: 6, tag: '1 · Desligado', titulo: 'O dia <em>sem o indicador</em>', texto: '29/09 no 5 minutos, com o GL Estado de Mercado desligado. Velas cinzas e sem as faixas: onde está a força?',
        cam: [910, 480, 0.71] },
      PAUSA('Às 07:00, você <em>compraria</em>?', 'Sem o estado, a leitura depende só do olho.'),
      { img: '17.png', d: 7, tag: '2 · Ligado', titulo: 'As velas <em>ganham cor</em>', texto: 'Ligado, o Estado de Mercado pinta as velas e desenha as faixas: amarelo na força compradora, laranja na vendedora e cinza nas pausas. As faixas verdes são regiões de volume.',
        cam: [901, 480, 0.71], boxes: [{ rect: [0, 240, 880, 55], label: 'Faixa verde · 7.756 a 7.761', at: 3.0 }] },
      { d: 6, tag: '3 · Gatilho', cls: 'green', titulo: 'Rompe <em>a caixa</em>', texto: 'A caixa da madrugada segura o preço. Às 06:30, velas amarelas rompem o topo da caixa (7.757) com os pontos brancos embaixo: estado de alta.',
        cam: [700, 420, 1.3], boxes: [{ rect: [412, 325, 350, 503], label: 'Caixa da madrugada', ate: 2.6 }, { rect: [818, 290, 40, 150], color: GREEN, label: 'Rompimento', at: 2.8 }] },
      { d: 5, tag: '4 · Alvo', titulo: 'A <em>faixa verde</em> de cima', texto: 'O alvo é a faixa verde de cima. O preço passa por ela e chega a 7.771, onde trava.',
        cam: [850, 260, 1.4], boxes: [{ rect: [880, 262, 220, 30], label: 'Faixa verde' }, { rect: [888, 98, 34, 70], color: GREEN, label: 'Topo 7.771', at: 2.2, below: false, dx: 80 }] },
      { d: 6, tag: '5 · Virada', cls: 'red', titulo: 'As velas <em>ficam laranja</em>', texto: 'Às 09:45, um candle grande desce, as velas ficam laranja e os pontos vermelhos passam a descer por cima do preço: estado de baixa. Não compre contra.',
        cam: [1150, 600, 1.2], boxes: [{ rect: [1024, 300, 26, 215], color: RED, label: 'Virada', at: 0.6 }, { rect: [1160, 620, 230, 260], color: RED, label: 'Pressão vendedora', at: 2.8 }] },
      { d: 6, tag: '6 · Volta', cls: 'green', titulo: 'Amarelo <em>de novo</em>', texto: 'Às 14:00, velas amarelas voltam, o preço cruza a linha vermelha e sobe até 7.747, na faixa verde da direita.',
        cam: [1500, 500, 1.3], boxes: [{ rect: [1380, 540, 62, 160], color: GREEN, label: 'Volta', at: 0.6 }, { rect: [1527, 400, 223, 34], label: 'Faixa verde · 7.747', at: 2.8, below: false }] },
      { d: 6, tag: 'Resumo', titulo: 'O estado <em>no gráfico</em>', cam: [901, 480, 0.71],
        lista: ['Sem o estado: as velas parecem iguais', 'Com o estado: cor das velas e faixas de volume', 'Amarelo e pontos embaixo: a favor da alta', 'Laranja e pontos em cima: a favor da baixa'] }
    ]
  }),
  aula({
    id: 'm18-abaixo-do-zero-gamma', modulo: 'Módulo 7 · Ferramentas', aula: 'Aula 18', curto: 'Abaixo do Zero Gamma',
    titulo: 'Abaixo do Zero Gamma: o regime muda', objetivo: 'Quando o Zero Gamma vira teto, onde vender e onde estão os alvos no mapa.',
    proxima: 'O mapa do swing', img: '20.png', gamma: true,
    imgs: { '20.png': { reveal: { x0: 0, x1: 436, y0: 30, y1: 662, pad: 1, color: '#222222', gaps: [[38, 60], [145, 151], [196, 202], [340, 346], [356, 362], [444, 451], [526, 532]] } } },
    passos: [
      { d: 7, tag: '1 · Contexto', titulo: 'De manhã, <em>acima</em> do Zero Gamma', texto: 'O preço fica entre 7.450 e 7.470, acima do Zero Gamma (7.447) e do MAJOR+ (7.451).',
        cam: [300, 350, 2.0], revela: 95, rd: 4, boxes: [{ rect: [0, 336, 500, 28], label: 'MAJOR+ · Zero Gamma', at: 4.4 }] },
      { d: 7, tag: '2 · Perdeu', cls: 'red', titulo: 'Perde o <em>Zero Gamma</em>', texto: 'Ao meio-dia, o preço perde o Zero Gamma e cai até 7.410. Abaixo dele, em geral, os movimentos ficam maiores e mais rápidos.',
        cam: [300, 400, 1.8], revela: 245, rd: 4, boxes: [{ rect: [92, 352, 34, 76], color: RED, label: 'Perdeu', at: 1.0, ate: 4.0 }, { rect: [132, 440, 28, 72], label: 'Fundo 7.410', at: 4.2 }] },
      PAUSA('Voltou ao Zero Gamma. <em>Comprar ou vender?</em>', 'O que era piso de manhã vira o quê agora?'),
      { d: 6, tag: '3 · Região de atuação', titulo: 'O Zero Gamma <em>vira teto</em>', texto: 'O preço volta à região do Zero Gamma e do MAJOR+ (7.447 a 7.451), passa por cima e não sustenta, duas vezes.',
        cam: [260, 350, 2.2], revela: 312, rd: 2, boxes: [{ rect: [200, 314, 116, 56], label: 'Região de atuação', at: 2.4 }] },
      { d: 5, tag: '4 · Gatilho', cls: 'red', titulo: 'Fecha de novo <em>abaixo</em>', texto: 'O candle que fecha de novo abaixo do Zero Gamma, depois das 14:30, é o gatilho de venda.',
        revela: 332, rd: 1, boxes: [{ rect: [306, 352, 24, 46], color: RED, label: 'Gatilho', at: 1.2 }] },
      { d: 5, tag: '5 · Invalidação', cls: 'red', titulo: 'Stop <em>acima da região</em>', texto: 'Acima de 7.458, a máxima da região, a venda perde o sentido.',
        boxes: [{ rect: [200, 310, 130, 8], color: RED, label: 'Invalidação', below: false }] },
      { d: 6, tag: '6 · Alvos', titulo: 'MAJOR- e as <em>barras negativas</em>', texto: 'Abaixo: o MAJOR- (7.426) e as maiores barras negativas do mapa, de 7.416 a 7.436. O preço chega lá e gira: é onde se realiza.',
        cam: [413, 347, 1.55], revela: 436, rd: 2.5, boxes: [{ rect: [0, 442, 436, 10], label: 'MAJOR- 7.426', at: 0.4 }, { rect: [432, 398, 178, 98], color: RED, label: 'Barras negativas', at: 2.6, below: false }] },
      { d: 6, tag: 'Resumo', titulo: 'O regime <em>de gamma</em>',
        lista: ['Acima do Zero Gamma: o preço tende a ser mais contido', 'Perdeu o Zero Gamma: o movimento acelera', 'Volta ao Zero Gamma por baixo: teto', 'Alvos: MAJOR- e as barras negativas'] }
    ]
  }),
  aula({
    id: 'm19-mapa-do-swing', modulo: 'Módulo 7 · Ferramentas', aula: 'Aula 19', curto: 'O mapa do swing',
    titulo: 'O mapa do swing: três semanas no 30 minutos', objetivo: 'Ler o estado do swing pelos topos e fundos e montar o plano do dia pelos níveis.',
    proxima: null, img: '14.png', gamma: true,
    imgs: { '14.png': { reveal: { x0: 10, x1: 1538, y0: 100, y1: 845, pad: 2, color: '#040404', gaps: [[211, 219], [273, 293], [586, 605], [813, 832]] },
      hides: [{ rect: [200, 30, 140, 12], until: 999, color: '#3e4547' }, { rect: [600, 40, 240, 60], color: '#3e4547' }, { rect: [1052, 88, 78, 14], color: '#3e4547' }] } },
    passos: [
      { d: 7, tag: '1 · Contexto', titulo: 'Equilíbrio e <em>varredura</em>', texto: 'ES no 30 minutos, de 15/09 a 01/10. Primeiro, um equilíbrio entre 7.660 e 7.700 e uma varredura até 7.590 no dia 17.',
        cam: [772, 484, 0.84], revela: 320, rd: 5, boxes: [{ rect: [292, 798, 34, 50], color: RED, label: 'Varredura 7.590', at: 4.6, below: false }] },
      { d: 7, tag: '2 · Alta', cls: 'green', titulo: 'Expansão <em>de alta</em>', texto: 'Da varredura sai uma expansão de alta: o recuo do dia 20 segura em 7.685 e o preço vai até 7.845.',
        revela: 820, rd: 5, mostra: [1], mostraEm: 3.6, boxes: [{ rect: [494, 538, 42, 46], color: GREEN, label: 'Recuo segura', at: 2.0, ate: 4.4 }, { rect: [618, 40, 200, 60], color: GREEN, label: 'Topo 7.845', at: 5.0 }] },
      { d: 6, tag: '3 · Virada', cls: 'red', titulo: 'O estado <em>vira</em>', texto: 'No topo, o painel marca abaixo 47% e o preço cai até 7.718.',
        revela: 930, rd: 2.5, mostra: [2], mostraEm: 0.3, boxes: [{ rect: [1052, 88, 78, 14], color: RED, label: 'Abaixo 47%', at: 0.5 }] },
      { d: 7, tag: '4 · Baixa', cls: 'red', titulo: 'Topos e fundos <em>mais baixos</em>', texto: 'Depois, topos em 7.810 e 7.780 e fundos em 7.718, 7.720 e 7.685: topos e fundos mais baixos, estado de baixa no swing.',
        revela: 1538, rd: 5, boxes: [{ rect: [1038, 150, 54, 30], color: RED, label: '7.810', at: 1.6, below: false }, { rect: [1358, 245, 44, 30], color: RED, label: '7.780', at: 3.4, below: false }, { rect: [1476, 552, 34, 40], color: RED, label: '7.685', at: 5.0 }] },
      PAUSA('O preço voltou a 7.737. <em>E agora?</em>', 'Quais níveis decidem o próximo movimento?'),
      { d: 7, tag: '5 · Os níveis', titulo: 'Onde o mercado <em>decide</em>', texto: 'Logo acima: VAH D 7.736 e VAH M 7.743,50. Mais acima: VAH W 7.767. Abaixo: VAL W 7.715, Zero Gamma perto de 7.703 e VAL M 7.696.',
        cam: [1450, 420, 1.5], boxes: [{ rect: [1470, 355, 68, 32], label: 'VAH M · VAH D', dx: -80 }, { rect: [1470, 280, 68, 14], label: 'VAH W', at: 1.5, below: false, dx: -60 }, { rect: [1470, 443, 68, 14], label: 'VAL W', at: 2.8, dx: -80 }, { rect: [1690, 485, 140, 12], label: 'Zero Gamma', at: 4.0, below: false }, { rect: [1470, 502, 68, 14], label: 'VAL M', at: 5.2, dx: -80 }] },
      { d: 7, tag: '6 · O plano', titulo: 'O plano <em>condicional</em>',
        lista: ['Aceitou acima do VAH M: alvo VAH W 7.767', 'Perdeu o VAL W: alvos Zero Gamma e VAL M', 'No meio: equilíbrio, só nos extremos'] },
      { d: 6, tag: 'Resumo', titulo: 'Do swing <em>ao dia</em>', cam: [772, 484, 0.84],
        lista: ['Leia o swing antes do dia', 'Topos e fundos dizem o estado', 'Os níveis dizem onde decidir', 'O plano diz o que fazer em cada lado'] }
    ]
  })
];
