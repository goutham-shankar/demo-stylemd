"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
  useRef,
} from "react";
import {
  STAGES,
  type ActiveRun,
  type LogEntry,
  type Provider,
  type RunData,
  type RunSummary,
  type Screen,
  type SSEAction,
  type SSERunCompleted,
  type SSERunStarted,
  type SSEStageFailed,
  type SSEStageCompleted,
  type SSEStageStarted,
  type Stage,
  type StageState,
  type StageStatus,
} from "./api-types";
import { API_BASE } from "./api-config";


export { API_BASE };

/** Non-terminal API statuses that should keep polling until markdown appears (legacy / unknown). */
function isTerminalApiRunStatus(st: string): boolean {
  return ["completed", "failed", "canceled", "completed_with_warnings"].includes(st);
}


function mapApiSummary(raw: Record<string, unknown>): RunSummary {
  const st = String(raw.status ?? "completed");
  const status: RunSummary["status"] =
    st === "running" || st === "processing" || raw.pending === true
      ? "running"
      : st === "failed"
        ? "failed"
        : st === "canceled"
          ? "canceled"
          : st === "completed_with_warnings"
            ? "completed_with_warnings"
            : "completed";
  return {
    // prefer runId (business key) over MongoDB _id
    id: String(raw.runId ?? raw.id ?? raw._id ?? ""),
    url: String(raw.url ?? ""),
    slug: String(raw.slug ?? ""),
    provider: (raw.provider as Provider) ?? "kimi",
    model: String(raw.model ?? ""),
    status,
    createdAt:
      typeof raw.createdAt === "string"
        ? raw.createdAt
        : raw.createdAt instanceof Date
          ? raw.createdAt.toISOString()
          : "",
  };
}


/** Keep polling until the run is no longer in-flight or we have markdown (or a terminal status). */
function runNeedsPoll(d: RunData): boolean {
  if (d.pending === true) return true;
  const st = String(d.status ?? "");
  if (st === "processing") return true;
  if (isTerminalApiRunStatus(st)) return false;
  if (st === "running") return true;
  return !d.styleMd?.trim();
}

async function fetchWithTimeout(
  input: RequestInfo,
  init?: RequestInit,
  timeoutMs = 8000
): Promise<Response> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(input, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(id);
  }
}

async function fetchRunBySlugOrId(slugOrId: string): Promise<RunData | null> {
  if (!API_BASE) return null;
  try {
    const res = await fetchWithTimeout(
      `${API_BASE}/api/stylemd/by-slug/${encodeURIComponent(slugOrId)}`
    );
    if (!res.ok) return null;
    const j = (await res.json()) as { ok?: boolean; data?: RunData };
    if (!j.ok || !j.data) return null;
    return j.data;
  } catch (e) {
    // Suppress AbortError (navigation away / timeout) — not a real error
    if (e instanceof DOMException && e.name === "AbortError") return null;
    return null;
  }
}

function initStages(): Record<Stage, StageState> {
  return Object.fromEntries(
    STAGES.map((s) => [s, { status: "pending" as StageStatus }])
  ) as Record<Stage, StageState>;
}

// ── State ────────────────────────────────────────────────────────────────────

interface AppState {
  screen: Screen;
  runs: RunSummary[];
  activeRun: ActiveRun | null;
  resultData: RunData | null;
  isRunning: boolean;
  networkError: string | null;
  runError: string | null;
  lastRunSlug: string | null;
}


type AppAction =
  | { type: "SET_SCREEN"; screen: Screen }
  | { type: "SET_RUNS"; runs: RunSummary[] }
  | { type: "ADD_OPTIMISTIC_RUN"; summary: RunSummary }
  | { type: "SET_ACTIVE_RUN"; run: ActiveRun }
  | { type: "STAGE_STARTED"; stage: Stage }
  | { type: "STAGE_COMPLETED"; stage: Stage; durationMs: number }
  | { type: "STAGE_FAILED"; stage: Stage; error: string }
  | { type: "LOG_ADDED"; entry: LogEntry }
  | { type: "SET_RESULT"; data: RunData }
  | { type: "NETWORK_ERROR"; error: string | null }
  | { type: "RUN_ERROR"; error: string | null }
  | { type: "SET_LAST_RUN"; slug: string | null }
  | { type: "GO_HOME" };


const initialState: AppState = {
  screen: "home",
  runs: [],
  activeRun: null,
  resultData: null,
  isRunning: false,
  networkError: null,
  runError: null,
  lastRunSlug: null,
};


function reducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case "SET_SCREEN":
      return { ...state, screen: action.screen };

    case "SET_RUNS": {
      // Keep optimistic entries whose URL isn't represented in the real list yet
      const realUrls = new Set(action.runs.map((r) => r.url.toLowerCase().replace(/\/$/, "")));
      const optimisticToKeep = state.runs.filter(
        (r) => r.id.startsWith("optimistic-") && !realUrls.has(r.url.toLowerCase().replace(/\/$/, ""))
      );
      return { ...state, runs: [...optimisticToKeep, ...action.runs] };
    }

    case "ADD_OPTIMISTIC_RUN": {
      const exists = state.runs.some((r) => r.id === action.summary.id);
      return exists ? state : { ...state, runs: [action.summary, ...state.runs] };
    }

    case "SET_ACTIVE_RUN":
      return {
        ...state,
        activeRun: action.run,
        isRunning: true,
        screen: "running",
        runError: null,
      };

    case "STAGE_STARTED":
      if (!state.activeRun) return state;
      return {
        ...state,
        activeRun: {
          ...state.activeRun,
          stages: {
            ...state.activeRun.stages,
            [action.stage]: { status: "running" },
          },
        },
      };

    case "STAGE_COMPLETED":
      if (!state.activeRun) return state;
      return {
        ...state,
        activeRun: {
          ...state.activeRun,
          stages: {
            ...state.activeRun.stages,
            [action.stage]: { status: "completed", durationMs: action.durationMs },
          },
        },
      };

    case "STAGE_FAILED":
      if (!state.activeRun) return state;
      return {
        ...state,
        activeRun: {
          ...state.activeRun,
          stages: {
            ...state.activeRun.stages,
            [action.stage]: { status: "failed", error: action.error },
          },
        },
      };

    case "LOG_ADDED":
      if (!state.activeRun) return state;
      return {
        ...state,
        activeRun: {
          ...state.activeRun,
          logs: [...state.activeRun.logs.slice(-199), action.entry],
        },
      };

    case "SET_RESULT": {
      const stillRunning = action.data.status === "running" || action.data.status === "processing" || action.data.pending === true;
      return {
        ...state,
        resultData: action.data,
        isRunning: stillRunning,
        screen: "result",
        runs: state.runs.map((r) =>
          r.id === action.data.runId || r.slug === action.data.slug
            ? {
                ...r,
                status: stillRunning
                  ? "running"
                  : action.data.status === "failed"
                    ? "failed"
                    : action.data.status === "canceled"
                      ? "canceled"
                      : action.data.status === "completed_with_warnings"
                        ? "completed_with_warnings"
                        : "completed",
              }
            : r
        ),
      };
    }

    case "NETWORK_ERROR":
      return {
        ...state,
        networkError: action.error,
        runs: action.error ? state.runs.filter((r) => !r.id.startsWith("optimistic-")) : state.runs,
      };

    case "RUN_ERROR":
      return {
        ...state,
        runError: action.error,
        isRunning: false,
        runs: action.error ? state.runs.filter((r) => !r.id.startsWith("optimistic-")) : state.runs,
      };

    case "SET_LAST_RUN":
      return { ...state, lastRunSlug: action.slug };

    case "GO_HOME":
      return {
        ...state,
        screen: "home",
        activeRun: null,
        resultData: null,
        runError: null,
        isRunning: false,
      };

    default:
      return state;
  }
}

// ── Context ───────────────────────────────────────────────────────────────────

interface SSEContextValue extends AppState {
  startRun: (url: string, provider: Provider) => Promise<void>;
  viewRun: (slugOrId: string) => Promise<void>;
  goHome: () => void;
  runAgain: () => Promise<void>;
  dismissNetworkError: () => void;
}

const SSEContext = createContext<SSEContextValue | null>(null);

export function useSSE(): SSEContextValue {
  const ctx = useContext(SSEContext);
  if (!ctx) throw new Error("useSSE must be used within SSEProvider");
  return ctx;
}

// ── Provider ──────────────────────────────────────────────────────────────────

const ACTIVE_RUN_KEY = "stylemd_active_run";
const LAST_ID_KEY = "stylemd_last_run_id";

type PersistedRun = {
  runId: string;
  url: string;
  provider: Provider;
  startedAt: string;
};

export function SSEProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const esRef = useRef<EventSource | null>(null);
  const deadRef = useRef(false);
  const viewPollGenRef = useRef(0);
  const currentRunIdRef = useRef<string | null>(null);
  const activeRunRef = useRef<ActiveRun | null>(null);
  activeRunRef.current = state.activeRun;

  // ── Persist active run to localStorage so refresh can restore it ────────────
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (state.activeRun && state.isRunning) {
      const persisted: PersistedRun = {
        runId: state.activeRun.runId,
        url: state.activeRun.url,
        provider: state.activeRun.provider,
        startedAt: state.activeRun.startedAt,
      };
      localStorage.setItem(ACTIVE_RUN_KEY, JSON.stringify(persisted));
    }
  }, [state.activeRun, state.isRunning]);

  // ── Clear persisted run when no longer running ──────────────────────────────
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!state.isRunning) {
      localStorage.removeItem(ACTIVE_RUN_KEY);
    }
  }, [state.isRunning]);

  const fetchRuns = useCallback(async () => {
    try {
      if (!API_BASE) return;
      const res = await fetchWithTimeout(`${API_BASE}/api/stylemd/runs`);
      if (!res.ok) return;
      const data = (await res.json()) as {
        ok?: boolean;
        summaries?: Record<string, unknown>[];
        data?: Record<string, unknown>[];
      };
      // Backend may return either { summaries: [...] } or { data: [...] }
      const list = Array.isArray(data.summaries)
        ? data.summaries
        : Array.isArray(data.data)
          ? data.data
          : [];
      if (list.length > 0 || data.ok) {
        dispatch({
          type: "SET_RUNS",
          runs: list.map((s) => mapApiSummary(s)),
        });
      }
    } catch {
      // silently ignore; not critical
    }
  }, []);


  // SSE connection – defined once after mount
  useEffect(() => {
    deadRef.current = false;

    if (typeof window === "undefined") return;

    // Restore last completed run slug for the home screen
    const savedSlug = localStorage.getItem(LAST_ID_KEY);
    if (savedSlug) dispatch({ type: "SET_LAST_RUN", slug: savedSlug });

    // ── Restore an in-progress run after page refresh ─────────────────────────
    const savedActiveRunRaw = localStorage.getItem(ACTIVE_RUN_KEY);
    if (savedActiveRunRaw) {
      try {
        const saved: PersistedRun = JSON.parse(savedActiveRunRaw);
        if (saved.runId) {
          // Immediately show the running screen with a skeleton pipeline
          currentRunIdRef.current = saved.runId;
          dispatch({
            type: "SET_ACTIVE_RUN",
            run: {
              runId: saved.runId,
              url: saved.url,
              provider: saved.provider,
              model: "",
              stages: initStages(),
              logs: [{ type: "stylemd_action", action: "Reconnecting to in-progress run…", timestamp: Date.now() }],
              startedAt: saved.startedAt,
            },
          });

          // Poll the backend until the run finishes or we confirm it's gone
          void (async () => {
            for (let i = 0; i < 180 && !deadRef.current; i++) {
              await new Promise((r) => setTimeout(r, 2500));
              if (deadRef.current) return;
              const runData = await fetchRunBySlugOrId(saved.runId);
              if (!runData) continue; // transient fetch failure — keep trying
              if (runData.status === "failed" || runData.status === "canceled") {
                dispatch({ type: "RUN_ERROR", error: "Run ended: " + runData.status });
                localStorage.removeItem(ACTIVE_RUN_KEY);
                return;
              }
              if (isTerminalApiRunStatus(runData.status) && runData.styleMd) {
                dispatch({
                  type: "SET_RESULT",
                  data: { ...runData, slug: runData.slug || saved.runId },
                });
                localStorage.removeItem(ACTIVE_RUN_KEY);
                return;
              }
              // Still running — keep polling; SSE will also fire when done
            }
            // Timed out — clear and let user retry
            if (!deadRef.current) {
              localStorage.removeItem(ACTIVE_RUN_KEY);
              dispatch({ type: "RUN_ERROR", error: "Run timed out waiting for results." });
            }
          })();
        }
      } catch {
        localStorage.removeItem(ACTIVE_RUN_KEY);
      }
    }

    let timeoutId: NodeJS.Timeout;

    function connect() {

      if (deadRef.current) return;

      if (!API_BASE) {
        console.warn("[SSE] NEXT_PUBLIC_API_BASE is unset and dev fallback failed; event stream disabled.");
        return;
      }

      const es = new EventSource(`${API_BASE}/api/session/events`);
      esRef.current = es;

      // All events arrive as unnamed "message" events wrapped in an envelope:
      // { type: "event", payload: PlaygroundEvent } or { type: "state_sync", payload: ... }
      es.onmessage = (e: MessageEvent) => {
        if (deadRef.current) return;
        // Reset heartbeat on every incoming message so a busy stream doesn't trigger a false reconnect.
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          if (!deadRef.current) {
            console.warn("[SSE] Heartbeat lost, reconnecting...");
            es.close();
            connect();
          }
        }, 45000);

        let envelope: { type: string; payload: Record<string, unknown> };
        try { envelope = JSON.parse(e.data); } catch { return; }

        if (envelope.type === "state_sync") {
          fetchRuns();
          return;
        }
        if (envelope.type !== "event") return;

        const event = envelope.payload as Record<string, unknown> & { type: string };
        if (!event || typeof event.type !== "string") return;
        switch (event.type) {
          case "stylemd_run_started": {
            const data = event as unknown as SSERunStarted;
            // Don't reset stages/logs if the SSE reconnected mid-run for the same run
            if (activeRunRef.current?.runId === data.runId) break;
            currentRunIdRef.current = data.runId;
            dispatch({
              type: "SET_ACTIVE_RUN",
              run: {
                runId: data.runId,
                url: data.url,
                provider: data.provider,
                model: data.model,
                stages: initStages(),
                logs: [],
                startedAt: data.startedAt,
              },
            });
            break;
          }
          case "stylemd_stage_started": {
            const data = event as unknown as SSEStageStarted;
            dispatch({ type: "STAGE_STARTED", stage: data.stage });
            break;
          }
          case "stylemd_stage_completed": {
            const data = event as unknown as SSEStageCompleted;
            dispatch({ type: "STAGE_COMPLETED", stage: data.stage, durationMs: data.durationMs });
            break;
          }
          case "stylemd_stage_failed": {
            const data = event as unknown as SSEStageFailed;
            dispatch({ type: "STAGE_FAILED", stage: data.stage, error: data.error });
            break;
          }
          case "stylemd_action": {
            const data = event as unknown as SSEAction;
            dispatch({ type: "LOG_ADDED", entry: { ...data, timestamp: Date.now() } });
            break;
          }
          case "stylemd_run_completed": {
            const data = event as unknown as SSERunCompleted;
            const ok =
              data.status === "completed" || data.status === "completed_with_warnings";
            if (ok) {
              const showcaseUrl = data.showcase?.canonicalUrl;
              const runId = data.runId;

              const finish = (runData: RunData) => {
                if (deadRef.current) return;
                if (currentRunIdRef.current !== runId) return;
                dispatch({
                  type: "SET_RESULT",
                  data: {
                    ...runData,
                    slug: runData.slug || runId,
                    ...(showcaseUrl ? { showcaseUrl } : {}),
                  },
                });
                fetchRuns();

                const finalSlug = runData.slug || runData.runId;
                if (finalSlug && typeof window !== "undefined") {
                  localStorage.setItem(LAST_ID_KEY, finalSlug);
                  localStorage.removeItem(ACTIVE_RUN_KEY);
                  dispatch({ type: "SET_LAST_RUN", slug: finalSlug });
                }
              };

              // Immediately show the result using data from the SSE event + activeRun.
              const cur = activeRunRef.current;
              if (cur && data.styleMd) {
                const resultData: RunData = {
                  runId,
                  url: cur.url,
                  slug: runId,
                  styleMd: data.styleMd,
                  screenshot: "",
                  provider: cur.provider,
                  model: cur.model,
                  status: data.status,
                  createdAt: cur.startedAt,
                };
                finish(resultData);
              }



              // Continue polling the DB as fallback to get the full record (screenshot, persisted slug, metadata, etc.)
              void (async () => {
                console.log(`[SSE] Finalizing run ${runId}, polling DB for full record...`);
                for (let attempt = 0; attempt < 90 && !deadRef.current; attempt++) {
                  if (currentRunIdRef.current !== runId) return;
                  const runData = await fetchRunBySlugOrId(runId);
                  const isPending = runData?.pending === true || runData?.status === "processing";
                  if (runData && (isTerminalApiRunStatus(runData.status) || (runData.styleMd && !isPending))) {
                    console.log(`[SSE] Run ${runId} settled in DB, finishing.`);
                    finish(runData);
                    return;
                  }
                  await new Promise((r) => setTimeout(r, 1500));
                }
                if (!deadRef.current && currentRunIdRef.current === runId) {
                  const last = await fetchRunBySlugOrId(runId);
                  if (last) finish(last);
                }
              })();
            } else {
              dispatch({ type: "RUN_ERROR", error: data.error ?? "Pipeline failed" });
            }
            break;
          }
        }
      };

      es.onopen = () => {
        clearTimeout(timeoutId);
        // If no event for 45s, consider connection lost
        timeoutId = setTimeout(() => {
          if (!deadRef.current) {
            console.warn("[SSE] Heartbeat lost, reconnecting...");
            es.close();
            connect();
          }
        }, 45000);

        // On reconnect while an active run is in-flight, poll the DB once.
        // If the run has already completed (styleMd ready), transition to the result screen
        // so the user isn't left watching a stale pipeline view after a disconnect.
        const cur = activeRunRef.current;
        if (cur) {
          void (async () => {
            const runData = await fetchRunBySlugOrId(cur.runId);
            if (!runData || deadRef.current) return;
            if (isTerminalApiRunStatus(runData.status) || (runData.styleMd && !runNeedsPoll(runData))) {
              dispatch({ type: "SET_RESULT", data: { ...runData, slug: runData.slug || cur.runId } });
            }
          })();
        }
      };

      es.onerror = () => {
        es.close();
        clearTimeout(timeoutId);
        setTimeout(connect, 3000);
      };
    }


    fetchRuns();
    connect();

    return () => {
      deadRef.current = true;
      esRef.current?.close();
    };
  }, [fetchRuns]); // fetchRuns is stable (useCallback with [])

  // ── Actions ────────────────────────────────────────────────────────────────

  const startRun = useCallback(
    async (url: string, provider: Provider) => {
      if (state.isRunning) {
        dispatch({ type: "RUN_ERROR", error: "A pipeline is already running" });
        return;
      }

      // Cancel any in-flight viewRun polls so they don't overwrite the new run's result
      ++viewPollGenRef.current;

      const handleExistingRun = async (targetUrl: string) => {
        try {
          const normalizedTarget = targetUrl.toLowerCase().replace(/\/$/, "");

          const runsRes = await fetchWithTimeout(`${API_BASE}/api/stylemd/runs`);
          if (!runsRes.ok) return false;
          const data = await runsRes.json();
          // Backend may return { summaries: [...] } or { data: [...] }
          const list = Array.isArray(data.summaries)
            ? data.summaries
            : Array.isArray(data.data)
            ? data.data
            : [];

          const existing = list.find((r: Record<string, unknown>) => {
            const rUrl = String(r.url || "").toLowerCase().replace(/\/$/, "");
            return rUrl === normalizedTarget && r.status === "running";
          });

          if (existing) {
            const existingRunId = String(existing.runId ?? existing.id ?? "");
            currentRunIdRef.current = existingRunId;
            // Preserve in-flight stages/logs if we already have this run active
            const cur = activeRunRef.current;
            const stages = cur?.runId === existingRunId ? cur.stages : initStages();
            const logs = cur?.runId === existingRunId ? cur.logs : [];
            dispatch({
              type: "SET_ACTIVE_RUN",
              run: {
                runId: existingRunId,
                url: String(existing.url ?? ""),
                provider: (existing.provider as Provider) || "kimi",
                model: String(existing.model ?? ""),
                stages,
                logs,
                startedAt: String(existing.createdAt ?? new Date().toISOString()),
              },
            });
            return true;
          }
        } catch (e) {
          console.error("Failed to resume existing run:", e);
        }
        return false;
      };

      dispatch({ type: "NETWORK_ERROR", error: null });
      dispatch({ type: "RUN_ERROR", error: null });

      // Optimistic: add to library immediately with "running" status
      let hostname = url.toLowerCase().replace(/\/$/, "");
      try { hostname = new URL(url).hostname; } catch { /* leave as-is */ }

      dispatch({
        type: "ADD_OPTIMISTIC_RUN",
        summary: {
          id: `optimistic-${Date.now()}`,
          url,
          slug: hostname,
          provider,
          model: "",
          status: "running",
          createdAt: new Date().toISOString(),
        },
      });

      try {
        const res = await fetchWithTimeout(
          `${API_BASE}/api/stylemd`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ url, provider }),
          },
          15000
        );

        if (res.status === 409 || (res.status === 400 && (await res.clone().json())?.error?.includes("already in progress"))) {
          const resumed = await handleExistingRun(url);
          if (resumed) return;
          dispatch({ type: "RUN_ERROR", error: "Pipeline busy, try again shortly" });
          return;
        }
        if (!res.ok) throw new Error(`Server error: ${res.status}`);

        const data: { ok: boolean; runId: string } = await res.json();
        currentRunIdRef.current = data.runId;

        dispatch({
          type: "SET_ACTIVE_RUN",
          run: {
            runId: data.runId,
            url,
            provider,
            model: "",
            stages: initStages(),
            logs: [],
            startedAt: new Date().toISOString(),
          },
        });
      } catch (err) {
        dispatch({
          type: "NETWORK_ERROR",
          error: err instanceof Error ? err.message : "Failed to start pipeline",
        });
        dispatch({ type: "RUN_ERROR", error: null });
      }
    },
    [state.isRunning]
  );

  const viewRun = useCallback(async (slugOrId: string) => {
    dispatch({ type: "NETWORK_ERROR", error: null });
    const gen = ++viewPollGenRef.current;
    try {
      const data = await fetchRunBySlugOrId(slugOrId);
      if (!data) throw new Error(`HTTP 404`);

      // Bail out if startRun fired while we were fetching — don't overwrite the new run
      if (gen !== viewPollGenRef.current) return;
      dispatch({ type: "SET_RESULT", data: { ...data, slug: data.slug || slugOrId } });

      if (runNeedsPoll(data)) {
        void (async () => {
          for (let i = 0; i < 120 && gen === viewPollGenRef.current; i++) {
            await new Promise((r) => setTimeout(r, 2000));
            const next = await fetchRunBySlugOrId(data.runId || slugOrId);
            if (!next || gen !== viewPollGenRef.current) return;
            dispatch({ type: "SET_RESULT", data: next });
            if (!runNeedsPoll(next)) return;
          }
          if (gen === viewPollGenRef.current) {
            dispatch({
              type: "NETWORK_ERROR",
              error:
                "Still generating… If this persists, confirm the API at NEXT_PUBLIC_API_BASE is running.",
            });
          }
        })();
      }
    } catch (err) {
      dispatch({
        type: "NETWORK_ERROR",
        error: err instanceof Error ? err.message : "Failed to load run",
      });
    }
  }, []);

  const goHome = useCallback(() => {
    dispatch({ type: "GO_HOME" });
  }, []);

  const runAgain = useCallback(async () => {
    if (!state.resultData) return;
    const { url, provider } = state.resultData;
    dispatch({ type: "GO_HOME" });
    await startRun(url, provider);
  }, [state.resultData, startRun]);


  const dismissNetworkError = useCallback(() => {
    dispatch({ type: "NETWORK_ERROR", error: null });
  }, []);

  return (
    <SSEContext.Provider
      value={{ ...state, startRun, viewRun, goHome, runAgain, dismissNetworkError }}
    >
      {children}
    </SSEContext.Provider>
  );
}
