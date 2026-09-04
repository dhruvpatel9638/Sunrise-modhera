import React, { useState, useEffect, useRef } from 'react';

export default function SunCursor() {
  const [isHovered, setIsHovered] = useState(false);
  const [isOverInput, setIsOverInput] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const dotRef = useRef(null);
  const haloRef = useRef(null);
  const mousePos = useRef({ x: -100, y: -100 });
  const trailPos = useRef({ x: -100, y: -100 });
  const isVisibleRef = useRef(false);

  useEffect(() => {
    let animationFrameId;

    const onMouseMove = (e) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
      if (!isVisibleRef.current) {
        isVisibleRef.current = true;
        setIsVisible(true);
        document.body.classList.add('has-custom-cursor');
      }
    };

    const onTouchStart = () => {
      // Hide custom cursor on touch tap so it does not obstruct touch UI
      if (isVisibleRef.current) {
        isVisibleRef.current = false;
        setIsVisible(false);
        document.body.classList.remove('has-custom-cursor');
      }
    };

    const onMouseLeave = () => {
      if (isVisibleRef.current) {
        isVisibleRef.current = false;
        setIsVisible(false);
        document.body.classList.remove('has-custom-cursor');
      }
    };

    const onMouseEnter = () => {
      isVisibleRef.current = true;
      setIsVisible(true);
      document.body.classList.add('has-custom-cursor');
    };

    const onMouseOver = (e) => {
      const target = e.target;
      if (!target) return;

      const isInteractive = 
        target.tagName === 'A' ||
        target.tagName === 'BUTTON' ||
        target.closest('a') ||
        target.closest('button') ||
        target.closest('.btn') ||
        target.closest('.clickable') ||
        target.closest('.hero-pill-btn') ||
        target.closest('.mobile-nav-item') ||
        target.closest('.amenity-card') ||
        target.closest('.room-card') ||
        target.closest('.gallery-item') ||
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

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('mouseover', onMouseOver, { passive: true });
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('mouseenter', onMouseEnter);

    // Smooth RAF loop for direct transform updates - 60fps buttery smooth with zero React state overhead
    const renderLoop = () => {
      // Damping coefficient 0.18 makes outer solar rays lag with celestial elegance
      const dx = mousePos.current.x - trailPos.current.x;
      const dy = mousePos.current.y - trailPos.current.y;
      trailPos.current.x += dx * 0.18;
      trailPos.current.y += dy * 0.18;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mousePos.current.x}px, ${mousePos.current.y}px, 0) translate(-50%, -50%)`;
      }
      if (haloRef.current) {
        haloRef.current.style.transform = `translate3d(${trailPos.current.x}px, ${trailPos.current.y}px, 0) translate(-50%, -50%)`;
      }

      animationFrameId = requestAnimationFrame(renderLoop);
    };

    animationFrameId = requestAnimationFrame(renderLoop);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('mouseover', onMouseOver);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseenter', onMouseEnter);
      cancelAnimationFrame(animationFrameId);
      document.body.classList.remove('has-custom-cursor');
    };
  }, []);

  return (
    <div 
      className="custom-sun-cursor" 
      style={{ 
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 99999999,
        opacity: isVisible && !isOverInput ? 1 : 0,
        transition: 'opacity 0.25s ease-in-out'
      }}
    >
      {/* Sun Core (Center Dot) */}
      <div
        ref={dotRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: isHovered ? '6px' : '8px',
          height: isHovered ? '6px' : '8px',
          backgroundColor: 'var(--color-gold)',
          borderRadius: '50%',
          pointerEvents: 'none',
          boxShadow: isHovered ? '0 0 16px var(--color-gold)' : '0 0 8px var(--color-gold)',
          transition: 'width 0.2s ease, height 0.2s ease, box-shadow 0.2s ease',
          willChange: 'transform'
        }}
      />

      {/* Sun Rays Halo */}
      <div
        ref={haloRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: isHovered ? '48px' : '32px',
          height: isHovered ? '48px' : '32px',
          pointerEvents: 'none',
          transition: 'width 0.3s cubic-bezier(0.25, 1, 0.5, 1), height 0.3s cubic-bezier(0.25, 1, 0.5, 1)',
          willChange: 'transform'
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
