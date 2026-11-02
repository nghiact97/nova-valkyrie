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
import java.util.Calendar;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Google Play Billing (library 8): one-time products + subscriptions (VIP "nv_vip_monthly").
 * The plugin never grants or consumes on its own: JS grants the item, then calls finish()
 * (consume for coin packs, acknowledge for No Ads / packs / subscriptions). Unfinished purchases come back from
 * owned() / subs() and Play refunds anything left unacknowledged for 3 days, so a crash never loses a paid item.
 * Subscriptions: subs() returns only what Play still holds (active, grace period, cancelled-but-not-expired);
 * expired / on hold / paused subscriptions are simply absent, so JS turns VIP off. The client library does not
 * give an expiry date, so "expiry" = end of the current billing period (purchaseTime + k * period, first one after now).
 * subs() runs on JS start; on every app resume the plugin re-queries and fires a "subs" event.
 */
@CapacitorPlugin(name = "NvBilling")
public class NvBillingPlugin extends Plugin implements PurchasesUpdatedListener {
  private BillingClient client;
  private final Map<String, ProductDetails> details = new HashMap<>();
  private PluginCall buyCall;
  private boolean connectedOnce = false;

  @Override
  public void load() {
    client = BillingClient.newBuilder(getContext())
      .setListener(this)
      .enablePendingPurchases(PendingPurchasesParams.newBuilder().enableOneTimeProducts().enablePrepaidPlans().build())
      .enableAutoServiceReconnection()
      .build();
  }

  private interface Ready { void run(); }

  private void whenReady(PluginCall call, Ready ok) {
    if (client.isReady()) { ok.run(); return; }
    client.startConnection(new BillingClientStateListener() {
      @Override public void onBillingSetupFinished(BillingResult r) {
        if (r.getResponseCode() == BillingClient.BillingResponseCode.OK) { connectedOnce = true; ok.run(); }
        else if (call != null) call.reject("setup failed: " + r.getResponseCode() + " " + r.getDebugMessage());
      }
      @Override public void onBillingServiceDisconnected() { /* auto reconnection is enabled */ }
    });
  }

  private static boolean isSubs(ProductDetails pd) {
    return pd != null && BillingClient.ProductType.SUBS.equals(pd.getProductType());
  }

  /** the base plan offer (no offerId), else the first offer */
  private static ProductDetails.SubscriptionOfferDetails baseOffer(ProductDetails pd) {
    List<ProductDetails.SubscriptionOfferDetails> list = pd.getSubscriptionOfferDetails();
    if (list == null || list.isEmpty()) return null;
    for (ProductDetails.SubscriptionOfferDetails o : list) if (o.getOfferId() == null) return o;
    return list.get(0);
  }

  /** the recurring price phase of an offer (intro phases, if any, come first) */
  private static ProductDetails.PricingPhase recurringPhase(ProductDetails.SubscriptionOfferDetails o) {
    if (o == null) return null;
    List<ProductDetails.PricingPhase> ph = o.getPricingPhases().getPricingPhaseList();
    return ph == null || ph.isEmpty() ? null : ph.get(ph.size() - 1);
  }

  private String periodOf(String productId) {
    ProductDetails.PricingPhase ph = isSubs(details.get(productId)) ? recurringPhase(baseOffer(details.get(productId))) : null;
    return ph != null ? ph.getBillingPeriod() : "P1M";
  }

  private static int num(String s) { return s == null ? 0 : Integer.parseInt(s); }

  /** end of the current paid period: the first start + k * period (ISO 8601, e.g. P1M) that lies in the future */
  private static long periodEnd(long start, String iso) {
    Matcher m = Pattern.compile("P(?:(\\d+)Y)?(?:(\\d+)M)?(?:(\\d+)W)?(?:(\\d+)D)?").matcher(iso == null ? "" : iso);
    int y = 0, mo = 0, d = 0;
    if (m.matches()) { y = num(m.group(1)); mo = num(m.group(2)); d = num(m.group(3)) * 7 + num(m.group(4)); }
    if (y + mo + d == 0) mo = 1;
    long now = System.currentTimeMillis();
    for (int k = 1; k <= 5000; k++) {
      Calendar c = Calendar.getInstance();
      c.setTimeInMillis(start);
      c.add(Calendar.YEAR, y * k);
      c.add(Calendar.MONTH, mo * k);
      c.add(Calendar.DAY_OF_MONTH, d * k);
      if (c.getTimeInMillis() > now) return c.getTimeInMillis();
    }
    return now;
  }

  private JSObject toJs(Purchase p, boolean sub) {
    JSObject o = new JSObject();
    String id = p.getProducts().isEmpty() ? "" : p.getProducts().get(0);
    boolean purchased = p.getPurchaseState() == Purchase.PurchaseState.PURCHASED;
    o.put("productId", id);
    o.put("token", p.getPurchaseToken());
    o.put("orderId", p.getOrderId());
    o.put("state", purchased ? "purchased" : p.getPurchaseState() == Purchase.PurchaseState.PENDING ? "pending" : "unknown");
    o.put("acknowledged", p.isAcknowledged());
    o.put("time", p.getPurchaseTime());
    o.put("autoRenew", p.isAutoRenewing());
    if (sub || isSubs(details.get(id))) o.put("expiry", purchased ? periodEnd(p.getPurchaseTime(), periodOf(id)) : 0);
    return o;
  }

  private JSArray toJs(List<Purchase> list, boolean sub) {
    JSArray a = new JSArray();
    if (list != null) for (Purchase p : list) a.put(toJs(p, sub));
    return a;
  }

  /** products({ ids: string[], type?: 'inapp'|'subs' }) -> { products: [{ id, title, price, type, period? }] } */
  @PluginMethod
  public void products(PluginCall call) {
    List<String> ids;
    try { ids = call.getArray("ids").toList(); } catch (Exception e) { call.reject("ids required"); return; }
    String type = "subs".equals(call.getString("type")) ? BillingClient.ProductType.SUBS : BillingClient.ProductType.INAPP;
    whenReady(call, () -> {
      List<QueryProductDetailsParams.Product> ps = new ArrayList<>();
      for (String id : ids) ps.add(QueryProductDetailsParams.Product.newBuilder().setProductId(id).setProductType(type).build());
      client.queryProductDetailsAsync(QueryProductDetailsParams.newBuilder().setProductList(ps).build(), (r, res) -> {
        if (r.getResponseCode() != BillingClient.BillingResponseCode.OK) { call.reject("query failed: " + r.getResponseCode()); return; }
        JSArray out = new JSArray();
        for (ProductDetails pd : res.getProductDetailsList()) {
          details.put(pd.getProductId(), pd);
          JSObject j = new JSObject();
          j.put("id", pd.getProductId());
          j.put("title", pd.getName());
          if (isSubs(pd)) {
            ProductDetails.PricingPhase ph = recurringPhase(baseOffer(pd));
            j.put("type", "subs");
            j.put("price", ph != null ? ph.getFormattedPrice() : "");
            j.put("period", ph != null ? ph.getBillingPeriod() : "");
          } else {
            ProductDetails.OneTimePurchaseOfferDetails o = pd.getOneTimePurchaseOfferDetails();
            j.put("type", "inapp");
            j.put("price", o != null ? o.getFormattedPrice() : "");
          }
          out.put(j);
        }
        JSObject ret = new JSObject();
        ret.put("products", out);
        call.resolve(ret);
      });
    });
  }

  /** buy({ id }) -> { result: 'ok'|'cancel'|'owned'|'fail', purchases: [...] } (subscriptions buy their base plan offer) */
  @PluginMethod
  public void buy(PluginCall call) {
    String id = call.getString("id");
    ProductDetails pd = id == null ? null : details.get(id);
    if (pd == null) { call.reject("unknown product " + id + " (call products() first)"); return; }
    if (buyCall != null) { call.reject("busy"); return; }
    BillingFlowParams.ProductDetailsParams.Builder b = BillingFlowParams.ProductDetailsParams.newBuilder().setProductDetails(pd);
    if (isSubs(pd)) {
      ProductDetails.SubscriptionOfferDetails offer = baseOffer(pd);
      if (offer == null) { call.reject("no offer for " + id + " (activate a base plan in Play Console)"); return; }
      b.setOfferToken(offer.getOfferToken());
    }
    BillingFlowParams.ProductDetailsParams pdp = b.build();
    whenReady(call, () -> getActivity().runOnUiThread(() -> {
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
    ret.put("purchases", toJs(purchases, false));
    call.resolve(ret);
  }

  @Override
  public void onPurchasesUpdated(BillingResult r, List<Purchase> purchases) {
    PluginCall call = buyCall;
    buyCall = null;
    if (call != null) { resolveBuy(call, r.getResponseCode(), purchases); return; }
    // a pending purchase completed (or a subscription changed) while no buy() was waiting
    JSObject ev = new JSObject();
    ev.put("purchases", toJs(purchases, false));
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
        ret.put("purchases", toJs(list, false));
        call.resolve(ret);
      }));
  }

  private interface SubsDone { void run(BillingResult r, JSObject state); }

  private void querySubs(SubsDone done) {
    client.queryPurchasesAsync(
      QueryPurchasesParams.newBuilder().setProductType(BillingClient.ProductType.SUBS).build(),
      (r, list) -> {
        boolean active = false, pending = false;
        if (list != null) for (Purchase p : list) {
          if (p.getPurchaseState() == Purchase.PurchaseState.PURCHASED) active = true;
          else if (p.getPurchaseState() == Purchase.PurchaseState.PENDING) pending = true;
        }
        JSObject st = new JSObject();
        st.put("active", active);
        st.put("pending", pending);
        st.put("purchases", toJs(list, true));
        done.run(r, st);
      });
  }

  /** subs() -> { active, pending, purchases: [{ productId, token, state, acknowledged, autoRenew, time, expiry }] } */
  @PluginMethod
  public void subs(PluginCall call) {
    whenReady(call, () -> querySubs((r, st) -> {
      if (r.getResponseCode() != BillingClient.BillingResponseCode.OK) { call.reject("subs failed: " + r.getResponseCode()); return; }
      call.resolve(st);
    }));
  }

  /** app back in front: renewals, cancellations and expiries made outside the app show up here */
  @Override
  protected void handleOnResume() {
    super.handleOnResume();
    if (client == null || !connectedOnce) return; // first start: JS queries subs() itself
    querySubs((r, st) -> { if (r.getResponseCode() == BillingClient.BillingResponseCode.OK) notifyListeners("subs", st); });
  }

  /** finish({ token, consume }) consume a coin pack or acknowledge a permanent item / subscription */
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
