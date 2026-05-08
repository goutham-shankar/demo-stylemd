"use client";

import type { DesignCard } from "@/lib/design-cards";

export function WebsitePreview({
  card,
  screenshot = card.preview || null,
}: {
  card: DesignCard;
  screenshot?: string | null;
}) {
  return (
    <div className="flex h-full flex-col overflow-hidden bg-page">
      <div className="flex-1 overflow-hidden p-3">
        <div className="h-full overflow-hidden rounded-xl border border-medium bg-surface shadow-sm">
          {screenshot ? (
            <div className="h-full w-full overflow-auto bg-[#0f0f12] p-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={screenshot}
                alt={`Screenshot of ${card.name}`}
                className="block h-auto w-full max-w-full rounded-lg shadow-sm"
              />
            </div>
          ) : (
            <div className="flex h-full items-center justify-center p-8 text-center text-sm text-secondary font-manrope">
              <div>
                <p className="mb-2 font-semibold">No Preview Available</p>
                <p className="text-xs">
                  The screenshot for {card.name} is missing or invalid.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

