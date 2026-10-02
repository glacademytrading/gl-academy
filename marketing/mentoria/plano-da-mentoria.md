# Plano da Mentoria GL: o operacional na prática

2 de outubro de 2026 · Giovane Lázaro

Biblioteca com as aulas (seção "Mentoria GL", abre na conta do Giovane): https://claude.ai/artifact/BgpMsKZZn2BikAYBcXSDfm

## Resumo

A Mentoria GL ganhou 19 videoaulas curtas feitas com os prints reais do operacional. Cada aula é um tutorial de uso. O gráfico se constrói até o ponto de decisão, para, e mostra como ler cada parte do movimento: o estado, a região de atuação, o gatilho, a invalidação, os alvos e o resultado.

**Onde estamos em 2 de outubro:**

- 19 aulas prontas em 7 módulos, com cerca de 16 minutos no total. São vídeos 16:9 de 44 a 58 segundos, sem narração, feitos com 21 prints de ES, MES e NQ no NinjaTrader e no TradingView.
- As regras de cada aula (região, gatilho, stop e alvos) foram escritas a partir dos prints. Elas esperam a validação do Giovane antes de ir para os alunos.
- Tudo está na Biblioteca (seção "Mentoria GL"), num ZIP só da mentoria e no repositório, em marketing/mentoria.
- A lista do que falta para a segunda leva está pronta. São 19 situações em ordem de prioridade, com o que mandar em cada print.

**Os próximos cinco passos:**

1. O Giovane valida as regras das 19 aulas (lista em "O que o Giovane valida").
2. Decidir onde as aulas ficam: área do aluno, APP GL Model Academy ou YouTube não listado.
3. Encaixar as aulas nos 8 encontros da Mentoria 1:1 (proposta abaixo).
4. Mandar os prints que faltam, começando pelos oito de maior prioridade.
5. Começar a trilha de estudos com os alunos e acompanhar o andamento no GL OS.

## O que levamos em consideração

- **A GL ensina método e tecnologia de leitura, com risco em primeiro lugar, e não promete lucro.** As aulas são exemplos educacionais em replay.
- **O operacional é um mapa de decisão, não um botão de compra e venda.** Toda aula ensina a decidir, inclusive a não entrar.
- **Público:** alunos da Mentoria 1:1 com o Giovane (8 encontros individuais de 1h30, com acesso ao APP) e clientes dos sistemas GL. Eles operam ES, NQ, MES e MNQ no TradingView ou no NinjaTrader.
- **Conformidade:** selo "Replay · exemplo educacional" o tempo todo, aviso de risco no fim de cada aula e "GL Gamma: assinatura à parte" nas aulas com Gamma. Nenhuma aula é recomendação ao vivo (Resolução 20/2021 da CVM).

## O método: as oito etapas de cada aula

1. **Contexto:** o estado (alta, baixa ou equilíbrio) e onde o preço está no mapa.
2. **Pause o vídeo:** o aluno decide antes de ver a resposta. Aparece em 17 das 19 aulas; a 1 e a 5 são de leitura e não têm pausa.
3. **Região de atuação:** onde faz sentido procurar o trade.
4. **Gatilho:** o candle ou o evento que libera a entrada.
5. **Invalidação:** onde a ideia acaba. O stop é definido antes da entrada.
6. **Alvos:** os níveis que já estavam no gráfico.
7. **Resultado:** o que o preço fez e quando parar.
8. **Resumo:** a regra em três a cinco linhas.

Vale para todas as aulas: contexto primeiro, risco definido antes da entrada e, na dúvida, ficar de fora.

## Formato das aulas

- **16:9, de 44 a 58 segundos, sem narração.** O gráfico fica à esquerda e o texto num painel à direita.
- **O gráfico se constrói da esquerda para a direita e para no ponto de decisão.** Os níveis que já existiam (bandas, regiões, VAH e VAL) ficam visíveis antes de o preço chegar, como no gráfico ao vivo.
- **A tela "Pause o vídeo"** traz a pergunta que o aluno responde antes de continuar.
- **A tela final** indica a próxima aula.

## Módulos e aulas

| Aula | Título | Prints | Duração | O que ensina |
|---|---|---|---|---|
| **Módulo 1 · Leitura do estado** | | | | |
| 1 | O painel Market State | 6, 9 e 11 | 52 s | Agora, Contexto e Leitura; o estado define o tipo de trade |
| 2 | Contexto a favor ou contra | 1 e 5 | 44 s | Queda forte contra W/M não é venda; alta alinhada D/W/M |
| **Módulo 2 · Estado de alta** | | | | |
| 3 | Setup de alta: varredura, valor e rompimento | 5 | 50 s | Compra na volta ao valor, gatilho nas VWAPs D e W |
| 4 | Base, rompimento e alvo com Gamma | 10 | 51 s | Base com confluência ou rompimento do VAH W |
| 5 | Expansão: até onde deixar correr | 9, 11 e 12 | 51 s | Realizações nos alvos de volatilidade, alvo de volume, calls acima |
| **Módulo 3 · Estado de baixa** | | | | |
| 6 | A queda pela estrutura | 3 | 52 s | Venda no repique na região, gatilho no POC M |
| 7 | Perdeu o Zero Gamma | 8 | 50 s | Venda na rejeição do VAH D, gatilho no Zero Gamma |
| 8 | Do teto de calls ao piso de puts | 7 | 52 s | Teto de calls, gatilho no cluster, alvo nas puts e quando parar |
| **Módulo 4 · Equilíbrio** | | | | |
| 9 | Equilíbrio na banda: operar os extremos | 6 | 52 s | Compra no extremo de baixo, alvo na média |
| 10 | Retorno à média com Gamma | 13 | 51 s | Realizar no alvo de liquidez e operar a volta até as puts |
| **Módulo 5 · Níveis e alvos** | | | | |
| 11 | Nível respeitado: defesa e alvo no VAH D | 2 | 50 s | Defesa de um nível de puts, alvo no topo do valor |
| 12 | Escada de valor e alvos M e 3M | 4 | 52 s | Cada nível rompido vira degrau |
| **Módulo 6 · Mais alta e baixa** | | | | |
| 13 | Topos descendentes pela estrutura | 16 | 57 s | Estado de baixa pelos topos, venda no repique |
| 14 | Queda no 1 minuto: as bandas apontam para baixo | 15 | 52 s | Repique na banda, gatilho, alvos e a hora de parar |
| 15 | Do fundo ao alvo: fundos mais altos | 19 | 58 s | O primeiro fundo mais alto depois da varredura, até o nível de cima |
| 16 | Rompimento do valor no NQ | 21 | 52 s | A caixa sob os VAH, o piso de puts, os alvos de calls, W e M |
| **Módulo 7 · Ferramentas** | | | | |
| 17 | Com e sem o Estado de Mercado | 17 e 18 | 53 s | O mesmo dia com o indicador desligado e ligado |
| 18 | Abaixo do Zero Gamma: o regime muda | 20 | 53 s | O Zero Gamma como teto, alvos no MAJOR- e nas barras negativas |
| 19 | O mapa do swing: três semanas no 30 minutos | 14 | 58 s | Ler o swing e montar o plano condicional do dia |

Os arquivos vão de `m01-...` a `m19-...`. O roteiro completo de cada aula está no anexo.

## Encaixe nos 8 encontros da Mentoria 1:1 (proposta)

Um módulo por encontro e o último para juntar tudo num plano pessoal. Entre um encontro e outro, o aluno faz a trilha de estudos daquele módulo.

| Encontro | Módulo | Aulas | Prática até o próximo encontro |
|---|---|---|---|
| 1 | Leitura do estado | 1 e 2 | Ler o painel e o contexto D/W/M em 5 replays |
| 2 | Estado de alta | 3 a 5 | 3 replays de alta por aula, com região, gatilho, stop e alvo |
| 3 | Estado de baixa | 6 a 8 | 3 replays de baixa por aula |
| 4 | Equilíbrio | 9 e 10 | 3 replays de equilíbrio por aula |
| 5 | Níveis e alvos | 11 e 12 | Marcar os níveis e os alvos antes de o preço chegar |
| 6 | Mais alta e baixa | 13 a 16 | Um replay por dia, com a ficha completa |
| 7 | Ferramentas | 17 a 19 | O mapa do swing da semana e o plano condicional do dia |
| 8 | Revisão e plano pessoal | Todas | Checklist antes do trade, diário de estudos e rotina do dia |

## Trilha de estudos (4 semanas)

Serve para quem estuda sozinho e para organizar os estudos entre os encontros. São uma aula por dia útil e uma revisão no fim.

| Semana | Aulas | Foco |
|---|---|---|
| 1 | 1 a 5 | Ler o estado e o contexto; a alta |
| 2 | 6 a 10 | A baixa e o equilíbrio |
| 3 | 11 a 15 | Níveis, alvos e mais exemplos de alta e baixa |
| 4 | 16 a 19 e revisão | Rompimento, ferramentas, o mapa do swing e o plano pessoal |

O cronograma dia a dia está no ZIP, na planilha "Cronograma de estudos (4 semanas)".

### A rotina de cada aula (de 25 a 40 minutos)

1. Assista até a tela "Pause o vídeo" e pare.
2. Preencha a ficha: estado, contexto D/W/M, região de atuação, gatilho, invalidação e alvos.
3. Continue o vídeo e compare. Anote o que ficou diferente.
4. Procure três situações parecidas no replay e preencha a ficha de novo em cada uma.
5. Registre tudo no diário de estudos.

### O checklist antes do trade

1. Qual é o estado: alta, baixa ou equilíbrio?
2. O contexto D/W/M está a favor?
3. O preço está numa região de atuação (nível, banda, valor ou Gamma) ou no meio do nada?
4. Qual é o gatilho, e ele já aconteceu?
5. Onde a ideia acaba (o stop) e quanto isso custa em dinheiro?
6. Quais alvos estão no mapa, e o alvo compensa o risco?
7. Tem notícia ou horário perigoso agora? Na dúvida, fique de fora.

### Para avançar de módulo

- Todas as aulas do módulo com a ficha preenchida.
- Três replays próprios por aula, com a leitura conferida pelo mentor.
- Explicar o resumo de cada aula com as próprias palavras.

### O que acompanhar no GL OS

- Aulas assistidas e fichas entregues por aluno.
- Replays praticados por semana.
- Leituras conferidas: quantas vezes o aluno acertou a região, o gatilho e o stop.
- Dúvidas que se repetem. Elas viram aulas novas.
- O lucro não entra como métrica de estudo: o que se mede é o processo.

## Como usar com os alunos

- **Ordem:** o módulo 1 primeiro (leitura do estado), depois alta, baixa e equilíbrio. Os módulos 6 e 7 aprofundam e revisam.
- **Exercício:** na tela "Pause o vídeo", o aluno escreve região, gatilho, stop e alvo antes de continuar e depois compara com a aula.
- **Encontro 1:1:** a aula é o ponto de partida. O aluno refaz a leitura no replay do mesmo dia e de dias parecidos.
- **Onde publicar:** área do aluno, APP ou YouTube não listado. São aulas para alunos, não peças de anúncio.

## O que o Giovane valida

1. **As regras de entrada e de stop de cada aula.** São propostas a partir dos prints, não regras oficiais do método.
2. **As cores das velas no Estado de Mercado** (aula 17): amarelo na força compradora, laranja na vendedora e cinza nas pausas.
3. **Os nomes das linhas pontilhadas** (aulas 14 e 17), que aparecem como "bandas pontilhadas" e "pontos". Se tiverem nome oficial, as aulas são atualizadas.
4. **A "caixa da madrugada"** (aula 17) e a **linha cinza do alvo de 7.772** (aula 15): confirmar o que cada uma representa.
5. **A leitura do regime de gamma** (aula 18): "acima do Zero Gamma o preço tende a ser mais contido; abaixo, o movimento tende a acelerar".
6. **O print 20:** confirmar o ativo e a plataforma. A aula fala só em "o preço".

## Próximas aulas: os prints que faltam

As 19 aulas terminam no alvo, e o painel aparece só em alta e em equilíbrio. Para o aluno decidir sozinho no dia a dia, faltam principalmente:

1. **O setup que dá stop**, e o que fazer depois.
2. **O falso rompimento**: rompeu o valor e voltou para dentro.
3. **O dia de ficar de fora**, sem região limpa ou com o contexto contra.
4. **O dia de notícia** (CPI, payroll ou FOMC).
5. **A abertura de Nova York**, dentro e fora do valor de ontem.
6. **O painel em estado de baixa** e a **"Baixa alinhada D/W/M"**.
7. **A troca de estado na hora** e **a exaustão**.
8. **Um trade do começo ao fim**: parcial, stop no zero a zero, saída e tamanho da posição.
9. **Os sistemas sem aula própria**: GL Risk Auto, GL Orderflow Dominância, GL Trend Quant (Multi Fractal Model) e GL Volume Profile Expert, além do GL Gamma em dias especiais.
10. **O dia inteiro**: o plano antes da abertura, a revisão no fim do dia, o dia de tendência e os erros mais caros.

A lista completa, com o que mandar em cada print, está no anexo B e no arquivo prints-que-faltam.md.

## Onde estão os arquivos

- **Biblioteca, seção "Mentoria GL":** as 19 aulas para assistir e baixar, e o botão "Baixar a mentoria completa (ZIP)".
- **O ZIP da mentoria:**
  - 00 - Leia-me;
  - 01 - este plano, com os anexos;
  - 02 - Videoaulas, uma pasta por módulo;
  - 03 - Roteiros das aulas;
  - 04 - Estudos: cronograma, diário, checklist e índice das aulas;
  - 05 - Prints usados;
  - 06 - Capas das aulas;
  - 07 - Próximas aulas.
- **Repositório:** marketing/mentoria (o plano, os roteiros e os prints que faltam) e marketing/videos/specs-mentoria.js (as aulas).
- **Pacote organizado da Biblioteca:** pasta "15 - Mentoria".

## Decisões em aberto e perguntas para o GL OS

**Decisões em aberto:**

- [ ] Validar as regras das 19 aulas.
- [ ] Onde publicar as aulas: área do aluno, APP GL Model Academy ou YouTube não listado.
- [ ] Se o Giovane grava uma narração curta por aula (o texto do painel serve de roteiro).
- [ ] Aceitar ou ajustar o encaixe das aulas nos 8 encontros da Mentoria 1:1.
- [ ] Quem confere as fichas e os replays dos alunos, e em quanto tempo responde.
- [ ] O ritmo da segunda leva: por exemplo, uma aula nova por semana a partir dos prints que faltam.
- [ ] Se trechos das aulas também viram conteúdo aberto (YouTube e Reels) ou se tudo fica só para os alunos.

**Perguntas para o GL OS conferir:**

- A trilha conversa com o APP GL Model Academy e com o que o aluno já recebe hoje?
- As aulas cobrem os sete sistemas da GL? Hoje GL Risk Auto, GL Orderflow Dominância, GL Trend Quant e GL Volume Profile Expert ainda não têm aula própria.
- Quem do time acompanha os alunos no dia a dia e onde ficam as fichas e o diário de estudos?
- A trilha de 4 semanas cabe na agenda dos alunos e na dos encontros?
- Os termos das aulas batem com o glossário oficial (cores das velas, bandas, pontos e caixa da madrugada)?
- O uso de prints reais nas aulas já passou pelo advogado (CVM e LGPD)?

<!-- ANEXOS: o mentoria_pacote.py acrescenta aqui o anexo A (roteiro de cada aula) e o anexo B (prints que faltam) na versão para o GL OS. -->

Exemplos educacionais em replay. Não é recomendação de investimento. Trading envolve risco financeiro real.
