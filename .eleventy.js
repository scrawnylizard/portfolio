const pluginRss = require("@11ty/eleventy-plugin-rss");
const { bundle } = require("lightningcss");
const esbuild = require("esbuild");
const path = require("path");

module.exports = function(eleventyConfig) {
  eleventyConfig.addPlugin(pluginRss);

  eleventyConfig.ignores.add("bootstrap-examples");
  eleventyConfig.ignores.add("_sass");
  eleventyConfig.ignores.add("CLAUDE.md");
  eleventyConfig.ignores.add("README.md");

  // Lightning CSS: process .css entry files only (not partials or @ files)
  eleventyConfig.addTemplateFormats("css");
  eleventyConfig.addExtension("css", {
    outputFileExtension: "css",
    compile: async function(inputContent, inputPath) {
      // Only process entry points directly under assets/css/ (not partials or subdirs)
      if (!inputPath.includes("/assets/css/")) return;
      const filename = path.basename(inputPath);
      if (filename.startsWith("_") || filename.startsWith("@")) return;
      // Skip files that are inside any _ subdirectory
      const rel = path.relative(process.cwd(), inputPath);
      const parts = rel.split(path.sep);
      if (parts.slice(0, -1).some((p) => p.startsWith("_"))) return;
      return async () => {
        const result = bundle({
          filename: inputPath,
          minify: false,
          sourceMap: false,
          drafts: { customMedia: true },
        });
        return result.code.toString();
      };
    },
  });

  // Esbuild: bundle JS entry points (not module files in _ subdirs)
  eleventyConfig.addTemplateFormats("js");
  eleventyConfig.addExtension("js", {
    outputFileExtension: "js",
    compile: async function(inputContent, inputPath) {
      // Only process files inside assets/js/
      if (!inputPath.includes("/assets/js/")) return;
      const parts = path.relative(process.cwd(), inputPath).split(path.sep);
      // Skip files inside directories that start with _
      if (parts.some((p) => p.startsWith("_"))) return;
      return async () => {
        const result = await esbuild.build({
          entryPoints: [inputPath],
          bundle: true,
          write: false,
          format: "esm",
          minify: false,
        });
        return result.outputFiles[0].text;
      };
    },
  });

  // Static assets
  eleventyConfig.addPassthroughCopy("assets/img");
  eleventyConfig.addPassthroughCopy("assets/fonts");
  eleventyConfig.addPassthroughCopy("assets/docs");
  eleventyConfig.addPassthroughCopy("CNAME");
  eleventyConfig.addPassthroughCopy("favicon.ico");

  eleventyConfig.addCollection("posts", (api) =>
    api.getFilteredByGlob("_posts/**/*.md").sort((a, b) => b.date - a.date)
  );

  // Systems: /systems/<domain>/<system>/ with a dated practice log per system
  const byOrder = (a, b) => (a.data.order ?? 99) - (b.data.order ?? 99);
  eleventyConfig.addCollection("systemDomains", (api) =>
    api.getFilteredByGlob("systems/*/index.md").sort(byOrder)
  );
  eleventyConfig.addCollection("systems", (api) =>
    api.getFilteredByGlob("systems/*/*/index.md").sort(byOrder)
  );
  eleventyConfig.addCollection("systemLog", (api) =>
    api.getFilteredByGlob("systems/*/*/log/*.md").sort((a, b) => b.date - a.date)
  );

  eleventyConfig.addFilter("inDomain", (items, domain) =>
    (items || []).filter((item) => item.data.domain === domain)
  );
  eleventyConfig.addFilter("logFor", (items, domain, system) =>
    (items || []).filter((item) => item.data.domain === domain && item.data.system === system)
  );
  eleventyConfig.addFilter("byLeverage", (points) =>
    [...(points || [])].sort((a, b) => a.level - b.level)
  );

  // Causal-loop diagram source for Mermaid, built from a loop's links in front matter
  eleventyConfig.addFilter("causalLoopMermaid", (loop) => {
    const ids = new Map();
    const node = (label) => {
      if (!ids.has(label)) ids.set(label, `n${ids.size}`);
      return ids.get(label);
    };
    const edges = (loop.links || []).map((link) => {
      const sign = link.polarity === "-" ? "−" : "+";
      return `  ${node(link.from)} -->|${sign}| ${node(link.to)}`;
    });
    const nodes = [...ids].map(([label, id]) => `  ${id}["${label.replace(/"/g, "#quot;")}"]`);
    return ["flowchart LR", ...nodes, ...edges].join("\n");
  });

  eleventyConfig.addFilter("postDate", (d) =>
    new Intl.DateTimeFormat("en-US", { year: "numeric", month: "short", day: "numeric" }).format(d)
  );
  eleventyConfig.addFilter("isoDate", (d) =>
    d instanceof Date ? d.toISOString() : d
  );

  return {
    dir: {
      input: ".",
      output: "_site",
      layouts: "_layouts",
      includes: "_includes",
      data: "_data",
    },
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk",
  };
};
