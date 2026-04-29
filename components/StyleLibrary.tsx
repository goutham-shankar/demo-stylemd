"use client";

import { Search } from "lucide-react";
import { useState } from "react";

export default function StyleLibrary() {
  const [activeTab, setActiveTab] = useState("all");

  const tabs = ["All", "Trending", "SaaS", "Fintech", "Ecommerce", "Consumer", "Hardware", "Logistics"];

  const cards = [
    {
      title: "Figma",
      cardBg: "bg-[#c4a8e0]",
      preview: (
        <div className="h-full flex items-center justify-center gap-4 bg-[#c4a8e0]">
          <div className="w-14 h-14 bg-black rounded-2xl flex items-center justify-center">
            <svg width="28" height="28" viewBox="0 0 38 57" fill="none">
              <path d="M19 28.5C19 23.2533 23.2533 19 28.5 19C33.7467 19 38 23.2533 38 28.5C38 33.7467 33.7467 38 28.5 38C23.2533 38 19 33.7467 19 28.5Z" fill="#1ABCFE"/>
              <path d="M0 47.5C0 42.2533 4.25329 38 9.5 38H19V47.5C19 52.7467 14.7467 57 9.5 57C4.25329 57 0 52.7467 0 47.5Z" fill="#0ACF83"/>
              <path d="M19 0V19H28.5C33.7467 19 38 14.7467 38 9.5C38 4.25329 33.7467 0 28.5 0H19Z" fill="#FF7262"/>
              <path d="M0 9.5C0 14.7467 4.25329 19 9.5 19H19V0H9.5C4.25329 0 0 4.25329 0 9.5Z" fill="#F24E1E"/>
              <path d="M0 28.5C0 33.7467 4.25329 38 9.5 38H19V19H9.5C4.25329 19 0 23.2533 0 28.5Z" fill="#FF7262"/>
            </svg>
          </div>
          <span className="text-3xl font-bold text-black">Figma</span>
        </div>
      ),
    },
    {
      title: "Supabase",
      cardBg: "bg-[#111]",
      preview: (
        <div className="h-full flex flex-col items-center justify-center bg-[#111] text-center px-4">
          <div className="flex items-center gap-1.5 mb-3">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="#3ecf8e"><path d="M11.9 1.036c-.015-.986-1.26-1.41-1.874-.637L.764 12.05C.203 12.78.752 13.9 1.686 13.9h9.216l.028 9.072c.015.986 1.26 1.409 1.875.636l9.261-11.649c.56-.73.012-1.85-.923-1.85h-9.216L11.9 1.036z"/></svg>
            <span className="text-[#3ecf8e] text-xs font-semibold tracking-wide">supabase</span>
          </div>
          <p className="text-white text-lg font-bold leading-tight">Build in a weekend</p>
          <p className="text-[#3ecf8e] text-lg font-bold">Scale to millions</p>
        </div>
      ),
    },
    {
      title: "Linear",
      cardBg: "bg-[#1a1a2e]",
      preview: (
        <div className="h-full flex items-center justify-center gap-3 bg-gradient-to-br from-[#1a1a2e] to-[#16213e]">
          <svg width="36" height="36" viewBox="0 0 100 100" fill="none">
            <path d="M1.22541 61.5228c-.2225-.9485.90748-1.5459 1.59638-.857l36.3024 36.3024c.6889.6889.0915 1.8189-.857 1.5964C20.0515 94.0514 5.9486 79.9485 1.22541 61.5228zM.00189135 46.8891c-.01764375.2652.08641935.5244.28127.7073l52.1148 52.1148c.1829.1949.4421.2989.7073.2813C74.2964 97.8443 97.8443 74.2964 99.7924 47.1124c.0177-.2652-.0864-.5244-.2813-.7073L47.3963.281271c-.1829-.194937-.4421-.298983-.7073-.281271C20.0515 2.15568-2.15568 20.0515.00189135 46.8891zM Scanner 54.8132 5.52066l42.1582 42.1582c.3921.3921.3921 1.0277 0 1.4198L1.41980 94.4800c-.392..392-1.02769.392-1.41980 0L.00000 93.0602z" fill="white" opacity=".4"/>
            <path d="M4.83896 78.9088 78.9088 4.83896c8.5657 5.50186 15.6845 13.04654 20.4821 22.05974L26.9685 99.3911C17.9553 94.5935 10.3407 87.4746 4.83896 78.9088z" fill="white"/>
          </svg>
          <span className="text-white text-2xl font-bold tracking-tight">Linear</span>
        </div>
      ),
    },
    {
      title: "Notion",
      cardBg: "bg-[#1b1f3b]",
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
      cardBg: "bg-[#FFFC00]",
      preview: (
        <div className="h-full flex items-center justify-center bg-[#FFFC00]">
          <svg width="80" height="80" viewBox="0 0 24 24" fill="black">
            <path d="M12.166.006C9.448-.026 6.83 1.108 5.05 3.154c-1.182 1.31-1.755 3.016-1.93 4.74-.09.87-.06 1.74-.057 2.613-.41.21-.843.32-1.29.3-.41-.01-.82.13-1.12.39-.31.26-.49.64-.49 1.03 0 .86.75 1.41 1.55 1.59.19.04.39.07.58.09-.09.36-.24.7-.45 1.01-.48.69-1.17 1.2-1.95 1.49-.41.15-.65.58-.55 1.01.06.25.22.47.44.6.91.53 1.9.9 2.93 1.09.07.32.13.64.17.97.04.31.24.58.52.71.28.13.6.11.87-.04.56-.3 1.09-.64 1.66-.93.5-.26 1.03-.44 1.57-.44.54 0 1.07.17 1.56.44.55.3 1.06.63 1.63.93.27.15.59.17.87.04.28-.13.48-.4.52-.71.04-.33.1-.65.17-.97 1.03-.19 2.02-.56 2.93-1.09.22-.13.38-.35.44-.6.1-.43-.14-.86-.55-1.01-.78-.29-1.47-.8-1.95-1.49-.21-.31-.36-.65-.45-1.01.19-.02.39-.05.58-.09.8-.18 1.55-.73 1.55-1.59 0-.39-.18-.77-.49-1.03-.3-.26-.71-.4-1.12-.39-.45.01-.88-.09-1.29-.3.003-.873.033-1.743-.057-2.613-.175-1.724-.748-3.43-1.93-4.74C15.315 1.12 12.72-.026 12.166.006z"/>
          </svg>
        </div>
      ),
    },
    {
      title: "Lovable",
      cardBg: "bg-gradient-to-br from-[#1a0533] via-[#3d1063] to-[#ff6b9d]",
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
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="3"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Firebase",
      cardBg: "bg-[#0d0d0d]",
      preview: (
        <div className="h-full flex items-center justify-center bg-[#0d0d0d] gap-3">
          <svg width="40" height="40" viewBox="0 0 32 32" fill="none">
            <path d="M5.35 24.6l.9-13.4 6.15-10.6 3.45 6.35L5.35 24.6z" fill="#FFA000"/>
            <path d="M21.65 11.55L17.4 4.5l-1.55 2.95 5.8 17.15 5.35-3.1-5.35-10z" fill="#F57F17"/>
            <path d="M5.35 24.6l10.5-6.2 10.5 6.2-10.5 6.2-10.5-6.2z" fill="#FFCA28"/>
            <path d="M15.85 18.4L5.35 24.6l10.5 6.2V18.4z" fill="#FFA000"/>
          </svg>
          <span className="text-white text-2xl font-bold">Firebase</span>
        </div>
      ),
    },
    {
      title: "Shopify",
      cardBg: "bg-[#96bf48]",
      preview: (
        <div className="h-full flex items-center justify-center bg-[#96bf48] gap-3">
          <svg width="44" height="44" viewBox="0 0 109 124" fill="white">
            <path d="M74.7 14.8s-.3-.2-.8-.3c-.5-.1-13.6-1-13.6-1S50.1 3.5 48.9 2.3C47.7 1.1 45.4.7 43.5.5L38 124l36.7-7.9L99 14.8c.1 0-24.3 0-24.3 0zm-17 4.1L52 38.4c-2.5-1.3-5.3-2-8.2-2-11 0-11.6 6.9-11.6 8.6 0 9.4 24.7 13 24.7 33.3 0 16.5-10.5 27.1-24.6 27.1-16.9 0-25.5-10.5-25.5-10.5l4.5-14.9s8.9 7.6 16.4 7.6c4.9 0 6.9-3.8 6.9-6.6 0-11.6-20.2-12.1-20.2-30.6 0-15.7 11.3-31 34-31 8.7 0 13.3 2.5 13.3 2.5z"/>
          </svg>
          <span className="text-white text-2xl font-bold">Shopify</span>
        </div>
      ),
    },
    {
      title: "Stripe",
      cardBg: "bg-[#635bff]",
      preview: (
        <div className="h-full flex items-center justify-center bg-gradient-to-br from-[#635bff] to-[#8b5cf6] gap-3">
          <svg width="44" height="44" viewBox="0 0 60 25" fill="white">
            <path d="M59.64 14.28h-8.06c.19 1.93 1.6 2.55 3.2 2.55 1.64 0 2.96-.37 4.05-.95v3.32a8.33 8.33 0 0 1-4.56 1.1c-4.01 0-6.83-2.5-6.83-7.48 0-4.19 2.39-7.52 6.3-7.52 3.92 0 5.96 3.28 5.96 7.5 0 .4-.04 1.26-.06 1.48zm-5.92-5.62c-1.03 0-2.17.73-2.17 2.58h4.25c0-1.85-1.07-2.58-2.08-2.58zM40.95 20.3c-1.44 0-2.32-.6-2.9-1.04l-.02 4.63-4.44.97V6.28h3.94l.19 1.06c.64-.72 1.8-1.39 3.29-1.39 3.65 0 5.64 3.08 5.64 7.17 0 4.3-2.05 7.18-5.7 7.18zm-.95-10.71c-.97 0-1.56.35-1.97.81l.03 6.12c.38.43.97.78 1.94.78 1.52 0 2.27-1.63 2.27-3.87 0-2.19-.76-3.84-2.27-3.84zM28.24 5.7c-1.44 0-2.32 1.07-2.32 2.4 0 1.32.88 2.4 2.32 2.4s2.32-1.08 2.32-2.4c0-1.33-.88-2.4-2.32-2.4zM26.08 20.3V6.28h4.44V20.3h-4.44zM19.69 6.28h-2.41V3.77l-4.45.97v1.54H10.4V2.93c0-.8.38-1.32 1.18-1.32h2.3V0L9.46.97C8 1.33 7.18 2.38 7.18 4.12v2.16H5.45v3.36h1.73V20.3h4.44V9.64h2.41l.38-3.36h-2.79V4.75c0-.5.19-.78.7-.78h2.09V2.93h-2.09C10.3 2.93 9.46 3.77 9.46 4.93v1.35H7.18v3.36h2.28V20.3h4.44V9.64H16.3l.38-3.36h-2.83V4.96c0-.73.33-1.03.88-1.03h1.55V1.9h-1.55C13.2 1.9 12 3.14 12 4.96v1.32H9.46"/>
          </svg>
        </div>
      ),
    },
  ];

  const leftTabs = ["All", "Trending"];
  const rightTabs = ["SaaS", "Fintech", "Ecommerce", "Consumer", "Hardware", "Logistics"];

  return (
    <section className="py-12 md:py-16 bg-[#f6f8fa]">
      <div className="container-custom max-w-6xl mx-auto px-6">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 mb-8">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold text-[#0d0d0d]">Style Library</h2>
          </div>
          <div className="relative w-full md:w-72">
            <Search className="absolute left-4 top-3 text-[#aaa]" size={18} aria-hidden />
            <input
              type="search"
              aria-label="Search styles"
              placeholder="Search"
              className="w-full pl-11 pr-4 py-2.5 bg-white border border-black/[0.1] rounded-2xl text-sm placeholder-[#aaa] focus:outline-none focus-visible:ring-2 focus-visible:ring-black/[0.06]"
            />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2 bg-white border border-black/[0.08] rounded-full p-1">
            {leftTabs.map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab.toLowerCase())}
                aria-pressed={activeTab === tab.toLowerCase()}
                className={`px-5 py-1.5 rounded-full text-sm font-semibold transition-all ${
                  activeTab === tab.toLowerCase() ? "bg-[#3b82f6] text-white" : "text-[#5f5b56] hover:bg-gray-50"
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
                className={`px-4 py-1.5 text-sm font-semibold transition-all border ${
                  activeTab === tab.toLowerCase()
                    ? "bg-[#0d0d0d] text-white border-transparent"
                    : "bg-white text-[#5f5b56] border-black/[0.1] hover:bg-[#f7f4ee]"
                }`}
                style={{ borderRadius: 10 }}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Cards Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {cards.map((card, idx) => (
            <div
              key={idx}
              className="group cursor-pointer overflow-hidden border border-black/[0.07] bg-white hover:border-black/[0.15] hover:shadow-xl hover:shadow-black/[0.06] transition-all"
              style={{ borderRadius: 16 }}
            >
              {/* Preview area */}
              <div className="h-48 overflow-hidden">
                {card.preview}
              </div>

              {/* Card footer */}
             <div className="px-5 py-4 flex items-center justify-between bg-white">
  <h3 className="text-lg font-bold text-[#0d0d0d]">{card.title}</h3>
  <button className="px-5 py-2 bg-[#0d0d0d] text-white rounded-[10px] font-semibold text-sm hover:opacity-80 transition-opacity">
    View now
  </button>
</div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}