import RigsyLogo from "./RigsyLogo";

export default function Footer() {
  return (
    <footer className="py-16 bg-[#0D1117] border-t border-[#21262D]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Brand */}
          <div className="flex flex-col items-center md:items-start">
            <a href="#" className="mb-4">
              <RigsyLogo size={36} variant="full" />
            </a>
            <p className="text-sm text-[#8B949E] text-center md:text-left max-w-xs">
              A co-pilot who knows the road, knows the regs, and knows you.
            </p>
          </div>

          {/* Links */}
          <div className="flex gap-8">
            <a
              href="#problem"
              className="text-[#8B949E] hover:text-[#F0F3F6] transition-colors text-sm"
            >
              Problem
            </a>
            <a
              href="#features"
              className="text-[#8B949E] hover:text-[#F0F3F6] transition-colors text-sm"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              className="text-[#8B949E] hover:text-[#F0F3F6] transition-colors text-sm"
            >
              How It Works
            </a>
            <a
              href="#signup"
              className="text-[#8B949E] hover:text-[#F0F3F6] transition-colors text-sm"
            >
              Waitlist
            </a>
          </div>

          {/* Contact */}
          <div className="flex items-center gap-4">
            <a
              href="mailto:hello@rigsy.ai"
              className="text-[#8B949E] hover:text-[#F0F3F6] transition-colors text-sm"
            >
              hello@rigsy.ai
            </a>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-[#21262D] flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-[#6E7681]">
            &copy; {new Date().getFullYear()} Logixtecs Solutions LLC. All rights
            reserved.
          </p>
          <p className="text-sm text-[#6E7681]">
            Built for the Industrial Athletes who keep America moving.
          </p>
        </div>
      </div>
    </footer>
  );
}
