import React, { useState, useEffect } from 'react';

export default function SunCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [trailPosition, setTrailPosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [isOverInput, setIsOverInput] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if device supports a fine pointer (mouse)
    const mediaQuery = window.matchMedia('(pointer: fine)');
    if (!mediaQuery.matches) return;

    const handleMouseMove = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseEnter = () => setIsVisible(true);
    const handleMouseLeave = () => setIsVisible(false);

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('mouseleave', handleMouseLeave);

    // Dynamic hover states for all interactive elements
    const handleMouseOver = (e) => {
      const target = e.target;
      if (!target) return;

      const isInteractive = 
        target.tagName === 'A' ||
        target.tagName === 'BUTTON' ||
        target.closest('a') ||
        target.closest('button') ||
        target.closest('.btn') ||
        target.closest('.clickable') ||
        target.closest('.mobile-nav-item') ||
        window.getComputedStyle(target).cursor === 'pointer';

      const isTextInput = 
        (target.tagName === 'INPUT' && !['submit', 'button', 'checkbox', 'radio'].includes(target.type)) ||
        target.tagName === 'TEXTAREA' ||
        target.tagName === 'SELECT' ||
        target.closest('input:not([type="submit"]):not([type="button"]):not([type="checkbox"]):not([type="radio"])') ||
        target.closest('textarea') ||
        target.closest('select');

      setIsHovered(!!isInteractive);
      setIsOverInput(!!isTextInput);
    };

    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, [isVisible]);

  // Smooth trail calculation for the outer sun rays halo
  useEffect(() => {
    // Active only when custom cursor is visible
    if (!isVisible) return;

    let animationFrameId;
    
    const updateTrail = () => {
      setTrailPosition((prev) => {
        const dx = position.x - prev.x;
        const dy = position.y - prev.y;
        // Damping coefficient 0.15 makes the outer rays lag elegantly
        return {
          x: prev.x + dx * 0.15,
          y: prev.y + dy * 0.15
        };
      });
      animationFrameId = requestAnimationFrame(updateTrail);
    };

    animationFrameId = requestAnimationFrame(updateTrail);
    return () => cancelAnimationFrame(animationFrameId);
  }, [position, isVisible]);

  if (!isVisible) return null;

  return (
    <div 
      className="custom-sun-cursor" 
      style={{ 
        pointerEvents: 'none',
        opacity: isOverInput ? 0 : 1,
        transition: 'opacity 0.2s ease-in-out'
      }}
    >
      {/* Sun Core (Center Dot) */}
      <div
        style={{
          position: 'fixed',
          left: position.x,
          top: position.y,
          width: isHovered ? '6px' : '8px',
          height: isHovered ? '6px' : '8px',
          backgroundColor: 'var(--color-gold)',
          borderRadius: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 999999,
          pointerEvents: 'none',
          boxShadow: isHovered ? '0 0 14px var(--color-gold)' : '0 0 8px var(--color-gold)',
          transition: 'width 0.2s ease, height 0.2s ease, box-shadow 0.2s ease'
        }}
      />

      {/* Sun Rays Halo */}
      <div
        style={{
          position: 'fixed',
          left: trailPosition.x,
          top: trailPosition.y,
          width: isHovered ? '48px' : '32px',
          height: isHovered ? '48px' : '32px',
          transform: 'translate(-50%, -50%)',
          zIndex: 999998,
          pointerEvents: 'none',
          transition: 'width 0.3s cubic-bezier(0.25, 1, 0.5, 1), height 0.3s cubic-bezier(0.25, 1, 0.5, 1)'
        }}
      >
        <svg
          viewBox="0 0 100 100"
          style={{
            width: '100%',
            height: '100%',
            animation: isHovered ? 'spin-fast 3s linear infinite' : 'spin-slow 12s linear infinite',
            overflow: 'visible'
          }}
        >
          {/* Inner Dashed Solar Core boundary */}
          <circle
            cx="50"
            cy="50"
            r="28"
            fill="none"
            stroke="var(--color-gold-light)"
            strokeWidth="1.5"
            strokeDasharray="4, 3"
            style={{
              opacity: isHovered ? 0.95 : 0.5,
              transition: 'opacity 0.3s'
            }}
          />
          {/* Sun Rays */}
          {[...Array(8)].map((_, i) => {
            const angle = (i * 360) / 8;
            return (
              <line
                key={i}
                x1="50"
                y1="10"
                x2="50"
                y2="20"
                stroke="var(--color-gold)"
                strokeWidth="4"
                strokeLinecap="round"
                transform={`rotate(${angle} 50 50)`}
                style={{
                  opacity: isHovered ? 1 : 0.65,
                  transition: 'opacity 0.3s'
                }}
              />
            );
          })}
        </svg>
      </div>
    </div>
  );
}
