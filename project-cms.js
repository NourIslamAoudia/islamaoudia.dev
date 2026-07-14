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
      labelKey: "link.code",
      icon: "fab fa-github",
      className: "portfolio__link-name",
    },
    {
      field: "demo_url",
      label: "Demo",
      labelKey: "link.demo",
      icon: "fas fa-external-link-alt",
      className: "portfolio__link-demo",
    },
    {
      field: "documentation_url",
      label: "Documentation",
      labelKey: "link.documentation",
      icon: "fas fa-book",
      className: "portfolio__link-demo",
    },
    {
      field: "api_url",
      label: "Test API",
      labelKey: "link.testApi",
      icon: "fas fa-server",
      className: "portfolio__link-demo",
    },
    {
      field: "canva_url",
      label: "Canva",
      labelKey: "link.canvaReport",
      icon: "fas fa-file-powerpoint",
      className: "portfolio__link-demo",
    },
    {
      field: "video_url",
      label: "Video",
      labelKey: "link.demo",
      icon: "fas fa-play",
      className: "portfolio__link-demo",
    },
  ];

  const createText = (text) => document.createTextNode(text || "");
  const encodeSlug = (slug) => encodeURIComponent(slug || "");
  const translate = (key, fallback) =>
    window.getPortfolioTranslation?.(key) || fallback;
  const getCurrentLanguage = () => window.getPortfolioLanguage?.() || "en";
  const toDatasetKey = (field, language) =>
    `${field}${language.charAt(0).toUpperCase()}${language.slice(1)}`;
  const getLocalizedProjectText = (project, field) => {
    const language = getCurrentLanguage();
    return (
      project[`${field}_${language}`] ||
      project[`${field}_en`] ||
      project[field] ||
      ""
    );
  };

  const setLocalizedProjectDataset = (element, project, field) => {
    ["en", "fr", "it"].forEach((language) => {
      element.dataset[toDatasetKey(field, language)] =
        project[`${field}_${language}`] || "";
    });
    element.dataset[`${field}Default`] = project[field] || "";
  };

  const getLocalizedElementText = (element, field) => {
    const language = getCurrentLanguage();
    return (
      element.dataset[toDatasetKey(field, language)] ||
      element.dataset[toDatasetKey(field, "en")] ||
      element.dataset[`${field}Default`] ||
      ""
    );
  };

  const refreshDynamicProjectLanguages = () => {
    document
      .querySelectorAll(".portfolio__item--dynamic .portfolio__title")
      .forEach((title) => {
        title.textContent = getLocalizedElementText(title, "title");
      });

    document
      .querySelectorAll(".portfolio__item--dynamic .portfolio__description")
      .forEach((description) => {
        description.textContent = getLocalizedElementText(
          description,
          "description",
        );
      });

    document
      .querySelectorAll(".portfolio__item--dynamic .portfolio__links a")
      .forEach((link) => {
        const icon = link.querySelector("i");
        const label = translate(link.dataset.labelKey, link.dataset.labelFallback);
        const isDetailsLink = link.classList.contains("portfolio__link-details");

        link.textContent = "";
        if (icon && !isDetailsLink) {
          link.appendChild(icon);
          link.appendChild(createText(" "));
        }
        link.appendChild(createText(label));
        if (icon && isDetailsLink) {
          link.appendChild(createText(" "));
          link.appendChild(icon);
        }
      });
  };

  window.refreshDynamicProjectLanguages = refreshDynamicProjectLanguages;

  const createProjectCard = (project) => {
    const item = document.createElement("article");
    item.className = "portfolio__item portfolio__item--dynamic";

    if (project.image_url) {
      const imageWrap = document.createElement("div");
      imageWrap.className = "portfolio__img";

      const image = document.createElement("img");
      image.src = project.image_url;
      image.alt = getLocalizedProjectText(project, "title");
      image.loading = "lazy";
      imageWrap.appendChild(image);
      item.appendChild(imageWrap);
    }

    const content = document.createElement("div");
    content.className = "portfolio__content";

    const title = document.createElement("h3");
    title.className = "portfolio__title";
    setLocalizedProjectDataset(title, project, "title");
    title.appendChild(createText(getLocalizedProjectText(project, "title")));
    content.appendChild(title);

    const description = document.createElement("p");
    description.className = "portfolio__description";
    setLocalizedProjectDataset(description, project, "description");
    description.appendChild(
      createText(getLocalizedProjectText(project, "description")),
    );
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
    const hasMoreInfo = Boolean(project.slug && project.show_details);

    if (links.length || hasMoreInfo) {
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
        anchor.dataset.labelKey = definition.labelKey;
        anchor.dataset.labelFallback = definition.label;

        const icon = document.createElement("i");
        icon.className = definition.icon;
        anchor.appendChild(icon);
        anchor.appendChild(
          createText(` ${translate(definition.labelKey, definition.label)}`),
        );
        linksWrap.appendChild(anchor);
      });

      if (hasMoreInfo) {
        const detailsLink = document.createElement("a");
        detailsLink.href = `project-detail.html?slug=${encodeSlug(project.slug)}`;
        detailsLink.className = "portfolio__link-details";
        detailsLink.dataset.labelKey = "link.moreInfo";
        detailsLink.dataset.labelFallback = "Plus d'info";

        detailsLink.appendChild(
          createText(translate("link.moreInfo", "Plus d'info")),
        );

        const icon = document.createElement("i");
        icon.className = "fas fa-arrow-right";
        detailsLink.appendChild(icon);
        linksWrap.appendChild(detailsLink);
      }

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
    title.textContent = translate("projects.other", "Other Projects");

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
      distance: "80px",
      duration: 700,
      reset: false,
    }).reveal(revealTargets, { interval: 80 });
  };

  const renderProjects = (projects) => {
    const renderedItems = [];

    Object.values(typeTargets).forEach((selector) => {
      document.querySelector(selector)?.replaceChildren();
    });

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
    window.applyPortfolioLanguage?.();
    refreshDynamicProjectLanguages();
  };

  document.addEventListener("DOMContentLoaded", async () => {
    const { data, error } = await supabaseClient
      .from("portfolio_projects")
      .select(
        "id,slug,title,description,title_en,title_fr,title_it,description_en,description_fr,description_it,image_url,tech_stack,type,demo_url,documentation_url,source_url,canva_url,api_url,video_url,sort_order,is_featured,show_details",
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
