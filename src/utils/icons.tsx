// Detects which platform a pasted URL belongs to and returns a colored
// pictogram + display label. These are intentionally simple original
// glyphs (not reproductions of brand logos) so buttons stay legible and
// license-safe while still reading as "oh, that's TikTok / Instagram / etc."

export interface Platform {
  key: string;
  label: string;
  color: string;
  glyph: (props: { size?: number }) => any;
}

const glyph = (path: string, viewBox = "0 0 24 24") =>
  ({ size = 20 }: { size?: number }) => (
    <svg width={size} height={size} viewBox={viewBox} fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d={path} fill="currentColor" />
    </svg>
  );

const NOTE = glyph("M9 3v10.55A4 4 0 1 0 11 17V7h5V3H9z");
const CAMERA = glyph(
  "M9 3l-1.5 2H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-3.5L15 3H9zm3 6a4 4 0 1 1 0 8 4 4 0 0 1 0-8z"
);
const BIRD = glyph(
  "M22 5.9c-.7.3-1.5.6-2.3.7.8-.5 1.5-1.3 1.8-2.3-.8.5-1.7.8-2.6 1a4.1 4.1 0 0 0-7 3.7A11.6 11.6 0 0 1 3.4 4.6a4.1 4.1 0 0 0 1.3 5.5c-.7 0-1.3-.2-1.9-.5v.1c0 2 1.4 3.6 3.3 4a4.2 4.2 0 0 1-1.9.1 4.1 4.1 0 0 0 3.8 2.9A8.2 8.2 0 0 1 2 18.6a11.6 11.6 0 0 0 6.3 1.8c7.5 0 11.7-6.3 11.7-11.7v-.5c.8-.6 1.5-1.3 2-2.3z"
);
const PLAY = glyph("M8 5v14l11-7L8 5z");
const CONTROLLER = glyph(
  "M7 7h10a4 4 0 0 1 4 4l1 5a2 2 0 0 1-3.3 1.6L16 15H8l-2.7 2.6A2 2 0 0 1 2 16l1-5a4 4 0 0 1 4-4zm1 3v2H6v2h2v2h2v-2h2v-2H10V10H8z"
);
const CODE = glyph("M9 6l-6 6 6 6 1.4-1.4L4.8 12l5.6-4.6L9 6zm6 0l-1.4 1.4L19.2 12l-5.6 4.6L15 18l6-6-6-6z");
const CHAT = glyph("M4 4h16a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1H9l-5 4V6a1 1 0 0 1 1-1z");
const PAPER_PLANE = glyph("M2 21l21-9L2 3v7l15 2-15 2v7z");
const LINK_NODE = glyph(
  "M8 6h4v2H8a4 4 0 1 0 0 8h4v2H8A6 6 0 0 1 8 6zm8 0a6 6 0 0 1 0 12h-4v-2h4a4 4 0 1 0 0-8h-4V6h4zm-6.5 5h5v2h-5v-2z"
);
const PIN = glyph("M12 2a7 7 0 0 0-7 7c0 5.2 7 13 7 13s7-7.8 7-13a7 7 0 0 0-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5z");
const CLOUD_WAVE = glyph(
  "M6 18a5 5 0 0 1-1-9.9A6 6 0 0 1 17 6a4.5 4.5 0 0 1 1 8.9V18H6zm3-6v4h1.2l.8-2 .8 2H13l.8-2 .8 2H16v-4h-1.2l-.8 2-.8-2H12l-.8 2-.8-2H9z"
);
const COFFEE = glyph(
  "M4 3h13v2h2a3 3 0 0 1 3 3v2a3 3 0 0 1-3 3h-1.1A6 6 0 0 1 12 18H9a6 6 0 0 1-5-5.9V3zm15 4h-2v3h2a1 1 0 0 0 1-1V8a1 1 0 0 0-1-1zM4 20h13v2H4v-2z"
);
const HEART_GIFT = glyph(
  "M12 21s-7-4.4-9.5-8.6C.6 9 2.2 5.5 5.7 5A4.6 4.6 0 0 1 12 7.6 4.6 4.6 0 0 1 18.3 5c3.5.5 5.1 4 3.2 7.4C19 16.6 12 21 12 21z"
);
const DOLLAR = glyph(
  "M12 1a1 1 0 0 1 1 1v1.06c2.3.3 4 1.9 4.2 4.06h-2.1c-.2-1.2-1.2-2-2.6-2.1v4.4l.6.15c2.7.66 4 1.9 4 4.1 0 2.3-1.7 3.9-4.6 4.2V19a1 1 0 1 1-2 0v-1.1c-2.5-.3-4.2-1.9-4.4-4.2h2.1c.15 1.3 1.1 2.1 2.7 2.3v-4.6l-.5-.13c-2.6-.66-3.9-1.9-3.9-4 0-2.2 1.6-3.8 4.4-4.1V2a1 1 0 0 1 1-1z"
);
const MAIL = glyph("M3 5h18a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1zm1.4 2L12 12.5 19.6 7H4.4zM4 9.3V17h16V9.3l-8 5.4-8-5.4z");
const GLOBE = glyph(
  "M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm6.9 8h-3.1a15 15 0 0 0-1.3-4.9A8 8 0 0 1 18.9 10zM12 4c.9 1.2 1.6 3 1.9 6h-3.8c.3-3 1-4.8 1.9-6zM4.1 12H7.2c.1 1.8.5 3.4 1 4.9A8 8 0 0 1 4.1 12zm3.1-2H4.1a8 8 0 0 1 4.1-4.9A15 15 0 0 0 7.2 10zM12 20c-.9-1.2-1.6-3-1.9-6h3.8c-.3 3-1 4.8-1.9 6zm2.5-1.1c.5-1.5.9-3.1 1-4.9h3.1a8 8 0 0 1-4.1 4.9zM12 12v0z"
);

export const PLATFORMS: Platform[] = [
  { key: "tiktok", label: "TikTok", color: "#ff2d55", glyph: NOTE },
  { key: "instagram", label: "Instagram", color: "#e1306c", glyph: CAMERA },
  { key: "twitter", label: "X", color: "#e7e9ea", glyph: BIRD },
  { key: "youtube", label: "YouTube", color: "#ff0033", glyph: PLAY },
  { key: "twitch", label: "Twitch", color: "#9146ff", glyph: CONTROLLER },
  { key: "github", label: "GitHub", color: "#b0b6bd", glyph: CODE },
  { key: "discord", label: "Discord", color: "#5865f2", glyph: CHAT },
  { key: "telegram", label: "Telegram", color: "#29a9eb", glyph: PAPER_PLANE },
  { key: "linkedin", label: "LinkedIn", color: "#3aa0e8", glyph: LINK_NODE },
  { key: "facebook", label: "Facebook", color: "#5b8def", glyph: LINK_NODE },
  { key: "pinterest", label: "Pinterest", color: "#e0335e", glyph: PIN },
  { key: "reddit", label: "Reddit", color: "#ff5a2f", glyph: CHAT },
  { key: "threads", label: "Threads", color: "#e7e9ea", glyph: CHAT },
  { key: "soundcloud", label: "SoundCloud", color: "#ff7a33", glyph: CLOUD_WAVE },
  { key: "spotify", label: "Spotify", color: "#2fd06e", glyph: NOTE },
  { key: "patreon", label: "Patreon", color: "#ff6b57", glyph: HEART_GIFT },
  { key: "kofi", label: "Ko-fi", color: "#4fb2e0", glyph: COFFEE },
  { key: "buymeacoffee", label: "Buy Me a Coffee", color: "#ffd23f", glyph: COFFEE },
  { key: "cashapp", label: "Cash App", color: "#2fd158", glyph: DOLLAR },
  { key: "venmo", label: "Venmo", color: "#3aa0e8", glyph: DOLLAR },
  { key: "paypal", label: "PayPal", color: "#4c9aeb", glyph: DOLLAR },
  { key: "snapchat", label: "Snapchat", color: "#fde047", glyph: CHAT },
  { key: "onlyfans", label: "OnlyFans", color: "#3aa0e8", glyph: HEART_GIFT },
  { key: "email", label: "Email", color: "#c9cdd3", glyph: MAIL },
  { key: "website", label: "Website", color: "#8f95a3", glyph: GLOBE },
];

const HOST_MAP: Array<[RegExp, string]> = [
  [/tiktok\.com$/, "tiktok"],
  [/instagram\.com$/, "instagram"],
  [/(twitter\.com|x\.com)$/, "twitter"],
  [/(youtube\.com|youtu\.be)$/, "youtube"],
  [/twitch\.tv$/, "twitch"],
  [/github\.com$/, "github"],
  [/(discord\.gg|discord\.com)$/, "discord"],
  [/t\.me$/, "telegram"],
  [/linkedin\.com$/, "linkedin"],
  [/facebook\.com$/, "facebook"],
  [/pinterest\.com$/, "pinterest"],
  [/reddit\.com$/, "reddit"],
  [/threads\.net$/, "threads"],
  [/soundcloud\.com$/, "soundcloud"],
  [/spotify\.com$/, "spotify"],
  [/patreon\.com$/, "patreon"],
  [/ko-fi\.com$/, "kofi"],
  [/buymeacoffee\.com$/, "buymeacoffee"],
  [/cash\.app$/, "cashapp"],
  [/venmo\.com$/, "venmo"],
  [/paypal\.(me|com)$/, "paypal"],
  [/snapchat\.com$/, "snapchat"],
  [/onlyfans\.com$/, "onlyfans"],
];

export function detectPlatform(rawUrl: string): Platform {
  const fallback = PLATFORMS.find((p) => p.key === "website")!;
  try {
    if (rawUrl.startsWith("mailto:")) return PLATFORMS.find((p) => p.key === "email") ?? fallback;
    const host = new URL(rawUrl).hostname.replace(/^www\./, "");
    for (const [re, key] of HOST_MAP) {
      if (re.test(host)) return PLATFORMS.find((p) => p.key === key) ?? fallback;
    }
    return fallback;
  } catch {
    return fallback;
  }
}
