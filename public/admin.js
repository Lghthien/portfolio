// ── Helpers ──────────────────────────────────────
const $ = id => document.getElementById(id);
const val = id => $(id).value.trim();

let editingId = null;

function toast(msg, isErr = false) {
  const t = $('toast');
  t.textContent = msg;
  t.className = 'toast' + (isErr ? ' error' : '') + ' show';
  setTimeout(() => t.className = 'toast', 2800);
}

function uid() { return '_' + Math.random().toString(36).slice(2,9); }

function parseTags(text) {
  return text.split('\n').map(l => l.trim()).filter(Boolean).map(l => {
    const [label, color = ''] = l.split(':').map(s => s.trim());
    return { label, color };
  });
}

function tagsToText(tags) {
  return tags.map(t => t.color ? `${t.label}:${t.color}` : t.label).join('\n');
}

// ── Auth ─────────────────────────────────────────
(async () => {
  const loggedIn = await PortfolioDB.isLoggedIn();
  if (loggedIn) showApp();
})();

$('login-btn').onclick = async () => {
  const ok = await PortfolioDB.login(val('login-user'), val('login-pass'));
  if (ok) { $('login-err').style.display = 'none'; showApp(); }
  else { $('login-err').style.display = 'block'; }
};
$('login-pass').addEventListener('keydown', e => { if (e.key === 'Enter') $('login-btn').click(); });
$('login-user').addEventListener('keydown', e => { if (e.key === 'Enter') $('login-pass').focus(); });

$('logout-btn').onclick = async e => {
  e.preventDefault();
  await PortfolioDB.logout();
  location.reload();
};

async function showApp() {
  $('login-screen').style.display = 'none';
  $('app').style.display = 'flex';
  await loadAllSections();
}

// ── Navigation ───────────────────────────────────
document.querySelectorAll('.nav-item[data-page]').forEach(btn => {
  btn.onclick = () => {
    document.querySelectorAll('.nav-item').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById('page-' + btn.dataset.page).classList.add('active');
  };
});

// ── Modals ───────────────────────────────────────
document.querySelectorAll('[data-close]').forEach(el => {
  el.onclick = () => closeModal(el.dataset.close);
});
document.querySelectorAll('.modal-backdrop').forEach(bd => {
  bd.onclick = e => { if (e.target === bd) closeModal(bd.id); };
});

function openModal(id) { $(id).classList.add('open'); }
function closeModal(id) { $(id).classList.remove('open'); editingId = null; }

// ── Load All ─────────────────────────────────────
async function loadAllSections() {
  const d = await PortfolioDB.fetchData();
  loadHero(d.hero);
  loadStats(d.stats);
  loadEdu(d.education);
  loadSkills(d.skills);
  loadExp(d.experience);
  loadProjects(d.projects);
  loadSchool(d.schoolProjects);
}

// ── HERO ─────────────────────────────────────────
function loadHero(h) {
  $('h-name').value = h.name;
  $('h-role').value = h.role;
  $('h-bio').value = h.bio;
  $('h-email').value = h.email;
  $('h-phone').value = h.phone || '';
  $('h-github').value = h.github;
  $('h-avatar').value = h.avatar;
  $('h-open').checked = h.openToWork;
  renderTagEditor(h.techTags);
}

let currentTags = [];
function renderTagEditor(tags) {
  currentTags = [...tags];
  const editor = $('h-tags-editor');
  const input = $('h-tag-input');
  editor.querySelectorAll('.tag-chip').forEach(c => c.remove());
  currentTags.forEach((tag, i) => {
    const chip = document.createElement('span');
    chip.className = 'tag-chip';
    chip.innerHTML = `${tag} <span class="tag-chip-del" data-i="${i}">✕</span>`;
    editor.insertBefore(chip, input);
  });
  editor.querySelectorAll('.tag-chip-del').forEach(btn => {
    btn.onclick = () => { currentTags.splice(+btn.dataset.i, 1); renderTagEditor(currentTags); };
  });
}
$('h-tag-input').addEventListener('keydown', e => {
  if (e.key === 'Enter' && e.target.value.trim()) {
    currentTags.push(e.target.value.trim()); e.target.value = '';
    renderTagEditor(currentTags); e.preventDefault();
  }
});

$('save-hero').onclick = async () => {
  const d = PortfolioDB.getData();
  d.hero = { ...d.hero, name: val('h-name'), role: val('h-role'), bio: val('h-bio'),
    email: val('h-email'), phone: val('h-phone'), github: val('h-github'),
    avatar: val('h-avatar'), openToWork: $('h-open').checked, techTags: [...currentTags] };
  try {
    await PortfolioDB.saveHero(d.hero);
    toast('✅ Hero saved!');
  } catch(e) { toast('❌ Save failed: ' + e.message, true); }
};

// ── STATS ─────────────────────────────────────────
function loadStats(stats) {
  $('stats-list').innerHTML = stats.map((s, i) => `
    <div class="card" style="margin:0;">
      <div class="form-group"><label>Number / Label ${i+1}</label>
        <input type="text" id="stat-num-${i}" value="${s.num}" placeholder="13+"/>
      </div>
      <div class="form-group"><label>Description</label>
        <input type="text" id="stat-lbl-${i}" value="${s.label}" placeholder="Projects shipped"/>
      </div>
    </div>`).join('');
}
$('save-stats').onclick = async () => {
  const d = PortfolioDB.getData();
  d.stats = d.stats.map((_, i) => ({ num: val(`stat-num-${i}`), label: val(`stat-lbl-${i}`) }));
  try {
    await PortfolioDB.saveStats(d.stats);
    toast('✅ Stats saved!');
  } catch(e) { toast('❌ Save failed: ' + e.message, true); }
};

// ── EDUCATION ─────────────────────────────────────
function loadEdu(edu) {
  $('edu-school').value = edu.school;
  $('edu-major').value  = edu.major;
  $('edu-years').value  = edu.years;
  $('edu-gpa').value    = edu.gpa;
  $('edu-url').value    = edu.transcriptUrl;
}
$('save-edu').onclick = async () => {
  const d = PortfolioDB.getData();
  d.education = { school: val('edu-school'), major: val('edu-major'), years: val('edu-years'),
                  gpa: val('edu-gpa'), transcriptUrl: val('edu-url') };
  try {
    await PortfolioDB.saveEducation(d.education);
    toast('✅ Education saved!');
  } catch(e) { toast('❌ Save failed: ' + e.message, true); }
};

// ── SKILLS ────────────────────────────────────────
function loadSkills(skills) {
  $('skills-list').innerHTML = '';
  skills.forEach((g, gi) => {
    const div = document.createElement('div');
    div.className = 'skill-group-card';
    div.innerHTML = `
      <div class="sg-head-row">
        <input type="text" id="sg-cat-${gi}" value="${g.category}" placeholder="Category name"/>
        <div style="display:flex;gap:6px;">
          <button class="btn btn-secondary btn-sm" onclick="addSkillTag(${gi})">+ Tag</button>
          <button class="btn btn-danger btn-sm" onclick="removeSkillGroup(${gi})">✕</button>
        </div>
      </div>
      <div class="tag-editor" id="sg-tags-${gi}">
        ${g.tags.map((t,ti) => `<span class="tag-chip">${t.label}${t.color ? ':'+t.color : ''} <span class="tag-chip-del" onclick="removeSkillTag(${gi},${ti})">✕</span></span>`).join('')}
        <input type="text" id="sg-input-${gi}" placeholder="Tag:color" onkeydown="if(event.key==='Enter'){addSkillTag(${gi});event.preventDefault()}"/>
      </div>`;
    $('skills-list').appendChild(div);
  });
}
async function addSkillTag(gi) {
  const input = $(`sg-input-${gi}`);
  const val2 = input.value.trim();
  if (!val2) return;
  const d = PortfolioDB.getData();
  const [label, color=''] = val2.split(':').map(s=>s.trim());
  d.skills[gi].tags.push({ label, color });
  await PortfolioDB.saveSkills(d.skills); loadSkills(d.skills);
  setTimeout(() => { const el = $(`sg-input-${gi}`); if(el) el.focus(); }, 10);
}
async function removeSkillTag(gi, ti) {
  const d = PortfolioDB.getData(); d.skills[gi].tags.splice(ti,1);
  await PortfolioDB.saveSkills(d.skills); loadSkills(d.skills);
}
async function removeSkillGroup(gi) {
  const d = PortfolioDB.getData(); d.skills.splice(gi,1);
  await PortfolioDB.saveSkills(d.skills); loadSkills(d.skills);
}
$('add-skill-group').onclick = async () => {
  const d = PortfolioDB.getData();
  d.skills.push({ id: uid(), category: 'New Category', tags: [] });
  await PortfolioDB.saveSkills(d.skills); loadSkills(d.skills);
};
$('save-skills').onclick = async () => {
  const d = PortfolioDB.getData();
  d.skills.forEach((g, gi) => { const el = $(`sg-cat-${gi}`); if(el) g.category = el.value.trim(); });
  try {
    await PortfolioDB.saveSkills(d.skills);
    toast('✅ Skills saved!');
  } catch(e) { toast('❌ Save failed: ' + e.message, true); }
};

// ── EXPERIENCE ────────────────────────────────────
function loadExp(exp) {
  $('exp-list').innerHTML = '';
  exp.forEach(e => {
    const div = document.createElement('div');
    div.className = 'card';
    div.innerHTML = `
      <div class="card-header">
        <div>
          <div class="card-title">${e.title}</div>
          <div class="card-meta">${e.date} &nbsp;·&nbsp; <span class="badge ${e.badge}">${e.badgeLabel}</span></div>
        </div>
        <div class="card-actions">
          <button class="btn btn-secondary btn-sm" onclick="editExp('${e.id}')">✏️ Edit</button>
          <button class="btn btn-danger btn-sm" onclick="deleteExp('${e.id}')">🗑</button>
        </div>
      </div>
      <div style="font-size:12px;color:var(--text2);">${e.bullets.length} bullet(s) · ${e.links.length} link(s)</div>`;
    $('exp-list').appendChild(div);
  });
}
$('add-exp-btn').onclick = () => openExpModal(null);
function openExpModal(id) {
  editingId = id;
  const isNew = !id;
  $('exp-modal-title').textContent = isNew ? 'Add Experience' : 'Edit Experience';
  if (!isNew) {
    const e = PortfolioDB.getData().experience.find(x => x.id === id);
    $('em-date').value = e.date; $('em-title').value = e.title;
    $('em-badge').value = e.badge; $('em-badgeLabel').value = e.badgeLabel;
    renderBullets(e.bullets); renderLinks(e.links);
  } else {
    $('em-date').value=''; $('em-title').value='';
    $('em-badge').value='intern'; $('em-badgeLabel').value='Intern Project';
    renderBullets([]); renderLinks([]);
  }
  openModal('exp-modal');
}
function renderBullets(bullets) {
  $('em-bullets').innerHTML = bullets.map((b,i) => `
    <li class="bullet-item">
      <textarea rows="2">${b}</textarea>
      <button class="btn btn-danger btn-sm" onclick="this.closest('li').remove()">✕</button>
    </li>`).join('');
}
function renderLinks(links) {
  $('em-links').innerHTML = links.map((l,i) => `
    <div class="link-item">
      <input type="text" value="${l.label}" placeholder="Label"/>
      <input type="url" value="${l.url}" placeholder="https://github.com/…"/>
      <button class="btn btn-danger btn-sm" onclick="this.closest('.link-item').remove()">✕</button>
    </div>`).join('');
}
$('add-bullet-btn').onclick = () => {
  const li = document.createElement('li'); li.className = 'bullet-item';
  li.innerHTML = `<textarea rows="2"></textarea><button class="btn btn-danger btn-sm" onclick="this.closest('li').remove()">✕</button>`;
  $('em-bullets').appendChild(li);
};
$('add-link-btn').onclick = () => {
  const div = document.createElement('div'); div.className = 'link-item';
  div.innerHTML = `<input type="text" placeholder="Label"/><input type="url" placeholder="https://github.com/…"/><button class="btn btn-danger btn-sm" onclick="this.closest('.link-item').remove()">✕</button>`;
  $('em-links').appendChild(div);
};
$('save-exp-btn').onclick = async () => {
  const bullets = [...$('em-bullets').querySelectorAll('textarea')].map(t=>t.value.trim()).filter(Boolean);
  const linkEls = [...$('em-links').querySelectorAll('.link-item')];
  const links = linkEls.map(el => {
    const ins = el.querySelectorAll('input');
    return { label: ins[0].value.trim(), url: ins[1].value.trim() };
  }).filter(l=>l.label||l.url);
  try {
    if (editingId) {
      const item = { id: editingId, date: val('em-date'), title: val('em-title'), badge: $('em-badge').value, badgeLabel: val('em-badgeLabel'), bullets, links };
      await PortfolioDB.updateExperience(editingId, item);
    } else {
      const item = { id: uid(), date: val('em-date'), title: val('em-title'), badge: $('em-badge').value, badgeLabel: val('em-badgeLabel'), bullets, links };
      await PortfolioDB.createExperience(item);
    }
    loadExp(PortfolioDB.getData().experience); closeModal('exp-modal'); toast('✅ Experience saved!');
  } catch(e) { toast('❌ Save failed: ' + e.message, true); }
};
async function deleteExp(id) {
  if (!confirm('Delete this entry?')) return;
  try {
    await PortfolioDB.deleteExperience(id);
    loadExp(PortfolioDB.getData().experience); toast('🗑 Deleted');
  } catch(e) { toast('❌ Delete failed', true); }
}
function editExp(id) { openExpModal(id); }

// ── PROJECTS ──────────────────────────────────────
function loadProjects(projects) {
  $('proj-list').innerHTML = '';
  projects.forEach(p => {
    const div = document.createElement('div'); div.className = 'card';
    div.innerHTML = `
      <div class="card-header">
        <div>
          <div class="card-title">${p.icon} ${p.name}</div>
          <div style="font-size:12px;color:var(--text2);margin-top:4px;">${p.tags.map(t=>`<span class="tag-chip">${t.label}</span>`).join('')}</div>
        </div>
        <div class="card-actions">
          <button class="btn btn-secondary btn-sm" onclick="editProj('${p.id}')">✏️ Edit</button>
          <button class="btn btn-danger btn-sm" onclick="deleteProj('${p.id}')">🗑</button>
        </div>
      </div>
      <div style="font-size:12px;color:var(--text2);">${p.desc.slice(0,100)}…</div>`;
    $('proj-list').appendChild(div);
  });
}
$('add-proj-btn').onclick = () => openProjModal(null);
function openProjModal(id) {
  editingId = id;
  $('proj-modal-title').textContent = id ? 'Edit Project' : 'Add Project';
  if (id) {
    const p = PortfolioDB.getData().projects.find(x=>x.id===id);
    $('pm-icon').value=p.icon; $('pm-name').value=p.name;
    $('pm-desc').value=p.desc; $('pm-github').value=p.github;
    $('pm-tags').value=tagsToText(p.tags);
  } else {
    $('pm-icon').value='⚙️'; $('pm-name').value=''; $('pm-desc').value=''; $('pm-github').value=''; $('pm-tags').value='';
  }
  openModal('proj-modal');
}
$('save-proj-btn').onclick = async () => {
  try {
    if (editingId) {
      const item = { id: editingId, icon: val('pm-icon'), name: val('pm-name'), desc: val('pm-desc'), github: val('pm-github'), tags: parseTags($('pm-tags').value) };
      await PortfolioDB.updateProject(editingId, item);
    } else {
      const item = { id: uid(), icon: val('pm-icon'), name: val('pm-name'), desc: val('pm-desc'), github: val('pm-github'), tags: parseTags($('pm-tags').value) };
      await PortfolioDB.createProject(item);
    }
    loadProjects(PortfolioDB.getData().projects); closeModal('proj-modal'); toast('✅ Project saved!');
  } catch(e) { toast('❌ Save failed: ' + e.message, true); }
};
async function deleteProj(id) {
  if (!confirm('Delete this project?')) return;
  try {
    await PortfolioDB.deleteProject(id);
    loadProjects(PortfolioDB.getData().projects); toast('🗑 Deleted');
  } catch(e) { toast('❌ Delete failed', true); }
}
function editProj(id) { openProjModal(id); }

// ── SCHOOL ────────────────────────────────────────
function loadSchool(projects) {
  $('school-list').innerHTML = '';
  projects.forEach(p => {
    const div = document.createElement('div'); div.className = 'card';
    div.innerHTML = `
      <div class="card-header">
        <div>
          <div class="card-title">${p.icon} ${p.name}</div>
          <div class="card-meta">${p.subject}</div>
        </div>
        <div class="card-actions">
          <button class="btn btn-secondary btn-sm" onclick="editSchool('${p.id}')">✏️ Edit</button>
          <button class="btn btn-danger btn-sm" onclick="deleteSchool('${p.id}')">🗑</button>
        </div>
      </div>`;
    $('school-list').appendChild(div);
  });
}
$('add-school-btn').onclick = () => openSchoolModal(null);
function openSchoolModal(id) {
  editingId = id;
  $('school-modal-title').textContent = id ? 'Edit School Project' : 'Add School Project';
  if (id) {
    const p = PortfolioDB.getData().schoolProjects.find(x=>x.id===id);
    $('sm-icon').value=p.icon; $('sm-subject').value=p.subject; $('sm-name').value=p.name;
    $('sm-desc').value=p.desc; $('sm-github').value=p.github;
    $('sm-label').value=p.githubLabel||''; $('sm-tags').value=tagsToText(p.tags);
  } else {
    ['sm-icon','sm-subject','sm-name','sm-desc','sm-github','sm-label','sm-tags'].forEach(id=>$(id).value='');
    $('sm-icon').value='📂';
  }
  openModal('school-modal');
}
$('save-school-btn').onclick = async () => {
  try {
    if (editingId) {
      const item = { id: editingId, icon: val('sm-icon'), subject: val('sm-subject'), name: val('sm-name'), desc: val('sm-desc'), github: val('sm-github'), githubLabel: val('sm-label'), tags: parseTags($('sm-tags').value) };
      await PortfolioDB.updateSchoolProject(editingId, item);
    } else {
      const item = { id: uid(), icon: val('sm-icon'), subject: val('sm-subject'), name: val('sm-name'), desc: val('sm-desc'), github: val('sm-github'), githubLabel: val('sm-label'), tags: parseTags($('sm-tags').value) };
      await PortfolioDB.createSchoolProject(item);
    }
    loadSchool(PortfolioDB.getData().schoolProjects); closeModal('school-modal'); toast('✅ School project saved!');
  } catch(e) { toast('❌ Save failed: ' + e.message, true); }
};
async function deleteSchool(id) {
  if (!confirm('Delete this project?')) return;
  try {
    await PortfolioDB.deleteSchoolProject(id);
    loadSchool(PortfolioDB.getData().schoolProjects); toast('🗑 Deleted');
  } catch(e) { toast('❌ Delete failed', true); }
}
function editSchool(id) { openSchoolModal(id); }

// ── SETTINGS ──────────────────────────────────────
$('change-pass-btn').onclick = async () => {
  const cur = $('cur-pass').value, nw = $('new-pass').value, cf = $('conf-pass').value;
  if (!cur||!nw||!cf) return toast('Fill all fields', true);
  if (nw !== cf) return toast('New passwords do not match', true);
  if (nw.length < 6) return toast('Password must be at least 6 chars', true);
  const ok = await PortfolioDB.changePassword(cur, nw);
  if (ok) {
    toast('✅ Password updated! Please log in again.');
    setTimeout(() => { PortfolioDB.logout(); location.reload(); }, 1500);
  } else toast('Current password is incorrect', true);
};
$('reset-btn').onclick = async () => {
  if (!confirm('Reset ALL portfolio data to defaults? This cannot be undone.')) return;
  try {
    await PortfolioDB.resetData();
    await loadAllSections();
    toast('↩ Data reset to defaults');
  } catch(e) { toast('❌ Reset failed: ' + e.message, true); }
};
