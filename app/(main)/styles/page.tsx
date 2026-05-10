import RunsLibrary from "@/components/RunsLibrary";

export const metadata = {
  title: "Style Library – DesignProbe",
  description: "Browse all generated design systems and style guides.",
};

export default function StylesPage() {
  return (
    <main className="w-full min-h-screen bg-page">
      <RunsLibrary />
    </main>
  );
}
