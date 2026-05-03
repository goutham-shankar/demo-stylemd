"use client";

import type { DesignCard } from "@/lib/design-cards";

const PRODUCT_IMAGES = [
  { src: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=200&h=140&fit=crop&q=80", label: "Spring Garden Party Assortment" },
  { src: "https://images.unsplash.com/photo-1548365328-8c6db3220e4c?w=200&h=140&fit=crop&q=80", label: "Mother's Day Tin Gift Set" },
  { src: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=200&h=140&fit=crop&q=80", label: "Signature Cookie Assortment" },
  { src: "https://images.unsplash.com/photo-1621943670494-69cd74a00b8a?w=200&h=140&fit=crop&q=80", label: "Order Same-Day Delivery" },
];

export function WebsitePreview({ card }: { card: DesignCard }) {
  return (
    <div className="flex h-full flex-col overflow-hidden bg-page">
      <div className="flex-1 overflow-hidden p-3">
        <div className="h-full overflow-hidden rounded-xl border border-medium bg-surface shadow-sm">
          {card.url ? (
            <iframe
              src={card.url}
              title={card.name}
              className="border-0"
              style={{
                width: "160%",
                height: "160%",
                transform: "scale(0.625)",
                transformOrigin: "top left",
              }}
              sandbox="allow-scripts allow-same-origin"
            />
          ) : (
            <div className="flex h-full flex-col overflow-hidden">
              <div
                className="flex flex-shrink-0 items-center justify-between px-4 py-2"
                style={{ background: card.accentColor }}
              >
                <span className="text-[7px] font-semibold tracking-widest text-white/80 uppercase">
                  Cookies &amp; Gifts &nbsp;·&nbsp; Order &nbsp;·&nbsp; Bakeries
                </span>
                <span className="text-[11px] font-black italic text-white">{card.name.split(" ")[0]?.toLowerCase() ?? "brand"}</span>
                <span className="text-[9px] text-white/70">👤 🛒</span>
              </div>

              <div
                className="relative flex flex-shrink-0 items-center gap-3 overflow-hidden px-4 py-4"
                style={{ background: card.accentColor + "10" }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://images.unsplash.com/photo-1607344645866-009c320b63e0?w=250&h=200&fit=crop&q=80"
                  alt="Gift box"
                  className="h-24 w-28 flex-shrink-0 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <h3 className="mb-1 text-sm font-black leading-tight" style={{ color: card.accentColor }}>
                    {card.heroHeadline}
                  </h3>
                  <p className="mb-2.5 text-[8px] leading-relaxed text-secondary">
                    Hint: we&apos;re fairly confident she&apos;d rather have cookies than carnations
                  </p>
                  <button
                    className="rounded-md px-3 py-1 text-[8px] font-bold text-white"
                    style={{ background: card.accentColor }}
                    type="button"
                  >
                    SHOP ALL COOKIES
                  </button>
                </div>
              </div>

              <div className="flex flex-shrink-0 items-center justify-around border-y border-light bg-amber-50 px-2 py-1">
                {["🏙 Made in NYC", "🍪 Baked Fresh Daily", "📦 Same-Day", "❤️ 30 Yrs"].map((t) => (
                  <span key={t} className="flex-shrink-0 text-[6.5px] font-medium text-amber-800">{t}</span>
                ))}
              </div>

              <div className="flex-1 overflow-hidden bg-white p-3">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-[9px] font-bold text-primary">Shop Fan Favorites</span>
                  <span className="text-[7px] font-semibold text-secondary">SHOP ALL →</span>
                </div>
                <div className="grid grid-cols-4 gap-1.5">
                  {PRODUCT_IMAGES.map((product, i) => (
                    <div key={i} className="flex flex-col gap-1">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={product.src} alt={product.label} className="h-14 w-full rounded-md object-cover" />
                      <p className="text-[6.5px] font-semibold leading-tight text-primary">{product.label}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-shrink-0 items-center gap-3 bg-[#1a1a2e] px-4 py-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=200&h=150&fit=crop&q=80"
                  alt="Cookies"
                  className="h-14 w-14 flex-shrink-0 rounded-lg object-cover"
                />
                <div>
                  <h4 className="mb-0.5 text-xs font-black leading-tight" style={{ color: card.accentColor }}>
                    Big Cookies Baked in the Big Apple
                  </h4>
                  <p className="text-[7px] leading-relaxed text-gray-400">
                    Proudly baked daily since 1995 with simple ingredients and a lotta love.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
