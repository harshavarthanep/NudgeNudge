package com.h24creationz.nudgenudge;

import android.app.PendingIntent;
import android.appwidget.AppWidgetManager;
import android.appwidget.AppWidgetProvider;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.graphics.Color;
import android.widget.RemoteViews;
import org.json.JSONObject;

/** Home-screen widget: companion eyes, the next reminder and today's progress. */
public class NNWidget extends AppWidgetProvider {
    @Override
    public void onUpdate(Context ctx, AppWidgetManager mgr, int[] ids) {
        updateAll(ctx, mgr, ids);
    }

    public static void refresh(Context ctx) {
        AppWidgetManager mgr = AppWidgetManager.getInstance(ctx);
        int[] ids = mgr.getAppWidgetIds(new ComponentName(ctx, NNWidget.class));
        updateAll(ctx, mgr, ids);
    }

    static void updateAll(Context ctx, AppWidgetManager mgr, int[] ids) {
        if (ids == null || ids.length == 0) return;
        SharedPreferences sp = ctx.getSharedPreferences("CapacitorStorage", Context.MODE_PRIVATE);
        String line = "Nothing pending";
        String when = "Tap to add something";
        String rings = "";
        String mood = "happy";
        int accent = Color.parseColor("#8BE9C6");
        try {
            String raw = sp.getString("nn_widget", null);
            if (raw != null) {
                JSONObject o = new JSONObject(raw);
                line = o.optString("line", line);
                when = o.optString("when", when);
                rings = o.optString("rings", rings);
                mood = o.optString("mood", mood);
                String a = o.optString("accent", "");
                if (a.startsWith("#")) accent = Color.parseColor(a);
            }
        } catch (Exception ignored) { }
        int eye = "worried".equals(mood) ? Color.parseColor("#FFB547") : accent;
        Intent launch = ctx.getPackageManager().getLaunchIntentForPackage(ctx.getPackageName());
        PendingIntent pi = launch == null ? null : PendingIntent.getActivity(ctx, 0, launch, PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);
        for (int id : ids) {
            RemoteViews v = new RemoteViews(ctx.getPackageName(), R.layout.nn_widget);
            v.setTextViewText(R.id.nn_line, line);
            v.setTextViewText(R.id.nn_when, when);
            v.setTextViewText(R.id.nn_rings, rings);
            v.setInt(R.id.nn_eye_l, "setColorFilter", eye);
            v.setInt(R.id.nn_eye_r, "setColorFilter", eye);
            if (pi != null) v.setOnClickPendingIntent(R.id.nn_root, pi);
            mgr.updateAppWidget(id, v);
        }
    }
}
