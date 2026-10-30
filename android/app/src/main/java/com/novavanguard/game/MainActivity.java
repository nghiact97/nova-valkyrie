package com.novavanguard.game;

import android.os.Build;
import android.os.Bundle;
import android.view.WindowManager;
import android.webkit.WebView;
import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowCompat;
import androidx.core.view.WindowInsetsCompat;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
  private int insetTop = 0, insetBottom = 0;

  @Override
  public void onCreate(Bundle savedInstanceState) {
    registerPlugin(NvBillingPlugin.class);
    super.onCreate(savedInstanceState);
    // edge-to-edge: the game draws behind the status bar, the camera cutout and the gesture bar
    WindowCompat.setDecorFitsSystemWindows(getWindow(), false);
    getWindow().setStatusBarColor(0x00000000);
    getWindow().setNavigationBarColor(0x00000000);
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.P) {
      getWindow().getAttributes().layoutInDisplayCutoutMode = WindowManager.LayoutParams.LAYOUT_IN_DISPLAY_CUTOUT_MODE_SHORT_EDGES;
    }
    // Android WebView does not report env(safe-area-inset-*): pass the real insets to CSS as --sat / --sab (CSS px)
    ViewCompat.setOnApplyWindowInsetsListener(getWindow().getDecorView(), (v, insets) -> {
      Insets i = insets.getInsets(WindowInsetsCompat.Type.systemBars() | WindowInsetsCompat.Type.displayCutout());
      float d = getResources().getDisplayMetrics().density;
      insetTop = Math.round(i.top / d); insetBottom = Math.round(i.bottom / d);
      pushInsets();
      return insets;
    });
  }

  @Override
  public void onResume() {
    super.onResume();
    pushInsets();
  }

  private void pushInsets() {
    if (getBridge() == null) return;
    WebView w = getBridge().getWebView();
    if (w == null) return;
    String js = "document.documentElement.style.setProperty('--sat','" + insetTop + "px');"
      + "document.documentElement.style.setProperty('--sab','" + insetBottom + "px');";
    w.post(() -> w.evaluateJavascript(js, null));
    w.postDelayed(() -> w.evaluateJavascript(js, null), 1500);   // again after the page has loaded
  }
}
