// =====================================================================
// PREÇOS - fonte de verdade NO SERVIDOR (CommonJS).
// ATENÇÃO: o bloco "pricing" de /config.js (front-end) tem de ser IGUAL a
// este. O front-end só mostra o preço; o servidor recalcula sempre.
// Valores em euros; os cálculos são feitos em cêntimos (inteiros).
// =====================================================================

const PRICING = {
  currency: 'eur',
  baseNightly: 95,            // preço por noite (época base)
  seasons: [                  // épocas (MM-DD), inclusivo; podem atravessar o ano
    { name: 'Verão', from: '07-01', to: '09-15', nightly: 130, minNights: 3 },
    { name: 'Natal / Ano Novo', from: '12-20', to: '01-03', nightly: 120, minNights: 3 }
  ],
  cleaningFee: 40,
  touristTax: { enabled: true, perPersonPerNight: 2, maxNights: 7 }, // menores de 13 anos estão isentos (ajustar no check-in)
  minNights: 2,
  maxNights: 30,
  maxGuests: 6
};

const cents = (eur) => Math.round(eur * 100);
const isDate = (s) => typeof s === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(s) && !Number.isNaN(Date.parse(s + 'T00:00:00Z'));
const dayNum = (s) => Math.floor(Date.parse(s + 'T00:00:00Z') / 864e5);
const fromDayNum = (n) => new Date(n * 864e5).toISOString().slice(0, 10);
const addDays = (s, n) => fromDayNum(dayNum(s) + n);

// Data de hoje em Portugal (YYYY-MM-DD)
function todayPT() {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Lisbon', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
}

function seasonFor(date) {
  const md = date.slice(5);
  return PRICING.seasons.find((s) => (s.from <= s.to ? md >= s.from && md <= s.to : md >= s.from || md <= s.to)) || null;
}
const nightlyFor = (date) => { const s = seasonFor(date); return s ? s.nightly : PRICING.baseNightly; };
const minNightsFor = (checkIn) => { const s = seasonFor(checkIn); return (s && s.minNights) || PRICING.minNights; };

/**
 * Calcula o preço. Devolve { error } ou o detalhe em cêntimos.
 * Erros: invalid_dates | past_date | min_nights | max_nights | invalid_guests
 */
function computePrice(checkIn, checkOut, guests) {
  if (!isDate(checkIn) || !isDate(checkOut) || checkOut <= checkIn) return { error: 'invalid_dates' };
  if (checkIn < todayPT()) return { error: 'past_date' };
  const g = Number(guests);
  if (!Number.isInteger(g) || g < 1 || g > PRICING.maxGuests) return { error: 'invalid_guests' };
  const nights = dayNum(checkOut) - dayNum(checkIn);
  if (nights < minNightsFor(checkIn)) return { error: 'min_nights', minNights: minNightsFor(checkIn) };
  if (nights > PRICING.maxNights) return { error: 'max_nights' };

  let accommodation = 0;
  for (let i = 0; i < nights; i++) accommodation += cents(nightlyFor(addDays(checkIn, i)));
  const cleaning = cents(PRICING.cleaningFee);
  const tt = PRICING.touristTax;
  const touristTax = tt.enabled ? cents(tt.perPersonPerNight) * g * Math.min(nights, tt.maxNights) : 0;
  return {
    currency: PRICING.currency, nights, guests: g,
    accommodation, cleaning, touristTax,
    total: accommodation + cleaning + touristTax
  };
}

module.exports = { PRICING, computePrice, minNightsFor, isDate, dayNum, addDays, fromDayNum, todayPT };
