const STORAGE_KEY = "portfolio-theme";

export default class ThemePicker {
  constructor() {
    this.select = document.getElementById("theme-picker");
    if (!this.select) return;

    // Restore saved theme
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
      } catch (_) {}
    });
  }

  applyTheme(theme) {
    document.documentElement.classList.remove("marathon", "cyber-daytime");
    if (theme) document.documentElement.classList.add(theme);
  }
}
