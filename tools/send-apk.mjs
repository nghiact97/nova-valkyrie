// After `gradlew assembleDebug`: copy the APK into build/ with version + time, then post it to the Telegram group
// using the Petal Pop bot (credentials in ../perta_pob/tools/telegram/.env).
//   node tools/send-apk.mjs --notes "• thay đổi 1\n• thay đổi 2"
import { copyFileSync, mkdirSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const gradle = readFileSync(join(root, 'android/app/build.gradle'), 'utf8');
const version = (gradle.match(/versionName "([^"]+)"/) || [])[1] || 'dev';
const d = new Date(), p2 = (n) => String(n).padStart(2, '0');
const stamp = p2(d.getMonth() + 1) + p2(d.getDate()) + '-' + p2(d.getHours()) + p2(d.getMinutes());
mkdirSync(join(root, 'build'), { recursive: true });
const out = join(root, 'build', `NovaValkyrie-${version}-debug-${stamp}.apk`);
copyFileSync(join(root, 'android/app/build/outputs/apk/debug/app-debug.apk'), out);
console.log('copied', out);
const sender = join(root, '..', 'perta_pob', 'tools', 'telegram', 'send-apk.mjs');
const r = spawnSync(process.execPath, [sender, out, ...process.argv.slice(2)], { stdio: 'inherit' });
process.exit(r.status ?? 1);
