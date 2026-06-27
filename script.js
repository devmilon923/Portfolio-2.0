/* ============================================
   Portfolio 2.0 — Script
   Handles: dynamic content loading, nav, scroll reveals
   ============================================ */

// --- Dynamic Content Loading ---

async function loadProjects() {
  try {
    const response = await fetch("data/projects.json");
    const data = await response.json();
    const grid = document.getElementById("projectsGrid");
    if (!grid) return;

    grid.innerHTML = data.projects
      .filter((p) => p.featured)
      .map(
        (project) => `
        <article class="project-card ${project.pastelClass || 'sprout-tint'}">
          <div>
            <div class="project-card-header">
              <div class="project-icon-tile">
                ${project.title[0]}
              </div>
              <span class="project-type">${project.type}</span>
            </div>
            <div class="project-card-body">
              <h3>${project.title}</h3>
              <p class="project-desc">${project.description}</p>
              <div class="project-tags">
                ${project.tags.map((tag) => `<span class="project-tag">${tag}</span>`).join("")}
              </div>
            </div>
          </div>
          <div class="project-links">
            <a href="${project.liveLink}" target="_blank" rel="noopener" class="project-link">
              Live Demo <span>↗</span>
            </a>
            <a href="${project.githubLink}" target="_blank" rel="noopener" class="project-link">
              Code <span>↗</span>
            </a>
          </div>
        </article>
      `,
      )
      .join("");
  } catch (error) {
    console.error("Error loading projects:", error);
  }
}

async function loadCapabilities() {
  try {
    const response = await fetch("data/technologies.json");
    const data = await response.json();
    const container = document.getElementById("capabilities");
    if (!container) return;

    container.innerHTML = data.categories
      .map(
        (category) => `
        <div class="capability-row">
          <h3>${category.name}</h3>
          <div class="capability-tags">
            ${category.technologies.map((tech) => `<span class="capability-tag">${tech}</span>`).join("")}
          </div>
        </div>
      `,
      )
      .join("");
  } catch (error) {
    console.error("Error loading capabilities:", error);
  }
}

async function loadJourney() {
  try {
    const response = await fetch("data/experience.json");
    const data = await response.json();
    const list = document.getElementById("journeyList");
    if (!list) return;

    list.innerHTML = data.experiences
      .map(
        (exp) => `
        <div class="journey-card">
          <div class="journey-meta">
            <div class="journey-date">${exp.period}</div>
            <div class="journey-company">${exp.company}</div>
          </div>
          <div class="journey-content">
            <h3>${exp.role}</h3>
            <p class="journey-desc">${exp.description}</p>
          </div>
        </div>
      `,
      )
      .join("");
  } catch (error) {
    console.error("Error loading journey:", error);
  }
}

// --- Mobile Menu Overlay ---

function initMobileMenu() {
  const menuBtn = document.getElementById("menuBtn");
  const mobileMenu = document.getElementById("mobileMenu");
  if (!menuBtn || !mobileMenu) return;

  menuBtn.addEventListener("click", () => {
    const isActive = mobileMenu.classList.toggle("active");
    menuBtn.classList.toggle("active");
    menuBtn.setAttribute("aria-expanded", isActive);
    document.body.style.overflow = isActive ? "hidden" : "";
  });

  // Close menu when clicking a link
  mobileMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      mobileMenu.classList.remove("active");
      menuBtn.classList.remove("active");
      menuBtn.setAttribute("aria-expanded", "false");
      document.body.style.overflow = "";
    });
  });

  // Close on outside click
  document.addEventListener("click", (e) => {
    if (
      mobileMenu.classList.contains("active") &&
      !mobileMenu.contains(e.target) &&
      !menuBtn.contains(e.target)
    ) {
      mobileMenu.classList.remove("active");
      menuBtn.classList.remove("active");
      menuBtn.setAttribute("aria-expanded", "false");
      document.body.style.overflow = "";
    }
  });
}

// --- Scroll Reveal ---

function initScrollReveal() {
  const reveals = document.querySelectorAll(".reveal, .reveal-stagger");
  if (!reveals.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.08, rootMargin: "0px 0px -40px 0px" },
  );

  reveals.forEach((el) => observer.observe(el));
}

// --- Active Nav Link Highlight ---

function initActiveNav() {
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav-links a[data-section]");
  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          navLinks.forEach((link) => {
            link.classList.toggle(
              "active",
              link.getAttribute("data-section") === id,
            );
          });
        }
      });
    },
    { threshold: 0.2, rootMargin: "-80px 0px -50% 0px" },
  );

  sections.forEach((section) => observer.observe(section));
}

// --- Smooth Scroll for anchor tags ---

function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const href = this.getAttribute("href");
      if (href === "#") return;

      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({ behavior: "smooth" });
      }
    });
  });
}

// --- Navbar Scrolled Class Handler ---

function initNavScroll() {
  const navbar = document.getElementById("navbar");
  if (!navbar) return;

  window.addEventListener(
    "scroll",
    () => {
      if (window.scrollY > 20) {
        navbar.classList.add("navbar-scrolled");
      } else {
        navbar.classList.remove("navbar-scrolled");
      }
    },
    { passive: true },
  );
}

// --- Initialize All Handlers ---

document.addEventListener("DOMContentLoaded", async () => {
  // Load dynamic data first
  await Promise.all([loadProjects(), loadCapabilities(), loadJourney()]);
  
  // Initialize interactions
  initMobileMenu();
  initScrollReveal();
  initActiveNav();
  initSmoothScroll();
  initNavScroll();
});
