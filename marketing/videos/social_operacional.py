# Série "Operacional na prática" (Reels e Shorts): legenda do Instagram, título e descrição do YouTube Shorts
# e a data de cada episódio no calendário. Os episódios vêm de specs-social.js; o build_library.py usa as
# legendas nos cards da Biblioteca e o organizacao.py monta o calendário com o caminho de cada arquivo.
import datetime, json, os, subprocess

ROOT = os.path.dirname(os.path.abspath(__file__))
INICIO = datetime.date(2026, 10, 5)   # segunda-feira; um episódio por dia útil
HORARIO = '19:00'
AVISO = 'Exemplo educacional em replay, não é recomendação de investimento. Trading envolve risco financeiro real.'
GRUPO = ('operacional-social', 'Operacional na prática: Reels e Shorts',
         'Para postar no Instagram (Reels) e no YouTube (Shorts): um episódio por dia útil, às 19h, de 05/10 a 29/10, na ordem abaixo. '
         'Cada card tem o vídeo, a capa, a legenda do Instagram e o título e a descrição do YouTube. O post do dia também aparece no topo da página, em "Postar hoje".')
DIAS = ['seg', 'ter', 'qua', 'qui', 'sex', 'sáb', 'dom']

def _ponto(s):
    return s if s[-1:] in '.?!' else s + '.'

def hashtags(m):
    tags = ['#daytrade', '#trading', '#mercadofuturo', '#sp500', '#analisetecnica']
    if m['gamma']:
        tags.append('#gammaexposure')
    if 'NQ' in m['titulo']:
        tags.append('#nasdaq')
    return ' '.join(tags + ['#glacademy'])

def legenda(m):
    partes = [m['gancho'], '', _ponto(m['objetivo'])]
    if m['resumo']:
        partes += ['', 'O passo a passo:'] + [f'• {i}' for i in m['resumo']]
    convite = ('Pause no ponto de decisão e escreva nos comentários onde você entraria, antes de ver a resposta. ' if m['pausa'] else '')
    partes += ['', convite + 'Salve para estudar e siga para o próximo episódio.', '', 'Call 1x1 gratuita no link da bio.', '',
               AVISO + (' GL Gamma é uma assinatura à parte.' if m['gamma'] else ''), '', hashtags(m)]
    return '\n'.join(partes)

def titulo_shorts(m):
    t = f"{m['gancho']} | Operacional na prática, ep. {m['ep']}"
    return t if len(t) <= 100 else t[:97].rstrip() + '...'

def descricao_shorts(m):
    return legenda(m).rsplit('\n', 1)[0] + '\n#shorts ' + hashtags(m)

def datas(n):
    out, d = [], INICIO
    while len(out) < n:
        if d.weekday() < 5:
            out.append(d)
        d += datetime.timedelta(days=1)
    return out

def episodios():
    js = "const s=require('./specs-social.js');console.log(JSON.stringify(s.filter(x=>/^op\\d\\d-/.test(x.id)).map(x=>Object.assign({vid:x.id,dur:x.dur},x.meta))))"
    eps = json.loads(subprocess.run(['node', '-e', js], cwd=ROOT, capture_output=True, text=True, check=True).stdout)
    for e, d in zip(eps, datas(len(eps))):
        e.update(data=d, legenda=legenda(e), titulo_yt=titulo_shorts(e), descricao_yt=descricao_shorts(e),
                 titulo_card=f"Ep. {e['ep']} · {e['gancho']}")
    return eps

def grupo():
    """Entrada da Biblioteca (mesmo formato do GROUPS do build_library.py)."""
    itens = [(e['vid'], e['titulo_card'], _ponto(e['objetivo']), 'Reels e Shorts · série Operacional na prática', e['legenda']) for e in episodios()]
    return GRUPO + (itens,)

def quando(e):
    """Rótulo do dia de postagem: "seg, 05/10 · 19h"."""
    return f"{DIAS[e['data'].weekday()]}, {e['data'].strftime('%d/%m')} · {HORARIO[:2]}h"

def capa(vid):
    """Caminho da capa do episódio na Biblioteca."""
    return f'imagens/img-capas-operacional/capa-{vid}.jpg'

def dados_pagina():
    """O que o bloco "Postar hoje" da Biblioteca precisa de cada episódio."""
    return [{'vid': e['vid'], 'ep': e['ep'], 'data': e['data'].isoformat(), 'quando': quando(e), 'gancho': e['gancho'],
             'video': f"videos/{e['vid']}.mp4", 'capa': capa(e['vid']), 'legenda': e['legenda'],
             'titulo_yt': e['titulo_yt'], 'descricao_yt': e['descricao_yt']} for e in episodios()]
