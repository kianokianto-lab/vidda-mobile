/**
 * Tiny API client for the VIDDA WEAR mobile app.
 * Talks to the Phase-2 Next.js backend (vidda-web).
 *
 * Base URL resolution order:
 *   1. EXPO_PUBLIC_API_BASE_URL  (set per EAS profile in eas.json)
 *   2. expo.extra.apiBaseUrl      (set in app.json)
 *   3. https://www.viddawear.store
 */

import Constants from "expo-constants";

const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_BASE_URL ??
  (Constants.expoConfig?.extra as { apiBaseUrl?: string } | undefined)?.apiBaseUrl ??
  "https://www.viddawear.store";

export interface ApiProductImage { src: string; alt?: string }
export interface ApiProduct {
  id: string;
  slug: string;
  title: string;
  price: number;
  price_before?: number;
  description?: string;
  images: ApiProductImage[];
  options: { name: string; values: string[] }[];
  in_stock: boolean;
  sku?: string;
}

export const api = {
  baseUrl: API_BASE_URL,

  // Products are static-built on web; we hit /api/products if we add it,
  // otherwise we mirror the static catalog locally.
  async products(): Promise<ApiProduct[]> {
    const res = await fetch(`${API_BASE_URL}/api/products`).catch(() => null);
    if (res?.ok) {
      const data = await res.json();
      if (Array.isArray(data?.products)) return data.products;
    }
    return STATIC_FALLBACK;
  },

  async subscribe(email: string, source = "mobile-app"): Promise<{ ok: boolean; error?: string }> {
    const res = await fetch(`${API_BASE_URL}/api/subscribe`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, source, locale: "ar-EG" }),
    });
    return res.json();
  },

  async createOrder(payload: unknown): Promise<{ ok: boolean; order?: { id: string; total: number }; error?: string }> {
    const res = await fetch(`${API_BASE_URL}/api/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    return res.json();
  },
};

/* ---------- Static catalog (mirrors the web fallback so the app never goes empty) ---------- */

const STATIC_FALLBACK: ApiProduct[] = [
  {
    id: "vidda-classic-hoodie",
    slug: "vidda-classic-hoodie",
    title: "VIDDA Classic Hoodie",
    price: 999,
    description: "Heavyweight 400 GSM hoodie. Boxy fit. Built in Alexandria.",
    images: [{ src: "https://files.easy-orders.net/1770675406046305268.jpeg" }],
    options: [
      { name: "Size", values: ["S", "M", "L", "XL"] },
      { name: "Color", values: ["Black", "Burgundy", "Off-white"] },
    ],
    in_stock: true,
  },
  {
    id: "vidda-street-pants",
    slug: "vidda-street-pants",
    title: "VIDDA Street Pants",
    price: 999,
    description: "Tapered streetwear pants. Premium cotton blend.",
    images: [{ src: "https://files.easy-orders.net/1770675406046305268.jpeg" }],
    options: [{ name: "Size", values: ["S", "M", "L", "XL"] }],
    in_stock: true,
  },
];
