<#
  Organizador da pasta "Marketing de trading" da GL Academy.

  Como usar: dois cliques em "Organizar a pasta de marketing.bat", na pasta "00 - Comece aqui".
  Primeiro aparece a prévia (o que vai para onde). Nada muda até você digitar S e Enter.

  O que ele faz:
    1. Acha a pasta "Marketing de trading" (Desktop\Arquivos e Programas\GL Academy organização\Trading).
    2. Traz as pastas dos pacotes do Claude, extraídos em Downloads ou dentro da própria pasta
       ("GL Academy - Marketing (Claude)", "GL Academy - Organizador e textos"...). Se houver dois pacotes,
       vale o mais novo; texto antigo que já estava no lugar vai para "99 - Para revisar\Versões anteriores".
    3. Cria as pastas que faltarem (00 a 09 e 99).
    4. Leva o que já existia para o lugar certo (comerciais, depoimentos, fotos, vinhetas, LEADS...),
       inclusive o que foi colocado dentro da pasta de um pacote.
    5. Copia o ZIP de vídeos do Codex para "04 - Feito pelo Codex" e extrai os vídeos lá.
    6. Confere as pastas da equipe: o que é cópia idêntica ou versão anterior de um vídeo do Claude ou do
       Codex vai para "99 - Para revisar"; o que só existe lá fica onde está.
    7. Gera o inventário, a conferência, a lista de arquivos repetidos e o registro do que fez.

  Regras: nada é apagado. Se já existe um arquivo com o mesmo nome no destino, o que chega ganha " (2)";
  se for idêntico, não é duplicado. Pastas com o mesmo nome são juntadas.
  Pode rodar de novo quando quiser: o que já está no lugar não muda.

  No terminal: -Previa (só mostra), -Aplicar (aplica sem perguntar), -Raiz "<pasta>", -ZipCodex "<arquivo.zip>".
  Funciona no PowerShell do Windows (5.1) e no PowerShell 7.
#>
param(
  [switch]$Previa,
  [switch]$Aplicar,
  [string]$Raiz = '',
  [string]$ZipCodex = ''
)
$ErrorActionPreference = 'Stop'

$NomeMarketing = 'Marketing de trading'
$CaminhoMarketing = 'Arquivos e Programas\GL Academy organização\Trading\Marketing de trading'
$PastaPadrao = 'C:\Users\Giovane Lazaro\Desktop\' + $CaminhoMarketing
$ZipCodexPadrao = 'C:\Users\Giovane Lazaro\Documents\Novo site para GL Academy - estilo neuronal obsidian\GL_VIDEOS_RODADA_2026-09-30\GL_ACADEMY_VIDEOS_RODADA_2026-09-30.zip'
$NomeZipCodex = 'GL_ACADEMY_VIDEOS_RODADA_2026-09-30.zip'
$NomeZipCodexAqui = 'GL_ACADEMY_VIDEOS_RODADA_2026-09-30 (feito pelo Codex).zip'

# Pastas da organização
$P = [ordered]@{
  comece  = '00 - Comece aqui'
  estrat  = '01 - Estratégia e planejamento'
  videos  = '02 - Vídeos (feitos pelo Claude)'
  imagens = '03 - Imagens (feitas pelo Claude)'
  codex   = '04 - Feito pelo Codex'
  textos  = '05 - Roteiros, legendas e textos'
  equipe  = '06 - Materiais da equipe'
  leads   = '07 - Leads (dados pessoais, acesso restrito)'
  ferr    = '08 - Ferramentas e tutoriais'
  prints  = '09 - Prints do operacional (base dos vídeos)'
  revisar = '99 - Para revisar'
}
$nossas = @($P.Values)
$ignorar = @('desktop.ini', 'Thumbs.db', '.DS_Store')
$PastaRepetidos = 'Repetidos (já estão nas pastas 02 a 04)'
$PastaAnteriores = 'Versões anteriores dos vídeos do Claude'
$PastaTextosAntigos = 'Versões anteriores'
$midia = @('.mp4', '.mov', '.m4v', '.webm', '.jpg', '.jpeg', '.png', '.gif', '.webp')

$registro = New-Object System.Collections.Generic.List[string]
# na prévia nada é criado: estes são os caminhos que passariam a existir
$previstos = New-Object 'System.Collections.Generic.HashSet[string]' ([StringComparer]::OrdinalIgnoreCase)
$pastasPrevistas = New-Object 'System.Collections.Generic.HashSet[string]' ([StringComparer]::OrdinalIgnoreCase)
# o que um pacote colocou nesta rodada: outro pacote não troca por uma versão dele
$colocados = New-Object 'System.Collections.Generic.HashSet[string]' ([StringComparer]::OrdinalIgnoreCase)
$extras = New-Object System.Collections.Generic.List[object]        # itens de vocês que estavam dentro de um pacote
$paraEquipe = New-Object System.Collections.Generic.List[object]    # na prévia: pastas que vão para "06"
$conferencia = New-Object System.Collections.Generic.List[string]
$hashes = @{}
$fontes = @()
$aplicando = $false
$movidos = 0
$falhas = 0
$repetidos = 0

function Anotar([string]$texto, [string]$cor = 'Gray') { $registro.Add($texto); Write-Host $texto -ForegroundColor $cor }
function Rel([string]$p) { if ($p.StartsWith($Raiz)) { return $p.Substring($Raiz.Length).TrimStart('\', '/') } return $p }
function Existe([string]$p) { return ((Test-Path -LiteralPath $p) -or $previstos.Contains($p)) }
function Gravar([string]$arquivo, $linhas) { [IO.File]::WriteAllLines($arquivo, [string[]]$linhas, (New-Object System.Text.UTF8Encoding($true))) }
function Sep { return [IO.Path]::DirectorySeparatorChar }

# Nomes com acento que o Windows extraiu errado (UTF-8 lido com a página de código antiga): "V├¡deos" -> "Vídeos"
$paginas = @()
try { [Text.Encoding]::RegisterProvider([Text.CodePagesEncodingProvider]::Instance) } catch { }
foreach ($cp in 850, 437, 1252) { try { $paginas += [Text.Encoding]::GetEncoding($cp) } catch { } }
$utf8Estrito = New-Object System.Text.UTF8Encoding($false, $true)
function Consertar-Nome([string]$nome) {
  if ($nome -cmatch '^[\x20-\x7E]*$') { return $nome }
  foreach ($enc in $paginas) {
    try {
      $bytes = $enc.GetBytes($nome)
      if ($enc.GetString($bytes) -cne $nome) { continue }  # o nome não cabe nessa página de código
      $novo = $utf8Estrito.GetString($bytes)
      if ($novo -cne $nome) { return $novo }
    } catch { }
  }
  return $nome
}

function Garantir-Pasta([string]$p) {
  if (-not (Existe $p)) {
    Anotar "Criar pasta:  $(Rel $p)" 'DarkGray'
    if ($aplicando) { [void][IO.Directory]::CreateDirectory($p) } else { [void]$previstos.Add($p); [void]$pastasPrevistas.Add($p) }
  }
}

function Destino-Livre([string]$p, [bool]$pasta) {
  if (-not (Existe $p)) { return $p }
  $dir = Split-Path -Parent $p
  $folha = Split-Path -Leaf $p
  if ($pasta) { $nome = $folha; $ext = '' } else { $nome = [IO.Path]::GetFileNameWithoutExtension($folha); $ext = [IO.Path]::GetExtension($folha) }
  $i = 2
  do { $q = Join-Path $dir ('{0} ({1}){2}' -f $nome, $i, $ext); $i++ } while (Existe $q)
  return $q
}

function Hash([string]$p) {
  if (-not $hashes.ContainsKey($p)) {
    try { $hashes[$p] = (Get-FileHash -LiteralPath $p -Algorithm SHA256).Hash } catch { $hashes[$p] = '' }
  }
  return $hashes[$p]
}

function Mesmo-Conteudo([string]$a, [string]$b) {
  $fa = Get-Item -LiteralPath $a -Force; $fb = Get-Item -LiteralPath $b -Force
  if ($fa.PSIsContainer -or $fb.PSIsContainer -or $fa.Length -ne $fb.Length) { return $false }
  $ha = Hash $a
  return ($ha -and $ha -eq (Hash $b))
}

# Foi colocado nesta rodada por um pacote (ele mesmo ou a pasta que o contém)?
function Colocado([string]$p) {
  $q = $p
  while ($q -and $q.Length -gt $Raiz.Length) {
    if ($colocados.Contains($q)) { return $true }
    $q = Split-Path -Parent $q
  }
  return $false
}

function Mover-Fisico([string]$de, [string]$para, [bool]$pasta) {
  if ([IO.Path]::GetPathRoot($de) -ne [IO.Path]::GetPathRoot($para)) {
    # outro disco: copia, e o original fica onde está
    Copy-Item -LiteralPath $de -Destination $para -Recurse
    Anotar "  (outro disco: copiado; o original ficou em $de)" 'DarkGray'
    return
  }
  if ($pasta) { [IO.Directory]::Move($de, $para) } else { [IO.File]::Move($de, $para) }
}

# Move um arquivo ou pasta para dentro de $pastaDestino (opcionalmente com outro nome).
# Pasta que já existe no destino: o conteúdo é juntado, sem sobrescrever nada.
# $doPacote: o item vem de um pacote do Claude; um texto antigo no destino é trocado pela versão nova.
function Mover([string]$origem, [string]$pastaDestino, [string]$novoNome = '', [bool]$doPacote = $false) {
  if (-not (Test-Path -LiteralPath $origem)) { return }
  $item = Get-Item -LiteralPath $origem -Force
  if ($novoNome) { $nome = $novoNome } else { $nome = $item.Name }
  Garantir-Pasta $pastaDestino
  $alvo = Join-Path $pastaDestino $nome
  $real = Test-Path -LiteralPath $alvo
  if ($real -or $pastasPrevistas.Contains($alvo)) {
    $alvoPasta = (-not $real) -or (Get-Item -LiteralPath $alvo -Force).PSIsContainer
    if ($item.PSIsContainer -and $alvoPasta) {
      Anotar "Juntar pasta: $(Rel $origem)  ->  $(Rel $alvo)"
      if (-not $real) { return }  # prévia: a pasta de destino ainda não existe, não há o que conferir
      foreach ($filho in @(Get-ChildItem -LiteralPath $origem -Force)) { Mover $filho.FullName $alvo '' $doPacote }
      if ($aplicando -and -not (Get-ChildItem -LiteralPath $origem -Force)) { Remove-Item -LiteralPath $origem }  # só a pasta que ficou vazia
      return
    }
    if ($real -and -not $item.PSIsContainer -and -not $alvoPasta) {
      if (Mesmo-Conteudo $origem $alvo) {
        # cópia idêntica: se estava solta na pasta do marketing, vai para revisão; se veio de um pacote, fica onde está
        $revisar = Join-Path $Raiz $P.revisar
        if (-not $doPacote -and $origem.StartsWith($Raiz + (Sep)) -and -not $pastaDestino.StartsWith($revisar)) {
          Anotar "Já existe igual: $(Rel $alvo)  (a cópia vai para $($P.revisar))" 'DarkGray'
          Mover $origem (Join-Path $revisar 'Cópias idênticas')
        } else {
          Anotar "Já existe igual: $(Rel $alvo)  (a cópia em $(Rel $origem) fica onde está)" 'DarkGray'
        }
        return
      }
      if ($doPacote) {
        # vale a versão mais nova: a que outro pacote já colocou nesta rodada, ou a de data mais recente
        if ((Colocado $alvo) -or $item.LastWriteTimeUtc -le (Get-Item -LiteralPath $alvo -Force).LastWriteTimeUtc) {
          Anotar "Já está no lugar a versão mais nova: $(Rel $alvo)  (a de $(Rel $origem) fica onde está)" 'DarkGray'
          return
        }
        # versão anterior de um texto do pacote: vai para revisão e a nova entra no lugar
        Anotar "Atualizar:    $(Rel $alvo)" 'DarkGray'
        Mover $alvo (Join-Path (Join-Path $Raiz $P.revisar) $PastaTextosAntigos) ((Split-Path -Leaf $pastaDestino) + ' - ' + $nome)
        if ($aplicando) {
          try { Mover-Fisico $origem $alvo $false; $script:movidos++; $hashes.Remove($alvo) }
          catch { $script:falhas++; Anotar "  Não deu para mover (está aberto em outro programa?): $($_.Exception.Message)" 'Red' }
        } else { $script:movidos++ }
        [void]$colocados.Add($alvo)
        return
      }
    }
  }
  $alvo = Destino-Livre $alvo $item.PSIsContainer
  Anotar "Mover:        $(Rel $origem)  ->  $(Rel $alvo)"
  if ($aplicando) {
    try { Mover-Fisico $origem $alvo $item.PSIsContainer; $script:movidos++ }
    catch { $script:falhas++; Anotar "  Não deu para mover (está aberto em outro programa?): $($_.Exception.Message)" 'Red'; return }
  } else {
    [void]$previstos.Add($alvo); $script:movidos++
    if ($item.PSIsContainer) { [void]$pastasPrevistas.Add($alvo) }
  }
  if ($doPacote) { [void]$colocados.Add($alvo) }
}

function Escolher-Pasta {
  if ($env:OS -ne 'Windows_NT') { return '' }
  try {
    Add-Type -AssemblyName System.Windows.Forms
    $janela = New-Object System.Windows.Forms.FolderBrowserDialog
    $janela.Description = "Não achei a pasta ""$NomeMarketing"". Escolha onde ela está:"
    if ($janela.ShowDialog() -eq [System.Windows.Forms.DialogResult]::OK) { return $janela.SelectedPath }
  } catch { }
  return ''
}

# A pasta do marketing: onde o pacote foi extraído (se for a "Marketing de trading") ou o caminho conhecido
function Achar-Raiz {
  if ($Raiz) { return $Raiz }
  if ((Split-Path -Leaf $pacote) -eq $NomeMarketing) { return $pacote }
  $pai = Split-Path -Parent $pacote
  if ($pai -and (Split-Path -Leaf $pai) -eq $NomeMarketing) { return $pai }
  $candidatas = New-Object System.Collections.Generic.List[string]
  $candidatas.Add($PastaPadrao)
  $desktop = [Environment]::GetFolderPath('Desktop')
  if ($desktop) { $candidatas.Add((Join-Path $desktop $CaminhoMarketing)) }
  if ($env:OneDrive) {
    $candidatas.Add((Join-Path $env:OneDrive ('Desktop\' + $CaminhoMarketing)))
    $candidatas.Add((Join-Path $env:OneDrive ('Área de Trabalho\' + $CaminhoMarketing)))
  }
  foreach ($c in $candidatas) { if (Test-Path -LiteralPath $c -PathType Container) { return $c } }
  return (Escolher-Pasta)
}

function Achar-ZipCodex([string]$rodada) {
  foreach ($c in @($ZipCodex, (Join-Path $rodada $NomeZipCodex), $ZipCodexPadrao)) {
    if ($c -and (Test-Path -LiteralPath $c -PathType Leaf)) { return (Resolve-Path -LiteralPath $c).Path }
  }
  $lugares = New-Object System.Collections.Generic.List[string]
  foreach ($x in @([Environment]::GetFolderPath('MyDocuments'), [Environment]::GetFolderPath('Desktop'))) { if ($x) { $lugares.Add($x) } }
  if ($env:USERPROFILE) { $lugares.Add((Join-Path $env:USERPROFILE 'Downloads')); $lugares.Add((Join-Path $env:USERPROFILE 'Documents')) }
  if ($env:OneDrive) { $lugares.Add($env:OneDrive) }
  foreach ($l in $lugares) {
    if (-not (Test-Path -LiteralPath $l)) { continue }
    $achado = Get-ChildItem -LiteralPath $l -Recurse -Depth 5 -Filter $NomeZipCodex -File -ErrorAction SilentlyContinue | Select-Object -First 1
    if ($achado) { return $achado.FullName }
  }
  return ''
}

function Carregar-Zip { foreach ($a in 'System.IO.Compression', 'System.IO.Compression.FileSystem') { try { Add-Type -AssemblyName $a } catch { } } }
function Eh-Pasta-Zip($entrada) { return ($entrada.FullName.EndsWith('/') -or $entrada.FullName.EndsWith('\')) }

# Extrai entrada por entrada, sobrescrevendo o que tiver ficado pela metade numa tentativa anterior
function Extrair-Zip([string]$zip, [string]$destino) {
  Carregar-Zip
  $base = [IO.Path]::GetFullPath($destino)
  $z = [IO.Compression.ZipFile]::OpenRead($zip)
  try {
    foreach ($e in $z.Entries) {
      $alvo = [IO.Path]::GetFullPath((Join-Path $base $e.FullName))
      if (-not $alvo.StartsWith($base)) { continue }  # caminho que sairia da pasta
      if (Eh-Pasta-Zip $e) { [void][IO.Directory]::CreateDirectory($alvo); continue }
      [void][IO.Directory]::CreateDirectory((Split-Path -Parent $alvo))
      [IO.Compression.ZipFileExtensions]::ExtractToFile($e, $alvo, $true)
    }
  } finally { $z.Dispose() }
}

function Ja-Extraido([string]$zip, [string]$destino) {
  if (-not (Test-Path -LiteralPath $destino) -or -not (Test-Path -LiteralPath $zip)) { return $false }
  try {
    Carregar-Zip
    $z = [IO.Compression.ZipFile]::OpenRead($zip)
    try { $n = @($z.Entries | Where-Object { -not (Eh-Pasta-Zip $_) }).Count } finally { $z.Dispose() }
    return (@(Get-ChildItem -LiteralPath $destino -Recurse -File -Force).Count -ge $n)
  } catch { return $true }
}

# Pastas da organização dentro de um pacote, já com o nome certo (mesmo se o Windows extraiu o acento errado)
function Do-Pacote([string]$origem) {
  return @(Get-ChildItem -LiteralPath $origem -Force | Where-Object { $_.Name -ne $P.comece -and $nossas -contains (Consertar-Nome $_.Name) })
}

# Pacotes de onde trazer as pastas: o deste organizador primeiro (o mais novo), depois os que foram
# extraídos dentro da pasta do marketing ("GL Academy - Marketing (Claude)", por exemplo)
function Achar-Fontes {
  $lista = New-Object System.Collections.Generic.List[string]
  if ($pacote -ne $Raiz) { $lista.Add($pacote) }
  $dentro = @(Get-ChildItem -LiteralPath $Raiz -Directory -Force | Where-Object {
      $_.FullName -ne $pacote -and $_.Name -like 'GL Academy - *' -and $_.Name -notlike 'GL Academy - Kit do site*' } |
      Sort-Object LastWriteTime -Descending)
  foreach ($d in $dentro) { $lista.Add($d.FullName) }
  return $lista.ToArray()
}
function Dedicada([string]$pasta) { return ((Split-Path -Leaf $pasta) -like 'GL Academy*') }

# 1) Corrige nomes com acento extraídos errado
function Passo-Nomes {
  $origens = @($fontes)
  if ($pacote -eq $Raiz) { $origens += $Raiz }
  $n = 0
  foreach ($o in $origens) {
    $pastas = Do-Pacote $o
    if (-not @($pastas | Where-Object { (Consertar-Nome $_.Name) -cne $_.Name }).Count) { continue }
    foreach ($r in $pastas) {
      $itens = @(Get-ChildItem -LiteralPath $r.FullName -Recurse -Force -ErrorAction SilentlyContinue) + @($r)
      # de baixo para cima: o conteúdo antes da pasta que o contém
      foreach ($it in ($itens | Sort-Object { $_.FullName.Length } -Descending)) {
        $novo = Consertar-Nome $it.Name
        if ($novo -cne $it.Name) {
          $n++
          if ($aplicando) {
            $dir = Split-Path -Parent $it.FullName
            try {
              if (Test-Path -LiteralPath (Join-Path $dir $novo)) { Mover $it.FullName $dir $novo }  # já existe: junta
              else { Mover-Fisico $it.FullName (Join-Path $dir $novo) $it.PSIsContainer }
            } catch { $script:falhas++; Anotar "  Não deu para corrigir o nome: $($it.Name)" 'Red' }
          }
        }
      }
    }
  }
  if ($n) { Anotar ''; Anotar "Corrigir nomes com acento que o Windows extraiu errado: $n itens" 'Yellow' }
}

# 2) Pacotes: traz as pastas deles e separa o que vocês colocaram dentro da pasta de um pacote
function Passo-Pacote {
  foreach ($f in $fontes) {
    Anotar ''
    Anotar "Trazendo o pacote do Claude ($f):" 'Yellow'
    foreach ($it in (Do-Pacote $f)) { Mover $it.FullName $Raiz (Consertar-Nome $it.Name) $true }
    if (Dedicada $f) {
      foreach ($it in @(Get-ChildItem -LiteralPath $f -Force)) {
        if ($it.Name -eq $P.comece -or $ignorar -contains $it.Name -or $it.Name -like '~$*' -or $nossas -contains (Consertar-Nome $it.Name)) { continue }
        $extras.Add($it)
      }
    }
  }
  if ($pacote -ne $Raiz) {
    # "00 - Comece aqui" está em uso por esta janela: os arquivos são copiados (e trocam a versão antiga)
    $destComece = Join-Path $Raiz $P.comece
    Garantir-Pasta $destComece
    foreach ($f in @(Get-ChildItem -LiteralPath $PSScriptRoot -File -Force)) {
      if ($ignorar -contains $f.Name) { continue }
      $alvo = Join-Path $destComece $f.Name
      if ((Test-Path -LiteralPath $alvo) -and (Mesmo-Conteudo $f.FullName $alvo)) { continue }
      Anotar "Copiar:       $($f.Name)  ->  $($P.comece)"
      if ($aplicando) { [IO.File]::Copy($f.FullName, $alvo, $true) }
    }
  }
}

# 3) Estrutura principal
function Passo-Estrutura { foreach ($nome in $nossas) { Garantir-Pasta (Join-Path $Raiz $nome) } }

# 4) O que já estava na pasta (ou dentro de um pacote): cada item para o seu lugar; o resto para revisão
function Passo-Existentes {
  Anotar ''
  Anotar 'Itens que já estavam na pasta:' 'Yellow'
  $equipe = Join-Path $Raiz $P.equipe
  $rodada = Join-Path (Join-Path $Raiz $P.codex) 'Rodada 2026-09-30'
  $mapa = @(
    @{ padrao = 'comerciais';                           destino = $equipe; novo = 'Comerciais' },
    @{ padrao = 'Depoimentos';                          destino = $equipe; novo = '' },
    @{ padrao = 'Depoimentos de assinantes atuais';     destino = $equipe; novo = '' },
    @{ padrao = 'Fotos para postar (Giovane)';          destino = $equipe; novo = '' },
    @{ padrao = 'imagens para usar';                    destino = $equipe; novo = 'Imagens para usar' },
    @{ padrao = 'Vídeos para usar no Youtube';          destino = $equipe; novo = 'Vídeos para usar no YouTube' },
    @{ padrao = 'Vinhetas';                             destino = $equipe; novo = '' },
    @{ padrao = 'GL Academy Trading Fractal Wallpaper*'; destino = (Join-Path $equipe 'Wallpaper e fundos'); novo = '' },
    @{ padrao = 'LEADS';                                destino = $Raiz; novo = $P.leads },
    @{ padrao = 'Aurora*';                              destino = (Join-Path $Raiz $P.ferr); novo = '' },
    @{ padrao = 'tutorial_higgsfield*';                 destino = (Join-Path $Raiz $P.ferr); novo = '' },
    @{ padrao = 'GL_ACADEMY_VIDEOS_RODADA_2026-09-30*.zip'; destino = $rodada; novo = $NomeZipCodexAqui },
    @{ padrao = 'GL_VIDEOS_RODADA_2026-09-30';          destino = (Join-Path $Raiz $P.codex); novo = 'Rodada 2026-09-30' }
  )
  $soltos = @(Get-ChildItem -LiteralPath $Raiz -Force | Where-Object {
      $nossas -notcontains (Consertar-Nome $_.Name) -and $ignorar -notcontains $_.Name -and $_.Name -notlike '~$*' -and
      $fontes -notcontains $_.FullName -and $_.FullName -ne $pacote -and $_.Name -notlike 'GL Academy - *' }) + $extras.ToArray()
  $tratados = @{}
  foreach ($m in $mapa) {
    foreach ($it in $soltos) {
      if (-not $tratados.ContainsKey($it.FullName) -and $it.Name -like $m.padrao) {
        $tratados[$it.FullName] = $true
        if ($m.novo) { $final = $m.novo } else { $final = $it.Name }
        if ($m.destino.StartsWith($equipe)) { $paraEquipe.Add([pscustomobject]@{ origem = $it.FullName; topo = $final }) }
        Mover $it.FullName $m.destino $m.novo
      }
    }
  }
  foreach ($it in $soltos) {
    if (-not $tratados.ContainsKey($it.FullName)) { Mover $it.FullName (Join-Path $Raiz $P.revisar) }
  }
  if ($soltos.Count -eq 0) { Anotar '(nada solto: está tudo no lugar)' }
}

# 5) ZIP com os vídeos feitos pelo Codex: copiado (o original fica onde está) e extraído
function Passo-Codex {
  Anotar ''
  Anotar 'Vídeos feitos pelo Codex:' 'Yellow'
  $rodada = Join-Path (Join-Path $Raiz $P.codex) 'Rodada 2026-09-30'
  $zipAqui = Join-Path $rodada $NomeZipCodexAqui
  $extraidos = Join-Path $rodada 'Vídeos extraídos do ZIP'
  if (Existe $zipAqui) { Anotar "ZIP do Codex na pasta 04: ok" }
  else {
    $fonte = Achar-ZipCodex $rodada
    if (-not $fonte) { Anotar "ATENÇÃO: não achei o $NomeZipCodex. Copie o arquivo para ""$(Rel $rodada)"" e rode de novo." 'Red'; return }
    if ((Split-Path -Parent $fonte) -eq $rodada) { Mover $fonte $rodada $NomeZipCodexAqui }
    else {
      Garantir-Pasta $rodada
      Anotar "Copiar:       $fonte  ->  $(Rel $zipAqui)"
      if ($aplicando) { [IO.File]::Copy($fonte, $zipAqui) } else { [void]$previstos.Add($zipAqui) }
    }
  }
  if (Ja-Extraido $zipAqui $extraidos) { Anotar 'Vídeos do Codex já extraídos: ok' }
  else {
    Anotar "Extrair:      $NomeZipCodexAqui  ->  $(Rel $extraidos)"
    if ($aplicando) {
      try { Extrair-Zip $zipAqui $extraidos }
      catch { $script:falhas++; Anotar "  Não deu para extrair: $($_.Exception.Message). Abra o ZIP e extraia à mão." 'Red' }
    }
  }
}

# 6) Conferência das pastas da equipe contra o que o Claude e o Codex fizeram
function Midias([string]$pasta) {
  if (-not (Test-Path -LiteralPath $pasta)) { return @() }
  $i = Get-Item -LiteralPath $pasta -Force
  if (-not $i.PSIsContainer) { if ($midia -contains $i.Extension.ToLower()) { return @($i) } else { return @() } }
  return @(Get-ChildItem -LiteralPath $pasta -Recurse -File -Force -ErrorAction SilentlyContinue | Where-Object { $midia -contains $_.Extension.ToLower() })
}

# Código de cada vídeo e imagem na Biblioteca ("v04-gamma-exposure") -> onde está a versão atual
function Ler-Catalogo {
  $mapa = @{}
  $catalogos = @(@{ pasta = $P.videos; csv = 'Catálogo dos vídeos (abre no Excel).csv' }, @{ pasta = $P.imagens; csv = 'Catálogo das imagens (abre no Excel).csv' })
  foreach ($c in $catalogos) {
    $achado = ''
    foreach ($base in @($Raiz) + @($fontes)) {
      $arq = Join-Path (Join-Path $base $c.pasta) $c.csv
      if (Test-Path -LiteralPath $arq) { $achado = $arq; break }
    }
    if (-not $achado) { continue }
    try {
      foreach ($l in (Import-Csv -LiteralPath $achado -Delimiter ';' -Encoding UTF8)) {
        $cod = $l.'Código na Biblioteca'
        if ($cod) { $mapa[$cod.ToLower()] = Join-Path (Join-Path $c.pasta $l.Pasta) $l.Arquivo }
      }
    } catch { }
  }
  return $mapa
}

# Caminho de um arquivo do Claude ou do Codex a partir da pasta do marketing (ou do pacote onde ainda está)
function Rel-Nosso([string]$p) {
  foreach ($base in @($fontes) + @($Raiz)) { if ($p.StartsWith($base + (Sep))) { return $p.Substring($base.Length + 1) } }
  return $p
}

function Passo-Repetidos {
  Anotar ''
  Anotar 'Conferência das pastas da equipe (cópias do que o Claude e o Codex fizeram):' 'Yellow'
  $equipe = Join-Path $Raiz $P.equipe
  $revisar = Join-Path $Raiz $P.revisar
  $hashes.Clear()

  # o que o Claude e o Codex fizeram, por tamanho (o conteúdo só é comparado quando o tamanho bate)
  $porTamanho = @{}
  $nossos = 0
  foreach ($base in @($Raiz) + @($fontes)) {
    foreach ($n in @($P.videos, $P.imagens, $P.codex, $P.prints)) {
      foreach ($f in (Midias (Join-Path $base $n))) {
        $nossos++
        $k = [string]$f.Length
        if (-not $porTamanho.ContainsKey($k)) { $porTamanho[$k] = New-Object System.Collections.Generic.List[string] }
        $porTamanho[$k].Add($f.FullName)
      }
    }
  }
  $codigos = Ler-Catalogo

  # os arquivos da equipe: o que já está em "06" e, na prévia, o que ainda vai para lá
  $daEquipe = New-Object System.Collections.Generic.List[object]
  if (Test-Path -LiteralPath $equipe) {
    foreach ($d in @(Get-ChildItem -LiteralPath $equipe -Directory -Force)) {
      foreach ($f in @(Get-ChildItem -LiteralPath $d.FullName -Recurse -File -Force -ErrorAction SilentlyContinue)) {
        $daEquipe.Add([pscustomobject]@{ f = $f; topo = $d.Name; exibir = $d.Name + (Sep) + $f.FullName.Substring($d.FullName.Length + 1) })
      }
    }
  }
  if (-not $aplicando) {
    foreach ($e in $paraEquipe) {
      $o = Get-Item -LiteralPath $e.origem -Force
      if ($o.PSIsContainer) {
        foreach ($f in @(Get-ChildItem -LiteralPath $o.FullName -Recurse -File -Force -ErrorAction SilentlyContinue)) {
          $daEquipe.Add([pscustomobject]@{ f = $f; topo = $e.topo; exibir = $e.topo + (Sep) + $f.FullName.Substring($o.FullName.Length + 1) })
        }
      } else { $daEquipe.Add([pscustomobject]@{ f = $o; topo = 'Wallpaper e fundos'; exibir = $o.Name }) }
    }
  }

  $iguais = New-Object System.Collections.Generic.List[string]
  $antigos = New-Object System.Collections.Generic.List[string]
  $ficam = New-Object System.Collections.Generic.List[string]
  foreach ($t in $daEquipe) {
    $f = $t.f
    if ($ignorar -contains $f.Name) { continue }
    $ext = $f.Extension.ToLower()
    $original = ''
    if ($midia -contains $ext -and $porTamanho.ContainsKey([string]$f.Length)) {
      $h = Hash $f.FullName
      foreach ($o in $porTamanho[[string]$f.Length]) { if ($h -and (Hash $o) -eq $h) { $original = $o; break } }
    }
    $codigo = ([IO.Path]::GetFileNameWithoutExtension($f.Name) -replace '\s*\(\d+\)$', '').ToLower()
    if ($original) {
      $iguais.Add("  $($t.exibir)  =  $(Rel-Nosso $original)")
      Mover $f.FullName (Join-Path $revisar $PastaRepetidos) ($t.topo + ' - ' + $f.Name)
    } elseif ($midia -contains $ext -and $codigos.ContainsKey($codigo)) {
      $antigos.Add("  $($t.exibir)  ->  versão atual: $($codigos[$codigo])")
      Mover $f.FullName (Join-Path $revisar $PastaAnteriores) ($t.topo + ' - ' + $f.Name)
    } elseif ($f.Name -ieq 'LEGENDAS.txt') {
      $antigos.Add("  $($t.exibir)  ->  legendas antigas; hoje cada pasta do Claude tem ""Legendas e usos.txt""")
      Mover $f.FullName (Join-Path $revisar $PastaAnteriores) ($t.topo + ' - ' + $f.Name)
    } else {
      $ficam.Add("  $($t.exibir)")
    }
  }

  $conferencia.Clear()
  $conferencia.Add("Conferência das pastas da equipe - $(Get-Date -Format 'dd/MM/yyyy HH:mm')")
  $conferencia.Add("Comparei $($daEquipe.Count) arquivos das pastas da equipe com $nossos vídeos e imagens que o Claude e o Codex fizeram.")
  $conferencia.Add('Nada foi apagado.')
  $conferencia.Add('')
  $conferencia.Add("REPETIDOS: conteúdo idêntico a um arquivo do Claude ou do Codex ($($iguais.Count)). Foram para ""$($P.revisar)\$PastaRepetidos"".")
  $conferencia.AddRange($iguais)
  $conferencia.Add('')
  $conferencia.Add("VERSÕES ANTERIORES de vídeos e imagens do Claude ($($antigos.Count)). Foram para ""$($P.revisar)\$PastaAnteriores"".")
  $conferencia.AddRange($antigos)
  $conferencia.Add('')
  $conferencia.Add("SÓ EXISTEM NAS PASTAS DA EQUIPE ($($ficam.Count)). Ficaram em ""$($P.equipe)"".")
  $conferencia.AddRange($ficam)
  Anotar ("{0} arquivos da equipe conferidos: {1} repetidos, {2} versões anteriores, {3} só de vocês (ficam)." -f $daEquipe.Count, $iguais.Count, $antigos.Count, $ficam.Count)
  if (-not $aplicando -and ($iguais.Count -or $antigos.Count)) { foreach ($l in ($iguais.ToArray() + $antigos.ToArray())) { Anotar $l 'DarkGray' } }
}

# 7) Relatórios: inventário, conferência e arquivos repetidos (nada é apagado)
function Passo-Relatorios {
  $hashes.Clear()
  $comece = Join-Path $Raiz $P.comece
  [void][IO.Directory]::CreateDirectory($comece)
  $foras = @(@($fontes) + @($pacote) | Where-Object { $_ -ne $Raiz -and $_.StartsWith($Raiz + (Sep)) } | ForEach-Object { $_ + (Sep) })
  $todos = @(Get-ChildItem -LiteralPath $Raiz -Recurse -File -Force -ErrorAction SilentlyContinue | Where-Object {
      $arq = $_.FullName
      $ignorar -notcontains $_.Name -and -not @($foras | Where-Object { $arq.StartsWith($_) }).Count })

  $inv = New-Object System.Collections.Generic.List[string]
  $inv.Add("Inventário da pasta de marketing - $(Get-Date -Format 'dd/MM/yyyy HH:mm')"); $inv.Add($Raiz); $inv.Add('')
  foreach ($pasta in (Get-ChildItem -LiteralPath $Raiz -Directory -Force | Sort-Object Name)) {
    if ($foras -contains ($pasta.FullName + (Sep))) { continue }
    $arqs = @($todos | Where-Object { $_.FullName.StartsWith($pasta.FullName + (Sep)) })
    $mb = [math]::Round((($arqs | Measure-Object Length -Sum).Sum) / 1MB, 1)
    $inv.Add(('{0}  ({1} arquivos, {2} MB)' -f $pasta.Name, $arqs.Count, $mb))
    foreach ($sub in (Get-ChildItem -LiteralPath $pasta.FullName -Directory -Force | Sort-Object Name)) {
      $n = @($arqs | Where-Object { $_.FullName.StartsWith($sub.FullName + (Sep)) }).Count
      $inv.Add(('    {0}  ({1} arquivos)' -f $sub.Name, $n))
    }
  }
  Gravar (Join-Path $comece 'Inventário.txt') $inv
  Gravar (Join-Path $comece 'Conferência das pastas da equipe.txt') $conferencia

  # repetidos que sobraram: mesmo tamanho primeiro, depois a impressão digital (SHA-256)
  $rep = New-Object System.Collections.Generic.List[string]
  $rep.Add('Arquivos com conteúdo idêntico. Nada foi apagado: decida qual cópia manter.'); $rep.Add('')
  $grupos = 0
  foreach ($g in ($todos | Where-Object { $_.Length -gt 0 } | Group-Object Length | Where-Object { $_.Count -gt 1 })) {
    $comHash = foreach ($f in $g.Group) { [pscustomobject]@{ f = $f; h = (Hash $f.FullName) } }
    foreach ($h in (@($comHash) | Where-Object { $_.h } | Group-Object h | Where-Object { $_.Count -gt 1 })) {
      $grupos++
      $rep.Add(('Grupo {0} ({1} MB cada):' -f $grupos, [math]::Round($h.Group[0].f.Length / 1MB, 2)))
      foreach ($x in $h.Group) { $rep.Add('    ' + (Rel $x.f.FullName)) }
      $rep.Add('')
    }
  }
  if ($grupos -eq 0) { $rep.Add('Nenhum arquivo repetido.') }
  Gravar (Join-Path $comece 'Arquivos repetidos.txt') $rep
  $script:repetidos = $grupos
}

# O que sobrou nas pastas dos pacotes: só sugere apagar quando não ficou nada de vocês
function Mensagens-Sobra {
  foreach ($f in @($fontes)) {
    if (-not (Test-Path -LiteralPath $f)) { continue }
    if (-not (Dedicada $f)) { Anotar "Depois de conferir, pode apagar a pasta ""$($P.comece)"" que ficou em $f" 'Yellow'; continue }
    $estranhos = @(Get-ChildItem -LiteralPath $f -Force | Where-Object {
        $_.Name -ne $P.comece -and $ignorar -notcontains $_.Name -and $nossas -notcontains (Consertar-Nome $_.Name) })
    if ($estranhos.Count) { Anotar "Na pasta $f ficaram itens que não são do pacote: $(($estranhos | ForEach-Object { $_.Name }) -join ', '). Confira antes de apagar." 'Yellow' }
    else { Anotar "Pode apagar a pasta extraída $f (o que ficou nela já está organizado ou é cópia)." 'Yellow' }
  }
}

function Organizar {
  $script:fontes = @(Achar-Fontes)
  Passo-Nomes
  Passo-Pacote
  Passo-Estrutura
  Passo-Existentes
  Passo-Codex
  Passo-Repetidos
}

function Zerar { $registro.Clear(); $previstos.Clear(); $pastasPrevistas.Clear(); $colocados.Clear(); $extras.Clear(); $paraEquipe.Clear(); $conferencia.Clear(); $script:movidos = 0; $script:falhas = 0 }

# --- Início -----------------------------------------------------------------
# O pacote é a pasta acima de "00 - Comece aqui", onde este arquivo está
$pacote = Split-Path -Parent $PSScriptRoot
$Raiz = Achar-Raiz
if (-not $Raiz -or -not (Test-Path -LiteralPath $Raiz -PathType Container)) {
  Write-Host "Não achei a pasta ""$NomeMarketing"". Extraia o ZIP dentro dela e rode de novo." -ForegroundColor Red
  exit 1
}
$Raiz = (Resolve-Path -LiteralPath $Raiz).Path.TrimEnd('\', '/')
$amplas = @([Environment]::GetFolderPath('Desktop'), [Environment]::GetFolderPath('MyDocuments'), [Environment]::GetFolderPath('UserProfile'), $env:USERPROFILE, $env:OneDrive) |
  Where-Object { $_ } | ForEach-Object { $_.TrimEnd('\', '/') }
if (-not (Split-Path -Parent $Raiz) -or $amplas -contains $Raiz -or ($env:USERPROFILE -and $Raiz -eq (Join-Path $env:USERPROFILE 'Downloads'))) {
  Write-Host "Essa pasta é ampla demais para organizar: $Raiz. Escolha a pasta ""$NomeMarketing""." -ForegroundColor Red
  exit 1
}
if ((Split-Path -Leaf $Raiz) -ne $NomeMarketing -and -not $Aplicar -and -not $Previa) {
  $ok = Read-Host "A pasta $Raiz não se chama ""$NomeMarketing"". Tudo o que estiver solto nela vai ser organizado. Continuar? (S/N)"
  if ($ok -notmatch '^\s*s') { exit 0 }
}

Write-Host ''
Write-Host 'Organizador do marketing · GL Academy' -ForegroundColor Cyan
Anotar "Pasta do marketing: $Raiz" 'Yellow'
if ($Aplicar) {
  $aplicando = $true
  Organizar
} else {
  Anotar 'PRÉVIA: nada muda até você confirmar.' 'Cyan'
  Organizar
  Write-Host ''
  if ($Previa) { Write-Host "Prévia concluída: $movidos itens a mover." -ForegroundColor Green; exit 0 }
  $resposta = Read-Host 'Organizar agora? Digite S e Enter (ou só Enter para sair sem mudar nada)'
  if ($resposta -notmatch '^\s*s') { Write-Host 'Nada foi alterado.' -ForegroundColor Yellow; exit 0 }
  Zerar
  $aplicando = $true
  Anotar "Pasta do marketing: $Raiz" 'Yellow'
  Organizar
}

Passo-Relatorios
Anotar ''
if ($repetidos -eq 1) { $grupos = '1 grupo' } else { $grupos = "$repetidos grupos" }
Anotar "Pronto: $movidos itens movidos. Em ""$($P.comece)"" ficaram o Inventário, a Conferência das pastas da equipe, os Arquivos repetidos ($grupos) e o Registro do que foi feito." 'Green'
if ($falhas) { Anotar "$falhas itens não foram movidos (provavelmente estavam abertos). Feche os programas e rode de novo: o resto já está no lugar." 'Red' }
Mensagens-Sobra
Gravar (Join-Path (Join-Path $Raiz $P.comece) ("Registro da organização {0}.txt" -f (Get-Date -Format 'yyyy-MM-dd HH-mm'))) $registro
if ($env:OS -eq 'Windows_NT') { try { Start-Process -FilePath 'explorer.exe' -ArgumentList ('"{0}"' -f $Raiz) } catch { } }
