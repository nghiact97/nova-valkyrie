/* Native bridge for the Android app (injected by tools/build-www.mjs, never part of the web playtest).
 * Exposes window.NV_NATIVE = { ads, billing } on top of Capacitor plugins:
 *   - AdMob (@capacitor-community/admob): UMP consent, preloaded rewarded + interstitial
 *   - NvBilling (android/.../NvBillingPlugin.java): Play Billing 8 one-time products
 * The game grants items through window.__nvGrant(productId, fresh) and never talks to plugins directly.
 * Ad unit ids: Google's public test ids until Nova Vanguard has its own AdMob units (window.NV_ADS_LIVE). */
(function () {
  var C = window.Capacitor;
  if (!C || !C.Plugins || !C.isNativePlatform || !C.isNativePlatform()) return;
  var AdMob = C.Plugins.AdMob, Billing = C.Plugins.NvBilling;
  var LIVE = window.NV_ADS_LIVE || null; // { rewarded, interstitial } once real units exist
  var IDS = LIVE || { rewarded: 'ca-app-pub-3940256099942544/5224354917', interstitial: 'ca-app-pub-3940256099942544/1033173712' };
  var TESTING = !LIVE;
  function timeout(p, ms) { return Promise.race([p, new Promise(function (_, rej) { setTimeout(function () { rej(new Error('timeout')); }, ms); })]); }
  function on(name, fn) { return AdMob.addListener(name, fn); }

  /* ---------------- ads ---------------- */
  var ads = { ready: false, showing: false, rewardLoaded: false, interLoaded: false, busy: false };
  function loadReward() { return timeout(AdMob.prepareRewardVideoAd({ adId: IDS.rewarded, isTesting: TESTING }), 15000).then(function () { ads.rewardLoaded = true; }, function () { ads.rewardLoaded = false; }); }
  function loadInter() { return timeout(AdMob.prepareInterstitial({ adId: IDS.interstitial, isTesting: TESTING }), 15000).then(function () { ads.interLoaded = true; }, function () { ads.interLoaded = false; }); }
  ads.consent = function (force) {
    var p = force ? AdMob.resetConsentInfo() : Promise.resolve();
    return p.then(function () { return timeout(AdMob.requestConsentInfo(), 6000); }).then(function (info) {
      if (info.isConsentFormAvailable && (force || info.status === 'REQUIRED')) return AdMob.showConsentForm().then(function () { return true; });
      return !!info.isConsentFormAvailable;
    }).catch(function () { return false; });
  };
  /* resolves 'reward' | 'closed' | 'fail' */
  ads.rewarded = function () {
    if (!ads.ready || ads.busy) return Promise.resolve('fail');
    ads.busy = true;
    var earned = false, subs = [];
    var run = (ads.rewardLoaded ? Promise.resolve() : loadReward()).then(function () {
      if (!ads.rewardLoaded) return 'fail';
      return new Promise(function (res) {
        Promise.all([
          on('onRewardedVideoAdReward', function () { earned = true; }),
          on('onRewardedVideoAdDismissed', function () { res(); }),
          on('onRewardedVideoAdFailedToShow', function () { res(); })
        ]).then(function (h) { subs = h; ads.rewardLoaded = false; ads.showing = true; AdMob.showRewardVideoAd().catch(function () { res(); }); });
        setTimeout(res, 120000);
      }).then(function () { return earned ? 'reward' : 'closed'; });
    });
    return run.catch(function () { return 'fail'; }).then(function (r) {
      subs.forEach(function (h) { h.remove(); }); ads.showing = false; ads.busy = false; loadReward(); return r;
    });
  };
  /* always resolves */
  ads.interstitial = function () {
    if (!ads.ready || ads.busy || !ads.interLoaded) { if (ads.ready && !ads.interLoaded) loadInter(); return Promise.resolve(false); }
    ads.busy = true;
    var subs = [];
    return new Promise(function (res) {
      Promise.all([
        on('interstitialAdDismissed', function () { res(true); }),
        on('interstitialAdFailedToShow', function () { res(false); })
      ]).then(function (h) { subs = h; ads.interLoaded = false; ads.showing = true; AdMob.showInterstitial().catch(function () { res(false); }); });
      setTimeout(function () { res(false); }, 60000);
    }).then(function (shown) { subs.forEach(function (h) { h.remove(); }); ads.showing = false; ads.busy = false; loadInter(); return shown; });
  };
  if (AdMob) {
    AdMob.initialize({ initializeForTesting: TESTING })
      .then(function () { return ads.consent(false); })
      .then(function () { ads.ready = true; loadReward(); loadInter(); })
      .catch(function () { ads.ready = false; });
  }

  /* ---------------- billing ---------------- */
  var PRODUCTS = ['nv_gems_80', 'nv_gems_450', 'nv_gems_1000', 'nv_gems_2200', 'nv_gems_6000', 'nv_gems_13000', 'nv_starter', 'nv_seraph'];
  var PERMANENT = { nv_starter: true, nv_seraph: true }; // one-time packs: re-granted (flag only) on restore
  var KEY = 'nv.iapGranted';
  var billing = { ready: false, prices: {} };
  var inFlight = {};
  function granted() { try { return JSON.parse(localStorage.getItem(KEY) || '[]'); } catch (e) { return []; } }
  function markGranted(t) { var g = granted(); if (g.indexOf(t) >= 0) return; g.push(t); try { localStorage.setItem(KEY, JSON.stringify(g.slice(-200))); } catch (e) {} }
  function handleOne(p) {
    var permanent = !!PERMANENT[p.productId], fresh = granted().indexOf(p.token) < 0, any = false;
    if (fresh || permanent) {
      var ok = false; try { ok = !!(window.__nvGrant && window.__nvGrant(p.productId, fresh)); } catch (e) { ok = false; }
      if (!ok) return Promise.resolve(false);
      if (fresh) { any = true; markGranted(p.token); }
    }
    if (permanent && p.acknowledged) return Promise.resolve(any);
    return Billing.finish({ token: p.token, consume: !permanent }).catch(function () {}).then(function () { return any; });
  }
  function handle(list) {
    var chain = Promise.resolve(false);
    (list || []).forEach(function (p) {
      if (p.state !== 'purchased' || inFlight[p.token]) return;
      inFlight[p.token] = 1;
      chain = chain.then(function (any) { return handleOne(p).then(function (a) { delete inFlight[p.token]; return any || a; }); });
    });
    return chain;
  }
  billing.sync = function () { return Billing.owned().then(function (r) { return handle(r.purchases); }).catch(function () { return false; }); };
  /* resolves 'ok' | 'pending' | 'cancel' | 'fail' */
  billing.buy = function (id) {
    if (!billing.ready) return Promise.resolve('fail');
    return Billing.buy({ id: id }).then(function (r) {
      if (r.result === 'owned') return billing.sync().then(function () { return 'ok'; });
      if (r.result !== 'ok') return r.result === 'cancel' ? 'cancel' : 'fail';
      if ((r.purchases || []).some(function (p) { return p.state === 'pending'; })) return 'pending';
      return handle(r.purchases).then(function () { return 'ok'; });
    }).catch(function () { return 'fail'; });
  };
  if (Billing) {
    Billing.products({ ids: PRODUCTS }).then(function (r) {
      (r.products || []).forEach(function (p) { billing.prices[p.id] = p.price; });
      billing.ready = (r.products || []).length > 0;
      Billing.addListener('purchases', function (ev) { handle(ev.purchases); });
      return billing.sync();
    }).catch(function () { billing.ready = false; });
    if (C.Plugins.App) C.Plugins.App.addListener('resume', function () { if (billing.ready) billing.sync(); });
  }

  window.NV_NATIVE = { ads: ads, billing: billing };
})();
