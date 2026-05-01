import { notFound } from "next/navigation";
import DesignDetailPage from "@/components/DesignDetailPage";
import { getDesignCardBySlug } from "@/lib/design-cards";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function SlugPage({ params }: PageProps) {
  const { slug } = await params;
  const card = getDesignCardBySlug(slug);

  if (!card) {
    notFound();
  }

  return <DesignDetailPage card={card} />;
}
