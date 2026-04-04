// =============================================
// PORTFOLIO DATABASE — localStorage Engine
// =============================================
// Access admin panel at: admin.html
// Default credentials: admin / lght@2026
// =============================================

const PortfolioDB = (() => {
  const STORAGE_KEY = 'lght_portfolio_v1';
  const SESSION_KEY = 'lght_admin_session';
  const PASS_KEY    = 'lght_admin_pass';

  // Default credentials
  const CREDS = {
    username: 'admin',
    get password() { return localStorage.getItem(PASS_KEY) || 'lght@2026'; }
  };

  // ─────────────────────────────────────────
  // DEFAULT DATA
  // ─────────────────────────────────────────
  const defaultData = {
    hero: {
      role: "DevOps & System Engineer",
      name: "Le Gia Hoang Thien",
      bio: "Final-year student at UIT with hands-on experience in CI/CD pipelines, cloud infrastructure on AWS, container orchestration, and security automation. Passionate about building reliable, observable, and secure systems.",
      techTags: ["🐳 Docker", "☸️ Kubernetes", "☁️ AWS", "🔒 DevSecOps", "⚙️ CI/CD"],
      email: "lghthien@gmail.com",
      github: "https://github.com/Lghthien",
      phone: "+84398860701",
      avatar: "/images/image.png",
      openToWork: true
    },
    stats: [
      { num: "13+", label: "Projects shipped" },
      { num: "9.0", label: "GPA / 10" },
      { num: "UIT", label: "2022 – 2026" }
    ],
    education: {
      school: "University of Information Technology (UIT)",
      major: "Computer Networking and Data Communication",
      years: "2022 – 2026",
      gpa: "9.0",
      transcriptUrl: "https://drive.google.com/drive/u/0/folders/1xKMrto-ASyM-d_nPMrZH9UWiTsmyk_X5"
    },
    skills: [
      { id: 's1', category: "Cloud & Infrastructure", tags: [
        { label: "AWS EC2", color: "" }, { label: "AWS ELB", color: "" },
        { label: "Auto Scaling", color: "" }, { label: "CodeDeploy", color: "" }
      ]},
      { id: 's2', category: "Containers & Orchestration", tags: [
        { label: "Docker", color: "" }, { label: "Kubernetes", color: "" },
        { label: "Helm", color: "green" }, { label: "ArgoCD", color: "green" }
      ]},
      { id: 's3', category: "CI/CD & IaC", tags: [
        { label: "Jenkins", color: "" }, { label: "GitHub Actions", color: "" },
        { label: "Terraform", color: "orange" }
      ]},
      { id: 's4', category: "Monitoring & Security", tags: [
        { label: "Prometheus", color: "" }, { label: "Grafana", color: "" },
        { label: "Trivy", color: "purple" }, { label: "SonarQube", color: "purple" },
        { label: "Wazuh", color: "purple" }
      ]},
      { id: 's5', category: "SIEM & Logging", tags: [
        { label: "OpenSearch", color: "" }, { label: "Vector (VRL)", color: "" },
        { label: "ECS", color: "green" }, { label: "NGINX", color: "green" }
      ]},
      { id: 's6', category: "Languages & OS", tags: [
        { label: "Python", color: "" }, { label: "TypeScript", color: "" },
        { label: "Groovy", color: "" }, { label: "YAML", color: "" },
        { label: "Ubuntu", color: "orange" }
      ]}
    ],
    experience: [
      {
        id: 'e1',
        date: "Aug 2025 – Feb 2026",
        title: "Open-Source SIEM System Development",
        badge: "intern",
        badgeLabel: "Intern Project",
        bullets: [
          "Designed and deployed an open-source SIEM platform using OpenSearch, Wazuh, and Vector in Docker-based environments.",
          "Built log collection pipelines for multi-source data (Linux, Windows, Firewall, Web, Docker, ESXi) and standardized logs using ECS.",
          "Implemented parsing, filtering, tagging, and transformation with Vector (VRL); optimized performance and resolved production issues (memory leaks, high load).",
          "Deployed HA architecture with OpenSearch Cluster, NGINX Load Balancer, and automated agent installation with failover support."
        ],
        links: [
          { label: "Deploy-SIEM-opensource", url: "https://github.com/Lghthien/Deploy-SIEM-opensource" }
        ]
      },
      {
        id: 'e2',
        date: "Oct 2025 – Nov 2025",
        title: "NGINX CIS Benchmark Automation Tool",
        badge: "personal",
        badgeLabel: "Personal Project",
        bullets: [
          "Developed an automation tool to harden and audit NGINX compliance with CIS Benchmark on Ubuntu servers via SSH.",
          "Implemented 40+ security checks (TLS, permissions, logging, request filtering) and automated secure SSL/TLS configuration.",
          "Supported multi-host deployment, backup/rollback mechanisms, and generated detailed JSON compliance reports (PASS/FAIL with remediation)."
        ],
        links: [
          { label: "Nginx_automation", url: "https://github.com/Lghthien/Nginx_automation" }
        ]
      },
      {
        id: 'e3',
        date: "Mar 2025 – Jun 2025",
        title: "CI/CD Pipeline with Jenkins for Web Application",
        badge: "academic",
        badgeLabel: "Academic Project",
        bullets: [
          "Developed a travel website using NestJS (backend) and NextJS (frontend), containerized with Docker.",
          "Provisioned a Jenkins server on AWS EC2 using Terraform for CI/CD automation.",
          "Integrated Trivy for Docker image security scanning and SonarQube for code quality analysis.",
          "Deployed applications using ArgoCD for GitOps-based continuous delivery.",
          "Monitored and visualized system metrics with Prometheus and Grafana."
        ],
        links: [
          { label: "CI-dacn", url: "https://github.com/Lghthien/CI-dacn" },
          { label: "infrastructure", url: "https://github.com/Lghthien/infrastructure" }
        ]
      },
      {
        id: 'e4',
        date: "Mar 2025 – May 2025",
        title: "Automated Website Deployment on AWS",
        badge: "academic",
        badgeLabel: "Academic Project",
        bullets: [
          "Developed a student management web application and provisioned cloud infrastructure on AWS with Terraform.",
          "Leveraged AWS native CI/CD tools: CodeCommit, CodeBuild, and CodeDeploy for automated deployments.",
          "Implemented high availability using Elastic Load Balancer and Auto Scaling Groups."
        ],
        links: [
          { label: "infrastructure_devops", url: "https://github.com/Lghthien/infrastructure_devops" },
          { label: "Source-Dev-ops", url: "https://github.com/Lghthien/Source-Dev-ops" }
        ]
      }
    ],
    projects: [
      {
        id: 'p1', icon: "🛡️",
        name: "Open-Source SIEM System",
        desc: "Full SIEM platform with OpenSearch + Wazuh + Vector. HA cluster, multi-source log pipelines, ECS normalization, and automated agent deployment.",
        tags: [{ label: "OpenSearch", color: "purple" }, { label: "Wazuh", color: "purple" }, { label: "Docker", color: "" }],
        github: "https://github.com/Lghthien/Deploy-SIEM-opensource"
      },
      {
        id: 'p2', icon: "🔒",
        name: "NGINX CIS Benchmark Tool",
        desc: "Automated hardening & auditing tool for NGINX on Ubuntu via SSH. 40+ CIS checks, SSL automation, backup/rollback, JSON compliance reports.",
        tags: [{ label: "Python", color: "orange" }, { label: "NGINX", color: "green" }, { label: "Ubuntu", color: "" }],
        github: "https://github.com/Lghthien/Nginx_automation"
      },
      {
        id: 'p3', icon: "⚙️",
        name: "Full DevSecOps Pipeline",
        desc: "End-to-end CI/CD for a NestJS + NextJS app on AWS EKS. Jenkins + Trivy + SonarQube + ArgoCD + Prometheus/Grafana stack.",
        tags: [{ label: "Jenkins", color: "" }, { label: "ArgoCD", color: "green" }, { label: "Terraform", color: "orange" }],
        github: "https://github.com/Lghthien/CI-dacn"
      },
      {
        id: 'p4', icon: "☁️",
        name: "AWS Infrastructure Automation",
        desc: "Student management app deployed on AWS with Terraform IaC, CodePipeline CI/CD, Elastic Load Balancer, and Auto Scaling for high availability.",
        tags: [{ label: "Terraform", color: "orange" }, { label: "AWS", color: "" }, { label: "CodeDeploy", color: "" }],
        github: "https://github.com/Lghthien/infrastructure_devops"
      }
    ],
    schoolProjects: [
      {
        id: 'sp1', icon: "📚", subject: "Intro to SE",
        name: "Library Management Website",
        desc: "Full-stack web application for managing library books, readers, loans, and fines. Built as the capstone for Introduction to Software Engineering.",
        tags: [{ label: "Node.js", color: "" }, { label: "MongoDB", color: "" }, { label: "JavaScript", color: "" }],
        github: "https://github.com/Lghthien/library-management-website",
        githubLabel: "library-management-website"
      },
      {
        id: 'sp2', icon: "🌱", subject: "IoT",
        name: "Gardenice – Smart Garden IoT",
        desc: "IoT system to monitor and automate a smart garden: soil moisture, temperature, automated watering, and a mobile dashboard for control.",
        tags: [{ label: "ESP32", color: "orange" }, { label: "MQTT", color: "green" }, { label: "Python", color: "" }],
        github: "https://github.com/Lghthien/Gardenice-IoT",
        githubLabel: "Gardenice-IoT"
      },
      {
        id: 'sp3', icon: "🌐", subject: "SDN / Programmable Networks",
        name: "SDN Multi-Access-Point Controller",
        desc: "Software-Defined Networking project implementing a centralised controller managing multiple Wi-Fi access points with dynamic flow routing.",
        tags: [{ label: "OpenFlow", color: "purple" }, { label: "Ryu SDN", color: "" }, { label: "Python", color: "" }],
        github: "https://github.com/Lghthien/SDN_multi-access-point",
        githubLabel: "SDN_multi-access-point"
      },
      {
        id: 'sp4', icon: "🏨", subject: "Network Design",
        name: "Resort Network Design Project",
        desc: "End-to-end enterprise network design for a resort: VLAN segmentation, inter-VLAN routing, redundancy with STP/HSRP, and firewall policies.",
        tags: [{ label: "Cisco", color: "" }, { label: "VLAN", color: "orange" }, { label: "OSPF", color: "" }],
        github: "https://github.com/Lghthien/Network-Design-Project-Resort",
        githubLabel: "Network-Design-Project-Resort"
      },
      {
        id: 'sp5', icon: "📱", subject: "Mobile App",
        name: "English Manager App",
        desc: "Mobile application for learning and managing English vocabulary. Features flashcards, progress tracking, and quiz modes built for Android.",
        tags: [{ label: "Android", color: "green" }, { label: "Java", color: "" }, { label: "SQLite", color: "" }],
        github: "https://github.com/Lghthien/App_EnglishManager",
        githubLabel: "App_EnglishManager"
      },
      {
        id: 'sp6', icon: "🗺️", subject: "SE347 – Software Engineering",
        name: "SE347 Learning Roadmap",
        desc: "Web platform providing structured learning roadmaps and resources for software engineering topics, built as a team project for SE347.",
        tags: [{ label: "React", color: "" }, { label: "Node.js", color: "" }, { label: "REST API", color: "orange" }],
        github: "https://github.com/Lghthien/SE347_Roadmap",
        githubLabel: "SE347_Roadmap"
      },
      {
        id: 'sp7', icon: "⚙️", subject: "NT548 – DevOps",
        name: "NT548 DevOps Lab Practice",
        desc: "Hands-on DevOps lab exercises covering Docker, Kubernetes, CI/CD pipelines, and infrastructure-as-code using Terraform and GitHub Actions.",
        tags: [{ label: "Docker", color: "" }, { label: "Kubernetes", color: "" }, { label: "Terraform", color: "orange" }],
        github: "https://github.com/Lghthien/NT548-DevOps-ThucHanh",
        githubLabel: "NT548-DevOps-ThucHanh"
      },
      {
        id: 'sp8', icon: "🎲", subject: "Basic Network Programming",
        name: "Monopoly WinForms (LAN)",
        desc: "Multiplayer Monopoly board game built in C# WinForms with real-time LAN networking using TCP/IP sockets for peer-to-peer game state synchronisation.",
        tags: [{ label: "C#", color: "purple" }, { label: "WinForms", color: "" }, { label: "TCP/IP", color: "green" }],
        github: "https://github.com/Lghthien/Monopoly_winform",
        githubLabel: "Monopoly_winform"
      },
      {
        id: 'sp9', icon: "🖥️", subject: "Network Programming",
        name: "Remote Desktop Tool",
        desc: "Custom remote desktop application allowing real-time screen sharing and keyboard/mouse control over a local network using socket programming in C#.",
        tags: [{ label: "C#", color: "purple" }, { label: "Sockets", color: "" }, { label: "RDP", color: "" }],
        github: "https://github.com/Lghthien/remotedesktop",
        githubLabel: "remotedesktop"
      }
    ]
  };

  // ─────────────────────────────────────────
  // STORAGE
  // ─────────────────────────────────────────
  function getData() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) return JSON.parse(stored);
    } catch (e) { console.warn('PortfolioDB: failed to read localStorage', e); }
    return JSON.parse(JSON.stringify(defaultData));
  }

  function saveData(data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }

  function resetData() {
    localStorage.removeItem(STORAGE_KEY);
    return JSON.parse(JSON.stringify(defaultData));
  }

  // ─────────────────────────────────────────
  // AUTH
  // ─────────────────────────────────────────
  function login(username, password) {
    if (username === CREDS.username && password === CREDS.password) {
      sessionStorage.setItem(SESSION_KEY, '1');
      return true;
    }
    return false;
  }

  function logout() { sessionStorage.removeItem(SESSION_KEY); }

  function isLoggedIn() { return sessionStorage.getItem(SESSION_KEY) === '1'; }

  function changePassword(currentPass, newPass) {
    if (currentPass !== CREDS.password) return false;
    localStorage.setItem(PASS_KEY, newPass);
    return true;
  }

  // ─────────────────────────────────────────
  // RENDERING — called on index.html load
  // ─────────────────────────────────────────
  function render() {
    const data = getData();
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
  return { getData, saveData, resetData, login, logout, isLoggedIn, changePassword, render, defaultData };
})();
