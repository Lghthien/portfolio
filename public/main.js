(async function () {
  /* ── 0. RENDER FROM DATABASE ── */
  if (typeof PortfolioDB !== 'undefined') {
    try {
      await PortfolioDB.render();
    } catch (err) {
      console.error('Failed to load portfolio data from backend:', err);
    }
  }

  /* ── 0.1 HIDE LOADER ── */
  const loader = document.getElementById('loader');
  if (loader) {
    loader.style.opacity = '0';
    setTimeout(() => loader.remove(), 500);
  }

  /* ── 1. SCROLL REVEAL ── */
  const STAGGER = 0.09;
  const GROUPS = [
    { sel: '.stat',        stagger: STAGGER, cap: 0.28 },
    { sel: '.edu-card',    stagger: 0,       cap: 0    },
    { sel: '.skill-group', stagger: STAGGER, cap: 0.5  },
    { sel: '.exp-card:not([style*="display:none"])', stagger: STAGGER, cap: 0.28 },
    { sel: '.proj-card',   stagger: STAGGER, cap: 0.28 },
    { sel: '.school-card', stagger: 0.07,    cap: 0.32 },
    { sel: '.contact-box', stagger: 0,       cap: 0    },
  ];
  GROUPS.forEach(({ sel, stagger, cap }) => {
    document.querySelectorAll(sel).forEach((el, i) => {
      el.classList.add('reveal');
      const d = Math.min(i * stagger, cap);
      if (d > 0) el.style.transitionDelay = d + 's';
    });
  });
  const revObs = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('.reveal').forEach(el => revObs.observe(el));

  /* ── 2. SCROLL SPY NAV ── */
  const sections = [...document.querySelectorAll('section[id]')];
  const navLinks = [...document.querySelectorAll('.nav-links a[href^="#"]')];
  const spyObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      navLinks.forEach(a => a.classList.remove('active'));
      const link = navLinks.find(a => a.getAttribute('href') === '#' + e.target.id);
      if (link) link.classList.add('active');
    });
  }, { threshold: 0.35 });
  sections.forEach(s => spyObs.observe(s));

  /* ── 3. STATS COUNTER ── */
  function countUp(el, target, isFloat, suffix) {
    const dur = 1500, start = performance.now();
    const tick = (now) => {
      const p = Math.min((now - start) / dur, 1);
      const v = (1 - Math.pow(1 - p, 3)) * target;
      el.textContent = (isFloat ? v.toFixed(1) : Math.floor(v)) + suffix;
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }
  const cntObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const numEl = e.target.querySelector('.stat-num');
      const raw = numEl.textContent;
      const num = parseFloat(raw);
      if (!isNaN(num)) {
        const suffix = raw.replace(/[\d.]/g, '');
        countUp(numEl, num, raw.includes('.'), suffix);
        cntObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.6 });
  document.querySelectorAll('.stat').forEach(s => cntObs.observe(s));

  /* ── 4. BACK TO TOP ── */
  const btt = document.getElementById('back-to-top');
  window.addEventListener('scroll', () => {
    btt.classList.toggle('visible', window.scrollY > 480);
  }, { passive: true });
  btt.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  /* ── 5. HERO MOUSE GLOW ── */
  const heroEl = document.querySelector('.hero');
  const glowEl = document.querySelector('.hero-glow');
  if (heroEl && glowEl) {
    heroEl.addEventListener('mousemove', (e) => {
      const r = heroEl.getBoundingClientRect();
      const x = ((e.clientX - r.left) / r.width * 100).toFixed(1);
      const y = ((e.clientY - r.top)  / r.height * 100).toFixed(1);
      glowEl.style.background =
        `radial-gradient(480px circle at ${x}% ${y}%, rgba(88,166,255,0.11) 0%, transparent 65%)`;
    });
    heroEl.addEventListener('mouseleave', () => { glowEl.style.background = ''; });
  }
})();
