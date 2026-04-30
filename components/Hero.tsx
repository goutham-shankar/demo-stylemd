"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

// Left logos use `left` px, Right logos use `right` px from edge
const leftLogos = [
  { src: "Group 47374.svg",  size: 54,  left: 188, top: 41  },
  { src: "Group 47344.svg",  size: 58,  left: 4,   top: 83  },
  { src: "Group 47376.svg",  size: 48,  left: 165, top: 120 },
  { src: "Group 47377.svg",  size: 74,  left: 254, top: 158 },
  { src: "Group 47378.svg",  size: 58,  left: 11,  top: 169 },
  { src: "Group 47379.svg",  size: 60,  left: 190, top: 279 },
  { src: "Group 47380.svg",  size: 58,  left: 302, top: 355 },
];

const rightLogos = [
  { src: "Group 47350.svg",  size: 60,  right: 40,  top: 56  },
  { src: "Group 47351.svg",  size: 74,  right: 145, top: 98  },
  { src: "Group 47357.svg",  size: 54,  right: 30,  top: 131 },
  { src: "Group 47358.svg",  size: 64,  right: 192, top: 255 },
  { src: "Group 47359.svg",  size: 58,  right: 85,  top: 250 },
  { src: "Group 47360.svg",  size: 44,  right: 140, top: 370 },
  { src: "Group 47361.svg",  size: 54,  right: 30,  top: 370 },
];

function FloatingLogo({ src, size, left, right, top }: {
  src: string; size: number; left?: number; right?: number; top: number;
}) {
  return (
    <img
      src={`/logos/${src}`}
      alt=""
      aria-hidden="true"
      className="absolute object-contain pointer-events-none select-none"
      style={{
        width: size,
        height: size,
        ...(left !== undefined ? { left } : {}),
        ...(right !== undefined ? { right } : {}),
        top,
        transform: "translate(-50%, -50%)",
      }}
    />
  );
}

// For right-anchored logos, translate should only affect Y not X
function FloatingLogoRight({ src, size, right, top }: {
  src: string; size: number; right: number; top: number;
}) {
  return (
    <img
      src={`/icons/right/${src}`}
      alt=""
      aria-hidden="true"
      className="absolute object-contain pointer-events-none select-none"
      style={{
        width: size,
        height: size,
        right,
        top,
        transform: "translateY(-50%)",
      }}
    />
  );
}

function FloatingLogoLeft({ src, size, left, top }: {
  src: string; size: number; left: number; top: number;
}) {
  return (
    <img
      src={`/icons/left/${src}`}
      alt=""
      aria-hidden="true"
      className="absolute object-contain pointer-events-none select-none"
      style={{
        width: size,
        height: size,
        left,
        top,
        transform: "translateY(-50%)",
      }}
    />
  );
}

const svgLogos = [
  "/logos/claude 1.svg",
  "/logos/Replit--Streamline-Svg-Logos.svg",
  "/logos/logoblack 1.svg",
];

export default function Hero() {
  const [logoIdx, setLogoIdx] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setLogoIdx((idx) => (idx + 1) % svgLogos.length);
    }, 1200);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <section
        className="relative bg-[#f6f8fa] flex flex-col items-center justify-center overflow-hidden"
        style={{ height: "435px" }}
      >
        <div className="absolute inset-0 pointer-events-none">
          {leftLogos.map((logo, i) => (
            <FloatingLogoLeft key={`l${i}`} {...logo} />
          ))}
          {rightLogos.map((logo, i) => (
            <FloatingLogoRight key={`r${i}`} {...logo} />
          ))}
        </div>

        <div className="relative z-10 w-full max-w-3xl mx-auto text-center px-4">
          <h1 className="heading-h1 font-poppins mb-5">
            Give your{" "}
            <span
              className="inline-flex items-center align-middle gap-1.5 md:gap-2 px-2 py-0.5 rounded-xl"
              style={{ verticalAlign: "middle", height: "1.2em" }}
            >
              <img
                src={svgLogos[logoIdx]}
                alt="Logo"
                className="rounded-xl inline-block transition-all duration-700 align-middle object-contain"
                style={{ border: "none", maxHeight: "1.2em" }}
              />
            </span>{" "}
            <br/>project a design makeover
          </h1>
          <p className="text-base md:text-lg text-gray-700 mb-3 font-poppins font-medium">
            A plug-and-play Design.md file to elevate your project's design
          </p>
          <Link
            href="#"
            className="text-sm md:text-base text-[#3b3b3b] font-poppins underline inline-block font-semibold"
          >
            See how it works
          </Link>
        </div>
      </section>

      {/* Cards outside section — logos cannot reach */}
      <div className="bg-[#f6f8fa] w-full px-4 pb-10 pt-6">
        <div className="grid md:grid-cols-2 gap-4 max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl p-5 border border-black/[0.08] shadow-sm h-[200px] flex flex-col">
            <h3 className="heading-h3 font-bold text-black mb-4 leading-snug text-left">
              Start with a<br />reference website
            </h3>
            <form onSubmit={(e) => e.preventDefault()}>
              <label className="sr-only" htmlFor="ref-url">Paste any website URL</label>
              <input
                id="ref-url"
                type="url"
                placeholder="Paste any website URL"
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm placeholder-gray-400 focus:outline-none mb-3"
                style={{ background: "#eceff3" }}
              />
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-4 py-2.5 bg-[#0d0d0d] text-white rounded-xl font-bold text-sm shadow-md hover:opacity-90 hover:shadow-lg transition-all duration-150"
                >
                  Generate DESIGN.md
                </button>
              </div>
            </form>
          </div>

          <div className="bg-white rounded-2xl border border-black/[0.08] shadow-sm p-4 h-[200px] flex flex-row items-stretch gap-3 overflow-hidden">
            <div className="flex items-start justify-start">
              <img src="/cardplaceholder.svg" alt="Catalog preview" className="object-contain rounded-lg" />
            </div>
            <div className="flex items-start justify-start pt-1">
              <h3 className="heading-h3 font-bold text-black leading-snug text-left">
                Select from a catalog<br />of 100+ curated styles
              </h3>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}