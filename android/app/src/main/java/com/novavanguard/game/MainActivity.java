package com.novavanguard.game;

import android.os.Bundle;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
  @Override
  public void onCreate(Bundle savedInstanceState) {
    registerPlugin(NvBillingPlugin.class);
    super.onCreate(savedInstanceState);
  }
}
