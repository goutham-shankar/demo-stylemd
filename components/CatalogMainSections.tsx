"use client";

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

function fontFamilyFor(fontName: string): string {
  const safe = fontName.replace(/"/g, "'");
  return `'${safe}', system-ui, sans-serif`;
}

export type CatalogMainSectionsProps = {
  card: DesignCard;
  extras: StyleMdUiPayload | null;
};

export function CatalogMainSections({ card, extras }: CatalogMainSectionsProps) {
  const { tokens } = card;
  const a = tokens.colors.primary;
  const s = tokens.colors.secondary;
  const acc = tokens.colors.accent;

  const typoTitle = extras?.typographyTitle ?? "Typography";
  const typoIntro = extras?.typographyIntro ?? "A composed hierarchy for page storytelling";
  const typoAside =
    extras?.typographyAside ??
    `Design system built around ${tokens.typography.heading} and ${tokens.typography.body}.`;

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
    <div className="space-y-6">
      <section className="overflow-hidden rounded-2xl border border-light bg-surface">
        <div className="grid h-[360px] grid-cols-1 gap-0 md:grid-cols-[1fr_2fr]">
          <div className="flex flex-col justify-between bg-surface p-8">
            <div>
              <h2 className="heading-h3 mb-3 tracking-tight">{typoTitle}</h2>
              <p className="mb-4 text-sm leading-relaxed text-secondary">{typoIntro}</p>
              <p className="text-xs leading-relaxed text-secondary">{typoAside}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-0">
            {card.fonts.map((font) => {
              const ext = extras?.fonts?.find((f) => f.name === font.name);
              const weights = ext?.weights ?? (font.dark ? "Medium" : "Regular, Medium");
              const badge = ext?.badge ?? (font.dark ? "HEADING SYSTEM" : "BODY SYSTEM");
              const body =
                ext?.body ??
                (font.dark ? "Used for titles and heading text" : "Used for secondary heading and body copy...");
              return (
                <div
                  key={font.name}
                  className={`flex flex-col justify-between p-6 transition-all ${font.dark ? "shadow-md border" : ""}`}
                  style={font.dark ? { background: a, borderColor: `${a}cc` } : { background: `${a}14` }}
                >
                  <div>
                    <p
                      className={`mb-2 text-2xs uppercase tracking-wider ${font.dark ? "text-white/90" : "text-secondary"}`}
                    >
                      {font.name}
                    </p>
                    <p
                      className={`font-black tracking-tight leading-tight ${font.dark ? "text-white text-6xl" : "text-primary text-7xl"}`}
                      style={{ fontFamily: fontFamilyFor(font.name) }}
                    >
                      {font.sample}
                    </p>
                  </div>
                  <div>
                    <p className={`mb-1 text-base font-bold ${font.dark ? "text-white" : "text-primary"}`}>{font.role}</p>
                    <p className={`mb-3 text-[10px] ${font.dark ? "text-white/90" : "text-secondary"}`}>{weights}</p>
                    <span
                      className={`inline-block rounded px-2 py-1 text-[9px] font-bold uppercase tracking-wider ${
                        font.dark ? "bg-white/20 text-white" : "text-white"
                      }`}
                      style={font.dark ? undefined : { backgroundColor: a }}
                    >
                      {badge}
                    </span>
                    <p className={`mt-3 text-[10px] leading-relaxed ${font.dark ? "text-white/85" : "text-secondary"}`}>
                      {body}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="overflow-hidden rounded-2xl bg-[#0d0d1a] p-8">
        <div className="mb-3 grid grid-cols-[90px_repeat(10,1fr)] gap-1 text-center">
          <div />
          {["50", "100", "200", "300", "400", "500", "600", "700", "800", "900"].map((s) => (
            <div key={s} className="text-2xs text-secondary">
              {s}
            </div>
          ))}
        </div>
        {card.palette.map((palette, index) => (
          <div key={palette.name} className="mb-4">
            <div className="grid grid-cols-[90px_repeat(10,1fr)] items-center gap-1">
              <div>
                <p className="text-2xs text-secondary">D{index + 1}</p>
                <p className="text-xs font-bold text-white">{palette.name}</p>
                <p className="font-mono text-2xs text-secondary">{palette.hex}</p>
              </div>
              {palette.swatches.slice(0, 10).map((swatch, i) => (
                <div key={i} className="h-9 rounded-sm" style={{ background: swatch }} />
              ))}
            </div>
          </div>
        ))}
      </section>

      <section className="rounded-2xl border border-light bg-surface p-8">
        <div className="mb-6 grid grid-cols-2 gap-8">
          <div className="flex items-center gap-2">
            <MousePointerClick size={14} className="text-secondary" />
            <h2 className="heading-h4 tracking-tight">Buttons</h2>
          </div>
          <div className="flex items-center gap-2">
            <Square size={14} className="text-secondary" />
            <h3 className="heading-h4 tracking-tight">Icons</h3>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-8">
          <div>
            <div className="mb-4 flex flex-col gap-3">
              <button
                className="flex w-fit items-center gap-2 px-5 py-3 text-sm font-semibold text-white"
                style={{ background: a, borderRadius: tokens.buttons.radius }}
                type="button"
              >
                <ArrowLeft size={13} /> Primary <ArrowRight size={13} />
              </button>
              <button
                className="flex w-fit items-center gap-2 px-5 py-3 text-sm font-medium text-primary"
                style={{ borderWidth: 1, borderStyle: "solid", borderColor: `${a}99`, borderRadius: tokens.buttons.radius, backgroundColor: s }}
                type="button"
              >
                <ArrowLeft size={13} /> Secondary <ArrowRight size={13} />
              </button>
            </div>
            <p className="text-sm leading-relaxed text-secondary">{buttonsBlurb}</p>
          </div>
          <div>
            <div className="mb-4 flex flex-col gap-3">
              <span
                className="inline-block w-fit rounded-full border px-4 py-2 text-base font-black"
                style={{ background: `${a}18`, borderColor: `${a}40`, color: a }}
              >
                {card.name}
              </span>
              <div className="flex gap-2">
                <span className="flex items-center gap-1.5 rounded-full border border-medium bg-gray-900 px-3 py-1.5 text-xs font-semibold text-white">
                  <Apple size={14} /> Apple
                </span>
                <span className="flex items-center justify-center rounded-full border border-medium bg-surface-soft px-3 py-1.5 text-primary">
                  <Bell size={14} />
                </span>
              </div>
            </div>
            <span className="inline-block rounded px-2 py-1 text-[8px] font-bold text-white" style={{ backgroundColor: `${a}cc` }}>
              BRAND
            </span>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-light bg-surface p-8">
        <div className="mb-6 flex items-center gap-2">
          <Ruler size={14} className="text-secondary" />
          <h2 className="heading-h4 tracking-tight">Spacing</h2>
        </div>
        <div className="mb-8 grid grid-cols-3 gap-4">
          {spacingCards.map((item) => (
            <div key={item.label} className="rounded-lg border border-light bg-surface p-4">
              <p className="text-3xs mb-2 uppercase tracking-wider text-secondary">{item.label}</p>
              <p className="mb-1 text-4xl font-bold" style={{ color: a }}>
                {item.value}
              </p>
              <p className="text-2xs text-secondary">{item.sublabel}</p>
            </div>
          ))}
        </div>
        <div className="mb-6 space-y-2">
          {spacingSteps.map((step) => (
            <div key={step.label} className="flex items-center gap-3">
              <span className="w-12 text-2xs text-secondary">{step.label}</span>
              <div className="flex-1 rounded-full bg-surface-soft">
                <div className="h-2 rounded-full" style={{ width: step.pct, backgroundColor: a }} />
              </div>
              <span className="w-8 text-right text-2xs text-secondary">{step.value}</span>
            </div>
          ))}
        </div>
        <p className="text-3xs mb-3 uppercase tracking-wider text-secondary">
          BASE RHYTHM:{` `}
          {(spacingCards.find((c) => c.label.toUpperCase() === "BASE")?.value ?? "4px").toUpperCase()}
        </p>
        <div className="flex flex-wrap gap-4">
          {spacingRules.map((r) => (
            <p key={r} className="text-2xs text-secondary">
              {r}
            </p>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-light bg-surface p-8">
        <div className="mb-6 flex items-center gap-2">
          <Layers size={14} className="text-secondary" />
          <h2 className="heading-h4 tracking-tight">Elevation &amp; Depth</h2>
        </div>
        <p className="mb-6 max-w-lg text-sm leading-relaxed text-secondary">{elevIntro}</p>
        <div className="mb-6 divide-y divide-light overflow-hidden rounded-lg border border-light">
          {elevRows.map((row) => (
            <div
              key={row.label}
              className={`flex gap-4 px-5 py-4 ${String(row.label).toUpperCase() === "SHADOW" ? "items-start" : "items-center"}`}
            >
              <span className="w-20 flex-shrink-0 text-2xs uppercase tracking-wider text-secondary">{row.label}</span>
              <span className="break-all font-mono text-xs font-semibold text-primary">{row.value}</span>
            </div>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          {elevChips.map((tag) => (
            <span key={tag} className="rounded bg-surface-soft px-2.5 py-1.5 font-mono text-[8px] text-secondary">
              {tag}
            </span>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-light bg-surface p-8">
        <div className="mb-6 flex items-center gap-2">
          <Square size={14} className="text-secondary" />
          <h2 className="heading-h4 tracking-tight">Shapes</h2>
        </div>
        <div className="grid grid-cols-2 gap-8">
          <div>
            <p className="mb-4 text-sm leading-relaxed text-secondary">{shapeIntro}</p>
            <span className="inline-block rounded px-3 py-1.5 text-[8px] font-bold uppercase tracking-wider text-white" style={{ backgroundColor: a }}>
              {shapeBadge}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {shapeItems.map((label) => (
              <button
                key={label}
                className="border border-medium px-4 py-8 text-sm font-semibold text-primary transition-all hover:shadow-sm"
                style={{ borderColor: `${a}33`, borderRadius: tokens.buttons.radius, backgroundColor: s }}
                type="button"
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-light bg-surface p-8">
        <div className="mb-6 flex items-center gap-2">
          <Clock size={14} className="text-secondary" />
          <h2 className="heading-h4 tracking-tight">Motion</h2>
        </div>
        <div className="mb-6 flex flex-wrap gap-2">
          {motionTags.map((tag) => (
            <span key={tag} className="rounded px-2 py-1 text-[8px] font-bold text-white" style={{ backgroundColor: `${a}dd` }}>
              {tag}
            </span>
          ))}
        </div>
        <div className="mb-6 space-y-2">
          {motionBars.map((item) => (
            <div key={item.label} className="flex items-center gap-3">
              <span className="w-14 text-2xs text-secondary">{item.label}</span>
              <div className="flex-1 rounded-full bg-surface-soft">
                <div className="h-2 rounded-full" style={{ width: item.pct, backgroundColor: a }} />
              </div>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-4">
          {motionSteps.map(([step, val]) => (
            <div key={step} className="rounded-lg border border-light bg-surface-soft p-4">
              <p className="mb-2 text-2xs text-secondary">{step}</p>
              <p className="text-2xl font-bold text-primary">{val}</p>
            </div>
          ))}
        </div>
        <span className="mt-4 inline-block rounded px-2 py-1 text-[8px] font-bold text-white" style={{ backgroundColor: a }}>
          {motionBadge}
        </span>
      </section>

      <section className="rounded-2xl border border-light bg-surface p-8">
        <div className="mb-6 flex items-center gap-2">
          <AlertCircle size={14} className="text-secondary" />
          <h2 className="heading-h4 tracking-tight">Do&apos;s and Don&apos;ts</h2>
        </div>
        <p className="mb-6 max-w-lg text-sm leading-relaxed text-secondary">{guideIntro}</p>
        <div className="grid grid-cols-2 gap-8">
          <div>
            <span className="mb-4 inline-block rounded px-3 py-1.5 text-[8px] font-bold uppercase tracking-wider text-white" style={{ backgroundColor: a }}>
              ✓ Do
            </span>
            <div className="space-y-3">
              {dos.map((item, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <Check size={13} className="mt-0.5 flex-shrink-0" style={{ color: a }} />
                  <p className="text-xs leading-relaxed text-secondary">{item}</p>
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
                  <p className="text-xs leading-relaxed text-secondary">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {(tokens.typography.scale || tokens.spacingScale || tokens.implementation) && (
        <section className="rounded-2xl border border-light bg-surface p-8">
          <div className="mb-6 flex items-center gap-2">
            <Layers size={14} className="text-secondary" />
            <h2 className="heading-h4 tracking-tight">Engineering Specs</h2>
          </div>
          
          <div className="space-y-8">
            {tokens.typography.scale && (
              <div>
                <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-secondary">Type Scale</h3>
                <div className="overflow-x-auto rounded-lg border border-light">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-light bg-surface-soft">
                        <th className="px-4 py-2 font-bold">Element</th>
                        <th className="px-4 py-2 font-bold">Size</th>
                        <th className="px-4 py-2 font-bold">Line Height</th>
                        <th className="px-4 py-2 font-bold">Letter Spacing</th>
                        <th className="px-4 py-2 font-bold">Weight</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tokens.typography.scale.map((row, i) => (
                        <tr key={i} className="border-b border-light last:border-0">
                          <td className="px-4 py-3 font-semibold">{row.element}</td>
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
                <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-secondary">Spacing Scale</h3>
                <div className="grid grid-cols-2 gap-4">
                  {tokens.spacingScale.map((s, i) => (
                    <div key={i} className="flex items-center gap-3 rounded-lg border border-light p-3">
                      <div className="flex-shrink-0 font-mono text-[10px] text-secondary w-20">{s.token}</div>
                      <div className="font-bold text-primary w-12 text-right">{s.value}</div>
                      <div className="text-xs text-secondary truncate">{s.usage}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {tokens.implementation?.cssVariables && (
              <div>
                <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-secondary">Implementation Notes</h3>
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
  );
}
