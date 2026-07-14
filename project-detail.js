(function () {
  const config = window.PORTFOLIO_SUPABASE;
  const isConfigured =
    config &&
    config.url &&
    config.anonKey &&
    !config.url.includes("YOUR_SUPABASE") &&
    !config.anonKey.includes("YOUR_SUPABASE");

  const supportedLanguages = ["en", "it", "fr"];
  const defaultLanguage = "en";
  const translations = {
    en: {
      back: "Back to portfolio",
      overview: "Overview",
      gallery: "Gallery",
      galleryDesktop: "Desktop screens",
      galleryMobile: "Mobile screens",
      loading: "Loading project...",
      missing: "Project not found.",
      config: "Supabase is not configured.",
      code: "Code",
      demo: "Demo",
      documentation: "Documentation",
      testApi: "Test API",
      canvaReport: "Canva Report",
      video: "Video",
    },
    it: {
      back: "Torna al portfolio",
      overview: "Panoramica",
      gallery: "Galleria",
      galleryDesktop: "Schermate desktop",
      galleryMobile: "Schermate mobile",
      loading: "Caricamento progetto...",
      missing: "Progetto non trovato.",
      config: "Supabase non e configurato.",
      code: "Codice",
      demo: "Demo",
      documentation: "Documentazione",
      testApi: "Test API",
      canvaReport: "Report Canva",
      video: "Video",
    },
    fr: {
      back: "Retour au portfolio",
      overview: "Aperçu",
      gallery: "Galerie",
      galleryDesktop: "Captures desktop",
      galleryMobile: "Captures mobile",
      loading: "Chargement du projet...",
      missing: "Projet introuvable.",
      config: "Supabase n'est pas configuré.",
      code: "Code",
      demo: "Démo",
      documentation: "Documentation",
      testApi: "Tester l'API",
      canvaReport: "Rapport Canva",
      video: "Vidéo",
    },
  };

  const linkDefinitions = [
    {
      field: "source_url",
      labelKey: "code",
      icon: "fab fa-github",
      className: "portfolio__link-name",
    },
    {
      field: "demo_url",
      labelKey: "demo",
      icon: "fas fa-external-link-alt",
      className: "portfolio__link-demo",
    },
    {
      field: "documentation_url",
      labelKey: "documentation",
      icon: "fas fa-book",
      className: "portfolio__link-demo",
    },
    {
      field: "api_url",
      labelKey: "testApi",
      icon: "fas fa-server",
      className: "portfolio__link-demo",
    },
    {
      field: "canva_url",
      labelKey: "canvaReport",
      icon: "fas fa-file-powerpoint",
      className: "portfolio__link-demo",
    },
    {
      field: "video_url",
      labelKey: "video",
      icon: "fas fa-play",
      className: "portfolio__link-demo",
    },
  ];

  const state = {
    client: null,
    language: defaultLanguage,
    project: null,
    images: [],
  };

  const status = document.getElementById("project-detail-status");
  const detail = document.getElementById("project-detail");
  const type = document.getElementById("project-detail-type");
  const title = document.getElementById("project-detail-title");
  const tech = document.getElementById("project-detail-tech");
  const links = document.getElementById("project-detail-links");
  const cover = document.getElementById("project-detail-cover");
  const body = document.getElementById("project-detail-body");
  const gallerySection = document.getElementById("project-gallery-section");
  const gallery = document.getElementById("project-detail-gallery");

  const createText = (text) => document.createTextNode(text || "");
  const t = (key) =>
    translations[state.language]?.[key] || translations[defaultLanguage][key] || key;
  const localized = (object, field) =>
    object?.[`${field}_${state.language}`] ||
    object?.[`${field}_en`] ||
    object?.[field] ||
    "";

  const getSavedLanguage = () => {
    try {
      return window.localStorage.getItem("portfolioLanguage");
    } catch (error) {
      return null;
    }
  };

  const setSavedLanguage = (language) => {
    try {
      window.localStorage.setItem("portfolioLanguage", language);
    } catch (error) {
      // localStorage can be unavailable in some browser modes.
    }
  };

  const setStatus = (message, tone = "info") => {
    status.textContent = message;
    status.dataset.type = tone;
    status.hidden = false;
  };

  const refreshStaticLabels = () => {
    document.querySelectorAll("[data-detail-i18n]").forEach((element) => {
      element.textContent = t(element.dataset.detailI18n);
    });

    document.querySelectorAll(".language-switcher__button").forEach((button) => {
      const isActive = button.dataset.lang === state.language;
      button.classList.toggle("active", isActive);
      button.setAttribute("aria-pressed", String(isActive));
    });
  };

  const renderParagraphs = (text) => {
    body.replaceChildren();
    const paragraphs = (text || "").split(/\n{2,}/).map((item) => item.trim());
    paragraphs.filter(Boolean).forEach((paragraph) => {
      const element = document.createElement("p");
      element.appendChild(createText(paragraph));
      body.appendChild(element);
    });
  };

  const renderLinks = (project) => {
    links.replaceChildren();
    linkDefinitions
      .filter((definition) => project[definition.field])
      .forEach((definition) => {
        const anchor = document.createElement("a");
        anchor.href = project[definition.field];
        anchor.className = definition.className;
        anchor.target = "_blank";
        anchor.rel = "noopener noreferrer";

        const icon = document.createElement("i");
        icon.className = definition.icon;
        anchor.appendChild(icon);
        anchor.appendChild(createText(` ${t(definition.labelKey)}`));
        links.appendChild(anchor);
      });
  };

  const createGalleryFigure = (image) => {
    const figure = document.createElement("figure");
    figure.className =
      image.image_type === "phone"
        ? "project-detail__gallery-item project-detail__gallery-item--phone"
        : "project-detail__gallery-item project-detail__gallery-item--desktop";

    const link = document.createElement("a");
    link.className = "project-detail__gallery-link";
    link.href = image.image_url;
    link.target = "_blank";
    link.rel = "noopener noreferrer";

    const img = document.createElement("img");
    img.src = image.image_url;
    img.alt = localized(image, "alt") || localized(state.project, "title");
    img.loading = "lazy";

    link.appendChild(img);
    figure.appendChild(link);

    return figure;
  };

  const createGalleryGroup = (titleKey, modifier, images) => {
    if (!images.length) {
      return null;
    }

    const group = document.createElement("div");
    group.className = `project-detail__gallery-group project-detail__gallery-group--${modifier}`;

    const title = document.createElement("h3");
    title.textContent = t(titleKey);

    const grid = document.createElement("div");
    grid.className = `project-detail__gallery-grid project-detail__gallery-grid--${modifier}`;
    images.forEach((image) => grid.appendChild(createGalleryFigure(image)));

    group.appendChild(title);
    group.appendChild(grid);

    return group;
  };

  const renderGallery = () => {
    gallery.replaceChildren();
    gallerySection.hidden = !state.images.length;

    const desktopImages = state.images.filter(
      (image) => image.image_type !== "phone",
    );
    const phoneImages = state.images.filter(
      (image) => image.image_type === "phone",
    );

    [
      createGalleryGroup("galleryDesktop", "desktop", desktopImages),
      createGalleryGroup("galleryMobile", "phone", phoneImages),
    ]
      .filter(Boolean)
      .forEach((group) => gallery.appendChild(group));
  };

  const renderProject = () => {
    const project = state.project;
    if (!project) {
      return;
    }

    refreshStaticLabels();
    type.textContent = project.type || "";
    title.textContent = localized(project, "detail_title") || localized(project, "title");
    document.title = `${title.textContent} | Nour Islam Aoudia`;

    tech.replaceChildren();
    (project.tech_stack || []).forEach((item) => {
      const badge = document.createElement("span");
      badge.className = "tech-badge";
      badge.appendChild(createText(item));
      tech.appendChild(badge);
    });

    if (project.image_url) {
      cover.src = project.image_url;
      cover.alt = localized(project, "title");
      cover.hidden = false;
    } else {
      cover.hidden = true;
    }

    renderParagraphs(
      localized(project, "detail_body") || localized(project, "description"),
    );
    renderLinks(project);
    renderGallery();
  };

  const loadProject = async () => {
    const slug = new URLSearchParams(window.location.search).get("slug");
    if (!slug) {
      setStatus(t("missing"), "error");
      return;
    }

    const { data: project, error } = await state.client
      .from("portfolio_projects")
      .select(
        "id,slug,title,description,title_en,title_fr,title_it,description_en,description_fr,description_it,detail_title_en,detail_title_fr,detail_title_it,detail_body_en,detail_body_fr,detail_body_it,image_url,tech_stack,type,demo_url,documentation_url,source_url,canva_url,api_url,video_url,is_published,show_details",
      )
      .eq("slug", slug)
      .eq("is_published", true)
      .eq("show_details", true)
      .single();

    if (error || !project) {
      setStatus(t("missing"), "error");
      return;
    }

    const { data: images, error: imagesError } = await state.client
      .from("portfolio_project_images")
      .select("id,image_url,image_type,alt_en,alt_fr,alt_it,sort_order")
      .eq("project_id", project.id)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true });

    if (imagesError) {
      console.error("Could not load project gallery:", imagesError);
    }

    state.project = project;
    state.images = images || [];
    status.hidden = true;
    detail.hidden = false;
    renderProject();
  };

  document.addEventListener("DOMContentLoaded", async () => {
    const savedLanguage = getSavedLanguage();
    state.language = supportedLanguages.includes(savedLanguage)
      ? savedLanguage
      : defaultLanguage;

    refreshStaticLabels();
    setStatus(t("loading"));

    document.querySelectorAll(".language-switcher__button").forEach((button) => {
      button.addEventListener("click", () => {
        if (!supportedLanguages.includes(button.dataset.lang)) {
          return;
        }

        state.language = button.dataset.lang;
        setSavedLanguage(state.language);
        renderProject();
      });
    });

    if (!isConfigured || !window.supabase) {
      setStatus(t("config"), "error");
      return;
    }

    state.client = window.supabase.createClient(config.url, config.anonKey);
    await loadProject();
  });
})();
