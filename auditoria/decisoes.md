# Decisões do usuário

Fonte de verdade sobre **como** o sistema deve operar. Releia este arquivo antes de qualquer tarefa.
Uma decisão nova que contradiga uma antiga marca a antiga como `substituída por D-xxxx`; ela não é apagada.

Formato:

```
## D-0001 — título curto
- data: AAAA-MM-DD
- contexto: o que motivou a pergunta
- decisão: o que o usuário decidiu (literal quando possível)
- impacto: arquivos/skills afetados
- status: vigente | substituída por D-xxxx
```

---

## D-0001 — Escopo do sistema
- data: 2026-10-07
- contexto: pedido inicial.
- decisão: "criar sistema de certificação, benchmark e geração de dataset para treinamento de uma IA
  auditora". O usuário enviará um curso completo, instruções e arquivos. O processo ensinado no material
  define o que a auditora deve se perguntar.
- impacto: estrutura inteira de `auditoria/` e as 6 skills.
- status: vigente

## Pendentes (perguntar ao usuário quando o material permitir)
- [ ] O que exatamente a auditora audita? (operações/trades, alunos, estratégias, relatórios, outro)
- [ ] Quem/o que é certificado? (alunos, operações, a própria IA) Há níveis de certificação?
- [ ] Modelo-alvo do fine-tuning e formato de exportação (OpenAI chat JSONL, Anthropic, HF, outro)
- [ ] Volume-alvo do dataset e proporção desejada entre treino, validação e teste
- [ ] Idioma da auditora (pt-BR apenas?)
