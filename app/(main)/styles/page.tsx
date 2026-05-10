import StyleLibrary from "@/components/StyleLibrary";

export const metadata = {
  title: "Style Library – DesignProbe",
  description: "Browse curated design systems and style guides across SaaS, fintech, ecommerce, and more.",
};

export default function StylesPage() {
  return (
    <main className="w-full min-h-screen bg-page">
      <StyleLibrary />
    </main>
  );
}
