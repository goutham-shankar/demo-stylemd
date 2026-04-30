"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

const floatingBadges = [
  { icon: "🔷", bg: "#1e40af", label: "IN", size: 46, top: "8%", left: "3%" },
  { icon: "🟩", bg: "#4ade80", label: "A", size: 54, top: "22%", left: "7%" },
  { icon: "🟡", bg: "#f59e0b", label: "●", size: 44, top: "42%", left: "2%" },
  { icon: "🟣", bg: "#7c3aed", label: "K.", size: 50, top: "58%", left: "6%" },
  { icon: "🔵", bg: "#3b82f6", label: "◎", size: 52, top: "74%", left: "3%" },
  { icon: "💬", bg: "#36c5f0", label: "S", size: 54, top: "6%", right: "4%" },
  { icon: "🟢", bg: "#4ade80", label: "hub", size: 60, top: "18%", right: "2%" },
  { icon: "🔹", bg: "#1e3a8a", label: "C", size: 46, top: "38%", right: "5%" },
  { icon: "🟦", bg: "#6366f1", label: "S", size: 48, top: "55%", right: "2%" },
  { icon: "💙", bg: "#003087", label: "PP", size: 44, top: "70%", right: "6%" },
];

function AppBadge({ bg, label, size, top, left, right, bottom }: any) {
  return (
    <div
      className="absolute flex items-center justify-center rounded-2xl bg-white shadow-sm border border-black/[0.06]"
      style={{ width: size, height: size, top, left, right, bottom }}
      aria-hidden="true"
    >
      <div
        className="flex items-center justify-center rounded-xl text-white font-bold text-[10px]"
        style={{ width: size - 14, height: size - 14, background: bg }}
      >
        {label}
      </div>
    </div>
  );
}

type BadgeProps = {
  bg: string;
  label: string;
  size: number;
  top?: string;
  left?: string;
  right?: string;
  bottom?: string;
};

export default function Hero() {
  // SVG logo list for animation
  // Only use chat, cursor, and lovable SVGs for animation
  const svgLogos = [
    "/logos/claude 1.svg",      // chat
    "/logos/Replit--Streamline-Svg-Logos.svg", // cursor
    "/logos/logoblack 1.svg",  // lovable
  ];
  const [logoIdx, setLogoIdx] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setLogoIdx((idx) => (idx + 1) % svgLogos.length);
    }, 1200);
    return () => clearInterval(interval);
  }, [svgLogos.length]);

  return (
    <section className="relative py-16 overflow-hidden bg-[#f6f8fa] flex items-center justify-center min-h-[580px]">
      {/* Floating App Badges */}
      {floatingBadges.map((b, i) => (
        <AppBadge key={i} {...b} />
      ))}
      <div className="relative z-10 w-full max-w-3xl mx-auto text-center px-4">
        {/* Heading */}
        <h1 className="text-4xl md:text-5xl font-extrabold text-black mb-5 leading-tight tracking-tight font-poppins">
          Give your{" "}
          <span className="inline-flex items-center align-middle gap-1.5 md:gap-2 text-black px-2 py-0.5 rounded-xl text-xl md:text-2xl" style={{verticalAlign: 'middle', height: '3.8em'}}>
            <img
              src={svgLogos[logoIdx]}
              alt="Logo"
              className=" rounded-xl inline-block transition-all duration-700 align-middle object-contain"
              style={{ border: "none", marginBottom: '-2px', maxHeight: '3.8em', verticalAlign: 'middle' }}
            />
            <span className="text-xl md:text-2xl font-extrabold align-middle" style={{lineHeight: 1}}></span>
          </span>
          <br />
          project a design makeover
        </h1>
        <p className="text-[16px] md:text-[18px] text-gray-700 mb-3 font-poppins font-medium">
          A plug-and-play Design.md file to elevate your project's design
        </p>
        <Link href="#" className="text-[13px] md:text-[15px] text-[#3b3b3b] font-poppins underline inline-block mb-8 font-semibold">
          See how it works
        </Link>
        {/* Cards */}
        <div className="grid md:grid-cols-2 gap-4 max-w-2xl mx-auto mb-8">
          {/* Left Card - reference URL */}
{/* Left Card - reference URL */}
<div className="bg-white rounded-2xl p-5 border border-black/[0.08] shadow-sm h-[200px] flex flex-col" style={{ background: '#fff' }}>            <h3 className="text-lg md:text-xl font-bold text-black mb-4 leading-snug text-left">Start with a<br />reference website</h3>
            <form onSubmit={(e) => e.preventDefault()} aria-label="Generate design from URL">
              <label className="sr-only" htmlFor="ref-url">Paste any website URL</label>
              <input
                id="ref-url"
                name="refUrl"
                type="url"
                placeholder="Paste any website URL"
                aria-label="Reference website URL"
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm placeholder-gray-400 focus:outline-none mb-3"
                style={{ background: '#eceff3' }}
              />
              <div className="flex justify-end">
                <button type="submit" className="px-4 py-2.5 bg-black text-white rounded-xl font-bold text-sm hover:opacity-90 transition-opacity">Generate DESIGN.md</button>
              </div>
            </form>
          </div>
          {/* Right Card - catalog preview */}
          <div className="bg-white rounded-2xl border border-black/[0.08] shadow-sm p-4 h-[200px] flex flex-row items-stretch gap-3 overflow-hidden">
  <div className="flex items-start justify-start">
    <img
      src="/cardplaceholder.svg"
      alt="Catalog of curated styles preview"
      className="  object-contain rounded-lg"
    />
  </div>
  <div className="flex items-start justify-start pt-1">
    <h3 className="text-lg md:text-xl font-bold text-black leading-snug text-left">
      Select from a catalog<br />of 100+ curated styles
    </h3>
  </div>
</div>
 
        
        </div>
      </div>
    </section>
  );
}