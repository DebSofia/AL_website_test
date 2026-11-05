/* =====================================================================
   CONFIGURAÇÃO DO SITE - edite SÓ este ficheiro para personalizar tudo.
   Textos em { pt: '...', en: '...' } ficam traduzidos; strings simples
   valem para os dois idiomas. Segredos (Stripe, iCal) ficam em variáveis
   de ambiente do Netlify, nunca aqui.
   ===================================================================== */

// Fotos de exemplo (picsum.photos). >>> SUBSTITUIR por fotos reais <<<
// Coloque as suas fotos na pasta /images (ex.: images/sala.jpg) e use
// img('images/sala.jpg') ou apenas o caminho como string.
const photo = (seed, w, h) => `https://picsum.photos/seed/${seed}/${w}/${h}`;

window.SITE_CONFIG = {
  apiBase: '/api', // prefixo das funções Netlify

  property: {
    name: 'Casa da Ribeira',
    tagline: { pt: 'Um refúgio de pedra e água, à beira do rio', en: 'A stone-and-water retreat on the riverbank' },
    description: {
      pt: 'Alojamento local em Ribeira de Cima: casa de pedra restaurada junto ao rio, com jardim, lareira e silêncio. Reserve direto, sem comissões.',
      en: 'Holiday home in Ribeira de Cima: restored stone house by the river with garden, fireplace and peace and quiet. Book direct, no fees.'
    },
    address: 'Rua da Ribeira 12, Ribeira de Cima, 4990-000 Ponte de Lima',
    lat: 41.7676, lon: -8.5841,                  // coordenadas (mapa + SEO)
    rnal: 'XXXXX/AL',                            // Nº de registo RNAL (obrigatório)
    siteUrl: 'https://casadaribeira.example.com',
    heroImage: photo('river', 1920, 1080),       // PLACEHOLDER
    ogImage: photo('river', 1200, 630)           // PLACEHOLDER (usar URL absoluto)
  },

  contact: {
    phone: '+351 912 345 678',
    email: 'reservas@casadaribeira.example.com',
    whatsapp: '351912345678',                    // só dígitos, com indicativo
    whatsappMessage: { pt: 'Olá! Gostava de saber mais sobre a Casa da Ribeira.', en: 'Hello! I would like to know more about Casa da Ribeira.' }
  },

  social: { instagram: 'https://instagram.com/', facebook: 'https://facebook.com/' },

  // Canais externos
  external: {
    airbnb: 'https://www.airbnb.pt/rooms/00000000',
    booking: 'https://www.booking.com/hotel/pt/casa-da-ribeira.html',
    complaints: 'https://www.livroreclamacoes.pt'
  },

  // ---------------------------------------------------------------
  // PREÇOS - tem de ser IGUAL a netlify/functions/_shared/pricing.js
  // (o servidor recalcula; aqui é só para mostrar o preço).
  // ---------------------------------------------------------------
  pricing: {
    currency: 'EUR',
    baseNightly: 95,
    seasons: [
      { name: { pt: 'Verão', en: 'Summer' }, from: '07-01', to: '09-15', nightly: 130, minNights: 3 },
      { name: { pt: 'Natal / Ano Novo', en: 'Christmas / New Year' }, from: '12-20', to: '01-03', nightly: 120, minNights: 3 }
    ],
    cleaningFee: 40,
    touristTax: { enabled: true, perPersonPerNight: 2, maxNights: 7 },
    minNights: 2,
    maxNights: 30,
    maxGuests: 6
  },

  capacity: { guests: 6, bedrooms: 3, beds: 4, baths: 2 },

  gallery: [
    { src: photo('livingroom', 1200, 800), thumb: photo('livingroom', 600, 450), alt: { pt: 'Sala de estar com lareira', en: 'Living room with fireplace' } },
    { src: photo('kitchen', 1200, 800), thumb: photo('kitchen', 600, 450), alt: { pt: 'Cozinha equipada', en: 'Fully equipped kitchen' } },
    { src: photo('bedroom', 1200, 800), thumb: photo('bedroom', 600, 450), alt: { pt: 'Quarto principal', en: 'Main bedroom' } },
    { src: photo('garden', 1200, 800), thumb: photo('garden', 600, 450), alt: { pt: 'Jardim com mesa exterior', en: 'Garden with outdoor table' } },
    { src: photo('riverside', 1200, 800), thumb: photo('riverside', 600, 450), alt: { pt: 'Margem do rio junto à casa', en: 'Riverbank next to the house' } },
    { src: photo('terrace', 1200, 800), thumb: photo('terrace', 600, 450), alt: { pt: 'Terraço ao pôr do sol', en: 'Terrace at sunset' } },
    { src: photo('bathroom', 1200, 800), thumb: photo('bathroom', 600, 450), alt: { pt: 'Casa de banho em pedra', en: 'Stone bathroom' } },
    { src: photo('village', 1200, 800), thumb: photo('village', 600, 450), alt: { pt: 'Aldeia vista da casa', en: 'Village seen from the house' } }
  ],

  house: {
    image: photo('stonehouse', 900, 1100), // PLACEHOLDER
    imageAlt: { pt: 'Fachada da Casa da Ribeira', en: 'Casa da Ribeira facade' },
    story: {
      pt: [
        'A Casa da Ribeira foi construída em 1890 por uma família de moleiros, a poucos passos do rio que durante gerações moveu a sua azenha. As paredes de granito mantêm-se de pé, com vigas de castanho e soalhos originais.',
        'Em 2019 foi cuidadosamente restaurada, preservando a alma da casa e acrescentando o conforto de hoje: cozinha completa, ar condicionado, Wi‑Fi rápido e um jardim onde se ouve a água correr.'
      ],
      en: [
        'Casa da Ribeira was built in 1890 by a family of millers, steps from the river that powered their mill for generations. The granite walls still stand, with chestnut beams and original floors.',
        'In 2019 it was carefully restored, keeping the soul of the house and adding modern comfort: full kitchen, air conditioning, fast Wi‑Fi and a garden where you can hear the water run.'
      ]
    },
    facts: [
      { value: '1890', label: { pt: 'Ano de construção', en: 'Year built' } },
      { value: '140 m²', label: { pt: 'Área interior', en: 'Indoor area' } },
      { value: '2 000 m²', label: { pt: 'Jardim', en: 'Garden' } }
    ]
  },

  // icon: wifi ac kitchen parking garden pool pet tv washer bbq heating coffee work
  amenities: [
    { icon: 'wifi', label: { pt: 'Wi‑Fi rápido', en: 'Fast Wi‑Fi' } },
    { icon: 'ac', label: { pt: 'Ar condicionado', en: 'Air conditioning' } },
    { icon: 'kitchen', label: { pt: 'Cozinha equipada', en: 'Equipped kitchen' } },
    { icon: 'parking', label: { pt: 'Estacionamento gratuito', en: 'Free parking' } },
    { icon: 'garden', label: { pt: 'Jardim privado', en: 'Private garden' } },
    { icon: 'pool', label: { pt: 'Piscina partilhada', en: 'Shared pool' } },
    { icon: 'pet', label: { pt: 'Aceitamos animais', en: 'Pet-friendly' } },
    { icon: 'tv', label: { pt: 'TV por cabo', en: 'Cable TV' } },
    { icon: 'washer', label: { pt: 'Máquina de lavar', en: 'Washing machine' } },
    { icon: 'bbq', label: { pt: 'Churrasqueira', en: 'BBQ' } },
    { icon: 'heating', label: { pt: 'Lareira e aquecimento', en: 'Fireplace and heating' } },
    { icon: 'coffee', label: { pt: 'Café e chá de boas-vindas', en: 'Welcome coffee and tea' } }
  ],

  hosts: {
    image: photo('hosts', 700, 700), // PLACEHOLDER
    imageAlt: { pt: 'Retrato dos anfitriões Marta e João', en: 'Portrait of your hosts Marta and João' },
    names: 'Marta & João',
    bio: {
      pt: 'Somos a Marta e o João, e esta casa é da família há quatro gerações. Gostamos de receber como em casa: deixamos a lareira pronta, um cesto com produtos locais e as nossas dicas favoritas da região.',
      en: 'We are Marta and João, and this house has been in the family for four generations. We love welcoming guests like family: a ready fireplace, a basket of local products and our favourite tips for the area.'
    },
    languages: { pt: ['Português', 'Inglês', 'Francês', 'Espanhol'], en: ['Portuguese', 'English', 'French', 'Spanish'] },
    responseTime: { pt: 'Menos de 2 horas', en: 'Within 2 hours' },
    superhost: true
  },

  reviews: {
    sources: [
      { name: 'Airbnb', rating: 4.9, count: 48, url: 'https://www.airbnb.pt/' },
      { name: 'Booking.com', rating: 9.6, count: 31, scale: 10, url: 'https://www.booking.com/' },
      { name: 'Google', rating: 4.8, count: 17, url: 'https://www.google.com/maps' }
    ],
    items: [
      { author: 'Sophie', origin: { pt: 'França', en: 'France' }, source: 'Airbnb', date: '2026-08', rating: 5,
        text: { pt: 'Um sítio mágico. Acordar com o som do rio e tomar o pequeno-almoço no jardim foi o melhor da viagem.', en: 'A magical place. Waking up to the sound of the river and having breakfast in the garden was the highlight of our trip.' } },
      { author: 'Tiago', origin: { pt: 'Porto', en: 'Porto' }, source: 'Booking.com', date: '2026-06', rating: 5,
        text: { pt: 'Casa lindíssima, super limpa e com todos os pormenores. Os anfitriões foram incansáveis nas dicas.', en: 'Gorgeous, spotless house with every detail covered. The hosts gave us endless tips.' } },
      { author: 'Hannah', origin: { pt: 'Alemanha', en: 'Germany' }, source: 'Google', date: '2026-05', rating: 5,
        text: { pt: 'Perfeito para desligar. A lareira à noite e os passeios junto ao rio são inesquecíveis.', en: 'Perfect to switch off. The fireplace at night and walks along the river are unforgettable.' } },
      { author: 'Miguel', origin: { pt: 'Lisboa', en: 'Lisbon' }, source: 'Airbnb', date: '2025-10', rating: 5,
        text: { pt: 'Fomos com o cão e foi tudo fácil. Voltamos de certeza na próxima vindima.', en: 'We brought our dog and everything was easy. We will be back for the next grape harvest.' } },
      { author: 'James', origin: { pt: 'Reino Unido', en: 'United Kingdom' }, source: 'Booking.com', date: '2025-09', rating: 4,
        text: { pt: 'Localização excelente e casa com muito carácter. Só a estrada de acesso é um pouco estreita.', en: 'Excellent location and a house full of character. Only the access road is a little narrow.' } }
    ]
  },

  // cat: nature | food | culture | beaches
  poi: [
    { cat: 'nature', name: { pt: 'Passadiço da Ribeira', en: 'Riverside boardwalk' }, distance: { pt: '0,3 km · 5 min a pé', en: '0.3 km · 5 min walk' }, text: { pt: 'Percurso plano junto ao rio, ideal ao nascer do sol.', en: 'Flat riverside path, ideal at sunrise.' } },
    { cat: 'culture', name: { pt: 'Ponte Romana', en: 'Roman bridge' }, distance: { pt: '6 km · 10 min de carro', en: '6 km · 10 min drive' }, text: { pt: 'Ponte medieval sobre o rio e centro histórico da vila.', en: 'Medieval bridge over the river and the village historic centre.' } },
    { cat: 'food', name: { pt: 'Tasca do Moleiro', en: 'Tasca do Moleiro' }, distance: { pt: '1,2 km · 15 min a pé', en: '1.2 km · 15 min walk' }, text: { pt: 'Cozinha minhota tradicional, com sarrabulho e vinho verde da casa.', en: 'Traditional northern cooking with local green wine.' } },
    { cat: 'nature', name: { pt: 'Parque Nacional da Peneda-Gerês', en: 'Peneda-Gerês National Park' }, distance: { pt: '45 km · 50 min de carro', en: '45 km · 50 min drive' }, text: { pt: 'Cascatas, trilhos e miradouros no único parque nacional português.', en: 'Waterfalls, trails and viewpoints in Portugal’s only national park.' } },
    { cat: 'beaches', name: { pt: 'Praia do Cabedelo', en: 'Cabedelo beach' }, distance: { pt: '35 km · 35 min de carro', en: '35 km · 35 min drive' }, text: { pt: 'Extensa praia de areia, famosa para kitesurf e windsurf.', en: 'Long sandy beach, famous for kitesurf and windsurf.' } },
    { cat: 'culture', name: { pt: 'Jardins e Museu do Linho', en: 'Gardens and Linen Museum' }, distance: { pt: '8 km · 12 min de carro', en: '8 km · 12 min drive' }, text: { pt: 'Jardins temáticos e a história da tradição têxtil da região.', en: 'Themed gardens and the story of the region’s textile tradition.' } },
    { cat: 'food', name: { pt: 'Adega Quinta do Rio', en: 'Quinta do Rio winery' }, distance: { pt: '4 km · 7 min de carro', en: '4 km · 7 min drive' }, text: { pt: 'Vinhos verdes Alvarinho e Loureiro diretamente do produtor.', en: 'Alvarinho and Loureiro green wines straight from the producer.' } },
    { cat: 'beaches', name: { pt: 'Praia Fluvial da Ribeira', en: 'Ribeira river beach' }, distance: { pt: '0,8 km · 10 min a pé', en: '0.8 km · 10 min walk' }, text: { pt: 'Zona de banhos no rio com relvado e bar de apoio no verão.', en: 'River swimming spot with lawn and summer snack bar.' } }
  ],

  partners: [
    { type: { pt: 'Restaurante', en: 'Restaurant' }, name: 'Tasca do Moleiro', img: photo('restaurant', 600, 400),
      text: { pt: 'Mesa reservada e entrada da casa para os nossos hóspedes.', en: 'Reserved table and a starter on the house for our guests.' },
      benefit: { pt: 'Entrada oferecida', en: 'Free starter' }, code: 'RIBEIRA10', url: '' },
    { type: { pt: 'Prova de vinhos', en: 'Wine tasting' }, name: 'Quinta do Rio', img: photo('winery', 600, 400),
      text: { pt: 'Visita à adega e prova de 4 vinhos com petiscos.', en: 'Winery visit and tasting of 4 wines with snacks.' },
      benefit: { pt: '15% de desconto', en: '15% off' }, code: 'CASARIBEIRA', url: '' },
    { type: { pt: 'Caiaque', en: 'Kayak' }, name: 'Rio Aventura', img: photo('kayak', 600, 400),
      text: { pt: 'Descida guiada do rio em caiaque, com equipamento incluído.', en: 'Guided kayak trip down the river, equipment included.' },
      benefit: { pt: '10% de desconto', en: '10% off' }, code: 'RIBEIRA10', url: '' },
    { type: { pt: 'Bicicletas', en: 'Bikes' }, name: 'Pedalar Minho', img: photo('bikes', 600, 400),
      text: { pt: 'Aluguer de bicicletas elétricas e entrega na casa.', en: 'E-bike rental with delivery to the house.' },
      benefit: { pt: 'Entrega gratuita', en: 'Free delivery' }, code: 'CASARIBEIRA', url: '' }
  ],

  info: {
    checkIn: '15:00 – 20:00',
    checkOut: '11:00',
    selfCheckIn: { pt: 'Receção pessoal ou caixa de chaves (combinado previamente).', en: 'In-person welcome or key box (arranged in advance).' },
    rules: {
      pt: ['Proibido fumar no interior da casa.', 'Silêncio entre as 22h00 e as 08h00.', 'Festas e eventos não são permitidos.', 'Animais de estimação aceites mediante aviso prévio.', 'Máximo de hóspedes: 6 pessoas.'],
      en: ['No smoking inside the house.', 'Quiet hours from 22:00 to 08:00.', 'No parties or events.', 'Pets welcome with prior notice.', 'Maximum guests: 6 people.']
    },
    cancellation: {
      pt: ['Cancelamento gratuito até 14 dias antes da chegada: reembolso total.', 'Entre 14 e 7 dias: reembolso de 50%.', 'Menos de 7 dias ou não comparência: sem reembolso.'],
      en: ['Free cancellation up to 14 days before arrival: full refund.', 'Between 14 and 7 days: 50% refund.', 'Less than 7 days or no-show: no refund.']
    },
    directions: {
      pt: ['De carro: A3 saída 10 (Ponte de Lima), depois 6 km pela EN201 até Ribeira de Cima. Estacionamento gratuito no local.', 'De comboio: estação de Viana do Castelo (35 km); recomendamos táxi ou carro de aluguer.', 'De avião: Aeroporto do Porto (65 km, cerca de 55 min).'],
      en: ['By car: A3 exit 10 (Ponte de Lima), then 6 km on EN201 to Ribeira de Cima. Free parking on site.', 'By train: Viana do Castelo station (35 km); we recommend a taxi or rental car.', 'By air: Porto Airport (65 km, about 55 min).']
    }
  },

  faq: [
    { q: { pt: 'Posso reservar diretamente e pagar online?', en: 'Can I book direct and pay online?' }, a: { pt: 'Sim. Escolha as datas no calendário e pague com cartão ou MB WAY, ou envie um pedido de reserva e pague por transferência bancária.', en: 'Yes. Pick your dates on the calendar and pay by card or MB WAY, or send a booking request and pay by bank transfer.' } },
    { q: { pt: 'A casa aceita animais?', en: 'Are pets allowed?' }, a: { pt: 'Sim, mediante aviso prévio. Pedimos que não subam para as camas.', en: 'Yes, with prior notice. Please keep them off the beds.' } },
    { q: { pt: 'Há roupa de cama e toalhas?', en: 'Are linen and towels provided?' }, a: { pt: 'Sim, roupa de cama e toalhas de banho estão incluídas.', en: 'Yes, bed linen and bath towels are included.' } },
    { q: { pt: 'O que é a taxa turística?', en: 'What is the tourist tax?' }, a: { pt: 'Taxa municipal de 2 € por pessoa e por noite (máximo 7 noites). Menores de 13 anos estão isentos.', en: 'Municipal tax of €2 per person per night (maximum 7 nights). Children under 13 are exempt.' } },
    { q: { pt: 'É possível chegar mais tarde?', en: 'Can I arrive late?' }, a: { pt: 'Sim, avise-nos com antecedência. Temos caixa de chaves para chegadas depois das 20h00.', en: 'Yes, let us know in advance. We have a key box for arrivals after 20:00.' } },
    { q: { pt: 'Há berço ou cadeira de bebé?', en: 'Is there a cot or high chair?' }, a: { pt: 'Sim, sem custo. Indique no pedido de reserva.', en: 'Yes, free of charge. Please mention it in your request.' } }
  ],

  // Dados de demonstração (só usados se /api/availability falhar)
  demoMode: { enabled: true }
};
