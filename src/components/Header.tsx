"use client";

import { useState, useEffect } from "react";
import RigsyLogo from "./RigsyLogo";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMobileMenuOpen(false);
      }
    };
    if (mobileMenuOpen) {
      document.addEventListener("keydown", handleEscape);
      return () => document.removeEventListener("keydown", handleEscape);
    }
  }, [mobileMenuOpen]);

  const navLinkClasses = "text-[#8B949E] hover:text-[#F0F3F6] transition-colors rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6B35] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0D1117]";

  return (
    <header
      role="banner"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#0D1117]/90 backdrop-blur-md border-b border-[#21262D]"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <a
          href="#"
          aria-label="Rigsy - Return to top of page"
          className="rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6B35] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0D1117]"
        >
          <RigsyLogo size={36} variant="full" />
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8" aria-label="Main navigation">
          <a href="#problem" className={navLinkClasses}>
            Problem
          </a>
          <a href="#features" className={navLinkClasses}>
            Features
          </a>
          <a href="#how-it-works" className={navLinkClasses}>
            How It Works
          </a>
          <a
            href="#signup"
            className="px-5 py-2.5 bg-[#FF6B35] hover:bg-[#FF8255] text-[#0D1117] font-semibold rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6B35] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0D1117]"
          >
            Get Early Access
          </a>
        </nav>

        {/* Mobile Menu Button */}
        <button
          type="button"
          className="md:hidden p-2 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6B35] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0D1117]"
          aria-expanded={mobileMenuOpen}
          aria-controls="mobile-menu"
          aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <svg
            className="w-6 h-6 text-[#F0F3F6]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            {mobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Navigation Menu */}
      {mobileMenuOpen && (
        <nav
          id="mobile-menu"
          className="md:hidden bg-[#0D1117]/95 backdrop-blur-md border-t border-[#21262D]"
          aria-label="Mobile navigation"
        >
          <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col gap-4">
            <a
              href="#problem"
              className={`${navLinkClasses} py-2`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Problem
            </a>
            <a
              href="#features"
              className={`${navLinkClasses} py-2`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Features
            </a>
            <a
              href="#how-it-works"
              className={`${navLinkClasses} py-2`}
              onClick={() => setMobileMenuOpen(false)}
            >
              How It Works
            </a>
            <a
              href="#signup"
              className="px-5 py-3 bg-[#FF6B35] hover:bg-[#FF8255] text-[#0D1117] font-semibold rounded-full transition-colors text-center focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6B35] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0D1117]"
              onClick={() => setMobileMenuOpen(false)}
            >
              Get Early Access
            </a>
          </div>
        </nav>
      )}
    </header>
  );
}
