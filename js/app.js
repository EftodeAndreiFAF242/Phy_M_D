/* Kosmos: worldview atlas. A front-end-only prototype: no backend, no accounts.
   Everything the user creates (quiz result, constellation, journal) stays in this browser's localStorage. */
(function () {
  'use strict';

  const K = window.KOSMOS;
  const T = K.traditions;
  const Q = K.questions;
  const byId = Object.fromEntries(T.map(t => [t.id, t]));

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI'];
  const hasGreek = s => /[Ͱ-Ͽἀ-῿]/.test(s);
  const debounce = (fn, ms) => { let t; return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); }; };

  /* ---------- Storage (always optional) ---------- */
  const store = {
    get(k, d) { try { const v = localStorage.getItem('kosmos:' + k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem('kosmos:' + k, JSON.stringify(v)); } catch (e) { /* storage blocked: the app still works */ } },
    del(k) { try { localStorage.removeItem('kosmos:' + k); } catch (e) { } }
  };

  /* ---------- Icons ---------- */
  const ICONS = {
    home: '<path d="M3.5 10.5 12 3.5l8.5 7V20a1 1 0 0 1-1 1h-5v-6h-5v6h-5a1 1 0 0 1-1-1z"/>',
    atlas: '<circle cx="12" cy="12" r="9"/><path d="m15.5 8.5-2 5-5 2 2-5z"/>',
    compare: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M9 4v16M15 4v16"/>',
    timeline: '<path d="M6 3h12M6 21h12M8 3v3.5a4 4 0 0 0 1.6 3.2L12 12l2.4-2.3A4 4 0 0 0 16 6.5V3M8 21v-3.5a4 4 0 0 1 1.6-3.2L12 12l2.4 2.3a4 4 0 0 1 1.6 3.2V21"/>',
    cave: '<path d="M12 3c.4 2.8 3.5 4.6 3.5 8.2A3.5 3.5 0 0 1 12 14.7a3.5 3.5 0 0 1-3.5-3.5c0-1.4.6-2.4 1.3-3.2C8 9.3 6.5 11.6 6.5 14.5a5.5 5.5 0 0 0 11 0C17.5 9 12 7 12 3z"/>',
    agora: '<path d="M20.5 12a8.5 8.5 0 0 1-12.3 7.6L3.5 21l1.4-4.5A8.5 8.5 0 1 1 20.5 12z"/><path d="M8.5 12h.01M12 12h.01M15.5 12h.01"/>',
    quiz: '<path d="M12 3.5l1.9 4.8 4.9 1.9-4.9 1.9L12 17l-1.9-4.9-4.9-1.9 4.9-1.9z"/><path d="M19 15.5l.8 2 2 .8-2 .8-.8 2-.8-2-2-.8 2-.8z"/>',
    constellation: '<circle cx="5" cy="17" r="1.6"/><circle cx="10" cy="9" r="1.6"/><circle cx="15" cy="14" r="1.6"/><circle cx="19.5" cy="5" r="1.6"/><path d="m6 15.6 3.1-5.2M11.3 10l2.5 2.8M16 12.6l2.8-6.2"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2.5v2.2M12 19.3v2.2M2.5 12h2.2M19.3 12h2.2M5.3 5.3l1.6 1.6M17.1 17.1l1.6 1.6M5.3 18.7l1.6-1.6M17.1 6.9l1.6-1.6"/>',
    moon: '<path d="M20 14.6A8.2 8.2 0 1 1 9.4 4a6.6 6.6 0 0 0 10.6 10.6z"/>',
    arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    back: '<path d="M19 12H5M11 6l-6 6 6 6"/>',
    chevL: '<path d="m15 6-6 6 6 6"/>',
    chevR: '<path d="m9 6 6 6-6 6"/>',
    refresh: '<path d="M20 11a8 8 0 0 0-14.6-4.5M4 4v4h4M4 13a8 8 0 0 0 14.6 4.5M20 20v-4h-4"/>',
    check: '<path d="m5 12.5 4.5 4.5L19 7.5"/>',
    light: '<path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.6 10.8c.7.5 1.1 1.3 1.1 2.2h5c0-.9.4-1.7 1.1-2.2A6 6 0 0 0 12 3z"/>',
    trash: '<path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/>',
    expand: '<path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/>',
    reality: '<path d="M12 3 20 7.5v9L12 21 4 16.5v-9z"/><path d="M4 7.5 12 12l8-4.5M12 12v9"/>',
    knowledge: '<path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"/><circle cx="12" cy="12" r="3"/>',
    human: '<circle cx="12" cy="7.5" r="3.5"/><path d="M5 20.5c.8-4 3.6-6.5 7-6.5s6.2 2.5 7 6.5"/>',
    good: '<path d="M12 4v16M8 20h8M5 7.5h14"/><path d="m5 7.5-2.5 6a2.5 2.5 0 0 0 5 0zM19 7.5l-2.5 6a2.5 2.5 0 0 0 5 0z"/>',
    divine: '<circle cx="12" cy="12" r="3.2"/><path d="M12 2.5v4M12 17.5v4M2.5 12h4M17.5 12h4M5.6 5.6 8 8M16 16l2.4 2.4M5.6 18.4 8 16M16 8l2.4-2.4"/>',
    destiny: '<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="4.5"/><circle cx="12" cy="12" r="1"/>'
  };
  const icon = (n, cls = '') => `<svg class="ic ${cls}" viewBox="0 0 24 24" aria-hidden="true">${ICONS[n] || ''}</svg>`;
  const medal = (t, size, plain) => `<span class="medal t-${t.id}${plain ? ' plain' : ''}"${size ? ` style="--s:${size}px"` : ''} aria-hidden="true">${t.letter}</span>`;

  /* ---------- Theme ---------- */
  const mqLight = window.matchMedia('(prefers-color-scheme: light)');
  const currentTheme = () => document.documentElement.getAttribute('data-theme') || (mqLight.matches ? 'light' : 'dark');
  function renderThemeToggle() {
    const dark = currentTheme() === 'dark';
    const b = $('#theme-toggle');
    b.innerHTML = `<span class="tt-icon">${icon(dark ? 'sun' : 'moon')}</span><span><strong>${dark ? 'Leave the cave' : 'Back to the cave'}</strong><span>${dark ? 'Switch to daylight' : 'Switch to the night sky'}</span></span>`;
    b.setAttribute('aria-label', dark ? 'Switch to the light theme' : 'Switch to the dark theme');
  }
  function setTheme(t) {
    document.documentElement.setAttribute('data-theme', t);
    store.set('theme', t);
    renderThemeToggle();
    stars.sync();
  }

  /* ---------- Starfield (dark theme only) ---------- */
  const stars = (function () {
    const c = $('#stars');
    const ctx = c.getContext('2d');
    let w = 0, h = 0, pts = [], raf = 0, running = false;
    function resize() {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      w = window.innerWidth; h = window.innerHeight;
      c.width = w * dpr; c.height = h * dpr; c.style.width = w + 'px'; c.style.height = h + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const n = Math.round((w * h) / 4200);
      pts = [];
      for (let i = 0; i < n; i++) {
        const big = Math.random() < 0.07;
        pts.push({ x: Math.random() * w, y: Math.random() * h, r: big ? 1.2 + Math.random() * 0.9 : 0.3 + Math.random() * 0.8,
          a: 0.25 + Math.random() * 0.65, t: Math.random() * 6.28, s: 0.004 + Math.random() * 0.016, tone: Math.random() });
      }
      draw();
    }
    function draw() {
      ctx.clearRect(0, 0, w, h);
      for (const p of pts) {
        p.t += p.s;
        const al = p.a * (0.55 + 0.45 * Math.sin(p.t));
        ctx.fillStyle = p.tone < 0.1 ? '#FFD9A8' : p.tone < 0.2 ? '#CFC6FF' : '#FFFFFF';
        ctx.globalAlpha = al;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 6.283); ctx.fill();
        if (p.r > 1.3) { ctx.globalAlpha = al * 0.22; ctx.beginPath(); ctx.arc(p.x, p.y, p.r * 3.2, 0, 6.283); ctx.fill(); }
      }
      ctx.globalAlpha = 1;
    }
    function loop() { draw(); raf = requestAnimationFrame(loop); }
    function sync() {
      const dark = currentTheme() === 'dark';
      if (dark && !reduceMotion && !running) { running = true; loop(); }
      else if ((!dark || reduceMotion) && running) { running = false; cancelAnimationFrame(raf); }
      if (dark && !running) draw();
    }
    window.addEventListener('resize', debounce(resize, 150));
    resize();
    return { sync };
  })();

  /* ---------- Navigation ---------- */
  const NAV = [
    { label: 'Explore', items: [['home', 'Home'], ['atlas', 'Atlas'], ['compare', 'Compare'], ['timeline', 'Timeline']] },
    { label: 'Experience', items: [['cave', 'The Cave'], ['agora', 'Agora']] },
    { label: 'You', items: [['quiz', 'Worldview quiz'], ['constellation', 'My constellation']] }
  ];
  function buildNav() {
    $('#nav').innerHTML = NAV.map(g => `
      <div class="nav-group">
        <span class="nav-label">${g.label}</span>
        ${g.items.map(([id, label]) => `<a class="nav-item" href="#${id}" data-route="${id}">${icon(id)}<span>${label}</span><i class="nav-star" aria-hidden="true"></i></a>`).join('')}
      </div>`).join('');
  }
  function openDrawer(open) {
    $('#sidebar').classList.toggle('open', open);
    $('#scrim').classList.toggle('show', open);
    $('#menu-btn').setAttribute('aria-expanded', String(open));
  }
  function updateSideYou() {
    const q = store.get('quiz', null);
    const el = $('#side-you');
    if (!q || !byId[q.top]) { el.hidden = true; return; }
    const t = byId[q.top];
    el.hidden = false;
    el.className = `side-you t-${t.id}`;
    el.innerHTML = `${medal(t, 30, true)}<span><strong>${t.archetype}</strong>Your lens · ${t.name}</span>`;
  }

  /* ---------- Tooltip & toast ---------- */
  const tip = $('#tip');
  function showTip(html, x, y) {
    tip.innerHTML = html;
    tip.classList.add('show');
    const r = tip.getBoundingClientRect();
    let left = x + 14, top = y + 16;
    if (left + r.width > window.innerWidth - 8) left = x - r.width - 14;
    if (top + r.height > window.innerHeight - 8) top = y - r.height - 14;
    tip.style.left = Math.max(8, left) + 'px';
    tip.style.top = Math.max(8, top) + 'px';
  }
  function hideTip() { tip.classList.remove('show'); }
  function bindTips(root) {
    root.addEventListener('pointermove', e => {
      const el = e.target.closest('[data-tip]');
      if (el && root.contains(el)) showTip(el.dataset.tip, e.clientX, e.clientY); else hideTip();
    });
    root.addEventListener('pointerleave', hideTip);
    root.addEventListener('focusin', e => {
      const el = e.target.closest('[data-tip]');
      if (!el) return;
      const r = el.getBoundingClientRect();
      showTip(el.dataset.tip, r.right, r.top + r.height / 2);
    });
    root.addEventListener('focusout', hideTip);
  }
  let toastTimer;
  function toast(msg) {
    const t = $('#toast');
    t.innerHTML = icon('check') + `<span>${esc(msg)}</span>`;
    t.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove('show'), 2600);
  }

  /* ---------- Shared pieces ---------- */
  function dayIndex() {
    const now = new Date();
    return Math.floor((now - new Date(now.getFullYear(), 0, 0)) / 864e5);
  }
  function barHTML(t, value, tipText) {
    return `<div class="bar-row t-${t.id}" data-tip="${esc(tipText)}" tabindex="0">
      <span class="bar-name">${t.name}</span>
      <span class="bar-track"><span class="bar-fill" style="width:0%" data-w="${value}"></span></span>
      <span class="bar-val">${value}%</span>
    </div>`;
  }
  function growBars(root) {
    requestAnimationFrame(() => requestAnimationFrame(() => {
      $$('.bar-fill', root).forEach(b => { b.style.width = b.dataset.w + '%'; });
    }));
  }
  function similarity(values, profile) {
    let sum = 0;
    Q.forEach(q => { const d = values[q.id] - profile[q.id]; sum += d * d; });
    return Math.round(100 - Math.sqrt(sum / Q.length));
  }
  function blendFromScores(scores) {
    const total = T.reduce((s, t) => s + (scores[t.id] || 0), 0) || 1;
    const out = {};
    Q.forEach(q => { out[q.id] = Math.round(T.reduce((s, t) => s + (scores[t.id] || 0) * t.profile[q.id], 0) / total); });
    return out;
  }
  function lean(q, v) {
    if (v <= 40) return `leans toward “${q.left}”`;
    if (v >= 60) return `leans toward “${q.right}”`;
    return 'sits in the middle';
  }

  /* ======================================================================
     VIEWS — each returns { title, html, mount(root) }
     ====================================================================== */

  /* ---------- Home ---------- */
  let pendingQuestion = null;

  function orrery() {
    const sizes = [36, 49, 62, 75];
    const periods = [46, 64, 84, 110];
    const angles = [38, 205, 118, 292];
    const orbits = T.map((t, i) => `
      <div class="orbit" style="--size:${sizes[i]}%;--d:${periods[i]}s;--a:${angles[i]}deg">
        <a class="planet t-${t.id}" href="#${t.id}" aria-label="Open ${t.name}">
          <span class="planet-inner">${medal(t)}<span class="planet-label">${t.name}</span></span>
        </a>
      </div>`).join('');
    const ring = 'ΓΝΩΘΙ ΣΕΑΥΤΟΝ · ΜΗΔΕΝ ΑΓΑΝ · ΤΙ ΕΣΤΙ · ';
    return `<div class="orrery">
      <svg class="orrery-ring" viewBox="0 0 400 400" aria-hidden="true">
        <defs><path id="ring-path" d="M200,200 m-189,0 a189,189 0 1,1 378,0 a189,189 0 1,1 -378,0"/></defs>
        <circle class="ticks" cx="200" cy="200" r="198"/>
        <text><textPath href="#ring-path" textLength="1180" lengthAdjust="spacing">${ring + ring}</textPath></text>
      </svg>
      <div class="sun"><span>?</span></div>
      ${orbits}
    </div>`;
  }

  function Home() {
    const quiz = store.get('quiz', null);
    const di = dayIndex();
    const dq = K.dailyQuestions[di % K.dailyQuestions.length];
    const dqT = byId[dq.by];
    const dateLabel = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long' });
    let qi = di % K.quotes.length;

    let status;
    if (quiz && byId[quiz.top]) {
      const t = byId[quiz.top];
      const pct = Math.round(((quiz.scores[t.id] || 0) / 10) * 100);
      status = `<a class="panel status-card t-${t.id}" href="#quiz" style="text-decoration:none;color:inherit">
        ${medal(t, 56)}
        <div class="status-text"><strong>Your lens: ${t.archetype}</strong><span>${pct}% of your quiz answers lean toward ${t.name}. Open your result or compare it with your constellation.</span></div>
        <span class="btn btn-ghost btn-sm">See my result ${icon('arrow', 'ic-arrow')}</span></a>`;
    } else {
      status = `<div class="panel status-card">
        <span class="status-orb">${icon('quiz')}</span>
        <div class="status-text"><strong>You have not mapped your worldview yet</strong><span>Ten questions, about three minutes. There are no wrong answers.</span></div>
        <a class="btn btn-primary btn-sm" href="#quiz">Start the quiz ${icon('arrow', 'ic-arrow')}</a></div>`;
    }

    const html = `
      <section class="hero">
        <div class="hero-copy">
          <p class="eyebrow">Atlas of worldviews · Socrates to Aquinas</p>
          <h1 class="display">How do <em>you</em> see the world?</h1>
          <p class="lead">Everyone lives inside a worldview: a set of answers to the deepest questions. What is real? What can we know? How should we live? Explore four answers that shaped Western thought, then map your own.</p>
          <div class="hero-actions">
            <a class="btn btn-primary" href="#quiz">Discover your worldview ${icon('arrow', 'ic-arrow')}</a>
            <a class="btn btn-ghost" href="#atlas">Explore the atlas</a>
          </div>
          <dl class="hero-facts">
            <div><dt>4</dt><dd>Traditions</dd></div>
            <div><dt>6</dt><dd>Great questions</dd></div>
            <div><dt>25</dt><dd>Centuries of ideas</dd></div>
          </dl>
        </div>
        <div class="hero-visual">
          ${orrery()}
          <p class="orrery-caption">Four traditions circling the same question. Hover to pause the orbits, click one to open its plate.</p>
        </div>
      </section>

      ${status}

      <section class="section">
        <header class="section-head"><div>
          <p class="eyebrow">The anatomy of a worldview</p>
          <h2 class="h2">Six questions every worldview answers</h2>
          <p>Whether we notice it or not, each of us lives by some answer to these. Pick one to see how the four traditions reply.</p>
        </div></header>
        <div class="q-grid">${Q.map(q => `
          <button class="q-tile" type="button" data-q="${q.id}">
            <span class="q-top"><span class="q-icon">${icon(q.id)}</span><span class="q-greek" lang="grc">${q.greek}</span></span>
            <span class="q-title">${q.title}</span>
            <span class="q-ask">${q.ask}</span>
            <span class="q-field"><span>${q.field}</span>${icon('arrow')}</span>
          </button>`).join('')}
        </div>
      </section>

      <div class="meander" aria-hidden="true"></div>

      <section class="section">
        <header class="section-head">
          <div><p class="eyebrow">Four lenses</p><h2 class="h2">Four ways of seeing the world</h2></div>
          <a class="link-arrow" href="#atlas">Open the atlas ${icon('arrow')}</a>
        </header>
        <div class="lens-grid">${T.map(t => `
          <a class="lens t-${t.id}" href="#${t.id}">
            <span class="lens-top">${medal(t, 52)}<span class="lens-plate">PLATE ${t.plate}</span></span>
            <h3>${t.name}</h3>
            <span class="arch">${t.archetype}</span>
            <p>${t.tagline}</p>
            <span class="dates"><span>${t.dates}</span>${icon('arrow')}</span>
          </a>`).join('')}
        </div>
      </section>

      <section class="section">
        <header class="section-head"><div><p class="eyebrow">Today · ${dateLabel}</p><h2 class="h2">A thought, and a question</h2></div></header>
        <div class="today">
          <article class="plate quote-card" id="quote-card" aria-live="polite"></article>
          <article class="plate reflect t-${dqT.id}">
            <p class="eyebrow no-mark">Question of the day</p>
            <h3 class="reflect-q">${dq.q}</h3>
            <span class="chip chip-dot chip-tint" style="width:fit-content">In the spirit of ${dqT.name}</span>
            <label class="sr-only" for="reflect-text">Your reflection</label>
            <textarea class="field" id="reflect-text" placeholder="Write a few honest lines. Only you will see them."></textarea>
            <div class="reflect-foot">
              <a class="muted" id="reflect-count" href="#constellation"></a>
              <button class="btn btn-primary btn-sm" id="reflect-save" type="button">Save reflection</button>
            </div>
          </article>
        </div>
      </section>

      <section class="section">
        <header class="section-head"><div><p class="eyebrow">Experiences</p><h2 class="h2">Step inside the ideas</h2></div></header>
        <div class="exp-grid">
          <a class="exp" href="#cave">
            <div class="exp-copy"><p class="eyebrow no-mark">Plato · Republic VII</p><h3>Escape the Cave</h3>
              <p>Walk through the five stages of Plato's allegory, from chained shadows to the sun.</p>
              <span class="link-arrow">Begin the ascent ${icon('arrow')}</span></div>
            <div class="exp-art cave-art" aria-hidden="true"></div>
          </a>
          <a class="exp" href="#agora">
            <div class="exp-copy"><p class="eyebrow no-mark">A Socratic dialogue</p><h3>Talk with Socrates</h3>
              <p>Tell him what makes a life good, then watch him question your answer.</p>
              <span class="link-arrow">Enter the agora ${icon('arrow')}</span></div>
            <div class="exp-art agora-art" aria-hidden="true">
              <span class="mini-bubble">What makes a life good?</span>
              <span class="mini-bubble you">Pleasure, I think.</span>
              <span class="mini-bubble">Then let us test that…</span>
            </div>
          </a>
        </div>
      </section>

      <footer class="foot-note">
        <div class="meander" aria-hidden="true"></div>
        <p>Kosmos is a study prototype made for a philosophy course. Quotations follow standard English translations. The archetypes and the six worldview axes are simplifications, meant to start a conversation rather than end one.</p>
      </footer>`;

    function mount(root) {
      $$('.q-tile', root).forEach(b => b.addEventListener('click', () => { pendingQuestion = b.dataset.q; location.hash = 'compare'; }));

      const card = $('#quote-card', root);
      function renderQuote() {
        const q = K.quotes[qi];
        const t = byId[q.by];
        card.className = `plate quote-card t-${t.id}`;
        card.innerHTML = `
          <span class="quote-mark" aria-hidden="true">“</span>
          <p class="quote-text">${q.text}</p>
          <p class="quote-source">${medal(t, 30, true)}<span>${q.source}</span></p>
          <div class="quote-foot">
            <span class="quote-count">${String(qi + 1).padStart(2, '0')} / ${K.quotes.length}</span>
            <div class="pager-btns">
              <button class="icon-btn" type="button" data-dir="-1" aria-label="Previous quotation">${icon('chevL')}</button>
              <button class="icon-btn" type="button" data-dir="1" aria-label="Next quotation">${icon('chevR')}</button>
            </div>
          </div>`;
      }
      card.addEventListener('click', e => {
        const b = e.target.closest('[data-dir]');
        if (!b) return;
        qi = (qi + Number(b.dataset.dir) + K.quotes.length) % K.quotes.length;
        renderQuote();
        $(`[data-dir="${b.dataset.dir}"]`, card).focus();
      });
      renderQuote();

      const ta = $('#reflect-text', root);
      const count = $('#reflect-count', root);
      const draftKey = 'draft-' + di;
      ta.value = store.get(draftKey, '');
      ta.addEventListener('input', debounce(() => store.set(draftKey, ta.value), 300));
      function renderCount() {
        const n = store.get('journal', []).length;
        count.textContent = n ? `${n} reflection${n > 1 ? 's' : ''} in your journal` : 'Your reflections are kept in My constellation';
      }
      renderCount();
      $('#reflect-save', root).addEventListener('click', () => {
        const a = ta.value.trim();
        if (!a) { ta.focus(); ta.placeholder = 'Write at least a few words first.'; return; }
        const j = store.get('journal', []);
        j.unshift({ id: Date.now(), date: new Date().toISOString(), q: dq.q, by: dq.by, a });
        store.set('journal', j);
        store.del(draftKey);
        ta.value = '';
        renderCount();
        toast('Reflection saved to your journal');
      });
    }
    return { title: '', html, mount };
  }

  /* ---------- Atlas ---------- */
  function Atlas() {
    const node = t => `<a class="lineage-node t-${t.id}" href="#${t.id}">${medal(t, 44, true)}<span><strong>${t.name}</strong><span>${t.dates}</span></span></a>`;
    const link = label => `<span class="lineage-link" aria-hidden="true"><small>${label}</small><i></i></span>`;
    const html = `
      <header class="page-head">
        <p class="eyebrow">The atlas · Four plates</p>
        <h1 class="display">Four ways of seeing the world</h1>
        <p class="lead">Three Greek thinkers who taught one another, and a faith that later absorbed them all. Each plate opens a complete worldview: its answers, its key ideas and its sources.</p>
      </header>
      <div class="panel lineage" aria-label="Who taught whom">
        ${node(T[0])}${link('taught')}${node(T[1])}${link('taught')}${node(T[2])}${link('absorbed into')}${node(T[3])}
      </div>
      <div class="atlas-grid">${T.map(t => `
        <a class="plate atlas-card t-${t.id}" href="#${t.id}">
          <div class="atlas-head">${medal(t, 84)}
            <div><span class="lens-plate">PLATE ${t.plate} · ${t.era.toUpperCase()}</span><h2>${t.name}</h2>
              <span class="meta-row"><span>${t.dates}</span><span>${t.place}</span></span></div>
          </div>
          <span class="arch">${t.archetype}</span>
          <p class="tagline">${t.tagline}</p>
          <p class="summary">${t.summary}</p>
          <div class="chip-row">${t.concepts.slice(0, 3).map(c => `<span class="chip">${c.term}</span>`).join('')}</div>
          <div class="atlas-foot"><span class="muted" style="font-size:14px">${t.lineage}</span><span class="link-arrow">Open plate ${icon('arrow')}</span></div>
        </a>`).join('')}
      </div>`;
    return { title: 'Atlas', html };
  }

  /* ---------- Tradition detail ---------- */
  function Detail(t) {
    const i = T.indexOf(t);
    const prev = T[(i + T.length - 1) % T.length];
    const next = T[(i + 1) % T.length];
    const html = `
      <div class="detail-top">
        <a class="back" href="#atlas">${icon('back')} The atlas</a>
        <section class="plate d-hero t-${t.id}">
          ${medal(t, 150)}
          <div class="d-hero-copy">
            <p class="eyebrow">Plate ${t.plate} · ${t.era}</p>
            <h1 class="display">${t.name}</h1>
            <p class="meta-row"><span>${t.dates}</span><span>${t.place}</span></p>
            <span class="arch">${t.archetype}</span>
            <p class="lead">${t.tagline}</p>
          </div>
        </section>
      </div>

      <blockquote class="d-quote t-${t.id}"><p>${t.quote.text}</p><cite>${t.quote.source}</cite></blockquote>

      <div class="d-grid t-${t.id}">
        <article class="panel d-story"><p class="eyebrow">The story</p><p>${t.summary}</p>
          <dl class="d-facts">${t.facts.map(f => `<div><dt>${f.k}</dt><dd>${f.v}</dd></div>`).join('')}</dl></article>
        <aside class="panel d-works">
          <p class="eyebrow">Read the sources</p>
          <p class="muted">${t.worksNote}</p>
          <ul class="works-list">${t.works.map(w => `<li><strong>${w.title}</strong><span>${w.by}</span></li>`).join('')}</ul>
          <p class="d-lineage">${t.lineage}</p>
        </aside>
      </div>

      <section class="section t-${t.id}">
        <header class="section-head">
          <div><p class="eyebrow">Worldview at a glance</p><h2 class="h2">How ${t.name} answers the six questions</h2></div>
          <a class="link-arrow" href="#compare">Compare with the others ${icon('arrow')}</a>
        </header>
        <div class="answers">${Q.map(q => {
          const a = t.answers[q.id];
          return `<div class="answer-row">
            <div class="answer-q"><span class="q-icon">${icon(q.id)}</span><div><strong>${q.title}</strong><small>${q.field}</small></div></div>
            <div class="answer-body"><h3>${a.short}</h3><p>${a.text}</p></div>
            <span class="chip chip-tint">${a.term}</span>
          </div>`;
        }).join('')}</div>
      </section>

      <section class="section t-${t.id}">
        <header class="section-head"><div><p class="eyebrow">Key concepts</p><h2 class="h2">Six words to know</h2></div></header>
        <div class="concepts">${t.concepts.map(c => `
          <article class="concept"><span class="concept-orig"${hasGreek(c.orig) ? ' lang="grc"' : ''}>${c.orig}</span><h3>${c.term}</h3><p>${c.def}</p></article>`).join('')}
        </div>
      </section>

      <nav class="pager" aria-label="Other plates">
        <a class="t-${prev.id}" href="#${prev.id}">${medal(prev, 40)}<span><small>Previous plate</small><strong>${prev.name}</strong></span></a>
        <a class="next t-${next.id}" href="#${next.id}"><span><small>Next plate</small><strong>${next.name}</strong></span>${medal(next, 40)}</a>
      </nav>`;
    return { title: t.name, html };
  }

  /* ---------- Compare ---------- */
  function Compare() {
    let cur = pendingQuestion || store.get('cmpQ', 'reality');
    if (!Q.find(q => q.id === cur)) cur = 'reality';
    pendingQuestion = null;
    const shown = new Set(T.map(t => t.id));

    const html = `
      <header class="page-head">
        <p class="eyebrow">Compare · Side by side</p>
        <h1 class="display">One question, four answers</h1>
        <p class="lead">Choose a question. The line shows where each tradition stands, from this world on the left to a reality beyond it on the right. The cards explain why.</p>
      </header>
      <div class="q-tabs" role="tablist" aria-label="Worldview questions">${Q.map(q => `
        <button class="q-tab" type="button" role="tab" id="tab-${q.id}" data-q="${q.id}" aria-selected="${q.id === cur}" aria-controls="focus" tabindex="${q.id === cur ? 0 : -1}">${icon(q.id)}${q.title}</button>`).join('')}
      </div>
      <section class="focus" id="focus" role="tabpanel">
        <div class="focus-head" id="focus-head"></div>
        <div class="panel spectrum">
          <div class="spec-title"><span>Where each tradition stands</span><span>Hover a medallion to highlight its answer</span></div>
          <div class="spec-track-wrap"><div class="spec-track">${T.map(t => `
            <button class="spec-dot t-${t.id}" type="button" data-t="${t.id}" style="left:${t.profile[cur]}%">${medal(t, 34)}</button>`).join('')}
          </div></div>
          <div class="spec-poles" id="spec-poles"></div>
        </div>
        <div class="answer-grid" id="answer-grid"></div>
      </section>
      <section class="section">
        <header class="section-head">
          <div><p class="eyebrow">The full matrix</p><h2 class="h2">All six questions at once</h2></div>
          <div class="matrix-tools" role="group" aria-label="Traditions to show"><span class="muted">Show</span>${T.map(t => `
            <button class="chip chip-dot t-${t.id}" type="button" data-toggle="${t.id}" aria-pressed="true">${t.name}</button>`).join('')}
          </div>
        </header>
        <div class="matrix-wrap"><table class="matrix" id="matrix"></table></div>
      </section>`;

    function mount(root) {
      const head = $('#focus-head', root), poles = $('#spec-poles', root), grid = $('#answer-grid', root), matrix = $('#matrix', root);

      function renderFocus() {
        const q = Q.find(x => x.id === cur);
        head.innerHTML = `<div><span class="focus-greek" lang="grc">${q.greek}<small>${q.translit}</small></span><h2 class="h2">${q.ask}</h2></div><span class="chip">${q.field}</span>`;
        poles.innerHTML = `<span>${q.left}</span><span>${q.right}</span>`;
        $$('.spec-dot', root).forEach(d => {
          const t = byId[d.dataset.t];
          d.style.left = t.profile[q.id] + '%';
          d.setAttribute('aria-label', `${t.name}: ${t.answers[q.id].short}`);
          d.dataset.tip = `<b>${t.name}</b><small>${t.answers[q.id].short}</small>`;
        });
        grid.innerHTML = T.map(t => {
          const a = t.answers[q.id];
          return `<article class="answer-card t-${t.id}" data-t="${t.id}">
            <header>${medal(t, 40)}<div><strong>${t.name}</strong><small>${t.archetype}</small></div></header>
            <h3>${a.short}</h3><p>${a.text}</p><span class="chip chip-tint">${a.term}</span></article>`;
        }).join('');
        $$('.q-tab', root).forEach(b => { const on = b.dataset.q === cur; b.setAttribute('aria-selected', String(on)); b.tabIndex = on ? 0 : -1; });
        $$('#matrix tbody tr', root).forEach(tr => tr.classList.toggle('is-focus', tr.dataset.q === cur));
        store.set('cmpQ', cur);
      }
      function renderMatrix() {
        const cols = T.filter(t => shown.has(t.id));
        matrix.innerHTML = `
          <thead><tr><th scope="col"><span class="sr-only">Question</span></th>${cols.map(t => `<th scope="col" class="t-${t.id}"><span class="th-in">${medal(t, 30)}${t.name}</span></th>`).join('')}</tr></thead>
          <tbody>${Q.map(q => `<tr data-q="${q.id}" class="${q.id === cur ? 'is-focus' : ''}"><th scope="row"><strong>${q.title}</strong><small>${q.field}</small></th>${cols.map(t => `<td><strong>${t.answers[q.id].short}</strong><span>${t.answers[q.id].text}</span></td>`).join('')}</tr>`).join('')}</tbody>`;
      }
      function highlight(id) {
        $$('.answer-card', root).forEach(c => { c.classList.toggle('is-hot', c.dataset.t === id); c.classList.toggle('is-dim', !!id && c.dataset.t !== id); });
      }

      const tabs = $('.q-tabs', root);
      tabs.addEventListener('click', e => { const b = e.target.closest('.q-tab'); if (b) { cur = b.dataset.q; renderFocus(); } });
      tabs.addEventListener('keydown', e => {
        if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
        const i = Q.findIndex(q => q.id === cur);
        cur = Q[(i + (e.key === 'ArrowRight' ? 1 : Q.length - 1)) % Q.length].id;
        renderFocus();
        $(`#tab-${cur}`, root).focus();
        e.preventDefault();
      });
      $$('.spec-dot', root).forEach(d => {
        d.addEventListener('mouseenter', () => highlight(d.dataset.t));
        d.addEventListener('mouseleave', () => highlight(null));
        d.addEventListener('focus', () => highlight(d.dataset.t));
        d.addEventListener('blur', () => highlight(null));
        d.addEventListener('click', () => { const c = $(`.answer-card[data-t="${d.dataset.t}"]`, root); if (c) c.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'nearest' }); });
      });
      $('.matrix-tools', root).addEventListener('click', e => {
        const b = e.target.closest('[data-toggle]');
        if (!b) return;
        const id = b.dataset.toggle;
        if (shown.has(id)) { if (shown.size === 1) { toast('Keep at least one tradition visible'); return; } shown.delete(id); } else shown.add(id);
        b.setAttribute('aria-pressed', String(shown.has(id)));
        renderMatrix();
      });
      matrix.addEventListener('click', e => {
        const tr = e.target.closest('tbody tr');
        if (!tr) return;
        cur = tr.dataset.q;
        renderFocus();
        $('#focus', root).scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
      });
      bindTips(root);
      renderMatrix();
      renderFocus();
    }
    return { title: 'Compare', html, mount };
  }

  /* ---------- Timeline ---------- */
  function riverSVG() {
    const nodes = {
      socrates: { x: 70, y: 90, t: 'socrates', name: 'Socrates', date: 'c. 470–399 BC', big: true },
      plato: { x: 230, y: 90, t: 'plato', name: 'Plato', date: 'c. 428–348 BC', big: true },
      aristotle: { x: 390, y: 90, t: 'aristotle', name: 'Aristotle', date: '384–322 BC', big: true },
      jesus: { x: 470, y: 300, t: 'christianity', name: 'Jesus & the apostles', date: '1st century AD', big: true },
      plotinus: { x: 565, y: 190, t: 'plato', name: 'Plotinus', date: 'AD 204–270', role: 'Neoplatonist', above: true },
      augustine: { x: 690, y: 300, t: 'christianity', name: 'Augustine', date: 'AD 354–430', role: 'Faith + Plato' },
      aquinas: { x: 900, y: 300, t: 'christianity', name: 'Thomas Aquinas', date: 'AD 1225–1274', role: 'Faith + Aristotle' }
    };
    const edges = [
      { from: 'socrates', to: 'plato', d: 'M94 90 H206', label: 'taught', lx: 150, ly: 78 },
      { from: 'plato', to: 'aristotle', d: 'M254 90 H366', label: 'taught', lx: 310, ly: 78 },
      { from: 'plato', to: 'plotinus', d: 'M246 108 C300 205 450 206 552 192' },
      { from: 'plotinus', to: 'augustine', d: 'M574 200 C600 250 640 292 678 298' },
      { from: 'jesus', to: 'augustine', d: 'M494 300 H676' },
      { from: 'augustine', to: 'aquinas', d: 'M704 300 H886' },
      { from: 'aristotle', to: 'aquinas', d: 'M406 72 C560 -12 860 0 900 286', label: 'rediscovered in the Latin West', lx: 690, ly: 56 }
    ];
    const ends = d => { const n = d.match(/-?\d+(\.\d+)?/g).map(Number); return [n[0], n[1], n[n.length - 2], n[n.length - 1]]; };
    const defs = edges.map((e, i) => { const [x1, y1, x2, y2] = ends(e.d); return `<linearGradient id="rg${i}" gradientUnits="userSpaceOnUse" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"><stop offset="0" style="stop-color:var(--${nodes[e.from].t})"/><stop offset="1" style="stop-color:var(--${nodes[e.to].t})"/></linearGradient>`; }).join('');
    const paths = edges.map((e, i) => `<path class="edge" d="${e.d}" style="stroke:url(#rg${i})" marker-end="url(#rv-arrow)"/>`).join('');
    const labels = edges.filter(e => e.label).map(e => `<text class="edge-label" x="${e.lx}" y="${e.ly}" text-anchor="middle">${e.label}</text>`).join('');
    const nodeEls = Object.values(nodes).map(n => {
      const t = byId[n.t];
      if (n.big) {
        return `<g><circle class="node-ring" cx="${n.x}" cy="${n.y}" r="27" style="stroke:var(--${n.t})"/><circle cx="${n.x}" cy="${n.y}" r="21" style="fill:var(--${n.t})"/>
          <text class="node-letter" x="${n.x}" y="${n.y + 6}" text-anchor="middle">${t.letter}</text>
          <text class="node-name" x="${n.x}" y="${n.y + 54}" text-anchor="middle">${n.name}</text>
          <text class="node-date" x="${n.x}" y="${n.y + 72}" text-anchor="middle">${n.date}</text></g>`;
      }
      const ys = n.above ? [n.y - 62, n.y - 45, n.y - 28] : [n.y + 36, n.y + 53, n.y + 69];
      return `<g><circle class="node-core" cx="${n.x}" cy="${n.y}" r="11" style="fill:var(--${n.t})"/>
        <text class="node-name" x="${n.x}" y="${ys[0]}" text-anchor="middle" style="font-size:19px">${n.name}</text>
        <text class="node-date" x="${n.x}" y="${ys[1]}" text-anchor="middle">${n.date}</text>
        <text class="edge-label" x="${n.x}" y="${ys[2]}" text-anchor="middle">${n.role}</text></g>`;
    }).join('');
    return `<svg viewBox="0 0 1000 390" role="img" aria-label="Socrates taught Plato, who taught Aristotle. Plato's ideas pass through Plotinus to Augustine; Aristotle's are rediscovered by Thomas Aquinas; both Augustine and Aquinas build on the faith of Jesus and the apostles.">
      <defs>${defs}<marker id="rv-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10 z" style="fill:var(--text-3)"/></marker></defs>
      ${paths}${labels}${nodeEls}
    </svg>`;
  }

  function Timeline() {
    let filter = 'all';
    const html = `
      <header class="page-head">
        <p class="eyebrow">Timeline · 470 BC to AD 1274</p>
        <h1 class="display">The river of ideas</h1>
        <p class="lead">Socrates taught Plato and Plato taught Aristotle. Centuries later, Christian thinkers carried both into a new vision of the world. Follow the current.</p>
      </header>
      <section class="plate river" aria-label="How ideas passed between thinkers">${riverSVG()}</section>
      <section class="section">
        <header class="section-head">
          <div><p class="eyebrow">${K.timeline.length} moments</p><h2 class="h2">Key events</h2></div>
          <div class="tl-tools" role="group" aria-label="Filter events">${['all', ...T.map(t => t.id)].map(id => `
            <button class="chip${id !== 'all' ? ' chip-dot t-' + id : ''}" type="button" data-f="${id}" aria-pressed="${id === 'all'}">${id === 'all' ? 'All traditions' : byId[id].name}</button>`).join('')}
          </div>
        </header>
        <div class="tl" id="tl"></div>
      </section>`;

    function mount(root) {
      const tl = $('#tl', root);
      function render() {
        const evs = K.timeline.filter(e => filter === 'all' || e.tags.includes(filter));
        tl.innerHTML = K.eras.map(era => {
          const items = evs.filter(e => e.year >= era.from && e.year <= era.to);
          if (!items.length) return '';
          return `<div class="era"><h3>${era.name}</h3><small>${era.span}</small></div>` + items.map(e => {
            const t = byId[e.tags[0]];
            const t2 = e.tags[1] ? byId[e.tags[1]] : null;
            return `<article class="tl-item t-${t.id}">
              <div class="tl-year">${e.label}</div>
              <span class="tl-node${t2 ? ' two' : ''}"${t2 ? ` style="--c2:var(--${t2.id})"` : ''}></span>
              <div class="tl-card"><h4>${e.title}</h4><p>${e.text}</p>
                <div class="chip-row">${e.tags.map(id => `<span class="chip chip-dot t-${id}">${byId[id].name}</span>`).join('')}</div></div>
            </article>`;
          }).join('');
        }).join('');
      }
      $('.tl-tools', root).addEventListener('click', e => {
        const b = e.target.closest('[data-f]');
        if (!b) return;
        filter = b.dataset.f;
        $$('[data-f]', root).forEach(x => x.setAttribute('aria-pressed', String(x.dataset.f === filter)));
        render();
      });
      render();
    }
    return { title: 'Timeline', html, mount };
  }

  /* ---------- The Cave ---------- */
  function caveSVG() {
    const prisoners = [330, 400, 470, 540].map((x, i) => `
      <g class="prisoner${i === 3 ? ' p-one' : ''}" transform="translate(${x} 0)" fill="#0E0A1C">
        <circle cx="-6" cy="796" r="13"/>
        <path d="M-14 812 C-24 830 -22 852 -18 868 L24 868 C26 846 18 822 4 811 Z"/>
        <path d="M-18 868 L-52 868 C-56 858 -50 848 -40 848 L-16 850 Z"/>
        <path d="M4 811 C18 822 26 846 24 868 M2 784 A13 13 0 0 1 7 800" fill="none" stroke="#FF9A55" stroke-opacity=".55" stroke-width="2"/>
      </g>`).join('');
    let stairs = 'M960 868';
    for (let k = 1; k <= 10; k++) stairs += ` H${960 + 28 * k} V${(868 - 46.8 * k).toFixed(1)}`;
    const rays = Array.from({ length: 12 }, (_, k) => {
      const a = (k * 30) * Math.PI / 180;
      return `<line x1="${(1475 + Math.cos(a) * 64).toFixed(1)}" y1="${(115 + Math.sin(a) * 64).toFixed(1)}" x2="${(1475 + Math.cos(a) * 124).toFixed(1)}" y2="${(115 + Math.sin(a) * 124).toFixed(1)}"/>`;
    }).join('');
    const label = (x, y, text, stages) => {
      const w = text.length * 12 + 36;
      return `<g class="cv-label" data-st="${stages}"><rect x="${x - w / 2}" y="${y - 17}" width="${w}" height="34" rx="17"/><text x="${x}" y="${y + 1}" text-anchor="middle" dominant-baseline="middle">${text}</text></g>`;
    };
    return `<svg class="cave-svg" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" role="img" aria-label="Illustration of Plato's cave: prisoners facing a wall of shadows, a fire and puppets behind them, and a steep path up to the sunlit world outside.">
      <defs>
        <linearGradient id="cv-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6FA6DE"/><stop offset=".55" stop-color="#BBD8F0"/><stop offset="1" stop-color="#F6E3B4"/></linearGradient>
        <radialGradient id="cv-sunglow" gradientUnits="userSpaceOnUse" cx="1475" cy="115" r="400"><stop offset="0" stop-color="#FFF8DC"/><stop offset=".22" stop-color="#FFE9A8" stop-opacity=".75"/><stop offset="1" stop-color="#FFE9A8" stop-opacity="0"/></radialGradient>
        <linearGradient id="cv-rock" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2B2541"/><stop offset="1" stop-color="#16122A"/></linearGradient>
        <linearGradient id="cv-cavity" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#110C20"/><stop offset="1" stop-color="#1D1530"/></linearGradient>
        <radialGradient id="cv-fire" gradientUnits="userSpaceOnUse" cx="900" cy="820" r="660"><stop offset="0" stop-color="#FF9F4D" stop-opacity=".62"/><stop offset=".3" stop-color="#D4602F" stop-opacity=".28"/><stop offset="1" stop-color="#000000" stop-opacity="0"/></radialGradient>
        <linearGradient id="cv-wall" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#3A272C" stop-opacity=".9"/><stop offset=".72" stop-color="#8E5E45"/><stop offset="1" stop-color="#8E5E45" stop-opacity="0"/></linearGradient>
        <linearGradient id="cv-shaft" gradientUnits="userSpaceOnUse" x1="1218" y1="366" x2="900" y2="700"><stop offset="0" stop-color="#FFF1C9" stop-opacity=".42"/><stop offset="1" stop-color="#FFF1C9" stop-opacity="0"/></linearGradient>
        <radialGradient id="cv-halo"><stop offset="0" stop-color="#FFF3D1" stop-opacity=".95"/><stop offset=".45" stop-color="#FFE6A8" stop-opacity=".35"/><stop offset="1" stop-color="#FFE6A8" stop-opacity="0"/></radialGradient>
        <filter id="cv-soft" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="22"/></filter>
        <filter id="cv-blur" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="2.6"/></filter>
        <clipPath id="cv-clip"><path d="M20 868 L20 450 C40 360 170 300 400 278 C640 256 900 262 1060 306 C1130 322 1170 326 1196 332 L1240 400 L960 868 Z"/></clipPath>
        <path id="cv-amphora" d="M-10 0 C-22 -20 -20 -44 -8 -54 L-6 -64 L6 -64 L8 -54 C20 -44 22 -20 10 0 Z"/>
        <path id="cv-horse" d="M-36 -26 C-31 -38 -6 -40 12 -36 L20 -52 L30 -54 L32 -44 L24 -26 L22 0 L16 0 L14 -20 L-20 -18 L-24 0 L-30 0 Z"/>
        <g id="cv-tree"><rect x="-3" y="-34" width="6" height="34"/><circle cx="0" cy="-46" r="17"/></g>
        <g id="cv-person"><circle cx="0" cy="-58" r="9"/><path d="M-7 -48 L7 -48 L10 -22 L5 -22 L5 0 L1 0 L1 -20 L-1 -20 L-1 0 L-5 0 L-5 -22 L-10 -22 Z"/></g>
      </defs>
      <g class="cam" id="cam">
        <rect width="1600" height="900" fill="url(#cv-sky)"/>
        <circle cx="1475" cy="115" r="400" fill="url(#cv-sunglow)"/>
        <g class="rays" stroke="#FFF4C8" stroke-opacity=".6" stroke-width="3" stroke-linecap="round">${rays}</g>
        <circle cx="1475" cy="115" r="46" fill="#FFF5CF"/>
        <g class="birds" fill="none" stroke="#3B4B60" stroke-width="2.5" stroke-linecap="round"><path d="M1290 175 q8 -8 16 0 q8 -8 16 0"/><path d="M1345 150 q6 -6 12 0 q6 -6 12 0"/></g>
        <path d="M1150 340 C1250 290 1330 310 1400 296 C1470 282 1540 310 1600 300 V410 H1150 Z" fill="#9DBFA6"/>
        <path d="M1180 374 C1300 350 1420 372 1600 356 V410 H1180 Z" fill="#7FAE84"/>
        <rect x="1326" y="350" width="8" height="50" fill="#5A4330"/>
        <circle cx="1330" cy="338" r="28" fill="#4E8A5A"/><circle cx="1311" cy="352" r="18" fill="#5F9C68"/><circle cx="1350" cy="354" r="19" fill="#457E50"/>
        <ellipse cx="1470" cy="394" rx="72" ry="9" fill="#A9D3EE"/>
        <ellipse cx="1470" cy="394" rx="16" ry="3" fill="#FFF6D6"/>

        <path d="M0 0 H1130 L1170 150 L1196 332 L1240 400 H1600 V900 H0 Z" fill="url(#cv-rock)"/>
        <g fill="none" stroke="#FFFFFF" stroke-opacity=".05" stroke-width="2"><path d="M0 120 C300 96 640 144 1110 104"/><path d="M0 210 C220 190 520 232 840 206"/><path d="M1240 470 C1380 452 1480 490 1600 470"/><path d="M1100 720 C1300 700 1420 740 1600 716"/></g>
        <path d="M1130 0 L1170 150 L1196 332" fill="none" stroke="#FFE6BE" stroke-opacity=".28" stroke-width="3"/>
        <path d="M1240 400 H1600" stroke="#6E9F6E" stroke-width="6"/>

        <path d="M20 868 L20 450 C40 360 170 300 400 278 C640 256 900 262 1060 306 C1130 322 1170 326 1196 332 L1240 400 L960 868 Z" fill="url(#cv-cavity)"/>
        <g clip-path="url(#cv-clip)">
          <circle class="fireglow" cx="900" cy="820" r="660" fill="url(#cv-fire)"/>
          <path d="M1196 332 L1240 400 L1010 790 L850 610 Z" fill="url(#cv-shaft)" filter="url(#cv-soft)"/>
          <path d="M20 450 C40 410 110 380 200 372 C262 366 300 384 308 430 C320 540 300 700 318 868 L20 868 Z" fill="url(#cv-wall)"/>
          <g class="shadows" fill="#22131A" opacity=".85" filter="url(#cv-blur)">
            <use href="#cv-amphora" transform="translate(78 712) scale(1.9)"/>
            <use href="#cv-horse" transform="translate(178 704) scale(1.6)"/>
            <use href="#cv-tree" transform="translate(252 712) scale(1.5)"/>
          </g>
        </g>
        <path d="${stairs}" fill="none" stroke="#FFC896" stroke-opacity=".35" stroke-width="2"/>
        <path d="M960 868 L1240 400" fill="none" stroke="#FFC896" stroke-opacity=".18" stroke-width="2"/>

        <g class="puppets">
          <g stroke="#5B4636" stroke-width="3"><line x1="672" y1="766" x2="672" y2="800"/><line x1="735" y1="768" x2="735" y2="800"/><line x1="790" y1="768" x2="790" y2="800"/></g>
          <circle cx="702" cy="778" r="10" fill="#0E0A1C"/><circle cx="764" cy="780" r="10" fill="#0E0A1C"/>
          <use href="#cv-amphora" fill="#B5562F" transform="translate(672 766)"/>
          <use href="#cv-horse" fill="#C9A27A" transform="translate(735 768) scale(.9)"/>
          <use href="#cv-tree" fill="#6D8F5A" transform="translate(790 768) scale(.9)"/>
        </g>
        <rect x="640" y="790" width="170" height="80" fill="#3B2B3F"/>
        <rect x="634" y="782" width="182" height="12" rx="3" fill="#4D3A50"/>
        <g stroke="#2A1E2E" stroke-width="2"><path d="M640 822 H810 M700 794 V822 M760 822 V868 M680 845 H740"/></g>

        <g transform="translate(900 864)">
          <rect x="-34" y="-8" width="68" height="10" rx="5" fill="#3A2418" transform="rotate(-10)"/>
          <rect x="-34" y="-8" width="68" height="10" rx="5" fill="#4A2E1E" transform="rotate(12)"/>
        </g>
        <path class="flame f1" d="M880 862 C866 836 884 812 892 786 C900 806 916 816 920 838 C924 852 914 862 900 864 Z" fill="#F2793A"/>
        <path class="flame f2" d="M888 862 C880 846 890 826 898 810 C904 826 914 838 912 852 C910 860 902 864 896 864 Z" fill="#FFB347"/>
        <path class="flame f3" d="M894 862 C890 852 896 840 900 832 C904 842 908 852 905 860 Z" fill="#FFE7A1"/>

        <circle class="p-halo" cx="535" cy="826" r="58" fill="url(#cv-halo)"/>
        ${prisoners}
        <path d="M282 864 H566" stroke="#7A6656" stroke-width="3" stroke-dasharray="7 4"/>

        <g class="seeker" id="seeker" style="transform: translate(835px, 868px); opacity: 0">
          <circle cx="0" cy="-34" r="48" fill="url(#cv-halo)"/>
          <use href="#cv-person" fill="#FFF1CF"/>
        </g>

        ${label(152, 470, 'The wall of shadows', '0 4')}
        ${label(435, 742, 'The prisoners', '0 4')}
        ${label(725, 652, 'Puppets behind a low wall', '1 4')}
        ${label(900, 748, 'The fire', '1 4')}
        ${label(1030, 588, 'The steep ascent', '2 4')}
        ${label(1440, 205, 'The sun · the Good', '3 4')}
        ${label(1405, 436, 'Reflections in the water', '3')}
      </g>
    </svg>`;
  }

  function Cave() {
    const S = K.cave;
    let stage = 0, overview = false;
    const CAM = [[330, 700, 1.8], [760, 760, 1.7], [1080, 600, 1.45], [1400, 230, 1.85], [800, 450, 1]];
    const SEEKER = [[835, 868], [835, 868], [1110, 617], [1400, 398], [600, 868]];
    const DARK = [0.95, 0.75, 0.45, 0, 0.5];
    const RUNG = [0, 1, 2, 3, 3];
    const rungs = [
      { name: 'Noēsis', greek: 'νόησις', what: 'Understanding the Forms themselves' },
      { name: 'Dianoia', greek: 'διάνοια', what: 'Reasoning, as in mathematics' },
      { name: 'Pistis', greek: 'πίστις', what: 'Belief about physical things' },
      { name: 'Eikasia', greek: 'εἰκασία', what: 'Imagining: shadows and reflections' }
    ];

    const html = `
      <header class="page-head">
        <p class="eyebrow">Plato · Republic, Book VII</p>
        <h1 class="display">The Allegory of the Cave</h1>
        <p class="lead">Plato's most famous image of what it means to learn. Follow one prisoner from the shadows to the sun, and back again. Use the buttons below or the arrow keys.</p>
      </header>
      <section class="cave-stage">
        <div class="cave-view">${caveSVG()}<div class="cave-dark" id="cave-dark"></div></div>
        <div class="cave-bar">
          <div class="stage-dots" role="group" aria-label="Stages of the allegory">${S.map((s, i) => `
            <button class="stage-dot" type="button" data-s="${i}"><b>${ROMAN[i]}</b><span>${s.title}</span></button>`).join('')}
          </div>
          <button class="btn btn-ghost btn-sm" id="cave-overview" type="button" aria-pressed="false">${icon('expand')} Whole cave</button>
        </div>
      </section>
      <div class="cave-info">
        <article class="panel stage-text" id="stage-text" aria-live="polite"></article>
        <aside class="panel ladder">
          <p class="eyebrow">The divided line</p>
          <h3>Four levels of knowing</h3>
          <p>In the Republic, Plato splits knowledge into four levels. The prisoner climbs through all of them.</p>
          <div class="light-meter"><div class="lm-top"><span>Light reaching the eyes</span><span id="lm-val"></span></div><div class="lm-track"><div class="lm-fill" id="lm-fill"></div></div></div>
          <div class="rungs">
            <div class="realm"><span>Intelligible world</span><span>Knowledge · epistēmē</span></div>
            ${rungs.slice(0, 2).map((r, i) => `<div class="rung" data-r="${3 - i}"><strong>${r.name}</strong><span class="greek" lang="grc">${r.greek}</span><small>${r.what}</small></div>`).join('')}
            <div class="realm"><span>Visible world</span><span>Opinion · doxa</span></div>
            ${rungs.slice(2).map((r, i) => `<div class="rung" data-r="${1 - i}"><strong>${r.name}</strong><span class="greek" lang="grc">${r.greek}</span><small>${r.what}</small></div>`).join('')}
          </div>
        </aside>
      </div>
      <section class="section">
        <header class="section-head"><div><p class="eyebrow">Four readings</p><h2 class="h2">How each tradition reads the cave</h2></div></header>
        <div class="readings">${K.caveReadings.map(r => { const t = byId[r.by]; return `<article class="reading t-${t.id}"><header>${medal(t, 32)}${t.name}</header><p>${r.text}</p></article>`; }).join('')}</div>
      </section>`;

    function mount(root) {
      const cam = $('#cam', root), seeker = $('#seeker', root), dark = $('#cave-dark', root), text = $('#stage-text', root);
      const svg = $('.cave-svg', root);

      function fitLabels() {
        $$('.cv-label', svg).forEach(g => {
          const tx = $('text', g), rc = $('rect', g);
          try { const b = tx.getBBox(); if (b.width) { rc.setAttribute('x', b.x - 18); rc.setAttribute('width', b.width + 36); } } catch (e) { }
        });
      }
      function setCam(cx, cy, s) {
        const tx = clamp(800 - cx * s, 1600 - 1600 * s, 0);
        const ty = clamp(450 - cy * s, 900 - 900 * s, 0);
        cam.style.transform = `translate(${tx}px, ${ty}px) scale(${s})`;
      }
      function render() {
        const s = S[stage];
        const view = overview ? [800, 450, 1] : CAM[stage];
        setCam(view[0], view[1], view[2]);
        const [sx, sy] = SEEKER[stage];
        seeker.style.transform = `translate(${sx}px, ${sy}px)`;
        seeker.style.opacity = stage === 0 ? '0' : '1';
        $('.p-one', svg).style.opacity = stage === 0 ? '1' : '0';
        $('.p-halo', svg).style.opacity = stage === 0 ? '1' : '0';
        dark.style.opacity = overview ? '0' : String(DARK[stage]);
        $$('.cv-label', svg).forEach(g => {
          const st = g.dataset.st.split(' ').map(Number);
          g.classList.toggle('on', overview ? st.includes(4) : st.includes(stage));
        });
        $$('.stage-dot', root).forEach((b, i) => {
          if (i === stage) b.setAttribute('aria-current', 'step'); else b.removeAttribute('aria-current');
          b.classList.toggle('done', i < stage);
        });
        $('#cave-overview', root).setAttribute('aria-pressed', String(overview));
        text.innerHTML = `
          <p class="eyebrow">Stage ${ROMAN[stage]} of V · ${s.level} <span class="greek" lang="grc" style="letter-spacing:0;text-transform:none;font-size:15px">${s.greek}</span></p>
          <h2>${s.title}</h2>
          <p>${s.text}</p>
          <div class="stage-meaning">${icon('light')}<p>${s.meaning}</p></div>
          <div class="stage-nav">
            <button class="btn btn-ghost btn-sm" type="button" data-go="-1" ${stage === 0 ? 'disabled' : ''}>${icon('back')} Back</button>
            <button class="btn btn-primary btn-sm" type="button" data-go="1">${stage === S.length - 1 ? `${icon('refresh')} Start again` : `Next stage ${icon('arrow', 'ic-arrow')}`}</button>
          </div>`;
        $('#lm-val', root).textContent = s.light + '%';
        $('#lm-fill', root).style.width = s.light + '%';
        $$('.rung', root).forEach(r => r.classList.toggle('on', Number(r.dataset.r) === RUNG[stage]));
      }
      function go(d) { overview = false; stage = (stage + d + S.length) % S.length; render(); }

      root.addEventListener('click', e => {
        const dot = e.target.closest('.stage-dot');
        if (dot) { overview = false; stage = Number(dot.dataset.s); render(); return; }
        const g = e.target.closest('[data-go]');
        if (g) { go(Number(g.dataset.go)); return; }
        if (e.target.closest('#cave-overview')) { overview = !overview; render(); }
      });
      keyHandler = e => {
        if (e.key === 'ArrowRight') { go(1); e.preventDefault(); }
        if (e.key === 'ArrowLeft' && stage > 0) { go(-1); e.preventDefault(); }
      };
      fitLabels();
      if (document.fonts && document.fonts.ready) document.fonts.ready.then(fitLabels);
      render();
    }
    return { title: 'The Cave', html, mount };
  }

  /* ---------- Agora: a scripted Socratic dialogue ---------- */
  function Agora() {
    const A = K.agora;
    const soc = byId.socrates;
    const html = `
      <header class="page-head">
        <p class="eyebrow">The agora · A Socratic dialogue</p>
        <h1 class="display">Talk with Socrates</h1>
        <p class="lead">Socrates claimed to know nothing, yet almost nobody could win an argument against him. Answer his questions and watch the Socratic method at work.</p>
      </header>
      <div class="agora">
        <section class="panel chat" aria-label="Dialogue with Socrates">
          <header class="chat-head">${medal(soc, 44)}
            <div><strong>Socrates</strong><small>In the agora of Athens</small></div>
            <button class="btn btn-ghost btn-sm" id="chat-restart" type="button">${icon('refresh')} Start over</button>
          </header>
          <div class="chat-log" id="chat-log" aria-live="polite"></div>
          <div class="chat-options" id="chat-options"></div>
        </section>
        <aside class="sky-col" style="position:static">
          <div class="panel method">
            <p class="eyebrow">What is happening</p>
            <h3>The Socratic method</h3>
            <p>Socrates never lectures. He asks, tests and refutes, until a false certainty gives way to honest puzzlement.</p>
            <ol class="steps" id="steps">${A.method.map((m, i) => `<li class="step" data-step="${i}"><strong>${m.name}</strong><span>${m.text}</span></li>`).join('')}</ol>
          </div>
          <div class="end-card" id="end-card" hidden>
            <strong>You reached aporia</strong>
            <p>That puzzled feeling is the goal. In Plato's dialogues Socrates leaves people here on purpose: only now can they start looking for the truth themselves.</p>
            <a class="link-arrow" href="#socrates">Read Plate I: Socrates ${icon('arrow')}</a>
          </div>
        </aside>
      </div>`;

    function mount(root) {
      const log = $('#chat-log', root), opts = $('#chat-options', root);
      let timers = [], current = null;
      const later = (fn, ms) => timers.push(setTimeout(fn, ms));
      cleanups.push(() => timers.forEach(clearTimeout));

      function scroll() { log.scrollTop = log.scrollHeight; }
      function addMsg(who, txt, cont) {
        const el = document.createElement('div');
        el.className = `msg ${who === 'you' ? 'you' : 'socrates'}${cont ? ' cont' : ''}`;
        el.innerHTML = who === 'you' ? `<div class="bubble">${esc(txt)}</div>` : `${medal(soc, 32)}<div class="bubble">${esc(txt)}</div>`;
        log.appendChild(el);
        scroll();
      }
      function typing(on, cont) {
        const old = $('.typing', log);
        if (old) old.remove();
        if (!on) return;
        const el = document.createElement('div');
        el.className = `msg socrates typing${cont ? ' cont' : ''}`;
        el.innerHTML = `${medal(soc, 32)}<div class="bubble" aria-label="Socrates is typing"><i></i><i></i><i></i></div>`;
        log.appendChild(el);
        scroll();
      }
      function setStep(n, end) {
        $$('.step', root).forEach((s, i) => { s.classList.toggle('on', i === n); s.classList.toggle('done', i < n || (end && i <= n)); });
      }
      function play(id) {
        current = A.nodes[id];
        setStep(current.step, current.end);
        opts.innerHTML = '<span class="hint">Socrates is thinking…</span>';
        let t = 150;
        current.say.forEach((line, i) => {
          later(() => typing(true, i > 0), t);
          t += reduceMotion ? 60 : Math.min(1500, 450 + line.length * 9);
          later(() => { typing(false); addMsg('socrates', line, i > 0); }, t);
          t += reduceMotion ? 20 : 260;
        });
        later(showOptions, t);
      }
      function showOptions() {
        if (current.end) {
          $('#end-card', root).hidden = false;
          opts.innerHTML = `<button class="btn btn-primary btn-sm" type="button" id="again" style="width:fit-content">${icon('refresh')} Talk again</button>`;
          return;
        }
        opts.innerHTML = `<span class="hint">Your answer</span>` + current.options.map((o, i) => `<button class="opt" type="button" data-i="${i}"><span>${esc(o.t)}</span><kbd>${i + 1}</kbd></button>`).join('');
      }
      function choose(i) {
        if (!current || current.end || !current.options[i] || !$('.opt', opts)) return;
        const o = current.options[i];
        opts.innerHTML = '';
        addMsg('you', o.t);
        play(o.next);
      }
      function restart() {
        timers.forEach(clearTimeout); timers = [];
        log.innerHTML = '';
        $('#end-card', root).hidden = true;
        play(A.start);
      }
      opts.addEventListener('click', e => {
        const b = e.target.closest('.opt');
        if (b) choose(Number(b.dataset.i));
        if (e.target.closest('#again')) restart();
      });
      $('#chat-restart', root).addEventListener('click', restart);
      keyHandler = e => { const n = Number(e.key); if (n >= 1 && n <= 3) choose(n - 1); };
      play(A.start);
    }
    return { title: 'Agora', html, mount };
  }

  /* ---------- Quiz ---------- */
  function scoreQuiz(answers) {
    const scores = Object.fromEntries(T.map(t => [t.id, 0]));
    answers.forEach(k => { scores[k] += 1; });
    const last = answers[answers.length - 1];
    const ranked = T.slice().sort((a, b) => (scores[b.id] - scores[a.id]) || ((b.id === last) - (a.id === last)) || (T.indexOf(a) - T.indexOf(b)));
    return { scores, top: ranked[0].id, ranked: ranked.map(t => t.id), date: new Date().toISOString() };
  }

  function Quiz() {
    const html = `<div class="quiz-wrap" id="quiz-root"></div>`;
    function mount(root) {
      const box = $('#quiz-root', root);
      let idx = 0, answers = [], locked = false;

      function intro() {
        keyHandler = null;
        box.innerHTML = `
          <header class="page-head">
            <p class="eyebrow">Worldview quiz · ${K.quiz.length} questions</p>
            <h1 class="display">Which worldview is closest to yours?</h1>
          </header>
          <section class="plate quiz-intro">
            <div class="copy">
              <p class="lead">There are no right answers. Pick the option that feels most true to you, not the one you think a philosopher would choose. At the end you will see which tradition your answers lean toward, and by how much.</p>
              <div class="quiz-meta"><span class="chip">${K.quiz.length} questions</span><span class="chip">About 3 minutes</span><span class="chip">Saved only on this device</span></div>
              <div class="btn-row"><button class="btn btn-primary" type="button" id="quiz-start">Begin ${icon('arrow', 'ic-arrow')}</button></div>
            </div>
            <div class="medal-stack" aria-hidden="true">${T.map(t => medal(t, 68)).join('')}</div>
          </section>
          <section class="section">
            <header class="section-head"><div><p class="eyebrow">Four possible results</p><h2 class="h2">Which one will you be?</h2></div></header>
            <div class="arch-preview">${T.map(t => `<article class="arch-card t-${t.id}">${medal(t, 40)}<small>${t.name}</small><strong>${t.archetype}</strong><span>${t.tagline}</span></article>`).join('')}</div>
          </section>`;
        $('#quiz-start', box).addEventListener('click', () => { idx = 0; answers = []; question(); });
      }

      function question() {
        const q = K.quiz[idx];
        const big = q.options.every(o => !o.t.includes(' '));
        locked = false;
        box.innerHTML = `
          <div class="progress">
            <div class="progress-top"><span>Question ${idx + 1} of ${K.quiz.length}</span>
              <button class="btn btn-ghost btn-sm" type="button" id="quiz-back" ${idx === 0 ? 'disabled' : ''}>${icon('back')} Back</button></div>
            <div class="progress-track" aria-hidden="true">${K.quiz.map((_, i) => `<i class="${i < idx ? 'done' : i === idx ? 'now' : ''}"></i>`).join('')}</div>
          </div>
          <section class="plate quiz-q swap" aria-labelledby="quiz-q-title">
            <h2 id="quiz-q-title">${q.q}</h2>
            <div class="quiz-opts">${q.options.map((o, i) => `
              <button class="quiz-opt${big ? ' big' : ''}${answers[idx] === o.k ? ' picked' : ''}" type="button" data-i="${i}"><span class="letter">${'ABCD'[i]}</span><span>${o.t}</span></button>`).join('')}
            </div>
            <div class="quiz-foot"><span class="muted">Tip: press 1 to 4 to answer</span></div>
          </section>`;
        $('#quiz-back', box).addEventListener('click', () => { if (idx > 0) { idx--; question(); } });
        $$('.quiz-opt', box).forEach(b => b.addEventListener('click', () => pick(Number(b.dataset.i))));
        keyHandler = e => { const n = Number(e.key); if (n >= 1 && n <= 4) pick(n - 1); };
      }

      function pick(i) {
        if (locked) return;
        locked = true;
        const q = K.quiz[idx];
        answers[idx] = q.options[i].k;
        answers.length = idx + 1;
        $$('.quiz-opt', box).forEach((b, j) => b.classList.toggle('picked', j === i));
        setTimeout(() => {
          if (idx < K.quiz.length - 1) { idx++; question(); }
          else {
            const res = scoreQuiz(answers);
            store.set('quiz', res);
            updateSideYou();
            result(res, true);
          }
        }, reduceMotion ? 60 : 320);
      }

      function result(res, fresh) {
        keyHandler = null;
        const t = byId[res.top];
        const total = K.quiz.length;
        const ranked = (res.ranked || T.map(x => x.id)).map(id => byId[id]);
        const second = ranked[1];
        const pct = id => Math.round(((res.scores[id] || 0) / total) * 100);
        box.innerHTML = `
          <section class="plate result-hero t-${t.id}">
            ${medal(t, 150)}
            <div class="copy">
              <p class="eyebrow">${fresh ? 'Your result' : 'Your last result'}</p>
              <h1 class="display">${t.archetype}</h1>
              <p class="arch-line">Your answers lean most toward <strong>${t.name}</strong>: ${res.scores[t.id]} of ${total} choices.</p>
              <p class="lead">${t.result.text}</p>
              <div class="btn-row">
                <a class="btn btn-primary" href="#constellation">Build my constellation ${icon('arrow', 'ic-arrow')}</a>
                <a class="btn btn-ghost" href="#${t.id}">Read Plate ${t.plate}</a>
              </div>
            </div>
          </section>
          <div class="result-grid">
            <article class="panel result-box">
              <p class="eyebrow">Your mix</p>
              <h3>How your ${total} answers split</h3>
              <div class="bars">${ranked.map(x => barHTML(x, pct(x.id), `<b>${x.name}</b><small>${res.scores[x.id] || 0} of ${total} answers · ${pct(x.id)}%</small>`)).join('')}</div>
              <p class="muted" style="font-size:14.5px">Most people are a blend. Your second strongest influence is ${second.name}, ${second.archetype.toLowerCase()}.</p>
            </article>
            <article class="panel result-box t-${t.id}">
              <p class="eyebrow">Strengths</p>
              <h3>What this lens gives you</h3>
              <div class="strengths">${t.result.strengths.map(s => `<span class="chip chip-tint">${s}</span>`).join('')}</div>
              <div class="watch">${icon('info')}<p><strong>Watch out:</strong> ${t.result.watch}</p></div>
              <div class="btn-row"><button class="btn btn-ghost btn-sm" type="button" id="quiz-retake">${icon('refresh')} Retake the quiz</button></div>
            </article>
          </div>`;
        $('#quiz-retake', box).addEventListener('click', () => { idx = 0; answers = []; question(); });
        growBars(box);
        if (fresh) toast('Result saved. You can build your constellation from it');
      }

      bindTips(box);
      const saved = store.get('quiz', null);
      if (saved && byId[saved.top]) result(saved, false); else intro();
    }
    return { title: 'Quiz', html, mount };
  }

  /* ---------- My constellation ---------- */
  const EXAMPLE = { reality: 70, knowledge: 45, human: 65, good: 60, divine: 55, destiny: 65 };

  function radarSVG(values, cmpT) {
    const cx = 240, cy = 226, R = 146, LR = 166;
    const ang = i => (-90 + i * 60) * Math.PI / 180;
    const pt = (i, v) => [cx + Math.cos(ang(i)) * R * v / 100, cy + Math.sin(ang(i)) * R * v / 100];
    const poly = vals => Q.map((q, i) => pt(i, vals[q.id]).map(n => n.toFixed(1)).join(',')).join(' ');
    const rings = [25, 50, 75, 100].map(v => `<polygon class="grid${v === 100 ? ' outer' : ''}" points="${Q.map((q, i) => pt(i, v).map(n => n.toFixed(1)).join(',')).join(' ')}"/>`).join('');
    const spokes = Q.map((q, i) => { const [x, y] = pt(i, 100); return `<line class="spoke" x1="${cx}" y1="${cy}" x2="${x.toFixed(1)}" y2="${y.toFixed(1)}"/>`; }).join('');
    const labels = Q.map((q, i) => {
      const c = Math.cos(ang(i)), s = Math.sin(ang(i));
      const x = cx + c * LR, y = cy + s * LR;
      const anchor = Math.abs(c) < 0.1 ? 'middle' : c > 0 ? 'start' : 'end';
      const ty = s < -0.9 ? y - 22 : s > 0.9 ? y + 12 : y - 2;
      return `<text class="axis-label" x="${x.toFixed(1)}" y="${ty.toFixed(1)}" text-anchor="${anchor}">${q.title}</text><text class="axis-sub" x="${x.toFixed(1)}" y="${(ty + 17).toFixed(1)}" text-anchor="${anchor}" lang="grc">${q.greek}</text>`;
    }).join('');
    const cmp = cmpT ? `<polygon class="cmp-shape t-${cmpT.id}" points="${poly(cmpT.profile)}"/>` : '';
    const starEls = Q.map((q, i) => {
      const [x, y] = pt(i, values[q.id]);
      return `<circle class="star-glow" cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="11"/><circle class="star" cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="5.5"/>
        <circle class="hit" cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="18" data-tip="${esc(`<b>${q.title} · ${values[q.id]}</b><small>Your position ${lean(q, values[q.id])}${cmpT ? `. ${cmpT.name}: ${cmpT.profile[q.id]}` : ''}</small>`)}"/>`;
    }).join('');
    return `${rings}${spokes}${labels}${cmp}<polygon class="you-shape" points="${poly(values)}"/>${starEls}`;
  }

  function Constellation() {
    const saved = store.get('worldview', null);
    const quiz = store.get('quiz', null);
    let values = saved && saved.values ? Object.assign({}, EXAMPLE, saved.values) : quiz ? blendFromScores(quiz.scores) : Object.assign({}, EXAMPLE);
    let isExample = !saved && !quiz;
    let cmp = store.get('cmp', 'plato');

    const html = `
      <header class="page-head">
        <p class="eyebrow">My constellation · Your worldview map</p>
        <h1 class="display">Draw your own sky</h1>
        <p class="lead">Place yourself on each of the six questions. Your positions become a constellation, and you can lay any tradition over it to see where you agree and where you part ways.</p>
      </header>
      <div class="builder">
        <section class="panel sliders" aria-label="Your positions">
          <div class="sliders-head"><h2>Your positions</h2>
            <span class="badge-example" id="ex-badge"${isExample ? '' : ' hidden'}>Example values · move a slider to make them yours</span>
            <span class="badge-example" id="quiz-badge"${!saved && quiz ? '' : ' hidden'}>Started from your quiz result</span>
          </div>
          ${Q.map(q => `
          <div class="slider-row">
            <div class="slider-top"><label for="sl-${q.id}">${q.title}<span class="greek" lang="grc">${q.greek}</span></label><output id="out-${q.id}" for="sl-${q.id}">${values[q.id]}</output></div>
            <div class="range-wrap">
              <div class="range-marks" aria-hidden="true">${T.map(t => `<span class="range-mark t-${t.id}" style="left:${t.profile[q.id]}%" title="${t.name}">${t.letter}</span>`).join('')}</div>
              <input class="range" type="range" id="sl-${q.id}" data-q="${q.id}" min="0" max="100" step="1" value="${values[q.id]}" aria-describedby="poles-${q.id}">
            </div>
            <div class="poles" id="poles-${q.id}"><span>${q.left}</span><span>${q.right}</span></div>
          </div>`).join('')}
          <div class="btn-row" style="padding-top:14px">
            ${quiz ? `<button class="btn btn-ghost btn-sm" type="button" id="from-quiz">${icon('quiz')} Use my quiz result</button>` : ''}
            <button class="btn btn-ghost btn-sm" type="button" id="reset-vals">${icon('refresh')} Reset to the middle</button>
          </div>
        </section>
        <div class="sky-col">
          <section class="panel radar-card">
            <div class="radar-head"><h2>Your constellation</h2><div class="legend" id="legend"></div></div>
            <svg class="radar" id="radar" viewBox="0 0 480 450" role="img" aria-label="Radar chart of your six positions"></svg>
            <div class="radar-note"><span>Centre: this world</span><span>Edge: beyond this world</span></div>
            <div class="cmp-chips" role="group" aria-label="Lay a tradition over your constellation">${T.map(t => `
              <button class="chip chip-dot t-${t.id}" type="button" data-cmp="${t.id}" aria-pressed="${cmp === t.id}">${t.name}</button>`).join('')}
              <button class="chip" type="button" data-cmp="none" aria-pressed="${cmp === 'none'}">No overlay</button>
            </div>
            <details class="values-table"><summary>Show as a table</summary><table class="vt" id="vt"></table></details>
          </section>
          <section class="panel sim" id="sim"></section>
        </div>
      </div>
      <div class="lower">
        <section class="panel credo">
          <p class="eyebrow">My credo</p>
          <h2>My worldview in one sentence</h2>
          <label class="sr-only" for="credo-text">My worldview in one sentence</label>
          <textarea class="field" id="credo-text" placeholder="I believe the world is…"></textarea>
          <small id="credo-status">Saved automatically on this device.</small>
        </section>
        <section class="panel journal">
          <p class="eyebrow">Journal</p>
          <h2>My reflections</h2>
          <div class="entries" id="entries"></div>
        </section>
      </div>`;

    function mount(root) {
      const radar = $('#radar', root), sim = $('#sim', root), legend = $('#legend', root), vt = $('#vt', root);

      function renderSky() {
        const cmpT = cmp !== 'none' ? byId[cmp] : null;
        radar.innerHTML = radarSVG(values, cmpT);
        legend.innerHTML = `<span><i></i>You</span>${cmpT ? `<span class="t-${cmpT.id}"><i class="dash"></i>${cmpT.name}</span>` : ''}`;
        vt.innerHTML = `<thead><tr><th>Question</th><th>You</th>${cmpT ? `<th>${cmpT.name}</th>` : ''}</tr></thead><tbody>${Q.map(q => `<tr><td>${q.title}</td><td>${values[q.id]}</td>${cmpT ? `<td>${cmpT.profile[q.id]}</td>` : ''}</tr>`).join('')}</tbody>`;
        const sims = T.map(t => ({ t, s: similarity(values, t.profile) })).sort((a, b) => b.s - a.s);
        const top = sims[0].t;
        sim.innerHTML = `
          <p class="eyebrow">Closest tradition</p>
          <div class="sim-top t-${top.id}">${medal(top, 56)}<div><strong>${top.name} · ${sims[0].s}%</strong><span>${top.archetype}. ${top.tagline}</span></div></div>
          <div class="bars">${sims.map(x => barHTML(x.t, x.s, `<b>${x.t.name}</b><small>${x.s}% similar to your six positions</small>`)).join('')}</div>
          <p class="muted" style="font-size:13.5px">Similarity compares your six positions with each tradition's typical ones. It is a conversation starter, not a verdict.</p>`;
        $$('.bar-fill', sim).forEach(b => { b.style.transition = 'none'; b.style.width = b.dataset.w + '%'; });
      }
      function persist() {
        store.set('worldview', { values });
        $('#ex-badge', root).hidden = true;
        $('#quiz-badge', root).hidden = true;
        isExample = false;
      }
      function setAll(v) {
        values = Object.assign({}, v);
        Q.forEach(q => { $(`#sl-${q.id}`, root).value = values[q.id]; $(`#out-${q.id}`, root).textContent = values[q.id]; });
        persist();
        renderSky();
      }

      $$('.range', root).forEach(r => r.addEventListener('input', () => {
        values[r.dataset.q] = Number(r.value);
        $(`#out-${r.dataset.q}`, root).textContent = r.value;
        persist();
        renderSky();
      }));
      $('#reset-vals', root).addEventListener('click', () => setAll(Object.fromEntries(Q.map(q => [q.id, 50]))));
      const fq = $('#from-quiz', root);
      if (fq) fq.addEventListener('click', () => { setAll(blendFromScores(quiz.scores)); toast('Sliders set from your quiz answers'); });
      $('.cmp-chips', root).addEventListener('click', e => {
        const b = e.target.closest('[data-cmp]');
        if (!b) return;
        cmp = b.dataset.cmp;
        store.set('cmp', cmp);
        $$('[data-cmp]', root).forEach(x => x.setAttribute('aria-pressed', String(x.dataset.cmp === cmp)));
        renderSky();
      });

      const credo = $('#credo-text', root), credoStatus = $('#credo-status', root);
      credo.value = store.get('credo', '');
      const saveCredo = debounce(() => { store.set('credo', credo.value); credoStatus.textContent = 'Saved.'; }, 450);
      credo.addEventListener('input', () => { credoStatus.textContent = 'Saving…'; saveCredo(); });

      const entries = $('#entries', root);
      function renderJournal() {
        const j = store.get('journal', []);
        if (!j.length) {
          entries.innerHTML = `<div class="empty"><span>No reflections yet. Answer the Question of the day on the Home page and it will appear here.</span><a class="btn btn-ghost btn-sm" href="#home">Go to today's question ${icon('arrow', 'ic-arrow')}</a></div>`;
          return;
        }
        entries.innerHTML = j.map(e => {
          const t = byId[e.by] || T[0];
          const d = new Date(e.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
          return `<article class="entry t-${t.id}">
            <div class="entry-top"><span class="chip chip-dot" style="padding:2px 9px;font-size:12px">${t.name}</span><span>${d}</span>
              <button class="entry-del" type="button" data-del="${e.id}" aria-label="Delete this reflection">${icon('trash')}</button></div>
            <p class="entry-q">${esc(e.q)}</p><p class="entry-a">${esc(e.a)}</p></article>`;
        }).join('');
      }
      entries.addEventListener('click', e => {
        const b = e.target.closest('[data-del]');
        if (!b) return;
        store.set('journal', store.get('journal', []).filter(x => String(x.id) !== b.dataset.del));
        renderJournal();
        toast('Reflection deleted');
      });

      bindTips(root);
      renderSky();
      renderJournal();
    }
    return { title: 'My constellation', html, mount };
  }

  /* ======================================================================
     ROUTER
     ====================================================================== */
  const VIEWS = { home: Home, atlas: Atlas, compare: Compare, timeline: Timeline, cave: Cave, agora: Agora, quiz: Quiz, constellation: Constellation };
  let cleanups = [];
  let keyHandler = null;
  let firstRender = true;

  function render() {
    let name = decodeURIComponent(location.hash.slice(1)) || 'home';
    cleanups.forEach(f => { try { f(); } catch (e) { } });
    cleanups = [];
    keyHandler = null;
    hideTip();

    let view;
    if (byId[name]) view = Detail(byId[name]);
    else if (VIEWS[name]) view = VIEWS[name]();
    else { name = 'home'; view = Home(); }

    const main = $('#view');
    main.innerHTML = `<div class="page page-${name}">${view.html}</div>`;
    if (view.mount) view.mount(main.firstElementChild);

    const navKey = byId[name] ? 'atlas' : name;
    $$('.nav-item').forEach(a => {
      const on = a.dataset.route === navKey;
      a.classList.toggle('active', on);
      if (on) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
    });
    updateSideYou();
    document.title = (view.title ? view.title + ' · ' : '') + 'Kosmos Worldview Atlas';
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    openDrawer(false);
    if (!firstRender) main.focus({ preventScroll: true });
    firstRender = false;
  }

  /* ---------- Boot ---------- */
  buildNav();
  renderThemeToggle();
  updateSideYou();
  stars.sync();

  $('#theme-toggle').addEventListener('click', () => setTheme(currentTheme() === 'dark' ? 'light' : 'dark'));
  mqLight.addEventListener('change', () => { renderThemeToggle(); stars.sync(); });
  $('#menu-btn').addEventListener('click', () => openDrawer(!$('#sidebar').classList.contains('open')));
  $('#scrim').addEventListener('click', () => openDrawer(false));
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') openDrawer(false);
    const tag = (e.target.tagName || '').toLowerCase();
    if (tag === 'textarea' || tag === 'input' || e.metaKey || e.ctrlKey || e.altKey) return;
    if (keyHandler) keyHandler(e);
  });
  window.addEventListener('hashchange', render);
  render();
})();
