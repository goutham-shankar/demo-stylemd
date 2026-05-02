"use client";

import { useEffect, useRef } from "react";
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

function formatMs(ms: number): string {
  if (ms < 1000) return `${ms}ms`;
  return `${(ms / 1000).toFixed(1)}s`;
}

function StageRow({ stage, status, durationMs, error }: {
  stage: Stage;
  status: string;
  durationMs?: number;
  error?: string;
}) {
  const isRunning = status === "running";
  const isCompleted = status === "completed";
  const isFailed = status === "failed";
  const isPending = status === "pending";

  return (
    <div className="flex items-center gap-3 py-2.5">
      {/* Icon */}
      <div className="flex-shrink-0 w-7 h-7 flex items-center justify-center">
        {isRunning && (
          <span className="w-5 h-5 rounded-full border-2 border-t-transparent animate-spin"
            style={{ borderColor: "var(--cta)", borderTopColor: "transparent" }} />
        )}
        {isCompleted && (
          <span className="w-5 h-5 rounded-full flex items-center justify-center text-white text-xs font-bold"
            style={{ backgroundColor: "var(--cta)" }}>
            ✓
          </span>
        )}
        {isFailed && (
          <span className="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center text-white text-xs font-bold">
            ✗
          </span>
        )}
        {isPending && (
          <span className="w-5 h-5 rounded-full border-2 border-medium" />
        )}
      </div>

      {/* Label */}
      <span
        className={`text-sm font-semibold font-manrope flex-1 ${
          isRunning ? "text-primary" : isCompleted ? "text-primary" : isFailed ? "text-red-600" : "text-secondary"
        }`}
      >
        {STAGE_LABELS[stage]}
        {isRunning && (
          <span className="ml-2 text-xs font-normal" style={{ color: "var(--cta)" }}>
            running…
          </span>
        )}
        {isFailed && error && (
          <span className="ml-2 text-xs font-normal text-red-500">{error}</span>
        )}
      </span>

      {/* Duration */}
      {isCompleted && durationMs !== undefined && (
        <span className="text-xs font-manrope text-secondary">{formatMs(durationMs)}</span>
      )}
    </div>
  );
}

export default function PipelineView() {
  const { activeRun, isRunning, runError } = useSSE();
  const logsEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeRun?.logs.length]);

  if (!activeRun && !runError) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="w-6 h-6 rounded-full border-2 border-t-transparent animate-spin"
          style={{ borderColor: "var(--cta)", borderTopColor: "transparent" }} />
      </div>
    );
  }

  const hasFailure = runError || STAGES.some(
    (s) => activeRun?.stages[s]?.status === "failed"
  );

  let hostname = activeRun?.url ?? "";
  try { hostname = new URL(activeRun?.url ?? "").hostname; } catch { /* leave as-is */ }

  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        {/* Pulsing status dot */}
        {isRunning && !hasFailure && (
          <span className="relative flex h-3 w-3 flex-shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
              style={{ backgroundColor: "var(--cta)" }} />
            <span className="relative inline-flex rounded-full h-3 w-3"
              style={{ backgroundColor: "var(--cta)" }} />
          </span>
        )}
        {hasFailure && (
          <span className="h-3 w-3 rounded-full bg-red-500 flex-shrink-0" />
        )}

        <div className="min-w-0">
          <p className="text-sm font-semibold text-primary font-manrope truncate">{hostname}</p>
          <p className="text-xs text-secondary font-manrope">
            {hasFailure ? "Pipeline failed" : isRunning ? "Running pipeline…" : "Finishing up…"}
          </p>
        </div>

        {activeRun && (
          <span className="ml-auto flex-shrink-0 px-2.5 py-1 rounded-lg text-xs font-semibold border border-medium text-secondary bg-surface font-manrope uppercase tracking-wide">
            {activeRun.provider}
          </span>
        )}
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Stage stepper */}
        <div className="bg-surface rounded-2xl border border-medium shadow-sm p-5 flex-shrink-0 md:w-64">
          <h3 className="text-xs font-semibold text-secondary uppercase tracking-widest mb-3 font-manrope">
            Pipeline Stages
          </h3>
          <div className="divide-y divide-[var(--border-light)]">
            {STAGES.map((stage) => {
              const s = activeRun?.stages[stage] ?? { status: "pending" };
              return (
                <StageRow
                  key={stage}
                  stage={stage}
                  status={s.status}
                  durationMs={s.durationMs}
                  error={s.error}
                />
              );
            })}
          </div>
        </div>

        {/* Log terminal */}
        <div className="flex-1 bg-surface rounded-2xl border border-medium shadow-sm overflow-hidden flex flex-col min-h-[360px]">
          <div className="px-4 py-2.5 border-b border-medium flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
            <span className="w-2.5 h-2.5 rounded-full bg-green-400" />
            <span className="ml-2 text-xs font-semibold text-secondary font-manrope tracking-wide">
              Live Log
            </span>
          </div>
          <div
            className="flex-1 overflow-y-auto p-4 font-mono text-xs leading-relaxed"
            style={{ background: "#1a1a1a", color: "#d4d4d4", maxHeight: 360 }}
          >
            {(!activeRun || activeRun.logs.length === 0) && (
              <span style={{ color: "#666" }}>Waiting for pipeline events…</span>
            )}
            {activeRun?.logs.map((log, i) => (
              <div key={i} className={
                log.level === "error" ? "text-red-400" :
                log.level === "warn" ? "text-yellow-400" :
                "text-[#d4d4d4]"
              }>
                <span style={{ color: "#666" }}>
                  {new Date(log.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
                </span>
                {" "}
                {log.level !== "info" && (
                  <span className={log.level === "error" ? "text-red-400" : "text-yellow-400"}>
                    [{log.level.toUpperCase()}]{" "}
                  </span>
                )}
                {log.message}
              </div>
            ))}
            <div ref={logsEndRef} />
          </div>
        </div>
      </div>

      {/* Error banner */}
      {runError && (
        <div className="mt-6 px-4 py-3 rounded-xl border border-red-200 bg-red-50 text-red-700 text-sm font-manrope">
          <span className="font-semibold">Pipeline error: </span>{runError}
        </div>
      )}
    </div>
  );
}
