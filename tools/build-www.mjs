// Builds www/ for the Android app from src/game.html (the same source as the playtest artifact).
// - packs sprites and builds the page (tools/pack_sprites.py + tools/build.mjs logic)
// - moves every inlined sprite (base64 data URI) out into www/img/*.webp so the WebView parses less
// - bundles Russo One / Exo 2 locally so the game works offline
// - adds safe-area padding, Android back button, pause on background, haptics
//   RELEASE=1 node tools/build-www.mjs  -> hides test tools, uses real AdMob units from ads.config.json
import { readFileSync, writeFileSync, mkdirSync, existsSync, rmSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const www = join(root, 'www'), fontDir = join(www, 'fonts'), imgDir = join(www, 'img');
rmSync(www, { recursive: true, force: true });
mkdirSync(fontDir, { recursive: true }); mkdirSync(imgDir, { recursive: true });

// 1. sprites: repack art, then write each data URI to its own file
const pk = spawnSync('py', [join(root, 'tools/pack_sprites.py')], { stdio: 'inherit' });
if (pk.status) process.exit(pk.status);
const spritesJs = readFileSync(join(root, 'build/sprites.js'), 'utf8');
const SPR = JSON.parse(spritesJs.slice(spritesJs.indexOf('{'), spritesJs.lastIndexOf('}') + 1));
const paths = {};
for (const [k, uri] of Object.entries(SPR)) {
  const m = uri.match(/^data:image\/(\w+);base64,(.*)$/);
  if (!m) { paths[k] = uri; continue; }
  const file = `img/${k}.${m[1]}`;
  writeFileSync(join(www, file), Buffer.from(m[2], 'base64'));
  paths[k] = file;
}

// 2. fonts: latin, latin-ext, vietnamese subsets
const css = readFileSync(join(root, 'fonts.css'), 'utf8');
const keep = new Set(['latin', 'latin-ext', 'vietnamese']);
let fcss = '';
for (const m of css.matchAll(/\/\* ([a-z-]+) \*\/\s*(@font-face\s*\{[^}]+\})/g)) {
  if (!keep.has(m[1])) continue;
  const block = m[2], url = block.match(/url\((https:[^)]+\.woff2)\)/)[1];
  const fam = block.match(/font-family: '([^']+)'/)[1].replace(/\s+/g, ''), wt = block.match(/font-weight: (\d+)/)[1];
  const file = `${fam}-${wt}-${m[1]}.woff2`;
  if (!existsSync(join(fontDir, file))) writeFileSync(join(fontDir, file), Buffer.from(await (await fetch(url)).arrayBuffer()));
  fcss += block.replace(url, file) + '\n';
}
writeFileSync(join(fontDir, 'fonts.css'), fcss);

// 3. page
let game = readFileSync(join(root, 'src/game.html'), 'utf8');
game = game.replace(/<link rel="stylesheet" href="https:\/\/fonts\.googleapis\.com[^>]*>\s*/, '');
game = game.replace(/<script>\r?\n/, m => m + 'const SPR_SRC=' + JSON.stringify(paths) + ';\n');
const native = readFileSync(join(root, 'tools/native.js'), 'utf8') + '\n' + readFileSync(join(root, 'tools/native-pay.js'), 'utf8');
const head = `<!doctype html>
<html lang="vi">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover">
<link rel="stylesheet" href="fonts/fonts.css">
<style>
:root{padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}
html,body{margin:0;height:100%;font:14px system-ui,sans-serif;background:#070a1c;overscroll-behavior:none;-webkit-user-select:none;user-select:none;-webkit-touch-callout:none}
#stage{width:100%!important;height:100%!important;border-radius:0!important;box-shadow:none!important}
</style>
</head>
<body>
`;
// real AdMob units only in RELEASE builds and only once tools/set-admob.mjs has written ads.config.json
const adsCfg = join(root, 'ads.config.json');
const live = process.env.RELEASE && existsSync(adsCfg) ? JSON.parse(readFileSync(adsCfg, 'utf8')) : null;
const rel = process.env.RELEASE
  ? '<script>window.NV_RELEASE=true;' + (live ? `window.NV_ADS_LIVE=${JSON.stringify({ rewarded: live.rewarded, interstitial: live.interstitial })};` : '') + '</script>\n'
  : '';
if (process.env.RELEASE) console.log(live ? 'ads: LIVE units' : 'ads: Google TEST units (run tools/set-admob.mjs for real ones)');
writeFileSync(join(www, 'index.html'), head + rel + game + `\n<script>\n${native}\n</script>\n</body>\n</html>\n`);
console.log(process.env.RELEASE ? 'RELEASE' : 'debug', 'www/ built:', Object.keys(paths).length, 'images,', fcss.split('@font-face').length - 1, 'font faces');
