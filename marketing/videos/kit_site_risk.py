# GL Risk Auto no site e peças extras.
#   Vídeos do site: os dois vídeos completos (specs-risk-site2.js) com capa, catálogo, a imagem do link e o prompt do
#   Codex (../site/prompt-codex-gl-risk-auto.md), num ZIP próprio.
#   Peças extras: os loops e as histórias de specs-risk-site.js e o antes e depois (specs-risk-site-img.js), que saíram do
#   site e viraram material de Reels, stories e anúncios, com o "Como usar" de cada uma.
# O kit_risk.py chama montar_site() para pôr as duas seções na página da campanha.
# Sozinho (python3 kit_site_risk.py <pasta>), grava também o ZIP dos vídeos do site na pasta indicada.
import json, os, re, subprocess, sys, zipfile

ROOT = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(ROOT, 'out')
PAG = os.path.join(ROOT, 'risk')
MKT = os.environ.get('GL_MARKETING') or os.path.dirname(ROOT)
IMAGEIO_FF = '/usr/local/lib/python3.11/dist-packages/imageio_ffmpeg/binaries/ffmpeg-linux-x86_64-v7.0.2'
FF = os.environ.get('FFMPEG') or (IMAGEIO_FF if os.path.exists(IMAGEIO_FF) else 'ffmpeg')
TOPO = 'GL Academy - Vídeos do site GL Risk Auto'
NOME_ZIP = TOPO + '.zip'
NOME_ZIP_EXTRAS = 'GL Risk Auto - peças extras (Reels, stories e anúncios).zip'
CRF_SITE = '23'
CRF_EXTRAS = '24'

# nome no site, render, segundo da capa, título, descrição
SITE = [
  ('gl-risk-auto-trade-completo', 'site-risk-v1-trade', 2.6, 'Veja funcionando: um trade do começo ao fim',
   'A leitura (VAH D e bloco vermelho), o plano desenhado com um botão e o risco x retorno na hora (2 para 1, 3 para 1, '
   '5 para 1), a entrada autorizada dentro do teto da conta, com stop e alvo na plataforma, a gestão e o sinal verde acima de 1,5 para 1.'),
  ('gl-risk-auto-protecao', 'site-risk-v2-protecao', 2.6, 'Como ele protege a sua conta',
   'O teto por trade, o limite do dia, o bloqueio do plano acima do teto, os contratos que cabem no stop e o controle ou o teclado.'),
]
# pasta no ZIP das extras, nome, render, capa ('inicio' | 'fim'), formato, título, como usar
EXTRAS = [
  ('Loops', 'risk-loop-plano', 'site-risk-loop-plano', 'inicio', '16:9', 'O plano pronto, dentro do teto',
   'Fundo de story com a enquete "Esse plano cabe no teto?"; corte de cobertura no vídeo longo do YouTube; abertura de anúncio.'),
  ('Loops', 'risk-loop-bloqueio', 'site-risk-loop-bloqueio', 'inicio', '16:9', 'Acima do teto, o plano não passa',
   'Story com o texto "Se não cabe no teto, não entra"; bumper do YouTube; cobertura quando o Giovane fala de stop longe demais.'),
  ('Loops', 'risk-loop-sinal', 'site-risk-loop-sinal', 'inicio', '16:9', 'O sinal verde no painel',
   'Story "Quando realizar?"; cobertura no trecho de saída do trade comentado; fundo de anúncio de remarketing.'),
  ('Loops', 'risk-loop-sistema', 'site-risk-loop-sistema', 'inicio', '16:9', 'O sistema GL completo',
   'Banner animado de live (OBS); cobertura de abertura no YouTube; anúncio "contexto, risco e execução na mesma tela".'),
  ('Loops', 'risk-circulo', 'site-risk-circulo', 'inicio', '1:1', 'GL Risk Auto (redondo)',
   'Post quadrado do feed; sobreposição redonda no canto de lives e vídeos longos; recorte para a foto do destaque.'),
  ('Histórias', 'historia-risk-bloqueio', 'historia-risk-bloqueio', 'fim', '16:9', 'Acima do teto não passa; dentro do teto, fica pronto',
   'Anúncio curto (Reels e stories com faixa de texto em cima e embaixo); trecho do vídeo longo sobre gestão de risco.'),
  ('Histórias', 'historia-risk-trade', 'historia-risk-trade', 'fim', '16:9', 'Do contexto à entrada com stop e alvo',
   'Remarketing para quem viu o vídeo do trade; cobertura do roteiro "Trade comentado do começo ao fim".'),
]
IMAGENS_EXTRAS = [
  ('Antes e depois', 'risk-antes.jpg', 'imagens/site-risk-antes-depois/risk-antes.jpg', 'Antes: o gráfico sem o plano.'),
  ('Antes e depois', 'risk-depois.jpg', 'imagens/site-risk-antes-depois/risk-depois.jpg', 'Depois: o mesmo gráfico com entrada, stop e a escada de R.'),
]
COMO_USAR_AD = ('Carrossel de 2 slides "Antes / Depois" (corte 4:5 no centro); Reel com transição de deslizar no editor; '
                'thumbnail do vídeo "O plano em um botão".')


def ffmpeg(*args):
    subprocess.run([FF, '-nostdin', '-y', '-loglevel', 'error', *args], check=True)


def novo(src, dst):
    return not os.path.exists(dst) or os.path.getmtime(dst) < os.path.getmtime(src)


def duracao(path):
    r = subprocess.run([FF, '-hide_banner', '-i', path], capture_output=True, text=True)
    m = re.search(r'Duration: (\d+):(\d+):([\d.]+)', r.stderr)
    return round(int(m.group(1)) * 3600 + int(m.group(2)) * 60 + float(m.group(3)), 1)


def peso(n):
    return f'{n / 1e6:.1f} MB' if n >= 1e6 else f'{n / 1e3:.0f} KB'


def video_web(vid, rel, crf):
    src = os.path.join(OUT, vid + '.mp4')
    assert os.path.exists(src), 'falta renderizar ' + vid
    dst = os.path.join(PAG, rel)
    if novo(src, dst):
        ffmpeg('-i', src, '-an', '-c:v', 'libx264', '-crf', crf, '-preset', 'slow', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', dst)
    return src


def quadro(src, dst, segundo=0, fim=False):
    if novo(src, dst):
        pos = ['-sseof', '-0.1'] if fim else ['-ss', str(segundo)]
        ffmpeg(*pos, '-i', src, '-frames:v', '1', '-q:v', '3', dst)


def montar_site():
    os.makedirs(os.path.join(PAG, 'site'), exist_ok=True)
    win = lambda t: '﻿' + t.replace('\r\n', '\n').replace('\n', '\r\n')

    # vídeos do site
    arquivos, catalogo = [], []
    for nome, vid, seg, titulo, desc in SITE:
        rel = f'site/{nome}.mp4'
        src = video_web(vid, rel, CRF_SITE)
        capa = f'site/{nome}.jpg'
        quadro(src, os.path.join(PAG, capa), seg)
        arquivos += [{'p': rel, 'z': f'{TOPO}/media/risk/{nome}.mp4'}, {'p': capa, 'z': f'{TOPO}/media/risk/{nome}.jpg'}]
        catalogo.append(dict(arquivo=f'{nome}.mp4', capa=f'{nome}.jpg', titulo=titulo, descricao=desc, formato='16:9',
                             duracao_s=duracao(os.path.join(PAG, rel)), peso=peso(os.path.getsize(os.path.join(PAG, rel)))))
    og = 'site/og-gl-risk-auto.jpg'
    s = os.path.join(OUT, 'imagens/site-risk-og/og-gl-risk-auto.jpg')
    if novo(s, os.path.join(PAG, og)):
        open(os.path.join(PAG, og), 'wb').write(open(s, 'rb').read())
    arquivos.append({'p': og, 'z': f'{TOPO}/media/risk/og-gl-risk-auto.jpg'})
    catalogo.append(dict(arquivo='og-gl-risk-auto.jpg', descricao='Imagem do link compartilhado (1200x630).'))
    prompt_md = open(os.path.join(MKT, 'site', 'prompt-codex-gl-risk-auto.md'), encoding='utf-8').read()
    prompt = re.search(r'```text\n(.*?)```', prompt_md, re.S).group(1).strip() + '\n'
    total = sum(os.path.getsize(os.path.join(PAG, a['p'])) for a in arquivos)
    linhas = '\n'.join(f"  media/risk/{c['arquivo']}  ({c['formato']}, {c['duracao_s']:g} s, {c['peso']}): {c['titulo']}" for c in catalogo if 'formato' in c)
    leia = f'''VÍDEOS DO SITE · GL RISK AUTO
Os dois vídeos do GL Risk Auto para o site, com capa, catálogo e a imagem do link compartilhado. {total / 1e6:.0f} MB.

COMO USAR
1. Extraia este ZIP dentro da pasta do projeto do site.
2. Abra "PROMPT para o Codex - GL Risk Auto.txt", copie tudo e cole no Codex.
3. O Codex move a pasta media/risk para os arquivos estáticos do site e cria a seção (ou a página) do GL Risk Auto.

OS ARQUIVOS
{linhas}
  media/risk/og-gl-risk-auto.jpg  (1200x630): imagem do link compartilhado
  media/risk/catalogo.json: título, descrição e duração de cada vídeo

Os vídeos são MP4 (H.264), 1920x1080, sem som: a legenda está na imagem. Cada um tem a capa JPG de mesmo nome.

REGRAS
- Conteúdo educacional; trading envolve risco financeiro real. Não é recomendação de investimento.
- Os vídeos são replays (exemplos educacionais); resultado passado não garante resultado futuro.
- Risco estimado no stop; custos e slippage não incluídos.
- Junto do vídeo de proteção: "Aprovação em mesa proprietária depende de você e das regras de cada mesa."
'''
    textos = [
        {'z': f'{TOPO}/LEIA-ME - vídeos do site GL Risk Auto.txt', 't': win(leia)},
        {'z': f'{TOPO}/PROMPT para o Codex - GL Risk Auto.txt', 't': win(prompt)},
        {'z': f'{TOPO}/media/risk/catalogo.json', 't': json.dumps(catalogo, ensure_ascii=False, indent=2) + '\n'},
    ]
    grupo_site = {'nome': NOME_ZIP, 'arquivos': arquivos, 'textos': textos}

    # peças extras para Reels, stories e anúncios
    extras, arq_ex, linhas_ex = [], [], []
    for pasta, nome, vid, capa, fmt, titulo, uso in EXTRAS:
        rel = f'site/{nome}.mp4'
        src = video_web(vid, rel, CRF_EXTRAS)
        pst = f'site/{nome}-{capa}.jpg' if capa == 'fim' else f'site/{nome}.jpg'
        quadro(src, os.path.join(PAG, pst), 0, fim=(capa == 'fim'))
        arq_ex.append({'p': rel, 'z': f'{pasta}/{nome}.mp4'})
        dur = duracao(os.path.join(PAG, rel))
        extras.append(dict(nome=nome, src=rel, pst=pst, fmt=fmt, titulo=titulo, uso=uso, dur=dur, pasta=pasta))
        linhas_ex.append(f'{pasta}/{nome}.mp4 ({fmt}, {dur:g} s): {titulo}.\n   Como usar: {uso}')
    for pasta, nome, src, desc in IMAGENS_EXTRAS:
        rel = f'site/{nome}'
        s = os.path.join(OUT, src)
        if novo(s, os.path.join(PAG, rel)):
            open(os.path.join(PAG, rel), 'wb').write(open(s, 'rb').read())
        arq_ex.append({'p': rel, 'z': f'{pasta}/{nome}'})
        linhas_ex.append(f'{pasta}/{nome} (1920x1080): {desc}')
    linhas_ex.append(f'Antes e depois: {COMO_USAR_AD}')
    como = ('GL RISK AUTO · PEÇAS EXTRAS PARA REELS, STORIES E ANÚNCIOS\n'
            'Loops de 8 s que emendam sem corte, histórias que param no último quadro e o antes e depois. Sem som e sem legenda:\n'
            'o texto entra no editor (Edits, CapCut ou o próprio Instagram), em cima e embaixo, para virar 9:16.\n\n'
            + '\n\n'.join(linhas_ex) +
            '\n\nEm toda peça: selo de replay visível, "Risco estimado no stop; custos e slippage não incluídos" e o aviso de risco.\n'
            'Nos anúncios para mesa proprietária: "Aprovação em mesa proprietária depende de você e das regras de cada mesa."\n')
    grupo_extras = {'nome': NOME_ZIP_EXTRAS, 'arquivos': arq_ex, 'textos': [{'z': 'Como usar.txt', 't': win(como)}]}
    return dict(grupo=grupo_site, grupo_extras=grupo_extras, prompt=prompt, catalogo=catalogo, extras=extras, total=total)


def gravar_zip(K, pasta):
    os.makedirs(pasta, exist_ok=True)
    caminho = os.path.join(pasta, NOME_ZIP)
    with zipfile.ZipFile(caminho, 'w', zipfile.ZIP_STORED) as z:
        for a in K['grupo']['arquivos']:
            z.write(os.path.join(PAG, a['p']), a['z'])
        for t in K['grupo']['textos']:
            z.writestr(t['z'], t['t'].encode('utf-8'), compress_type=zipfile.ZIP_DEFLATED)
    return caminho


if __name__ == '__main__':
    K = montar_site()
    print(f"vídeos do site GL Risk Auto: {K['total'] / 1e6:.0f} MB; peças extras: {len(K['extras'])} vídeos")
    if len(sys.argv) > 1:
        print('ZIP:', gravar_zip(K, sys.argv[1]))
