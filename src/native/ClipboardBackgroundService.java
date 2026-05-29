package com.clipflow.app;

import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.Service;
import android.content.ClipData;
import android.content.ClipboardManager;
import android.content.Context;
import android.content.Intent;
import android.os.Build;
import android.os.IBinder;
import androidx.annotation.Nullable;
import androidx.core.app.NotificationCompat;

public class ClipboardBackgroundService extends Service {
    private static final String CHANNEL_ID = "ClipflowBackgroundServiceChannel";
    private ClipboardManager clipboardManager;
    private ClipboardManager.OnPrimaryClipChangedListener listener;

    @Override
    public void onCreate() {
        super.onCreate();
        createNotificationChannel();
        
        Notification notification = new NotificationCompat.Builder(this, CHANNEL_ID)
                .setContentTitle("Clipflow Listening Active")
                .setContentText("Clipflow is safely monitoring clipboard updates locally.")
                .setSmallIcon(R.mipmap.ic_launcher)
                .build();
                
        startForeground(1, notification);

        clipboardManager = (ClipboardManager) getSystemService(Context.CLIPBOARD_SERVICE);
        listener = new ClipboardManager.OnPrimaryClipChangedListener() {
            @Override
            public void onPrimaryClipChanged() {
                if (clipboardManager.hasPrimaryClip()) {
                    ClipData clipData = clipboardManager.getPrimaryClip();
                    if (clipData != null && clipData.getItemCount() > 0) {
                        CharSequence copiedText = clipData.getItemAt(0).getText();
                        if (copiedText != null) {
                            handleCopiedText(copiedText.toString());
                        }
                    }
                }
            }
        };
        clipboardManager.addPrimaryClipChangedListener(listener);
    }

    private void handleCopiedText(String text) {
        // Broadcast updates or save directly to a shared SQLite/SharedPref local database
        Intent intent = new Intent("com.clipflow.CLIPBOARD_UPDATE");
        intent.putExtra("copied_text", text);
        sendBroadcast(intent);
    }

    private void createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            NotificationChannel serviceChannel = new NotificationChannel(
                    CHANNEL_ID,
                    "Clipflow Clipboard Foreground Listening Channel",
                    NotificationManager.IMPORTANCE_LOW
            );
            NotificationManager manager = getSystemService(NotificationManager.class);
            if (manager != null) {
                manager.createNotificationChannel(serviceChannel);
            }
        }
    }

    @Override
    public void onDestroy() {
        if (clipboardManager != null && listener != null) {
            clipboardManager.removePrimaryClipChangedListener(listener);
        }
        super.onDestroy();
    }

    @Nullable
    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }
}
