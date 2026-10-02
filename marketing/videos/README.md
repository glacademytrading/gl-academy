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
| `specs-carrosseis.js` | carrosséis 4:5 e capas de Reels (imagens, com `slides.js`) |
| `specs-imagens.js` | posts, frases, stories, destaques, thumbnails do YouTube, galeria do site e imagens de compartilhamento (com `slides.js`) |
| `organizacao.py` | pacote "Baixar tudo organizado": pasta de cada arquivo, nomes legíveis, LEIA-ME, legendas, catálogo e o organizador do Windows (o `build_library.py` chama no fim) |
| `kit_site.py` | kit do site: o melhor vídeo para cada espaço do site novo, capas em tamanho cheio, catálogo e o prompt para o Codex (o `build_library.py` chama depois do `organizacao.py`) |

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

## Kit do site

O botão "Baixar o kit do site" da Biblioteca monta `GL Academy - Kit do site.zip`: os vídeos escolhidos para o site em `media/` (loops, histórias, filmes, reels, FAQ e aulas), as capas, as imagens da galeria e de compartilhamento, `media/catalogo.json` e o prompt para o Codex. O `kit_site.py` escolhe os vídeos, gera em `biblioteca/kit/` as capas que faltam e grava o manifesto na página. O prompt é `../site/prompt-codex-videos-do-site.md`: mudou o prompt, rode o build de novo.

## Higgsfield

A rodada premium está pausada e pronta para retomar. Veja `higgsfield-rodada-premium.md`; o texto para colar e começar está em `PROMPT-retomar-higgsfield.md`.
