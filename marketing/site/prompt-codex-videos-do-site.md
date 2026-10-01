# Prompt para o Codex: os melhores vídeos no site novo

Antes de colar: baixe o kit na Biblioteca de Vídeos GL (seção Kit do site, botão "Baixar o kit do site") e extraia o ZIP dentro da pasta do projeto do site. Vai aparecer a pasta "GL Academy - Kit do site". Depois cole o texto abaixo no Codex.

```text
Quero usar os melhores vídeos de marketing da GL Academy no site novo para deixá-lo premium: bonito, rápido e fácil de decidir. Cada página tem uma função, e cada vídeo foi escolhido para ajudar a pessoa a entender o produto e agendar a conversa gratuita. Use o sistema visual que o site já tem (cores, fontes, raios, espaçamentos, sombras); não crie outro. Antes de mexer no código, me mostre o plano por página e espere o meu ok.

1. OS ARQUIVOS

Estão na pasta "GL Academy - Kit do site", na raiz do projeto (se não estiver, procure a pasta media/ que veio no kit). Mova a pasta media/ inteira para a pasta de arquivos estáticos do projeto (public/media ou o equivalente do framework), sem renomear nada. O LEIA-ME do kit tem o tamanho e o peso de cada arquivo, e media/catalogo.json tem título, descrição, formato e duração de cada vídeo. Use esses textos em títulos, legendas e aria-label.

Todos os vídeos são MP4 (H.264) em 1080p e não têm som. Cada um vem com a capa JPG de mesmo nome; as histórias têm duas capas, -inicio e -fim.

- media/loops: 6 loops de 8 s que emendam sem corte. site-circulo-pacote e site-circulo-tecnologias são quadrados, feitos para recorte redondo; site-loop-tradingview, site-loop-ninjatrader, site-loop-gamma e site-loop-alvos são 16:9.
- media/historias: 3 replays de 12 s, sem texto, em 16:9. O gráfico se monta e termina com o setup completo: historia-alta-alinhada, historia-estrutura-ninjatrader e historia-duas-telas-tradingview.
- media/filmes: filme-tecnologias-16x9 (44 s) e filme-tecnologias-9x16 (40 s); pacote-completo-16x9 (23 s); gl-gamma-16x9 (13,5 s) e gl-gamma-9x16 (14 s); trailer-youtube-16x9 (33 s).
- media/reels: 7 vídeos verticais de 12 a 16 s, com legenda na imagem. A capa já traz o título: setup-acontecendo, alvos-claros, a-favor-ou-contra, escada-de-valor, nem-toda-queda-e-venda, tambem-no-ninjatrader e tres-perguntas.
- media/faq: 3 respostas verticais curtas: funciona-na-minha-plataforma, e-so-mais-um-indicador e preciso-entender-de-opcoes.
- media/aulas: aula-vwap e aula-value-area, verticais, com a capa da aula.
- media/comunidade: comunidade-boas-vindas, vertical.
- media/galeria: 6 imagens 1920x1080 da seção "Veja os sistemas em uso".
- media/og: 5 imagens 1200x630 para o link compartilhado.

2. OS SEIS JEITOS DE MOSTRAR VÍDEO

A. Loop decorativo (media/loops)
<video muted loop playsinline preload="none" aria-hidden="true" tabindex="-1" disablepictureinpicture>, com a capa e width/height (ou aspect-ratio) para o layout não pular. Só carrega quando chega perto da tela e só toca com pelo menos 35% visível. Pausa fora da tela e com a aba escondida, e volta sozinho. No máximo 3 loops tocando ao mesmo tempo. Começa mostrando a capa e entra com um fade de 400 ms quando o vídeo começa a tocar (evento playing), sem piscar preto. Os loops 16:9 de gráfico têm o selo "Replay · exemplo educacional" na imagem: mostre o quadro inteiro, sem cortar as bordas.

B. História que toca uma vez (media/historias)
Toca uma vez quando fica 50% visível, para no último quadro (o setup completo) e mostra um botão discreto "Ver de novo". A capa -inicio fica antes de tocar. Com "reduzir movimento" ligado, ou com economia de dados, não toca: aparece a capa -fim.

C. Filme com play (media/filmes)
Capa com um botão de play no estilo do site (círculo dourado com triângulo, aria-label "Assistir: <título>"). Nada carrega antes do clique. No clique, abre uma janela de cinema: <dialog>, fundo escuro, vídeo centralizado, com controles. No celular em pé, use a versão 9x16 quando ela existir. Ao fechar (botão, Esc ou clique fora), o vídeo pausa e o foco volta para o botão. Um filme por vez: ao abrir, pause tudo que estiver tocando na página.

D. Faixa de reels (media/reels)
As capas verticais (com título) numa faixa horizontal com scroll-snap, com a próxima aparecendo na borda e setas no computador. Use <img loading="lazy"> nas capas. No computador, parar o mouse 300 ms sobre uma capa toca ali mesmo uma prévia sem som (o vídeo só é criado nesse momento). O clique abre um player vertical em <dialog>: altura de até 90% da tela, setas, swipe no celular, ← → e Esc no teclado, contador "2 de 6" e a descrição do vídeo embaixo.

E. Resposta em vídeo (media/faq)
Cada pergunta é um <details>. A resposta em texto vem primeiro (é o que o Google lê), com uma capa pequena 9:16 e play ao lado, que abre o mesmo player vertical.

F. Moldura de celular (media/aulas)
Um celular desenhado em CSS (cantos arredondados, borda fina, sem imagem pesada) com a aula em 9:16 dentro e dois botões para trocar de aula (role="tablist"). Toca com um toque, com controles.

3. PÁGINA POR PÁGINA

| Página | Lugar | Peça | Jeito |
| --- | --- | --- | --- |
| Escolha | Círculo central (Pacote Completo) | loops/site-circulo-pacote | A, no círculo |
| Escolha | Círculo de Tecnologias | loops/site-circulo-tecnologias | A, no círculo |
| Escolha | Círculo de Mentorias | A foto atual do Giovane | Parada, até existir o vídeo da mentoria |
| Escolha | "Não sabe o que precisa?" | Sem vídeo | Botão direto para o agendamento |
| Tecnologias | Moldura dourada do topo | loops/site-circulo-tecnologias se a moldura for redonda ou quadrada; loops/site-loop-tradingview se for 16:9 | A |
| Tecnologias | Logo abaixo do topo | filmes/filme-tecnologias-16x9 (no celular, filme-tecnologias-9x16), num botão "Assistir ao filme · 44 s" | C |
| Tecnologias | Card Operacional Completo | loops/site-loop-ninjatrader | A, no topo do card |
| Tecnologias | Card Pacote TradingView | loops/site-loop-tradingview | A, no topo do card |
| Tecnologias | Lista dos sistemas, se a página mostrar um a um | GL Estrutura de Mercado: historias/historia-estrutura-ninjatrader. GL Estado de Mercado: historias/historia-duas-telas-tradingview (termina no aviso "Correção contra W/M"). GL Volume Profile Expert: aulas/aula-value-area. Os outros sistemas ficam sem vídeo por enquanto | B; a aula no jeito C |
| Tecnologias | Faixa nova "O operacional em ação", antes da galeria | reels/setup-acontecendo, alvos-claros, a-favor-ou-contra, escada-de-valor, nem-toda-queda-e-venda e tambem-no-ninjatrader, nessa ordem | D |
| Tecnologias | Galeria "Veja os sistemas em uso" | As 6 imagens de media/galeria, mais loops/site-loop-gamma e loops/site-loop-alvos | Grade com ampliação (setas, ← → e Esc) |
| Tecnologias | Botão "Conhecer o GL Gamma" | filmes/gl-gamma-16x9 (no celular, gl-gamma-9x16) | C, com "GL Gamma: assinatura à parte, nos planos Essential, Plus e Premium." embaixo do vídeo |
| Tecnologias | "Dúvidas comuns", antes do botão final (crie se não existir) | As 3 de media/faq, com as respostas do item 4 | E |
| Pacote Completo | Logo depois do topo ("Ver o que compõe") | filmes/pacote-completo-16x9 | C, mas tocando na própria página (é a peça principal dela) |
| Pacote Completo | 01 Operacional Completo | loops/site-loop-alvos | A, no lugar do print |
| Pacote Completo | 02 APP GL Model Academy | A imagem atual | Até existir a gravação de tela do APP |
| Pacote Completo | Mentoria 1:1 com Giovane | A foto atual | Até existir o vídeo do Giovane |
| Pacote Completo | GL Gamma | loops/site-loop-gamma | A, com "GL Gamma: assinatura à parte" |
| Mentorias | Jornada e APP | aulas/aula-vwap e aulas/aula-value-area | F |
| Mentorias | Como a gente pensa um trade, se houver um bloco de método | reels/tres-perguntas | C, vertical |
| Mentorias | Comunidade, se houver um bloco | comunidade/comunidade-boas-vindas | C, vertical |
| GL Gamma, se tiver página própria | Topo | loops/site-loop-gamma | A |
| GL Gamma, se tiver página própria | Explicação | filmes/gl-gamma-16x9 e gl-gamma-9x16 | C |
| GL Gamma, se tiver página própria | Dúvida | faq/preciso-entender-de-opcoes | E |
| Início, se existir além da Escolha | Topo | historias/historia-alta-alinhada atrás do título (termina em "Alta alinhada D/W/M"), num degradê escuro do lado do texto | B |
| Início, se existir além da Escolha | Abaixo do topo | O filme das tecnologias e a faixa de reels | C e D |
| Qualquer seção de conteúdo ou YouTube | Chamada para o canal | filmes/trailer-youtube-16x9 | C, com o link do canal |
| Todas | Link compartilhado | og/og-escolha, og-tecnologias, og-pacote-completo, og-mentorias e og-gl-gamma | Meta tags (item 6) |

A Escolha é a página da decisão: no máximo os dois loops dos círculos, nada que distraia. Se um lugar da tabela tiver outro nome no código, use o mais parecido e me diga qual foi.

4. TEXTOS DAS DÚVIDAS COMUNS

- Funciona na minha plataforma? Funciona no TradingView e no NinjaTrader. O Pacote TradingView roda no TradingView; o Operacional Completo roda nas duas plataformas, com o mesmo mapa.
- É só mais um indicador? Não. É um mapa de decisão: o contexto do dia, da semana e do mês, as regiões de valor, os alvos e, para quem assina o GL Gamma, os níveis de Gamma, tudo no mesmo gráfico. Ele organiza a leitura; a decisão continua sendo sua.
- Preciso entender de opções para usar o GL Gamma? Não precisa operar opções. Zero Gamma, Call Wall, Put Wall e HVL aparecem direto no seu gráfico de futuros. O GL Gamma é uma assinatura à parte, nos planos Essential, Plus e Premium.

5. TOQUES PREMIUM (com moderação)

- Círculos com um anel dourado fino e um brilho suave; no hover (só em telas com mouse), escala 1,02 e o anel mais forte, em 400 ms.
- Nos cards, o loop no topo com um degradê na base que funde o vídeo na cor do card.
- Botão de play dourado com um leve aumento no hover; janela de cinema com fundo quase preto, sem blur.
- Entradas de seção discretas (fade e 8 px de deslocamento), desligadas com "reduzir movimento".
- Nada de vídeo de abertura antes do site, parallax ou blur sobre vídeo, e nenhum vídeo com legenda tocando sozinho.

6. DESEMPENHO, ACESSIBILIDADE E COMPARTILHAMENTO

- Ao abrir uma página, só as capas carregam. Nenhum MP4 baixa antes de rolar, a não ser o loop que já aparece na primeira tela. A capa da primeira dobra vai com fetchpriority="high"; as outras com loading="lazy".
- Com "reduzir movimento" ou economia de dados (navigator.connection.saveData): nada toca sozinho, ficam as capas, e os filmes continuam no play.
- Vídeos decorativos com aria-hidden; filmes, reels, dúvidas e aulas com aria-label (o título do catalogo.json) e a descrição em texto perto do vídeo.
- Janelas (<dialog>) com foco preso dentro, Esc para fechar e o foco de volta no botão que abriu.
- No <head> de cada página: og:title, og:description, og:image com URL absoluta, og:image:width 1200, og:image:height 630, og:image:alt e twitter:card summary_large_image. Escolha usa og-escolha; Tecnologias, og-tecnologias; Pacote Completo, og-pacote-completo; Mentorias, og-mentorias; a página do GL Gamma, se existir, og-gl-gamma.

7. REGRAS DE CONTEÚDO

- Perto dos botões de agendamento, na faixa de reels e no rodapé: "Conteúdo educacional; trading envolve risco financeiro real. Não é recomendação de investimento."
- Onde aparecer GL Gamma (loop, galeria, janela, dúvida): "GL Gamma: assinatura à parte".
- Não escreva a duração da conversa gratuita: 30 ou 60 minutos ainda não está decidido. Use "conversa gratuita".
- Nenhum texto novo com promessa de lucro, renda ou resultado. Não corte o selo "Replay · exemplo educacional" dos vídeos.

8. CÓDIGO DE REFERÊNCIA (adapte ao framework do projeto)

<!-- A. Loop: a capa fica no fundo do contêiner e o vídeo entra por cima quando toca -->
<div class="gl-media" style="background-image:url(/media/loops/site-loop-tradingview.jpg)">
  <video class="gl-loop" muted loop playsinline preload="none" aria-hidden="true" tabindex="-1" disablepictureinpicture
         width="1920" height="1080" poster="/media/loops/site-loop-tradingview.jpg"
         data-src="/media/loops/site-loop-tradingview.mp4"></video>
</div>

<!-- Círculo: a mesma estrutura, com gl-circulo no contêiner -->
<div class="gl-media gl-circulo" style="background-image:url(/media/loops/site-circulo-pacote.jpg)">
  <video class="gl-loop" muted loop playsinline preload="none" aria-hidden="true" tabindex="-1" disablepictureinpicture
         width="1080" height="1080" poster="/media/loops/site-circulo-pacote.jpg"
         data-src="/media/loops/site-circulo-pacote.mp4"></video>
</div>

<!-- B. História: toca uma vez e para no último quadro -->
<div class="gl-media" style="background-image:url(/media/historias/historia-alta-alinhada-inicio.jpg)">
  <video class="gl-historia" muted playsinline preload="none" aria-hidden="true" tabindex="-1" disablepictureinpicture
         width="1920" height="1080" poster="/media/historias/historia-alta-alinhada-inicio.jpg"
         data-src="/media/historias/historia-alta-alinhada.mp4"
         data-fim="/media/historias/historia-alta-alinhada-fim.jpg"></video>
  <button type="button" class="gl-de-novo" hidden>Ver de novo</button>
</div>

<style>
  .gl-media { position: relative; background: center / cover no-repeat; overflow: hidden; }
  .gl-media.gl-circulo { aspect-ratio: 1; border-radius: 50%; }
  .gl-media.gl-circulo video { width: 100%; height: 100%; object-fit: cover; }
  .gl-loop, .gl-historia { display: block; width: 100%; height: auto; transition: opacity .4s ease; }
  /* só esconde o vídeo (e deixa a capa do contêiner) quando o script vai tocá-lo */
  .gl-anima .gl-loop:not(.is-on), .gl-anima .gl-historia:not(.is-on) { opacity: 0; }
  .gl-de-novo { position: absolute; right: 12px; bottom: 12px; }
  @media (prefers-reduced-motion: reduce) { .gl-loop, .gl-historia { transition: none; } }
</style>

<script type="module">
  const parado = matchMedia('(prefers-reduced-motion: reduce)').matches || navigator.connection?.saveData === true;
  const carregar = (v) => { if (!v.getAttribute('src')) v.src = v.dataset.src; };

  // Com movimento reduzido ou economia de dados, as histórias mostram o setup completo
  if (parado) {
    for (const v of document.querySelectorAll('video.gl-historia')) {
      v.poster = v.dataset.fim;
      v.parentElement.style.backgroundImage = `url(${v.dataset.fim})`;
    }
  } else {
    document.documentElement.classList.add('gl-anima');

    // A. Loops: carregam perto da tela, tocam quando aparecem, no máximo 3 de uma vez
    const loops = [...document.querySelectorAll('video.gl-loop')];
    const visiveis = new Set();
    const tocar = (v) => {
      if (document.hidden || [...visiveis].filter((x) => !x.paused).length >= 3) return;
      carregar(v);
      v.play().catch(() => {});
    };
    const perto = new IntersectionObserver((itens) => {
      for (const { target, isIntersecting } of itens) if (isIntersecting) { carregar(target); perto.unobserve(target); }
    }, { rootMargin: '300px 0px' });
    const naTela = new IntersectionObserver((itens) => {
      for (const { target, isIntersecting } of itens) {
        if (isIntersecting) { visiveis.add(target); tocar(target); }
        else { visiveis.delete(target); target.pause(); }
      }
    }, { threshold: 0.35 });
    for (const v of loops) {
      v.addEventListener('playing', () => v.classList.add('is-on'), { once: true });
      perto.observe(v);
      naTela.observe(v);
    }
    document.addEventListener('visibilitychange', () => {
      for (const v of visiveis) document.hidden ? v.pause() : tocar(v);
    });

    // B. Histórias: tocam uma vez quando ficam 50% visíveis e param no último quadro
    const historias = new IntersectionObserver((itens) => {
      for (const { target: v, isIntersecting } of itens) {
        if (!isIntersecting) continue;
        historias.unobserve(v);
        carregar(v);
        v.play().catch(() => {});
      }
    }, { threshold: 0.5 });
    for (const v of document.querySelectorAll('video.gl-historia')) {
      const deNovo = v.parentElement.querySelector('.gl-de-novo');
      v.addEventListener('playing', () => { v.classList.add('is-on'); deNovo.hidden = true; });
      v.addEventListener('ended', () => { deNovo.hidden = false; });
      deNovo.addEventListener('click', () => { v.currentTime = 0; v.play(); });
      historias.observe(v);
    }
  }
</script>

9. ANTES DE ME ENTREGAR, CONFIRA

- iPhone (Safari) e Android (Chrome): loops e histórias tocam sem tela cheia; filmes, reels, dúvidas e aulas tocam no clique.
- Em 360 px de largura não existe rolagem para o lado; os círculos ficam um embaixo do outro; a faixa de reels desliza com o dedo.
- Lighthouse no celular (Escolha, Tecnologias e Pacote Completo): CLS abaixo de 0,1 e nenhum MP4 baixado antes de rolar, a não ser o loop da primeira tela.
- Teclado: Tab chega em círculos, cards, reels, galeria, dúvidas e botões de filme; Enter abre; Esc fecha e o foco volta.
- Com "reduzir movimento" ligado, só aparecem as capas, e as histórias mostram o setup completo.
- O selo "Replay · exemplo educacional" aparece inteiro em todos os vídeos de gráfico.
- Depois de publicar, teste o link de cada página no Sharing Debugger da Meta e no Post Inspector do LinkedIn.

Entregue a lista do que mudou em cada página, prints em 1440 px e em 390 px de largura e o resultado do Lighthouse.
```
