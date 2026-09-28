#!/usr/bin/env python3
"""Arte GL Academy - estilo "geometria dourada".

Monta a arte padrão da série:
  1. geometria dourada da GL (geometria-base.jpg) sem o medalhão/logo e sem o texto original;
  2. a imagem escolhida no centro, numa moldura dourada com pontos brilhantes nos cantos
     (a imagem é apenas redimensionada por igual - nada é cortado, redesenhado ou inventado);
  3. títulos: título grande em Cinzel, segunda linha menor em Cinzel espaçada,
     divisor dourado com losango e subtítulo em Cormorant Garamond itálico.

Exemplo:
  python3 arte_gl.py --centro operacional.png \
      --titulo "TECNOLOGIAS" --linha2 "OPERACIONAL PROFISSIONAL COMPLETO" \
      --sub "A tecnologia que analisa tudo para sua" --sub "comodidade e resultados eficientes" \
      --saida tecnologias.png

Dependências: pip install pillow numpy opencv-python-headless
As fontes (Google Fonts, licença OFL) são baixadas automaticamente na primeira execução.
"""
import argparse, os, urllib.request
import cv2, numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont

AQUI = os.path.dirname(os.path.abspath(__file__))
FONTES = {
    'cinzel': ('Cinzel[wght].ttf', 'https://raw.githubusercontent.com/google/fonts/main/ofl/cinzel/Cinzel%5Bwght%5D.ttf'),
    'cormorant_it': ('CormorantGaramond-Italic[wght].ttf',
                     'https://raw.githubusercontent.com/google/fonts/main/ofl/cormorantgaramond/CormorantGaramond-Italic%5Bwght%5D.ttf'),
}
# Paleta
OURO = [(0, (255, 240, 190)), (0.45, (233, 190, 105)), (0.62, (196, 146, 62)), (1, (140, 94, 34))]  # títulos (metálico)
CHAMPANHE = [(0, (246, 226, 178)), (1, (205, 165, 95))]                                           # subtítulo
REF_W = 2076  # largura de referência (S=3); medidas abaixo escalam a partir dela


def fonte(nome, tamanho, peso):
    arq, url = FONTES[nome]
    caminho = os.path.join(AQUI, 'fonts', arq)
    if not os.path.exists(caminho):
        os.makedirs(os.path.dirname(caminho), exist_ok=True)
        urllib.request.urlretrieve(url, caminho)
    f = ImageFont.truetype(caminho, tamanho)
    f.set_variation_by_axes([peso])
    return f


# ---------------------------------------------------------------- geometria
def geometria_limpa(base_path, S):
    """Remove o texto original e devolve (imagem ampliada S vezes, array original limpo)."""
    src = Image.open(base_path).convert('RGB')
    W, H = src.size
    a = np.asarray(src).astype(np.float32)
    # texto "GL ACADEMY / TRADING & INVESTMENTS / by ..." -> céu estrelado da própria imagem
    tx0, ty0, tx1, ty1 = 84, 866, 608, 1040
    sky = a[1034:1144, tx0:tx1]
    sky = np.concatenate([sky, sky[::-1]], 0)[:ty1 - ty0]
    detail = sky - cv2.GaussianBlur(sky, (0, 0), 6)
    L = cv2.GaussianBlur(a[:, tx0 - 16:tx0].mean(1), (0, 0), 12).reshape(H, 1, 3)
    R = cv2.GaussianBlur(a[:, tx1:tx1 + 16].mean(1), (0, 0), 12).reshape(H, 1, 3)
    t = np.linspace(0, 1, W, dtype=np.float32)[None, :, None]
    low = L * (1 - t) + R * t
    m = np.zeros((H, W), np.float32)
    m[ty0 + 14:ty1 - 6, tx0 + 6:tx1 - 6] = 1
    m = cv2.GaussianBlur(m, (0, 0), 10)
    m[876:1026, 112:580] = np.maximum(m[876:1026, 112:580], np.clip((np.arange(876, 1026) - 876) / 6, 0, 1)[:, None])
    full = a.copy()
    full[ty0:ty1, tx0:tx1] = low[ty0:ty1, tx0:tx1] + detail
    a = a * (1 - m[..., None]) + full * m[..., None]
    img = Image.fromarray(np.clip(a, 0, 255).astype(np.uint8)).resize((W * S, H * S), Image.LANCZOS)
    return img


def moldura_com_centro(bg, centro, S, fade_bordas=True):
    """Moldura dourada sobre o medalhão (coordenadas da geometria-base) e a imagem centralizada."""
    PX0, PY0, PX1, PY1 = 92, 305, 600, 801
    x0, y0, x1, y1 = PX0 * S, PY0 * S, PX1 * S, PY1 * S
    bg = bg.convert('RGBA')
    glow = Image.new('RGBA', bg.size, (0, 0, 0, 0))
    ImageDraw.Draw(glow).rectangle((x0 - 8, y0 - 8, x1 + 8, y1 + 8), fill=(255, 190, 90, 150))
    bg = Image.alpha_composite(bg, glow.filter(ImageFilter.GaussianBlur(12 * S)))
    d = ImageDraw.Draw(bg)
    d.rectangle((x0 - 10, y0 - 10, x1 + 9, y1 + 9), fill=(8, 6, 4, 255), outline=(212, 170, 95, 255), width=max(3, round(1.4 * S)))
    d.rectangle((x0 - 4, y0 - 4, x1 + 3, y1 + 3), outline=(150, 112, 55, 255), width=1)
    cantos = [(x0 - 8, y0 - 8), (x1 + 7, y0 - 8), (x0 - 8, y1 + 7), (x1 + 7, y1 + 7)]
    nodes = Image.new('RGBA', bg.size, (0, 0, 0, 0)); n = ImageDraw.Draw(nodes)
    r = round(6.7 * S)
    for x, y in cantos: n.ellipse((x - r, y - r, x + r, y + r), fill=(255, 200, 110, 210))
    bg = Image.alpha_composite(bg, nodes.filter(ImageFilter.GaussianBlur(4 * S))); d = ImageDraw.Draw(bg)
    r = round(2.3 * S)
    for x, y in cantos: d.ellipse((x - r, y - r, x + r, y + r), fill=(255, 238, 195, 255))
    out = bg.convert('RGB')
    # imagem central: escala uniforme pela largura interna, centralizada na vertical
    pad = 6 * S
    aw = x1 - x0 - 2 * pad
    ah = round(aw * centro.height / centro.width)
    if ah > y1 - y0 - 2 * pad:  # imagem mais alta que a moldura: encaixa pela altura
        ah = y1 - y0 - 2 * pad; aw = round(ah * centro.width / centro.height)
    ax, ay = (x0 + x1) // 2 - aw // 2, (y0 + y1) // 2 - ah // 2
    ar = np.asarray(centro.resize((aw, ah), Image.LANCZOS) if (aw, ah) != centro.size else centro).astype(np.float32)
    f = np.ones(ah, np.float32)
    if fade_bordas:  # suaviza só as linhas escuras da borda de cima/baixo contra o preto da moldura
        k = 12 * S
        f[:k] = np.linspace(0, 1, k) ** 0.7; f[-k:] = np.linspace(1, 0, k) ** 0.7
    o = np.asarray(out).copy()
    fundo = o[ay:ay + ah, ax:ax + aw].astype(np.float32)
    o[ay:ay + ah, ax:ax + aw] = np.clip(ar * f[:, None, None] + fundo * (1 - f[:, None, None]), 0, 255).astype(np.uint8)
    return Image.fromarray(o), (aw / centro.width)


# ---------------------------------------------------------------- títulos
def texto_dourado(canvas, texto, fnt, cy, paleta, glow=0.55, track=0, k=1.0):
    W = canvas.size[0]
    larguras = [fnt.getlength(c) for c in texto]
    tw = sum(larguras) + track * (len(texto) - 1)
    asc, desc = fnt.getmetrics()
    m = Image.new('L', (int(tw) + 40, asc + desc + 40), 0); d = ImageDraw.Draw(m); x = 20
    for c, w in zip(texto, larguras):
        d.text((x, 20), c, font=fnt, fill=255); x += w + track
    m = m.crop(m.getbbox()); mw, mh = m.size
    ox, oy = (W - mw) // 2, int(cy - mh / 2)
    ys = np.linspace(0, 1, mh)
    pos = [p for p, _ in paleta]; cols = np.array([c for _, c in paleta], np.float32)
    grad = np.stack([np.interp(ys, pos, cols[:, i]) for i in range(3)], -1)[:, None, :].repeat(mw, 1)
    fill = Image.fromarray(grad.astype(np.uint8)).convert('RGBA'); fill.putalpha(m)
    layer = Image.new('RGBA', canvas.size, (0, 0, 0, 0))
    sh = Image.new('RGBA', (mw, mh), (0, 0, 0, 255)); sh.putalpha(m.point(lambda v: int(v * 0.85)))
    sl = Image.new('RGBA', canvas.size, (0, 0, 0, 0)); sl.paste(sh, (ox + round(4 * k), oy + round(6 * k)), sh)
    layer = Image.alpha_composite(layer, sl.filter(ImageFilter.GaussianBlur(6 * k)))
    g = Image.new('RGBA', (mw, mh), (255, 196, 110, 255)); g.putalpha(m.point(lambda v: int(v * glow)))
    gl = Image.new('RGBA', canvas.size, (0, 0, 0, 0)); gl.paste(g, (ox, oy), g)
    layer = Image.alpha_composite(layer, gl.filter(ImageFilter.GaussianBlur(18 * k)))
    tl = Image.new('RGBA', canvas.size, (0, 0, 0, 0)); tl.paste(fill, (ox, oy), fill)
    hi = m.filter(ImageFilter.GaussianBlur(1.2 * k))
    hm = np.asarray(m).astype(np.float32) - np.roll(np.asarray(hi).astype(np.float32), max(1, round(3 * k)), 0)
    hm = Image.fromarray(np.clip(hm * 0.5, 0, 255).astype(np.uint8))
    h = Image.new('RGBA', (mw, mh), (255, 246, 215, 255)); h.putalpha(hm); tl.paste(h, (ox, oy), h)
    return Image.alpha_composite(canvas, Image.alpha_composite(layer, tl)), mw


def linha_ajustada(canvas, texto, nome, tam, peso, cy, paleta, glow, track, k, max_w):
    """Desenha a linha; se passar da largura máxima, reduz a fonte até caber."""
    while True:
        f = fonte(nome, round(tam * k), peso)
        w = sum(f.getlength(c) for c in texto) + track * k * (len(texto) - 1)
        if w <= max_w or tam < 20: break
        tam *= 0.96
    out, _ = texto_dourado(canvas, texto, f, cy * k, paleta, glow, round(track * k), k)
    return out


def divisor(canvas, cy, k):
    W = canvas.size[0]; cx = W // 2; half = round(560 * k)
    dl = Image.new('RGBA', canvas.size, (0, 0, 0, 0)); d = ImageDraw.Draw(dl)
    gap = round(40 * k); wline = max(2, round(3 * k))
    for s in (1, -1):
        for i in range(0, half - gap, 2):
            a = int(230 * (1 - i / (half - gap)) ** 1.3)
            d.line((cx + s * (gap + i), cy, cx + s * (gap + 2 + i), cy), fill=(222, 178, 98, a), width=wline)
    glow = Image.new('RGBA', canvas.size, (0, 0, 0, 0)); r = round(34 * k)
    ImageDraw.Draw(glow).ellipse((cx - r, cy - r, cx + r, cy + r), fill=(255, 200, 110, 220))
    canvas = Image.alpha_composite(canvas, glow.filter(ImageFilter.GaussianBlur(14 * k)))
    r = round(14 * k); d.polygon([(cx, cy - r), (cx + r, cy), (cx, cy + r), (cx - r, cy)], fill=(255, 236, 190, 255))
    return Image.alpha_composite(canvas, dl)


def titulos(img, titulo, linha2, subs):
    """Bloco de títulos (medidas em pixels da largura de referência 2076, escaladas por k)."""
    W, H = img.size; k = W / REF_W; max_w = 0.86 * W
    out = img.convert('RGBA')
    out = linha_ajustada(out, titulo, 'cinzel', 200, 600, 2735, OURO, 0.55, 14, k, max_w)
    if linha2:
        out = linha_ajustada(out, linha2, 'cinzel', 84, 500, 2905, OURO, 0.45, 22, k, max_w)
    out = divisor(out, round(3010 * k), k)
    for i, s in enumerate(subs):
        out = linha_ajustada(out, s, 'cormorant_it', 92, 500, 3115 + 107 * i, CHAMPANHE, 0.35, 1, k, max_w)
    return out.convert('RGB')


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument('--centro', required=True, help='imagem que vai dentro da moldura')
    ap.add_argument('--base', default=os.path.join(AQUI, 'geometria-base.jpg'), help='geometria GL original (692x1144)')
    ap.add_argument('--titulo', default='')
    ap.add_argument('--linha2', default='')
    ap.add_argument('--sub', action='append', default=[], help='linha do subtítulo (repita para mais linhas)')
    ap.add_argument('--escala', type=int, default=3, help='3 = 2076x3432 (padrão da série)')
    ap.add_argument('--sem-fade', action='store_true', help='não suavizar as bordas de cima/baixo da imagem central')
    ap.add_argument('--saida', required=True)
    a = ap.parse_args()
    bg = geometria_limpa(a.base, a.escala)
    img, esc = moldura_com_centro(bg, Image.open(a.centro).convert('RGB'), a.escala, not a.sem_fade)
    if a.titulo:
        img = titulos(img, a.titulo, a.linha2, a.sub)
    img.save(a.saida, optimize=True)
    print(f'{a.saida}: {img.size[0]}x{img.size[1]}, imagem central em {esc:.3f}x')


if __name__ == '__main__':
    main()
