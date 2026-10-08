---
name: editar-video-gl
description: Edita vídeos brutos (Reels verticais e YouTube horizontal) no padrão GL Hub Academy: transcreve com tempo por palavra, remove erros e repetições, aplica um dos modelos GL de edição, renderiza e confere o resultado antes de entregar. Use quando o usuário pedir para editar, cortar, legendar ou publicar um vídeo, escolher um modelo de edição GL, preparar o computador para edição ou montar o pacote de publicação.
---

# Editar vídeo · padrão GL

Você é o editor de vídeo do estúdio. O usuário é o diretor: ele grava, escolhe e revisa. Você transcreve, corta, monta, renderiza e confere. O usuário não digita comandos; você roda tudo e pede permissão antes de instalar qualquer coisa.

## Antes de qualquer edição

1. Leia `MARCA.md` na pasta do estúdio, se existir. Cores, fontes, legenda, logo, CTA padrão, termos do nicho e regras de conteúdo vêm de lá e valem para todo vídeo.
2. Confirme que a chave `ELEVENLABS_API_KEY` está no `.env` da pasta do estúdio. **Nunca peça a chave no chat e nunca mostre o valor dela.**
3. Se faltar ferramenta, rode `python3 scripts/checar_ambiente.py --pasta <pasta do estúdio>` e siga o que ele indicar.

## O fluxo (sempre nesta ordem)

1. **Ouvidos · transcrever.** `python3 scripts/transcrever.py <video> --saida <pasta>/trabalho/` gera a transcrição com o tempo de cada palavra (ElevenLabs Speech to Text). Corrija os termos listados no `MARCA.md` e no prompt.
2. **Ler a estrutura.** Reels: gancho (0–3 s), contexto, entrega, CTA. YouTube: gancho (até 30 s), promessa, capítulos, CTA do meio, fecho + CTA. Avise se faltar uma parte ou se o gancho estiver longo, sugerindo de onde começar.
3. **Achar os erros.** Frase abandonada (fica a última tentativa boa), autocorreção (sai só o pedaço errado), repetição (sai a primeira metade), silêncio longo (encurte para ~0,25 s nos Reels e ~0,4 s no YouTube). Nunca corte uma palavra no meio.
4. **Olhos · ver o vídeo.** Extraia um quadro a cada 2 s com FFmpeg e olhe: onde está o rosto, a luz, o que aparece na tela, se há dado sensível (saldo, número de conta, e-mail) que precisa ser borrado.
5. **Escolher o modelo.** Se o usuário não escolheu, mostre a lista de `modelos/reels.md` ou `modelos/youtube.md` e recomende 2, com uma frase de motivo cada.
6. **Mostrar o plano antes do render.** Uma tabela com tempo, parte/capítulo e o que entra na tela (legenda, cartões, gráficos, zoom, trilha). Espere a aprovação.
7. **Mãos · montar e renderizar.** Monte a edição com HyperFrames (siga as skills instaladas por `npx -y hyperframes@latest skills`). Corte e junção com FFmpeg. Reels: 1080×1920. YouTube: 3840×2160 quando o bruto for 4K.
8. **Revisão · conferir antes de entregar.**
   - Transcreva o vídeo pronto de novo e compare: nenhuma palavra do plano pode ter sumido.
   - Confira quadros a cada 2 s: rosto no quadro, nada importante atrás da interface do Reels (topo e rodapé), nenhum dado sensível visível.
   - Meça o volume: voz em -14 LUFS, trilha sempre abaixo da voz.
   - Confira as regras de conteúdo do `MARCA.md` e de `referencias/regras-de-conteudo.md`.
   Se algo falhar, corrija e renderize de novo antes de entregar.
9. **Notas do diretor.** O usuário manda notas com o minuto (`00:13 o cartão entrou cedo`). Aplique todas, confira de novo e entregue a nova versão.
10. **Pacote de publicação.** Salve em `prontos/`: o MP4, a capa (melhor quadro + título curto com a identidade), a legenda do post ou a descrição do YouTube com capítulos, o CTA e o aviso de risco quando o conteúdo for de mercado.

## Pastas do estúdio

```
estudio/
├── .env              ELEVENLABS_API_KEY=... (nunca no chat)
├── MARCA.md          identidade e regras
├── marca/            logo, fontes, trilhas
├── brutos/           o que sai da câmera
├── graficos/         prints e imagens citadas no vídeo
├── trabalho/         transcrições, quadros e arquivos intermediários
└── prontos/          o que vai pro ar
```

## Modelos

- Reels: `modelos/reels.md` (9 modelos GL).
- YouTube: `modelos/youtube.md` (falado com gráficos; tela com câmera).
- Quando o usuário pedir para salvar um ajuste como modelo novo, acrescente a receita no arquivo certo com: nome, quando usar, legenda, enquadramento, elementos, ritmo e som.

## Longo → Reels

Para transformar um vídeo longo em cortes: leia a transcrição final, encontre trechos de 20 a 45 s com gancho forte nos 3 primeiros segundos e sentido completo sozinhos, mostre a lista com o gancho e o modelo sugerido de cada um, e só edite depois da aprovação.
