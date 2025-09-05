// Theme Management
class ThemeManager {
  constructor() {
    this.isDark =
      localStorage.getItem("theme") === "dark" ||
      (!localStorage.getItem("theme") &&
        window.matchMedia("(prefers-color-scheme: dark)").matches);
    this.init();
  }

  init() {
    this.updateTheme();
    document
      .getElementById("theme-toggle")
      .addEventListener("click", () => this.toggle());
  }

  toggle() {
    this.isDark = !this.isDark;
    this.updateTheme();
    localStorage.setItem("theme", this.isDark ? "dark" : "light");
  }

  updateTheme() {
    if (this.isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }
}

// Typewriter Effect
class TypewriterEffect {
  constructor(element, texts, speed = 100) {
    this.element = element;
    this.texts = texts;
    this.speed = speed;
    this.textIndex = 0;
    this.charIndex = 0;
    this.isDeleting = false;
    this.start();
  }

  start() {
    this.type();
  }

  type() {
    const currentText = this.texts[this.textIndex];

    if (this.isDeleting) {
      this.element.textContent = currentText.substring(0, this.charIndex - 1);
      this.charIndex--;
    } else {
      this.element.textContent = currentText.substring(0, this.charIndex + 1);
      this.charIndex++;
    }

    let typeSpeed = this.speed;

    if (this.isDeleting) {
      typeSpeed /= 2;
    }

    if (!this.isDeleting && this.charIndex === currentText.length) {
      typeSpeed = 2000;
      this.isDeleting = true;
    } else if (this.isDeleting && this.charIndex === 0) {
      this.isDeleting = false;
      this.textIndex = (this.textIndex + 1) % this.texts.length;
      typeSpeed = 500;
    }

    setTimeout(() => this.type(), typeSpeed);
  }
}

// Smooth Scrolling Navigation
class SmoothNavigation {
  constructor() {
    this.init();
  }

  init() {
    // Handle navigation clicks
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", (e) => {
        e.preventDefault();
        const target = document.querySelector(anchor.getAttribute("href"));
        if (target) {
          target.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      });
    });

    // Update active nav link on scroll
    window.addEventListener("scroll", () => this.updateActiveLink());

    // Handle mobile menu
    this.setupMobileMenu();
  }

  updateActiveLink() {
    const sections = document.querySelectorAll("section[id]");
    const navLinks = document.querySelectorAll(".nav-link");

    let current = "";
    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (window.scrollY >= sectionTop - 200) {
        current = section.getAttribute("id");
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove("text-accent-500");
      if (link.getAttribute("href") === `#${current}`) {
        link.classList.add("text-accent-500");
      }
    });
  }

  setupMobileMenu() {
    const mobileMenuBtn = document.getElementById("mobile-menu");
    const mobileNav = document.getElementById("mobile-nav");

    mobileMenuBtn.addEventListener("click", () => {
      mobileNav.classList.toggle("hidden");
    });

    // Close mobile menu when clicking outside
    mobileNav.addEventListener("click", (e) => {
      if (e.target === mobileNav) {
        mobileNav.classList.add("hidden");
      }
    });

    // Close mobile menu when clicking nav links
    mobileNav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        mobileNav.classList.add("hidden");
      });
    });
  }
}

// Intersection Observer for Animations
class AnimationObserver {
  constructor() {
    this.observer = new IntersectionObserver(
      (entries) => this.handleIntersection(entries),
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );
    this.init();
  }

  init() {
    // Observe skill bars
    document.querySelectorAll(".skill-bar").forEach((el) => {
      this.observer.observe(el);
    });

    // Observe project cards
    document.querySelectorAll(".project-card").forEach((el) => {
      this.observer.observe(el);
    });
  }

  handleIntersection(entries) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        if (entry.target.classList.contains("skill-bar")) {
          this.animateSkillBar(entry.target);
        } else if (entry.target.classList.contains("project-card")) {
          entry.target.classList.add("animate-slide-up");
        }
      }
    });
  }

  animateSkillBar(skillBar) {
    const level = skillBar.dataset.level;
    const progressBar = skillBar.querySelector(".skill-progress");

    setTimeout(() => {
      progressBar.style.width = `${level}%`;
    }, 200);
  }
}

// Contact Form Handler
class ContactForm {
  constructor() {
    this.form = document.getElementById("contact-form");
    this.successMessage = document.getElementById("success-message");
    this.init();
  }

  init() {
    this.form.addEventListener("submit", (e) => this.handleSubmit(e));
  }

  async handleSubmit(e) {
    e.preventDefault();

    const formData = new FormData(this.form);
    const data = Object.fromEntries(formData);

    // Simulate form submission
    console.log("Form submitted:", data);

    // Show success message
    this.successMessage.classList.remove("hidden");
    this.form.reset();

    // Hide success message after 3 seconds
    setTimeout(() => {
      this.successMessage.classList.add("hidden");
    }, 3000);
  }
}

// Floating Navbar Effect
class FloatingNavbar {
  constructor() {
    this.navbar = document.getElementById("navbar");
    this.init();
  }

  init() {
    window.addEventListener("scroll", () => this.handleScroll());
    // Also run once on init to set proper state
    this.handleScroll();
  }

  handleScroll() {
    // no scale transform on scroll: keep navbar size/position stable

    // Determine if navbar overlaps the hero section to toggle contrast
    const hero = document.getElementById("home");
    if (hero && this.navbar) {
      const navRect = this.navbar.getBoundingClientRect();
      const heroRect = hero.getBoundingClientRect();

      // If navbar's center Y sits within hero's vertical bounds, treat it as overlapping
      const navCenterY = navRect.top + navRect.height / 2;
      const overlaps =
        navCenterY >= heroRect.top && navCenterY <= heroRect.bottom;

      if (overlaps) {
        // only apply contrast when not in dark mode (dark mode already has good contrast)
        if (!document.documentElement.classList.contains("dark")) {
          this.navbar.classList.add("navbar--over-hero");
        }
      } else {
        this.navbar.classList.remove("navbar--over-hero");
      }
    }
  }
}

// Project Renderer: load projects.json and render cards using template
class ProjectRenderer {
  constructor() {
    this.container = document.getElementById("projects-list");
    this.template = document.getElementById("project-template");
    if (this.container && this.template) this.loadAndRender();
  }

  async loadAndRender() {
    try {
      const res = await fetch("./projects.json", { cache: "no-store" });
      if (!res.ok)
        throw new Error(`Failed to load projects.json: ${res.status}`);
      const projects = await res.json();
      this.renderProjects(projects);
    } catch (err) {
      console.error(err);
    }
  }

  renderProjects(projects) {
    this.container.innerHTML = "";
    projects.forEach((p) => {
      const node = this.template.content.cloneNode(true);

      const title = node.querySelector(".project-title");
      const badge = node.querySelector(".project-badge");
      const badgeDot = node.querySelector(".project-badge-dot");
      const desc = node.querySelector(".project-desc");
      const tagsContainer = node.querySelector(".project-tags");
      const linksContainer = node.querySelector(".project-links");

      title.textContent = p.title || "Untitled";
      badge.textContent = p.badge || "";
      desc.textContent = p.desc || "";

      // badge color
      if (p.badgeColor) {
        badgeDot.className = `project-badge-dot w-3 h-3 rounded-full animate-pulse ${p.badgeColor}`;
      }

      // tags
      (p.tags || []).forEach((t) => {
        const span = document.createElement("span");
        span.className =
          "px-3 py-1 bg-accent-100 dark:bg-accent-900/30 text-accent-700 dark:text-accent-300 text-sm rounded-full";
        span.textContent = t;
        tagsContainer.appendChild(span);
      });

      // links
      (p.links || []).forEach((l) => {
        const a = document.createElement("a");
        a.href = l.url || "#";
        a.target = "_blank";
        a.rel = "noopener noreferrer";
        a.className =
          "flex items-center px-4 py-2 bg-slate-800 dark:bg-slate-700 text-white rounded-lg hover:bg-slate-900 dark:hover:bg-slate-600  transition-all duration-300 hover:scale-100";

        // small icon depending on type
        const svg = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "svg"
        );
        svg.setAttribute("class", "w-4 h-4 mr-2");
        svg.setAttribute("viewBox", "0 0 24 24");
        svg.setAttribute("fill", l.type === "code" ? "currentColor" : "none");
        svg.setAttribute("stroke", "currentColor");

        const path = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "path"
        );
        if (l.type === "demo") {
          path.setAttribute("stroke-linecap", "round");
          path.setAttribute("stroke-linejoin", "round");
          path.setAttribute("stroke-width", "2");
          path.setAttribute(
            "d",
            "M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
          );
        } else if (l.type === "docs") {
          path.setAttribute("stroke-linecap", "round");
          path.setAttribute("stroke-linejoin", "round");
          path.setAttribute("stroke-width", "2");
          path.setAttribute(
            "d",
            "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          );
        } else {
          path.setAttribute(
            "d",
            "M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"
          );
        }
        svg.appendChild(path);
        a.appendChild(svg);

        const span = document.createElement("span");
        span.textContent = l.label;
        a.appendChild(span);

        linksContainer.appendChild(a);
      });

      this.container.appendChild(node);
    });
  }
}

// Particle System for Background
class ParticleSystem {
  constructor() {
    this.canvas = document.createElement("canvas");
    this.ctx = this.canvas.getContext("2d");
    this.particles = [];
    this.init();
  }

  init() {
    this.canvas.className = "absolute inset-0 pointer-events-none";
    this.canvas.style.zIndex = "1";
    document.querySelector("#home").appendChild(this.canvas);

    this.resize();
    this.createParticles();
    this.animate();

    window.addEventListener("resize", () => this.resize());
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  createParticles() {
    const particleCount = Math.floor(
      (this.canvas.width * this.canvas.height) / 15000
    );

    for (let i = 0; i < particleCount; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 2 + 1,
        opacity: Math.random() * 0.5 + 0.2,
      });
    }
  }

  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.particles.forEach((particle) => {
      // Update position
      particle.x += particle.vx;
      particle.y += particle.vy;

      // Wrap around edges
      if (particle.x < 0) particle.x = this.canvas.width;
      if (particle.x > this.canvas.width) particle.x = 0;
      if (particle.y < 0) particle.y = this.canvas.height;
      if (particle.y > this.canvas.height) particle.y = 0;

      // Draw particle
      this.ctx.beginPath();
      this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      this.ctx.fillStyle = `rgba(16, 185, 129, ${particle.opacity})`;
      this.ctx.fill();
    });

    requestAnimationFrame(() => this.animate());
  }
}

// Initialize everything when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  new ThemeManager();
  new SmoothNavigation();
  new AnimationObserver();
  new ContactForm();
  new FloatingNavbar();
  new ParticleSystem();

  // Initialize typewriter effect
  const typewriterTexts = [
    "Building scalable backend systems",
    "Crafting robust APIs with Node.js",
    "Designing efficient database architectures",
    "Creating seamless user experiences",
  ];

  const typewriterElement = document.getElementById("typewriter");
  if (typewriterElement) {
    new TypewriterEffect(typewriterElement, typewriterTexts, 80);
  }

  // Render projects from projects.json
  new ProjectRenderer();

  // Add entrance animations
  setTimeout(() => {
    document.querySelectorAll(".glass").forEach((el, index) => {
      setTimeout(() => {
        el.classList.add("animate-fade-in");
      }, index * 100);
    });
  }, 500);
});

// Add some interactive easter eggs
document.addEventListener("keydown", (e) => {
  // Konami code easter egg
  const konamiCode = [
    "ArrowUp",
    "ArrowUp",
    "ArrowDown",
    "ArrowDown",
    "ArrowLeft",
    "ArrowRight",
    "ArrowLeft",
    "ArrowRight",
    "KeyB",
    "KeyA",
  ];
  if (!window.konamiSequence) window.konamiSequence = [];

  window.konamiSequence.push(e.code);
  if (window.konamiSequence.length > konamiCode.length) {
    window.konamiSequence.shift();
  }

  if (window.konamiSequence.join(",") === konamiCode.join(",")) {
    // Easter egg: Matrix rain effect
    document.body.style.background = "black";
    document.body.innerHTML =
      '<div style="color: #00ff00; font-family: monospace; font-size: 12px; line-height: 1; overflow: hidden; position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: 9999;">🎉 KONAMI CODE ACTIVATED! 🎉<br>Refreshing in 3 seconds...</div>';
    setTimeout(() => location.reload(), 3000);
  }
});

// Performance optimization: Lazy load images and heavy content
const lazyLoad = () => {
  const images = document.querySelectorAll("img[data-src]");
  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.removeAttribute("data-src");
        imageObserver.unobserve(img);
      }
    });
  });

  images.forEach((img) => imageObserver.observe(img));
};

// Initialize lazy loading
document.addEventListener("DOMContentLoaded", lazyLoad);
