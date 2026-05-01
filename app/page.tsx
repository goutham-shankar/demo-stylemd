import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import IntegrationLogos from "@/components/IntegrationLogos";
import StyleLibrary from "@/components/StyleLibrary";

export default function Home() {
  return (
    <>
      <Navbar />
      <div className="pt-16">
        <main className="w-full">
          <Hero />
          <IntegrationLogos />
          <StyleLibrary />
        </main>
      </div>
      <Footer />
    </>
  );
}
