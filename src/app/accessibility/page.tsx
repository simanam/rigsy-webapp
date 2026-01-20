import { Metadata } from "next";
import Link from "next/link";
import RigsyLogo from "@/components/RigsyLogo";

export const metadata: Metadata = {
  title: "Accessibility Statement | Rigsy",
  description: "Rigsy's commitment to digital accessibility and WCAG 2.1 Level AA compliance.",
};

export default function AccessibilityStatement() {
  const lastReviewDate = "January 19, 2026";

  return (
    <div className="min-h-screen bg-[#0D1117]">
      {/* Header */}
      <header className="border-b border-[#21262D]">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <Link
            href="/"
            aria-label="Rigsy - Return to homepage"
            className="inline-block rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6B35] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0D1117]"
          >
            <RigsyLogo size={32} variant="full" />
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main id="main-content" tabIndex={-1} className="max-w-4xl mx-auto px-6 py-12 md:py-16">
        <article>
          <h1 className="text-3xl md:text-4xl font-bold text-[#F0F3F6] mb-8">
            Accessibility Statement
          </h1>

          <div className="prose prose-invert max-w-none space-y-8 text-[#8B949E]">
            <section>
              <h2 className="text-xl font-semibold text-[#F0F3F6] mb-3">
                Our Commitment
              </h2>
              <p className="leading-relaxed">
                Logixtecs Solutions LLC is committed to ensuring digital accessibility for people
                with disabilities. We are continually improving the user experience for everyone
                and applying the relevant accessibility standards.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-[#F0F3F6] mb-3">
                Conformance Goal
              </h2>
              <p className="leading-relaxed">
                We strive to conform to the{" "}
                <strong className="text-[#F0F3F6]">
                  Web Content Accessibility Guidelines (WCAG) 2.1 Level AA
                </strong>
                . These guidelines explain how to make web content more accessible for people
                with disabilities and more user-friendly for everyone.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-[#F0F3F6] mb-3">
                Ongoing Efforts
              </h2>
              <p className="leading-relaxed">
                Accessibility is an ongoing effort. While we work toward full compliance,
                we acknowledge that some areas of our site may not yet be fully accessible.
                We are actively working to identify and address these issues.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-[#F0F3F6] mb-3">
                Feedback
              </h2>
              <p className="leading-relaxed">
                We welcome your feedback on the accessibility of Rigsy. If you encounter
                any barriers or have suggestions for improvement, please contact us:
              </p>
              <p className="mt-4">
                <a
                  href="mailto:accessibility@logixtecs.com"
                  className="text-[#FF6B35] hover:text-[#FF8255] underline underline-offset-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6B35] rounded"
                >
                  accessibility@logixtecs.com
                </a>
              </p>
              <p className="mt-2 text-sm">
                We aim to respond to accessibility feedback within 5 business days.
              </p>
            </section>

            <section className="pt-4 border-t border-[#21262D]">
              <p className="text-sm text-[#6E7681]">
                <strong className="text-[#8B949E]">Last reviewed:</strong> {lastReviewDate}
              </p>
            </section>
          </div>
        </article>

        {/* Back Link */}
        <div className="mt-12">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-[#8B949E] hover:text-[#F0F3F6] transition-colors rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6B35] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0D1117]"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to homepage
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#21262D] mt-auto">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <p className="text-sm text-[#6E7681] text-center">
            &copy; {new Date().getFullYear()} Logixtecs Solutions LLC. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
