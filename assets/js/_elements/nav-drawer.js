export default class NavDrawer {
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

    // dismiss after following an in-page link so the section is visible
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
}
