"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

export default function Hero() {
  const [mousePosition, setMousePosition] = useState({ x: 0.5, y: 0.5 });
  const [isBlinking, setIsBlinking] = useState(false);
  const [isAwake, setIsAwake] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const phoneRef = useRef<HTMLDivElement>(null);

  // Track mouse position relative to phone
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (phoneRef.current) {
        const rect = phoneRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const relX = (e.clientX - centerX) / (window.innerWidth / 2);
        const relY = (e.clientY - centerY) / (window.innerHeight / 2);

        setMousePosition({
          x: Math.max(-1, Math.min(1, relX)),
          y: Math.max(-1, Math.min(1, relY)),
        });
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Random blink effect
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      if (Math.random() > 0.7) {
        setIsBlinking(true);
        setTimeout(() => setIsBlinking(false), 150);
      }
    }, 2500);

    return () => clearInterval(blinkInterval);
  }, []);

  // Auto wake up after a delay for demo
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAwake(true);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  // Calculate pupil position
  const pupilOffsetX = mousePosition.x * 12;
  const pupilOffsetY = mousePosition.y * 8;

  const handleMicClick = () => {
    setIsListening(true);
    setIsAwake(true);
    // Simulate listening then responding
    setTimeout(() => {
      setIsListening(false);
    }, 3000);
  };

  // Eye dimensions constants
  const eyeR = 72;
  const innerR = eyeR * 0.8;
  const pupilR = eyeR * 0.39;
  const highlightR = pupilR * 0.32;
  const highlight2R = pupilR * 0.16;
  const eyelidR = innerR + 1;

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16 sm:pt-20">
      {/* Background gradient effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 sm:w-96 h-64 sm:h-96 bg-[#4B5EAA]/20 rounded-full blur-[128px]" />
        <div className="absolute bottom-1/4 right-1/4 w-64 sm:w-96 h-64 sm:h-96 bg-[#FF6B35]/15 rounded-full blur-[128px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-12">
        <div className="grid lg:grid-cols-2 gap-6 sm:gap-12 lg:gap-16 items-center">
          {/* Left Column - Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-4 sm:space-y-6 text-center lg:text-left order-2 lg:order-1"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-[#161B22] border border-[#21262D]"
            >
              <span className="w-2 h-2 rounded-full bg-[#3FB950] animate-pulse" />
              <span className="text-xs sm:text-sm text-[#8B949E]">
                Now accepting early access signups
              </span>
            </motion.div>

            {/* Main heading */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-[#F0F3F6] leading-[1.1]"
            >
              Your AI Co-Pilot
              <br />
              <span className="text-gradient">for the Long Haul</span>
            </motion.h1>

            {/* Subheading */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-base sm:text-lg md:text-xl text-[#8B949E] max-w-xl mx-auto lg:mx-0"
            >
              Rigsy is a voice-first AI companion built for professional truck
              drivers. Handle ELD compliance, get health coaching, and never
              drive alone again.
            </motion.p>

            {/* CTA buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-4"
            >
              <a
                href="#signup"
                className="px-6 sm:px-8 py-3 sm:py-4 bg-[#FF6B35] hover:bg-[#FF8255] text-[#0D1117] font-semibold rounded-full transition-all transform hover:scale-105 glow-orange text-base sm:text-lg w-full sm:w-auto text-center"
              >
                Join the Waitlist
              </a>
              <a
                href="#features"
                className="px-6 sm:px-8 py-3 sm:py-4 border border-[#21262D] hover:border-[#4B5EAA] text-[#F0F3F6] font-semibold rounded-full transition-all text-base sm:text-lg w-full sm:w-auto text-center"
              >
                See Features
              </a>
            </motion.div>

            {/* Trust indicators - hidden on very small screens */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="hidden sm:flex flex-wrap items-center justify-center lg:justify-start gap-4 sm:gap-6 pt-2 sm:pt-4"
            >
              <div className="flex items-center gap-2">
                <svg className="w-4 sm:w-5 h-4 sm:h-5 text-[#3FB950]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-xs sm:text-sm text-[#8B949E]">Voice-First</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-4 sm:w-5 h-4 sm:h-5 text-[#3FB950]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-xs sm:text-sm text-[#8B949E]">ELD Integration</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-4 sm:w-5 h-4 sm:h-5 text-[#3FB950]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-xs sm:text-sm text-[#8B949E]">Works Offline</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Column - Phone with Rigsy Eyes */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="relative flex flex-col items-center justify-center order-1 lg:order-2"
          >
            {/* Phone Mockup */}
            <motion.div
              ref={phoneRef}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="relative w-full max-w-xs sm:max-w-xl"
            >
              {/* Animated glow effect */}
              <motion.div
                animate={{
                  scale: [1, 1.05, 1],
                  opacity: isListening ? [0.5, 0.8, 0.5] : [0.2, 0.4, 0.2],
                }}
                transition={{
                  duration: isListening ? 1 : 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute inset-0 bg-gradient-to-r from-[#4B5EAA] via-[#FF6B35] to-[#4B5EAA] rounded-[1.5rem] sm:rounded-[2.5rem] blur-2xl -z-10"
              />

              {/* Phone frame */}
              <div className="relative bg-gradient-to-br from-[#1a1a1a] to-[#2d2d2d] rounded-[1.5rem] sm:rounded-[2.5rem] p-[3px] sm:p-[4px] shadow-2xl">

                {/* Phone Screen - Horizontal on all sizes */}
                <div
                  className="relative bg-[#0D1117] rounded-[1.3rem] sm:rounded-[2.2rem] overflow-hidden aspect-[16/10] sm:aspect-[19.5/9]"
                >
                  {/* Dynamic Island */}
                  <div className="absolute top-1/2 left-2 sm:left-4 -translate-y-1/2 w-3 sm:w-5 h-10 sm:h-16 bg-[#000000] rounded-full z-20" />

                  {/* Rigsy Eyes Interface */}
                  <div className="absolute inset-0 flex items-center justify-center p-3 sm:p-6 sm:py-8">
                    {/* Horizontal layout SVG for mobile */}
                    <svg viewBox="0 0 400 180" className="w-full h-full sm:hidden" preserveAspectRatio="xMidYMid meet">
                      {/* SVG Definitions for mobile */}
                      <defs>
                        <linearGradient id="mobileBodyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="#2D2D44" />
                          <stop offset="100%" stopColor="#1A1A2E" />
                        </linearGradient>
                        <linearGradient id="mobileEyeRingGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="#F0F3F6" />
                          <stop offset="100%" stopColor="#B0B0C0" />
                        </linearGradient>
                        <radialGradient id="mobileInnerEyeGradient" cx="50%" cy="30%" r="70%">
                          <stop offset="0%" stopColor="#2D2D44" />
                          <stop offset="100%" stopColor="#0D1117" />
                        </radialGradient>
                        <radialGradient id="mobilePupilGradient" cx="30%" cy="30%" r="70%">
                          <stop offset="0%" stopColor="#1A1A2E" />
                          <stop offset="100%" stopColor="#000000" />
                        </radialGradient>
                        <filter id="mobileGlow" x="-50%" y="-50%" width="200%" height="200%">
                          <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                          <feMerge>
                            <feMergeNode in="coloredBlur"/>
                            <feMergeNode in="SourceGraphic"/>
                          </feMerge>
                        </filter>
                      </defs>

                      {/* Horizontal binocular body - same as desktop */}
                      <g>
                        {/* Left goggle */}
                        <ellipse cx="110" cy="90" rx="100" ry="88" fill="url(#mobileBodyGradient)" />
                        {/* Right goggle */}
                        <ellipse cx="290" cy="90" rx="100" ry="88" fill="url(#mobileBodyGradient)" />
                        {/* Bridge */}
                        <path
                          d="M 160 35 Q 200 5 240 35 L 240 145 Q 200 175 160 145 Z"
                          fill="url(#mobileBodyGradient)"
                        />
                      </g>

                      {/* Left eye */}
                      <g>
                        <circle cx={110} cy={90} r={72} fill="none" stroke="url(#mobileEyeRingGradient)" strokeWidth="10" />
                        <circle cx={110} cy={90} r={57.6} fill="url(#mobileInnerEyeGradient)" />
                        <motion.g
                          animate={{
                            x: pupilOffsetX,
                            y: pupilOffsetY,
                            scale: isAwake ? 1 : 0
                          }}
                          transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        >
                          <circle cx={110} cy={90} r={28} fill="url(#mobilePupilGradient)" />
                          <circle cx={98} cy={78} r={9} fill="white" opacity="0.9" />
                          <circle cx={118} cy={98} r={4.5} fill="white" opacity="0.5" />
                        </motion.g>
                        <motion.ellipse
                          cx={110}
                          cy={90}
                          rx={58.6}
                          fill="#1A1A2E"
                          animate={{ ry: isBlinking || !isAwake ? 58.6 : 0 }}
                          transition={{ duration: isAwake ? 0.1 : 0.5 }}
                        />
                        <path d="M 60 50 Q 110 12 160 50" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" opacity="0.15" />
                      </g>

                      {/* Right eye */}
                      <g>
                        <circle cx={290} cy={90} r={72} fill="none" stroke="url(#mobileEyeRingGradient)" strokeWidth="10" />
                        <circle cx={290} cy={90} r={57.6} fill="url(#mobileInnerEyeGradient)" />
                        <motion.g
                          animate={{
                            x: pupilOffsetX,
                            y: pupilOffsetY,
                            scale: isAwake ? 1 : 0
                          }}
                          transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        >
                          <circle cx={290} cy={90} r={28} fill="url(#mobilePupilGradient)" />
                          <circle cx={278} cy={78} r={9} fill="white" opacity="0.9" />
                          <circle cx={298} cy={98} r={4.5} fill="white" opacity="0.5" />
                        </motion.g>
                        <motion.ellipse
                          cx={290}
                          cy={90}
                          rx={58.6}
                          fill="#1A1A2E"
                          animate={{ ry: isBlinking || !isAwake ? 58.6 : 0 }}
                          transition={{ duration: isAwake ? 0.1 : 0.5 }}
                        />
                        <path d="M 240 50 Q 290 12 340 50" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" opacity="0.15" />
                      </g>

                      {/* Orange accent on bridge */}
                      <motion.circle
                        cx="200"
                        cy="90"
                        r="6"
                        fill="#FF6B35"
                        filter="url(#mobileGlow)"
                        animate={{
                          opacity: isListening ? [0.8, 1, 0.8] : 0.6,
                          r: isListening ? [6, 10, 6] : 6
                        }}
                        transition={{ duration: 0.5, repeat: isListening ? Infinity : 0 }}
                      />
                    </svg>

                    {/* Horizontal layout SVG for desktop */}
                    <svg viewBox="0 0 400 180" className="hidden sm:block w-full h-full" preserveAspectRatio="xMidYMid meet">
                      {/* SVG Definitions */}
                      <defs>
                        <linearGradient id="heroBodyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="#2D2D44" />
                          <stop offset="100%" stopColor="#1A1A2E" />
                        </linearGradient>
                        <linearGradient id="heroEyeRingGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="#F0F3F6" />
                          <stop offset="100%" stopColor="#B0B0C0" />
                        </linearGradient>
                        <radialGradient id="heroInnerEyeGradient" cx="50%" cy="30%" r="70%">
                          <stop offset="0%" stopColor="#2D2D44" />
                          <stop offset="100%" stopColor="#0D1117" />
                        </radialGradient>
                        <radialGradient id="heroPupilGradient" cx="30%" cy="30%" r="70%">
                          <stop offset="0%" stopColor="#1A1A2E" />
                          <stop offset="100%" stopColor="#000000" />
                        </radialGradient>
                        <filter id="heroGlow" x="-50%" y="-50%" width="200%" height="200%">
                          <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                          <feMerge>
                            <feMergeNode in="coloredBlur"/>
                            <feMergeNode in="SourceGraphic"/>
                          </feMerge>
                        </filter>
                      </defs>

                      {/* Main body - binocular shape - MASSIVE */}
                      <g>
                        {/* Left goggle */}
                        <ellipse cx="110" cy="90" rx="100" ry="88" fill="url(#heroBodyGradient)" />
                        {/* Right goggle */}
                        <ellipse cx="290" cy="90" rx="100" ry="88" fill="url(#heroBodyGradient)" />
                        {/* Bridge */}
                        <path
                          d="M 160 35 Q 200 5 240 35 L 240 145 Q 200 175 160 145 Z"
                          fill="url(#heroBodyGradient)"
                        />
                      </g>

                      {/* Left eye - inlined for stable animations */}
                      <g>
                        <circle cx={110} cy={90} r={eyeR} fill="none" stroke="url(#heroEyeRingGradient)" strokeWidth="10" />
                        <circle cx={110} cy={90} r={innerR} fill="url(#heroInnerEyeGradient)" />

                        {/* Pupil with mouse tracking */}
                        <motion.g
                          animate={{
                            x: pupilOffsetX,
                            y: pupilOffsetY,
                            scale: isAwake ? 1 : 0
                          }}
                          transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        >
                          <circle cx={110} cy={90} r={pupilR} fill="url(#heroPupilGradient)" />
                          <circle cx={110 - highlightR * 1.3} cy={90 - highlightR * 1.3} r={highlightR} fill="white" opacity="0.9" />
                          <circle cx={110 + highlight2R * 1.8} cy={90 + highlight2R * 1.8} r={highlight2R} fill="white" opacity="0.5" />
                        </motion.g>

                        {/* Eyelid for blink */}
                        <motion.ellipse
                          cx={110}
                          cy={90}
                          rx={eyelidR}
                          fill="#1A1A2E"
                          animate={{ ry: isBlinking || !isAwake ? eyelidR : 0 }}
                          transition={{ duration: isAwake ? 0.1 : 0.5 }}
                        />

                        {/* Eye shine arc */}
                        <path
                          d={`M ${110 - eyeR * 0.7} ${90 - eyeR * 0.55} Q ${110} ${90 - eyeR * 0.86} ${110 + eyeR * 0.7} ${90 - eyeR * 0.55}`}
                          fill="none"
                          stroke="white"
                          strokeWidth="4"
                          strokeLinecap="round"
                          opacity="0.15"
                        />
                      </g>

                      {/* Right eye - inlined for stable animations */}
                      <g>
                        <circle cx={290} cy={90} r={eyeR} fill="none" stroke="url(#heroEyeRingGradient)" strokeWidth="10" />
                        <circle cx={290} cy={90} r={innerR} fill="url(#heroInnerEyeGradient)" />

                        {/* Pupil with mouse tracking */}
                        <motion.g
                          animate={{
                            x: pupilOffsetX,
                            y: pupilOffsetY,
                            scale: isAwake ? 1 : 0
                          }}
                          transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        >
                          <circle cx={290} cy={90} r={pupilR} fill="url(#heroPupilGradient)" />
                          <circle cx={290 - highlightR * 1.3} cy={90 - highlightR * 1.3} r={highlightR} fill="white" opacity="0.9" />
                          <circle cx={290 + highlight2R * 1.8} cy={90 + highlight2R * 1.8} r={highlight2R} fill="white" opacity="0.5" />
                        </motion.g>

                        {/* Eyelid for blink */}
                        <motion.ellipse
                          cx={290}
                          cy={90}
                          rx={eyelidR}
                          fill="#1A1A2E"
                          animate={{ ry: isBlinking || !isAwake ? eyelidR : 0 }}
                          transition={{ duration: isAwake ? 0.1 : 0.5 }}
                        />

                        {/* Eye shine arc */}
                        <path
                          d={`M ${290 - eyeR * 0.7} ${90 - eyeR * 0.55} Q ${290} ${90 - eyeR * 0.86} ${290 + eyeR * 0.7} ${90 - eyeR * 0.55}`}
                          fill="none"
                          stroke="white"
                          strokeWidth="4"
                          strokeLinecap="round"
                          opacity="0.15"
                        />
                      </g>

                      {/* Orange accent on bridge */}
                      <motion.circle
                        cx="200"
                        cy="90"
                        r="6"
                        fill="#FF6B35"
                        filter="url(#heroGlow)"
                        animate={{
                          opacity: isListening ? [0.8, 1, 0.8] : 0.6,
                          r: isListening ? [6, 10, 6] : 6
                        }}
                        transition={{ duration: 0.5, repeat: isListening ? Infinity : 0 }}
                      />
                    </svg>
                  </div>

                  {/* Hey Rigsy Button */}
                  <div className="absolute bottom-2 sm:bottom-4 left-1/2 -translate-x-1/2 z-30">
                    <motion.button
                      onClick={handleMicClick}
                      className={`flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-2 sm:py-3 rounded-full transition-all shadow-xl ${
                        isListening
                          ? "bg-[#FF6B35] text-white"
                          : "bg-[#161B22]/90 backdrop-blur-sm border border-[#21262D] text-[#F0F3F6] hover:border-[#FF6B35]"
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <motion.div
                        animate={isListening ? { scale: [1, 1.2, 1] } : {}}
                        transition={{ duration: 0.5, repeat: isListening ? Infinity : 0 }}
                      >
                        <svg
                          className={`w-4 h-4 sm:w-5 sm:h-5 ${isListening ? "text-white" : "text-[#FF6B35]"}`}
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                          />
                        </svg>
                      </motion.div>
                      <span className="font-semibold text-xs sm:text-sm">
                        {isListening ? "Listening..." : "Hey Rigsy"}
                      </span>
                      {isListening && (
                        <div className="flex items-center gap-0.5 ml-1">
                          {[...Array(3)].map((_, i) => (
                            <motion.div
                              key={i}
                              className="w-1 bg-white rounded-full"
                              animate={{ height: [6, 12, 6] }}
                              transition={{
                                duration: 0.5,
                                repeat: Infinity,
                                delay: i * 0.1,
                              }}
                            />
                          ))}
                        </div>
                      )}
                    </motion.button>
                  </div>

                  {/* Subtle grid overlay */}
                  <div
                    className="absolute inset-0 opacity-[0.03] pointer-events-none"
                    style={{
                      backgroundImage: `radial-gradient(circle at 1px 1px, #F0F3F6 1px, transparent 0)`,
                      backgroundSize: "24px 24px",
                    }}
                  />
                </div>
              </div>

              {/* Floating badges - desktop (outside phone) */}
              <motion.div
                animate={{ y: [-5, 5, -5] }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute -left-4 top-4 bg-[#161B22] px-3 py-2 rounded-xl border border-[#21262D] shadow-xl hidden sm:block"
              >
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#3FB950] animate-pulse" />
                  <span className="text-xs font-medium text-[#F0F3F6] whitespace-nowrap">
                    Voice Active
                  </span>
                </div>
              </motion.div>

              <motion.div
                animate={{ y: [5, -5, 5] }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.5,
                }}
                className="absolute -right-4 bottom-4 bg-[#161B22] px-3 py-2 rounded-xl border border-[#21262D] shadow-xl hidden sm:block"
              >
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#FF6B35] animate-pulse" />
                  <span className="text-xs font-medium text-[#F0F3F6] whitespace-nowrap">
                    ELD Connected
                  </span>
                </div>
              </motion.div>

              <motion.div
                animate={{ y: [-3, 3, -3] }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1,
                }}
                className="absolute -right-2 top-8 bg-[#161B22] px-3 py-2 rounded-xl border border-[#21262D] shadow-xl hidden sm:block"
              >
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#4B5EAA] animate-pulse" />
                  <span className="text-xs font-medium text-[#F0F3F6] whitespace-nowrap">
                    Offline Ready
                  </span>
                </div>
              </motion.div>
            </motion.div>

            {/* Mobile badges - below phone */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="flex sm:hidden flex-wrap justify-center gap-2 mt-4"
            >
              <div className="bg-[#161B22] px-3 py-1.5 rounded-full border border-[#21262D]">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#3FB950] animate-pulse" />
                  <span className="text-[10px] font-medium text-[#F0F3F6]">Voice Active</span>
                </div>
              </div>
              <div className="bg-[#161B22] px-3 py-1.5 rounded-full border border-[#21262D]">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#FF6B35] animate-pulse" />
                  <span className="text-[10px] font-medium text-[#F0F3F6]">ELD Connected</span>
                </div>
              </div>
              <div className="bg-[#161B22] px-3 py-1.5 rounded-full border border-[#21262D]">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#4B5EAA] animate-pulse" />
                  <span className="text-[10px] font-medium text-[#F0F3F6]">Offline Ready</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator - hidden on small screens */}
      <div className="absolute bottom-4 sm:bottom-8 left-1/2 transform -translate-x-1/2 hidden sm:block">
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-6 h-10 rounded-full border-2 border-[#21262D] flex items-start justify-center p-2"
        >
          <div className="w-1 h-2 bg-[#8B949E] rounded-full" />
        </motion.div>
      </div>
    </section>
  );
}
