// A expansão de 05 e 06/10/2026 no ES (NinjaTrader), com os prints 35 a 38:
//   38 · 05/10, 5 minutos: a alta da tarde até 7847,5 e, logo depois, o painel de risco "Ofensivo extremo" com delta
//        perdendo e a leitura "divergência entre risco e fluxo". O preço recua até a Major+ 7840.
//   37 · 06/10, 15 minutos, 7871,25: o topo de 05/10 logo abaixo do VAH Q e do VAH W (7848), o lateral até a madrugada,
//        o rompimento dos 7848 e do Zero Gamma e o Estado de Mercado "Expansão de alta acelerada" (extensão 40%).
//   36 · 06/10, 15 minutos, 7879: "Expansão de alta muito forte" (extensão 47%).
//   35 · 06/10, 5 minutos, 7884: extensão 58%; o painel de risco "Defensivo moderado" e a mesma leitura de divergência.
// x01 a x03 em 9:16, x04 em 16:9 para o YouTube, versões 4:5 e um coringa limpo. Os rótulos internos do cabeçalho
// (nomes e versões dos indicadores) ficam escondidos pelo INTERNOS de stage.html. Coordenadas em pixels de cada print.
const V = { w: 1080, h: 1920, ay: 1120 };
const L = { w: 1920, h: 1080, ay: 540 };
const GREEN = '#4fe3a8', RED = '#ff6b6b';
const DISC = 'Exemplo educacional em replay; resultado passado não garante resultado futuro. GL Gamma: assinatura à parte. Trading envolve risco financeiro real; não é recomendação de investimento.';
const DISC_ALVOS = 'Exemplo educacional em replay; resultado passado não garante resultado futuro. Alvos são projeções do modelo, não promessa de resultado. GL Gamma: assinatura à parte. Trading envolve risco financeiro real.';

// retângulos [x, y, largura, altura] em pixels do print
const P = {
  // 37 (1441x932)
  t37Topo: [240, 354, 32, 72], t37Nivel: [240, 348, 734, 12], t37NivelCurto: [240, 348, 420, 12], t37VahQW: [826, 342, 148, 16],
  t37Lateral: [298, 432, 356, 72], t37Rompe: [846, 158, 130, 200], t37ZG: [1210, 335, 146, 18],
  t37MSTit: [1038, 740, 188, 20], t37Ext: [1096, 780, 160, 17],
  // 36 (1401x959)
  t36Preco: [1345, 109, 56, 17], t36Ext: [1062, 805, 160, 17],
  // 35 (1070x1919)
  t35MSTit: [358, 154, 198, 20], t35Ext: [416, 195, 166, 15], t35Preco: [1003, 504, 63, 18], t35Major: [836, 341, 140, 16],
  t35Faixa: [560, 316, 260, 40], t35Alvos: [928, 210, 62, 34], t35Sobe: [924, 351, 70, 161], t35Desce: [924, 513, 70, 180],
  t35RR: [25, 1556, 159, 13], t35Leit: [25, 1602, 337, 12],
  // 38 (1070x1919)
  t38Topo: [632, 262, 34, 104], t38Queda: [662, 276, 50, 314], t38Major: [812, 572, 150, 16],
  t38RR: [26, 1556, 224, 13], t38Delta: [82, 1586, 77, 12], t38Leit: [26, 1602, 336, 12]
};

const cam = (...ks) => ks.map(([t, cx, cy, z]) => ({ t, cx, cy, z }));
// 16:9: ponto (x, y) do print no centro da área do print (x = 1310 na tela), com a legenda na coluna da esquerda
const D = (t, x, y, z) => ({ t, cx: +(x - 350 / z).toFixed(1), cy: y, z });
const box = (rect, t0, t1, label, o = {}) => ({ rect, t0, t1, ...(label ? { label } : {}), ...o });
const cap = (t0, t1, text, kick) => ({ t0, t1, text, ...(kick ? { kick } : {}) });
const END = (t0, tag, disc, o = {}) => ({ t0, tag, disc, ...o });
// "GL Gamma: assinatura à parte" na tela enquanto um nível de Gamma está destacado
const PILULA = 'display:inline-block;background:rgba(5,5,5,.74);border:1px solid rgba(216,174,85,.45);border-radius:999px;padding:10px 20px';
const nota = (t0, t1) => ({ t0, t1, top: 1786, rise: 0, html: `<div class="small" style="font-size:26px;${PILULA}">GL Gamma: assinatura à parte</div>` });
const notaL = (t0, t1) => ({ t0, t1, top: 918, rise: 0, style: 'left:90px;right:auto;width:600px;padding:0;text-align:left',
  html: `<div class="small" style="font-size:24px;${PILULA}">GL Gamma: assinatura à parte</div>` });

// cenas em sequência: cada cena fica por baixo da seguinte até a troca terminar
function seq(list, dur) {
  return list.map((s, i) => {
    const out = { ...s };
    if (list[i + 1]) out.t1 = list[i + 1].t0 + 0.8; else { out.t1 = dur; out.last = true; }
    return out;
  });
}
const video = (id, dur, scenes, captions, end, o = {}) => {
  const stills = captions.map(c => +((c.t0 + c.t1) / 2).toFixed(1)).concat([+(end.t0 + 1.8).toFixed(1)]);
  return { id, ...V, dur, scenes: seq(scenes, dur), captions, end, stills, ...o };
};

// x01 · Do lateral à expansão: 37 se constrói na tela (o topo de 05/10, o nível, o lateral e o rompimento), 36 e 35
const x01 = video('x01-do-lateral-a-expansao', 34.9, [
  { t0: 0, img: '37.png',
    cam: cam([0, 290, 450, 1.9], [3.3, 300, 445, 1.96], [4.1, 590, 430, 1.0], [6.6, 590, 440, 1.0], [7.4, 520, 470, 1.25],
      [10.0, 520, 470, 1.25], [10.8, 1000, 330, 1.1], [14.0, 1000, 330, 1.12], [14.8, 1200, 780, 2.6], [17.4, 1200, 780, 2.66]),
    reveal: { x0: 282, x1: 975, y0: 22, y1: 892, pad: 2, color: '#040404',
      keys: [{ t: 0, x: 282 }, { t: 6.9, x: 282 }, { t: 9.2, x: 650 }, { t: 10.4, x: 650 }, { t: 12.6, x: 975 }],
      furos: [[826, 342, 148, 16], [906, 586, 68, 14], [908, 804, 66, 14]] },
    boxes: [box(P.t37Topo, 0.6, 3.3, '7847,5'), box(P.t37Nivel, 4.2, 6.6, 'VAH Q e VAH W · 7848'),
      box(P.t37Lateral, 9.0, 10.0, 'Lateral', { below: true }),
      box(P.t37Rompe, 12.2, 14.0, 'Rompimento', { color: GREEN }), box(P.t37ZG, 12.6, 14.0, 'Zero Gamma', { below: true, dx: -60 }),
      box(P.t37MSTit, 15.0, 17.4, 'Estado de Mercado'), box(P.t37Ext, 15.8, 17.4, 'Extensão 40%', { below: true })] },
  { t0: 17.4, img: '36.png', cam: cam([17.4, 1100, 200, 1.5], [18.6, 1100, 210, 1.55], [19.3, 1166, 795, 2.6], [21.4, 1166, 795, 2.66]),
    boxes: [box(P.t36Preco, 17.8, 19.0, '7879', { below: true, dx: -40 }), box(P.t36Ext, 19.6, 21.4, 'Extensão 47%', { below: true })] },
  { t0: 21.0, img: '35.png', cam: cam([21.0, 520, 190, 2.6], [24.0, 520, 190, 2.66]),
    boxes: [box(P.t35MSTit, 21.5, 24.4, null), box(P.t35Ext, 22.0, 24.4, 'Extensão 58%', { below: true })] },
  { t0: 24.4, img: '35.png', cam: cam([24.4, 195, 1585, 2.8], [31.4, 195, 1588, 2.86]),
    boxes: [box(P.t35RR, 24.9, 27.8, 'Painel de risco', { color: RED }), box(P.t35Leit, 28.2, 31.2, 'Leitura', { below: true })] }
], [
  cap(0.2, 3.3, '05/10: o preço parou em <em>7847,5</em>', 'ES · 05 e 06/10'),
  cap(3.5, 6.6, 'Logo abaixo do <em>VAH Q e VAH W</em>, em 7848'),
  cap(6.8, 10.0, 'Depois, <em>lateral</em> até a madrugada'),
  cap(10.2, 14.0, '06/10: rompe os <em>7848</em> e passa o <em>Zero Gamma</em>'),
  cap(14.2, 17.4, 'Estado de Mercado: <em>expansão de alta acelerada</em>'),
  cap(17.6, 21.0, '7879: <em>expansão muito forte</em>, extensão de 47%'),
  cap(21.2, 24.4, '7884: extensão de <em>58%</em>. Hora de comprar?'),
  cap(24.6, 27.8, 'O painel de risco: <em class="red">defensivo moderado</em>'),
  cap(28.0, 31.2, 'Leitura: <em>reduzir convicção</em> e esperar alinhamento')
], END(31.4, 'Força não é entrada. Leia o estado e o risco.', DISC), { texts: [nota(12.6, 14.0), nota(24.6, 31.2)] });

// x02 · Força não é entrada: 35, o estado forte, o espaço curto até a primeira barreira, o stop maior e o painel de risco
const x02 = video('x02-forca-nao-e-entrada', 27.3, [
  { t0: 0, img: '35.png',
    cam: cam([0, 520, 190, 2.6], [3.2, 520, 190, 2.66], [4.0, 880, 430, 1.4], [10.0, 880, 440, 1.42], [10.8, 880, 560, 1.4],
      [13.4, 880, 560, 1.42], [14.2, 880, 520, 1.2], [17.0, 880, 520, 1.22]),
    boxes: [box(P.t35MSTit, 0.5, 3.2, 'Estado de Mercado'),
      box(P.t35Major, 4.2, 6.6, 'Major+ 7892,5', { below: true }), box(P.t35Faixa, 4.8, 6.6, 'Faixa de volume', { pad: 4 }),
      box(P.t35Sobe, 7.0, 10.0, '8,5 pontos', { pad: 4 }),
      box(P.t35Desce, 11.0, 13.4, '9,5 pontos', { color: RED, below: true, pad: 4 }),
      box(P.t35Sobe, 14.4, 17.0, 'Espaço', { pad: 4 }), box(P.t35Desce, 14.4, 17.0, 'Risco', { color: RED, below: true, pad: 4 })] },
  { t0: 16.8, img: '35.png', cam: cam([16.8, 195, 1585, 2.8], [23.8, 195, 1588, 2.86]),
    boxes: [box(P.t35RR, 17.3, 20.2, 'Painel de risco', { color: RED }), box(P.t35Leit, 20.6, 23.6, 'Leitura', { below: true })] }
], [
  cap(0.2, 3.2, 'Expansão de alta <em>muito forte</em>. Comprar aqui?', 'ES · 06/10'),
  cap(3.4, 6.6, 'Logo acima: <em>Major+ 7892,5</em> e a faixa de volume'),
  cap(6.8, 10.0, 'Do preço até lá: <em>8,5 pontos</em>'),
  cap(10.2, 13.4, 'Um stop abaixo do VAH NY: <em class="red">9,5 pontos</em>'),
  cap(13.6, 16.8, 'A primeira barreira está <em>mais perto que o stop</em>'),
  cap(17.0, 20.2, 'E o painel de risco: <em class="red">defensivo moderado</em>'),
  cap(20.4, 23.6, 'Leitura: <em>divergência</em>. Reduzir convicção e esperar')
], END(23.8, 'Força não é entrada. Espere o alinhamento.', DISC, { brand: 'GL GAMMA' }), { texts: [nota(3.6, 6.6), nota(17.0, 23.6)] });

// x03 · Ofensivo extremo, e o painel pediu cautela: 38 (a alta, o painel, o recuo) e 37 (o lateral abaixo dos 7848)
const x03 = video('x03-ofensivo-e-cautela', 23.7, [
  { t0: 0, img: '38.png', cam: cam([0, 520, 640, 0.92], [3.0, 530, 630, 0.96]),
    boxes: [box(P.t38Topo, 1.0, 3.0, '7847,5')] },
  { t0: 3.0, img: '38.png', cam: cam([3.0, 190, 1585, 2.9], [13.2, 190, 1590, 2.98]),
    boxes: [box(P.t38RR, 3.6, 6.4, 'Painel de risco', { color: GREEN }), box(P.t38Delta, 7.0, 9.8, 'Delta perdendo', { color: RED, below: true }),
      box(P.t38Leit, 10.4, 13.2, 'Leitura', { below: true })] },
  { t0: 13.2, img: '38.png', cam: cam([13.2, 700, 470, 1.5], [16.8, 700, 480, 1.55]),
    boxes: [box(P.t38Queda, 13.8, 16.6, '7,75 pontos', { color: RED, pad: 4 }), box(P.t38Major, 14.6, 16.6, 'Major+ 7840', { below: true, dx: -60 })] },
  { t0: 16.8, img: '37.png', cam: cam([16.8, 430, 470, 1.3], [20.2, 440, 470, 1.34]),
    boxes: [box(P.t37NivelCurto, 17.4, 20.0, 'VAH Q e VAH W · 7848'), box(P.t37Lateral, 17.8, 20.0, 'Lateral', { below: true })] }
], [
  cap(0.2, 3.0, 'Alta forte à tarde: até <em>7847,5</em>', 'ES · 05/10'),
  cap(3.2, 6.4, 'Logo depois, o painel de risco: <em class="green">ofensivo extremo</em>'),
  cap(6.6, 9.8, 'Mas o fluxo discorda: <em class="red">delta perdendo</em>'),
  cap(10.0, 13.2, 'Leitura: <em>divergência</em>. Reduzir convicção'),
  cap(13.4, 16.6, 'O preço devolve quase <em>8 pontos</em>, até a Major+ 7840'),
  cap(16.8, 20.0, 'E anda de lado até a madrugada, <em>abaixo dos 7848</em>')
], END(20.2, 'O painel avisa. A decisão é sua.', DISC, { brand: 'GL GAMMA' }), { texts: [nota(3.2, 13.2), nota(14.6, 16.6)] });

// x04 · 16:9 para o YouTube: os dois dias em sequência (38, 37, 36 e 35), com a legenda na coluna da esquerda
const COL = { noGrad: true, capBox: { width: '600px' }, shade: 'linear-gradient(90deg, rgba(5,5,5,.94) 0%, rgba(5,5,5,.86) 30%, rgba(5,5,5,0) 40%)' };
const x04 = (() => {
  const scenes = seq([
    { t0: 0, img: '38.png', cam: [D(0, 520, 900, 0.56), D(1.6, 520, 900, 0.58), D(2.6, 620, 520, 1.15), D(4.2, 620, 520, 1.18)],
      boxes: [box(P.t38Topo, 2.8, 3.8, '7847,5')] },
    { t0: 3.8, img: '38.png', cam: [D(3.8, 190, 1585, 2.6), D(14.8, 190, 1590, 2.7)],
      boxes: [box(P.t38RR, 4.4, 7.4, 'Painel de risco', { color: GREEN }), box(P.t38Delta, 7.9, 11.0, 'Delta perdendo', { color: RED, below: true }),
        box(P.t38Leit, 11.5, 14.6, 'Leitura', { below: true })] },
    { t0: 14.6, img: '37.png', cam: [D(14.6, 520, 460, 1.15), D(18.2, 520, 465, 1.18), D(19.0, 520, 470, 1.2), D(21.8, 520, 470, 1.22),
      D(22.6, 1000, 300, 1.25), D(25.4, 1000, 300, 1.27), D(26.2, 1200, 780, 2.2), D(29.4, 1200, 780, 2.25)],
      boxes: [box(P.t37Nivel, 15.2, 18.2, 'VAH Q e VAH W · 7848'), box(P.t37Lateral, 18.8, 21.8, 'Lateral', { below: true }),
        box(P.t37Rompe, 22.9, 25.4, 'Rompimento', { color: GREEN }), box(P.t37ZG, 23.4, 25.4, 'Zero Gamma', { below: true }),
        box(P.t37MSTit, 26.6, 29.2, 'Estado de Mercado'), box(P.t37Ext, 27.4, 29.2, 'Extensão 40%', { below: true })] },
    { t0: 29.2, img: '36.png', cam: [D(29.2, 1000, 260, 1.4), D(30.4, 1000, 265, 1.42), D(31.2, 1166, 800, 2.2), D(33.2, 1166, 800, 2.25)],
      boxes: [box(P.t36Preco, 29.6, 30.8, '7879', { below: true }), box(P.t36Ext, 31.4, 32.8, 'Extensão 47%', { below: true })] },
    { t0: 33.0, img: '35.png', cam: [D(33.0, 520, 190, 2.2), D(36.4, 520, 190, 2.25), D(37.2, 880, 430, 1.1), D(40.6, 880, 430, 1.12)],
      boxes: [box(P.t35Ext, 33.6, 36.6, 'Extensão 58%', { below: true }), box(P.t35Major, 37.4, 40.2, 'Major+ 7892,5', { below: true }),
        box(P.t35Faixa, 37.8, 40.2, 'Faixa de volume', { pad: 4 }), box(P.t35Alvos, 38.4, 40.2, 'Alvos D e W')] },
    { t0: 40.4, img: '35.png', cam: [D(40.4, 190, 1585, 2.6), D(47.6, 190, 1590, 2.66), D(48.6, 540, 960, 0.56), D(51.4, 540, 960, 0.58)],
      boxes: [box(P.t35RR, 41.0, 44.0, 'Painel de risco', { color: RED }), box(P.t35Leit, 44.5, 47.6, 'Leitura', { below: true })] }
  ], 55);
  const captions = [
    cap(0.2, 3.6, '05/10: alta forte à tarde, até <em>7847,5</em>', 'ES · 05 e 06/10'),
    cap(4.0, 7.4, 'Logo depois, o painel de risco: <em class="green">ofensivo extremo</em>'),
    cap(7.6, 11.0, 'Mas com <em class="red">delta perdendo</em>: risco e fluxo discordam'),
    cap(11.2, 14.6, 'Leitura do painel: <em>reduzir convicção</em> e esperar alinhamento'),
    cap(14.8, 18.2, 'O topo parou logo abaixo do <em>VAH Q e VAH W</em> (7848)'),
    cap(18.4, 21.8, 'Depois, <em>lateral</em> até a madrugada'),
    cap(22.0, 25.4, '06/10: rompe os <em>7848</em> e passa o <em>Zero Gamma</em>'),
    cap(25.6, 29.0, 'Estado de Mercado: <em>expansão de alta acelerada</em>'),
    cap(29.4, 32.8, '7879: <em>expansão muito forte</em>, extensão de 47%'),
    cap(33.2, 36.6, '7884: extensão de <em>58%</em>'),
    cap(36.8, 40.2, 'Acima: Major+ 7892,5, a faixa de volume e os <em>alvos</em>'),
    cap(40.6, 44.0, 'Agora o painel de risco diz <em class="red">defensivo moderado</em>'),
    cap(44.2, 47.6, 'A mesma leitura de 05/10: <em>divergência</em>'),
    cap(47.8, 51.2, 'Força não é entrada: <em>leia o estado, meça o risco</em>')
  ];
  const end = END(51.4, 'Estado de mercado, Gamma e risco no mesmo gráfico.', DISC_ALVOS, { sub: 'LINK NA DESCRIÇÃO' });
  return { id: 'x04-dois-dias-de-es-16x9', ...L, ...COL, dur: 55, scenes, captions, end,
    texts: [notaL(4.0, 14.6), notaL(22.8, 25.4), notaL(36.8, 47.6)],
    stills: captions.map(c => +((c.t0 + c.t1) / 2).toFixed(1)).concat([53.2]) };
})();

// 4:5 para o feed: mesma história, quadro mais baixo (a nota de Gamma desce junto)
function feed(spec) {
  const s = JSON.parse(JSON.stringify(spec));
  s.id = spec.id + '-4x5'; s.h = 1350; s.ay = 830;
  s.scenes.forEach(sc => sc.cam.forEach(k => { k.z = +(k.z * 0.9).toFixed(3); }));
  (s.texts || []).forEach(x => { if (x.top > 1350) x.top -= 520; });
  return s;
}
// coringa limpo: o mesmo movimento sem legenda, caixas, notas e cartela, para cobrir a fala do Giovane
function limpo(spec, id) {
  const s = JSON.parse(JSON.stringify(spec));
  s.id = id; s.captions = []; s.texts = []; delete s.end; s.dur = +(spec.end.t0 + 0.4).toFixed(1);
  s.scenes.forEach(sc => { sc.boxes = []; });
  s.scenes[s.scenes.length - 1].t1 = s.dur;
  s.stills = [1.5, +(s.dur / 2).toFixed(1), +(s.dur - 1).toFixed(1)];
  return s;
}

module.exports = [x01, x02, x03, x04, ...[x01, x02, x03].map(feed), limpo(x01, 'c17-expansao-limpo')];
