import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import heroVideo from '../assets/WhatsApp Video 2026-06-14 at 8.58.31 AM.mp4';

export default function Hero({ logoStage }) {
  const isFinished = logoStage === 'finished';
  const videoRef = useRef(null);
  const hasStartedRef = useRef(false);
  const [videoFadedIn, setVideoFadedIn] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (!isFinished) {
      // Pause video while preloader and intro logo animation are active
      video.pause();
      setVideoFadedIn(false);
      try {
        video.currentTime = 0;
      } catch (e) {}
      return;
    }

    // When logoStage finishes and hero page is entered, start the video from beginning with fade-in
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

    // Trigger smooth fade in transition
    const fadeTimer = setTimeout(() => {
      setVideoFadedIn(true);
    }, 100);

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
          setVideoFadedIn(true);
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
      clearTimeout(fadeTimer);
      observer.disconnect();
    };
  }, [isFinished]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.25,
        delayChildren: 0.15
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20, filter: 'blur(12px)' },
    visible: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: {
        duration: 1.8,
        ease: [0.16, 1, 0.3, 1]
      }
    }
  };

  return (
    <section id="hero" className="hero" style={{ position: 'relative', overflow: 'hidden' }}>
      {/* Background Video with Smooth Fade-In */}
      <div
        className="hero-video-wrapper"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          width: '100%',
          height: '100%',
          overflow: 'hidden',
          backgroundColor: '#0a1d11',
          zIndex: 1,
          pointerEvents: 'none'
        }}
      >
        <video
          ref={videoRef}
          loop
          muted
          playsInline
          preload="auto"
          onPlaying={() => setVideoFadedIn(true)}
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
            pointerEvents: 'none',
            display: 'block',
            opacity: isFinished && videoFadedIn ? 1 : 0,
            transition: 'opacity 2.2s cubic-bezier(0.25, 1, 0.5, 1)',
            willChange: 'opacity'
          }}
        >
          <source src={heroVideo} type="video/mp4" />
        </video>
      </div>

      {/* Nature Green Blur Layer in Background */}
      <div
        className="hero-nature-green-blur-overlay"
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
          background: 'rgba(18, 48, 28, 0.28)',
          backdropFilter: 'blur(4px)',
          WebkitBackdropFilter: 'blur(4px)',
          zIndex: 2,
          pointerEvents: 'none'
        }}
      />

      <div className="container hero-left-container" style={{ position: 'relative', zIndex: 3 }}>
        <motion.div
          className="hero-content-left"
          variants={containerVariants}
          initial="hidden"
          animate={isFinished ? "visible" : "hidden"}
          style={{ pointerEvents: isFinished ? 'auto' : 'none' }}
        >
          {/* Left-Aligned Title */}
          <motion.h1 className="hero-title" variants={itemVariants}>
            Where SUN<br />
            <em>meet</em> SOUL.
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
