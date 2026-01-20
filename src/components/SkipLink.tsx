"use client";

export default function SkipLink() {
  return (
    <a
      href="#main-content"
      className="sr-only sr-only-focusable focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:bg-[#FF6B35] focus:text-[#0D1117] focus:px-6 focus:py-3 focus:rounded-lg focus:font-semibold focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#0D1117]"
    >
      Skip to main content
    </a>
  );
}
