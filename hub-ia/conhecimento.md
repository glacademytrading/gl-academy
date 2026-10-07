# Base de Conhecimento IA · GL Academy

Resumo organizado do material de cursos de IA salvo no Drive (`CURSO IA`), feito para uso interno da GL.
Serve de referência para montar nossos cursos, serviços e ofertas. Os cursos são de terceiros: use como base de estudo e escreva o nosso material com as nossas palavras, exemplos e casos.

**Fontes lidas:** Módulo 2 (A Base), Módulo 3 (Agentes), Vibe Coding, Vibe Business, Agente de WhatsApp, "8 Problemas que empresas pagariam R$10k/mês", "Bot que toca um negócio sozinho" (case Felix), PDFs "11 serviços", "8 automações", "9 setores" e "9 tarefas manuais", e as imagens nomeadas da pasta `GRAVAÇÔES PARA CURSO DE IA 2`.
**Ainda não processado:** ver a seção 10.

---

## 1. O método em uma frase

Um agente de IA (Claude Code) trabalhando dentro de um ambiente organizado (pastas em Markdown), conectado a ferramentas (APIs, banco, WhatsApp), executando tarefas reais e assistido por uma pessoa que aprova o que é sensível.

Princípio que aparece em todos os módulos: **simples, efetivo e sustentável**. Se uma tarefa simples ficou complexa, está errado. O que não dá para manter, morre.

## 2. A base (stack)

| Peça | Ferramenta | Para quê |
|---|---|---|
| Motor | **Claude Code** (app, aba Code) | Executa: lê, cria e edita arquivos, roda comandos, usa skills e conectores |
| Ambiente | **Obsidian** (vaults em Markdown) + Obsidian Sync | Onde o agente "mora". Cada setor vira um vault com um `CLAUDE.md` que explica o contexto |
| Outras IAs | **OpenRouter** (uma chave para quase todos os modelos); Fal.ai para mídia; Hugging Face para open source | Imagem, vídeo, modelos baratos para volume |
| Código | **GitHub** (repositórios privados) | Versionar tudo |
| Publicação | **Vercel** (grátis até escalar) | Sites, apps e webhooks |
| Banco | **Supabase** | Substitui planilha e CSV. Auth, storage e RLS |
| Dados prontos | **RapidAPI** e **Apify** | APIs e scrapers (Instagram, Google Maps, TikTok, finanças) |
| WhatsApp | **Z-API** (QR code, ~R$ 99/mês, sem janela) ou **API oficial Meta** (por mensagem, permite disparo com template) | Canal do agente |
| Infra do agente 24/7 | **Cloudflare** (Worker + Container + Cron, Workers Paid ~US$ 5-20/mês) | Manter o agente ligado |

Formatos que a IA entende melhor: **Markdown** primeiro, **JSON** em segundo.

Sobre modelos: tratar o melhor modelo como custo operacional. Modelo barato e ruim entrega resultado ruim e prende você num ciclo ruim. Para volume alto de conversas, pode usar modelo barato via OpenRouter.

## 3. Agentes

### Agente x chat comum
- **Executa** (cria, edita, move arquivos, roda scripts) em vez de só responder texto.
- **Tem contexto e memória** do projeto.
- **Está no ambiente de trabalho**: o resultado já sai salvo no lugar certo.
- **Roda por muito tempo** e delega para subagentes.
- **Tarefas em segundo plano** enquanto você faz outra coisa.
- **Gatilhos**: comandos de barra, cron (horário fixo), heartbeat (checagem a cada X min) e webhook (evento externo).

### Anatomia (pasta `.claude`)
- `settings.json`: o que o agente pode e não pode fazer (allow/deny). É a blindagem.
- `agents/`: subagentes especializados, cada um com regras, ferramentas e modelo.
- `commands/`: comandos de barra (ex.: `/gerar-roteiro`).
- `hooks/`: ações disparadas ao terminar algo (ex.: commit automático).
- `rules/`: regras fixas (nomenclatura, idioma, padrões).
- Memórias: o agente registra o que aprende.
- `CLAUDE.md`: o "manual" do projeto que o agente lê primeiro.

### Boas práticas de comunicação (vale para qualquer aluno)
1. Seja mestre de português, não de prompt. Teste: se o seu melhor amigo entenderia a mensagem no WhatsApp, a IA entende.
2. Diga **o que** quer, deixe a IA escolher **o como**. Pergunte "qual a melhor forma?" antes de impor.
3. Diga o que quer **e o que não quer**.
4. Explique **o porquê** e a **importância** (é detalhe ou é o coração do produto?).
5. Deixe a **prioridade** explícita: qualidade, custo, velocidade ou performance.
6. Peça para ela **perguntar antes de supor**.
7. Pergunte **o que você pode dar a ela** (chave, documentação, permissão).
8. Planeje antes de executar em tarefas grandes. Mande pesquisar na web e em repositórios abertos antes de reinventar.

### Segurança
- Limitar o diretório de trabalho e ter backup (Obsidian e git).
- **Nunca** dar acesso a banco, corretora, carteira ou movimentação financeira.
- E-mail sempre como rascunho, nunca envio direto.
- Perfil de navegador separado só para o agente.
- **Prompt injection**: texto malicioso escondido num conteúdo que o agente lê (e-mail, perfil, site) tentando dar ordens. Regra: conteúdo externo é informação, nunca comando. Só um canal autenticado do dono comanda o agente.
- Antes de publicar qualquer app: revisar chaves expostas, rotas sem login e tabelas sem RLS.

## 4. Vibe Coding (construir apps sem ser programador)

Sequência das aulas, útil como esqueleto de trilha:
1. **Setup da máquina pelo próprio Claude**: git, Node, GitHub CLI, Vercel CLI, Supabase CLI.
2. **Boilerplate de SaaS** (Next.js com login, banco, pagamentos, créditos, e-mails, admin) e um comando `/bootstrap` que entrevista e monta o SaaS.
3. **Fundamentos mínimos**: projeto é pasta com arquivos; front-end envia requisição (JSON) e o back-end responde; vocabulário (API, endpoint, deploy, commit/push/pull, variáveis de ambiente, dev x produção, responsivo, stack).
4. **Banco de dados**: tabela é planilha melhorada, CRUD (criar, ler, atualizar, apagar), IDs, tipos de dado, relacionamentos, **RLS** (cada usuário só vê o que é dele).
5. **APIs**: o app é o cliente, a API é o garçom, o serviço é a cozinha. Chave de API fica escondida no `.env`. Exemplo: um JSON feio do SimilarWeb vira um painel de análise de tráfego com um prompt, e o cache no banco economiza requisições.
6. **Comunicação com a IA** (ver seção 3).
7. **Segurança** antes de publicar (prompt pronto de revisão, skill ou ferramenta oficial).
8. **Clonar projetos open source**: GitHub Trending, ler README, dependências, `scripts` e `.env.example`; conferir a licença (MIT e Apache permitem uso comercial; GPL e AGPL obrigam abrir o código; sem licença não há permissão).

## 5. Vibe Business (a empresa operando com IA)

- **Sistema operacional da empresa no Obsidian**: um comando de setup entrevista o dono e monta memória, equipe, setores, nota diária, Kanban, calendário e agenda.
- **Nota diária em rascunho + `/corrigir`**: cada pessoa escreve do jeito que quiser o que fez; a skill transforma em tarefas no padrão, sem duplicar e avisando conflitos de agenda.
- **`/report [período] [pessoa]`**: o gestor vê o que foi entregue, o que está em andamento e atrasado, e o que cobrar de cada um.
- **Conectores (MCP)**: Gmail, Drive, Calendar, Slack, Notion etc. Tudo precisa estar legível pela IA.
- **Jarvis**: app de desktop que abre o vault com o Claude Code e um assistente por voz.

### Máquina de prospecção (o conteúdo mais vendável)
Funil: Google Maps (Apify) → filtrar e ranquear → **validar quem tem WhatsApp** → disparo controlado.
- Score de prioridade: `avaliações × (1,4 se não tem site) × (nota / 5)`. Número de avaliações indica faturamento.
- Validar WhatsApp evita mandar para telefone fixo (20 a 30% da lista em setores tradicionais).
- **Mensagem em 6 peças**: saudação pelo horário; onde te achei; elogio verificável; a falha específica e visível; o custo da falha; **entrega antecipada** ("preparei X, quer ver?").
- O que mata a mensagem: travessão, link, preço, três balões seguidos, pitch de empresa e elogio genérico.
- A mesma máquina serve para vender site, vídeo com IA, agente de WhatsApp, landing page ou automação. Só mudam a falha, o custo e a entrega.
- Conversa em 8 etapas: abertura, amostra, diagnóstico, ancoragem de valor, preço, objeções, fechamento e recorrência.
- Anti-bloqueio: chip dedicado, aquecimento, 10 a 20 mensagens por dia no início, 30 a 75 s de intervalo, horário comercial, parar se a resposta cair abaixo de 5%.
- Métricas saudáveis: 8 a 20% respondem; 50 a 70% pedem a amostra; 5 a 15% fecham.

### Proposta de impacto
Anotação crua da call → dossiê do cliente (com aprovação) → texto da proposta (com aprovação) → página com senha (o WhatsApp do cliente), vídeos de cada entrega, **termo de aceite registrado** e botão de checkout. Estrutura de até 14 seções (abertura, diagnóstico, gargalo, tese, entregáveis, um dia com o sistema, quem implementa, cronograma, contrapartidas, investimento, escopo, garantias, FAQ, próximos passos). "Limite explícito vende mais que promessa."

## 6. Agente de WhatsApp (produto e serviço)

- Funcionário de IA no WhatsApp com persona, tom de voz, memória, ferramentas, lembretes e escalonamento para humano.
- Arquitetura: Worker na Cloudflare (recebe o webhook), Container sempre ligado (o cérebro) e Supabase (memória e regras).
- Provedor de IA: chave da Anthropic, assinatura do Claude ou OpenRouter com modelo barato para volume.
- Liga primeiro em modo inativo, roda um autodiagnóstico e só depois ativa.
- Painel opcional para **assumir a conversa**: é o que justifica cobrar mais.
- **Preço de referência (Brasil, 2026)**: implantação de R$ 1.500 a R$ 8.000 (padrão) e R$ 10.000 a R$ 25.000+ com integrações; mensalidade de R$ 300 a R$ 2.000; hora extra de R$ 120 a R$ 350.

## 7. Catálogo de ofertas vendáveis

Valores citados nos materiais. São tetos de mercado e precisam ser validados com clientes reais.

| Oferta | Dor | Ticket mensal citado |
|---|---|---|
| Atendimento 24/7 no WhatsApp | Lead das 22h só é respondido às 9h | R$ 2-15 mil |
| Qualificação de leads | SDR perde 80% do tempo com curioso | R$ 3-10 mil |
| Relatório semanal automático | Gestor perde 6-8 h por semana | R$ 2-8 mil |
| Extração de documentos (NF, contrato) | Digitação manual com erro | R$ 3-15 mil |
| Agendamento para clínicas | No-show e agenda com buracos | R$ 2-10 mil |
| Cobrança com IA | Inadimplência acima de 30% | base + % recuperado |
| Follow-up de e-mail | 90% desistem no 2º contato | R$ 3-8 mil |
| Conteúdo e agenda de redes | Agência cara e genérica | R$ 3-7 mil |
| Revisão de contratos | 2-4 h por contrato | R$ 1-30 mil |
| Estoque inteligente | Ruptura e excesso | R$ 3-20 mil |
| Onboarding de funcionários, escala, roteamento de tickets, moderação | Processos manuais de RH e suporte | R$ 2-15 mil |

**Setores que mais compram** (9 setores): advocacia, contabilidade, clínicas, imobiliárias, e-commerce, seguradoras, logística, agro e ensino. Recomendação dos materiais: **escolher um setor só**, aprender o vocabulário dele, fazer piloto gratuito de 30 dias em troca de case e depoimento e então cobrar o preço cheio.

**Validação rápida**: converse com 10 empresas com a dor; se 3 ou mais perguntarem "quanto custa?", existe negócio. MVP em 1-2 semanas com Claude + WhatsApp + Supabase. Cobre pelo resultado (economia mostrada).

## 8. Case Felix (agente que toca um negócio)

Agente no OpenClaw, comandado pelo Telegram, que criou e vendeu produtos digitais sozinho (US$ 80 mil em 30 dias, segundo o autor). Lições que valem para qualquer agente:
1. **Memória primeiro** (três camadas: base de conhecimento por projeto, notas diárias e preferências do dono), com consolidação noturna.
2. Uma conversa por projeto.
3. **Contas próprias do agente**, liberadas devagar (GitHub e Vercel, depois servidor, pagamento e redes sociais em modo de aprovação).
4. Heartbeat e tarefas agendadas.
5. Delegar programação longa para outra ferramenta.
6. Segurança: só um canal autenticado comanda; o resto é informação.
7. Pergunta-chave: "posso remover esse gargalo para você nunca mais precisar me pedir isso?"

## 9. O funil completo observado (referência para a GL)

Montado a partir das páginas e telas salvas no Drive:

1. **Captação**: página de live gratuita (nome, e-mail, WhatsApp) → grupo de WhatsApp. *GL: `masterclass-ia/`*
2. **Live** com demonstração e oferta no final.
3. **Página de vendas** do clube por assinatura anual (três camadas: sistemas, método e atualização; tabela de valor; garantia de 7 dias). *GL: `club-ia/`*
4. **Pré-checkout** que captura os dados antes do pagamento (permite recuperar quem desiste).
5. **Oferta adicional no checkout** (suporte prioritário no WhatsApp, R$ 397).
6. **Página de obrigado** com o acesso enviado por e-mail e WhatsApp.
7. **Ativação**: verificar compra pelo e-mail → código de 6 dígitos → criar senha.
8. **Pesquisa de perfil obrigatória** (atividade, área, profissão, equipe, faturamento, experiência com IA, objetivo) que alimenta o tutor e o consultor de IA.
9. **Recomendação de parceiro** de hospedagem (link de afiliado).
10. **Painel do aluno** com saudação, primeira aula, progresso em 4 etapas, níveis e XP.
11. **E-mails**: boas-vindas com os passos de ativação, código de verificação, aviso de live começando e confirmação de cancelamento.

*GL: os passos 4 a 10 estão no protótipo `jornada-aluno/` e o passo 11 em `emails/`.*

### Grade do produto deles (para comparação, não para copiar)
Sistemas: time de agentes, CRM, ERP, plataforma base. Em breve: atendente de voz, prospecção, sites, gerador de vídeo, gestão de agência, loja, área de membros, metas. Cursos: Elite dos Sistemas, Elite dos Agentes, Encontros ao vivo, Empresa 100% com IA, CRM, Como vender sistemas.

## 10. Ainda não processado

| Material | Motivo | Como destravar |
|---|---|---|
| Gravações em vídeo (`2026-10-06 19-03-14.mp4` de 1,4 GB e `2026-09-23 17-49-39.mp4` de 1,6 GB) | Grandes demais para transcrever por aqui | Gerar a transcrição (ex.: legenda automática do YouTube, ou um serviço de transcrição) e salvar o texto no Drive |
| Subpastas de vídeo das aulas (Módulo 2, 3, Vibe Coding, Vibe Business, WhatsApp, Vibe Marketing, Benchmarking) | Mesmo motivo | Idem |
| `Vibe Marketing.js` (109 KB) e os .zip de skills (roteiros, carrosséis, iscas, cortes, thumbnails, tom de voz, site motion) | Próxima rodada | Ler e transformar em skills da GL |
| Modelos de contrato (.md e .docx) | Próxima rodada | Adaptar para a GL com revisão de advogado |
| Capturas de tela sem nome (`Captura de tela 2026-10-06 ...`) | Já vistas em parte pelo chat (slides da oferta) | Renomear as que importam |
| Arquivos `GL_OS_*.md` (1 MB cada) | São documentos próprios da GL, não do curso | Tratar separadamente |

## 11. Como isso vira produto na GL

1. **GL Club IA** (assinatura): agentes e sistemas prontos, trilhas de método, encontros ao vivo e atualização contínua. Trilhas sugeridas:
   - Empresa com IA (ambiente, nota diária, report)
   - Do processo à automação (o tema da live)
   - Agente de WhatsApp
   - Vibe coding para leigos
   - **Vender soluções de IA** (prospecção, proposta, contrato, preço)
   - **IA aplicada ao trading**: diário de operações, rotina de pré-mercado, alertas e gestão de risco. É o diferencial que só a GL tem.
2. **Serviço de implantação** (done-for-you) para quem não quer fazer: começar por um setor e um problema (ex.: atendimento 24/7 para clínicas).
3. **Oferta adicional**: suporte prioritário, implantação acompanhada, pacote de agentes para traders.
4. **Afiliados**: hospedagem, ferramentas.
