import React from 'react';
import { Users, Maximize2 } from 'lucide-react';

export default function Accommodations({ rooms }) {
  return (
    <section id="accommodations" className="section-padding" style={{ background: 'var(--color-bg-light)' }}>
      <div className="container">
        <div className="text-center">
          <h2 className="section-title">Immersive Guest Stays</h2>
          <p className="section-subtitle">
            Differentiate your experience by opting for our heritage-infused, non-traditional luxury stays.
          </p>
        </div>

        <div className="room-grid">
          {rooms.map((room) => (
            <div className="room-card" key={room._id}>
              <div className="room-img-container">
                <img 
                  src={room.images?.[0] || 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?auto=format&fit=crop&w=800&q=80'} 
                  alt={room.title} 
                  className="room-img"
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
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
