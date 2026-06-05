/* Ramos Solution SAS — Main JS v2
   Neural constellation hero, mouse trail, magnetic buttons,
   3D tilt cards, scroll progress, reveal animations, FAQ, chatbot
   ======================================== */

(function () {
  'use strict';

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const isMobile = window.matchMedia('(max-width: 767.98px), (pointer: coarse)');

  /* ========================================
     Hero Canvas — Dot Mesh Network
     ======================================== */
  function initHeroCanvas() {
    const canvas = document.getElementById('hero-canvas');
    const hero = document.querySelector('.hero');
    if (!canvas || !hero) return;

    if (reducedMotion.matches || isMobile.matches) {
      canvas.style.background = 'radial-gradient(ellipse at 50% 45%, rgba(99,102,241,0.08) 0%, transparent 60%)';
      canvas.style.opacity = '0.4';
      return;
    }

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let W = 0, H = 0, dpr = Math.min(window.devicePixelRatio || 1, 2);
    let dots = [];
    let raf = 0;
    let running = false;

    const SPACING = 45;
    const RADIUS = 1.1;
    const SPEED = 0.12;
    const LINK_DIST = 90;
    const MAX_LINKS = 3;

    function resize() {
      const rect = canvas.getBoundingClientRect();
      W = rect.width;
      H = rect.height;
      canvas.width = Math.floor(W * dpr);
      canvas.height = Math.floor(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      buildGrid();
    }

    function buildGrid() {
      dots = [];
      const cols = Math.ceil(W / SPACING) + 1;
      const rows = Math.ceil(H / SPACING) + 1;
      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          const ox = i * SPACING + (SPACING / 2);
          const oy = j * SPACING + (SPACING / 2);
          dots.push({
            x: ox, y: oy,
            ox: ox, oy: oy,
            ph: Math.random() * Math.PI * 2,
            ph2: Math.random() * Math.PI * 2,
          });
        }
      }
    }

    function drawMesh(t) {
      ctx.clearRect(0, 0, W, H);

      // Update positions
      for (const d of dots) {
        d.x = d.ox + Math.sin(t * SPEED + d.ph) * 4;
        d.y = d.oy + Math.cos(t * SPEED * 0.7 + d.ph2) * 4;
      }

      // Draw links
      ctx.lineWidth = 0.7;
      for (let i = 0; i < dots.length; i++) {
        const a = dots[i];
        let links = 0;
        for (let j = i + 1; j < dots.length; j++) {
          const b = dots[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < LINK_DIST * LINK_DIST) {
            const dist = Math.sqrt(d2);
            const alpha = (1 - dist / LINK_DIST) * 0.14;
            ctx.strokeStyle = `rgba(99,102,241,${alpha})`;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
            if (++links >= MAX_LINKS) break;
          }
        }
      }

      // Draw dots
      for (const d of dots) {
        ctx.beginPath();
        ctx.arc(d.x, d.y, RADIUS, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(34,211,238,0.28)';
        ctx.fill();
      }
    }

    let lastT = 0;
    function loop(now) {
      if (!running) return;
      // throttle to ~30fps for subtlety and battery
      if (now - lastT < 33) { raf = requestAnimationFrame(loop); return; }
      lastT = now;
      drawMesh(now * 0.001);
      raf = requestAnimationFrame(loop);
    }

    function start() { if (!running) { running = true; raf = requestAnimationFrame(loop); } }
    function stop() { running = false; cancelAnimationFrame(raf); }

    const visObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => entry.isIntersecting ? start() : stop());
    }, { threshold: 0 });
    visObserver.observe(hero);

    resize();
    window.addEventListener('resize', resize);
  }

  /* ========================================
     Mouse Trail Canvas
     ======================================== */
  function initTrailCanvas() {
    const canvas = document.getElementById('trail-canvas');
    if (!canvas || reducedMotion.matches || isMobile.matches) {
      if (canvas) canvas.style.display = 'none';
      return;
    }

    const ctx = canvas.getContext('2d', { alpha: true });
    let w = 0, h = 0, dpr = 1;
    let points = [];
    let raf = 0;

    function resize() {
      w = window.innerWidth;
      h = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function addPoint(x, y) {
      points.push({ x, y, life: 1, size: Math.random() * 2 + 1 });
      if (points.length > 40) points.shift();
    }

    function draw() {
      ctx.clearRect(0, 0, w, h);

      for (let i = points.length - 1; i >= 0; i--) {
        const p = points[i];
        p.life -= 0.015;
        if (p.life <= 0) { points.splice(i, 1); continue; }

        const alpha = p.life * 0.4;
        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 4);
        gradient.addColorStop(0, `rgba(99, 102, 241, ${alpha})`);
        gradient.addColorStop(0.5, `rgba(168, 85, 247, ${alpha * 0.5})`);
        gradient.addColorStop(1, `rgba(99, 102, 241, 0)`);
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 4, 0, Math.PI * 2);
        ctx.fill();
      }

      if (points.length > 1) {
        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);
        for (let i = 1; i < points.length; i++) ctx.lineTo(points[i].x, points[i].y);
        ctx.strokeStyle = `rgba(99, 102, 241, ${(points[0]?.life || 0) * 0.1})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      raf = requestAnimationFrame(draw);
    }

    resize();
    window.addEventListener('resize', resize);

    let lastX = 0, lastY = 0;
    document.addEventListener('pointermove', (e) => {
      const dist = Math.hypot(e.clientX - lastX, e.clientY - lastY);
      if (dist > 5) {
        addPoint(e.clientX, e.clientY);
        lastX = e.clientX;
        lastY = e.clientY;
      }
    });

    draw();
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
     Magnetic buttons
     ======================================== */
  function initMagneticButtons() {
    if (isMobile.matches || reducedMotion.matches) return;

    document.querySelectorAll('.magnetic').forEach(btn => {
      btn.addEventListener('pointermove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
      });
      btn.addEventListener('pointerleave', () => { btn.style.transform = ''; });
    });
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
    initTrailCanvas();
    initScrollProgress();
    initHeader();
    initMenu();
    initReveals();
    initMagneticButtons();
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
