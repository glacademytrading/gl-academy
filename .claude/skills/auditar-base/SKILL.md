---
name: auditar-base
description: Auditoria periódica da própria base de conhecimento da IA Auditora: integridade, lacunas de cobertura, regras não verificáveis, perguntas inúteis, contradições abertas, regras inferidas pendentes e exemplos desatualizados. Use depois de cada lote de absorção, antes de exportar dataset, antes de uma execução oficial de benchmark, ou quando o usuário perguntar o estado da base.
---

# Auditar a base

A auditora precisa ser auditada. Esta é a repetição que mantém o sistema honesto.

## 1. Mecânico
```bash
python3 auditoria/ferramentas/validar.py --estrito
python3 auditoria/ferramentas/cobertura.py
```
Erros se corrigem agora. Avisos viram itens do relatório.

## 2. Semântico (leitura, não script)
Para cada item, responda e anote a evidência:
- **Fontes**: toda fonte `recebido` foi extraída? Toda `extraido` foi consolidada? A extração cobre 100%?
- **Regras**: alguma é vaga demais para verificar? Alguma duplica outra com outras palavras? Alguma
  `inferido` está há mais de um lote sem confirmação? Alguma contradiz uma decisão D-xxxx?
- **Perguntas**: alguma não muda veredito? Alguma regra só tem semente e nenhuma pergunta do curso?
  O NÚCLEO ainda reflete o que o curso considera universal?
- **Erros comuns**: todos têm `parecido_mas_correto`?
- **Contradições**: quantas abertas, e há quanto tempo?
- **Benchmark**: distribuição equilibrada? Regras críticas com armadilha e caso de evidência
  insuficiente? Quantos revisados?
- **Dataset**: exemplos com `versao_base` anterior à última mudança das regras que citam? Desequilíbrio
  de tipo ou resultado? Taxa de rejeição do último lote?
- **Coerência entre produtos**: o prompt de sistema do dataset é o mesmo usado no benchmark? A rubrica
  usa regras que ainda existem?

## 3. Relatório
Curto, nesta ordem:
1. **Bloqueios** (impedem exportar, certificar ou rodar o benchmark oficial).
2. **Perguntas ao usuário**, numeradas e respondíveis com uma frase cada.
3. **Ações que eu mesmo vou fazer** (geração para lacunas, correções).
4. Números: fontes, regras, perguntas, casos, exemplos, cobertura.

Registre no diário. Itens resolvidos pelo usuário viram D-xxxx.
