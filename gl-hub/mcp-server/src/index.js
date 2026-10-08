// Servidor HTTP do conector GL Hub Academy (MCP via Streamable HTTP, sem estado).
//
// Variáveis de ambiente:
//   PORT              porta HTTP (padrão 3333)
//   GL_HUB_CONTEUDO   pasta do conteúdo (padrão ../../conteudo)
//   GL_HUB_CHAVES     chaves de membro separadas por vírgula. Quem conecta com uma chave válida
//                     vê também o conteúdo exclusivo; sem chave, só o conteúdo aberto.

import express from 'express';
import { createHash, timingSafeEqual } from 'node:crypto';
import { readFileSync, existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import { carregarConhecimento } from './conhecimento.js';
import { criarServidor } from './servidor.js';

const aqui = dirname(fileURLToPath(import.meta.url));
const { version: versao } = JSON.parse(readFileSync(join(aqui, '..', 'package.json'), 'utf8'));
const pastaConteudo = resolve(process.env.GL_HUB_CONTEUDO || join(aqui, '..', '..', 'conteudo'));

const conhecimento = carregarConhecimento(pastaConteudo);
const arquivoInstrucoes = join(pastaConteudo, 'instrucoes.md');
const instrucoes = existsSync(arquivoInstrucoes) ? readFileSync(arquivoInstrucoes, 'utf8') : undefined;

const hash = (s) => createHash('sha256').update(s).digest();
const chaves = (process.env.GL_HUB_CHAVES || '')
  .split(',')
  .map((c) => c.trim())
  .filter(Boolean)
  .map(hash);

function chaveValida(chave) {
  const h = hash(chave);
  return chaves.some((c) => timingSafeEqual(c, h));
}

// Aceita "Authorization: Bearer <chave>" (Claude Code) ou "?chave=<chave>" na URL (claude.ai),
// já que o campo de conector custom do claude.ai só recebe a URL.
function identificar(req) {
  const auth = req.get('authorization') || '';
  const chave = auth.startsWith('Bearer ') ? auth.slice(7).trim() : req.query.chave;
  if (!chave) return { membro: false };
  if (typeof chave !== 'string' || !chaveValida(chave)) return { invalida: true };
  return { membro: true };
}

const app = express();
app.disable('x-powered-by');
app.use(express.json({ limit: '1mb' }));

app.get('/', (_req, res) => {
  res.type('text/plain').send('GL Hub Academy — conector MCP. Adicione esta URL + /mcp no Claude.');
});

app.get('/saude', (_req, res) => {
  res.json({
    ok: true,
    versao,
    cursos: conhecimento.cursos.length,
    aulas: conhecimento.aulas.size,
    artigos: conhecimento.artigos.size,
  });
});

app.post('/mcp', async (req, res) => {
  const quem = identificar(req);
  if (quem.invalida) {
    res.status(401).json({ jsonrpc: '2.0', error: { code: -32001, message: 'Chave de membro inválida ou revogada.' }, id: null });
    return;
  }

  const servidor = criarServidor({ conhecimento, instrucoes, membro: quem.membro, versao });
  const transporte = new StreamableHTTPServerTransport({ sessionIdGenerator: undefined });
  res.on('close', () => {
    transporte.close();
    servidor.close();
  });

  try {
    await servidor.connect(transporte);
    await transporte.handleRequest(req, res, req.body);
  } catch (e) {
    console.error('[gl-hub] erro ao processar requisição MCP:', e);
    if (!res.headersSent) {
      res.status(500).json({ jsonrpc: '2.0', error: { code: -32603, message: 'Erro interno do servidor.' }, id: null });
    }
  }
});

// Modo sem estado: não há stream GET nem encerramento de sessão.
const metodoNaoPermitido = (_req, res) =>
  res.status(405).json({ jsonrpc: '2.0', error: { code: -32000, message: 'Método não permitido.' }, id: null });
app.get('/mcp', metodoNaoPermitido);
app.delete('/mcp', metodoNaoPermitido);

const porta = Number(process.env.PORT) || 3333;
app.listen(porta, () => {
  console.log(
    `[gl-hub] v${versao} ouvindo em http://localhost:${porta}/mcp · ` +
      `${conhecimento.cursos.length} curso(s), ${conhecimento.aulas.size} aula(s), ${conhecimento.artigos.size} artigo(s) · ` +
      `${chaves.length} chave(s) de membro`
  );
});
