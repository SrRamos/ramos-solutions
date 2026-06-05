/* Ramos Solution SAS — Main JS v2
   Neural constellation hero, mouse trail, magnetic buttons,
   3D tilt cards, scroll progress, reveal animations, FAQ, chatbot
   ======================================== */

(function () {
  'use strict';

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const isMobile = window.matchMedia('(max-width: 767.98px), (pointer: coarse)');

  /* ========================================
     Hero Canvas — Neural Constellation
     ======================================== */
  function initHeroCanvas() {
    const canvas = document.getElementById('hero-canvas');
    const hero = document.querySelector('.hero');
    if (!canvas || !hero) return;

    if (reducedMotion.matches || isMobile.matches) {
      canvas.style.background = 'radial-gradient(ellipse at 50% 45%, rgba(99,102,241,0.12) 0%, transparent 60%)';
      canvas.style.opacity = '0.5';
      return;
    }

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    const PALETTE = [
      { r: 99, g: 102, b: 241 },   // indigo
      { r: 168, g: 85, b: 247 },   // purple
      { r: 34, g: 211, b: 238 },   // cyan
      { r: 139, g: 92, b: 246 },   // violet
      { r: 99, g: 102, b: 241 },   // indigo repeat for weight
    ];

    let w = 0, h = 0, dpr = Math.min(window.devicePixelRatio || 1, 2);
    let nodes = [];
    let raf = 0;
    let running = false;
    let scrollProgress = 0;
    let targetScrollProgress = 0;
    let pointerActive = false;
    let pointer = { x: 0, y: 0, tx: 0, ty: 0 };
    let time = 0;

    function random(seed) {
      const x = Math.sin(seed * 999.97) * 43758.5453;
      return x - Math.floor(x);
    }

    function resize() {
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      pointer.x = pointer.tx = w * 0.5;
      pointer.y = pointer.ty = h * 0.48;
      seed();
    }

    function makeNode(i) {
      const color = PALETTE[i % PALETTE.length];
      const sizeBase = i % 5 === 0 ? 4 : (i % 3 === 0 ? 2.5 : 1.5);
      const isHub = i % 7 === 0;

      return {
        x: random(i + 1) * w,
        y: random(i + 100) * h,
        baseX: 0,
        baseY: 0,
        vx: 0,
        vy: 0,
        size: sizeBase * (isHub ? 1.6 : 1),
        baseSize: sizeBase * (isHub ? 1.6 : 1),
        color: color,
        alpha: random(i + 50) * 0.5 + 0.2,
        baseAlpha: random(i + 50) * 0.5 + 0.2,
        pulsePhase: random(i + 200) * Math.PI * 2,
        pulseSpeed: 0.002 + random(i + 300) * 0.003,
        isHub: isHub,
        orbitRadius: random(i + 500) * 30 + 10,
        orbitSpeed: (random(i + 600) - 0.5) * 0.001,
        orbitAngle: random(i + 700) * Math.PI * 2,
      };
    }

    function seed() {
      const count = w < 640 ? 60 : (w < 1024 ? 90 : 120);
      nodes = Array.from({ length: count }, (_, i) => makeNode(i));
      nodes.forEach(n => { n.baseX = n.x; n.baseY = n.y; });
    }

    function updateScrollProgress() {
      const rect = hero.getBoundingClientRect();
      targetScrollProgress = Math.max(0, Math.min(1, -rect.top / Math.max(rect.height, 1)));
    }

    function drawBackdrop() {
      ctx.globalCompositeOperation = 'source-over';
      ctx.clearRect(0, 0, w, h);

      const base = ctx.createRadialGradient(w * 0.5, h * 0.45, 0, w * 0.5, h * 0.45, Math.max(w, h) * 0.7);
      base.addColorStop(0, 'rgba(15, 15, 35, 0.4)');
      base.addColorStop(0.5, 'rgba(10, 10, 20, 0.2)');
      base.addColorStop(1, 'rgba(6, 6, 12, 0)');
      ctx.fillStyle = base;
      ctx.fillRect(0, 0, w, h);

      const scanX = pointerActive ? pointer.x : w * 0.5 + Math.sin(time * 0.0005) * w * 0.1;
      const scanY = pointerActive ? pointer.y : h * 0.45 + Math.cos(time * 0.0004) * h * 0.08;
      const halo = ctx.createRadialGradient(scanX, scanY, 0, scanX, scanY, Math.max(w, h) * 0.45);
      halo.addColorStop(0, 'rgba(99, 102, 241, 0.15)');
      halo.addColorStop(0.3, 'rgba(168, 85, 247, 0.08)');
      halo.addColorStop(0.6, 'rgba(34, 211, 238, 0.04)');
      halo.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = halo;
      ctx.fillRect(0, 0, w, h);
    }

    function drawConnections() {
      ctx.globalCompositeOperation = 'lighter';
      const maxDist = w < 640 ? 100 : 140;
      const maxConnections = 3;

      for (let i = 0; i < nodes.length; i++) {
        const n1 = nodes[i];
        let connected = 0;

        for (let j = i + 1; j < nodes.length && connected < maxConnections; j++) {
          const n2 = nodes[j];
          const dx = n1.x - n2.x;
          const dy = n1.y - n2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxDist) {
            const alpha = (1 - dist / maxDist) * 0.15 * Math.min(n1.alpha, n2.alpha);
            ctx.beginPath();
            ctx.moveTo(n1.x, n1.y);
            ctx.lineTo(n2.x, n2.y);
            ctx.strokeStyle = `rgba(${n1.color.r}, ${n1.color.g}, ${n1.color.b}, ${alpha})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
            connected++;
          }
        }
      }
    }

    function drawNodes() {
      for (const n of nodes) {
        const pulse = Math.sin(time * n.pulseSpeed + n.pulsePhase) * 0.3 + 0.7;
        const currentSize = n.size * pulse;
        const currentAlpha = n.alpha * pulse;

        if (n.isHub) {
          const glow = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, currentSize * 6);
          glow.addColorStop(0, `rgba(${n.color.r}, ${n.color.g}, ${n.color.b}, ${currentAlpha * 0.3})`);
          glow.addColorStop(1, `rgba(${n.color.r}, ${n.color.g}, ${n.color.b}, 0)`);
          ctx.fillStyle = glow;
          ctx.beginPath();
          ctx.arc(n.x, n.y, currentSize * 6, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.beginPath();
        ctx.arc(n.x, n.y, currentSize, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${n.color.r}, ${n.color.g}, ${n.color.b}, ${currentAlpha})`;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(n.x, n.y, currentSize * 0.4, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${currentAlpha * 0.6})`;
        ctx.fill();
      }
    }

    function updateNodes() {
      for (const n of nodes) {
        n.orbitAngle += n.orbitSpeed;
        const driftX = Math.cos(n.orbitAngle) * n.orbitRadius * (1 + scrollProgress * 0.5);
        const driftY = Math.sin(n.orbitAngle) * n.orbitRadius * 0.6;

        const dx = pointer.x - n.x;
        const dy = pointer.y - n.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const mouseRadius = 200;

        if (dist < mouseRadius && pointerActive) {
          const force = (1 - dist / mouseRadius) * 0.02;
          n.vx += dx * force * 0.01;
          n.vy += dy * force * 0.01;
          n.alpha = Math.min(1, n.baseAlpha + (1 - dist / mouseRadius) * 0.5);
          n.size = n.baseSize * (1 + (1 - dist / mouseRadius) * 0.5);
        } else {
          n.alpha += (n.baseAlpha - n.alpha) * 0.05;
          n.size += (n.baseSize - n.size) * 0.05;
        }

        n.x = n.baseX + driftX + n.vx;
        n.y = n.baseY + driftY + n.vy;
        n.vx *= 0.95;
        n.vy *= 0.95;
      }
    }

    function drawScanner() {
      const radius = Math.min(w, h) * (0.12 + scrollProgress * 0.05);
      const x = pointerActive ? pointer.x : w * 0.5;
      const y = pointerActive ? pointer.y : h * 0.45;

      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      ctx.translate(x, y);
      ctx.rotate(time * 0.0003);

      ctx.strokeStyle = 'rgba(99, 102, 241, 0.12)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(0, 0, radius, 0, Math.PI * 1.5);
      ctx.stroke();

      ctx.strokeStyle = 'rgba(168, 85, 247, 0.1)';
      ctx.beginPath();
      ctx.arc(0, 0, radius * 0.6, Math.PI * 0.5, Math.PI * 2);
      ctx.stroke();

      ctx.restore();
    }

    function drawDataPackets() {
      const packetCount = 5;
      ctx.globalCompositeOperation = 'lighter';

      for (let i = 0; i < packetCount; i++) {
        const t = (time * 0.0002 + i / packetCount) % 1;
        const idx1 = Math.floor(t * nodes.length) % nodes.length;
        const idx2 = (idx1 + 1 + Math.floor(i * 7)) % nodes.length;
        const n1 = nodes[idx1];
        const n2 = nodes[idx2];

        if (!n1 || !n2) continue;

        const frac = (t * nodes.length) % 1;
        const px = n1.x + (n2.x - n1.x) * frac;
        const py = n1.y + (n2.y - n1.y) * frac;

        ctx.beginPath();
        ctx.arc(px, py, 1.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(34, 211, 238, ${0.4 + Math.sin(time * 0.003 + i) * 0.2})`;
        ctx.fill();
      }
    }

    function loop() {
      if (!running) return;
      time += 16;
      scrollProgress += (targetScrollProgress - scrollProgress) * 0.05;
      pointer.x += (pointer.tx - pointer.x) * 0.12;
      pointer.y += (pointer.ty - pointer.y) * 0.12;

      drawBackdrop();
      updateNodes();
      drawConnections();
      drawNodes();
      drawDataPackets();
      drawScanner();

      raf = requestAnimationFrame(loop);
    }

    function start() { if (!running) { running = true; loop(); } }
    function stop() { running = false; cancelAnimationFrame(raf); }

    const visObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => entry.isIntersecting ? start() : stop());
    }, { threshold: 0 });
    visObserver.observe(hero);

    resize();
    window.addEventListener('resize', resize);

    hero.addEventListener('pointermove', (e) => {
      pointerActive = true;
      const rect = canvas.getBoundingClientRect();
      pointer.tx = e.clientX - rect.left;
      pointer.ty = e.clientY - rect.top;
    });

    hero.addEventListener('pointerleave', () => { pointerActive = false; });
    window.addEventListener('scroll', updateScrollProgress, { passive: true });
    updateScrollProgress();
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
    initYear();
    initForm();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
