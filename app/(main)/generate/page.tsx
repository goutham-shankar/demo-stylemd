import type { Metadata } from "next";
import { Suspense } from "react";
import GeneratePageContent from "./GeneratePageContent";
import { API_BASE } from "@/lib/api-config";

type PageSearchParams = { run?: string | string[] };

export async function generateMetadata({
  searchParams,
}: {
  searchParams: PageSearchParams;
}): Promise<Metadata> {
  const slug = Array.isArray(searchParams.run)
    ? searchParams.run[0]?.trim()
    : searchParams.run?.trim();

  const defaultMeta: Metadata = {
    title: "DesignProbe - Design Makeover for Lovable",
    description: "Give your Lovable project a design makeover with our design service",
  };

  if (!slug) return defaultMeta;

  try {
    const res = await fetch(
      `${API_BASE}/api/stylemd/by-slug/${encodeURIComponent(slug)}`,
      { next: { revalidate: 60 } }
    );
    if (!res.ok) return defaultMeta;
    const json = await res.json();
    const data = json.data as {
      url?: string;
      title?: string;
      screenshot?: string;
      brandAssets?: { ogImage?: string; logo?: string };
    } | undefined;
    if (!data) return defaultMeta;

    let hostname = String(data.url ?? "");
    try { hostname = new URL(hostname).hostname.replace(/^www\./, ""); } catch { /* leave as-is */ }

    const siteName = data.title ? String(data.title) : hostname;
    const pageTitle = `${siteName} Design System | DesignProbe`;
    const description = `Explore the design system, colors, typography, and components for ${hostname}.`;
    const image = data.screenshot || data.brandAssets?.ogImage;

    return {
      title: pageTitle,
      description,
      openGraph: {
        title: pageTitle,
        description,
        type: "website",
        ...(image ? { images: [{ url: image, width: 1200, height: 630, alt: siteName }] } : {}),
      },
      twitter: {
        card: image ? "summary_large_image" : "summary",
        title: pageTitle,
        description,
        ...(image ? { images: [image] } : {}),
      },
    };
  } catch {
    return defaultMeta;
  }
}

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

