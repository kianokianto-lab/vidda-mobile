import { useState } from "react";
import { Alert, Linking, Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { useRouter } from "expo-router";
import { api } from "@/lib/api";
import { useCart, cartTotals } from "@/lib/cart";
import { useAuth } from "@/lib/auth";
import { colors, spacing, fontSizes } from "@/lib/tokens";

const GOVS = ["Cairo", "Alexandria", "Giza", "Qalyubia", "Sharqia", "Dakahlia", "Gharbia", "Monufia", "Beheira", "Kafr El Sheikh", "Damietta", "Port Said", "Ismailia", "Suez", "Faiyum", "Beni Suef", "Minya", "Asyut", "Sohag", "Qena", "Luxor", "Aswan", "Red Sea", "South Sinai", "North Sinai", "Matruh", "New Valley"];

type Method = "cod" | "whatsapp";

export default function CheckoutScreen() {
  const router = useRouter();
  const { lines, clear } = useCart();
  const profile = useAuth((s) => s.profile);
  const { subtotal } = cartTotals(lines);

  const [name, setName] = useState(profile?.name ?? "");
  const [phone, setPhone] = useState(profile?.channel === "phone" ? profile.emailOrPhone : "");
  const [email, setEmail] = useState(profile?.channel === "email" ? profile.emailOrPhone : "");
  const [line1, setLine1] = useState("");
  const [city, setCity] = useState("");
  const [gov, setGov] = useState(GOVS[0]);
  const [method, setMethod] = useState<Method>("cod");
  const [busy, setBusy] = useState(false);

  if (lines.length === 0) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: colors.ivory, padding: spacing.xl }}>
        <Text style={{ fontSize: fontSizes.lg, fontWeight: "800" }}>Your cart is empty.</Text>
      </View>
    );
  }

  const submit = async () => {
    if (!name.trim() || !phone.trim() || !line1.trim() || !city.trim()) {
      Alert.alert("Missing info", "Name, phone, address, and city are required.");
      return;
    }

    if (method === "whatsapp") {
      const itemsTxt = lines.map((l) => `• ${l.title}${l.variantLabel ? ` (${l.variantLabel})` : ""} ×${l.qty} — ${l.price * l.qty} EGP`).join("\n");
      const msg = encodeURIComponent(
        `Hi VIDDA, I want to order:\n\n${itemsTxt}\n\nTotal: ${subtotal} EGP\n\nName: ${name}\nPhone: ${phone}\nAddress: ${line1}, ${city}, ${gov}, Egypt`
      );
      Linking.openURL(`https://wa.me/201050027773?text=${msg}`);
      return;
    }

    setBusy(true);
    const res = await api.createOrder({
      customer: {
        name, phone, email: email || undefined,
        address: { line1, city, governorate: gov, country: "EG" },
      },
      lines,
      paymentMethod: "cod",
      source: "mobile-app",
      locale: "ar-EG",
    });
    setBusy(false);

    if (res.ok && res.order) {
      clear();
      Alert.alert("Order placed", `Reference: ${res.order.id}\nWe'll WhatsApp you within 24h.`, [
        { text: "OK", onPress: () => router.replace("/") },
      ]);
    } else {
      Alert.alert("Order failed", res.error ?? "Something went wrong. Try WhatsApp instead.");
    }
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.ivory }} contentContainerStyle={{ padding: spacing.lg, gap: spacing.md }}>
      <Field label="Name" value={name} onChange={setName} />
      <Field label="Phone (with country code)" value={phone} onChange={setPhone} keyboardType="phone-pad" />
      <Field label="Email (optional)" value={email} onChange={setEmail} keyboardType="email-address" />
      <Field label="Address line" value={line1} onChange={setLine1} />
      <Field label="City" value={city} onChange={setCity} />

      <View>
        <Text style={labelStyle}>Governorate</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: spacing.sm }}>
          {GOVS.map((g) => (
            <Pressable key={g} onPress={() => setGov(g)} style={{ paddingVertical: 8, paddingHorizontal: 14, borderRadius: 999, borderWidth: 1.5, borderColor: g === gov ? colors.burgundy : colors.borderStrong, backgroundColor: g === gov ? colors.burgundy : "transparent", marginRight: 8 }}>
              <Text style={{ color: g === gov ? colors.white : colors.ink, fontWeight: "700", fontSize: fontSizes.sm }}>{g}</Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      <Text style={[labelStyle, { marginTop: spacing.md }]}>Payment</Text>
      <Pressable onPress={() => setMethod("cod")} style={methodBox(method === "cod")}>
        <Text style={{ fontWeight: "800", color: colors.ink }}>Cash on delivery</Text>
        <Text style={{ color: colors.muted, fontSize: fontSizes.xs, marginTop: 2 }}>Try before you pay. Recommended.</Text>
      </Pressable>
      <Pressable onPress={() => setMethod("whatsapp")} style={methodBox(method === "whatsapp")}>
        <Text style={{ fontWeight: "800", color: colors.ink }}>WhatsApp checkout</Text>
        <Text style={{ color: colors.muted, fontSize: fontSizes.xs, marginTop: 2 }}>Send the order to us via WhatsApp; we’ll confirm + dispatch.</Text>
      </Pressable>

      <View style={{ marginTop: spacing.lg, padding: spacing.md, backgroundColor: colors.white, borderRadius: 4, borderWidth: 1, borderColor: colors.border }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <Text style={{ fontWeight: "700", letterSpacing: 1.5, fontSize: fontSizes.sm }}>SUBTOTAL</Text>
          <Text style={{ fontWeight: "900", fontSize: fontSizes.lg }}>{subtotal} EGP</Text>
        </View>
      </View>

      <Pressable disabled={busy} onPress={submit} style={{ marginTop: spacing.md, backgroundColor: colors.burgundy, paddingVertical: 16, borderRadius: 999, opacity: busy ? 0.6 : 1 }}>
        <Text style={{ color: colors.white, textAlign: "center", fontWeight: "900", letterSpacing: 1.5 }}>
          {busy ? "PLACING ORDER…" : method === "whatsapp" ? "OPEN WHATSAPP" : "PLACE ORDER"}
        </Text>
      </Pressable>
    </ScrollView>
  );
}

const labelStyle = { fontSize: fontSizes.xs, fontWeight: "800" as const, letterSpacing: 1.5, textTransform: "uppercase" as const, color: colors.muted };

function Field({ label, value, onChange, keyboardType }: { label: string; value: string; onChange: (v: string) => void; keyboardType?: "default" | "email-address" | "phone-pad" }) {
  return (
    <View>
      <Text style={labelStyle}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChange}
        keyboardType={keyboardType}
        autoCapitalize={keyboardType === "email-address" ? "none" : "sentences"}
        style={{ marginTop: 6, backgroundColor: colors.white, borderWidth: 1, borderColor: colors.borderStrong, borderRadius: 4, padding: 12, fontSize: fontSizes.base }}
      />
    </View>
  );
}

const methodBox = (active: boolean) => ({
  padding: spacing.md,
  backgroundColor: colors.white,
  borderRadius: 4,
  borderWidth: 2,
  borderColor: active ? colors.burgundy : colors.border,
});
