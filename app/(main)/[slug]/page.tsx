import { redirect } from "next/navigation";

type PageProps = {
  params: Promise<{ slug: string }>;
};

// Canonical URL for catalog cards is /styles/[slug] — redirect shorthand /[slug] there.
export default async function SlugRedirectPage({ params }: PageProps) {
  const { slug } = await params;
  redirect(`/styles/${slug}`);
}
