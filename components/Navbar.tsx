"use client";

import Link from "next/link";
import { Menu } from "lucide-react";
import { useState, useEffect } from "react";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`fixed w-full top-0 z-50 h-16 transition-all duration-300 ${
      isScrolled 
        ? "bg-white/70 backdrop-blur-md border-b border-white/30 shadow-lg" 
        : "bg-white border-b border-transparent"
    }`}>
      <div className="container-custom flex items-center justify-between h-full">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-bold">
          <div className="w-6 h-6 bg-gradient-to-br from-teal-500 to-cyan-400 rounded-sm"></div>
          <span className="text-teal-600 font-bold text-base">DesignProbe</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          <Link href="#" className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors">
            How it Works
          </Link>
          <Link href="#" className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors">
            Library
          </Link>
          <Link href="#" className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors">
            Generate
          </Link>
          <Link href="#" className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors">
            FAQs
          </Link>
          <Link href="#" className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors">
            About
          </Link>
        </div>

        {/* CTA Buttons */}
        <div className="hidden md:flex items-center gap-4">
          <button className="px-5 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            Log In
          </button>
          <button className="px-5 py-2 text-sm font-semibold text-white bg-black rounded-lg hover:opacity-85 transition-opacity">
            Sign Up
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <Menu size={24} className="text-gray-900" />
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-gray-100 p-6 space-y-4 max-h-[calc(100vh-64px)] overflow-y-auto">
          <Link href="#" className="block text-sm font-medium text-gray-700 hover:text-gray-900">
            How it Works
          </Link>
          <Link href="#" className="block text-sm font-medium text-gray-700 hover:text-gray-900">
            Library
          </Link>
          <Link href="#" className="block text-sm font-medium text-gray-700 hover:text-gray-900">
            Generate
          </Link>
          <Link href="#" className="block text-sm font-medium text-gray-700 hover:text-gray-900">
            FAQs
          </Link>
          <Link href="#" className="block text-sm font-medium text-gray-700 hover:text-gray-900">
            About
          </Link>
          <div className="flex gap-3 pt-6 border-t border-gray-200">
            <button className="flex-1 px-4 py-2 text-sm font-medium text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50">
              Log In
            </button>
            <button className="flex-1 px-4 py-2 text-sm font-semibold text-white bg-black rounded-lg hover:opacity-85">
              Sign Up
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
