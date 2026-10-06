# O topo e a organização da Biblioteca: "Comece por aqui" (o post do dia e o que fazer agora), o guia de cada tipo de
# vídeo (o que é, onde usar, quando, quantos estão prontos e o que ainda não fazemos), as partes por objetivo e a seção
# da Mentoria de Order Flow. O build_library.py chama estas funções na hora de montar a página.
import html, json, re

esc = lambda s: html.escape(str(s), quote=True)
KIT = 'https://claude.ai/artifact/AVHWWSnHp4TPyVGiCm2tsp'   # Carrosséis e Stories GL (página irmã, kit_posts.py)
RISK = 'https://claude.ai/artifact/YGFyAnt64pTYPbqzFsjhr1'   # Campanha GL Risk Auto (página irmã, kit_risk.py)
LEITURA = 'https://claude.ai/artifact/NuHzDmSDSH5JngXwXxCEkW'   # Leitura de Mercado GL (página irmã, leitura_mercado.py)
# tipos que ficam na página de carrosséis e stories: (link, o que mostrar em "Prontos")
EXTERNOS = {'kit-serie': (KIT + '#serie', '<b>19</b> carrosséis e <b>38</b> stories'), 'kit-conv': (KIT + '#converter', '<b>2</b> carrosséis e <b>4</b> stories'),
            'risk-auto': (RISK + '#hoje', '<b>43</b> vídeos e <b>98</b> imagens'),
            'leitura': (LEITURA, '<b>8</b> vídeos (rodada de 06/10)')}

# ---------------------------------------------------------------------------
# As partes da página, na ordem do funil. Cada grupo da Biblioteca entra numa parte só.
PARTES = [
  ('atrair', 'Atrair e ensinar', 'Conteúdo orgânico que traz seguidor novo e mostra como o operacional funciona de verdade. É o que se posta todo dia.',
   ['operacional-social', 'kit-serie', 'orderflow', 'aulas', 'operacional', 'leitura', 'coringas', 'horizontais']),
  ('vender', 'Anunciar e vender', 'Para os anúncios e os posts de venda: cada vídeo prova uma coisa que a tecnologia GL faz e chama para a call 1x1.',
   ['vendem', 'risk-auto', 'ganchos', 'feed', 'comerciais', 'objecoes']),
  ('converter', 'Converter e cuidar de quem chegou', 'Depois do agendamento e depois da compra: a pessoa aparece na call, o aluno aprende e a comunidade recebe bem.',
   ['kit-conv', 'vendas-whats', 'mentoria', 'comunidade']),
  ('canais', 'Lives, YouTube, site e marca', 'As peças fixas de cada canal: telas e sobreposições de live, trailer e tela final do YouTube, loops do site e a vinheta.',
   ['lives', 'live2', 'youtube', 'marca', 'site']),
]

# O guia: o trabalho de cada tipo de vídeo (nome, o que é, onde usar, quando)
GUIA = {
  'operacional-social': ('Série Operacional na prática', 'Episódios 9:16 que ensinam o operacional passo a passo, com a pergunta para os comentários.',
                         'Instagram Reels e YouTube Shorts', 'Um por dia útil, às 19h (de 05/10 a 29/10)'),
  'kit-serie': ('Carrosséis e stories da série', 'Um carrossel por episódio e o par de stories: a enquete no ponto de decisão e a resposta no dia seguinte.',
                'Feed e stories do Instagram', 'Enquete às 12h do dia do episódio, resposta às 12h do dia seguinte e o carrossel uma semana depois'),
  'risk-auto': ('Campanha GL Risk Auto', 'Vídeos, anúncios do YouTube, as aulas 20 e 21 da Mentoria, os tutoriais, carrosséis e stories do GL Risk Auto, com o plano, o calendário, os textos dos anúncios e os roteiros para gravar.',
                'Reels, Shorts, TikTok, YouTube, feed e anúncios', 'Fins de semana às 19h até 01/11; depois, também nos dias úteis'),
  'kit-conv': ('Dúvidas antes da call e como funciona a call', 'Dois carrosséis e quatro stories que respondem às dúvidas de quem ainda não agendou.',
               'Feed (fixados no perfil) e destaque "Dúvidas"', 'Uma vez, e fixar no perfil'),
  'orderflow': ('Série de Order Flow (Deep DOM)', 'Os trechos da mentoria de Order Flow, explicados para quem nunca viu um book.',
                'Reels, Shorts e aulas para os alunos', 'Depois que chegarem os prints'),
  'aulas': ('Aulas rápidas', 'Um conceito em 15 segundos (VWAP, Value Area) com o gráfico real.', 'Reels, Shorts e TikTok', 'Uma por semana'),
  'operacional': ('Operacional por dentro', 'O gráfico se construindo e cada parte do operacional destacada: painel, alvos, VWAPs e Gamma.',
                  'Reels, Shorts e anúncios', 'Uma por semana, alternando com a série'),
  'leitura': ('Leitura de mercado', 'Os prints novos do dia viram vídeos de leitura de mercado: o gráfico real, o painel e a lição. A Biblioteca chegou ao limite de tamanho, então as rodadas novas ficam na página Leitura de Mercado GL.',
              'Reels, Shorts, TikTok, feed (4:5) e YouTube (16:9)', 'Na semana dos prints, enquanto o assunto está fresco'),
  'coringas': ('Coringas verticais', 'O movimento do setup sem texto, para pôr narração, música ou um gancho por cima.', 'Reels, Shorts e TikTok',
               'Quando quiser postar algo novo sem esperar vídeo pronto'),
  'horizontais': ('Coringas horizontais', 'O mesmo movimento, em 16:9.', 'YouTube, VSL, boas-vindas do funil e trechos de live', 'Na edição de vídeos longos'),
  'vendem': ('Vídeos que vendem o operacional', 'Cada um prova uma coisa que o GL Model faz, com o print real, e termina na call 1x1.',
             'Reels e anúncios', 'Dois ou três por semana no orgânico e sempre nos anúncios'),
  'ganchos': ('Variações de gancho', 'O mesmo vídeo com outra primeira frase, para testar qual segura mais.', 'Anúncios (teste lado a lado)',
              'No teste de anúncios: fica a versão que mais retém nos 3 primeiros segundos'),
  'feed': ('Versões 4:5', 'Os vídeos de venda sem corte para o feed.', 'Feed do Instagram e do Facebook e anúncios de feed', 'Sempre que o vídeo for para o feed'),
  'comerciais': ('Comerciais das tecnologias', 'Todas as tecnologias GL em 40 segundos, terminando na call.', 'YouTube, intervalo das lives e anúncios',
                 'No lançamento de campanha e no intervalo das lives'),
  'objecoes': ('Respostas às objeções', 'Cada vídeo responde uma dúvida de quem viu a GL e não agendou.', 'Remarketing (anúncio para quem visitou o funil)', 'Sempre ligado'),
  'vendas-whats': ('Sequência da call no WhatsApp', 'Confirmação, lembrete 1 hora antes e convite para remarcar.', 'WhatsApp, para quem agendou', 'Em todo agendamento'),
  'mentoria': ('Mentoria GL (aulas)', 'As aulas 16:9 do operacional para os alunos, com o plano para o GL OS e o ZIP completo.',
               'Área do aluno, APP ou YouTube não listado', 'Nos 8 encontros da Mentoria 1:1, depois que Giovane validar as regras'),
  'comunidade': ('Comunidade e parceiros', 'Boas-vindas da comunidade e a cartela de parceiro.', 'Grupo do WhatsApp e vídeos dos parceiros',
                 'Na entrada de cada pessoa e em cada parceria'),
  'lives': ('Telas de live', 'Abertura, encerramento e telas de espera em loop.', 'OBS, nas lives', 'Em toda live'),
  'live2': ('Kit de live 2.0', 'Sobreposições transparentes e contagem regressiva.', 'OBS, por cima da câmera', 'Em toda live'),
  'youtube': ('YouTube', 'Trailer do canal e tela final.', 'Página do canal e fim dos vídeos longos', 'Uma vez (trailer) e em todo vídeo longo (tela final)'),
  'marca': ('Logo e vinheta', 'O emblema GL em partículas: logo de 8 s e vinheta de 4 s.', 'Abertura do YouTube e das lives; fim dos Reels',
            'Em todo vídeo longo e no fim dos Reels'),
  'site': ('Kit do site', 'Loops leves para as páginas do site.', 'Site novo (com o Codex)', 'Uma vez, na montagem do site'),
}

# O que ainda não fazemos: (título, por que importa, o que precisa, quem, âncora)
LACUNAS = [
  ('Vídeos com Giovane falando', 'Rosto e voz geram a confiança que o gráfico sozinho não gera. É o formato que mais converte em call.',
   'Gravar no celular os 6 roteiros que já estão prontos (30 a 45 segundos cada) e os 6 do GL Risk Auto. Eu edito com legenda, cortes dos setups e o logo.', 'giovane', 'roteiros'),
  ('Depoimentos de alunos', 'Prova social do processo (a rotina, a disciplina, a leitura), nunca de lucro.',
   'Pedir aos alunos com o modelo e a autorização de uso que estão em "Roteiros para gravar".', 'equipe', 'roteiros'),
  ('Série de Order Flow', 'Mostra que a GL opera e ensina no book, com a mesma clareza da série do operacional.',
   'Os prints dos trechos da gravação, começando pelos 8 da lista.', 'giovane', 'orderflow'),
  ('O trade que deu errado e o dia de ficar de fora', 'Transparência: todas as aulas de hoje terminam no alvo. Mostrar o stop e a decisão de não operar dá credibilidade.',
   'Os prints da lista "prints que faltam" da mentoria (stop, ficar de fora, painel em baixa, gestão do trade).', 'giovane', 'mentoria'),
  ('Cortes das lives', 'Os melhores 30 a 60 segundos de cada live viram Reels e Shorts sem gravar nada novo.',
   'A gravação de cada live (o arquivo do OBS ou o link do YouTube).', 'equipe', 'lives'),
  ('Vídeos longos no YouTube', 'É onde o YouTube recomenda o canal e onde a pessoa passa tempo suficiente para confiar.',
   'Giovane narra cada módulo da mentoria e eu junto as aulas do módulo num vídeo de 8 a 12 minutos.', 'giovane', 'youtube'),
]
QUEM = {'giovane': 'Depende de Giovane', 'equipe': 'Depende da equipe', 'claude': 'Eu faço, é só pedir'}

# ---------------------------------------------------------------------------
def _inline(s):
    s = html.escape(s, quote=False)
    s = re.sub(r'\*\*(.+?)\*\*', r'<b>\1</b>', s)
    return re.sub(r'`([^`]+)`', r'<code>\1</code>', s)

def _lista(bloco):
    """Itens de lista com recuo de 2 espaços por nível; linhas recuadas sem "- " continuam o item do nível delas."""
    itens = []  # [nível, [partes], sem_marcador]
    for l in bloco:
        m = re.match(r'^(\s*)- (.*)', l)
        if m:
            itens.append([len(m.group(1)) // 2, [m.group(2)], False])
        elif l.strip():
            nivel = max(0, (len(l) - len(l.lstrip())) // 2 - 1)
            if itens and itens[-1][0] == nivel:
                itens[-1][1].append(l.strip())
            else:
                itens.append([nivel, [l.strip()], True])
    out, aberto = ['<ul>'], 0
    for k, (nivel, partes, solto) in enumerate(itens):
        while aberto < nivel:
            out.append('<ul>'); aberto += 1
        while aberto > nivel:
            out.append('</ul></li>'); aberto -= 1
        corpo = _inline(partes[0]) + ''.join(f'<span class="mais">{_inline(p)}</span>' for p in partes[1:])
        prox = itens[k + 1][0] if k + 1 < len(itens) else 0
        cls = ' class="solto"' if solto else ''
        out.append(f'<li{cls}>{corpo}' + ('' if prox > nivel else '</li>'))
    while aberto > 0:
        out.append('</ul></li>'); aberto -= 1
    return ''.join(out) + '</ul>'

def md_html(texto):
    """Markdown simples do repositório (parágrafos, listas, tabelas, negrito) -> HTML."""
    linhas, out, i = texto.strip('\n').split('\n'), [], 0
    while i < len(linhas):
        l = linhas[i]
        if not l.strip():
            i += 1
        elif l.startswith('#'):
            n = len(l) - len(l.lstrip('#'))
            out.append(f'<h{min(6, n + 1)}>{_inline(l.lstrip("#").strip())}</h{min(6, n + 1)}>'); i += 1
        elif l.startswith('|'):
            linhas_t = []
            while i < len(linhas) and linhas[i].startswith('|'):
                c = [x.strip() for x in linhas[i].strip().strip('|').split('|')]
                if not all(re.fullmatch(r':?-+:?', x) for x in c):
                    linhas_t.append(c)
                i += 1
            cab, corpo = linhas_t[0], linhas_t[1:]
            out.append('<div class="table-wrap"><table class="stack"><thead><tr>' + ''.join(f'<th>{_inline(c)}</th>' for c in cab) + '</tr></thead><tbody>' +
                       ''.join('<tr>' + ''.join(f'<td data-label="{esc(cab[j])}">{_inline(c)}</td>' for j, c in enumerate(r)) + '</tr>' for r in corpo) +
                       '</tbody></table></div>')
        elif re.match(r'^\s*- ', l):
            bloco = []
            while i < len(linhas) and (re.match(r'^\s*- ', linhas[i]) or linhas[i].startswith('  ') or
                                       (not linhas[i].strip() and i + 1 < len(linhas) and linhas[i + 1].startswith('  '))):
                bloco.append(linhas[i]); i += 1
            out.append(_lista(bloco))
        else:
            par = []
            while i < len(linhas) and linhas[i].strip() and not re.match(r'^(\||#|\s*- )', linhas[i]):
                par.append(linhas[i].strip()); i += 1
            out.append(f'<p>{_inline(" ".join(par))}</p>')
    return '\n'.join(out)

def _secoes_md(texto):
    """Markdown -> (título, {seção ## : corpo})."""
    titulo, partes, atual = '', {}, None
    for l in texto.split('\n'):
        if l.startswith('# '):
            titulo = l[2:].strip()
        elif l.startswith('## '):
            atual = l[3:].strip(); partes[atual] = []
        elif atual:
            partes[atual].append(l)
    return titulo, {k: '\n'.join(v).strip('\n') for k, v in partes.items()}

# ---------------------------------------------------------------------------
def secao_orderflow(texto):
    """A Mentoria de Order Flow na página: o que tirar primeiro, como tirar e cada trecho num bloco que abre."""
    _, sec = _secoes_md(texto)
    trechos = re.split(r'^### ', sec.get('Os trechos', ''), flags=re.M)[1:]
    blocos = []
    for t in trechos:
        cab, _, corpo = t.partition('\n')
        blocos.append(f'<details class="trecho"><summary>{_inline(cab.strip())}</summary>{md_html(corpo)}</details>')
    extras = ''.join(f'<details><summary>{esc(k)}</summary>{md_html(sec[k])}</details>' for k in
                     ['A mensagem dos vídeos', 'Como o order flow se encaixa no operacional GL', 'O episódio que resume tudo', 'O que fica fora dos vídeos'] if k in sec)
    return f'''<section id="orderflow">
  <div class="section-head"><p class="status espera">Esperando os prints</p><h2>Mentoria de Order Flow: os prints para tirar</h2>
    <p>Os {len(trechos)} trechos da gravação no Deep DOM que viram vídeo: Reels e Shorts no formato da série e aulas 16:9 para os alunos. Em cada trecho: a frase e o horário do replay, o que o público aprende, o gancho e os prints exatos.</p></div>
  <div class="two">
    <div class="panel destaque"><h3>Comece por estes</h3>{md_html(sec.get("Se der para tirar só uma parte agora", ""))}</div>
    <div class="panel"><h3>Como tirar os prints</h3>{md_html(sec.get("Como tirar os prints", ""))}</div>
  </div>
  <div class="trechos">{"".join(blocos)}</div>
  {extras}
</section>'''

def secao_comece(serie, tarefas_dl):
    """O post do dia (montado no navegador com a data de quem abre) e a lista do que fazer agora."""
    primeiro = serie[0] if serie else None
    hoje = (f'<img src="{esc(primeiro["capa"])}" alt="Capa do episódio {primeiro["ep"]}"><div class="info"><p class="quando">Próximo post · {esc(primeiro["quando"])}</p>'
            f'<h3>Ep. {primeiro["ep"]} · {esc(primeiro["gancho"])}</h3></div>') if primeiro else '<p class="desc">Sem episódios agendados.</p>'
    tarefas = [
      ('postar', 'Postar o episódio do dia às 19h, no Reels e no Shorts', 'Equipe de redes', '#hoje', 'Ver o post de hoje'),
      ('stories', 'Postar os stories (12h) e o carrossel do dia', 'Equipe de redes', KIT + '#hoje', 'Abrir carrosséis e stories'),
      ('orderflow', 'Tirar os prints da Mentoria de Order Flow, começando pelos 8 da lista', 'Giovane', '#orderflow', 'Ver a lista'),
      ('validar', 'Validar as regras das 19 aulas da Mentoria antes de liberar para os alunos', 'Giovane', '#mentoria', 'Ver as aulas'),
      ('gravar', 'Gravar os 6 roteiros prontos (30 a 45 segundos cada, no celular)', 'Giovane', '#roteiros', 'Ver os roteiros'),
      ('outubro', 'Seguir o calendário de outubro: vídeos de venda, aulas rápidas, carrosséis e stories', 'Equipe de redes', tarefas_dl, 'Baixar o calendário'),
    ]
    li = []
    for tid, txt, quem, alvo, rot in tarefas:
        acao = (f'<a href="{alvo}">{rot}</a>' if alvo.startswith('#') else
                f'<a href="{alvo}" target="_blank" rel="noopener">{rot}</a>' if alvo.startswith('http') else
                f'<button type="button" class="btn btn-link" data-dl="{esc(alvo)}">{rot}</button>')
        li.append(f'<li><label><input type="checkbox" data-tarefa="{tid}"> <span>{esc(txt)}</span></label><p class="tarefa-info"><span class="quem">{esc(quem)}</span>{acao}</p></li>')
    return f'''<section id="comece" class="comece">
  <div class="section-head"><p class="eyebrow">Comece por aqui</p><h2>O que fazer hoje</h2><p>O post do dia da série e as tarefas da semana. O resto da Biblioteca está organizado por objetivo logo abaixo, com o guia de cada tipo de vídeo.</p></div>
  <div class="two">
    <div class="panel hoje" id="hoje">{hoje}</div>
    <div class="panel"><h3>Para fazer agora</h3><ul class="tarefas">{"".join(li)}</ul><p class="desc nota">As marcações ficam salvas só neste navegador.</p></div>
  </div>
  <script type="application/json" id="serie-dados">{json.dumps(serie, ensure_ascii=False).replace("</", "<" + chr(92) + "/")}</script>
</section>'''

def secao_guia(contagem):
    """Tabela de cada parte: o tipo de vídeo, o que é, onde usar, quando e quantos estão prontos; no fim, o que ainda não fazemos."""
    tabelas = []
    for k, (pid, ptit, _, gids) in enumerate(PARTES, 1):
        linhas = []
        for g in gids:
            if g not in GUIA or (g not in contagem and g != 'orderflow' and g not in EXTERNOS):
                continue
            nome, oque, onde, quando = GUIA[g]
            n = contagem.get(g, 0)
            pront = ('<span class="status espera">Esperando os prints</span>' if g == 'orderflow' else EXTERNOS[g][1] if g in EXTERNOS else f'<b>{n}</b> prontos')
            href = f'{EXTERNOS[g][0]}" target="_blank" rel="noopener' if g in EXTERNOS else '#' + g
            linhas.append(f'<tr><td data-label="Tipo"><a href="{href}">{esc(nome)}</a></td><td data-label="O que é">{esc(oque)}</td>'
                          f'<td data-label="Onde usar">{esc(onde)}</td><td data-label="Quando">{esc(quando)}</td><td data-label="Prontos">{pront}</td></tr>')
        prontos = sum(contagem.get(g, 0) for g in gids if g in GUIA)
        tabelas.append(f'<details class="guia-parte" open><summary><span class="t"><span>{k} · {ptit}</span><span class="n">{len(linhas)} tipos · {prontos} vídeos prontos</span></span></summary>'
                       f'<div class="table-wrap"><table class="stack guia"><thead><tr><th>Tipo de vídeo</th><th>O que é</th>'
                       f'<th>Onde usar</th><th>Quando</th><th>Prontos</th></tr></thead><tbody>{"".join(linhas)}</tbody></table></div></details>')
    lac = ''.join(f'<div class="lacuna {q}"><span class="quem-tag">{QUEM[q]}</span><h4>{esc(t)}</h4><p>{esc(por)}</p><p class="precisa"><b>O que precisa:</b> {esc(pre)}</p>'
                  f'<a href="#{a}">Ver na Biblioteca</a></div>' for t, por, pre, q, a in LACUNAS)
    return f'''<section id="guia">
  <div class="section-head"><p class="eyebrow">Guia</p><h2>Como usar cada tipo de vídeo</h2><p>Cada tipo de vídeo tem um trabalho. Aqui está o que é cada um, onde postar, com que frequência e quantos estão prontos, na ordem do funil. Clique no nome para ir até os vídeos e no título da parte para abrir ou fechar a tabela.</p></div>
  {"".join(tabelas)}
  <div class="section-head"><h3>O que ainda não fazemos (e deveríamos)</h3><p>Os formatos que faltam para o conteúdo ficar completo. Todos dependem de gravação, de prints ou da equipe. Os carrosséis e os stories da série já estão prontos, na página de carrosséis e stories.</p></div>
  <div class="lacunas">{lac}</div>
</section>'''

def partes_html(por_id, extras):
    """As seções da Biblioteca agrupadas por objetivo, cada parte com um cabeçalho e atalhos para as suas seções."""
    usados, out = set(), []
    for k, (pid, ptit, pdesc, gids) in enumerate(PARTES, 1):
        presentes = [g for g in gids if g in por_id or g in extras]
        chips = ''.join(f'<a href="{EXTERNOS[g][0]}" target="_blank" rel="noopener">{esc(GUIA[g][0])} ↗</a>' if g in EXTERNOS else
                        f'<a href="#{g}">{esc(GUIA[g][0]) if g in GUIA else g}</a>' for g in gids if g in presentes or g in EXTERNOS)
        out.append(f'<section id="parte-{pid}" class="parte"><p class="eyebrow">Parte {k}</p><h2>{ptit}</h2><p>{pdesc}</p><nav class="toc">{chips}</nav></section>')
        for g in presentes:
            out.append(extras.get(g) or por_id[g]); usados.add(g)
    resto = [s for g, s in por_id.items() if g not in usados]
    return '\n'.join(out + resto)
