import express from 'express';
import { createBooking, getBookings, getBookingById, deleteBooking, updateBooking } from '../controllers/bookingController.js';
import { verifyAdminToken } from '../middleware/auth.js';

const router = express.Router();

// Public: Guests can book a room
// Protected: Only authenticated Admin can view all guest bookings
router.route('/')
  .get(verifyAdminToken, getBookings)
  .post(createBooking);

// Protected: Only authenticated Admin can manage specific bookings
router.route('/:id')
  .get(verifyAdminToken, getBookingById)
  .put(verifyAdminToken, updateBooking)
  .delete(verifyAdminToken, deleteBooking);

export default router;
