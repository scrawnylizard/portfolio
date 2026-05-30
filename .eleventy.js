const pluginRss = require("@11ty/eleventy-plugin-rss");
const sass = require("sass");
const path = require("path");

module.exports = function(eleventyConfig) {
  eleventyConfig.addPlugin(pluginRss);

  // Exclude directories/files that should not be template-processed
  eleventyConfig.ignores.add("bootstrap-examples");
  eleventyConfig.ignores.add("_sass");
  eleventyConfig.ignores.add("CLAUDE.md");
  eleventyConfig.ignores.add("README.md");

  // Sass compilation: process .scss entry files (not partials)
  eleventyConfig.addTemplateFormats("scss");
  eleventyConfig.addExtension("scss", {
    outputFileExtension: "css",
    compile: async function(_, inputPath) {
      if (path.basename(inputPath).startsWith("_")) return;
      return async () => {
        let result = sass.compile(inputPath, {
          loadPaths: [path.join(__dirname, "_sass")],
          style: "compressed",
        });
        return result.css;
      };
    },
  });

  // Static assets — copy without template processing
  eleventyConfig.addPassthroughCopy("assets/javascript");
  eleventyConfig.addPassthroughCopy("assets/js");
  eleventyConfig.addPassthroughCopy("assets/img");
  eleventyConfig.addPassthroughCopy("assets/docs");
  eleventyConfig.addPassthroughCopy("assets/dist");
  eleventyConfig.addPassthroughCopy("assets/brand");
  eleventyConfig.addPassthroughCopy("bootstrap-examples");
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
