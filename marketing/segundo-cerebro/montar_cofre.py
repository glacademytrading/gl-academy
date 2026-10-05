# Segundo cérebro (Obsidian): mantém a nota "Marketing GL Academy.md" e a "Entrevista de marketing.md" em dia com
# ../central/dados.json e monta o ZIP com a pasta "Marketing GL" pronta para copiar para dentro do cofre do Obsidian.
# Uso: python3 montar_cofre.py [pasta de saída] [pasta da Central]   (padrão: ../entregas, que não vai para o git)
# Com a pasta da Central, grava também cofre/ nela: os arquivos com nomes simples e o manifesto.json que a Central usa
# para montar o mesmo ZIP no navegador (as páginas do claude.ai não servem arquivos .zip).
import json, os, re, sys, zipfile

AQUI = os.path.dirname(os.path.abspath(__file__))
MKT = os.path.dirname(AQUI)
PASTA = 'Marketing GL'
saida = os.path.abspath(sys.argv[1] if len(sys.argv) > 1 else os.path.join(MKT, 'entregas'))
NOTA = os.path.join(AQUI, 'Marketing GL Academy.md')
ENTREVISTA = os.path.join(AQUI, 'Entrevista de marketing.md')
dados = json.load(open(os.path.join(MKT, 'central', 'dados.json'), encoding='utf-8'))
DATA = dados['atualizado']

# (arquivo no repositório, caminho no cofre, tipo)
NOTAS = [
    ('plano-de-marketing-2026-27.md', 'Planos/Plano de Marketing 2026-27.md', 'plano'),
    ('plano-de-marketing.md', 'Planos/Plano do ciclo (out a dez 2026).md', 'plano'),
    ('execucao/campanha-gl-risk-auto.md', 'Planos/Campanha GL Risk Auto.md', 'plano'),
    ('mentoria/plano-da-mentoria.md', 'Planos/Plano da Mentoria GL.md', 'plano'),
    ('canais/perfis-e-bios.md', 'Conteúdo/Perfis e bios.md', 'conteudo'),
    ('canais/roteiros-iniciais.md', 'Conteúdo/Roteiros iniciais.md', 'conteudo'),
    ('canais/banco-de-ideias.md', 'Conteúdo/Banco de ideias.md', 'conteudo'),
    ('canais/modelos-e-checklists.md', 'Conteúdo/Modelos e checklists.md', 'conteudo'),
    ('execucao/serie-operacional-na-pratica.md', 'Conteúdo/Série Operacional na prática.md', 'conteudo'),
    ('roteiros-e-depoimentos.md', 'Conteúdo/Roteiros para gravar e depoimentos.md', 'conteudo'),
    ('roteiros-gl-risk-auto.md', 'Conteúdo/Roteiros do GL Risk Auto.md', 'conteudo'),
    ('automacao/rotina-pauta-diaria.md', 'Operação/Rotina da pauta diária.md', 'operacao'),
    ('automacao/README.md', 'Operação/Automação da pauta.md', 'operacao'),
    ('execucao/vendas-follow-up.md', 'Operação/Vendas e follow-up.md', 'operacao'),
    ('execucao/kit-de-imprensa.md', 'Operação/Kit de imprensa.md', 'operacao'),
    ('execucao/manual-de-crise.md', 'Operação/Manual de crise.md', 'operacao'),
    ('execucao/programa-de-parceiros.md', 'Operação/Programa de parceiros.md', 'operacao'),
    ('site/prompt-codex-gl-risk-auto.md', 'Operação/Prompt do Codex - GL Risk Auto no site.md', 'operacao'),
    ('glossario.md', 'Operação/Glossário GL.md', 'operacao'),
    ('PROMPT-continuidade.md', 'Operação/Prompt de continuidade.md', 'operacao'),
    ('README.md', 'Operação/Mapa do repositório.md', 'operacao'),
]
# (arquivo no repositório, caminho no cofre, caminho já publicado na Central ou None)
ANEXOS = [
    ('canais/arte/1-mapa-do-plano.png', 'Anexos/1-mapa-do-plano.png', 'arte/1-mapa-do-plano.png'),
    ('canais/arte/2-semana-tipo.png', 'Anexos/2-semana-tipo.png', 'arte/2-semana-tipo.png'),
    ('canais/arte/3-linha-do-tempo.png', 'Anexos/3-linha-do-tempo.png', 'arte/3-linha-do-tempo.png'),
    ('canais/arte/plano-de-marketing-gl-arte.pdf', 'Anexos/Plano de Marketing GL - arte.pdf', 'baixar/arte-do-plano.pdf'),
    ('canais/calendario-mestre.csv', 'Anexos/calendario-mestre.csv', None),
    ('canais/semana-tipo.csv', 'Anexos/semana-tipo.csv', None),
]


def trocar_bloco(texto, nome, conteudo):
    ini, fim = f'<!-- gerado:{nome} -->', f'<!-- /gerado:{nome} -->'
    a, b = texto.index(ini), texto.index(fim)
    return texto[:a + len(ini)] + '\n' + conteudo.rstrip() + '\n' + texto[b:]


def blocos_da_nota():
    dec = '\n'.join(f"- [ ] **{d['texto']}.** {d['ajuda']}" for d in dados['decisoes'])
    ent = '\n'.join(f"- [ ] **{e['texto']}.** {e.get('nota', e['como'])}" for e in dados['entregas'])
    nota = open(NOTA, encoding='utf-8').read()
    nota = trocar_bloco(nota, 'decisoes', dec)
    nota = trocar_bloco(nota, 'entregas', ent)
    open(NOTA, 'w', encoding='utf-8').write(nota)


def nota_entrevista():
    perguntas = [q for b in dados['entrevista'] for q in b['perguntas']]
    ess = [q for q in perguntas if q['e']]
    linhas = ['---', 'titulo: Entrevista de marketing', 'tipo: entrevista', 'area: marketing', f'atualizado: {DATA}', 'status: aberta',
              'tags:', '  - marketing', '  - gl-academy', '  - entrevista', '---', '',
              '# Entrevista de marketing', '',
              f'> Parte de [[Marketing GL Academy]]. São {len(perguntas)} perguntas em {len(dados["entrevista"])} blocos; '
              f'{len(ess)} são essenciais e vêm primeiro.', '',
              'As respostas servem para deixar o marketing do jeito certo: entender o que a GL entrega hoje, o que pretende oferecer, '
              'os projetos e as fontes de renda, e como Giovane quer aparecer.', '',
              '**Onde responder:**', '',
              '- Na [Central de Marketing GL](https://claude.ai/artifact/5ZT6MjVPqcFQpAK1wJdmAR), seção Entrevista: as respostas ficam salvas e o Claude lê de lá.',
              '- Ou por áudio no chat do Claude, citando o número da pergunta (por exemplo, "B1").',
              '- Ou aqui mesmo, embaixo de cada pergunta, e mande esta nota no chat.', '',
              '**As essenciais:** ' + ', '.join(q['id'].upper() for q in ess) + '.', '']
    for b in dados['entrevista']:
        linhas += [f"## {b['id'].upper()} · {b['bloco']}", '']
        for q in b['perguntas']:
            linhas += [f"### {q['id'].upper()}. {q['q']}", '']
            if q['e']:
                linhas += ['**Essencial.**' + (f" {q['h']}" if q['h'] else ''), '']
            elif q['h']:
                linhas += [q['h'], '']
            linhas += ['**Resposta:**', '', '']
    open(ENTREVISTA, 'w', encoding='utf-8').write('\n'.join(linhas).rstrip() + '\n')


def sem_tags(md):
    # No Obsidian, "#palavra" vira tag. Nas cópias, escapa o # fora de código para continuar texto.
    partes, em_bloco = [], False
    for linha in md.split('\n'):
        if linha.lstrip().startswith('```'):
            em_bloco = not em_bloco
            partes.append(linha)
            continue
        if em_bloco:
            partes.append(linha)
            continue
        pedacos = re.split(r'(`[^`]*`)', linha)
        for i in range(0, len(pedacos), 2):
            pedacos[i] = re.sub(r'(?<![\w\\/&#`(\[])#(?=[A-Za-zÀ-ÿ_])', r'\\#', pedacos[i])
        partes.append(''.join(pedacos))
    return '\n'.join(partes)


def copia(origem, tipo):
    texto = open(os.path.join(MKT, origem), encoding='utf-8').read()
    cabeca = ['---', f'tipo: {tipo}', 'area: marketing', f'fonte: "marketing/{origem}"', f'atualizado: {DATA}',
              'tags:', '  - marketing', '  - gl-academy', '---', '',
              f'> Parte de [[Marketing GL Academy]] · no repositório: `marketing/{origem}`', '']
    return '\n'.join(cabeca) + sem_tags(texto)


def entradas():
    # (caminho no cofre, conteúdo, caminho já publicado na Central)
    yield 'Marketing GL Academy.md', open(NOTA, 'rb').read(), 'baixar/nota-obsidian.md'
    yield 'Entrevista de marketing.md', open(ENTREVISTA, 'rb').read(), None
    for origem, caminho, tipo in NOTAS:
        yield caminho, copia(origem, tipo).encode('utf-8'), None
    for origem, caminho, publicado in ANEXOS:
        yield caminho, open(os.path.join(MKT, origem), 'rb').read(), publicado


def main():
    blocos_da_nota()
    nota_entrevista()
    os.makedirs(saida, exist_ok=True)
    destino = os.path.join(saida, 'Marketing GL - Obsidian.zip')
    todas = list(entradas())
    with zipfile.ZipFile(destino, 'w', zipfile.ZIP_DEFLATED) as z:
        for caminho, conteudo, _ in todas:
            z.writestr(f'{PASTA}/{caminho}', conteudo)
    print(f'{destino}: {len(todas)} arquivos, {os.path.getsize(destino) / 1e6:.1f} MB')
    if len(sys.argv) > 2:
        central = os.path.abspath(sys.argv[2])
        os.makedirs(os.path.join(central, 'cofre'), exist_ok=True)
        os.makedirs(os.path.join(central, 'baixar'), exist_ok=True)
        manifesto = []
        for i, (caminho, conteudo, publicado) in enumerate(todas, 1):
            if publicado is None:
                publicado = f'cofre/a{i:02d}{os.path.splitext(caminho)[1]}'
            open(os.path.join(central, publicado), 'wb').write(conteudo)
            manifesto.append({'arq': publicado, 'zip': f'{PASTA}/{caminho}'})
        json.dump(manifesto, open(os.path.join(central, 'cofre', 'manifesto.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
        print(f'Central: {len(manifesto)} arquivos do cofre em {central}')


if __name__ == '__main__':
    main()
