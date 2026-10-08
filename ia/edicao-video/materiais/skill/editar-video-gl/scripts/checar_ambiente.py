#!/usr/bin/env python3
"""Confere se o computador está pronto para editar vídeo com a skill editar-video-gl.

Uso:
    python3 checar_ambiente.py --pasta "/caminho/do/estudio"

Não instala nada: só mostra o que está pronto e o que falta, com a dica de cada item.
Nunca imprime o valor da chave da ElevenLabs.
"""

import argparse
import re
import shutil
import subprocess
import sys
from pathlib import Path


def run(cmd, timeout=20):
    try:
        out = subprocess.run(cmd, capture_output=True, text=True, timeout=timeout)
        return out.returncode, (out.stdout or out.stderr).strip()
    except (OSError, subprocess.TimeoutExpired):
        return 1, ""


def version_of(cmd):
    code, out = run(cmd)
    if code != 0:
        return None
    m = re.search(r"(\d+)\.(\d+)", out)
    return (int(m.group(1)), int(m.group(2))) if m else (0, 0)


def check_python():
    ok = sys.version_info >= (3, 10)
    return ok, f"Python {sys.version.split()[0]}", "Instale o Python 3.10 ou mais novo (python.org)."


def check_ffmpeg():
    ok = bool(shutil.which("ffmpeg") and shutil.which("ffprobe"))
    return ok, "FFmpeg e FFprobe", "Mac: brew install ffmpeg · Windows: winget install Gyan.FFmpeg"


def check_node():
    v = version_of(["node", "--version"]) if shutil.which("node") else None
    ok = bool(v and v[0] >= 22)
    detail = f"Node {v[0]}.{v[1]}" if v else "Node"
    return ok, detail + " (22+)", "Instale o Node 22 LTS pelo instalador oficial (nodejs.org)."


def check_npx_tool(name, hint):
    if not shutil.which("npx"):
        return False, name, "Instale o Node primeiro."
    code, _ = run(["npx", "--no-install", name, "--version"], timeout=60)
    return code == 0, name, hint


def check_env(pasta):
    env = pasta / ".env"
    if not env.exists():
        return False, ".env com ELEVENLABS_API_KEY", f"Crie {env} com a linha ELEVENLABS_API_KEY= (prompt 3 da aula 2)."
    for line in env.read_text(encoding="utf-8", errors="ignore").splitlines():
        if line.strip().startswith("ELEVENLABS_API_KEY="):
            value = line.split("=", 1)[1].strip().strip('"').strip("'")
            if len(value) > 10:
                return True, f".env com ELEVENLABS_API_KEY (…{value[-4:]})", ""
    return False, ".env com ELEVENLABS_API_KEY", "A linha existe, mas a chave está vazia. Cole a chave depois do = e salve."


def check_marca(pasta):
    ok = (pasta / "MARCA.md").exists()
    return ok, "MARCA.md (kit de marca)", "Recomendado: rode o prompt 4 da aula 2 para criar o MARCA.md."


def check_disk(pasta):
    free_gb = shutil.disk_usage(pasta).free / 1024**3
    return free_gb >= 20, f"Espaço livre: {free_gb:.0f} GB (20+)", "Libere espaço: cada edição 4K gera arquivos grandes."


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--pasta", default=".", help="pasta do estúdio de vídeos")
    args = ap.parse_args()
    pasta = Path(args.pasta).expanduser().resolve()
    if not pasta.is_dir():
        print(f"Pasta não encontrada: {pasta}")
        return 2

    checks = [
        check_python(),
        check_ffmpeg(),
        check_node(),
        check_npx_tool("hyperframes", "Rode: npx -y hyperframes@latest skills e depois npx hyperframes doctor"),
        check_npx_tool("playwright", "Rode: npx -y playwright install chromium"),
        check_env(pasta),
        check_marca(pasta),
        check_disk(pasta),
    ]

    print(f"\nEstúdio: {pasta}\n")
    missing = 0
    for ok, label, hint in checks:
        print(f"  {'✓' if ok else '✗'}  {label}")
        if not ok:
            missing += 1
            print(f"       → {hint}")
    print("\nTudo certo pra editar." if not missing else f"\nFaltam {missing} item(ns).")
    return 0 if not missing else 1


if __name__ == "__main__":
    sys.exit(main())
