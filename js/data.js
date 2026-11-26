/* Repós Cosméticos — dados do protótipo (preços e rendimentos ilustrativos) */

const IMG = {
  'hidratacao':       { src: 'assets/img/hidratacao.jpg',       w: 1080, h: 1349 },
  'kit-spa':          { src: 'assets/img/kit-spa.jpg',          w: 1080, h: 1350 },
  'amaciante':        { src: 'assets/img/amaciante.jpg',        w: 1080, h: 1349 },
  'higienizador':     { src: 'assets/img/higienizador.jpg',     w: 1080, h: 1349 },
  'fragrancias':      { src: 'assets/img/fragrancias.jpg',      w: 1080, h: 1349 },
  'maracuja':         { src: 'assets/img/maracuja.jpg',         w: 1080, h: 1349 },
  'frutas-vermelhas': { src: 'assets/img/frutas-vermelhas.jpg', w: 1080, h: 1349 },
  'pistache':         { src: 'assets/img/pistache.jpg',         w: 1080, h: 1349 },
  'melancia':         { src: 'assets/img/melancia.jpg',         w: 1080, h: 1350 },
  'esmaltes':         { src: 'assets/img/esmaltes.jpg',         w: 1440, h: 1800 },
  'neutralizante':    { src: 'assets/img/neutralizante.jpg',    w: 1080, h: 1349 },
  'esfoliante':       { src: 'assets/img/esfoliante.jpg',       w: 1080, h: 1350 },
  'oleos':            { src: 'assets/img/oleos.jpg',            w: 1000, h: 1000 },
  'meu-pomar':        { src: 'assets/img/meu-pomar.jpg',        w: 1000, h: 1000 },
  'brasilidades':     { src: 'assets/img/brasilidades.jpg',     w: 1000, h: 1000 },
  'b-ozonizado':      { src: 'assets/img/b-ozonizado.jpg',      w: 1920, h: 350 },
  'b-serum':          { src: 'assets/img/b-serum.jpg',          w: 1920, h: 350 },
  'b-rapidin':        { src: 'assets/img/b-rapidin.jpg',        w: 1920, h: 350 },
  'b-pedra-hume':     { src: 'assets/img/b-pedra-hume.jpg',     w: 1920, h: 350 },
  'b-depilacao':      { src: 'assets/img/b-depilacao.jpg',      w: 1950, h: 350 }
};

const LINES = {
  spa:    'Protocolo SPA dos Pés',
  pomar:  'Meu Pomar by Repós',
  brasil: 'Brasilidades Norte',
  unhas:  'Cuidados para Unhas',
  trat:   'Tratamento',
  oleos:  'Óleos Essenciais',
  depil:  'Cera Roll-On'
};

const CATS = [
  { id: 'spa',       name: 'Spa dos Pés',      color: '#A3C83C', img: ['kit-spa', .5, .56, 1.2],      desc: 'O protocolo completo em 5 passos: higienização, remoção de calosidades, neutralização, esfoliação e hidratação.' },
  { id: 'cuticulas', name: 'Cutículas',        color: '#F2A33A', img: ['maracuja', .5, .56, 1.15],    desc: 'Amaciantes e removedores que hidratam, amaciam e facilitam a remoção.' },
  { id: 'maos-pes',  name: 'Mãos & Pés',       color: '#E0345C', img: ['hidratacao', .55, .42, 1.25], desc: 'Hidratantes, séruns e cremes de tratamento para peles ressecadas e sensíveis.' },
  { id: 'unhas',     name: 'Esmaltes & Unhas', color: '#B23CB0', img: ['brasilidades', .5, .66, 1.4], desc: 'Esmaltes com D-pantenol e queratina, secantes e cuidados de acabamento.' },
  { id: 'depilacao', name: 'Depilação',        color: '#3E8DB5', img: ['b-depilacao', .78, .58, 5.6], desc: 'Ceras roll-on para pernas, braços e axilas, com resultado prolongado.' },
  { id: 'oleos',     name: 'Óleos Essenciais', color: '#2B5E2E', img: ['oleos', .56, .62, 1.25],      desc: 'Use em difusores, massagens ou aromaterapia.' }
];

/* Fábricas de produtos de linha (mesma fórmula, variações de fragrância/cor) */
const pomar = (id, label, color, img, short, rk) => ({
  id: 'removedor-' + id, name: 'Creme Removedor de Cutículas ' + label, label, short: 'Meu Pomar · ' + short,
  line: 'pomar', cats: ['cuticulas'], color, sw: color, sib: 'pomar', sibLabel: 'Fragrância',
  img: [img, .5, .5, 1], gallery: [[img, .5, .56, 1.5], ['fragrancias', .5, .5, 1], ['meu-pomar', .45, .5, 1.25]],
  variants: [{ v: '120 g', pf: 19.9, pj: 11.5, rend: 60 }], box: 12, tags: ['Lançamento'],
  desc: 'Creme removedor de cutículas da linha Meu Pomar: hidrata, amacia e facilita a remoção, com aroma de fruta que deixa o atendimento mais agradável.',
  bullets: ['Hidrata, amacia e facilita a remoção', 'Textura cremosa, fácil de aplicar', 'Fragrância de ' + label.toLowerCase() + ' que perfuma o atendimento'],
  ativos: 'Base cremosa emoliente com fragrância de ' + label.toLowerCase(),
  usoPF: 'Aplique uma pequena quantidade sobre as cutículas, aguarde de 1 a 2 minutos e empurre suavemente com a espátula.',
  usoPJ: 'Aplique uma pequena quantidade sobre as cutículas de cada unha, aguarde de 1 a 2 minutos e faça a remoção. Uma unidade de 120 g rende em média 60 atendimentos.',
  rk
});

const esmalte = (id, label, color, fx, fy, tone, rk) => ({
  id: 'esmalte-' + id, name: 'Esmalte ' + label, label, short: tone + ' · D-pantenol + queratina',
  line: 'brasil', cats: ['unhas'], color, sw: color, sib: 'brasil', sibLabel: 'Cor',
  img: ['esmaltes', fx, fy, 3.2], gallery: [['brasilidades', .5, .62, 1.3], ['esmaltes', .5, .5, 1]],
  variants: [{ v: 'Cremoso', pf: 8.9, pj: 4.9 }], box: 6, tags: ['Lançamento'],
  desc: 'Cores intensas, cheias de identidade e inspiradas na riqueza cultural do Norte do Brasil. Fórmula com D-pantenol e queratina, que cuidam da unha enquanto colorem.',
  bullets: ['Com D-pantenol + queratina', 'Cor intensa e cremosa', 'Coleção inspirada no Norte do Brasil'],
  ativos: 'D-pantenol e queratina',
  usoPF: 'Aplique sobre a unha limpa, depois da base. Duas camadas finas garantem cor uniforme. Finalize com cobertura e Seca Rapidin.',
  usoPJ: 'Aplique após a base em duas camadas finas. Para agilizar a agenda, finalize com o Seca Rapidin.',
  rk
});

const oleo = (id, label, color, fx, fy, z, short, rk) => ({
  id: 'oleo-' + id, name: 'Óleo Essencial de ' + label, label, short,
  line: 'oleos', cats: ['oleos'], color, sw: color, sib: 'oleos', sibLabel: 'Óleo',
  img: ['oleos', fx, fy, z], gallery: [['oleos', .5, .55, 1.25]],
  variants: [{ v: '10 ml', pf: 19.9, pj: 11.5 }], box: 6, tags: ['Lançamento'],
  desc: 'Óleo essencial Repós de ' + label.toLowerCase() + '. Use em difusores, massagens ou aromaterapia.',
  bullets: [short, 'Para difusores, massagens e aromaterapia', 'Frasco âmbar de 10 ml com conta-gotas'],
  ativos: 'Óleo essencial de ' + label.toLowerCase(),
  usoPF: 'Em difusores, pingue de 3 a 5 gotas. Para massagem, dilua em um óleo vegetal antes de aplicar na pele. Não ingerir.',
  usoPJ: 'Para massagens no protocolo, dilua de 3 a 5 gotas em 10 ml de óleo vegetal. No ambiente, use em difusor para criar a experiência sensorial do salão.',
  rk
});

const cera = (id, label, color, fx, rk) => ({
  id: 'cera-' + id, name: 'Cera Depilatória Roll-On ' + label, label, short: 'Refil roll-on · pernas, braços e axilas',
  line: 'depil', cats: ['depilacao'], color, sw: color, sib: 'cera', sibLabel: 'Versão',
  img: ['b-depilacao', fx, .58, 7.2], gallery: [['b-depilacao', .8, .58, 5.6]],
  variants: [{ v: '100 g', pf: 12.9, pj: 7.4, rend: 4 }], box: 12, tags: [],
  desc: 'Cera depilatória roll-on ' + label + ' com resultado profissional no conforto de casa. Ideal para pernas, braços e axilas, com resultado prolongado.',
  bullets: ['Ideal para pernas, braços e axilas', 'Resultado prolongado', 'Refil roll-on prático de 100 g'],
  ativos: 'Cera depilatória roll-on ' + label,
  usoPF: 'Aqueça o refil no aquecedor roll-on, teste a temperatura no pulso, aplique no sentido do crescimento dos pelos e remova com papel no sentido contrário.',
  usoPJ: 'Aqueça no aparelho roll-on, teste a temperatura, aplique no sentido do crescimento dos pelos e remova com tira de papel no sentido contrário. Um refil rende em média 4 atendimentos de pernas.',
  rk
});

const PRODUCTS = [
  /* ---------- Protocolo SPA dos Pés ---------- */
  {
    id: 'spray-higienizador', name: 'Spray Higienizador Antisséptico', short: 'Para mãos e pés · com óleo de melaleuca, sálvia e hortelã',
    line: 'spa', cats: ['spa', 'maos-pes'], color: '#2F9B4B', step: 1, stepName: 'Higienização', stepMain: true,
    img: ['higienizador', .5, .5, 1], gallery: [['higienizador', .47, .42, 1.6], ['kit-spa', .25, .52, 1.8]],
    variants: [{ v: '240 ml', pf: 34.9, pj: 20.9, rend: 120 }], box: 12, tags: ['Passo 01'],
    desc: 'Higieniza mãos e pés antes do cuidado com ação antisséptica e um frescor imediato que se sente na hora.',
    bullets: ['Ação antisséptica com frescor imediato', 'Higiene prática para mãos e pés', 'Auxilia no controle do mau odor'],
    ativos: 'Óleo de melaleuca, sálvia e hortelã',
    usoPF: 'Borrife sobre mãos e pés limpos antes da sua rotina de cuidados e deixe secar naturalmente.',
    usoPJ: 'Passo 01 do Protocolo SPA dos Pés. Aplique 2 a 3 borrifadas em cada pé ou mão da cliente no início do atendimento, antes de qualquer procedimento.',
    rk: { pf: 9, pj: 2 }
  },
  {
    id: 'amaciante-cuticulas', name: 'Amaciante de Cutículas e Calosidades', short: 'O queridinho das manicures · uso profissional',
    line: 'spa', cats: ['spa', 'cuticulas'], color: '#26A487', step: 2, stepName: 'Remoção de calosidades', stepMain: true,
    img: ['amaciante', .5, .5, 1], gallery: [['amaciante', .52, .56, 1.5], ['kit-spa', .49, .4, 1.6]],
    variants: [
      { v: '150 ml', pf: 14.9, pj: 8.9, rend: 30, note: '+30 ml grátis' },
      { v: '500 ml', pf: 29.9, pj: 17.5, rend: 100 },
      { v: '1,1 L', pf: 49.9, pj: 28.9, rend: 260, pro: true, note: '+200 ml grátis · edição limitada' }
    ],
    box: 6, tags: ['Passo 02', 'Mais vendido'],
    desc: 'Amacia cutículas e calosidades em poucos minutos e deixa a remoção mais rápida e confortável. É o produto que fez da Repós a marca queridinha das manicures.',
    bullets: ['Amacia cutículas e calosidades', 'Prático para usar no dia a dia', 'Biodegradável', 'Antibacteriano'],
    ativos: 'Fórmula emoliente biodegradável com ação antibacteriana',
    usoPF: 'Aplique sobre as cutículas ou áreas com calosidades, aguarde alguns minutos e remova o excesso com espátula ou lixa para os pés.',
    usoPJ: 'Passo 02 do Protocolo SPA dos Pés. Aplique diretamente nas calosidades ou cutículas, aguarde de 3 a 5 minutos e faça a remoção. Em seguida, use o Spray Neutralizante.',
    rk: { pf: 3, pj: 1 }
  },
  {
    id: 'spray-neutralizante', name: 'Spray Neutralizante Pós-Emoliente', short: 'Equilibra o pH da pele · para uso profissional',
    line: 'spa', cats: ['spa'], color: '#6F8797', step: 3, stepName: 'Neutralização', stepMain: true,
    img: ['neutralizante', .5, .5, 1], gallery: [['neutralizante', .52, .45, 1.5], ['kit-spa', .73, .52, 1.8]],
    variants: [{ v: '240 ml', pf: 36.9, pj: 21.9, rend: 120 }], box: 12, tags: ['Passo 03'],
    desc: 'Finaliza a etapa de remoção de calosidades neutralizando o emoliente e devolvendo o equilíbrio natural da pele.',
    bullets: ['Equilibra o pH da pele', 'Auxilia na neutralização do emoliente', 'Ideal para protocolos de SPA dos Pés'],
    ativos: 'Solução neutralizante de uso profissional',
    usoPF: 'Depois de usar o amaciante e remover as calosidades, borrife sobre a área tratada e deixe agir.',
    usoPJ: 'Passo 03 do Protocolo SPA dos Pés. Logo após a remoção das calosidades, borrife sobre toda a área tratada para neutralizar o emoliente antes da esfoliação.',
    rk: { pf: 12, pj: 3 }
  },
  {
    id: 'creme-esfoliante', name: 'Creme Esfoliante com Amêndoas', short: 'Para mãos, pés e corpo',
    line: 'spa', cats: ['spa', 'maos-pes'], color: '#B8784F', step: 4, stepName: 'Esfoliação', stepMain: true,
    img: ['esfoliante', .5, .5, 1], gallery: [['esfoliante', .3, .54, 2.0], ['kit-spa', .4, .76, 2.6]],
    variants: [{ v: '300 g', pf: 32.9, pj: 19.5, rend: 30 }, { v: '650 g', pf: 59.9, pj: 34.9, rend: 65, pro: true }],
    box: 6, tags: ['Passo 04'],
    desc: 'Esfoliação com amêndoas moídas que remove as células mortas e deixa a pele macia e com toque renovado.',
    bullets: ['Com amêndoas moídas', 'Remove células mortas', 'Pele macia e renovada'],
    ativos: 'Amêndoas moídas',
    usoPF: 'Sobre a pele úmida, massageie em movimentos circulares por 1 a 2 minutos e enxágue.',
    usoPJ: 'Passo 04 do Protocolo SPA dos Pés. Use cerca de 10 g por pé, massageie em movimentos circulares e remova com toalha úmida.',
    rk: { pf: 10, pj: 4 }
  },
  {
    id: 'creme-pes-copaiba', name: 'Creme para Pés com Óleo de Copaíba', label: 'Pés · Copaíba', short: 'Hidratação intensa para pés ressecados',
    line: 'spa', cats: ['spa', 'maos-pes'], color: '#F39A1E', sw: '#F39A1E', sib: 'cremes', sibLabel: 'Versão', step: 5, stepName: 'Hidratação', stepMain: true,
    img: ['hidratacao', .213, .415, 1.6], gallery: [['hidratacao', .5, .5, 1]],
    variants: [{ v: '110 g', pf: 24.9, pj: 14.5, rend: 22 }], box: 12, tags: ['Passo 05'],
    desc: 'Hidratação intensa para pés ressecados, com óleo de copaíba. Ajuda no cuidado dos pés com rachaduras e deixa a pele mais macia.',
    bullets: ['Hidratação intensa para pés ressecados', 'Auxilia no cuidado de pés com rachaduras', 'Pele mais macia e confortável'],
    ativos: 'Óleo de copaíba',
    usoPF: 'Aplique nos pés limpos e secos, massageando até a completa absorção. Para um resultado melhor, use à noite.',
    usoPJ: 'Passo 05 do Protocolo SPA dos Pés. Finalize o atendimento massageando cerca de 5 g por pé até a completa absorção.',
    rk: { pf: 4, pj: 10 }
  },
  {
    id: 'creme-maos-pes-sensiveis', name: 'Creme para Mãos e Pés · Peles Sensíveis', label: 'Peles sensíveis', short: 'Com aloe vera e óleos vegetais',
    line: 'spa', cats: ['maos-pes', 'spa'], color: '#9C3F7D', sw: '#9C3F7D', sib: 'cremes', sibLabel: 'Versão', step: 5, stepName: 'Hidratação',
    img: ['hidratacao', .713, .356, 1.55], gallery: [['hidratacao', .5, .5, 1]],
    variants: [{ v: '110 g', pf: 24.9, pj: 14.5, rend: 22 }], box: 12, tags: [],
    desc: 'Hidratante para mãos e pés pensado para peles sensíveis, enriquecido com aloe vera e óleos vegetais.',
    bullets: ['Enriquecido com aloe vera e óleos vegetais', 'Ajuda a reduzir o ressecamento e as asperezas', 'Hidratação prolongada para peles sensíveis'],
    ativos: 'Aloe vera e óleos vegetais',
    usoPF: 'Aplique sobre mãos e pés limpos, massageando até a completa absorção. Reaplique sempre que sentir a pele ressecada.',
    usoPJ: 'Alternativa ao Passo 05 para clientes de pele sensível. Massageie cerca de 5 g por pé ou 2 g por mão até a absorção.',
    rk: { pf: 13, pj: 14 }
  },
  {
    id: 'creme-maos-pes-ureia', name: 'Creme para Mãos e Pés com Ureia', label: 'Com ureia', short: 'Hidratação intensa para mãos e pés',
    line: 'spa', cats: ['maos-pes', 'spa'], color: '#B3232E', sw: '#B3232E', sib: 'cremes', sibLabel: 'Versão', step: 5, stepName: 'Hidratação',
    img: ['kit-spa', .608, .707, 2.4], gallery: [['hidratacao', .47, .6, 1.5], ['hidratacao', .5, .5, 1]],
    variants: [{ v: '110 g', pf: 26.9, pj: 15.9, rend: 22 }], box: 12, tags: [],
    desc: 'Creme com ureia para hidratação intensa de mãos e pés. Ajuda a reduzir o ressecamento e as asperezas e deixa a pele mais macia.',
    bullets: ['Hidratação intensa para mãos e pés', 'Pele mais macia e confortável', 'Auxilia na redução do ressecamento e asperezas'],
    ativos: 'Ureia',
    usoPF: 'Aplique sobre mãos e pés limpos e secos, massageando até a completa absorção.',
    usoPJ: 'Passo 05 para peles muito ressecadas. Massageie cerca de 5 g por pé até a completa absorção.',
    rk: { pf: 11, pj: 11 }
  },
  {
    id: 'parafina', name: 'Parafina Pele Macia', short: 'Nutrida e protegida · etapa de hidratação',
    line: 'spa', cats: ['spa', 'maos-pes'], color: '#E1335B', step: 5, stepName: 'Hidratação',
    img: ['hidratacao', .713, .763, 1.8], gallery: [['hidratacao', .5, .5, 1]],
    variants: [{ v: '100 g', pf: 22.9, pj: 13.5, rend: 10 }], box: 12, tags: [],
    desc: 'Parafina que deixa a pele macia, nutrida e protegida. Um toque de spa que potencializa a hidratação.',
    bullets: ['Pele macia, nutrida e protegida', 'Potencializa a hidratação', 'Sensação de conforto e relaxamento'],
    ativos: 'Parafina cosmética',
    usoPF: 'Aqueça conforme a embalagem, verifique a temperatura no pulso e aplique sobre mãos ou pés hidratados. Envolva com plástico e toalha por 10 a 15 minutos.',
    usoPJ: 'Etapa adicional do Passo 05, ideal para vender como upgrade do atendimento. Verifique sempre a temperatura antes de aplicar.',
    rk: { pf: 14, pj: 12 }
  },

  /* ---------- Meu Pomar ---------- */
  pomar('maracuja', 'Maracujá', '#F4A51C', 'maracuja', 'ritual de cuidado com toque tropical', { pf: 2, pj: 6 }),
  pomar('pistache', 'Pistache', '#8DAA2E', 'pistache', 'experiência cremosa e confortável', { pf: 15, pj: 5 }),
  pomar('frutas-vermelhas', 'Frutas Vermelhas', '#D8232F', 'frutas-vermelhas', 'fragrância envolvente e marcante', { pf: 16, pj: 15 }),
  pomar('melancia', 'Melancia', '#E8434B', 'melancia', 'sensação refrescante e agradável', { pf: 17, pj: 16 }),

  /* ---------- Brasilidades Norte ---------- */
  esmalte('india-da-repos', 'Índia da Repós', '#6CBF98', .285, .375, 'Verde menta', { pf: 18, pj: 17 }),
  esmalte('cauda-de-iara', 'Cauda de Iara', '#BFD8DF', .5, .375, 'Azul bebê', { pf: 19, pj: 18 }),
  esmalte('boto-encantado', 'Boto Encantado', '#B33DB0', .714, .375, 'Magenta', { pf: 5, pj: 19 }),
  esmalte('fervedouro-do-alecrim', 'Fervedouro do Alecrim', '#8DA2B3', .393, .745, 'Azul acinzentado', { pf: 20, pj: 20 }),
  esmalte('guarana', 'Guaraná', '#F24A4F', .608, .745, 'Vermelho coral', { pf: 21, pj: 21 }),

  /* ---------- Unhas e tratamento ---------- */
  {
    id: 'seca-rapidin', name: 'Seca Rapidin', short: 'Secante de esmalte instantâneo',
    line: 'unhas', cats: ['unhas'], color: '#E2338A',
    img: ['b-rapidin', .503, .5, 7], gallery: [['b-rapidin', .865, .5, 7]],
    variants: [{ v: '60 ml', pf: 17.9, pj: 10.5, rend: 200 }], box: 12, tags: ['Lançamento'],
    desc: 'Secante de esmalte instantâneo: borrifou, secou. Menos espera para a cliente e mais agilidade na agenda.',
    bullets: ['Secagem rápida do esmalte', 'Spray prático de 60 ml', 'Ajuda a evitar marcas e borrões'],
    ativos: 'Secante em spray',
    usoPF: 'Borrife a cerca de 15 cm das unhas logo após a esmaltação e aguarde alguns segundos.',
    usoPJ: 'Borrife a cerca de 15 cm das unhas logo após a cobertura. Uma unidade rende em média 200 aplicações.',
    rk: { pf: 7, pj: 7 }
  },
  {
    id: 'pedra-hume-gel', name: 'Pedra Hume em Gel', short: 'Com óleo de melaleuca · diga tchau aos "bifinhos"',
    line: 'unhas', cats: ['unhas', 'cuticulas'], color: '#1A93CF',
    img: ['b-pedra-hume', .5, .5, 7], gallery: [['b-pedra-hume', .12, .5, 7]],
    variants: [{ v: '10 g', pf: 12.9, pj: 7.5, rend: 100 }], box: 12, tags: [],
    desc: 'Pedra hume em gel com óleo de melaleuca, em bisnaga prática para usar durante a retirada de cutículas. Diga tchau aos "bifinhos"!',
    bullets: ['Com óleo de melaleuca', 'Bisnaga com aplicador prático', 'Ideal para usar durante a cutilagem'],
    ativos: 'Pedra hume e óleo de melaleuca',
    usoPF: 'Aplique uma pequena quantidade sobre o local logo após a retirada das cutículas.',
    usoPJ: 'Mantenha na bancada: aplique uma pequena quantidade no local logo após a cutilagem.',
    rk: { pf: 8, pj: 8 }
  },
  {
    id: 'serum-hidratante', name: 'Sérum Hidratante Mãos & Pés', short: 'Com óleo de amêndoa doce, coco e girassol',
    line: 'trat', cats: ['maos-pes'], color: '#7B3FA1',
    img: ['b-serum', .501, .514, 7], gallery: [['b-serum', .2, .5, 7]],
    variants: [{ v: '60 ml', pf: 29.9, pj: 17.9 }], box: 12, tags: [],
    desc: 'Sérum hidratante em spray para mãos e pés, com óleo de amêndoa doce, óleo de coco e óleo de girassol.',
    bullets: ['Óleo de amêndoa doce, coco e girassol', 'Spray prático para o dia a dia', 'Hidratação leve para mãos e pés'],
    ativos: 'Óleo de amêndoa doce, óleo de coco e óleo de girassol',
    usoPF: 'Borrife sobre mãos e pés e massageie até a absorção. Use sempre que quiser.',
    usoPJ: 'Finalização rápida do atendimento de mãos: 2 borrifadas e massagem leve.',
    rk: { pf: 6, pj: 13 }
  },
  {
    id: 'creme-ozonizado', name: 'Creme Hidratante Ozonizado', short: 'Com óleo de girassol ozonizado',
    line: 'trat', cats: ['maos-pes'], color: '#14A6CF',
    img: ['b-ozonizado', .5, .47, 7], gallery: [['b-ozonizado', .83, .5, 7]],
    variants: [{ v: '90 g', pf: 34.9, pj: 20.9 }], box: 12, tags: [],
    desc: 'A hidratação do creme ozonizado somada ao alto poder do óleo de girassol revela múltiplos benefícios para a pele.',
    bullets: ['Cicatrizante', 'Regenerador', 'Antioxidante'],
    ativos: 'Óleo de girassol ozonizado',
    usoPF: 'Aplique sobre a pele limpa e massageie até a absorção.',
    usoPJ: 'Indicado para finalizar procedimentos de podologia e cuidados com pés. Aplique sobre a pele limpa.',
    rk: { pf: 22, pj: 9 }
  },

  /* ---------- Óleos Essenciais ---------- */
  oleo('alecrim', 'Alecrim', '#2E7D32', .26, .67, 1.8, 'Regulador de oleosidade · estimulante capilar', { pf: 23, pj: 22 }),
  oleo('copaiba', 'Copaíba', '#E8711C', .455, .635, 2.2, 'Ação antimicrobiana · cicatrizante', { pf: 24, pj: 23 }),
  oleo('melaleuca', 'Melaleuca', '#A9B2AB', .605, .59, 2.4, 'Antisséptico · antifúngico', { pf: 25, pj: 24 }),
  oleo('menta-piperita', 'Menta Piperita', '#1BA39C', .728, .535, 2.6, 'Refrescante e revigorante', { pf: 26, pj: 25 }),
  oleo('lavanda', 'Lavanda', '#7A5BB8', .828, .48, 3.0, 'Calmante e relaxante', { pf: 27, pj: 26 }),

  /* ---------- Depilação ---------- */
  cera('intensive', 'Intensive', '#A9BC93', .615, { pf: 28, pj: 27 }),
  cera('morango', 'Morango', '#C9604F', .683, { pf: 29, pj: 28 }),
  cera('lama-negra', 'Lama Negra', '#2B3A55', .74, { pf: 30, pj: 29 }),
  cera('mel', 'Mel', '#E8B83A', .799, { pf: 31, pj: 30 }),
  cera('algas', 'Algas', '#2E8B57', .859, { pf: 32, pj: 31 }),
  cera('chocolate-branco', 'Chocolate Branco', '#E2C06A', .922, { pf: 33, pj: 32 }),

  /* ---------- Kit ---------- */
  {
    id: 'kit-protocolo-spa', name: 'Kit Protocolo SPA dos Pés', short: 'Os 5 passos completos em um só kit',
    line: 'spa', cats: ['spa'], color: '#A3C83C', kit: true,
    img: ['kit-spa', .5, .5, 1], gallery: [['kit-spa', .5, .62, 1.3], ['hidratacao', .5, .5, 1]],
    variants: [{ v: 'Kit 5 itens', pf: 119.9, pj: 109.9, cmpPf: 144.5, cmpPj: 124.5, rend: 40 }], box: 1, tags: ['Kit'],
    kitPF: ['Spray Higienizador 240 ml', 'Amaciante de Cutículas 150 ml', 'Spray Neutralizante 240 ml', 'Creme Esfoliante 300 g', 'Creme para Pés com Copaíba 110 g'],
    kitPJ: ['Spray Higienizador 240 ml', 'Amaciante de Cutículas 1,1 L', 'Spray Neutralizante 240 ml', 'Creme Esfoliante 650 g', 'Creme para Pés com Copaíba 110 g'],
    desc: 'Os cinco passos do Protocolo SPA dos Pés em um só kit: higienização, remoção de calosidades, neutralização, esfoliação e hidratação.',
    bullets: ['5 produtos que trabalham juntos', 'Passo a passo ilustrado na caixa', 'Economia em relação à compra avulsa'],
    ativos: 'Melaleuca, sálvia, hortelã, amêndoas e óleo de copaíba',
    usoPF: 'Siga a ordem dos passos: higienize, aplique o amaciante e remova as calosidades, neutralize, esfolie e finalize com o creme.',
    usoPJ: 'Kit pensado para montar o serviço de SPA dos Pés no salão. Rende em média 40 protocolos completos com os tamanhos profissionais.',
    rk: { pf: 1, pj: 9 }
  }
];
