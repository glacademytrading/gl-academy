// GL Risk Auto no site, versão 2 (0 crédito): dois vídeos completos em 16:9 no lugar do kit de loops.
//   site-risk-v1-trade:    um trade do começo ao fim (leitura, plano em um botão, entrada autorizada, gestão, sinal verde)
//   site-risk-v2-protecao: como o GL Risk Auto protege a conta (teto, limite do dia, bloqueio, contratos, controle)
// Layout de explicação: a coluna da esquerda traz a barra de capítulos, o número, o título e o texto do passo; o print
// real fica à direita (centro em x = 1310) e a câmera anda nele. Coordenadas e tampas em risk-prints.js.
const { hides, R, DISC2, DISC_MESA } = require('./risk-prints.js');

const L = { w: 1920, h: 1080, ay: 540, noGrad: true, hideWm: true };
const GREEN = '#4fe3a8', RED = '#ff6b6b';
const COLUNA = 'linear-gradient(90deg, rgba(5,5,5,.96) 0%, rgba(5,5,5,.9) 33%, rgba(5,5,5,0) 43%)';
// ponto (x, y) do print no centro da área do print (x = 1310 na tela)
const D = (t, x, y, z) => ({ t, cx: +(x - 350 / z).toFixed(1), cy: y, z });
const box = (rect, t0, t1, label, o = {}) => ({ rect, t0, t1, ...(label ? { label } : {}), ...o });
const cena = (img, t0, o) => ({ img, t0, ...o, hides: [...hides(img), ...(o.hides || [])] });

// textos da coluna
const COL = 'left:90px;right:auto;width:600px;text-align:left;padding:0';
const em = (s, c) => `<em style="font-style:normal;color:${c || '#f6d991'}">${s}</em>`;
const txt = (t0, t1, top, html, o = {}) => ({ t0, t1, top, rise: 24, html, style: COL, ...o });
const NUM = n => `<div style="font:900 150px/1 Montserrat,sans-serif;background:linear-gradient(180deg,#f6d991,#b8893a);-webkit-background-clip:text;background-clip:text;color:transparent">${n}</div>`;
const TIT = s => `<div style="font:800 60px/1.06 Montserrat,sans-serif;color:#fff;letter-spacing:-.005em">${s}</div>`;
const CORPO = s => `<div style="font:500 35px/1.36 Inter,sans-serif;color:rgba(255,255,255,.9)">${s}</div>`;
function barra(rotulos, ativo) {
  const pill = (r, i) => {
    const base = 'display:inline-block;font:700 19px/1 Inter,sans-serif;letter-spacing:.04em;padding:10px 13px;border-radius:999px;white-space:nowrap;';
    if (i === ativo) return `<span style="${base}color:#0b0906;background:linear-gradient(90deg,#d8ae55,#f6d991)">${r}</span>`;
    if (i < ativo) return `<span style="${base}color:#d8ae55;border:1px solid rgba(216,174,85,.7)">${r}</span>`;
    return `<span style="${base}color:rgba(255,255,255,.5);border:1px solid rgba(255,255,255,.22)">${r}</span>`;
  };
  return `<div style="display:flex;gap:8px">${rotulos.map(pill).join('')}</div>`;
}
// um passo: barra de capítulos, número, título e até duas linhas de texto (a segunda entra depois)
function passo(rotulos, i, t0, t1, titulo, a, b) {
  const out = [
    { t0, t1, top: 70, rise: 0, in: .25, html: barra(rotulos, i), style: COL },
    txt(t0 + .15, t1, 236, NUM(i + 1) + `<div style="margin-top:14px">${TIT(titulo)}</div>`),
    txt(a[0], t1, 560, CORPO(a[1]))
  ];
  if (b) out.push(txt(b[0], t1, 740, CORPO(b[1])));
  return out;
}
const abertura = (t1, titulo, sub) => [
  txt(.2, t1, 300, '<div style="display:inline-block;font:800 28px/1 Montserrat,sans-serif;letter-spacing:.16em;color:#0b0906;background:linear-gradient(90deg,#d8ae55,#f6d991);padding:12px 18px;border-radius:8px">GL RISK AUTO</div>'),
  txt(.45, t1, 390, `<div style="font:900 64px/1.06 Montserrat,sans-serif;color:#fff">${titulo}</div>`),
  txt(.9, t1, 650, CORPO(sub))
];
// barra de progresso dourada no rodapé, até a cartela final
const progresso = fim => ({ html: '<div style="width:1920px;height:5px;background:linear-gradient(90deg,#b8893a,#f6d991)"></div>', style: 'top:1075px',
  linear: true, keys: [{ t: 0, x: -1920, o: 1 }, { t: fim, x: 0, o: 1 }, { t: fim + .2, x: 0, o: 0 }] });
const END = (t0, tag, disc) => ({ t0, brand: 'GL RISK AUTO', tag, cta: 'Conheça na conversa gratuita', sub: 'GL ACADEMY', disc });

// ------------------------------------------------------------------------------------------------- vídeo 1
// P28 e P29 são o mesmo gráfico (P29 = P28 + (-132, -200), mesmo zoom): na troca de cena o plano "aparece" no gráfico.
const C1 = ['1 Leitura', '2 Plano', '3 Teto', '4 Gestão', '5 Verde'];
const RR2 = [552, 660, 238, 14], RR3 = [552, 745, 238, 14], RR5 = [552, 918, 192, 17];
// o sinal verde no painel do print 31, com a câmera parada em D(122, 180, 2.3): retângulo na tela
const P31 = { cx: 122 - 350 / 2.3, cy: 180, z: 2.3 };
const tela = (x, y) => [960 + (x - P31.cx) * P31.z, 540 + (y - P31.cy) * P31.z];
const [vx0, vy0] = tela(R.p31Box[0], R.p31Box[1]), [vx1, vy1] = tela(R.p31Box[0] + R.p31Box[2], R.p31Box[1] + R.p31Box[3]);
const PULSO = { t0: 35.6, t1: 41.3, top: Math.round(vy0 - 22), rise: 0, in: .3,
  style: `left:${Math.round(vx0 - 22)}px;right:auto;padding:0;text-align:left`,
  html: `<div class="pulse" data-period="0.9" style="width:${Math.round(vx1 - vx0 + 44)}px;height:${Math.round(vy1 - vy0 + 44)}px;border:6px solid ${GREEN};border-radius:20px;box-shadow:0 0 70px ${GREEN}, inset 0 0 30px rgba(79,227,168,.35)"></div>` };

const v1 = { id: 'site-risk-v1-trade', ...L, dur: 47, shade: COLUNA, dust: { n: 50, period: 16, alpha: .5 },
  scenes: [
    cena('34.png', 0, { t1: 4.0, cam: [{ t: 0, cx: 227, cy: 299, z: 1.15 }, { t: 4.0, cx: 232, cy: 299, z: 1.2 }],
      boxes: [box(R.p34Painel, 1.3, 3.7, 'GL Risk Auto', { below: true })] }),
    cena('28.png', 3.6, { t1: 11.4, cam: [D(3.6, 674, 662, 1.8), D(11.4, 674, 650, 1.8)],
      boxes: [box(R.p28Vah, 4.4, 11.0, 'VAH D + bloco vermelho', { color: RED, dx: -30 }),
        box(R.p28Bolha, 6.9, 11.0, 'Compra na resistência', { below: true, dx: -70 })] }),
    cena('29.png', 10.8, { t1: 20.8, cam: [D(10.8, 542, 450, 1.8), D(12.8, 542, 450, 1.8), D(14.6, 600, 668, 1.8), D(20.8, 600, 668, 1.86)],
      boxes: [box(R.p29Entrada, 11.9, 15.0, 'Entrada', { below: true, dx: 150 }), box(R.p29Stop, 12.5, 15.0, 'Stop = 1R · US$250', { color: RED, below: true, dx: -60 }),
        box(RR2, 15.2, 20.5, '2 para 1', { below: true, dx: 150 }), box(RR3, 16.1, 20.5, '3 para 1', { below: true, dx: 150 }),
        box(RR5, 17.0, 20.5, '5 para 1 · alvo', { color: GREEN, dx: 150 })] }),
    cena('30.png', 20.2, { t1: 29.0, cam: [D(20.2, 120, 330, 2.3), D(24.0, 120, 332, 2.34), D(25.6, 640, 560, 1.25), D(29.0, 640, 560, 1.28)],
      boxes: [box(R.p30Risco, 20.9, 24.1, 'Dentro do teto', { color: GREEN, below: true }),
        box(R.p30Stp, 25.9, 28.7, 'Stop na plataforma', { color: RED }), box(R.p30Lmt, 26.5, 28.7, 'Alvo na plataforma', { color: GREEN })] }),
    cena('33.png', 28.4, { t1: 35.2, cam: [D(28.4, 440, 480, 1.5), D(35.2, 440, 480, 1.56)],
      boxes: [box(R.p33Pos, 29.2, 34.9, '+19,25 pontos', { color: GREEN }), box(R.p33Lmt, 29.8, 34.9, 'Alvo', { color: GREEN, below: true })] }),
    cena('31.png', 34.6, { t1: 47, cam: [{ t: 34.6, ...P31 }, { t: 47, ...P31 }],
      boxes: [box(R.p31Box, 35.2, 41.3, 'Sinal verde', { color: GREEN, below: true })] })
  ],
  sparks: [{ t: 35.4, x: Math.round((vx0 + vx1) / 2), y: Math.round((vy0 + vy1) / 2), s: 460, d: .9 }],
  texts: [
    ...abertura(3.5, 'Um trade do começo ao fim', 'Da leitura ao sinal verde, com o risco medido antes do clique.'),
    ...passo(C1, 0, 3.9, 11.2, 'A leitura', [4.3, `O preço testa a ${em('VAH D')} e o ${em('bloco vermelho', RED)}.`],
      [6.9, `Os comprados entram na resistência: ${em('preparamos a venda')}.`]),
    ...passo(C1, 1, 11.2, 20.6, 'O plano em um botão', [11.7, `Um botão desenha ${em('entrada, stop e alvo')} no gráfico: o Plano Visual do GL Risk Auto.`],
      [15.1, `O risco x retorno aparece na hora: ${em('2 para 1, 3 para 1, 5 para 1')}.`]),
    ...passo(C1, 2, 20.6, 28.8, 'Entrada autorizada', [21.0, `O painel confere o plano contra o ${em('teto da conta')}: US$250 de risco para um teto de US$285,71.`],
      [24.4, `Dentro do teto, a entrada é autorizada. ${em('Stop e alvo')} vão junto para a plataforma.`]),
    ...passo(C1, 3, 28.8, 35.0, 'A gestão', [29.2, `Em posição, o preço anda em direção ao alvo, perto da ${em('VAL D')}.`],
      [31.4, 'O risco segue medido em R, sem conta de cabeça.']),
    ...passo(C1, 4, 35.0, 41.4, 'Sinal verde', [35.4, `Acima de ${em('1,5 para 1', GREEN)}, o painel fica verde e avisa: você pode realizar o lucro.`],
      [37.8, `O painel avisa. ${em('A decisão é sua.')}`]),
    PULSO
  ],
  tweens: [progresso(41.6)],
  end: END(41.6, 'Da leitura à saída, com o risco medido antes do clique.', DISC2),
  stills: [1.8, 6, 9.6, 12.2, 17.8, 22.5, 27.6, 32.5, 36.2, 39.8, 44.5] };

// ------------------------------------------------------------------------------------------------- vídeo 2
const C2 = ['1 Teto', '2 Dia', '3 Bloqueio', '4 Contratos', '5 Controle'];
const DIR = 360; // rótulos à direita do painel
const v2 = { id: 'site-risk-v2-protecao', ...L, dur: 45, shade: COLUNA, dust: { n: 50, period: 16, alpha: .5 },
  scenes: [
    cena('27.png', 0, { t1: 4.0, cam: [D(0, 622, 510, 0.98), D(4.0, 622, 510, 1.02)],
      boxes: [box(R.p27Box, 1.3, 3.7, 'GL Risk Auto', { below: true })] }),
    cena('23.png', 3.6, { t1: 10.8, cam: [D(3.6, 163, 262, 2.2), D(10.8, 163, 264, 2.26)],
      boxes: [box(R.dTeto, 4.4, 10.5, 'Teto por trade', { color: GREEN, below: true }), box(R.dAuto, 6.9, 10.5, 'Auto risco', { below: true })] }),
    cena('27.png', 10.2, { t1: 17.2, cam: [D(10.2, 122, 200, 2.5), D(17.2, 122, 204, 2.56)],
      boxes: [box(R.p27Dia, 11.0, 16.9, 'Limite do dia', { below: true, dx: DIR }), box(R.p27Preset, 12.9, 16.9, 'Preset de mesa', { below: true, dx: DIR }),
        box(R.p27Teto, 14.4, 16.9, 'Teto por trade', { color: GREEN, below: true, dx: DIR })] }),
    cena('26.png', 16.6, { t1: 25.4, cam: [D(16.6, 596, 600, 1.5), D(19.6, 596, 604, 1.52), D(21.4, 176, 1270, 2.4), D(25.4, 176, 1270, 2.46)],
      boxes: [box(R.p26Stop, 17.3, 19.9, 'Stop: US$387,50', { color: RED, below: true, dx: -40 }), box(R.p26Entrada, 17.9, 19.9, 'Entrada', { below: true }),
        box(R.p26Caixa, 21.7, 25.1, 'Bloqueado antes da ordem', { color: RED }), box(R.p26Teto, 22.3, 25.1, null, { color: RED })] }),
    cena('25.png', 24.8, { t1: 32.8, cam: [D(24.8, 67, 125, 4.0), D(32.8, 67, 125, 4.08)],
      boxes: [box(R.p25Total, 25.6, 28.5, 'Dentro do teto', { color: GREEN, below: true, dx: DIR }),
        box(R.p25Cabem, 28.5, 32.5, 'Cabe 1 contrato', { color: GREEN, below: true, dx: DIR }),
        box(R.p25Ori, 29.6, 32.5, 'START confirma', { below: true, dx: DIR }),
        box(R.p25Box, 30.4, 32.5, 'Plano pronto', { color: GREEN, dx: DIR })] }),
    cena('22.png', 32.2, { t1: 45, cam: [D(32.2, 160, 355, 1.5), D(45, 160, 355, 1.53)],
      boxes: [box(R.testar, 33.0, 39.3, 'Treino sem ordens', { below: true, dx: 190 }),
        box(R.bAY, 33.9, 39.3, 'A compra · Y venda', { dx: DIR }), box(R.bStart, 34.9, 39.3, 'START confirma', { color: GREEN, below: true, dx: DIR }),
        box(R.bSelect, 35.9, 39.3, 'SELECT cancela', { color: RED, below: true, dx: DIR }), box(R.bTeclado, 36.9, 39.3, 'Teclado: CTRL + SHIFT', { dx: 120 })] })
  ],
  texts: [
    ...abertura(3.5, 'Como ele protege a sua conta', 'As regras de risco na tela, antes do clique.'),
    ...passo(C2, 0, 3.9, 10.6, 'O teto por trade', [4.3, `Você define o plano de risco da conta e o painel calcula o ${em('teto por trade')}: aqui, US$285,71.`],
      [6.9, `O ${em('auto risco')} reaplica o teto depois de cada trade fechado.`]),
    ...passo(C2, 1, 10.6, 17.0, 'O limite do dia', [11.0, `O ${em('limite do dia')} e o teto por trade ficam na tela antes do primeiro trade.`],
      [12.9, `Presets com as regras de conta de ${em('mesa proprietária')}.`]),
    ...passo(C2, 2, 17.0, 25.2, 'Acima do teto, não passa', [17.4, `Stop longe demais: o risco do plano vai a ${em('US$387,50', RED)} e passa do teto de US$285,71.`],
      [21.8, `O plano é ${em('barrado antes da ordem', RED)}. Nem quando a vontade de recuperar fala mais alto.`]),
    ...passo(C2, 3, 25.2, 32.6, 'A mão vem do stop', [25.6, `Dentro do teto, o painel mostra ${em('quantos contratos cabem')} no stop.`],
      [28.6, `Plano pronto: o ${em('START')} confirma e o ${em('SELECT')} cancela.`]),
    ...passo(C2, 4, 32.6, 39.4, 'Controle ou teclado', [33.0, `Cada botão faz uma coisa: ${em('A')} planeja a compra, ${em('Y')} a venda e o ${em('START')} confirma.`],
      [35.9, `Dá para treinar ${em('sem enviar ordens')}. No teclado, CTRL + SHIFT.`])
  ],
  tweens: [progresso(39.6)],
  end: END(39.6, 'Se não cabe no teto, não entra.', DISC_MESA),
  stills: [1.8, 5.5, 9.4, 12.2, 15.6, 18.8, 23.4, 27.2, 31.2, 34.2, 38.4, 42.5] };

module.exports = [v1, v2];
