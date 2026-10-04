# Mentoria de Order Flow (Deep DOM): os trechos que viram vídeo e os prints de cada um

4 de outubro de 2026

A gravação é um replay do ES de 01/10/2026, da meia-noite até perto das 7h (horário de Brasília), no Deep DOM, com o template GL Pro System 2. São cerca de duas horas. Abaixo estão os trechos que mais ensinam, na ordem da gravação, cada um com a frase que marca o momento, o horário do replay, o que o público leigo aprende, a ligação com o operacional GL e os prints que o Giovane precisa tirar.

Cada trecho vira um vídeo vertical (Reels e Shorts) no formato da série "Operacional na prática" e uma aula 16:9 da Mentoria de Order Flow.

## A mensagem dos vídeos

- **Tecnologia, não promessa.** A GL mostra a leitura que a tecnologia permite, com o risco definido antes. Os vídeos não vendem curso nem sinal. Eles chamam para conhecer os sistemas GL na call 1x1 gratuita.
- **Explicado para quem nunca viu um book.** Cada termo aparece com uma imagem simples: a liquidez é a comida servida e a agressão é quem está com fome; o leilão é a faixa onde todo mundo negocia; o stop fica atrás de quem errou.
- **Transparência.** Mostrar também o trade que não deu certo, o dia de ficar de fora e a regra de não devolver o lucro.
- **Base acadêmica, com a frase certa.** O order flow vem de uma área estudada na universidade, a microestrutura de mercado:
  - **Kyle (1985):** o fluxo de ordens leva informação para o preço.
  - **Cont, Kukanov e Stoikov (2014):** o desequilíbrio entre compras e vendas no book explica boa parte da variação de preço de curto prazo.
  - **Berkowitz, Logue e Noser (1988):** a VWAP é a referência de execução das instituições.

  O que pode ser dito: "a leitura é baseada em microestrutura de mercado, estudada em pesquisa acadêmica". O que não pode: "estudos comprovam que dá lucro".

## Como o order flow se encaixa no operacional GL

| No Deep DOM | No operacional GL |
|---|---|
| VWAP e bandas de desvio padrão | VWAPs D, W e M e as bandas do GL Estado de Mercado |
| VAH, VAL, POC e LVN do leilão do dia | VAH, VAL e POC do dia, da semana e do mês (GL Estrutura de Mercado e GL Volume Profile Expert) |
| Liquidez no book e agressão a mercado | GL Orderflow Dominância |
| Expansão ou retorno à média | Expansão, equilíbrio e retorno à média no painel do Estado de Mercado |
| Paredes de liquidez | Níveis de calls e puts do GL Gamma |
| "Falta a visão semanal e mensal" (o próprio Giovane, por volta das 6h) | GL Trend Quant (Multi Fractal Model): o mapa maior que o DOM não mostra |

Essa última fala é o melhor gancho de venda da gravação: o DOM mostra a briga do minuto, e a GL entrega o mapa do dia, da semana e do mês em volta dela.

## Como tirar os prints

- **Mesma janela e mesmo zoom** em todos os prints de um trecho, com o heatmap, o volume profile, o times and sales e o relógio do replay aparecendo.
- **Sem saldo, sem resultado em dólar e sem número de conta** na tela: o painel de posição pode ficar, mas sem o P&L. Se aparecer, eu escondo.
- **Um print em cada momento listado** abaixo. Cada lista de prints já está na ordem em que o vídeo vai passar.
- **Uma linha por print:** horário do replay e o que estava acontecendo.
- Pode mandar aqui no chat ou numa pasta do Google Drive, com o número do trecho no nome do arquivo (ex.: "T05-2.png").

## Os trechos

### T01 · A VWAP e as bandas: o preço justo do dia

- **Na gravação:** começo, antes da meia-noite. "A VAP é essa linha amarela… essa linha cinza é a banda de desvio padrão."
- **O que o leigo aprende:** a VWAP é o preço médio pago no dia, pesado pelo volume. As bandas mostram quanto o preço já se afastou. Ou o preço volta para a média, ou ele expande de banda em banda.
- **Prints:** (1) o gráfico com a VWAP e as duas bandas de cada lado; (2) o preço parando na primeira banda; (3) o preço passando para a segunda banda (por volta das 2h, "o segundo desvio padrão").
- **Gancho:** "A linha que as instituições usam para saber se pagaram caro."

### T02 · Onde está o leilão: VAH, VAL, POC e LVN

- **Na gravação:** "Chamamos isso de LVN… 70% do volume… isso aqui seria um micro leilão."
- **O que o leigo aprende:** o leilão é a faixa onde está 70% do volume (entre a VAL e a VAH). O POC é o preço mais negociado. No LVN o volume some, e é por ali que o preço sai do leilão. Dentro da faixa o mercado é lateral; acima da VAH é expansão de alta; abaixo da VAL, de baixa.
- **Prints:** (1) o volume profile com as linhas de LVN em cima e embaixo e a VAH e a VAL; (2) o mesmo trecho de perto (o micro leilão); (3) de longe (o leilão maior).
- **Gancho:** "O mercado é um leilão. Você sabe onde ele está?"

### T03 · Quem está no controle? O times and sales

- **Na gravação:** meia-noite. "200 contratos de vendas às 9:30 da noite… e não conseguiram… agora o preço está no 7743", acima do POC de 7742.
- **O que o leigo aprende:** o times and sales mostra cada negócio fechado. Se vendem forte e o preço não cai, os vendedores foram absorvidos e quem manda são os compradores.
- **Prints:** (1) o times and sales com as vendas grandes da noite; (2) o gráfico à meia-noite, com o preço acima do POC.
- **Gancho:** "Venderam 200 contratos e o preço subiu. O que isso quer dizer?"

### T04 · A liquidez é a comida, a agressão é a fome

- **Na gravação:** meia-noite. "Você vai encarar essas barras como lanches… e essas bolas aqui como quem está desesperado para comer."

  Nos vídeos, a imagem fica neutra: "compradores com fome" (sem o "gordinhos").
- **O que o leigo aprende:** as barras do book são ordens esperando (a comida servida). As bolhas são agressões a mercado (quem está com fome). Quem consome a liquidez do outro lado leva o preço até lá.
- **Prints:** (1) uma parede grande de liquidez acima do preço; (2) as bolhas de compra batendo nela; (3) a parede consumida ou rompida.
- **Gancho:** "O gráfico que mostra a fome do mercado."

### T05 · Rompeu a VAH: a compra no fundo do leilão

- **Na gravação:** logo depois da meia-noite. "O rompimento da VH de fato aconteceu… HVN… compramos no fundo do leilão… cravou no nosso alvo."
- **O que o leigo aprende:** com os compradores no controle e o preço acima da VAH, a compra vai no fundo do leilão, com o alvo na próxima parede de liquidez.
- **Prints:** (1) o preço entre a VAL e a VAH, com as compras agressivas; (2) a entrada no fundo do leilão, com o stop e o alvo na tela; (3) o alvo atingido.
- **Gancho:** "Onde entrar quando o preço sai do leilão."

### T06 · O stop vai atrás de quem errou

- **Na gravação:** "Eu tenho que colocar o meu stop abaixo dos vendidos frustrados… a liquidez está aqui, que é onde eu quero levar."
- **O que o leigo aprende:** o stop vai atrás de quem ficou preso do lado errado, e o alvo vai onde está a liquidez. Se o alvo está perto demais, o risco não compensa.
- **Prints:** (1) a bolha dos vendedores presos, a linha do stop atrás dela e o alvo na parede de liquidez.
- **Gancho:** "Seu stop está no lugar errado."

### T07 · O padrão P: expansão e um leilão mais alto

- **Na gravação:** "Estamos num padrão P… queremos trabalhar nessas partes inferiores do P, que é o fundo do leilão."
- **O que o leigo aprende:** depois da expansão nasce um leilão mais alto. A compra fica no fundo desse novo leilão, e a parcial vai em cada parede.
- **Prints:** (1) o volume profile com o formato de P; (2) a compra no fundo do P; (3) a continuação e as parciais.
- **Gancho:** "A letra P que aparece no gráfico antes da continuação."

### T08 · Não tente pegar a virada da expansão

- **Na gravação:** "Você nunca tenta pegar a inversão da expansão… sempre a favor." Depois vem a briga na região do 7760 e do 7765: "aqui você poderia sair fora."
- **O que o leigo aprende:** na expansão, opera-se a favor. Quando a briga aparece numa parede ou num número redondo, é hora de realizar, não de virar a mão.
- **Prints:** (1) a briga na parede do 7765; (2) a realização; (3) o que veio depois.
- **Gancho:** "O erro de tentar adivinhar o topo."

### T09 · A falha de leilão: quando o rompimento não sai

- **Na gravação:** por volta das 2h30. "75 contratos de compras presas… se não conseguirem romper é failure, falha de leilão… entrada de reversão, alvo na VAP."
- **O que o leigo aprende:** se os compradores atacam o topo e ficam presos, o rompimento falhou. A operação vira retorno à média, com o alvo na VWAP.
- **Prints:** (1) o ataque ao topo com as compras presas; (2) a falha e a entrada de venda; (3) o preço chegando na VWAP.
- **Gancho:** "Rompeu e voltou. Quem ficou preso?"

### T10 · O padrão B e a compra no fundo do leilão

- **Na gravação:** depois da queda. "É um padrão B… a lateralização após a venda… essa casa do 700, 705, estão oferecendo as compras no fundo do leilão."
- **O que o leigo aprende:** depois da queda vem a lateral. A compra vai no fundo do leilão defendido, para levar o preço de volta à média, com a primeira parcial no topo do leilão.
- **Prints:** (1) o B formado; (2) a defesa do 705 e do 700; (3) a parcial na VAH e o alvo na VWAP.
- **Gancho:** "Depois da queda, a letra B."

### T11 · O imbalance: acelera ou rebalanceia

- **Na gravação:** "A região de imbalance, ou é região de rebalanceamento para voltar a subir, ou é região de aceleração. Como os vendidos estão dominantes, é mais provável que acelere… acelerou."
- **O que o leigo aprende:** um buraco de volume (LVN) é passagem rápida. Quem domina decide se o preço atravessa voando ou se volta.
- **Prints:** (1) o LVN de imbalance, com os vendedores dominantes; (2) a aceleração.
- **Gancho:** "O buraco no gráfico onde o preço voa."

### T12 · O stop hunt: 492 contratos e nada

- **Na gravação:** "Entrou 492 contratos para fazer esse rompimento… isso aqui pode ser um stop hunt… agora levar para baixo."
- **O que o leigo aprende:** um ataque grande que não rompe serve para tirar os stops de quem estava do outro lado, e depois o preço volta.
- **Prints:** (1) o ataque de 492 contratos; (2) o preço sem romper; (3) a volta.
- **Gancho:** "Por que o preço buscou o seu stop e voltou."

### T13 · 1000 contratos no topo: não dá para ignorar

- **Na gravação:** "Olha, 1000 contratos aqui… não dá para ignorar isso."
- **O que o leigo aprende:** uma ordem gigante no topo do leilão mostra quem está defendendo o preço. É lá que se vende junto.
- **Prints:** (1) a ordem de 1000 contratos no book; (2) a reação do preço.
- **Gancho:** "Alguém colocou 1000 contratos aqui."

### T14 · O dia (ou a hora) de ficar de fora

- **Na gravação:** "Lateral, eu não vou nem defender fundo de leilão, nem topo… ninguém está dominante… a VAP está totalmente lateral."
- **O que o leigo aprende:** quando ninguém domina e a VWAP fica deitada, não tem trade. Ficar de fora também é decisão.
- **Prints:** (1) a VWAP lateral, o volume sem dono e o book sem defesa.
- **Gancho:** "Hoje o melhor trade é nenhum."

### T15 · Errei a entrada: e agora?

- **Na gravação:** "A minha venda foi errada porque eu devia ter feito venda aqui no topo do leilão… o certo era se posicionar um pouco mais para cima."
- **O que o leigo aprende:** errar faz parte. O stop protege, e a próxima entrada vai no lugar certo (o topo do leilão), não no meio dele.
- **Prints:** (1) a entrada no meio do leilão; (2) onde seria o certo; (3) a nova entrada no topo.
- **Gancho:** "O trade que eu fiz errado, e como corrigi."

### T16 · O balanço inicial e o retorno à média do fim

- **Na gravação:** perto do fim. "100% do IB… os vendidos estão presos no fundo do leilão… a gente normalmente leva para VAP, operação de mean reversion."
- **O que o leigo aprende:** quando os vendedores ficam presos no fundo e a compra aparece com volume, o preço tende a voltar para a média.
- **Prints:** (1) o fundo no alvo de 100% do balanço inicial; (2) a compra com volume; (3) a chegada na VWAP.
- **Gancho:** "Os vendidos ficaram presos no fundo."

### T17 · As regras de quem opera em mesa

- **Na gravação:** "Na mesa não pode devolver lucro… vou colocar o stop no zero a zero… eu não deixei voltar meu drawdown."
- **O que o leigo aprende:**
  - A gestão importa mais que a entrada.
  - Stop no zero a zero quando o preço chega na primeira liquidez.
  - Parciais em cada parede.
  - Não devolver o que já ganhou.
- **Prints:** (1) a posição com o stop movido para o zero a zero; (2) a parcial (sem o valor em dólar).
- **Gancho:** "A regra que quase todo trader quebra."

## O episódio que resume tudo

Fala final da gravação: "Ou você opera expansão ou você opera retorno à média… dependendo se os comprados estão dominantes, se os vendidos estão dominantes e se eles estão sendo absorvidos ou não."

Vira o episódio de abertura da série de Order Flow: "O mercado em uma frase". Os prints são uma expansão e um retorno à média, da mesma gravação.

## Se der para tirar só uma parte agora

Comece por T04 (liquidez e fome), T02 (o leilão), T05 (compra no fundo do leilão), T06 (stop atrás de quem errou), T09 (falha de leilão), T14 (ficar de fora), T15 (errei a entrada) e o episódio que resume tudo. Esses fecham uma primeira série de 8 vídeos, do conceito à gestão.

## O que fica fora dos vídeos

- Os valores em dólar da gravação ("quase 2.000 de lucro", "12.587", "não bateu os 10.000"): soam como promessa de resultado.
- A frase "mercado é cassino".
- O replay acelerado: quando aparecer, os vídeos dizem "replay".
- A marca Deep Charts só como a ferramenta em que a GL opera e ensina. Nada que sugira parceria oficial, a não ser que exista.

Exemplos educacionais em replay. Não é recomendação de investimento. Trading envolve risco financeiro real.
