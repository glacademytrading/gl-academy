// Define o servidor MCP do GL Hub: as ferramentas que o Claude do aluno pode usar.

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { buscar, formatarTempo, linkNoTempo, tempoParaSegundos } from './conhecimento.js';

const LIMITE_TRANSCRICAO = 15000; // caracteres por chamada de ver_aula
const SOMENTE_LEITURA = { readOnlyHint: true, openWorldHint: false };

function texto(conteudo) {
  return { content: [{ type: 'text', text: conteudo }] };
}

function erro(mensagem) {
  return { content: [{ type: 'text', text: mensagem }], isError: true };
}

function recortar(str, max) {
  return str.length > max ? str.slice(0, max).trimEnd() + '…' : str;
}

const AVISO_EXCLUSIVO =
  'Este conteúdo é exclusivo para alunos da GL Academy. Para acessar, conecte o GL Hub com o seu link de membro ' +
  '(veja a página "Claude no GL Hub" na área do aluno) ou fale com o suporte.';

export function criarServidor({ conhecimento, instrucoes, membro, versao }) {
  const servidor = new McpServer({ name: 'gl-hub-academy', title: 'GL Hub Academy', version: versao }, { instructions: instrucoes });

  servidor.registerTool(
    'buscar',
    {
      title: 'Buscar nas aulas e na base da GL Academy',
      description:
        'Busca em tudo que a GL Academy ensina: transcrições das aulas (com o minuto exato) e artigos da base de conhecimento ' +
        '(produtos, método, glossário, regras da comunidade, suporte). Use SEMPRE antes de responder qualquer dúvida sobre ' +
        'trading, o método GL ou os produtos da GL Academy. Faça a busca com as palavras-chave do assunto, em português.',
      inputSchema: {
        pergunta: z.string().min(2).describe('Assunto ou palavras-chave. Ex.: "gestão de risco stop", "o que é o GL Model".'),
        tipo: z.enum(['aula', 'artigo']).optional().describe('Restringe a busca a aulas ou a artigos. Omita para buscar em tudo.'),
        limite: z.number().int().min(1).max(20).optional().describe('Máximo de resultados (padrão 8).'),
      },
      annotations: SOMENTE_LEITURA,
    },
    async ({ pergunta, tipo, limite }) => {
      const resultados = buscar(conhecimento, pergunta, { tipo, limite: limite ?? 8, membro });
      if (resultados.length === 0) {
        return texto(
          `Nada encontrado para "${pergunta}". Tente outras palavras-chave. Se o assunto não estiver na base, ` +
            'diga isso ao aluno com transparência e sugira falar com o suporte da GL Academy (artigo "suporte").'
        );
      }
      const linhas = resultados.map((r, i) => {
        if (r.tipo === 'aula') {
          const aula = conhecimento.aulas.get(r.id);
          const link = linkNoTempo(aula.video_url, r.inicio);
          return [
            `${i + 1}. [AULA] ${r.titulo} (aula_id: ${r.id})`,
            `   Onde: ${r.contexto}`,
            `   Minuto: ${formatarTempo(r.inicio)}${link ? `  ·  Assistir: ${link}` : ''}`,
            `   Trecho: "${recortar(r.texto, 600)}"`,
          ].join('\n');
        }
        return [
          `${i + 1}. [ARTIGO] ${r.contexto} (artigo_id: ${r.id})`,
          `   Trecho: ${recortar(r.texto.replace(/\s+/g, ' '), 600)}`,
        ].join('\n');
      });
      return texto(
        `${resultados.length} resultado(s) para "${pergunta}":\n\n${linhas.join('\n\n')}\n\n` +
          'Para aprofundar, use ver_aula (com a_partir_de no minuto indicado) ou ler_artigo.'
      );
    }
  );

  servidor.registerTool(
    'listar_cursos',
    {
      title: 'Listar cursos e aulas',
      description: 'Mostra a grade da GL Academy: cursos, módulos e aulas, com os ids para usar em ver_aula. Use para montar trilhas e planos de estudo.',
      inputSchema: {
        curso_id: z.string().optional().describe('Id de um curso para ver só ele. Omita para ver todos.'),
      },
      annotations: SOMENTE_LEITURA,
    },
    async ({ curso_id }) => {
      const cursos = curso_id ? conhecimento.cursos.filter((c) => c.id === curso_id) : conhecimento.cursos;
      if (cursos.length === 0) return erro(`Curso "${curso_id}" não encontrado. Chame listar_cursos sem argumentos para ver os ids.`);
      const saida = cursos.map((curso) => {
        const modulos = (curso.modulos || []).map((m) => {
          const aulas = (m.aulas || []).map((a) => {
            const reg = conhecimento.aulas.get(a.id);
            const cadeado = reg.exclusivo && !membro ? ' 🔒 exclusivo' : '';
            const duracao = a.duracao ? ` · ${a.duracao}` : '';
            return `    - ${a.titulo} (aula_id: ${a.id}${duracao})${cadeado}`;
          });
          return [`  Módulo: ${m.titulo}`, ...aulas].join('\n');
        });
        return [`CURSO: ${curso.titulo} (curso_id: ${curso.id})`, curso.descricao ? `  ${curso.descricao}` : null, ...modulos]
          .filter(Boolean)
          .join('\n');
      });
      return texto(saida.join('\n\n'));
    }
  );

  servidor.registerTool(
    'ver_aula',
    {
      title: 'Ver aula e transcrição',
      description:
        'Abre uma aula: resumo, link do vídeo e a transcrição com marcação de tempo. Use a_partir_de para ler a partir do minuto ' +
        'que a busca indicou. Ao responder, cite o minuto e mande o link do vídeo já no ponto certo.',
      inputSchema: {
        aula_id: z.string().describe('Id da aula (vem de buscar ou listar_cursos).'),
        a_partir_de: z.string().optional().describe('Ponto de início no formato mm:ss ou hh:mm:ss. Ex.: "12:30".'),
      },
      annotations: SOMENTE_LEITURA,
    },
    async ({ aula_id, a_partir_de }) => {
      const aula = conhecimento.aulas.get(aula_id);
      if (!aula) return erro(`Aula "${aula_id}" não encontrada. Use buscar ou listar_cursos para achar o id certo.`);
      if (aula.exclusivo && !membro) return erro(AVISO_EXCLUSIVO);

      const inicio = a_partir_de ? tempoParaSegundos(a_partir_de) : 0;
      if (Number.isNaN(inicio)) return erro('Formato de tempo inválido. Use mm:ss ou hh:mm:ss.');

      const cabecalho = [
        `AULA: ${aula.titulo}`,
        `Curso: ${aula.curso} › ${aula.modulo}`,
        aula.duracao ? `Duração: ${aula.duracao}` : null,
        aula.resumo ? `Resumo: ${aula.resumo}` : null,
        aula.video_url ? `Assistir${inicio ? ` a partir de ${formatarTempo(inicio)}` : ''}: ${linkNoTempo(aula.video_url, inicio)}` : null,
        aula.materiais?.length ? `Materiais: ${aula.materiais.map((m) => `${m.titulo} (${m.url})`).join(' · ')}` : null,
      ].filter(Boolean);

      if (aula.trechos.length === 0) {
        return texto(`${cabecalho.join('\n')}\n\n(Esta aula ainda não tem transcrição cadastrada.)`);
      }

      let corpo = '';
      let ultimo = null;
      for (const t of aula.trechos) {
        if (inicio > 0 && t.fim <= inicio) continue;
        const linha = `[${formatarTempo(t.inicio)}] ${t.texto}\n`;
        if (corpo.length + linha.length > LIMITE_TRANSCRICAO) {
          ultimo = t.inicio;
          break;
        }
        corpo += linha;
      }
      const continuar = ultimo !== null ? `\n(Transcrição continua. Chame ver_aula com a_partir_de "${formatarTempo(ultimo)}" para ler o resto.)` : '';
      return texto(`${cabecalho.join('\n')}\n\nTRANSCRIÇÃO:\n${corpo}${continuar}`);
    }
  );

  servidor.registerTool(
    'ler_artigo',
    {
      title: 'Ler artigo da base de conhecimento',
      description:
        'Lê um artigo completo da base de conhecimento da GL Academy (produtos, método, glossário, comunidade, suporte). ' +
        'Sem artigo_id, devolve o índice de todos os artigos por categoria.',
      inputSchema: {
        artigo_id: z.string().optional().describe('Id do artigo (vem de buscar). Omita para ver o índice.'),
      },
      annotations: SOMENTE_LEITURA,
    },
    async ({ artigo_id }) => {
      if (!artigo_id) {
        const porCategoria = new Map();
        for (const a of conhecimento.artigos.values()) {
          if (a.exclusivo && !membro) continue;
          if (!porCategoria.has(a.categoria)) porCategoria.set(a.categoria, []);
          porCategoria.get(a.categoria).push(`  - ${a.titulo} (artigo_id: ${a.id})${a.resumo ? `: ${a.resumo}` : ''}`);
        }
        const saida = [...porCategoria].map(([cat, itens]) => `${cat.toUpperCase()}\n${itens.join('\n')}`);
        return texto(saida.join('\n\n') || 'A base de conhecimento ainda está vazia.');
      }
      const artigo = conhecimento.artigos.get(artigo_id);
      if (!artigo) return erro(`Artigo "${artigo_id}" não encontrado. Chame ler_artigo sem argumentos para ver o índice.`);
      if (artigo.exclusivo && !membro) return erro(AVISO_EXCLUSIVO);
      return texto(`# ${artigo.titulo}\n\n${artigo.corpo}`);
    }
  );

  servidor.registerPrompt(
    'mentor_gl',
    {
      title: 'Mentor GL Academy',
      description: 'Começa uma conversa de mentoria: o Claude entende seu momento como trader e monta um plano de estudo com as aulas da GL.',
      argsSchema: {
        objetivo: z.string().optional().describe('O que você quer destravar agora. Ex.: "parar de operar no emocional".'),
      },
    },
    ({ objetivo }) => ({
      messages: [
        {
          role: 'user',
          content: {
            type: 'text',
            text:
              'Quero uma mentoria com base no que a GL Academy ensina. ' +
              (objetivo ? `Meu objetivo agora: ${objetivo}. ` : '') +
              'Me faça no máximo 3 perguntas rápidas sobre meu momento (experiência, mercado que opero, maior dificuldade), ' +
              'depois use listar_cursos e buscar para montar um plano de estudo da semana com as aulas certas, ' +
              'citando aula, minuto e link de cada uma.',
          },
        },
      ],
    })
  );

  return servidor;
}
