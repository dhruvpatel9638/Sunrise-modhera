import React, { useState } from 'react';
import { Star, ChevronLeft, ChevronRight, CheckCircle2 } from 'lucide-react';
import { reviewAPI } from '../utils/api';

export default function ReviewSection({ reviews, onNewReviewAdded }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [formData, setFormData] = useState({
    guestName: '',
    rating: 5,
    comment: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const nextReview = () => {
    setActiveIndex((prev) => (prev + 1) % reviews.length);
  };

  const prevReview = () => {
    setActiveIndex((prev) => (prev - 1 + reviews.length) % reviews.length);
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!formData.guestName || !formData.comment) {
      alert('Please fill out all fields.');
      return;
    }
    setSubmitting(true);
    try {
      const response = await reviewAPI.create(formData);
      onNewReviewAdded(response.data);
      setSuccessMsg('Thank you for sharing your experience!');
      setFormData({ guestName: '', rating: 5, comment: '' });
      setTimeout(() => setSuccessMsg(''), 5000);
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('Failed to submit review. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="reviews" className="section-padding">
      <div className="container">
        <div className="text-center">
          <h2 className="section-title">Guest Testimonials</h2>
          <p className="section-subtitle">
            See why our guests rate us 4.1 / 5 stars on major booking networks.
          </p>
        </div>

        <div className="reviews-layout">
          {/* Left Pane - Testimonials Carousel & Summary */}
          <div>
            <div className="reviews-rating-header">
              <div className="rating-huge">4.1</div>
              <div>
                <div className="rating-stars">
                  {[...Array(4)].map((_, i) => (
                    <Star key={i} size={20} fill="var(--color-gold)" stroke="var(--color-gold)" />
                  ))}
                  <Star size={20} fill="#CCC" stroke="#CCC" /> {/* 4.1/5 approx */}
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted-light)', marginTop: '4px' }}>
                  Based on 350+ certified guest reviews
                </div>
              </div>
            </div>

            {/* What guests love table / grid */}
            <div style={{ marginBottom: '32px', background: 'rgba(12, 31, 18, 0.72)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.18)', borderRadius: '16px', padding: '20px' }}>
              <h4 style={{ color: '#E8CA7A', fontSize: '1rem', fontWeight: 600, marginBottom: '12px' }}>
                🟢 What Guests Love Most:
              </h4>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '0.9rem', color: 'rgba(255, 255, 255, 0.80)' }}>
                  <CheckCircle2 size={16} style={{ color: '#7DBFA3', marginTop: '2px', flexShrink: 0 }} />
                  <span><strong style={{ color: '#FFFFFF' }}>Unbeatable Location:</strong> Immediate walking access behind the Modhera Sun Temple simplifies morning & evening visits.</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '0.9rem', color: 'rgba(255, 255, 255, 0.80)' }}>
                  <CheckCircle2 size={16} style={{ color: '#7DBFA3', marginTop: '2px', flexShrink: 0 }} />
                  <span><strong style={{ color: '#FFFFFF' }}>Ambiance & Nature:</strong> Peaceful forest atmosphere, dense canopies, and beautiful peacocks roaming free.</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '0.9rem', color: 'rgba(255, 255, 255, 0.80)' }}>
                  <CheckCircle2 size={16} style={{ color: '#7DBFA3', marginTop: '2px', flexShrink: 0 }} />
                  <span><strong style={{ color: '#FFFFFF' }}>Authentic Food:</strong> Highly rated for fresh, delicious, hot 100% vegetarian regional meals.</span>
                </li>
              </ul>
            </div>

            {/* Review Slider */}
            {reviews.length > 0 && (
              <div className="reviews-carousel">
                <div className="review-slider-content">
                  <div className="rating-stars" style={{ marginBottom: '16px' }}>
                    {[...Array(reviews[activeIndex].rating)].map((_, i) => (
                      <Star key={i} size={16} fill="var(--color-gold)" stroke="var(--color-gold)" />
                    ))}
                    {[...Array(5 - reviews[activeIndex].rating)].map((_, i) => (
                      <Star key={i} size={16} fill="#CCC" stroke="#CCC" />
                    ))}
                  </div>
                  <p className="review-text">"{reviews[activeIndex].comment}"</p>
                  <h5 className="review-author">{reviews[activeIndex].guestName}</h5>
                  <span className="review-date">{reviews[activeIndex].date}</span>
                </div>

                <div className="carousel-nav">
                  <button className="carousel-btn" onClick={prevReview}>
                    <ChevronLeft size={20} />
                  </button>
                  <button className="carousel-btn" onClick={nextReview}>
                    <ChevronRight size={20} />
                  </button>
                  <span style={{ marginLeft: 'auto', alignSelf: 'center', fontSize: '0.85rem', color: 'var(--color-text-muted-light)' }}>
                    {activeIndex + 1} of {reviews.length}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Right Pane - Form Card */}
          <div className="review-form-card">
            <h3 style={{ fontSize: '1.4rem', color: '#162F1E', marginBottom: '8px' }}>
              Share Your Memory
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#3a5a42', marginBottom: '24px' }}>
              Have you stayed with us? We would love to hear your feedback about our nature-embraced resort.
            </p>

            {successMsg ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '30px 0' }}>
                <CheckCircle2 size={48} style={{ color: 'var(--color-primary)', marginBottom: '16px' }} />
                <p style={{ fontWeight: 600, color: 'var(--color-primary-dark)', textAlign: 'center' }}>{successMsg}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmitReview}>
                <div className="form-group">
                  <label htmlFor="guestName">Your Full Name</label>
                  <input 
                    type="text" 
                    id="guestName" 
                    className="form-input"
                    placeholder="e.g. Ramesh Patel" 
                    value={formData.guestName}
                    onChange={(e) => setFormData({ ...formData, guestName: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Your Rating</label>
                  <div className="star-rating-select">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        className={`star-select-btn ${formData.rating >= star ? 'active' : ''}`}
                        onClick={() => setFormData({ ...formData, rating: star })}
                      >
                        <Star size={24} fill={formData.rating >= star ? 'var(--color-gold)' : 'transparent'} />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="comment">Your Experience</label>
                  <textarea 
                    id="comment" 
                    rows="4" 
                    className="form-textarea" 
                    placeholder="Describe your room, service, proximity to temple, and veg meals..."
                    value={formData.comment}
                    onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                    required
                  ></textarea>
                </div>

                <button 
                  type="submit" 
                  className="btn btn-primary" 
                  style={{ width: '100%', justifyContent: 'center' }}
                  disabled={submitting}
                >
                  {submitting ? 'Submitting...' : 'Submit Review'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
