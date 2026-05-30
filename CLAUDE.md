# Portfolio — Claude Instructions

## Style Guide Requirement

**Before making ANY styling, design, or UI change to this site, you MUST:**

1. Read `STYLEGUIDE.md` in full
2. Ensure your changes align with what is documented there
3. If your change introduces a new pattern not yet in the guide, note it to the user — update `STYLEGUIDE.md` only when explicitly asked

This applies to: colors, typography, spacing, layout, component styles, animations, and any visual property.

## Project Overview

- **Framework:** Eleventy (11ty) static site generator
- **Hosting:** GitHub Pages (deployed via GitHub Actions → `gh-pages` branch)
- **Styling:** Sass/SCSS compiled by `@11ty/eleventy-sass`; Bootstrap 5.3.6 (Bootswatch Litera theme)
- **Key style files:**
  - `STYLEGUIDE.md` — canonical design decisions (read this first)
  - `_sass/_variables.scss` — Bootstrap token overrides
  - `_sass/_bootstrap_customization.scss` — component-level custom overrides
  - `assets/main.scss` — Sass entry point (imports order matters)
- **Templates:** `_layouts/` and `_includes/` (Nunjucks partials)
- **Homepage:** `index.html` (Bootstrap Cover template pattern)
- **Config:** `.eleventy.js` — 11ty configuration; `_data/site.js` — site-wide variables

## Development Notes

- The `_sass/bootstrap/` directory is vendored Bootstrap source — do not edit it
- Compiled output lives in `assets/dist/` — do not edit directly; it is generated
- Run `npm run build` to build; `npm start` to serve locally with live reload
- 11ty compiles `assets/main.scss` → `_site/assets/main.css` via `@11ty/eleventy-sass`
