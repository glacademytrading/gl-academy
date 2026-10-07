#!/usr/bin/env python3
"""Imprime o(s) próximo(s) ID(s) livre(s).  Uso: proximo_id.py R|P|C|E|X|D|PR|BM|FONTE [quantidade]

Considera apenas IDs definidos (cabeçalhos da base canônica, manifesto de fontes, casos de benchmark),
nunca menções dentro de modelos ou de texto.
"""
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import base  # noqa: E402

prefixo = sys.argv[1].upper()
qtd = int(sys.argv[2]) if len(sys.argv) > 2 else 1
if prefixo in base.DEFINICOES:
    usados = base.ler_entidades(base.DEFINICOES[prefixo], prefixo)
elif prefixo == "FONTE":
    usados = base.fontes()
elif prefixo == "BM":
    usados = {o["id"] for a in base.BENCH_CASOS.glob("*.jsonl") for _, o, _ in base.ler_jsonl(a) if o and "id" in o}
else:
    sys.exit(f"prefixo desconhecido: {prefixo}")
nums = [int(i.split("-")[1]) for i in usados]
inicio = 100 if prefixo == "P" else 1  # P-0001..P-0099 reservadas às sementes
atual = max([n for n in nums if n >= inicio], default=inicio - 1) + 1
print(" ".join(f"{prefixo}-{atual + i:04d}" for i in range(qtd)))
