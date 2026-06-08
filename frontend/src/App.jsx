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
import { roomAPI, reviewAPI } from './utils/api';


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
    images: ["https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?auto=format&fit=crop&w=800&q=80"],
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
    images: ["https://images.unsplash.com/photo-1533759413974-9e15f3b745ac?auto=format&fit=crop&w=800&q=80"],
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
    images: ["https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80"],
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
    }
  };

  useEffect(() => {
    fetchRooms();
    fetchReviews();
  }, []);

  useEffect(() => {
    const handleHash = () => {
      const newHash = window.location.hash;
      // Only update state and scroll to top when entering or leaving the admin dashboard.
      // This prevents the page from re-rendering and aborting native browser scrolls
      // when clicking local section anchor tags (e.g. #accommodations).
      if (newHash === '#admin' || hash === '#admin') {
        setHash(newHash);
        window.scrollTo({ top: 0 });
      }
    };
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, [hash]);

  const handleNewReview = (newReview) => {
    setReviews((prev) => [newReview, ...prev]);
  };

  if (hash === '#admin') {
    return (
      <div style={{ backgroundColor: 'var(--bg-cream)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Navbar 
          isAdminMode={isAuthenticated} 
          activeTab={adminTab} 
          setActiveTab={setAdminTab} 
        />
        <div style={{ flex: '1 0 auto' }}>
          <AdminPanel 
            isAuthenticated={isAuthenticated}
            onLoginSuccess={handleLoginSuccess}
            activeTab={adminTab} 
            setActiveTab={setAdminTab} 
            onBackToHome={handleLogout} 
          />
        </div>
      </div>
    );
  }

  return (
    <>
      <ScrollBackground />
      <Navbar isAdminMode={false} />
      
      <Hero />
      <ModheraExperience />

      <Accommodations rooms={rooms} />

      <BookingPage rooms={rooms} onBackToHome={() => window.scrollTo({ top: 0, behavior: 'smooth' })} />

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
      <MobileBottomNav />
    </>
  );
}
