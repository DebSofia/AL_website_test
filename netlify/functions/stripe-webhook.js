// POST /api/stripe-webhook  (configurar no Stripe: checkout.session.completed
// e checkout.session.async_payment_succeeded)
// Guarda a reserva em Netlify Blobs -> passa a bloquear datas e a sair no calendar.ics.
const Stripe = require('stripe');
const { getStore, getBookedRanges } = require('./_shared/store');
const { overlaps } = require('./_shared/ical');
const { json } = require('./_shared/util');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') return json(405, { error: 'method' });
  if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET) return json(503, { error: 'not_configured' });

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const raw = event.isBase64Encoded ? Buffer.from(event.body, 'base64') : event.body; // corpo CRU para a assinatura
  let evt;
  try {
    evt = stripe.webhooks.constructEvent(raw, event.headers['stripe-signature'], process.env.STRIPE_WEBHOOK_SECRET);
  } catch (e) {
    console.warn('Assinatura inválida:', e.message);
    return json(400, { error: 'bad_signature' });
  }

  if (evt.type === 'checkout.session.completed' || evt.type === 'checkout.session.async_payment_succeeded') {
    const s = evt.data.object;
    if (s.payment_status !== 'paid') return json(200, { received: true, pending: true }); // aguarda pagamento assíncrono
    const m = s.metadata || {};
    const store = await getStore(event, 'bookings');
    if (await store.get(s.id)) return json(200, { received: true, duplicate: true }); // idempotente

    // Deteção de conflito (duas pessoas a pagar as mesmas datas ao mesmo tempo)
    const { ranges } = await getBookedRanges(event, { fresh: true });
    const conflict = overlaps(ranges, m.checkIn, m.checkOut);
    const booking = {
      id: s.id, status: 'confirmed', source: 'direct', conflict,
      checkIn: m.checkIn, checkOut: m.checkOut, guests: Number(m.guests), nights: Number(m.nights),
      name: m.name, phone: m.phone, email: s.customer_details && s.customer_details.email, message: m.message,
      amountTotal: s.amount_total, currency: s.currency, createdAt: new Date().toISOString()
    };
    await store.setJSON(s.id, booking);
    if (conflict) console.error('CONFLITO DE RESERVA - reembolsar manualmente no Stripe:', s.id, m.checkIn, m.checkOut);
    // Opcional: enviar email de notificação aqui (ver README, secção "Notificações por email").
  }
  return json(200, { received: true });
};
