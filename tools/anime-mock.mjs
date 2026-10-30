// Anime Home mockup: take the normal build, swap the Home ship for a standing girl.
// usage: node tools/anime-mock.mjs <out.html>   (needs build/anime_girls.js from tools/pack_girls.py)
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const out = process.argv[2] || join(root, "build", "anime-home.html");
let html = readFileSync(join(root, "src", "game.html"), "utf8");
// the version shown in game (splash, settings) is the Android versionName
{const g = readFileSync(join(root, "android", "app", "build.gradle"), "utf8").match(/versionName "([^"]+)"/);
  if (g) html = html.replace('APP_VER="1.0.0"', `APP_VER="${g[1]}"`);}
const sprites = readFileSync(process.env.SPRITES || join(root, "build", "sprites.js"), "utf8");
const girls = existsSync(join(root, "build", "anime_girls.js")) ? readFileSync(process.env.GIRLS || join(root, "build", "anime_girls.js"), "utf8") : "const GIRL_SRC={};\n";

function patch(from, to) {
  if (!html.includes(from)) throw new Error("patch target missing: " + from.slice(0, 60));
  html = html.replace(from, () => to);
}

const css = `
/* ===== anime home mock ===== */
#home .h6mid #shipShow.ag-off{display:none}
#girlShow{position:absolute;left:0;right:0;top:-40px;bottom:0;width:100%;height:calc(100% + 40px);z-index:1;cursor:pointer;touch-action:manipulation}
#home .h6mid .h5arr{z-index:2}
.h6eq{z-index:2}
.h6eq .agRar{font-size:10px;font-weight:900;letter-spacing:.08em;padding:1px 6px;border-radius:3px;color:#0a1238;background:var(--rc,#9fdcff)}
.h6eq .agCall{font-size:10px;font-weight:800;letter-spacing:.14em;color:#9ff0ff}
.agBub{position:absolute;z-index:4;max-width:190px;padding:8px 11px;font-size:12px;font-weight:700;line-height:1.35;color:#eaf6ff;
  background:linear-gradient(180deg,#123a8ee6,#0b2160e6);border:1px solid #6fd8ff;border-radius:10px;box-shadow:0 0 14px #38e1ff55;
  transform:translate(-50%,-100%);animation:agBub .25s ease-out;pointer-events:none}
.agBub::after{content:"";position:absolute;left:50%;bottom:-6px;width:10px;height:10px;background:#0b2160;border-right:1px solid #6fd8ff;border-bottom:1px solid #6fd8ff;transform:translateX(-50%) rotate(45deg)}
@keyframes agBub{from{opacity:0;transform:translate(-50%,-90%)}}
</style>`;
patch("</style>", css);
html = html.replace(/<title>[^<]*<\/title>/, "<title>Nova Vanguard Anime Home</title>");

// ===== Valkyrie frame: new UI skin for the anime version (slanted glass plates, diamond icon frames, pink/cyan) =====
patch(`family=Russo+One`, `family=Saira+Condensed:ital,wght@0,600;0,800;1,800&family=Be+Vietnam+Pro:wght@500;700;800&family=Russo+One`);
const frame = `
<style>
#stage{--vk-glass:#0a1030c4;--vk-line:#cfeeff;--vk-cy:#5ee7ff;--vk-pk:#ff6fae;--vk-gd:#ffd36b;--vk-ink:#f4f8ff;--vk-dim:#9fb3e6;
  --f-disp:"Saira Condensed","Arial Narrow",system-ui,sans-serif;--f-body:"Be Vietnam Pro","Segoe UI",system-ui,sans-serif;font-family:var(--f-body)}
/* top: profile plate */
#home .h6prof{width:126px;padding:3px 8px 3px 3px;border:0;border-radius:0;background:linear-gradient(90deg,var(--vk-glass),#0a103000);
  clip-path:polygon(0 0,100% 0,88% 100%,0 100%);box-shadow:none}
#home .h6prof::after{content:"";position:absolute;left:0;top:0;bottom:0;width:3px;background:var(--vk-pk)}
#home .h6prof{position:relative}
#home .h6prof .avatar{width:44px;height:44px;border-radius:0;clip-path:polygon(50% 0,100% 50%,50% 100%,0 50%);background:var(--vk-cy);padding:2px;box-sizing:border-box}
#home .h6prof .avatar img{clip-path:polygon(50% 0,100% 50%,50% 100%,0 50%);border-radius:0!important}
#home .h6prof .avatar small{display:none}
#home .h5pn b{font-family:var(--f-disp);font-size:13px;letter-spacing:.03em}
#home .h6lv{background:var(--vk-pk)!important;color:#fff!important;border:0!important;padding:0 6px!important;font-family:var(--f-disp);font-style:italic;transform:skewX(-12deg)}
#home .h5xp i{background:linear-gradient(90deg,var(--vk-pk),var(--vk-gd))}
/* currency chips */
#home .h6res .res{border-radius:0;background:var(--vk-glass);box-shadow:none;border-bottom:1px solid #cfeeff55;clip-path:polygon(8px 0,100% 0,calc(100% - 8px) 100%,0 100%);padding-left:6px;font-family:var(--f-disp);font-size:12.5px;letter-spacing:.02em}
#home .h6res .plus{color:var(--vk-pk)}
/* diamond icon frames (top row, left column, right tools) */
#home .h6f>span,#home .h6l>span,#home .h6t>span{position:relative;display:grid;place-items:center;width:46px;height:46px;isolation:isolate}
#home .h6f>span::before,#home .h6l>span::before,#home .h6t>span::before{content:"";position:absolute;inset:7px;z-index:-1;transform:rotate(45deg);
  background:linear-gradient(135deg,#1b2d6ee6,#0a1030e6);border:1px solid #cfeeffaa;outline:1px solid #5ee7ff44;outline-offset:3px}
#home .h6f span img.i5,#home .h6l span img.i5,#home .h6t span img.i5{width:30px!important;height:30px!important;animation:none;filter:drop-shadow(0 0 4px #5ee7ff88)}
#home .h6l.big>span{width:58px;height:58px;background:none}
#home .h6l.big>span::before{background:linear-gradient(135deg,#ff6faecc,#7a1d55e6);border-color:#ffd0e4}
#home .h6l.big span img.i5{width:36px!important;height:36px!important}
#home .h6f small,#home .h6l small,#home .h6t small{font-family:var(--f-disp);font-size:11px;font-weight:800;letter-spacing:.03em;text-transform:uppercase;color:var(--vk-ink);
  background:#0a1030b0;padding:0 5px;margin-top:1px;text-shadow:none}
#home .h6tool{background:none;border:0;padding:0;gap:4px;right:4px}
#home .h6t{width:56px}
#home .h6f .dot,#home .h6l .dot,#home .h6t .dot{right:6px;top:2px;width:9px;min-width:0;height:9px;padding:0;background:var(--vk-pk);box-shadow:0 0 0 2px #0a1030,0 0 6px var(--vk-pk)}
/* news line */
#home .h6news{border:0;border-radius:0;background:linear-gradient(90deg,#0a1030d0,#0a103040);box-shadow:none;border-top:1px solid #cfeeff33;border-bottom:1px solid #cfeeff33;height:22px}
#home .h6nic{background:var(--vk-pk);clip-path:polygon(0 0,100% 0,80% 100%,0 100%);padding:0 10px 0 4px;height:100%;display:grid;place-items:center}
#home .h6nic img.i5{width:16px;height:16px}
#home .h6mq{font-size:11px;font-weight:700}
/* character name: big italic name bottom-left */
#home .h6eq{left:12px;right:auto;bottom:10px;transform:none;flex-direction:column;align-items:flex-start;gap:0;background:none;padding:0;clip-path:none;z-index:3;pointer-events:none}
#home .h6eq #homeShipName{order:2;font-family:var(--f-disp);font-style:italic;font-weight:800;font-size:40px;line-height:.9;letter-spacing:.01em;color:#fff;
  text-shadow:0 2px 0 #0a1030,0 0 16px #5ee7ff88;text-transform:uppercase}
#home .h6eq .agCall{order:1;font-family:var(--f-disp);font-size:12px;font-weight:800;letter-spacing:.3em;color:var(--vk-cy);display:flex;gap:6px;align-items:center}
#home .h6eq .agRar{order:1;position:absolute;left:0;top:-20px;transform:skewX(-12deg);font-family:var(--f-disp);font-size:12px;border-radius:0;padding:0 8px}
#home .h6eq .h5st{display:block!important;order:3;color:var(--vk-gd);font-size:13px;letter-spacing:2px;text-shadow:0 0 6px #000}
/* arrows: thin chevrons */
#home .h6mid .h5arr{width:56px;height:56px;top:62%;margin-top:-28px;z-index:4;opacity:1;background:none!important;border:0;filter:none;clip-path:none;display:grid;place-items:center}
#home .h6mid .h5arr.l{left:8px}#home .h6mid .h5arr.r{right:8px;transform:none}
#home .h6mid .h5arr::before{content:"";width:34px;height:34px;transform:rotate(45deg);background:#0a1030d9;border:1px solid #cfeeffcc;box-shadow:0 0 12px #5ee7ff66}
#home .h6mid .h5arr::after{content:"";position:absolute;width:11px;height:11px;border:solid #fff;border-width:0 0 3px 3px;transform:translateX(3px) rotate(45deg)}
#home .h6mid .h5arr.r::after{border-width:3px 3px 0 0;transform:translateX(-3px) rotate(45deg)}
#home .h6mid .h5arr:active::before{background:#ff6fae}

/* mode cards: slanted glass plates */
#home .h6cards{grid-template-rows:62px 62px;gap:8px 10px;padding:8px 12px 4px}
#home .h6cards .h5card,#home .h6cards .h5card.h6big,#home .h6cards .h5card.c2,#home .h6cards .h5card.c3{border:0;border-radius:0;box-shadow:none;
  clip-path:polygon(14px 0,100% 0,calc(100% - 14px) 100%,0 100%);background:#0a1030}
#home .h6cards .h5card::after{content:"";position:absolute;inset:0;pointer-events:none;
  background:linear-gradient(var(--vk-line),var(--vk-line)) left 14px top 0/40% 2px no-repeat,linear-gradient(var(--vk-pk),var(--vk-pk)) right 14px bottom 0/30% 3px no-repeat}
#home .h6cards .h5card i{filter:none}
#home [data-card-art=campaign]{background-position:62% 40%!important}#home [data-card-art=boss]{background-position:45% 42%!important}#home [data-card-art=explore]{background-position:80% 38%!important}
#home .h6cards .h5card>span{background:linear-gradient(90deg,#0a1030e0,#0a103000 70%);top:0;justify-content:flex-end;padding:0 0 8px 20px}
#home .h6cards .h5card b{font-family:var(--f-disp);font-style:italic;font-weight:800;font-size:22px;letter-spacing:.02em;text-shadow:0 2px 0 #0a1030}
#home .h6cards .h6big>span b{font-size:30px}
#home .h6cards .h5card small{font-family:var(--f-disp);font-size:11px;letter-spacing:.12em;text-transform:uppercase;color:var(--vk-cy)}
#home .h6cards .h5card .mlock{top:6px;right:20px;background:#0a1030c0;padding:0 6px;font-family:var(--f-disp)}
/* bottom bar */
#stage #tabbar::before{background:linear-gradient(180deg,#0a1030f2,#05081af8);border-top:1px solid #cfeeff44}
#stage #tabbar .nav{font-family:var(--f-disp);font-size:12px;letter-spacing:.06em;color:var(--vk-dim)}
#stage #tabbar .nav.on:not(.nmain)::before{border:0;border-radius:0;height:58px;background:linear-gradient(180deg,#5ee7ff00,#5ee7ff2e);
  clip-path:polygon(12% 0,100% 0,88% 100%,0 100%);box-shadow:none}
#stage #tabbar .nav.on:not(.nmain)::after{content:"";position:absolute;bottom:0;left:22%;right:22%;height:3px;background:var(--vk-pk)}
#home .h6f[data-go=missions]{display:none}
#stage #tabbar .nav #dQuest{position:absolute;top:10px;right:22%;width:9px;height:9px;min-width:0;padding:0;font-size:0;background:#ff6fae;box-shadow:0 0 0 2px #0a1030,0 0 6px #ff6fae}
#stage #tabbar .nav.nmain{color:var(--vk-gd)}
#stage #tabbar .nav.nmain .ico img.i5{animation:vkSortie 2.4s ease-in-out infinite;filter:drop-shadow(0 0 10px #ffffff88)}
#tabbar .nav:not(.nmain) img.i5{scale:1.28}
@keyframes vkSortie{50%{transform:translateY(-3px);filter:drop-shadow(0 0 14px #5ee7ff)}}
#stage #tabbar .nav:not(.on) .ico{filter:saturate(.6) brightness(.8)}
</style>`;

// ===== Valkyrie dialog: one frame for every pop() (trial: Daily Login with Mika) =====
const dlg = `
<style>
#veil{background:#03051ac4;backdrop-filter:blur(3px)}
#veil .pop{--dk:#ff6fae;--dk2:#c2307a;--dkt:#fff;width:min(352px,100%);border:0;border-radius:0;padding:84px 14px 18px;box-shadow:none;overflow-y:auto;
  background:radial-gradient(#cfeeff14 1px,transparent 1.5px) 0 0/14px 14px,linear-gradient(180deg,#0f1940f5,#080d26f8);
  clip-path:polygon(18px 0,100% 0,100% calc(100% - 18px),calc(100% - 18px) 100%,0 100%,0 18px);animation:vkIn .26s cubic-bezier(.2,.9,.3,1.1)}
@keyframes vkIn{from{opacity:0;transform:translateX(26px)}}
#veil .pop.vk-reward{--dk:#ffd36b;--dk2:#e89a1c;--dkt:#2a1600}
#veil .pop.vk-warn{--dk:#ff5164;--dk2:#a3182d}
#veil .pop::before{content:"";position:absolute;inset:6px;pointer-events:none;
  background:linear-gradient(#cfeeff,#cfeeff) 0 0/22px 1px,linear-gradient(#cfeeff,#cfeeff) 0 0/1px 22px,
  linear-gradient(#cfeeff,#cfeeff) 100% 0/22px 1px,linear-gradient(#cfeeff,#cfeeff) 100% 0/1px 22px,
  linear-gradient(#cfeeff,#cfeeff) 0 100%/22px 1px,linear-gradient(#cfeeff,#cfeeff) 0 100%/1px 22px,
  linear-gradient(#cfeeff,#cfeeff) 100% 100%/22px 1px,linear-gradient(#cfeeff,#cfeeff) 100% 100%/1px 22px;background-repeat:no-repeat;opacity:.7}
#veil .pop::after{content:"";position:absolute;left:18px;right:34%;bottom:0;height:3px;background:var(--dk);box-shadow:0 0 10px var(--dk)}
#veil .pop h3{position:absolute;left:0;top:16px;margin:0;width:auto;max-width:78%;padding:5px 30px 5px 18px;border-radius:0;box-shadow:none;
  background:linear-gradient(90deg,var(--dk),var(--dk2));color:var(--dkt);clip-path:polygon(0 0,100% 0,calc(100% - 16px) 100%,0 100%);
  font-family:var(--f-disp);font-style:italic;font-weight:800;font-size:24px;line-height:1.1;letter-spacing:.04em;text-transform:uppercase;animation:vkTitle .32s ease-out}
@keyframes vkTitle{from{transform:translateX(-30px);opacity:0}}
#veil .pop .vksub{position:absolute;left:18px;top:54px;font-family:var(--f-disp);font-size:12px;font-weight:600;letter-spacing:.14em;text-transform:uppercase;color:#5ee7ff}
#veil .pop .x{top:18px;right:18px;width:28px;height:28px;border-radius:0;transform:rotate(45deg);background:#0a1030;border:1px solid #cfeeffcc;box-shadow:0 0 8px #5ee7ff55;font-size:0}
#veil .pop .x::before{content:"\\2715";display:block;transform:rotate(-45deg);font-size:13px;color:#fff;line-height:26px}
#veil .btn{border-radius:0;box-shadow:none;clip-path:polygon(12px 0,100% 0,calc(100% - 12px) 100%,0 100%);padding:11px 26px;
  font-family:var(--f-disp);font-style:italic;font-weight:800;font-size:18px;letter-spacing:.05em;text-transform:uppercase}
#veil .btn:active{transform:translateY(2px);box-shadow:none}
#veil .btn,#veil .btn.green{background:linear-gradient(180deg,#ffe28f,#ffb02e);color:#2a1600}
#veil .btn.pink{background:linear-gradient(180deg,#ff8cc0,#e8327f);color:#fff}
#veil .btn.blue{background:linear-gradient(180deg,#2a6fd0,#173f8a);color:#e6fbff}
#veil .btn.ghost{background:#ffffff10;color:#9fb3e6}
#veil .acts{gap:12px;margin-top:16px}
#veil .days{gap:8px}
#veil .day{border:0;border-radius:0;clip-path:polygon(8px 0,100% 0,100% calc(100% - 8px),calc(100% - 8px) 100%,0 100%,0 8px);
  background:linear-gradient(180deg,#1a2a66,#0d1540);padding:7px 3px;font-family:var(--f-disp);font-size:12.5px;font-weight:700;letter-spacing:.04em;color:#dfe8ff;
  animation:vkTile .3s ease-out backwards}
#veil .day:nth-child(2){animation-delay:.04s}#veil .day:nth-child(3){animation-delay:.08s}#veil .day:nth-child(4){animation-delay:.12s}
#veil .day:nth-child(5){animation-delay:.16s}#veil .day:nth-child(6){animation-delay:.2s}#veil .day:nth-child(7){animation-delay:.24s}
@keyframes vkTile{from{opacity:0;transform:translateY(8px) scale(.94)}}
#veil .day i{width:30px;height:30px;margin:5px auto}
#veil .day.today{background:linear-gradient(180deg,#ff6fae66,#3a1650);color:#fff;box-shadow:none;animation:vkTile .3s ease-out backwards,vkToday 1.4s ease-in-out .4s infinite}
@keyframes vkToday{50%{filter:brightness(1.35)}}
#veil .day.today{padding-top:15px}html.vi #veil .day.today::before{content:"HÔM NAY"}#veil .day.today::before{content:"TODAY";position:absolute;left:0;top:0;padding:0 6px 0 8px;font-size:9px;letter-spacing:.12em;background:#ff6fae;color:#fff}
#veil .day.got{opacity:.45}#veil .day.got::after{color:#ff6fae}
#veil .day.big{background:linear-gradient(110deg,#5a3a00,#1a1440 60%);color:#ffd36b}
#veil .day.big::after{content:"";position:absolute;inset:0;background:linear-gradient(115deg,transparent 40%,#ffd36b33 50%,transparent 60%) -120px 0/200% 100% no-repeat;animation:vkShine 2.6s linear infinite}
@keyframes vkShine{to{background-position:220px 0}}
.vkMika{position:absolute;z-index:21;pointer-events:none;animation:vkPeek .45s cubic-bezier(.2,.9,.3,1.2) .1s backwards}
.vkMika img{display:block;height:150px;width:auto;-webkit-mask:linear-gradient(90deg,transparent,#000 22%,#000 80%,transparent);mask:linear-gradient(90deg,transparent,#000 22%,#000 80%,transparent)}
.vkMika p{position:absolute;right:calc(100% - 14px);top:28px;width:max-content;max-width:170px;margin:0;padding:7px 11px;font-size:12px;font-weight:700;line-height:1.35;color:#fff;
  background:#0a1030ee;border:1px solid #cfeeff99}
@keyframes vkPeek{from{transform:translateY(40px);opacity:0}}
#veil .pop.vk-mika{margin-top:132px}
</style>`;

// ===== Special Offer: full-screen character bundle (layout like a gacha "limited character" page) =====
const offer = `
<style>
#veil .pop.vkoffer{position:absolute;inset:0;width:auto;max-height:none;padding:0;clip-path:none;overflow:hidden;
  background:radial-gradient(ellipse 90% 60% at 50% 38%,#4a2e08 0,#140c2a 55%,#05040f)}
#veil .pop.vkoffer::before,#veil .pop.vkoffer::after,#veil .pop.vkoffer h3,#veil .pop.vkoffer .vksub{display:none}
#veil .pop.vkoffer .x{top:16px;right:16px;z-index:6}
.vo-sun{position:absolute;left:50%;top:40%;width:160%;aspect-ratio:1;transform:translate(-50%,-50%);pointer-events:none}
.vo-sun i{position:absolute;border-radius:50%}
.vo-sun .r2{inset:0;background:repeating-conic-gradient(#ffd36b30 0 5deg,transparent 5deg 15deg);-webkit-mask:radial-gradient(circle,#000 18%,transparent 60%);mask:radial-gradient(circle,#000 18%,transparent 60%);animation:voSpin 50s linear infinite}
.vo-sun .r1{inset:22%;background:radial-gradient(circle,#fff7d6 0,#ffd36bdd 20%,#ff9d1c66 42%,transparent 68%)}
.vo-sun .r3{inset:27%;border:2px solid #fff0b0aa;box-shadow:0 0 34px #ffb02eaa,inset 0 0 40px #ffb02e77}
.vo-sun .r4{inset:24%;border:1px dashed #ffe7a066;animation:voSpin 30s linear infinite reverse}
@keyframes voSpin{to{transform:rotate(360deg)}}
.vo-sp{position:absolute;width:6px;height:6px;background:#fff6c8;clip-path:polygon(50% 0,62% 38%,100% 50%,62% 62%,50% 100%,38% 62%,0 50%,38% 38%);animation:voTw 2.2s ease-in-out infinite;z-index:2}
@keyframes voTw{50%{transform:scale(2.2);opacity:.3}}
.vo-girl{position:absolute;left:50%;top:10%;height:62%;width:auto;transform:translateX(-50%);z-index:1;filter:drop-shadow(0 0 22px #ffd36b55);animation:voFloat 3.4s ease-in-out infinite}
@keyframes voFloat{50%{transform:translateX(-50%) translateY(-7px)}}
.vo-head{position:absolute;left:16px;top:18px;z-index:3}
.vo-name{font-family:var(--f-disp);font-style:italic;font-weight:800;font-size:46px;line-height:.88;letter-spacing:.01em;
  background:linear-gradient(180deg,#fffbe8,#ffd36b 55%,#ef8d14);-webkit-background-clip:text;background-clip:text;color:transparent;
  filter:drop-shadow(0 2px 0 #3a1d00) drop-shadow(0 0 14px #ffb02e88)}
.vo-call{font-family:var(--f-disp);font-size:12px;font-weight:700;letter-spacing:.22em;color:#ffe7a0;margin-top:6px}.vo-call b{color:#ffd36b}
.vo-tag{display:inline-block;margin-top:7px;padding:2px 16px 2px 10px;background:linear-gradient(90deg,#ff6fae,#c2307a);color:#fff;
  font-family:var(--f-disp);font-style:italic;font-weight:800;font-size:13px;letter-spacing:.06em;clip-path:polygon(0 0,100% 0,calc(100% - 10px) 100%,0 100%)}
.vo-timer{position:absolute;right:14px;top:56px;z-index:3;padding:3px 10px;font-family:var(--f-disp);font-size:12px;letter-spacing:.08em;color:#ffe7a0;background:#0a1030cc;border-left:2px solid #ffd36b}
.vo-timer b{color:#fff;font-size:14px}
.vo-bottom{position:absolute;left:0;right:0;bottom:0;z-index:3;padding:56px 14px 16px;display:flex;flex-direction:column;align-items:center;gap:9px;
  background:linear-gradient(180deg,transparent,#07051ad0 28%,#07051a 55%)}
.vo-row{display:flex;align-items:center;gap:6px;width:100%}
.vo-form{position:relative;width:86px;height:96px;flex:none;display:grid;place-items:center;background:linear-gradient(180deg,#3f2c6e,#171236);
  clip-path:polygon(10px 0,100% 0,100% calc(100% - 10px),calc(100% - 10px) 100%,0 100%,0 10px);box-shadow:inset 0 0 0 1px #ffd36b88}
.vo-form img{height:58px;width:auto;margin-bottom:12px;filter:drop-shadow(0 0 8px #ffd36b99)}
.vo-form span{position:absolute;bottom:4px;left:0;right:0;text-align:center;font-family:var(--f-disp);font-size:10px;font-weight:700;letter-spacing:.1em;color:#ffe7a0}
.vo-plus{font-family:var(--f-disp);font-size:28px;font-weight:800;color:#ffd36b;text-shadow:0 0 10px #ffb02e}
.vo-it{flex:1;min-width:0;height:76px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:3px;
  background:linear-gradient(180deg,#ffd36b,#b8700c);clip-path:polygon(8px 0,100% 0,100% calc(100% - 8px),calc(100% - 8px) 100%,0 100%,0 8px);animation:vkTile .35s ease-out backwards}
.vo-it:nth-of-type(2){animation-delay:.08s}.vo-it:nth-of-type(3){animation-delay:.16s}
.vo-it i{width:34px!important;height:34px!important;display:block}
.vo-it img{width:36px;height:36px;object-fit:contain}
.vo-it b{font-family:var(--f-disp);font-weight:800;font-size:15px;color:#fff;text-shadow:0 1px 0 #5a3300,0 0 4px #5a3300}
.vo-it.ult{background:linear-gradient(180deg,#c39bff,#5a2fb0)}.vo-it.ult b{text-shadow:0 1px 0 #2a1060}
.vo-stats{display:flex;gap:16px;font-family:var(--f-disp);font-size:15px;font-weight:600;letter-spacing:.04em;color:#dfe8ff}.vo-stats b{color:#52f19a}
.vo-ult{font-size:12px;font-weight:600;color:#c8d4ff;text-align:center;max-width:320px}.vo-ult b{color:#ffd36b}
#veil .pop.vkoffer .x{width:28px;height:28px;border-radius:0;transform:rotate(45deg);background:#0a1030;border:1px solid #cfeeffcc;box-shadow:0 0 8px #5ee7ff55;font-size:0}
#veil .pop.vkoffer .x::before{content:"\\2715";display:block;transform:rotate(-45deg);font-size:13px;color:#fff;line-height:26px}
#veil .vkoffer .btn{border-radius:0;box-shadow:none;clip-path:polygon(12px 0,100% 0,calc(100% - 12px) 100%,0 100%);background:linear-gradient(180deg,#ffe28f,#ffb02e);color:#2a1600;
  font-family:var(--f-disp);font-style:italic;font-weight:800;letter-spacing:.05em;text-transform:uppercase}
@keyframes vkTile{from{opacity:0;transform:translateY(8px) scale(.94)}}
#veil .vkoffer .btn{width:min(290px,92%);font-size:26px;padding:11px;margin-top:2px}
#veil .vkoffer .btn s{font-size:15px;opacity:.6;margin-right:8px}
.vo-note{font-size:11px;font-weight:600;color:#9fb3e6}
</style>`;
const USE_DLG = true; // Valkyrie dialog frame (approved look: Daily Login with Mika)

// ===== Shop: Valkyrie skin, 3 tabs (Offers / Gems / Crates) =====
const shop = `
<style>
#shop{background:linear-gradient(180deg,#070b22e8,#05081af2),var(--shopbg,none) center/cover}
#shop .hdr{gap:8px;padding:10px 10px 6px;background:none;border:0}
#shop .hdr .back{width:34px;height:34px;border-radius:0;transform:rotate(45deg);background:#0a1030;border:1px solid #cfeeffaa;font-size:0;flex:none;margin:0 4px}
#shop .hdr .back::before{content:"‹";display:block;transform:rotate(-45deg);font-size:22px;color:#fff;line-height:30px}
#shop .hdr h2{margin:0;padding:3px 26px 3px 14px;background:linear-gradient(90deg,#ff6fae,#c2307a);clip-path:polygon(0 0,100% 0,calc(100% - 14px) 100%,0 100%);
  font-family:var(--f-disp);font-style:italic;font-weight:800;font-size:24px;letter-spacing:.04em;text-transform:uppercase;color:#fff}
#shop .hres .res{border-radius:0;border:0;background:#0a1030cc;clip-path:polygon(8px 0,100% 0,calc(100% - 8px) 100%,0 100%);padding:3px 10px;font-family:var(--f-disp);font-size:13px}
#shop .hres .plus{background:none;color:#ff6fae;font-size:16px}
.vs-tabs{position:sticky;top:0;z-index:3;display:grid;grid-template-columns:repeat(3,1fr);gap:4px;padding:4px 0 10px;background:linear-gradient(180deg,#060a1f,#060a1fee 80%,transparent)}
.vs-tab{height:38px;clip-path:polygon(10px 0,100% 0,calc(100% - 10px) 100%,0 100%);background:#121c4a;color:#9fb3e6;
  font-family:var(--f-disp);font-style:italic;font-weight:800;font-size:16px;letter-spacing:.06em;text-transform:uppercase;position:relative}
.vs-tab.on{background:linear-gradient(180deg,#1f3a8a,#132657);color:#fff}
.vs-tab.on::after{content:"";position:absolute;left:18%;right:18%;bottom:0;height:3px;background:#ff6fae;box-shadow:0 0 8px #ff6fae}
.vs-tab .dot{top:4px;right:14px;width:8px;height:8px;min-width:0;padding:0;background:#ff6fae}
.vs-sec{display:flex;align-items:center;gap:8px;margin:16px 0 8px;font-family:var(--f-disp);font-weight:800;font-style:italic;font-size:16px;letter-spacing:.08em;text-transform:uppercase;color:#fff}
.vs-sec::before{content:"";width:4px;height:16px;background:#ff6fae;transform:skewX(-14deg)}
.vs-sec::after{content:"";flex:1;height:1px;background:linear-gradient(90deg,#cfeeff55,transparent)}
.vs-sec small{font-size:11px;font-style:normal;font-weight:600;letter-spacing:.1em;color:#5ee7ff}
.vs-cut{clip-path:polygon(12px 0,100% 0,100% calc(100% - 12px),calc(100% - 12px) 100%,0 100%,0 12px)}
/* banners (offers) */
.vs-ban{position:relative;display:block;width:100%;height:150px;margin-bottom:10px;overflow:hidden;text-align:left;color:#fff;animation:vsIn .35s ease-out backwards}
.vs-ban .art{position:absolute;right:-6px;bottom:0;height:150px;width:auto;-webkit-mask:linear-gradient(90deg,transparent,#000 30%);mask:linear-gradient(90deg,transparent,#000 30%)}
.vs-ban .txt{position:relative;z-index:1;display:flex;flex-direction:column;align-items:flex-start;gap:5px;padding:14px 0 0 16px;height:100%;box-sizing:border-box}
.vs-ban .t{font-family:var(--f-disp);font-style:italic;font-weight:800;font-size:28px;line-height:.95;letter-spacing:.02em;text-shadow:0 2px 0 #0008}
.vs-ban .s{font-family:var(--f-disp);font-size:11px;font-weight:700;letter-spacing:.18em;text-transform:uppercase}
.vs-ban .its{display:flex;gap:8px;font-family:var(--f-disp);font-weight:800;font-size:14px}.vs-ban .its span{display:flex;align-items:center;gap:3px}
.vs-ban .its i,.vs-ban .its img,.vs-ban .its svg,.vs-ban .its .vi{width:18px!important;height:18px!important;display:block;flex:none}
.vs-tile .ico img,.vs-tile .ico svg,.vs-tile .ico .vi{width:40px;height:40px}
.vs-ban .tg{position:absolute;right:0;top:0;z-index:2;padding:2px 10px 2px 16px;background:#ff6fae;font-family:var(--f-disp);font-style:italic;font-weight:800;font-size:14px;clip-path:polygon(10px 0,100% 0,100% 100%,0 100%)}
.vs-ban.gold{background:radial-gradient(circle at 80% 60%,#ffd36b66,transparent 55%),linear-gradient(110deg,#3a2606,#140c2a 65%)}
.vs-ban.gold .t{background:linear-gradient(180deg,#fffbe8,#ffd36b 60%,#ef8d14);-webkit-background-clip:text;background-clip:text;color:transparent}
.vs-ban.gold .s{color:#ffe7a0}
.vs-ban.cyan{background:radial-gradient(circle at 80% 60%,#5ee7ff55,transparent 55%),linear-gradient(110deg,#0a2a5a,#0c1238 65%)}
.vs-ban.cyan .s{color:#9ff0ff}
.vs-price{margin-top:auto;margin-bottom:12px;padding:6px 18px;clip-path:polygon(10px 0,100% 0,calc(100% - 10px) 100%,0 100%);background:linear-gradient(180deg,#ffe28f,#ffb02e);color:#2a1600;
  font-family:var(--f-disp);font-style:italic;font-weight:800;font-size:18px}
.vs-price s{opacity:.55;font-size:12px;margin-right:6px}
/* tiles */
.vs-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px}
.vs-tile{position:relative;display:flex;flex-direction:column;align-items:center;justify-content:flex-end;gap:4px;min-height:118px;padding:10px 4px 0;
  background:radial-gradient(circle at 50% 35%,#2a4aa855,transparent 60%),linear-gradient(180deg,#16235a,#0c1440);color:#fff;overflow:hidden;animation:vsIn .35s ease-out backwards}
.vs-grid>*:nth-child(2){animation-delay:.04s}.vs-grid>*:nth-child(3){animation-delay:.08s}.vs-grid>*:nth-child(4){animation-delay:.12s}.vs-grid>*:nth-child(5){animation-delay:.16s}.vs-grid>*:nth-child(6){animation-delay:.2s}
@keyframes vsIn{from{opacity:0;transform:translateY(8px)}}
.vs-tile .ico{flex:1;display:grid;place-items:center}
.vs-tile .ico i{display:block}
.vs-tile .ico canvas{width:84px;height:auto}
.vs-tile .ico img{width:40px;height:40px;object-fit:contain}
.vs-tile .q{font-family:var(--f-disp);font-style:italic;font-weight:800;font-size:20px;line-height:1;letter-spacing:.02em}
.vs-tile .n{font-family:var(--f-disp);font-size:12px;font-weight:700;letter-spacing:.06em;color:#9fb3e6}
.vs-tile .pb{align-self:stretch;margin:4px -4px 0;padding:6px 0;text-align:center;font-family:var(--f-disp);font-style:italic;font-weight:800;font-size:15px;letter-spacing:.03em;
  background:linear-gradient(180deg,#ff8cc0,#e8327f);color:#fff}
.vs-tile .pb.cur{background:#0a1030;color:#fff;display:flex;justify-content:center;align-items:center;gap:4px}
.vs-tile .pb.ad{background:linear-gradient(180deg,#2a6fd0,#173f8a)}
.vs-tile .rb{position:absolute;right:-24px;top:9px;width:90px;padding:1px 0;transform:rotate(38deg);text-align:center;background:#ff6fae;font-family:var(--f-disp);font-weight:800;font-size:11px;letter-spacing:.04em}
.vs-tile .rb.best{background:linear-gradient(90deg,#ffd36b,#ffb02e);color:#2a1600}
.vs-tile.l2{background:radial-gradient(circle at 50% 35%,#ffd36b44,transparent 60%),linear-gradient(180deg,#2a2160,#120c38)}
.vs-wide{display:flex;align-items:center;gap:12px;width:100%;padding:12px 14px;margin-top:8px;color:#fff;text-align:left;background:linear-gradient(110deg,#2a1a5a,#0c1440 70%)}
.vs-wide img{width:46px;height:46px;object-fit:contain}
.vs-wide b{font-family:var(--f-disp);font-style:italic;font-weight:800;font-size:20px}
.vs-wide em{display:block;font-style:normal;font-size:11px;font-weight:600;color:#c8d4ff}
.vs-wide .go{margin-left:auto;padding:6px 16px;clip-path:polygon(8px 0,100% 0,calc(100% - 8px) 100%,0 100%);background:linear-gradient(180deg,#c39bff,#6a35c8);font-family:var(--f-disp);font-style:italic;font-weight:800}
.vs-vip{background:radial-gradient(circle at 15% 50%,#ffd36b55,transparent 40%),linear-gradient(110deg,#3a2606,#140c2a 70%)}
.vs-vip .v{font-family:var(--f-disp);font-style:italic;font-weight:800;font-size:34px;background:linear-gradient(180deg,#fffbe8,#ffd36b 60%,#ef8d14);-webkit-background-clip:text;background-clip:text;color:transparent}
.vs-vip .go{background:linear-gradient(180deg,#ffe28f,#ffb02e);color:#2a1600}
.vs-note{font-size:10.5px;font-weight:600;color:#7f8fc0;text-align:center;margin-top:8px;line-height:1.4}

.vc{position:relative;display:flex;align-items:center;gap:10px;width:100%;min-height:104px;margin-bottom:8px;padding:6px 10px 6px 4px;text-align:left;color:#fff;
  background:radial-gradient(circle at 16% 50%,color-mix(in srgb,var(--cc) 30%,transparent),transparent 45%),linear-gradient(110deg,#17235a,#0b1236 70%);animation:vsIn .35s ease-out backwards}
.vc.t1{animation-delay:.06s}.vc.t2{animation-delay:.12s;background:radial-gradient(circle at 16% 50%,#ffd36b55,transparent 45%),linear-gradient(110deg,#3a2606,#140c2a 70%)}
.vc::after{content:"";position:absolute;left:12px;right:40%;bottom:0;height:2px;background:var(--cc);box-shadow:0 0 8px var(--cc)}
.vc-art{flex:none;width:108px;display:grid;place-items:center}.vc-art canvas{width:104px;height:auto;filter:drop-shadow(0 6px 10px #000a)}
.vc-info{flex:1;min-width:0;display:flex;flex-direction:column;gap:4px}
.vc-info b{font-family:var(--f-disp);font-style:italic;font-weight:800;font-size:19px;letter-spacing:.03em;color:var(--cc)}
.vc-l{font-family:var(--f-disp);font-size:10px;font-weight:700;letter-spacing:.16em;text-transform:uppercase;color:#8fa0d0}
.vc-its{display:flex;flex-wrap:wrap;gap:4px}
.vc-ch{display:inline-flex;align-items:center;gap:3px;padding:1px 7px;background:#0a1030cc;font-size:11px;font-weight:700;color:#e6eeff;clip-path:polygon(5px 0,100% 0,calc(100% - 5px) 100%,0 100%)}
.vc-ch i,.vc-ch img,.vc-ch svg,.vc-ch .vi{width:14px!important;height:14px!important;display:block;flex:none}
.vc-ch.hot{background:linear-gradient(90deg,#ff6fae,#c2307a);color:#fff}
.vc-buy{flex:none;align-self:center;display:flex;align-items:center;gap:4px;padding:7px 14px;clip-path:polygon(8px 0,100% 0,calc(100% - 8px) 100%,0 100%);
  background:linear-gradient(180deg,#ff8cc0,#e8327f);font-family:var(--f-disp);font-style:italic;font-weight:800;font-size:16px}
.vc-buy i{width:16px;height:16px;display:block}
.gw{padding:12px 12px 14px;background:radial-gradient(circle at 85% 0,#ffd36b40,transparent 45%),linear-gradient(160deg,#2a1a5a,#0c0f34 70%);animation:vsIn .35s ease-out .1s backwards}
.gw-h{display:flex;align-items:center;gap:10px}.gw-h img{width:44px;height:44px;object-fit:contain;filter:drop-shadow(0 0 8px #ffb02e)}
.gw-h b{display:block;font-family:var(--f-disp);font-style:italic;font-weight:800;font-size:22px;background:linear-gradient(180deg,#fffbe8,#ffd36b 60%,#ef8d14);-webkit-background-clip:text;background-clip:text;color:transparent}
.gw-h em{font-style:normal;font-size:11.5px;font-weight:600;color:#c8d4ff}
.gw-pr{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:6px;margin-top:10px}
.gw-it{position:relative;display:flex;flex-direction:column;align-items:center;gap:2px;padding:6px 2px 6px;background:#0a1030cc;clip-path:polygon(7px 0,100% 0,100% calc(100% - 7px),calc(100% - 7px) 100%,0 100%,0 7px)}
.gw-it::before{content:"";position:absolute;left:0;right:0;top:0;height:3px;background:var(--rc)}
.gw-it.r3{--rc:#ffb02e;background:radial-gradient(circle at 50% 35%,#ffb02e55,transparent 65%),#1a1236}.gw-it.r2{--rc:#b36bff}.gw-it.r1{--rc:#38a8ff}.gw-it.r0{--rc:#9fb0d0}
.gw-it .pic{height:44px;display:grid;place-items:center}.gw-it .pic img{max-width:44px;max-height:44px;object-fit:contain}
.gw-it .pc{font-family:var(--f-disp);font-style:italic;font-weight:800;font-size:17px;line-height:1;color:var(--rc)}
.gw-it .nm{font-size:9.5px;font-weight:700;line-height:1.15;text-align:center;color:#c8d4ff}
.gw-it.r3 .pic img{animation:gwGlow 1.8s ease-in-out infinite}
@keyframes gwGlow{50%{filter:drop-shadow(0 0 10px #ffd36b)}}
.gw-set{margin-top:8px;font-size:10.5px;font-weight:600;line-height:1.35;color:#ffe7a0}
.gw-pity{margin-top:8px;font-size:11.5px;font-weight:700;color:#e6eeff}.gw-pity b{color:#ffd36b}
.gw-pity>i{display:block;height:6px;margin-top:4px;background:#0a1030;overflow:hidden}.gw-pity>i>i{display:block;height:100%;background:linear-gradient(90deg,#ff6fae,#ffd36b)}
.gw-go{display:flex;align-items:center;justify-content:center;gap:6px;width:100%;margin-top:10px;padding:9px;clip-path:polygon(10px 0,100% 0,calc(100% - 10px) 100%,0 100%);
  background:linear-gradient(180deg,#ffe28f,#ffb02e);color:#2a1600;font-family:var(--f-disp);font-style:italic;font-weight:800;font-size:20px;letter-spacing:.04em}
.gw-go i{width:16px;height:16px;display:block}
.gw-btns{display:grid;grid-template-columns:1fr 1fr;gap:8px}.gw-btns .gw-go{flex-direction:column;gap:0;padding:6px 4px;font-size:18px;position:relative}
.gw-go small{display:flex;align-items:center;gap:3px;font-size:13px;font-style:normal}
.gw-go.pink{background:linear-gradient(180deg,#ff8cc0,#e8327f);color:#fff}
.gw-go .sv{position:absolute;right:12px;top:0;padding:0 5px;font-size:10px;background:#e8327f;color:#fff}
.gw-go.coin{margin-top:8px;padding:6px 10px;font-size:15px;background:linear-gradient(180deg,#2a6fd0,#173f8a);color:#fff;justify-content:center}
.gw-go.coin em{font-style:normal;font-size:11px;font-weight:600;color:#cfe6ff;margin-left:6px}
.gw-go[disabled]{filter:grayscale(1) brightness(.6)}
.gwc{margin-top:0;background:radial-gradient(circle at 85% 0,#5ee7ff33,transparent 45%),linear-gradient(160deg,#10306a,#0a1236 70%)}
.gwc .gw-h b{background:linear-gradient(180deg,#ffffff,#9ff0ff 60%,#38a8ff);-webkit-background-clip:text;background-clip:text;color:transparent}
.gwc .gw-h img{filter:drop-shadow(0 0 8px #38a8ff)}
.gw-pr.two{grid-template-columns:1fr 1fr}
.gwc .gw-go.coin{margin-top:8px;font-size:18px;padding:8px}
.gw-odds{margin-top:6px;font-size:10px;font-weight:600;line-height:1.35;color:#8fa0d0;text-align:center}
/* one screen per tab, no scrolling */
.tabbed #shop .body,#shop #shopBody{padding-bottom:calc(var(--navh) + 34px)}
.vs-tabs{padding:2px 0 6px}
.vs-tab{height:34px;font-size:15px}
.vs-page .vs-sec{margin:10px 0 6px;font-size:15px}.vs-page .vs-sec:first-child{margin-top:2px}
.vs-page .vs-grid{gap:6px}
.vs-page .vs-note{margin-top:4px;font-size:9.5px;line-height:1.3}
.vs-page .vs-tile{min-height:0;padding:4px 4px 0;gap:1px}
.vs-page .vs-tile .q{font-size:17px}.vs-page .vs-tile .n{font-size:11px}
.vs-page .vs-tile .pb{padding:4px 0;font-size:13px}
.vs-page .vs-tile .rb{top:6px;right:-26px;font-size:10px}
/* offers */
.p-offers .vs-ban{height:132px;margin-bottom:8px}.p-offers .vs-ban .art{height:132px}
.p-offers .vs-ban .txt{padding:12px 0 0 14px;gap:4px}.p-offers .vs-ban .t{font-size:26px}
.p-offers .vs-price{margin-bottom:9px;padding:4px 14px;font-size:16px}
.p-offers .vs-tile{height:106px}.p-offers .vs-tile .ico svg,.p-offers .vs-tile .ico img,.p-offers .vs-tile .ico .vi{width:30px;height:30px}
.p-offers .vs-wide{margin-top:0;padding:12px 12px}.p-offers .vs-vip .v{font-size:26px}.p-offers .vs-wide b{font-size:16px}.p-offers .vs-wide em{font-size:10px}
/* gems */
.p-gems .vs-grid .vs-tile{height:96px}
.p-gems .vs-tile .ico canvas{width:78px}
.p-gems .vs-grid [data-chest]{height:122px}
.p-gems [data-cp] .q{font-size:16px}.p-gems [data-cp] .ico i{width:calc(var(--u)*.38)!important;height:calc(var(--u)*.38)!important}
/* spins */
.p-spin .gw{padding:10px 10px 12px}
.p-spin .gw-h img{width:38px;height:38px}.p-spin .gw-h b{font-size:20px}.p-spin .gw-h em{font-size:10.5px}
.p-spin .gw-pr{margin-top:6px;gap:5px}
.p-spin .gw-it{padding:6px 2px}.p-spin .gw-it .pic{height:42px}.p-spin .gw-it .pic img{max-width:42px;max-height:42px}
.p-spin .gw-it .pc{font-size:16px}.p-spin .gw-it .nm{font-size:9px}
.p-spin .gw-set{margin-top:5px;font-size:9.5px}
.p-spin .gw-pity{margin-top:5px;font-size:10.5px}.p-spin .gw-pity>i{height:4px;margin-top:3px}
.p-spin .gw-btns{margin-top:7px}.p-spin .gw-btns .gw-go{margin-top:0;padding:7px 4px;font-size:17px}.p-spin .gw-go small{font-size:11px}
.p-spin .gw-row{display:grid;grid-template-columns:1fr 1fr 1.15fr;gap:5px;margin-top:8px}
.p-spin .gwc .gw-go.coin{margin:0;flex-direction:column;gap:0;padding:4px;font-size:17px}
.p-spin .gw-odds{margin-top:4px;font-size:9.5px}
/* fill the screen exactly: sizes follow the content height (container query units), with sane minimums */
#shop #shopBody{container-type:size}
.p-offers .vs-ban{height:max(124px,min(220px,calc((100cqh - 300px)/2)))!important}.p-offers .vs-ban .art{height:100%!important}
.p-gems{--u:max(64px,calc((100cqh - 232px)/4.2))}
.p-gems .vs-grid .vs-tile{height:var(--u)!important;min-height:0}.p-gems [data-gp] .ico i{transform:scale(calc(var(--u)/72px))}.p-gems .vs-grid [data-chest]{height:calc(var(--u)*1.35)!important}.p-gems [data-cp]{height:calc(var(--u)*.8)!important}
.p-gems [data-chest] .ico canvas{width:auto;height:calc(var(--u)*.75)}
.p-spin .gw{display:flex;flex-direction:column;justify-content:space-between}
.p-spin .gw:not(.gwc){min-height:max(250px,calc((100cqh - 120px)*.6))}.p-spin .gwc{min-height:max(160px,calc((100cqh - 120px)*.4))}
.p-spin .gw-it{justify-content:center}.p-spin .gw-pr .gw-it{min-height:max(78px,calc((100cqh - 120px)*.17))}

</style>`;

// ===== Hangar: Valkyrie skin; "Ships" tab becomes the character page (sample) =====
const hangar = `
<style>
#hangar{background:linear-gradient(180deg,#070b22d8,#05081aee),var(--shopbg,none) center/cover}
#hangar .hdr{gap:8px;padding:10px 10px 6px;background:none;border:0}
#hangar .hdr h2{margin:0;padding:3px 26px 3px 14px;background:linear-gradient(90deg,#ff6fae,#c2307a);clip-path:polygon(0 0,100% 0,calc(100% - 14px) 100%,0 100%);
  font-family:var(--f-disp);font-style:italic;font-weight:800;font-size:24px;letter-spacing:.04em;text-transform:uppercase;color:#fff}
#hangar .hres .res{border-radius:0;border:0;background:#0a1030cc;clip-path:polygon(8px 0,100% 0,calc(100% - 8px) 100%,0 100%);padding:3px 10px;font-family:var(--f-disp);font-size:13px}
#hangar .hres .plus{background:none;color:#ff6fae;font-size:16px}
#hangar #hTabs{display:grid;grid-template-columns:repeat(6,1fr);gap:3px;padding:0 8px 6px;background:none;border:0}
#hangar #hTabs .tab{height:32px;border-radius:0;border:0;clip-path:polygon(8px 0,100% 0,calc(100% - 8px) 100%,0 100%);background:#121c4a;color:#9fb3e6;box-shadow:none;
  font-family:var(--f-disp);font-style:italic;font-weight:800;font-size:12px;letter-spacing:.02em;text-transform:uppercase;position:relative;padding:0}
#hangar #hTabs .tab.on{background:linear-gradient(180deg,#1f3a8a,#132657);color:#fff}
#hangar #hTabs .tab.on::after{content:"";position:absolute;left:18%;right:18%;bottom:0;height:3px;background:#ff6fae;box-shadow:0 0 8px #ff6fae}
#hangarBody.hv-on{padding:0 10px calc(var(--navh) + 34px);overflow:hidden;container-type:size}
.hv{height:100%;display:flex;flex-direction:column;gap:7px}
.hv-stage{position:relative;flex:1 1 auto;min-height:110px;overflow:hidden;touch-action:pan-y;
  background:radial-gradient(ellipse 55% 50% at 50% 58%,color-mix(in srgb,var(--hc,#5ee7ff) 22%,transparent),transparent 70%)}
.hv-stage::after{content:"";position:absolute;left:20%;right:20%;bottom:6px;height:18px;border-radius:50%;border:2px solid var(--hc,#5ee7ff);opacity:.45;box-shadow:0 0 16px var(--hc,#5ee7ff)}
.hv-girl{position:absolute;left:50%;bottom:0;height:100%;width:auto;transform:translateX(-50%);z-index:1;filter:drop-shadow(0 0 16px #0008);animation:hvIn .35s ease-out}
.hv-ship{position:absolute;left:50%;top:50%;width:62%;transform:translate(-50%,-55%);z-index:1;filter:drop-shadow(0 0 20px var(--hc,#5ee7ff));animation:hvIn .35s ease-out}
@keyframes hvIn{from{opacity:0;translate:16px 0}}
.hv-soon{position:absolute;left:50%;bottom:20px;transform:translateX(-50%);z-index:2;padding:1px 10px;background:#0a1030cc;font-family:var(--f-disp);font-size:11px;letter-spacing:.14em;color:#9fb3e6;white-space:nowrap}
.hv-name{position:absolute;left:0;bottom:30px;z-index:3;pointer-events:none}
.hv-name .rt{display:inline-block;padding:0 10px 0 6px;background:var(--hc);color:#0a1030;font-family:var(--f-disp);font-style:italic;font-weight:800;font-size:12px;letter-spacing:.08em;clip-path:polygon(0 0,100% 0,calc(100% - 8px) 100%,0 100%)}
.hv-name em{display:block;margin-top:4px;font-style:normal;font-family:var(--f-disp);font-weight:800;font-size:12px;letter-spacing:.3em;color:var(--hc)}
.hv-name b{display:block;font-family:var(--f-disp);font-style:italic;font-weight:800;font-size:44px;line-height:.9;color:#fff;text-shadow:0 2px 0 #0a1030,0 0 16px #0008;text-transform:uppercase}
.hv-name i{display:block;font-style:normal;color:#ffd36b;font-size:14px;letter-spacing:2px;text-shadow:0 0 6px #000}.hv-name i s{text-decoration:none;color:#3a4270}
.hv-pow{position:absolute;right:0;top:4px;z-index:3;text-align:right}
.hv-pow small{display:block;font-family:var(--f-disp);font-size:11px;font-weight:700;letter-spacing:.2em;color:#9fb3e6}
.hv-pow b{font-family:var(--f-disp);font-style:italic;font-weight:800;font-size:34px;line-height:1;color:#fff;text-shadow:0 0 12px var(--hc)}
.hv-pow em{display:block;font-style:normal;font-family:var(--f-disp);font-weight:700;font-size:12px;color:#52f19a}
.hv-form{position:absolute;right:0;top:86px;z-index:3;width:84px;padding:6px 4px 4px;text-align:center;background:#0a1030cc;clip-path:polygon(8px 0,100% 0,100% calc(100% - 8px),calc(100% - 8px) 100%,0 100%,0 8px)}
.hv-form img{width:58px;height:58px;object-fit:contain;filter:drop-shadow(0 0 8px var(--hc))}
.hv-form span{display:block;font-family:var(--f-disp);font-size:10px;font-weight:700;letter-spacing:.1em;color:#cfe6ff}
.hv-arr{position:absolute;top:44%;z-index:4;width:30px;height:30px;transform:rotate(45deg);background:#0a1030cc;border:1px solid #cfeeffaa;font-size:0}
.hv-arr::before{content:"";position:absolute;inset:9px;border:solid #fff;border-width:0 0 2px 2px}
.hv-arr.l{left:2px}.hv-arr.r{right:2px}.hv-arr.r::before{border-width:2px 2px 0 0}
.hv-ult{flex:none;display:flex;align-items:center;gap:8px;padding:6px 10px;background:linear-gradient(90deg,#2a1a5a,#0c1440);clip-path:polygon(10px 0,100% 0,100% calc(100% - 10px),calc(100% - 10px) 100%,0 100%,0 10px)}
.hv-ult .vi,.hv-ult svg,.hv-ult img{width:34px!important;height:34px!important;flex:none}
.hv-ult small{display:block;font-family:var(--f-disp);font-size:10px;font-weight:700;letter-spacing:.16em;color:#c39bff;text-transform:uppercase}
.hv-ult b{font-family:var(--f-disp);font-style:italic;font-weight:800;font-size:16px;color:#ffd36b}.hv-ult span>span{display:block;font-size:11px;font-weight:600;color:#c8d4ff;line-height:1.3}
.hv-stats{flex:none;display:grid;grid-template-columns:repeat(3,1fr);gap:5px}
.hv-stats>span{padding:4px 6px;background:#0a1030cc;text-align:center;clip-path:polygon(6px 0,100% 0,calc(100% - 6px) 100%,0 100%)}
.hv-stats small{display:block;font-family:var(--f-disp);font-size:10px;font-weight:700;letter-spacing:.14em;color:#8fa0d0;text-transform:uppercase}
.hv-stats b{font-family:var(--f-disp);font-weight:800;font-size:16px;color:#fff}
.hv-lv{flex:none;display:flex;align-items:center;gap:8px;font-family:var(--f-disp);font-weight:700;font-size:12px;color:#cfe6ff}
.hv-lv i{flex:1;height:5px;background:#0a1030}.hv-lv i i{display:block;height:100%;background:linear-gradient(90deg,#ff6fae,#ffd36b)}
.hv-acts{flex:none;display:grid;grid-template-columns:1fr 1.4fr;gap:8px}
.hv-acts button{display:flex;flex-direction:column;align-items:center;justify-content:center;height:46px;clip-path:polygon(10px 0,100% 0,calc(100% - 10px) 100%,0 100%);
  font-family:var(--f-disp);font-style:italic;font-weight:800;font-size:17px;letter-spacing:.05em;text-transform:uppercase}
.hv-acts small{display:flex;align-items:center;gap:3px;font-size:12px;font-style:normal}.hv-acts small i{width:13px;height:13px;display:block}
.hv-acts .eq{background:linear-gradient(180deg,#2a6fd0,#173f8a);color:#fff}.hv-acts .eq[disabled]{background:#16204a;color:#7f8fc0}
.hv-acts .up{background:linear-gradient(180deg,#ffe28f,#ffb02e);color:#2a1600}.hv-acts .ev,.hv-acts .buy{background:linear-gradient(180deg,#ff8cc0,#e8327f);color:#fff}
.hv-acts .wide{grid-column:1/-1}
.hv-rrow{flex:none;display:flex;align-items:center;gap:8px}
.hv-rrow .hv-arr{position:relative;top:auto;left:auto;right:auto;flex:none;margin:0 5px}
.hv-roster{flex:1;min-width:0;display:flex;gap:6px;overflow-x:auto;scrollbar-width:none;padding:2px 0}
.hv-roster::-webkit-scrollbar{display:none}
.hv-c{position:relative;flex:none;width:58px;height:66px;padding:0;background:#121c4a center 12%/cover no-repeat;clip-path:polygon(8px 0,100% 0,100% calc(100% - 8px),calc(100% - 8px) 100%,0 100%,0 8px)}
.hv-c img{width:44px;height:44px;object-fit:contain;margin-top:4px}
.hv-c b{position:absolute;left:0;right:0;bottom:0;padding:1px 0;background:linear-gradient(transparent,#0a1030ee 40%);font-family:var(--f-disp);font-size:10px;font-weight:700;letter-spacing:.04em;color:#fff}
.hv-c::before{content:"";position:absolute;left:0;right:0;top:0;height:3px;background:var(--rc)}
.hv-c.sel{outline:2px solid #ff6fae;outline-offset:-2px;box-shadow:inset 0 0 12px #ff6fae88}
.hv-c.lock{filter:grayscale(.85) brightness(.55)}.hv-c.lock.sel{filter:grayscale(.3) brightness(.85)}
.hv-c .eqd{position:absolute;right:4px;top:6px;width:8px;height:8px;border-radius:50%;background:#52f19a;box-shadow:0 0 6px #52f19a}
</style>`;

// ===== Hangar Gear / Skills / Drones / Support tabs: Valkyrie skin, one screen each =====
const htabs = `
<style>
#hangarBody.hz{container-type:size;overflow:hidden;padding:0 10px calc(var(--navh) + 34px);display:flex;flex-direction:column;gap:7px}
#hangarBody.hz .skhint{display:none}
.vk-cut{clip-path:polygon(10px 0,100% 0,100% calc(100% - 10px),calc(100% - 10px) 100%,0 100%,0 10px)}
/* gear */
.hz-gear .gtop{flex:none;grid-template-columns:72px 1fr 72px;height:min(34cqh,230px)}
.hz-gear .gcol{display:flex;flex-direction:column;gap:8px;height:100%;justify-content:center}
.hz-gear .gslot,.hz-gear .gtile{border:0!important;border-radius:0!important;box-shadow:none!important;background:linear-gradient(180deg,#1a2a66,#0d1540);clip-path:polygon(8px 0,100% 0,100% calc(100% - 8px),calc(100% - 8px) 100%,0 100%,0 8px)}
.hz-gear .gslot.r1,.hz-gear .gtile.r1{background:radial-gradient(circle at 50% 40%,#38a8ff55,transparent 70%),#0d1a4a}
.hz-gear .gslot.r2,.hz-gear .gtile.r2{background:radial-gradient(circle at 50% 40%,#b36bff66,transparent 70%),#1a1048}
.hz-gear .gslot.r3,.hz-gear .gtile.r3{background:radial-gradient(circle at 50% 40%,#ffb02e77,transparent 70%),#2a1a10}
.hz-gear .gslot::after,.hz-gear .gtile::after{content:"";position:absolute;left:0;right:0;bottom:0;height:3px;background:var(--grc,#9fb0d0)}
.hz-gear .r1{--grc:#38a8ff}.hz-gear .r2{--grc:#b36bff}.hz-gear .r3{--grc:#ffb02e}
.hz-gear .gslot.empty{background:#0a1030aa}
.hz-gear .gslot .gsn,.hz-gear .gtile span{font-family:var(--f-disp);font-size:11px;font-weight:700}
.hz-gear .gship{position:relative;height:100%;display:grid;place-items:center;overflow:hidden}
.hz-gear .gship img{max-height:82%;max-width:100%;object-fit:contain;margin-bottom:22px;filter:drop-shadow(0 0 16px #5ee7ff88);animation:hgbob 2.4s ease-in-out infinite}
.hz-gear .gship{background:radial-gradient(circle at 50% 45%,#5ee7ff22,transparent 62%)}
.hz-gear .gship img.gbust{position:absolute;bottom:0;left:50%;transform:translateX(-50%);height:100%;max-width:none;-webkit-mask:linear-gradient(transparent,#000 12%,#000 70%,transparent);mask:linear-gradient(transparent,#000 12%,#000 70%,transparent)}
.hz-gear .gpow{position:absolute;left:0;right:0;bottom:4px;z-index:1;text-align:center}
.hz-gear .gpow span{font-family:var(--f-disp);font-size:10px;font-weight:700;letter-spacing:.2em;color:#9fb3e6}
.hz-gear .gpow b{display:block;font-family:var(--f-disp);font-style:italic;font-weight:800;font-size:26px;line-height:1;color:#fff;text-shadow:0 0 10px #5ee7ff,0 2px 0 #0a1030}
.hz-gear .gsets{flex:none;display:flex;gap:5px;justify-content:center}
.hz-gear .gset{border-radius:0;clip-path:polygon(6px 0,100% 0,calc(100% - 6px) 100%,0 100%);padding:2px 10px;font-family:var(--f-disp);font-size:12px;font-weight:700;background:#0a1030cc;color:var(--sc);border:0}
.hz-gear .gset.on{background:color-mix(in srgb,var(--sc) 30%,#0a1030);color:#fff}
.hz-gear .gbar{flex:none;display:flex;align-items:center;justify-content:space-between}
.hz-gear .gmat{display:flex;align-items:center;gap:4px;font-family:var(--f-disp);font-weight:700}.hz-gear .gmat img{width:26px;height:26px}
.hz-gear .gbar .btn{border-radius:0;box-shadow:none;clip-path:polygon(10px 0,100% 0,calc(100% - 10px) 100%,0 100%);font-family:var(--f-disp);font-style:italic;font-weight:800;padding:6px 16px;display:flex;align-items:center;gap:4px}
.hz-gear .gbar .btn img{width:20px;height:20px}
.hz-gear .gfil{flex:none;display:grid;grid-template-columns:repeat(5,1fr);gap:4px}
.hz-gear .gfil button{height:28px;border:0;border-radius:0;clip-path:polygon(7px 0,100% 0,calc(100% - 7px) 100%,0 100%);background:#121c4a;color:#9fb3e6;font-family:var(--f-disp);font-style:italic;font-weight:800;font-size:12px;text-transform:uppercase}
.hz-gear .gfil button.on{background:linear-gradient(180deg,#ff8cc0,#e8327f);color:#fff}
.hz-gear .ginv{flex:1 1 auto;min-height:0;overflow-y:auto;align-content:start;gap:6px;padding-bottom:4px;scrollbar-width:none}
/* skills */
.vk-sub{flex:none;display:grid;grid-template-columns:repeat(4,1fr);gap:4px}
.vk-sub button{height:30px;clip-path:polygon(7px 0,100% 0,calc(100% - 7px) 100%,0 100%);background:#121c4a;color:#9fb3e6;font-family:var(--f-disp);font-style:italic;font-weight:800;font-size:12px;text-transform:uppercase;position:relative}
.vk-sub button.on{background:linear-gradient(180deg,#ff8cc0,#e8327f);color:#fff}
.vk-sub button i{position:absolute;right:8px;top:3px;width:6px;height:6px;border-radius:50%;background:#ffd36b}
.hz-skills .skcat{display:none!important}
.hz-skills .skgrid{display:none;gap:7px}.hz-skills .skgrid.show{display:grid}
.hz-skills .vk-cap{flex:none;font-family:var(--f-disp);font-size:12px;font-weight:600;letter-spacing:.06em;color:#9fb3e6}.hz-skills .vk-cap b{color:#52f19a}
.hz-skills .sktile{border:0!important;border-radius:0!important;box-shadow:none!important;height:min(calc((100cqh - 110px)/2.1),190px);justify-content:center;
  background:radial-gradient(circle at 50% 35%,#2a4aa855,transparent 60%),linear-gradient(180deg,#16235a,#0c1440);clip-path:polygon(10px 0,100% 0,100% calc(100% - 10px),calc(100% - 10px) 100%,0 100%,0 10px)}
.hz-skills .sktile.can{background:radial-gradient(circle at 50% 35%,#ffd36b44,transparent 60%),linear-gradient(180deg,#2a2a5a,#141440)}
.hz-skills .sktile.max{background:radial-gradient(circle at 50% 35%,#52f19a33,transparent 60%),linear-gradient(180deg,#123a4a,#0c1a30)}
.hz-skills .sktile .vi{width:62px;height:62px;filter:drop-shadow(0 0 6px #5ee7ff88)}
.hz-skills .sktile b{font-family:var(--f-disp);font-style:italic;font-weight:800;font-size:14px;min-height:0}
.hz-skills .skkind{border-radius:0;clip-path:polygon(0 0,100% 0,calc(100% - 6px) 100%,0 100%);font-family:var(--f-disp)}
.hz-skills .skcost{font-family:var(--f-disp);font-weight:800}
/* drones */
.hz-drones .dshow{flex:none;border-radius:0;clip-path:polygon(12px 0,100% 0,100% calc(100% - 12px),calc(100% - 12px) 100%,0 100%,0 12px)}
.hz-drones .dshow canvas{aspect-ratio:auto;height:min(24cqh,190px);object-fit:contain}
.hz-drones .dshow .rtag,.hz-drones .dshow .dinuse{border-radius:0;font-family:var(--f-disp)}
.hz-drones .dinfo{flex:none;display:flex;flex-direction:column;gap:5px}
.hz-drones .dname b{font-family:var(--f-disp);font-style:italic;font-weight:800;font-size:24px}
.hz-drones .ddesc{margin:0;font-size:12px}
.hz-drones .hgchips span{border-radius:0;clip-path:polygon(6px 0,100% 0,calc(100% - 6px) 100%,0 100%)}
.hz-drones .hgacts .btn{border-radius:0;box-shadow:none;clip-path:polygon(10px 0,100% 0,calc(100% - 10px) 100%,0 100%);font-family:var(--f-disp);font-style:italic;font-weight:800;padding:8px}
.hz-drones .dgrid{flex:1 1 auto;min-height:0;margin:0;padding:0;border:0;grid-template-columns:repeat(5,minmax(0,1fr));grid-auto-rows:1fr;gap:5px}
.hz-drones .dtile{border:0;border-radius:0;padding:3px 2px;justify-content:center;min-height:0;background:linear-gradient(180deg,#16235a,#0c1440);clip-path:polygon(7px 0,100% 0,100% calc(100% - 7px),calc(100% - 7px) 100%,0 100%,0 7px)}
.hz-drones .dtile.sel{background:linear-gradient(180deg,#3a1650,#1a1040);box-shadow:inset 0 0 0 2px #ff6fae}
.hz-drones .dtile .dfloat{height:auto}.hz-drones .dtile .dfloat img,.hz-drones .dtile .dfloat canvas{width:62px;height:62px;object-fit:contain}
.hz-drones .dtile.lockd .dfloat{filter:brightness(.6) saturate(.5)}.hz-drones .dtile b{font-family:var(--f-disp);font-size:11px}.hz-drones .dtile em{font-size:9.5px}
/* support officers */
.hz-pilots>p{margin:0;font-size:12px;color:#9fb3e6}
.hz-pilots .list{display:flex;flex-direction:column;gap:8px}
.hz-pilots .card.row{border:0;border-radius:0;height:min(calc((100cqh - 56px)/3 - 8px),150px);padding:0 12px 0 0;gap:12px;overflow:hidden;
  background:linear-gradient(110deg,color-mix(in srgb,var(--pc) 28%,#0c1440),#0c1440 60%);clip-path:polygon(12px 0,100% 0,100% calc(100% - 12px),calc(100% - 12px) 100%,0 100%,0 12px)}
.hz-pilots .avatar{width:38%!important;max-width:150px;height:100%!important;flex:none;border-radius:0!important;background:none!important;-webkit-mask:linear-gradient(90deg,#000 70%,transparent);mask:linear-gradient(90deg,#000 70%,transparent)}
.hz-pilots .card.row>div:nth-child(2){min-width:0}.hz-pilots .card.row>div:nth-child(2) div{font-size:12px!important}
.hz-pilots .avatar img{width:100%;height:100%;object-fit:cover;object-position:top}
.hz-pilots .card b{font-family:var(--f-disp);font-style:italic;font-weight:800;font-size:22px}
.hz-pilots .btn{border-radius:0;box-shadow:none;clip-path:polygon(8px 0,100% 0,calc(100% - 8px) 100%,0 100%);font-family:var(--f-disp);font-style:italic;font-weight:800}
</style>`;


// ===== Settings: Valkyrie skin, 4 tabs, one screen =====
const settings = `
<style>
#settings{background:linear-gradient(180deg,#070b22d8,#05081aee),var(--shopbg,none) center/cover}
#settings .hdr{gap:10px;padding:10px 10px 6px;background:none;border:0}
#settings .hdr .back{width:32px;height:32px;border-radius:0;transform:rotate(45deg);background:#0a1030;border:1px solid #cfeeffaa;font-size:0;flex:none;margin:0 6px;box-shadow:none}
#settings .hdr .back::before{content:"";position:absolute;inset:10px 9px 10px 11px;border:solid #fff;border-width:0 0 2px 2px}
#settings .hdr h2{margin:0;padding:3px 26px 3px 14px;background:linear-gradient(90deg,#ff6fae,#c2307a);clip-path:polygon(0 0,100% 0,calc(100% - 14px) 100%,0 100%);
  font-family:var(--f-disp);font-style:italic;font-weight:800;font-size:24px;letter-spacing:.04em;text-transform:uppercase;color:#fff}
.tabbed #settings .back{display:none}
#setBody{container-type:size;overflow:hidden;padding:0 10px calc(var(--navh) + 34px)!important;display:flex;flex-direction:column;gap:8px}
.vst-tabs{flex:none;display:grid;grid-template-columns:repeat(4,1fr);gap:4px}
.vst-tabs button{height:34px;clip-path:polygon(9px 0,100% 0,calc(100% - 9px) 100%,0 100%);background:#121c4a;color:#9fb3e6;font-family:var(--f-disp);font-style:italic;font-weight:800;font-size:13px;letter-spacing:.04em;text-transform:uppercase;position:relative}
.vst-tabs button.on{background:linear-gradient(180deg,#1f3a8a,#132657);color:#fff}
.vst-tabs button.on::after{content:"";position:absolute;left:18%;right:18%;bottom:0;height:3px;background:#ff6fae;box-shadow:0 0 8px #ff6fae}
.vst-pg{display:none;flex-direction:column;gap:8px;min-height:0}.vst-pg.on{display:flex;animation:vsIn .25s ease-out}
#setBody .sec-t{margin:4px 0 0;display:flex;align-items:center;gap:8px;font-family:var(--f-disp);font-weight:800;font-style:italic;font-size:15px;letter-spacing:.08em;text-transform:uppercase;color:#fff;border:0;padding:0}
#setBody .sec-t::before{content:"";width:4px;height:15px;background:#ff6fae;transform:skewX(-14deg)}
#setBody .sec-t::after{content:"";flex:1;height:1px;background:linear-gradient(90deg,#cfeeff55,transparent)}
#setBody .card{border:0;border-radius:0;box-shadow:none;padding:4px 12px;background:linear-gradient(110deg,#16235a,#0c1440 75%);clip-path:polygon(12px 0,100% 0,100% calc(100% - 12px),calc(100% - 12px) 100%,0 100%,0 12px)}
#setBody .setrow{min-height:54px;border-color:#cfeeff1a;font-family:var(--f-disp);font-size:16px;font-weight:700;letter-spacing:.02em}
#setBody .setrow.sub{min-height:34px}
#setBody .sic{width:36px;height:36px;flex:none;display:grid;place-items:center}#setBody .sic img{width:36px;height:36px;object-fit:contain;filter:drop-shadow(0 0 4px #5ee7ff88)}#setBody .sic .vi,#setBody .sic svg,#setBody .sic img{width:34px!important;height:34px!important}
/* switch: slanted track with a diamond knob */
#setBody .toggle{width:58px;height:26px;border-radius:0;background:#0a1030;border:1px solid #cfeeff44;clip-path:polygon(6px 0,100% 0,calc(100% - 6px) 100%,0 100%);box-shadow:none;position:relative}
#setBody .toggle::after{content:"";position:absolute;top:5px;left:9px;width:14px;height:14px;border-radius:0;background:#7f8fc0;transform:rotate(45deg);transition:left .18s,background .18s;box-shadow:none}
#setBody .toggle.on{background:linear-gradient(90deg,#c2307a,#ff6fae);border-color:#ffb3d6}
#setBody .toggle.on::after{left:33px;background:#fff;box-shadow:0 0 8px #fff}
/* slider */
#setBody input[type=range]{accent-color:#ff6fae;height:4px}
#setBody .setrow b.num{font-family:var(--f-disp);color:#5ee7ff}
/* segmented */
#setBody .seg{border-radius:0;background:#0a1030;padding:2px;gap:2px;clip-path:polygon(6px 0,100% 0,calc(100% - 6px) 100%,0 100%)}
#setBody .seg button{border-radius:0;font-family:var(--f-disp);font-style:italic;font-weight:800;font-size:13px;padding:5px 12px;color:#9fb3e6;clip-path:polygon(5px 0,100% 0,calc(100% - 5px) 100%,0 100%)}
#setBody .seg button.on{background:linear-gradient(180deg,#ff8cc0,#e8327f);color:#fff;box-shadow:none}
/* account buttons */
#setBody .card.list{display:flex;flex-direction:column;gap:6px;padding:8px 12px}
#setBody .card.list .btn{border-radius:0;box-shadow:none;clip-path:polygon(9px 0,100% 0,calc(100% - 9px) 100%,0 100%);padding:9px;font-family:var(--f-disp);font-style:italic;font-weight:800;font-size:14px;letter-spacing:.03em;text-transform:uppercase}
#setBody .card.list .btn.ghost{background:#0a1030;color:#dfe8ff}
#setBody .vst-tools .card.list{display:grid;grid-template-columns:1fr 1fr}
#setBody .vst-tools .card.list .btn{font-size:11px;padding:8px 4px}
#setBody .vst-ver{margin:auto 0 0;text-align:center;font-family:var(--f-disp);font-size:11px;letter-spacing:.12em;color:#7f8fc0}
</style>`;


// ===== Profile: Valkyrie skin, one screen =====
const profile = `
<style>
#profile{background:linear-gradient(180deg,#070b22d8,#05081aee),var(--shopbg,none) center/cover}
#profile .hdr{gap:10px;padding:10px 10px 6px;background:none;border:0}
#profile .hdr .back{width:32px;height:32px;border-radius:0;transform:rotate(45deg);background:#0a1030;border:1px solid #cfeeffaa;font-size:0;flex:none;margin:0 6px;box-shadow:none}
#profile .hdr .back::before{content:"";position:absolute;inset:10px 9px 10px 11px;border:solid #fff;border-width:0 0 2px 2px}
#profile .hdr h2{margin:0;padding:3px 26px 3px 14px;background:linear-gradient(90deg,#ff6fae,#c2307a);clip-path:polygon(0 0,100% 0,calc(100% - 14px) 100%,0 100%);
  font-family:var(--f-disp);font-style:italic;font-weight:800;font-size:24px;letter-spacing:.04em;text-transform:uppercase;color:#fff}
#profBody{container-type:size;overflow:hidden;padding:0 10px 12px!important;display:flex;flex-direction:column;gap:7px}
.vp-cut{clip-path:polygon(12px 0,100% 0,100% calc(100% - 12px),calc(100% - 12px) 100%,0 100%,0 12px)}
.vp-sec{flex:none;display:flex;align-items:center;gap:8px;font-family:var(--f-disp);font-weight:800;font-style:italic;font-size:14px;letter-spacing:.08em;text-transform:uppercase;color:#fff}
.vp-sec::before{content:"";width:4px;height:14px;background:#ff6fae;transform:skewX(-14deg)}
.vp-sec::after{content:"";flex:1;height:1px;background:linear-gradient(90deg,#cfeeff55,transparent)}
.vp-sec small{font-size:11px;font-style:normal;font-weight:600;letter-spacing:.1em;color:#5ee7ff}
/* hero */
.vp-hero{flex:none;position:relative;height:max(150px,min(25cqh,200px));overflow:hidden;background:radial-gradient(circle at 78% 60%,color-mix(in srgb,var(--hc) 35%,transparent),transparent 55%),linear-gradient(110deg,#121c4a,#0a1030 60%)}
.vp-hero .art{position:absolute;right:-6px;bottom:0;height:100%;width:auto;-webkit-mask:linear-gradient(90deg,transparent,#000 25%);mask:linear-gradient(90deg,transparent,#000 25%)}
.vp-id{position:relative;z-index:1;height:100%;display:flex;flex-direction:column;justify-content:center;gap:4px;padding-left:14px;max-width:64%}
.vp-rank{display:inline-flex;align-items:center;gap:5px;align-self:flex-start;padding:1px 12px 1px 6px;background:linear-gradient(90deg,#ffd36b,#e89a1c);color:#2a1600;
  font-family:var(--f-disp);font-style:italic;font-weight:800;font-size:13px;letter-spacing:.08em;text-transform:uppercase;clip-path:polygon(0 0,100% 0,calc(100% - 8px) 100%,0 100%)}
.vp-rank .vi,.vp-rank svg,.vp-rank img{width:16px!important;height:16px!important}
.vp-name{font-family:var(--f-disp);font-style:italic;font-weight:800;font-size:28px;line-height:1;color:#fff;text-shadow:0 2px 0 #0a1030}
.vp-pid{font-family:var(--f-disp);font-size:11px;letter-spacing:.12em;color:#9fb3e6}
.vp-lv{display:flex;align-items:center;gap:8px;margin-top:2px}
.vp-lv b{flex:none;width:34px;height:34px;display:grid;place-items:center;transform:rotate(45deg);background:linear-gradient(135deg,#ff8cc0,#c2307a);border:1px solid #ffd0e4}
.vp-lv b span{transform:rotate(-45deg);font-family:var(--f-disp);font-style:italic;font-weight:800;font-size:15px;color:#fff}
.vp-lv>span{flex:1;min-width:0}.vp-lv small{display:block;font-family:var(--f-disp);font-size:11px;font-weight:600;color:#cfe6ff;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.vp-lv i{display:block;height:5px;margin-top:3px;background:#0a1030}.vp-lv i i{height:100%;background:linear-gradient(90deg,#ff6fae,#ffd36b)}
.vp-ace{position:absolute;right:10px;bottom:6px;z-index:1;text-align:right;font-family:var(--f-disp);text-shadow:0 1px 3px #000}
.vp-ace small{display:block;font-size:10px;font-weight:700;letter-spacing:.16em;color:var(--hc)}
.vp-ace b{font-style:italic;font-weight:800;font-size:16px;color:#fff}
/* highlights */
.vp-hi{flex:none;display:grid;grid-template-columns:repeat(4,1fr);gap:5px}
.vp-hi>div{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:1px;height:max(56px,min(9cqh,74px));background:linear-gradient(180deg,#16235a,#0c1440)}
.vp-hi .ic{height:20px;display:grid;place-items:center;font-size:18px;color:#ffd36b}.vp-hi .ic img,.vp-hi .ic svg,.vp-hi .ic .vi{width:20px!important;height:20px!important}
.vp-hi b{font-family:var(--f-disp);font-style:italic;font-weight:800;font-size:17px;line-height:1.05;color:#fff}
.vp-hi small{font-size:9.5px;font-weight:600;color:#9fb3e6;text-align:center;line-height:1.1}
/* records */
.vp-rec{flex:none;display:grid;grid-template-columns:1fr 1fr;gap:5px}
.vp-rec>div{display:flex;align-items:center;gap:8px;height:max(40px,min(6.5cqh,52px));padding:0 10px;background:#0c1440cc;clip-path:polygon(8px 0,100% 0,calc(100% - 8px) 100%,0 100%)}
.vp-rec img,.vp-rec svg,.vp-rec .vi{width:26px!important;height:26px!important;flex:none;object-fit:contain}
.vp-rec b{display:block;font-family:var(--f-disp);font-style:italic;font-weight:800;font-size:16px;line-height:1;color:#fff}
.vp-rec small{display:block;font-size:10px;font-weight:600;color:#9fb3e6;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
/* campaign worlds */
.vp-w{flex:none;display:grid;grid-template-columns:1fr 1fr;gap:5px}
.vp-w>div{position:relative;height:max(44px,min(7cqh,56px));padding:5px 10px;display:flex;flex-direction:column;justify-content:space-between;background:#0c1440 center/cover;overflow:hidden}
.vp-w>div::before{content:"";position:absolute;inset:0;background:linear-gradient(90deg,#0a1030f0 35%,#0a103080)}
.vp-w>div>*{position:relative}
.vp-w b{font-family:var(--f-disp);font-style:italic;font-weight:800;font-size:13px;color:#fff}
.vp-w span{display:flex;align-items:center;gap:6px;font-family:var(--f-disp);font-size:11px;font-weight:700;color:#ffd36b}
.vp-w span i{flex:1;height:4px;background:#0a1030}.vp-w span i i{display:block;height:100%;background:linear-gradient(90deg,#ff6fae,#ffd36b)}
/* squad */
.vp-sq{flex:1 1 auto;min-height:0;display:grid;grid-template-columns:repeat(4,1fr);grid-auto-rows:1fr;gap:5px;max-height:190px}
.vp-c{position:relative;min-height:0;padding:0;background:#121c4a center 18%/cover no-repeat;clip-path:polygon(8px 0,100% 0,100% calc(100% - 8px),calc(100% - 8px) 100%,0 100%,0 8px)}
.vp-c::before{content:"";position:absolute;left:0;right:0;top:0;height:3px;background:var(--rc)}
.vp-c b{position:absolute;left:0;right:0;bottom:0;padding:8px 2px 2px;background:linear-gradient(transparent,#0a1030f0 50%);font-family:var(--f-disp);font-size:11px;font-weight:700;color:#fff;line-height:1.1}
.vp-c b small{display:block;font-size:9px;color:#ffd36b;font-weight:600}
.vp-c.lock{filter:grayscale(.85) brightness(.5)}
.vp-c.use{outline:2px solid #ff6fae;outline-offset:-2px}
.vp-c .eqd{position:absolute;right:5px;top:7px;width:8px;height:8px;border-radius:50%;background:#52f19a;box-shadow:0 0 6px #52f19a}
</style>`;


// ===== Battle: level-up cards and skill chips, Valkyrie skin =====
const battleui = `<style>
#vkBfx{position:absolute;left:12px;top:calc(env(safe-area-inset-top,0px) + 96px);z-index:20;display:grid;text-align:left;gap:0;padding:4px 12px 5px 10px;background:#0a1030e6;border:1px solid #ff6fae;color:#fff;font:600 12px "Be Vietnam Pro",sans-serif;clip-path:polygon(6px 0,100% 0,calc(100% - 6px) 100%,0 100%);cursor:pointer}
#vkBfx small{font:800 10px "Saira Condensed",sans-serif;letter-spacing:.16em;color:#ff6fae}
.vkp-ban{position:relative;height:96px;margin:-2px 0 10px;background:#1a0b2e center/cover;clip-path:polygon(10px 0,100% 0,100% calc(100% - 10px),calc(100% - 10px) 100%,0 100%,0 10px);overflow:hidden}
.vkp-ban::after{content:"";position:absolute;inset:0;background:linear-gradient(180deg,transparent 40%,#070a1ccc)}
.vkp-ban .art{position:absolute;inset:6px 10px 6px;display:flex;align-items:center;justify-content:center;gap:4px;z-index:1}
.vkp-ban .art img{height:70px;width:auto;max-width:31%;object-fit:contain;filter:drop-shadow(0 4px 8px #000)}
.vkp-ban.r .art img:nth-child(2){height:84px}
.vkp-ban .tag{position:absolute;left:8px;bottom:6px;z-index:2;font:800 11px "Saira Condensed",sans-serif;letter-spacing:.14em;color:#fff;background:#ff6fae;padding:2px 8px;transform:skewX(-12deg)}
.vkp-rw{margin:10px 0 2px}.vkp-rw small{display:block;font:700 10px "Saira Condensed",sans-serif;letter-spacing:.16em;color:#9aa6d6;text-transform:uppercase;margin-bottom:5px}
.vkp-rw>div{display:flex;gap:8px;flex-wrap:wrap}
.vkp-chip{display:inline-flex;align-items:center;gap:5px;background:#111836;border:1px solid #2a3566;padding:4px 10px 4px 6px;font-size:12px}
.vkp-chip img{width:18px;height:18px;object-fit:contain}.vkp-chip b{font-weight:700;color:#eef1ff}
.vkp-nrg{display:flex;align-items:center;gap:10px;margin:2px auto 6px;max-width:240px}.vkp-nrg img{width:42px;height:42px;object-fit:contain;filter:drop-shadow(0 0 8px #5ee7ff)}
.vkp-nrg .bar{flex:1;height:10px;background:#0a0e2a;border:1px solid #5ee7ff66;transform:skewX(-14deg)}.vkp-nrg .bar i{display:block;height:100%;background:linear-gradient(90deg,#5ee7ff,#9ff3ff)}
.vkp-mail{display:grid;grid-template-columns:40px 1fr;column-gap:10px}.vkp-mail>*:not(.mi){grid-column:2}
.vkp-mail .mi{grid-row:1/span 4;width:40px;height:40px;display:grid;place-items:center;background:#ff6fae22;border:1px solid #ff6fae88;transform:rotate(45deg) scale(.82);margin-top:4px}
.vkp-mail .mi img,.vkp-mail .mi{font-size:18px}.vkp-mail .mi img{width:26px;height:26px;transform:rotate(-45deg)}
.vkp-mail .from{display:block;font-size:10px;color:#5ee7ff;letter-spacing:.06em;margin:1px 0 2px}
.vkp-evban{position:relative;min-height:92px;padding:10px;background:#2a0710 center/cover;overflow:hidden}
.vkp-evban::before{content:"";position:absolute;inset:0;background:linear-gradient(90deg,#070a1cee 35%,#070a1c55)}.vkp-evban>*{position:relative}
.vkp-evban img{width:58px!important;height:58px!important}.vkp-evban img.e2,.vkp-evban img.e3{position:absolute;right:14px;top:6px;width:44px!important;height:44px!important;opacity:.8}.vkp-evban img.e3{right:58px;top:34px;opacity:.6}
.vkp-say{display:flex;align-items:center;gap:10px;margin:0 0 10px}.vkp-say img{width:52px;height:52px;object-fit:cover;object-position:top;border:1px solid #ff6fae;background:#111836}
.vkp-say p{margin:0;flex:1;font-size:13px;font-weight:600;background:#111836;border:1px solid #2a3566;padding:7px 10px}
#vkCore{position:absolute;left:14px;bottom:calc(150px + env(safe-area-inset-bottom,0px));width:60px;height:60px;pointer-events:none;z-index:6}
#vkCore .d{position:absolute;inset:8px;transform:rotate(45deg);border:2px solid var(--c);background:conic-gradient(from -45deg,color-mix(in srgb,var(--c) 55%,transparent) calc(var(--p)*1%),#0a0e2ad9 0);box-shadow:0 0 12px color-mix(in srgb,var(--c) 60%,transparent)}
#vkCore img{position:absolute;left:12px;top:12px;width:36px;height:36px;object-fit:contain;filter:drop-shadow(0 0 4px #000)}
#vkCore b{position:absolute;left:0;right:0;bottom:-14px;text-align:center;font:800 10px "Saira Condensed",sans-serif;letter-spacing:.16em;color:#fff;text-shadow:0 0 6px var(--c)}
#vkCore.cast .d{animation:vkCast .6s ease-out}@keyframes vkCast{0%{box-shadow:0 0 0 0 var(--c);transform:rotate(45deg) scale(1.25)}100%{box-shadow:0 0 24px 6px transparent;transform:rotate(45deg) scale(1)}}
#bossbar{left:56px;right:56px}#bossbar .lbl{font:800 13px "Saira Condensed",sans-serif;letter-spacing:.14em;color:#ffd1e6;text-shadow:0 0 8px #ff6fae;margin-bottom:4px}
#bossbar .bar{height:9px;background:#0a0e2acc;border:1px solid #ff6fae88;transform:skewX(-14deg)}#bossbar .bar i{background:linear-gradient(90deg,#ff6fae,#ffb02e)}
#lvup{background:radial-gradient(ellipse at 50% 35%,#1a2a66ee,#05081af4)}
#lvup .lvt{font-family:var(--f-disp);font-style:italic;font-weight:800;font-size:40px;letter-spacing:.04em;
  background:linear-gradient(180deg,#fff,#ffd36b 60%,#ef8d14);-webkit-background-clip:text;background-clip:text;color:transparent;filter:drop-shadow(0 2px 0 #3a1d00) drop-shadow(0 0 14px #ffb02e88)}
#lvup .lvsub{font-family:var(--f-disp);font-size:13px;letter-spacing:.14em;text-transform:uppercase;color:#5ee7ff}
#lvup .lvcard{border:0;border-radius:0;padding:10px 12px 10px 8px;gap:12px;position:relative;
  background:linear-gradient(110deg,color-mix(in srgb,var(--sc) 26%,#121c4a),#0a1030 70%);
  clip-path:polygon(14px 0,100% 0,100% calc(100% - 14px),calc(100% - 14px) 100%,0 100%,0 14px);animation:vsIn .3s ease-out backwards}
#lvup .lvcard:nth-child(2){animation-delay:.07s}#lvup .lvcard:nth-child(3){animation-delay:.14s}
#lvup .lvcard::before{content:"";position:absolute;left:0;top:0;bottom:0;width:4px;background:var(--sc);box-shadow:0 0 10px var(--sc)}
#lvup .lvic{width:62px;height:62px;filter:drop-shadow(0 0 8px var(--sc))}
#lvup .lvic svg,#lvup .lvic img.vi{width:62px;height:62px}
#lvup .lvname{font-family:var(--f-disp);font-style:italic;font-weight:800;font-size:19px;letter-spacing:.02em;color:#fff}
#lvup .lvnew{border-radius:0;padding:0 8px 0 5px;background:#ff6fae;color:#fff;font-family:var(--f-disp);font-style:italic;font-size:11px;clip-path:polygon(0 0,100% 0,calc(100% - 5px) 100%,0 100%)}
#lvup .lvdesc{font-size:12.5px;font-weight:600;color:#dfe8ff}
#lvup .lvpips i{border-radius:0;transform:skewX(-20deg);width:16px}
#lvup .lvpips i.on{background:var(--sc)}
#lvup .lvpips span{font-family:var(--f-disp);color:#9fb3e6}
#lvup .lvfoot .btn{border-radius:0;box-shadow:none;clip-path:polygon(9px 0,100% 0,calc(100% - 9px) 100%,0 100%);font-family:var(--f-disp);font-style:italic;font-weight:800;background:#121c4a;color:#cfe6ff}
.sbi svg,.sbi img{filter:drop-shadow(0 0 4px #5ee7ff88)}
.sbi em{border-radius:0;transform:skewX(-10deg);background:#ff6fae;color:#fff;font-family:var(--f-disp)}
.psk svg,.psk img.vi{filter:drop-shadow(0 0 4px #5ee7ff88)}
.vrstats .vi,.lpb .vi{filter:drop-shadow(0 0 4px #5ee7ff88)}
.pq .vi{filter:drop-shadow(0 0 4px #5ee7ff88)}.pq:not(.on) .vi{opacity:.45}
</style>`;


// ===== Battle skill buttons: smaller, Valkyrie frame, mono icons =====
const skbtn = `
<style>
#battle .skills{gap:8px;right:8px}
#battle .skill{width:48px;height:48px;border-radius:0;border:0;background:none;isolation:isolate}
#battle .skill::before{content:"";position:absolute;inset:10px;z-index:-1;transform:rotate(45deg);background:#0a1030e0;box-shadow:0 0 12px #5ee7ff55}
#battle .skill .vi,#battle .skill img.ico,#battle .skill svg.ico{width:46px!important;height:46px!important;filter:drop-shadow(0 0 4px #5ee7ff88)}
#battle .skill .cd{inset:10px;border-radius:0;transform:rotate(45deg);background:conic-gradient(#000b var(--p,0%),transparent 0)}
#battle .skill .cnt{right:-2px;bottom:-2px;min-width:16px;height:16px;line-height:16px;font-size:10px;border-radius:0;background:#ff6fae;color:#fff;font-family:var(--f-disp);clip-path:polygon(4px 0,100% 0,calc(100% - 4px) 100%,0 100%);padding:0 4px}
#battle .skill.ult{width:56px;height:56px;margin-left:-4px;background:none}
#battle .skill.ult::before{inset:12px;background:linear-gradient(135deg,#4a3a1a,#1a1530);box-shadow:0 0 12px #ffb02e55}
#battle .skill.ult .ultring{inset:5px;border-radius:0;transform:rotate(45deg);padding:3px;box-sizing:border-box;background:conic-gradient(from -45deg,#ffd36b var(--p,0%),#ffffff26 0);
  -webkit-mask:linear-gradient(#000 0 0) content-box,linear-gradient(#000 0 0);-webkit-mask-composite:xor;mask:linear-gradient(#000 0 0) content-box exclude,linear-gradient(#000 0 0)}
#battle .skill.ult .ultic .vi{width:38px!important;height:38px!important}
#battle .skill.ult .ultlbl{bottom:-6px;border-radius:0;font-family:var(--f-disp);font-style:italic;font-size:9px;padding:0 6px;background:#ffd36b;clip-path:polygon(4px 0,100% 0,calc(100% - 4px) 100%,0 100%)}
#battle .skill.ult.ready{animation:none}#battle .skill.ult.ready::before{box-shadow:0 0 16px #ffd36b;animation:ultready 1s ease-in-out infinite}
</style>`;


// ===== Level-up: pilot cut-in + 3 tall gacha-style cards =====
const lvui = `
<style>
#lvup.vl{justify-content:center;gap:10px;padding:0 10px;background:radial-gradient(ellipse 80% 55% at 50% 42%,#26306eb8,#05081acc)}
#lvup.vl::before{display:none}
#lvup.vl .lvhead{position:relative;display:flex;justify-content:center;width:min(390px,100%)}
.vl-girl{position:relative;flex:none;width:150px;height:160px;overflow:hidden;animation:vlGirl .45s cubic-bezier(.2,.9,.3,1.2) backwards}
.vl-girl img{position:absolute;left:50%;bottom:0;height:100%;width:auto;max-width:none;transform:translateX(-50%);-webkit-mask:linear-gradient(#000 70%,transparent);mask:linear-gradient(#000 70%,transparent)}
@keyframes vlGirl{from{opacity:0;transform:translateX(-30px)}}
.vl-tt{text-align:center;padding-bottom:6px}
#lvup.vl .lvt{font-size:46px;line-height:.9;animation:vlPop .4s cubic-bezier(.2,.9,.3,1.4) .1s backwards}
@keyframes vlPop{from{opacity:0;transform:scale(1.6)}}
#lvup.vl .lvsub{margin-top:6px;font-size:12px;line-height:1.3}
.vl-say{display:inline-block;margin-top:8px;padding:5px 10px;max-width:200px;background:#0a1030ee;border:1px solid #cfeeff88;font-size:12px;font-weight:700;color:#fff;
  clip-path:polygon(8px 0,100% 0,100% 100%,0 100%,0 8px);animation:vlPop .3s ease-out .35s backwards}
#lvup.vl .lvcards{flex-direction:row;gap:8px;width:min(390px,100%);align-items:stretch}
#lvup.vl .lvcard{flex:1 1 0;min-width:0;flex-direction:column;align-items:center;text-align:center;gap:6px;padding:16px 8px 12px;min-height:215px;
  background:linear-gradient(180deg,color-mix(in srgb,var(--sc) 34%,#141c4c),#0a1030 62%);clip-path:polygon(12px 0,100% 0,100% calc(100% - 12px),calc(100% - 12px) 100%,0 100%,0 12px);
  animation:vlCard .45s cubic-bezier(.2,.9,.3,1.15) backwards;transform-origin:50% 100%}
#lvup.vl .lvcard:nth-child(2){animation-delay:.08s}#lvup.vl .lvcard:nth-child(3){animation-delay:.16s}
@keyframes vlCard{from{opacity:0;transform:translateY(40px) rotateX(35deg)}}
#lvup.vl .lvcard::before{left:0;right:0;top:0;bottom:auto;width:auto;height:4px}
#lvup.vl .lvcard::after{content:"";position:absolute;inset:0;pointer-events:none;background:linear-gradient(115deg,transparent 35%,#ffffff26 50%,transparent 65%) -200px 0/200% 100% no-repeat;animation:vkShine 3s linear infinite}
#lvup.vl .lvcard:active{transform:scale(.95)}
#lvup.vl .lvic{width:76px;height:76px;margin-top:4px}
#lvup.vl .lvic svg,#lvup.vl .lvic img.vi{width:76px;height:76px}
#lvup.vl .lvtx{display:flex;flex-direction:column;align-items:center;gap:5px;width:100%;flex:1}
#lvup.vl .lvtx>.row{flex-direction:column;gap:3px!important}
#lvup.vl .lvname{font-size:17px;line-height:1.05}
#lvup.vl .lvnew{position:absolute;top:10px;right:-2px;font-size:10px}
#lvup.vl .lvdesc{margin:0;font-size:11.5px;line-height:1.35;color:#cfdcff;flex:1}
#lvup.vl .lvpips{justify-content:center;flex-wrap:wrap;gap:3px}
#lvup.vl .lvpips i{width:12px}
#lvup.vl .lvpips span{width:100%;text-align:center;margin:2px 0 0}
#lvup.vl .vl-still *{animation:none!important}
#lvup.vl .lvfoot .btn{padding:8px 22px;font-size:14px}
</style>`;


// ===== Splash: key art, logo, Valkyrie loading bar =====
const splash = `
<style>
#load .ldbg{opacity:1;animation:none;background-size:120% auto!important;background-position:center 0!important;background-color:#05081a}
#load .ldbg::after{background:linear-gradient(180deg,#05081a55 0,#05081a00 26%,#05081a00 66%,#05081ae6 82%,#05081a 90%)}
#load .ldlogo{margin-top:6%;width:92%}
#load #ldLogo{width:100%;max-width:380px;filter:drop-shadow(0 4px 18px #000c) drop-shadow(0 0 22px #ff6fae55)}
#load #ldLogoTxt{font-family:var(--f-disp);font-style:italic;font-weight:800;font-size:58px;line-height:.86;text-align:center;letter-spacing:.02em;
  background:linear-gradient(180deg,#ffffff,#d6e4ff 55%,#8fb0ff);-webkit-background-clip:text;background-clip:text;color:transparent;filter:drop-shadow(0 3px 0 #2a1650) drop-shadow(0 0 16px #ff6fae99)}
#load #ldLogoTxt span{display:block;margin-top:8px;font-size:15px;letter-spacing:.42em;font-style:normal;color:#5ee7ff;-webkit-text-fill-color:#5ee7ff}
#load .ldfoot{gap:7px}
#load .ldfoot p{font-family:var(--f-disp);font-size:13px;letter-spacing:.1em;text-transform:uppercase;color:#cfe6ff}
#load .ldbar{width:76%;height:8px;border-radius:0;background:#0a1030cc;box-shadow:none;clip-path:polygon(6px 0,100% 0,calc(100% - 6px) 100%,0 100%)}
#load .ldbar i{border-radius:0;background:linear-gradient(90deg,#c2307a,#ff6fae 60%,#ffd0e4);box-shadow:none}
#load #loadPct{font-family:var(--f-disp);font-style:italic;font-weight:800;font-size:16px;text-shadow:0 0 8px #ff6fae}
#load .ldver{font-family:var(--f-disp);letter-spacing:.14em}
</style>`;


// ===== Leaderboard: podium + list + pinned own rank, one screen =====
const rankui = `
<style>
#rank{background:linear-gradient(180deg,#070b22d8,#05081aee),var(--shopbg,none) center/cover}
#rank .hdr{gap:10px;padding:10px 10px 6px;background:none;border:0}
#rank .hdr .back{width:32px;height:32px;border-radius:0;transform:rotate(45deg);background:#0a1030;border:1px solid #cfeeffaa;font-size:0;flex:none;margin:0 6px;box-shadow:none}
#rank .hdr .back::before{content:"";position:absolute;inset:10px 9px 10px 11px;border:solid #fff;border-width:0 0 2px 2px}
#rank .hdr h2{margin:0;padding:3px 26px 3px 14px;background:linear-gradient(90deg,#ff6fae,#c2307a);clip-path:polygon(0 0,100% 0,calc(100% - 14px) 100%,0 100%);
  font-family:var(--f-disp);font-style:italic;font-weight:800;font-size:24px;letter-spacing:.04em;text-transform:uppercase;color:#fff}
#rank #rTabs{display:grid;grid-template-columns:repeat(3,1fr);gap:4px;padding:0 10px 6px;background:none;border:0}
#rank #rTabs .tab{height:34px;border-radius:0;border:0;box-shadow:none;clip-path:polygon(10px 0,100% 0,calc(100% - 10px) 100%,0 100%);background:#121c4a;color:#9fb3e6;
  font-family:var(--f-disp);font-style:italic;font-weight:800;font-size:15px;letter-spacing:.05em;text-transform:uppercase;position:relative}
#rank #rTabs .tab.on{background:linear-gradient(180deg,#1f3a8a,#132657);color:#fff}
#rank #rTabs .tab.on::after{content:"";position:absolute;left:18%;right:18%;bottom:0;height:3px;background:#ff6fae;box-shadow:0 0 8px #ff6fae}
#rankBody{display:flex;flex-direction:column;gap:6px;overflow:hidden;padding:0 10px 10px!important}
.vr-meta{flex:none;display:flex;justify-content:space-between;font-family:var(--f-disp);font-size:11px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:#9fb3e6}
.vr-meta b{color:#ffd36b}
.vr-pod{flex:none;display:grid;grid-template-columns:1fr 1.15fr 1fr;align-items:end;gap:6px;height:200px}
.vr-p{position:relative;display:flex;flex-direction:column;align-items:center;justify-content:flex-end;height:100%}
.vr-p .av{position:relative;width:86%;aspect-ratio:1;background:#121c4a center 15%/cover no-repeat;clip-path:polygon(50% 0,100% 50%,50% 100%,0 50%);margin-bottom:-14px;z-index:1}
.vr-p.p1 .av{width:96%}
.vr-p .crown{position:absolute;top:-2px;z-index:2;font-size:20px;color:var(--pc);text-shadow:0 0 10px var(--pc)}
.vr-p .bl{width:100%;padding:18px 4px 6px;text-align:center;background:linear-gradient(180deg,color-mix(in srgb,var(--pc) 45%,#141c4c),#0a1030);clip-path:polygon(10px 0,100% 0,100% 100%,0 100%,0 10px)}
.vr-p.p1 .bl{padding-top:22px;min-height:72px}.vr-p.p2 .bl,.vr-p.p3 .bl{min-height:54px}
.vr-p .rk{font-family:var(--f-disp);font-style:italic;font-weight:800;font-size:22px;line-height:1;color:var(--pc)}
.vr-p .nm{display:block;font-family:var(--f-disp);font-weight:700;font-size:13px;color:#fff;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.vr-p .sc{font-family:var(--f-disp);font-weight:800;font-size:13px;color:#ffe7a0}
.vr-p .gm{display:inline-flex;align-items:center;gap:2px;font-size:10px;font-weight:700;color:#ffd0e4}.vr-p .gm i{width:11px;height:11px;display:block}
.vr-list{flex:1 1 auto;min-height:0;overflow-y:auto;display:flex;flex-direction:column;gap:4px;scrollbar-width:none}
.vr-list::-webkit-scrollbar{display:none}
.vr-r{flex:none;display:flex;align-items:center;gap:10px;height:44px;padding:0 12px 0 8px;background:#0c1440cc;clip-path:polygon(8px 0,100% 0,calc(100% - 8px) 100%,0 100%)}
.vr-r .rk{width:28px;text-align:center;font-family:var(--f-disp);font-style:italic;font-weight:800;font-size:17px;color:#9fb3e6}
.vr-r .av{width:32px;height:32px;flex:none;background:#121c4a center 15%/cover no-repeat;clip-path:polygon(50% 0,100% 50%,50% 100%,0 50%)}
.vr-r .nm{flex:1;min-width:0;font-weight:700;font-size:13px;color:#eef3ff;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.vr-r .sc{font-family:var(--f-disp);font-weight:800;font-size:15px;color:#fff}
.vr-me{flex:none;height:50px;background:linear-gradient(90deg,#c2307a,#5a1a6a 60%,#2a1650);clip-path:polygon(10px 0,100% 0,calc(100% - 10px) 100%,0 100%);box-shadow:0 0 14px #ff6fae66}
.vr-me .rk{color:#fff}.vr-me .nm{color:#fff}
.vr-me small{display:block;font-size:10px;font-weight:600;color:#ffd0e4}
</style>`;


// ===== Campaign map: Valkyrie skin (diamond nodes, pilot marker, slanted world banners) =====
const mapui = `
<style>
#map{background:#05081a}
#map .hdr{gap:10px;padding:10px 10px 6px;background:none;border:0}
#map .hdr .back{width:32px;height:32px;border-radius:0;transform:rotate(45deg);background:#0a1030;border:1px solid #cfeeffaa;font-size:0;flex:none;margin:0 6px;box-shadow:none}
#map .hdr .back::before{content:"";position:absolute;inset:10px 9px 10px 11px;border:solid #fff;border-width:0 0 2px 2px}
#map .hdr h2{margin:0;padding:3px 26px 3px 14px;background:linear-gradient(90deg,#ff6fae,#c2307a);clip-path:polygon(0 0,100% 0,calc(100% - 14px) 100%,0 100%);
  font-family:var(--f-disp);font-style:italic;font-weight:800;font-size:24px;letter-spacing:.04em;text-transform:uppercase;color:#fff}
#map .hdr .res{margin-left:auto;border-radius:0;border:0;background:#0a1030cc;clip-path:polygon(8px 0,100% 0,calc(100% - 8px) 100%,0 100%);padding:3px 12px;font-family:var(--f-disp);font-size:14px}
#map .diffbar{display:grid;grid-template-columns:repeat(3,1fr);gap:4px;padding:0 10px 6px}
#map .diffbar .tab{height:34px;border-radius:0;border:0;box-shadow:none;clip-path:polygon(10px 0,100% 0,calc(100% - 10px) 100%,0 100%);background:#121c4a;color:#9fb3e6;
  font-family:var(--f-disp);font-style:italic;font-weight:800;font-size:15px;letter-spacing:.05em;text-transform:uppercase;position:relative}
#map .diffbar .tab.on{background:linear-gradient(180deg,#1f3a8a,#132657);color:#fff}
#map .diffbar .tab.on.hard{background:linear-gradient(180deg,#8a5a00,#4a2e00);color:#ffe7a0}
#map .diffbar .tab.on.hell{background:linear-gradient(180deg,#8a1428,#4a0a16);color:#ffd0d6}
#map .diffbar .tab.on::after{content:"";position:absolute;left:18%;right:18%;bottom:0;height:3px;background:#ff6fae;box-shadow:0 0 8px #ff6fae}
#map .diffbar .tab[data-lock]{opacity:.55}
#mapBody .wtitle{position:sticky;top:0;z-index:3;display:flex;align-items:center;gap:10px;margin:0;padding:6px 14px;background:linear-gradient(90deg,#c2307aee,#2a1650e6 55%,#0a1030cc);
  font-family:var(--f-disp);font-style:italic;font-weight:800;font-size:17px;letter-spacing:.04em;text-transform:uppercase;color:#fff;clip-path:polygon(0 0,100% 0,calc(100% - 12px) 100%,0 100%);border:0}
#mapBody .wtitle small{margin-left:auto;font-style:normal;font-size:12px;letter-spacing:.08em;color:#ffe7a0}
.mpath .pbase{stroke:#cfeeff;stroke-width:3;stroke-dasharray:2 10;opacity:.45}
.mpath .pglow{stroke:#ff6fae;stroke-width:12;opacity:.25}
.mpath .pdone{stroke:#ffb3d6;stroke-width:3}
#mapBody .mnode{width:54px;height:54px}
#mapBody .mnode .mcore{border-radius:0!important;transform:rotate(45deg) scale(.8);box-shadow:0 0 0 2px #0a1030,0 0 14px var(--gl)!important;
  background:linear-gradient(135deg,var(--c1),var(--c2))!important;border:1px solid #ffffffaa!important}
#mapBody .mnode .mcore>*{transform:rotate(-45deg)}
#mapBody .mnode .mcore b{font-style:italic;font-size:22px}
#mapBody .mnode.done{--c1:#9ff0ff;--c2:#1d63d6;--gl:#5ee7ff66}
#mapBody .mnode.cur{--c1:#ffb3d6;--c2:#c2307a;--gl:#ff6faecc}
#mapBody .mnode.cur{z-index:3}#mapBody .mnode.cur .mcore{animation:vmPulse 1.3s ease-in-out infinite}
@keyframes vmPulse{50%{box-shadow:0 0 0 2px #0a1030,0 0 26px #ff6fae}}
#mapBody .mnode.lock{--c1:#2a3468;--c2:#141a44;--gl:transparent}
#mapBody .mnode.boss{width:84px;height:84px}
#mapBody .mnode.boss .mcore{transform:rotate(45deg) scale(.78)}
#mapBody .mnode.boss.done{--c1:#ff8fa0;--c2:#8a1428;--gl:#ff516477}
#mapBody .mnode.boss.cur{--c1:#ff6fae;--c2:#5a0a28}
#mapBody .mnode .mboss{position:absolute;left:50%;top:50%;width:150%;height:auto;max-width:none;transform:translate(-50%,-50%) rotate(-45deg)!important}
#mapBody .mnode .mlk{border-radius:0;transform:rotate(45deg);width:18px;height:18px;right:-2px;top:-2px;font-size:0;background:#0a1030;border-color:#cfeeff55}
#mapBody .mnode .mlk::before{content:"";width:6px;height:6px;background:#7f8fc0;transform:rotate(-45deg)}
#mapBody .mnode .mstars{top:calc(100% + 2px);border-radius:0;padding:0 7px;clip-path:polygon(5px 0,100% 0,calc(100% - 5px) 100%,0 100%);background:#0a1030ee;font-size:12px}
#mapBody .mnode .mstars i.on{color:#ffd36b;text-shadow:0 0 4px #ffb02e}
#mapBody .mnode .mship.vmgirl{width:58px;height:58px;bottom:auto;top:50%;left:auto;right:calc(100% + 6px);transform:translateY(-50%);z-index:4;animation:none;object-fit:cover;object-position:center 15%;clip-path:polygon(50% 0,100% 50%,50% 100%,0 50%);
  background:#ff6fae;padding:2px;box-sizing:border-box;filter:drop-shadow(0 0 8px #ff6fae)}
</style>`;


// ===== Campaign: chapter select + stage grid (one screen) =====
const chapui = `
<style>
#mapBody.vc-on{container-type:size;overflow:hidden;padding:0 10px 12px!important;display:flex;flex-direction:column;gap:8px}
.vch{flex:none;position:relative;height:max(190px,min(38cqh,300px));overflow:hidden;background:#0a1030 center/cover;clip-path:polygon(14px 0,100% 0,100% calc(100% - 14px),calc(100% - 14px) 100%,0 100%,0 14px)}
.vch::before{content:"";position:absolute;inset:0;background:linear-gradient(90deg,#05081ae0 0,#05081a80 38%,#05081a00 60%),linear-gradient(0deg,#05081ab0,transparent 40%)}
.vch .girl{position:absolute;right:48px;bottom:4px;height:calc(100% - 10px);width:auto;max-width:none;filter:drop-shadow(0 0 16px #0009);animation:hvIn .4s ease-out}
.vch .tx{position:relative;z-index:1;height:100%;display:flex;flex-direction:column;justify-content:flex-end;gap:5px;padding:0 0 14px 16px;max-width:62%}
.vch .no{align-self:flex-start;padding:1px 14px 1px 8px;background:linear-gradient(90deg,#ff6fae,#c2307a);font-family:var(--f-disp);font-style:italic;font-weight:800;font-size:13px;letter-spacing:.12em;color:#fff;clip-path:polygon(0 0,100% 0,calc(100% - 8px) 100%,0 100%)}
.vch .nm{font-family:var(--f-disp);font-style:italic;font-weight:800;font-size:30px;line-height:.95;color:#fff;text-transform:uppercase;text-shadow:0 2px 0 #0a1030,0 0 14px #0008}
.vch .st{display:flex;align-items:center;gap:8px;font-family:var(--f-disp);font-size:13px;font-weight:700;color:#ffe7a0}
.vch .st i{flex:1;max-width:140px;height:5px;background:#0a1030cc}.vch .st i i{display:block;height:100%;background:linear-gradient(90deg,#ff6fae,#ffd36b)}
.vch .lk{position:absolute;inset:0;z-index:2;display:grid;place-items:center;background:#05081ab0;font-family:var(--f-disp);font-style:italic;font-weight:800;font-size:18px;letter-spacing:.06em;color:#cfe6ff}
.vch .ar{position:absolute;top:42%;z-index:3;width:30px;height:30px;transform:translateY(-50%) rotate(45deg);background:#0a1030e6;box-shadow:0 0 10px #000a;border:1px solid #cfeeffaa;font-size:0}
.vch .ar::before{content:"";position:absolute;inset:9px;border:solid #fff;border-width:0 0 2px 2px}
.vch .ar.l{left:12px}.vch .ar.r{right:12px}.vch .ar.r::before{border-width:2px 2px 0 0}
.vch .ar[disabled]{opacity:.3}
.vch .dots{position:absolute;right:14px;top:10px;z-index:2;display:flex;gap:5px}.vch .dots i{width:8px;height:8px;transform:rotate(45deg);background:#ffffff40}.vch .dots i.on{background:#ff6fae}
.vcg{flex:1 1 auto;min-height:0;display:grid;grid-template-columns:repeat(5,1fr);grid-template-rows:1fr 1fr;gap:6px}
.vcs{position:relative;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;min-height:0;background:linear-gradient(180deg,#16235a,#0c1440);
  clip-path:polygon(8px 0,100% 0,100% calc(100% - 8px),calc(100% - 8px) 100%,0 100%,0 8px);animation:vsIn .3s ease-out backwards}
.vcs .d{width:min(46px,72%);aspect-ratio:1;display:grid;place-items:center;transform:rotate(45deg) scale(.82);background:linear-gradient(135deg,#9ff0ff,#1d63d6);border:1px solid #fff9;box-shadow:0 0 10px #5ee7ff66}
.vcs .d b{transform:rotate(-45deg);font-family:var(--f-disp);font-style:italic;font-weight:800;font-size:18px;color:#fff;text-shadow:0 1px 0 #0a1030}
.vcs .sr{font-size:11px;letter-spacing:1px;color:#3a4278}.vcs .sr i{font-style:normal}.vcs .sr i.on{color:#ffd36b}
.vcs.cur{background:linear-gradient(180deg,#5a1a4a,#1a1040)}.vcs.cur .d{background:linear-gradient(135deg,#ffb3d6,#c2307a);box-shadow:0 0 16px #ff6fae;animation:vmPulse2 1.2s ease-in-out infinite}
@keyframes vmPulse2{50%{box-shadow:0 0 26px #ff6fae}}
.vcs.cur::after{content:"▶";position:absolute;top:4px;right:6px;font-size:10px;color:#ff6fae}
.vcs.lock{filter:saturate(.3) brightness(.55)}.vcs.lock .d{background:linear-gradient(135deg,#2a3468,#141a44);box-shadow:none}
.vcs.boss{background:linear-gradient(180deg,#4a0f20,#1a0a1c)}
.vcs.boss img{width:86%;max-height:58%;object-fit:contain;filter:drop-shadow(0 0 8px #ff5164aa)}
.vcs.boss .tg{font-family:var(--f-disp);font-style:italic;font-weight:800;font-size:11px;letter-spacing:.1em;color:#ff8fa0}
.vcgo{flex:none;height:50px;display:flex;align-items:center;justify-content:center;gap:10px;clip-path:polygon(12px 0,100% 0,calc(100% - 12px) 100%,0 100%);
  background:linear-gradient(180deg,#ffe28f,#ffb02e);color:#2a1600;font-family:var(--f-disp);font-style:italic;font-weight:800;font-size:22px;letter-spacing:.05em}
.vcgo small{font-size:13px;font-style:normal;display:flex;align-items:center;gap:3px}.vcgo small i{width:14px;height:14px;display:block}
</style>`;


// ===== Lucky wheel popup: hub + buttons =====
const wheelui = `
<style>
#veil .spinpop #wheelWrap{filter:drop-shadow(0 0 22px #ff6fae44)}
#veil #hub{width:70px;height:70px;margin:-35px;border-radius:0;transform:rotate(45deg);background:linear-gradient(135deg,#ffb3d6,#c2307a);border:2px solid #fff;box-shadow:0 0 18px #ff6fae,inset 0 0 0 4px #0a103055}
#veil #hub>*,#veil #hub{font-family:var(--f-disp);font-style:italic;font-weight:800;color:#fff}
#veil #hub{font-size:0}#veil #hub::after{content:attr(data-l);position:absolute;inset:0;display:grid;place-items:center;transform:rotate(-45deg);font-size:16px;letter-spacing:.04em;text-shadow:0 1px 0 #5a0a28}
#veil #hub:active{transform:rotate(45deg) scale(.93)}
</style>`;


// ===== Hangar "Boss" tab (sample): captured boss cores give a summon skill =====
const bossui = `
<style>
#hangarBody.hb{container-type:size;overflow:hidden;padding:0 10px calc(var(--navh) + 34px);display:flex;flex-direction:column;gap:7px}
.hb-show{flex:none;position:relative;height:max(170px,min(32cqh,260px));overflow:hidden;background:radial-gradient(circle at 50% 48%,color-mix(in srgb,var(--bc) 30%,transparent),transparent 62%),linear-gradient(180deg,#140a28,#0a1030);
  clip-path:polygon(14px 0,100% 0,100% calc(100% - 14px),calc(100% - 14px) 100%,0 100%,0 14px)}
.hb-sig{position:absolute;left:50%;top:50%;width:min(78%,250px);aspect-ratio:1;transform:translate(-50%,-50%);pointer-events:none}
.hb-sig i{position:absolute;inset:0;border:2px solid var(--bc);opacity:.55;transform:rotate(45deg);animation:hbSpin 18s linear infinite}
.hb-sig i:nth-child(2){inset:12%;opacity:.35;animation-direction:reverse;animation-duration:12s;border-style:dashed}
.hb-sig i:nth-child(3){inset:-6%;border-radius:50%;transform:none;opacity:.25;border-width:1px}
@keyframes hbSpin{to{transform:rotate(405deg)}}
.hb-boss{position:absolute;left:50%;top:50%;height:78%;width:auto;max-width:none;transform:translate(-50%,-50%);filter:drop-shadow(0 0 18px var(--bc));animation:hbFloat 3s ease-in-out infinite}
@keyframes hbFloat{50%{transform:translate(-50%,-54%)}}
.hb-show.lock .hb-boss{filter:brightness(0) drop-shadow(0 0 2px #cfeeff88);animation:none}
.hb-tag{position:absolute;left:12px;top:10px;z-index:1;padding:1px 12px 1px 6px;background:var(--bc);color:#0a1030;font-family:var(--f-disp);font-style:italic;font-weight:800;font-size:12px;letter-spacing:.08em;clip-path:polygon(0 0,100% 0,calc(100% - 8px) 100%,0 100%)}
.hb-nm{position:absolute;left:12px;bottom:10px;z-index:1}
.hb-nm b{display:block;font-family:var(--f-disp);font-style:italic;font-weight:800;font-size:24px;line-height:1;color:#fff;text-shadow:0 2px 0 #0a1030,0 0 12px var(--bc)}
.hb-nm em{font-style:normal;font-family:var(--f-disp);font-size:11px;font-weight:700;letter-spacing:.14em;color:var(--bc)}
.hb-lv{position:absolute;right:12px;bottom:10px;z-index:1;text-align:right;font-family:var(--f-disp)}
.hb-lv small{display:block;font-size:10px;letter-spacing:.16em;color:#9fb3e6}.hb-lv b{font-style:italic;font-weight:800;font-size:22px;color:#fff}
.hb-eq{position:absolute;right:12px;top:10px;z-index:1;padding:1px 8px;background:#52f19a;color:#043;font-family:var(--f-disp);font-weight:800;font-size:11px}
.hb-sk{flex:none;display:flex;gap:10px;padding:8px 10px;background:linear-gradient(110deg,color-mix(in srgb,var(--bc) 22%,#121c4a),#0a1030 70%);clip-path:polygon(10px 0,100% 0,100% calc(100% - 10px),calc(100% - 10px) 100%,0 100%,0 10px)}
.hb-sk .ic{flex:none;width:46px;height:46px;display:grid;place-items:center;transform:rotate(45deg) scale(.82);background:#0a1030;border:1px solid var(--bc);box-shadow:0 0 10px var(--bc)}
.hb-sk .ic span{transform:rotate(-45deg);font-size:20px;color:var(--bc)}
.hb-sk small{display:block;font-family:var(--f-disp);font-size:10px;font-weight:700;letter-spacing:.16em;color:var(--bc);text-transform:uppercase}
.hb-sk b{font-family:var(--f-disp);font-style:italic;font-weight:800;font-size:17px;color:#fff}
.hb-sk p{margin:2px 0 0;font-size:11.5px;font-weight:600;line-height:1.3;color:#cfdcff}
.hb-sk .cd{display:flex;gap:10px;margin-top:3px;font-family:var(--f-disp);font-size:11px;font-weight:700;color:#ffe7a0}
.hb-pas{flex:none;display:grid;grid-template-columns:1fr 1fr;gap:5px}
.hb-pas span{padding:4px 8px;background:#0a1030cc;font-size:11px;font-weight:700;color:#dfe8ff;clip-path:polygon(6px 0,100% 0,calc(100% - 6px) 100%,0 100%)}.hb-pas b{color:#52f19a}
.hb-sh{flex:none;display:flex;align-items:center;gap:8px;font-family:var(--f-disp);font-size:12px;font-weight:700;color:#cfe6ff}
.hb-sh i{flex:1;height:6px;background:#0a1030}.hb-sh i i{display:block;height:100%;background:linear-gradient(90deg,var(--bc),#fff)}
.hb-acts{flex:none;display:grid;grid-template-columns:1fr 1.3fr;gap:8px}
.hb-acts button{height:42px;clip-path:polygon(10px 0,100% 0,calc(100% - 10px) 100%,0 100%);font-family:var(--f-disp);font-style:italic;font-weight:800;font-size:16px;letter-spacing:.05em;text-transform:uppercase;display:flex;flex-direction:column;align-items:center;justify-content:center}
.hb-acts small{font-size:11px;font-style:normal}
.hb-acts .a{background:linear-gradient(180deg,#2a6fd0,#173f8a);color:#fff}.hb-acts .a[disabled]{background:#16204a;color:#7f8fc0}
.hb-acts .b{background:linear-gradient(180deg,#ffe28f,#ffb02e);color:#2a1600}.hb-acts .b[disabled]{filter:grayscale(1) brightness(.6)}
.hb-grid{flex:1 1 auto;min-height:0;display:grid;grid-template-columns:repeat(5,1fr);grid-auto-rows:1fr;gap:5px}
.hb-c{position:relative;min-height:0;display:grid;place-items:center;padding:4px 2px 14px;background:linear-gradient(180deg,#16235a,#0c1440);clip-path:polygon(7px 0,100% 0,100% calc(100% - 7px),calc(100% - 7px) 100%,0 100%,0 7px)}
.hb-c::before{content:"";position:absolute;left:0;right:0;top:0;height:3px;background:var(--bc)}
.hb-c img{max-width:86%;max-height:70%;object-fit:contain;filter:drop-shadow(0 0 6px var(--bc))}
.hb-c b{position:absolute;left:0;right:0;bottom:2px;font-family:var(--f-disp);font-size:9.5px;font-weight:700;color:#dfe8ff;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.hb-c.lock img{filter:brightness(0) drop-shadow(0 0 1px #cfeeff88)}.hb-c.lock b{color:#6b7bb0}
.hb-c.sel{background:linear-gradient(180deg,#3a1650,#1a1040);box-shadow:inset 0 0 0 2px #ff6fae}
.hb-c .eqd{position:absolute;right:4px;top:6px;width:7px;height:7px;border-radius:50%;background:#52f19a;box-shadow:0 0 5px #52f19a}
</style>`;


// ===== Feature locks + unlock dialog + tutorial overlay =====
const tutui = `
<style>
.vk-lk{position:relative;filter:grayscale(.85) brightness(.55)}
.vk-lkb{display:block;width:auto;height:auto;margin:0;line-height:16px;position:absolute;left:50%;top:-6px;bottom:auto;transform:translateX(-50%);z-index:5;padding:0 6px;white-space:nowrap;background:#0a1030ee;border:1px solid #cfeeff66;
  font-family:var(--f-disp);font-style:normal;font-weight:800;font-size:10px;letter-spacing:.04em;color:#ffd0e4;pointer-events:none;filter:none}
#hTabs .tab .vk-lkb{bottom:auto;top:-4px}
.hres .vk-lkb,.res .vk-lkb{font-size:0;padding:0 3px;top:-8px}.hres .vk-lkb::first-letter,.res .vk-lkb::first-letter{font-size:10px}
#vkTut{position:absolute;inset:0;z-index:80;touch-action:none}
#vkTut .hole{position:absolute;pointer-events:none;box-shadow:0 0 0 9999px #03051acc;border:2px solid #ff6fae;outline:2px solid #ff6fae66;outline-offset:4px;animation:vkHole 1s ease-in-out infinite}
#vkTut .hole.nohole{box-shadow:0 0 0 9999px #03051a99;border:0;outline:0}
@keyframes vkHole{50%{outline-offset:9px;outline-color:#ff6fae22}}
#vkTut .hand{position:absolute;width:34px;height:34px;transform:rotate(45deg);background:#ff6fae;border:2px solid #fff;box-shadow:0 0 14px #ff6fae;pointer-events:none;animation:vkHand .9s ease-in-out infinite}
#vkTut .hand::after{content:"";position:absolute;inset:10px 9px 8px 11px;border:solid #fff;border-width:3px 0 0 3px}
@keyframes vkHand{50%{translate:0 8px}}
#vkTut .drag{position:absolute;left:50%;width:46px;height:46px;margin-left:-23px;border-radius:50%;border:3px solid #fff;background:#ff6fae88;box-shadow:0 0 16px #ff6fae;pointer-events:none;animation:vkDrag 1.6s ease-in-out infinite}
@keyframes vkDrag{0%,100%{transform:translateX(-90px)}50%{transform:translateX(90px)}}
#vkTut .bub{position:absolute;left:10px;right:10px;display:flex;align-items:flex-end;gap:8px;pointer-events:none}
#vkTut .bub img{width:92px;height:auto;flex:none;filter:drop-shadow(0 0 10px #000)}
#vkTut .bub p{flex:1;margin:0 0 10px;padding:10px 12px;background:#0a1030f2;border:1px solid #cfeeffaa;font-size:14px;font-weight:700;line-height:1.4;color:#fff;
  clip-path:polygon(10px 0,100% 0,100% calc(100% - 10px),calc(100% - 10px) 100%,0 100%,0 10px)}
#vkTut .bub p b{color:#ff8cc0}
#vkTut .skip{position:absolute;right:10px;top:calc(10px + env(safe-area-inset-top,0px));padding:4px 12px;background:#0a1030cc;border:1px solid #cfeeff55;color:#9fb3e6;font-family:var(--f-disp);font-size:12px;letter-spacing:.06em}
#vkTut .skip.sure{color:#fff;border-color:#ff6fae;background:#5a1a4a}
#veil .vk-unl{text-align:center}
#veil .vk-unl .fs{display:flex;flex-wrap:wrap;justify-content:center;gap:8px;margin:6px 0 10px}
#veil .vk-unl .f{width:96px;padding:10px 4px;background:linear-gradient(180deg,#1f3a8a,#0c1440);clip-path:polygon(8px 0,100% 0,100% calc(100% - 8px),calc(100% - 8px) 100%,0 100%,0 8px);animation:vkTile .35s ease-out backwards}
#veil .vk-unl .f b{display:block;font-family:var(--f-disp);font-style:italic;font-weight:800;font-size:15px;color:#fff;margin-top:4px}
#veil .vk-unl .f .vi,#veil .vk-unl .f img{width:44px!important;height:44px!important;display:block;margin:auto}
#veil .vk-unl p{margin:0 0 4px;font-size:13px;font-weight:600;color:#cfdcff}
#veil .vk-unl .say{display:flex;align-items:center;gap:8px;text-align:left;margin-top:8px}
#veil .vk-unl .say img{width:54px;height:54px;object-fit:cover;object-position:top;clip-path:polygon(50% 0,100% 50%,50% 100%,0 50%);background:#ff6fae;flex:none}
#veil .vk-unl .say span{font-size:12.5px;font-weight:700;color:#fff}
</style>`;

// ===== Quests: Valkyrie skin, one screen =====
const quests = `
<style>
#missions{background:linear-gradient(180deg,#070b22d8,#05081aee),var(--shopbg,none) center/cover}
#missions .hdr{gap:8px;padding:10px 10px 6px;background:none;border:0}
#missions .hdr h2{margin:0;padding:3px 26px 3px 14px;background:linear-gradient(90deg,#ff6fae,#c2307a);clip-path:polygon(0 0,100% 0,calc(100% - 14px) 100%,0 100%);
  font-family:var(--f-disp);font-style:italic;font-weight:800;font-size:24px;letter-spacing:.04em;text-transform:uppercase;color:#fff}
#missions #qTabs{display:grid;grid-template-columns:1fr 1fr;gap:4px;padding:0 10px 6px;background:none;border:0}
#missions #qTabs .tab{height:34px;border-radius:0;border:0;box-shadow:none;clip-path:polygon(10px 0,100% 0,calc(100% - 10px) 100%,0 100%);background:#121c4a;color:#9fb3e6;
  font-family:var(--f-disp);font-style:italic;font-weight:800;font-size:15px;letter-spacing:.05em;text-transform:uppercase;position:relative}
#missions #qTabs .tab.on{background:linear-gradient(180deg,#1f3a8a,#132657);color:#fff}
#missions #qTabs .tab.on::after{content:"";position:absolute;left:18%;right:18%;bottom:0;height:3px;background:#ff6fae;box-shadow:0 0 8px #ff6fae}
#missions #qTabs .tab .dot{top:5px;right:16px;width:8px;height:8px;min-width:0;padding:0;background:#ff6fae}
#missionBody{container-type:size;overflow:hidden;padding:0 10px calc(var(--navh) + 34px)!important;display:flex;flex-direction:column;gap:6px}
.vq-chest{flex:none;position:relative;display:flex;align-items:center;gap:10px;padding:8px 10px;background:radial-gradient(circle at 12% 50%,#ffd36b44,transparent 40%),linear-gradient(110deg,#2a1e4a,#0c1238 70%);
  clip-path:polygon(12px 0,100% 0,100% calc(100% - 12px),calc(100% - 12px) 100%,0 100%,0 12px)}
.vq-chest img{width:64px;height:58px;object-fit:contain;flex:none;filter:drop-shadow(0 4px 6px #0008)}
.vq-chest.ready img{animation:vqShake 1.2s ease-in-out infinite}
@keyframes vqShake{0%,60%,100%{transform:none}70%{transform:rotate(-8deg) scale(1.06)}80%{transform:rotate(8deg) scale(1.06)}90%{transform:rotate(-4deg)}}
.vq-cm{flex:1;min-width:0}
.vq-cm b{font-family:var(--f-disp);font-style:italic;font-weight:800;font-size:18px;color:#ffd36b}
.vq-cm small{display:block;font-size:10.5px;font-weight:600;color:#9fb3e6}
.vq-pips{display:grid;grid-template-columns:repeat(6,1fr);gap:3px;margin:5px 0 3px}
.vq-pips i{height:7px;background:#0a1030;transform:skewX(-20deg)}.vq-pips i.on{background:linear-gradient(90deg,#ff6fae,#ffd36b)}.vq-pips i.goal{box-shadow:inset 0 0 0 1px #ffd36b}
.vq-btn{flex:none;min-width:72px;height:38px;padding:0 12px;clip-path:polygon(9px 0,100% 0,calc(100% - 9px) 100%,0 100%);font-family:var(--f-disp);font-style:italic;font-weight:800;font-size:15px;letter-spacing:.04em;text-transform:uppercase;color:#fff;background:linear-gradient(180deg,#2a6fd0,#173f8a)}
.vq-btn.claim{background:linear-gradient(180deg,#ffe28f,#ffb02e);color:#2a1600;animation:vqPulse 1.4s ease-in-out infinite}
@keyframes vqPulse{50%{filter:brightness(1.18)}}
.vq-btn.done,.vq-btn[disabled]{background:#16204a;color:#7f8fc0;animation:none}
.vq-list{flex:1 1 auto;min-height:0;display:flex;flex-direction:column;gap:6px}
.vq-row{flex:1 1 0;max-height:74px;min-height:50px;display:flex;align-items:center;gap:10px;padding:0 8px 0 6px;background:linear-gradient(110deg,#16235a,#0c1440 70%);
  clip-path:polygon(10px 0,100% 0,100% calc(100% - 10px),calc(100% - 10px) 100%,0 100%,0 10px);animation:vsIn .3s ease-out backwards;position:relative}
.vq-row:nth-child(2){animation-delay:.04s}.vq-row:nth-child(3){animation-delay:.08s}.vq-row:nth-child(4){animation-delay:.12s}.vq-row:nth-child(5){animation-delay:.16s}.vq-row:nth-child(6){animation-delay:.2s}
.vq-row.ok{background:linear-gradient(110deg,#3a2a12,#14123a 70%)}.vq-row.ok::before{content:"";position:absolute;left:0;top:0;bottom:0;width:3px;background:#ffd36b}
.vq-row.cl{opacity:.55}
.vq-rw{flex:none;width:46px;display:flex;flex-direction:column;align-items:center;gap:1px;font-family:var(--f-disp);font-weight:800;font-size:12px;color:#fff}
.vq-rw i{width:26px;height:26px;display:block}
.vq-mid{flex:1;min-width:0}
.vq-mid b{display:block;font-size:13px;font-weight:700;color:#eef3ff;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.vq-bar{display:flex;align-items:center;gap:6px;margin-top:4px}.vq-bar i{flex:1;height:5px;background:#0a1030}.vq-bar i i{display:block;height:100%;background:linear-gradient(90deg,#5ee7ff,#52f19a)}
.vq-row.ok .vq-bar i i{background:linear-gradient(90deg,#ff6fae,#ffd36b)}
.vq-bar span{font-family:var(--f-disp);font-size:11px;font-weight:700;color:#9fb3e6}
</style>`;
patch(css, css + frame + (USE_DLG ? dlg : "") + offer + shop + hangar + htabs + quests + settings + profile + battleui + skbtn + lvui + splash + rankui + mapui + chapui + wheelui + bossui + tutui);


patch(`<canvas id="shipShow" width="440" height="440"></canvas>`,
  `<canvas id="shipShow" width="440" height="440"></canvas><canvas id="girlShow" aria-label="Character, tap to talk"></canvas><div class="agBub" id="agBub" hidden></div>`);
patch(`<span class="h6eqtag">EQUIPPED</span>`, `<span class="agRar" id="agRar">C</span>`);
patch(`$("#homeShipName").textContent=d.name;`,
  `$("#homeShipName").textContent=GIRL[d.id]?GIRL[d.id].name:d.name;$("#agRar").textContent=d.rar;$("#agRar").style.setProperty("--rc",{C:"#9fdcff",R:"#52f19a",E:"#c79bff",L:"#ffc83d"}[d.rar]);$("#agCall").textContent=d.name.toUpperCase();`);
patch(`<b id="homeShipName">—</b>`, `<b id="homeShipName">—</b><span class="agCall" id="agCall"></span>`);

// render loop: girl if we have her art, else the old ship
patch(`else if(cur==="home"&&!popOpen){showT+=dt;const cv=$("#shipShow")`,
  `else if(cur==="home"&&!popOpen&&(showT+=dt,drawGirl(showT))){}
  else if(cur==="home"&&!popOpen){const cv=$("#shipShow")`);


// Legendary Spin: open-and-spin directly (opt.n) and a coin spin (opt.coin: own odds, 5/day, no pity)
patch(`gearSpin(){wheelSegs=GWHEEL;`, `gearSpin(opt){opt=opt||{};wheelSegs=GWHEEL;`);
patch(`if(S.gwPity>=GW_PITY-1)k=0;else{let r=Math.random()*100;for(;k<GW_W.length-1;k++){r-=GW_W[k];`, `if(!opt.coin&&S.gwPity>=GW_PITY-1)k=0;else{const W=opt.coin?GW_WC:GW_W;let r=Math.random()*W.reduce((a,b)=>a+b);for(;k<W.length-1;k++){r-=W[k];`);
patch(`S.gwPity=s.gear===3?0:S.gwPity+1;`, `S.gwPity=opt.coin?S.gwPity:s.gear===3?0:S.gwPity+1;`);
patch(`if(!spend({gem:n===10?C10:GW_COST}))return;busy=true;`, `if(opt.coin){if(!gwCoinLeft()){toast(L("No coin spins left today","Hết lượt quay bằng vàng hôm nay"));return;}if(!spend({coin:GW_CCOST}))return;gwCoinUse();}else if(!spend({gem:n===10?C10:GW_COST}))return;busy=true;`);
patch(`q.querySelector("#ok").onclick=()=>POPS.gearSpin();`, `q.querySelector("#ok").onclick=()=>POPS.gearSpin(opt.coin?(gwCoinLeft()?opt:{}):opt.n?opt:{});if(cur==="shop")renderShop();`);
patch(`p.querySelector("#gw10").onclick=()=>go(10);},`, `p.querySelector("#gw10").onclick=()=>go(10);if(opt.n){go(opt.n);if(!busy)closePop();}},`);
patch(`const GW_W=[4,18,15,8,18,9,8,20],GW_COST=60,GW_PITY=30;`, `const GW_W=[4,18,15,8,18,9,8,20],GW_COST=60,GW_PITY=30,GW_WC=[9,16,9,16,9,16,9,16],GW_CCOST=6000,GW_CMAX=5;
const GWHEEL_C=[{gear:1,lb:"RARE",col2:"#1f4fc4",img:"gear_vanguard_engine"},{alloy:20,lb:"×20",col2:"#2a3150",img:"mat_alloy"},{gear:1,lb:"RARE",col2:"#1f4fc4",img:"gear_aegis_plating"},{alloy:40,lb:"×40",col2:"#2a3150",img:"mat_alloy"},
  {gear:1,lb:"RARE",col2:"#1f4fc4",img:"gear_solar_cannon"},{alloy:20,lb:"×20",col2:"#2a3150",img:"mat_alloy"},{gear:1,lb:"RARE",col2:"#1f4fc4",img:"gear_vanguard_cannon"},{alloy:30,lb:"×30",col2:"#2a3150",img:"mat_alloy"}];
const gwCoinLeft=()=>GW_CMAX-(S.gwCoin&&S.gwCoin.d===today()?S.gwCoin.n:0),gwCoinUse=()=>{if(!S.gwCoin||S.gwCoin.d!==today())S.gwCoin={d:today(),n:0};S.gwCoin.n++;save();};`);
patch(`gearSpin(opt){opt=opt||{};wheelSegs=GWHEEL;`, `gearSpin(opt){opt=opt||{};const WH=opt.coin?GWHEEL_C:GWHEEL;wheelSegs=WH;`);
patch(`const s=GWHEEL[k];`, `const s=WH[k];`);
patch(`const p=pop("Legendary Spin",`, `const p=pop(opt.coin?L("Coin Spin","Vòng quay vàng"):"Legendary Spin",`);
patch(`let busy=false;wheelLoop(p.querySelector("#wheel"));`, `if(opt.coin){p.querySelector(".gwhead").innerHTML=L(\`<b>\${gwCoinLeft()}</b>/\${GW_CMAX} coin spins left today\`,\`Còn <b>\${gwCoinLeft()}</b>/\${GW_CMAX} lượt quay vàng hôm nay\`);p.querySelector(".spinbtns").hidden=true;
  p.querySelector(".gwodds").textContent=L("Rare gear 36% · Alloy 64%","Trang bị Hiếm 36% · Hợp kim 64%");p.querySelector("#hub").innerHTML=\`<i class="ic-coin"></i>6K\`;}
  let busy=false;wheelLoop(p.querySelector("#wheel"));`);
patch(`spinWheel(best.k,()=>{refresh();`, `(opt.n?(k,f)=>f():spinWheel)(best.k,()=>{refresh();`); // direct spins from the Shop skip the wheel and show the result
patch(`q.querySelector("#ok2").onclick=()=>{closePop();if(cur==="hangar")renderHangar();};`, `q.querySelector("#ok2").onclick=()=>{closePop();if(cur==="hangar")renderHangar();if(cur==="shop")renderShop();};`);
patch(`const skIc=(sk,cls="")=>`, `const skIc=(sk,cls="")=>typeof SK_ART!=="undefined"&&SK_ART[sk.id]?\`<img class="vi \${cls}" src="\${SK_ART[sk.id]}" alt="">\`:`);
patch(`<button class="nav" data-go="hangar" data-htab="gear"><span class="ico" data-i5="gear"></span>Gear</button>`, `<button class="nav" data-go="settings"><span class="ico" data-i5="navset"></span>Settings</button>`);
patch(`const TABS=["shop","hangar","home","missions"];`, `const TABS=["shop","hangar","home","missions","settings"];`);
patch(`if(on&&g==="hangar")on=n.dataset.htab==="gear"?htab==="gear":htab!=="gear";`, ``);
patch(`<button class="h6t" data-go="settings"><span data-i5="settings"></span><small>Settings</small></button>`, ``); // Settings now lives in the bottom nav
patch(`<div>\${vIcon("sk_crit","",false)}<b class="num">\${fmt(B.score)}</b>`, `<div>\${vIcon("st_score","",false)}<b class="num">\${fmt(B.score)}</b>`);
patch(`<div>\${vIcon("sk_crit","",false)}<b class="num">\${fmt(b.score)}</b>`, `<div>\${vIcon("st_score","",false)}<b class="num">\${fmt(b.score)}</b>`);
patch(`<div>\${vIcon("sk_damage","",false)}<b class="num">\${fmt(b.kills)}</b>`, `<div>\${vIcon("st_kills","",false)}<b class="num">\${fmt(b.kills)}</b>`);
patch(`<button class="lpb" id="bPow">\${vIcon("power","",false)}`, `<button class="lpb" id="bPow">\${vIcon("bst_skills","",false)}`);
patch(`if(SPR_HAS("bg_home"))$("#load .ldbg").style.backgroundImage=\`url(\${SPR_SRC.bg_home})\`;`, `{const k=SPR_HAS("splash_keyart")?"splash_keyart":"bg_home";if(SPR_HAS(k))$("#load .ldbg").style.backgroundImage=\`url(\${SPR_SRC[k]})\`;}`);
patch(`<div class="logo" id="ldLogoTxt">NOVA<br>VANGUARD<span>SKY DEFENSE</span></div>`, `<div class="logo" id="ldLogoTxt">NOVA<br>VALKYRIE<span>SKY ANGELS</span></div>`);
patch(`<img id="ldLogo" alt="Nova Vanguard">`, `<img id="ldLogo" alt="Nova Valkyrie">`);
patch(`$(".h6id").textContent="ID: "+pid();`, `$(".h6id").textContent="ID: "+pid();{const q=$("#tabbar [data-go=missions]"),d=$("#dQuest");if(q&&d)q.appendChild(d);}`);
patch(`vImg(s.c?"coin":s.g?"gem":s.e?"energy":"bomb")`, `vImg(s.c?"cur_coin":s.g?"cur_gem":s.e?"cur_energy":"cur_bomb")`);

// tutorial / unlock plan (docs/TUTORIAL_UNLOCK_PLAN.md): easy 1-1..1-3
patch(`waves:cfg.mode==="stage"?Math.min(12,4+Math.floor(cfg.idx/3))`, `waves:cfg.mode==="stage"?(cfg.diff==="normal"&&cfg.idx===0?3:Math.min(12,4+Math.floor(cfg.idx/3)))`);
patch(`n=c.mode==="event"?14:7+Math.min(6,B.wave);`, `n=c.mode==="event"?14:7+Math.min(6,B.wave)-(B.ez?B.ez.less:0);`);
patch(`const ty=()=>types[Math.floor(Math.random()*Math.min(types.length,1+B.wave))];`, `const ty=()=>types[Math.floor(Math.random()*Math.min(types.length,1+B.wave,B.ez&&B.ez.only?B.ez.only:99))];`);
patch(`if(c.mode==="stage"&&((!isBoss(c.idx)&&B.wave===mw)`, `if(c.mode==="stage"&&!B.ez&&((!isBoss(c.idx)&&B.wave===mw)`);
patch(`e.fire=rnd(2,4.5)/Math.sqrt(B.mul);`, `e.fire=rnd(2,4.5)/Math.sqrt(B.mul)/(B.ez?B.ez.fire:1);`);
patch(`sp=150+30*B.mul;`, `sp=(150+30*B.mul)*(B.ez?B.ez.bs:1);`);
patch(`p.querySelector("#go").onclick=()=>{if(S.energy<ENERGY_COST)return POPS.energy();S.energy-=ENERGY_COST;if(S.energy<S.maxEnergy`, `p.querySelector("#go").onclick=()=>{const _fe=i<3&&diff==="normal";if(!_fe&&S.energy<ENERGY_COST)return POPS.energy();if(!_fe)S.energy-=ENERGY_COST;if(S.energy<S.maxEnergy`);
// no "Escort Drones" card before drones unlock (their shots are gated with the drones)
patch('let pool=RUNSK.filter(s=>rs(s.id)<s.max&&(rs(s.id)>0||owned<MAX_SLOTS));', 'let pool=RUNSK.filter(s=>rs(s.id)<s.max&&(rs(s.id)>0||owned<MAX_SLOTS)&&!(s.id==="drone"&&!vkOpen("drones")));');
// bullet FX hooks: styled draw per pilot, and an impact burst when a bullet is used up on a hit
patch('if(b.rocket){drawMissile(c,b,a);continue;}', 'if(b.rocket){drawMissile(c,b,a);continue;}if(vkBulletFx(c,b))continue;');
patch('B.pb=B.pb.filter(b=>!b.dead);', 'for(const b of B.pb)if(b.dead&&b.y>-20&&b.x>-20&&b.x<W+20)vkBulletHit(b);B.pb=B.pb.filter(b=>!b.dead);');
// gear fire hooks (G4, helpers in the "Gear fire" block of js): cannon fire rate, burn tick, on-hit traits, ion safe time, jet drag speed
patch('p.fireT=1/(B.ship.rate*', 'p.fireT=1/(B.ship.rate*gfRate()*');
patch('for(const b of B.pb){if(b.homing){', 'gfTick(dt);for(const b of B.pb){if(b.homing){');
patch('B._crit=b.crit;hitEnemy(e,b.dmg);B._crit=0;spark(b);', 'B._crit=b.crit;hitEnemy(e,b.dmg);B._crit=0;if(b.gt)gfHit(b,e);spark(b);');
patch('B._crit=b.crit;hitBoss(b.dmg);B._crit=0;spark(b);', 'B._crit=b.crit;hitBoss(b.dmg);B._crit=0;if(b.gt)gfHit(b,bs);spark(b);');
patch('p.inv=skVal("armor").inv;', 'p.inv=skVal("armor").inv+gfInv();');
patch('(e.clientX-drag.x)*S.set.sens', '(e.clientX-drag.x)*S.set.sens*gfMove()');
patch('(e.clientY-drag.y)*S.set.sens', '(e.clientY-drag.y)*S.set.sens*gfMove()');
// no recoil jitter on every shot: keep the ship still and drop the old generic muzzle (typed muzzle flash is drawn by the ship FX)
patch('drawShip(c,B.ship,p.x,p.y+(B.mf>0?2:0),26,B.t,S.ships[S.ship].star);if(B.mf>0)muzzle(c,p.x,p.y-30,B.ship.col);', 'drawShip(c,B.ship,p.x,p.y,26,B.t,S.ships[S.ship].star);');
// first three normal stages are free: say so on the button, and Restart from pause is free too
patch('START <span style="font-size:14px">· ⚡${ENERGY_COST}</span>', 'START <span style="font-size:14px">· ${i<3&&diff==="normal"?L("FREE","MIỄN PHÍ"):"⚡"+ENERGY_COST}</span>');
patch('id="pRe">Restart <small>⚡${ENERGY_COST}</small>', 'id="pRe">Restart <small>⚡${B.cfg.mode==="stage"&&B.cfg.idx<3&&B.cfg.diff==="normal"?0:ENERGY_COST}</small>');
patch('p.querySelector("#pRe").onclick=()=>{if(S.energy<ENERGY_COST)return POPS.energy();S.energy-=ENERGY_COST;', 'p.querySelector("#pRe").onclick=()=>{const _fe=B.cfg.mode==="stage"&&B.cfg.idx<3&&B.cfg.diff==="normal";if(!_fe&&S.energy<ENERGY_COST)return POPS.energy();if(!_fe)S.energy-=ENERGY_COST;');
patch(`const total=b.coins+base;`, `const total=Math.round((b.coins+base)*(b.ez?b.ez.rew:1));`);
patch(`if(S.stats.played>0&&!S.ships.seraph)q.push(()=>POPS.offer());`, `if(S.stats.played>0&&vkOpen("offer")&&!S.ships.seraph)q.push(()=>POPS.offer());`);
// mock: skip the launch popups so the Home is visible


const js = `
/* pet idle animation: 6 Codex-drawn frames per pet (pet_<id>_0..5), ~9 fps, faster while the pet is moving */
const PET_MIX={};
// cross-fade between neighbouring frames (4 in-betweens per step, cached) so 6 drawn frames read as a smooth loop
function petFrame(id,t,vx){const f0=spr("pet_"+id+"_0");if(!f0)return null;const p=t*(7+Math.min(5,Math.abs(vx||0)/70)),i=Math.floor(p)%6,q=Math.floor((p%1)*4)/4;
  if(q===0)return spr("pet_"+id+"_"+i)||f0;const k=id+i+"_"+q;if(PET_MIX[k])return PET_MIX[k];
  const A=spr("pet_"+id+"_"+i),Bm=spr("pet_"+id+"_"+((i+1)%6));if(!A||!Bm)return A||f0;
  const cv=document.createElement("canvas");cv.width=cv.naturalWidth=A.naturalWidth;cv.height=cv.naturalHeight=A.naturalHeight;cv.complete=true;const c=cv.getContext("2d");
  c.globalAlpha=1-q;c.drawImage(A,0,0);c.globalAlpha=q;c.drawImage(Bm,0,0,cv.width,cv.height);return PET_MIX[k]=cv;}
/* Modular ship composer: hull + mount-centred parts placed on the hull's own mount points (SHIP_MOUNTS, 1024 grid).
   Draw order engines(tail) -> armour(wings, x wingScale) -> hull -> wing guns -> nose gun -> core(spine). Parts are drawn
   for the right side; the left side is mirrored. Rarity: Rare blue line glow, Epic purple rim, Legendary orange rim + sparkle.
   Also gIconURL(it): the item's part on a rarity diamond plate (gear UI icons). */
const MOD_RCOL=["","#38a8ff","#b36bff","#ffb02e"];
const MP_IMG={};let mpReady=false;
{const ks=Object.keys(SPR_SRC).filter(k=>k.startsWith("mp_")||k.startsWith("mod_hull_"));
 Promise.all(ks.map(k=>{const im=new Image();im.src=SPR_SRC[k];MP_IMG[k]=im;return im.decode().catch(()=>{});})).then(()=>{mpReady=true;
   if(typeof cur!=="undefined"&&cur==="hangar"&&typeof renderHangar==="function")renderHangar();});}
const mpOk=k=>mpReady&&MP_IMG[k]&&MP_IMG[k].naturalWidth>0;
let modKey="";
function modHas(ship){return typeof SHIP_MOUNTS!=="undefined"&&!!SHIP_MOUNTS[ship]&&SPR_HAS("mod_hull_"+ship);}
/* part list for a ship: {k, x, y (1024 grid), s (scale), m (mirror), rar} */
function modParts(ship){const M=SHIP_MOUNTS[ship],ws=M.wingScale||1,out=[];
  const add=(k,pt,s,m,rar)=>{if(mpOk(k))out.push({k:k,x:pt[0],y:pt[1],s:s,m:m,rar:rar});};
  const en=gEq("engine"),pl=gEq("plating"),ca=gEq("cannon"),co=gEq("core");
  if(en){add("mp_engine_"+en.set,M.tailL,1,1,en.rar);add("mp_engine_"+en.set,M.tailR,1,0,en.rar);}
  if(pl){const a="mp_armor_"+pl.set+"_"+(ws<0.8?"narrow":"wide");add(a,M.wingL,ws,1,pl.rar);add(a,M.wingR,ws,0,pl.rar);}
  out.push({k:"mod_hull_"+ship,hull:1});
  if(ca){const t=gType(ca)||"laser";add("mp_gun_wing_"+t,M.wingL,ws,1,ca.rar);add("mp_gun_wing_"+t,M.wingR,ws,0,ca.rar);add("mp_gun_nose_"+t,M.nose,1,0,ca.rar);}
  if(co)add("mp_core_"+co.set,M.spine,1,0,co.rar);
  return out;}
function modSparkle(c,x,y,r,col){c.save();c.globalCompositeOperation="lighter";c.fillStyle=col;c.beginPath();
  for(let i=0;i<8;i++){const a=i*Math.PI/4,d=i%2?r*0.28:r;c.lineTo(x+Math.cos(a)*d,y+Math.sin(a)*d);}c.closePath();c.fill();
  c.fillStyle="#fff";c.beginPath();c.arc(x,y,r*0.22,0,7);c.fill();c.restore();}
/* one part image with its rarity effect; (x,y) centre, w size, in the target context's units */
function modDrawPart(c,im,x,y,w,m,rar){const draw=()=>{c.save();c.translate(x,y);if(m)c.scale(-1,1);c.drawImage(im,-w/2,-w/2,w,w);c.restore();};
  if(rar>=1){c.save();c.shadowColor=MOD_RCOL[rar];c.shadowBlur=(rar>=3?14:rar>=2?11:6)*w/128;draw();if(rar>=2)draw();c.restore();}
  draw();}
function modBuild(force){const ship=S.ship;if(!modHas(ship)||!mpReady||!MP_IMG["mod_hull_"+ship])return;
  const parts=modParts(ship),key=ship+"|"+parts.map(p=>p.k+(p.m?"L":"")+(p.rar||0)).join(",");if(key===modKey&&!force)return;
  const N=1024,u=N/1024,cv=document.createElement("canvas");cv.width=cv.height=N;const c=cv.getContext("2d");
  const spark=[];
  parts.forEach(p=>{const im=MP_IMG[p.k];if(p.hull){c.drawImage(im,0,0,N,N);return;}
    const w=256*p.s*u;modDrawPart(c,im,p.x*u,p.y*u,w,p.m,p.rar||0);if(p.rar>=3)spark.push([p.x*u+(p.m?-1:1)*w*0.18,p.y*u-w*0.18,w]);});
  spark.forEach(([x,y,w])=>modSparkle(c,x,y,Math.max(5,w*0.09),"#ffd58a"));
  const url=cv.toDataURL("image/png"),k="ship_"+ship,im=new Image();modKey=key;
  im.onload=()=>{IMG[k]=im;SPR_SRC[k]=url;if(cur==="hangar"&&typeof renderHangar==="function")renderHangar();};im.src=url;}
setInterval(()=>{if(cur!=="battle")modBuild();},400);
{const _sbm=startBattle;startBattle=function(cfg){modBuild();_sbm(cfg);};}
/* Ship FX (battle, code-only): engine flames at tailL/R, muzzle flash at nose/wings, core pulse at spine, rarity aura + set ring.
   Everything is drawn from sprites pre-rendered once per colour (SFX_C cache); particles capped. SHIPFX=0 turns it off (FPS tests).
   Mount points are 1024-grid coords on the composed ship, which blit() draws as a square of side s*2.3 centred on (x,y). */
var SHIPFX=1;
const SFX_C={},SFX_ECOL={vanguard:"#5ee7ff",aegis:"#52f19a",solar:"#ffc83d"},SFX_ION="#9b8bff",SFX_RIM=["","#38a8ff","#b36bff","#ffb02e"];
const SFX={vx:0,lx:null,ly:0,lt:0,mz:-9,pt:[],em:[]};
function sfxCv(n,m){const cv=document.createElement("canvas");cv.width=n;cv.height=m||n;return cv;}
/* soft round glow, white core -> colour -> clear */
function sfxGlow(col){const k="g"+col;if(SFX_C[k])return SFX_C[k];const cv=sfxCv(64),c=cv.getContext("2d"),g=c.createRadialGradient(32,32,0,32,32,32);
  g.addColorStop(0,"#ffffff");g.addColorStop(.25,col);g.addColorStop(1,col+"00");c.fillStyle=g;c.fillRect(0,0,64,64);return SFX_C[k]=cv;}
/* flame plume: nozzle at top centre, tip at bottom */
function sfxFlame(col){const k="f"+col;if(SFX_C[k])return SFX_C[k];const cv=sfxCv(32,128),c=cv.getContext("2d");c.filter="blur(2px)";
  const g=c.createLinearGradient(0,0,0,128);g.addColorStop(0,"#ffffff");g.addColorStop(.18,col);g.addColorStop(1,col+"00");c.fillStyle=g;
  c.beginPath();c.moveTo(4,6);c.quadraticCurveTo(16,-2,28,6);c.quadraticCurveTo(24,70,16,124);c.quadraticCurveTo(8,70,4,6);c.fill();return SFX_C[k]=cv;}
/* 4-point star glint: thin long white rays (128px, centre 64) */
function sfxStar(){if(SFX_C.st)return SFX_C.st;const cv=sfxCv(128),c=cv.getContext("2d");c.globalCompositeOperation="lighter";
  for(let i=0;i<2;i++){c.save();c.translate(64,64);c.rotate(i*Math.PI/2);const g=c.createLinearGradient(-62,0,62,0);
    g.addColorStop(0,"#fff0");g.addColorStop(.42,"#ffffff88");g.addColorStop(.5,"#fff");g.addColorStop(.58,"#ffffff88");g.addColorStop(1,"#fff0");c.fillStyle=g;
    c.beginPath();c.moveTo(-62,0);c.quadraticCurveTo(0,-5,62,0);c.quadraticCurveTo(0,5,-62,0);c.fill();c.restore();}
  return SFX_C.st=cv;}
/* soft light ray for ULT (64x256, root at bottom centre) */
function sfxRay(col){const k="y"+col;if(SFX_C[k])return SFX_C[k];const cv=sfxCv(64,256),c=cv.getContext("2d");c.filter="blur(5px)";
  const g=c.createLinearGradient(0,256,0,0);g.addColorStop(0,col+"cc");g.addColorStop(.5,col+"55");g.addColorStop(1,col+"00");c.fillStyle=g;
  c.beginPath();c.moveTo(26,250);c.lineTo(38,250);c.lineTo(44,16);c.lineTo(20,16);c.fill();return SFX_C[k]=cv;}
/* thin beat ring (256px, radius 100) with wide padding so the blur never reaches the edge */
function sfxRing(col){const k="r"+col;if(SFX_C[k])return SFX_C[k];const cv=sfxCv(256),c=cv.getContext("2d");
  c.filter="blur(6px)";c.strokeStyle=col;c.lineWidth=6;c.beginPath();c.arc(128,128,100,0,7);c.stroke();
  c.filter="blur(1px)";c.strokeStyle="#ffffff";c.lineWidth=3.5;c.globalAlpha=1;c.stroke();return SFX_C[k]=cv;}
/* magic circle (512px, centre 256): part 0 = outer ring + diamonds, 1 = inner ring + rune ticks, 2 = floor glow */
function sfxMagic(col,part){const k="mc"+part+col;if(SFX_C[k])return SFX_C[k];const cv=sfxCv(512),c=cv.getContext("2d");c.translate(256,256);
  if(part===2){const g=c.createRadialGradient(0,0,0,0,0,240);g.addColorStop(0,col+"88");g.addColorStop(.55,col+"33");g.addColorStop(1,col+"00");c.fillStyle=g;c.beginPath();c.arc(0,0,240,0,7);c.fill();return SFX_C[k]=cv;}
  const R=part?160:212;const ink=(w,a,bl)=>{c.filter="blur("+bl+"px)";c.globalAlpha=a;c.strokeStyle=col;c.fillStyle=col;c.lineWidth=w;
    c.beginPath();c.arc(0,0,R,0,7);c.stroke();if(!part){c.beginPath();c.arc(0,0,R-14,0,7);c.lineWidth=w*.5;c.stroke();}
    const n=part?24:8;for(let i=0;i<n;i++){c.save();c.rotate(i*Math.PI*2/n);
      if(!part){c.beginPath();c.moveTo(0,-R-11);c.lineTo(7,-R);c.lineTo(0,-R+11);c.lineTo(-7,-R);c.closePath();c.fill();}
      else if(i%3===0){c.beginPath();c.moveTo(-3,-R+4);c.lineTo(0,-R+16);c.lineTo(3,-R+4);c.fill();}
      else{c.fillRect(-w*.4,-R-7,w*.8,i%3===1?10:6);}c.restore();}};
  ink(10,.45,8);ink(3,1,.8);c.filter="none";c.globalAlpha=.9;c.strokeStyle="#ffffff";c.lineWidth=1;c.beginPath();c.arc(0,0,R,0,7);c.stroke();return SFX_C[k]=cv;}
/* muzzle flash per cannon type */
function sfxMuzzle(t){const k="m"+t;if(SFX_C[k])return SFX_C[k];const cv=sfxCv(64),c=cv.getContext("2d"),C=32;
  const col={mg:"#ffe066",laser:"#5ee7ff",missile:"#aab2c2",plasma:"#b36bff",solar:"#ffc83d",frost:"#bfeaff"}[t]||"#ffffff";
  if(t==="laser"){c.filter="blur(1px)";c.strokeStyle=col;c.lineWidth=5;c.beginPath();c.arc(C,C,18,0,7);c.stroke();c.drawImage(sfxGlow(col),16,16,32,32);}
  else if(t==="missile"){c.filter="blur(3px)";[[0,4,14],[-9,10,10],[9,10,10],[0,-4,9]].forEach(([dx,dy,r])=>{c.fillStyle=col+"cc";c.beginPath();c.arc(C+dx,C+dy,r,0,7);c.fill();});}
  else if(t==="frost"){c.fillStyle=col;for(let i=0;i<6;i++){const a=i*Math.PI/3-Math.PI/2;c.beginPath();c.moveTo(C+Math.cos(a)*27,C+Math.sin(a)*27);
      c.lineTo(C+Math.cos(a+.35)*8,C+Math.sin(a+.35)*8);c.lineTo(C+Math.cos(a-.35)*8,C+Math.sin(a-.35)*8);c.fill();}c.drawImage(sfxGlow("#ffffff"),20,20,24,24);}
  else if(t==="solar"){c.drawImage(sfxGlow(col),0,0,64,64);c.fillStyle="#fff6c8";c.beginPath();for(let i=0;i<16;i++){const a=i*Math.PI/8,d=i%2?6:30;c.lineTo(C+Math.cos(a)*d,C+Math.sin(a)*d);}c.fill();}
  else if(t==="plasma"){c.drawImage(sfxGlow(col),0,0,64,64);c.drawImage(sfxGlow("#f3dcff"),16,16,32,32);}
  else{c.fillStyle=col;c.beginPath();for(let i=0;i<10;i++){const a=i*Math.PI/5-Math.PI/2,d=i%2?6:20;c.lineTo(C+Math.cos(a)*d,C+Math.sin(a)*d);}c.fill();c.drawImage(sfxGlow("#fff2a8"),20,20,24,24);}
  return SFX_C[k]=cv;}
/* rarity aura: energy outline hugging the composed ship. Hard alpha mask -> dilated -> two blurred layers (wide faint + narrow bright).
   Shimmer = 16 pre-rendered frames of the narrow outline lit by a sweeping band. Cached per image + colour; canvases padded so no box edges. */
const SFX_RIMC=new WeakMap(),SFX_AN=192,SFX_AP=40,SFX_SHN=16;
function sfxAura(im,col){let m=SFX_RIMC.get(im);if(!m)SFX_RIMC.set(im,m={});if(m[col])return m[col];
  const n=SFX_AN,p=SFX_AP,N=n+2*p,a=sfxCv(n),ac=a.getContext("2d");ac.drawImage(im,0,0,n,n);
  {const d=ac.getImageData(0,0,n,n),q=d.data;for(let i=3;i<q.length;i+=4)q[i]=q[i]<60?0:255;ac.putImageData(d,0,0);}   // hard mask: faint specks made a visible box
  ac.globalCompositeOperation="source-in";ac.fillStyle=col;ac.fillRect(0,0,n,n);
  const dil=(r,bl,a2)=>{const cv=sfxCv(N),c=cv.getContext("2d");for(let i=0;i<12;i++){const an=i*Math.PI/6;c.drawImage(a,p+Math.cos(an)*r,p+Math.sin(an)*r);}c.drawImage(a,p,p);
    const o=sfxCv(N),oc=o.getContext("2d");oc.filter="blur("+bl+"px)";oc.globalAlpha=a2;oc.drawImage(cv,0,0);return o;};
  const wide=dil(5,11,.9),nar=dil(2,2.2,1);
  {const w=sfxCv(N),wc=w.getContext("2d");wc.drawImage(nar,0,0);wc.globalCompositeOperation="source-in";wc.fillStyle="#ffffff";wc.fillRect(0,0,N,N);
   const nc=nar.getContext("2d");nc.globalCompositeOperation="lighter";nc.globalAlpha=.35;nc.drawImage(w,0,0);}
  const bg=a.getContext("2d").createLinearGradient(0,0,N,0);
  bg.addColorStop(0,"#fff0");bg.addColorStop(.42,"#fff0");bg.addColorStop(.5,"#fff");bg.addColorStop(.58,"#fff0");bg.addColorStop(1,"#fff0");
  const sh=[];for(let f=0;f<SFX_SHN;f++){const cv=sfxCv(N),c=cv.getContext("2d");c.drawImage(nar,0,0);c.globalCompositeOperation="source-in";
    const off=(f/(SFX_SHN-1)*2-1)*N*.75;c.save();c.translate(N/2,N/2);c.rotate(-.6);c.translate(-N/2+off,-N/2);c.fillStyle=bg;c.fillRect(-N,-N,N*3,N*3);c.restore();sh.push(cv);}
  return m[col]={wide,nar,sh};}
function sfxAdd(o){if(SFX.pt.length<40)SFX.pt.push(o);}
{const _ds=drawShip,_fl=flame;let noFlame=false;
flame=function(c,col,x,y,s,t){if(!noFlame)_fl(c,col,x,y,s,t);};
drawShip=function(c,def,x,y,s,t=0,star=1){
  const im=spr("ship_"+def.id),M=typeof SHIP_MOUNTS!=="undefined"&&SHIP_MOUNTS[def.id];
  if(!SHIPFX||!im||!M||typeof B==="undefined"||!B||def!==B.ship||cur!=="battle")return _ds(c,def,x,y,s,t,star);
  const W=s*2.3,P=pt=>[x+(pt[0]/1024-.5)*W,y+(pt[1]/1024-.5)*W];
  const en=gEq("engine"),ca=gEq("cannon"),co=gEq("core"),eq=gearEquipped();
  // speed from player movement delta (smoothed, 0..1)
  const dt=t-SFX.lt;if(SFX.lx!=null&&dt>0&&dt<.2){const v=Math.hypot(x-SFX.lx,y-SFX.ly)/dt;SFX.vx+=(Math.min(1,v/420)-SFX.vx)*Math.min(1,dt*10);}
  SFX.lx=x;SFX.ly=y;SFX.lt=t;
  c.save();c.globalCompositeOperation="lighter";
  // full 4/4 set: soft ring
  const sets=gearSets(),full=Object.keys(sets).find(k=>sets[k]>=4);
  if(full){const col=GSETS[full].col,R=s*1.5,bt=.5+.5*Math.sin(t*2.4);
    c.globalAlpha=.55+.15*bt;c.drawImage(sfxMagic(col,2),x-R,y-R,R*2,R*2);
    [[0,.35],[1,-.55]].forEach(([pp,sp])=>{c.save();c.translate(x,y);c.rotate(t*sp);c.globalAlpha=pp?.8:.75;c.drawImage(sfxMagic(col,pp),-R,-R,R*2,R*2);c.restore();});
    const g=sfxGlow(col),st=sfxStar();for(let i=0;i<6;i++){const an=t*.9+i*Math.PI/3,ox=x+Math.cos(an)*R*.74,oy=y+Math.sin(an)*R*.74,tw=.6+.4*Math.sin(t*5+i*1.7),r=s*.13*tw;
      c.globalAlpha=.85*tw;c.drawImage(g,ox-r,oy-r,r*2,r*2);c.drawImage(st,ox-r*1.3,oy-r*1.3,r*2.6,r*2.6);}
    c.globalAlpha=1;}
  // rarity rim under the ship
  const rar=eq.reduce((m,i)=>Math.max(m,i.rar||0),0);
  if(rar>=1){const A=sfxAura(im,SFX_RIM[rar]),f=W/SFX_AN,o=SFX_AP*f,Z=A.wide.width*f,pu=.5+.5*Math.sin(t*3),X=x-W/2-o,Y=y-W/2-o;
    c.globalAlpha=(rar>=3?.4:.3)+.05*pu;c.drawImage(A.wide,X,Y,Z,Z);
    c.globalAlpha=.55+.15*pu;c.drawImage(A.nar,X,Y,Z,Z);
    const ph=(t%2)/2*1.4;if(ph<1){c.globalAlpha=.6*Math.sin(ph*Math.PI);c.drawImage(A.sh[Math.min(SFX_SHN-1,ph*SFX_SHN|0)],X,Y,Z,Z);}
    c.globalAlpha=1;}
  // engine flames
  if(en){const ion=gType(en)==="ion",col=ion?SFX_ION:SFX_ECOL[en.set]||"#5ee7ff",fs=sfxFlame(col),g=sfxGlow(col);
    [M.tailL,M.tailR].forEach((pt,i)=>{const [fx,fy0]=P(pt),fy=fy0+W*.07,fl=.85+.15*Math.sin(t*41+i*2)+.1*Math.random();
      const fw=s*(ion?.16:.34),L=s*(ion?.9:.75)*(1+1.1*SFX.vx)*fl;
      c.drawImage(g,fx-fw*1.2,fy-fw*1.2,fw*2.4,fw*2.4);c.drawImage(fs,fx-fw/2,fy,fw,L);
      if(ion&&Math.random()<.35)sfxAdd({x:fx+(Math.random()-.5)*fw,y:fy+L*.4,vx:(Math.random()-.5)*40,vy:60+Math.random()*80,l:.35,m:.35,col:col,r:s*.07});});}
  c.restore();
  noFlame=!!en;try{_ds(c,def,x,y,s,t,star);}finally{noFlame=false;}
  c.save();c.globalCompositeOperation="lighter";
  // core pulse
  if(co){const ful=B.ult>=100,per=ful?.6:1.2,col=(GSETS[co.set]||{}).col||"#9ff0ff",[cx,cy]=P(M.spine),ph=(t%per)/per,b=Math.pow(1-ph,3),
      g=sfxGlow(col),wg=sfxGlow("#ffffff"),R=W*(ful?.22:.16)*(.92+.1*b);
    if(ful){const ry=sfxRay(col),L=W*.45;for(let i=0;i<7;i++){c.save();c.translate(cx,cy);c.rotate(t*.6+i*Math.PI*2/7);c.globalAlpha=.22+.1*Math.sin(t*3+i*2.1);
      c.drawImage(ry,-L*.13,-L,L*.26,L);c.restore();}}
    c.globalAlpha=(ful?.32:.2)+.08*b;c.drawImage(g,cx-R,cy-R,R*2,R*2);
    const hr=s*(ful?.14:.1)*(1+.2*b);c.globalAlpha=ful?.75:.55;c.drawImage(wg,cx-hr,cy-hr,hr*2,hr*2);
    const rr=s*(.2+1.1*ph);c.globalAlpha=(1-ph)*(ful?.5:.35);c.drawImage(sfxRing(col),cx-rr*1.28,cy-rr*1.28,rr*2.56,rr*2.56);
    const sl=W*(ful?.5:.36)*(.9+.1*b);c.save();c.translate(cx,cy);c.rotate(t*(ful?.9:.4));c.globalAlpha=ful?.6:.4;c.drawImage(sfxStar(),-sl/2,-sl/2,sl,sl);
    c.rotate(Math.PI/4);c.globalAlpha=.18;c.drawImage(sfxStar(),-sl*.3,-sl*.3,sl*.6,sl*.6);c.restore();c.globalAlpha=1;}
  // legendary sparkles drifting off the wings
  if(rar>=3&&SFX.em.length<30&&Math.random()<.45){const L=Math.random()<.5,pt=L?M.wingL:M.wingR,[wx,wy]=P(pt||M.spine),sd=L?-1:1;
    SFX.em.push({x:wx+(Math.random()-.5)*s*.3,y:wy,vx:sd*(10+Math.random()*25),vy:-(15+Math.random()*25),ay:90,l:1.1,m:1.1,ph:Math.random()*6,r:s*(.1+Math.random()*.08)});}
  if(SFX.em.length){const pd=Math.max(0,Math.min(.05,dt)),g=sfxGlow("#ffb02e"),st=sfxStar();
    for(let i=SFX.em.length-1;i>=0;i--){const q=SFX.em[i];q.l-=pd;if(q.l<=0||rar<3){SFX.em.splice(i,1);continue;}q.vy+=q.ay*pd;q.x+=q.vx*pd;q.y+=q.vy*pd;
      const k=q.l/q.m,tw=.6+.4*Math.sin(t*14+q.ph),r=q.r*(.6+.6*k);c.globalAlpha=Math.min(1,k*1.6)*tw;c.drawImage(g,q.x-r,q.y-r,r*2,r*2);
      if(tw>.85)c.drawImage(st,q.x-r*1.6,q.y-r*1.6,r*3.2,r*3.2);}c.globalAlpha=1;}
  // muzzle flash (~80 ms) at nose (+ wing guns)
  const ma=t-SFX.mz;if(ca&&ma>=0&&ma<.08){const ms=sfxMuzzle(gType(ca)||"laser"),k=1-ma/.08,a=[[M.nose,s*.9]];if(M.wingL)a.push([M.wingL,s*.55],[M.wingR,s*.55]);
    if(gType(ca)==="missile")c.globalCompositeOperation="source-over";
    a.forEach(([pt,z])=>{const [mx,my0]=P(pt),my=my0-W*.08,r=z*(.7+.5*(1-k));c.globalAlpha=k;c.drawImage(ms,mx-r/2,my-r/2,r,r);});c.globalAlpha=1;c.globalCompositeOperation="lighter";}
  // particles
  const pdt=Math.max(0,Math.min(.05,dt));
  for(let i=SFX.pt.length-1;i>=0;i--){const q=SFX.pt[i];q.l-=pdt;if(q.l<=0){SFX.pt.splice(i,1);continue;}q.x+=q.vx*pdt;q.y+=q.vy*pdt;
    const r=q.r*(.5+q.l/q.m);c.globalAlpha=q.l/q.m;c.drawImage(sfxGlow(q.col),q.x-r,q.y-r,r*2,r*2);}
  c.restore();};
const _fi=fire;fire=function(){_fi.apply(this,arguments);if(typeof B!=="undefined"&&B)SFX.mz=B.t;};}
/* hangar: brief flash on the part that changed when the composed ship is rebuilt */
{const _mb=modBuild;let prev=null,prevShip=null;
modBuild=function(force){const ship=S.ship;if(!modHas(ship)||!mpReady)return _mb(force);
  const parts=modParts(ship).filter(p=>!p.hull),keys=parts.map(p=>p.k+"|"+p.x+"|"+(p.rar||0)),old=prev;
  const hit=old&&prevShip===ship?parts.filter((p,i)=>!old.includes(keys[i])):[];prev=keys;prevShip=ship;
  _mb(force);if(!hit.length||cur!=="hangar")return;
  setTimeout(()=>document.querySelectorAll(".gship img,img.hv-ship,.hv-form img").forEach(img=>{if(!img.offsetWidth)return;const par=img.parentElement;
    if(getComputedStyle(par).position==="static")par.style.position="relative";
    hit.forEach(p=>{const d=document.createElement("i"),w=img.offsetWidth*.32*(p.s||1),cx=img.offsetLeft+img.offsetWidth*p.x/1024,cy=img.offsetTop+img.offsetHeight*p.y/1024;
      d.style.cssText="position:absolute;pointer-events:none;z-index:3;border-radius:50%;mix-blend-mode:screen;width:"+w+"px;height:"+w+"px;left:"+(cx-w/2)+"px;top:"+(cy-w/2)+"px;background:radial-gradient(circle,#fff 0,#fff8 25%,"+(MOD_RCOL[p.rar]||"#9ff0ff")+"88 50%,transparent 70%)";
      par.appendChild(d);const an=d.animate([{opacity:0,transform:"scale(.4)"},{opacity:1,transform:"scale(1.1)",offset:.25},{opacity:0,transform:"scale(1.4)"}],{duration:650,easing:"ease-out"});
      an.onfinish=()=>d.remove();});}),160);};}
/* gear icon: part centred (by its visible bounds) on a diamond plate with rarity border, set badge, cannon type glyph */
const GICON={},MP_BOX={};
function mpBox(k){if(MP_BOX[k])return MP_BOX[k];const im=MP_IMG[k],n=256,cv=document.createElement("canvas");cv.width=cv.height=n;const c=cv.getContext("2d");
  c.drawImage(im,0,0,n,n);const d=c.getImageData(0,0,n,n).data;let x0=n,y0=n,x1=-1,y1=-1;
  for(let y=0;y<n;y++)for(let x=0;x<n;x++)if(d[(y*n+x)*4+3]>24){if(x<x0)x0=x;if(x>x1)x1=x;if(y<y0)y0=y;if(y>y1)y1=y;}
  return MP_BOX[k]=x1<0?[0,0,n,n]:[x0,y0,x1-x0+1,y1-y0+1];}
const GGLYPH={mg:"≡",laser:"│",missile:"➤",plasma:"●",solar:"☀",frost:"❄"};
function gIconURL(it){if(!it||!mpReady)return null;const t=it.slot==="cannon"?(gType(it)||"laser"):null;
  const k=it.slot==="cannon"?"mp_gun_nose_"+t:it.slot==="engine"?"mp_engine_"+it.set:it.slot==="plating"?"mp_armor_"+it.set+"_wide":"mp_core_"+it.set;
  if(!mpOk(k))return null;const ck=k+"|"+it.set+"|"+it.rar;if(GICON[ck])return GICON[ck];
  const N=160,cv=document.createElement("canvas");cv.width=cv.height=N*2;const c=cv.getContext("2d"),rc=GRCOL[it.rar]||"#9fb0d0",sc=(GSETS[it.set]||{}).col||"#9ff0ff";
  c.scale(2,2);   // drawn in 160-unit coords at 2x pixels for sharp icons on high-DPI phones
  const dia=r=>{c.beginPath();c.moveTo(N/2,N/2-r);c.lineTo(N/2+r,N/2);c.lineTo(N/2,N/2+r);c.lineTo(N/2-r,N/2);c.closePath();};
  c.save();dia(74);const g=c.createLinearGradient(0,0,0,N);g.addColorStop(0,"#1b2f6e");g.addColorStop(1,"#0a1438");c.fillStyle=g;c.shadowColor=rc;c.shadowBlur=it.rar>=2?14:6;c.fill();c.restore();
  dia(74);c.lineWidth=4;c.strokeStyle=rc;c.stroke();dia(64);c.lineWidth=1.5;c.strokeStyle=rc+"88";c.stroke();
  const b=mpBox(k),f=Math.min(118/b[2],118/b[3]),w=b[2]*f,h=b[3]*f;
  c.save();if(it.rar>=1){c.shadowColor=rc;c.shadowBlur=it.rar>=3?16:it.rar>=2?12:6;}
  c.drawImage(MP_IMG[k],b[0],b[1],b[2],b[3],(N-w)/2,(N-h)/2,w,h);c.restore();
  if(it.rar>=3)modSparkle(c,N*0.7,N*0.3,9,"#ffd58a");
  c.beginPath();c.arc(26,26,15,0,7);c.fillStyle="#0a1438";c.fill();c.lineWidth=3;c.strokeStyle=sc;c.stroke();
  c.fillStyle=sc;c.font="900 16px sans-serif";c.textAlign="center";c.textBaseline="middle";c.fillText((it.set||"?")[0].toUpperCase(),26,27);
  if(t){c.beginPath();c.arc(N-26,N-26,15,0,7);c.fillStyle="#0a1438";c.fill();c.lineWidth=3;c.strokeStyle=rc;c.stroke();
    c.fillStyle="#fff";c.font="900 17px sans-serif";c.fillText(GGLYPH[t]||"•",N-26,N-25);}
  return GICON[ck]=cv.toDataURL("image/png");}
/* Bullet FX: every Valkyrie fires her own projectile style (core + glow + tapered trail + sparks + impact).
   Mockup only: a "ĐẠN" chip in battle cycles all 9 styles on any pilot (hidden in the app build). */
const BFX=[
 {n:["Violet Plasma","Plasma Tím"],col:"#c77dff",hot:"#f3dcff",tl:12,tw:7},
 {n:["Star Piercer","Sao Xuyên"],col:"#5ee7ff",hot:"#ffffff",tl:10,tw:3.5},
 {n:["Solar Cannon","Pháo Mặt Trời"],col:"#ff8a2a",hot:"#fff1b0",tl:10,tw:8},
 {n:["Laser Lance","Giáo Laser"],col:"#38e1ff",hot:"#e8fdff",tl:4,tw:3},
 {n:["Green Comet","Sao Chổi Lục"],col:"#52f19a",hot:"#eafff1",tl:12,tw:6},
 {n:["Pink Star","Sao Hồng"],col:"#ff6fae",hot:"#fff0f7",tl:9,tw:5},
 {n:["Frost Shard","Mảnh Băng"],col:"#9fd8ff",hot:"#ffffff",tl:9,tw:5},
 {n:["Red Rocket","Tên Lửa Đỏ"],col:"#ff5164",hot:"#ffe2a8",tl:8,tw:5},
 {n:["Void Orb","Hư Không"],col:"#9b5cff",hot:"#e6d4ff",tl:12,tw:8}];
// pilot weapon -> style (a colour override keeps each pilot's own colour where it differs)
const BFX_SHIP={kestrel:[1],viper:[3,"#52f19a"],halo:[0],seraph:[2],raptor:[2,"#ff9d1c"],tempest:[1,"#5aa8ff"],nebula:[5],oblivion:[8],wing:[6],rs:[4]};
let bfxPick=null;   // mockup override: null = each pilot's own style
const BFX_GLOW={};
function bfxGlow(col){if(BFX_GLOW[col])return BFX_GLOW[col];const cv=document.createElement("canvas");cv.width=cv.height=64;const g=cv.getContext("2d"),r=g.createRadialGradient(32,32,0,32,32,32);
  r.addColorStop(0,col);r.addColorStop(.35,col+"88");r.addColorStop(1,col+"00");g.fillStyle=r;g.fillRect(0,0,64,64);return BFX_GLOW[col]=cv;}
const bfxG=(c,x,y,R,col,a=1)=>{c.globalAlpha=a;c.drawImage(bfxGlow(col),x-R,y-R,R*2,R*2);c.globalAlpha=1;};
function bfxStar(c,x,y,r,n,rot,inner){c.beginPath();for(let k=0;k<n*2;k++){const a=rot+k*Math.PI/n,rr=k%2?r*inner:r;c.lineTo(x+Math.cos(a)*rr,y+Math.sin(a)*rr);}c.closePath();}
function bfxTrail(c,h,w,col,alpha){const n=h.length;if(n<2)return;const L=[],R=[];
  for(let k=0;k<n;k++){const a=h[Math.max(0,k-1)],b=h[Math.min(n-1,k+1)],dx=b[0]-a[0],dy=b[1]-a[1],d=Math.hypot(dx,dy)||1,hw=Math.max(.3,w*(k/(n-1))*.5);
    L.push(h[k][0]-dy/d*hw,h[k][1]+dx/d*hw);R.push(h[k][0]+dy/d*hw,h[k][1]-dx/d*hw);}
  const g=c.createLinearGradient(h[0][0],h[0][1],h[n-1][0],h[n-1][1]);g.addColorStop(0,col+"00");g.addColorStop(1,col);
  c.globalAlpha=alpha;c.fillStyle=g;c.beginPath();c.moveTo(L[0],L[1]);for(let k=2;k<L.length;k+=2)c.lineTo(L[k],L[k+1]);for(let k=R.length-2;k>=0;k-=2)c.lineTo(R[k],R[k+1]);c.closePath();c.fill();c.globalAlpha=1;}
// style: mockup chip pick > equipped cannon type (b.gt, set in fire) > pilot default
function bfxStyle(b){if(b.wave||b.rocket||b.kind==="beam")return null;const m=bfxPick!=null&&b.kind===S.ship?[bfxPick]:b.gt&&GTYPE_FIRE[b.gt]&&GTYPE_FIRE[b.gt].fx||BFX_SHIP[b.kind];if(!m)return null;
  const st=BFX[m[0]];return {i:m[0],col:m[1]||st.col,hot:st.hot,tl:st.tl,tw:st.tw};}
function vkBulletFx(c,b){const s=bfxStyle(b);if(!s)return false;const h=b.fh||(b.fh=[]);h.push([b.x,b.y]);if(h.length>s.tl)h.shift();
  const x=b.x,y=b.y,ang=Math.atan2(b.vy,b.vx),bx=-Math.cos(ang),by=-Math.sin(ang),t=B.t+(b.ph??(b.ph=Math.random()*6)),col=s.col,hot=s.hot,sc=(b.crit?1.25:1)*(b.gs||1);
  c.globalCompositeOperation="lighter";
  switch(s.i){
   case 0:bfxTrail(c,h,s.tw*2*sc,col,.45);bfxTrail(c,h,s.tw*.45,hot,.9);bfxG(c,x,y,22*sc,col);c.save();c.translate(x,y);c.rotate(t*3);c.strokeStyle=col;c.lineWidth=1.4;c.beginPath();c.arc(0,0,9*sc,0,7);c.stroke();
     for(let k=0;k<6;k++){c.rotate(Math.PI/3);c.fillStyle=hot;c.beginPath();c.moveTo(10*sc,0);c.lineTo(14*sc,-2.2);c.lineTo(14*sc,2.2);c.closePath();c.fill();}c.restore();bfxG(c,x,y,7,"#ffffff");break;
   case 1:bfxTrail(c,h,s.tw*2*sc,col,.55);bfxTrail(c,h,1.3,"#ffffff",1);bfxG(c,x,y,18*sc,col);c.fillStyle="#fff";bfxStar(c,x,y,8*sc,4,t*6,.24);c.fill();
     if(Math.random()<.25){c.strokeStyle=col;c.lineWidth=1;c.beginPath();let px=x,py=y;c.moveTo(px,py);for(let k=0;k<4;k++){px+=bx*10+(Math.random()-.5)*8*by;py+=by*10-(Math.random()-.5)*8*bx;c.lineTo(px,py);}c.stroke();}break;
   case 2:bfxTrail(c,h,s.tw*2.2*sc,"#ff5a1a",.5);bfxTrail(c,h,s.tw*sc,col,.85);bfxG(c,x,y,24*sc,col);c.save();c.translate(x,y);c.rotate(ang);c.fillStyle=hot;c.beginPath();c.arc(0,0,7*sc,-1.35,1.35);c.quadraticCurveTo(-3,0,Math.cos(-1.35)*7*sc,Math.sin(-1.35)*7*sc);c.fill();c.restore();bfxG(c,x,y,6,"#ffffff");
     if(Math.random()<.35)B.fx.push({x:x+(Math.random()-.5)*6,y,vx:bx*60+(Math.random()-.5)*40,vy:by*60+(Math.random()-.5)*40,life:.35,max:.35,col:Math.random()<.5?"#ffb04a":"#ff5a1a",r:2.5});break;
   case 3:{const Lh=46*sc;const g=c.createLinearGradient(x+bx*Lh,y+by*Lh,x,y);g.addColorStop(0,col+"00");g.addColorStop(1,col);c.lineCap="round";c.strokeStyle=g;c.lineWidth=5*sc;c.beginPath();c.moveTo(x+bx*Lh,y+by*Lh);c.lineTo(x,y);c.stroke();
     c.strokeStyle="#ffffff";c.lineWidth=1.6;c.beginPath();c.moveTo(x+bx*Lh*.55,y+by*Lh*.55);c.lineTo(x,y);c.stroke();bfxG(c,x,y,12*sc,col);break;}
   case 4:bfxTrail(c,h,s.tw*2.2*sc,col,.4);bfxTrail(c,h,s.tw*.7,hot,.75);bfxG(c,x,y,18*sc,col);c.fillStyle=hot;c.beginPath();c.arc(x,y,4.5*sc,0,7);c.fill();c.strokeStyle=col;c.lineWidth=1.6;c.beginPath();c.arc(x,y,6.5*sc,0,7);c.stroke();break;
   case 5:bfxTrail(c,h,s.tw*1.8*sc,col,.45);bfxG(c,x,y,18*sc,col);c.fillStyle=hot;bfxStar(c,x,y,8*sc,5,t*4-1.57,.46);c.fill();c.strokeStyle=col;c.lineWidth=1.2;c.stroke();
     if(Math.random()<.3)B.fx.push({x:x+(Math.random()-.5)*8,y:y+(Math.random()-.5)*8,vx:bx*30,vy:by*30,life:.5,max:.5,col:Math.random()<.5?"#ffffff":"#ff9ccc",r:2});break;
   case 6:bfxTrail(c,h,s.tw*1.6*sc,col,.45);bfxTrail(c,h,1.1,"#ffffff",.9);bfxG(c,x,y,14*sc,col);c.save();c.translate(x,y);c.rotate(ang);c.fillStyle="#eaf7ff";c.beginPath();c.moveTo(10*sc,0);c.lineTo(0,-4.5*sc);c.lineTo(-7*sc,0);c.lineTo(0,4.5*sc);c.closePath();c.fill();c.strokeStyle=col;c.lineWidth=1.2;c.stroke();c.restore();break;
   case 7:bfxTrail(c,h,s.tw*sc,"#ff9d1c",.85);bfxG(c,x+bx*7,y+by*7,13*sc,"#ffb04a");c.globalCompositeOperation="source-over";c.save();c.translate(x,y);c.rotate(ang);c.fillStyle="#e8ecff";c.beginPath();c.moveTo(9*sc,0);c.lineTo(3*sc,-3*sc);c.lineTo(-7*sc,-3*sc);c.lineTo(-7*sc,3*sc);c.lineTo(3*sc,3*sc);c.closePath();c.fill();c.fillStyle=col;c.fillRect(-7*sc,-4.5*sc,3*sc,9*sc);c.restore();
     if(Math.random()<.3)B.fx.push({x:x+bx*8,y:y+by*8,vx:bx*30,vy:by*30,life:.6,max:.6,col:"#8890a8",r:3});break;
   case 8:bfxTrail(c,h,s.tw*2.2*sc,"#5a2bb0",.6);bfxTrail(c,h,s.tw*.55,col,.8);bfxG(c,x,y,22*sc,col);c.globalCompositeOperation="source-over";c.fillStyle="#0a0418";c.beginPath();c.arc(x,y,6*sc,0,7);c.fill();c.globalCompositeOperation="lighter";
     c.strokeStyle=hot;c.lineWidth=1.8;c.beginPath();c.arc(x,y,7*sc,0,7);c.stroke();
     if(Math.random()<.4){c.strokeStyle="rgba(200,160,255,.85)";c.lineWidth=1.1;c.beginPath();let a=Math.random()*7,r=7*sc;c.moveTo(x+Math.cos(a)*r,y+Math.sin(a)*r);for(let q=0;q<3;q++){a+=(Math.random()-.5)*1.2;r+=5;c.lineTo(x+Math.cos(a)*r,y+Math.sin(a)*r);}c.stroke();}break;}
  c.globalCompositeOperation="source-over";return true;}
function vkBulletHit(b){const s=bfxStyle(b);if(!s||B.fx.length>600)return;for(let k=0;k<6;k++){const a=Math.random()*7,v=60+Math.random()*160;B.fx.push({x:b.x,y:b.y,vx:Math.cos(a)*v,vy:Math.sin(a)*v,life:.28,max:.28,col:k%2?s.hot:s.col,r:2.2});}}
/* mockup-only style picker */
function vkBfxChip(){if(window.Capacitor)return;let ch=$("#vkBfx");if(!ch){ch=document.createElement("button");ch.id="vkBfx";$("#battle").append(ch);
    ch.onclick=e=>{e.stopPropagation();bfxPick=bfxPick==null?0:bfxPick>=BFX.length-1?null:bfxPick+1;vkBfxChip();};
    ["pointerdown","touchstart","mousedown"].forEach(ev=>ch.addEventListener(ev,e=>e.stopPropagation()));}
  ch.innerHTML=\`<small>\${L("BULLET","ĐẠN")} ▸</small><b>\${bfxPick==null?(gfKey("cannon")?L("Cannon's own","Theo súng"):L("Pilot's own","Theo phi công")):L(BFX[bfxPick].n[0],BFX[bfxPick].n[1])}</b>\`;}
{const _sbf=startBattle;startBattle=function(cfg){_sbf(cfg);vkBfxChip();};}
/* Gear fire (G4): the equipped Cannon's type changes the main gun (look + trait), the Engine's type adds a perk.
   No cannon equipped -> main gun unchanged. Applies to main-gun bullets only (kind === ship id), never wing/beam/drone/skill shots.
   One table to tune (G5):
   rate = fire-rate x · dmg = damage x per bullet · r = hit radius x · gs = draw scale · spd = bullet speed x · pl = extra pierce
   homing · splash [radius, share of the hit] · burn [share of the hit, seconds] · slow [move speed x, seconds] · fx = BFX style [index]
   move = drag speed x (engine) · inv = extra safe seconds after a hit (engine) */
const GTYPE_FIRE={
  mg:     {rate:1.4,dmg:.75,gs:.7,fx:[1]},
  laser:  {dmg:.85,pl:1,spd:1.3,fx:[3]},
  missile:{dmg:.58,homing:1,spd:.8,splash:[40,.5],fx:[7]},
  plasma: {rate:.8,dmg:1.25,r:1.6,gs:1.35,fx:[0]},
  solar:  {dmg:.85,burn:[.3,2],fx:[2]},
  frost:  {dmg:1,slow:[.6,1],fx:[6]},
  jet:    {move:1.1},
  ion:    {inv:.4}};
// equipped type per slot, read once per battle (cached on B)
function gfKey(slot){if(typeof B==="undefined"||!B)return null;const c=B.gfk||(B.gfk={});
  if(!(slot in c)){const it=S.gear&&gEq(slot),t=it&&gType(it);c[slot]=t&&GTYPE_FIRE[t]?t:null;}return c[slot];}
const gfG=slot=>{const k=gfKey(slot);return k?GTYPE_FIRE[k]:null;};
const gfRate=()=>{const g=gfG("cannon");return g&&g.rate||1;};
const gfMove=()=>{const g=gfG("engine");return g&&g.move||1;};
const gfInv=()=>{const g=gfG("engine");return g&&g.inv||0;};
// main gun: stamp the cannon type on the bullets this volley added
{const _fire=fire;fire=function(){const k=gfKey("cannon"),n=B.pb.length;_fire();if(!k)return;const g=GTYPE_FIRE[k],id=B.ship.id;
  for(let i=n;i<B.pb.length;i++){const b=B.pb[i];if(b.kind!==id)continue;b.gt=k;
    if(g.dmg)b.dmg*=g.dmg;if(g.r)b.r*=g.r;if(g.gs)b.gs=g.gs;if(g.spd){b.vx*=g.spd;b.vy*=g.spd;}if(g.pl)b.pl=(b.pl||0)+g.pl;if(g.homing)b.homing=1;}};}
// on hit (enemy or boss): splash, burn, slow
function gfHit(b,e){const g=GTYPE_FIRE[b.gt];if(!g||!e)return;
  if(g.splash){const R=g.splash[0];for(const o of B.en)if(o!==e&&!o.dead&&!o.ghost&&o.age>0&&Math.hypot(o.x-b.x,o.y-b.y)<R+o.r*.5)hitEnemy(o,b.dmg*g.splash[1]);
    if(B.fx.length<600)B.fx.push({fire:1,x:b.x,y:b.y,vx:0,vy:0,R:R*.75,life:.3,max:.3});}
  if(g.burn){e.gfB=(e.gfB||0)+b.dmg*g.burn[0];e.gfBt=g.burn[1];}
  if(g.slow&&e!==B.boss){e.gfS=g.slow[1];e.gfSm=g.slow[0];}}
// per frame: burn ticks every .25s (no hit flash), flame / frost particles on affected enemies
function gfTick(dt){const T=.25,lim=B.fx.length<500;
  const burn=(o,boss)=>{o.gfBk=(o.gfBk||0)+dt;if(o.gfBk<T)return;const st=o.gfBk;o.gfBk=0;const d=o.gfB*Math.min(1,st/Math.max(st,o.gfBt));o.gfB-=d;o.gfBt-=st;
    const fl=o.flash;if(boss)hitBoss(d);else hitEnemy(o,d);o.flash=fl;};
  for(const e of B.en){if(e.dead)continue;
    if(e.gfBt>0){burn(e,0);if(lim&&Math.random()<dt*14)B.fx.push({x:e.x+rnd(-.5,.5)*e.r,y:e.y+rnd(-.3,.3)*e.r,vx:rnd(-15,15),vy:-rnd(40,90),life:.4,max:.4,col:Math.random()<.5?"#ffb04a":"#ff5a1a",r:3});}
    if(e.gfS>0&&lim&&Math.random()<dt*10)B.fx.push({x:e.x+rnd(-.6,.6)*e.r,y:e.y+rnd(-.4,.4)*e.r,vx:rnd(-20,20),vy:rnd(10,40),life:.45,max:.45,col:Math.random()<.5?"#bfe9ff":"#ffffff",r:2.5});}
  const bs=B.boss;if(bs&&bs.gfBt>0){burn(bs,1);if(lim&&Math.random()<dt*14)B.fx.push({x:bs.x+rnd(-.5,.5)*bs.r,y:bs.y+rnd(-.2,.3)*bs.r,vx:rnd(-15,15),vy:-rnd(40,90),life:.4,max:.4,col:Math.random()<.5?"#ffb04a":"#ff5a1a",r:3.5});}}
// frost: a slowed enemy runs its movement at gfSm speed until the slow wears off
{const _mv=moveEnemy;moveEnemy=function(e,dt){if(e.gfS>0){e.gfS-=dt;dt*=e.gfSm;}return _mv(e,dt);};}
{const _mu=miniUpdate;miniUpdate=function(e,dt){if(e.gfS>0){e.gfS-=dt;dt*=e.gfSm;}return _mu(e,dt);};}
/* Sparse popups dressed up: banner art, reward chips and icons on top of the original content and handlers */
const vkPopEl=()=>$("#veil .pop");
function vkChip(ic,t){return \`<span class="vkp-chip">\${ic==="gem"||ic==="coin"||ic==="energy"?sprImg("ui_cur_"+ic):\`<i>\${ic}</i>\`}<b>\${t}</b></span>\`;}
{const _mp=modePop;modePop=function(k){_mp(k);const p=vkPopEl();if(!p)return;const body=p.querySelector(".pb")||p.querySelector("h3")?.parentElement||p;
  const end=k==="endless",bk=end?"bg_world2":"bg_world3";
  const art=end?["enemy_grunt","enemy_elite","enemy_tank"].map(x=>sprImg(x)).join(""):[0,1,2].map(i=>sprImg(BOSSES[i].img)).join("");
  const ban=document.createElement("div");ban.className="vkp-ban "+(end?"e":"r");ban.style.backgroundImage=SPR_HAS(bk)?\`url(\${SPR_SRC[bk]})\`:"";
  ban.innerHTML=\`<div class="art">\${art}</div><span class="tag">\${end?L("WEEKLY RANKING","XẾP HẠNG TUẦN"):L("3 BOSSES","3 BOSS")}</span>\`;
  const first=p.querySelector("p");if(first)first.before(ban);else p.append(ban);
  if(!end){const d=[...p.querySelectorAll(".disp")].pop();if(d)d.textContent=fmt(S.bestRush||0)+" / 3";}
  const rw=document.createElement("div");rw.className="vkp-rw";
  rw.innerHTML=\`<small>\${L("Rewards","Phần thưởng")}</small><div>\${end?vkChip("coin",L("score ÷ 50","điểm ÷ 50"))+vkChip("gem",L("top 3 weekly","top 3 tuần")):vkChip("gem","60")+vkChip("coin","3,000")}</div>\`;
  const acts=p.querySelector(".acts");if(acts)acts.before(rw);};}
{const _eb=endBattle;endBattle=function(win){if(B&&B.cfg.mode==="bossrush"){S.bestRush=Math.max(S.bestRush||0,win?3:Math.min(3,B.bossCount||0));save();}_eb(win);};}
{const _en=POPS.energy;POPS.energy=function(){_en.apply(this,arguments);const p=vkPopEl();if(!p)return;const d=p.querySelector(".disp");if(!d)return;
  const w=document.createElement("div");w.className="vkp-nrg";const pc=Math.min(100,S.energy/S.maxEnergy*100);
  w.innerHTML=\`\${sprImg("ui_cur_energy")}<div class="bar"><i style="width:\${pc}%"></i></div>\`;d.before(w);};}
{const _ml=POPS.mail;POPS.mail=function(){_ml.apply(this,arguments);const p=vkPopEl();if(!p)return;
  p.querySelectorAll(".list .card").forEach(c=>{c.classList.add("vkp-mail");const ic=document.createElement("span");ic.className="mi";ic.innerHTML=sprImg("ui5_mail")||"✉";c.prepend(ic);
    const b=c.querySelector("b");if(b){const f=document.createElement("small");f.className="from";f.textContent=L("From: Command","Từ: Bộ chỉ huy");b.after(f);}});};}
{const _ev=POPS.event;POPS.event=function(){_ev.apply(this,arguments);const p=vkPopEl();if(!p)return;const h=p.querySelector(".evhead");if(!h)return;
  h.classList.add("vkp-evban");if(SPR_HAS("bg_world3"))h.style.backgroundImage=\`url(\${SPR_SRC.bg_world3})\`;
  };}
{const _nt=POPS.notice;POPS.notice=function(){_nt.apply(this,arguments);const p=vkPopEl();if(!p)return;const h=p.querySelector("h3");if(!h)return;
  const m=document.createElement("div");m.className="vkp-say";m.innerHTML=\`<img src="\${vkBust()}" alt=""><p>\${L("News from Command, Commander!","Tin mới từ Bộ chỉ huy đây, chỉ huy!")}</p>\`;
  const first=[...p.children].find(x=>x!==h&&!x.classList.contains("x")&&x.tagName!=="BUTTON");if(first)first.before(m);};}
/* Boss core summon skill: the equipped core casts on its own cooldown in every battle (unlocks with the Boss tab, after 1-10) */
function vkCoreOn(){return !!(B&&B.cfg&&vkOpen("boss")&&BOSS_SK[S.bossCore??0]);}
function vkCoreDmg(){const i=S.bossCore??0;return runDmg()*(1+(S.bossLv?.[i]||1)*.15);}
function vkCoreCast(){const i=S.bossCore??0,k=BOSS_SK[i],col=BOSSES[i].col,p=B.p,d=vkCoreDmg();
  const shot=(x,y,a,v,o)=>B.pb.push(Object.assign({x,y,vx:Math.sin(a)*v,vy:-Math.cos(a)*v,dmg:d,r:5,kind:"rs"},o||{}));
  B.fx.push({ring:1,x:p.x,y:p.y,r:12,life:.6,max:.6});floatTxt(p.x,p.y-64,L(k[0],k[1]),col);sfx("up");
  const hud=$("#vkCore");if(hud){hud.classList.remove("cast");void hud.offsetWidth;hud.classList.add("cast");}
  switch(i){
    case 0:for(let q=0;q<16;q++)shot(p.x,p.y,q/16*Math.PI*2,560,{dmg:d*2});break;                       // ring barrage
    case 1:case 2:B.bcK=i;B.bcT=i===1?10:3;B.bcA=0;break;                                              // swarm / dragon breath run in the update
    case 3:for(let q=0;q<5;q++)shot(p.x,p.y-30-q*44,0,1400,{dmg:d*6,len:90,pierce:1,kind:"beam",r:7});break; // solar lance
    case 4:B.eb.forEach(b=>{b.vx*=.3;b.vy*=.3;});break;                                                 // kraken grip
    case 5:p.shield=Math.max(p.shield,5);break;                                                          // void aegis
    case 6:for(let q=0;q<12;q++)shot(p.x+rnd(-30,30),p.y,rnd(-1.2,1.2),420,{homing:1,dmg:d*2.5});break; // seeker rain
    case 7:for(let q=0;q<6;q++)shot(p.x,p.y-20,(q-2.5)*.18,520,{rocket:1,homing:1,dmg:d*4,r:6});break;  // forge shells
    case 8:B.eb.forEach(b=>{if(!b.sv)b.sv=[b.vx,b.vy];b.vx=0;b.vy=0;});B.bcF=3;break;                   // wraith curtain
    case 9:B.eb=[];B.shake=12;B.fx.push({nova:1,x:p.x,y:p.y,R:Math.max(W,H)*.9,life:.7,max:.7,col:"180,120,255"}); // eclipse nova
      B.en.forEach(e=>{if(e.age>0)hitEnemy(e,d*14);});if(B.boss)hitBoss(d*20);break;}}
{const _ru=runSkillsUpdate;runSkillsUpdate=function(dt){_ru(dt);if(!vkCoreOn()||B.over)return vkCoreHud();
  const k=BOSS_SK[S.bossCore??0],p=B.p;if(B.bcCd===undefined)B.bcCd=Math.min(6,k[5]);
  B.bcCd-=dt;if(B.bcCd<=0){B.bcCd=k[5];vkCoreCast();}
  if(B.bcT>0){B.bcT-=dt;B.bcA-=dt;const d=vkCoreDmg();
    if(B.bcK===1&&B.bcA<=0){B.bcA=.35;for(let q=0;q<4;q++){const a=B.t*3+q*Math.PI/2,x=p.x+Math.cos(a)*46,y=p.y+Math.sin(a)*30;
      B.pb.push({x,y,vx:0,vy:-650,dmg:d*.8,r:4,homing:1,kind:"wing"});B.fx.push({x,y,vx:0,vy:20,life:.25,max:.25,col:BOSSES[1].col,r:5});}}
    if(B.bcK===2&&B.bcA<=0){B.bcA=.07;for(let q=0;q<3;q++){const a=rnd(-.45,.45);B.pb.push({x:p.x,y:p.y-24,vx:Math.sin(a)*520,vy:-Math.cos(a)*520,dmg:d*.5,r:6,kind:"rs"});}}}
  if(B.bcF>0){B.bcF-=dt;if(B.bcF<=0)B.eb.forEach(b=>{if(b.sv){b.vx=b.sv[0];b.vy=b.sv[1];delete b.sv;}});}
  vkCoreHud();};}
function vkCoreHud(){let h=$("#vkCore");const on=vkCoreOn()&&cur==="battle";
  if(!h){if(!on)return;h=document.createElement("div");h.id="vkCore";$("#battle").append(h);}
  h.hidden=!on;if(!on)return;const i=S.bossCore??0,k=BOSS_SK[i];
  if(h.dataset.i!==String(i)){h.dataset.i=i;h.style.setProperty("--c",BOSSES[i].col);h.innerHTML=\`<span class="d"></span>\${sprImg(BOSSES[i].img)}<b>\${L("CORE","LÕI")}</b>\`;}
  h.style.setProperty("--p",Math.max(0,Math.min(100,(1-(B.bcCd??k[5])/k[5])*100)).toFixed(1));}
// boss bar sits under the HP pill instead of on top of it
{const _sbo=spawnBoss;spawnBoss=function(){_sbo();vkBossBar();};}
function vkBossBar(){const hp=$("#hHp"),bb=$("#bossbar"),bt=$("#battle");if(!hp||!bb||!bt)return;const pill=hp.closest("div[class]")||hp;
  bb.style.top=(pill.getBoundingClientRect().bottom-bt.getBoundingClientRect().top+10)+"px";}
addEventListener("resize",()=>{if(B&&B.boss)vkBossBar();});

/* ===== Feature unlocks + mandatory tutorial (docs/TUTORIAL_UNLOCK_PLAN.md) ===== */
const vkCleared=()=>{const a=S.stars.normal;let i=0;while(a[i])i++;return i;};
const VK_FEAT={quests:{q:"#tabbar [data-go=missions]",n:["Quests","Nhiệm vụ"],ic:"ui5_questnav"},hangar:{q:"#tabbar [data-go=hangar]",n:["Hangar","Xưởng"],ic:"ui5_hangar"},
  shop:{q:"[data-go=shop]",n:["Shop","Cửa hàng"],ic:"ui5_shop"},skills:{q:"#hTabs [data-ht=skills]",n:["Skills","Kỹ năng"],ic:"ui_sk_damage"},
  spin:{q:"[data-pop=spin]",n:["Lucky Spin","Vòng quay"],ic:"ui5_spin"},online:{q:"[data-pop=online]",n:["Online Gift","Quà online"],ic:"ui5_onlinegift"},
  offer:{q:"[data-pop=offer]",n:["Offers","Ưu đãi"],ic:"ui5_offer"},drones:{q:"#hTabs [data-ht=drones]",n:["Pets","Pet"],ic:"drone_sparrow"},
  gear:{q:"#hTabs [data-ht=gear]",n:["Gear","Trang bị"],ic:"gear_vanguard_cannon"},bossrush:{q:null,n:["Boss Rush","Thử thách Boss"],ic:"ui_st_kills"},
  mail:{q:"[data-pop=mail]",n:["Mail","Thư"],ic:"ui5_mail"},notice:{q:"[data-pop=notice]",n:["Notices","Thông báo"],ic:"ui5_notice"},
  pilots:{q:"#hTabs [data-ht=pilots]",n:["Support","Hỗ trợ"],ic:"pilot_vega"},boss:{q:"#hTabs [data-ht=boss]",n:["Boss Cores","Lõi Boss"],ic:"boss1"},
  explore:{q:"#home [data-card=explore]",n:["Endless","Vô tận"],ic:"ui_st_score"},rank:{q:"[data-go=rank]",n:["Ranking","Xếp hạng"],ic:"ui5_rank"},
  event:{q:"[data-pop=event]",n:["Events","Sự kiện"],ic:"ui5_event"}};
const VK_GROUPS=[{req:1,f:["quests"],t:"t7",say:["Quests give free rewards. Let's claim one!","Nhiệm vụ cho quà miễn phí. Nhận thử một cái nhé!"]},
  {req:2,f:["hangar","shop"],t:"t8",say:["The hangar is open! Upgrade me to hit harder~","Xưởng mở rồi! Nâng cấp em để bắn mạnh hơn nha~"]},
  {req:3,f:["skills","spin","online","offer"],t:"t9",say:["A free lucky spin is waiting!","Có lượt quay miễn phí đang chờ đó!"]},
  {req:4,f:["drones"],say:["A robot pet will fly with us now!","Giờ có thú cưng máy bay cùng mình rồi!"]},
  {req:5,f:["gear","bossrush","mail","notice"],t:"t10",say:["The boss dropped gear! Let's equip it.","Boss rơi trang bị rồi! Mặc vào thôi."]},
  {req:7,f:["pilots"],say:["Support officers give us bonuses.","Sĩ quan hỗ trợ cho mình thêm bonus."]},
  {req:10,f:["boss","explore","rank"],say:["Boss cores, Endless and Ranking are open!","Lõi Boss, Vô tận và Xếp hạng đã mở!"]},
  {req:11,f:["event"],say:["Limited events are open!","Sự kiện giới hạn đã mở!"]}];
const VK_REQ={};VK_GROUPS.forEach(g=>g.f.forEach(f=>VK_REQ[f]=g.req));
const vkOpen=f=>!VK_REQ[f]||vkCleared()>=VK_REQ[f];
function vkLocks(){for(const f in VK_FEAT){const d=VK_FEAT[f];if(!d.q)continue;const op=vkOpen(f);
  $$(d.q).forEach(el=>{el.classList.toggle("vk-lk",!op);el.dataset.vkf=f;let b=el.querySelector(":scope>.vk-lkb");
    if(!op&&!b){b=document.createElement("vk-lock");b.className="vk-lkb";b.textContent="🔒 "+lvName(VK_REQ[f]-1);el.appendChild(b);}if(op&&b)b.remove();});}}
document.addEventListener("click",e=>{const el=e.target.closest(".vk-lk");if(!el||e.vkTut)return;e.stopPropagation();e.preventDefault();
  const f=el.dataset.vkf;toast(L(\`Clear stage \${lvName(VK_REQ[f]-1)} to unlock \${VK_FEAT[f].n[0]}\`,\`Qua màn \${lvName(VK_REQ[f]-1)} để mở \${VK_FEAT[f].n[1]}\`));},true);
const vkIc=k=>k.startsWith("ui")&&!k.startsWith("ui5")?vIcon(k.slice(3),"",false):sprImg(k);

/* tutorial overlay: dim everything, cut a hole around the target, only the hole is tappable */
const vkTutOn=()=>!!$("#vkTut");
function vkBust(){return typeof GIRL_BUST!=="undefined"&&GIRL_BUST.kestrel||"";}
function vkTut(sel,text,o={}){return new Promise(res=>{if(S.tutSkip)return res(false);
  let tries=0;const start=()=>{const el=typeof sel==="string"?$(sel):sel;
    if(sel&&(!el||!el.offsetParent)){if(++tries<40)return setTimeout(start,100);return res(false);}
    const st=$("#stage"),ov=document.createElement("div");ov.id="vkTut";
    ov.innerHTML=\`<div class="hole \${sel?"":"nohole"}"></div>\${sel?'<div class="hand"></div>':(o.drag?'<div class="drag"></div>':"")}<div class="bub"><img src="\${vkBust()}" alt=""><p>\${text}</p></div><button class="skip">\${L("Skip","Bỏ qua")}</button>\`;
    st.appendChild(ov);const hole=ov.querySelector(".hole"),hand=ov.querySelector(".hand"),bub=ov.querySelector(".bub"),drag=ov.querySelector(".drag");let R=null;
    const place=()=>{const sr=st.getBoundingClientRect();
      if(el){const r=el.getBoundingClientRect(),pad=6;R={x:r.left-sr.left-pad,y:r.top-sr.top-pad,w:r.width+pad*2,h:r.height+pad*2};
        Object.assign(hole.style,{left:R.x+"px",top:R.y+"px",width:R.w+"px",height:R.h+"px"});
        Object.assign(hand.style,{left:(R.x+R.w/2-17)+"px",top:(R.y+R.h+10)+"px"});
        const below=R.y+R.h+150<sr.height;bub.style.top=below?(R.y+R.h+56)+"px":"auto";bub.style.bottom=below?"auto":(sr.height-R.y+16)+"px";}
      else{Object.assign(hole.style,{left:"50%",top:"50%",width:"0",height:"0"});bub.style.top="auto";bub.style.bottom="30%";if(drag)drag.style.top="62%";}};
    place();const iv=setInterval(place,200);
    const done=ok=>{clearInterval(iv);ov.remove();res(ok);};
    const sk=ov.querySelector(".skip");sk.onclick=ev=>{ev.stopPropagation();if(!sk.classList.contains("sure")){sk.classList.add("sure");sk.textContent=L("Tap again to skip the tutorial","Bấm lần nữa để bỏ hướng dẫn");return;}
      S.tutSkip=1;save();done(false);};
    ov.addEventListener("pointerdown",ev=>{if(ev.target===sk)return;ev.preventDefault();ev.stopPropagation();
      if(!el){if(o.drag){const t0=Date.now();const up=()=>{removeEventListener("pointerup",up);done(true);};addEventListener("pointerup",up);}else done(true);return;}
      const sr=st.getBoundingClientRect(),x=ev.clientX-sr.left,y=ev.clientY-sr.top;
      if(R&&x>=R.x&&x<=R.x+R.w&&y>=R.y&&y<=R.y+R.h){done(true);setTimeout(()=>{const c=new MouseEvent("click",{bubbles:true,cancelable:true});c.vkTut=1;el.dispatchEvent(c);},0);}});};
  start();});}
const vkStep=id=>{S.tut=S.tut&&typeof S.tut==="object"?S.tut:{};if(S.tut[id]||S.tutSkip)return false;S.tut[id]=1;save();return true;};

/* unlock dialog after returning home; "Go" runs the matching tutorial */
let vkUnlBusy=false;
function vkUnlockCheck(){if(veil.hidden)vkUnlBusy=false;if(cur!=="home"||!veil.hidden||vkTutOn()||vkUnlBusy)return;const c=vkCleared();S.unlReq=S.unlReq||0;
  const g=VK_GROUPS.find(g=>g.req<=c&&g.req>S.unlReq);if(!g)return;S.unlReq=g.req;save();vkUnlBusy=true;vkLocks();
  const p=pop(L("NEW UNLOCK!","MỞ KHOÁ MỚI!"),\`<div class="vk-unl"><div class="fs">\${g.f.map((f,i)=>\`<div class="f" style="animation-delay:\${i*.08}s">\${vkIc(VK_FEAT[f].ic)}<b>\${L(...VK_FEAT[f].n)}</b></div>\`).join("")}</div>
    <div class="say"><img src="\${vkBust()}" alt=""><span>\${L(...g.say)}</span></div></div><div class="acts"><button class="btn" id="vkGo">\${L("Go","Đi tới")}</button></div>\`,"vk-reward",()=>{closePop();vkUnlBusy=false;});
  p.querySelector("#vkGo").onclick=()=>{closePop();vkUnlBusy=false;vkRunTut(g);};}
async function vkRunTut(g){const f=g.f[0];
  if(g.t==="t7"){go("missions");if(vkStep("t7")){S.q.play3=Math.max(S.q.play3||0,3);renderMissions();await vkTut("#missionBody .vq-btn.claim",L("Tap <b>Claim</b> to get your reward.","Bấm <b>Nhận</b> để lấy quà."));}return;}
  if(g.t==="t8"){htab="ships";hSel=S.ship;if(vkStep("t8")){const o=S.ships[S.ship];if(S.coins<upCost(o.lv))S.coins=upCost(o.lv);}go("hangar");
    await vkTut("#hangarBody [data-a=up]",L("Tap <b>Upgrade</b> to make me stronger!","Bấm <b>Nâng cấp</b> để em mạnh hơn nhé!"));return;}
  if(g.t==="t9"){if(vkStep("t9"))S.spinDay="";POPS.spin();await vkTut("#hub",L("Tap the wheel to spin for free!","Bấm vào giữa vòng để quay miễn phí!"));return;}
  if(g.t==="t10"){if(!(S.tut&&S.tut.t10)&&!S.gear.inv.some(x=>!isEq(x)))S.gear.inv.push({uid:++S.gear.uid,set:"vanguard",slot:"cannon",rar:1,lv:1});htab="gear";go("hangar");if(vkStep("t10")){if(await vkTut("#hangarBody [data-gi]",L("This gear came from the boss. Tap it!","Đây là trang bị boss vừa rơi. Bấm vào nó!")))
      await vkTut("#gEq",L("Tap <b>Equip</b>!","Bấm <b>Trang bị</b>!"));}return;}
  const tab={skills:"skills",drones:"drones",gear:"gear",pilots:"pilots",boss:"boss"}[f];
  if(tab){htab=tab;go("hangar");}else if(f==="explore"||f==="bossrush")go("home");else if(f==="rank")go("rank");else if(POPS[f])POPS[f]();}

/* first launch: T1 instead of the launch popups */
{const _lp=launchPops;launchPops=function(){if(vkCleared()===0&&!(S.tut&&S.tut.t1)&&!S.tutSkip){vkT1();return;}_lp();};}
async function vkT1(){vkStep("t1");
  if(await vkTut("#tabbar .nav.nmain",L("Hi Commander! I'm <b>Mika</b>, your pilot. Tap <b>Sortie</b> to launch!","Chào chỉ huy! Em là <b>Mika</b>, phi công của anh. Bấm <b>Xuất kích</b> để bay nào!")))
    await vkTut("#veil .pop #go",L("Tap <b>GO</b> to start stage 1-1.","Bấm nút xuất kích để vào màn 1-1."));}

/* easy first stages + in-battle steps */
const VK_EZ=[{less:2,only:1,fire:.5,bs:.7,noLose:1,rew:1.5},{less:1,only:2,fire:.7,bs:.8,noLose:1,rew:1.5},{less:0,fire:.85,bs:.9,freeRev:1,rew:1.2}];
{const _df=droneFire,_du0=droneUpdate;droneFire=function(){if(vkOpen("drones"))_df();};droneUpdate=function(dt){if(vkOpen("drones"))_du0(dt);};}
{const _sb=startBattle;startBattle=function(cfg){_sb(cfg);if(!vkOpen("drones"))B.dp=null;B.ez=cfg.mode==="stage"&&cfg.diff==="normal"&&cfg.idx<3?VK_EZ[cfg.idx]:null;
  if(B.ez&&cfg.idx===1&&!(S.tut&&S.tut.t5))B.ult=80;
  if(!(S.tut&&S.tut.t2)&&!S.tutSkip&&cfg.idx===0){B.paused=true;vkStep("t2");vkTut(null,L("<b>Drag</b> anywhere to fly your ship!","<b>Kéo ngón tay</b> ở bất kỳ đâu để điều khiển tàu!"),{drag:1}).then(()=>{if(B){B.paused=false;last=performance.now();}});}};}
{const _hp=hurtPlayer;hurtPlayer=function(){const p=B&&B.p;if(p&&B.ez&&B.ez.noLose&&p.hp<=1&&p.inv<=0&&p.shield<=0&&!B.over){p.shield=3;p.inv=1;B.shake=8;
    floatTxt(p.x,p.y-40,L("Shield up!","Khiên bảo vệ!"),"#5ee7ff");toast(L("Careful! I'll hold the shield for you!","Cẩn thận! Em giữ khiên cho anh!"));return;}_hp();};}
{const _rp=revivePop;revivePop=function(){if(B&&B.ez&&B.ez.freeRev&&!B.revived){B.revived=true;B.over=false;B.paused=false;B.p.alive=true;B.p.hp=B.p.maxHp;B.p.inv=2.5;B.eb=[];
    last=performance.now();updHud();toast(L("Free revive! Keep going!","Hồi sinh miễn phí! Cố lên!"));return;}_rp();};}
{const _lu2=levelUp;levelUp=function(){_lu2();if(vkStep("t4")){vkTut("#lvup .lvcard:nth-child(2)",L("Pick a skill. Skills stack during the run!","Chọn 1 kỹ năng. Kỹ năng cộng dồn trong trận!"));}};}
setInterval(()=>{vkLocks();if(cur==="home")vkUnlockCheck();
  if(cur!=="battle"||!B||B.over||vkTutOn()||S.tutSkip)return;const t=S.tut||{};
  if(!t.t3&&B.drops&&B.drops.some(d=>d.kind==="xp")){vkStep("t3");toast(L("Collect the blue crystals to level up!","Nhặt tinh thể xanh để lên cấp!"));}
  if(!t.t5&&B.ult>=100&&!B.paused){vkStep("t5");B.paused=true;vkTut("#skUlt",L("Your <b>ULT</b> is ready! Tap it!","<b>Tuyệt chiêu</b> đã đầy! Bấm vào đi!")).then(()=>{if(B&&!B.picking){B.paused=false;last=performance.now();}});}
  else if(!t.t6&&B.p&&B.p.hp===1&&B.p.alive&&!B.paused){vkStep("t6");B.paused=true;vkTut("#skShield",L("Low HP! Tap <b>Shield</b> to block bullets.","Sắp hết máu! Bấm <b>Khiên</b> để chặn đạn.")).then(()=>{if(B&&!B.picking){B.paused=false;last=performance.now();}});}},300);
/* players who already had progress skip everything that is behind them */
if(S.tutV!==1&&S.tutV!==2){S.tutV=1;const c=vkCleared();if(c>0){S.tut={t1:1,t2:1,t3:1,t4:1,t5:1,t6:1,t7:1,t8:1,t9:1,t10:1};S.unlReq=c;}save();}
/* v2: a brand-new pilot starts with no gear; the first piece comes from the 1-5 boss (T10) */
if(S.tutV===1){S.tutV=2;if(vkCleared()<5&&!(S.tut&&S.tut.t10)){S.gear.eq={cannon:null,engine:null,plating:null,core:null};S.gear.inv=[];}save();}

/* Robot pets: lively motion (hover figure-8, breathing squash, bank, fire recoil) + a signature effect per kind */
const PET_FX={shot:"#9fdcff",missile:"#ff9d1c",laser:"#38e1ff",flak:"#ff9d1c",medic:"#52f19a",tesla:"#5aa8ff",guardian:"#38e1ff",phantom:"#b36bff",solaris:"#ffc83d"};
function petSpark(x,y,col,n,sp,life,r){for(let i=0;i<n;i++){const a=rnd(0,7),v=rnd(sp*.4,sp);B.fx.push({x,y,vx:Math.cos(a)*v,vy:Math.sin(a)*v,life:rnd(life*.6,life),max:life,col,r:rnd(r*.6,r)});}}
drawDroneBody=function(c,dd,x,y,t,o={}){const s=(o.size||13)*1.3,col=dd.col,im=petFrame(dd.id,t,o.vx)||spr("drone_"+dd.id),k=dd.kind;
  const pm=o.pet?0:1,hx=Math.sin(t*1.7)*5*pm,hy=Math.sin(t*3.4)*3.5*pm-(o.hop||0),br=1+Math.sin(t*5)*.035*pm,rec=0;   // no fire recoil: it made the pets jitter on every shot
  const tilt=Math.max(-.5,Math.min(.5,(o.vx||0)/700))+Math.sin(t*1.7)*.08;
  c.save();
  // phantom afterimages (violet ghosts)
  if(k==="phantom"&&o.hist&&o.hist.length>4){c.globalCompositeOperation="lighter";for(let q=0;q<o.hist.length-2;q+=2){c.globalAlpha=(q/o.hist.length)*.3;if(im)blit(c,im,o.hist[q],o.hist[q+1],s*2.3);}c.globalAlpha=1;c.globalCompositeOperation="source-over";}
  c.translate(x+hx,y+hy+rec*5);
  c.globalCompositeOperation="lighter";
  // soft aura + hover ring under the pet
  const pu=.7+.3*Math.sin(t*6);let g=c.createRadialGradient(0,0,2,0,0,s*2.2);g.addColorStop(0,col+"55");g.addColorStop(1,col+"00");c.globalAlpha=pu;c.fillStyle=g;c.fillRect(-s*2.2,-s*2.2,s*4.4,s*4.4);c.globalAlpha=1;
  if(!o.pet){c.save();c.translate(0,s*1.25);c.scale(1,.32);c.strokeStyle=col;c.globalAlpha=.55+.25*Math.sin(t*4);c.lineWidth=2.5;c.beginPath();c.arc(0,0,s*(.9+.08*Math.sin(t*4)),0,7);c.stroke();c.restore();c.globalAlpha=1;}
  if(o.pet)petVipUnder(c,s,t,o.vip||0);
  // kind effects behind the body
  if(k==="solaris"){c.save();c.rotate(t*1.1);for(let q=0;q<10;q++){c.rotate(Math.PI/5);const rg=c.createLinearGradient(0,0,0,-s*2.6);rg.addColorStop(0,"#ffd36b88");rg.addColorStop(1,"#ffd36b00");c.fillStyle=rg;c.beginPath();c.moveTo(-2,0);c.lineTo(2,0);c.lineTo(4,-s*2.6);c.lineTo(-4,-s*2.6);c.closePath();c.fill();}c.restore();}
  if(k==="guardian"||o.guard){const a=.35+(o.g>0?.55:0);c.save();c.rotate(t*.9);c.strokeStyle=\`rgba(94,231,255,\${a})\`;c.lineWidth=o.g>0?3:1.6;c.beginPath();
    for(let q=0;q<=6;q++){const an=q/6*Math.PI*2,r=s*2;q?c.lineTo(Math.cos(an)*r,Math.sin(an)*r):c.moveTo(Math.cos(an)*r,Math.sin(an)*r);}c.stroke();
    if(o.g>0){c.fillStyle=\`rgba(94,231,255,\${o.g*.6})\`;c.fill();}c.restore();}
  if(k==="medic"&&o.pulse>0){const q=1-o.pulse/.8;c.strokeStyle=\`rgba(82,241,154,\${o.pulse})\`;c.lineWidth=3;c.beginPath();c.arc(0,0,s*(1+q*3.2),0,7);c.stroke();}
  if(k==="laser"&&o.f>0){c.strokeStyle="#bff6ffcc";c.lineWidth=2;c.beginPath();c.arc(0,-s*.2,s*(1.6-rec),0,7);c.stroke();}
  c.globalCompositeOperation="source-over";
  // body: bank, breathe, squash on recoil
  c.rotate(tilt);c.scale(br*(o.sx||1),br*(o.sy||1));
  if(im)blit(c,im,0,0,s*2.3);else drawDrone(c,dd,0,0,s*.8,t);
  c.globalCompositeOperation="lighter";
  if(k==="tesla"&&Math.random()<.55){c.strokeStyle="rgba(170,215,255,.9)";c.lineWidth=1.6;c.beginPath();let a=rnd(0,7),r=s*.5;c.moveTo(Math.cos(a)*r,Math.sin(a)*r);for(let q=0;q<5;q++){a+=rnd(-.7,.7);r+=s*.32;c.lineTo(Math.cos(a)*r+rnd(-3,3),Math.sin(a)*r+rnd(-3,3));}c.stroke();}
  // muzzle flash: soft round glow in the pet colour
  if(o.f>0){const R=s*(.55+rec*.5),m=c.createRadialGradient(0,-s*1.15,0,0,-s*1.15,R);m.addColorStop(0,"#ffffffee");m.addColorStop(.35,col+"cc");m.addColorStop(1,col+"00");
    c.globalAlpha=rec;c.fillStyle=m;c.beginPath();c.arc(0,-s*1.15,R,0,7);c.fill();c.globalAlpha=1;}
  c.globalCompositeOperation="source-over";
  if(o.pet&&o.vip>=3){c.rotate(-tilt);petVipOver(c,s,t);}
  c.restore();};
/* ===== Battle pet: ONE companion instead of the left/right pair. Same total output (PET_MUL), spring follow, idle loop, VIP tiers ===== */
function vipLevel(){const v=S.vipLv??(S.vip?1:0);return Math.max(0,Math.min(3,+v||0));}
const PET_MUL=2;   // one pet deals what the old pair dealt
const PET_GX={};   // pre-rendered additive glow sprites
function petGlow(key,R,stops,sy=1){if(PET_GX[key])return PET_GX[key];const cv=document.createElement("canvas"),z=Math.ceil(R*2+4);cv.width=z;cv.height=Math.ceil(z*sy);const g=cv.getContext("2d");
  g.translate(z/2,cv.height/2);g.scale(1,sy);const rg=g.createRadialGradient(0,0,0,0,0,R);stops.forEach(([a,c])=>rg.addColorStop(a,c));g.fillStyle=rg;g.beginPath();g.arc(0,0,R,0,7);g.fill();return PET_GX[key]=cv;}
function petVipUnder(c,s,t,v){if(v<2)return;c.save();c.globalCompositeOperation="lighter";
  if(v>=3){const a=petGlow("aura",64,[[0,"rgba(255,214,110,.26)"],[.45,"rgba(255,190,70,.1)"],[1,"rgba(255,170,40,0)"]]),k=s*2.6/64;c.globalAlpha=.5+.1*Math.sin(t*2.2);c.drawImage(a,-a.width*k/2,-a.height*k/2,a.width*k,a.height*k);}
  const h=petGlow("halo",64,[[0,"rgba(255,240,200,0)"],[.68,"rgba(255,240,200,0)"],[.82,"rgba(255,226,150,.75)"],[1,"rgba(255,210,120,0)"]],.34),w=s*2.1*(1+.04*Math.sin(t*3));
  c.globalAlpha=.5+.15*Math.sin(t*3);c.drawImage(h,-w/2,s*1.2-w*.17,w,w*.34);c.restore();}
function petVipOver(c,s,t){c.save();c.globalCompositeOperation="lighter";const y=-s*1.55+Math.sin(t*2.4)*1.5,tw=.6+.4*Math.max(0,Math.sin(t*3.1));
  const g=petGlow("glint",20,[[0,"rgba(255,250,220,.9)"],[.3,"rgba(255,220,120,.45)"],[1,"rgba(255,200,80,0)"]]);c.globalAlpha=.55*tw;c.drawImage(g,-9,y-9,18,18);
  c.globalAlpha=.9*tw;c.fillStyle="#fff3c4";c.beginPath();const r=4.5+tw*1.5;for(let q=0;q<8;q++){const a=q*Math.PI/4,rr=q%2?r*.28:r;q?c.lineTo(Math.sin(a)*rr,y-Math.cos(a)*rr):c.moveTo(0,y-rr);}c.closePath();c.fill();
  // tiny crown dots under the star
  c.globalCompositeOperation="source-over";c.globalAlpha=.9;c.fillStyle="#ffd36b";c.beginPath();c.moveTo(-5,y+7);c.lineTo(-5,y+3);c.lineTo(-2.5,y+5);c.lineTo(0,y+2);c.lineTo(2.5,y+5);c.lineTo(5,y+3);c.lineTo(5,y+7);c.closePath();c.fill();c.restore();}
function petMove(d,dt){const p=B.p,M=W-20;dt=Math.min(dt,.05);
  const pvx=(p.x-(d.lpx??p.x))/Math.max(dt,1e-3);d.lpx=p.x;
  const slot=sd=>p.x+sd*54,out=sd=>slot(sd)>M||slot(sd)<20;
  // ship keeps running toward the pet's side (or the slot leaves the screen) -> glide over to the other side
  if(pvx*d.side>240)d.push+=dt;else d.push=Math.max(0,d.push-dt*2);
  if((d.push>.4||out(d.side))&&!out(-d.side)&&!(d.swap>0)){d.side=-d.side;d.push=0;d.swap=.7;}
  if(d.swap>0)d.swap-=dt;
  d.wt+=dt;const wx=Math.sin(d.wt*.9)*6+Math.sin(d.wt*.37)*4,wy=Math.sin(d.wt*1.3)*4;
  const dip=d.swap>0?40*Math.sin(Math.PI*(1-d.swap/.7)):0;   // swaps pass BELOW the ship, never through the bullet lane
  const tx=slot(d.side)+wx,ty=p.y+18+wy+dip,w=6.5;          // critically damped spring
  d.vx+=(w*w*(tx-d.x)-2*w*d.vx)*dt;d.vy+=(w*w*(ty-d.y)-2*w*d.vy)*dt;d.x+=d.vx*dt;d.y+=d.vy*dt;
  const need=p.y+8+Math.max(0,38-Math.abs(d.x-p.x))*1.2;if(d.y<need){d.y=need;if(d.vy<0)d.vy=0;}
  d.x=Math.max(14,Math.min(W-14,d.x));
  // idle loop timers: hop every ~3.6 s, blink every ~4.3 s
  d.ht=(d.ht??rnd(1,3))-dt;if(d.ht<=0)d.ht=3.6+rnd(-.6,.6);d.bt=(d.bt??rnd(1,4))-dt;if(d.bt<=0)d.bt=4.3+rnd(-1,1);}
function petAct(d,dt){const p=B.p,dd=droneDef(S.drone),lv=(S.drones[S.drone]||{lv:1}).lv,dmg=.5*(1+lv*.1)*runDmg()*(1+pk().drone);
  if(d.f>0)d.f-=dt;if(d.g>0)d.g-=dt;d.h.push(d.x,d.y);if(d.h.length>12)d.h.splice(0,2);
  if(!p.alive||B.over)return;
  if(dd.kind==="guardian"){const n0=B.eb.length;B.eb=B.eb.filter(q=>Math.hypot(q.x-d.x,q.y-d.y)>72);if(B.eb.length<n0){d.g=.3;B.fx.push({x:d.x,y:d.y-20,vx:0,vy:-40,life:.3,max:.3,col:"#9ff3ff",r:6});}}
  if(dd.kind==="medic"){B.mhT+=dt;if(B.mhT>=18){B.mhT=0;B.mhP=.8;if(p.hp<p.maxHp){p.hp++;floatTxt(p.x,p.y-34,"+1 HP","#52f19a");updHud();}}}
  if(B.mhP>0)B.mhP-=dt;
  if(dd.kind==="solaris"){B.solT+=dt;if(B.solT>=3){B.solT=0;B.fx.push({nova:1,x:d.x,y:d.y,R:125,life:.45,max:.45,col:"255,200,61"});for(const e of B.en)if(!e.dead&&e.age>0&&Math.hypot(e.x-d.x,e.y-d.y)<125)for(let q=0;q<PET_MUL;q++)hitEnemy(e,dmg*6);}}
  B.dT-=dt;if(B.dT>0)return;B.dT=DKIND[dd.kind][1];
  d.f=.09;for(const s of [-1,1]){const x=d.x+s*12,y=d.y;   // one pet fires the whole old pair volley from two muzzles
  if(dd.kind==="shot")B.pb.push({x,y:y-12,vx:s*70,vy:-700,dmg,r:3,kind:"drone"});
  else if(dd.kind==="missile")B.pb.push({x,y,vx:s*60,vy:-300,dmg:dmg*4,r:4,homing:1,rocket:1,kind:"drone"});
  else if(dd.kind==="laser")B.pb.push({x,y:y-12,vx:s*200,vy:-1100,dmg:dmg*.7,r:2,len:26,pierce:1,kind:"beam"});
  else if(dd.kind==="flak")for(let k=-2;k<=2;k++){const a=k*.16;B.pb.push({x,y:y-10,vx:Math.sin(a)*620,vy:-Math.cos(a)*620,dmg:dmg*.55,r:3,kind:"raptor"});}
  else if(dd.kind==="medic")B.pb.push({x,y:y-12,vx:s*100,vy:-720,dmg:dmg*.7,r:3,kind:"wing"});
  else if(dd.kind==="guardian")B.pb.push({x,y:y-12,vx:s*70,vy:-700,dmg:dmg*.6,r:3,kind:"drone"});
  else if(dd.kind==="tesla"){let from={x,y:y-8},pts=[[x,y-8]],pool=B.en.filter(e=>!e.dead&&e.age>0&&e.y>0&&e.y<H);
    for(let n=0;n<2&&pool.length;n++){pool.sort((a,b)=>Math.hypot(a.x-from.x,a.y-from.y)-Math.hypot(b.x-from.x,b.y-from.y));const e=pool.shift();if(Math.hypot(e.x-from.x,e.y-from.y)>320)break;pts.push([e.x,e.y]);hitEnemy(e,dmg*3);from=e;}
    if(pts.length===1&&B.boss&&B.boss.y>40&&Math.hypot(B.boss.x-x,B.boss.y-y)<420){pts.push([B.boss.x,B.boss.y+20]);hitBoss(dmg*3);}
    if(pts.length>1)B.fx.push({bolt:boltPath(pts),nodes:pts.slice(1),life:.2,max:.2});}
  else if(dd.kind==="phantom")B.pb.push({x,y:y-10,vx:s*50,vy:-380,r:6,homing:1,pierce:1,dmg:dmg*3,kind:"phantom"});
  else if(dd.kind==="solaris")for(let k=-1;k<=1;k++){const a=k*.14;B.pb.push({x,y:y-12,vx:Math.sin(a)*760,vy:-Math.cos(a)*760,dmg:dmg*.6,r:3,kind:"seraph"});}}}
droneUpdate=function(dt){if(!B||!B.dp||!B.dp.length||!vkOpen("drones"))return;const d=B.dp[0];petMove(d,dt);petAct(d,dt);};
drawDronePair=function(c){if(!B||!B.dp)return;const dd=droneDef(S.drone);B.dp.forEach(d=>{
  const hp=d.ht<.4?Math.sin(Math.PI*d.ht/.4):0,bl=d.bt<.12?Math.sin(Math.PI*d.bt/.12):0,br=Math.sin(B.t*2.6)*.035;
  drawDroneBody(c,dd,d.x,d.y,B.t,{pet:1,vip:vipLevel(),vx:d.vx,f:d.f,g:d.g,hist:d.h,pulse:B.mhP,hop:hp*6,sx:1+br+bl*.06+hp*.03,sy:1-br-bl*.22-hp*.04});});};
{const _sbp=startBattle;startBattle=function(cfg){_sbp(cfg);if(B&&B.dp)B.dp=[{x:W/2+54,y:H*.8+18,vx:0,vy:0,f:0,g:0,h:[],side:1,push:0,swap:0,ms:1,wt:rnd(0,9)}];};}
/* run skill "Escort Drones": small mechanical drones in tight formation behind/beside the ship (not the pet) */
function escortPos(k,s){const p=B.p;return {x:p.x+s*(16+k*12),y:p.y+34+k*14+Math.sin(B.t*3+k+s)*1.5};}
function drawEscort(c,x,y,t){const im=spr("drone_escort");if(im){blit(c,im,x,y,22);return;}
  c.save();c.translate(x,y);c.fillStyle="#9aa6b8";c.fillRect(-9,-1.5,18,3);
  c.fillStyle="#f4f7fb";c.strokeStyle="#5b6b82";c.lineWidth=1;c.beginPath();c.ellipse(0,0,6,5,0,0,7);c.fill();c.stroke();
  c.fillStyle="#dfe6ef";c.beginPath();c.arc(-9,0,2.4,0,7);c.arc(9,0,2.4,0,7);c.fill();
  c.globalCompositeOperation="lighter";const g=petGlow("esc",8,[[0,"rgba(120,240,255,.95)"],[.4,"rgba(56,225,255,.5)"],[1,"rgba(56,225,255,0)"]]),a=.7+.3*Math.sin(t*8);c.globalAlpha=a;c.drawImage(g,-8,-9,16,16);
  c.globalCompositeOperation="source-over";c.globalAlpha=1;c.fillStyle="#38e1ff";c.beginPath();c.arc(0,-1,2.2,0,7);c.fill();c.fillStyle="#e8fdff";c.beginPath();c.arc(-.6,-1.6,.8,0,7);c.fill();c.restore();}
{const _du=droneUpdate;droneUpdate=function(dt){_du(dt);if(!B||!B.dp)return;const dd=droneDef(S.drone),col=PET_FX[dd.kind]||dd.col;
  B.dp.forEach((d,i)=>{d.pt=(d.pt||0)-dt;
    // sparkle trail
    const vl=vipLevel();if(vl>=1&&d.pt<=0){d.pt=.09;B.fx.push({x:d.x+rnd(-6,6),y:d.y+14,vx:rnd(-12,12),vy:rnd(30,70),life:.5,max:.5,col:vl>=3?"#ffe6a0":"#fff4dc",r:rnd(1.2,2.2)});}
    // signature burst on each shot (d.f is set to .09 when the pet fires)
    if(d.f>.085&&!d.fxDone){d.fxDone=1;const k=dd.kind;
      if(k==="shot")petSpark(d.x,d.y-20,"#dff4ff",4,140,.25,2.5);
      else if(k==="missile"){petSpark(d.x,d.y-6,"#ffcf8a",6,90,.4,3);petSpark(d.x,d.y-6,"#8a6a50",4,40,.6,4);}
      else if(k==="laser")petSpark(d.x,d.y-22,"#bff6ff",8,200,.22,2);
      else if(k==="flak")petSpark(d.x,d.y-16,"#ffb04a",10,220,.3,2.5);
      else if(k==="medic"){for(let q=0;q<2;q++)B.fx.push({x:d.x+rnd(-10,10),y:d.y-10,vx:rnd(-10,10),vy:-rnd(40,70),life:.7,max:.7,col:"#52f19a",r:4});}
      else if(k==="tesla")petSpark(d.x,d.y-14,"#aad7ff",9,260,.18,1.8);
      else if(k==="phantom")petSpark(d.x,d.y-10,"#c79bff",7,80,.6,3.5);
      else if(k==="solaris")petSpark(d.x,d.y-16,"#ffe28f",8,160,.35,3);
      else petSpark(d.x,d.y-16,col,5,140,.3,2.5);}
    if(d.f<=0)d.fxDone=0;});};}

/* Hangar "Boss" tab (replaces Drones, sample): defeated bosses become cores; one equipped core = summon skill in battle */
const BOSS_SK=[["Ring Barrage","Vòng pháo","Fires a 16-shot ring around your pilot","Bắn vòng 16 viên quanh phi công","◎",14],
 ["Hive Swarm","Đàn ong","Summons 4 mini drones for 10s","Gọi 4 drone nhỏ chiến đấu 10s","✦",18],
 ["Dragon Breath","Hơi thở rồng","A flame fan burns everything ahead for 3s","Quạt lửa thiêu mọi thứ phía trước 3s","♨",16],
 ["Solar Lance","Giáo mặt trời","A sun beam pierces the whole column","Tia mặt trời xuyên cả cột màn hình","☀",16],
 ["Kraken Grip","Vòi Kraken","Tentacles slow all enemy bullets for 4s","Xúc tu làm chậm toàn bộ đạn địch 4s","≋",20],
 ["Void Aegis","Khiên hư không","A void shield blocks 3 hits","Khiên hư không chặn 3 đòn","⬡",22],
 ["Seeker Rain","Mưa truy kích","12 homing seekers hunt the nearest foes","12 quả truy kích tự tìm địch","⇡",15],
 ["Forge Shells","Đạn lò rèn","Shells split into rings on impact","Đạn nổ tách thành vòng khi trúng","✸",15],
 ["Wraith Curtain","Màn bóng ma","Freezes every enemy bullet for 3s","Đóng băng mọi đạn địch 3s","❄",24],
 ["Eclipse Nova","Nhật thực","Screen-wide eclipse blast","Vụ nổ nhật thực toàn màn hình","◐",28]];
let hbSel=null;
function vkBossTab(B){B.className="body hb";$$("#hTabs .tab").forEach(x=>x.classList.toggle("on",x.dataset.ht===htab));navSync();refresh();
  const own=Math.max(3,Math.min(BOSSES.length,S.stats.bosses||0)),eq=S.bossCore??0;if(hbSel===null)hbSel=eq;
  const RAR_=i=>i<3?["R",L("Rare","Hiếm")]:i<6?["E",L("Epic","Sử thi")]:["L",L("Legendary","Huyền thoại")];
  const d=BOSSES[hbSel],k=BOSS_SK[hbSel],have=hbSel<own,lv=have?(S.bossLv?.[hbSel]||1):0,sh=have?(hbSel*7+5)%30:0,r=RAR_(hbSel);
  B.innerHTML=\`<div class="hb-show \${have?"":"lock"}" style="--bc:\${d.col}"><div class="hb-sig"><i></i><i></i><i></i></div>\${sprImg(d.img,"hb-boss")}
     <span class="hb-tag">\${r[1]}</span>\${have&&eq===hbSel?\`<span class="hb-eq">\${L("EQUIPPED","ĐANG DÙNG")}</span>\`:""}
     <div class="hb-nm"><em>\${L("BOSS CORE","LÕI BOSS")}</em><b>\${d.name}</b></div><div class="hb-lv"><small>\${L("LEVEL","CẤP")}</small><b>\${have?lv:"—"}</b></div></div>
   <div class="hb-sk" style="--bc:\${d.col}"><span class="ic"><span>\${k[4]}</span></span><span><small>\${L("Summon skill","Kỹ năng triệu hồi")}</small><b>\${L(k[0],k[1])}</b><p>\${L(k[2],k[3])}</p>
     <span class="cd"><span>⏱ \${k[5]}s</span><span>\${L("Damage","Sát thương")} ×\${(1+lv*.15).toFixed(2)}</span></span></span></div>
   <div class="hb-pas"><span>\${L("Damage to bosses","ST lên boss")} <b>+\${3+hbSel}%</b></span><span>\${L("Max HP","Máu tối đa")} <b>+\${hbSel>4?1:0}</b></span></div>
   <div class="hb-sh" style="--bc:\${d.col}">\${L("Core shards","Mảnh lõi")} \${have?sh:0}/30<i><i style="width:\${have?sh/30*100:0}%"></i></i></div>
   <div class="hb-acts">\${have?\`<button class="a" data-hb="eq" \${eq===hbSel?"disabled":""}>\${eq===hbSel?L("In use","Đang dùng"):L("Equip","Trang bị")}</button>
     <button class="b" data-hb="up" \${sh>=10?"":"disabled"}>\${L("Upgrade","Nâng cấp")}<small>10 \${L("shards","mảnh")}</small></button>\`
     :\`<button class="a" disabled style="grid-column:1/-1">🔒 \${L("Defeat this boss in the campaign to unlock","Hạ boss này trong chiến dịch để mở")}</button>\`}</div>
   <div class="hb-grid">\${BOSSES.map((b,i)=>\`<button class="hb-c \${i<own?"":"lock"} \${i===hbSel?"sel":""}" data-hs="\${i}" style="--bc:\${b.col}">\${sprImg(b.img)}\${i===eq?'<i class="eqd"></i>':""}<b>\${b.name.split(" ")[0]}</b></button>\`).join("")}</div>\`;
  B.querySelectorAll("[data-hs]").forEach(b=>b.onclick=()=>{hbSel=+b.dataset.hs;sfx("tap");renderHangar();});
  B.querySelectorAll("[data-hb]").forEach(b=>b.onclick=()=>{if(b.dataset.hb==="eq"){S.bossCore=hbSel;save();toast(L("Boss core equipped","Đã trang bị lõi boss"));}else toast(L("Upgrade (mockup)","Nâng cấp (mockup)"));renderHangar();});}

/* Home switch arrows: sit in the free gap between the left buttons and the name block, on any screen height */
function vkPlaceArrows(){const mid=$("#home .h6mid"),col=$("#home .h6left"),eq=$("#home .h6eq");if(!mid||!col||!eq||!mid.offsetHeight)return;
  const m=mid.getBoundingClientRect(),top=col.getBoundingClientRect().bottom-m.top,bot=eq.getBoundingClientRect().top-m.top-24;
  const y=Math.max(top+30,Math.min(bot-28,(top+bot)/2));$$("#home .h6mid .h5arr").forEach(a=>{a.style.top=y+"px";});}
addEventListener("resize",vkPlaceArrows);setInterval(()=>{if(cur==="home")vkPlaceArrows();},500);

{const _sp=POPS.spin;POPS.spin=function(a){_sp(a);const h=$("#hub");if(h){const t=h.textContent.trim()||"SPIN";h.dataset.l=S.set.lang==="VI"&&VI[t]?VI[t]:t;}};}

/* Lucky wheel: Valkyrie look (dark glass segments, upright icons, neon rim, diamond bulbs + pointer) */
buildWheelArt=function(){const SG=wheelSegs,n=SG.length,st=Math.PI*2/n,cv=document.createElement("canvas");cv.width=cv.height=600;const c=cv.getContext("2d");c.translate(300,300);
  let ok=true;const PAL=["#ff6fae","#5ee7ff"];
  for(let i=0;i<n;i++){const s=SG[i],a=-Math.PI/2+i*st,acc=s.col2&&s.gear===3?"#ffd36b":PAL[i%2];
    const g=c.createRadialGradient(0,0,50,0,0,250);g.addColorStop(0,"#1a2460");g.addColorStop(.75,i%2?"#0e1a4a":"#1e1040");g.addColorStop(1,mixHex(acc,"#0a1030",.55));
    c.fillStyle=g;c.beginPath();c.moveTo(0,0);c.arc(0,0,248,a-st/2,a+st/2);c.closePath();c.fill();
    // inner accent arc on the rim of each segment
    c.strokeStyle=acc;c.globalAlpha=.85;c.lineWidth=6;c.beginPath();c.arc(0,0,240,a-st/2+.04,a+st/2-.04);c.stroke();c.globalAlpha=1;
    const R=170,x=Math.cos(a)*R,y=Math.sin(a)*R;
    const gi=s.img?spr(s.img):null;if(s.img&&!gi)ok=false;const im=gi||vImg(s.c?"cur_coin":s.g?"cur_gem":s.e?"cur_energy":"cur_bomb");
    c.save();c.translate(x,y);
    c.fillStyle=acc;c.globalAlpha=.18;c.beginPath();c.arc(0,-6,44,0,7);c.fill();c.globalAlpha=1;
    if(im.complete&&im.naturalWidth){const h=s.img?72:58,w=h*im.naturalWidth/im.naturalHeight;c.shadowColor=acc;c.shadowBlur=14;c.drawImage(im,-w/2,-h/2-14,w,h);c.shadowBlur=0;}else ok=false;
    const lb=s.lb?(S.set.lang==="VI"&&VI[s.lb]||s.lb):(s.c?fmt(s.c):s.g?"×"+s.g:s.e?"×"+s.e:"×"+(s.n||1));
    c.font=\`italic 800 \${lb.length>4?24:28}px 'Saira Condensed','Exo 2',sans-serif\`;c.textAlign="center";c.lineWidth=6;c.strokeStyle="#0a1030";c.fillStyle="#fff";
    c.strokeText(lb,0,40);c.fillText(lb,0,40);c.restore();}
  c.strokeStyle="#cfeeff";c.globalAlpha=.55;c.lineWidth=2;for(let i=0;i<n;i++){const a=-Math.PI/2+(i+.5)*st;c.beginPath();c.moveTo(Math.cos(a)*64,Math.sin(a)*64);c.lineTo(Math.cos(a)*246,Math.sin(a)*246);c.stroke();}
  c.globalAlpha=1;wheelArt=cv;wheelArtOk=ok;wheelArtFor=SG;};
drawWheel=function(c,now){const n=wheelSegs.length,st=Math.PI*2/n,spinning=!!spinAnim;
  c.setTransform(1,0,0,1,0,0);c.clearRect(0,0,600,600);c.translate(300,300);
  // outer ring: dark glass with a pink/cyan neon edge
  c.fillStyle="#070b22";c.beginPath();c.arc(0,0,290,0,7);c.fill();
  let g=c.createLinearGradient(-290,-290,290,290);g.addColorStop(0,"#ff6fae");g.addColorStop(.5,"#cfeeff");g.addColorStop(1,"#5ee7ff");
  c.strokeStyle=g;c.lineWidth=4;c.shadowColor="#ff6fae";c.shadowBlur=18;c.beginPath();c.arc(0,0,286,0,7);c.stroke();c.shadowBlur=0;
  c.strokeStyle="#cfeeff55";c.lineWidth=1.5;c.beginPath();c.arc(0,0,256,0,7);c.stroke();
  c.save();c.rotate(spinRot);c.drawImage(wheelArt,-300,-300);c.restore();
  if(spinAnim&&spinAnim.done){const a=-Math.PI/2;c.fillStyle=\`rgba(255,111,174,\${.22+.18*Math.sin(now/80)})\`;c.beginPath();c.moveTo(0,0);c.arc(0,0,248,a-st/2,a+st/2);c.closePath();c.fill();}
  // diamond bulbs
  const Bn=24,ph=spinning?Math.floor(now/70):Math.floor(now/600);
  for(let i=0;i<Bn;i++){const a=i/Bn*Math.PI*2,on=(i+ph)%3===0;c.save();c.translate(Math.cos(a)*271,Math.sin(a)*271);c.rotate(a+Math.PI/4);
    c.fillStyle=on?(i%2?"#ff6fae":"#5ee7ff"):"#2a3468";c.shadowColor=c.fillStyle;c.shadowBlur=on?14:0;c.fillRect(-5,-5,10,10);c.restore();}
  c.shadowBlur=0;
  // pointer: pink diamond arrow
  const kick=spinAnim?spinAnim.kick:0;c.save();c.translate(0,-280);c.rotate(-kick*.5);
  g=c.createLinearGradient(0,-28,0,44);g.addColorStop(0,"#ffd0e4");g.addColorStop(1,"#c2307a");c.fillStyle=g;c.strokeStyle="#0a1030";c.lineWidth=4;c.shadowColor="#ff6fae";c.shadowBlur=16;
  c.beginPath();c.moveTo(0,-30);c.lineTo(20,-8);c.lineTo(0,44);c.lineTo(-20,-8);c.closePath();c.fill();c.shadowBlur=0;c.stroke();
  c.fillStyle="#fff";c.beginPath();c.arc(0,-8,5,0,7);c.fill();c.restore();};

/* Campaign: chapter banner + 10-stage grid instead of the long scrolling map */
let vcW=null;
{const _rm2=renderMap;renderMap=function(){_rm2();const MB=$("#mapBody");MB.classList.add("vc-on");
  const arr=S.stars[S.diff],un=unlockedIdx(S.diff),maxW=WORLDS.length-1,curW=Math.min(maxW,Math.floor(un/LV_PER_WORLD));
  if(vcW===null||vcW>maxW)vcW=curW;const w=WORLDS[vcW],w0=vcW*LV_PER_WORLD,locked=w0>un;
  const stars=arr.slice(w0,w0+LV_PER_WORLD).reduce((a,b)=>a+(b||0),0),CHG=["kestrel","nebula","viper","oblivion"],gid=CHG[vcW%4];
  const art=SPR_HAS("chapter_"+(vcW+1)),girl=!art&&typeof GIRL_SRC!=="undefined"&&GIRL_SRC[gid],bg=art?\`background-image:url(\${SPR_SRC["chapter_"+(vcW+1)]});background-position:right center\`:SPR_HAS("bg_world"+(vcW+1))?\`background-image:url(\${SPR_SRC["bg_world"+(vcW+1)]})\`:"";
  const tiles=Array.from({length:LV_PER_WORLD},(_,j)=>{const i=w0+j,st=arr[i]||0,boss=isBoss(i),state=st?"done":i===un?"cur":i<un?"done":"lock",bd=boss?BOSSES[bossFor("stage",i,0,S.diff)]:null;
    return \`<button class="vcs \${state} \${boss?"boss":""}" data-i="\${i}" style="animation-delay:\${j*.03}s">\${boss?\`\${sprImg(bd.img)}<span class="tg">BOSS</span>\`:\`<span class="d"><b>\${j+1}</b></span>\`}
      <span class="sr">\${[1,2,3].map(k=>\`<i class="\${k<=st?"on":""}">★</i>\`).join("")}</span></button>\`;}).join("");
  const nextI=Math.min(un,w0+LV_PER_WORLD-1);
  MB.innerHTML=\`<div class="vch" style="\${bg}">\${girl?\`<img class="girl" src="\${girl}" alt="">\`:""}
     <div class="tx"><span class="no">\${L("CHAPTER","CHƯƠNG")} \${vcW+1}</span><span class="nm">\${w.name}</span><span class="st">★ \${stars}/30<i><i style="width:\${stars/30*100}%"></i></i></span></div>
     <div class="dots">\${WORLDS.map((_,k)=>\`<i class="\${k===vcW?"on":""}"></i>\`).join("")}</div>
     \${locked?\`<div class="lk">🔒 \${L("Clear chapter","Hoàn thành chương")} \${vcW}</div>\`:""}
     <button class="ar l" data-cw="-1" \${vcW?"":"disabled"} aria-label="Previous chapter"></button><button class="ar r" data-cw="1" \${vcW<maxW?"":"disabled"} aria-label="Next chapter"></button></div>
    <div class="vcg">\${tiles}</div>
    \${locked?"":\`<button class="vcgo" data-i="\${nextI}">▶ \${L("SORTIE","XUẤT KÍCH")} \${lvName(nextI)}<small><i class="ic-nrg"></i>\${ENERGY_COST}</small></button>\`}\`;
  MB.querySelectorAll("[data-cw]").forEach(b=>b.onclick=()=>{vcW=Math.max(0,Math.min(maxW,vcW+ +b.dataset.cw));sfx("tap");renderMap();});
  MB.querySelectorAll("[data-i]").forEach(n=>n.onclick=()=>{const i=+n.dataset.i;if(i>un)return toast(L("Clear the previous stage first","Hãy qua màn trước"));levelPop(i,S.diff);});
  let x0=null;const ch=MB.querySelector(".vch");ch.onpointerdown=e=>{if(!e.target.closest("button"))x0=e.clientX;};ch.onpointerup=e=>{if(x0===null)return;const dx=e.clientX-x0;x0=null;if(Math.abs(dx)>40){vcW=Math.max(0,Math.min(maxW,vcW+(dx<0?1:-1)));renderMap();}};};
RENDER.map=renderMap;}

/* Campaign map: pilot face marker instead of the ship, translated title */
{const _rm=renderMap;renderMap=function(){_rm();$("#map .hdr h2").textContent=L("Campaign","Chiến dịch");
  const b=typeof GIRL_BUST!=="undefined"&&(GIRL_BUST[S.ship]||GIRL_BUST.kestrel),m=$("#mapBody .mship");if(m&&b){m.src=b;m.classList.add("vmgirl");}};
RENDER.map=renderMap;}

/* Leaderboard redesign: podium (top 3) + scrolling list + pinned own row */
renderRank=function(){if(SPR_HAS("bg_home"))$("#rank").style.setProperty("--shopbg",\`url(\${SPR_SRC.bg_home})\`);
  $("#rank .hdr h2").textContent=L("Leaderboard","Xếp hạng");
  $$("#rTabs .tab").forEach(t=>{t.classList.toggle("on",t.dataset.rt===rtab);t.textContent={endless:L("Endless","Vô tận"),stars:L("Stars","Sao"),event:L("Event","Sự kiện")}[t.dataset.rt];});
  const base={endless:160000,stars:90,event:42000}[rtab],mine={endless:S.bestEndless,stars:totalStars(),event:S.eventBest}[rtab];
  let rows=NAMES.map((n,i)=>({n,v:Math.round(base*Math.pow(.82,i)),me:false}));rows.push({n:"Pilot_4821",v:mine,me:true});rows.sort((a,b)=>b.v-a.v);
  const ids=SHIPS.map(s=>s.id),bust=(r,i)=>{const id=r.me?S.ship:ids[(r.n.charCodeAt(0)+i)%ids.length],b=typeof GIRL_BUST!=="undefined"&&GIRL_BUST[id];return b?\`background-image:url(\${b})\`:"";};
  const val=v=>fmt(v)+(rtab==="stars"?" ★":""),prize=[300,150,80],PC=["#ffd36b","#dfe8ff","#ff9d5c"];
  const pod=[1,0,2].map(i=>{const r=rows[i];return \`<div class="vr-p p\${i+1}" style="--pc:\${PC[i]}"><span class="crown">\${i===0?"♛":"◆"}</span><span class="av" style="\${bust(r,i)}"></span>
    <div class="bl"><div class="rk">\${i+1}</div><span class="nm">\${r.n}</span><span class="sc">\${val(r.v)}</span>\${rtab!=="stars"?\`<div class="gm"><i class="ic-gem"></i>\${prize[i]}</div>\`:""}</div></div>\`;}).join("");
  const meI=rows.findIndex(r=>r.me),me=rows[meI];
  const row=(r,i)=>\`<div class="vr-r"><span class="rk">\${i+1}</span><span class="av" style="\${bust(r,i)}"></span><span class="nm">\${r.n}</span><b class="sc">\${val(r.v)}</b></div>\`;
  $("#rankBody").innerHTML=\`<div class="vr-meta"><span>\${rtab==="stars"?L("All time","Mọi thời điểm"):L("Week 43 · ends in 3d 6h","Tuần 43 · còn 3n 6g")}</span><span>\${rtab==="stars"?"":L("Top 3 win <b>gems</b>","Top 3 nhận <b>gem</b>")}</span></div>
    <div class="vr-pod">\${pod}</div>
    <div class="vr-list">\${rows.map((r,i)=>i<3||r.me?"":row(r,i)).join("")}</div>
    <div class="vr-r vr-me"><span class="rk">\${meI+1}</span><span class="av" style="\${bust(me,meI)}"></span><span class="nm">\${L("You","Bạn")}<small>\${meI>0?L(\`\${fmt(rows[meI-1].v-me.v+1)} to rank \${meI}\`,\`Cần thêm \${fmt(rows[meI-1].v-me.v+1)} để lên hạng \${meI}\`):L("You are #1!","Bạn đang dẫn đầu!")}</small></span><b class="sc">\${val(me.v)}</b></div>\`;};
RENDER.rank=renderRank;

/* Level-up: add the pilot cut-in and switch to the tall-card layout */
{const _lu=levelUp;levelUp=function(){const el0=$("#lvup"),keep=!el0.hidden&&el0.classList.contains("vl")?el0.querySelector(".lvhead"):null;
  _lu();const el=$("#lvup"),hd=el.querySelector(".lvhead");el.classList.add("vl");
  if(keep){keep.classList.add("vl-still");hd.replaceWith(keep);return;}  /* reroll: only the cards change */
  const b=typeof GIRL_BUST!=="undefined"&&(GIRL_BUST[S.ship]||GIRL_BUST.kestrel),G=GIRL[S.ship]||{name:""};
  const lines=[["Power up! Pick one, Commander!","Lên cấp rồi! Chọn đi chỉ huy!"],["I can feel it… choose wisely!","Mạnh hơn rồi… chọn kỹ nhé!"],["Upgrade time!","Đến giờ nâng cấp!"]],ln=lines[B.lv%lines.length];
  hd.innerHTML=\`<div class="vl-tt">\${hd.innerHTML}<div class="vl-say">\${L(ln[0],ln[1])}</div></div>\`;};}

/* ULT icons: give Black Hole and Time Freeze their own icon keys */
Object.assign(ULTS.kestrel,{icon:"ult_overdrive"});ULTS.viper.icon="ult_laser";ULTS.raptor.icon="ult_swarm";ULTS.halo.icon="ult_orbit";ULTS.tempest.icon="ult_storm";ULTS.seraph.icon="ult_flare";ULTS.nebula.icon="ult_blackhole";ULTS.oblivion.icon="ult_freeze";

/* Profile redesign: commander card + ace pilot art, highlights, record, worlds, squad; one screen */
renderProfile=function(){if(SPR_HAS("bg_home"))$("#profile").style.setProperty("--shopbg",\`url(\${SPR_SRC.bg_home})\`);
  $("#profile .hdr h2").textContent=L("Profile","Hồ sơ");
  const lv=playerLv(),need=Math.pow(lv,2)*120,prev=Math.pow(lv-1,2)*120,pct=Math.max(0,Math.min(1,(S.xp-prev)/(need-prev)));
  const stars=totalStars(),maxStars=WORLDS.length*LV_PER_WORLD*3,owned=Object.keys(S.ships).length,nextRank=RANKS.find(r=>r[0]>lv);
  const RC={C:"#9fdcff",R:"#52f19a",E:"#c39bff",L:"#ffd36b"},d=shipDef(S.ship),G=GIRL[d.id]||{name:d.name},girl=typeof GIRL_BUST!=="undefined"&&GIRL_BUST[d.id];
  const rec=[["campaign",L("Stages played","Màn đã chơi"),S.stats.played],["sk_damage",L("Enemies destroyed","Địch đã hạ"),S.stats.kills],["boss",L("Bosses defeated","Boss đã hạ"),S.stats.bosses],["coin",L("Coins earned","Vàng kiếm được"),S.stats.coinsEarned]];
  const ri=k=>k==="boss"?sprImg("boss1"):k==="coin"?'<i class="ic-coin" style="width:24px;height:24px;display:block"></i>':vIcon(k,"",false);
  $("#profBody").innerHTML=\`
   <div class="vp-hero vp-cut" style="--hc:\${RC[d.rar]}">\${girl?\`<img class="art" src="\${girl}" alt="">\`:""}
    <div class="vp-id"><span class="vp-rank">\${vIcon("rank","",false)}\${rankOf(lv)}\${S.vip?" · VIP":""}</span>
     <div class="vp-name">Pilot_4821</div><div class="vp-pid">ID \${pid()}</div>
     <div class="vp-lv"><b><span>\${lv}</span></b><span><small>\${fmt(S.xp-prev)} / \${fmt(need-prev)} XP\${nextRank?\` · \${nextRank[1]} Lv \${nextRank[0]}\`:""}</small><i><i style="width:\${pct*100}%"></i></i></span></div></div>
    <div class="vp-ace"><small>\${L("ACE PILOT","PHI CÔNG CHỦ LỰC")}</small><b>\${G.name} · \${fmt(shipPow(S.ship)+gearPower())}</b></div></div>
   <div class="vp-hi">
    <div class="vp-cut"><span class="ic">★</span><b>\${stars}</b><small>/ \${maxStars} \${L("stars","sao")}</small></div>
    <div class="vp-cut"><span class="ic">\${vIcon("sk_crit","",false)}</span><b>\${fmt(S.bestEndless)}</b><small>\${L("best Endless","kỷ lục Vô tận")}</small></div>
    <div class="vp-cut"><span class="ic">\${vIcon("hangar","",false)}</span><b>\${owned}/\${SHIPS.length}</b><small>\${L("pilots","phi công")}</small></div>
    <div class="vp-cut"><span class="ic">\${vIcon("rank","",false)}</span><b>\${fmt(achDone())}</b><small>\${L("achievements","thành tựu")}</small></div></div>
   <div class="vp-sec">\${L("Combat record","Thành tích")}</div>
   <div class="vp-rec">\${rec.map(([k,l,v])=>\`<div>\${ri(k)}<span><b>\${fmt(v)}</b><small>\${l}</small></span></div>\`).join("")}</div>
   <div class="vp-sec">\${L("Campaign","Chiến dịch")}</div>
   <div class="vp-w">\${WORLDS.map((w,wi)=>{const st=S.stars.normal.slice(wi*10,wi*10+10).reduce((a,b)=>a+(b||0),0),bg=SPR_HAS("bg_world"+(wi+1))?\`background-image:url(\${SPR_SRC["bg_world"+(wi+1)]})\`:"";
      return \`<div class="vp-cut" style="\${bg}"><b>\${w.name}</b><span><i><i style="width:\${st/30*100}%"></i></i>\${st}/30 ★</span></div>\`;}).join("")}</div>
   <div class="vp-sec">\${L("Squad","Đội hình")}<small>\${owned}/\${SHIPS.length}</small></div>
   <div class="vp-sq">\${SHIPS.map(s=>{const o=S.ships[s.id],b=typeof GIRL_BUST!=="undefined"&&GIRL_BUST[s.id];
      return \`<button class="vp-c \${o?"":"lock"} \${S.ship===s.id?"use":""}" data-go="hangar" style="--rc:\${RC[s.rar]};\${b?\`background-image:url(\${b})\`:""}">\${S.ship===s.id?'<i class="eqd"></i>':""}<b>\${(GIRL[s.id]||s).name}<small>\${o?\`Lv \${o.lv} · \${"★".repeat(o.star)}\`:RAR[s.rar]}</small></b></button>\`;}).join("")}</div>\`;
  $$("#profBody .vp-c").forEach(b=>b.addEventListener("click",()=>{hSel=SHIPS[[...b.parentNode.children].indexOf(b)].id;htab="ships";}));};
const achDone=()=>ACH_DEF.filter(a=>S.achClaim[a.id]).length;
RENDER.profile=renderProfile;

/* Settings: regroup the original sections into 4 one-screen tabs (same controls and handlers) */
let vstTab="sound";
{const _rs=renderSettings;renderSettings=function(){_rs();const B=$("#setBody");if(SPR_HAS("bg_home"))$("#settings").style.setProperty("--shopbg",\`url(\${SPR_SRC.bg_home})\`);
  $("#settings .hdr h2").textContent=L("Settings","Cài đặt");
  const T=[["sound",L("Sound","Âm thanh"),[0]],["ctrl",L("Controls","Điều khiển"),[1]],["disp",L("Display","Hiển thị"),[2]],["acct",L("Account","Tài khoản"),[3,4,5]]];
  const secs=[...B.querySelectorAll(".sec-t")],ver=B.querySelector(":scope>p");
  const tr={Sound:["Âm thanh"],Controls:["Điều khiển"],Display:["Hiển thị"],Account:["Tài khoản"],About:["Thông tin"],"Test tools":["Công cụ test"]};
  const bar=document.createElement("div");bar.className="vst-tabs";bar.innerHTML=T.map(([k,n])=>\`<button class="\${k===vstTab?"on":""}" data-vst="\${k}">\${n}</button>\`).join("");
  const pages=T.map(([k,,ix])=>{const pg=document.createElement("div");pg.className="vst-pg"+(k===vstTab?" on":"");
    ix.forEach(i=>{const h=secs[i];if(!h)return;const c=h.nextElementSibling;if(tr[h.textContent])h.textContent=L(h.textContent,tr[h.textContent][0]);
      if(i===5){const w=document.createElement("div");w.className="vst-tools";w.append(h,c);pg.append(w);}else pg.append(h,c);});return pg;});
  B.prepend(bar);pages.forEach(pg=>B.append(pg));if(ver){ver.className="vst-ver";ver.removeAttribute("style");ver.textContent="Nova Valkyrie \u00b7 v"+APP_VER;B.append(ver);}
  if(typeof SET_ART!=="undefined"){const K=["music","sfx","vib","sens","lefty","hint","gfx","motion","fps","lang"];B.querySelectorAll(".sic").forEach((e,i)=>{if(SET_ART[K[i]])e.innerHTML=\`<img src="\${SET_ART[K[i]]}" alt="">\`;});}
  bar.querySelectorAll("[data-vst]").forEach(b=>b.onclick=()=>{vstTab=b.dataset.vst;sfx("tap");renderSettings();});};
RENDER.settings=renderSettings;}

/* Quests redesign: chest track + compact rows, claimable first, one screen */
renderMissions=function(){const isD=qtab==="daily",defs=isD?QUEST_DEF:ACH_DEF;if(SPR_HAS("bg_home"))$("#missions").style.setProperty("--shopbg",\`url(\${SPR_SRC.bg_home})\`);
  $("#missions .hdr h2").textContent=L("Quests","Nhiệm vụ");
  const qt=$$("#qTabs .tab");qt.forEach(t=>t.classList.toggle("on",t.dataset.qt===qtab));
  const val=q=>Math.min(q.goal,isD?(S.q[q.id]||0):achVal(q.id)),clm=q=>isD?S.qClaim[q.id]:S.achClaim[q.id];
  const canD=QUEST_DEF.some(q=>!S.qClaim[q.id]&&(S.q[q.id]||0)>=q.goal),canA=ACH_DEF.some(q=>!S.achClaim[q.id]&&achVal(q.id)>=q.goal);
  qt.forEach(t=>{t.querySelector(".dot")?.remove();if(t.dataset.qt==="daily"?canD:canA)t.insertAdjacentHTML("beforeend",'<i class="dot"></i>');});
  qt[0]&&(qt[0].firstChild.textContent=L("Daily","Hằng ngày"));qt[1]&&(qt[1].firstChild.textContent=L("Achievements","Thành tựu"));
  const done=QUEST_DEF.filter(q=>S.qClaim[q.id]).length,chestOk=done>=4&&!S.qClaim.chest;
  const ms=86400000-Date.now()%86400000;
  const rank=q=>{const ok=val(q)>=q.goal,c=clm(q);return c?2:ok?0:1;};
  const list=[...defs].sort((a,b)=>rank(a)-rank(b));
  const row=q=>{const v=val(q),ok=v>=q.goal,c=clm(q),k=q.rw.g!==undefined?"g":"c";
    return \`<div class="vq-row \${c?"cl":ok?"ok":""}"><span class="vq-rw"><i class="\${rewardIcon(q.rw)}"></i>\${fmt(q.rw.g||q.rw.c||0)}</span>
      <span class="vq-mid"><b>\${q.t}</b><span class="vq-bar"><i><i style="width:\${v/q.goal*100}%"></i></i><span>\${fmt(v)}/\${fmt(q.goal)}</span></span></span>
      <button class="vq-btn \${c?"done":ok?"claim":""}" data-q="\${q.id}" \${c?"disabled":""}>\${c?"✓":ok?L("Claim","Nhận"):L("Go","Đi")}</button></div>\`;};
  $("#missionBody").innerHTML=(isD?\`<div class="vq-chest \${chestOk?"ready":""}">\${SPR_HAS("crate_epic")?\`<img src="\${SPR_SRC.crate_epic}" alt="">\`:""}
      <span class="vq-cm"><b>\${L("Daily chest","Rương ngày")}</b><small>\${L("Finish 4 quests · 1,500 coins + 30 gems","Xong 4 nhiệm vụ · 1.500 vàng + 30 gem")}</small>
        <span class="vq-pips">\${QUEST_DEF.map((_,i)=>\`<i class="\${i<done?"on":""} \${i===3?"goal":""}"></i>\`).join("")}</span>
        <small>\${done}/\${QUEST_DEF.length} · \${L("resets in","làm mới sau")} \${Math.floor(ms/36e5)}h \${Math.floor(ms/6e4)%60}m</small></span>
      <button class="vq-btn \${S.qClaim.chest?"done":chestOk?"claim":""}" id="qChest" \${chestOk?"":"disabled"}>\${S.qClaim.chest?"✓":chestOk?L("Open","Mở"):\`\${Math.min(done,4)}/4\`}</button></div>\`:"")
    +\`<div class="vq-list">\${list.map(row).join("")}</div>\`;
  $$("#missionBody [data-q]").forEach(b=>b.onclick=()=>{const q=defs.find(x=>x.id===b.dataset.q),v=isD?(S.q[q.id]||0):achVal(q.id);
    if(v<q.goal){go(q.id==="spin1"?"home":q.id==="up1"?"hangar":"map");if(q.id==="spin1")POPS.spin();return;}
    (isD?S.qClaim:S.achClaim)[q.id]=1;give(q.rw);sfx("coin");toast("+"+rwText(q.rw));renderMissions();});
  $("#qChest")&&($("#qChest").onclick=()=>{if(!chestOk)return;S.qClaim.chest=1;claimPop(L("Daily chest","Rương ngày"),[{c:1500},{g:30}],renderMissions);});refresh();};
RENDER.missions=renderMissions;

/* post-process the other hangar tabs: one screen, anime art */
let vkSkCat="active";
function vkHangarPost(B){B.classList.add("hz","hz-"+htab);
  /* gear tab keeps the ship (battle form) in the middle: gear is ship equipment */
  if(htab==="skills"){const cats=B.querySelectorAll(".skcat"),grids=B.querySelectorAll(".skgrid");
    const lab={active:L("Active","Chủ động"),offense:L("Attack","Tấn công"),defense:L("Defense","Phòng thủ"),utility:L("Utility","Tiện ích")};
    const can=c=>SKILLS.some(s=>s.cat===c&&skLv(s.id)<s.max&&S.coins>=skCost(s));
    const bar=document.createElement("div");bar.className="vk-sub";
    bar.innerHTML=SKCATS.map(([c])=>\`<button class="\${c===vkSkCat?"on":""}" data-skc="\${c}">\${lab[c]||c}\${can(c)?"<i></i>":""}</button>\`).join("");
    B.prepend(bar);SKCATS.forEach(([c],i)=>{if(grids[i])grids[i].classList.toggle("show",c===vkSkCat);});
    const i=SKCATS.findIndex(([c])=>c===vkSkCat),cap=document.createElement("div");cap.className="vk-cap";cap.innerHTML=cats[i]?cats[i].innerHTML.replace(/<small>(.*?)<\\/small>/,"<b> · $1</b>"):"";bar.after(cap);
    bar.querySelectorAll("[data-skc]").forEach(x=>x.onclick=()=>{vkSkCat=x.dataset.skc;sfx("tap");renderHangar();});}
  if(htab==="pilots"){B.querySelectorAll(".card.row").forEach((c,i)=>c.style.setProperty("--pc",PILOTS[i]?PILOTS[i].col:"#5ee7ff"));
    const p=B.querySelector("p");if(p)p.textContent=L("Support officers give a passive bonus to every run.","Sĩ quan hỗ trợ cho bonus bị động ở mọi trận.");}}

/* Hangar "Ships" tab -> Valkyrie character page (one screen, swipe / arrows / roster) */
{const _rh=renderHangar;
renderHangar=function(){const B=$("#hangarBody");if(SPR_HAS("bg_home"))$("#hangar").style.setProperty("--shopbg",\`url(\${SPR_SRC.bg_home})\`);
  const t=$('#hTabs [data-ht="ships"]');if(t)t.textContent=L("Valkyries","Phi công");const tp=$('#hTabs [data-ht="pilots"]');if(tp)tp.textContent=L("Support","Hỗ trợ");if(!$('#hTabs [data-ht="boss"]')){const nb=document.createElement("button");nb.className="tab";nb.dataset.ht="boss";nb.textContent="Boss";
    nb.onclick=()=>{htab="boss";renderHangar();};$('#hTabs [data-ht="pilots"]').before(nb);}
  /* Gear lives only behind the bottom-nav button: hide its hangar tab, and show the gear screen without the hangar tabs */
  $("#hangar .hdr h2").textContent=L("Hangar","Xưởng");
  B.classList.toggle("hv-on",htab==="ships");B.className=B.className.replace(/\\bhz(-\\w+)?\\b/g,"").trim();if(htab==="boss"){vkBossTab(B);return;}if(htab!=="ships"){_rh();vkHangarPost(B);return;}
  $$("#hTabs .tab").forEach(x=>x.classList.toggle("on",x.dataset.ht===htab));navSync();refresh();
  hSel=hSel||S.ship;const d=shipDef(hSel),o=S.ships[d.id],own=!!o,lv=o?o.lv:1,star=o?o.star:1,cap=10*star,max=lv>=cap,pow=shipPow(d.id)+gearPower();
  const nextPow=own&&!max?Math.round(d.pow*(1+0.12*lv)*(1+0.25*(star-1))):0,G=GIRL[d.id]||{name:d.name};
  const RC={C:"#9fdcff",R:"#52f19a",E:"#c39bff",L:"#ffd36b"},hc=RC[d.rar],girl=typeof GIRL_SRC!=="undefined"&&GIRL_SRC[d.id];
  const ship=SPR_HAS("ship_"+d.id)?SPR_SRC["ship_"+d.id]:"";
  const act=!own?\`<button class="buy wide" data-a="buy">\${L("Unlock","Mở khoá")}<small>\${priceTxt(d.price)}</small></button>\`:
    \`\${S.ship===d.id?\`<button class="eq" disabled>\${L("In squad","Đang dùng")}</button>\`:\`<button class="eq" data-a="eq">\${L("Deploy","Xuất trận")}</button>\`}
     \${max?(star<5?\`<button class="ev" data-a="evo">\${L("Evolve","Tiến hoá")} ★\${star+1}<small><i class="ic-gem"></i>\${star*80}</small></button>\`:\`<button class="eq" disabled>MAX</button>\`)
       :\`<button class="up" data-a="up">\${L("Upgrade","Nâng cấp")}<small><i class="ic-coin"></i>\${fmt(upCost(lv))}</small></button>\`}\`;
  B.innerHTML=\`<div class="hv" style="--hc:\${hc}">
    <div class="hv-stage">\${girl?\`<img class="hv-girl" src="\${girl}" alt="\${G.name}" draggable="false">\`:\`\${ship?\`<img class="hv-ship" src="\${ship}" alt="" draggable="false">\`:""}<span class="hv-soon">\${L("ARTWORK COMING SOON","SẮP CÓ ẢNH NHÂN VẬT")}</span>\`}
      <div class="hv-name"><span class="rt">\${RAR[d.rar]}</span><em>\${d.name.toUpperCase()}</em><b>\${G.name}</b><i>\${[1,2,3,4,5].map(k=>k<=star?"★":"<s>★</s>").join("")}</i></div>
      <div class="hv-pow"><small>\${L("POWER","LỰC CHIẾN")}</small><b class="num">\${fmt(pow)}</b>\${nextPow?\`<em>▲ \${fmt(nextPow)}</em>\`:""}</div>
      \${girl&&ship?\`<div class="hv-form"><img src="\${ship}" alt=""><span>\${L("BATTLE FORM","DẠNG CHIẾN")}</span></div>\`:""}
      </div>
    <div class="hv-ult">\${vIcon(ULTS[d.id].icon,"",false)}<span><small>\${L("Signature skill","Tuyệt chiêu")}</small><b>\${ULTS[d.id].name}</b><span>\${ULTS[d.id].desc}</span></span></div>
    <div class="hv-stats"><span><small>\${L("Fire rate","Tốc bắn")}</small><b>\${d.rate}/s</b></span><span><small>\${L("Hull","Giáp")}</small><b>\${d.hp+star-1} HP</b></span><span><small>\${L("Weapon","Vũ khí")}</small><b>\${L(d.wpn,VI[d.wpn]||d.wpn)}</b></span></div>
    \${own?\`<div class="hv-lv">Lv \${lv}/\${cap}<i><i style="width:\${lv/cap*100}%"></i></i></div>\`:""}
    <div class="hv-acts">\${act}</div>
    <div class="hv-rrow"><button class="hv-arr l" data-nav="-1" aria-label="Previous"></button><div class="hv-roster">\${SHIPS.map(s=>{const ow=!!S.ships[s.id],b=typeof GIRL_BUST!=="undefined"&&GIRL_BUST[s.id];
      return \`<button class="hv-c \${s.id===hSel?"sel":""} \${ow?"":"lock"}" data-s="\${s.id}" style="--rc:\${RC[s.rar]};\${b?\`background-image:url(\${b})\`:""}">\${b?"":(SPR_HAS("ship_"+s.id)?\`<img src="\${SPR_SRC["ship_"+s.id]}" alt="">\`:"")}\${S.ship===s.id?'<i class="eqd"></i>':""}<b>\${(GIRL[s.id]||s).name}</b></button>\`;}).join("")}</div><button class="hv-arr r" data-nav="1" aria-label="Next"></button></div>
  </div>\`;
  const rs=$("#hangarBody .hv-roster"),sel=rs.querySelector(".sel");if(sel)rs.scrollLeft=sel.offsetLeft-rs.clientWidth/2+sel.offsetWidth/2;
  const goTo=i=>{i=(i+SHIPS.length)%SHIPS.length;hSel=SHIPS[i].id;sfx("tap");renderHangar();},idx=SHIPS.findIndex(x=>x.id===hSel);
  $$("#hangarBody [data-nav]").forEach(b=>b.onclick=()=>goTo(idx+ +b.dataset.nav));
  $$("#hangarBody .hv-c").forEach(b=>b.onclick=()=>{hSel=b.dataset.s;sfx("tap");renderHangar();});
  const st=$("#hangarBody .hv-stage");let x0=null;st.onpointerdown=e=>{if(!e.target.closest("button"))x0=e.clientX;};
  st.onpointerup=e=>{if(x0===null)return;const dx=e.clientX-x0;x0=null;if(Math.abs(dx)>40)goTo(idx+(dx<0?1:-1));};
  $$("#hangarBody [data-a]").forEach(b=>b.onclick=()=>{const a=b.dataset.a,id=d.id;
    if(a==="buy"){if(spend(d.price)){S.ships[id]={lv:1,star:1};save();sfx("up");claimFx(\`\${G.name} \${L("joined your squad!","đã gia nhập đội!")}\`);renderHangar();}}
    else if(a==="eq"){S.ship=id;save();toast(G.name+L(" deployed"," xuất trận"));renderHangar();}
    else if(a==="up"){if(spend({coin:upCost(o.lv)})){o.lv++;qAdd("up1",1);save();sfx("up");renderHangar();const el=$("#hangarBody .hv-pow b");el&&el.animate([{transform:"scale(1.35)",color:"#ffc83d"},{transform:"scale(1)"}],{duration:450});}}
    else if(a==="evo"){if(spend({gem:o.star*80})){o.star++;save();sfx("up");claimFx(\`\${G.name} ★\${o.star}\`);renderHangar();}}});};
RENDER.hangar=renderHangar;}

/* Shop redesign: same purchase logic, Valkyrie layout, 3 tabs */
let vsTab="offers";
renderShop=function(){refresh();const B=$("#shopBody");if(SPR_HAS("bg_home"))$("#shop").style.setProperty("--shopbg",\`url(\${SPR_SRC.bg_home})\`);
  const bust=k=>typeof GIRL_BUST!=="undefined"&&GIRL_BUST[k]?\`<img class="art" src="\${GIRL_BUST[k]}" alt="">\`:"";
  const tabs=[["offers",L("Offers","Ưu đãi")],["gems",L("Gems","Kim cương")],["spin",L("Spins","Vòng quay")]];
  let h=\`<div class="vs-tabs">\${tabs.map(([k,t])=>\`<button class="vs-tab \${vsTab===k?"on":""}" data-vt="\${k}">\${t}\${k==="offers"&&!S.starter?'<i class="dot"></i>':""}</button>\`).join("")}</div>\`;
  h+=\`<div class="vs-page p-\${vsTab}">\`;
  if(vsTab==="offers"){
    h+=\`<button class="vs-ban gold vs-cut" data-vo="seraph">\${bust("seraph")}<span class="tg">−50%</span><span class="txt"><span class="s">\${L("Legendary bundle","Gói huyền thoại")}</span><span class="t">SERAPHINA</span>
        <span class="its"><span><i class="ic-gem"></i>800</span><span><i class="ic-coin"></i>20K</span></span><span class="vs-price">\${S.ships.seraph?L("Owned","Đã có"):\`<s>$29.99</s>\${priceOf("nv_seraph","$14.99")}\`}</span></span></button>\`;
    if(!S.starter)h+=\`<button class="vs-ban cyan vs-cut" id="buyStarter">\${bust("kestrel")}<span class="tg">−80%</span><span class="txt"><span class="s">\${L("First purchase · one time","Nạp lần đầu · 1 lần")}</span><span class="t">\${L("STARTER PACK","GÓI KHỞI ĐẦU")}</span>
        <span class="its"><span><i class="ic-gem"></i>500</span><span><i class="ic-coin"></i>10K</span><span>\${vIcon("power","",false)}×5</span></span><span class="vs-price"><s>$9.99</s>\${priceOf("nv_starter","$1.99")}</span></span></button>\`;
    h+=\`<div class="vs-sec">\${L("Daily deals","Ưu đãi hôm nay")}<small>\${L("resets 00:00","làm mới 00:00")}</small></div><div class="vs-grid">
      <button class="vs-tile vs-cut" data-free="ad"><span class="ico"><i class="ic-gem" style="width:34px;height:34px"></i></span><span class="q">+10</span><span class="pb ad">▶ \${L("Free","Miễn phí")}</span></button>
      <button class="vs-tile vs-cut" data-boost="shield"><span class="ico">\${vIcon("shield","",false)}</span><span class="n">\${L("Shield","Khiên")}</span><span class="q">×2</span><span class="pb cur">\${priceTxt({coin:1500})}</span></button>
      <button class="vs-tile vs-cut" data-boost="power"><span class="ico">\${vIcon("power","",false)}</span><span class="n">\${L("Power","Sức mạnh")}</span><span class="q">×2</span><span class="pb cur">\${priceTxt({gem:20})}</span></button></div>
      <div class="vs-sec">VIP</div>
      <button class="vs-wide vs-vip vs-cut" id="vip"><span class="v">VIP</span><span><b>\${L("30-day pass","Thẻ 30 ngày")}</b><em>\${L("No ads · 2× daily login · +1 spin/day · 100 gems daily","Không quảng cáo · điểm danh ×2 · +1 lượt quay/ngày · 100 gem mỗi ngày")}</em></span><span class="go">\${S.vip?L("Active","Đang dùng"):"$4.99"}</span></button>\`;}
  if(vsTab==="gems"){
    const CR=[{n:L("Supply Crate","Rương Tiếp tế"),col:"#5ee7ff",its:[["ic-coin","2,000–3,000"],["bomb",L("Bomb ×1","Bom ×1")]]},
      {n:L("Epic Crate","Rương Sử thi"),col:"#c39bff",its:[["pilot",L("New pilot 12%","Phi công mới 12%")],["ic-coin","6,000–8,000"],["ic-gem","20"]]},
      {n:L("Legend Crate","Rương Huyền thoại"),col:"#ffd36b",its:[["pilot",L("New pilot 35%","Phi công mới 35%")],["ic-coin","15,000–18,000"],["ic-gem","60"]]}];
    const chip=([k,t])=>k==="pilot"?\`<span class="vc-ch hot">★ \${t}</span>\`:k==="bomb"?\`<span class="vc-ch">\${vIcon("bomb","",false)}\${t}</span>\`:\`<span class="vc-ch"><i class="\${k}"></i>\${t}</span>\`;
    h+=\`<div class="vs-sec">\${L("Gems","Kim cương")}</div><div class="vs-grid">\${GEMPACKS.map((p,i)=>\`<button class="vs-tile vs-cut \${i>=3?"l2":""}" data-gp="\${i}">\${p.t?\`<span class="rb \${p.t==="BEST"?"best":""}">\${p.t}</span>\`:""}
        <span class="ico"><i class="ic-gem" style="width:\${22+i*3}px;height:\${22+i*3}px"></i></span><span class="q">\${fmt(p.g)}</span><span class="pb">\${priceOf(p.id,p.p)}</span></button>\`).join("")}</div>
      <div class="vs-sec">\${L("Crates","Rương")}</div>
      <div class="vs-grid">\${CHESTS.map((c,i)=>\`<button class="vs-tile vs-cut \${i===2?"l2":""}" data-chest="\${i}"><span class="ico"><canvas width="168" height="140"></canvas></span><span class="n">\${CR[i].n}</span><span class="pb cur"><i class="ic-gem" style="width:14px;height:14px;display:inline-block"></i>\${c.g}</span></button>\`).join("")}</div>
      <div class="vs-note">\${L("Drop rates · Supply: coins + bomb 100% · Epic: new pilot 12%, else coins + gems · Legend: new pilot 35%, else coins + gems","Tỉ lệ · Tiếp tế: vàng + bom 100% · Sử thi: phi công mới 12%, còn lại vàng + gem · Huyền thoại: phi công mới 35%, còn lại vàng + gem")}</div>
      <div class="vs-sec">\${L("Coins","Vàng")}</div><div class="vs-grid">\${COINPACKS.map((p,i)=>\`<button class="vs-tile vs-cut" data-cp="\${i}"><span class="ico"><i class="ic-coin" style="width:\${22+i*3}px;height:\${22+i*3}px"></i></span><span class="q">\${fmt(p.c)}</span><span class="pb cur">\${priceTxt({gem:p.g})}</span></button>\`).join("")}</div>\`;}
  if(vsTab==="spin"){
    const pity=S.gwPity||0,left=GW_PITY-pity,cl=gwCoinLeft();
    const PR=[["gear_solar_core",L("Legendary gear","Trang bị Huyền thoại"),"4%",3],["gear_aegis_cannon",L("Epic gear","Trang bị Sử thi"),"16%",2],["gear_vanguard_engine",L("Rare gear","Trang bị Hiếm"),"36%",1],["mat_alloy",L("Alloy ×30–60","Hợp kim ×30–60"),"44%",0]];
    const PRC=[["gear_vanguard_engine",L("Rare gear","Trang bị Hiếm"),"36%",1],["mat_alloy",L("Alloy ×20–40","Hợp kim ×20–40"),"64%",0]];
    const row=list=>list.map(([im,n,pc,r])=>\`<div class="gw-it r\${r}"><span class="pic">\${sprImg(im)}</span><span class="pc">\${pc}</span><span class="nm">\${n}</span></div>\`).join("");
    h+=\`<div class="vs-sec">\${L("Gem spin","Vòng quay kim cương")}</div>
      <div class="gw vs-cut"><div class="gw-h">\${sprImg("gear_solar_core")}<span><b>\${L("LEGENDARY SPIN","VÒNG QUAY HUYỀN THOẠI")}</b><em>\${L("Spin the gear wheel to win:","Quay vòng trang bị để nhận:")}</em></span></div>
        <div class="gw-pr">\${row(PR)}</div>
        <div class="gw-set">\${L("Legendary = Solar set · 2 pieces: +10% crit · 4 pieces: crits may trigger a mini nova","Huyền thoại = bộ Solar · 2 món: +10% chí mạng · 4 món: chí mạng có thể kích nổ nova nhỏ")}</div>
        <div class="gw-pity"><span>\${L(\`Legendary guaranteed in <b>\${left}</b> spins\`,\`Chắc chắn ra Huyền thoại sau <b>\${left}</b> lượt\`)}</span><i><i style="width:\${pity/GW_PITY*100}%"></i></i></div>
        <div class="gw-btns"><button class="gw-go pink" data-gw="1">\${L("SPIN ×1","QUAY ×1")}<small><i class="ic-gem"></i>\${GW_COST}</small></button>
          <button class="gw-go" data-gw="10"><span class="sv">−10%</span>\${L("SPIN ×10","QUAY ×10")}<small><i class="ic-gem"></i>\${GW_COST*9}</small></button></div></div>
      <div class="vs-sec">\${L("Coin spin","Vòng quay vàng")}<small>\${L(\`\${cl}/\${GW_CMAX} left today\`,\`còn \${cl}/\${GW_CMAX} lượt hôm nay\`)}</small></div>
      <div class="gw gwc vs-cut"><div class="gw-h">\${sprImg("gear_vanguard_engine")}<span><b>\${L("COIN SPIN","VÒNG QUAY VÀNG")}</b><em>\${L("Rare gear and Alloy only:","Chỉ ra trang bị Hiếm và Hợp kim:")}</em></span></div>
        <div class="gw-row">\${row(PRC)}<button class="gw-go coin" data-gw="c" \${cl?"":"disabled"}>\${L("SPIN ×1","QUAY ×1")}<small><i class="ic-coin"></i>\${fmt(GW_CCOST)}</small></button></div>
        <div class="gw-odds">\${L(\`\${GW_CMAX} spins a day · does not count toward the Legendary guarantee\`,\`\${GW_CMAX} lượt mỗi ngày · không tính vào bảo hiểm Huyền thoại\`)}</div></div>\`;}
  h+=\`</div>\`;
  B.innerHTML=h;
  $$("#shopBody [data-vt]").forEach(b=>b.onclick=()=>{vsTab=b.dataset.vt;renderShop();B.scrollTop=0;});
  $$("#shopBody [data-vo]").forEach(b=>b.onclick=()=>POPS.offer());
  $$("#shopBody [data-chest]").forEach(b=>{drawChest(b.querySelector("canvas"),+b.dataset.chest);b.onclick=()=>openChest(+b.dataset.chest);});
  $$("#shopBody [data-gp]").forEach(b=>b.onclick=()=>{const gp=GEMPACKS[b.dataset.gp];pay(gp.id,()=>{give({g:gp.g});sfx("coin");toast(\`+\${fmt(gp.g)} gems (test purchase)\`);renderShop();});});
  $$("#shopBody [data-cp]").forEach(b=>b.onclick=()=>{const p=COINPACKS[b.dataset.cp];if(spend({gem:p.g})){give({c:p.c});sfx("coin");renderShop();}});
  $$("#shopBody [data-boost]").forEach(b=>b.onclick=()=>{const k=b.dataset.boost;if(spend(k==="shield"?{coin:1500}:{gem:20})){give({b:k,n:2});toast(\`+2 \${k}\`);renderShop();}});
  $("#shopBody [data-free]")&&($("#shopBody [data-free]").onclick=()=>fakeAd(()=>{give({g:10});toast("+10 gems");renderShop();}));
  $$("#shopBody [data-gw]").forEach(b=>b.onclick=()=>POPS.gearSpin(b.dataset.gw==="c"?{coin:1,n:1}:{n:+b.dataset.gw}));
  $("#buyStarter")&&($("#buyStarter").onclick=()=>pay("nv_starter",()=>{grantStarter();claimFx("Starter pack claimed!");renderShop();}));
  $("#vip")&&($("#vip").onclick=()=>{if(!S.vip){S.vip=1;save();claimFx("VIP active for 30 days");renderShop();}});};
RENDER.shop=renderShop;

/* Special Offer redesign: full-screen Seraphina bundle */
POPS.offer=function(){const own=!!S.ships.seraph,d=shipDef("seraph"),u=ULTS.seraph,girl=typeof GIRL_SRC!=="undefined"&&GIRL_SRC.seraph;
  const ship=SPR_HAS("ship_seraph")?\`<img src="\${SPR_SRC.ship_seraph}" alt="">\`:"",ult=SPR_SRC.ui_sk_nova||"";
  const ms=86400000-Date.now()%86400000,hh=n=>String(n).padStart(2,"0"),t=\`\${hh(Math.floor(ms/36e5))}:\${hh(Math.floor(ms/6e4)%60)}:\${hh(Math.floor(ms/1e3)%60)}\`;
  const sp=[[12,30],[84,24],[8,58],[90,52],[22,14],[70,64]].map(([x,y],i)=>\`<i class="vo-sp" style="left:\${x}%;top:\${y}%;animation-delay:\${i*.37}s"></i>\`).join("");
  const p=pop("Special Offer",\`<div class="vo-sun"><i class="r2"></i><i class="r1"></i><i class="r4"></i><i class="r3"></i></div>\${sp}
    \${girl?\`<img class="vo-girl" src="\${girl}" alt="Seraphina">\`:""}
    <div class="vo-head"><div class="vo-name">SERAPHINA</div><div class="vo-call">\${L("SOLAR COMMANDER","CHỈ HUY MẶT TRỜI")} · <b>\${L("LEGENDARY","HUYỀN THOẠI")}</b></div><div class="vo-tag">\${L("LIMITED BUNDLE · −50%","GÓI GIỚI HẠN · −50%")}</div></div>
    <div class="vo-timer">\${L("Ends in","Còn")} <b class="num">\${t}</b></div>
    <div class="vo-bottom">
      <div class="vo-row"><div class="vo-form">\${ship}<span>\${L("BATTLE FORM","DẠNG CHIẾN")}</span></div><b class="vo-plus">+</b>
        <div class="vo-it"><i class="ic-gem"></i><b>800</b></div><div class="vo-it"><i class="ic-coin"></i><b>20K</b></div>
        <div class="vo-it ult">\${ult?\`<img src="\${ult}" alt="">\`:""}<b>ULT</b></div></div>
      <div class="vo-stats"><span>\${L("Power","Sức mạnh")} <b>\${d.pow}</b></span><span>\${L("Hull","Giáp")} <b>\${d.hp}</b></span><span>\${d.wpn}</span></div>
      <div class="vo-ult"><b>\${u.name}</b> · \${u.desc}</div>
      <button class="btn" id="ok">\${own?L("Owned","Đã sở hữu"):\`<s>$29.99</s>\${priceOf("nv_seraph","$14.99")}\`}</button>
      <div class="vo-note">\${L("One-time offer · Seraphina joins your squad forever","Chỉ mua 1 lần · Seraphina gia nhập đội vĩnh viễn")}</div>
    </div>\`,"vkoffer");
  p.querySelector("#ok").onclick=()=>{if(S.ships.seraph)return closePop();pay("nv_seraph",()=>{grantSeraph();claimFx("Seraphina joined your squad!");});};};

/* Valkyrie dialog decoration: subtitle, variant, Mika peek */
const VK_SUB={"Daily Login":["7-day check-in","Điểm danh 7 ngày"],"Online Gift":["Stay online, earn more","Online càng lâu quà càng nhiều"],"Lucky Spin":["One free spin a day","Mỗi ngày 1 lượt miễn phí"],
  "Special Offer":["Limited time","Có thời hạn"],"Mailbox":["Messages from HQ","Thư từ bộ chỉ huy"],"Energy":["Fuel for every sortie","Năng lượng xuất kích"],"Success":["Reward received","Đã nhận thưởng"]};
const VK_REWARD=/^(Daily Login|Success|You got|LEGENDARY!|10× results|Victory!|Run complete)/,VK_WARN=/^(Revive\\?|Defeat|Wipe data\\?|Quit stage\\?)/;
const VK_MIKA={"Daily Login":["Morning, Commander! Here’s today’s gift!","Chào buổi sáng chỉ huy! Quà hôm nay nè!"]};
if(${USE_DLG}){const _pop=pop;pop=function(title,html,cls="",onX){const el=_pop(title,html,cls,onX===undefined?closePop:onX);
  el.classList.toggle("vk-reward",VK_REWARD.test(title));el.classList.toggle("vk-warn",VK_WARN.test(title));
  const sub=VK_SUB[title];if(sub&&!el.querySelector(".vksub"))el.querySelector("h3").insertAdjacentHTML("afterend",\`<div class="vksub">\${L(sub[0],sub[1])}</div>\`);
  const ml=VK_MIKA[title],bust=typeof GIRL_BUST!=="undefined"&&(GIRL_BUST[S.ship]||GIRL_BUST.kestrel);
  if(ml&&bust&&!el.dataset.re){el.classList.add("vk-mika");const m=document.createElement("div");m.className="vkMika";m.innerHTML=\`<img src="\${bust}" alt=""><p>\${L(ml[0],ml[1])}</p>\`;veil.appendChild(m);
    requestAnimationFrame(()=>{m.style.left=(el.offsetLeft+el.offsetWidth-m.offsetWidth-6)+"px";m.style.top=(el.offsetTop-150)+"px";});}
  return el;};}
const GIRL={kestrel:{name:"Mika",lines:["Kestrel, ready to launch!","Morning, Commander! Where do we fly today?","Hey, that tickles! Eyes on the mission.","My wings are polished. Let's go!"]},
  viper:{name:"Suzu",lines:["Target locked."]},raptor:{name:"Kaede",lines:["Missiles loaded!"]},halo:{name:"Elle",lines:["The halo is with you."]},
  tempest:{name:"Raika",lines:["Bzzt! Let's go!"]},nebula:{name:"Noa",lines:["Showtime!"]},seraph:{name:"Seraphina",lines:["Follow my lead."]},oblivion:{name:"Nyx",lines:["..."]}};
const agImg={};for(const k in GIRL_SRC){const i=new Image();i.src=GIRL_SRC[k];agImg[k]=i;}
const agP=[];let agHop=0,agBubT=0,agLine=0;
function drawGirl(t){
  const img=agImg[S.ship],cv=$("#girlShow");
  $("#shipShow").classList.toggle("ag-off",!!img);cv.hidden=!img;if(!img||!img.naturalWidth)return false;
  const r=cv.getBoundingClientRect(),dpr=Math.min(2,devicePixelRatio||1),W=Math.round(r.width*dpr),H=Math.round(r.height*dpr);
  if(!W||!H)return true;if(cv.width!==W||cv.height!==H){cv.width=W;cv.height=H;}
  const c=cv.getContext("2d");c.clearRect(0,0,W,H);
  const base=H-34*dpr,h=Math.min(H-40*dpr,(W*.9)*img.naturalHeight/img.naturalWidth),w=h*img.naturalWidth/img.naturalHeight,x0=W/2-w/2;
  // holo platform
  const pr=w*.42;c.save();c.translate(W/2,base);c.scale(1,.22);
  const g=c.createRadialGradient(0,0,pr*.1,0,0,pr);g.addColorStop(0,"#38e1ff66");g.addColorStop(.7,"#1d63d633");g.addColorStop(1,"#1d63d600");
  c.fillStyle=g;c.beginPath();c.arc(0,0,pr,0,7);c.fill();
    c.restore();
  // rising holo motes
  if(Math.random()<.35)agP.push({x:W/2+(Math.random()-.5)*pr*1.4,y:base,v:(20+Math.random()*40)*dpr,l:1});
  c.fillStyle="#9ff0ff";for(let i=agP.length;i--;){const p=agP[i];p.y-=p.v/60;p.l-=1/150;if(p.l<=0){agP.splice(i,1);continue;}c.globalAlpha=p.l*.7;c.fillRect(p.x,p.y,2*dpr,2*dpr);}c.globalAlpha=1;
  // body: horizontal strips, breathing stretch from the feet, hair sway at the top, hop on tap
  const br=Math.sin(t*2.2),hop=agHop>0?Math.sin((1-agHop)*Math.PI)*14*dpr:0;if(agHop>0)agHop-=1/30;
  const N=48,ih=img.naturalHeight,sh=ih/N,dh=h/N*(1+.007*br);
  for(let i=0;i<N;i++){const v=i/N,up=1-v,dx=Math.sin(t*1.4-v*2.5)*up*up*up*5*dpr;
    c.drawImage(img,0,i*sh,img.naturalWidth,sh+1,x0+dx,base-h*(1+.007*br)+i*dh-hop,w,dh+1);}
  const b=$("#agBub");if(agBubT>0){agBubT-=1/60;if(agBubT<=0)b.hidden=true;}
  const pr2=cv.parentNode.getBoundingClientRect();drawGirl.head={x:r.width*.74,y:(base-h*.72-hop)/dpr+r.top-pr2.top,w:pr2.width};
  return true;}
$("#girlShow").onclick=()=>{const G=GIRL[S.ship];if(!G)return;agHop=1;agLine=(agLine+1)%G.lines.length;const b=$("#agBub");b.textContent=G.lines[agLine];
  b.hidden=false;b.style.animation="none";b.offsetWidth;b.style.animation="";const hd=drawGirl.head||{x:200,y:60};b.style.left=Math.min(hd.x,(hd.w||400)-100)+"px";b.style.top=Math.max(70,hd.y)+"px";agBubT=3.2;try{sfx("coin");}catch(e){}};
`;
patch("refresh();})();", `refresh();if(typeof GIRL_FACE!=="undefined"&&GIRL_FACE.kestrel){const a=$("#home .h5prof .avatar");const im=a.querySelector("img")||a.appendChild(new Image());im.src=GIRL_FACE.kestrel;im.style.cssText="width:100%;height:100%;object-fit:cover;border-radius:inherit";}})();`);
// Escort Drones run skill: own small mechanical drones in a tight formation (positions shared by fire + draw)
patch(`[-1,1].forEach(s=>B.pb.push({x:p.x+s*(38+k*24),y:p.y+6,vx:0,vy:-700,dmg:dmg*.8,r:3,kind:"drone"}));`,
  `[-1,1].forEach(s=>{const q=escortPos(k,s);B.pb.push({x:q.x,y:q.y-8,vx:0,vy:-700,dmg:dmg*.8,r:3,kind:"drone"});});`);
patch(`const nd=rs("drone");if(nd){const dd=droneDef("sparrow");for(let k=1;k<=nd;k++)[-1,1].forEach(s=>drawDrone(c,dd,p.x+s*(38+k*24),p.y+18+k*6,9,B.t+k));}`,
  `const nd=rs("drone");if(nd){for(let k=1;k<=nd;k++)[-1,1].forEach(s=>{const q=escortPos(k,s);drawEscort(c,q.x,q.y,B.t+k);});}`);
patch("/* ============ BOOT ============ */", js +"/* ============ BOOT ============ */");
patch(/<script>\r?\n/.exec(html)[0], /<script>\r?\n/.exec(html)[0] + sprites + girls);
if (!/<meta charset/i.test(html)) html = '<meta charset="utf-8">\n' + html;
writeFileSync(out, html);
console.log(`wrote ${out} (${Math.round(html.length / 1024)} KB)`);
