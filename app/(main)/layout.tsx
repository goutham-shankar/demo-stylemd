import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { SSEProvider } from "@/lib/sse-context";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SSEProvider>
      <Navbar />
      <div className="pt-16">{children}</div>
      <Footer />
    </SSEProvider>
  );
}
