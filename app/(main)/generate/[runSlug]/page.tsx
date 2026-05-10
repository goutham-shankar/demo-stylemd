"use client";

import { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";

/**
 * Pretty permalink: /generate/my-run-slug → same behavior as /generate?run=my-run-slug
 */
export default function GenerateRunSlugRedirectPage() {
  const router = useRouter();
  const params = useParams();
  const runSlug = typeof params.runSlug === "string" ? params.runSlug : "";

  useEffect(() => {
    if (!runSlug) {
      router.replace("/generate");
      return;
    }
    router.replace(`/styles/${encodeURIComponent(runSlug)}`);
  }, [router, runSlug]);

  return (
    <div className="flex min-h-[40vh] items-center justify-center">
      <div
        className="h-8 w-8 animate-spin rounded-full border-2 border-t-transparent"
        style={{ borderColor: "var(--cta)", borderTopColor: "transparent" }}
      />
    </div>
  );
}
