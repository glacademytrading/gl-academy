# Kit do site: o melhor vídeo da Biblioteca para cada espaço do site novo, com nomes simples,
# capas em tamanho cheio, um catálogo (título, descrição, formato, duração) e o prompt para o Codex.
# Gera as capas que faltam com o ffmpeg e grava na página o manifesto do botão "Baixar o kit do site".
# O build_library.py chama este script no fim, depois do organizacao.py.
import html, json, os, re, subprocess

ROOT = os.path.dirname(os.path.abspath(__file__))
LIB = os.path.join(ROOT, 'biblioteca')
OUT = os.path.join(ROOT, 'out')
MKT = os.environ.get('GL_MARKETING') or os.path.dirname(ROOT)
IMAGEIO_FF = '/usr/local/lib/python3.11/dist-packages/imageio_ffmpeg/binaries/ffmpeg-linux-x86_64-v7.0.2'
FF = os.environ.get('FFMPEG') or (IMAGEIO_FF if os.path.exists(IMAGEIO_FF) else 'ffmpeg')
NOME_ZIP = 'GL Academy - Kit do site.zip'
CAPAS_REELS = 'imagens/img-capas-reels/'

# pasta do kit, nome no kit, vídeo publicado na Biblioteca, capa:
#   caminho de uma imagem já publicada | segundo do quadro a usar | 'inicio-fim' (primeiro e último quadro)
KIT = [
  ('loops', 'site-circulo-pacote', 'site/site-circulo-pacote.mp4', 'site/site-circulo-pacote.jpg'),
  ('loops', 'site-circulo-tecnologias', 'site/site-circulo-tecnologias.mp4', 'site/site-circulo-tecnologias.jpg'),
  ('loops', 'site-loop-tradingview', 'site/site-loop-tradingview.mp4', 'site/site-loop-tradingview.jpg'),
  ('loops', 'site-loop-ninjatrader', 'site/site-loop-ninjatrader.mp4', 'site/site-loop-ninjatrader.jpg'),
  ('loops', 'site-loop-gamma', 'site/site-loop-gamma.mp4', 'site/site-loop-gamma.jpg'),
  ('loops', 'site-loop-alvos', 'site/site-loop-alvos.mp4', 'site/site-loop-alvos.jpg'),
  ('historias', 'historia-alta-alinhada', 'videos/h02-alta-alinhada-limpo.mp4', 'inicio-fim'),
  ('historias', 'historia-estrutura-ninjatrader', 'videos/h03-ninjatrader-limpo.mp4', 'inicio-fim'),
  ('historias', 'historia-duas-telas-tradingview', 'videos/h01-duas-telas-limpo.mp4', 'inicio-fim'),
  ('filmes', 'filme-tecnologias-16x9', 'videos/comercial-tecnologias-gl-16x9.mp4', 3.6),
  ('filmes', 'filme-tecnologias-9x16', 'videos/comercial-tecnologias-gl-9x16.mp4', 3.0),
  ('filmes', 'pacote-completo-16x9', 'site/site-pacote-completo-16x9.mp4', 'site/site-pacote-completo-16x9.jpg'),
  ('filmes', 'gl-gamma-16x9', 'site/site-gamma-explicacao-16x9.mp4', 'site/site-gamma-explicacao-16x9.jpg'),
  ('filmes', 'gl-gamma-9x16', 'videos/v04-gamma-exposure.mp4', CAPAS_REELS + 'capa-v04-gamma-exposure.jpg'),
  ('filmes', 'trailer-youtube-16x9', 'videos/youtube-trailer.mp4', 2.5),
  ('reels', 'setup-acontecendo', 'videos/v02-setup-acontecendo.mp4', CAPAS_REELS + 'capa-v02-setup-acontecendo.jpg'),
  ('reels', 'alvos-claros', 'videos/v03-alvos-claros.mp4', CAPAS_REELS + 'capa-v03-alvos-claros.jpg'),
  ('reels', 'a-favor-ou-contra', 'videos/v01-a-favor-ou-contra.mp4', CAPAS_REELS + 'capa-v01-a-favor-ou-contra.jpg'),
  ('reels', 'escada-de-valor', 'videos/v11-escada-de-valor.mp4', CAPAS_REELS + 'capa-v11-escada-de-valor.jpg'),
  ('reels', 'nem-toda-queda-e-venda', 'videos/v08-nem-toda-queda-e-venda.mp4', CAPAS_REELS + 'capa-v08-nem-toda-queda-e-venda.jpg'),
  ('reels', 'tambem-no-ninjatrader', 'videos/v06-ninjatrader.mp4', 1.6),
  ('reels', 'tres-perguntas', 'videos/v07-tres-perguntas.mp4', CAPAS_REELS + 'capa-v07-tres-perguntas.jpg'),
  # "Não sei por onde começar" fica fora: cita a call de 30 minutos, e a duração ainda não está decidida
  ('faq', 'funciona-na-minha-plataforma', 'videos/objecao-plataforma.mp4', 1.6),
  ('faq', 'e-so-mais-um-indicador', 'videos/objecao-mais-um-indicador.mp4', CAPAS_REELS + 'capa-objecao-mais-um-indicador.jpg'),
  ('faq', 'preciso-entender-de-opcoes', 'videos/objecao-opcoes.mp4', 1.6),
  ('aulas', 'aula-vwap', 'videos/aula-vwap.mp4', CAPAS_REELS + 'capa-aula-vwap.jpg'),
  ('aulas', 'aula-value-area', 'videos/aula-value-area.mp4', CAPAS_REELS + 'capa-aula-value-area.jpg'),
  ('comunidade', 'comunidade-boas-vindas', 'videos/comunidade-boas-vindas.mp4', 1.6),
]
PASTAS = {
  'loops': 'Loops de 8 s que emendam sem corte: círculos, cards, topo e GL Gamma',
  'historias': 'Replays de 12 s sem texto: tocam uma vez e param no setup completo',
  'filmes': 'Vídeos com legenda para tocar no play: filme das tecnologias, Pacote Completo, GL Gamma e trailer',
  'reels': 'Vídeos verticais com legenda, para a faixa "O operacional em ação"',
  'faq': 'Respostas em vídeo para as dúvidas comuns',
  'aulas': 'Aulas rápidas para a moldura de celular da página Mentorias',
  'comunidade': 'Boas-vindas da comunidade',
  'galeria': 'Imagens da galeria "Veja os sistemas em uso"',
  'og': 'Imagem do link compartilhado de cada página (1200x630)',
}

# ---------------------------------------------------------------------------
page_path = os.path.join(LIB, 'index.html')
page = open(page_path, encoding='utf-8').read()

def attr(tag, nome):
    m = re.search(r'\s' + nome + r'="([^"]*)"', tag)
    return html.unescape(m.group(1)) if m else ''

cards = {}
for m in re.finditer(r'(<article class="vcard[^>]*>)(.*?)</article>', page, re.S):
    tag, corpo = m.group(1), m.group(2)
    d = re.search(r'<p class="desc">(.*?)</p>', corpo, re.S)
    cards[attr(tag, 'data-src')] = dict(titulo=attr(tag, 'data-title'), fmt=attr(tag, 'data-fmt'), dur=int(attr(tag, 'data-dur') or 0),
                                        desc=html.unescape(re.sub(r'<[^>]+>', '', d.group(1))).strip() if d else '')

def quadro(origem, destino, segundo=None, fim=False):
    """Capa em tamanho cheio tirada do vídeo original renderizado (melhor que a versão leve)."""
    vid = os.path.splitext(os.path.basename(origem))[0]
    src = os.path.join(OUT, vid + '.mp4')
    if not os.path.exists(src):
        src = os.path.join(LIB, origem)
    if os.path.exists(destino) and os.path.getmtime(destino) >= os.path.getmtime(src):
        return
    os.makedirs(os.path.dirname(destino), exist_ok=True)
    pos = ['-sseof', '-0.1'] if fim else ['-ss', str(segundo)]
    subprocess.run([FF, '-nostdin', '-y', '-loglevel', 'error', *pos, '-i', src, '-frames:v', '1', '-q:v', '3', destino], check=True)

arquivos, catalogo = [], []
for pasta, nome, video, capa in KIT:
    assert os.path.exists(os.path.join(LIB, video)), video
    info = cards[video]
    arquivos.append({'p': video, 'z': f'media/{pasta}/{nome}.mp4'})
    item = dict(arquivo=f'{pasta}/{nome}.mp4', titulo=info['titulo'], descricao=info['desc'], formato=info['fmt'], duracao_s=info['dur'])
    if capa == 'inicio-fim':
        for lado, fim in (('inicio', False), ('fim', True)):
            rel = f'kit/{nome}-{lado}.jpg'
            quadro(video, os.path.join(LIB, rel), 0, fim)
            arquivos.append({'p': rel, 'z': f'media/{pasta}/{nome}-{lado}.jpg'})
        item.update(capa_inicio=f'{pasta}/{nome}-inicio.jpg', capa_fim=f'{pasta}/{nome}-fim.jpg')
    else:
        if isinstance(capa, (int, float)):
            rel = f'kit/{nome}.jpg'
            quadro(video, os.path.join(LIB, rel), capa)
        else:
            rel = capa
        assert os.path.exists(os.path.join(LIB, rel)), rel
        arquivos.append({'p': rel, 'z': f'media/{pasta}/{nome}.jpg'})
        item['capa'] = f'{pasta}/{nome}.jpg'
    catalogo.append(item)

for grupo, pasta in (('img-site-galeria', 'galeria'), ('img-site-og', 'og')):
    for f in sorted(os.listdir(os.path.join(LIB, 'imagens', grupo))):
        arquivos.append({'p': f'imagens/{grupo}/{f}', 'z': f'media/{pasta}/{f}'})

# ---------------------------------------------------------------------------
# Textos do kit: LEIA-ME com a tabela de arquivos, catálogo e o prompt para o Codex
def peso(p):
    n = os.path.getsize(os.path.join(LIB, p))
    return f'{n / 1e6:.1f} MB' if n >= 1e6 else f'{n / 1e3:.0f} KB'

linhas = []
for pasta in PASTAS:
    linhas += ['', f'media/{pasta}: {PASTAS[pasta]}']
    for a in arquivos:
        if a['z'].startswith(f'media/{pasta}/'):
            nome = a['z'].split('/')[-1]
            info = cards.get(a['p'])
            extra = f"{info['fmt']}, {info['dur']} s, " if info else ''
            linhas.append(f'  {nome}  ({extra}{peso(a["p"])})')
total = sum(os.path.getsize(os.path.join(LIB, a['p'])) for a in arquivos)

prompt_md = open(os.path.join(MKT, 'site', 'prompt-codex-videos-do-site.md'), encoding='utf-8').read()
prompt = re.search(r'```text\n(.*?)```', prompt_md, re.S).group(1).strip() + '\n'

leia = f'''KIT DO SITE · GL ACADEMY
Os melhores vídeos e imagens da Biblioteca para o site novo, com nomes simples e capas em tamanho cheio.
{len([a for a in arquivos if a['z'].endswith('.mp4')])} vídeos, {len([a for a in arquivos if a['z'].endswith('.jpg')])} imagens, {total / 1e6:.0f} MB.

COMO USAR
1. Extraia este ZIP dentro da pasta do projeto do site (Documentos > Novo site para GL Academy - estilo neuronal obsidian).
2. Abra "PROMPT para o Codex.txt", copie tudo e cole no Codex.
3. O Codex move a pasta media para os arquivos estáticos do site e coloca cada vídeo no lugar certo.

Todos os vídeos são MP4 (H.264) em 1080p, sem som. Cada um tem a capa JPG de mesmo nome; as histórias têm duas capas, -inicio e -fim.
media/catalogo.json traz título, descrição, formato e duração de cada vídeo, para legendas e acessibilidade.

O QUE TEM EM CADA PASTA''' + '\n'.join(linhas) + '''

REGRAS
- Conteúdo educacional; trading envolve risco financeiro real. Não é recomendação de investimento.
- Onde aparecer GL Gamma: "GL Gamma: assinatura à parte".
- O vídeo "Não sei por onde começar" ficou fora: ele cita a call de 30 minutos, e a duração ainda não está decidida.
'''

def para_windows(t):
    return '﻿' + t.replace('\r\n', '\n').replace('\n', '\r\n')

textos = [
  {'z': 'LEIA-ME - kit do site.txt', 't': para_windows(leia)},
  {'z': 'PROMPT para o Codex.txt', 't': para_windows(prompt)},
  {'z': 'media/catalogo.json', 't': json.dumps(catalogo, ensure_ascii=False, indent=2) + '\n'},
]

# ---------------------------------------------------------------------------
# Página: manifesto do botão do kit e o prompt na seção Kit do site
manifesto = {'nome': NOME_ZIP, 'arquivos': arquivos, 'textos': textos}
bloco = '<script type="application/json" id="kit-site">' + json.dumps(manifesto, ensure_ascii=False).replace('</', '<\\/') + '</script>'
page, n = re.subn(r'<script type="application/json" id="kit-site-files">.*?</script>', lambda m: bloco, page, flags=re.S)
assert n == 1, 'faltou o marcador do kit do site na página'
assert page.count('<!--PROMPT-CODEX-->') == 1, 'faltou o lugar do prompt no site-map.html'
page = page.replace('<!--PROMPT-CODEX-->', html.escape(prompt.strip(), quote=False))
page = page.replace('<!--KIT-RESUMO-->', f'{len([a for a in arquivos if a["z"].endswith(".mp4")])} vídeos, {len([a for a in arquivos if a["z"].endswith(".jpg")])} imagens e o prompt, {total / 1e6:.0f} MB')
open(page_path, 'w', encoding='utf-8').write(page)
print(f'kit do site: {len(arquivos)} arquivos ({total / 1e6:.0f} MB), {len(catalogo)} vídeos no catálogo')
