import { Suspense } from "react";
import GeneratePageContent from "./GeneratePageContent";

function GenerateFallback() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <div
        className="h-8 w-8 animate-spin rounded-full border-2 border-t-transparent"
        style={{ borderColor: "var(--cta)", borderTopColor: "transparent" }}
      />
    </div>
  );
}

export default function GeneratePage() {
  return (
    <Suspense fallback={<GenerateFallback />}>
      <GeneratePageContent />
    </Suspense>
  );
}
