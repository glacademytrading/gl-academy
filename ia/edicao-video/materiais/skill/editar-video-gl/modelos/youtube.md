# Formatos GL de YouTube (16:9, 4K quando possível)

Estrutura de todo vídeo longo: gancho (até 30 s) → promessa (mapa do vídeo) → capítulos → CTA do meio (leve) → fecho com resumo em 3 frases + CTA.

## Falado com gráficos
Para método, opinião, história e análise da semana. Grava só a câmera.

- **Título de capítulo:** entra a cada mudança de assunto (canto superior esquerdo, serifa, etiqueta "Capítulo N").
- **Nome na tela:** nome e cargo do `MARCA.md` na primeira aparição, por ~4 s.
- **Janelas de gráfico:** prints e imagens de `graficos/` em janela com moldura, entrando na palavra em que são citados.
- **Legenda de frase-chave:** só nas frases mais importantes, não no vídeo todo.
- **Enquadramento:** alterna close e meio corpo; zoom leve para ênfase.
- **Som:** trilha da pasta `marca/trilhas` com ducking sob a voz; voz em -14 LUFS.

## Tela com câmera
Para operação comentada, tutorial de plataforma e demonstração de produto. Grava tela e câmera (separadas ou juntas).

- **Sincronização:** se forem dois arquivos, sincronize pela palma do começo (pico de áudio) ou pela forma de onda.
- **Câmera no canto:** círculo ou retângulo arredondado no canto inferior direito; some quando a tela precisa de espaço.
- **Zoom no ponto:** enquadre o trecho da tela que está sendo explicado; volte ao quadro inteiro entre explicações.
- **Dados sensíveis:** borre saldo, número de conta, e-mail, telefone e qualquer dado pessoal em todos os quadros em que aparecerem. Confira de novo na revisão.
- **Tela recriada:** quando a tela for um site, grave de novo com Playwright em alta resolução para ficar nítida.
- **Som:** mesmo padrão do formato falado.
