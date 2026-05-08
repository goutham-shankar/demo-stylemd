export type Provider = "claude" | "kimi";
/** UI + API — backend may also send `completed_with_warnings` or `canceled`. */
export type RunStatus =
  | "pending"
  | "running"
  | "completed"
  | "completed_with_warnings"
  | "failed"
  | "canceled";
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

/**
 * Row from the `scraped_data` MongoDB collection.
 * Returned by POST /api/scraped-data.
 */
export interface ScrapedDataRecord {
  _id?: string;
  url: string;
  title?: string | null;
  description?: string | null;
  h1?: string | null;
  canonical?: string | null;
  /** Array of base64 strings: data:image/jpeg;base64,... */
  images: string[];
  contentText?: string | null;
  rawHtml?: string | null;
  /** base64 data:image/jpeg;base64,... (900px wide preview) */
  screenshot?: string | null;
  createdAt?: string;
}


/**
 * Row from the `stylemd_runs` MongoDB collection.
 * Returned by GET /api/stylemd/by-slug/:slug and POST /api/stylemd.
 */
export interface RunData {
  _id?: string;
  url: string;
  slug: string;
  runId: string;
  provider: Provider;
  model: string;
  styleMd: string;
  /** base64 data:image/jpeg;base64,... (900px wide) */
  screenshot: string;
  
  // Metadata fields
  title?: string;
  description?: string;
  h1?: string;
  canonical?: string;
  
  brandAssets?: {
    logo?: string;
    favicon?: string;
    appleIcon?: string;
    ogImage?: string;
  };
  
  showcaseUrl?: string;
  /** Mirrors `stylemd_runs.status` from the API. */
  status: RunStatus | string;
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
  status: RunStatus | "completed_with_warnings";
  styleMd: string;
  showcase: { available: boolean; canonicalUrl: string; latestUrl: string };
  error?: string;
  warnings?: string[];
}

export interface SSEAction {
  level: "info" | "warn" | "error";
  message: string;
}
