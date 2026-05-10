"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { STAGES, type Stage } from "@/lib/api-types";
import { useSSE } from "@/lib/sse-context";

const STAGE_LABELS: Record<Stage, string> = {
  capture: "Capture",
  extract: "Extract",
  dedup: "Dedup",
  curate: "Curate",
  responsive: "Responsive",
  styleguide: "Style Guide",
  showcase: "Showcase",
};

const STAGE_ICONS: Record<Stage, string> = {
  capture: "📸",
  extract: "🔍",
  dedup: "🧹",
  curate: "✨",
  responsive: "📱",
  styleguide: "🎨",
  showcase: "🌐",
};

function formatMs(ms: number): string {
  if (ms < 1000) return `${ms}ms`;
  return `${(ms / 1000).toFixed(1)}s`;
}

function StageCard({ stage, status, durationMs, error, index }: {
  stage: Stage;
  status: string;
  durationMs?: number;
  error?: string;
  index: number;
}) {
  const isRunning = status === "running";
  const isCompleted = status === "completed";
  const isFailed = status === "failed";
  const isPending = status === "pending";

  return (
    <div className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
      isRunning
        ? "bg-orange-50 border border-orange-200"
        : isCompleted
        ? "bg-green-50 border border-green-200"
        : isFailed
        ? "bg-red-50 border border-red-200"
        : "bg-gray-50 border border-gray-100"
    }`}>
      {/* Step number or status icon */}
      <div className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold ${
        isRunning
          ? "bg-orange-500 text-white"
          : isCompleted
          ? "bg-green-500 text-white"
          : isFailed
          ? "bg-red-500 text-white"
          : "bg-gray-200 text-gray-400"
      }`}>
        {isRunning && (
          <span className="w-3.5 h-3.5 rounded-full border-2 border-white border-t-transparent animate-spin" />
        )}
        {isCompleted && <span className="text-xs">✓</span>}
        {isFailed && <span className="text-xs">✗</span>}
        {isPending && <span className="text-xs text-gray-400">{index + 1}</span>}
      </div>

      {/* Label + status */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <span className="text-sm">{STAGE_ICONS[stage]}</span>
          <span className={`text-sm font-semibold ${
            isRunning ? "text-orange-700" : isCompleted ? "text-green-700" : isFailed ? "text-red-600" : "text-gray-400"
          }`}>
            {STAGE_LABELS[stage]}
          </span>
        </div>
        {isRunning && (
          <p className="text-[11px] text-orange-500 font-medium mt-0.5">Processing…</p>
        )}
        {isFailed && error && (
          <p className="text-[11px] text-red-500 mt-0.5 truncate">{error}</p>
        )}
      </div>

      {/* Duration */}
      {isCompleted && durationMs !== undefined && (
        <span className="text-[11px] font-medium text-green-600 flex-shrink-0">{formatMs(durationMs)}</span>
      )}
    </div>
  );
}

export default function PipelineView() {
  const { activeRun, isRunning, runError, goHome } = useSSE();
  const router = useRouter();
  const logsEndRef = useRef<HTMLDivElement>(null);
  const [isStuck, setIsStuck] = useState(false);
  const lastProgressRef = useRef<number>(Date.now());

  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeRun?.logs.length]);

  const hasFailure = runError || STAGES.some(
    (s) => activeRun?.stages[s]?.status === "failed"
  );

  const completedStages = useMemo(() => {
    if (!activeRun?.stages) return 0;
    return STAGES.filter((s) => activeRun.stages[s]?.status === "completed").length;
  }, [activeRun?.stages]);

  const totalStages = STAGES.length;
  const progress = totalStages > 0 ? Math.round((completedStages / totalStages) * 100) : 0;

  useEffect(() => {
    lastProgressRef.current = Date.now();
    setIsStuck(false);
  }, [activeRun?.logs.length, JSON.stringify(activeRun?.stages)]);

  useEffect(() => {
    if (!isRunning || hasFailure) return;
    const interval = setInterval(() => {
      if (Date.now() - lastProgressRef.current > 90000) {
        setIsStuck(true);
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [isRunning, hasFailure]);

  if (!activeRun && !runError) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="relative flex h-12 w-12 items-center justify-center">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-orange-400 opacity-30" />
            <span className="relative flex h-10 w-10 items-center justify-center rounded-full bg-orange-500">
              <svg className="h-5 w-5 text-white animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            </span>
          </div>
          <div>
            <p className="text-base font-bold text-gray-900">Connecting to pipeline…</p>
            <p className="text-sm text-gray-400 mt-1">This will just take a moment</p>
          </div>
        </div>
      </div>
    );
  }

  let hostname = activeRun?.url ?? "";
  try { hostname = new URL(activeRun?.url ?? "").hostname.replace(/^www\./, ""); } catch { /* leave as-is */ }

  const currentStage = STAGES.find((s) => activeRun?.stages[s]?.status === "running");
  const latestLog = activeRun?.logs.length ? activeRun.logs[activeRun.logs.length - 1] : null;

  return (
    <div className="w-full min-h-screen bg-[#fafafa]">
      {/* ── Hero header ── */}
      <div className="bg-white border-b border-gray-100 px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Status badge */}
          <div className="flex items-center gap-3 mb-4">
            {hasFailure ? (
              <span className="inline-flex items-center gap-2 bg-red-50 border border-red-200 rounded-full px-3 py-1">
                <span className="h-2 w-2 rounded-full bg-red-500" />
                <span className="text-red-600 text-xs font-bold uppercase tracking-widest">Failed</span>
              </span>
            ) : isStuck ? (
              <span className="inline-flex items-center gap-2 bg-yellow-50 border border-yellow-200 rounded-full px-3 py-1">
                <span className="h-2 w-2 rounded-full bg-yellow-500" />
                <span className="text-yellow-700 text-xs font-bold uppercase tracking-widest">Stuck</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-2 bg-orange-50 border border-orange-200 rounded-full px-3 py-1">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-orange-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-orange-500" />
                </span>
                <span className="text-orange-600 text-xs font-bold uppercase tracking-widest">
                  {completedStages === totalStages ? "Wrapping up" : "Generating"}
                </span>
              </span>
            )}
            {activeRun && (
              <span className="text-xs text-gray-400 font-medium uppercase tracking-wide border border-gray-200 rounded-full px-2.5 py-0.5">
                {activeRun.provider}
              </span>
            )}
          </div>

          <h1 className="text-2xl md:text-3xl font-black text-gray-900 mb-1 truncate">{hostname}</h1>
          {activeRun && (
            <p className="text-sm text-gray-400 truncate">{activeRun.url}</p>
          )}

          {/* Progress bar */}
          {!hasFailure && (
            <div className="mt-5">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-500 font-medium">
                  {currentStage ? `Running: ${STAGE_LABELS[currentStage]}` : completedStages === totalStages ? "Finalizing…" : "Starting up…"}
                </span>
                <span className="text-sm font-bold text-orange-500">{progress}%</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${Math.max(progress, 3)}%`,
                    background: "linear-gradient(90deg, #fb923c, #f97316)",
                  }}
                />
              </div>
              <p className="text-xs text-gray-400 mt-1.5">{completedStages} of {totalStages} stages complete</p>
            </div>
          )}
        </div>
      </div>

      {/* ── Main content ── */}
      <div className="max-w-4xl mx-auto px-4 py-6">

        {/* Error / stuck banner */}
        {(runError || hasFailure || isStuck) && (
          <div className={`mb-6 p-5 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center gap-4 ${
            isStuck ? "border-yellow-200 bg-yellow-50" : "border-red-200 bg-red-50"
          }`}>
            <div className="flex-1">
              <p className={`text-sm font-bold mb-1 ${isStuck ? "text-yellow-800" : "text-red-700"}`}>
                {isStuck ? "Pipeline appears stuck" : "Pipeline interrupted"}
              </p>
              <p className={`text-sm ${isStuck ? "text-yellow-700" : "text-red-600"}`}>
                {isStuck
                  ? "No activity for 90 seconds. You can wait or force a restart."
                  : (runError || "An error occurred during generation.")}
              </p>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              {isStuck && (
                <button
                  onClick={() => { lastProgressRef.current = Date.now(); setIsStuck(false); }}
                  className="px-4 py-2 border border-yellow-300 text-yellow-800 text-sm font-semibold rounded-xl hover:bg-yellow-100 transition-all"
                >
                  Keep waiting
                </button>
              )}
              <button
                onClick={() => {
                  goHome();
                  router.replace("/");
                }}
                className={`px-5 py-2 text-white text-sm font-bold rounded-xl transition-all ${
                  isStuck ? "bg-yellow-600 hover:bg-yellow-700" : "bg-red-600 hover:bg-red-700"
                }`}
              >
                {isStuck ? "Restart" : "Try again"}
              </button>
            </div>
          </div>
        )}

        {/* Latest log message */}
        {latestLog && !hasFailure && !isStuck && (
          <div className="mb-5 flex items-center gap-3 bg-white border border-gray-100 rounded-xl px-4 py-3 shadow-sm">
            <div className="relative flex h-2 w-2 flex-shrink-0">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-orange-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-orange-500" />
            </div>
            <p className="text-sm text-gray-600 font-medium truncate">{latestLog.message}</p>
            <span className="text-xs text-gray-400 flex-shrink-0">
              {new Date(latestLog.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
            </span>
          </div>
        )}

        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-4">
          {/* Log terminal */}
          <div className="rounded-2xl overflow-hidden border border-gray-200 shadow-sm">
            <div className="px-4 py-3 border-b border-gray-800 flex items-center gap-2" style={{ background: "#1e1e1e" }}>
              <span className="w-3 h-3 rounded-full bg-red-500/80" />
              <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <span className="w-3 h-3 rounded-full bg-green-500/80" />
              <span className="ml-3 text-xs font-semibold text-gray-400 tracking-wide">Live Log</span>
              {activeRun?.logs.length ? (
                <span className="ml-auto text-xs text-gray-600">{activeRun.logs.length} events</span>
              ) : null}
            </div>
            <div
              className="p-4 font-mono text-xs leading-6 overflow-y-auto"
              style={{ background: "#1a1a1a", color: "#d4d4d4", minHeight: 320, maxHeight: 440 }}
            >
              {(!activeRun || activeRun.logs.length === 0) && (
                <span style={{ color: "#555" }}>
                  {isStuck ? "⚠ No progress received for 90s…" : "⏳ Waiting for pipeline events…"}
                </span>
              )}
              {activeRun?.logs.map((log, i) => (
                <div key={i} className="flex gap-2">
                  <span style={{ color: "#4b5563", flexShrink: 0 }}>
                    {new Date(log.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
                  </span>
                  {log.level !== "info" && (
                    <span className={log.level === "error" ? "text-red-400 flex-shrink-0" : "text-yellow-400 flex-shrink-0"}>
                      [{log.level.toUpperCase()}]
                    </span>
                  )}
                  <span className={
                    log.level === "error" ? "text-red-400" :
                    log.level === "warn" ? "text-yellow-400" :
                    "text-[#d4d4d4]"
                  }>
                    {log.message}
                  </span>
                </div>
              ))}
              <div ref={logsEndRef} />
            </div>
          </div>

          {/* Stage list */}
          <div className="flex flex-col gap-2">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1 mb-1">
              Pipeline Stages
            </h3>
            {STAGES.map((stage, index) => {
              const s = activeRun?.stages[stage] ?? { status: "pending" };
              return (
                <StageCard
                  key={stage}
                  stage={stage}
                  status={s.status}
                  durationMs={s.durationMs}
                  error={s.error}
                  index={index}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
