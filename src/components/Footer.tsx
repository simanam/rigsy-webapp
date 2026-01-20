import RigsyLogo from "./RigsyLogo";

export default function Footer() {
  const footerLinkClasses = "text-[#8B949E] hover:text-[#F0F3F6] transition-colors text-sm rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6B35] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0D1117]";

  return (
    <footer className="py-16 bg-[#0D1117] border-t border-[#21262D]" role="contentinfo">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Brand */}
          <div className="flex flex-col items-center md:items-start">
            <a
              href="#"
              aria-label="Rigsy - Return to top of page"
              className="mb-4 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6B35] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0D1117]"
            >
              <RigsyLogo size={36} variant="full" />
            </a>
            <p className="text-sm text-[#8B949E] text-center md:text-left max-w-xs">
              You run the rig. Rigsy runs the rest.
            </p>
          </div>

          {/* Links */}
          <nav aria-label="Footer navigation">
            <ul className="flex gap-8">
              <li>
                <a href="#problem" className={footerLinkClasses}>
                  Problem
                </a>
              </li>
              <li>
                <a href="#features" className={footerLinkClasses}>
                  Features
                </a>
              </li>
              <li>
                <a href="#how-it-works" className={footerLinkClasses}>
                  How It Works
                </a>
              </li>
              <li>
                <a href="#signup" className={footerLinkClasses}>
                  Waitlist
                </a>
              </li>
            </ul>
          </nav>

          {/* Contact */}
          <div className="flex items-center gap-4">
            <a
              href="mailto:hello-rigsy@logixtecs.com"
              className={footerLinkClasses}
            >
              hello-rigsy@logixtecs.com
            </a>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-[#21262D] flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-[#6E7681]">
            &copy; {new Date().getFullYear()} Logixtecs Solutions LLC. All rights
            reserved.
          </p>
          <div className="flex items-center gap-6">
            <a
              href="/accessibility"
              className="text-sm text-[#6E7681] hover:text-[#F0F3F6] transition-colors rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6B35] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0D1117]"
            >
              Accessibility
            </a>
            <p className="text-sm text-[#6E7681]">
              Built for the drivers who keep America moving.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
