"use client";

interface RigsyLogoProps {
  size?: number;
  variant?: "icon" | "full" | "wordmark";
  className?: string;
  showGlow?: boolean;
}

// Icon-only version of the Rigsy logo (binocular eyes)
export function RigsyLogoIcon({
  size = 32,
  className = "",
  showGlow = false,
}: {
  size?: number;
  className?: string;
  showGlow?: boolean;
}) {
  const id = `rigsy-logo-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 50"
      className={className}
      style={{ filter: showGlow ? "drop-shadow(0 0 8px rgba(255, 107, 53, 0.5))" : undefined }}
    >
      <defs>
        <linearGradient id={`${id}-bodyGradient`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#2D2D44" />
          <stop offset="100%" stopColor="#1A1A2E" />
        </linearGradient>
        <linearGradient id={`${id}-eyeRingGradient`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#F0F3F6" />
          <stop offset="100%" stopColor="#B0B0C0" />
        </linearGradient>
        <radialGradient id={`${id}-innerEyeGradient`} cx="50%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#2D2D44" />
          <stop offset="100%" stopColor="#0D1117" />
        </radialGradient>
        <radialGradient id={`${id}-pupilGradient`} cx="30%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#1A1A2E" />
          <stop offset="100%" stopColor="#000000" />
        </radialGradient>
      </defs>

      {/* Body - binocular shape */}
      <g>
        <ellipse cx="27" cy="25" rx="25" ry="23" fill={`url(#${id}-bodyGradient)`} />
        <ellipse cx="73" cy="25" rx="25" ry="23" fill={`url(#${id}-bodyGradient)`} />
        <path
          d="M 40 8 Q 50 0 60 8 L 60 42 Q 50 50 40 42 Z"
          fill={`url(#${id}-bodyGradient)`}
        />
      </g>

      {/* Left eye */}
      <g>
        <circle cx="27" cy="25" r="18" fill="none" stroke={`url(#${id}-eyeRingGradient)`} strokeWidth="3" />
        <circle cx="27" cy="25" r="14" fill={`url(#${id}-innerEyeGradient)`} />
        <circle cx="27" cy="25" r="7" fill={`url(#${id}-pupilGradient)`} />
        <circle cx="24" cy="22" r="2.5" fill="white" opacity="0.9" />
        <circle cx="30" cy="27" r="1" fill="white" opacity="0.5" />
      </g>

      {/* Right eye */}
      <g>
        <circle cx="73" cy="25" r="18" fill="none" stroke={`url(#${id}-eyeRingGradient)`} strokeWidth="3" />
        <circle cx="73" cy="25" r="14" fill={`url(#${id}-innerEyeGradient)`} />
        <circle cx="73" cy="25" r="7" fill={`url(#${id}-pupilGradient)`} />
        <circle cx="70" cy="22" r="2.5" fill="white" opacity="0.9" />
        <circle cx="76" cy="27" r="1" fill="white" opacity="0.5" />
      </g>

      {/* Orange accent dot */}
      <circle cx="50" cy="25" r="2" fill="#FF6B35" />
    </svg>
  );
}

// Wordmark only (text: "Rigsy")
export function RigsyWordmark({
  size = 24,
  className = "",
}: {
  size?: number;
  className?: string;
}) {
  // Scale factor based on size (24 is base)
  const scale = size / 24;

  return (
    <svg
      width={72 * scale}
      height={size}
      viewBox="0 0 72 24"
      className={className}
    >
      <defs>
        <linearGradient id="wordmark-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#F0F3F6" />
          <stop offset="100%" stopColor="#8B949E" />
        </linearGradient>
      </defs>
      <text
        x="0"
        y="18"
        fontFamily="system-ui, -apple-system, sans-serif"
        fontWeight="700"
        fontSize="20"
        fill="url(#wordmark-gradient)"
        letterSpacing="-0.5"
      >
        Rigsy
      </text>
    </svg>
  );
}

// Full logo with icon + wordmark
export default function RigsyLogo({
  size = 32,
  variant = "full",
  className = "",
  showGlow = false,
}: RigsyLogoProps) {
  if (variant === "icon") {
    return <RigsyLogoIcon size={size} className={className} showGlow={showGlow} />;
  }

  if (variant === "wordmark") {
    return <RigsyWordmark size={size} className={className} />;
  }

  // Full logo: icon + text
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <RigsyLogoIcon size={size} showGlow={showGlow} />
      <span
        className="font-bold text-[#F0F3F6]"
        style={{ fontSize: size * 0.7 }}
      >
        Rigsy
      </span>
    </div>
  );
}

// Mini version for tight spaces (notifications, badges, etc.)
export function RigsyMiniLogo({
  size = 20,
  className = "",
}: {
  size?: number;
  className?: string;
}) {
  return (
    <div
      className={`rounded-lg bg-gradient-to-br from-[#2D2D44] to-[#1A1A2E] flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
    >
      <RigsyLogoIcon size={size * 0.8} />
    </div>
  );
}

// Circular badge version with gradient border
export function RigsyLogoBadge({
  size = 40,
  className = "",
}: {
  size?: number;
  className?: string;
}) {
  return (
    <div
      className={`rounded-full bg-gradient-to-br from-[#4B5EAA] to-[#FF6B35] p-[2px] ${className}`}
      style={{ width: size, height: size }}
    >
      <div
        className="w-full h-full rounded-full bg-[#0D1117] flex items-center justify-center"
      >
        <RigsyLogoIcon size={size * 0.6} />
      </div>
    </div>
  );
}
