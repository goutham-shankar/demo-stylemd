"use client";

import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  // partner logos removed per request

  return (
    <footer className="bg-page text-primary py-12 md:py-16 border-t border-medium">
      <div className="container-custom">
        <div className="grid md:grid-cols-4 gap-8 mb-8 pb-8 border-b border-medium">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Image src="/favicon.svg" alt="DesignProbe" width={36} height={36} />
              <span className="text-primary font-bold text-base font-funnel">DesignProbe</span>
            </div>
            <p className="text-tertiary text-small leading-relaxed">
              Give your projects a design makeover with our comprehensive design system.
            </p>
            {/* partner logos removed */}
          </div>

          {/* Product */}
          <nav aria-label="Footer product links">
            <h4 className="font-bold mb-6 text-primary text-base font-funnel">Product</h4>
            <ul className="space-y-3 text-tertiary text-small">
              <li><Link href="/styles" className="hover:text-primary transition-colors duration-150">Style Library</Link></li>
              <li><Link href="/generate" className="hover:text-primary transition-colors duration-150">Generate</Link></li>
            </ul>
          </nav>

          {/* Empty column for grid alignment */}
          <div />

          {/* Empty column for grid alignment */}
          <div />
        </div>

        {/* Bottom */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <p className="text-muted text-small">
            © {new Date().getFullYear()} DesignProbe. All rights reserved.
          </p>
          <Link href="/generate" className="px-4 py-2 text-sm font-semibold text-white bg-cta rounded-[10px] hover:opacity-90 transition-all duration-150">
            Try it free →
          </Link>
        </div>
      </div>
    </footer>
  );
}
