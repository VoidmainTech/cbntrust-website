const logoLoader = document.querySelector("#logoLoader");
const logoLoaderBar = document.querySelector("#logoLoaderBar");
const logoLoaderPercent = document.querySelector("#logoLoaderPercent");

if (logoLoader) {
  document.body.classList.add("loader-active");
  const hasSeenLoader = window.sessionStorage.getItem("cbnTrustLoaderSeen") === "true";
  const duration = hasSeenLoader ? 260 : 650;
  const holdAfterComplete = hasSeenLoader ? 80 : 140;

  const setLoaderProgress = (value) => {
    const progress = Math.min(100, Math.max(0, Math.round(value)));
    if (logoLoaderBar) logoLoaderBar.style.width = `${progress}%`;
    if (logoLoaderPercent) logoLoaderPercent.textContent = `${progress}%`;
    logoLoader.setAttribute("aria-label", `Loading CBN Trust ${progress}%`);
  };

  const hideLogoLoader = () => {
    setLoaderProgress(100);
    window.sessionStorage.setItem("cbnTrustLoaderSeen", "true");
    window.setTimeout(() => {
      logoLoader.classList.add("done");
      document.body.classList.remove("loader-active");
    }, holdAfterComplete);
    window.setTimeout(() => logoLoader.remove(), holdAfterComplete + 650);
  };

  setLoaderProgress(0);
  window.setTimeout(() => setLoaderProgress(100), Math.max(120, duration - 120));
  window.setTimeout(hideLogoLoader, duration);
}

const header = document.querySelector(".site-header");
const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");

function syncHeader() {
  if (!header) return;
  header.classList.toggle("scrolled", window.scrollY > 24);
}

window.addEventListener("scroll", syncHeader);
syncHeader();

if (menuToggle && navLinks) {
  menuToggle.addEventListener("click", () => {
    const open = navLinks.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(open));
    menuToggle.textContent = open ? "Close" : "Menu";
  });

  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.textContent = "Menu";
    });
  });
}

const revealObserver =
  "IntersectionObserver" in window
    ? new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("visible");
              revealObserver.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.14 }
      )
    : null;

document.querySelectorAll(".reveal").forEach((el) => {
  if (revealObserver) {
    revealObserver.observe(el);
  } else {
    el.classList.add("visible");
  }
});

const statObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = Number(el.dataset.count || 0);
      if (!target) return;
      let current = 0;
      const step = Math.max(1, Math.ceil(target / 42));
      const timer = window.setInterval(() => {
        current += step;
        if (current >= target) {
          current = target;
          window.clearInterval(timer);
        }
        el.textContent = `${current}+`;
      }, 24);
      statObserver.unobserve(el);
    });
  },
  { threshold: 0.4 }
);

document.querySelectorAll("[data-count]").forEach((el) => statObserver.observe(el));

document.querySelectorAll(".filter-button").forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;
    document.querySelectorAll(".filter-button").forEach((item) => {
      item.classList.remove("active");
      item.setAttribute("aria-pressed", "false");
    });
    button.classList.add("active");
    button.setAttribute("aria-pressed", "true");
    document.querySelectorAll(".gallery-item[data-category]").forEach((item) => {
      const shouldShow = filter === "all" || item.dataset.category === filter;
      item.classList.toggle("is-hidden", !shouldShow);
      if (shouldShow) item.classList.add("visible");
    });
  });
});
