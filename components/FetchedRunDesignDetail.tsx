"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  Copy,
  Download,
  Monitor,
  Code2,
  ExternalLink,
  Check,
} from "lucide-react";
import type { RunData, ScrapedDataRecord } from "@/lib/api-types";
import { API_BASE } from "@/lib/api-config";
import { renderStyleMdToHtml } from "@/lib/stylemd-markdown-html";
import { extractStyleMdUi } from "@/lib/stylemd-structured-view";
import { styleMdUiPayloadToDesignCard } from "@/lib/stylemd-to-design-card";
import { WebsitePreview } from "@/components/WebsitePreview";
import { CatalogMainSections } from "@/components/CatalogMainSections";
import type { DesignCard } from "@/lib/design-cards";

function hostnameFromUrl(url: string): string {
  try {
    return new URL(url).hostname;
  } catch {
    return url;
  }
}

function screenshotSrcForRun(run: RunData): string {
  const shot = run.screenshot?.trim() ?? "";
  const raw = run.screenshotUrl?.trim() ?? "";
  if (shot.startsWith("data:") || shot.startsWith("http")) return shot;
  if (shot && API_BASE) return `${API_BASE}${shot.startsWith("/") ? "" : "/"}${shot}`;
  if (raw.startsWith("http")) return raw;
  if (raw && API_BASE) return `${API_BASE}${raw.startsWith("/") ? "" : "/"}${raw}`;
  return "";
}

function samePageUrl(runUrl: string, scrapedUrl: string): boolean {
  if (runUrl === scrapedUrl) return true;
  try {
    const a = new URL(runUrl);
    const b = new URL(scrapedUrl);
    const path = (p: string) => p.replace(/\/$/, "") || "/";
    return a.origin === b.origin && path(a.pathname) === path(b.pathname);
  } catch {
    return false;
  }
}

function resolvePageImageSrc(pageUrl: string, src: string): string {
  const t = src.trim();
  if (!t) return "";
  if (t.startsWith("data:")) return t;
  try {
    if (/^https?:\/\//i.test(t)) return t;
    return new URL(t, pageUrl).href;
  } catch {
    return t;
  }
}

function DbCapturePreview({
  pageUrl,
  title,
  screenshotSrc,
  scrapedImages,
}: {
  pageUrl: string;
  title: string;
  screenshotSrc: string;
  scrapedImages: string[];
}) {
  const thumbs = scrapedImages
    .map((s) => resolvePageImageSrc(pageUrl, s))
    .filter(Boolean);

  return (
    <div className="flex h-full flex-col overflow-hidden bg-page">
      <div className="flex-1 min-h-0 overflow-hidden p-3">
        <div className="flex h-full min-h-[280px] flex-col overflow-hidden rounded-xl border border-white bg-surface shadow-sm">
          <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
            {screenshotSrc ? (
              <div className="min-h-0 flex-1 overflow-auto bg-[#0f0f12] p-2">
                {/* Full-page captures are very tall; width-fill + natural height avoids object-contain + max-h shrinking them to a thin strip. */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={screenshotSrc}
                  alt={`Saved capture of ${title}`}
                  className="block h-auto w-full max-w-full rounded-lg shadow-sm"
                  decoding="async"
                />
              </div>
            ) : null}

            {thumbs.length > 0 ? (
              <div className="flex-shrink-0 border-t border-white bg-page">
                <p className="px-3 pt-2 text-[11px] font-semibold uppercase tracking-wide text-secondary font-manrope">
                  Images from DB
                </p>
                <div className="overflow-x-auto px-3 pb-3 pt-1">
                  <div className="flex w-max gap-2 pb-1">
                    {thumbs.map((src, i) => (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        key={`${src}-${i}`}
                        src={src}
                        alt=""
                        className="h-24 w-36 flex-shrink-0 rounded-lg border border-white bg-surface object-cover"
                        loading="lazy"
                      />
                    ))}
                  </div>
                </div>
              </div>
            ) : null}

            {!screenshotSrc && thumbs.length === 0 ? (
              <div className="flex flex-1 items-center justify-center p-6 text-center text-sm text-secondary font-manrope">
                No screenshot or scraped images in the database for this run yet.
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

export type FetchedRunDesignDetailProps = {
  run: RunData;
  isGenerating: boolean;
  onBack: () => void;
  onRunAgain?: () => void;
  isRunBusy?: boolean;
};

export function FetchedRunDesignDetail({
  run,
  isGenerating,
  onBack,
  onRunAgain,
  isRunBusy,
}: FetchedRunDesignDetailProps) {
  const [tab, setTab] = useState<"stylemd" | "source" | "showcase">("stylemd");
  const [styleDocView, setStyleDocView] = useState<"live" | "designmd">("live");
  const [copied, setCopied] = useState(false);
  const [scrapedImages, setScrapedImages] = useState<string[]>([]);

  const host = hostnameFromUrl(run.url);
  const initials = host.replace("www.", "").slice(0, 2).toUpperCase();
  const screenshotSrc = screenshotSrcForRun(run);

  const parsedStyle = useMemo(() => extractStyleMdUi(run.styleMd || ""), [run.styleMd]);
  const catalogCard: DesignCard | null =
    parsedStyle.payload ?
      styleMdUiPayloadToDesignCard(parsedStyle.payload, { id: run.slug || run.runId, url: run.url })
    : null;

  useEffect(() => {
    if (!API_BASE || !run.url?.trim()) {
      setScrapedImages([]);
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`${API_BASE}/api/scraped-data`);
        if (!res.ok || cancelled) return;
        const j = (await res.json()) as { ok?: boolean; data?: ScrapedDataRecord[] };
        const rows = Array.isArray(j.data) ? j.data : [];
        const row = rows.find((r) => samePageUrl(run.url, r.url));
        if (!cancelled) setScrapedImages(row?.images ?? []);
      } catch {
        if (!cancelled) setScrapedImages([]);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [run.url]);
  const st = String(run.status ?? "");

  const isTerminalStatus =
    st === "failed" ||
    st === "canceled" ||
    st === "completed" ||
    st === "completed_with_warnings";

  const showcaseUrl =
    run.showcaseUrl ||
    (API_BASE ? `${API_BASE}/styleguide/${encodeURIComponent(run.runId)}` : "");

  const handleCopy = async () => {
    if (!run.styleMd?.trim()) return;
    try {
      await navigator.clipboard.writeText(run.styleMd);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const el = document.createElement("textarea");
      el.value = run.styleMd;
      el.style.position = "fixed";
      el.style.opacity = "0";
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([run.styleMd || ""], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${run.slug || "stylemd"}-style.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex min-h-screen flex-col bg-page">
      <div className="sticky top-0 z-10 flex flex-wrap items-center justify-between gap-3 border-b border-medium bg-[#F6F8FA] px-4 py-3 md:px-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 rounded-lg border border-gray-900 bg-gray-900 px-3 py-1.5 text-sm font-medium text-white transition-colors duration-150 hover:bg-gray-800"
          type="button"
        >
          <ArrowLeft size={14} /> Back
        </button>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleCopy}
            disabled={!run.styleMd?.trim()}
            className="flex items-center gap-2 rounded-lg border border-medium bg-surface px-4 py-1.5 text-sm font-medium text-primary transition-colors duration-150 hover:bg-surface-soft disabled:opacity-50"
            type="button"
          >
            {copied ? <Check size={13} className="text-green-600" /> : <Copy size={13} />}
            {copied ? "Copied!" : "Copy style.md"}
          </button>
          <button
            onClick={handleDownload}
            className="flex items-center gap-2 rounded-lg border border-gray-900 bg-gray-900 px-4 py-1.5 text-sm font-semibold text-white transition-colors duration-150 hover:bg-gray-800"
            type="button"
          >
            <Download size={13} /> Download
          </button>
          {onRunAgain ? (
            <button
              type="button"
              onClick={() => void onRunAgain()}
              disabled={isRunBusy}
              className="flex items-center gap-2 rounded-lg px-4 py-1.5 text-sm font-semibold text-white transition-all duration-150 disabled:opacity-50"
              style={{ backgroundColor: "var(--cta)" }}
            >
              {isRunBusy ? "Running…" : "Run again"}
            </button>
          ) : null}
        </div>
      </div>

      <div className="grid flex-1 md:grid-cols-[40%_60%]">
        <div className="sticky top-16 hidden h-[calc(100vh-4rem)] border-r border-white md:block">
          {catalogCard && tab === "stylemd" ? (
            <WebsitePreview card={catalogCard} />
          ) : (
            <DbCapturePreview
              pageUrl={run.url}
              title={host}
              screenshotSrc={screenshotSrc}
              scrapedImages={scrapedImages}
            />
          )}
        </div>

        <div className="overflow-y-auto px-4 py-6 pb-24 md:px-8 md:py-7">
          <div className="mb-6 md:hidden">
            <div className="h-[min(75vh,560px)] min-h-[300px] overflow-hidden rounded-xl border border-white">
              {catalogCard && tab === "stylemd" ? (
                <WebsitePreview card={catalogCard} />
              ) : (
                <DbCapturePreview
                  pageUrl={run.url}
                  title={host}
                  screenshotSrc={screenshotSrc}
                  scrapedImages={scrapedImages}
                />
              )}
            </div>
          </div>

          <div className="mb-6">
            <div className="mb-3 flex flex-wrap items-center gap-3">
              <div
                className="flex h-[60px] w-[60px] flex-shrink-0 items-center justify-center rounded-[7.2px] text-lg font-black text-white overflow-hidden"
                style={{ backgroundColor: catalogCard?.accentColor ?? "var(--cta)" }}
              >
                {catalogCard && (catalogCard.logo.startsWith("/") || /^https?:/i.test(catalogCard.logo)) ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={catalogCard.logo} alt="" className="h-full w-full object-cover" />
                ) : catalogCard ?
                  <span className="text-xl">{catalogCard.logo}</span>
                : initials}
              </div>
              <div className="min-w-0 flex-1">
                <h1 className="heading-h2 tracking-tight truncate">
                  {parsedStyle.payload?.brand.trim() ? parsedStyle.payload.brand : host}
                </h1>
                <p className="text-xs text-secondary font-manrope truncate">{run.url}</p>
              </div>
            </div>

            {parsedStyle.payload?.description?.trim() ? (
              <p className="mb-4 max-w-2xl text-sm leading-relaxed text-secondary">{parsedStyle.payload.description.trim()}</p>
            ) : null}

            <div className="mb-4 flex flex-wrap gap-2">
              <span className="rounded-[16px] border border-medium bg-surface px-3 py-1 text-xs font-medium text-primary">
                {run.provider}
              </span>
              {run.model ? (
                <span className="rounded-[16px] border border-medium bg-blue-50 px-3 py-1 text-xs font-medium text-accent-blue-light">
                  {run.model}
                </span>
              ) : null}
              <span className="rounded-[16px] border border-medium bg-surface-soft px-3 py-1 text-xs font-medium text-secondary">
                {run.status}
              </span>
              {run.slug ? (
                <span className="rounded-[16px] border border-medium px-3 py-1 text-xs font-medium text-secondary">
                  {run.slug}
                </span>
              ) : null}
              {parsedStyle.payload?.tags?.length ?
                parsedStyle.payload.tags.map((tag) => {
                  const label = typeof tag === "string" ? tag : tag.label;
                  const a = catalogCard?.accentColor ?? "#0a73eb";
                  return (
                    <span
                      key={label}
                      className="rounded-[16px] border px-3 py-1 text-xs font-medium"
                      style={{ borderColor: `${a}55`, color: a, backgroundColor: `${a}14` }}
                    >
                      {label}
                    </span>
                  );
                })
              : null}
            </div>

            <div className="inline-flex h-[48px] flex-wrap items-center gap-0 rounded-[12px] border border-medium bg-surface-soft p-1">
              <button
                onClick={() => setTab("stylemd")}
                className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-all whitespace-nowrap md:px-5 ${
                  tab === "stylemd" ? "bg-accent-blue text-white shadow-md" : "text-secondary hover:text-primary"
                }`}
                type="button"
              >
                <Monitor size={14} /> style.md
              </button>
              <button
                onClick={() => setTab("source")}
                className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-all whitespace-nowrap md:px-5 ${
                  tab === "source" ? "bg-accent-blue text-white shadow-md" : "text-secondary hover:text-primary"
                }`}
                type="button"
              >
                <Code2 size={14} /> Source
              </button>
              <button
                onClick={() => setTab("showcase")}
                className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-all whitespace-nowrap md:px-5 ${
                  tab === "showcase" ? "bg-accent-blue text-white shadow-md" : "text-secondary hover:text-primary"
                }`}
                type="button"
              >
                <ExternalLink size={14} /> Showcase
              </button>
            </div>
          </div>

          {tab === "stylemd" && (
            <div className="space-y-4">
              {!isGenerating && catalogCard && parsedStyle.payload ? (
                <>
                  <div className="inline-flex h-[48px] flex-wrap items-center gap-0 rounded-[12px] border border-medium bg-surface-soft p-1">
                    <button
                      onClick={() => setStyleDocView("live")}
                      className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold whitespace-nowrap transition-all md:px-5 ${
                        styleDocView === "live" ? "bg-accent-blue text-white shadow-md" : "text-secondary hover:text-primary"
                      }`}
                      type="button"
                    >
                      <Monitor size={14} /> Live Preview
                    </button>
                    <button
                      onClick={() => setStyleDocView("designmd")}
                      className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold whitespace-nowrap transition-all md:px-5 ${
                        styleDocView === "designmd" ? "bg-accent-blue text-white shadow-md" : "text-secondary hover:text-primary"
                      }`}
                      type="button"
                    >
                      <Code2 size={14} /> DESIGN.md
                    </button>
                  </div>
                  <div
                    className="relative overflow-y-auto rounded-2xl border border-medium bg-transparent shadow-sm pb-8"
                    style={{ maxHeight: "none" }}
                  >
                    {styleDocView === "live" ? (
                      <CatalogMainSections card={catalogCard} extras={parsedStyle.payload} />
                    ) : (
                      <section className="rounded-2xl border border-medium bg-surface p-6">
                        <pre className="overflow-x-auto rounded-xl bg-[#1a1a1a] p-5 font-mono text-xs leading-relaxed text-gray-100">
                          {run.styleMd || ""}
                        </pre>
                      </section>
                    )}
                  </div>
                </>
              ) : null}

              {(!catalogCard || !parsedStyle.payload || isGenerating) && (
                <div
                  className="relative overflow-y-auto rounded-2xl border border-medium bg-surface p-6 shadow-sm md:p-8"
                  style={{ maxHeight: "70vh" }}
                >
                  {isGenerating && (
                    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 rounded-2xl bg-surface/90 backdrop-blur-sm">
                      <div
                        className="h-8 w-8 animate-spin rounded-full border-2 border-t-transparent"
                        style={{ borderColor: "var(--cta)", borderTopColor: "transparent" }}
                      />
                      <p className="px-4 text-center text-sm font-semibold text-secondary font-manrope">
                        Generating style.md… This can take several minutes.
                      </p>
                    </div>
                  )}
                  {!isGenerating && !run.styleMd?.trim() && isTerminalStatus ? (
                    <p className="text-sm text-secondary font-manrope">
                      No style.md was produced for this run
                      {st === "failed" || st === "canceled" ? " (run did not complete successfully)." : "."}
                    </p>
                  ) : catalogCard ? null : (
                    <div
                      className="prose-stylemd"
                      dangerouslySetInnerHTML={{ __html: renderStyleMdToHtml(run.styleMd || "") }}
                    />
                  )}
                </div>
              )}
            </div>
          )}

          {tab === "source" && (
            <div className="relative overflow-hidden rounded-2xl border border-medium bg-surface shadow-sm" style={{ maxHeight: "70vh" }}>
              {isGenerating && (
                <div className="absolute inset-0 z-10 flex items-center justify-center bg-[#1a1a1a]/80">
                  <div
                    className="h-8 w-8 animate-spin rounded-full border-2 border-t-transparent"
                    style={{ borderColor: "var(--cta)", borderTopColor: "transparent" }}
                  />
                </div>
              )}
              <pre
                className="overflow-auto p-6 font-mono text-xs leading-relaxed"
                style={{ color: "#d4d4d4", background: "#1a1a1a", maxHeight: "70vh" }}
              >
                {run.styleMd || (isGenerating ? "" : "")}
              </pre>
            </div>
          )}

          {tab === "showcase" && (
            <div className="relative overflow-hidden rounded-2xl border border-medium bg-surface shadow-sm" style={{ height: "70vh" }}>
              {!showcaseUrl || isGenerating ? (
                <div className="flex h-full flex-col items-center justify-center gap-3 p-6 text-center">
                  <p className="text-sm text-secondary font-manrope">
                    {isGenerating
                      ? "Showcase will be available when the pipeline finishes."
                      : "Open the showcase on the API host when the pipeline has generated HTML."}
                  </p>
                  {showcaseUrl && !isGenerating ? (
                    <a
                      href={showcaseUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-xl border border-medium px-4 py-2 text-sm font-semibold text-primary hover:bg-surface-soft"
                    >
                      Open showcase ↗
                    </a>
                  ) : null}
                </div>
              ) : (
                <iframe src={showcaseUrl} title={`Showcase for ${host}`} className="h-full w-full border-none" sandbox="allow-scripts allow-same-origin" />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
