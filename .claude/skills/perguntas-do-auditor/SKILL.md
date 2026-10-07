---
name: perguntas-do-auditor
description: Executa o ciclo de auto-interrogação do auditor (banco auditoria/perguntas/perguntas.md) antes de qualquer conclusão, como laudo, certificação, gabarito de benchmark ou exemplo de dataset, e mantém o banco de perguntas (adicionar, substituir, revogar, ajustar o NÚCLEO). Use sempre que for julgar algo segundo a metodologia do curso, ou quando o material ensinar uma nova pergunta.
---

# Perguntas do auditor

O banco de perguntas é o que a auditora aprende a **pensar**. O núcleo é injetado a cada mensagem pelo
hook `UserPromptSubmit`; esta skill aplica o banco completo.

## Modo A: executar o ciclo (antes de qualquer conclusão)

1. Carregue `auditoria/perguntas/perguntas.md`, `regras.md`, `erros_comuns.md` e `decisoes.md`.
2. Monte a lista do caso:
   - todas as perguntas `ativa` com `dispara_quando: sempre`;
   - as perguntas ligadas às regras aplicáveis (campo `regras` da pergunta ou `perguntas` da regra);
   - as condicionais cuja condição se cumpre.
   Perguntas de `origem: curso` vêm antes das sementes da mesma fase.
3. Responda **na ordem das fases**: escopo → regra → evidência → julgamento → síntese. Não pule fases:
   julgar antes de ter evidência é o erro mais comum.
4. Para cada pergunta, registre `{id, resposta, status}`:
   - `respondida`: com evidência concreta do objeto (cite o trecho ou valor);
   - `sem_evidencia`: o dado não existe, então siga o `se_nao_souber` da pergunta;
   - `nao_aplicavel`: diga por quê.
5. Regras de parada:
   - P-0001 sem resposta: **pare** e pergunte ao usuário.
   - Evidência mínima ausente para uma regra crítica: o achado fica `indeterminado` e o veredito
     tende a `inconclusivo`, nunca a `reprovado` por suposição.
   - Contradição aberta (X-xxxx) que afeta o caso: o veredito sai com ressalva e vai para revisão humana.
6. A lista resultante é o campo `perguntas` do laudo. Os achados e o veredito só podem usar o que foi
   respondido aqui.

Formato de trabalho (rascunho interno antes do laudo):

```
P-0001 [escopo]   → ...                              respondida
P-0100 [evidência] (R-0003) → "stop às 9:45, entrada 9:30"  respondida
P-0005 [evidência] → falta horário de definição do alvo     sem_evidencia → R-0007 indeterminado
```

## Modo B: manter o banco

- **Adicionar**: ID via `python3 auditoria/ferramentas/proximo_id.py P` (perguntas do curso começam em
  P-0100). Preencha todos os campos. `origem: curso` exige FONTE.
- **Substituir**: a nova pergunta cobre uma antiga, que fica `substituida por P-xxxx` (não apague).
- **Revogar**: `status: revogada` + motivo + decisão D-xxxx, se veio do usuário.
- **NÚCLEO** (entre `NUCLEO:INICIO` e `NUCLEO:FIM`): só perguntas que valem para toda auditoria, no
  máximo ~12 linhas, cada uma com o(s) ID(s) entre parênteses. Ao incluir, troque uma linha em vez de
  acrescentar. O validador avisa se passar do limite.
- **Teste de qualidade** de toda pergunta:
  1. A resposta pode mudar o veredito ou a confiança? Se não, não entra.
  2. Dá para responder olhando o objeto auditado? Se não, diga que dado precisa existir.
  3. Está ligada a pelo menos uma regra (ou é de escopo/síntese)?
  4. É uma pergunta, e não uma regra disfarçada? ("Verifique X" é regra; "X está presente?" é pergunta.)

## Meta-perguntas que eu mesmo devo me fazer sempre (sobre o meu trabalho)
- Estou respondendo com o curso ou com o que eu "acho" sobre o assunto?
- O usuário já decidiu algo sobre isso? (decisoes.md)
- Alguma pergunta do banco ficou sem resposta e eu concluí mesmo assim?
- Se o professor do curso lesse meu laudo, apontaria alguma pergunta que eu deixei de fazer?
  Se sim, ela entra no banco.
