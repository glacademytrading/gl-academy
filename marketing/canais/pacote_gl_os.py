# Pacote do plano de marketing 2026-27 para o GL OS: junta o plano, a arte, os calendários, os modelos e a automação num ZIP.
# Uso: python3 pacote_gl_os.py [pasta de saída]   (padrão: ../entregas, que não vai para o git)
import os, sys, zipfile

AQUI = os.path.dirname(os.path.abspath(__file__))
MKT = os.path.dirname(AQUI)
RAIZ = 'GL OS - Plano de Marketing 2026-27'
saida = os.path.abspath(sys.argv[1] if len(sys.argv) > 1 else os.path.join(MKT, 'entregas'))

# (pasta no ZIP, arquivo no repositório, nome no ZIP ou None para manter)
ARQUIVOS = [
    ('', 'plano-de-marketing-2026-27.md', '01 Plano de Marketing 2026-27.md'),
    ('02 Arte do plano', 'canais/arte/plano-de-marketing-gl-arte.pdf', 'Plano de Marketing GL - arte (3 pôsteres A3).pdf'),
    ('02 Arte do plano', 'canais/arte/1-mapa-do-plano.png', None),
    ('02 Arte do plano', 'canais/arte/2-semana-tipo.png', None),
    ('02 Arte do plano', 'canais/arte/3-linha-do-tempo.png', None),
    ('03 Calendários', 'canais/calendario-mestre.csv', None),
    ('03 Calendários', 'canais/semana-tipo.csv', None),
    ('03 Calendários/Programação pronta da marca', 'execucao/calendario-operacional-na-pratica.csv', None),
    ('03 Calendários/Programação pronta da marca', 'execucao/calendario-gl-risk-auto.csv', None),
    ('03 Calendários/Programação pronta da marca', 'execucao/calendario-carrosseis-e-stories.csv', None),
    ('03 Calendários/Programação pronta da marca', 'execucao/calendario-outubro.csv', None),
    ('04 Perfis, roteiros e modelos', 'canais/perfis-e-bios.md', None),
    ('04 Perfis, roteiros e modelos', 'canais/roteiros-iniciais.md', None),
    ('04 Perfis, roteiros e modelos', 'canais/modelos-e-checklists.md', None),
    ('05 Banco de ideias', 'canais/banco-de-ideias.md', None),
    ('06 Automação', 'automacao/README.md', 'LEIA-ME da automação.md'),
    ('06 Automação', 'automacao/rotina-pauta-diaria.md', None),
    ('06 Automação/radar', 'automacao/radar/radar.py', None),
    ('06 Automação/radar', 'automacao/radar/fontes.json', None),
    ('06 Automação/radar/teste', 'automacao/radar/teste/oficial-ia.xml', None),
    ('06 Automação/radar/teste', 'automacao/radar/teste/portal-mercado.xml', None),
    ('06 Automação/radar/teste', 'automacao/radar/teste/atom-empresa.xml', None),
    ('07 Site', 'site/prompt-codex-gl-risk-auto.md', None),
    ('08 Plano do ciclo e campanha', 'plano-de-marketing.md', 'Plano do ciclo (funil, 6 pilares e meta de calls).md'),
    ('08 Plano do ciclo e campanha', 'execucao/campanha-gl-risk-auto.md', None),
    ('08 Plano do ciclo e campanha', 'PROMPT-continuidade.md', 'Prompt de continuidade.md'),
]

LEIA_ME = """# Plano de Marketing GL 2026-27 · pacote para o GL OS

5 de outubro de 2026. Tudo o que o GL OS precisa para acompanhar o marketing até 03/01/2027.

## Por onde começar

1. **01 Plano de Marketing 2026-27.md:** o plano inteiro. O resumo e "Os próximos 7 dias" estão no começo e no fim.
2. **02 Arte do plano:** o mapa do plano, a semana-tipo e a linha do tempo das 13 semanas, em PNG e num PDF de 3 páginas A3.
3. **03 Calendários:** o calendário mestre, dia a dia, por conta e horário de Brasília (473 linhas, de 05/10/2026 a 03/01/2027). A programação pronta da marca está dentro dele e também nos arquivos originais.

## O que tem em cada pasta

| Pasta | O que tem |
| --- | --- |
| 01 | O plano: marcas e canais, posicionamento, os 5 pilares, as séries, a semana-tipo, a ordem de postar, o YouTube, o perfil em inglês, o funil, a educação em IA, a autoridade, a marca pessoal, a produção, a pauta automática, a Higgsfield, as 13 semanas, os números, os riscos e as decisões |
| 02 Arte do plano | Os 3 pôsteres |
| 03 Calendários | O calendário mestre e a semana-tipo (CSV com ponto e vírgula, abrem no Excel e no Google Planilhas) e a programação pronta da marca |
| 04 Perfis, roteiros e modelos | Nomes e bios dos perfis, os 14 primeiros Reels e os roteiros dos vídeos longos 1 e 2, os modelos de cada formato e os checklists de publicação e de regras |
| 05 Banco de ideias | 120 ideias de conteúdo por pilar, com gancho |
| 06 Automação | A rotina que escreve a pauta de cada dia útil às 6h40 e o radar de fontes RSS |
| 07 Site | O prompt para o Codex colocar os 2 vídeos do GL Risk Auto no site |
| 08 Plano do ciclo e campanha | O plano do ciclo (a meta de calls 1x1 e os 6 pilares), a campanha GL Risk Auto e o prompt para continuar o projeto com o Claude |

## Os caminhos citados no plano

O plano cita os arquivos pelo caminho do repositório (pasta `marketing`). Aqui eles estão assim:

| No plano | Neste pacote |
| --- | --- |
| `canais/perfis-e-bios.md`, `canais/roteiros-iniciais.md`, `canais/modelos-e-checklists.md` | 04 Perfis, roteiros e modelos |
| `canais/banco-de-ideias.md` | 05 Banco de ideias |
| `canais/calendario-mestre.csv`, `canais/semana-tipo.csv` | 03 Calendários |
| `canais/arte/` | 02 Arte do plano |
| `automacao/` | 06 Automação |
| `plano-de-marketing.md`, `execucao/campanha-gl-risk-auto.md` | 08 Plano do ciclo e campanha |
| `site/prompt-codex-gl-risk-auto.md` | 07 Site |

## As páginas

São privadas: só abre quem recebeu acesso pelo menu de compartilhar de cada página.

- **Pauta GL**, os roteiros de cada dia útil: https://claude.ai/artifact/YH7Bzpianz4oLt52Fwi5ba
- **Sistema de Marketing GL**, o status das ações do ciclo: https://claude.ai/artifact/7MhNCUVNeDtQACf9euH5Ns
- **Biblioteca de Vídeos GL:** https://claude.ai/artifact/BgpMsKZZn2BikAYBcXSDfm
- **Campanha GL Risk Auto:** https://claude.ai/artifact/YGFyAnt64pTYPbqzFsjhr1
- **Carrosséis e Stories GL:** https://claude.ai/artifact/AVHWWSnHp4TPyVGiCm2tsp

## O que o GL OS pode acompanhar toda semana

- **Segunda:** o placar de conteúdo (uma linha por canal; o modelo está no fim de "modelos-e-checklists.md") e as calls 1x1 realizadas, o número que manda.
- **Todo dia útil:** a pauta das 6h40 e o que foi gravado e postado (o status fica na página Pauta GL).
- **Sexta:** a retrospectiva de 30 minutos (o que reter, o que trocar, a pauta de domingo).
- **As decisões em aberto:** a seção "O que depende de Giovane" do plano.

Conteúdo educacional. Trading envolve risco financeiro real. Nenhuma peça promete lucro, renda ou aprovação em mesa proprietária.
"""


def main():
    os.makedirs(saida, exist_ok=True)
    destino = os.path.join(saida, RAIZ + '.zip')
    faltando = [a for _, a, _ in ARQUIVOS if not os.path.exists(os.path.join(MKT, a))]
    if faltando:
        sys.exit('Faltam arquivos: ' + ', '.join(faltando) + ' (rode node canais/arte/render.js canais/arte antes)')
    with zipfile.ZipFile(destino, 'w', zipfile.ZIP_DEFLATED) as z:
        z.writestr(f'{RAIZ}/00 LEIA-ME.md', LEIA_ME)
        for pasta, arq, nome in ARQUIVOS:
            caminho = '/'.join(x for x in (RAIZ, pasta, nome or os.path.basename(arq)) if x)
            assert len(caminho) < 200, caminho  # cabe no limite de caminho do Windows mesmo dentro de outra pasta
            z.write(os.path.join(MKT, arq), caminho)
    print(f'{destino}: {len(ARQUIVOS) + 1} arquivos, {os.path.getsize(destino) / 1e6:.1f} MB')


if __name__ == '__main__':
    main()
