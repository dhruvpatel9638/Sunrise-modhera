import React, { useEffect, useState } from 'react';

const LOADING_MESSAGES = [
  { max: 25, text: "Greeting the morning horizon..." },
  { max: 50, text: "Channelling the Temple's solar rays..." },
  { max: 75, text: "Gathering riverside tranquility..." },
  { max: 99, text: "Awakening the sanctuary..." },
  { max: 100, text: "Sun rises over Modhera." }
];

export default function SunPreloader({ percent, isReady }) {
  const [fadeStarted, setFadeStarted] = useState(false);
  const [visible, setVisible] = useState(true);
  const [message, setMessage] = useState("Invoking sunrise...");

  // Select message based on current load percent
  useEffect(() => {
    const matched = LOADING_MESSAGES.find(m => percent <= m.max);
    if (matched) {
      setMessage(matched.text);
    }
  }, [percent]);

  // Handle smooth fade out when app is ready
  useEffect(() => {
    if (isReady) {
      // Small delay for the 100% state to be visible
      const timer1 = setTimeout(() => {
        setFadeStarted(true);
      }, 600);

      // Remove from DOM after transition completes
      const timer2 = setTimeout(() => {
        setVisible(false);
      }, 1400); // 600ms delay + 800ms transition time

      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
      };
    }
  }, [isReady]);

  if (!visible) return null;

  return (
    <div
      className={`sun-preloader-overlay ${fadeStarted ? 'fade-out' : ''}`}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: '#F8F4ED', // Warm ivory background
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 99999,
        transition: 'opacity 0.8s ease-in-out',
        pointerEvents: isReady ? 'none' : 'all'
      }}
    >
      <div className="sun-loader-container" style={{ textAlign: 'center', maxWidth: '320px', padding: '20px' }}>
        {/* Sacred Sun Geometry SVG */}
        <div className="sun-svg-wrapper" style={{ position: 'relative', width: '120px', height: '120px', margin: '0 auto 28px' }}>
          {/* Animated Glow behind the sun */}
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
              fill="var(--color-gold)"
              className="sun-core-pulse"
            />
            {/* Outer Rotating Rays */}
            <g className="sun-rays-rotate" style={{ transformOrigin: '50px 50px' }}>
              {[...Array(12)].map((_, i) => {
                const angle = (i * 360) / 12;
                return (
                  <path
                    key={i}
                    d="M 50 16 L 53 28 L 47 28 Z"
                    fill="var(--color-gold-light)"
                    transform={`rotate(${angle} 50 50)`}
                    style={{ opacity: 0.9 }}
                  />
                );
              })}
              {/* Secondary offset minor rays */}
              {[...Array(12)].map((_, i) => {
                const angle = (i * 360) / 12 + 15;
                return (
                  <path
                    key={i}
                    d="M 50 22 L 52 30 L 48 30 Z"
                    fill="var(--color-gold)"
                    transform={`rotate(${angle} 50 50)`}
                    style={{ opacity: 0.7 }}
                  />
                );
              })}
            </g>
          </svg>
        </div>

        {/* Dynamic Typography */}
        <h2
          style={{
            fontFamily: 'var(--font-headings)',
            fontSize: '1.8rem',
            color: 'var(--color-primary-dark)',
            fontWeight: '400',
            fontStyle: 'italic',
            marginBottom: '8px'
          }}
        >
          Modhera Sunrise
        </h2>

        <p
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '0.85rem',
            color: 'var(--color-text-muted-light)',
            letterSpacing: '0.05em',
            minHeight: '20px',
            marginBottom: '20px',
            transition: 'color 0.3s ease'
          }}
        >
          {message}
        </p>

        {/* Progress Bar & Percentage */}
        <div style={{ width: '100%', height: '3px', backgroundColor: 'rgba(30, 91, 58, 0.1)', borderRadius: '3px', overflow: 'hidden', position: 'relative', marginBottom: '8px' }}>
          <div
            style={{
              height: '100%',
              width: `${percent}%`,
              backgroundColor: 'var(--color-gold)',
              boxShadow: '0 0 8px var(--color-gold)',
              transition: 'width 0.2s ease-out'
            }}
          />
        </div>

        <div
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '0.75rem',
            fontWeight: '600',
            color: 'var(--color-gold-light)',
            letterSpacing: '0.1em'
          }}
        >
          {percent}%
        </div>
      </div>
    </div>
  );
}
