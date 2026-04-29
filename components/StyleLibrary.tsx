"use client";

import { Search } from "lucide-react";
import { useState } from "react";

export default function StyleLibrary() {
  const [activeTab, setActiveTab] = useState("all");

  const tabs = ["All", "Trending", "SaaS", "Fintech", "Ecommerce", "Consumer", "Hardware", "Logistics"];

  const cards = [
    {
      title: "Figma",
      bg: "bg-gradient-to-br from-purple-300 to-purple-400",
      content: "bg-gradient-to-br from-purple-300 to-purple-400",
      badge: "🎨",
      screenshot: "/logos/Replit--Streamline-Svg-Logos.png",
    },
    {
      title: "Supabase",
      bg: "bg-black",
      content: "bg-black",
      badge: "Build in a weekend\nScale to millions",
      subtitle: true,
    },
    {
      title: "Linear",
      bg: "bg-gray-900",
      content: "bg-gray-900",
      badge: "Linear",
    },
    {
      title: "Notion",
      bg: "bg-gradient-to-br from-slate-800 to-slate-900",
      content: "bg-gradient-to-br from-slate-800 to-slate-900",
      badge: "Your 24/7 AI team",
    },
    {
      title: "Snapchat",
      bg: "bg-yellow-300",
      content: "bg-yellow-300",
      badge: "👻",
    },
    {
      title: "Lovable",
      bg: "bg-gradient-to-br from-pink-500 to-purple-600",
      content: "bg-gradient-to-br from-pink-500 to-purple-600",
      badge: "AI-powered insights",
      screenshot: "/logos/logoblack 1.png",
    },
    {
      title: "Firebase",
      bg: "bg-black",
      content: "bg-black",
      badge: "🔥",
    },
    {
      title: "Shopify",
      bg: "bg-gradient-to-br from-teal-400 to-cyan-500",
      content: "bg-gradient-to-br from-teal-400 to-cyan-500",
      badge: "🌍",
      screenshot: "/logos/Base44-logo_brandlogos.net_1a9f67 1.png",
    },
    {
      title: "Stripe",
      bg: "bg-gradient-to-br from-orange-400 to-pink-500",
      content: "bg-gradient-to-br from-orange-400 to-pink-500",
      badge: "💳",
    },
  ];

  return (
    <section className="py-12 md:py-16 bg-[#f2efe9]">
      <div className="container-custom">
        {/* Header with Title and Search */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#6b6761] mb-2">Curated vibes</p>
            <h2 className="text-3xl md:text-4xl font-bold text-[#0d0d0d]">Style Library</h2>
          </div>
          <div className="relative w-full md:w-80">
            <Search className="absolute left-4 top-3.5 text-[#7a756f]" size={20} />
            <input
              type="text"
              placeholder="Search"
              className="w-full pl-12 pr-4 py-2.5 bg-white border border-black/[0.08] rounded-2xl text-sm placeholder-[#8a847d] focus:outline-none focus:border-black/[0.18] focus:ring-2 focus:ring-black/[0.04]"
            />
          </div>
        </div>

        {/* Tabs: Trending on left, others on right */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div className="flex items-center gap-2">
            {tabs
              .filter((t) => t.toLowerCase() === "trending")
              .map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab.toLowerCase())}
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                    activeTab === tab.toLowerCase()
                      ? "bg-[#0d0d0d] text-white shadow-md shadow-black/[0.12]"
                      : "bg-white text-[#5f5b56] border border-black/[0.08] hover:bg-[#f7f4ee]"
                  }`}
                >
                  {tab}
                </button>
              ))}
          </div>

          <div className="flex flex-wrap justify-end gap-2">
            {tabs
              .filter((t) => t.toLowerCase() !== "trending")
              .map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab.toLowerCase())}
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                    activeTab === tab.toLowerCase()
                      ? "bg-[#0d0d0d] text-white shadow-md shadow-black/[0.12]"
                      : "bg-white text-[#5f5b56] border border-black/[0.08] hover:bg-[#f7f4ee]"
                  }`}
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
              className="group cursor-pointer rounded-3xl overflow-hidden border border-black/[0.08] bg-white hover:border-black/[0.16] hover:shadow-lg hover:shadow-black/[0.05] transition-all"
            >
              <div className="relative">
                <div className={`h-40 rounded-t-2xl overflow-hidden ${!card.screenshot ? card.bg : ''}`}>
                  {card.screenshot ? (
                    <img
                      src={card.screenshot}
                      alt={`${card.title} screenshot`}
                      className="w-full h-full object-cover"
                    />
                  ) : card.subtitle ? (
                    <div className="h-full flex items-center justify-center text-center text-white px-4">
                      <div>
                        <div className="text-sm font-bold mb-2">{card.badge?.split('\n')[0]}</div>
                        <div className="text-xs opacity-90">{card.badge?.split('\n')[1]}</div>
                      </div>
                    </div>
                  ) : (
                    <div className="h-full flex items-center justify-center text-5xl group-hover:scale-110 transition-transform">{card.badge}</div>
                  )}
                </div>

                <button className="absolute right-4 bottom-0 translate-y-1/2 px-4 py-2 bg-[#0d0d0d] text-white rounded-full font-semibold text-sm shadow-md shadow-black/[0.12]">
                  View now
                </button>
              </div>

              <div className="p-4 pt-6 flex items-center justify-between">
                <h3 className="text-lg font-bold text-[#0d0d0d]">{card.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
