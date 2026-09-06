import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Landmark, Compass, Car, History, ExternalLink } from 'lucide-react';

const transitBenchmarks = [
  {
    name: 'Modhera Sun Temple',
    distance: '0 km',
    desc: 'Immediate access. Situated just a brief 7-minute walk behind the property lines.',
    icon: Landmark,
    mapUrl: 'https://maps.google.com/?q=Modhera+Sun+Temple'
  },
  {
    name: 'Modheshwari Temple',
    distance: '2 km',
    desc: 'Ancient temple dedicated to Goddess Modheshwari, the clan deity of Modha Brahmins.',
    icon: Compass,
    mapUrl: 'https://maps.app.goo.gl/B7NDjBSFRYCbZZe69'
  },
  {
    name: 'Bahucharaji Temple',
    distance: '13 km',
    desc: 'Major pilgrim center located in Mehsana district, dedicated to Bahuchara Mata.',
    icon: Compass,
    mapUrl: 'https://maps.app.goo.gl/4S4ubH23fJgVM9v38'
  },
  {
    name: 'Patan (Rani Ki Vav)',
    distance: '36 km',
    desc: 'Stunning UNESCO World Heritage stepwell featuring intricate multi-layered stone carving arts.',
    icon: History,
    mapUrl: 'https://maps.app.goo.gl/CkRze4gkN3u8L8ek7'
  },
  {
    name: 'Mehsana City Center',
    distance: '25 km',
    desc: 'Nearest urban railway connection hub and shopping/medical center facilities.',
    icon: MapPin,
    mapUrl: 'https://maps.app.goo.gl/NP7AfS5wqBBpVW5G7'
  },
  {
    name: 'Ahmedabad Airport & City',
    distance: '99 km',
    desc: 'The perfect weekend road-trip drive length from Gujarat\'s capital hub via state highways.',
    icon: Car,
    mapUrl: 'https://maps.app.goo.gl/uuxNGDHgyhUZAp49A'
  }
];

export default function Transit() {
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.08
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
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
    <section 
      id="transit" 
      className="section-padding" 
      style={{ 
        background: 'var(--color-bg-dark-mid)', 
        borderTop: '1px solid var(--color-border-dark)',
        position: 'relative',
        zIndex: 2
      }}
    >
      <div className="container">
        <div className="section-header">
          <motion.h2 
            className="section-title"
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            viewport={{ once: true }}
          >
            Nearby Transit & Benchmarks
          </motion.h2>
          <motion.p 
            className="section-subtitle"
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            viewport={{ once: true }}
          >
            Perfectly situated on the banks of the Pushpavati River, facilitating seamless exploration of Gujarat's architectural wonders.
          </motion.p>
        </div>

        <motion.div 
          className="transit-grid"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.05 }}
        >
          {transitBenchmarks.map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.a 
                className="transit-card" 
                key={idx} 
                href={item.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                variants={cardVariants}
                style={{ textDecoration: 'none', color: 'inherit', cursor: 'pointer' }}
              >
                <div className="transit-icon-box">
                  <Icon size={24} />
                </div>
                <div className="transit-info">
                  <h4 style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    {item.name}
                    <ExternalLink size={14} style={{ opacity: 0.6, flexShrink: 0 }} />
                  </h4>
                  <p>{item.desc}</p>
                </div>
                <div className="transit-distance">{item.distance}</div>
              </motion.a>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
