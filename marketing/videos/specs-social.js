// Série "Operacional na prática" para Reels e Shorts (9:16): as aulas da Mentoria GL no formato vertical.
// Mesmos pontos do gráfico, gatilhos e textos das aulas (specs-mentoria.js). O gráfico fica em cima e a explicação
// num painel no meio da tela, fora das áreas que o Instagram e o YouTube cobrem com os botões e a legenda.
// O vídeo abre com o gancho já sobre o gráfico (sem cartela), e o primeiro quadro serve de capa.
// A ordem é a de postagem: começa pelos ganchos mais fortes e alterna alta, baixa, equilíbrio e Gamma.
const { RAW } = require('./specs-mentoria.js');

const V = { w: 1080, h: 1920, ay: 575 };
const K = 0.8;            // zoom do vertical em relação ao 16:9: a mesma largura de gráfico visível, quase a mesma altura
const GANCHO = 2.6, FIM = 3.4;
const PAINEL = 'left:84px;right:170px;text-align:left;padding:0';
const DISC = 'Exemplo educacional em replay, não é recomendação de investimento. Trading envolve risco financeiro real.';

const ORDEM = ['m02', 'm03', 'm06', 'm01', 'm07', 'm09', 'm17', 'm13', 'm04', 'm14', 'm11', 'm15', 'm08', 'm05', 'm10', 'm16', 'm18', 'm12', 'm19'];
const GANCHOS = {
  m01: 'O painel que lê o mercado em português',
  m02: 'Queda forte. Você venderia?',
  m03: 'Varreu o fundo. Onde comprar?',
  m04: 'Comprar na base ou no rompimento?',
  m05: 'Até onde deixar a alta correr?',
  m06: 'Repique na zona: hora de vender?',
  m07: 'O que muda quando o preço perde o Zero Gamma',
  m08: 'Do teto de calls ao piso de puts',
  m09: 'No meio da banda não tem trade',
  m10: 'Do alvo de liquidez de volta à média',
  m11: 'O nível que segurou o preço',
  m12: 'Cada nível rompido vira degrau',
  m13: 'Topos cada vez mais baixos: e agora?',
  m14: 'Queda no 1 minuto: onde vender o repique?',
  m15: 'Do fundo varrido até o alvo',
  m16: 'A caixa que rompeu no NQ',
  m17: 'O mesmo gráfico com e sem o Estado de Mercado',
  m18: 'Abaixo do Zero Gamma, o regime muda',
  m19: 'Três semanas de mercado em um mapa'
};

const foco = (t, [x, y, z]) => ({ t, cx: x, cy: y, z: +(z * K).toFixed(3) });
const semTag = s => s.replace(/<[^>]+>/g, '');

function episodio(o, n, prox) {
  const texts = [
    { t0: -1, t1: 999, top: 0, rise: 0, in: 0.01, style: 'left:0;right:0;padding:0', html: '<div class="vs-bg"></div>' },
    { t0: -1, t1: GANCHO, top: 1030, rise: 0, in: 0.01, style: PAINEL,
      html: `<div class="vs-k">Operacional na prática · Ep. ${n}</div><div class="vs-hook">${GANCHOS[o.id.slice(0, 3)]}</div><div class="vs-sub">${o.objetivo}</div>` }
  ];
  const cenas = [];
  let t = GANCHO, atual = null, ultimoCam = null;
  for (const p of o.passos) {
    const img = p.img || (atual ? atual.img : o.img);
    if (!atual || atual.img !== img) {
      atual = { img, t0: cenas.length ? t - 0.2 : 0, cam: [], keys: [], boxes: [], spots: [], hides: [], cfg: o.imgs[img] || {} };
      if (cenas.length) cenas[cenas.length - 1].t1 = t + 0.2;
      cenas.push(atual);
      atual.x = atual.cfg.reveal ? atual.cfg.reveal.x0 : null;
      if (atual.cfg.reveal) atual.keys.push({ t: Math.max(GANCHO - 0.2, atual.t0), x: atual.x });
      (atual.cfg.hides || []).forEach(h => atual.hides.push(h));
    }
    const C = atual;
    const cam = p.cam || C.ultimo || ultimoCam;
    ultimoCam = cam;
    if (!C.cam.length) C.cam.push(foco(C.t0, cam));
    else { C.cam.push(foco(t, C.ultimo)); C.cam.push(foco(t + 0.6, cam)); }
    C.ultimo = cam;
    if (p.revela != null && C.cfg.reveal) {
      const r0 = t + (p.revelaEm == null ? 0.3 : p.revelaEm), r1 = r0 + (p.rd || 2);
      C.keys.push({ t: r0, x: C.x }); C.keys.push({ t: r1, x: p.revela }); C.x = p.revela;
    }
    (p.boxes || []).forEach(b => C.boxes.push({ below: true, ...b, t0: t + (b.at == null ? 0.6 : b.at), t1: t + (b.ate == null ? p.d - 0.1 : b.ate) }));
    (p.spots || []).forEach(r => C.spots.push({ rect: r, t0: t + 0.5, t1: t + p.d - 0.1, pad: 12 }));
    (p.mostra || []).forEach(i => { C.hides[i] = { ...C.hides[i], until: t + (p.mostraEm || 0.4) }; });
    // a pausa da aula vira a pergunta para os comentários
    const tag = p.tag === 'Pause o vídeo' ? 'Responda nos comentários' : p.tag;
    texts.push({ t0: t + 0.1, t1: t + p.d - 0.05, top: 1078, rise: 18, style: PAINEL,
      html: `<div class="vs"><div class="ms-step ${p.cls || ''}">${tag}</div><div class="ms-title">${p.titulo}</div>` +
        (p.texto ? `<div class="ms-body">${p.texto}</div>` : '') +
        (p.lista ? `<ul class="ms-list">${p.lista.map(i => `<li>${i}</li>`).join('')}</ul>` : '') + '</div>' });
    t += p.d;
  }
  texts.splice(2, 0, { t0: GANCHO - 0.3, t1: t + 0.2, top: 1020, rise: 0, style: PAINEL, html: `<div class="vs"><div class="ms-head">Operacional na prática · Ep. ${n}</div></div>` });
  // o painel sai junto com o gráfico
  texts[0].t1 = t + 0.2;
  // os passos descem um pouco para dar lugar ao cabeçalho
  texts.slice(3).forEach(x => { x.top = 1066; });
  const dur = +(t + FIM).toFixed(2);
  cenas[cenas.length - 1].t1 = dur; cenas[cenas.length - 1].last = true;
  const scenes = cenas.map(C => {
    const s = { t0: C.t0, t1: C.t1, img: C.img, cam: C.cam, boxes: C.boxes, spots: C.spots, hides: C.hides.map(h => ({ until: 999, ...h })) };
    if (C.last) s.last = true;
    if (C.cfg.reveal) s.reveal = { ...C.cfg.reveal, keys: C.keys };
    return s;
  });
  const passosT = []; let u = GANCHO; o.passos.forEach(p => { passosT.push(+(u + p.d / 2).toFixed(1)); u += p.d; });
  const resumo = (o.passos.filter(p => p.lista).pop() || { lista: [] }).lista.map(semTag);
  return {
    id: `op${String(n).padStart(2, '0')}-${o.id.slice(4)}`, ...V, dur, noGrad: true, scenes, texts,
    meta: { ep: n, aula: o.aula, mentoria: o.id, gancho: GANCHOS[o.id.slice(0, 3)], titulo: semTag(o.titulo), curto: o.curto, objetivo: o.objetivo,
      gamma: !!o.gamma, pausa: o.passos.some(p => p.tag === 'Pause o vídeo'), resumo, proxima: prox ? prox.curto : null },
    end: { t0: t, brand: 'GL ACADEMY', tag: prox ? `Próximo episódio: ${prox.curto}` : 'Siga para mais aulas do operacional',
      cta: 'Call 1x1 gratuita no link da bio', sub: 'Salve para estudar', disc: DISC + (o.gamma ? ' GL Gamma: assinatura à parte.' : '') },
    stills: [0.4, ...passosT, +(t + 1.5).toFixed(1)]
  };
}

// Capa de cada episódio (para subir no Reels e no Shorts): o gráfico inteiro, no enquadramento mais aberto da aula,
// com o gancho no painel. Sai pelo stills.js: SPECS=./specs-social.js node stills.js capa-op01-...
function capa(ep) {
  const o = porId[ep.meta.mentoria.slice(0, 3)], img = o.img;
  const cams = o.passos.filter(p => p.cam && (p.img || img) === img).map(p => p.cam);
  const [x, y, z] = cams.reduce((a, b) => (b[2] < a[2] ? b : a));
  return { id: 'capa-' + ep.id, ...V, dur: 1, noGrad: true,
    scenes: [{ t0: 0, t1: 1, last: true, img, cam: [foco(0, [x, y, z])], hides: (o.imgs[img] && o.imgs[img].hides || []).map(h => ({ until: 999, ...h })) }],
    texts: [ep.texts[0], { ...ep.texts[1], t1: 999, top: 1110 }], stills: [0.5], meta: ep.meta };
}

const porId = Object.fromEntries(RAW.map(o => [o.id.slice(0, 3), o]));
const EPISODIOS = ORDEM.map((k, i) => episodio(porId[k], i + 1, porId[ORDEM[i + 1]]));
module.exports = [...EPISODIOS, ...EPISODIOS.map(capa)];
