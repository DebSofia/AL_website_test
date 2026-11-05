/* booking.js - calendário de disponibilidade, preço e envio da reserva.
   Datas sempre como 'YYYY-MM-DD'. Um intervalo ocupado é [start, end):
   "end" é o dia de saída (a noite de "end" está livre).
   A lógica de preço é a mesma de netlify/functions/_shared/pricing.js
   (o servidor recalcula sempre). */
(function () {
  const C = window.SITE_CONFIG, P = C.pricing;
  const { t, L, money } = window.App;
  const $ = (s) => document.querySelector(s);

  /* ---------- Utilitários de datas (UTC, sem problemas de fuso) ---------- */
  const dayNum = (s) => Math.floor(Date.parse(s + 'T00:00:00Z') / 864e5);
  const fromNum = (n) => new Date(n * 864e5).toISOString().slice(0, 10);
  const addDays = (s, n) => fromNum(dayNum(s) + n);
  const pad = (n) => String(n).padStart(2, '0');
  const now = new Date();
  const TODAY = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
  const monthStart = (s) => s.slice(0, 7) + '-01';
  const addMonths = (s, n) => { const d = new Date(Date.UTC(+s.slice(0, 4), +s.slice(5, 7) - 1 + n, 1)); return d.toISOString().slice(0, 10); };
  const MAX_MONTHS_AHEAD = 18;

  /* ---------- Estado ---------- */
  const S = { booked: [], demo: false, checkIn: null, checkOut: null, view: monthStart(TODAY), months: 1 };

  /* ---------- Preços ---------- */
  const cents = (e) => Math.round(e * 100);
  const seasonFor = (d) => {
    const md = d.slice(5);
    return P.seasons.find((s) => (s.from <= s.to ? md >= s.from && md <= s.to : md >= s.from || md <= s.to)) || null;
  };
  const nightlyFor = (d) => { const s = seasonFor(d); return s ? s.nightly : P.baseNightly; };
  const minNightsFor = (d) => { const s = seasonFor(d); return (s && s.minNights) || P.minNights; };

  function computePrice(ci, co, guests) {
    const nights = dayNum(co) - dayNum(ci);
    let accommodation = 0;
    for (let i = 0; i < nights; i++) accommodation += cents(nightlyFor(addDays(ci, i)));
    const tt = P.touristTax;
    const touristTax = tt.enabled ? cents(tt.perPersonPerNight) * guests * Math.min(nights, tt.maxNights) : 0;
    const cleaning = cents(P.cleaningFee);
    return { nights, accommodation, cleaning, touristTax, total: accommodation + cleaning + touristTax };
  }

  /* ---------- Disponibilidade ---------- */
  const nightBooked = (d) => S.booked.some((r) => d >= r.start && d < r.end);
  const rangeFree = (a, b) => !S.booked.some((r) => a < r.end && r.start < b);
  const canCheckIn = (d) => d >= TODAY && !nightBooked(d) && rangeFree(d, addDays(d, minNightsFor(d)));

  // O que acontece ao clicar no dia d: 'out' | 'in' | null
  function actionFor(d) {
    if (d < TODAY) return null;
    if (S.checkIn && !S.checkOut && d > S.checkIn && rangeFree(S.checkIn, d)) {
      const n = dayNum(d) - dayNum(S.checkIn);
      return n >= minNightsFor(S.checkIn) && n <= P.maxNights ? 'out' : null;
    }
    return canCheckIn(d) ? 'in' : null;
  }

  function demoBooked() { // datas de exemplo relativas a hoje
    const r = (a, b) => ({ start: addDays(TODAY, a), end: addDays(TODAY, b) });
    return [r(6, 10), r(19, 23), r(33, 40), r(52, 55), r(75, 82)];
  }

  async function loadAvailability() {
    try {
      const res = await fetch(C.apiBase + '/availability', { cache: 'no-store' });
      if (!res.ok || !(res.headers.get('content-type') || '').includes('json')) throw new Error('sem API');
      const data = await res.json();
      if (!Array.isArray(data.booked)) throw new Error('formato');
      S.booked = data.booked; S.demo = false;
    } catch (e) {
      S.booked = C.demoMode.enabled ? demoBooked() : []; S.demo = !!C.demoMode.enabled;
    }
    $('#demo-note').hidden = !S.demo;
    renderCalendar();
  }

  /* ---------- Calendário ---------- */
  function fmtDate(s, opts) { return new Intl.DateTimeFormat(window.App.locale(), Object.assign({ timeZone: 'UTC' }, opts)).format(new Date(s + 'T00:00:00Z')); }

  function renderCalendar() {
    S.months = window.innerWidth >= 900 ? 2 : 1;
    const cal = $('#calendar');
    cal.innerHTML = '';
    cal.style.setProperty('--months', S.months);
    const titles = [];
    for (let m = 0; m < S.months; m++) {
      const first = addMonths(S.view, m);
      // Só a primeira letra em maiúscula ("Novembro de 2026", não "Novembro De 2026")
      const raw = fmtDate(first, { month: 'long', year: 'numeric' });
      const title = raw.charAt(0).toUpperCase() + raw.slice(1);
      titles.push(title);
      const wrap = document.createElement('div');
      wrap.className = 'month';
      let html = `<h4>${title}</h4><div class="grid" role="grid" aria-label="${title}">`;
      // Cabeçalho dos dias (2024-01-01 é segunda-feira)
      for (let i = 0; i < 7; i++) html += `<span class="wd" aria-hidden="true">${fmtDate(addDays('2024-01-01', i), { weekday: 'narrow' })}</span>`;
      const offset = (new Date(first + 'T00:00:00Z').getUTCDay() + 6) % 7; // segunda = 0
      html += '<span></span>'.repeat(offset);
      const days = new Date(Date.UTC(+first.slice(0, 4), +first.slice(5, 7), 0)).getUTCDate();
      for (let d = 1; d <= days; d++) {
        const date = `${first.slice(0, 8)}${pad(d)}`;
        const act = actionFor(date);
        const booked = nightBooked(date), past = date < TODAY;
        const cls = ['day'];
        if (booked) cls.push('booked');
        if (past) cls.push('past');
        if (date === TODAY) cls.push('today');
        if (S.checkIn && date === S.checkIn) cls.push('sel', 'sel-start');
        if (S.checkOut && date === S.checkOut) cls.push('sel', 'sel-end');
        if (S.checkIn && S.checkOut && date > S.checkIn && date < S.checkOut) cls.push('in-range');
        const label = fmtDate(date, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) + (booked ? ' – ' + t('cal.bookedDay') : '');
        html += `<button type="button" class="${cls.join(' ')}" data-date="${date}" aria-label="${label}"${S.checkIn === date || S.checkOut === date ? ' aria-pressed="true"' : ''}${act ? '' : ' disabled'}>${d}</button>`;
      }
      wrap.innerHTML = html + '</div>';
      cal.appendChild(wrap);
    }
    $('#cal-title').textContent = titles.join(' – ');
    $('#cal-prev').disabled = S.view <= monthStart(TODAY);
    $('#cal-next').disabled = addMonths(S.view, S.months) > addMonths(monthStart(TODAY), MAX_MONTHS_AHEAD);
    renderHint();
  }

  function renderHint() {
    const h = $('#cal-hint');
    if (!S.checkIn) h.textContent = t('cal.hintIn');
    else if (!S.checkOut) h.textContent = t('cal.hintOut', { n: minNightsFor(S.checkIn) });
    else h.textContent = t('cal.hintDone');
  }

  $('#calendar').addEventListener('click', (e) => {
    const b = e.target.closest('.day'); if (!b || b.disabled) return;
    const d = b.dataset.date, act = actionFor(d);
    if (act === 'out') S.checkOut = d;
    else if (act === 'in') { S.checkIn = d; S.checkOut = null; }
    renderCalendar(); renderSummary();
    const again = document.querySelector(`.day[data-date="${d}"]`); if (again) again.focus();
  });
  $('#cal-prev').addEventListener('click', () => { S.view = addMonths(S.view, -1); renderCalendar(); });
  $('#cal-next').addEventListener('click', () => { S.view = addMonths(S.view, 1); renderCalendar(); });
  let rt; window.addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(() => { if (window.innerWidth >= 900 !== (S.months === 2)) renderCalendar(); }, 150); });

  /* ---------- Resumo / preço ---------- */
  const guestsSel = $('#f-guests');
  function renderGuests() {
    const cur = guestsSel.value || '2';
    guestsSel.innerHTML = '';
    for (let i = 1; i <= P.maxGuests; i++) {
      const o = document.createElement('option'); o.value = i; o.textContent = `${i} ${i === 1 ? t('guests.one') : t('guests.many')}`; guestsSel.appendChild(o);
    }
    guestsSel.value = Math.min(+cur, P.maxGuests);
  }

  function renderSummary() {
    const box = $('#price-summary');
    if (!S.checkIn || !S.checkOut) {
      box.innerHTML = `<p class="muted">${t('book.pickDates')}</p>` + (S.checkIn ? `<p><strong>${t('cal.checkin')}:</strong> ${fmtDate(S.checkIn, { day: 'numeric', month: 'short', year: 'numeric' })}</p>` : '');
      return;
    }
    const g = +guestsSel.value || 1;
    const p = computePrice(S.checkIn, S.checkOut, g);
    const avg = Math.round(p.accommodation / p.nights);
    const tt = P.touristTax;
    const f = (d) => fmtDate(d, { day: 'numeric', month: 'short', year: 'numeric' });
    box.innerHTML = `
      <p class="dates"><span><strong>${t('cal.checkin')}</strong>${f(S.checkIn)}</span><span><strong>${t('cal.checkout')}</strong>${f(S.checkOut)}</span>
      <button type="button" class="link-btn" id="clear-dates">${t('cal.clear')}</button></p>
      <dl>
        <div><dt>${money(avg)} × ${p.nights} ${p.nights === 1 ? t('price.night') : t('price.nights')}</dt><dd>${money(p.accommodation)}</dd></div>
        ${p.cleaning ? `<div><dt>${t('price.cleaning')}</dt><dd>${money(p.cleaning)}</dd></div>` : ''}
        ${p.touristTax ? `<div><dt>${t('price.tax')}<small>${t('price.taxNote', { g: g, n: Math.min(p.nights, tt.maxNights), p: money(cents(tt.perPersonPerNight)) })}</small></dt><dd>${money(p.touristTax)}</dd></div>` : ''}
        <div class="total"><dt>${t('price.total')}</dt><dd>${money(p.total)}</dd></div>
      </dl>`;
    $('#clear-dates').addEventListener('click', () => { S.checkIn = S.checkOut = null; renderCalendar(); renderSummary(); });
  }
  guestsSel.addEventListener('change', renderSummary);

  /* ---------- Envio ---------- */
  const form = $('#booking-form'), status = $('#form-status');
  async function send(mode) {
    status.className = 'form-status';
    if (!S.checkIn || !S.checkOut) { status.textContent = t('book.noDates'); status.classList.add('err'); return; }
    if (!form.checkValidity()) { form.reportValidity(); status.textContent = t('book.fixForm'); status.classList.add('err'); return; }
    const fd = new FormData(form);
    const body = {
      checkIn: S.checkIn, checkOut: S.checkOut, guests: +fd.get('guests'), name: fd.get('name'), email: fd.get('email'),
      phone: fd.get('phone'), message: fd.get('message'), website: fd.get('website'), consent: true, lang: window.App.getLang()
    };
    const buttons = form.querySelectorAll('.pay-actions button');
    buttons.forEach((b) => { b.disabled = true; });
    status.textContent = t('book.sending');
    try {
      const r = await window.App.post(mode === 'pay' ? '/create-checkout' : '/booking-request', body);
      if (r.ok && mode === 'pay' && r.data.url) { status.textContent = t('book.redirect'); window.location.href = r.data.url; return; }
      if (r.ok) { status.textContent = t('book.sent'); status.classList.add('ok'); form.reset(); renderGuests(); S.checkIn = S.checkOut = null; renderCalendar(); renderSummary(); }
      else {
        status.textContent = window.App.errMsg(r.data); status.classList.add('err');
        if (r.data && r.data.error === 'dates_unavailable') { S.checkIn = S.checkOut = null; loadAvailability(); renderSummary(); }
      }
    } catch (err) { // modo demonstração: sem funções Netlify
      status.textContent = t('book.demoMsg'); status.classList.add('err');
    } finally { buttons.forEach((b) => { b.disabled = false; }); }
  }
  $('#btn-pay').addEventListener('click', () => send('pay'));
  $('#btn-request').addEventListener('click', () => send('request'));
  form.addEventListener('submit', (e) => e.preventDefault());

  /* ---------- Arranque ---------- */
  guestsSel.value = '2';
  window.App.onLang(() => { const keep = guestsSel.value; renderGuests(); if (keep) guestsSel.value = keep; renderCalendar(); renderSummary(); });
  renderGuests(); renderSummary(); loadAvailability();
})();
