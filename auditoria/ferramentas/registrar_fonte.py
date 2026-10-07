#!/usr/bin/env python3
"""Registra material bruto de 00_inbox no manifesto fontes.jsonl com o próximo FONTE-xxxx.

Uso:
  python3 auditoria/ferramentas/registrar_fonte.py ARQUIVO [ARQUIVO...] --tipo pdf --titulo "Aula 1" [--modulo M1] [--ordem 1]
  python3 auditoria/ferramentas/registrar_fonte.py --chat --titulo "Instrução: critérios de reprovação"   (instrução enviada por mensagem)

ARQUIVO pode ser um caminho absoluto ou relativo a 00_inbox. Com vários arquivos, o título recebe o nome do arquivo.
Arquivos já registrados (mesmo sha256) são ignorados.
"""
from __future__ import annotations

import argparse
import datetime as dt
import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import base  # noqa: E402

TIPOS = {".pdf": "pdf", ".pptx": "slides", ".ppt": "slides", ".key": "slides", ".docx": "documento", ".doc": "documento",
         ".md": "documento", ".txt": "aula_transcricao", ".srt": "aula_transcricao", ".vtt": "aula_transcricao",
         ".xlsx": "planilha", ".csv": "planilha", ".png": "imagem", ".jpg": "imagem", ".jpeg": "imagem", ".webp": "imagem",
         ".mp4": "aula_video", ".mov": "aula_video", ".mkv": "aula_video", ".mp3": "aula_video", ".m4a": "aula_video"}


def proximo(existentes) -> int:
    nums = [int(i.split("-")[1]) for i in existentes]
    return max(nums, default=0) + 1


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("arquivos", nargs="*")
    ap.add_argument("--tipo")
    ap.add_argument("--titulo")
    ap.add_argument("--modulo")
    ap.add_argument("--ordem", type=int)
    ap.add_argument("--chat", action="store_true", help="instrução recebida por mensagem (sem arquivo)")
    ap.add_argument("--obs")
    a = ap.parse_args()

    atuais = base.fontes()
    shas = {f["sha256"]: fid for fid, f in atuais.items()}
    n = proximo(atuais)
    hoje = dt.date.today().isoformat()
    novas = []

    if a.chat:
        if not a.titulo:
            sys.exit("--chat exige --titulo")
        novas.append({"id": f"FONTE-{n:04d}", "titulo": a.titulo, "tipo": "instrucao_usuario", "arquivo": "chat",
                      "sha256": "chat", "recebido_em": hoje, "status": "recebido"})
    for arq in a.arquivos:
        p = Path(arq)
        if not p.is_absolute():
            p = (base.INBOX / arq) if (base.INBOX / arq).exists() else p.resolve()
        p = p.resolve()
        try:
            relativo = str(p.relative_to(base.INBOX.resolve()))
        except ValueError:
            sys.exit(f"{p} não está em {base.INBOX}. Copie o material para 00_inbox antes de registrar.")
        sha = base.sha256_arquivo(p)
        if sha in shas:
            print(f"já registrado: {relativo} = {shas[sha]}")
            continue
        tipo = a.tipo or TIPOS.get(p.suffix.lower(), "outro")
        titulo = a.titulo if (a.titulo and len(a.arquivos) == 1) else (f"{a.titulo}: {p.stem}" if a.titulo else p.stem)
        f = {"id": f"FONTE-{n:04d}", "titulo": titulo, "tipo": tipo, "arquivo": relativo, "sha256": sha,
             "recebido_em": hoje, "status": "recebido"}
        if a.modulo: f["modulo"] = a.modulo
        if a.ordem is not None: f["ordem"] = a.ordem
        if a.obs: f["observacoes"] = a.obs
        novas.append(f)
        shas[sha] = f["id"]
        n += 1
    with base.FONTES.open("a", encoding="utf-8") as out:
        for f in novas:
            out.write(json.dumps(f, ensure_ascii=False) + "\n")
            print(f"registrado {f['id']}  [{f['tipo']}]  {f['arquivo']}  {f['titulo']}")


if __name__ == "__main__":
    main()
