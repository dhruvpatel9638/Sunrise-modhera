import React from 'react';
import { motion } from 'framer-motion';
import diningThali from '../assets/dining_thali.jpg';

const cuisines = [
  'Traditional Gujarati Thali',
  'Authentic Rajasthani Dal Baati',
  'Rich North Indian (Punjabi) Curries',
  'Fresh South Indian Idli & Dosa'
];

export default function Dining() {
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.12
      }
    }
  };

  const itemVariants = {
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

  const cuisineContainerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.3
      }
    }
  };

  return (
    <section id="dining" className="section-padding">
      <div className="container">
        <div className="dining-layout">
          {/* Visual Panel */}
          <div className="dining-img-pane">
            <div className="dining-img-wrapper" style={{ overflow: 'hidden' }}>
              <motion.img
                src={diningThali}
                alt="Traditional Gujarati Thali"
                className="dining-img"
                initial={{ scale: 1.1 }}
                whileInView={{ scale: 1 }}
                transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                viewport={{ once: true }}
              />
              <div className="dining-badge">
                <div className="veg-box-sm">
                  <div className="veg-circle-sm"></div>
                </div>
                <span>Pure Vegetarian</span>
              </div>
            </div>
          </div>

          {/* Text/Content Panel */}
          <motion.div 
            className="dining-info-pane"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            <motion.h2 className="dining-title" variants={itemVariants}>
              Tents & Bhungas Jungle Restaurant
            </motion.h2>

            <motion.p className="dining-desc" variants={itemVariants}>
              Experience the romance of rustic candlelight dining under the stars. Our signature theme restaurant blends rural heritage ambiance with premium culinary standards, sourcing fresh organic ingredients locally from the Pushpavati river basin.
            </motion.p>

            <motion.h3 
              style={{ fontSize: '1.2rem', marginBottom: '16px', color: 'var(--color-primary)' }}
              variants={itemVariants}
            >
              Our Cuisine Profile
            </motion.h3>

            <motion.div 
              className="cuisine-grid"
              variants={cuisineContainerVariants}
            >
              {cuisines.map((item, idx) => (
                <motion.div className="cuisine-card" key={idx} variants={itemVariants}>
                  <div className="cuisine-bullet"></div>
                  <span className="cuisine-name">{item}</span>
                </motion.div>
              ))}
            </motion.div>

            <motion.div className="jain-alert" variants={itemVariants}>
              <span style={{ fontWeight: '700', color: '#FFFFFF', display: 'block', marginBottom: '4px' }}>
                🌾 Jain Food Options Accommodated
              </span>
              We understand and respect your religious food preferences. Separate Jain cooking facilities are utilized to prepare strictly onion-and-garlic-free meals. Please mention your requirements in the reservation inquiry.
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
