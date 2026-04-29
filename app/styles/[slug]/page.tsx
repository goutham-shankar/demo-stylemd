import { notFound } from "next/navigation";
import DesignDetailPage from "@/components/DesignDetailPage";
import { getDesignCardBySlug } from "@/lib/design-cards";

type PageProps = {
  params: { slug: string };
};

export default function StyleSlugPage({ params }: PageProps) {
  const card = getDesignCardBySlug(params.slug);
  if (!card) notFound();
  return <DesignDetailPage card={card} />;
}
