import React from 'react';
import { Waves, TreePine, BatteryCharging, Gamepad2, Flame } from 'lucide-react';

const resortAmenities = [
  {
    name: 'Swimming Pool',
    icon: Waves,
    desc: 'Features a large main outdoor pool and an integrated kids pool zone, perfect for afternoon cooling and family pool parties.'
  },
  {
    name: 'Lush Green Lawns',
    icon: TreePine,
    desc: 'Sprawling manicured lawns and gazebos ideal for relaxing walks, family picnics, and intimate social gatherings.'
  },
  {
    name: 'EV Charging Stations',
    icon: BatteryCharging,
    desc: 'Modern, high-speed charging stations to keep your electric vehicles powered up for your weekend drive back home.'
  },
  {
    name: 'Games & Kids Club',
    icon: Gamepad2,
    desc: 'Indoor recreational space with Table Tennis, board games, and outdoor kids swings and slides for all ages.'
  },
  {
    name: 'Bonfire Areas',
    icon: Flame,
    desc: 'Dedicated fire pits for evening stories, roasting marshmallows, and keeping warm under winter night skies.'
  }
];

export default function Amenities() {
  return (
    <section id="amenities" className="section-padding amenities-bg">
      <div className="container">
        <div className="text-center">
          <h2 className="section-title">Premium Amenities</h2>
          <p className="section-subtitle">
            Enjoy modern leisure and convenience designed to elevate your heritage escape.
          </p>
        </div>

        <div className="amenities-grid">
          {resortAmenities.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div className="amenity-card" key={idx}>
                <div className="amenity-icon-wrapper">
                  <Icon size={28} />
                </div>
                <h3 className="amenity-name">{item.name}</h3>
                <p className="amenity-desc">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
