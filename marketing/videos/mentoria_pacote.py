# ZIP da Mentoria GL: as aulas por módulo, o plano para o GL OS (com o roteiro de cada aula e os prints que
# faltam), os materiais de estudo, os prints e as capas. Tudo sai das próprias aulas (specs-mentoria.js).
#   python3 mentoria_pacote.py        -> roteiros no repositório + botão e manifesto na Biblioteca (o build_library.py chama)
#   python3 mentoria_pacote.py --zip  -> também grava o ZIP com os vídeos em qualidade cheia (out/) em ../entregas
import ast, html, json, os, re, subprocess, sys, zipfile

ROOT = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(ROOT, 'out')
LIB = os.path.join(ROOT, 'biblioteca')
MKT = os.environ.get('GL_MARKETING') or os.path.dirname(ROOT)
MENT = os.path.join(MKT, 'mentoria')
IMAGEIO_FF = '/usr/local/lib/python3.11/dist-packages/imageio_ffmpeg/binaries/ffmpeg-linux-x86_64-v7.0.2'
FF = os.environ.get('FFMPEG') or (IMAGEIO_FF if os.path.exists(IMAGEIO_FF) else 'ffmpeg')
NOME_ZIP = 'Mentoria GL - aulas do operacional.zip'  # sem acento: o navegador descarta o nome com acento no download
# a pasta mais longa onde o ZIP costuma ser extraído + a pasta que o "Extrair tudo" do Windows cria
BASE_WIN = r'C:\Users\Giovane Lazaro\Desktop\Arquivos e Programas\GL Academy organização\Trading\Marketing de trading' + '\\' + NOME_ZIP[:-4] + '\\'
DISC = 'Exemplos educacionais em replay. Não é recomendação de investimento. Trading envolve risco financeiro real.'

# ---------------------------------------------------------------------------
# As aulas
js = "const s=require('./specs-mentoria.js');console.log(JSON.stringify(s.map(a=>Object.assign({id:a.id,dur:a.dur},a.meta))))"
aulas = json.loads(subprocess.run(['node', '-e', js], cwd=ROOT, capture_output=True, text=True, check=True).stdout)
for a in aulas:
    a['n'] = int(a['aula'].split()[1])
    a['mod_n'] = int(re.search(r'Módulo (\d+)', a['modulo']).group(1))
    a['mod_nome'] = a['modulo'].split(' · ', 1)[1]

def md(s):
    """HTML das aulas -> Markdown."""
    s = re.sub(r'<b>(.*?)</b>', r'**\1**', s)
    return html.unescape(re.sub(r'<[^>]+>', '', s)).strip()

def txt(s):
    return html.unescape(re.sub(r'<[^>]+>', '', s)).strip()

def e_lista(ns):
    ns = [str(n) for n in ns]
    return ns[0] if len(ns) == 1 else ', '.join(ns[:-1]) + ' e ' + ns[-1]

def arq(s):
    """Nome de arquivo válido no Windows."""
    s = txt(s).replace(': ', ' - ').replace(':', ' -')
    return re.sub(r'[<>:"/\\|?*]', '', s).strip().rstrip('.')

def prints_de(a):
    return ('Print ' if len(a['prints']) == 1 else 'Prints ') + e_lista(a['prints'])

def ler(caminho):
    return open(caminho, encoding='utf-8-sig').read()

def csv(linhas):
    q = lambda c: '"' + str(c).replace('"', '""') + '"'
    return '\n'.join(';'.join(q(c) for c in l) for l in linhas) + '\n'

def mb(n):
    return f'{n / 1e6:.0f} MB'

# nomes dos prints: os mesmos do pacote organizado (organizacao.py)
org = open(os.path.join(ROOT, 'organizacao.py'), encoding='utf-8').read()
PRINTS = {int(n): nome for n, nome, _ in ast.literal_eval(re.search(r'^PRINTS = (\[.*?\)\])\n', org, re.S | re.M).group(1))}
def nome_print(n):
    return re.sub(r'^Print \d+', f'Print {n:02d}', PRINTS[n])

# pergunta de cada aula: a da tela "Pause o vídeo"; as aulas de leitura (1 e 5) não têm pausa no vídeo
PERGUNTA_ESTUDO = {'m01': 'Qual é o estado agora, e que tipo de trade ele pede?',
                   'm05': 'Onde você realizaria parte da posição, e até onde deixaria o resto correr?'}
def pergunta(a):
    for p in a['passos']:
        if p['tag'] == 'Pause o vídeo':
            return txt(p['titulo']) + ' ' + txt(p['texto'])
    return PERGUNTA_ESTUDO[a['id'][:3]]

# ---------------------------------------------------------------------------
# Roteiro de cada aula (Markdown), na ordem do vídeo
def roteiro(nivel):
    h_mod, h_aula = '#' * nivel, '#' * (nivel + 1)
    out, mod = [], None
    for a in aulas:
        if a['modulo'] != mod:
            mod = a['modulo']
            out += [f'{h_mod} {mod}', '']
        info = [f"{round(a['dur'])} s", prints_de(a), f"arquivo {a['id']}.mp4"] + (['com GL Gamma (assinatura à parte)'] if a['gamma'] else [])
        out += [f"{h_aula} {a['aula']} · {txt(a['titulo'])}", '', ' · '.join(info), '', f"**Objetivo:** {md(a['objetivo'])}", '']
        for p in a['passos']:
            tag, tit = txt(p['tag']), txt(p['titulo'])
            m = re.match(r'^(\d+) · (.*)$', tag)
            # "2 · Agora" + "Agora: o que o preço faz no dia" -> "2 · Agora: o que o preço faz no dia"
            cab = f'{m.group(1)} · {tit}' if m and tit.lower().startswith(m.group(2).lower()) else f'{tag} — {tit}'
            out += [f'**{cab}**', '']
            if p['texto']:
                out += [md(p['texto']), '']
            if p['lista']:
                out += [f'- {md(i)}' for i in p['lista']] + ['']
        out += [f"Próxima aula: {a['proxima']}." if a['proxima'] else 'Fim da mentoria.', '']
    return '\n'.join(out).rstrip() + '\n'

INTRO_ROTEIRO = ('O texto de cada aula, na ordem em que aparece no vídeo. Serve de gabarito para a ficha de estudo e de roteiro, '
                 'se o Giovane quiser gravar uma narração. As regras foram escritas a partir dos prints e o Giovane valida antes de liberar.')
roteiros_md = '# Roteiros das aulas da Mentoria GL\n\n' + INTRO_ROTEIRO + '\n\n' + roteiro(2) + '\n' + DISC + '\n'

# Plano para o GL OS: o plano do repositório com o anexo A (roteiros) e o anexo B (prints que faltam)
plano = ler(os.path.join(MENT, 'plano-da-mentoria.md'))
faltam = ler(os.path.join(MENT, 'prints-que-faltam.md'))
marca = re.search(r'<!-- ANEXOS:.*?-->', plano).group(0)
linhas_b = []
for l in faltam.strip().splitlines():
    if l.startswith('# '):
        l = '## Anexo B: os prints que faltam para a segunda leva'
    elif l.startswith('#'):
        l = '#' + l
    elif l.strip() in (DISC, '2 de outubro de 2026'):
        continue
    linhas_b.append(l)
anexo_b = re.sub(r'\n{3,}', '\n\n', '\n'.join(linhas_b)).strip() + '\n'
anexo_a = '## Anexo A: o roteiro de cada aula\n\n' + INTRO_ROTEIRO + '\n\n' + roteiro(3)
plano_glos = re.sub(r'\n{3,}', '\n\n', plano.replace(marca, anexo_a + '\n' + anexo_b)).rstrip() + '\n'

# ---------------------------------------------------------------------------
# Estudos: índice, cronograma de 4 semanas, diário, ficha e checklist
z_video = {a['id']: f"02 - Videoaulas/Módulo {a['mod_n']} - {a['mod_nome']}/Aula {a['n']:02d} - {arq(a['curto'])}.mp4" for a in aulas}

indice = [['Aula', 'Módulo', 'Título', 'Objetivo', 'Prints', 'Duração (s)', 'Vídeo no ZIP', 'Arquivo original', 'Próxima aula', 'GL Gamma', 'Status']]
for a in aulas:
    indice.append([a['n'], a['modulo'], txt(a['titulo']), txt(a['objetivo']), e_lista(a['prints']), round(a['dur']), z_video[a['id']],
                   a['id'] + '.mp4', a['proxima'] or '—', 'Sim' if a['gamma'] else 'Não', 'A validar pelo Giovane'])

PRATICA_MOD = {1: 'Ler o estado e o contexto D/W/M em 5 replays.', 2: '3 replays de alta, com região, gatilho, stop e alvo.',
               3: '3 replays de baixa, com região, gatilho, stop e alvo.', 4: '3 replays de equilíbrio, só nos extremos.',
               5: 'Marcar os níveis e os alvos antes de o preço chegar, em 3 replays.', 6: '3 replays parecidos com a aula, com a ficha completa.',
               7: '3 replays parecidos com a aula, com a ficha completa.'}
PRATICA_AULA = {'m17': 'Comparar um dia com o Estado de Mercado ligado e desligado.', 'm18': '3 replays em que o preço cruza o Zero Gamma.',
                'm19': 'Montar o mapa do swing da semana e o plano condicional do dia.'}
crono = [['Semana', 'Dia', 'Encontro da Mentoria 1:1', 'Aula', 'Título', 'Pergunta da aula (responda antes de ver a resposta)', 'Tarefa do dia', 'Prática no replay', 'Feito (S/N)', 'Observações']]
for a in aulas:
    tarefa = ('Assistir, anotar a leitura de cada passo e comparar com o resumo.' if a['id'][:3] in PERGUNTA_ESTUDO
              else 'Assistir até a pausa, preencher a ficha, terminar o vídeo e comparar.')
    crono.append([(a['n'] - 1) // 5 + 1, (a['n'] - 1) % 5 + 1, a['mod_n'], a['n'], txt(a['titulo']), pergunta(a), tarefa,
                  PRATICA_AULA.get(a['id'][:3], PRATICA_MOD[a['mod_n']]), '', ''])
crono.append([4, 5, 8, '—', 'Revisão e plano pessoal', 'Qual é a minha rotina antes, durante e depois do trade?',
              'Rever os resumos das 19 aulas, montar o checklist pessoal e revisar o diário de estudos.',
              'Um dia inteiro de replay com o checklist, do plano à revisão.', '', ''])

diario = [['Data', 'Aula ou replay', 'Ativo', 'Tempo gráfico', 'Estado (alta, baixa ou equilíbrio)', 'Contexto D/W/M (a favor ou contra)',
           'Região de atuação', 'Gatilho', 'Invalidação (stop) e quanto custa', 'Alvos no mapa', 'O que o preço fez',
           'Minha leitura estava certa? (S/N)', 'O que aprendi'],
          ['Exemplo (apague esta linha)', 'Aula 3 · Setup de alta', 'ES', '5 minutos', 'Alta', 'A favor: D, W e M alinhados',
           'A volta para dentro da faixa depois da varredura', 'Força acima das VWAPs D e W', 'Abaixo da mínima varrida',
           'D +0,3%, W +0,3% e 3M +1,5%', 'Reteste, segunda perna e alta alinhada D/W/M', 'S', 'Esperar a volta ao valor antes de comprar']]

checklist = f'''CHECKLIST ANTES DO TRADE · MENTORIA GL

Responda as sete perguntas antes de cada entrada, no replay e no dia a dia.

1. Qual é o estado: alta, baixa ou equilíbrio?
2. O contexto D/W/M está a favor?
3. O preço está numa região de atuação (nível, banda, valor ou Gamma) ou no meio do nada?
4. Qual é o gatilho, e ele já aconteceu?
5. Onde a ideia acaba (o stop) e quanto isso custa em dinheiro?
6. Quais alvos estão no mapa, e o alvo compensa o risco?
7. Tem notícia ou horário perigoso agora?

Se alguma resposta for "não sei", fique de fora.

{DISC}
'''

ficha = f'''FICHA DE ESTUDO · MENTORIA GL

Use uma ficha por aula e uma por replay. Preencha antes de ver a resposta.

Aula ou replay:
Data:
Ativo e tempo gráfico:

1. Estado (alta, baixa ou equilíbrio):
2. Contexto D/W/M (a favor ou contra):
3. Região de atuação:
4. Gatilho:
5. Invalidação (stop) e quanto custa:
6. Alvos no mapa:
7. O que o preço fez:
8. O que a aula mostrou de diferente da minha leitura:
9. O que levo para o próximo replay:

{DISC}
'''

leia_me = f'''MENTORIA GL · O OPERACIONAL NA PRÁTICA

{len(aulas)} videoaulas em 7 módulos, feitas com os prints reais do operacional. O gráfico para no ponto de decisão e depois mostra a região de atuação, o gatilho, a invalidação, os alvos e o resultado.

O QUE TEM AQUI

01 - Plano da mentoria (para o GL OS): o plano completo, a trilha de estudos, o encaixe nos 8 encontros da Mentoria 1:1 e, nos anexos, o roteiro de cada aula e os prints que faltam. É o arquivo para enviar ao GL OS.
02 - Videoaulas: as {len(aulas)} aulas em MP4 (1920x1080), uma pasta por módulo, na ordem.
03 - Roteiros das aulas: o texto de cada aula, passo a passo. Serve de gabarito para a ficha e de roteiro para uma narração.
04 - Estudos: cronograma de 4 semanas, diário de estudos, ficha de estudo, checklist antes do trade e o índice das aulas. As planilhas abrem no Excel e no Google Planilhas.
05 - Prints usados: os {len({n for a in aulas for n in a['prints']})} prints originais das aulas.
06 - Capas das aulas: a capa de cada aula em tamanho cheio, para a área do aluno, o APP ou o YouTube.
07 - Próximas aulas: a lista dos prints que faltam para a segunda leva, em ordem de prioridade.

ANTES DE LIBERAR PARA OS ALUNOS

As regras de cada aula (região, gatilho, stop e alvos) foram escritas a partir dos prints. O Giovane valida as aulas antes de liberar. O que conferir está no plano, em "O que o Giovane valida".

COMO ESTUDAR

1. Assista até a tela "Pause o vídeo" e pare.
2. Preencha a ficha de estudo.
3. Termine o vídeo e compare.
4. Repita a leitura em três replays parecidos.
5. Registre no diário de estudos.

{DISC}
'''

# ---------------------------------------------------------------------------
# Capas em tamanho cheio: o quadro de abertura de cada aula
os.makedirs(os.path.join(LIB, 'capas-mentoria'), exist_ok=True)
for a in aulas:
    src, dst = os.path.join(OUT, a['id'] + '.mp4'), os.path.join(LIB, 'capas-mentoria', a['id'] + '.jpg')
    if not os.path.exists(dst) or os.path.getmtime(dst) < os.path.getmtime(src):
        subprocess.run([FF, '-nostdin', '-y', '-loglevel', 'error', '-ss', '1.5', '-i', src, '-frames:v', '1', '-q:v', '3', dst], check=True)

# (local, publicado na Biblioteca, caminho no ZIP)
arquivos = []
for a in aulas:
    nome = z_video[a['id']].rsplit('/', 1)[1][:-4]
    arquivos.append((os.path.join(OUT, a['id'] + '.mp4'), f"videos/{a['id']}.mp4", z_video[a['id']]))
    arquivos.append((os.path.join(LIB, 'capas-mentoria', a['id'] + '.jpg'), f"capas-mentoria/{a['id']}.jpg", f'06 - Capas das aulas/{nome}.jpg'))
for n in sorted({n for a in aulas for n in a['prints']}):
    arquivos.append((os.path.join(ROOT, f'{n}.png'), f'prints/{n}.png', f'05 - Prints usados/{nome_print(n)}.png'))

def para_windows(z, t):
    """Textos e planilhas: CRLF e BOM, para o Bloco de Notas e o Excel; o Markdown fica como está (GL OS)."""
    return t if z.endswith('.md') else '\ufeff' + t.replace('\r\n', '\n').replace('\n', '\r\n')

textos = {
    '00 - Leia-me.txt': leia_me,
    '01 - Plano da mentoria (para o GL OS).md': plano_glos,
    f'03 - Roteiros das aulas/Roteiros das {len(aulas)} aulas.md': roteiros_md,
    '04 - Estudos/Cronograma de estudos (4 semanas).csv': csv(crono),
    '04 - Estudos/Diário de estudos (modelo).csv': csv(diario),
    '04 - Estudos/Ficha de estudo (modelo).txt': ficha,
    '04 - Estudos/Checklist antes do trade.txt': checklist,
    '04 - Estudos/Índice das aulas.csv': csv(indice),
    '07 - Próximas aulas/Prints que faltam (checklist).md': faltam,
}
textos = {z: para_windows(z, t) for z, t in textos.items()}

# Conferências: nada repetido, nomes válidos e caminhos curtos o bastante para o Windows
todos = [z for _, _, z in arquivos] + list(textos)
assert len(todos) == len({z.lower() for z in todos}), 'caminho repetido no ZIP'
for z in todos:
    assert not re.search(r'[<>:"\\|?*]', z), z
    assert len(BASE_WIN) + len(z) <= 240, (len(BASE_WIN) + len(z), z)
maior = max(todos, key=len)

# ---------------------------------------------------------------------------
# Roteiros no repositório (para as próximas sessões e para o GL OS)
if os.path.isdir(MENT):
    open(os.path.join(MENT, 'roteiros-das-aulas.md'), 'w', encoding='utf-8').write(roteiros_md)

# Botão e manifesto na seção "Mentoria GL" da Biblioteca (o ZIP é montado no navegador, como o "Baixar tudo organizado")
idx = os.path.join(LIB, 'index.html')
if os.path.exists(idx):
    pagina = open(idx, encoding='utf-8').read()
    total = sum(os.path.getsize(os.path.join(LIB, p)) for _, p, _ in arquivos) + sum(len(t.encode('utf-8')) for t in textos.values())
    manifesto = {'nome': NOME_ZIP, 'nomeLeve': NOME_ZIP, 'arquivos': [{'p': p, 'z': z} for _, p, z in arquivos],
                 'textos': [{'z': z, 't': t} for z, t in sorted(textos.items())]}
    bloco = ('<!--MENTORIA-PACOTE--><div class="dl-bar"><button type="button" class="btn btn-gold" data-pacote="mentoria-pacote">'
             f'Baixar a mentoria completa (ZIP, {mb(total)})</button><button type="button" class="btn" data-zip="mentoria">Só os vídeos (ZIP)</button>'
             '<span class="dl-status" role="status" aria-live="polite">Aulas por módulo, plano para o GL OS, roteiros, estudos, prints e capas.</span></div>'
             '<script type="application/json" id="mentoria-pacote">' + json.dumps(manifesto, ensure_ascii=False).replace('</', '<\\/') +
             '</script><!--/MENTORIA-PACOTE-->')
    if '<!--MENTORIA-PACOTE-->' in pagina:
        pagina = re.sub(r'<!--MENTORIA-PACOTE-->.*?<!--/MENTORIA-PACOTE-->', lambda m: bloco, pagina, flags=re.S)
    else:
        i = pagina.index('<section id="mentoria">')
        j = pagina.index('<button type="button" class="btn" data-zip="mentoria">', i)
        k = pagina.index('</button>', j) + len('</button>')
        pagina = pagina[:j] + bloco + pagina[k:]
    open(idx, 'w', encoding='utf-8').write(pagina)
    print(f'mentoria: {len(aulas)} aulas, {len(arquivos)} arquivos e {len(textos)} textos no ZIP da Biblioteca ({mb(total)}); '
          f'maior caminho no Windows: {len(BASE_WIN) + len(maior)} caracteres')

# ZIP local, com os vídeos em qualidade cheia
if '--zip' in sys.argv:
    destino = os.environ.get('MENTORIA_ZIP_DIR') or os.path.join(os.path.dirname(ROOT), 'entregas')
    os.makedirs(destino, exist_ok=True)
    caminho = os.path.join(destino, NOME_ZIP)
    itens = sorted([(z, None, t) for z, t in textos.items()] + [(z, local, None) for local, _, z in arquivos])
    with zipfile.ZipFile(caminho, 'w') as zf:
        for z, local, t in itens:
            if local:
                zf.write(local, z, compress_type=zipfile.ZIP_STORED)
            else:
                zf.writestr(z, t.encode('utf-8'), compress_type=zipfile.ZIP_DEFLATED)
    print(f'ZIP: {caminho} ({mb(os.path.getsize(caminho))}, {len(itens)} arquivos)')
