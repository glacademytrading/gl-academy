# GL Academy — Funil de agendamento (call 1x1)

Landing page em etapas que qualifica o trader e agenda a call estratégica gratuita.
Cada etapa envia o lead por e-mail (FormSubmit) para `glacademytrading@glacademytrading.com`.

## Links com origem (UTM)

Todo link que aponta para o funil deve dizer de qual pilar de marketing ele veio.
O pilar vai no `utm_medium`:

| Pilar | `utm_medium` | Exemplo de `utm_source` |
|---|---|---|
| Conteúdo | `conteudo` | `instagram`, `youtube`, `tiktok`, `linkedin`, `tradingview` |
| Tráfego pago | `pago` | `meta`, `google`, `youtube-ads` |
| Divulgação | `influenciador` ou `afiliado` | @ do parceiro |
| Imprensa | `imprensa` | nome do portal |
| Relações públicas | `rp`, `comunidade`, `parceria`, `evento` ou `indicacao` | `whatsapp-comunidade`, nome do parceiro |
| Vendas | `vendas` ou `prospeccao` | nome do vendedor |

Exemplo: `?utm_source=instagram&utm_medium=conteudo&utm_campaign=q4-2026&utm_content=reel-liquidez`

Parceiros e afiliados recebem também `&ref=CODIGO` para identificar quem indicou.
Links sem UTM são classificados pelo site de origem (Instagram, YouTube e buscadores contam como Conteúdo) ou ficam como "Não identificado".
A origem fica guardada no navegador por 30 dias, então quem volta direto ainda é atribuído ao pilar que o trouxe.

## O que chega em cada e-mail de lead

- **LeadID**: agrupa os e-mails parciais da mesma pessoa. Também é o código de indicação do botão "Convidar um amigo".
- **Prioridade**: `A` (contatar primeiro), `B` ou `C` (nutrir com conteúdo), somando experiência, capital, objetivo e agendamento.
- **Pilar, Origem, Mídia, Campanha, Peça, Termo, CodigoIndicacao, PrimeiroContato**: de onde o lead veio.
- **FusoHorario**: fuso do navegador de quem agendou, para leads fora do Brasil.

O assunto do e-mail termina com a prioridade, o pilar e o LeadID para triagem rápida na caixa de entrada.

## Pixel da Meta e Google Analytics 4

Preencha `META_PIXEL_ID` e/ou `GA4_ID` no topo de `script.js`. Vazios, nada é carregado.
Eventos enviados: `Lead` (dados de contato enviados), `Schedule` (call agendada) e, no GA4, `quiz_etapa` a cada etapa.
Antes de ativar, publique a política de privacidade e o aviso de cookies do site.
