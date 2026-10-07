---
name: absorver-material
description: Absorve material do curso ou instruções do usuário para a base de conhecimento da IA Auditora (auditoria/conhecimento). Use sempre que chegar material novo, como aula, transcrição, PDF, slides, planilha, imagem, vídeo, exemplo real ou instrução enviada por mensagem, ou quando houver arquivos não registrados em 00_inbox. Registra a fonte, extrai com citações, consolida regras, conceitos, erros e perguntas, e detecta contradições.
---

# Absorver material

Objetivo: transformar material bruto em conhecimento **rastreável e verificável**, sem perder nada e sem
inventar nada. É a skill mais importante do sistema: tudo o que vem depois herda a qualidade desta etapa.

## 0. Antes de começar
- Releia `auditoria/decisoes.md` e a seção "Pendentes".
- Se o material vier em lote (curso inteiro), absorva **na ordem do curso**. Aulas posteriores refinam as
  anteriores, então ao terminar cada módulo revise as regras dos módulos anteriores.

## 1. Receber e preservar
- Coloque o arquivo em `auditoria/conhecimento/00_inbox/<modulo>/` com o nome original. Nunca edite nada em `00_inbox`.
- Instrução enviada por mensagem: salve o texto literal em
  `00_inbox/instrucoes/AAAA-MM-DD-<assunto>.md` (o conteúdo fica preservado; `--chat` só serve quando não há texto).
- Registre: `python3 auditoria/ferramentas/registrar_fonte.py <arquivo> --titulo "..." --modulo M1 --ordem N`

## 2. Converter para texto com localização
Gere `01_extraido/FONTE-xxxx.texto.md` com marcadores de localização em todo o texto:
- PDF: `[p.12]` por página (skill `anthropic-skills:pdf` ou `pdftotext -layout`).
- Slides: `[slide 7]` incluindo as notas do apresentador (skill `anthropic-skills:pptx`).
- docx / xlsx: skills correspondentes; planilha vira tabela Markdown com `[aba X, linha N]`.
- Imagem / gráfico: leia com a ferramenta Read e descreva **o que se vê**, separado da interpretação.
- Vídeo ou áudio: precisa de transcrição com tempo `[00:14:20]`. `ffmpeg` está instalado; para transcrever,
  `pip install faster-whisper` (o modelo vem do Hugging Face; se a rede bloquear, peça a transcrição ao
  usuário). Extraia o áudio com `ffmpeg -i video.mp4 -vn -ac 1 -ar 16000 audio.wav`, transcreva em pt e
  salve com tempos. Revise termos técnicos do curso que o ASR erra (compare com o glossário). Se houver
  conteúdo de tela essencial (gráficos), extraia quadros nos tempos citados (`ffmpeg -ss T -frames:v 1`)
  e descreva-os. O vídeo bruto **não vai para o git** (.gitignore); a transcrição vai.
  Nunca "resuma de memória" um vídeo.
- Confira se a conversão está completa (número de páginas, slides ou duração) e anote a cobertura no topo.

## 3. Extração fiel → `01_extraido/FONTE-xxxx.md`
Uma passada completa pelo texto, preenchendo o modelo abaixo. Para material grande, divida em blocos e
use subagentes em paralelo (um por fonte ou bloco) com este modelo. **Somente a thread principal atribui
IDs canônicos**; subagentes devolvem candidatos sem ID.

```markdown
# FONTE-xxxx — <título>
- cobertura: p.1–48 completas (ou 00:00–52:10)
- resumo: 3–5 linhas

## Conceitos            (termo | definição literal/fiel | loc)
## Regras candidatas    (enunciado | "citação literal" | loc | tipo | severidade se dita | exceções ditas)
## Procedimentos        (passos na ordem | loc)
## Erros / anti-padrões (erro | como aparece | o que seria o correto parecido | loc)
## Perguntas que o material manda fazer  (literal | loc)
## Números, limiares, parâmetros         (valor | contexto | loc)
## Exemplos concretos   (descrição | veredito dado pelo professor | loc)  → candidatos a benchmark
## Inferências minhas   (claramente separadas, com o raciocínio)
## Dúvidas / ambiguidades / possíveis conflitos com outras fontes
```

Gatilhos de leitura: procure ativamente por "sempre", "nunca", "antes de", "depois de", "só quando",
"não pode", "obrigatório", "o erro mais comum", "cuidado", "atenção", "pergunte-se", "verifique",
"checklist", "regra", "exceção", "a não ser que", "depende". Cada ocorrência é candidata a regra,
pergunta ou exceção.

## 4. Consolidar → `02_canonico/`
Para cada candidato:
1. Já existe na base? Acrescente a nova fonte ao item existente; não duplique. Se a nova fonte
   **refina** a regra, atualize o enunciado e mantenha as duas citações.
2. Conflita com algo existente ou com `decisoes.md`? Crie `X-xxxx` em `contradicoes.md` e não altere a
   regra até o usuário decidir.
3. É novo? Pegue o ID com `python3 auditoria/ferramentas/proximo_id.py R` (ou C, E, PR, P) e preencha
   **todos** os campos do modelo do arquivo. `status: explicito` só com citação literal; senão `inferido`.
4. Toda regra precisa de `como_verificar` e `evidencia_minima`. Se o material não deixa claro como
   verificar, isso é uma dúvida para o usuário, não um campo para inventar.
5. Todo erro comum precisa de `parecido_mas_correto`. É o que ensina a auditora a não dar falso positivo.

## 5. Perguntas (o coração do sistema)
- Toda pergunta que o material manda fazer vira `P-01xx` com `origem: curso` e fonte.
- Toda regra precisa de ao menos uma pergunta que a verifique. Se o curso não traz, crie uma pergunta
  derivada da regra com `origem: curso` e a mesma fonte da regra.
- Uma pergunta de curso que cobre uma semente: marque a semente `substituida por P-01xx`.
- Se o curso define perguntas que valem para **toda** auditoria, leve-as ao NÚCLEO (no máximo 12 linhas;
  substitua sementes em vez de só acrescentar).
- Teste de utilidade: se a resposta não pode mudar o veredito, não é pergunta de auditoria.

## 6. Fechar
1. Atualize a linha da fonte em `fontes.jsonl`: `status: consolidado`, `extracao: auditoria/conhecimento/01_extraido/FONTE-xxxx.md`.
2. `python3 auditoria/ferramentas/validar.py` sem erros; `python3 auditoria/ferramentas/cobertura.py`.
3. Uma linha em `auditoria/diario.md`.
4. Commit (`absorve FONTE-xxxx: <título>`) e push.

## 7. Relatório ao usuário (curto)
- O que entrou: N conceitos, N regras (explícitas/inferidas), N erros, N perguntas.
- **Perguntas ao usuário**: contradições abertas, regras inferidas que precisam de confirmação,
  severidades não definidas, dúvidas de "como verificar". Esta é a parte mais importante do relatório.
- Se o material respondeu algum item "Pendente" de `decisoes.md`, registre a decisão.

## Autoverificação antes de dizer "absorvido"
- [ ] Li 100% do material (cobertura anotada)?
- [ ] Cada regra tem citação literal e localização?
- [ ] Separei o que o material diz do que eu deduzi?
- [ ] Os exemplos concretos do professor foram guardados como candidatos a benchmark?
- [ ] Toda regra tem pergunta, `como_verificar` e `evidencia_minima`?
- [ ] Rodei a P-0016: que pergunta este material sugere que eu ainda não tenho?
