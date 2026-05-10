"use client";

import { useMemo, useState } from "react";
import { useGoogleFonts } from "@/lib/use-google-fonts";
import {
  ArrowLeft,
  ArrowRight,
  Apple,
  Bell,
  Check,
  X,
  Clock,
  AlertCircle,
  MousePointerClick,
  Square,
  Ruler,
  Layers,
} from "lucide-react";
import type { DesignCard } from "@/lib/design-cards";
import type { StyleMdUiPayload } from "@/lib/stylemd-structured-view";

function fontFamilyFor(fontName: string): string {
  if (!fontName) return "system-ui, sans-serif";
  const safe = fontName.replace(/"/g, "'");
  return `'${safe}', system-ui, sans-serif`;
}

const DEFAULT_SPACING_CARDS = [
  { label: "BASE", sublabel: "RHYTHM", value: "4px" },
  { label: "GAP", sublabel: "COMPONENTS", value: "8px" },
  { label: "SECTION", sublabel: "PAGE", value: "32px" },
];

const DEFAULT_SPACING_STEPS = [
  { label: "STEP 1", pct: "20%", value: "4px" },
  { label: "STEP 2", pct: "40%", value: "8px" },
  { label: "STEP 3", pct: "60%", value: "12px" },
  { label: "STEP 4", pct: "80%", value: "14px" },
];

const DEFAULT_SPACING_RULES = ["SECTION PADDING: 32PX, 56PX", "CARD PADDING: 32PX, 56PX", "GAPS: 8PX, 32PX"];

const DEFAULT_ELEVATION_ROWS = [
  { label: "SURFACE", value: "Glass" },
  { label: "BORDER", value: "1px #FFFFFF" },
  { label: "SHADOW", value: "rgba(25, 28, 33, 0.02) 0px 1px 0px..." },
];

const DEFAULT_ELEVATION_CHIPS = ["GLASS", "1PX #FFFFFF", "rgba(0, 0, 0) 0px...", "rgba(25, 28, 33, 0.08) 0px..."];

const DEFAULT_MOTION_TAGS = ["150MS", "200MS", "EASE", "CUBIC-BEZIER(0.4..."];

const DEFAULT_MOTION_BARS = [
  { label: "TEXT", pct: "40%" },
  { label: "COLOR", pct: "60%" },
  { label: "STROKE", pct: "50%" },
];

const DEFAULT_MOTION_STEPS: [string, string][] = [
  ["STEP 1", "150ms"],
  ["STEP 2", "200ms"],
];

const DEFAULT_SHAPE_ITEMS = ["Cards", "Panels", "Controls", "Media"];

const DEFAULT_DOS = [
  "Use the primary palette as the main accent for emphasis and action states.",
  "Keep spacing aligned to the detected 4px rhythm.",
  "Reuse the Glass surface treatment consistently across cards and controls.",
  "Keep corner radii within the detected 2px, 4px, 20px, 9999px family.",
];

const DEFAULT_DONT = [
  "Do not introduce extra accent colors outside the core palette roles unless approved.",
  "Do not mix unrelated shadow or blur recipes that break the current depth language.",
  "Do not exceed the detected moderate motion intensity without a deliberate rationale.",
];



export type CatalogMainSectionsProps = {
  card: DesignCard;
  extras: StyleMdUiPayload | null;
};

function generateColorScale(hex: string): string[] {
  if (!/^#[0-9A-Fa-f]{6}$/.test(hex)) return Array(10).fill(hex);
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const mix = (base: number, target: number, t: number) =>
    Math.round(base + (target - base) * t).toString(16).padStart(2, "0");
  const shade = (t: number) => `#${mix(r, 255, t)}${mix(g, 255, t)}${mix(b, 255, t)}`;
  const tint = (t: number) => `#${mix(r, 0, t)}${mix(g, 0, t)}${mix(b, 0, t)}`;
  return [shade(0.92), shade(0.80), shade(0.65), shade(0.50), shade(0.35), hex, tint(0.15), tint(0.30), tint(0.45), tint(0.60)];
}

function evalSpacingValue(val: string): string {
  const m = val.match(/calc\(\s*(\d+(?:\.\d+)?)px\s*\*\s*(\d+(?:\.\d+)?)\s*\)/);
  if (m) return `${Math.round(parseFloat(m[1]) * parseFloat(m[2]))}px`;
  return val;
}

function contrastColor(hex: string): string {
  if (!/^#[0-9A-Fa-f]{6}$/.test(hex)) return "#ffffff";
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  const lin = (c: number) => (c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4));
  const lum = 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
  return lum > 0.35 ? "#000000" : "#ffffff";
}

export function CatalogMainSections({ card, extras }: CatalogMainSectionsProps) {
  const { tokens, theme } = card;
  const [copiedHex, setCopiedHex] = useState<string | null>(null);
  const [paletteView, setPaletteView] = useState<"scale" | "cards">("scale");

  function copyColor(hex: string) {
    navigator.clipboard.writeText(hex).catch(() => {});
    setCopiedHex(hex);
    setTimeout(() => setCopiedHex(null), 1500);
  }

  // Prefer the structured JSON block's authoritative palette/fonts when available.
  // The JSON block carries proper swatches, dark flags, sample text, weights, etc.
  const effectivePalette = useMemo(() => {
    if (extras?.palette?.length) {
      return extras.palette.map(row => ({
        name: row.name,
        hex: row.hex ?? (row.swatches?.length ? row.swatches[Math.min(5, row.swatches.length - 1)] : "#000000"),
        swatches: row.swatches?.length ? row.swatches : [],
      }));
    }
    return card.palette;
  }, [extras, card.palette]);

  const effectiveFonts = useMemo(() => {
    if (extras?.fonts?.length) {
      return extras.fonts.map(f => ({
        name: f.name,
        sample: f.sample ?? "Aa Bb",
        role: f.role,
        dark: !!f.dark,
        weights: f.weights,
        badge: f.badge,
        body: f.body,
      }));
    }
    return card.fonts.map(f => ({ ...f, weights: undefined, badge: undefined, body: undefined }));
  }, [extras, card.fonts]);

  // Attempt to load each brand font from Google Fonts.
  // If a font isn't on Google Fonts the <link> silently 400s and the
  // browser falls back to the next font in the CSS stack (system-ui, sans-serif).
  useGoogleFonts(useMemo(() => effectiveFonts.map(f => f.name), [effectiveFonts]));

  const themeStyles = useMemo(() => {
    if (!theme) return {};
    // extras.accentColor overrides the CTA/accent variable when explicitly provided in the JSON block.
    const accent = extras?.accentColor || theme.colors.accent;
    return {
      "--primary": theme.colors.primary,
      "--secondary": theme.colors.secondary,
      "--accent": accent,
      "--background": theme.colors.background,
      "--surface": theme.colors.surface,
      "--surface-muted": theme.colors.surfaceMuted,
      "--text": theme.colors.text,
      "--text-muted": theme.colors.textMuted,
      "--border": theme.colors.border,
      "--canvas-bg": theme.surfaces.canvas,
      "--card-bg": theme.surfaces.card,
      "--hero-bg": theme.surfaces.hero,
      "--radius": theme.buttons.radius,
      "--spacing-base": theme.spacing.base,
      "--spacing-card": theme.spacing.card,
      "--spacing-section": theme.spacing.section,
      "--font-display": fontFamilyFor(theme.typography.display),
      "--font-body": fontFamilyFor(theme.typography.body),
      "--buttons-shadow": theme.buttons.shadow,
      "--buttons-border-width": theme.buttons.borderWidth,
      "--buttons-font-weight": theme.buttons.fontWeight,
    } as React.CSSProperties;
  }, [theme, extras?.accentColor]);

  const moodClasses = useMemo(() => {
    if (!theme) return "";
    const m = theme.mood;
    return [
      m === "brutalist" ? "mood-brutalist" : "",
      m === "luxury" ? "mood-luxury" : "",
      m === "editorial" ? "mood-editorial" : "",
      m === "playful" ? "mood-playful" : "",
      m === "cinematic" ? "mood-cinematic" : "",
    ].join(" ");
  }, [theme]);

  const typoTitle = extras?.typographyTitle ?? "Typography";
  const typoIntro = extras?.typographyIntro ?? "A composed hierarchy for page storytelling";

  const spacingValue = tokens.spacing || "8px";
  const spacingCards = extras?.spacing?.cards?.length ? extras.spacing.cards : [
    { label: "BASE", sublabel: "RHYTHM", value: spacingValue },
    { label: "GAP", sublabel: "COMPONENTS", value: evalSpacingValue(`calc(${spacingValue} * 2)`) },
    { label: "SECTION", sublabel: "PAGE", value: evalSpacingValue(`calc(${spacingValue} * 8)`) },
  ];

  const spacingSteps = extras?.spacing?.steps?.length ? extras.spacing.steps : DEFAULT_SPACING_STEPS;
  const spacingRules =
    extras?.spacing?.rules?.length ? extras.spacing.rules : [`SECTION PADDING: ${spacingValue}`, `CARD PADDING: ${spacingValue}`, `GAPS: ${spacingValue}`];

  const elevIntro =
    extras?.elevation?.intro ??
    "Depth is communicated through glass, border, contrast, and reusable shadow or blur treatments.";
  const elevRows = extras?.elevation?.rows?.length ? extras.elevation.rows : DEFAULT_ELEVATION_ROWS;
  const elevChips = extras?.elevation?.chips?.length ? extras.elevation.chips : DEFAULT_ELEVATION_CHIPS;

  const shapeIntro =
    extras?.shapes?.intro ??
    `Shapes rely on a tight radius system anchored by ${tokens.buttons.radius}.`;
  const shapeBadge = extras?.shapes?.badge ?? "Linear";
  const shapeItems = extras?.shapes?.items?.length ? extras.shapes!.items! : DEFAULT_SHAPE_ITEMS;

  const motionTags = extras?.motion?.tags?.length ? extras.motion.tags : DEFAULT_MOTION_TAGS;
  const motionBars = extras?.motion?.bars?.length ? extras.motion.bars : DEFAULT_MOTION_BARS;
  const motionSteps = extras?.motion?.steps?.length ? extras.motion.steps : DEFAULT_MOTION_STEPS;
  const motionBadge = extras?.motion?.badge ?? "MODERATE";

  const guideIntro =
    extras?.guidelines?.intro ??
    "Use these constraints to keep future generations aligned with the current system.";
  const dos = extras?.guidelines?.dos?.length ? extras.guidelines.dos : DEFAULT_DOS;
  const donts = extras?.guidelines?.donts?.length ? extras.guidelines.donts : DEFAULT_DONT;
  const buttonsBlurb =
    extras?.buttonsBlurb ?? `Anchor interactions to the detected button styles with ${tokens.buttons.radius} radius.`;

  return (
    <div className={`space-y-10 ${moodClasses}`} style={themeStyles}>
      <style jsx global>{`
        .stylemd-theme-root {
          --text-primary: var(--text);
          --text-secondary: var(--text-muted);
          --surface: var(--card-bg);
          --border-light: var(--border);
          --border-medium: var(--border);
        }
        /* Mood: Brutalist */
        .mood-brutalist .stylemd-theme-root {
          --border: 2px solid #000;
          --border-light: 2px solid #000;
          --border-medium: 2px solid #000;
        }
        .mood-brutalist section {
          box-shadow: 4px 4px 0px #000;
          border: 2px solid #000 !important;
        }

        /* Mood: Luxury */
        .mood-luxury .stylemd-theme-root {
          --spacing-section: 100px;
          --spacing-card: 40px;
        }
        .mood-luxury h2 {
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        /* Mood: Playful */
        .mood-playful .stylemd-theme-root {
          --radius: 32px;
        }

        /* Mood: Cinematic */
        .mood-cinematic .stylemd-theme-root {
          --background: #000;
          --surface: #111;
          --text: #fff;
          --text-muted: rgba(255,255,255,0.6);
        }
      `}</style>
      <div className="stylemd-theme-root space-y-10">
      {/* 1. Pro Typography Section */}
      <section className="overflow-hidden" style={{ backgroundColor: "#ffffff", border: "1px solid #e5e7eb", borderRadius: "var(--radius)" }}>
        <div className="flex min-h-[320px]">
          {/* Left panel — title + intro + aside */}
          <div className="flex w-52 flex-shrink-0 flex-col gap-4 p-6 border-r border-dashed border-gray-200">
            <h2 className="text-2xl font-black tracking-tighter" style={{ color: "var(--primary)" }}>{typoTitle}</h2>
            <p className="text-[11px] font-medium leading-relaxed text-gray-500">{typoIntro}</p>
            {extras?.typographyAside && (
              <p className="text-[10px] leading-relaxed text-gray-400">{extras.typographyAside}</p>
            )}
          </div>

          {/* Right panel — font cards */}
          <div className={`grid flex-1 ${effectiveFonts.slice(0, 3).length > 1 ? (effectiveFonts.length >= 3 ? "grid-cols-3" : "grid-cols-2") : "grid-cols-1"}`}>
            {effectiveFonts.slice(0, 3).map((font, i) => (
              <div
                key={font.name}
                className="flex flex-col justify-between p-6 transition-all hover:brightness-95"
                style={{
                  backgroundColor: font.dark ? "var(--primary)" : "#f0f4ff",
                  borderLeft: i > 0 ? "1px solid rgba(0,0,0,0.06)" : "none",
                  color: font.dark ? contrastColor(theme?.colors.primary ?? "#000000") : "#111827",
                }}
              >
                <div className="flex flex-1 items-center justify-center py-8">
                  <span
                    className="text-6xl font-black tracking-tighter"
                    style={{ fontFamily: fontFamilyFor(font.name) }}
                  >
                    {font.sample || "Aa Bb"}
                  </span>
                </div>

                <div className="flex flex-col gap-2">
                  <h3 className="text-sm font-black truncate">{font.name}</h3>
                  <p className="text-[9px] font-bold uppercase tracking-widest opacity-60">
                    {font.weights ?? (font.dark ? "Medium" : "Regular, Medium")}
                  </p>
                  <span
                    className="w-fit rounded-full px-2.5 py-1 text-[8px] font-bold uppercase tracking-tighter"
                    style={{
                      backgroundColor: font.dark ? "rgba(255,255,255,0.2)" : "#e0e7ff",
                      color: font.dark ? "white" : "#4f46e5",
                    }}
                  >
                    {font.badge ?? font.role}
                  </span>
                  {font.body && (
                    <p className="text-[9px] leading-relaxed opacity-70 line-clamp-2">{font.body}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 2. Pro Color Palette Grid */}
      <section className="overflow-hidden shadow-sm" style={{ backgroundColor: "#ffffff", border: "1px solid #e5e7eb", borderRadius: "var(--radius)" }}>
        {/* Header row with toggle */}
        <div className="flex items-center justify-between px-4 py-2.5" style={{ backgroundColor: "#f6f8fa", borderBottom: "1px solid #e5e7eb" }}>
          <span className="text-[10px] font-black uppercase tracking-wider text-gray-400">Color Palette</span>
          {/* Toggle: scale | cards */}
          <div className="flex items-center gap-1 rounded-lg border border-gray-200 bg-white p-0.5">
            <button
              onClick={() => setPaletteView("scale")}
              className={`rounded-md px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider transition-all ${paletteView === "scale" ? "bg-gray-900 text-white shadow-sm" : "text-gray-400 hover:text-gray-700"}`}
            >
              Scale
            </button>
            <button
              onClick={() => setPaletteView("cards")}
              className={`rounded-md px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider transition-all ${paletteView === "cards" ? "bg-gray-900 text-white shadow-sm" : "text-gray-400 hover:text-gray-700"}`}
            >
              Cards
            </button>
          </div>
        </div>

        {paletteView === "scale" ? (
          <>
            {/* Scale step header */}
            <div className="grid grid-cols-[100px_repeat(10,1fr)_4px] py-2 text-center" style={{ borderBottom: "1px solid #e5e7eb" }}>
              <div />
              {["50", "100", "200", "300", "400", "500", "600", "700", "800", "900"].map((step) => (
                <span key={step} className="text-[10px] font-black text-gray-400">{step}</span>
              ))}
              <div />
            </div>
            <div className="divide-y divide-gray-100">
              {effectivePalette.map((row, idx) => {
                const allSame = row.swatches.length > 0 && row.swatches.every(s => s === row.swatches[0]);
                const swatches = (!row.swatches?.length || allSame)
                  ? generateColorScale(row.hex)
                  : row.swatches.slice(0, 10).concat(
                      Array(Math.max(0, 10 - row.swatches.length)).fill(row.swatches[row.swatches.length - 1])
                    );
                return (
                  <div key={row.name} className="grid grid-cols-[100px_repeat(10,1fr)_4px] items-center">
                    <div className="flex flex-col px-4 py-4">
                      <span className="text-[8px] font-bold uppercase text-gray-400">{String(idx + 1).padStart(2, "0")}</span>
                      <span className="text-[10px] font-bold text-gray-900">{row.name}</span>
                      <span className="text-[9px] font-mono uppercase text-gray-400">{row.hex}</span>
                    </div>
                    {swatches.map((color, i) => (
                      <div
                        key={i}
                        className="group relative h-16 w-full cursor-pointer transition-transform hover:z-10 hover:scale-105"
                        style={{ backgroundColor: color }}
                        onClick={() => copyColor(color.substring(0, 7))}
                        title={`Copy ${color.substring(0, 7)}`}
                      >
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20">
                          <span className="text-[8px] font-mono font-bold text-white drop-shadow-md select-none">
                            {copiedHex === color.substring(0, 7) ? "✓ Copied!" : color.substring(0, 7)}
                          </span>
                        </div>
                      </div>
                    ))}
                    <div />
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          /* Card view */
          <div className="grid grid-cols-2 gap-4 p-4">
            {effectivePalette.map((row) => {
              const allSame = row.swatches.length > 0 && row.swatches.every(s => s === row.swatches[0]);
              const swatches = (!row.swatches?.length || allSame)
                ? generateColorScale(row.hex)
                : row.swatches.slice(0, 10).concat(
                    Array(Math.max(0, 10 - row.swatches.length)).fill(row.swatches[row.swatches.length - 1])
                  );
              const textCol = contrastColor(row.hex);
              return (
                <div
                  key={row.name}
                  className="overflow-hidden rounded-2xl cursor-pointer"
                  style={{ backgroundColor: row.hex }}
                  onClick={() => copyColor(row.hex)}
                  title={`Copy ${row.hex}`}
                >
                  {/* Large swatch area with name + hex */}
                  <div className="flex items-end justify-between px-5 py-6 min-h-[140px]">
                    <span className="text-lg font-black" style={{ color: textCol }}>
                      {row.name}
                    </span>
                    <span className="font-mono text-sm font-bold" style={{ color: textCol }}>
                      {copiedHex === row.hex ? "✓ Copied!" : row.hex}
                    </span>
                  </div>
                  {/* Swatch scale strip at bottom */}
                  <div className="flex">
                    {swatches.map((color, i) => (
                      <div
                        key={i}
                        className="group relative h-10 flex-1 cursor-pointer"
                        style={{ backgroundColor: color }}
                        onClick={(e) => { e.stopPropagation(); copyColor(color.substring(0, 7)); }}
                        title={color.substring(0, 7)}
                      >
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20">
                          <span className="text-[7px] font-mono font-bold text-white drop-shadow select-none rotate-90">
                            {copiedHex === color.substring(0, 7) ? "✓" : color.substring(0, 7)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      <section className="p-8" style={{ backgroundColor: "#ffffff", border: "1px solid #e5e7eb", borderRadius: "var(--radius)" }}>
        <div className="mb-6 grid grid-cols-2 gap-8">
          <div className="flex items-center gap-2">
            <MousePointerClick size={14} className="text-gray-400" />
            <h2 className="text-lg font-bold tracking-tight text-gray-900">Buttons</h2>
          </div>
          <div className="flex items-center gap-2">
            <Square size={14} className="text-gray-400" />
            <h3 className="text-lg font-bold tracking-tight text-gray-900">Icons</h3>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-8">
          <div>
            <div className="mb-4 flex flex-col gap-3">
              <button
                className="flex w-fit items-center gap-2 px-5 py-3 text-sm"
                style={{
                  background: theme?.buttons.fill === "solid" ? "var(--primary)" : "transparent",
                  color: theme?.buttons.fill === "solid"
                    ? contrastColor(theme?.colors.primary ?? "#000000")
                    : "var(--primary)",
                  borderRadius: "var(--radius)",
                  border: theme?.buttons.fill === "outline" ? "var(--buttons-border-width, 1px) solid var(--primary)" : "none",
                  boxShadow: "var(--buttons-shadow, none)",
                  fontWeight: "var(--buttons-font-weight, 600)",
                  textTransform: theme?.buttons.textTransform as any,
                }}
                type="button"
              >
                <ArrowLeft size={13} /> Primary <ArrowRight size={13} />
              </button>
              <button
                className="flex w-fit items-center gap-2 px-5 py-3 text-sm font-medium text-gray-700"
                style={{
                  border: "1px solid #e5e7eb",
                  borderRadius: "var(--radius)",
                  backgroundColor: "#f6f8fa",
                }}
                type="button"
              >
                <ArrowLeft size={13} /> Secondary <ArrowRight size={13} />
              </button>
            </div>
            <p className="text-sm leading-relaxed text-gray-500">{buttonsBlurb}</p>
          </div>
          <div>
            <div className="mb-4 flex flex-col gap-3">
              <span
                className="inline-block w-fit px-4 py-2 text-base font-black"
                style={{
                  backgroundColor: "#f6f8fa",
                  borderRadius: "var(--radius)",
                  border: "1px solid #e5e7eb",
                  color: "var(--primary)",
                }}
              >
                {card.name}
              </span>
              <div className="flex gap-2">
                <span className="flex items-center gap-1.5 rounded-full border border-gray-200 bg-gray-900 px-3 py-1.5 text-xs font-semibold text-white">
                  <Apple size={14} /> Apple
                </span>
                <span className="flex items-center justify-center rounded-full border border-gray-200 bg-gray-100 px-3 py-1.5 text-gray-700">
                  <Bell size={14} />
                </span>
              </div>
            </div>
            {(extras?.motion?.badge || extras?.shapes?.badge) && (
              <span className="inline-block rounded px-2 py-1 text-[8px] font-bold uppercase tracking-wider" style={{ backgroundColor: "var(--primary)", color: contrastColor(theme?.colors.primary ?? "#000000") }}>
                {extras.motion?.badge ?? extras.shapes?.badge}
              </span>
            )}
          </div>
        </div>
      </section>

      <section className="overflow-hidden" style={{ backgroundColor: "#ffffff", border: "1px solid #e5e7eb", borderRadius: "var(--radius)" }}>
        <div className="flex min-h-[280px]">
          {/* Left panel — title + summary labels */}
          <div className="flex w-48 flex-shrink-0 flex-col justify-between p-6 border-r border-dashed border-gray-200">
            <div className="flex items-center gap-2">
              <Ruler size={14} className="text-gray-400" />
              <h2 className="text-lg font-bold tracking-tight text-gray-900">Spacing</h2>
            </div>
            <div className="space-y-3">
              <p className="text-[9px] font-bold uppercase tracking-wider text-gray-400">
                BASE RHYTHM:{" "}
                <span className="text-gray-600">
                  {(spacingCards.find((c) => c.label.toUpperCase() === "BASE")?.value ?? "4px").toUpperCase()}
                </span>
              </p>
              {spacingRules[0] && (
                <p className="text-[9px] font-medium text-gray-500">{spacingRules[0]}</p>
              )}
            </div>
          </div>

          {/* Right panel — metric cards + steps + rules */}
          <div className="flex flex-1 flex-col gap-5 p-6">
            {/* Metric cards row */}
            <div className="grid grid-cols-3 gap-3">
              {spacingCards.map((item) => (
                <div key={item.label} className="flex flex-col gap-0.5 border-b border-gray-100 pb-3">
                  <p className="text-[8px] font-bold uppercase tracking-wider text-gray-400">{item.label}</p>
                  <p className="text-3xl font-black" style={{ color: "var(--primary)" }}>{item.value}</p>
                  <p className="text-[9px] font-medium uppercase tracking-wider text-gray-400">{item.sublabel}</p>
                </div>
              ))}
            </div>

            {/* Step bars */}
            <div className="space-y-2">
              {spacingSteps.map((step) => (
                <div key={step.label} className="flex items-center gap-3">
                  <span className="w-12 text-[10px] font-medium text-gray-400">{step.label}</span>
                  <div className="flex-1 rounded-full bg-gray-100">
                    <div className="h-1.5 rounded-full" style={{ width: step.pct, backgroundColor: "var(--primary)" }} />
                  </div>
                  <span className="w-8 text-right text-[10px] font-medium text-gray-500">{step.value}</span>
                </div>
              ))}
            </div>

            {/* Bottom rule chips */}
            <div className="flex flex-wrap gap-4 border-t border-gray-100 pt-3">
              {spacingRules.slice(1).map((r) => (
                <p key={r} className="text-[9px] font-medium uppercase tracking-wider text-gray-500">{r}</p>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="overflow-hidden" style={{ backgroundColor: "#ffffff", border: "1px solid #e5e7eb", borderRadius: "var(--radius)" }}>
        <div className="flex min-h-[280px]">
          {/* Left panel — title + description */}
          <div className="flex w-48 flex-shrink-0 flex-col gap-4 p-6 border-r border-dashed border-gray-200">
            <div className="flex items-center gap-2">
              <Layers size={14} className="text-gray-400" />
              <h2 className="text-lg font-bold tracking-tight text-gray-900">Elevation &amp; Depth</h2>
            </div>
            <p className="text-[11px] leading-relaxed text-gray-400">{elevIntro}</p>
          </div>

          {/* Right panel — staggered rows + chips */}
          <div className="flex flex-1 flex-col justify-between p-6">
            <div className="space-y-3">
              {elevRows.map((row, i) => (
                <div
                  key={row.label}
                  className="rounded-xl border border-gray-100 bg-[#f8f9fa] px-5 py-3"
                  style={{ marginLeft: `${i * 48}px` }}
                >
                  <p className="mb-1 text-[9px] font-bold uppercase tracking-wider text-gray-400">{row.label}</p>
                  <p className="font-mono text-sm font-semibold text-gray-700 truncate">{row.value}</p>
                </div>
              ))}
            </div>

            {/* Chips row */}
            <div className="mt-4 flex flex-wrap gap-2 border-t border-gray-100 pt-4">
              {elevChips.map((tag) => (
                <span key={tag} className="rounded-full px-3 py-1 font-mono text-[9px] font-bold bg-blue-50 text-blue-400">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="p-8" style={{ backgroundColor: "#ffffff", border: "1px solid #e5e7eb", borderRadius: "var(--radius)" }}>
        <div className="mb-8 flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="max-w-md">
            <div className="mb-4 flex items-center gap-2">
              <Square size={16} className="text-gray-400" />
              <h2 className="text-xl font-bold tracking-tight text-gray-900">Shape Language</h2>
            </div>
            <p className="mb-4 text-sm leading-relaxed text-gray-500">{shapeIntro}</p>
            <div className="flex flex-wrap gap-2">
              <span className="inline-block px-3 py-1 text-[10px] font-bold uppercase tracking-wider shadow-sm" style={{ backgroundColor: "var(--primary)", color: contrastColor(theme?.colors.primary ?? "#000000"), borderRadius: "6px" }}>
                {shapeBadge}
              </span>
              <span className="inline-block px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-gray-500 bg-gray-100 rounded-[6px]">
                Geometry
              </span>
              <span className="inline-block px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-gray-500 bg-gray-100 rounded-[6px]">
                Tactile
              </span>
            </div>
          </div>
          
          {/* Radius Scale Visualization */}
          <div className="flex-1 flex justify-end">
            <div className="flex items-end gap-5 rounded-xl bg-[#f6f8fa] p-5 border border-gray-100 shadow-inner">
              {[
                { label: "2px", rad: "2px", h: "h-8", w: "w-8" },
                { label: "Base", rad: "var(--radius)", h: "h-12", w: "w-12" },
                { label: "Large", rad: "calc(var(--radius) * 2)", h: "h-16", w: "w-16" },
                { label: "Pill", rad: "9999px", h: "h-16", w: "w-24" }
              ].map((step, i) => (
                <div key={i} className="flex flex-col items-center gap-2 group cursor-crosshair">
                  <div className={`bg-white border border-gray-200 shadow-sm transition-all duration-300 group-hover:border-[var(--primary)] group-hover:shadow-md ${step.h} ${step.w}`} style={{ borderRadius: step.rad }} />
                  <span className="text-[9px] font-mono font-bold text-gray-400 transition-colors group-hover:text-gray-700">{step.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Interactive Shape Preview Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Cards Preview */}
          <div className="group relative overflow-hidden bg-[#f6f8fa] p-6 transition-all hover:bg-gray-50" style={{ border: "1px solid #e5e7eb", borderRadius: "calc(var(--radius) * 1.5)" }}>
            <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-gray-400">Cards</h3>
            <div className="relative h-28 w-full bg-white shadow-sm transition-all duration-500 group-hover:-translate-y-1 group-hover:shadow-lg" style={{ borderRadius: "var(--radius)", border: "1px solid #f3f4f6" }}>
              <div className="absolute top-0 left-0 w-full h-10 bg-gray-50/50 border-b border-gray-100" style={{ borderTopLeftRadius: "var(--radius)", borderTopRightRadius: "var(--radius)" }} />
              <div className="absolute bottom-3 left-3 flex gap-2">
                <div className="h-6 w-6 bg-gray-100" style={{ borderRadius: "calc(var(--radius) * 0.75)" }} />
                <div className="h-2 w-16 mt-2 rounded-full bg-gray-100" />
              </div>
            </div>
          </div>

          {/* Panels Preview */}
          <div className="group relative overflow-hidden bg-[#f6f8fa] p-6 transition-all hover:bg-gray-50" style={{ border: "1px solid #e5e7eb", borderRadius: "calc(var(--radius) * 1.5)" }}>
            <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-gray-400">Panels</h3>
            <div className="relative h-28 w-full bg-white shadow-sm transition-all duration-500 group-hover:scale-[1.02]" style={{ borderRadius: "calc(var(--radius) * 2)", border: "1px solid #f3f4f6" }}>
              <div className="absolute top-2 left-2 right-2 bottom-2 bg-gray-50 border border-gray-100 border-dashed transition-all duration-500 group-hover:bg-gray-100" style={{ borderRadius: "calc(var(--radius) * 1.5)" }} />
            </div>
          </div>

          {/* Controls Preview */}
          <div className="group relative overflow-hidden bg-[#f6f8fa] p-6 transition-all hover:bg-gray-50" style={{ border: "1px solid #e5e7eb", borderRadius: "calc(var(--radius) * 1.5)" }}>
            <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-gray-400">Controls</h3>
            <div className="flex h-28 flex-col justify-center gap-3 w-full">
              <div className="h-8 w-full bg-white shadow-sm transition-all duration-300 group-hover:border-[var(--primary)] group-hover:shadow-md" style={{ borderRadius: "var(--radius)", border: "1px solid #e5e7eb" }} />
              <div className="flex gap-2">
                <div className="h-8 w-1/2 shadow-sm transition-all duration-300 group-hover:brightness-110" style={{ borderRadius: "var(--radius)", border: "1px solid #e5e7eb", backgroundColor: "var(--primary)" }} />
                <div className="h-8 w-1/2 bg-white shadow-sm transition-all duration-300 group-hover:-translate-y-0.5 group-hover:shadow-md" style={{ borderRadius: "var(--radius)", border: "1px solid #e5e7eb" }} />
              </div>
            </div>
          </div>

          {/* Media Preview */}
          <div className="group relative overflow-hidden bg-[#f6f8fa] p-6 transition-all hover:bg-gray-50" style={{ border: "1px solid #e5e7eb", borderRadius: "calc(var(--radius) * 1.5)" }}>
            <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-gray-400">Media</h3>
            <div className="relative h-28 w-full overflow-hidden bg-gray-200 transition-all duration-500 group-hover:scale-[0.98] shadow-inner" style={{ borderRadius: "var(--radius)" }}>
              {/* Fake image gradient to look like a photo placeholder */}
              <div className="absolute inset-0 bg-gradient-to-tr from-gray-300 to-gray-100" />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100 bg-black/5">
                <div className="h-8 w-8 rounded-full bg-white/80 backdrop-blur flex items-center justify-center shadow-sm">
                  <div className="w-0 h-0 border-t-[4px] border-t-transparent border-l-[6px] border-l-gray-700 border-b-[4px] border-b-transparent ml-0.5" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Shape Characteristics Notes */}
        <div className="rounded-xl bg-[#f6f8fa] p-5 border border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
            <div className="flex items-start gap-3">
              <Check size={14} className="text-[var(--primary)] mt-0.5 flex-shrink-0" />
              <p className="text-xs text-gray-600 font-medium">Tight radius system applied universally across interactive elements to maintain a structured feel.</p>
            </div>
            <div className="flex items-start gap-3">
              <Check size={14} className="text-[var(--primary)] mt-0.5 flex-shrink-0" />
              <p className="text-xs text-gray-600 font-medium">Soft container hierarchy with distinct nested border radii to prevent visual clipping.</p>
            </div>
            <div className="flex items-start gap-3">
              <Check size={14} className="text-[var(--primary)] mt-0.5 flex-shrink-0" />
              <p className="text-xs text-gray-600 font-medium">Sharp media framing where appropriate, scaling proportionally to bounding box dimensions.</p>
            </div>
            <div className="flex items-start gap-3">
              <Check size={14} className="text-[var(--primary)] mt-0.5 flex-shrink-0" />
              <p className="text-xs text-gray-600 font-medium">Fully rounded controls (pill shapes) reserved strictly for primary actions and tags.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="overflow-hidden" style={{ backgroundColor: "#ffffff", border: "1px solid #e5e7eb", borderRadius: "var(--radius)" }}>
        <div className="flex min-h-[280px]">
          {/* Left panel — title + badge */}
          <div className="flex w-48 flex-shrink-0 flex-col justify-between p-6 border-r border-dashed border-gray-200">
            <div className="flex items-center gap-2">
              <Clock size={14} className="text-gray-400" />
              <h2 className="text-lg font-bold tracking-tight text-gray-900">Motion</h2>
            </div>
            <span className="w-fit rounded-full px-3 py-1.5 text-[9px] font-bold uppercase tracking-wider bg-blue-50 text-blue-400">
              {motionBadge}
            </span>
          </div>

          {/* Right panel */}
          <div className="flex flex-1 flex-col gap-5 p-6">
            {/* Timing chips */}
            <div className="flex flex-wrap gap-2">
              {motionTags.map((tag) => (
                <span key={tag} className="rounded-full px-3 py-1 text-[9px] font-bold bg-blue-50 text-blue-400">
                  {tag}
                </span>
              ))}
            </div>

            {/* Progress bars */}
            <div className="space-y-2">
              {motionBars.map((item) => (
                <div key={item.label} className="flex items-center gap-3">
                  <span className="w-14 text-[10px] font-medium uppercase tracking-wider text-gray-400">{item.label}</span>
                  <div className="flex-1 rounded-full bg-gray-100">
                    <div className="h-1.5 rounded-full" style={{ width: item.pct, backgroundColor: "var(--primary)" }} />
                  </div>
                </div>
              ))}
            </div>

            {/* Step cards */}
            <div className="grid border border-gray-100 rounded-xl overflow-hidden" style={{ gridTemplateColumns: `repeat(${motionSteps.length}, 1fr)` }}>
              {motionSteps.map(([step, val], i) => (
                <div
                  key={step}
                  className="flex flex-col gap-1 p-4"
                  style={{ borderLeft: i > 0 ? "1px solid #f3f4f6" : "none" }}
                >
                  <p className="text-[9px] font-bold uppercase tracking-wider text-gray-400">{step}</p>
                  <p className="text-2xl font-black text-gray-800">{val}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="p-8" style={{ backgroundColor: "#ffffff", border: "1px solid #e5e7eb", borderRadius: "var(--radius)" }}>
        <div className="mb-6 flex items-center gap-2">
          <AlertCircle size={14} className="text-gray-400" />
          <h2 className="text-lg font-bold tracking-tight text-gray-900">Do&apos;s and Don&apos;ts</h2>
        </div>
        <p className="mb-6 max-w-lg text-sm leading-relaxed text-gray-500">{guideIntro}</p>
        <div className="grid grid-cols-2 gap-8">
          <div>
            <span className="mb-4 inline-block rounded px-3 py-1.5 text-[8px] font-bold uppercase tracking-wider" style={{ backgroundColor: "var(--primary)", color: contrastColor(theme?.colors.primary ?? "#000000") }}>
              ✓ Do
            </span>
            <div className="space-y-3">
              {dos.map((item, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <Check size={13} className="mt-0.5 flex-shrink-0" style={{ color: "var(--primary)" }} />
                  <p className="text-xs leading-relaxed text-gray-500">{item}</p>
                </div>
              ))}
            </div>
          </div>
          <div>
            <span className="mb-4 inline-block rounded bg-red-100 px-3 py-1.5 text-[8px] font-bold uppercase tracking-wider text-red-600">
              ✕ Don&apos;t
            </span>
            <div className="space-y-3">
              {donts.map((item, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <X size={13} className="mt-0.5 flex-shrink-0 text-red-500" />
                  <p className="text-xs leading-relaxed text-gray-500">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {(tokens.typography.scale || tokens.spacingScale || tokens.implementation) && (
        <section className="p-8" style={{ backgroundColor: "#ffffff", border: "1px solid #e5e7eb", borderRadius: "var(--radius)" }}>
          <div className="mb-6 flex items-center gap-2">
            <Layers size={14} className="text-gray-400" />
            <h2 className="text-lg font-bold tracking-tight text-gray-900">Engineering Specs</h2>
          </div>

          <div className="space-y-8">
            {tokens.typography.scale && (
              <div>
                <h3 className="mb-3 text-[10px] font-bold uppercase tracking-wider text-gray-400">Type Scale</h3>
                <div className="overflow-x-auto rounded-xl border border-gray-200">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-gray-200 bg-gray-50 text-gray-500">
                        <th className="px-4 py-2 font-bold">Element</th>
                        <th className="px-4 py-2 font-bold">Size</th>
                        <th className="px-4 py-2 font-bold">Line Height</th>
                        <th className="px-4 py-2 font-bold">Letter Spacing</th>
                        <th className="px-4 py-2 font-bold">Weight</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tokens.typography.scale.map((row, i) => (
                        <tr key={i} className="border-b border-gray-100 text-gray-700">
                          <td className="px-4 py-3 font-bold">{row.element}</td>
                          <td className="px-4 py-3 font-mono">{row.size}</td>
                          <td className="px-4 py-3 font-mono">{row.lineHeight}</td>
                          <td className="px-4 py-3 font-mono">{row.letterSpacing}</td>
                          <td className="px-4 py-3 font-mono">{row.weight}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {tokens.spacingScale && (
              <div>
                <h3 className="mb-3 text-[10px] font-bold uppercase tracking-wider text-gray-400">Spacing Scale</h3>
                <div className="grid grid-cols-2 gap-4">
                  {tokens.spacingScale.map((s, i) => (
                    <div key={i} className="flex items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 p-3">
                      <div className="w-20 flex-shrink-0 font-mono text-[10px] text-gray-400">{s.token}</div>
                      <div className="w-12 text-right font-black" style={{ color: "var(--primary)" }}>{s.value}</div>
                      <div className="truncate text-[10px] font-medium text-gray-500">{s.usage}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {tokens.implementation?.cssVariables && (
              <div>
                <h3 className="mb-3 text-[10px] font-bold uppercase tracking-wider text-gray-400">Implementation Notes</h3>
                <div className="rounded-xl bg-gray-900 p-5">
                  <pre className="overflow-x-auto font-mono text-[10px] leading-relaxed text-gray-100">
                    <code>{tokens.implementation.cssVariables}</code>
                  </pre>
                </div>
              </div>
            )}
          </div>
        </section>
      )}
    </div>
    </div>
  );
}
