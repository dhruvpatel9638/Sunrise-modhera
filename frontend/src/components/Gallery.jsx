import React, { useState } from 'react';

const galleryPhotos = [
  {
    id: 1,
    title: 'Traditional Bhunga Mirror Work',
    category: 'heritage',
    url: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=800&q=80',
    tag: 'Heritage & Nature'
  },
  {
    id: 2,
    title: 'Dense Tree Canopy Pathways',
    category: 'heritage',
    url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=800&q=80',
    tag: 'Heritage & Nature'
  },
  {
    id: 3,
    title: 'Resident Peacocks in Garden',
    category: 'heritage',
    url: 'https://images.unsplash.com/photo-1595914757367-bf1b51e06d9d?auto=format&fit=crop&w=800&q=80',
    tag: 'Heritage & Nature'
  },
  {
    id: 4,
    title: 'Integrated Kids Pool Zone',
    category: 'leisure',
    url: 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=800&q=80',
    tag: 'Leisure'
  },
  {
    id: 5,
    title: 'Candlelight Dinner Setup',
    category: 'leisure',
    url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80',
    tag: 'Leisure'
  },
  {
    id: 6,
    title: 'Manicured Lawns at Sunset',
    category: 'leisure',
    url: 'https://images.unsplash.com/photo-1507035895480-2b3156c31fc8?auto=format&fit=crop&w=800&q=80',
    tag: 'Leisure'
  },
  {
    id: 7,
    title: 'Historic Modhera Sun Temple',
    category: 'proximity',
    url: 'https://images.unsplash.com/photo-1600100397608-f010e42ed97c?auto=format&fit=crop&w=800&q=80',
    tag: 'Proximity'
  },
  {
    id: 8,
    title: 'Stone Carvings & Heritage Pillar',
    category: 'proximity',
    url: 'https://images.unsplash.com/photo-1581012733307-2856ce43dccb?auto=format&fit=crop&w=800&q=80',
    tag: 'Proximity'
  },
  {
    id: 9,
    title: 'Sunset Temple Silhouette',
    category: 'proximity',
    url: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=800&q=80',
    tag: 'Proximity'
  }
];

export default function Gallery() {
  const [filter, setFilter] = useState('all');

  const filteredPhotos = filter === 'all' 
    ? galleryPhotos 
    : galleryPhotos.filter(photo => photo.category === filter);

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
          {filteredPhotos.map((photo) => (
            <div className="gallery-item" key={photo.id}>
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
    </section>
  );
}
