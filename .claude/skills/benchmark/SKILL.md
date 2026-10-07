---
name: benchmark
description: Cria e mantém o benchmark da IA Auditora (casos com gabarito derivado do curso em auditoria/benchmark/casos) e pontua modelos contra ele com auditoria/ferramentas/pontuar.py. Use para criar casos de teste, montar uma nova versão do benchmark, avaliar um modelo auditor ou comparar execuções.
---

# Benchmark

O benchmark mede se um modelo audita **como o curso ensina**. Ele vale exatamente o que valem os gabaritos:
um gabarito errado treina o time inteiro a otimizar o erro.

## Princípios
- **Gabarito só do curso.** Todo achado esperado cita uma regra R-xxxx; toda regra cita FONTE. Se o
  veredito depende de conhecimento externo ao curso, o caso não entra (P-0015).
- **Benchmark é congelado.** Arquivo `casos/vN.jsonl`. Depois da primeira execução oficial, os casos de
  uma versão não mudam; correções geram `vN+1` e o motivo vai para o diário.
- **Isolamento.** Caso de benchmark nunca vira exemplo de dataset nem variação de um. `validar.py`
  bloqueia cópia idêntica e avisa quando a semelhança é alta. Ao gerar dataset, não leia `casos/`.
- **Revisão humana.** Só casos com `revisado: true` entram no score oficial. Casos gerados por mim
  começam `false`; peça ao usuário para revisar uma amostra por lote.

## Criar casos
1. Rode `python3 auditoria/ferramentas/cobertura.py` e veja as regras sem caso e sem armadilha.
2. Monte a matriz do lote: regra (ou grupo de regras) × `categoria` × `dificuldade`. Mínimo por regra
   ativa: 1 `violacao_unica`, 1 `conforme` que a exercite e 1 `falso_positivo_armadilha` (situação
   parecida com o erro, mas correta segundo `parecido_mas_correto`). Regras críticas: também
   `evidencia_insuficiente` e `caso_limite`.
   Distribuição de `resultado` aproximadamente equilibrada, porque um benchmark só de reprovações premia
   quem reprova tudo.
3. Origem preferencial, em ordem: exemplos concretos do professor (seção "Exemplos" das extrações) →
   casos reais anonimizados com veredito humano → sintéticos.
4. Escreva a `entrada` **exatamente** no formato em que a auditora vai receber objetos reais.
5. Para cada caso, rode o ciclo de perguntas (skill `perguntas-do-auditor`) para derivar o gabarito:
   `achados_esperados`, `achados_proibidos` (armadilhas), `lacunas_esperadas`, `perguntas_criticas`,
   `resultados_aceitaveis` apenas em caso-limite genuíno.
6. ID via `proximo_id.py BM`; `fontes` = FONTEs das regras envolvidas.
7. `validar.py` → commit.

## Avaliar um modelo
1. Entradas: para cada caso, mensagens = `system` (de `auditoria/dataset/prompt_sistema.md`, idêntico ao
   do treino) + `user` (= `entrada`).
2. O usuário (ou um script dele) roda o modelo e salva `{"id": "BM-0001", "saida": "<texto>"}` por linha.
   Eu não gero predições "de baseline" lendo os gabaritos, porque isso não mede nada.
3. `python3 auditoria/ferramentas/pontuar.py predicoes.jsonl --nome <modelo>-<data>`
4. Leia o relatório: `acerto_resultado`, precisão e recall de violações, `taxa_armadilha` (falso
   positivo induzido), `formato_valido`, cobertura das perguntas críticas, e os quebrados por categoria
   e dificuldade. Liste os 10 piores casos e **diagnostique**: falha de regra, de pergunta, de evidência
   ou de formato?
5. Cada padrão de falha vira ação: mais exemplos de dataset naquela regra ou categoria, pergunta nova
   no banco, ou regra mal escrita para revisar com o usuário.
6. Linha no diário com o resumo da execução.

## Pesos da nota
Os pesos ficam em `PESOS`, no topo de `pontuar.py`. Mudar exige decisão D-xxxx do usuário,
e execuções com pesos diferentes não são comparáveis.
