/* Ramos Solution SAS — Main JS v3
   Premium dot-mesh hero, scroll progress, reveal animations, modals
   ======================================== */

(function () {
  'use strict';

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const isMobile = window.matchMedia('(max-width: 767.98px), (pointer: coarse)');

  /* ========================================
     Hero Canvas — Interactive World Light Map
     ======================================== */
  function initHeroCanvas() {
    const canvas = document.getElementById('hero-canvas');
    const hero = document.querySelector('.hero');
    if (!canvas || !hero) return;

    if (reducedMotion.matches || isMobile.matches) {
      canvas.style.display = 'none';
      return;
    }

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let W = 0, H = 0, dpr = Math.min(window.devicePixelRatio || 1, 2);
    let raf = 0;
    let running = false;
    let lastT = 0;
    let mapDots = [];
    let routes = [];
    let pointer = { x: 0, y: 0, active: false };

    const POINTER_RADIUS = 170;
    const BASE_ALPHA = 0.09;

    const colombia = [
      { name: 'Bogotá', lat: 4.711, lon: -74.072, anchor: true },
      { name: 'Medellín', lat: 6.244, lon: -75.581, anchor: true },
      { name: 'Cali', lat: 3.451, lon: -76.532, anchor: true },
      { name: 'Barranquilla', lat: 10.968, lon: -74.781, anchor: true },
      { name: 'Cartagena', lat: 10.391, lon: -75.479, anchor: true },
    ];

    const globalNodes = [
      [-33.868,151.209],[-37.813,144.963],[-6.208,106.846],[1.352,103.819],[35.676,139.65],[37.566,126.978],[31.23,121.47],[22.319,114.169],[28.613,77.209],[19.076,72.878],[25.204,55.27],[24.713,46.675],[30.044,31.236],[-1.286,36.817],[-26.204,28.047],[-33.925,18.424],[41.008,28.978],[55.755,37.617],[52.52,13.405],[48.856,2.352],[51.507,-0.128],[40.416,-3.704],[41.902,12.496],[52.367,4.904],[59.329,18.069],[60.169,24.938],[45.464,9.19],[47.376,8.541],[50.075,14.438],[38.722,-9.139],[40.713,-74.006],[42.36,-71.059],[43.653,-79.383],[45.501,-73.567],[49.282,-123.121],[37.774,-122.419],[34.052,-118.244],[47.606,-122.332],[41.878,-87.63],[29.76,-95.37],[25.761,-80.192],[19.432,-99.133],[20.659,-103.349],[9.928,-84.091],[8.982,-79.52],[-12.046,-77.043],[-33.448,-70.669],[-34.603,-58.382],[-23.55,-46.633],[-22.907,-43.173],[-34.901,-56.164],[-0.18,-78.467],[-16.5,-68.15],[-4.442,15.266],[6.524,3.379],[33.573,-7.589],[36.753,3.058]
    ];

    const coastHints = [
      // Americas
      [64,-150],[58,-135],[52,-124],[45,-122],[36,-121],[30,-116],[24,-106],[19,-99],[15,-90],[9,-84],[4,-77],[-2,-79],[-8,-78],[-16,-74],[-23,-70],[-33,-71],[-46,-73],[-52,-70],[-34,-58],[-24,-46],[-12,-38],[-3,-38],[6,-58],[12,-70],[18,-77],[25,-80],[32,-81],[40,-74],[46,-63],[52,-56],[58,-45],
      // Europe / Africa / Middle East
      [60,-8],[52,0],[48,2],[43,5],[40,-3],[38,-9],[51,10],[55,20],[60,30],[45,14],[41,29],[35,33],[31,31],[20,39],[5,45],[-5,39],[-15,40],[-30,31],[-34,18],[-25,14],[-5,12],[6,3],[15,-17],[30,-9],[36,3],[37,10],
      // Asia / Oceania
      [55,37],[48,68],[43,77],[39,116],[35,139],[31,121],[22,114],[14,121],[1,104],[-6,107],[-8,115],[13,100],[19,73],[28,77],[24,55],[35,51],[43,131],[-21,55],[-34,151],[-38,145],[-31,115],[-36,174]
    ];

    function project(lat, lon) {
      const mapW = Math.min(W * 1.05, H * 1.72);
      const mapH = mapW * 0.52;
      const x0 = (W - mapW) * 0.5;
      const y0 = H * 0.1 + (H * 0.72 - mapH) * 0.5;
      const x = x0 + ((lon + 180) / 360) * mapW;
      const merc = Math.log(Math.tan(Math.PI / 4 + (Math.max(-66, Math.min(66, lat)) * Math.PI / 180) / 2));
      const y = y0 + (0.5 - merc / (2 * Math.PI)) * mapH;
      return { x, y };
    }

    function buildMap() {
      mapDots = [];
      const push = (lat, lon, opts = {}) => {
        const p = project(lat, lon);
        mapDots.push({
          x: p.x, y: p.y, lat, lon,
          phase: Math.random() * Math.PI * 2,
          size: opts.anchor ? 2.9 : opts.city ? 1.85 : 1.05,
          anchor: !!opts.anchor,
          city: !!opts.city,
          label: opts.name || '',
        });
      };

      coastHints.forEach(([lat, lon]) => push(lat, lon));
      globalNodes.forEach(([lat, lon]) => push(lat, lon, { city: true }));
      colombia.forEach((node) => push(node.lat, node.lon, node));

      routes = colombia.slice(0, 3).flatMap((source) => {
        const from = project(source.lat, source.lon);
        return [
          { from, to: project(40.713, -74.006), delay: Math.random() * 2.4 },
          { from, to: project(40.416, -3.704), delay: Math.random() * 2.4 },
          { from, to: project(19.432, -99.133), delay: Math.random() * 2.4 },
        ];
      });
    }

    function resize() {
      const rect = canvas.getBoundingClientRect();
      W = rect.width;
      H = rect.height;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(W * dpr);
      canvas.height = Math.floor(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      buildMap();
    }

    function drawRoute(route, t) {
      const { from, to, delay } = route;
      const cx = (from.x + to.x) * 0.5;
      const cy = Math.min(from.y, to.y) - Math.abs(to.x - from.x) * 0.12 - 28;
      ctx.save();
      ctx.strokeStyle = 'rgba(99,102,241,0.105)';
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      ctx.moveTo(from.x, from.y);
      ctx.quadraticCurveTo(cx, cy, to.x, to.y);
      ctx.stroke();

      const p = ((t * 0.18 + delay) % 1);
      const qx = (1 - p) * (1 - p) * from.x + 2 * (1 - p) * p * cx + p * p * to.x;
      const qy = (1 - p) * (1 - p) * from.y + 2 * (1 - p) * p * cy + p * p * to.y;
      const fade = Math.sin(p * Math.PI);
      ctx.beginPath();
      ctx.arc(qx, qy, 2.2 + fade * 1.4, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(34,211,238,${0.05 + fade * 0.42})`;
      ctx.fill();
      ctx.restore();
    }

    function draw(t) {
      ctx.clearRect(0, 0, W, H);

      const halo = ctx.createRadialGradient(W * 0.5, H * 0.5, 0, W * 0.5, H * 0.5, Math.max(W, H) * 0.62);
      halo.addColorStop(0, 'rgba(99,102,241,0.08)');
      halo.addColorStop(0.45, 'rgba(34,211,238,0.025)');
      halo.addColorStop(1, 'rgba(10,10,15,0)');
      ctx.fillStyle = halo;
      ctx.fillRect(0, 0, W, H);

      ctx.save();
      ctx.globalAlpha = 0.16;
      ctx.strokeStyle = 'rgba(148,163,184,0.32)';
      ctx.lineWidth = 0.55;
      for (let i = 0; i < 7; i++) {
        const y = H * (0.2 + i * 0.085);
        ctx.beginPath(); ctx.moveTo(W * 0.08, y); ctx.lineTo(W * 0.92, y); ctx.stroke();
      }
      for (let i = 0; i < 9; i++) {
        const x = W * (0.1 + i * 0.1);
        ctx.beginPath(); ctx.moveTo(x, H * 0.16); ctx.lineTo(x, H * 0.82); ctx.stroke();
      }
      ctx.restore();

      routes.forEach((route) => drawRoute(route, t));

      let label = null;
      for (const dot of mapDots) {
        const dx = dot.x - pointer.x;
        const dy = dot.y - pointer.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const hover = pointer.active ? Math.max(0, 1 - dist / POINTER_RADIUS) : 0;
        const colombiaGlow = dot.anchor ? (0.68 + Math.sin(t * 2.6 + dot.phase) * 0.18) : 0;
        const cityPulse = dot.city ? (0.12 + Math.sin(t * 1.15 + dot.phase) * 0.04) : 0;
        const alpha = Math.min(0.92, BASE_ALPHA + cityPulse + hover * 0.62 + colombiaGlow);
        const radius = dot.size + hover * 3.4 + (dot.anchor ? 1.3 : 0);

        if (hover > 0.18 || dot.anchor) {
          ctx.beginPath();
          ctx.arc(dot.x, dot.y, radius * (dot.anchor ? 4.1 : 3.2), 0, Math.PI * 2);
          ctx.fillStyle = dot.anchor ? `rgba(52,211,153,${0.035 + colombiaGlow * 0.035})` : `rgba(34,211,238,${hover * 0.075})`;
          ctx.fill();
        }

        ctx.beginPath();
        ctx.arc(dot.x, dot.y, radius, 0, Math.PI * 2);
        ctx.fillStyle = dot.anchor ? `rgba(52,211,153,${alpha})` : `rgba(148,163,184,${alpha})`;
        ctx.fill();

        if (hover > 0.48 && dot.city) label = dot;
      }

      if (label) {
        ctx.font = '600 11px Inter, system-ui, sans-serif';
        ctx.fillStyle = 'rgba(248,250,252,0.78)';
        ctx.fillText('Nuevo punto activo', label.x + 10, label.y - 8);
      }

      const bogota = mapDots.find(d => d.label === 'Bogotá');
      if (bogota) {
        ctx.font = '700 12px Inter, system-ui, sans-serif';
        ctx.fillStyle = 'rgba(52,211,153,0.88)';
        ctx.fillText('Colombia siempre encendida', bogota.x + 14, bogota.y + 4);
      }
    }

    function loop(now) {
      if (!running) return;
      if (now - lastT < 33) { raf = requestAnimationFrame(loop); return; }
      lastT = now;
      draw(now * 0.001);
      raf = requestAnimationFrame(loop);
    }

    function start() { if (!running) { running = true; raf = requestAnimationFrame(loop); } }
    function stop() { running = false; cancelAnimationFrame(raf); }

    hero.addEventListener('pointermove', (event) => {
      const rect = canvas.getBoundingClientRect();
      pointer.x = event.clientX - rect.left;
      pointer.y = event.clientY - rect.top;
      pointer.active = true;
    }, { passive: true });
    hero.addEventListener('pointerleave', () => { pointer.active = false; }, { passive: true });

    const visObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => entry.isIntersecting ? start() : stop());
    }, { threshold: 0 });
    visObserver.observe(hero);

    resize();
    window.addEventListener('resize', resize, { passive: true });
  }

  /* ========================================
     Scroll Progress Bar
     ======================================== */
  function initScrollProgress() {
    const progress = document.querySelector('.scroll-progress');
    const bar = document.querySelector('.scroll-progress__bar');
    if (!progress || !bar) return;

    let frame = 0;
    function update() {
      frame = 0;
      const y = window.scrollY || window.pageYOffset || document.documentElement.scrollTop || 0;
      const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const ratio = Math.min(Math.max(y / max, 0), 1);
      bar.style.transform = 'scaleX(' + ratio.toFixed(4) + ')';
      progress.toggleAttribute('data-active', ratio > 0.004);
    }
    function requestUpdate() { if (!frame) frame = requestAnimationFrame(update); }

    update();
    window.addEventListener('scroll', requestUpdate, { passive: true });
    window.addEventListener('resize', requestUpdate);
    window.addEventListener('load', requestUpdate);
  }

  /* ========================================
     Header shadow on scroll
     ======================================== */
  function initHeader() {
    const header = document.querySelector('.site-header');
    function update() { header?.classList.toggle('scrolled', window.scrollY > 10); }
    window.addEventListener('scroll', update, { passive: true });
    update();
  }

  /* ========================================
     Mobile menu
     ======================================== */
  function initMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const primaryNav = document.getElementById('primary-nav');
    const navLinks = primaryNav?.querySelectorAll('a');

    function toggleMenu(open) {
      const isOpen = open ?? !primaryNav?.classList.contains('open');
      menuToggle?.setAttribute('aria-expanded', String(isOpen));
      primaryNav?.classList.toggle('open', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    }

    menuToggle?.addEventListener('click', () => toggleMenu());
    navLinks?.forEach(link => link.addEventListener('click', () => {
      if (window.innerWidth < 768) toggleMenu(false);
    }));
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && primaryNav?.classList.contains('open')) toggleMenu(false);
    });
  }

  /* ========================================
     Reveal animations with IntersectionObserver
     ======================================== */
  function initReveals() {
    const revealEls = document.querySelectorAll('.reveal');
    if (!revealEls.length) return;

    if (reducedMotion.matches || isMobile.matches || !('IntersectionObserver' in window)) {
      revealEls.forEach(el => el.classList.add('is-visible'));
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const delay = parseInt(entry.target.dataset.delay || '0', 10);
        setTimeout(() => entry.target.classList.add('is-visible'), delay * 100);
        observer.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.12 });

    revealEls.forEach(el => observer.observe(el));
  }

  /* ========================================
     Animated counters
     ======================================== */
  function initCounters() {
    const stats = document.querySelectorAll('.stat');
    if (!stats.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const numEl = entry.target.querySelector('[data-target]');
        if (!numEl) return;
        const target = parseInt(numEl.dataset.target, 10);
        const duration = 1800;
        const start = performance.now();

        function tick(now) {
          const progress = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 4);
          numEl.textContent = Math.floor(eased * target);
          if (progress < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.5 });

    stats.forEach(stat => observer.observe(stat));
  }

  /* ========================================
     3D Tilt cards
     ======================================== */
  function initTiltCards() {
    if (isMobile.matches || reducedMotion.matches) return;

    document.querySelectorAll('.tilt-card').forEach(card => {
      card.addEventListener('pointermove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        card.style.transform = `perspective(800px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) translateZ(10px)`;
      });
      card.addEventListener('pointerleave', () => { card.style.transform = ''; });
    });
  }

  /* ========================================
     Footer year + Form
     ======================================== */
  function initYear() {
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = String(new Date().getFullYear());
  }

  function initForm() {
    const form = document.querySelector('.contacto-form');
    form?.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = form.querySelector('button[type="submit"]');
      const original = btn.textContent;
      btn.textContent = '¡Mensaje enviado! Te contactaremos pronto.';
      btn.disabled = true;
      setTimeout(() => {
        btn.textContent = original;
        btn.disabled = false;
        form.reset();
      }, 3000);
    });
  }

  /* ========================================
     Modals
     ======================================== */
  function initModals() {
    const overlay = document.getElementById('modal-overlay');
    const cards = document.querySelectorAll('[data-modal]');
    const closeButtons = document.querySelectorAll('.modal__close');
    if (!overlay || !cards.length) return;

    function openModal(id) {
      const modal = document.getElementById(id);
      if (!modal) return;
      overlay.classList.add('active');
      modal.classList.add('active');
      modal.setAttribute('aria-hidden', 'false');
      overlay.setAttribute('aria-hidden', 'false');
      document.body.classList.add('modal-open');
      // Focus first focusable element in modal
      const focusable = modal.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
      focusable?.focus();
    }

    function closeAll() {
      document.querySelectorAll('.modal.active').forEach(m => {
        m.classList.remove('active');
        m.setAttribute('aria-hidden', 'true');
      });
      overlay.classList.remove('active');
      overlay.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('modal-open');
    }

    cards.forEach(card => {
      card.addEventListener('click', (e) => {
        const modalId = card.dataset.modal;
        if (modalId) openModal(modalId);
      });
    });

    closeButtons.forEach(btn => {
      btn.addEventListener('click', closeAll);
    });

    overlay.addEventListener('click', closeAll);
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeAll();
    });
  }

  /* ========================================
     Initialize all
     ======================================== */
  function init() {
    initHeroCanvas();
    initScrollProgress();
    initHeader();
    initMenu();
    initReveals();
    initTiltCards();
    initModals();
    initYear();
    initForm();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
