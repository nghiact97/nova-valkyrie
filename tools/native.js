// Android bridge (Capacitor). Injected at the end of www/index.html by tools/build-www.mjs.
// Uses the game's globals: cur, B, veil, closePop, resume, pauseGame, go, pop, S.
(function () {
  var C = window.Capacitor; if (!C || !C.Plugins) return;
  var P = C.Plugins;

  // haptics instead of navigator.vibrate (still gated by the Vibration setting)
  if (P.Haptics) window.vib = function (ms) { if (!S.set.vib) return; P.Haptics.vibrate({ duration: Math.max(20, Math.min(400, ms || 40)) }).catch(function () {}); };

  function back() {
    if (!veil.hidden) {                                   // 1. a popup is open
      if (cur === 'battle' && B && B.paused && !B.over) { resume(); return; }
      var x = veil.querySelector('.pop .x'); if (x) x.click(); else closePop(); return;
    }
    if (cur === 'battle' && B && !B.over && !B.picking) { pauseGame(); return; }   // 2. pause the fight
    if (cur === 'battle') return;
    if (cur !== 'home' && cur !== 'load') { go('home'); return; }                  // 3. back to Home
    var p = pop('Exit game?', '<p style="text-align:center;font-weight:600">See you soon, pilot!</p><div class="acts"><button class="btn ghost" id="exN">Stay</button><button class="btn pink" id="exY">Exit</button></div>', 'lose');
    p.querySelector('#exN').onclick = closePop;
    p.querySelector('#exY').onclick = function () { closePop(); P.App.exitApp(); };
  }
  if (P.App) {
    P.App.addListener('backButton', back);
    P.App.addListener('pause', function () { if (cur === 'battle' && B && !B.paused && !B.over) pauseGame(); });
  }
  if (P.StatusBar) { P.StatusBar.hide().catch(function () {}); }
})();
