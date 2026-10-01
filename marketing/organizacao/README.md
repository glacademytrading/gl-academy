# Organizador da pasta de marketing

`organizar-marketing.ps1` arruma a pasta "Marketing de trading" no Windows do Giovane (Área de Trabalho > Arquivos e Programas > GL Academy organização > Trading). Ele vai dentro do ZIP "Baixar tudo organizado" da Biblioteca de Vídeos GL, na pasta "00 - Comece aqui", com o atalho `Organizar a pasta de marketing.bat`.

O que ele faz:

1. Mostra a prévia e só muda algo depois de você digitar S.
2. Traz as pastas do pacote, mesmo que o ZIP tenha sido extraído em Downloads.
3. Leva as pastas antigas para o lugar certo:
   - comerciais, depoimentos, fotos, imagens, vídeos e vinhetas vão para "06 - Materiais da equipe";
   - LEADS vai para "07";
   - Aurora e o tutorial vão para "08";
   - o resto vai para "99 - Para revisar".
4. Copia o ZIP de vídeos do Codex para "04 - Feito pelo Codex" e extrai os vídeos lá.
5. Grava o inventário, a lista de arquivos repetidos e um registro do que fez.

Ele não apaga nada:

- Um arquivo com o mesmo nome no destino ganha " (2)".
- Uma cópia idêntica fica onde estava; se estava solta na pasta, vai para revisão.
- Se o Windows extrair errado os nomes com acento, o organizador corrige.

Funciona no PowerShell 5.1 do Windows e no PowerShell 7. O arquivo precisa ficar em UTF-8 com BOM, senão o PowerShell 5.1 lê errado os nomes com acento.

Teste numa pasta simulada (precisa da Biblioteca montada com `python3 ../videos/build_library.py`):

```bash
PWSH=/caminho/do/pwsh python3 testar_organizador.py
```
