# Página Campanha GL Black: filmes, imagens, fotos de estúdio com as telas reais e os planos compostos,
# com legenda pronta, calendário, regras de postagem e download de cada arquivo.
# Uso: python3 kit_glblack.py <pasta de trabalho> <pasta da página>
#   a pasta de trabalho tem filmes/, imagens/, comp/ (planos compostos) e teste/f_img*.png (fotos)
import html, json, os, subprocess, sys, glob, re, datetime

FF = os.environ.get('FFMPEG', '/usr/local/lib/python3.11/dist-packages/imageio_ffmpeg/binaries/ffmpeg-linux-x86_64-v7.0.2')
TRAB, PAG = sys.argv[1], sys.argv[2]
esc = html.escape

AVISO = ('Conteúdo educacional; não é recomendação de investimento. Trading envolve risco financeiro real e resultado passado '
         'não garante resultado futuro. Aprovação em mesa proprietária depende de você e das regras de cada mesa.')
GAMMA = 'GL Gamma: assinatura à parte.'
NOTA = 'Ambiente ilustrativo criado com IA · telas reais da plataforma GL'

# filmes: id → (formato, título, uso, legenda sem o aviso, tem Gamma)
FILMES = [
    ('bo01-lancamento', '9:16', 'Lançamento', 'Reels/Shorts do lançamento e anúncio principal',
     'Chegou o GL Black Order Flow System.\n\nFootprint, heatmap e fluxo no mesmo gráfico. O risco do plano na tela antes da ordem com o GL Risk Auto. Pré-market com níveis de Gamma. E a mentoria acontecendo dentro da plataforma, no Training Lab.\n\nQuer ver por dentro? Agende sua call 1x1 gratuita pelo link na bio.', True),
    ('bo06-modulos', '9:16', 'Teaser: os módulos', 'Teaser antes do lançamento',
     'Terminal de Mercado. Análise Gráfica. Order Flow e Execução. GL Gamma Black. Training Lab. Backtest e Quant Lab.\n\nTudo que o trader de fluxo usa, num só lugar. Segunda-feira a gente mostra por dentro.', True),
    ('bo03-risk-auto', '9:16', 'GL Risk Auto', 'Reels: disciplina e risco',
     'O limite do plano aparece antes da ordem.\n\nStop, alvo e risco do dia definidos no plano. Fora do plano, a plataforma avisa. Disciplina no sistema, não só na cabeça.\n\nAgende sua call 1x1 gratuita pelo link na bio.', False),
    ('bo04-pre-market', '9:16', 'Pré-market com Gamma', 'Reels: GL Gamma Black',
     'O pré-market começa antes do pregão.\n\nSigma Board com níveis de Gamma e exposição, Terminal de Mercado com notícias e agenda. Você chega ao pregão com um mapa.\n\nAgende sua call 1x1 gratuita pelo link na bio.', True),
    ('bo02-training-lab', '9:16', 'Training Lab', 'Reels: mentoria dentro da plataforma',
     'A mentoria agora acontece dentro da plataforma.\n\nNo Training Lab você estuda no mesmo ambiente em que opera: mentor e aluno olhando o mesmo gráfico, com a mesma leitura.\n\nAgende sua call 1x1 gratuita e veja como funciona.', False),
    ('bo05-rotina', '9:16', 'Um dia com o GL Black', 'Reels: rotina',
     'Rotina vem antes de resultado.\n\nPré-market, leitura, execução dentro do risco e revisão no Training Lab: um dia com o GL Black.\n\nAgende sua call 1x1 gratuita pelo link na bio.', True),
    ('bo10-filme-lancamento', '16:9', 'Filme de lançamento', 'YouTube, site e apresentação na call',
     'GL Black Order Flow System: a plataforma completa por dentro\n\nTerminal de Mercado, Análise Gráfica, Order Flow e Execução, GL Risk Auto, GL Gamma Black (pré-market e níveis de Gamma), Backtest e Quant Lab e Training Lab, a mentoria dentro da plataforma.\n\nAgende sua call 1x1 gratuita pelo link abaixo.\n\nAmbiente ilustrativo criado com IA; telas reais da plataforma.', True),
    ('bo11-site-hero', '16:9', 'Loop do topo do site', 'Topo do site, sem som e sem texto (o aviso de IA vai abaixo do vídeo)', '', False),
    ('bo14-site-hero-21x9', '21:9', 'Topo do site em 21:9', 'Faixa larga do topo em telas grandes, sem texto', '', False),
    ('bo12-anuncio-30', '16:9', 'Anúncio de 30 s', 'YouTube in-stream',
     'Fluxo, risco e Gamma na mesma tela. Agende a call e veja a plataforma por dentro.', True),
    ('bo13-training-lab', '16:9', 'Training Lab', 'YouTube e página do Training Lab',
     'Training Lab: a mentoria agora acontece dentro da plataforma. Você estuda no mesmo ambiente em que opera. Agende sua call 1x1 gratuita pelo link abaixo.', False),
    ('bo20-feed-lancamento', '4:5', 'Lançamento no feed', 'Feed e anúncio 4:5',
     'Uma plataforma completa de order flow: Análise Gráfica, Order Flow e Execução e o GL Risk Auto com o risco do plano na tela.\n\nConheça na call 1x1 gratuita, link na bio.', False),
    ('bo21-feed-gamma', '4:5', 'Pré-market no feed', 'Feed: GL Gamma Black',
     'O pré-market começa antes do pregão: níveis de Gamma, exposição, notícias e agenda no mesmo lugar.\n\nLink na bio para a call 1x1 gratuita.', True),
    ('bo22-feed-training', '4:5', 'Training Lab no feed', 'Feed: Training Lab',
     'A mentoria dentro da plataforma: estudo guiado no mesmo ambiente em que você opera.\n\nLink na bio para a call 1x1 gratuita.', False),
    ('bo30-quadrado', '1:1', 'Quadrado', 'Feed quadrado, WhatsApp e LinkedIn',
     'GL Black Order Flow System: fluxo, risco e Gamma na mesma tela. Fale com a gente para agendar sua call 1x1 gratuita.', True),
]

CAL = [  # data, canal, peça (id de filme ou de grupo de imagens), objetivo
    ('2026-10-30', 'Reels + Shorts', 'bo06-modulos', 'Teaser: "vem aí"'),
    ('2026-10-31', 'Stories', 'st-01-lancamento', 'Enquete: "Qual módulo você quer ver primeiro?"'),
    ('2026-11-01', 'Feed', 'carrossel', 'Explicar o sistema inteiro'),
    ('2026-11-02', 'Reels + Shorts', 'bo01-lancamento', 'Lançamento'),
    ('2026-11-02', 'YouTube', 'bo10-filme-lancamento', 'Vídeo completo (thumb th-01)'),
    ('2026-11-02', 'Site', 'bo11-site-hero', 'Topo novo do site'),
    ('2026-11-03', 'Reels', 'bo03-risk-auto', 'Dor: disciplina e risco'),
    ('2026-11-04', 'Feed', 'bo21-feed-gamma', 'Pré-market'),
    ('2026-11-05', 'Reels', 'bo04-pre-market', 'Pré-market com Gamma'),
    ('2026-11-06', 'Reels + YouTube', 'bo02-training-lab', 'Mentoria dentro da plataforma (YouTube: bo13, thumb th-02)'),
    ('2026-11-07', 'Stories', 'stories', 'Revisão da semana + CTA'),
    ('2026-11-09', 'Reels', 'bo05-rotina', 'Rotina antes de resultado'),
    ('2026-11-10', 'Feed', 'bo20-feed-lancamento', 'Retomar o lançamento'),
    ('2026-11-11', 'Feed', 'bo22-feed-training', 'Training Lab'),
    ('2026-11-12', 'LinkedIn + WhatsApp', 'bo30-quadrado', 'Rede profissional e lista'),
    ('2026-11-13', 'Reels', 'bo01-lancamento', 'Repostar com outro gancho na legenda'),
    ('2026-11-14', 'Stories', 'st-05-call', 'Caixa de perguntas para a call'),
]
DIAS = ['seg', 'ter', 'qua', 'qui', 'sex', 'sáb', 'dom']

# fotos de estúdio: arquivo → descrição curta (o módulo que a tela mostra)
FOTOS = {
    'f_img01': 'Trader de costas · gráfico de 5 min com a barra de módulos', 'f_img02': 'Monitor vertical · footprint',
    'f_img03': 'Central com três telas · Gamma, gráfico e heatmap', 'f_img04': 'Pré-market ao amanhecer · GL Gamma',
    'f_img05': 'Sobre o ombro · heatmap com o GL Risk Auto', 'f_img06': 'Mentor e aluno · Training Lab',
    'f_img07': 'Duas telas empilhadas · Gamma e gráfico', 'f_img08': 'Sala com painel na parede',
    'f_img09': 'Notebook de cima · níveis de Gamma', 'f_img10': 'Monitor de produto · gráfico com a barra de módulos',
    'f_img11': 'Mesa simétrica · heatmap', 'f_img12': 'Trader calmo de braços cruzados', 'f_img13': 'Sobre o ombro · heatmap',
    'f_img14': 'Mão no mouse · heatmap com o GL Risk Auto', 'f_img15': 'Amanhecer na cidade · Sigma Board',
    'f_img16': 'Duas telas · gráfico e Gamma', 'f_img17': 'Trader de costas · heatmap', 'f_img18': 'Monitor vertical · footprint',
    'f_img19': 'Estação de pesquisa · gráfico e footprint', 'f_img20': 'Produto em ângulo', 'f_img21': 'Notebook de mentoria online',
    'f_img22': 'Escritório claro de dia', 'f_img23': 'Sala de estudo com três mesas', 'f_img24': 'Mesa com halo roxo · níveis de Gamma',
    'f_img25': 'Plano no caderno', 'f_img26': 'Fim de tarde na janela · Sigma Board', 'f_img27': 'Monitor curvo com chuva',
    'f_img28': 'Mãos no teclado', 'f_img29': 'Notebook em casa · Gamma', 'f_img30': 'Monitor vertical · footprint',
    'f_img31': 'Fim do dia · Sigma Board', 'f_img32': 'Vertical e horizontal · footprint e gráfico', 'f_img33': 'Turma com painel · Training Lab',
    'f_img34': 'Sobre o ombro · heatmap', 'f_img35': 'Amanhecer · Sigma Board', 'f_img36': 'Mesa vista de cima',
    'f_img37': 'Mentor e aluno vertical · Training Lab', 'f_img38': 'Turma vertical · Training Lab', 'f_img39': 'Sobre o ombro vertical · heatmap',
    'f_img40': 'Trader vertical · Gamma'}


def ff(*a):
    subprocess.run([FF, '-y', '-loglevel', 'error', *a], check=True)


def novo(src, dst):
    return not os.path.exists(dst) or os.path.getmtime(dst) < os.path.getmtime(src)


def dur(p):
    r = subprocess.run([FF, '-i', p], capture_output=True, text=True).stderr
    m = re.search(r'Duration: (\d+):(\d+):([\d.]+)', r)
    return int(m[1]) * 3600 + int(m[2]) * 60 + float(m[3]) if m else 0


def preparar():
    """Versões para a página: filmes em 1080p que cabem no limite de arquivo, planos em 720p, fotos em JPG."""
    for d in ['filmes', 'capas', 'planos', 'imagens', 'fotos']: os.makedirs(os.path.join(PAG, d), exist_ok=True)
    for fid, *_ in FILMES:
        src = os.path.join(TRAB, 'filmes', fid + '.mp4'); dst = os.path.join(PAG, 'filmes', fid + '.mp4')
        if not os.path.exists(src): continue
        if novo(src, dst):
            crf = 22
            while True:
                ff('-i', src, '-c:v', 'libx264', '-crf', str(crf), '-preset', 'slow', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', '-an', dst)
                if os.path.getsize(dst) < 14.5e6 or crf >= 32: break
                crf += 2
        cp = os.path.join(PAG, 'capas', fid + '.jpg')
        if novo(src, cp): ff('-ss', '2.2', '-i', src, '-frames:v', '1', '-q:v', '4', '-vf', 'scale=-2:720', cp)
    for src in sorted(glob.glob(os.path.join(TRAB, 'comp', 'c*.mp4'))):
        n = os.path.basename(src)[:-4]; dst = os.path.join(PAG, 'planos', n + '.mp4')
        if novo(src, dst):
            ff('-i', src, '-vf', "scale='if(gt(iw,ih),-2,720)':'if(gt(iw,ih),720,-2)'", '-c:v', 'libx264', '-crf', '27', '-preset', 'slow',
               '-pix_fmt', 'yuv420p', '-movflags', '+faststart', '-an', dst)
        cp = os.path.join(PAG, 'capas', n + '.jpg')
        if novo(src, cp): ff('-ss', '3', '-i', src, '-frames:v', '1', '-q:v', '5', '-vf', 'scale=-2:360', cp)
    for src in sorted(glob.glob(os.path.join(TRAB, 'imagens', '*.jpg'))):
        dst = os.path.join(PAG, 'imagens', os.path.basename(src))
        if novo(src, dst): subprocess.run(['cp', src, dst], check=True)
    for k in FOTOS:
        src = os.path.join(TRAB, 'teste', k + '.png'); dst = os.path.join(PAG, 'fotos', k + '.jpg')
        if os.path.exists(src) and novo(src, dst): ff('-i', src, '-vf', "scale='min(2400,iw)':-2", '-q:v', '3', dst)


def legenda(txt, gamma):
    if not txt: return ''
    return txt + ('\n\n' + GAMMA if gamma else '') + '\n\n' + AVISO


def gerar():
    filmes = [f for f in FILMES if os.path.exists(os.path.join(PAG, 'filmes', f[0] + '.mp4'))]
    imgs = sorted(os.path.basename(p)[:-4] for p in glob.glob(os.path.join(PAG, 'imagens', '*.jpg')))
    fotos = [k for k in FOTOS if os.path.exists(os.path.join(PAG, 'fotos', k + '.jpg'))]
    planos = sorted(os.path.basename(p)[:-4] for p in glob.glob(os.path.join(PAG, 'planos', '*.mp4')))
    tit = {f[0]: f[2] for f in FILMES}
    tit.update({'carrossel': 'Carrossel car-01 a car-09', 'stories': 'Stories st-02 a st-05', 'st-01-lancamento': 'Story st-01 + enquete',
                'st-05-call': 'Story st-05 + caixa de perguntas'})
    capa = lambda p: f'capas/{p}.jpg' if p in tit and p.startswith('bo') else ('imagens/car-01-capa.jpg' if p == 'carrossel' else
                                                                                   'imagens/st-02-training.jpg' if p == 'stories' else f'imagens/{p}.jpg')

    def card_filme(f):
        fid, fmt, t, uso, txt, g = f
        d = dur(os.path.join(PAG, 'filmes', fid + '.mp4'))
        leg = legenda(txt, g)
        cls = {'9:16': 'v', '16:9': 'l', '21:9': 'w', '4:5': 'f', '1:1': 'q'}[fmt]
        h = [f'<article class="card {cls}" id="{fid}"><video controls preload="none" playsinline poster="capas/{fid}.jpg" aria-label="{esc(t)}">'
             f'<source src="filmes/{fid}.mp4" type="video/mp4"></video><div class="info"><p class="tipo">{fmt} · {d:.0f} s</p>'
             f'<h3>{esc(t)}</h3><p class="muted">{esc(uso)}</p><div class="acoes">'
             f'<button type="button" class="btn mini ouro" data-dl="filmes/{fid}.mp4" data-nome="{fid}.mp4">Baixar</button>']
        if leg: h.append(f'<button type="button" class="btn mini" data-copy="lg-{fid}" data-label="Copiar legenda" data-done="Copiada">Copiar legenda</button>')
        h.append('</div>')
        if leg: h.append(f'<details><summary>Legenda</summary><pre id="lg-{fid}">{esc(leg)}</pre></details>')
        h.append('</div></article>')
        return ''.join(h)

    def card_img(i):
        cls = 'v' if i.startswith('st-') else 'l' if i.startswith('th-') else 'f'
        return (f'<figure class="img {cls}"><img src="imagens/{i}.jpg" alt="{esc(i)}" loading="lazy" decoding="async">'
                f'<figcaption><span>{esc(i)}</span><button type="button" class="btn mini" data-dl="imagens/{i}.jpg">Baixar</button></figcaption></figure>')

    def card_foto(k):
        return (f'<figure class="img foto"><img src="fotos/{k}.jpg" alt="{esc(FOTOS[k])}" loading="lazy" decoding="async">'
                f'<figcaption><span>{esc(FOTOS[k])}</span><button type="button" class="btn mini" data-dl="fotos/{k}.jpg" data-nome="GL Black {k[2:]}.jpg">Baixar</button></figcaption></figure>')

    def card_plano(n):
        return (f'<figure class="plano"><video controls preload="none" playsinline muted poster="capas/{n}.jpg" aria-label="Plano {n}"><source src="planos/{n}.mp4" type="video/mp4"></video>'
                f'<figcaption><span>{n}</span><button type="button" class="btn mini" data-dl="planos/{n}.mp4">Baixar</button></figcaption></figure>')

    linhas = []
    for data, canal, peca, obj in CAL:
        d = datetime.date.fromisoformat(data)
        linhas.append(f'<tr data-data="{data}"><td class="num">{DIAS[d.weekday()]} {d.day:02d}/{d.month:02d}</td><td>{esc(canal)}</td>'
                      f'<td><a href="#{peca if peca.startswith("bo") else "imagens"}">{esc(tit.get(peca, peca))}</a></td><td class="muted">{esc(obj)}</td></tr>')

    grupos = {
        'carrossel': [f'imagens/{i}.jpg' for i in imgs if i.startswith('car-')],
        'stories': [f'imagens/{i}.jpg' for i in imgs if i.startswith('st-')],
        'thumbs': [f'imagens/{i}.jpg' for i in imgs if i.startswith('th-')],
        'fotos': [f'fotos/{k}.jpg' for k in fotos],
    }
    secao = lambda fmt: ''.join(card_filme(f) for f in filmes if f[1] == fmt)
    corpo = TEMPLATE
    rep = {
        '{{STATS}}': f'<span class="stat"><b>{len(filmes)}</b> filmes</span><span class="stat"><b>{len(imgs)}</b> imagens</span>'
                     f'<span class="stat"><b>{len(fotos)}</b> fotos de estúdio</span><span class="stat"><b>{len(planos)}</b> planos para editar</span>',
        '{{CAL}}': ''.join(linhas), '{{V}}': secao('9:16'), '{{L}}': secao('16:9') + secao('21:9'), '{{F}}': secao('4:5') + secao('1:1'),
        '{{CAR}}': ''.join(card_img(i) for i in imgs if i.startswith('car-')),
        '{{ST}}': ''.join(card_img(i) for i in imgs if i.startswith('st-')),
        '{{TH}}': ''.join(card_img(i) for i in imgs if i.startswith('th-')),
        '{{FOTOS}}': ''.join(card_foto(k) for k in fotos), '{{PLANOS}}': ''.join(card_plano(n) for n in planos),
        '{{AVISO}}': esc(AVISO), '{{NOTA}}': esc(NOTA), '{{DADOS}}': json.dumps({'grupos': grupos}, ensure_ascii=False),
    }
    for k, v in rep.items(): corpo = corpo.replace(k, v)
    open(os.path.join(PAG, 'index.html'), 'w', encoding='utf-8').write(corpo)
    print('página:', len(filmes), 'filmes,', len(imgs), 'imagens,', len(fotos), 'fotos,', len(planos), 'planos')


TEMPLATE = open(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'kit_glblack.html'), encoding='utf-8').read()

if __name__ == '__main__':
    preparar()
    gerar()
