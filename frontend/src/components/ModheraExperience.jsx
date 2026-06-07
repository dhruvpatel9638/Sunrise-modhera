import React from 'react';

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
      image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1000&q=85'
    },
    {
      id: 'nature-wellness',
      tag: 'Nature & Wellness',
      title: 'Pushpavati Riverside',
      desc: 'Reconnect with nature beside the gentle waters of the Pushpavati River. Take peaceful morning walks, listen to birds, watch free-roaming peacocks, and experience calming tranquility.',
      image: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=1000&q=85'
    }
  ];

  return (
    <section id="experience" className="section-padding" style={{ background: 'transparent' }}>
      <div className="container">
        
        <div className="text-center">
          <span className="section-subtitle">Storytelling Experience</span>
          <h2 className="section-title">The Modhera Experience</h2>
        </div>

        <div className="experience-container">
          {experiences.map(exp => (
            <div key={exp.id} className="experience-card">
              <div className="experience-card-img-wrapper">
                <img 
                  src={exp.image} 
                  alt={exp.title} 
                  className="experience-card-img" 
                />
              </div>
              <div className="experience-card-text-wrapper">
                <span className="experience-card-tag">{exp.tag}</span>
                <h3 className="experience-card-title">{exp.title}</h3>
                <p className="experience-card-desc">{exp.desc}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
