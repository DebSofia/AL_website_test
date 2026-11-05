// Utilitários comuns às funções.
const { computePrice, PRICING } = require('./pricing');

const json = (statusCode, body, headers = {}) => ({
  statusCode,
  headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', ...headers },
  body: JSON.stringify(body)
});

const clip = (v, n) => String(v == null ? '' : v).trim().slice(0, n);
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function parseBody(event) {
  try { return JSON.parse(event.body || '{}'); } catch { return null; }
}

/** Valida e limpa os dados de reserva. Devolve { error } ou { data, price }. */
function validateBooking(b) {
  if (!b || typeof b !== 'object') return { error: 'invalid' };
  if (b.website) return { error: 'spam' }; // honeypot
  const data = {
    checkIn: clip(b.checkIn, 10), checkOut: clip(b.checkOut, 10), guests: Number(b.guests),
    name: clip(b.name, 120), email: clip(b.email, 160), phone: clip(b.phone, 40),
    message: clip(b.message, 1000), lang: b.lang === 'en' ? 'en' : 'pt'
  };
  if (data.name.length < 2 || !EMAIL_RE.test(data.email) || data.phone.length < 6 || b.consent !== true) return { error: 'invalid' };
  const price = computePrice(data.checkIn, data.checkOut, data.guests);
  if (price.error) return { error: price.error, minNights: price.minNights };
  return { data, price };
}

module.exports = { json, clip, EMAIL_RE, parseBody, validateBooking, PRICING };
