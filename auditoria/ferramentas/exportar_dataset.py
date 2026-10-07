#!/usr/bin/env python3
"""Exporta o dataset interno (dataset/gerado/*.jsonl) para formatos de fine-tuning.

Uso:
  python3 auditoria/ferramentas/exportar_dataset.py [--formato chat|anthropic] [--incluir-nao-revisados]

Formatos:
  chat       {"messages": [{"role": "system"|"user"|"assistant", "content": ...}]}   (OpenAI / HF / maioria)
  anthropic  {"system": "...", "messages": [{"role": "user"|"assistant", ...}]}

Saída: dataset/exportado/<formato>/{treino,validacao,teste}.jsonl + manifesto.json
Recusa exportar se validar.py tiver erros.
"""
from __future__ import annotations

import argparse
import datetime as dt
import json
import subprocess
import sys
from collections import Counter
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import base  # noqa: E402


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--formato", choices=["chat", "anthropic"], default="chat")
    ap.add_argument("--incluir-nao-revisados", action="store_true")
    a = ap.parse_args()

    v = subprocess.run([sys.executable, str(Path(__file__).with_name("validar.py")), "--quieto"])
    if v.returncode != 0:
        sys.exit("validar.py encontrou erros; corrija antes de exportar.")

    destino = base.DS_EXPORT / a.formato
    destino.mkdir(parents=True, exist_ok=True)
    saidas = {s: (destino / f"{s}.jsonl").open("w", encoding="utf-8") for s in ("treino", "validacao", "teste")}
    cont, pulados = Counter(), 0
    for arq in sorted(base.DS_GERADO.glob("*.jsonl")):
        for _, o, _ in base.ler_jsonl(arq):
            if not o:
                continue
            if not o["meta"]["revisado"] and not a.incluir_nao_revisados:
                pulados += 1
                continue
            msgs = o["messages"]
            if a.formato == "chat":
                linha = {"messages": msgs}
            else:
                sistema = "\n".join(m["content"] for m in msgs if m["role"] == "system")
                linha = {"system": sistema, "messages": [m for m in msgs if m["role"] != "system"]}
            split = o["meta"]["split"]
            saidas[split].write(json.dumps(linha, ensure_ascii=False) + "\n")
            cont[split] += 1
    for f in saidas.values():
        f.close()
    versao = subprocess.run(["git", "rev-parse", "--short", "HEAD"], capture_output=True, text=True, cwd=base.RAIZ).stdout.strip()
    manifesto = {"data": dt.date.today().isoformat(), "formato": a.formato, "versao_base": versao,
                 "contagem": dict(cont), "nao_revisados_pulados": pulados,
                 "incluiu_nao_revisados": a.incluir_nao_revisados}
    (destino / "manifesto.json").write_text(json.dumps(manifesto, ensure_ascii=False, indent=2), encoding="utf-8")
    print(json.dumps(manifesto, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
