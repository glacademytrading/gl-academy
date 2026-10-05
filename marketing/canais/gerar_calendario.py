# Calendário mestre do plano de marketing 2026-27: as 13 semanas (05/10/2026 a 03/01/2027), dia a dia, por conta e
# horário de Brasília, com a programação pronta da marca (os calendários de ../execucao/) e as séries novas de
# @lazarotrades, YouTube, @glacademytrading, LinkedIn e newsletter.
# Uso: python3 gerar_calendario.py  (grava calendario-mestre.csv e semana-tipo.csv nesta pasta, em ; com BOM, para o Excel)
import csv, datetime as dt, os, re

AQUI = os.path.dirname(os.path.abspath(__file__))
EXEC = os.path.join(AQUI, '..', 'execucao')
INI, FIM = dt.date(2026, 10, 5), dt.date(2027, 1, 3)
DIAS = ['seg', 'ter', 'qua', 'qui', 'sex', 'sáb', 'dom']
FIM_HV_EUA = dt.date(2026, 11, 1)          # fim do horário de verão nos EUA: a abertura de NY passa de 10h30 para 11h30
FERIADO_EUA = {dt.date(2026, 11, 26): 'Thanksgiving', dt.date(2026, 12, 25): 'Natal', dt.date(2027, 1, 1): 'Ano Novo'}
FERIADO_BR = {dt.date(2026, 10, 12): 'Nossa Senhora Aparecida', dt.date(2026, 11, 2): 'Finados', dt.date(2026, 11, 15): 'Proclamação da República',
              dt.date(2026, 11, 20): 'Consciência Negra', dt.date(2026, 12, 25): 'Natal', dt.date(2027, 1, 1): 'Ano Novo'}
CAB = ['Data', 'Dia', 'Horário (Brasília)', 'Conta', 'Formato', 'Série', 'Pilar', 'Tema', 'Chamada', 'Origem', 'Observação']


def ny(d, h):  # h horas de Nova York em horário de Brasília
    return f'{h + (1 if d <= FIM_HV_EUA else 2):02d}:00'


def abertura(d, antes_min=30):
    base = dt.datetime.combine(d, dt.time(10, 30) if d <= FIM_HV_EUA else dt.time(11, 30)) - dt.timedelta(minutes=antes_min)
    return base.strftime('%H:%M')


# ------------------------------------------------------------------------------------------- temas das séries
SEMANA_TEMA = ['O plano', 'Risco primeiro', 'IA na empresa', 'Processo', 'Rotina', 'Vibe coding', 'Mesa proprietária', 'Black Friday',
               'IA na prática', 'Planejar 2027', 'Retrospectiva', 'Ferramentas', 'O plano de 2027']
LONGOS = {
    dt.date(2026, 10, 18): 'Como eu uso IA para tocar uma empresa de trading (o GL OS por dentro)',
    dt.date(2026, 10, 25): 'O trade que o meu sistema não me deixou fazer: gestão de risco na prática',
    dt.date(2026, 11, 1): 'Montei um agente de IA que me entrega a pauta do dia às 6h40',
    dt.date(2026, 11, 8): 'Minha rotina de trader e CEO, do treino ao pré-mercado',
    dt.date(2026, 11, 15): 'Vibe coding: criei uma ferramenta para traders conversando com a IA',
    dt.date(2026, 11, 22): 'Mesa proprietária: as regras que reprovam e como eu me protejo',
    dt.date(2026, 11, 29): 'Vibe marketing: como a GL produz 150 peças por mês com IA',
    dt.date(2026, 12, 6): 'Swing trade com processo: como eu estudo uma ideia antes de pensar em entrar',
    dt.date(2026, 12, 13): 'Como planejar 2027 com IA, na empresa e na vida',
    dt.date(2026, 12, 20): 'O que eu aprendi construindo a GL em público',
    dt.date(2026, 12, 27): 'As ferramentas de IA que eu uso todo dia (e as que eu larguei)',
    dt.date(2027, 1, 3): 'O plano de 2027: metas, sistema e o que vem por aí',
}
LIVE_PREGAO = [dt.date(2026, 10, 15), dt.date(2026, 10, 29), dt.date(2026, 11, 12), dt.date(2026, 11, 24), dt.date(2026, 12, 10)]
LIVE_PERGUNTAS = [dt.date(2026, 10, 22), dt.date(2026, 11, 19), dt.date(2026, 12, 17)]

# semanas 0 a 2 com os títulos de roteiros-iniciais.md
FIXOS = {
    (dt.date(2026, 10, 9), '19:00'): ('Reel', 'Manifesto', 'P3', 'Por que vou mostrar tudo: mercado, IA, empresa e rotina (fixar)', 'Seguir e enviar'),
    (dt.date(2026, 10, 10), '11:00'): ('Reel', 'Sistema de vida', 'P4', 'Minha semana em blocos: trading, empresa e treino', 'Salvar'),
    (dt.date(2026, 10, 11), '18:00'): ('Carrossel', 'Comece aqui', 'P3', 'Comece aqui: quem sou, o que é a GL e as séries (fixar)', 'Salvar'),
    (dt.date(2026, 10, 12), '12:00'): ('Reel', 'Radar IA', 'P2', 'A ferramenta de IA que mais economiza tempo na minha empresa', 'Newsletter'),
    (dt.date(2026, 10, 12), '19:00'): ('Reel', 'Mercado da semana', 'P1', 'O que eu observo antes da abertura de Nova York', 'Salvar'),
    (dt.date(2026, 10, 13), '19:00'): ('Reel (Collab com @glacademybr)', 'Trade comentado', 'P1', 'O trade que o meu sistema barrou', 'Enviar'),
    (dt.date(2026, 10, 14), '19:00'): ('Reel', 'IA na prática', 'P2', 'A pauta do dia chega pronta às 6h40', 'Vídeo longo'),
    (dt.date(2026, 10, 15), '19:00'): ('Reel', 'Construindo a GL', 'P3', '150 peças de marketing sem gastar crédito de IA', 'Comentar "motor"'),
    (dt.date(2026, 10, 16), '19:00'): ('Reel', 'Sexta do estudo', 'P1', 'O que o gráfico semanal me pede para observar', 'Salvar'),
    (dt.date(2026, 10, 17), '11:00'): ('Reel', 'Sistema de vida', 'P4', 'Por que eu treino antes do mercado', 'Enviar'),
    (dt.date(2026, 10, 19), '19:00'): ('Reel', 'Mercado da semana', 'P1', 'Risco primeiro: a única regra que eu nunca quebro', 'Salvar'),
    (dt.date(2026, 10, 20), '19:00'): ('Reel (Collab com @glacademybr)', 'Trade comentado', 'P1', 'Do contexto à saída em 5 passos', 'Conversa gratuita'),
    (dt.date(2026, 10, 21), '19:00'): ('Reel', 'IA na prática', 'P2', 'Um agente que responde o lead em 5 minutos', 'Lista de espera da IA'),
    (dt.date(2026, 10, 22), '19:00'): ('Reel', 'Construindo a GL', 'P3', 'Como a GL decide o que vai para o site', 'Newsletter'),
    (dt.date(2026, 10, 23), '19:00'): ('Reel', 'Sexta do estudo', 'P1', 'O que muda no mercado quando sai o CPI', 'Salvar'),
    (dt.date(2026, 10, 24), '11:00'): ('Reel', 'Sistema de vida', 'P4', 'Domingo de planejamento: como eu monto a semana', 'Salvar'),
}
# rotação de temas do banco de ideias para as semanas 3 a 12
ROT = {
    'Mercado da semana': ['O limite do dia: o pior dia não pode apagar o mês', 'Stop longe demais: o erro silencioso', 'Quantos contratos cabem no stop',
                          'Dia de CPI ou FOMC: notícia grande não é dia de herói', 'Por que eu não opero a primeira vela', 'O que é R, em 1 minuto',
                          'Contexto a favor ou contra: nem toda queda é venda', 'Quando realizar: o sinal verde', 'Os 5 erros de risco', 'O diário de trades'],
    'Trade comentado': ['Venda na VAH D com o teto de risco', 'O plano barrado e o plano pronto', 'A gestão em R até o sinal verde',
                        'Setup acontecendo: varredura na mínima', 'Defesa na VWAP 3M', 'Escada de valor', 'Correção contra a semana e o mês',
                        'Rompimento com Gamma', 'Retorno à média', 'O trade da live, revisado'],
    'IA na prática': ['Os 3 prompts que eu uso todo dia', 'IA para estudar mercado sem pedir recomendação', 'Agentes sem jargão: um estagiário que não dorme',
                      'O placar de vendas que se monta sozinho', 'O que nunca colar num chat de IA', 'Qual IA eu uso para quê', 'Vídeo com IA sem parecer falso',
                      'Dublagem com IA: o canal em inglês', 'Aprender IA em 30 dias', 'Onde a IA erra (e como eu checo)'],
    'Construindo a GL': ['A decisão da semana', 'O que deu errado no mês', 'Um número só manda: calls por semana', 'Processo antes da ferramenta',
                         'A campanha do GL Risk Auto por dentro', 'Black Friday honesta: desconto de verdade ou nada', 'Como escolhemos parceiros',
                         'O feedback que mudou o produto', 'Ser CEO de empresa pequena', 'Renda recorrente de verdade (e o mito da renda passiva)'],
    'Sexta do estudo': ['A tese, a invalidação e o tamanho', 'Como eu estudo uma ideia de swing', 'O semanal do S&P antes do FOMC', 'O que o calendário econômico da semana pede',
                        'Valor da semana e do mês: onde o preço está', 'O que invalidaria a minha leitura', 'Estudo de position: o tempo e o risco',
                        'Revisão do mês em R', 'O que eu estudo para 2027', 'Os níveis que eu observo na virada do ano'],
    'Sistema de vida': ['A manhã sem celular', 'Sono é estratégia', 'O dia depois de um stop', 'Disciplina não é motivação', 'As leituras do mês',
                        '90 dias de treino: dia 1 contra hoje', 'Metas do ano numa página', 'Limites com família e trabalho', 'Hábitos que eu cortei',
                        'A revisão do dia: 3 perguntas antes de dormir'],
}
EN = ["This trade didn't pass: the risk cap", 'How many contracts fit your stop', 'When to take profit: the green signal',
      'Prop firm rules on your chart', 'What is R? (20-second lesson)', '5 risk mistakes that blow accounts', 'Before and after: the plan on the chart',
      'The full GL system: context, risk and execution', 'With or against the context (D/W/M)', 'A setup in motion: sweep and reclaim',
      'Targets on the chart before price gets there', 'Gamma levels on your futures chart (GL Gamma sold separately)']
LINKEDIN = {0: 'CEO: uma decisão ou lição da semana', 2: 'IA na empresa: um uso real na GL', 4: 'A semana da GL em números de processo'}


def linhas_novas():
    rows, idx = [], {k: 0 for k in ROT}
    en_i = 0
    d = INI
    while d <= FIM:
        w = (d - INI).days // 7
        wd = d.weekday()
        tema_sem = SEMANA_TEMA[min(w, len(SEMANA_TEMA) - 1)]
        dia = [d.strftime('%d/%m/%Y'), DIAS[wd]]
        fer = FERIADO_BR.get(d)
        obs_f = f'Feriado no Brasil: {fer}' if fer else ''

        def add(hora, conta, formato, serie, pilar, tema, cta='', origem='novo', obs=''):
            rows.append(dia + [hora, conta, formato, serie, pilar, tema, cta, origem, '; '.join(x for x in (obs, obs_f) if x)])

        if d < dt.date(2026, 10, 9):
            add('—', 'Todas', 'Preparação', 'Semana 0', '', ['Ler o plano e decidir os papéis dos perfis', 'Bios, nomes, links, destaques nos 3 perfis',
                'Gravar o bloco 1 e sessão de fotos', 'Editar e agendar; montar o canal do YouTube e a newsletter'][wd], '', 'novo')
        # pré-mercado (dias úteis com bolsa americana aberta)
        if wd < 5 and d not in FERIADO_EUA and d >= dt.date(2026, 10, 12):
            add(abertura(d, 30), '@lazarotrades (stories) e comunidade', 'Stories', 'Pré-mercado em 60 s', 'P1', 'Agenda do dia, o que observar e o risco máximo',
                '', 'novo', 'Educacional, sem recomendação')
        # @lazarotrades: slots da semana-tipo
        if d >= dt.date(2026, 10, 9):
            slots = []
            semana_cheia = d >= dt.date(2026, 10, 12)
            if wd in (0, 2, 4) and semana_cheia:
                slots.append(('12:00', 'Reel', 'Radar IA', 'P2', 'Tema da pauta do dia (Pauta GL)', 'Newsletter'))
            serie = {0: 'Mercado da semana', 1: 'Trade comentado', 2: 'IA na prática', 3: 'Construindo a GL', 4: 'Sexta do estudo'}.get(wd)
            if serie and semana_cheia:
                slots.append(('19:00', 'Reel (Collab com @glacademybr)' if serie == 'Trade comentado' else 'Reel', serie,
                              {'Mercado da semana': 'P1', 'Trade comentado': 'P1', 'IA na prática': 'P2', 'Construindo a GL': 'P3', 'Sexta do estudo': 'P1'}[serie], None, None))
            if wd == 5 and semana_cheia:
                slots.append(('11:00', 'Reel', 'Sistema de vida', 'P4', None, 'Salvar'))
            if wd == 6 and semana_cheia:
                slots.append(('18:00', 'Carrossel', 'O plano da semana', 'P3', f'O plano da semana: {SEMANA_TEMA[min(w + 1, len(SEMANA_TEMA) - 1)]}', 'Salvar'))
            if wd == 4 and semana_cheia:
                slots.append(('12:30', 'Carrossel', 'Sexta do estudo', 'P1', 'Roteiro de estudo da semana', 'Salvar'))
            for hora, formato, serie, pilar, tema, cta in slots:
                fx = FIXOS.get((d, hora))
                if fx:
                    add(hora, '@lazarotrades + YouTube Shorts', fx[0], fx[1], fx[2], fx[3], fx[4])
                    continue
                if tema is None:
                    lista = ROT[serie]
                    tema = lista[idx[serie] % len(lista)]
                    idx[serie] += 1
                    cta = cta or {'P1': 'Salvar', 'P2': 'Lista de espera da IA' if d >= dt.date(2026, 10, 26) else 'Newsletter', 'P3': 'Newsletter', 'P4': 'Enviar'}[pilar]
                conta = '@lazarotrades' if formato == 'Carrossel' else '@lazarotrades + YouTube Shorts'
                add(hora, conta, formato, serie, pilar, tema, cta)
            for fx_key, fx in FIXOS.items():  # títulos fixos fora da semana-tipo (manifesto, comece aqui)
                if fx_key[0] == d and not any(s[0] == fx_key[1] for s in slots):
                    add(fx_key[1], '@lazarotrades', fx[0], fx[1], fx[2], fx[3], fx[4])
        elif d == dt.date(2026, 10, 9):
            pass
        # YouTube longo, newsletter e lives
        if d in LONGOS:
            add('10:00', 'YouTube @giovanelazaro', 'Vídeo longo (8 a 15 min)', 'Domingo', '', LONGOS[d], 'Newsletter e conversa gratuita', 'novo',
                'Dublagem automática para o inglês; 3 thumbnails no teste')
        if wd == 6 and d >= dt.date(2026, 10, 18):
            add('08:00', 'Newsletter', 'E-mail', 'Newsletter da semana', '', f'O vídeo da semana, o Radar IA e a agenda do mercado ({SEMANA_TEMA[min(w, 12)]})', 'Conversa gratuita')
        if d in LIVE_PREGAO:
            add(abertura(d, 15), 'YouTube @giovanelazaro + Instagram', 'Live (1h30)', 'Ao vivo no pregão', 'P1', 'Operando com o GL Risk Auto na tela, risco em R',
                'Inscrever e newsletter', 'novo', 'Aviso fixo na tela; nunca "copie"')
        if d in LIVE_PERGUNTAS:
            add('20:00', 'YouTube @giovanelazaro + Instagram', 'Live (45 min)', 'Perguntas da comunidade', '', 'Trading, IA e empresa', 'Conversa gratuita')
        # LinkedIn
        if wd in LINKEDIN and d >= dt.date(2026, 10, 12) and d not in FERIADO_BR:
            add('08:00', 'LinkedIn de Giovane', 'Post', 'LinkedIn', 'P3', LINKEDIN[wd])
        # @glacademytrading (inglês), seg, ter, qui e sáb às 9h de NY, a partir de 19/10
        if wd in (0, 1, 3, 5) and d >= dt.date(2026, 10, 19):
            tema = EN[en_i % len(EN)] + (' (new EN version)' if en_i >= len(EN) else '')
            en_i += 1
            add(ny(d, 9), '@glacademytrading', 'Reel (English)', 'Risk first', 'P1/P5', tema, 'Free call', 'novo',
                'Versão em inglês feita pelo Claude; aviso de risco de futuros e da regra 4.41 nos replays')
        # TradingView
        if wd == 2 and d >= dt.date(2026, 10, 14):
            add('20:00', 'TradingView', 'Ideia educacional', 'TradingView', 'P1', 'Um conceito do operacional num gráfico', '', 'novo', 'Sem recomendação')
        d += dt.timedelta(days=1)
    return rows


def linhas_prontas():
    """A programação pronta da marca, que passa para o @glacademybr."""
    fontes = [('calendario-operacional-na-pratica.csv', 'Operacional na prática'), ('calendario-gl-risk-auto.csv', 'GL Risk Auto'),
              ('calendario-carrosseis-e-stories.csv', 'Carrosséis e stories da série'), ('calendario-outubro.csv', 'Calendário de outubro')]
    rows = []
    for arq, serie in fontes:
        caminho = os.path.join(EXEC, arq)
        with open(caminho, encoding='utf-8-sig', newline='') as f:
            for r in csv.DictReader(f, delimiter=';'):
                dd, mm = r['Data'].split('/')[:2]
                ano = 2026 if int(mm) >= 9 else 2027
                d = dt.date(ano, int(mm), int(dd))
                if d < INI or d > FIM:
                    continue
                canal = r.get('Canal', '') or ''
                conta = '@glacademybr' + (' + YouTube Shorts' if 'YouTube' in canal else '')
                formato = r.get('Formato') or ('Story' if 'stor' in (r.get('Peça', '') + canal).lower() else canal)
                tema = r.get('Episódio') or r.get('Peça') or r.get('Semana e tema') or ''
                peca = r.get('Peça') or ''
                arquivo = r.get('Vídeo (na pasta organizada)') or ''
                if r.get('Episódio') and peca and peca != tema:
                    tema = f"{r['Episódio']} · {peca}"
                hora, obs = r.get('Horário'), r.get('Observação', '') or ''
                if arquivo:
                    obs = '; '.join(x for x in (obs, f'Arquivo: {arquivo}') if x)
                if not hora:
                    hora = 'ao longo do dia' if 'stor' in formato.lower() else '12:00'
                    obs = '; '.join(x for x in (obs, 'Horário sugerido: a série da marca sai às 19h') if x)
                rows.append([d.strftime('%d/%m/%Y'), DIAS[d.weekday()], hora, conta, formato, serie,
                             'P5' if serie == 'GL Risk Auto' else 'P1/P5', tema, '', f'pronto: execucao/{arq}', obs])
    return rows


def main():
    rows = linhas_novas() + linhas_prontas()
    rows.sort(key=lambda r: (dt.datetime.strptime(r[0], '%d/%m/%Y'), r[2] if r[2][0].isdigit() else '99', r[3]))
    with open(os.path.join(AQUI, 'calendario-mestre.csv'), 'w', encoding='utf-8-sig', newline='') as f:
        w = csv.writer(f, delimiter=';', quoting=csv.QUOTE_ALL)
        w.writerow(CAB)
        w.writerows(rows)
    semana = [
        ['Dia', '@lazarotrades', 'YouTube @giovanelazaro', '@glacademybr', '@glacademytrading', 'LinkedIn, newsletter e gravação'],
        ['Segunda', '12h Radar IA; 19h Reel do mercado da semana; stories do pré-mercado', 'Shorts 12h e 19h', 'Reel 19h da programação; carrossel 12h', 'Reel 9h de NY', 'LinkedIn 8h; Bloco A de gravação (14h às 16h)'],
        ['Terça', '19h Trade comentado (Collab); stories', 'Short 19h', 'O mesmo trade em Collab; stories', 'Reel 9h de NY', ''],
        ['Quarta', '12h Radar IA; 19h IA na prática; stories', 'Shorts 12h e 19h', 'Reel 19h; carrossel 12h', '', 'LinkedIn 8h; Bloco B de gravação (14h às 17h); ideia no TradingView 20h'],
        ['Quinta', '19h Construindo a GL; live no pregão a cada 2 semanas', 'Live quinzenal; Short 19h', 'Reel 19h', 'Reel 9h de NY; carrossel', ''],
        ['Sexta', '12h Radar IA; 12h30 carrossel; 19h Sexta do estudo', 'Shorts 12h e 19h', 'Reel 19h; carrossel 12h', '', 'LinkedIn 8h'],
        ['Sábado', '11h Sistema de vida; stories de treino', 'Short 11h', 'Carrossel-resumo 11h', 'Reel 10h de NY', ''],
        ['Domingo', '18h carrossel "o plano da semana"; stories', '10h vídeo longo', 'Story da semana', '', 'Newsletter 8h; planejamento de 30 min com a pauta'],
    ]
    with open(os.path.join(AQUI, 'semana-tipo.csv'), 'w', encoding='utf-8-sig', newline='') as f:
        csv.writer(f, delimiter=';', quoting=csv.QUOTE_ALL).writerows(semana)
    contas = {}
    for r in rows:
        contas[r[3]] = contas.get(r[3], 0) + 1
    print(f'{len(rows)} linhas de {INI:%d/%m/%Y} a {FIM:%d/%m/%Y}:', ', '.join(f'{k} {v}' for k, v in sorted(contas.items(), key=lambda x: -x[1])))


if __name__ == '__main__':
    main()
