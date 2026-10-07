---
name: certificar
description: Emite laudo de auditoria e registro de certificação sobre um objeto real (por exemplo, operação, aluno ou estratégia, conforme o curso definir), seguindo a rubrica em auditoria/certificacao/rubrica.md e o ciclo de perguntas. Use quando o usuário pedir para auditar, avaliar, aprovar, reprovar ou certificar algo segundo a metodologia GL.
---

# Certificar

## Pré-condições (se falhar alguma, pare e diga qual)
- A rubrica (`auditoria/certificacao/rubrica.md`) não está em versão 0.x. Com rubrica em rascunho,
  só emita **laudo** marcado "não oficial", nunca uma certificação.
- O tipo de objeto está definido no curso ou em `decisoes.md`.
- `python3 auditoria/ferramentas/validar.py` está sem erros (a base está íntegra).

## Passos
1. **Receber o objeto.** Se veio como arquivo, guarde-o fora de `00_inbox` (não é material de curso);
   use `auditoria/certificacao/registros/anexos/`. Minimize dados pessoais: `objeto_id` é um identificador,
   não um nome completo, salvo se o usuário pedir.
2. **Ciclo de perguntas** (skill `perguntas-do-auditor`, modo A). Isso define as regras aplicáveis e
   a evidência de cada uma.
3. **Achados**: um por regra aplicável, com `conformidade`, `severidade` (a da regra), `evidencia`
   (trecho do objeto) e `fundamento` (FONTE @ loc da regra).
4. **Rubrica**: pontue cada critério CR-xx só com base nos achados. Aplique primeiro as eliminatórias,
   depois os limiares.
5. **Veredito e decisão**:
   - `inconclusivo` quando faltar evidência mínima de regra crítica ou eliminatória;
   - `pendente_revisao_humana` quando a confiança estiver abaixo do limiar, o veredito for inconclusivo
     ou houver contradição aberta afetando o caso;
   - `confianca` reflete as lacunas e as regras `inferido` usadas (regra inferida nunca reprova sozinha).
6. **Registro**: `auditoria/certificacao/registros/CERT-AAAA-NNNN.json` conforme
   `schemas/certificacao.schema.json`, com `versao_base` = `git rev-parse --short HEAD` e `rubrica_versao`.
7. `validar.py`, uma linha no `diario.md`, commit e push.
8. **Resposta ao usuário**: veredito, os 3–5 achados que mais pesaram (com evidência), lacunas e o que
   faria o resultado mudar.

## Retroalimentação (toda certificação ensina algo)
- O caso revelou ambiguidade numa regra? Abra `X-xxxx` ou pergunte ao usuário.
- O usuário discordou do veredito? Registre a decisão `D-xxxx`, corrija a regra ou pergunta causadora e
  transforme o caso (anonimizado) em **caso de benchmark** com o gabarito corrigido. Discordâncias
  humanas são os casos mais valiosos que existem.
- Caso real interessante, mesmo sem discordância: candidato a benchmark (com autorização do usuário).
  Um caso real nunca vira exemplo de dataset **e** de benchmark ao mesmo tempo.
