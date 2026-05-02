"use client";

import Hero from "@/components/Hero";
import IntegrationLogos from "@/components/IntegrationLogos";
import StyleLibrary from "@/components/StyleLibrary";
import PipelineView from "@/components/PipelineView";
import ResultView from "@/components/ResultView";
import { useSSE } from "@/lib/sse-context";

function NetworkErrorBanner() {
  const { networkError, dismissNetworkError } = useSSE();
  if (!networkError) return null;
  return (
    <div className="fixed top-16 left-0 right-0 z-40 flex justify-center px-4 pt-2">
      <div className="flex items-center gap-3 px-4 py-2.5 bg-red-50 border border-red-200 rounded-xl shadow-md text-sm font-manrope text-red-700 max-w-xl w-full">
        <span className="flex-1">{networkError}</span>
        <button
          type="button"
          onClick={dismissNetworkError}
          className="text-red-400 hover:text-red-600 font-bold text-base leading-none"
          aria-label="Dismiss"
        >
          ✕
        </button>
      </div>
    </div>
  );
}

export default function Home() {
  const { screen } = useSSE();

  return (
    <main className="w-full">
      <NetworkErrorBanner />
      {screen === "home" && (
        <>
          <Hero />
          <IntegrationLogos />
          <StyleLibrary />
        </>
      )}
      {screen === "running" && <PipelineView />}
      {screen === "result" && <ResultView />}
    </main>
  );
}
