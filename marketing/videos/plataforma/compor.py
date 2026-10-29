# Encaixa prints reais nas telas pretas dos vídeos de estúdio (Higgsfield), quadro a quadro.
# A tela é achada como a região preta mais retangular; o print entra em perspectiva e o que passa
# na frente da tela (cabeça, mão) continua por cima, porque só os pixels pretos da tela são trocados.
# As telas partem de cantos aproximados (fração da imagem, em cenas.json) e são refinadas pelos pixels pretos.
# Uso: python3 compor.py cena video.mp4 saida.mp4 print1.png [print2.png ...]  (telas na ordem de cenas.json)
#      python3 compor.py cena --foto imagem.png saida.png print1.png [...]
import sys, subprocess, json, numpy as np, cv2

FF = '/usr/local/lib/python3.11/dist-packages/imageio_ffmpeg/binaries/ffmpeg-linux-x86_64-v7.0.2'
LIMIAR = 26
import os
CENAS = json.load(open(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'cenas.json')))


def _reta(pts):
    vx, vy, x0, y0 = cv2.fitLine(pts.astype(np.float32), cv2.DIST_HUBER, 0, 0.01, 0.01).ravel()
    return np.float32([x0, y0]), np.float32([vx, vy])


def _cruza(r1, r2):
    (p, d), (q, e) = r1, r2
    A = np.float32([[d[0], -e[0]], [d[1], -e[1]]])
    if abs(np.linalg.det(A)) < 1e-6: return None
    t = np.linalg.solve(A, q - p)[0]
    return p + t * d


def refinar(frame, q0, folga=0.035):
    """Acha a tela perto do quadrilátero q0: ajusta uma reta em cada lado da região preta e cruza as retas.
    Pontos na borda da imagem não contam, então um canto pode ficar fora do quadro num zoom."""
    H, W = frame.shape[:2]
    v = cv2.cvtColor(frame, cv2.COLOR_BGR2HSV)[:, :, 2]
    c = q0.mean(0); qa = c + (q0 - c) * (1 + folga * 2)
    area = np.zeros((H, W), np.uint8); cv2.fillConvexPoly(area, qa.astype(np.int32), 1)
    m = ((v < LIMIAR) & (area > 0)).astype(np.uint8)
    m = cv2.morphologyEx(m, cv2.MORPH_OPEN, np.ones((5, 5), np.uint8))
    n, lab, st, _ = cv2.connectedComponentsWithStats(m)
    if n < 2: return q0
    k = 1 + np.argmax(st[1:, cv2.CC_STAT_AREA])
    cs, _ = cv2.findContours((lab == k).astype(np.uint8), cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_NONE)
    pts = max(cs, key=cv2.contourArea).reshape(-1, 2).astype(np.float32)
    pts = pts[(pts[:, 0] > 3) & (pts[:, 0] < W - 4) & (pts[:, 1] > 3) & (pts[:, 1] < H - 4)]
    lim = 0.03 * max(W, H)
    retas = []
    for i in range(4):
        a, b = q0[i], q0[(i + 1) % 4]
        d = (b - a) / max(np.linalg.norm(b - a), 1); nrm = np.float32([-d[1], d[0]])
        rel = pts - a; t = rel @ d; dist = np.abs(rel @ nrm)
        L = np.linalg.norm(b - a)
        sel = pts[(dist < lim) & (t > 0.08 * L) & (t < 0.92 * L)]
        retas.append(_reta(sel) if len(sel) >= 25 else (a, d))
    out = []
    for i in range(4):
        p = _cruza(retas[i - 1], retas[i])
        out.append(q0[i] if p is None else p)
    q = np.float32(out)
    if np.abs(q - q0).max() > 0.08 * W: return q0
    return q


def cfg(cena):
    c = CENAS[cena]
    return c if isinstance(c, dict) else {'telas': c}


def telas(frame, cena, ant=None):
    H, W = frame.shape[:2]
    if ant is None:
        ant = [np.float32(np.float32(t) * [W, H]) for t in cfg(cena)['telas']]
    return [refinar(frame, q) for q in ant]


def ordenar(q):
    s = q.sum(1); d = np.diff(q, axis=1).ravel()
    return np.array([q[np.argmin(s)], q[np.argmin(d)], q[np.argmax(s)], q[np.argmax(d)]], np.float32)  # tl, tr, br, bl


def encaixar(frame, q, img, inset=0.012, delta=30):
    H, W = frame.shape[:2]
    q = np.float32(q); c = q.mean(0); q2 = np.float32(c + (q - c) * (1 - inset))
    h, w = img.shape[:2]
    M = cv2.getPerspectiveTransform(np.float32([[0, 0], [w, 0], [w, h], [0, h]]), q2)
    tela = cv2.warpPerspective(img, M, (W, H), flags=cv2.INTER_AREA)
    area = np.zeros((H, W), np.uint8); cv2.fillConvexPoly(area, q2.astype(np.int32), 255)
    # tela = o que está perto do preto da própria tela (média local, para cabelo escuro não virar tela)
    v = cv2.blur(cv2.cvtColor(frame, cv2.COLOR_BGR2HSV)[:, :, 2], (9, 9)).astype(np.float32)
    base = np.median(v[area > 0])
    preto = (v < base + delta).astype(np.uint8) * 255
    m = cv2.bitwise_and(area, preto)
    m = cv2.GaussianBlur(m, (5, 5), 0).astype(np.float32)[..., None] / 255
    tela = (tela.astype(np.float32) * 0.93)  # tela levemente mais escura que o print, como um monitor real
    out = frame.astype(np.float32) * (1 - m) + tela * m
    # brilho da tela no ambiente
    glow = cv2.GaussianBlur(cv2.resize(tela, (W // 8, H // 8)), (0, 0), 6)
    glow = cv2.resize(glow, (W, H)) * (1 - area[..., None] / 255) * 0.18
    return np.clip(out + glow, 0, 255).astype(np.uint8)


def main():
    a = sys.argv[1:]
    cena = a.pop(0)
    foto = a[0] == '--foto'
    if foto: a = a[1:]
    src, dst, prints = a[0], a[1], [cv2.imread(p) for p in a[2:]]
    n = len(prints)
    if foto:
        f = cv2.imread(src); qs = telas(f, cena)
        for q, p in zip(qs, prints): f = encaixar(f, q, p, delta=cfg(cena).get('delta', 30))
        cv2.imwrite(dst, f); print(json.dumps([q.tolist() for q in qs])); return
    info = subprocess.run([FF, '-i', src], capture_output=True, text=True).stderr
    import re
    W, H = map(int, re.search(r', (\d{3,4})x(\d{3,4})', info).groups())
    fps = re.search(r'(\d+(?:\.\d+)?) fps', info).group(1)
    rd = subprocess.Popen([FF, '-v', 'error', '-i', src, '-f', 'rawvideo', '-pix_fmt', 'bgr24', '-'], stdout=subprocess.PIPE)
    frames = []
    while True:
        b = rd.stdout.read(W * H * 3)
        if len(b) < W * H * 3: break
        frames.append(np.frombuffer(b, np.uint8).reshape(H, W, 3))
    qs_all, ant = [], None
    for f in frames:
        ant = telas(f, cena, ant); qs_all.append(ant)
    # preenche quadros sem detecção e suaviza os cantos no tempo
    idx = [i for i, q in enumerate(qs_all) if q is not None]
    if not idx: sys.exit('tela não encontrada')
    for i in range(len(qs_all)):
        if qs_all[i] is None: qs_all[i] = qs_all[min(idx, key=lambda j: abs(j - i))]
    arr = np.array(qs_all, np.float32)  # T, n, 4, 2
    k = 5; pad = np.pad(arr, ((k, k), (0, 0), (0, 0), (0, 0)), mode='edge')
    suave = np.stack([pad[i:i + 2 * k + 1].mean(0) for i in range(len(arr))])
    wr = subprocess.Popen([FF, '-v', 'error', '-y', '-f', 'rawvideo', '-pix_fmt', 'bgr24', '-s', f'{W}x{H}', '-r', fps, '-i', '-',
                           '-c:v', 'libx264', '-crf', '18', '-preset', 'medium', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', dst], stdin=subprocess.PIPE)
    for f, qs in zip(frames, suave):
        for q, p in zip(qs, prints): f = encaixar(f, q, p, delta=cfg(cena).get('delta', 30))
        wr.stdin.write(f.tobytes())
    wr.stdin.close(); wr.wait()
    print(dst, len(frames), 'quadros', W, H)


if __name__ == '__main__':
    main()
