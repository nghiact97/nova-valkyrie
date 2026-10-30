# Nova Vanguard - test APK plan (debug build 0.1.0)

Goal: a playable Android APK of the current mockup (`src/game.html`) for testing on phones. Same pipeline as Petal Gems: Capacitor 6 wraps one HTML page, Gradle builds a debug APK, and the APK goes to the Telegram test group.

## 1. Project setup (one time)
| Step | Detail |
|---|---|
| Capacitor project | `nova_vanguard/package.json` with `@capacitor/core`, `@capacitor/android`, `@capacitor/app`, `@capacitor/status-bar`, `@capacitor/haptics`; `npx cap add android` |
| App id / name | `com.novavanguard.game` (provisional, can still change before the first Play upload) · "Nova Vanguard" |
| Orientation | Portrait only, fullscreen (status bar hidden), screen kept on while playing |
| Version | `0.1.0`, versionCode `1` |

## 2. `tools/build-www.mjs` (HTML → `www/`)
1. Run the existing sprite pack and build (`pack_sprites.py`, `build.mjs`).
2. **Extract the inlined sprites into files** (`www/img/*.webp`) and reference them by path. The page is 3.7 MB today because everything is base64; with files the WebView parses far less JS and starts faster.
3. **Bundle the fonts offline** (Russo One, Exo 2 → `www/fonts/`), so the game looks right without internet.
4. Inject a small `native.js` bridge (`window.NV`):
   - **Back button:** close popup → pause in battle → go back one screen → on Home, "Exit game?" confirm.
   - **App to background:** pause the battle and mute audio (the game already handles `visibilitychange`; the bridge also listens to Capacitor `pause/resume`).
   - **Vibration** through Capacitor Haptics (the Vibration setting still applies).
   - **Safe area:** padding for notch / gesture bar.
5. Phone layout: the stage fills the whole screen. The 430 px desktop frame applies only on wide screens, which is already the case.
6. Flags: the debug APK keeps **Test tools** and fake purchases/ads. `RELEASE=1` hides them later.

## 3. App icon and splash (Codex)
- Launcher icon 1024×1024: a Nova Vanguard fighter on a deep-blue round badge, with an adaptive-icon foreground/background pair.
- Splash 2732×2732: logo "NOVA VANGUARD" on the space background, centred.
- `@capacitor/assets` generates all mipmap sizes.

## 4. Build commands
```
node tools/build-www.mjs
npx cap sync android
cd android; .\gradlew.bat assembleDebug
```
Output: `build/NovaVanguard-0.1.0-vc1-debug-<time>.apk`

## 5. Test on the Galaxy A13 (`adb -s R58W20BKNQM`)
| Area | Check |
|---|---|
| Start | Opens fast, offline fonts, no white flash, loading screen then Home |
| Touch | Drag to fly is smooth, no page scroll / zoom, buttons respond |
| Performance | FPS counter (Settings → Show FPS) ≥ 50 on High in a boss + mini-boss fight; if lower, default to Low graphics on this device |
| Audio | Music starts after the first tap, stops in background, comes back on resume |
| Back button | Each case in step 2.4 |
| Save | Kill the app and reopen: coins, ships, gear and stars are kept (localStorage inside the WebView) |
| Screens | Home v6, Shop, Hangar (4 tabs), Campaign, battle, pause, result, all popups at the A13 resolution |
| Language | VI and EN switch |

Fix anything found, rebuild, and retest.

## 6. Delivery
- Send the APK to the Telegram group with Vietnamese change notes, using the same bot (`tools/send-apk.mjs --notes "..."`, copied from Petal Gems).
- Every later build: bump the versionCode, then send again with notes.

## 7. Not in this test build (later, for a Play release)
Real AdMob ads, Play Billing for gem packs and the offer, cloud save / Google login, a release signing key and AAB, the store listing.

## 8. Estimate
Setup + build script ~1 h, icon/splash ~20 min (Codex), first build + A13 test pass ~1 h, fixes depend on what the test finds.

## Decisions needed
1. App id `com.novavanguard.game` and name "Nova Vanguard", OK?
2. Keep Test tools (add coins, unlock all) in the test APK? (proposal: yes)
3. Should the A13 be connected now so Claude can install and test directly?
