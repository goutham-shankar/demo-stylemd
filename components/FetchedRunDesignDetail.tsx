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
import { isFixtureRunId } from "@/lib/fixture-runs";
import type { StyleMdUiPayload } from "@/lib/stylemd-structured-view";

function hostnameFromUrl(url?: string): string {
  if (!url) return "";
  try {
    return new URL(url).hostname;
  } catch {
    return String(url);
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
  description,
  h1,
  canonical,
  screenshotSrc,
  scrapedImages,
}: {
  pageUrl: string;
  title: string;
  description?: string | null;
  h1?: string | null;
  canonical?: string | null;
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
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={screenshotSrc}
                  alt={`Saved capture of ${title}`}
                  className="block h-auto w-full max-w-full rounded-lg shadow-sm"
                  decoding="async"
                />
              </div>
            ) : null}

            {/* Metadata strip */}
            {(h1 || description || canonical) ? (
              <div className="flex-shrink-0 border-t border-white bg-surface px-3 py-2 space-y-1">
                {h1 && (
                  <p className="text-[11px] font-semibold text-primary truncate font-manrope">
                    {h1}
                  </p>
                )}
                {description && (
                  <p className="text-[11px] text-secondary line-clamp-2 font-manrope">
                    {description}
                  </p>
                )}
                {canonical && (
                  <p className="text-[10px] text-blue-500 truncate font-manrope">
                    {canonical}
                  </p>
                )}
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
  useDynamicUITemplate?: boolean;
  templateRunId?: string;
};

export function FetchedRunDesignDetail({
  run,
  isGenerating,
  onBack,
  onRunAgain,
  isRunBusy,
  useDynamicUITemplate = false,
  templateRunId = "levainbakery-2",
}: FetchedRunDesignDetailProps) {
  const [tab, setTab] = useState<"stylemd" | "source" | "showcase">("stylemd");
  const [styleDocView, setStyleDocView] = useState<"live" | "designmd">("live");
  const [copied, setCopied] = useState(false);
  const [scrapedImages, setScrapedImages] = useState<string[]>([]);
  const [scrapedMeta, setScrapedMeta] = useState<{
    description?: string | null;
    h1?: string | null;
    canonical?: string | null;
    screenshotSrc?: string;
  }>({});
  const [templateDesign, setTemplateDesign] = useState<{
    card: DesignCard;
    payload: StyleMdUiPayload;
  } | null>(null);
  const [templateLoading, setTemplateLoading] = useState(useDynamicUITemplate);

  const host = hostnameFromUrl(run.url ?? run.slug ?? run.runId ?? "");
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
      setScrapedMeta({});
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        // GET /api/scrape?url=... returns the cached scrape doc
        const encoded = encodeURIComponent(run.url);
        const res = await fetch(`${API_BASE}/api/scrape?url=${encoded}`);
        if (!res.ok || cancelled) return;
        const j = (await res.json()) as {
          ok?: boolean;
          data?: import("@/lib/api-types").ScrapedDataRecord;
          // some backends return array shape
          rows?: import("@/lib/api-types").ScrapedDataRecord[];
        };
        // Support both { data: doc } and { rows: [doc, ...] } shapes
        let row: import("@/lib/api-types").ScrapedDataRecord | null = null;
        if (j.data && typeof j.data === "object" && !Array.isArray(j.data)) {
          row = j.data;
        } else if (Array.isArray(j.rows)) {
          row = j.rows.find((r) => samePageUrl(run.url, r.url)) ?? null;
        }
        if (!cancelled && row) {
          setScrapedImages(row.images ?? []);
          // Prefer the scrape doc's own screenshot over the run screenshot
          const scrapedShot = row.screenshot?.trim() ?? "";
          const scrapedShotUrl = row.screenshotUrl?.trim() ?? "";
          const metaShot =
            scrapedShot.startsWith("data:") || scrapedShot.startsWith("http")
              ? scrapedShot
              : scrapedShot && API_BASE
                ? `${API_BASE}${scrapedShot.startsWith("/") ? "" : "/"}${scrapedShot}`
                : scrapedShotUrl.startsWith("http")
                  ? scrapedShotUrl
                  : scrapedShotUrl && API_BASE
                    ? `${API_BASE}${scrapedShotUrl.startsWith("/") ? "" : "/"}${scrapedShotUrl}`
                    : "";
          setScrapedMeta({
            description: row.description,
            h1: row.h1,
            canonical: row.canonical,
            screenshotSrc: metaShot || undefined,
          });
        }
      } catch {
        if (!cancelled) {
          setScrapedImages([]);
          setScrapedMeta({});
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [run.url]);


  // Fetch template design - try API first, then fall back to static fixture
  useEffect(() => {
    if (!useDynamicUITemplate) {
      setTemplateLoading(false);
      return;
    }

    let cancelled = false;

    // Try to load from fixture files (static assets) as fallback
    const loadFromFixture = async (): Promise<RunData | null> => {
      try {
        const fixturePaths: Record<string, string> = {
          "levainbakery-2": "/fixtures/stylemd/levainbakery-2-style.md",
          "levainbakery": "/fixtures/stylemd/levainbakery-2-style.md",
        };
        const fixturePath = fixturePaths[templateRunId] || fixturePaths["levainbakery-2"];
        
        console.log(`[TEMPLATE] Trying static fixture: ${fixturePath}`);
        
        const response = await fetch(fixturePath, { cache: "force-cache" });
        if (!response.ok) return null;
        
        const styleMd = await response.text();
        if (!styleMd.trim()) return null;
        
        return {
          url: "https://levainbakery.com/",
          slug: templateRunId,
          runId: `fixture-${templateRunId}`,
          styleMd,
          screenshot: "",
          provider: "kimi",
          model: "static-fixture",
          status: "completed",
          createdAt: new Date().toISOString(),
        };
      } catch {
        return null;
      }
    };

    (async () => {
      try {
        setTemplateLoading(true);
        
        console.log(`[TEMPLATE] Attempting to load template: ${templateRunId}`);
        
        // Try API first
        let templateRun: RunData | null = null;
        
        if (API_BASE) {
          try {
            console.log(`[TEMPLATE] Trying API: ${API_BASE}/api/stylemd/by-slug/${encodeURIComponent(templateRunId)}`);
            const apiResponse = await fetch(
              `${API_BASE}/api/stylemd/by-slug/${encodeURIComponent(templateRunId)}`
            );
            
            if (apiResponse.ok) {
              const json = (await apiResponse.json()) as { ok?: boolean; data?: RunData };
              if (json.ok && json.data) {
                templateRun = json.data;
                console.log(`[TEMPLATE] Found in database API`);
              }
            }
          } catch (apiErr) {
            console.log(`[TEMPLATE] API fetch failed:`, apiErr);
          }
        }

        // If not found in API, try static fixture
        if (!templateRun) {
          console.log(`[TEMPLATE] Not in DB, trying static fixture...`);
          templateRun = await loadFromFixture();
        }

        // If still no template, just skip template sidebar
        if (!templateRun) {
          console.log(`[TEMPLATE] No template found, displaying without template sidebar`);
          if (!cancelled) setTemplateLoading(false);
          return;
        }

        const parsedTemplate = extractStyleMdUi(templateRun.styleMd || "");
        
        if (!parsedTemplate.payload) {
          console.log(`[TEMPLATE] Could not parse style.md`);
          if (!cancelled) setTemplateLoading(false);
          return;
        }

        const card = styleMdUiPayloadToDesignCard(parsedTemplate.payload, {
          id: templateRunId,
          url: templateRun.url || "",
        });

        console.log(`[TEMPLATE] Loaded successfully: ${parsedTemplate.payload.brand || "Unknown"}`);
        
        if (!cancelled) {
          setTemplateDesign({ card, payload: parsedTemplate.payload });
          setTemplateLoading(false);
        }
      } catch (err) {
        console.error(`[TEMPLATE] Error:`, err);
        if (!cancelled) {
          setTemplateLoading(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [useDynamicUITemplate, templateRunId]);
  const st = String(run.status ?? "");

  const isTerminalStatus =
    st === "failed" ||
    st === "canceled" ||
    st === "completed" ||
    st === "completed_with_warnings";

  const showcaseUrl =
    isFixtureRunId(run.runId)
      ? ""
      : run.showcaseUrl ||
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

  // Render dynamic UI template if enabled and loaded
  if (useDynamicUITemplate && templateLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-page">
        <div className="flex flex-col items-center gap-4">
          <div
            className="h-8 w-8 animate-spin rounded-full border-2 border-t-transparent"
            style={{ borderColor: "var(--cta)", borderTopColor: "transparent" }}
          />
          <p className="text-sm text-secondary font-manrope">
            Loading dynamic UI template…
          </p>
        </div>
      </div>
    );
  }

  if (useDynamicUITemplate && templateDesign) {
    const { card: templateCard, payload: templatePayload } = templateDesign;
    return (
      <div className="flex min-h-screen flex-col bg-page">
        {/* Header with Back and Actions */}
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
          </div>
        </div>

        {/* Hero Section with Template Design */}
        <div className="bg-surface border-b border-medium">
          <div className="mx-auto max-w-7xl px-4 py-12 md:py-16">
            <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
              <div>
                <h1 className="text-3xl md:text-4xl font-black tracking-tight">
                  {parsedStyle.payload?.brand || host || "Generated Design"}
                </h1>
                {parsedStyle.payload?.description && (
                  <p className="mt-3 max-w-2xl text-base text-secondary leading-relaxed">
                    {parsedStyle.payload.description}
                  </p>
                )}
                {parsedStyle.payload?.tags?.length ? (
                  <div className="mt-6 flex flex-wrap gap-2">
                    {parsedStyle.payload.tags.map((tag) => {
                      const label = typeof tag === "string" ? tag : tag.label;
                      const accentColor = catalogCard?.accentColor ?? "#0a73eb";
                      return (
                        <span
                          key={label}
                          className="rounded-[16px] border px-3 py-1 text-xs font-medium"
                          style={{
                            borderColor: `${accentColor}55`,
                            color: accentColor,
                            backgroundColor: `${accentColor}14`,
                          }}
                        >
                          {label}
                        </span>
                      );
                    })}
                  </div>
                ) : null}
              </div>
              {catalogCard?.logo && (
                <div
                  className="flex h-32 w-32 flex-shrink-0 items-center justify-center rounded-[9px] text-lg font-black text-white overflow-hidden"
                  style={{ backgroundColor: catalogCard?.accentColor ?? "var(--cta)" }}
                >
                  {catalogCard.logo.startsWith("/") || /^https?:/i.test(catalogCard.logo) ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={catalogCard.logo} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <span className="text-5xl">{catalogCard.logo}</span>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Main Content with Template Design System on Side */}
        <div className="flex flex-1 flex-col lg:flex-row">
          {/* Template Design System Reference - Sidebar */}
          <aside className="hidden lg:flex lg:w-1/3 border-r border-medium overflow-y-auto bg-surface-soft flex-col">
            <div className="sticky top-0 bg-surface-soft border-b border-medium p-6">
              <h2 className="heading-h3 tracking-tight text-primary">
                {templatePayload?.brand || "Design System Reference"}
              </h2>
            </div>
            <div className="p-8 space-y-8 overflow-y-auto">
              <CatalogMainSections card={templateCard} extras={templatePayload} />
            </div>
          </aside>

          {/* Generated Page Content - Main */}
          <main className="flex-1 overflow-y-auto p-6 md:p-8 lg:p-12">
            <div className="space-y-8 max-w-4xl">
              {/* Style.md Display */}
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
                        <Code2 size={14} /> STYLE.md
                      </button>
                    </div>
                    <div
                      className="relative overflow-y-auto rounded-2xl border border-medium bg-transparent shadow-sm"
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
                    {!isGenerating && !run.styleMd?.trim() && (
                      <p className="text-sm text-secondary font-manrope">
                        No style.md was produced for this run
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

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
              description={scrapedMeta.description}
              h1={scrapedMeta.h1}
              canonical={scrapedMeta.canonical}
              screenshotSrc={scrapedMeta.screenshotSrc || screenshotSrc}
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
                  description={scrapedMeta.description}
                  h1={scrapedMeta.h1}
                  canonical={scrapedMeta.canonical}
                  screenshotSrc={scrapedMeta.screenshotSrc || screenshotSrc}
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
