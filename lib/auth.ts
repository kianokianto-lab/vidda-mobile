/**
 * Customer auth for the VIDDA mobile app.
 *
 * Stores a session token in expo-secure-store. The web side does not yet
 * implement customer accounts (admin only), so for M-Phase-3 we model the
 * client locally: signup/login persist a profile and an opaque token.
 *
 * When the web side adds /api/auth/{login,signup,me} (Phase-3 follow-up),
 * swap the placeholder fetches in `signin` / `signup` to hit those routes.
 */

import { create } from "zustand";
import * as SecureStore from "expo-secure-store";

const TOKEN_KEY = "vidda-customer-token";
const PROFILE_KEY = "vidda-customer-profile";

export interface CustomerProfile {
  id: string;
  name: string;
  emailOrPhone: string;
  channel: "email" | "phone";
}

interface AuthState {
  token: string | null;
  profile: CustomerProfile | null;
  hydrated: boolean;
  hydrate: () => Promise<void>;
  signup: (input: { name: string; emailOrPhone: string; password: string }) => Promise<{ ok: boolean; error?: string }>;
  signin: (input: { emailOrPhone: string; password: string }) => Promise<{ ok: boolean; error?: string }>;
  signout: () => Promise<void>;
}

function detectChannel(value: string): "email" | "phone" {
  return /\S+@\S+\.\S+/.test(value) ? "email" : "phone";
}

export const useAuth = create<AuthState>((set) => ({
  token: null,
  profile: null,
  hydrated: false,
  hydrate: async () => {
    try {
      const [t, p] = await Promise.all([
        SecureStore.getItemAsync(TOKEN_KEY),
        SecureStore.getItemAsync(PROFILE_KEY),
      ]);
      set({
        token: t,
        profile: p ? JSON.parse(p) : null,
        hydrated: true,
      });
    } catch {
      set({ hydrated: true });
    }
  },
  signup: async (input) => {
    if (!input.name.trim() || !input.emailOrPhone.trim() || input.password.length < 8) {
      return { ok: false, error: "Name, email/phone, and a password of 8+ chars are required." };
    }
    // Local-first: persists a profile and a placeholder token so the user
    // can checkout without round-tripping a server we haven't built yet.
    const profile: CustomerProfile = {
      id: `local-${Date.now().toString(36)}`,
      name: input.name.trim(),
      emailOrPhone: input.emailOrPhone.trim(),
      channel: detectChannel(input.emailOrPhone),
    };
    const token = `local.${profile.id}.${Math.random().toString(36).slice(2, 10)}`;
    await SecureStore.setItemAsync(TOKEN_KEY, token);
    await SecureStore.setItemAsync(PROFILE_KEY, JSON.stringify(profile));
    set({ token, profile });
    return { ok: true };
  },
  signin: async (input) => {
    if (!input.emailOrPhone.trim() || !input.password) {
      return { ok: false, error: "Email/phone and password required." };
    }
    // Local-first: re-uses any stored profile that matches the identifier.
    const stored = await SecureStore.getItemAsync(PROFILE_KEY);
    let profile: CustomerProfile | null = stored ? JSON.parse(stored) : null;
    if (!profile || profile.emailOrPhone !== input.emailOrPhone.trim()) {
      profile = {
        id: `local-${Date.now().toString(36)}`,
        name: input.emailOrPhone.split("@")[0],
        emailOrPhone: input.emailOrPhone.trim(),
        channel: detectChannel(input.emailOrPhone),
      };
    }
    const token = `local.${profile.id}.${Math.random().toString(36).slice(2, 10)}`;
    await SecureStore.setItemAsync(TOKEN_KEY, token);
    await SecureStore.setItemAsync(PROFILE_KEY, JSON.stringify(profile));
    set({ token, profile });
    return { ok: true };
  },
  signout: async () => {
    await SecureStore.deleteItemAsync(TOKEN_KEY).catch(() => {});
    await SecureStore.deleteItemAsync(PROFILE_KEY).catch(() => {});
    set({ token: null, profile: null });
  },
}));
