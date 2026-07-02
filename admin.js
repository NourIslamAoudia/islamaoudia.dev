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
    editingId: null,
  };

  const form = document.getElementById("project-form");
  const authForm = document.getElementById("auth-form");
  const authPanel = document.getElementById("auth-panel");
  const adminPanel = document.getElementById("admin-panel");
  const projectsList = document.getElementById("projects-list");
  const statusBox = document.getElementById("admin-status");
  const submitButton = document.getElementById("project-submit");
  const cancelButton = document.getElementById("project-cancel");
  const signOutButton = document.getElementById("sign-out");

  const setStatus = (message, type = "info") => {
    statusBox.textContent = message;
    statusBox.dataset.type = type;
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

    return {
      title: data.get("title").trim(),
      description: data.get("description").trim(),
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
    form.elements.title.value = project.title || "";
    form.elements.description.value = project.description || "";
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
    submitButton.textContent = "Update project";
    cancelButton.hidden = false;
    form.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const resetForm = () => {
    form.reset();
    form.elements.is_published.checked = true;
    form.elements.sort_order.value = 100;
    state.editingId = null;
    submitButton.textContent = "Add project";
    cancelButton.hidden = true;
  };

  const renderProjects = () => {
    projectsList.innerHTML = "";

    if (!state.projects.length) {
      const empty = document.createElement("p");
      empty.className = "admin-empty";
      empty.textContent = "No dynamic projects yet.";
      projectsList.appendChild(empty);
      return;
    }

    state.projects.forEach((project) => {
      const card = document.createElement("article");
      card.className = "admin-project";

      const text = document.createElement("div");
      const title = document.createElement("h3");
      title.textContent = project.title;

      const meta = document.createElement("p");
      meta.textContent = `${project.type} - order ${project.sort_order}`;

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
      editButton.textContent = "Edit";
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
      projectsList.appendChild(card);
    });
  };

  const loadProjects = async () => {
    const { data, error } = await state.client
      .from("portfolio_projects")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });

    if (error) {
      setStatus(formatSupabaseError(error), "error");
      return;
    }

    state.projects = data || [];
    renderProjects();
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

  const saveProject = async (event) => {
    event.preventDefault();

    const payload = getProjectPayload();
    if (!payload.title || !payload.description) {
      setStatus("Title and description are required.", "error");
      return;
    }

    submitButton.disabled = true;
    submitButton.textContent = getImageFile()
      ? "Uploading photo..."
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
        : state.client.from("portfolio_projects").insert(payload);

      const { error } = await query;

      if (error) {
        setStatus(formatSupabaseError(error), "error");
        return;
      }

      setStatus(
        state.editingId ? "Project updated." : "Project added.",
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
