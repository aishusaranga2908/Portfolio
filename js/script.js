"use strict";

/* ---------- Data (arrays of objects) ---------- */
const skills = [
  { group: "Programming", items: ["Python", "Java", "SQL", "JavaScript"] },
  { group: "AI & Data", items: ["AI", "ML", "LLMs", "Computer Vision", "Clustering"] },
  { group: "Web", items: ["HTML5", "CSS3", "Bootstrap", "Responsive design"] },
  { group: "Soft skills", items: ["Leadership", "Active learning", "Analytical thinking", "Team work", "Multitasking", "Problem solving"] }
];

const projects = [
  { title: "Digital Health Record System", tags: ["AI"], link: "https://github.com/your-username/digital-health-record",
    desc: "AI-powered system that securely manages patient records and enables intelligent medical data retrieval using LLMs." },
  { title: "KrishiEye AI", tags: ["AI", "ML"], link: "https://github.com/your-username/krishieye-ai",
    desc: "Multilingual crop disease detection and farming advisory platform for Indian farmers using computer vision and generative AI." },
  { title: "Hotel Booking Portal", tags: ["Web"], link: "https://github.com/your-username/hotel-booking-portal",
    desc: "Responsive hotel booking web app in HTML, CSS and JavaScript with search, room selection, booking flow and client-side validation." },
  { title: "Web Session Clustering", tags: ["ML"], link: "https://github.com/your-username/web-session-clustering",
    desc: "Hierarchical clustering groups user sessions into bounced, engaged and converting users to support personalization." }
];

const certificates = [
  { name: "Introduction to Data Science - Simplilearn SkillUp", type: "Course completion" },
  { name: "Introduction to Modern Database System - Saylor Academy", type: "Course completion" },
  { name: "Python Programming: Beyond Basics to Applications - Udemy", type: "Course completion" },
  { name: "Cloud with DevOps Automation, 2-day workshop", type: "Participation" },
  { name: "SEED Hackathon 2025: Real-Time Deepfake Detection at Social Media Scale", type: "Participation" },
  { name: "Flipkart Runway: Season 5", type: "Participation" }
];

const $ = (sel, root = document) => root.querySelector(sel);

/* ---------- Render static data ---------- */
const renderSkills = () => {
  $("#skillsGrid").innerHTML = skills.map(s => `
    <div class="col-md-6">
      <div class="skill-group">
        <h3>${s.group}</h3>
        <ul class="chips">${s.items.map(i => `<li>${i}</li>`).join("")}</ul>
      </div>
    </div>`).join("");
};

const renderCerts = () => {
  $("#certList").innerHTML = certificates.map(c =>
    `<li><span>${c.name}</span><span class="type">${c.type}</span></li>`).join("");
};

/* ---------- Interactive feature 1: project filter ---------- */
const renderProjects = (filter = "all") => {
  const shown = projects.filter(p => filter === "all" || p.tags.includes(filter));
  $("#projectGrid").innerHTML = shown.map(p => `
    <div class="col-md-6">
      <article class="card project-card is-new">
        <div class="card-body">
          <h3 class="card-title h5">${p.title}</h3>
          <p class="mb-2">${p.tags.map(t => `<span class="tag">${t}</span>`).join("")}</p>
          <p class="card-text">${p.desc}</p>
          <a href="${p.link}" class="btn btn-sm btn-outline-primary" target="_blank" rel="noopener">View on GitHub</a>
        </div>
      </article>
    </div>`).join("");
  $("#projCount").textContent = `Showing ${shown.length} of ${projects.length} projects`;
};

$("#filterBar").addEventListener("click", e => {
  const btn = e.target.closest("button[data-filter]");
  if (!btn) return;
  document.querySelectorAll("#filterBar button").forEach(b => {
    const active = b === btn;
    b.classList.toggle("btn-primary", active);
    b.classList.toggle("btn-outline-primary", !active);
    b.setAttribute("aria-pressed", active);
  });
  renderProjects(btn.dataset.filter);
});

/* ---------- Interactive feature 2: dark/light theme (remembered) ---------- */
const root = document.documentElement;
const themeBtn = $("#themeToggle");
const applyTheme = theme => {
  root.setAttribute("data-bs-theme", theme);
  themeBtn.textContent = theme === "dark" ? "Light mode" : "Dark mode";
  themeBtn.setAttribute("aria-label", `Switch to ${theme === "dark" ? "light" : "dark"} theme`);
};
applyTheme(localStorage.getItem("theme") || "light");
themeBtn.addEventListener("click", () => {
  const next = root.getAttribute("data-bs-theme") === "dark" ? "light" : "dark";
  localStorage.setItem("theme", next);
  applyTheme(next);
});

/* ---------- Interactive feature 3: rotating hero word ---------- */
const words = ["patients", "farmers", "learners", "everyone"];
let wi = 0;
setInterval(() => { wi = (wi + 1) % words.length; $("#rotator").textContent = words[wi]; }, 2500);

/* ---------- Interactive feature 4: back-to-top + active nav link ---------- */
const toTop = $("#toTop");
window.addEventListener("scroll", () => { toTop.hidden = window.scrollY < 400; });
toTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

const observer = new IntersectionObserver(entries => {
  entries.forEach(en => {
    if (en.isIntersecting) {
      document.querySelectorAll(".site-nav .nav-link").forEach(a =>
        a.classList.toggle("active", a.getAttribute("href") === `#${en.target.id}`));
    }
  });
}, { rootMargin: "-45% 0px -50% 0px" });
document.querySelectorAll("main section[id]").forEach(s => observer.observe(s));

/* ---------- Contact form: validation + dynamic messages ---------- */
const form = $("#contactForm");
const message = $("#message");
const rules = {
  name: v => v.trim().length >= 2 && /^[A-Za-z .'-]+$/.test(v.trim()) ? "" : "Enter your name using letters only (at least 2).",
  email: v => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? "" : "Enter a valid email, like name@example.com.",
  subject: v => v ? "" : "Choose a subject.",
  message: v => v.trim().length >= 10 ? "" : "Write at least 10 characters."
};

const checkField = field => {
  const error = rules[field.name](field.value);
  field.classList.toggle("is-invalid", Boolean(error));
  field.classList.toggle("is-valid", !error);
  field.closest(".mb-3").querySelector(".invalid-feedback").textContent = error;
  return !error;
};

form.querySelectorAll("input, select, textarea").forEach(f =>
  f.addEventListener("blur", () => checkField(f)));
message.addEventListener("input", () => {
  $("#charCount").textContent = `${message.value.length} / 300`;
  if (message.classList.contains("is-invalid")) checkField(message);
});

const showAlert = (type, text) => {
  $("#formAlert").innerHTML = `<div class="alert alert-${type} alert-dismissible mb-3">${text}
    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>`;
};

form.addEventListener("submit", e => {
  e.preventDefault();
  const fields = [...form.elements].filter(el => el.name);
  let allValid = true;
  for (const f of fields) { if (!checkField(f)) allValid = false; }
  if (!allValid) {
    showAlert("danger", "Please fix the highlighted fields and send again.");
    form.querySelector(".is-invalid").focus();
    return;
  }
  showAlert("success", `Thanks ${form.name.value.trim()}, your message was sent. I'll reply to ${form.email.value.trim()}.`);
  form.reset();
  form.querySelectorAll(".is-valid").forEach(f => f.classList.remove("is-valid"));
  $("#charCount").textContent = "0 / 300";
});

/* ---------- Init ---------- */
$("#year").textContent = new Date().getFullYear();
renderSkills();
renderCerts();
renderProjects();