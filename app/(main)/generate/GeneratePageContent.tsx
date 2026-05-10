"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import PipelineView from "@/components/PipelineView";
import DesignDetailPage, { DesignDetailPageSkeleton } from "@/components/DesignDetailPage";
import { useSSE } from "@/lib/sse-context";
import { isFixtureRunId } from "@/lib/fixture-runs";

function FetchedResultView() {
  const { resultData, goHome, runAgain, isRunning } = useSSE();
  const router = useRouter();

  const isGenerating = useMemo(() => {
    const st = String(resultData?.status ?? "");
    const pendingFlag = resultData?.pending === true;
    const terminal =
      st === "failed" ||
      st === "canceled" ||
      st === "completed" ||
      st === "completed_with_warnings";
    return st === "running" || st === "processing" || pendingFlag || (!terminal && !resultData?.styleMd?.trim());
  }, [resultData?.status, resultData?.styleMd, resultData?.pending]);

  if (!resultData) {
    return <DesignDetailPageSkeleton />;
  }

  const isFixtureDemo = typeof resultData.runId === "string" && isFixtureRunId(resultData.runId);

  return (
    <DesignDetailPage
      run={resultData}
      isGenerating={isGenerating}
      isRunBusy={isRunning && !isFixtureDemo}
      onBack={() => {
        goHome();
        router.replace("/styles");
      }}

      onRunAgain={
        isFixtureDemo ?
          undefined
        : async () => {
            await runAgain();
            router.replace("/generate");
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
  const slug = searchParams.get("run")?.trim() ?? "";

  useEffect(() => {
    if (screen !== "result" || !resultData) return;
    const activeSlug = resultData.slug?.trim() || resultData.runId?.trim();
    if (!activeSlug) return;
    
    // Once the generation is complete (or if we resolved a deep-link),
    // cleanly hand off to the static viewer page.
    router.replace(`/styles/${encodeURIComponent(activeSlug)}`);
  }, [screen, resultData, router]);

  const resultDataRef = useRef(resultData);
  resultDataRef.current = resultData;

  const cancelledRef = useRef(false);
  useEffect(() => {
    if (!slug) return;
    
    // Don't call viewRun if a run is already actively in progress (e.g. restored from localStorage after refresh)
    if (screen === "running") return;
    
    // Skip fetch if resultData already matches this slug (URL sync after run completion)
    const cur = resultDataRef.current;
    const curSlug = cur?.slug?.trim() || cur?.runId?.trim();
    if (curSlug && (curSlug === slug || cur?.runId?.trim() === slug)) return;
    
    cancelledRef.current = false;
    void (async () => {
      await viewRun(slug);
    })();
    return () => {
      cancelledRef.current = true;
    };
  }, [slug, viewRun, screen]);

  useEffect(() => {
    if (slug) return;
    if (screen === "home") {
      router.replace("/");
    }
  }, [screen, router, slug]);

  if (screen === "running") return <div className="animate-fade-in"><PipelineView /></div>;
  if (screen === "result") {
    // If there's no slug in the URL, show result immediately (just finished a run)
    if (!slug) return <div className="animate-fade-in"><FetchedResultView /></div>;
    // If there's a slug, only show result when resultData matches — avoids showing stale data
    const resultSlug = resultData?.slug?.trim() || resultData?.runId?.trim();
    if (resultSlug && (resultSlug === slug || resultData?.runId?.trim() === slug)) {
      return <div className="animate-fade-in"><FetchedResultView /></div>;
    }
    // Falls through to slug loading/error block below
  }


  if (slug) {
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
    
    // If not showing result yet, and no network error, we are either still fetching
    // or waiting for React context to propagate the fetched data. Show skeleton.
    return <DesignDetailPageSkeleton />;
  }

  return null;
}
