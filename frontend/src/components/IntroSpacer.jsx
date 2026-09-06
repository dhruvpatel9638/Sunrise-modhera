import React, { useEffect, useRef, useState } from 'react';

export default function IntroSpacer() {
  const containerRef = useRef(null);
  const [activeSlide, setActiveSlide] = useState(-1);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const elementHeight = rect.height;
      const windowHeight = window.innerHeight;

      // If user is still at Hero and hasn't reached IntroSpacer yet
      if (rect.top > windowHeight * 0.45) {
        setActiveSlide(-1);
        return;
      }

      // Scroll progress tracking inside the spacer container
      const totalScrollable = elementHeight - windowHeight;
      const scrolled = -rect.top;

      if (totalScrollable <= 0) {
        setActiveSlide(0);
        return;
      }
      const progress = Math.min(Math.max(scrolled / totalScrollable, 0), 1);

      // Distribute the 4 slides across scroll segments
      if (progress < 0.25) {
        setActiveSlide(0);
      } else if (progress < 0.50) {
        setActiveSlide(1);
      } else if (progress < 0.75) {
        setActiveSlide(2);
      } else {
        setActiveSlide(3);
      }
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleScroll);
    
    // Initial check
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  return (
    <section ref={containerRef} className="intro-spacer-section">
      <div className="intro-sticky-container">
        
        {/* Right-side vertical diamond progress indicators */}
        <div className="split-indicators">
          <div className="indicator-line" />
          <div className={`indicator-dot ${activeSlide === 0 ? 'active' : ''}`} />
          <div className={`indicator-dot ${activeSlide === 1 ? 'active' : ''}`} />
          <div className={`indicator-dot ${activeSlide === 2 ? 'active' : ''}`} />
          <div className={`indicator-dot ${activeSlide === 3 ? 'active' : ''}`} />
          <div className="indicator-line" />
        </div>

        {/* Slide 0: Split Screen Layout (Frosted Glass Panel) */}
        <div className={`intro-slide ${activeSlide === 0 ? 'active' : ''}`} style={{ padding: 0 }}>
          <div className="split-screen-container">
            {/* Frosted glass left panel */}
            <div className="split-left-panel">


              <div className="split-content">
                <span className="split-subtitle">AMAZING HOLIDAYS</span>
                <div className="split-title-wrap">
                  <h2 className="split-title">
                    <span className="masked-text">SACRED </span>
                    <span className="white-text">SUNRISE</span>
                  </h2>
                </div>
                <p className="split-desc">
                  There is a peace that settles in the heart when the morning sun 
                  reflects off the river, signaling the start of a perfect holiday.
                </p>
                <div className="split-cta-btn">LEARN MORE</div>
              </div>
            </div>

            {/* Clear right panel where background canvas animation shows through */}
            <div className="split-right-panel" />


          </div>
        </div>

        {/* Slide 1: Nature Sanctuary (Left Aligned Layout) */}
        <div className={`intro-slide ${activeSlide === 1 ? 'active' : ''}`}>
          <div className="editorial-layout layout-left">
            <span className="editorial-sidebar left-side">NATURE SANCTUARY</span>
            <span className="editorial-subtitle">01 / THE FOREST CANOPY</span>
            <h2 className="editorial-title">
              Breathe <em>the quiet</em><br />
              of nature.
            </h2>
            <p className="editorial-paragraph">
              Where the green canopy whispers stories of the ancient wind. Wake up to a 
              symphony of peacocks under dense green boughs, where time slows down 
              to a gentle heartbeat.
            </p>
          </div>
        </div>

        {/* Slide 2: Sacred Sun & River (Right Aligned Layout) */}
        <div className={`intro-slide ${activeSlide === 2 ? 'active' : ''}`}>
          <div className="editorial-layout layout-right">
            <span className="editorial-sidebar right-side">SACRED PUSHPAVATI</span>
            <span className="editorial-subtitle">02 / RIVERSIDE RETREAT</span>
            <h2 className="editorial-title">
              Bathe <em>in sacred</em><br />
              light.
            </h2>
            <p className="editorial-paragraph">
              Watch the sun rise over the gentle curves of the Pushpavati River. As 
              the golden rays touch the ancient Sun Temple, feel a deep, restorative 
              connection to the earth.
            </p>
          </div>
        </div>

        {/* Slide 3: Holiday Enjoyment (Centered Layout referencing User's Image) */}
        <div className={`intro-slide ${activeSlide === 3 ? 'active' : ''}`}>
          <div className="editorial-layout layout-center">
            <span className="editorial-sidebar left-side" style={{ left: '-6vw' }}>
              V5. 11 . 04 . 22
            </span>
            
            <span className="editorial-subtitle">WHY WAIT?</span>
            
            <h2 className="editorial-title" style={{ textTransform: 'uppercase' }}>
              LET'S<br />
              <em>Make</em><br />
              A Start<br />
              Together.
            </h2>

            <div className="editorial-paragraph center-spaced">
              <div style={{ marginBottom: '8px' }}>
                <span>HOWEVER SMALL IT MAY BE —</span>
                <span>WE'D LOVE TO HELP YOU DO SO.</span>
              </div>
              <div style={{ marginBottom: '8px' }}>
                <span>TAP THE</span>
                <span>BOOKING BUTTON AND LET'S MAKE YOUR</span>
              </div>
              <div>
                <span>FIRST STEPS</span>
                <span>TOGETHER.</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
