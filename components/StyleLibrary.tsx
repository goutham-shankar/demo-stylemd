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
    },
    {
      title: "Stripe",
      bg: "bg-gradient-to-br from-orange-400 to-pink-500",
      content: "bg-gradient-to-br from-orange-400 to-pink-500",
      badge: "💳",
    },
  ];

  return (
    <section className="py-12 md:py-16 bg-gray-50">
      <div className="container-custom">
        {/* Header with Title and Search */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-6">
          <h2 className="text-3xl md:text-4xl font-bold text-black">Style Library</h2>
          <div className="relative w-full md:w-80">
            <Search className="absolute left-4 top-3.5 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search"
              className="w-full pl-12 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm placeholder-gray-500 focus:outline-none focus:border-blue-500"
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
                      ? "bg-blue-500 text-white shadow-md"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
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
                      ? "bg-blue-500 text-white shadow-md"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
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
            <div key={idx} className="group cursor-pointer rounded-3xl overflow-hidden border border-gray-200 bg-white hover:border-gray-300 hover:shadow-lg transition-all">
              <div
                className={`${card.bg} h-40 flex items-center justify-center relative overflow-hidden`}
              >
                {card.subtitle ? (
                  <div className="text-center text-white px-4">
                    <div className="text-sm font-bold mb-2">{card.badge?.split('\n')[0]}</div>
                    <div className="text-xs opacity-90">{card.badge?.split('\n')[1]}</div>
                  </div>
                ) : (
                  <div className="text-5xl group-hover:scale-110 transition-transform">{card.badge}</div>
                )}
              </div>
              <div className="p-3 flex items-center justify-between">
                <h3 className="text-lg font-bold text-black">{card.title}</h3>
                <button className="px-4 py-2 bg-black text-white rounded-lg font-semibold text-sm hover:opacity-85 transition-opacity">View now</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
