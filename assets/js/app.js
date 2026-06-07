// assets/js/_elements/theme-picker.js
var STORAGE_KEY = "portfolio-theme";
var ThemePicker = class {
  constructor() {
    this.select = document.getElementById("theme-picker");
    if (!this.select) return;
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      this.applyTheme(saved);
      this.select.value = saved;
    }
    this.select.addEventListener("change", () => {
      const value = this.select.value;
      this.applyTheme(value);
      try {
        localStorage.setItem(STORAGE_KEY, value);
      } catch (_) {
      }
    });
  }
  applyTheme(theme) {
    document.documentElement.classList.remove("marathon", "cyber-daytime");
    if (theme) document.documentElement.classList.add(theme);
  }
};

// assets/js/_elements/nav-drawer.js
var NavDrawer = class {
  constructor() {
    this.toggle = document.getElementById("nav-toggle");
    this.drawer = document.getElementById("site-drawer");
    this.backdrop = document.getElementById("drawer-backdrop");
    this.closeBtn = document.getElementById("drawer-close");
    if (!this.toggle || !this.drawer) return;
    this.open = this.open.bind(this);
    this.close = this.close.bind(this);
    this.toggle.addEventListener("click", () => {
      this.isOpen() ? this.close() : this.open();
    });
    if (this.backdrop) this.backdrop.addEventListener("click", this.close);
    if (this.closeBtn) this.closeBtn.addEventListener("click", this.close);
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && this.isOpen()) this.close();
    });
    this.drawer.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", this.close);
    });
  }
  isOpen() {
    return this.drawer.classList.contains("is-open");
  }
  open() {
    this.drawer.classList.add("is-open");
    if (this.backdrop) this.backdrop.classList.add("is-open");
    this.toggle.setAttribute("aria-expanded", "true");
    this.drawer.setAttribute("aria-hidden", "false");
  }
  close() {
    this.drawer.classList.remove("is-open");
    if (this.backdrop) this.backdrop.classList.remove("is-open");
    this.toggle.setAttribute("aria-expanded", "false");
    this.drawer.setAttribute("aria-hidden", "true");
  }
};

// assets/js/app.js
new ThemePicker();
new NavDrawer();
