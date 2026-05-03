/**
 * Push notifications — Expo Push (relays to APNs + FCM transparently).
 *
 * We register the device, store the token locally, and POST it to the
 * backend at /api/push/register (which we'll add as a Phase-3 follow-up
 * on the web side). Until the endpoint exists, the token is logged so we
 * can verify registration during preview testing.
 */

import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const TOKEN_KEY = "vidda-push-token";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export async function registerForPushNotifications(): Promise<string | null> {
  // expo-notifications returns no token on simulators / web; we just try and bail on error.
  if (Platform.OS === "web") return null;

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "VIDDA",
      importance: Notifications.AndroidImportance.DEFAULT,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#800020",
    });
  }

  const { status: existing } = await Notifications.getPermissionsAsync();
  let final = existing;
  if (existing !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    final = status;
  }
  if (final !== "granted") return null;

  try {
    const projectId = (Constants.expoConfig?.extra as { eas?: { projectId?: string } } | undefined)?.eas?.projectId;
    const tokenResp = await Notifications.getExpoPushTokenAsync(
      projectId ? { projectId } : undefined
    );
    const token = tokenResp.data;
    await AsyncStorage.setItem(TOKEN_KEY, token);
    console.log("[push] device token", token);

    // POST to backend (best effort; endpoint may not exist yet)
    const apiBase = (Constants.expoConfig?.extra as { apiBaseUrl?: string } | undefined)?.apiBaseUrl ?? "https://www.viddawear.store";
    fetch(`${apiBase}/api/push/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, platform: Platform.OS }),
    }).catch(() => { /* expected if endpoint not deployed */ });

    return token;
  } catch (e) {
    console.warn("[push] failed to obtain Expo push token", e);
    return null;
  }
}
