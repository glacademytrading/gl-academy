import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { buscar, carregarConhecimento, lerLegenda, linkNoTempo, tempoParaSegundos } from '../src/conhecimento.js';

function criarConteudo() {
  const pasta = mkdtempSync(join(tmpdir(), 'gl-hub-'));
  mkdirSync(join(pasta, 'base'));
  mkdirSync(join(pasta, 'transcricoes'));
  writeFileSync(
    join(pasta, 'cursos.json'),
    JSON.stringify({
      cursos: [
        {
          id: 'c1',
          titulo: 'Curso aberto',
          modulos: [{ id: 'm1', titulo: 'M1', aulas: [{ id: 'a1', titulo: 'Candles', transcricao: 'a1.srt', video_url: 'https://vimeo.com/1' }] }],
        },
        {
          id: 'c2',
          titulo: 'Curso de membro',
          exclusivo: true,
          modulos: [{ id: 'm2', titulo: 'M2', aulas: [{ id: 'a2', titulo: 'Setup secreto', resumo: 'fibonacci avançado' }] }],
        },
      ],
    })
  );
  writeFileSync(join(pasta, 'transcricoes', 'a1.srt'), '1\n00:00:01,000 --> 00:00:05,000\nO candle de martelo\n\n2\n00:02:00,000 --> 00:02:10,000\nmostra rejeição de preço\n');
  writeFileSync(join(pasta, 'base', 'aberto.md'), '---\ntitulo: Volume\ncategoria: glossario\n---\n## Volume\nQuantidade negociada.\n<!-- PREENCHER: segredo interno -->\n');
  writeFileSync(join(pasta, 'base', 'fechado.md'), '---\ntitulo: Planilha\nexclusivo: sim\n---\n## Planilha\nPlanilha de fibonacci para membros.\n');
  return carregarConhecimento(pasta);
}

test('lê legendas SRT e VTT com tempo em segundos', () => {
  assert.deepEqual(lerLegenda('WEBVTT\n\n01:02.500 --> 01:04.000 align:start\n<v Fala>Oi</v>\n'), [{ inicio: 62.5, fim: 64, texto: 'Oi' }]);
  assert.equal(tempoParaSegundos('01:00:30,250'), 3630.25);
});

test('link do vídeo aponta para o minuto certo', () => {
  assert.equal(linkNoTempo('https://youtu.be/x', 90), 'https://youtu.be/x?t=90s');
  assert.equal(linkNoTempo('https://www.youtube.com/watch?v=x', 90), 'https://www.youtube.com/watch?v=x&t=90s');
  assert.equal(linkNoTempo('https://vimeo.com/1', 90), 'https://vimeo.com/1#t=90s');
  assert.equal(linkNoTempo('https://vimeo.com/1', 0), 'https://vimeo.com/1');
});

test('busca encontra o trecho da aula com o minuto, ignorando acentos', () => {
  const k = conteudoDeTeste();
  const [r] = buscar(k, 'rejeicao de preco');
  assert.equal(r.id, 'a1');
  assert.equal(r.inicio, 120);
});

test('conteúdo exclusivo só aparece para membro', () => {
  const k = conteudoDeTeste();
  assert.equal(buscar(k, 'fibonacci').length, 0);
  assert.deepEqual(buscar(k, 'fibonacci', { membro: true }).map((r) => r.id).sort(), ['a2', 'fechado']);
});

test('notas <!-- --> da equipe não entram na base', () => {
  const k = conteudoDeTeste();
  assert.ok(!k.artigos.get('aberto').corpo.includes('segredo'));
  assert.equal(buscar(k, 'segredo interno').length, 0);
});

let cache;
function conteudoDeTeste() {
  return (cache ??= criarConteudo());
}
