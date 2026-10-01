<#
  Organizador da pasta "Marketing de trading" da GL Academy.

  Como usar: dois cliques em "Organizar a pasta de marketing.bat", na pasta "00 - Comece aqui".
  Primeiro aparece a prévia (o que vai para onde). Nada muda até você digitar S e Enter.

  O que ele faz:
    1. Acha a pasta "Marketing de trading" (Desktop\Arquivos e Programas\GL Academy organização\Trading).
    2. Traz para ela as pastas do pacote do Claude, se o ZIP foi extraído em outro lugar (Downloads, por exemplo).
    3. Cria as pastas que faltarem (00 a 09 e 99).
    4. Leva o que já existia para o lugar certo: comerciais, depoimentos, fotos, vinhetas, LEADS...
    5. Copia o ZIP de vídeos do Codex para "04 - Feito pelo Codex" e extrai os vídeos lá.
    6. Gera o inventário, a lista de arquivos repetidos e o registro do que fez.

  Regras: nada é apagado. Se já existe um arquivo com o mesmo nome no destino, o que chega ganha " (2)";
  se for idêntico, fica onde estava. Pastas com o mesmo nome são juntadas.
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

$registro = New-Object System.Collections.Generic.List[string]
# na prévia nada é criado: estes são os caminhos que passariam a existir
$previstos = New-Object 'System.Collections.Generic.HashSet[string]' ([StringComparer]::OrdinalIgnoreCase)
$pastasPrevistas = New-Object 'System.Collections.Generic.HashSet[string]' ([StringComparer]::OrdinalIgnoreCase)
$aplicando = $false
$movidos = 0
$falhas = 0
$sobra = ''

function Anotar([string]$texto, [string]$cor = 'Gray') { $registro.Add($texto); Write-Host $texto -ForegroundColor $cor }
function Rel([string]$p) { if ($p.StartsWith($Raiz)) { return $p.Substring($Raiz.Length).TrimStart('\', '/') } return $p }
function Existe([string]$p) { return ((Test-Path -LiteralPath $p) -or $previstos.Contains($p)) }
function Gravar([string]$arquivo, $linhas) { [IO.File]::WriteAllLines($arquivo, [string[]]$linhas, (New-Object System.Text.UTF8Encoding($true))) }

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

function Mesmo-Conteudo([string]$a, [string]$b) {
  $fa = Get-Item -LiteralPath $a -Force; $fb = Get-Item -LiteralPath $b -Force
  if ($fa.PSIsContainer -or $fb.PSIsContainer -or $fa.Length -ne $fb.Length) { return $false }
  try { return ((Get-FileHash -LiteralPath $a -Algorithm SHA256).Hash -eq (Get-FileHash -LiteralPath $b -Algorithm SHA256).Hash) } catch { return $false }
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
function Mover([string]$origem, [string]$pastaDestino, [string]$novoNome = '') {
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
      foreach ($filho in @(Get-ChildItem -LiteralPath $origem -Force)) { Mover $filho.FullName $alvo }
      if ($aplicando -and -not (Get-ChildItem -LiteralPath $origem -Force)) { Remove-Item -LiteralPath $origem }  # só a pasta que ficou vazia
      return
    }
    if ($real -and -not $item.PSIsContainer -and -not $alvoPasta -and (Mesmo-Conteudo $origem $alvo)) {
      # cópia idêntica: se estava solta na pasta do marketing, vai para revisão; se veio de fora (o pacote), fica onde está
      $revisar = Join-Path $Raiz $P.revisar
      if ($origem.StartsWith($Raiz + [IO.Path]::DirectorySeparatorChar) -and -not $pastaDestino.StartsWith($revisar)) {
        Anotar "Já existe igual: $(Rel $alvo)  (a cópia vai para $($P.revisar))" 'DarkGray'
        Mover $origem (Join-Path $revisar 'Cópias idênticas')
      } else {
        Anotar "Já existe igual: $(Rel $alvo)  (a cópia em $(Rel $origem) fica onde está)" 'DarkGray'
      }
      return
    }
  }
  $alvo = Destino-Livre $alvo $item.PSIsContainer
  Anotar "Mover:        $(Rel $origem)  ->  $(Rel $alvo)"
  if ($aplicando) {
    try { Mover-Fisico $origem $alvo $item.PSIsContainer; $script:movidos++ }
    catch { $script:falhas++; Anotar "  Não deu para mover (está aberto em outro programa?): $($_.Exception.Message)" 'Red' }
  } else {
    [void]$previstos.Add($alvo); $script:movidos++
    if ($item.PSIsContainer) { [void]$pastasPrevistas.Add($alvo) }
  }
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

# Pastas do pacote, já com o nome certo (mesmo se o Windows tiver extraído com acento errado)
function Do-Pacote { return @(Get-ChildItem -LiteralPath $pacote -Force | Where-Object { $_.Name -ne $P.comece -and $nossas -contains (Consertar-Nome $_.Name) }) }

# 1) Corrige nomes com acento extraídos errado
function Passo-Nomes {
  $pastas = Do-Pacote
  if (-not @($pastas | Where-Object { (Consertar-Nome $_.Name) -cne $_.Name }).Count) { return }
  $n = 0
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
  if ($n) { Anotar ''; Anotar "Corrigir nomes com acento que o Windows extraiu errado: $n itens" 'Yellow' }
}

# 2) Pacote extraído fora da pasta do marketing (Downloads, por exemplo): traz as pastas dele
function Passo-Pacote {
  if ($pacote -eq $Raiz) { return }
  Anotar ''
  Anotar "Trazendo o pacote do Claude (extraído em $pacote):" 'Yellow'
  foreach ($it in (Do-Pacote)) { Mover $it.FullName $Raiz (Consertar-Nome $it.Name) }
  # "00 - Comece aqui" está em uso por esta janela: os arquivos são copiados
  $destComece = Join-Path $Raiz $P.comece
  Garantir-Pasta $destComece
  foreach ($f in @(Get-ChildItem -LiteralPath $PSScriptRoot -File -Force)) {
    if ($ignorar -contains $f.Name) { continue }
    $alvo = Join-Path $destComece $f.Name
    if ((Test-Path -LiteralPath $alvo) -and (Mesmo-Conteudo $f.FullName $alvo)) { continue }
    Anotar "Copiar:       $($f.Name)  ->  $($P.comece)"
    if ($aplicando) { [IO.File]::Copy($f.FullName, $alvo, $true) }
  }
  if ((Split-Path -Leaf $pacote) -like 'GL Academy*') { $script:sobra = "Depois de conferir, pode apagar a pasta extraída: $pacote" }
  else { $script:sobra = "Depois de conferir, pode apagar a pasta ""$($P.comece)"" que ficou em $pacote" }
}

# 3) Estrutura principal
function Passo-Estrutura { foreach ($nome in $nossas) { Garantir-Pasta (Join-Path $Raiz $nome) } }

# 4) O que já estava na pasta: cada item para o seu lugar; o resto para revisão (nada se perde)
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
      $_.FullName -ne $pacote -and $_.Name -notlike 'GL Academy - Marketing*' })
  $tratados = @{}
  foreach ($m in $mapa) {
    foreach ($it in $soltos) {
      if (-not $tratados.ContainsKey($it.FullName) -and $it.Name -like $m.padrao) {
        $tratados[$it.FullName] = $true
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

# 6) Relatórios: inventário e arquivos repetidos (nada é apagado)
function Passo-Relatorios {
  $comece = Join-Path $Raiz $P.comece
  [void][IO.Directory]::CreateDirectory($comece)
  $sep = [IO.Path]::DirectorySeparatorChar
  $fora = ''
  if ($pacote -ne $Raiz -and $pacote.StartsWith($Raiz + $sep)) { $fora = $pacote + $sep }
  $todos = @(Get-ChildItem -LiteralPath $Raiz -Recurse -File -Force -ErrorAction SilentlyContinue | Where-Object {
      $ignorar -notcontains $_.Name -and -not ($fora -and $_.FullName.StartsWith($fora)) })

  $inv = New-Object System.Collections.Generic.List[string]
  $inv.Add("Inventário da pasta de marketing - $(Get-Date -Format 'dd/MM/yyyy HH:mm')"); $inv.Add($Raiz); $inv.Add('')
  foreach ($pasta in (Get-ChildItem -LiteralPath $Raiz -Directory -Force | Sort-Object Name)) {
    if ($fora -and ($pasta.FullName + $sep) -eq $fora) { continue }
    $arqs = @($todos | Where-Object { $_.FullName.StartsWith($pasta.FullName + $sep) })
    $mb = [math]::Round((($arqs | Measure-Object Length -Sum).Sum) / 1MB, 1)
    $inv.Add(('{0}  ({1} arquivos, {2} MB)' -f $pasta.Name, $arqs.Count, $mb))
    foreach ($sub in (Get-ChildItem -LiteralPath $pasta.FullName -Directory -Force | Sort-Object Name)) {
      $n = @($arqs | Where-Object { $_.FullName.StartsWith($sub.FullName + $sep) }).Count
      $inv.Add(('    {0}  ({1} arquivos)' -f $sub.Name, $n))
    }
  }
  Gravar (Join-Path $comece 'Inventário.txt') $inv

  # repetidos: mesmo tamanho primeiro, depois a impressão digital (SHA-256)
  $rep = New-Object System.Collections.Generic.List[string]
  $rep.Add('Arquivos com conteúdo idêntico. Nada foi apagado: decida qual cópia manter.'); $rep.Add('')
  $grupos = 0
  foreach ($g in ($todos | Where-Object { $_.Length -gt 0 } | Group-Object Length | Where-Object { $_.Count -gt 1 })) {
    $comHash = foreach ($f in $g.Group) { try { [pscustomobject]@{ f = $f; h = (Get-FileHash -LiteralPath $f.FullName -Algorithm SHA256).Hash } } catch { } }
    foreach ($h in (@($comHash) | Group-Object h | Where-Object { $_.Count -gt 1 })) {
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

function Organizar {
  Passo-Nomes
  Passo-Pacote
  Passo-Estrutura
  Passo-Existentes
  Passo-Codex
}

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
  $registro.Clear(); $previstos.Clear(); $pastasPrevistas.Clear(); $movidos = 0; $falhas = 0; $sobra = ''
  $aplicando = $true
  Anotar "Pasta do marketing: $Raiz" 'Yellow'
  Organizar
}

$repetidos = 0
Passo-Relatorios
Anotar ''
if ($repetidos -eq 1) { $grupos = '1 grupo' } else { $grupos = "$repetidos grupos" }
Anotar "Pronto: $movidos itens movidos. Em ""$($P.comece)"" ficaram o Inventário, os Arquivos repetidos ($grupos) e o Registro do que foi feito." 'Green'
if ($falhas) { Anotar "$falhas itens não foram movidos (provavelmente estavam abertos). Feche os programas e rode de novo: o resto já está no lugar." 'Red' }
if ($sobra) { Anotar $sobra 'Yellow' }
Gravar (Join-Path (Join-Path $Raiz $P.comece) ("Registro da organização {0}.txt" -f (Get-Date -Format 'yyyy-MM-dd HH-mm'))) $registro
if ($env:OS -eq 'Windows_NT') { try { Start-Process -FilePath 'explorer.exe' -ArgumentList ('"{0}"' -f $Raiz) } catch { } }
