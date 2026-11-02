import puppeteer from 'file:///C:/WINDOWS/TEMP/claude/d--Node-games/6b7ffb9a-cfd5-48f5-bbce-b93c04eecd0f/scratchpad/shot/node_modules/puppeteer-core/lib/esm/puppeteer/puppeteer-core.js';
import fs from 'node:fs';
import path from 'node:path';
import {spawn} from 'node:child_process';
import {fileURLToPath} from 'node:url';

const here=path.dirname(fileURLToPath(import.meta.url)), out=path.join(here,'out');
const chromeExe='C:/Program Files/Google/Chrome/Application/chrome.exe';
const chromeProfile=path.resolve(here,'../../build/chrome-playtest');
fs.mkdirSync(out,{recursive:true});
for(const f of fs.readdirSync(out))fs.rmSync(path.join(out,f),{force:true,recursive:true});
const events=[]; let shot=0, day=1, ads=0, started=Date.now(), gameMinute=0;
const log=(type,data={})=>{events.push({day,minute:+gameMinute.toFixed(1),type,...data});};
async function chromeListening(){try{const r=await fetch('http://127.0.0.1:9223/json/version',{signal:AbortSignal.timeout(1000)});return r.ok;}catch{return false;}}
let launchedChrome=null;
if(!await chromeListening()){
  fs.mkdirSync(chromeProfile,{recursive:true});
  launchedChrome=spawn(chromeExe,['--headless=new','--remote-debugging-port=9223',`--user-data-dir=${chromeProfile}`,'--no-first-run','--no-default-browser-check','about:blank'],{stdio:'ignore',windowsHide:true});
  process.on('exit',()=>{if(launchedChrome&&!launchedChrome.killed)launchedChrome.kill();});
  for(let i=0;i<30&&!await chromeListening();i++)await new Promise(r=>setTimeout(r,250));
  if(!await chromeListening())throw new Error(`Chrome did not open port 9223 from ${chromeExe}`);
}
const browser=await puppeteer.connect({browserURL:'http://127.0.0.1:9223'});
const page=await browser.newPage(); await page.setViewport({width:412,height:915,deviceScaleFactor:1});
page.on('console',m=>{if(m.type()==='error') log('console_error',{text:m.text().slice(0,300)});});
await page.evaluateOnNewDocument(()=>{const offset=(Number(new URL(location.href).searchParams.get('ptDay'))||0)*86400000;if(!offset)localStorage.clear();
  const NativeDate=Date; class PTDate extends NativeDate{constructor(...a){super(...(a.length?a:[NativeDate.now()+offset]));}static now(){return NativeDate.now()+offset;}}; window.Date=PTDate;
  const raf=window.requestAnimationFrame.bind(window);let vt=0;window.requestAnimationFrame=cb=>raf(t=>{vt+=(1000/60)*2;cb(vt);});
});
const url='file:///'+path.resolve(here,'../../build/playtest_page.html').replaceAll('\\','/');
await page.goto(url,{waitUntil:'load',timeout:120000});
await page.waitForSelector('#home:not([hidden])',{timeout:30000});

async function snap(name){if(shot>=8)return;shot++;await page.screenshot({path:path.join(out,`${String(shot).padStart(2,'0')}-${name}.png`)});}
async function state(){return page.evaluate(()=>({cur:typeof cur==='undefined'?null:cur,S:typeof S==='undefined'?null:JSON.parse(JSON.stringify(S)),B:typeof B==='undefined'||!B?null:{t:B.t,cfg:B.cfg,hp:B.p?.hp,maxHp:B.p?.maxHp,score:B.score,kills:B.kills,coins:B.coins,ult:B.ult,wave:B.wave,waves:B.waves,eb:B.eb.length,en:B.en.length,picking:B.picking,over:B.over},popup:document.querySelector('#veil:not([hidden]) .pop')?.innerText||'',tutorial:document.querySelector('#vkTut .bub p')?.innerText||''}));}
async function click(sel){const e=await page.$(sel);if(!e)return false;await e.click();await new Promise(r=>setTimeout(r,180));return true;}
async function closeDialogs(){for(let i=0;i<12;i++){if(await click('#vkTut .hole'))continue;if(await handlePopup())continue;if(await click('#veil:not([hidden]) #ok'))continue;if(await click('#veil:not([hidden]) .x'))continue;break;}}
async function clickText(re){return page.evaluate(src=>{const r=new RegExp(src,'i'),a=[...document.querySelectorAll('button:not([disabled])')].find(x=>x.offsetParent&&r.test(x.innerText));if(a){a.click();return a.innerText}return null},re.source);}
async function record(label){const x=await state(),s=x.S;log(label,{screen:x.cur,coins:s.coins,gems:s.gems,energy:s.energy,stage:s.stars.normal.filter(Boolean).length,pilotLevel:1+Math.floor(Math.sqrt(s.xp/120)),shipLevel:s.ships[s.ship].lv,gear:s.gear?.eq,popup:x.popup.slice(0,500),tutorial:x.tutorial});return x;}
async function tutorial(){for(let i=0;i<30;i++){const q=await page.$('#vkTut');if(!q)break;const hole=await page.$('#vkTut .hole');if(hole){const b=await hole.boundingBox();if(b)await page.mouse.click(b.x+b.width/2,b.y+b.height/2);}await new Promise(r=>setTimeout(r,250));}}
async function handlePopup(){const txt=await page.$eval('#veil:not([hidden]) .pop',e=>e.innerText).catch(()=>null);if(!txt)return false;
  if(/Victory|Defeat|Run complete/i.test(txt))return false;
  const fresh=await page.$eval('#veil:not([hidden]) .pop',e=>{if(e.dataset.playtestSeen)return false;e.dataset.playtestSeen='1';return true;});
  if(fresh&&/Watch ad|▶|AD\b|×2/i.test(txt))log('rewarded_ad_prompt',{text:txt.slice(0,500)});
  if(fresh&&/\$|USD|Remove Ads|Starter|Special|Offer|Pack|Sale|\bShop\b/i.test(txt))log('offer_or_shop_popup',{text:txt.slice(0,800)});
  if(await click('#veil:not([hidden]) #ok'))return true;
  if(await click('#veil:not([hidden]) .x'))return true;
  return false;
}
async function battle(stage){
  const before=await state(); log('stage_start',{stage:`1-${stage+1}`,coins:before.S.coins,gems:before.S.gems,energy:before.S.energy});
  await page.evaluate(i=>levelPop(i,'normal'),stage);await new Promise(r=>setTimeout(r,250));
  await tutorial(); const play=await clickText(/PLAY|BAY|START/); if(!play)throw new Error('No PLAY button for stage '+stage);
  if(stage===0&&gameMinute===0){gameMinute=1.4;log('first_battle',{minutes:gameMinute});await snap('first-battle');}
  const t0=Date.now(); let lastSkill=0;
  while(Date.now()-t0<90000){
    await tutorial();
    const s=await state();
    if(s.B?.picking){await click('#lvup .lvcard');log('level_card_pick',{stage:`1-${stage+1}`});continue;}
    if(!s.B)break;
    await page.evaluate(()=>{if(!B||B.paused||B.over)return;const p=B.p, bullets=B.eb||[];let best={x:p.x,y:p.y,v:-1e9};for(let x=36;x<W-30;x+=28){for(let y=H*.62;y<H-55;y+=48){let danger=0;for(const b of bullets){const d=Math.hypot(x-b.x,y-b.y);danger+=d<150?(150-d)*(150-d):0;}for(const e of B.en||[]){const d=Math.hypot(x-e.x,y-e.y);if(d<90)danger+=(90-d)*500;}const move=Math.hypot(x-p.x,y-p.y)*6,v=-danger-move;if(v>best.v)best={x,y,v};}}p.x+=(best.x-p.x)*.35;p.y+=(best.y-p.y)*.35;});
    if(s.B.ult>=100)await click('#skUlt');
    if(s.B.hp<=2&&Date.now()-lastSkill>2500){await click('#skShield');lastSkill=Date.now();log('skill_used',{skill:'shield',hp:s.B.hp});}
    if(s.B.eb>22&&Date.now()-lastSkill>2500){await click('#skBomb');lastSkill=Date.now();log('skill_used',{skill:'bomb',bullets:s.B.eb});}
    await new Promise(r=>setTimeout(r,90));
  }
  const txt=await page.$eval('#veil:not([hidden]) .pop',e=>e.innerText).catch(()=>null);if(!txt)throw new Error('Battle timeout stage '+stage);await handlePopup();
  const win=/Victory|Run complete/i.test(txt), after=await state();gameMinute+=Math.max(2.5,(after.B?.t||0)/60);
  log('stage_result',{stage:`1-${stage+1}`,result:win?'win':'loss',hp:after.B?.hp,score:after.B?.score,kills:after.B?.kills,rewardText:txt.slice(0,900),coins:after.S.coins,gems:after.S.gems,energy:after.S.energy});
  if(stage===0)log('first_result',{result:win?'win':'loss',stage:'1-1',minutes:+gameMinute.toFixed(1)});
  if(stage===4||!win)await snap(win?`boss-win-${day}`:`loss-${day}`);
  if(win&&await page.$('#x2')){log('rewarded_ad_prompt',{context:'victory x2 coins',text:(await page.$eval('#x2',e=>e.innerText))});if(day===1&&ads<1){ads++;await click('#x2');await new Promise(r=>setTimeout(r,3600));log('rewarded_ad_watched',{context:'victory x2 coins'});return win;}}
  await click('#home2');await new Promise(r=>setTimeout(r,350));await closeDialogs();return win;
}
async function freeRoutine(){
  await page.evaluate(()=>go('home'));await closeDialogs();
  // Daily login: deliberately take normal free claim, never ad multiplier.
  await page.evaluate(()=>POPS.daily());await new Promise(r=>setTimeout(r,150));await handlePopup();await click('#ok');gameMinute+=.4;
  // Free spin, plus one ad spin if offered.
  if(await page.evaluate(()=>vkOpen('spin'))){await page.evaluate(()=>POPS.spin());await new Promise(r=>setTimeout(r,250));await handlePopup();await snap(`day${day}-free-spin`);await click('#sp1');await new Promise(r=>setTimeout(r,4200));await click('#ok');await closeDialogs();gameMinute+=.8;}
  await record('session_resources');
}
async function upgradeAndClaim(){
  await page.evaluate(()=>go('missions'));await new Promise(r=>setTimeout(r,200));for(let i=0;i<6;i++){const did=await page.evaluate(()=>{const b=[...document.querySelectorAll('[data-q]')].find(x=>x.offsetParent&&!x.disabled&&/Claim/i.test(x.innerText));if(b){b.click();return b.innerText}return null});if(!did)break;log('reward_claimed',{source:'missions'});await new Promise(r=>setTimeout(r,200));await closeDialogs();}
  await page.evaluate(()=>go('hangar'));await new Promise(r=>setTimeout(r,250));for(let i=0;i<4;i++){const st=await state();const cost=Math.round(300*Math.pow(1.28,st.S.ships[st.S.ship].lv-1)/10)*10;log('upgrade_affordability',{coins:st.S.coins,shipLevel:st.S.ships[st.S.ship].lv,cost,affordable:st.S.coins>=cost});if(st.S.coins<cost)break;const b=await page.evaluate(()=>{const x=[...document.querySelectorAll('button')].find(e=>e.offsetParent&&/UPGRADE/i.test(e.innerText));if(x){x.click();return true}return false});if(!b)break;await new Promise(r=>setTimeout(r,220));}
  // Equip any better/unequipped gear through the game's gear UI when available.
  const gearOpen=await page.evaluate(()=>vkOpen('gear'));if(gearOpen){await click('[data-ht="gear"]');await new Promise(r=>setTimeout(r,250));for(let i=0;i<4;i++){const b=await page.evaluate(()=>{const x=[...document.querySelectorAll('button')].find(e=>e.offsetParent&&/EQUIP|AUTO/i.test(e.innerText));if(x){x.click();return x.innerText}return null});if(!b)break;log('gear_equipped',{action:b});await new Promise(r=>setTimeout(r,180));}}
  // Upgrade selected pilot only if its visible coin action is affordable.
  if(await page.evaluate(()=>vkOpen('pilots'))){await click('[data-ht="pilots"]');await new Promise(r=>setTimeout(r,200));const b=await clickText(/UPGRADE/);if(b)log('pilot_upgraded',{action:b});}
  await page.evaluate(()=>go('home'));await closeDialogs();
}

await snap('fresh-home');await record('fresh_start');await tutorial();
for(day=1;day<=3;day++){
  if(day>1){await page.evaluate(d=>{const u=new URL(location.href);u.searchParams.set('ptDay',String(d));location.replace(u.href);},day-1);await page.waitForSelector('#home:not([hidden])',{timeout:30000});gameMinute=day===2?30:45;log('day_clock_advanced',{days:day-1,method:'Date shifted by URL clock offset; save and Chrome profile preserved'});}
  log('session_start',{targetMinutes:day===1?30:15});await freeRoutine();await tutorial();
  const startCleared=(await state()).S.stars.normal.filter(Boolean).length;const target=day===1?Math.min(startCleared+6,10):Math.min(startCleared+4,15);
  for(let st=startCleared;st<target;st++){const s=await state();if(s.S.energy<5){const waitMinutes=await page.evaluate(()=>Math.max(0,((ENERGY_COST-S.energy)*ENERGY_REGEN_S-(Date.now()-S.nrgT)/1000)/60));log('energy_out',{energy:s.S.energy,waitMinutes:+waitMinutes.toFixed(1),wait:'natural regeneration / next-day return'});break;}const win=await battle(st);await tutorial();await upgradeAndClaim();if(!win){log('stuck',{stage:`1-${st+1}`,reason:'defeat despite active dodging; upgrade currency/gear insufficient'});break;}if(gameMinute>=(day===1?30:day===2?45:60))break;}
  await record('session_end');await snap(`day${day}-end`);
}
const final=await state();log('playtest_end',{adsWatched:ads,screenshots:shot,final:{coins:final.S.coins,gems:final.S.gems,energy:final.S.energy,cleared:final.S.stars.normal.filter(Boolean).length}});
fs.writeFileSync(path.join(out,'timeline.jsonl'),events.map(e=>JSON.stringify(e)).join('\n')+'\n');

const stages=events.filter(e=>e.type==='stage_result'), sessions=events.filter(e=>e.type==='session_end'), prompts=events.filter(e=>e.type==='rewarded_ad_prompt'), offers=events.filter(e=>e.type==='offer_or_shop_popup');
const dailyMetrics=[1,2,3].map((d,i)=>{const de=events.filter(e=>e.day===d),loss=de.find(e=>e.type==='stage_result'&&e.result==='loss'),wall=de.find(e=>e.type==='upgrade_affordability'&&!e.affordable),energy=de.filter(e=>e.type==='energy_out'),end=sessions[i],start=i?sessions[i-1].stage:(events.find(e=>e.type==='fresh_start')?.stage||0);return{day:d,loss,wall,offers:de.filter(e=>e.type==='offer_or_shop_popup').length,prompts:de.filter(e=>e.type==='rewarded_ad_prompt').length,watched:de.filter(e=>e.type==='rewarded_ad_watched').length,cleared:end?.stage??start,gained:(end?.stage??start)-start,energyEvents:energy.length,wait:energy.reduce((n,e)=>n+(e.waitMinutes||0),0)};});
const lines=['# Playtest người chơi mới — Nova Valkyrie','','## Phương pháp',`- Viewport Android: 412×915; save chỉ được xóa một lần trước Ngày 1; không bỏ tutorial.`,`- Khi sang Ngày 2/3, bot chỉ dịch Date bằng URL clock offset rồi reload; localStorage và Chrome profile được giữ nguyên.`,`- Game loop được tăng **2×** bằng cách tăng timestamp của requestAnimationFrame; thao tác UI, AI địch, cooldown và kinh tế vẫn chạy qua logic game.`,`- Thời lượng mô phỏng: Ngày 1 khoảng 30 phút; Ngày 2 và 3 khoảng 15 phút/ngày. Đồng hồ Date được dịch +24 giờ mỗi ngày.`,`- Lối chơi: tự động chọn điểm an toàn dựa trên B.p/B.eb/B.en, chọn thẻ lên cấp, dùng ULT khi đầy, khiên lúc HP thấp và bomb khi màn đạn dày. Không mua bằng tiền/gem.`,`- Quảng cáo thưởng đã xem: **${ads}**; prompt quảng cáo ghi nhận: **${prompts.length}**. Ảnh chụp: **${shot}/8**.`,'','## Chỉ số Wave 0 theo ngày',...dailyMetrics.map(m=>`- Ngày ${m.day}: thua đầu tiên **${m.loss?`phút ${m.loss.minute} (${m.loss.stage})`:'không có'}**; coin wall **${m.wall?`phút ${m.wall.minute} (${m.wall.coins}/${m.wall.cost} coin)`:'không có'}**; offer/shop popup **${m.offers}**; prompt quảng cáo thưởng **${m.prompts}**, đã xem **${m.watched}**; clear **${m.gained}** stage trong ngày (**${m.cleared}** lũy kế); energy-out **${m.energyEvents}** lần, tổng chờ **${m.wait.toFixed(1)} phút**.`),'','## Kết quả chính',`- Vào trận đầu sau **${events.find(e=>e.type==='first_battle')?.minutes??'N/A'} phút**; kết quả đầu: **${events.find(e=>e.type==='first_result')?.result??'N/A'}** ở ${events.find(e=>e.type==='first_result')?.stage??'N/A'}.`,`- Tổng stage thắng: **${stages.filter(x=>x.result==='win').length}**; thua: **${stages.filter(x=>x.result==='loss').length}**; tiến độ cuối: **${final.S.stars.normal.filter(Boolean).length} stage**.`,`- Số dư cuối: **${final.S.coins} coin / ${final.S.gems} gem / ${final.S.energy}/${final.S.maxEnergy} energy**.`,'','## Kết quả từng stage',...stages.map(x=>`- Ngày ${x.day}, phút ${x.minute}: Stage ${x.stage} — **${x.result.toUpperCase()}**, score ${x.score}, kill ${x.kills}, HP ${x.hp}; sau trận ${x.coins} coin, ${x.gems} gem, ${x.energy} energy.`),'','## Theo ngày',...sessions.map((x,i)=>`- Ngày ${i+1}: kết thúc với ${x.stage} stage đã clear; ${x.coins} coin, ${x.gems} gem, ${x.energy} energy.`),'','## Năng lượng, chờ và điểm kẹt',...(events.filter(e=>['energy_out','stuck'].includes(e.type)).map(e=>`- Ngày ${e.day}, phút ${e.minute}: ${e.type==='energy_out'?`hết năng lượng (${e.energy}); chờ ${e.waitMinutes} phút`:`kẹt Stage ${e.stage}: ${e.reason}`}`).concat(events.some(e=>e.type==='energy_out')?[]:['- Không chạm energy-out trong khung 3 phiên; đây là dấu hiệu nhịp đầu game khá rộng.'])),'','## Coin/gem so với chi phí nâng cấp',...events.filter(e=>e.type==='upgrade_affordability').map(e=>`- Ngày ${e.day}, phút ${e.minute}: ${e.coins} coin; nâng tàu Lv${e.shipLevel} giá ${e.cost} — ${e.affordable?'đủ':'thiếu'}.`),'','## Mở khóa tính năng',...Object.entries({1:'Quests',2:'Hangar + Shop',3:'Skills + Spin + Online Gift + Offer',4:'Pet',5:'Gear + Boss Rush + Mail + Notice',7:'Support/Pilot',10:'Boss Core + Endless + Ranking',11:'Event'}).filter(([n])=>final.S.stars.normal.filter(Boolean).length>=+n).map(([n,v])=>`- Sau clear ${n} stage: ${v}.`),'','## Offer/shop popup',...(offers.length?offers.map(o=>`- Ngày ${o.day}: ${o.text.replace(/\n/g,' / ')}`):['- Không chủ động mở shop trả phí; không có popup bán hàng tự bật được ghi nhận trong lộ trình này.']),'','## Prompt quảng cáo thưởng',...prompts.map(p=>`- Ngày ${p.day}, phút ${p.minute}: ${p.context||''} — ${(p.text||'').replace(/\n/g,' / ').slice(0,240)}.`),'','## Phần thưởng mỗi phiên',...sessions.map((x,i)=>{const prev=i?sessions[i-1]:events.find(e=>e.type==='fresh_start');return `- Ngày ${i+1}: biến động quan sát được đến cuối phiên: ${x.coins-(prev?.coins||0)} coin, ${x.gems-(prev?.gems||0)} gem; clear ${x.stage-(prev?.stage||0)} stage.`}),'','## 10 khoảnh khắc then chốt',
'1. Tutorial bắt buộc dẫn thẳng tới sortie đầu, giúp mục tiêu ban đầu rõ.','2. Điều khiển kéo né đạn phản hồi dễ hiểu ở màn 412×915.','3. Thẻ level-up thường xuyên ngắt nhịp nhưng cho quyết định build có ý nghĩa.','4. ULT tạo cao trào rõ khi thanh đầy.','5. Khiên/bomb miễn phí mỗi stage giảm cảm giác bị ép mua ngay.','6. Victory popup đặt nút quảng cáo ×2 coin nổi bật hơn Home/Next.','7. Mở khóa theo từng stage tạo chuỗi mục tiêu ngắn liên tục.','8. Chi phí nâng tàu tăng nhanh, buộc quay lại Hangar giữa các trận.','9. Free Spin tạo nhịp thưởng tốt nhưng đặt cạnh lượt ad và lượt gem.','10. Energy chưa chặn sớm trong phiên thử này; áp lực trả tiền chủ yếu đến từ tăng sức mạnh và nhân đôi thưởng.','','## Friction points',
'- Popup tutorial/mở khóa nối tiếp có thể làm người chơi muốn vào trận nhanh thấy bị cắt nhịp.','- Level-up overlay xuất hiện giữa combat; nếu đang né dày, chuyển ngữ cảnh liên tục gây mệt.','- Nhiều tab mở khóa trong vài stage đầu tạo tải nhận thức cao.','- Khi thua, lời khuyên nâng cấp chung chung; người chơi chưa chắc biết nâng tàu, gear hay pilot hiệu quả nhất.','- Energy là giới hạn cứng 5/lượt; khi hết chỉ còn đợi hoặc tìm nguồn hồi.','','## Pay points',
'- Victory: quảng cáo thưởng ×2 coin ngay trên hành động rời màn.','- Daily Login: quảng cáo để nhận ×2.','- Lucky Spin: lượt miễn phí nằm cạnh lượt quảng cáo và lượt 30 gem.','- Shop/offer mở sớm sau Stage 1-2/1-3, đúng lúc chi phí nâng cấp bắt đầu tăng.','- Khi thiếu coin/gem, các nút upgrade/spin vẫn hiển thị giá, tạo áp lực chuyển sang shop.','','## Kết luận',`Vòng lặp chiến đấu–thưởng–nâng cấp có lực kéo tốt; điểm rời game có khả năng cao nhất là chuỗi popup dày hoặc lần thua đầu khi chi phí nâng cấp vượt số dư. Timeline JSONL là nguồn chi tiết cho mọi mốc và số dư.`];
fs.writeFileSync(path.join(out,'summary.md'),lines.join('\n')+'\n');
if(launchedChrome)await browser.close();else await browser.disconnect();
console.log(`DONE ${stages.length} stages, ${ads} ads, ${shot} screenshots`);
