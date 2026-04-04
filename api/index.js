// =====================================================
// PORTFOLIO API SERVER — MongoDB Atlas Backend
// =====================================================
// Run: node server.js
// Access portfolio: http://localhost:3000
// Access admin:     http://localhost:3000/admin.html
// =====================================================

require('dotenv').config();
const express  = require('express');
const mongoose = require('mongoose');
const cors     = require('cors');
const crypto   = require('crypto');
const path     = require('path');

const app  = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
// Static files are handled by Vercel directly from /public


// ── MongoDB Connection ─────────────────────────────
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ Connected to MongoDB Atlas'))
  .catch(err => {
    console.error('❌ MongoDB connection error:', err.message);
    console.error('   → Fix: update MONGODB_URI in your .env file');
    process.exit(1);
  });

// ── Schema ────────────────────────────────────────
const portfolioSchema = new mongoose.Schema({
  _id:          { type: String, default: 'main' },
  hero:         { type: mongoose.Schema.Types.Mixed, default: {} },
  stats:        { type: [mongoose.Schema.Types.Mixed], default: [] },
  education:    { type: mongoose.Schema.Types.Mixed, default: {} },
  skills:       { type: [mongoose.Schema.Types.Mixed], default: [] },
  experience:   { type: [mongoose.Schema.Types.Mixed], default: [] },
  projects:     { type: [mongoose.Schema.Types.Mixed], default: [] },
  schoolProjects: { type: [mongoose.Schema.Types.Mixed], default: [] },
}, { strict: false });

const Portfolio = mongoose.model('Portfolio', portfolioSchema);

// ── Auth Schema ────────────────────────────────────
const authSchema = new mongoose.Schema({
  _id:          { type: String, default: 'auth' },
  username:     { type: String, default: process.env.ADMIN_USERNAME || 'admin' },
  passwordHash: { type: String },
  sessions:     { type: [String], default: [] },
});

const Auth = mongoose.model('Auth', authSchema);

// ── Default Portfolio Data ─────────────────────────
const defaultData = {
  _id: 'main',
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
      links: [{ label: "Deploy-SIEM-opensource", url: "https://github.com/Lghthien/Deploy-SIEM-opensource" }]
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
      links: [{ label: "Nginx_automation", url: "https://github.com/Lghthien/Nginx_automation" }]
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
    { id: 'sp1', icon: "📚", subject: "Intro to SE", name: "Library Management Website", desc: "Full-stack web application for managing library books, readers, loans, and fines. Built as the capstone for Introduction to Software Engineering.", tags: [{ label: "Node.js", color: "" }, { label: "MongoDB", color: "" }, { label: "JavaScript", color: "" }], github: "https://github.com/Lghthien/library-management-website", githubLabel: "library-management-website" },
    { id: 'sp2', icon: "🌱", subject: "IoT", name: "Gardenice – Smart Garden IoT", desc: "IoT system to monitor and automate a smart garden: soil moisture, temperature, automated watering, and a mobile dashboard for control.", tags: [{ label: "ESP32", color: "orange" }, { label: "MQTT", color: "green" }, { label: "Python", color: "" }], github: "https://github.com/Lghthien/Gardenice-IoT", githubLabel: "Gardenice-IoT" },
    { id: 'sp3', icon: "🌐", subject: "SDN / Programmable Networks", name: "SDN Multi-Access-Point Controller", desc: "Software-Defined Networking project implementing a centralised controller managing multiple Wi-Fi access points with dynamic flow routing.", tags: [{ label: "OpenFlow", color: "purple" }, { label: "Ryu SDN", color: "" }, { label: "Python", color: "" }], github: "https://github.com/Lghthien/SDN_multi-access-point", githubLabel: "SDN_multi-access-point" },
    { id: 'sp4', icon: "🏨", subject: "Network Design", name: "Resort Network Design Project", desc: "End-to-end enterprise network design for a resort: VLAN segmentation, inter-VLAN routing, redundancy with STP/HSRP, and firewall policies.", tags: [{ label: "Cisco", color: "" }, { label: "VLAN", color: "orange" }, { label: "OSPF", color: "" }], github: "https://github.com/Lghthien/Network-Design-Project-Resort", githubLabel: "Network-Design-Project-Resort" },
    { id: 'sp5', icon: "📱", subject: "Mobile App", name: "English Manager App", desc: "Mobile application for learning and managing English vocabulary. Features flashcards, progress tracking, and quiz modes built for Android.", tags: [{ label: "Android", color: "green" }, { label: "Java", color: "" }, { label: "SQLite", color: "" }], github: "https://github.com/Lghthien/App_EnglishManager", githubLabel: "App_EnglishManager" },
    { id: 'sp6', icon: "🗺️", subject: "SE347 – Software Engineering", name: "SE347 Learning Roadmap", desc: "Web platform providing structured learning roadmaps and resources for software engineering topics, built as a team project for SE347.", tags: [{ label: "React", color: "" }, { label: "Node.js", color: "" }, { label: "REST API", color: "orange" }], github: "https://github.com/Lghthien/SE347_Roadmap", githubLabel: "SE347_Roadmap" },
    { id: 'sp7', icon: "⚙️", subject: "NT548 – DevOps", name: "NT548 DevOps Lab Practice", desc: "Hands-on DevOps lab exercises covering Docker, Kubernetes, CI/CD pipelines, and infrastructure-as-code using Terraform and GitHub Actions.", tags: [{ label: "Docker", color: "" }, { label: "Kubernetes", color: "" }, { label: "Terraform", color: "orange" }], github: "https://github.com/Lghthien/NT548-DevOps-ThucHanh", githubLabel: "NT548-DevOps-ThucHanh" },
    { id: 'sp8', icon: "🎲", subject: "Basic Network Programming", name: "Monopoly WinForms (LAN)", desc: "Multiplayer Monopoly board game built in C# WinForms with real-time LAN networking using TCP/IP sockets for peer-to-peer game state synchronisation.", tags: [{ label: "C#", color: "purple" }, { label: "WinForms", color: "" }, { label: "TCP/IP", color: "green" }], github: "https://github.com/Lghthien/Monopoly_winform", githubLabel: "Monopoly_winform" },
    { id: 'sp9', icon: "🖥️", subject: "Network Programming", name: "Remote Desktop Tool", desc: "Custom remote desktop application allowing real-time screen sharing and keyboard/mouse control over a local network using socket programming in C#.", tags: [{ label: "C#", color: "purple" }, { label: "Sockets", color: "" }, { label: "RDP", color: "" }], github: "https://github.com/Lghthien/remotedesktop", githubLabel: "remotedesktop" }
  ]
};

// ── Helpers ───────────────────────────────────────
function hashPassword(pass) {
  return crypto.createHash('sha256').update(pass).digest('hex');
}

function generateToken() {
  return crypto.randomBytes(32).toString('hex');
}

// ── Seed DB on first run ──────────────────────────
async function seedIfEmpty() {
  const exist = await Portfolio.findById('main');
  if (!exist) {
    await Portfolio.create(defaultData);
    console.log('📦 Default portfolio data seeded to MongoDB');
  }

  const authExist = await Auth.findById('auth');
  if (!authExist) {
    const defaultPass = process.env.ADMIN_PASSWORD || 'Thien@123';
    await Auth.create({
      _id: 'auth',
      username: process.env.ADMIN_USERNAME || 'admin',
      passwordHash: hashPassword(defaultPass),
      sessions: []
    });
    console.log('🔐 Admin auth record created');
  }
}

mongoose.connection.once('open', seedIfEmpty);

// ═══════════════════════════════════════════════════
// AUTH MIDDLEWARE
// ═══════════════════════════════════════════════════
async function requireAuth(req, res, next) {
  const token = req.headers['x-auth-token'];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });

  const auth = await Auth.findById('auth');
  if (!auth || !auth.sessions.includes(token)) {
    return res.status(401).json({ error: 'Invalid or expired session' });
  }
  next();
}

// ═══════════════════════════════════════════════════
// ROUTES — AUTH
// ═══════════════════════════════════════════════════

// POST /api/auth/login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const auth = await Auth.findById('auth');
    if (!auth) return res.status(500).json({ error: 'Auth not initialized' });

    if (username !== auth.username || hashPassword(password) !== auth.passwordHash) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = generateToken();
    auth.sessions.push(token);
    // Keep at most 10 sessions
    if (auth.sessions.length > 10) auth.sessions = auth.sessions.slice(-10);
    await auth.save();

    res.json({ token });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// POST /api/auth/logout
app.post('/api/auth/logout', requireAuth, async (req, res) => {
  try {
    const token = req.headers['x-auth-token'];
    const auth = await Auth.findById('auth');
    auth.sessions = auth.sessions.filter(s => s !== token);
    await auth.save();
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// POST /api/auth/verify — check if token is still valid
app.post('/api/auth/verify', async (req, res) => {
  const token = req.headers['x-auth-token'];
  if (!token) return res.json({ valid: false });
  const auth = await Auth.findById('auth');
  res.json({ valid: !!(auth && auth.sessions.includes(token)) });
});

// POST /api/auth/change-password
app.post('/api/auth/change-password', requireAuth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const auth = await Auth.findById('auth');

    if (hashPassword(currentPassword) !== auth.passwordHash) {
      return res.status(400).json({ error: 'Current password is incorrect' });
    }
    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ error: 'New password must be at least 6 chars' });
    }

    auth.passwordHash = hashPassword(newPassword);
    auth.sessions = []; // Invalidate all sessions on password change
    await auth.save();
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ═══════════════════════════════════════════════════
// ROUTES — PORTFOLIO DATA
// ═══════════════════════════════════════════════════

// GET /api/portfolio — read all data (public, no auth)
app.get('/api/portfolio', async (req, res) => {
  try {
    let data = await Portfolio.findById('main').lean();
    if (!data) data = defaultData;
    delete data.__v;
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// PUT /api/portfolio — save all data (admin only)
app.put('/api/portfolio', requireAuth, async (req, res) => {
  try {
    const data = req.body;
    data._id = 'main';
    await Portfolio.findByIdAndUpdate('main', data, { upsert: true, new: true });
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// POST /api/portfolio/reset — reset to defaults (admin only)
app.post('/api/portfolio/reset', requireAuth, async (req, res) => {
  try {
    await Portfolio.findByIdAndReplace('main', defaultData, { upsert: true });
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ── Vercel Serverless Export ───────────────────────
module.exports = app;

