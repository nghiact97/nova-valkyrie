package com.novavanguard.game;

import com.android.billingclient.api.AcknowledgePurchaseParams;
import com.android.billingclient.api.BillingClient;
import com.android.billingclient.api.BillingClientStateListener;
import com.android.billingclient.api.BillingFlowParams;
import com.android.billingclient.api.BillingResult;
import com.android.billingclient.api.ConsumeParams;
import com.android.billingclient.api.PendingPurchasesParams;
import com.android.billingclient.api.ProductDetails;
import com.android.billingclient.api.Purchase;
import com.android.billingclient.api.PurchasesUpdatedListener;
import com.android.billingclient.api.QueryProductDetailsParams;
import com.android.billingclient.api.QueryPurchasesParams;
import com.getcapacitor.JSArray;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Google Play Billing (library 8) for one-time products.
 * The plugin never grants or consumes on its own: JS grants the item, then calls finish()
 * (consume for coin packs, acknowledge for No Ads). Unfinished purchases come back from owned()
 * and Play refunds anything left unacknowledged for 3 days, so a crash never loses a paid item.
 */
@CapacitorPlugin(name = "NvBilling")
public class NvBillingPlugin extends Plugin implements PurchasesUpdatedListener {
  private BillingClient client;
  private final Map<String, ProductDetails> details = new HashMap<>();
  private PluginCall buyCall;

  @Override
  public void load() {
    client = BillingClient.newBuilder(getContext())
      .setListener(this)
      .enablePendingPurchases(PendingPurchasesParams.newBuilder().enableOneTimeProducts().build())
      .enableAutoServiceReconnection()
      .build();
  }

  private interface Ready { void run(); }

  private void whenReady(PluginCall call, Ready ok) {
    if (client.isReady()) { ok.run(); return; }
    client.startConnection(new BillingClientStateListener() {
      @Override public void onBillingSetupFinished(BillingResult r) {
        if (r.getResponseCode() == BillingClient.BillingResponseCode.OK) ok.run();
        else call.reject("setup failed: " + r.getResponseCode() + " " + r.getDebugMessage());
      }
      @Override public void onBillingServiceDisconnected() { /* auto reconnection is enabled */ }
    });
  }

  private static JSObject toJs(Purchase p) {
    JSObject o = new JSObject();
    o.put("productId", p.getProducts().isEmpty() ? "" : p.getProducts().get(0));
    o.put("token", p.getPurchaseToken());
    o.put("orderId", p.getOrderId());
    o.put("state", p.getPurchaseState() == Purchase.PurchaseState.PURCHASED ? "purchased" : p.getPurchaseState() == Purchase.PurchaseState.PENDING ? "pending" : "unknown");
    o.put("acknowledged", p.isAcknowledged());
    return o;
  }

  private static JSArray toJs(List<Purchase> list) {
    JSArray a = new JSArray();
    if (list != null) for (Purchase p : list) a.put(toJs(p));
    return a;
  }

  /** products({ ids: string[] }) -> { products: [{ id, title, price }] } */
  @PluginMethod
  public void products(PluginCall call) {
    List<String> ids;
    try { ids = call.getArray("ids").toList(); } catch (Exception e) { call.reject("ids required"); return; }
    whenReady(call, () -> {
      List<QueryProductDetailsParams.Product> ps = new ArrayList<>();
      for (String id : ids) ps.add(QueryProductDetailsParams.Product.newBuilder().setProductId(id).setProductType(BillingClient.ProductType.INAPP).build());
      client.queryProductDetailsAsync(QueryProductDetailsParams.newBuilder().setProductList(ps).build(), (r, res) -> {
        if (r.getResponseCode() != BillingClient.BillingResponseCode.OK) { call.reject("query failed: " + r.getResponseCode()); return; }
        JSArray out = new JSArray();
        for (ProductDetails pd : res.getProductDetailsList()) {
          details.put(pd.getProductId(), pd);
          ProductDetails.OneTimePurchaseOfferDetails o = pd.getOneTimePurchaseOfferDetails();
          JSObject j = new JSObject();
          j.put("id", pd.getProductId());
          j.put("title", pd.getName());
          j.put("price", o != null ? o.getFormattedPrice() : "");
          out.put(j);
        }
        JSObject ret = new JSObject();
        ret.put("products", out);
        call.resolve(ret);
      });
    });
  }

  /** buy({ id }) -> { result: 'ok'|'cancel'|'owned'|'fail', purchases: [...] } */
  @PluginMethod
  public void buy(PluginCall call) {
    String id = call.getString("id");
    ProductDetails pd = id == null ? null : details.get(id);
    if (pd == null) { call.reject("unknown product " + id + " (call products() first)"); return; }
    if (buyCall != null) { call.reject("busy"); return; }
    whenReady(call, () -> getActivity().runOnUiThread(() -> {
      BillingFlowParams.ProductDetailsParams pdp = BillingFlowParams.ProductDetailsParams.newBuilder().setProductDetails(pd).build();
      BillingFlowParams params = BillingFlowParams.newBuilder().setProductDetailsParamsList(Collections.singletonList(pdp)).build();
      buyCall = call;
      BillingResult r = client.launchBillingFlow(getActivity(), params);
      if (r.getResponseCode() != BillingClient.BillingResponseCode.OK) { buyCall = null; resolveBuy(call, r.getResponseCode(), null); }
    }));
  }

  private void resolveBuy(PluginCall call, int code, List<Purchase> purchases) {
    JSObject ret = new JSObject();
    String result = code == BillingClient.BillingResponseCode.OK ? "ok"
      : code == BillingClient.BillingResponseCode.USER_CANCELED ? "cancel"
      : code == BillingClient.BillingResponseCode.ITEM_ALREADY_OWNED ? "owned" : "fail";
    ret.put("result", result);
    ret.put("code", code);
    ret.put("purchases", toJs(purchases));
    call.resolve(ret);
  }

  @Override
  public void onPurchasesUpdated(BillingResult r, List<Purchase> purchases) {
    PluginCall call = buyCall;
    buyCall = null;
    if (call != null) { resolveBuy(call, r.getResponseCode(), purchases); return; }
    // a pending purchase completed while no buy() was waiting
    JSObject ev = new JSObject();
    ev.put("purchases", toJs(purchases));
    notifyListeners("purchases", ev);
  }

  /** owned() -> { purchases: [...] } every one-time purchase Play still holds for this user (incl. unconsumed) */
  @PluginMethod
  public void owned(PluginCall call) {
    whenReady(call, () -> client.queryPurchasesAsync(
      QueryPurchasesParams.newBuilder().setProductType(BillingClient.ProductType.INAPP).build(),
      (r, list) -> {
        if (r.getResponseCode() != BillingClient.BillingResponseCode.OK) { call.reject("owned failed: " + r.getResponseCode()); return; }
        JSObject ret = new JSObject();
        ret.put("purchases", toJs(list));
        call.resolve(ret);
      }));
  }

  /** finish({ token, consume }) consume a coin pack or acknowledge a permanent item */
  @PluginMethod
  public void finish(PluginCall call) {
    String token = call.getString("token");
    boolean consume = Boolean.TRUE.equals(call.getBoolean("consume", false));
    if (token == null) { call.reject("token required"); return; }
    whenReady(call, () -> {
      if (consume) {
        client.consumeAsync(ConsumeParams.newBuilder().setPurchaseToken(token).build(), (r, t) -> done(call, r));
      } else {
        client.acknowledgePurchase(AcknowledgePurchaseParams.newBuilder().setPurchaseToken(token).build(), (r) -> done(call, r));
      }
    });
  }

  private static void done(PluginCall call, BillingResult r) {
    JSObject ret = new JSObject();
    ret.put("ok", r.getResponseCode() == BillingClient.BillingResponseCode.OK);
    ret.put("code", r.getResponseCode());
    call.resolve(ret);
  }
}
