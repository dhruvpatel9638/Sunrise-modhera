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

      {/* Nature Green Gradient Overlay (Top to Bottom) */}
      <div
        className="hero-nature-green-overlay"
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
          background: 'linear-gradient(to bottom, rgba(18, 48, 28, 0.55) 0%, rgba(28, 72, 42, 0.32) 35%, rgba(30, 75, 45, 0.12) 65%, transparent 95%)',
          zIndex: 1,
          pointerEvents: 'none'
        }}
      />

      <div className="container hero-left-container" style={{ position: 'relative', zIndex: 2 }}>
        <motion.div
          className="hero-content-left"
          variants={containerVariants}
          initial="hidden"
          animate={isFinished ? "visible" : "hidden"}
          style={{ pointerEvents: isFinished ? 'auto' : 'none' }}
        >
          {/* Eyebrow Tag */}
          <motion.span className="hero-eyebrow" variants={itemVariants}>
            01 / THE FOREST CANOPY
          </motion.span>

          {/* Left-Aligned Title */}
          <motion.h1 className="hero-title" variants={itemVariants}>
            Where SUN<br />
            <em>meet</em><br />
            SOUL.
          </motion.h1>

          {/* Subtitle / Body text */}
          <motion.p className="hero-copy" variants={itemVariants}>
            Nestled in the heart of nature, Sunrise Resort Modhera is where golden mornings meet green serenity — a retreat crafted for those who believe rest is sacred.
          </motion.p>

          {/* Restored OUR OFFERS Pill Button */}
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
