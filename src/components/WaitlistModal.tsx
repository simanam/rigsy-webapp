"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface WaitlistModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function WaitlistModal({ isOpen, onClose }: WaitlistModalProps) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

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

  const handleClose = () => {
    onClose();
    // Reset form after animation
    setTimeout(() => {
      setEmail("");
      setRole("");
      setSubmitted(false);
      setError("");
    }, 300);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
            aria-hidden="true"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="waitlist-modal-title"
          >
            <div className="relative w-full max-w-md bg-[#0D1117] border border-[#21262D] rounded-2xl shadow-2xl overflow-hidden">
              {/* Close button */}
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 p-2 text-[#8B949E] hover:text-[#F0F3F6] transition-colors rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F97316]"
                aria-label="Close modal"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {!submitted ? (
                <div className="p-6 sm:p-8">
                  {/* Header */}
                  <div className="text-center mb-6">
                    <div className="w-12 h-12 rounded-full bg-[#F97316]/20 flex items-center justify-center mx-auto mb-4">
                      <svg className="w-6 h-6 text-[#F97316]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                      </svg>
                    </div>
                    <h2 id="waitlist-modal-title" className="text-2xl font-bold text-[#F0F3F6] mb-2">
                      Join the Waitlist
                    </h2>
                    <p className="text-sm text-[#8B949E]">
                      Be first to experience Rigsy when we launch. Get early access and founding member pricing.
                    </p>
                  </div>

                  {/* Form */}
                  <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                    <div>
                      <label
                        htmlFor="modal-email"
                        className="block text-sm font-medium text-[#F0F3F6] mb-2"
                      >
                        Email Address
                      </label>
                      <div className="relative">
                        <input
                          type="email"
                          id="modal-email"
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
                          className={`w-full px-4 py-3 rounded-xl bg-[#161B22] border text-[#F0F3F6] placeholder-[#6E7681] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F97316] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0D1117] ${
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
                    </div>

                    <div>
                      <label
                        htmlFor="modal-role"
                        className="block text-sm font-medium text-[#F0F3F6] mb-2"
                      >
                        I am a...
                      </label>
                      <select
                        id="modal-role"
                        name="role"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        required
                        aria-required="true"
                        className="w-full px-4 py-3 rounded-xl bg-[#161B22] border border-[#21262D] text-[#F0F3F6] transition-colors appearance-none cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F97316] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0D1117]"
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
                      className="w-full py-3 bg-[#F97316] hover:bg-[#FB923C] text-white font-semibold rounded-xl transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F97316] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0D1117]"
                    >
                      {loading ? (
                        <span className="flex items-center justify-center gap-2">
                          <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          Joining...
                        </span>
                      ) : (
                        "Join the Waitlist"
                      )}
                    </button>

                    {error && (
                      <p className="text-sm text-red-500 text-center" role="alert">
                        {error}
                      </p>
                    )}
                  </form>

                  <p className="text-xs text-[#6E7681] text-center mt-4">
                    No spam, ever. We&apos;ll only email you about Rigsy updates.
                  </p>
                </div>
              ) : (
                /* Success state */
                <div className="p-6 sm:p-8 text-center">
                  <div className="w-16 h-16 rounded-full bg-[#3FB950]/20 flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-[#3FB950]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-[#F0F3F6] mb-2">
                    You&apos;re on the List!
                  </h2>
                  <p className="text-sm text-[#8B949E] mb-6">
                    Thanks for joining, driver. We&apos;ll be in touch soon with early access details.
                  </p>
                  <button
                    onClick={handleClose}
                    className="px-6 py-3 bg-[#21262D] hover:bg-[#30363D] text-[#F0F3F6] font-medium rounded-xl transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F97316]"
                  >
                    Got it!
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
