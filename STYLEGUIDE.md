---
layout: page
title: Style Guide
permalink: /styleguide/
---

# Style Guide

This is the canonical style reference for the personal website. All design decisions should be documented here before being implemented. Claude must read this file before making any styling changes.

---

## Colors

### Base Palette

| Role | Token | Hex | Notes |
|------|-------|-----|-------|
| Brand / Action | `$primary` | `#4582ec` | Bootstrap primary; links, active states |
| Near-black | `$color-void` | `#0A0A0A` | Letterbox bars, deep backgrounds |
| Off-white | `$color-highlight` | `#F5F0E8` | Warm white for text on dark surfaces |

### Marathon Palette (Cinematic / Hero Contexts)

Drawn from the Marathon reference image: high-saturation fire tones anchored by a neon lime accent and cool violet/magenta counterpoints.

| Role | Token | Hex | Notes |
|------|-------|-----|-------|
| Fire core | `$color-fire-deep` | `#C43000` | Darkest ember; shadows, depth layers |
| Fire mid | `$color-fire` | `#E85400` | Dominant background orange |
| Fire bright | `$color-fire-bright` | `#FF7A00` | Mid-range flame; highlight bands |
| Amber | `$color-amber` | `#FFB300` | Warm top-of-flame; gradient terminus |
| Neon lime | `$color-lime` | `#AAFF00` | High-voltage accent; display type, CTAs on dark |
| Violet | `$color-violet` | `#4422AA` | Cool counterpoint; left/right edge bleeds |
| Magenta | `$color-magenta` | `#FF1478` | Hot-pink pop; used sparingly for tension |

#### Usage rules

- The fire gradient (`$color-fire-deep` → `$color-fire` → `$color-fire-bright` → `$color-amber`) is for hero/full-bleed backgrounds only — not UI chrome.
- `$color-lime` is the sole light-on-dark accent. One instance per viewport at most; overuse destroys impact.
- `$color-violet` and `$color-magenta` are edge/bleed accents, never dominant fills.
- All Marathon palette colors must appear against `$color-void` or a fire-gradient background; never on white.

---

## Typography

### Typefaces

| Role | Value |
|------|-------|
| Body (prose) | Georgia, Cambria, "Times New Roman", serif |
| UI / headings | System sans-serif stack (default Bootstrap) |
| Display (Marathon) | Wide-tracked uppercase sans — `letter-spacing: 0.25em` minimum |

### Marathon Display Type

Large hero text uses extreme letter-spacing and all-caps to match the cinematic titling style in the reference image.

```scss
.display-marathon {
  text-transform: uppercase;
  letter-spacing: 0.25em;
  font-weight: 700;
  color: $color-lime;          // default: neon lime on dark
  line-height: 1;
}
```

HUD / telemetry labels (small metadata beneath hero content) use monospace, low opacity:

```scss
.label-hud {
  font-family: "Courier New", Courier, monospace;
  font-size: 0.65rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  opacity: 0.55;
  color: $color-amber;
}
```

---

## Spacing

<!-- Document the spacing scale and usage rules here -->

---

## Layout

### Letterbox

Hero sections may use a letterbox treatment — `$color-void` bars (top and bottom, ~5–8 vh each) cropping the visible content area to a 2.39:1 cinematic ratio. This is achieved with padding or pseudo-elements, not by clipping the background.

---

## Background Patterns

### Fire Gradient

The primary hero background: a multi-stop linear gradient moving from deep ember at the bottom to bright amber at the top, with orange as the dominant mid-zone.

```scss
.bg-fire {
  background: linear-gradient(
    180deg,
    $color-amber      0%,
    $color-fire-bright 30%,
    $color-fire        60%,
    $color-fire-deep   100%
  );
}
```

### Scanline Overlay

A repeating horizontal-line texture evokes a CRT or broadcast monitor. Applied as a `::after` pseudo-element so it doesn't interfere with content stacking.

```scss
.bg-scanlines::after {
  content: "";
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: repeating-linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.12) 0px,
    rgba(0, 0, 0, 0.12) 1px,
    transparent         1px,
    transparent         3px
  );
  mix-blend-mode: multiply;
  z-index: 1;
}
```

Line pitch: 3 px (1 px dark / 2 px transparent). Increase pitch to 4–5 px on mobile for legibility.

### Color Band Overlay

Translucent vertical or horizontal color blocks layered over the fire gradient create the multi-plane glitch depth seen in the reference image. Each band is a `position: absolute` element with reduced opacity.

```scss
// Example: violet edge bleed (right side)
.bg-band-violet {
  background: $color-violet;
  opacity: 0.35;
  mix-blend-mode: screen;
}

// Example: magenta mid-band
.bg-band-magenta {
  background: $color-magenta;
  opacity: 0.25;
  mix-blend-mode: screen;
}
```

Use `mix-blend-mode: screen` on color bands over the fire gradient to preserve luminosity. Keep total layered opacity of any one area below 0.5 to avoid muddying the base.

### Pixel / Block Glitch

High-contrast rectangular blocks (white-on-orange or lime-on-dark) at irregular intervals evoke the pixelated crown shapes in the reference image. These are decorative only and must not obscure readable content. Implement as SVG or CSS `box-shadow` lists — not images — to keep them resolution-independent.

---

## Components

<!-- Document per-component decisions here (Navbar, Footer, Buttons, Cards, etc.) -->

---

## Voice & Tone

<!-- Document writing guidelines here -->
