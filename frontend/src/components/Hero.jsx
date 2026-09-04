import React from 'react';
import { motion } from 'framer-motion';
import heroVideo from '../assets/WhatsApp Video 2026-06-14 at 8.58.31 AM.mp4';

export default function Hero({ logoStage }) {
  const isFinished = logoStage === 'finished';

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.18,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 1.1,
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
          className="hero-content editorial-layout layout-left"
          variants={containerVariants}
          initial="hidden"
          animate={isFinished ? "visible" : "hidden"}
          style={{ pointerEvents: isFinished ? 'auto' : 'none' }}
        >
          {/* Vertical decorative editorial sidebar */}
          <span className="editorial-sidebar left-side">NATURE SANCTUARY</span>

          <motion.span className="hero-eyebrow" variants={itemVariants}>
            01 / THE FOREST CANOPY
          </motion.span>

          <motion.h1 className="hero-title" variants={itemVariants}>
            Breathe <em>the quiet</em><br />
            of nature.
          </motion.h1>

          <motion.p className="hero-copy" variants={itemVariants}>
            Where the green canopy whispers stories of ancient Modhera. Wake up to a symphony of peacocks under dense green boughs, where time slows down to a gentle heartbeat.
          </motion.p>

          <motion.div className="hero-cta-container" variants={itemVariants}>
            <a href="#accommodations" className="hero-pill-btn">
              OUR OFFERS
            </a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
