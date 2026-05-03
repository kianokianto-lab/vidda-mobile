import { Tabs } from "expo-router";
import { Text } from "react-native";
import { colors } from "@/lib/tokens";
import { useCart } from "@/lib/cart";

function TabIcon({ label, focused }: { label: string; focused: boolean }) {
  return (
    <Text
      style={{
        fontSize: 11,
        fontWeight: "800",
        letterSpacing: 1.4,
        color: focused ? colors.burgundy : colors.muted,
      }}
    >
      {label}
    </Text>
  );
}

export default function TabsLayout() {
  const itemCount = useCart((s) => s.lines.reduce((a, l) => a + l.qty, 0));
  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: colors.ink },
        headerTintColor: colors.ivory,
        headerTitleStyle: { fontWeight: "900", letterSpacing: 2 },
        tabBarStyle: { backgroundColor: colors.ink, borderTopColor: colors.borderStrong, height: 70, paddingTop: 8, paddingBottom: 14 },
        tabBarShowLabel: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "VIDDA",
          tabBarIcon: ({ focused }) => <TabIcon label="HOME" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="shop"
        options={{
          title: "SHOP",
          tabBarIcon: ({ focused }) => <TabIcon label="SHOP" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: "CART",
          tabBarIcon: ({ focused }) => <TabIcon label={itemCount > 0 ? `CART (${itemCount})` : "CART"} focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="account"
        options={{
          title: "ACCOUNT",
          tabBarIcon: ({ focused }) => <TabIcon label="ACCOUNT" focused={focused} />,
        }}
      />
    </Tabs>
  );
}
