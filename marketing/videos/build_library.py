# Gera a página da Biblioteca de Vídeos GL a partir dos vídeos renderizados.
import html, os, re, subprocess, json

ROOT = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(ROOT, 'out')
LIB = os.path.join(ROOT, 'biblioteca')
IMAGEIO_FF = '/usr/local/lib/python3.11/dist-packages/imageio_ffmpeg/binaries/ffmpeg-linux-x86_64-v7.0.2'
FF = os.environ.get('FFMPEG') or (IMAGEIO_FF if os.path.exists(IMAGEIO_FF) else 'ffmpeg')
os.makedirs(os.path.join(LIB, 'videos'), exist_ok=True)
os.makedirs(os.path.join(LIB, 'capas'), exist_ok=True)

AVISO = 'Conteúdo educacional; trading envolve risco financeiro real.'
# partículas finas perdem detalhe no CRF 25; estes saem em CRF 20
HQ = ('logo-', 'vinheta-', 'live-abertura', 'live-encerramento')
# arquivos longos: compressão maior para caber no limite de 15 MB por arquivo
CRF = {'live-contagem-5min': '31'}
GROUPS = [
  ('vendem', 'Vídeos que vendem o operacional', 'Prontos para Reels, Shorts, TikTok e anúncios. Cada um prova uma coisa que o GL Model faz, com o print real.', [
    ('v01-a-favor-ou-contra', 'A favor ou contra', 'Antes e depois: o modelo avisa "Correção contra W/M · Calor 4%" e depois "Alta alinhada D/W/M · Calor 19%".', 'Anúncio de topo, Reels',
     f'Antes de entrar, uma pergunta: o mercado está a favor ou contra você? O GL Model mostra o contexto diário, semanal e mensal e o calor do movimento. Quando está contra, a gente espera. Call 1x1 gratuita no link da bio. {AVISO}'),
    ('v02-setup-acontecendo', 'Setup acontecendo', 'Replay do setup: varredura na mínima, rompimento acima das VWAPs D e W e o alinhamento D/W/M.', 'Reels, anúncio',
     f'Veja o setup acontecendo no replay: o preço varre a mínima, volta para o valor, rompe as VWAPs D e W e o modelo confirma a alta alinhada. Quer ver no seu ativo? Link na bio. {AVISO}'),
    ('v03-alvos-claros', 'Alvos claros', 'Os alvos D/W, M e 3M aparecem antes do preço chegar.', 'Reels, anúncio, carrossel em vídeo',
     f'O alvo aparece antes do preço chegar. No GL Model, alvos diário, semanal e mensal ficam no gráfico junto com VAH e VAL. Alvos são projeções, não promessa de resultado. {AVISO}'),
    ('v04-gamma-exposure', 'Gamma Exposure no gráfico', 'Zero Gamma, Call Wall, HVL e os níveis GL explicados no próprio gráfico.', 'Reels educativo, anúncio do GL Gamma',
     f'Gamma Exposure dentro do seu gráfico: Zero Gamma, Call Wall, HVL e os níveis GL, lidos junto com o GL Model. Salve para estudar. GL Gamma é uma assinatura à parte. {AVISO}'),
    ('v05-nivel-respeitado', 'O nível foi respeitado', 'Defesa na região marcada e o preço buscando o VAH D 7.776 no MES.', 'Reels, prova do método',
     f'O mapa marca o nível. O preço respeita. Defesa na região marcada e alvo no VAH D. Exemplo educacional; resultado passado não garante resultado futuro.'),
    ('v06-ninjatrader', 'Também no NinjaTrader', 'O indicador de estrutura GL rodando no NinjaTrader, com POC e VAL semanais e mensais.', 'Reels, anúncio para quem usa NinjaTrader',
     f'O mapa GL também no NinjaTrader: estrutura de mercado com POC e VAL semanais e mensais e o valor do dia para executar. {AVISO}'),
    ('v07-tres-perguntas', 'As 3 perguntas antes do trade', 'Direção, entrada e alvos: três prints, três respostas.', 'Reels, anúncio, story fixo',
     f'Antes de qualquer trade: qual é a direção, onde é a entrada e onde estão os alvos? O GL Model responde as três no mesmo gráfico. Call 1x1 gratuita no link da bio. {AVISO}'),
    ('v08-nem-toda-queda-e-venda', 'Nem toda queda é venda', 'O preço perde a acumulação e despenca, mas o modelo classifica: correção contra W/M, calor 4%.', 'Reels educativo, anúncio',
     f'Nem toda queda é venda. O preço perdeu a acumulação e caiu forte, mas o GL Model classificou o movimento como correção contra o semanal e o mensal, com calor de 4%. Contexto antes de qualquer entrada. {AVISO}'),
    ('v09-defesa-na-vwap-3m', 'Defesa na VWAP 3M', 'Rompimento da VWAP W, correção até a VWAP 3M, defesa exata e retomada até a marca Y +8%.', 'Reels, prova do método',
     'O preço rompeu a VWAP W, corrigiu até a VWAP 3M e foi defendido exatamente nela. VWAPs diária, semanal, mensal e trimestral no mesmo mapa. Exemplo educacional; resultado passado não garante resultado futuro.'),
    ('v10-queda-no-ninjatrader', 'Queda no NinjaTrader', 'O preço perde a zona GL, acelera, para na zona de defesa e forma o novo valor do dia.', 'Reels, anúncio para NinjaTrader',
     f'No NinjaTrader: o preço perde a zona marcada, acelera, para na zona de defesa e forma o novo valor do dia. O mesmo mapa GL no TradingView e no NinjaTrader. {AVISO}'),
    ('v11-escada-de-valor', 'Escada de valor', 'O preço sobe degrau por degrau: VAL M, VAH M, VAH Q, VAH W e o alvo D/W.', 'Reels, anúncio',
     'A escada de valor: do valor mensal ao trimestral, ao semanal, até o alvo D/W. Cada degrau marcado no gráfico pelo GL Model. Exemplo educacional; resultado passado não garante resultado futuro.'),
  ]),
  ('operacional', 'O operacional por dentro', 'Rodada de 2 de outubro, com os prints de 1º e 2 de outubro no NinjaTrader: o gráfico se constrói na tela e cada parte do operacional é destacada, do painel aos alvos e ao Gamma.', [
    ('v15-volatilidade-volume-gamma', 'Antes e depois: volatilidade, volume e Gamma', 'Antes: o preço passa pelos alvos de volatilidade D, W e M ("Expansão de alta acelerada"). Depois: chega no alvo estrutural de volume ("Expansão de alta muito forte"). E, somando o GL Gamma, calls no alvo W +1% e puts na base.', 'Reels, anúncio, prova do método',
     'Antes e depois. Primeiro, o preço passou pelos alvos de volatilidade D, W e M, e o painel marcou expansão de alta acelerada. Depois, chegou no alvo estrutural de volume, onde está a liquidez, e o painel subiu para expansão de alta muito forte. Somando o GL Gamma: preço acima do Zero Gamma, calls no mesmo nível do alvo W +1% e puts lá embaixo, na base. Volatilidade, volume e Gamma no mesmo mapa. Alvos são projeções, não promessa de resultado. GL Gamma é uma assinatura à parte. Call 1x1 gratuita no link da bio. Trading envolve risco financeiro real.'),
    ('v12-estado-de-mercado', 'Estado de Mercado por dentro', 'O 30 minutos se construindo: cores do estado, alvos estruturais de volume, VWAPs D, W e M, alvos de volatilidade D, W, M e 3M e o painel "Equilíbrio na banda".', 'Reels, anúncio, YouTube Shorts',
     f'O GL Estado de Mercado por dentro: as cores mostram o estado do mercado, as faixas verdes marcam os alvos estruturais de volume, as VWAPs do dia, da semana e do mês ficam no gráfico e os alvos de volatilidade D, W, M e 3M aparecem acima do preço. E o painel lê tudo em português: equilíbrio na banda, macro comprador. Alvos são projeções, não promessa de resultado. Call 1x1 gratuita no link da bio. {AVISO}'),
    ('v13-chao-das-puts', 'Calls em cima, puts embaixo', 'No 1 minuto: a maior barra de calls, a maior de puts, o preço parando nas puts, a volta ao Zero Gamma e o painel de risco "Ofensivo forte".', 'Reels, anúncio do GL Gamma',
     f'O mapa de Gamma no gráfico de 1 minuto: em cima, a maior barra de calls; embaixo, a maior de puts. O preço caiu mais de 50 pontos, parou na região das puts e voltou para o Zero Gamma. E o painel de risco marcava ofensivo forte, 5 de 5 janelas positivas. GL Gamma é uma assinatura à parte. {AVISO}'),
    ('v14-perdeu-o-zero-gamma', 'Perdeu o Zero Gamma', 'O preço trava no VAH D, perde o Zero Gamma, atravessa o VAL D e o VAL NY, acelera e reage na região das puts.', 'Reels educativo, anúncio do GL Gamma',
     f'O que acontece quando o preço perde o Zero Gamma? Aqui ele travou no VAH D, perdeu o Zero Gamma, atravessou o VAL D e o VAL NY e acelerou até a região das puts, onde reagiu. Calls em cima, puts embaixo, Zero Gamma no meio. GL Gamma é uma assinatura à parte. {AVISO}'),
    ('v16-rompimento-gamma', 'Base, rompimento e alvo', 'Base no VAL D com puts (P+) e cluster, rompimento do VAH W e do Zero Gamma, parada no VAH D e o próximo alvo W +1%.', 'Reels, anúncio',
     f'A base, o rompimento e o alvo. O preço segurou no VAL D, onde estavam o nível de puts e um cluster, rompeu o VAH W e o Zero Gamma, parou no VAH D e no cluster de 7.805, e o próximo alvo no mapa é o W +1%. Alvos são projeções, não promessa de resultado. GL Gamma é uma assinatura à parte. {AVISO}'),
  ]),
  ('objecoes', 'Respostas às objeções', 'Para remarketing: quem já viu a GL e não agendou costuma travar numa dessas dúvidas. Cada vídeo responde uma e termina na call 1x1.', [
    ('objecao-plataforma', 'Funciona na minha plataforma?', 'TradingView e NinjaTrader com o mesmo mapa; os planos NinjaTrader já incluem o TradingView.', 'Remarketing, stories de venda, resposta em DM',
     f'Funciona na minha plataforma? O GL Model roda no TradingView e no NinjaTrader, com o mesmo mapa. E os planos NinjaTrader já incluem o TradingView. Tire suas dúvidas na call 1x1 gratuita, link na bio. {AVISO}'),
    ('objecao-mais-um-indicador', 'É só mais um indicador?', 'Contexto, valor, alvos e Gamma: quatro camadas no mesmo gráfico.', 'Remarketing, anúncio de meio de funil',
     f'É só mais um indicador? Não, é um mapa: contexto D/W/M, valor do dia, da semana e do mês, alvos e Gamma, tudo no mesmo gráfico. Alvos são projeções, não promessa de resultado. GL Gamma é uma assinatura à parte. Call 1x1 gratuita no link da bio. {AVISO}'),
    ('objecao-opcoes', 'Preciso entender de opções?', 'Os níveis de Gamma já vêm no gráfico de futuros: Zero Gamma, Call Wall e HVL.', 'Remarketing, anúncio do GL Gamma',
     f'Preciso entender de opções para usar Gamma? Não precisa operar opções: Zero Gamma, Call Wall e HVL aparecem direto no seu gráfico de futuros. GL Gamma, o mapa das opções no seu gráfico, é uma assinatura à parte. {AVISO}'),
    ('objecao-por-onde-comecar', 'Não sei por onde começar', 'Chamada direta para a call 1x1: 30 minutos, gratuita.', 'Anúncio de conversão, stories com link',
     f'Não sabe por onde começar? Comece pela call 1x1 gratuita: 30 minutos para contar o seu momento no mercado e entender o próximo passo. Link na bio. {AVISO}'),
  ]),
  ('vendas-whats', 'Sequência da call no WhatsApp', 'Três vídeos para a pessoa aparecer na call: confirmação logo depois do agendamento, lembrete 1 hora antes e convite para remarcar se ela faltar. A legenda pronta é a mensagem para mandar junto.', [
    ('call-confirmada', 'Call confirmada', 'O que vai acontecer e como se preparar, sem citar duração até ela ser definida.', 'WhatsApp, logo depois do agendamento',
     'Oi, [nome]! Sua call com a GL Academy está confirmada para [dia] às [hora]. Qualquer imprevisto, é só responder esta mensagem que a gente remarca.'),
    ('call-lembrete', 'Lembrete 1 hora antes', 'Curto, para mandar no dia da call.', 'WhatsApp, 1 hora antes',
     'Oi, [nome]! Passando para lembrar: sua call com a GL Academy é hoje às [hora]. Até já!'),
    ('call-remarcar', 'Vamos remarcar', 'Para quem não apareceu: sem bronca, com um novo horário.', 'WhatsApp, depois de uma falta',
     'Oi, [nome]! Não conseguimos falar com você no horário marcado. Acontece! Quer escolher um novo horário? É só responder aqui.'),
  ]),
  ('aulas', 'Aulas rápidas', 'Conteúdo que ensina em 15 segundos usando o gráfico real. Atrai seguidor novo e mostra autoridade sem pedir nada em troca.', [
    ('aula-vwap', 'O que é a VWAP', 'Preço médio ponderado pelo volume, VWAP W e VWAP 3M e a defesa na VWAP 3M.', 'Reels educativo, conteúdo para atrair seguidores',
     f'VWAP é o preço médio do período, ponderado pelo volume. Quando o preço está acima dela, o mercado está pagando mais que a média. No GL Model você vê a VWAP da semana e a do trimestre no mesmo gráfico. Salve para estudar. {AVISO}'),
    ('aula-value-area', 'O que é Value Area', 'VAH, VAL e POC explicados no NinjaTrader, no dia, na semana e no mês.', 'Reels educativo, conteúdo para atrair seguidores',
     f'Value Area é a faixa de preço onde ocorreu cerca de 70% do volume. VAH é o topo, VAL é o fundo e POC é o preço com mais volume. O GL Model marca isso no dia, na semana e no mês. Salve para estudar. {AVISO}'),
  ]),
  ('ganchos', 'Variações de gancho para anúncios', 'Mesmo vídeo, primeira frase diferente. Rode as versões lado a lado no anúncio e fique com a que segura mais gente nos 3 primeiros segundos.', [
    ('v02b-gancho-voce-compraria', 'Setup acontecendo · "Você teria comprado aqui?"', 'Gancho de pergunta direta.', 'Teste A/B de anúncio', ''),
    ('v02c-gancho-3-sinais', 'Setup acontecendo · "3 sinais antes do rompimento"', 'Gancho de lista.', 'Teste A/B de anúncio', ''),
    ('v01b-gancho-pare-de-operar-contra', 'A favor ou contra · "Pare de operar contra o mercado"', 'Gancho de comando.', 'Teste A/B de anúncio', ''),
    ('v01c-gancho-erro-mais-caro', 'A favor ou contra · "O erro mais caro"', 'Gancho de dor.', 'Teste A/B de anúncio', ''),
    ('v07b-gancho-nao-entre', '3 perguntas · "Se não responde, não entre"', 'Gancho de regra.', 'Teste A/B de anúncio', ''),
    ('v07c-gancho-antes-de-clicar', '3 perguntas · "Antes de clicar"', 'Gancho de autoridade.', 'Teste A/B de anúncio', ''),
  ]),
  ('feed', 'Versões 4:5 para o feed', 'O feed do Instagram e do Facebook corta vídeos 9:16 em cima e embaixo, e a legenda some. Nestas versões nada fica cortado.', [
    ('v02-setup-acontecendo-4x5', 'Setup acontecendo · 4:5', 'O vídeo preferido, no formato do feed.', 'Anúncio no feed', ''),
    ('v01-a-favor-ou-contra-4x5', 'A favor ou contra · 4:5', 'Antes e depois do contexto, no formato do feed.', 'Anúncio no feed', ''),
    ('v03-alvos-claros-4x5', 'Alvos claros · 4:5', 'Alvos D/W, M e 3M, no formato do feed.', 'Anúncio no feed', ''),
    ('v08-nem-toda-queda-e-venda-4x5', 'Nem toda queda é venda · 4:5', 'Contexto antes da entrada, no formato do feed.', 'Anúncio no feed', ''),
    ('v15-volatilidade-volume-gamma-4x5', 'Antes e depois: volatilidade, volume e Gamma · 4:5', 'Os três atos no formato do feed.', 'Anúncio no feed', ''),
    ('v12-estado-de-mercado-4x5', 'Estado de Mercado por dentro · 4:5', 'O painel, as cores e os alvos, no formato do feed.', 'Anúncio no feed', ''),
    ('v13-chao-das-puts-4x5', 'Calls em cima, puts embaixo · 4:5', 'O mapa de Gamma no 1 minuto, no formato do feed.', 'Anúncio no feed', ''),
    ('v14-perdeu-o-zero-gamma-4x5', 'Perdeu o Zero Gamma · 4:5', 'Do VAH D à região das puts, no formato do feed.', 'Anúncio no feed', ''),
    ('v16-rompimento-gamma-4x5', 'Base, rompimento e alvo · 4:5', 'Base, rompimento e o alvo W +1%, no formato do feed.', 'Anúncio no feed', ''),
  ]),
  ('coringas', 'Coringas verticais (sem texto)', 'Movimento do setup sem legenda. Coloque qualquer narração, texto ou gancho por cima e publique. São a base para produzir conteúdo todo dia.', [
    ('c01-setup-acontecendo-limpo', 'Setup acontecendo', 'Revelação do setup de alta alinhada.', 'Fundo de Reels e stories', ''),
    ('c02-alvos-limpo', 'Preço indo ao alvo', 'Preço subindo até os alvos já marcados.', 'Fundo de Reels e stories', ''),
    ('c03-gamma-limpo', 'Mapa de Gamma', 'Câmera passando pelos níveis de Gamma.', 'Fundo para falar de opções e Gamma', ''),
    ('c04-nivel-limpo', 'Nível respeitado', 'Replay até o VAH D com as setas.', 'Fundo para falar de níveis', ''),
    ('c05-ninjatrader-limpo', 'NinjaTrader', 'Revelação do gráfico no NinjaTrader.', 'Fundo para conteúdo de NinjaTrader', ''),
    ('c06-contra-limpo', 'Contexto contra', 'Zoom no aviso "Correção contra W/M".', 'Fundo para falar de paciência e risco', ''),
    ('c07-queda-contexto-limpo', 'Queda contra o contexto', 'A queda forte até o aviso de correção contra W/M.', 'Fundo para falar de contexto', ''),
    ('c08-vwap-3m-limpo', 'Defesa na VWAP 3M', 'Rompimento, correção e defesa na VWAP 3M.', 'Fundo para falar de VWAP', ''),
    ('c09-queda-ninjatrader-limpo', 'Queda no NinjaTrader', 'Perda da zona e novo valor do dia.', 'Fundo para conteúdo de NinjaTrader', ''),
    ('c10-escada-de-valor-limpo', 'Escada de valor', 'Revelação de baixo para cima pelos níveis de valor.', 'Fundo para falar de VAH e VAL', ''),
    ('c11-estado-de-mercado-limpo', 'Estado de Mercado', 'O 30 minutos se construindo, os alvos e o painel.', 'Fundo para falar do painel e dos alvos', ''),
    ('c12-gamma-1-minuto-limpo', 'Gamma no 1 minuto', 'Construção do gráfico com calls, puts, Zero Gamma e o painel de risco.', 'Fundo para falar de Gamma', ''),
    ('c13-zero-gamma-limpo', 'Zero Gamma perdido', 'Do VAH D até a região das puts.', 'Fundo para falar de Gamma', ''),
    ('c14-volatilidade-volume-gamma-limpo', 'Antes e depois com Gamma', 'Dos alvos de volatilidade ao alvo de volume e o GL Gamma.', 'Fundo para falar de alvos', ''),
    ('c15-rompimento-gamma-limpo', 'Rompimento com Gamma', 'Base, rompimento e o alvo W +1%.', 'Fundo para falar de rompimentos', ''),
  ]),
  ('horizontais', 'Coringas horizontais (16:9)', 'Para YouTube, vídeo de boas-vindas do funil, VSL e trechos de live.', [
    ('h01-duas-telas-limpo', 'Duas telas no TradingView', 'Leitura em dois tempos gráficos com revelação.', 'YouTube, VSL', ''),
    ('h02-alta-alinhada-limpo', 'Alta alinhada', 'Setup acontecendo até o marcador D/W/M.', 'YouTube, VSL', ''),
    ('h03-ninjatrader-limpo', 'NinjaTrader', 'Estrutura de mercado GL no NinjaTrader.', 'YouTube, VSL', ''),
    ('h04-estado-de-mercado-limpo', 'Estado de Mercado', 'O 30 minutos se construindo: três semanas, os alvos e o painel.', 'YouTube, VSL', ''),
  ]),
  ('marca', 'Logo e vinheta GL', 'O emblema real se formando em partículas douradas, com brilho e 2 segundos parado no fim. Feitos aqui, sem gastar crédito.', [
    ('logo-gl-8s-16x9', 'Logo GL em 8 segundos · 16:9', 'Partículas formam o emblema, entra "GL ACADEMY" e o emblema fica parado nos 2 s finais.', 'Abertura de vídeos do YouTube, VSL e lives', ''),
    ('logo-gl-8s-9x16', 'Logo GL em 8 segundos · 9:16', 'A mesma abertura no formato vertical.', 'Stories, fim de Reels, apresentação', ''),
    ('vinheta-gl-4s-16x9', 'Vinheta curta · 16:9', '4 segundos: o emblema se forma e entra o nome.', 'Entrada e saída de vídeos do YouTube', ''),
    ('vinheta-gl-4s-9x16', 'Vinheta curta · 9:16', '4 segundos no formato vertical.', 'Fim de Reels e stories', ''),
  ]),
  ('site', 'Kit do site', 'Loops leves e sem corte para as páginas do site, já otimizados (MP4 sem som). Onde usar cada um está no mapa logo abaixo.', [
    ('site-circulo-pacote', 'Círculo do Pacote Completo', 'Emblema vivo: raios, brilho e poeira dourada. 8 s em loop, quadrado para recorte redondo.', 'Escolha: círculo central', ''),
    ('site-circulo-tecnologias', 'Círculo de Tecnologias', 'Gráfico real em movimento lento. 8 s em loop, quadrado para recorte redondo.', 'Escolha e Tecnologias: círculo do topo', ''),
    ('site-loop-tradingview', 'Loop TradingView', 'Contexto alta alinhada D/W/M com o selo da plataforma. 8 s em loop.', 'Tecnologias: card Pacote TradingView', ''),
    ('site-loop-ninjatrader', 'Loop NinjaTrader', 'Estrutura de Mercado e valor do dia no NinjaTrader. 8 s em loop.', 'Tecnologias: card Operacional Completo', ''),
    ('site-loop-gamma', 'Loop GL Gamma', 'Zero Gamma e Call Wall, com o aviso de assinatura à parte. 8 s em loop.', 'Tecnologias e Pacote Completo: GL Gamma', ''),
    ('site-loop-alvos', 'Loop Alvos', 'Alvos D, W, M e 3M marcados no gráfico. 8 s em loop.', 'Galeria "Veja os sistemas em uso"', ''),
    ('site-gamma-explicacao-16x9', 'Explicação do GL Gamma', 'Zero Gamma, Call Wall e HVL explicados, com legenda e o gráfico ao lado. 13 s.', 'Tecnologias: "Conhecer o GL Gamma"', ''),
    ('site-pacote-completo-16x9', 'Visão geral do Pacote Completo', 'Operacional Completo, APP GL Model Academy e o que é contratado à parte. 23 s.', 'Pacote Completo: logo depois do topo', ''),
  ]),
  ('lives', 'Lives e YouTube', 'Abertura, encerramento e as telas de espera em loop. No OBS: Fonte de mídia, marque "Repetir" nos loops.', [
    ('live-abertura-16x9', 'Abertura de live', 'O emblema GL se forma em partículas, passa pelo operacional e chama "A live vai começar".', 'Início das lives', ''),
    ('live-encerramento-16x9', 'Encerramento de live', 'Agradecimento, chamada para a call 1x1 e o emblema se desfazendo.', 'Fim das lives', ''),
    ('live-loop-comecando-16x9', 'Loop: a live já vai começar', '60 segundos em loop sem corte, com o operacional e mensagens da GL.', 'Antes da live começar', ''),
    ('live-loop-pausa-16x9', 'Loop: voltamos já', 'Mesmo loop para pausas, quando a câmera sai do ar.', 'Pausas durante a live', ''),
  ]),
  ('live2', 'Kit de live 2.0 para o OBS', 'Sobreposições com fundo transparente (WebM) e a contagem regressiva. No OBS: Fonte de mídia, e marque "Repetir" no selo.', [
    ('live-faixa-nome', 'Faixa com o nome', 'Giovane Lázaro · GL Academy. Entra pela esquerda e sai sozinha em 8 s.', 'OBS: por cima da câmera', ''),
    ('live-faixa-call', 'Faixa "Agende sua call"', 'Entra por baixo e fica 10 s na tela.', 'OBS: chame a cada 15 minutos', ''),
    ('live-selo-ao-vivo', 'Selo AO VIVO', 'Loop de 4 s com o ponto pulsando.', 'OBS: canto da tela, com Repetir', ''),
    ('live-transicao', 'Transição dourada', 'Stinger de 1,5 s. No OBS, ponto de transição em 700 ms.', 'OBS: Transição de cena, Stinger', ''),
    ('live-contagem-5min', 'Contagem regressiva de 5 minutos', 'De 5:00 a 0:00, terminando em "Começando agora".', 'Antes da live começar', ''),
  ]),
  ('youtube', 'YouTube', 'Trailer do canal e tela final para os últimos 20 segundos dos vídeos.', [
    ('youtube-trailer', 'Trailer do canal', 'Vinheta, lives, setups, aulas e Gamma, terminando em "Inscreva-se". 33 s.', 'Trailer para quem ainda não é inscrito',
     f'No canal da GL Academy: lives com o mercado ao vivo, setups em replay e aulas rápidas de VWAP, Value Area e Gamma. Inscreva-se e ative o sininho. {AVISO}'),
    ('youtube-tela-final', 'Tela final', 'Espaço para 2 vídeos e o botão de inscrição. Posicione os elementos no YouTube Studio.', 'Últimos 20 s de cada vídeo', ''),
  ]),
  ('comerciais', 'Comerciais das tecnologias GL', 'Juntam tudo: contexto, setup, níveis, alvos, Gamma e NinjaTrader, terminando na chamada para a call.', [
    ('comercial-tecnologias-gl-16x9', 'Comercial 16:9', '44 segundos para YouTube, intervalo de live e site.', 'YouTube, lives, anúncio em vídeo',
     f'As tecnologias da GL Academy: GL Model, Multi Fractal, GL Gamma, Order Flow, GL Risk Auto e Gamepad Trader Pro. Método, tecnologia e risco em primeiro lugar. GL Gamma é uma assinatura à parte. Agende sua call 1x1 gratuita no link da descrição. {AVISO}'),
    ('comercial-tecnologias-gl-9x16', 'Comercial vertical', '40 segundos para Reels, Shorts, TikTok e anúncios.', 'Anúncio principal, Reels',
     f'Contexto, entrada, alvos e Gamma no mesmo mapa. Essas são as tecnologias da GL Academy. GL Gamma é uma assinatura à parte. Call 1x1 gratuita no link da bio. {AVISO}'),
  ]),
  ('comunidade', 'Comunidade e parceiros', 'Boas-vindas para quem entra na comunidade e a cartela para influenciadores parceiros (troque o @ e eu gero uma por parceiro em minutos).', [
    ('comunidade-boas-vindas', 'Boas-vindas da comunidade', 'O que a pessoa encontra, ativar notificações e a call 1x1.', 'Mensagem fixada no grupo do WhatsApp',
     f'Seja bem-vindo à comunidade da GL Academy! Por aqui você acompanha as lives, os setups em replay e as aulas rápidas. Ative as notificações para não perder as lives. {AVISO}'),
    ('parceiro-exemplo', 'Cartela de parceiro (exemplo)', 'Publicidade, @ do parceiro e chamada para a call pelo link dele.', 'Fim dos vídeos de parceiros',
     f'#publi Sou parceiro da GL Academy. Quer ver o GL Model no seu gráfico? Agende sua call 1x1 gratuita pelo link da minha bio. {AVISO}'),
  ]),
]

def dur(path):
    r = subprocess.run([FF, '-i', path], capture_output=True, text=True).stderr
    for line in r.splitlines():
        if 'Duration:' in line:
            h, m, s = line.split('Duration:')[1].split(',')[0].strip().split(':')
            return round(int(h) * 3600 + int(m) * 60 + float(s))
    return 0

def size(path):
    r = subprocess.run([FF, '-i', path], capture_output=True, text=True).stderr
    m = re.search(r'Video: .*?, (\d{3,4})x(\d{3,4})', r)
    return int(m.group(1)), int(m.group(2))

cards_html, manifest = [], []
for gid, gtitle, gdesc, items in GROUPS:
    cards = []
    for vid, title, desc, use, cap in items:
        src = os.path.join(OUT, vid + '.mp4')
        ext = 'mp4'
        if not os.path.exists(src) and os.path.exists(os.path.join(OUT, vid + '.webm')):
            src, ext = os.path.join(OUT, vid + '.webm'), 'webm'
        if not os.path.exists(src):
            continue
        rel = f'site/{vid}.mp4' if gid == 'site' else f'videos/{vid}.{ext}'
        dst = os.path.join(LIB, rel)
        # versão leve para a página; só refaz quando o original mudou
        if ext == 'webm':
            # sobreposições transparentes: o arquivo já é leve, vai como está
            if not os.path.exists(dst) or os.path.getmtime(dst) < os.path.getmtime(src):
                subprocess.run(['cp', src, dst], check=True)
        elif gid == 'site' and (not os.path.exists(dst) or os.path.getmtime(dst) < os.path.getmtime(src)):
            # kit do site: versão leve sem som e a capa em tamanho cheio, com os nomes que o código do site usa
            os.makedirs(os.path.dirname(dst), exist_ok=True)
            subprocess.run([FF, '-nostdin', '-y', '-loglevel', 'error', '-i', src, '-an', '-c:v', 'libx264', '-crf', '27', '-preset', 'slow', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', dst], check=True)
            t = '2.5' if vid in ('site-gamma-explicacao-16x9', 'site-pacote-completo-16x9') else '0'
            subprocess.run([FF, '-nostdin', '-y', '-loglevel', 'error', '-ss', t, '-i', src, '-frames:v', '1', '-q:v', '3', dst[:-4] + '.jpg'], check=True)
        elif gid != 'site' and (not os.path.exists(dst) or os.path.getmtime(dst) < os.path.getmtime(src)):
            crf = CRF.get(vid) or ('20' if vid.startswith(HQ) else '25')
            subprocess.run([FF, '-y', '-loglevel', 'error', '-i', src, '-c:v', 'libx264', '-crf', crf, '-preset', 'slow', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', dst], check=True)
        d = dur(src)
        poster = os.path.join(LIB, 'capas', vid + '.jpg')
        if ext == 'webm':
            # capa com o quadriculado de transparência (quadro de conferência)
            qa = sorted(f for f in os.listdir(os.path.join(OUT, 'check')) if f.startswith(vid + '-'))
            subprocess.run([FF, '-nostdin', '-y', '-loglevel', 'error', '-i', os.path.join(OUT, 'check', qa[-1]), '-vf', 'scale=540:-2', '-q:v', '5', poster], check=True)
        else:
            t = 0 if vid.startswith(('site-loop', 'site-circulo')) else max(1, d * 0.62)
            subprocess.run([FF, '-nostdin', '-y', '-loglevel', 'error', '-ss', str(t), '-i', src, '-frames:v', '1', '-vf', 'scale=540:-2', '-q:v', '5', poster], check=True)
        w, h = size(src)
        fmt, kind = ('16:9', 'is-h') if w > h else (('9:16', 'is-v') if h / w > 1.6 else (('1:1', 'is-q') if h == w else ('4:5', 'is-f')))
        manifest.append(vid)
        cap_html = ''
        if cap:
            cid = 'cap-' + vid
            cap_html = f'<div class="cap"><p class="label">Legenda pronta</p><p class="cap-text" id="{cid}">{html.escape(cap)}</p><button type="button" class="btn" data-copy="{cid}">Copiar legenda</button></div>'
        cards.append(f'''<article class="vcard {kind}" data-vid="{vid}" data-src="{rel}" data-group="{gid}" data-title="{html.escape(title)}" data-fmt="{fmt}" data-dur="{d}" data-use="{html.escape(use)}">
  <div class="frame"><video controls playsinline preload="none" {'loop ' if vid.startswith(('site-loop', 'site-circulo', 'live-selo')) else ''}poster="capas/{vid}.jpg" src="{rel}"></video></div>
  <div class="meta">
    <p class="tags"><span class="tag">{fmt}</span><span class="tag">{d} s</span><span class="tag tag-use">{html.escape(use)}</span></p>
    <h3>{html.escape(title)}</h3>
    <p class="desc">{html.escape(desc)}</p>
    <p class="file">{os.path.basename(rel)}</p>
    <button type="button" class="btn btn-dl" data-dl="{rel}">Baixar {ext.upper()}</button>
    {cap_html}
  </div>
</article>''')
    if cards:
        zipb = f'<button type="button" class="btn" data-zip="{gid}">Baixar este grupo (ZIP, {len(cards)} vídeos)</button>'
        cards_html.append(f'<section id="{gid}"><div class="section-head"><h2>{gtitle}</h2><p>{gdesc}</p>{zipb}</div><div class="grid">{"".join(cards)}</div></section>')

open(os.path.join(LIB, 'sections.html'), 'w', encoding='utf-8').write('\n'.join(cards_html))
json.dump(manifest, open(os.path.join(LIB, 'manifest.json'), 'w'))
print(len(manifest), 'vídeos')

# Página final: modelo + seções geradas; prints originais publicados junto
page = open(os.path.join(LIB, 'template.html'), encoding='utf-8').read().replace('<!--SECTIONS-->', '\n'.join(cards_html))
open(os.path.join(LIB, 'index.html'), 'w', encoding='utf-8').write(page)
os.makedirs(os.path.join(LIB, 'prints'), exist_ok=True)
for n in range(1, 13):
    src = os.path.join(ROOT, f'{n}.png'); dst = os.path.join(LIB, 'prints', f'{n}.png')
    if not os.path.exists(dst) or os.path.getmtime(dst) < os.path.getmtime(src):
        subprocess.run(['cp', src, dst], check=True)

# ---------------------------------------------------------------------------
# Imagens (carrosséis, posts, stories, thumbnails, site): galeria com download
AV = 'Conteúdo educacional; trading envolve risco financeiro real.'
IMG_GROUPS = [
  ('img-carrossel-vwap', 'Carrossel: o que é VWAP', 'carrosseis/carrossel-vwap', '4:5', f'O que é VWAP, em 6 slides, no gráfico real. Salve para estudar. {AV}', {}),
  ('img-carrossel-value-area', 'Carrossel: Value Area', 'carrosseis/carrossel-value-area', '4:5', f'Value Area, VAH, VAL e POC em 6 slides. Salve para estudar. {AV}', {}),
  ('img-carrossel-3-perguntas', 'Carrossel: as 3 perguntas', 'carrosseis/carrossel-3-perguntas', '4:5', f'As 3 perguntas antes de qualquer trade: direção, entrada e alvos. Salve e use antes do próximo trade. {AV}', {}),
  ('img-carrossel-nem-toda-queda', 'Carrossel: nem toda queda é venda', 'carrosseis/carrossel-nem-toda-queda', '4:5', f'Nem toda queda é venda: um replay em 6 slides sobre contexto. Exemplo educacional. {AV}', {}),
  ('img-carrossel-gl-gamma', 'Carrossel: GL Gamma', 'carrosseis/carrossel-gl-gamma', '4:5', f'Os níveis do GL Gamma no seu gráfico: Zero Gamma, Call Wall e HVL. GL Gamma é uma assinatura à parte. {AV}', {}),
  ('img-posts', 'Posts 4:5 com gráfico anotado', 'imagens/posts-4x5', '4:5', '', {
    'post-alta-alinhada': f'Quando dia, semana e mês concordam, o contexto está a favor. O GL Model mostra isso antes da entrada. Replay, exemplo educacional. {AV}',
    'post-correcao-contra': f'Nem toda queda é venda. Aqui o modelo classificou: correção contra a semana e o mês. Contexto primeiro. Replay, exemplo educacional. {AV}',
    'post-defesa-vwap-3m': f'A VWAP do trimestre segurou o preço na correção. VWAPs no mesmo gráfico do GL Model. Replay, exemplo educacional. {AV}',
    'post-alvo-antes-do-preco': f'O alvo aparece antes do preço chegar. Alvos são projeções do modelo, não promessa de resultado. {AV}',
    'post-escada-de-valor': f'Degrau por degrau: o valor do mês, do trimestre e da semana marcados no gráfico. Replay, exemplo educacional. {AV}',
    'post-zero-gamma': f'Zero Gamma: onde o regime de volatilidade costuma virar, direto no gráfico de futuros. GL Gamma é uma assinatura à parte. {AV}',
    'post-valor-do-dia-ninjatrader': f'O valor do dia desenhado no NinjaTrader: VAH, POC e VAL pela Estrutura de Mercado. {AV}',
    'post-nivel-respeitado': f'O nível estava marcado antes: o preço foi buscar o VAH D. Replay, exemplo educacional; resultado passado não garante resultado futuro.',
    'post-varredura-na-minima': f'Varreu a mínima e voltou para o valor: o primeiro sinal do setup. Replay, exemplo educacional. {AV}',
    'post-tradingview-e-ninjatrader': f'O mesmo mapa nas duas plataformas: Estrutura de Mercado e Estado de Mercado no TradingView e no NinjaTrader. {AV}'}),
  ('img-frases', 'Frases 1:1', 'imagens/frases-1x1', '1:1', 'Posts de respiro entre os conteúdos técnicos. Legenda: a própria frase e "Salve para lembrar."', {}),
  ('img-stories', 'Stories', 'imagens/stories-9x16', '9:16', 'Os espaços tracejados recebem os stickers do Instagram (link, enquete, lembrete). Poste a enquete num dia e a resposta no outro.', {}),
  ('img-capas-reels', 'Capas de Reels', 'capas/capas-reels', '9:16', 'Título dentro da área que o perfil mostra em 4:5. Use como capa ao publicar cada Reels.', {}),
  ('img-destaques', 'Capas de destaques', 'imagens/destaques', '9:16', 'O Instagram mostra o círculo central. Ordem sugerida: Setups, Aulas, Lives, Call, Gamma, Alunos.', {}),
  ('img-youtube', 'Thumbnails do YouTube', 'imagens/youtube-thumbs', '16:9', 'Em 1280x720. Ficam ainda melhores com uma foto do Giovane à esquerda: mande uma e eu monto as versões com rosto.', {}),
  ('img-site-galeria', 'Galeria do site', 'imagens/site-galeria', '16:9', 'Para a seção "Veja os sistemas em uso": gráfico real com o selo da plataforma e as marcações. O site já tem a legenda.', {}),
  ('img-site-og', 'Imagens de compartilhamento do site', 'imagens/site-compartilhamento', '16:9', 'A imagem que aparece quando alguém compartilha o link da página no WhatsApp, Instagram ou LinkedIn. 1200x630, no estilo do site. Vai na meta og:image de cada página.', {}),
]
img_html, img_files = [], []
for gid, title, folder, ratio, cap, caps in IMG_GROUPS:
    src_dir = os.path.join(OUT, folder)
    if not os.path.isdir(src_dir):
        continue
    files = sorted(f for f in os.listdir(src_dir) if f.endswith('.jpg'))
    os.makedirs(os.path.join(LIB, 'imagens', gid), exist_ok=True)
    cards = []
    for f in files:
        src, rel = os.path.join(src_dir, f), f'imagens/{gid}/{f}'
        dst = os.path.join(LIB, rel)
        if not os.path.exists(dst) or os.path.getmtime(dst) < os.path.getmtime(src):
            subprocess.run(['cp', src, dst], check=True)
        img_files.append(rel)
        name = f[:-4]; c = caps.get(name, '')
        cap_html = ''
        if c:
            cid = 'cap-' + name
            cap_html = f'<p class="cap-text" id="{cid}">{html.escape(c)}</p><button type="button" class="btn" data-copy="{cid}">Copiar legenda</button>'
        cards.append(f'<figure class="icard" data-src="{rel}" data-group="{gid}" data-title="{html.escape(name)}"><a href="{rel}" target="_blank" rel="noopener"><img src="{rel}" alt="{html.escape(title)}: {html.escape(name)}" loading="lazy"></a><figcaption><span class="file">{f}</span><button type="button" class="btn btn-dl" data-dl="{rel}">Baixar JPG</button>{cap_html}</figcaption></figure>')
    group_cap = ''
    if cap and not caps:
        cid = 'cap-' + gid
        group_cap = f'<div class="cap" style="border:0;padding:0"><p class="label">Legenda pronta</p><p class="cap-text" id="{cid}">{html.escape(cap)}</p><button type="button" class="btn" data-copy="{cid}">Copiar legenda</button></div>' if 'carrossel' in gid else f'<p class="desc">{html.escape(cap)}</p>'
    zipb = f'<button type="button" class="btn" data-zip="{gid}">Baixar este grupo (ZIP, {len(cards)} imagens)</button>'
    cls = {'4:5': 'r45', '1:1': 'r11', '9:16': 'r916', '16:9': 'r169'}[ratio]
    img_html.append(f'<section id="{gid}" class="imgsec"><div class="section-head"><h2>{html.escape(title)}</h2>{group_cap}{zipb}</div><div class="igrid {cls}">{"".join(cards)}</div></section>')

# Kit do site: mapa de uso, código e a lista de arquivos para o ZIP
site_files = sorted(f'site/{f}' for f in os.listdir(os.path.join(LIB, 'site'))) + [r for r in img_files if '/img-site-' in r]
site_map = open(os.path.join(LIB, 'site-map.html'), encoding='utf-8').read()
cards_html = [c.replace('<section id="site">', '<section id="site">', 1) for c in cards_html]
for i, c in enumerate(cards_html):
    if c.startswith('<section id="site">'):
        cards_html[i] = c[:-len('</section>')] + site_map + f'<script type="application/json" id="kit-site-files">{json.dumps(site_files)}</script></section>'

page = open(os.path.join(LIB, 'template.html'), encoding='utf-8').read()
page = page.replace('<!--SECTIONS-->', '\n'.join(cards_html)).replace('<!--IMAGES-->', '\n'.join(img_html))
open(os.path.join(LIB, 'index.html'), 'w', encoding='utf-8').write(page)
print(len(img_files), 'imagens;', len(site_files), 'arquivos no kit do site')

# Pacote organizado para levar ao computador (manifesto e textos na página)
subprocess.run(['python3', os.path.join(ROOT, 'organizacao.py')], check=True)
# Kit do site: os melhores vídeos para cada espaço do site, com capas e o prompt para o Codex
subprocess.run(['python3', os.path.join(ROOT, 'kit_site.py')], check=True)
