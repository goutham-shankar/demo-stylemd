"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Search, RefreshCw, Globe, AlertCircle, ChevronLeft, ChevronRight } from "lucide-react";
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

// Module-level cache: slug → screenshot src (string) or false (not found)
const screenshotCache = new Map<string, string | false>();

function CardThumbnail({ run }: { run: RunCard }) {
  const ogImage = run.brandAssets?.ogImage;
  const logo = run.brandAssets?.logo || run.brandAssets?.favicon || run.brandAssets?.appleIcon;
  const name = run.title || cleanHostname(run.url);
  const bg = brandColor(run.url);
  const slug = run.slug || run.runId;

  // Immediate preview from list data (only if the large base64 screenshot is present in list payload)
  const immediatePreview = run.screenshot;

  // null = still fetching, string = found, false = nothing to show
  const [lazyPreview, setLazyPreview] = useState<string | null | false>(() => {
    if (immediatePreview) return false; // don't need lazy load
    if (!slug) return false;
    const cached = screenshotCache.get(slug);
    return cached !== undefined ? cached : null;
  });

  // Image error state for when the src loads but the img fails to render
  const [imgFailed, setImgFailed] = useState(false);
  const [scrollAmount, setScrollAmount] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [shouldLoad, setShouldLoad] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  const calculateScroll = () => {
    if (imgRef.current && containerRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect();
      const img = imgRef.current;
      if (img.naturalWidth > 0 && containerRect.width > 0) {
        const aspect = img.naturalHeight / img.naturalWidth;
        const renderedHeight = containerRect.width * aspect;
        const targetScroll = renderedHeight - containerRect.height;
        if (targetScroll > 10) {
          setScrollAmount(targetScroll);
        } else {
          setScrollAmount(0);
        }
      }
    }
  };

  useEffect(() => {
    window.addEventListener("resize", calculateScroll);
    return () => window.removeEventListener("resize", calculateScroll);
  }, []);

  // Set up intersection observer to only load detailed data when card is visible or hovered
  useEffect(() => {
    if (immediatePreview || !slug || !API_BASE) return;
    if (shouldLoad) return;

    if (isHovered) {
      setShouldLoad(true);
      return;
    }

    if (typeof window !== "undefined" && "IntersectionObserver" in window && containerRef.current) {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setShouldLoad(true);
            observer.disconnect();
          }
        },
        { rootMargin: "100px" }
      );
      observer.observe(containerRef.current);
      return () => observer.disconnect();
    } else {
      setShouldLoad(true);
    }
  }, [immediatePreview, slug, isHovered, shouldLoad]);

  useEffect(() => {
    if (!shouldLoad || immediatePreview || !slug || !API_BASE) return;
    if (screenshotCache.has(slug)) {
      setLazyPreview(screenshotCache.get(slug)!);
      return;
    }

    let cancelled = false;
    fetch(`${API_BASE}/api/stylemd/by-slug/${encodeURIComponent(slug)}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((json) => {
        if (cancelled) return;
        const data = json?.data;
        const found: string | false = data?.screenshot || data?.brandAssets?.ogImage || false;
        screenshotCache.set(slug, found);
        setLazyPreview(found);
      })
      .catch(() => {
        if (!cancelled) {
          screenshotCache.set(slug, false);
          setLazyPreview(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [shouldLoad, immediatePreview, slug]);

  const displaySrc = immediatePreview || (typeof lazyPreview === "string" ? lazyPreview : null);

  // Skeleton while lazy-fetching
  if (!immediatePreview && lazyPreview === null) {
    return <div ref={containerRef} className="w-full h-full bg-gray-100 animate-pulse" />;
  }

  if (displaySrc && !imgFailed) {
    const duration = Math.max(3, Math.min(10, scrollAmount / 180)); // speed of 180px per second, clamped between 3s and 10s
    return (
      <div
        ref={containerRef}
        className="relative w-full h-full overflow-hidden"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          borderRadius: "inherit",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          ref={imgRef}
          src={displaySrc}
          alt={name}
          onLoad={calculateScroll}
          className="absolute top-0 left-0 w-full h-auto object-cover object-top transition-transform ease-in-out"
          style={{
            transform: isHovered && scrollAmount > 0 ? `translateY(-${scrollAmount}px)` : "translateY(0)",
            transitionDuration: isHovered ? `${duration}s` : "0.7s",
          }}
          loading="lazy"
          onError={() => setImgFailed(true)}
        />
      </div>
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

export default function RunsLibrary() {
  const [runs, setRuns] = useState<RunCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const { isRunning, activeRun } = useSSE();
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 9;
  const isFirstRender = useRef(true);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, activeTab]);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    const element = document.getElementById("library-section");
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [currentPage]);

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
        : Array.isArray(data.runs)
        ? data.runs
        : Array.isArray(data)
        ? data
        : [];

      const cards: RunCard[] = list
        .filter((r) => {
          const st = String(r.status ?? "");
          return st === "completed" || st === "completed_with_warnings" || st === "running";
        })
        .map((r) => ({
          slug: String(r.slug ?? r.runId ?? r.id ?? ""),
          runId: String(r.runId ?? r.id ?? r._id ?? ""),
          url: String(r.url ?? ""),
          title: r.title ? String(r.title) : undefined,
          // Don't rely on screenshot being in the list response — CardThumbnail lazy-loads it
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
    // Don't show a duplicate card for the run already tracked by SSE
    if (isRunning && activeRun && run.runId === activeRun.runId) return false;

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

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginatedRuns = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <section id="library-section" className="py-12 md:py-16 bg-page">
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
        <div className="flex items-center gap-2 bg-surface border border-medium rounded-[14px] p-1 w-fit mb-8">
          {["All", "Recent"].map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab.toLowerCase())}
              aria-pressed={activeTab === tab.toLowerCase()}
              className={`px-5 py-1.5 rounded-[10px] text-sm font-semibold transition-all duration-150 cursor-pointer ${
                activeTab === tab.toLowerCase()
                  ? "bg-cta text-white shadow-sm"
                  : "text-muted hover:bg-gray-100/50 hover:text-primary"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Loading */}
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
        {!loading && !error && !isRunning && filtered.length === 0 && (
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
                href="/"
                className="mt-2 px-5 py-2 bg-cta text-white text-sm font-semibold rounded-[10px] hover:opacity-90 transition-all"
              >
                Generate now →
              </Link>
            )}
          </div>
        )}

        {/* Shimmer animation shared by running cards */}
        {(isRunning || filtered.some((r) => r.status === "running")) && (
          <style>{`@keyframes shimmer { to { transform: translateX(200%) } }`}</style>
        )}

        {/* Grid */}
        {!loading && !error && (isRunning || filtered.length > 0) && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* In-progress run card tracked by SSE — always first */}
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
                  <div className="relative flex h-3 w-3">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-orange-400 opacity-75" />
                    <span className="relative inline-flex h-3 w-3 rounded-full bg-orange-500" />
                  </div>
                  <p className="text-orange-500 text-xs font-bold uppercase tracking-widest">Generating</p>
                  <p className="text-orange-400 text-sm font-semibold truncate px-6 max-w-full">
                    {cleanHostname(activeRun.url)}
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
                        {cleanHostname(activeRun.url)}
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
            {paginatedRuns.map((run) => {
              // Running API runs (not tracked by SSE) get the animated card
              if (run.status === "running") {
                return (
                  <button
                    key={run.slug || run.runId}
                    type="button"
                    onClick={() => router.push(`/generate?run=${encodeURIComponent(run.slug || run.runId)}`)}
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
                      <div className="relative flex h-3 w-3">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-orange-400 opacity-75" />
                        <span className="relative inline-flex h-3 w-3 rounded-full bg-orange-500" />
                      </div>
                      <p className="text-orange-500 text-xs font-bold uppercase tracking-widest">Generating</p>
                      <p className="text-orange-400 text-sm font-semibold truncate px-6 max-w-full">
                        {run.title || cleanHostname(run.url)}
                      </p>
                    </div>
                    <div className="px-5 py-4 flex items-center justify-between bg-white gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        {run.brandAssets?.appleIcon ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={run.brandAssets.appleIcon}
                            alt=""
                            className="w-8 h-8 rounded-lg object-contain border border-medium shadow-sm flex-shrink-0"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-lg bg-[#f9fafb] flex items-center justify-center text-[#4b5563] font-bold text-xs uppercase flex-shrink-0 border border-gray-200">
                            {cleanHostname(run.url).slice(0, 2).toUpperCase() || "??"}
                          </div>
                        )}
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <div className="relative flex h-2 w-2 flex-shrink-0">
                              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-orange-400 opacity-75" />
                              <span className="relative inline-flex h-2 w-2 rounded-full bg-orange-500" />
                            </div>
                            <h3 className="text-base font-bold text-gray-900 truncate">
                              {run.title || cleanHostname(run.url)}
                            </h3>
                          </div>
                          <p className="text-xs text-orange-400 font-medium font-manrope">Running…</p>
                        </div>
                      </div>
                      <span className="flex-shrink-0 flex items-center gap-1.5 px-4 py-2 bg-orange-500 text-white rounded-[10px] font-semibold text-sm whitespace-nowrap">
                        <RefreshCw size={12} className="animate-spin" />
                        Live
                      </span>
                    </div>
                  </button>
                );
              }

              return (
                <Link
                  key={run.slug || run.runId}
                  href={`/styles/${encodeURIComponent(run.slug || run.runId)}`}
                  prefetch={false}
                  className="group block overflow-hidden border border-light bg-white shadow-sm hover:border-dark hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2"
                  style={{ borderRadius: 16 }}
                >
                  {/* Thumbnail with URL overlay on hover */}
                  <div className="relative h-48 overflow-hidden">
                    <CardThumbnail run={run} />
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 backdrop-blur-[2px] pointer-events-none">
                      <Globe size={20} className="text-white/80" />
                      <span className="text-white text-xs font-medium px-4 text-center break-all line-clamp-2">
                        {run.url}
                      </span>
                      <span className="mt-1 px-3 py-1 bg-white/20 border border-white/30 rounded-full text-white text-xs font-semibold backdrop-blur-sm">
                        View Style Guide →
                      </span>
                    </div>
                  </div>
                  {/* Card footer */}
                  <div className="px-5 py-4 flex items-center justify-between bg-white gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      {run.brandAssets?.appleIcon ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={run.brandAssets.appleIcon}
                          alt=""
                          className="w-8 h-8 rounded-lg object-contain border border-medium shadow-sm flex-shrink-0"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-lg bg-[#f9fafb] flex items-center justify-center text-[#4b5563] font-bold text-xs uppercase flex-shrink-0 border border-gray-200">
                          {cleanHostname(run.url).slice(0, 2).toUpperCase() || "??"}
                        </div>
                      )}
                      <div className="min-w-0">
                        <h3 className="text-base font-bold text-primary truncate group-hover:text-cta transition-colors duration-150">
                          {run.title || cleanHostname(run.url)}
                        </h3>
                        <p className="text-xs text-secondary font-manrope truncate">
                          {cleanHostname(run.url)}
                        </p>
                      </div>
                    </div>
                    <span className="flex-shrink-0 px-4 py-2 bg-cta text-white rounded-[10px] font-semibold text-sm shadow-sm group-hover:shadow-md group-hover:opacity-90 transition-all duration-150 whitespace-nowrap">
                      View →
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {/* Pagination Controls */}
        {!loading && !error && totalPages > 1 && (
          <div className="mt-16 flex flex-col sm:flex-row items-center justify-between gap-6">
            <p className="text-xs font-semibold text-secondary font-manrope tracking-wider uppercase">
              Showing <span className="text-primary font-bold">{Math.min(filtered.length, (currentPage - 1) * ITEMS_PER_PAGE + 1)}</span> – <span className="text-primary font-bold">{Math.min(filtered.length, currentPage * ITEMS_PER_PAGE)}</span> of <span className="text-primary font-bold">{filtered.length}</span> styles
            </p>
            
            <div className="inline-flex items-center gap-1 bg-white border border-light p-1.5 rounded-[12px] shadow-[0_4px_20px_rgba(0,0,0,0.03)] backdrop-blur-sm">
              {/* Previous Page */}
              <button
                type="button"
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="flex h-9 w-9 items-center justify-center rounded-[10px] text-secondary hover:text-primary hover:bg-gray-50/80 disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-secondary transition-all cursor-pointer disabled:cursor-not-allowed"
                aria-label="Previous Page"
              >
                <ChevronLeft size={16} strokeWidth={2.5} />
              </button>

              {/* Page Numbers */}
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }).map((_, idx) => {
                  const pageNum = idx + 1;
                  const isActive = pageNum === currentPage;
                  return (
                    <button
                      key={pageNum}
                      type="button"
                      onClick={() => setCurrentPage(pageNum)}
                      className={`flex h-9 min-w-[36px] px-2 items-center justify-center text-xs font-bold rounded-[10px] transition-all cursor-pointer hover:scale-105 active:scale-95 duration-200 ${
                        isActive
                          ? "bg-cta text-white shadow-md shadow-cta/15"
                          : "bg-transparent text-secondary hover:text-primary hover:bg-gray-50/80"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              {/* Next Page */}
              <button
                type="button"
                onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="flex h-9 w-9 items-center justify-center rounded-[10px] text-secondary hover:text-primary hover:bg-gray-50/80 disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-secondary transition-all cursor-pointer disabled:cursor-not-allowed"
                aria-label="Next Page"
              >
                <ChevronRight size={16} strokeWidth={2.5} />
              </button>
            </div>
          </div>
        )}

        {/* Count fallback if only 1 page */}
        {!loading && !error && runs.length > 0 && totalPages <= 1 && (
          <p className="mt-8 text-center text-xs text-secondary font-manrope">
            {filtered.length} of {runs.length} design system{runs.length !== 1 ? "s" : ""}
          </p>
        )}

      </div>
    </section>
  );
}
