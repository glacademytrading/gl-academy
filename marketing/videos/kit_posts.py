# Kit de carrosséis e stories (página irmã da Biblioteca): os carrosséis e os stories da série "Operacional na prática",
# as peças de conversão (dúvidas antes da call, como funciona a call) e as capas de destaque, com o dia de postar,
# as legendas, as opções da enquete e o ZIP organizado nas mesmas pastas do pacote da Biblioteca.
# As imagens saem do posts.js (specs-posts.js); o build_library.py chama este script no fim.
# Também grava ../execucao/calendario-carrosseis-e-stories.csv.
import datetime, html, json, os, re, shutil, subprocess

ROOT = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(ROOT, 'out')
KIT = os.path.join(ROOT, 'posts')
MKT = os.environ.get('GL_MARKETING') or os.path.dirname(ROOT)
BIBLIOTECA = 'https://claude.ai/artifact/BgpMsKZZn2BikAYBcXSDfm'
NOME_ZIP = 'GL Academy - Carrosséis e stories (Claude).zip'
RAIZ = '03 - Imagens (feitas pelo Claude)'   # mesmas pastas do pacote da Biblioteca
SERIE_DIR = RAIZ + '/10 - Série - carrosséis e stories'
BASE_WIN = r'C:\Users\Giovane Lazaro\Desktop\Arquivos e Programas\GL Academy organização\Trading\Marketing de trading' + '\\'
HORA = '12:00'
AVISO = 'Exemplo educacional em replay, não é recomendação de investimento. Trading envolve risco financeiro real.'
DIAS = ['seg', 'ter', 'qua', 'qui', 'sex', 'sáb', 'dom']
esc = lambda s: html.escape(str(s), quote=True)

import social_operacional as SO

def limpar(nome):
    nome = nome.replace('·', '-').replace(':', ' -').replace('/', '-').replace('\\', '-')
    nome = re.sub(r'[?*"<>|]', '', nome)
    return re.sub(r'\s+', ' ', nome).strip(' .-')

def pasta_ep(e):
    t = limpar(e['gancho'])
    if len(t) > 34:
        t = t[:34].rsplit(' ', 1)[0].rstrip(' ,.-')
    return f"Ep {e['ep']:02d} - {t}"

def meta():
    js = "const s=require('./specs-posts.js');console.log(JSON.stringify(s.META))"
    return json.loads(subprocess.run(['node', '-e', js], cwd=ROOT, capture_output=True, text=True, check=True).stdout)

def quando(d, hora=HORA):
    return f"{DIAS[d.weekday()]}, {d.strftime('%d/%m')} · {hora[:2]}h"

def legenda_carrossel(e):
    partes = [f"{e['gancho']} (Ep. {e['ep']} da série Operacional na prática, em carrossel)", '', SO._ponto(e['objetivo'])]
    if e['pausa']:
        partes += ['', 'Arraste e pare no slide da pergunta: onde você entraria? Comente antes de ver a resposta.']
    if e['resumo']:
        partes += ['', 'O passo a passo:'] + [f'• {i}' for i in e['resumo']]
    partes += ['', 'Salve para estudar. O episódio em vídeo está no perfil.', 'Call 1x1 gratuita no link da bio.', '',
               AVISO + (' GL Gamma é uma assinatura à parte.' if e['gamma'] else ''), '', SO.hashtags(e)]
    return '\n'.join(partes)

LEG_DUVIDAS = '\n'.join([
    '4 dúvidas que a gente mais ouve antes da call 1x1 gratuita:', '',
    '1. Funciona na minha plataforma? Funciona no TradingView e no NinjaTrader, com o mesmo mapa nas duas.',
    '2. É só mais um indicador? É um mapa: contexto, valor do dia, da semana e do mês e alvos no mesmo gráfico.',
    '3. Preciso entender de opções? Não. O GL Gamma, uma assinatura à parte, traz os níveis das opções para o seu gráfico de futuros.',
    '4. Não sei por onde começar? Comece pela call: conte o seu momento no mercado e a equipe GL mostra o próximo passo.', '',
    'Ficou outra dúvida? Pergunte aqui nos comentários.', 'Call 1x1 gratuita no link da bio.', '',
    'Conteúdo educacional. Trading envolve risco financeiro real. Alvos são projeções, não promessa de resultado.', '',
    '#daytrade #trading #mercadofuturo #glacademy'])
LEG_CALL = '\n'.join([
    'Como funciona a call 1x1 gratuita da GL Academy:', '',
    '1. Você agenda pelo link da bio e a confirmação chega no WhatsApp.',
    '2. Uma conversa um a um com a equipe GL sobre o seu momento no mercado.',
    '3. Você vê o GL Model no gráfico do ativo que você opera.',
    '4. A equipe indica o próximo passo. A decisão é sua.', '',
    'Agende pelo link da bio.', '', 'Conteúdo educacional. Trading envolve risco financeiro real.', '',
    '#daytrade #trading #glacademy'])

def montar():
    M = meta()
    eps = {e['vid']: e for e in SO.episodios()}
    os.makedirs(KIT, exist_ok=True)
    arquivos, textos, agenda, episodios = [], [], [], []

    def copiar(src, rel):
        dst = os.path.join(KIT, rel); os.makedirs(os.path.dirname(dst), exist_ok=True)
        if not os.path.exists(dst) or os.path.getmtime(dst) < os.path.getmtime(src) or os.path.getsize(dst) != os.path.getsize(src):
            shutil.copy2(src, dst)
        return rel

    for m in M['episodios']:
        e = eps[m['vid']]
        g = m['carrossel']
        slides = [copiar(os.path.join(OUT, 'posts', g, sid + '.jpg'), f'img/{g}/{sid}.jpg') for sid in m['slides']]
        enq = copiar(os.path.join(OUT, 'posts', 'st-serie', m['enquete'] + '.jpg'), f"img/stories/{m['enquete']}.jpg")
        res = copiar(os.path.join(OUT, 'posts', 'st-serie', m['resposta'] + '.jpg'), f"img/stories/{m['resposta']}.jpg")
        d = e['data']
        d_res, d_car = d + datetime.timedelta(days=1), d + datetime.timedelta(days=7)
        leg = legenda_carrossel(e)
        st = m['stories']
        pasta = f"{SERIE_DIR}/{pasta_ep(e)}"
        for k, s in enumerate(slides, 1):
            arquivos.append({'p': s, 'z': f'{pasta}/Carrossel - slide {k:02d}.jpg'})
        arquivos.append({'p': enq, 'z': f'{pasta}/Story 1 - enquete.jpg'})
        arquivos.append({'p': res, 'z': f'{pasta}/Story 2 - resposta.jpg'})
        como = (f"EP. {e['ep']} - {e['gancho']}\n\n"
                f"STORY 1 - ENQUETE: {quando(d)} (o Reels sai às 19h)\nAdicione a figurinha Enquete no espaço tracejado.\nPergunta: {st['q']}\n"
                + '\n'.join(f'Opção {i + 1}: {o}' for i, o in enumerate(st['opcoes'])) +
                f"\n\nSTORY 2 - RESPOSTA: {quando(d_res)}\n{st['titulo']}. {st['texto']}\nAdicione a figurinha Link no espaço tracejado, com o link do Reels do episódio.\n\n"
                f"CARROSSEL: {quando(d_car)} ({len(slides)} slides, na ordem)\nLegenda:\n\n{leg}\n")
        textos.append({'z': f'{pasta}/Como postar.txt', 't': como})
        episodios.append({'vid': m['vid'], 'ep': e['ep'], 'gancho': e['gancho'], 'objetivo': SO._ponto(e['objetivo']), 'gamma': e['gamma'],
                          'reels': SO.quando(e), 'slides': slides, 'legenda': leg, 'enquete': enq, 'resposta': res, 'stories': st,
                          'q_enq': quando(d), 'q_res': quando(d_res), 'q_car': quando(d_car)})
        agenda += [
            {'data': d.isoformat(), 'hora': HORA, 'ep': e['ep'], 'tipo': 'enquete', 'titulo': f"Story · enquete do Ep. {e['ep']}", 'img': enq, 'vid': m['vid']},
            {'data': d_res.isoformat(), 'hora': HORA, 'ep': e['ep'], 'tipo': 'resposta', 'titulo': f"Story · resposta do Ep. {e['ep']}", 'img': res, 'vid': m['vid']},
            {'data': d_car.isoformat(), 'hora': HORA, 'ep': e['ep'], 'tipo': 'carrossel', 'titulo': f"Carrossel do Ep. {e['ep']}", 'img': slides[0], 'vid': m['vid']}]
    agenda.sort(key=lambda a: (a['data'], {'lancamento': -1, 'resposta': 0, 'enquete': 1, 'carrossel': 2}[a['tipo']]))

    # peças de conversão e extras
    X = M['extras']
    car_d = [copiar(os.path.join(OUT, 'posts', 'car-duvidas', i + '.jpg'), f'img/car-duvidas/{i}.jpg') for i in X['duvidas']]
    car_c = [copiar(os.path.join(OUT, 'posts', 'car-call', i + '.jpg'), f'img/car-call/{i}.jpg') for i in X['call']]
    st_d = [dict(d, img=copiar(os.path.join(OUT, 'posts', 'st-duvidas', d['id'] + '.jpg'), f"img/stories/{d['id']}.jpg")) for d in M['duvidas']]
    lanc = [copiar(os.path.join(OUT, 'posts', 'st-extras', i + '.jpg'), f'img/stories/{i}.jpg') for i in X['lancamento']]
    dest = [copiar(os.path.join(OUT, 'imagens', 'destaques', f'destaque-{k}.jpg'), f'img/destaques/destaque-{k}.jpg') for k in ('serie', 'duvidas')]
    C = RAIZ + '/01 - Carrosséis (Instagram 4x5)'
    arquivos += [{'p': p, 'z': f'{C}/Dúvidas antes da call/Slide {k:02d}.jpg'} for k, p in enumerate(car_d, 1)]
    arquivos += [{'p': p, 'z': f'{C}/Como funciona a call 1x1/Slide {k:02d}.jpg'} for k, p in enumerate(car_c, 1)]
    textos += [{'z': f'{C}/Dúvidas antes da call/Legenda.txt', 't': LEG_DUVIDAS}, {'z': f'{C}/Como funciona a call 1x1/Legenda.txt', 't': LEG_CALL}]
    ST = RAIZ + '/04 - Stories (9x16)'
    arquivos += [{'p': d['img'], 'z': f"{ST}/Dúvida {k} - {limpar(d['pergunta'])}.jpg"} for k, d in enumerate(st_d, 1)]
    arquivos += [{'p': lanc[0], 'z': f'{ST}/Série - amanhã às 19h.jpg'}, {'p': lanc[1], 'z': f'{ST}/Série - hoje às 19h.jpg'}]
    vespera = SO.INICIO - datetime.timedelta(days=1)
    agenda.insert(0, {'data': vespera.isoformat(), 'hora': '20:00', 'ep': 1, 'tipo': 'lancamento', 'titulo': 'Story · a série começa amanhã', 'img': lanc[0], 'vid': M['episodios'][0]['vid']})
    D = RAIZ + '/06 - Capas de destaques (círculo do perfil)'
    arquivos += [{'p': dest[0], 'z': f'{D}/0 - Série.jpg'}, {'p': dest[1], 'z': f'{D}/7 - Dúvidas.jpg'}]

    # calendário (planilha) dos stories e carrosséis da série
    linhas = [['Data', 'Dia', 'Horário', 'Episódio', 'Peça', 'Arquivo (no ZIP do kit)', 'Figurinha', 'Texto da figurinha', 'Legenda']]
    porvid = {x['vid']: x for x in episodios}
    for a in agenda:
        x, d = porvid[a['vid']], datetime.date.fromisoformat(a['data'])
        pasta = pasta_ep(x)
        if a['tipo'] == 'lancamento':
            linha = ['Story - a série começa amanhã', '04 - Stories (9x16)/Série - amanhã às 19h.jpg', 'Lembrete', 'Lembrete para o Ep. 1, amanhã às 19h', '']
        elif a['tipo'] == 'enquete':
            linha = ['Story 1 - enquete', f'{pasta}/Story 1 - enquete.jpg', 'Enquete', x['stories']['q'] + ' | ' + ' / '.join(x['stories']['opcoes']), '']
        elif a['tipo'] == 'resposta':
            linha = ['Story 2 - resposta', f'{pasta}/Story 2 - resposta.jpg', 'Link', 'Link do Reels do episódio', '']
        else:
            linha = [f"Carrossel ({len(x['slides'])} slides)", f'{pasta}/Carrossel - slide 01 a {len(x["slides"]):02d}.jpg', '', '', x['legenda']]
        linhas.append([d.strftime('%d/%m'), DIAS[d.weekday()], a['hora'], f"Ep. {x['ep']} · {x['gancho']}"] + linha)
    csv = '\n'.join(';'.join('"' + str(c).replace('"', '""') + '"' for c in l) for l in linhas)
    textos.append({'z': SERIE_DIR + '/Calendário dos stories e carrosséis (abre no Excel).csv', 't': '\ufeff' + csv})
    textos.append({'z': SERIE_DIR + '/LEIA-ME.txt', 't': LEIA_ME})
    for dst in (os.path.join(KIT, 'calendario-carrosseis-e-stories.csv'), os.path.join(MKT, 'execucao', 'calendario-carrosseis-e-stories.csv')):
        if os.path.isdir(os.path.dirname(dst)):
            open(dst, 'w', encoding='utf-8-sig', newline='').write(csv.replace('\n', '\r\n'))

    maior = max((x['z'] for x in arquivos + textos), key=len)
    assert len(BASE_WIN) + len(maior) <= 240, (len(BASE_WIN) + len(maior), maior)
    extras = {'car_duvidas': car_d, 'car_call': car_c, 'leg_duvidas': LEG_DUVIDAS, 'leg_call': LEG_CALL, 'st_duvidas': st_d, 'lancamento': lanc, 'destaques': dest}
    return episodios, agenda, extras, arquivos, textos, len(BASE_WIN) + len(maior)

LEIA_ME = '''SÉRIE OPERACIONAL NA PRÁTICA: CARROSSÉIS E STORIES

Uma pasta por episódio, com:
- Carrossel - slides 01 em diante: poste todos, na ordem, como um carrossel do Instagram (4:5).
- Story 1 - enquete: no dia do episódio, às 12h. Coloque a figurinha Enquete no espaço tracejado com as opções do arquivo "Como postar".
- Story 2 - resposta: no dia seguinte, às 12h. Coloque a figurinha Link no espaço tracejado com o link do Reels do episódio.
- Como postar: datas, pergunta e opções da enquete e a legenda do carrossel.

Ritmo: Reels e Shorts às 19h nos dias úteis (vídeos na Biblioteca), enquete às 12h no mesmo dia, resposta às 12h do dia seguinte
e o carrossel uma semana depois do Reels, às 12h. A planilha "Calendário dos stories e carrosséis" tem tudo em ordem de data.
Guarde os stories da série no destaque "Série" (capa em 06 - Capas de destaques).

Exemplos educacionais em replay. Não é recomendação de investimento. Trading envolve risco financeiro real.
'''

def img(src, alt):
    return f'<img src="{esc(src)}" alt="{esc(alt)}" loading="lazy" decoding="async">'

def html_episodio(x):
    n = x['ep']
    slides = ''.join('<li>' + img(s, f'Slide {k} do carrossel do Ep. {n}') + '</li>' for k, s in enumerate(x['slides'], 1))
    st = x['stories']
    ops = ' / '.join(st['opcoes'])
    cid = x['vid'][:4]
    gamma = '<span class="pill">GL Gamma: assinatura à parte</span>' if x['gamma'] else ''
    return f'''<article class="ep" id="{cid}">
  <header class="ep-head"><p class="ep-n">Ep. {x['ep']}</p><div class="ep-tit"><h3>{esc(x['gancho'])}</h3><p>{esc(x['objetivo'])}</p></div>
    <dl class="datas"><div><dt>Reels</dt><dd>{esc(x['reels'])}</dd></div><div><dt>Enquete</dt><dd>{esc(x['q_enq'])}</dd></div><div><dt>Resposta</dt><dd>{esc(x['q_res'])}</dd></div><div><dt>Carrossel</dt><dd>{esc(x['q_car'])}</dd></div></dl></header>
  <div class="ep-body">
    <section class="bloco" aria-label="Carrossel"><div class="bloco-top"><h4>Carrossel · {len(x['slides'])} slides</h4>{gamma}</div>
      <ul class="tira">{slides}</ul>
      <div class="acoes"><button type="button" class="btn ouro" data-zipep="{cid}">Baixar o carrossel (ZIP)</button><button type="button" class="btn" data-copy="leg-{cid}" data-label="Copiar a legenda" data-done="Legenda copiada">Copiar a legenda</button></div>
      <details><summary>Ver a legenda</summary><pre id="leg-{cid}">{esc(x['legenda'])}</pre></details></section>
    <section class="bloco stories" aria-label="Stories"><h4>Stories</h4>
      <div class="par">
        <figure>{img(x['enquete'], f"Story de enquete do Ep. {x['ep']}")}<figcaption><span><b>1 · Enquete</b> · {esc(x['q_enq'])}</span><span>Figurinha <b>Enquete</b>: {esc(ops)}</span><span hidden id="op-{cid}">{esc(chr(10).join(st['opcoes']))}</span>
          <span class="acoes"><button type="button" class="btn mini" data-dl="{esc(x['enquete'])}">Baixar</button><button type="button" class="btn mini" data-copy="op-{cid}" data-label="Copiar as opções" data-done="Opções copiadas">Copiar as opções</button></span></figcaption></figure>
        <figure>{img(x['resposta'], f"Story de resposta do Ep. {x['ep']}")}<figcaption><span><b>2 · Resposta</b> · {esc(x['q_res'])}</span><span>Figurinha <b>Link</b>: o Reels do episódio</span>
          <span class="acoes"><button type="button" class="btn mini" data-dl="{esc(x['resposta'])}">Baixar</button></span></figcaption></figure>
      </div></section>
  </div>
</article>'''

def gerar():
    episodios, agenda, X, arquivos, textos, maior = montar()
    tpl = open(os.path.join(KIT, 'template.html'), encoding='utf-8').read()
    eps_html = '\n'.join(html_episodio(x) for x in episodios)
    porvid = {x['vid']: x for x in episodios}
    dados_hoje = [dict(a, ep_tit=porvid[a['vid']]['gancho'], legenda=porvid[a['vid']]['legenda'] if a['tipo'] == 'carrossel' else '',
                       opcoes=porvid[a['vid']]['stories']['opcoes'] if a['tipo'] == 'enquete' else [], q=porvid[a['vid']]['stories']['q'],
                       slides=len(porvid[a['vid']]['slides']), quando=quando(datetime.date.fromisoformat(a['data']))) for a in agenda]
    zipeps = {x['vid'][:4]: [a for a in arquivos if a['p'] in x['slides']] for x in episodios}
    tira = lambda ps, alt: ''.join(f'<li>{img(p, f"{alt} {k}")}</li>' for k, p in enumerate(ps, 1))
    duv = ''.join(f'<figure>{img(d["img"], d["pergunta"])}<figcaption><b>{esc(d["pergunta"])}</b><button type="button" class="btn mini" data-dl="{esc(d["img"])}">Baixar</button></figcaption></figure>' for d in X['st_duvidas'])
    lanc = ''.join(f'<figure>{img(p, t)}<figcaption><b>{t}</b><button type="button" class="btn mini" data-dl="{esc(p)}">Baixar</button></figcaption></figure>'
                   for p, t in zip(X['lancamento'], ['Hoje à noite: “amanhã, 19h”', 'Qualquer dia de episódio: “hoje, 19h”']))
    dest = ''.join(f'<figure class="dest">{img(p, t)}<figcaption><b>{t}</b><button type="button" class="btn mini" data-dl="{esc(p)}">Baixar</button></figcaption></figure>'
                   for p, t in zip(X['destaques'], ['Destaque Série', 'Destaque Dúvidas']))
    zipx = {'duvidas': [a for a in arquivos if a['p'] in X['car_duvidas']], 'call': [a for a in arquivos if a['p'] in X['car_call']]}
    total_img = len({a['p'] for a in arquivos})
    rep = {
      '<!--N-IMG-->': str(total_img), '<!--N-EPS-->': str(len(episodios)),
      '<!--EPISODIOS-->': eps_html,
      '<!--TIRA-DUVIDAS-->': tira(X['car_duvidas'], 'Slide do carrossel de dúvidas'), '<!--LEG-DUVIDAS-->': esc(X['leg_duvidas']),
      '<!--TIRA-CALL-->': tira(X['car_call'], 'Slide do carrossel da call'), '<!--LEG-CALL-->': esc(X['leg_call']),
      '<!--ST-DUVIDAS-->': duv, '<!--LANCAMENTO-->': lanc, '<!--DESTAQUES-->': dest, '<!--BIBLIOTECA-->': BIBLIOTECA,
      '<!--DADOS-->': json.dumps({'agenda': dados_hoje, 'zip': {'nome': NOME_ZIP, 'arquivos': arquivos, 'textos': textos}, 'zipeps': zipeps, 'zipx': zipx},
                                 ensure_ascii=False).replace('</', '<' + chr(92) + '/'),
    }
    for k, v in rep.items():
        tpl = tpl.replace(k, v)
    open(os.path.join(KIT, 'index.html'), 'w', encoding='utf-8').write(tpl)
    tam = sum(os.path.getsize(os.path.join(KIT, a)) for a in {x['p'] for x in arquivos})
    print(f'kit de carrosséis e stories: {total_img} imagens ({tam / 1048576:.0f} MB), {len(agenda)} posts no calendário; maior caminho no Windows: {maior} caracteres')

if __name__ == '__main__':
    gerar()
