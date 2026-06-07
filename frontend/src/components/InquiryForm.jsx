import React, { useState } from 'react';
import { Mail, PhoneCall, MapPin, CheckCircle2 } from 'lucide-react';
import { inquiryAPI } from '../utils/api';

export default function InquiryForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    inquiryType: 'Corporate Outing',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await inquiryAPI.create(formData);
      setSuccess(true);
      setFormData({ name: '', email: '', phone: '', inquiryType: 'Corporate Outing', message: '' });
      setTimeout(() => setSuccess(false), 6000);
    } catch (error) {
      console.error('Error submitting inquiry:', error);
      alert('Failed to submit inquiry. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="inquiry" className="section-padding" style={{ background: 'transparent', borderTop: '1px solid var(--border-color)' }}>
      <div className="container">
        <div className="inquiry-split">
          {/* Details Pane */}
          <div className="inquiry-details">
            <h3>Plan Your Outing or Celebration</h3>
            <p>
              Modhera Sunrise Resort features large manicured lawns, traditional gazebos, and thematic setups perfect for corporate team outings, family celebrations, day picnics, and candlelight garden dining.
            </p>

            <div className="inquiry-contact-list">
              <div className="inquiry-contact-item">
                <div className="inquiry-contact-icon">
                  <MapPin size={20} />
                </div>
                <div className="inquiry-contact-text">
                  <h5>Location Address</h5>
                  <p>Behind Modhera Sun Temple, Banks of Pushpavati River, Mehsana, Gujarat</p>
                </div>
              </div>

              <div className="inquiry-contact-item">
                <div className="inquiry-contact-icon">
                  <PhoneCall size={20} />
                </div>
                <div className="inquiry-contact-text">
                  <h5>Reservation Contact</h5>
                  <p>+91 98765 43210 / +91 79 1234 5678</p>
                </div>
              </div>

              <div className="inquiry-contact-item">
                <div className="inquiry-contact-icon">
                  <Mail size={20} />
                </div>
                <div className="inquiry-contact-text">
                  <h5>Email Inquiries</h5>
                  <p>stay@modherasunriseresort.com</p>
                </div>
              </div>
            </div>
          </div>

          {/* Form Pane */}
          <div className="review-form-card" style={{ background: 'var(--white)' }}>
            <h4 style={{ fontSize: '1.4rem', color: 'var(--natural-forest-dark)', marginBottom: '8px' }}>
              Outing & Inquiry Form
            </h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '24px' }}>
              Fill in your details and our hospitality manager will get back to you with custom quotes.
            </p>

            {success ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 0' }}>
                <CheckCircle2 size={48} style={{ color: 'var(--natural-forest)', marginBottom: '16px' }} />
                <h5 style={{ fontWeight: 700, color: 'var(--natural-forest-dark)', fontSize: '1.1rem', marginBottom: '8px' }}>
                  Inquiry Submitted!
                </h5>
                <p style={{ color: 'var(--text-muted)', textAlign: 'center', fontSize: '0.9rem' }}>
                  Our reservation desk will call you back within 2-4 hours. Thank you!
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="inquiry-name">Full Name</label>
                  <input 
                    type="text" 
                    id="inquiry-name" 
                    className="form-input" 
                    placeholder="Enter name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required 
                  />
                </div>

                <div className="grid-2">
                  <div className="form-group">
                    <label htmlFor="inquiry-email">Email ID</label>
                    <input 
                      type="email" 
                      id="inquiry-email" 
                      className="form-input" 
                      placeholder="email@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="inquiry-phone">Phone Number</label>
                    <input 
                      type="tel" 
                      id="inquiry-phone" 
                      className="form-input" 
                      placeholder="e.g. 9876543210"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      required 
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="inquiry-type">Inquiry Category</label>
                  <select 
                    id="inquiry-type" 
                    className="form-input"
                    value={formData.inquiryType}
                    onChange={(e) => setFormData({ ...formData, inquiryType: e.target.value })}
                  >
                    <option value="General">General Inquiry / Custom Booking</option>
                    <option value="Corporate Outing">Corporate Outing / Team Building</option>
                    <option value="Wedding / Social Gathering">Intimate Wedding / Social Gathering</option>
                    <option value="Day Picnic">Day Picnic / Dining Package</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="inquiry-message">Requirements & Messages</label>
                  <textarea 
                    id="inquiry-message" 
                    rows="3" 
                    className="form-textarea" 
                    placeholder="Please specify total guest count, preferred dates, food preferences (e.g. Jain food), etc."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    required
                  ></textarea>
                </div>

                <button 
                  type="submit" 
                  className="btn btn-secondary" 
                  style={{ width: '100%', justifyContent: 'center' }}
                  disabled={submitting}
                >
                  {submitting ? 'Submitting...' : 'Submit Inquiry'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
