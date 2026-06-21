// ========== MENU MOBILE ==========
const showMenu = (toggleId, navId) => {
  const toggle = document.getElementById(toggleId);
  const nav = document.getElementById(navId);

  if (!toggle || !nav) {
    console.error("Menu elements not found. Check your IDs.");
    return;
  }

  const toggleMenu = () => {
    nav.classList.toggle("show");
    const icon = toggle.querySelector("i");
    if (icon) {
      icon.classList.toggle("bx-menu");
      icon.classList.toggle("bx-x");
    }
  };

  toggle.addEventListener("click", toggleMenu);

  const closeMenu = () => {
    if (nav.classList.contains("show")) {
      nav.classList.remove("show");
      const icon = toggle.querySelector("i");
      if (icon) {
        icon.classList.remove("bx-x");
        icon.classList.add("bx-menu");
      }
    }
  };

  document.addEventListener("click", (e) => {
    if (!nav.contains(e.target) && !toggle.contains(e.target)) {
      closeMenu();
    }
  });

  // Fermer le menu uniquement pour les liens principaux, pas les sous-menus
  nav.querySelectorAll(".nav__link").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  // Fermer le menu pour les liens du sous-menu "Project"
  nav.querySelectorAll(".nav__dropdown-link").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });
};

// ========== EFFET SCROLL POUR CACHER LE HEADER ==========
const header = document.querySelector(".l-header");

let lastScrollY = window.scrollY;
let ticking = false;

function updateHeader() {
  const currentScrollY = window.scrollY;

  // Si on scroll vers le bas et qu'on a dépassé 50px
  if (currentScrollY > lastScrollY && currentScrollY > 50) {
    header.classList.add("l-header--hidden");
  }
  // Si on scroll vers le haut
  else if (currentScrollY < lastScrollY) {
    header.classList.remove("l-header--hidden");
  }

  lastScrollY = currentScrollY;
  ticking = false;
}

function onScroll() {
  if (!ticking) {
    requestAnimationFrame(updateHeader);
    ticking = true;
  }
}

// Écouter l'événement de scroll
window.addEventListener("scroll", onScroll);

// Version plus avancée avec débounce pour de meilleures performances
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Alternative avec debounce (optionnel)
const debouncedScroll = debounce(() => {
  const currentScrollY = window.scrollY;

  if (currentScrollY > lastScrollY && currentScrollY > 50) {
    header.classList.add("l-header--hidden");
  } else if (currentScrollY < lastScrollY) {
    header.classList.remove("l-header--hidden");
  }

  lastScrollY = currentScrollY;
}, 10);

// window.addEventListener('scroll', debouncedScroll);

// ========== DOCUMENT PRÊT ==========
document.addEventListener("DOMContentLoaded", () => {
  // Lecture vidéo plus rapide
  const video = document.querySelector(".portfolio__video");
  if (video) {
    video.playbackRate = 3;
  }

  // Lottie Animation
  const lottieContainer = document.getElementById("lottie-animation");
  if (window.lottie && lottieContainer) {
    lottie.loadAnimation({
      container: lottieContainer,
      renderer: "svg",
      loop: true,
      autoplay: true,
      path: "user-interface-research.json",
    });
  }

  // Menu Mobile
  showMenu("nav-toggle", "nav-menu");

  // Scroll - Active Link
  const sections = document.querySelectorAll("section[id]");
  const scrollActive = () => {
    const scrollY = window.pageYOffset;

    sections.forEach((current) => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 50;
      const sectionId = current.getAttribute("id");
      const navLink = document.querySelector(
        `.nav__menu a[href*="${sectionId}"]`,
      );

      if (!navLink) {
        return;
      }

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        navLink.classList.add("active");
      } else {
        navLink.classList.remove("active");
      }
    });
  };
  window.addEventListener("scroll", scrollActive);

  // Scroll Reveal - Factory
  if (window.ScrollReveal) {
    const createScrollReveal = (
      origin,
      distance = "150px",
      duration = 1500,
    ) => {
      return ScrollReveal({
        origin,
        distance,
        duration,
        reset: false,
      });
    };

    // Scroll Reveal - Top
    const srTop = createScrollReveal("top");
    srTop.reveal(".home__title");
    srTop.reveal(".home__subtitle", { delay: 50 });
    srTop.reveal(".home__scroll", { delay: 200 });
    srTop.reveal(".portfolio__img, .portfolio__item", { interval: 200 });

    // Scroll Reveal - Left
    const srLeft = createScrollReveal("left");
    srLeft.reveal(".home__cta", { delay: 100 });
    srLeft.reveal(".about__img", { delay: 400 });
    srLeft.reveal(".contact__subtitle, .contact__text", { interval: 200 });
    srLeft.reveal(".skills__subtitle");
    srLeft.reveal(".skill__icon-circle", { delay: 50, interval: 100 });
    srLeft.reveal(".reveal-left");

    // Scroll Reveal - Right
    const srRight = createScrollReveal("right");
    srRight.reveal(".about__subtitle", { delay: 100 });
    srRight.reveal(".about__profession", { delay: 150 });
    srRight.reveal(".about__social, .about__social-icon", {
      delay: 300,
      interval: 100,
    });
    srRight.reveal(".chart-container", { delay: 0 });
    srRight.reveal(".contact__input, .contact__button", { delay: 400 });
    srRight.reveal(".reveal-right");
  }

  // ========== EMAILJS INITIALIZATION ==========
  if (window.emailjs) {
    emailjs.init("1T3pm_3Sfc-bUvAHW"); // Get this from EmailJS dashboard
  }

  // ========== FORMULAIRE DE CONTACT ==========
  const contactForm = document.querySelector(".contact__form");
  if (contactForm) {
    contactForm.addEventListener("submit", function (event) {
      event.preventDefault();

      if (window.emailjs) {
        emailjs
          .sendForm("service_k2aerfo", "template_rj5fxem", this)
          .then(() => {
            if (window.Swal) {
              Swal.fire({
                title: "Message envoyé avec succès!",
                icon: "success",
                confirmButtonText: "OK",
              });
            } else {
              window.alert("Message envoyé avec succès!");
            }
          })
          .catch((error) => {
            console.error("Erreur:", error);
            if (window.Swal) {
              Swal.fire({
                title: "Erreur lors de l'envoi du message",
                icon: "error",
                confirmButtonText: "OK",
              });
            } else {
              window.alert("Erreur lors de l'envoi du message");
            }
          });
        return;
      }

      window.alert(
        "Le service de contact n'est pas disponible pour le moment.",
      );
    });
  }

  // ========== GRAPHIQUE RADAR ==========
  window.addEventListener("load", function () {
    const radarCanvas = document.getElementById("radarChart");
    if (!window.Chart || !radarCanvas) {
      return;
    }

    const ctx = radarCanvas.getContext("2d");

    function getResponsiveFontSize() {
      return window.innerWidth < 768 ? 10 : 14;
    }

    new Chart(ctx, {
      type: "radar",
      data: {
        labels: [
          "MongoDB",
          "Django",
          "Postman",
          "Express",
          "Supabase",
          "Fast-API",
          "NextJs",
        ],
        datasets: [
          {
            label: "Niveau de Maîtrise",
            data: [6, 5, 6, 7, 5, 5, 7],
            backgroundColor: "rgba(210, 232, 247, 0.5)",
            borderColor: "rgba(30, 136, 229, 0.8)",
            borderWidth: 2,
            pointBackgroundColor: "rgba(30, 136, 229, 1)",
            pointBorderColor: "#fff",
            pointHoverBackgroundColor: "#fff",
            pointHoverBorderColor: "rgba(30, 136, 229, 1)",
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
          duration: 2000,
          easing: "easeInOutQuart",
        },
        scales: {
          r: {
            beginAtZero: true,
            suggestedMax: 8,
            ticks: { display: false, stepSize: 2 },
            grid: { color: "rgba(0, 0, 0, 0.1)" },
            angleLines: { color: "rgba(0, 0, 0, 0.1)" },
            pointLabels: {
              font: {
                size: getResponsiveFontSize(),
                weight: "bold",
                family: "'Segoe UI', sans-serif",
              },
            },
          },
        },
        plugins: { legend: { display: false } },
      },
    });
  });
});
