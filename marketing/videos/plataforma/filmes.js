// Campanha GL Black Order Flow System: filmes montados com os vídeos de estúdio (Higgsfield) e as telas reais.
// Cada plano: { c: vídeo composto, ate: tempo do corte no filme, ss: início no vídeo, x/y: enquadramento 0..1 }.
// Os módulos citados são os da barra da plataforma (print 35): Terminal de Mercado, Análise Gráfica,
// Order Flow e Execução, Training Lab, Backtest e Quant Lab; mais GL Risk Auto e GL Gamma Black (Sigma Board).
const DISC = 'Conteúdo educacional; não é recomendação de investimento. Trading envolve risco financeiro real e resultado passado não garante resultado futuro. Aprovação em mesa proprietária depende de você e das regras de cada mesa.';
const DISC_G = DISC + ' GL Gamma: assinatura à parte.';
const NOTA = 'Ambiente ilustrativo criado com IA · telas reais da plataforma GL';
const GAMMA = '<div class="sub nota-g">GL Gamma: assinatura à parte</div>';

// posições por formato: tudo na parte de baixo, para não cobrir as telas (o produto); o título fica acima dos módulos
const POS = {
  V: { head: 430, bottom: 230, align: 'c' }, F: { head: 260, bottom: 120, align: 'c' }, Q: { head: 230, bottom: 110, align: 'c' },
  L: { head: 140, bottom: 140, align: 'l', style: 'right:auto;width:1250px' }, W: { head: 140, bottom: 140, align: 'l', style: 'right:auto;width:1400px' }
};
const T = fmt => ({
  head: (t0, t1, head, kick) => ({ t0, t1, bottom: POS[fmt].head, align: POS[fmt].align, style: POS[fmt].style,
    html: (kick ? `<div class="kick">${kick}</div>` : '') + `<div class="head">${head}</div>` }),
  mod: (t0, t1, nome, txt, extra = '') => ({ t0, t1, bottom: POS[fmt].bottom, align: POS[fmt].align, style: POS[fmt].style,
    html: `<div class="mod"><i></i>${nome}</div>` + (txt ? `<div class="sub">${txt}</div>` : '') + extra }),
  sub: (t0, t1, txt) => ({ t0, t1, bottom: POS[fmt].bottom, align: POS[fmt].align, style: POS[fmt].style, html: `<div class="sub">${txt}</div>` }),
  word: (t0, t1, w, tagl) => ({ t0, t1, top: fmt === 'V' ? 1180 : fmt === 'L' ? 640 : 760, align: 'c',
    html: `<div class="word">${w}</div>` + (tagl ? `<div class="tagl">${tagl}</div>` : '') })
});
const filme = (id, fmt, dur, shots, items, end, o = {}) => ({ id, fmt, dur, shots, items, nota: NOTA, end, ...o });
const V = T('V'), L = T('L'), F = T('F'), Q = T('Q');

module.exports = [
  // ── 9:16 ───────────────────────────────────────────────────────────────
  filme('bo01-lancamento', 'V', 27, [
    { c: 'c102', ate: 4.6 }, { c: 'c218', ate: 8.4, ss: 1 }, { c: 'c214', ate: 11.8, ss: 1 },
    { c: 'c104', ate: 15.4, ss: 2 }, { c: 'c206', ate: 19, ss: 2, x: 0.5 }, { c: 'c107', ss: 1 }
  ], [
    V.head(0.3, 4.4, 'Uma plataforma completa para operar com <em>order flow</em>', 'Novo · GL Black'),
    V.mod(4.8, 8.2, 'Análise Gráfica', 'Footprint, fluxo e contexto no mesmo gráfico.'),
    V.mod(8.6, 11.6, 'GL Risk Auto', 'O risco do plano na tela, antes da ordem.'),
    V.mod(12.0, 15.2, 'GL Gamma Black', 'Pré-market e níveis de Gamma no mesmo painel.', GAMMA),
    V.mod(15.6, 18.8, 'Training Lab', 'A mentoria acontece dentro da plataforma.'),
    V.head(19.2, 22.4, 'Do estudo à execução, <em>num só lugar</em>'),
    V.sub(19.6, 22.4, 'Terminal de Mercado · Order Flow e Execução · Backtest e Quant Lab')
  ], { t0: 22.6, tag: 'Conheça o GL Black Order Flow System na call.', disc: DISC_G }),

  filme('bo02-training-lab', 'V', 20, [
    { c: 'c537', ate: 5 }, { c: 'c329', ate: 9, ss: 1 }, { c: 'c538', ate: 12.6, ss: 0.5 }, { c: 'c218', ss: 2 }
  ], [
    V.head(0.3, 4.8, 'A mentoria agora acontece <em>dentro</em> da plataforma', 'Training Lab'),
    V.sub(5.2, 8.8, 'Você estuda no mesmo ambiente em que opera.'),
    V.sub(9.2, 12.4, 'Mentor e aluno olhando o mesmo gráfico.'),
    V.head(12.8, 15.6, 'Menos teoria solta. <em>Mais leitura real.</em>')
  ], { t0: 15.8, tag: 'Training Lab: o estudo guiado dentro do GL Black.', disc: DISC }),

  filme('bo03-risk-auto', 'V', 19, [
    { c: 'c214', ate: 4.6 }, { c: 'c539', ate: 8.4, ss: 1 }, { c: 'c111', ate: 11.8, ss: 1 }, { c: 'c105', ss: 3 }
  ], [
    V.head(0.3, 4.4, 'O limite do plano aparece <em>antes</em> da ordem', 'GL Risk Auto'),
    V.sub(4.8, 8.2, 'Stop, alvo e risco do dia definidos no plano.'),
    V.sub(8.6, 11.6, 'Fora do plano, a plataforma avisa.'),
    V.head(12.0, 14.8, 'Disciplina <em>no sistema</em>, não só na cabeça.')
  ], { t0: 15, tag: 'GL Risk Auto: o risco do plano na tela.', disc: DISC }),

  filme('bo04-pre-market', 'V', 19, [
    { c: 'c541', ate: 4.6, ss: 1 }, { c: 'c104', ate: 8.4, ss: 1 }, { c: 'c540', ate: 11.8, ss: 1 }, { c: 'c109', ss: 2 }
  ], [
    V.head(0.3, 4.4, 'O pré-market começa <em>antes</em> do pregão', 'GL Gamma Black'),
    V.mod(4.8, 8.2, 'Sigma Board', 'Níveis de Gamma e exposição do dia.', GAMMA),
    V.mod(8.6, 11.6, 'Terminal de Mercado', 'Notícias, agenda e contexto macro.'),
    V.head(12.0, 14.8, 'Você chega ao pregão <em>com um mapa</em>.')
  ], { t0: 15, tag: 'Pré-market, Gamma e notícias no mesmo lugar.', disc: DISC_G }),

  filme('bo05-rotina', 'V', 22, [
    { c: 'c541', ate: 4 }, { c: 'c104', ate: 7.6, ss: 2 }, { c: 'c542', ate: 11.2, ss: 3 }, { c: 'c539', ate: 14.6, ss: 4 },
    { c: 'c537', ss: 4 }
  ], [
    V.head(0.3, 3.8, 'Rotina vem <em>antes</em> de resultado', 'Um dia com o GL Black'),
    V.mod(4.2, 7.4, 'Pré-market', 'Gamma, notícias e níveis do dia.', GAMMA),
    V.mod(7.8, 11.0, 'Leitura', 'Fluxo e contexto no gráfico.'),
    V.mod(11.4, 14.4, 'Execução', 'Dentro do risco do plano.'),
    V.mod(14.8, 17.4, 'Revisão', 'Estudo guiado no Training Lab.')
  ], { t0: 17.6, tag: 'Uma rotina. Um sistema.', disc: DISC_G }),

  filme('bo06-modulos', 'V', 17, [
    { c: 'c102', ate: 2.4, ss: 2 }, { c: 'c218', ate: 4.6, ss: 4 }, { c: 'c214', ate: 6.8, ss: 4 }, { c: 'c104', ate: 9, ss: 4 },
    { c: 'c206', ate: 11.2, ss: 5, x: 0.5 }, { c: 'c107', ss: 4 }
  ], [
    V.mod(0.2, 2.3, 'Terminal de Mercado'), V.mod(2.5, 4.5, 'Análise Gráfica'), V.mod(4.7, 6.7, 'Order Flow e Execução'),
    V.mod(6.9, 8.9, 'GL Gamma Black', '', GAMMA), V.mod(9.1, 11.1, 'Training Lab'), V.mod(11.3, 13.2, 'Backtest e Quant Lab'),
    V.head(0.2, 13.2, 'Tudo que o trader de fluxo usa. <em>Num só lugar.</em>')
  ], { t0: 13.4, tag: 'GL Black Order Flow System.', disc: DISC_G }),

  // ── 16:9 ───────────────────────────────────────────────────────────────
  filme('bo10-filme-lancamento', 'L', 56, [
    { c: 'c103', ate: 5.2 }, { c: 'c110', ate: 10.4 }, { c: 'c101', ate: 15, ss: 2 }, { c: 'c216', ate: 19.6, ss: 1 },
    { c: 'c105', ate: 24.2, ss: 1 }, { c: 'c215', ate: 28.8, ss: 1 }, { c: 'c219', ate: 33.4, ss: 1 }, { c: 'c206', ate: 38, ss: 1 },
    { c: 'c223', ate: 42.6, ss: 1 }, { c: 'c108', ate: 47.4, ss: 1 }, { c: 'c220', ss: 1 }
  ], [
    L.word(0.6, 5.0, 'GL BLACK', 'ORDER FLOW SYSTEM'),
    L.head(5.6, 10.2, 'Uma plataforma completa para quem opera com <em>order flow</em>', 'Novo'),
    L.mod(10.8, 14.8, 'Análise Gráfica', 'Candles, footprint, heatmap e fluxo no mesmo gráfico.'),
    L.mod(15.4, 19.4, 'Order Flow e Execução', 'Leitura de agressão e execução sem trocar de tela.'),
    L.mod(20.0, 24.0, 'GL Risk Auto', 'O risco do plano na tela, antes da ordem.'),
    L.mod(24.6, 28.6, 'GL Gamma Black · pré-market', 'Níveis de Gamma, exposição e notícias antes do pregão.', GAMMA),
    L.mod(29.2, 33.2, 'Backtest e Quant Lab', 'Teste a ideia antes de colocar dinheiro nela.'),
    L.mod(33.8, 37.8, 'Training Lab', 'A mentoria acontece dentro da plataforma.'),
    L.mod(38.4, 42.4, 'Terminal de Mercado', 'Agenda, notícias e contexto macro do dia.'),
    L.head(43.0, 51.0, 'Do estudo à execução, <em>no mesmo sistema</em>')
  ], { t0: 51.2, tag: 'Conheça o GL Black Order Flow System na call.', lk: 'LINK NA DESCRIÇÃO', disc: DISC_G }),

  // topo do site: os 3 planos de herói (Seedance), sem texto; o aviso de IA vai na página, abaixo do vídeo
  filme('bo11-site-hero', 'L', 14, [
    { c: 'c301', ate: 4.8 }, { c: 'c302', ate: 9.4 }, { c: 'c303' }
  ], [], null, { wm: false, nota: null, vt: false, vb: false, end: null }),
  filme('bo14-site-hero-21x9', 'W', 14, [
    { c: 'c301', ate: 4.8, y: 0.45 }, { c: 'c302', ate: 9.4, y: 0.4 }, { c: 'c303', y: 0.4 }
  ], [], null, { wm: false, nota: null, vt: false, vb: false, end: null }),

  filme('bo12-anuncio-30', 'L', 30, [
    { c: 'c216', ate: 5 }, { c: 'c105', ate: 10, ss: 1 }, { c: 'c215', ate: 15, ss: 1 }, { c: 'c206', ate: 20, ss: 1 }, { c: 'c110', ss: 2 }
  ], [
    L.head(0.3, 4.8, 'Fluxo, risco e Gamma na <em>mesma tela</em>', 'GL Black'),
    L.mod(5.2, 9.8, 'GL Risk Auto', 'O limite do plano aparece antes da ordem.'),
    L.mod(10.2, 14.8, 'GL Gamma Black', 'Pré-market com níveis de Gamma e notícias.', GAMMA),
    L.mod(15.2, 19.8, 'Training Lab', 'Mentoria dentro da plataforma.'),
    L.head(20.2, 24.6, 'Do estudo à execução, <em>num só lugar</em>')
  ], { t0: 24.8, tag: 'Agende a call e veja a plataforma por dentro.', lk: 'LINK NA DESCRIÇÃO', disc: DISC_G }),

  filme('bo13-training-lab', 'L', 20, [
    { c: 'c206', ate: 6 }, { c: 'c221', ate: 11, ss: 1 }, { c: 'c223', ss: 1 }
  ], [
    L.head(0.3, 5.8, 'A mentoria agora acontece <em>dentro</em> da plataforma', 'Training Lab'),
    L.sub(6.2, 10.8, 'Você estuda no mesmo ambiente em que opera.'),
    L.sub(11.2, 15.4, 'Mentor e aluno olhando o mesmo gráfico.')
  ], { t0: 15.6, tag: 'Training Lab: o estudo guiado dentro do GL Black.', lk: 'LINK NA DESCRIÇÃO', disc: DISC }),

  // ── 4:5 e 1:1 ──────────────────────────────────────────────────────────
  filme('bo20-feed-lancamento', 'F', 16, [
    { c: 'c110', ate: 4 }, { c: 'c216', ate: 8, ss: 1, x: 0.5 }, { c: 'c105', ss: 1, x: 0.5 }
  ], [
    F.head(0.3, 3.8, 'Uma plataforma completa de <em>order flow</em>', 'Novo · GL Black'),
    F.mod(4.2, 7.8, 'Order Flow e Execução', 'Fluxo e execução no mesmo gráfico.'),
    F.mod(8.2, 11.6, 'GL Risk Auto', 'O risco do plano na tela.')
  ], { t0: 11.8, tag: 'Conheça na call.', disc: DISC }),

  filme('bo21-feed-gamma', 'F', 15, [
    { c: 'c215', ate: 4, x: 0.5 }, { c: 'c104', ate: 8, ss: 1, y: 0.4 }, { c: 'c224', ss: 1 }
  ], [
    F.head(0.3, 3.8, 'O pré-market começa <em>antes</em> do pregão', 'GL Gamma Black'),
    F.mod(4.2, 7.8, 'Sigma Board', 'Níveis de Gamma e exposição.', GAMMA),
    F.mod(8.2, 10.6, 'Terminal de Mercado', 'Notícias e agenda do dia.')
  ], { t0: 10.8, tag: 'Pré-market, Gamma e notícias no mesmo lugar.', disc: DISC_G }),

  filme('bo22-feed-training', 'F', 15, [
    { c: 'c206', ate: 5, x: 0.5 }, { c: 'c221', ate: 9, ss: 1 }, { c: 'c223', ss: 1 }
  ], [
    F.head(0.3, 4.8, 'A mentoria <em>dentro</em> da plataforma', 'Training Lab'),
    F.sub(5.2, 10.6, 'Você estuda no mesmo ambiente em que opera.')
  ], { t0: 10.8, tag: 'Training Lab: estudo guiado no GL Black.', disc: DISC }),

  filme('bo30-quadrado', 'Q', 14, [
    { c: 'c113', ate: 5 }, { c: 'c224', ate: 9.4, ss: 1 }, { c: 'c110', ss: 2 }
  ], [
    Q.head(0.3, 4.8, 'Fluxo, risco e Gamma na <em>mesma tela</em>', 'GL Black'),
    Q.mod(5.2, 9.2, 'GL Gamma Black', '', GAMMA)
  ], { t0: 9.6, tag: 'GL Black Order Flow System.', disc: DISC_G })
];
