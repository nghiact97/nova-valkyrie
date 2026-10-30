// Builds www/ for the Nova Valkyrie (anime) app from the same page as the mockup artifact.
// - runs tools/pack_girls.py + tools/anime-mock.mjs (the anime patches on top of src/game.html)
// - moves every inlined image (data URI) out into www/img/ so the WebView parses less
// - downloads the Google fonts the page uses (Saira Condensed, Be Vietnam Pro, Russo One, Exo 2) so it works offline
// - adds native glue (back button, pause, haptics, billing) like tools/build-www.mjs
//   node tools/build-www-anime.mjs
import { readFileSync, writeFileSync, mkdirSync, rmSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const www = join(root, 'www'), fontDir = join(www, 'fonts'), imgDir = join(www, 'img');
const run = (cmd, args) => { const r = spawnSync(cmd, args, { stdio: 'inherit', cwd: root }); if (r.status) process.exit(r.status); };

// 1. same page as the artifact
run('py', ['tools/pack_sprites.py']);
run('py', ['tools/pack_girls.py', 'kestrel=art/anime/style_a_mika.png@435,75,200#300,20,440,370', 'seraph=art/anime/stand_seraph.png#300,10,440,370']);
// drop images the anime build never shows: base sprites replaced by anime art, and anime keys written twice (keep the last)
{const girls = readFileSync(join(root, 'build/anime_girls.js'), 'utf8').split('\n'), last = {};
  girls.forEach((l, i) => { const m = l.match(/^SPR_SRC\.(\w+)="/); if (m) last[m[1]] = i; });
  const keptGirls = girls.filter((l, i) => { const m = l.match(/^SPR_SRC\.(\w+)="/); return !m || last[m[1]] === i; });
  const sp = readFileSync(join(root, 'build/sprites.js'), 'utf8'), obj = JSON.parse(sp.slice(sp.indexOf('{'), sp.lastIndexOf('}') + 1));
  let cut = 0; for (const k of Object.keys(last)) if (k in obj) { delete obj[k]; cut++; }
  writeFileSync(join(root, 'build/sprites.app.js'), 'const SPR_SRC=' + JSON.stringify(obj) + ';\n');
  writeFileSync(join(root, 'build/anime_girls.app.js'), keptGirls.join('\n'));
  console.log('trimmed', cut, 'replaced base sprites,', girls.length - keptGirls.length, 'duplicate anime images');}
const tmp = join(root, 'build', 'anime-app.html');
{const r = spawnSync(process.execPath, ['tools/anime-mock.mjs', tmp], { stdio: 'inherit', cwd: root, env: { ...process.env, SPRITES: join(root, 'build/sprites.app.js'), GIRLS: join(root, 'build/anime_girls.app.js') } }); if (r.status) process.exit(r.status);}
let page = readFileSync(tmp, 'utf8');

rmSync(www, { recursive: true, force: true });
mkdirSync(fontDir, { recursive: true }); mkdirSync(imgDir, { recursive: true });

// 2. images: every data URI -> www/img/<hash>.<ext> (deduplicated)
let n = 0;
page = page.replace(/data:image\/(webp|png|jpeg|jpg);base64,([A-Za-z0-9+/=]+)/g, (_, ext, b64) => {
  const buf = Buffer.from(b64, 'base64'), file = `img/${createHash('md5').update(buf).digest('hex').slice(0, 12)}.${ext === 'jpeg' ? 'jpg' : ext}`;
  writeFileSync(join(www, file), buf); n++;
  return file;
});

// 3. fonts: fetch the Google CSS the page links to, keep latin / latin-ext / vietnamese, save the woff2 files
const link = page.match(/<link rel="stylesheet" href="(https:\/\/fonts\.googleapis\.com[^"]+)">\s*/);
let fcss = '';
if (link) {
  const ua = { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36' } };
  const css = await (await fetch(link[1].replace(/&amp;/g, '&'), ua)).text();
  const keep = new Set(['latin', 'latin-ext', 'vietnamese']);
  for (const m of css.matchAll(/\/\* ([a-z-]+) \*\/\s*(@font-face\s*\{[^}]+\})/g)) {
    if (!keep.has(m[1])) continue;
    const block = m[2], url = block.match(/url\((https:[^)]+\.woff2)\)/)[1];
    const fam = block.match(/font-family: '([^']+)'/)[1].replace(/\s+/g, ''), wt = block.match(/font-weight: (\d+)/)[1], st = block.match(/font-style: (\w+)/)[1];
    const file = `${fam}-${wt}${st === 'italic' ? 'i' : ''}-${m[1]}.woff2`;
    writeFileSync(join(fontDir, file), Buffer.from(await (await fetch(url)).arrayBuffer()));
    fcss += block.replace(url, file) + '\n';
  }
  page = page.replace(link[0], '');
}
writeFileSync(join(fontDir, 'fonts.css'), fcss);

// 4. app behaviour instead of mockup shortcuts
page = page.replace(/^<meta charset="utf-8">\n/, '').replace(/<title>[^<]*<\/title>/, '<title>Nova Valkyrie</title>');
page = page.replace('setTimeout(()=>POPS.daily(),700);},450)', 'launchPops();},450)');

const native = readFileSync(join(root, 'tools/native.js'), 'utf8') + '\n' + readFileSync(join(root, 'tools/native-pay.js'), 'utf8');
const head = `<!doctype html>
<html lang="vi">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover">
<link rel="stylesheet" href="fonts/fonts.css">
<style>
:root{--sat:env(safe-area-inset-top,0px);--sab:env(safe-area-inset-bottom,0px)}  /* MainActivity overrides both with the real insets */
/* edge-to-edge: backgrounds fill the whole screen, only the UI is kept inside the safe area */
.scr{padding-top:var(--sat);box-sizing:border-box}
#battle{padding-bottom:var(--sab)}
.navbar{padding-bottom:calc(6px + var(--sab))!important}
#veil{padding-top:calc(16px + var(--sat))!important;padding-bottom:calc(16px + var(--sab))!important}
html,body{margin:0;height:100%;font:14px system-ui,sans-serif;background:#070a1c;overscroll-behavior:none;-webkit-user-select:none;user-select:none;-webkit-touch-callout:none}
#stage{width:100%!important;height:100%!important;border-radius:0!important;box-shadow:none!important}
</style>
</head>
<body>
`;
writeFileSync(join(www, 'index.html'), head + page + `\n<script>\n${native}\n</script>\n</body>\n</html>\n`);
console.log('www/ built:', n, 'images,', fcss.split('@font-face').length - 1, 'font faces,', Math.round(readFileSync(join(www, 'index.html')).length / 1024), 'KB html');
