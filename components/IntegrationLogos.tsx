"use client";

import { Scale } from "lucide-react";

export default function IntegrationLogos() {
  const logos = [
    { name: "Replit", src: "/logos/Replit--Streamline-Svg-Logos.svg", w: 128, h: 100 , Scale: 1},
    { name: "Claude", src: "/logos/claude 1.svg", w: 128, h: 40 },
    { name: "Lovable", src: "/logos/lovable.svg", w: 128, h: 40 },
    { name: "Base44", src: "/logos/Base44-logo_brandlogos.net_1a9f67 1.svg", w: 128, h: 40 },
    { name: "Emergent", src: "/logos/emergent-logo-new 1.svg", w: 128, h: 40 },
  ];

  return (
    <section className="py-12 md:py-8" style={{ backgroundColor: "#f6f8fa" }}>
      <div className="container-custom">
        <div className="text-center mb-8">
          <p className="text-secondary text-sm md:text-base font-bold tracking-[0.18em] uppercase inline-flex items-center justify-center gap-2">
            <span>WORKS ACROSS APPS YOU</span>
            <img src="/logos/Favorite_fill.svg" alt="" aria-hidden="true" className="h-4 w-4 md:h-5 md:w-5" />
          </p>
        </div>

        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
          {logos.map((logo) => (
            <div
              key={logo.name}
              className="flex items-center justify-center"
              style={{ width: logo.w, height: logo.h }}
            >
              <img
                src={logo.src}
                alt={logo.name}
                width={logo.w}
                height={logo.h}
                className="max-w-full max-h-full object-contain"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
