#!/usr/bin/env python3
"""Hook SessionStart: resumo do estado da base, que entra no contexto no início de cada sessão."""
import re
import sys
from collections import Counter
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
try:
    import base
except Exception as e:  # nunca quebrar a sessão por causa do hook
    print(f"[auditoria] hook de início falhou ao carregar: {e}")
    sys.exit(0)


def contar(prefixo):
    return base.ler_entidades(base.DEFINICOES[prefixo], prefixo)


try:
    fontes = base.fontes()
    st = Counter(f.get("status") for f in fontes.values())
    regras = contar("R")
    rst = Counter(r["campos"].get("status", "?").split()[0] if r["campos"].get("status") else "?" for r in regras.values())
    perg = contar("P")
    pcurso = sum(1 for p in perg.values() if p["campos"].get("origem") == "curso")
    contr = [x for x, v in contar("X").items() if v["campos"].get("status", "aberta").startswith("aberta")]
    dec = contar("D")
    pend = re.findall(r"^- \[ \] (.+)$", base.DECISOES.read_text(encoding="utf-8"), re.M) if base.DECISOES.exists() else []
    nao_reg = base.inbox_nao_registrado()
    nbench = sum(1 for a in base.BENCH_CASOS.glob("*.jsonl") for _ in a.open())
    nds = sum(1 for a in base.DS_GERADO.glob("*.jsonl") for _ in a.open())

    print("[auditoria] Estado da base da IA Auditora")
    print(f"- fontes: {len(fontes)} ({', '.join(f'{k}={v}' for k, v in st.items()) or 'nenhuma'})")
    print(f"- regras: {len(regras)} ({', '.join(f'{k}={v}' for k, v in rst.items()) or 'nenhuma'}) | conceitos: {len(contar('C'))} | erros: {len(contar('E'))}")
    print(f"- perguntas: {len(perg)} ({pcurso} do curso) | decisões: {len(dec)} | contradições abertas: {len(contr)}")
    print(f"- benchmark: {nbench} caso(s) | dataset: {nds} exemplo(s)")
    if nao_reg:
        print(f"- ATENÇÃO: {len(nao_reg)} arquivo(s) em 00_inbox sem registro, rodar a skill absorver-material")
    if st.get("recebido"):
        print(f"- ATENÇÃO: {st['recebido']} fonte(s) registrada(s) ainda não extraída(s)")
    if contr:
        print(f"- ATENÇÃO: contradições abertas: {', '.join(contr)}; perguntar ao usuário")
    if pend:
        print(f"- perguntas pendentes ao usuário (decisoes.md): {len(pend)}")
    print("- Antes de agir: reler auditoria/decisoes.md; antes de concluir: ciclo de perguntas (skill perguntas-do-auditor).")
except Exception as e:
    print(f"[auditoria] hook de início falhou: {e}")
