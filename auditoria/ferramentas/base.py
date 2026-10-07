"""Utilitários comuns: caminhos, leitura da base canônica em Markdown, JSONL e schemas."""
from __future__ import annotations

import hashlib
import json
import re
import unicodedata
from pathlib import Path

RAIZ = Path(__file__).resolve().parents[1]  # auditoria/
CONHECIMENTO = RAIZ / "conhecimento"
INBOX = CONHECIMENTO / "00_inbox"
EXTRAIDO = CONHECIMENTO / "01_extraido"
CANONICO = CONHECIMENTO / "02_canonico"
FONTES = CONHECIMENTO / "fontes.jsonl"
PERGUNTAS = RAIZ / "perguntas" / "perguntas.md"
DECISOES = RAIZ / "decisoes.md"
SCHEMAS = RAIZ / "schemas"
BENCH_CASOS = RAIZ / "benchmark" / "casos"
BENCH_EXEC = RAIZ / "benchmark" / "execucoes"
DS_GERADO = RAIZ / "dataset" / "gerado"
DS_EXPORT = RAIZ / "dataset" / "exportado"
CERT_REG = RAIZ / "certificacao" / "registros"

# prefixo -> arquivo onde a entidade é definida (como cabeçalho Markdown)
DEFINICOES = {
    "C": CANONICO / "conceitos.md",
    "R": CANONICO / "regras.md",
    "PR": CANONICO / "procedimentos.md",
    "E": CANONICO / "erros_comuns.md",
    "X": CANONICO / "contradicoes.md",
    "P": PERGUNTAS,
    "D": DECISOES,
}

RE_REF = re.compile(r"\b(FONTE|PR|BM|C|R|E|X|P|D)-(\d{4})\b")
RE_CAMPO = re.compile(r"^\s*-\s*([a-z_]+):\s*(.*)$")


def _sem_blocos_de_codigo(texto: str) -> list[tuple[int, str]]:
    """Linhas (numeradas a partir de 1) fora de blocos ``` (onde ficam os modelos)."""
    saida, dentro = [], False
    for n, linha in enumerate(texto.splitlines(), 1):
        if linha.strip().startswith("```"):
            dentro = not dentro
            continue
        if not dentro:
            saida.append((n, linha))
    return saida


def ler_entidades(caminho: Path, prefixo: str) -> dict[str, dict]:
    """Lê cabeçalhos '## ID — título' / '### ID — título' e os campos '- chave: valor' abaixo deles."""
    if not caminho.exists():
        return {}
    re_cab = re.compile(rf"^#{{2,3}}\s+({re.escape(prefixo)}-\d{{4}})\b\s*[—\-:]?\s*(.*)$")
    entidades: dict[str, dict] = {}
    atual = None
    for n, linha in _sem_blocos_de_codigo(caminho.read_text(encoding="utf-8")):
        m = re_cab.match(linha)
        if m:
            eid = m.group(1)
            atual = {"id": eid, "titulo": m.group(2).strip(), "linha": n, "campos": {}, "corpo": "",
                     "duplicado": eid in entidades}
            entidades[eid] = atual
            continue
        if linha.startswith("#"):
            atual = None
            continue
        if atual is not None:
            atual["corpo"] += linha + "\n"
            mc = RE_CAMPO.match(linha)
            if mc:
                atual["campos"][mc.group(1)] = mc.group(2).strip()
    return entidades


def referencias(texto: str) -> set[str]:
    return {f"{p}-{n}" for p, n in RE_REF.findall(texto)}


def ler_jsonl(caminho: Path):
    """Gera (numero_linha, objeto | None, erro | None)."""
    with caminho.open(encoding="utf-8") as f:
        for n, linha in enumerate(f, 1):
            if not linha.strip():
                continue
            try:
                yield n, json.loads(linha), None
            except json.JSONDecodeError as e:
                yield n, None, str(e)


def fontes() -> dict[str, dict]:
    if not FONTES.exists():
        return {}
    return {o["id"]: o for _, o, err in ler_jsonl(FONTES) if o and "id" in o}


def todos_ids() -> dict[str, set[str]]:
    ids = {p: set(ler_entidades(arq, p)) for p, arq in DEFINICOES.items()}
    ids["FONTE"] = set(fontes())
    return ids


def sha256_arquivo(caminho: Path) -> str:
    h = hashlib.sha256()
    with caminho.open("rb") as f:
        for bloco in iter(lambda: f.read(1 << 20), b""):
            h.update(bloco)
    return h.hexdigest()


def normalizar(texto: str) -> str:
    texto = unicodedata.normalize("NFKD", texto.lower())
    texto = "".join(c for c in texto if not unicodedata.combining(c))
    return re.sub(r"\s+", " ", re.sub(r"[^\w\s]", " ", texto)).strip()


def entrada_do_exemplo(messages: list[dict]) -> str:
    return "\n".join(m["content"] for m in messages if m["role"] == "user")


def id_exemplo(messages: list[dict]) -> str:
    return "DS-" + hashlib.sha256(normalizar(entrada_do_exemplo(messages)).encode()).hexdigest()[:12]


def shingles(texto: str, k: int = 5) -> set[str]:
    toks = normalizar(texto).split()
    return {" ".join(toks[i:i + k]) for i in range(max(1, len(toks) - k + 1))}


def jaccard(a: set, b: set) -> float:
    return len(a & b) / len(a | b) if a and b else 0.0


def validador(nome_schema: str):
    from jsonschema import Draft202012Validator
    from referencing import Registry, Resource

    recursos = []
    for arq in SCHEMAS.glob("*.schema.json"):
        s = json.loads(arq.read_text(encoding="utf-8"))
        recursos.append((s["$id"], Resource.from_contents(s)))
    registro = Registry().with_resources(recursos)
    schema = json.loads((SCHEMAS / nome_schema).read_text(encoding="utf-8"))
    return Draft202012Validator(schema, registry=registro, format_checker=Draft202012Validator.FORMAT_CHECKER)


def bloco_nucleo() -> str:
    if not PERGUNTAS.exists():
        return ""
    t = PERGUNTAS.read_text(encoding="utf-8")
    m = re.search(r"<!-- NUCLEO:INICIO -->\n(.*?)<!-- NUCLEO:FIM -->", t, re.S)
    return m.group(1).strip() if m else ""


def inbox_nao_registrado() -> list[Path]:
    registrados = {f.get("arquivo") for f in fontes().values()}
    return sorted(p for p in INBOX.rglob("*")
                  if p.is_file() and p.name != ".gitkeep" and str(p.relative_to(INBOX)) not in registrados)


def prompt_sistema() -> str:
    t = (RAIZ / "dataset" / "prompt_sistema.md").read_text(encoding="utf-8")
    m = re.search(r"<!-- PROMPT:INICIO -->\n(.*?)\n<!-- PROMPT:FIM -->", t, re.S)
    return m.group(1).strip() if m else ""
