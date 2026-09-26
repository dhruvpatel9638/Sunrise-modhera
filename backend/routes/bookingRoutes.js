import express from 'express';
import { createBooking, getBookings, getBookingById, deleteBooking, updateBooking } from '../controllers/bookingController.js';

const router = express.Router();

router.route('/')
  .get(getBookings)
  .post(createBooking);

router.route('/:id')
  .get(getBookingById)
  .put(updateBooking)
  .delete(deleteBooking);

export default router;
