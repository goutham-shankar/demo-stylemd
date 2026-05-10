"use client";

import { useState, useEffect, useCallback } from "react";
import { Search, Globe, AlertCircle, RefreshCw } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { API_BASE } from "@/lib/api-config";
import { useSSE } from "@/lib/sse-context";

type RunCard = {
  slug: string;
  runId: string;
  url: string;
  title?: string;
  screenshot?: string;
  brandAssets?: {
    logo?: string;
    favicon?: string;
    appleIcon?: string;
    ogImage?: string;
  };
  status: string;
  createdAt: string;
};

function cleanHostname(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

function brandColor(url: string): string {
  const palette = [
    "#635bff", "#0d9488", "#2563eb", "#7c3aed",
    "#d97706", "#059669", "#dc2626", "#0891b2",
  ];
  const idx = url.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0) % palette.length;
  return palette[idx];
}

function CardThumbnail({ run }: { run: RunCard }) {
  const screenshot = run.screenshot;
  const ogImage = run.brandAssets?.ogImage;
  const logo = run.brandAssets?.logo || run.brandAssets?.favicon || run.brandAssets?.appleIcon;
  const name = run.title || cleanHostname(run.url);
  const preview = screenshot || ogImage;
  const bg = brandColor(run.url);

  if (preview) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={preview}
        alt={name}
        className="w-full h-full object-cover object-top"
        loading="lazy"
      />
    );
  }

  return (
    <div
      className="w-full h-full flex flex-col items-center justify-center gap-3"
      style={{ backgroundColor: bg }}
    >
      {logo ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={logo}
          alt={name}
          className="w-12 h-12 object-contain rounded-xl"
          loading="lazy"
        />
      ) : (
        <span className="text-5xl font-black text-white/90">
          {name.charAt(0).toUpperCase()}
        </span>
      )}
      <span className="text-white/80 text-sm font-semibold px-4 text-center line-clamp-1">
        {cleanHostname(run.url)}
      </span>
    </div>
  );
}

export default function StyleLibrary() {
  const [runs, setRuns] = useState<RunCard[]>([]);
  const [loading, setLoading] = useState(true);
  const { isRunning, activeRun } = useSSE();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  const fetchRuns = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      if (!API_BASE) throw new Error("API not configured");
      const res = await fetch(`${API_BASE}/api/stylemd/runs`);
      if (!res.ok) throw new Error(`Server error ${res.status}`);
      const data = await res.json();
      const list: Record<string, unknown>[] = Array.isArray(data.summaries)
        ? data.summaries
        : Array.isArray(data.data)
        ? data.data
        : [];

      const cards: RunCard[] = list
        .filter((r) => {
          const st = String(r.status ?? "");
          return st === "completed" || st === "completed_with_warnings";
        })
        .map((r) => ({
          slug: String(r.slug ?? r.runId ?? r.id ?? ""),
          runId: String(r.runId ?? r.id ?? r._id ?? ""),
          url: String(r.url ?? ""),
          title: r.title ? String(r.title) : undefined,
          screenshot: r.screenshot ? String(r.screenshot) : undefined,
          brandAssets: r.brandAssets as RunCard["brandAssets"],
          status: String(r.status ?? ""),
          createdAt: String(r.createdAt ?? ""),
        }));

      setRuns(cards);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRuns();
  }, [fetchRuns]);

  const filtered = runs.filter((run) => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const host = cleanHostname(run.url).toLowerCase();
      const title = (run.title ?? "").toLowerCase();
      if (!host.includes(q) && !title.includes(q)) return false;
    }
    if (activeTab === "recent") {
      const age = Date.now() - new Date(run.createdAt).getTime();
      return age < 7 * 24 * 60 * 60 * 1000;
    }
    return true;
  });

  return (
    <section className="py-12 md:py-16 bg-page">
      <div className="container-custom max-w-6xl mx-auto px-6">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 mb-8">
          <div>
            <p className="text-[10px] font-bold text-secondary uppercase tracking-[0.2em] mb-1 font-manrope">
              Reference Library
            </p>
            <h2 className="heading-h2 text-primary">Style Library</h2>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative w-full md:w-72">
              <Search className="absolute left-4 top-3 text-secondary" size={18} aria-hidden />
              <input
                type="search"
                aria-label="Search styles"
                placeholder="Search by domain…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 bg-surface border border-medium rounded-[10px] text-sm placeholder-secondary focus:outline-none focus-visible:ring-2 focus-visible:ring-light"
              />
            </div>
            <button
              type="button"
              onClick={fetchRuns}
              disabled={loading}
              aria-label="Refresh"
              className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-[10px] border border-medium bg-surface hover:bg-surface-soft transition-colors disabled:opacity-50"
            >
              <RefreshCw size={16} className={`text-secondary ${loading ? "animate-spin" : ""}`} />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-2 bg-surface border border-medium rounded-[12px] p-1 w-fit mb-8">
          {["All", "Recent"].map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab.toLowerCase())}
              aria-pressed={activeTab === tab.toLowerCase()}
              className={`px-5 py-1.5 rounded-[12px] text-sm font-semibold transition-all duration-150 ${
                activeTab === tab.toLowerCase()
                  ? "bg-cta text-white"
                  : "text-muted hover:bg-[#f7f4ee]"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Loading skeleton */}
        {loading && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="overflow-hidden border border-light bg-surface rounded-[16px] animate-pulse"
              >
                <div className="h-48 bg-surface-soft" />
                <div className="px-5 py-4 flex items-center justify-between gap-4">
                  <div className="h-4 w-32 bg-surface-soft rounded" />
                  <div className="h-9 w-24 bg-surface-soft rounded-[10px]" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="flex flex-col items-center justify-center py-20 text-center gap-4">
            <AlertCircle size={36} className="text-red-400" />
            <p className="text-base font-semibold text-primary">Couldn&apos;t load styles</p>
            <p className="text-sm text-secondary max-w-sm">{error}</p>
            <button
              type="button"
              onClick={fetchRuns}
              className="px-5 py-2 bg-cta text-white text-sm font-semibold rounded-[10px] hover:opacity-90 transition-all"
            >
              Try again
            </button>
          </div>
        )}

        {/* Empty */}
        {!loading && !error && filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center gap-3">
            <Globe size={36} className="text-secondary opacity-40" />
            <p className="text-base font-semibold text-primary">
              {runs.length === 0 ? "No completed runs yet" : "No results found"}
            </p>
            <p className="text-sm text-secondary">
              {runs.length === 0
                ? "Generate your first design system from the home page."
                : "Try a different search term."}
            </p>
            {runs.length === 0 && (
              <Link
                href="/#generate"
                className="mt-2 px-5 py-2 bg-cta text-white text-sm font-semibold rounded-[10px] hover:opacity-90 transition-all"
              >
                Generate now →
              </Link>
            )}
          </div>
        )}

        {/* Grid */}
        {!loading && !error && (isRunning || filtered.length > 0) && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* In-progress run — shown first */}
            {isRunning && activeRun && (
              <button
                type="button"
                onClick={() => router.push("/generate")}
                className="group text-left block overflow-hidden border-2 border-orange-300 bg-white shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
                style={{ borderRadius: 16 }}
              >
                <div className="relative h-48 bg-gradient-to-br from-orange-50 to-orange-100 flex flex-col items-center justify-center gap-3 overflow-hidden">
                  <div
                    className="absolute inset-0 -translate-x-full"
                    style={{
                      background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent)",
                      animation: "shimmer 1.8s infinite",
                    }}
                  />
                  <style>{`@keyframes shimmer { to { transform: translateX(200%) } }`}</style>
                  <div className="relative flex h-3 w-3">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-orange-400 opacity-75" />
                    <span className="relative inline-flex h-3 w-3 rounded-full bg-orange-500" />
                  </div>
                  <p className="text-orange-500 text-xs font-bold uppercase tracking-widest">Generating</p>
                  <p className="text-orange-400 text-sm font-semibold truncate px-6 max-w-full">
                    {activeRun.url}
                  </p>
                </div>
                <div className="px-5 py-4 flex items-center justify-between bg-white gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <div className="relative flex h-2 w-2 flex-shrink-0">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-orange-400 opacity-75" />
                        <span className="relative inline-flex h-2 w-2 rounded-full bg-orange-500" />
                      </div>
                      <h3 className="text-base font-bold text-gray-900 truncate">
                        {(() => { try { return new URL(activeRun.url).hostname.replace(/^www\./, ""); } catch { return activeRun.url; } })()}
                      </h3>
                    </div>
                    <p className="text-xs text-orange-400 font-medium font-manrope">
                      {activeRun.logs?.length
                        ? activeRun.logs[activeRun.logs.length - 1]?.message
                        : "Starting up…"}
                    </p>
                  </div>
                  <span className="flex-shrink-0 flex items-center gap-1.5 px-4 py-2 bg-orange-500 text-white rounded-[10px] font-semibold text-sm whitespace-nowrap">
                    <RefreshCw size={12} className="animate-spin" />
                    Live
                  </span>
                </div>
              </button>
            )}
            {filtered.map((run) => (
              <Link
                key={run.slug || run.runId}
                href={`/styles/${encodeURIComponent(run.slug || run.runId)}`}
                className="group block overflow-hidden border border-light bg-white shadow-sm hover:border-dark hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2"
                style={{ borderRadius: 16 }}
              >
                <div className="relative h-48 overflow-hidden">
                  <CardThumbnail run={run} />
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 backdrop-blur-[2px]">
                    <Globe size={20} className="text-white/80" />
                    <span className="text-white text-xs font-medium px-4 text-center break-all line-clamp-2">
                      {run.url}
                    </span>
                    <span className="mt-1 px-3 py-1 bg-white/20 border border-white/30 rounded-full text-white text-xs font-semibold backdrop-blur-sm">
                      View Style Guide →
                    </span>
                  </div>
                </div>
                <div className="px-5 py-4 flex items-center justify-between bg-white gap-3">
                  <div className="min-w-0">
                    <h3 className="text-base font-bold text-primary truncate group-hover:text-cta transition-colors duration-150">
                      {run.title || cleanHostname(run.url)}
                    </h3>
                    <p className="text-xs text-secondary font-manrope truncate">
                      {cleanHostname(run.url)}
                    </p>
                  </div>
                  <span className="flex-shrink-0 px-4 py-2 bg-cta text-white rounded-[10px] font-semibold text-sm shadow-sm group-hover:shadow-md group-hover:opacity-90 transition-all duration-150 whitespace-nowrap">
                    View →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Count + see all link */}
        {!loading && !error && runs.length > 0 && (
          <div className="mt-8 flex items-center justify-between">
            <p className="text-xs text-secondary font-manrope">
              {filtered.length} of {runs.length} design system{runs.length !== 1 ? "s" : ""}
            </p>
            <Link
              href="/styles"
              className="text-sm font-semibold text-cta hover:opacity-80 transition-opacity"
            >
              View all →
            </Link>
          </div>
        )}

      </div>
    </section>
  );
}
