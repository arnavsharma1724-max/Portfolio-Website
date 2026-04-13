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

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const fd = new FormData(form);
    const name = String(fd.get("name") || "").trim();
    const email = String(fd.get("email") || "").trim();
    const message = String(fd.get("message") || "").trim();

    const text = [
      `Hi Arnav,`,
      ``,
      `My name: ${name}`,
      `My email: ${email}`,
      ``,
      message,
      ``,
      `— Sent from your portfolio site`
    ].join("\n");

    const button = form.querySelector('button[type="submit"]');
    const oldLabel = button ? button.textContent : "";

    try {
      await navigator.clipboard.writeText(text);
      if (button) button.textContent = "Copied!";
      setTimeout(() => {
        if (button) button.textContent = oldLabel || "Copy message to clipboard";
      }, 1200);
    } catch {
      if (button) button.textContent = "Copy failed (select + copy)";
      const textarea = form.querySelector('textarea[name="message"]');
      if (textarea) textarea.focus();
    }
  });
}

// init
applyTheme(detectPreferredTheme());
setupThemeToggle();
setupMobileNav();
setupFooterYear();
setupContactCopy();

