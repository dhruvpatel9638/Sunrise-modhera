import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Maximize2, ChevronLeft, ChevronRight } from 'lucide-react';

function RoomImageCarousel({ images, title, type, price }) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const imgList = (images && images.length > 0)
    ? images 
    : ['https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?auto=format&fit=crop&w=800&q=80'];

  // Auto-changing photo timer (every 3.5 seconds)
  useEffect(() => {
    if (imgList.length <= 1 || isHovered) return;
    const interval = setInterval(() => {
      setCurrentIdx(prev => (prev + 1) % imgList.length);
    }, 3500);
    return () => clearInterval(interval);
  }, [imgList.length, isHovered]);

  const prevPhoto = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setCurrentIdx(prev => (prev - 1 + imgList.length) % imgList.length);
  };

  const nextPhoto = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setCurrentIdx(prev => (prev + 1) % imgList.length);
  };

  const selectPhoto = (e, idx) => {
    e.stopPropagation();
    e.preventDefault();
    setCurrentIdx(idx);
  };

  return (
    <div 
      className="room-img-container" 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="room-img-slider">
        {imgList.map((img, idx) => (
          <img
            key={idx}
            src={img}
            alt={`${title} - photo ${idx + 1}`}
            className={`room-img-slide ${idx === currentIdx ? 'active' : ''}`}
            loading="lazy"
          />
        ))}
      </div>

      <span className="room-type-badge">{type}</span>
      <div className="room-price-tag">
        <span>₹{price}</span> / night
      </div>

      {imgList.length > 1 && (
        <>
          <button 
            type="button" 
            className="room-carousel-arrow prev" 
            onClick={prevPhoto}
            aria-label="Previous photo"
          >
            <ChevronLeft size={18} />
          </button>
          
          <button 
            type="button" 
            className="room-carousel-arrow next" 
            onClick={nextPhoto}
            aria-label="Next photo"
          >
            <ChevronRight size={18} />
          </button>

          <div className="room-carousel-dots">
            {imgList.map((_, dotIdx) => (
              <button
                key={dotIdx}
                type="button"
                className={`carousel-dot ${dotIdx === currentIdx ? 'active' : ''}`}
                onClick={(e) => selectPhoto(e, dotIdx)}
                aria-label={`Go to photo ${dotIdx + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default function Accommodations({ rooms }) {
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 1.2,
        ease: [0.16, 1, 0.3, 1]
      }
    }
  };

  return (
    <section id="accommodations" className="section-padding" style={{ background: 'var(--color-bg-light)' }}>
      <div className="container">
        <div className="text-center" style={{ marginBottom: '60px' }}>
          <motion.h2 
            className="section-title"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            viewport={{ once: true }}
          >
            Immersive Guest Stays
          </motion.h2>
          <motion.p 
            className="section-subtitle"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
            viewport={{ once: true }}
          >
            Differentiate your experience by opting for our heritage-infused, non-traditional luxury stays.
          </motion.p>
        </div>

        <motion.div 
          className="room-grid"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {rooms.map((room) => (
            <motion.div className="room-card" key={room._id} variants={cardVariants}>
              <RoomImageCarousel 
                images={room.images} 
                title={room.title} 
                type={room.type} 
                price={room.price} 
              />

              <div className="room-info">
                <h3 className="room-title">{room.title}</h3>
                <p className="room-desc">{room.description}</p>

                <div className="room-meta">
                  <div className="room-meta-item">
                    <Users size={16} style={{ color: 'var(--color-primary)' }} />
                    <span>Up to {room.maxGuests} Guests</span>
                  </div>
                  <div className="room-meta-item">
                    <Maximize2 size={16} style={{ color: 'var(--color-primary)' }} />
                    <span>{room.size} sq. ft.</span>
                  </div>
                </div>

                <div className="room-amenities-tags">
                  {room.amenities?.slice(0, 5).map((amenity, idx) => (
                    <span className="amenity-tag" key={idx}>
                      {amenity}
                    </span>
                  ))}
                  {room.amenities?.length > 5 && (
                    <span className="amenity-tag" style={{ background: 'var(--color-gold-light)', color: 'var(--color-primary-dark)' }}>
                      +{room.amenities.length - 5} more
                    </span>
                  )}
                </div>

                <a 
                  href="#booking" 
                  className="btn btn-secondary" 
                  style={{ marginTop: 'auto', width: '100%', justifyContent: 'center', textAlign: 'center' }}
                >
                  Inquire Stay Details
                </a>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
