// Mermaid's ESM build is code-split, so the browser pulls only the flowchart
// chunks it needs; bundling it with esbuild would inline every diagram type (~12 MB).
import mermaid from "https://cdn.jsdelivr.net/npm/mermaid@12.2.0/dist/mermaid.esm.min.mjs";

// Causal-loop diagrams on /systems/ pages. Mermaid needs plain rgb/hex colors,
// but the site's tokens use light-dark() and oklch(), so each token is resolved
// through a probe element and flattened to rgb via a canvas before theming.

const diagrams = [...document.querySelectorAll("pre.mermaid")];
diagrams.forEach((el) => (el.dataset.source = el.textContent));

// matches the --sm custom media breakpoint in _base/@media.css
const narrow = matchMedia("(max-width: 49.999em)");

const canvas = document.createElement("canvas").getContext("2d", { willReadFrequently: true });

function resolveColor(token) {
  const probe = document.createElement("span");
  probe.style.color = `var(${token})`;
  probe.style.display = "none";
  document.body.append(probe);
  const computed = getComputedStyle(probe).color;
  probe.remove();
  canvas.clearRect(0, 0, 1, 1);
  canvas.fillStyle = computed;
  canvas.fillRect(0, 0, 1, 1);
  const [r, g, b] = canvas.getImageData(0, 0, 1, 1).data;
  return `rgb(${r}, ${g}, ${b})`;
}

async function render() {
  if (!diagrams.length) return;
  const text = resolveColor("--color-text");
  const bg = resolveColor("--color-bg");
  const accent = resolveColor("--color-accent");

  mermaid.initialize({
    startOnLoad: false,
    securityLevel: "strict",
    theme: "base",
    flowchart: { curve: "basis", htmlLabels: false },
    themeVariables: {
      fontFamily: getComputedStyle(document.body).fontFamily,
      background: bg,
      primaryColor: bg,
      primaryTextColor: text,
      primaryBorderColor: accent,
      lineColor: text,
      textColor: text,
      edgeLabelBackground: bg,
    },
  });

  // left-to-right loops shrink to illegible on phones; stack them top-down instead
  const direction = narrow.matches ? "flowchart TD" : "flowchart LR";
  diagrams.forEach((el) => {
    el.removeAttribute("data-processed");
    el.textContent = el.dataset.source.replace(/^flowchart LR/, direction);
  });
  await mermaid.run({ nodes: diagrams });
}

// Mermaid can't run two renders over the same nodes at once, so queue them
let queue = Promise.resolve();
const rerender = () => (queue = queue.then(render, render));

rerender();

// re-theme when the theme picker swaps the <html> class or the OS scheme flips
new MutationObserver(rerender).observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
matchMedia("(prefers-color-scheme: dark)").addEventListener("change", rerender);
narrow.addEventListener("change", rerender);
