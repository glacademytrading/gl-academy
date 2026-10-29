// Monta os filmes da plataforma: corta os vídeos de estúdio já compostos (compor.py), junta com fusões
// e põe por cima a camada de texto (camada.html), quadro a quadro no Chromium.
// Uso: COMP=<pasta dos compostos> OUT=<pasta de saída> node montar.js [id ...]   (roteiros em filmes.js)
const { FF, chromium, LAUNCH } = require('../ambiente.js');
const { spawn, spawnSync } = require('child_process');
const path = require('path'), fs = require('fs');
const FILMES = require('./filmes.js');
const COMP = process.env.COMP, OUT = process.env.OUT || path.join(__dirname, 'out');
const FPS = 24, XF = 0.5;
const FMT = { V: [1080, 1920], L: [1920, 1080], F: [1080, 1350], Q: [1080, 1080], W: [2560, 1080] };

// proporção do vídeo de origem (largura / altura)
const PROP = {};
function prop(c) {
  if (!PROP[c]) {
    const r = spawnSync(FF, ['-i', path.join(COMP, c + '.mp4')], { encoding: 'utf8' });
    const m = /, (\d{3,4})x(\d{3,4})/.exec(r.stderr); PROP[c] = m ? +m[1] / +m[2] : 16 / 9;
  }
  return PROP[c];
}

// base: cada plano vai do corte anterior até o seu corte; o último vai até o fim do filme.
// Quando a proporção do vídeo é muito diferente da do filme (16:9 num 9:16), o plano entra inteiro na largura,
// sobre uma cópia dele mesmo ampliada, desfocada e escurecida (fit); com crop: true ele é recortado.
function base(f, W, H, file) {
  const args = ['-y', '-loglevel', 'error'], fil = [];
  const cuts = f.shots.map(s => s.ate);
  f.shots.forEach((s, i) => {
    const ini = i ? cuts[i - 1] : 0, fim = i < f.shots.length - 1 ? s.ate : f.dur;
    const d = fim - ini + (i ? XF / 2 : 0) + (i < f.shots.length - 1 ? XF / 2 : 0);
    args.push('-ss', String(s.ss || 0), '-t', String(d + 1), '-i', path.join(COMP, s.c + '.mp4'));
    const fx = s.x == null ? 0.5 : s.x, fy = s.y == null ? 0.5 : s.y;
    const fim2 = `setsar=1,format=yuv420p,tpad=stop_mode=clone:stop_duration=3,trim=duration=${d.toFixed(3)},setpts=PTS-STARTPTS,fps=${FPS},settb=1/${FPS}[s${i}]`;
    const r = prop(s.c) / (W / H), fit = !s.crop && (r > 1.4 || r < 1 / 1.4);
    if (!fit) {
      fil.push(`[${i}:v]fps=${FPS},scale=${W}:${H}:force_original_aspect_ratio=increase,` +
        `crop=${W}:${H}:(in_w-${W})*${fx}:(in_h-${H})*${fy},` + fim2);
    } else {
      const py = s.py == null ? (W < H ? 0.3 : 0.5) : s.py;   // altura do plano no quadro (0 em cima, 1 embaixo)
      const z = s.z || (W < H ? 1.45 : 1.15);                  // o plano entra um pouco mais largo que o quadro
      fil.push(`[${i}:v]fps=${FPS},split[a${i}][b${i}]`,
        `[a${i}]scale=${Math.round(W / 4)}:${Math.round(H / 4)}:force_original_aspect_ratio=increase,crop=${Math.round(W / 4)}:${Math.round(H / 4)},` +
        `boxblur=10:2,eq=brightness=0.02:saturation=1.25,scale=${W}:${H}[g${i}]`,
        `[b${i}]scale=${Math.round(W * z / 2) * 2}:-2,crop=min(iw\\,${W}):ih[f${i}]`,
        `[g${i}][f${i}]overlay=(W-w)/2:(H-h)*${py},` + fim2);
    }
  });
  let last = 's0';
  for (let i = 1; i < f.shots.length; i++) {
    const off = (cuts[i - 1] - XF / 2).toFixed(3);
    fil.push(`[${last}][s${i}]xfade=transition=fade:duration=${XF}:offset=${off}[x${i}]`); last = 'x' + i;
  }
  args.push('-filter_complex', fil.join(';'), '-map', `[${last}]`, '-t', String(f.dur),
    '-c:v', 'libx264', '-crf', '14', '-preset', 'veryfast', '-pix_fmt', 'yuv420p', file);
  const r = spawnSync(FF, args, { stdio: 'inherit' });
  if (r.status) throw new Error('base falhou: ' + f.id);
}

async function um(browser, f) {
  const [W, H] = FMT[f.fmt];
  const tmp = path.join(OUT, '.' + f.id + '-base.mp4'), file = path.join(OUT, f.id + '.mp4');
  base(f, W, H, tmp);
  const page = await browser.newPage({ viewport: { width: W, height: H } });
  await page.goto('file://' + path.join(__dirname, 'camada.html'));
  await page.evaluate(s => init(s), { w: W, h: H, ...f });
  await page.evaluate(() => document.fonts.ready);
  const ff = spawn(FF, ['-y', '-loglevel', 'error', '-i', tmp, '-f', 'image2pipe', '-framerate', String(FPS), '-i', '-',
    '-filter_complex', '[0:v][1:v]overlay=0:0:format=auto,format=yuv420p', '-c:v', 'libx264', '-crf', '19', '-preset', 'medium',
    '-movflags', '+faststart', '-r', String(FPS), file]);
  ff.stderr.on('data', d => process.stderr.write(d));
  const done = new Promise(r => ff.on('close', r));
  const n = Math.round(f.dur * FPS);
  for (let i = 0; i < n; i++) {
    await page.evaluate(async t => await render(t), i / FPS);
    const buf = await page.screenshot({ type: 'png', omitBackground: true });
    if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
  }
  ff.stdin.end(); await done; await page.close(); fs.unlinkSync(tmp);
  // quadros de conferência
  fs.mkdirSync(path.join(OUT, 'check'), { recursive: true });
  const ts = (f.items || []).map(x => (x.t0 + (x.t1 == null ? x.t0 + 2 : x.t1)) / 2).concat(f.end ? [f.end.t0 + 1.5] : []);
  ts.forEach((t, k) => spawnSync(FF, ['-y', '-loglevel', 'error', '-ss', t.toFixed(2), '-i', file, '-frames:v', '1', '-q:v', '4',
    '-vf', `scale=-2:${Math.min(H, 720)}`, path.join(OUT, 'check', `${f.id}-${k}.jpg`)]));
  console.log('ok', f.id, n, 'quadros');
}

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const want = process.argv.slice(2);
  const browser = await chromium().launch(LAUNCH);
  for (const f of FILMES.filter(f => !want.length || want.includes(f.id))) await um(browser, f);
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
