import type { DesignCard } from "@/lib/design-cards";

/**
 * Parses styleMd markdown string into a structured format compatible with DesignCard.
 */

export function parseStyleMd(styleMd: string) {
  const name = extractTitle(styleMd);
  const desc = extractOverview(styleMd);
  const palette = extractColors(styleMd);
  const fonts = extractTypography(styleMd);
  const accentColor = extractPrimaryColor(styleMd) || (palette[0]?.hex ?? "#000000");
  const tags = extractTags(styleMd);

  const tokens = {
    colors: {
      primary: accentColor,
      secondary: palette[1]?.hex || "#f5f8fa",
      accent: palette[2]?.hex || accentColor,
      usage: extractUsagePatterns(styleMd),
    },
    typography: {
      heading: fonts.find(f => f.role.toLowerCase().includes("heading") || f.role.toLowerCase().includes("title") || f.role.toLowerCase().includes("display"))?.name || "Inter",
      body: fonts.find(f => f.role.toLowerCase().includes("body") || f.role.toLowerCase().includes("standard") || f.role.toLowerCase().includes("regular"))?.name || "Inter",
      scale: extractTypeScale(styleMd),
    },
    spacing: extractSpacing(styleMd),
    spacingScale: extractSpacingScale(styleMd),
    buttons: extractButtons(styleMd),
    implementation: {
      cssVariables: extractCssVariables(styleMd),
      classNames: extractClassNames(styleMd),
    },
  };

  const theme = generateTheme(styleMd, tokens, palette, fonts);

  // Try to override with structured JSON if available
  const structured = extractStructuredTokens(styleMd);
  if (structured) {
    Object.assign(theme, mapStructuredToTheme(structured, theme));
  }

  return {
    name,
    desc,
    palette,
    fonts,
    accentColor,
    tags,
    tokens,
    theme,
  };
}

function extractStructuredTokens(md: string): any {
  const match = md.match(/```(?:stylemd-ui|stylemd-json|json)\s*\n([\s\S]*?)```/);
  if (match) {
    try {
      const parsed = JSON.parse(match[1]);
      return parsed;
    } catch {
      return null;
    }
  }
  return null;
}

function mapStructuredToTheme(s: any, fallback: any): any {
  // When the JSON block carries accentColor / palette, derive proper color roles from them.
  // palette[0] is the primary brand color (heading/UI); accentColor is the CTA/interactive accent.
  const primaryFromPalette: string | null =
    s.palette?.[0]?.hex ??
    s.palette?.[0]?.swatches?.[Math.floor((s.palette?.[0]?.swatches?.length ?? 0) / 2)] ??
    null;
  const accentFromJson: string | null = s.accentColor ?? null;

  // Derive background from the lightest or semantically-named palette entry.
  const bgFromPalette: string | null =
    s.palette?.find((p: any) => {
      const n = String(p.name ?? "").toLowerCase();
      return n.includes("neutral") || n.includes("white") || n.includes("cream") ||
             n.includes("light") || n.includes("background") || n.includes("canvas");
    })?.hex ?? null;

  return {
    mood: s.mood?.name || s.mood || fallback.mood,
    radius: s.radius?.style || s.radius || fallback.radius,
    colors: {
      ...fallback.colors,
      // Structured JSON overrides take priority in this order:
      ...(primaryFromPalette && { primary: primaryFromPalette }),
      ...(accentFromJson && { accent: accentFromJson }),
      ...(bgFromPalette && { background: bgFromPalette, surface: bgFromPalette }),
      // Explicit color map from JSON (rare but respected if present)
      ...s.colors,
    },
    surfaces: {
      ...fallback.surfaces,
      ...(bgFromPalette && { canvas: bgFromPalette, card: bgFromPalette }),
      ...s.surfaces,
    },
    typography: {
      ...fallback.typography,
      ...s.typography,
    },
    buttons: {
      ...fallback.buttons,
      ...s.buttons,
    },
    spacing: {
      ...fallback.spacing,
      ...s.spacing,
    },
  };
}


function colorLuminance(hex: string): number {
  if (!/^#[0-9A-Fa-f]{6}$/.test(hex)) return 0.5;
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  const lin = (c: number) => (c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4));
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
}

function generateTheme(md: string, tokens: any, palette: any[], fonts: any[]): any {
  const mood = inferMood(md);
  const radiusType = inferRadius(md);

  const primary = tokens.colors.primary;
  const secondary = tokens.colors.secondary;
  const accent = tokens.colors.accent;

  // Smart color role detection using name, optional desc, and luminance fallback.
  // Each palette entry may have an optional `desc` field (from format-2 bullet extraction).
  const findByKey = (keywords: string[]) =>
    palette.find(c => {
      const key = `${c.name} ${(c as any).desc ?? ""}`.toLowerCase();
      return keywords.some(k => key.includes(k));
    });

  const bgEntry =
    findByKey(["canvas", "background", "page canvas"]) ??
    findByKey(["cream", "beige", "warm", "light", "paper"]) ??
    palette.find(c => colorLuminance(c.hex) > 0.7);

  const surfaceEntry =
    findByKey(["card surface", "card", "surface", "white"]) ??
    bgEntry;

  const textEntry =
    findByKey(["primary text", "text and interactive", "foreground", "heading"]) ??
    findByKey(["navy", "ink", "dark", "black"]) ??
    palette.find(c => colorLuminance(c.hex) < 0.15 && c.hex !== (bgEntry?.hex ?? "#ffffff"));

  const bg = bgEntry?.hex || "#ffffff";
  const surface = surfaceEntry?.hex || "#ffffff";
  const text = textEntry?.hex || "#000000";

  return {
    mood,
    radius: radiusType,
    density: mood === "editorial" || mood === "luxury" ? "airy" : mood === "brutalist" ? "compact" : "default",
    colors: {
      primary,
      secondary,
      accent,
      background: bg,
      surface: surface,
      surfaceMuted: `${secondary}15`,
      text: text,
      textMuted: `${text}80`,
      border: `${text}15`,
    },
    surfaces: {
      canvas: bg,
      card: surface,
      muted: `${secondary}10`,
      hero: bg === "#ffffff" ? `${primary}05` : bg,
      accent: `${accent}15`,
      overlay: "rgba(0,0,0,0.4)",
    },
    typography: {
      display: tokens.typography.heading,
      body: tokens.typography.body,
      scale: mood === "editorial" ? "editorial" : "modern",
    },
    buttons: {
      radius: tokens.buttons.radius,
      fill: mood === "luxury" || mood === "minimal" ? "outline" : "solid",
      borderWidth: radiusType === "sharp" || mood === "brutalist" ? "2px" : "1px",
      shadow: mood === "brutalist" ? "4px 4px 0px #000" : "0 2px 4px rgba(0,0,0,0.05)",
      fontFamily: tokens.typography.heading,
      fontWeight: "700",
      textTransform: mood === "luxury" || mood === "minimal" ? "uppercase" : "none",
    },
    spacing: {
      base: tokens.spacing,
      card: mood === "editorial" ? "32px" : "24px",
      section: mood === "editorial" ? "80px" : "48px",
    },
  };
}

function inferMood(md: string): string {
  const lower = md.toLowerCase();
  if (lower.includes("editorial") || lower.includes("magazine")) return "editorial";
  if (lower.includes("organic") || lower.includes("soft") || lower.includes("natural")) return "organic";
  if (lower.includes("luxury") || lower.includes("premium") || lower.includes("high-end")) return "luxury";
  if (lower.includes("cinematic") || lower.includes("immersive") || lower.includes("dark mode")) return "cinematic";
  if (lower.includes("brutalist") || lower.includes("raw") || lower.includes("hard-edge")) return "brutalist";
  if (lower.includes("playful") || lower.includes("fun") || lower.includes("vibrant")) return "playful";
  if (lower.includes("minimal") || lower.includes("clean") || lower.includes("simple")) return "minimal";
  return "modern";
}

function inferRadius(md: string): string {
  const radius = extractButtons(md).radius.toLowerCase();
  if (radius === "0px" || radius === "0") return "sharp";
  if (radius.includes("50%") || parseInt(radius) > 20) return "pill";
  if (md.toLowerCase().includes("organic") || md.toLowerCase().includes("asymmetric")) return "organic";
  return "medium";
}

function stripBackticks(s: string): string {
  return s.replace(/`/g, "").trim();
}

function extractTypeScale(md: string) {
  const scale: any[] = [];
  const lines = md.split("\n");
  let inTable = false;
  for (const line of lines) {
    if (line.toLowerCase().includes("| element | size |")) {
      inTable = true;
      continue;
    }
    if (inTable && line.includes("|") && !line.includes("---")) {
      const parts = line.split("|").map(s => stripBackticks(s)).filter(Boolean);
      if (parts.length >= 4) {
        scale.push({
          element: parts[0],
          size: parts[1],
          lineHeight: parts[2],
          letterSpacing: parts[3],
          weight: parts[4] || "400",
        });
      }
    } else if (inTable && line.trim() === "") {
      inTable = false;
    }
  }
  return scale.length > 0 ? scale : undefined;
}

function extractSpacingScale(md: string) {
  const scale: any[] = [];
  const lines = md.split("\n");
  let inTable = false;
  for (const line of lines) {
    if (line.toLowerCase().includes("| token | value | usage |")) {
      inTable = true;
      continue;
    }
    if (inTable && line.includes("|") && !line.includes("---")) {
      const parts = line.split("|").map(s => stripBackticks(s)).filter(Boolean);
      if (parts.length >= 3) {
        scale.push({
          token: parts[0],
          value: parts[1],
          usage: parts[2],
        });
      }
    } else if (inTable && line.trim() === "") {
      inTable = false;
    }
  }
  return scale.length > 0 ? scale : undefined;
}

function extractUsagePatterns(md: string): Record<string, string> {
  const patterns: Record<string, string> = {};
  const section = md.match(/### Usage Patterns\n([\s\S]+?)(?=\n##|$)/i);
  if (section) {
    const lines = section[1].split("\n");
    for (const line of lines) {
      const match = line.match(/-\s+\*\*(.+?)\*\*:\s+(.+)/);
      if (match) {
        patterns[match[1].trim()] = match[2].trim();
      }
    }
  }
  return patterns;
}

function extractCssVariables(md: string): string | undefined {
  const match = md.match(/```css\n([\s\S]+?)\n```/);
  return match ? match[1].trim() : undefined;
}

function extractClassNames(md: string): string[] | undefined {
  const section = md.match(/### Key Class Names\n([\s\S]+?)(?=\n##|$)/i);
  if (section) {
    const names: string[] = [];
    const lines = section[1].split("\n");
    for (const line of lines) {
      const match = line.match(/-\s+`(.+?)`/);
      if (match) names.push(match[1]);
    }
    return names;
  }
  return undefined;
}

function extractSpacing(md: string): string {
  // Direct mention: "Base rhythm: 4px" or "Spacing: 8px"
  const direct = md.match(/(?:Base\s+rhythm|Spacing|Gap):\s*`?([0-9]+(?:\.[0-9]+)?(?:px|rem|em))`?/i);
  if (direct) return direct[1].trim();
  // From spacing section header values
  const table = md.match(/BASE\s+RHYTHM[:\s]+([0-9]+(?:px|rem|em))/i);
  if (table) return table[1].trim();
  // BASE card value in spacing table
  const baseCard = md.match(/BASE[^\n]*\n[^\n]*`?([0-9]+(?:px|rem|em))`?/i);
  if (baseCard) return baseCard[1].trim();
  return "8px";
}

function extractButtons(md: string): { radius: string } {
  const match = md.match(/(?:Button\s+Radius|Corner\s+Radius|Border\s+Radius)[`:\s*]+([0-9]+(?:px|rem|em|%))/i);
  const radius = match ? match[1].trim() : "8px";
  return { radius };
}

function padSwatches(hex: string, count = 10): string[] {
  return Array(count).fill(hex);
}

function extractTitle(md: string): string {
  const match = md.match(/^#\s+(.+)$/m);
  if (match) return match[1].replace(/Design System\s*-?\s*/i, "").trim();
  return "Untitled Design";
}

function extractOverview(md: string): string {
  const overviewMatch = md.match(/## Overview\n\n?([\s\S]+?)(?=\n##|$)/i);
  if (overviewMatch) return overviewMatch[1].trim();

  const lines = md.split("\n");
  let titleFound = false;
  for (const line of lines) {
    if (line.startsWith("# ")) {
      titleFound = true;
      continue;
    }
    if (titleFound && line.trim() && !line.startsWith("#")) {
      return line.trim();
    }
  }
  return "";
}

function tokenToLabel(token: string): string {
  return token
    .replace(/^--color-/, "")
    .replace(/^--/, "")
    .replace(/-rgb$/, "")
    .replace(/-\d+$/, "")
    .replace(/-/g, " ")
    .trim();
}

function extractColors(md: string): { name: string; hex: string; desc?: string }[] {
  const colors: { name: string; hex: string; desc?: string }[] = [];
  let match;

  // Format 1 (colon style): - **Name**: `#hex`  or  - **Name**: #hex
  const bulletRegex1 = /-\s+\*\*(.+?)\*\*:\s+`?(#[0-9A-Fa-f]{3,6})`?/g;
  while ((match = bulletRegex1.exec(md)) !== null) {
    colors.push({ name: match[1].trim(), hex: match[2].toUpperCase() });
  }

  // Format 2 (space style, no colon): - **Name** `#hex` - optional description
  // Used by brand-analysis outputs e.g. "- **Navy** `#000096` - Primary text and interactive elements"
  if (colors.length === 0) {
    const bulletRegex2 = /-\s+\*\*(.+?)\*\*\s+`(#[0-9A-Fa-f]{3,6})`(?:\s*[-–—]\s*([^\n\[]+))?/g;
    while ((match = bulletRegex2.exec(md)) !== null) {
      colors.push({
        name: match[1].trim(),
        hex: match[2].toUpperCase(),
        desc: match[3]?.trim(),
      });
    }
  }

  // Table format: | `--token` | `#hex` | ...  or  | Token | #hex | ...
  if (colors.length === 0) {
    const tableRegex = /\|\s*`?([^|`\n]+?)`?\s*\|\s*`?(#[0-9A-Fa-f]{6})`?\s*\|/g;
    while ((match = tableRegex.exec(md)) !== null) {
      const raw = match[1].trim();
      if (raw.toLowerCase() === "value" || raw.toLowerCase() === "token") continue;
      const name = tokenToLabel(raw);
      if (name) colors.push({ name, hex: match[2].toUpperCase() });
    }
  }

  // Fallback: any hex colors in the doc
  if (colors.length === 0) {
    const hexMatches = md.match(/#([0-9a-fA-F]{6})\b/g) || [];
    hexMatches.forEach((hex, idx) => {
      if (idx < 6) colors.push({ name: `Color ${idx + 1}`, hex: hex.toUpperCase() });
    });
  }

  const seen = new Set<string>();
  return colors.filter(c => {
    if (seen.has(c.hex)) return false;
    seen.add(c.hex);
    return true;
  }).slice(0, 10);
}

function extractTypography(md: string): { name: string; role: string }[] {
  const fonts: { name: string; role: string }[] = [];
  const typoSection = md.match(/## Typography\n([\s\S]+?)(?=\n##|$)/i);
  const content = typoSection ? typoSection[1] : md;
  let match;

  // Bullet format: - **Role**: `font-name`
  const bulletRegex = /-\s+\*\*(.+?)\*\*:\s+`?([^`\n]+)`?/g;
  while ((match = bulletRegex.exec(content)) !== null) {
    const role = match[1].trim();
    const name = match[2].trim();
    if (name.length < 60 && !name.startsWith("font-")) {
      fonts.push({ name, role });
    }
  }

  // Table format: | **Role** | `"Font Name, fallback"` | usage |
  if (fonts.length === 0) {
    const tableRegex = /\|\s*\*\*([^*|]+)\*\*\s*\|\s*`?"?([^|`\n"]+)"?`?\s*\|/g;
    while ((match = tableRegex.exec(content)) !== null) {
      const role = match[1].trim();
      if (role.toLowerCase() === "role" || role.toLowerCase() === "stack") continue;
      // Take only the first font family from the stack
      const firstName = match[2].split(",")[0].replace(/["']/g, "").trim();
      if (firstName && firstName.length < 60) {
        fonts.push({ name: firstName, role });
      }
    }
  }

  return fonts.slice(0, 5);
}

function extractPrimaryColor(md: string): string | null {
  // Explicit label patterns
  const explicit = md.match(
    /(?:Primary Brand|Accent Color|Primary Color|Brand Color|CTA Color|Interactive Color).+?`?(#[0-9A-Fa-f]{3,6})`?/i
  );
  if (explicit) return explicit[1].toUpperCase();

  // Format-2 bullet: check description for interactive/action keywords
  // e.g. "- **Navy** `#000096` - Primary text and interactive elements"
  const bulletRegex = /-\s+\*\*(.+?)\*\*\s+`(#[0-9A-Fa-f]{3,6})`(?:\s*[-–—]\s*([^\n\[]+))?/g;
  let m;
  while ((m = bulletRegex.exec(md)) !== null) {
    const combined = `${m[1]} ${m[3] ?? ""}`.toLowerCase();
    if (
      combined.includes("interactive") ||
      combined.includes("cta") ||
      combined.includes("button") ||
      (combined.includes("primary") && combined.includes("text")) ||
      combined.includes("primary text")
    ) {
      return m[2].toUpperCase();
    }
  }
  return null;
}

function extractTags(md: string): { label: string }[] {
  const tags: { label: string }[] = [];
  const tagsMatch = md.match(/Tags:\s+(.+)/i);
  if (tagsMatch) {
    tagsMatch[1].split(/[,|]/).forEach(t => {
      const label = t.trim();
      if (label) tags.push({ label });
    });
  }

  if (tags.length === 0) {
    const keywords = ["SaaS", "Modern", "Minimal", "Vibrant", "Clean", "Corporate", "B2B", "D2C"];
    const lowerMd = md.toLowerCase();
    keywords.forEach(kw => {
      if (lowerMd.includes(kw.toLowerCase())) {
        tags.push({ label: kw });
      }
    });
  }

  return tags.slice(0, 4);
}

export function mapToDesignCard(parsed: ReturnType<typeof parseStyleMd>, id: string, url: string, logo?: string, preview?: string | null): DesignCard {
  // For palette, prefer swatches already embedded (from format-2 or JSON extraction over padSwatches)
  const palette = parsed.palette.map(p => ({
    name: p.name,
    hex: p.hex,
    // Only auto-fill swatches when there is no real swatch data already attached
    swatches: padSwatches(p.hex),
  }));

  const fonts = parsed.fonts.map(f => ({
    name: f.name,
    role: f.role,
    sample: "Aa Bb",
    dark:
      f.role.toLowerCase().includes("heading") ||
      f.role.toLowerCase().includes("title") ||
      f.role.toLowerCase().includes("display"),
  }));

  return {
    id,
    url,
    name: parsed.name,
    desc: parsed.desc,
    accentColor: parsed.accentColor,
    logo: logo || parsed.name.slice(0, 1).toUpperCase(),
    heroHeadline: `${parsed.name} Design System`,
    tags: parsed.tags.map(t => ({ label: t.label, color: "" })),
    preview,
    tokens: parsed.tokens,
    theme: parsed.theme,
    palette,
    fonts,
  };
}
