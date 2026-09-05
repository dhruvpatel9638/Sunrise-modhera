import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ModheraExperience from './components/ModheraExperience';
import Accommodations from './components/Accommodations';
import Amenities from './components/Amenities';
import Dining from './components/Dining';
import Gallery from './components/Gallery';
import Transit from './components/Transit';
import ReviewSection from './components/ReviewSection';
import InquiryForm from './components/InquiryForm';
import Footer from './components/Footer';
import ScrollBackground from './components/ScrollBackground';
import BookingPage from './components/BookingPage';
import IntroSpacer from './components/IntroSpacer';
import AdminPanel from './components/AdminPanel';
import MobileBottomNav from './components/MobileBottomNav';
import SunPreloader from './components/SunPreloader';
import SunCursor from './components/SunCursor';
import LanguageTranslator from './components/LanguageTranslator';
import { roomAPI, reviewAPI } from './utils/api';
import logoWhite from './assets/logo_white.png';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';

const FALLBACK_ROOMS = [
  {
    _id: 'bhunga-01',
    title: "Traditional AC Bhunga (Kutchi Mud Hut)",
    type: "bhunga",
    price: 3200,
    maxGuests: 3,
    size: 380,
    description: "Authentic circular Kutch-style mud house with conical thatched roof. Artfully adorned with traditional hand-crafted mirror-work (lipan kaam), king-size bed, quiet air conditioning, and attached luxury bathroom.",
    amenities: ["Air Conditioning", "King Size Bed", "Lipan Kaam Decor", "Attached Modern Bath", "Garden View", "Complimentary Breakfast", "Free Wi-Fi", "Tea/Coffee Maker"],
    images: [
      "/images/rooms/bhunga_village.jpg",
      "/images/rooms/bhunga_interior.jpg",
      "/images/rooms/resort_pathways.jpg"
    ],
    availableCount: 5
  },
  {
    _id: 'cottage-02',
    title: "Family AC Cottage",
    type: "cottage",
    price: 3800,
    maxGuests: 4,
    size: 480,
    description: "Standalone brick-and-mortar cottage with private sit-out verandah opening directly to lush resort lawns. Equipped with comfortable double bedding, sitting lounge, and modern en-suite amenities.",
    amenities: ["Panoramic Garden Porch", "Air Conditioning", "Double Beds", "Attached Bathroom", "Flat Screen TV", "Mini Fridge", "Free Wi-Fi", "Electric Kettle"],
    images: [
      "/images/rooms/cottage_exterior.jpg",
      "/images/rooms/cottage_interior.jpg",
      "/images/rooms/resort_evening.jpg"
    ],
    availableCount: 4
  },
  {
    _id: 'deluxe-03',
    title: "Deluxe AC Room",
    type: "deluxe",
    price: 2600,
    maxGuests: 2,
    size: 280,
    description: "Well-appointed contemporary resort room offering serene views of surrounding garden pathways. Features a king bed, work desk, silent air conditioning, and spotless private bath.",
    amenities: ["Air Conditioning", "King Bed", "Garden View", "En-suite Bathroom", "Tea/Coffee Maker", "Flat Screen TV", "Free Wi-Fi", "Daily Housekeeping"],
    images: [
      "/images/rooms/deluxe_room_interior.jpg",
      "/images/rooms/garden_fountain.jpg",
      "/images/rooms/village_serene.jpg"
    ],
    availableCount: 6
  },
  {
    _id: 'tent-04',
    title: "Luxury Glamping Tent",
    type: "tent",
    price: 2800,
    maxGuests: 2,
    size: 320,
    description: "Immersive nature-stay canvas tent sheltered under native tree canopies with attached concrete bathroom, hot & cold shower, air cooler/AC, and private wooden sit-out deck for birdwatching.",
    amenities: ["Private Wood Deck", "Attached Bathroom", "Hot & Cold Shower", "Air Cooler/AC", "Nature Canopy", "Complimentary Breakfast", "Morning Birdwatching"],
    images: [
      "https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&w=1000&q=85",
      "https://images.unsplash.com/photo-1526772662000-3f88f10405ff?auto=format&fit=crop&w=1000&q=85",
      "/images/rooms/resort_swing.jpg"
    ],
    availableCount: 6
  }
];

const FALLBACK_REVIEWS = [
  {
    guestName: "Ramesh Patel",
    rating: 5,
    comment: "Unbeatable location! The UNESCO Modhera Sun Temple is literally directly behind the resort. Walking there for the morning sunrise was magical. The Pure Veg Gujarati food was fresh, hot, and highly satisfying. peacocks roam freely in the lawns!",
    date: "May 28, 2026"
  },
  {
    guestName: "Sarah Jenkins",
    rating: 4,
    comment: "We loved staying in the traditional Bhunga. The mirror-work inside is stunning and it stayed cool even during the day. The staff is extremely polite, showing us the local organic farms. Excellent hospitality.",
    date: "May 15, 2026"
  },
  {
    guestName: "Dr. Ananya Mehta",
    rating: 5,
    comment: "Ideal weekend getaway from Ahmedabad (~99 km). Kids loved the swimming pool and play zone. The candlelight dining in the jungle restaurant area was extremely romantic. We requested Jain food and they accommodated us perfectly.",
    date: "April 22, 2026"
  }
];

export default function App() {
  const [rooms, setRooms] = useState(FALLBACK_ROOMS);
  const [reviews, setReviews] = useState(FALLBACK_REVIEWS);
  const [hash, setHash] = useState(window.location.hash);
  const [adminTab, setAdminTab] = useState('bookings');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Global preloader loading state tracking
  const [roomsLoaded, setRoomsLoaded] = useState(false);
  const [reviewsLoaded, setReviewsLoaded] = useState(false);
  const [bgPercent, setBgPercent] = useState(0);
  const [preloaderCompleted, setPreloaderCompleted] = useState(false);

  const [logoStage, setLogoStage] = useState(
    window.location.hash === '#admin' || window.location.hash === '#booking'
      ? 'finished'
      : 'preloader'
  );
  const [logoStyle, setLogoStyle] = useState({});
  const [showFloatingLogo, setShowFloatingLogo] = useState(
    window.location.hash !== '#admin' && window.location.hash !== '#booking'
  );

  // Safety fallback to force load completion if API is slow or hangs
  useEffect(() => {
    const timer = setTimeout(() => {
      setRoomsLoaded(true);
      setReviewsLoaded(true);
      setBgPercent(100);
    }, 7000); // 7 seconds max load safety net
    return () => clearTimeout(timer);
  }, []);

  // Force scroll-to-top and disable native scroll restoration on reload for homepage entrance animation
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);
  }, []);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    window.location.hash = '';
  };

  const fetchRooms = async () => {
    try {
      const response = await roomAPI.getAll();
      if (response.data && response.data.length > 0) {
        setRooms(response.data);
      }
    } catch (error) {
      console.warn('API error fetching rooms, using default local data:', error.message);
    } finally {
      setRoomsLoaded(true);
    }
  };

  const fetchReviews = async () => {
    try {
      const response = await reviewAPI.getAll();
      if (response.data && response.data.length > 0) {
        setReviews(response.data);
      }
    } catch (error) {
      console.warn('API error fetching reviews, using default local data:', error.message);
    } finally {
      setReviewsLoaded(true);
    }
  };

  useEffect(() => {
    fetchRooms();
    fetchReviews();
  }, []);

  useEffect(() => {
    if (preloaderCompleted && logoStage === 'preloader') {
      const startWidth = 180;
      const startHeight = 180;
      const startLeft = (window.innerWidth - startWidth) / 2;
      const startTop = (window.innerHeight - startHeight) / 2;

      setLogoStyle({
        position: 'fixed',
        left: `${startLeft}px`,
        top: `${startTop}px`,
        width: `${startWidth}px`,
        height: `${startHeight}px`,
        zIndex: 1500,
        transition: 'all 2.2s cubic-bezier(0.77, 0, 0.175, 1)',
        pointerEvents: 'none',
        objectFit: 'contain',
        borderRadius: '4px',
        filter: 'drop-shadow(0 2px 8px rgba(0, 0, 0, 0.35))',
        opacity: 1
      });

      const timer = setTimeout(() => {
        setLogoStage('center');
      }, 700);

      return () => clearTimeout(timer);
    }
  }, [preloaderCompleted, logoStage]);

  useEffect(() => {
    if (logoStage === 'center') {
      const timer = setTimeout(() => {
        setLogoStage('animating');

        const target = document.getElementById('nav-logo-img');
        if (target) {
          const rect = target.getBoundingClientRect();
          setLogoStyle(prev => ({
            ...prev,
            left: `${rect.left}px`,
            top: `${rect.top}px`,
            width: `${rect.width}px`,
            height: `${rect.height}px`,
            filter: 'drop-shadow(0 2px 8px rgba(0, 0, 0, 0.35))'
          }));
        } else {
          setLogoStage('finished');
          setShowFloatingLogo(false);
        }
      }, 3000); // 3 seconds centered

      return () => clearTimeout(timer);
    }
  }, [logoStage]);

  useEffect(() => {
    if (logoStage === 'animating') {
      const timer = setTimeout(() => {
        setLogoStage('finished');
        // Fade out floating logo smoothly now that navbar logo is already visible underneath
        setLogoStyle(prev => ({
          ...prev,
          opacity: 0,
          transition: 'opacity 0.4s ease-out'
        }));
      }, 2200);

      const cleanupTimer = setTimeout(() => {
        setShowFloatingLogo(false);
      }, 2650);

      return () => {
        clearTimeout(timer);
        clearTimeout(cleanupTimer);
      };
    }
  }, [logoStage]);

  useEffect(() => {
    const handleHash = () => {
      const newHash = window.location.hash;
      // Only update state and scroll to top when entering or leaving the admin dashboard.
      // This prevents the page from re-rendering and aborting native browser scrolls
      // when clicking local section anchor tags (e.g. #accommodations).
      if (newHash === '#admin' || hash === '#admin' || newHash === '#booking' || hash === '#booking') {
        setHash(newHash);
        window.scrollTo({ top: 0 });
      }
    };
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, [hash]);

  useEffect(() => {
    if (hash === '#admin') {
      document.body.classList.add('admin-mode');
    } else {
      document.body.classList.remove('admin-mode');
    }
    return () => {
      document.body.classList.remove('admin-mode');
    };
  }, [hash]);

  // Lenis smooth scrolling (momentum/inertia) and initial animation scroll lock
  useEffect(() => {
    // Disable smooth scrolling on admin panel and booking page
    if (hash === '#admin' || hash === '#booking') return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
      infinite: false,
    });

    if (logoStage !== 'finished') {
      lenis.stop();
      document.body.style.overflow = 'hidden';
    } else {
      lenis.start();
      document.body.style.overflow = '';
    }

    let rafId;

    function raf(time) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }

    rafId = requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
      cancelAnimationFrame(rafId);
      document.body.style.overflow = '';
    };
  }, [hash, logoStage]);


  const handleNewReview = (newReview) => {
    setReviews((prev) => [newReview, ...prev]);
  };

  if (hash === '#admin') {
    return (
      <div style={{ backgroundColor: 'var(--color-bg-light)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <LanguageTranslator />
        <Navbar
          isAdminMode={isAuthenticated}
          activeTab={adminTab}
          setActiveTab={setAdminTab}
          logoStage="finished"
        />
        <div style={{ flex: '1 0 auto' }}>
          <AdminPanel
            isAuthenticated={isAuthenticated}
            onLoginSuccess={handleLoginSuccess}
            activeTab={adminTab}
            setActiveTab={setAdminTab}
            onBackToHome={handleLogout}
            refreshRooms={fetchRooms}
          />
        </div>
      </div>
    );
  }

  if (hash === '#booking') {
    return (
      <div style={{ backgroundColor: 'var(--color-bg-light)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <SunCursor />
        <LanguageTranslator />
        <Navbar isAdminMode={false} logoStage="finished" />
        <div style={{ flex: '1 0 auto', paddingTop: '80px' }}>
          <BookingPage
            rooms={rooms}
            onBackToHome={() => {
              window.location.hash = '';
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <>
      <SunPreloader 
        percent={bgPercent} 
        isReady={roomsLoaded && reviewsLoaded && bgPercent === 100} 
        onComplete={() => setPreloaderCompleted(true)} 
      />
      <ScrollBackground onProgress={setBgPercent} />
      <SunCursor />
      <LanguageTranslator logoStage={logoStage} />

      {showFloatingLogo && logoStyle.left && (
        <>
          <div
            className={`intro-logo-overlay ${logoStage === 'animating' ? 'fade-out' : ''}`}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100vw',
              height: '100vh',
              backgroundColor: 'var(--color-bg-dark)',
              zIndex: 1499,
              transition: 'opacity 2.2s ease-in-out',
              pointerEvents: 'none',
              opacity: (logoStage === 'animating' || logoStage === 'finished') ? 0 : 1
            }}
          />
          <img
            src={logoWhite}
            alt="Modhera Sunrise Logo"
            style={logoStyle}
          />
        </>
      )}

      <Navbar isAdminMode={false} logoStage={logoStage} />

      <Hero logoStage={logoStage} />
      <IntroSpacer />
      <ModheraExperience />

      <Accommodations rooms={rooms} />

      <Amenities />

      <Dining />

      <Gallery />

      <Transit />

      <ReviewSection
        reviews={reviews}
        onNewReviewAdded={handleNewReview}
      />

      <InquiryForm />

      <Footer />
      <MobileBottomNav logoStage={logoStage} />
    </>
  );
}
