export interface Theme {
  key: string;
  name: string;
  bg: string; // page background (css gradient or color)
  card: string; // link button background
  cardHover: string;
  text: string;
  subtext: string;
  accent: string;
  border: string;
}

export const THEMES: Record<string, Theme> = {
  aurora: {
    key: "aurora",
    name: "Aurora",
    bg: "radial-gradient(900px 500px at 50% 0%, rgba(90,88,214,0.20) 0%, rgba(90,88,214,0) 60%), #0a0a12",
    card: "rgba(255,255,255,0.035)",
    cardHover: "rgba(108,108,240,0.12)",
    text: "#f2f2f7",
    subtext: "#888ca3",
    accent: "#6c6cf0",
    border: "rgba(255,255,255,0.07)",
  },
  midnight: {
    key: "midnight",
    name: "Midnight",
    bg: "#05060a",
    card: "rgba(255,255,255,0.04)",
    cardHover: "rgba(51,230,184,0.14)",
    text: "#eef1f5",
    subtext: "#8a93a3",
    accent: "#33e6b8",
    border: "rgba(255,255,255,0.08)",
  },
  sunset: {
    key: "sunset",
    name: "Sunset",
    bg: "linear-gradient(180deg, #2a0f13 0%, #150a12 60%, #0b0710 100%)",
    card: "rgba(255,255,255,0.05)",
    cardHover: "rgba(255,122,90,0.18)",
    text: "#fbeee6",
    subtext: "#c9a9a0",
    accent: "#ff7a5a",
    border: "rgba(255,255,255,0.09)",
  },
  paper: {
    key: "paper",
    name: "Paper",
    bg: "#f4f1ea",
    card: "#ffffff",
    cardHover: "#efe9db",
    text: "#1c1a17",
    subtext: "#6b6459",
    accent: "#1c1a17",
    border: "rgba(28,26,23,0.12)",
  },
  neon: {
    key: "neon",
    name: "Neon",
    bg: "#0a0a0a",
    card: "rgba(255,255,255,0.03)",
    cardHover: "rgba(255,45,150,0.16)",
    text: "#f5f5f5",
    subtext: "#9a9a9a",
    accent: "#ff2d96",
    border: "rgba(255,45,150,0.25)",
  },
};

export function getTheme(key: string): Theme {
  return THEMES[key] ?? THEMES.aurora;
}
