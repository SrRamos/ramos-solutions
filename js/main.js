/* Ramos Solution SAS — Main JS
   Mobile menu, scroll animations, counters, chatbot widget
   ======================================== */

(function () {
  'use strict';

  /* Mobile menu */
  const menuToggle = document.querySelector('.menu-toggle');
  const primaryNav = document.getElementById('primary-nav');
  const navLinks = primaryNav?.querySelectorAll('a');

  function toggleMenu(open) {
    const isOpen = open ?? primaryNav?.classList.contains('open') === false;
    menuToggle?.setAttribute('aria-expanded', String(isOpen));
    primaryNav?.classList.toggle('open', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  }

  menuToggle?.addEventListener('click', () => toggleMenu());

  navLinks?.forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth < 768) toggleMenu(false);
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && primaryNav?.classList.contains('open')) {
      toggleMenu(false);
    }
  });

  /* Header shadow on scroll */
  const header = document.querySelector('.site-header');
  function updateHeader() {
    header?.classList.toggle('scrolled', window.scrollY > 10);
  }
  window.addEventListener('scroll', updateHeader, { passive: true });
  updateHeader();

  /* Scroll animations (IntersectionObserver) */
  const animObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = parseInt(entry.target.dataset.delay || '0', 10);
        setTimeout(() => entry.target.classList.add('is-visible'), delay * 100);
        animObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('[data-animate]').forEach(el => animObserver.observe(el));

  /* Animated counters */
  const countObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const stat = entry.target;
      const numEl = stat.querySelector('[data-target]');
      if (!numEl) return;
      const target = parseInt(numEl.dataset.target, 10);
      const duration = 1500;
      const start = performance.now();

      function tick(now) {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
        numEl.textContent = Math.floor(eased * target);
        if (progress < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
      countObserver.unobserve(stat);
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('[data-animate="count"]').forEach(el => countObserver.observe(el));

  /* Chatbot widget */
  const chatbot = document.getElementById('chatbot-widget');
  const chatbotToggle = chatbot?.querySelector('.chatbot-toggle');

  chatbotToggle?.addEventListener('click', () => {
    const isOpen = chatbot.classList.toggle('open');
    chatbotToggle.setAttribute('aria-expanded', String(isOpen));
    chatbot.setAttribute('aria-hidden', String(!isOpen));
  });

  document.addEventListener('click', (e) => {
    if (chatbot?.classList.contains('open') && !chatbot.contains(e.target)) {
      chatbot.classList.remove('open');
      chatbotToggle?.setAttribute('aria-expanded', 'false');
      chatbot.setAttribute('aria-hidden', 'true');
    }
  });

  /* Footer year */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* Form placeholder handler */
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
})();
