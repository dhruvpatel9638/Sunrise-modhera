import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import amyaLogo from '../assets/Amya LOGO png.png';
import parchmentBg from '../assets/parchment_texture.jpg';

export default function SunPreloader({ percent, isReady }) {
  const [fadeStarted, setFadeStarted] = useState(false);
  const [visible, setVisible] = useState(true);
  const [minTimeElapsed, setMinTimeElapsed] = useState(false);

  // Guarantee display duration so user experiences the complete luxury sequence
  useEffect(() => {
    const timer = setTimeout(() => {
      setMinTimeElapsed(true);
    }, 2400);
    return () => clearTimeout(timer);
  }, []);

  // Smooth fade out when ready
  useEffect(() => {
    if (isReady && minTimeElapsed) {
      const timer1 = setTimeout(() => {
        setFadeStarted(true);
      }, 300);

      const timer2 = setTimeout(() => {
        setVisible(false);
      }, 1100);

      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
      };
    }
  }, [isReady, minTimeElapsed]);

  if (!visible) return null;

  return (
    <motion.div
      className="amya-preloader-overlay"
      initial={{ opacity: 1 }}
      animate={{ opacity: fadeStarted ? 0 : 1 }}
      transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: '#F8F5EE',
        /* Overlay an 80% opaque cream color to make the parchment texture appear at 20% opacity */
        backgroundImage: `linear-gradient(rgba(248, 245, 238, 0.8), rgba(248, 245, 238, 0.8)), url(${parchmentBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 999999,
        pointerEvents: (isReady && minTimeElapsed) ? 'none' : 'all'
      }}
    >
      {/* Central Content Container */}
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
        {/* Logo Container with Smooth Blur & Rise Entrance */}
        <motion.div
          initial={{ opacity: 0, y: 28, filter: 'blur(10px)', scale: 0.95 }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)', scale: 1 }}
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
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
              mixBlendMode: 'multiply' /* Blends white PNG background seamlessly into parchment */
            }}
          />
        </motion.div>

        {/* Webapp Crafted with Love Text */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
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
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
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
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.4 }}
        style={{
          position: 'absolute',
          bottom: '36px',
          left: '50%',
          transform: 'translateX(-50%)',
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

      {/* Keyframe Animation for Single Ring Spinner */}
      <style>{`
        @keyframes amyaSingleSpin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </motion.div>
  );
}




