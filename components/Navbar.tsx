"use client";

import Link from "next/link";
import { Menu } from "lucide-react";
import { useState, useEffect, useCallback } from "react";

const navLinks = [
  { label: "How it Works", href: "/#how-it-works" },
  { label: "Style Library", href: "/styles" },
  { label: "Generate", href: "/generate" },
  { label: "FAQs", href: "/#faqs" },
  { label: "About", href: "/#about" },
];

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const toggleMobile = useCallback(() => setMobileMenuOpen((s) => !s), []);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 0);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && mobileMenuOpen) setMobileMenuOpen(false);
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [mobileMenuOpen]);

  return (
    <nav
      aria-label="Main navigation"
      className={
        "fixed w-full top-0 z-50 h-16 transition-all duration-300" +
        " " +
        (isScrolled
          ? "bg-page/80 backdrop-blur-md border-b border-medium shadow-lg shadow-black/[0.04]"
          : "bg-page/95 border-b border-transparent")
      }
    >
      <div className="container-custom flex items-center justify-between h-full">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-bold">
          <img src="/logos/ai.svg" alt="DesignProbe" className="w-7 h-7" />
          <span className="text-primary font-bold text-base tracking-tight font-funnel">DesignProbe</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((l) => (
            <Link
              key={l.label}
              href={l.href}
              className="text-sm font-medium text-secondary hover:text-primary transition-colors duration-150 font-manrope"
            >
              {l.label}
            </Link>
          ))}
        </div>

        {/* CTA Buttons */}
        <div className="hidden md:flex items-center gap-4">
          <Link
            href="/login"
            className="px-4 py-2 text-sm font-medium text-muted border border-medium rounded-[10px] hover:text-primary hover:bg-surface-soft transition-colors duration-150"
          >
            Log In
          </Link>
          <Link
            href="/signup"
            className="px-5 py-2 text-sm font-semibold text-white bg-cta rounded-[10px] shadow-sm shadow-black/[0.12] hover:opacity-90 hover:shadow-md transition-all duration-150 cursor-pointer"
          >
            Sign Up
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden cursor-pointer"
          onClick={toggleMobile}
          aria-label="Toggle menu"
          aria-expanded={mobileMenuOpen}
          aria-controls="mobile-menu"
          type="button"
        >
          <Menu size={24} className="text-primary" />
        </button>
      </div>

      {/* Mobile Menu — animated slide down */}
      <div
        id="mobile-menu"
        className={`md:hidden bg-paper border-b border-medium overflow-hidden transition-all duration-300 ease-in-out ${
          mobileMenuOpen ? "max-h-[400px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="p-6 space-y-4">
          {navLinks.map((l) => (
            <Link
              key={l.label}
              href={l.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm font-medium text-secondary hover:text-primary transition-colors duration-150"
            >
              {l.label}
            </Link>
          ))}
          <div className="flex gap-3 pt-6 border-t border-medium">
            <Link
              href="/login"
              className="flex-1 px-4 py-2 text-sm font-medium text-primary border border-medium rounded-[10px] hover:bg-surface-soft transition-all duration-150 text-center"
            >
              Log In
            </Link>
            <Link
              href="/signup"
              className="flex-1 px-4 py-2 text-sm font-semibold text-white bg-cta rounded-[10px] shadow-sm hover:opacity-90 hover:shadow-md transition-all duration-150 text-center"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
