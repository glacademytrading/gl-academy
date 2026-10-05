# Marketing GL Academy

O mapa desta pasta. Comece pelos dois planos: o de 2026–27 diz o que publicar, onde e quando; o do ciclo diz como cada canal vira call e cliente.

## Os planos

| Arquivo | O que tem |
| --- | --- |
| `plano-de-marketing-2026-27.md` | Marcas e canais (@glacademybr, @glacademytrading, @lazarotrades, YouTube, LinkedIn, newsletter), posicionamento, os 5 pilares, as 12 séries, a semana-tipo, a ordem de postar, o YouTube, a educação em IA, a autoridade, a pauta automática, a Higgsfield, as 13 semanas, os números e os riscos |
| `plano-de-marketing.md` | O plano do ciclo até 31/12: a meta de calls 1x1, o funil e os 6 pilares (Conteúdo, Tráfego pago, Divulgação, Imprensa, Relações públicas e Vendas) |
| `PROMPT-continuidade.md` | O texto para continuar o projeto numa conversa nova com o Claude |
| `glossario.md` | Os nomes da GL, para todo mundo falar a mesma língua |

## As pastas

| Pasta | O que tem |
| --- | --- |
| `canais/` | Perfis e bios, os primeiros roteiros, o banco de 120 ideias, os modelos e checklists, o calendário mestre dia a dia (`gerar_calendario.py`), a semana-tipo e a arte do plano (`arte/`) |
| `automacao/` | A rotina da pauta diária (o texto completo) e o radar de fontes RSS |
| `pauta/` | A página Pauta GL: o modelo e o script que põe o calendário dentro dela |
| `execucao/` | Os calendários prontos da marca, a campanha GL Risk Auto, a série Operacional na prática, anúncios, placar semanal, imprensa, crise, parceiros e vendas |
| `site/` | Os prompts para o Codex colocar os vídeos no site |
| `mentoria/` | O plano da Mentoria GL, os roteiros das aulas e os prints que faltam |
| `videos/` | O motor que transforma os prints reais em vídeos e imagens sem gastar crédito, a Biblioteca e os kits |
| `organizacao/` | O organizador da pasta de marketing no Windows |
| `roteiros-e-depoimentos.md`, `roteiros-gl-risk-auto.md` | Roteiros para gravar com rosto e o guia de depoimentos |

## As páginas

São privadas: só abre quem recebeu acesso pelo menu de compartilhar de cada página.

| Página | Para quê |
| --- | --- |
| [Pauta GL](https://claude.ai/artifact/YH7Bzpianz4oLt52Fwi5ba) | Os roteiros de cada dia útil, com fontes e status, e o calendário do dia |
| [Sistema de Marketing GL](https://claude.ai/artifact/7MhNCUVNeDtQACf9euH5Ns) | O status de cada ação do plano do ciclo e a meta oficial |
| [Biblioteca de Vídeos GL](https://claude.ai/artifact/BgpMsKZZn2BikAYBcXSDfm) | Todos os vídeos e imagens feitos com os prints, para baixar e postar |
| [Campanha GL Risk Auto](https://claude.ai/artifact/YGFyAnt64pTYPbqzFsjhr1) | Os vídeos, imagens, legendas e anúncios do GL Risk Auto, os 2 vídeos do site e as peças extras |
| [Carrosséis e Stories GL](https://claude.ai/artifact/AVHWWSnHp4TPyVGiCm2tsp) | Os carrosséis e stories da série Operacional na prática |

## O que roda sozinho

- **A rotina "Pauta GL · radar e roteiros do dia":** de segunda a sexta, às 6h40, pesquisa as novidades e grava 5 roteiros na Pauta GL. Detalhes em `automacao/rotina-pauta-diaria.md`.
- Nada é postado sozinho: a publicação é sempre de uma pessoa.

## Comandos

```bash
python3 canais/gerar_calendario.py               # calendário mestre e semana-tipo (CSV)
python3 pauta/montar_pauta.py /tmp/pauta.html    # a página Pauta GL com o calendário novo (depois, republicar no mesmo link)
node canais/arte/render.js /tmp/arte             # os 3 pôsteres em PNG e o PDF
python3 automacao/radar/radar.py --teste         # o radar com os feeds de exemplo
```

O motor de vídeo tem os próprios comandos em `videos/README.md`.

## As regras que valem para tudo

- Nenhuma promessa de lucro, renda ou aprovação em mesa proprietária. Nenhuma recomendação de compra ou venda de ativo.
- Resultado só em R ou pontos, com "resultado passado não garante resultado futuro". Nada de saldo em dólar.
- Replay com o selo "Replay · exemplo educacional" e o aviso de risco. "GL Gamma: assinatura à parte" onde aparecer o Gamma.
- A IA nunca redesenha o gráfico real. Notícia de IA é conferida na fonte original antes de gravar.
- Os checklists completos estão em `canais/modelos-e-checklists.md`.
