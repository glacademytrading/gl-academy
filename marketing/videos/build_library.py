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
GROUPS = [
  ('vendem', 'Vídeos que vendem o operacional', 'Prontos para Reels, Shorts, TikTok e anúncios. Cada um prova uma coisa que o GL Model faz, com o print real.', [
    ('v01-a-favor-ou-contra', 'A favor ou contra', 'Antes e depois: o modelo avisa "Correção contra W/M · Calor 4%" e depois "Alta alinhada D/W/M · Calor 19%".', 'Anúncio de topo, Reels',
     f'Antes de entrar, uma pergunta: o mercado está a favor ou contra você? O GL Model mostra o contexto diário, semanal e mensal e o calor do movimento. Quando está contra, a gente espera. Call 1x1 gratuita no link da bio. {AVISO}'),
    ('v02-setup-acontecendo', 'Setup acontecendo', 'Replay do setup: varredura na mínima, rompimento acima das VWAPs D e W e o alinhamento D/W/M.', 'Reels, anúncio',
     f'Veja o setup acontecendo no replay: o preço varre a mínima, volta para o valor, rompe as VWAPs D e W e o modelo confirma a alta alinhada. Quer ver no seu ativo? Link na bio. {AVISO}'),
    ('v03-alvos-claros', 'Alvos claros', 'Os alvos D/W, M e 3M aparecem antes do preço chegar.', 'Reels, anúncio, carrossel em vídeo',
     f'O alvo aparece antes do preço chegar. No GL Model, alvos diário, semanal e mensal ficam no gráfico junto com VAH e VAL. Alvos são projeções, não promessa de resultado. {AVISO}'),
    ('v04-gamma-exposure', 'Gamma Exposure no gráfico', 'Zero Gamma, Call Wall, HVL e os níveis GL explicados no próprio gráfico.', 'Reels educativo, anúncio do GL Gamma',
     f'Gamma Exposure dentro do seu gráfico: Zero Gamma, Call Wall, HVL e os níveis GL, lidos junto com o GL Model. Salve para estudar. {AVISO}'),
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
  ('objecoes', 'Respostas às objeções', 'Para remarketing: quem já viu a GL e não agendou costuma travar numa dessas dúvidas. Cada vídeo responde uma e termina na call 1x1.', [
    ('objecao-plataforma', 'Funciona na minha plataforma?', 'TradingView e NinjaTrader com o mesmo mapa; os planos NinjaTrader já incluem o TradingView.', 'Remarketing, stories de venda, resposta em DM',
     f'Funciona na minha plataforma? O GL Model roda no TradingView e no NinjaTrader, com o mesmo mapa. E os planos NinjaTrader já incluem o TradingView. Tire suas dúvidas na call 1x1 gratuita, link na bio. {AVISO}'),
    ('objecao-mais-um-indicador', 'É só mais um indicador?', 'Contexto, valor, alvos e Gamma: quatro camadas no mesmo gráfico.', 'Remarketing, anúncio de meio de funil',
     f'É só mais um indicador? Não, é um mapa: contexto D/W/M, valor do dia, da semana e do mês, alvos e Gamma, tudo no mesmo gráfico. Alvos são projeções, não promessa de resultado. Call 1x1 gratuita no link da bio. {AVISO}'),
    ('objecao-opcoes', 'Preciso entender de opções?', 'Os níveis de Gamma já vêm no gráfico de futuros: Zero Gamma, Call Wall e HVL.', 'Remarketing, anúncio do GL Gamma',
     f'Preciso entender de opções para usar Gamma? Não precisa operar opções: Zero Gamma, Call Wall e HVL aparecem direto no seu gráfico de futuros. GL Gamma, o mapa das opções no seu gráfico. {AVISO}'),
    ('objecao-por-onde-comecar', 'Não sei por onde começar', 'Chamada direta para a call 1x1: 30 minutos, gratuita.', 'Anúncio de conversão, stories com link',
     f'Não sabe por onde começar? Comece pela call 1x1 gratuita: 30 minutos para contar o seu momento no mercado e entender o próximo passo. Link na bio. {AVISO}'),
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
  ]),
  ('horizontais', 'Coringas horizontais (16:9)', 'Para YouTube, vídeo de boas-vindas do funil, VSL e trechos de live.', [
    ('h01-duas-telas-limpo', 'Duas telas no TradingView', 'Leitura em dois tempos gráficos com revelação.', 'YouTube, VSL', ''),
    ('h02-alta-alinhada-limpo', 'Alta alinhada', 'Setup acontecendo até o marcador D/W/M.', 'YouTube, VSL', ''),
    ('h03-ninjatrader-limpo', 'NinjaTrader', 'Estrutura de mercado GL no NinjaTrader.', 'YouTube, VSL', ''),
  ]),
  ('marca', 'Logo e vinheta GL', 'O emblema real se formando em partículas douradas, com brilho e 2 segundos parado no fim. Feitos aqui, sem gastar crédito.', [
    ('logo-gl-8s-16x9', 'Logo GL em 8 segundos · 16:9', 'Partículas formam o emblema, entra "GL ACADEMY" e o emblema fica parado nos 2 s finais.', 'Abertura de vídeos do YouTube, VSL e lives', ''),
    ('logo-gl-8s-9x16', 'Logo GL em 8 segundos · 9:16', 'A mesma abertura no formato vertical.', 'Stories, fim de Reels, apresentação', ''),
    ('vinheta-gl-4s-16x9', 'Vinheta curta · 16:9', '4 segundos: o emblema se forma e entra o nome.', 'Entrada e saída de vídeos do YouTube', ''),
    ('vinheta-gl-4s-9x16', 'Vinheta curta · 9:16', '4 segundos no formato vertical.', 'Fim de Reels e stories', ''),
  ]),
  ('lives', 'Lives e YouTube', 'Abertura, encerramento e as telas de espera em loop. No OBS: Fonte de mídia, marque "Repetir" nos loops.', [
    ('live-abertura-16x9', 'Abertura de live', 'O emblema GL se forma em partículas, passa pelo operacional e chama "A live vai começar".', 'Início das lives', ''),
    ('live-encerramento-16x9', 'Encerramento de live', 'Agradecimento, chamada para a call 1x1 e o emblema se desfazendo.', 'Fim das lives', ''),
    ('live-loop-comecando-16x9', 'Loop: a live já vai começar', '60 segundos em loop sem corte, com o operacional e mensagens da GL.', 'Antes da live começar', ''),
    ('live-loop-pausa-16x9', 'Loop: voltamos já', 'Mesmo loop para pausas, quando a câmera sai do ar.', 'Pausas durante a live', ''),
  ]),
  ('comerciais', 'Comerciais das tecnologias GL', 'Juntam tudo: contexto, setup, níveis, alvos, Gamma e NinjaTrader, terminando na chamada para a call.', [
    ('comercial-tecnologias-gl-16x9', 'Comercial 16:9', '44 segundos para YouTube, intervalo de live e site.', 'YouTube, lives, anúncio em vídeo',
     f'As tecnologias da GL Academy: GL Model, Multi Fractal, GL Gamma, Order Flow, GL Risk Auto e Gamepad Trader Pro. Método, tecnologia e risco em primeiro lugar. Agende sua call 1x1 gratuita no link da descrição. {AVISO}'),
    ('comercial-tecnologias-gl-9x16', 'Comercial vertical', '40 segundos para Reels, Shorts, TikTok e anúncios.', 'Anúncio principal, Reels',
     f'Contexto, entrada, alvos e Gamma no mesmo mapa. Essas são as tecnologias da GL Academy. Call 1x1 gratuita no link da bio. {AVISO}'),
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
        if not os.path.exists(src):
            continue
        dst = os.path.join(LIB, 'videos', vid + '.mp4')
        # versão leve para a página; só refaz quando o original mudou
        if not os.path.exists(dst) or os.path.getmtime(dst) < os.path.getmtime(src):
            crf = '20' if vid.startswith(HQ) else '25'
            subprocess.run([FF, '-y', '-loglevel', 'error', '-i', src, '-c:v', 'libx264', '-crf', crf, '-preset', 'slow', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', dst], check=True)
        d = dur(src)
        poster = os.path.join(LIB, 'capas', vid + '.jpg')
        subprocess.run([FF, '-y', '-loglevel', 'error', '-ss', str(max(1, d * 0.62)), '-i', src, '-frames:v', '1', '-vf', 'scale=540:-2', '-q:v', '5', poster], check=True)
        w, h = size(src)
        fmt, kind = ('16:9', 'is-h') if w > h else (('9:16', 'is-v') if h / w > 1.6 else ('4:5', 'is-f'))
        manifest.append(vid)
        cap_html = ''
        if cap:
            cid = 'cap-' + vid
            cap_html = f'<div class="cap"><p class="label">Legenda pronta</p><p class="cap-text" id="{cid}">{html.escape(cap)}</p><button type="button" class="btn" data-copy="{cid}">Copiar legenda</button></div>'
        cards.append(f'''<article class="vcard {kind}" data-vid="{vid}" data-group="{gid}" data-title="{html.escape(title)}" data-fmt="{fmt}" data-dur="{d}" data-use="{html.escape(use)}">
  <div class="frame"><video controls playsinline preload="none" poster="capas/{vid}.jpg" src="videos/{vid}.mp4"></video></div>
  <div class="meta">
    <p class="tags"><span class="tag">{fmt}</span><span class="tag">{d} s</span><span class="tag tag-use">{html.escape(use)}</span></p>
    <h3>{html.escape(title)}</h3>
    <p class="desc">{html.escape(desc)}</p>
    <p class="file">{vid}.mp4</p>
    <button type="button" class="btn btn-dl" data-dl="{vid}">Baixar MP4</button>
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
for n in range(1, 6):
    src = os.path.join(ROOT, f'{n}.png'); dst = os.path.join(LIB, 'prints', f'{n}.png')
    if not os.path.exists(dst) or os.path.getmtime(dst) < os.path.getmtime(src):
        subprocess.run(['cp', src, dst], check=True)
