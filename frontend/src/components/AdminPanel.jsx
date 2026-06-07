import React, { useState, useEffect } from 'react';
import { Calendar, Users, Phone, Mail, Trash2, CheckCircle2, MessageSquare, Landmark, Star, Home, Edit2, Save, X } from 'lucide-react';
import { bookingAPI, inquiryAPI, reviewAPI } from '../utils/api';

export default function AdminPanel({ isAuthenticated = false, onLoginSuccess, activeTab: propActiveTab, setActiveTab: propSetActiveTab, onBackToHome }) {
  const [bookings, setBookings] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [reviews, setReviews] = useState([]);
  
  const [localActiveTab, setLocalActiveTab] = useState('bookings');
  const activeTab = propActiveTab || localActiveTab;
  const setActiveTab = propSetActiveTab || setLocalActiveTab;
  const [loading, setLoading] = useState(true);
  const [actionMessage, setActionMessage] = useState('');

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  const [bookingSortOrder, setBookingSortOrder] = useState('newest');
  const [bookingFilterDate, setBookingFilterDate] = useState('');
  const [reviewSortOrder, setReviewSortOrder] = useState('newest');
  const [reviewFilterDate, setReviewFilterDate] = useState('');

  const [editingBookingId, setEditingBookingId] = useState(null);
  const [editingBookingData, setEditingBookingData] = useState({});
  const [editingReviewId, setEditingReviewId] = useState(null);
  const [editingReviewData, setEditingReviewData] = useState({});

  const handleEditBooking = (booking) => {
    setEditingBookingId(booking._id);
    setEditingBookingData({ ...booking });
  };

  const handleCancelEditBooking = () => {
    setEditingBookingId(null);
    setEditingBookingData({});
  };

  const handleSaveBooking = async (id) => {
    try {
      if (!editingBookingData.guestName || !editingBookingData.guestEmail || !editingBookingData.guestPhone) {
        alert('Guest details cannot be empty.');
        return;
      }
      await bookingAPI.update(id, editingBookingData);
      setBookings(prev => prev.map(b => b._id === id ? { ...b, ...editingBookingData } : b));
      setEditingBookingId(null);
      setEditingBookingData({});
      showMessage('Booking updated successfully.');
    } catch (err) {
      console.error(err);
      alert('Failed to save booking updates.');
    }
  };

  const handleEditReview = (review) => {
    setEditingReviewId(review._id);
    setEditingReviewData({ ...review });
  };

  const handleCancelEditReview = () => {
    setEditingReviewId(null);
    setEditingReviewData({});
  };

  const handleSaveReview = async (id) => {
    try {
      if (!editingReviewData.guestName || !editingReviewData.comment) {
        alert('Reviewer name and comment cannot be empty.');
        return;
      }
      await reviewAPI.update(id, editingReviewData);
      setReviews(prev => prev.map(r => r._id === id ? { ...r, ...editingReviewData } : r));
      setEditingReviewId(null);
      setEditingReviewData({});
      showMessage('Review updated successfully.');
    } catch (err) {
      console.error(err);
      alert('Failed to save review updates.');
    }
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (username.trim() === 'sunrise@123' && password === 'Sunrise_001') {
      setLoginError('');
      if (onLoginSuccess) {
        onLoginSuccess();
      }
    } else {
      setLoginError('Invalid User ID or Password.');
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const [bookingsRes, inquiriesRes, reviewsRes] = await Promise.all([
        bookingAPI.getAll(),
        inquiryAPI.getAll(),
        reviewAPI.getAllAdmin()
      ]);
      setBookings(bookingsRes.data || []);
      setInquiries(inquiriesRes.data || []);
      setReviews(reviewsRes.data || []);
    } catch (error) {
      console.error('Error fetching admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated]);

  const showMessage = (msg) => {
    setActionMessage(msg);
    setTimeout(() => setActionMessage(''), 4000);
  };

  const handleDeleteBooking = async (id) => {
    if (!window.confirm('Are you sure you want to cancel and delete this reservation?')) return;
    try {
      await bookingAPI.delete(id);
      setBookings(prev => prev.filter(b => b._id !== id));
      showMessage('Reservation deleted successfully.');
    } catch (err) {
      console.error(err);
      alert('Failed to delete booking.');
    }
  };

  const handleDeleteInquiry = async (id) => {
    if (!window.confirm('Are you sure you want to delete this inquiry?')) return;
    try {
      await inquiryAPI.delete(id);
      setInquiries(prev => prev.filter(i => i._id !== id));
      showMessage('Inquiry deleted successfully.');
    } catch (err) {
      console.error(err);
      alert('Failed to delete inquiry.');
    }
  };

  const handleDeleteReview = async (id) => {
    if (!window.confirm('Are you sure you want to delete this review?')) return;
    try {
      await reviewAPI.delete(id);
      setReviews(prev => prev.filter(r => r._id !== id));
      showMessage('Review deleted successfully.');
    } catch (err) {
      console.error(err);
      alert('Failed to delete review.');
    }
  };

  const handleApproveReview = async (id) => {
    try {
      await reviewAPI.approve(id);
      setReviews(prev => prev.map(r => r._id === id ? { ...r, approved: true } : r));
      showMessage('Review approved and published successfully.');
    } catch (err) {
      console.error(err);
      alert('Failed to approve review.');
    }
  };

  // Compute stat totals
  const totalRevenue = bookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0);

  const filteredAndSortedBookings = bookings
    .filter(b => {
      if (!bookingFilterDate) return true;
      return (b.checkInDate && b.checkInDate.includes(bookingFilterDate)) || 
             (b.checkOutDate && b.checkOutDate.includes(bookingFilterDate));
    })
    .sort((a, b) => {
      const dateA = new Date(a.checkInDate || a.createdAt || 0);
      const dateB = new Date(b.checkInDate || b.createdAt || 0);
      return bookingSortOrder === 'newest' ? dateB - dateA : dateA - dateB;
    });

  const filteredAndSortedReviews = reviews
    .filter(r => {
      if (!reviewFilterDate) return true;
      try {
        const revDate = new Date(r.date);
        const filterDate = new Date(reviewFilterDate);
        if (isNaN(revDate.getTime()) || isNaN(filterDate.getTime())) {
          return r.date.toLowerCase().includes(reviewFilterDate.toLowerCase());
        }
        return revDate.toDateString() === filterDate.toDateString();
      } catch (e) {
        return r.date.toLowerCase().includes(reviewFilterDate.toLowerCase());
      }
    })
    .sort((a, b) => {
      const dateA = new Date(a.date || a.createdAt || 0);
      const dateB = new Date(b.date || b.createdAt || 0);
      return reviewSortOrder === 'newest' ? dateB - dateA : dateA - dateB;
    });


  if (!isAuthenticated) {
    return (
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        minHeight: '80vh', 
        padding: '120px 24px 80px',
        background: 'transparent'
      }}>
        <div className="review-form-card" style={{ width: '100%', maxWidth: '400px', background: 'var(--white)' }}>
          <div className="text-center" style={{ marginBottom: '24px' }}>
            <Landmark size={40} style={{ color: 'var(--primary-sunrise)', marginBottom: '12px' }} />
            <h2 style={{ fontSize: '2rem', fontFamily: 'var(--font-headings)', color: 'var(--natural-forest-dark)', marginBottom: '8px' }}>
              Staff Login
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              Access the Modhera Sunrise management portal
            </p>
          </div>

          {loginError && (
            <div style={{ 
              background: '#FCE8E6', 
              color: '#A82515', 
              borderLeft: '4px solid #A82515', 
              padding: '12px 16px', 
              borderRadius: '0 var(--radius-sm) var(--radius-sm) 0', 
              marginBottom: '16px', 
              fontSize: '0.85rem',
              fontWeight: 500
            }}>
              {loginError}
            </div>
          )}

          <form onSubmit={handleLoginSubmit}>
            <div className="form-group" style={{ marginBottom: '16px' }}>
              <label htmlFor="login-username" style={{ display: 'block', marginBottom: '6px', fontWeight: 600, fontSize: '0.85rem' }}>User ID</label>
              <input 
                type="text" 
                id="login-username" 
                className="form-input" 
                placeholder="Enter admin ID"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required 
              />
            </div>

            <div className="form-group" style={{ marginBottom: '24px' }}>
              <label htmlFor="login-password" style={{ display: 'block', marginBottom: '6px', fontWeight: 600, fontSize: '0.85rem' }}>Password</label>
              <input 
                type="password" 
                id="login-password" 
                className="form-input" 
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
              />
            </div>

            <button 
              type="submit" 
              className="btn btn-secondary" 
              style={{ width: '100%', justifyContent: 'center', fontWeight: 'bold', height: '48px' }}
            >
              Sign In
            </button>

            <button 
              type="button"
              onClick={onBackToHome}
              className="btn btn-outline" 
              style={{ width: '100%', justifyContent: 'center', marginTop: '12px', height: '48px', border: 'none', background: 'none', color: 'var(--text-muted)' }}
            >
              Cancel
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div id="admin-panel" style={{ paddingTop: '100px', minHeight: '100vh', background: 'transparent' }}>
      <div className="container" style={{ paddingBottom: '80px' }}>
        


        <div className="text-center" style={{ marginBottom: '40px' }}>
          <h1 style={{ fontSize: '3rem', fontFamily: 'var(--font-headings)', color: 'var(--natural-forest-dark)' }}>
            Admin Management Portal
          </h1>
          <p style={{ color: 'var(--text-muted)', fontStyle: 'italic', marginTop: '8px' }}>
            Resort Overview, Reservation Invoices, Outing Inquiries, and Testimonials
          </p>
        </div>

        {actionMessage && (
          <div style={{ 
            background: 'rgba(30, 91, 58, 0.1)', 
            color: 'var(--natural-forest-dark)', 
            borderLeft: '4px solid var(--natural-forest)', 
            padding: '16px 20px', 
            borderRadius: '0 var(--radius-md) var(--radius-md) 0', 
            marginBottom: '24px', 
            fontSize: '0.95rem', 
            fontWeight: 500, 
            maxWidth: '1200px', 
            margin: '0 auto 24px auto',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <CheckCircle2 size={18} />
            <span>{actionMessage}</span>
          </div>
        )}

        {/* Stats Dashboard Grid */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', 
          gap: '20px', 
          marginBottom: '40px' 
        }}>
          <div className="review-form-card" style={{ background: 'var(--white)', padding: '24px', textAlign: 'center' }}>
            <span style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-muted)' }}>Total Bookings</span>
            <h2 style={{ fontSize: '2.5rem', color: 'var(--natural-forest-dark)', margin: '8px 0 0 0' }}>{bookings.length}</h2>
          </div>
          <div className="review-form-card" style={{ background: 'var(--white)', padding: '24px', textAlign: 'center' }}>
            <span style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-muted)' }}>Estimated Revenue</span>
            <h2 style={{ fontSize: '2.5rem', color: 'var(--primary-sunrise-dark)', margin: '8px 0 0 0' }}>₹{totalRevenue.toLocaleString('en-IN')}</h2>
          </div>
          <div className="review-form-card" style={{ background: 'var(--white)', padding: '24px', textAlign: 'center' }}>
            <span style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-muted)' }}>Pending Inquiries</span>
            <h2 style={{ fontSize: '2.5rem', color: 'var(--natural-forest-dark)', margin: '8px 0 0 0' }}>{inquiries.length}</h2>
          </div>
          <div className="review-form-card" style={{ background: 'var(--white)', padding: '24px', textAlign: 'center' }}>
            <span style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-muted)' }}>Testimonials Moderated</span>
            <h2 style={{ fontSize: '2.5rem', color: 'var(--natural-forest-dark)', margin: '8px 0 0 0' }}>{reviews.length}</h2>
          </div>
        </div>

        {/* Tab Selection Row */}
        <div className="gallery-filters" style={{ marginBottom: '30px' }}>
          <button 
            className={`filter-btn ${activeTab === 'bookings' ? 'active' : ''}`}
            onClick={() => setActiveTab('bookings')}
          >
            Reservations ({bookings.length})
          </button>
          <button 
            className={`filter-btn ${activeTab === 'inquiries' ? 'active' : ''}`}
            onClick={() => setActiveTab('inquiries')}
          >
            Outing Inquiries ({inquiries.length})
          </button>
          <button 
            className={`filter-btn ${activeTab === 'reviews' ? 'active' : ''}`}
            onClick={() => setActiveTab('reviews')}
          >
            Reviews & Testimonials ({reviews.length})
          </button>
        </div>

        {/* Tab Contents Panel */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
            <div className="loader-spinner" style={{ margin: '0 auto 20px auto' }}></div>
            <p>Loading records...</p>
          </div>
        ) : (
          <div className="review-form-card" style={{ background: 'var(--white)', padding: '32px', overflowX: 'auto' }}>
            
            {/* 1. BOOKINGS TAB */}
            {activeTab === 'bookings' && (
              <>
                {/* Bookings Filters */}
                <div style={{ 
                  display: 'flex', 
                  flexWrap: 'wrap', 
                  gap: '16px', 
                  alignItems: 'center', 
                  justifyContent: 'space-between',
                  marginBottom: '20px',
                  padding: '12px 16px',
                  background: 'var(--bg-cream)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-color)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--natural-forest-dark)' }}>Filter Date:</label>
                      <input 
                        type="date" 
                        value={bookingFilterDate}
                        onChange={(e) => setBookingFilterDate(e.target.value)}
                        style={{
                          padding: '6px 12px',
                          borderRadius: 'var(--radius-sm)',
                          border: '1px solid var(--border-color)',
                          outline: 'none',
                          fontSize: '0.9rem'
                        }}
                      />
                    </div>
                    {bookingFilterDate && (
                      <button 
                        onClick={() => setBookingFilterDate('')}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#A82515',
                          cursor: 'pointer',
                          fontSize: '0.85rem',
                          fontWeight: 500
                        }}
                      >
                        Clear
                      </button>
                    )}
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--natural-forest-dark)' }}>Sort by Date:</label>
                    <select
                      value={bookingSortOrder}
                      onChange={(e) => setBookingSortOrder(e.target.value)}
                      style={{
                        padding: '6px 12px',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid var(--border-color)',
                        outline: 'none',
                        fontSize: '0.9rem',
                        background: 'var(--white)'
                      }}
                    >
                      <option value="newest">Newest First</option>
                      <option value="oldest">Oldest First</option>
                    </select>
                  </div>
                </div>

                {filteredAndSortedBookings.length === 0 ? (
                  <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No bookings match the filter criteria.</p>
                ) : (
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '700px' }}>
                    <thead>
                      <tr style={{ borderBottom: '2px solid var(--border-color)', color: 'var(--natural-forest)' }}>
                        <th style={{ padding: '12px' }}>Guest Details</th>
                        <th style={{ padding: '12px' }}>Accommodation</th>
                        <th style={{ padding: '12px' }}>Check-In / Out</th>
                        <th style={{ padding: '12px' }}>Price Due</th>
                        <th style={{ padding: '12px', textAlign: 'center' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredAndSortedBookings.map(b => (
                        <tr key={b._id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                          {editingBookingId === b._id ? (
                            <>
                              <td style={{ padding: '16px 12px' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                  <input 
                                    type="text" 
                                    value={editingBookingData.guestName || ''}
                                    onChange={(e) => setEditingBookingData({ ...editingBookingData, guestName: e.target.value })}
                                    style={{ padding: '4px 8px', fontSize: '0.9rem', border: '1px solid var(--border-color)', borderRadius: '4px' }}
                                    placeholder="Name"
                                  />
                                  <input 
                                    type="email" 
                                    value={editingBookingData.guestEmail || ''}
                                    onChange={(e) => setEditingBookingData({ ...editingBookingData, guestEmail: e.target.value })}
                                    style={{ padding: '4px 8px', fontSize: '0.85rem', border: '1px solid var(--border-color)', borderRadius: '4px' }}
                                    placeholder="Email"
                                  />
                                  <input 
                                    type="text" 
                                    value={editingBookingData.guestPhone || ''}
                                    onChange={(e) => setEditingBookingData({ ...editingBookingData, guestPhone: e.target.value })}
                                    style={{ padding: '4px 8px', fontSize: '0.85rem', border: '1px solid var(--border-color)', borderRadius: '4px' }}
                                    placeholder="Phone"
                                  />
                                </div>
                              </td>
                              <td style={{ padding: '16px 12px' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                  <input 
                                    type="text" 
                                    value={editingBookingData.roomTitle || ''}
                                    onChange={(e) => setEditingBookingData({ ...editingBookingData, roomTitle: e.target.value })}
                                    style={{ padding: '4px 8px', fontSize: '0.9rem', border: '1px solid var(--border-color)', borderRadius: '4px' }}
                                    placeholder="Room Title"
                                  />
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <input 
                                      type="number" 
                                      value={editingBookingData.guestsCount || 1}
                                      onChange={(e) => setEditingBookingData({ ...editingBookingData, guestsCount: Number(e.target.value) })}
                                      style={{ width: '60px', padding: '4px 8px', fontSize: '0.85rem', border: '1px solid var(--border-color)', borderRadius: '4px' }}
                                      min={1}
                                    />
                                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Guest(s)</span>
                                  </div>
                                </div>
                              </td>
                              <td style={{ padding: '16px 12px' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <span style={{ fontSize: '0.75rem', width: '35px' }}>In:</span>
                                    <input 
                                      type="date" 
                                      value={editingBookingData.checkInDate || ''}
                                      onChange={(e) => setEditingBookingData({ ...editingBookingData, checkInDate: e.target.value })}
                                      style={{ padding: '4px 8px', fontSize: '0.85rem', border: '1px solid var(--border-color)', borderRadius: '4px' }}
                                    />
                                  </div>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <span style={{ fontSize: '0.75rem', width: '35px' }}>Out:</span>
                                    <input 
                                      type="date" 
                                      value={editingBookingData.checkOutDate || ''}
                                      onChange={(e) => setEditingBookingData({ ...editingBookingData, checkOutDate: e.target.value })}
                                      style={{ padding: '4px 8px', fontSize: '0.85rem', border: '1px solid var(--border-color)', borderRadius: '4px' }}
                                    />
                                  </div>
                                </div>
                              </td>
                              <td style={{ padding: '16px 12px' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <span>₹</span>
                                    <input 
                                      type="number" 
                                      value={editingBookingData.totalAmount || 0}
                                      onChange={(e) => setEditingBookingData({ ...editingBookingData, totalAmount: Number(e.target.value) })}
                                      style={{ width: '100px', padding: '4px 8px', fontSize: '0.9rem', border: '1px solid var(--border-color)', borderRadius: '4px' }}
                                      min={0}
                                    />
                                  </div>
                                  <span style={{ fontSize: '0.75rem', color: '#3B7A57', fontWeight: 600 }}>Mock Sandbox</span>
                                </div>
                              </td>
                              <td style={{ padding: '16px 12px', textAlign: 'center' }}>
                                <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
                                  <button 
                                    onClick={() => handleSaveBooking(b._id)}
                                    style={{
                                      background: 'none',
                                      border: 'none',
                                      color: '#1E5B3A',
                                      cursor: 'pointer',
                                      padding: '6px',
                                      borderRadius: '4px',
                                      transition: 'background 0.2s'
                                    }}
                                    onMouseOver={(e) => e.currentTarget.style.background = 'rgba(30, 91, 58, 0.1)'}
                                    onMouseOut={(e) => e.currentTarget.style.background = 'none'}
                                    title="Save changes"
                                  >
                                    <Save size={18} />
                                  </button>
                                  <button 
                                    onClick={handleCancelEditBooking}
                                    style={{
                                      background: 'none',
                                      border: 'none',
                                      color: '#A82515',
                                      cursor: 'pointer',
                                      padding: '6px',
                                      borderRadius: '4px',
                                      transition: 'background 0.2s'
                                    }}
                                    onMouseOver={(e) => e.currentTarget.style.background = '#FCE8E6'}
                                    onMouseOut={(e) => e.currentTarget.style.background = 'none'}
                                    title="Cancel edit"
                                  >
                                    <X size={18} />
                                  </button>
                                </div>
                              </td>
                            </>
                          ) : (
                            <>
                              <td style={{ padding: '16px 12px' }}>
                                <div style={{ fontWeight: 600, color: 'var(--text-charcoal)' }}>{b.guestName}</div>
                                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '2px', marginTop: '4px' }}>
                                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Mail size={12} /> {b.guestEmail}</span>
                                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Phone size={12} /> {b.guestPhone}</span>
                                </div>
                              </td>
                              <td style={{ padding: '16px 12px' }}>
                                <div style={{ fontWeight: 500, color: 'var(--text-charcoal)' }}>{b.roomTitle}</div>
                                <span className="amenity-tag" style={{ fontSize: '0.7rem', display: 'inline-block', marginTop: '4px' }}>
                                  {b.guestsCount} Guest(s)
                                </span>
                              </td>
                              <td style={{ padding: '16px 12px' }}>
                                <div style={{ fontSize: '0.9rem', color: 'var(--text-charcoal)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                  <Calendar size={14} style={{ color: 'var(--primary-sunrise)' }} />
                                  <span>{b.checkInDate} to {b.checkOutDate}</span>
                                </div>
                                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginTop: '4px' }}>
                                  Reference: {b._id}
                                </span>
                              </td>
                              <td style={{ padding: '16px 12px' }}>
                                <strong style={{ color: 'var(--primary-sunrise-dark)' }}>₹{b.totalAmount ? b.totalAmount.toLocaleString('en-IN') : 'N/A'}</strong>
                                <span style={{ fontSize: '0.75rem', color: '#3B7A57', display: 'block', fontWeight: 600, marginTop: '2px' }}>
                                  ✓ Paid via Mock Sandbox
                                </span>
                              </td>
                              <td style={{ padding: '16px 12px', textAlign: 'center' }}>
                                <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
                                  <button 
                                    onClick={() => handleEditBooking(b)}
                                    style={{ 
                                      background: 'none', 
                                      border: 'none', 
                                      color: 'var(--primary-sunrise-dark)', 
                                      cursor: 'pointer',
                                      padding: '8px',
                                      borderRadius: '4px',
                                      transition: 'background 0.2s'
                                    }}
                                    onMouseOver={(e) => e.currentTarget.style.background = 'var(--primary-sunrise-light)'}
                                    onMouseOut={(e) => e.currentTarget.style.background = 'none'}
                                    title="Edit booking"
                                  >
                                    <Edit2 size={18} />
                                  </button>
                                  <button 
                                    onClick={() => handleDeleteBooking(b._id)}
                                    style={{ 
                                      background: 'none', 
                                      border: 'none', 
                                      color: '#A82515', 
                                      cursor: 'pointer',
                                      padding: '8px',
                                      borderRadius: '4px',
                                      transition: 'background 0.2s'
                                    }}
                                    onMouseOver={(e) => e.currentTarget.style.background = '#FCE8E6'}
                                    onMouseOut={(e) => e.currentTarget.style.background = 'none'}
                                    title="Delete booking"
                                  >
                                    <Trash2 size={18} />
                                  </button>
                                </div>
                              </td>
                            </>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </>
            )}

            {/* 2. INQUIRIES TAB */}
            {activeTab === 'inquiries' && (
              <>
                {inquiries.length === 0 ? (
                  <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No event or general inquiries found.</p>
                ) : (
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '700px' }}>
                    <thead>
                      <tr style={{ borderBottom: '2px solid var(--border-color)', color: 'var(--natural-forest)' }}>
                        <th style={{ padding: '12px' }}>Contact Person</th>
                        <th style={{ padding: '12px' }}>Inquiry Category</th>
                        <th style={{ padding: '12px' }}>Requirements & message</th>
                        <th style={{ padding: '12px' }}>Date Received</th>
                        <th style={{ padding: '12px', textAlign: 'center' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {inquiries.map(inq => (
                        <tr key={inq._id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                          <td style={{ padding: '16px 12px' }}>
                            <div style={{ fontWeight: 600, color: 'var(--text-charcoal)' }}>{inq.name}</div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '2px', marginTop: '4px' }}>
                              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Mail size={12} /> {inq.email}</span>
                              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Phone size={12} /> {inq.phone}</span>
                            </div>
                          </td>
                          <td style={{ padding: '16px 12px' }}>
                            <span className="amenity-tag" style={{ background: 'var(--primary-sunrise-light)', color: 'var(--primary-sunrise-dark)', fontWeight: 600 }}>
                              {inq.inquiryType}
                            </span>
                          </td>
                          <td style={{ padding: '16px 12px', maxWidth: '350px' }}>
                            <p style={{ fontSize: '0.9rem', color: 'var(--text-charcoal)', margin: 0, whiteSpace: 'pre-wrap' }}>
                              "{inq.message}"
                            </p>
                          </td>
                          <td style={{ padding: '16px 12px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                            {inq.date || inq.createdAt?.split('T')[0] || 'N/A'}
                          </td>
                          <td style={{ padding: '16px 12px', textAlign: 'center' }}>
                            <button 
                              onClick={() => handleDeleteInquiry(inq._id)}
                              style={{ 
                                background: 'none', 
                                border: 'none', 
                                color: '#A82515', 
                                cursor: 'pointer',
                                padding: '8px',
                                borderRadius: '4px',
                                transition: 'background 0.2s'
                              }}
                              onMouseOver={(e) => e.currentTarget.style.background = '#FCE8E6'}
                              onMouseOut={(e) => e.currentTarget.style.background = 'none'}
                              title="Delete inquiry"
                            >
                              <Trash2 size={18} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </>
            )}

            {/* 3. REVIEWS TAB */}
            {activeTab === 'reviews' && (
              <>
                {/* Reviews Filters */}
                <div style={{ 
                  display: 'flex', 
                  flexWrap: 'wrap', 
                  gap: '16px', 
                  alignItems: 'center', 
                  justifyContent: 'space-between',
                  marginBottom: '20px',
                  padding: '12px 16px',
                  background: 'var(--bg-cream)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-color)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--natural-forest-dark)' }}>Filter Date:</label>
                      <input 
                        type="date" 
                        value={reviewFilterDate}
                        onChange={(e) => setReviewFilterDate(e.target.value)}
                        style={{
                          padding: '6px 12px',
                          borderRadius: 'var(--radius-sm)',
                          border: '1px solid var(--border-color)',
                          outline: 'none',
                          fontSize: '0.9rem'
                        }}
                      />
                    </div>
                    {reviewFilterDate && (
                      <button 
                        onClick={() => setReviewFilterDate('')}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#A82515',
                          cursor: 'pointer',
                          fontSize: '0.85rem',
                          fontWeight: 500
                        }}
                      >
                        Clear
                      </button>
                    )}
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--natural-forest-dark)' }}>Sort by Date:</label>
                    <select
                      value={reviewSortOrder}
                      onChange={(e) => setReviewSortOrder(e.target.value)}
                      style={{
                        padding: '6px 12px',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid var(--border-color)',
                        outline: 'none',
                        fontSize: '0.9rem',
                        background: 'var(--white)'
                      }}
                    >
                      <option value="newest">Newest First</option>
                      <option value="oldest">Oldest First</option>
                    </select>
                  </div>
                </div>

                {filteredAndSortedReviews.length === 0 ? (
                  <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No reviews match the filter criteria.</p>
                ) : (
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '700px' }}>
                    <thead>
                      <tr style={{ borderBottom: '2px solid var(--border-color)', color: 'var(--natural-forest)' }}>
                        <th style={{ padding: '12px' }}>Author</th>
                        <th style={{ padding: '12px' }}>Rating</th>
                        <th style={{ padding: '12px' }}>Review Comment</th>
                        <th style={{ padding: '12px' }}>Date</th>
                        <th style={{ padding: '12px', textAlign: 'center' }}>Status & Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredAndSortedReviews.map(rev => (
                        <tr key={rev._id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                          {editingReviewId === rev._id ? (
                            <>
                              <td style={{ padding: '16px 12px' }}>
                                <input 
                                  type="text" 
                                  value={editingReviewData.guestName || ''}
                                  onChange={(e) => setEditingReviewData({ ...editingReviewData, guestName: e.target.value })}
                                  style={{ padding: '4px 8px', fontSize: '0.9rem', border: '1px solid var(--border-color)', borderRadius: '4px', width: '120px' }}
                                  placeholder="Name"
                                />
                              </td>
                              <td style={{ padding: '16px 12px' }}>
                                <select 
                                  value={editingReviewData.rating || 5}
                                  onChange={(e) => setEditingReviewData({ ...editingReviewData, rating: Number(e.target.value) })}
                                  style={{ padding: '4px 8px', fontSize: '0.9rem', border: '1px solid var(--border-color)', borderRadius: '4px', background: 'var(--white)' }}
                                >
                                  <option value="5">5 Stars</option>
                                  <option value="4">4 Stars</option>
                                  <option value="3">3 Stars</option>
                                  <option value="2">2 Stars</option>
                                  <option value="1">1 Star</option>
                                </select>
                              </td>
                              <td style={{ padding: '16px 12px', maxWidth: '300px' }}>
                                <textarea 
                                  value={editingReviewData.comment || ''}
                                  onChange={(e) => setEditingReviewData({ ...editingReviewData, comment: e.target.value })}
                                  style={{ padding: '6px 8px', fontSize: '0.85rem', border: '1px solid var(--border-color)', borderRadius: '4px', width: '100%', minHeight: '60px', resize: 'vertical' }}
                                  placeholder="Comment"
                                />
                              </td>
                              <td style={{ padding: '16px 12px' }}>
                                <input 
                                  type="text" 
                                  value={editingReviewData.date || ''}
                                  onChange={(e) => setEditingReviewData({ ...editingReviewData, date: e.target.value })}
                                  style={{ padding: '4px 8px', fontSize: '0.85rem', border: '1px solid var(--border-color)', borderRadius: '4px', width: '110px' }}
                                  placeholder="Date"
                                />
                              </td>
                              <td style={{ padding: '16px 12px', textAlign: 'center' }}>
                                <div style={{ display: 'flex', gap: '6px', justifyContent: 'center', alignItems: 'center' }}>
                                  <button 
                                    onClick={() => handleSaveReview(rev._id)}
                                    style={{
                                      background: 'none',
                                      border: 'none',
                                      color: '#1E5B3A',
                                      cursor: 'pointer',
                                      padding: '6px',
                                      borderRadius: '4px',
                                      transition: 'background 0.2s'
                                    }}
                                    onMouseOver={(e) => e.currentTarget.style.background = 'rgba(30, 91, 58, 0.1)'}
                                    onMouseOut={(e) => e.currentTarget.style.background = 'none'}
                                    title="Save changes"
                                  >
                                    <Save size={18} />
                                  </button>
                                  <button 
                                    onClick={handleCancelEditReview}
                                    style={{
                                      background: 'none',
                                      border: 'none',
                                      color: '#A82515',
                                      cursor: 'pointer',
                                      padding: '6px',
                                      borderRadius: '4px',
                                      transition: 'background 0.2s'
                                    }}
                                    onMouseOver={(e) => e.currentTarget.style.background = '#FCE8E6'}
                                    onMouseOut={(e) => e.currentTarget.style.background = 'none'}
                                    title="Cancel edit"
                                  >
                                    <X size={18} />
                                  </button>
                                </div>
                              </td>
                            </>
                          ) : (
                            <>
                              <td style={{ padding: '16px 12px', fontWeight: 600, color: 'var(--text-charcoal)' }}>
                                {rev.guestName}
                              </td>
                              <td style={{ padding: '16px 12px' }}>
                                <div style={{ display: 'flex', color: 'var(--primary-sunrise)' }}>
                                  {[...Array(rev.rating)].map((_, i) => (
                                    <Star key={i} size={14} fill="var(--primary-sunrise)" stroke="var(--primary-sunrise)" />
                                  ))}
                                  {[...Array(5 - rev.rating)].map((_, i) => (
                                    <Star key={i} size={14} fill="none" stroke="#CCC" />
                                  ))}
                                </div>
                              </td>
                              <td style={{ padding: '16px 12px', maxWidth: '300px' }}>
                                <p style={{ fontSize: '0.85rem', color: 'var(--text-charcoal)', fontStyle: 'italic', margin: 0 }}>
                                  "{rev.comment}"
                                </p>
                              </td>
                              <td style={{ padding: '16px 12px', fontSize: '0.85rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                                {rev.date || 'N/A'}
                              </td>
                              <td style={{ padding: '16px 12px', textAlign: 'center' }}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                                  {!rev.approved ? (
                                    <button 
                                      onClick={() => handleApproveReview(rev._id)}
                                      className="btn btn-primary"
                                      style={{ 
                                        padding: '6px 12px', 
                                        fontSize: '0.75rem', 
                                        borderRadius: '4px',
                                        fontWeight: 'bold',
                                        cursor: 'pointer'
                                      }}
                                    >
                                      Approve
                                    </button>
                                  ) : (
                                    <span style={{ fontSize: '0.85rem', color: '#3B7A57', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                      ✓ Live
                                    </span>
                                  )}
                                  
                                  <button 
                                    onClick={() => handleEditReview(rev)}
                                    style={{ 
                                      background: 'none', 
                                      border: 'none', 
                                      color: 'var(--primary-sunrise-dark)', 
                                      cursor: 'pointer',
                                      padding: '8px',
                                      borderRadius: '4px',
                                      transition: 'background 0.2s'
                                    }}
                                    onMouseOver={(e) => e.currentTarget.style.background = 'var(--primary-sunrise-light)'}
                                    onMouseOut={(e) => e.currentTarget.style.background = 'none'}
                                    title="Edit review"
                                  >
                                    <Edit2 size={18} />
                                  </button>

                                  <button 
                                    onClick={() => handleDeleteReview(rev._id)}
                                    style={{ 
                                      background: 'none', 
                                      border: 'none', 
                                      color: '#A82515', 
                                      cursor: 'pointer',
                                      padding: '8px',
                                      borderRadius: '4px',
                                      transition: 'background 0.2s'
                                    }}
                                    onMouseOver={(e) => e.currentTarget.style.background = '#FCE8E6'}
                                    onMouseOut={(e) => e.currentTarget.style.background = 'none'}
                                    title="Delete review"
                                  >
                                    <Trash2 size={18} />
                                  </button>
                                </div>
                              </td>
                            </>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </>
            )}
            
          </div>
        )}

      </div>
    </div>
  );
}
