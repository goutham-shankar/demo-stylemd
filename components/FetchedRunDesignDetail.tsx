import { useEffect, useMemo, useState, useRef } from "react";
import {
  ArrowLeft,
  Copy,
  Download,
  Monitor,
  Code2,
  Check,
} from "lucide-react";
import type { RunData } from "@/lib/api-types";
import { API_BASE } from "@/lib/api-config";
import { parseStyleMd, mapToDesignCard } from "@/lib/stylemd-parser";
import type { DesignCard } from "@/lib/design-cards";
import DesignDetailPage from "@/components/DesignDetailPage";

function hostnameFromUrl(url?: string): string {
  if (!url) return "";
  try {
    return new URL(url).hostname;
  } catch {
    return String(url);
  }
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
  const [copied, setCopied] = useState(false);
  const [scrapeError, setScrapeError] = useState<string | null>(null);
  const [fetchedRun, setFetchedRun] = useState<RunData | null>(null);

  // Use the richer fetched record when available, fall back to the prop
  const effectiveRun = fetchedRun ?? run;

  const st = String(effectiveRun.status ?? "");
  const isCompleted = st === "completed" || st === "completed_with_warnings";
  const isTerminalStatus =
    st === "failed" ||
    st === "canceled" ||
    isCompleted;

  const parsed = useMemo(() => {
    if (!effectiveRun.styleMd?.trim()) return null;
    return parseStyleMd(effectiveRun.styleMd);
  }, [effectiveRun.styleMd]);

  const card: DesignCard | null = useMemo(() => {
    if (!parsed) return null;
    return mapToDesignCard(
      parsed,
      effectiveRun.slug || effectiveRun.runId,
      effectiveRun.url,
      effectiveRun.brandAssets?.logo,
      effectiveRun.screenshot || null
    );
  }, [parsed, effectiveRun.slug, effectiveRun.runId, effectiveRun.url, effectiveRun.brandAssets?.logo, effectiveRun.screenshot]);

  const hasFetchedRef = useRef(false);

  useEffect(() => {
    if (!API_BASE || (!run.slug && !run.runId) || run.styleMd) {
      return;
    }

    if (hasFetchedRef.current) return;
    hasFetchedRef.current = true;

    let cancelled = false;
    const identifier = run.slug || run.runId;

    (async () => {
      try {
        const res = await fetch(`${API_BASE}/api/stylemd/by-slug/${encodeURIComponent(identifier)}`);
        const j = (await res.json()) as {
          ok?: boolean;
          data?: RunData;
          error?: string;
        };

        if (cancelled) return;

        if (!j.ok || !j.data) {
          setScrapeError(j.error || "Failed to fetch run data");
          return;
        }
        setFetchedRun(j.data);
        setScrapeError(null);
      } catch (err) {
        if (!cancelled) {
          setScrapeError(err instanceof Error ? err.message : "Network error");
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [run.slug, run.runId, run.styleMd]);

  if (isCompleted && card && effectiveRun.styleMd) {
    return <DesignDetailPage card={card} styleMd={effectiveRun.styleMd} />;
  }

  const handleCopy = async () => {
    if (!effectiveRun.styleMd?.trim()) return;
    try {
      await navigator.clipboard.writeText(effectiveRun.styleMd);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const el = document.createElement("textarea");
      el.value = effectiveRun.styleMd;
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
    const blob = new Blob([effectiveRun.styleMd || ""], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${effectiveRun.slug || "stylemd"}-style.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const host = hostnameFromUrl(effectiveRun.url ?? effectiveRun.slug ?? effectiveRun.runId ?? "");

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
            disabled={!effectiveRun.styleMd?.trim()}
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

      <div className="flex flex-1 flex-col items-center justify-center p-8 text-center">
        {isGenerating ? (
          <div className="flex flex-col items-center gap-4">
            <div
              className="h-12 w-12 animate-spin rounded-full border-4 border-t-transparent"
              style={{ borderColor: "var(--cta)", borderTopColor: "transparent" }}
            />
            <h2 className="text-xl font-bold text-primary">Generating your design system...</h2>
            <p className="max-w-md text-secondary">
              We're analyzing the website and crafting a custom style guide. This usually takes 1-2 minutes.
            </p>
          </div>
        ) : (
          <div className="max-w-2xl">
            <h2 className="mb-4 text-2xl font-bold text-primary">
              {st === "failed" ? "Generation Failed" : st === "canceled" ? "Generation Canceled" : "Design System Ready"}
            </h2>
            {scrapeError ? (
              <p className="mb-6 text-red-500">{scrapeError}</p>
            ) : !effectiveRun.styleMd?.trim() && isTerminalStatus ? (
              <p className="mb-6 text-secondary">No style.md was produced for this run.</p>
            ) : null}

            <div className="rounded-2xl border border-medium bg-surface p-6 text-left">
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-secondary">
                Raw style.md preview
              </h3>
              <pre className="max-h-[400px] overflow-auto rounded-xl bg-[#1a1a1a] p-5 font-mono text-xs leading-relaxed text-gray-100">
                {effectiveRun.styleMd || (isGenerating ? "Generating..." : "No content available")}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
