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
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.9,
        ease: [0.16, 1, 0.3, 1]
      }
    }
  };

  const cuisineContainerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.06,
        delayChildren: 0.2
      }
    }
  };

  return (
    <section 
      id="dining" 
      className="section-padding" 
      style={{ 
        background: 'var(--color-bg-dark-mid)', 
        borderTop: '1px solid var(--color-border-dark)', 
        position: 'relative', 
        zIndex: 2 
      }}
    >
      <div className="container">
        <div className="dining-layout">
          {/* Visual Panel */}
          <div className="dining-img-pane">
            <div className="dining-img-wrapper" style={{ overflow: 'hidden' }}>
              <motion.img
                src={diningThali}
                alt="Traditional Gujarati Thali"
                className="dining-img"
                initial={{ scale: 1.08 }}
                whileInView={{ scale: 1 }}
                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
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
            viewport={{ once: true, amount: 0.05 }}
          >
            <motion.h2 className="dining-title" variants={itemVariants}>
              Tents & Bhungas Jungle Restaurant
            </motion.h2>

            <motion.p className="dining-desc" variants={itemVariants}>
              Experience romantic rustic dining under starlit skies. Our theme restaurant blends rural Gujarati heritage with fresh organic cuisine sourced from the Pushpavati river basin.
            </motion.p>

            <motion.div className="cuisine-subtitle" variants={itemVariants}>
              <span style={{ fontSize: '1rem' }}>☀️</span> OUR CUISINE PROFILE
            </motion.div>

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
              <span className="jain-alert-title">
                🌾 Strict Jain Food Available
              </span>
              Prepared in dedicated separate cooking facilities without onion or garlic. Please mention during reservation.
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
