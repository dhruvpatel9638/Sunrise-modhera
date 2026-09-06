import React from 'react';
import { motion } from 'framer-motion';
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
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 40 },
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
    <section id="amenities" className="section-padding amenities-bg">
      <div className="container">
        <div className="section-header">
          <motion.h2 
            className="section-title"
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            viewport={{ once: true }}
          >
            Premium Amenities
          </motion.h2>
          <motion.p 
            className="section-subtitle"
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            viewport={{ once: true }}
          >
            Enjoy modern leisure and convenience designed to elevate your heritage escape.
          </motion.p>
        </div>

        <motion.div 
          className="amenities-grid"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.05 }}
        >
          {resortAmenities.map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div className="amenity-card" key={idx} variants={cardVariants}>
                <div className="amenity-icon-wrapper">
                  <Icon size={28} />
                </div>
                <h3 className="amenity-name">{item.name}</h3>
                <p className="amenity-desc">{item.desc}</p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
