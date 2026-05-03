"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import PipelineView from "@/components/PipelineView";
import DesignDetailPage from "@/components/DesignDetailPage";
import { useSSE } from "@/lib/sse-context";
import { isFixtureRunId } from "@/lib/fixture-runs";

function FetchedResultView() {
  const { resultData, goHome, runAgain, isRunning } = useSSE();
  const router = useRouter();

  const isGenerating = useMemo(() => {
    const st = String(resultData?.status ?? "");
    const terminal =
      st === "failed" ||
      st === "canceled" ||
      st === "completed" ||
      st === "completed_with_warnings";
    return st === "running" || (!terminal && !resultData?.styleMd?.trim());
  }, [resultData?.status, resultData?.styleMd]);

  if (!resultData) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div
          className="h-8 w-8 animate-spin rounded-full border-2 border-t-transparent"
          style={{ borderColor: "var(--cta)", borderTopColor: "transparent" }}
        />
      </div>
    );
  }

  const isFixtureDemo = typeof resultData.runId === "string" && isFixtureRunId(resultData.runId);

  return (
    <DesignDetailPage
      run={resultData}
      isGenerating={isGenerating}
      isRunBusy={isRunning && !isFixtureDemo}
      useDynamicUITemplate={true}
      templateRunId="levainbakery-2"
      onBack={() => {
        goHome();
        router.push("/");
      }}
      onRunAgain={
        isFixtureDemo ?
          undefined
        : async () => {
            await runAgain();
            router.push("/generate");
          }
      }
    />
  );
}

function DeepLinkError({
  message,
  onBack,
}: {
  message: string;
  onBack: () => void;
}) {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 px-4 text-center">
      <p className="max-w-md text-sm text-secondary font-manrope">{message}</p>
      <button
        type="button"
        onClick={onBack}
        className="rounded-xl border border-medium bg-surface px-4 py-2 text-sm font-semibold text-primary hover:bg-surface-soft"
      >
        Back to home
      </button>
    </div>
  );
}

export default function GeneratePageContent() {
  const { screen, resultData, viewRun, networkError, dismissNetworkError, goHome } = useSSE();
  const router = useRouter();
  const searchParams = useSearchParams();
  const runParam = searchParams.get("run")?.trim() ?? "";

  useEffect(() => {
    if (screen !== "result" || !resultData) return;
    const key = resultData.slug?.trim() || resultData.runId?.trim();
    if (!key) return;
    const current = searchParams.get("run")?.trim();
    if (current === key) return;
    router.replace(`/generate?run=${encodeURIComponent(key)}`, { scroll: false });
  }, [screen, resultData, searchParams, router]);

  const [deepFetchSettled, setDeepFetchSettled] = useState(false);

  useEffect(() => {
    if (!runParam) {
      setDeepFetchSettled(false);
      return;
    }
    setDeepFetchSettled(false);
    let cancelled = false;
    void (async () => {
      await viewRun(runParam);
      if (!cancelled) setDeepFetchSettled(true);
    })();
    return () => {
      cancelled = true;
    };
  }, [runParam, viewRun]);

  useEffect(() => {
    if (runParam) return;
    if (screen === "home") {
      router.replace("/");
    }
  }, [screen, router, runParam]);

  if (screen === "running") return <PipelineView />;
  if (screen === "result") return <FetchedResultView />;

  if (runParam) {
    if (!deepFetchSettled) {
      return (
        <div className="flex min-h-[50vh] items-center justify-center">
          <div
            className="h-8 w-8 animate-spin rounded-full border-2 border-t-transparent"
            style={{ borderColor: "var(--cta)", borderTopColor: "transparent" }}
          />
        </div>
      );
    }
    if (networkError) {
      return (
        <DeepLinkError
          message={networkError}
          onBack={() => {
            dismissNetworkError();
            goHome();
            router.replace("/");
          }}
        />
      );
    }
    return (
      <DeepLinkError
        message="Could not open this run. Check the link or try again from the home page."
        onBack={() => {
          goHome();
          router.replace("/");
        }}
      />
    );
  }

  return null;
}
