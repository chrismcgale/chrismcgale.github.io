// Theme: warm-paper light is primary; dark honors saved choice or system preference.
(function () {
  const root = document.documentElement;

  function apply(theme) {
    root.setAttribute("data-theme", theme);
    const btn = document.querySelector(".theme-toggle");
    if (btn) btn.textContent = theme === "dark" ? "[light]" : "[dark]";
  }

  // Light is the site's default; dark only if the visitor chose it here.
  const saved = localStorage.getItem("theme");
  apply(saved || "light");

  document.addEventListener("DOMContentLoaded", function () {
    apply(root.getAttribute("data-theme"));
    const btn = document.querySelector(".theme-toggle");
    if (!btn) return;
    btn.addEventListener("click", function () {
      const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
      localStorage.setItem("theme", next);
      apply(next);
    });
  });
})();
