import React from 'react';
import { MapPin, Landmark, Compass, Car, History } from 'lucide-react';

const transitBenchmarks = [
  {
    name: 'Modhera Sun Temple',
    distance: '0 km',
    desc: 'Immediate access. Situated just a brief 7-minute walk behind the property lines.',
    icon: Landmark
  },
  {
    name: 'Modheshwari Temple',
    distance: '2 km',
    desc: 'Ancient temple dedicated to Goddess Modheshwari, the clan deity of Modha Brahmins.',
    icon: Compass
  },
  {
    name: 'Bahucharaji Temple',
    distance: '13 km',
    desc: 'Major pilgrim center located in Mehsana district, dedicated to Bahuchara Mata.',
    icon: Compass
  },
  {
    name: 'Patan (Rani Ki Vav)',
    distance: '36 km',
    desc: 'Stunning UNESCO World Heritage stepwell featuring intricate multi-layered stone carving arts.',
    icon: History
  },
  {
    name: 'Mehsana City Center',
    distance: '25 km',
    desc: 'Nearest urban railway connection hub and shopping/medical center facilities.',
    icon: MapPin
  },
  {
    name: 'Ahmedabad Airport & City',
    distance: '99 km',
    desc: 'The perfect weekend road-trip drive length from Gujarat\'s capital hub via state highways.',
    icon: Car
  }
];

export default function Transit() {
  return (
    <section id="transit" className="section-padding" style={{ background: 'transparent' }}>
      <div className="container">
        <div className="text-center">
          <h2 className="section-title">Nearby Transit & Benchmarks</h2>
          <p className="section-subtitle">
            Perfectly situated on the banks of the Pushpavati River, facilitating seamless exploration of Gujarat's architectural wonders.
          </p>
        </div>

        <div className="transit-grid">
          {transitBenchmarks.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div className="transit-card" key={idx}>
                <div className="transit-icon-box">
                  <Icon size={24} />
                </div>
                <div className="transit-info">
                  <h4>{item.name}</h4>
                  <p>{item.desc}</p>
                </div>
                <div className="transit-distance">{item.distance}</div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
