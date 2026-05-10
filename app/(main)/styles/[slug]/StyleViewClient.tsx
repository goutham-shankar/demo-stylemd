"use client";

import { useRouter } from "next/navigation";
import DesignDetailPage from "@/components/DesignDetailPage";
import type { RunData } from "@/lib/api-types";

export default function StyleViewClient({ runData }: { runData: RunData }) {
  const router = useRouter();

  return (
    <div className="animate-fade-in">
      <DesignDetailPage
        run={runData}
        isGenerating={false}
        isRunBusy={false}
        onBack={() => {
          router.push("/styles");
        }}
        onRunAgain={() => {
          // If the user wants to run it again, send them to the generate page
          router.push(`/generate?run=${encodeURIComponent(runData.slug || runData.runId)}&force=true`);
        }}
      />
    </div>
  );
}
