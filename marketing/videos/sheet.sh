#!/bin/bash
# Folha de contato: ./sheet.sh saida.jpg largura colunas img1 img2 ...
FF=${FFMPEG:-/usr/local/lib/python3.11/dist-packages/imageio_ffmpeg/binaries/ffmpeg-linux-x86_64-v7.0.2}
[ -x "$FF" ] || FF=ffmpeg
out=$1; w=$2; cols=$3; shift 3
n=$#; rows=$(( (n + cols - 1) / cols ))
inputs=(); filt=""; i=0
for f in "$@"; do inputs+=(-i "$f"); filt+="[$i:v]scale=${w}:-2,setsar=1[s$i];"; i=$((i+1)); done
# completa a grade com quadros pretos do mesmo tamanho
pad=$(( rows * cols - n ))
chain=""; for ((k=0;k<n;k++)); do chain+="[s$k]"; done
if [ $pad -gt 0 ]; then filt+="[s0]split=$((pad+1))[s0x]"; for ((k=0;k<pad;k++)); do filt+="[b$k]"; done; filt+=";"; chain="[s0x]"; for ((k=1;k<n;k++)); do chain+="[s$k]"; done; for ((k=0;k<pad;k++)); do filt+="[b$k]drawbox=c=black:t=fill[bb$k];"; chain+="[bb$k]"; done; fi
filt+="${chain}xstack=inputs=$((n+pad)):grid=${cols}x${rows}[o]"
"$FF" -y -loglevel error "${inputs[@]}" -filter_complex "$filt" -map "[o]" -q:v 4 "$out"
