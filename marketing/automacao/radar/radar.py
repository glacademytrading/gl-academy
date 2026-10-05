#!/usr/bin/env python3
# Radar de pauta da GL: lê os feeds de fontes.json (RSS 2.0 e Atom), junta as notícias das últimas horas, tira as
# repetidas, dá nota por pilar (IA, Mercado, Empresa, Vida) e grava um resumo em Markdown e em JSON.
# Só usa a biblioteca padrão do Python.
#
#   python3 radar.py                    # últimas 48 horas, saída em ./saida/
#   python3 radar.py --horas 24 --top 12
#   python3 radar.py --teste            # roda com os feeds de exemplo da pasta teste/, sem internet
#
# Roda no computador, num servidor ou numa automação (n8n, GitHub Actions). O ambiente em nuvem do Claude bloqueia
# esses sites hoje; lá a rotina da pauta usa a busca na web (rotina-pauta-diaria.md).
import argparse, datetime as dt, email.utils, html, json, os, re, sys, urllib.request
import xml.etree.ElementTree as ET

AQUI = os.path.dirname(os.path.abspath(__file__))
ATOM = '{http://www.w3.org/2005/Atom}'
UA = 'Mozilla/5.0 (GL-Radar; +https://glacademy)'


def texto(el):
    return html.unescape(re.sub(r'<[^>]+>', ' ', (el.text or '') if el is not None else '')).strip()


def data_de(s):
    if not s:
        return None
    s = s.strip()
    try:
        d = email.utils.parsedate_to_datetime(s)
    except (TypeError, ValueError):
        try:
            d = dt.datetime.fromisoformat(s.replace('Z', '+00:00'))
        except ValueError:
            return None
    if d.tzinfo is None:
        d = d.replace(tzinfo=dt.timezone.utc)
    return d.astimezone(dt.timezone.utc)


def ler_feed(xml_bytes, fonte):
    raiz = ET.fromstring(xml_bytes)
    itens = []
    for it in raiz.iter('item'):  # RSS 2.0
        itens.append(dict(titulo=texto(it.find('title')), link=(it.findtext('link') or '').strip(),
                          data=data_de(it.findtext('pubDate') or it.findtext('{http://purl.org/dc/elements/1.1/}date')),
                          resumo=texto(it.find('description'))[:400]))
    for it in raiz.iter(ATOM + 'entry'):  # Atom
        link = it.find(ATOM + 'link')
        itens.append(dict(titulo=texto(it.find(ATOM + 'title')), link=link.get('href', '') if link is not None else '',
                          data=data_de(it.findtext(ATOM + 'updated') or it.findtext(ATOM + 'published')),
                          resumo=texto(it.find(ATOM + 'summary') if it.find(ATOM + 'summary') is not None else it.find(ATOM + 'content'))[:400]))
    for i in itens:
        i['fonte'], i['oficial'] = fonte['nome'], bool(fonte.get('oficial'))
    return [i for i in itens if i['titulo'] and i['link']]


def baixar(url, tempo=15):
    req = urllib.request.Request(url, headers={'User-Agent': UA, 'Accept': 'application/rss+xml, application/atom+xml, application/xml, text/xml'})
    with urllib.request.urlopen(req, timeout=tempo) as r:
        return r.read()


def tokens(s):
    return set(re.findall(r'[a-zà-ú0-9]{3,}', s.lower()))


def parecidos(a, b):
    ta, tb = tokens(a), tokens(b)
    return bool(ta and tb) and len(ta & tb) / len(ta | tb) >= 0.6


def acha(p, s):
    # palavra curta (ia, ai, es, nq, cpi) só vale inteira; radical longo (empreend) vale dentro de outra palavra
    if len(p) <= 4:
        return re.search(r'(?<![a-zà-ú0-9])' + re.escape(p) + r'(?![a-zà-ú0-9])', s) is not None
    return p in s


def nota(item, palavras, agora, horas):
    t, r = item['titulo'].lower(), item['resumo'].lower()
    acertos = sum(3 for p in palavras if acha(p, t)) + sum(1 for p in palavras if acha(p, r))
    if not acertos:
        return 0
    idade = (agora - item['data']).total_seconds() / 3600 if item['data'] else horas
    frescor = max(0.0, 1 - idade / horas) * 3
    return round(acertos + frescor + (2 if item['oficial'] else 0) + (1 if 'brasil' in t + r else 0), 1)


def main():
    ap = argparse.ArgumentParser(description='Radar de pauta da GL')
    ap.add_argument('--horas', type=int, default=48)
    ap.add_argument('--top', type=int, default=10, help='notícias por pilar')
    ap.add_argument('--saida', default=os.path.join(AQUI, 'saida'))
    ap.add_argument('--teste', action='store_true', help='usa os feeds de exemplo da pasta teste/')
    a = ap.parse_args()

    fontes = json.load(open(os.path.join(AQUI, 'fontes.json'), encoding='utf-8'))
    agora = dt.datetime.now(dt.timezone.utc)
    if a.teste:
        agora = dt.datetime(2026, 10, 5, 12, 0, tzinfo=dt.timezone.utc)
    resultado, erros = {}, []
    for pilar, cfg in fontes['pilares'].items():
        noticias = []
        feeds = cfg['rss']
        if a.teste:
            feeds = [{'nome': f'Exemplo {n}', 'arquivo': os.path.join(AQUI, 'teste', n), 'oficial': n.startswith('oficial')}
                     for n in sorted(os.listdir(os.path.join(AQUI, 'teste'))) if n.endswith('.xml')]
        for f in feeds:
            try:
                dados = open(f['arquivo'], 'rb').read() if a.teste else baixar(f['url'])
                noticias += ler_feed(dados, f)
            except Exception as e:  # um feed fora do ar não para o radar
                erros.append(f"{f['nome']}: {type(e).__name__}: {e}")
        recentes = [n for n in noticias if n['data'] is None or (agora - n['data']).total_seconds() <= a.horas * 3600]
        pontuadas = []
        for n in recentes:
            n['nota'] = nota(n, cfg['palavras'], agora, a.horas)
            if n['nota'] > 0:
                pontuadas.append(n)
        pontuadas.sort(key=lambda n: -n['nota'])
        unicas = []
        for n in pontuadas:
            if not any(n['link'] == u['link'] or parecidos(n['titulo'], u['titulo']) for u in unicas):
                unicas.append(n)
        resultado[pilar] = unicas[:a.top]

    os.makedirs(a.saida, exist_ok=True)
    dia = agora.astimezone(dt.timezone(dt.timedelta(hours=-3))).strftime('%Y-%m-%d')
    linhas = [f'# Radar GL · {dia}', '', f'Notícias das últimas {a.horas} horas, por pilar, da maior nota para a menor. '
              'Confira sempre na fonte original antes de gravar.', '']
    for pilar, ns in resultado.items():
        linhas += [f'## {pilar}', '']
        if not ns:
            linhas += ['Nada relevante nos feeds. Use as buscas de fontes.json ou o banco de ideias.', '']
        for n in ns:
            quando = n['data'].astimezone(dt.timezone(dt.timedelta(hours=-3))).strftime('%d/%m %H:%M') if n['data'] else 'sem data'
            linhas.append(f"- **{n['titulo']}** ({n['fonte']}{', oficial' if n['oficial'] else ''}, {quando}, nota {n['nota']}): {n['link']}")
        linhas.append('')
    if erros:
        linhas += ['## Feeds que falharam', ''] + [f'- {e}' for e in erros] + ['']
    md = os.path.join(a.saida, f'radar-{dia}.md')
    open(md, 'w', encoding='utf-8').write('\n'.join(linhas))
    js = os.path.join(a.saida, f'radar-{dia}.json')
    json.dump({p: [{**n, 'data': n['data'].isoformat() if n['data'] else None} for n in ns] for p, ns in resultado.items()},
              open(js, 'w', encoding='utf-8'), ensure_ascii=False, indent=2)
    print(f"radar {dia}: " + ', '.join(f'{p} {len(ns)}' for p, ns in resultado.items()) + f"; {len(erros)} feeds com erro -> {md}")
    return 0


if __name__ == '__main__':
    sys.exit(main())
