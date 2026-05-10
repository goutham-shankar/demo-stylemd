"use client";

import { useSSE } from "@/lib/sse-context";
import { usePathname, useRouter } from "next/navigation";
import { RefreshCw, X } from "lucide-react";
import { useState, useMemo, useEffect } from "react";

function cleanHostname(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

export default function ActiveRunCard() {
  const { isRunning, activeRun, runs } = useSSE();
  const pathname = usePathname();
  const router = useRouter();
  const [dismissed, setDismissed] = useState(false);
  const [visible, setVisible] = useState(false);

  // If SSE isn't tracking a run, fall back to the first API-reported running run
  const apiRunningRun = useMemo(() => {
    if (isRunning && activeRun) return null;
    return runs.find((r) => r.status === "running") ?? null;
  }, [isRunning, activeRun, runs]);

  const effectiveRunId = activeRun?.runId ?? apiRunningRun?.id ?? null;

  // Reset dismiss when a new run starts; fade in
  useEffect(() => {
    if (effectiveRunId) {
      setDismissed(false);
      const t = setTimeout(() => setVisible(true), 50);
      return () => clearTimeout(t);
    } else {
      setVisible(false);
    }
  }, [effectiveRunId]);

  const completedStages = useMemo(() => {
    if (!activeRun?.stages) return 0;
    return Object.values(activeRun.stages).filter((s) => s.status === "completed").length;
  }, [activeRun?.stages]);

  const totalStages = useMemo(() => {
    if (!activeRun?.stages) return 0;
    return Object.keys(activeRun.stages).length;
  }, [activeRun?.stages]);

  const latestLog = useMemo(() => {
    if (!activeRun?.logs?.length) return null;
    return activeRun.logs[activeRun.logs.length - 1];
  }, [activeRun?.logs]);

  const showCard = (isRunning && activeRun) || apiRunningRun;
  if (!showCard || dismissed) return null;
  // Don't show on /generate — PipelineView already covers it
  if (pathname?.startsWith("/generate")) return null;

  const displayUrl = activeRun?.url ?? apiRunningRun?.url ?? "";
  const hostname = cleanHostname(displayUrl);
  const progress = totalStages > 0 ? Math.round((completedStages / totalStages) * 100) : 0;
  const navigateTo = apiRunningRun && !activeRun
    ? `/generate?run=${encodeURIComponent(apiRunningRun.slug || apiRunningRun.id)}`
    : "/generate";

  return (
    <div
      className="fixed bottom-6 right-6 z-50 w-72 rounded-2xl border border-orange-200 bg-white shadow-xl shadow-black/10 overflow-hidden"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(16px)",
        transition: "opacity 0.25s ease, transform 0.25s ease",
      }}
    >
      {/* Progress bar */}
      <div className="h-1 bg-orange-100">
        <div
          className="h-full bg-orange-400 transition-all duration-700"
          style={{ width: totalStages > 0 ? `${progress}%` : "25%" }}
        />
      </div>

      <div className="p-4">
        {/* Header row */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            {/* Pulsing orange dot */}
            <div className="relative flex h-2.5 w-2.5 flex-shrink-0">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-orange-400 opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-orange-500" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-orange-500">
              Generating
            </span>
          </div>
          <button
            type="button"
            onClick={() => setDismissed(true)}
            className="text-gray-300 hover:text-gray-500 transition-colors"
            aria-label="Dismiss"
          >
            <X size={14} />
          </button>
        </div>

        {/* Site info */}
        <p className="text-sm font-bold text-gray-900 truncate mb-0.5">{hostname}</p>
        <p className="text-[11px] text-gray-400 truncate mb-3">{displayUrl}</p>

        {/* Stage progress */}
        {totalStages > 0 && (
          <p className="text-[11px] font-medium text-gray-500 mb-2">
            {completedStages} of {totalStages} stages complete
          </p>
        )}

        {/* Latest log */}
        {latestLog?.message && (
          <p className="text-[11px] text-gray-400 italic truncate mb-3">
            {latestLog.message}
          </p>
        )}

        {/* CTA */}
        <button
          type="button"
          onClick={() => router.push(navigateTo)}
          className="w-full flex items-center justify-center gap-2 rounded-xl bg-orange-50 border border-orange-200 px-3 py-2 text-xs font-semibold text-orange-600 hover:bg-orange-100 transition-colors"
        >
          <RefreshCw size={12} className="animate-spin" />
          View live progress
        </button>
      </div>
    </div>
  );
}
