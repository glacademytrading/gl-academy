# Página Campanha GL Risk Auto (página irmã da Biblioteca): os vídeos, as imagens, o plano, os textos dos anúncios e os
# roteiros do GL Risk Auto, com o dia de postar, as legendas, os títulos do YouTube e o ZIP organizado nas mesmas pastas do
# pacote da Biblioteca. Vídeos: render.js com specs-risk.js, specs-risk-16x9.js e specs-risk-aulas.js; imagens: posts.js com
# specs-risk-posts.js. Grava também ../execucao/calendario-gl-risk-auto.csv e ../execucao/anuncios-gl-risk-auto.csv.
# Uso: python3 kit_risk.py (a página sai em risk/index.html, com os vídeos leves em risk/v e as capas em risk/p).
import datetime, html, json, os, re, shutil, subprocess

ROOT = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(ROOT, 'out')
PAG = os.path.join(ROOT, 'risk')
MKT = os.environ.get('GL_MARKETING') or os.path.dirname(ROOT)
IMAGEIO_FF = '/usr/local/lib/python3.11/dist-packages/imageio_ffmpeg/binaries/ffmpeg-linux-x86_64-v7.0.2'
FF = os.environ.get('FFMPEG') or (IMAGEIO_FF if os.path.exists(IMAGEIO_FF) else 'ffmpeg')
BIBLIOTECA = 'https://claude.ai/artifact/BgpMsKZZn2BikAYBcXSDfm'
KIT = 'https://claude.ai/artifact/AVHWWSnHp4TPyVGiCm2tsp'
NOME_ZIP = 'GL Academy - GL Risk Auto (Claude).zip'
VID = '02 - Vídeos (feitos pelo Claude)/17 - GL Risk Auto'
IMG = '03 - Imagens (feitas pelo Claude)/11 - GL Risk Auto'
EST = '01 - Estratégia e planejamento'
TXT = '05 - Roteiros, legendas e textos'
BASE_WIN = r'C:\Users\Giovane Lazaro\Desktop\Arquivos e Programas\GL Academy organização\Trading\Marketing de trading' + '\\'
CRF = '25'
DIAS = ['seg', 'ter', 'qua', 'qui', 'sex', 'sáb', 'dom']
FUNIL = '[link do funil]'
esc = lambda s: html.escape(str(s), quote=True)

AV_RISCO = 'Risco estimado no stop; custos e slippage não incluídos. Conteúdo educacional: trading envolve risco financeiro real.'
AV_REPLAY = 'Exemplo educacional em replay; resultado passado não garante resultado futuro. Risco estimado no stop; custos e slippage não incluídos. Trading envolve risco financeiro real.'
AV_MESA = 'Aprovação em mesa proprietária depende de você e das regras de cada mesa. Risco estimado no stop; custos e slippage não incluídos. Trading envolve risco financeiro real.'
CALL = 'Call 1x1 gratuita no link da bio.'
TAGS = '#gestaoderisco #daytrade #ninjatrader #mercadofuturo #glacademy'
TAGS_MESA = '#mesaproprietaria #propfirm #daytrade #gestaoderisco #glacademy'


def leg(*partes, aviso=AV_RISCO, tags=TAGS):
    return '\n\n'.join([*partes, aviso, tags])


# ------------------------------------------------------------------------------------------------ vídeos verticais
REELS = [
    dict(id='ra01-bloqueado', titulo='Este trade não passou', trilha='Atrair', sub='O plano acima do teto da conta, barrado antes da ordem.',
         yt='Este trade não passou: o teto de risco da conta | GL Risk Auto',
         leg=leg('Este trade não passou pelo GL Risk Auto.',
                 'O plano era uma venda no ES com alvo em 2,26R. Mas o stop ficou longe: US$387,50 de risco para um teto de US$285,71 na conta. O painel marcou "acima do teto" e barrou a entrada.',
                 'Com outro plano, US$225 de risco: plano pronto, e o START confirma. Se não cabe no teto, não entra.',
                 'Quer ver o GL Risk Auto na sua conta? ' + CALL)),
    dict(id='ra02-quanto-perde', titulo='Quanto você perde?', trilha='Atrair', sub='O risco no stop e a escada de 1R a 5R, antes do clique.',
         yt='Se o stop for atingido, quanto você perde? | GL Risk Auto',
         leg=leg('Se o stop for atingido, quanto você perde?',
                 'Se demorou para responder, o risco não estava definido. No GL Risk Auto, a resposta está no gráfico: o stop com o risco em dólar e a escada de 1R a 5R. Aqui, 5 pontos de stop, US$250 em 1 contrato, e o alvo de 5R a 25 pontos.',
                 'E o painel confere se o plano cabe no teto da conta antes do clique.', 'Salve para lembrar no próximo trade. ' + CALL)),
    dict(id='ra03-controle', titulo='Sim, é um controle', trilha='Atrair', sub='Cada botão faz uma coisa, sempre dentro do teto.',
         yt='Sim, é um controle: day trade dentro do risco | GL Risk Auto',
         leg=leg('Sim, é um controle.',
                 'No GL Risk Auto, cada botão faz uma coisa: A planeja a compra, Y a venda, START confirma, SELECT cancela. Stop e alvo andam 1 tick por toque, e o R:R vai de 1R a 5R num botão.',
                 'Dá para treinar sem enviar ordens. E o plano acima do teto da conta é bloqueado. Prefere teclado? Os atalhos usam CTRL + SHIFT.', CALL,
                 tags='#ninjatrader #daytrade #gestaoderisco #setupdetrader #glacademy')),
    dict(id='ra04-quantos-contratos', titulo='1 contrato ou 2?', trilha='Ensinar', sub='Quantos contratos cabem no stop, e quando não cabe nenhum.',
         yt='1 contrato ou 2? Quem decide é o stop | GL Risk Auto',
         leg=leg('1 contrato ou 2? Quem decide é o stop.',
                 'O GL Risk Auto calcula quantos contratos cabem no teto da conta: com US$225 de risco, cabe 1. Com o stop mais longe, US$387,50, não cabe nenhum, e a entrada é barrada. Em posição, ele avisa quando não há capacidade para mais um.',
                 'A mão não cresce no impulso.', 'Salve e comente: você define o tamanho da mão antes ou depois de entrar?')),
    dict(id='ra05-sinal-verde', titulo='Quando realizar?', trilha='Ensinar', sub='O sinal verde: o painel avisa, a decisão é sua.',
         yt='Quando realizar? O sinal verde do GL Risk Auto',
         leg=leg('Quando realizar?',
                 'Em posição, o GL Risk Auto mede o trade em R, ao vivo. Quando o risco x retorno fica a favor, o painel acende em verde: aqui, 3R alcançado, 3,37R do risco orientado. "Avalie realizar."',
                 'O verde não manda sair. Ele avisa. A decisão é sua, com critério.', CALL, aviso=AV_REPLAY)),
    dict(id='ra06-mesa-proprietaria', titulo='Mesa proprietária', trilha='Atrair · mesa', sub='O limite do dia, o preset de mesa e o teto por trade na tela.',
         yt='Mesa proprietária: as regras na tela antes do clique | GL Risk Auto',
         leg=leg('Na mesa proprietária, quebrar a regra custa a conta.',
                 'O GL Risk Auto põe as regras na tela antes do primeiro trade: o limite do dia, o preset da conta de mesa e o teto por trade. O auto risco aplica depois de cada trade fechado. E o plano acima do teto não passa, nem quando a vontade de recuperar fala mais alto.',
                 'Quer ver com as regras da sua conta? ' + CALL, aviso=AV_MESA, tags=TAGS_MESA)),
    dict(id='ra07-5-erros', titulo='5 erros de risco', trilha='Atrair', sub='Cinco erros que quebram conta e o que o painel faz em cada um.',
         yt='5 erros de risco que quebram conta | GL Risk Auto',
         leg=leg('5 erros de risco que quebram conta, e o que o GL Risk Auto faz em cada um:',
                 '1. Entrar sem saber quanto perde: o risco no stop aparece antes do clique.\n2. Stop longe demais: acima do teto, não passa.\n3. Mão maior do que cabe: ele calcula quantos contratos cabem no stop.\n4. Entrar sem stop e alvo na plataforma: stop e alvo saem junto com a entrada.\n5. Sair por medo ou ganância: com o RR favorável, o painel avisa em verde.',
                 'Qual desses já te custou mais? Comente.', aviso=AV_REPLAY)),
    dict(id='ra08-antes-e-depois', titulo='Antes e depois', trilha='Ensinar', sub='O mesmo gráfico antes do plano, com o plano e em posição.',
         yt='Antes e depois: o mesmo trade com o risco medido | GL Risk Auto',
         leg=leg('Antes e depois, no mesmo gráfico.',
                 'Antes: o preço testa a VAH D e o bloco vermelho, com compras agressivas na resistência. O plano: stop acima da VAH D (US$250 de risco, dentro do teto) e alvo de 5R na VAL D.',
                 'Depois: o preço desce até perto da VAL D, +19,25 pontos, com stop e alvo na plataforma. E o painel acende em verde: avalie realizar.',
                 'O plano antes. A saída com critério depois.', aviso=AV_REPLAY, tags='#daytrade #orderflow #gestaoderisco #ninjatrader #glacademy')),
    dict(id='ra09-o-que-e-r', titulo='O que é R?', trilha='Ensinar', sub='Aula de 20 segundos: a unidade de risco.',
         yt='O que é R? Aula de 20 segundos | GL Risk Auto',
         leg=leg('O que é R? Aula de 20 segundos.',
                 'R é quanto você perde se o stop for atingido. Aqui, o stop está a 5 pontos: 1R = 5 pontos (US$250 em 1 contrato no ES). O alvo em 5R fica a 25 pontos: 5 vezes o risco.',
                 'Em R, todo trade fica comparável, de qualquer tamanho. O GL Risk Auto mostra o R do plano antes do clique.', 'Salve para estudar.')),
    dict(id='ra10-sistema-completo', titulo='O sistema completo', trilha='Marca GL', sub='O painel, o 30 e o 5 minutos na mesma tela.',
         yt='O operacional completo da GL Academy, operando',
         leg=leg('O operacional completo, operando.',
                 'À esquerda, o GL Risk Auto: 3R alcançado, com o risco vivo e o teto da conta. No 30 minutos, o contexto e as ordens. No 5 minutos, a execução.',
                 'Contexto, risco e execução no mesmo sistema. É isso que a GL entrega.', CALL, aviso=AV_REPLAY)),
    dict(id='v19-risk-auto-trade', titulo='Do começo ao fim', trilha='Ensinar e converter', sub='Um trade inteiro em 5 passos, do contexto ao sinal verde.',
         yt='Um trade do começo ao fim, com o risco medido | GL Risk Auto',
         leg=leg('Um trade do começo ao fim, com o risco medido antes do clique.',
                 '1. Contexto: topos mais baixos no 30 minutos (7.810, 7.780 e 7.768) e o preço de volta à região de valor.\n2. Região: no 5 minutos, o preço testa a VAH D e o bloco vermelho.\n3. Fluxo: comprados comprando na resistência. Preparamos a venda.\n4. Risco: US$250 no stop e alvo em 5R na VAL D. Dentro do teto, entrada autorizada, com stop e alvo na plataforma.\n5. Saída: com o RR favorável, o painel acende em verde. Avalie realizar.',
                 'Salve para estudar. ' + CALL, aviso=AV_REPLAY, tags='#daytrade #orderflow #gestaoderisco #ninjatrader #glacademy')),
    dict(id='v18-risk-auto-teto', titulo='O teto de risco', trilha='Converter', sub='O risco medido antes do clique, o teto e o controle.',
         yt='O risco medido antes do clique | GL Risk Auto',
         leg=leg('O risco medido antes do clique.',
                 'Uma venda planejada com alvo em 2,26R. O risco no stop era de US$387,50, e o teto da conta, US$285,71: o trade não passa. Dentro da gestão, aparece "plano pronto" e o START do controle confirma.',
                 'Tudo pelo controle, sem planilha e sem conta de cabeça.', 'Quer ver o GL Risk Auto na sua conta? ' + CALL)),
]
FEED = ['ra01-bloqueado', 'ra03-controle', 'ra06-mesa-proprietaria', 'ra08-antes-e-depois', 'v19-risk-auto-trade']

YOUTUBE = [
    dict(id='yt-b1-bloqueado', titulo='Bumper · Se não cabe, não entra', fmt='Bumper de 6 s, não pulável', fase='Alcance',
         curto='Se não cabe, não entra', longo='GL Risk Auto: o trade acima do teto da sua conta não passa', desc='Gestão de risco automática no NinjaTrader. Call 1x1 gratuita.'),
    dict(id='yt-b2-risco-antes', titulo='Bumper · Risco antes do clique', fmt='Bumper de 6 s, não pulável', fase='Alcance',
         curto='Risco antes do clique', longo='O risco em dólar e em R no gráfico, antes de você entrar', desc='Gestão de risco automática no NinjaTrader. Call 1x1 gratuita.'),
    dict(id='yt-b3-sinal-verde', titulo='Bumper · O verde avisa', fmt='Bumper de 6 s, não pulável', fase='Alcance',
         curto='O verde avisa', longo='RR favorável: o painel acende em verde. A decisão continua sua', desc='Gestão de risco automática no NinjaTrader. Call 1x1 gratuita.'),
    dict(id='yt-b4-sistema-completo', titulo='Bumper · O sistema completo', fmt='Bumper de 6 s, não pulável', fase='Alcance',
         curto='O sistema GL completo', longo='Contexto, risco e execução na mesma tela, com o GL Risk Auto', desc='O operacional completo da GL Academy. Call 1x1 gratuita.'),
    dict(id='yt-15-bloqueado', titulo='15 s · Este trade não passou', fmt='In-stream de 15 s', fase='Consideração',
         curto='Este trade não passou', longo='O plano acima do teto da conta foi barrado antes da ordem', desc='Gestão de risco automática no NinjaTrader. Call 1x1 gratuita.'),
    dict(id='yt-15-mesa-proprietaria', titulo='15 s · Mesa proprietária', fmt='In-stream de 15 s', fase='Consideração',
         curto='Regras da mesa na tela', longo='Limite do dia e teto por trade antes do clique, com o GL Risk Auto', desc='Aprovação depende de você e das regras da mesa. Call 1x1 gratuita.'),
    dict(id='yt-30-trade-completo', titulo='30 s · Do contexto à saída', fmt='In-stream de 30 s, pulável', fase='Conversão',
         curto='Do contexto à saída', longo='Um trade do começo ao fim, com o risco medido antes do clique', desc='Gestão de risco automática no NinjaTrader. Call 1x1 gratuita.'),
]

AULAS = [
    dict(id='m20-risco-do-contexto-ao-verde', tipo='mentoria', n='Aula 20', curto='Do contexto ao sinal verde', thumb='thumb-ra-m20',
         sub='Uma venda no ES do começo ao fim, com pausas para o aluno decidir.',
         yt='Do contexto ao sinal verde: um trade com gestão de risco | Mentoria GL, aula 20',
         ytd='Uma venda no ES do começo ao fim, em replay: o contexto no 30 minutos, a VAH D e o bloco vermelho no 5 minutos, os comprados na resistência, o risco medido em R pelo GL Risk Auto, a entrada autorizada dentro do teto da conta, stop e alvo na plataforma e a saída com o sinal verde.\n\nO vídeo para nas perguntas: pause e decida antes de ver a resposta.\n\nQuer ver o GL Risk Auto na sua conta? Agende a call 1x1 gratuita: ' + FUNIL + '\n\n' + AV_REPLAY,
         leg=leg('Um trade do começo ao fim, com o risco medido (Mentoria GL, aula 20).',
                 'Contexto no 30 minutos, a VAH D e o bloco vermelho no 5 minutos, comprados na resistência, o risco medido em R, a entrada autorizada dentro do teto e a saída com o sinal verde. Pare nas perguntas e responda nos comentários antes de ver.',
                 'Salve para estudar. ' + CALL, aviso=AV_REPLAY)),
    dict(id='m21-teto-e-tamanho-de-posicao', tipo='mentoria', n='Aula 21', curto='Teto de risco e tamanho de posição', arq='Teto e tamanho de posição', thumb='thumb-ra-m21',
         sub='De onde vem o teto, quantos contratos cabem e por que a mão não cresce no impulso.',
         yt='Teto de risco e tamanho de posição: quantos contratos cabem? | Mentoria GL, aula 21',
         ytd='De onde vem o teto por trade, o auto risco depois de cada trade fechado, por que o plano acima do teto não passa e como o GL Risk Auto calcula quantos contratos cabem no stop.\n\nO vídeo para nas perguntas: pause e decida antes de ver a resposta.\n\nAgende a call 1x1 gratuita: ' + FUNIL + '\n\n' + AV_MESA,
         leg=leg('1 contrato ou 2? Quem decide é o stop (Mentoria GL, aula 21).',
                 'De onde vem o teto por trade, por que o plano acima do teto não passa e como o painel calcula quantos contratos cabem no stop. A mão não cresce no impulso.',
                 'Salve para estudar.', aviso=AV_MESA, tags=TAGS_MESA)),
    dict(id='t01-primeiros-passos', tipo='tutorial', n='Tutorial 1', curto='Primeiros passos', thumb='thumb-ra-t01',
         sub='Conta, ativo, modo, plano de risco e preset: do aviso "Configure a conta" ao planejamento.',
         yt='GL Risk Auto: primeiros passos (conta, ativo e preset) | Tutorial 1',
         ytd='Como configurar o GL Risk Auto no NinjaTrader: o aviso "Configure a conta", a aba Dados (conta, ativo, modo GLBracket, plano de risco e auto risco), o preset GL e os botões de 1R a 5R, até o painel em planejamento.\n\nPratique na conta simulada ou no replay.\n\n' + AV_RISCO,
         leg=leg('GL Risk Auto, tutorial 1: primeiros passos.',
                 'Do aviso "Configure a conta" ao painel em planejamento: conta, ativo, modo GLBracket, plano de risco, auto risco e o preset GL.',
                 'Salve para consultar quando for configurar.')),
    dict(id='t02-planejar-conferir-confirmar', tipo='tutorial', n='Tutorial 2', curto='Planejar, conferir e confirmar', thumb='thumb-ra-t02',
         sub='A e Y planejam, o plano em R no gráfico, o ajuste fino e o START.',
         yt='GL Risk Auto: planejar, conferir e confirmar um trade | Tutorial 2',
         ytd='Do plano ao trade no GL Risk Auto: A planeja compra e Y planeja venda, o plano em R no gráfico com o risco no stop, o ajuste de stop e alvo pelo controle, plano pronto com o START e o que acontece acima do teto.\n\nPratique na conta simulada ou no replay.\n\n' + AV_RISCO,
         leg=leg('GL Risk Auto, tutorial 2: planejar, conferir e confirmar.',
                 'A compra, Y venda; confira o plano em R no gráfico; ajuste stop e alvo pelo controle; plano pronto, START confirma. Acima do teto, a entrada é barrada.',
                 'Salve para consultar.')),
    dict(id='t03-controle-e-teclado', tipo='tutorial', n='Tutorial 3', curto='O controle e o teclado', thumb='thumb-ra-t03',
         sub='O mapa do controle botão por botão, o treino sem ordens e o teclado.',
         yt='GL Risk Auto: o controle e o teclado, botão por botão | Tutorial 3',
         ytd='O mapa do controle do GL Risk Auto: testar botões sem enviar ordens, A, Y e START, stop e alvo 1 tick por toque, SELECT, contratos e R:R, e os atalhos no teclado com CTRL + SHIFT.\n\nPratique na conta simulada ou no replay.\n\n' + AV_RISCO,
         leg=leg('GL Risk Auto, tutorial 3: o controle e o teclado.',
                 'Treino sem ordens, A, Y e START, stop e alvo 1 tick por toque, SELECT, contratos e R:R, e os atalhos no teclado com CTRL + SHIFT.',
                 'Salve para consultar.')),
    dict(id='t04-estados-do-painel', tipo='tutorial', n='Tutorial 4', curto='Os estados do painel', thumb='thumb-ra-t04',
         sub='Configure a conta, planejamento, plano pronto ou acima do teto, em posição e o sinal verde.',
         yt='GL Risk Auto: os estados do painel | Tutorial 4',
         ytd='Os seis estados do GL Risk Auto e o que fazer em cada um: configure a conta, planejamento, plano pronto, acima do teto, em posição e o sinal verde.\n\nPratique na conta simulada ou no replay.\n\n' + AV_REPLAY,
         leg=leg('GL Risk Auto, tutorial 4: os estados do painel.',
                 'Configure a conta, planejamento, plano pronto ou acima do teto, em posição e o sinal verde. O que o painel está te dizendo em cada um.',
                 'Salve para consultar.', aviso=AV_REPLAY)),
]

CORINGAS = [
    dict(id='rl01-trade-completo-limpo', titulo='Trade completo', fmt='9x16', sub='O trade inteiro, do contexto ao sistema completo.'),
    dict(id='rl02-bloqueio-limpo', titulo='O bloqueio', fmt='9x16', sub='O plano acima do teto e o plano pronto.'),
    dict(id='rl03-controle-limpo', titulo='O controle', fmt='9x16', sub='O mapa do controle e o bloqueio.'),
    dict(id='rl04-antes-e-depois-limpo', titulo='Antes e depois', fmt='9x16', sub='O mesmo gráfico antes, com o plano e em posição.'),
    dict(id='rl05-sistema-completo-limpo', titulo='Sistema completo', fmt='9x16', sub='O painel, o 30 e o 5 minutos.'),
    dict(id='yl01-trade-completo-16x9-limpo', titulo='Trade completo (horizontal)', fmt='16x9', sub='Para o vídeo longo do YouTube.'),
    dict(id='yl02-sistema-completo-16x9-limpo', titulo='Sistema completo (horizontal)', fmt='16x9', sub='A tela inteira, com um passeio lento.'),
]

# ------------------------------------------------------------------------------------------------ imagens
LEG_CAR = {
    'car-ra-trade': leg('Um trade do começo ao fim, com o risco medido antes do clique. Arraste e pare no slide da pergunta: você venderia ali? Onde ficaria o stop? Comente antes de ver.',
                        'O passo a passo:\n• Contexto: topos mais baixos no 30 minutos\n• Região: VAH D e bloco vermelho\n• Fluxo: comprados na resistência\n• Risco: US$250 no stop, alvo de 5R na VAL D e a entrada autorizada dentro do teto\n• Saída: o sinal verde, avalie realizar',
                        'Salve para estudar. O trade completo em vídeo está no perfil. ' + CALL, aviso=AV_REPLAY),
    'car-ra-dores': leg('6 problemas de risco que custam a conta, e o que o GL Risk Auto faz com cada um:',
                        '1. Não saber quanto perde: o risco no stop, em dólar e em R, antes do clique.\n2. Stop longe demais: acima do teto da conta, o plano não passa.\n3. Mão maior do que cabe: o painel calcula quantos contratos cabem no stop.\n4. Sem stop e alvo na plataforma: stop e alvo saem junto com a entrada.\n5. Querer recuperar: o limite do dia na tela e o teto valendo para todo plano.\n6. Sair por medo ou ganância: com o RR favorável, o painel acende em verde.',
                        'Qual deles já te custou mais? Comente. ' + CALL, aviso=AV_REPLAY),
    'car-ra-mesa': leg('Na mesa proprietária, quebrar a regra custa a conta. Como o GL Risk Auto põe as regras na tela:',
                       '• O limite do dia antes do primeiro trade\n• O preset da conta de mesa\n• O teto por trade calculado, com o auto risco depois de cada trade fechado\n• Acima do teto, o plano não passa\n• Dentro da regra, plano pronto: o START confirma',
                       'Quer ver com as regras da sua conta? ' + CALL, aviso=AV_MESA, tags=TAGS_MESA),
    'car-ra-r': leg('O que é R? A unidade de risco que deixa todo trade comparável.',
                    '• 1R é quanto você perde se o stop for atingido (aqui, 5 pontos: US$250 em 1 contrato no ES)\n• Cada degrau da escada é 1R\n• Alvo em 5R: 25 pontos, 5 vezes o risco\n• O GL Risk Auto mostra o R do plano antes do clique',
                    'Salve para estudar.'),
    'car-ra-estados': leg('O que o painel do GL Risk Auto está te dizendo, em 6 estados:',
                          '1. Configure a conta: falta escolher conta e ativo\n2. Planejamento: o dia e o limite diário na tela\n3. Plano pronto: cabe no teto, e o START confirma\n4. Acima do teto: a entrada é barrada\n5. Em posição: o trade medido em R, ao vivo\n6. Sinal verde: RR favorável, avalie realizar',
                          'Salve para consultar. Os tutoriais completos estão no YouTube.'),
    'car-ra-controle': leg('O controle do GL Risk Auto, botão por botão:',
                           '• A e Y planejam, START confirma\n• LB e LT movem o stop 1 tick; RB e RT, o alvo\n• SELECT cancela o desenho (sem plano, fecha a posição)\n• R3 e L3 somam ou tiram 1 contrato; BAIXO e CIMA trocam o R:R\n• Testar botões: treino sem enviar ordens\n• Sem controle? Os atalhos usam CTRL + SHIFT',
                           'Salve para consultar.'),
    'car-ra-faq': leg('As perguntas que a gente mais ouve sobre o GL Risk Auto:',
                      '1. Ele opera por mim? Não. Você planeja, confere e confirma.\n2. Preciso de um controle? Não. Os atalhos também funcionam no teclado.\n3. Funciona em conta de mesa? Tem presets para conta de mesa, com teto por trade e limite do dia. Confira sempre as regras da sua mesa.\n4. Dá para treinar sem risco? Sim: "Testar botões" não envia ordens, e o painel funciona na conta simulada e no replay.\n5. Os custos entram na conta? Não: o risco é estimado no stop, sem custos e slippage.\n6. Onde está o GL Risk Auto? No Operacional Completo, para NinjaTrader.',
                      'Ficou outra dúvida? Pergunte nos comentários ou na call 1x1 gratuita (link na bio).'),
}
STORY_LINK = {'teto': 'o Reels "Este trade não passou"', 'venda': 'o Reels "Do começo ao fim"', 'realiza': 'o Reels "Antes e depois"',
              'contratos': 'o Reels "1 contrato ou 2?"', 'botao': 'o tutorial 3 no YouTube'}
SOLTOS = {'st-ra-caixinha': ('Caixinha: dificuldade com risco', 'Figurinha Perguntas no espaço tracejado. As respostas viram conteúdo.'),
          'st-ra-reels': ('Novo no perfil', 'Figurinha Link com o primeiro Reels do GL Risk Auto.'),
          'st-ra-youtube': ('Tutorial novo no YouTube', 'Figurinha Link com o vídeo do YouTube.')}
NOMES_THUMB = {'thumb-ra-trade-completo': 'Um trade completo com gestão de risco', 'thumb-ra-bloqueado': 'O trade que não passou',
               'thumb-ra-m20': 'Aula 20 - Do contexto ao sinal verde', 'thumb-ra-m21': 'Aula 21 - Quantos contratos cabem',
               'thumb-ra-t01': 'Tutorial 1 - Primeiros passos', 'thumb-ra-t02': 'Tutorial 2 - Planejar, conferir e confirmar',
               'thumb-ra-t03': 'Tutorial 3 - O controle botão por botão', 'thumb-ra-t04': 'Tutorial 4 - O que o painel está dizendo'}
NOMES_FRASE = {'frase-ra-teto': 'Se não cabe no teto, não entra', 'frase-ra-verde': 'O verde não manda sair', 'frase-ra-plano': 'Plano primeiro, botão depois',
               'frase-ra-r': 'Pense em R antes de pensar em dinheiro'}

# ------------------------------------------------------------------------------------------------ anúncios
URL_META = FUNIL + '?utm_source=meta&utm_medium=pago&utm_campaign={{campaign.name}}&utm_term={{adset.name}}&utm_content={{ad.name}}'
URL_YT = FUNIL + '?utm_source=youtube&utm_medium=pago&utm_campaign={campaignid}&utm_term={adgroupid}&utm_content={creative}'
META_ADS = [
    dict(nome='riskauto_reel-feed_bloqueado_v1', camp='q4-2026_captacao-call_advantage', conj='amplo-interesses_br_25-54', v='ra01-bloqueado', f='ra01-bloqueado-4x5',
         texto='Se o stop for atingido, você sabe quanto perde? No GL Risk Auto, o risco aparece no gráfico antes do clique, e o plano acima do teto da conta não passa. Este aqui foi barrado: US$387,50 de risco para um teto de US$285,71. Call 1x1 gratuita para ver na sua conta. ' + AV_RISCO,
         titulo='Se não cabe no teto, não entra', desc='Call 1x1 gratuita'),
    dict(nome='riskauto_reel-feed_mesa_v1', camp='q4-2026_captacao-call_advantage', conj='amplo-interesses_br_25-54', v='ra06-mesa-proprietaria', f='ra06-mesa-proprietaria-4x5',
         texto='Na mesa proprietária, quebrar a regra custa a conta. O GL Risk Auto mostra o limite do dia e o teto por trade antes do clique, com presets para conta de mesa, e barra o plano acima do teto. Call 1x1 gratuita para ver com as regras da sua conta. ' + AV_MESA,
         titulo='As regras da mesa na tela', desc='Call 1x1 gratuita'),
    dict(nome='riskauto_reel-feed_controle_v1', camp='q4-2026_captacao-call_advantage', conj='amplo-interesses_br_25-54', v='ra03-controle', f='ra03-controle-4x5',
         texto='Sim, é um controle. No GL Risk Auto, A planeja a compra, Y a venda e START confirma, sempre dentro do teto de risco da conta. Stop e alvo andam 1 tick por toque, e dá para treinar sem enviar ordens. Call 1x1 gratuita para ver na sua conta. ' + AV_RISCO,
         titulo='Day trade pelo controle', desc='Call 1x1 gratuita'),
    dict(nome='riskauto_reel_sinal-verde_v1', camp='q4-2026_remarketing_call', conj='video50-engajou180-visitou-funil', v='ra05-sinal-verde', f=None,
         texto='Quando realizar? Em posição, o GL Risk Auto mede o trade em R, ao vivo, e acende em verde quando o risco x retorno fica a favor. Ele avisa; a decisão é sua. Tire suas dúvidas na call 1x1 gratuita. ' + AV_REPLAY,
         titulo='O verde avisa', desc='Call 1x1 gratuita'),
    dict(nome='riskauto_reel-feed_antes-e-depois_v1', camp='q4-2026_remarketing_call', conj='video50-engajou180-visitou-funil', v='ra08-antes-e-depois', f='ra08-antes-e-depois-4x5',
         texto='Antes: o preço testa a VAH D, com compras agressivas na resistência. O plano: US$250 de risco, dentro do teto, e alvo de 5R. Depois: o preço vai até perto da VAL D. O plano antes, a saída com critério depois. Call 1x1 gratuita. ' + AV_REPLAY,
         titulo='O plano antes do clique', desc='Call 1x1 gratuita'),
    dict(nome='riskauto_reel-feed_trade-completo_v1', camp='q4-2026_remarketing_call', conj='video50-engajou180-visitou-funil', v='v19-risk-auto-trade', f='v19-risk-auto-trade-4x5',
         texto='Um trade do começo ao fim: contexto, região, fluxo, risco medido e saída, com o GL Risk Auto. Veja os 5 passos e agende a call 1x1 gratuita para ver na sua conta. ' + AV_REPLAY,
         titulo='Do contexto à saída', desc='Call 1x1 gratuita'),
]
YT_CAMP = {'Alcance': 'q4-2026_youtube-riskauto_alcance', 'Consideração': 'q4-2026_youtube-riskauto_consideracao', 'Conversão': 'q4-2026_youtube-riskauto_conversao'}

# ------------------------------------------------------------------------------------------------ calendário
AGENDA = [
    ('2026-10-10', '12:00', 'story', 'st-ra-teto-enquete'), ('2026-10-10', '19:00', 'reels', 'ra01-bloqueado'), ('2026-10-10', '21:00', 'story', 'st-ra-reels'),
    ('2026-10-11', '10:00', 'youtube', 'm20-risco-do-contexto-ao-verde'), ('2026-10-11', '11:00', 'story', 'st-ra-youtube'),
    ('2026-10-11', '12:00', 'story', 'st-ra-teto-resposta'), ('2026-10-11', '19:00', 'reels', 'ra02-quanto-perde'),
    ('2026-10-12', '08:00', 'anuncio', 'meta'),
    ('2026-10-14', '12:00', 'carrossel', 'car-ra-trade'), ('2026-10-14', '15:00', 'story', 'st-ra-caixinha'),
    ('2026-10-17', '12:00', 'story', 'st-ra-venda-enquete'), ('2026-10-17', '19:00', 'reels', 'v19-risk-auto-trade'),
    ('2026-10-18', '10:00', 'youtube', 't01-primeiros-passos'), ('2026-10-18', '10:30', 'youtube', 't02-planejar-conferir-confirmar'),
    ('2026-10-18', '12:00', 'story', 'st-ra-venda-resposta'), ('2026-10-18', '19:00', 'reels', 'ra03-controle'),
    ('2026-10-19', '08:00', 'anuncio', 'youtube'),
    ('2026-10-21', '12:00', 'carrossel', 'car-ra-mesa'),
    ('2026-10-24', '12:00', 'story', 'st-ra-realiza-enquete'), ('2026-10-24', '19:00', 'reels', 'ra06-mesa-proprietaria'),
    ('2026-10-25', '10:00', 'youtube', 'm21-teto-e-tamanho-de-posicao'), ('2026-10-25', '10:30', 'youtube', 't03-controle-e-teclado'),
    ('2026-10-25', '12:00', 'story', 'st-ra-realiza-resposta'), ('2026-10-25', '19:00', 'reels', 'ra08-antes-e-depois'),
    ('2026-10-28', '12:00', 'carrossel', 'car-ra-dores'),
    ('2026-10-31', '12:00', 'story', 'st-ra-contratos-enquete'), ('2026-10-31', '19:00', 'reels', 'ra05-sinal-verde'),
    ('2026-11-01', '10:00', 'youtube', 't04-estados-do-painel'), ('2026-11-01', '12:00', 'story', 'st-ra-contratos-resposta'),
    ('2026-11-01', '19:00', 'reels', 'ra10-sistema-completo'),
    ('2026-11-03', '19:00', 'reels', 'm20-risco-do-contexto-ao-verde-9x16'),
    ('2026-11-04', '12:00', 'carrossel', 'car-ra-r'), ('2026-11-04', '19:00', 'reels', 'ra04-quantos-contratos'),
    ('2026-11-07', '12:00', 'story', 'st-ra-botao-enquete'), ('2026-11-07', '19:00', 'reels', 'ra07-5-erros'),
    ('2026-11-08', '12:00', 'story', 'st-ra-botao-resposta'), ('2026-11-08', '19:00', 'reels', 'ra09-o-que-e-r'),
    ('2026-11-10', '19:00', 'reels', 'm21-teto-e-tamanho-de-posicao-9x16'), ('2026-11-11', '12:00', 'carrossel', 'car-ra-controle'),
    ('2026-11-12', '19:00', 'reels', 't01-primeiros-passos-9x16'), ('2026-11-17', '19:00', 'reels', 't02-planejar-conferir-confirmar-9x16'),
    ('2026-11-18', '12:00', 'carrossel', 'car-ra-faq'), ('2026-11-19', '19:00', 'reels', 't03-controle-e-teclado-9x16'),
    ('2026-11-24', '19:00', 'reels', 't04-estados-do-painel-9x16'), ('2026-11-25', '12:00', 'carrossel', 'car-ra-estados'),
]


def limpar(nome):
    nome = nome.replace('·', '-').replace(':', ' -').replace('/', '-').replace('\\', '-').replace('?', '')
    nome = re.sub(r'[*"<>|]', '', nome)
    return re.sub(r'\s+', ' ', nome).strip(' .-')


def arq(a):
    return limpar(a.get('arq', a['curto']))


def node_json(js):
    return json.loads(subprocess.run(['node', '-e', js], cwd=ROOT, capture_output=True, text=True, check=True).stdout)


def ffmpeg(*args):
    subprocess.run([FF, '-nostdin', '-y', '-loglevel', 'error', *args], check=True)


def novo(src, dst):
    return not os.path.exists(dst) or os.path.getmtime(dst) < os.path.getmtime(src)


# Markdown simples (títulos, parágrafos, listas, tabelas, negrito e código) para o plano e os roteiros
def md_inline(s):
    s = esc(s)
    s = re.sub(r'`([^`]+)`', r'<code>\1</code>', s)
    return re.sub(r'\*\*([^*]+)\*\*', r'<b>\1</b>', s)


def md_blocos(linhas):
    out, i = [], 0
    item = re.compile(r'^(- |\d+\. )')
    while i < len(linhas):
        lin = linhas[i]
        if not lin.strip():
            i += 1
            continue
        if lin.startswith('### '):
            out.append(f'<h4>{md_inline(lin[4:])}</h4>')
            i += 1
            continue
        if lin.startswith('|'):
            rows = []
            while i < len(linhas) and linhas[i].startswith('|'):
                rows.append([c.strip() for c in linhas[i].strip().strip('|').split('|')])
                i += 1
            cab = ''.join(f'<th>{md_inline(c)}</th>' for c in rows[0])
            corpo = ''.join('<tr>' + ''.join(f'<td>{md_inline(c)}</td>' for c in r) + '</tr>' for r in rows[2:])
            out.append(f'<div class="tabela"><table><thead><tr>{cab}</tr></thead><tbody>{corpo}</tbody></table></div>')
            continue
        if item.match(lin):
            ordenada = bool(re.match(r'^\d+\. ', lin))
            itens = []
            while i < len(linhas) and item.match(linhas[i]):
                t = item.sub('', linhas[i])
                itens.append(('☐ ' + t[4:]) if t.startswith('[ ] ') else t)
                i += 1
            tag = 'ol' if ordenada else 'ul'
            out.append(f'<{tag}>' + ''.join(f'<li>{md_inline(t)}</li>' for t in itens) + f'</{tag}>')
            continue
        par = [lin]
        i += 1
        while i < len(linhas) and linhas[i].strip() and not re.match(r'^(#|\||- |\d+\. )', linhas[i]):
            par.append(linhas[i])
            i += 1
        out.append(f'<p>{md_inline(" ".join(par))}</p>')
    return '\n'.join(out)


def md_paineis(texto, intro_titulo):
    # cada seção "## " vira um painel; o que vem antes da primeira seção vira o painel de abertura
    linhas = texto.split('\n')
    linhas = [l for l in linhas if not l.startswith('# ') and not re.match(r'^\d{1,2} de \w+ de \d{4}$', l.strip())]
    secoes, atual = [], [intro_titulo, []]
    for l in linhas:
        if l.startswith('## '):
            secoes.append(atual)
            atual = [l[3:].strip(), []]
        else:
            atual[1].append(l)
    secoes.append(atual)
    paineis = []
    for titulo, corpo in secoes:
        if not ''.join(corpo).strip():
            continue
        h = md_blocos(corpo)
        largo = ' largo' if ('<table' in h or len(h) > 2600) else ''
        paineis.append(f'<div class="panel{largo}"><h3>{md_inline(titulo)}</h3>{h}</div>')
    return '\n'.join(paineis)


def montar():
    durs = node_json("const a=[...require('./specs-risk.js'),...require('./specs-risk-16x9.js'),...require('./specs-risk-aulas.js')];"
                     "console.log(JSON.stringify(Object.fromEntries(a.map(s=>[s.id,s.dur]))))")
    M = node_json("console.log(JSON.stringify(require('./specs-risk-posts.js').META))")
    for d in ('v', 'p', 'img'):
        os.makedirs(os.path.join(PAG, d), exist_ok=True)
    arquivos, textos = [], []

    # vídeo leve para a página e o ZIP (CRF 25, como a Biblioteca) e a capa do player
    def video(vid, capa=None, t=1.5, largura=540):
        src = os.path.join(OUT, vid + '.mp4')
        assert os.path.exists(src), 'falta renderizar ' + vid
        dst = os.path.join(PAG, 'v', vid + '.mp4')
        if novo(src, dst):
            ffmpeg('-i', src, '-an', '-c:v', 'libx264', '-crf', CRF, '-preset', 'slow', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', dst)
        pst = os.path.join(PAG, 'p', vid + '.jpg')
        origem = capa if capa and os.path.exists(capa) else src
        if novo(origem, pst):
            if origem == src:
                ffmpeg('-ss', str(t), '-i', src, '-frames:v', '1', '-vf', f'scale={largura}:-2', '-q:v', '4', pst)
            else:
                ffmpeg('-i', origem, '-vf', f'scale={largura}:-2', '-q:v', '4', pst)
        return f'v/{vid}.mp4', f'p/{vid}.jpg'

    def imagem(grupo, iid):
        src = os.path.join(OUT, 'posts-risk', grupo, iid + '.jpg')
        rel = f'img/{grupo}/{iid}.jpg'
        dst = os.path.join(PAG, rel)
        os.makedirs(os.path.dirname(dst), exist_ok=True)
        if novo(src, dst) or os.path.getsize(dst) != os.path.getsize(src):
            shutil.copy2(src, dst)
        return rel

    capa_de = {c[len('capa-'):]: imagem('capas-ra', c) for c in M['capas']}
    seg = lambda vid: f"{round(durs[vid])} s"

    # ---- verticais (Reels, Shorts, TikTok)
    reels = []
    for n, r in enumerate(REELS, 1):
        src, pst = video(r['id'], os.path.join(PAG, capa_de[r['id']]))
        nome = f"{n:02d} - {limpar(r['titulo'])} (9x16).mp4"
        arquivos.append({'p': src, 'z': f'{VID}/01 - Reels, Shorts e TikTok (9x16)/{nome}'})
        arquivos.append({'p': capa_de[r['id']], 'z': f"{IMG}/03 - Capas de Reels (9x16)/Capa {n:02d} - {limpar(r['titulo'])}.jpg"})
        reels.append(dict(r, src=src, pst=pst, nome='GL Risk Auto - ' + nome, capa=capa_de[r['id']], dur=seg(r['id'])))
    textos.append({'z': f'{VID}/01 - Reels, Shorts e TikTok (9x16)/Legendas e títulos.txt',
                   't': '\n\n'.join(f"{n:02d} - {r['titulo'].upper()}\nTítulo do Shorts: {r['yt']}\n\n{r['leg']}\n\n" + '-' * 60 for n, r in enumerate(REELS, 1))})
    por_id = {r['id']: r for r in reels}

    # ---- 4:5
    feed = []
    for n, vid in enumerate(FEED, 1):
        base = por_id[vid]
        src, pst = video(vid + '-4x5', None, 1.5)
        nome = f"{n:02d} - {limpar(base['titulo'])} (4x5).mp4"
        arquivos.append({'p': src, 'z': f'{VID}/02 - Feed e anúncios da Meta (4x5)/{nome}'})
        feed.append(dict(id=vid + '-4x5', base=vid, titulo=base['titulo'], sub=base['sub'], leg=base['leg'], src=src, pst=pst, nome='GL Risk Auto - ' + nome, dur=seg(vid + '-4x5')))

    # ---- anúncios do YouTube
    yts = []
    for n, y in enumerate(YOUTUBE, 1):
        src, pst = video(y['id'], None, 2.4, 640)
        nome = f"{n:02d} - {limpar(y['titulo'])} (16x9).mp4"
        arquivos.append({'p': src, 'z': f'{VID}/03 - Anúncios do YouTube (16x9)/{nome}'})
        yts.append(dict(y, src=src, pst=pst, nome='GL Risk Auto - ' + nome, dur=seg(y['id'])))
    textos.append({'z': f'{VID}/03 - Anúncios do YouTube (16x9)/Textos dos anúncios.txt',
                   't': '\n\n'.join(f"{y['titulo'].upper()} ({y['fmt']}, {y['fase'].lower()})\nTítulo: {y['curto']}\nTítulo longo: {y['longo']}\nDescrição: {y['desc']}\nBotão: Saiba mais\nURL final: {URL_YT}" for y in YOUTUBE)})

    # ---- aulas e tutoriais (16:9 e 9:16)
    aulas = []
    for a in AULAS:
        h_src, h_pst = video(a['id'], os.path.join(PAG, imagem('thumbs-ra', a['thumb'])), 1.5, 640)
        vid9 = a['id'] + '-9x16'
        v_src, v_pst = video(vid9, os.path.join(PAG, capa_de[vid9]))
        pasta = f'{VID}/04 - Mentoria - Gestão de risco' if a['tipo'] == 'mentoria' else f'{VID}/05 - Tutoriais'
        base_nome = f"{a['n']} - {arq(a)}"
        arquivos.append({'p': h_src, 'z': f'{pasta}/{base_nome} (16x9).mp4'})
        arquivos.append({'p': v_src, 'z': f'{pasta}/{base_nome} (9x16).mp4'})
        arquivos.append({'p': capa_de[vid9], 'z': f"{IMG}/03 - Capas de Reels (9x16)/Capa - {base_nome}.jpg"})
        aulas.append(dict(a, h_src=h_src, h_pst=h_pst, v_src=v_src, v_pst=v_pst, h_nome=f'GL Risk Auto - {base_nome} (16x9).mp4',
                          v_nome=f'GL Risk Auto - {base_nome} (9x16).mp4', h_dur=seg(a['id']), v_dur=seg(vid9), capa9=capa_de[vid9]))
    for tipo, pasta in (('mentoria', f'{VID}/04 - Mentoria - Gestão de risco'), ('tutorial', f'{VID}/05 - Tutoriais')):
        textos.append({'z': f'{pasta}/Títulos e legendas.txt', 't': '\n\n'.join(
            f"{a['n'].upper()} - {a['curto'].upper()}\n\nYOUTUBE (16x9)\nTítulo: {a['yt']}\nDescrição:\n{a['ytd']}\n\nREELS E SHORTS (9x16)\n{a['leg']}\n\n" + '-' * 60
            for a in AULAS if a['tipo'] == tipo)})

    # ---- coringas
    coringas = []
    for n, c in enumerate(CORINGAS, 1):
        src, pst = video(c['id'], None, 3, 540 if c['fmt'] == '9x16' else 640)
        nome = f"{n:02d} - {limpar(c['titulo'])} ({c['fmt']}).mp4"
        arquivos.append({'p': src, 'z': f'{VID}/06 - Coringas sem texto/{nome}'})
        coringas.append(dict(c, src=src, pst=pst, nome='GL Risk Auto - Coringa ' + nome, dur=seg(c['id'])))

    # ---- carrosséis
    carrosseis = []
    for c in M['carrosseis']:
        slides = [imagem(c['group'], s) for s in c['slides']]
        pasta = f"{IMG}/01 - Carrosséis (4x5)/{limpar(c['titulo'])}"
        itens = [{'p': s, 'z': f'{pasta}/Slide {k:02d}.jpg'} for k, s in enumerate(slides, 1)]
        arquivos.extend(itens)
        textos.append({'z': f'{pasta}/Legenda.txt', 't': LEG_CAR[c['group']]})
        carrosseis.append(dict(c, slides=slides, leg=LEG_CAR[c['group']], itens=itens))

    # ---- stories
    stories = []
    ST = f'{IMG}/02 - Stories (9x16)'
    for n, s in enumerate(M['stories'], 1):
        q, r = imagem('st-ra', s['enquete']), imagem('st-ra', s['resposta'])
        arquivos.append({'p': q, 'z': f"{ST}/{n:02d}a - Enquete - {limpar(s['q'])}.jpg"})
        arquivos.append({'p': r, 'z': f"{ST}/{n:02d}b - Resposta - {limpar(s['r'])}.jpg"})
        stories.append(dict(s, img_q=q, img_r=r, link=STORY_LINK[s['k']]))
    soltos = []
    for sid in M['soltos']:
        im = imagem('st-ra', sid)
        titulo, como = SOLTOS[sid]
        arquivos.append({'p': im, 'z': f'{ST}/{limpar(titulo)}.jpg'})
        soltos.append(dict(id=sid, img=im, titulo=titulo, como=como))
    textos.append({'z': f'{ST}/Como postar os stories.txt', 't': '\n\n'.join(
        [f"{n:02d}a - ENQUETE (12h): {s['q']}\nFigurinha Enquete no espaço tracejado: {' / '.join(s['opcoes'])}\n\n{n:02d}b - RESPOSTA (12h do dia seguinte): {s['r']}\nFigurinha Link no espaço tracejado: {s['link']}." for n, s in enumerate(stories, 1)]
        + [f"{x['titulo'].upper()}\n{x['como']}" for x in soltos] + ['Guarde os stories no destaque "Risk Auto" (capa em 06 - Capa de destaque).'])})

    # ---- capas, thumbnails, frases e destaque
    thumbs = []
    for tid in M['thumbs']:
        im = imagem('thumbs-ra', tid)
        arquivos.append({'p': im, 'z': f"{IMG}/04 - Thumbnails do YouTube (16x9)/{limpar(NOMES_THUMB[tid])}.jpg"})
        thumbs.append(dict(id=tid, img=im, titulo=NOMES_THUMB[tid]))
    frases = []
    for fid in M['frases']:
        im = imagem('frases-ra', fid)
        arquivos.append({'p': im, 'z': f"{IMG}/05 - Frases (1x1)/{limpar(NOMES_FRASE[fid])}.jpg"})
        frases.append(dict(id=fid, img=im, titulo=NOMES_FRASE[fid]))
    dest = imagem('destaques-ra', M['destaque'])
    arquivos.append({'p': dest, 'z': f'{IMG}/06 - Capa de destaque/Risk Auto.jpg'})

    # ---- planilhas: anúncios e calendário
    p_vid = lambda vid, fmt: f"{VID}/{'01 - Reels, Shorts e TikTok (9x16)' if fmt == '9x16' else '02 - Feed e anúncios da Meta (4x5)'}/"
    nome_reel = {r['id']: f"{n:02d} - {limpar(r['titulo'])}" for n, r in enumerate(REELS, 1)}
    nome_feed = {vid: f"{n:02d} - {limpar(por_id[vid]['titulo'])}" for n, vid in enumerate(FEED, 1)}
    cab = ['Plataforma', 'Campanha', 'Conjunto ou formato', 'Anúncio', 'Vídeo principal', 'Vídeo 4x5 (feed)', 'Texto principal', 'Título', 'Título longo (YouTube)', 'Descrição', 'Botão', 'URL de destino']
    linhas_ads = [cab]
    for a in META_ADS:
        linhas_ads.append(['Meta', a['camp'], a['conj'], a['nome'], f"{p_vid(a['v'], '9x16')}{nome_reel[a['v']]} (9x16).mp4",
                           f"{p_vid(a['v'], '4x5')}{nome_feed[a['v']]} (4x5).mp4" if a['f'] else 'Usar o 9x16 em todos os posicionamentos',
                           a['texto'], a['titulo'], '', a['desc'], 'Saiba mais', URL_META])
    for n, y in enumerate(YOUTUBE, 1):
        linhas_ads.append(['YouTube', YT_CAMP[y['fase']], y['fmt'], f"riskauto_{y['id'].replace('yt-', '')}_v1",
                           f"{VID}/03 - Anúncios do YouTube (16x9)/{n:02d} - {limpar(y['titulo'])} (16x9).mp4", '', '', y['curto'], y['longo'], y['desc'], 'Saiba mais', URL_YT])
    csv = lambda linhas: '\n'.join(';'.join('"' + str(c).replace('"', '""') + '"' for c in l) for l in linhas)
    csv_ads = csv(linhas_ads)

    aula_de = {a['id']: a for a in aulas}
    aula9 = {a['id'] + '-9x16': a for a in aulas}
    car_de = {c['group']: c for c in carrosseis}
    st_de = {}
    for s in stories:
        st_de[s['enquete']] = ('enquete', s)
        st_de[s['resposta']] = ('resposta', s)
    agenda, linhas_cal = [], [['Data', 'Dia', 'Horário', 'Canal', 'Peça', 'Arquivo (no ZIP)', 'Figurinha ou título', 'Legenda ou descrição']]
    for data, hora, tipo, ref in AGENDA:
        d = datetime.date.fromisoformat(data)
        dia_txt = f"{DIAS[d.weekday()]}, {d.strftime('%d/%m')}"
        it = {'data': data, 'hora': hora, 'dia': dia_txt}
        if tipo == 'reels':
            if ref in por_id:
                r = por_id[ref]
                it.update(rotulo=f'Reels, Shorts e TikTok · {hora[:2]}h', titulo=r['titulo'], img=r['pst'], ancora=ref,
                          texto=f"{r['dur']}. Use a capa pronta e a legenda; no Shorts, o título.",
                          botoes=[{'rot': 'Baixar o vídeo', 'dl': r['src'], 'nome': r['nome'], 'ouro': True}, {'rot': 'Baixar a capa', 'dl': r['capa'], 'nome': 'Capa - ' + r['titulo'] + '.jpg'},
                                  {'rot': 'Copiar a legenda', 'copy': 'leg-' + ref, 'feito': 'Legenda copiada'}, {'rot': 'Copiar o título do Shorts', 'copy': 'yt-' + ref, 'feito': 'Título copiado'}])
                linhas_cal.append([d.strftime('%d/%m'), DIAS[d.weekday()], hora, 'Instagram Reels, TikTok e YouTube Shorts', r['titulo'],
                                   f"{VID}/01 - Reels, Shorts e TikTok (9x16)/{nome_reel[ref]} (9x16).mp4", 'Título do Shorts: ' + r['yt'], r['leg']])
            else:
                a = aula9[ref]
                titulo = f"{a['n']} · {a['curto']}"
                it.update(rotulo=f'Reels, Shorts e TikTok · {hora[:2]}h', titulo=titulo, img=a['v_pst'], ancora=a['id'],
                          texto=f"Versão 9:16, {a['v_dur']}. Legenda pronta.",
                          botoes=[{'rot': 'Baixar o vídeo', 'dl': a['v_src'], 'nome': a['v_nome'], 'ouro': True}, {'rot': 'Baixar a capa', 'dl': a['capa9'], 'nome': 'Capa - ' + a['curto'] + '.jpg'},
                                  {'rot': 'Copiar a legenda', 'copy': 'leg9-' + a['id'], 'feito': 'Legenda copiada'}])
                pasta = '04 - Mentoria - Gestão de risco' if a['tipo'] == 'mentoria' else '05 - Tutoriais'
                linhas_cal.append([d.strftime('%d/%m'), DIAS[d.weekday()], hora, 'Instagram Reels, TikTok e YouTube Shorts', titulo,
                                   f"{VID}/{pasta}/{a['n']} - {arq(a)} (9x16).mp4", 'Título do Shorts: ' + a['yt'], a['leg']])
        elif tipo == 'youtube':
            a = aula_de[ref]
            titulo = f"{a['n']} · {a['curto']}"
            it.update(rotulo=f"YouTube · {hora.replace(':00', 'h').replace(':30', 'h30')}", titulo=titulo, img=a['h_pst'], ancora=a['id'],
                      texto=f"Vídeo 16:9, {a['h_dur']}. Título, descrição e thumbnail prontos.",
                      botoes=[{'rot': 'Baixar o vídeo', 'dl': a['h_src'], 'nome': a['h_nome'], 'ouro': True}, {'rot': 'Baixar a thumbnail', 'dl': f"img/thumbs-ra/{a['thumb']}.jpg", 'nome': 'Thumbnail - ' + a['curto'] + '.jpg'},
                              {'rot': 'Copiar o título', 'copy': 'yt-' + a['id'], 'feito': 'Título copiado'}, {'rot': 'Copiar a descrição', 'copy': 'ytd-' + a['id'], 'feito': 'Descrição copiada'}])
            pasta = '04 - Mentoria - Gestão de risco' if a['tipo'] == 'mentoria' else '05 - Tutoriais'
            linhas_cal.append([d.strftime('%d/%m'), DIAS[d.weekday()], hora, 'YouTube', titulo, f"{VID}/{pasta}/{a['n']} - {arq(a)} (16x9).mp4", a['yt'], a['ytd']])
        elif tipo == 'carrossel':
            c = car_de[ref]
            it.update(rotulo=f'Carrossel · {hora[:2]}h', titulo=c['titulo'], img=c['slides'][0], ancora=ref,
                      texto=f"{len(c['slides'])} slides, na ordem, com a legenda. No LinkedIn, como documento.",
                      botoes=[{'rot': 'Baixar o carrossel', 'zipg': ref, 'ouro': True}, {'rot': 'Copiar a legenda', 'copy': 'leg-' + ref, 'feito': 'Legenda copiada'}])
            linhas_cal.append([d.strftime('%d/%m'), DIAS[d.weekday()], hora, 'Instagram feed (e LinkedIn)', f"Carrossel: {c['titulo']} ({len(c['slides'])} slides)",
                               f"{IMG}/01 - Carrosséis (4x5)/{limpar(c['titulo'])}/", '', c['leg']])
        elif tipo == 'story':
            if ref in st_de:
                lado, s = st_de[ref]
                im = s['img_q'] if lado == 'enquete' else s['img_r']
                fig = ('Figurinha Enquete: ' + ' / '.join(s['opcoes'])) if lado == 'enquete' else ('Figurinha Link: ' + s['link'])
                it.update(rotulo=f"Story · {lado} · {hora[:2]}h", titulo=s['q'] if lado == 'enquete' else s['r'], img=im, ancora='st-' + s['k'], texto=fig + '.',
                          botoes=[{'rot': 'Baixar o story', 'dl': im, 'nome': f"Story - {lado} - {limpar(s['q'] if lado == 'enquete' else s['r'])}.jpg", 'ouro': True}]
                          + ([{'rot': 'Copiar as opções', 'copy': 'op-' + s['k'], 'feito': 'Opções copiadas'}] if lado == 'enquete' else []))
                linhas_cal.append([d.strftime('%d/%m'), DIAS[d.weekday()], hora, 'Instagram stories', f"Story ({lado}): {s['q'] if lado == 'enquete' else s['r']}", f"{ST}/", fig, ''])
            else:
                x = next(x for x in soltos if x['id'] == ref)
                it.update(rotulo=f"Story · {hora[:2]}h", titulo=x['titulo'], img=x['img'], ancora='stories', texto=x['como'],
                          botoes=[{'rot': 'Baixar o story', 'dl': x['img'], 'nome': f"Story - {limpar(x['titulo'])}.jpg", 'ouro': True}])
                linhas_cal.append([d.strftime('%d/%m'), DIAS[d.weekday()], hora, 'Instagram stories', 'Story: ' + x['titulo'], f"{ST}/{limpar(x['titulo'])}.jpg", x['como'], ''])
        elif tipo == 'anuncio':
            if ref == 'meta':
                it.update(rotulo='Anúncios da Meta · começa hoje', titulo='Três criativos no teste de captação', img=por_id['ra01-bloqueado']['pst'], ancora='anuncios',
                          texto='ra01 (bloqueado), ra06 (mesa) e ra03 (controle), em 9:16 e 4:5. No remarketing: ra05, ra08 e v19. Teste até 25/10.',
                          botoes=[{'rot': 'Baixar a planilha dos anúncios', 'dl': 'anuncios-gl-risk-auto.csv', 'nome': 'Anúncios GL Risk Auto.csv', 'ouro': True}])
                linhas_cal.append([d.strftime('%d/%m'), DIAS[d.weekday()], hora, 'Meta Ads', 'Três criativos do GL Risk Auto no teste de captação; três no remarketing', 'Planilha "Anúncios GL Risk Auto"', '', ''])
            else:
                it.update(rotulo='Anúncios do YouTube · se houver verba', titulo='Teste de bumpers, 15 s e 30 s', img=yts[0]['pst'], ancora='youtube',
                          texto='Alcance com os 4 bumpers, consideração com os 2 de 15 s e conversão com o de 30 s. Decida pelo custo por call realizada.',
                          botoes=[{'rot': 'Baixar a planilha dos anúncios', 'dl': 'anuncios-gl-risk-auto.csv', 'nome': 'Anúncios GL Risk Auto.csv', 'ouro': True}])
                linhas_cal.append([d.strftime('%d/%m'), DIAS[d.weekday()], hora, 'YouTube Ads', 'Teste dos anúncios do GL Risk Auto (depende da verba)', 'Planilha "Anúncios GL Risk Auto"', '', ''])
        agenda.append(it)
    agenda.sort(key=lambda a: (a['data'], a['hora']))
    csv_cal = csv(linhas_cal)
    for nome, conteudo in (('calendario-gl-risk-auto.csv', csv_cal), ('anuncios-gl-risk-auto.csv', csv_ads)):
        open(os.path.join(PAG, nome), 'w', encoding='utf-8-sig', newline='').write(conteudo.replace('\n', '\r\n'))
        exe = os.path.join(MKT, 'execucao')
        if os.path.isdir(exe):
            open(os.path.join(exe, nome), 'w', encoding='utf-8-sig', newline='').write(conteudo.replace('\n', '\r\n'))
    textos.append({'z': f'{EST}/Calendário GL Risk Auto (abre no Excel).csv', 't': '\ufeff' + csv_cal})
    textos.append({'z': f'{EST}/Anúncios GL Risk Auto (abre no Excel).csv', 't': '\ufeff' + csv_ads})

    plano_md = open(os.path.join(MKT, 'execucao', 'campanha-gl-risk-auto.md'), encoding='utf-8').read()
    roteiros_md = open(os.path.join(MKT, 'roteiros-gl-risk-auto.md'), encoding='utf-8').read()
    textos.append({'z': f'{EST}/Campanha GL Risk Auto (plano).md', 't': plano_md})
    textos.append({'z': f'{TXT}/Roteiros GL Risk Auto para gravar.md', 't': roteiros_md})
    textos.append({'z': f'{VID}/LEIA-ME.txt', 't': LEIA_ME_VID})
    textos.append({'z': f'{IMG}/LEIA-ME.txt', 't': LEIA_ME_IMG})

    maior = max((x['z'] for x in arquivos + textos), key=len)
    assert len(BASE_WIN) + len(maior) <= 240, (len(BASE_WIN) + len(maior), maior)
    grupos = {c['group']: {'nome': f"Carrossel {c['titulo']}.zip", 'arquivos': [{'p': x['p'], 'z': x['z'].split('/')[-1]} for x in c['itens']],
                           'textos': [{'z': 'Legenda.txt', 't': c['leg']}]} for c in carrosseis}
    imgs = [x for x in arquivos if x['p'].startswith('img/')]
    grupos['imagens'] = {'nome': 'GL Risk Auto - imagens.zip', 'arquivos': [{'p': x['p'], 'z': x['z'].split('11 - GL Risk Auto/')[1]} for x in imgs],
                         'textos': [{'z': t['z'].split('11 - GL Risk Auto/')[1], 't': t['t']} for t in textos if t['z'].startswith(IMG) and '11 - GL Risk Auto/' in t['z']]}
    grupos['reels'] = {'nome': 'GL Risk Auto - Reels e Shorts.zip', 'arquivos': [{'p': r['src'], 'z': r['nome'][len('GL Risk Auto - '):]} for r in reels]
                       + [{'p': r['capa'], 'z': 'Capas/' + r['nome'][len('GL Risk Auto - '):-len(' (9x16).mp4')] + '.jpg'} for r in reels],
                       'textos': [t for t in textos if t['z'].endswith('01 - Reels, Shorts e TikTok (9x16)/Legendas e títulos.txt')]}
    return dict(reels=reels, feed=feed, yts=yts, aulas=aulas, coringas=coringas, carrosseis=carrosseis, stories=stories, soltos=soltos, thumbs=thumbs,
                frases=frases, dest=dest, agenda=agenda, arquivos=arquivos, textos=textos, grupos=grupos, plano_md=plano_md, roteiros_md=roteiros_md,
                maior=len(BASE_WIN) + len(maior))


LEIA_ME_VID = '''GL RISK AUTO: VÍDEOS

01 - Reels, Shorts e TikTok (9x16): os 12 vídeos verticais. O mesmo arquivo vai no Reels, no Shorts e no TikTok. A capa de cada um está
     nas imagens (03 - Capas de Reels) e a legenda e o título do Shorts em "Legendas e títulos".
02 - Feed e anúncios da Meta (4x5): as versões para o feed e para os anúncios.
03 - Anúncios do YouTube (16x9): 4 bumpers de 6 s, 2 de 15 s e 1 de 30 s, com os textos de cada anúncio.
04 - Mentoria - Gestão de risco: as aulas 20 e 21, em 16x9 (YouTube e GL OS) e 9x16 (Reels).
05 - Tutoriais: os tutoriais 1 a 4 do GL Risk Auto, em 16x9 e 9x16.
06 - Coringas sem texto: o mesmo movimento, sem legenda, para cobrir a fala gravada.

O calendário e os textos dos anúncios estão em "01 - Estratégia e planejamento"; os roteiros para gravar, em "05 - Roteiros, legendas e textos".
Exemplos educacionais em replay. Não é recomendação de investimento. Trading envolve risco financeiro real.
'''
LEIA_ME_IMG = '''GL RISK AUTO: IMAGENS

01 - Carrosséis (4x5): uma pasta por carrossel, com os slides na ordem e a legenda.
02 - Stories (9x16): os pares de enquete e resposta e os stories avulsos. "Como postar os stories" traz as figurinhas.
03 - Capas de Reels (9x16): a capa de cada vídeo vertical.
04 - Thumbnails do YouTube (16x9): as aulas, os tutoriais e o vídeo longo.
05 - Frases (1x1) e 06 - Capa de destaque (o destaque "Risk Auto").

Exemplos educacionais em replay. Não é recomendação de investimento. Trading envolve risco financeiro real.
'''


def img_tag(src, alt, cls=''):
    return f'<img src="{esc(src)}" alt="{esc(alt)}" loading="lazy" decoding="async"{(" class=" + chr(34) + cls + chr(34)) if cls else ""}>'


def botao(rot, ouro=False, **attrs):
    extra = ''.join(f' data-{k}="{esc(v)}"' for k, v in attrs.items())
    return f'<button type="button" class="btn mini{" ouro" if ouro else ""}"{extra}>{esc(rot)}</button>'


def botao_copia(rot, alvo, feito):
    return f'<button type="button" class="btn mini" data-copy="{esc(alvo)}" data-label="{esc(rot)}" data-done="{esc(feito)}">{esc(rot)}</button>'


def video_tag(src, pst, cls, rot):
    return f'<video class="{cls}" controls preload="none" playsinline poster="{esc(pst)}" aria-label="{esc(rot)}"><source src="{esc(src)}" type="video/mp4"></video>'


def quando_de(agenda, vid):
    xs = [a for a in agenda if a.get('ancora') == vid]
    return ' · '.join(f"{a['dia']}, {a['hora'][:2]}h" for a in xs) if xs else 'Sem data: anúncios ou quando quiser'


def gerar():
    K = montar()
    tpl = open(os.path.join(PAG, 'template.html'), encoding='utf-8').read()
    ag = K['agenda']

    def card_reel(r):
        return f'''<article class="vcard" id="{r['id']}">
  {video_tag(r['src'], r['pst'], 'r916', r['titulo'])}
  <div class="info"><p class="tipo">{esc(r['trilha'])} · {esc(r['dur'])}</p><h3>{esc(r['titulo'])}</h3><p class="sub">{esc(r['sub'])}</p>
    <p class="quando"><b>Postar</b>{esc(quando_de(ag, r['id']))}</p>
    <div class="acoes">{botao('Baixar o vídeo', True, dl=r['src'], nome=r['nome'])}{botao('Baixar a capa', dl=r['capa'], nome='Capa - ' + r['titulo'] + '.jpg')}{botao_copia('Copiar a legenda', 'leg-' + r['id'], 'Legenda copiada')}{botao_copia('Copiar o título do Shorts', 'yt-' + r['id'], 'Título copiado')}</div>
    <details><summary>Ver a legenda</summary><pre id="leg-{r['id']}">{esc(r['leg'])}</pre><pre id="yt-{r['id']}" hidden>{esc(r['yt'])}</pre></details></div>
</article>'''

    def card_feed(f):
        return f'''<article class="vcard" id="{f['id']}">
  {video_tag(f['src'], f['pst'], 'r45', f['titulo'])}
  <div class="info"><p class="tipo">Feed e anúncios · {esc(f['dur'])}</p><h3>{esc(f['titulo'])}</h3><p class="sub">{esc(f['sub'])}</p>
    <div class="acoes">{botao('Baixar o vídeo', True, dl=f['src'], nome=f['nome'])}{botao_copia('Copiar a legenda', 'leg-' + f['id'], 'Legenda copiada')}</div>
    <pre id="leg-{f['id']}" hidden>{esc(f['leg'])}</pre></div>
</article>'''

    def card_yt(y):
        return f'''<article class="vcard" id="{y['id']}">
  {video_tag(y['src'], y['pst'], 'r169', y['titulo'])}
  <div class="info"><p class="tipo">{esc(y['fase'])} · {esc(y['fmt'])}</p><h3>{esc(y['titulo'])}</h3>
    <p class="sub">Título: {esc(y['curto'])}. Título longo: {esc(y['longo'])}.</p>
    <div class="acoes">{botao('Baixar o vídeo', True, dl=y['src'], nome=y['nome'])}{botao_copia('Copiar os textos', 'ytx-' + y['id'], 'Textos copiados')}</div>
    <pre id="ytx-{y['id']}" hidden>{esc('Título: ' + y['curto'] + chr(10) + 'Título longo: ' + y['longo'] + chr(10) + 'Descrição: ' + y['desc'] + chr(10) + 'Botão: Saiba mais' + chr(10) + 'URL final: ' + URL_YT)}</pre></div>
</article>'''

    def card_aula(a):
        rot = 'Mentoria GL · ' + a['n'] if a['tipo'] == 'mentoria' else 'GL Risk Auto · ' + a['n']
        return f'''<article class="panel" id="{a['id']}">
  <div class="bloco-top"><div><p class="tipo">{esc(rot)}</p><h3>{esc(a['curto'])}</h3></div><span class="pill">16:9 {esc(a['h_dur'])} · 9:16 {esc(a['v_dur'])}</span></div>
  <p class="muted">{esc(a['sub'])}</p>
  <div class="dupla">
    <div class="fmt">{video_tag(a['h_src'], a['h_pst'], 'r169', a['curto'] + ' (16:9)')}<p class="quando"><b>YouTube</b>{esc(quando_de([x for x in ag if x['rotulo'].startswith('YouTube')], a['id']))}</p>
      <div class="acoes">{botao('Baixar 16:9', True, dl=a['h_src'], nome=a['h_nome'])}{botao('Baixar a thumbnail', dl='img/thumbs-ra/' + a['thumb'] + '.jpg', nome='Thumbnail - ' + a['curto'] + '.jpg')}{botao_copia('Copiar o título', 'yt-' + a['id'], 'Título copiado')}{botao_copia('Copiar a descrição', 'ytd-' + a['id'], 'Descrição copiada')}</div></div>
    <div class="fmt">{video_tag(a['v_src'], a['v_pst'], 'r916', a['curto'] + ' (9:16)')}<p class="quando"><b>Reels</b>{esc(quando_de([x for x in ag if x['rotulo'].startswith('Reels')], a['id']))}</p>
      <div class="acoes">{botao('Baixar 9:16', True, dl=a['v_src'], nome=a['v_nome'])}{botao_copia('Copiar a legenda', 'leg9-' + a['id'], 'Legenda copiada')}</div></div>
  </div>
  <details><summary>Ver o título, a descrição e a legenda</summary><pre id="yt-{a['id']}">{esc(a['yt'])}</pre><pre id="ytd-{a['id']}">{esc(a['ytd'])}</pre><pre id="leg9-{a['id']}">{esc(a['leg'])}</pre></details>
</article>'''

    def card_coringa(c):
        return f'''<article class="vcard" id="{c['id']}">
  {video_tag(c['src'], c['pst'], 'r916' if c['fmt'] == '9x16' else 'r169', c['titulo'])}
  <div class="info"><p class="tipo">Coringa {esc(c['fmt'].replace('x', ':'))} · {esc(c['dur'])}</p><h3>{esc(c['titulo'])}</h3><p class="sub">{esc(c['sub'])}</p>
    <div class="acoes">{botao('Baixar o vídeo', True, dl=c['src'], nome=c['nome'])}</div></div>
</article>'''

    def painel_car(c):
        tira = ''.join(f'<li>{img_tag(s, "Slide " + str(k) + " do carrossel " + c["titulo"])}</li>' for k, s in enumerate(c['slides'], 1))
        return f'''<div class="panel" id="{c['group']}"><div class="bloco-top"><h3>{esc(c['titulo'])}</h3><span class="pill">{len(c['slides'])} slides · {esc(quando_de(ag, c['group']))}</span></div>
  <ul class="tira">{tira}</ul>
  <div class="acoes">{botao('Baixar o carrossel (ZIP)', True, zipg=c['group'])}{botao_copia('Copiar a legenda', 'leg-' + c['group'], 'Legenda copiada')}</div>
  <details><summary>Ver a legenda</summary><pre id="leg-{c['group']}">{esc(c['leg'])}</pre></details></div>'''

    def par_story(s):
        return f'''<div class="panel" id="st-{s['k']}"><h3>{esc(s['q'])}</h3>
  <div class="par">
    <figure>{img_tag(s['img_q'], 'Story de enquete: ' + s['q'])}<figcaption><span><b>Enquete</b> · 12h</span><span>Figurinha Enquete: {esc(' / '.join(s['opcoes']))}</span><span hidden id="op-{s['k']}">{esc(chr(10).join(s['opcoes']))}</span>
      <span class="acoes">{botao('Baixar', dl=s['img_q'], nome='Story - enquete - ' + limpar(s['q']) + '.jpg')}{botao_copia('Copiar as opções', 'op-' + s['k'], 'Opções copiadas')}</span></figcaption></figure>
    <figure>{img_tag(s['img_r'], 'Story de resposta: ' + s['r'])}<figcaption><span><b>Resposta</b> · 12h do dia seguinte</span><span>Figurinha Link: {esc(s['link'])}</span>
      <span class="acoes">{botao('Baixar', dl=s['img_r'], nome='Story - resposta - ' + limpar(s['r']) + '.jpg')}</span></figcaption></figure>
  </div></div>'''

    soltos = ''.join(f'''<div class="panel"><h3>{esc(x['titulo'])}</h3><figure>{img_tag(x['img'], x['titulo'])}<figcaption><span>{esc(x['como'])}</span><span class="acoes">{botao('Baixar', dl=x['img'], nome='Story - ' + limpar(x['titulo']) + '.jpg')}</span></figcaption></figure></div>''' for x in K['soltos'])
    capas = ''.join(f'''<figure>{img_tag(r['capa'], 'Capa: ' + r['titulo'])}<figcaption><b>{esc(r['titulo'])}</b>{botao('Baixar', dl=r['capa'], nome='Capa - ' + r['titulo'] + '.jpg')}</figcaption></figure>''' for r in K['reels'])
    capas += ''.join(f'''<figure>{img_tag(a['capa9'], 'Capa: ' + a['curto'])}<figcaption><b>{esc(a['n'])} · {esc(a['curto'])}</b>{botao('Baixar', dl=a['capa9'], nome='Capa - ' + a['curto'] + '.jpg')}</figcaption></figure>''' for a in K['aulas'])
    thumbs = ''.join(f'''<figure>{img_tag(t['img'], 'Thumbnail: ' + t['titulo'])}<figcaption><b>{esc(t['titulo'])}</b>{botao('Baixar', dl=t['img'], nome='Thumbnail - ' + limpar(t['titulo']) + '.jpg')}</figcaption></figure>''' for t in K['thumbs'])
    frases = ''.join(f'''<figure>{img_tag(f['img'], f['titulo'])}<figcaption><b>{esc(f['titulo'])}</b>{botao('Baixar', dl=f['img'], nome='Frase - ' + limpar(f['titulo']) + '.jpg')}</figcaption></figure>''' for f in K['frases'])
    frases += f'''<figure>{img_tag(K['dest'], 'Capa de destaque Risk Auto')}<figcaption><b>Capa de destaque "Risk Auto"</b>{botao('Baixar', dl=K['dest'], nome='Destaque - Risk Auto.jpg')}</figcaption></figure>'''

    linhas_ads = []
    for a in META_ADS:
        tid = 'ad-' + a['nome']
        txt = f"Texto principal: {a['texto']}\nTítulo: {a['titulo']}\nDescrição: {a['desc']}\nBotão: Saiba mais\nURL: {URL_META}"
        linhas_ads.append(f'''<tr><td><b>{esc(a['nome'])}</b></td><td>Meta · {'Captação' if 'captacao' in a['camp'] else 'Remarketing'}</td><td>{esc(a['v'])}{' + 4:5' if a['f'] else ''}</td>
  <td>{esc(a['texto'])}<br><b>Título:</b> {esc(a['titulo'])}<div class="acoes">{botao_copia('Copiar os textos', tid, 'Textos copiados')}</div><pre id="{tid}" hidden>{esc(txt)}</pre></td></tr>''')
    for y in YOUTUBE:
        tid = 'ad-' + y['id']
        txt = f"Título: {y['curto']}\nTítulo longo: {y['longo']}\nDescrição: {y['desc']}\nBotão: Saiba mais\nURL final: {URL_YT}"
        linhas_ads.append(f'''<tr><td><b>riskauto_{esc(y['id'].replace('yt-', ''))}_v1</b></td><td>YouTube · {esc(y['fase'])}</td><td>{esc(y['fmt'])}</td>
  <td><b>Título:</b> {esc(y['curto'])}<br><b>Título longo:</b> {esc(y['longo'])}<br><b>Descrição:</b> {esc(y['desc'])}<div class="acoes">{botao_copia('Copiar os textos', tid, 'Textos copiados')}</div><pre id="{tid}" hidden>{esc(txt)}</pre></td></tr>''')

    # vídeos do site (os dois vídeos completos e o prompt do Codex) e as peças extras para Reels e anúncios
    import kit_site_risk
    SITE = kit_site_risk.montar_site()
    K['grupos']['site'] = SITE['grupo']
    K['grupos']['extras'] = SITE['grupo_extras']

    def card_site(c):
        nome = c['arquivo'][:-4]
        return f'''<article class="vcard">
  {video_tag('site/' + nome + '.mp4', 'site/' + c['capa'], 'r169', c['titulo'])}
  <div class="info"><p class="tipo">Site · 16:9 · {c['duracao_s']:g} s</p><h3>{esc(c['titulo'])}</h3><p class="sub">{esc(c['descricao'])}</p>
    <div class="acoes">{botao('Baixar o vídeo', True, dl='site/' + nome + '.mp4', nome='GL Risk Auto - ' + c['titulo'].split(':')[0] + '.mp4')}</div>
    <p class="sub">media/risk/{esc(c['arquivo'])}</p></div>
</article>'''
    site_html = f'''<div class="panel">
  <div class="bloco-top"><h3>Vídeos do site e o prompt do Codex</h3><span class="pill">2 vídeos · {SITE['total'] / 1e6:.0f} MB</span></div>
  <p class="muted">O ZIP traz a pasta media/risk com os dois vídeos, as capas, a imagem do link e o catálogo, mais o LEIA-ME e o prompt. O Codex cria a seção (ou a página) do GL Risk Auto no site que já está no ar.</p>
  <div class="acoes">{botao('Baixar os vídeos do site (ZIP)', True, zipg='site')}{botao_copia('Copiar o prompt do Codex', 'prompt-codex', 'Prompt copiado')}</div>
  <details><summary>Ver o prompt</summary><pre id="prompt-codex">{esc(SITE['prompt'])}</pre></details>
</div>
<div class="vgrid wide">{''.join(card_site(c) for c in SITE['catalogo'] if 'formato' in c)}</div>'''

    def card_extra(x):
        cls = 'r11' if x['fmt'] == '1:1' else 'r169'
        return f'''<article class="vcard">
  {video_tag(x['src'], x['pst'], cls, x['titulo'])}
  <div class="info"><p class="tipo">{esc(x['pasta'][:-1] if x['pasta'].endswith('s') else x['pasta'])} {esc(x['fmt'])} · {x['dur']:g} s</p><h3>{esc(x['titulo'])}</h3><p class="sub"><b>Como usar:</b> {esc(x['uso'])}</p>
    <div class="acoes">{botao('Baixar o vídeo', True, dl=x['src'], nome='GL Risk Auto - ' + x['titulo'] + '.mp4')}</div></div>
</article>'''
    ad = ''.join(img_tag("site/" + n, alt) for n, alt in (('risk-antes.jpg', 'Antes: o gráfico sem o plano'), ('risk-depois.jpg', 'Depois: o mesmo gráfico com o plano do GL Risk Auto')))
    extras_html = f'''<div class="panel">
  <div class="bloco-top"><h3>Peças extras</h3><span class="pill">{len(SITE['extras'])} vídeos · 2 imagens</span></div>
  <p class="muted">Sem som e sem legenda: o texto entra no editor, em cima e embaixo, para virar 9:16 nos Reels e nos stories. Em toda peça vão o selo de replay e o aviso de risco.</p>
  <div class="acoes">{botao('Baixar as peças extras (ZIP)', True, zipg='extras')}</div>
</div>
<div class="panel"><div class="bloco-top"><h3>Antes e depois</h3><span class="pill">2 imagens 1920x1080</span></div>
  <p class="muted">O mesmo gráfico de 5 minutos, antes e depois de desenhar o plano. <b>Como usar:</b> {esc(kit_site_risk.COMO_USAR_AD)}</p>
  <div class="ad2">{ad}</div></div>
<div class="vgrid wide">{''.join(card_extra(x) for x in SITE['extras'])}</div>'''

    n_vid = len(K['reels']) + len(K['feed']) + len(K['yts']) + 2 * len(K['aulas']) + len(K['coringas'])
    n_img = len({x['p'] for x in K['arquivos'] if x['p'].startswith('img/')})
    rep = {
        '<!--N-VID-->': str(n_vid), '<!--N-IMG-->': str(n_img), '<!--BIBLIOTECA-->': BIBLIOTECA, '<!--KIT-->': KIT,
        '<!--PLANO-->': md_paineis(K['plano_md'], 'A campanha'),
        '<!--REELS-->': '\n'.join(card_reel(r) for r in K['reels']),
        '<!--FEED-->': '\n'.join(card_feed(f) for f in K['feed']),
        '<!--YOUTUBE-->': '\n'.join(card_yt(y) for y in K['yts']),
        '<!--MENTORIA-->': '\n'.join(card_aula(a) for a in K['aulas'] if a['tipo'] == 'mentoria'),
        '<!--TUTORIAIS-->': '\n'.join(card_aula(a) for a in K['aulas'] if a['tipo'] == 'tutorial'),
        '<!--CARROSSEIS-->': '\n'.join(painel_car(c) for c in K['carrosseis']),
        '<!--STORIES-->': '\n'.join(par_story(s) for s in K['stories']) + soltos,
        '<!--CAPAS-->': capas, '<!--THUMBS-->': thumbs, '<!--FRASES-->': frases,
        '<!--ANUNCIOS-->': '\n'.join(linhas_ads),
        '<!--ROTEIROS-->': md_paineis(K['roteiros_md'], 'Como usar os roteiros'),
        '<!--CORINGAS-->': '\n'.join(card_coringa(c) for c in K['coringas']),
        '<!--SITE-->': site_html,
        '<!--EXTRAS-->': extras_html,
        '<!--DADOS-->': json.dumps({'agenda': K['agenda'], 'zip': {'nome': NOME_ZIP, 'arquivos': K['arquivos'], 'textos': K['textos']}, 'grupos': K['grupos']},
                                   ensure_ascii=False).replace('</', '<' + chr(92) + '/'),
    }
    for k, v in rep.items():
        assert k in tpl, k
        tpl = tpl.replace(k, v)
    open(os.path.join(PAG, 'index.html'), 'w', encoding='utf-8').write(tpl)
    tam = sum(os.path.getsize(os.path.join(PAG, p)) for p in {x['p'] for x in K['arquivos']})
    print(f"campanha GL Risk Auto: {n_vid} vídeos e {n_img} imagens ({tam / 1048576:.0f} MB), {len(K['agenda'])} posts no calendário; "
          f"página {os.path.getsize(os.path.join(PAG, 'index.html')) / 1024:.0f} KB; maior caminho no Windows: {K['maior']} caracteres")


if __name__ == '__main__':
    gerar()
