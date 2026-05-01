"use client";

import Hero from "@/components/Hero";
import IntegrationLogos from "@/components/IntegrationLogos";
import StyleLibrary from "@/components/StyleLibrary";

export default function Home() {
  return (
    <main className="w-full">
      <Hero />
      <IntegrationLogos />
      <StyleLibrary />
    </main>
  );
}
