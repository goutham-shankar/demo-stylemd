"use client";

import { useSSE } from "@/lib/sse-context";
import { usePathname, useRouter } from "next/navigation";
import { RefreshCw, X } from "lucide-react";
import { useState, useMemo } from "react";

function cleanHostname(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

export default function ActiveRunCard() {
  const { isRunning, activeRun } = useSSE();
  const pathname = usePathname();
  const router = useRouter();
  const [dismissed, setDismissed] = useState(false);

  // Reset dismissed state when a new run starts
  const runId = activeRun?.runId;
  const [lastRunId, setLastRunId] = useState<string | null>(null);
  if (runId && runId !== lastRunId) {
    setLastRunId(runId);
    setDismissed(false);
  }

  const completedStages = useMemo(() => {
    if (!activeRun?.stages) return 0;
    return Object.values(activeRun.stages).filter(
      (s) => s.status === "completed"
    ).length;
  }, [activeRun?.stages]);

  const totalStages = useMemo(() => {
    if (!activeRun?.stages) return 0;
    return Object.keys(activeRun.stages).length;
  }, [activeRun?.stages]);

  const latestLog = useMemo(() => {
    if (!activeRun?.logs?.length) return null;
    return activeRun.logs[activeRun.logs.length - 1];
  }, [activeRun?.logs]);

  // Only show when a run is in progress
  if (!isRunning || !activeRun) return null;
  // Don't show on /generate — PipelineView is already there
  if (pathname?.startsWith("/generate")) return null;
  if (dismissed) return null;

  const hostname = cleanHostname(activeRun.url);
  const progress = totalStages > 0 ? Math.round((completedStages / totalStages) * 100) : 0;

  return (
    <div className="fixed bottom-6 right-6 z-50 w-72 rounded-2xl border border-orange-200 bg-white shadow-xl shadow-black/10 overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
      {/* Progress bar */}
      <div className="h-1 bg-orange-100">
        <div
          className="h-full bg-orange-400 transition-all duration-500"
          style={{ width: totalStages > 0 ? `${progress}%` : "30%", animation: totalStages === 0 ? "pulse 1.5s ease-in-out infinite" : undefined }}
        />
      </div>

      <div className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex items-center gap-2 min-w-0">
            {/* Pulsing orange dot */}
            <div className="relative flex-shrink-0 flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-orange-400 opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-orange-500" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-orange-500">
              Generating
            </span>
          </div>
          <button
            onClick={() => setDismissed(true)}
            className="flex-shrink-0 text-gray-300 hover:text-gray-500 transition-colors"
            aria-label="Dismiss"
            type="button"
          >
            <X size={14} />
          </button>
        </div>

        {/* Site name */}
        <p className="text-sm font-bold text-gray-900 truncate mb-0.5">{hostname}</p>
        <p className="text-[11px] text-gray-400 truncate mb-3">{activeRun.url}</p>

        {/* Stage progress */}
        {totalStages > 0 && (
          <p className="text-[11px] text-gray-500 mb-3 font-medium">
            {completedStages} of {totalStages} stages complete
          </p>
        )}

        {/* Latest log */}
        {latestLog?.message && (
          <p className="text-[11px] text-gray-400 truncate mb-3 italic">
            {latestLog.message}
          </p>
        )}

        {/* View progress button */}
        <button
          type="button"
          onClick={() => router.push("/generate")}
          className="w-full flex items-center justify-center gap-2 rounded-xl bg-orange-50 border border-orange-200 px-3 py-2 text-xs font-semibold text-orange-600 hover:bg-orange-100 transition-colors"
        >
          <RefreshCw size={12} className="animate-spin" />
          View live progress
        </button>
      </div>
    </div>
  );
}
