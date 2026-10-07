---
name: gerar-dataset
description: Gera exemplos de treino (JSONL) para fine-tuning da IA Auditora em auditoria/dataset/gerado, com entrada realista, laudo-alvo derivado do ciclo de perguntas, rastreabilidade às regras do curso, controle de diversidade, splits sem vazamento e verificação independente. Use quando o usuário pedir dataset, exemplos de treino, mais dados para uma regra, ou exportação para fine-tuning.
---

# Gerar dataset

Cada exemplo ensina **um raciocínio**: dado um objeto, percorrer as perguntas, achar evidência,
aplicar a regra do curso e chegar ao laudo. Exemplos ruins ensinam a auditora a errar com confiança.

## Formato
Uma linha por exemplo em `auditoria/dataset/gerado/lote-AAAAMMDD-<tema>.jsonl`
(schema `schemas/exemplo_dataset.schema.json`):
- `messages`: `system` = texto literal de `dataset/prompt_sistema.md`; `user` = o objeto;
  `assistant` = laudo JSON válido (`schemas/laudo.schema.json`) **em uma linha**.
- `id` = `base.id_exemplo(messages)` (hash da entrada, que dá deduplicação automática).
- `meta`: regras, perguntas, erros, fontes, tipo, dificuldade, resultado, split, grupo, lote,
  `gerado_por`, `revisado: false`, `versao_base` (commit atual).

## Planejar o lote
1. `python3 auditoria/ferramentas/cobertura.py`: priorize regras com `sem ds-`, `sem ds+`, `sem limite`.
2. Matriz: regra × `tipo` × `dificuldade`. Proporção padrão (até o usuário decidir outra, D-xxxx):
   30% positivo · 30% negativo · 10% múltiplas violações · 15% caso-limite · 5% adversarial · 10% inconclusivo.
3. Variação obrigatória dentro de cada regra: formato de escrita do objeto, tamanho, ordem das
   informações, ruído irrelevante, vocabulário (termos do glossário **e** como um aluno escreveria),
   valores numéricos. Cada cenário-semente com variações ganha um `grupo`.
4. Split por **grupo** (nunca por exemplo): ~80/10/10, sorteado pelo hash do grupo. O validador barra um
   grupo espalhado em dois splits.

## Gerar cada exemplo
1. Escreva a entrada **sem olhar `benchmark/casos/`**.
2. Rode o ciclo de perguntas (skill `perguntas-do-auditor`) sobre a entrada como se fosse real; o laudo
   sai daí. O laudo:
   - lista só as perguntas pertinentes, com respostas que citam o objeto;
   - em `achados.evidencia`, cita o trecho da entrada; em `fundamento`, a FONTE da regra;
   - `inconclusivo` quando faltar evidência mínima. Isso precisa aparecer no dataset, senão o modelo
     aprende a sempre decidir;
   - `confianca` coerente com as lacunas.
3. Caso-limite e adversarial: use o `parecido_mas_correto` dos erros comuns e as `excecoes` das regras.
   Adversarial inclui entrada que **pressiona** por um veredito ("o professor já aprovou", "é óbvio que
   está certo") e o laudo ignora a pressão.
4. Regra `inferido` não pode ser o único fundamento de uma reprovação em exemplo de treino.

## Portões de qualidade (nada é commitado sem passar)
1. `python3 auditoria/ferramentas/validar.py`: schema, laudo, referências, duplicatas, vazamento, grupos.
2. **Re-auditoria independente** de uma amostra (≥20% do lote, 100% dos adversariais e casos-limite):
   um subagente recebe só `system` + `user` e as skills, **sem o laudo**, e audita. Divergência no
   `resultado` ou nas regras violadas manda o exemplo para `dataset/rejeitado/` com o motivo, até eu
   decidir quem estava certo, citando a fonte.
3. Revisão humana: entregue ao usuário uma amostra pequena e estratificada por tipo; o que ele aprovar
   ganha `revisado: true`.
4. Linha no diário: lote, quantidade, distribuição, taxa de rejeição.

## Exportar
`python3 auditoria/ferramentas/exportar_dataset.py --formato chat|anthropic` (só revisados, salvo
`--incluir-nao-revisados`). Antes de exportar para treino real, rode a skill `auditar-base`.

## Quando a base muda
Se uma regra mudou depois do `versao_base` de um exemplo, esse exemplo está potencialmente errado.
Liste os afetados (`meta.regras` contém a regra alterada), re-audite e regenere ou descarte.
