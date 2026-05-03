import { ScrollView, Text, View, Pressable, ImageBackground } from "react-native";
import { Link } from "expo-router";
import { colors, spacing, fontSizes } from "@/lib/tokens";

export default function HomeScreen() {
  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.ivory }}>
      <ImageBackground
        source={{ uri: "https://files.easy-orders.net/1770675406046305268.jpeg" }}
        style={{ height: 460, justifyContent: "flex-end" }}
        imageStyle={{ opacity: 0.55 }}
      >
        <View style={{ backgroundColor: "rgba(10,10,10,0.55)", padding: spacing.lg }}>
          <Text style={{ color: colors.ivory, fontSize: 11, letterSpacing: 2, fontWeight: "800" }}>
            EGYPTIAN STREETWEAR · ALEXANDRIA
          </Text>
          <Text style={{ color: colors.white, fontSize: fontSizes.hero, fontWeight: "900", lineHeight: 48, marginTop: spacing.sm }}>
            BUILT TO BE WORN.{"\n"}NOT JUST SEEN.
          </Text>
          <Link href="/shop" asChild>
            <Pressable style={{ marginTop: spacing.lg, backgroundColor: colors.burgundy, paddingVertical: 14, paddingHorizontal: 32, borderRadius: 999, alignSelf: "flex-start" }}>
              <Text style={{ color: colors.white, fontWeight: "800", letterSpacing: 1.5 }}>SHOP THE COLLECTION</Text>
            </Pressable>
          </Link>
        </View>
      </ImageBackground>

      <View style={{ padding: spacing.lg }}>
        <Text style={{ color: colors.burgundy, fontSize: 11, letterSpacing: 2, fontWeight: "800" }}>SUMMER ’26</Text>
        <Text style={{ color: colors.ink, fontSize: fontSizes.display, fontWeight: "900", marginTop: spacing.sm }}>
          The next drop.
        </Text>
        <Text style={{ color: colors.muted, marginTop: spacing.sm, fontSize: fontSizes.base, lineHeight: 22 }}>
          Six pieces. One story. Heat-tested in the streets of Alexandria. Drops June 15.
        </Text>

        <View style={{ marginTop: spacing.xl, gap: spacing.md }}>
          <Tile title="Try before you pay" body="Cash on delivery across Egypt. Inspect, try on, then pay." />
          <Tile title="Built in Alexandria" body="Cut, sewn, and shipped from our Alexandria studio." />
          <Tile title="Limited drops" body="Numbered runs. When they’re gone, they’re gone." />
        </View>
      </View>
    </ScrollView>
  );
}

function Tile({ title, body }: { title: string; body: string }) {
  return (
    <View style={{ backgroundColor: colors.white, padding: spacing.lg, borderRadius: 4, borderWidth: 1, borderColor: colors.border }}>
      <Text style={{ color: colors.ink, fontSize: fontSizes.lg, fontWeight: "800" }}>{title}</Text>
      <Text style={{ color: colors.muted, marginTop: 4, fontSize: fontSizes.sm, lineHeight: 20 }}>{body}</Text>
    </View>
  );
}
