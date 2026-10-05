# Página Pauta GL: põe o calendário mestre (../canais/calendario-mestre.csv) dentro do template e grava a página.
# A pauta de cada dia não fica no arquivo: a rotina diária grava no banco da página publicada (coleção "pauta").
# Uso: python3 montar_pauta.py [saída.html]   (padrão: index.html nesta pasta)
import csv, datetime as dt, json, os, sys

AQUI = os.path.dirname(os.path.abspath(__file__))
CSV = os.path.join(AQUI, '..', 'canais', 'calendario-mestre.csv')
saida = sys.argv[1] if len(sys.argv) > 1 else os.path.join(AQUI, 'index.html')
linhas = []
with open(CSV, encoding='utf-8-sig', newline='') as f:
    for r in csv.DictReader(f, delimiter=';'):
        d = dt.datetime.strptime(r['Data'], '%d/%m/%Y').date().isoformat()
        linhas.append({'d': d, 'h': r['Horário (Brasília)'], 'c': r['Conta'], 'f': r['Formato'], 's': r['Série'], 'p': r['Pilar'],
                       't': r['Tema'], 'cta': r['Chamada'], 'o': r['Origem'], 'obs': r['Observação']})
tpl = open(os.path.join(AQUI, 'template.html'), encoding='utf-8').read()
assert tpl.count('<!--CAL-->') == 1
html = tpl.replace('<!--CAL-->', json.dumps(linhas, ensure_ascii=False, separators=(',', ':')).replace('</', '<\\/'))
open(saida, 'w', encoding='utf-8').write(html)
print(f'Pauta GL: {len(linhas)} linhas do calendário, página {os.path.getsize(saida) / 1024:.0f} KB -> {saida}')
