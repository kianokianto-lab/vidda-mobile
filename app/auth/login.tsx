import { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { Link, useRouter } from "expo-router";
import { useAuth } from "@/lib/auth";
import { colors, spacing, fontSizes } from "@/lib/tokens";

export default function LoginScreen() {
  const router = useRouter();
  const signin = useAuth((s) => s.signin);
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const submit = async () => {
    setBusy(true); setError("");
    const r = await signin({ emailOrPhone, password });
    setBusy(false);
    if (r.ok) router.replace("/account");
    else setError(r.error || "Sign in failed");
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.ivory, padding: spacing.lg, gap: spacing.md }}>
      <Text style={{ fontSize: fontSizes.display, fontWeight: "900", color: colors.ink }}>Welcome back.</Text>
      <Field label="Email or phone" value={emailOrPhone} onChange={setEmailOrPhone} />
      <Field label="Password" value={password} onChange={setPassword} secure />
      {error ? <Text style={{ color: colors.burgundy }}>{error}</Text> : null}
      <Pressable disabled={busy} onPress={submit} style={{ backgroundColor: colors.burgundy, paddingVertical: 16, borderRadius: 999, opacity: busy ? 0.6 : 1 }}>
        <Text style={{ color: colors.white, textAlign: "center", fontWeight: "900", letterSpacing: 1.5 }}>{busy ? "SIGNING IN…" : "SIGN IN"}</Text>
      </Pressable>
      <Link href="/auth/signup" asChild>
        <Pressable><Text style={{ textAlign: "center", color: colors.ink, fontWeight: "700" }}>New here? Create account</Text></Pressable>
      </Link>
    </View>
  );
}

function Field({ label, value, onChange, secure }: { label: string; value: string; onChange: (v: string) => void; secure?: boolean }) {
  return (
    <View>
      <Text style={{ fontSize: fontSizes.xs, fontWeight: "800", letterSpacing: 1.5, textTransform: "uppercase", color: colors.muted }}>{label}</Text>
      <TextInput value={value} onChangeText={onChange} secureTextEntry={secure} autoCapitalize="none" style={{ marginTop: 6, backgroundColor: colors.white, borderWidth: 1, borderColor: colors.borderStrong, borderRadius: 4, padding: 12, fontSize: fontSizes.base }} />
    </View>
  );
}
