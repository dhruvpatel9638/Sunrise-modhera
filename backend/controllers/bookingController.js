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

    // Find the room to calculate total amount and verify exists
    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ message: 'Selected accommodation category not found.' });
    }

    if (guestsCount > room.maxGuests) {
      return res.status(400).json({ message: `Number of guests exceeds room capacity of ${room.maxGuests} people.` });
    }

    // Calculate number of nights
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const totalAmount = room.price * diffDays;

    const bookingData = {
      roomId,
      roomTitle: room.title,
      guestName,
      guestEmail,
      guestPhone,
      checkInDate,
      checkOutDate,
      guestsCount,
      totalAmount,
      status: 'Confirmed'
    };

    const newBooking = await Booking.create(bookingData);
    res.status(201).json(newBooking);
  } catch (error) {
    res.status(500).json({ message: 'Error processing booking request', error: error.message });
  }
};

export const getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({});
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving bookings', error: error.message });
  }
};

export const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found.' });
    }
    res.status(200).json(booking);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving booking detail', error: error.message });
  }
};

export const deleteBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const booking = await Booking.findById(id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found.' });
    }
    await Booking.deleteMany({ _id: id });
    res.status(200).json({ message: 'Booking deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting booking', error: error.message });
  }
};

export const updateBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const { guestName, guestEmail, guestPhone, checkInDate, checkOutDate, guestsCount, roomTitle, totalAmount } = req.body;
    const booking = await Booking.findById(id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found.' });
    }
    
    const updated = await Booking.findByIdAndUpdate(id, {
      guestName,
      guestEmail,
      guestPhone,
      checkInDate,
      checkOutDate,
      guestsCount: guestsCount ? Number(guestsCount) : undefined,
      roomTitle,
      totalAmount: totalAmount ? Number(totalAmount) : undefined
    });
    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Error updating booking', error: error.message });
  }
};

