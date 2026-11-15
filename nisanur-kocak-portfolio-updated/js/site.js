/* Nisanur Koçak portfolio: content, snap cards, hash routing, project detail, gallery, lightbox, menu. */
(function () {
  'use strict';

  const SITE = {
    name: 'Nisanur Koçak',
    projects: [
      {
        id: 'fashion-forward', number: '01', title: 'Fashion Forward',
        cover: 'assets/covers/01-fashion-forward-ink.png',
        subtitle: 'An international project exploring sustainability and circular culture.',
        description: 'An Erasmus BIP project bringing participants together to learn about sustainability and circular culture, while sharing their different cultures.',
        layout: 'pair',
        images: [
          { src: 'projects/01-fashion-forward/loom-original.jpg', w: 1536, h: 2048, caption: 'Weaving on the loom', alt: 'Photograph of a weaving in progress on a wooden loom, Fashion Forward project.' },
          { src: 'projects/01-fashion-forward/textile-studies-original.jpg', w: 1536, h: 2048, caption: 'Textile studies', alt: 'Photograph of textile studies from the Fashion Forward project.' }
        ]
      },
      {
        id: 'chrysler-deconstruction', number: '02', title: 'The Chrysler Deconstruction',
        cover: 'assets/covers/02-chrysler-ink.png',
        subtitle: 'Art Deco architecture reinterpreted through contemporary haute couture silhouettes.',
        description: 'Inspired by the structural elegance and linear geometry of the Chrysler Building, this collection translates architectural arches into five distinct silhouettes. Deep black bases and gold contours reflect the building’s structure and character.',
        images: [
          { src: 'projects/02-chrysler/collection-original.png', w: 1328, h: 732, caption: 'Collection', alt: 'Original collection board for The Chrysler Deconstruction: five black silhouettes with gold contours.' },
          { src: 'projects/02-chrysler/concept-board-original.png', w: 1318, h: 742, caption: 'Concept board', alt: 'Original concept board for The Chrysler Deconstruction, inspired by the Chrysler Building.' }
        ]
      },
      {
        id: 'wild-balance', number: '03', title: 'Wild Balance (Digital Craft)', shortTitle: 'Wild Balance',
        cover: 'assets/covers/03-wild-balance-ink.png',
        subtitle: 'Zebra stripes meet jaguar spots through digital abstraction.',
        description: 'A digital craft study reconstructing elements of wild nature into modular, contemporary surface patterns. Developed through digital manipulation, the patterns are explored across trousers, vests and blouses.',
        images: [
          { src: 'projects/03-wild-balance/garment-mockups-original.png', w: 1322, h: 748, caption: 'Garment mock-ups', alt: 'Original garment mock-ups for Wild Balance: trousers, vests and blouses with zebra and jaguar inspired patterns.' },
          { src: 'projects/03-wild-balance/pattern-research-original.png', w: 1304, h: 730, caption: 'Pattern research', alt: 'Original pattern research board for Wild Balance, showing digital abstractions of zebra stripes and jaguar spots.' }
        ]
      },
      {
        id: 'natures-resonance', number: '04', title: 'Nature’s Resonance', featured: true,
        cover: 'assets/covers/04-natures-resonance-ink.png',
        subtitle: 'An experimental outerwear series translating natural elements into textile forms.',
        description: 'Water and tree bark visuals are layered digitally into blue-green textile surfaces, then explored across outerwear and jacket silhouettes. The process combines colour burn, linear fill and soft-light blending.',
        metadata: [['Sources', 'Water & tree bark'], ['Process', 'Digital layering'], ['Application', 'Outerwear'], ['Palette', 'Blue & green']],
        images: [
          { src: 'projects/04-natures-resonance/collection-original.png', w: 1316, h: 740, caption: 'Collection board, five looks', alt: 'Original Nature’s Resonance collection board: five fashion figures wearing blue, green and lavender patchwork jackets.' },
          { src: 'projects/04-natures-resonance/texture-research-original.png', w: 1316, h: 740, caption: 'Texture research', alt: 'Original Nature’s Resonance texture research board, layering water and tree bark imagery.' }
        ],
        looks: [
          ['look-01.png', 243], ['look-02.png', 290], ['look-03.png', 200], ['look-04.png', 304], ['look-05.png', 274]
        ].map(([f, w], i) => ({ src: 'projects/04-natures-resonance/looks/' + f, w, h: 740, alt: 'Look ' + (i + 1) + ' of 5, cut from the Nature’s Resonance collection board.' })),
        swatches: [
          ['water-source.png', 'Water source', 290, 219],
          ['bark-source.png', 'Tree bark source', 289, 250],
          ['lavender-layering.png', 'Lavender layering', 292, 216],
          ['cyan-layering.png', 'Cyan layering', 295, 233],
          ['green-layering.png', 'Green layering', 321, 248],
          ['deep-blue-layering.png', 'Deep blue layering', 314, 231]
        ].map(([f, label, w, h]) => ({ src: 'projects/04-natures-resonance/swatches/' + f, label, w, h }))
      }
    ]
  };

  const $ = (sel, root) => (root || document).querySelector(sel);
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const root = document.documentElement;
  const cards = $('#cards');
  const cardEls = Array.from(cards.querySelectorAll('.card'));
  const detail = $('#detail-view');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  /* ---- Project list (2×2 grid on desktop, swipe strip on phones) ---- */
  const list = $('#project-list');
  list.innerHTML = SITE.projects.map(p => `
    <li class="project">
      <a href="#${p.id}">
        <span class="p-text">
          <span class="p-num">${p.number}</span>
          <span class="p-title">${esc(p.shortTitle || p.title)}</span>
          <span class="p-more">View project →</span>
        </span>
        <img class="p-cover" src="${p.cover}" alt="">
      </a>
    </li>`).join('');

  const stripPos = $('.strip-pos');
  function stripIndex() { return Math.round(list.scrollLeft / Math.max(1, list.clientWidth)); }
  function syncStrip() { stripPos.textContent = (stripIndex() + 1) + ' / ' + SITE.projects.length; }
  function stripGo(i) {
    const n = SITE.projects.length;
    const target = ((i % n) + n) % n;
    list.scrollTo({ left: target * list.clientWidth, behavior: reducedMotion.matches ? 'auto' : 'smooth' });
  }
  list.addEventListener('scroll', () => requestAnimationFrame(syncStrip), { passive: true });
  $('.strip-prev').addEventListener('click', () => stripGo(stripIndex() - 1));
  $('.strip-next').addEventListener('click', () => stripGo(stripIndex() + 1));

  $('[data-explore]').addEventListener('click', e => {
    e.preventDefault();
    stripGo(0);
    const first = list.querySelector('a');
    if (first) first.focus({ preventScroll: true });
  });

  /* ---- Cards: which one is showing, header state ---- */
  let currentCard = 0;
  function onCardsScroll() {
    const top = cards.scrollTop;
    root.classList.toggle('is-scrolled', top > 30 || !detail.hidden);
    const idx = Math.round(top / Math.max(1, cards.clientHeight));
    if (idx !== currentCard) {
      currentCard = idx;
      markNav();
      if (window.Sea) window.Sea.nudge();
    }
  }
  cards.addEventListener('scroll', () => requestAnimationFrame(onCardsScroll), { passive: true });

  // One wheel gesture = one card (trackpad inertia is absorbed while the move runs).
  let wheelLock = 0;
  cards.addEventListener('wheel', e => {
    if (e.ctrlKey || Math.abs(e.deltaY) < Math.abs(e.deltaX)) return;
    const now = performance.now();
    if (now < wheelLock) { e.preventDefault(); wheelLock = Math.max(wheelLock, now + 220); return; }
    if (Math.abs(e.deltaY) < 3) return;
    const card = cardEls[currentCard];
    if (!card || card.offsetHeight > cards.clientHeight + 2) return;   // tall card: scroll natively
    const target = currentCard + (e.deltaY > 0 ? 1 : -1);
    if (target < 0 || target >= cardEls.length) return;
    e.preventDefault();
    wheelLock = now + 850;
    currentCard = target;
    goCard(target, true);
    markNav();
    if (window.Sea) window.Sea.nudge();
  }, { passive: false });

  function goCard(i, smooth) {
    const card = cardEls[i];
    if (!card) return;
    cards.scrollTo({ top: card.offsetTop, behavior: smooth && !reducedMotion.matches ? 'smooth' : 'auto' });
  }

  /* ---- Detail rendering ---- */
  function boardFigure(img, extraClass) {
    return `<figure class="board ${extraClass || ''}">
      <button type="button" class="board-btn" data-lightbox="${img.src}" data-caption="${esc(img.caption)}" data-alt="${esc(img.alt)}">
        <img src="${img.src}" width="${img.w}" height="${img.h}" alt="${esc(img.alt)}" loading="lazy">
      </button>
      <figcaption><span>${esc(img.caption)}</span><span>Select to view full size</span></figcaption>
    </figure>`;
  }

  function renderDetail(p) {
    const i = SITE.projects.indexOf(p);
    const prev = SITE.projects[(i - 1 + SITE.projects.length) % SITE.projects.length];
    const next = SITE.projects[(i + 1) % SITE.projects.length];
    let media;
    if (p.featured) {
      media = `
        ${boardFigure(p.images[0], 'nr-collection')}
        <div class="looks" role="group" aria-roledescription="carousel" aria-label="Nature’s Resonance looks" tabindex="0">
          <div class="looks-stage">
            <button type="button" class="looks-prev" aria-label="Previous look">‹</button>
            <div class="looks-img"><img src="${p.looks[0].src}" width="${p.looks[0].w}" height="740" alt="${esc(p.looks[0].alt)}"></div>
            <button type="button" class="looks-next" aria-label="Next look">›</button>
          </div>
          <p class="looks-pos" aria-live="polite">1 / ${p.looks.length}</p>
          <button type="button" class="looks-full" data-lightbox="${p.images[0].src}" data-caption="${esc(p.images[0].caption)}" data-alt="${esc(p.images[0].alt)}">View the complete board</button>
        </div>
        <ul class="swatches" aria-label="Process textures">
          ${p.swatches.map(s => `<li><figure><img src="${s.src}" width="${s.w}" height="${s.h}" alt="${esc(s.label)} texture" loading="lazy"><figcaption>${esc(s.label)}</figcaption></figure></li>`).join('')}
        </ul>
        <dl class="meta">${p.metadata.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl>
        <h2 class="subhead">Texture research</h2>
        ${boardFigure(p.images[1])}`;
    } else if (p.layout === 'pair') {
      media = `<div class="boards-pair">${p.images.map(img => boardFigure(img)).join('')}</div>`;
    } else {
      media = p.images.map(img => boardFigure(img)).join('');
    }

    detail.innerHTML = `
      <article class="detail" aria-labelledby="d-title">
        <div class="detail-grid">
          <div class="detail-text">
            <a class="back" href="#work"><span aria-hidden="true">←</span><span>Back to work</span></a>
            <p class="d-num">${p.number}</p>
            <h1 id="d-title" tabindex="-1">${esc(p.title)}</h1>
            <p class="d-sub">${esc(p.subtitle)}</p>
            <p class="d-desc">${esc(p.description)}</p>
            ${p.featured ? '<img class="d-siren" data-ambient src="assets/creatures/siren.png" width="491" height="368" alt="" aria-hidden="true">' : ''}
          </div>
          <div class="detail-media">${media}</div>
        </div>
        <nav class="pager" aria-label="More projects">
          <a class="prev" href="#${prev.id}"><small>← Previous project</small><span class="pg-title">${esc(prev.title)}</span></a>
          <a class="next" href="#${next.id}"><small>Next project →</small><span class="pg-title">${esc(next.title)}</span></a>
        </nav>
      </article>`;
    if (p.featured) setupLooks(p);
  }

  function setupLooks(p) {
    const box = $('.looks', detail);
    const img = $('.looks-img img', box);
    const pos = $('.looks-pos', box);
    let index = 0;
    function show(n) {
      index = (n + p.looks.length) % p.looks.length;
      const look = p.looks[index];
      img.src = look.src; img.width = look.w; img.alt = look.alt;
      pos.textContent = (index + 1) + ' / ' + p.looks.length;
    }
    $('.looks-prev', box).addEventListener('click', () => show(index - 1));
    $('.looks-next', box).addEventListener('click', () => show(index + 1));
    box.addEventListener('keydown', e => {
      if (e.key === 'ArrowLeft') { e.preventDefault(); show(index - 1); }
      if (e.key === 'ArrowRight') { e.preventDefault(); show(index + 1); }
    });
    p.looks.slice(1).forEach(l => { const im = new Image(); im.src = l.src; });
  }

  /* ---- Lightbox ---- */
  const lb = $('#lightbox');
  const lbImg = $('.lb-stage img', lb);
  const lbZoom = $('.lb-zoom', lb);
  function setZoom(on) {
    lb.classList.toggle('zoomed', on);
    lbZoom.setAttribute('aria-pressed', String(on));
    lbZoom.textContent = on ? 'Fit to screen' : 'Actual size';
  }
  function openLightbox(btn) {
    lbImg.src = btn.dataset.lightbox;
    lbImg.alt = btn.dataset.alt || '';
    $('#lb-caption').textContent = btn.dataset.caption || '';
    setZoom(false);
    if (typeof lb.showModal === 'function') lb.showModal(); else lb.setAttribute('open', '');
  }
  function closeLightbox() { if (lb.open) lb.close(); }
  document.addEventListener('click', e => {
    const btn = e.target.closest('[data-lightbox]');
    if (btn) openLightbox(btn);
  });
  $('.lb-close', lb).addEventListener('click', closeLightbox);
  lbZoom.addEventListener('click', () => setZoom(!lb.classList.contains('zoomed')));
  lb.addEventListener('click', e => { if (e.target === lb) closeLightbox(); });
  lb.addEventListener('close', () => { lbImg.removeAttribute('src'); });

  /* ---- Mobile menu ---- */
  const menuBtn = $('.menu-btn');
  const nav = $('#site-nav');
  function setMenu(open) {
    nav.classList.toggle('open', open);
    menuBtn.setAttribute('aria-expanded', String(open));
  }
  menuBtn.addEventListener('click', () => setMenu(menuBtn.getAttribute('aria-expanded') !== 'true'));
  nav.addEventListener('click', e => {
    const a = e.target.closest('a');
    if (!a) return;
    setMenu(false);
    // On phones, "Work" in the menu opens the first project straight away.
    if (a.getAttribute('href') === '#work' && window.matchMedia('(max-width: 700px)').matches) {
      e.preventDefault();
      location.hash = SITE.projects[0].id;
    }
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && menuBtn.getAttribute('aria-expanded') === 'true') { setMenu(false); menuBtn.focus(); }
  });
  document.addEventListener('click', e => {
    if (menuBtn.getAttribute('aria-expanded') === 'true' && !e.target.closest('.site-header')) setMenu(false);
  });

  /* ---- Routing on plain #name hashes ---- */
  function markNav() {
    const id = decodeURIComponent(location.hash.slice(1));
    const inDetail = !detail.hidden;
    nav.querySelectorAll('a[href^="#"]').forEach(a => {
      const t = a.getAttribute('href').slice(1);
      const current = inDetail ? t === 'work' : (t === 'work' ? currentCard === 0 : currentCard === 1 && (t === id || (t === 'about' && id !== 'contact')));
      if (current) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current');
    });
  }

  function closeDetail() {
    if (detail.hidden) return false;
    detail.hidden = true;
    detail.innerHTML = '';
    root.classList.remove('detail-open');
    cards.inert = false;
    return true;
  }

  function route(fromClick) {
    const id = decodeURIComponent(location.hash.slice(1));
    const project = SITE.projects.find(p => p.id === id);
    closeLightbox();
    if (project) {
      renderDetail(project);
      detail.hidden = false;
      detail.scrollTop = 0;
      root.classList.add('detail-open', 'is-scrolled');
      cards.inert = true;
      document.title = project.title + ' — ' + SITE.name;
      const h1 = $('#d-title', detail);
      if (h1) h1.focus({ preventScroll: true });
      if (window.Sea) window.Sea.nudge();
    } else {
      const wasDetail = closeDetail();
      document.title = SITE.name + ' — Fashion design portfolio';
      const smooth = !wasDetail;
      if (id === 'about' || id === 'contact') { goCard(1, smooth); focusQuiet(id); }
      else if (id === 'work' || id === '' || fromClick) { if (id === 'work' || id === '') goCard(0, smooth); }
      requestAnimationFrame(onCardsScroll);
      if (wasDetail && window.Sea) window.Sea.nudge();
    }
    markNav();
  }
  function focusQuiet(id) { const el = document.getElementById(id); if (el) el.focus({ preventScroll: true }); }

  // Same-hash clicks (e.g. "Work" while already on #work) still navigate.
  document.addEventListener('click', e => {
    const a = e.target.closest('a[href^="#"]');
    if (!a || a.hasAttribute('data-explore')) return;
    if (a.getAttribute('href') === location.hash || (a.getAttribute('href') === '#work' && location.hash === '')) {
      e.preventDefault();
      route(true);
    }
  });
  window.addEventListener('hashchange', () => route(false));
  route(false);

  /* ---- Shared profile data: portfolio.json drives the name, programme and author photo. ---- */
  // Static markup remains usable when a preview cannot fetch JSON (for example file://).
  try {
    fetch('portfolio.json', { cache: 'no-cache' })
      .then(async response => {
        if (!response.ok || !/json/i.test(response.headers.get('content-type') || '')) return null;
        return { data: await response.json(), baseUrl: response.url };
      })
      .then(result => {
        if (!result || !result.data || result.data.schemaVersion !== 1) return;
        const { data, baseUrl } = result;
        if (typeof data.name === 'string' && data.name.trim()) {
          SITE.name = data.name.trim();
          document.querySelectorAll('[data-profile-name]').forEach(el => { el.textContent = SITE.name; });
          const photo = $('[data-profile-photo]');
          if (photo) photo.alt = 'Photograph of ' + SITE.name + '.';
          const illustration = $('[data-profile-illustration]');
          if (illustration) illustration.alt = 'Pencil-style drawn portrait of ' + SITE.name + ' with long wavy hair and a hoop earring.';
          const project = SITE.projects.find(p => p.id === decodeURIComponent(location.hash.slice(1)));
          document.title = project
            ? project.title + ' — ' + SITE.name
            : SITE.name + ' — Fashion design portfolio';
          const description = $('meta[name="description"]');
          if (description) description.content = SITE.name + ', fashion design student exploring digital design through fashion.';
        }
        if (typeof data.studyProgram === 'string' && data.studyProgram.trim()) {
          document.querySelectorAll('[data-profile-study-program]').forEach(el => {
            // Preserve the existing English display style for the current programme.
            el.textContent = data.studyProgram === 'Fashion Design' ? 'Fashion design' : data.studyProgram.trim();
          });
        }
        if (typeof data.photoOriginal === 'string' && data.photoOriginal.trim()) {
          // Resolve beside portfolio.json, including when deployed in a GitHub Pages subdirectory.
          const url = new URL(data.photoOriginal, baseUrl);
          const localPreview = url.protocol === 'http:' && url.origin === location.origin;
          if (url.protocol === 'https:' || localPreview) {
            const photo = $('[data-profile-photo]');
            if (photo && photo.src !== url.href) photo.src = url.href;
          }
        }
        // The short Czech gallery bio deliberately does not replace the longer English About text.
        // photoStamp is reserved for the shared gallery and does not replace either website portrait.
      })
      .catch(() => {});
  } catch (_) { /* static markup stays as the fallback */ }

  /* ---- Sea motion ---- */
  if (window.Sea) {
    window.Sea.init({
      fishLayer: $('#fish-layer'),
      waterCanvas: $('#water-layer'),
      sprites: ['assets/fish/fish-sardine-sm.webp', 'assets/fish/fish-herring-sm.webp']
    });
  }
})();
