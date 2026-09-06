import React from 'react';
import { motion } from 'framer-motion';
import indianVegCuisine from '../assets/indian_veg_cuisine.jpg';

export default function ModheraExperience() {
  const experiences = [
    {
      id: 'heritage-stay',
      tag: 'Heritage Stay',
      title: 'Traditional Bhungas',
      desc: "Inspired by Gujarat's timeless architecture. Experience the comfort of circular mud huts beautifully adorned with traditional hand-crafted mirror work (lipan kaam), thatched roofs, and premium luxury interiors.",
      image: 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?auto=format&fit=crop&w=1000&q=85'
    },
    {
      id: 'dining-experience',
      tag: 'Dining Experience',
      title: 'Farm-to-Table Cuisine',
      desc: 'Savor organic, 100% pure vegetarian Gujarati meals prepared with fresh ingredients sourced directly from local farms. Relish authentic cuisine served under starry skies in a rustic dining atmosphere.',
      image: indianVegCuisine
    },
    {
      id: 'nature-wellness',
      tag: 'Nature & Wellness',
      title: 'Pushpavati Riverside',
      desc: 'Reconnect with nature beside the gentle waters of the Pushpavati River. Take peaceful morning walks, listen to birds, watch free-roaming peacocks, and experience calming tranquility.',
      image: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=1000&q=85'
    }
  ];

  const itemVariants = {
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

  const textBlockVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 1.2,
        ease: [0.16, 1, 0.3, 1],
        staggerChildren: 0.15
      }
    }
  };

  const childVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1]
      }
    }
  };

  return (
    <section 
      id="experience" 
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
          <motion.span 
            className="section-subtitle"
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.05 }}
            viewport={{ once: true }}
          >
            Storytelling Experience
          </motion.span>
          <motion.h2 
            className="section-title" 
            style={{ color: '#FFFFFF' }}
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            viewport={{ once: true }}
          >
            The Modhera Experience
          </motion.h2>
        </div>

        <div className="experience-container">
          {experiences.map(exp => (
            <div key={exp.id} className="experience-card">
              <div className="experience-card-img-wrapper" style={{ overflow: 'hidden' }}>
                <motion.img 
                  src={exp.image} 
                  alt={exp.title} 
                  className="experience-card-img" 
                  initial={{ scale: 1.1 }}
                  whileInView={{ scale: 1 }}
                  transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                  viewport={{ once: true }}
                />
              </div>
              <motion.div 
                className="experience-card-text-wrapper"
                variants={textBlockVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.05 }}
              >
                <motion.span className="experience-card-tag" variants={childVariants}>{exp.tag}</motion.span>
                <motion.h3 className="experience-card-title" variants={childVariants}>{exp.title}</motion.h3>
                <motion.p className="experience-card-desc" variants={childVariants}>{exp.desc}</motion.p>
              </motion.div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
