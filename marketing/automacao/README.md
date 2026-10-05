# Automação da pauta

Três peças trabalham juntas para que as novidades virem roteiros todos os dias, sem ninguém procurar notícia à mão.

| Peça | Onde | O que faz |
| --- | --- | --- |
| **A rotina diária** | `rotina-pauta-diaria.md` | Toda manhã de dia útil, às 6h40, uma sessão do Claude pesquisa as novidades das últimas 24 a 48 horas e escreve 5 roteiros (3 de IA, 1 de mercado, 1 de empresa ou vida). Às sextas, também o roteiro do vídeo longo da semana seguinte |
| **A página Pauta GL** | `../pauta/` e [o link publicado](https://claude.ai/artifact/YH7Bzpianz4oLt52Fwi5ba) | Mostra os roteiros do dia com botões de copiar, as fontes, o que conferir, o status de cada peça e o calendário mestre do dia ao lado |
| **O radar de fontes** | `radar/` | Lê os feeds RSS e Atom de `fontes.json`, junta as notícias por pilar, tira as repetidas e dá nota a cada uma. Roda num computador ou servidor com acesso à internet |

## O dia a dia

1. **6h40:** a rotina grava a pauta do dia na página e manda a notificação no celular e no e-mail.
2. **Até as 9h:** Giovane abre a página (cerca de 10 minutos), confere as fontes e marca o que vai gravar.
3. **Durante o dia:** quem edita e agenda marca "gravado" e "postado" na própria página. Fica o registro do que saiu.
4. **Sábado e domingo:** não há pauta automática. Use o banco de ideias (`../canais/banco-de-ideias.md`) ou repita a melhor peça da semana.

Nada é postado sozinho. Toda notícia é conferida na fonte original antes de gravar, porque a pesquisa automática pode errar ou chegar atrasada.

## Como mexer em cada peça

**Na rotina:**

- Para pausar, mudar o horário, os dias ou os temas, peça na conversa com o Claude ou use a lista de rotinas do Claude.
- O texto completo da rotina está em `rotina-pauta-diaria.md`. Edite o arquivo e peça para atualizar a rotina com o texto novo.

**No calendário que aparece na página:**

1. Mude o gerador: `python3 ../canais/gerar_calendario.py`.
2. Monte a página: `python3 ../pauta/montar_pauta.py /caminho/da/saida.html`. A página montada não vai para o repositório, porque é gerada.
3. Peça ao Claude para republicar a página no mesmo link. Os roteiros e os status ficam no banco da página e não se perdem.

**No radar (opcional):**

```bash
python3 radar/radar.py                  # últimas 48 horas, 10 notícias por pilar, saída em radar/saida/
python3 radar/radar.py --horas 24 --top 12
python3 radar/radar.py --teste          # usa os feeds de exemplo da pasta radar/teste/, sem internet
```

- Só usa o Python padrão (3.9 ou mais novo).
- As fontes, as palavras de cada pilar e as buscas sugeridas ficam em `radar/fontes.json`.
- O resultado sai em Markdown e em JSON (`radar-AAAA-MM-DD.md` e `.json`).

## Por que a rotina usa a busca na web e não o radar

- O ambiente da nuvem do Claude bloqueia hoje os sites das fontes (os feeds respondem 403).
- Por isso a rotina pesquisa com a busca na web, que funciona.
- Para a rotina também ler os feeds, inclua os domínios das fontes na lista de domínios permitidos do ambiente: nas configurações do ambiente, em "Acesso à rede", escolha "Personalizado" e preencha "Domínios permitidos".
- Depois disso, dá para pedir que a rotina rode o radar antes de escrever.

## Custos e limites

- A rotina roda 5 vezes por semana e usa a cota do plano do Claude.
- Cada pauta é um documento pequeno, de 10 a 30 KB. A página guarda as 60 pautas mais recentes na tela; as antigas continuam no banco.
- Quem só pode ver (Viewer) ou comentar (Commenter) lê a pauta, mas não altera nada. Para alguém marcar o status, compartilhe a página como Contributor ou acima. Só quem edita a página (Editor) pode mudar a pauta em si.
