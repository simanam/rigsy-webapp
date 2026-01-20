"use client";

import { useState } from "react";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Client-side validation
    if (!isValidEmail(email)) {
      setError("Please enter a valid email address.");
      setLoading(false);
      return;
    }

    if (!role) {
      setError("Please select your role.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, role }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to join waitlist. Please try again.");
        return;
      }

      setSubmitted(true);
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="signup" aria-labelledby="signup-heading" className="py-24 bg-[#161B22] relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 w-[600px] h-[600px] bg-[#4B5EAA]/10 rounded-full blur-[128px] transform -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#FF6B35]/10 rounded-full blur-[128px]" />
      </div>

      <div className="max-w-4xl mx-auto px-6 relative z-10">
        {!submitted ? (
          <>
            {/* Header */}
            <div className="text-center mb-12">
              <span className="inline-block px-4 py-1.5 rounded-full bg-[#3FB950]/20 text-[#3FB950] text-sm font-medium mb-4">
                Early Access
              </span>
              <h2 id="signup-heading" className="text-4xl md:text-5xl font-bold text-[#F0F3F6] mb-4">
                Be First on the Road
              </h2>
              <p className="text-xl text-[#8B949E] max-w-2xl mx-auto">
                Join the waitlist for early access. Help shape the future of
                trucking while getting exclusive benefits.
              </p>
            </div>

            {/* Benefits */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              {[
                {
                  icon: (
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                  ),
                  title: "Early Beta Access",
                  description: "Be among the first to test Rigsy on the road",
                },
                {
                  icon: (
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  ),
                  title: "Founding Member Pricing",
                  description: "Lock in special rates for life",
                },
                {
                  icon: (
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                      />
                    </svg>
                  ),
                  title: "Shape the Product",
                  description: "Direct line to the team building Rigsy",
                },
              ].map((benefit, index) => (
                <div
                  key={index}
                  className="p-6 rounded-2xl bg-[#0D1117] border border-[#21262D] text-center"
                >
                  <div className="w-12 h-12 rounded-xl bg-[#FF6B35]/10 text-[#FF6B35] flex items-center justify-center mx-auto mb-4" aria-hidden="true">
                    {benefit.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-[#F0F3F6] mb-2">
                    {benefit.title}
                  </h3>
                  <p className="text-sm text-[#8B949E]">{benefit.description}</p>
                </div>
              ))}
            </div>

            {/* Signup form */}
            <form
              onSubmit={handleSubmit}
              className="max-w-lg mx-auto p-8 rounded-3xl bg-[#0D1117] border border-[#21262D]"
              aria-label="Join the waitlist"
              noValidate
            >
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-[#F0F3F6] mb-2"
                  >
                    Email Address
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      id="email"
                      name="email"
                      autoComplete="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (error) setError("");
                      }}
                      placeholder="driver@example.com"
                      required
                      aria-required="true"
                      aria-invalid={email && !isValidEmail(email) ? "true" : "false"}
                      aria-describedby={email && !isValidEmail(email) ? "email-error" : undefined}
                      className={`w-full px-4 py-3 rounded-xl bg-[#161B22] border text-[#F0F3F6] placeholder-[#6E7681] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6B35] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0D1117] ${
                        email && !isValidEmail(email)
                          ? "border-red-500"
                          : email && isValidEmail(email)
                          ? "border-[#3FB950]"
                          : "border-[#21262D]"
                      }`}
                    />
                    {email && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2" aria-hidden="true">
                        {isValidEmail(email) ? (
                          <svg className="w-5 h-5 text-[#3FB950]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        ) : (
                          <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        )}
                      </div>
                    )}
                  </div>
                  {email && !isValidEmail(email) && (
                    <p id="email-error" className="text-xs text-red-500 mt-1" role="alert">
                      Please enter a valid email address
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="role"
                    className="block text-sm font-medium text-[#F0F3F6] mb-2"
                  >
                    I am a...
                  </label>
                  <select
                    id="role"
                    name="role"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    required
                    aria-required="true"
                    className="w-full px-4 py-3 rounded-xl bg-[#161B22] border border-[#21262D] text-[#F0F3F6] transition-colors appearance-none cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6B35] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0D1117]"
                  >
                    <option value="" disabled>
                      Select your role
                    </option>
                    <option value="owner-operator">Owner-Operator</option>
                    <option value="company-driver">Company Driver</option>
                    <option value="fleet-manager">Fleet Manager</option>
                    <option value="investor">Investor</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  aria-busy={loading}
                  className="w-full py-4 bg-[#FF6B35] hover:bg-[#FF8255] text-[#0D1117] font-semibold rounded-xl transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 glow-orange focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6B35] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0D1117]"
                >
                  {loading ? (
                    <>
                      <span className="sr-only">Submitting form, please wait</span>
                      <span className="flex items-center justify-center gap-2" aria-hidden="true">
                        <svg
                          className="animate-spin w-5 h-5"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                        Joining...
                      </span>
                    </>
                  ) : (
                    "Join the Waitlist"
                  )}
                </button>

                {error && (
                  <p id="form-error" className="text-sm text-red-500 text-center mt-2" role="alert" aria-live="polite">
                    {error}
                  </p>
                )}
              </div>

              <p className="text-xs text-[#6E7681] text-center mt-4">
                No spam, ever. We&apos;ll only email you about Rigsy updates.
              </p>
            </form>
          </>
        ) : (
          /* Success state */
          <div className="text-center py-12" role="status" aria-live="polite">
            <div className="w-20 h-20 rounded-full bg-[#3FB950]/20 flex items-center justify-center mx-auto mb-6" aria-hidden="true">
              <svg
                className="w-10 h-10 text-[#3FB950]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h2 id="signup-heading" className="text-3xl md:text-4xl font-bold text-[#F0F3F6] mb-4">
              You&apos;re on the List!
            </h2>
            <p className="text-xl text-[#8B949E] max-w-md mx-auto mb-8">
              Thanks for joining, driver. We&apos;ll be in touch soon with early
              access details.
            </p>
            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-[#161B22] border border-[#21262D]">
              <span className="text-[#FF6B35]">&ldquo;</span>
              <span className="text-[#F0F3F6] italic">
                See you on the road, driver.
              </span>
              <span className="text-[#FF6B35]">&rdquo;</span>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
