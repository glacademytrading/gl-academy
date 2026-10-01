# Rodada premium na Higgsfield: pausada e pronta para retomar

Pausada em 1º de outubro de 2026, a pedido, para não gastar crédito enquanto os prints novos são tirados.

- **Saldo:** 945,5 créditos.
- **Já gasto nesta rodada:** 64,5 créditos (6 imagens base e 2 rascunhos do logo).
- **Projeto na Higgsfield:** "GL Academy · Marketing" (`f29c1595-8dbb-492e-8b54-2306a1d404b4`).

## Como retomar

1. **Liberar a rede do ambiente** para `upload.higgsfield.ai`, `cdn.higgsfield.ai`, `d8j0ntlcm91z4.cloudfront.net` e `d2ol7oe51mr4n9.cloudfront.net`. Isso se faz no menu do ambiente, na barra de título da sessão: Editar, Acesso à rede. Com isso o Claude envia os prints e baixa os clipes sem ninguém subir arquivo à mão.
2. **Mandar os prints novos** (lista na Biblioteca, seção "Lista de prints").
3. **Colar o prompt de `PROMPT-retomar-higgsfield.md`** (também na Biblioteca, com botão de copiar) com os prints anexados. O fluxo é sempre: rascunho barato em 480p, aprovação, e só então 1080p.

Sem liberar a rede também dá: os prints são enviados no projeto acima, à mão. Nesse caminho a IA usa o print como referência e pode redesenhar detalhes da tela.

## Peças, situação e custo

Custos medidos com a própria Higgsfield (`get_cost`) em 30/09:

- **Seedance 2.5 em 1080p:** 60 créditos por 5 s e 96 por 8 s. Com ou sem som, o custo é igual.
- **Rascunho do Seedance 2.5 em 480p:** 15 créditos por 5 s e 24 por 8 s.
- **Imagem gpt_image_2_5 alta em 2k:** 2,75 créditos.

| Peça | O que já existe | Próximo passo | Custo estimado |
| --- | --- | --- | --- |
| Logo GL em 8 s, 16:9 e 9:16 | Rascunhos `cb1397cd-73e7-495e-b7bf-62a7661a01a3` (16:9) e `bf568a70-1e17-46f0-bf46-82c3ec82c434` (9:16) | Comparar com `logo-gl-8s-*` feito aqui sem crédito. Finalizar só se o da Higgsfield for claramente melhor (passar `draft_job_id`) | 96 por formato |
| Operacional em cena premium: alta alinhada D/W/M, mapa de Gamma, alvos, NinjaTrader | Prompts abaixo | Estúdio com câmera parada e monitor apagado. O gráfico real (ou o vídeo do setup acontecendo) entra na tela por composição local, em perspectiva | ~18 por cena em rascunho (imagem + 5 s) e 60 para finalizar |
| Antes e depois | "Antes" pronto: `64ea5b7f-9dfb-4f02-aefe-c12af2300ad4` (9:16) e `bf5e92c2-f258-48af-9f06-523dd22ff257` (16:9) | Gerar o clipe do "antes" e a cena do "depois" com o monitor apagado para receber o print real | ~15 por rascunho e 60 por clipe final |

### Outras mídias já na conta

| Mídia | Uso |
| --- | --- |
| `3d08a759-b3d1-40c9-8b77-1d8811f8ee04` | Emblema GL oficial (fundo transparente) |
| `e50e447f-4a78-4ed8-8ed0-bb1b1db8650f` | Partículas douradas em fundo preto, 16:9 |
| `3da0d133-cca6-4e35-8b72-1e2dca180ac0` | Partículas douradas em fundo preto, 9:16 |
| `6c4dbca4-433a-468b-9792-76d60b6811c4` | Emblema centralizado em fundo preto, 16:9 |
| `87b589c3-ad3f-4bad-83c6-2c59e484c683` | Emblema centralizado em fundo preto, 9:16 |

## Por que compor o gráfico localmente

Modelos de vídeo redesenham o que aparece numa tela: entortam números, níveis e candles. Com a câmera travada e o monitor apagado, a Higgsfield gera só o cenário (luz, pessoa, ambiente). O print real é encaixado no monitor localmente, em perspectiva, e o operacional aparece exatamente como é. Para isso é preciso baixar os clipes, o que depende do passo 1.

## Prompts

**Cena de estúdio, imagem base** (gpt_image_2_5, alta, 2k, 9:16; para 16:9 trocar "vertical" por "wide")

> Photorealistic cinematic vertical shot of a premium dark trading studio at night. Over-the-shoulder view of a focused trader in a black shirt at a sleek walnut desk, facing one large monitor in the upper center of the frame. The monitor screen is completely black and evenly lit, facing the camera straight on, all four corners clearly visible. Warm gold rim light from the left, soft teal ambient glow, minimalist keyboard, shallow depth of field. No text, no logos, nothing on the screen.

Variações por cena:

- **Alta alinhada:** como acima.
- **Gamma:** monitor vertical em close lateral.
- **Alvos:** trader em pé ao lado da mesa, sem cobrir a tela.
- **NinjaTrader:** plano aberto de mesa com três monitores, o central apagado.

**Cena de estúdio, vídeo** (Seedance 2.5, 5 s, imagem acima como quadro inicial, rascunho 480p)

> Locked-off tripod shot, the camera does not move at all. The trader breathes and makes small natural movements, adjusting the mouse; the gold light flickers gently. The monitor stays perfectly still and completely black for the whole shot. No camera movement, no zoom, no text.

**Antes, vídeo** (Seedance 2.5, 5 s, imagem do "antes" como quadro inicial)

> Slow push-in. The stressed trader rubs his face in frustration, red monitor light flickers on his tense face, the chaotic chart keeps flashing red. Dark, moody, film grain. No readable text.

**Depois, imagem base** (gpt_image_2_5, alta, 2k, 9:16)

> Same trader in his thirties, now calm and composed in an organized, softly lit studio in the morning, leaning back with a coffee, facing one large monitor whose screen is completely black and facing the camera straight on. Warm gold light, teal accents. No text, nothing on the screen.

**Logo, rascunhos já feitos** (Seedance 2.5, omni_reference, 8 s, quadro inicial com partículas e quadro final com o emblema centralizado)

> Luxury cinematic logo reveal on pure black. It starts with sparse golden particles floating in darkness. The particles slowly swirl toward the center, accelerate gracefully and assemble precisely into the ornate gold GL emblem, ornament by ornament. The emblem is fully formed by second 6. During the final 2 seconds the finished emblem stays perfectly still, sharp and centered, with one slow light sweep across the polished gold and a soft warm glow. Very slow camera push-in. Sound: a soft airy shimmer building up, then a deep elegant bass hit with a gentle chime when the emblem completes. No text other than the emblem, no extra objects.

## Orçamento sugerido

| Etapa | Créditos |
| --- | --- |
| 4 cenas de estúdio 9:16: imagem e rascunho | ~72 |
| Finalizar as 4 cenas aprovadas | ~240 |
| Antes e depois 9:16: rascunhos e finais | ~153 |
| Logo em 1080p, só se ganhar do logo local | 0 a 192 |
| **Total** | **~465 a 657, de 945,5** |
