require('dotenv').config();
const mongoose = require('mongoose');

if (!process.env.MONGODB_URI) {
  console.error('❌ MONGODB_URI is missing in .env file!');
  process.exit(1);
}

// ── Schemas ───────────────────────────────────────
const heroSchema = new mongoose.Schema({ _id: { type: String, default: 'hero' } }, { strict: false });
const statSchema = new mongoose.Schema({}, { strict: false });
const educationSchema = new mongoose.Schema({ _id: { type: String, default: 'education' } }, { strict: false });
const skillSchema = new mongoose.Schema({ id: String }, { strict: false });
const experienceSchema = new mongoose.Schema({ id: String }, { strict: false });
const projectSchema = new mongoose.Schema({ id: String }, { strict: false });
const schoolProjectSchema = new mongoose.Schema({ id: String }, { strict: false });

const Hero = mongoose.model('Hero', heroSchema);
const Stat = mongoose.model('Stat', statSchema);
const Education = mongoose.model('Education', educationSchema);
const Skill = mongoose.model('Skill', skillSchema);
const Experience = mongoose.model('Experience', experienceSchema);
const Project = mongoose.model('Project', projectSchema);
const SchoolProject = mongoose.model('SchoolProject', schoolProjectSchema);

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

async function runSeed() {
  try {
    console.log('⏳ Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB Atlas!');

    console.log('🗑  Clearing old collections...');
    await Promise.all([
      Hero.deleteMany({}),
      Education.deleteMany({}),
      Stat.deleteMany({}),
      Skill.deleteMany({}),
      Experience.deleteMany({}),
      Project.deleteMany({}),
      SchoolProject.deleteMany({}),
      mongoose.connection.collection('portfolios').drop().catch(() => {})
    ]);

    console.log('📦 Seeding portfolio database with new CMS tables...');
    await Promise.all([
      Hero.create({ ...defaultData.hero, _id: 'hero' }),
      Education.create({ ...defaultData.education, _id: 'education' }),
      Stat.insertMany(defaultData.stats),
      Skill.insertMany(defaultData.skills),
      Experience.insertMany(defaultData.experience),
      Project.insertMany(defaultData.projects),
      SchoolProject.insertMany(defaultData.schoolProjects)
    ]);

    console.log('✅ All collections successfully seeded to MongoDB!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error seeding data:', err.message);
    process.exit(1);
  }
}

runSeed();
