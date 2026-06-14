import React from 'react';
import { ArrowRight } from 'lucide-react';
import heroVideo from '../assets/WhatsApp Video 2026-06-14 at 8.58.31 AM.mp4';

export default function Hero({ logoStage }) {
  const isFinished = logoStage === 'finished';
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
          backgroundColor: 'var(--color-overlay-hero)', // rgba(12, 31, 18, 0.65)
          zIndex: 1,
          pointerEvents: 'none'
        }}
      />

      <div className="container" style={{ position: 'relative', zIndex: 2 }}>
        <div 
          className="hero-content"
          style={isFinished ? {} : { opacity: 0, transform: 'translateY(20px)', animation: 'none', pointerEvents: 'none' }}
        >
          
          <h1 className="hero-title">
            Come,<br />
            experience a<br />
            new morning in<br />
            nature's<br />
            embrace
          </h1>

          <p className="hero-copy">
            A heritage-rural sanctuary where ancient<br />
            architecture meets organic tranquility.
          </p>

          <div className="hero-cta-container">
            <a href="#booking" className="btn btn-primary hero-btn">
              Discover Your Sanctuary <ArrowRight size={16} />
            </a>
          </div>

        </div>
      </div>
    </section>
  );
}
