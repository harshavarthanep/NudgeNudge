package com.h24creationz.nudgenudge;

import android.os.Bundle;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        registerPlugin(NNWidgetPlugin.class);
        super.onCreate(savedInstanceState);
    }
}
