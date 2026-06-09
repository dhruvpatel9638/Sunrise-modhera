import React, { useState, useEffect } from 'react';
import { X, Calendar, CreditCard, User, Mail, Phone, Users, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { bookingAPI } from '../utils/api';

export default function BookingModal({ rooms, initialDetails, onClose, onBookingSuccess }) {
  const [step, setStep] = useState(1); // 1: Reservation Details, 2: Payment Mock, 3: Confirmation
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
  }, [roomId, checkIn, checkOut, rooms]);

  const handleNextStep = (e) => {
    e.preventDefault();
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
      onBookingSuccess();
      setStep(3);
    } catch (error) {
      console.error('Booking submission error:', error);
      setErrorMsg(error.response?.data?.message || 'Failed to submit booking. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3>
            {step === 1 && 'Reservations Detail'}
            {step === 2 && 'Secure Mock Checkout'}
            {step === 3 && 'Booking Confirmed!'}
          </h3>
          {step !== 3 && (
            <button className="modal-close-btn" onClick={onClose}>
              <X size={20} />
            </button>
          )}
        </div>

        <div className="modal-body">
          {errorMsg && (
            <div style={{ background: '#FCE8E6', color: '#A82515', padding: '12px 16px', borderRadius: 'var(--radius-md)', marginBottom: '16px', fontSize: '0.85rem', fontWeight: 500 }}>
              ⚠️ {errorMsg}
            </div>
          )}

          {step === 1 && (
            <form onSubmit={handleNextStep}>
              <div className="form-group">
                <label>Select Accommodations</label>
                <select 
                  className="form-input"
                  value={roomId} 
                  onChange={(e) => setRoomId(e.target.value)}
                  required
                >
                  {rooms.map(room => (
                    <option key={room._id} value={room._id}>
                      {room.title} - ₹{room.price}/night (Max {room.maxGuests} guests)
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
                <label><Users size={14} style={{ marginRight: '4px', verticalAlign: 'middle' }} /> Guest Count</label>
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

              <h4 style={{ fontSize: '0.9rem', borderTop: '1px solid var(--color-border-light)', paddingTop: '20px', marginTop: '20px', color: 'var(--color-primary-dark)' }}>
                Primary Guest Contact Details
              </h4>
              
              <div className="form-group" style={{ marginTop: '12px' }}>
                <label htmlFor="modal-name">Full Name</label>
                <input 
                  type="text" 
                  id="modal-name"
                  className="form-input" 
                  placeholder="e.g. Ramesh Patel"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  required 
                />
              </div>

              <div className="grid-2">
                <div className="form-group">
                  <label htmlFor="modal-email">Email Address</label>
                  <input 
                    type="email" 
                    id="modal-email"
                    className="form-input" 
                    placeholder="email@example.com"
                    value={guestEmail}
                    onChange={(e) => setGuestEmail(e.target.value)}
                    required 
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="modal-phone">Phone Number</label>
                  <input 
                    type="tel" 
                    id="modal-phone"
                    className="form-input" 
                    placeholder="e.g. 9876543210"
                    value={guestPhone}
                    onChange={(e) => setGuestPhone(e.target.value)}
                    required 
                  />
                </div>
              </div>

              {nights > 0 && selectedRoom && (
                <div className="price-summary-box">
                  <div className="price-summary-row">
                    <span>{selectedRoom.title} (x{nights} nights)</span>
                    <span>₹{selectedRoom.price} / night</span>
                  </div>
                  <div className="price-summary-row">
                    <span>Base Fare</span>
                    <span>₹{selectedRoom.price * nights}</span>
                  </div>
                  <div className="price-summary-row">
                    <span>Resort Eco Tax & GST (18%)</span>
                    <span>₹{Math.round(selectedRoom.price * nights * 0.18)}</span>
                  </div>
                  <div className="price-summary-row total">
                    <span>Total Amount</span>
                    <span>₹{Math.round(totalAmount * 1.18)}</span>
                  </div>
                </div>
              )}

              <button 
                type="submit" 
                className="btn btn-primary" 
                style={{ width: '100%', justifyContent: 'center', marginTop: '10px' }}
              >
                Proceed to Payment
              </button>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handlePaymentSubmit}>
              <div className="price-summary-box" style={{ marginTop: 0 }}>
                <div className="price-summary-row">
                  <span>Booking Accommodation</span>
                  <strong>{selectedRoom?.title}</strong>
                </div>
                <div className="price-summary-row">
                  <span>Duration</span>
                  <span>{checkIn} to {checkOut} ({nights} Nights)</span>
                </div>
                <div className="price-summary-row total">
                  <span>Payable Amount</span>
                  <span>₹{Math.round(totalAmount * 1.18)}</span>
                </div>
              </div>

              <div className="payment-box">
                <div className="payment-title">
                  <CreditCard size={18} style={{ color: 'var(--color-gold-light)' }} />
                  <span>Card Checkout Simulation</span>
                </div>
                <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted-light)', marginBottom: '16px' }}>
                  This is a mock sandbox environment. You can enter any mock card details to test.
                </p>

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
              </div>

              <div style={{ display: 'flex', gap: '16px', marginTop: '24px' }}>
                <button 
                  type="button" 
                  className="btn btn-outline" 
                  style={{ flex: 1, justifyContent: 'center' }}
                  onClick={() => setStep(1)}
                  disabled={submitting}
                >
                  Back
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary" 
                  style={{ flex: 2, justifyContent: 'center' }}
                  disabled={submitting}
                >
                  {submitting ? 'Verifying payment...' : `Pay ₹${Math.round(totalAmount * 1.18)} & Confirm`}
                </button>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '0.75rem', color: 'var(--color-text-muted-light)', marginTop: '16px' }}>
                <ShieldCheck size={14} style={{ color: '#3B7A57' }} />
                <span>SSL Encrypted transaction. No real funds will be charged.</span>
              </div>
            </form>
          )}

          {step === 3 && createdBooking && (
            <div className="success-state">
              <div className="success-icon-wrapper">
                <CheckCircle2 size={40} />
              </div>
              <h4>Reservation Confirmed!</h4>
              <p>Your room booking has been successfully recorded at the resort.</p>

              <div className="price-summary-box" style={{ textAlign: 'left' }}>
                <div className="price-summary-row">
                  <span>Booking Reference ID</span>
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
                  <span>Check-In</span>
                  <span>{createdBooking.checkInDate} (From 12:00 PM)</span>
                </div>
                <div className="price-summary-row">
                  <span>Check-Out</span>
                  <span>{createdBooking.checkOutDate} (Before 10:00 AM)</span>
                </div>
                <div className="price-summary-row">
                  <span>Guests Count</span>
                  <span>{createdBooking.guestsCount} Person(s)</span>
                </div>
                <div className="price-summary-row total">
                  <span>Paid Total Amount</span>
                  <span>₹{Math.round(createdBooking.totalAmount * 1.18)}</span>
                </div>
              </div>

              <button 
                className="btn btn-secondary" 
                style={{ width: '100%', justifyContent: 'center' }}
                onClick={onClose}
              >
                Close & Return
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
