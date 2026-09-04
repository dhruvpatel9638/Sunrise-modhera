import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import amyaLogo from '../assets/Amya LOGO png.png';
import parchmentBg from '../assets/parchment_texture.jpg';

const LOADING_MESSAGES = [
  { max: 25, text: "Greeting the morning horizon..." },
  { max: 50, text: "Channelling the Temple's solar rays..." },
  { max: 75, text: "Gathering riverside tranquility..." },
  { max: 99, text: "Awakening the sanctuary..." },
  { max: 100, text: "Sun rises over Modhera." }
];

export default function SunPreloader({ percent = 0, isReady = false, onComplete }) {
  // Stages: 'amya' (Stage 1: strictly 2.5s) -> 'sun' (Stage 2: stays until web is loaded)
  const [stage, setStage] = useState('amya');
  const [visible, setVisible] = useState(true);
  const [sunFadeOut, setSunFadeOut] = useState(false);

  // Smooth visual percentage for the Sun stage
  const [displayPercent, setDisplayPercent] = useState(0);
  const [sunMessage, setSunMessage] = useState("Invoking sunrise...");

  const sunStartTimeRef = useRef(null);

  // Stage 1: Amya Growth screen displays for EXACTLY 2.5 seconds (2500ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      setStage('sun');
      sunStartTimeRef.current = Date.now();
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  // Update dynamic message for Sun stage based on displayPercent
  useEffect(() => {
    const matched = LOADING_MESSAGES.find(m => displayPercent <= m.max);
    if (matched) {
      setSunMessage(matched.text);
    }
  }, [displayPercent]);

  // Smooth progress calculation in Sun stage
  useEffect(() => {
    if (stage !== 'sun') return;

    const interval = setInterval(() => {
      setDisplayPercent(prev => {
        // If web is ready, target 100%; otherwise target actual percent loaded
        const target = isReady ? 100 : Math.max(prev, percent);
        if (prev < target) {
          const step = Math.max(1, Math.ceil((target - prev) / 6));
          return Math.min(target, prev + step);
        }
        return prev;
      });
    }, 35);

    return () => clearInterval(interval);
  }, [stage, percent, isReady]);

  // Handle completion when web is ready AND Stage 2 (Sun) has displayed sufficiently
  useEffect(() => {
    if (stage !== 'sun') return;

    // Only proceed when website is fully ready AND progress bar reached 100%
    if (isReady && displayPercent >= 100) {
      const now = Date.now();
      const elapsedSun = sunStartTimeRef.current ? (now - sunStartTimeRef.current) : 1500;
      const minSunDuration = 1400; // Guarantee sun animation is visible for at least ~1.4s
      const remainingTime = Math.max(0, minSunDuration - elapsedSun);

      const t1 = setTimeout(() => {
        setSunFadeOut(true);
        if (onComplete) {
          onComplete();
        }
      }, remainingTime + 500); // 500ms hold at 100% "Sun rises over Modhera."

      const t2 = setTimeout(() => {
        setVisible(false);
      }, remainingTime + 1300); // 500ms hold + 800ms fade transition

      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
      };
    }
  }, [stage, isReady, displayPercent, onComplete]);

  if (!visible) return null;

  return (
    <motion.div
      className="preloader-fullscreen-overlay"
      initial={{ opacity: 1 }}
      animate={{ opacity: sunFadeOut ? 0 : 1 }}
      transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: '#F8F5EE',
        /* Parchment texture overlaid with cream color to show at 20% opacity */
        backgroundImage: `linear-gradient(rgba(248, 245, 238, 0.8), rgba(248, 245, 238, 0.8)), url(${parchmentBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 999999,
        pointerEvents: sunFadeOut ? 'none' : 'all'
      }}
    >
      <AnimatePresence mode="wait">
        {/* STAGE 1: AMYA GROWTH SCREEN (Exactly 2.5s) */}
        {stage === 'amya' && (
          <motion.div
            key="stage-amya"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.98, filter: 'blur(3px)' }}
            transition={{ duration: 0.45, ease: 'easeInOut' }}
            style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              position: 'relative'
            }}
          >
            {/* Central Content */}
            <div 
              style={{
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '20px',
                maxWidth: '460px'
              }}
            >
              {/* Logo Container with Smooth Entrance */}
              <motion.div
                initial={{ opacity: 0, y: 24, filter: 'blur(8px)', scale: 0.96 }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)', scale: 1 }}
                transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
                style={{ marginBottom: '20px', display: 'flex', justifyContent: 'center' }}
              >
                <img
                  src={amyaLogo}
                  alt="Amya Growth"
                  style={{
                    width: '270px',
                    maxWidth: '82vw',
                    height: 'auto',
                    display: 'block',
                    objectFit: 'contain',
                    mixBlendMode: 'multiply'
                  }}
                />
              </motion.div>

              {/* Webapp Crafted with Love Text */}
              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.25 }}
                style={{
                  fontFamily: "'Inter', 'Outfit', system-ui, -apple-system, sans-serif",
                  fontSize: '0.94rem',
                  fontWeight: 500,
                  color: '#294B46',
                  marginTop: '4px',
                  marginBottom: '26px',
                  letterSpacing: '0.01em'
                }}
              >
                Webapp Crafted with <span style={{ color: '#E53E3E', margin: '0 2px' }}>❤️</span> by Amya Growth
              </motion.p>

              {/* Single Clean Spinning Teal Ring Loader */}
              <motion.div
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.35 }}
                style={{ width: '34px', height: '34px', position: 'relative' }}
              >
                <div
                  style={{
                    width: '100%',
                    height: '100%',
                    borderRadius: '50%',
                    border: '3px solid rgba(41, 75, 70, 0.15)',
                    borderTopColor: '#00A896',
                    borderRightColor: '#58938E',
                    animation: 'amyaSingleSpin 0.9s linear infinite'
                  }}
                />
              </motion.div>
            </div>

            {/* Experience Initializing Text at very bottom center */}
            <motion.div
              initial={{ opacity: 0, y: 6, x: '-50%' }}
              animate={{ opacity: 1, y: 0, x: '-50%' }}
              transition={{ duration: 0.7, delay: 0.4 }}
              style={{
                position: 'absolute',
                bottom: '36px',
                left: '50%',
                fontFamily: "'Inter', 'Outfit', sans-serif",
                fontSize: '0.72rem',
                fontWeight: 600,
                color: 'rgba(130, 142, 153, 0.75)',
                letterSpacing: '0.24em',
                textTransform: 'uppercase',
                whiteSpace: 'nowrap'
              }}
            >
              EXPERIENCE INITIALIZING...
            </motion.div>
          </motion.div>
        )}

        {/* STAGE 2: ORIGINAL SUN LOADING ANIMATION (Until website fully loaded) */}
        {stage === 'sun' && (
          <motion.div
            key="stage-sun"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              position: 'relative'
            }}
          >
            <div 
              className="sun-loader-container" 
              style={{ 
                textAlign: 'center', 
                maxWidth: '340px', 
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
              }}
            >
              {/* Sacred Sun Geometry SVG with Glow and Rotation */}
              <div 
                className="sun-svg-wrapper" 
                style={{ 
                  position: 'relative', 
                  width: '120px', 
                  height: '120px', 
                  margin: '0 auto 24px' 
                }}
              >
                {/* Pulsating golden glow */}
                <div className="sun-glow" />

                <svg
                  viewBox="0 0 100 100"
                  style={{ width: '100%', height: '100%', display: 'block', overflow: 'visible' }}
                >
                  {/* Pulsating Sun Core */}
                  <circle
                    cx="50"
                    cy="50"
                    r="18"
                    fill="var(--color-gold, #c89b3c)"
                    className="sun-core-pulse"
                  />

                  {/* Outer Rotating Rays */}
                  <g className="sun-rays-rotate" style={{ transformOrigin: '50px 50px' }}>
                    {/* Primary Rays */}
                    {[...Array(12)].map((_, i) => {
                      const angle = (i * 360) / 12;
                      return (
                        <path
                          key={`ray-p-${i}`}
                          d="M 50 16 L 53 28 L 47 28 Z"
                          fill="var(--color-gold-light, #dfb76c)"
                          transform={`rotate(${angle} 50 50)`}
                          style={{ opacity: 0.92 }}
                        />
                      );
                    })}
                    {/* Secondary offset minor rays */}
                    {[...Array(12)].map((_, i) => {
                      const angle = (i * 360) / 12 + 15;
                      return (
                        <path
                          key={`ray-s-${i}`}
                          d="M 50 22 L 52 30 L 48 30 Z"
                          fill="var(--color-gold, #c89b3c)"
                          transform={`rotate(${angle} 50 50)`}
                          style={{ opacity: 0.75 }}
                        />
                      );
                    })}
                  </g>
                </svg>
              </div>

              {/* Dynamic Modhera Sunrise Heading */}
              <h2
                style={{
                  fontFamily: 'var(--font-headings, "Playfair Display", serif)',
                  fontSize: '1.9rem',
                  color: 'var(--color-primary-dark, #1B382B)',
                  fontWeight: '400',
                  fontStyle: 'italic',
                  marginBottom: '8px',
                  letterSpacing: '0.02em'
                }}
              >
                Modhera Sunrise
              </h2>

              {/* Dynamic loading status message */}
              <p
                style={{
                  fontFamily: 'var(--font-body, "Inter", sans-serif)',
                  fontSize: '0.86rem',
                  color: 'var(--color-text-muted-light, #5C6F64)',
                  letterSpacing: '0.04em',
                  minHeight: '22px',
                  marginBottom: '22px',
                  transition: 'color 0.3s ease'
                }}
              >
                {sunMessage}
              </p>

              {/* Progress Bar Track */}
              <div
                style={{
                  width: '100%',
                  height: '3px',
                  backgroundColor: 'rgba(30, 91, 58, 0.12)',
                  borderRadius: '3px',
                  overflow: 'hidden',
                  position: 'relative',
                  marginBottom: '10px'
                }}
              >
                <div
                  style={{
                    height: '100%',
                    width: `${displayPercent}%`,
                    backgroundColor: 'var(--color-gold, #c89b3c)',
                    boxShadow: '0 0 10px var(--color-gold, #c89b3c)',
                    transition: 'width 0.15s ease-out'
                  }}
                />
              </div>

              {/* Percentage Indicator */}
              <div
                style={{
                  fontFamily: 'var(--font-body, "Inter", sans-serif)',
                  fontSize: '0.78rem',
                  fontWeight: '600',
                  color: 'var(--color-gold, #b38a32)',
                  letterSpacing: '0.12em'
                }}
              >
                {displayPercent}%
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Embedded Styles for Sun and Amya Animations */}
      <style>{`
        @keyframes amyaSingleSpin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        .sun-svg-wrapper {
          perspective: 1000px;
        }

        .sun-glow {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 76px;
          height: 76px;
          background: radial-gradient(circle, rgba(200, 155, 60, 0.5) 0%, rgba(200, 155, 60, 0) 70%);
          border-radius: 50%;
          filter: blur(9px);
          animation: sunGlowPulse 4s ease-in-out infinite;
          pointer-events: none;
        }

        .sun-core-pulse {
          animation: sunCorePulse 3s ease-in-out infinite;
          transform-origin: 50px 50px;
        }

        .sun-rays-rotate {
          animation: sunRaysRotate 28s linear infinite;
          transform-origin: 50px 50px;
        }

        @keyframes sunGlowPulse {
          0% { transform: translate(-50%, -50%) scale(1); opacity: 0.4; }
          50% { transform: translate(-50%, -50%) scale(1.5); opacity: 0.95; }
          100% { transform: translate(-50%, -50%) scale(1); opacity: 0.4; }
        }

        @keyframes sunCorePulse {
          0% { transform: scale(1); opacity: 0.95; }
          50% { transform: scale(1.08); opacity: 1; filter: drop-shadow(0 0 10px rgba(200, 155, 60, 0.6)); }
          100% { transform: scale(1); opacity: 0.95; }
        }

        @keyframes sunRaysRotate {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </motion.div>
  );
}
