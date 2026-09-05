import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import heroVideo from '../assets/WhatsApp Video 2026-06-14 at 8.58.31 AM.mp4';

export default function Hero({ logoStage }) {
  const isFinished = logoStage === 'finished';
  const videoRef = useRef(null);
  const hasStartedRef = useRef(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (!isFinished) {
      // Pause video while preloader and intro logo animation are active
      video.pause();
      try {
        video.currentTime = 0;
      } catch (e) {}
      return;
    }

    // When logoStage finishes and hero page is entered, start the video from beginning
    try {
      video.currentTime = 0;
    } catch (e) {}
    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.catch((err) => {
        console.warn("Video playback was prevented:", err);
      });
    }
    hasStartedRef.current = true;

    // IntersectionObserver to restart/resume video whenever entering the hero section
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && entry.intersectionRatio > 0.25) {
          if (!hasStartedRef.current) {
            try {
              video.currentTime = 0;
            } catch (e) {}
          }
          const p = video.play();
          if (p !== undefined) p.catch(() => {});
          hasStartedRef.current = true;
        } else if (!entry.isIntersecting) {
          hasStartedRef.current = false;
          video.pause();
        }
      },
      { threshold: [0, 0.25, 0.6] }
    );

    const heroSection = document.getElementById('hero');
    if (heroSection) {
      observer.observe(heroSection);
    }

    return () => {
      observer.disconnect();
    };
  }, [isFinished]);

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
        ref={videoRef}
        loop
        muted
        playsInline
        preload="auto"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          width: '100%',
          height: '100%',
          minWidth: '100%',
          minHeight: '100%',
          objectFit: 'cover',
          objectPosition: 'center center',
          zIndex: 1,
          pointerEvents: 'none',
          display: 'block'
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
          right: 0,
          bottom: 0,
          width: '100%',
          height: '100%',
          minWidth: '100%',
          minHeight: '100%',
          backgroundColor: 'var(--color-overlay-hero)',
          zIndex: 1,
          pointerEvents: 'none'
        }}
      />

      {/* Bottom seamless blend to eliminate any gap or sharp angle at bottom corners */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          width: '100%',
          height: '120px',
          background: 'linear-gradient(to bottom, transparent 0%, rgba(12, 31, 18, 0.7) 65%, var(--color-bg-dark) 100%)',
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
