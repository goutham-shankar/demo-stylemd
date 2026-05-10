import { Metadata } from "next";
import { notFound } from "next/navigation";
import { API_BASE } from "@/lib/api-config";
import type { RunData } from "@/lib/api-types";
import StyleViewClient from "./StyleViewClient";

type PageProps = {
  params: Promise<{ slug: string }>;
};

async function getRunData(slug: string): Promise<RunData | null> {
  try {
    const res = await fetch(`${API_BASE}/api/stylemd/by-slug/${encodeURIComponent(slug)}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    const json = await res.json();
    if (json.ok && json.data) {
      return json.data as RunData;
    }
    return null;
  } catch (e) {
    return null;
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const data = await getRunData(slug);
  
  if (!data) {
    return { title: "Style Not Found | DesignProbe" };
  }

  let hostname = String(data.url ?? "");
  try { hostname = new URL(hostname).hostname.replace(/^www\./, ""); } catch { /* ignore */ }

  const siteName = data.title ? String(data.title) : hostname;
  const pageTitle = `${siteName} Design System | DesignProbe`;
  
  return {
    title: pageTitle,
    description: `Explore the design system, colors, typography, and components for ${hostname}.`,
  };
}

export default async function StyleViewPage({ params }: PageProps) {
  const { slug } = await params;
  const data = await getRunData(slug);

  if (!data) {
    notFound();
  }

  return (
    <main className="w-full min-h-screen bg-page">
      <StyleViewClient runData={data} />
    </main>
  );
}
