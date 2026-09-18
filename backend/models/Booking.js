import mongoose from 'mongoose';

const BookingSchema = new mongoose.Schema({
  roomId: { type: String, required: true },
  roomTitle: { type: String, required: true },
  guestName: { type: String, required: true },
  guestEmail: { type: String, required: true },
  guestPhone: { type: String, required: true },
  checkInDate: { type: String, required: true },
  checkOutDate: { type: String, required: true },
  guestsCount: { type: Number, required: true },
  totalAmount: { type: Number, required: true },
  status: { type: String, default: 'Confirmed' } // Confirmed, Cancelled
}, { timestamps: true });

export const Booking = mongoose.models.Booking || mongoose.model('Booking', BookingSchema);
