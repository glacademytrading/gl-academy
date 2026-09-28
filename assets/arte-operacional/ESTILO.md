# Estilo "Geometria Dourada" — artes GL Academy

Padrão aprovado para a série de artes (Mentorias, Tecnologias, …). Formato vertical **2076×3432**.

## Composição
1. **Fundo:** geometria dourada original da GL (`geometria-base.jpg`) — linhas, pontos brilhantes e céu estrelado ficam como estão.
2. **Sem logo e sem texto original:** o medalhão "GL" é coberto pela moldura; "GL ACADEMY / TRADING & INVESTMENTS / by Giovane Lázaro" é substituído pelo céu estrelado da própria imagem.
3. **Imagem central:** dentro de uma moldura dourada (linha dupla, brilho quente, ponto luminoso em cada canto), sobre fundo preto. A imagem só é redimensionada por igual — **nunca cortada, redesenhada ou com itens inventados**.
4. **Títulos (abaixo da geometria):**
   - **Título:** Cinzel, peso 600, maiúsculas, dourado metálico em degradê (`#FFF0BE → #E9BE69 → #C4923E → #8C5E22`), brilho suave e sombra.
   - **Linha 2:** Cinzel, peso 500, maiúsculas, bem espaçada, mesmo dourado.
   - **Divisor:** linha dourada fina que some nas pontas, com losango brilhante no centro (eco dos vértices da geometria).
   - **Subtítulo:** Cormorant Garamond *itálico*, peso 500, dourado champanhe (`#F6E2B2 → #CDA55F`), em 1–2 linhas equilibradas.
   - Linhas longas são reduzidas automaticamente para ocupar no máximo 86% da largura.

## Paleta dos gráficos (nas imagens de operacional)
- **Branco** = alta · **Vermelho** = baixa (nunca verde/roxo).

## Como gerar uma nova arte
```bash
pip install pillow numpy opencv-python-headless
python3 arte_gl.py --centro minha-imagem.png \
    --titulo "TECNOLOGIAS" \
    --linha2 "OPERACIONAL PROFISSIONAL COMPLETO" \
    --sub "A tecnologia que analisa tudo para sua" \
    --sub "comodidade e resultados eficientes" \
    --saida tecnologias.png
```
As fontes (Google Fonts, licença OFL) são baixadas automaticamente na primeira execução.

## Artes já feitas neste estilo
| Arte | Título | Linha 2 | Subtítulo |
|---|---|---|---|
| Mentorias | MENTORIAS | E TREINAMENTO PRÁTICO | Particular ao vivo ou gravada completa / atualizada em 2026 |
| Tecnologias | TECNOLOGIAS | OPERACIONAL PROFISSIONAL COMPLETO | A tecnologia que analisa tudo para sua / comodidade e resultados eficientes |
