import React from 'react';
import { Leaf, Compass } from 'lucide-react';

const cuisines = [
  'Traditional Gujarati Thali',
  'Authentic Rajasthani Dal Baati',
  'Rich North Indian (Punjabi) Curries',
  'Fresh South Indian Idli & Dosa'
];

export default function Dining() {
  return (
    <section id="dining" className="section-padding">
      <div className="container">
        <div className="dining-layout">
          {/* Visual Panel */}
          <div className="dining-img-pane">
            <div className="dining-img-wrapper">
              <img 
                src="https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80" 
                alt="Jungle Candlelight Dining" 
                className="dining-img"
              />
              <div className="dining-badge">
                <Leaf size={16} />
                <span>Pure Vegetarian</span>
              </div>
            </div>
          </div>

          {/* Text/Content Panel */}
          <div className="dining-info-pane">
            <div className="dining-veg-stamp">
              <div className="veg-box">
                <div className="veg-circle"></div>
              </div>
              <span className="veg-text">100% Pure Veg</span>
            </div>

            <h2 className="dining-title">
              Tents & Bhungas Jungle Restaurant
            </h2>
            
            <p className="dining-desc">
              Experience the romance of rustic candlelight dining under the stars. Our signature theme restaurant blends rural heritage ambiance with premium culinary standards, sourcing fresh organic ingredients locally from the Pushpavati river basin.
            </p>

            <h3 style={{ fontSize: '1.2rem', marginBottom: '16px', color: 'var(--color-primary)' }}>
              Our Cuisine Profile
            </h3>
            
            <div className="cuisine-grid">
              {cuisines.map((item, idx) => (
                <div className="cuisine-card" key={idx}>
                  <div className="cuisine-bullet"></div>
                  <span className="cuisine-name">{item}</span>
                </div>
              ))}
            </div>

            <div className="jain-alert">
              <span style={{ fontWeight: '700', color: 'var(--color-gold)', display: 'block', marginBottom: '4px' }}>
                🌾 Jain Food Options Accommodated
              </span>
              We understand and respect your religious food preferences. Separate Jain cooking facilities are utilized to prepare strictly onion-and-garlic-free meals. Please mention your requirements in the reservation inquiry.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
