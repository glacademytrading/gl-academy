# Organizador da pasta de marketing

`organizar-marketing.ps1` arruma a pasta "Marketing de trading" no Windows do Giovane (Área de Trabalho > Arquivos e Programas > GL Academy organização > Trading). Ele vai dentro do ZIP "Baixar tudo organizado" da Biblioteca de Vídeos GL, na pasta "00 - Comece aqui", com o atalho `Organizar a pasta de marketing.bat`.

O que ele faz:

1. Mostra a prévia e só muda algo depois de você digitar S.
2. Traz as pastas dos pacotes do Claude, extraídos em Downloads ou dentro da própria pasta ("GL Academy - Marketing (Claude)", "GL Academy - Organizador e textos"). Se houver dois pacotes, vale o texto mais novo; o antigo que já estava no lugar vai para "99 - Para revisar\Versões anteriores".
3. Leva as pastas antigas para o lugar certo, inclusive as que foram colocadas dentro da pasta de um pacote:
   - comerciais, depoimentos, fotos, imagens, "Vídeos para usar no YouTube", vinhetas e wallpaper vão para "06 - Materiais da equipe";
   - LEADS vai para "07";
   - Aurora e o tutorial vão para "08";
   - o resto vai para "99 - Para revisar".
4. Copia o ZIP de vídeos do Codex para "04 - Feito pelo Codex" e extrai os vídeos lá.
5. Confere as pastas da equipe arquivo por arquivo:
   - conteúdo idêntico (SHA-256) a um vídeo ou imagem das pastas 02 a 04 vai para "99 - Para revisar\Repetidos (já estão nas pastas 02 a 04)";
   - versão anterior de um vídeo do Claude (mesmo código do catálogo, conteúdo diferente) vai para "99 - Para revisar\Versões anteriores dos vídeos do Claude";
   - o que só existe lá fica em "06 - Materiais da equipe".
6. Grava em "00 - Comece aqui" o inventário, a "Conferência das pastas da equipe", a lista de arquivos repetidos e um registro do que fez.
7. Só sugere apagar a pasta de um pacote quando não sobrou nada de fora dentro dela.

Ele não apaga nada:

- Um arquivo com o mesmo nome no destino ganha " (2)".
- Uma cópia idêntica fica onde estava; se estava solta na pasta, vai para revisão.
- Se o Windows extrair errado os nomes com acento, o organizador corrige.
- Pode rodar de novo quando quiser: o que já está no lugar não muda.

Quem já extraiu um pacote dentro de "Marketing de trading" deve baixar o ZIP leve ("Organizador atualizado e textos"), extrair em Downloads e rodar o organizador de lá. O organizador antigo, que veio dentro do pacote, não confere as pastas da equipe.

Funciona no PowerShell 5.1 do Windows e no PowerShell 7. O arquivo precisa ficar em UTF-8 com BOM, senão o PowerShell 5.1 lê errado os nomes com acento.

Teste numa pasta simulada (precisa da Biblioteca montada com `python3 ../videos/build_library.py`):

```bash
PWSH=/caminho/do/pwsh python3 testar_organizador.py
```
