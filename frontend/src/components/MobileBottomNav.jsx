import React, { useEffect, useState } from 'react';
import { Home, Bed, Leaf, Map } from 'lucide-react';

export default function MobileBottomNav({ logoStage }) {
  const [activeTab, setActiveTab] = useState('home');

  useEffect(() => {
    const sections = ['hero', 'accommodations', 'amenities', 'transit'];
    const observers = [];

    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          if (id === 'hero') setActiveTab('home');
          else if (id === 'accommodations') setActiveTab('rooms');
          else if (id === 'amenities') setActiveTab('amenities');
          else if (id === 'transit') setActiveTab('location');
        }
      });
    };

    const observerOptions = {
      root: null,
      rootMargin: '-40% 0px -40% 0px', // Trigger when section is in middle of viewport
      threshold: 0
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const handleNavClick = (e, targetId, tabName) => {
    e.preventDefault();
    setActiveTab(tabName);
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav 
      className="mobile-bottom-nav"
      style={{
        opacity: logoStage === 'finished' ? 1 : 0,
        transition: 'opacity 0.8s ease-in-out',
        pointerEvents: logoStage === 'finished' ? 'auto' : 'none'
      }}
    >
      <a
        href="#hero"
        onClick={(e) => handleNavClick(e, 'hero', 'home')}
        className={`mobile-nav-item ${activeTab === 'home' ? 'active' : ''}`}
      >
        <Home size={20} />
        <span>Home</span>
      </a>

      <a
        href="#accommodations"
        onClick={(e) => handleNavClick(e, 'accommodations', 'rooms')}
        className={`mobile-nav-item ${activeTab === 'rooms' ? 'active' : ''}`}
      >
        <Bed size={20} />
        <span>Rooms</span>
      </a>

      <a
        href="#amenities"
        onClick={(e) => handleNavClick(e, 'amenities', 'amenities')}
        className={`mobile-nav-item ${activeTab === 'amenities' ? 'active' : ''}`}
      >
        <Leaf size={20} />
        <span>Amenities</span>
      </a>

      <a
        href="#transit"
        onClick={(e) => handleNavClick(e, 'transit', 'location')}
        className={`mobile-nav-item ${activeTab === 'location' ? 'active' : ''}`}
      >
        <Map size={20} />
        <span>Location</span>
      </a>
    </nav>
  );
}
