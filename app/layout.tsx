import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DesignProbe - Design Makeover for Lovable",
  description: "Give your Lovable project a design makeover with our design service",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-white">
        {children}
      </body>
    </html>
  );
}
