# Pacote "GL Academy - Marketing (Claude).zip": dá a cada arquivo publicado na Biblioteca um lugar
# na pasta organizada (por objetivo e função, com nome legível) e escreve os textos que vão junto:
# LEIA-ME de cada pasta, legendas, catálogo, índice por tema, roteiros e o organizador do Windows.
# O ZIP é montado no navegador pela própria Biblioteca; aqui só se grava o manifesto na página.
# O build_library.py chama este script no fim.
import html, json, os, re

ROOT = os.path.dirname(os.path.abspath(__file__))
LIB = os.path.join(ROOT, 'biblioteca')
MKT = os.environ.get('GL_MARKETING') or os.path.dirname(ROOT)
BIBLIOTECA = 'https://claude.ai/artifact/BgpMsKZZn2BikAYBcXSDfm'
SISTEMA = 'https://claude.ai/artifact/7MhNCUVNeDtQACf9euH5Ns'
NOME_ZIP = 'GL Academy - Marketing (Claude).zip'
NOME_ZIP_LEVE = 'GL Academy - Organizador e textos.zip'
AVISO = 'Conteúdo educacional; trading envolve risco financeiro real.'
# Caminho da pasta no computador do Giovane: os caminhos do pacote precisam caber no limite de 260 do Windows
BASE_WIN = r'C:\Users\Giovane Lazaro\Desktop\Arquivos e Programas\GL Academy organização\Trading\Marketing de trading' + '\\'

# Pastas principais (as mesmas do organizar-marketing.ps1)
P = {
  'comece': '00 - Comece aqui', 'estrat': '01 - Estratégia e planejamento',
  'videos': '02 - Vídeos (feitos pelo Claude)', 'imagens': '03 - Imagens (feitas pelo Claude)',
  'codex': '04 - Feito pelo Codex', 'textos': '05 - Roteiros, legendas e textos',
  'equipe': '06 - Materiais da equipe', 'leads': '07 - Leads (dados pessoais, acesso restrito)',
  'ferr': '08 - Ferramentas e tutoriais', 'prints': '09 - Prints do operacional (base dos vídeos)',
  'revisar': '99 - Para revisar',
}

# ---------------------------------------------------------------------------
# O que a página já tem: vídeos e imagens com título, uso e legenda
page = open(os.path.join(LIB, 'index.html'), encoding='utf-8').read()

def attr(tag, nome):
    m = re.search(r'\s' + nome + r'="([^"]*)"', tag)
    return html.unescape(m.group(1)) if m else ''

def texto(s):
    return html.unescape(re.sub(r'<[^>]+>', '', s or '')).strip()

def achar(padrao, s):
    m = re.search(padrao, s, re.S)
    return texto(m.group(1)) if m else ''

videos = []
for m in re.finditer(r'(<article class="vcard[^>]*>)(.*?)</article>', page, re.S):
    tag, corpo = m.group(1), m.group(2)
    videos.append(dict(vid=attr(tag, 'data-vid'), src=attr(tag, 'data-src'), grupo=attr(tag, 'data-group'),
                       titulo=attr(tag, 'data-title'), fmt=attr(tag, 'data-fmt'), dur=attr(tag, 'data-dur'),
                       uso=attr(tag, 'data-use'), desc=achar(r'<p class="desc">(.*?)</p>', corpo),
                       leg=achar(r'<p class="cap-text"[^>]*>(.*?)</p>', corpo)))

grupos_img, imagens = {}, []
for m in re.finditer(r'<section id="(img-[^"]+)" class="imgsec">(.*?)</section>', page, re.S):
    gid, corpo = m.group(1), m.group(2)
    topo = corpo.split('<div class="igrid', 1)[0]
    grupos_img[gid] = dict(titulo=achar(r'<h2>(.*?)</h2>', topo), leg=achar(r'<p class="cap-text"[^>]*>(.*?)</p>', topo),
                           desc=achar(r'<p class="desc">(.*?)</p>', topo))
    for f in re.finditer(r'(<figure class="icard"[^>]*>)(.*?)</figure>', corpo, re.S):
        imagens.append(dict(src=attr(f.group(1), 'data-src'), grupo=gid, nome=attr(f.group(1), 'data-title'),
                            leg=achar(r'<p class="cap-text"[^>]*>(.*?)</p>', f.group(2))))

# ---------------------------------------------------------------------------
# Nomes de arquivo legíveis e válidos no Windows
FMT = {'9:16': '9x16', '16:9': '16x9', '4:5': '4x5', '1:1': '1x1'}

def limpar(nome):
    nome = nome.replace('·', '-').replace(':', ' -').replace('/', '-').replace('\\', '-')
    nome = re.sub(r'[?*"<>|]', '', nome)
    nome = re.sub(r'\s+', ' ', nome).strip(' .-')
    return re.sub(r'(\s-)+$', '', nome)

def sem_formato(t):
    return re.sub(r'\s*[·-]?\s*\d+:\d+\s*$', '', t).strip()

V, I = P['videos'], P['imagens']
# grupo da Biblioteca -> pasta, objetivo, como usar
PASTAS_V = {
  'vendem': ('01 - Vender o operacional (Reels e anúncios)', 'Vender',
             'Mostram o GL Model funcionando no print real. Reels, Shorts, TikTok e anúncios.'),
  'ganchos': ('02 - Anúncios - teste de gancho', 'Anunciar',
              'O mesmo vídeo com outra primeira frase. Rode lado a lado no anúncio e fique com o que segura mais gente nos 3 primeiros segundos.'),
  'feed': ('03 - Anúncios no feed (4x5)', 'Anunciar',
           'Versões 4:5. O feed do Instagram e do Facebook corta o 9:16 e a legenda some; aqui nada fica cortado.'),
  'objecoes': ('04 - Remarketing - respostas às objeções', 'Remarketing',
               'Para quem já viu a GL e não agendou. Cada vídeo responde uma dúvida e termina na call 1x1.'),
  'aulas': ('05 - Educar - aulas rápidas', 'Educar e atrair seguidores',
            'Ensinam em 15 segundos com o gráfico real. Atraem seguidores e mostram autoridade sem pedir nada.'),
  'vendas-whats': ('06 - WhatsApp - sequência da call', 'Fazer a pessoa aparecer na call',
                   'Confirmação logo depois do agendamento, lembrete 1 hora antes e convite para remarcar se ela faltar. A legenda é a mensagem para mandar junto.'),
  'operacional': ('14 - Operacional por dentro', 'Vender',
                  'O gráfico se construindo e cada parte do operacional destacada: painel, cores, alvos de volume e de volatilidade, VWAPs e Gamma.'),
  'coringas': ('07 - Coringas sem texto (fundo para narrar)/Verticais 9x16', 'Produzir conteúdo todo dia',
               'Movimento do setup sem legenda. Coloque narração, texto ou gancho por cima e publique.'),
  'horizontais': ('07 - Coringas sem texto (fundo para narrar)/Horizontais 16x9', 'Produzir conteúdo todo dia',
                  'Para YouTube, boas-vindas do funil, VSL e trechos de live.'),
  'marca': ('08 - Marca - logo e vinhetas', 'Marca',
            'O emblema GL se formando em partículas douradas. Logo de 8 s para abrir YouTube e lives; vinheta de 4 s para o fim dos Reels.'),
  'lives': ('09 - Lives/Abertura, encerramento e espera', 'Lives',
            'No OBS: Fonte de mídia; marque "Repetir" nos loops.'),
  'live2': ('09 - Lives/OBS - sobreposições transparentes', 'Lives',
            'WebM com fundo transparente, para pôr por cima da câmera. No OBS: Fonte de mídia; no selo AO VIVO, marque "Repetir". A transição entra em Transição de cena > Stinger, com ponto de transição em 700 ms.'),
  'youtube': ('10 - YouTube', 'YouTube', 'Trailer do canal e tela final para os últimos 20 segundos dos vídeos.'),
  'comerciais': ('11 - Comerciais das tecnologias', 'Vender',
                 'Juntam tudo: contexto, setup, níveis, alvos, Gamma e NinjaTrader, terminando na chamada para a call.'),
  'site': ('12 - Site - loops para as páginas', 'Site',
           'Loops leves, sem som, cada um com a capa (JPG) de mesmo nome. Os nomes são os que o código do site usa; veja o LEIA-ME desta pasta.'),
  'comunidade': ('13 - Comunidade e parceiros', 'Comunidade',
                 'Boas-vindas para quem entra na comunidade e a cartela para influenciadores parceiros.'),
}
TEMAS = [
  ('Contexto D/W/M: a favor ou contra', r'^(v01|v08|c06|c07|h02)'),
  ('Estado de Mercado (painel Market State)', r'^(v12|c11|h04|v15|c14)'),
  ('Setup acontecendo (replay)', r'^(v02|c01|h01|h02)'),
  ('Alvos', r'^(v03|c02|site-loop-alvos|v11|c10|v12|v15|v16|v17|c11|c14|c15|c16|h04)'),
  ('VWAP', r'^(v09|c08|aula-vwap|v12)'),
  ('Value Area: VAH, VAL e POC', r'^(aula-value-area|v05|c04|v11|c10|v14|v16|c13|c15)'),
  ('GL Gamma (assinatura à parte)', r'^(v04|objecao-opcoes|c03|site-loop-gamma|site-gamma|v13|v14|v15|v16|v17|c12|c13|c14|c15|c16)'),
  ('NinjaTrader', r'^(v06|v10|c05|c09|h03|site-loop-ninjatrader|objecao-plataforma|v12|v13|c11|c12|h04)'),
  ('TradingView', r'^(objecao-plataforma|site-loop-tradingview|h01)'),
  ('As 3 perguntas antes do trade', r'^v07'),
  ('Call 1x1 e conversão', r'^(objecao-por-onde-comecar|call-|comercial|objecao-mais-um-indicador)'),
  ('Produtos e pacotes', r'^(site-pacote-completo|comercial|objecao-mais-um-indicador|site-circulo)'),
  ('Marca GL', r'^(logo|vinheta|site-circulo-pacote|live-abertura|live-encerramento)'),
  ('Lives', r'^live-'),
  ('YouTube', r'^(youtube|logo-gl-8s-16x9|vinheta-gl-4s-16x9|h0)'),
  ('Comunidade e parceiros', r'^(comunidade|parceiro)'),
]

def temas(vid):
    return [t for t, rx in TEMAS if re.match(rx, vid)]

arquivos, textos = [], {}

def add_texto(caminho, conteudo):
    assert caminho not in textos, caminho
    textos[caminho] = conteudo

# Vídeos: pasta por objetivo, numerados na ordem da Biblioteca
cont, por_pasta = {}, {}
for v in videos:
    ext = v['src'].rsplit('.', 1)[1]
    g = 'lives' if v['grupo'] == 'live2' and ext != 'webm' else v['grupo']
    pasta = V + '/' + PASTAS_V[g][0]
    if g == 'site':
        nome = os.path.basename(v['src'])
    else:
        cont[pasta] = cont.get(pasta, 0) + 1
        nome = f"{cont[pasta]:02d} - {limpar(sem_formato(v['titulo']))} ({FMT[v['fmt']]}).{ext}"
    v.update(pasta=pasta, arquivo=nome, objetivo=PASTAS_V[g][1], temas=temas(v['vid']))
    arquivos.append({'p': v['src'], 'z': pasta + '/' + nome})
    por_pasta.setdefault(pasta, []).append(v)
    if g == 'site':
        arquivos.append({'p': v['src'][:-4] + '.jpg', 'z': pasta + '/' + nome[:-4] + '.jpg'})

# Imagens
titulo_video = {v['vid']: v['titulo'] for v in videos}
NOMES_IMG = {
  'post-alta-alinhada': 'Alta alinhada D-W-M', 'post-alvo-antes-do-preco': 'O alvo antes do preço',
  'post-correcao-contra': 'Correção contra W-M', 'post-defesa-vwap-3m': 'Defesa na VWAP 3M',
  'post-escada-de-valor': 'Escada de valor', 'post-nivel-respeitado': 'Nível respeitado',
  'post-tradingview-e-ninjatrader': 'TradingView e NinjaTrader', 'post-valor-do-dia-ninjatrader': 'Valor do dia no NinjaTrader',
  'post-varredura-na-minima': 'Varredura na mínima', 'post-zero-gamma': 'Zero Gamma',
  'frase-contexto-primeiro': 'Contexto primeiro, entrada depois', 'frase-tres-perguntas': 'Não respondeu as 3 perguntas - espere',
  'frase-o-mercado-nao-deve': 'O mercado não te deve um trade', 'frase-risco-antes-do-clique': 'Risco definido antes do clique',
  'frase-nem-toda-queda': 'Nem toda queda é venda',
  'story-call': 'Call 1x1 gratuita (com espaço para o link)', 'story-live-hoje': 'Live hoje',
  'story-enquete': 'Enquete 1 - Você venderia aqui', 'story-enquete-resposta': 'Enquete 2 - A resposta (dia seguinte)',
  'story-comunidade': 'Comunidade GL no WhatsApp',
  'destaque-setups': '1 - Setups', 'destaque-aulas': '2 - Aulas', 'destaque-lives': '3 - Lives',
  'destaque-call': '4 - Call', 'destaque-gamma': '5 - Gamma', 'destaque-alunos': '6 - Alunos',
  'thumb-o-que-e-vwap': 'O que é VWAP', 'thumb-value-area': 'VAH, VAL e POC', 'thumb-gamma-exposure': 'Gamma no gráfico',
  'thumb-nem-toda-queda': 'Nem toda queda é venda', 'thumb-3-perguntas': '3 perguntas antes do trade',
  'thumb-mercado-ao-vivo': 'Mercado ao vivo',
}
PASTAS_I = {
  'img-posts': ('02 - Posts com gráfico anotado (4x5)', '4:5'), 'img-frases': ('03 - Frases (1x1)', '1:1'),
  'img-stories': ('04 - Stories (9x16)', '9:16'), 'img-capas-reels': ('05 - Capas de Reels (9x16)', '9:16'),
  'img-destaques': ('06 - Capas de destaques (círculo do perfil)', '9:16'), 'img-youtube': ('07 - Thumbnails do YouTube (16x9)', '16:9'),
  'img-site-galeria': ('08 - Site/Galeria - Veja os sistemas em uso', '16:9'),
  'img-site-og': ('08 - Site/Compartilhamento de link (og-image)', '1200x630'),
}
img_por_pasta = {}
for im in imagens:
    g, nome = im['grupo'], im['nome']
    if g.startswith('img-carrossel-'):
        tit = grupos_img[g]['titulo'].split(':', 1)[1].strip()
        pasta = f"{I}/01 - Carrosséis (Instagram 4x5)/{limpar(tit[0].upper() + tit[1:])}"
        arq = 'Slide ' + nome.rsplit('-', 1)[1] + '.jpg'
        fmt = '4:5'
    elif g in ('img-site-galeria', 'img-site-og'):
        pasta, fmt = I + '/' + PASTAS_I[g][0], PASTAS_I[g][1]
        arq = nome + '.jpg'  # o código do site usa estes nomes
    else:
        pasta, fmt = I + '/' + PASTAS_I[g][0], PASTAS_I[g][1]
        if g == 'img-capas-reels':
            arq = 'Capa - ' + limpar(sem_formato(titulo_video[nome[len('capa-'):]])) + '.jpg'
        else:
            arq = limpar(NOMES_IMG[nome]) + '.jpg'
    im.update(pasta=pasta, arquivo=arq, fmt=fmt)
    arquivos.append({'p': im['src'], 'z': pasta + '/' + arq})
    img_por_pasta.setdefault(pasta, []).append(im)

PRINTS = [('1', 'Print 1 - ES em duas telas (TradingView)', 'VWAPs W e 3M, marcas Y e o aviso "Correção contra W/M".'),
          ('2', 'Print 2 - MES com VAH D e Zero Gamma', 'VAH D, VAL D e W, Zero Gamma e as setas do nível respeitado.'),
          ('3', 'Print 3 - Estrutura de Mercado no NinjaTrader', 'POC, VAH e VAL do dia, da semana e do mês.'),
          ('4', 'Print 4 - Alvos, escada de valor e Gamma', 'Alvos D/W, M e 3M, escada de valor e o painel de Gamma.'),
          ('5', 'Print 5 - Alta alinhada D-W-M', 'Varredura, rompimento das VWAPs D e W e o rótulo "Alta alinhada D/W/M".'),
          ('6', 'Print 6 - ES 30 min com o Estado de Mercado', 'Três semanas no 30 minutos: cores do estado, alvos de volume, VWAPs D, W e M, alvos de volatilidade e o painel "Equilíbrio na banda".'),
          ('7', 'Print 7 - ES 1 min com GL Gamma e painel de risco', 'Calls (C+ 26,33K), puts (P+ 28,9K), Zero Gamma, clusters e o painel de risco "Ofensivo forte".'),
          ('8', 'Print 8 - ES perdendo o Zero Gamma', 'VAH D, Zero Gamma, VAL D e VAL NY e a região das puts com absorção.'),
          ('9', 'Print 9 - Expansão de alta acelerada', 'Alvos de volatilidade D, W e M e o painel "Expansão de alta acelerada".'),
          ('10', 'Print 10 - Base, rompimento e alvo com Gamma', 'VAL D com puts e cluster, VAH W, Zero Gamma, VAH D e o alvo W +1%.'),
          ('11', 'Print 11 - Alvo de liquidez atingido', 'O preço no alvo estrutural de volume e o painel "Expansão de alta muito forte".'),
          ('12', 'Print 12 - O mesmo gráfico com o GL Gamma', 'GEX do SPX e do SPY sobre o ES: Zero Gamma, C+ 23,51K no alvo W +1% e P+ 9,42K na base.'),
          ('13', 'Print 13 - Retorno à média com GL Gamma', 'Absorção de 7.804 no topo, P+ 41,96K com o alvo D -0,3% e a absorção de 7.754 embaixo, e o painel de volta ao equilíbrio.')]
for n, nome, _ in PRINTS:
    arquivos.append({'p': f'prints/{n}.png', 'z': f"{P['prints']}/{nome}.png"})

# ---------------------------------------------------------------------------
# Textos
def md_txt(s):
    """Markdown do repositório -> texto para o Bloco de Notas."""
    out = []
    for linha in s.splitlines():
        if linha.startswith('```'):
            continue
        m = re.match(r'^(#{1,4})\s+(.*)', linha)
        if m:
            t = m.group(2).replace('**', '').replace('`', '')
            if len(m.group(1)) == 1:
                out += [t.upper(), '=' * len(t)]
            elif len(m.group(1)) == 2:
                out += [t, '-' * len(t)]
            else:
                out += [t]
            continue
        if linha.startswith('|'):
            cel = [c.strip().replace('**', '').replace('`', '') for c in linha.strip().strip('|').split('|')]
            if all(re.fullmatch(r':?-+:?', c) for c in cel):
                continue
            linha = ' | '.join(cel)
        out.append(linha.replace('**', '').replace('`', ''))
    return '\n'.join(out).strip() + '\n'

def ler(caminho):
    return open(caminho, encoding='utf-8-sig').read()

def legenda_video(v):
    linhas = [v['arquivo'], f"{v['dur']} s · Uso: {v['uso']}"]
    if v['desc']:
        linhas.append('O que mostra: ' + v['desc'])
    if v['leg']:
        linhas += ['Legenda pronta:', v['leg']]
    return '\n'.join(linhas)

def legenda_imagem(im):
    g = grupos_img[im['grupo']]
    leg = im['leg'] or g['leg']
    return im['arquivo'] + ('\nLegenda pronta:\n' + leg if leg else '')

def csv(linhas):
    q = lambda c: '"' + str(c).replace('"', '""') + '"'
    return '\n'.join(';'.join(q(c) for c in l) for l in linhas) + '\n'

n_videos, n_imagens = len(videos), len(imagens)
minutos = round(sum(int(v['dur'] or 0) for v in videos) / 60)

# 00 - Comece aqui
pastas_lista = [
  (P['comece'], 'este guia, o organizador e os relatórios.'),
  (P['estrat'], 'semana de publicação, cuidados e o link do Sistema de Marketing GL.'),
  (V, f'{n_videos} vídeos separados por objetivo, com as legendas em cada pasta.'),
  (I, f'{n_imagens} imagens (carrosséis, posts, frases, stories, capas, thumbnails e site).'),
  (P['codex'], 'os vídeos que o Codex fez, separados dos do Claude.'),
  (P['textos'], 'roteiros para o Giovane gravar, mensagens da call, todas as legendas e o glossário.'),
  (P['equipe'], 'o que vocês já tinham (comerciais, depoimentos, fotos, imagens, vídeos e vinhetas).'),
  (P['leads'], 'contatos de leads. Só quem trabalha com vendas e atendimento deve abrir.'),
  (P['ferr'], 'Higgsfield (plano e prompt para retomar), Aurora e tutoriais.'),
  (P['prints'], 'os prints que geraram os vídeos e a lista dos próximos.'),
  (P['revisar'], 'o que estava solto na pasta e não tinha lugar certo.'),
]
add_texto(f"{P['comece']}/LEIA-ME - Comece aqui.txt", f'''GL ACADEMY · MARKETING ORGANIZADO
Pacote montado pelo Claude em 1º de outubro de 2026.

COMO DEIXAR TUDO ORGANIZADO (uma vez só)
1. Dê dois cliques em "Organizar a pasta de marketing", aqui nesta pasta.
   Se o Windows mostrar "O Windows protegeu o computador", clique em "Mais informações" e depois em "Executar assim mesmo".
2. A janela mostra a prévia: o que vai para onde. Nada muda até você digitar S e apertar Enter.
3. Pronto. Tudo fica em "Marketing de trading" (Área de Trabalho > Arquivos e Programas > GL Academy organização > Trading), e a pasta abre sozinha no fim.

O QUE O ORGANIZADOR FAZ
- Traz as pastas deste pacote para "Marketing de trading", mesmo que o ZIP tenha sido extraído em Downloads.
  Se houver outro pacote extraído dentro da pasta (por exemplo, "GL Academy - Marketing (Claude)"), ele também é organizado,
  inclusive o que vocês colocaram dentro dele. Vale sempre a versão mais nova dos textos.
- Leva o que já estava lá para o lugar certo:
    comerciais, Depoimentos, Depoimentos de assinantes atuais, Fotos para postar (Giovane), imagens para usar,
    Vídeos para usar no Youtube e Vinhetas -> 06 - Materiais da equipe
    GL Academy Trading Fractal Wallpaper -> 06 - Materiais da equipe > Wallpaper e fundos
    LEADS -> 07 - Leads (dados pessoais, acesso restrito)
    Aurora e o tutorial da Higgsfield -> 08 - Ferramentas e tutoriais
    o que não tiver lugar certo -> 99 - Para revisar
- Copia o ZIP de vídeos do Codex (GL_ACADEMY_VIDEOS_RODADA_2026-09-30.zip, da pasta do site novo, em Documentos) para "04 - Feito pelo Codex" e extrai os vídeos lá. O original fica onde está.
- Confere as pastas da equipe: o que é cópia idêntica ou versão anterior de um vídeo do Claude ou do Codex vai para
  "99 - Para revisar"; o que só existe nas pastas de vocês fica onde está.
- Não apaga nada. Se já existir um arquivo com o mesmo nome, o que chega ganha " (2)"; se for idêntico, não é duplicado.
- Deixa nesta pasta quatro relatórios: Inventário, Conferência das pastas da equipe, Arquivos repetidos e o Registro do que foi feito.
- Pode rodar de novo quando quiser: o que já está no lugar não muda.

ANTES DE ORGANIZAR
- Feche vídeos, planilhas e projetos abertos dessas pastas. Se algo estiver aberto, o organizador avisa e segue; depois é só rodar de novo.
- Projetos de edição (Premiere, CapCut, DaVinci) que usam arquivos das pastas antigas vão pedir para localizar a mídia. Aponte para o novo lugar, em "06 - Materiais da equipe".

AS PASTAS
''' + '\n'.join(f'{a}: {b}' for a, b in pastas_lista) + f'''

ONLINE
Biblioteca GL (vídeos, imagens, legendas com botão de copiar e o kit do site): {BIBLIOTECA}
Sistema de Marketing GL (os 6 pilares e o funil): {SISTEMA}

REGRAS PARA PUBLICAR
- Nunca prometer lucro, renda ou aprovação em mesa. Alvos são projeções do modelo, não promessa.
- Replays saem com o selo "Replay · exemplo educacional" (já está nos vídeos). Mantenha.
- Vídeo ou imagem com os níveis de Gamma leva "GL Gamma: assinatura à parte".
- Depoimento só com autorização por escrito e sem valores ganhos (modelo em "05 - Roteiros, legendas e textos").
- Os vídeos não têm som: use música da biblioteca do Instagram, do TikTok ou do YouTube, que já vem licenciada.
''')
add_texto(f"{P['comece']}/Organizar a pasta de marketing.bat",
          '@echo off\ntitle Organizador do marketing - GL Academy\n'
          'powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0organizar-marketing.ps1" %*\necho.\npause\n')
add_texto(f"{P['comece']}/organizar-marketing.ps1", ler(os.path.join(MKT, 'organizacao', 'organizar-marketing.ps1')))
add_texto(f"{P['comece']}/Biblioteca GL (online).url", f'[InternetShortcut]\nURL={BIBLIOTECA}\n')

# 01 - Estratégia
add_texto(f"{P['estrat']}/Sistema de Marketing GL (online).url", f'[InternetShortcut]\nURL={SISTEMA}\n')
add_texto(f"{P['estrat']}/LEIA-ME.txt", f'''ESTRATÉGIA E PLANEJAMENTO
Aqui ficam os planos, calendários e números do marketing.

- "Semana de publicação e cuidados.txt": o que postar em cada dia, com os vídeos e imagens deste pacote.
- "Sistema de Marketing GL (online)": os 6 pilares (Conteúdo, Tráfego pago, Divulgação, Assessoria de imprensa, Relações públicas e Vendas) ligados a um objetivo, e o funil.

Sugestão: guarde aqui o plano 2026/2027, o calendário do mês e os relatórios de anúncios.
''')
add_texto(f"{P['estrat']}/Semana de publicação e cuidados.txt", f'''SEMANA DE PUBLICAÇÃO
Uma rotina simples para publicar todo dia sem gravar tudo do zero. Os nomes entre aspas estão em "{V}".

Segunda: "A favor ou contra" no Reels e, em 4x5, como anúncio de topo no feed.
Terça: uma aula rápida (VWAP ou Value Area). É o conteúdo que mais traz seguidor novo.
Quarta: "Gamma Exposure no gráfico" ou "Preciso entender de opções?".
Quinta: um setup: "Alvos claros", "Nem toda queda é venda" ou "Escada de valor".
Sexta: "As 3 perguntas antes do trade", com chamada para a call.
Sempre ligado: as 4 respostas às objeções em remarketing, para quem visitou o funil e não agendou.
Todo agendamento: a sequência da call no WhatsApp (confirmação, lembrete e, se faltar, remarcar).
Carrosséis e posts: um carrossel por semana e um post anotado entre os vídeos.
Lives: logo de 8 s ou abertura, loop de espera, encerramento e o comercial 16x9 no intervalo.

CUIDADOS
- Os vídeos de replay já trazem o selo "Replay · exemplo educacional". Mantenha.
- Nas legendas, nunca prometa lucro, renda ou aprovação em mesa.
- Nos anúncios, use os ganchos que mais retêm e mude só a legenda para testar.
- Os vídeos não têm som. Coloque música da biblioteca do Instagram, do TikTok ou do YouTube, que já vem licenciada.
- Os loops de 60 s emendam sem corte; no OBS, marque "Repetir" na fonte de mídia.
- Não abra Reels com o logo: o gancho precisa estar no primeiro segundo. Use a vinheta no fim dos Reels e o logo de 8 s na abertura do YouTube e das lives.
- No feed, suba as versões 4x5; o 9x16 perde a legenda no corte do feed.
''')

# 02 - Vídeos
pastas_v_ordem = []
for v in videos:
    if v['pasta'] not in pastas_v_ordem:
        pastas_v_ordem.append(v['pasta'])
pastas_v_ordem.sort()
info_pasta = {V + '/' + a: (obj, como) for a, obj, como in PASTAS_V.values()}
linhas_pastas = []
for pasta in pastas_v_ordem:
    obj, como = info_pasta[pasta]
    linhas_pastas.append(f"{pasta[len(V) + 1:]} ({len(por_pasta[pasta])} vídeos)\n  Objetivo: {obj}. {como}")
add_texto(f'{V}/LEIA-ME.txt', f'''VÍDEOS FEITOS PELO CLAUDE
{n_videos} vídeos ({minutos} minutos) feitos com os prints reais do operacional, sem gastar crédito de IA.
Versões prontas para postar, em MP4. As sobreposições de live são WebM com fundo transparente.

COMO ESTÁ ORGANIZADO
Cada pasta é um objetivo. O nome do arquivo diz o título e o formato: "01 - A favor ou contra (9x16).mp4".
Em cada pasta, "Legendas e usos.txt" diz onde usar cada vídeo e traz a legenda pronta para copiar.
"Catálogo dos vídeos (abre no Excel).csv" lista tudo numa planilha, com objetivo, uso, tema, formato e legenda.
"Índice por tema.txt" junta os vídeos por assunto: VWAP, Value Area, Gamma, NinjaTrader, alvos...

AS PASTAS
''' + '\n\n'.join(linhas_pastas) + '''

FORMATOS
9x16: Reels, Stories, TikTok e Shorts.
4x5: feed do Instagram e do Facebook.
16x9: YouTube, lives, VSL e site.
1x1: círculos do site (recorte redondo).

CUIDADOS
- Mantenha o selo de replay e o aviso de risco que já estão nos vídeos.
- Vídeo com os níveis de Gamma leva "GL Gamma: assinatura à parte" (já está nos que mostram Gamma).
- Não abra Reels com o logo: o gancho precisa estar no primeiro segundo.
- O vídeo "Não sei por onde começar" cita a call de 30 minutos. Se a conversa gratuita passar a ser de 60 minutos, ele precisa ser refeito.
''')
for pasta in pastas_v_ordem:
    obj, como = info_pasta[pasta]
    cab = f"{pasta[len(V) + 1:].upper()}\nObjetivo: {obj}. {como}\n{AVISO}\n\n"
    add_texto(f'{pasta}/Legendas e usos.txt', cab + '\n\n'.join(legenda_video(v) for v in por_pasta[pasta]) + '\n')
add_texto(f'{V}/Catálogo dos vídeos (abre no Excel).csv', csv(
    [['Pasta', 'Arquivo', 'Título', 'Objetivo', 'Uso sugerido', 'Temas', 'Formato', 'Duração (s)', 'O que mostra', 'Legenda pronta', 'Código na Biblioteca']] +
    [[v['pasta'][len(V) + 1:], v['arquivo'], v['titulo'], v['objetivo'], v['uso'], ', '.join(v['temas']), v['fmt'], v['dur'], v['desc'], v['leg'], v['vid']] for v in videos]))
indice = ['ÍNDICE POR TEMA', 'Cada vídeo aparece em todos os temas de que trata. O caminho começa em "' + V + '".', '']
for t, _ in TEMAS:
    vs = [v for v in videos if t in v['temas']]
    if vs:
        indice += [t.upper()] + [f"  {v['pasta'][len(V) + 1:]} / {v['arquivo']}" for v in vs] + ['']
add_texto(f'{V}/Índice por tema.txt', '\n'.join(indice))

# kit do site: onde usar cada peça e o código
mapa = open(os.path.join(LIB, 'site-map.html'), encoding='utf-8').read()
linhas_site = []
for tr in re.findall(r'<tr><td.*?</tr>', mapa, re.S):
    c = [texto(x) for x in re.findall(r'<td[^>]*>(.*?)</td>', tr, re.S)]
    linhas_site.append(f'{c[0]} > {c[1]}: {c[2]} ({c[3]})')
prompt_site = re.search(r'```text\n(.*?)```', ler(os.path.join(MKT, 'site', 'prompt-codex-videos-do-site.md')), re.S).group(1).strip() + '\n'
add_texto(f"{V}/{PASTAS_V['site'][0]}/LEIA-ME - onde usar e código do site.txt", f'''KIT DO SITE
Esta pasta tem os 8 vídeos feitos só para o site (loops, Pacote Completo e GL Gamma), cada um com a capa (JPG) de mesmo nome.
O site também usa outros vídeos da Biblioteca (o filme das tecnologias, as histórias, os reels, as dúvidas e as aulas).
Para o Codex, use o kit completo: Biblioteca de Vídeos GL > Kit do site > "Baixar o kit do site". Ele traz tudo com nomes simples, capas em tamanho cheio e o prompt.
As imagens da galeria e as de compartilhamento estão em "{I}" > "08 - Site".

ONDE VAI CADA VÍDEO
''' + '\n'.join(linhas_site) + '''

Regra de ouro: loop sem som só nas peças curtas e decorativas; o que tem legenda toca no play. Nada carrega antes de aparecer na tela.
O prompt completo para o Codex está em "PROMPT para o Codex.txt", nesta pasta.
''')
add_texto(f"{V}/{PASTAS_V['site'][0]}/PROMPT para o Codex.txt", prompt_site)

# 03 - Imagens
pastas_i_ordem = sorted(img_por_pasta)
add_texto(f'{I}/LEIA-ME.txt', f'''IMAGENS FEITAS PELO CLAUDE
{n_imagens} imagens feitas com os prints reais, sem gastar crédito de IA.

''' + '\n'.join(f"{p[len(I) + 1:]} ({len(img_por_pasta[p])} imagens)" for p in pastas_i_ordem) + '''

COMO USAR
- Carrosséis: suba os slides na ordem (Slide 01, 02...). A legenda está em "Legenda.txt", na pasta de cada carrossel.
- Posts e frases: legenda em "Legendas e usos.txt".
- Stories: os espaços tracejados recebem os stickers do Instagram (link, enquete, lembrete). Poste a enquete num dia e a resposta no outro.
- Capas de Reels: use ao publicar o Reels de mesmo nome; o título fica dentro da área que o perfil mostra.
- Destaques: o Instagram mostra só o círculo central. A ordem sugerida está no número do arquivo.
- Thumbnails: 1280x720. Ficam ainda melhores com uma foto do Giovane: mande uma e o Claude monta as versões com rosto.
- Site: a galeria vai na seção "Veja os sistemas em uso"; as de compartilhamento vão na meta og:image de cada página (veja o LEIA-ME do kit do site, em "02 - Vídeos").
''')
for pasta in pastas_i_ordem:
    ims = img_por_pasta[pasta]
    g = grupos_img[ims[0]['grupo']]
    if '/01 - Carrosséis' in pasta:
        add_texto(f'{pasta}/Legenda.txt', f"{pasta.rsplit('/', 1)[1].upper()} · {len(ims)} slides, nesta ordem\n\nLegenda pronta:\n{g['leg']}\n")
        continue
    cab = f"{pasta[len(I) + 1:].upper()}\n" + (g['desc'] + '\n' if g['desc'] else '') + '\n'
    add_texto(f'{pasta}/Legendas e usos.txt', cab + '\n\n'.join(legenda_imagem(im) for im in ims) + '\n')
add_texto(f'{I}/Catálogo das imagens (abre no Excel).csv', csv(
    [['Pasta', 'Arquivo', 'Peça', 'Formato', 'Legenda pronta ou uso', 'Código na Biblioteca']] +
    [[im['pasta'][len(I) + 1:], im['arquivo'], grupos_img[im['grupo']]['titulo'], im['fmt'],
      im['leg'] or grupos_img[im['grupo']]['leg'] or grupos_img[im['grupo']]['desc'], im['nome']] for im in imagens]))

# 04 - Codex
add_texto(f"{P['codex']}/LEIA-ME - vídeos feitos pelo CODEX.txt", f'''VÍDEOS FEITOS PELO CODEX (não pelo Claude)

Esta pasta guarda os vídeos que o Codex gerou na rodada de 30/09/2026, separados dos vídeos do Claude (que estão em "{V}").

O organizador copia para "Rodada 2026-09-30" o ZIP do Codex, com o nome
  GL_ACADEMY_VIDEOS_RODADA_2026-09-30 (feito pelo Codex).zip
e extrai os vídeos em "Rodada 2026-09-30 > Vídeos extraídos do ZIP".
O original continua em Documentos > Novo site para GL Academy - estilo neuronal obsidian > GL_VIDEOS_RODADA_2026-09-30.

O QUE TEM NO ZIP, SEGUNDO O PRÓPRIO CODEX (34 vídeos MP4)
- 26 vídeos: 13 pares, cada um com e sem legenda, feitos com o motor de vídeo do repositório (o mesmo que o Claude usa).
- 7 peças de estúdio feitas na Higgsfield, incluindo o "antes", o "depois" e a montagem dos dois.
- 1 logo em 1080p, finalizado a partir do rascunho que já existia na Higgsfield.
O Codex avisou que há repetição intencional e que não comparou com os vídeos do Claude. Antes de postar, veja se a peça já existe em "{V}".

CRÉDITOS DA HIGGSFIELD
Entre 02:51 e 02:57 (UTC) de 01/10/2026 foram geradas no projeto "GL Academy · Marketing" 8 imagens e 13 vídeos, e o saldo caiu de 945,5 para 2 créditos. Antes de uma nova rodada, recarregue a conta e confira o que já existe aqui, para não pagar duas vezes pela mesma peça.

ANTES DE PUBLICAR UMA PEÇA DE ESTÚDIO
- Confira se o gráfico na tela é o real: a IA costuma redesenhar números, níveis e candles. Se precisar, o Claude encaixa o print real por cima, sem crédito.
- Veja se tem o aviso de risco e, quando mostra Gamma, "GL Gamma: assinatura à parte".
- Nada de promessa de lucro ou renda.

Se a pasta "Rodada 2026-09-30" estiver vazia, o organizador não achou o ZIP: copie o arquivo para ela e rode o organizador de novo.
''')

# 05 - Textos
whats = [v for v in videos if v['grupo'] == 'vendas-whats']
add_texto(f"{P['textos']}/Mensagens da call no WhatsApp.txt", '''MENSAGENS DA SEQUÊNCIA DA CALL (WhatsApp)
Mande cada vídeo com a mensagem. Os vídeos estão em "''' + V + '/' + PASTAS_V['vendas-whats'][0] + '''".

''' + '\n\n'.join(f"{i}. {v['titulo'].upper()}\nQuando: {v['uso']}\nVídeo: {v['arquivo']}\nMensagem:\n{v['leg']}" for i, v in enumerate(whats, 1)) + '\n')
add_texto(f"{P['textos']}/Roteiros para gravar e depoimentos.txt", md_txt(ler(os.path.join(MKT, 'roteiros-e-depoimentos.md'))))
add_texto(f"{P['textos']}/Glossário de nomes e produtos.txt", md_txt(ler(os.path.join(MKT, 'glossario.md'))))
todas = ['TODAS AS LEGENDAS PRONTAS', AVISO, '', '== VÍDEOS ==', '']
for pasta in pastas_v_ordem:
    com = [v for v in por_pasta[pasta] if v['leg']]
    if com:
        todas += [f"[{pasta[len(V) + 1:]}]", ''] + [f"{v['arquivo']}\n{v['leg']}\n" for v in com]
todas += ['== IMAGENS ==', '']
for pasta in pastas_i_ordem:
    ims = img_por_pasta[pasta]
    g = grupos_img[ims[0]['grupo']]
    if '/01 - Carrosséis' in pasta:
        todas += [f"[{pasta[len(I) + 1:]}]", g['leg'], '']
    elif any(im['leg'] for im in ims):
        todas += [f"[{pasta[len(I) + 1:]}]", ''] + [f"{im['arquivo']}\n{im['leg']}\n" for im in ims if im['leg']]
add_texto(f"{P['textos']}/Legendas de todos os vídeos e imagens.txt", '\n'.join(todas))

# 06, 07, 08, 09, 99
add_texto(f"{P['equipe']}/LEIA-ME.txt", '''MATERIAIS DA EQUIPE
O que já existia em "Marketing de trading" vem para cá, com o mesmo conteúdo: Comerciais, Depoimentos, Depoimentos de assinantes atuais, Fotos para postar (Giovane), Imagens para usar, Vídeos para usar no YouTube, Vinhetas e, em "Wallpaper e fundos", o GL Academy Trading Fractal Wallpaper.

- Depoimentos: use só com autorização por escrito e sem valores ganhos. O pedido e o texto da autorização estão em "05 - Roteiros, legendas e textos".
- Fotos do Giovane: mande uma ao Claude para montar thumbnails do YouTube com rosto.
- Vídeos gravados (Giovane falando, tela do APP): mande o arquivo original (pelo Drive ou por cabo) e o Claude edita com legendas, cortes dos setups e o logo.
''')
add_texto(f"{P['leads']}/LEIA-ME - dados pessoais (LGPD).txt", '''DADOS PESSOAIS · ACESSO RESTRITO
Esta pasta guarda contatos de leads (nome, telefone, e-mail). Pela LGPD:
- Acesso só para quem trabalha com vendas e atendimento.
- Não mande esta pasta por WhatsApp ou e-mail e não suba em link público ou drive compartilhado aberto.
- Não use estes dados em anúncio nem mostre em print.
- Apague o que não for mais necessário e atenda quem pedir para sair da lista.
- Se der, guarde num lugar protegido por senha (por exemplo, o Cofre Pessoal do OneDrive ou um disco com BitLocker).
''')
add_texto(f"{P['ferr']}/Higgsfield - plano da rodada premium.txt", md_txt(ler(os.path.join(MKT, 'videos', 'higgsfield-rodada-premium.md'))))
add_texto(f"{P['ferr']}/Higgsfield - prompt para retomar.txt", md_txt(ler(os.path.join(MKT, 'videos', 'PROMPT-retomar-higgsfield.md'))))
add_texto(f"{P['prints']}/Lista de prints para a próxima rodada.txt", '''PRINTS DO OPERACIONAL
Os prints desta pasta geraram todos os vídeos e imagens do Claude. No motor de vídeo eles se chamam 1.png a 13.png, na mesma ordem.

''' + '\n'.join(f'{nome}: {desc}' for _, nome, desc in PRINTS) + '''

PRÓXIMA RODADA: O QUE TIRAR, POR PRIORIDADE
Cada print bom vira pelo menos 2 vídeos sem gastar crédito: um com legenda e um coringa limpo.
1. O mesmo setup em 3 momentos: antes da entrada, na entrada e no alvo, com o mesmo zoom. Vira um "antes e depois" 100% real.
2. O mesmo gráfico com e sem o GL Model, mesmo horário e zoom. Vira "gráfico comum x GL Model".
3. Um print por tecnologia: Multi Fractal, Order Flow, GL Risk Auto travando a plataforma e o APP. Hoje só temos GL Model e GL Gamma.
4. Gamma e liquidez em tela cheia: Zero Gamma, Call Wall, Put Wall, HVL e o mapa de liquidez.
5. Rótulos de contexto de perto, em dias diferentes: "Alta alinhada D/W/M", "Correção contra W/M".
6. Outros mercados: ES, NQ, MES, MNQ e o que mais vocês operarem.
7. Fotos: o Giovane na mesa de operação, o setup de monitores e o GamePad na mão.

COMO TIRAR
- Captura de tela em PNG, não foto do monitor com o celular.
- Tela cheia, sem abas do navegador e sem dados pessoais (conta, saldo, nome).
- Tema escuro e zoom do gráfico um pouco maior que o normal, para os rótulos dos níveis ficarem legíveis.
- Melhor ainda: grave a tela do replay por 1 a 3 minutos. O movimento real vira vários setups, quadro a quadro.
''')
add_texto(f"{P['revisar']}/LEIA-ME.txt", '''PARA REVISAR
O organizador coloca aqui o que estava solto em "Marketing de trading" e não tinha um lugar definido.
Veja cada item e leve para a pasta certa, ou apague o que não serve mais.
''')

# ---------------------------------------------------------------------------
# Execução: calendário de outubro, teste de anúncios, placar semanal, parceiros e os textos da fase
por_vid = {v['vid']: v for v in videos}
por_img = {im['nome']: im for im in imagens}
capas_reels = {im['nome'][len('capa-'):]: im for im in imagens if im['grupo'] == 'img-capas-reels'}

def onde_video(cod):
    v = por_vid[cod]
    return (v['pasta'] + '/' + v['arquivo']).replace('/', ' > ')

def onde_img(cod):
    im = por_img[cod]
    return (im['pasta'] + '/' + im['arquivo']).replace('/', ' > ')

SEMANAS = {2: 'Semana 2 · Contexto: a favor ou contra', 3: 'Semana 3 · Valor e níveis',
           4: 'Semana 4 · Plataformas e GL Gamma', 5: 'Semana 5 · Alvos e processo'}
DIAS = ['seg', 'ter', 'qua', 'qui', 'sex', 'sáb', 'dom']
REELS = 'Instagram Reels, TikTok e YouTube Shorts'
# (data, semana, tipo, código da peça, objetivo, observação)
CALENDARIO = [
  ('05/10', 2, 'reels', 'v01-a-favor-ou-contra', 'Alcance e call', ''),
  ('05/10', 2, 'story', 'story-call', 'Call', 'Sticker de link para o agendamento'),
  ('06/10', 2, 'reels', 'aula-vwap', 'Seguidores', ''),
  ('07/10', 2, 'reels', 'v04-gamma-exposure', 'GL Gamma', ''),
  ('07/10', 2, 'story', 'story-enquete', 'Engajamento', 'Sticker de enquete'),
  ('08/10', 2, 'post', 'post-correcao-contra', 'Autoridade', ''),
  ('08/10', 2, 'story', 'story-enquete-resposta', 'Engajamento', 'A resposta da enquete de ontem'),
  ('09/10', 2, 'reels', 'v07-tres-perguntas', 'Call', ''),
  ('09/10', 2, 'story', 'story-call', 'Call', 'Sticker de link'),
  ('10/10', 2, 'carrossel', 'img-carrossel-3-perguntas', 'Salvamentos', 'Também no LinkedIn, como documento'),
  ('11/10', 2, 'frase', 'frase-contexto-primeiro', 'Respiro', ''),
  ('11/10', 2, 'story', 'story-comunidade', 'Comunidade', 'Sticker de link para a comunidade'),
  ('12/10', 3, 'reels', 'v02-setup-acontecendo', 'Alcance e call', 'Feriado nacional'),
  ('13/10', 3, 'reels', 'aula-value-area', 'Seguidores', ''),
  ('14/10', 3, 'carrossel', 'img-carrossel-gl-gamma', 'GL Gamma', 'Também no LinkedIn, como documento'),
  ('15/10', 3, 'reels', 'v11-escada-de-valor', 'Autoridade', ''),
  ('16/10', 3, 'reels', 'v09-defesa-na-vwap-3m', 'Call', ''),
  ('16/10', 3, 'story', 'story-call', 'Call', 'Sticker de link'),
  ('17/10', 3, 'post', 'post-nivel-respeitado', 'Autoridade', ''),
  ('18/10', 3, 'frase', 'frase-o-mercado-nao-deve', 'Respiro', ''),
  ('19/10', 4, 'reels', 'v06-ninjatrader', 'Alcance', ''),
  ('20/10', 4, 'carrossel', 'img-carrossel-value-area', 'Salvamentos', 'Também no LinkedIn, como documento'),
  ('21/10', 4, 'reels', 'objecao-opcoes', 'GL Gamma', ''),
  ('22/10', 4, 'reels', 'v10-queda-no-ninjatrader', 'Autoridade', ''),
  ('23/10', 4, 'reels', 'objecao-plataforma', 'Call', ''),
  ('23/10', 4, 'story', 'story-call', 'Call', 'Sticker de link'),
  ('24/10', 4, 'post', 'post-tradingview-e-ninjatrader', 'Autoridade', ''),
  ('25/10', 4, 'frase', 'frase-risco-antes-do-clique', 'Respiro', ''),
  ('26/10', 5, 'reels', 'v03-alvos-claros', 'Alcance e call', ''),
  ('27/10', 5, 'carrossel', 'img-carrossel-nem-toda-queda', 'Salvamentos', 'Também no LinkedIn, como documento'),
  ('28/10', 5, 'reels', 'v05-nivel-respeitado', 'Autoridade', ''),
  ('29/10', 5, 'reels', 'objecao-mais-um-indicador', 'Call', ''),
  ('29/10', 5, 'story', 'story-live-hoje', 'Live', 'Live "Replay com Giovane", com o kit de live'),
  ('30/10', 5, 'reels', 'comercial-tecnologias-gl-9x16', 'Call', ''),
  ('30/10', 5, 'story', 'story-call', 'Call', 'Sticker de link'),
  ('31/10', 5, 'post', 'post-alvo-antes-do-preco', 'Autoridade', ''),
  ('01/11', 5, 'frase', 'frase-tres-perguntas', 'Respiro', ''),
]
import datetime
cal = [['Data', 'Dia', 'Semana e tema', 'Canal', 'Formato', 'Peça (na pasta organizada)', 'Capa', 'Legenda pronta', 'Objetivo', 'Observação']]
for data, sem, tipo, cod, obj, obs in CALENDARIO:
    d = datetime.date(2026, int(data[3:]), int(data[:2]))
    dia = DIAS[d.weekday()]
    if tipo == 'reels':
        v = por_vid[cod]
        capa = onde_img(capas_reels[cod]['nome']) if cod in capas_reels else 'Escolher um quadro no app'
        cal.append([data, dia, SEMANAS[sem], REELS, 'Vídeo 9x16', onde_video(cod), capa, v['leg'], obj, obs])
    elif tipo == 'carrossel':
        g = grupos_img[cod]
        pasta = [im['pasta'] for im in imagens if im['grupo'] == cod][0]
        cal.append([data, dia, SEMANAS[sem], 'Instagram feed', 'Carrossel 4x5', pasta.replace('/', ' > ') + ' (todos os slides, na ordem)', '', g['leg'], obj, obs])
    elif tipo == 'post':
        im = por_img[cod]
        cal.append([data, dia, SEMANAS[sem], 'Instagram feed', 'Post 4x5', onde_img(cod), '', im['leg'], obj, obs])
    elif tipo == 'frase':
        cal.append([data, dia, SEMANAS[sem], 'Instagram feed', 'Frase 1x1', onde_img(cod), '', 'Salve para lembrar. ' + AVISO, obj, obs])
    else:
        cal.append([data, dia, SEMANAS[sem], 'Instagram stories', 'Story 9x16', onde_img(cod), '', '', obj, obs])
csv_calendario = csv(cal)

FUNIL = '[link do funil]?utm_source=meta&utm_medium=pago&utm_campaign={{campaign.name}}&utm_term={{adset.name}}&utm_content={{ad.name}}'
# (campanha, conjunto, nome do anúncio, peça 9x16, peça 4x5 ou '', título, descrição)
ANUNCIOS = [
  ('q4-2026_captacao-call_advantage', 'amplo-interesses_br_25-54', 'setup_reel-feed_varredura_v1', 'v02-setup-acontecendo', 'v02-setup-acontecendo-4x5', 'Veja o setup acontecendo', 'Call 1x1 gratuita'),
  ('q4-2026_captacao-call_advantage', 'amplo-interesses_br_25-54', 'contexto_reel-feed_a-favor-ou-contra_v1', 'v01-a-favor-ou-contra', 'v01-a-favor-ou-contra-4x5', 'A favor ou contra você?', 'Call 1x1 gratuita'),
  ('q4-2026_captacao-call_advantage', 'amplo-interesses_br_25-54', 'alvos_reel-feed_alvos-claros_v1', 'v03-alvos-claros', 'v03-alvos-claros-4x5', 'O alvo antes do preço', 'Call 1x1 gratuita'),
  ('q4-2026_captacao-call_advantage', 'amplo-interesses_br_25-54', 'contexto_reel_pare-de-operar-contra_v1', 'v01b-gancho-pare-de-operar-contra', '', 'Pare de operar contra', 'Call 1x1 gratuita'),
  ('q4-2026_captacao-call_advantage', 'amplo-interesses_br_25-54', 'processo_reel_se-nao-responde-nao-entre_v1', 'v07b-gancho-nao-entre', '', 'As 3 perguntas antes do trade', 'Call 1x1 gratuita'),
  ('q4-2026_remarketing_call', 'video50-engajou180-visitou-funil', 'objecao_reel_plataforma_v1', 'objecao-plataforma', '', 'TradingView ou NinjaTrader', 'Call 1x1 gratuita'),
  ('q4-2026_remarketing_call', 'video50-engajou180-visitou-funil', 'objecao_reel_mais-um-indicador_v1', 'objecao-mais-um-indicador', '', 'Não é mais um indicador', 'Call 1x1 gratuita'),
  ('q4-2026_remarketing_call', 'video50-engajou180-visitou-funil', 'objecao_reel_opcoes_v1', 'objecao-opcoes', '', 'GL Gamma sem operar opções', 'GL Gamma: assinatura à parte'),
  ('q4-2026_distribuicao_video', 'amplo-interesses_br_25-54', 'aula_reel_vwap_v1', 'aula-vwap', '', 'O que é VWAP', 'Aula de 15 segundos'),
  ('q4-2026_distribuicao_video', 'amplo-interesses_br_25-54', 'aula_reel_value-area_v1', 'aula-value-area', '', 'O que é Value Area', 'Aula de 15 segundos'),
]
an = [['Campanha', 'Conjunto', 'Anúncio', 'Vídeo 9x16 (Reels e Stories)', 'Vídeo 4x5 (feed)', 'Texto principal', 'Título', 'Descrição', 'Botão', 'URL de destino']]
for camp, conj, nome, v916, v45, tit, desc in ANUNCIOS:
    # os ganchos não têm legenda própria: usam a do vídeo original
    texto = por_vid[v916]['leg'] or {'v01b': por_vid['v01-a-favor-ou-contra']['leg'], 'v07b': por_vid['v07-tres-perguntas']['leg']}[v916[:4]]
    an.append([camp, conj, nome, onde_video(v916), onde_video(v45) if v45 else 'Usar o 9x16 em todos os posicionamentos',
               texto, tit, desc, 'Saiba mais', FUNIL])
csv_anuncios = csv(an)

FASES = [(1, 2, 'Fundação'), (3, 6, 'Tração'), (7, 10, 'Escala'), (11, 13, 'Colheita e revisão')]
PILARES = ['Conteúdo', 'Tráfego pago', 'Divulgação', 'Imprensa', 'Relações públicas', 'Vendas']
pl = [['Semana', 'Início', 'Fim', 'Fase', 'Pilar', 'Leads', 'Calls agendadas', 'Calls realizadas', 'Vendas', 'Receita (R$)', 'Custo (R$)', 'Observações']]
inicio = datetime.date(2026, 9, 28)
for n in range(1, 14):
    a = inicio + datetime.timedelta(days=7 * (n - 1))
    b = min(a + datetime.timedelta(days=6), datetime.date(2026, 12, 31))
    fase = [f for i, j, f in FASES if i <= n <= j][0]
    for pil in PILARES:
        pl.append([n, a.strftime('%d/%m'), b.strftime('%d/%m'), fase, pil, '', '', '', '', '', '', ''])
csv_placar = csv(pl)
csv_parceiros = csv([['Nome', '@', 'Plataforma', 'Perfil (fluxo e volume, mesa proprietária, setup e games, aluno)', 'Seguidores', 'Passou no filtro (S/N)',
                      'Status (listado, abordado, respondeu, em teste, ativo, pausado)', 'Data da abordagem', 'Código', 'Link com UTM', 'Leads', 'Calls', 'Vendas', 'Observações']])

E = P['estrat']
add_texto(f'{E}/Calendário de outubro (abre no Excel).csv', csv_calendario)
add_texto(f'{E}/Teste de anúncios (abre no Excel).csv', csv_anuncios)
add_texto(f'{E}/Placar semanal (abre no Excel).csv', csv_placar)
add_texto(f"{P['textos']}/Parceiros (abre no Excel).csv", csv_parceiros)
EXEC = os.path.join(MKT, 'execucao')
for arq, titulo in [('kit-de-imprensa.md', 'Kit de imprensa e preparo do porta-voz'), ('manual-de-crise.md', 'Manual de crise'),
                    ('programa-de-parceiros.md', 'Programa de parceiros'), ('vendas-follow-up.md', 'Vendas - follow-up com vídeo e checklist da call')]:
    add_texto(f"{P['textos']}/{titulo}.txt", md_txt(ler(os.path.join(EXEC, arq))))
for extra in ['plano-de-marketing.md', 'PROMPT-continuidade.md']:
    caminho = os.path.join(MKT, extra)
    if os.path.exists(caminho):
        nome = 'Plano de marketing GL Academy (para o GL OS).md' if extra.startswith('plano') else 'Prompt de continuidade (Claude).txt'
        add_texto(f'{E}/{nome}', ler(caminho) if nome.endswith('.md') else md_txt(ler(caminho)))
# cópia das planilhas no repositório, para as próximas sessões
if os.path.isdir(EXEC):
    for nome, conteudo in [('calendario-outubro.csv', csv_calendario), ('teste-de-anuncios.csv', csv_anuncios), ('placar-semanal.csv', csv_placar), ('parceiros.csv', csv_parceiros)]:
        open(os.path.join(EXEC, nome), 'w', encoding='utf-8-sig', newline='').write(conteudo.replace('\n', '\r\n'))

# ---------------------------------------------------------------------------
# Formato final dos textos para o Windows: CRLF; BOM nos textos com acento (o .bat e o .url ficam em ASCII puro)
def para_windows(caminho, t):
    t = t.replace('\r\n', '\n').replace('\n', '\r\n')
    if caminho.endswith(('.bat', '.url')):
        t.encode('ascii')
        return t
    return '\ufeff' + t

lista_textos = [{'z': z, 't': para_windows(z, t)} for z, t in sorted(textos.items())]
tam = {a['p']: os.path.getsize(os.path.join(LIB, a['p'])) for a in arquivos}
total = sum(tam.values())

# Conferências: nada repetido, nomes válidos, caminhos curtos o bastante para o Windows
todos = [a['z'] for a in arquivos] + [t['z'] for t in lista_textos]
assert len(todos) == len(set(x.lower() for x in todos)), 'caminho repetido no pacote'
for z in todos:
    for parte in z.split('/'):
        assert parte == parte.strip() and not parte.endswith('.') and not re.search(r'[<>:"|?*\\]', parte), z
    # o 00 fica em ASCII: o organizador roda de lá antes de corrigir qualquer nome
    if z.startswith(P['comece']):
        z.encode('ascii')
maior = max(todos, key=len)
assert len(BASE_WIN) + len(maior) <= 240, (len(BASE_WIN) + len(maior), maior)

# ---------------------------------------------------------------------------
# Seção da página: árvore das pastas, passo a passo e os dois botões
def mb(n):
    return f'{n / 1e6:.0f} MB'
arvore = ['Marketing de trading']
for i, (pasta, desc) in enumerate(pastas_lista):
    ult = i == len(pastas_lista) - 1
    arvore.append(('└─ ' if ult else '├─ ') + pasta)
    subs = []
    if pasta == V:
        subs = [p[len(V) + 1:] for p in pastas_v_ordem]
        tops = []
        for s in subs:
            topo = s.split('/')[0]
            n = sum(len(por_pasta[V + '/' + x]) for x in subs if x.split('/')[0] == topo)
            if (topo, n) not in tops:
                tops.append((topo, n))
        subs = [f'{t} · {n}' for t, n in tops]
    elif pasta == I:
        tops = []
        for p in pastas_i_ordem:
            topo = p[len(I) + 1:].split('/')[0]
            n = sum(len(img_por_pasta[x]) for x in pastas_i_ordem if x[len(I) + 1:].split('/')[0] == topo)
            if (topo, n) not in tops:
                tops.append((topo, n))
        subs = [f'{t} · {n}' for t, n in tops]
    elif pasta == P['codex']:
        subs = ['Rodada 2026-09-30 · o ZIP do Codex e os vídeos extraídos']
    for j, s in enumerate(subs):
        arvore.append(('   ' if ult else '│  ') + ('└─ ' if j == len(subs) - 1 else '├─ ') + s)

passos = f'''<ol class="steps">
          <li><b>Baixe o ZIP</b> no botão dourado e confirme ({mb(total)}).</li>
          <li><b>Extraia:</b> no Windows, botão direito no arquivo &gt; <i>Extrair tudo</i> &gt; <i>Extrair</i>. Pode deixar na pasta Downloads.</li>
          <li><b>Abra "00 - Comece aqui"</b> e dê dois cliques em <i>Organizar a pasta de marketing</i>. Se o Windows avisar que protegeu o computador: <i>Mais informações</i> &gt; <i>Executar assim mesmo</i>.</li>
          <li><b>Confira a prévia</b>: a janela mostra o que vai para onde. Nada muda até você digitar <b>S</b> e apertar Enter.</li>
          <li><b>Pronto:</b> tudo fica em "Marketing de trading". As pastas que já existiam vão para "06 - Materiais da equipe" e "07 - Leads", e o ZIP do Codex é copiado para "04 - Feito pelo Codex" e extraído lá. A pasta abre sozinha no fim.</li>
        </ol>
        <p class="desc"><b>Já extraiu o pacote antes, dentro de "Marketing de trading"?</b> Baixe só o ZIP leve, extraia na pasta Downloads e rode o organizador de lá. Ele confere arquivo por arquivo as pastas que vocês colocaram junto: o que já existe nas pastas 02 a 04 vai para "99 - Para revisar", o que é só de vocês fica em "06 - Materiais da equipe", e a lista sai em "00 - Comece aqui".</p>'''
secao = f'''
  <section id="organizado">
    <div class="section-head"><h2>Levar tudo para o computador</h2><p>Um ZIP com os {n_videos} vídeos e as {n_imagens} imagens, separados por objetivo e função, com nomes legíveis e as legendas em cada pasta. Junto vem o organizador da pasta "Marketing de trading": ele arruma o que já existe lá e guarda os vídeos do Codex numa pasta só deles, sem apagar nada.</p></div>
    <div class="dl-bar"><button type="button" class="btn btn-gold" data-org="tudo">Baixar tudo organizado (ZIP, {mb(total)})</button><button type="button" class="btn" data-org="leve">Organizador atualizado e textos (ZIP leve)</button><span class="dl-status" role="status" aria-live="polite">Funciona no Windows 10 e 11.</span></div>
    <div class="two">
      <div class="panel"><h3>Como fica a pasta</h3><pre class="tree">{html.escape(chr(10).join(arvore))}</pre></div>
      <div class="panel">
        <h3>Passo a passo no Windows</h3>
        {passos}
        <p class="desc">Nada é apagado: se já existir um arquivo com o mesmo nome, o que chega ganha " (2)". No fim, "00 - Comece aqui" guarda o inventário, a lista de arquivos repetidos e o registro do que foi feito. Projetos de edição que usavam as pastas antigas vão pedir para localizar a mídia no novo lugar.</p>
      </div>
    </div>
    <script type="application/json" id="organizacao">{json.dumps({'nome': NOME_ZIP, 'nomeLeve': NOME_ZIP_LEVE, 'arquivos': arquivos, 'textos': lista_textos}, ensure_ascii=False).replace('</', '<' + chr(92) + '/')}</script>
  </section>
'''
idx = os.path.join(LIB, 'index.html')
pagina = open(idx, encoding='utf-8').read()
assert pagina.count('<!--ORGANIZACAO-->') == 1, 'falta o marcador <!--ORGANIZACAO--> no template'
open(idx, 'w', encoding='utf-8').write(pagina.replace('<!--ORGANIZACAO-->', secao))
print(f'pacote organizado: {len(arquivos)} arquivos ({mb(total)}) e {len(lista_textos)} textos; maior caminho no Windows: {len(BASE_WIN) + len(maior)} caracteres')
