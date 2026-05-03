"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import PipelineView from "@/components/PipelineView";
import ResultView from "@/components/ResultView";
import { useSSE } from "@/lib/sse-context";

export default function GeneratePage() {
  const { screen } = useSSE();
  const router = useRouter();

  // Redirect to home if nothing is running (e.g. direct navigation)
  useEffect(() => {
    if (screen === "home") {
      router.replace("/");
    }
  }, [screen, router]);

  if (screen === "running") return <PipelineView />;
  if (screen === "result") return <ResultView />;

  // Redirecting — show nothing
  return null;
}
