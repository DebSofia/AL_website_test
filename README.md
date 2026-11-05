# Casa da Ribeira · Site de Alojamento Local

Site de uma página (HTML/CSS/JS puro, sem build) para alojamento local em Portugal, com calendário de disponibilidade, reservas diretas (Stripe) e sincronização de calendários com Airbnb e Booking.com através de iCal. Idiomas: PT-PT (por omissão) e EN.

A propriedade, os textos e os preços são **fictícios (placeholders)**. Substitua tudo em `config.js`.

## 1. O que é cada ficheiro

| Ficheiro | Função |
|---|---|
| `index.html` | Estrutura das 13 secções (hero, galeria, casa, comodidades, anfitriões, reserva, avaliações, arredores, parcerias, info, FAQ, contactos, rodapé) |
| `config.js` | **Único sítio para editar** nomes, textos PT/EN, preços, contactos, fotos, avaliações, POIs, parcerias, FAQ |
| `i18n.js` | Dicionário PT/EN dos textos fixos da interface e alternador de idioma |
| `main.js` | Renderização a partir do config, lightbox, carrossel, filtros, FAQ, cookies, SEO/JSON-LD |
| `booking.js` | Calendário, regras de estadia, cálculo de preço e envio da reserva |
| `styles.css` | Estilos (tokens de cor/tipografia no topo, em `:root`) |
| `privacidade.html`, `obrigado.html`, `reserva-cancelada.html`, `404.html` | Páginas auxiliares |
| `netlify.toml` | Redirecionamentos (`/api/*`, `/calendar.ics`), cabeçalhos |
| `netlify/functions/availability.js` | `GET /api/availability`: lê os iCal (Airbnb, Booking, extra) + reservas diretas e devolve as datas ocupadas (cache 5 min; pagamentos e pedidos leem sempre os calendários na hora) |
| `netlify/functions/create-checkout.js` | `POST /api/create-checkout`: revalida datas e preço no servidor e cria a sessão Stripe Checkout |
| `netlify/functions/stripe-webhook.js` | `POST /api/stripe-webhook`: ao receber o pagamento, grava a reserva (Netlify Blobs) |
| `netlify/functions/calendar-ics.js` | `GET /calendar.ics`: exporta as reservas diretas em iCal |
| `netlify/functions/booking-request.js` | `POST /api/booking-request`: guarda "pedidos de reserva" e mensagens de contacto (Blobs) |
| `netlify/functions/_shared/` | `pricing.js` (preços), `ical.js` (parser/gerador), `store.js` (Blobs + disponibilidade), `util.js` |
| `.env.example` | Lista das variáveis de ambiente |

**Opção escolhida para pedidos de reserva:** guardar em Netlify Blobs (em vez de Netlify Forms), porque é a mesma infraestrutura das reservas diretas, valida as datas no servidor e não precisa de configuração extra. Veja os pedidos em *Netlify > Blobs > requests* (ver "Limitações").

## 2. Personalizar

1. **Tudo em `config.js`**: `property` (nome, morada, coordenadas, RNAL, URL do site), `contact`, `social`, `external` (links Airbnb/Booking), `pricing`, `capacity`, `gallery`, `house`, `amenities`, `hosts`, `reviews`, `poi`, `partners`, `info`, `faq`. Textos `{ pt: '…', en: '…' }` ficam traduzidos.
2. **Fotos**: as imagens atuais são placeholders `picsum.photos` (função `photo()` no topo de `config.js`). Coloque as suas fotos em `/images` (ex.: `images/sala.jpg`) e troque os valores `src`/`thumb`/`image`/`heroImage`/`ogImage` por `'images/sala.jpg'`. Use JPG/WebP otimizados (largura 1600 px para a galeria, 1920 px para o hero). `ogImage` deve ser um URL absoluto (1200×630).
3. **Preços (atenção!)**: existem **duas** cópias, que têm de ser iguais:
   - `config.js` → `pricing` (só mostra o preço ao visitante);
   - `netlify/functions/_shared/pricing.js` → `PRICING` (**fonte de verdade**: o servidor recalcula e cobra sempre este valor).
   Se mudar um e esquecer o outro, o visitante vê um preço diferente do cobrado.
4. **Cores e tipo de letra**: variáveis em `:root` no topo de `styles.css`; fontes no `<link>` do `index.html`.
5. **SEO**: edite `<title>`, descrição e `og:*` em `index.html` (valores por omissão) e `property` em `config.js` (o JS atualiza meta tags e o JSON-LD `LodgingBusiness`). Atualize também `rel="canonical"` e o domínio.
6. **Privacidade**: reveja `privacidade.html` (texto-modelo!) e preencha NIF, morada, datas.
7. **Textos fixos da interface**: `i18n.js`.

Testar localmente sem funções: abra `index.html` (ou `npx serve .`). O calendário usa datas ocupadas de demonstração e mostra "modo demonstração"; os botões de pagar/pedir mostram uma mensagem em vez de erro. Para testar com funções: `npm install` e `npx netlify dev` (precisa de `.env`).

## 3. Publicar no Netlify (passo a passo)

1. Crie conta em netlify.com e coloque esta pasta num repositório Git (GitHub/GitLab) **ou** use *Add new site > Deploy manually* (arrastar a pasta; as funções só funcionam com deploy via Git ou CLI, por isso recomenda-se Git).
2. *Add new site > Import an existing project* e escolha o repositório. *Build command*: vazio. *Publish directory*: `.` (já definido em `netlify.toml`).
3. Em *Site configuration > Environment variables* crie as variáveis da tabela abaixo.
4. Faça *Deploy*. O Netlify instala `stripe` e `@netlify/blobs` automaticamente (via `package.json`).
5. Ligue o seu domínio em *Domain management* (HTTPS automático) e ajuste `SITE_URL`, `property.siteUrl` e o canonical.
6. Configure o webhook Stripe (secção 5) e importe `calendar.ics` nos portais (secção 4).

### Variáveis de ambiente

| Variável | Obrigatória | Descrição |
|---|---|---|
| `SITE_URL` | sim (pagamentos) | URL público, sem `/` final, ex.: `https://casadaribeira.pt` |
| `AIRBNB_ICAL_URL` | recomendada | Link iCal de exportação do Airbnb |
| `BOOKING_ICAL_URL` | recomendada | Link iCal de exportação do Booking.com |
| `EXTRA_ICAL_URLS` | não | Outros feeds, separados por vírgula |
| `STRIPE_SECRET_KEY` | para pagamentos | `sk_test_…` (testes) ou `sk_live_…` |
| `STRIPE_WEBHOOK_SECRET` | para pagamentos | `whsec_…` do webhook |
| `STRIPE_ENABLE_MBWAY` | não | `true` para oferecer MB WAY |
| `MANUAL_BLOCKS` | não | Bloqueios manuais, ex.: `[{"start":"2026-12-24","end":"2027-01-02","note":"Família"}]` (`end` = dia de saída) |
| `ICAL_EXPORT_TOKEN` | não | Se definido, o export fica em `/calendar.ics?token=…` |

## 4. Sincronização de calendários (anti-overbooking, nos dois sentidos)

```
 Airbnb / Booking  --(iCal de saída)-->  availability.js  --> calendário do site   (ENTRADA)
 Airbnb / Booking  <--(importam)-------  /calendar.ics    <-- reservas diretas     (SAÍDA)
```

**Entrada: portais → site.** Obtenha os links e coloque-os nas variáveis de ambiente:
- **Airbnb**: *Calendário > Disponibilidade > Sincronização de calendários > Exportar calendário* → copie o link `.ics` → `AIRBNB_ICAL_URL`.
- **Booking.com (extranet)**: *Tarifas e disponibilidade > Sincronizar calendários > Exportar calendário* → copie o URL → `BOOKING_ICAL_URL`.

**Saída: site → portais.** Use o URL `https://O-SEU-DOMINIO/calendar.ics` (com `?token=…` se definiu `ICAL_EXPORT_TOKEN`):
- **Airbnb**: *Sincronização de calendários > Importar calendário* → colar o URL e dar um nome.
- **Booking.com**: *Sincronizar calendários > Importar calendário* → colar o URL.

O `calendar.ics` contém **apenas reservas diretas** (e `MANUAL_BLOCKS`), nunca as dos portais, para evitar "ecos" entre calendários. O site verifica as datas outra vez no servidor antes de cobrar, e se algum feed iCal não puder ser lido recusa o pagamento por segurança.

> Os nomes dos menus mudam com frequência; se não encontrar, procure "sincronizar/exportar calendário" na ajuda de cada portal.

## 5. Stripe

1. Crie conta em stripe.com e ative-a (dados da empresa/IBAN). Comece em **modo de teste**.
2. *Developers > API keys*: copie a *Secret key* → `STRIPE_SECRET_KEY`.
3. *Developers > Webhooks > Add endpoint*: URL `https://O-SEU-DOMINIO/api/stripe-webhook`; eventos `checkout.session.completed` e `checkout.session.async_payment_succeeded`. Copie o *Signing secret* → `STRIPE_WEBHOOK_SECRET`. Faça novo deploy após alterar variáveis.
4. **MB WAY**: *Settings > Payment methods* e ative "MB WAY" (disponível para contas e clientes em Portugal, em EUR; confirme a disponibilidade na sua conta). Depois defina `STRIPE_ENABLE_MBWAY=true`. Se o método não estiver ativo na conta, a criação da sessão falha, por isso deixe `false` até ativar.
5. Teste com o cartão `4242 4242 4242 4242` (qualquer data futura e CVC). Verifique que a reserva aparece no calendário e em `/calendar.ics`.
6. Passe a chaves `live` (`sk_live_…`, novo webhook em modo live).

### Notificações por email (opcional, não incluído)
Em `stripe-webhook.js` (comentário no fim) e `booking-request.js` pode chamar uma API de email (Resend, Postmark, SendGrid) com `fetch`. O Stripe já envia recibo ao cliente (ative em *Settings > Customer emails*) e pode notificá-lo de cada pagamento.

## 6. Custos

- **Netlify**: o plano gratuito chega para um site pequeno (largura de banda, 125 mil pedidos/mês de funções e Blobs incluídos nos limites do plano; confirme os valores atuais em netlify.com/pricing).
- **Stripe**: sem mensalidade; comissão por transação (referência para cartões europeus ≈ 1,5 % + 0,25 €, cartões não europeus e MB WAY podem ter taxas diferentes). Confirme em stripe.com/pt/pricing.
- **Domínio**: ~10–15 €/ano. Airbnb/Booking cobram comissão só nas reservas feitas por eles.

## 7. Limitações

- **A sincronização iCal não é instantânea.** O Airbnb e o Booking atualizam os calendários importados a cada poucas horas (por vezes até 24 h), o calendário que os visitantes veem pode ter até 5 min de atraso, mas antes de cobrar ou aceitar um pedido o site lê o Airbnb e o Booking na hora (sem cache). Existe uma janela em que duas pessoas podem reservar as mesmas datas em canais diferentes. Mitigações: o site revalida antes de cobrar; o webhook marca `conflict: true` e regista erro nos *logs* se detetar sobreposição (deve reembolsar manualmente); use noites mínimas e períodos de preparação nos portais.
- Não há "reserva temporária" enquanto o cliente paga (a sessão Stripe não bloqueia as datas até ao pagamento).
- Os pedidos de reserva e a lista de reservas ficam em Netlify Blobs sem painel próprio: consulte-os na CLI/UI de Blobs do Netlify (ou adicione um email, ver secção 5).
- Reembolsos e cancelamentos são feitos manualmente no Stripe; para cancelar uma reserva direta, apague-a do store `bookings` (ou use `MANUAL_BLOCKS` apenas para bloqueios).
- Se o volume crescer, use um **channel manager** (Smoobu, Hostaway, Lodgify, etc.) com sincronização por API em tempo quase real, em vez de iCal.
- As reservas diretas só ficam guardadas após o pagamento (webhook); os "pedidos de reserva" ficam pendentes até confirmar manualmente, e não bloqueiam datas. Para bloquear, use `MANUAL_BLOCKS`.

## 8. Lembretes legais (Portugal)

Esta lista é informativa e não substitui aconselhamento jurídico/contabilístico.

- **RNAL**: o Nº de registo do Alojamento Local deve constar no site e em todos os anúncios (campo `property.rnal`).
- **Livro de Reclamações Eletrónico**: obrigatório; o link está no rodapé (livroreclamacoes.pt) e é preciso estar registado na plataforma.
- **Comunicação de hóspedes**: a comunicação ao SEF (agora AIMA/PSP) foi substituída pelo **SIBA** (Sistema de Informação de Boletins de Alojamento); os dados dos hóspedes têm de ser submetidos no prazo legal após a entrada (normalmente 3 dias úteis). Recolha os dados de identificação no check-in.
- **Taxa turística**: depende do município (ex.: Lisboa e Porto cobram; muitos municípios não). Ajuste ou desative em `touristTax` (nos **dois** ficheiros de preços) e na FAQ. Em geral aplica-se a maiores de 13 anos e a um máximo de noites.
- **Seguro** de responsabilidade civil obrigatório, **extintor**, **manta de incêndio** e **livro de reclamações** físico/eletrónico, conforme o regime do AL.
- **RGPD**: reveja a política de privacidade (`privacidade.html`) e o aviso de cookies; este site só usa armazenamento essencial. Fontes Google, mapas OpenStreetMap e imagens externas podem expor o IP do visitante; para evitar, aloje as fontes e imagens localmente.
- **Fiscalidade**: rendimentos de AL (categoria B/F), IVA, faturação e retenção são matéria para o seu contabilista.
