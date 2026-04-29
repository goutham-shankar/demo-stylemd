"use client";

export default function Footer() {
  return (
    <footer className="bg-gray-50 text-gray-900 py-12 md:py-16 border-t border-gray-200">
      <div className="container-custom">
        <div className="grid md:grid-cols-4 gap-8 mb-8 pb-8 border-b border-gray-200">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 bg-gradient-to-br from-teal-400 to-cyan-400 rounded-sm"></div>
              <span className="text-teal-400 font-bold text-base">DesignProbe</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Give your projects a design makeover with our comprehensive design system.
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="font-bold mb-6 text-gray-900 text-base">Product</h4>
            <ul className="space-y-3 text-gray-600 text-sm">
              <li><a href="#" className="hover:text-teal-600 transition-colors">How it Works</a></li>
              <li><a href="#" className="hover:text-teal-600 transition-colors">Library</a></li>
              <li><a href="#" className="hover:text-teal-600 transition-colors">Generate</a></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-bold mb-6 text-gray-900 text-base">Resources</h4>
            <ul className="space-y-3 text-gray-600 text-sm">
              <li><a href="#" className="hover:text-teal-600 transition-colors">Docs</a></li>
              <li><a href="#" className="hover:text-teal-600 transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-teal-600 transition-colors">FAQs</a></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-bold mb-6 text-gray-900 text-base">Company</h4>
            <ul className="space-y-3 text-gray-600 text-sm">
              <li><a href="#" className="hover:text-teal-600 transition-colors">About</a></li>
              <li><a href="#" className="hover:text-teal-600 transition-colors">Contact</a></li>
              <li><a href="#" className="hover:text-teal-600 transition-colors">Privacy</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <p className="text-gray-500 text-sm">
            © 2026 DesignProbe. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-gray-500 hover:text-teal-600 text-sm transition-colors font-medium">Twitter</a>
            <a href="#" className="text-gray-500 hover:text-teal-600 text-sm transition-colors font-medium">LinkedIn</a>
            <a href="#" className="text-gray-500 hover:text-teal-600 text-sm transition-colors font-medium">GitHub</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
