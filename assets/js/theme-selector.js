// assets/js/theme-selector.js
(function() {
  var STORAGE_KEY = "portfolio-theme";
  function applyTheme(theme) {
    if (theme) {
      document.documentElement.setAttribute("data-theme", theme);
    } else {
      document.documentElement.removeAttribute("data-theme");
    }
  }
  function saveTheme(theme) {
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch (_) {
    }
  }
  function loadTheme() {
    try {
      return localStorage.getItem(STORAGE_KEY) || "";
    } catch (_) {
      return "";
    }
  }
  var picker = document.getElementById("theme-picker");
  if (!picker) return;
  picker.value = loadTheme();
  picker.addEventListener("change", function(e) {
    applyTheme(e.target.value);
    saveTheme(e.target.value);
  });
})();
