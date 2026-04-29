"use client";

export default function Footer() {
  return (
    <footer className="bg-[#f8f7f5] text-[#0d0d0d] py-12 md:py-16 border-t border-black/[0.08]">
      <div className="container-custom">
        <div className="grid md:grid-cols-4 gap-8 mb-8 pb-8 border-b border-black/[0.08]">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 rounded-lg bg-[#0d0d0d] flex items-center justify-center">
                <span className="w-2.5 h-2.5 rounded-full bg-gradient-to-br from-[#f59e0b] via-[#ec4899] to-[#3b82f6]" />
              </div>
              <span className="text-[#0d0d0d] font-bold text-base">DesignProbe</span>
            </div>
            <p className="text-[#6b6761] text-sm leading-relaxed">
              Give your projects a design makeover with our comprehensive design system.
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="font-bold mb-6 text-[#0d0d0d] text-base">Product</h4>
            <ul className="space-y-3 text-[#6b6761] text-sm">
              <li><a href="#" className="hover:text-[#0d0d0d] transition-colors">How it Works</a></li>
              <li><a href="#" className="hover:text-[#0d0d0d] transition-colors">Library</a></li>
              <li><a href="#" className="hover:text-[#0d0d0d] transition-colors">Generate</a></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-bold mb-6 text-[#0d0d0d] text-base">Resources</h4>
            <ul className="space-y-3 text-[#6b6761] text-sm">
              <li><a href="#" className="hover:text-[#0d0d0d] transition-colors">Docs</a></li>
              <li><a href="#" className="hover:text-[#0d0d0d] transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-[#0d0d0d] transition-colors">FAQs</a></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-bold mb-6 text-[#0d0d0d] text-base">Company</h4>
            <ul className="space-y-3 text-[#6b6761] text-sm">
              <li><a href="#" className="hover:text-[#0d0d0d] transition-colors">About</a></li>
              <li><a href="#" className="hover:text-[#0d0d0d] transition-colors">Contact</a></li>
              <li><a href="#" className="hover:text-[#0d0d0d] transition-colors">Privacy</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <p className="text-[#7a756f] text-sm">
            © 2026 DesignProbe. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-[#7a756f] hover:text-[#0d0d0d] text-sm transition-colors font-medium">Twitter</a>
            <a href="#" className="text-[#7a756f] hover:text-[#0d0d0d] text-sm transition-colors font-medium">LinkedIn</a>
            <a href="#" className="text-[#7a756f] hover:text-[#0d0d0d] text-sm transition-colors font-medium">GitHub</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
