#!/usr/bin/env python3
"""Cobertura da base: para cada regra, quantas perguntas, erros, casos de benchmark e exemplos existem.

Mostra onde gerar mais casos/exemplos e quais regras ainda não são testadas.
Uso: python3 auditoria/ferramentas/cobertura.py [--json]
"""
from __future__ import annotations

import argparse
import json
import sys
from collections import Counter, defaultdict
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import base  # noqa: E402


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--json", action="store_true")
    a = ap.parse_args()

    regras = {k: v for k, v in base.ler_entidades(base.DEFINICOES["R"], "R").items()
              if v["campos"].get("status") != "revogada"}
    perguntas = base.ler_entidades(base.PERGUNTAS, "P")
    erros_c = base.ler_entidades(base.DEFINICOES["E"], "E")

    cob = {r: {"titulo": v["titulo"], "status": v["campos"].get("status", "?"),
               "severidade": v["campos"].get("severidade", "?"),
               "perguntas": set(), "erros": set(), "bench": 0, "bench_armadilha": 0,
               "ds": Counter()} for r, v in regras.items()}

    for pid, p in perguntas.items():
        for ref in base.referencias(p["corpo"]):
            if ref in cob:
                cob[ref]["perguntas"].add(pid)
    for r, v in regras.items():
        for ref in base.referencias(v["corpo"]):
            if ref.startswith("P-"):
                cob[r]["perguntas"].add(ref)
    for eid, e in erros_c.items():
        for ref in base.referencias(e["corpo"]):
            if ref in cob:
                cob[ref]["erros"].add(eid)

    dist_bench = defaultdict(Counter)
    for arq in base.BENCH_CASOS.glob("*.jsonl"):
        for _, o, err in base.ler_jsonl(arq):
            if not o:
                continue
            g = o.get("gabarito", {})
            dist_bench["resultado"][g.get("resultado")] += 1
            dist_bench["categoria"][o.get("categoria")] += 1
            dist_bench["dificuldade"][o.get("dificuldade")] += 1
            dist_bench["revisado"][o.get("revisado")] += 1
            for ach in g.get("achados_esperados", []):
                if ach.get("regra") in cob:
                    cob[ach["regra"]]["bench"] += 1
            for r in g.get("achados_proibidos", []):
                if r in cob:
                    cob[r]["bench_armadilha"] += 1

    dist_ds = defaultdict(Counter)
    for arq in base.DS_GERADO.glob("*.jsonl"):
        for _, o, err in base.ler_jsonl(arq):
            if not o or "meta" not in o:
                continue
            m = o["meta"]
            for chave in ("tipo", "resultado", "split", "dificuldade", "revisado"):
                dist_ds[chave][m.get(chave)] += 1
            for r in m.get("regras", []):
                if r in cob:
                    cob[r]["ds"][m.get("tipo")] += 1

    if a.json:
        print(json.dumps({"regras": {r: {**c, "perguntas": sorted(c["perguntas"]), "erros": sorted(c["erros"]),
                                          "ds": dict(c["ds"])} for r, c in cob.items()},
                          "benchmark": {k: dict(v) for k, v in dist_bench.items()},
                          "dataset": {k: dict(v) for k, v in dist_ds.items()}}, ensure_ascii=False, indent=2, default=str))
        return

    print(f"# Cobertura: {len(cob)} regra(s) ativa(s), {len(perguntas)} pergunta(s), {len(erros_c)} erro(s) comum(ns)\n")
    if not cob:
        print("Nenhuma regra ainda. Absorva material com a skill absorver-material.")
    else:
        print("| regra | sev | status | perguntas | erros | bench | armadilhas | ds+ | ds- | ds limite/adv | lacunas |")
        print("|---|---|---|---|---|---|---|---|---|---|---|")
        for r, c in sorted(cob.items()):
            ds = c["ds"]
            pos, neg = ds["positivo"], ds["negativo"] + ds["multiplas_violacoes"]
            lim = ds["caso_limite"] + ds["adversarial"]
            lac = []
            if not c["perguntas"]: lac.append("sem pergunta")
            if not c["bench"]: lac.append("sem caso")
            if not c["bench_armadilha"]: lac.append("sem armadilha")
            if not pos: lac.append("sem ds+")
            if not neg: lac.append("sem ds-")
            if not lim: lac.append("sem limite")
            print(f"| {r} {c['titulo'][:40]} | {c['severidade']} | {c['status']} | {len(c['perguntas'])} | {len(c['erros'])} "
                  f"| {c['bench']} | {c['bench_armadilha']} | {pos} | {neg} | {lim} | {', '.join(lac) or 'ok'} |")
    for nome, dist in (("Benchmark", dist_bench), ("Dataset", dist_ds)):
        print(f"\n## {nome}")
        if not dist:
            print("(vazio)")
        for chave, cont in dist.items():
            total = sum(cont.values())
            print(f"- {chave}: " + ", ".join(f"{k}={v} ({v/total:.0%})" for k, v in cont.most_common()))


if __name__ == "__main__":
    main()
