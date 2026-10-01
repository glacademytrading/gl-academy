# Testa o organizar-marketing.ps1 numa cópia simulada da pasta "Marketing de trading".
# Precisa do PowerShell 7 (pwsh; ou aponte com PWSH=/caminho/do/pwsh) e da Biblioteca montada
# (python3 ../videos/build_library.py), de onde sai o pacote, igual ao ZIP que a página monta.
import json, os, re, shutil, subprocess, sys, tempfile, zipfile

AQUI = os.path.dirname(os.path.abspath(__file__))
LIB = os.environ.get('GL_BIBLIOTECA') or os.path.join(AQUI, '..', 'videos', 'biblioteca')
PW = os.environ.get('PWSH', 'pwsh')
TMP = tempfile.mkdtemp(prefix='gl-organizador-')
PKG = os.path.join(TMP, 'pacote', 'GL Academy - Marketing (Claude)')
SIM = os.path.join(TMP, 'winsim')

# o pacote, a partir do manifesto da página; o organizador é o desta pasta (o que está sendo testado)
pagina = open(os.path.join(LIB, 'index.html'), encoding='utf-8').read()
manifesto = json.loads(re.search(r'<script type="application/json" id="organizacao">(.*?)</script>', pagina, re.S).group(1).replace('<\\/', '</'))
for a in manifesto['arquivos']:
    os.makedirs(os.path.dirname(os.path.join(PKG, a['z'])), exist_ok=True)
    shutil.copy(os.path.join(LIB, a['p']), os.path.join(PKG, a['z']))
for t in manifesto['textos']:
    os.makedirs(os.path.dirname(os.path.join(PKG, t['z'])), exist_ok=True)
    open(os.path.join(PKG, t['z']), 'w', encoding='utf-8', newline='').write(t['t'])
shutil.copy(os.path.join(AQUI, 'organizar-marketing.ps1'), os.path.join(PKG, '00 - Comece aqui', 'organizar-marketing.ps1'))

def criar(caminho, conteudo=b'x'):
    os.makedirs(os.path.dirname(caminho), exist_ok=True)
    with open(caminho, 'wb') as f:
        f.write(conteudo)

def montar(raiz_nome='Marketing de trading'):
    shutil.rmtree(SIM, ignore_errors=True)
    raiz = os.path.join(SIM, 'Desktop', 'Arquivos e Programas', 'GL Academy organização', 'Trading', raiz_nome)
    criar(os.path.join(raiz, 'comerciais', 'comercial antigo.mp4'), b'video-comercial')
    criar(os.path.join(raiz, 'comerciais', 'igual.mp4'), b'mesmo-conteudo-repetido')
    criar(os.path.join(raiz, 'Vinhetas', 'igual (copia).mp4'), b'mesmo-conteudo-repetido')
    criar(os.path.join(raiz, 'Depoimentos', 'joao.mp4'), b'dep1')
    criar(os.path.join(raiz, 'Depoimentos de assinantes atuais', 'maria.mp4'), b'dep2')
    criar(os.path.join(raiz, 'Fotos para postar (Giovane)', 'foto.jpg'), b'foto')
    criar(os.path.join(raiz, 'imagens para usar', 'img.png'), b'img')
    criar(os.path.join(raiz, 'LEADS', 'leads.xlsx'), b'leads')
    criar(os.path.join(raiz, 'LEADS', 'sub', 'leads-antigos.csv'), b'leads2')
    criar(os.path.join(raiz, 'Vídeos para usar no Youtube', 'yt.mp4'), b'yt')
    criar(os.path.join(raiz, 'Aurora.lnk'), b'lnk')
    criar(os.path.join(raiz, 'GL Academy Trading Fractal Wallpaper.mp4'), b'wall' * 1000)
    criar(os.path.join(raiz, 'tutorial_higgsfield_media_inference_workflow.md'), b'# tut')
    criar(os.path.join(raiz, 'desktop.ini'), b'[.ShellClassInfo]')
    criar(os.path.join(raiz, 'anotacoes soltas.txt'), b'nota')
    # ZIP do Codex no lugar original
    zdir = os.path.join(SIM, 'Documents', 'Novo site para GL Academy - estilo neuronal obsidian', 'GL_VIDEOS_RODADA_2026-09-30')
    os.makedirs(zdir, exist_ok=True)
    zp = os.path.join(zdir, 'GL_ACADEMY_VIDEOS_RODADA_2026-09-30.zip')
    with zipfile.ZipFile(zp, 'w') as z:
        z.writestr('com_legenda/gl_setup_com_legenda.mp4', b'codex1')
        z.writestr('sem_legenda/gl_setup_sem_legenda.mp4', b'codex2')
        z.writestr('estudio/antes.mp4', b'codex3')
        z.writestr('logo_1080p.mp4', b'codex4')
    return raiz, zp

def extrair_pacote(destino, garble=False):
    """Copia o pacote como o Windows extrairia; garble=True simula acentos lidos na página 850."""
    shutil.copytree(PKG, destino)
    if garble:
        for dirpath, dirnames, filenames in os.walk(destino, topdown=False):
            for n in filenames + dirnames:
                g = n.encode('utf-8').decode('cp850')
                if g != n:
                    os.rename(os.path.join(dirpath, n), os.path.join(dirpath, g))

def rodar(script_dir, *args, entrada=None):
    cmd = [PW, '-NoProfile', '-File', os.path.join(script_dir, 'organizar-marketing.ps1')] + list(args)
    r = subprocess.run(cmd, input=entrada, capture_output=True, text=True, timeout=600)
    return r.returncode, r.stdout + r.stderr

def arvore(raiz):
    out = []
    for dirpath, dirnames, filenames in os.walk(raiz):
        for f in filenames:
            out.append(os.path.relpath(os.path.join(dirpath, f), raiz))
    return sorted(out)

def ok(cond, msg):
    print(('  OK   ' if cond else '  FALHA ') + msg)
    if not cond:
        global falhas
        falhas += 1

falhas = 0
pacote_n = len(arvore(PKG))

# 1) Prévia com o pacote em Downloads: nada muda
print('1) Prévia (pacote em Downloads)')
raiz, zp = montar()
dl = os.path.join(SIM, 'Downloads', 'GL Academy - Marketing (Claude)')
extrair_pacote(dl)
antes = arvore(SIM)
code, out = rodar(os.path.join(dl, '00 - Comece aqui'), '-Previa', '-Raiz', raiz, '-ZipCodex', zp)
ok(code == 0, f'saiu com 0 (saiu com {code})')
ok(arvore(SIM) == antes, 'nada mudou no disco')
for trecho in ['Juntar pasta: LEADS', 'comerciais  ->  06 - Materiais da equipe/Comerciais', 'Aurora.lnk  ->  08 - Ferramentas e tutoriais/Aurora.lnk',
               'anotacoes soltas.txt  ->  99 - Para revisar', 'Copiar:       ' + zp, 'Extrair:', 'Prévia concluída']:
    ok(trecho in out, f'prévia mostra "{trecho}"')
ok('desktop.ini' not in out, 'desktop.ini fica fora')
print(out if falhas else '', end='')

# 2) Aplicar
print('2) Aplicar (pacote em Downloads)')
code, out = rodar(os.path.join(dl, '00 - Comece aqui'), '-Aplicar', '-Raiz', raiz, '-ZipCodex', zp)
ok(code == 0, f'saiu com 0 (saiu com {code})')
t = arvore(raiz)
esperado = [
  '02 - Vídeos (feitos pelo Claude)/01 - Vender o operacional (Reels e anúncios)/01 - A favor ou contra (9x16).mp4',
  '06 - Materiais da equipe/Comerciais/comercial antigo.mp4',
  '06 - Materiais da equipe/Vinhetas/igual (copia).mp4',
  '06 - Materiais da equipe/Depoimentos/joao.mp4',
  '06 - Materiais da equipe/Depoimentos de assinantes atuais/maria.mp4',
  '06 - Materiais da equipe/Fotos para postar (Giovane)/foto.jpg',
  '06 - Materiais da equipe/Imagens para usar/img.png',
  '06 - Materiais da equipe/Vídeos para usar no YouTube/yt.mp4',
  '06 - Materiais da equipe/Wallpaper e fundos/GL Academy Trading Fractal Wallpaper.mp4',
  '07 - Leads (dados pessoais, acesso restrito)/leads.xlsx',
  '07 - Leads (dados pessoais, acesso restrito)/sub/leads-antigos.csv',
  '07 - Leads (dados pessoais, acesso restrito)/LEIA-ME - dados pessoais (LGPD).txt',
  '08 - Ferramentas e tutoriais/Aurora.lnk',
  '08 - Ferramentas e tutoriais/tutorial_higgsfield_media_inference_workflow.md',
  '99 - Para revisar/anotacoes soltas.txt',
  '04 - Feito pelo Codex/Rodada 2026-09-30/GL_ACADEMY_VIDEOS_RODADA_2026-09-30 (feito pelo Codex).zip',
  '04 - Feito pelo Codex/Rodada 2026-09-30/Vídeos extraídos do ZIP/estudio/antes.mp4',
  '04 - Feito pelo Codex/Rodada 2026-09-30/Vídeos extraídos do ZIP/logo_1080p.mp4',
  '04 - Feito pelo Codex/LEIA-ME - vídeos feitos pelo CODEX.txt',
  '00 - Comece aqui/organizar-marketing.ps1', '00 - Comece aqui/Organizar a pasta de marketing.bat',
  '00 - Comece aqui/Inventário.txt', '00 - Comece aqui/Arquivos repetidos.txt', 'desktop.ini',
]
for e in esperado:
    ok(e in t, e)
ok(os.path.exists(zp), 'o ZIP original do Codex continua no lugar')
ok(any(x.startswith('00 - Comece aqui/Registro da organização') for x in t), 'registro gravado')
soltos = sorted(n for n in os.listdir(raiz))
ok(soltos == sorted(['00 - Comece aqui', '01 - Estratégia e planejamento', '02 - Vídeos (feitos pelo Claude)', '03 - Imagens (feitas pelo Claude)',
                     '04 - Feito pelo Codex', '05 - Roteiros, legendas e textos', '06 - Materiais da equipe', '07 - Leads (dados pessoais, acesso restrito)',
                     '08 - Ferramentas e tutoriais', '09 - Prints do operacional (base dos vídeos)', '99 - Para revisar', 'desktop.ini']), f'raiz limpa: {soltos}')
ok(sorted(os.listdir(dl)) == ['00 - Comece aqui'], f'no Downloads sobrou só o 00: {os.listdir(dl)}')
n_pkg_na_raiz = len([x for x in t if not x.startswith(('06 ', '07 - Leads (dados pessoais, acesso restrito)/l', '07 - Leads (dados pessoais, acesso restrito)/s', '08 - Ferramentas e tutoriais/A', '08 - Ferramentas e tutoriais/t', '99 - Para revisar/a', '04 - Feito pelo Codex/Rodada', 'desktop.ini', '00 - Comece aqui/Invent', '00 - Comece aqui/Arquivos', '00 - Comece aqui/Registro'))])
ok(n_pkg_na_raiz == pacote_n - 1, f'todos os arquivos do pacote chegaram ({n_pkg_na_raiz} de {pacote_n - 1} fora do 06/LEIA-ME)')
rep = open(os.path.join(raiz, '00 - Comece aqui', 'Arquivos repetidos.txt'), encoding='utf-8-sig').read()
ok('igual.mp4' in rep and 'igual (copia).mp4' in rep, 'relatório acha os arquivos repetidos da equipe')
ok(rep.count('Grupo ') == 1, f'só 1 grupo de repetidos ({rep.count("Grupo ")})')
inv = open(os.path.join(raiz, '00 - Comece aqui', 'Inventário.txt'), encoding='utf-8-sig').read()
ok('02 - Vídeos (feitos pelo Claude)  (' in inv, 'inventário com as pastas')
print(out if falhas else '', end='')

# 3) Rodar de novo, agora de dentro da pasta organizada: nada a fazer
print('3) Rodar de novo (idempotente)')
antes = arvore(raiz)
code, out = rodar(os.path.join(raiz, '00 - Comece aqui'), '-Aplicar', '-Raiz', raiz, '-ZipCodex', zp)
ok(code == 0, 'saiu com 0')
depois = arvore(raiz)
novos = [x for x in depois if x not in antes]
ok(all(x.startswith('00 - Comece aqui/Registro') for x in novos) and len(antes) <= len(depois), f'nada novo além do registro: {novos}')
ok('nada solto' in out and 'ZIP do Codex na pasta 04: ok' in out and 'já extraídos: ok' in out, 'mensagens de tudo no lugar')
ok('Mover:' not in out, 'nenhum movimento')

# 4) Pacote extraído dentro da própria pasta (subpasta), sem -Raiz: acha pelo nome
print('4) Pacote numa subpasta de "Marketing de trading", sem -Raiz')
raiz, zp = montar()
sub = os.path.join(raiz, 'GL Academy - Marketing (Claude)')
extrair_pacote(sub)
code, out = rodar(os.path.join(sub, '00 - Comece aqui'), '-Aplicar', '-ZipCodex', zp)
ok(code == 0, f'saiu com 0 ({code})')
t = arvore(raiz)
ok('02 - Vídeos (feitos pelo Claude)/05 - Educar - aulas rápidas/01 - O que é a VWAP (9x16).mp4' in t, 'vídeos na raiz')
ok(sorted(os.listdir(sub)) == ['00 - Comece aqui'], 'a subpasta ficou só com o 00')
ok(not os.path.exists(os.path.join(raiz, '99 - Para revisar', 'GL Academy - Marketing (Claude)')), 'a subpasta do pacote não foi para revisão')
rep = open(os.path.join(raiz, '00 - Comece aqui', 'Arquivos repetidos.txt'), encoding='utf-8-sig').read()
ok(rep.count('Grupo ') == 1, 'relatório ignora a cópia do 00 que ficou na subpasta')
print(out if falhas else '', end='')

# 5) Windows extraiu os acentos errado (UTF-8 lido como página 850)
print('5) Nomes com acento extraídos errado')
raiz, zp = montar()
dl = os.path.join(SIM, 'Downloads', 'GL Academy - Marketing (Claude)')
extrair_pacote(dl, garble=True)
ok(any('├' in n for n in os.listdir(dl)), 'simulação: nomes estragados (' + [n for n in os.listdir(dl) if '├' in n][0] + ')')
code, out = rodar(os.path.join(dl, '00 - Comece aqui'), '-Previa', '-Raiz', raiz, '-ZipCodex', zp)
ok('->  02 - Vídeos (feitos pelo Claude)' in out, 'prévia já mostra o nome certo')
code, out = rodar(os.path.join(dl, '00 - Comece aqui'), '-Aplicar', '-Raiz', raiz, '-ZipCodex', zp)
t = arvore(raiz)
ok('03 - Imagens (feitas pelo Claude)/01 - Carrosséis (Instagram 4x5)/Nem toda queda é venda/Slide 01.jpg' in t, 'nomes corrigidos e no lugar')
ok(not any(('├' in x or 'Ã' in x) for x in t), 'nenhum nome estragado sobrou')
ok('Corrigir nomes com acento' in out, 'avisou a correção')
print(out if falhas else '', end='')

# 6) Modo normal (dois cliques): prévia, pergunta; "n" não muda nada, "S" aplica
print('6) Pergunta antes de aplicar')
raiz, zp = montar()
dl = os.path.join(SIM, 'Downloads', 'GL Academy - Marketing (Claude)')
extrair_pacote(dl)
antes = arvore(SIM)
code, out = rodar(os.path.join(dl, '00 - Comece aqui'), '-Raiz', raiz, '-ZipCodex', zp, entrada='n\n')
ok(arvore(SIM) == antes and 'Nada foi alterado' in out, 'respondendo "n", nada muda')
code, out = rodar(os.path.join(dl, '00 - Comece aqui'), '-Raiz', raiz, '-ZipCodex', zp, entrada='S\n')
ok(os.path.exists(os.path.join(raiz, '02 - Vídeos (feitos pelo Claude)')) and 'Pronto:' in out, 'respondendo "S", organiza')
print(out if falhas else '', end='')

# 7) Conflito: arquivo com o mesmo nome e conteúdo diferente ganha " (2)"; idêntico fica onde está
print('7) Conflitos de nome')
raiz, zp = montar()
criar(os.path.join(raiz, '06 - Materiais da equipe', 'Comerciais', 'comercial antigo.mp4'), b'outro conteudo')
criar(os.path.join(raiz, '06 - Materiais da equipe', 'Comerciais', 'igual.mp4'), b'mesmo-conteudo-repetido')
dl = os.path.join(SIM, 'Downloads', 'GL Academy - Marketing (Claude)')
extrair_pacote(dl)
code, out = rodar(os.path.join(dl, '00 - Comece aqui'), '-Aplicar', '-Raiz', raiz, '-ZipCodex', zp)
t = arvore(raiz)
ok('06 - Materiais da equipe/Comerciais/comercial antigo (2).mp4' in t, 'diferente: ganhou (2)')
ok('99 - Para revisar/Cópias idênticas/igual.mp4' in t and '06 - Materiais da equipe/Comerciais/igual.mp4' in t, 'idêntico: a cópia foi para revisão, sem (2)')
ok(not os.path.exists(os.path.join(raiz, 'comerciais')), 'a pasta antiga vazia saiu da raiz')
ok('Já existe igual' in out, 'avisou o idêntico')
print(out if falhas else '', end='')

# 8) Sem o ZIP do Codex: avisa e segue
print('8) ZIP do Codex não encontrado')
raiz, zp = montar()
os.remove(zp)
dl = os.path.join(SIM, 'Downloads', 'GL Academy - Marketing (Claude)')
extrair_pacote(dl)
code, out = rodar(os.path.join(dl, '00 - Comece aqui'), '-Previa', '-Raiz', raiz, '-ZipCodex', zp)
ok(code == 0 and 'não achei o GL_ACADEMY_VIDEOS_RODADA_2026-09-30.zip' in out, 'avisa que não achou')

shutil.rmtree(TMP, ignore_errors=True)
print('\nfalhas:', falhas)
sys.exit(1 if falhas else 0)
