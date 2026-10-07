#!/usr/bin/env python3
"""Pontua as saídas de um modelo auditor contra os gabaritos do benchmark.

Predições: JSONL com uma linha por caso, {"id": "BM-0001", "saida": "<texto bruto do modelo>"}
           ou {"id": "BM-0001", "laudo": {...}}.  O laudo é extraído do primeiro objeto JSON da saída.

Uso:
  python3 auditoria/ferramentas/pontuar.py predicoes.jsonl [--nome modelo-x-2026-10-07] [--casos arquivo.jsonl ...]

Com --nome, o relatório é salvo em benchmark/execucoes/<nome>.json.
Score oficial = apenas casos com revisado=true.
"""
from __future__ import annotations

import argparse
import datetime as dt
import json
import subprocess
import sys
from collections import defaultdict
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import base  # noqa: E402

# Pesos da nota composta por caso. Ajustar quando o curso/usuário definir o que pesa mais (registrar em decisoes.md).
PESOS = {"resultado": 0.40, "achados": 0.30, "perguntas": 0.10, "formato": 0.10, "sem_armadilha": 0.10}
VIOLACAO = {"nao_conforme", "parcial"}


def extrair_laudo(pred: dict):
    if "laudo" in pred:
        return pred["laudo"]
    s = pred.get("saida", "")
    ini = s.find("{")
    while ini != -1:
        prof = 0
        for i in range(ini, len(s)):
            prof += {"{": 1, "}": -1}.get(s[i], 0)
            if prof == 0:
                try:
                    return json.loads(s[ini:i + 1])
                except json.JSONDecodeError:
                    break
        ini = s.find("{", ini + 1)
    return None


def pontuar_caso(caso: dict, laudo, v_laudo) -> dict:
    g = caso["gabarito"]
    r = {"id": caso["id"], "categoria": caso["categoria"], "dificuldade": caso["dificuldade"], "revisado": caso["revisado"]}
    if not isinstance(laudo, dict):
        r.update(formato=0.0, resultado=0.0, achados=0.0, perguntas=0.0, sem_armadilha=1.0, tp=0, fp=0,
                 fn=len([a for a in g["achados_esperados"] if a["conformidade"] in VIOLACAO]), obs="sem laudo extraível")
    else:
        r["formato"] = 0.0 if any(True for _ in v_laudo.iter_errors(laudo)) else 1.0
        res = (laudo.get("veredito") or {}).get("resultado")
        r["resultado_previsto"] = res
        r["resultado"] = 1.0 if res == g["resultado"] else (0.5 if res in g.get("resultados_aceitaveis", []) else 0.0)
        prev = {a.get("regra"): a.get("conformidade") for a in laudo.get("achados", []) if isinstance(a, dict)}
        esperado_v = {a["regra"] for a in g["achados_esperados"] if a["conformidade"] in VIOLACAO and a.get("obrigatorio", True)}
        previsto_v = {k for k, v in prev.items() if v in VIOLACAO}
        tp, fp, fn = len(esperado_v & previsto_v), len(previsto_v - esperado_v), len(esperado_v - previsto_v)
        r.update(tp=tp, fp=fp, fn=fn)
        if not esperado_v and not previsto_v:
            r["achados"] = 1.0
        else:
            p = tp / (tp + fp) if tp + fp else 0.0
            c = tp / (tp + fn) if tp + fn else 0.0
            r["achados"] = 2 * p * c / (p + c) if p + c else 0.0
        r["armadilhas_caidas"] = sorted(set(g.get("achados_proibidos", [])) & previsto_v)
        r["sem_armadilha"] = 0.0 if r["armadilhas_caidas"] else 1.0
        crit = set(g.get("perguntas_criticas", []))
        resp = {q.get("id") for q in laudo.get("perguntas", []) if isinstance(q, dict) and q.get("status") == "respondida"}
        r["perguntas"] = len(crit & resp) / len(crit) if crit else 1.0
    r["nota"] = round(sum(PESOS[k] * r[k] for k in PESOS), 4)
    return r


def agregar(linhas: list[dict]) -> dict:
    if not linhas:
        return {"n": 0}
    n = len(linhas)
    tp, fp, fn = (sum(l[k] for l in linhas) for k in ("tp", "fp", "fn"))
    prec = tp / (tp + fp) if tp + fp else None
    rec = tp / (tp + fn) if tp + fn else None
    return {"n": n,
            "nota_media": round(sum(l["nota"] for l in linhas) / n, 4),
            "acerto_resultado": round(sum(l["resultado"] == 1.0 for l in linhas) / n, 4),
            "violacoes_precisao": None if prec is None else round(prec, 4),
            "violacoes_recall": None if rec is None else round(rec, 4),
            "taxa_armadilha": round(sum(l["sem_armadilha"] == 0.0 for l in linhas) / n, 4),
            "formato_valido": round(sum(l["formato"] for l in linhas) / n, 4),
            "cobertura_perguntas_criticas": round(sum(l["perguntas"] for l in linhas) / n, 4)}


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("predicoes")
    ap.add_argument("--casos", nargs="*")
    ap.add_argument("--nome")
    a = ap.parse_args()

    arqs = [Path(c) for c in a.casos] if a.casos else sorted(base.BENCH_CASOS.glob("*.jsonl"))
    casos = {o["id"]: o for arq in arqs for _, o, _ in base.ler_jsonl(arq) if o}
    preds = {o["id"]: o for _, o, _ in base.ler_jsonl(Path(a.predicoes)) if o and "id" in o}
    v_laudo = base.validador("laudo.schema.json")

    linhas = [pontuar_caso(c, extrair_laudo(preds[cid]) if cid in preds else None, v_laudo) for cid, c in casos.items()]
    sem_pred = sorted(set(casos) - set(preds))
    grupos = {"geral": agregar(linhas), "oficial_revisados": agregar([l for l in linhas if l["revisado"]])}
    for chave in ("categoria", "dificuldade"):
        por = defaultdict(list)
        for l in linhas:
            por[l[chave]].append(l)
        grupos[f"por_{chave}"] = {k: agregar(v) for k, v in sorted(por.items())}

    try:
        versao = subprocess.run(["git", "rev-parse", "--short", "HEAD"], capture_output=True, text=True, cwd=base.RAIZ).stdout.strip()
    except Exception:
        versao = "?"
    rel = {"nome": a.nome, "data": dt.date.today().isoformat(), "versao_base": versao, "pesos": PESOS,
           "sem_predicao": sem_pred, "resumo": grupos,
           "piores": sorted(linhas, key=lambda l: l["nota"])[:10], "casos": linhas}

    print(json.dumps({"resumo": grupos, "sem_predicao": sem_pred}, ensure_ascii=False, indent=2))
    if a.nome:
        destino = base.BENCH_EXEC / f"{a.nome}.json"
        destino.write_text(json.dumps(rel, ensure_ascii=False, indent=2), encoding="utf-8")
        print(f"\nsalvo em {destino.relative_to(base.RAIZ.parent)}")


if __name__ == "__main__":
    main()
