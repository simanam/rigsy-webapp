"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

interface RigsyMascotProps {
  size?: number;
  className?: string;
}

export default function RigsyMascot({ size = 300, className = "" }: RigsyMascotProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0.5, y: 0.5 });
  const [isBlinking, setIsBlinking] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Track mouse position
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        // Calculate relative position from center (-1 to 1)
        const relX = (e.clientX - centerX) / (window.innerWidth / 2);
        const relY = (e.clientY - centerY) / (window.innerHeight / 2);

        // Clamp values
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
    }, 2000);

    return () => clearInterval(blinkInterval);
  }, []);

  // Calculate pupil position based on mouse
  const pupilOffsetX = mousePosition.x * 8;
  const pupilOffsetY = mousePosition.y * 6;

  // Calculate slight head tilt based on mouse
  const headRotation = mousePosition.x * 3;

  return (
    <div ref={containerRef} className={`relative ${className}`} style={{ width: size, height: size * 0.5 }} aria-hidden="true">
      <motion.svg
        viewBox="0 0 400 200"
        className="w-full h-full"
        animate={{ rotate: headRotation }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        role="img"
      >
        {/* Definitions for gradients and shadows */}
        <defs>
          {/* Body gradient */}
          <linearGradient id="bodyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#2D2D44" />
            <stop offset="100%" stopColor="#1A1A2E" />
          </linearGradient>

          {/* Eye ring gradient */}
          <linearGradient id="eyeRingGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#F0F3F6" />
            <stop offset="100%" stopColor="#B0B0C0" />
          </linearGradient>

          {/* Inner eye gradient */}
          <radialGradient id="innerEyeGradient" cx="50%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#2D2D44" />
            <stop offset="100%" stopColor="#0D1117" />
          </radialGradient>

          {/* Pupil gradient */}
          <radialGradient id="pupilGradient" cx="30%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#1A1A2E" />
            <stop offset="100%" stopColor="#000000" />
          </radialGradient>

          {/* Highlight gradient */}
          <radialGradient id="highlightGradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
          </radialGradient>

          {/* Orange glow */}
          <filter id="orangeGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>

          {/* Shadow filter */}
          <filter id="dropShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="4" stdDeviation="8" floodColor="#000000" floodOpacity="0.3"/>
          </filter>
        </defs>

        {/* Main body - binocular/goggle shape */}
        <g filter="url(#dropShadow)">
          {/* Left goggle */}
          <ellipse cx="120" cy="100" rx="85" ry="80" fill="url(#bodyGradient)" />

          {/* Right goggle */}
          <ellipse cx="280" cy="100" rx="85" ry="80" fill="url(#bodyGradient)" />

          {/* Bridge connecting the goggles */}
          <path
            d="M 170 60 Q 200 40 230 60 L 230 140 Q 200 160 170 140 Z"
            fill="url(#bodyGradient)"
          />
        </g>

        {/* Left eye assembly */}
        <g>
          {/* Outer ring */}
          <circle cx="120" cy="100" r="55" fill="none" stroke="url(#eyeRingGradient)" strokeWidth="8" />

          {/* Inner dark area */}
          <circle cx="120" cy="100" r="45" fill="url(#innerEyeGradient)" />

          {/* Pupil area with mouse tracking */}
          <motion.g
            animate={{
              x: pupilOffsetX,
              y: pupilOffsetY,
            }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            {/* Pupil */}
            <circle cx="120" cy="100" r="20" fill="url(#pupilGradient)" />

            {/* Main highlight */}
            <circle cx="112" cy="92" r="6" fill="white" opacity="0.9" />

            {/* Secondary highlight */}
            <circle cx="126" cy="106" r="3" fill="white" opacity="0.5" />
          </motion.g>

          {/* Eyelid for blink effect */}
          <motion.ellipse
            cx="120"
            cy="100"
            rx="46"
            ry={isBlinking ? 46 : 0}
            fill="#1A1A2E"
            animate={{ ry: isBlinking ? 46 : 0 }}
            transition={{ duration: 0.1 }}
          />

          {/* Eye shine/reflection arc */}
          <path
            d="M 85 70 Q 120 55 155 70"
            fill="none"
            stroke="white"
            strokeWidth="3"
            strokeLinecap="round"
            opacity="0.15"
          />
        </g>

        {/* Right eye assembly */}
        <g>
          {/* Outer ring */}
          <circle cx="280" cy="100" r="55" fill="none" stroke="url(#eyeRingGradient)" strokeWidth="8" />

          {/* Inner dark area */}
          <circle cx="280" cy="100" r="45" fill="url(#innerEyeGradient)" />

          {/* Pupil area with mouse tracking */}
          <motion.g
            animate={{
              x: pupilOffsetX,
              y: pupilOffsetY,
            }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            {/* Pupil */}
            <circle cx="280" cy="100" r="20" fill="url(#pupilGradient)" />

            {/* Main highlight */}
            <circle cx="272" cy="92" r="6" fill="white" opacity="0.9" />

            {/* Secondary highlight */}
            <circle cx="286" cy="106" r="3" fill="white" opacity="0.5" />
          </motion.g>

          {/* Eyelid for blink effect */}
          <motion.ellipse
            cx="280"
            cy="100"
            rx="46"
            ry={isBlinking ? 46 : 0}
            fill="#1A1A2E"
            animate={{ ry: isBlinking ? 46 : 0 }}
            transition={{ duration: 0.1 }}
          />

          {/* Eye shine/reflection arc */}
          <path
            d="M 245 70 Q 280 55 315 70"
            fill="none"
            stroke="white"
            strokeWidth="3"
            strokeLinecap="round"
            opacity="0.15"
          />
        </g>

        {/* Subtle orange accent on the bridge */}
        <circle cx="200" cy="100" r="4" fill="#FF6B35" filter="url(#orangeGlow)" opacity="0.8" />
      </motion.svg>
    </div>
  );
}
