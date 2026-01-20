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
    <div className="min-h-screen bg-[#FAFBFC]">
      {/* Header */}
      <header className="border-b border-[#E5E7EB] bg-white">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <Link
            href="/"
            aria-label="Rigsy - Return to homepage"
            className="inline-block rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F97316] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
          >
            <RigsyLogo size={32} variant="full" />
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main id="main-content" tabIndex={-1} className="max-w-4xl mx-auto px-6 py-12 md:py-16">
        <article>
          <h1 className="text-3xl md:text-4xl font-bold text-[#1F2937] mb-8">
            Accessibility Statement
          </h1>

          <div className="prose max-w-none space-y-8 text-[#4B5563]">
            <section>
              <h2 className="text-xl font-semibold text-[#1F2937] mb-3">
                Our Commitment
              </h2>
              <p className="leading-relaxed">
                Logixtecs Solutions LLC is committed to ensuring digital accessibility for people
                with disabilities. We are continually improving the user experience for everyone
                and applying the relevant accessibility standards.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-[#1F2937] mb-3">
                Conformance Goal
              </h2>
              <p className="leading-relaxed">
                We strive to conform to the{" "}
                <strong className="text-[#1F2937]">
                  Web Content Accessibility Guidelines (WCAG) 2.1 Level AA
                </strong>
                . These guidelines explain how to make web content more accessible for people
                with disabilities and more user-friendly for everyone.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-[#1F2937] mb-3">
                Ongoing Efforts
              </h2>
              <p className="leading-relaxed">
                Accessibility is an ongoing effort. While we work toward full compliance,
                we acknowledge that some areas of our site may not yet be fully accessible.
                We are actively working to identify and address these issues.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-[#1F2937] mb-3">
                Feedback
              </h2>
              <p className="leading-relaxed">
                We welcome your feedback on the accessibility of Rigsy. If you encounter
                any barriers or have suggestions for improvement, please contact us:
              </p>
              <p className="mt-4">
                <a
                  href="mailto:accessibility@logixtecs.com"
                  className="text-[#F97316] hover:text-[#EA580C] underline underline-offset-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F97316] rounded"
                >
                  accessibility@logixtecs.com
                </a>
              </p>
              <p className="mt-2 text-sm">
                We aim to respond to accessibility feedback within 5 business days.
              </p>
            </section>

            <section className="pt-4 border-t border-[#E5E7EB]">
              <p className="text-sm text-[#6B7280]">
                <strong className="text-[#4B5563]">Last reviewed:</strong> {lastReviewDate}
              </p>
            </section>
          </div>
        </article>

        {/* Back Link */}
        <div className="mt-12">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-[#4B5563] hover:text-[#1F2937] transition-colors rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F97316] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FAFBFC]"
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
      <footer className="border-t border-[#E5E7EB] mt-auto bg-white">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <p className="text-sm text-[#6B7280] text-center">
            &copy; {new Date().getFullYear()} Logixtecs Solutions LLC. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
