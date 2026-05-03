import { Image, Pressable, ScrollView, Text, View } from "react-native";
import { Link, useRouter } from "expo-router";
import { useCart, cartTotals } from "@/lib/cart";
import { colors, spacing, fontSizes } from "@/lib/tokens";

export default function CartScreen() {
  const lines = useCart((s) => s.lines);
  const setQty = useCart((s) => s.setQty);
  const removeLine = useCart((s) => s.removeLine);
  const router = useRouter();
  const { subtotal, itemCount } = cartTotals(lines);

  if (lines.length === 0) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.ivory, alignItems: "center", justifyContent: "center", padding: spacing.xl }}>
        <Text style={{ fontSize: fontSizes.xl, fontWeight: "900", textAlign: "center", color: colors.ink }}>Your cart is empty.</Text>
        <Text style={{ color: colors.muted, marginTop: spacing.sm, textAlign: "center" }}>Pick a piece from the shop. Try before you pay.</Text>
        <Link href="/shop" asChild>
          <Pressable style={{ marginTop: spacing.xl, backgroundColor: colors.burgundy, paddingVertical: 14, paddingHorizontal: 32, borderRadius: 999 }}>
            <Text style={{ color: colors.white, fontWeight: "800", letterSpacing: 1.5 }}>BROWSE SHOP</Text>
          </Pressable>
        </Link>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.ivory }}>
      <ScrollView contentContainerStyle={{ padding: spacing.md, paddingBottom: 200 }}>
        {lines.map((line) => (
          <View key={line.key} style={{ flexDirection: "row", gap: spacing.md, padding: spacing.md, backgroundColor: colors.white, borderRadius: 4, borderWidth: 1, borderColor: colors.border, marginBottom: spacing.md }}>
            {line.image && <Image source={{ uri: line.image }} style={{ width: 80, height: 100, borderRadius: 4 }} />}
            <View style={{ flex: 1 }}>
              <Text style={{ fontWeight: "800", fontSize: fontSizes.base, color: colors.ink }}>{line.title}</Text>
              {line.variantLabel && <Text style={{ color: colors.muted, fontSize: fontSizes.xs, marginTop: 2 }}>{line.variantLabel}</Text>}
              <Text style={{ color: colors.burgundy, fontWeight: "900", marginTop: spacing.sm }}>{line.price * line.qty} EGP</Text>

              <View style={{ flexDirection: "row", alignItems: "center", marginTop: spacing.sm, gap: spacing.sm }}>
                <Pressable onPress={() => setQty(line.key, line.qty - 1)} style={{ width: 28, height: 28, borderRadius: 14, borderWidth: 1.5, borderColor: colors.borderStrong, alignItems: "center", justifyContent: "center" }}>
                  <Text style={{ fontWeight: "900" }}>−</Text>
                </Pressable>
                <Text style={{ minWidth: 22, textAlign: "center", fontWeight: "800" }}>{line.qty}</Text>
                <Pressable onPress={() => setQty(line.key, line.qty + 1)} style={{ width: 28, height: 28, borderRadius: 14, borderWidth: 1.5, borderColor: colors.borderStrong, alignItems: "center", justifyContent: "center" }}>
                  <Text style={{ fontWeight: "900" }}>+</Text>
                </Pressable>
                <View style={{ flex: 1 }} />
                <Pressable onPress={() => removeLine(line.key)}>
                  <Text style={{ color: colors.burgundy, fontSize: fontSizes.xs, textTransform: "uppercase", letterSpacing: 1.5, fontWeight: "800" }}>Remove</Text>
                </Pressable>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>

      <View style={{ position: "absolute", left: 0, right: 0, bottom: 0, padding: spacing.md, backgroundColor: colors.ink, gap: spacing.sm }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <Text style={{ color: colors.ivory, fontWeight: "700", letterSpacing: 1.5, fontSize: fontSizes.sm }}>SUBTOTAL · {itemCount} ITEM{itemCount === 1 ? "" : "S"}</Text>
          <Text style={{ color: colors.white, fontWeight: "900", fontSize: fontSizes.lg }}>{subtotal} EGP</Text>
        </View>
        <Pressable onPress={() => router.push("/checkout")} style={{ backgroundColor: colors.burgundy, paddingVertical: 16, borderRadius: 999 }}>
          <Text style={{ color: colors.white, textAlign: "center", fontWeight: "900", letterSpacing: 1.5 }}>CONTINUE TO CHECKOUT</Text>
        </Pressable>
      </View>
    </View>
  );
}
