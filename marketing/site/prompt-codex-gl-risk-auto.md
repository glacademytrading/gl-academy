# Prompt para o Codex: o GL Risk Auto no site (2 vídeos)

Versão de 5 de outubro de 2026. Substitui o kit grande (loops, histórias, reels e tutoriais): o site fica com **dois vídeos completos** sobre o GL Risk Auto, e as outras peças vão para as redes sociais e os anúncios.

Antes de colar: baixe o ZIP "GL Academy - Vídeos do site GL Risk Auto" (página Campanha GL Risk Auto, seção "Vídeos do site", ou o arquivo enviado na conversa) e extraia dentro da pasta do projeto do site. Depois cole o texto abaixo no Codex.

```text
Quero colocar o GL Risk Auto no site, que já está no ar, com dois vídeos completos. O GL Risk Auto é o painel de gestão de risco da GL para o NinjaTrader e faz parte do Operacional Completo. Os vídeos foram feitos com prints reais do painel em replay. Use o sistema visual que o site já tem (cores, fontes, raios, espaçamentos, sombras) e o componente de filme com play que você já criou. Antes de mexer no código, me mostre onde vai entrar e espere o meu ok.

1. OS ARQUIVOS

Estão na pasta "GL Academy - Vídeos do site GL Risk Auto", na raiz do projeto. Mova a pasta media/risk para a pasta de arquivos estáticos do site (public/media/risk ou o equivalente), sem renomear nada. media/risk/catalogo.json tem título, descrição e duração de cada vídeo.

- media/risk/gl-risk-auto-trade-completo.mp4 (47 s, 1920x1080) e a capa gl-risk-auto-trade-completo.jpg: um trade do começo ao fim. A leitura (VAH D e bloco vermelho), o plano desenhado com um botão e o risco x retorno na hora (2 para 1, 3 para 1, 5 para 1), a entrada autorizada dentro do teto da conta, com stop e alvo na plataforma, a gestão e o sinal verde acima de 1,5 para 1.
- media/risk/gl-risk-auto-protecao.mp4 (45 s, 1920x1080) e a capa gl-risk-auto-protecao.jpg: como o GL Risk Auto protege a conta. O teto por trade, o limite do dia, o bloqueio do plano acima do teto, os contratos que cabem no stop e o controle ou o teclado.
- media/risk/og-gl-risk-auto.jpg (1200x630): imagem do link compartilhado.

Os vídeos são MP4 (H.264) e não têm som: a legenda está na imagem.

2. ONDE ENTRA

- Se o site tem páginas de produto, crie a página /gl-risk-auto com a seção do item 3. Se não tem, crie a seção na página Tecnologias, com id="gl-risk-auto", logo depois da lista dos sistemas.
- Na lista dos sistemas da página Tecnologias, o item GL Risk Auto ganha o link "Ver o GL Risk Auto funcionando" para a seção ou a página nova.
- No card do Operacional Completo (Tecnologias e Pacote Completo), se ele listar os sistemas, o GL Risk Auto vira link para o mesmo lugar.
- Se um lugar tiver outro nome no código, use o mais parecido e me diga qual foi.

3. A SEÇÃO

- Selo pequeno: "No Operacional Completo · NinjaTrader"
- Título: "GL Risk Auto"
- Subtítulo: "O risco se decide antes do clique."
- Texto: "O painel de gestão de risco da GL para o NinjaTrader. Ele mede o risco do plano em dólar e em R antes da entrada, barra o que passa do teto da conta, mostra quantos contratos cabem no stop e envia stop e alvo junto com a entrada. A decisão continua sendo sua."
- Três pontos curtos, lado a lado no computador e empilhados no celular:
  1. "Risco x retorno na hora: 2 para 1, 3 para 1, 5 para 1."
  2. "Se não cabe no teto, não entra."
  3. "Acima de 1,5 para 1, o painel fica verde para você avaliar a saída."
- Os dois vídeos, lado a lado no computador (o primeiro maior, se o layout pedir destaque) e um embaixo do outro no celular, cada um com a capa, o botão de play do site, o título e a descrição:
  - "Veja funcionando: um trade do começo ao fim" · 47 s · gl-risk-auto-trade-completo
  - "Como ele protege a sua conta" · 45 s · gl-risk-auto-protecao. Embaixo deste: "Aprovação em mesa proprietária depende de você e das regras de cada mesa."
- Botão: "Agendar conversa gratuita", para o mesmo agendamento do site.
- Texto pequeno no fim da seção: "Conteúdo educacional; trading envolve risco financeiro real. Não é recomendação de investimento. Os vídeos são replays (exemplos educacionais); resultado passado não garante resultado futuro. Risco estimado no stop; custos e slippage não incluídos."

4. COMO O VÍDEO TOCA

- Só a capa carrega com a página (<img loading="lazy"> com width e height). O MP4 só baixa no clique.
- No clique, abra o vídeo na janela de cinema que o site já usa (<dialog>, controles, Esc fecha, o foco volta para o botão) ou toque no próprio lugar, com controles, se a janela não existir. Um vídeo por vez.
- O vídeo é 16:9 também no celular: na janela, ocupe a largura toda e deixe a pessoa girar o aparelho para tela cheia.
- aria-label do botão: "Assistir: <título>". Nenhum vídeo toca sozinho.

5. MEDIÇÃO, BUSCA E COMPARTILHAMENTO

- Botão de agendamento: mantenha os UTMs que já vierem na URL; sem nenhum, use utm_source=site&utm_medium=conteudo&utm_campaign=gl-risk-auto&utm_content=secao-risk.
- Se o site já tem um helper de eventos (GA4 ou Pixel), dispare risk_video_play (com o nome do arquivo) e risk_cta_click. Sem helper, deixe atributos data-evento, sem script novo.
- JSON-LD VideoObject para cada vídeo: name, description (do catalogo.json), thumbnailUrl e contentUrl absolutos, duration (PT47S e PT45S) e uploadDate com a data da publicação. Nada de Product, preço ou avaliação.
- Se for página nova: <title>GL Risk Auto · Gestão de risco no NinjaTrader | GL Academy</title>, meta description "O painel de gestão de risco da GL para o NinjaTrader: risco em dólar e em R antes do clique, teto por trade, contratos que cabem no stop e stop e alvo junto com a entrada." e as metas og e twitter com og-gl-risk-auto.jpg (1200x630).

6. REGRAS DE CONTEÚDO

- Não acrescente promessa de lucro, renda, resultado ou aprovação em mesa. Use os textos deste prompt.
- Não escreva a duração da conversa gratuita (ainda em definição).
- Mostre os vídeos e as capas inteiros, sem cortar as bordas: o selo "Replay · exemplo educacional" fica no canto de baixo.

7. ANTES DE ME ENTREGAR, CONFIRA

- Em 360 px de largura não há rolagem para o lado e os vídeos ficam um embaixo do outro.
- Nenhum MP4 baixa antes do clique (aba Network) e o CLS da página fica abaixo de 0,1 no Lighthouse do celular.
- Teclado: Tab chega nos dois vídeos e no botão; Enter abre; Esc fecha e o foco volta.
- Os textos de risco e a frase da mesa proprietária aparecem onde este prompt pede.

Me entregue o que mudou, prints em 1440 px e em 390 px de largura e o resultado do Lighthouse.
```
