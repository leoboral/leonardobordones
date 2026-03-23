(function () {
  const projects = window.PortfolioProjects;

  if (!Array.isArray(projects) || projects.length === 0) {
    console.error("Project data unavailable. Expected window.PortfolioProjects as a non-empty array.");
    return;
  }

  const isProjectPage = document.body.dataset.page === "project";
  const workLink = isProjectPage ? "../index.html#work" : "index.html#work";

  function getProjectBySlug(slug) {
    return projects.find((project) => project.slug === slug) || null;
  }

  function getProjectUrl(slug) {
    return isProjectPage ? `${slug}.html` : `work/${slug}.html`;
  }

  function resolveAssetUrl(path) {
    if (!path || /^(https?:)?\/\//.test(path) || path.startsWith("data:")) {
      return path || "";
    }

    const cleanPath = path.replace(/^\/+/, "");
    return isProjectPage ? `../${cleanPath}` : cleanPath;
  }

  function initSiteHeader() {
    const header = document.querySelector(".site-header");
    const navToggle = document.querySelector(".nav-toggle");
    const navLinks = document.querySelectorAll(".site-nav a, .header-socials a");

    if (!header || !navToggle) {
      return;
    }

    navToggle.addEventListener("click", () => {
      const isOpen = header.classList.toggle("nav-open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
      navToggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
    });

    navLinks.forEach((link) => {
      link.addEventListener("click", () => {
        if (!header.classList.contains("nav-open")) {
          return;
        }

        header.classList.remove("nav-open");
        navToggle.setAttribute("aria-expanded", "false");
        navToggle.setAttribute("aria-label", "Open menu");
      });
    });
  }

  function renderProjectCards(projectList) {
    return projectList
      .map((project) => {
        const projectUrl = getProjectUrl(project.slug);
        return `
          <article class="project-card">
            <a class="project-media" href="${projectUrl}" aria-label="Open ${project.title} case study">
              <img src="${resolveAssetUrl(project.gridImage)}" alt="${project.title} project preview" loading="lazy" />
            </a>
            <div class="project-meta">
              <div class="project-meta-top">
                <p class="project-category">${project.category}</p>
                <p class="project-year">${project.year}</p>
              </div>
              <h3><a href="${projectUrl}">${project.title}</a></h3>
              <p class="project-company">${project.company}</p>
              <p class="project-summary">${project.cardSummary || project.shortDescription}</p>
              <p class="project-value"><span>Value Created</span><span class="project-value-text">${project.cardValue || project.shortDescription}</span></p>
              <a class="project-link" href="${projectUrl}">Read case study</a>
            </div>
          </article>
        `;
      })
      .join("");
  }

  function renderMetadataList(items) {
    if (!Array.isArray(items) || items.length === 0) {
      return "<p>Not specified</p>";
    }

    return `<ul>${items.map((item) => `<li>${item}</li>`).join("")}</ul>`;
  }

  function renderProcessItems(process) {
    return process
      .map(
        (step, index) => `
          <article class="process-item">
            <p class="process-index">${String(index + 1).padStart(2, "0")}</p>
            <h3>${step.title}</h3>
            <p>${step.body}</p>
          </article>
        `
      )
      .join("");
  }

  function renderOutcomeHighlights(items) {
    if (!Array.isArray(items) || items.length === 0) {
      return "";
    }

    return `
      <ul class="project-outcome-list" aria-label="Key outcomes">
        ${items.map((item) => `<li>${item}</li>`).join("")}
      </ul>
    `;
  }

  function renderProjectCta() {
    return `
      <section class="project-cta section section-divider" aria-labelledby="project-cta-title">
        <div class="container project-cta-inner">
          <p class="section-kicker">Need Similar Outcomes?</p>
          <h2 id="project-cta-title">Looking for product clarity and fast execution in one partner?</h2>
          <p>
            I help teams define the right scope, shape the user experience, and deliver practical systems that create momentum.
          </p>
          <div class="hero-actions">
            <a class="button button-primary" href="mailto:hello@leonardobordones.com?subject=Project%20Inquiry">Start a project conversation</a>
            <a class="button button-secondary" href="${workLink}">Back to selected work</a>
          </div>
        </div>
      </section>
    `;
  }

  function renderNextProject(currentProject) {
    const fallbackIndex = projects.findIndex((project) => project.slug === currentProject.slug);
    const fallbackProject =
      fallbackIndex >= 0 ? projects[(fallbackIndex + 1) % projects.length] : projects[0];

    const nextProject =
      projects.find((project) => project.slug === currentProject.nextProject) || fallbackProject;

    if (!nextProject) {
      return "";
    }

    const nextProjectUrl = getProjectUrl(nextProject.slug);

    return `
      <section class="section section-divider" aria-labelledby="next-project-title">
        <div class="container">
          <p class="section-kicker">Next Project</p>
          <a class="next-project-link" href="${nextProjectUrl}">
            <img src="${resolveAssetUrl(nextProject.gridImage)}" alt="Preview of ${nextProject.title}" loading="lazy" />
            <div>
              <h2 id="next-project-title">${nextProject.title}</h2>
              <p>${nextProject.cardSummary || nextProject.shortDescription}</p>
              <span>Read Case Study</span>
            </div>
          </a>
        </div>
      </section>
    `;
  }

  function renderProjectDetail(project) {
    return `
      <article>
        <header class="project-hero">
          <div class="container project-hero-content">
            <p class="section-kicker">${project.company} · ${project.category}</p>
            <h1>${project.title}</h1>
            <p class="project-subtitle">${project.shortDescription}</p>
            <div class="project-hero-actions">
              <a class="button button-primary" href="${project.buttonLink}" target="_blank" rel="noreferrer">${project.buttonText}</a>
              <a class="button button-secondary" href="#project-process-title">See Process</a>
            </div>
          </div>
          <div class="project-hero-image">
            <img src="${resolveAssetUrl(project.fullBleedImage)}" alt="${project.title} full project visual" loading="eager" />
          </div>
        </header>

        <section class="project-overview section section-divider" aria-labelledby="project-overview-title">
          <div class="container project-overview-grid">
            <div class="project-overview-copy">
              <h2 id="project-overview-title">Overview</h2>
              <p>${project.overview}</p>
              <div class="project-context-grid">
                <article class="project-context-item">
                  <h3>Challenge</h3>
                  <p>${project.challenge || project.shortDescription}</p>
                </article>
                <article class="project-context-item">
                  <h3>Contribution Focus</h3>
                  <p>${project.cardValue || project.shortDescription}</p>
                </article>
              </div>
            </div>
            <div class="project-metadata" aria-label="Project metadata">
              <article>
                <h3>Contribution</h3>
                ${renderMetadataList(project.contribution)}
              </article>
              <article>
                <h3>Team</h3>
                ${renderMetadataList(project.team)}
              </article>
              <article>
                <h3>Year</h3>
                <p>${project.year}</p>
              </article>
            </div>
          </div>
        </section>

        <section class="project-process section section-divider" aria-labelledby="project-process-title">
          <div class="container">
            <h2 id="project-process-title">Process</h2>
            <p class="project-section-lead">A focused delivery path from discovery to implementation.</p>
            <div class="process-grid">
              ${renderProcessItems(project.process)}
            </div>
          </div>
        </section>

        <section class="project-outcome section section-divider" aria-labelledby="project-outcome-title">
          <div class="container">
            <h2 id="project-outcome-title">Outcome</h2>
            <p>${project.outcome}</p>
            ${renderOutcomeHighlights(project.outcomeHighlights)}
          </div>
        </section>

        <section class="project-next-step section section-divider" aria-labelledby="project-next-step-title">
          <div class="container">
            <h2 id="project-next-step-title">What Came Next</h2>
            <p>${project.nextStep || "The work continued through iterative optimization and team adoption."}</p>
          </div>
        </section>
      </article>
      ${renderNextProject(project)}
      ${renderProjectCta()}
    `;
  }

  function initHomePage() {
    const projectGrid = document.querySelector("#project-grid");
    if (!projectGrid) {
      return;
    }

    projectGrid.innerHTML = renderProjectCards(projects);
  }

  function renderNotFound() {
    const root = document.querySelector("#project-detail-root");
    if (!root) {
      return;
    }

    document.title = "Project Not Found — Leo Bordones";
    root.innerHTML = `
      <section class="section">
        <div class="container">
          <h1>Project not found</h1>
          <p>The case study you requested does not exist.</p>
          <p><a class="button button-secondary" href="${workLink}">Back to projects</a></p>
        </div>
      </section>
    `;
  }

  function initProjectPage() {
    const root = document.querySelector("#project-detail-root");
    const slug = document.body.dataset.projectSlug;

    if (!root || !slug) {
      return;
    }

    const project = getProjectBySlug(slug);

    if (!project) {
      renderNotFound();
      return;
    }

    document.title = `${project.title} — Leo Bordones`;

    const description = document.querySelector('meta[name="description"]');
    if (description) {
      description.setAttribute("content", project.shortDescription);
    }

    root.innerHTML = renderProjectDetail(project);
  }

  function initPage() {
    initSiteHeader();

    if (document.body.dataset.page === "home") {
      initHomePage();
      return;
    }

    if (document.body.dataset.page === "project") {
      initProjectPage();
    }
  }

  initPage();
})();
