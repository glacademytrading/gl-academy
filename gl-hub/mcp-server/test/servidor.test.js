import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { once } from 'node:events';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js';

const PORTA = 3471;
const base = `http://localhost:${PORTA}`;
let processo;

before(async () => {
  processo = spawn(process.execPath, ['src/index.js'], { env: { ...process.env, PORT: String(PORTA), GL_HUB_CHAVES: 'abc123' } });
  await once(processo.stdout, 'data');
});
after(() => processo.kill());

async function conectar(url, headers) {
  const cliente = new Client({ name: 'teste', version: '1' });
  await cliente.connect(new StreamableHTTPClientTransport(new URL(url), { requestInit: { headers } }));
  return cliente;
}

test('expõe as ferramentas e as instruções do mentor', async () => {
  const c = await conectar(`${base}/mcp`);
  assert.match(c.getInstructions(), /GL Academy/);
  const nomes = (await c.listTools()).tools.map((t) => t.name).sort();
  assert.deepEqual(nomes, ['buscar', 'ler_artigo', 'listar_cursos', 'ver_aula']);
  const r = await c.callTool({ name: 'buscar', arguments: { pergunta: 'limite de perda diária' } });
  assert.match(r.content[0].text, /Minuto: 2:20/);
  await c.close();
});

test('aceita chave de membro por header ou pela URL e recusa chave inválida', async () => {
  for (const [url, headers] of [[`${base}/mcp`, { Authorization: 'Bearer abc123' }], [`${base}/mcp?chave=abc123`, {}]]) {
    const c = await conectar(url, headers);
    await c.close();
  }
  const res = await fetch(`${base}/mcp?chave=errada`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: '{}' });
  assert.equal(res.status, 401);
});
