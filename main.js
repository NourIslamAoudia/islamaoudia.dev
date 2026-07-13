// ========== MULTILINGUAL CONTENT ==========
const supportedLanguages = ["en", "it", "fr"];
const defaultLanguage = "en";

const getSavedLanguage = () => {
  try {
    return window.localStorage.getItem("portfolioLanguage");
  } catch (error) {
    return null;
  }
};

const getInitialLanguage = () => {
  const savedLanguage = getSavedLanguage();
  if (supportedLanguages.includes(savedLanguage)) {
    return savedLanguage;
  }

  const browserLanguage = (navigator.language || "").slice(0, 2).toLowerCase();
  return supportedLanguages.includes(browserLanguage)
    ? browserLanguage
    : defaultLanguage;
};

let currentLanguage = getInitialLanguage();

const translations = {
  en: {
    "meta.title":
      "Nour Islam Aoudia | junior Backend Developer & Cybersecurity Student | Django, FastAPI, Express.js",
    "meta.description":
      "Nour Islam Aoudia - junior Backend Developer & Cybersecurity Student. Proficient in Django, FastAPI, Express.js, MongoDB, PostgreSQL. Creating secure REST APIs and full-stack web applications.",
    "nav.home": "Home",
    "nav.about": "About",
    "nav.skills": "Skills",
    "nav.cybersecurity": "Cybersecurity",
    "nav.projects": "Project",
    "nav.apis": "API's - Backend",
    "nav.fullstack": "Full Stack",
    "nav.wordpress": "WordPress",
    "nav.certificates": "Certificates",
    "nav.contact": "Contact",
    "home.subtitle":
      'Student & Founder <a href="https://webfast-dz.vercel.app" target="_blank" class="webfast-link" rel="noopener noreferrer">WEBFAST DZ</a>',
    "home.resume": "Download Resume",
    "home.discover": "Discover",
    "about.title": "About Me",
    "about.subtitle": "Hello, I'm Nour Islam Aoudia",
    "about.profession": "Cybersecurity Student & junior Backend Developer",
    "about.text":
      "Fourth-year Computer Science student at USTHB with 10+ projects led, including secure APIs (Django, FastAPI, Express.js), full-stack apps (React, Next.js), and a WooCommerce plugin for the Algerian market. Experienced with Vercel and Render for scalable, secure deployments. Built tools like SecureComm-System and a Cloud Security Lab, blending performance with strong security practices.",
    "about.info.backend":
      "<strong>Backend Development:</strong> Designing secure REST APIs with <b>Django</b>, <b>FastAPI</b>, and <b>Express.js</b> - JWT authentication, unit testing, and Swagger documentation.",
    "about.info.database":
      "<strong>Database Management & Security:</strong> SQL/NoSQL modeling and optimization on <b>MySQL</b>, <b>PostgreSQL</b>, <b>MongoDB</b>, and <b>Supabase</b>.",
    "about.info.cyber":
      "<strong>Cybersecurity & Cloud Security:</strong> Deploying a <b>Cloud Security Lab</b> with Kali Linux, penetration testing (SQLi, XSS, MITM), OWASP ZAP audits, and AES/RSA encryption.",
    "about.info.deployment":
      "<strong>Deployment:</strong> Containerized deployment on <b>Render</b>, <b>Vercel</b>, and <b>PythonAnywhere</b>, with monitoring.",
    "about.info.fullstack":
      "<strong>Full-Stack Development:</strong> Building scalable web apps with <b>React.js</b>, <b>Next.js</b> - dynamic routing, API integration, SSR/CSR, and state management with context/hooks.",
    "about.info.frontend":
      "<strong>Sites & Frontend:</strong> Creating responsive showcases (HTML, CSS3, JS) and custom WordPress sites: PowerFit, SmileCare, Travel Agency, MDCoaching.",
    "skills.title": "Skills",
    "skills.subtitle": "Full-Stack Development",
    "chart.label": "Skill Level",
    "cyber.title": "Cybersecurity",
    "cyber.securecorp":
      "Zero Trust platform built with NestJS microservices: API Gateway, KDC, RBAC, ABAC, PDP, and Resource Service. Implements Kerberos-like login, mTLS between services, encrypted JWE session tickets, audit logging, and attack simulations for replay, tampering, and privilege escalation.",
    "cyber.secureCommunication":
      "Encrypted communication system with mutual authentication. Implements a secure protocol using RSA for key exchange and AES-256 for message encryption. Prevents MITM attacks via digital signatures.",
    "cyber.cloudLab":
      "Virtualized environment with comprehensive penetration tests: SQLi, XSS, MITM and vulnerability analysis. Secure configuration of Apache and SSH with advanced logging. Firewall implementation and network monitoring.",
    "cyber.cryptDecrypt":
      "Educational cryptography platform implementing classical algorithms (Caesar, Vigenere) and modern ones (AES, RSA). Frequency analysis tools and attacks on weak ciphers. Intuitive interface for learning.",
    "projects.title": "Projects",
    "projects.apis": "APIs - Backend",
    "projects.fullstack": "Full Stack Projects",
    "projects.wordpress": "WordPress Projects",
    "projects.other": "Other Projects",
    "project.nutritrack":
      "A robust RESTful API for nutrition tracking and calorie management, built with Node.js, Express, and MongoDB.",
    "project.wilayas":
      "REST API for Algerian wilayas and communes with automatic delivery fee calculation.",
    "project.contactManager":
      "A complete REST API for contact management with JWT authentication and route security.",
    "project.hrManager":
      "Human resources management API with JWT authentication and employee management.",
    "project.lamsa":
      "Centralized platform connecting physical business cards to digital profiles using unique codes. Allows instant access to user information when a card is scanned, with an admin management system.",
    "project.vamos":
      "A travel platform built with Django, featuring user and travel agency authentication, trip management and booking.",
    "project.alina":
      "Complete online store with WooCommerce, secure payments, inventory management and a custom dashboard.",
    "project.chausskids":
      "Custom WooCommerce store for an Algerian children's shoe brand with ECOTRACK delivery, live pricing, one-click dispatch, filters, size guide, and color variations.",
    "project.urbanmen":
      "Complete online store with WooCommerce, secure payment system, and advanced inventory management.",
    "project.checkout":
      "WooCommerce plugin for Algeria with support for all 58 wilayas and automatic delivery fee calculation.",
    "certificate.title": "Certificates",
    "certificate.fastapiTitle": "Backend Development with FastAPI",
    "certificate.fastapiText":
      "Certificate of completion for an intensive training in <strong>backend development</strong>, focusing on <strong>FastAPI and Python</strong>. The project involved creating a human resources management application (<strong>HR-Manager</strong>), including user authentication, employee and role management, and integration with an SQL database.",
    "certificate.ctoTitle": "Participation in CTO Forum 2025",
    "certificate.ctoSubtitle": "ICT Technologies Forum",
    "certificate.ctoText":
      "Participation in the <strong>CTO Forum 2025</strong>, a major event dedicated to innovations in <strong>cybersecurity</strong>, <strong>artificial intelligence</strong>, and <strong>IT technologies</strong>. A unique opportunity to <strong>meet specialized companies</strong>, network with industry experts, and receive guidance on professional development in the IT sector.",
    "contact.title": "Contact",
    "contact.email": "EMAIL",
    "contact.phone": "PHONE",
    "contact.address": "ADDRESS",
    "contact.location": "Algiers, Algeria",
    "form.name": "Name",
    "form.email": "Email",
    "form.message": "Your Message...",
    "form.send": "Send",
    "form.successTitle": "Message sent successfully!",
    "form.errorTitle": "Error while sending the message",
    "form.unavailable": "The contact service is not available right now.",
    "footer.text": "Developed by Nour Islam Aoudia. Thank you for visiting!",
    "footer.rights": "© 2026 All rights reserved.",
    "footer.explore": "EXPLORE",
    "footer.follow": "FOLLOW",
    "link.code": "Code",
    "link.sourceCode": "Source Code",
    "link.viewDemo": "View Demo",
    "link.demo": "Demo",
    "link.documentation": "Documentation",
    "link.testApi": "Test API",
    "link.canvaReport": "Canva Report",
    "link.webSite": "Web Site",
    "link.privateCode": "Private Code",
    "link.moreInfo": "More info",
    "privateCode.alert": "To access the code, please contact me.",
  },
  it: {
    "meta.title":
      "Nour Islam Aoudia | Sviluppatore Backend junior e studente di cybersecurity | Django, FastAPI, Express.js",
    "meta.description":
      "Nour Islam Aoudia - sviluppatore Backend junior e studente di cybersecurity. Competenze in Django, FastAPI, Express.js, MongoDB e PostgreSQL. Creo API REST sicure e applicazioni web full-stack.",
    "nav.home": "Home",
    "nav.about": "Chi sono",
    "nav.skills": "Competenze",
    "nav.cybersecurity": "Cybersecurity",
    "nav.projects": "Progetti",
    "nav.apis": "API - Backend",
    "nav.fullstack": "Full Stack",
    "nav.wordpress": "WordPress",
    "nav.certificates": "Certificati",
    "nav.contact": "Contatto",
    "home.subtitle":
      'Studente e fondatore di <a href="https://webfast-dz.vercel.app" target="_blank" class="webfast-link" rel="noopener noreferrer">WEBFAST DZ</a>',
    "home.resume": "Scarica CV",
    "home.discover": "Scopri",
    "about.title": "Chi sono",
    "about.subtitle": "Ciao, sono Nour Islam Aoudia",
    "about.profession": "Studente di cybersecurity e sviluppatore Backend junior",
    "about.text":
      "Studente al quarto anno di Informatica presso USTHB, con oltre 10 progetti realizzati, tra API sicure (Django, FastAPI, Express.js), applicazioni full-stack (React, Next.js) e un plugin WooCommerce per il mercato algerino. Esperienza con Vercel e Render per deploy scalabili e sicuri. Ho creato strumenti come SecureComm-System e un Cloud Security Lab, unendo performance e solide pratiche di sicurezza.",
    "about.info.backend":
      "<strong>Sviluppo Backend:</strong> progettazione di API REST sicure con <b>Django</b>, <b>FastAPI</b> ed <b>Express.js</b> - autenticazione JWT, test unitari e documentazione Swagger.",
    "about.info.database":
      "<strong>Database e sicurezza:</strong> modellazione e ottimizzazione SQL/NoSQL su <b>MySQL</b>, <b>PostgreSQL</b>, <b>MongoDB</b> e <b>Supabase</b>.",
    "about.info.cyber":
      "<strong>Cybersecurity e cloud security:</strong> deploy di un <b>Cloud Security Lab</b> con Kali Linux, penetration test (SQLi, XSS, MITM), audit OWASP ZAP e cifratura AES/RSA.",
    "about.info.deployment":
      "<strong>Deploy:</strong> deployment containerizzato su <b>Render</b>, <b>Vercel</b> e <b>PythonAnywhere</b>, con monitoraggio.",
    "about.info.fullstack":
      "<strong>Sviluppo Full-Stack:</strong> creazione di applicazioni web scalabili con <b>React.js</b> e <b>Next.js</b> - routing dinamico, integrazione API, SSR/CSR e gestione dello stato con context/hooks.",
    "about.info.frontend":
      "<strong>Siti e frontend:</strong> creazione di showcase responsive (HTML, CSS3, JS) e siti WordPress custom: PowerFit, SmileCare, Travel Agency, MDCoaching.",
    "skills.title": "Competenze",
    "skills.subtitle": "Sviluppo Full-Stack",
    "chart.label": "Livello di competenza",
    "cyber.title": "Cybersecurity",
    "cyber.securecorp":
      "Piattaforma Zero Trust basata su microservizi NestJS: API Gateway, KDC, RBAC, ABAC, PDP e Resource Service. Implementa login simile a Kerberos, mTLS tra servizi, ticket di sessione JWE cifrati, audit logging e simulazioni di attacco per replay, manomissione ed escalation dei privilegi.",
    "cyber.secureCommunication":
      "Sistema di comunicazione cifrata con autenticazione reciproca. Implementa un protocollo sicuro con RSA per lo scambio delle chiavi e AES-256 per cifrare i messaggi. Previene attacchi MITM tramite firme digitali.",
    "cyber.cloudLab":
      "Ambiente virtualizzato con penetration test completi: SQLi, XSS, MITM e analisi delle vulnerabilita. Configurazione sicura di Apache e SSH con logging avanzato, firewall e monitoraggio di rete.",
    "cyber.cryptDecrypt":
      "Piattaforma didattica di crittografia con algoritmi classici (Caesar, Vigenere) e moderni (AES, RSA). Include strumenti di analisi delle frequenze e attacchi a cifrari deboli, con interfaccia intuitiva per imparare.",
    "projects.title": "Progetti",
    "projects.apis": "API - Backend",
    "projects.fullstack": "Progetti Full Stack",
    "projects.wordpress": "Progetti WordPress",
    "projects.other": "Altri progetti",
    "project.nutritrack":
      "API REST robusta per il monitoraggio nutrizionale e la gestione delle calorie, costruita con Node.js, Express e MongoDB.",
    "project.wilayas":
      "API REST per wilaya e comuni algerini con calcolo automatico delle spese di consegna.",
    "project.contactManager":
      "API REST completa per la gestione dei contatti con autenticazione JWT e sicurezza delle rotte.",
    "project.hrManager":
      "API di gestione delle risorse umane con autenticazione JWT e gestione dei dipendenti.",
    "project.lamsa":
      "Piattaforma centralizzata che collega biglietti da visita fisici a profili digitali tramite codici unici. Permette accesso immediato alle informazioni dell'utente quando la carta viene scansionata, con sistema di amministrazione.",
    "project.vamos":
      "Piattaforma di viaggio costruita con Django, con autenticazione per utenti e agenzie, gestione dei viaggi e prenotazioni.",
    "project.alina":
      "Negozio online completo con WooCommerce, pagamenti sicuri, gestione dell'inventario e dashboard custom.",
    "project.chausskids":
      "Store WooCommerce custom per un brand algerino di scarpe per bambini, con consegna ECOTRACK, prezzi live, dispatch in un click, filtri, guida taglie e varianti colore.",
    "project.urbanmen":
      "Negozio online completo con WooCommerce, sistema di pagamento sicuro e gestione avanzata dell'inventario.",
    "project.checkout":
      "Plugin WooCommerce per l'Algeria con supporto per tutte le 58 wilaya e calcolo automatico delle spese di consegna.",
    "certificate.title": "Certificati",
    "certificate.fastapiTitle": "Sviluppo Backend con FastAPI",
    "certificate.fastapiText":
      "Certificato di completamento per una formazione intensiva in <strong>sviluppo backend</strong>, focalizzata su <strong>FastAPI e Python</strong>. Il progetto ha previsto la creazione di un'applicazione di gestione delle risorse umane (<strong>HR-Manager</strong>), con autenticazione utenti, gestione di dipendenti e ruoli, e integrazione con database SQL.",
    "certificate.ctoTitle": "Partecipazione al CTO Forum 2025",
    "certificate.ctoSubtitle": "Forum sulle tecnologie ICT",
    "certificate.ctoText":
      "Partecipazione al <strong>CTO Forum 2025</strong>, un importante evento dedicato alle innovazioni in <strong>cybersecurity</strong>, <strong>intelligenza artificiale</strong> e <strong>tecnologie IT</strong>. Un'occasione unica per <strong>incontrare aziende specializzate</strong>, fare networking con esperti del settore e ricevere orientamento sullo sviluppo professionale nell'IT.",
    "contact.title": "Contatto",
    "contact.email": "EMAIL",
    "contact.phone": "TELEFONO",
    "contact.address": "INDIRIZZO",
    "contact.location": "Algeri, Algeria",
    "form.name": "Nome",
    "form.email": "Email",
    "form.message": "Il tuo messaggio...",
    "form.send": "Invia",
    "form.successTitle": "Messaggio inviato con successo!",
    "form.errorTitle": "Errore durante l'invio del messaggio",
    "form.unavailable": "Il servizio di contatto non e disponibile al momento.",
    "footer.text": "Sviluppato da Nour Islam Aoudia. Grazie per la visita!",
    "footer.rights": "© 2026 Tutti i diritti riservati.",
    "footer.explore": "ESPLORA",
    "footer.follow": "SEGUI",
    "link.code": "Codice",
    "link.sourceCode": "Codice sorgente",
    "link.viewDemo": "Vedi demo",
    "link.demo": "Demo",
    "link.documentation": "Documentazione",
    "link.testApi": "Test API",
    "link.canvaReport": "Report Canva",
    "link.webSite": "Sito web",
    "link.privateCode": "Codice privato",
    "link.moreInfo": "Maggiori info",
    "privateCode.alert": "Per accedere al codice, contattami.",
  },
  fr: {
    "meta.title":
      "Nour Islam Aoudia | Développeur Backend junior et étudiant en cybersécurité | Django, FastAPI, Express.js",
    "meta.description":
      "Nour Islam Aoudia - développeur Backend junior et étudiant en cybersécurité. Maîtrise de Django, FastAPI, Express.js, MongoDB et PostgreSQL. Création d'API REST sécurisées et d'applications web full-stack.",
    "nav.home": "Accueil",
    "nav.about": "À propos",
    "nav.skills": "Compétences",
    "nav.cybersecurity": "Cybersécurité",
    "nav.projects": "Projets",
    "nav.apis": "API - Backend",
    "nav.fullstack": "Full Stack",
    "nav.wordpress": "WordPress",
    "nav.certificates": "Certificats",
    "nav.contact": "Contact",
    "home.subtitle":
      'Étudiant et fondateur de <a href="https://webfast-dz.vercel.app" target="_blank" class="webfast-link" rel="noopener noreferrer">WEBFAST DZ</a>',
    "home.resume": "Télécharger le CV",
    "home.discover": "Découvrir",
    "about.title": "À propos de moi",
    "about.subtitle": "Bonjour, je suis Nour Islam Aoudia",
    "about.profession": "Étudiant en cybersécurité et développeur Backend junior",
    "about.text":
      "Étudiant en quatrième année d'informatique à l'USTHB, avec plus de 10 projets réalisés, dont des API sécurisées (Django, FastAPI, Express.js), des applications full-stack (React, Next.js) et un plugin WooCommerce pour le marché algérien. Expérimenté avec Vercel et Render pour des déploiements scalables et sécurisés. J'ai construit des outils comme SecureComm-System et un Cloud Security Lab, en combinant performance et bonnes pratiques de sécurité.",
    "about.info.backend":
      "<strong>Développement Backend :</strong> conception d'API REST sécurisées avec <b>Django</b>, <b>FastAPI</b> et <b>Express.js</b> - authentification JWT, tests unitaires et documentation Swagger.",
    "about.info.database":
      "<strong>Gestion et sécurité des bases de données :</strong> modélisation et optimisation SQL/NoSQL sur <b>MySQL</b>, <b>PostgreSQL</b>, <b>MongoDB</b> et <b>Supabase</b>.",
    "about.info.cyber":
      "<strong>Cybersécurité et sécurité cloud :</strong> déploiement d'un <b>Cloud Security Lab</b> avec Kali Linux, tests d'intrusion (SQLi, XSS, MITM), audits OWASP ZAP et chiffrement AES/RSA.",
    "about.info.deployment":
      "<strong>Déploiement :</strong> déploiements containerisés sur <b>Render</b>, <b>Vercel</b> et <b>PythonAnywhere</b>, avec monitoring.",
    "about.info.fullstack":
      "<strong>Développement Full-Stack :</strong> création d'applications web scalables avec <b>React.js</b> et <b>Next.js</b> - routage dynamique, intégration API, SSR/CSR et gestion d'état avec context/hooks.",
    "about.info.frontend":
      "<strong>Sites et frontend :</strong> création de vitrines responsive (HTML, CSS3, JS) et de sites WordPress personnalisés : PowerFit, SmileCare, Travel Agency, MDCoaching.",
    "skills.title": "Compétences",
    "skills.subtitle": "Développement Full-Stack",
    "chart.label": "Niveau de maîtrise",
    "cyber.title": "Cybersécurité",
    "cyber.securecorp":
      "Plateforme Zero Trust construite avec des microservices NestJS : API Gateway, KDC, RBAC, ABAC, PDP et Resource Service. Elle implémente une connexion inspirée de Kerberos, du mTLS entre services, des tickets de session JWE chiffrés, des journaux d'audit et des simulations d'attaques par rejeu, altération et escalade de privilèges.",
    "cyber.secureCommunication":
      "Système de communication chiffrée avec authentification mutuelle. Il implémente un protocole sécurisé utilisant RSA pour l'échange de clés et AES-256 pour le chiffrement des messages. Il prévient les attaques MITM grâce aux signatures numériques.",
    "cyber.cloudLab":
      "Environnement virtualisé avec tests d'intrusion complets : SQLi, XSS, MITM et analyse de vulnérabilités. Configuration sécurisée d'Apache et SSH avec journalisation avancée, pare-feu et supervision réseau.",
    "cyber.cryptDecrypt":
      "Plateforme pédagogique de cryptographie implémentant des algorithmes classiques (César, Vigenère) et modernes (AES, RSA). Outils d'analyse fréquentielle et attaques sur chiffrements faibles, avec une interface intuitive pour apprendre.",
    "projects.title": "Projets",
    "projects.apis": "API - Backend",
    "projects.fullstack": "Projets Full Stack",
    "projects.wordpress": "Projets WordPress",
    "projects.other": "Autres projets",
    "project.nutritrack":
      "API REST robuste pour le suivi nutritionnel et la gestion des calories, construite avec Node.js, Express et MongoDB.",
    "project.wilayas":
      "API REST pour les wilayas et communes algériennes avec calcul automatique des frais de livraison.",
    "project.contactManager":
      "API REST complète pour la gestion des contacts avec authentification JWT et sécurisation des routes.",
    "project.hrManager":
      "API de gestion des ressources humaines avec authentification JWT et gestion des employés.",
    "project.lamsa":
      "Plateforme centralisée reliant des cartes de visite physiques à des profils numériques via des codes uniques. Elle permet un accès instantané aux informations de l'utilisateur lors du scan de la carte, avec un système d'administration.",
    "project.vamos":
      "Plateforme de voyage construite avec Django, avec authentification utilisateur et agence, gestion des voyages et réservation.",
    "project.alina":
      "Boutique en ligne complète avec WooCommerce, paiements sécurisés, gestion des stocks et tableau de bord personnalisé.",
    "project.chausskids":
      "Boutique WooCommerce personnalisée pour une marque algérienne de chaussures pour enfants, avec livraison ECOTRACK, prix en direct, dispatch en un clic, filtres, guide des tailles et variations de couleurs.",
    "project.urbanmen":
      "Boutique en ligne complète avec WooCommerce, système de paiement sécurisé et gestion avancée des stocks.",
    "project.checkout":
      "Plugin WooCommerce pour l'Algérie avec support des 58 wilayas et calcul automatique des frais de livraison.",
    "certificate.title": "Certificats",
    "certificate.fastapiTitle": "Développement Backend avec FastAPI",
    "certificate.fastapiText":
      "Certificat de complétion d'une formation intensive en <strong>développement backend</strong>, centrée sur <strong>FastAPI et Python</strong>. Le projet consistait à créer une application de gestion des ressources humaines (<strong>HR-Manager</strong>), incluant l'authentification utilisateur, la gestion des employés et des rôles, ainsi que l'intégration avec une base de données SQL.",
    "certificate.ctoTitle": "Participation au CTO Forum 2025",
    "certificate.ctoSubtitle": "Forum des technologies ICT",
    "certificate.ctoText":
      "Participation au <strong>CTO Forum 2025</strong>, un événement majeur dédié aux innovations en <strong>cybersécurité</strong>, <strong>intelligence artificielle</strong> et <strong>technologies IT</strong>. Une occasion unique de <strong>rencontrer des entreprises spécialisées</strong>, de réseauter avec des experts et de recevoir des conseils sur le développement professionnel dans le secteur IT.",
    "contact.title": "Contact",
    "contact.email": "EMAIL",
    "contact.phone": "TÉLÉPHONE",
    "contact.address": "ADRESSE",
    "contact.location": "Alger, Algérie",
    "form.name": "Nom",
    "form.email": "Email",
    "form.message": "Votre message...",
    "form.send": "Envoyer",
    "form.successTitle": "Message envoyé avec succès !",
    "form.errorTitle": "Erreur lors de l'envoi du message",
    "form.unavailable": "Le service de contact n'est pas disponible pour le moment.",
    "footer.text": "Développé par Nour Islam Aoudia. Merci pour votre visite !",
    "footer.rights": "© 2026 Tous droits réservés.",
    "footer.explore": "EXPLORER",
    "footer.follow": "SUIVRE",
    "link.code": "Code",
    "link.sourceCode": "Code source",
    "link.viewDemo": "Voir la démo",
    "link.demo": "Démo",
    "link.documentation": "Documentation",
    "link.testApi": "Tester l'API",
    "link.canvaReport": "Rapport Canva",
    "link.webSite": "Site web",
    "link.privateCode": "Code privé",
    "link.moreInfo": "Plus d'info",
    "privateCode.alert": "Pour accéder au code, contactez-moi.",
  },
};

const t = (key, language = currentLanguage) =>
  translations[language]?.[key] || translations[defaultLanguage][key] || key;

const setText = (selector, key) => {
  document.querySelectorAll(selector).forEach((element) => {
    element.textContent = t(key);
  });
};

const setHtml = (selector, key) => {
  document.querySelectorAll(selector).forEach((element) => {
    element.innerHTML = t(key);
  });
};

const setPlaceholder = (selector, key) => {
  document.querySelectorAll(selector).forEach((element) => {
    element.placeholder = t(key);
  });
};

const setValue = (selector, key) => {
  document.querySelectorAll(selector).forEach((element) => {
    element.value = t(key);
  });
};

const setIconText = (selector, key) => {
  document.querySelectorAll(selector).forEach((element) => {
    const icon = element.querySelector("i");
    element.textContent = "";
    if (icon) {
      element.appendChild(icon);
      element.appendChild(document.createTextNode(" "));
    }
    element.appendChild(document.createTextNode(t(key)));
  });
};

const setImageHtml = (selector, key) => {
  document.querySelectorAll(selector).forEach((element) => {
    const image = element.querySelector("img");
    element.innerHTML = `${image ? `${image.outerHTML} ` : ""}${t(key)}`;
  });
};

const updateMetadata = () => {
  document.documentElement.lang = currentLanguage;
  document.title = t("meta.title");

  const metaDescription = document.querySelector('meta[name="description"]');
  if (metaDescription) {
    metaDescription.setAttribute("content", t("meta.description"));
  }

  const ogTitle = document.querySelector('meta[property="og:title"]');
  const twitterTitle = document.querySelector('meta[name="twitter:title"]');
  const ogDescription = document.querySelector(
    'meta[property="og:description"]',
  );
  const twitterDescription = document.querySelector(
    'meta[name="twitter:description"]',
  );

  if (ogTitle) ogTitle.setAttribute("content", t("meta.title"));
  if (twitterTitle) twitterTitle.setAttribute("content", t("meta.title"));
  if (ogDescription) ogDescription.setAttribute("content", t("meta.description"));
  if (twitterDescription) {
    twitterDescription.setAttribute("content", t("meta.description"));
  }
};

const updateRadarChartLanguage = () => {
  const chart = window.portfolioRadarChart;
  if (!chart?.data?.datasets?.length) {
    return;
  }

  chart.data.datasets[0].label = t("chart.label");
  chart.update();
};

const applyLanguage = (language) => {
  currentLanguage = supportedLanguages.includes(language)
    ? language
    : defaultLanguage;

  updateMetadata();

  setText('.nav__link[href="#home"]', "nav.home");
  setText('.nav__link[href="#about"]', "nav.about");
  setText('.nav__link[href="#skills"]', "nav.skills");
  setText('.nav__link[href="#cybersecurity"]', "nav.cybersecurity");
  setHtml(".nav__dropdown > .nav__link", "nav.projects");
  document.querySelectorAll(".nav__dropdown > .nav__link").forEach((link) => {
    link.insertAdjacentHTML("beforeend", '<i class="bx bx-chevron-down"></i>');
  });
  setText('.nav__dropdown-link[href="#autres"]', "nav.apis");
  setText('.nav__dropdown-link[href="#fullstack"]', "nav.fullstack");
  setText('.nav__dropdown-link[href="#wordpress"]', "nav.wordpress");
  setText('.nav__link[href="#certificat"]', "nav.certificates");
  setText('.nav__link[href="#contact"]', "nav.contact");

  setHtml(".home__subtitle", "home.subtitle");
  setIconText(".home__cta-btn", "home.resume");
  setIconText(".home__scroll-link", "home.discover");

  setText("#about .section-title", "about.title");
  setText(".about__subtitle", "about.subtitle");
  setText(".about__profession b", "about.profession");
  setText(".about__text", "about.text");
  setImageHtml(".about__info:nth-child(1)", "about.info.backend");
  setImageHtml(".about__info:nth-child(2)", "about.info.database");
  setImageHtml(".about__info:nth-child(3)", "about.info.cyber");
  setImageHtml(".about__info:nth-child(4)", "about.info.deployment");
  setImageHtml(".about__info:nth-child(5)", "about.info.fullstack");
  setImageHtml(".about__info:nth-child(6)", "about.info.frontend");

  setText("#skills .section-title", "skills.title");
  setText(".skills__subtitle", "skills.subtitle");

  setText("#cybersecurity > .section-title", "cyber.title");

  setText("#portfolio .section-title", "projects.title");
  setText("#autres .portfolio-subsection-title", "projects.apis");
  setText("#fullstack .portfolio-subsection-title", "projects.fullstack");
  setText("#wordpress .portfolio-subsection-title", "projects.wordpress");
  setText("#other-projects .portfolio-subsection-title", "projects.other");

  setText("#certificat > .section-title", "certificate.title");
  setText("#certificat > .certificat__container .certificat__title", "certificate.fastapiTitle");
  setHtml(
    "#certificat > .certificat__container .certificat__description",
    "certificate.fastapiText",
  );
  setText("#cto-forum .section-title", "certificate.ctoTitle");
  setText("#cto-forum .certificat__title", "certificate.ctoSubtitle");
  setHtml("#cto-forum .certificat__description", "certificate.ctoText");

  setText("#contact .section-title", "contact.title");
  setText(".contact__subtitle:nth-of-type(1)", "contact.email");
  setText(".contact__subtitle:nth-of-type(2)", "contact.phone");
  setText(".contact__subtitle:nth-of-type(3)", "contact.address");
  setText(".contact__text:nth-of-type(3)", "contact.location");
  setPlaceholder('input[name="name"]', "form.name");
  setPlaceholder('input[name="email"]', "form.email");
  setPlaceholder('textarea[name="message"]', "form.message");
  setValue(".contact__button", "form.send");

  setText(".footer__text", "footer.text");
  setText(".footer__data:first-child p:last-child", "footer.rights");
  setText(".footer__data:nth-child(2) .footer__title", "footer.explore");
  setText(".footer__data:nth-child(3) .footer__title", "footer.follow");
  setText('.footer__link[href="#home"]', "nav.home");
  setText('.footer__link[href="#about"]', "nav.about");
  setText('.footer__link[href="#skills"]', "nav.skills");
  setText('.footer__link[href="#cybersecurity"]', "nav.cybersecurity");
  setText('.footer__link[href="#portfolio"]', "projects.title");
  setText('.footer__link[href="#certificat"]', "nav.certificates");
  setText('.footer__link[href="#contact"]', "nav.contact");

  document.querySelectorAll(".language-switcher__button").forEach((button) => {
    const isActive = button.dataset.lang === currentLanguage;
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });

  updateRadarChartLanguage();
  window.refreshDynamicProjectLanguages?.();
};

const initLanguageSwitcher = () => {
  document.querySelectorAll(".language-switcher__button").forEach((button) => {
    button.addEventListener("click", () => {
      const language = button.dataset.lang;
      if (!supportedLanguages.includes(language)) {
        return;
      }

      try {
        window.localStorage.setItem("portfolioLanguage", language);
      } catch (error) {
        // localStorage can be blocked in private browsing modes.
      }

      applyLanguage(language);
    });
  });

  applyLanguage(currentLanguage);
};

window.applyPortfolioLanguage = () => applyLanguage(currentLanguage);
window.getPortfolioLanguage = () => currentLanguage;
window.getPortfolioTranslation = (key) => t(key);
window.showPrivateCodeNotice = (event) => {
  event.preventDefault();
  window.alert(t("privateCode.alert"));
  document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
};

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
  initLanguageSwitcher();

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
      distance = "80px",
      duration = 700,
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
    srTop.reveal(".home__scroll", { delay: 100 });
    srTop.reveal(".portfolio__img, .portfolio__item", { interval: 80 });

    // Scroll Reveal - Left
    const srLeft = createScrollReveal("left");
    srLeft.reveal(".home__cta", { delay: 80 });
    srLeft.reveal(".about__img", { delay: 120 });
    srLeft.reveal(".contact__subtitle, .contact__text", { interval: 80 });
    srLeft.reveal(".skills__subtitle");
    srLeft.reveal(".skill__icon-circle", { delay: 40, interval: 45 });
    srLeft.reveal(".reveal-left");

    // Scroll Reveal - Right
    const srRight = createScrollReveal("right");
    srRight.reveal(".about__subtitle", { delay: 70 });
    srRight.reveal(".about__profession", { delay: 90 });
    srRight.reveal(".about__social, .about__social-icon", {
      delay: 100,
      interval: 60,
    });
    srRight.reveal(".chart-container", { delay: 0 });
    srRight.reveal(".contact__input, .contact__button", { delay: 120 });
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
                title: t("form.successTitle"),
                icon: "success",
                confirmButtonText: "OK",
              });
            } else {
              window.alert(t("form.successTitle"));
            }
          })
          .catch((error) => {
            console.error("Erreur:", error);
            if (window.Swal) {
              Swal.fire({
                title: t("form.errorTitle"),
                icon: "error",
                confirmButtonText: "OK",
              });
            } else {
              window.alert(t("form.errorTitle"));
            }
          });
        return;
      }

      window.alert(t("form.unavailable"));
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

    window.portfolioRadarChart = new Chart(ctx, {
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
            label: t("chart.label"),
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
          duration: 800,
          easing: "easeOutQuart",
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
