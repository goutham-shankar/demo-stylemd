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
} from "lucide-react";
import type { DesignCard } from "@/lib/design-cards";

type DesignDetailPageProps = {
  card: DesignCard;
};

/* ------------------------------------------------------------------ */
/*  Mini website preview (left sidebar)                                */
/* ------------------------------------------------------------------ */
function WebsitePreview({ card }: { card: DesignCard }) {
  const router = useRouter();

  return (
    <div className="h-full overflow-y-auto bg-white p-3">
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        {/* Top accent bar */}
        <div
          className="flex items-center justify-between px-3 py-2"
          style={{ background: card.accentColor }}
        >
          <span className="text-[7px] font-semibold tracking-wider text-white/90">
            HOME &nbsp; ABOUT &nbsp; FEATURES &nbsp; SHOP
          </span>
          <span className="text-[9px] font-bold text-white">{card.name}</span>
          <span className="text-[9px] text-white/80">🔍 🛒</span>
        </div>

        {/* Hero Section */}
        <div
          className="relative flex min-h-[140px] items-center justify-center overflow-hidden"
          style={{ background: card.accentColor + "18" }} /* 10% opacity tint */
        >
          <div className="flex flex-col items-center justify-center py-8">
            {typeof card.logo === "string" && card.logo.endsWith(".svg") ? (
              <img src={card.logo} alt={card.name} className="mb-3 h-16 w-16" />
            ) : (
              <div
                className="mb-3 flex h-16 w-16 items-center justify-center rounded-full text-[32px] font-bold text-white"
                style={{ background: card.accentColor }}
              >
                {card.logo}
              </div>
            )}
            <h2 className="mb-2 text-xl font-black text-[#111]">{card.name}</h2>
            <p className="max-w-xs text-center text-[13px] text-gray-500">
              {card.desc}
            </p>

            <button
              type="button"
              onClick={() => router.back()}
              className="mt-4 flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-[#111] hover:bg-gray-50"
            >
              <ArrowLeft size={14} /> Back
            </button>

            <div className="mt-3 flex gap-2">
              <button
                className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-[#111] hover:bg-gray-50"
                type="button"
              >
                <Copy size={13} /> Copy DESIGN.md
              </button>
              <button
                className="flex items-center gap-2 rounded-lg bg-[#111] px-3 py-2 text-sm font-semibold text-white"
                type="button"
              >
                <Download size={13} /> Download
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main page component                                                */
/* ------------------------------------------------------------------ */
export default function DesignDetailPage({ card }: DesignDetailPageProps) {
  const [activeTab, setActiveTab] = useState<"preview" | "code">("preview");
  const router = useRouter();

  return (
    <div className="grid min-h-[calc(100vh-52px)] md:grid-cols-[340px_1fr]">
      {/* Left Sidebar — Website Preview */}
      <div className="sticky top-[52px] hidden h-[calc(100vh-52px)] border-r border-gray-200 bg-white md:block">
        <WebsitePreview card={card} />
      </div>

      {/* Right Content */}
      <div className="space-y-4 overflow-y-auto p-7 pb-20">
        {/* Header Section */}
        <div>
          <div className="mb-3 flex items-center gap-3">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-lg text-[10px] font-black text-white"
              style={{ background: card.accentColor }}
            >
              {card.logo}
            </div>
            <h1 className="text-2xl font-black tracking-tight text-[#111]">
              {card.name}
            </h1>
          </div>

          <div className="mb-3 flex flex-wrap gap-2">
            {card.tags.map((tag) => (
              <span
                key={tag.label}
                className={`rounded-full border px-3 py-1 text-xs font-medium ${tag.color}`}
              >
                {tag.label}
              </span>
            ))}
          </div>

          <p className="mb-4 max-w-2xl text-[13px] leading-relaxed text-gray-500">
            {card.desc}
          </p>

          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab("preview")}
              className={`flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-all ${
                activeTab === "preview"
                  ? "border-blue-500 bg-blue-500 text-white"
                  : "border-gray-200 bg-white text-gray-600"
              }`}
              type="button"
            >
              <Monitor size={14} /> Live Preview
            </button>
            <button
              onClick={() => setActiveTab("code")}
              className={`flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-all ${
                activeTab === "code"
                  ? "border-blue-500 bg-blue-500 text-white"
                  : "border-gray-200 bg-white text-gray-600"
              }`}
              type="button"
            >
              <Code2 size={14} /> DESIGN.md
            </button>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === "preview" ? (
          <>
            {/* Typography Section */}
            <section className="rounded-2xl border border-gray-100 bg-white p-5">
              <div className="mb-4 flex items-start justify-between">
                <div>
                  <h2 className="mb-1 text-base font-bold text-[#111]">
                    Typography
                  </h2>
                  <p className="text-xs text-gray-400">
                    A composed hierarchy for page storytelling.
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {card.fonts.map((font) => (
                  <div
                    key={font.name}
                    className={`flex min-h-[140px] flex-col justify-between rounded-xl p-4 ${
                      font.dark ? "bg-[#2d2bb5]" : "bg-gray-100"
                    }`}
                  >
                    <div>
                      <p
                        className={`mb-1 text-[10px] font-semibold uppercase tracking-widest ${
                          font.dark ? "text-blue-300" : "text-gray-400"
                        }`}
                      >
                        {font.name}
                      </p>
                      <p
                        className={`text-3xl font-black tracking-tight ${
                          font.dark ? "text-white" : "text-[#111]"
                        }`}
                      >
                        {font.sample}
                      </p>
                    </div>
                    <div>
                      <p
                        className={`text-xs font-bold ${
                          font.dark ? "text-white" : "text-[#111]"
                        }`}
                      >
                        {font.role}
                      </p>
                      <p
                        className={`text-[10px] ${
                          font.dark ? "text-white/60" : "text-gray-500"
                        }`}
                      >
                        {font.dark
                          ? "Used for titles and heading text"
                          : "Used for secondary heading moments and supporting..."}
                      </p>
                      <span
                        className={`mt-2 inline-block w-fit rounded px-2 py-1 text-[9px] font-bold ${
                          font.dark
                            ? "bg-white/20 text-white"
                            : "bg-blue-500 text-white"
                        }`}
                      >
                        {font.dark ? "HEADING SYSTEM" : "BODY SYSTEM"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Color Palette Section */}
            <section className="rounded-2xl border border-gray-100 bg-white p-5">
              <h2 className="mb-4 text-base font-bold text-[#111]">
                Color Palette
              </h2>
              <div className="space-y-3">
                {card.palette.map((palette, index) => (
                  <div key={palette.name} className="flex items-center gap-3">
                    <div className="w-20 flex-shrink-0">
                      <p className="text-[10px] font-semibold text-gray-700">
                        D{index + 1} — {palette.name}
                      </p>
                      <p className="font-mono text-[9px] text-gray-400">
                        {palette.hex}
                      </p>
                    </div>
                    <div className="flex flex-1 gap-0.5">
                      {palette.swatches.map((swatch, i) => (
                        <div
                          key={i}
                          className="h-5 flex-1 rounded-sm"
                          style={{ background: swatch }}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Buttons & Icons Section */}
            <section className="rounded-2xl border border-gray-100 bg-white p-5">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <div className="mb-4 flex items-center gap-2">
                    <MousePointerClick size={14} className="text-gray-400" />
                    <h2 className="text-base font-bold text-[#111]">Buttons</h2>
                  </div>
                  <div className="flex flex-col gap-2">
                    <button
                      className="flex w-fit items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold text-white"
                      style={{ background: card.accentColor }}
                      type="button"
                    >
                      <ArrowLeft size={13} /> Primary <ArrowRight size={13} />
                    </button>
                    <button
                      className="flex w-fit items-center gap-2 rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-[#111]"
                      type="button"
                    >
                      <ArrowLeft size={13} /> Secondary <ArrowRight size={13} />
                    </button>
                  </div>
                  <p className="mt-3 text-[11px] leading-relaxed text-gray-400">
                    Anchor interactions to the detected button styles. Reuse the
                    existing card surface recipe for content blocks.
                  </p>
                </div>
                <div>
                  <div className="mb-4 flex items-center gap-2">
                    <Square size={14} className="text-gray-400" />
                    <h2 className="text-base font-bold text-[#111]">Icons</h2>
                  </div>
                  <div className="flex flex-col gap-3">
                    <span className="inline-block w-fit rounded-lg border border-pink-200 bg-[#fce7f3] px-3 py-1.5 text-sm font-black text-pink-600">
                      Klarna.
                    </span>
                    <div className="flex gap-2">
                      <span className="flex items-center gap-1 rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs font-semibold text-[#111]">
                        <Apple size={14} /> Apple
                      </span>
                      <span className="flex items-center justify-center rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs text-[#111]">
                        <Bell size={14} />
                      </span>
                    </div>
                  </div>
                  <span className="mt-3 inline-block w-fit rounded bg-blue-100 px-2 py-1 text-[9px] font-bold text-blue-600">
                    SOLAR
                  </span>
                </div>
              </div>
            </section>

            {/* Shapes Section */}
            <section className="rounded-2xl border border-gray-100 bg-white p-5">
              <div className="mb-4 flex items-center gap-2">
                <Square size={14} className="text-gray-400" />
                <h2 className="text-base font-bold text-[#111]">Shapes</h2>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-[11px] leading-relaxed text-gray-400">
                    Shapes rely on a tight radius system anchored by 2px and
                    scaled across cards, buttons, and supporting surfaces. Icon
                    geometry should stay compatible with that soft-to-controlled
                    silhouette.
                  </p>
                  <span className="mt-3 inline-block w-fit rounded bg-blue-100 px-2 py-1 text-[9px] font-bold text-blue-600">
                    LINEAR
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <button className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-xs font-medium text-[#111]">
                    Cards
                  </button>
                  <button className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-xs font-medium text-[#111]">
                    Panels
                  </button>
                  <button className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-xs font-medium text-[#111]">
                    Controls
                  </button>
                  <button className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-xs font-medium text-[#111]">
                    Media
                  </button>
                </div>
              </div>
            </section>

            {/* Motion Section */}
            <section className="rounded-2xl border border-gray-100 bg-white p-5">
              <div className="mb-4 flex items-center gap-2">
                <Clock size={14} className="text-gray-400" />
                <h2 className="text-base font-bold text-[#111]">Motion</h2>
              </div>
              <div className="mb-4 flex gap-2">
                {["150MS", "200MS", "EASE", "CUBIC-BEZIER(0.4..."].map(
                  (tag) => (
                    <span
                      key={tag}
                      className="rounded bg-blue-100 px-2 py-1 text-[9px] font-bold text-blue-600"
                    >
                      {tag}
                    </span>
                  )
                )}
              </div>
              <div className="mb-4 space-y-2">
                {["TEXT", "COLOR", "STROKE"].map((label) => (
                  <div key={label} className="flex items-center gap-3">
                    <span className="w-12 text-[9px] font-semibold text-gray-400">
                      {label}
                    </span>
                    <div className="h-2 flex-1 rounded-sm bg-blue-500" />
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-lg border border-gray-100 bg-gray-50 p-3">
                  <p className="mb-1 text-[9px] font-semibold text-gray-400">
                    STEP 1
                  </p>
                  <p className="text-sm font-bold text-[#111]">150ms</p>
                </div>
                <div className="rounded-lg border border-gray-100 bg-gray-50 p-3">
                  <p className="mb-1 text-[9px] font-semibold text-gray-400">
                    STEP 2
                  </p>
                  <p className="text-sm font-bold text-[#111]">200ms</p>
                </div>
              </div>
              <span className="mt-3 inline-block w-fit rounded bg-blue-100 px-2 py-1 text-[9px] font-bold text-blue-600">
                MODERATE
              </span>
            </section>

            {/* Do's and Don'ts Section */}
            <section className="rounded-2xl border border-gray-100 bg-white p-5">
              <div className="mb-4 flex items-center gap-2">
                <AlertCircle size={14} className="text-gray-400" />
                <h2 className="text-base font-bold text-[#111]">
                  Do&apos;s and Don&apos;ts
                </h2>
              </div>
              <p className="mb-4 text-[11px] leading-relaxed text-gray-400">
                Use these constraints to keep future generations aligned with the
                current system instead of drifting into adjacent styles.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="mb-3 flex items-center gap-2">
                    <span className="rounded bg-blue-100 px-2 py-1 text-[9px] font-bold text-blue-600">
                      DO
                    </span>
                  </div>
                  <div className="space-y-2">
                    {[
                      "Use the primary palette as the main accent for emphasis and action states.",
                      "Keep spacing aligned to the detected 4px rhythm.",
                      "Reuse the glass surface treatment consistently across cards and controls.",
                      "Keep corner radii within the detected 2px, 4px, 20px, 9999px family.",
                    ].map((item, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <Check
                          size={12}
                          className="mt-0.5 flex-shrink-0 text-blue-500"
                        />
                        <p className="text-[11px] leading-relaxed text-gray-600">
                          {item}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="mb-3 flex items-center gap-2">
                    <span className="rounded bg-red-100 px-2 py-1 text-[9px] font-bold text-red-600">
                      DON&apos;T
                    </span>
                  </div>
                  <div className="space-y-2">
                    {[
                      "Do not introduce extra accent colors outside the core palette roles unless...",
                      "Do not mix unrelated shadow or blur recipes that break the current depth...",
                      "Do not exceed the detected moderate motion intensity without a deliberate...",
                    ].map((item, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <X
                          size={12}
                          className="mt-0.5 flex-shrink-0 text-red-500"
                        />
                        <p className="text-[11px] leading-relaxed text-gray-600">
                          {item}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          </>
        ) : (
          /* DESIGN.md Tab */
          <section className="rounded-2xl border border-gray-100 bg-white p-5">
            <h2 className="mb-4 text-base font-bold text-[#111]">DESIGN.md</h2>
            <pre className="overflow-x-auto rounded-lg bg-gray-900 p-4 text-xs text-gray-100">
              <code>{`# ${card.name} Design System

## Overview
${card.desc}

## Colors
${card.palette.map((p, i) => `- **D${i + 1} ${p.name}**: ${p.hex}`).join("\n")}

## Typography
${card.fonts.map((f) => `- **${f.name}**: ${f.role}`).join("\n")}

## Buttons
- Primary: ${card.accentColor}
- Secondary: border-gray-300
`}</code>
            </pre>
          </section>
        )}
      </div>
    </div>
  );
}