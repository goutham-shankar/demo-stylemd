"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function Hero() {
  const badges = [
    { name: "figma", top: "10%", left: "5%", color: "bg-blue-500" },
    { name: "stripe", top: "20%", right: "5%", color: "bg-pink-500" },
    { name: "linear", bottom: "20%", left: "5%", color: "bg-purple-500" },
    { name: "slack", bottom: "15%", right: "8%", color: "bg-yellow-400" },
  ];

  return (
    <section className="relative py-12 md:py-16 overflow-hidden bg-white flex items-center justify-center">
      {/* Decorative Badges - Large & Blur */}
      {badges.map((badge, idx) => (
        <div
          key={idx}
          className={`absolute ${badge.color} rounded-3xl w-20 h-20 md:w-32 md:h-32 blur-2xl opacity-60`}
          style={{
            top: badge.top,
            left: badge.left,
            right: badge.right,
            bottom: badge.bottom,
          }}
        />
      ))}

      <div className="container-custom max-w-4xl mx-auto text-center relative z-10 w-full">
        {/* Main Heading */}
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight tracking-tight text-black">
          Give your{" "}
          <span className="inline-block bg-black text-white px-4 py-2 rounded-lg">
            Lovable
          </span>
          <br className="hidden md:block" />
          project a design makeover
        </h1>

        {/* Subheading */}
        <p className="text-base md:text-lg text-gray-600 mb-6 leading-relaxed max-w-2xl mx-auto">
          A plug-and-play DesignMd file to elevate your project's design
        </p>

        {/* Link */}
        <Link
          href="#"
          className="text-blue-500 text-sm font-semibold hover:opacity-70 transition-opacity inline-flex items-center gap-2 mb-6"
        >
          See how it works
          <ArrowRight size={16} />
        </Link>

        {/* Two-Column Content Section */}
        <div className="grid md:grid-cols-2 gap-4 max-w-3xl mx-auto mb-6">
          {/* Left Card - Input */}
          <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-lg font-bold mb-4 text-black">
              Start with a<br />reference website
            </h3>
            <div className="mb-4">
              <input
                type="text"
                placeholder="Paste any website URL"
                className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg text-sm placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:bg-white transition-colors"
              />
            </div>
            <div className="flex justify-end">
              <button className="px-5 py-2.5 bg-black text-white rounded-lg font-semibold text-sm hover:opacity-90 transition-opacity">
                Generate DESIGN.md
              </button>
            </div>
          </div>

          {/* Right Card - Catalog */}
          <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-lg font-bold mb-2 text-black">
              Select from a catalog
            </h3>
            <p className="text-sm text-gray-600 mb-4">of 100+ curated styles</p>
            <div className="h-28 bg-gradient-to-br from-pink-200 to-purple-200 rounded-lg flex items-center justify-center text-4xl">
              🎨
            </div>
          </div>
        </div>

        {/* Primary CTA Button */}
        <button className="inline-flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-lg font-semibold text-base hover:opacity-90 transition-opacity shadow-lg hover:shadow-xl">
          <span>Generate DESIGN.md</span>
          <ArrowRight size={20} />
        </button>
      </div>
    </section>
  );
}