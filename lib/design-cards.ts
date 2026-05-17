export type StyleMdTheme = {
  mood: "editorial" | "organic" | "luxury" | "cinematic" | "minimal" | "brutalist" | "playful" | "modern" | "corporate";
  radius: "sharp" | "medium" | "pill" | "organic" | "asymmetric";
  density: "compact" | "default" | "airy";
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    surfaceMuted: string;
    text: string;
    textMuted: string;
    border: string;
  };
  surfaces: {
    canvas: string;
    card: string;
    muted: string;
    hero: string;
    accent: string;
    overlay: string;
  };
  typography: {
    display: string;
    body: string;
    scale: "classic" | "modern" | "editorial";
  };
  buttons: {
    radius: string;
    fill: "solid" | "outline" | "ghost" | "glass";
    borderWidth: string;
    shadow: string;
    fontFamily: string;
    fontWeight: string;
    textTransform: "none" | "uppercase";
  };
  spacing: {
    base: string;
    card: string;
    section: string;
  };
};

export type DesignCard = {
  url: string;
  heroHeadline: string;
  id: string;
  name: string;
  logo: string;
  accentColor: string;
  tags: { label: string; color: string }[];
  desc: string;
  palette: { name: string; hex: string; swatches: string[] }[];
  fonts: { name: string; sample: string; role: string; dark: boolean }[];
  preview?: string | null;
  theme?: StyleMdTheme;
  brandAssets?: {
    logo?: string;
    favicon?: string;
    appleIcon?: string;
    ogImage?: string;
  };
  tokens: {
    colors: {
      primary: string;
      secondary: string;
      accent: string;
      usage?: Record<string, string>;
    };
    typography: {
      heading: string;
      body: string;
      scale?: {
        element: string;
        size: string;
        lineHeight: string;
        letterSpacing: string;
        weight: string;
      }[];
    };
    spacing: string;
    spacingScale?: {
      token: string;
      value: string;
      usage: string;
    }[];
    buttons: {
      radius: string;
    };
    implementation?: {
      cssVariables?: string;
      classNames?: string[];
    };
  };
};

export const designCards: DesignCard[] = [
  {
    url: "",
    heroHeadline: "Mother's Day is coming!",
    id: "levain",
    name: "Levain Bakery",
    logo: "/logos/Rectangle 921377.svg",
    accentColor: "#e8006f",
    tags: [
      { label: "D2C", color: "bg-blue-50 text-blue-700 border-blue-200" },
      { label: "Vibrant", color: "bg-purple-50 text-purple-700 border-purple-200" },
      { label: "Warm", color: "bg-orange-50 text-orange-700 border-orange-200" },
      { label: "Vintage", color: "bg-green-50 text-green-700 border-green-200" },
    ],
    desc:
      "Design system built around minimalism and modularity, using a clean, almost monochromatic palette with subtle greys, crisp typography (often their custom Inter-based font), and generous whitespace to keep the focus on content.",
    fonts: [
      { name: "Platform", sample: "Aa Bb", role: "HEADING SYSTEM", dark: true },
      { name: "National", sample: "Aa Bb", role: "BODY SYSTEM", dark: false },
    ],
    palette: [
      { name: "Primary", hex: "#000000", swatches: ["#fafafa", "#f5f5f5", "#e0e0e0", "#bdbdbd", "#9e9e9e", "#757575", "#616161", "#424242", "#212121", "#000000"] },
      { name: "Secondary", hex: "#e8006f", swatches: ["#fff0f5", "#fce4ec", "#f8bbd0", "#f48fb1", "#f06292", "#ec407a", "#e91e63", "#c2185b", "#880e4f", "#e8006f"] },
      { name: "Tertiary", hex: "#2d2bb5", swatches: ["#f5f5ff", "#e8eaf6", "#c5cae9", "#9fa8da", "#7986cb", "#5c6bc0", "#3f51b5", "#3949ab", "#2d2bb5", "#1a178a"] },
      { name: "Neutral", hex: "#f9c74f", swatches: ["#fffef5", "#fffde7", "#fff9c4", "#fff59d", "#fff176", "#ffee58", "#ffeb3b", "#fdd835", "#f9c74f", "#c8a200"] },
    ],
    tokens: {
      colors: { primary: "#000000", secondary: "#fafafa", accent: "#e8006f" },
      typography: { heading: "Platform", body: "National" },
      spacing: "4px",
      buttons: { radius: "0px" }
    }
  },
  {
    url: "/spotify",
    heroHeadline: "Spotify Design System",
    id: "spotify",
    name: "Spotify",
    logo: "/logos/spotify.svg",
    accentColor: "#1ed760",
    tags: [
      { label: "Music", color: "bg-green-50 text-green-700 border-green-200" },
      { label: "Dark UI", color: "bg-black text-white border-gray-800" },
      { label: "Immersive", color: "bg-gray-900 text-green-400 border-green-200" },
    ],
    desc: "A dark, immersive design system inspired by Spotify. Content-first darkness, pill geometry, and the iconic Spotify Green accent.",
    fonts: [
      { name: "SpotifyMixUI", sample: "Aa Bb", role: "BODY", dark: true },
      { name: "SpotifyMixUITitle", sample: "Aa Bb", role: "TITLE", dark: false },
    ],
    palette: [
      { name: "Spotify Green", hex: "#1ed760", swatches: ["#1ed760"] },
      { name: "Near Black", hex: "#121212", swatches: ["#121212", "#181818", "#1f1f1f"] },
      { name: "White", hex: "#ffffff", swatches: ["#ffffff", "#b3b3b3", "#cbcbcb", "#fdfdfd"] },
      { name: "Semantic", hex: "#f3727f", swatches: ["#f3727f", "#ffa42b", "#539df5"] },
    ],
    tokens: {
      colors: { primary: "#1ed760", secondary: "#121212", accent: "#1ed760" },
      typography: { heading: "SpotifyMixUITitle", body: "SpotifyMixUI" },
      spacing: "8px",
      buttons: { radius: "500px" }
    }
  },
];

export function getDesignCardBySlug(slug: string) {
  return designCards.find((card) => card.id === slug);
}
