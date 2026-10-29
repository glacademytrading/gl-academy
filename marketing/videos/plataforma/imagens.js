// Imagens da campanha GL Black (carrossel 4:5, stories 9:16, thumbnails 16:9) sobre as fotos de estúdio
// já com as telas reais (compor.py --foto). Uso: FOTOS=<pasta das fotos> OUT=<pasta> node imagens.js [grupo ...]
const { chromium, LAUNCH } = require('../ambiente.js');
const path = require('path'), fs = require('fs');
const FOTOS = process.env.FOTOS, OUT = process.env.OUT || path.join(__dirname, 'out', 'imagens');
const DISC = 'Conteúdo educacional; não é recomendação de investimento. Trading envolve risco financeiro real e resultado passado não garante resultado futuro.';
const NOTA = 'Ambiente ilustrativo criado com IA · telas reais da plataforma GL';
const GAMMA = '<div class="sub nota-g">GL Gamma: assinatura à parte</div>';
const FMT = { F: [1080, 1350], V: [1080, 1920], L: [1280, 720] };
const B = { F: 150, V: 260, L: 70 };
const kick = k => `<div class="kick">${k}</div>`, head = h => `<div class="head">${h}</div>`, sub = s => `<div class="sub">${s}</div>`;
const mod = (n, b) => `<div class="mod"><i></i>${n}${b ? ` <b>${b}</b>` : ''}</div>`;
// uma peça: foto de fundo, enquadramento e o bloco de texto embaixo
const peca = (id, fmt, foto, html, o = {}) => ({ id, fmt, foto, items: [{ t0: 0, bottom: o.bottom || B[fmt], align: o.align || 'c', style: o.style, html }], ...o });
const fim = (id, fmt, tag, o = {}) => ({ id, fmt, foto: null, items: [], end: { t0: -1, tag, disc: DISC + (o.gamma ? ' GL Gamma: assinatura à parte.' : ''), lk: o.lk }, vt: false, vb: false });

const GRUPOS = {
  carrossel: [
    peca('car-01-capa', 'F', 'f_img13.png', kick('Novo · GL Black') + head('Uma plataforma completa para operar com <em>order flow</em>') + sub('Arraste para ver o que tem dentro →'), { bgpos: '50% 30%' }),
    peca('car-02-analise', 'F', 'f_img02.png', mod('Análise Gráfica') + head('Candles, footprint e heatmap <em>no mesmo gráfico</em>'), { bgpos: '30% 25%' }),
    peca('car-03-execucao', 'F', 'f_img34.png', mod('Order Flow e Execução') + head('Leitura de agressão e execução <em>sem trocar de tela</em>'), { bgpos: '60% 40%' }),
    peca('car-04-risk', 'F', 'f_img14.png', mod('GL Risk Auto') + head('O limite do plano aparece <em>antes</em> da ordem'), { bgpos: '50% 15%' }),
    peca('car-05-gamma', 'F', 'f_img04.png', mod('GL Gamma Black', 'Sigma Board') + head('Pré-market com níveis de Gamma e <em>notícias</em>') + GAMMA, { bgpos: '50% 40%' }),
    peca('car-06-quant', 'F', 'f_img30.png', mod('Backtest e Quant Lab') + head('Teste a ideia <em>antes</em> de arriscar nela'), { bgpos: '50% 20%' }),
    peca('car-07-training', 'F', 'f_img06.png', mod('Training Lab') + head('A mentoria acontece <em>dentro</em> da plataforma'), { bgpos: '50% 30%' }),
    peca('car-08-terminal', 'F', 'f_img24.png', mod('Terminal de Mercado') + head('Agenda, notícias e contexto macro <em>do dia</em>') + GAMMA, { bgpos: '50% 35%' }),
    fim('car-09-call', 'F', 'Veja a plataforma por dentro numa call 1x1.', { gamma: true })
  ],
  stories: [
    peca('st-01-lancamento', 'V', 'f_img02.png', kick('Novo') + head('GL Black <em>Order Flow System</em>') + sub('Fluxo, risco, Gamma e mentoria num só lugar.')),
    peca('st-02-training', 'V', 'f_img18.png', mod('Training Lab') + head('A mentoria agora acontece <em>dentro</em> da plataforma')),
    peca('st-03-premarket', 'V', 'f_img35.png', mod('GL Gamma Black') + head('O pré-market começa <em>antes</em> do pregão') + GAMMA, { bgpos: '60% 50%' }),
    peca('st-04-risk', 'V', 'f_img14.png', mod('GL Risk Auto') + head('Disciplina <em>no sistema</em>, não só na cabeça')),
    fim('st-05-call', 'V', 'Quer ver a plataforma por dentro? Agende sua call.', { gamma: true })
  ],
  thumbs: [
    peca('th-01-lancamento', 'L', 'f_img03.png', head('GL BLACK: a plataforma <em>completa</em>'), { align: 'l', style: 'right:auto;width:760px', bottom: 60 }),
    peca('th-02-training', 'L', 'f_img33.png', head('Mentoria <em>dentro</em> da plataforma'), { align: 'l', style: 'right:auto;width:700px', bottom: 60 }),
    peca('th-03-premarket', 'L', 'f_img15.png', head('Pré-market com <em>Gamma</em>') + GAMMA, { align: 'l', style: 'right:auto;width:700px', bottom: 60 })
  ]
};

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const want = process.argv.slice(2);
  const b = await chromium().launch(LAUNCH);
  for (const [g, lista] of Object.entries(GRUPOS)) {
    if (want.length && !want.includes(g)) continue;
    for (const x of lista) {
      const [W, H] = FMT[x.fmt];
      const p = await b.newPage({ viewport: { width: W, height: H } });
      await p.goto('file://' + path.join(__dirname, 'camada.html'));
      await p.evaluate(s => init(s), { w: W, h: H, nota: x.foto ? NOTA : null, ...x, bg: x.foto ? 'file://' + path.join(FOTOS, x.foto) : null });
      await p.evaluate(() => document.fonts.ready);
      await p.evaluate(async () => await render(30));
      await p.screenshot({ path: path.join(OUT, x.id + '.jpg'), type: 'jpeg', quality: 92 });
      await p.close();
    }
    console.log('ok', g, lista.length);
  }
  await b.close();
})().catch(e => { console.error(e); process.exit(1); });
