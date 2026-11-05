/* Internacionalização simples PT/EN.
   - Elementos com data-i18n="chave"            -> textContent
   - data-i18n-attr="atributo:chave,outro:chave" -> atributos
   - data-cfg="caminho.no.config"                -> valor de SITE_CONFIG (traduzido se {pt,en})
   Para adicionar um idioma, acrescente um bloco ao DICT e um botão ao seletor. */
(function () {
  const DICT = {
    pt: {
      'skip': 'Saltar para o conteúdo',
      'nav.gallery': 'Galeria', 'nav.house': 'A Casa', 'nav.amenities': 'Comodidades', 'nav.hosts': 'Anfitriões',
      'nav.reviews': 'Avaliações', 'nav.nearby': 'Arredores', 'nav.info': 'Informações', 'nav.contact': 'Contactos',
      'bar.from': 'desde', 'bar.night': '/noite', 'lang.label': 'Mudar idioma para inglês', 'menu.label': 'Abrir menu', 'btn.book': 'Reservar',
      'hero.eyebrow': 'Alojamento Local · Minho, Portugal', 'hero.cta': 'Ver disponibilidade',
      'gallery.eyebrow': 'Galeria', 'gallery.title': 'Espreite por dentro', 'gallery.sub': 'Cada canto da casa foi pensado para descansar.',
      'house.eyebrow': 'A Casa', 'house.title': 'Uma casa com história',
      'amen.eyebrow': 'Comodidades', 'amen.title': 'Tudo o que precisa',
      'cap.guests': 'Hóspedes', 'cap.bedrooms': 'Quartos', 'cap.beds': 'Camas', 'cap.baths': 'Casas de banho',
      'hosts.eyebrow': 'Anfitriões', 'hosts.title': 'Olá, somos', 'hosts.languages': 'Idiomas', 'hosts.response': 'Tempo de resposta',
      'hosts.badge': 'Distinção', 'hosts.superhost': 'Superhost',
      'book.eyebrow': 'Reservas', 'book.title': 'Disponibilidade e reserva', 'book.sub': 'Escolha a entrada e a saída. Reserve direto e evite comissões.',
      'book.summary': 'Resumo da estadia', 'book.payNow': 'Pagar agora com cartão / MB WAY',
      'book.request': 'Pedido de reserva (pagar depois por transferência)', 'book.also': 'Também disponível no',
      'book.demoNote': 'Modo demonstração: datas ocupadas de exemplo.',
      'book.demoMsg': 'Modo demonstração: o servidor não está ligado, por isso esta ação não foi enviada. Depois de publicar no Netlify funcionará.',
      'book.sent': 'Pedido enviado! Responderemos em breve com os dados para transferência.',
      'book.redirect': 'A redirecionar para o pagamento seguro…', 'book.sending': 'A enviar…',
      'book.noDates': 'Escolha as datas no calendário.', 'book.fixForm': 'Preencha todos os campos obrigatórios e aceite a política de privacidade.',
      'book.pickDates': 'Selecione as datas para ver o preço.',
      'cal.prev': 'Mês anterior', 'cal.next': 'Mês seguinte', 'cal.prev2': 'Anterior', 'cal.next2': 'Seguinte',
      'cal.free': 'Livre', 'cal.booked': 'Ocupado', 'cal.selected': 'Selecionado',
      'cal.hintIn': 'Escolha o dia de chegada.', 'cal.hintOut': 'Agora escolha o dia de saída (mínimo {n} noites).',
      'cal.hintDone': 'Datas selecionadas. Clique noutro dia para recomeçar.',
      'cal.checkin': 'Entrada', 'cal.checkout': 'Saída', 'cal.clear': 'Limpar datas', 'cal.bookedDay': 'ocupado',
      'price.nights': 'noites', 'price.night': 'noite', 'price.accom': 'Alojamento', 'price.cleaning': 'Taxa de limpeza',
      'price.tax': 'Taxa turística', 'price.total': 'Total', 'price.perNight': 'por noite', 'price.taxNote': '{g} pessoas × {n} noites × {p}',
      'form.guests': 'Nº de hóspedes', 'form.phone': 'Telemóvel', 'form.name': 'Nome', 'form.email': 'Email',
      'form.message': 'Mensagem (opcional)', 'form.messageReq': 'Mensagem', 'form.consent': 'Li e aceito a', 'form.privacy': 'política de privacidade',
      'guests.one': 'hóspede', 'guests.many': 'hóspedes',
      'reviews.eyebrow': 'Avaliações', 'reviews.title': 'O que dizem os hóspedes', 'reviews.count': '{n} avaliações', 'reviews.on': 'em',
      'poi.eyebrow': 'Arredores', 'poi.title': 'Descubra a região', 'poi.filter': 'Filtrar por categoria', 'poi.bigmap': 'Ver mapa maior',
      'poi.all': 'Tudo', 'poi.nature': 'Natureza', 'poi.food': 'Gastronomia', 'poi.culture': 'Cultura', 'poi.beaches': 'Praias',
      'partners.eyebrow': 'Parcerias', 'partners.title': 'Vantagens para hóspedes', 'partners.sub': 'Mostre o código aos nossos parceiros locais.',
      'partners.code': 'Código', 'partners.copy': 'Copiar', 'partners.copied': 'Copiado!', 'partners.visit': 'Visitar',
      'info.eyebrow': 'Informações úteis', 'info.title': 'Antes de chegar', 'info.times': 'Check-in e check-out',
      'info.checkin': 'Check-in:', 'info.checkout': 'Check-out:', 'info.rules': 'Regras da casa',
      'info.cancel': 'Política de cancelamento', 'info.directions': 'Como chegar',
      'faq.title': 'Perguntas frequentes',
      'contact.eyebrow': 'Contactos', 'contact.title': 'Fale connosco', 'contact.phone': 'Telefone', 'contact.address': 'Morada',
      'contact.send': 'Enviar mensagem', 'contact.sent': 'Mensagem enviada. Obrigado!',
      'footer.rnal': 'Nº de registo RNAL:', 'footer.complaints': 'Livro de Reclamações Eletrónico',
      'footer.privacy': 'Política de privacidade', 'footer.rights': 'Todos os direitos reservados.',
      'wa.label': 'Falar connosco no WhatsApp', 'lb.close': 'Fechar', 'lb.label': 'Galeria de fotografias',
      'cookie.label': 'Aviso de cookies', 'cookie.text': 'Este site usa apenas armazenamento essencial (preferência de idioma). Não usamos cookies de publicidade ou análise.', 'cookie.ok': 'Entendi',
      'err.generic': 'Ocorreu um erro. Tente novamente ou contacte-nos.',
      'err.invalid': 'Dados inválidos. Verifique o formulário.', 'err.invalid_dates': 'Datas inválidas.', 'err.past_date': 'A data de entrada já passou.',
      'err.min_nights': 'Estadia mínima: {n} noites.', 'err.max_nights': 'Estadia máxima excedida.', 'err.invalid_guests': 'Número de hóspedes inválido.',
      'err.dates_unavailable': 'Essas datas já não estão disponíveis. Escolha outras.', 'err.availability_unavailable': 'Não foi possível confirmar a disponibilidade agora. Tente daqui a pouco.',
      'err.payments_disabled': 'Os pagamentos online ainda não estão ativos. Use o pedido de reserva.', 'err.payment_error': 'Não foi possível iniciar o pagamento.'
    },
    en: {
      'skip': 'Skip to content',
      'nav.gallery': 'Gallery', 'nav.house': 'The House', 'nav.amenities': 'Amenities', 'nav.hosts': 'Hosts',
      'nav.reviews': 'Reviews', 'nav.nearby': 'Nearby', 'nav.info': 'Info', 'nav.contact': 'Contact',
      'bar.from': 'from', 'bar.night': '/night', 'lang.label': 'Switch language to Portuguese', 'menu.label': 'Open menu', 'btn.book': 'Book now',
      'hero.eyebrow': 'Holiday home · Minho, Portugal', 'hero.cta': 'Check availability',
      'gallery.eyebrow': 'Gallery', 'gallery.title': 'Take a look inside', 'gallery.sub': 'Every corner of the house was designed for rest.',
      'house.eyebrow': 'The House', 'house.title': 'A house with a story',
      'amen.eyebrow': 'Amenities', 'amen.title': 'Everything you need',
      'cap.guests': 'Guests', 'cap.bedrooms': 'Bedrooms', 'cap.beds': 'Beds', 'cap.baths': 'Bathrooms',
      'hosts.eyebrow': 'Hosts', 'hosts.title': 'Hello, we are', 'hosts.languages': 'Languages', 'hosts.response': 'Response time',
      'hosts.badge': 'Badge', 'hosts.superhost': 'Superhost',
      'book.eyebrow': 'Booking', 'book.title': 'Availability and booking', 'book.sub': 'Pick your check-in and check-out. Book direct and skip the fees.',
      'book.summary': 'Stay summary', 'book.payNow': 'Pay now by card / MB WAY',
      'book.request': 'Booking request (pay later by bank transfer)', 'book.also': 'Also available on',
      'book.demoNote': 'Demo mode: sample booked dates.',
      'book.demoMsg': 'Demo mode: the server is not connected, so this action was not sent. It will work once deployed on Netlify.',
      'book.sent': 'Request sent! We will reply shortly with the bank transfer details.',
      'book.redirect': 'Redirecting to secure payment…', 'book.sending': 'Sending…',
      'book.noDates': 'Please choose your dates on the calendar.', 'book.fixForm': 'Please fill in all required fields and accept the privacy policy.',
      'book.pickDates': 'Select your dates to see the price.',
      'cal.prev': 'Previous month', 'cal.next': 'Next month', 'cal.prev2': 'Previous', 'cal.next2': 'Next',
      'cal.free': 'Available', 'cal.booked': 'Booked', 'cal.selected': 'Selected',
      'cal.hintIn': 'Choose your arrival day.', 'cal.hintOut': 'Now choose your departure day (minimum {n} nights).',
      'cal.hintDone': 'Dates selected. Click another day to start over.',
      'cal.checkin': 'Check-in', 'cal.checkout': 'Check-out', 'cal.clear': 'Clear dates', 'cal.bookedDay': 'booked',
      'price.nights': 'nights', 'price.night': 'night', 'price.accom': 'Accommodation', 'price.cleaning': 'Cleaning fee',
      'price.tax': 'Tourist tax', 'price.total': 'Total', 'price.perNight': 'per night', 'price.taxNote': '{g} guests × {n} nights × {p}',
      'form.guests': 'Guests', 'form.phone': 'Mobile phone', 'form.name': 'Name', 'form.email': 'Email',
      'form.message': 'Message (optional)', 'form.messageReq': 'Message', 'form.consent': 'I have read and accept the', 'form.privacy': 'privacy policy',
      'guests.one': 'guest', 'guests.many': 'guests',
      'reviews.eyebrow': 'Reviews', 'reviews.title': 'What guests say', 'reviews.count': '{n} reviews', 'reviews.on': 'on',
      'poi.eyebrow': 'Nearby', 'poi.title': 'Discover the area', 'poi.filter': 'Filter by category', 'poi.bigmap': 'View larger map',
      'poi.all': 'All', 'poi.nature': 'Nature', 'poi.food': 'Food & Drink', 'poi.culture': 'Culture', 'poi.beaches': 'Beaches',
      'partners.eyebrow': 'Partners', 'partners.title': 'Perks for guests', 'partners.sub': 'Show the code to our local partners.',
      'partners.code': 'Code', 'partners.copy': 'Copy', 'partners.copied': 'Copied!', 'partners.visit': 'Visit',
      'info.eyebrow': 'Useful information', 'info.title': 'Before you arrive', 'info.times': 'Check-in and check-out',
      'info.checkin': 'Check-in:', 'info.checkout': 'Check-out:', 'info.rules': 'House rules',
      'info.cancel': 'Cancellation policy', 'info.directions': 'Getting here',
      'faq.title': 'Frequently asked questions',
      'contact.eyebrow': 'Contact', 'contact.title': 'Get in touch', 'contact.phone': 'Phone', 'contact.address': 'Address',
      'contact.send': 'Send message', 'contact.sent': 'Message sent. Thank you!',
      'footer.rnal': 'RNAL registration no.:', 'footer.complaints': 'Electronic Complaints Book',
      'footer.privacy': 'Privacy policy', 'footer.rights': 'All rights reserved.',
      'wa.label': 'Chat with us on WhatsApp', 'lb.close': 'Close', 'lb.label': 'Photo gallery',
      'cookie.label': 'Cookie notice', 'cookie.text': 'This site only uses essential storage (language preference). We do not use advertising or analytics cookies.', 'cookie.ok': 'Got it',
      'err.generic': 'Something went wrong. Please try again or contact us.',
      'err.invalid': 'Invalid data. Please check the form.', 'err.invalid_dates': 'Invalid dates.', 'err.past_date': 'The check-in date has passed.',
      'err.min_nights': 'Minimum stay: {n} nights.', 'err.max_nights': 'Maximum stay exceeded.', 'err.invalid_guests': 'Invalid number of guests.',
      'err.dates_unavailable': 'Those dates are no longer available. Please choose others.', 'err.availability_unavailable': 'We could not confirm availability right now. Please try again shortly.',
      'err.payments_disabled': 'Online payments are not active yet. Please use the booking request.', 'err.payment_error': 'Could not start the payment.'
    }
  };

  let lang = 'pt';
  try { const s = localStorage.getItem('lang'); if (s === 'pt' || s === 'en') lang = s; } catch (e) { /* sem storage */ }
  const listeners = [];

  const t = (key, vars) => {
    let s = (DICT[lang] && DICT[lang][key]) || DICT.pt[key] || key;
    if (vars) Object.keys(vars).forEach((k) => { s = s.replace('{' + k + '}', vars[k]); });
    return s;
  };
  // Resolve valor do config: string simples, {pt,en} ou array
  const L = (v) => (v && typeof v === 'object' && !Array.isArray(v) ? (v[lang] !== undefined ? v[lang] : v.pt) : v);
  const locale = () => (lang === 'pt' ? 'pt-PT' : 'en-GB');
  const money = (cents) => new Intl.NumberFormat(locale(), { style: 'currency', currency: (window.SITE_CONFIG.pricing.currency || 'EUR'), minimumFractionDigits: cents % 100 ? 2 : 0 }).format(cents / 100);
  const getPath = (obj, path) => path.split('.').reduce((o, k) => (o == null ? o : o[k]), obj);

  function apply() {
    document.documentElement.lang = lang === 'pt' ? 'pt-PT' : 'en';
    document.querySelectorAll('[data-i18n]').forEach((el) => { el.textContent = t(el.dataset.i18n); });
    document.querySelectorAll('[data-i18n-attr]').forEach((el) => {
      el.dataset.i18nAttr.split(',').forEach((pair) => { const [a, k] = pair.split(':'); el.setAttribute(a.trim(), t(k.trim())); });
    });
    document.querySelectorAll('[data-cfg]').forEach((el) => {
      const v = L(getPath(window.SITE_CONFIG, el.dataset.cfg));
      if (v != null) el.textContent = v;
    });
    const btn = document.getElementById('lang-toggle');
    if (btn) btn.firstElementChild.innerHTML = lang === 'pt' ? '<b>PT</b> / EN' : 'PT / <b>EN</b>';
    listeners.forEach((fn) => fn(lang));
  }

  function setLang(l) {
    lang = l;
    try { localStorage.setItem('lang', l); } catch (e) { /* ignorar */ }
    apply();
  }

  window.App = { t, L, money, locale, apply, setLang, getLang: () => lang, onLang: (fn) => listeners.push(fn), DICT };
})();
