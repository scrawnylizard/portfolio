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

// assets/js/app.js
new ThemePicker();
