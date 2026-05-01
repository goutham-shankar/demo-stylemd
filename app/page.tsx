import Hero from "@/components/Hero";
import MainContent from "@/components/MainContent";
import IntegrationLogos from "@/components/IntegrationLogos";
import StyleLibrary from "@/components/StyleLibrary";

export default function Home() {
  return (
    <main className="w-full">
      <Hero />
      <MainContent />
      <IntegrationLogos />
      <StyleLibrary />
    </main>
  );
}
