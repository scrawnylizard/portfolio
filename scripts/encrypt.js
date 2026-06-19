#!/usr/bin/env node
/*
 * Encrypts the built Family Photos page in place with StatiCrypt.
 *
 * Runs after the 11ty build. The password is read from the STATICRYPT_PASSWORD
 * environment variable (a GitHub Actions secret in CI). If it is missing we
 * fail loudly rather than publish the private page in the clear.
 *
 * The salt below is NOT secret — StatiCrypt embeds it in the public output. A
 * fixed salt keeps the "Remember me" checkbox working across deploys.
 */
const { execFileSync } = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");

const TARGET = path.join("_site", "family-photos", "index.html");
const SALT = "4274baa1817ac2050d66740cd6d1975a";

if (!fs.existsSync(TARGET)) {
  console.error(`[encrypt] Built page not found: ${TARGET}`);
  console.error("[encrypt] Run the 11ty build (npm run build) before encrypting.");
  process.exit(1);
}

if (!process.env.STATICRYPT_PASSWORD) {
  console.error("[encrypt] STATICRYPT_PASSWORD is not set.");
  console.error("[encrypt] Refusing to publish Family Photos unencrypted.");
  console.error("[encrypt] Set the STATICRYPT_PASSWORD env var (locally) or the");
  console.error("[encrypt] repository secret of the same name (GitHub Actions).");
  process.exit(1);
}

const args = [
  "staticrypt",
  TARGET,
  "--directory", path.dirname(TARGET), // overwrite index.html in place
  "--salt", SALT,
  "--config", "false", // don't write a .staticrypt.json into the tree
  "--short", // we control the password; skip the length warning
  "--template-title", "Family Photos",
  "--template-instructions", "This album is private. Enter the password to view.",
  "--template-color-primary", "#4582ec", // $primary (see STYLEGUIDE.md)
  "--template-color-secondary", "#F5F0E8", // $color-highlight
];

execFileSync("npx", args, { stdio: "inherit" });
console.log(`[encrypt] Encrypted ${TARGET}`);
