"use client";

import { useState } from "react";
import { ArrowLeft, Copy, Download, Monitor, Code2 } from "lucide-react";
import type { DesignCard } from "@/lib/design-cards";
import { useRouter } from "next/navigation";

function WebsitePreview({ card }: { card: DesignCard }) {
  return (
    <div className="h-full overflow-y-auto bg-[#fff9f0] p-3">
      <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-gray-100 px-3 py-2">
          <span className="text-[8px] tracking-wide text-gray-400">GIFT SETS&nbsp; ORDER&nbsp; SHOP</span>
          <span className="text-[11px] font-black">{card.id}</span>
          <span className="text-[10px] text-gray-400">🔍 🛒</span>
        </div>

        <div className="relative flex min-h-[140px] flex-col justify-center bg-gradient-to-br from-pink-300 to-pink-100 p-4">
          <h3 className="mb-1 text-[13px] font-black leading-tight" style={{ color: card.accentColor }}>
            Mother&apos;s Day<br />is coming!
          </h3>
          <p className="mb-3 max-w-[140px] text-[8px] text-gray-600">From us to family — she&apos;d never have cookies than these</p>
          <button className="w-fit rounded-full px-3 py-1.5 text-[8px] font-bold text-white" style={{ background: card.accentColor }}>
            SHOP ALL COOKIES
          </button>
        </div>

        <div className="border-b border-gray-100 p-3">
          <p className="mb-2 text-[9px] font-bold">Shop Fan Favorites</p>
          <div className="grid grid-cols-4 gap-1.5">
            {["🍪", "🍫", "🎁", "🛍️"].map((emoji, index) => (
              <div key={emoji} className="text-center">
                <div className="flex h-10 items-center justify-center rounded bg-[#f5f0eb] text-base">{emoji}</div>
                <div className="mt-1 text-[7px] leading-tight text-gray-500">Cookie Set {index + 1}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3 p-4" style={{ background: card.accentColor }}>
          <div className="flex-1">
            <p className="text-[11px] font-black leading-tight text-white">Big Cookies Baked in the Big Apple</p>
            <p className="mt-1 text-[7px] leading-relaxed text-white/60">Just a few simple ingredients and a little love.</p>
          </div>
          <div className="flex h-12 w-14 flex-shrink-0 items-center justify-center rounded-lg bg-white/10 text-xl">🍪</div>
        </div>
      </div>
    </div>
  );
}

export default function DesignDetailPage({ card }: { card: DesignCard }) {
  const [activeTab, setActiveTab] = useState<"preview" | "code">("preview");
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#f5f5f5] font-sans">
      <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-white px-5 py-3">
        <button className="flex items-center gap-2 rounded-lg bg-[#111] px-3 py-2 text-sm font-semibold text-white" type="button" onClick={() => router.back()}>
          <ArrowLeft size={14} /> Back
        </button>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium hover:bg-gray-50" type="button">
            <Copy size={13} /> Copy DESIGN.md
          </button>
          <button className="flex items-center gap-2 rounded-lg bg-[#111] px-3 py-2 text-sm font-semibold text-white" type="button">
            <Download size={13} /> Download
          </button>
        </div>
      </div>

      <div className="grid min-h-[calc(100vh-52px)] md:grid-cols-[340px_1fr]">
        <div className="sticky top-[52px] hidden h-[calc(100vh-52px)] border-r border-gray-200 bg-white md:block">
          <WebsitePreview card={card} />
        </div>

        <div className="space-y-4 overflow-y-auto p-7 pb-20">
          <div>
            <div className="mb-3 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl text-sm font-black text-white" style={{ background: card.accentColor }}>
                {card.logo}
              </div>
              <h1 className="text-2xl font-black tracking-tight text-[#111]">{card.name}</h1>
            </div>

            <div className="mb-3 flex flex-wrap gap-2">
              {card.tags.map((tag) => (
                <span key={tag.label} className={`rounded-full border px-3 py-1 text-xs font-medium ${tag.color}`}>
                  {tag.label}
                </span>
              ))}
            </div>

            <p className="mb-4 max-w-xl text-[13px] leading-relaxed text-gray-500">{card.desc}</p>

            <div className="flex gap-2">
              <button
                onClick={() => setActiveTab("preview")}
                className={`flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-all ${activeTab === "preview" ? "border-blue-500 bg-blue-500 text-white" : "border-gray-200 bg-white text-gray-600"}`}
                type="button"
              >
                <Monitor size={14} /> Live Preview
              </button>
              <button
                onClick={() => setActiveTab("code")}
                className={`flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-all ${activeTab === "code" ? "border-blue-500 bg-blue-500 text-white" : "border-gray-200 bg-white text-gray-600"}`}
                type="button"
              >
                <Code2 size={14} /> DESIGN.md
              </button>
            </div>
          </div>

          <section className="rounded-2xl border border-gray-100 bg-white p-5">
            <h2 className="mb-1 text-base font-bold text-[#111]">Typography</h2>
            <p className="mb-4 text-xs text-gray-400">A composed hierarchy for page storytelling.</p>
            <div className="grid grid-cols-2 gap-3">
              {card.fonts.map((font) => (
                <div key={font.name} className={`min-h-[120px] rounded-xl p-4 ${font.dark ? "bg-[#2d2bb5]" : "bg-gray-100"} flex flex-col justify-between`}>
                  <div>
                    <p className={`mb-2 text-[10px] font-semibold uppercase tracking-widest ${font.dark ? "text-blue-300" : "text-gray-400"}`}>{font.name}</p>
                    <p className={`text-3xl font-black tracking-tight ${font.dark ? "text-white" : "text-[#111]"}`}>{font.sample}</p>
                  </div>
                  <span className={`mt-2 w-fit rounded px-2 py-1 text-[10px] font-bold ${font.dark ? "bg-white/20 text-white" : "bg-gray-200 text-gray-600"}`}>{font.role}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-gray-100 bg-white p-5">
            <h2 className="mb-4 text-base font-bold text-[#111]">Color Palette</h2>
            <div className="space-y-3">
              {card.palette.map((palette, index) => (
                <div key={palette.name} className="flex items-center gap-3">
                  <div className="w-20 flex-shrink-0">
                    <p className="text-[11px] font-semibold text-gray-700">D{index + 1} — {palette.name}</p>
                    <p className="font-mono text-[9px] text-gray-400">{palette.hex}</p>
                  </div>
                  <div className="flex flex-1 gap-1">
                    {palette.swatches.map((swatch) => (
                      <div key={swatch} className="h-5 flex-1 rounded-sm" style={{ background: swatch }} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-gray-100 bg-white p-5">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h2 className="mb-4 text-base font-bold text-[#111]">Buttons</h2>
                <div className="flex flex-col gap-2">
                  <button className="w-fit rounded-lg px-4 py-2.5 text-sm font-semibold text-white" style={{ background: card.accentColor }} type="button">
                    Primary
                  </button>
                  <button className="w-fit rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-[#111]" type="button">
                    Secondary
                  </button>
                </div>
              </div>
              <div>
                <h2 className="mb-4 text-base font-bold text-[#111]">Icons</h2>
                <div className="flex flex-col gap-2">
                  <span className="inline-block w-fit rounded-lg border border-yellow-200 bg-[#fff3cd] px-3 py-1.5 text-sm font-black text-yellow-800">Klarna.</span>
                  <div className="flex gap-2">
                    <span className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs font-semibold text-[#111]">🍎 Apple</span>
                    <span className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs text-[#111]">🔔</span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
