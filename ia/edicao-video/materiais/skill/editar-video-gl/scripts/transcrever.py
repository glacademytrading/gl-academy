#!/usr/bin/env python3
"""Transcreve um vídeo com o tempo de cada palavra (ElevenLabs Speech to Text).

Uso:
    python3 transcrever.py brutos/video.mp4 --saida trabalho/ [--idioma por] [--env .env]

Gera em --saida:
    <nome>.audio.m4a        o áudio extraído (o que é enviado)
    <nome>.transcricao.json a resposta completa, com "words": [{text, start, end, type}]
    <nome>.segmentos.txt    a fala em frases (S000, S001...) com o tempo de início

A chave é lida de ELEVENLABS_API_KEY no .env e nunca é impressa.
Só usa a biblioteca padrão do Python; precisa do FFmpeg instalado.
"""

import argparse
import json
import os
import subprocess
import sys
import urllib.error
import urllib.request
import uuid
from pathlib import Path

API_URL = "https://api.elevenlabs.io/v1/speech-to-text"


def load_key(env_path):
    if os.environ.get("ELEVENLABS_API_KEY"):
        return os.environ["ELEVENLABS_API_KEY"]
    if env_path.exists():
        for line in env_path.read_text(encoding="utf-8").splitlines():
            if line.strip().startswith("ELEVENLABS_API_KEY="):
                return line.split("=", 1)[1].strip().strip('"').strip("'")
    sys.exit(f"ELEVENLABS_API_KEY não encontrada em {env_path}. Veja o prompt 3 da aula 2.")


def extract_audio(video, audio):
    cmd = ["ffmpeg", "-y", "-loglevel", "error", "-i", str(video), "-vn", "-ac", "1", "-ar", "44100", "-c:a", "aac", "-b:a", "128k", str(audio)]
    if subprocess.run(cmd).returncode != 0:
        sys.exit("Falha ao extrair o áudio com o FFmpeg.")


def multipart(fields, file_field, file_path):
    boundary = uuid.uuid4().hex
    parts = []
    for name, value in fields.items():
        parts.append(f'--{boundary}\r\nContent-Disposition: form-data; name="{name}"\r\n\r\n{value}\r\n'.encode())
    parts.append(
        f'--{boundary}\r\nContent-Disposition: form-data; name="{file_field}"; filename="{file_path.name}"\r\n'
        f"Content-Type: audio/mp4\r\n\r\n".encode()
    )
    parts.append(file_path.read_bytes())
    parts.append(f"\r\n--{boundary}--\r\n".encode())
    return b"".join(parts), f"multipart/form-data; boundary={boundary}"


def transcribe(audio, key, language, model):
    fields = {"model_id": model, "timestamps_granularity": "word", "tag_audio_events": "false"}
    if language:
        fields["language_code"] = language
    body, ctype = multipart(fields, "file", audio)
    req = urllib.request.Request(API_URL, data=body, method="POST", headers={"xi-api-key": key, "Content-Type": ctype})
    try:
        with urllib.request.urlopen(req, timeout=600) as resp:
            return json.loads(resp.read().decode("utf-8"))
    except urllib.error.HTTPError as e:
        detail = e.read().decode("utf-8", errors="ignore")[:400]
        sys.exit(f"ElevenLabs respondeu {e.code}: {detail}")


def segments(words, gap=0.6):
    """Agrupa palavras em frases: quebra em pontuação final ou silêncio maior que `gap` segundos."""
    out, cur, start, last_end = [], [], None, None
    for w in words:
        if w.get("type") != "word":
            continue
        if cur and last_end is not None and w["start"] - last_end > gap:
            out.append((start, " ".join(cur)))
            cur, start = [], None
        if start is None:
            start = w["start"]
        cur.append(w["text"])
        last_end = w["end"]
        if w["text"].endswith((".", "?", "!")):
            out.append((start, " ".join(cur)))
            cur, start = [], None
    if cur:
        out.append((start, " ".join(cur)))
    return out


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("video", type=Path)
    ap.add_argument("--saida", type=Path, default=Path("trabalho"))
    ap.add_argument("--idioma", default="por", help="código do idioma (por = português)")
    ap.add_argument("--modelo", default="scribe_v1", help="modelo de transcrição da ElevenLabs")
    ap.add_argument("--env", type=Path, default=Path(".env"))
    args = ap.parse_args()

    if not args.video.exists():
        sys.exit(f"Vídeo não encontrado: {args.video}")
    args.saida.mkdir(parents=True, exist_ok=True)
    stem = args.video.stem
    audio = args.saida / f"{stem}.audio.m4a"

    key = load_key(args.env)
    extract_audio(args.video, audio)
    data = transcribe(audio, key, args.idioma, args.modelo)

    (args.saida / f"{stem}.transcricao.json").write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")
    segs = segments(data.get("words", []))
    lines = [f"S{i:03d}  {start:7.2f}s  {text}" for i, (start, text) in enumerate(segs)]
    (args.saida / f"{stem}.segmentos.txt").write_text("\n".join(lines) + "\n", encoding="utf-8")

    n_words = sum(1 for w in data.get("words", []) if w.get("type") == "word")
    print(f"✓ {n_words} palavras · {len(segs)} frases → {args.saida}/{stem}.segmentos.txt")


if __name__ == "__main__":
    main()
