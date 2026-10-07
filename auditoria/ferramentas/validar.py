#!/usr/bin/env python3
"""Valida a base inteira: schemas, integridade referencial, rastreabilidade e vazamento.

Uso:
    python3 auditoria/ferramentas/validar.py            # erros fazem sair com código 1
    python3 auditoria/ferramentas/validar.py --estrito  # avisos também viram erro
"""
from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import base  # noqa: E402

erros: list[str] = []
avisos: list[str] = []


def rel(p: Path) -> str:
    return str(p.relative_to(base.RAIZ.parent))


def checar_refs(origem: str, texto: str, ids: dict[str, set[str]]):
    for ref in sorted(base.referencias(texto)):
        prefixo = ref.split("-")[0]
        if prefixo == "BM":
            continue
        if ref not in ids.get(prefixo, set()):
            erros.append(f"{origem}: referência inexistente {ref}")


def validar_fontes(ids):
    if not base.FONTES.exists():
        erros.append("conhecimento/fontes.jsonl não existe")
        return
    v = base.validador("fonte.schema.json")
    vistos, shas = set(), {}
    for n, o, err in base.ler_jsonl(base.FONTES):
        local = f"fontes.jsonl:{n}"
        if err:
            erros.append(f"{local}: JSON inválido ({err})")
            continue
        for e in v.iter_errors(o):
            erros.append(f"{local}: {e.message}")
        fid = o.get("id")
        if fid in vistos:
            erros.append(f"{local}: id duplicado {fid}")
        vistos.add(fid)
        arq = o.get("arquivo")
        if arq and arq != "chat":
            caminho = base.INBOX / arq
            if not caminho.exists():
                if o.get("tipo") == "aula_video":  # vídeo/áudio não é versionado (ver .gitignore)
                    if o.get("status") == "recebido":
                        avisos.append(f"{local}: vídeo ausente neste clone e ainda sem transcrição ({arq})")
                else:
                    erros.append(f"{local}: arquivo não encontrado em 00_inbox: {arq}")
            elif o.get("sha256") and base.sha256_arquivo(caminho) != o["sha256"]:
                erros.append(f"{local}: sha256 não confere; o material bruto foi alterado ({arq})")
        if o.get("sha256") in shas:
            avisos.append(f"{local}: mesmo conteúdo de {shas[o['sha256']]} (material duplicado?)")
        shas[o.get("sha256")] = fid
        if o.get("status") in ("extraido", "consolidado"):
            ext = o.get("extracao")
            if not ext or not (base.RAIZ.parent / ext).exists():
                erros.append(f"{local}: status {o['status']} mas a extração não foi encontrada ({ext})")
    for p in base.inbox_nao_registrado():
        avisos.append(f"material não registrado no manifesto: {rel(p)} (use registrar_fonte.py)")


def validar_canonico(ids):
    for prefixo, arq in base.DEFINICOES.items():
        ents = base.ler_entidades(arq, prefixo)
        for eid, e in ents.items():
            local = f"{rel(arq)}:{e['linha']} {eid}"
            if e["duplicado"]:
                erros.append(f"{local}: id definido mais de uma vez")
            checar_refs(local, e["titulo"] + "\n" + e["corpo"], ids)
            campos = e["campos"]
            status = campos.get("status", "")
            if prefixo in ("R", "C", "E", "PR") and "explicito" in status and "FONTE-" not in campos.get("fontes", ""):
                erros.append(f"{local}: marcado como explícito, mas sem FONTE em 'fontes'")
            if prefixo == "R" and status.startswith("explicito") and not campos.get("citacao"):
                avisos.append(f"{local}: regra explícita sem 'citacao' literal")
            if prefixo == "R" and status != "revogada" and not campos.get("como_verificar"):
                avisos.append(f"{local}: regra sem 'como_verificar' (não é auditável)")
            if prefixo == "R" and "inferido" in status:
                avisos.append(f"{local}: regra inferida aguardando confirmação do usuário")
            if prefixo == "P" and campos.get("origem") == "curso" and "FONTE-" not in campos.get("fontes", ""):
                erros.append(f"{local}: pergunta de origem 'curso' sem FONTE")
            if prefixo == "X" and campos.get("status", "aberta").startswith("aberta"):
                avisos.append(f"{local}: contradição aberta, perguntar ao usuário")
    nucleo = base.bloco_nucleo()
    if not nucleo:
        erros.append("perguntas.md: bloco NÚCLEO ausente (marcadores NUCLEO:INICIO/FIM)")
    elif len(nucleo.splitlines()) > 14:
        avisos.append(f"perguntas.md: NÚCLEO com {len(nucleo.splitlines())} linhas; mantenha até ~12, pois é injetado a cada mensagem")


def validar_benchmark(ids) -> dict[str, tuple[str, set]]:
    v = base.validador("caso_benchmark.schema.json")
    entradas = {}
    vistos = set()
    for arq in sorted(base.BENCH_CASOS.glob("*.jsonl")):
        for n, o, err in base.ler_jsonl(arq):
            local = f"{rel(arq)}:{n}"
            if err:
                erros.append(f"{local}: JSON inválido ({err})")
                continue
            for e in v.iter_errors(o):
                erros.append(f"{local}: {e.message}")
            cid = o.get("id")
            if cid in vistos:
                erros.append(f"{local}: id duplicado {cid}")
            vistos.add(cid)
            g = o.get("gabarito", {})
            texto_ids = json.dumps({"g": g, "f": o.get("fontes", [])})
            checar_refs(f"{local} {cid}", texto_ids, ids)
            esperadas = {a.get("regra") for a in g.get("achados_esperados", [])}
            if esperadas & set(g.get("achados_proibidos", [])):
                erros.append(f"{local} {cid}: mesma regra em achados_esperados e achados_proibidos")
            if g.get("resultado") == "aprovado" and any(a.get("conformidade") == "nao_conforme" for a in g.get("achados_esperados", [])):
                avisos.append(f"{local} {cid}: gabarito 'aprovado' com não conformidade esperada; confira a rubrica")
            entradas[cid] = (base.normalizar(o.get("entrada", "")), base.shingles(o.get("entrada", "")))
    return entradas


def validar_dataset(ids, bench: dict):
    v_ex = base.validador("exemplo_dataset.schema.json")
    v_laudo = base.validador("laudo.schema.json")
    por_entrada = {}
    split_do_grupo: dict[str, tuple[str, str]] = {}
    bench_norm = {norm: cid for cid, (norm, _) in bench.items()}
    prompt_oficial = base.prompt_sistema()
    for arq in sorted(base.DS_GERADO.glob("*.jsonl")):
        for n, o, err in base.ler_jsonl(arq):
            local = f"{rel(arq)}:{n}"
            if err:
                erros.append(f"{local}: JSON inválido ({err})")
                continue
            errs = list(v_ex.iter_errors(o))
            for e in errs:
                erros.append(f"{local}: {e.message}")
            if errs:
                continue
            msgs, meta = o["messages"], o["meta"]
            sistema = next((m["content"] for m in msgs if m["role"] == "system"), None)
            if sistema is not None and sistema.strip() != prompt_oficial:
                avisos.append(f"{local}: prompt de sistema diferente do oficial (dataset/prompt_sistema.md)")
            if msgs[-1]["role"] != "assistant":
                erros.append(f"{local}: a última mensagem precisa ser do assistant (o laudo)")
                continue
            try:
                laudo = json.loads(msgs[-1]["content"])
            except json.JSONDecodeError:
                erros.append(f"{local}: o conteúdo do assistant não é um laudo JSON")
                continue
            for e in v_laudo.iter_errors(laudo):
                erros.append(f"{local}: laudo inválido: {e.message}")
            res = laudo.get("veredito", {}).get("resultado")
            if res != meta["resultado"]:
                erros.append(f"{local}: meta.resultado={meta['resultado']} difere do laudo ({res})")
            regras_laudo = {a.get("regra") for a in laudo.get("achados", [])}
            faltam = regras_laudo - set(meta["regras"])
            if faltam:
                avisos.append(f"{local}: regras no laudo e fora de meta.regras: {sorted(faltam)}")
            checar_refs(local, json.dumps({"m": meta, "l": laudo}), ids)
            esperado = base.id_exemplo(msgs)
            if o["id"] != esperado:
                avisos.append(f"{local}: id {o['id']} não corresponde ao conteúdo (esperado {esperado})")
            grupo = meta.get("grupo")
            if grupo:
                anterior = split_do_grupo.setdefault(grupo, (meta["split"], local))
                if anterior[0] != meta["split"]:
                    erros.append(f"{local}: grupo {grupo} em split {meta['split']}, mas {anterior[1]} está em {anterior[0]}")
            entrada = base.entrada_do_exemplo(msgs)
            norm = base.normalizar(entrada)
            if norm in por_entrada:
                erros.append(f"{local}: entrada duplicada de {por_entrada[norm]}")
            por_entrada[norm] = local
            if norm in bench_norm:
                erros.append(f"{local}: VAZAMENTO, a entrada é idêntica ao caso de benchmark {bench_norm[norm]}")
            elif bench:
                sh = base.shingles(entrada)
                for cid, (_, bsh) in bench.items():
                    j = base.jaccard(sh, bsh)
                    if j >= 0.7:
                        avisos.append(f"{local}: entrada muito parecida com {cid} (jaccard {j:.2f}), possível vazamento")


def validar_certificacoes(ids):
    v = base.validador("certificacao.schema.json")
    for arq in sorted(base.CERT_REG.glob("*.json")):
        try:
            o = json.loads(arq.read_text(encoding="utf-8"))
        except json.JSONDecodeError as e:
            erros.append(f"{rel(arq)}: JSON inválido ({e})")
            continue
        for e in v.iter_errors(o):
            erros.append(f"{rel(arq)}: {e.message}")
        checar_refs(rel(arq), json.dumps(o.get("laudo", {})), ids)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--estrito", action="store_true", help="avisos também falham")
    ap.add_argument("--quieto", action="store_true", help="só imprime se houver problema")
    a = ap.parse_args()

    ids = base.todos_ids()
    validar_fontes(ids)
    validar_canonico(ids)
    bench = validar_benchmark(ids)
    validar_dataset(ids, bench)
    validar_certificacoes(ids)

    for e in erros:
        print(f"ERRO   {e}")
    for w in avisos:
        print(f"AVISO  {w}")
    if not a.quieto or erros or avisos:
        print(f"\n{len(erros)} erro(s), {len(avisos)} aviso(s)")
    falhou = bool(erros) or (a.estrito and bool(avisos))
    sys.exit(1 if falhou else 0)


if __name__ == "__main__":
    main()
