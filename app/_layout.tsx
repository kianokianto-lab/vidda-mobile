import { useEffect } from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { useCart } from "@/lib/cart";
import { useAuth } from "@/lib/auth";
import { registerForPushNotifications } from "@/lib/push";
import { colors } from "@/lib/tokens";

export default function RootLayout() {
  const hydrateCart = useCart((s) => s.hydrate);
  const hydrateAuth = useAuth((s) => s.hydrate);

  useEffect(() => {
    hydrateCart();
    hydrateAuth();
    // Fire-and-forget — never blocks app render.
    registerForPushNotifications().catch(() => { /* user denied or simulator */ });
  }, [hydrateCart, hydrateAuth]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <StatusBar style="light" />
        <Stack
          screenOptions={{
            headerStyle: { backgroundColor: colors.ink },
            headerTintColor: colors.ivory,
            headerTitleStyle: { fontWeight: "800" },
            contentStyle: { backgroundColor: colors.ivory },
          }}
        >
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="product/[slug]" options={{ title: "" }} />
          <Stack.Screen name="checkout" options={{ title: "CHECKOUT", presentation: "modal" }} />
          <Stack.Screen name="auth/login" options={{ title: "SIGN IN", presentation: "modal" }} />
          <Stack.Screen name="auth/signup" options={{ title: "SIGN UP", presentation: "modal" }} />
        </Stack>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
