"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSSE } from "@/lib/sse-context";
import type { Provider } from "@/lib/api-types";

// Floating logo decorations — desktop only

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

function FloatingLogoRight({ src, size, right, top }: {
  src: string; size: number; right: number; top: number;
}) {
  return (
    <img
      src={`/icons/right/${src}`}
      alt=""
      aria-hidden="true"
      className="absolute object-contain pointer-events-none select-none z-30"
      style={{ width: size, height: size, right, top, transform: "translateY(-50%)" }}
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
      className="absolute object-contain pointer-events-none select-none z-30"
      style={{ width: size, height: size, left, top, transform: "translateY(-50%)" }}
    />
  );
}

const svgLogos = [
  "/logos/claude 1.svg",
  "/logos/emergent-logo-new 1.svg",
  "/logos/Base44-logo_brandlogos.net_1a9f67 1.svg",
  "/logos/lovable.svg",
];

export default function Hero() {
  const [logoIdx, setLogoIdx] = useState(0);
  const [url, setUrl] = useState("");
  const [provider, setProvider] = useState<Provider>("kimi");
  const [urlError, setUrlError] = useState("");

  const { startRun, isRunning, runError } = useSSE();
  const router = useRouter();

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mediaQuery.matches) return;
    const interval = setInterval(() => {
      setLogoIdx((idx) => (idx + 1) % svgLogos.length);
    }, 1200);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setUrlError("");

      const trimmed = url.trim();
      if (!trimmed) {
        setUrlError("Please enter a URL");
        return;
      }

      // Loose URL validation — accept URLs with or without protocol
      let normalised = trimmed;
      if (!/^https?:\/\//i.test(normalised)) {
        normalised = `https://${normalised}`;
      }
      try {
        new URL(normalised);
      } catch {
        setUrlError("Please enter a valid URL");
        return;
      }

      await startRun(normalised, provider);
      router.push("/generate");
    },
    [url, provider, startRun, router]
  );

  return (
    <>
      <section
        className="relative bg-page flex flex-col items-center justify-center overflow-visible"
        style={{ minHeight: "360px" }}
      >
        {/* Floating logos — hidden on mobile */}
        <div className="absolute inset-0 pointer-events-none z-30 hidden md:block">
          {leftLogos.map((logo, i) => (
            <FloatingLogoLeft key={`l${i}`} {...logo} />
          ))}
          {rightLogos.map((logo, i) => (
            <FloatingLogoRight key={`r${i}`} {...logo} />
          ))}
        </div>

        <div className="relative z-10 w-full max-w-3xl mx-auto text-center px-4">
          <h1 className="heading-h1 mb-3">
            Give your{" "}
            <span
              className="inline-flex items-center align-middle gap-1.5 md:gap-2 px-2 py-0.5 rounded-xl"
              style={{ verticalAlign: "middle", height: "1em" }}
            >
              <img
                src={svgLogos[logoIdx]}
                alt="AI tool"
                className="rounded-xl inline-block transition-all duration-700 align-middle object-contain"
                style={{ border: "none", height: "100%", width: "auto", maxHeight: "none" }}
              />
            </span>{" "}
            <br />project a design makeover
          </h1>
          <p className="text-base md:text-lg mb-2 font-manrope font-medium" style={{ color: "#616161" }}>
            A plug-and-play Design.md file to elevate your project&apos;s design
          </p>
          <Link
            href="#"
            className="text-sm md:text-base font-manrope underline inline-block font-semibold"
            style={{ color: "#616161" }}
          >
            See how it works
          </Link>
        </div>
      </section>

      {/* Cards */}
      <div className="bg-page w-full px-4 pb-10 pt-3">
        <div className="grid md:grid-cols-2 gap-4 max-w-3xl mx-auto">

          {/* URL input card */}
          <div className="bg-surface rounded-2xl p-5 border border-medium shadow-sm flex flex-col">
            <h3 className="heading-h3 font-bold text-primary mb-4 leading-snug text-left">
              Start with a<br />reference website
            </h3>
            <form onSubmit={handleSubmit} noValidate>
              <label className="sr-only" htmlFor="ref-url">Paste any website URL</label>
              <input
                id="ref-url"
                type="url"
                value={url}
                onChange={(e) => { setUrl(e.target.value); setUrlError(""); }}
                placeholder="Paste any website URL"
                disabled={isRunning}
                className="w-full px-3 py-2.5 border border-medium rounded-xl text-sm placeholder-secondary focus:outline-none focus-visible:ring-2 focus-visible:ring-light mb-2 disabled:opacity-60"
                style={{ background: "var(--bg-page)" }}
              />

              {/* Provider toggle */}
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-semibold text-secondary font-manrope">Provider:</span>
                <div className="flex border border-medium rounded-lg overflow-hidden">
                  {(["kimi", "claude"] as Provider[]).map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setProvider(p)}
                      disabled={isRunning}
                      className={`px-3 py-1 text-xs font-semibold font-manrope transition-all duration-150 capitalize disabled:opacity-60 ${
                        provider === p ? "text-white" : "text-secondary bg-surface hover:bg-[#f7f4ee]"
                      }`}
                      style={provider === p ? { backgroundColor: "var(--cta)" } : {}}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              {/* Inline errors */}
              {(urlError || runError) && (
                <p className="text-xs text-red-600 font-manrope mb-2">
                  {urlError || runError}
                </p>
              )}

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isRunning}
                  className="px-4 py-2.5 text-white rounded-xl font-bold text-sm shadow-sm hover:opacity-90 hover:shadow-md transition-all duration-150 disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
                  style={{ backgroundColor: "var(--cta)" }}
                >
                  {isRunning && (
                    <span className="w-3.5 h-3.5 rounded-full border-2 border-t-transparent animate-spin border-white" />
                  )}
                  {isRunning ? "Running…" : "Generate DESIGN.md"}
                </button>
              </div>
            </form>
          </div>

          {/* Catalog card */}
          <Link
            href="/styles"
            className="bg-surface rounded-2xl border border-medium shadow-sm p-4 h-[200px] flex flex-row items-stretch gap-3 overflow-hidden transition-all duration-150 hover:shadow-md hover:border-dark"
            aria-label="Select from a catalog of 100+ curated styles"
          >
            <div className="flex items-start justify-start">
              <img src="/cardplaceholder.svg" alt="Catalog preview" width={120} height={160} className="object-contain rounded-lg" />
            </div>
            <div className="flex items-start justify-start pt-1">
              <h3 className="heading-h3 font-bold text-primary leading-snug text-left">
                Select from a catalog<br />of 100+ curated styles
              </h3>
            </div>
          </Link>

        </div>
      </div>
    </>
  );
}
