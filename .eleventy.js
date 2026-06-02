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
  eleventyConfig.addPassthroughCopy("assets/docs");
  eleventyConfig.addPassthroughCopy("CNAME");

  eleventyConfig.addCollection("posts", (api) =>
    api.getFilteredByGlob("_posts/**/*.md").sort((a, b) => b.date - a.date)
  );

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
