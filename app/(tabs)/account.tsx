import { Pressable, ScrollView, Text, View, Linking } from "react-native";
import { Link, useRouter } from "expo-router";
import { useAuth } from "@/lib/auth";
import { colors, spacing, fontSizes } from "@/lib/tokens";

export default function AccountScreen() {
  const profile = useAuth((s) => s.profile);
  const signout = useAuth((s) => s.signout);
  const router = useRouter();

  if (!profile) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.ivory, padding: spacing.xl, justifyContent: "center", gap: spacing.md }}>
        <Text style={{ fontSize: fontSizes.display, fontWeight: "900", color: colors.ink, textAlign: "center" }}>Welcome to VIDDA.</Text>
        <Text style={{ color: colors.muted, textAlign: "center", marginBottom: spacing.lg }}>Sign in to track orders, save addresses, and get drop alerts first.</Text>
        <Link href="/auth/login" asChild>
          <Pressable style={{ backgroundColor: colors.burgundy, paddingVertical: 14, borderRadius: 999 }}>
            <Text style={{ color: colors.white, textAlign: "center", fontWeight: "900", letterSpacing: 1.5 }}>SIGN IN</Text>
          </Pressable>
        </Link>
        <Link href="/auth/signup" asChild>
          <Pressable style={{ paddingVertical: 14, borderRadius: 999, borderWidth: 2, borderColor: colors.ink }}>
            <Text style={{ color: colors.ink, textAlign: "center", fontWeight: "900", letterSpacing: 1.5 }}>CREATE ACCOUNT</Text>
          </Pressable>
        </Link>
      </View>
    );
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.ivory }} contentContainerStyle={{ padding: spacing.lg, gap: spacing.md }}>
      <View style={{ padding: spacing.lg, backgroundColor: colors.white, borderRadius: 4, borderWidth: 1, borderColor: colors.border }}>
        <Text style={{ fontSize: 11, letterSpacing: 2, fontWeight: "800", color: colors.muted }}>SIGNED IN AS</Text>
        <Text style={{ fontSize: fontSizes.xl, fontWeight: "900", color: colors.ink, marginTop: 4 }}>{profile.name}</Text>
        <Text style={{ color: colors.muted }}>{profile.emailOrPhone}</Text>
      </View>

      <Row label="Contact us" onPress={() => Linking.openURL("https://wa.me/201050027773")} />
      <Row label="Instagram @vidda.wear" onPress={() => Linking.openURL("https://www.instagram.com/vidda.wear")} />
      <Row label="TikTok @vidda.wear" onPress={() => Linking.openURL("https://www.tiktok.com/@vidda.wear")} />
      <Row label="Sign out" onPress={async () => { await signout(); router.replace("/"); }} danger />
    </ScrollView>
  );
}

function Row({ label, onPress, danger }: { label: string; onPress: () => void; danger?: boolean }) {
  return (
    <Pressable onPress={onPress} style={{ padding: spacing.md, backgroundColor: colors.white, borderRadius: 4, borderWidth: 1, borderColor: colors.border }}>
      <Text style={{ fontWeight: "800", color: danger ? colors.burgundy : colors.ink }}>{label}</Text>
    </Pressable>
  );
}
