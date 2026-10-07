# GL Academy — repositório

Este repositório tem duas partes independentes:

1. **Landing page** (`index.html`, `script.js`, `styles.css`, `logo-gl.png`): funil de agendamento do GL Model.
2. **Sistema da IA Auditora** (`auditoria/`): base de conhecimento extraída do curso, certificação,
   benchmark e geração de dataset para treinar uma IA auditora.

O resto deste arquivo trata da parte 2.

---

## Sistema da IA Auditora

### O princípio central

Tudo o que a auditora sabe vem **do material do curso**, com rastreabilidade. Nenhuma regra, pergunta,
caso de benchmark ou exemplo de dataset existe sem apontar para a fonte que o justifica.

Os três produtos usam **o mesmo formato de saída**, o *laudo* (`auditoria/schemas/laudo.schema.json`):
- **certificação**: a auditora emite um laudo sobre um objeto real;
- **benchmark**: o gabarito é um laudo esperado e o modelo é pontuado contra ele;
- **dataset**: o alvo de treino é um laudo.

Assim o que se treina é exatamente o que se mede e o que se entrega.

### Regras de ouro (valem em toda tarefa deste sistema)

1. **Não inventar.** Se o curso não diz, não é regra. Uma inferência minha é marcada como `inferido`
   e só vira regra quando o usuário confirma.
2. **Citar sempre.** Cada regra, pergunta, achado e exemplo traz `FONTE-xxxx` + localização (página,
   slide, minuto).
3. **Explícito e inferido ficam separados.** O que o material diz literalmente é uma coisa; o que eu
   deduzo é outra.
4. **Contradição não se resolve sozinha.** Se duas fontes divergem, registro em
   `conhecimento/02_canonico/contradicoes.md` e pergunto ao usuário; não escolho um lado.
5. **Rodar o ciclo de perguntas antes de concluir.** Antes de qualquer veredito, laudo, caso ou
   exemplo, passo pelo banco `auditoria/perguntas/perguntas.md` (skill `perguntas-do-auditor`).
6. **Validar antes de commitar.** `python3 auditoria/ferramentas/validar.py` precisa sair limpo.
7. **Decisões do usuário são permanentes.** Ficam registradas em `auditoria/decisoes.md` e eu releio
   esse arquivo antes de agir.

### Skills (em `.claude/skills/`)

| Skill | Quando usar |
|---|---|
| `absorver-material` | Chegou material novo (curso, PDF, transcrição, instrução, planilha, imagem). |
| `perguntas-do-auditor` | Antes de qualquer conclusão, e para manter o banco de perguntas. |
| `certificar` | Emitir laudo ou certificação sobre um objeto real. |
| `benchmark` | Criar casos de teste ou avaliar um modelo auditor. |
| `gerar-dataset` | Produzir exemplos de treino (JSONL). |
| `auditar-base` | Checagem periódica da base: lacunas, órfãos, contradições, cobertura. |

### Mapa de pastas

```
auditoria/
  decisoes.md                  decisões do usuário (fonte de verdade sobre "como fazer")
  diario.md                    log do que foi absorvido/gerado e quando
  conhecimento/
    fontes.jsonl               manifesto: uma linha por material recebido (FONTE-xxxx)
    00_inbox/                  material bruto, nunca é editado
    01_extraido/               notas fiéis por fonte, com citações
    02_canonico/               base consolidada: conceitos, regras, procedimentos, erros, contradições
  perguntas/perguntas.md       banco de perguntas (P-xxxx); o "núcleo" é injetado a cada prompt
  certificacao/                rubrica + registros emitidos
  benchmark/                   casos (gabarito) + execuções (resultados)
  dataset/                     gerado / rejeitado / exportado
  schemas/                     JSON Schemas: laudo, caso, exemplo, certificação, fonte
  ferramentas/                 validar.py, cobertura.py, hooks
```

### IDs

`FONTE-0001` material · `C-0001` conceito · `R-0001` regra · `P-0001` pergunta ·
`E-0001` erro comum · `X-0001` contradição · `BM-0001` caso de benchmark ·
`DS-<hash>` exemplo de dataset · `CERT-AAAA-0001` certificação · `D-0001` decisão do usuário.

IDs nunca são reaproveitados. Uma regra revogada continua no arquivo com `status: revogada`.

### Comandos

```bash
python3 auditoria/ferramentas/validar.py        # schemas + integridade referencial + vazamento
python3 auditoria/ferramentas/cobertura.py      # regras x perguntas x casos x exemplos
```

### Hooks ativos (`.claude/settings.json`)

- **SessionStart**: mostra o estado da base (fontes, regras, perguntas, contradições abertas, decisões).
- **UserPromptSubmit**: injeta o núcleo do banco de perguntas a cada mensagem. É isso que garante a
  auto-interrogação contínua, sem depender de eu lembrar.
