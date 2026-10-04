# Vídeos GL: motor de renderização

Gera os vídeos da **Biblioteca de Vídeos GL** a partir dos prints reais do operacional, sem gastar crédito de IA. Cada vídeo é uma página HTML animada quadro a quadro no Chromium e gravada em MP4 com o ffmpeg.

Biblioteca publicada (privada): https://claude.ai/artifact/BgpMsKZZn2BikAYBcXSDfm

## Requisitos

- Node 18 ou mais novo, com o Playwright e o Chromium (`npm i playwright`).
- ffmpeg com libx264. Se não estiver no PATH, aponte com `FFMPEG=/caminho/do/ffmpeg`.
- Python 3, só para montar a Biblioteca.

## Prints

Os prints `1.png` a `13.png` **não ficam no git**. Eles estão publicados na Biblioteca, na pasta `prints/`. Antes de renderizar, copie-os para esta pasta com os mesmos nomes. Prints novos seguem a numeração (`14.png`, `15.png`…).

## Comandos

```bash
SPECS=./specs-r3.js node render.js aula-vwap   # um vídeo: out/aula-vwap.mp4
SPECS=./specs-r3.js node render.js             # todos os vídeos do arquivo
SPECS=./specs-r3.js node stills.js aula-vwap   # só os quadros de conferência em out/check/
./sheet.sh out/folha.jpg 360 4 out/check/*.jpg # folha de contato com os quadros
node grade.js 6.png                            # grade de coordenadas para escrever cenas
node grade.js 6.png 900 60 1816 860 1.6        # recorte ampliado da grade
node amostra.js 7.png 813,86 465,26             # cor do fundo em cada ponto (para as máscaras e tampas)
SPECS=./specs-imagens.js node slides.js        # imagens estáticas em out/imagens/<grupo>/
node quadros-capas.js && SPECS=./specs-carrosseis.js node slides.js capas-reels   # capas de Reels a partir dos coringas limpos
python3 build_library.py                       # monta biblioteca/index.html, vídeos leves, capas, imagens, kit do site e o pacote organizado
```

## Arquivos de roteiro

| Arquivo | O que tem |
| --- | --- |
| `specs.js` | v01 a v07 (vídeos que vendem), coringas c01 a c06 e horizontais h01 a h03 |
| `specs-novos.js` | v08 a v11, coringas c07 a c10 e as variações de gancho |
| `specs-live.js` | abertura, encerramento e loops de live; comerciais 16:9 e 9:16 |
| `specs-r3.js` | logo de 8 s, vinheta de 4 s, aulas rápidas e respostas às objeções |
| `specs-feed.js` | versões 4:5 para o feed, geradas a partir dos vídeos 9:16 |
| `specs-r4.js` | sequência da call, comunidade, parceiro, kit de live 2.0 (WebM transparente), contagem regressiva, YouTube e kit do site |
| `specs-r5.js` | o operacional por dentro (prints 6 a 13): Estado de Mercado, Gamma no 1 minuto, Zero Gamma perdido, o antes e depois dos alvos de volatilidade, de volume e do GL Gamma, o rompimento e o retorno à média; com coringas limpos, versões 4:5 e uma horizontal |
| `specs-mentoria.js` | Mentoria GL: 19 aulas 16:9 (prints 1 a 21). O gráfico para no ponto de decisão, pausa para o aluno e mostra região de atuação, gatilho, invalidação, alvos e resultado. Plano em `marketing/mentoria/plano-da-mentoria.md` |
| `specs-social.js` | série "Operacional na prática" (9:16, Reels e Shorts): as aulas da mentoria no vertical, com o gancho sobre o gráfico, o painel fora das áreas de botões e legenda e a capa de cada episódio (`capa-op...`, pelo `stills.js` com `QUALIDADE=92`). Legendas, títulos do YouTube e datas em `social_operacional.py`; o calendário sai em `../execucao/calendario-operacional-na-pratica.csv` |
| `specs-carrosseis.js` | carrosséis 4:5 e capas de Reels (imagens, com `slides.js`) |
| `specs-imagens.js` | posts, frases, stories, destaques, thumbnails do YouTube, galeria do site e imagens de compartilhamento (com `slides.js`) |
| `biblioteca_topo.py` | a organização da Biblioteca: "O que fazer hoje" (o post do dia da série, escolhido pela data de quem abre a página, e as tarefas, marcadas só no navegador), o guia de cada tipo de vídeo (`PARTES`, `GUIA` e `LACUNAS`: o que é, onde usar, quando, quantos estão prontos e o que ainda não fazemos), as quatro partes por objetivo e a seção de Order Flow, lida de `../mentoria/orderflow-trechos-e-prints.md`. Grupo novo na Biblioteca entra em `PARTES` e `GUIA`; sem isso ele vai para o fim da página |
| `specs-posts.js` | carrosséis 4:5 e stories 9:16 da série "Operacional na prática" (um carrossel e o par enquete e resposta por episódio, com o estado do gráfico no fim de cada passo da aula, as mesmas marcações e textos), o lançamento da série e as peças de conversão (4 dúvidas antes da call, como funciona a call). Render: `SPECS=./specs-posts.js node posts.js [grupo ...]` |
| `posts.js` | renderizador das imagens do `specs-posts.js`: reduz o texto que não cabe (`data-fit`), põe o gráfico entre os textos (`data-lim`), recorta o gráfico dos stories numa janela e ajusta a câmera até as marcações caberem inteiras |
| `kit_posts.py` | página Carrosséis e Stories GL (`posts/`): o que postar em cada dia, os 19 episódios com a tira do carrossel, a legenda e os stories, as peças de conversão, o calendário `../execucao/calendario-carrosseis-e-stories.csv` e o ZIP nas mesmas pastas do pacote da Biblioteca (o `build_library.py` chama no fim) |
| `organizacao.py` | pacote "Baixar tudo organizado": pasta de cada arquivo, nomes legíveis, LEIA-ME, legendas, catálogo e o organizador do Windows (o `build_library.py` chama no fim) |
| `kit_site.py` | kit do site: o melhor vídeo para cada espaço do site novo, capas em tamanho cheio, catálogo e o prompt para o Codex (o `build_library.py` chama depois do `organizacao.py`) |
| `mentoria_pacote.py` | ZIP da Mentoria GL: as aulas por módulo, o plano para o GL OS com o roteiro de cada aula e os prints que faltam, o cronograma de 4 semanas, o diário, a ficha, o checklist, os prints e as capas. Grava `../mentoria/roteiros-das-aulas.md` e o botão "Baixar a mentoria completa" na Biblioteca (o `build_library.py` chama antes do `organizacao.py`); com `--zip`, grava também o ZIP com os vídeos em qualidade cheia em `../entregas` (84 MB), e com `--zip --leve`, o mesmo ZIP com os vídeos da Biblioteca (45 MB) em `../entregas/leve` |

## Como escrever um vídeo novo

Coordenadas sempre em pixels do print original (use `grade.js`). Um roteiro tem:

- `w`, `h`, `dur`: tamanho e duração. 1080x1920 (9:16), 1920x1080 (16:9) ou 1080x1350 (4:5).
- `scenes`: cada cena usa um print (`img`) com `t0` e `t1`, e pode ter:
  - `cam`: quadros-chave `{ t, cx, cy, z }` (centro e zoom);
  - `reveal`: revela o gráfico da esquerda para a direita, ou de baixo para cima com `dir: 'up'`, como se o setup estivesse acontecendo;
    - `keys: [{t, x}]` faz a revelação andar e parar (o gráfico para no ponto de decisão e continua depois);
    - `gaps: [[y0, y1], ...]` deixa faixas horizontais visíveis por baixo da máscara (níveis já conhecidos antes do preço chegar);
  - `hides`: tampa rótulos até um instante (`until`);
  - `boxes`: caixas com etiqueta (`label`, `color`, `below`, `dx`);
  - `spots`: holofote que escurece tudo em volta;
  - `particles`: o emblema GL se formando em partículas.
- `captions`: legendas com `kick` (selo) e `text`, com `<em>` dourado, `<em class="red">` e `<em class="green">`.
- `end`: cartela final com `tag`, a chamada para a call 1x1 e o aviso de risco.

## Nomes e textos

Antes de escrever legenda ou cartela nova, confira `../glossario.md` (nomes dos produtos e o que ainda está a confirmar). Os roteiros para o Giovane gravar e o guia de depoimentos estão em `../roteiros-e-depoimentos.md`.

## Regras que valem para todo vídeo

- Prints de replay saem com o selo "Replay · exemplo educacional" (já automático).
- Nunca prometer lucro, renda ou aprovação em mesa. Alvos são projeções do modelo.
- A cartela final sempre traz o aviso de risco.
- Todo vídeo ou imagem que mostra os níveis de Gamma leva o aviso "GL Gamma: assinatura à parte".

## Pacote organizado

O botão "Baixar tudo organizado" da Biblioteca monta no navegador o ZIP `GL Academy - Marketing (Claude).zip`, com os vídeos e imagens separados por objetivo e função, nomes legíveis e os textos de cada pasta. O `organizacao.py` define o lugar de cada arquivo e escreve esses textos. Dentro do ZIP vai o organizador da pasta "Marketing de trading" (`../organizacao/organizar-marketing.ps1`). Ele traz o pacote, arruma as pastas que já existiam, copia os vídeos do Codex para "04 - Feito pelo Codex" e confere as pastas da equipe contra os vídeos e imagens das pastas 02 a 04, sem apagar nada. O botão "Organizador atualizado e textos (ZIP leve)" baixa só o organizador e os textos, para quem já tem os vídeos. Para testar numa pasta simulada: `python3 ../organizacao/testar_organizador.py` (precisa do `pwsh`).

Na pasta "01 - Estratégia e planejamento" o pacote leva o plano de marketing (`../plano-de-marketing.md`), o prompt de continuidade (`../PROMPT-continuidade.md`) e as planilhas de `../execucao/` (calendário de outubro, teste de anúncios e placar semanal), que o `organizacao.py` também grava no repositório.

## Mentoria GL

O botão "Baixar a mentoria completa (ZIP)", na seção Mentoria GL, monta `Mentoria GL - aulas do operacional.zip` no navegador, com o mesmo conteúdo do ZIP que o `mentoria_pacote.py --zip` grava. O plano é `../mentoria/plano-da-mentoria.md` e a lista do que falta é `../mentoria/prints-que-faltam.md`: na versão para o GL OS, o roteiro de cada aula e essa lista entram como anexos. Mudou uma aula, o plano ou a lista, rode o build de novo.

## Kit do site

O botão "Baixar o kit do site" da Biblioteca monta `GL Academy - Kit do site.zip`: os vídeos escolhidos para o site em `media/` (loops, histórias, filmes, reels, FAQ e aulas), as capas, as imagens da galeria e de compartilhamento, `media/catalogo.json` e o prompt para o Codex. O `kit_site.py` escolhe os vídeos, gera em `biblioteca/kit/` as capas que faltam e grava o manifesto na página. O prompt é `../site/prompt-codex-videos-do-site.md`: mudou o prompt, rode o build de novo.

## Higgsfield

A rodada premium está pausada e pronta para retomar. Veja `higgsfield-rodada-premium.md`; o texto para colar e começar está em `PROMPT-retomar-higgsfield.md`.

## Rótulos internos dos prints

Alguns prints mostram o nome de versão do indicador ("INTERNA 1.1.1" no print 3, "Interna Teste" nos prints 7, 14 e 15). O `stage.html` esconde esses rótulos em qualquer peça que use esses prints (`INTERNOS`), então nenhuma caixa ou enquadramento deve apontar para eles. Print novo com rótulo interno: acrescente o retângulo em `INTERNOS`.
