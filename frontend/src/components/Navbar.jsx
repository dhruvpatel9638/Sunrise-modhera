import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import logoGreen from '../assets/logo_green.png';
import logoWhite from '../assets/logo_white.png';

export default function Navbar({ isAdminMode = false, activeTab = 'bookings', setActiveTab, logoStage }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    
    const handleResize = () => {
      if (window.innerWidth > 1024) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const handleNavClick = (e, targetId) => {
    e.preventDefault();
    closeMobileMenu();
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      // Update URL hash quietly without triggering window hashchange event re-renders
      window.history.pushState(null, null, `#${targetId}`);
    } else {
      // If we are on a separate page (like #booking) and the element doesn't exist, go to home
      window.location.hash = '';
      setTimeout(() => {
        const el = document.getElementById(targetId);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="container">
        <a href="#hero" className="nav-logo" onClick={(e) => handleNavClick(e, 'hero')}>
          <img 
            id="nav-logo-img"
            src={logoWhite} 
            alt="Modhera Sunrise Logo" 
            className="logo-img" 
            style={{ 
              opacity: logoStage === 'finished' ? 1 : 0,
              transition: 'opacity 0.25s ease'
            }}
          />
        </a>

        {/* Desktop Menu */}
        <div 
          className="nav-links"
          style={{
            opacity: logoStage === 'finished' ? 1 : 0,
            transition: 'opacity 0.8s ease-in-out',
            pointerEvents: logoStage === 'finished' ? 'auto' : 'none'
          }}
        >
          {isAdminMode ? (
            <>
              <button 
                onClick={() => setActiveTab('bookings')} 
                className={`nav-link-btn ${activeTab === 'bookings' ? 'active' : ''}`}
              >
                Bookings
              </button>
              <button 
                onClick={() => setActiveTab('inquiries')} 
                className={`nav-link-btn ${activeTab === 'inquiries' ? 'active' : ''}`}
              >
                Inquiries
              </button>
              <button 
                onClick={() => setActiveTab('reviews')} 
                className={`nav-link-btn ${activeTab === 'reviews' ? 'active' : ''}`}
              >
                Reviews
              </button>
            </>
          ) : (
            <>
              <a href="#hero" className="nav-link" onClick={(e) => handleNavClick(e, 'hero')}>Home</a>
              <a href="#accommodations" className="nav-link" onClick={(e) => handleNavClick(e, 'accommodations')}>Accommodations</a>
              <a href="#amenities" className="nav-link" onClick={(e) => handleNavClick(e, 'amenities')}>Amenities</a>
              <a href="#dining" className="nav-link" onClick={(e) => handleNavClick(e, 'dining')}>Dining</a>
              <a href="#gallery" className="nav-link" onClick={(e) => handleNavClick(e, 'gallery')}>Gallery</a>
              <a href="#reviews" className="nav-link" onClick={(e) => handleNavClick(e, 'reviews')}>Reviews</a>
              <a href="#inquiry" className="nav-link" onClick={(e) => handleNavClick(e, 'inquiry')}>Contact</a>
              <a href="#booking" className="nav-cta-btn" onClick={closeMobileMenu}>
                Plan Your Outing
              </a>
            </>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <button 
          className="mobile-menu-btn" 
          onClick={toggleMobileMenu}
          style={{
            opacity: logoStage === 'finished' ? 1 : 0,
            transition: 'opacity 0.8s ease-in-out',
            pointerEvents: logoStage === 'finished' ? 'auto' : 'none'
          }}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div 
          className="mobile-nav-drawer"
          style={{
            position: 'fixed',
            top: '68px',
            left: 0,
            width: '100%',
            background: 'rgba(18, 42, 25, 0.98)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            padding: '24px 28px',
            display: 'flex',
            flexDirection: 'column',
            gap: '18px',
            boxShadow: '0 16px 36px rgba(0, 0, 0, 0.4)',
            borderBottom: '2px solid var(--color-gold)',
            zIndex: 9999,
            maxHeight: 'calc(100vh - 68px)',
            overflowY: 'auto'
          }}
        >
          {isAdminMode ? (
            <>
              <button 
                onClick={() => { setActiveTab('bookings'); closeMobileMenu(); }} 
                className={`nav-link-btn ${activeTab === 'bookings' ? 'active' : ''}`}
                style={{ color: '#FFFFFF', textAlign: 'left' }}
              >
                Bookings
              </button>
              <button 
                onClick={() => { setActiveTab('inquiries'); closeMobileMenu(); }} 
                className={`nav-link-btn ${activeTab === 'inquiries' ? 'active' : ''}`}
                style={{ color: '#FFFFFF', textAlign: 'left' }}
              >
                Inquiries
              </button>
              <button 
                onClick={() => { setActiveTab('reviews'); closeMobileMenu(); }} 
                className={`nav-link-btn ${activeTab === 'reviews' ? 'active' : ''}`}
                style={{ color: '#FFFFFF', textAlign: 'left' }}
              >
                Reviews
              </button>
            </>
          ) : (
            <>
              <a href="#hero" className="nav-link" onClick={(e) => handleNavClick(e, 'hero')}>Home</a>
              <a href="#accommodations" className="nav-link" onClick={(e) => handleNavClick(e, 'accommodations')}>Accommodations</a>
              <a href="#amenities" className="nav-link" onClick={(e) => handleNavClick(e, 'amenities')}>Amenities</a>
              <a href="#dining" className="nav-link" onClick={(e) => handleNavClick(e, 'dining')}>Dining</a>
              <a href="#gallery" className="nav-link" onClick={(e) => handleNavClick(e, 'gallery')}>Gallery</a>
              <a href="#reviews" className="nav-link" onClick={(e) => handleNavClick(e, 'reviews')}>Reviews</a>
              <a href="#inquiry" className="nav-link" onClick={(e) => handleNavClick(e, 'inquiry')}>Contact</a>
              <a 
                href="#booking"
                className="nav-cta-btn" 
                onClick={closeMobileMenu}
                style={{ width: '100%', justifyContent: 'center', textAlign: 'center' }}
              >
                Plan Your Outing
              </a>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
