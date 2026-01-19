"use client";

import { useState, useEffect } from "react";
import RigsyLogo from "./RigsyLogo";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#0D1117]/90 backdrop-blur-md border-b border-[#21262D]"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <a href="#">
          <RigsyLogo size={36} variant="full" />
        </a>

        <nav className="hidden md:flex items-center gap-8">
          <a
            href="#problem"
            className="text-[#8B949E] hover:text-[#F0F3F6] transition-colors"
          >
            Problem
          </a>
          <a
            href="#features"
            className="text-[#8B949E] hover:text-[#F0F3F6] transition-colors"
          >
            Features
          </a>
          <a
            href="#how-it-works"
            className="text-[#8B949E] hover:text-[#F0F3F6] transition-colors"
          >
            How It Works
          </a>
          <a
            href="#signup"
            className="px-5 py-2.5 bg-[#FF6B35] hover:bg-[#FF8255] text-[#0D1117] font-semibold rounded-full transition-colors"
          >
            Get Early Access
          </a>
        </nav>

        {/* Mobile menu button */}
        <a
          href="#signup"
          className="md:hidden px-4 py-2 bg-[#FF6B35] hover:bg-[#FF8255] text-[#0D1117] font-semibold rounded-full transition-colors text-sm"
        >
          Get Access
        </a>
      </div>
    </header>
  );
}
