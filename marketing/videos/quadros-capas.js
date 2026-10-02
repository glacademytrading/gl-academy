// Extrai o quadro de fundo de cada capa de Reels: o vídeo limpo (src) no segundo srcT, de specs-carrosseis.js.
//   node quadros-capas.js           -> só as capas que ainda não têm quadro em out/frames/
//   node quadros-capas.js --todas   -> refaz todos os quadros
// Depois: SPECS=./specs-carrosseis.js node slides.js capas-reels
const { FF } = require('./ambiente.js');
const { execFileSync } = require('child_process');
const path = require('path');
const fs = require('fs');
const capas = require('./specs-carrosseis.js').filter(s => s.group === 'capas-reels');
const dir = path.join(__dirname, 'out', 'frames');
fs.mkdirSync(dir, { recursive: true });
for (const c of capas) {
  const out = path.join(dir, c.id + '.jpg');
  if (fs.existsSync(out) && !process.argv.includes('--todas')) continue;
  execFileSync(FF, ['-nostdin', '-y', '-loglevel', 'error', '-ss', String(c.srcT), '-i', path.join(__dirname, 'out', c.src + '.mp4'), '-frames:v', '1', '-q:v', '2', out]);
  console.log('quadro', c.id, 'de', c.src, 'em', c.srcT + ' s');
}
