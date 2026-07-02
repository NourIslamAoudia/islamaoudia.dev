(function () {
  const config = window.PORTFOLIO_SUPABASE;
  const isConfigured =
    config &&
    config.url &&
    config.anonKey &&
    !config.url.includes("YOUR_SUPABASE") &&
    !config.anonKey.includes("YOUR_SUPABASE");

  if (!isConfigured || !window.supabase) {
    return;
  }

  const supabaseClient = window.supabase.createClient(
    config.url,
    config.anonKey,
  );

  const typeTargets = {
    cybersecurity: "#cybersecurity .portfolio__container",
    api: "#autres .portfolio__container",
    fullstack: "#fullstack .portfolio__container",
    wordpress: "#wordpress .portfolio__container",
  };

  const linkDefinitions = [
    {
      field: "source_url",
      label: "Code",
      icon: "fab fa-github",
      className: "portfolio__link-name",
    },
    {
      field: "demo_url",
      label: "Demo",
      icon: "fas fa-external-link-alt",
      className: "portfolio__link-demo",
    },
    {
      field: "documentation_url",
      label: "Documentation",
      icon: "fas fa-book",
      className: "portfolio__link-demo",
    },
    {
      field: "api_url",
      label: "Test API",
      icon: "fas fa-server",
      className: "portfolio__link-demo",
    },
    {
      field: "canva_url",
      label: "Canva",
      icon: "fas fa-file-powerpoint",
      className: "portfolio__link-demo",
    },
    {
      field: "video_url",
      label: "Video",
      icon: "fas fa-play",
      className: "portfolio__link-demo",
    },
  ];

  const createText = (text) => document.createTextNode(text || "");

  const createProjectCard = (project) => {
    const item = document.createElement("article");
    item.className = "portfolio__item portfolio__item--dynamic";

    if (project.image_url) {
      const imageWrap = document.createElement("div");
      imageWrap.className = "portfolio__img";

      const image = document.createElement("img");
      image.src = project.image_url;
      image.alt = project.title;
      image.loading = "lazy";
      imageWrap.appendChild(image);
      item.appendChild(imageWrap);
    }

    const content = document.createElement("div");
    content.className = "portfolio__content";

    const title = document.createElement("h3");
    title.className = "portfolio__title";
    title.appendChild(createText(project.title));
    content.appendChild(title);

    const description = document.createElement("p");
    description.className = "portfolio__description";
    description.appendChild(createText(project.description));
    content.appendChild(description);

    if (Array.isArray(project.tech_stack) && project.tech_stack.length) {
      const techWrap = document.createElement("div");
      techWrap.className =
        project.type === "cybersecurity" ? "cyber-tech" : "portfolio__tech";

      project.tech_stack.forEach((tech) => {
        if (!tech) {
          return;
        }

        const badge = document.createElement("span");
        badge.className =
          project.type === "cybersecurity" ? "tech-tag" : "tech-badge";
        badge.appendChild(createText(tech));
        techWrap.appendChild(badge);
      });

      content.appendChild(techWrap);
    }

    const links = linkDefinitions.filter((definition) => project[definition.field]);

    if (links.length) {
      const divider = document.createElement("hr");
      divider.className = "portfolio__divider";
      content.appendChild(divider);

      const overlay = document.createElement("div");
      overlay.className = "portfolio__overlay";

      const linksWrap = document.createElement("div");
      linksWrap.className = "portfolio__links";

      links.forEach((definition) => {
        const anchor = document.createElement("a");
        anchor.href = project[definition.field];
        anchor.className = definition.className;
        anchor.target = "_blank";
        anchor.rel = "noopener noreferrer";

        const icon = document.createElement("i");
        icon.className = definition.icon;
        anchor.appendChild(icon);
        anchor.appendChild(createText(` ${definition.label}`));
        linksWrap.appendChild(anchor);
      });

      overlay.appendChild(linksWrap);
      content.appendChild(overlay);
    }

    item.appendChild(content);
    return item;
  };

  const ensureOtherSection = () => {
    let section = document.querySelector("#other-projects .portfolio__container");
    if (section) {
      return section;
    }

    const portfolio = document.getElementById("portfolio");
    if (!portfolio) {
      return null;
    }

    const subsection = document.createElement("div");
    subsection.className = "portfolio-subsection";
    subsection.id = "other-projects";

    const header = document.createElement("div");
    header.className = "subsection-header";

    const title = document.createElement("h3");
    title.className = "portfolio-subsection-title";
    title.textContent = "Other Projects";

    const container = document.createElement("div");
    container.className = "portfolio__container";

    header.appendChild(title);
    subsection.appendChild(header);
    subsection.appendChild(container);
    portfolio.appendChild(subsection);

    return container;
  };

  const revealDynamicProjects = (cards) => {
    if (!cards.length || !window.ScrollReveal) {
      return;
    }

    const revealTargets = [];
    cards.forEach((card) => {
      revealTargets.push(card);

      const image = card.querySelector(".portfolio__img");
      if (image) {
        revealTargets.push(image);
      }
    });

    ScrollReveal({
      origin: "top",
      distance: "150px",
      duration: 1500,
      reset: false,
    }).reveal(revealTargets, { interval: 200 });
  };

  const renderProjects = (projects) => {
    const renderedItems = [];

    projects.forEach((project) => {
      const target =
        document.querySelector(typeTargets[project.type]) || ensureOtherSection();

      if (!target) {
        return;
      }

      const card = createProjectCard(project);
      target.appendChild(card);
      renderedItems.push(card);
    });

    revealDynamicProjects(renderedItems);
  };

  document.addEventListener("DOMContentLoaded", async () => {
    const { data, error } = await supabaseClient
      .from("portfolio_projects")
      .select(
        "id,title,description,image_url,tech_stack,type,demo_url,documentation_url,source_url,canva_url,api_url,video_url,sort_order,is_featured",
      )
      .eq("is_published", true)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Could not load dynamic portfolio projects:", error);
      return;
    }

    renderProjects(data || []);
  });
})();
