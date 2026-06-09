/* Ramos Solution SAS — Main JS v3
   Premium dot-mesh hero, scroll progress, reveal animations, modals
   ======================================== */

(function () {
  'use strict';

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const isMobile = window.matchMedia('(max-width: 767.98px), (pointer: coarse)');

  const i18n = {
    en: {
      title: 'Ramos Solutions — Automation, Software and AI in Colombia',
      description: 'Ramos Solutions turns manual processes into web systems, apps, dashboards and AI agents. Functional demos in weeks for companies in Colombia and LatAm.',
      html: {
        '#hero-title': 'Stop running your company with <span class="gradient-text sweep">Excel, WhatsApp and memory.</span>',
        '.hero-proof': '<strong>Functional demo in 3 weeks.</strong> With your real process. No endless PowerPoint.',
        '.footer-love': 'Operational software, automation and <span class="gradient-text">AI</span> for companies that want to raise the standard.'
      },
      selectors: {
        '.skip-link': 'Skip to content',
        '.nav-list li:nth-child(1) a': 'Problems',
        '.nav-list li:nth-child(2) a': '3-week method',
        '.nav-list li:nth-child(3) a': 'Cases',
        '.nav-list li:nth-child(4) a': 'Processes',
        '.nav-list li:nth-child(5) a': 'What we don’t do',
        '.nav-list li:nth-child(6) a': 'Diagnosis',
        '.hero-badge span:nth-child(2)': 'Operational software and AI for companies tired of improvising',
        '#hero-title': 'Stop running your company with Excel, WhatsApp and memory.',
        '.hero-lead': 'Ramos Solutions turns manual processes into web systems, apps, dashboards and AI agents your team can test in weeks, not months.',
        '.hero-proof': 'Functional demo in 3 weeks. With your real process. No endless PowerPoint.',
        '.hero-actions .btn:nth-child(1)': 'Book a 30-min diagnosis',
        '.hero-actions .btn:nth-child(2)': 'See real cases',
        '.hero-trust span:nth-child(1)': 'Colombia · LatAm',
        '.hero-trust span:nth-child(2)': 'Software + AI + Integrations',
        '.hero-trust span:nth-child(3)': 'Demo before scaling',
        '.mobile-data-card--one strong': 'Live data',
        '.mobile-data-card--two strong': 'AI handles it',
        '.mobile-data-card--three strong': 'Real control',
        '#problemas .section-tag': 'The signal',
        '#pain-title': 'You do not need “digital transformation”. You need to stop repeating the same work by hand.',
        '#problemas .section-sub': 'The need appears when the business grows, but operations still depend on people chasing data.',
        '.symptom-card:nth-child(1) h3': 'The report depends on one person',
        '.symptom-card:nth-child(1) p': 'If someone is out, nobody knows what sold, what is missing or which customer is waiting.',
        '.symptom-card:nth-child(2) h3': 'WhatsApp is your operating system',
        '.symptom-card:nth-child(2) p': 'Orders, support, approvals and complaints live in chats that are impossible to audit.',
        '.symptom-card:nth-child(3) h3': 'Every team has “their Excel”',
        '.symptom-card:nth-child(3) p': 'Sales, operations and leadership look at different numbers and debate which one is real.',
        '.symptom-card:nth-child(4) h3': 'Your team knows what to do, but the system does not',
        '.symptom-card:nth-child(4) p': 'Business rules live in the heads of key people, not in a platform.',
        '.symptom-card:nth-child(5) h3': 'AI became conversation, not outcome',
        '.symptom-card:nth-child(5) p': 'There are beautiful demos, but nothing connected to your data, roles, approvals and exceptions.',
        '.symptom-card:nth-child(6) h3': 'If you checked two, there is an opportunity',
        '.symptom-card:nth-child(6) p': 'That is the new standard: turning operational friction into software that works with you.',
        '.symptom-card:nth-child(6) a': 'Find what to automate',
        '#transformacion .section-tag': 'The transformation',
        '#diagram-title': 'From operational chaos to a flow everyone wants to follow.',
        '#transformacion .section-sub': 'We do not sell technology because it is trendy. We design the system that makes your operation visible, measurable and repeatable.',
        '.transform-column--before .transform-label': 'Before',
        '.transform-column--before h3': 'Scattered data. Slow decisions.',
        '.transform-column--before li:nth-child(1)': 'Excel, chats, emails and CRM disconnected.',
        '.transform-column--before li:nth-child(2)': 'Manual reports that arrive late.',
        '.transform-column--before li:nth-child(3)': 'Errors that are hard to trace.',
        '.transform-column--before li:nth-child(4)': 'Leadership asking “where does this stand?”.',
        '.transform-core text': 'Rules + data + AI when useful',
        '.transform-column--after .transform-label': 'After',
        '.transform-column--after h3': 'One flow. Visible control.',
        '.transform-column--after li:nth-child(1)': 'Clear inputs: WhatsApp, CRM, ERP, forms.',
        '.transform-column--after li:nth-child(2)': 'Rules, owners and automatic alerts.',
        '.transform-column--after li:nth-child(3)': 'Dashboards with current data.',
        '.transform-column--after li:nth-child(4)': 'AI integrated only where it creates real advantage.',
        '#metodo .section-tag': '3-week method',
        '#proceso-title': 'Test it first. Then decide whether to scale.',
        '#metodo .section-sub': 'The exclusivity is not in sounding smart. It is in reducing risk before asking for a major investment.',
        '.method-timeline article:nth-child(1) span': 'Day 1–3',
        '.method-timeline article:nth-child(1) h3': 'Process map',
        '.method-timeline article:nth-child(1) p': 'We see who does what, where data gets lost and which manual task is costing reputation, time or money.',
        '.method-timeline article:nth-child(2) span': 'Week 1',
        '.method-timeline article:nth-child(2) h3': 'Flow design',
        '.method-timeline article:nth-child(2) p': 'We define screens, rules, integrations, permissions and the points where AI actually helps.',
        '.method-timeline article:nth-child(3) span': 'Week 2–3',
        '.method-timeline article:nth-child(3) h3': 'Functional demo',
        '.method-timeline article:nth-child(3) p': 'We build something usable so your team can touch it, critique it and validate it. It is not a presentation.',
        '.method-timeline article:nth-child(4) span': 'Then',
        '.method-timeline article:nth-child(4) h3': 'Production with control',
        '.method-timeline article:nth-child(4) p': 'Cloud, security, roles, monitoring, support and improvements to turn the demo into a real system.',
        '#casos .section-tag': 'Real proof',
        '#projects-title': 'What builds trust is not promising. It is building.',
        '#casos .section-sub': 'We show real products and real states. No invented logos. No fictional testimonials.',
        '.project-card__label': 'Marketplace + Ticketing + QR Access Control',
        '.project-card__desc': 'Platform to organize events in Colombia and Latin America: discovery, digital ticketing, QR access control and sales dashboard.',
        '.project-facts li:nth-child(1)': 'Public product: konvoka.co',
        '.project-facts li:nth-child(2)': 'Complete flow: publishing, purchase, ticket and validation.',
        '.project-facts li:nth-child(3)': 'Proof that Ramos Solutions builds product, not just talk.',
        '.project-card__link': 'Visit konvoka.co ↗',
        '.lab-card .project-card__label': 'In the lab',
        '#lab-title': 'Signal & Grain',
        '.lab-card p': 'Private product in development. We show it as a real pipeline, not as a finished case. More details when it is ready for public validation.',
        '#procesos .section-tag': 'Processes we automate',
        '#servicios-title': 'You do not buy “software”. You buy relief for a painful part of your company.',
        '.process-grid .card:nth-child(1) h3': 'Excel operations',
        '.process-grid .card:nth-child(1) p': 'Web apps with roles, flows, audit trails and centralized data to replace critical spreadsheets.',
        '.process-grid .card:nth-child(1) a': 'Automate my Excel →',
        '.process-grid .card:nth-child(2) h3': 'WhatsApp support',
        '.process-grid .card:nth-child(2) p': 'AI agents connected to your rules, knowledge base and human escalation.',
        '.process-grid .card:nth-child(2) a': 'Automate support →',
        '.process-grid .card:nth-child(3) h3': 'Field orders',
        '.process-grid .card:nth-child(3) p': 'Offline apps for sales reps, ERP sync and real-time inventory.',
        '.process-grid .card:nth-child(3) a': 'Digitize orders →',
        '.process-grid .card:nth-child(4) h3': 'Management reports',
        '.process-grid .card:nth-child(4) p': 'Dashboards connected to sales, inventory, finance and operations. No Friday copy-paste.',
        '.process-grid .card:nth-child(4) a': 'Eliminate manual reports →',
        '.process-grid .card:nth-child(5) h3': 'Disconnected systems',
        '.process-grid .card:nth-child(5) p': 'Integrations between CRM, ERP, databases, forms and internal tools.',
        '.process-grid .card:nth-child(5) a': 'Connect my stack →',
        '.process-grid .card:nth-child(6) h3': 'Fragile infrastructure',
        '.process-grid .card:nth-child(6) p': 'Cloud, backups, monitoring, access, logs and reproducible deployments so you can sleep better.',
        '.process-grid .card:nth-child(6) a': 'Review infrastructure →',
        '#principios .section-tag': 'Real exclusivity',
        '#principios-title': 'We are not for everyone. And that protects your project.',
        '#principios .section-sub': 'Trust is built by saying no when technology does not create advantage.',
        '.principles-grid article:nth-child(1) strong': 'We do not sell AI because it is trendy.',
        '.principles-grid article:nth-child(1) span': 'If a simple rule solves it better, we use the rule.',
        '.principles-grid article:nth-child(2) strong': 'We do not start with endless consulting.',
        '.principles-grid article:nth-child(2) span': 'First map, then demo, then decision.',
        '.principles-grid article:nth-child(3) strong': 'We do not build software nobody uses.',
        '.principles-grid article:nth-child(3) span': 'The real user validates before scaling.',
        '.principles-grid article:nth-child(4) strong': 'We do not disappear after deploy.',
        '.principles-grid article:nth-child(4) span': 'Production includes support, monitoring and improvement.',
        '.principles-grid article:nth-child(5) strong': 'We do not inflate scope to look enterprise.',
        '.principles-grid article:nth-child(5) span': 'We prioritize the flow that unlocks value first.',
        '.principles-grid article:nth-child(6) strong': 'We do not invent credibility.',
        '.principles-grid article:nth-child(6) span': 'We show what exists and clarify what is in development.',
        '.faq-section .section-tag': 'What people ask before deciding',
        '#faq-title': 'Answers to decide without smoke.',
        '.faq-list details:nth-child(1) summary': 'What if my company is not ready for AI?',
        '.faq-list details:nth-child(1) p': 'Perfect. The diagnosis separates simple automation, necessary integration and useful AI. We do not force AI where it creates no advantage.',
        '.faq-list details:nth-child(2) summary': 'Does the functional demo replace planning?',
        '.faq-list details:nth-child(2) p': 'No. It grounds planning. We plan enough to build something usable and validate with real users before scaling investment.',
        '.faq-list details:nth-child(3) summary': 'Do you work with existing systems?',
        '.faq-list details:nth-child(3) p': 'Yes. Most real operations mix Excel, WhatsApp, CRM, ERP, databases and internal tools. The work is making them talk to each other.',
        '.faq-list details:nth-child(4) summary': 'How involved does my team need to be?',
        '.faq-list details:nth-child(4) p': 'Enough to map rules, validate screens and test the demo. Your business knowledge is part of the system; our job is translating it into software.',
        '#cta-title': 'You do not need another meeting about innovation. You need to see your process working.',
        '.cta-desc': 'Tell us which manual task steals time from your team. In 30 minutes we will tell you whether we can turn it into software, what needs to be integrated and what the first demo could be.',
        '.cta-section .btn': 'Book a 30-min diagnosis',
        '.cta-micro': 'If we do not see a clear way to help, we will say it on the first call.',
        '#contacto .section-tag': 'Diagnosis',
        '#contacto-title': 'Tell us which process you want to stop doing by hand.',
        '.contacto-item:nth-child(1) strong': 'Email',
        '.contacto-item:nth-child(2) strong': 'Base',
        '.contacto-item:nth-child(2) span:nth-child(2)': 'Colombia · Remote work for LatAm',
        '.contacto-item:nth-child(3) strong': 'First conversation promise',
        '.contacto-item:nth-child(3) span:nth-child(2)': 'Clarity on viability, integrations and the next possible demo.',
        'label[for="nombre"]': 'Name *',
        'label[for="email"]': 'Email *',
        'label[for="empresa"]': 'Company',
        'label[for="herramientas"]': 'What tools do you use today?',
        'label[for="mensaje"]': 'Which manual process is consuming the most time? *',
        '.contacto-form button': 'Send process for diagnosis',
        '.form-note': 'Opens your email to send the case. No spam. If we are not the best option, we will tell you.',
        '.footer-inner p:nth-child(1)': '© 2026 Ramos Solutions S.A.S. Bogotá, Colombia.',
        '.footer-love': 'Operational software, automation and AI for companies that want to raise the standard.'
      },
      attrs: {
        '.menu-toggle': { 'aria-label': 'Open menu' },
        '#primary-nav': { 'aria-label': 'Primary navigation' },
        '.logo': { 'aria-label': 'Ramos Solutions — Home' },
        '.hero-trust': { 'aria-label': 'Trust signals' },
        '.contacto-form': { 'aria-label': 'Diagnosis form' },
        '#nombre': { placeholder: 'Your name', name: 'name' },
        '#empresa': { placeholder: 'Your company name', name: 'company' },
        '#herramientas': { placeholder: 'E.g. Excel, WhatsApp, Siigo, Odoo, HubSpot, Drive...', name: 'tools' },
        '#mensaje': { placeholder: "E.g. 'My team loses 3 hours a day copying data from Excel to the CRM...'", name: 'message' }
      }
    },
    es: {
      title: 'Ramos Solutions — Automatización, Software e IA en Colombia',
      description: 'Ramos Solutions convierte procesos manuales en sistemas web, apps, dashboards y agentes de IA. Demo funcional en semanas para empresas en Colombia y LatAm.',
      html: {},
      selectors: {
        '.skip-link': 'Saltar al contenido', '.nav-list li:nth-child(1) a': 'Problemas', '.nav-list li:nth-child(2) a': 'Método 3 semanas', '.nav-list li:nth-child(3) a': 'Casos', '.nav-list li:nth-child(4) a': 'Procesos', '.nav-list li:nth-child(5) a': 'Qué no hacemos', '.nav-list li:nth-child(6) a': 'Diagnóstico',
        '.hero-badge span:nth-child(2)': 'Software operativo e IA para empresas que ya se cansaron de improvisar', '#hero-title': 'Deja de operar tu empresa a punta de Excel, WhatsApp y memoria.', '.hero-lead': 'Ramos Solutions convierte procesos manuales en sistemas web, apps, dashboards y agentes de IA que tu equipo puede probar en semanas, no en meses.', '.hero-proof': 'Demo funcional en 3 semanas. Con tu proceso real. Sin PowerPoint eterno.', '.hero-actions .btn:nth-child(1)': 'Agendar diagnóstico de 30 min', '.hero-actions .btn:nth-child(2)': 'Ver casos reales',
        '#pain-title': 'No necesitas “transformación digital”. Necesitas dejar de repetir lo mismo a mano.', '#problemas .section-sub': 'La necesidad aparece cuando el negocio crece, pero la operación sigue dependiendo de personas persiguiendo datos.', '.symptom-card:nth-child(6) a': 'Encontrar qué automatizar',
        '#diagram-title': 'Del caos operativo a un flujo que todos quieren seguir.', '#proceso-title': 'Primero lo pruebas. Luego decides si escala.', '#projects-title': 'Lo que genera confianza no es prometer. Es construir.', '#servicios-title': 'No compras “software”. Compras que una parte de tu empresa deje de doler.', '#principios-title': 'No somos para todos. Y eso protege tu proyecto.', '#faq-title': 'Respuestas para tomar una decisión sin humo.', '#cta-title': 'No necesitas otra reunión sobre innovación. Necesitas ver tu proceso funcionando.', '#contacto-title': 'Cuéntanos qué proceso quieres dejar de hacer a mano.', '.cta-section .btn': 'Agendar diagnóstico de 30 min', '.footer-love': 'Software operativo, automatización e IA para empresas que quieren subir el estándar.'
      },
      attrs: { '.menu-toggle': { 'aria-label': 'Abrir menú' }, '#primary-nav': { 'aria-label': 'Navegación principal' }, '.logo': { 'aria-label': 'Ramos Solutions — Inicio' }, '.hero-trust': { 'aria-label': 'Señales de confianza' }, '.contacto-form': { 'aria-label': 'Formulario de diagnóstico' }, '#nombre': { placeholder: 'Tu nombre', name: 'nombre' }, '#empresa': { placeholder: 'Nombre de tu empresa', name: 'empresa' }, '#herramientas': { placeholder: 'Ej: Excel, WhatsApp, Siigo, Odoo, HubSpot, Drive...', name: 'herramientas' }, '#mensaje': { placeholder: "Ej: 'Mi equipo pierde 3 horas diarias copiando datos de Excel al CRM...'", name: 'mensaje' } }
    }
  };
  let currentLang = 'en';
  let originalText = {};
  let originalHtml = {};
  let originalAttrs = {};
  function captureOriginalLanguage() {
    const selectors = new Set(Object.keys(i18n.en.selectors));
    Object.keys(i18n.en.html || {}).forEach(selector => selectors.add(selector));
    selectors.forEach(selector => {
      const el = document.querySelector(selector);
      if (el) { originalText[selector] = el.textContent; originalHtml[selector] = el.innerHTML; }
    });
    Object.keys(i18n.en.attrs || {}).forEach(selector => {
      const el = document.querySelector(selector);
      if (!el) return;
      originalAttrs[selector] = {};
      Object.keys(i18n.en.attrs[selector]).forEach(name => originalAttrs[selector][name] = el.getAttribute(name) || '');
    });
  }
  function applyLanguage(lang) {
    currentLang = lang === 'es' ? 'es' : 'en';
    const dict = i18n[currentLang];
    document.documentElement.lang = currentLang === 'es' ? 'es-CO' : 'en-US';
    document.title = dict.title;
    document.querySelector('meta[name="description"]')?.setAttribute('content', dict.description);
    const sourceSelectors = currentLang === 'es' ? i18n.en.selectors : dict.selectors;
    Object.keys(sourceSelectors).forEach((selector) => {
      const text = dict.selectors[selector] ?? originalText[selector];
      if (typeof text !== 'undefined') document.querySelectorAll(selector).forEach(el => { el.textContent = text; });
    });
    const sourceHtml = currentLang === 'es' ? i18n.en.html : (dict.html || {});
    Object.keys(sourceHtml || {}).forEach((selector) => {
      const html = (dict.html || {})[selector] ?? originalHtml[selector];
      if (typeof html !== 'undefined') document.querySelectorAll(selector).forEach(el => { el.innerHTML = html; });
    });
    const sourceAttrs = currentLang === 'es' ? i18n.en.attrs : (dict.attrs || {});
    Object.keys(sourceAttrs || {}).forEach((selector) => {
      const attrs = (dict.attrs || {})[selector] || originalAttrs[selector] || {};
      document.querySelectorAll(selector).forEach(el => Object.entries(attrs).forEach(([name, value]) => el.setAttribute(name, value)));
    });
    document.querySelectorAll('.language-switch__button').forEach(button => {
      const active = button.dataset.lang === currentLang;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-pressed', String(active));
    });
  }
  function initLanguageSwitch() {
    captureOriginalLanguage();
    document.querySelectorAll('.language-switch__button').forEach(button => button.addEventListener('click', () => applyLanguage(button.dataset.lang)));
    applyLanguage('en');
  }


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
      menuToggle?.setAttribute('aria-label', isOpen ? (currentLang === 'es' ? 'Cerrar menú' : 'Close menu') : (currentLang === 'es' ? 'Abrir menú' : 'Open menu'));
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
    if (!form) return;

    form.addEventListener('submit', (e) => {
      if (!form.checkValidity()) return;
      e.preventDefault();

      const data = new FormData(form);
      const subject = encodeURIComponent(currentLang === 'es' ? 'Diagnóstico Ramos Solutions — proceso manual' : 'Ramos Solutions diagnosis — manual process');
      const body = encodeURIComponent((currentLang === 'es' ? [
        'Nombre: ' + (data.get('nombre') || ''),
        'Email: ' + (data.get('email') || ''),
        'Empresa: ' + (data.get('empresa') || ''),
        'Herramientas actuales: ' + (data.get('herramientas') || ''),
        '',
        'Proceso manual a diagnosticar:',
        data.get('mensaje') || ''
      ] : [
        'Name: ' + (data.get('name') || ''),
        'Email: ' + (data.get('email') || ''),
        'Company: ' + (data.get('company') || ''),
        'Current tools: ' + (data.get('tools') || ''),
        '',
        'Manual process to diagnose:',
        data.get('message') || ''
      ]).join('\n'));

      window.location.href = 'mailto:contacto@ramossolutions.co?subject=' + subject + '&body=' + body;
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
    initLanguageSwitch();
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
