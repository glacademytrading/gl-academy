// Versões 4:5 (1080x1350) para o feed: mesma câmera dos vídeos 9:16, quadro mais baixo.
const base = [...require('./specs.js'), ...require('./specs-novos.js')];
const pick = id => JSON.parse(JSON.stringify(base.find(s => s.id === id)));

function feed(id, fix = () => {}) {
  const s = pick(id);
  s.id = id + '-4x5'; s.h = 1350; s.ay = 870;
  fix(s);
  // conferência: um quadro no meio de cada legenda
  s.stills = (s.captions || []).map(c => +((c.t0 + c.t1) / 2).toFixed(1)).concat([+(s.end.t0 + 1.5).toFixed(1)]);
  return s;
}

module.exports = [
  // a varredura fica perto do pé do quadro: câmera um pouco mais baixa nesse trecho
  feed('v02-setup-acontecendo', s => { const c = s.scenes[0].cam; c[1].cy = 660; c.splice(2, 0, { t: 5.5, cx: 480, cy: 650, z: 2.0 }); }),
  feed('v01-a-favor-ou-contra'),
  // conteúdo desce 40 px de origem para sair do degradê do topo
  feed('v03-alvos-claros', s => { s.scenes[0].cam.forEach(k => { k.cy -= 40; }); }),
  // rótulo da perda da acumulação vai para baixo da caixa (em cima ficaria colado na legenda)
  feed('v08-nem-toda-queda-e-venda', s => { s.scenes[0].boxes[1].below = true; s.scenes[0].boxes[1].dx = 0; })
];
