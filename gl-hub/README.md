# GL Hub Academy

Conector oficial da GL Academy para o Claude. O aluno adiciona o GL Hub no claude.ai (ou no app, ou no Claude Code) e o Claude dele passa a responder com base no que a GL ensina: busca dentro das transcrições das aulas, aponta o minuto exato, manda o link do vídeo no ponto certo e monta plano de estudo.

## Como funciona (e por que não é "treinar" uma IA)

Não existe um modelo treinado só da GL. O que fazemos é dar ao Claude acesso à base da GL por um **servidor MCP** (Model Context Protocol), o mesmo padrão que o Claude usa para conectores:

```
Aluno no claude.ai ──► Claude ──► GL Hub (servidor MCP) ──► conteudo/
                                    buscar · ver_aula · ler_artigo · listar_cursos
```

Vantagens: atualizar o conteúdo é só editar arquivos (sem retreinar nada), o Claude cita a fonte exata e o acesso é controlado por chave de membro.

O "treinamento" de comportamento fica em [`conteudo/instrucoes.md`](conteudo/instrucoes.md): tom de mentor, sempre buscar antes de responder, citar aula e minuto, e os limites obrigatórios (conteúdo educacional, sem recomendação de compra/venda).

## Estrutura

```
gl-hub/
├── conteudo/                 ← o que a equipe edita
│   ├── instrucoes.md         como o Claude deve se comportar
│   ├── cursos.json           cursos › módulos › aulas
│   ├── transcricoes/         uma legenda .vtt ou .srt por aula
│   └── base/                 artigos em Markdown (produtos, glossário, suporte…)
├── mcp-server/               o servidor (Node.js)
├── docs/claude-no-gl-hub.html  página para os alunos ("Claude no GL Hub")
└── Dockerfile
```

## Adicionando conteúdo

### Aulas

1. Transcreva o vídeo e exporte a legenda em `.srt` ou `.vtt` (YouTube Studio, Vimeo, Panda, Descript, Whisper, qualquer um serve). Salve em `conteudo/transcricoes/`.
2. Cadastre a aula em `conteudo/cursos.json`:

```json
{
  "id": "gl-model-01-introducao",
  "titulo": "Introdução ao GL Model",
  "resumo": "Uma frase sobre o que a aula ensina.",
  "duracao": "18:40",
  "video_url": "https://www.youtube.com/watch?v=XXXX",
  "transcricao": "gl-model-01-introducao.srt",
  "tags": ["gl model", "iniciante"],
  "materiais": [{ "titulo": "Checklist PDF", "url": "https://..." }],
  "exclusivo": true
}
```

`exclusivo` pode ir na aula ou no curso inteiro. Conteúdo exclusivo só aparece para quem conecta com chave de membro. Links do YouTube e Vimeo ganham o minuto automaticamente (`&t=754s`, `#t=754s`).

### Artigos da base

Um arquivo `.md` por assunto em `conteudo/base/`. Divida em seções `## ` (a busca aponta a seção certa). Cabeçalho:

```markdown
---
titulo: GL Risk Auto
categoria: produtos
resumo: Uma frase.
exclusivo: nao
---
```

Comentários `<!-- ... -->` são notas internas e **não chegam ao Claude**. Os artigos de produto já criados têm `<!-- PREENCHER -->` marcando o que falta escrever.

Depois de editar o conteúdo, reinicie o servidor.

## Rodando localmente

```bash
cd gl-hub/mcp-server
npm install
GL_HUB_CHAVES="chave-do-aluno-1,chave-do-aluno-2" npm start   # http://localhost:3333/mcp
npm test
```

Teste no Claude Code: `claude mcp add --transport http gl-hub http://localhost:3333/mcp --header "Authorization: Bearer chave-do-aluno-1"`.

| Variável | O que faz |
|---|---|
| `PORT` | Porta HTTP (padrão 3333) |
| `GL_HUB_CHAVES` | Chaves de membro, separadas por vírgula. Sem chave, o aluno vê só o conteúdo aberto; chave inválida recebe 401. Para revogar, tire a chave da lista e reinicie. |
| `GL_HUB_CONTEUDO` | Pasta de conteúdo (padrão `../conteudo`) |

`GET /saude` mostra quantos cursos, aulas e artigos foram carregados.

## Publicando

O claude.ai precisa de uma URL pública com HTTPS. Qualquer hospedagem de container serve (Railway, Render, Fly.io, Cloud Run):

```bash
cd gl-hub
docker build -t gl-hub .
docker run -p 3333:3333 -e GL_HUB_CHAVES=... gl-hub
```

Depois aponte um subdomínio (sugestão: `mcp.glacademytrading.com`, que é o que a página de docs já usa) e entregue a cada aluno o link `https://mcp.glacademytrading.com/mcp?chave=CHAVE_DELE`.

## Próximas fases

1. **Login de membro (OAuth)** no lugar da chave na URL: o aluno clica em "Conectar", faz login na GL e autoriza, igual ao Vibehub. Depende de onde ficam as contas dos alunos hoje.
2. **Progresso e trilha**: ferramenta `meu_progresso` lendo as aulas concluídas do aluno, para o plano de estudo considerar onde ele parou.
3. **Player no chat**: widget (MCP Apps) que abre o vídeo da aula dentro da conversa no minuto certo.
4. **Comunidade**: publicar dúvidas e wins na comunidade, sempre com aprovação do aluno antes.
5. **Busca semântica** (embeddings) quando a base passar de algumas centenas de aulas.
