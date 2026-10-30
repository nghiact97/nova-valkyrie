// Switch Nova Vanguard from Google's test ads to its own AdMob units.
//   node tools/set-admob.mjs ca-app-pub-XXXX~APPID ca-app-pub-XXXX/REWARDED ca-app-pub-XXXX/INTERSTITIAL
// Writes ads.config.json (read by tools/build-www.mjs for RELEASE builds only, so debug builds keep test ads)
// and puts the app id into AndroidManifest.xml.
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const [appId, rewarded, interstitial] = process.argv.slice(2);
if (!/^ca-app-pub-\d+~\d+$/.test(appId || '') || !/^ca-app-pub-\d+\/\d+$/.test(rewarded || '') || !/^ca-app-pub-\d+\/\d+$/.test(interstitial || '')) {
  console.error('usage: node tools/set-admob.mjs <app id ca-app-pub-…~…> <rewarded unit ca-app-pub-…/…> <interstitial unit ca-app-pub-…/…>');
  process.exit(1);
}
writeFileSync(join(root, 'ads.config.json'), JSON.stringify({ appId, rewarded, interstitial }, null, 2) + '\n');
const mf = join(root, 'android/app/src/main/AndroidManifest.xml');
const xml = readFileSync(mf, 'utf8').replace(/(com\.google\.android\.gms\.ads\.APPLICATION_ID" android:value=")[^"]+/, `$1${appId}`);
writeFileSync(mf, xml);
console.log('AdMob set:', appId, rewarded, interstitial);
