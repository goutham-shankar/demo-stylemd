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
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="theme-color" content="#f6f8fa" />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
