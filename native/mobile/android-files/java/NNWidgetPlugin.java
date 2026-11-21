package com.h24creationz.nudgenudge;

import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

/** Lets the app ask the home-screen widget to redraw right after data changes. */
@CapacitorPlugin(name = "NNWidget")
public class NNWidgetPlugin extends Plugin {
    @PluginMethod
    public void refresh(PluginCall call) {
        try { NNWidget.refresh(getContext()); } catch (Exception ignored) { }
        call.resolve();
    }
}
