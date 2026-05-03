"use client";

import { useEffect, useState } from "react";
import type { RunData } from "@/lib/api-types";
import { extractStyleMdUi } from "@/lib/stylemd-structured-view";
import { styleMdUiPayloadToDesignCard } from "@/lib/stylemd-to-design-card";
import type { DesignCard } from "@/lib/design-cards";
import { CatalogMainSections } from "@/components/CatalogMainSections";
import type { StyleMdUiPayload } from "@/lib/stylemd-structured-view";
import { API_BASE } from "@/lib/api-config";

/**
 * DynamicUIWrapper wraps generated pages with the levainbakery-2 dynamic UI
 * It fetches the levainbakery design system and applies it as a layout template
 * for all generated pages from style.md
 */
export type DynamicUIWrapperProps = {
  generatedPage: React.ReactNode; // The actual generated page content
  generatedRun?: RunData; // Optional: the run data for the generated page
  templateRunId?: string; // Template run ID (defaults to "levainbakery-2")
};

export function DynamicUIWrapper({
  generatedPage,
  generatedRun,
  templateRunId = "levainbakery-2",
}: DynamicUIWrapperProps) {
  const [templateDesign, setTemplateDesign] = useState<{
    card: DesignCard;
    payload: StyleMdUiPayload;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTemplate = async () => {
      try {
        setIsLoading(true);
        // Fetch the template design via the API
        const response = await fetch(`${API_BASE}/api/stylemd/by-slug/${encodeURIComponent(templateRunId)}`);
        if (!response.ok) throw new Error("Failed to fetch template design");

        const json = await response.json();
        if (!json.ok || !json.data) throw new Error("Could not extract design data from template");

        const payload = extractStyleMdUi(json.data.styleMd || "").payload;
        if (!payload) throw new Error("Template does not contain valid design system data");

        const card = styleMdUiPayloadToDesignCard(payload, {
          id: templateRunId,
          url: json.data.url || "",
        });

        setTemplateDesign({ card, payload });
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
        setTemplateDesign(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTemplate();
  }, [templateRunId]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-page">
        <div className="flex flex-col items-center gap-4">
          <div
            className="h-8 w-8 animate-spin rounded-full border-2 border-t-transparent"
            style={{ borderColor: "var(--cta)", borderTopColor: "transparent" }}
          />
          <p className="text-sm text-secondary font-manrope">
            Loading dynamic UI template…
          </p>
        </div>
      </div>
    );
  }

  if (error || !templateDesign) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-4 bg-page p-6 text-center">
        <p className="text-sm text-secondary font-manrope">
          Failed to load template design: {error || "Unknown error"}
        </p>
        <button
          onClick={() => window.location.reload()}
          className="rounded-lg border border-medium bg-surface px-4 py-2 text-sm font-medium text-primary hover:bg-surface-soft"
        >
          Retry
        </button>
      </div>
    );
  }

  const { card, payload } = templateDesign;

  return (
    <div className="flex min-h-screen flex-col bg-page">
      {/* Hero Section with Template Design */}
      <div className="bg-surface border-b border-medium">
        <div className="mx-auto max-w-7xl px-4 py-12 md:py-16">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-black tracking-tight">
                {payload?.brand || "Generated Design"}
              </h1>
              {payload?.description && (
                <p className="mt-2 max-w-2xl text-base text-secondary leading-relaxed">
                  {payload.description}
                </p>
              )}
              {payload?.tags?.length ? (
                <div className="mt-4 flex flex-wrap gap-2">
                  {payload.tags.map((tag) => {
                    const label = typeof tag === "string" ? tag : tag.label;
                    const accentColor = card?.accentColor ?? "#0a73eb";
                    return (
                      <span
                        key={label}
                        className="rounded-[16px] border px-3 py-1 text-xs font-medium"
                        style={{
                          borderColor: `${accentColor}55`,
                          color: accentColor,
                          backgroundColor: `${accentColor}14`,
                        }}
                      >
                        {label}
                      </span>
                    );
                  })}
                </div>
              ) : null}
            </div>
            {card?.logo && (
              <div
                className="flex h-24 w-24 flex-shrink-0 items-center justify-center rounded-[9px] text-lg font-black text-white overflow-hidden"
                style={{ backgroundColor: card?.accentColor ?? "var(--cta)" }}
              >
                {card.logo.startsWith("/") || /^https?:/i.test(card.logo) ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={card.logo} alt="" className="h-full w-full object-cover" />
                ) : (
                  <span className="text-4xl">{card.logo}</span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col lg:flex-row">
        {/* Design System Sidebar (Template) */}
        <aside className="hidden lg:flex lg:w-1/3 border-r border-medium overflow-y-auto bg-surface-soft">
          <div className="w-full p-8">
            <h2 className="heading-h3 mb-6 tracking-tight text-primary">
              Design System Reference
            </h2>
            <div className="space-y-8">
              <CatalogMainSections card={card} extras={payload} />
            </div>
          </div>
        </aside>

        {/* Generated Content Main Area */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 lg:p-12">
          <div className="space-y-8">
            {/* Generated Page Content */}
            <div className="prose prose-sm max-w-none">
              {generatedPage}
            </div>

            {/* Generated Run Info (if provided) */}
            {generatedRun && (
              <div className="mt-12 border-t border-medium pt-8">
                <details className="cursor-pointer">
                  <summary className="text-sm font-semibold text-secondary hover:text-primary">
                    Run Details
                  </summary>
                  <div className="mt-4 rounded-lg bg-surface p-4 font-mono text-xs space-y-2">
                    {generatedRun.runId && (
                      <div>
                        <span className="text-secondary">Run ID:</span>{" "}
                        <span className="text-primary">{generatedRun.runId}</span>
                      </div>
                    )}
                    {generatedRun.status && (
                      <div>
                        <span className="text-secondary">Status:</span>{" "}
                        <span className="text-primary">{generatedRun.status}</span>
                      </div>
                    )}
                    {generatedRun.provider && (
                      <div>
                        <span className="text-secondary">Provider:</span>{" "}
                        <span className="text-primary">{generatedRun.provider}</span>
                      </div>
                    )}
                  </div>
                </details>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
