import mongoose from 'mongoose';
import { Booking } from '../models/Booking.js';
import { Room } from '../models/Room.js';

export const createBooking = async (req, res) => {
  try {
    const { roomId, guestName, guestEmail, guestPhone, checkInDate, checkOutDate, guestsCount } = req.body;

    // Validate dates
    const start = new Date(checkInDate);
    const end = new Date(checkOutDate);
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return res.status(400).json({ message: 'Invalid dates provided.' });
    }
    if (start >= end) {
      return res.status(400).json({ message: 'Check-out date must be after check-in date.' });
    }

    // Flexible room lookup: by ObjectId, by type prefix, by title, or fallback to first room
    let room = null;
    if (roomId && mongoose.Types.ObjectId.isValid(roomId)) {
      try {
        room = await Room.findById(roomId);
      } catch (err) {
        // continue to fallback
      }
    }

    if (!room && roomId) {
      const typeKey = String(roomId).split('-')[0].toLowerCase();
      room = await Room.findOne({
        $or: [
          { type: typeKey },
          { title: new RegExp(roomId, 'i') }
        ]
      });
    }

    if (!room) {
      room = await Room.findOne({});
    }

    if (!room) {
      return res.status(404).json({ message: 'Selected accommodation category not found.' });
    }

    if (guestsCount && room.maxGuests && Number(guestsCount) > room.maxGuests) {
      return res.status(400).json({ message: `Number of guests exceeds room capacity of ${room.maxGuests} people.` });
    }

    // Calculate number of nights
    const diffTime = Math.abs(end - start);
    const diffDays = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
    const pricePerNight = room.price || 2800;
    const totalAmount = pricePerNight * diffDays;

    const bookingData = {
      roomId: room._id ? room._id.toString() : String(roomId),
      roomTitle: room.title || 'Resort Room',
      guestName,
      guestEmail,
      guestPhone,
      checkInDate,
      checkOutDate,
      guestsCount: Number(guestsCount) || 1,
      totalAmount,
      status: 'Confirmed'
    };

    const newBooking = await Booking.create(bookingData);
    res.status(201).json(newBooking);
  } catch (error) {
    console.error('Booking creation error:', error);
    res.status(500).json({ message: 'Error processing booking request', error: error.message });
  }
};

export const getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({}).sort({ createdAt: -1 });
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving bookings', error: error.message });
  }
};

export const updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    if (!['Confirmed', 'Cancelled'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status value. Must be Confirmed or Cancelled.' });
    }

    const updatedBooking = await Booking.findByIdAndUpdate(
      id, 
      { status }, 
      { new: true, runValidators: true }
    );

    if (!updatedBooking) {
      return res.status(404).json({ message: 'Booking not found.' });
    }

    res.status(200).json(updatedBooking);
  } catch (error) {
    res.status(500).json({ message: 'Error updating booking status', error: error.message });
  }
};

export const deleteBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Booking.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: 'Booking not found.' });
    }
    res.status(200).json({ message: 'Booking deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting booking', error: error.message });
  }
};
