import React from 'react';
import { ArrowRight } from 'lucide-react';

export default function Hero({ logoStage }) {
  const isFinished = logoStage === 'finished';
  return (
    <section id="hero" className="hero">
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
