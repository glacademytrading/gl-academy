// Onde estão o Chromium (Playwright) e o ffmpeg. Use as variáveis PLAYWRIGHT e FFMPEG para trocar.
const fs = require('fs');
const IMAGEIO_FF = '/usr/local/lib/python3.11/dist-packages/imageio_ffmpeg/binaries/ffmpeg-linux-x86_64-v7.0.2';
const FF = process.env.FFMPEG || (fs.existsSync(IMAGEIO_FF) ? IMAGEIO_FF : 'ffmpeg');
function chromium() {
  for (const mod of [process.env.PLAYWRIGHT, 'playwright', '/opt/node22/lib/node_modules/playwright']) {
    if (!mod) continue;
    try { return require(mod).chromium; } catch (e) { /* tenta o próximo */ }
  }
  throw new Error('Playwright não encontrado: instale com "npm i playwright" ou defina PLAYWRIGHT');
}
// file:// precisa destas flags para o canvas ler os prints sem bloquear
const LAUNCH = { args: ['--allow-file-access-from-files', '--disable-web-security'] };
module.exports = { FF, chromium, LAUNCH };
