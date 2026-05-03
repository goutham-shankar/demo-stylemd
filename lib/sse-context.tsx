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

export const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? "";

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
  | { type: "GO_HOME" };

const initialState: AppState = {
  screen: "home",
  runs: [],
  activeRun: null,
  resultData: null,
  isRunning: false,
  networkError: null,
  runError: null,
};

function reducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case "SET_SCREEN":
      return { ...state, screen: action.screen };

    case "SET_RUNS":
      return { ...state, runs: action.runs };

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

    case "SET_RESULT":
      return {
        ...state,
        resultData: action.data,
        isRunning: false,
        screen: "result",
        runs: state.runs.map((r) =>
          r.id === action.data.runId || r.slug === action.data.slug
            ? { ...r, status: "completed" }
            : r
        ),
      };

    case "NETWORK_ERROR":
      return { ...state, networkError: action.error };

    case "RUN_ERROR":
      return { ...state, runError: action.error, isRunning: false };

    case "GO_HOME":
      return {
        ...state,
        screen: "home",
        activeRun: null,
        resultData: null,
        runError: null,
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

export function SSEProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const esRef = useRef<EventSource | null>(null);
  const deadRef = useRef(false);

  const fetchRuns = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/api/stylemd/runs`);
      if (!res.ok) return;
      const data = await res.json();
      if (data.ok && Array.isArray(data.summaries)) {
        dispatch({ type: "SET_RUNS", runs: data.summaries });
      }
    } catch {
      // silently ignore; not critical
    }
  }, []);

  // SSE connection – defined once after mount
  useEffect(() => {
    deadRef.current = false;

    function connect() {
      if (deadRef.current) return;

      const es = new EventSource(`${API_BASE}/api/session/events`);
      esRef.current = es;

      // All events arrive as unnamed "message" events wrapped in an envelope:
      // { type: "event", payload: PlaygroundEvent } or { type: "state_sync", payload: ... }
      es.onmessage = (e: MessageEvent) => {
        if (deadRef.current) return;
        let envelope: { type: string; payload: Record<string, unknown> };
        try { envelope = JSON.parse(e.data); } catch { return; }

        if (envelope.type === "state_sync") {
          fetchRuns();
          return;
        }
        if (envelope.type !== "event") return;

        const event = envelope.payload as Record<string, unknown> & { type: string };
        switch (event.type) {
          case "stylemd_run_started": {
            const data = event as unknown as SSERunStarted;
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
            if (data.status === "completed") {
              const showcaseUrl = data.showcase?.canonicalUrl;
              fetch(`${API_BASE}/api/stylemd/by-slug/${data.runId}`)
                .then((r) => r.json())
                .then((runRes) => {
                  if (runRes.ok && !deadRef.current) {
                    setTimeout(() => {
                      if (!deadRef.current) {
                        const runData = { ...runRes.data, ...(showcaseUrl ? { showcaseUrl } : {}) };
                        dispatch({ type: "SET_RESULT", data: runData });
                        fetchRuns();
                      }
                    }, 1500);
                  }
                })
                .catch(() => {
                  dispatch({ type: "RUN_ERROR", error: "Run completed but failed to fetch results" });
                });
            } else {
              dispatch({ type: "RUN_ERROR", error: data.error ?? "Pipeline failed" });
            }
            break;
          }
        }
      };

      es.onerror = () => {
        es.close();
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
      if (state.isRunning) return;

      dispatch({ type: "NETWORK_ERROR", error: null });
      dispatch({ type: "RUN_ERROR", error: null });

      // Optimistic: add to library immediately with "running" status
      let hostname = url;
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
        const res = await fetch(`${API_BASE}/api/stylemd-artifacts/run`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url, provider }),
        });

        if (res.status === 409) {
          dispatch({ type: "RUN_ERROR", error: "Pipeline busy, try again shortly" });
          return;
        }
        if (!res.ok) throw new Error(`Server error: ${res.status}`);

        const data: { ok: boolean; runId: string } = await res.json();

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
    try {
      const res = await fetch(`${API_BASE}/api/stylemd/by-slug/${slugOrId}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (data.ok) dispatch({ type: "SET_RESULT", data: data.data });
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
    try {
      await fetch(`${API_BASE}/api/stylemd`, { method: "DELETE" });
    } catch { /* ignore */ }
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
