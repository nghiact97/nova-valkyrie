// Inline build/sprites.js into src/game.html and write the publishable page.
// usage: node tools/build.mjs <out.html>
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const out = process.argv[2] || join(root, "build", "nova-vanguard.html");
const html = readFileSync(join(root, "src", "game.html"), "utf8");
const sprites = existsSync(join(root, "build", "sprites.js")) ? readFileSync(join(root, "build", "sprites.js"), "utf8") : "";
if (!/<script>\r?\n/.test(html)) throw new Error("no <script> tag to inline sprites into");
const page = html.replace(/<script>\r?\n/, m => m + sprites);
writeFileSync(out, page);
console.log(`wrote ${out} (${Math.round(page.length / 1024)} KB)`);
