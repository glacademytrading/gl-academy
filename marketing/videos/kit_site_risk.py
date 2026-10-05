# Kit do site do GL Risk Auto: os vídeos e imagens para a página nova do produto no site (e para as páginas que já
# existem), com nomes simples, capas em tamanho cheio, catálogo e o prompt para o Codex
# (../site/prompt-codex-gl-risk-auto.md). Loops e histórias novos: render.js com specs-risk-site.js; imagens do antes e
# depois e do link compartilhado: slides.js com specs-risk-site-img.js. Filmes, reels, tutoriais e aulas reaproveitam
# os vídeos leves da página da campanha (risk/v) e as capas dela (risk/img).
# O kit_risk.py chama montar_site() para pôr o botão "Baixar o kit do site" na página da campanha.
# Sozinho (python3 kit_site_risk.py <pasta>), grava também o ZIP do kit na pasta indicada.
import json, os, re, subprocess, sys, zipfile

ROOT = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(ROOT, 'out')
PAG = os.path.join(ROOT, 'risk')
MKT = os.environ.get('GL_MARKETING') or os.path.dirname(ROOT)
IMAGEIO_FF = '/usr/local/lib/python3.11/dist-packages/imageio_ffmpeg/binaries/ffmpeg-linux-x86_64-v7.0.2'
FF = os.environ.get('FFMPEG') or (IMAGEIO_FF if os.path.exists(IMAGEIO_FF) else 'ffmpeg')
TOPO = 'GL Academy - Kit do site GL Risk Auto'
NOME_ZIP = TOPO + '.zip'
CRF_SITE = '24'

# pasta, nome no kit, origem, capa, formato, título, descrição
#   origem 'novo:<id>'  = render novo em out/<id>.mp4, codificado aqui em risk/site/
#   origem 'leve:<id>'  = vídeo leve já publicado em risk/v/<id>.mp4
#   capa: 'inicio' (primeiro quadro) | 'inicio-fim' (primeiro e último) | número (segundo do quadro) | caminho em risk/
KIT = [
  ('loops', 'risk-loop-plano', 'novo:site-risk-loop-plano', 'inicio', '16x9', 'O plano pronto, dentro do teto',
   'O painel e o gráfico com stop, entrada e a escada de R. O painel marca o plano pronto, dentro do teto.'),
  ('loops', 'risk-loop-bloqueio', 'novo:site-risk-loop-bloqueio', 'inicio', '16x9', 'Acima do teto, o plano não passa',
   'O plano visual com risco de US$387,50 contra o teto de US$285,71: bloqueado antes da ordem.'),
  ('loops', 'risk-loop-sinal', 'novo:site-risk-loop-sinal', 'inicio', '16x9', 'O sinal verde no painel',
   'O painel avisa que o risco x retorno ficou a favor: avalie realizar. A decisão é sua.'),
  ('loops', 'risk-loop-sistema', 'novo:site-risk-loop-sistema', 'inicio', '16x9', 'O sistema GL completo',
   'O painel do GL Risk Auto à esquerda, com o gráfico de 30 minutos e o de 5 minutos.'),
  ('loops', 'risk-circulo', 'novo:site-risk-circulo', 'inicio', '1x1', 'GL Risk Auto',
   'O painel inteiro e o zoom no sinal verde, para recorte redondo. O selo de replay já está dentro do círculo.'),
  ('historias', 'historia-risk-bloqueio', 'novo:historia-risk-bloqueio', 'inicio-fim', '16x9', 'Acima do teto não passa; dentro do teto, fica pronto',
   'O plano acima do teto é barrado. O plano dentro do teto fica pronto para o START confirmar.'),
  ('historias', 'historia-risk-trade', 'novo:historia-risk-trade', 'inicio-fim', '16x9', 'Do contexto à entrada com stop e alvo',
   'VAH D e bloco vermelho, o plano medido em R e a entrada dentro do teto, com stop e alvo na plataforma.'),
  ('filmes', 'risk-trade-completo-16x9', 'leve:yt-30-trade-completo', 2.0, '16x9', 'Um trade do começo ao fim',
   'Contexto, plano medido em R, entrada autorizada dentro do teto, stop e alvo na plataforma e o sinal verde.'),
  ('filmes', 'risk-trade-completo-9x16', 'leve:v19-risk-auto-trade', 'img/capas-ra/capa-v19-risk-auto-trade.jpg', '9x16', 'Um trade do começo ao fim',
   'Um trade inteiro em 5 passos, do contexto ao sinal verde.'),
  ('filmes', 'risk-mesa-proprietaria-16x9', 'leve:yt-15-mesa-proprietaria', 2.0, '16x9', 'As regras da mesa na tela',
   'Limite do dia e teto por trade no painel; o plano acima do teto não passa. Aprovação em mesa proprietária depende de você e das regras de cada mesa.'),
  ('filmes', 'risk-mesa-proprietaria-9x16', 'leve:ra06-mesa-proprietaria', 'img/capas-ra/capa-ra06-mesa-proprietaria.jpg', '9x16', 'Mesa proprietária: as regras na tela',
   'O limite do dia, o preset de mesa e o teto por trade na tela. Aprovação em mesa proprietária depende de você e das regras de cada mesa.'),
]
TUTORIAIS = [
  (1, 'primeiros-passos', 't01-primeiros-passos', 'Primeiros passos: conta, ativo e preset',
   'Conta, ativo, modo, plano de risco e preset: do aviso "Configure a conta" ao planejamento.'),
  (2, 'planejar-conferir-confirmar', 't02-planejar-conferir-confirmar', 'Planejar, conferir e confirmar',
   'A e Y planejam, o plano em R no gráfico, o ajuste fino e o START.'),
  (3, 'controle-e-teclado', 't03-controle-e-teclado', 'O controle e o teclado',
   'O mapa do controle botão por botão, o treino sem ordens e o teclado.'),
  (4, 'estados-do-painel', 't04-estados-do-painel', 'Os estados do painel',
   'Configure a conta, planejamento, plano pronto ou acima do teto, em posição e o sinal verde.'),
]
for n, nome, vid, tit, desc in TUTORIAIS:
    KIT.append(('tutoriais', f'tutorial-{n}-{nome}-16x9', f'leve:{vid}', f'img/thumbs-ra/thumb-ra-t0{n}.jpg', '16x9', tit, desc))
    KIT.append(('tutoriais', f'tutorial-{n}-{nome}-9x16', f'leve:{vid}-9x16', f'img/capas-ra/capa-{vid}-9x16.jpg', '9x16', tit, desc))
REELS = [
  ('este-trade-nao-passou', 'ra01-bloqueado', 'Este trade não passou', 'O plano acima do teto da conta, barrado antes da ordem.'),
  ('quanto-voce-perde', 'ra02-quanto-perde', 'Quanto você perde?', 'O risco no stop e a escada de 1R a 5R, antes do clique.'),
  ('o-que-e-r', 'ra09-o-que-e-r', 'O que é R?', 'Aula de 20 segundos: a unidade de risco.'),
  ('um-contrato-ou-dois', 'ra04-quantos-contratos', '1 contrato ou 2?', 'Quantos contratos cabem no stop, e quando não cabe nenhum.'),
  ('quando-realizar', 'ra05-sinal-verde', 'Quando realizar?', 'O sinal verde: o painel avisa, a decisão é sua.'),
  ('sim-e-um-controle', 'ra03-controle', 'Sim, é um controle', 'Cada botão faz uma coisa, sempre dentro do teto.'),
  ('antes-e-depois', 'ra08-antes-e-depois', 'Antes e depois', 'O mesmo gráfico antes do plano, com o plano e em posição.'),
  ('cinco-erros-de-risco', 'ra07-5-erros', '5 erros de risco', 'Cinco erros que quebram conta e o que o painel faz em cada um.'),
]
for nome, vid, tit, desc in REELS:
    KIT.append(('reels', nome, f'leve:{vid}', f'img/capas-ra/capa-{vid}.jpg', '9x16', tit, desc))
KIT += [
  ('aulas', 'aula-20-do-contexto-ao-sinal-verde', 'leve:m20-risco-do-contexto-ao-verde-9x16', 'img/capas-ra/capa-m20-risco-do-contexto-ao-verde-9x16.jpg', '9x16',
   'Aula 20 · Do contexto ao sinal verde', 'Uma venda no ES do começo ao fim, com pausas para o aluno decidir. Mentoria GL, módulo de gestão de risco.'),
  ('aulas', 'aula-21-teto-e-tamanho-de-posicao', 'leve:m21-teto-e-tamanho-de-posicao-9x16', 'img/capas-ra/capa-m21-teto-e-tamanho-de-posicao-9x16.jpg', '9x16',
   'Aula 21 · Teto e tamanho de posição', 'De onde vem o teto, quantos contratos cabem e por que a mão não cresce no impulso. Mentoria GL, módulo de gestão de risco.'),
]
IMAGENS = [
  ('antes-depois', 'risk-antes.jpg', 'imagens/site-risk-antes-depois/risk-antes.jpg', 'Antes: o gráfico de 5 minutos do ES, sem o plano.'),
  ('antes-depois', 'risk-depois.jpg', 'imagens/site-risk-antes-depois/risk-depois.jpg', 'Depois: o mesmo gráfico com entrada, stop e a escada de R do GL Risk Auto.'),
  ('og', 'og-gl-risk-auto.jpg', 'imagens/site-risk-og/og-gl-risk-auto.jpg', 'Imagem do link compartilhado da página do GL Risk Auto (1200x630).'),
]
PASTAS = {
  'loops': 'Loops de 8 s que emendam sem corte, sem som: topo, passos do "Como funciona", Tecnologias e o círculo da chamada final',
  'historias': 'Replays que tocam uma vez e param no último quadro (capas -inicio e -fim)',
  'antes-depois': 'As duas imagens do antes e depois com arrasto (mesmo enquadramento)',
  'filmes': 'Vídeos com legenda para tocar no play, em 16x9 e 9x16',
  'tutoriais': 'Os 4 tutoriais, cada um em 16x9 e 9x16, para as abas',
  'reels': 'Vídeos verticais com legenda: faixa "Em 15 segundos", cards das dores e respostas das dúvidas',
  'aulas': 'Aulas 20 e 21 da Mentoria (9x16), para a moldura de celular da página Mentorias',
  'og': 'Imagem do link compartilhado da página nova (1200x630)',
}


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


def montar_site():
    """Prepara risk/site e devolve o grupo do ZIP do kit (para a página) e o resumo."""
    os.makedirs(os.path.join(PAG, 'site'), exist_ok=True)
    arquivos, catalogo = [], []

    def quadro(src, dst, segundo=None, fim=False):
        if novo(src, dst):
            pos = ['-sseof', '-0.1'] if fim else ['-ss', str(segundo or 0)]
            ffmpeg(*pos, '-i', src, '-frames:v', '1', '-q:v', '3', dst)

    for pasta, nome, origem, capa, fmt, titulo, desc in KIT:
        tipo, vid = origem.split(':')
        full = os.path.join(OUT, vid + '.mp4')
        if tipo == 'novo':
            assert os.path.exists(full), 'falta renderizar ' + vid
            rel = f'site/{nome}.mp4'
            dst = os.path.join(PAG, rel)
            if novo(full, dst):
                ffmpeg('-i', full, '-an', '-c:v', 'libx264', '-crf', CRF_SITE, '-preset', 'slow', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', dst)
        else:
            rel = f'v/{vid}.mp4'
            assert os.path.exists(os.path.join(PAG, rel)), 'falta o vídeo leve ' + rel
        arquivos.append({'p': rel, 'z': f'{TOPO}/media/risk/{pasta}/{nome}.mp4'})
        item = dict(arquivo=f'{pasta}/{nome}.mp4', titulo=titulo, descricao=desc, formato=fmt.replace('x', ':'),
                    duracao_s=duracao(os.path.join(PAG, rel)), peso=peso(os.path.getsize(os.path.join(PAG, rel))))
        # a capa sai do render em tamanho cheio (melhor que o vídeo leve)
        origem_capa = full if os.path.exists(full) else os.path.join(PAG, rel)
        if capa == 'inicio-fim':
            for lado, fim in (('inicio', False), ('fim', True)):
                crel = f'site/{nome}-{lado}.jpg'
                quadro(origem_capa, os.path.join(PAG, crel), 0, fim)
                arquivos.append({'p': crel, 'z': f'{TOPO}/media/risk/{pasta}/{nome}-{lado}.jpg'})
            item.update(capa_inicio=f'{pasta}/{nome}-inicio.jpg', capa_fim=f'{pasta}/{nome}-fim.jpg')
        else:
            if capa == 'inicio' or isinstance(capa, (int, float)):
                crel = f'site/{nome}.jpg'
                quadro(origem_capa, os.path.join(PAG, crel), 0 if capa == 'inicio' else capa)
            else:
                crel = capa
                assert os.path.exists(os.path.join(PAG, crel)), crel
            arquivos.append({'p': crel, 'z': f'{TOPO}/media/risk/{pasta}/{nome}.jpg'})
            item['capa'] = f'{pasta}/{nome}.jpg'
        catalogo.append(item)

    for pasta, nome, src, desc in IMAGENS:
        s = os.path.join(OUT, src)
        rel = f'site/{nome}'
        dst = os.path.join(PAG, rel)
        if novo(s, dst):
            with open(s, 'rb') as a, open(dst, 'wb') as b:
                b.write(a.read())
        arquivos.append({'p': rel, 'z': f'{TOPO}/media/risk/{pasta}/{nome}'})
        catalogo.append(dict(arquivo=f'{pasta}/{nome}', descricao=desc, peso=peso(os.path.getsize(dst))))

    # LEIA-ME, catálogo e o prompt
    linhas = []
    for pasta in PASTAS:
        linhas += ['', f'media/risk/{pasta}: {PASTAS[pasta]}']
        for c in catalogo:
            if c['arquivo'].startswith(pasta + '/'):
                extra = f"{c['formato']}, {c['duracao_s']:g} s, " if 'formato' in c else ''
                linhas.append(f"  {c['arquivo'].split('/')[-1]}  ({extra}{c['peso']})")
    total = sum(os.path.getsize(os.path.join(PAG, a['p'])) for a in arquivos)
    n_mp4 = sum(1 for a in arquivos if a['z'].endswith('.mp4'))
    n_jpg = sum(1 for a in arquivos if a['z'].endswith('.jpg'))
    prompt_md = open(os.path.join(MKT, 'site', 'prompt-codex-gl-risk-auto.md'), encoding='utf-8').read()
    prompt = re.search(r'```text\n(.*?)```', prompt_md, re.S).group(1).strip() + '\n'
    leia = f'''KIT DO SITE · GL RISK AUTO
Os vídeos e imagens da página do GL Risk Auto no site, com nomes simples e capas em tamanho cheio.
{n_mp4} vídeos, {n_jpg} imagens, {total / 1e6:.0f} MB.

COMO USAR
1. Extraia este ZIP dentro da pasta do projeto do site (Documentos > Novo site para GL Academy - estilo neuronal obsidian).
2. Abra "PROMPT para o Codex - GL Risk Auto.txt", copie tudo e cole no Codex.
3. O Codex move a pasta media/risk para os arquivos estáticos do site, cria a página /gl-risk-auto e liga o produto
   nas páginas Tecnologias, Pacote Completo e Mentorias.

Os vídeos são MP4 (H.264), sem som. Cada um tem a capa JPG de mesmo nome; as histórias têm duas capas, -inicio e -fim.
media/risk/catalogo.json traz título, descrição, formato e duração de cada vídeo, para legendas e acessibilidade.
O kit anterior (pasta media/, do "Kit do site" da Biblioteca) continua valendo: este só acrescenta a pasta media/risk.

O QUE TEM EM CADA PASTA''' + '\n'.join(linhas) + '''

REGRAS
- Conteúdo educacional; trading envolve risco financeiro real. Não é recomendação de investimento.
- Os vídeos são replays (exemplos educacionais); resultado passado não garante resultado futuro.
- Risco estimado no stop; custos e slippage não incluídos.
- Mesa proprietária: "Aprovação em mesa proprietária depende de você e das regras de cada mesa."
- Não escrever a duração da conversa gratuita nem o número de R do primeiro sinal verde (ainda em definição).
'''
    win = lambda t: '﻿' + t.replace('\r\n', '\n').replace('\n', '\r\n')
    textos = [
        {'z': f'{TOPO}/LEIA-ME - kit do site GL Risk Auto.txt', 't': win(leia)},
        {'z': f'{TOPO}/PROMPT para o Codex - GL Risk Auto.txt', 't': win(prompt)},
        {'z': f'{TOPO}/media/risk/catalogo.json', 't': json.dumps(catalogo, ensure_ascii=False, indent=2) + '\n'},
    ]
    grupo = {'nome': NOME_ZIP, 'arquivos': arquivos, 'textos': textos}
    return dict(grupo=grupo, prompt=prompt, catalogo=catalogo, total=total, n_mp4=n_mp4, n_jpg=n_jpg)


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
    print(f"kit do site GL Risk Auto: {K['n_mp4']} vídeos e {K['n_jpg']} imagens, {K['total'] / 1e6:.0f} MB")
    if len(sys.argv) > 1:
        print('ZIP:', gravar_zip(K, sys.argv[1]))
