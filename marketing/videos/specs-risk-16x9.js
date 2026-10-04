// GL Risk Auto em 16:9 para anúncios do YouTube: bumpers de 6 s (não puláveis), 15 s e 30 s, e coringas limpos
// para editar o vídeo longo do Giovane. Layout dos anúncios: a legenda numa coluna à esquerda, escurecida, e o print
// à direita (centro em x = 1310), para a legenda nunca cobrir o painel ou as ordens. Coordenadas em risk-prints.js.
const { hides, R, DISC, DISC2, DISC_MESA } = require('./risk-prints.js');

const L = { w: 1920, h: 1080, ay: 540 };
const GREEN = '#4fe3a8', RED = '#ff6b6b';
const COL = { noGrad: true, capBox: { width: '600px' }, shade: 'linear-gradient(90deg, rgba(5,5,5,.94) 0%, rgba(5,5,5,.86) 30%, rgba(5,5,5,0) 40%)' };
const END = (t0, tag, disc, o = {}) => ({ t0, tag, disc, brand: 'GL RISK AUTO', sub: 'GL ACADEMY', ...o });
// ponto (x, y) do print no centro da área do print (x = 1310 na tela)
const D = (t, x, y, z) => ({ t, cx: +(x - 350 / z).toFixed(1), cy: y, z });
const box = (rect, t0, t1, label, o = {}) => ({ rect, t0, t1, ...(label ? { label } : {}), ...o });
const cap = (t0, t1, text, kick) => ({ t0, t1, text, ...(kick ? { kick } : {}) });

function seq(list, dur) {
  return list.map((s, i) => {
    const out = { ...s, hides: [...hides(s.img), ...(s.hides || [])] };
    if (list[i + 1]) out.t1 = list[i + 1].t0 + 0.8; else { out.t1 = dur; out.last = true; }
    return out;
  });
}
const anuncio = (id, dur, scenes, captions, end, stills) => ({ id, ...L, ...COL, dur, scenes: seq(scenes, dur), captions, end, stills });

// cenas que se repetem
const caixa = (t0, t1, label = 'Bloqueado') => ({ t0, img: '26.png', cam: [D(t0, 176, 1398, 3.4), D(t1, 176, 1398, 3.55)],
  boxes: [box(R.p26Teto, t0 + 0.5, t1 - 0.1, label, { color: RED, below: true })] });
const pronto = (t0, t1) => ({ t0, img: '25.png', cam: [D(t0, 67, 140, 3.5), D(t1, 67, 140, 3.65)],
  boxes: [box(R.p25Total, t0 + 0.4, t1 - 0.1, 'Dentro do teto', { color: GREEN, below: true }),
    box(R.p25Box, t0 + 0.8, t1 - 0.1, 'Plano pronto', { color: GREEN, below: true })] });

const bumpers = [
  anuncio('yt-b1-bloqueado', 6, [caixa(0, 4.2)],
    [cap(0.2, 4.1, 'Se não cabe no teto, <em class="red">não entra.</em>', 'GL Risk Auto')],
    END(4.2, 'Gestão de risco automática no NinjaTrader.', DISC), [2, 5.2]),
  anuncio('yt-b2-risco-antes', 6, [
    { t0: 0, img: '29.png', cam: [D(0, 650, 560, 1.9), D(4.2, 650, 570, 2.0)],
      boxes: [box(R.p29Stop, 0.5, 4.1, 'Stop: US$250', { color: RED, below: true, dx: -40 }), box(R.p29R1, 1.6, 4.1, null, { color: RED })] }],
    [cap(0.2, 4.1, 'O risco medido <em>antes do clique.</em>', 'GL Risk Auto')],
    END(4.2, 'Gestão de risco automática no NinjaTrader.', DISC), [2.5, 5.2]),
  anuncio('yt-b3-sinal-verde', 6, [
    { t0: 0, img: '31.png', cam: [D(0, 122, 200, 2.0), D(4.2, 122, 196, 2.1)],
      boxes: [box(R.p31Box, 0.5, 4.1, 'Sinal verde', { color: GREEN, below: true })] }],
    [cap(0.2, 4.1, 'RR favorável: <em class="green">avalie realizar.</em>', 'GL Risk Auto')],
    END(4.2, 'O painel avisa. A decisão é sua.', DISC2), [2.5, 5.2]),
  anuncio('yt-b4-sistema-completo', 6, [
    { t0: 0, img: '34.png', cam: [{ t: 0, cx: 226, cy: 299, z: 1.15 }, { t: 4.2, cx: 230, cy: 299, z: 1.2 }],
      boxes: [box(R.p34Painel, 1.0, 4.1, 'GL Risk Auto', { below: true })] }],
    [cap(0.2, 4.1, 'Contexto, risco e execução <em>na mesma tela.</em>', 'GL Academy')],
    END(4.2, 'O sistema GL completo, com o GL Risk Auto.', DISC2, { brand: 'GL ACADEMY', sub: 'GL RISK AUTO' }), [2.5, 5.2])
];

const yt15 = [
  anuncio('yt-15-bloqueado', 15, [
    caixa(0, 4.6),
    { t0: 4.6, img: '26.png', cam: [D(4.6, 700, 640, 1.35), D(8.8, 700, 650, 1.42)],
      boxes: [box(R.p26Stop, 5.0, 8.7, 'Stop: US$387,50', { color: RED, dx: -60 }), box(R.p26Entrada, 5.6, 8.7, 'Entrada', { below: true, dx: -40 })] },
    pronto(8.8, 12.0)
  ], [
    cap(0.2, 2.4, 'Este trade <em class="red">não passou</em>', 'GL Risk Auto'),
    cap(2.5, 4.5, 'Risco de US$387,50. Teto da conta: <em>US$285,71</em>'),
    cap(4.8, 8.7, 'O stop ficou longe demais: <em>a entrada é barrada</em>'),
    cap(9.0, 11.9, 'Dentro do teto: <em class="green">plano pronto</em>. O START confirma')
  ], END(12.0, 'Se não cabe no teto, não entra.', DISC), [1.5, 3.5, 6.5, 10.5, 13.5]),
  anuncio('yt-15-mesa-proprietaria', 15, [
    { t0: 0, img: '27.png', cam: [D(0, 122, 215, 2.4), D(4.6, 122, 215, 2.5)],
      boxes: [box(R.p27Dia, 1.0, 4.5, 'Limite do dia', { below: true }), box(R.p27Teto, 2.6, 4.5, 'Teto por trade', { color: GREEN, below: true })] },
    caixa(4.6, 8.8),
    pronto(8.8, 12.0)
  ], [
    cap(0.2, 2.4, 'Na mesa, <em>quebrar a regra</em> custa a conta', 'Mesa proprietária'),
    cap(2.5, 4.5, 'Limite do dia e teto por trade <em>na tela</em>'),
    cap(4.8, 6.7, 'Plano acima do teto? <em class="red">Não passa.</em>'),
    cap(6.8, 8.7, 'Nem quando a vontade de <em>recuperar</em> fala mais alto'),
    cap(9.0, 11.9, 'Dentro da regra: <em class="green">plano pronto</em>')
  ], END(12.0, 'As regras da mesa na tela, antes do clique.', DISC_MESA), [1.5, 3.5, 5.8, 7.8, 10.5, 13.5])
];

const yt30 = anuncio('yt-30-trade-completo', 30.3, [
  { t0: 0, img: '34.png', cam: [{ t: 0, cx: 226, cy: 299, z: 1.15 }, { t: 3.6, cx: 230, cy: 299, z: 1.2 }],
    boxes: [box(R.p34Painel, 1.0, 3.5, 'GL Risk Auto', { below: true })] },
  { t0: 3.6, img: '27.png', cam: [D(3.6, 720, 480, 1.25), D(8.0, 760, 500, 1.35)],
    boxes: [box(R.p27Topos[0], 4.2, 6.2, '7.810', { color: RED }), box(R.p27Topos[1], 4.6, 6.2, '7.780', { color: RED }),
      box(R.p27Topos[2], 5.0, 6.2, '7.768', { color: RED, below: true }), box(R.p27Valor, 6.3, 7.9, 'Região de valor', { below: true })] },
  { t0: 8.0, img: '28.png', cam: [D(8.0, 720, 640, 1.8), D(12.5, 740, 630, 2.0)],
    boxes: [box(R.p28Vah, 8.5, 10.4, 'VAH D e bloco vermelho', { color: RED, dx: -40 }), box(R.p28Bolha, 10.5, 12.4, 'Compra na resistência', { below: true, dx: -60 })] },
  { t0: 12.5, img: '29.png', cam: [D(12.5, 660, 650, 1.4), D(17.5, 670, 660, 1.45)],
    boxes: [box(R.p29Stop, 13.0, 17.4, 'Stop: US$250', { color: RED, below: true, dx: -40 }), box(R.p29Alvo, 14.6, 17.4, 'Alvo 5R', { color: GREEN, below: true, dx: -20 })] },
  { t0: 17.5, img: '30.png', cam: [D(17.5, 122, 260, 2.6), D(21.5, 122, 262, 2.7)],
    boxes: [box(R.p30Risco, 17.9, 21.4, 'Dentro do teto', { color: GREEN, below: true })] },
  { t0: 21.5, img: '33.png', cam: [D(21.5, 600, 480, 1.4), D(24.5, 610, 490, 1.45)],
    boxes: [box(R.p33Pos, 21.9, 24.4, '+19,25 pontos', { color: GREEN }), box(R.p33Lmt, 22.3, 24.4, 'Alvo', { color: GREEN, below: true })] },
  { t0: 24.5, img: '31.png', cam: [D(24.5, 122, 200, 2.0), D(27.0, 122, 200, 2.1)],
    boxes: [box(R.p31Box, 24.9, 26.9, 'Sinal verde', { color: GREEN, below: true })] }
], [
  cap(0.2, 3.5, 'Um trade com o risco <em>medido antes do clique</em>', 'GL Risk Auto'),
  cap(3.8, 7.9, '1 · Contexto: <em>topos mais baixos</em> no 30 minutos'),
  cap(8.2, 12.4, '2 · VAH D e bloco vermelho: <em>comprados na resistência</em>'),
  cap(12.7, 17.4, '3 · Risco de US$250 no stop, alvo em <em>5R</em> na VAL D'),
  cap(17.7, 21.4, '4 · Cabe no teto: <em>entrada autorizada</em>'),
  cap(21.7, 24.4, 'O preço vai até perto da VAL D: <em>+19,25 pontos</em>'),
  cap(24.7, 26.9, '5 · RR favorável: <em class="green">avalie realizar</em>')
], END(27.0, 'Do contexto à saída, com o risco medido antes do clique.', DISC2), [1.8, 5.5, 10, 15, 19.5, 23, 25.8, 28.5]);

// Coringas limpos 16:9: o mesmo movimento do anúncio de 30 s, centralizado, sem legenda, caixas e cartela
function limpo16(spec, id) {
  const s = JSON.parse(JSON.stringify(spec));
  s.id = id; s.captions = []; delete s.end; delete s.capBox; delete s.shade;
  s.scenes.forEach(sc => { sc.boxes = []; sc.cam.forEach(k => { k.cx = +(k.cx + 350 / k.z).toFixed(1); }); });
  s.dur = 27.4; s.scenes[s.scenes.length - 1].t1 = s.dur;
  s.stills = [2, 6, 10, 15, 19.5, 23, 26];
  return s;
}
const limpos = [
  limpo16(yt30, 'yl01-trade-completo-16x9-limpo'),
  { id: 'yl02-sistema-completo-16x9-limpo', ...L, dur: 14, stills: [2, 7, 12],
    scenes: [{ t0: 0, t1: 14, last: true, img: '34.png', hides: hides('34.png'),
      cam: [{ t: 0, cx: 531, cy: 299, z: 1.81 }, { t: 6, cx: 470, cy: 299, z: 2.1 }, { t: 14, cx: 600, cy: 299, z: 2.1 }] }] }
];

module.exports = [...bumpers, ...yt15, yt30, ...limpos];
