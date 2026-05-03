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

  return {
    name,
    desc,
    palette,
    fonts,
    accentColor,
    tags,
    tokens,
  };
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
      const parts = line.split("|").map(s => s.trim()).filter(Boolean);
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
      const parts = line.split("|").map(s => s.trim()).filter(Boolean);
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
  const match = md.match(/(?:Spacing|Base rhythm|Gap):\s*`?([^`\n]+)`?/i);
  return match ? match[1].trim() : "8px";
}

function extractButtons(md: string): { radius: string } {
  const match = md.match(/(?:Button Radius|Border Radius):\s*`?([^`\n]+)`?/i);
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

function extractColors(md: string): { name: string; hex: string }[] {
  const colors: { name: string; hex: string }[] = [];
  
  const regex1 = /-\s+\*\*(.+?)\*\*:\s+`?(#[0-9A-Fa-f]{3,6})`?/g;
  let match;
  while ((match = regex1.exec(md)) !== null) {
    colors.push({ name: match[1].trim(), hex: match[2].toUpperCase() });
  }

  if (colors.length === 0) {
    const hexMatches = md.match(/#([0-9a-fA-F]{3,6})/g) || [];
    hexMatches.forEach((hex, idx) => {
      if (idx < 5) colors.push({ name: `Color ${idx + 1}`, hex: hex.toUpperCase() });
    });
  }

  const seen = new Set();
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

  const regex = /-\s+\*\*(.+?)\*\*:\s+`?([^`\n]+)`?/g;
  let match;
  while ((match = regex.exec(content)) !== null) {
    const role = match[1].trim();
    const name = match[2].trim();
    if (name.length < 40 && !name.includes("font-")) {
      fonts.push({ name, role });
    }
  }

  return fonts.slice(0, 5);
}

function extractPrimaryColor(md: string): string | null {
  const match = md.match(/(?:Primary Brand|Accent Color|Primary Color).+?`?(#[0-9A-Fa-f]{3,6})`?/i);
  return match ? match[1].toUpperCase() : null;
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
    palette: parsed.palette.map(p => ({
      name: p.name,
      hex: p.hex,
      swatches: padSwatches(p.hex)
    })),
    fonts: parsed.fonts.map(f => ({
      name: f.name,
      role: f.role,
      sample: "Aa Bb",
      dark: f.role.toLowerCase().includes("heading") || f.role.toLowerCase().includes("title")
    }))
  };
}
