async function loadTechnologies() {
  try {
    const response = await fetch("data/technologies.json");
    const data = await response.json();
    const techSection = document.querySelector(".tech-section-simple");

    techSection.innerHTML = data.categories
      .map(
        (category) => `
            <div class="tech-category-simple">
                <p class="tech-category-label">${category.name}</p>
                <div class="tech-tags">
                    ${category.technologies
                      .map(
                        (tech) => `
                        <span class="tech-tag">${tech}</span>
                    `
                      )
                      .join("")}
                </div>
            </div>
        `
      )
      .join("");
  } catch (error) {
    console.error("Error loading technologies:", error);
  }
}

async function loadProjects() {
  try {
    const response = await fetch("data/projects.json");
    const data = await response.json();
    const projectsList = document.querySelector(".projects-list");

    projectsList.innerHTML = data.projects
      .map(
        (project) => `
            <div class="project-item">
                <div class="project-header">
                    <div class="project-number">${project.id}</div>
                    <div class="project-info">
                        <h3>${project.title}</h3>
                        <div class="project-tags">
                            ${project.tags
                              .map(
                                (tag) => `
                                <span class="project-tag">${tag}</span>
                            `
                              )
                              .join("")}
                        </div>
                    </div>
                </div>
                <p class="project-description">${project.description}</p>
                <div class="project-links">
                    <a target="_blank" href="${
                      project.liveLink
                    }" class="project-link">View More →</a>
                    <a href="${
                      project.githubLink
                    }" class="project-link" target="_blank">GitHub →</a>
                </div>
            </div>
        `
      )
      .join("");
  } catch (error) {
    console.error("Error loading projects:", error);
  }
}

async function loadExperience() {
  try {
    const response = await fetch("data/experience.json");
    const data = await response.json();
    const timeline = document.querySelector(".timeline");

    timeline.innerHTML = data.experiences
      .map(
        (exp) => `
            <div class="timeline-item">
                <div class="timeline-date">${exp.period}</div>
                <div class="timeline-content">
                    <h3>${exp.role}</h3>
                    <div class="timeline-company">${exp.company}</div>
                    <p class="timeline-description">${exp.description}</p>
                </div>
            </div>
        `
      )
      .join("");
  } catch (error) {
    console.error("Error loading experience:", error);
  }
}

function animateCounter(element) {
  const target = parseInt(element.getAttribute("data-target"));
  const duration = 2000;
  const increment = target / (duration / 16);
  let current = 0;

  const updateCounter = () => {
    current += increment;
    if (current < target) {
      element.textContent = Math.floor(current) + "+";
      requestAnimationFrame(updateCounter);
    } else {
      element.textContent = target + "+";
    }
  };

  updateCounter();
}

const statsObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const statNumbers = entry.target.querySelectorAll(".stat-number");
        statNumbers.forEach((stat) => animateCounter(stat));
        statsObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.5 }
);

const heroStats = document.querySelector(".hero-stats");
if (heroStats) {
  statsObserver.observe(heroStats);
}

function handleSubmit(event) {
  event.preventDefault();
  const submitBtn = event.target.querySelector('button[type="submit"]');
  submitBtn.classList.add("btn-loading");
  submitBtn.disabled = true;
  submitBtn.innerHTML =
    '<div style="display: inline-flex; align-items: center; height: 100%;"><span class="btn-text">Sending</span><span class="btn-dots"></span></div>';

  fetch(
    "https://api.telegram.org/bot6376636664:AAEEn-R-2XvEo3oJWdie1wQDEQSAk9ZBpCU/sendMessage",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: 6026204169,
        text: `
        ------------New Message-------------

        Subject: ${event.target.elements.subject.value}
        Name: ${event.target.elements.name.value}
        Email: ${event.target.elements.email.value}
        message: ${event.target.elements.message.value}
        --------------------------------------------
        `,
      }),
    }
  )
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      // Show success state
      submitBtn.classList.remove("btn-loading");
      submitBtn.classList.add("btn-success");
      submitBtn.innerHTML =
        '<div style="display: inline-flex; align-items: center; height: 100%;"><span class="btn-text">Sent</span><span class="btn-icon">✓</span></div>';
      event.target.reset();

      // Reset button after 2 seconds
      setTimeout(() => {
        submitBtn.classList.remove("btn-success");
        submitBtn.innerHTML =
          '<div style="display: inline-flex; align-items: center; height: 100%;"><span class="btn-text">Send Message</span></div>';
        submitBtn.disabled = false;
      }, 2000);
    })
    .catch((error) => {
      console.error("Error:", error);
      // Show error state
      submitBtn.classList.remove("btn-loading");
      submitBtn.classList.add("btn-error");
      submitBtn.innerHTML =
        '<div style="display: inline-flex; align-items: center; height: 100%;"><span class="btn-text">Failed</span><span class="btn-icon">×</span></div>';

      // Reset button after 2 seconds
      setTimeout(() => {
        submitBtn.classList.remove("btn-error");
        submitBtn.innerHTML =
          '<div style="display: inline-flex; align-items: center; height: 100%;"><span class="btn-text">Send Message</span></div>';
        submitBtn.disabled = false;
      }, 2000);
    });
}

// Mobile Menu
function toggleMenu() {
  const mobileMenu = document.getElementById("mobileMenu");
  const menuBtn = document.querySelector(".menu-btn");

  mobileMenu.classList.toggle("active");
  menuBtn.classList.toggle("active");

  // Change menu icon
  if (mobileMenu.classList.contains("active")) {
    menuBtn.textContent = "✕";
  } else {
    menuBtn.textContent = "☰";
  }
}

// Close mobile menu when clicking on a link
document.querySelectorAll(".mobile-menu a").forEach((link) => {
  link.addEventListener("click", () => {
    const mobileMenu = document.getElementById("mobileMenu");
    const menuBtn = document.querySelector(".menu-btn");

    mobileMenu.classList.remove("active");
    menuBtn.classList.remove("active");
    menuBtn.textContent = "☰";
  });
});

// Close menu when clicking outside
document.addEventListener("click", (e) => {
  const mobileMenu = document.getElementById("mobileMenu");
  const menuBtn = document.querySelector(".menu-btn");
  const navbar = document.querySelector(".navbar");

  if (!navbar.contains(e.target) && mobileMenu.classList.contains("active")) {
    mobileMenu.classList.remove("active");
    menuBtn.classList.remove("active");
    menuBtn.textContent = "☰";
  }
});

// Initialize dynamic content loading
document.addEventListener("DOMContentLoaded", () => {
  loadTechnologies();
  loadProjects();
  loadExperience();
});

// Scroll Animation
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -100px 0px",
};

const observer = new IntersectionObserver(function (entries) {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

document.querySelectorAll(".fade-in").forEach((el) => {
  observer.observe(el);
});

// Smooth Navigation
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    const href = this.getAttribute("href");
    if (href !== "#") {
      e.preventDefault();
      const target = document.getElementById(href.substring(1));
      if (target) {
        target.scrollIntoView({ behavior: "smooth" });
      }
    }
  });
});
