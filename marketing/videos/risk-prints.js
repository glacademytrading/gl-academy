// GL Risk Auto: o que cada print mostra e o que fica escondido. Coordenadas em pixels do print original (grade.js).
// Usado pelos roteiros do GL Risk Auto (specs-risk.js, specs-risk-16x9.js e specs-risk-posts.js).
// Fica escondido: setas desenhadas, alvos e resultados em dólar, saldo, dia e P/L da conta, o quanto falta em dólar
// para o sinal verde, o risco de um contrato novo quando ele revela o lucro aberto e a barra do Windows.
// Resultado só aparece em R ou em pontos, com "resultado passado não garante resultado futuro".

const HIDES = {
  // 22: o mapa do controle (321x711)
  '22.png': [],
  // 23: a aba Dados, conta e ativo (330x410)
  '23.png': [],
  // 24: "Configure a conta" (330x400)
  '24.png': [{ rect: [16, 336, 296, 50], color: '#0b0b0b' }],
  // 25: tela inteira com o plano pronto (1034x601): saldo, alvo em dólar no painel e no gráfico, barra do Windows
  '25.png': [{ rect: [4, 216, 126, 32], color: '#0b0b0b' }, { rect: [58, 162, 72, 9], color: '#0b0b0b' },
    { rect: [0, 574, 1034, 27], color: '#0b0b0b' }],
  // 26: o plano acima do teto no 5 minutos (1003x1479): as setas e o alvo em dólar
  '26.png': [{ rect: [858, 452, 95, 55], color: '#000000' }, { rect: [862, 580, 105, 65], color: '#000000' },
    { rect: [878, 888, 118, 66], color: '#000000' }, { rect: [378, 1300, 95, 62], color: '#000000' }, { rect: [784, 943, 72, 22] }],
  // 27: 30 minutos com o painel em planejamento (1244x1020)
  '27.png': [{ rect: [14, 362, 220, 48], color: '#050504' }],
  // 28: 5 minutos antes do trade (1013x1910)
  '28.png': [],
  // 29: o plano medido em R no 5 minutos (938x1192): o alvo 5R em dólar
  '29.png': [{ rect: [745, 918, 34, 15], color: '#230e13' }, { rect: [779, 918, 50, 15], color: '#040404' }],
  // 30: em posição no 30 minutos (1242x1020): "faltam US$ para o sinal verde" e saldo
  '30.png': [{ rect: [24, 82, 206, 23], color: '#18160f' }, { rect: [16, 396, 218, 48], color: '#050504' }],
  // 31: o painel em 3R (244x495): risco de um contrato novo (revela o lucro aberto) e saldo
  '31.png': [{ rect: [14, 306, 222, 14], color: '#050504' }, { rect: [12, 392, 226, 50], color: '#050504' }],
  // 32: 5 minutos em posição, 17,75 pontos (1013x1914)
  '32.png': [],
  // 33: 5 minutos em posição, 19,25 pontos, mesmo zoom do print 29 (848x1041)
  '33.png': [],
  // 34: o sistema completo (1062x598): painel, 30 e 5 minutos; saldo, risco do contrato novo e barra do Windows
  '34.png': [{ rect: [8, 216, 126, 32], color: '#050504' }, { rect: [72, 170, 62, 11], color: '#050504' },
    { rect: [0, 567, 722, 31], color: '#0f0f0f' }]
};
const hides = img => (HIDES[img] || []).map(h => ({ until: 999, ...h }));

// retângulos que os roteiros apontam
const R = {
  // 22: controle
  testar: [14, 40, 150, 14], gamepad: [60, 100, 200, 115],
  bAY: [20, 285, 262, 34], bStart: [20, 340, 262, 15], bStop: [20, 357, 262, 34], bAlvo: [20, 393, 262, 34],
  bSelect: [20, 455, 262, 24], bContr: [20, 497, 262, 34], bRR: [20, 569, 262, 34], bTeclado: [96, 698, 128, 12],
  // 23: Dados
  dConta: [18, 59, 291, 21], dAtivo: [18, 100, 291, 19], dDisarm: [18, 124, 291, 30], dModo: [18, 177, 291, 21],
  dProt: [18, 246, 270, 26], dTeto: [18, 281, 220, 27], dCap: [18, 315, 140, 27], dAuto: [18, 352, 258, 25],
  // 24: Configure a conta
  cfgBox: [19, 61, 291, 50], cfgPreset: [19, 164, 291, 21], cfgRR: [19, 229, 291, 26], cfgOri: [19, 302, 190, 27],
  // 25: plano pronto (painel pequeno)
  p25Box: [9, 33, 118, 29], p25Venda: [8, 156, 80, 8], p25Total: [6, 171, 112, 10], p25Cabem: [6, 180, 112, 9], p25Ori: [8, 199, 118, 16],
  // 26: acima do teto
  p26Stop: [583, 507, 268, 20], p26Entrada: [583, 643, 262, 16], p26Alvo: [583, 940, 160, 26],
  p26Caixa: [3, 1362, 346, 70], p26Atual: [3, 1383, 346, 14], p26Max: [3, 1399, 300, 15], p26Teto: [3, 1414, 280, 15],
  // 27: planejamento
  p27Box: [16, 56, 213, 51], p27Dia: [46, 82, 154, 12], p27Preset: [16, 160, 213, 20], p27RR: [16, 225, 213, 26],
  p27Teto: [16, 276, 100, 28], p27Ori: [16, 327, 192, 28], p27Topos: [[596, 262, 36, 34], [952, 448, 30, 30], [1030, 536, 26, 30]],
  p27Valor: [940, 676, 134, 34],
  // 28: antes
  p28Vah: [580, 600, 262, 44], p28Bolha: [796, 588, 60, 60],
  // 29: o plano
  p29Stop: [565, 399, 268, 16], p29Entrada: [565, 486, 262, 16], p29Alvo: [565, 917, 178, 18], p29R1: [565, 406, 213, 87],
  p29Escada: [552, 570, 230, 362], p29Vah: [700, 382, 80, 12],
  // 30: em posição
  p30Box: [18, 56, 213, 26], p30Risco: [16, 279, 214, 30], p30Cap: [16, 309, 214, 28], p30Ori: [16, 358, 200, 28],
  p30Stp: [780, 679, 88, 16], p30Pos: [866, 708, 84, 20], p30Lmt: [778, 871, 88, 16],
  // 31: 3R alcançado
  p31Box: [14, 54, 216, 54], p31Risco: [14, 276, 216, 27], p31Ori: [14, 354, 200, 30], p31RR: [16, 225, 212, 26],
  // 32 e 33: depois
  p32Stp: [546, 650, 86, 18], p32Pos: [632, 774, 86, 22], p32Lmt: [543, 1411, 90, 18],
  p33Stp: [377, 227, 90, 18], p33Pos: [464, 312, 86, 22], p33Lmt: [375, 746, 90, 18], p33ValD: [698, 690, 64, 12],
  // 34: sistema completo
  p34Painel: [6, 22, 130, 540], p34Box: [12, 34, 118, 29], p34Stp: [431, 375, 50, 12], p34Pos: [479, 391, 49, 15],
  p34Lmt: [430, 481, 51, 13], p34Cinco: [722, 60, 280, 440], p34Trinta: [140, 22, 520, 520]
};

const DISC = 'Risco estimado no stop; custos e slippage não incluídos. Conteúdo educacional: trading envolve risco financeiro real.';
const DISC2 = 'Exemplo educacional em replay; resultado passado não garante resultado futuro. Risco estimado no stop; custos e slippage não incluídos. Trading envolve risco financeiro real.';
const DISC_MESA = 'Aprovação em mesa proprietária depende de você e das regras de cada mesa. Risco estimado no stop; custos e slippage não incluídos. Trading envolve risco financeiro real.';

module.exports = { HIDES, hides, R, DISC, DISC2, DISC_MESA };
