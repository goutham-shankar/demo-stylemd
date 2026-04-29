import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import MainContent from "@/components/MainContent";
import IntegrationLogos from "@/components/IntegrationLogos";
import StyleLibrary from "@/components/StyleLibrary";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="w-full">
      <Navbar />
      <div className="pt-16">
        <Hero />
        <MainContent />
        <IntegrationLogos />
        <StyleLibrary />
  
      </div>
    </main>
  );
}
