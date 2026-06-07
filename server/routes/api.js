const express = require('express');
const router = express.Router();
const Room = require('../models/Room');
const Booking = require('../models/Booking');
const Inquiry = require('../models/Inquiry');
const Subscriber = require('../models/Subscriber');

// --- ROOMS ROUTES ---
// Get all rooms
router.get('/rooms', async (req, res) => {
  try {
    const rooms = await Room.find();
    res.json(rooms);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Seed rooms data
router.post('/rooms/seed', async (req, res) => {
  const initialRooms = [
    {
      title: 'Luxury Bhunga',
      description: 'Traditional circular dwellings reimagined with modern luxury and earthy charm, perfect for experiencing local culture with top-tier comforts.',
      image: '/images/bhunga.png',
      price: 8500,
      tags: ['Traditional', 'AC', 'Private Garden'],
      maxGuests: 2
    },
    {
      title: 'Forest Cottage',
      description: 'Minimalist wooden cottages with expansive glass walls, offering total immersion in the serene forest canopy and absolute privacy.',
      image: '/images/cottage.png',
      price: 12000,
      tags: ['Modern', 'Forest View', 'Luxury Tub'],
      maxGuests: 2
    },
    {
      title: 'Premium Tent',
      description: 'Ultra-luxurious glamping experience under the Modhera sky with five-star amenities and an outdoor deck for stargazing.',
      image: '/images/tent.png',
      price: 6500,
      tags: ['Glamping', 'Starlit Sky', 'Adventure'],
      maxGuests: 3
    }
  ];

  try {
    await Room.deleteMany(); // Clear existing
    const createdRooms = await Room.insertMany(initialRooms);
    res.json({ message: 'Rooms seeded successfully!', data: createdRooms });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add new room (Admin tool)
router.post('/rooms', async (req, res) => {
  const { title, description, image, price, tags, maxGuests } = req.body;
  const newRoom = new Room({ title, description, image, price, tags, maxGuests });
  try {
    const savedRoom = await newRoom.save();
    res.status(201).json(savedRoom);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// --- BOOKINGS ROUTES ---
// Get all bookings (Admin dashboard)
router.get('/bookings', async (req, res) => {
  try {
    const bookings = await Booking.find().populate('room').sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create booking
router.post('/bookings', async (req, res) => {
  const { roomId, guestName, guestEmail, guestPhone, checkIn, checkOut, totalPrice } = req.body;
  
  if (!roomId || !guestName || !guestEmail || !guestPhone || !checkIn || !checkOut || !totalPrice) {
    return res.status(400).json({ message: 'All booking fields are required.' });
  }

  const booking = new Booking({
    room: roomId,
    guestName,
    guestEmail,
    guestPhone,
    checkIn: new Date(checkIn),
    checkOut: new Date(checkOut),
    totalPrice: Number(totalPrice),
    status: 'Pending'
  });

  try {
    const savedBooking = await booking.save();
    const populated = await savedBooking.populate('room');
    res.status(201).json(populated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update booking status (Admin dashboard)
router.put('/bookings/:id', async (req, res) => {
  const { status } = req.body;
  if (!['Pending', 'Confirmed', 'Cancelled'].includes(status)) {
    return res.status(400).json({ message: 'Invalid booking status.' });
  }

  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found.' });

    booking.status = status;
    const updatedBooking = await booking.save();
    const populated = await updatedBooking.populate('room');
    res.json(populated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// --- INQUIRIES ROUTES ---
// Get all inquiries (Admin dashboard)
router.get('/inquiries', async (req, res) => {
  try {
    const inquiries = await Inquiry.find().sort({ createdAt: -1 });
    res.json(inquiries);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create contact inquiry
router.post('/inquiries', async (req, res) => {
  const { name, email, phone, message } = req.body;
  
  if (!name || !email || !message) {
    return res.status(400).json({ message: 'Name, email, and message are required.' });
  }

  const inquiry = new Inquiry({ name, email, phone, message });

  try {
    const savedInquiry = await inquiry.save();
    res.status(201).json(savedInquiry);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update inquiry status
router.put('/inquiries/:id', async (req, res) => {
  const { status } = req.body;
  if (!['New', 'Read', 'Replied'].includes(status)) {
    return res.status(400).json({ message: 'Invalid inquiry status.' });
  }

  try {
    const inquiry = await Inquiry.findById(req.params.id);
    if (!inquiry) return res.status(404).json({ message: 'Inquiry not found.' });

    inquiry.status = status;
    const updatedInquiry = await inquiry.save();
    res.json(updatedInquiry);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// --- NEWSLETTER SUBSCRIBERS ROUTES ---
// Get all subscribers (Admin dashboard)
router.get('/subscribers', async (req, res) => {
  try {
    const subscribers = await Subscriber.find().sort({ createdAt: -1 });
    res.json(subscribers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Subscribe to newsletter
router.post('/subscribers', async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ message: 'Email address is required.' });
  }

  try {
    // Check if already subscribed
    const existing = await Subscriber.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: 'Email is already subscribed to our newsletter.' });
    }

    const subscriber = new Subscriber({ email });
    const savedSubscriber = await subscriber.save();
    res.status(201).json(savedSubscriber);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
