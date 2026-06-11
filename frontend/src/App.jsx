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
import AdminPanel from './components/AdminPanel';
import MobileBottomNav from './components/MobileBottomNav';
import SunPreloader from './components/SunPreloader';
import SunCursor from './components/SunCursor';
import { roomAPI, reviewAPI } from './utils/api';
import logoWhite from './assets/logo_white.png';


const FALLBACK_ROOMS = [
  {
    _id: 'bhunga-mock-1',
    title: "Traditional Bhunga (Kutch Mud Hut)",
    type: "bhunga",
    price: 6500,
    maxGuests: 3,
    size: 450,
    description: "Circular, authentic Kutch-style mud houses with conical thatched roofs. Artfully decorated with traditional hand-crafted mirror-work (lipan kaam) on the interior walls. Upgraded with premium king-size bedding, writing desk, and quiet air conditioning for luxury comfort in a rustic ambiance.",
    amenities: ["Air Conditioning", "King Size Bed", "Premium Linens", "Attached Luxury Bath", "Lipan Kaam Decor", "Tea/Coffee Maker", "Mineral Water", "Free Wi-Fi"],
    images: ["https://images.unsplash.com/photo-1508193638397-1c4234db14d8?auto=format&fit=crop&w=800&q=80"],
    availableCount: 4
  },
  {
    _id: 'tent-mock-2',
    title: "Luxury Glamping Tent",
    type: "tent",
    price: 5500,
    maxGuests: 2,
    size: 400,
    description: "Glamour camping (Glamping) setups giving a raw, immersive nature feel. Nestled under dense green tree canopies, each tent features premium mattress setups, fine fabrics, and a fully attached modern concrete bathroom. Includes a private wood-deck verandah for viewing free-roaming peacocks and bird watching.",
    amenities: ["Private Sit-out Verandah", "Attached Concrete Bathroom", "Hot & Cold Shower", "Air Cooler/AC", "Complimentary Breakfast", "Nature View Deck", "Tea Kettle"],
    images: ["https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&w=800&q=80"],
    availableCount: 6
  },
  {
    _id: 'cottage-mock-3',
    title: "Super Cottage / Deluxe Garden Room",
    type: "cottage",
    price: 7500,
    maxGuests: 4,
    size: 625,
    description: "Spacious standard brick-and-mortar luxury bungalows with high ceilings and wide french windows. Each cottage opens up directly to a panoramic private garden space. Equipped with premium double beds, a cozy seating lounge, double vanity bathrooms, and upscale contemporary furnishings.",
    amenities: ["Panoramic Garden View", "French Windows", "Double Vanity Bathroom", "Air Conditioning", "In-Room Electronic Safe", "Mini Fridge", "Flat Screen Smart TV", "Lounge Seating Area"],
    images: ["https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80"],
    availableCount: 5
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

  const [logoStage, setLogoStage] = useState(
    window.location.hash === '#admin' || window.location.hash === '#booking' 
      ? 'finished' 
      : 'preloader'
  );
  const [logoStyle, setLogoStyle] = useState({});

  // Safety fallback to force load completion if API is slow or hangs
  useEffect(() => {
    const timer = setTimeout(() => {
      setRoomsLoaded(true);
      setReviewsLoaded(true);
    }, 6000); // 6 seconds max load safety net
    return () => clearTimeout(timer);
  }, []);

  // Force scroll-to-top and disable native scroll restoration on reload for homepage entrance animation
  useEffect(() => {
    const currentHash = window.location.hash;
    if (currentHash !== '#admin' && currentHash !== '#booking') {
      if ('scrollRestoration' in window.history) {
        window.history.scrollRestoration = 'manual';
      }
      window.scrollTo(0, 0);
      if (currentHash && currentHash !== '#hero') {
        window.history.replaceState(null, null, ' ');
      }
    }
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

  const isPreloaderReady = roomsLoaded && reviewsLoaded && bgPercent === 100;

  useEffect(() => {
    if (isPreloaderReady && logoStage === 'preloader') {
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
        borderRadius: '4px'
      });

      const timer = setTimeout(() => {
        setLogoStage('center');
      }, 1400);
      
      return () => clearTimeout(timer);
    }
  }, [isPreloaderReady, logoStage]);

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
            height: `${rect.height}px`
          }));
        } else {
          setLogoStage('finished');
        }
      }, 3000); // 3 seconds centered
      
      return () => clearTimeout(timer);
    }
  }, [logoStage]);

  useEffect(() => {
    if (logoStage === 'animating') {
      const timer = setTimeout(() => {
        setLogoStage('finished');
      }, 2200);
      
      return () => clearTimeout(timer);
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

  const handleNewReview = (newReview) => {
    setReviews((prev) => [newReview, ...prev]);
  };

  if (hash === '#admin') {
    return (
      <div style={{ backgroundColor: 'var(--color-bg-light)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
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
      <SunPreloader percent={bgPercent} isReady={roomsLoaded && reviewsLoaded && bgPercent === 100} />
      <ScrollBackground onProgress={setBgPercent} />
      <SunCursor />

      {logoStage !== 'finished' && logoStyle.left && (
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
              opacity: logoStage === 'animating' ? 0 : 1
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
