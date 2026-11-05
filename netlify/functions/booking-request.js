// POST /api/booking-request
//  - type "reservation" (por omissão): pedido de reserva (pagar depois por transferência)
//  - type "contact": mensagem do formulário de contactos
// Opção escolhida: guardar em Netlify Blobs (já usado no projeto, sem configuração extra).
// Ver os pedidos: painel Netlify > Blobs > "requests". Notificação por email: ver README.
const { getStore, getBookedRanges } = require('./_shared/store');
const { overlaps } = require('./_shared/ical');
const { json, clip, EMAIL_RE, parseBody, validateBooking } = require('./_shared/util');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') return json(405, { error: 'method' });
  const body = parseBody(event);
  if (!body) return json(400, { error: 'invalid' });
  const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  let record;

  if (body.type === 'contact') {
    if (body.website) return json(200, { ok: true }); // honeypot
    const r = { name: clip(body.name, 120), email: clip(body.email, 160), message: clip(body.message, 2000) };
    if (r.name.length < 2 || !EMAIL_RE.test(r.email) || r.message.length < 5 || body.consent !== true) return json(400, { error: 'invalid' });
    record = { id, type: 'contact', ...r, createdAt: new Date().toISOString() };
  } else {
    const v = validateBooking(body);
    if (v.error) return json(v.error === 'spam' ? 200 : 400, { error: v.error, minNights: v.minNights });
    const { ranges } = await getBookedRanges(event, { fresh: true });
    if (overlaps(ranges, v.data.checkIn, v.data.checkOut)) return json(409, { error: 'dates_unavailable' });
    record = { id, type: 'reservation', status: 'pending', ...v.data, quoted: v.price, createdAt: new Date().toISOString() };
  }

  try {
    const store = await getStore(event, 'requests');
    await store.setJSON(id, record);
    return json(200, { ok: true, id });
  } catch (e) {
    console.error('Blobs:', e.message);
    return json(500, { error: 'server' });
  }
};
