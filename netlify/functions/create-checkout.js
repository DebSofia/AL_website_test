// POST /api/create-checkout -> { url }  (Stripe Checkout)
// Revalida as datas e recalcula o preço NO SERVIDOR; nunca confia no front-end.
const Stripe = require('stripe');
const { getBookedRanges } = require('./_shared/store');
const { overlaps } = require('./_shared/ical');
const { json, parseBody, validateBooking, PRICING } = require('./_shared/util');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') return json(405, { error: 'method' });
  if (!process.env.STRIPE_SECRET_KEY) return json(503, { error: 'payments_disabled' });

  const v = validateBooking(parseBody(event));
  if (v.error) return json(v.error === 'spam' ? 200 : 400, { error: v.error, minNights: v.minNights });
  const { data, price } = v;

  // 1) Disponibilidade (falha "fechada" se algum feed não puder ser lido)
  const { ranges, failed } = await getBookedRanges(event, { fresh: true });
  if (failed > 0) return json(503, { error: 'availability_unavailable' });
  if (overlaps(ranges, data.checkIn, data.checkOut)) return json(409, { error: 'dates_unavailable' });

  // 2) Sessão Stripe
  const site = (process.env.SITE_URL || process.env.URL || '').replace(/\/$/, '');
  if (!site) return json(500, { error: 'server' });
  const en = data.lang === 'en';
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const methods = ['card'];
  if (process.env.STRIPE_ENABLE_MBWAY === 'true') methods.push('mb_way');
  const item = (name, amount) => ({ quantity: 1, price_data: { currency: PRICING.currency, unit_amount: amount, product_data: { name } } });
  const label = `${data.checkIn} → ${data.checkOut}`;
  const items = [item(`${en ? 'Stay' : 'Estadia'} · ${price.nights} ${en ? 'nights' : 'noites'} (${label})`, price.accommodation)];
  if (price.cleaning) items.push(item(en ? 'Cleaning fee' : 'Taxa de limpeza', price.cleaning));
  if (price.touristTax) items.push(item(en ? 'Tourist tax' : 'Taxa turística', price.touristTax));

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: methods,
      line_items: items,
      customer_email: data.email,
      locale: en ? 'en' : 'pt',
      success_url: `${site}/obrigado.html?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${site}/reserva-cancelada.html`,
      metadata: {
        checkIn: data.checkIn, checkOut: data.checkOut, guests: String(data.guests), nights: String(price.nights),
        name: data.name, phone: data.phone, message: data.message.slice(0, 450), lang: data.lang
      }
    });
    return json(200, { url: session.url });
  } catch (e) {
    console.error('Stripe:', e.message);
    return json(502, { error: 'payment_error' });
  }
};
