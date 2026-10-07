# Banco de perguntas do auditor

São as perguntas que a auditora precisa se fazer, **na ordem**, antes de concluir qualquer coisa.
Vêm de duas origens:

- `semente`: perguntas de método que existem antes do curso. Garantem rigor mínimo.
- `curso`: extraídas do material. Têm prioridade e substituem uma semente quando cobrem o mesmo ponto.

O bloco **NÚCLEO** abaixo é injetado automaticamente a cada mensagem (hook `UserPromptSubmit`).
Ele deve ficar curto (no máximo 12 linhas) e conter só as perguntas que valem para *toda* auditoria.
As demais ficam nas seções por fase e são carregadas pela skill `perguntas-do-auditor`.

Modelo de pergunta:

```
### P-0001 — pergunta em forma interrogativa
- fase: escopo | evidencia | regra | julgamento | sintese | meta
- origem: semente | curso
- fontes: FONTE-xxxx @ loc            (obrigatório se origem = curso)
- regras: R-xxxx                      (que regras esta pergunta ajuda a verificar)
- dispara_quando: sempre | condição
- resposta_esperada: tipo de resposta (sim/não + evidência, valor, lista…)
- se_nao_souber: o que fazer (pedir dado, marcar indeterminado, rebaixar confiança…)
- status: ativa | substituida por P-xxxx | revogada
```

---

<!-- NUCLEO:INICIO -->
NÚCLEO DO AUDITOR: responda antes de concluir, criar caso, gerar exemplo ou dar veredito
1. O que exatamente está sendo auditado, e com qual objetivo? (P-0001)
2. Que regras do curso se aplicam a ESTE objeto, e quais não se aplicam? Por quê? (P-0003)
3. Para cada regra aplicável: qual é a evidência concreta? Ela existe ou estou supondo? (P-0004, P-0005)
4. Isto é o que o material diz ou é inferência minha? Qual FONTE e localização? (P-0007)
5. Existe exceção, caso-limite ou erro "parecido mas correto" no curso que muda a conclusão? (P-0008)
6. O que está faltando para concluir, e isso torna o caso indeterminado? (P-0010)
7. Há contradição com outra fonte ou com uma decisão do usuário (decisoes.md)? (P-0011)
8. O que o curso manda perguntar especificamente neste tipo de situação? (perguntas de origem "curso")
<!-- NUCLEO:FIM -->

---

## Fase: escopo

### P-0001 — O que exatamente está sendo auditado, e com qual objetivo?
- fase: escopo
- origem: semente
- regras: —
- dispara_quando: sempre
- resposta_esperada: tipo de objeto + objetivo da auditoria
- se_nao_souber: perguntar ao usuário; não seguir sem saber
- status: ativa

### P-0002 — Em que contexto o objeto foi produzido (período, mercado, ativo, versão do método)?
- fase: escopo
- origem: semente
- regras: —
- dispara_quando: sempre
- resposta_esperada: contexto relevante ao método
- se_nao_souber: registrar como lacuna; se uma regra depende do contexto, ela fica indeterminada
- status: ativa

## Fase: regra

### P-0003 — Que regras se aplicam a este objeto, e quais estão explicitamente fora?
- fase: regra
- origem: semente
- regras: todas
- dispara_quando: sempre
- resposta_esperada: lista de R-xxxx aplicáveis + não aplicáveis com motivo
- se_nao_souber: listar como "aplicabilidade indeterminada"
- status: ativa

### P-0007 — Isto está no material ou é inferência minha? Onde exatamente?
- fase: regra
- origem: semente
- regras: —
- dispara_quando: sempre
- resposta_esperada: FONTE-xxxx @ loc, ou "inferido"
- se_nao_souber: tratar como inferido; não usar para reprovar
- status: ativa

### P-0008 — Existe exceção, caso-limite ou erro "parecido mas correto" que muda a conclusão?
- fase: regra
- origem: semente
- regras: todas
- dispara_quando: sempre que houver não conformidade
- resposta_esperada: referência a `excecoes` da regra ou a `parecido_mas_correto` do erro
- se_nao_souber: reler a regra e os erros relacionados antes de concluir
- status: ativa

## Fase: evidência

### P-0004 — Para cada regra aplicável, qual é a evidência concreta?
- fase: evidencia
- origem: semente
- regras: todas
- dispara_quando: sempre
- resposta_esperada: trecho, valor ou observação citável do objeto
- se_nao_souber: conformidade = indeterminado
- status: ativa

### P-0005 — A evidência é suficiente (atinge a `evidencia_minima` da regra) ou estou supondo?
- fase: evidencia
- origem: semente
- regras: todas
- dispara_quando: sempre
- resposta_esperada: sim/não + o que falta
- se_nao_souber: rebaixar a confiança
- status: ativa

### P-0006 — A evidência poderia ter outra explicação que não viola a regra?
- fase: evidencia
- origem: semente
- regras: todas
- dispara_quando: em não conformidade
- resposta_esperada: explicações alternativas e por que foram descartadas
- se_nao_souber: registrar como ressalva
- status: ativa

## Fase: julgamento

### P-0009 — A severidade que estou atribuindo é a que o curso atribui?
- fase: julgamento
- origem: semente
- regras: todas
- dispara_quando: em não conformidade
- resposta_esperada: severidade da regra com fonte
- se_nao_souber: usar a severidade da regra; se ela for `inferido`, avisar
- status: ativa

### P-0010 — O que falta para concluir? A falta torna o caso indeterminado?
- fase: julgamento
- origem: semente
- regras: —
- dispara_quando: sempre
- resposta_esperada: lista de lacunas + impacto no veredito
- se_nao_souber: veredito = inconclusivo
- status: ativa

### P-0011 — Há contradição com outra fonte ou com uma decisão do usuário?
- fase: julgamento
- origem: semente
- regras: —
- dispara_quando: sempre
- resposta_esperada: X-xxxx / D-xxxx relevantes
- se_nao_souber: consultar contradicoes.md e decisoes.md
- status: ativa

## Fase: síntese

### P-0012 — O veredito decorre só dos achados, ou estou acrescentando opinião?
- fase: sintese
- origem: semente
- regras: —
- dispara_quando: sempre
- resposta_esperada: veredito justificado por achados citados
- se_nao_souber: remover o que não tiver achado por trás
- status: ativa

### P-0013 — Um avaliador humano do curso chegaria ao mesmo veredito com as mesmas evidências?
- fase: sintese
- origem: semente
- regras: —
- dispara_quando: sempre
- resposta_esperada: sim, ou ponto de divergência provável
- se_nao_souber: baixar a confiança e explicar
- status: ativa

## Fase: meta (sobre o próprio sistema; usar ao gerar casos e exemplos)

### P-0014 — Este caso ou exemplo ensina algo que a base ainda não cobre, ou é redundante?
- fase: meta
- origem: semente
- regras: —
- dispara_quando: ao gerar benchmark ou dataset
- resposta_esperada: regra/erro/caso-limite coberto + contagem atual (cobertura.py)
- se_nao_souber: rodar cobertura.py
- status: ativa

### P-0015 — O gabarito está certo só por causa do curso, ou depende de conhecimento externo?
- fase: meta
- origem: semente
- regras: —
- dispara_quando: ao gerar benchmark ou dataset
- resposta_esperada: todas as conclusões citam R-xxxx
- se_nao_souber: descartar o item ou mandar para revisão
- status: ativa

### P-0016 — Que pergunta o material sugere que eu ainda não tenho no banco?
- fase: meta
- origem: semente
- regras: —
- dispara_quando: ao absorver material
- resposta_esperada: novas P-xxxx com fonte
- se_nao_souber: reler os trechos onde o material usa "pergunte-se", "verifique", "antes de…", "nunca…"
- status: ativa

---

## Perguntas do curso

(Preenchido pela skill `absorver-material`. Numerar a partir de P-0100 para separar visualmente das
sementes.)
