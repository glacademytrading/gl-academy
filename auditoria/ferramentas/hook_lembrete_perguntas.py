#!/usr/bin/env python3
"""Hook UserPromptSubmit: injeta o NÚCLEO do banco de perguntas a cada mensagem do usuário."""
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
try:
    import base
    nucleo = base.bloco_nucleo()
    if nucleo:
        print("[auditoria] " + nucleo)
    pend = base.inbox_nao_registrado()
    if pend:
        print(f"[auditoria] {len(pend)} arquivo(s) novo(s) em 00_inbox sem registro: absorver antes de usar.")
except Exception:
    pass  # o lembrete nunca pode bloquear a mensagem do usuário
