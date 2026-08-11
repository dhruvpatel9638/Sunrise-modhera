import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import heroVideo from '../assets/WhatsApp Video 2026-06-14 at 8.58.31 AM.mp4';

export default function Hero({ logoStage }) {
  const isFinished = logoStage === 'finished';

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.25,
        delayChildren: 0.1
      }
    }
  };

  const titleVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 1.5,
        ease: [0.16, 1, 0.3, 1]
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 1.2,
        ease: [0.16, 1, 0.3, 1]
      }
    }
  };

  return (
    <section id="hero" className="hero" style={{ position: 'relative' }}>
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          zIndex: 1,
          pointerEvents: 'none'
        }}
      >
        <source src={heroVideo} type="video/mp4" />
      </video>

      {/* Dark Green Scrim overlay */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'var(--color-overlay-hero)',
          zIndex: 1,
          pointerEvents: 'none'
        }}
      />

      <div className="container" style={{ position: 'relative', zIndex: 2 }}>
        <motion.div
          className="hero-content"
          variants={containerVariants}
          initial="hidden"
          animate={isFinished ? "visible" : "hidden"}
          style={{ pointerEvents: isFinished ? 'auto' : 'none' }}
        >
          <motion.h1 className="hero-title" variants={titleVariants}>
            Come,<br />
            experience a<br />
            new morning in<br />
            nature's<br />
            embrace
          </motion.h1>
        </motion.div>
      </div>
    </section>
  );
}
