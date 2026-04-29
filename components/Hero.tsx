"use client";

import Link from "next/link";

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

type BadgeProps = {
  bg: string;
  label: string;
  size: number;
  top?: string;
  left?: string;
  right?: string;
  bottom?: string;
};

function AppBadge({ bg, label, size, top, left, right, bottom }: BadgeProps) {
  return (
    <div
      className="absolute flex items-center justify-center rounded-2xl bg-white shadow-sm border border-black/[0.06]"
      style={{ width: size, height: size, top, left, right, bottom }}
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

export default function Hero() {
  return (
    <section className="relative py-16 overflow-hidden bg-[#f8f7f5] flex items-center justify-center min-h-[580px]">

      {/* Floating App Badges */}
      {floatingBadges.map((b, i) => (
        <AppBadge key={i} {...b} />
      ))}

      <div className="relative z-10 w-full max-w-3xl mx-auto text-center px-4">

        {/* Heading */}
        <h1 className="text-4xl md:text-5xl font-bold text-[#0d0d0d] mb-4 leading-tight tracking-tight">
          Give your{" "}
          <span className="inline-flex items-center gap-2 bg-[#1a1a1a] text-white px-3 py-1 rounded-xl">
            <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-400 to-purple-500 inline-block" />
            Lovable
          </span>
          <br />
          project a design makeover
        </h1>

        <p className="text-[15px] text-gray-500 mb-2">
          A plug-and-play Design.md file to elevate your project's design
        </p>

        <Link href="#" className="text-[13px] text-blue-500 underline inline-block mb-8">
          See how it works
        </Link>

        {/* Cards */}
        <div className="grid md:grid-cols-2 gap-3 max-w-2xl mx-auto mb-8">

          {/* Left Card */}
          <div className="bg-white rounded-2xl p-5 border border-black/[0.08] shadow-sm">
            <h3 className="text-lg font-bold text-[#0d0d0d] mb-4 leading-snug text-left">
              Start with a<br />reference website
            </h3>
            <input
              type="text"
              placeholder="Paste any website URL"
              className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm placeholder-gray-400 focus:outline-none mb-3"
            />
            <div className="flex justify-end">
              <button className="px-4 py-2.5 bg-[#0d0d0d] text-white rounded-xl font-semibold text-sm hover:opacity-90 transition-opacity">
                Generate DESIGN.md
              </button>
            </div>
          </div>

          {/* Right Card */}
          <div className="bg-white rounded-2xl p-5 border border-black/[0.08] shadow-sm">
            <h3 className="text-lg font-bold text-[#0d0d0d] mb-3 leading-snug text-left">
              Select from a catalog<br />of 100+ curated styles
            </h3>
            <div className="h-[100px] bg-purple-50 rounded-xl flex items-center justify-center gap-3 overflow-hidden">
              <div className="w-12 h-12 rounded-full bg-orange-400" />
              <div className="flex flex-col gap-1.5">
                <div className="w-16 h-7 bg-green-400 rounded-lg" />
                <div className="w-16 h-7 bg-purple-200 rounded-lg" />
              </div>
              <div className="flex flex-col items-center gap-1.5">
                <div className="w-9 h-9 rounded-full bg-purple-600 flex items-center justify-center text-white text-[10px] font-bold">CO</div>
                <div className="w-9 h-4 bg-yellow-200 rounded" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}