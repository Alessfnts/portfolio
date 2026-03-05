document.addEventListener("DOMContentLoaded", function () {
  // External links and document links should not replace the current portfolio page.
  document.querySelectorAll("a[href]").forEach((link) => {
    if (link.getAttribute("aria-disabled") === "true") return;

    const href = (link.getAttribute("href") || "").trim();
    if (!href || href.startsWith("#") || href.toLowerCase().startsWith("javascript:")) return;

    const isDocumentLink = /\.(pdf|xlsx|docx?|pptx?)($|[?#])/i.test(href);
    const isExternalLink = /^https?:\/\//i.test(href);

    if (isExternalLink || isDocumentLink) {
      link.setAttribute("target", "_blank");

      const relTokens = new Set(
        (link.getAttribute("rel") || "")
          .split(/\s+/)
          .filter(Boolean),
      );
      relTokens.add("noopener");
      if (isExternalLink) relTokens.add("noreferrer");
      link.setAttribute("rel", Array.from(relTokens).join(" "));
    }

    if (isDocumentLink && !link.hasAttribute("download")) {
      link.setAttribute("download", "");
    }
  });

  const progressBar = document.createElement("div");
  progressBar.className = "progress-bar";
  progressBar.style.transform = "scaleX(0)";
  document.body.prepend(progressBar);

  const mentionsTrigger = document.querySelector(".mentions-trigger");
  const mentionsModal = document.createElement("div");
  mentionsModal.className = "mentions-modal";
  mentionsModal.innerHTML = `
    <div class="mentions-content">
      <div class="mentions-header">
        <h2 class="mentions-title">Mentions Légales</h2>
        <button class="mentions-close">×</button>
      </div>
      <div class="mentions-body">
        <h3>1. Informations éditeur</h3>
        <p><strong>Alessandro FUENTES</strong><br>
        Étudiant BTS SIO Option SISR<br>
        Lycée René Cassin<br>
        Strasbourg, France</p>

        <h3>2. Hébergement</h3>
        <p>Ce portfolio est hébergé sur <strong>GitHub Pages</strong><br>
        GitHub Inc., 88 Market Street, San Francisco, CA 94105, USA</p>

        <h3>3. Contact</h3>
        <p><a href="mailto:aless.fuentes6@gmail.com" class="mentions-contact-mail">aless.fuentes6@gmail.com</a></p>

        <h3>4. Directeur de la publication</h3>
        <p>Alessandro FUENTES</p>

        <h3>5. URL du site</h3>
        <p>https://alessandro-fuentes.com</p>

        <h3>6. Propriété intellectuelle</h3>
        <p>Tous les contenus de ce portfolio (textes, icônes, design) sont
        la propriété exclusive d'Alessandro Fuentes, sauf mention contraire.</p>

        <h3>7. Données personnelles</h3>
        <ul>
          <li>Aucune donnée personnelle n'est collectée via ce portfolio</li>
          <li>L'adresse email est utilisée uniquement pour les contacts</li>
          <li>Aucun cookie tiers n'est déposé</li>
        </ul>

        <h3>8. Responsabilité</h3>
        <p>Les liens externes ouvrant vers d'autres sites ne sont pas
        sous la responsabilité de l'auteur. Le contenu est mis à jour
        régulièrement mais l'auteur ne peut être tenu responsable
        d'éventuelles erreurs.</p>

        <p><em>Dernière mise à jour : ${new Date().getFullYear()}</em></p>
      </div>
    </div>`;
  document.body.appendChild(mentionsModal);

  const mentionsClose = mentionsModal.querySelector(".mentions-close");

  mentionsTrigger?.addEventListener("click", (e) => {
    e.preventDefault();
    mentionsModal.classList.add("active");
  });

  mentionsClose.addEventListener("click", () => {
    mentionsModal.classList.remove("active");
  });

  mentionsModal.addEventListener("click", (e) => {
    if (e.target === mentionsModal) mentionsModal.classList.remove("active");
  });

  const revealTargets = document.querySelectorAll(".header, .section");
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -20px 0px" },
    );

    revealTargets.forEach((el) => observer.observe(el));
  } else {
    revealTargets.forEach((el) => el.classList.add("visible"));
  }

  let scrollTicking = false;
  const updateProgressBar = () => {
    const scrollTop = window.pageYOffset;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const ratio = docHeight > 0 ? Math.min(Math.max(scrollTop / docHeight, 0), 1) : 0;
    progressBar.style.transform = `scaleX(${ratio})`;
    scrollTicking = false;
  };

  const handleScroll = () => {
    if (scrollTicking) return;
    scrollTicking = true;
    window.requestAnimationFrame(updateProgressBar);
  };

  window.addEventListener("scroll", handleScroll, { passive: true });
  window.addEventListener("resize", handleScroll);
  handleScroll();

  const progressBars = document.querySelectorAll(".loading-progress");
  if (progressBars.length) {
    progressBars.forEach((el) => {
      const targetWidth = el.style.width || el.getAttribute("data-progress");
      if (!targetWidth) return;
      el.dataset.progress = targetWidth;
      el.style.width = "0%";
      el.style.transition = "width 1.2s ease";

      void el.offsetWidth;
    });

    if ("IntersectionObserver" in window) {
      const progressObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            const el = entry.target;
            const targetWidth = el.dataset.progress;
            if (targetWidth) el.style.width = targetWidth;
            progressObserver.unobserve(el);
          });
        },
        { threshold: 0.3 },
      );

      progressBars.forEach((el) => progressObserver.observe(el));
    } else {
      progressBars.forEach((el) => {
        const targetWidth = el.dataset.progress;
        if (targetWidth) el.style.width = targetWidth;
      });
    }
  }
}); // <-- bien fermer ici

