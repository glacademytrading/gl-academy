// Carrosséis e stories (imagens) com enquadramento automático: SPECS=./specs-posts.js node posts.js [grupo ou id ...]
// 1. O texto que não cabe diminui: elementos com data-fit="altura máxima em px" (tamanhos internos em em).
// 2. O gráfico fica entre os textos: data-lim="cima" e data-lim="baixo" marcam os limites da área do gráfico.
// 3. A câmera da cena com "enquadrar" se ajusta até as marcações do passo (caixas e rótulos) caberem inteiras na área.
// Sai em out/<pasta>/<grupo>/<id>.jpg e grava out/<pasta>/ajustes.json com o enquadramento final de cada imagem.
const { chromium, LAUNCH } = require('./ambiente.js');
const path = require('path');
const fs = require('fs');
const SPECS = require(process.env.SPECS || './specs-posts.js');
const M = 18;        // folga entre as marcações e a borda da área do gráfico
const VOLTAS = 8;    // tentativas de enquadramento por imagem

async function medir(p, at) {
  return p.evaluate(async at => {
    document.querySelectorAll('[data-fit]').forEach(el => {
      const h = +el.dataset.fit; let fs = parseFloat(getComputedStyle(el).fontSize);
      while (el.getBoundingClientRect().height > h && fs > 16) { fs -= 0.5; el.style.fontSize = fs + 'px'; }
    });
    if (S.clipFx) document.getElementById('fx').style.clipPath = S.clipFx;
    await render(at);
    const r = el => el.getBoundingClientRect();
    const cima = document.querySelector('[data-lim="cima"]'), baixo = document.querySelector('[data-lim="baixo"]');
    const area = { x0: 0, y0: cima ? r(cima).bottom + 14 : (S.areaTop || 100), x1: W, y1: baixo ? r(baixo).top - 14 : H - (S.areaBottom || 100) };
    const marcas = [...document.querySelectorAll('#fx .box, #fx .chip')].map(r).filter(b => b.width > 0);
    const u = marcas.length ? { x0: Math.min(...marcas.map(b => b.left)), y0: Math.min(...marcas.map(b => b.top)),
      x1: Math.max(...marcas.map(b => b.right)), y1: Math.max(...marcas.map(b => b.bottom)) } : null;
    const fontes = [...document.querySelectorAll('[data-fit]')].map(el => parseFloat(getComputedStyle(el).fontSize));
    return { area, u, fontes };
  }, at);
}

// devolve true se mudou o enquadramento (e precisa medir de novo)
function ajustar(s, m) {
  const sc = s.scenes.find(x => x.enquadrar);
  if (!sc) return false;
  const A = m.area, cam = sc.cam[0];
  let mudou = false;
  // stories: o gráfico (e as marcações) só aparecem na janela entre os textos, com um fio dourado em cima e embaixo
  if (s.recorte) {
    const y0 = Math.round(A.y0), y1 = Math.round(A.y1), clip = `inset(${y0}px 0px ${s.h - y1}px 0px)`;
    if (sc.clip !== clip) {
      sc.clip = s.clipFx = clip;
      s.texts = s.texts.filter(t => !t.janela);
      s.texts.push({ janela: true, t0: -1, t1: 99, top: y0, rise: 0, style: 'left:0;right:0;padding:0', html: `<div class="janela" style="position:relative;height:${y1 - y0}px"></div>` });
      mudou = true;
    }
  }
  const ay = Math.round((A.y0 + A.y1) / 2);
  if (sc.ay == null || Math.abs(sc.ay - ay) > 2) { sc.ay = ay; mudou = true; }
  if (mudou || !m.u) return mudou;
  const U = m.u, aw = A.x1 - A.x0 - 2 * M, ah = A.y1 - A.y0 - 2 * M, uw = U.x1 - U.x0, uh = U.y1 - U.y0;
  if (uw > aw || uh > ah) { cam.z = +(cam.z * Math.max(0.5, Math.min(aw / uw, ah / uh) * 0.97)).toFixed(4); return true; }
  let dx = 0, dy = 0;
  if (U.x0 < A.x0 + M) dx = A.x0 + M - U.x0; else if (U.x1 > A.x1 - M) dx = A.x1 - M - U.x1;
  if (U.y0 < A.y0 + M) dy = A.y0 + M - U.y0; else if (U.y1 > A.y1 - M) dy = A.y1 - M - U.y1;
  if (Math.abs(dx) <= 1 && Math.abs(dy) <= 1) return false;
  cam.cx = +(cam.cx - dx / cam.z).toFixed(2); cam.cy = +(cam.cy - dy / cam.z).toFixed(2);
  return true;
}

(async () => {
  const want = process.argv.slice(2);
  const lista = SPECS.filter(s => !want.length || want.includes(s.group) || want.includes(s.id));
  const browser = await chromium().launch(LAUNCH);
  const ajustes = {};
  for (const spec of lista) {
    const dir = path.join(__dirname, 'out', spec.folder || 'posts', spec.group); fs.mkdirSync(dir, { recursive: true });
    const p = await browser.newPage({ viewport: { width: spec.w, height: spec.h } });
    const s = JSON.parse(JSON.stringify(spec));
    let m, voltas = 0;
    for (;;) {
      await p.goto('file://' + path.join(__dirname, 'stage.html'));
      await p.evaluate(x => init(x), s);
      m = await medir(p, s.at || 2);
      if (++voltas >= VOLTAS || !ajustar(s, m)) break;
    }
    await p.screenshot({ path: path.join(dir, spec.id + '.jpg'), type: 'jpeg', quality: +(process.env.QUALIDADE || 88) });
    await p.close();
    const sc = s.scenes.find(x => x.enquadrar);
    ajustes[spec.id] = { voltas, cam: sc ? sc.cam[0] : null, ay: sc ? sc.ay : null, area: m.area, marcas: m.u, fontes: m.fontes };
    if (m.u && (m.u.x0 < m.area.x0 || m.u.x1 > m.area.x1 || m.u.y0 < m.area.y0 || m.u.y1 > m.area.y1)) console.log('ATENÇÃO, marcação fora da área:', spec.id);
  }
  const arq = path.join(__dirname, 'out', 'posts-ajustes.json');
  const antes = fs.existsSync(arq) ? JSON.parse(fs.readFileSync(arq, 'utf8')) : {};
  fs.writeFileSync(arq, JSON.stringify({ ...antes, ...ajustes }, null, 1));
  console.log('ok', lista.length, 'imagens');
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
