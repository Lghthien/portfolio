// =============================================
// PORTFOLIO DATABASE — MongoDB Atlas Engine
// =============================================
// Backend:  server.js (Express + Mongoose)
// API base: /api/portfolio
// Auth:     /api/auth/login  | /api/auth/logout
// =============================================

const PortfolioDB = (() => {
  const API_BASE    = '/api';
  const TOKEN_KEY   = 'lght_admin_token';

  // ─────────────────────────────────────────
  // IN-MEMORY CACHE (populated on first load)
  // ─────────────────────────────────────────
  let _cache = null;   // holds the portfolio object
  let _ready = false;  // true once first fetch completes

  // ─────────────────────────────────────────
  // INTERNAL FETCH HELPERS
  // ─────────────────────────────────────────
  function _token()  { return localStorage.getItem(TOKEN_KEY); }
  function _headers() {
    const h = { 'Content-Type': 'application/json' };
    const t = _token();
    if (t) h['x-auth-token'] = t;
    return h;
  }

  async function _get(path) {
    const r = await fetch(API_BASE + path, { headers: _headers() });
    if (!r.ok) throw new Error(await r.text());
    return r.json();
  }

  async function _put(path, body) {
    const r = await fetch(API_BASE + path, {
      method: 'PUT', headers: _headers(),
      body: JSON.stringify(body)
    });
    if (!r.ok) throw new Error(await r.text());
    return r.json();
  }

  async function _post(path, body) {
    const r = await fetch(API_BASE + path, {
      method: 'POST', headers: _headers(),
      body: JSON.stringify(body)
    });
    if (!r.ok) throw new Error(await r.text());
    return r.json();
  }

  // ─────────────────────────────────────────
  // PUBLIC DATA API (used by admin.js + index)
  // ─────────────────────────────────────────

  /**
   * Load portfolio from MongoDB and cache it.
   * Returns the data object. Always await this.
   */
  async function fetchData() {
    _cache = await _get('/portfolio');
    _ready = true;
    return _cache;
  }

  /**
   * Sync-read from cache (for admin.js areas that call getData).
   * Returns cached copy; returns empty shell if not yet fetched.
   */
  function getData() {
    return _cache || {};
  }

  /**
   * Save the full portfolio object to MongoDB Atlas.
   */
  async function saveData(data) {
    _cache = { ...data };
    return _put('/portfolio', data);
  }

  /**
   * Reset portfolio to server-side defaults.
   */
  async function resetData() {
    await _post('/portfolio/reset', {});
    _cache = await _get('/portfolio');
    return _cache;
  }

  // ─────────────────────────────────────────
  // AUTH
  // ─────────────────────────────────────────

  async function login(username, password) {
    try {
      const res = await _post('/auth/login', { username, password });
      if (res.token) {
        localStorage.setItem(TOKEN_KEY, res.token);
        return true;
      }
    } catch (_) {}
    return false;
  }

  async function logout() {
    try { await _post('/auth/logout', {}); } catch (_) {}
    localStorage.removeItem(TOKEN_KEY);
  }

  async function isLoggedIn() {
    const token = _token();
    if (!token) return false;
    try {
      const res = await _post('/auth/verify', {});
      return res.valid === true;
    } catch (_) {
      return false;
    }
  }

  async function changePassword(currentPass, newPass) {
    try {
      await _post('/auth/change-password', {
        currentPassword: currentPass,
        newPassword: newPass
      });
      return true;
    } catch (_) {
      return false;
    }
  }

  // ─────────────────────────────────────────
  // RENDERING — called on index.html load
  // ─────────────────────────────────────────
  async function render() {
    const data = await fetchData();
    _renderHero(data.hero);
    _renderStats(data.stats);
    _renderEducation(data.education);
    _renderSkills(data.skills);
    _renderExperience(data.experience);
    _renderProjects(data.projects);
    _renderSchoolProjects(data.schoolProjects);
    _renderContact(data.hero);
  }

  function _renderHero(h) {
    const set = (sel, val, prop = 'textContent') => { const el = document.querySelector(sel); if (el) el[prop] = val; };
    const setAttr = (sel, attr, val) => { const el = document.querySelector(sel); if (el) el[attr] = val; };

    set('.hero-role', h.role);
    set('.hero-body h1', h.name);
    set('.hero-bio', h.bio);

    const techEl = document.querySelector('.hero-tech');
    if (techEl) techEl.innerHTML = h.techTags.map(t => `<span class="hero-tech-tag">${t}</span>`).join('');

    setAttr('.btn-primary', 'href', `mailto:${h.email}`);
    setAttr('.btn-ghost', 'href', h.github);

    const avatar = document.querySelector('.avatar img');
    if (avatar) avatar.src = h.avatar;

    const badge = document.querySelector('.nav-badge');
    if (badge) badge.style.display = h.openToWork ? '' : 'none';
  }

  function _renderStats(stats) {
    const el = document.querySelector('.stats');
    if (!el) return;
    el.innerHTML = stats.map(s =>
      `<div class="stat"><div class="stat-num">${s.num}</div><div class="stat-label">${s.label}</div></div>`
    ).join('');
  }

  function _renderEducation(edu) {
    const el = document.querySelector('.edu-card');
    if (!el) return;
    el.innerHTML = `
      <div>
        <div class="edu-school">${edu.school}</div>
        <div class="edu-major">${edu.major} &nbsp;·&nbsp; ${edu.years}</div>
      </div>
      <div class="edu-right">
        <div class="edu-gpa">${edu.gpa} / 10</div>
        <div class="edu-gpa-label">GPA</div>
        <a href="${edu.transcriptUrl}" target="_blank" class="edu-transcript">📄 View transcript</a>
      </div>`;
  }

  function _renderSkills(skills) {
    const el = document.querySelector('.skill-grid');
    if (!el) return;
    el.innerHTML = skills.map(g => `
      <div class="skill-group">
        <div class="sg-head">${g.category}</div>
        <div class="tags">${g.tags.map(t => `<span class="tag ${t.color || ''}">${t.label}</span>`).join('')}</div>
      </div>`).join('');
  }

  function _renderExperience(experience) {
    const el = document.querySelector('.timeline');
    if (!el) return;
    el.innerHTML = experience.map(exp => `
      <div class="exp-card">
        <div class="exp-card-header">
          <div class="exp-header-left">
            <div class="exp-date">${exp.date}</div>
            <div class="exp-title">${exp.title}</div>
          </div>
          <span class="exp-badge ${exp.badge}">${exp.badgeLabel}</span>
        </div>
        <div class="exp-card-body">
          <ul class="exp-bullets">${exp.bullets.map(b => `<li>${b}</li>`).join('')}</ul>
          <div class="exp-links">${exp.links.map(l => `<a href="${l.url}" target="_blank" class="exp-link">⎇ ${l.label}</a>`).join('')}</div>
        </div>
      </div>`).join('');
  }

  function _renderProjects(projects) {
    const el = document.querySelector('.proj-grid');
    if (!el) return;
    el.innerHTML = projects.map(p => `
      <div class="proj-card">
        <div class="proj-card-top"><div class="proj-icon">${p.icon}</div></div>
        <div class="proj-name">${p.name}</div>
        <div class="proj-desc">${p.desc}</div>
        <div class="tags" style="margin-bottom:14px;">${p.tags.map(t => `<span class="tag ${t.color || ''}">${t.label}</span>`).join('')}</div>
        <div class="proj-footer"><a href="${p.github}" target="_blank" class="proj-gh">↗ View on GitHub</a></div>
      </div>`).join('');
  }

  function _renderSchoolProjects(projects) {
    const el = document.querySelector('.school-grid');
    if (!el) return;
    el.innerHTML = projects.map(p => `
      <div class="school-card">
        <div class="school-card-header">
          <span class="school-icon">${p.icon}</span>
          <span class="school-subject">${p.subject}</span>
        </div>
        <div class="school-name">${p.name}</div>
        <div class="school-desc">${p.desc}</div>
        <div class="tags" style="margin-bottom:4px;">${p.tags.map(t => `<span class="tag ${t.color || ''}">${t.label}</span>`).join('')}</div>
        <div class="school-footer"><a href="${p.github}" target="_blank" class="school-gh">↗ ${p.githubLabel || p.name}</a></div>
      </div>`).join('');
  }

  function _renderContact(h) {
    const emailLinks = document.querySelectorAll('.contact-links a[href^="mailto"]');
    emailLinks.forEach(el => el.href = `mailto:${h.email}`);
    const phoneLinks = document.querySelectorAll('.contact-links a[href^="tel"]');
    phoneLinks.forEach(el => el.href = `tel:${h.phone}`);
  }

  // ─────────────────────────────────────────
  // PUBLIC API
  // ─────────────────────────────────────────
  return {
    // Async (MongoDB)
    fetchData, saveData, resetData,
    login, logout, isLoggedIn, changePassword,
    render,
    // Sync cache read (for admin.js)
    getData
  };
})();
