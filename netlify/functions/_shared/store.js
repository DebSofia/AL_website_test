// Persistência (Netlify Blobs) + cálculo das datas ocupadas.
const { parseICal, mergeRanges } = require('./ical');

// Netlify Blobs (import dinâmico: funciona em CommonJS)
async function getStore(event, name) {
  const mod = await import('@netlify/blobs');
  if (typeof mod.connectLambda === 'function' && event) mod.connectLambda(event); // modo "lambda compat"
  return mod.getStore(name);
}

async function listAll(store) {
  const { blobs } = await store.list();
  const items = await Promise.all(blobs.map((b) => store.get(b.key, { type: 'json' })));
  return items.filter(Boolean);
}

// Reservas diretas confirmadas + bloqueios manuais (env MANUAL_BLOCKS)
async function getDirectBookings(event) {
  const list = [];
  try {
    const store = await getStore(event, 'bookings');
    for (const b of await listAll(store)) {
      if (b.status === 'confirmed') list.push({ id: b.id, start: b.checkIn, end: b.checkOut, summary: 'Reserva direta' });
    }
  } catch (e) {
    console.warn('Blobs indisponível (sem reservas diretas):', e.message);
  }
  try {
    const manual = JSON.parse(process.env.MANUAL_BLOCKS || '[]');
    manual.forEach((m, i) => list.push({ id: `manual-${i}`, start: m.start, end: m.end, summary: m.note || 'Bloqueio' }));
  } catch (e) { console.warn('MANUAL_BLOCKS inválido:', e.message); }
  return list;
}

// Cache em memória dos feeds (5 min) - só para mostrar o calendário aos visitantes.
// Pagamentos e pedidos usam { fresh: true } e leem sempre o Airbnb/Booking na hora.
const TTL = 5 * 60 * 1000;
const feedCache = new Map();

async function fetchFeed(url, fresh) {
  const hit = feedCache.get(url);
  if (!fresh && hit && Date.now() - hit.ts < TTL) return hit.events;
  const res = await fetch(url, { headers: { 'User-Agent': 'CasaDaRibeira-iCal/1.0' }, signal: AbortSignal.timeout(8000) });
  if (!res.ok) throw new Error('HTTP ' + res.status);
  const events = parseICal(await res.text());
  feedCache.set(url, { ts: Date.now(), events });
  return events;
}

function feedUrls() {
  const urls = [process.env.AIRBNB_ICAL_URL, process.env.BOOKING_ICAL_URL, ...(process.env.EXTRA_ICAL_URLS || '').split(',')];
  return urls.map((u) => (u || '').trim()).filter(Boolean);
}

/**
 * Devolve { ranges, failed } - failed = nº de feeds que falharam.
 * opts.fresh = true ignora a cache (usar antes de cobrar/aceitar uma reserva).
 */
async function getBookedRanges(event, opts = {}) {
  const all = [];
  let failed = 0;
  const results = await Promise.allSettled(feedUrls().map((u) => fetchFeed(u, !!opts.fresh)));
  results.forEach((r) => {
    if (r.status === 'fulfilled') all.push(...r.value);
    else { failed++; console.warn('Falha ao ler iCal:', r.reason && r.reason.message); }
  });
  all.push(...(await getDirectBookings(event)));
  return { ranges: mergeRanges(all), failed };
}

module.exports = { getStore, listAll, getDirectBookings, getBookedRanges };
