# Central de Marketing GL: põe os dados (dados.json) e o calendário mestre (../canais/calendario-mestre.csv) dentro do modelo e grava a página.
# O que cada pessoa marca e responde (decisões, entregas, links e a entrevista) não fica no arquivo: fica no banco da página publicada.
# Uso: python3 montar_central.py [saída.html] [pasta]   (padrão: index.html nesta pasta, que não vai para o git)
# Com a pasta, grava também atalho/ nela: os atalhos da pasta atalho/ como .txt e o manifesto.json que a Central usa
# para montar o ZIP do atalho no navegador (as páginas do claude.ai não servem .zip, .url nem .bat).
import csv, datetime as dt, json, os, sys

AQUI = os.path.dirname(os.path.abspath(__file__))
CSV = os.path.join(AQUI, '..', 'canais', 'calendario-mestre.csv')
saida = sys.argv[1] if len(sys.argv) > 1 else os.path.join(AQUI, 'index.html')


def para_html(obj):
    return json.dumps(obj, ensure_ascii=False, separators=(',', ':')).replace('</', '<\\/')


dados = json.load(open(os.path.join(AQUI, 'dados.json'), encoding='utf-8'))
cal = []
with open(CSV, encoding='utf-8-sig', newline='') as f:
    for r in csv.DictReader(f, delimiter=';'):
        d = dt.datetime.strptime(r['Data'], '%d/%m/%Y').date().isoformat()
        cal.append({'d': d, 'h': r['Horário (Brasília)'], 'c': r['Conta'], 'f': r['Formato'], 's': r['Série'], 't': r['Tema'], 'cta': r['Chamada']})
tpl = open(os.path.join(AQUI, 'template.html'), encoding='utf-8').read()
assert tpl.count('<!--DADOS-->') == 1 and tpl.count('<!--CAL-->') == 1
html = tpl.replace('<!--DADOS-->', para_html(dados)).replace('<!--CAL-->', para_html(cal))
open(saida, 'w', encoding='utf-8').write(html)
n = sum(len(b['perguntas']) for b in dados['entrevista'])
print(f'Central GL: {len(dados["paginas"])} páginas, {len(dados["decisoes"])} decisões, {n} perguntas, {len(cal)} linhas do calendário, '
      f'{os.path.getsize(saida) / 1024:.0f} KB -> {saida}')
if len(sys.argv) > 2:
    pasta = os.path.join(sys.argv[2], 'atalho')
    os.makedirs(pasta, exist_ok=True)
    manifesto = []
    for i, nome in enumerate(sorted(os.listdir(os.path.join(AQUI, 'atalho'))), 1):
        conteudo = open(os.path.join(AQUI, 'atalho', nome), 'rb').read()
        open(os.path.join(pasta, f'{i}.txt'), 'wb').write(conteudo)
        manifesto.append({'arq': f'atalho/{i}.txt', 'zip': 'Central de Marketing GL/' + nome})
    json.dump(manifesto, open(os.path.join(pasta, 'manifesto.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    print(f'Atalho para o PC: {len(manifesto)} arquivos em {pasta}')
