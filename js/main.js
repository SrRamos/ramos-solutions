/* Ramos Solution SAS — Main JS v3
   Premium dot-mesh hero, scroll progress, reveal animations, modals
   ======================================== */

(function () {
  'use strict';

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const isMobile = window.matchMedia('(max-width: 767.98px), (pointer: coarse)');

  /* ========================================
     Hero Canvas — Premium Dot Mesh Network
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
    let dots = [];
    let raf = 0;
    let running = false;
    let lastT = 0;

    const SPACING = 38;
    const RADIUS = 0.95;
    const SPEED = 0.105;
    const LINK_DIST = 86;
    const MAX_LINKS = 4;

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
      const cols = Math.ceil(W / SPACING) + 2;
      const rows = Math.ceil(H / SPACING) + 2;
      for (let i = -1; i < cols; i++) {
        for (let j = -1; j < rows; j++) {
          const stagger = (j % 2) * (SPACING * 0.5);
          const ox = i * SPACING + stagger;
          const oy = j * SPACING;
          const cx = W * 0.5;
          const cy = H * 0.46;
          const dx = ox - cx;
          const dy = oy - cy;
          const core = Math.max(0, 1 - Math.sqrt(dx * dx + dy * dy) / Math.max(W, H) * 1.25);
          dots.push({
            x: ox, y: oy, ox, oy,
            ph: Math.random() * Math.PI * 2,
            ph2: Math.random() * Math.PI * 2,
            core,
            drift: 2.2 + core * 4.6,
          });
        }
      }
    }

    function drawAmbientVeil(t) {
      const glow = ctx.createRadialGradient(W * 0.5, H * 0.44, 0, W * 0.5, H * 0.44, Math.max(W, H) * 0.56);
      glow.addColorStop(0, 'rgba(99,102,241,0.105)');
      glow.addColorStop(0.34, 'rgba(34,211,238,0.045)');
      glow.addColorStop(1, 'rgba(10,10,15,0)');
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, W, H);

      ctx.save();
      ctx.globalAlpha = 0.14 + Math.sin(t * 0.45) * 0.025;
      ctx.strokeStyle = 'rgba(248,250,252,0.16)';
      ctx.lineWidth = 0.8;
      for (let k = -2; k < 5; k++) {
        const y = H * (0.22 + k * 0.11) + Math.sin(t * 0.34 + k) * 5;
        ctx.beginPath();
        ctx.moveTo(W * -0.05, y);
        ctx.bezierCurveTo(W * 0.25, y - 42, W * 0.64, y + 54, W * 1.05, y - 8);
        ctx.stroke();
      }
      ctx.restore();
    }

    function drawMesh(t) {
      ctx.clearRect(0, 0, W, H);
      drawAmbientVeil(t);

      for (const d of dots) {
        d.x = d.ox + Math.sin(t * SPEED + d.ph) * d.drift;
        d.y = d.oy + Math.cos(t * SPEED * 0.82 + d.ph2) * d.drift;
      }

      ctx.lineWidth = 0.65;
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
            const core = (a.core + b.core) * 0.5;
            const alpha = (1 - dist / LINK_DIST) * (0.075 + core * 0.12);
            const grad = ctx.createLinearGradient(a.x, a.y, b.x, b.y);
            grad.addColorStop(0, `rgba(99,102,241,${alpha})`);
            grad.addColorStop(1, `rgba(34,211,238,${alpha * 0.88})`);
            ctx.strokeStyle = grad;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
            if (++links >= MAX_LINKS) break;
          }
        }
      }

      for (const d of dots) {
        const pulse = 0.5 + Math.sin(t * 0.8 + d.ph) * 0.5;
        const r = RADIUS + d.core * 1.15 + pulse * 0.18;
        const alpha = 0.22 + d.core * 0.38;
        ctx.beginPath();
        ctx.arc(d.x, d.y, r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(34,211,238,${alpha})`;
        ctx.fill();

        if (d.core > 0.72 && pulse > 0.86) {
          ctx.beginPath();
          ctx.arc(d.x, d.y, r * 3.2, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(99,102,241,${0.028 * d.core})`;
          ctx.fill();
        }
      }
    }

    function loop(now) {
      if (!running) return;
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
