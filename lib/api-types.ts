export type Provider = "claude" | "kimi";
export type RunStatus = "pending" | "running" | "completed" | "failed";
export type StageStatus = "pending" | "running" | "completed" | "failed";
export type Screen = "home" | "running" | "result";

export const STAGES = [
  "capture",
  "extract",
  "dedup",
  "curate",
  "responsive",
  "styleguide",
  "showcase",
] as const;
export type Stage = (typeof STAGES)[number];

export interface RunSummary {
  id: string;
  url: string;
  slug: string;
  provider: Provider;
  model: string;
  status: RunStatus;
  createdAt: string;
}

export interface RunData {
  url: string;
  slug: string;
  runId: string;
  styleMd: string;
  screenshot: string;
  screenshotUrl?: string;
  showcaseUrl?: string;
  provider: Provider;
  model: string;
  status: RunStatus;
  createdAt: string;
}

export interface StageState {
  status: StageStatus;
  durationMs?: number;
  error?: string;
}

export interface LogEntry {
  level: "info" | "warn" | "error";
  message: string;
  timestamp: number;
}

export interface ActiveRun {
  runId: string;
  url: string;
  provider: Provider;
  model: string;
  stages: Record<Stage, StageState>;
  logs: LogEntry[];
  startedAt: string;
}

// SSE event payload shapes
export interface SSERunStarted {
  runId: string;
  url: string;
  provider: Provider;
  model: string;
  stages: Stage[];
  startedAt: string;
}

export interface SSEStageStarted {
  stage: Stage;
  startedAt: string;
}

export interface SSEStageCompleted {
  stage: Stage;
  durationMs: number;
}

export interface SSEStageFailed {
  stage: Stage;
  error: string;
}

export interface SSEArtifactReady {
  artifact: { path: string; label: string };
}

export interface SSERunCompleted {
  runId: string;
  status: RunStatus;
  styleMd: string;
  showcase: { available: boolean; canonicalUrl: string; latestUrl: string };
  error?: string;
  warnings?: string[];
}

export interface SSEAction {
  level: "info" | "warn" | "error";
  message: string;
}
