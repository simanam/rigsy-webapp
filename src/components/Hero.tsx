"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import WaitlistModal from "./WaitlistModal";

// Generate a unique session ID for rate limiting
function generateSessionId(): string {
  return `rigsy_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Speech recognition types
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  isFinal: boolean;
  length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  abort(): void;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: Event) => void) | null;
  onend: (() => void) | null;
  onstart: (() => void) | null;
}

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition;
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
}

// Chat state type
type ChatState = 'idle' | 'listening' | 'processing' | 'speaking' | 'signup';

export default function Hero() {
  const [mousePosition, setMousePosition] = useState({ x: 0.5, y: 0.5 });
  const [isBlinking, setIsBlinking] = useState(false);
  const [isAwake, setIsAwake] = useState(false);
  const [chatState, setChatState] = useState<ChatState>('idle');
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState('');
  const [sessionCount, setSessionCount] = useState(0);
  const [showSignupPrompt, setShowSignupPrompt] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [eyesShifted, setEyesShifted] = useState(false);
  const [showWaitlistModal, setShowWaitlistModal] = useState(false);
  const [speakingOffset, setSpeakingOffset] = useState({ x: 0, y: 0 });
  const [pupilScale, setPupilScale] = useState(1);
  const [speakingBlink, setSpeakingBlink] = useState(false);

  const phoneRef = useRef<HTMLDivElement>(null);
  const sessionIdRef = useRef<string>('');
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize session ID on mount
  useEffect(() => {
    // Check for existing session in sessionStorage
    const existingSession = sessionStorage.getItem('rigsy_session_id');
    if (existingSession) {
      sessionIdRef.current = existingSession;
    } else {
      const newSessionId = generateSessionId();
      sessionIdRef.current = newSessionId;
      sessionStorage.setItem('rigsy_session_id', newSessionId);
    }
  }, []);

  // Track mouse position relative to phone (only when not in voice mode)
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (phoneRef.current && chatState === 'idle') {
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
  }, [chatState]);

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

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // Animate eyes when speaking - natural rolling movement with size changes
  useEffect(() => {
    if (chatState !== 'speaking') {
      setSpeakingOffset({ x: 0, y: 0 });
      setPupilScale(1);
      setSpeakingBlink(false);
      return;
    }

    let time = 0;

    // Smooth rolling movement using sine waves
    const moveInterval = setInterval(() => {
      time += 0.15;
      // Create smooth circular/figure-8 movement
      const x = Math.sin(time) * 4 + Math.sin(time * 1.7) * 2;
      const y = Math.cos(time * 0.8) * 3 + Math.sin(time * 2.1) * 1.5;
      setSpeakingOffset({ x, y });
    }, 50);

    // Pupil size pulsing - breathing effect
    const scaleInterval = setInterval(() => {
      setPupilScale(0.95 + Math.sin(Date.now() / 300) * 0.1);
    }, 50);

    // Random expressive blinks while speaking
    const blinkInterval = setInterval(() => {
      if (Math.random() > 0.7) {
        setSpeakingBlink(true);
        setTimeout(() => setSpeakingBlink(false), 120);
      }
    }, 1500);

    return () => {
      clearInterval(moveInterval);
      clearInterval(scaleInterval);
      clearInterval(blinkInterval);
    };
  }, [chatState]);

  // Calculate pupil position - shift left when in voice mode on desktop
  const basePupilOffsetX = eyesShifted ? -15 : mousePosition.x * 12;
  const basePupilOffsetY = eyesShifted ? 0 : mousePosition.y * 8;
  const pupilOffsetX = basePupilOffsetX + speakingOffset.x;
  const pupilOffsetY = basePupilOffsetY + speakingOffset.y;

  // Play TTS audio
  const playTTS = useCallback(async (text: string, hash: string) => {
    try {
      const ttsResponse = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, hash }),
      });

      if (!ttsResponse.ok) {
        console.error('TTS failed');
        setChatState('idle');
        return;
      }

      const audioBlob = await ttsResponse.blob();
      const audioUrl = URL.createObjectURL(audioBlob);

      if (audioRef.current) {
        audioRef.current.pause();
      }

      audioRef.current = new Audio(audioUrl);
      audioRef.current.onended = () => {
        setChatState('idle');
        setEyesShifted(false);
        URL.revokeObjectURL(audioUrl);
      };
      audioRef.current.onerror = () => {
        setChatState('idle');
        setEyesShifted(false);
      };

      await audioRef.current.play();
    } catch (error) {
      console.error('TTS error:', error);
      setChatState('idle');
      setEyesShifted(false);
    }
  }, []);

  // Send message to Rigsy API
  const sendToRigsy = useCallback(async (message: string) => {
    setChatState('processing');
    setErrorMessage('');

    try {
      const chatResponse = await fetch('/api/rigsy-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message,
          sessionId: sessionIdRef.current,
        }),
      });

      const data = await chatResponse.json();

      if (!chatResponse.ok) {
        setErrorMessage(data.error || 'Something went wrong');
        setChatState('idle');
        return;
      }

      if (data.requiresSignup) {
        setResponse(data.response);
        setSessionCount(data.sessionCount || 0);
        setShowSignupPrompt(true);
        setChatState('signup');
        // Still play the response
        setChatState('speaking');
        await playTTS(data.response, data.ttsHash);
        setChatState('signup');
        return;
      }

      setResponse(data.response);
      setSessionCount(data.sessionCount || 0);

      // Check if this is their last free question
      if (data.isLastFreeQuestion) {
        setShowSignupPrompt(true);
      }

      // Play the response via TTS
      setChatState('speaking');
      setEyesShifted(true); // Shift eyes on desktop when speaking
      await playTTS(data.response, data.ttsHash);
    } catch (error) {
      console.error('Chat error:', error);
      setErrorMessage('Failed to connect. Please try again.');
      setChatState('idle');
    }
  }, [playTTS]);

  // Start voice recognition
  const startListening = useCallback(() => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      setErrorMessage('Voice recognition not supported in this browser');
      return;
    }

    // Clear previous state
    setTranscript('');
    setResponse('');
    setErrorMessage('');

    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognitionAPI();
    recognitionRef.current = recognition;

    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    let hasProcessedFinal = false;

    recognition.onstart = () => {
      setChatState('listening');
      setIsAwake(true);
    };

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let finalTranscript = '';
      let interimTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          finalTranscript += result[0].transcript;
        } else {
          interimTranscript += result[0].transcript;
        }
      }

      // Always update transcript to show what user is saying
      const currentTranscript = finalTranscript || interimTranscript;
      if (currentTranscript) {
        setTranscript(currentTranscript);
      }

      // Only send to API once when we get final result
      if (finalTranscript && !hasProcessedFinal) {
        hasProcessedFinal = true;
        recognition.stop();
        sendToRigsy(finalTranscript);
      }
    };

    recognition.onerror = (event: Event & { error?: string }) => {
      console.error('Speech recognition error:', event);
      if (event.error === 'no-speech') {
        setErrorMessage('No speech detected. Try again.');
      } else if (event.error === 'not-allowed') {
        setErrorMessage('Microphone access denied. Please allow microphone.');
      } else {
        setErrorMessage('Could not hear you. Please try again.');
      }
      setChatState('idle');
    };

    recognition.onend = () => {
      // Only reset to idle if we haven't started processing
      if (!hasProcessedFinal) {
        setChatState('idle');
      }
    };

    recognition.start();
  }, [sendToRigsy]);

  // Stop voice recognition
  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  }, []);

  // Handle mic button click
  const handleMicClick = () => {
    if (chatState === 'listening') {
      stopListening();
    } else if (chatState === 'idle' || chatState === 'signup') {
      if (showSignupPrompt && chatState === 'signup') {
        // Open waitlist modal instead of scrolling
        setShowWaitlistModal(true);
        return;
      }
      startListening();
    } else if (chatState === 'speaking') {
      // Stop audio playback
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      setChatState('idle');
      setEyesShifted(false);
    }
  };

  // Handle waitlist button click in hero
  const handleWaitlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowWaitlistModal(true);
  };

  // Determine if we're in any active voice state
  const isVoiceActive = chatState !== 'idle';

  // Eye dimensions constants
  const eyeR = 72;
  const innerR = eyeR * 0.8;
  const pupilR = eyeR * 0.39;
  const highlightR = pupilR * 0.32;
  const highlight2R = pupilR * 0.16;
  const eyelidR = innerR + 1;

  return (
    <>
    <section
      aria-label="Hero - Your AI Co-Pilot for the Long Haul"
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16 sm:pt-20"
    >
      {/* Background gradient effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 sm:w-96 h-64 sm:h-96 bg-[#4B5EAA]/20 rounded-full blur-[128px]" />
        <div className="absolute bottom-1/4 right-1/4 w-64 sm:w-96 h-64 sm:h-96 bg-[#FF6B35]/15 rounded-full blur-[128px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-12">
        <div className="grid lg:grid-cols-2 gap-6 sm:gap-12 lg:gap-16 items-center">
          {/* Left Column - Content (first on mobile, first on desktop) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-4 sm:space-y-6 text-center lg:text-left order-1"
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
              <button
                onClick={handleWaitlistClick}
                className="px-6 sm:px-8 py-3 sm:py-4 bg-[#FF6B35] hover:bg-[#FF8255] text-[#0D1117] font-semibold rounded-full transition-all transform hover:scale-105 glow-orange text-base sm:text-lg w-full sm:w-auto text-center focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6B35] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0D1117]"
              >
                Join the Waitlist
              </button>
              <a
                href="#features"
                className="px-6 sm:px-8 py-3 sm:py-4 border border-[#21262D] hover:border-[#4B5EAA] text-[#F0F3F6] font-semibold rounded-full transition-all text-base sm:text-lg w-full sm:w-auto text-center focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6B35] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0D1117]"
              >
                See Features
              </a>
            </motion.div>

            {/* Trust indicators - hidden on very small screens */}
            <motion.ul
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="hidden sm:flex flex-wrap items-center justify-center lg:justify-start gap-4 sm:gap-6 pt-2 sm:pt-4"
              aria-label="Key features"
            >
              <li className="flex items-center gap-2">
                <svg className="w-4 sm:w-5 h-4 sm:h-5 text-[#3FB950]" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-xs sm:text-sm text-[#8B949E]">Voice-First</span>
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-4 sm:w-5 h-4 sm:h-5 text-[#3FB950]" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-xs sm:text-sm text-[#8B949E]">ELD Integration</span>
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-4 sm:w-5 h-4 sm:h-5 text-[#3FB950]" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-xs sm:text-sm text-[#8B949E]">Works Offline</span>
              </li>
            </motion.ul>
          </motion.div>

          {/* Right Column - Phone on Truck Dashboard (second on mobile, second on desktop) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="relative flex flex-col items-center justify-center order-2"
          >
            {/* Dashboard Scene Container */}
            <motion.div
              ref={phoneRef}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="relative w-full max-w-xs sm:max-w-xl"
            >
              {/* Animated glow effect - behind dashboard */}
              <motion.div
                animate={{
                  scale: [1, 1.08, 1],
                  opacity: isVoiceActive ? [0.5, 0.8, 0.5] : [0.2, 0.35, 0.2],
                }}
                transition={{
                  duration: isVoiceActive ? 1 : 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute -inset-4 sm:-inset-6 bg-linear-to-r from-[#4B5EAA] via-[#FF6B35] to-[#4B5EAA] rounded-2xl sm:rounded-4xl blur-2xl sm:blur-3xl"
              />

              {/* Dashboard Background with Road View */}
              <div className="relative rounded-xl sm:rounded-3xl overflow-hidden">
                {/* Landscape image as background - zoomed in on road view */}
                <div
                  className="absolute inset-0 bg-cover sm:bg-size-[180%] bg-position-[70%_50%] sm:bg-position-[85%_40%]"
                  style={{
                    backgroundImage: 'url(/landscape.png)',
                  }}
                />
                {/* Dark overlay - lighter to show more road */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0D1117]/85 via-[#0D1117]/50 to-[#0D1117]/35 sm:from-[#0D1117]/80 sm:via-[#0D1117]/40 sm:to-[#0D1117]/25" />
                {/* Softer vignette effect */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,#0D1117_100%)] sm:bg-[radial-gradient(ellipse_at_center,transparent_50%,#0D1117_100%)]" />

                {/* Content wrapper with padding */}
                <div className="relative p-3 sm:p-8 pt-4 sm:pt-10">
                  {/* Phone mount indicator - hidden on mobile */}
                  <div className="hidden sm:flex justify-center mb-3">
                    <div className="w-24 h-1.5 bg-[#21262D] rounded-full opacity-60" />
                  </div>

                  {/* Phone frame */}
                  <div className="relative bg-gradient-to-br from-[#1a1a1a] to-[#2d2d2d] rounded-[2.8rem] sm:rounded-[2.5rem] p-[3px] sm:p-[4px] shadow-2xl mx-auto w-[240px] sm:w-auto sm:max-w-none">

                    {/* Phone Screen - Vertical on mobile (iPhone 14 Pro proportions 9:19.5), Horizontal on desktop */}
                    <div className="relative bg-[#0D1117] rounded-[2.5rem] sm:rounded-[2.2rem] overflow-hidden aspect-[9/19.5] sm:aspect-[19.5/9]">
                      {/* Dynamic Island - top center on mobile, left side on desktop */}
                      <div className="absolute top-4 left-1/2 -translate-x-1/2 sm:top-1/2 sm:left-4 sm:-translate-x-0 sm:-translate-y-1/2 w-24 h-7 sm:w-5 sm:h-16 bg-[#000000] rounded-full z-20" />

                      {/* Rigsy Eyes Interface */}
                      <div className="absolute inset-0 flex items-center justify-center p-4 sm:p-6 sm:py-8">
                        {/* Horizontal binoculars in vertical phone for mobile */}
                        <svg viewBox="0 0 200 100" className="w-full sm:hidden" preserveAspectRatio="xMidYMid meet" aria-hidden="true" role="img">
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

                          {/* Horizontal binocular body - eyes side by side */}
                          <g>
                            {/* Left goggle */}
                            <ellipse cx="55" cy="50" rx="50" ry="46" fill="url(#mobileBodyGradient)" />
                            {/* Right goggle */}
                            <ellipse cx="145" cy="50" rx="50" ry="46" fill="url(#mobileBodyGradient)" />
                            {/* Bridge */}
                            <path
                              d="M 80 20 Q 100 5 120 20 L 120 80 Q 100 95 80 80 Z"
                              fill="url(#mobileBodyGradient)"
                            />
                          </g>

                          {/* Left eye */}
                          <g>
                            <circle cx={55} cy={50} r={38} fill="none" stroke="url(#mobileEyeRingGradient)" strokeWidth="5" />
                            <circle cx={55} cy={50} r={30} fill="url(#mobileInnerEyeGradient)" />
                            <motion.g
                              animate={{
                                x: pupilOffsetX * 0.5,
                                y: pupilOffsetY * 0.4,
                                scale: isAwake ? pupilScale : 0
                              }}
                              transition={{ type: "spring", stiffness: 200, damping: 25 }}
                            >
                              <circle cx={55} cy={50} r={15} fill="url(#mobilePupilGradient)" />
                              <circle cx={49} cy={44} r={5} fill="white" opacity="0.9" />
                              <circle cx={60} cy={55} r={2.5} fill="white" opacity="0.5" />
                            </motion.g>
                            <motion.ellipse
                              cx={55}
                              cy={50}
                              rx={31}
                              fill="#1A1A2E"
                              animate={{ ry: isBlinking || speakingBlink || !isAwake ? 31 : 0 }}
                              transition={{ duration: isAwake ? 0.1 : 0.5 }}
                            />
                            <path d="M 28 28 Q 55 10 82 28" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.15" />
                          </g>

                          {/* Right eye */}
                          <g>
                            <circle cx={145} cy={50} r={38} fill="none" stroke="url(#mobileEyeRingGradient)" strokeWidth="5" />
                            <circle cx={145} cy={50} r={30} fill="url(#mobileInnerEyeGradient)" />
                            <motion.g
                              animate={{
                                x: pupilOffsetX * 0.5,
                                y: pupilOffsetY * 0.4,
                                scale: isAwake ? pupilScale : 0
                              }}
                              transition={{ type: "spring", stiffness: 200, damping: 25 }}
                            >
                              <circle cx={145} cy={50} r={15} fill="url(#mobilePupilGradient)" />
                              <circle cx={139} cy={44} r={5} fill="white" opacity="0.9" />
                              <circle cx={150} cy={55} r={2.5} fill="white" opacity="0.5" />
                            </motion.g>
                            <motion.ellipse
                              cx={145}
                              cy={50}
                              rx={31}
                              fill="#1A1A2E"
                              animate={{ ry: isBlinking || speakingBlink || !isAwake ? 31 : 0 }}
                              transition={{ duration: isAwake ? 0.1 : 0.5 }}
                            />
                            <path d="M 118 28 Q 145 10 172 28" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.15" />
                          </g>

                          {/* Orange accent on bridge */}
                          <motion.circle
                            cx="100"
                            cy="50"
                            r="4"
                            fill="#FF6B35"
                            filter="url(#mobileGlow)"
                            animate={{
                              opacity: isVoiceActive ? [0.8, 1, 0.8] : 0.6,
                              r: isVoiceActive ? [4, 6, 4] : 4
                            }}
                            transition={{ duration: 0.5, repeat: isVoiceActive ? Infinity : 0 }}
                          />
                        </svg>

                    {/* Horizontal layout SVG for desktop */}
                    <svg viewBox="0 0 400 180" className="hidden sm:block w-full h-full" preserveAspectRatio="xMidYMid meet" aria-hidden="true" role="img">
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
                            scale: isAwake ? pupilScale : 0
                          }}
                          transition={{ type: "spring", stiffness: 200, damping: 25 }}
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
                          animate={{ ry: isBlinking || speakingBlink || !isAwake ? eyelidR : 0 }}
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
                            scale: isAwake ? pupilScale : 0
                          }}
                          transition={{ type: "spring", stiffness: 200, damping: 25 }}
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
                          animate={{ ry: isBlinking || speakingBlink || !isAwake ? eyelidR : 0 }}
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
                          opacity: isVoiceActive ? [0.8, 1, 0.8] : 0.6,
                          r: isVoiceActive ? [6, 10, 6] : 6
                        }}
                        transition={{ duration: 0.5, repeat: isVoiceActive ? Infinity : 0 }}
                      />
                    </svg>
                  </div>

                  {/* Voice Interaction UI */}
                  <div className="absolute bottom-2 sm:bottom-4 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-2">
                    {/* Transcript/Response Display */}
                    <AnimatePresence mode="wait">
                      {chatState !== 'idle' && (
                        <motion.div
                          key={chatState}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="bg-[#161B22]/95 backdrop-blur-sm px-3 py-2 rounded-lg border border-[#21262D] max-w-[200px] sm:max-w-xs text-center"
                        >
                          {errorMessage ? (
                            <p className="text-xs text-red-400">{errorMessage}</p>
                          ) : chatState === 'listening' ? (
                            <p className="text-xs text-[#8B949E]">
                              {transcript ? <span className="italic">&quot;{transcript}&quot;</span> : 'Listening...'}
                            </p>
                          ) : chatState === 'processing' ? (
                            <div className="flex flex-col gap-1">
                              {transcript && <p className="text-xs text-[#6E7681] italic">&quot;{transcript}&quot;</p>}
                              <p className="text-xs text-[#FF6B35]">Thinking...</p>
                            </div>
                          ) : (chatState === 'speaking' || chatState === 'signup') && response ? (
                            <p className="text-xs text-[#F0F3F6]">{response}</p>
                          ) : null}
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Hey Rigsy Button */}
                    <motion.button
                      onClick={handleMicClick}
                      disabled={chatState === 'processing'}
                      aria-label={
                        chatState === 'listening' ? "Stop listening" :
                        chatState === 'speaking' ? "Stop speaking" :
                        chatState === 'processing' ? "Processing your question" :
                        chatState === 'signup' ? "Join the waitlist" :
                        "Activate Rigsy voice assistant"
                      }
                      aria-pressed={chatState === 'listening'}
                      className={`flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-2 sm:py-3 rounded-full transition-all shadow-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#0D1117] ${
                        chatState === 'listening'
                          ? "bg-[#FF6B35] text-white"
                          : chatState === 'speaking'
                          ? "bg-[#4B5EAA] text-white"
                          : chatState === 'processing'
                          ? "bg-[#21262D] text-[#8B949E] cursor-wait"
                          : chatState === 'signup'
                          ? "bg-[#3FB950] text-white"
                          : "bg-[#161B22]/90 backdrop-blur-sm border border-[#21262D] text-[#F0F3F6] hover:border-[#FF6B35]"
                      }`}
                      whileHover={chatState !== 'processing' ? { scale: 1.05 } : {}}
                      whileTap={chatState !== 'processing' ? { scale: 0.95 } : {}}
                    >
                      <motion.div
                        animate={chatState === 'listening' || chatState === 'speaking' ? { scale: [1, 1.2, 1] } : {}}
                        transition={{ duration: 0.5, repeat: chatState === 'listening' || chatState === 'speaking' ? Infinity : 0 }}
                        aria-hidden="true"
                      >
                        {chatState === 'speaking' ? (
                          <svg
                            className="w-4 h-4 sm:w-5 sm:h-5 text-white"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            aria-hidden="true"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                          </svg>
                        ) : chatState === 'processing' ? (
                          <svg
                            className="w-4 h-4 sm:w-5 sm:h-5 text-[#8B949E] animate-spin"
                            fill="none"
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                          >
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                        ) : chatState === 'signup' ? (
                          <svg
                            className="w-4 h-4 sm:w-5 sm:h-5 text-white"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            aria-hidden="true"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                          </svg>
                        ) : (
                          <svg
                            className={`w-4 h-4 sm:w-5 sm:h-5 ${chatState === 'listening' ? "text-white" : "text-[#FF6B35]"}`}
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            aria-hidden="true"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                            />
                          </svg>
                        )}
                      </motion.div>
                      <span className="font-semibold text-xs sm:text-sm">
                        {chatState === 'listening' ? "Listening..." :
                         chatState === 'speaking' ? "Speaking..." :
                         chatState === 'processing' ? "Thinking..." :
                         chatState === 'signup' ? "Join Waitlist" :
                         "Hey Rigsy"}
                      </span>
                      {chatState === 'listening' && (
                        <div className="flex items-center gap-0.5 ml-1" aria-hidden="true">
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
                      {/* Screen reader announcement for state changes */}
                      <span className="sr-only" aria-live="polite">
                        {chatState === 'listening' ? "Voice assistant is now listening" :
                         chatState === 'speaking' ? "Rigsy is speaking" :
                         chatState === 'processing' ? "Processing your question" : ""}
                      </span>
                    </motion.button>

                    {/* Session counter */}
                    {sessionCount > 0 && sessionCount < 2 && chatState === 'idle' && (
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-[10px] text-[#6E7681]"
                      >
                        {2 - sessionCount} question{2 - sessionCount !== 1 ? 's' : ''} left in demo
                      </motion.p>
                    )}
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

                  {/* Status badges inside dashboard scene */}
                  <div className="flex justify-center gap-1.5 sm:gap-3 mt-2 sm:mt-4 pb-2 flex-wrap">
                    <motion.div
                      animate={{ opacity: [0.7, 1, 0.7] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="bg-[#161B22]/80 backdrop-blur-sm px-2 sm:px-3 py-1 sm:py-1.5 rounded-full border border-[#21262D]/50"
                    >
                      <div className="flex items-center gap-1 sm:gap-2">
                        <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[#3FB950] animate-pulse" />
                        <span className="text-[9px] sm:text-xs font-medium text-[#F0F3F6]">Voice Active</span>
                      </div>
                    </motion.div>
                    <motion.div
                      animate={{ opacity: [0.7, 1, 0.7] }}
                      transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
                      className="bg-[#161B22]/80 backdrop-blur-sm px-2 sm:px-3 py-1 sm:py-1.5 rounded-full border border-[#21262D]/50"
                    >
                      <div className="flex items-center gap-1 sm:gap-2">
                        <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[#FF6B35] animate-pulse" />
                        <span className="text-[9px] sm:text-xs font-medium text-[#F0F3F6]">ELD Connected</span>
                      </div>
                    </motion.div>
                    <motion.div
                      animate={{ opacity: [0.7, 1, 0.7] }}
                      transition={{ duration: 2, repeat: Infinity, delay: 0.6 }}
                      className="bg-[#161B22]/80 backdrop-blur-sm px-2 sm:px-3 py-1 sm:py-1.5 rounded-full border border-[#21262D]/50 hidden sm:block"
                    >
                      <div className="flex items-center gap-1 sm:gap-2">
                        <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[#4B5EAA] animate-pulse" />
                        <span className="text-[9px] sm:text-xs font-medium text-[#F0F3F6]">Offline Ready</span>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator - hidden on small screens */}
      <div className="absolute bottom-4 sm:bottom-8 left-1/2 transform -translate-x-1/2 hidden sm:block" aria-hidden="true">
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-6 h-10 rounded-full border-2 border-[#21262D] flex items-start justify-center p-2"
        >
          <div className="w-1 h-2 bg-[#8B949E] rounded-full" />
        </motion.div>
      </div>
    </section>

      {/* Waitlist Modal */}
      <WaitlistModal
        isOpen={showWaitlistModal}
        onClose={() => setShowWaitlistModal(false)}
      />
    </>
  );
}
