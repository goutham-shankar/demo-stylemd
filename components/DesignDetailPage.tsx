"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Copy,
  Monitor,
  Code2,
  Check,
  RefreshCw,
  AlertCircle,
  ExternalLink
} from "lucide-react";
import type { DesignCard } from "@/lib/design-cards";
import type { RunData } from "@/lib/api-types";
import { parseStyleMd, mapToDesignCard } from "@/lib/stylemd-parser";
import { CatalogMainSections } from "@/components/CatalogMainSections";
import { extractStyleMdUi } from "@/lib/stylemd-structured-view";

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
  const { card, styleMd, extras } = useMemo(() => {
    // If we have a direct card (catalog mode)
    if (initialCard) {
      const { payload } = extractStyleMdUi(initialStyleMd || "");
      return { card: initialCard, styleMd: initialStyleMd || "", extras: payload };
    }

    // If we have a run (pipeline mode)
    if (run && run.styleMd) {
      const parsed = parseStyleMd(run.styleMd, run.designTokens);
      const preview = run.screenshot || null;

      // Validate logo: only use brandAssets.logo if it's from the same host as the run URL,
      // otherwise it may be a third-party embed (e.g. a Spotify widget on the page).
      // Fall back to favicon / apple-icon which are always from the target domain.
      const resolvedLogo = (() => {
        // 1. Prioritize apple-touch-icon (always safe & official)
        if (run.brandAssets?.appleIcon) {
          return run.brandAssets.appleIcon;
        }

        // 2. Validate generic scraped logo (only use if same-host to filter out third-party widgets)
        if (run.brandAssets?.logo) {
          const logoUrl = run.brandAssets.logo;
          if (logoUrl.startsWith("data:")) return logoUrl;
          try {
            const runHost = new URL(run.url).hostname.replace(/^www\./, "");
            const logoHost = new URL(logoUrl).hostname.replace(/^www\./, "");
            if (logoHost === runHost || logoHost.endsWith(`.${runHost}`)) {
              return logoUrl;
            }
          } catch {
            // relative URL – always safe
            return logoUrl;
          }
        }

        // 3. Fallback to favicon (always safe & official)
        if (run.brandAssets?.favicon) {
          return run.brandAssets.favicon;
        }

        return undefined;
      })();

      const mapped = mapToDesignCard(
        parsed,
        run.slug || run.runId,
        run.url,
        resolvedLogo,
        preview,
        run.title
      );
      mapped.brandAssets = run.brandAssets;
      const { payload } = extractStyleMdUi(run.styleMd);
      return { card: mapped, styleMd: run.styleMd, extras: payload };
    }

    return { card: null, styleMd: "", extras: null };
  }, [initialCard, run?.runId, run?.slug, run?.styleMd, run?.designTokens, run?.screenshot, run?.brandAssets?.logo, run?.url, initialStyleMd]);

  // Logo container bg: always use a dark-enough color so white logo/letter stays visible.
  // If the primary color is too light (luminance > 0.35), fall back to the dark text color.
  const logoBg = useMemo(() => {
    if (!card) return "#111111";
    const primary = card.theme?.colors.primary || card.tokens.colors.primary || "#111111";
    const hex6 = /^#[0-9A-Fa-f]{6}$/.test(primary) ? primary : null;
    if (!hex6) return primary;
    const r = parseInt(hex6.slice(1, 3), 16) / 255;
    const g = parseInt(hex6.slice(3, 5), 16) / 255;
    const b = parseInt(hex6.slice(5, 7), 16) / 255;
    const lin = (c: number) => (c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4));
    const lum = 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
    if (lum <= 0.35) return primary; // dark enough
    // Primary is too light — use the dark text color instead
    const textColor = card.theme?.colors.text;
    if (textColor && /^#[0-9A-Fa-f]{6}$/.test(textColor)) {
      const tr = parseInt(textColor.slice(1, 3), 16) / 255;
      const tg = parseInt(textColor.slice(3, 5), 16) / 255;
      const tb = parseInt(textColor.slice(5, 7), 16) / 255;
      const tLum = 0.2126 * lin(tr) + 0.7152 * lin(tg) + 0.0722 * lin(tb);
      if (tLum <= 0.35) return textColor;
    }
    return "#111111";
  }, [card]);

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
  // 4. Render States
  if (isGenerating) {
    return <DesignDetailPageSkeleton run={run} />;
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
    <div className="flex min-h-screen flex-col bg-[#f6f8fa] font-manrope">
      {/* 2. Main Content Area */}
      <main className="flex flex-1 flex-col md:flex-row overflow-hidden">
        {/* Left: Preview (40% on desktop, top on mobile) */}
        <aside className="w-full md:w-[40%] flex flex-col border-b md:border-b-0 md:border-r border-medium bg-page">
          <div className="flex-1 overflow-y-auto p-4 md:p-6 scrollbar-hide max-h-[40vh] md:max-h-none">
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
        <article className="relative flex flex-1 flex-col overflow-y-auto bg-[#f6f8fa]">
          <div className="mx-auto w-full max-w-4xl px-8 py-10 pb-32">
            
            {/* Contextual Back Navigation */}
            <div className="mb-8 flex">
              <button
                onClick={handleBack}
                className="group flex items-center gap-2 text-[14px] font-semibold text-secondary transition-colors hover:text-primary"
              >
                <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-1" />
                Back to Library
              </button>
            </div>

            {/* Brand Identity Header */}
            <header className="mb-10">
              <div className="mb-6 flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                  {/* Logo */}
                  {(typeof card.logo === "string" && (card.logo.startsWith("/") || card.logo.startsWith("data:image") || card.logo.startsWith("http://") || card.logo.startsWith("https://"))) ? (
                    <div className="flex h-20 w-20 flex-shrink-0 items-center justify-center overflow-hidden rounded-2xl ring-1 ring-black/10 shadow-sm">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={card.logo}
                        alt={card.name}
                        className="h-full w-full object-contain"
                      />
                    </div>
                  ) : (
                    <div
                      className="flex h-20 w-20 flex-shrink-0 items-center justify-center overflow-hidden rounded-2xl ring-2 ring-black/10 shadow-sm"
                      style={{ backgroundColor: logoBg }}
                    >
                      <span className="text-2xl font-black text-white">{card.name.charAt(0)}</span>
                    </div>
                  )}
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      {card.url ? (
                        <a
                          href={card.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group flex items-center gap-1.5 hover:opacity-80 transition-opacity"
                          title={`Visit ${card.url}`}
                        >
                          <h1 className="text-3xl md:text-4xl font-black tracking-tight text-gray-900 group-hover:underline underline-offset-4 decoration-2">{card.name}</h1>
                        </a>
                      ) : (
                        <h1 className="text-3xl md:text-4xl font-black tracking-tight text-gray-900">{card.name}</h1>
                      )}
                      {card.url && (
                        <a
                          href={card.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          title={`Open ${card.url}`}
                          className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border border-medium bg-white text-secondary shadow-sm transition-all hover:border-gray-400 hover:text-primary hover:shadow-md active:scale-95"
                        >
                          <ExternalLink size={14} />
                        </a>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {card.tags.map(tag => (
                        <span
                          key={tag.label}
                          className={`rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${tag.color || "border-medium bg-surface-soft text-secondary"}`}
                        >
                          {tag.label}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Action buttons — right-aligned, vertically centered with the logo row */}
                <div className="flex flex-wrap items-center gap-3 lg:pt-1">
                  <button
                    onClick={handleCopy}
                    className="group relative flex flex-1 sm:flex-initial items-center justify-center gap-2 rounded-[10px] border border-medium bg-white px-4 py-2.5 text-sm font-semibold text-primary transition-all hover:border-gray-400 active:scale-95 shadow-sm"
                  >
                    {copied ? <Check size={14} className="text-green-600" /> : <Copy size={14} className="text-secondary group-hover:text-primary" />}
                    <span>{copied ? "Copied!" : "Copy style.md"}</span>
                  </button>
                  <button
                    onClick={handleDownload}
                    className="flex flex-1 sm:flex-initial items-center justify-center gap-2 rounded-[10px] bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-black active:scale-95 shadow-sm"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/Cloud Download.svg" alt="" width={19} height={19} />
                    <span>Download style.md</span>
                  </button>
                  {onRunAgain && (
                    <button
                      onClick={onRunAgain}
                      disabled={isRunBusy}
                      className="flex h-10 w-10 items-center justify-center rounded-[10px] border border-medium bg-white text-secondary shadow-sm transition-all hover:text-primary hover:border-gray-400 disabled:opacity-50"
                      title="Regenerate"
                    >
                      <RefreshCw size={16} className={isRunBusy ? "animate-spin" : ""} />
                    </button>
                  )}
                </div>
              </div>
              <p className="max-w-2xl text-lg leading-relaxed text-secondary/80 font-medium">
                {extras?.description || card.desc}
              </p>
            </header>

            {/* Tab Navigation */}
            <div className="mb-10 flex border-b border-medium">
              <button
                onClick={() => setActiveTab("preview")}
                className={`relative flex items-center gap-2 px-6 py-4 text-sm font-bold transition-all ${activeTab === "preview" ? "text-primary" : "text-secondary hover:text-primary"
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
                className={`relative flex items-center gap-2 px-6 py-4 text-sm font-bold transition-all ${activeTab === "code" ? "text-primary" : "text-secondary hover:text-primary"
                  }`}
              >
                <Code2 size={16} />
                style.md
                {activeTab === "code" && (
                  <div className="absolute bottom-[-1px] left-0 h-[2px] w-full bg-gray-900" />
                )}
              </button>
            </div>

            {/* Active Content */}
            <div className="transition-all duration-300">
              {activeTab === "preview" ? (
                <CatalogMainSections card={card} extras={extras} />
              ) : (
                <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#0d1117] shadow-2xl">
                  {/* Title bar */}
                  <div className="flex items-center justify-between border-b border-white/10 bg-white/[0.03] px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex gap-1.5">
                        <span className="h-3 w-3 rounded-full bg-red-500/70" />
                        <span className="h-3 w-3 rounded-full bg-yellow-500/70" />
                        <span className="h-3 w-3 rounded-full bg-green-500/70" />
                      </div>
                      <span className="font-mono text-[11px] text-white/30">style.md</span>
                    </div>
                    <button
                      onClick={handleCopy}
                      className="rounded-md border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white/50 transition-all hover:bg-white/10 hover:text-white"
                    >
                      {copied ? "✓ Copied" : "Copy Raw"}
                    </button>
                  </div>
                  {/* Line-numbered code area */}
                  <div className="overflow-x-auto p-6">
                    <table className="w-full border-collapse font-mono text-sm leading-6">
                      <tbody>
                        {finalMarkdown.split("\n").map((line, i) => {
                          let colored: React.ReactNode = line;
                          if (/^# /.test(line)) {
                            colored = <span className="text-[#79c0ff] font-bold">{line}</span>;
                          } else if (/^## /.test(line)) {
                            colored = <span className="text-[#79c0ff]">{line}</span>;
                          } else if (/^### /.test(line)) {
                            colored = <span className="text-[#d2a8ff]">{line}</span>;
                          } else if (/^####/.test(line)) {
                            colored = <span className="text-[#d2a8ff] opacity-80">{line}</span>;
                          } else if (/^```/.test(line)) {
                            colored = <span className="text-[#8b949e]">{line}</span>;
                          } else if (/^\s*[-*]/.test(line)) {
                            // Bullet line — highlight **bold** and `code` and #hex inline
                            const parts = line.split(/(\*\*[^*]+\*\*|`[^`]+`|#[0-9A-Fa-f]{3,6}\b)/g);
                            colored = (
                              <>
                                {parts.map((p, j) => {
                                  if (/^\*\*[^*]+\*\*$/.test(p)) return <span key={j} className="text-[#ffa657] font-semibold">{p}</span>;
                                  if (/^`[^`]+`$/.test(p)) return <span key={j} className="text-[#a5d6ff] bg-white/5 rounded px-1">{p}</span>;
                                  if (/^#[0-9A-Fa-f]{3,6}$/.test(p)) return <span key={j} className="text-[#7ee787]">{p}</span>;
                                  return <span key={j} className="text-[#e6edf3]">{p}</span>;
                                })}
                              </>
                            );
                          } else if (line.trim() === "") {
                            colored = <span>&nbsp;</span>;
                          } else {
                            // Inline coloring for non-bullet lines
                            const parts = line.split(/(\*\*[^*]+\*\*|`[^`]+`|#[0-9A-Fa-f]{3,6}\b)/g);
                            colored = (
                              <>
                                {parts.map((p, j) => {
                                  if (/^\*\*[^*]+\*\*$/.test(p)) return <span key={j} className="text-[#ffa657] font-semibold">{p}</span>;
                                  if (/^`[^`]+`$/.test(p)) return <span key={j} className="text-[#a5d6ff] bg-white/5 rounded px-1">{p}</span>;
                                  if (/^#[0-9A-Fa-f]{3,6}$/.test(p)) return <span key={j} className="text-[#7ee787]">{p}</span>;
                                  return <span key={j} className="text-[#e6edf3]">{p}</span>;
                                })}
                              </>
                            );
                          }
                          return (
                            <tr key={i} className="group hover:bg-white/[0.02]">
                              <td className="w-10 select-none pr-4 text-right text-[11px] text-white/20 group-hover:text-white/30">
                                {i + 1}
                              </td>
                              <td className="whitespace-pre-wrap break-all">{colored}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>
        </article>
      </main>
    </div>
  );
}

export function DesignDetailPageSkeleton({ run }: { run?: RunData }) {
  return (
    <div className="flex min-h-screen flex-col bg-[#f6f8fa] font-manrope">
      <main className="flex flex-1 overflow-hidden">
        {/* Left skeleton */}
        <aside className="hidden w-[40%] border-r border-medium bg-white md:flex flex-col p-6">
          <div className="flex-1 rounded-2xl bg-gray-100 animate-pulse" />
        </aside>
        {/* Right skeleton */}
        <div className="flex flex-1 flex-col px-8 py-10 gap-6 mx-auto w-full max-w-4xl">
          {/* Breadcrumb skeleton */}
          <div className="mb-2">
            <div className="h-4 w-32 rounded bg-gray-200 animate-pulse" />
          </div>
          {/* Logo + name row */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-5">
              <div className="h-20 w-20 flex-shrink-0 rounded-2xl bg-gray-200 animate-pulse" />
              <div className="flex flex-col gap-3">
                <div className="h-9 w-52 rounded-lg bg-gray-200 animate-pulse" />
                <div className="flex gap-2">
                  <div className="h-5 w-16 rounded-full bg-gray-200 animate-pulse" />
                  <div className="h-5 w-14 rounded-full bg-gray-200 animate-pulse" />
                  <div className="h-5 w-20 rounded-full bg-gray-200 animate-pulse" />
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 pt-1">
              <div className="h-9 w-36 rounded-[10px] bg-gray-200 animate-pulse" />
              <div className="h-9 w-28 rounded-[10px] bg-gray-200 animate-pulse" />
            </div>
          </div>
          {/* Description */}
          <div className="space-y-2 max-w-2xl">
            <div className="h-4 w-full rounded bg-gray-200 animate-pulse" />
            <div className="h-4 w-4/5 rounded bg-gray-200 animate-pulse" />
          </div>
          {/* Stage pill */}
          {run?.stage && (
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-medium bg-white px-4 py-2 text-sm font-medium text-primary shadow-sm">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-blue-500" />
              </span>
              Processing: {run.stage.charAt(0).toUpperCase() + run.stage.slice(1)}
            </div>
          )}
          {/* Tab row */}
          <div className="flex gap-1 border-b border-medium pb-px">
            <div className="h-5 w-28 rounded bg-gray-200 animate-pulse mx-4 mb-3" />
            <div className="h-5 w-24 rounded bg-gray-200 animate-pulse mx-4 mb-3" />
          </div>
          {/* Content blocks */}
          {[180, 240, 200].map((h, i) => (
            <div key={i} className="overflow-hidden rounded-2xl border border-medium bg-white">
              <div className="flex items-center gap-3 border-b border-medium px-6 py-4">
                <div className="h-4 w-4 rounded bg-gray-200 animate-pulse" />
                <div className="h-4 w-28 rounded bg-gray-200 animate-pulse" />
              </div>
              <div className="p-6">
                <div className={`rounded-xl bg-gray-100 animate-pulse`} style={{ height: h }} />
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}