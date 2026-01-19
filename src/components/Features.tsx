"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { RigsyLogoIcon, RigsyLogoBadge } from "./RigsyLogo";

// Mini Rigsy Eyes component for features
function MiniRigsyEyes({ isActive = false }: { isActive?: boolean }) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isBlinking, setIsBlinking] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const relX = (e.clientX / window.innerWidth - 0.5) * 2;
      const relY = (e.clientY / window.innerHeight - 0.5) * 2;
      setMousePosition({
        x: Math.max(-1, Math.min(1, relX)),
        y: Math.max(-1, Math.min(1, relY)),
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useEffect(() => {
    const blinkInterval = setInterval(() => {
      if (Math.random() > 0.7) {
        setIsBlinking(true);
        setTimeout(() => setIsBlinking(false), 150);
      }
    }, 2500);
    return () => clearInterval(blinkInterval);
  }, []);

  const pupilOffsetX = mousePosition.x * 6;
  const pupilOffsetY = mousePosition.y * 4;

  return (
    <svg viewBox="0 0 200 100" className="w-full h-full">
      <defs>
        <linearGradient id="miniBodyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#2D2D44" />
          <stop offset="100%" stopColor="#1A1A2E" />
        </linearGradient>
        <linearGradient id="miniEyeRingGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#F0F3F6" />
          <stop offset="100%" stopColor="#B0B0C0" />
        </linearGradient>
        <radialGradient id="miniInnerEyeGradient" cx="50%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#2D2D44" />
          <stop offset="100%" stopColor="#0D1117" />
        </radialGradient>
        <radialGradient id="miniPupilGradient" cx="30%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#1A1A2E" />
          <stop offset="100%" stopColor="#000000" />
        </radialGradient>
        <filter id="miniGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="1" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      {/* Body */}
      <g>
        <ellipse cx="55" cy="50" rx="50" ry="45" fill="url(#miniBodyGradient)" />
        <ellipse cx="145" cy="50" rx="50" ry="45" fill="url(#miniBodyGradient)" />
        <path d="M 80 20 Q 100 5 120 20 L 120 80 Q 100 95 80 80 Z" fill="url(#miniBodyGradient)" />
      </g>

      {/* Left eye */}
      <g>
        <circle cx={55} cy={50} r={36} fill="none" stroke="url(#miniEyeRingGradient)" strokeWidth="5" />
        <circle cx={55} cy={50} r={29} fill="url(#miniInnerEyeGradient)" />
        <motion.g
          animate={{ x: pupilOffsetX, y: pupilOffsetY }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <circle cx={55} cy={50} r={14} fill="url(#miniPupilGradient)" />
          <circle cx={50} cy={45} r={4.5} fill="white" opacity="0.9" />
          <circle cx={59} cy={54} r={2} fill="white" opacity="0.5" />
        </motion.g>
        <motion.ellipse
          cx={55}
          cy={50}
          rx={30}
          fill="#1A1A2E"
          animate={{ ry: isBlinking ? 30 : 0 }}
          transition={{ duration: 0.1 }}
        />
      </g>

      {/* Right eye */}
      <g>
        <circle cx={145} cy={50} r={36} fill="none" stroke="url(#miniEyeRingGradient)" strokeWidth="5" />
        <circle cx={145} cy={50} r={29} fill="url(#miniInnerEyeGradient)" />
        <motion.g
          animate={{ x: pupilOffsetX, y: pupilOffsetY }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <circle cx={145} cy={50} r={14} fill="url(#miniPupilGradient)" />
          <circle cx={140} cy={45} r={4.5} fill="white" opacity="0.9" />
          <circle cx={149} cy={54} r={2} fill="white" opacity="0.5" />
        </motion.g>
        <motion.ellipse
          cx={145}
          cy={50}
          rx={30}
          fill="#1A1A2E"
          animate={{ ry: isBlinking ? 30 : 0 }}
          transition={{ duration: 0.1 }}
        />
      </g>

      {/* Orange accent */}
      <motion.circle
        cx="100"
        cy="50"
        r="3"
        fill="#FF6B35"
        filter="url(#miniGlow)"
        animate={{
          opacity: isActive ? [0.8, 1, 0.8] : 0.6,
          r: isActive ? [3, 5, 3] : 3
        }}
        transition={{ duration: 0.5, repeat: isActive ? Infinity : 0 }}
      />
    </svg>
  );
}

// Fitness Notification + Workout Card component
function FitnessWorkoutCard() {
  const [showWorkout, setShowWorkout] = useState(false);

  const exercises = [
    { name: "Neck Side Stretch", duration: 40, muscle: "Neck", notes: "20 sec each side" },
    { name: "Chin To Chest Stretch", duration: 25, muscle: "Neck", notes: "Gentle pull" },
    { name: "Standing Side Bend", duration: 45, muscle: "Obliques", notes: "22 sec each side" },
    { name: "Back Rotation Stretch", duration: 50, muscle: "Back", notes: "Opens spine" },
    { name: "Standing Quad Stretch", duration: 50, muscle: "Quads", notes: "Hold for balance" },
  ];

  const totalDuration = exercises.reduce((acc, ex) => acc + ex.duration, 0);
  const minutes = Math.floor(totalDuration / 60);
  const seconds = totalDuration % 60;

  return (
    <div className="w-full max-w-sm mx-auto">
      {!showWorkout ? (
        // Notification State
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-3"
        >
          {/* Time indicator */}
          <div className="flex items-center justify-center gap-2 text-[#8B949E] text-xs">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>5 hours of driving</span>
          </div>

          {/* Notification Card */}
          <motion.button
            onClick={() => setShowWorkout(true)}
            className="w-full bg-[#0D1117] rounded-2xl p-4 border border-[#21262D] hover:border-[#FF6B35]/50 transition-all text-left"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-start gap-3">
              {/* Rigsy Logo */}
              <RigsyLogoBadge size={40} />

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[#F0F3F6] font-semibold text-sm">Time for a quick stretch!</span>
                  <motion.div
                    className="w-2 h-2 rounded-full bg-[#FF6B35]"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                </div>
                <p className="text-[#8B949E] text-xs leading-relaxed">
                  You&apos;ve been driving for 5 hours. Here&apos;s a quick 5-min stretch you can do while pumping gas.
                </p>
              </div>
            </div>

            {/* Tap hint */}
            <div className="flex items-center justify-center gap-1 mt-3 pt-3 border-t border-[#21262D]">
              <span className="text-[#6E7681] text-[10px]">Tap to view workout</span>
              <svg className="w-3 h-3 text-[#6E7681]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </motion.button>
        </motion.div>
      ) : (
        // Workout Card State
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-[#F5F5F0] rounded-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-[#31407F] to-[#4B5EAA] p-4">
            <div className="flex items-center justify-between mb-2">
              <div>
                <span className="text-white/70 text-[10px] uppercase tracking-wider">Quick Stretch</span>
                <h4 className="text-white font-bold text-lg">Reset Routine</h4>
              </div>
              <button
                onClick={() => setShowWorkout(false)}
                className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
              >
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="flex items-center gap-4 text-white/80 text-xs">
              <span className="flex items-center gap-1">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {minutes}:{seconds.toString().padStart(2, "0")} min
              </span>
              <span className="flex items-center gap-1">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                {exercises.length} exercises
              </span>
            </div>
          </div>

          {/* Exercise List */}
          <div className="p-3 space-y-1 max-h-48 overflow-y-auto">
            {exercises.map((exercise, index) => (
              <motion.div
                key={exercise.name}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center gap-3 p-2 rounded-xl hover:bg-[#31407F]/5 transition-colors"
              >
                {/* Number */}
                <div className="w-6 h-6 rounded-full bg-[#FF670E]/10 flex items-center justify-center shrink-0">
                  <span className="text-[#FF670E] text-xs font-semibold">{index + 1}</span>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-[#31407F] text-xs font-semibold truncate">{exercise.name}</p>
                  <p className="text-[#64748b] text-[10px]">{exercise.notes}</p>
                </div>

                {/* Duration */}
                <span className="text-[#FF670E] text-xs font-medium shrink-0">{exercise.duration}s</span>
              </motion.div>
            ))}
          </div>

          {/* Footer - Powered By */}
          <div className="p-3 pt-2 border-t border-[#31407F]/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-[#64748b] text-[9px]">Powered by</span>
                <div className="flex items-center gap-1.5">
                  {/* Truckers Routine logo */}
                  <img
                    src="/AppLogo.png"
                    alt="Truckers Routine"
                    className="w-4 h-4 rounded"
                  />
                  <span className="text-[#31407F] text-[10px] font-semibold">Truckers Routine</span>
                </div>
              </div>
              <motion.button
                className="px-3 py-1.5 bg-[#FF670E] text-white text-xs font-semibold rounded-full"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Start
              </motion.button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}

// Nutrition Card component for food tracking
function NutritionCard() {
  const calories = 306;
  const carbs = 26;
  const fats = 16;
  const proteins = 13;

  // Calculate percentages for the macro bar
  const total = carbs + fats + proteins;
  const carbPercent = (carbs / total) * 100;
  const fatPercent = (fats / total) * 100;
  const proteinPercent = (proteins / total) * 100;

  return (
    <div className="bg-[#0D1117] rounded-2xl p-4 sm:p-6 border border-[#21262D]">
      {/* Header with meal name */}
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <div>
          <h4 className="text-[#F0F3F6] font-semibold text-sm sm:text-base">Breakfast logged</h4>
          <p className="text-[#6E7681] text-[10px] sm:text-xs">Avocado toast with fried egg</p>
        </div>
        <span className="px-2 py-1 rounded-full bg-[#3FB950]/20 text-[#3FB950] text-[10px] sm:text-xs font-medium flex items-center gap-1">
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Logged
        </span>
      </div>

      {/* Calories & Macros */}
      <div className="space-y-3 sm:space-y-4">
        <div>
          <div className="flex items-baseline gap-1 mb-2">
            <span className="text-2xl sm:text-3xl font-bold text-[#F0F3F6]">{calories}</span>
            <span className="text-[#8B949E] text-xs sm:text-sm">kcal</span>
          </div>

          {/* Macro bar */}
          <div className="h-2 sm:h-2.5 rounded-full overflow-hidden flex">
            <motion.div
              className="bg-[#D29922] h-full"
              initial={{ width: 0 }}
              animate={{ width: `${carbPercent}%` }}
              transition={{ duration: 0.8, delay: 0.2 }}
            />
            <motion.div
              className="bg-[#58A6FF] h-full"
              initial={{ width: 0 }}
              animate={{ width: `${fatPercent}%` }}
              transition={{ duration: 0.8, delay: 0.4 }}
            />
            <motion.div
              className="bg-[#3FB950] h-full"
              initial={{ width: 0 }}
              animate={{ width: `${proteinPercent}%` }}
              transition={{ duration: 0.8, delay: 0.6 }}
            />
          </div>
        </div>

        {/* Macro breakdown */}
        <div className="grid grid-cols-3 gap-2 sm:gap-4">
          <div>
            <div className="flex items-center gap-1.5 mb-1">
              <div className="w-2 h-2 rounded-full bg-[#D29922]" />
              <span className="text-[#8B949E] text-[10px] sm:text-xs">Carbs</span>
            </div>
            <div className="flex items-baseline gap-0.5">
              <span className="text-[#F0F3F6] font-semibold text-sm sm:text-lg">{carbs}</span>
              <span className="text-[#6E7681] text-[10px] sm:text-xs">g</span>
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5 mb-1">
              <div className="w-2 h-2 rounded-full bg-[#58A6FF]" />
              <span className="text-[#8B949E] text-[10px] sm:text-xs">Fats</span>
            </div>
            <div className="flex items-baseline gap-0.5">
              <span className="text-[#F0F3F6] font-semibold text-sm sm:text-lg">{fats}</span>
              <span className="text-[#6E7681] text-[10px] sm:text-xs">g</span>
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5 mb-1">
              <div className="w-2 h-2 rounded-full bg-[#3FB950]" />
              <span className="text-[#8B949E] text-[10px] sm:text-xs">Proteins</span>
            </div>
            <div className="flex items-baseline gap-0.5">
              <span className="text-[#F0F3F6] font-semibold text-sm sm:text-lg">{proteins}</span>
              <span className="text-[#6E7681] text-[10px] sm:text-xs">g</span>
            </div>
          </div>
        </div>
      </div>

      {/* Rigsy tip */}
      <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-[#21262D]">
        <div className="flex items-start gap-2">
          <div className="shrink-0 mt-0.5">
            <RigsyLogoIcon size={20} />
          </div>
          <p className="text-[#8B949E] text-[10px] sm:text-xs italic leading-relaxed">
            &ldquo;Good protein start! Try adding some fruit for fiber at your next stop.&rdquo;
          </p>
        </div>
      </div>
    </div>
  );
}

// Road Concierge Search Results Card
function ConciergeResultsCard() {
  const truckStops = [
    {
      name: "Love's Travel Stop",
      exit: "Exit 42",
      distance: "12 mi",
      amenities: ["shower", "gym", "restaurant"],
      showerRating: 4.2,
      parking: 23,
      isRecommended: true,
    },
    {
      name: "Pilot Flying J",
      exit: "Exit 58",
      distance: "28 mi",
      amenities: ["shower", "restaurant"],
      showerRating: 3.8,
      parking: 8,
      isRecommended: false,
    },
  ];

  const AmenityIcon = ({ type }: { type: string }) => {
    switch (type) {
      case "shower":
        return (
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
          </svg>
        );
      case "gym":
        return (
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h2m0 0v8m0-8h2m12 0h2m-2 0v8m0-8h-2M8 8h8v8H8V8z" />
          </svg>
        );
      case "restaurant":
        return (
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-[#0D1117] rounded-2xl p-4 sm:p-6 border border-[#21262D]">
      {/* Header */}
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <div>
          <h4 className="text-[#F0F3F6] font-semibold text-sm sm:text-base">Truck Stops Found</h4>
          <p className="text-[#6E7681] text-[10px] sm:text-xs">2 stops with shower & gym within 50 mi</p>
        </div>
        <span className="px-2 py-1 rounded-full bg-[#58A6FF]/20 text-[#58A6FF] text-[10px] sm:text-xs font-medium flex items-center gap-1">
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          Nearby
        </span>
      </div>

      {/* Results List */}
      <div className="space-y-2 sm:space-y-3">
        {truckStops.map((stop, index) => (
          <motion.div
            key={stop.name}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.15 }}
            className={`p-3 rounded-xl ${
              stop.isRecommended
                ? "bg-[#58A6FF]/10 border border-[#58A6FF]/30"
                : "bg-[#161B22]"
            }`}
          >
            {/* Stop Header */}
            <div className="flex items-start justify-between mb-2">
              <div>
                <div className="flex items-center gap-2">
                  <h5 className="text-[#F0F3F6] text-xs sm:text-sm font-semibold">{stop.name}</h5>
                  {stop.isRecommended && (
                    <span className="px-1.5 py-0.5 rounded bg-[#58A6FF]/20 text-[#58A6FF] text-[8px] font-medium">
                      BEST
                    </span>
                  )}
                </div>
                <p className="text-[#6E7681] text-[10px]">{stop.exit} • {stop.distance}</p>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1 text-[#D29922]">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="text-[10px] sm:text-xs font-medium">{stop.showerRating}</span>
                </div>
                <p className="text-[#6E7681] text-[8px] sm:text-[9px]">shower rating</p>
              </div>
            </div>

            {/* Amenities & Parking */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 sm:gap-2">
                {stop.amenities.map((amenity) => (
                  <div
                    key={amenity}
                    className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-[#21262D] text-[#8B949E]"
                  >
                    <AmenityIcon type={amenity} />
                    <span className="text-[8px] sm:text-[9px] capitalize">{amenity}</span>
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-1">
                <div className={`w-2 h-2 rounded-full ${stop.parking > 15 ? "bg-[#3FB950]" : "bg-[#D29922]"}`} />
                <span className="text-[#8B949E] text-[8px] sm:text-[9px]">{stop.parking} spots</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Rigsy Recommendation */}
      <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-[#21262D]">
        <div className="flex items-center justify-between">
          <div className="flex items-start gap-2">
            <div className="shrink-0 mt-0.5">
              <RigsyLogoIcon size={20} />
            </div>
            <p className="text-[#8B949E] text-[10px] sm:text-xs italic leading-relaxed">
              &ldquo;Love&apos;s at Exit 42 is your best bet—clean showers and a 24-hour gym!&rdquo;
            </p>
          </div>
          <motion.button
            className="shrink-0 ml-2 px-2.5 sm:px-3 py-1.5 bg-[#58A6FF] text-white text-[9px] sm:text-xs font-semibold rounded-full flex items-center gap-1"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            Open in Maps
          </motion.button>
        </div>
      </div>
    </div>
  );
}

// Equipment Manager Diagnostic Card
function DiagnosticCard() {
  return (
    <div className="bg-[#0D1117] rounded-2xl p-4 sm:p-6 border border-[#21262D]">
      {/* Header with urgency */}
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <div>
          <h4 className="text-[#F0F3F6] font-semibold text-sm sm:text-base">Diagnostic Result</h4>
          <p className="text-[#6E7681] text-[10px] sm:text-xs">ABS System • Air Brake</p>
        </div>
        <span className="px-2 py-1 rounded-full bg-[#D29922]/20 text-[#D29922] text-[10px] sm:text-xs font-medium flex items-center gap-1">
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          Service Soon
        </span>
      </div>

      {/* Issue breakdown */}
      <div className="space-y-3 sm:space-y-4">
        {/* Detected Issue */}
        <div className="bg-[#161B22] rounded-xl p-3">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#D29922]/20 flex items-center justify-center shrink-0">
              <svg className="w-4 h-4 text-[#D29922]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-[#F0F3F6] text-xs sm:text-sm font-medium mb-1">Possible Air Leak</p>
              <p className="text-[#8B949E] text-[10px] sm:text-xs leading-relaxed">
                The hissing sound combined with ABS light suggests a minor air leak near the brake system.
              </p>
            </div>
          </div>
        </div>

        {/* Urgency meter */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[#8B949E] text-[10px] sm:text-xs">Urgency Level</span>
            <span className="text-[#D29922] text-[10px] sm:text-xs font-medium">Medium - Service within 100 mi</span>
          </div>
          <div className="h-2 bg-[#21262D] rounded-full overflow-hidden flex">
            <motion.div
              className="h-full bg-[#3FB950] rounded-l-full"
              initial={{ width: 0 }}
              animate={{ width: "33%" }}
              transition={{ duration: 0.6, delay: 0.2 }}
            />
            <motion.div
              className="h-full bg-[#D29922]"
              initial={{ width: 0 }}
              animate={{ width: "33%" }}
              transition={{ duration: 0.6, delay: 0.4 }}
            />
            <div className="h-full bg-[#21262D] flex-1" />
          </div>
          <div className="flex justify-between mt-1">
            <span className="text-[8px] sm:text-[9px] text-[#6E7681]">Safe</span>
            <span className="text-[8px] sm:text-[9px] text-[#6E7681]">Service Soon</span>
            <span className="text-[8px] sm:text-[9px] text-[#6E7681]">Stop Now</span>
          </div>
        </div>

        {/* Nearby shop */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-[#D29922]/10 border border-[#D29922]/30 rounded-xl p-3"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-[#D29922]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <div>
                <p className="text-[#F0F3F6] text-xs sm:text-sm font-medium">TA Truck Service</p>
                <p className="text-[#8B949E] text-[9px] sm:text-[10px]">Exit 78 • 42 mi • Open 24/7</p>
              </div>
            </div>
            <div className="flex items-center gap-1 text-[#D29922]">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="text-[10px] sm:text-xs font-medium">4.6</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Rigsy recommendation */}
      <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-[#21262D]">
        <div className="flex items-center justify-between">
          <div className="flex items-start gap-2">
            <div className="shrink-0 mt-0.5">
              <RigsyLogoIcon size={20} />
            </div>
            <p className="text-[#8B949E] text-[10px] sm:text-xs italic leading-relaxed">
              &ldquo;You can keep rolling, but get this checked at your next stop.&rdquo;
            </p>
          </div>
          <motion.button
            className="shrink-0 ml-2 px-3 py-1.5 bg-[#D29922] text-[#0D1117] text-[10px] sm:text-xs font-semibold rounded-full flex items-center gap-1"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            Call
          </motion.button>
        </div>
      </div>
    </div>
  );
}

// Mental Co-Pilot Companion Card
function CompanionCard() {
  return (
    <div className="bg-[#0D1117] rounded-2xl p-4 sm:p-6 border border-[#21262D]">
      {/* Silence indicator */}
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#4B5EAA]/20 flex items-center justify-center">
            <svg className="w-4 h-4 text-[#4B5EAA]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <p className="text-[#F0F3F6] text-xs sm:text-sm font-medium">2 hours of quiet</p>
            <p className="text-[#6E7681] text-[9px] sm:text-[10px]">Rigsy noticed you&apos;ve been silent</p>
          </div>
        </div>
        <motion.div
          className="w-2 h-2 rounded-full bg-[#4B5EAA]"
          animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </div>

      {/* Rigsy check-in message */}
      <div className="bg-[#161B22] rounded-xl p-3 sm:p-4 mb-3 sm:mb-4">
        <div className="flex items-start gap-3">
          <div className="shrink-0">
            <RigsyLogoIcon size={24} />
          </div>
          <div>
            <p className="text-[#F0F3F6] text-xs sm:text-sm leading-relaxed mb-2">
              &ldquo;Hey, you&apos;ve been quiet for a while. Everything okay?&rdquo;
            </p>
            <p className="text-[#8B949E] text-[10px] sm:text-xs">
              Want to talk about something, or should I put on a podcast?
            </p>
          </div>
        </div>
      </div>

      {/* Quick action options */}
      <div className="space-y-2">
        {/* Talk option */}
        <motion.div
          className="flex items-center gap-3 p-3 rounded-xl bg-[#4B5EAA]/10 border border-[#4B5EAA]/30"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="w-10 h-10 rounded-full bg-[#4B5EAA]/20 flex items-center justify-center shrink-0">
            <svg className="w-5 h-5 text-[#4B5EAA]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <div className="flex-1">
            <p className="text-[#F0F3F6] text-xs sm:text-sm font-medium">Want to talk?</p>
            <p className="text-[#8B949E] text-[9px] sm:text-[10px]">Just say &ldquo;Hey Rigsy&rdquo; anytime</p>
          </div>
          <motion.div
            className="w-2 h-2 rounded-full bg-[#3FB950]"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        </motion.div>

        {/* Podcast recommendation */}
        <motion.div
          className="rounded-xl bg-[#1DB954]/10 border border-[#1DB954]/30 overflow-hidden"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center gap-2 px-3 py-1.5 bg-[#1DB954]/10 border-b border-[#1DB954]/20">
            {/* Spotify icon */}
            <svg className="w-3.5 h-3.5 text-[#1DB954]" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
            </svg>
            <span className="text-[#1DB954] text-[9px] sm:text-[10px] font-medium">New episode for you</span>
          </div>
          <motion.button
            className="w-full flex items-center gap-3 p-3 hover:bg-[#1DB954]/5 transition-colors text-left"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            {/* Podcast artwork */}
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#1a1a2e] to-[#4B5EAA] flex items-center justify-center shrink-0 overflow-hidden">
              <svg className="w-6 h-6 text-white/80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[#F0F3F6] text-xs sm:text-sm font-medium truncate">The Joe Rogan Experience</p>
              <p className="text-[#8B949E] text-[9px] sm:text-[10px] truncate">#2104 - New episode dropped today</p>
            </div>
            <motion.div
              className="w-8 h-8 rounded-full bg-[#1DB954] flex items-center justify-center shrink-0"
              whileHover={{ scale: 1.1 }}
            >
              <svg className="w-4 h-4 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"/>
              </svg>
            </motion.div>
          </motion.button>
        </motion.div>

        {/* Music recommendation */}
        <motion.div
          className="rounded-xl bg-[#21262D] overflow-hidden"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <motion.button
            className="w-full flex items-center gap-3 p-3 hover:bg-[#21262D]/80 transition-colors text-left"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            {/* Album artwork placeholder */}
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#FF6B35] to-[#D29922] flex items-center justify-center shrink-0">
              <svg className="w-6 h-6 text-white/90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[#F0F3F6] text-xs sm:text-sm font-medium">Your Road Trip Mix</p>
              <p className="text-[#8B949E] text-[9px] sm:text-[10px]">Country, rock & driving classics</p>
            </div>
            <svg className="w-4 h-4 text-[#6E7681] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </motion.button>
        </motion.div>
      </div>

      {/* Rigsy tip */}
      <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-[#21262D]">
        <div className="flex items-start gap-2">
          <div className="shrink-0 mt-0.5">
            <RigsyLogoIcon size={16} />
          </div>
          <p className="text-[#6E7681] text-[9px] sm:text-[10px] italic leading-relaxed">
            Rigsy is always here when you need someone to talk to on the long haul.
          </p>
        </div>
      </div>
    </div>
  );
}

// Driver Stats Pie Chart component
function DriverStatsCard() {
  const drivingTime = 4.25; // 4h 15m
  const totalDriveAllowed = 11;
  const windowRemaining = 4; // hours until 14-hour window closes

  const drivingPercentage = (drivingTime / totalDriveAllowed) * 100;
  const remainingPercentage = ((totalDriveAllowed - drivingTime) / totalDriveAllowed) * 100;

  // Calculate SVG arc for pie chart
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const drivingArc = (drivingPercentage / 100) * circumference;
  const remainingArc = (remainingPercentage / 100) * circumference;

  return (
    <div className="bg-[#0D1117] rounded-2xl p-4 sm:p-6 border border-[#21262D]">
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <h4 className="text-[#F0F3F6] font-semibold text-sm sm:text-base">Driver Status</h4>
        <span className="px-2 py-1 rounded-full bg-[#3FB950]/20 text-[#3FB950] text-[10px] sm:text-xs font-medium">
          On Duty - Driving
        </span>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
        {/* Pie Chart */}
        <div className="relative shrink-0">
          <svg width="100" height="100" viewBox="0 0 140 140" className="sm:w-[140px] sm:h-[140px]">
            <circle
              cx="70"
              cy="70"
              r={radius}
              fill="none"
              stroke="#21262D"
              strokeWidth="12"
            />
            {/* Remaining time (green) */}
            <motion.circle
              cx="70"
              cy="70"
              r={radius}
              fill="none"
              stroke="#3FB950"
              strokeWidth="12"
              strokeLinecap="round"
              strokeDasharray={`${remainingArc} ${circumference}`}
              strokeDashoffset={0}
              transform="rotate(-90 70 70)"
              initial={{ strokeDasharray: `0 ${circumference}` }}
              animate={{ strokeDasharray: `${remainingArc} ${circumference}` }}
              transition={{ duration: 1, delay: 0.3 }}
            />
            {/* Used time (orange) */}
            <motion.circle
              cx="70"
              cy="70"
              r={radius}
              fill="none"
              stroke="#FF6B35"
              strokeWidth="12"
              strokeLinecap="round"
              strokeDasharray={`${drivingArc} ${circumference}`}
              strokeDashoffset={-remainingArc}
              transform="rotate(-90 70 70)"
              initial={{ strokeDasharray: `0 ${circumference}` }}
              animate={{ strokeDasharray: `${drivingArc} ${circumference}` }}
              transition={{ duration: 1, delay: 0.5 }}
            />
            {/* Center text */}
            <text x="70" y="65" textAnchor="middle" className="fill-[#F0F3F6] text-2xl font-bold">
              4:15
            </text>
            <text x="70" y="82" textAnchor="middle" className="fill-[#8B949E] text-xs">
              remaining
            </text>
          </svg>
        </div>

        {/* Stats */}
        <div className="w-full sm:flex-1 space-y-2 sm:space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#3FB950]" />
              <span className="text-[#8B949E] text-xs sm:text-sm">Drive Time Left</span>
            </div>
            <span className="text-[#F0F3F6] font-semibold text-xs sm:text-base">4h 15m</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#FF6B35]" />
              <span className="text-[#8B949E] text-xs sm:text-sm">Time Driven</span>
            </div>
            <span className="text-[#F0F3F6] font-semibold text-xs sm:text-base">6h 45m</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#4B5EAA]" />
              <span className="text-[#8B949E] text-xs sm:text-sm">14hr Window</span>
            </div>
            <span className="text-[#F0F3F6] font-semibold text-xs sm:text-base">Closes 8 PM</span>
          </div>
        </div>
      </div>

      {/* Progress bar for 14-hour window */}
      <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-[#21262D]">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[#8B949E] text-[10px] sm:text-xs">14-Hour Window Progress</span>
          <span className="text-[#F0F3F6] text-[10px] sm:text-xs font-medium">10h used / 14h total</span>
        </div>
        <div className="h-1.5 sm:h-2 bg-[#21262D] rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-[#3FB950] to-[#4B5EAA] rounded-full"
            initial={{ width: 0 }}
            animate={{ width: "71%" }}
            transition={{ duration: 1, delay: 0.7 }}
          />
        </div>
      </div>
    </div>
  );
}

export default function Features() {
  const features = [
    {
      id: "eld",
      category: "Compliance",
      title: "The ELD Liaison",
      tagline: "Your compliance paperwork, handled by voice",
      description:
        "Change ELD status, query your hours, and complete pre-trip inspections entirely hands-free. No more fumbling with tablets while tired or wearing gloves.",
      capabilities: [
        "Voice-controlled status switching",
        "Real-time HOS calculations",
        "Audio-guided pre-trip inspections",
        "Works with Motive & Samsara",
      ],
      example: {
        driver: "Hey Rigsy, what's my clock look like?",
        rigsy:
          "You've got 4 hours 15 minutes of driving time left. Your 14-hour window closes at 8 PM.",
      },
      gradient: "from-[#3FB950] to-[#4B5EAA]",
      hasCustomVisual: true,
      visualType: "eld",
    },
    {
      id: "nutrition",
      category: "Health",
      title: "The Industrial Nutritionist",
      tagline: "Eat like an athlete, even on the road",
      description:
        "Voice-log your meals, snap photos of truck stop menus, and get personalized recommendations that work with your life on the road.",
      capabilities: [
        "Voice food logging",
        "Menu photo analysis",
        "Truck stop healthy picks",
        "Cab-friendly meal prep ideas",
      ],
      example: {
        driver: "I just had avocado toast with a fried egg",
        rigsy:
          "Got it! That's 306 calories with a solid protein start. Try adding some fruit for fiber at your next stop.",
      },
      gradient: "from-[#FF6B35] to-[#D29922]",
      hasCustomVisual: true,
      visualType: "nutrition",
    },
    {
      id: "fitness",
      category: "Wellness",
      title: "The Accountability Partner",
      tagline: "Someone who actually holds you accountable",
      description:
        "Detects when you've been sitting too long and prompts movement. Cab-friendly exercises designed for truckers, not gym bros.",
      capabilities: [
        "Movement detection & prompts",
        "5-minute cab workouts",
        "Lower back & neck routines",
        "Sleep coaching for sleeper berths",
      ],
      example: {
        driver: "(After 5 hours of driving)",
        rigsy:
          "You've been in that seat for 5 hours. Here's a quick stretch you can do while pumping gas.",
      },
      gradient: "from-[#F85149] to-[#FF6B35]",
      hasCustomVisual: true,
      visualType: "fitness",
    },
    {
      id: "concierge",
      category: "Navigation",
      title: "The Road Concierge",
      tagline: "Your intelligent navigator for truck life",
      description:
        "Truck-safe routes, real-time parking availability, and amenity search. Never get stuck at a low bridge or full truck stop again.",
      capabilities: [
        "Low bridge warnings",
        "Parking availability predictions",
        "Truck-friendly amenity search",
        "Weather & road condition alerts",
      ],
      example: {
        driver: "Find me a stop with a clean shower and gym within 50 miles",
        rigsy:
          "The Love's at Exit 42 has showers rated 4.2 stars and a 24-hour fitness center. Want directions?",
      },
      gradient: "from-[#58A6FF] to-[#4B5EAA]",
      hasCustomVisual: true,
      visualType: "concierge",
    },
    {
      id: "maintenance",
      category: "Equipment",
      title: "The Equipment Manager",
      tagline: "Your truck whisperer",
      description:
        "Describe symptoms, get plain-language diagnostics. Find repair shops, log maintenance, and know if you can keep rolling or need to stop.",
      capabilities: [
        "Symptom-based diagnostics",
        "24/7 repair shop finder",
        "Voice maintenance logging",
        "Urgency classification",
      ],
      example: {
        driver: "My ABS light just flickered and I hear a slight hiss",
        rigsy:
          "That hiss might be an air leak near the brake system. This is 'Service Soon' — find a shop within 100 miles. Want me to locate one?",
      },
      gradient: "from-[#D29922] to-[#8B949E]",
      hasCustomVisual: true,
      visualType: "maintenance",
    },
    {
      id: "companion",
      category: "Companionship",
      title: "The Mental Co-Pilot",
      tagline: "A co-pilot who actually knows you",
      description:
        "Remembers your life, your goals, your struggles. Proactive check-ins when you've been quiet too long. A genuine companion for the long haul.",
      capabilities: [
        "Personal memory (family, goals)",
        "Proactive wellness check-ins",
        "Multiple companion personas",
        "Energy & mood awareness",
      ],
      example: {
        driver: "(After 2 hours of silence)",
        rigsy:
          "Hey, you've been quiet for a while. Everything okay? Want to talk, or should I put on a podcast?",
      },
      gradient: "from-[#4B5EAA] to-[#8B949E]",
      hasCustomVisual: true,
      visualType: "companion",
    },
  ];

  return (
    <section id="features" className="py-16 sm:py-24 bg-[#161B22]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section header */}
        <div className="text-center mb-10 sm:mb-16">
          <span className="inline-block px-3 sm:px-4 py-1 sm:py-1.5 rounded-full bg-[#4B5EAA]/20 text-[#58A6FF] text-xs sm:text-sm font-medium mb-3 sm:mb-4">
            Features
          </span>
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold text-[#F0F3F6] mb-3 sm:mb-4">
            Everything a Trucker Needs
          </h2>
          <p className="text-base sm:text-xl text-[#8B949E] max-w-2xl mx-auto">
            Six powerful AI modules working together as your personal road
            companion
          </p>
        </div>

        {/* Feature cards */}
        <div className="space-y-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className={`flex flex-col ${
                index % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"
              } gap-6 sm:gap-8 p-4 sm:p-8 rounded-2xl sm:rounded-3xl bg-[#0D1117] border border-[#21262D] hover:border-[#4B5EAA]/30 transition-all`}
            >
              {/* Content side */}
              <div className="flex-1 flex flex-col justify-center">
                <span className="inline-block w-fit px-2.5 sm:px-3 py-1 rounded-full bg-[#21262D] text-[#8B949E] text-[10px] sm:text-xs font-medium uppercase tracking-wider mb-3 sm:mb-4">
                  {feature.category}
                </span>
                <h3 className="text-xl sm:text-3xl font-bold text-[#F0F3F6] mb-1.5 sm:mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm sm:text-lg text-[#FF6B35] mb-3 sm:mb-4">{feature.tagline}</p>
                <p className="text-sm sm:text-base text-[#8B949E] mb-4 sm:mb-6 leading-relaxed">
                  {feature.description}
                </p>

                {/* Capabilities list */}
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 mb-4 sm:mb-6">
                  {feature.capabilities.map((cap, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <svg
                        className="w-4 h-4 sm:w-5 sm:h-5 text-[#3FB950] shrink-0"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span className="text-[#F0F3F6] text-xs sm:text-sm">{cap}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Visual side */}
              <div className="flex-1 flex items-center justify-center">
                {feature.hasCustomVisual && feature.visualType === "eld" ? (
                  // Custom ELD visual with eyes and stats card
                  <div className="w-full max-w-lg">
                    <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
                      {/* Rigsy Eyes */}
                      <div className="w-28 h-14 sm:w-40 sm:h-20 shrink-0">
                        <MiniRigsyEyes isActive={true} />
                      </div>

                      {/* Speech bubble with question */}
                      <div className="relative bg-[#161B22] rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-[#21262D] flex-1 w-full sm:w-auto">
                        <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-0 h-0 border-t-8 border-b-8 border-r-8 border-transparent border-r-[#21262D] hidden sm:block" />
                        <p className="text-[#F0F3F6] text-xs sm:text-sm italic text-center sm:text-left">
                          &ldquo;{feature.example.driver}&rdquo;
                        </p>
                      </div>
                    </div>

                    {/* Stats Card */}
                    <div className="mt-3 sm:mt-4">
                      <DriverStatsCard />
                    </div>
                  </div>
                ) : feature.hasCustomVisual && feature.visualType === "nutrition" ? (
                  // Custom Nutrition visual with food logging
                  <div className="w-full max-w-lg">
                    <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
                      {/* Rigsy Eyes */}
                      <div className="w-28 h-14 sm:w-40 sm:h-20 shrink-0">
                        <MiniRigsyEyes isActive={true} />
                      </div>

                      {/* Speech bubble with voice input */}
                      <div className="relative bg-[#161B22] rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-[#21262D] flex-1 w-full sm:w-auto">
                        <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-0 h-0 border-t-8 border-b-8 border-r-8 border-transparent border-r-[#21262D] hidden sm:block" />
                        <div className="flex items-center gap-2 mb-1.5">
                          <motion.div
                            className="w-2 h-2 rounded-full bg-[#FF6B35]"
                            animate={{ scale: [1, 1.3, 1], opacity: [0.7, 1, 0.7] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                          />
                          <span className="text-[#6E7681] text-[10px] sm:text-xs">Voice logging...</span>
                        </div>
                        <p className="text-[#F0F3F6] text-xs sm:text-sm italic">
                          &ldquo;{feature.example.driver}&rdquo;
                        </p>
                      </div>
                    </div>

                    {/* Nutrition Card */}
                    <div className="mt-3 sm:mt-4">
                      <NutritionCard />
                    </div>
                  </div>
                ) : feature.hasCustomVisual && feature.visualType === "fitness" ? (
                  // Custom Fitness visual with notification and workout
                  <div className="w-full max-w-lg">
                    <FitnessWorkoutCard />
                  </div>
                ) : feature.hasCustomVisual && feature.visualType === "concierge" ? (
                  // Custom Road Concierge visual with eyes and search results
                  <div className="w-full max-w-lg">
                    <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
                      {/* Rigsy Eyes */}
                      <div className="w-28 h-14 sm:w-40 sm:h-20 shrink-0">
                        <MiniRigsyEyes isActive={true} />
                      </div>

                      {/* Speech bubble with voice search */}
                      <div className="relative bg-[#161B22] rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-[#21262D] flex-1 w-full sm:w-auto">
                        <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-0 h-0 border-t-8 border-b-8 border-r-8 border-transparent border-r-[#21262D] hidden sm:block" />
                        <div className="flex items-center gap-2 mb-1.5">
                          <motion.div
                            className="w-2 h-2 rounded-full bg-[#58A6FF]"
                            animate={{ scale: [1, 1.3, 1], opacity: [0.7, 1, 0.7] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                          />
                          <span className="text-[#6E7681] text-[10px] sm:text-xs">Searching nearby...</span>
                        </div>
                        <p className="text-[#F0F3F6] text-xs sm:text-sm italic">
                          &ldquo;{feature.example.driver}&rdquo;
                        </p>
                      </div>
                    </div>

                    {/* Search Results Card */}
                    <div className="mt-3 sm:mt-4">
                      <ConciergeResultsCard />
                    </div>
                  </div>
                ) : feature.hasCustomVisual && feature.visualType === "maintenance" ? (
                  // Custom Equipment Manager visual with eyes and diagnostic card
                  <div className="w-full max-w-lg">
                    <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
                      {/* Rigsy Eyes */}
                      <div className="w-28 h-14 sm:w-40 sm:h-20 shrink-0">
                        <MiniRigsyEyes isActive={true} />
                      </div>

                      {/* Speech bubble with symptom */}
                      <div className="relative bg-[#161B22] rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-[#21262D] flex-1 w-full sm:w-auto">
                        <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-0 h-0 border-t-8 border-b-8 border-r-8 border-transparent border-r-[#21262D] hidden sm:block" />
                        <div className="flex items-center gap-2 mb-1.5">
                          <motion.div
                            className="w-2 h-2 rounded-full bg-[#D29922]"
                            animate={{ scale: [1, 1.3, 1], opacity: [0.7, 1, 0.7] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                          />
                          <span className="text-[#6E7681] text-[10px] sm:text-xs">Analyzing symptoms...</span>
                        </div>
                        <p className="text-[#F0F3F6] text-xs sm:text-sm italic">
                          &ldquo;{feature.example.driver}&rdquo;
                        </p>
                      </div>
                    </div>

                    {/* Diagnostic Card */}
                    <div className="mt-3 sm:mt-4">
                      <DiagnosticCard />
                    </div>
                  </div>
                ) : feature.hasCustomVisual && feature.visualType === "companion" ? (
                  // Custom Mental Co-Pilot visual with proactive check-in
                  <div className="w-full max-w-lg">
                    <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
                      {/* Rigsy Eyes */}
                      <div className="w-28 h-14 sm:w-40 sm:h-20 shrink-0">
                        <MiniRigsyEyes isActive={true} />
                      </div>

                      {/* Status bubble */}
                      <div className="relative bg-[#161B22] rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-[#21262D] flex-1 w-full sm:w-auto">
                        <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-0 h-0 border-t-8 border-b-8 border-r-8 border-transparent border-r-[#21262D] hidden sm:block" />
                        <div className="flex items-center gap-2 mb-1.5">
                          <motion.div
                            className="w-2 h-2 rounded-full bg-[#4B5EAA]"
                            animate={{ scale: [1, 1.3, 1], opacity: [0.7, 1, 0.7] }}
                            transition={{ duration: 2, repeat: Infinity }}
                          />
                          <span className="text-[#6E7681] text-[10px] sm:text-xs">Proactive check-in</span>
                        </div>
                        <p className="text-[#F0F3F6] text-xs sm:text-sm italic">
                          &ldquo;{feature.example.driver}&rdquo;
                        </p>
                      </div>
                    </div>

                    {/* Companion Card */}
                    <div className="mt-3 sm:mt-4">
                      <CompanionCard />
                    </div>
                  </div>
                ) : (
                  // Default visual with conversation (fallback)
                  <div className="w-full max-w-md">
                    {/* Icon placeholder */}
                    <div
                      className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center text-white mb-6 mx-auto lg:mx-0`}
                    >
                      <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>

                    {/* Example conversation */}
                    <div className="bg-[#161B22] rounded-2xl p-6 border border-[#21262D]">
                      <div className="flex items-start gap-3 mb-4">
                        <div className="w-8 h-8 rounded-full bg-[#21262D] flex items-center justify-center flex-shrink-0">
                          <svg
                            className="w-4 h-4 text-[#8B949E]"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                            />
                          </svg>
                        </div>
                        <div>
                          <span className="text-xs text-[#6E7681] block mb-1">
                            Driver
                          </span>
                          <p className="text-[#F0F3F6] text-sm">
                            {feature.example.driver}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#4B5EAA] to-[#FF6B35] flex items-center justify-center flex-shrink-0">
                          <span className="text-white text-xs font-bold">R</span>
                        </div>
                        <div>
                          <span className="text-xs text-[#6E7681] block mb-1">
                            Rigsy
                          </span>
                          <p className="text-[#F0F3F6] text-sm italic">
                            &ldquo;{feature.example.rigsy}&rdquo;
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
