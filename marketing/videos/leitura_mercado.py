# Página Leitura de Mercado GL (página irmã da Biblioteca, que chegou ao limite de 256 MB por página): cada rodada de
# prints novos do dia vira vídeos de leitura de mercado, com a legenda, o download e o ZIP nas mesmas pastas do pacote
# da Biblioteca. Rodada nova: renderize com o specs da rodada e acrescente um item no começo de RODADAS.
# Uso: python3 leitura_mercado.py (a página sai em leitura/index.html, com os vídeos leves em leitura/v e as capas em leitura/p).
import html, json, os, re, subprocess

ROOT = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(ROOT, 'out')
PAG = os.path.join(ROOT, 'leitura')
IMAGEIO_FF = '/usr/local/lib/python3.11/dist-packages/imageio_ffmpeg/binaries/ffmpeg-linux-x86_64-v7.0.2'
FF = os.environ.get('FFMPEG') or (IMAGEIO_FF if os.path.exists(IMAGEIO_FF) else 'ffmpeg')
BIBLIOTECA = 'https://claude.ai/artifact/BgpMsKZZn2BikAYBcXSDfm'
RISK = 'https://claude.ai/artifact/YGFyAnt64pTYPbqzFsjhr1'
NOME_ZIP = 'GL Academy - Leitura de mercado (Claude).zip'
VID = '02 - Vídeos (feitos pelo Claude)/18 - Leitura de mercado'
BASE_WIN = r'C:\Users\Giovane Lazaro\Desktop\Arquivos e Programas\GL Academy organização\Trading\Marketing de trading' + '\\'
CRF = '25'
esc = lambda s: html.escape(str(s), quote=True)

AVISO = 'Conteúdo educacional; trading envolve risco financeiro real.'
REPLAY = 'Exemplo educacional; resultado passado não garante resultado futuro.'
GAMMA = 'GL Gamma é uma assinatura à parte.'
CALL = 'Call 1x1 gratuita no link da bio.'
FORMATOS = {'9x16': ('9:16', 'r916'), '4x5': ('4:5', 'r45'), '16x9': ('16:9', 'r169')}
TIPOS = [('reels', 'Reels, Shorts e TikTok (9:16)', 'O mesmo arquivo vai no Reels, no Shorts e no TikTok. O gancho abre no primeiro quadro.', ''),
         ('feed', 'Feed (4:5)', 'Para o feed do Instagram e do Facebook e para os anúncios de feed: nada fica cortado. A legenda é a mesma do 9:16.', ''),
         ('youtube', 'YouTube (16:9)', 'A legenda fica numa coluna à esquerda e o print à direita. Título e descrição prontos.', ' wide'),
         ('coringa', 'Coringa sem texto', 'O mesmo movimento, sem legenda, caixas e cartela, para cobrir a sua fala com a leitura do dia.', '')]

# ------------------------------------------------------------------------------------------------ rodadas (mais nova primeiro)
X01 = ('Do lateral à expansão, em dois dias de ES. Em 05/10 o topo parou em 7847,5, logo abaixo do VAH Q e do VAH W (7848). '
       'Depois, lateral até a madrugada. Em 06/10 o preço rompeu os 7848, passou o Zero Gamma e o Estado de Mercado foi de expansão '
       'de alta acelerada para muito forte, com a extensão subindo de 40% para 58%. Aí o painel de risco marcou defensivo moderado: '
       f'divergência entre risco e fluxo. Força não é entrada. {GAMMA} {REPLAY} {CALL} {AVISO}')
X02 = ('Expansão de alta muito forte. Você compraria aqui? Do preço (7884) até a primeira barreira, a Major+ 7892,5, eram 8,5 pontos. '
       'Um stop abaixo do VAH NY ficaria a 9,5 pontos: a barreira estava mais perto que o stop. E o painel de risco dizia defensivo '
       'moderado, com a leitura "divergência entre risco e fluxo; reduzir convicção e esperar alinhamento". Força não é entrada. '
       f'{GAMMA} {REPLAY} {CALL} {AVISO}')
X03 = ('Ofensivo extremo e, mesmo assim, cautela. Em 05/10 o ES subiu até 7847,5. Logo depois, o painel de risco marcava ofensivo '
       'extremo, 4 de 5 janelas positivas, mas com delta perdendo, e a leitura era "divergência entre risco e fluxo; reduzir convicção". '
       'O preço devolveu quase 8 pontos, até a Major+ 7840, e andou de lado até a madrugada, abaixo dos 7848. O painel avisa; a decisão '
       f'é sua. {GAMMA} {REPLAY} {CALL} {AVISO}')
X04 = ('Dois dias de ES no NinjaTrader, print a print. 05/10: a alta da tarde até 7847,5 e o painel de risco em ofensivo extremo, '
       'mas com delta perdendo e a leitura de divergência. O topo parou logo abaixo do VAH Q e do VAH W (7848) e o mercado andou de lado '
       'até a madrugada. 06/10: rompimento dos 7848 e do Zero Gamma, Estado de Mercado em expansão de alta acelerada e depois muito forte '
       '(extensão de 40% a 58%), a Major+ 7892,5, a faixa de volume e os alvos acima, e o painel de risco de novo pedindo cautela. Força '
       'não é entrada: leia o estado e meça o risco. Alvos são projeções do modelo, não promessa de resultado. '
       f'{GAMMA} {REPLAY} Call 1x1 gratuita: link na descrição. {AVISO}')

RODADAS = [
  dict(id='r-2026-10-06', data='06/10/2026', prints='35 a 38', ativo='ES no NinjaTrader', titulo='A expansão de 05 e 06/10',
       pasta='2026-10-06 - Expansão',
       intro='Quatro prints contam dois dias: o painel de risco pedindo cautela logo depois do topo de 05/10, o lateral abaixo dos 7848, '
             'o rompimento e a expansão de 06/10 e, no fim, o painel de risco de novo na defensiva. A lição: força não é entrada.',
       mostra=['<b>05/10, 5 minutos (print 38):</b> a alta da tarde até 7847,5. Logo depois, o painel de risco marca ofensivo extremo, '
               '4 de 5 janelas positivas, mas com delta perdendo (-462) e a leitura "divergência entre risco e fluxo; reduzir convicção e '
               'esperar alinhamento". O preço recua até a Major+ 7840.',
               '<b>06/10, 15 minutos (print 37, 7871,25):</b> o topo de 05/10 ficou logo abaixo do VAH Q e do VAH W (7848), e o mercado '
               'andou de lado até a madrugada. Depois, o rompimento dos 7848 e do Zero Gamma, e o Estado de Mercado em "expansão de alta '
               'acelerada", extensão 40%.',
               '<b>06/10, 15 minutos (print 36):</b> 7879, "expansão de alta muito forte", extensão 47%.',
               '<b>06/10, 5 minutos (print 35):</b> 7884, na VAH D (7883,50), extensão 58%. Acima: Major+ 7892,5, a faixa de volume, '
               'VAH Y 7897,25 e os alvos D +0,5% e W +1%. O painel de risco: defensivo moderado, delta ganhando e a mesma leitura de '
               'divergência.',
               '<b>A lição:</b> força não é entrada. Leia o estado, meça o risco e espere o alinhamento.'],
       quando=['Nesta semana, enquanto o assunto está fresco: "Ofensivo extremo, e o painel pediu cautela" e "Do lateral à expansão" '
               'no @glacademybr e no YouTube Shorts, fora das 19h da série Operacional na prática.',
               '"Força não é entrada" no feed (4:5), com a pergunta "Você compraria aqui?" para puxar os comentários.',
               '"Dois dias de ES, print a print" no YouTube quando o canal estiver no ar; serve também de trecho para live.',
               'O coringa é o fundo para você narrar a sua leitura do dia.',
               'Para validar: o stop abaixo do VAH NY, em "Força não é entrada", é uma proposta feita a partir do print.'],
       videos=[
         dict(vid='x01-do-lateral-a-expansao', tipo='reels', fmt='9x16', titulo='Do lateral à expansão', arquivo='Do lateral à expansão',
              desc='O gráfico se constrói: o topo de 05/10 logo abaixo do VAH Q e do VAH W (7848), o lateral até a madrugada, o '
                   'rompimento com o Zero Gamma e o Estado de Mercado de "acelerada" (40%) a "muito forte" (47% e 58%). No fim, o painel '
                   'de risco em "defensivo moderado".', uso='Reels, Shorts, TikTok e anúncio', legenda=X01),
         dict(vid='x02-forca-nao-e-entrada', tipo='reels', fmt='9x16', titulo='Força não é entrada', arquivo='Força não é entrada',
              desc='Expansão de alta muito forte em 7884, mas a primeira barreira (Major+ 7892,5) está a 8,5 pontos e um stop abaixo do '
                   'VAH NY ficaria a 9,5. O painel de risco: "defensivo moderado" e "reduzir convicção e esperar alinhamento".',
              uso='Reels, Shorts e anúncio do GL Gamma', legenda=X02, capa_t=1.7),
         dict(vid='x03-ofensivo-e-cautela', tipo='reels', fmt='9x16', titulo='Ofensivo extremo, e o painel pediu cautela',
              arquivo='Ofensivo extremo e cautela',
              desc='A alta de 05/10 até 7847,5 e, logo depois, o painel de risco: "ofensivo extremo", mas com delta perdendo e a leitura '
                   'de divergência. O preço devolve 7,75 pontos até a Major+ 7840 e anda de lado abaixo dos 7848.',
              uso='Reels, Shorts e anúncio do GL Gamma', legenda=X03),
         dict(vid='x04-dois-dias-de-es-16x9', tipo='youtube', fmt='16x9', titulo='Dois dias de ES, print a print',
              arquivo='Dois dias de ES, print a print',
              desc='A história completa em 55 segundos: o painel de risco em 05/10, o nível dos 7848, o lateral, o rompimento, o Estado de '
                   'Mercado, a Major+, a faixa de volume, os alvos e o painel de risco em 06/10.',
              uso='YouTube, LinkedIn e trecho de live', legenda=X04,
              titulo_yt='Força não é entrada: dois dias de ES, print a print'),
         dict(vid='x01-do-lateral-a-expansao-4x5', tipo='feed', fmt='4x5', titulo='Do lateral à expansão', arquivo='Do lateral à expansão',
              desc='O lateral, o rompimento e a expansão de 06/10, no formato do feed.', uso='Feed e anúncio no feed', legenda=X01),
         dict(vid='x02-forca-nao-e-entrada-4x5', tipo='feed', fmt='4x5', titulo='Força não é entrada', arquivo='Força não é entrada',
              desc='O estado forte, o espaço curto até a barreira e o painel de risco, no formato do feed.', uso='Feed e anúncio no feed',
              legenda=X02, capa_t=1.7),
         dict(vid='x03-ofensivo-e-cautela-4x5', tipo='feed', fmt='4x5', titulo='Ofensivo extremo, e o painel pediu cautela',
              arquivo='Ofensivo extremo e cautela', desc='O painel de risco depois do topo de 05/10, no formato do feed.',
              uso='Feed e anúncio no feed', legenda=X03),
         dict(vid='c17-expansao-limpo', tipo='coringa', fmt='9x16', titulo='Do lateral à expansão, sem texto',
              arquivo='Coringa - do lateral à expansão',
              desc='O ES de 05 e 06/10 se construindo na tela, até o Estado de Mercado e o painel de risco, sem legenda e sem cartela.',
              uso='Fundo para narrar a leitura do dia', legenda=''),
       ]),
]


# ------------------------------------------------------------------------------------------------ montagem
def ffmpeg(*args):
    subprocess.run([FF, '-nostdin', '-y', '-loglevel', 'error', *args], check=True)


def novo(src, dst):
    return not os.path.exists(dst) or os.path.getmtime(dst) < os.path.getmtime(src)


def duracao(path):
    r = subprocess.run([FF, '-i', path], capture_output=True, text=True).stderr
    m = re.search(r'Duration: (\d+):(\d+):([\d.]+)', r)
    return round(int(m.group(1)) * 3600 + int(m.group(2)) * 60 + float(m.group(3))) if m else 0


def preparar(v):
    src = os.path.join(OUT, v['vid'] + '.mp4')
    if not os.path.exists(src):
        raise SystemExit(f'falta {src}: renderize a rodada antes (SPECS=./specs-....js node render.js)')
    dst, capa = os.path.join(PAG, 'v', v['vid'] + '.mp4'), os.path.join(PAG, 'p', v['vid'] + '.jpg')
    if novo(src, dst):
        ffmpeg('-i', src, '-c:v', 'libx264', '-crf', CRF, '-preset', 'slow', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', dst)
    d = duracao(src)
    if novo(src, capa):
        ffmpeg('-ss', str(v.get('capa_t') or max(1, d * 0.62)), '-i', src, '-frames:v', '1', '-vf', 'scale=540:-2', '-q:v', '4', capa)
    v['dur'] = d


def card(v):
    rot, cls = FORMATOS[v['fmt']]
    vid, nome = v['vid'], f"{v['arquivo']} ({v['fmt']}).mp4"
    botoes = [f'<button type="button" class="btn mini ouro" data-dl="v/{vid}.mp4" data-nome="{esc(nome)}">Baixar MP4</button>']
    extra = ''
    if v.get('titulo_yt'):
        botoes.append(f'<button type="button" class="btn mini" data-copy="yt-{vid}" data-label="Copiar o título" data-done="Título copiado">Copiar o título</button>')
        extra += f'<p class="uso"><b>Título</b><span id="yt-{vid}">{esc(v["titulo_yt"])}</span></p>'
    if v['legenda']:
        rot_leg = 'Copiar a descrição' if v.get('titulo_yt') else 'Copiar a legenda'
        botoes.append(f'<button type="button" class="btn mini" data-copy="leg-{vid}" data-label="{rot_leg}" data-done="Copiado">{rot_leg}</button>')
        extra += (f'<details><summary>{"Descrição do YouTube" if v.get("titulo_yt") else "Legenda pronta"}</summary>'
                  f'<pre id="leg-{vid}">{esc(v["legenda"])}</pre></details>')
    return (f'<article class="vcard" id="v-{vid}">'
            f'<video class="{cls}" controls playsinline preload="none" poster="p/{vid}.jpg" src="v/{vid}.mp4"></video>'
            f'<div class="info"><div class="tags"><span class="pill">{rot}</span><span class="pill">{v["dur"]} s</span></div>'
            f'<h3>{esc(v["titulo"])}</h3><p class="sub">{esc(v["desc"])}</p><p class="uso"><b>Onde</b>{esc(v["uso"])}</p>'
            f'{extra}<div class="acoes">{"".join(botoes)}</div></div></article>')


def textos_da_rodada(r, nomes):
    linhas = [f"{r['titulo']} ({r['data']}, prints {r['prints']}, {r['ativo']})", '', re.sub('<[^>]+>', '', r['intro']), '',
              'O QUE OS PRINTS MOSTRAM'] + ['- ' + re.sub('<[^>]+>', '', x) for x in r['mostra']] + ['', 'QUANDO POSTAR'] + \
             ['- ' + x for x in r['quando']] + ['', 'OS VÍDEOS', '']
    for v, nome in zip(r['videos'], nomes):
        linhas += [nome, f"Onde usar: {v['uso']}."]
        if v.get('titulo_yt'):
            linhas += [f"Título do YouTube: {v['titulo_yt']}"]
        if v['legenda']:
            linhas += [('Descrição: ' if v.get('titulo_yt') else 'Legenda: ') + v['legenda']]
        linhas += ['']
    return '\ufeff' + '\r\n'.join(linhas).rstrip() + '\r\n'


def gerar():
    os.makedirs(os.path.join(PAG, 'v'), exist_ok=True)
    os.makedirs(os.path.join(PAG, 'p'), exist_ok=True)
    tpl = open(os.path.join(PAG, 'template.html'), encoding='utf-8').read()
    secoes, toc, dados, todos, textos, maior = [], [], {'rodadas': {}}, [], [], ''
    for r in RODADAS:
        for v in r['videos']:
            preparar(v)
        nomes, itens = [], []
        for n, v in enumerate(r['videos'], 1):
            nome = f"{n:02d} - {v['arquivo']} ({v['fmt']}).mp4"
            caminho = f"{VID}/{r['pasta']}/{nome}"
            nomes.append(nome)
            itens.append({'p': f"v/{v['vid']}.mp4", 'z': caminho})
            maior = max(maior, caminho, key=len)
        txt = {'z': f"{VID}/{r['pasta']}/Legendas e usos.txt", 't': textos_da_rodada(r, nomes)}
        dados['rodadas'][r['id']] = {'nome': f"GL Academy - Leitura de mercado {r['data'][:5].replace('/', '-')} (Claude).zip",
                                     'arquivos': itens, 'textos': [txt]}
        todos += itens
        textos.append(txt)
        blocos = []
        for tipo, rot, ajuda, larg in TIPOS:
            vs = [v for v in r['videos'] if v['tipo'] == tipo]
            if vs:
                blocos.append(f'<div class="formato"><h3>{rot}</h3><p>{ajuda}</p><div class="vgrid{larg}">{"".join(card(v) for v in vs)}</div></div>')
        secoes.append(
            f'<section class="rodada" id="{r["id"]}">'
            f'<div class="head"><p class="eyebrow">Rodada de {r["data"]} · prints {r["prints"]} · {esc(r["ativo"])}</p>'
            f'<h2>{esc(r["titulo"])}</h2><p>{esc(r["intro"])}</p></div>'
            f'<div class="acoes"><button type="button" class="btn" data-zipr="{r["id"]}" data-status="st-{r["id"]}">Baixar esta rodada (ZIP, {len(r["videos"])} vídeos)</button>'
            f'<span class="status" id="st-{r["id"]}" role="status" aria-live="polite"></span></div>'
            f'<div class="resumo"><div class="panel"><h3>O que os prints mostram</h3><ol>{"".join(f"<li>{x}</li>" for x in r["mostra"])}</ol></div>'
            f'<div class="panel"><h3>Quando postar</h3><ul>{"".join(f"<li>{esc(x)}</li>" for x in r["quando"])}</ul></div></div>'
            + ''.join(blocos) + '</section>')
        toc.append(f'<a href="#{r["id"]}">{esc(r["titulo"])}</a>')
    dados['zip'] = {'nome': NOME_ZIP, 'arquivos': todos, 'textos': textos}
    n_vid = sum(len(r['videos']) for r in RODADAS)
    pagina = (tpl.replace('<!--RODADAS-->', '\n'.join(secoes)).replace('<!--TOC-->', ''.join(toc))
              .replace('<!--N-VID-->', str(n_vid)).replace('<!--N-ROD-->', str(len(RODADAS))).replace('<!--S-ROD-->', 's' if len(RODADAS) > 1 else '')
              .replace('<!--BIBLIOTECA-->', BIBLIOTECA).replace('<!--RISK-->', RISK)
              .replace('<!--DADOS-->', json.dumps(dados, ensure_ascii=False).replace('</', '<\\/')))
    for m in ('RODADAS', 'TOC', 'N-VID', 'N-ROD', 'S-ROD', 'BIBLIOTECA', 'RISK', 'DADOS'):
        assert f'<!--{m}-->' not in pagina, m
    open(os.path.join(PAG, 'index.html'), 'w', encoding='utf-8').write(pagina)
    tam = sum(os.path.getsize(os.path.join(PAG, it['p'])) for it in todos)
    print(f'{n_vid} vídeos em {len(RODADAS)} rodada(s), {tam / 1e6:.1f} MB; maior caminho no Windows: {len(BASE_WIN + maior)} caracteres')
    assert len(BASE_WIN + maior) <= 240, maior


if __name__ == '__main__':
    gerar()
