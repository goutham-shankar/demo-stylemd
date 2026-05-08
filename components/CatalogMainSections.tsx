"use client";

import { useMemo } from "react";
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

export function CatalogMainSections({ card, extras }: CatalogMainSectionsProps) {
  const { tokens, theme } = card;
  const a = tokens.colors.primary;
  const s = tokens.colors.secondary;

  const themeStyles = useMemo(() => {
    if (!theme) return {};
    return {
      "--primary": theme.colors.primary,
      "--secondary": theme.colors.secondary,
      "--accent": theme.colors.accent,
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
  }, [theme]);

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
    { label: "GAP", sublabel: "COMPONENTS", value: `calc(${spacingValue} * 2)` },
    { label: "SECTION", sublabel: "PAGE", value: `calc(${spacingValue} * 8)` },
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
        .stylemd-theme-root h1, .stylemd-theme-root h2, .stylemd-theme-root h3 {
          font-family: var(--font-display);
        }
        .stylemd-theme-root p, .stylemd-theme-root span, .stylemd-theme-root div {
          font-family: var(--font-body);
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
      <section style={{ gap: "var(--spacing-base)" }} className="flex flex-col">
        <div className="flex flex-col gap-1">
          <h2 className="text-3xl font-black tracking-tighter" style={{ color: "var(--primary)" }}>{typoTitle}</h2>
          <p className="text-sm font-medium" style={{ color: "var(--text-muted)" }}>{typoIntro}</p>
        </div>
        
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {card.fonts.slice(0, 2).map((font) => (
            <div
              key={font.name}
              className={`group relative flex flex-col justify-between overflow-hidden p-8 transition-all hover:shadow-2xl`}
              style={{ 
                backgroundColor: font.dark ? "var(--primary)" : "var(--surface)", 
                borderRadius: "var(--radius)",
                border: font.dark ? "none" : "1px solid var(--border)",
                color: font.dark ? "var(--background)" : "var(--text)"
              }}
            >
              <div className="flex flex-col items-center justify-center py-12">
                <span
                  className="text-8xl font-black tracking-tighter"
                  style={{ fontFamily: fontFamilyFor(font.name) }}
                >
                  {font.sample || "Aa Bb"}
                </span>
              </div>

              <div className="mt-4 flex flex-col gap-3">
                <div>
                  <h3 className="text-xl font-black">{font.name}</h3>
                  <p className="text-xs font-bold uppercase tracking-widest opacity-70">
                    {font.dark ? "Medium" : "Regular, Medium"}
                  </p>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <span className="rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-tighter"
                    style={{ 
                      backgroundColor: font.dark ? "rgba(255,255,255,0.2)" : "var(--background)",
                      border: font.dark ? "none" : "1px solid var(--border)",
                      color: font.dark ? "white" : "var(--text)"
                    }}>
                    {font.role}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 2. Pro Color Palette Grid */}
      <section className="overflow-hidden shadow-sm" style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--radius)" }}>
        <div className="grid grid-cols-[100px_repeat(10,1fr)] py-3 text-center" style={{ backgroundColor: "var(--background)", borderBottom: "1px solid var(--border)" }}>
          <div />
          {["50", "100", "200", "300", "400", "500", "600", "700", "800", "900"].map((step) => (
            <span key={step} className="text-[10px] font-black opacity-60" style={{ color: "var(--text)" }}>{step}</span>
          ))}
        </div>
        
        <div className="divide-y" style={{ borderColor: "var(--border)" }}>
          {card.palette.map((row) => {
            const allSame = row.swatches.length > 0 && row.swatches.every(s => s === row.swatches[0]);
            const swatches = (!row.swatches?.length || allSame)
              ? generateColorScale(row.hex)
              : row.swatches.slice(0, 10).concat(
                  Array(Math.max(0, 10 - row.swatches.length)).fill(row.swatches[row.swatches.length - 1])
                );
            return (
              <div key={row.name} className="grid grid-cols-[100px_repeat(10,1fr)] items-center">
                <div className="flex flex-col px-4 py-4">
                  <span className="text-[10px] font-bold" style={{ color: "var(--text)" }}>{row.name}</span>
                  <span className="text-[9px] font-mono uppercase opacity-70" style={{ color: "var(--text)" }}>{row.hex}</span>
                </div>
                {swatches.map((color, i) => (
                  <div
                    key={i}
                    className="group relative h-16 w-full cursor-pointer transition-transform hover:z-10 hover:scale-105"
                    style={{ backgroundColor: color }}
                  >
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/10">
                      <span className="text-[8px] font-mono font-bold text-white drop-shadow-md">
                        {color.substring(0, 7)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </section>

      <section className="p-8" style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--radius)" }}>
        <div className="mb-6 grid grid-cols-2 gap-8">
          <div className="flex items-center gap-2">
            <MousePointerClick size={14} style={{ color: "var(--text-muted)" }} />
            <h2 className="text-lg font-bold tracking-tight" style={{ color: "var(--text)" }}>Buttons</h2>
          </div>
          <div className="flex items-center gap-2">
            <Square size={14} style={{ color: "var(--text-muted)" }} />
            <h3 className="text-lg font-bold tracking-tight" style={{ color: "var(--text)" }}>Icons</h3>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-8">
          <div>
            <div className="mb-4 flex flex-col gap-3">
              <button
                className="flex w-fit items-center gap-2 px-5 py-3 text-sm"
                style={{ 
                  background: theme?.buttons.fill === "solid" ? "var(--primary)" : "transparent",
                  color: theme?.buttons.fill === "solid" ? "var(--background)" : "var(--primary)",
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
                className="flex w-fit items-center gap-2 px-5 py-3 text-sm font-medium"
                style={{ 
                  border: "1px solid var(--border)", 
                  borderRadius: "var(--radius)", 
                  backgroundColor: "var(--surface-muted)",
                  color: "var(--text)"
                }}
                type="button"
              >
                <ArrowLeft size={13} /> Secondary <ArrowRight size={13} />
              </button>
            </div>
            <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>{buttonsBlurb}</p>
          </div>
          <div>
            <div className="mb-4 flex flex-col gap-3">
              <span
                className="inline-block w-fit px-4 py-2 text-base font-black"
                style={{ 
                  background: "var(--accent-surface, var(--primary))", 
                  opacity: 0.1,
                  borderRadius: "var(--radius)",
                  color: "var(--primary)" 
                }}
              >
                {card.name}
              </span>
              <div className="flex gap-2">
                <span className="flex items-center gap-1.5 rounded-full border border-medium px-3 py-1.5 text-xs font-semibold" style={{ backgroundColor: "var(--text)", color: "var(--background)" }}>
                  <Apple size={14} /> Apple
                </span>
                <span className="flex items-center justify-center rounded-full border border-medium px-3 py-1.5" style={{ backgroundColor: "var(--surface-muted)", color: "var(--text)" }}>
                  <Bell size={14} />
                </span>
              </div>
            </div>
            <span className="inline-block rounded px-2 py-1 text-[8px] font-bold" style={{ backgroundColor: "var(--primary)", color: "var(--background)" }}>
              BRAND
            </span>
          </div>
        </div>
      </section>

      <section className="p-8" style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--radius)" }}>
        <div className="mb-6 flex items-center gap-2">
          <Ruler size={14} style={{ color: "var(--text-muted)" }} />
          <h2 className="text-lg font-bold tracking-tight" style={{ color: "var(--text)" }}>Spacing</h2>
        </div>
        <div className="mb-8 grid grid-cols-3 gap-4">
          {spacingCards.map((item) => (
            <div key={item.label} className="p-4" style={{ backgroundColor: "var(--surface-muted)", border: "1px solid var(--border)", borderRadius: "var(--radius)" }}>
              <p className="mb-2 text-[8px] font-bold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>{item.label}</p>
              <p className="mb-1 text-4xl font-black" style={{ color: "var(--primary)" }}>
                {item.value}
              </p>
              <p className="text-[10px] font-medium" style={{ color: "var(--text-muted)" }}>{item.sublabel}</p>
            </div>
          ))}
        </div>
        <div className="mb-6 space-y-2">
          {spacingSteps.map((step) => (
            <div key={step.label} className="flex items-center gap-3">
              <span className="w-12 text-[10px] font-medium" style={{ color: "var(--text-muted)" }}>{step.label}</span>
              <div className="flex-1 rounded-full" style={{ backgroundColor: "var(--surface-muted)" }}>
                <div className="h-2 rounded-full" style={{ width: step.pct, backgroundColor: "var(--primary)" }} />
              </div>
              <span className="w-8 text-right text-[10px] font-medium" style={{ color: "var(--text-muted)" }}>{step.value}</span>
            </div>
          ))}
        </div>
        <p className="mb-3 text-[8px] font-bold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
          BASE RHYTHM:{` `}
          {(spacingCards.find((c) => c.label.toUpperCase() === "BASE")?.value ?? "4px").toUpperCase()}
        </p>
        <div className="flex flex-wrap gap-4">
          {spacingRules.map((r) => (
            <p key={r} className="text-[10px] font-medium" style={{ color: "var(--text-muted)" }}>
              {r}
            </p>
          ))}
        </div>
      </section>

      <section className="p-8" style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--radius)" }}>
        <div className="mb-6 flex items-center gap-2">
          <Layers size={14} style={{ color: "var(--text-muted)" }} />
          <h2 className="text-lg font-bold tracking-tight" style={{ color: "var(--text)" }}>Elevation &amp; Depth</h2>
        </div>
        <p className="mb-6 max-w-lg text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>{elevIntro}</p>
        <div className="mb-6 divide-y overflow-hidden" style={{ borderColor: "var(--border)", border: "1px solid var(--border)", borderRadius: "var(--radius)" }}>
          {elevRows.map((row) => (
            <div
              key={row.label}
              className={`flex gap-4 px-5 py-4 ${String(row.label).toUpperCase() === "SHADOW" ? "items-start" : "items-center"}`}
              style={{ backgroundColor: "var(--surface)" }}
            >
              <span className="w-20 flex-shrink-0 text-[10px] font-bold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>{row.label}</span>
              <span className="break-all font-mono text-xs font-semibold" style={{ color: "var(--primary)" }}>{row.value}</span>
            </div>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          {elevChips.map((tag) => (
            <span key={tag} className="px-2.5 py-1.5 font-mono text-[8px] font-bold" style={{ backgroundColor: "var(--surface-muted)", borderRadius: "4px", color: "var(--text-muted)" }}>
              {tag}
            </span>
          ))}
        </div>
      </section>

      <section className="p-8" style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--radius)" }}>
        <div className="mb-6 flex items-center gap-2">
          <Square size={14} style={{ color: "var(--text-muted)" }} />
          <h2 className="text-lg font-bold tracking-tight" style={{ color: "var(--text)" }}>Shapes</h2>
        </div>
        <div className="grid grid-cols-2 gap-8">
          <div>
            <p className="mb-4 text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>{shapeIntro}</p>
            <span className="inline-block px-3 py-1.5 text-[8px] font-bold uppercase tracking-wider" style={{ backgroundColor: "var(--primary)", color: "var(--background)", borderRadius: "var(--radius)" }}>
              {shapeBadge}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {shapeItems.map((label) => (
              <button
                key={label}
                className="px-4 py-8 text-sm font-bold transition-all hover:shadow-md"
                style={{ border: "1px solid var(--border)", borderRadius: "var(--radius)", backgroundColor: "var(--surface-muted)", color: "var(--text)" }}
                type="button"
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="p-8" style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--radius)" }}>
        <div className="mb-6 flex items-center gap-2">
          <Clock size={14} style={{ color: "var(--text-muted)" }} />
          <h2 className="text-lg font-bold tracking-tight" style={{ color: "var(--text)" }}>Motion</h2>
        </div>
        <div className="mb-6 flex flex-wrap gap-2">
          {motionTags.map((tag) => (
            <span key={tag} className="px-2 py-1 text-[8px] font-bold" style={{ backgroundColor: "var(--primary)", color: "var(--background)", borderRadius: "4px" }}>
              {tag}
            </span>
          ))}
        </div>
        <div className="mb-6 space-y-2">
          {motionBars.map((item) => (
            <div key={item.label} className="flex items-center gap-3">
              <span className="w-14 text-[10px] font-medium" style={{ color: "var(--text-muted)" }}>{item.label}</span>
              <div className="flex-1 rounded-full" style={{ backgroundColor: "var(--surface-muted)" }}>
                <div className="h-2 rounded-full" style={{ width: item.pct, backgroundColor: "var(--primary)" }} />
              </div>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-4">
          {motionSteps.map(([step, val]) => (
            <div key={step} className="p-4" style={{ backgroundColor: "var(--surface-muted)", borderRadius: "var(--radius)", border: "1px solid var(--border)" }}>
              <p className="mb-2 text-[10px] font-bold uppercase" style={{ color: "var(--text-muted)" }}>{step}</p>
              <p className="text-2xl font-black" style={{ color: "var(--primary)" }}>{val}</p>
            </div>
          ))}
        </div>
        <span className="mt-4 inline-block px-2 py-1 text-[8px] font-bold" style={{ backgroundColor: "var(--primary)", color: "var(--background)", borderRadius: "4px" }}>
          {motionBadge}
        </span>
      </section>

      <section className="p-8" style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--radius)" }}>
        <div className="mb-6 flex items-center gap-2">
          <AlertCircle size={14} style={{ color: "var(--text-muted)" }} />
          <h2 className="text-lg font-bold tracking-tight" style={{ color: "var(--text)" }}>Do&apos;s and Don&apos;ts</h2>
        </div>
        <p className="mb-6 max-w-lg text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>{guideIntro}</p>
        <div className="grid grid-cols-2 gap-8">
          <div>
            <span className="mb-4 inline-block px-3 py-1.5 text-[8px] font-bold uppercase tracking-wider" style={{ backgroundColor: "var(--primary)", color: "var(--background)", borderRadius: "4px" }}>
              ✓ Do
            </span>
            <div className="space-y-3">
              {dos.map((item, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <Check size={13} className="mt-0.5 flex-shrink-0" style={{ color: "var(--primary)" }} />
                  <p className="text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>{item}</p>
                </div>
              ))}
            </div>
          </div>
          <div>
            <span className="mb-4 inline-block bg-red-100 px-3 py-1.5 text-[8px] font-bold uppercase tracking-wider text-red-600" style={{ borderRadius: "4px" }}>
              ✕ Don&apos;t
            </span>
            <div className="space-y-3">
              {donts.map((item, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <X size={13} className="mt-0.5 flex-shrink-0 text-red-500" />
                  <p className="text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {(tokens.typography.scale || tokens.spacingScale || tokens.implementation) && (
        <section className="p-8" style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--radius)" }}>
          <div className="mb-6 flex items-center gap-2">
            <Layers size={14} style={{ color: "var(--text-muted)" }} />
            <h2 className="text-lg font-bold tracking-tight" style={{ color: "var(--text)" }}>Engineering Specs</h2>
          </div>
          
          <div className="space-y-8">
            {tokens.typography.scale && (
              <div>
                <h3 className="mb-3 text-[10px] font-bold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>Type Scale</h3>
                <div className="overflow-x-auto" style={{ border: "1px solid var(--border)", borderRadius: "var(--radius)" }}>
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr style={{ backgroundColor: "var(--surface-muted)", borderBottom: "1px solid var(--border)" }}>
                        <th className="px-4 py-2 font-bold">Element</th>
                        <th className="px-4 py-2 font-bold">Size</th>
                        <th className="px-4 py-2 font-bold">Line Height</th>
                        <th className="px-4 py-2 font-bold">Letter Spacing</th>
                        <th className="px-4 py-2 font-bold">Weight</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tokens.typography.scale.map((row, i) => (
                        <tr key={i} style={{ borderBottom: "1px solid var(--border)" }}>
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
                <h3 className="mb-3 text-[10px] font-bold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>Spacing Scale</h3>
                <div className="grid grid-cols-2 gap-4">
                  {tokens.spacingScale.map((s, i) => (
                    <div key={i} className="flex items-center gap-3 p-3" style={{ border: "1px solid var(--border)", borderRadius: "var(--radius)", backgroundColor: "var(--surface-muted)" }}>
                      <div className="flex-shrink-0 font-mono text-[10px] w-20" style={{ color: "var(--text-muted)" }}>{s.token}</div>
                      <div className="font-black w-12 text-right" style={{ color: "var(--primary)" }}>{s.value}</div>
                      <div className="text-[10px] font-medium truncate" style={{ color: "var(--text-muted)" }}>{s.usage}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {tokens.implementation?.cssVariables && (
              <div>
                <h3 className="mb-3 text-[10px] font-bold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>Implementation Notes</h3>
                <div className="p-5" style={{ backgroundColor: "#111", borderRadius: "var(--radius)" }}>
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
