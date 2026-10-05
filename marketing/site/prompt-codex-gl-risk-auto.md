# Prompt para o Codex: a página do GL Risk Auto no site

Antes de colar: baixe o ZIP "GL Academy - Kit do site GL Risk Auto" (na página Campanha GL Risk Auto, seção "Kit do site", ou o arquivo enviado na conversa) e extraia dentro da pasta do projeto do site. Vai aparecer a pasta "GL Academy - Kit do site GL Risk Auto", com a pasta `media/risk`. Depois cole o texto abaixo no Codex.

O prompt parte do kit anterior (`prompt-codex-videos-do-site.md`): o Codex já criou os componentes de loop, história, filme, faixa de reels, resposta em vídeo e moldura de celular. Este prompt reaproveita esses componentes e acrescenta dois: o antes e depois com arrasto e os tutoriais em abas.

```text
Quero uma página nova no site da GL Academy para o GL Risk Auto, o painel de gestão de risco da GL para o NinjaTrader, e quero levar o produto para as páginas que já existem. A página tem dois trabalhos: explicar o produto em poucos segundos e mostrar o painel funcionando de verdade, com os vídeos feitos a partir de prints reais (replays). No fim, a pessoa agenda a conversa gratuita. Use o sistema visual que o site já tem (cores, fontes, raios, espaçamentos, sombras) e os componentes de vídeo que você criou no kit anterior; não crie outro estilo. Antes de mexer no código, me mostre o plano (rotas, seções, componentes novos e o que muda nas páginas existentes) e espere o meu ok.

1. OS ARQUIVOS

Estão na pasta "GL Academy - Kit do site GL Risk Auto", na raiz do projeto. Mova a pasta media/risk inteira para a pasta de arquivos estáticos do projeto, ao lado da media/ do kit anterior (public/media/risk ou o equivalente do framework), sem renomear nada. O LEIA-ME tem o tamanho e o peso de cada arquivo. media/risk/catalogo.json tem título, descrição, formato e duração de cada vídeo: use esses textos em títulos, legendas e aria-label.

Todos os vídeos são MP4 (H.264), sem som. Cada vídeo tem a capa JPG de mesmo nome; as histórias têm duas capas, -inicio e -fim.

- media/risk/loops: 5 loops de 8 s que emendam sem corte, sem texto além do chip "GL Risk Auto". risk-loop-plano (o plano pronto, dentro do teto), risk-loop-bloqueio (o plano acima do teto, barrado), risk-loop-sinal (o sinal verde no painel), risk-loop-sistema (o sistema GL completo, com o painel à esquerda), todos em 16:9, e risk-circulo, quadrado, feito para recorte redondo (o selo de replay já está dentro do círculo).
- media/risk/historias: 2 replays em 16:9 que tocam uma vez e param no último quadro. historia-risk-bloqueio (10 s: acima do teto não passa; dentro do teto, plano pronto) e historia-risk-trade (12 s: do contexto ao plano em R e à entrada com stop e alvo na plataforma, dentro do teto).
- media/risk/antes-depois: risk-antes.jpg e risk-depois.jpg, 1920x1080, com o mesmo enquadramento do mesmo gráfico (as velas batem; o depois foi tirado alguns minutos mais tarde, por isso tem mais velas à direita). Antes: só o gráfico. Depois: entrada, stop e a escada de R que o GL Risk Auto desenha.
- media/risk/filmes: vídeos com legenda para tocar no play. risk-trade-completo-16x9 (30 s) e risk-trade-completo-9x16 (43 s); risk-mesa-proprietaria-16x9 (15 s) e risk-mesa-proprietaria-9x16 (24 s).
- media/risk/tutoriais: 4 tutoriais, cada um em 16x9 e 9x16: tutorial-1-primeiros-passos, tutorial-2-planejar-conferir-confirmar, tutorial-3-controle-e-teclado e tutorial-4-estados-do-painel.
- media/risk/reels: 8 vídeos verticais de 16 a 30 s, com legenda na imagem; a capa já traz o título. este-trade-nao-passou, quanto-voce-perde, um-contrato-ou-dois, o-que-e-r, quando-realizar, sim-e-um-controle, antes-e-depois e cinco-erros-de-risco.
- media/risk/aulas: aula-20-do-contexto-ao-sinal-verde e aula-21-teto-e-tamanho-de-posicao, em 9x16, para a moldura de celular da página Mentorias.
- media/risk/og: og-gl-risk-auto.jpg (1200x630), para o link compartilhado da página nova.

2. OS JEITOS DE MOSTRAR VÍDEO

Use os componentes do kit anterior, com o mesmo comportamento:
- A. Loop: muted loop playsinline, preload="none", aria-hidden, só carrega perto da tela, toca com 35% visível, pausa fora da tela e com a aba escondida, no máximo 3 tocando ao mesmo tempo, capa com fade de 400 ms quando começa.
- B. História: toca uma vez com 50% visível, para no último quadro e mostra "Ver de novo". Com "reduzir movimento" ou economia de dados, mostra a capa -fim.
- C. Filme: capa com o botão de play do site, nada carrega antes do clique, janela de cinema em <dialog>, versão 9x16 no celular em pé, um filme por vez.
- D. Faixa de reels: capas verticais em scroll-snap, prévia sem som ao parar o mouse 300 ms (só no computador), player vertical em <dialog> com setas, swipe, ← → e Esc e o contador "2 de 8".
- E. Resposta em vídeo: <details> com a resposta em texto primeiro e uma capa 9:16 pequena que abre o player vertical.
- F. Moldura de celular: as aulas em 9:16 dentro do celular desenhado em CSS, com abas.

Se algum desses componentes não existir no projeto, crie seguindo exatamente o comportamento acima.

Componentes novos:

G. Antes e depois com arrasto (media/risk/antes-depois)
As duas imagens empilhadas no mesmo tamanho (aspect-ratio 16 / 9). A de cima (depois) é recortada com clip-path: inset(0 0 0 X%), e uma alça vertical dourada marca o X. O controle é um <input type="range"> de 0 a 100, valor inicial 50, que cobre a área toda, invisível mas focável, com aria-label "Comparar antes e depois" e aria-valuetext "Antes 50%, depois 50%". Funciona com mouse, dedo e setas do teclado (5% por toque, 25% com Shift). Rótulos fixos "Antes" (canto esquerdo) e "Depois" (canto direito), em texto HTML, não na imagem. Na primeira vez que fica 50% visível, a alça faz um vaivém curto (50 → 62 → 50 em 1,2 s) para mostrar que dá para arrastar; com "reduzir movimento" não faz. As imagens são <img loading="lazy" decoding="async"> com width e height.

H. Tutoriais em abas (media/risk/tutoriais)
role="tablist" com 4 abas ("1 · Primeiros passos", "2 · Planejar, conferir e confirmar", "3 · O controle e o teclado", "4 · Os estados do painel"), setas ← → movendo entre as abas (padrão WAI-ARIA de abas). O painel da aba mostra a capa com o botão de play do site e, no clique, o vídeo toca ali mesmo, com controles (sem janela). No computador e no tablet deitado, a versão 16x9; no celular em pé, a 9x16, com altura máxima de 80% da tela. Trocar de aba pausa o vídeo que estava tocando. Embaixo do vídeo, a descrição do catalogo.json.

3. A PÁGINA NOVA: GL RISK AUTO

Crie a rota /gl-risk-auto (ou o equivalente do framework), com as seções nesta ordem. Os textos são estes; ajuste só o tamanho de linha para caber no layout.

3.1 Topo
- Selo pequeno: "No Operacional Completo · NinjaTrader"
- Título: "GL Risk Auto"
- Subtítulo: "O risco se decide antes do clique."
- Texto: "O painel de gestão de risco da GL para o NinjaTrader. Ele mede o risco do seu plano em dólar e em R antes da entrada, barra o que passa do teto da conta, calcula quantos contratos cabem no stop e envia stop e alvo junto com a entrada. A decisão continua sendo sua."
- Botões: "Agendar conversa gratuita" (principal, para o agendamento) e "Ver funcionando" (secundário, rola até a seção 3.5).
- Visual: loops/risk-loop-plano (A), na moldura do topo do site. No celular, abaixo do texto.

3.2 Por que existe (3 cards, cada um com o reel que responde)
- "Entrar sem saber quanto perde": "O risco aparece em dólar e em R no gráfico, antes do clique." Reel: quanto-voce-perde.
- "Aumentar a mão no impulso": "O tamanho da mão vem do stop, não da vontade: o painel calcula quantos contratos cabem." Reel: um-contrato-ou-dois.
- "Quebrar a regra da conta": "Teto por trade e limite do dia na tela. O plano acima do teto não passa, nem quando a vontade de recuperar fala mais alto." Reel: este-trade-nao-passou.
Cada card abre o player vertical (D) no reel dele.

3.3 Como funciona (4 passos, um visual por passo, alternando texto e vídeo no computador; empilhados no celular)
1. "Planeje": "Marque entrada, stop e alvo no gráfico. O risco aparece em dólar e em R, com a escada de 1R a 5R." Visual: loops/risk-loop-plano (A). (Se o topo já usa esse loop, use aqui a imagem antes-depois/risk-depois.jpg parada.)
2. "Confira": "O painel compara o plano com o teto por trade e com o limite do dia. Se não cabe no teto, não entra." Visual: loops/risk-loop-bloqueio (A).
3. "Confirme": "Dentro do teto, o plano fica pronto: o START confirma e o SELECT cancela. Stop e alvo vão para a plataforma junto com a entrada." Visual: historias/historia-risk-trade (B).
4. "Acompanhe": "Em posição, o risco aparece em R. Quando o risco x retorno fica a favor, o painel avisa: avalie realizar. A decisão é sua." Visual: loops/risk-loop-sinal (A).
Não escreva o número de R do primeiro sinal verde: está em definição.

3.4 Antes e depois (G)
- Título: "O mesmo gráfico, com o risco medido"
- Texto: "Arraste para comparar. Antes, só o gráfico. Depois, a entrada, o stop e a escada de R que o GL Risk Auto desenha antes do clique."
- Legenda pequena embaixo: "Replay · exemplo educacional. O mesmo gráfico de 5 minutos, antes e depois de desenhar o plano."

3.5 Veja funcionando (id="ver-funcionando")
- Título: "Um trade do começo ao fim"
- Texto: "Contexto, plano medido em R, entrada autorizada dentro do teto, stop e alvo na plataforma e o aviso do sinal verde."
- filmes/risk-trade-completo-16x9 (no celular em pé, risk-trade-completo-9x16) no jeito C, com o botão "Assistir · 30 s" (no celular, "Assistir · 43 s").
- Ao lado (embaixo no celular), historias/historia-risk-bloqueio (B), com o texto "Acima do teto, o plano é barrado. Dentro do teto, fica pronto para confirmar."
- Uma faixa larga com loops/risk-loop-sistema (A) e a frase "Contexto, risco e execução na mesma tela."

3.6 Tutoriais (H)
- Título: "Aprenda a usar em 4 vídeos"
- Texto: "Da configuração da conta aos estados do painel. Pratique na conta simulada ou no replay antes de usar na conta real."

3.7 Mesa proprietária
- Título: "As regras da mesa na tela, antes do clique"
- Texto: "Presets com as regras de conta de mesa, o limite do dia e o teto por trade no painel. Na mesa, quebrar a regra custa a conta: o plano acima do teto não passa."
- filmes/risk-mesa-proprietaria-16x9 (no celular, risk-mesa-proprietaria-9x16), jeito C.
- Logo embaixo, sempre: "Aprovação em mesa proprietária depende de você e das regras de cada mesa."
- Não cite nome nem logo de mesa proprietária e não use "passe na mesa" ou "aprovação garantida".

3.8 Em 15 segundos (D)
Faixa com os 8 reels, nesta ordem: este-trade-nao-passou, quanto-voce-perde, o-que-e-r, um-contrato-ou-dois, quando-realizar, sim-e-um-controle, antes-e-depois e cinco-erros-de-risco.

3.9 Dúvidas (E), nesta ordem
- O GL Risk Auto opera por mim? Não. Você decide a entrada, o stop e o alvo. O painel mede o risco, barra o plano acima do teto e envia stop e alvo junto com a entrada que você confirmou. (Vídeo: este-trade-nao-passou)
- Em qual plataforma funciona? No NinjaTrader. Ele faz parte do Operacional Completo, para NinjaTrader. (Sem vídeo)
- Como ele sabe quantos contratos cabem? Pelo stop: o risco do stop por contrato é comparado com o teto da conta. O tamanho da mão vem do stop, não da vontade. (Vídeo: um-contrato-ou-dois)
- O que é R? R é quanto você perde se o stop for atingido. Um alvo em 5R vale cinco vezes esse risco. Em R, todo trade fica comparável. (Vídeo: o-que-e-r)
- Serve para conta de mesa proprietária? Tem presets com regras de conta de mesa, o limite do dia e o teto por trade na tela. Aprovação em mesa proprietária depende de você e das regras de cada mesa. (Vídeo: o filme da mesa, 9x16)
- O que é o sinal verde? Quando o risco x retorno fica a favor, o painel avisa: avalie realizar. A decisão continua sendo sua. (Vídeo: quando-realizar)
- Dá para usar com controle? Sim. Pelo controle ou pelo teclado (CTRL + SHIFT), com um modo para testar os botões sem enviar ordens. (Vídeo: sim-e-um-controle)
- O risco mostrado inclui custos? Não. É o risco estimado no stop; custos e slippage não estão incluídos. (Sem vídeo)

3.10 Chamada final
- Título: "Quer ver o GL Risk Auto na sua conta?"
- Texto: "Agende a conversa gratuita com a equipe GL."
- Botão: "Agendar conversa gratuita". Visual: loops/risk-circulo (A), no recorte redondo dos círculos da Escolha.
- Rodapé da página: "Conteúdo educacional; trading envolve risco financeiro real. Não é recomendação de investimento. Os vídeos são replays (exemplos educacionais); resultado passado não garante resultado futuro. Risco estimado no stop; custos e slippage não incluídos."

4. O QUE MUDA NAS PÁGINAS QUE JÁ EXISTEM

| Página | Lugar | O que entra |
| --- | --- | --- |
| Tecnologias | Lista dos sistemas, no GL Risk Auto | loops/risk-loop-plano (A) no lugar do espaço sem vídeo e o link "Conhecer o GL Risk Auto" para a página nova |
| Tecnologias | Card do Operacional Completo | A linha "Com o GL Risk Auto: gestão de risco no NinjaTrader", com link para a página nova, se o card listar os sistemas |
| Tecnologias | Faixa "O operacional em ação" | reels/este-trade-nao-passou no fim da faixa |
| Pacote Completo | 01 Operacional Completo | O mesmo link "Conhecer o GL Risk Auto", sem vídeo novo |
| Mentorias | Moldura de celular (F) | Duas abas novas: "Aula 20 · Do contexto ao sinal verde" e "Aula 21 · Teto e tamanho de posição", com aulas/aula-20-... e aulas/aula-21-... |
| Menu e rodapé | Onde aparecem as tecnologias | O item "GL Risk Auto", se o menu listar produtos ou sistemas |
| Escolha | Nada | A página da decisão continua sem vídeo novo |

Se um lugar da tabela tiver outro nome no código, use o mais parecido e me diga qual foi.

5. LINKS DE AGENDAMENTO E MEDIÇÃO

- Todo botão "Agendar conversa gratuita" desta página vai para o mesmo agendamento do site. Mantenha os UTMs que já vierem na URL da página; se não houver nenhum, acrescente utm_source=site&utm_medium=conteudo&utm_campaign=gl-risk-auto&utm_content=<seção> (topo, como-funciona, ver-funcionando, mesa, final).
- Se o site já tem um helper de eventos (GA4 ou Pixel), dispare: risk_cta_click (com a seção), risk_video_play (com o nome do arquivo), risk_tutorial_tab (com o número da aba) e risk_antes_depois (quando a pessoa arrastar a primeira vez). Se não houver helper, deixe atributos data-evento e data-rotulo nos elementos, sem script novo de rastreamento.

6. DESEMPENHO, ACESSIBILIDADE E COMPARTILHAMENTO

- Ao abrir a página, só as capas carregam. Nenhum MP4 baixa antes de rolar, a não ser o loop do topo. A capa do topo vai com fetchpriority="high"; as outras com loading="lazy".
- Com "reduzir movimento" ou economia de dados (navigator.connection.saveData): nada toca sozinho, as histórias mostram a capa -fim, o antes e depois não faz o vaivém e os filmes e tutoriais continuam no play.
- Loops decorativos com aria-hidden; filmes, reels, tutoriais, dúvidas e aulas com aria-label (o título do catalogo.json) e a descrição em texto perto do vídeo.
- Janelas (<dialog>) com foco preso dentro, Esc para fechar e o foco de volta no botão que abriu.
- <head> da página nova: <title>GL Risk Auto · Gestão de risco no NinjaTrader | GL Academy</title>, meta description "O painel de gestão de risco da GL para o NinjaTrader: risco em dólar e em R antes do clique, teto por trade, contratos que cabem no stop e stop e alvo junto com a entrada.", og:title, og:description, og:image com URL absoluta para media/risk/og/og-gl-risk-auto.jpg, og:image:width 1200, og:image:height 630, og:image:alt e twitter:card summary_large_image.
- JSON-LD VideoObject para o filme risk-trade-completo-16x9: name, description (do catalogo.json), thumbnailUrl absoluta, contentUrl absoluta, duration "PT30S" e uploadDate com a data da publicação. Nada de Product, preço ou avaliação.

7. REGRAS DE CONTEÚDO

- Nenhum texto novo com promessa de lucro, renda, resultado ou aprovação em mesa. Os textos deste prompt já estão revisados: não acrescente adjetivos de resultado ("lucre mais", "nunca mais perca").
- Perto dos botões de agendamento, na faixa de reels e no rodapé: "Conteúdo educacional; trading envolve risco financeiro real. Não é recomendação de investimento."
- Perto dos filmes e das histórias: "Replay · exemplo educacional; resultado passado não garante resultado futuro."
- Não escreva a duração da conversa gratuita (ainda em definição) nem o número de R do primeiro sinal verde.
- Não corte o selo "Replay · exemplo educacional" dos vídeos e das imagens: mostre o quadro inteiro (object-fit: contain nos 16:9 de gráfico, ou cover só no círculo, que já tem o selo dentro).
- Valores em dólar só aparecem como risco (stop e teto). Não escreva saldo, lucro ou resultado em dólar em nenhum texto.

8. CÓDIGO DE REFERÊNCIA DO ANTES E DEPOIS (adapte ao framework)

<figure class="gl-ad" data-evento="risk_antes_depois">
  <div class="gl-ad-quadro">
    <img src="/media/risk/antes-depois/risk-antes.jpg" width="1920" height="1080" alt="Gráfico de 5 minutos do ES antes do plano" loading="lazy" decoding="async">
    <img class="gl-ad-depois" src="/media/risk/antes-depois/risk-depois.jpg" width="1920" height="1080" alt="O mesmo gráfico com entrada, stop e a escada de 1R a 5R do GL Risk Auto" loading="lazy" decoding="async">
    <span class="gl-ad-alca" aria-hidden="true"></span>
    <span class="gl-ad-rotulo gl-ad-antes">Antes</span><span class="gl-ad-rotulo gl-ad-dep">Depois</span>
    <input class="gl-ad-range" type="range" min="0" max="100" value="50" aria-label="Comparar antes e depois" aria-valuetext="Antes 50%, depois 50%">
  </div>
  <figcaption>Replay · exemplo educacional. O mesmo gráfico de 5 minutos, antes e depois de desenhar o plano.</figcaption>
</figure>

<style>
  .gl-ad-quadro { position: relative; aspect-ratio: 16 / 9; overflow: hidden; border-radius: inherit; --x: 50%; }
  .gl-ad-quadro img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: contain; background: #050505; }
  .gl-ad-depois { clip-path: inset(0 0 0 var(--x)); }
  .gl-ad-alca { position: absolute; top: 0; bottom: 0; left: var(--x); width: 2px; margin-left: -1px; background: #d8ae55; box-shadow: 0 0 12px rgba(216,174,85,.6); pointer-events: none; }
  .gl-ad-alca::after { content: ""; position: absolute; top: 50%; left: 50%; width: 40px; height: 40px; margin: -20px 0 0 -20px; border-radius: 50%; border: 2px solid #d8ae55; background: rgba(5,5,5,.7); }
  .gl-ad-rotulo { position: absolute; top: 12px; padding: 6px 10px; border-radius: 999px; background: rgba(5,5,5,.7); font-size: .8rem; letter-spacing: .08em; text-transform: uppercase; pointer-events: none; }
  .gl-ad-antes { left: 12px; } .gl-ad-dep { right: 12px; }
  .gl-ad-range { position: absolute; inset: 0; width: 100%; height: 100%; opacity: 0; cursor: ew-resize; margin: 0; }
  .gl-ad-range:focus-visible + * , .gl-ad-quadro:focus-within .gl-ad-alca { outline: 2px solid #f6d991; outline-offset: 2px; }
</style>

<script type="module">
  const parado = matchMedia('(prefers-reduced-motion: reduce)').matches;
  for (const quadro of document.querySelectorAll('.gl-ad-quadro')) {
    const r = quadro.querySelector('.gl-ad-range');
    const pos = (v) => { quadro.style.setProperty('--x', v + '%'); r.setAttribute('aria-valuetext', `Antes ${v}%, depois ${100 - v}%`); };
    r.addEventListener('input', () => pos(+r.value));
    r.addEventListener('keydown', (e) => {
      if (!e.shiftKey || !['ArrowLeft', 'ArrowRight'].includes(e.key)) return;
      e.preventDefault(); r.value = Math.max(0, Math.min(100, +r.value + (e.key === 'ArrowRight' ? 25 : -25))); pos(+r.value);
    });
    if (!parado) {
      const io = new IntersectionObserver(([e]) => {
        if (!e.isIntersecting) return; io.disconnect();
        const t0 = performance.now();
        const passo = (t) => { const k = Math.min(1, (t - t0) / 1200); const v = Math.round(50 + 12 * Math.sin(Math.PI * k)); r.value = v; pos(v); if (k < 1) requestAnimationFrame(passo); };
        requestAnimationFrame(passo);
      }, { threshold: 0.5 });
      io.observe(quadro);
    }
  }
</script>

9. ANTES DE ME ENTREGAR, CONFIRA

- iPhone (Safari) e Android (Chrome): loops e histórias tocam sem tela cheia; filmes, reels, tutoriais e dúvidas tocam no clique; o antes e depois arrasta com o dedo sem rolar a página para o lado.
- Em 360 px de largura não existe rolagem para o lado; os passos do "Como funciona" ficam um embaixo do outro; a faixa de reels desliza com o dedo.
- Lighthouse no celular da página nova: CLS abaixo de 0,1 e nenhum MP4 baixado antes de rolar, a não ser o loop do topo.
- Teclado: Tab chega em todos os botões, cards, abas, reels e no antes e depois; as setas movem as abas e a alça; Enter abre; Esc fecha e o foco volta.
- Com "reduzir movimento" ligado, só aparecem as capas, as histórias mostram o quadro final e o antes e depois fica parado em 50%.
- O selo "Replay · exemplo educacional" aparece inteiro em todos os vídeos e imagens de gráfico.
- Os textos de risco e o "Aprovação em mesa proprietária depende de você e das regras de cada mesa." aparecem onde este prompt pede.
- Depois de publicar, teste o link da página nova no Sharing Debugger da Meta e no Post Inspector do LinkedIn.

Entregue a lista do que mudou em cada página, prints da página nova em 1440 px e em 390 px de largura e o resultado do Lighthouse.
```
