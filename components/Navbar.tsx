"use client";

import Link from "next/link";
import { Menu } from "lucide-react";
import { useState, useEffect, useCallback, useMemo } from "react";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Navigation links centralized for maintainability and easier updates
  const navLinks = useMemo(() => [
    { label: "How it Works", href: "#" },
    { label: "Style Library", href: "/styles" },
    { label: "Generate", href: "#" },
    { label: "FAQs", href: "#" },
    { label: "About", href: "#" },
  ], []);

  const toggleMobile = useCallback(() => setMobileMenuOpen((s) => !s), []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      aria-label="Main navigation"
      className={
        ("fixed w-full top-0 z-50 h-16 transition-all duration-300") +
        " " +
        (isScrolled
          ? "bg-[#f6f8fa]/80 backdrop-blur-md border-b border-black/[0.08] shadow-lg shadow-black/[0.04]"
          : "bg-[#f6f8fa]/95 border-b border-transparent")
      }
      role="navigation"
    >
      <div className="container-custom flex items-center justify-between h-full">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-bold">
          <img src="/logos/ai.svg" alt="Logo" className="w-7 h-7" />
          <span className="text-[#0d0d0d] font-bold text-base tracking-tight font-funnel">DesignProbe</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((l) => (
            <Link
              key={l.label}
              href={l.href}
              className="text-sm font-medium text-[#5f5b56] hover:text-[#0d0d0d] transition-colors duration-150 font-poppins"
            >
              {l.label}
            </Link>
          ))}
        </div>

        {/* CTA Buttons */}
        <div className="hidden md:flex items-center gap-4">
          <Link href="#" className="px-4 py-2 text-sm font-medium text-[#5f5b56] border border-[#c1c7d0] rounded-[10px] hover:text-[#0d0d0d] hover:bg-[#f7f4ee] transition-colors duration-150">
            Log In
          </Link>
          <button
            type="button"
            className="px-5 py-2 text-sm font-semibold text-white bg-[#0d0d0d] shadow-sm shadow-black/[0.12] hover:opacity-90 hover:shadow-md transition-all duration-150"
            style={{ borderRadius: 10 }}
            aria-label="Sign up"
          >
            Sign Up
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden"
          onClick={toggleMobile}
          aria-label="Toggle menu"
          aria-expanded={mobileMenuOpen}
          aria-controls="mobile-menu"
        >
          <Menu size={24} className="text-[#0d0d0d]" />
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div id="mobile-menu" className="md:hidden bg-[#f8f7f5] border-b border-black/[0.08] p-6 space-y-4 max-h-[calc(100vh-64px)] overflow-y-auto">
          {navLinks.map((l) => (
            <Link key={l.label} href={l.href} className="block text-sm font-medium text-[#5f5b56] hover:text-[#0d0d0d] transition-colors duration-150">
              {l.label}
            </Link>
          ))}
          <div className="flex gap-3 pt-6 border-t border-black/[0.08]">
            <button className="flex-1 px-4 py-2 text-sm font-medium text-[#0d0d0d] border border-[#c1c7d0] rounded-[10px] hover:bg-[#f7f4ee] transition-all duration-150" type="button">
              Log In
            </button>
            <button className="flex-1 px-4 py-2 text-sm font-semibold text-white bg-[#0d0d0d] rounded-xl shadow-sm hover:opacity-90 hover:shadow-md transition-all duration-150" type="button">
              Sign Up
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
