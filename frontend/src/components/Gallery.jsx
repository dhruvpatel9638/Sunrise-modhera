import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

import img1 from '../assets/WP/Screenshot_2026-06-16-22-20-48-49_40deb401b9ffe8e1df2f1cc5ba480b12.jpg.jpeg';
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
    id: 1,
    title: 'Traditional Bhunga Mirror Work',
    category: 'heritage',
    url: img1,
    tag: 'Heritage & Nature'
  },
  {
    id: 2,
    title: 'Dense Tree Canopy Pathways',
    category: 'heritage',
    url: img2,
    tag: 'Heritage & Nature'
  },
  {
    id: 3,
    title: 'Resident Peacocks in Garden',
    category: 'heritage',
    url: img3,
    tag: 'Heritage & Nature'
  },
  {
    id: 4,
    title: 'Integrated Kids Pool Zone',
    category: 'leisure',
    url: img4,
    tag: 'Leisure'
  },
  {
    id: 5,
    title: 'Candlelight Dinner Setup',
    category: 'leisure',
    url: img5,
    tag: 'Leisure'
  },
  {
    id: 6,
    title: 'Manicured Lawns at Sunset',
    category: 'leisure',
    url: img6,
    tag: 'Leisure'
  },
  {
    id: 7,
    title: 'Historic Modhera Sun Temple',
    category: 'proximity',
    url: img7,
    tag: 'Proximity'
  },
  {
    id: 8,
    title: 'Stone Carvings & Heritage Pillar',
    category: 'proximity',
    url: img8,
    tag: 'Proximity'
  },
  {
    id: 9,
    title: 'Sunset Temple Silhouette',
    category: 'proximity',
    url: img9,
    tag: 'Proximity'
  }
];

export default function Gallery() {
  const [filter, setFilter] = useState('all');
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);

  const filteredPhotos = filter === 'all' 
    ? galleryPhotos 
    : galleryPhotos.filter(photo => photo.category === filter);

  const openLightbox = (index) => {
    setSelectedImageIndex(index);
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
  };

  const closeLightbox = () => {
    setSelectedImageIndex(null);
    document.body.style.overflow = '';
  };

  const nextImage = (e) => {
    e.stopPropagation();
    setSelectedImageIndex((prev) => (prev === filteredPhotos.length - 1 ? 0 : prev + 1));
  };

  const prevImage = (e) => {
    e.stopPropagation();
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

  return (
    <section id="gallery" className="section-padding">
      <div className="container">
        <div className="text-center">
          <h2 className="section-title">Resort Gallery</h2>
          <p className="section-subtitle">
            Explore the scenic charm, historic connection, and modern leisure structures that define our eco-sanctuary.
          </p>
        </div>

        {/* Filters */}
        <div className="gallery-filters">
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
        </div>

        {/* Grid */}
        <div className="gallery-grid">
          {filteredPhotos.map((photo, index) => (
            <div 
              className="gallery-item" 
              key={photo.id} 
              onClick={() => openLightbox(index)}
              style={{ cursor: 'pointer' }}
            >
              <img 
                src={photo.url} 
                alt={photo.title} 
                className="gallery-item-img"
              />
              <div className="gallery-overlay">
                <span className="gallery-tag">{photo.tag}</span>
                <h4 className="gallery-title">{photo.title}</h4>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      {selectedImageIndex !== null && (
        <div className="lightbox-overlay" onClick={closeLightbox}>
          <button className="lightbox-close" onClick={closeLightbox}>
            <X size={32} />
          </button>
          
          <button className="lightbox-nav prev" onClick={prevImage}>
            <ChevronLeft size={48} />
          </button>

          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <img 
              src={filteredPhotos[selectedImageIndex].url} 
              alt={filteredPhotos[selectedImageIndex].title} 
              className="lightbox-img"
            />
            <div className="lightbox-caption">
              <h3>{filteredPhotos[selectedImageIndex].title}</h3>
              <p>{filteredPhotos[selectedImageIndex].tag}</p>
            </div>
          </div>

          <button className="lightbox-nav next" onClick={nextImage}>
            <ChevronRight size={48} />
          </button>
        </div>
      )}
    </section>
  );
}
