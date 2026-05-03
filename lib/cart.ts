/**
 * Cart store — zustand + AsyncStorage. Mirrors the web cart shape so the
 * checkout payload is identical.
 */

import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "vidda-cart-v1";

export interface CartLine {
  key: string;
  productSlug: string;
  title: string;
  qty: number;
  price: number;
  image?: string;
  variantLabel?: string;
  options?: Record<string, string>;
}

interface CartState {
  lines: CartLine[];
  hydrated: boolean;
  hydrate: () => Promise<void>;
  addLine: (line: Omit<CartLine, "qty"> & { qty?: number }) => void;
  setQty: (key: string, qty: number) => void;
  removeLine: (key: string) => void;
  clear: () => void;
}

let saveTimer: ReturnType<typeof setTimeout> | null = null;
function scheduleSave(lines: CartLine[]) {
  if (saveTimer) clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(lines)).catch(() => { /* ignore */ });
  }, 200);
}

export const useCart = create<CartState>((set, get) => ({
  lines: [],
  hydrated: false,
  hydrate: async () => {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (raw) set({ lines: JSON.parse(raw), hydrated: true });
      else set({ hydrated: true });
    } catch {
      set({ hydrated: true });
    }
  },
  addLine: (line) => {
    const lines = [...get().lines];
    const existing = lines.findIndex((l) => l.key === line.key);
    if (existing >= 0) lines[existing] = { ...lines[existing], qty: lines[existing].qty + (line.qty ?? 1) };
    else lines.push({ ...line, qty: line.qty ?? 1 });
    set({ lines });
    scheduleSave(lines);
  },
  setQty: (key, qty) => {
    const lines = get().lines.map((l) => (l.key === key ? { ...l, qty: Math.max(1, qty) } : l));
    set({ lines });
    scheduleSave(lines);
  },
  removeLine: (key) => {
    const lines = get().lines.filter((l) => l.key !== key);
    set({ lines });
    scheduleSave(lines);
  },
  clear: () => {
    set({ lines: [] });
    AsyncStorage.removeItem(STORAGE_KEY).catch(() => { /* ignore */ });
  },
}));

export const cartTotals = (lines: CartLine[]) => ({
  subtotal: lines.reduce((a, l) => a + l.price * l.qty, 0),
  itemCount: lines.reduce((a, l) => a + l.qty, 0),
});
