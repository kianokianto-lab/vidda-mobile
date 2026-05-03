/**
 * VIDDA WEAR design tokens — shared with vidda-web (kept in sync manually).
 * Values mirror tailwind.config.ts in the web repo.
 */
export const colors = {
  ink: "#0a0a0a",
  ivory: "#F1ECE3",
  burgundy: "#800020",
  sand: "#C8B89B",
  slate: "#3F4549",
  white: "#FFFFFF",
  border: "rgba(10,10,10,0.1)",
  borderStrong: "rgba(10,10,10,0.3)",
  muted: "rgba(10,10,10,0.6)",
} as const;

export const radii = {
  sm: 4,
  md: 8,
  pill: 999,
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export const fontSizes = {
  xs: 12,
  sm: 14,
  base: 16,
  lg: 18,
  xl: 22,
  display: 32,
  hero: 44,
} as const;

export const fonts = {
  regular: "System",
  bold: "System",
} as const;
