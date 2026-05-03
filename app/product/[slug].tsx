import { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Image, Pressable, ScrollView, Text, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { api, ApiProduct } from "@/lib/api";
import { useCart } from "@/lib/cart";
import { colors, spacing, fontSizes } from "@/lib/tokens";

export default function ProductScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const router = useRouter();
  const [product, setProduct] = useState<ApiProduct | null>(null);
  const [selected, setSelected] = useState<Record<string, string>>({});
  const [qty, setQty] = useState(1);
  const addLine = useCart((s) => s.addLine);

  useEffect(() => {
    let mounted = true;
    api.products().then((all) => {
      if (!mounted) return;
      const p = all.find((x) => x.slug === slug) ?? null;
      setProduct(p);
      if (p) {
        const defaults: Record<string, string> = {};
        for (const opt of p.options) defaults[opt.name] = opt.values[0];
        setSelected(defaults);
      }
    });
    return () => { mounted = false; };
  }, [slug]);

  const variantLabel = useMemo(() => Object.values(selected).join(" / "), [selected]);
  const variantKey = useMemo(() => `${slug}::${variantLabel}`, [slug, variantLabel]);
  const optionsValid = !product || product.options.every((o) => selected[o.name]);

  if (!product) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: colors.ivory }}>
        <ActivityIndicator color={colors.burgundy} />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.ivory }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 110 }}>
        {product.images[0] && (
          <Image source={{ uri: product.images[0].src }} style={{ width: "100%", height: 460 }} resizeMode="cover" />
        )}
        <View style={{ padding: spacing.lg }}>
          <Text style={{ color: colors.ink, fontSize: fontSizes.display, fontWeight: "900", lineHeight: 36 }}>
            {product.title}
          </Text>
          <Text style={{ color: colors.burgundy, fontSize: fontSizes.xl, fontWeight: "900", marginTop: spacing.sm }}>
            {product.price} EGP
          </Text>
          {product.description && (
            <Text style={{ color: colors.slate, marginTop: spacing.md, lineHeight: 22 }}>{product.description}</Text>
          )}

          {product.options.map((opt) => (
            <View key={opt.name} style={{ marginTop: spacing.lg }}>
              <Text style={{ color: colors.ink, fontWeight: "800", fontSize: fontSizes.sm, letterSpacing: 1.5, textTransform: "uppercase" }}>
                {opt.name}
              </Text>
              <View style={{ flexDirection: "row", flexWrap: "wrap", gap: spacing.sm, marginTop: spacing.sm }}>
                {opt.values.map((v) => {
                  const active = selected[opt.name] === v;
                  return (
                    <Pressable
                      key={v}
                      onPress={() => setSelected((s) => ({ ...s, [opt.name]: v }))}
                      style={{
                        paddingVertical: 10,
                        paddingHorizontal: 18,
                        borderRadius: 999,
                        borderWidth: 1.5,
                        borderColor: active ? colors.burgundy : colors.borderStrong,
                        backgroundColor: active ? colors.burgundy : "transparent",
                      }}
                    >
                      <Text style={{ color: active ? colors.white : colors.ink, fontWeight: "700" }}>{v}</Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>
          ))}

          <View style={{ marginTop: spacing.lg, flexDirection: "row", alignItems: "center", gap: spacing.md }}>
            <Text style={{ color: colors.ink, fontWeight: "800", textTransform: "uppercase", letterSpacing: 1.5, fontSize: fontSizes.sm }}>Qty</Text>
            <Pressable onPress={() => setQty((q) => Math.max(1, q - 1))} style={qtyBtn}><Text style={qtyTxt}>−</Text></Pressable>
            <Text style={{ fontSize: fontSizes.lg, fontWeight: "900", minWidth: 24, textAlign: "center" }}>{qty}</Text>
            <Pressable onPress={() => setQty((q) => q + 1)} style={qtyBtn}><Text style={qtyTxt}>+</Text></Pressable>
          </View>
        </View>
      </ScrollView>

      <View style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: spacing.md, backgroundColor: colors.ink }}>
        <Pressable
          disabled={!optionsValid || !product.in_stock}
          onPress={() => {
            addLine({
              key: variantKey,
              productSlug: product.slug,
              title: product.title,
              price: product.price,
              variantLabel,
              options: selected,
              image: product.images[0]?.src,
              qty,
            });
            router.push("/cart");
          }}
          style={{
            backgroundColor: product.in_stock ? colors.burgundy : colors.slate,
            paddingVertical: 16,
            borderRadius: 999,
            opacity: optionsValid ? 1 : 0.5,
          }}
        >
          <Text style={{ color: colors.white, textAlign: "center", fontWeight: "900", letterSpacing: 1.5 }}>
            {product.in_stock ? `ADD TO CART · ${product.price * qty} EGP` : "SOLD OUT"}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const qtyBtn = {
  width: 36, height: 36, borderRadius: 18, borderWidth: 1.5, borderColor: colors.borderStrong,
  alignItems: "center" as const, justifyContent: "center" as const,
};
const qtyTxt = { fontSize: 18, fontWeight: "900" as const };
