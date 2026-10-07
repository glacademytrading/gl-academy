# Regras (o que a auditora verifica)

Cada regra precisa ser **verificável**: dado um objeto auditado, deve ser possível dizer conforme,
não conforme ou indeterminado, e apontar a evidência.

Modelo:

```
### R-0001 — Título imperativo curto
- enunciado: o que deve (ou não deve) acontecer
- citacao: "trecho literal do material"
- fontes: FONTE-0001 @ p.12
- tipo: obrigatoria | proibicao | recomendacao | condicional
- condicao: (se condicional) quando se aplica
- severidade: critica | alta | media | baixa
- como_verificar: que evidência confirma ou refuta
- evidencia_minima: o que precisa existir para não ser "indeterminado"
- perguntas: P-xxxx
- erros_relacionados: E-xxxx
- excecoes: casos que o material excetua
- status: explicito | inferido | revogada
```

`severidade` e `tipo` vêm do material; se o material não define, marcar `inferido` e perguntar.

---
