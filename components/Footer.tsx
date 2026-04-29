"use client";

import Image from "next/image";

export default function Footer() {
  // partner logos removed per request

  return (
    <footer className="bg-[#f6f8fa] text-[#0d0d0d] py-12 md:py-16 border-t border-black/[0.08]">
      <div className="container-custom">
        <div className="grid md:grid-cols-4 gap-8 mb-8 pb-8 border-b border-black/[0.08]">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Image src="/favicon.svg" alt="DesignProbe" width={36} height={36} />
              <span className="text-[#0d0d0d] font-bold text-base font-funnel">DesignProbe</span>
            </div>
            <p className="text-[#6b6761] text-small leading-relaxed">
              Give your projects a design makeover with our comprehensive design system.
            </p>
            {/* partner logos removed */}
          </div>

          {/* Product */}
          <nav aria-label="Footer product links">
            <h4 className="font-bold mb-6 text-[#0d0d0d] text-base font-funnel">Product</h4>
            <ul className="space-y-3 text-[#6b6761] text-small">
              <li><a href="#" className="hover:text-[#616161] transition-colors">How it Works</a></li>
              <li><a href="#" className="hover:text-[#616161] transition-colors">Library</a></li>
              <li><a href="#" className="hover:text-[#616161] transition-colors">Generate</a></li>
            </ul>
          </nav>

          {/* Resources */}
          <nav aria-label="Footer resources links">
            <h4 className="font-bold mb-6 text-[#0d0d0d] text-base font-funnel">Resources</h4>
            <ul className="space-y-3 text-[#6b6761] text-small">
              <li><a href="#" className="hover:text-[#616161] transition-colors">Docs</a></li>
              <li><a href="#" className="hover:text-[#616161] transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-[#616161] transition-colors">FAQs</a></li>
            </ul>
          </nav>

          {/* Company */}
          <nav aria-label="Footer company links">
            <h4 className="font-bold mb-6 text-[#0d0d0d] text-base font-funnel">Company</h4>
            <ul className="space-y-3 text-[#6b6761] text-small">
              <li><a href="#" className="hover:text-[#0d0d0d] transition-colors">About</a></li>
              <li><a href="#" className="hover:text-[#0d0d0d] transition-colors">Contact</a></li>
              <li><a href="#" className="hover:text-[#0d0d0d] transition-colors">Privacy</a></li>
            </ul>
          </nav>
        </div>

        {/* Bottom */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <p className="text-[#7a756f] text-small">
            © {new Date().getFullYear()} DesignProbe. All rights reserved.
          </p>
          <div className="flex gap-4 items-center flex-wrap">
            <a href="#" className="text-[#7a756f] hover:text-[#0d0d0d] text-small transition-colors font-medium">Twitter</a>
            <a href="#" className="text-[#7a756f] hover:text-[#0d0d0d] text-small transition-colors font-medium">LinkedIn</a>
            <a href="#" className="text-[#7a756f] hover:text-[#0d0d0d] text-small transition-colors font-medium">GitHub</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
