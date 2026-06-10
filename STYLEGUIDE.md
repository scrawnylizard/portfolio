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
| Brand / Action | `$primary` | `#4582ec` | Links, active states, accent color |
| Near-black | `$color-void` | `#0A0A0A` | Default light-mode text; letterbox bars, deep backgrounds |
| Off-white | `$color-highlight` | `#F5F0E8` | Default light-mode page background; text on dark surfaces |

#### Light / dark mode

The default theme supports both light and dark modes automatically, adapting to the visitor's system preference:

- **Light mode** — background: `#F5F0E8` (color-highlight); text: `#0A0A0A` (color-void)
- **Dark mode** — background: a deep tone derived from the primary blue; text: a desaturated near-white

Neither Marathon nor Cyber Daytime activates dark mode independently — they override the color palette entirely (see themes below).

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

- The fire gradient (`#C43000` → `#E85400` → `#FF7A00` → `#FFB300`) is for hero/full-bleed backgrounds only — not UI chrome.
- `#AAFF00` (lime) is the sole light-on-dark accent. One instance per viewport at most; overuse destroys impact.
- `#4422AA` (violet) and `#FF1478` (magenta) are edge/bleed accents, never dominant fills.
- All Marathon palette colors must appear against `#0A0A0A` or a fire-gradient background; never on white.

### Cyber Daytime Palette (Light / High-Energy Contexts)

High-saturation, high-brightness tones evoking digital screens in harsh daylight: electric blue sky, neon yellow sun, sharp green, warm coral, and near-pure white.

| Role | Token | Hex | RGB | Notes |
|------|-------|-----|-----|-------|
| Sky / Primary | `$cd-ocean` | `#3C91E6` | 60, 145, 230 | Bright cerulean; primary action color in this theme |
| Solar accent | `$cd-yellow` | `#FFFF3F` | 255, 255, 63 | Electric yellow; display type and highlights on dark/mid surfaces only |
| Charge / Success | `$cd-green` | `#A2D729` | 162, 215, 41 | Yellow-green; active states, success indicators |
| Surface | `$cd-porcelain` | `#FAFFFD` | 250, 255, 253 | Near-white with a cool mint undertone; page background, card surfaces |
| Warmth / CTA | `$cd-coral` | `#FA824C` | 250, 130, 76 | Coral-orange; primary call-to-action buttons, hover states, human warmth |

#### Usage rules

- `#FAFFFD` (porcelain) is the default page background in the Cyber Daytime theme — not pure white.
- `#FFFF3F` (yellow) has insufficient contrast on porcelain for body text; use it only as a fill/background, large display type on `#3C91E6`, or decorative elements.
- `#3C91E6` (ocean) and `#FA824C` (coral) are the two action colors. Use one per UI region — don't mix them on a single button row.
- `#A2D729` (green) is reserved for positive/active state feedback; avoid using it purely decoratively so it retains semantic meaning.
- This palette is for light-mode surfaces. Do not combine it with the Marathon palette's fire tones in the same section.

---

## Typography

### Typefaces

| Role | Value |
|------|-------|
| Body (prose) | Georgia, Cambria, "Times New Roman", serif |
| UI / headings | System sans-serif stack |
| Display (Marathon) | Wide-tracked uppercase sans — `letter-spacing: 0.25em` minimum |

### Marathon Display Type

Large hero text uses extreme letter-spacing and all-caps to match the cinematic titling style in the reference image.

Display marathon text: `uppercase`, `letter-spacing: 0.25em`, `font-weight: 700`, `color: #AAFF00` (lime), `line-height: 1`.

HUD / telemetry labels (small metadata beneath hero content) use monospace, low opacity:
`font-family: monospace`, `font-size: 0.65rem`, `letter-spacing: 0.08em`, `text-transform: uppercase`, `opacity: 0.55`, `color: #FFB300` (amber).

### Permanent Marker Greeting (Hero)

The homepage hero pairs an oversized **Permanent Marker** watermark with a smaller, readable greeting of the same word, centered on one shared axis. Permanent Marker (`--font-family-display`) is reserved for this accent role — never body or UI text.

- **Watermark** (`.section__greeting`): the word at `font-size: 35vw`, `line-height: 0.9`, `color: var(--color-accent)`, `inline-size: max-content`. It is decorative (`aria-hidden`, `pointer-events: none`), pulled out of flow and layered behind all hero content (`position: absolute; z-index: -1`). The `max-content` box shrink-wraps the word so it scales with the viewport and bleeds off both edges evenly.
- **Header** (`.section__howdy`): the readable greeting in the standard family (Montserrat) at `font-size: var(--font-size-xl)`, `font-weight: 700` — a bold section header sitting a step below the page title.

Both are center-aligned on the same axis (see em-corrections below) and anchored to the header group (`.section__hero-head`) so the watermark tracks the header rather than the middle of the content stack.

### Optical Centering — em-corrections

Display and handwritten faces (e.g. Permanent Marker) carry asymmetric side bearings and a low/off-center baseline, so a glyph's **visible ink** does not sit at the center of its text box. Geometric centering (`text-align: center`, `translate(-50%, …)`) therefore looks visibly off — and because the error is a fixed fraction of the type size, it is invisible on small text but obvious at hero scale.

**Rule:** when centering large display type, correct the residual ink offset with a `translate` expressed in **`em`** (never px), so the correction scales with the font and holds at every viewport size. Measure the offset (advance-box center vs. visible-ink center) once, then apply it; re-measure if the word, weight, or face changes.

For the hero "Howdy" in Permanent Marker the measured offsets are ~`0.05em` right of and ~`0.04em` below box center, corrected with:

```css
/* watermark: pull the ink left and up onto the header axis */
transform: translate(calc(-50% - 0.05em), calc(-50% - 0.04em));
```

The smaller header gets the matching horizontal nudge (`transform: translateX(-0.05em)`).

---

## Spacing

<!-- Document the spacing scale and usage rules here -->

---

## Layout

### Letterbox

Hero sections may use a letterbox treatment — `#0A0A0A` bars (top and bottom, ~5–8 vh each) cropping the visible content area to a 2.39:1 cinematic ratio. This is achieved with padding or pseudo-elements, not by clipping the background.

---

## Background Patterns

### Fire Gradient

The primary hero background: a multi-stop linear gradient moving from deep ember at the bottom to bright amber at the top, with orange as the dominant mid-zone.

```css
.bg-fire {
  background: linear-gradient(
    180deg,
    #FFB300  0%,
    #FF7A00 30%,
    #E85400 60%,
    #C43000 100%
  );
}
```

### Scanline Overlay

A repeating horizontal-line texture evokes a CRT or broadcast monitor. Applied as a `::after` pseudo-element so it doesn't interfere with content stacking.

```css
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

```css
/* violet edge bleed (right side) */
.bg-band-violet {
  background: #4422AA;
  opacity: 0.35;
  mix-blend-mode: screen;
}

/* magenta mid-band */
.bg-band-magenta {
  background: #FF1478;
  opacity: 0.25;
  mix-blend-mode: screen;
}
```

Use `mix-blend-mode: screen` on color bands over the fire gradient to preserve luminosity. Keep total layered opacity of any one area below 0.5 to avoid muddying the base.

### Pixel / Block Glitch

High-contrast rectangular blocks (white-on-orange or lime-on-dark) at irregular intervals evoke the pixelated crown shapes in the reference image. These are decorative only and must not obscure readable content. Implement as SVG or CSS `box-shadow` lists — not images — to keep them resolution-independent.

---

## Components

### Hero Greeting

A positioned wrapper holds the decorative watermark and the visible header, so the watermark anchors to the header rather than the content stack:

```html
<div class="section__hero-head">                            <!-- position: relative anchor -->
  <p class="section__greeting" aria-hidden="true">Howdy</p>  <!-- oversized watermark, z-index: -1 -->
  <p class="section__howdy">Howdy</p>                        <!-- bold readable header -->
</div>
<h1 class="section__title">…</h1>
```

- The watermark sits behind everything via `z-index: -1` within the `.section__inner` stacking context; the header text paints on top and stays readable.
- `.section__hero-head { position: relative }` is the watermark's containing block, so `inset-block-start: 50% / inset-inline-start: 50%` centers the watermark on the header line at any screen height (it does not drift to the middle of a tall mobile layout).
- The two words are aligned with em-corrections — see Typography → Optical Centering.

### Favicon

The site icon is a capital **"G"** set in **Permanent Marker**, solid black on a transparent ground — the hero's display face reduced to a monogram.

- Sources: `/assets/img/favicon-32.png`, `favicon-180.png` (apple-touch), `favicon-512.png`, and `/favicon.ico` (site root, for the browser's default request).
- Linked in `_includes/head.html`; the root `favicon.ico` is passthrough-copied in `.eleventy.js`.
- Black ink has low contrast on dark browser chrome — revisit with a backing tile if a dark-tab presence is needed.

---

## Voice & Tone

<!-- Document writing guidelines here -->
