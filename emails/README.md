# E-mails automáticos (GL Club IA)

Modelos em HTML com estilos inline, prontos para colar na ferramenta de e-mail (Resend, Brevo, ActiveCampaign, a própria plataforma de pagamento etc.).
As variáveis entre `{{ }}` são preenchidas pela ferramenta.

| Arquivo | Quando dispara | Variáveis |
|---|---|---|
| `01-boas-vindas-ativacao.html` | Compra aprovada | nome, email, link_ativacao, dominio_area_membros, whatsapp_suporte |
| `02-codigo-verificacao.html` | Aluno pede o código na tela de ativação | codigo |
| `03-live-comecando.html` | Início da live, para todos os inscritos | nome, titulo_live, link_live, thumb_live |
| `04-cancelamento.html` | Assinatura cancelada | nome, codigo_assinatura, data_compra, data_fim_acesso, link_pesquisa_cancelamento, link_reativar |

Todos usam `link_descadastro` no rodapé. Ele é obrigatório para e-mails de marketing, como o aviso de live.
