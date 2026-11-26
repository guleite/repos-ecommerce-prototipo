/* Repós Cosméticos — protótipo de e-commerce com experiência PF (B2C) e PJ (B2B) */
(() => {
  'use strict';

  /* ---------- utilidades ---------- */
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const LS = {
    get(k, d) { try { const v = localStorage.getItem(k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* armazenamento indisponível */ } }
  };
  const brl = n => n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  const r2 = n => Math.round(n * 100) / 100;
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const norm = s => String(s).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
  const pct = n => Math.round(n * 100) + '%';

  const PM = Object.fromEntries(PRODUCTS.map(p => [p.id, p]));
  const CM = Object.fromEntries(CATS.map(c => [c.id, c]));
  const POMAR = ['removedor-maracuja', 'removedor-pistache', 'removedor-frutas-vermelhas', 'removedor-melancia'];
  const BRASIL = ['esmalte-india-da-repos', 'esmalte-cauda-de-iara', 'esmalte-boto-encantado', 'esmalte-fervedouro-do-alecrim', 'esmalte-guarana'];
  /* imagens cujo selo "PASSO" fica no canto superior esquerdo */
  const TOP_BADGE = new Set(['amaciante', 'esfoliante', 'kit-spa']);

  /* ---------- estado ---------- */
  const S = {
    profile: LS.get('repos.profile', 'pf') === 'pj' ? 'pj' : 'pf',
    cnpj: LS.get('repos.cnpj', ''),
    cart: LS.get('repos.cart', []).filter(it => PM[it.id] && PM[it.id].variants[it.vi]),
    fav: new Set(LS.get('repos.fav', [])),
    pick: { pomar: 'removedor-maracuja', brasil: 'esmalte-boto-encantado' },
    homeTab: 'todos',
    pdp: null
  };
  const isPJ = () => S.profile === 'pj';
  const t = (pf, pj) => (isPJ() ? pj : pf);

  /* ---------- ícones ---------- */
  const ICONS = {
    search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 3.6-7 8-7s8 3 8 7"/>',
    bag: '<path d="M5 8h14l-1 13H6L5 8Z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/>',
    heart: '<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10Z"/>',
    close: '<path d="M6 6l12 12M18 6 6 18"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    minus: '<path d="M5 12h14"/>',
    arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    chev: '<path d="m9 6 6 6-6 6"/>',
    truck: '<path d="M3 6h11v10H3zM14 10h4l3 3v3h-7"/><circle cx="7" cy="18" r="2"/><circle cx="17" cy="18" r="2"/>',
    card: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 10h18M7 15h3"/>',
    pix: '<path d="M12 3 21 12 12 21 3 12Z"/><path d="m8.5 12 3.5 3.5 3.5-3.5L12 8.5Z"/>',
    shield: '<path d="M12 3 5 6v6c0 4.5 3 7.5 7 9 4-1.5 7-4.5 7-9V6l-7-3Z"/><path d="m9 12 2 2 4-4"/>',
    factory: '<path d="M3 21V10l6 4v-4l6 4V5h6v16Z"/><path d="M7 17h2M12 17h2M17 17h1"/>',
    box: '<path d="M3 7.5 12 3l9 4.5v9L12 21l-9-4.5Z"/><path d="m3 7.5 9 4.5 9-4.5M12 12v9"/>',
    doc: '<path d="M7 3h7l5 5v13H7z"/><path d="M14 3v5h5M10 13h6M10 17h6"/>',
    chat: '<path d="M4 20l1.3-3.9A8 8 0 1 1 8 19z"/><path d="M9 10h.01M12 10h.01M15 10h.01"/>',
    building: '<path d="M4 21V5l8-3v19M12 9h8v12M8 8h.01M8 12h.01M8 16h.01M16 13h.01M16 17h.01M2 21h20"/>',
    star: '<path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9Z"/>',
    check: '<path d="m5 12 5 5 9-10"/>',
    drop: '<path d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11Z"/>',
    repeat: '<path d="M20 11a8 8 0 0 0-14.6-4.5L4 8M4 4v4h4M4 13a8 8 0 0 0 14.6 4.5L20 16M20 20v-4h-4"/>',
    download: '<path d="M12 4v11M7 10l5 5 5-5M5 20h14"/>',
    ig: '<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r=".8" fill="currentColor"/>',
    sparkle: '<path d="M12 3c.5 4.5 4.5 8.5 9 9-4.5.5-8.5 4.5-9 9-.5-4.5-4.5-8.5-9-9 4.5-.5 8.5-4.5 9-9Z"/>',
    swap: '<path d="M7 7h12l-3-3M17 17H5l3 3"/>',
    filter: '<path d="M4 6h16M7 12h10M10 18h4"/>',
    gift: '<rect x="3" y="8" width="18" height="13" rx="1.5"/><path d="M3 12h18M12 8v13M12 8S10.5 3 7.5 4.5 9 8 12 8Zm0 0s1.5-5 4.5-3.5S15 8 12 8Z"/>',
    calc: '<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M8 7h8M8.5 11h.01M12 11h.01M15.5 11h.01M8.5 14.5h.01M12 14.5h.01M15.5 14.5h.01M8.5 18h.01M12 18h.01M15.5 18h.01"/>'
  };
  const ic = (n, s = 20) => `<svg class="ic" width="${s}" height="${s}" viewBox="0 0 24 24" fill="${n === 'star' ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[n]}</svg>`;

  /* Grafismo de arcos inspirado no leque dos rótulos */
  const fan = () => {
    let s = '';
    for (let i = 0; i < 18; i++) s += `<ellipse cx="100" cy="100" rx="96" ry="30" transform="rotate(${i * 10} 100 100)"/>`;
    return `<svg class="fan" viewBox="0 0 200 200" fill="none" stroke="currentColor" stroke-width=".7" aria-hidden="true">${s}</svg>`;
  };

  /* ---------- moldura com recorte focal ----------
     f = [imagem, foco x (0-1), foco y (0-1), zoom]; aspect = altura / largura */
  function fr(f, aspect = 1.25, alt = '', cls = '') {
    const [k, fx, fy, z] = f;
    const im = IMG[k];
    const r = im.w / im.h;
    const Z = Math.max(z, aspect * r, 1);
    const ih = Z / r;
    let L = .5 - fx * Z; L = Math.min(0, Math.max(1 - Z, L));
    let T = aspect / 2 - fy * ih; T = Math.min(0, Math.max(aspect - ih, T));
    return `<div class="fr ${cls}" style="aspect-ratio:${(1 / aspect).toFixed(4)}"><div class="fr-in"><img src="${im.src}" alt="${esc(alt)}" loading="lazy" decoding="async" style="width:${(Z * 100).toFixed(2)}%;left:${(L * 100).toFixed(2)}%;top:${(T / aspect * 100).toFixed(2)}%"></div></div>`;
  }

  /* ---------- preços ---------- */
  function tiersOf(p) {
    const a = p.box > 1 ? p.box : 3, b = p.box > 1 ? p.box * 4 : 10;
    return [{ from: 1, to: a - 1, off: 0 }, { from: a, to: b - 1, off: .07 }, { from: b, to: Infinity, off: .14 }];
  }
  const tierIdx = (p, q) => { const ts = tiersOf(p); return q >= ts[2].from ? 2 : q >= ts[1].from ? 1 : 0; };
  const pjUnit = (p, v, q = 1) => r2(v.pj * (1 - tiersOf(p)[tierIdx(p, q)].off));
  const defV = p => { if (isPJ()) { const i = p.variants.findIndex(v => v.pro); return i >= 0 ? i : p.variants.length - 1; } return 0; };
  const unitWord = (p, n = 1) => (p.kit ? (n === 1 ? 'kit' : 'kits') : 'un');
  function installments(price) {
    const n = Math.min(3, Math.floor(price / 15));
    return n >= 2 ? `${n}x de ${brl(price / n)} sem juros` : '';
  }
  function tierLabel(p, i) {
    if (p.box > 1) return [`1 a ${p.box - 1} un`, `${p.box} a ${p.box * 4 - 1} un · 1 a 3 cx`, `${p.box * 4}+ un · 4+ cx`][i];
    return ['1 a 2 kits', '3 a 9 kits', '10+ kits'][i];
  }
  function rating(p) {
    let h = 7;
    for (const c of p.id) h = (h * 31 + c.charCodeAt(0)) >>> 0;
    return { r: 4.6 + (h % 4) / 10, n: 38 + (h % 520) };
  }
  const fmtR = r => r.toFixed(1).replace('.', ',');
  const skuOf = p => String(PRODUCTS.indexOf(p) + 101).padStart(4, '0');
  const countIn = id => PRODUCTS.filter(p => p.cats.includes(id)).length;
  const rankList = list => [...list].sort((a, b) => ((a.rk && a.rk[S.profile]) || 99) - ((b.rk && b.rk[S.profile]) || 99));

  function priceHTML(p, vi) {
    const v = p.variants[vi];
    if (isPJ()) {
      const bx = pjUnit(p, v, p.box > 1 ? p.box : 3);
      return `<div class="pr"><span class="pj-lbl">Preço CNPJ</span><b>${brl(v.pj)}<em>/${unitWord(p)}</em></b><small>${p.box > 1 ? `Cx c/ ${p.box}: <strong>${brl(bx)}</strong>/un` : `3+ kits: <strong>${brl(bx)}</strong>`}</small></div>`;
    }
    const inst = installments(v.pf);
    return `<div class="pr">${v.cmpPf ? `<s>${brl(v.cmpPf)}</s>` : ''}<b>${brl(v.pf)}</b><small>${inst || `<strong>${brl(v.pf * .95)}</strong> no Pix`}</small></div>`;
  }

  function tagsHTML(p, vi) {
    const v = p.variants[vi], out = [];
    const badgeInImage = p.step && p.img[3] <= 1.05;
    if (p.step && !badgeInImage) out.push(`<span class="tag lime">Passo 0${p.step}</span>`);
    if (p.kit) out.push(isPJ() ? '<span class="tag dark">Kit profissional</span>' : `<span class="tag lime">−${Math.round((1 - v.pf / v.cmpPf) * 100)}%</span>`);
    if (isPJ() && v.pro) out.push('<span class="tag dark">Tamanho profissional</span>');
    else if (p.tags.includes('Mais vendido')) out.push('<span class="tag">Mais vendido</span>');
    else if (p.tags.includes('Lançamento')) out.push('<span class="tag">Lançamento</span>');
    return out.slice(0, 2).join('');
  }

  const addBtn = (p, vi, cls = 'add') => {
    const q = isPJ() ? Math.max(1, p.box) : 1;
    const lbl = isPJ() ? `${ic('plus', 15)}${p.box > 1 ? 'Cx ' + p.box : 'Kit'}` : ic('bag', 19);
    return `<button class="${cls}" data-add="${p.id}" data-v="${vi}" data-q="${q}" aria-label="Adicionar ${esc(p.name)}">${lbl}</button>`;
  };

  function cardHTML(p) {
    const vi = defV(p), v = p.variants[vi], rt = rating(p);
    const bottomTags = TOP_BADGE.has(p.img[0]) && p.img[3] <= 1.05;
    const meta = isPJ()
      ? `<span>${v.v}${p.box > 1 ? ` · cx c/ ${p.box}` : ''}</span>${v.rend ? `<span class="rend">${ic('drop', 12)}~${v.rend} atend.</span>` : ''}`
      : `<span>${v.v}${p.variants.length > 1 ? ` · +${p.variants.length - 1} tam.` : ''}</span><span class="stars">${ic('star', 13)}${fmtR(rt.r)}<span style="color:var(--mute);font-weight:400">(${rt.n})</span></span>`;
    return `<article class="card" style="--c:${p.color}">
      <a class="ph" href="#/p/${p.id}" aria-label="${esc(p.name)}">${fr(p.img, 1.25, p.name)}<div class="tags"${bottomTags ? ' style="top:auto;bottom:12px"' : ''}>${tagsHTML(p, vi)}</div></a>
      <button class="fav${S.fav.has(p.id) ? ' on' : ''}" data-fav="${p.id}" aria-label="Favoritar ${esc(p.name)}">${ic('heart', 18)}</button>
      <div class="cb">
        <div class="line"><i></i>${LINES[p.line]}</div>
        <h3><a href="#/p/${p.id}">${p.name}</a></h3>
        <div class="meta">${meta}</div>
        <div class="buyrow">${priceHTML(p, vi)}${addBtn(p, vi)}</div>
      </div>
    </article>`;
  }

  /* ---------- HOME ---------- */
  const SLIDES = [
    ['b-rapidin', '#/p/seca-rapidin', 'Seca Rapidin — secante de esmalte instantâneo'],
    ['b-serum', '#/p/serum-hidratante', 'Sérum Hidratante Mãos & Pés'],
    ['b-pedra-hume', '#/p/pedra-hume-gel', 'Pedra Hume em Gel com óleo de melaleuca'],
    ['b-ozonizado', '#/p/creme-ozonizado', 'Creme Hidratante Ozonizado'],
    ['b-depilacao', '#/loja/depilacao', 'Ceras depilatórias roll-on']
  ];
  const TABS = [['todos', 'Todos'], ['spa', 'Spa dos Pés'], ['cuticulas', 'Cutículas'], ['unhas', 'Unhas'], ['maos-pes', 'Mãos & Pés']];

  function seal() {
    return `<div class="seal" aria-hidden="true"><svg class="ring" viewBox="0 0 120 120"><defs><path id="sealPath" d="M60,60 m-47,0 a47,47 0 1,1 94,0 a47,47 0 1,1 -94,0"/></defs><circle cx="60" cy="60" r="59" fill="#fff"/><text><textPath href="#sealPath" textLength="292" lengthAdjust="spacing">A MARCA QUERIDINHA DO BRASIL • DESDE 2004 • </textPath></text></svg><span class="core"><img src="assets/img/logo-white.png" alt=""></span></div>`;
  }

  const bestGrid = () => rankList(PRODUCTS.filter(p => S.homeTab === 'todos' || p.cats.includes(S.homeTab))).slice(0, 8).map(cardHTML).join('');

  function pickInner(g, ids) {
    const p = PM[S.pick[g]], vi = defV(p);
    return `<div class="pk-sw" role="tablist" aria-label="${p.sibLabel}">${ids.map(id => { const q = PM[id]; return `<button class="sw-btn${id === p.id ? ' on' : ''}" role="tab" aria-selected="${id === p.id}" data-pick="${g}:${id}" style="--s:${q.sw}"><i></i>${q.label}</button>`; }).join('')}</div>
    <div class="pk-card" style="--c:${p.color}">${fr(p.img, 1.25, p.name)}<div><div class="line"><i></i>${LINES[p.line]}</div><h3>${p.name}</h3><p>${p.short}</p>
      <div class="row">${priceHTML(p, vi)}<button class="btn btn-dark" data-add="${p.id}" data-v="${vi}" data-q="${isPJ() ? p.box : 1}">${ic('bag', 17)}${isPJ() ? 'Adicionar cx ' + p.box : 'Adicionar'}</button><a class="link-arrow" href="#/p/${p.id}">Detalhes</a></div></div></div>`;
  }

  function viewHome() {
    const pj = isPJ();
    const heroP = PM[t('removedor-maracuja', 'amaciante-cuticulas')];
    const hvi = defV(heroP), hv = heroP.variants[hvi];
    const steps = [1, 2, 3, 4, 5].map(n => PRODUCTS.find(p => p.step === n && p.stepMain));
    const kit = PM['kit-protocolo-spa'], kv = kit.variants[0];
    const esm = PM['esmalte-india-da-repos'], esmV = esm.variants[0];
    const rm = PM['removedor-maracuja'];
    const perks = pj
      ? [['factory', 'Preço direto de fábrica', 'Exclusivo para CNPJ'], ['box', 'Até 14% off por volume', 'Descontos progressivos por caixa'], ['doc', 'Boleto faturado', 'Pague em 28 dias'], ['chat', 'Consultor dedicado', 'Atendimento pelo WhatsApp']]
      : [['truck', 'Frete grátis', 'Em compras acima de R$ 199'], ['card', 'Até 3x sem juros', 'No cartão de crédito'], ['pix', '5% off no Pix', 'Aprovação na hora'], ['shield', 'Compra segura', 'Seus dados protegidos']];
    const tiersPJ = [
      ['Salão', 'Para salões, studios e profissionais autônomas', 'R$ 300', 'pedido mínimo', ['Preço de fábrica em todo o catálogo', 'Boleto faturado em 28 dias', 'Frete grátis acima de R$ 800']],
      ['Revenda', 'Compras a partir de R$ 1.500 por mês', '+5%', 'de desconto extra', ['Kit de materiais de divulgação', 'Prioridade na separação dos pedidos', 'Lançamentos em primeira mão']],
      ['Distribuidor', 'Compras a partir de R$ 5.000 por mês', '+10%', 'de desconto extra', ['Consultor comercial dedicado', 'Treinamento com instrutoras Repós', 'Condições logísticas especiais']]
    ];
    const igs = [['higienizador', .5, .45, 1.25], ['amaciante', .5, .55, 1.25], ['maracuja', .5, .5, 1.25], ['neutralizante', .5, .45, 1.25], ['frutas-vermelhas', .5, .5, 1.25], ['esfoliante', .5, .55, 1.25]];

    return `
<section class="hero">
  <div class="wrap hero-in">
    <div class="hero-txt">
      ${t('<span class="flag">Ritual <b>SPA em casa</b></span>', '<span class="flag dark">Preço <b>profissional</b> · CNPJ</span>')}
      <h1 class="h1">${t('Resultado profissional no conforto de <span class="sw">casa.</span>', 'O queridinho das manicures com preço de <span class="sw">fábrica.</span>')}</h1>
      <p class="hero-p">${t('Os mesmos cosméticos que as manicures usam no salão, em tamanhos pensados para o seu dia a dia. Pés macios, cutículas impecáveis e um ritual de spa sem sair de casa.', 'Abasteça seu salão, studio ou revenda direto da fábrica: tamanhos profissionais de até 1,1 L, descontos progressivos por volume e faturamento no boleto.')}</p>
      <div class="ctas">
        <a class="btn btn-dark btn-lg" href="${t('#/loja/spa', '#/loja/todos?pro=1')}">${t('Montar meu ritual', 'Ver catálogo profissional')}${ic('arrow', 18)}</a>
        ${pj ? `<button class="btn btn-ghost btn-lg" data-toast="whats">${ic('chat', 18)}Falar com consultor</button>` : '<a class="btn btn-ghost btn-lg" href="#/loja/todos?ord=novo">Ver lançamentos</a>'}
      </div>
      <div class="micro">${(pj ? ['Pedido mínimo R$ 300', 'Boleto em 28 dias', 'Envio em até 24h úteis'] : ['Frete grátis acima de R$ 199', '3x sem juros', '5% off no Pix']).map(x => `<span>${ic('check', 14)}${x}</span>`).join('')}</div>
      <ul class="stats">
        <li><b>Desde 2004</b><span>cuidando da beleza</span></li>
        <li><b>179 mil</b><span>seguidores no Instagram</span></li>
        <li><b>Ivoti · RS</b><span>fabricação própria</span></li>
      </ul>
    </div>
    <div class="hero-media">
      ${fr(t(['hidratacao', .55, .38, 1.25], ['kit-spa', .5, .506, 1]), 1.08, t('Linha de hidratação Repós', 'Linha profissional Protocolo SPA dos Pés'))}
      ${seal()}
      <a class="float-card" href="#/p/${heroP.id}">
        ${fr(heroP.img, 1.25, heroP.name)}
        <div><span class="fc-k">${t('Lançamento · Meu Pomar', 'Mais pedido pelos salões')}</span><b>${heroP.name}${pj ? ' · ' + hv.v : ''}</b>${priceHTML(heroP, hvi)}</div>
      </a>
    </div>
  </div>
</section>

<section class="perks"><div class="wrap"><ul>${perks.map(([i, a, b]) => `<li><span class="pi">${ic(i, 22)}</span><div><b>${a}</b><span>${b}</span></div></li>`).join('')}</ul></div></section>

<section class="sec">
  <div class="wrap">
    <div class="sec-hd"><div><span class="eyebrow">Categorias</span><h2 class="h2">${t('Encontre o cuidado certo para você', 'Abasteça seu negócio por categoria')}</h2></div><a class="link-arrow" href="#/loja/todos">Ver todos os produtos ${ic('arrow', 16)}</a></div>
    <div class="cats">${CATS.map(c => `<a class="cat" href="#/loja/${c.id}" style="--c:${c.color}">${fr(c.img, 1.15, c.name)}<b><i></i>${c.name}</b><small>${countIn(c.id)} produtos</small></a>`).join('')}</div>
  </div>
</section>

<section class="sec proto">
  <div class="wrap">
    <div class="sec-hd">
      <div><span class="flag">Protocolo <b>SPA dos Pés</b></span><h2 class="h2" style="margin-top:20px">${t('Seu ritual de spa em 5 passos', 'O protocolo que fideliza clientes')}</h2><p class="lead">${t('Siga o mesmo passo a passo das profissionais e transforme o cuidado com os pés em um momento só seu.', 'Ofereça um serviço premium com produtos que trabalham juntos e aumente o ticket de cada atendimento.')}</p></div>
      <a class="link-arrow" href="#/loja/spa">Ver linha completa ${ic('arrow', 16)}</a>
    </div>
    <div class="steps">${steps.map(p => {
      const vi = defV(p), v = p.variants[vi];
      const img = p.step === 5 ? ['hidratacao', .5, .5, 1] : p.img;
      return `<div class="step"><a class="ph" href="#/p/${p.id}" aria-label="${esc(p.name)}">${fr(img, 1.25, p.name)}</a><div><div class="sn">Passo 0${p.step} · ${p.stepName}</div><h4><a href="#/p/${p.id}">${p.name}</a></h4>${pj && v.rend ? `<div class="meta"><span class="rend">${ic('drop', 12)}~${v.rend} atend. · ${v.v}</span></div>` : ''}</div><div class="buyrow">${priceHTML(p, vi)}${addBtn(p, vi)}</div></div>`;
    }).join('')}</div>
    <div class="kitbar">
      ${fr(kit.img, 1, kit.name)}
      <div><h3>${t('Kit Ritual SPA dos Pés completo', 'Kit Protocolo Profissional')}</h3><p>${t('Os 5 passos em um só kit, com economia em relação à compra avulsa.', 'Os 5 passos em tamanhos profissionais. Rende em média 40 protocolos completos.')}</p><div class="chips-inline">${(pj ? kit.kitPJ : kit.kitPF).map(x => `<span>${x}</span>`).join('')}</div></div>
      <div class="kv">
        ${pj ? `<div class="pr"><small>Custo por protocolo</small><b>${brl(kv.pj / kv.rend)}</b></div>` : ''}
        <div class="pr"><s>${brl(pj ? kv.cmpPj : kv.cmpPf)}</s><b>${brl(pj ? kv.pj : kv.pf)}</b><small><strong>Economize ${brl(pj ? kv.cmpPj - kv.pj : kv.cmpPf - kv.pf)}</strong></small></div>
        <button class="btn btn-lime btn-lg" data-add="${kit.id}" data-v="0" data-q="1">${ic('bag', 18)}${t('Quero o kit', 'Adicionar kit')}</button>
      </div>
      ${fan()}
    </div>
  </div>
</section>

<section class="sec">
  <div class="wrap">
    <div class="sec-hd"><div><span class="eyebrow">${t('Mais amados', 'Mais pedidos pelos salões')}</span><h2 class="h2">${t('Os favoritos de quem ama se cuidar', 'O que não pode faltar na sua bancada')}</h2></div><div class="tabs" role="tablist">${TABS.map(([id, n]) => `<button role="tab" data-tab="${id}" class="${S.homeTab === id ? 'on' : ''}">${n}</button>`).join('')}</div></div>
    <div class="grid" id="bestGrid">${bestGrid()}</div>
  </div>
</section>

<section class="sec-sm" style="padding-top:0">
  <div class="wrap">
    <div class="sec-hd" style="margin-bottom:24px"><div><span class="eyebrow">Lançamentos</span><h2 class="h2" style="font-size:clamp(26px,2.6vw,36px)">Recém-lançados para quem não abre mão de qualidade</h2></div></div>
    <div class="slides" id="slides">
      <div class="slides-track">${SLIDES.map(([k, href, n]) => `<a class="slide" href="${href}" aria-label="${esc(n)}"><img src="${IMG[k].src}" alt="${esc(n)}" loading="lazy"></a>`).join('')}</div>
      <button class="nav-arr prev" data-slide="-1" aria-label="Banner anterior">${ic('chev', 18)}</button>
      <button class="nav-arr next" data-slide="1" aria-label="Próximo banner">${ic('chev', 18)}</button>
      <div class="dots">${SLIDES.map((_, i) => `<button data-dot="${i}" class="${i === 0 ? 'on' : ''}" aria-label="Banner ${i + 1}"></button>`).join('')}</div>
    </div>
  </div>
</section>

<section class="sec pomar">
  <div class="wrap feature-in">
    <div class="feature-media">${fr(['meu-pomar', .5, .5, 1], 1, 'Meu Pomar by Repós')}</div>
    <div>
      <span class="eyebrow">Lançamento · Cutículas</span>
      <h2 class="h2">Meu Pomar: cuidado com toque de amor e aroma de fruta no ar.</h2>
      <p class="lead">Creme removedor de cutículas que hidrata, amacia e facilita a remoção, em quatro fragrâncias para escolher a experiência ideal.</p>
      <div class="pk" id="pk-pomar">${pickInner('pomar', POMAR)}</div>
      ${pj ? `<div class="note-pj">${ic('box', 20)}<span><b>Display sortido</b> com 12 unidades (3 de cada fragrância) para o seu salão ou revenda, por ${brl(pjUnit(rm, rm.variants[0], 12))}/un.</span></div>` : ''}
    </div>
  </div>
</section>

${pj ? `
<section class="sec band-pj">
  ${fan()}
  <div class="wrap" style="position:relative">
    <span class="eyebrow light">Programa Parceiro Repós</span>
    <h2 class="h2" style="max-width:760px">Quanto mais o seu negócio cresce, mais vantagens você tem.</h2>
    <p class="lead">Condições pensadas para salões, studios, revendedoras e distribuidores, com o acompanhamento de quem entende de unhas e estética.</p>
    <div class="tiers-cards">${tiersPJ.map((x, i) => `<div class="tcard${i === 1 ? ' best' : ''}"><div class="tt"><h3>${x[0]}</h3>${i === 1 ? '<span class="tag lime">Mais escolhido</span>' : ''}</div><div class="min">${x[1]}</div><div class="off">${x[2]}<small>${x[3]}</small></div><ul>${x[4].map(y => `<li>${ic('check', 16)}${y}</li>`).join('')}</ul></div>`).join('')}</div>
    <div class="ctas"><button class="btn btn-lime btn-lg" data-toast="cadastro">${ic('building', 18)}Cadastrar meu CNPJ</button><button class="btn btn-lg" style="border:1.5px solid rgba(255,255,255,.3);color:#fff" data-toast="whats">${ic('chat', 18)}Falar com consultor</button></div>
  </div>
</section>` : `
<section class="band-pf">
  <div class="wrap">
    <div class="sub-card">
      <div class="txt">
        <span class="eyebrow">Assinatura Repós</span>
        <h2 class="h2">Seu ritual sempre em dia, com 10% off.</h2>
        <p class="lead" style="color:var(--ink-2)">Escolha seus favoritos e receba em casa no intervalo que preferir.</p>
        <ul><li>${ic('check', 16)}10% de desconto em todas as entregas</li><li>${ic('check', 16)}Frete grátis em toda assinatura</li><li>${ic('check', 16)}Pause, troque ou cancele quando quiser</li></ul>
        <div class="ctas"><a class="btn btn-dark btn-lg" href="#/loja/todos">Montar minha assinatura ${ic('arrow', 18)}</a></div>
      </div>
      <div class="media"><img src="${IMG['melancia'].src}" alt="Creme removedor Meu Pomar Melancia" loading="lazy"></div>
    </div>
  </div>
</section>`}

<section class="sec brasil">
  <div class="wrap feature-in">
    <div>
      <span class="eyebrow">Coleção · Esmaltes</span>
      <h2 class="h2">Brasilidades Norte: cores cheias de identidade.</h2>
      <p class="lead">Cinco tons inspirados na riqueza cultural do Norte do Brasil, com D-pantenol e queratina na fórmula.</p>
      <div class="pk" id="pk-brasil">${pickInner('brasil', BRASIL)}</div>
      ${pj
        ? `<div class="note-pj">${ic('box', 20)}<span><b>Caixa sortida</b> com 30 esmaltes (6 de cada cor) por ${brl(pjUnit(esm, esmV, 6))}/un.</span><button class="btn btn-lime" style="margin-left:auto;height:40px" data-addmany="${BRASIL.join(',')}" data-q="6">Adicionar</button></div>`
        : `<button class="btn btn-ghost" style="margin-top:18px" data-addmany="${BRASIL.join(',')}" data-q="1">${ic('sparkle', 17)}Levar a coleção completa · ${brl(esmV.pf * 5)}</button>`}
    </div>
    <div class="feature-media">${fr(['brasilidades', .5, .5, 1], 1, 'Coleção Brasilidades Norte')}</div>
  </div>
</section>

<section class="sec oleos-band">
  <div class="wrap feature-in">
    <div class="feature-media">${fr(['oleos', .5, .5, 1], 1, 'Óleos Essenciais Repós')}</div>
    <div>
      <span class="eyebrow light">Lançamento · Aromaterapia</span>
      <h2 class="h2">Óleos Essenciais Repós</h2>
      <p class="lead">Use em difusores, massagens ou aromaterapia. Cinco óleos para criar a experiência sensorial ${t('da sua casa', 'do seu salão')}.</p>
      <div class="oil-list">${PRODUCTS.filter(p => p.line === 'oleos').map(p => `<a href="#/p/${p.id}" style="--c:${p.color}"><i></i><div><b>${p.label}</b><span>${p.short}</span></div><div class="pr"><b>${brl(pj ? p.variants[0].pj : p.variants[0].pf)}${pj ? '<em>/un</em>' : ''}</b></div></a>`).join('')}</div>
    </div>
  </div>
</section>

<section class="sec">
  <div class="wrap">
    <div class="sec-hd">
      <div class="ig-hd"><span class="ig-av"><img src="assets/img/logo-white.png" alt=""></span><div><span class="eyebrow" style="margin-bottom:6px">@reposcosmeticosoficial</span><h2 class="h2" style="font-size:clamp(26px,2.6vw,36px)">179 mil pessoas acompanham a Repós</h2></div></div>
      <button class="btn btn-ghost" data-toast="social">${ic('ig', 18)}Seguir no Instagram</button>
    </div>
    <div class="ig-grid">${igs.map(f => `<a href="#" data-toast="social" aria-label="Post no Instagram">${fr(f, 1, 'Post da Repós no Instagram')}${ic('ig', 28)}</a>`).join('')}</div>
  </div>
</section>

<section class="news">
  <div class="wrap news-in">
    <div><h2 class="h2">${t('Ganhe 10% na primeira compra', 'Receba a tabela profissional')}</h2><p>${t('Cadastre seu e-mail e receba novidades, lançamentos e dicas de cuidado.', 'Lançamentos e condições exclusivas para o seu negócio, direto no seu e-mail.')}</p></div>
    <div><form data-news><label class="sr" for="nl">E-mail</label><input id="nl" type="email" placeholder="${t('Seu melhor e-mail', 'E-mail do seu negócio')}" required><button class="btn btn-dark" type="submit">${t('Quero meu cupom', 'Quero receber')}</button></form><small>Ao se cadastrar, você concorda com a nossa política de privacidade.</small></div>
  </div>
</section>`;
  }

  /* ---------- LISTAGEM ---------- */
  const HD = {
    spa: ['kit-spa', .5, .62, 1], cuticulas: ['maracuja', .45, .55, 1], 'maos-pes': ['hidratacao', .5, .5, 1],
    unhas: ['brasilidades', .5, .66, 1], depilacao: ['b-depilacao', .77, .55, 2.8], oleos: ['oleos', .55, .62, 1]
  };

  function viewList(catId, qs) {
    const cat = CM[catId] || null;
    const q = (qs.get('q') || '').trim(), line = qs.get('linha') || '', ord = qs.get('ord') || 'rel', pro = qs.get('pro') === '1' && isPJ();
    const base = PRODUCTS.filter(p => !cat || p.cats.includes(cat.id));
    let list = base;
    if (q) { const nq = norm(q); list = list.filter(p => norm([p.name, p.short, LINES[p.line], p.desc].join(' ')).includes(nq)); }
    if (line) list = list.filter(p => p.line === line);
    if (pro) list = list.filter(p => p.kit || p.variants.some(v => v.pro) || p.box >= 12);
    const price = p => { const v = p.variants[defV(p)]; return isPJ() ? v.pj : v.pf; };
    if (ord === 'menor') list = [...list].sort((a, b) => price(a) - price(b));
    else if (ord === 'maior') list = [...list].sort((a, b) => price(b) - price(a));
    else if (ord === 'nome') list = [...list].sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'));
    else if (ord === 'novo') list = [...list].sort((a, b) => (b.tags.includes('Lançamento') - a.tags.includes('Lançamento')) || ((a.rk[S.profile] || 99) - (b.rk[S.profile] || 99)));
    else list = rankList(list);

    const mk = params => {
      const u = new URLSearchParams(qs);
      for (const k in params) { if (params[k] == null || params[k] === '') u.delete(k); else u.set(k, params[k]); }
      const s = u.toString();
      return `#/loja/${cat ? cat.id : 'todos'}${s ? '?' + s : ''}`;
    };
    const title = q ? `Resultados para “${esc(q)}”` : cat ? cat.name : pro ? 'Tamanhos profissionais' : t('Todos os produtos', 'Catálogo profissional');
    const desc = q ? `Encontramos ${list.length} ${list.length === 1 ? 'produto' : 'produtos'} para a sua busca.` : cat ? cat.desc : t('Cuidados para unhas, mãos, pés, pele e corpo, com a qualidade de quem fabrica desde 2004.', 'Todo o portfólio Repós com preço de fábrica para CNPJ e descontos progressivos por volume.');
    const color = cat ? cat.color : '#A3C83C';
    const img = cat ? HD[cat.id] : ['kit-spa', .5, .5, 1];
    const lines = [...new Set(base.map(p => p.line))];
    const sorts = [['rel', t('Mais relevantes', 'Mais pedidos')], ['novo', 'Lançamentos'], ['menor', 'Menor preço'], ['maior', 'Maior preço'], ['nome', 'Nome (A–Z)']];

    return `<div class="wrap">
  <nav class="crumbs" aria-label="Você está em"><a href="#/">Início</a>${ic('chev', 12)}<span>${cat ? cat.name : 'Loja'}</span></nav>
  <div class="lst-hd" style="--c:${color}">
    <div class="txt"><span class="eyebrow">${t('Loja Repós', 'Catálogo PJ')}</span><h1 class="h2">${title}</h1><p>${desc}</p></div>
    <div class="media">${fr(img, .5, cat ? cat.name : 'Produtos Repós')}</div>
  </div>
  <div class="lst">
    <aside class="filters" aria-label="Filtros">
      <div class="fgrp"><h4>Categorias</h4>
        <a href="#/loja/todos" class="${!cat ? 'on' : ''}" style="--c:#A3C83C"><i></i>Todos<small>${PRODUCTS.length}</small></a>
        ${CATS.map(c => `<a href="#/loja/${c.id}" class="${cat && cat.id === c.id ? 'on' : ''}" style="--c:${c.color}"><i></i>${c.name}<small>${countIn(c.id)}</small></a>`).join('')}
      </div>
      <div class="fgrp"><h4>Linhas</h4>${lines.map(l => `<label><input type="checkbox" data-href="${mk({ linha: line === l ? '' : l })}"${line === l ? ' checked' : ''}>${LINES[l]}</label>`).join('')}</div>
      ${isPJ() ? `<div class="fgrp"><h4>Para o seu negócio</h4><label><input type="checkbox" data-href="${mk({ pro: pro ? '' : '1' })}"${pro ? ' checked' : ''}>Tamanhos profissionais e caixas</label></div>` : ''}
    </aside>
    <div>
      ${isPJ() ? `<div class="pj-strip">${ic('building', 20)}<span>Preços exclusivos para <b>CNPJ</b>${S.cnpj ? ` · ${S.cnpj}` : ''}</span><span class="sp"></span><span class="tier-pill">1 caixa: −7%</span><span class="tier-pill">4+ caixas: −14%</span></div>` : ''}
      <div class="toolbar">
        <button class="btn btn-ghost filter-btn" data-open="filters" style="height:42px">${ic('filter', 16)}Filtrar</button>
        <span class="cnt"><b>${list.length}</b> ${list.length === 1 ? 'produto' : 'produtos'}</span>
        <label class="sr" for="ordSel">Ordenar</label>
        <select class="sel" id="ordSel">${sorts.map(([k, n]) => `<option value="${mk({ ord: k === 'rel' ? '' : k })}"${ord === k ? ' selected' : ''}>${n}</option>`).join('')}</select>
      </div>
      ${list.length ? `<div class="grid g3">${list.map(cardHTML).join('')}</div>` : `<div class="empty"><div class="h3">Nenhum produto encontrado</div><p>Tente outra busca ou veja todos os produtos.</p><a class="btn btn-dark" style="margin-top:18px" href="#/loja/todos">Ver todos</a></div>`}
    </div>
  </div>
</div>`;
  }

  /* ---------- PRODUTO ---------- */
  const REVIEWS = [
    ['Camila · Porto Alegre/RS', 'Uso em casa toda semana e meus pés nunca estiveram tão macios. O cheirinho é maravilhoso!'],
    ['Juliana · São Paulo/SP', 'Comprei por indicação da minha manicure e entendi por que é a queridinha.'],
    ['Patrícia · Curitiba/PR', 'Rende muito e chegou rápido. Já comprei de novo.']
  ];

  function ensurePDP(p) {
    if (!S.pdp || S.pdp.id !== p.id || S.pdp.prof !== S.profile) {
      const keep = S.pdp && S.pdp.id === p.id ? S.pdp : null;
      S.pdp = {
        id: p.id, prof: S.profile, vi: defV(p),
        qty: isPJ() ? Math.max(1, p.box) : 1,
        unit: isPJ() && p.box > 1 ? 'cx' : 'un',
        gi: keep ? keep.gi : 0, mode: 'once', att: keep ? keep.att : 120, cep: keep ? keep.cep : '', shipOK: false, rec: ''
      };
    }
  }

  function galHTML(p) {
    const gal = [p.img, ...(p.gallery || [])];
    const gi = Math.min(S.pdp.gi, gal.length - 1);
    return `<div class="thumbs" role="tablist" aria-label="Imagens do produto">${gal.map((f, i) => `<button class="${i === gi ? 'on' : ''}" data-gi="${i}" role="tab" aria-selected="${i === gi}" aria-label="Imagem ${i + 1}">${fr(f, 1.25, '')}</button>`).join('')}</div>
    <div class="gal-main">${fr(gal[gi], 1.25, p.name)}</div>`;
  }

  const qtyHTML = (n, lbl) => `<div class="qty"><button data-step="-1" aria-label="Diminuir">${ic('minus', 16)}</button><input id="qtyIn" type="number" min="1" value="${n}" aria-label="Quantidade (${lbl})"><button data-step="1" aria-label="Aumentar">${ic('plus', 16)}</button></div>`;

  function shipHTML(sub) {
    return `<div><span>PAC · 5 a 8 dias úteis</span><b>${sub >= 199 ? 'Grátis' : 'R$ 18,90'}</b></div><div><span>SEDEX · 2 a 3 dias úteis</span><b>R$ 29,90</b></div>`;
  }

  function buyHTML(p) {
    const st = S.pdp, v = p.variants[st.vi], pj = isPJ(), rt = rating(p);
    const sibs = p.sib ? PRODUCTS.filter(q => q.sib === p.sib) : [];
    let h = p.step ? `<span class="flag">Passo <b>0${p.step}</b> · ${p.stepName}</span>` : `<span class="flag">${LINES[p.line]}</span>`;
    h += `<h1>${p.name}</h1><p class="sub">${p.short}</p><div class="meta">`;
    h += pj
      ? `<span class="sku">Cód. RP-${skuOf(p)}</span><span>${p.box > 1 ? `Venda em caixa com ${p.box} un` : 'Venda por kit'}</span>${v.rend ? `<span class="rend">${ic('drop', 12)}Rende ~${v.rend} atendimentos</span>` : ''}`
      : `<span class="stars">${ic('star', 14)}${fmtR(rt.r)}</span><button style="text-decoration:underline;font-size:13.5px;color:var(--mute)" data-scroll="reviews">${rt.n} avaliações</button>${p.tags.includes('Mais vendido') ? '<span class="tag lime">Mais vendido</span>' : ''}${p.tags.includes('Lançamento') ? '<span class="tag" style="box-shadow:none;border:1px solid var(--line)">Lançamento</span>' : ''}`;
    h += '</div>';

    if (p.variants.length > 1) {
      h += `<div class="opt"><div class="opt-lbl">Tamanho: <b>${v.v}</b></div><div class="chips">${p.variants.map((x, i) => `<button class="chip${i === st.vi ? ' on' : ''}" data-vi="${i}">${x.v}<small>${pj ? brl(x.pj) + '/un' : brl(x.pf)}</small>${x.pro && pj ? '<span class="pro">Profissional</span>' : ''}</button>`).join('')}</div></div>`;
    }
    if (v.note) h += `<div class="pb-sub" style="margin-top:10px;display:flex;gap:6px;align-items:center;color:var(--lime-ink);font-weight:600">${ic('sparkle', 15)}${v.note}</div>`;
    if (sibs.length) {
      h += `<div class="opt"><div class="opt-lbl">${p.sibLabel}: <b>${p.label}</b></div><div class="sibs">${sibs.map(q => `<a class="sib${q.id === p.id ? ' on' : ''}" href="#/p/${q.id}" style="--s:${q.sw}" title="${esc(q.label)}" aria-label="${esc(q.label)}"></a>`).join('')}</div></div>`;
    }

    if (!pj) {
      const price = v.pf, sub = r2(price * .9), inst = installments(price);
      h += `<div class="pricebox">
        <div class="pb-top"><div>${v.cmpPf ? `<s style="color:var(--mute);font-size:15px">${brl(v.cmpPf)}</s>` : ''}<div class="big-price">${brl(st.mode === 'sub' ? sub : price)}</div><div class="pb-sub">${inst ? `ou ${inst} · ` : ''}<strong>${brl(price * .95)}</strong> no Pix</div></div>${v.cmpPf ? `<span class="save-pill">Economize ${brl(v.cmpPf - v.pf)}</span>` : ''}</div>
        <div class="modes">
          <label class="mode${st.mode === 'once' ? ' on' : ''}"><input type="radio" name="mode" value="once"${st.mode === 'once' ? ' checked' : ''}><span><b>Compra única</b><span>Entrega para todo o Brasil</span></span><span class="mp">${brl(price)}</span></label>
          <label class="mode${st.mode === 'sub' ? ' on' : ''}"><input type="radio" name="mode" value="sub"${st.mode === 'sub' ? ' checked' : ''}><span><b>Assinatura · 10% off</b><span>Receba a cada 30 dias e cancele quando quiser</span></span><span class="mp">${brl(sub)}</span></label>
        </div>
        <div class="buyline">${qtyHTML(st.qty, 'unidades')}<button class="btn btn-dark" data-buy>${ic('bag', 18)}Adicionar à sacola</button></div>
        <form class="ship" data-shipform><label class="sr" for="cep">CEP</label><input id="cep" inputmode="numeric" maxlength="9" placeholder="Calcule o frete: digite seu CEP" value="${st.cep}"><button class="btn btn-ghost" type="submit" style="height:46px">Calcular</button></form>
        <div class="ship-res" id="shipRes">${st.shipOK ? shipHTML(price * st.qty) : ''}</div>
      </div>`;
    } else {
      const units = st.qty, ts = tiersOf(p), ti = tierIdx(p, units), u = pjUnit(p, v, units);
      const total = r2(u * units), save = r2(v.pf * units - total), margin = 1 - u / v.pf;
      const isCx = st.unit === 'cx' && p.box > 1;
      h += `<div class="pricebox">
        <div class="pb-lbl">${ic('building', 14)}Preço exclusivo CNPJ</div>
        <div class="pb-top"><div><div class="big-price">${brl(u)}<em>/${unitWord(p)}</em></div><div class="pb-sub">Preço de varejo ${brl(v.pf)} · <strong>${pct(1 - u / v.pf)} abaixo</strong></div></div>${ti > 0 ? `<span class="save-pill">−${pct(ts[ti].off)} por volume</span>` : ''}</div>
        <table class="tiers"><thead><tr><th>Quantidade</th><th>Preço/${unitWord(p)}</th><th>Desconto</th></tr></thead><tbody>${ts.map((x, i) => `<tr class="${i === ti ? 'on' : ''}"><td>${tierLabel(p, i)}</td><td>${brl(r2(v.pj * (1 - x.off)))}</td><td>${x.off ? '−' + pct(x.off) : '—'}</td></tr>`).join('')}</tbody></table>
        ${p.box > 1 ? `<div class="opt" style="margin-top:20px"><div class="opt-lbl">Comprar por</div><div class="seg"><button class="${!isCx ? 'on' : ''}" data-unit="un">Unidade</button><button class="${isCx ? 'on' : ''}" data-unit="cx">Caixa com ${p.box}</button></div></div>` : ''}
        <div class="buyline">${qtyHTML(isCx ? units / p.box : units, isCx ? 'caixas' : unitWord(p, 2))}<button class="btn btn-lime" data-buy>${ic('box', 18)}Adicionar ao pedido</button></div>
        <div class="calc-line"><span>Total · ${units} ${unitWord(p, units)}${isCx ? ` (${units / p.box} cx)` : ''}</span><b>${brl(total)}</b></div>
        <div class="calc-line"><span>Economia em relação ao varejo</span><b class="pos">${brl(save)}</b></div>
        <div class="calc-line"><span>Preço sugerido de revenda</span><b>${brl(v.pf)} <span class="pos" style="font-weight:600">· margem de ${pct(margin)}</span></b></div>
        ${v.rend ? `<div class="calc-line"><span>Custo por atendimento</span><b>${brl(u / v.rend)}</b></div>` : ''}
        <div class="pj-extras">
          <select class="sel" id="recompra" aria-label="Recompra programada"><option value="">Recompra programada: não</option>${['30', '45', '60'].map(d => `<option value="${d}"${st.rec === d ? ' selected' : ''}>Repetir a cada ${d} dias</option>`).join('')}</select>
          <button class="btn btn-ghost" data-toast="whats" style="height:42px">${ic('chat', 16)}Orçamento no WhatsApp</button>
        </div>
        <div class="dl"><a href="#" data-toast="doc">${ic('download', 15)}Ficha técnica (PDF)</a><a href="#" data-toast="doc">${ic('doc', 15)}FISPQ</a><a href="#" data-toast="sample">${ic('sparkle', 15)}Solicitar amostra</a></div>
      </div>`;
    }
    h += `<div class="trust"><div>${ic('shield', 20)}Compra 100% segura</div><div>${ic('truck', 20)}${t('Entrega para todo o Brasil', 'Envio em até 24h úteis')}</div><div>${ic('factory', 20)}Fabricado em Ivoti · RS</div></div>`;
    return h;
  }

  function accHTML(p) {
    const v = p.variants[S.pdp.vi], pj = isPJ();
    const specs = [['Linha', LINES[p.line]], ['Conteúdo', p.variants.map(x => x.v).join(' · ')], ['Ativos', p.ativos]];
    if (pj) specs.push(['Unidade de venda', p.box > 1 ? `Caixa com ${p.box} unidades` : 'Kit'], ['Rendimento estimado', v.rend ? `~${v.rend} atendimentos por unidade` : 'Consulte a ficha técnica'], ['Código', 'RP-' + skuOf(p)]);
    specs.push(['Fabricante', 'Repós Cosméticos · Ivoti/RS']);
    const kitList = p.kit ? `<ul style="margin-top:14px">${(pj ? p.kitPJ : p.kitPF).map(x => `<li>${ic('check', 16)}${x}</li>`).join('')}</ul>` : '';
    return `<details open><summary>Descrição ${ic('plus', 20)}</summary><div class="ab"><p>${p.desc}</p>${kitList}</div></details>
      <details open><summary>${pj ? 'Como usar no atendimento' : 'Como usar em casa'} ${ic('plus', 20)}</summary><div class="ab"><p>${pj ? p.usoPJ : p.usoPF}</p></div></details>
      <details><summary>Benefícios ${ic('plus', 20)}</summary><div class="ab"><ul>${p.bullets.map(b => `<li>${ic('check', 16)}${b}</li>`).join('')}</ul></div></details>
      <details><summary>Especificações ${ic('plus', 20)}</summary><div class="ab"><table class="spec">${specs.map(([a, b]) => `<tr><td>${a}</td><td>${b}</td></tr>`).join('')}</table></div></details>`;
  }

  /* consumo mensal e recompra sugerida para a calculadora PJ */
  function usage(p) {
    const v = p.variants[S.pdp.vi], perMonth = S.pdp.att / v.rend;
    const units = perMonth <= 1 ? 1 : Math.ceil(perMonth);
    const days = perMonth <= 1 ? Math.min(120, Math.round(30 / perMonth)) : 30;
    return { v, perMonth, units, days, u: pjUnit(p, v, units) };
  }
  function calcOut(p) {
    const { v, perMonth, units, days, u } = usage(p);
    const fmt1 = n => n.toFixed(1).replace('.', ',');
    return `<div><b>${fmt1(perMonth)} un</b><span>consumo de ${v.v} por mês</span></div><div><b>${brl(u * perMonth)}</b><span>investimento mensal</span></div><div><b>${brl(u / v.rend)}</b><span>custo por atendimento</span></div><div><b>${units} un · ${days} dias</b><span>recompra sugerida</span></div>`;
  }

  function sideHTML(p) {
    const v = p.variants[S.pdp.vi];
    if (isPJ()) {
      if (!v.rend) {
        return `<div class="side-card dark"><span class="eyebrow light">Programa Parceiro Repós</span><h3 class="h3">Compre mais, pague menos</h3><p style="margin-top:10px;font-size:14.5px">Revendas com compras a partir de R$ 1.500 por mês ganham +5% de desconto, e distribuidores, +10%.</p><button class="btn btn-lime btn-block" style="margin-top:20px" data-toast="cadastro">${ic('building', 18)}Quero ser parceira</button></div>`;
      }
      return `<div class="side-card dark" id="calc"><span class="eyebrow light">${ic('calc', 14)} Calculadora de rendimento</span><h3 class="h3">Quanto você precisa por mês?</h3><p style="margin-top:8px;font-size:14.5px">Arraste para informar quantos atendimentos você faz por mês.</p>
        <div class="att-val"><span id="attVal">${S.pdp.att}</span><small>atendimentos/mês</small></div>
        <input class="range" id="attRange" type="range" min="10" max="600" step="10" value="${S.pdp.att}" aria-label="Atendimentos por mês">
        <div class="range-lbls"><span>10</span><span>600</span></div>
        <div class="calc-out" id="calcOut">${calcOut(p)}</div>
        <button class="btn btn-lime btn-block" style="margin-top:18px" data-calc-add>${ic('repeat', 18)}Adicionar e programar recompra</button></div>`;
    }
    const rt = rating(p), dist = [81, 13, 4, 1, 1];
    return `<div class="side-card" id="reviews"><span class="eyebrow">Avaliações</span><h3 class="h3">O que dizem as clientes</h3>
      <div class="rating-sum"><div class="big">${fmtR(rt.r)}</div><div class="bars">${dist.map((d, i) => `<div><span>${5 - i}</span><i style="--w:${d}%"></i></div>`).join('')}</div></div>
      <div style="font-size:12.5px;color:var(--mute)">${rt.n} avaliações · depoimentos ilustrativos do protótipo</div>
      ${REVIEWS.map(r => `<div class="review"><div class="who-r"><b>${r[0]}</b><span class="st">★★★★★</span></div>${r[1]}</div>`).join('')}</div>`;
  }

  function related(p) {
    const seen = new Set(p.sib ? [p.sib] : []), out = [];
    const pool = p.line === 'spa' ? PRODUCTS.filter(q => q.stepMain) : rankList(PRODUCTS.filter(q => q.cats.some(c => p.cats.includes(c))));
    for (const q of [...pool, ...rankList(PRODUCTS)]) {
      if (q.id === p.id || out.includes(q)) continue;
      if (q.sib) { if (seen.has(q.sib)) continue; seen.add(q.sib); }
      out.push(q);
      if (out.length === 4) break;
    }
    return out;
  }

  function viewProduct(id) {
    const p = PM[id];
    if (!p) return viewList(null, new URLSearchParams());
    ensurePDP(p);
    const cat = CM[p.cats[0]];
    return `<div class="wrap">
  <nav class="crumbs" aria-label="Você está em"><a href="#/">Início</a>${ic('chev', 12)}<a href="#/loja/${cat.id}">${cat.name}</a>${ic('chev', 12)}<span>${p.name}</span></nav>
  <div class="pdp" style="--c:${p.color}">
    <div class="gal" id="gal">${galHTML(p)}</div>
    <div class="buy" id="buy">${buyHTML(p)}</div>
  </div>
  <div class="details" id="details"><div class="acc">${accHTML(p)}</div><div id="side">${sideHTML(p)}</div></div>
</div>
<section class="sec" style="background:var(--sand)">
  <div class="wrap">
    <div class="sec-hd"><div><span class="eyebrow">${p.line === 'spa' ? 'Protocolo SPA dos Pés' : 'Combine com'}</span><h2 class="h2">${p.line === 'spa' ? t('Complete o seu ritual', 'Complete o protocolo') : t('Você também vai amar', 'Aproveite e abasteça')}</h2></div></div>
    <div class="grid">${related(p).map(cardHTML).join('')}</div>
  </div>
</section>`;
  }

  const rerender = {
    gal: () => { $('#gal').innerHTML = galHTML(PM[S.pdp.id]); },
    buy: () => { $('#buy').innerHTML = buyHTML(PM[S.pdp.id]); },
    details: () => { const p = PM[S.pdp.id]; $('#details').innerHTML = `<div class="acc">${accHTML(p)}</div><div id="side">${sideHTML(p)}</div>`; }
  };

  /* ---------- SACOLA ---------- */
  const saveCart = () => LS.set('repos.cart', S.cart);
  const cartStep = p => (isPJ() && p.box > 1 ? p.box : 1);
  function lineUnit(it) {
    const p = PM[it.id], v = p.variants[it.vi];
    if (isPJ()) return pjUnit(p, v, it.qty);
    return it.sub ? r2(v.pf * .9) : v.pf;
  }

  function addToCart(id, vi, q, opts = {}) {
    const p = PM[id];
    if (!p) return;
    const it = S.cart.find(x => x.id === id && x.vi === vi);
    if (it) { it.qty += q; if (opts.sub) it.sub = true; } else S.cart.push({ id, vi, qty: q, sub: !!opts.sub });
    saveCart();
    renderCart();
    const c = $('#cartCount'); c.classList.remove('bump'); void c.offsetWidth; c.classList.add('bump');
    if (!opts.silent) toast(`${ic('check', 18)}<span><b>${esc(p.name)}</b>${q > 1 ? ` · ${q} ${unitWord(p, q)}` : ''} ${t('na sacola', 'no pedido')}</span><button class="btn btn-lime" data-open="cart">${t('Ver sacola', 'Ver pedido')}</button>`);
  }

  function renderCart() {
    const n = S.cart.reduce((a, b) => a + b.qty, 0);
    const cnt = $('#cartCount');
    cnt.textContent = n > 99 ? '99+' : n;
    cnt.style.display = n ? '' : 'none';
    $('#cartItemsLbl').textContent = n ? `${n} ${n === 1 ? 'item' : 'itens'}` : '';
    const body = $('#cartBody'), foot = $('#cartFoot');
    if (!S.cart.length) {
      body.innerHTML = `<div class="cart-empty">${ic('bag', 56)}<b>${t('Sua sacola está vazia', 'Seu pedido está vazio')}</b>${t('Que tal começar pelo Protocolo SPA dos Pés?', 'Comece pelos itens mais pedidos pelos salões.')}<div style="margin-top:18px"><a class="btn btn-dark" href="${t('#/loja/spa', '#/loja/todos')}" data-close>${t('Ver produtos', 'Ver catálogo')}</a></div></div>`;
      foot.innerHTML = '';
      return;
    }
    const sub = r2(S.cart.reduce((a, it) => a + lineUnit(it) * it.qty, 0));
    const retail = r2(S.cart.reduce((a, it) => a + PM[it.id].variants[it.vi].pf * it.qty, 0));
    const goal = isPJ() ? 300 : 199, miss = Math.max(0, r2(goal - sub)), w = Math.min(100, sub / goal * 100);
    const prog = isPJ()
      ? (miss > 0 ? `Faltam <b>${brl(miss)}</b> para o pedido mínimo de R$ 300.` : `Pedido mínimo atingido. <b>Boleto em 28 dias</b> liberado.`)
      : (miss > 0 ? `Faltam <b>${brl(miss)}</b> para ganhar <b>frete grátis</b>.` : `Oba! Você ganhou <b>frete grátis</b>.`);
    body.innerHTML = `<div class="prog${miss ? '' : ' ok'}">${prog}<div class="track"><i style="width:${w}%"></i></div></div>` + S.cart.map((it, i) => {
      const p = PM[it.id], v = p.variants[it.vi], u = lineUnit(it), ti = isPJ() ? tierIdx(p, it.qty) : 0;
      return `<div class="ci">${fr(p.img, 1.25, p.name)}<div><h4>${p.name}</h4><div class="cm">${v.v}${isPJ() && p.box > 1 ? ` · cx c/ ${p.box}` : ''}${it.sub && !isPJ() ? ' · assinatura −10%' : ''}${ti ? ` · <span style="color:var(--lime-ink);font-weight:700">−${pct(tiersOf(p)[ti].off)} por volume</span>` : ''}</div>
        <div class="cr"><div class="qty sm"><button data-cq="${i}:-1" aria-label="Diminuir">${ic('minus', 14)}</button><input value="${it.qty}" data-ci="${i}" inputmode="numeric" aria-label="Quantidade"><button data-cq="${i}:1" aria-label="Aumentar">${ic('plus', 14)}</button></div><div class="cp"><b>${brl(u * it.qty)}</b><small>${brl(u)}/${unitWord(p)}</small></div></div>
        <button class="rm" data-rm="${i}">Remover</button></div></div>`;
    }).join('');
    const freeShip = isPJ() ? sub >= 800 : sub >= 199;
    foot.innerHTML = `<div class="sum"><div><span>Subtotal</span><span>${brl(sub)}</span></div>
      ${isPJ() ? `<div><span>Economia em relação ao varejo</span><span class="pos">− ${brl(retail - sub)}</span></div>` : `<div><span>No Pix (5% off)</span><span class="pos">${brl(sub * .95)}</span></div>`}
      <div><span>Frete</span><span>${freeShip ? 'Grátis' : 'Calculado no próximo passo'}</span></div>
      <div class="tot"><span>Total</span><span>${brl(sub)}</span></div></div>
      <button class="btn btn-${isPJ() ? 'lime' : 'dark'} btn-block btn-lg" data-checkout${isPJ() && miss > 0 ? ' disabled' : ''}>${isPJ() ? (miss > 0 ? 'Pedido mínimo de R$ 300' : `${ic('doc', 18)}Enviar pedido · boleto 28 dias`) : `${ic('shield', 18)}Finalizar compra`}</button>
      <div style="text-align:center;margin-top:12px;font-size:12.5px;color:var(--mute)">${isPJ() ? `Faturamento para o CNPJ ${S.cnpj || 'informado no cadastro'}` : 'Até 3x sem juros · Pix com 5% off'}</div>`;
  }

  function changeCartQty(i, d) {
    const it = S.cart[i];
    if (!it) return;
    const p = PM[it.id], step = cartStep(p);
    it.qty += d * step;
    if (it.qty < 1) S.cart.splice(i, 1);
    saveCart();
    renderCart();
  }

  /* ---------- NAVEGAÇÃO, PERFIL, TOAST ---------- */
  function renderNav() {
    const cur = location.hash;
    const links = CATS.map(c => `<a href="#/loja/${c.id}" style="--c:${c.color}" class="${cur.startsWith('#/loja/' + c.id) ? 'on' : ''}"><i></i>${c.name}</a>`).join('');
    $('#navLinks').innerHTML = links + '<span class="grow"></span>' + (isPJ()
      ? `<a class="hl pj-hl" href="#/loja/todos?pro=1">${ic('box', 16)}Tamanhos profissionais</a><a href="#" data-toast="cadastro">Seja revendedor</a>`
      : `<a class="hl" href="#/p/kit-protocolo-spa">${ic('gift', 16)}Kits</a><a href="#/loja/todos?ord=novo">Lançamentos</a>`);
    $('#menuLinks').innerHTML = `<a href="#/" data-close>Início</a>${CATS.map(c => `<a href="#/loja/${c.id}" style="--c:${c.color}" data-close><i></i>${c.name}</a>`).join('')}<a href="#/loja/todos" data-close>Todos os produtos</a>${isPJ() ? '<a href="#/loja/todos?pro=1" data-close>Tamanhos profissionais</a>' : '<a href="#/p/kit-protocolo-spa" data-close>Kits</a>'}<a href="#" data-toast="account">Minha conta</a><a href="#" data-gate-open>${ic('swap', 18)}Trocar perfil de compra</a>`;
  }

  let toastTimer;
  function toast(html, ms = 3400) {
    const el = $('#toast');
    el.innerHTML = html;
    el.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove('show'), ms);
  }
  const INFO = {
    account: () => t('Área da cliente: pedidos, endereços e assinaturas.', 'Área PJ: pedidos, notas fiscais, boletos e recompras.'),
    favs: () => `Você tem ${S.fav.size} ${S.fav.size === 1 ? 'favorito' : 'favoritos'} salvos.`,
    social: () => 'Abre o perfil @reposcosmeticosoficial.',
    whats: () => 'Abre a conversa com a equipe comercial no WhatsApp.',
    page: () => 'Página institucional prevista para a próxima etapa do layout.',
    doc: () => 'Download do documento técnico do produto.',
    sample: () => 'Pedido de amostra enviado para a equipe comercial.',
    cadastro: () => 'Cadastro PJ: CNPJ, inscrição estadual e dados do negócio.'
  };
  const info = k => toast(`${ic('sparkle', 18)}<span><b>Protótipo</b> · ${(INFO[k] || INFO.page)()}</span>`);

  function setProfile(pf, opts = {}) {
    const changed = S.profile !== pf;
    S.profile = pf;
    LS.set('repos.profile', pf);
    document.body.classList.toggle('pj', pf === 'pj');
    document.body.classList.toggle('pf', pf !== 'pj');
    if (changed) {
      render(false);
      const m = $('#app'); m.classList.remove('swap'); void m.offsetWidth; m.classList.add('swap');
    }
    renderCart();
    if (opts.toast !== false) toast(`${ic(pf === 'pj' ? 'building' : 'user', 18)}<span>Você está vendo preços para <b>${pf === 'pj' ? 'Pessoa Jurídica' : 'Pessoa Física'}</b></span>`);
  }

  function openDrawer(w) {
    closeAll();
    document.body.classList.add(w + '-open');
    const d = $('#' + w);
    if (d) d.setAttribute('aria-hidden', 'false');
  }
  function closeAll() {
    document.body.classList.remove('cart-open', 'menu-open', 'filters-open');
    $$('.drawer').forEach(d => d.setAttribute('aria-hidden', 'true'));
  }

  /* ---------- POP-UP PF / PJ ---------- */
  function maskCNPJ(v) {
    const d = v.replace(/\D/g, '').slice(0, 14);
    let o = '';
    for (let i = 0; i < d.length; i++) { if (i === 2 || i === 5) o += '.'; if (i === 8) o += '/'; if (i === 12) o += '-'; o += d[i]; }
    return o;
  }
  function validCNPJ(v) {
    const d = v.replace(/\D/g, '');
    if (d.length !== 14 || /^(\d)\1+$/.test(d)) return false;
    const dv = n => {
      const w = n === 12 ? [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2] : [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
      let s = 0;
      for (let i = 0; i < n; i++) s += +d[i] * w[i];
      const r = s % 11;
      return r < 2 ? 0 : 11 - r;
    };
    return dv(12) === +d[12] && dv(13) === +d[13];
  }
  function openGate() {
    document.body.classList.add('gate-open');
    $$('.choice').forEach(b => b.classList.remove('sel'));
    $('#cnpjBox').classList.remove('open');
    $('#cnpjMsg').textContent = '';
    $('#cnpjMsg').className = 'msg';
    setTimeout(() => { const c = $('.choice'); if (c) c.focus({ preventScroll: true }); }, 80);
  }
  const closeGate = () => document.body.classList.remove('gate-open');

  /* ---------- carrossel ---------- */
  let slideTimer = null;
  const SL = { go: () => {}, restart: () => {} };
  function slidesInit() {
    clearInterval(slideTimer);
    const s = $('#slides');
    if (!s) return;
    const tr = $('.slides-track', s), n = tr.children.length;
    let i = 0;
    SL.go = k => { i = (k + n) % n; tr.scrollTo({ left: tr.clientWidth * i, behavior: 'smooth' }); };
    SL.restart = () => { clearInterval(slideTimer); slideTimer = setInterval(() => { if (document.contains(tr)) SL.go(i + 1); else clearInterval(slideTimer); }, 5500); };
    tr.addEventListener('scroll', () => {
      const k = Math.round(tr.scrollLeft / tr.clientWidth);
      if (k !== i) i = k;
      $$('.dots button', s).forEach((d, j) => d.classList.toggle('on', j === k));
    }, { passive: true });
    SL.restart();
  }

  /* ---------- roteamento ---------- */
  function render(scrollTop = true) {
    const h = location.hash.replace(/^#/, '') || '/';
    const [path, qsStr] = h.split('?');
    const parts = path.split('/').filter(Boolean);
    const qs = new URLSearchParams(qsStr || '');
    let html, title = 'Repós Cosméticos — A marca queridinha do Brasil';
    if (parts[0] === 'loja') {
      html = viewList(parts[1], qs);
      const c = CM[parts[1]];
      title = `${c ? c.name : 'Loja'} · Repós Cosméticos`;
      $('#q').value = qs.get('q') || '';
    } else if (parts[0] === 'p' && PM[parts[1]]) {
      html = viewProduct(parts[1]);
      title = `${PM[parts[1]].name} · Repós Cosméticos`;
    } else {
      html = viewHome();
    }
    $('#app').innerHTML = html;
    document.title = title;
    slidesInit();
    renderNav();
    document.body.classList.remove('filters-open');
    if (scrollTop) window.scrollTo(0, 0);
  }

  /* ---------- eventos ---------- */
  document.addEventListener('click', e => {
    const T = s => e.target.closest(s);
    let el;
    if ((el = T('[data-choose]'))) {
      if (el.dataset.choose === 'pf') { setProfile('pf'); closeGate(); return; }
      $$('.choice').forEach(b => b.classList.toggle('sel', b === el));
      $('#cnpjBox').classList.add('open');
      if (S.cnpj) $('#cnpjInput').value = S.cnpj;
      setTimeout(() => $('#cnpjInput').focus({ preventScroll: true }), 300);
      return;
    }
    if (T('[data-pj-later]')) { setProfile('pj'); closeGate(); return; }
    if (T('[data-gate-close]')) { closeGate(); return; }
    if (T('[data-gate-open]')) { e.preventDefault(); closeAll(); openGate(); return; }
    if ((el = T('[data-set]'))) { e.preventDefault(); closeAll(); setProfile(el.dataset.set); return; }
    if ((el = T('[data-open]'))) { e.preventDefault(); openDrawer(el.dataset.open); return; }
    if (T('[data-close]')) { closeAll(); return; }
    if ((el = T('[data-add]'))) { e.preventDefault(); addToCart(el.dataset.add, +el.dataset.v || 0, +el.dataset.q || 1); return; }
    if ((el = T('[data-addmany]'))) {
      const q = +el.dataset.q || 1, ids = el.dataset.addmany.split(',');
      ids.forEach(id => addToCart(id, 0, q, { silent: true }));
      toast(`${ic('check', 18)}<span><b>${ids.length} cores</b> da coleção Brasilidades ${t('na sacola', 'no pedido')}</span><button class="btn btn-lime" data-open="cart">${t('Ver sacola', 'Ver pedido')}</button>`);
      return;
    }
    if ((el = T('[data-fav]'))) {
      const id = el.dataset.fav;
      if (S.fav.has(id)) S.fav.delete(id); else S.fav.add(id);
      LS.set('repos.fav', [...S.fav]);
      el.classList.toggle('on', S.fav.has(id));
      return;
    }
    if ((el = T('[data-tab]'))) {
      S.homeTab = el.dataset.tab;
      $$('[data-tab]').forEach(b => b.classList.toggle('on', b === el));
      $('#bestGrid').innerHTML = bestGrid();
      return;
    }
    if ((el = T('[data-pick]'))) {
      const [g, id] = el.dataset.pick.split(':');
      S.pick[g] = id;
      $('#pk-' + g).innerHTML = pickInner(g, g === 'pomar' ? POMAR : BRASIL);
      return;
    }
    if ((el = T('[data-slide]'))) { SL.go(Math.round($('.slides-track').scrollLeft / $('.slides-track').clientWidth) + +el.dataset.slide); SL.restart(); return; }
    if ((el = T('[data-dot]'))) { SL.go(+el.dataset.dot); SL.restart(); return; }
    /* página de produto */
    if ((el = T('[data-gi]'))) { S.pdp.gi = +el.dataset.gi; rerender.gal(); return; }
    if ((el = T('[data-vi]'))) { S.pdp.vi = +el.dataset.vi; rerender.buy(); rerender.details(); return; }
    if ((el = T('[data-unit]'))) {
      const p = PM[S.pdp.id];
      S.pdp.unit = el.dataset.unit;
      if (S.pdp.unit === 'cx') S.pdp.qty = Math.max(p.box, Math.ceil(S.pdp.qty / p.box) * p.box);
      rerender.buy();
      return;
    }
    if ((el = T('[data-step]'))) {
      const p = PM[S.pdp.id], step = isPJ() && S.pdp.unit === 'cx' && p.box > 1 ? p.box : 1;
      S.pdp.qty = Math.max(step, S.pdp.qty + +el.dataset.step * step);
      rerender.buy();
      return;
    }
    if (T('[data-buy]')) { addToCart(S.pdp.id, S.pdp.vi, S.pdp.qty, { sub: !isPJ() && S.pdp.mode === 'sub' }); return; }
    if (T('[data-calc-add]')) {
      const p = PM[S.pdp.id], { units, days } = usage(p);
      S.pdp.rec = String(days);
      addToCart(p.id, S.pdp.vi, units, { silent: true });
      toast(`${ic('repeat', 18)}<span><b>${units} ${unitWord(p, units)}</b> no pedido, com recompra a cada ${days} dias</span><button class="btn btn-lime" data-open="cart">Ver pedido</button>`);
      return;
    }
    if ((el = T('[data-scroll]'))) { const target = document.getElementById(el.dataset.scroll); if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' }); return; }
    /* sacola */
    if ((el = T('[data-cq]'))) { const [i, d] = el.dataset.cq.split(':').map(Number); changeCartQty(i, d); return; }
    if ((el = T('[data-rm]'))) { S.cart.splice(+el.dataset.rm, 1); saveCart(); renderCart(); return; }
    if (T('[data-checkout]')) { toast(`${ic('sparkle', 18)}<span><b>Protótipo</b> · ${t('O checkout com cartão, Pix e boleto', 'O envio do pedido com faturamento')} entra na próxima etapa.</span>`); return; }
    if ((el = T('[data-toast]'))) { e.preventDefault(); info(el.dataset.toast); return; }
    if (T('a[href="#"]')) e.preventDefault();
  });

  document.addEventListener('change', e => {
    const el = e.target;
    if (el.matches('.filters input[type=checkbox]')) { location.hash = el.dataset.href; return; }
    if (el.id === 'ordSel') { location.hash = el.value; return; }
    if (el.name === 'mode') { S.pdp.mode = el.value; rerender.buy(); return; }
    if (el.id === 'qtyIn') {
      const p = PM[S.pdp.id], n = Math.max(1, parseInt(el.value, 10) || 1);
      S.pdp.qty = isPJ() && S.pdp.unit === 'cx' && p.box > 1 ? n * p.box : n;
      rerender.buy();
      return;
    }
    if (el.matches('[data-ci]')) {
      const it = S.cart[+el.dataset.ci], n = parseInt(el.value, 10);
      if (it) { if (!n || n < 1) S.cart.splice(+el.dataset.ci, 1); else it.qty = n; saveCart(); renderCart(); }
      return;
    }
    if (el.id === 'recompra') {
      S.pdp.rec = el.value;
      if (el.value) toast(`${ic('repeat', 18)}<span>Recompra programada a cada <b>${el.value} dias</b> ao finalizar o pedido.</span>`);
    }
  });

  document.addEventListener('input', e => {
    const el = e.target;
    if (el.id === 'attRange') {
      S.pdp.att = +el.value;
      $('#attVal').textContent = S.pdp.att;
      $('#calcOut').innerHTML = calcOut(PM[S.pdp.id]);
      return;
    }
    if (el.id === 'cnpjInput') {
      el.value = maskCNPJ(el.value);
      const msg = $('#cnpjMsg'), d = el.value.replace(/\D/g, '');
      if (d.length < 14) { msg.textContent = ''; msg.className = 'msg'; }
      else if (validCNPJ(d)) { msg.textContent = 'CNPJ válido. Seus preços profissionais estão prontos.'; msg.className = 'msg ok'; }
      else { msg.textContent = 'Confira o número: este CNPJ não é válido.'; msg.className = 'msg err'; }
      return;
    }
    if (el.id === 'cep') {
      const d = el.value.replace(/\D/g, '').slice(0, 8);
      el.value = d.length > 5 ? d.slice(0, 5) + '-' + d.slice(5) : d;
    }
  });

  document.addEventListener('submit', e => {
    const f = e.target;
    if (f.id === 'searchForm') {
      e.preventDefault();
      const q = $('#q').value.trim();
      location.hash = '#/loja/todos' + (q ? '?q=' + encodeURIComponent(q) : '');
      return;
    }
    if (f.id === 'cnpjForm') {
      e.preventDefault();
      const v = $('#cnpjInput').value;
      if (!validCNPJ(v)) {
        const msg = $('#cnpjMsg');
        msg.textContent = v.replace(/\D/g, '').length < 14 ? 'Digite os 14 números do CNPJ ou informe depois.' : 'Confira o número: este CNPJ não é válido.';
        msg.className = 'msg err';
        return;
      }
      S.cnpj = maskCNPJ(v);
      LS.set('repos.cnpj', S.cnpj);
      const wasPJ = isPJ();
      setProfile('pj');
      if (wasPJ) render(false);
      closeGate();
      return;
    }
    if (f.matches('[data-shipform]')) {
      e.preventDefault();
      const d = $('#cep').value.replace(/\D/g, '');
      if (d.length !== 8) { toast(`${ic('truck', 18)}<span>Digite um CEP com 8 números.</span>`); return; }
      S.pdp.cep = $('#cep').value;
      S.pdp.shipOK = true;
      const p = PM[S.pdp.id];
      $('#shipRes').innerHTML = shipHTML(p.variants[S.pdp.vi].pf * S.pdp.qty);
      return;
    }
    if (f.matches('[data-news]')) {
      e.preventDefault();
      toast(`${ic('check', 18)}<span>${t('Cadastro feito! Seu cupom de 10% chega no e-mail.', 'Pronto! A tabela profissional chega no seu e-mail.')}</span>`);
      f.reset();
    }
  });

  document.addEventListener('keydown', e => {
    if (e.key !== 'Escape') return;
    if (document.body.classList.contains('gate-open')) closeGate();
    closeAll();
  });

  window.addEventListener('hashchange', () => { closeAll(); render(true); });

  /* ---------- início ---------- */
  document.body.classList.toggle('pj', S.profile === 'pj');
  document.body.classList.toggle('pf', S.profile !== 'pj');
  renderCart();
  render(false);
  setTimeout(openGate, 500);
})();
