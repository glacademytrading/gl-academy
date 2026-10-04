// GL Risk Auto em 9:16 (Reels, Shorts, TikTok e anúncios verticais). Prints 22 a 34; o que cada um mostra e o que fica
// escondido está em risk-prints.js. v18: o trade acima do teto barrado. v19: um trade do começo ao fim, do contexto macro e
// micro ao sinal verde e ao sistema completo. ra01 a ra10: as dores do trader (risco antes do clique, stop longe demais,
// mão maior do que cabe, mesa proprietária, saída), o controle, o antes e depois, a aula de R e o sistema completo.
// No fim: versões 4:5 para o feed e coringas limpos (sem legenda, caixas e cartela) para editar com a gravação do Giovane.
const { hides, R, DISC, DISC2, DISC_MESA } = require('./risk-prints.js');

const V = { w: 1080, h: 1920, ay: 1120 };
const GREEN = '#4fe3a8', RED = '#ff6b6b';
const END = (t0, tag, disc, o = {}) => ({ t0, tag, disc, brand: 'GL RISK AUTO', ...o });
const cam = (...ks) => ks.map(([t, cx, cy, z]) => ({ t, cx, cy, z }));
const box = (rect, t0, t1, label, o = {}) => ({ rect, t0, t1, ...(label ? { label } : {}), ...o });
const cap = (t0, t1, text, kick) => ({ t0, t1, text, ...(kick ? { kick } : {}) });

// cenas em sequência: cada cena fica por baixo da seguinte até a troca terminar (fusão sem escurecer)
function seq(list, dur) {
  return list.map((s, i) => {
    const out = { ...s, hides: [...hides(s.img), ...(s.hides || [])] };
    if (list[i + 1]) out.t1 = list[i + 1].t0 + 0.8; else { out.t1 = dur; out.last = true; }
    return out;
  });
}
const video = (id, dur, scenes, captions, end, stills, o = {}) => ({ id, ...V, dur, scenes: seq(scenes, dur), captions, end, stills, ...o });

const v18 = video('v18-risk-auto-teto', 24, [
  { t0: 0, img: '26.png', cam: cam([0, 520, 760, 1.08], [3.2, 560, 760, 1.12], [7.2, 640, 760, 1.3]),
    boxes: [box([583, 643, 262, 16], 1.0, 3.6, 'Entrada', { below: true, dx: -40 }), box(R.p26Stop, 1.6, 3.6, 'Stop', { color: RED, dx: -60 }),
      box(R.p26Alvo, 3.9, 7.2, 'Alvo em 2,26R', { color: GREEN, below: true, dx: -20 })] },
  { t0: 7.4, img: '26.png', cam: cam([7.4, 176, 1398, 2.2], [9.2, 176, 1400, 2.9]),
    boxes: [box(R.p26Teto.slice(0, 2).concat([346, 20]), 9.4, 12.5, 'Acima do teto: bloqueado', { color: RED, below: true, dx: 0 })] },
  { t0: 12.6, img: '25.png', cam: cam([12.6, 150, 140, 2.6], [15, 150, 150, 3.0]),
    boxes: [box([8, 33, 118, 24], 13.0, 15.0, 'Plano pronto', { color: GREEN, below: true, dx: 170 }),
      box(R.p25Total, 15.0, 17.5, 'Dentro do teto', { color: GREEN, below: true, dx: 170 })] },
  { t0: 17.6, img: '22.png', cam: cam([17.6, 160, 170, 3.1], [20, 160, 300, 3.1]),
    boxes: [box([20, 286, 282, 30], 20.2, 22.8, 'A compra · Y vende', { below: true })] }
], [
  cap(0.2, 3.7, 'O risco medido <em>antes</em> do clique', 'GL Risk Auto'),
  cap(3.9, 7.2, 'Venda planejada: alvo em <em>2,26R</em>, desenhado no gráfico'),
  cap(7.6, 12.4, 'Risco de US$387,50 com teto de US$285,71: <em>o trade não passa</em>'),
  cap(12.8, 17.4, 'Dentro da gestão: <em>plano pronto</em>, o START confirma'),
  cap(17.8, 22.8, 'Tudo pelo controle, <em>sem planilha</em> e sem conta de cabeça')
], END(22.8, 'Gestão de risco automática no NinjaTrader.', DISC), [2.5, 6, 11, 15.5, 21]);

const v19 = video('v19-risk-auto-trade', 43.3, [
  // 1. contexto macro: topos mais baixos no 30 minutos e o preço de volta à região de valor
  { t0: 0, img: '27.png', cam: cam([0, 740, 560, 1.1], [3.2, 760, 580, 1.16], [5.8, 900, 640, 1.6]),
    boxes: [box(R.p27Topos[0], 0.9, 3.2, '7.810', { color: RED }), box(R.p27Topos[1], 1.5, 3.2, '7.780', { color: RED }),
      box(R.p27Topos[2], 2.1, 3.2, '7.768', { color: RED, below: true }), box(R.p27Valor, 3.6, 5.9, 'Região de valor', { below: true, dx: -40 })] },
  // 2. micro: o preço sobe até a VAH D e o bloco vermelho, com compradores agredindo na resistência
  { t0: 6.0, img: '28.png', cam: cam([6.0, 560, 760, 1.3], [7.6, 720, 680, 2.0]),
    boxes: [box(R.p28Vah, 7.2, 9.4, 'VAH D e bloco vermelho', { color: RED, dx: -40 }),
      box(R.p28Bolha, 9.6, 11.9, 'Compra na resistência', { below: true, dx: -90 })] },
  // 3. o plano: risco x retorno medido pelo GL Risk Auto
  { t0: 12.0, img: '29.png', cam: cam([12.0, 600, 640, 1.45], [15.2, 640, 660, 1.55]),
    boxes: [box(R.p29Stop, 12.6, 15.2, 'Stop acima da VAH D', { color: RED, dx: -60 }),
      box(R.p29Entrada, 13.4, 15.2, 'Entrada · 1 contrato', { below: true, dx: -40 }),
      box(R.p29Alvo, 15.5, 18.5, 'Alvo 5R na VAL D', { color: GREEN, below: true, dx: -20 })] },
  // 4. o Risk Auto autoriza: o risco cabe no teto; stop e alvo já na plataforma
  { t0: 18.6, img: '30.png', cam: cam([18.6, 125, 250, 3.6], [21.6, 125, 250, 3.6], [22.4, 930, 780, 2.0]),
    boxes: [box(R.p30Risco, 19.2, 21.6, 'Dentro do teto', { color: GREEN }),
      box(R.p30Stp, 22.7, 24.9, 'Stop', { color: RED, dx: -10 }), box(R.p30Lmt, 23.2, 24.9, 'Alvo', { color: GREEN, below: true, dx: -10 })] },
  // 5. em posição: o preço anda em direção ao alvo
  { t0: 25.0, img: '33.png', cam: cam([25.0, 560, 480, 1.25], [30.4, 580, 500, 1.35]),
    boxes: [box(R.p33Pos, 25.6, 30.4, '+19,25 pontos', { color: GREEN }), box(R.p33Lmt, 26.6, 30.4, 'Alvo 5R', { color: GREEN, below: true })] },
  // 6. o sinal verde
  { t0: 30.6, img: '31.png', cam: cam([30.6, 122, 138, 4.0], [35.8, 122, 132, 4.2]),
    boxes: [box(R.p31Box, 31.2, 35.8, 'Sinal verde', { color: GREEN, below: true })] },
  // 7. o sistema completo: o painel à esquerda, o 30 e o 5 minutos
  { t0: 36.0, img: '34.png', cam: cam([36.0, 531, 299, 1.05], [39.8, 531, 299, 1.12]),
    boxes: [box(R.p34Painel, 36.6, 39.7, 'GL Risk Auto', { dx: 110 })] }
], [
  cap(0.2, 3.3, '1 · Contexto: <em>topos mais baixos</em> no 30 minutos', 'GL Risk Auto · do começo ao fim'),
  cap(3.4, 5.9, 'O preço volta para a <em>região de valor</em> do dia e da semana'),
  cap(6.2, 9.4, '2 · No 5 minutos, o preço testa a <em>VAH D</em> e o bloco vermelho'),
  cap(9.5, 11.9, 'Comprados comprando na resistência: <em>preparamos a venda</em>'),
  cap(12.2, 15.3, '3 · O GL Risk Auto mede o <em>risco x retorno</em> no gráfico'),
  cap(15.4, 18.5, 'Risco de US$250 no stop e alvo em <em>5R</em>, na VAL D'),
  cap(18.8, 21.7, '4 · Risco dentro do teto da conta: <em>entrada autorizada</em>'),
  cap(21.9, 24.9, 'Stop e alvo <em>já na plataforma</em> junto com a entrada'),
  cap(25.2, 27.9, 'Em posição, o preço anda em direção ao <em>alvo</em>'),
  cap(28.0, 30.5, '+19,25 pontos, com <em>stop e alvo</em> no lugar'),
  cap(30.8, 33.3, '5 · RR favorável: o painel <em class="green">acende em verde</em>'),
  cap(33.4, 35.9, '3,37R do risco orientado: <em>avalie realizar</em>'),
  cap(36.2, 39.7, 'Contexto, risco e saída <em>na mesma tela</em>')
], END(39.8, 'Do contexto à saída, com o risco medido antes do clique.', DISC2), [2.6, 5.2, 8.5, 11, 14, 17, 20.5, 24, 27, 29.5, 32.5, 35, 38, 41.5]);

// ra01: o trade barrado, com o gancho logo no primeiro quadro (anúncio e Reels)
const ra01 = video('ra01-bloqueado', 17.7, [
  { t0: 0, img: '26.png', cam: cam([0, 176, 1398, 2.9], [5.4, 176, 1398, 3.05]),
    boxes: [box(R.p26Teto, 0.5, 5.4, 'Bloqueado', { color: RED, below: true }), box(R.p26Atual, 2.9, 5.4, null, {})] },
  { t0: 5.6, img: '26.png', cam: cam([5.6, 600, 760, 1.1], [10.4, 640, 760, 1.25]),
    boxes: [box(R.p26Stop, 6.0, 10.4, 'Stop: US$387,50', { color: RED, dx: -60 }), box(R.p26Entrada, 6.6, 10.4, 'Entrada', { below: true, dx: -40 })] },
  { t0: 10.6, img: '25.png', cam: cam([10.6, 190, 150, 2.8], [14.2, 177, 150, 3.0]),
    boxes: [box(R.p25Total, 11.0, 14.2, 'Dentro do teto', { color: GREEN, below: true, dx: 170 }),
      box(R.p25Box, 11.6, 14.2, 'Plano pronto', { color: GREEN, below: true, dx: 170 })] }
], [
  cap(0.2, 2.8, 'Este trade <em class="red">não passou</em> pelo GL Risk Auto', 'GL Risk Auto'),
  cap(2.9, 5.5, 'Risco de US$387,50 para um teto de <em>US$285,71</em>'),
  cap(5.8, 8.1, 'O stop ficou <em>longe demais</em> para a conta'),
  cap(8.2, 10.5, 'Ou o risco diminui, ou <em>não tem entrada</em>'),
  cap(10.8, 14.1, 'Outro plano, US$225 de risco: <em class="green">plano pronto</em>')
], END(14.2, 'Se não cabe no teto, não entra.', DISC), [1.5, 4.2, 7, 9.5, 12.5, 15.8]);

// ra02: quanto você perde se o stop for atingido
const ra02 = video('ra02-quanto-perde', 18.7, [
  { t0: 0, img: '29.png', cam: cam([0, 640, 520, 1.75], [5.8, 650, 540, 1.85]),
    boxes: [box(R.p29Stop, 0.8, 5.8, 'Stop: US$250', { color: RED, dx: -40 })] },
  { t0: 6.0, img: '29.png', cam: cam([6.0, 650, 540, 1.85], [7.0, 660, 700, 1.45]),
    boxes: [box(R.p29R1, 6.8, 9.0, '1R', { color: RED }), box(R.p29Alvo, 9.1, 11.4, 'Alvo 5R', { color: GREEN, below: true, dx: -20 })] },
  { t0: 11.6, img: '30.png', cam: cam([11.6, 125, 250, 3.6], [15.2, 125, 250, 3.7]),
    boxes: [box(R.p30Risco, 12.0, 15.2, 'Dentro do teto', { color: GREEN, below: true })] }
], [
  cap(0.2, 2.9, 'Se o stop for atingido, <em>quanto você perde?</em>', 'Pergunta rápida'),
  cap(3.0, 5.9, 'No GL Risk Auto, a resposta está <em>no gráfico</em>'),
  cap(6.2, 8.9, '<em>1R</em> é o risco até o stop: aqui, 5 pontos'),
  cap(9.0, 11.5, 'Alvo em <em>5R</em>: 25 pontos, 5 vezes o risco'),
  cap(11.8, 15.1, 'E o painel confere se cabe no <em>teto da conta</em>')
], END(15.2, 'O risco medido antes do clique.', DISC), [1.5, 4.5, 7.5, 10.2, 13.5, 16.8]);

// ra03: o controle
const ra03 = video('ra03-controle', 23.5, [
  { t0: 0, img: '22.png', cam: cam([0, 160, 157, 3.4], [4.4, 160, 160, 3.6]) },
  { t0: 4.6, img: '22.png', cam: cam([4.6, 160, 160, 3.6], [5.4, 160, 330, 3.1]),
    boxes: [box(R.bAY, 5.6, 7.2, 'A compra · Y vende', {}), box(R.bStart, 7.3, 9.4, 'START confirma', { below: true })] },
  { t0: 9.6, img: '22.png', cam: cam([9.6, 160, 330, 3.1], [10.4, 160, 470, 3.1]),
    boxes: [box(R.bStop, 10.6, 12.3, 'Stop: 1 tick por toque', {}), box(R.bAlvo, 10.9, 12.3, 'Alvo: 1 tick por toque', { below: true }),
      box(R.bRR, 12.4, 14.1, 'R:R de 1R a 5R', { below: true })] },
  { t0: 14.2, img: '22.png', cam: cam([14.2, 160, 470, 3.1], [15.0, 120, 90, 3.4]),
    boxes: [box(R.testar, 15.2, 16.5, 'Treino sem ordens', { below: true })] },
  { t0: 16.6, img: '26.png', cam: cam([16.6, 176, 1398, 2.8], [20.0, 176, 1400, 2.95]),
    boxes: [box(R.p26Teto, 17.0, 20.0, 'Bloqueado', { color: RED, below: true })] }
], [
  cap(0.2, 2.2, 'Sim, é <em>um controle</em>', 'GL Risk Auto'),
  cap(2.3, 4.5, 'E ele trabalha <em>dentro do seu risco</em>'),
  cap(4.8, 7.2, 'A planeja a compra, Y a venda. <em>START confirma</em>'),
  cap(7.3, 9.5, 'Você planeja, confere e <em>só então</em> confirma'),
  cap(9.8, 12.3, 'Stop e alvo andam <em>1 tick por toque</em>'),
  cap(12.4, 14.1, 'R:R de <em>1R a 5R</em> num botão'),
  cap(14.4, 16.5, 'E dá para treinar <em>sem enviar ordens</em>'),
  cap(16.8, 20.0, 'Plano acima do teto? <em class="red">Bloqueado</em>')
], END(20.0, 'Pelo controle ou pelo teclado, sempre dentro do teto.', DISC), [1.2, 3.4, 6.2, 8.4, 11.5, 13.2, 15.8, 18.5, 21.6]);

// ra04: quantos contratos cabem
const ra04 = video('ra04-quantos-contratos', 18.7, [
  { t0: 0, img: '25.png', cam: cam([0, 166, 172, 3.2], [5.0, 157, 165, 3.4]),
    boxes: [box(R.p25Cabem, 0.8, 5.0, 'Cabe 1 contrato', { color: GREEN, below: true, dx: 160 })] },
  { t0: 5.2, img: '26.png', cam: cam([5.2, 176, 1400, 2.8], [10.2, 176, 1402, 2.95]),
    boxes: [box(R.p26Max, 5.6, 10.2, null, { color: RED })] },
  { t0: 10.4, img: '30.png', cam: cam([10.4, 125, 186, 3.0], [15.2, 125, 186, 3.05]),
    boxes: [box(R.p30Cap, 10.8, 15.2, 'Sem capacidade', { below: true })] }
], [
  cap(0.2, 2.5, '<em>1 contrato ou 2?</em>', 'Gestão de risco'),
  cap(2.6, 5.0, 'O painel calcula quantos <em>cabem no stop</em>'),
  cap(5.4, 7.9, 'Stop mais longe: <em class="red">não cabe</em> nem 1 contrato'),
  cap(8.0, 10.3, '"Max. nova entrada 0": <em>a entrada é barrada</em>'),
  cap(10.6, 12.9, 'Em posição, ele avisa: <em>sem capacidade</em> para mais um'),
  cap(13.0, 15.2, 'A mão não cresce <em>no impulso</em>')
], END(15.2, 'O tamanho da mão vem do stop, não da vontade.', DISC), [1.5, 4, 6.6, 9.2, 11.8, 14.2, 16.8]);

// ra05: o sinal verde
const ra05 = video('ra05-sinal-verde', 17.9, [
  { t0: 0, img: '30.png', cam: cam([0, 125, 95, 3.9], [4.8, 125, 100, 4.1]),
    boxes: [box(R.p30Box, 0.6, 4.8, 'Em posição', { below: true })] },
  { t0: 5.0, img: '31.png', cam: cam([5.0, 122, 138, 4.0], [10.4, 122, 132, 4.2]),
    boxes: [box(R.p31Box, 5.4, 10.4, 'Sinal verde', { color: GREEN, below: true })] },
  { t0: 10.6, img: '33.png', cam: cam([10.6, 560, 480, 1.25], [14.4, 580, 500, 1.32]),
    boxes: [box(R.p33Pos, 11.0, 14.4, '+19,25 pontos', { color: GREEN }), box(R.p33Lmt, 11.6, 14.4, 'Alvo 5R', { color: GREEN, below: true })] }
], [
  cap(0.2, 2.3, 'Quando <em>realizar</em>?', 'GL Risk Auto'),
  cap(2.4, 4.9, 'Em posição, o painel mede o trade <em>em R, ao vivo</em>'),
  cap(5.2, 7.7, 'RR favorável: o painel <em class="green">acende em verde</em>'),
  cap(7.8, 10.5, '3,37R do risco orientado: <em>avalie realizar</em>'),
  cap(10.8, 14.4, 'O verde não manda sair. <em>Ele avisa.</em> A decisão é sua')
], END(14.4, 'Saída com critério, não com emoção.', DISC2), [1.2, 3.8, 6.5, 9.2, 12.6, 16]);

// ra06: mesa proprietária (sem prometer aprovação)
const ra06 = video('ra06-mesa-proprietaria', 24, [
  { t0: 0, img: '27.png', cam: cam([0, 120, 120, 3.4], [5.8, 120, 125, 3.6]),
    boxes: [box(R.p27Dia, 2.9, 5.8, 'Limite do dia', { below: true })] },
  { t0: 6.0, img: '27.png', cam: cam([6.0, 120, 125, 3.6], [6.8, 120, 165, 3.4]),
    boxes: [box(R.p27Preset, 7.0, 8.9, 'Preset de mesa', {}), box(R.p27Teto, 7.4, 8.9, 'Teto por trade', { color: GREEN, below: true })] },
  { t0: 9.0, img: '23.png', cam: cam([9.0, 165, 215, 2.6], [11.8, 165, 215, 2.65]),
    boxes: [box(R.dAuto, 9.4, 11.8, 'Auto risco ligado', { color: GREEN, below: true })] },
  { t0: 12.0, img: '26.png', cam: cam([12.0, 176, 1398, 2.8], [16.8, 176, 1400, 2.95]),
    boxes: [box(R.p26Teto, 12.4, 16.8, 'Bloqueado', { color: RED, below: true })] },
  { t0: 17.0, img: '25.png', cam: cam([17.0, 190, 150, 2.8], [20.4, 177, 150, 3.0]),
    boxes: [box(R.p25Box, 17.4, 20.4, 'Plano pronto', { color: GREEN, below: true, dx: 170 })] }
], [
  cap(0.2, 2.9, 'Na mesa, <em>quebrar a regra</em> custa a conta', 'Mesa proprietária'),
  cap(3.0, 5.9, 'O limite do dia <em>na tela</em>, antes do primeiro trade'),
  cap(6.2, 8.9, 'Preset da conta de mesa: <em>teto por trade</em> calculado'),
  cap(9.2, 11.9, 'Auto risco: aplica <em>depois de cada trade</em> fechado'),
  cap(12.2, 14.5, 'Plano acima do teto? <em class="red">Não passa.</em>'),
  cap(14.6, 16.9, 'Nem quando a vontade de <em>recuperar</em> fala mais alto'),
  cap(17.2, 20.3, 'Dentro da regra: <em class="green">plano pronto</em> e o START confirma')
], END(20.4, 'As regras da mesa na tela, antes do clique.', DISC_MESA), [1.5, 4.4, 7.8, 10.5, 13.4, 15.8, 18.8, 22]);

// ra07: 5 erros de risco e o que o painel faz em cada um
const ra07 = video('ra07-5-erros', 30.3, [
  { t0: 0, img: '26.png', cam: cam([0, 600, 760, 1.12], [2.8, 620, 760, 1.2]) },
  { t0: 2.8, img: '29.png', cam: cam([2.8, 640, 540, 1.75], [7.4, 650, 550, 1.85]),
    boxes: [box(R.p29Stop, 3.4, 7.4, 'US$250 no stop', { color: RED, dx: -40 })] },
  { t0: 7.6, img: '26.png', cam: cam([7.6, 176, 1398, 2.8], [12.2, 176, 1400, 2.95]),
    boxes: [box(R.p26Teto, 8.0, 12.2, 'Bloqueado', { color: RED, below: true })] },
  { t0: 12.4, img: '30.png', cam: cam([12.4, 125, 186, 3.0], [17.0, 125, 186, 3.05]),
    boxes: [box(R.p30Cap, 12.8, 17.0, 'Sem capacidade', { below: true })] },
  { t0: 17.2, img: '32.png', cam: cam([17.2, 520, 1040, 0.95], [21.8, 540, 1040, 1.0]),
    boxes: [box(R.p32Stp, 17.6, 21.8, 'Stop', { color: RED }), box(R.p32Lmt, 18.0, 21.8, 'Alvo', { color: GREEN, below: true })] },
  { t0: 22.0, img: '31.png', cam: cam([22.0, 122, 138, 4.0], [26.6, 122, 132, 4.2]),
    boxes: [box(R.p31Box, 22.4, 26.6, 'Avalie realizar', { color: GREEN, below: true })] }
], [
  cap(0.2, 2.7, '5 erros de risco que <em class="red">quebram conta</em>', 'GL Risk Auto'),
  cap(3.0, 5.2, '1 · Entrar sem saber <em>quanto perde</em>'),
  cap(5.3, 7.5, 'O painel mostra o risco no stop <em>antes do clique</em>'),
  cap(7.8, 10.0, '2 · Stop <em>longe demais</em> para a conta'),
  cap(10.1, 12.3, 'Acima do teto: <em class="red">não passa</em>'),
  cap(12.6, 14.8, '3 · Mão maior do que <em>cabe</em>'),
  cap(14.9, 17.1, 'Ele calcula quantos contratos <em>cabem no stop</em>'),
  cap(17.4, 19.6, '4 · Entrar <em>sem stop e alvo</em> na plataforma'),
  cap(19.7, 21.9, 'Stop e alvo saem <em>junto com a entrada</em>'),
  cap(22.2, 24.4, '5 · Sair por <em>medo ou ganância</em>'),
  cap(24.5, 26.7, 'RR favorável: o painel <em class="green">avisa em verde</em>')
], END(26.8, 'Cinco erros de risco, um painel.', DISC2), [1.5, 4.2, 6.4, 9, 11.2, 13.8, 16, 18.6, 20.8, 23.4, 25.6, 28.5]);

// ra08: antes e depois. Os prints 28, 29 e 33 têm o mesmo zoom: a câmera casa o histórico na troca
// (29 = 28 + (-132, -200); 33 = 29 + (-94, -171))
const ra08 = video('ra08-antes-e-depois', 24.9, [
  { t0: 0, img: '28.png', cam: cam([0, 640, 820, 1.4], [3.0, 600, 800, 1.6], [5.4, 600, 800, 1.6]),
    boxes: [box(R.p28Vah, 0.8, 3.0, 'VAH D e bloco vermelho', { color: RED, dx: -40 }),
      box(R.p28Bolha, 3.0, 5.2, 'Compra na resistência', { below: true, dx: -90 })] },
  { t0: 5.4, img: '29.png', cam: cam([5.4, 468, 600, 1.6], [8.0, 468, 600, 1.6], [9.0, 520, 660, 1.45]),
    boxes: [box(R.p29Stop, 5.9, 8.0, 'Stop', { color: RED, dx: -40 }), box(R.p29Entrada, 6.3, 8.0, 'Entrada', { below: true, dx: -40 }),
      box(R.p29Alvo, 8.6, 11.0, 'Alvo 5R', { color: GREEN, below: true, dx: -20 })] },
  { t0: 11.2, img: '33.png', cam: cam([11.2, 426, 489, 1.45], [13.0, 426, 489, 1.45], [14.2, 540, 470, 1.3]),
    boxes: [box(R.p33Pos, 12.0, 17.2, '+19,25 pontos', { color: GREEN }), box(R.p33Lmt, 12.6, 17.2, 'Alvo', { color: GREEN, below: true })] },
  { t0: 17.4, img: '31.png', cam: cam([17.4, 122, 138, 4.0], [21.4, 122, 132, 4.2]),
    boxes: [box(R.p31Box, 17.8, 21.4, '3R alcançado', { color: GREEN, below: true })] }
], [
  cap(0.2, 2.9, '<em>Antes:</em> o preço testa a VAH D e o bloco vermelho', 'Antes e depois'),
  cap(3.0, 5.3, 'Comprados comprando na resistência: <em>preparamos a venda</em>'),
  cap(5.6, 8.0, 'O plano: stop acima da VAH D, <em>US$250 de risco</em>'),
  cap(8.1, 11.1, 'Alvo em <em>5R</em>, na VAL D, e o risco cabe no teto'),
  cap(11.4, 14.1, '<em>Depois:</em> o preço desce até perto da VAL D'),
  cap(14.2, 17.3, '+19,25 pontos, com <em>stop e alvo</em> no lugar'),
  cap(17.6, 21.4, 'O painel acende em verde: <em>avalie realizar</em>')
], END(21.4, 'O plano antes. A saída com critério depois.', DISC2), [1.5, 4.2, 5.6, 7, 9.8, 11.4, 12.8, 15.8, 19.5, 23]);

// ra09: aula de 20 segundos, o que é R
const ra09 = video('ra09-o-que-e-r', 19.9, [
  { t0: 0, img: '29.png', cam: cam([0, 640, 620, 1.5], [6.0, 650, 630, 1.55]),
    boxes: [box(R.p29R1, 1.6, 6.0, '1R', { color: RED })] },
  { t0: 6.2, img: '29.png', cam: cam([6.2, 650, 630, 1.55], [7.0, 660, 680, 1.45]),
    boxes: [box(R.p29Escada, 6.6, 9.2, '1R a 5R', {}), box(R.p29Alvo, 9.3, 12.2, '5R', { color: GREEN, below: true, dx: -20 })] },
  { t0: 12.4, img: '25.png', cam: cam([12.4, 166, 160, 3.2], [16.4, 157, 160, 3.4]),
    boxes: [box(R.p25Venda, 12.8, 16.4, 'Plano em R', { color: GREEN, below: true, dx: 160 })] }
], [
  cap(0.2, 1.9, 'O que é <em>R</em>?', 'Aula de 20 segundos'),
  cap(2.0, 6.1, 'R é quanto você perde <em>se o stop for atingido</em>'),
  cap(6.4, 9.2, 'Aqui o stop está a 5 pontos: <em>1R = 5 pontos</em>'),
  cap(9.3, 12.3, 'Alvo em <em>5R</em> = 25 pontos, 5 vezes o risco'),
  cap(12.6, 14.5, 'Em R, todo trade fica <em>comparável</em>'),
  cap(14.6, 16.4, 'O GL Risk Auto mostra o R <em>antes do clique</em>')
], END(16.4, 'Pense em R antes de pensar em dinheiro.', DISC), [1, 4, 7.8, 10.8, 13.5, 15.5, 18]);

// ra10: o sistema completo operando (marca GL)
const ra10 = video('ra10-sistema-completo', 23.4, [
  { t0: 0, img: '34.png', cam: cam([0, 531, 299, 1.0], [5.0, 531, 299, 1.08]),
    boxes: [box(R.p34Painel, 2.6, 5.0, 'GL Risk Auto', { dx: 110 })] },
  { t0: 5.2, img: '34.png', cam: cam([5.2, 531, 299, 1.08], [6.2, 200, 150, 2.6], [10.2, 196, 150, 2.7]),
    boxes: [box(R.p34Box, 6.6, 10.2, '3R alcançado', { color: GREEN, below: true })] },
  { t0: 10.4, img: '34.png', cam: cam([10.4, 196, 150, 2.7], [11.4, 455, 430, 2.2], [15.4, 455, 430, 2.3]),
    boxes: [box(R.p34Stp, 11.8, 15.4, 'Stop', { color: RED }), box(R.p34Pos, 12.6, 15.4, '17,75 pontos', { below: true, dx: 60 }),
      box(R.p34Lmt, 12.2, 15.4, 'Alvo', { color: GREEN, below: true })] },
  { t0: 15.6, img: '34.png', cam: cam([15.6, 455, 430, 2.3], [16.6, 865, 270, 1.95], [19.8, 865, 270, 2.0]),
    boxes: [box(R.p34Cinco, 16.8, 19.8, 'Execução no 5 minutos', {})] }
], [
  cap(0.2, 2.5, 'O operacional completo, <em>operando</em>', 'GL Academy'),
  cap(2.6, 5.1, 'À esquerda, o <em>GL Risk Auto</em> cuidando do risco'),
  cap(5.4, 7.9, 'Em posição: <em class="green">3R alcançado</em>, avalie realizar'),
  cap(8.0, 10.3, 'Risco vivo, teto da conta e o plano, <em>ao vivo</em>'),
  cap(10.6, 13.0, 'No 30 minutos, o contexto e <em>as ordens</em>'),
  cap(13.1, 15.5, 'Stop e alvo na plataforma, <em>17,75 pontos</em> a favor'),
  cap(15.8, 17.9, 'No 5 minutos, <em>a execução</em>'),
  cap(18.0, 19.9, 'Do contexto à saída, <em>no mesmo sistema</em>')
], END(19.9, 'Contexto, risco e execução: o sistema GL completo.', DISC2, { brand: 'GL ACADEMY' }), [1.3, 3.8, 6.8, 9.2, 11.8, 14.3, 17, 19, 21.5]);

const principais = [v18, v19, ra01, ra02, ra03, ra04, ra05, ra06, ra07, ra08, ra09, ra10];

// Versões 4:5 (1080x1350) para o feed e os anúncios: a mesma câmera, quadro mais baixo
function feed(spec) {
  const s = JSON.parse(JSON.stringify(spec));
  s.id = spec.id + '-4x5'; s.h = 1350; s.ay = 830;
  s.scenes.forEach(sc => sc.cam.forEach(k => { k.z = +(k.z * 0.9).toFixed(3); }));
  s.stills = (s.captions || []).map(c => +((c.t0 + c.t1) / 2).toFixed(1)).concat([+(s.end.t0 + 1.5).toFixed(1)]);
  return s;
}
const feeds = [ra01, ra03, ra06, ra08, v19].map(feed);

// Coringas limpos: o mesmo movimento, sem legenda, sem caixas e sem cartela, para cobrir a fala do Giovane
function limpo(spec, id) {
  const s = JSON.parse(JSON.stringify(spec));
  s.id = id; s.captions = []; delete s.end; s.dur = +(spec.end.t0 + 0.4).toFixed(1);
  s.scenes.forEach(sc => { sc.boxes = []; });
  s.scenes[s.scenes.length - 1].t1 = s.dur;
  s.stills = [1.5, +(s.dur / 2).toFixed(1), +(s.dur - 1).toFixed(1)];
  return s;
}
const limpos = [limpo(v19, 'rl01-trade-completo-limpo'), limpo(ra01, 'rl02-bloqueio-limpo'), limpo(ra03, 'rl03-controle-limpo'),
  limpo(ra08, 'rl04-antes-e-depois-limpo'), limpo(ra10, 'rl05-sistema-completo-limpo')];

module.exports = [...principais, ...feeds, ...limpos];
module.exports.V = V;
