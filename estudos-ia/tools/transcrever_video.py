#!/usr/bin/env python3
"""Transcreve vídeos locais com Whisper (faster-whisper), gerando .srt e .txt com timestamps.

Uso:
    python3 transcrever_video.py <arquivo-ou-pasta> [--saida PASTA] [--modelo large-v3-turbo] [--idioma pt]

Requer: ffmpeg no PATH e `pip install faster-whisper`.
"""
import argparse
import subprocess
import sys
import tempfile
import wave
from pathlib import Path

import numpy as np
from faster_whisper import WhisperModel

EXTENSOES = {".mp4", ".mkv", ".mov", ".avi", ".webm", ".m4v", ".mp3", ".wav", ".m4a", ".flac"}


def formata_srt(segundos: float) -> str:
    h, resto = divmod(int(segundos), 3600)
    m, s = divmod(resto, 60)
    ms = int(round((segundos - int(segundos)) * 1000))
    return f"{h:02}:{m:02}:{s:02},{ms:03}"


def formata_minuto(segundos: float) -> str:
    h, resto = divmod(int(segundos), 3600)
    m, s = divmod(resto, 60)
    return f"[{h:02}:{m:02}:{s:02}]" if h else f"[{m:02}:{s:02}]"


def extrai_audio(video: Path, destino: Path) -> None:
    # 16 kHz mono em WAV: formato que o Whisper usa internamente
    subprocess.run(
        ["ffmpeg", "-y", "-loglevel", "error", "-i", str(video),
         "-vn", "-ac", "1", "-ar", "16000", str(destino)],
        check=True,
    )


def le_wav_como_array(caminho: Path) -> np.ndarray:
    # Lê o WAV direto em float32 (16 kHz mono) e evita a biblioteca `av`
    with wave.open(str(caminho), "rb") as w:
        bruto = w.readframes(w.getnframes())
    return np.frombuffer(bruto, dtype=np.int16).astype(np.float32) / 32768.0


def transcreve(arquivo: Path, modelo: WhisperModel, saida: Path, idioma: str) -> None:
    with tempfile.TemporaryDirectory() as tmp:
        audio = Path(tmp) / "audio.wav"
        print(f"  extraindo áudio de {arquivo.name}...")
        extrai_audio(arquivo, audio)

        print("  transcrevendo (pode levar um tempo)...")
        segmentos, info = modelo.transcribe(
            le_wav_como_array(audio), language=idioma, vad_filter=True, beam_size=5
        )
        segmentos = list(segmentos)

    base = saida / arquivo.stem
    with open(f"{base}.srt", "w", encoding="utf-8") as srt, \
         open(f"{base}.txt", "w", encoding="utf-8") as txt:
        for i, seg in enumerate(segmentos, start=1):
            texto = seg.text.strip()
            srt.write(f"{i}\n{formata_srt(seg.start)} --> {formata_srt(seg.end)}\n{texto}\n\n")
            txt.write(f"{formata_minuto(seg.start)} {texto}\n")

    print(f"  pronto: {base}.txt e {base}.srt (idioma detectado: {info.language})")


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("entrada", help="arquivo de vídeo/áudio ou pasta")
    ap.add_argument("--saida", default="transcricoes", help="pasta de saída (padrão: ./transcricoes)")
    ap.add_argument("--modelo", default="large-v3-turbo",
                    help="tiny, base, small, medium, large-v3, large-v3-turbo (padrão: large-v3-turbo)")
    ap.add_argument("--idioma", default="pt", help="código do idioma (padrão: pt)")
    args = ap.parse_args()

    entrada = Path(args.entrada)
    if entrada.is_dir():
        arquivos = sorted(p for p in entrada.iterdir() if p.suffix.lower() in EXTENSOES)
    elif entrada.is_file():
        arquivos = [entrada]
    else:
        print(f"Não encontrado: {entrada}", file=sys.stderr)
        return 1

    if not arquivos:
        print("Nenhum vídeo ou áudio suportado encontrado.", file=sys.stderr)
        return 1

    saida = Path(args.saida)
    saida.mkdir(parents=True, exist_ok=True)

    # GPU NVIDIA se disponível; senão CPU com quantização int8 (mais lento, mas funciona)
    try:
        modelo = WhisperModel(args.modelo, device="cuda", compute_type="float16")
        print("Usando GPU (CUDA).")
    except Exception:
        modelo = WhisperModel(args.modelo, device="cpu", compute_type="int8")
        print("Usando CPU (mais lento).")

    for arq in arquivos:
        print(f"\n{arq.name}")
        transcreve(arq, modelo, saida, args.idioma)
    return 0


if __name__ == "__main__":
    sys.exit(main())
