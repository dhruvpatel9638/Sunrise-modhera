import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import parchmentBg from '../assets/parchment_texture.jpg';

const LOADING_MESSAGES = [
  { max: 25, text: "Greeting the morning horizon..." },
  { max: 50, text: "Channelling the Temple's solar rays..." },
  { max: 75, text: "Gathering riverside tranquility..." },
  { max: 99, text: "Awakening the sanctuary..." },
  { max: 100, text: "Sun rises over Modhera." }
];

export default function SunPreloader({ percent = 0, isReady = false, onComplete }) {
  const [visible, setVisible] = useState(true);
  const [sunFadeOut, setSunFadeOut] = useState(false);
  const [displayPercent, setDisplayPercent] = useState(0);
  const [sunMessage, setSunMessage] = useState("Invoking sunrise...");

  const startTimeRef = useRef(Date.now());

  // Update dynamic message based on displayPercent
  useEffect(() => {
    const matched = LOADING_MESSAGES.find(m => displayPercent <= m.max);
    if (matched) {
      setSunMessage(matched.text);
    }
  }, [displayPercent]);

  // Smooth progress calculation tied to actual loading
  useEffect(() => {
    const interval = setInterval(() => {
      setDisplayPercent(prev => {
        // If web is ready, target 100%; otherwise cap at 95% until website is fully loaded
        const maxUnready = 95;
        const target = isReady ? 100 : Math.min(maxUnready, Math.max(prev, percent));
        if (prev < target) {
          const step = Math.max(1, Math.ceil((target - prev) / 5));
          return Math.min(target, prev + step);
        }
        return prev;
      });
    }, 35);

    return () => clearInterval(interval);
  }, [percent, isReady]);

  // Handle completion when website is fully ready AND progress reaches 100%
  useEffect(() => {
    if (isReady && displayPercent >= 100) {
      const now = Date.now();
      const elapsed = startTimeRef.current ? (now - startTimeRef.current) : 1200;
      const minDuration = 1200; // Guarantee animation is visible for at least ~1.2s
      const remainingTime = Math.max(0, minDuration - elapsed);

      const t1 = setTimeout(() => {
        setSunFadeOut(true);
        if (onComplete) {
          onComplete();
        }
      }, remainingTime + 450); // Hold at 100% "Sun rises over Modhera."

      const t2 = setTimeout(() => {
        setVisible(false);
      }, remainingTime + 1250); // Complete smooth fade transition

      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
      };
    }
  }, [isReady, displayPercent, onComplete]);

  if (!visible) return null;

  return (
    <motion.div
      className="preloader-fullscreen-overlay"
      initial={{ opacity: 1 }}
      animate={{ opacity: sunFadeOut ? 0 : 1 }}
      transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
      style={{
        position: 'fixed',
        inset: 0,
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100vw',
        height: '100vh',
        minHeight: '100dvh',
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
      <div
        style={{
          width: '100%',
          height: '100%',
          minHeight: '100dvh',
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
            width: '100%',
            maxWidth: '340px', 
            padding: '0 20px',
            margin: 'auto 0',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {/* Sacred Sun Geometry SVG with Glow and Rotation */}
          <div 
            className="sun-svg-wrapper" 
            style={{ 
              position: 'relative', 
              width: '116px', 
              height: '116px', 
              margin: '0 auto 20px' 
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

          {/* Modhera Sunrise Heading */}
          <h2
            style={{
              fontFamily: 'var(--font-headings, "Playfair Display", serif)',
              fontSize: 'clamp(1.75rem, 5vw, 1.95rem)',
              color: 'var(--color-primary-dark, #1B382B)',
              fontWeight: '400',
              fontStyle: 'italic',
              marginBottom: '6px',
              letterSpacing: '0.02em',
              lineHeight: 1.2
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
              marginBottom: '18px',
              transition: 'color 0.3s ease'
            }}
          >
            {sunMessage}
          </p>

          {/* Progress Bar Track */}
          <div
            style={{
              width: '220px',
              maxWidth: '80%',
              height: '3px',
              backgroundColor: 'rgba(30, 91, 58, 0.12)',
              borderRadius: '3px',
              overflow: 'hidden',
              position: 'relative',
              marginBottom: '8px'
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

        {/* Experience Initializing Text at bottom center (consistent across mobile & desktop) */}
        <motion.div
          initial={{ opacity: 0, y: 6, x: '-50%' }}
          animate={{ opacity: 1, y: 0, x: '-50%' }}
          transition={{ duration: 0.7, delay: 0.2 }}
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
      </div>

      {/* Embedded Styles for Sun Animation */}
      <style>{`
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

