import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { createPortal } from 'react-dom';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

import img2 from '../assets/WP/Screenshot_2026-06-16-22-20-51-69_40deb401b9ffe8e1df2f1cc5ba480b12.jpg.jpeg';
import img3 from '../assets/WP/Screenshot_2026-06-16-22-21-30-24_40deb401b9ffe8e1df2f1cc5ba480b12.jpg.jpeg';
import img4 from '../assets/WP/Screenshot_2026-06-16-22-21-38-03_40deb401b9ffe8e1df2f1cc5ba480b12.jpg.jpeg';
import img5 from '../assets/WP/Screenshot_2026-06-16-22-21-42-75_40deb401b9ffe8e1df2f1cc5ba480b12.jpg.jpeg';
import img6 from '../assets/WP/Screenshot_2026-06-16-22-21-47-69_40deb401b9ffe8e1df2f1cc5ba480b12.jpg.jpeg';
import img7 from '../assets/WP/Screenshot_2026-06-16-22-21-51-21_40deb401b9ffe8e1df2f1cc5ba480b12.jpg.jpeg';
import img8 from '../assets/WP/Screenshot_2026-06-16-22-21-53-79_40deb401b9ffe8e1df2f1cc5ba480b12.jpg.jpeg';
import img9 from '../assets/WP/Screenshot_2026-06-16-22-22-15-92_40deb401b9ffe8e1df2f1cc5ba480b12.jpg.jpeg';

const galleryPhotos = [
  {
    id: 2,
    title: 'Leopard Statue in Garden',
    category: 'heritage',
    url: img2,
    tag: 'Heritage & Nature'
  },
  {
    id: 3,
    title: 'Bhunga Village Overview',
    category: 'heritage',
    url: img3,
    tag: 'Heritage & Nature'
  },
  {
    id: 4,
    title: 'Premium White Cottages',
    category: 'leisure',
    url: img4,
    tag: 'Leisure'
  },
  {
    id: 5,
    title: 'Garden Water Fountain',
    category: 'leisure',
    url: img5,
    tag: 'Leisure'
  },
  {
    id: 6,
    title: 'Traditional Wooden Swing',
    category: 'leisure',
    url: img6,
    tag: 'Leisure'
  },
  {
    id: 7,
    title: 'Resort Pathways & Greenery',
    category: 'proximity',
    url: img7,
    tag: 'Proximity'
  },
  {
    id: 8,
    title: 'Peaceful Village Atmosphere',
    category: 'proximity',
    url: img8,
    tag: 'Proximity'
  },
  {
    id: 9,
    title: 'Evening Serenity at Resort',
    category: 'proximity',
    url: img9,
    tag: 'Proximity'
  }
];

export default function Gallery() {
  const [filter, setFilter] = useState('all');
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);
  const [isZoomed, setIsZoomed] = useState(false);

  const filteredPhotos = filter === 'all' 
    ? galleryPhotos 
    : galleryPhotos.filter(photo => photo.category === filter);

  const openLightbox = (index) => {
    setSelectedImageIndex(index);
    setIsZoomed(false);
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
  };

  const closeLightbox = () => {
    setSelectedImageIndex(null);
    setIsZoomed(false);
    document.body.style.overflow = '';
  };

  const nextImage = (e) => {
    e.stopPropagation();
    setIsZoomed(false);
    setSelectedImageIndex((prev) => (prev === filteredPhotos.length - 1 ? 0 : prev + 1));
  };

  const prevImage = (e) => {
    e.stopPropagation();
    setIsZoomed(false);
    setSelectedImageIndex((prev) => (prev === 0 ? filteredPhotos.length - 1 : prev - 1));
  };

  // Keyboard navigation for lightbox
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (selectedImageIndex === null) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') nextImage(e);
      if (e.key === 'ArrowLeft') prevImage(e);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedImageIndex, filteredPhotos.length]);

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.08
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

  return (
    <section id="gallery" className="section-padding">
      <div className="container">
        <div className="section-header">
          <motion.h2 
            className="section-title"
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            viewport={{ once: true }}
          >
            Resort Gallery
          </motion.h2>
          <motion.p 
            className="section-subtitle"
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            viewport={{ once: true }}
          >
            Explore the scenic charm, historic connection, and modern leisure structures that define our eco-sanctuary.
          </motion.p>
        </div>

        {/* Filters */}
        <motion.div 
          className="gallery-filters"
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
          viewport={{ once: true }}
        >
          <button 
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All Memories
          </button>
          <button 
            className={`filter-btn ${filter === 'heritage' ? 'active' : ''}`}
            onClick={() => setFilter('heritage')}
          >
            Heritage & Nature
          </button>
          <button 
            className={`filter-btn ${filter === 'leisure' ? 'active' : ''}`}
            onClick={() => setFilter('leisure')}
          >
            Leisure & Pool
          </button>
          <button 
            className={`filter-btn ${filter === 'proximity' ? 'active' : ''}`}
            onClick={() => setFilter('proximity')}
          >
            Sun Temple Proximity
          </button>
        </motion.div>

        {/* Grid */}
        <motion.div 
          className="gallery-grid"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.05 }}
        >
          {filteredPhotos.map((photo, index) => (
            <motion.div 
              className="gallery-item" 
              key={photo.id} 
              onClick={() => openLightbox(index)}
              style={{ cursor: 'pointer', overflow: 'hidden' }}
              variants={itemVariants}
            >
              <motion.img 
                src={photo.url} 
                alt={photo.title} 
                className="gallery-item-img"
                initial={{ scale: 1.15 }}
                whileInView={{ scale: 1 }}
                transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                viewport={{ once: true }}
              />
              <div className="gallery-overlay">
                <span className="gallery-tag">{photo.tag}</span>
                <h4 className="gallery-title">{photo.title}</h4>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Lightbox Modal */}
      {selectedImageIndex !== null && createPortal(
        <div className="lightbox-overlay" onClick={closeLightbox}>
          <button className="lightbox-close" onClick={closeLightbox}>
            <X size={32} />
          </button>
          
          <button className="lightbox-nav prev" onClick={prevImage}>
            <ChevronLeft size={48} />
          </button>

          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <div className="lightbox-img-wrapper" style={{ overflow: isZoomed ? 'auto' : 'hidden', maxWidth: '100vw', maxHeight: '80vh', borderRadius: '4px' }}>
              <img 
                src={filteredPhotos[selectedImageIndex].url} 
                alt={filteredPhotos[selectedImageIndex].title} 
                className={`lightbox-img ${isZoomed ? 'zoomed' : ''}`}
                onClick={() => setIsZoomed(!isZoomed)}
                title={isZoomed ? "Click to Zoom Out" : "Click to Zoom In"}
              />
            </div>
            <div className="lightbox-caption">
              <h3>{filteredPhotos[selectedImageIndex].title}</h3>
              <p>{filteredPhotos[selectedImageIndex].tag}</p>
            </div>
          </div>

          <button className="lightbox-nav next" onClick={nextImage}>
            <ChevronRight size={48} />
          </button>
        </div>,
        document.body
      )}
    </section>
  );
}
