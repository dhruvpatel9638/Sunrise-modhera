import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import logoGreen from '../assets/logo_green.png';
import logoWhite from '../assets/logo_white.png';

export default function Navbar({ isAdminMode = false, activeTab = 'bookings', setActiveTab }) {
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
    return () => window.removeEventListener('scroll', handleScroll);
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
          <img src={logoWhite} alt="Modhera Sunrise Logo" className="logo-img" />
        </a>

        {/* Desktop Menu */}
        <div className="nav-links">
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
              <a href="#booking" className="btn btn-primary" onClick={(e) => handleNavClick(e, 'booking')}>
                Plan Your Outing
              </a>
            </>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <button className="mobile-menu-btn" onClick={toggleMobileMenu}>
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div 
          style={{
            position: 'fixed',
            top: '70px',
            left: 0,
            width: '100%',
            background: 'var(--color-primary-dark)',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
            boxShadow: 'var(--shadow-lg)',
            borderBottom: '2px solid var(--color-gold)',
            zIndex: 999,
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
                className="btn btn-primary" 
                onClick={(e) => handleNavClick(e, 'booking')}
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
