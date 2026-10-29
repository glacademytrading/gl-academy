#!/bin/bash
# Compõe os vídeos de lote.txt que ainda não existem. Uso: bash lote.sh <pasta hf> <pasta limpos> <pasta saída> [paralelo] [filtro, ex.: c2]
# Cada vídeo é conferido na hora de começar e sai primeiro como .parte, então dá para rodar mais de um lote ao mesmo tempo.
HF=$1; LP=$2; OUT=$3; N=${4:-3}; PAD=${5:-.}; cd "$(dirname "$0")"; mkdir -p "$OUT"
grep -v "^#" lote.txt | grep -E "^$PAD" | xargs -P "$N" -L 1 bash -c '
  o=$0; v=$1; c=$2; shift 2; out='"$OUT"'/$o.mp4
  [ -f '"$HF"'/$v.mp4 ] && [ ! -f $out ] && [ ! -f $out.parte ] || exit 0
  : > $out.parte; pr=""; for x in "$@"; do pr="$pr '"$LP"'/$x.png"; done
  if python3 compor.py $c '"$HF"'/$v.mp4 $out.tmp.mp4 $pr > /dev/null 2> '"$OUT"'/$o.log; then mv $out.tmp.mp4 $out; rm -f '"$OUT"'/$o.log; echo feito $o; fi
  rm -f $out.parte'
