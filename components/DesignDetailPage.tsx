"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  ArrowLeft, 
  Copy, 
  Download, 
  Monitor, 
  Code2, 
  Check, 
  RefreshCw,
  ExternalLink,
  AlertCircle
} from "lucide-react";
import type { DesignCard } from "@/lib/design-cards";
import type { RunData } from "@/lib/api-types";
import { parseStyleMd, mapToDesignCard } from "@/lib/stylemd-parser";
import { CatalogMainSections } from "@/components/CatalogMainSections";

export type DesignDetailPageProps = {
  card?: DesignCard;
  run?: RunData;
  isGenerating?: boolean;
  onBack?: () => void;
  onRunAgain?: () => void;
  isRunBusy?: boolean;
  styleMd?: string; // Optional override
};

export default function DesignDetailPage({
  card: initialCard,
  run,
  isGenerating = false,
  onBack,
  onRunAgain,
  isRunBusy = false,
  styleMd: initialStyleMd,
}: DesignDetailPageProps) {
  const [activeTab, setActiveTab] = useState<"preview" | "code">("preview");
  const [copied, setCopied] = useState(false);
  const router = useRouter();

  // 1. Resolve the design card and markdown content
  const { card, styleMd } = useMemo(() => {
    // If we have a direct card (catalog mode)
    if (initialCard) {
      return { card: initialCard, styleMd: initialStyleMd || "" };
    }
    
    // If we have a run (pipeline mode)
    if (run && run.styleMd) {
      const parsed = parseStyleMd(run.styleMd);
      const preview = run.screenshot || (run.images && run.images.length > 0 ? run.images[0] : null);
      const mapped = mapToDesignCard(
        parsed,
        run.slug || run.runId,
        run.url,
        run.brandAssets?.logo,
        preview
      );
      return { card: mapped, styleMd: run.styleMd };
    }

    return { card: null, styleMd: "" };
  }, [initialCard, run, initialStyleMd]);

  // 2. Markdown Generation (Source of Truth)
  const finalMarkdown = useMemo(() => {
    if (styleMd) return styleMd;
    if (!card) return "";

    return `# ${card.name} Design System

## Overview
${card.desc}
Source: ${card.url || "N/A"}

## Colors
${card.palette.map((p, i) => `- **${p.name}**: ${p.hex}`).join("\n")}

## Typography
${card.fonts.map((f) => `- **${f.role}**: \`${f.name}\``).join("\n")}

## Buttons
- **Primary Action**: ${card.tokens.colors.primary}
- **Button Radius**: \`${card.tokens.buttons.radius}\`

## Spacing
- **Base rhythm**: ${card.tokens.spacing}

## Shapes
- **Corner Radius**: \`${card.tokens.buttons.radius}\`
`;
  }, [styleMd, card]);

  // 3. Actions
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(finalMarkdown);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Copy failed", err);
    }
  };

  const handleDownload = () => {
    if (!card) return;
    const blob = new Blob([finalMarkdown], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${card.id || "design"}-style.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleBack = () => {
    if (onBack) return onBack();
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push("/");
    }
  };

  // 4. Render States
  if (isGenerating) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-page p-8 text-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-t-transparent mb-6" style={{ borderColor: "var(--cta)", borderTopColor: "transparent" }} />
        <h2 className="text-2xl font-bold text-primary mb-2">Generating Design System</h2>
        <p className="max-w-md text-secondary">Analyzing brand assets and mapping design tokens. This usually takes 60-90 seconds...</p>
      </div>
    );
  }

  if (!card) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-page p-8 text-center">
        <AlertCircle size={48} className="text-red-500 mb-4" />
        <h2 className="text-2xl font-bold text-primary mb-2">Design Not Found</h2>
        <p className="max-w-md text-secondary mb-6">We couldn't find the requested design system details.</p>
        <button onClick={handleBack} className="rounded-lg bg-gray-900 px-6 py-2 text-sm font-semibold text-white">Go Back</button>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-page font-manrope">
      {/* 1. Sticky Top Bar */}
      <header className="sticky top-0 z-50 flex items-center justify-between border-b border-medium bg-white/80 px-6 py-3 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <button
            onClick={handleBack}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-medium bg-white text-primary transition-all hover:bg-page active:scale-95"
            title="Go back"
          >
            <ArrowLeft size={18} />
          </button>
          <div className="h-4 w-[1px] bg-medium" />
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-primary">{card.name}</span>
            {card.url && (
              <a href={card.url} target="_blank" rel="noopener noreferrer" className="text-secondary hover:text-primary">
                <ExternalLink size={14} />
              </a>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleCopy}
            className="group relative flex items-center gap-2 rounded-full border border-medium bg-white px-4 py-2 text-sm font-semibold text-primary transition-all hover:border-gray-400 active:scale-95"
          >
            {copied ? <Check size={14} className="text-green-600" /> : <Copy size={14} className="text-secondary group-hover:text-primary" />}
            <span>{copied ? "Copied" : "Copy MD"}</span>
          </button>
          
          <button
            onClick={handleDownload}
            className="flex items-center gap-2 rounded-full bg-gray-900 px-5 py-2 text-sm font-semibold text-white transition-all hover:bg-black active:scale-95 shadow-sm"
          >
            <Download size={14} />
            <span>Download</span>
          </button>

          {onRunAgain && (
            <button
              onClick={onRunAgain}
              disabled={isRunBusy}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-medium bg-white text-secondary transition-all hover:text-primary disabled:opacity-50"
              title="Regenerate"
            >
              <RefreshCw size={16} className={isRunBusy ? "animate-spin" : ""} />
            </button>
          )}
        </div>
      </header>

      {/* 2. Main Content Area */}
      <main className="flex flex-1 overflow-hidden">
        {/* Left: Preview (40%) */}
        <aside className="hidden w-[40%] flex-col border-r border-medium bg-page md:flex">
          <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
            <div className="overflow-hidden rounded-2xl border border-medium bg-white shadow-xl">
              {card.preview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img 
                  src={card.preview} 
                  alt="Website Preview" 
                  className="w-full h-auto"
                  loading="lazy"
                />
              ) : (
                <div className="flex aspect-[3/4] items-center justify-center bg-surface-soft p-12 text-center text-secondary">
                  <div>
                    <Monitor size={32} className="mx-auto mb-3 opacity-20" />
                    <p className="text-xs font-medium">Preview snapshot unavailable</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </aside>

        {/* Right: Content (60%) */}
        <article className="relative flex flex-1 flex-col overflow-y-auto bg-white">
          <div className="mx-auto w-full max-w-4xl px-8 py-10 pb-32">
            
            {/* Brand Identity Header */}
            <header className="mb-10">
              <div className="mb-6 flex items-start justify-between">
                <div className="flex items-center gap-5">
                  <div 
                    className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-2xl shadow-inner border border-medium"
                    style={{ backgroundColor: card.tokens.colors.primary }}
                  >
                    {(typeof card.logo === "string" && (card.logo.startsWith("/") || card.logo.startsWith("data:image"))) ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={card.logo} alt={card.name} className="h-12 w-12 object-contain filter brightness-0 invert" />
                    ) : (
                      <span className="text-2xl font-black text-white">{card.name.charAt(0)}</span>
                    )}
                  </div>
                  <div>
                    <h1 className="text-4xl font-black tracking-tight text-primary mb-2">{card.name}</h1>
                    <div className="flex flex-wrap gap-2">
                      {card.tags.map(tag => (
                        <span 
                          key={tag.label} 
                          className="rounded-full border border-medium bg-surface-soft px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-secondary"
                        >
                          {tag.label}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <p className="max-w-2xl text-lg leading-relaxed text-secondary/80 font-medium">
                {card.desc}
              </p>
            </header>

            {/* Tab Navigation */}
            <div className="mb-10 flex border-b border-medium">
              <button
                onClick={() => setActiveTab("preview")}
                className={`relative flex items-center gap-2 px-6 py-4 text-sm font-bold transition-all ${
                  activeTab === "preview" ? "text-primary" : "text-secondary hover:text-primary"
                }`}
              >
                <Monitor size={16} />
                Live Preview
                {activeTab === "preview" && (
                  <div className="absolute bottom-[-1px] left-0 h-[2px] w-full bg-gray-900" />
                )}
              </button>
              <button
                onClick={() => setActiveTab("code")}
                className={`relative flex items-center gap-2 px-6 py-4 text-sm font-bold transition-all ${
                  activeTab === "code" ? "text-primary" : "text-secondary hover:text-primary"
                }`}
              >
                <Code2 size={16} />
                DESIGN.md
                {activeTab === "code" && (
                  <div className="absolute bottom-[-1px] left-0 h-[2px] w-full bg-gray-900" />
                )}
              </button>
            </div>

            {/* Active Content */}
            <div className="transition-all duration-300">
              {activeTab === "preview" ? (
                <CatalogMainSections card={card} extras={null} />
              ) : (
                <div className="overflow-hidden rounded-2xl border border-medium bg-gray-950 shadow-2xl">
                  <div className="flex items-center justify-between border-b border-white/10 bg-white/5 px-5 py-3">
                    <span className="text-xs font-bold uppercase tracking-widest text-white/40">markdown output</span>
                    <button 
                      onClick={handleCopy}
                      className="text-xs font-bold text-white/60 hover:text-white"
                    >
                      {copied ? "Copied!" : "Copy Raw"}
                    </button>
                  </div>
                  <pre className="overflow-x-auto p-8 font-mono text-sm leading-relaxed text-gray-100 selection:bg-white/20">
                    <code>{finalMarkdown}</code>
                  </pre>
                </div>
              )}
            </div>
          </div>
        </article>
      </main>
    </div>
  );
}