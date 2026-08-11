import React from 'react';
import { motion } from 'framer-motion';
import { Users, Maximize2 } from 'lucide-react';

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
              <div className="room-img-container" style={{ overflow: 'hidden' }}>
                <motion.img 
                  src={room.images?.[0] || 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?auto=format&fit=crop&w=800&q=80'} 
                  alt={room.title} 
                  className="room-img"
                  initial={{ scale: 1.1 }}
                  whileInView={{ scale: 1 }}
                  transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                  viewport={{ once: true }}
                />
                <span className="room-type-badge">{room.type}</span>
                <div className="room-price-tag">
                  <span>₹{room.price}</span> / night
                </div>
              </div>

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
