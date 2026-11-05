/* main.js - interface geral: renderização das secções a partir de config.js,
   lightbox, carrossel, filtros, FAQ, contactos, cookies, SEO. */
(function () {
  const C = window.SITE_CONFIG;
  const { t, L } = window.App;
  const $ = (s, r = document) => r.querySelector(s);
  const el = (tag, attrs = {}, html) => {
    const n = document.createElement(tag);
    Object.keys(attrs).forEach((k) => n.setAttribute(k, attrs[k]));
    if (html != null) n.innerHTML = html;
    return n;
  };
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  /* ---------- Ícones SVG inline (24x24, traço) ---------- */
  const ICONS = {
    wifi: '<path d="M2 8.8a15 15 0 0 1 20 0M5 12.5a10 10 0 0 1 14 0M8.5 16a5 5 0 0 1 7 0"/><circle cx="12" cy="19.5" r="1"/>',
    ac: '<path d="M12 2v20M4.5 7l15 10M19.5 7l-15 10M9 3.5l3 2.5 3-2.5M9 20.5l3-2.5 3 2.5"/>',
    kitchen: '<path d="M6 3v7a2 2 0 0 0 2 2v9M10 3v7a2 2 0 0 1-2 2M8 3v7M17 21V3c-2.200 1-3.500 4-3.500 8H17"/>',
    parking: '<rect x="4" y="3" width="16" height="18" rx="3"/><path d="M10 17V8h3a3 3 0 0 1 0 6h-3"/>',
    garden: '<path d="M12 22v-7M7 15a4.500 4.500 0 0 1 .5-8.800A4.500 4.500 0 0 1 16.500 6 4.500 4.500 0 0 1 17 15z"/>',
    pool: '<path d="M2 19c2 0 2-1.200 4-1.200s2 1.200 4 1.200 2-1.200 4-1.200 2 1.200 4 1.200 2-1.200 4-1.200M8 15V5a2 2 0 0 1 4 0M15 15V5a2 2 0 0 1 4 0M8 9h7"/>',
    pet: '<circle cx="6" cy="11" r="1.800"/><circle cx="10" cy="6.500" r="1.800"/><circle cx="14.500" cy="6.500" r="1.800"/><circle cx="18" cy="11" r="1.800"/><path d="M12 12c-3 0-5.500 3-5.500 5.500 0 2 1.800 2.800 3.500 2.200l2-.6 2 .6c1.700.6 3.500-.2 3.500-2.200C17.500 15 15 12 12 12z"/>',
    tv: '<rect x="3" y="5" width="18" height="12" rx="2"/><path d="M8 21h8M12 17v4"/>',
    washer: '<rect x="4" y="3" width="16" height="18" rx="2"/><circle cx="12" cy="13.500" r="4"/><path d="M8 6.500h.01M11 6.500h.01"/>',
    bbq: '<path d="M4 10h16a8 8 0 0 1-16 0zM8 18l-2 3M16 18l2 3M9 3c1 1 1 2 0 3M13 3c1 1 1 2 0 3"/>',
    heating: '<path d="M12 22c4 0 7-3 7-7 0-4-3-6-4-10-3 2-4 4-4 6-1-1-2-2-2-4-2 3-4 5-4 8 0 4 3 7 7 7z"/>',
    coffee: '<path d="M4 8h13v6a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5zM17 10h2a2 2 0 0 1 0 4h-2M7 3v2M11 3v2"/>',
    work: '<rect x="5" y="5" width="14" height="10" rx="1"/><path d="M2 19h20"/>',
    bed: '<path d="M3 18V6M3 14h18v4M21 14v-2a3 3 0 0 0-3-3h-7v5"/><circle cx="7" cy="11" r="1.500"/>',
    door: '<rect x="6" y="3" width="12" height="18" rx="1"/><circle cx="15" cy="12" r=".8"/>',
    bath: '<path d="M3 12h18v3a5 5 0 0 1-5 5H8a5 5 0 0 1-5-5zM6 12V6a2 2 0 0 1 4 0M5 20l-1 2M19 20l1 2"/>',
    users: '<circle cx="9" cy="8" r="3.500"/><path d="M2.500 20a6.500 6.500 0 0 1 13 0M16 4.500a3.500 3.500 0 0 1 0 7M18 14a6 6 0 0 1 3.500 6"/>'
  };
  const icon = (name) => `<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.600" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[name] || ICONS.coffee}</svg>`;
  const stars = (n) => '★'.repeat(Math.round(n)) + '☆'.repeat(5 - Math.round(n));

  /* ---------- Renderização (repetida ao mudar de idioma) ---------- */
  function renderGallery() {
    const box = $('#gallery');
    box.innerHTML = '';
    C.gallery.forEach((g, i) => {
      const b = el('button', { type: 'button', class: 'g-item', 'aria-label': L(g.alt) });
      b.innerHTML = `<img src="${esc(g.thumb)}" alt="${esc(L(g.alt))}" loading="lazy" width="600" height="450">`;
      b.addEventListener('click', () => openLightbox(i, b));
      box.appendChild(b);
    });
  }

  function renderHouse() {
    $('#house-img').src = C.house.image;
    $('#house-img').alt = L(C.house.imageAlt);
    $('#house-story').innerHTML = L(C.house.story).map((p) => `<p>${esc(p)}</p>`).join('');
    $('#house-facts').innerHTML = C.house.facts.map((f) => `<div><dt>${esc(L(f.label))}</dt><dd>${esc(f.value)}</dd></div>`).join('');
  }

  function renderAmenities() {
    const cap = C.capacity;
    const items = [['users', cap.guests, 'cap.guests'], ['door', cap.bedrooms, 'cap.bedrooms'], ['bed', cap.beds, 'cap.beds'], ['bath', cap.baths, 'cap.baths']];
    $('#capacity').innerHTML = items.map((i) => `<li>${icon(i[0])}<strong>${i[1]}</strong><span>${esc(t(i[2]))}</span></li>`).join('');
    $('#amenities').innerHTML = C.amenities.map((a) => `<li>${icon(a.icon)}<span>${esc(L(a.label))}</span></li>`).join('');
  }

  function renderHosts() {
    $('#hosts-img').src = C.hosts.image;
    $('#hosts-img').alt = L(C.hosts.imageAlt);
    $('#host-langs').textContent = L(C.hosts.languages).join(', ');
    $('#superhost').hidden = !C.hosts.superhost;
  }

  function renderReviews() {
    const src = C.reviews.sources;
    const total = src.reduce((s, x) => s + x.count, 0);
    // Média ponderada normalizada para escala 0-5
    const avg = src.reduce((s, x) => s + (x.rating / (x.scale || 5)) * 5 * x.count, 0) / (total || 1);
    $('#rating-avg').textContent = avg.toFixed(1).replace('.', L({ pt: ',', en: '.' }));
    $('#rating-stars').textContent = stars(avg);
    $('#rating-count').textContent = t('reviews.count', { n: total });
    $('#rating-sources').innerHTML = src.map((s) => {
      const r = String(s.rating).replace('.', L({ pt: ',', en: '.' }));
      return `<li><a href="${esc(s.url)}" target="_blank" rel="noopener"><strong>${esc(s.name)}</strong> <span>${r}${s.scale ? '/' + s.scale : '/5'}</span> <small>(${s.count})</small></a></li>`;
    }).join('');
    $('#reviews').innerHTML = C.reviews.items.map((r) => {
      const d = new Date(r.date + '-01T00:00:00');
      const date = new Intl.DateTimeFormat(window.App.locale(), { month: 'long', year: 'numeric' }).format(d);
      return `<article class="review"><div class="stars" aria-label="${r.rating}/5">${stars(r.rating)}</div>
        <p>“${esc(L(r.text))}”</p>
        <footer><strong>${esc(r.author)}</strong>, ${esc(L(r.origin))}<br><small>${esc(date)} · ${esc(t('reviews.on'))} ${esc(r.source)}</small></footer></article>`;
    }).join('');
  }

  let poiCat = 'all';
  function renderPoi() {
    const cats = ['all', ...Array.from(new Set(C.poi.map((p) => p.cat)))];
    $('#poi-filters').innerHTML = cats.map((c) => `<button type="button" class="chip${c === poiCat ? ' active' : ''}" data-cat="${c}" aria-pressed="${c === poiCat}">${esc(t('poi.' + c))}</button>`).join('');
    $('#poi-list').innerHTML = C.poi.filter((p) => poiCat === 'all' || p.cat === poiCat).map((p) =>
      `<article class="card"><span class="tag">${esc(t('poi.' + p.cat))}</span><h3>${esc(L(p.name))}</h3><p class="dist">${esc(L(p.distance))}</p><p>${esc(L(p.text))}</p></article>`).join('');
  }

  function renderPartners() {
    $('#partners').innerHTML = C.partners.map((p, i) => `<article class="card partner">
      <img src="${esc(p.img)}" alt="" loading="lazy" width="600" height="400">
      <div class="card-body"><span class="tag">${esc(L(p.type))}</span><h3>${esc(p.name)}</h3><p>${esc(L(p.text))}</p>
      <p class="benefit">${esc(L(p.benefit))}</p>
      <div class="code-row"><span>${esc(t('partners.code'))}: <code>${esc(p.code)}</code></span>
      <button type="button" class="link-btn" data-copy="${esc(p.code)}">${esc(t('partners.copy'))}</button></div>
      ${p.url ? `<a href="${esc(p.url)}" target="_blank" rel="noopener" class="link-btn">${esc(t('partners.visit'))} →</a>` : ''}</div></article>`).join('');
  }

  function renderInfo() {
    const ul = (id, arr) => { $(id).innerHTML = L(arr).map((x) => `<li>${esc(x)}</li>`).join(''); };
    ul('#info-rules', C.info.rules); ul('#info-cancel', C.info.cancellation); ul('#info-directions', C.info.directions);
    $('#faq-list').innerHTML = C.faq.map((f) => `<details><summary>${esc(L(f.q))}</summary><p>${esc(L(f.a))}</p></details>`).join('');
  }

  function renderContacts() {
    const c = C.contact;
    $('#c-phone').textContent = c.phone; $('#c-phone').href = 'tel:' + c.phone.replace(/[^+\d]/g, '');
    $('#c-email').textContent = c.email; $('#c-email').href = 'mailto:' + c.email;
    const wa = `https://wa.me/${c.whatsapp}?text=${encodeURIComponent(L(c.whatsappMessage))}`;
    $('#c-wa').href = wa; $('#wa-float').href = wa;
    $('#soc').innerHTML = Object.keys(C.social).map((k) => `<a href="${esc(C.social[k])}" target="_blank" rel="noopener">${k[0].toUpperCase() + k.slice(1)}</a>`).join(' · ');
  }

  /* ---------- Lightbox (teclado + swipe) ---------- */
  const lb = $('#lightbox');
  let lbIndex = 0, lbTrigger = null;
  function showLb(i) {
    lbIndex = (i + C.gallery.length) % C.gallery.length;
    const g = C.gallery[lbIndex];
    $('#lb-img').src = g.src; $('#lb-img').alt = L(g.alt); $('#lb-cap').textContent = `${L(g.alt)} (${lbIndex + 1}/${C.gallery.length})`;
  }
  function openLightbox(i, trigger) {
    lbTrigger = trigger; showLb(i);
    lb.hidden = false; document.body.classList.add('no-scroll'); $('#lb-close').focus();
  }
  function closeLightbox() { lb.hidden = true; document.body.classList.remove('no-scroll'); if (lbTrigger) lbTrigger.focus(); }
  $('#lb-close').addEventListener('click', closeLightbox);
  $('#lb-prev').addEventListener('click', () => showLb(lbIndex - 1));
  $('#lb-next').addEventListener('click', () => showLb(lbIndex + 1));
  lb.addEventListener('click', (e) => { if (e.target === lb) closeLightbox(); });
  document.addEventListener('keydown', (e) => {
    if (lb.hidden) return;
    if (e.key === 'Escape') closeLightbox();
    else if (e.key === 'ArrowLeft') showLb(lbIndex - 1);
    else if (e.key === 'ArrowRight') showLb(lbIndex + 1);
    else if (e.key === 'Tab') { // mantém o foco dentro do lightbox
      const f = [$('#lb-close'), $('#lb-prev'), $('#lb-next')];
      const i = f.indexOf(document.activeElement);
      e.preventDefault();
      f[(i + (e.shiftKey ? -1 : 1) + f.length) % f.length].focus();
    }
  });
  let tx = null;
  lb.addEventListener('touchstart', (e) => { tx = e.touches[0].clientX; }, { passive: true });
  lb.addEventListener('touchend', (e) => {
    if (tx == null) return;
    const dx = e.changedTouches[0].clientX - tx; tx = null;
    if (Math.abs(dx) > 50) showLb(lbIndex + (dx < 0 ? 1 : -1));
  });

  /* ---------- Carrossel de avaliações ---------- */
  const track = $('#reviews');
  const step = () => (track.firstElementChild ? track.firstElementChild.getBoundingClientRect().width + 20 : 300);
  $('#rev-prev').addEventListener('click', () => track.scrollBy({ left: -step(), behavior: 'smooth' }));
  $('#rev-next').addEventListener('click', () => track.scrollBy({ left: step(), behavior: 'smooth' }));
  track.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') track.scrollBy({ left: step(), behavior: 'smooth' });
    if (e.key === 'ArrowLeft') track.scrollBy({ left: -step(), behavior: 'smooth' });
  });

  /* ---------- Delegação de eventos ---------- */
  $('#poi-filters').addEventListener('click', (e) => {
    const b = e.target.closest('[data-cat]'); if (!b) return;
    poiCat = b.dataset.cat; renderPoi();
    const again = $(`#poi-filters [data-cat="${poiCat}"]`); if (again) again.focus();
  });
  $('#partners').addEventListener('click', (e) => {
    const b = e.target.closest('[data-copy]'); if (!b) return;
    const done = () => { b.textContent = t('partners.copied'); setTimeout(() => { b.textContent = t('partners.copy'); }, 1800); };
    if (navigator.clipboard) navigator.clipboard.writeText(b.dataset.copy).then(done, done); else done();
  });

  /* ---------- Cabeçalho, menu, idioma ---------- */
  const header = $('.site-header');
  const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 40);
  window.addEventListener('scroll', onScroll, { passive: true }); onScroll();
  const nav = $('#nav'), toggle = $('#menu-toggle');
  const setMenu = (open) => { nav.classList.toggle('open', open); toggle.setAttribute('aria-expanded', String(open)); document.body.classList.toggle('menu-open', open); document.body.classList.toggle('no-scroll', open); };
  toggle.addEventListener('click', () => setMenu(!nav.classList.contains('open')));
  nav.addEventListener('click', (e) => { if (e.target.tagName === 'A') setMenu(false); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setMenu(false); });
  $('#lang-toggle').addEventListener('click', () => window.App.setLang(window.App.getLang() === 'pt' ? 'en' : 'pt'));

  /* ---------- Barra de reserva (mobile): preço de config.js; esconde-se sobre #reserva ---------- */
  const bar = $('#book-bar'), reservaEl = $('#reserva');
  if (bar && reservaEl && 'IntersectionObserver' in window) {
    new IntersectionObserver((en) => { bar.classList.toggle('hide', en[0].isIntersecting); }, { threshold: 0.05 }).observe(reservaEl);
  }

  /* ---------- Animações de entrada ---------- */
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if ('IntersectionObserver' in window && !reduce) {
    const io = new IntersectionObserver((entries) => entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } }), { threshold: 0.12 });
    document.querySelectorAll('.reveal').forEach((n) => io.observe(n));
  } else document.querySelectorAll('.reveal').forEach((n) => n.classList.add('in'));

  /* ---------- Formulário de contacto ---------- */
  window.App.post = async function (path, body) {
    let res;
    try {
      res = await fetch(C.apiBase + path, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    } catch (e) { throw { demo: true }; }
    if (!(res.headers.get('content-type') || '').includes('json')) throw { demo: true }; // sem funções (ex.: abrir localmente)
    const data = await res.json().catch(() => ({}));
    return { ok: res.ok, data };
  };
  window.App.errMsg = function (data) {
    const key = 'err.' + (data && data.error);
    return window.App.DICT.pt[key] ? t(key, { n: data.minNights }) : t('err.generic');
  };
  const cf = $('#contact-form'), cs = $('#contact-status');
  cf.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!cf.checkValidity()) { cf.reportValidity(); return; }
    const fd = new FormData(cf);
    cs.textContent = t('book.sending');
    try {
      const r = await window.App.post('/booking-request', { type: 'contact', name: fd.get('name'), email: fd.get('email'), message: fd.get('message'), website: fd.get('website'), consent: true });
      if (r.ok) { cs.textContent = t('contact.sent'); cf.reset(); } else cs.textContent = window.App.errMsg(r.data);
    } catch (err) { cs.textContent = t('book.demoMsg'); }
  });

  /* ---------- Cookies (só essenciais) ---------- */
  const ck = $('#cookie');
  let seen = false;
  try { seen = localStorage.getItem('cookie-ok') === '1'; } catch (e) { /* ignorar */ }
  ck.hidden = seen;
  $('#cookie-ok').addEventListener('click', () => { ck.hidden = true; try { localStorage.setItem('cookie-ok', '1'); } catch (e) { /* ignorar */ } });

  /* ---------- SEO dinâmico: meta + JSON-LD LodgingBusiness ---------- */
  function seo() {
    const p = C.property, desc = L(p.description);
    document.title = `${p.name} · ${L(p.tagline)}`;
    const set = (sel, attr, val) => { const n = $(sel); if (n) n.setAttribute(attr, val); };
    set('meta[name="description"]', 'content', desc);
    set('meta[property="og:title"]', 'content', document.title);
    set('meta[property="og:description"]', 'content', desc);
    set('meta[property="og:image"]', 'content', p.ogImage);
    set('meta[property="og:url"]', 'content', p.siteUrl + '/');
    set('link[rel="canonical"]', 'href', p.siteUrl + '/');
    let s = $('#jsonld');
    if (!s) { s = el('script', { type: 'application/ld+json', id: 'jsonld' }); document.head.appendChild(s); }
    const total = C.reviews.sources.reduce((a, x) => a + x.count, 0);
    const avg = C.reviews.sources.reduce((a, x) => a + (x.rating / (x.scale || 5)) * 5 * x.count, 0) / (total || 1);
    s.textContent = JSON.stringify({
      '@context': 'https://schema.org', '@type': 'LodgingBusiness',
      name: p.name, description: desc, url: p.siteUrl, image: C.gallery.map((g) => g.src).slice(0, 4),
      telephone: C.contact.phone, email: C.contact.email, address: { '@type': 'PostalAddress', streetAddress: p.address, addressCountry: 'PT' },
      geo: { '@type': 'GeoCoordinates', latitude: p.lat, longitude: p.lon },
      priceRange: `€${C.pricing.baseNightly}+`, checkinTime: C.info.checkIn.slice(0, 5), checkoutTime: C.info.checkOut,
      petsAllowed: true, numberOfRooms: C.capacity.bedrooms,
      amenityFeature: C.amenities.map((a) => ({ '@type': 'LocationFeatureSpecification', name: a.label.pt || a.label, value: true })),
      aggregateRating: { '@type': 'AggregateRating', ratingValue: avg.toFixed(1), reviewCount: total, bestRating: 5 },
      sameAs: Object.values(C.social).concat([C.external.airbnb, C.external.booking])
    });
  }

  /* ---------- Arranque ---------- */
  $('#hero-img').src = C.property.heroImage;
  $('#year').textContent = new Date().getFullYear();
  $('#link-airbnb').href = C.external.airbnb;
  $('#link-booking').href = C.external.booking;
  $('#f-complaints').href = C.external.complaints;
  const bbox = (d) => `${C.property.lon - d},${C.property.lat - d / 2},${C.property.lon + d},${C.property.lat + d / 2}`;
  $('#map').src = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox(0.02)}&layer=mapnik&marker=${C.property.lat},${C.property.lon}`;
  $('#map-link').href = `https://www.openstreetmap.org/?mlat=${C.property.lat}&mlon=${C.property.lon}#map=14/${C.property.lat}/${C.property.lon}`;

  window.App.onLang(() => {
    renderGallery(); renderHouse(); renderAmenities(); renderHosts(); renderReviews();
    renderPoi(); renderPartners(); renderInfo(); renderContacts(); seo();
    $('#bar-price').textContent = window.App.money(Math.round(C.pricing.baseNightly * 100));
    $('#hero-img').alt = `${C.property.name} – ${L(C.property.tagline)}`;
    $('#lightbox').setAttribute('aria-label', t('lb.label'));
  });
  window.App.apply();
})();
