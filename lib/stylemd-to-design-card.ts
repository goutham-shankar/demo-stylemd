import type { DesignCard } from "@/lib/design-cards";
import type { StyleMdUiPayload } from "@/lib/stylemd-structured-view";

function tagLabel(t: string | { label: string }): string {
  return typeof t === "string" ? t : t.label;
}

function padSwatches(swatches: string[], count = 10): string[] {
  const out = swatches.slice(0, count);
  while (out.length < count) {
    out.push(out[out.length - 1] ?? "#cccccc");
  }
  return out;
}

/**
 * Build a DesignCard from a ```stylemd-ui JSON payload so the catalog UI can render runs and fixtures dynamically.
 */
export function styleMdUiPayloadToDesignCard(
  payload: StyleMdUiPayload,
  opts: { id: string; url?: string },
): DesignCard {
  const url = opts.url?.trim() ?? "";
  const tags = (payload.tags ?? []).map((t) => ({
    label: tagLabel(t),
    color: "",
  }));
  const palette = (payload.palette ?? []).map((row) => ({
    name: row.name,
    hex: row.hex ?? padSwatches(row.swatches)[Math.min(5, Math.max(0, row.swatches.length - 1))] ?? payload.accentColor,
    swatches: padSwatches(row.swatches, 10),
  }));
  const fonts = (payload.fonts?.length ? payload.fonts : [{ name: "Display", sample: "Aa Bb", role: "HEADING SYSTEM", dark: true }]).map(
    (f) => ({
      name: f.name,
      sample: f.sample ?? "Aa Bb",
      role: f.role,
      dark: !!f.dark,
    }),
  );

  const logo =
    payload.logoUrl?.trim() ?
      payload.logoUrl.trim()
    : payload.brand.trim().slice(0, 1).toUpperCase() || "?";

  const primaryColor = palette[0]?.hex || payload.accentColor;
  const secondaryColor = palette[1]?.hex || "#f5f8fa";
  const headingFont = fonts.find(f => f.dark)?.name || fonts[0]?.name || "Inter";
  const bodyFont = fonts.find(f => !f.dark)?.name || fonts[0]?.name || "Inter";
  const baseSpacing = payload.spacing?.cards?.find(c => c.label?.toUpperCase() === "BASE")?.value || "8px";

  return {
    id: opts.id,
    url,
    name: payload.brand,
    logo,
    heroHeadline: payload.heroHeadline ?? `${payload.brand} preview`,
    accentColor: payload.accentColor,
    tags,
    desc: payload.description?.trim() ?? "",
    palette: palette.length ? palette : [{ name: "Accent", hex: payload.accentColor, swatches: padSwatches([payload.accentColor]) }],
    fonts,
    tokens: {
      colors: {
        primary: primaryColor,
        secondary: secondaryColor,
        accent: payload.accentColor,
      },
      typography: {
        heading: headingFont,
        body: bodyFont,
      },
      spacing: baseSpacing,
      buttons: {
        radius: payload.shapes?.badge?.toLowerCase() === "linear" ? "0px" : "8px",
      },
    },
  };
}
