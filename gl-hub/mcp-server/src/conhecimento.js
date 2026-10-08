// Carrega o conteúdo da GL Academy (cursos, transcrições e base de conhecimento)
// e monta um índice de busca em memória (BM25), sem dependências externas.

import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join, extname, basename } from 'node:path';

const STOPWORDS = new Set(
  ('a o e é de da do das dos em no na nos nas um uma uns umas para pra pro por com sem que se ' +
    'ao aos à às ou mas mais como qual quais quando onde porque porquê isso isto esse essa este esta ' +
    'eu tu ele ela nós vós eles elas você vocês meu minha seu sua nosso nossa ser estar ter ' +
    'foi era são está estão tem têm vai vamos já não sim muito muita bem então aí lá aqui ' +
    'sobre entre até também só me te lhe nos vos the and of to in').split(' ').map(normalizar)
);

export function normalizar(texto) {
  return String(texto)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '');
}

export function tokenizar(texto) {
  return normalizar(texto)
    .split(/[^a-z0-9]+/)
    .filter((t) => t.length > 1 && !STOPWORDS.has(t));
}

// "01:02:03.500", "02:03,5" ou "02:03" -> segundos
export function tempoParaSegundos(tempo) {
  const partes = tempo.trim().replace(',', '.').split(':').map(Number);
  return partes.reduce((total, parte) => total * 60 + parte, 0);
}

export function formatarTempo(segundos) {
  const s = Math.floor(segundos);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const ss = String(s % 60).padStart(2, '0');
  return h > 0 ? `${h}:${String(m).padStart(2, '0')}:${ss}` : `${m}:${ss}`;
}

// Aceita WebVTT (.vtt) e SubRip (.srt), que é o que qualquer ferramenta de transcrição exporta.
export function lerLegenda(conteudo) {
  const trechos = [];
  const blocos = conteudo.replace(/\r/g, '').split(/\n\s*\n/);
  for (const bloco of blocos) {
    const linhas = bloco.split('\n');
    const i = linhas.findIndex((l) => l.includes('-->'));
    if (i === -1) continue;
    const [inicio, fim] = linhas[i].split('-->').map((t) => t.trim().split(/\s+/)[0]);
    const texto = linhas
      .slice(i + 1)
      .join(' ')
      .replace(/<[^>]+>/g, '')
      .trim();
    if (texto) trechos.push({ inicio: tempoParaSegundos(inicio), fim: tempoParaSegundos(fim), texto });
  }
  return trechos;
}

// Junta as falas em janelas de ~60s para a busca devolver um trecho com contexto e o minuto certo.
function agruparTrechos(trechos, janela = 60) {
  const grupos = [];
  let atual = null;
  for (const t of trechos) {
    if (!atual || t.inicio - atual.inicio >= janela) {
      atual = { inicio: t.inicio, fim: t.fim, texto: t.texto };
      grupos.push(atual);
    } else {
      atual.fim = t.fim;
      atual.texto += ' ' + t.texto;
    }
  }
  return grupos;
}

// Os comentários HTML (<!-- PREENCHER ... -->) são notas para a equipe e não chegam ao Claude.
function lerFrontmatter(arquivo) {
  const markdown = arquivo.replace(/\r/g, '').replace(/<!--[\s\S]*?-->/g, '');
  const match = markdown.match(/^---\n([\s\S]*?)\n---\n?/);
  if (!match) return { meta: {}, corpo: markdown };
  const meta = {};
  for (const linha of match[1].split('\n')) {
    const i = linha.indexOf(':');
    if (i > 0) meta[linha.slice(0, i).trim()] = linha.slice(i + 1).trim().replace(/^["']|["']$/g, '');
  }
  return { meta, corpo: markdown.slice(match[0].length) };
}

// Divide o artigo pelas seções "## " para a busca apontar a parte certa.
function secoesDoArtigo(corpo) {
  const secoes = [];
  let atual = { titulo: null, texto: '' };
  for (const linha of corpo.split('\n')) {
    const h = linha.match(/^##\s+(.*)/);
    if (h) {
      if (atual.texto.trim()) secoes.push(atual);
      atual = { titulo: h[1].trim(), texto: '' };
    } else {
      atual.texto += linha + '\n';
    }
  }
  if (atual.texto.trim()) secoes.push(atual);
  return secoes;
}

// Monta o link do vídeo já no minuto certo (YouTube, Vimeo ou player genérico).
export function linkNoTempo(url, segundos) {
  if (!url) return null;
  const s = Math.floor(segundos || 0);
  if (s === 0) return url;
  if (/youtube\.com|youtu\.be/.test(url)) return `${url}${url.includes('?') ? '&' : '?'}t=${s}s`;
  if (/vimeo\.com/.test(url)) return `${url.split('#')[0]}#t=${s}s`;
  return `${url.split('#')[0]}#t=${s}`;
}

export function carregarConhecimento(pasta) {
  const cursos = [];
  const aulas = new Map();
  const artigos = new Map();
  const documentos = [];

  const arquivoCursos = join(pasta, 'cursos.json');
  if (existsSync(arquivoCursos)) {
    const dados = JSON.parse(readFileSync(arquivoCursos, 'utf8'));
    for (const curso of dados.cursos || []) {
      cursos.push(curso);
      for (const modulo of curso.modulos || []) {
        for (const aula of modulo.aulas || []) {
          const registro = {
            ...aula,
            curso: curso.titulo,
            curso_id: curso.id,
            modulo: modulo.titulo,
            exclusivo: Boolean(aula.exclusivo ?? curso.exclusivo),
            trechos: [],
          };
          if (aula.transcricao) {
            const caminho = join(pasta, 'transcricoes', aula.transcricao);
            if (existsSync(caminho)) registro.trechos = lerLegenda(readFileSync(caminho, 'utf8'));
            else console.warn(`[gl-hub] transcrição não encontrada: ${aula.transcricao}`);
          }
          aulas.set(aula.id, registro);

          documentos.push({
            tipo: 'aula',
            id: aula.id,
            titulo: aula.titulo,
            contexto: `${curso.titulo} › ${modulo.titulo}`,
            exclusivo: registro.exclusivo,
            inicio: 0,
            texto: [aula.titulo, aula.resumo, (aula.tags || []).join(' ')].filter(Boolean).join('. '),
          });
          for (const grupo of agruparTrechos(registro.trechos)) {
            documentos.push({
              tipo: 'aula',
              id: aula.id,
              titulo: aula.titulo,
              contexto: `${curso.titulo} › ${modulo.titulo}`,
              exclusivo: registro.exclusivo,
              inicio: grupo.inicio,
              texto: grupo.texto,
            });
          }
        }
      }
    }
  }

  const pastaBase = join(pasta, 'base');
  if (existsSync(pastaBase)) {
    for (const arquivo of readdirSync(pastaBase).sort()) {
      if (extname(arquivo) !== '.md') continue;
      const id = basename(arquivo, '.md');
      const { meta, corpo } = lerFrontmatter(readFileSync(join(pastaBase, arquivo), 'utf8'));
      const artigo = {
        id,
        titulo: meta.titulo || id,
        categoria: meta.categoria || 'geral',
        resumo: meta.resumo || '',
        exclusivo: ['sim', 'true'].includes(normalizar(meta.exclusivo || '')),
        corpo: corpo.trim(),
      };
      artigos.set(id, artigo);
      for (const secao of secoesDoArtigo(corpo)) {
        documentos.push({
          tipo: 'artigo',
          id,
          titulo: artigo.titulo,
          contexto: secao.titulo ? `${artigo.titulo} › ${secao.titulo}` : artigo.titulo,
          exclusivo: artigo.exclusivo,
          inicio: 0,
          texto: [secao.titulo, secao.texto].filter(Boolean).join('. '),
        });
      }
    }
  }

  return { cursos, aulas, artigos, indice: criarIndice(documentos) };
}

function criarIndice(documentos) {
  const docs = documentos.map((d) => {
    const tokens = tokenizar(`${d.titulo} ${d.texto}`);
    const freq = new Map();
    for (const t of tokens) freq.set(t, (freq.get(t) || 0) + 1);
    return { ...d, freq, tamanho: tokens.length };
  });
  const df = new Map();
  for (const d of docs) for (const t of d.freq.keys()) df.set(t, (df.get(t) || 0) + 1);
  const media = docs.reduce((s, d) => s + d.tamanho, 0) / (docs.length || 1);
  return { docs, df, media };
}

// BM25 clássico, com bônus quando o termo aparece no título.
// Conteúdo exclusivo só aparece para quem conectou com a chave de membro.
export function buscar(conhecimento, consulta, { limite = 8, tipo, membro = false } = {}) {
  const { docs, df, media } = conhecimento.indice;
  const termos = [...new Set(tokenizar(consulta))];
  if (termos.length === 0) return [];
  const N = docs.length;
  const k1 = 1.4;
  const b = 0.75;

  const resultados = [];
  for (const d of docs) {
    if (tipo && d.tipo !== tipo) continue;
    if (d.exclusivo && !membro) continue;
    let pontos = 0;
    for (const termo of termos) {
      const f = d.freq.get(termo);
      if (!f) continue;
      const idf = Math.log(1 + (N - df.get(termo) + 0.5) / (df.get(termo) + 0.5));
      pontos += idf * ((f * (k1 + 1)) / (f + k1 * (1 - b + (b * d.tamanho) / media)));
      if (normalizar(d.titulo).includes(termo)) pontos += idf * 0.5;
    }
    if (pontos > 0) resultados.push({ ...d, pontos });
  }

  resultados.sort((a, b2) => b2.pontos - a.pontos);

  // Evita devolver 5 trechos colados da mesma aula: no máximo 2 por fonte.
  const porFonte = new Map();
  const finais = [];
  for (const r of resultados) {
    const n = porFonte.get(r.id) || 0;
    if (n >= 2) continue;
    porFonte.set(r.id, n + 1);
    finais.push(r);
    if (finais.length >= limite) break;
  }
  return finais;
}
