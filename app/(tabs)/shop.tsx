import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Image, Pressable, Text, View } from "react-native";
import { Link } from "expo-router";
import { api, ApiProduct } from "@/lib/api";
import { colors, spacing, fontSizes } from "@/lib/tokens";

export default function ShopScreen() {
  const [items, setItems] = useState<ApiProduct[] | null>(null);
  useEffect(() => {
    api.products().then(setItems).catch(() => setItems([]));
  }, []);

  if (!items) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: colors.ivory }}>
        <ActivityIndicator color={colors.burgundy} />
      </View>
    );
  }

  return (
    <FlatList
      data={items}
      keyExtractor={(p) => p.slug}
      style={{ backgroundColor: colors.ivory }}
      contentContainerStyle={{ padding: spacing.md, gap: spacing.md }}
      ListHeaderComponent={
        <View style={{ paddingVertical: spacing.md }}>
          <Text style={{ color: colors.burgundy, fontSize: 11, letterSpacing: 2, fontWeight: "800" }}>STREETWEAR</Text>
          <Text style={{ color: colors.ink, fontSize: fontSizes.display, fontWeight: "900", marginTop: 4 }}>
            All pieces
          </Text>
          <Text style={{ color: colors.muted, marginTop: 4 }}>{items.length} item{items.length === 1 ? "" : "s"}</Text>
        </View>
      }
      renderItem={({ item }) => (
        <Link href={{ pathname: "/product/[slug]", params: { slug: item.slug } }} asChild>
          <Pressable style={{ backgroundColor: colors.white, borderRadius: 4, overflow: "hidden", borderWidth: 1, borderColor: colors.border }}>
            {item.images[0] && (
              <Image source={{ uri: item.images[0].src }} style={{ width: "100%", height: 320 }} resizeMode="cover" />
            )}
            <View style={{ padding: spacing.md }}>
              <Text style={{ color: colors.ink, fontSize: fontSizes.lg, fontWeight: "800" }}>{item.title}</Text>
              <Text style={{ color: colors.burgundy, marginTop: 4, fontWeight: "900", fontSize: fontSizes.lg }}>
                {item.price} EGP
              </Text>
              {!item.in_stock && (
                <Text style={{ color: colors.slate, marginTop: 4, fontSize: fontSizes.xs, textTransform: "uppercase", letterSpacing: 1.5 }}>
                  Sold out
                </Text>
              )}
            </View>
          </Pressable>
        </Link>
      )}
    />
  );
}
