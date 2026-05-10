/**
 * Rich design-system preview: parses optional ```stylemd-ui JSON blocks from style.md
 * and renders HTML aligned with components/DesignDetailPage.tsx catalog layout.
 */

export type StyleMdUiFont = {
  name: string;
  sample?: string;
  role: string;
  dark?: boolean;
  weights?: string;
  badge?: string;
  body?: string;
};

export type StyleMdUiPaletteRow = {
  name: string;
  hex?: string;
  swatches: string[];
};

export type StyleMdUiPayload = {
  version?: number;
  brand: string;
  description?: string;
  accentColor: string;
  heroHeadline?: string;
  logoText?: string;
  logoUrl?: string;
  tags?: Array<string | { label: string }>;
  typographyTitle?: string;
  typographyIntro?: string;
  typographyAside?: string;
  fonts: StyleMdUiFont[];
  palette: StyleMdUiPaletteRow[];
  buttonsBlurb?: string;
  spacing?: {
    cards?: Array<{ label: string; sublabel: string; value: string }>;
    steps?: Array<{ label: string; pct: string; value: string }>;
    rules?: string[];
  };
  elevation?: {
    intro?: string;
    rows?: Array<{ label: string; value: string }>;
    chips?: string[];
  };
  shapes?: {
    intro?: string;
    badge?: string;
    items?: string[];
  };
  motion?: {
    tags?: string[];
    bars?: Array<{ label: string; pct: string }>;
    steps?: Array<[string, string]>;
    badge?: string;
  };
  guidelines?: {
    intro?: string;
    dos?: string[];
    donts?: string[];
  };
};

function escHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function padSwatches(swatches: string[], count = 10): string[] {
  const out = swatches.slice(0, count);
  while (out.length < count) {
    out.push(out[out.length - 1] ?? "#cccccc");
  }
  return out;
}

function tagLabel(t: string | { label: string }): string {
  return typeof t === "string" ? t : t.label;
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

const DEFAULT_MOTION_BARS = [
  { label: "TEXT", pct: "40%" },
  { label: "COLOR", pct: "60%" },
  { label: "STROKE", pct: "50%" },
];

function extractBrandFromMd(md: string): string {
  const boldMatch = md.slice(0, 600).match(/\*\*([^*\n]{1,60})\*\*/);
  if (boldMatch) return boldMatch[1].trim();
  const h1Match = md.match(/^#\s+(.+)$/m);
  if (h1Match) {
    const raw = h1Match[1].trim();
    if (!/^(?:design|style)\.?md$/i.test(raw)) return raw;
  }
  return "Design System";
}

function buildPayloadFromTokens(parsed: Record<string, unknown>, md: string): StyleMdUiPayload {
  const paletteRaw = Array.isArray(parsed.palette) ? (parsed.palette as Record<string, unknown>[]) : [];
  const accentColor = String(parsed.accentColor ?? paletteRaw[0]?.hex ?? "#000000");

  const fonts: StyleMdUiFont[] = Array.isArray(parsed.fonts)
    ? (parsed.fonts as Record<string, unknown>[]).map((f) => ({
        name: String(f.name ?? ""),
        role: String(f.role ?? "Body"),
        dark: /heading|display|title/i.test(String(f.role ?? "")),
        sample: "Aa Bb",
      }))
    : [];

  const palette: StyleMdUiPaletteRow[] = paletteRaw.map((p) => ({
    name: String(p.name ?? ""),
    hex: String(p.hex ?? accentColor),
    swatches: [],
  }));

  return { brand: extractBrandFromMd(md), accentColor, fonts, palette };
}

/**
 * Strip ```stylemd-ui / ```stylemd-json / ```json fenced blocks and parse the first valid payload.
 * Also handles token-format ```json blocks (with accentColor / palette but no brand field).
 */
export function extractStyleMdUi(md: string): { payload: StyleMdUiPayload | null; remainder: string } {
  let payload: StyleMdUiPayload | null = null;
  const remainder = md
    .replace(/```(?:stylemd-ui|stylemd-json|json)\s*\n([\s\S]*?)```/g, (fullMatch, inner: string) => {
      try {
        const parsed = JSON.parse(String(inner).trim()) as Record<string, unknown>;
        if (parsed?.brand && parsed?.accentColor) {
          // Full stylemd-ui format
          if (!payload) payload = parsed as unknown as StyleMdUiPayload;
          return "\n\n";
        }
        if (!payload && (parsed?.accentColor || parsed?.palette)) {
          // Token-format JSON — build a minimal payload from available data
          payload = buildPayloadFromTokens(parsed, md);
          return "\n\n";
        }
      } catch {
        /* not valid JSON — leave block intact */
      }
      return fullMatch;
    })
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  return { payload, remainder };
}

export function renderStructuredDesignHtml(p: StyleMdUiPayload): string {
  const accent = p.accentColor;
  const tags = (p.tags ?? []).map(tagLabel);
  const fonts = p.fonts?.length ? p.fonts : [{ name: "Display", sample: "Aa Bb", role: "HEADING SYSTEM", dark: true }];
  const palette = p.palette?.length
    ? p.palette
    : [
        {
          name: "Primary",
          hex: accent,
          swatches: padSwatches([accent]),
        },
      ];

  const spacingCards = p.spacing?.cards?.length ? p.spacing.cards : DEFAULT_SPACING_CARDS;
  const spacingSteps = p.spacing?.steps?.length ? p.spacing.steps : DEFAULT_SPACING_STEPS;
  const spacingRules = p.spacing?.rules ?? [
    "BASE RHYTHM: 4PX",
    "SECTION PADDING: 32PX, 56PX",
    "CARD PADDING: 32PX, 56PX",
    "GAPS: 8PX, 32PX",
  ];

  const elevRows = p.elevation?.rows ?? [
    { label: "SURFACE", value: "Glass" },
    { label: "BORDER", value: "1px #FFFFFF" },
    { label: "SHADOW", value: "rgba(25, 28, 33, 0.02) 0px 1px 0px..." },
  ];
  const elevChips = p.elevation?.chips ?? [
    "GLASS",
    "1PX #FFFFFF",
    "rgba(0, 0, 0) 0px...",
    "rgba(25, 28, 33, 0.08) 0px...",
  ];

  const shapeItems = p.shapes?.items ?? ["Cards", "Panels", "Controls", "Media"];
  const motionTags = p.motion?.tags ?? ["150MS", "200MS", "EASE", "CUBIC-BEZIER(0.4..."];
  const motionBars = p.motion?.bars?.length ? p.motion.bars : DEFAULT_MOTION_BARS;
  const motionSteps = p.motion?.steps ?? [
    ["STEP 1", "150ms"],
    ["STEP 2", "200ms"],
  ];

  const dos =
    p.guidelines?.dos ?? [
      "Use the primary palette as the main accent for emphasis and action states.",
      "Keep spacing aligned to the detected 4px rhythm.",
      "Reuse the Glass surface treatment consistently across cards and controls.",
      "Keep corner radii within the detected 2px, 4px, 20px, 9999px family.",
    ];
  const donts =
    p.guidelines?.donts ?? [
      "Do not introduce extra accent colors outside the core palette roles unless approved.",
      "Do not mix unrelated shadow or blur recipes that break the current depth language.",
      "Do not exceed the detected moderate motion intensity without a deliberate rationale.",
    ];

  const typographyTitle = p.typographyTitle ?? "Typography";
  const typographyIntro = p.typographyIntro ?? "A composed hierarchy for page storytelling";
  const typographyAside =
    p.typographyAside ??
    "Orchestrate systems intelligently. Used for secondary heading moments and supporting display contrasts.";

  const shadeLabels = ["50", "100", "200", "300", "400", "500", "600", "700", "800", "900"];

  const fontCardsHtml = fonts
    .slice(0, 4)
    .map((font) => {
      const dark = !!font.dark;
      const hue = /^#[0-9A-Fa-f]{6}$/.test(accent) ? accent : "#1067FE";
      const bg = dark ? hue : /^#[0-9A-Fa-f]{6}$/.test(hue) ? `${hue}14` : hue;
      const sample = font.sample ?? "Aa Bb";
      const weights = font.weights ?? (dark ? "Medium" : "Regular, Medium");
      const badge =
        font.badge ?? (dark ? "HEADING SYSTEM" : "BODY SYSTEM");
      const body =
        font.body ??
        (dark ? "Used for titles and heading text" : "Used for secondary heading and body copy.");
      return `
<div style="display:flex;flex-direction:column;justify-content:space-between;padding:24px;box-sizing:border-box;min-height:100%;background:${bg};${
        dark ? "box-shadow:0 4px 12px rgba(0,0,0,0.12);border:1px solid rgba(255,255,255,0.35);" : ""
      }">
  <div>
    <p style="margin:0 0 8px;font-size:8px;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;color:${
      dark ? "rgba(255,255,255,0.9)" : "var(--text-secondary)"
    }">${escHtml(font.name)}</p>
    <p style="margin:0;font-weight:900;letter-spacing:-0.02em;line-height:1;color:${
      dark ? "#fff" : "var(--text-primary)"
    };font-size:${dark ? "3.75rem" : "4.5rem"};font-family:'${escHtml(font.name.replace(/'/g, ""))}',system-ui,sans-serif">${escHtml(
      sample,
    )}</p>
  </div>
  <div>
    <p style="margin:0 0 4px;font-size:1rem;font-weight:700;color:${dark ? "#fff" : "var(--text-primary)"}">${escHtml(
      font.role,
    )}</p>
    <p style="margin:0 0 12px;font-size:10px;color:${dark ? "rgba(255,255,255,0.88)" : "var(--text-secondary)"}">${escHtml(
      weights,
    )}</p>
    <span style="display:inline-block;border-radius:4px;padding:4px 8px;font-size:9px;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;background:${
      dark ? "rgba(255,255,255,0.2)" : escHtml(accent)
    };color:#fff">${escHtml(badge)}</span>
    <p style="margin:12px 0 0;font-size:10px;line-height:1.5;color:${dark ? "rgba(255,255,255,0.82)" : "var(--text-secondary)"}">${escHtml(
      body,
    )}</p>
  </div>
</div>`;
    })
    .join("");

  const paletteHtml = palette
    .map((row, index) => {
      const sw = padSwatches(row.swatches, 10);
      const swCells = sw
        .map(
          (hex) =>
            `<div style="height:36px;border-radius:4px;background:${escHtml(hex)}" title="${escHtml(hex)}"></div>`,
        )
        .join("");
      return `
<div style="margin-bottom:16px">
  <div style="display:grid;grid-template-columns:90px repeat(10,1fr);gap:4px;align-items:center">
    <div>
      <p style="margin:0;font-size:8px;color:var(--text-secondary)">D${index + 1}</p>
      <p style="margin:0;font-size:12px;font-weight:700;color:#fff">${escHtml(row.name)}</p>
      <p style="margin:0;font-family:ui-monospace,monospace;font-size:8px;color:var(--text-secondary)">${escHtml(
        row.hex ?? sw[Math.min(5, sw.length - 1)] ?? "",
      )}</p>
    </div>
    ${swCells}
  </div>
</div>`;
    })
    .join("");

  const tagsHtml = tags
    .map(
      (label) =>
        `<span style="display:inline-block;border-radius:16px;border:1px solid ${escHtml(accent)}55;background:${escHtml(accent)}18;padding:4px 12px;font-size:12px;font-weight:500;color:${escHtml(accent)}">${escHtml(
          label,
        )}</span>`,
    )
    .join(" ");

  const descBlock =
    p.description?.trim() ?
      `<p style="margin:0 0 24px;max-width:42rem;font-size:14px;line-height:1.65;color:var(--text-secondary)">${escHtml(p.description.trim())}</p>`
    : "";

  return `
<div class="stylemd-rich" style="font-family:'Manrope',system-ui,sans-serif;color:var(--text-primary)">
  ${
    tagsHtml
      ? `<div style="margin-bottom:${descBlock ? "12px" : "20px"};display:flex;flex-wrap:wrap;gap:8px">${tagsHtml}</div>`
      : ""
  }
  ${descBlock}
  <section style="border-radius:16px;border:1px solid var(--border-light);background:var(--surface);overflow:hidden;margin-bottom:24px">
    <div style="display:grid;grid-template-columns:1fr 2fr;min-height:360px">
      <div style="background:var(--surface);padding:32px;display:flex;flex-direction:column;justify-content:space-between;box-sizing:border-box">
        <div>
          <h2 style="margin:0 0 12px;font-family:'Magnetik',system-ui,sans-serif;font-size:1.25rem;font-weight:700;color:var(--text-primary);letter-spacing:-0.02em">${escHtml(
            typographyTitle,
          )}</h2>
          <p style="margin:0 0 16px;font-size:14px;line-height:1.6;color:var(--text-secondary)">${escHtml(typographyIntro)}</p>
          <p style="margin:0;font-size:12px;line-height:1.6;color:var(--text-secondary)">${escHtml(typographyAside)}</p>
        </div>
      </div>
      <div style="display:grid;grid-template-columns:repeat(${Math.min(fonts.length, 2)},1fr);gap:0">
        ${fontCardsHtml}
      </div>
    </div>
  </section>

  <section style="border-radius:16px;background:#0d0d1a;padding:32px;margin-bottom:24px;overflow:auto">
    <div style="margin-bottom:12px;display:grid;grid-template-columns:90px repeat(10,1fr);gap:4px;text-align:center">
      <div></div>
      ${shadeLabels.map((s) => `<div style="font-size:8px;color:var(--text-secondary)">${s}</div>`).join("")}
    </div>
    ${paletteHtml}
  </section>

  <section style="border-radius:16px;border:1px solid var(--border-light);background:var(--surface);padding:32px;margin-bottom:24px">
    <div style="margin-bottom:24px;display:grid;grid-template-columns:1fr 1fr;gap:32px">
      <div style="display:flex;align-items:center;gap:8px">
        <span style="font-size:14px;color:var(--text-secondary)">◇</span>
        <h3 style="margin:0;font-family:'Magnetik',system-ui,sans-serif;font-size:18px;font-weight:700">Buttons</h3>
      </div>
      <div style="display:flex;align-items:center;gap:8px">
        <span style="font-size:14px;color:var(--text-secondary)">◇</span>
        <h3 style="margin:0;font-family:'Magnetik',system-ui,sans-serif;font-size:18px;font-weight:700">Icons</h3>
      </div>
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:32px">
      <div>
        <div style="display:flex;flex-direction:column;gap:12px;margin-bottom:16px">
          <button type="button" style="display:inline-flex;width:fit-content;align-items:center;gap:8px;border-radius:8px;padding:12px 20px;font-size:14px;font-weight:600;color:#fff;border:none;cursor:default;background:${escHtml(
            accent,
          )}">
            <span>←</span> Primary <span>→</span>
          </button>
          <button type="button" style="display:inline-flex;width:fit-content;align-items:center;gap:8px;border-radius:8px;border:1px solid var(--border-medium);padding:12px 20px;font-size:14px;font-weight:500;color:var(--text-primary);background:var(--surface);cursor:default">
            <span>←</span> Secondary <span>→</span>
          </button>
        </div>
        <p style="margin:0;font-size:14px;line-height:1.6;color:var(--text-secondary)">${escHtml(
          p.buttonsBlurb ??
            "Anchor interactions to the detected button styles. Reuse existing card surfaces.",
        )}</p>
      </div>
      <div>
        <div style="display:flex;flex-direction:column;gap:12px;margin-bottom:16px">
          <span style="display:inline-block;width:fit-content;border-radius:9999px;border:1px solid ${escHtml(
            accent,
          )}40;padding:8px 16px;font-size:16px;font-weight:900;background:${escHtml(accent)}18;color:${escHtml(accent)}">${escHtml(
            p.brand,
          )}</span>
          <div style="display:flex;gap:8px;flex-wrap:wrap">
            <span style="display:inline-flex;align-items:center;gap:6px;border-radius:9999px;border:1px solid var(--border-medium);background:#111827;padding:6px 12px;font-size:12px;font-weight:600;color:#fff">⌘ Apple</span>
            <span style="display:inline-flex;align-items:center;justify-content:center;border-radius:9999px;border:1px solid var(--border-medium);background:var(--surface-soft);padding:6px 12px;color:var(--text-primary)">🔔</span>
          </div>
        </div>
        <span style="display:inline-block;border-radius:4px;background:${escHtml(accent)}24;padding:4px 8px;font-size:8px;font-weight:700;color:${escHtml(accent)}">TOKEN</span>
      </div>
    </div>
  </section>

  <section style="border-radius:16px;border:1px solid var(--border-light);background:var(--surface);padding:32px;margin-bottom:24px">
    <div style="margin-bottom:24px;display:flex;align-items:center;gap:8px">
      <span style="font-size:14px;color:var(--text-secondary)">📏</span>
      <h3 style="margin:0;font-family:'Magnetik',system-ui,sans-serif;font-size:18px;font-weight:700">Spacing</h3>
    </div>
    <div style="margin-bottom:32px;display:grid;grid-template-columns:repeat(3,1fr);gap:16px">
      ${spacingCards
        .map(
          (item) => `
      <div style="border-radius:8px;border:1px solid var(--border-light);background:var(--surface);padding:16px">
        <p style="margin:0 0 8px;font-size:7px;font-weight:600;letter-spacing:0.06em;text-transform:uppercase;color:var(--text-secondary)">${escHtml(
          item.label,
        )}</p>
        <p style="margin:0 0 4px;font-size:2.25rem;font-weight:700;color:${escHtml(accent)}">${escHtml(item.value)}</p>
        <p style="margin:0;font-size:8px;color:var(--text-secondary)">${escHtml(item.sublabel)}</p>
      </div>`,
        )
        .join("")}
    </div>
    <div style="margin-bottom:24px;display:flex;flex-direction:column;gap:8px">
      ${spacingSteps
        .map(
          (step) => `
      <div style="display:flex;align-items:center;gap:12px">
        <span style="width:48px;font-size:8px;color:var(--text-secondary)">${escHtml(step.label)}</span>
        <div style="flex:1;border-radius:9999px;background:var(--surface-soft);height:8px;overflow:hidden">
          <div style="height:8px;border-radius:9999px;background:${escHtml(accent)};width:${escHtml(step.pct)}"></div>
        </div>
        <span style="width:32px;text-align:right;font-size:8px;color:var(--text-secondary)">${escHtml(step.value)}</span>
      </div>`,
        )
        .join("")}
    </div>
    <p style="margin:0 0 12px;font-size:8px;font-weight:600;letter-spacing:0.06em;text-transform:uppercase;color:var(--text-secondary)">BASE RHYTHM: 4PX</p>
    <div style="display:flex;flex-wrap:wrap;gap:16px">
      ${spacingRules.map((r) => `<span style="font-size:8px;color:var(--text-secondary)">${escHtml(r)}</span>`).join("")}
    </div>
  </section>

  <section style="border-radius:16px;border:1px solid var(--border-light);background:var(--surface);padding:32px;margin-bottom:24px">
    <div style="margin-bottom:24px;display:flex;align-items:center;gap:8px">
      <span style="font-size:14px;color:var(--text-secondary)">▣</span>
      <h3 style="margin:0;font-family:'Magnetik',system-ui,sans-serif;font-size:18px;font-weight:700">Elevation &amp; Depth</h3>
    </div>
    <p style="margin:0 0 24px;max-width:36rem;font-size:14px;line-height:1.6;color:var(--text-secondary)">${escHtml(
      p.elevation?.intro ??
        "Depth is communicated through glass, border, contrast, and reusable shadow or blur treatments. Keep those recipes consistent across hero panels, cards, and controls so the page reads as one material system.",
    )}</p>
    <div style="margin-bottom:24px;border-radius:8px;border:1px solid var(--border-light);overflow:hidden">
      ${elevRows
        .map(
          (row, i, arr) => `
      <div style="display:flex;align-items:${i === 2 ? "flex-start" : "center"};gap:16px;padding:16px 20px;${
        i < arr.length - 1 ? "border-bottom:1px solid var(--border-light);" : ""
      }">
        <span style="width:80px;flex-shrink:0;font-size:8px;font-weight:600;letter-spacing:0.06em;text-transform:uppercase;color:var(--text-secondary)">${escHtml(
          row.label,
        )}</span>
        <span style="font-family:ui-monospace,monospace;font-size:12px;color:var(--text-primary)">${escHtml(row.value)}</span>
      </div>`,
        )
        .join("")}
    </div>
    <div style="display:flex;flex-wrap:wrap;gap:8px">
      ${elevChips.map((c) => `<span style="border-radius:4px;background:var(--surface-soft);padding:6px 10px;font-family:ui-monospace,monospace;font-size:8px;color:var(--text-secondary)">${escHtml(c)}</span>`).join("")}
    </div>
  </section>

  <section style="border-radius:16px;border:1px solid var(--border-light);background:var(--surface);padding:32px;margin-bottom:24px">
    <div style="margin-bottom:24px;display:flex;align-items:center;gap:8px">
      <span style="font-size:14px;color:var(--text-secondary)">◇</span>
      <h3 style="margin:0;font-family:'Magnetik',system-ui,sans-serif;font-size:18px;font-weight:700">Shapes</h3>
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:32px">
      <div>
        <p style="margin:0 0 16px;font-size:14px;line-height:1.6;color:var(--text-secondary)">${escHtml(
          p.shapes?.intro ??
            "Shapes rely on a tight radius system anchored by 2px and scaled across cards, buttons, and supporting surfaces.",
        )}</p>
        <span style="display:inline-block;border-radius:4px;background:${escHtml(accent)}22;padding:6px 12px;font-size:8px;font-weight:700;color:${escHtml(accent)};letter-spacing:0.06em;text-transform:uppercase">${escHtml(
          p.shapes?.badge ?? "Linear",
        )}</span>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
        ${shapeItems
          .map(
            (label) => `
        <div style="border-radius:8px;border:1px solid var(--border-medium);background:var(--surface-soft);padding:32px 16px;text-align:center;font-size:14px;font-weight:600;color:var(--text-primary)">${escHtml(
          label,
        )}</div>`,
          )
          .join("")}
      </div>
    </div>
  </section>

  <section style="border-radius:16px;border:1px solid var(--border-light);background:var(--surface);padding:32px;margin-bottom:24px">
    <div style="margin-bottom:24px;display:flex;align-items:center;gap:8px">
      <span style="font-size:14px;color:var(--text-secondary)">⏱</span>
      <h3 style="margin:0;font-family:'Magnetik',system-ui,sans-serif;font-size:18px;font-weight:700">Motion</h3>
    </div>
    <div style="margin-bottom:24px;display:flex;flex-wrap:wrap;gap:8px">
      ${motionTags.map((t) => `<span style="border-radius:4px;background:${escHtml(accent)}22;padding:4px 8px;font-size:8px;font-weight:700;color:${escHtml(accent)}">${escHtml(t)}</span>`).join("")}
    </div>
    <div style="margin-bottom:24px;display:flex;flex-direction:column;gap:8px">
      ${motionBars
        .map(
          (item) => `
      <div style="display:flex;align-items:center;gap:12px">
        <span style="width:56px;font-size:8px;color:var(--text-secondary)">${escHtml(item.label)}</span>
        <div style="flex:1;border-radius:9999px;background:var(--surface-soft);height:8px;overflow:hidden">
          <div style="height:8px;border-radius:9999px;background:${escHtml(accent)};width:${escHtml(item.pct)}"></div>
        </div>
      </div>`,
        )
        .join("")}
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:16px">
      ${motionSteps
        .map(
          ([step, val]) => `
      <div style="border-radius:8px;border:1px solid var(--border-light);background:var(--surface-soft);padding:16px">
        <p style="margin:0 0 8px;font-size:8px;color:var(--text-secondary)">${escHtml(step)}</p>
        <p style="margin:0;font-size:1.5rem;font-weight:700;color:var(--text-primary)">${escHtml(val)}</p>
      </div>`,
        )
        .join("")}
    </div>
    <span style="display:inline-block;border-radius:4px;background:${escHtml(accent)}22;padding:4px 8px;font-size:8px;font-weight:700;color:${escHtml(accent)}">${escHtml(
      p.motion?.badge ?? "MODERATE",
    )}</span>
  </section>

  <section style="border-radius:16px;border:1px solid var(--border-light);background:var(--surface);padding:32px;margin-bottom:8px">
    <div style="margin-bottom:24px;display:flex;align-items:center;gap:8px">
      <span style="font-size:14px;color:var(--text-secondary)">ⓘ</span>
      <h3 style="margin:0;font-family:'Magnetik',system-ui,sans-serif;font-size:18px;font-weight:700">Do&apos;s and Don&apos;ts</h3>
    </div>
    <p style="margin:0 0 24px;max-width:36rem;font-size:14px;line-height:1.6;color:var(--text-secondary)">${escHtml(
      p.guidelines?.intro ??
        "Use these constraints to keep future generations aligned with the current system instead of drifting into adjacent styles.",
    )}</p>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:32px">
      <div>
        <span style="display:inline-block;margin-bottom:16px;border-radius:4px;background:${escHtml(accent)}22;padding:6px 12px;font-size:8px;font-weight:700;color:${escHtml(accent)};letter-spacing:0.06em;text-transform:uppercase">✓ Do</span>
        <div style="display:flex;flex-direction:column;gap:12px">
          ${dos
            .map(
              (item) => `
          <div style="display:flex;align-items:flex-start;gap:10px">
            <span style="flex-shrink:0;color:${escHtml(accent)};font-size:13px">✓</span>
            <p style="margin:0;font-size:12px;line-height:1.5;color:var(--text-secondary)">${escHtml(item)}</p>
          </div>`,
            )
            .join("")}
        </div>
      </div>
      <div>
        <span style="display:inline-block;margin-bottom:16px;border-radius:4px;background:rgba(254,226,226,0.9);padding:6px 12px;font-size:8px;font-weight:700;color:#dc2626;letter-spacing:0.06em;text-transform:uppercase">✕ Don&apos;t</span>
        <div style="display:flex;flex-direction:column;gap:12px">
          ${donts
            .map(
              (item) => `
          <div style="display:flex;align-items:flex-start;gap:10px">
            <span style="flex-shrink:0;color:#ef4444;font-size:13px">✕</span>
            <p style="margin:0;font-size:12px;line-height:1.5;color:var(--text-secondary)">${escHtml(item)}</p>
          </div>`,
            )
            .join("")}
        </div>
      </div>
    </div>
  </section>
</div>`;
}
