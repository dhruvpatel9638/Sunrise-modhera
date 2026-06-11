import React, { useState, useEffect } from 'react';
import { Calendar, Users, Home, ArrowLeft, CreditCard, ShieldCheck, CheckCircle2, Phone, Mail, User } from 'lucide-react';
import { bookingAPI } from '../utils/api';

export default function BookingPage({ rooms, initialDetails, onBackToHome }) {
  const [step, setStep] = useState(1); // 1: Reservation & Details, 2: Secure Checkout, 3: Confirmation
  const [roomId, setRoomId] = useState(initialDetails?.roomId || '');
  const [checkIn, setCheckIn] = useState(initialDetails?.checkInDate || '');
  const [checkOut, setCheckOut] = useState(initialDetails?.checkOutDate || '');
  const [guestsCount, setGuestsCount] = useState(initialDetails?.guestsCount || '2');

  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [guestPhone, setGuestPhone] = useState('');

  // Payment mock state
  const [cardNumber, setCardNumber] = useState('4111 2222 3333 4444');
  const [expiry, setExpiry] = useState('12/28');
  const [cvv, setCvv] = useState('123');

  const [selectedRoom, setSelectedRoom] = useState(null);
  const [nights, setNights] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [createdBooking, setCreatedBooking] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  
  const [isAvailable, setIsAvailable] = useState(null);
  const [checkingAvailability, setCheckingAvailability] = useState(false);

  // Auto select default room if none selected
  useEffect(() => {
    if (!roomId && rooms.length > 0) {
      setRoomId(rooms[0]._id);
    }
  }, [rooms, roomId]);

  // Update calculations when room, check-in or check-out changes
  useEffect(() => {
    const room = rooms.find(r => r._id === roomId);
    setSelectedRoom(room);

    if (checkIn && checkOut && room) {
      const start = new Date(checkIn);
      const end = new Date(checkOut);
      if (start < end) {
        const diffTime = Math.abs(end - start);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        setNights(diffDays);
        setTotalAmount(room.price * diffDays);
        setErrorMsg('');
      } else {
        setNights(0);
        setTotalAmount(0);
        if (checkIn && checkOut) {
          setErrorMsg('Check-out date must be after check-in date.');
        }
      }
    } else {
      setNights(0);
      setTotalAmount(0);
    }
    // Reset availability check if dates or room changes
    setIsAvailable(null);
  }, [roomId, checkIn, checkOut, rooms]);

  const handleCheckAvailability = () => {
    if (!roomId) {
      setErrorMsg('Please select a room category.');
      return;
    }
    if (!checkIn || !checkOut) {
      setErrorMsg('Please select check-in and check-out dates.');
      return;
    }
    if (new Date(checkIn) >= new Date(checkOut)) {
      setErrorMsg('Check-out must be after check-in.');
      return;
    }
    if (selectedRoom && Number(guestsCount) > selectedRoom.maxGuests) {
      setErrorMsg(`This room allows maximum ${selectedRoom.maxGuests} guests.`);
      return;
    }

    setErrorMsg('');
    setCheckingAvailability(true);
    
    // Simulate API call to check availability
    setTimeout(() => {
      setCheckingAvailability(false);
      if (selectedRoom && selectedRoom.availableCount > 0) {
        setIsAvailable(true);
      } else {
        setIsAvailable(false);
      }
    }, 1200);
  };

  const handleNextStep = (e) => {
    e.preventDefault();
    if (isAvailable !== true) {
      handleCheckAvailability();
      return;
    }
    setErrorMsg('');
    setStep(2);
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg('');
    try {
      const bookingData = {
        roomId,
        guestName,
        guestEmail,
        guestPhone,
        checkInDate: checkIn,
        checkOutDate: checkOut,
        guestsCount: Number(guestsCount)
      };

      const response = await bookingAPI.create(bookingData);
      setCreatedBooking(response.data);
      setStep(3);
    } catch (error) {
      console.error('Booking submission error:', error);
      setErrorMsg(error.response?.data?.message || 'Failed to submit booking. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div id="booking" style={{ paddingTop: '100px', minHeight: '100vh', background: 'transparent' }}>
      <div className="container" style={{ paddingBottom: '80px' }}>

        {/* Back Link */}
        {step !== 3 && (
          <button
            onClick={onBackToHome}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              background: 'none',
              border: 'none',
              color: 'var(--color-primary)',
              fontWeight: 600,
              cursor: 'pointer',
              marginBottom: '30px',
              fontSize: '1rem',
              transition: 'var(--transition-fast)'
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'translateX(-4px)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'translateX(0)'}
          >
            <ArrowLeft size={18} />
            <span>Return to Home Page</span>
          </button>
        )}

        <div className="text-center" style={{ marginBottom: '40px' }}>
          <h1 style={{ fontSize: '3rem', fontFamily: 'var(--font-headings)', color: 'var(--color-primary-dark)' }}>
            {step === 1 && 'Reserve Your Stay'}
            {step === 2 && 'Complete Checkout'}
            {step === 3 && 'Reservation Confirmed!'}
          </h1>
          <p style={{ color: 'var(--color-text-muted-light)', fontStyle: 'italic', marginTop: '8px' }}>
            {step === 1 && "Experience rural luxury on the banks of Pushpavati River"}
            {step === 2 && "Secure sandbox environment simulation"}
            {step === 3 && "We look forward to welcoming you to Modhera"}
          </p>
        </div>

        {errorMsg && (
          <div style={{ background: '#FCE8E6', color: '#A82515', padding: '16px 20px', borderRadius: 'var(--radius-md)', marginBottom: '24px', fontSize: '0.9rem', fontWeight: 500, maxWidth: '1000px', margin: '0 auto 24px auto' }}>
            ⚠️ {errorMsg}
          </div>
        )}

        {step !== 3 ? (
          <div className="booking-page-grid">

            {/* Left Side: Forms */}
            <div>
              {step === 1 && (
                <div className="review-form-card" style={{ background: '#FFFFFF', padding: '32px' }}>
                  <form onSubmit={handleNextStep}>
                    <h3 style={{ fontSize: '1.2rem', color: 'var(--color-primary-dark)', marginBottom: '20px', borderBottom: '1px solid var(--color-border-light)', paddingBottom: '10px' }}>
                      1. Dates & Stay Details
                    </h3>

                    <div className="form-group">
                      <label>Accommodation Category</label>
                      <select
                        className="form-input"
                        value={roomId}
                        onChange={(e) => setRoomId(e.target.value)}
                        required
                      >
                        {rooms.map(room => (
                          <option key={room._id} value={room._id}>
                            {room.title} - ₹{room.price}/night
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="grid-2">
                      <div className="form-group">
                        <label><Calendar size={14} style={{ marginRight: '4px', verticalAlign: 'middle' }} /> Check-In Date</label>
                        <input
                          type="date"
                          className="form-input"
                          value={checkIn}
                          min={new Date().toISOString().split('T')[0]}
                          onChange={(e) => setCheckIn(e.target.value)}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label><Calendar size={14} style={{ marginRight: '4px', verticalAlign: 'middle' }} /> Check-Out Date</label>
                        <input
                          type="date"
                          className="form-input"
                          value={checkOut}
                          min={checkIn || new Date().toISOString().split('T')[0]}
                          onChange={(e) => setCheckOut(e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label><Users size={14} style={{ marginRight: '4px', verticalAlign: 'middle' }} /> Guests Count</label>
                      <select
                        className="form-input"
                        value={guestsCount}
                        onChange={(e) => setGuestsCount(e.target.value)}
                      >
                        <option value="1">1 Guest</option>
                        <option value="2">2 Guests</option>
                        <option value="3">3 Guests</option>
                        <option value="4">4 Guests</option>
                      </select>
                    </div>

                    <h3 style={{ fontSize: '1.2rem', color: 'var(--color-primary-dark)', marginBottom: '20px', borderBottom: '1px solid var(--color-border-light)', paddingBottom: '10px', marginTop: '30px' }}>
                      2. Guest Information
                    </h3>

                    <div className="form-group">
                      <label>Full Name</label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="e.g. Ramesh Patel"
                        value={guestName}
                        onChange={(e) => setGuestName(e.target.value)}
                        required
                      />
                    </div>

                    <div className="grid-2">
                      <div className="form-group">
                        <label>Email Address</label>
                        <input
                          type="email"
                          className="form-input"
                          placeholder="email@example.com"
                          value={guestEmail}
                          onChange={(e) => setGuestEmail(e.target.value)}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>Phone Number</label>
                        <input
                          type="tel"
                          className="form-input"
                          placeholder="e.g. 9876543210"
                          value={guestPhone}
                          onChange={(e) => setGuestPhone(e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    {isAvailable === false && (
                      <div style={{ background: '#FCE8E6', color: '#A82515', padding: '16px 20px', borderRadius: 'var(--radius-md)', marginTop: '10px', fontSize: '0.95rem', fontWeight: 500, textAlign: 'center' }}>
                        Sorry, this room is not available for the selected dates. Please try different dates or room type.
                      </div>
                    )}

                    {isAvailable === true && (
                      <div style={{ background: 'rgba(30, 92, 53, 0.08)', color: 'var(--color-primary-dark)', padding: '16px 20px', borderRadius: 'var(--radius-md)', marginTop: '10px', fontSize: '0.95rem', fontWeight: 600, textAlign: 'center', border: '1px solid var(--color-primary)' }}>
                        <CheckCircle2 size={18} style={{ verticalAlign: 'middle', marginRight: '8px' }} />
                        Room is available! You can now proceed to payment.
                      </div>
                    )}

                    {isAvailable === true ? (
                      <button
                        type="submit"
                        className="btn btn-primary"
                        style={{ width: '100%', justifyContent: 'center', marginTop: '20px', padding: '16px' }}
                      >
                        Proceed to Secure Payment
                      </button>
                    ) : (
                      <button
                        type="button"
                        className="btn btn-primary"
                        style={{ width: '100%', justifyContent: 'center', marginTop: '20px', padding: '16px' }}
                        onClick={handleCheckAvailability}
                        disabled={checkingAvailability}
                      >
                        {checkingAvailability ? 'Checking Availability...' : 'Check Availability'}
                      </button>
                    )}
                  </form>
                </div>
              )}

              {step === 2 && (
                <div className="review-form-card" style={{ background: '#FFFFFF', padding: '32px' }}>
                  <form onSubmit={handlePaymentSubmit}>
                    <h3 style={{ fontSize: '1.2rem', color: 'var(--color-primary-dark)', marginBottom: '20px', borderBottom: '1px solid var(--color-border-light)', paddingBottom: '10px' }}>
                      Secure Card Details
                    </h3>
                    <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted-light)', marginBottom: '24px' }}>
                      Enter any mock credit card numbers to complete the checkout verification.
                    </p>

                    <div className="form-group">
                      <label>Cardholder Name</label>
                      <input type="text" className="form-input" defaultValue={guestName} required />
                    </div>

                    <div className="form-group">
                      <label>Card Number</label>
                      <input
                        type="text"
                        className="form-input"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        required
                      />
                    </div>

                    <div className="card-inputs-grid">
                      <div className="form-group">
                        <label>Expiry Date</label>
                        <input
                          type="text"
                          className="form-input"
                          placeholder="MM/YY"
                          value={expiry}
                          onChange={(e) => setExpiry(e.target.value)}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>CVV</label>
                        <input
                          type="password"
                          className="form-input"
                          placeholder="123"
                          value={cvv}
                          onChange={(e) => setCvv(e.target.value)}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>Zipcode</label>
                        <input type="text" className="form-input" placeholder="384215" required />
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '16px', marginTop: '30px' }}>
                      <button
                        type="button"
                        className="btn btn-outline"
                        style={{ flex: 1, justifyContent: 'center' }}
                        onClick={() => setStep(1)}
                        disabled={submitting}
                      >
                        Back to Details
                      </button>
                      <button
                        type="submit"
                        className="btn btn-primary"
                        style={{ flex: 2, justifyContent: 'center' }}
                        disabled={submitting}
                      >
                        {submitting ? 'Processing Payment...' : `Pay ₹${Math.round(totalAmount * 1.18)} & Confirm`}
                      </button>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '0.75rem', color: 'var(--color-text-muted-light)', marginTop: '20px' }}>
                      <ShieldCheck size={14} style={{ color: '#3B7A57' }} />
                      <span>SSL 256-Bit Encrypted sandbox simulation.</span>
                    </div>
                  </form>
                </div>
              )}
            </div>

            {/* Right Side: Stay Summary Invoice */}
            <div>
              <div
                className="review-form-card"
                style={{
                  background: '#FFFFFF',
                  padding: '24px',
                  position: 'sticky',
                  top: '100px',
                  boxShadow: 'var(--shadow-md)',
                  border: '1px solid var(--color-border-light)'
                }}
              >
                <h3 style={{ fontSize: '1.25rem', color: 'var(--color-primary-dark)', marginBottom: '16px' }}>
                  Booking Summary
                </h3>

                {selectedRoom ? (
                  <div>
                    {selectedRoom.images?.[0] && (
                      <div style={{ width: '100%', height: '140px', borderRadius: 'var(--radius-md)', overflow: 'hidden', marginBottom: '16px' }}>
                        <img
                          src={selectedRoom.images[0]}
                          alt={selectedRoom.title}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      </div>
                    )}
                    <h4 style={{ fontSize: '1.1rem', color: 'var(--color-primary-dark)', marginBottom: '6px' }}>
                      {selectedRoom.title}
                    </h4>
                    <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted-light)', marginBottom: '16px' }}>
                      {selectedRoom.description?.substring(0, 100)}...
                    </p>

                    <div style={{ borderTop: '1px solid var(--color-border-light)', paddingTop: '16px' }}>
                      <div className="price-summary-row" style={{ fontSize: '0.85rem', marginBottom: '8px' }}>
                        <span>Room Cost / Night</span>
                        <span>₹{selectedRoom.price}</span>
                      </div>
                      <div className="price-summary-row" style={{ fontSize: '0.85rem', marginBottom: '8px' }}>
                        <span>Guests Configured</span>
                        <span>{guestsCount} Guests</span>
                      </div>
                      {nights > 0 ? (
                        <>
                          <div className="price-summary-row" style={{ fontSize: '0.85rem', marginBottom: '8px' }}>
                            <span>Stay Duration</span>
                            <span>{nights} Night(s)</span>
                          </div>
                          <div className="price-summary-row" style={{ fontSize: '0.85rem', marginBottom: '8px' }}>
                            <span>Base Stay Charge</span>
                            <span>₹{selectedRoom.price * nights}</span>
                          </div>
                          <div className="price-summary-row" style={{ fontSize: '0.85rem', marginBottom: '8px' }}>
                            <span>Taxes & GST (18%)</span>
                            <span>₹{Math.round(selectedRoom.price * nights * 0.18)}</span>
                          </div>
                          <div className="price-summary-row total" style={{ fontSize: '1.2rem', fontWeight: '700', borderTop: '1px solid var(--color-border-light)', paddingTop: '12px', marginTop: '12px' }}>
                            <span>Amount Due</span>
                            <span style={{ color: 'var(--color-gold-light)' }}>₹{Math.round(totalAmount * 1.18)}</span>
                          </div>
                        </>
                      ) : (
                        <div style={{ background: 'var(--color-bg-light)', padding: '12px', borderRadius: '4px', textAlign: 'center', fontSize: '0.8rem', color: 'var(--color-text-muted-light)', marginTop: '10px' }}>
                          Select check-in/out dates to compute totals
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted-light)' }}>Loading stay summary...</p>
                )}
              </div>
            </div>
          </div>
        ) : (
          /* Confirmation Receipt Page */
          <div className="review-form-card" style={{ background: '#FFFFFF', maxWidth: '640px', margin: '0 auto', padding: '40px', textAlign: 'center' }}>
            <div className="success-icon-wrapper" style={{ marginBottom: '24px' }}>
              <CheckCircle2 size={40} />
            </div>
            <h2 style={{ fontSize: '1.8rem', color: 'var(--color-primary-dark)', marginBottom: '12px' }}>
              Reservation Confirmed!
            </h2>
            <p style={{ color: 'var(--color-text-muted-light)', marginBottom: '30px' }}>
              We have processed your booking. Your receipt details are listed below:
            </p>

            {createdBooking && (
              <div className="price-summary-box" style={{ textAlign: 'left', margin: '0 auto 30px auto' }}>
                <div className="price-summary-row">
                  <span>Reference ID</span>
                  <strong style={{ color: 'var(--color-primary)' }}>{createdBooking._id}</strong>
                </div>
                <div className="price-summary-row">
                  <span>Guest Name</span>
                  <span>{createdBooking.guestName}</span>
                </div>
                <div className="price-summary-row">
                  <span>Room Category</span>
                  <span>{createdBooking.roomTitle}</span>
                </div>
                <div className="price-summary-row">
                  <span>Stay Dates</span>
                  <span>{createdBooking.checkInDate} to {createdBooking.checkOutDate}</span>
                </div>
                <div className="price-summary-row">
                  <span>Total Occupants</span>
                  <span>{createdBooking.guestsCount} Person(s)</span>
                </div>
                <div className="price-summary-row total" style={{ borderTop: '1px solid var(--color-border-light)', paddingTop: '12px', marginTop: '12px' }}>
                  <span>Total Amount Paid</span>
                  <span>₹{Math.round(createdBooking.totalAmount * 1.18)}</span>
                </div>
              </div>
            )}

            <button
              className="btn btn-secondary"
              style={{ width: '100%', justifyContent: 'center' }}
              onClick={onBackToHome}
            >
              Return to Landing Page
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
