"use client";

import React, { useState } from "react";
import { Search, Lock } from "lucide-react";
import Link from "next/link";
import { designCards } from "@/lib/design-cards";

type Card = {
  title: string;
  slug: string;
  category: string;
  trending: boolean;
  preview: React.ReactNode;
};

// Slugs that have full design data — all others are "Coming Soon"
const AVAILABLE_SLUGS = new Set(designCards.map((c) => c.id));

export default function StyleLibrary() {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const leftTabs = ["All", "Trending"];
  const rightTabs = ["SaaS", "Fintech", "Ecommerce", "Consumer", "Hardware", "Logistics"];

  const cards: Card[] = [
    {
      title: "Levain Bakery",
      slug: "levainbakery",
      category: "consumer",
      trending: true,
      preview: (
        <div className="h-full flex flex-col items-center justify-center bg-[#f5f0e8] px-6 text-center gap-2">
          <div className="w-14 h-14 rounded-2xl bg-[#2d2417] flex items-center justify-center mb-1">
            <span className="text-white text-2xl font-black">L</span>
          </div>
          <span className="text-[#2d2417] text-xl font-black tracking-tight">Levain Bakery</span>
          <span className="text-[#8a7560] text-xs font-medium">NYC Cookie Icons Since 1995</span>
        </div>
      ),
    },
    {
      title: "Figma",
      slug: "figma",
      category: "saas",
      trending: true,
      preview: (
        <div className="h-full flex items-center justify-center gap-4 bg-[#c4a8e0]">
          <div className="w-14 h-14 bg-black rounded-2xl flex items-center justify-center">
            <svg width="28" height="28" viewBox="0 0 38 57" fill="none">
              <path d="M19 28.5C19 23.2533 23.2533 19 28.5 19C33.7467 19 38 23.2533 38 28.5C38 33.7467 33.7467 38 28.5 38C23.2533 38 19 33.7467 19 28.5Z" fill="#1ABCFE" />
              <path d="M0 47.5C0 42.2533 4.25329 38 9.5 38H19V47.5C19 52.7467 14.7467 57 9.5 57C4.25329 57 0 52.7467 0 47.5Z" fill="#0ACF83" />
              <path d="M19 0V19H28.5C33.7467 19 38 14.7467 38 9.5C38 4.25329 33.7467 0 28.5 0H19Z" fill="#FF7262" />
              <path d="M0 9.5C0 14.7467 4.25329 19 9.5 19H19V0H9.5C4.25329 0 0 4.25329 0 9.5Z" fill="#F24E1E" />
              <path d="M0 28.5C0 33.7467 4.25329 38 9.5 38H19V19H9.5C4.25329 19 0 23.2533 0 28.5Z" fill="#FF7262" />
            </svg>
          </div>
          <span className="text-3xl font-bold text-white">Figma</span>
        </div>
      ),
    },
    {
      title: "Supabase",
      slug: "supabase",
      category: "saas",
      trending: true,
      preview: (
        <div className="h-full flex flex-col items-center justify-center bg-[#111] text-center px-4">
          <div className="flex items-center gap-1.5 mb-3">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="#3ecf8e"><path d="M11.9 1.036c-.015-.986-1.26-1.41-1.874-.637L.764 12.05C.203 12.78.752 13.9 1.686 13.9h9.216l.028 9.072c.015.986 1.26 1.409 1.875.636l9.261-11.649c.56-.73.012-1.85-.923-1.85h-9.216L11.9 1.036z" /></svg>
            <span className="text-[#3ecf8e] text-xs font-semibold tracking-wide">supabase</span>
          </div>
          <p className="text-white text-lg font-bold leading-tight">Build in a weekend</p>
          <p className="text-[#3ecf8e] text-lg font-bold">Scale to millions</p>
        </div>
      ),
    },
    {
      title: "Linear",
      slug: "linear",
      category: "saas",
      trending: false,
      preview: (
        <div className="h-full flex items-center justify-center gap-3 bg-gradient-to-br from-[#1a1a2e] to-[#16213e]">
          <svg width="36" height="36" viewBox="0 0 100 100" fill="none">
            <path d="M1.22541 61.5228c-.2225-.9485.90748-1.5459 1.59638-.857l36.3024 36.3024c.6889.6889.0915 1.8189-.857 1.5964C20.0515 94.0514 5.9486 79.9485 1.22541 61.5228zM.00189135 46.8891c-.01764375.2652.08641935.5244.28127.7073l52.1148 52.1148c.1829.1949.4421.2989.7073.2813C74.2964 97.8443 97.8443 74.2964 99.7924 47.1124c.0177-.2652-.0864-.5244-.2813-.7073L47.3963.281271c-.1829-.194937-.4421-.298983-.7073-.281271C20.0515 2.15568-2.15568 20.0515.00189135 46.8891z" fill="white" opacity=".4" />
            <path d="M4.83896 78.9088L78.9088 4.83896c8.5657 5.50186 15.6845 13.04654 20.4821 22.05974L26.9685 99.3911C17.9553 94.5935 10.3407 87.4746 4.83896 78.9088z" fill="white" />
          </svg>
          <span className="text-white text-2xl font-bold tracking-tight">Linear</span>
        </div>
      ),
    },
    {
      title: "Notion",
      slug: "notion",
      category: "saas",
      trending: false,
      preview: (
        <div className="h-full relative flex flex-col items-center justify-center bg-[#1b1f3b] overflow-hidden px-4">
          <div className="absolute inset-0 opacity-30">
            {[
              { emoji: "🤖", x: "15%", y: "20%" },
              { emoji: "📧", x: "25%", y: "65%" },
              { emoji: "🎯", x: "70%", y: "15%" },
              { emoji: "⚙️", x: "60%", y: "70%" },
              { emoji: "🔧", x: "80%", y: "45%" },
            ].map((item, i) => (
              <span key={i} className="absolute text-xl" style={{ left: item.x, top: item.y }}>{item.emoji}</span>
            ))}
          </div>
          <p className="text-white text-lg font-bold text-center relative z-10 mb-3">Your 24/7 AI team</p>
          <div className="flex items-center gap-1.5 relative z-10">
            <div className="w-5 h-5 bg-white rounded flex items-center justify-center">
              <span className="text-[10px] font-bold text-black">N</span>
            </div>
            <span className="text-white text-sm font-semibold">Notion</span>
          </div>
        </div>
      ),
    },
    {
      title: "Snapchat",
      slug: "snapchat",
      category: "consumer",
      trending: false,
      preview: (
        <div className="h-full flex items-center justify-center bg-[#FFFC00]">
          <svg width="80" height="80" viewBox="0 0 24 24" fill="black">
            <path d="M12.166.006C9.448-.026 6.83 1.108 5.05 3.154c-1.182 1.31-1.755 3.016-1.93 4.74-.09.87-.06 1.74-.057 2.613-.41.21-.843.32-1.29.3-.41-.01-.82.13-1.12.39-.31.26-.49.64-.49 1.03 0 .86.75 1.41 1.55 1.59.19.04.39.07.58.09-.09.36-.24.7-.45 1.01-.48.69-1.17 1.2-1.95 1.49-.41.15-.65.58-.55 1.01.06.25.22.47.44.6.91.53 1.9.9 2.93 1.09.07.32.13.64.17.97.04.31.24.58.52.71.28.13.6.11.87-.04.56-.3 1.09-.64 1.66-.93.5-.26 1.03-.44 1.57-.44.54 0 1.07.17 1.56.44.55.3 1.06.63 1.63.93.27.15.59.17.87.04.28-.13.48-.4.52-.71.04-.33.1-.65.17-.97 1.03-.19 2.02-.56 2.93-1.09.22-.13.38-.35.44-.6.1-.43-.14-.86-.55-1.01-.78-.29-1.47-.8-1.95-1.49-.21-.31-.36-.65-.45-1.01.19-.02.39-.05.58-.09.8-.18 1.55-.73 1.55-1.59 0-.39-.18-.77-.49-1.03-.3-.26-.71-.4-1.12-.39-.45.01-.88-.09-1.29-.3.003-.873.033-1.743-.057-2.613-.175-1.724-.748-3.43-1.93-4.74C15.315 1.12 12.72-.026 12.166.006z" />
          </svg>
        </div>
      ),
    },
    {
      title: "Lovable",
      slug: "lovable",
      category: "saas",
      trending: true,
      preview: (
        <div className="h-full flex flex-col items-start justify-center px-5 bg-gradient-to-br from-[#1a0533] via-[#3d1063] to-[#e040a0] relative overflow-hidden">
          <div className="mb-2 flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-red-400 to-purple-500" />
            <span className="text-white text-xl font-bold">Lovable</span>
          </div>
          <p className="text-white/70 text-xs mb-4">Build apps and websites by chatting with AI</p>
          <div className="w-full bg-white/10 backdrop-blur rounded-xl px-3 py-2 flex items-center justify-between">
            <span className="text-white/60 text-xs">Build something lovable</span>
            <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="3"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Firebase",
      slug: "firebase",
      category: "saas",
      trending: false,
      preview: (
        <div className="h-full flex items-center justify-center bg-[#1c1c1c] gap-3">
          <svg width="40" height="40" viewBox="0 0 32 32" fill="none">
            <path d="M5.35 24.6l.9-13.4 6.15-10.6 3.45 6.35L5.35 24.6z" fill="#FFA000" />
            <path d="M21.65 11.55L17.4 4.5l-1.55 2.95 5.8 17.15 5.35-3.1-5.35-10z" fill="#F57F17" />
            <path d="M5.35 24.6l10.5-6.2 10.5 6.2-10.5 6.2-10.5-6.2z" fill="#FFCA28" />
            <path d="M15.85 18.4L5.35 24.6l10.5 6.2V18.4z" fill="#FFA000" />
          </svg>
          <span className="text-white text-2xl font-bold">Firebase</span>
        </div>
      ),
    },
    {
      title: "Shopify",
      slug: "shopify",
      category: "ecommerce",
      trending: false,
      preview: (
        <div className="h-full flex items-center justify-center bg-[#96bf48] gap-3">
          <svg width="44" height="44" viewBox="0 0 109 124" fill="white">
            <path d="M74.7 14.8s-.3-.2-.8-.3c-.5-.1-13.6-1-13.6-1S50.1 3.5 48.9 2.3C47.7 1.1 45.4.7 43.5.5L38 124l36.7-7.9L99 14.8c.1 0-24.3 0-24.3 0zm-17 4.1L52 38.4c-2.5-1.3-5.3-2-8.2-2-11 0-11.6 6.9-11.6 8.6 0 9.4 24.7 13 24.7 33.3 0 16.5-10.5 27.1-24.6 27.1-16.9 0-25.5-10.5-25.5-10.5l4.5-14.9s8.9 7.6 16.4 7.6c4.9 0 6.9-3.8 6.9-6.6 0-11.6-20.2-12.1-20.2-30.6 0-15.7 11.3-31 34-31 8.7 0 13.3 2.5 13.3 2.5z" />
          </svg>
          <span className="text-white text-2xl font-bold">Shopify</span>
        </div>
      ),
    },
    {
      title: "Stripe",
      slug: "stripe",
      category: "fintech",
      trending: true,
      preview: (
        <div className="h-full flex items-center justify-center bg-gradient-to-br from-[#635bff] to-[#8b5cf6]">
          <span className="text-white text-3xl font-black tracking-tighter">stripe</span>
        </div>
      ),
    },
    {
      title: "Spotify",
      slug: "spotify",
      category: "consumer",
      trending: true,
      preview: (
        <div className="h-full flex flex-col items-center justify-center bg-[#121212] gap-3">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="#1DB954">
            <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
          </svg>
          <span className="text-white text-xl font-bold">Spotify</span>
        </div>
      ),
    },
  ];

  const filteredCards = cards.filter((card) => {
    const matchesSearch =
      !searchQuery || card.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab =
      activeTab === "all" ||
      (activeTab === "trending" && card.trending) ||
      card.category === activeTab;
    return matchesSearch && matchesTab;
  });

  return (
    <section className="py-12 md:py-16 bg-page">
      <div className="container-custom max-w-6xl mx-auto px-6">

        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 mb-8">
          <div>
            <p className="text-[10px] font-bold text-secondary uppercase tracking-[0.2em] mb-1 font-manrope">Reference Library</p>
            <h2 className="heading-h2 text-primary">Style Library</h2>
          </div>

          <div className="relative w-full md:w-72">
            <Search className="absolute left-4 top-3 text-secondary" size={18} aria-hidden />
            <input
              type="search"
              aria-label="Search styles"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 bg-surface border border-medium rounded-[10px] text-sm placeholder-secondary focus:outline-none focus-visible:ring-2 focus-visible:ring-light"
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 mb-8">
          <div className="flex items-center gap-2 bg-surface border border-medium rounded-[12px] p-1">
            {leftTabs.map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab.toLowerCase())}
                aria-pressed={activeTab === tab.toLowerCase()}
                className={`px-5 py-1.5 rounded-[12px] text-sm font-semibold transition-all duration-150 ${
                  activeTab === tab.toLowerCase() ? "bg-cta text-white" : "text-muted hover:bg-[#f7f4ee]"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap gap-2">
            {rightTabs.map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab.toLowerCase())}
                aria-pressed={activeTab === tab.toLowerCase()}
                className={`px-4 py-1.5 text-sm font-semibold transition-all border rounded-[10px] ${
                  activeTab === tab.toLowerCase()
                    ? "bg-cta text-white border-transparent"
                    : "bg-surface text-muted border-medium hover:bg-[#f7f4ee]"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {filteredCards.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <p className="text-lg font-semibold text-primary mb-2">No styles found</p>
            <p className="text-sm text-secondary">Try a different search term or filter.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCards.map((card) => {
              const isAvailable = AVAILABLE_SLUGS.has(card.slug);
              const inner = (
                <>
                  <div className="h-48 overflow-hidden relative">
                    {card.preview}
                    {!isAvailable && (
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center backdrop-blur-[1px]">
                        <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-white text-xs font-bold backdrop-blur-sm">
                          <Lock size={11} />
                          Coming Soon
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="px-5 py-4 flex items-center justify-between bg-surface">
                    <h3 className="text-lg font-bold text-primary">{card.title}</h3>
                    {isAvailable ? (
                      <span className="px-5 py-2 bg-cta text-white rounded-[10px] font-semibold text-sm shadow-sm group-hover:opacity-90 group-hover:shadow-md transition-all duration-150">
                        View now
                      </span>
                    ) : (
                      <span className="px-5 py-2 bg-surface-soft text-muted rounded-[10px] font-semibold text-sm border border-medium">
                        Coming Soon
                      </span>
                    )}
                  </div>
                </>
              );

              return isAvailable ? (
                <Link
                  key={card.title}
                  href={`/styles/${card.slug}`}
                  className="group block overflow-hidden border border-light bg-surface shadow-sm hover:border-dark hover:shadow-md transition-all duration-150 focus-visible:outline-2 focus-visible:outline-offset-2"
                  style={{ borderRadius: 16 }}
                >
                  {inner}
                </Link>
              ) : (
                <div
                  key={card.title}
                  className="block overflow-hidden border border-light bg-surface cursor-default"
                  style={{ borderRadius: 16 }}
                >
                  {inner}
                </div>
              );
            })}
          </div>
        )}

      </div>
    </section>
  );
}
