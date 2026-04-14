function getStoredTheme() {
  try {
    return localStorage.getItem("theme");
  } catch {
    return null;
  }
}

function setStoredTheme(theme) {
  try {
    localStorage.setItem("theme", theme);
  } catch {
    // ignore
  }
}

function applyTheme(theme) {
  const root = document.documentElement;
  if (theme === "light") root.setAttribute("data-theme", "light");
  else root.removeAttribute("data-theme");

  const toggle = document.querySelector(".theme-toggle");
  if (toggle) toggle.setAttribute("aria-pressed", theme === "light" ? "true" : "false");
}

function detectPreferredTheme() {
  const stored = getStoredTheme();
  if (stored === "light" || stored === "dark") return stored;

  const prefersLight = window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches;
  return prefersLight ? "light" : "dark";
}

function setupThemeToggle() {
  const toggle = document.querySelector(".theme-toggle");
  if (!toggle) return;

  toggle.addEventListener("click", () => {
    const isLight = document.documentElement.getAttribute("data-theme") === "light";
    const next = isLight ? "dark" : "light";
    applyTheme(next);
    setStoredTheme(next);
  });
}

function setupMobileNav() {
  const toggle = document.querySelector(".nav-toggle");
  const links = document.querySelector("#nav-links");
  if (!toggle || !links) return;

  function close() {
    links.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
  }

  toggle.addEventListener("click", () => {
    const isOpen = links.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
  });

  links.addEventListener("click", (e) => {
    const target = e.target;
    if (target && target.tagName === "A") close();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") close();
  });

  document.addEventListener("click", (e) => {
    const t = e.target;
    if (!t) return;
    if (links.contains(t) || toggle.contains(t)) return;
    close();
  });
}

function setupFooterYear() {
  const year = document.querySelector("#year");
  if (year) year.textContent = String(new Date().getFullYear());
}

function setupContactCopy() {
  const form = document.querySelector("#contact-form");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const fd = new FormData(form);
    const name = String(fd.get("name") || "").trim();
    const email = String(fd.get("email") || "").trim();
    const message = String(fd.get("message") || "").trim();

    const subject = encodeURIComponent(`Message from ${name} via Portfolio`);
    const body = encodeURIComponent(
      `Hi Arnav,\n\nMy name: ${name}\nMy email: ${email}\n\n${message}\n\n— Sent from your portfolio site`
    );

    const button = form.querySelector('button[type="submit"]');
    const oldLabel = button ? button.textContent : "";

    window.location.href = `mailto:arnavsharma.1724@gmail.com?subject=${subject}&body=${body}`;

    if (button) button.textContent = "Opening email client...";
    setTimeout(() => {
      if (button) button.textContent = oldLabel || "Send Message";
    }, 2000);

    form.reset();
  });
}

// init
applyTheme(detectPreferredTheme());
setupThemeToggle();
setupMobileNav();
setupFooterYear();
setupContactCopy();

