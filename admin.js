(function () {
  const config = window.PORTFOLIO_SUPABASE;
  const isConfigured =
    config &&
    config.url &&
    config.anonKey &&
    !config.url.includes("YOUR_SUPABASE") &&
    !config.anonKey.includes("YOUR_SUPABASE");

  const IMAGE_BUCKET = "portfolio-images";
  const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
  const ALLOWED_IMAGE_TYPES = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/gif",
  ];

  const state = {
    client: null,
    projects: [],
    projectImages: {},
    editingId: null,
    searchQuery: "",
  };

  const form = document.getElementById("project-form");
  const authForm = document.getElementById("auth-form");
  const authPanel = document.getElementById("auth-panel");
  const adminPanel = document.getElementById("admin-panel");
  const projectsList = document.getElementById("projects-list");
  const projectSearch = document.getElementById("project-search");
  const statusBox = document.getElementById("admin-status");
  const submitButton = document.getElementById("project-submit");
  const cancelButton = document.getElementById("project-cancel");
  const signOutButton = document.getElementById("sign-out");
  const newProjectButton = document.getElementById("new-project");
  const editorTitle = document.getElementById("editor-title");
  const galleryManager = document.getElementById("gallery-manager");
  const galleryList = document.getElementById("gallery-list");

  const projectTypeLabels = {
    cybersecurity: "Cybersecurity",
    api: "API's - Backend",
    fullstack: "Full Stack",
    wordpress: "WordPress",
    other: "Other",
  };

  const projectTypeOrder = [
    "cybersecurity",
    "api",
    "fullstack",
    "wordpress",
    "other",
  ];

  const setStatus = (message, type = "info") => {
    statusBox.textContent = message;
    statusBox.dataset.type = type;
    statusBox.hidden = false;
    statusBox.scrollIntoView({ behavior: "smooth", block: "nearest" });

    if (typeof statusBox.animate === "function") {
      statusBox.animate(
        [
          { transform: "translateY(-4px)", opacity: 0.7 },
          { transform: "translateY(0)", opacity: 1 },
        ],
        { duration: 220, easing: "ease-out" },
      );
    }
  };

  const formatSupabaseError = (error) => {
    if (!error) {
      return "Unexpected Supabase error.";
    }

    if (error.message && error.message.includes("row-level security policy")) {
      return [
        "Supabase refused this action because this account is not in portfolio_admins.",
        "Copy your Auth user id from Supabase Authentication > Users, then insert it into public.portfolio_admins.",
      ].join(" ");
    }

    if (error.message && error.message.includes("Bucket not found")) {
      return "Supabase Storage bucket not found. Run the latest supabase-schema.sql in the SQL editor.";
    }

    return error.message;
  };

  const requireSupabase = () => {
    if (!isConfigured || !window.supabase) {
      setStatus(
        "Configure supabase-config.js with your project URL and anon key.",
        "error",
      );
      return false;
    }

    state.client = window.supabase.createClient(config.url, config.anonKey);
    return true;
  };

  const parseTechStack = (value) =>
    value
      .split(",")
      .map((tech) => tech.trim())
      .filter(Boolean);

  const slugify = (value) =>
    value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 60) || "project";

  const getImageFile = () => {
    const input = form.elements.image_file;
    return input && input.files && input.files.length ? input.files[0] : null;
  };

  const getGalleryFiles = () => {
    const input = form.elements.gallery_files;
    return input && input.files ? Array.from(input.files) : [];
  };

  const getGalleryImageType = () =>
    form.elements.gallery_image_type?.value === "phone" ? "phone" : "desktop";

  const uploadImage = async (file, title) => {
    if (!file) {
      return null;
    }

    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      throw new Error("Use JPG, PNG, WebP, or GIF for the photo.");
    }

    if (file.size > MAX_IMAGE_SIZE) {
      throw new Error("The photo must be 5 MB or smaller.");
    }

    const extension = file.name.split(".").pop() || "jpg";
    const uniqueId = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    const path = `${slugify(title)}/${uniqueId}.${extension}`;
    const { error } = await state.client.storage
      .from(IMAGE_BUCKET)
      .upload(path, file, {
        cacheControl: "3600",
        contentType: file.type,
        upsert: false,
      });

    if (error) {
      throw error;
    }

    const {
      data: { publicUrl },
    } = state.client.storage.from(IMAGE_BUCKET).getPublicUrl(path);

    return publicUrl;
  };

  const getProjectPayload = () => {
    const data = new FormData(form);
    const title = data.get("title").trim();
    const description = data.get("description").trim();

    return {
      title,
      slug: slugify(data.get("slug").trim() || title),
      description,
      title_en: title,
      description_en: description,
      title_fr: data.get("title_fr").trim() || null,
      description_fr: data.get("description_fr").trim() || null,
      title_it: data.get("title_it").trim() || null,
      description_it: data.get("description_it").trim() || null,
      detail_title_en: data.get("detail_title").trim() || null,
      detail_body_en: data.get("detail_body").trim() || null,
      detail_title_fr: data.get("detail_title_fr").trim() || null,
      detail_body_fr: data.get("detail_body_fr").trim() || null,
      detail_title_it: data.get("detail_title_it").trim() || null,
      detail_body_it: data.get("detail_body_it").trim() || null,
      image_url: data.get("image_url").trim() || null,
      tech_stack: parseTechStack(data.get("tech_stack") || ""),
      type: data.get("type"),
      demo_url: data.get("demo_url").trim() || null,
      documentation_url: data.get("documentation_url").trim() || null,
      source_url: data.get("source_url").trim() || null,
      canva_url: data.get("canva_url").trim() || null,
      api_url: data.get("api_url").trim() || null,
      video_url: data.get("video_url").trim() || null,
      sort_order: Number(data.get("sort_order") || 100),
      is_featured: data.get("is_featured") === "on",
      is_published: data.get("is_published") === "on",
    };
  };

  const fillForm = (project) => {
    form.elements.title.value = project.title_en || project.title || "";
    form.elements.slug.value = project.slug || "";
    form.elements.description.value =
      project.description_en || project.description || "";
    form.elements.detail_title.value = project.detail_title_en || "";
    form.elements.detail_body.value = project.detail_body_en || "";
    form.elements.title_fr.value = project.title_fr || "";
    form.elements.description_fr.value = project.description_fr || "";
    form.elements.detail_title_fr.value = project.detail_title_fr || "";
    form.elements.detail_body_fr.value = project.detail_body_fr || "";
    form.elements.title_it.value = project.title_it || "";
    form.elements.description_it.value = project.description_it || "";
    form.elements.detail_title_it.value = project.detail_title_it || "";
    form.elements.detail_body_it.value = project.detail_body_it || "";
    form.elements.image_url.value = project.image_url || "";
    form.elements.tech_stack.value = (project.tech_stack || []).join(", ");
    form.elements.type.value = project.type || "other";
    form.elements.demo_url.value = project.demo_url || "";
    form.elements.documentation_url.value = project.documentation_url || "";
    form.elements.source_url.value = project.source_url || "";
    form.elements.canva_url.value = project.canva_url || "";
    form.elements.api_url.value = project.api_url || "";
    form.elements.video_url.value = project.video_url || "";
    form.elements.sort_order.value = project.sort_order ?? 100;
    form.elements.is_featured.checked = Boolean(project.is_featured);
    form.elements.is_published.checked = Boolean(project.is_published);

    state.editingId = project.id;
    editorTitle.textContent = `Editing: ${project.title_en || project.title}`;
    submitButton.textContent = "Update project";
    cancelButton.hidden = false;
    renderGallery(project.id);
    renderProjects();
    form.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const resetForm = () => {
    form.reset();
    form.elements.is_published.checked = true;
    form.elements.sort_order.value = 100;
    state.editingId = null;
    editorTitle.textContent = "Add project details";
    submitButton.textContent = "Add project";
    cancelButton.hidden = true;
    galleryManager.hidden = true;
    galleryList.replaceChildren();
    renderProjects();
  };

  const startNewProject = () => {
    resetForm();
    form.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const renderGallery = (projectId) => {
    galleryList.replaceChildren();
    galleryManager.hidden = !projectId;

    const images = [...(state.projectImages[projectId] || [])].sort(
      (first, second) => (first.sort_order ?? 100) - (second.sort_order ?? 100),
    );

    if (!images.length) {
      const empty = document.createElement("p");
      empty.className = "admin-empty";
      empty.textContent = "No gallery photos yet.";
      galleryList.appendChild(empty);
      return;
    }

    images.forEach((image) => {
      const item = document.createElement("article");
      item.className = "admin-gallery-item";

      const preview = document.createElement("img");
      preview.src = image.image_url;
      preview.alt = image.alt_en || "Project gallery photo";
      preview.loading = "lazy";

      const controls = document.createElement("div");
      controls.className = "admin-gallery-item__controls";

      const altLabel = document.createElement("label");
      altLabel.textContent = "Alt text";
      const altInput = document.createElement("input");
      altInput.type = "text";
      altInput.value = image.alt_en || "";
      altLabel.appendChild(altInput);

      const orderLabel = document.createElement("label");
      orderLabel.textContent = "Sort order";
      const orderInput = document.createElement("input");
      orderInput.type = "number";
      orderInput.value = image.sort_order ?? 100;
      orderLabel.appendChild(orderInput);

      const typeLabel = document.createElement("label");
      typeLabel.textContent = "Format";
      const typeSelect = document.createElement("select");
      [
        ["desktop", "Desktop / wide"],
        ["phone", "Phone / mobile"],
      ].forEach(([value, label]) => {
        const option = document.createElement("option");
        option.value = value;
        option.textContent = label;
        option.selected = (image.image_type || "desktop") === value;
        typeSelect.appendChild(option);
      });
      typeLabel.appendChild(typeSelect);

      const actions = document.createElement("div");
      actions.className = "admin-project__actions";

      const saveButton = document.createElement("button");
      saveButton.type = "button";
      saveButton.className = "admin-button admin-button--ghost";
      saveButton.textContent = "Save photo";
      saveButton.addEventListener("click", () =>
        updateProjectImage(image.id, {
          alt_en: altInput.value.trim() || null,
          sort_order: Number(orderInput.value || 100),
          image_type: typeSelect.value === "phone" ? "phone" : "desktop",
        }),
      );

      const deleteButton = document.createElement("button");
      deleteButton.type = "button";
      deleteButton.className = "admin-button admin-button--danger";
      deleteButton.textContent = "Remove";
      deleteButton.addEventListener("click", () => deleteProjectImage(image.id));

      actions.appendChild(saveButton);
      actions.appendChild(deleteButton);
      controls.appendChild(altLabel);
      controls.appendChild(orderLabel);
      controls.appendChild(typeLabel);
      controls.appendChild(actions);
      item.appendChild(preview);
      item.appendChild(controls);
      galleryList.appendChild(item);
    });
  };

  const renderProjects = () => {
    projectsList.innerHTML = "";

    if (!state.projects.length) {
      const empty = document.createElement("p");
      empty.className = "admin-empty";
      empty.textContent = "No projects yet.";
      projectsList.appendChild(empty);
      return;
    }

    const query = state.searchQuery.trim().toLowerCase();
    const visibleProjects = query
      ? state.projects.filter((project) =>
          [
            project.title,
            project.title_en,
            project.title_fr,
            project.title_it,
            project.slug,
            project.type,
          ]
            .filter(Boolean)
            .some((value) => value.toLowerCase().includes(query)),
        )
      : state.projects;

    if (!visibleProjects.length) {
      const empty = document.createElement("p");
      empty.className = "admin-empty";
      empty.textContent = "No project matches this search.";
      projectsList.appendChild(empty);
      return;
    }

    projectTypeOrder.forEach((type) => {
      const projects = visibleProjects.filter(
        (project) => (project.type || "other") === type,
      );

      if (!projects.length) {
        return;
      }

      const group = document.createElement("section");
      group.className = "admin-project-group";

      const groupHeader = document.createElement("div");
      groupHeader.className = "admin-project-group__header";

      const groupTitle = document.createElement("h3");
      groupTitle.textContent = projectTypeLabels[type] || type;

      const groupCount = document.createElement("span");
      groupCount.textContent = `${projects.length} project${
        projects.length > 1 ? "s" : ""
      }`;

      groupHeader.appendChild(groupTitle);
      groupHeader.appendChild(groupCount);
      group.appendChild(groupHeader);

      const groupList = document.createElement("div");
      groupList.className = "admin-project-group__list";

      projects.forEach((project) => {
        const card = document.createElement("article");
        card.className = "admin-project";
        card.classList.toggle(
          "admin-project--active",
          project.id === state.editingId,
        );

        const text = document.createElement("div");
        const title = document.createElement("h3");
        title.textContent = project.title_en || project.title;

        const meta = document.createElement("p");
        const imageCount = state.projectImages[project.id]?.length || 0;
        meta.textContent = `order ${project.sort_order} - ${imageCount} gallery photos`;

        const status = document.createElement("span");
        status.className = `admin-project__status ${
          project.is_published
            ? "admin-project__status--visible"
            : "admin-project__status--hidden"
        }`;
        status.textContent = project.is_published ? "Visible" : "Masque";

        text.appendChild(title);
        text.appendChild(meta);
        text.appendChild(status);

        const actions = document.createElement("div");
        actions.className = "admin-project__actions";

        const visibilityButton = document.createElement("button");
        visibilityButton.type = "button";
        visibilityButton.className = "admin-button admin-button--ghost";
        visibilityButton.textContent = project.is_published
          ? "Masquer"
          : "Afficher";
        visibilityButton.addEventListener("click", () =>
          toggleProjectVisibility(project),
        );

        const editButton = document.createElement("button");
        editButton.type = "button";
        editButton.className = "admin-button admin-button--ghost";
        editButton.textContent =
          project.id === state.editingId ? "Editing" : "Edit";
        editButton.addEventListener("click", () => fillForm(project));

        const deleteButton = document.createElement("button");
        deleteButton.type = "button";
        deleteButton.className = "admin-button admin-button--danger";
        deleteButton.textContent = "Delete";
        deleteButton.addEventListener("click", () => deleteProject(project.id));

        actions.appendChild(visibilityButton);
        actions.appendChild(editButton);
        actions.appendChild(deleteButton);
        card.appendChild(text);
        card.appendChild(actions);
        groupList.appendChild(card);
      });

      group.appendChild(groupList);
      projectsList.appendChild(group);
    });
  };

  const loadProjects = async () => {
    const { data, error } = await state.client
      .from("portfolio_projects")
      .select("*, portfolio_project_images(*)")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });

    if (error) {
      setStatus(formatSupabaseError(error), "error");
      return;
    }

    state.projects = data || [];
    state.projectImages = {};
    state.projects.forEach((project) => {
      state.projectImages[project.id] = (
        project.portfolio_project_images || []
      ).sort(
        (first, second) =>
          (first.sort_order ?? 100) - (second.sort_order ?? 100),
      );
    });
    renderProjects();
    if (state.editingId) {
      renderGallery(state.editingId);
    }
  };

  const showAdmin = async () => {
    authPanel.hidden = true;
    adminPanel.hidden = false;
    signOutButton.hidden = false;
    setStatus("Connected.", "success");
    await loadProjects();
  };

  const showAuth = () => {
    authPanel.hidden = false;
    adminPanel.hidden = true;
    signOutButton.hidden = true;
    setStatus("All Good", "info");
  };

  const insertGalleryImages = async (projectId, files, title) => {
    if (!files.length) {
      return;
    }

    const imageType = getGalleryImageType();
    const currentImages = state.projectImages[projectId] || [];
    const startOrder = currentImages.length
      ? Math.max(...currentImages.map((image) => image.sort_order || 100))
      : 0;
    const rows = [];

    for (const [index, file] of files.entries()) {
      const imageUrl = await uploadImage(file, title);
      rows.push({
        project_id: projectId,
        image_url: imageUrl,
        image_type: imageType,
        alt_en: title,
        sort_order: startOrder + (index + 1) * 10,
      });
    }

    const { error } = await state.client
      .from("portfolio_project_images")
      .insert(rows);

    if (error) {
      throw error;
    }
  };

  const updateProjectImage = async (id, payload) => {
    const { error } = await state.client
      .from("portfolio_project_images")
      .update(payload)
      .eq("id", id);

    if (error) {
      setStatus(formatSupabaseError(error), "error");
      return;
    }

    setStatus("Gallery photo updated.", "success");
    await loadProjects();
  };

  const deleteProjectImage = async (id) => {
    const confirmed = window.confirm("Remove this gallery photo?");
    if (!confirmed) {
      return;
    }

    const { error } = await state.client
      .from("portfolio_project_images")
      .delete()
      .eq("id", id);

    if (error) {
      setStatus(formatSupabaseError(error), "error");
      return;
    }

    setStatus("Gallery photo removed.", "success");
    await loadProjects();
  };

  const saveProject = async (event) => {
    event.preventDefault();

    const payload = getProjectPayload();
    const wasEditing = Boolean(state.editingId);
    if (!payload.title || !payload.description) {
      setStatus("Title and description are required.", "error");
      return;
    }

    submitButton.disabled = true;
    submitButton.textContent = getImageFile() || getGalleryFiles().length
      ? "Uploading photos..."
      : state.editingId
        ? "Updating..."
        : "Adding...";

    try {
      const imageUrl = await uploadImage(getImageFile(), payload.title);
      if (imageUrl) {
        payload.image_url = imageUrl;
        form.elements.image_url.value = imageUrl;
      }

      submitButton.textContent = state.editingId ? "Updating..." : "Adding...";

      const query = state.editingId
        ? state.client
            .from("portfolio_projects")
            .update(payload)
            .eq("id", state.editingId)
            .select("id")
            .single()
        : state.client.from("portfolio_projects").insert(payload).select("id").single();

      const { data: savedProject, error } = await query;

      if (error) {
        setStatus(formatSupabaseError(error), "error");
        return;
      }

      await insertGalleryImages(
        savedProject.id,
        getGalleryFiles(),
        payload.title,
      );

      setStatus(
        wasEditing
          ? `Project "${payload.title}" updated successfully.`
          : `Project "${payload.title}" added successfully.`,
        "success",
      );
      resetForm();
      await loadProjects();
    } catch (error) {
      setStatus(formatSupabaseError(error), "error");
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = state.editingId
        ? "Update project"
        : "Add project";
    }
  };

  const deleteProject = async (id) => {
    const confirmed = window.confirm("Delete this project?");
    if (!confirmed) {
      return;
    }

    const { error } = await state.client
      .from("portfolio_projects")
      .delete()
      .eq("id", id);

    if (error) {
      setStatus(formatSupabaseError(error), "error");
      return;
    }

    setStatus("Project deleted.", "success");
    await loadProjects();
  };

  const toggleProjectVisibility = async (project) => {
    const nextVisibility = !project.is_published;
    const { error } = await state.client
      .from("portfolio_projects")
      .update({ is_published: nextVisibility })
      .eq("id", project.id);

    if (error) {
      setStatus(formatSupabaseError(error), "error");
      return;
    }

    setStatus(
      nextVisibility
        ? "Project is now visible on the site."
        : "Project is now hidden from the site.",
      "success",
    );
    await loadProjects();
  };

  const signIn = async (event) => {
    event.preventDefault();
    const data = new FormData(authForm);
    const email = data.get("email").trim();
    const password = data.get("password");

    const { error } = await state.client.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setStatus(error.message, "error");
      return;
    }

    await showAdmin();
  };

  document.addEventListener("DOMContentLoaded", async () => {
    if (!requireSupabase()) {
      return;
    }

    authForm.addEventListener("submit", signIn);
    form.addEventListener("submit", saveProject);
    projectSearch.addEventListener("input", () => {
      state.searchQuery = projectSearch.value;
      renderProjects();
    });
    newProjectButton.addEventListener("click", startNewProject);
    cancelButton.addEventListener("click", resetForm);
    signOutButton.addEventListener("click", async () => {
      await state.client.auth.signOut();
      resetForm();
      showAuth();
    });

    const {
      data: { session },
    } = await state.client.auth.getSession();

    if (session) {
      await showAdmin();
    } else {
      showAuth();
    }
  });
})();
