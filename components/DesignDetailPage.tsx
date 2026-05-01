"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Copy,
  Download,
  Monitor,
  Code2,
  ArrowRight,
  Check,
  X,
  Bell,
  Apple,
  Clock,
  AlertCircle,
  MousePointerClick,
  Square,
  Ruler,
  Layers,
  Play,
} from "lucide-react";
import type { DesignCard } from "@/lib/design-cards";

type DesignDetailPageProps = {
  card: DesignCard;
};

/* ------------------------------------------------------------------ */
/*  Left panel — website preview                                        */
/* ------------------------------------------------------------------ */
function WebsitePreview({ card }: { card: DesignCard }) {
  return (
    <div className="flex h-full flex-col overflow-hidden bg-page">
      <div className="flex-1 overflow-hidden p-3">
        <div className="h-full overflow-hidden rounded-xl border border-medium bg-surface shadow-sm">
          {card.url ? (
            <iframe
              src={card.url}
              title={card.name}
              className="border-0"
              style={{
                width: "160%",
                height: "160%",
                transform: "scale(0.625)",
                transformOrigin: "top left",
              }}
              sandbox="allow-scripts allow-same-origin"
            />
          ) : (
            <div className="flex h-full flex-col overflow-hidden">
              {/* Nav */}
              <div
                className="flex flex-shrink-0 items-center justify-between px-4 py-2"
                style={{ background: card.accentColor }}
              >
                <span className="text-[8px] font-semibold tracking-widest text-white/80">
                  COOKIES &amp; GIFTS &nbsp; ORDER &nbsp; BAKERIES
                </span>
                <span className="text-[11px] font-black italic text-white">{card.name}</span>
                <span className="text-[9px] text-white/70">👤 🛒</span>
              </div>

              {/* Hero */}
              <div
                className="relative flex flex-shrink-0 items-center justify-between gap-2 overflow-hidden px-5 py-5"
                style={{ background: card.accentColor + "12" }}
              >
                <div
                  className="h-28 w-32 flex-shrink-0 rounded-lg"
                  style={{ background: card.accentColor + "30" }}
                />
                <div className="flex-1 text-center">
                  <h3
                    className="mb-1 text-base font-black leading-tight"
                    style={{ color: card.accentColor }}
                  >
                    {card.heroHeadline ?? "Mother's Day is coming!"}
                  </h3>
                  <p className="mb-3 text-[9px] text-secondary">
                    Hint: we're fairly confident she'd rather have cookies than carnations
                  </p>
                  <button
                    className="rounded-lg px-3 py-1.5 text-[9px] font-bold text-white"
                    style={{ background: card.accentColor }}
                    type="button"
                  >
                    SHOP ALL COOKIES
                  </button>
                </div>
              </div>

              {/* Strip */}
              <div className="flex flex-shrink-0 items-center gap-3 overflow-hidden border-y border-light px-3 py-1.5">
                {["🏙 Made in NYC", "🍪 Baked Fresh Daily", "📦 Shipped Same-Day", "❤️ 30 Years"].map((t) => (
                  <span key={t} className="flex-shrink-0 text-[7px] text-secondary">{t}</span>
                ))}
              </div>

              {/* Products */}
              <div className="flex-1 overflow-hidden p-3">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-[9px] font-bold text-primary">Shop Fan Favorites</span>
                  <span className="text-[7px] text-secondary">SHOP ALL →</span>
                </div>
                <div className="grid grid-cols-4 gap-1.5">
                  {(card.palette ?? []).slice(0, 4).map((p, i) => (
                    <div key={i} className="flex flex-col gap-1">
                      <div
                        className="h-14 w-full rounded-md"
                        style={{ background: p.swatches?.[3] ?? card.accentColor + "40" }}
                      />
                      <p className="text-[7px] font-semibold leading-tight text-primary">
                        {p.name} Collection
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom banner */}
              <div
                className="flex flex-shrink-0 items-center gap-3 px-4 py-4"
                style={{ background: card.palette?.[0]?.swatches?.[1] ?? "#e8eeff" }}
              >
                <div
                  className="h-16 w-16 flex-shrink-0 rounded-lg"
                  style={{ background: card.accentColor + "40" }}
                />
                <div>
                  <h4 className="mb-1 text-sm font-black text-primary">
                    Big Cookies Baked in the Big Apple
                  </h4>
                  <p className="text-[8px] leading-relaxed text-secondary">
                    We've proudly baked our cookies daily since 1995 with simple ingredients and a lotta love.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main page                                                           */
/* ------------------------------------------------------------------ */
export default function DesignDetailPage({ card }: DesignDetailPageProps) {
  const [activeTab, setActiveTab] = useState<"preview" | "code">("preview");
  const [copied, setCopied] = useState(false);
  const router = useRouter();

  const generateMarkdown = () =>
    `# ${card.name} Design System\n\n## Overview\n${card.desc}\n\n## Colors\n${card.palette
      .map((p, i) => `- **D${i + 1} ${p.name}**: ${p.hex}`)
      .join("\n")}\n\n## Typography\n${card.fonts
      .map((f) => `- **${f.name}**: ${f.role}`)
      .join("\n")}\n\n## Buttons\n- Primary: ${card.accentColor}\n- Secondary: border-gray-300\n\n## Spacing\n- Base rhythm: 4px\n- Gap: 8px\n- Section: 32px\n`;

  const handleCopy = async () => {
    const content = generateMarkdown();
    try {
      await navigator.clipboard.writeText(content);
    } catch {
      // Fallback for browsers without clipboard API
      const el = document.createElement("textarea");
      el.value = content;
      el.style.position = "fixed";
      el.style.opacity = "0";
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const content = generateMarkdown();
    const blob = new Blob([content], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${card.id}-design.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push("/styles");
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-page">
      {/* Top bar */}
      <div className="sticky top-0 z-10 flex items-center justify-between border-b border-medium bg-surface px-6 py-3">
        <button
          onClick={handleBack}
          className="flex items-center gap-2 rounded-lg border border-medium bg-surface px-3 py-1.5 text-sm font-medium text-primary hover:bg-surface-soft cursor-pointer"
          type="button"
        >
          <ArrowLeft size={14} /> Back
        </button>
        <div className="flex gap-2">
          <button
            onClick={handleCopy}
            className="flex items-center gap-2 rounded-lg border border-medium bg-surface px-4 py-1.5 text-sm font-medium text-primary hover:bg-surface-soft cursor-pointer transition-colors duration-150"
            type="button"
          >
            {copied ? <Check size={13} className="text-green-600" /> : <Copy size={13} />}
            {copied ? "Copied!" : "Copy DESIGN.md"}
          </button>
          <button
            onClick={handleDownload}
            className="flex items-center gap-2 rounded-lg bg-cta px-4 py-1.5 text-sm font-semibold text-white hover:opacity-90 cursor-pointer transition-all duration-150"
            type="button"
          >
            <Download size={13} /> Download
          </button>
        </div>
      </div>

      {/* Body — exact 50/50 split */}
      <div className="grid flex-1 md:grid-cols-[40%_60%]">
        {/* Left sidebar — 50% */}
        <div className="sticky top-16 hidden h-[calc(100vh-4rem)] border-r border-medium md:block">
          <WebsitePreview card={card} />
        </div>

        {/* Right content — 50% */}
        <div className="overflow-y-auto px-8 py-7 pb-24">
          {/* Brand header */}
          <div className="mb-6">
            <div className="mb-3 flex items-center gap-3">
              <div
                className="flex h-[60px] w-[60px] items-center justify-center rounded-[7.2px] text-lg font-black text-white"
                style={{ background: card.accentColor }}
              >
                {card.logo}
              </div>
              <h1 className="text-3xl font-black tracking-tight text-primary">
                {card.name}
              </h1>
            </div>

            <div className="mb-3 flex flex-wrap gap-2">
              {card.tags.map((tag) => (
                <span
                  key={tag.label}
                  className="rounded-[16px] border px-3 py-1 text-xs font-medium bg-blue-50 text-accent-blue-light border-accent-blue-light"
                >
                  {tag.label}
                </span>
              ))}
            </div>

            <p className="mb-6 max-w-2xl text-sm leading-relaxed text-secondary">
              {card.desc}
            </p>

            <div className="flex gap-0 rounded-[12px] border border-medium bg-surface-soft p-1 w-full max-w-[370px] h-[64px] items-center mx-auto backdrop-blur-sm">
              <button
                onClick={() => setActiveTab("preview")}
                className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-all ${
                  activeTab === "preview"
                    ? "bg-accent-blue text-white shadow-md"
                    : "bg-surface text-secondary hover:text-primary"
                }`}
                type="button"
              >
                <Play size={14} /> Live Preview
              </button>
              <button
                onClick={() => setActiveTab("code")}
                className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-all ${
                  activeTab === "code"
                    ? "bg-accent-blue text-white shadow-md"
                    : "bg-surface text-secondary hover:text-primary"
                }`}
                type="button"
              >
                <Code2 size={14} /> DESIGN.md
              </button>
            </div>
          </div>

          {activeTab === "preview" ? (
            <div className="space-y-6">

              {/* Typography */}
              <section className="rounded-2xl border border-light bg-surface overflow-hidden">
                <div className="grid grid-cols-[1fr_2fr] gap-0 h-[360px]">
                  {/* Left: Title & Description */}
                  <div className="bg-surface p-8 flex flex-col justify-between">
                    <div>
                      <h2 className="mb-3 text-2xl font-black tracking-tight text-primary">Typography</h2>
                      <p className="mb-4 text-sm leading-relaxed text-secondary">A composed hierarchy for page storytelling</p>
                      <p className="text-xs leading-relaxed text-secondary">Orchestrate Systems Intelligently. Used for secondary heading moments and supporting display contrasts. Used for summarizing...</p>
                    </div>
                  </div>

                  {/* Right: Font Cards */}
                  <div className="grid grid-cols-2 gap-0">
                    {card.fonts.map((font) => (
                      <div
                        key={font.name}
                        className={`flex flex-col justify-between p-6 transition-all ${
                          font.dark ? "shadow-md border border-blue-400" : ""
                        }`}
                        style={{ background: font.dark ? "#1067FE" : "#DFE9FA" }}
                      >
                        <div>
                          <p className={`mb-2 text-[9px] font-semibold uppercase tracking-wider ${font.dark ? "text-blue-100" : "text-secondary"}`}>
                            {font.name}
                          </p>
                          <p className={`text-6xl font-black tracking-tight leading-tight ${font.dark ? "text-white" : "text-primary"}`}>
                            Aa Bb
                          </p>
                        </div>
                        <div>
                          <p className={`mb-1 text-base font-bold ${font.dark ? "text-white" : "text-primary"}`}>
                            {font.role}
                          </p>
                          <p className={`mb-3 text-[10px] ${font.dark ? "text-blue-100" : "text-secondary"}`}>
                            {font.dark ? "Medium" : "Regular, Medium"}
                          </p>
                          <span className={`inline-block rounded px-2 py-1 text-[9px] font-bold uppercase tracking-wider ${
                            font.dark ? "bg-white/20 text-white" : "bg-blue-600 text-white"
                          }`}>
                            {font.dark ? "HEADING SYSTEM" : "BODY SYSTEM"}
                          </span>
                          <p className={`mt-3 text-[10px] leading-relaxed ${font.dark ? "text-blue-100" : "text-secondary"}`}>
                            {font.dark ? "Used for titles and heading text" : "Used for secondary heading and body copy..."}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              {/* Color Palette */}
              <section className="overflow-hidden rounded-2xl bg-[#0d0d1a] p-8">
                <div className="mb-3 grid grid-cols-[90px_repeat(10,1fr)] gap-1 text-center">
                  <div />
                  {["50", "100", "200", "300", "400", "500", "600", "700", "800", "900"].map((s) => (
                    <div key={s} className="text-[8px] font-semibold text-secondary">{s}</div>
                  ))}
                </div>
                {card.palette.map((palette, index) => (
                  <div key={palette.name} className="mb-4">
                    <div className="grid grid-cols-[90px_repeat(10,1fr)] items-center gap-1">
                      <div>
                        <p className="text-[9px] font-semibold text-secondary">D{index + 1}</p>
                        <p className="text-[10px] font-bold text-white">{palette.name}</p>
                        <p className="font-mono text-[8px] text-secondary">{palette.hex}</p>
                      </div>
                      {palette.swatches.map((swatch, i) => (
                        <div key={i} className="h-9 rounded-sm" style={{ background: swatch }} />
                      ))}
                    </div>
                  </div>
                ))}
              </section>

              {/* Buttons & Icons */}
              <section className="rounded-2xl border border-light bg-surface p-8">
                <div className="mb-8">
                  <div className="mb-6 flex items-center gap-2">
                    <MousePointerClick size={14} className="text-secondary" />
                    <h2 className="text-lg font-bold tracking-tight text-primary">Buttons</h2>
                  </div>
                  <div className="grid grid-cols-2 gap-8">
                    <div>
                      <div className="flex flex-col gap-3 mb-4">
                        <button
                          className="flex w-fit items-center gap-2 rounded-lg px-5 py-3 text-sm font-semibold text-white"
                          style={{ background: card.accentColor }}
                          type="button"
                        >
                          <ArrowLeft size={13} /> Primary <ArrowRight size={13} />
                        </button>
                        <button
                          className="flex w-fit items-center gap-2 rounded-lg border border-medium px-5 py-3 text-sm font-medium text-primary"
                          type="button"
                        >
                          <ArrowLeft size={13} /> Secondary <ArrowRight size={13} />
                        </button>
                      </div>
                      <p className="text-sm leading-relaxed text-secondary">
                        Anchor interactions to the detected button styles. Reuse existing card surfaces.
                      </p>
                    </div>
                    <div>
                      <div className="mb-6 flex items-center gap-2">
                        <Square size={14} className="text-secondary" />
                        <h3 className="text-base font-bold tracking-tight text-primary">Icons</h3>
                      </div>
                      <div className="flex flex-col gap-3">
                        <span
                          className="inline-block w-fit rounded-lg border px-4 py-2 text-base font-black"
                          style={{
                            background: card.accentColor + "18",
                            borderColor: card.accentColor + "40",
                            color: card.accentColor,
                          }}
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
                      <span className="mt-4 inline-block rounded bg-blue-100 px-2 py-1 text-[8px] font-bold text-blue-600">SOLAR</span>
                    </div>
                  </div>
                </div>
              </section>

              {/* Spacing */}
              <section className="rounded-2xl border border-light bg-surface p-8">
                <div className="mb-6 flex items-center gap-2">
                  <Ruler size={14} className="text-secondary" />
                  <h2 className="text-lg font-bold tracking-tight text-primary">Spacing</h2>
                </div>
                <div className="mb-8 grid grid-cols-3 gap-4">
                  {[
                    { label: "BASE", sublabel: "RHYTHM", value: "4px" },
                    { label: "GAP", sublabel: "COMPONENTS", value: "8px" },
                    { label: "SECTION", sublabel: "PAGE", value: "32px" },
                  ].map((item) => (
                    <div key={item.label} className="rounded-lg bg-gradient-to-br from-blue-50 to-white border border-blue-100 p-4">
                      <p className="text-[7px] font-semibold uppercase tracking-wider text-secondary mb-2">{item.label}</p>
                      <p className="mb-1 text-4xl font-black text-accent-blue">{item.value}</p>
                      <p className="text-[8px] text-secondary">{item.sublabel}</p>
                    </div>
                  ))}
                </div>
                <div className="mb-6 space-y-2">
                  {[
                    { label: "STEP 1", pct: "20%", value: "4px" },
                    { label: "STEP 2", pct: "40%", value: "8px" },
                    { label: "STEP 3", pct: "60%", value: "12px" },
                    { label: "STEP 4", pct: "80%", value: "14px" },
                  ].map((step) => (
                    <div key={step.label} className="flex items-center gap-3">
                      <span className="w-12 text-[8px] font-semibold text-secondary">{step.label}</span>
                      <div className="flex-1 rounded-full bg-surface-soft">
                        <div className="h-2 rounded-full bg-accent-blue" style={{ width: step.pct }} />
                      </div>
                      <span className="w-8 text-right text-[8px] text-secondary">{step.value}</span>
                    </div>
                  ))}
                </div>
                <p className="mb-3 text-[8px] font-semibold uppercase tracking-wider text-secondary">BASE RHYTHM: 4PX</p>
                <div className="flex flex-wrap gap-4">
                  <p className="text-[8px] text-secondary">SECTION PADDING: 32PX, 56PX</p>
                  <p className="text-[8px] text-secondary">CARD PADDING: 32PX, 56PX</p>
                  <p className="text-[8px] text-secondary">GAPS: 8PX, 32PX</p>
                </div>
              </section>

              {/* Elevation & Depth */}
              <section className="rounded-2xl border border-light bg-surface p-8">
                <div className="mb-6 flex items-center gap-2">
                  <Layers size={14} className="text-secondary" />
                  <h2 className="text-lg font-bold tracking-tight text-primary">Elevation &amp; Depth</h2>
                </div>
                <p className="mb-6 max-w-lg text-sm leading-relaxed text-secondary">
                  Depth is communicated through glass, border, contrast, and reusable shadow or blur treatments. Keep those recipes consistent across hero panels, cards, and controls so the page reads as one material system.
                </p>
                <div className="mb-6 divide-y divide-light rounded-lg border border-light overflow-hidden">
                  <div className="flex items-center gap-4 px-5 py-4">
                    <span className="w-20 text-[8px] font-semibold uppercase tracking-wider text-secondary">SURFACE</span>
                    <span className="text-sm font-semibold text-primary">Glass</span>
                  </div>
                  <div className="flex items-center gap-4 px-5 py-4">
                    <span className="w-20 text-[8px] font-semibold uppercase tracking-wider text-secondary">BORDER</span>
                    <span className="font-mono text-xs text-primary">1px #FFFFFF</span>
                  </div>
                  <div className="flex items-start gap-4 px-5 py-4">
                    <span className="w-20 flex-shrink-0 text-[8px] font-semibold uppercase tracking-wider text-secondary">SHADOW</span>
                    <span className="font-mono text-xs text-primary">rgba(25, 28, 33, 0.02) 0px 1px 0px...</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {["GLASS", "1PX #FFFFFF", "rgba(0, 0, 0) 0px...", "rgba(25, 28, 33, 0.08) 0px..."].map((tag) => (
                    <span key={tag} className="rounded bg-surface-soft px-2.5 py-1.5 font-mono text-[8px] text-secondary">{tag}</span>
                  ))}
                </div>
              </section>

              {/* Shapes */}
              <section className="rounded-2xl border border-light bg-surface p-8">
                <div className="mb-6 flex items-center gap-2">
                  <Square size={14} className="text-secondary" />
                  <h2 className="text-lg font-bold tracking-tight text-primary">Shapes</h2>
                </div>
                <div className="grid grid-cols-2 gap-8">
                  <div>
                    <p className="mb-4 text-sm leading-relaxed text-secondary">
                      Shapes rely on a tight radius system anchored by 2px and scaled across cards, buttons, and supporting surfaces. Icon geometry should stay compatible with that soft-to-controlled silhouette.
                    </p>
                    <span className="inline-block rounded bg-blue-100 px-3 py-1.5 text-[8px] font-bold text-accent-blue uppercase tracking-wider">Linear</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {["Cards", "Panels", "Controls", "Media"].map((label) => (
                      <button
                        key={label}
                        className="rounded-lg border border-medium bg-surface-soft px-4 py-8 text-sm font-semibold text-primary transition-all hover:bg-blue-50 hover:border-accent-blue hover:shadow-sm"
                        type="button"
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
              </section>

              {/* Motion */}
              <section className="rounded-2xl border border-light bg-surface p-8">
                <div className="mb-6 flex items-center gap-2">
                  <Clock size={14} className="text-secondary" />
                  <h2 className="text-lg font-bold tracking-tight text-primary">Motion</h2>
                </div>
                <div className="mb-6 flex flex-wrap gap-2">
                  {["150MS", "200MS", "EASE", "CUBIC-BEZIER(0.4..."].map((tag) => (
                    <span key={tag} className="rounded bg-blue-100 px-2 py-1 text-[8px] font-bold text-blue-600">{tag}</span>
                  ))}
                </div>
                <div className="mb-6 space-y-2">
                  {[
                    { label: "TEXT", pct: "40%" },
                    { label: "COLOR", pct: "60%" },
                    { label: "STROKE", pct: "50%" },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center gap-3">
                      <span className="w-14 text-[8px] font-semibold text-secondary">{item.label}</span>
                      <div className="flex-1 rounded-full bg-surface-soft">
                        <div className="h-2 rounded-full bg-accent-blue" style={{ width: item.pct }} />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {[["STEP 1", "150ms"], ["STEP 2", "200ms"]].map(([step, val]) => (
                    <div key={step} className="rounded-lg border border-light bg-surface-soft p-4">
                      <p className="mb-2 text-[8px] font-semibold text-secondary">{step}</p>
                      <p className="text-2xl font-black text-primary">{val}</p>
                    </div>
                  ))}
                </div>
                <span className="mt-4 inline-block rounded bg-blue-100 px-2 py-1 text-[8px] font-bold text-blue-600">MODERATE</span>
              </section>

              {/* Do's and Don'ts */}
              <section className="rounded-2xl border border-light bg-surface p-8">
                <div className="mb-6 flex items-center gap-2">
                  <AlertCircle size={14} className="text-secondary" />
                  <h2 className="text-lg font-bold tracking-tight text-primary">Do&apos;s and Don&apos;ts</h2>
                </div>
                <p className="mb-6 max-w-lg text-sm leading-relaxed text-secondary">
                  Use these constraints to keep future generations aligned with the current system instead of drifting into adjacent styles.
                </p>
                <div className="grid grid-cols-2 gap-8">
                  <div>
                    <span className="mb-4 inline-block rounded px-3 py-1.5 bg-blue-100 text-[8px] font-bold text-accent-blue uppercase tracking-wider">✓ Do</span>
                    <div className="space-y-3">
                      {[
                        "Use the primary palette as the main accent for emphasis and action states.",
                        "Keep spacing aligned to the detected 4px rhythm.",
                        "Reuse the Glass surface treatment consistently across cards and controls.",
                        "Keep corner radii within the detected 2px, 4px, 20px, 9999px family.",
                      ].map((item, i) => (
                        <div key={i} className="flex items-start gap-2.5">
                          <Check size={13} className="mt-0.5 flex-shrink-0 text-accent-blue" />
                          <p className="text-[10px] leading-relaxed text-secondary">{item}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <span className="mb-4 inline-block rounded px-3 py-1.5 bg-red-100 text-[8px] font-bold text-red-600 uppercase tracking-wider">✕ Don&apos;t</span>
                    <div className="space-y-3">
                      {[
                        "Do not introduce extra accent colors outside the core palette roles unless...",
                        "Do not mix unrelated shadow or blur recipes that break the current depth...",
                        "Do not exceed the detected moderate motion intensity without a deliberate...",
                      ].map((item, i) => (
                        <div key={i} className="flex items-start gap-2.5">
                          <X size={13} className="mt-0.5 flex-shrink-0 text-red-500" />
                          <p className="text-[10px] leading-relaxed text-secondary">{item}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </section>
            </div>
          ) : (
            <section className="rounded-2xl border border-light bg-surface p-6">
              <h2 className="mb-4 text-base font-bold text-primary">DESIGN.md</h2>
              <pre className="overflow-x-auto rounded-xl bg-gray-900 p-5 text-xs text-gray-100">
                <code>{`# ${card.name} Design System\n\n## Overview\n${card.desc}\n\n## Colors\n${card.palette.map((p, i) => `- **D${i + 1} ${p.name}**: ${p.hex}`).join("\n")}\n\n## Typography\n${card.fonts.map((f) => `- **${f.name}**: ${f.role}`).join("\n")}\n\n## Buttons\n- Primary: ${card.accentColor}\n- Secondary: border-gray-300\n\n## Spacing\n- Base rhythm: 4px\n- Gap: 8px\n- Section: 32px\n`}</code>
              </pre>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}